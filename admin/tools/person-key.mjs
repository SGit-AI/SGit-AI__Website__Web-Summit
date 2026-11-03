#!/usr/bin/env node
// A key a conductor issues to its person, for this session (Dinis, 3 November 2026): "the conductor creates a key for
// me ... valid for this session ... I add that to my browser ... you use that key to encrypt data that we put on the
// website ... and my browser decrypts it." The short-term step before every person holds their own key on pki.sgit.ai.
//
// Two P-256 keys, small enough for one QR code: an ECDH key (things sealed TO the person) and an ECDSA key (the
// person's browser SIGNS what it sends). The private half stays outside the repository (~/.sg-send/issued/<id>.json,
// mode 0600) and reaches the person only as a link whose #fragment carries it (a fragment is never sent to a server).
// The public half is published in data/person-keys.json. The issuing agent holds the private half too, and says so:
// it can read what is sealed to the person. A new session issues a new key; the old one is marked replaced.
//
//   node admin/tools/person-key.mjs issue --person dinis --by conductor@web-summit.dinis --session <session id>
//   node admin/tools/person-key.mjs link  --person dinis            the unlock link (and a QR as SVG, --qr <file>)
//   node admin/tools/person-key.mjs seal  --person dinis --in <plain.json> --out data/sealed/dinis/<name>.json [--by <agent>]
//   node admin/tools/person-key.mjs open  --person dinis <sealed.json>     (for the issuing agent only)
//   node admin/tools/person-key.mjs verify --person dinis --data <json> --sig <base64>   a signature from the browser
//
// The envelope (ws-ecies-1): an ephemeral P-256 key, ECDH with the person's key, HKDF-SHA256 (empty salt, info
// "ws-ecies-1") to an AES-256-GCM key; {v, to, key, epk (JWK), iv, ct} with ct = ciphertext and tag, base64.
// The same steps in the browser: assets/keyring.js. Anyone can seal to a person with the public key alone.
import fs from 'fs'
import path from 'path'
import os from 'os'
import crypto from 'crypto'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const PUB = path.join(ROOT, 'data/person-keys.json')
const STORE = path.join(os.homedir(), '.sg-send/issued')
const args = process.argv.slice(2), cmd = args[0]
const opt = k => { const i = args.indexOf('--' + k); return i > 0 ? args[i + 1] : undefined }
const fail = m => { console.error('person-key: ' + m); process.exit(1) }
const b64 = b => Buffer.from(b).toString('base64'), b64u = b => Buffer.from(b).toString('base64url')
const fp = jwk => 'sha256:' + crypto.createHash('sha256').update(`${jwk.crv}:${jwk.x}:${jwk.y}`).digest('hex').slice(0, 16)
const readPub = () => fs.existsSync(PUB) ? JSON.parse(fs.readFileSync(PUB, 'utf8')) : { about: '', keys: [] }
const current = id => readPub().keys.find(k => k.person === id && k.status === 'active') || fail(`no active key for ${id}`)
const priv = id => { const f = path.join(STORE, id + '.json'); if (!fs.existsSync(f)) fail(`no private key for ${id} in ${STORE} (it lives only in the session that issued it)`); return JSON.parse(fs.readFileSync(f, 'utf8')) }
const pubJwk = k => ({ kty: 'EC', crv: 'P-256', x: k.x, y: k.y })

function seal(person, plain, by) {
    const k = current(person), eph = crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' })
    const secret = crypto.diffieHellman({ privateKey: eph.privateKey, publicKey: crypto.createPublicKey({ key: k.encrypt, format: 'jwk' }) })
    const key = Buffer.from(crypto.hkdfSync('sha256', secret, Buffer.alloc(0), Buffer.from('ws-ecies-1'), 32)), iv = crypto.randomBytes(12)
    const c = crypto.createCipheriv('aes-256-gcm', key, iv), ct = Buffer.concat([c.update(Buffer.from(JSON.stringify(plain))), c.final(), c.getAuthTag()])
    const epk = eph.publicKey.export({ format: 'jwk' })
    return { v: 'ws-ecies-1', to: person, key: k.fingerprint, by: by || '', at: new Date().toISOString().replace(/\.\d+Z$/, 'Z'), epk: pubJwk(epk), iv: b64(iv), ct: b64(ct) }
}

