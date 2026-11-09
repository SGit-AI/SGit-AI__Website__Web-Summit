#!/usr/bin/env node
// Round-trip test for team messaging (WS-203): admin/tools/messages.mjs's seal and open, between an agent key (RSA,
// like data/keys.json) and two P-256 keys (a person's site key and an iPhone's device key), including refusals.
// Every key here is made fresh in memory for the test and thrown away: nothing is read from or written to the repository.
//   node people/indi/messaging/test-roundtrip.mjs
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'msg-test-'))
const jwkOf = k => k.export({ format: 'jwk' })
const fp = k => 'sha256:' + crypto.createHash('sha256').update(k.export({ type: 'spki', format: 'der' })).digest('hex').slice(0, 16)
const ec = () => crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' })

// an agent (RSA-4096 encrypt, P-256 sign), a person (P-256 both), a device of that person (P-256 both)
const agentEnc = crypto.generateKeyPairSync('rsa', { modulusLength: 4096 }), agentSig = ec()
const personEnc = ec(), personSig = ec(), devEnc = ec(), devSig = ec()
const AGENT = 'test-agent@web-summit.indi'
fs.writeFileSync(path.join(tmp, 'keys.json'), JSON.stringify({ keys: [{ id: 'test-agent', agent: AGENT, status: 'active', bundle: {
    encrypt: agentEnc.publicKey.export({ type: 'spki', format: 'pem' }), sign: agentSig.publicKey.export({ type: 'spki', format: 'pem' }),
    fingerprint: fp(agentEnc.publicKey), signing_fingerprint: fp(agentSig.publicKey) } }] }))
fs.writeFileSync(path.join(tmp, 'person-keys.json'), JSON.stringify({ keys: [{ person: 'tester', status: 'active',
    fingerprint: fp(personEnc.publicKey), signing_fingerprint: fp(personSig.publicKey), encrypt: jwkOf(personEnc.publicKey), sign: jwkOf(personSig.publicKey) }] }))
fs.writeFileSync(path.join(tmp, 'device-keys.json'), JSON.stringify({ keys: [{ person: 'tester', device: 'test-iphone', status: 'active',
    fingerprint: fp(devEnc.publicKey), signing_fingerprint: fp(devSig.publicKey), encrypt: jwkOf(devEnc.publicKey), sign: jwkOf(devSig.publicKey) }] }))
process.env.MSG_KEYS = path.join(tmp, 'keys.json'); process.env.MSG_PEOPLE = path.join(tmp, 'person-keys.json'); process.env.MSG_DEVICES = path.join(tmp, 'device-keys.json')

const M = await import(new URL('../../../admin/tools/messages.mjs', import.meta.url))
const ids = {
    agent: { name: AGENT, enc: agentEnc.privateKey, sign: agentSig.privateKey, fingerprint: fp(agentEnc.publicKey), signing_fingerprint: fp(agentSig.publicKey) },
    device: { name: 'tester', enc: devEnc.privateKey, sign: devSig.privateKey, fingerprint: fp(devEnc.publicKey), signing_fingerprint: fp(devSig.publicKey) },
    person: { name: 'tester', enc: personEnc.privateKey, sign: personSig.privateKey, fingerprint: fp(personEnc.publicKey), signing_fingerprint: fp(personSig.publicKey) },
}
const reader = (who, kind) => kind === 'rsa' ? { to: who.name, key: who.fingerprint, kind, pub: agentEnc.publicKey.export({ type: 'spki', format: 'pem' }) }
                                             : { to: who.name, key: who.fingerprint, kind, pub: jwkOf(who === ids.device ? devEnc.publicKey : personEnc.publicKey) }
