#!/usr/bin/env node
// vault@web-summit.jose, every run (at Jose's word, 4 November 2026): is the key that assets/feedback.json seals
// jose-inbox's messages to the key this session holds? A session key dies with its session; if the lane still names an
// old key, messages sent now cannot be opened. Prints fingerprints only (public). Not run by the build.
//   node people/jose/lanes/check-lane.mjs        exit 0: live; 1: stale or mismatched (ask dev@web-summit.dinis); 2: could not check
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../..')
const AGENT = 'vault@web-summit.jose', VAULT = 'jjrcow03'
const norm = pem => String(pem || '').replace(/\s+/g, '')
const done = (code, msg) => { console.log(`check-lane: ${msg}`); process.exit(code) }
let fb, keys
try { fb = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/feedback.json'), 'utf8')); keys = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/keys.json'), 'utf8')).keys }
catch (e) { done(2, `could not read feedback.json or keys.json (${e.message})`) }
const lane = (fb.lanes || []).find(l => l.agent === AGENT)
if (!lane) done(1, `no lane for ${AGENT} in assets/feedback.json: ask dev@web-summit.dinis to add people/jose/lanes/vault-jose.json`)
if (lane.vault_id !== VAULT) done(1, `the lane names vault ${lane.vault_id}, not ${VAULT}`)
const fp = lane.recipient && lane.recipient.fingerprint
const dir = path.join(os.homedir(), '.sg-send/keys', String(fp).replace(':', '_'))
const local = fs.existsSync(path.join(dir, 'public_key.pem')) && fs.existsSync(path.join(dir, 'private_key.pem'))
if (!local) done(1, `the lane seals to ${fp}, which this session does not hold: a dead session key. Publish this session's key and ask dev@web-summit.dinis to update the recipient block`)
if (norm(fs.readFileSync(path.join(dir, 'public_key.pem'), 'utf8')) !== norm(lane.recipient.encrypt)) done(1, `the lane's public key does not match the local key ${fp}`)
const pub = keys.find(k => k.bundle && k.bundle.fingerprint === fp)
if (!pub || norm(pub.bundle.encrypt) !== norm(lane.recipient.encrypt)) done(1, `${fp} is not on the keys page with the same public key`)
done(0, `live: jose-inbox (${VAULT}) seals to ${fp}, held by this session and published as ${pub.id}`)