function open(person, env) {
    const p = priv(person)
    if (env.key !== p.fingerprint) fail(`sealed to ${env.key}, but the key held here is ${p.fingerprint}`)
    const secret = crypto.diffieHellman({ privateKey: crypto.createPrivateKey({ key: p.encrypt, format: 'jwk' }), publicKey: crypto.createPublicKey({ key: { ...env.epk }, format: 'jwk' }) })
    const key = Buffer.from(crypto.hkdfSync('sha256', secret, Buffer.alloc(0), Buffer.from('ws-ecies-1'), 32)), buf = Buffer.from(env.ct, 'base64')
    const d = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(env.iv, 'base64')); d.setAuthTag(buf.subarray(buf.length - 16))
    return JSON.parse(Buffer.concat([d.update(buf.subarray(0, buf.length - 16)), d.final()]).toString())
}

if (cmd === 'issue') {
    const person = opt('person') || fail('--person'), by = opt('by') || fail('--by'), session = opt('session') || ''
    const gen = () => crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' }).privateKey.export({ format: 'jwk' })
    const e = gen(), s = gen(), fingerprint = fp(e), at = new Date().toISOString().replace(/\.\d+Z$/, 'Z')
    fs.mkdirSync(STORE, { recursive: true, mode: 0o700 })
    fs.writeFileSync(path.join(STORE, person + '.json'), JSON.stringify({ person, fingerprint, encrypt: e, sign: s, issued_by: by, at }, null, 2), { mode: 0o600 })
    const pub = readPub()
    pub.about = pub.about || 'Keys a conductor issues to its person for one session (admin/tools/person-key.mjs): public halves only. The issuing agent also holds the private half, so it can read what is sealed to the person; a new session issues a new key. The step before each person holds their own key on pki.sgit.ai.'
    for (const k of pub.keys) if (k.person === person && k.status === 'active') { k.status = 'replaced'; k.replaced_at = at; k.replaced_by = fingerprint }
    pub.keys.push({ person, fingerprint, signing_fingerprint: fp(s), status: 'active', issued_by: by, session, issued_at: at, valid: 'while the issuing session lives', encrypt: pubJwk(e), sign: pubJwk(s) })
    fs.writeFileSync(PUB, JSON.stringify(pub, null, 2) + '\n')
    console.log(`issued ${fingerprint} for ${person}: public half in data/person-keys.json, private half in ${path.join(STORE, person + '.json')} (never commit it)`)
} else if (cmd === 'link') {
    const person = opt('person') || fail('--person'), p = priv(person)
    const packed = b64u(JSON.stringify({ v: 1, p: person, f: p.fingerprint, e: [p.encrypt.d, p.encrypt.x, p.encrypt.y], s: [p.sign.d, p.sign.x, p.sign.y] }))
    const url = `https://web-summit.sgit.ai/#key=${packed}`
    const out = opt('qr')
    if (out) {
        const { qrcode } = await import(path.join(ROOT, 'admin/build/vendor/qrcode-generator-2.0.4.mjs'))
        const q = qrcode(0, 'M'); q.addData(url); q.make()
        fs.writeFileSync(out, q.createSvgTag({ cellSize: 6, margin: 4, scalable: true }))
        console.log(`QR written to ${out} (${url.length} characters)`)
    } else console.log(url)
} else if (cmd === 'seal') {
    const person = opt('person') || fail('--person'), inp = opt('in') || fail('--in'), out = opt('out') || fail('--out')
    const env = seal(person, JSON.parse(fs.readFileSync(inp, 'utf8')), opt('by'))
    fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, JSON.stringify(env, null, 2) + '\n')
    console.log(`sealed to ${person} (${env.key}): ${path.relative(ROOT, path.resolve(out))}`)
} else if (cmd === 'open') {
    const person = opt('person') || fail('--person'), file = args[args.length - 1]
    console.log(JSON.stringify(open(person, JSON.parse(fs.readFileSync(file, 'utf8'))), null, 2))
} else if (cmd === 'verify') {
    const person = opt('person') || fail('--person'), k = current(person)
    const ok = crypto.verify('sha256', Buffer.from(opt('data') || ''), { key: crypto.createPublicKey({ key: k.sign, format: 'jwk' }), dsaEncoding: 'ieee-p1363' }, Buffer.from(opt('sig') || '', 'base64'))
    console.log(ok ? `valid: signed by ${person}'s key ${k.signing_fingerprint}` : 'INVALID'); process.exit(ok ? 0 : 1)
} else fail('usage: issue | link | seal | open | verify (see the top of this file)')
