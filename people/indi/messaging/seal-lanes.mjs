#!/usr/bin/env node
// Seal each team member's messaging details to their own site key (WS-203). conductor@web-summit.indi, 10 November
// 2026, at Indi's word. Reads the lanes made by issue-lanes.py (~/.sg-send/lanes/messaging.json, never committed),
// builds the JSON the PrompTugal Team app expects (MessagingVaultConfig: endpoint, vault, lanes, inboxKey, me), and
// writes it as a ws-ecies-1 envelope to data/sealed/<person>/<stamp>-team-messaging.json, in the same shape as the
// team CRM's key (admin/tools/crm.mjs: title, text, fields). The person opens it on their page of the site with the
// key in their browser. A person with no active site key gets nothing, and is listed. Nothing secret is printed.
//   node people/indi/messaging/seal-lanes.mjs
import fs from 'fs'
import os from 'os'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const AGENT = 'conductor@web-summit.indi'
const c = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.sg-send/lanes/messaging.json'), 'utf8'))
const keys = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/person-keys.json'), 'utf8')).keys.filter(k => k.status === 'active')
const team = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/messaging/groups.json'), 'utf8')).groups.team
const b64 = b => Buffer.from(b).toString('base64'), at = new Date().toISOString().replace(/\.\d+Z$/, 'Z')
const stamp = at.slice(0, 16).replace(/:/g, '') + 'Z'
function ecies(k, plain) {
    const eph = crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' })
    const secret = crypto.diffieHellman({ privateKey: eph.privateKey, publicKey: crypto.createPublicKey({ key: k.encrypt, format: 'jwk' }) })
    const key = Buffer.from(crypto.hkdfSync('sha256', secret, Buffer.alloc(0), Buffer.from('ws-ecies-1'), 32)), iv = crypto.randomBytes(12)
    const ci = crypto.createCipheriv('aes-256-gcm', key, iv), ct = Buffer.concat([ci.update(Buffer.from(JSON.stringify(plain))), ci.final(), ci.getAuthTag()])
    const epk = eph.publicKey.export({ format: 'jwk' })
    return { v: 'ws-ecies-1', to: k.person, key: k.fingerprint, by: AGENT, at, epk: { kty: 'EC', crv: 'P-256', x: epk.x, y: epk.y }, iv: b64(iv), ct: b64(ct) }
}
const sealed = [], missing = []
for (const person of team) {
    const k = keys.find(x => x.person === person)
    if (!k || !c.lanes[person]) { missing.push(person); continue }
    const config = JSON.stringify({ endpoint: c.host, vault: c.vault_id, lanes: c.lanes, inboxKey: c.enum_key, me: person })
    const plain = { title: 'Team messaging: your details for the Team app', text: `Your details for team messaging in the PrompTugal Team app (WS-203). On your iPhone or iPad, open the Team app, go to Messages, then "This iPhone's key", paste the text below, and tap "Switch messaging on". It lets you send to the team and read your own messages. Keep it private: do not share or post it. From ${AGENT}.`, fields: { 'Paste into the Team app': config } }
    const dir = path.join(ROOT, 'data/sealed', person); fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, `${stamp}-team-messaging.json`), JSON.stringify(ecies(k, plain), null, 1) + '\n')
    sealed.push(person)
}
console.log(`seal-lanes: sealed to ${sealed.join(', ') || 'nobody'}; no site key yet: ${missing.join(', ') || 'none'}`)