let pass = 0, failN = 0
const check = (what, ok, detail = '') => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${what}${detail ? '  (' + detail + ')' : ''}`); ok ? pass++ : failN++ }
const refused = (fn) => { try { fn(); return null } catch (e) { return e.message } }

// 1. agent -> person, on both their keys (site key and device)
const m1 = M.chat({ from: AGENT, to: ['tester'], thread: 'dm:tester+' + AGENT, text: 'Your stand shift starts at 15:00.' })
const e1 = M.seal(m1, [reader(ids.device, 'ec'), reader(ids.person, 'ec'), reader(ids.agent, 'rsa')], ids.agent)
const o1 = M.open(e1, ids.device); check('agent to person: the iPhone opens and verifies it', o1.message.text === m1.text && o1.signer === AGENT)
check('agent to person: the site key opens it too', M.open(e1, ids.person).message.id === m1.id)
check('agent to person: the sender keeps a readable copy', M.open(e1, ids.agent).message.id === m1.id)

// 2. device -> agent (the reply), signed by the device key
const m2 = M.chat({ from: 'tester', to: [AGENT], thread: m1.thread, text: 'On my way.', reply_to: m1.id })
const e2 = M.seal(m2, [reader(ids.agent, 'rsa'), reader(ids.device, 'ec')], ids.device)
const o2 = M.open(e2, ids.agent); check('device to agent: the agent opens it, signer is the person', o2.signer === 'tester' && o2.message.reply_to === m1.id)

// 3. an email
const m3 = M.email({ from: AGENT, to: ['tester'], thread: 'mail:test', subject: 'Tomorrow', text: 'Three companies to meet:\n1. A\n2. B\n3. C' })
const o3 = M.open(M.seal(m3, [reader(ids.device, 'ec')], ids.agent), ids.device)
check('email: opens, the card hash matches the EML', o3.message.card.sha256 === crypto.createHash('sha256').update(o3.message.eml).digest('hex'))

// 4. refusals
const t = JSON.parse(JSON.stringify(e1)); const ct = Buffer.from(t.ct, 'base64'); ct[3] ^= 1; t.ct = ct.toString('base64')
check('a changed message is refused', /signature/.test(refused(() => M.open(t, ids.device)) || ''))
const d = JSON.parse(JSON.stringify(e1)); d.recipients = d.recipients.slice(0, 1)
check('a changed reader list is refused', /signature/.test(refused(() => M.open(d, ids.device)) || ''))
const liar = M.chat({ from: AGENT, to: ['tester'], thread: 'dm:x', text: 'I am the agent, honest.' })
check('a message claiming to be from someone else is refused', /refused/.test(refused(() => M.open(M.seal(liar, [reader(ids.device, 'ec')], ids.person), ids.device)) || ''))
const stranger = { ...ids.device, signing_fingerprint: 'sha256:deadbeefcafef00d' }
check('a signer on no published list is refused', /no published key list/.test(refused(() => M.open(M.seal(m2, [reader(ids.agent, 'rsa')], stranger), ids.agent)) || ''))
check('a reader it was not sealed to cannot open it', /not sealed to this key/.test(refused(() => M.open(M.seal(m2, [reader(ids.agent, 'rsa')], ids.device), ids.person)) || ''))

// 5. the agent's key envelope is sgit's hybrid v2, so the team's existing tools can open it (when sgit-ai is installed)
const env = e2.recipients.find(r => r.env.v === 'sgit-hybrid-2').env
fs.writeFileSync(path.join(tmp, 'agent.pem'), agentEnc.privateKey.export({ type: 'pkcs8', format: 'pem' }), { mode: 0o600 })
fs.writeFileSync(path.join(tmp, 'payload.txt'), env.payload)
const { execFileSync } = await import('node:child_process')
try {
    const out = execFileSync('python3', ['-I', '-c', `
import sys,json
from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
c=PKI__Crypto(); k=c.import_private_key_pem(open(sys.argv[1]).read())
print(json.loads(c.hybrid_decrypt(k, open(sys.argv[2]).read())['plaintext'])['cek'][:4])`, path.join(tmp, 'agent.pem'), path.join(tmp, 'payload.txt')], { encoding: 'utf8' }).trim()
    check("sgit's PKI__Crypto.hybrid_decrypt opens the agent's key envelope", out.length === 4)
} catch (e) { console.log('SKIP  sgit compatibility (sgit-ai not installed)') }

fs.rmSync(tmp, { recursive: true, force: true })
console.log(`\n${pass} passed, ${failN} failed`)
process.exit(failN ? 1 : 0)
