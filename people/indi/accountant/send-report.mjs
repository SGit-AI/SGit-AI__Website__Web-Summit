#!/usr/bin/env node
// Send the day's token report to Indi's conductor's accounts inbox (people/indi/accounting/PROTOCOL.md).
// Usage: node people/indi/accountant/send-report.mjs --report <report.json> [--agent accountant@web-summit.indi] [--dry]
// Opens this agent's lane token (sealed to its key, data/inbox/conductor-indi.json), seals the report to the
// inbox's recipient key, signed with this session's key, and POSTs it to the append lane. Never prints the token.
// The pki-agent.mjs library must match the sha256 pinned in admin/tools/seal.mjs. By accountant@web-summit.indi.
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const a = process.argv.slice(2), arg = (k, d) => { const i = a.indexOf('--' + k); return i < 0 ? d : (a[i + 1] ?? true) }
const die = m => { console.error('send-report: ' + m); process.exit(1) }
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../..')
const agent = arg('agent', 'accountant@web-summit.indi'), reportFile = arg('report')
if (!reportFile || !fs.existsSync(reportFile)) die('give --report <file.json>')
const report = fs.readFileSync(reportFile, 'utf8'); JSON.parse(report)

// the pinned library half of pki-agent.mjs, as admin/tools/seal.mjs loads it
const PIN = (fs.readFileSync(path.join(ROOT, 'admin/tools/seal.mjs'), 'utf8').match(/'([0-9a-f]{64})'/) || [])[1]
const file = process.env.PKI_AGENT || path.join(os.homedir(), '.sg-send/tools/pki-agent.mjs')
if (!fs.existsSync(file)) die(`no pki-agent.mjs at ${file} (set PKI_AGENT)`)
const src = fs.readFileSync(file, 'utf8')
if (crypto.createHash('sha256').update(src).digest('hex') !== PIN) die('pki-agent.mjs does not match the pinned sha256')
const cut = src.indexOf('// ---------------------------------------------------------------- the tool')
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sr-')), lib = path.join(tmp, 'lib.mjs')
fs.writeFileSync(lib, src.slice(0, cut) + '\nexport { __keys }\n')
const { __keys: K } = await import(lib); fs.rmSync(tmp, { recursive: true, force: true })

// this session's key, found by its label
const KEYS = path.join(os.homedir(), '.sg-send/keys')
const dir = fs.readdirSync(KEYS).find(d => { try { return JSON.parse(fs.readFileSync(path.join(KEYS, d, 'metadata.json'))).label === agent } catch { return false } })
if (!dir) die(`no key labelled ${agent} in ${KEYS}`)
const meta = JSON.parse(fs.readFileSync(path.join(KEYS, dir, 'metadata.json')))
const id = await K.importKeystore({ privateKeyPem: fs.readFileSync(path.join(KEYS, dir, 'private_key.pem'), 'utf8'), signingPrivatePem: fs.readFileSync(path.join(KEYS, dir, 'signing_private.pem'), 'utf8'), label: meta.label, created: meta.created })

// the lane
const inbox = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/inbox/conductor-indi.json'), 'utf8'))
const lane = inbox.lanes.find(l => l.to === meta.encryption_fingerprint || l.agent === agent)
if (!lane) die(`no lane for ${agent} yet: tell conductor@web-summit.indi in a commit`)
// the conductor's public signing key, from the keys page (the inbox file names only its fingerprint)
const signer = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/keys.json'), 'utf8')).keys.map(k => k.bundle).find(b => b && b.signing_fingerprint === inbox.recipient.signing_fingerprint)
const opened = await K.unseal(id.private.encrypt, lane.sealed_token, signer ? [signer] : [])
if (!opened.signed || opened.verified !== true) die('the lane token is not verified as signed by ' + inbox.recipient.signing_fingerprint)
const token = opened.text.trim()
const enc = await K.seal(inbox.recipient, report, { sign: id.private.sign, fingerprint: meta.signing_fingerprint })
if (arg('dry')) { console.log(`dry: lane ${lane.key_id}, envelope ${enc.length} chars, token signed: ${opened.signed}, verified: ${opened.verified}`); process.exit(0) }
const r = await fetch(`${inbox.endpoint}/api/vault/append/write/${inbox.vault_id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ append_token: token, payload: Buffer.from(enc).toString('base64') }) })
console.log(`send-report: lane ${lane.key_id}, HTTP ${r.status}, ${(await r.text()).slice(0, 80)}`)
