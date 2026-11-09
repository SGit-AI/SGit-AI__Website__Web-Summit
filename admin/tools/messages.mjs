#!/usr/bin/env node
// Team messaging for agents (WS-203, the plan: content/messaging.md): seal, sign, send and open Messaging-FS and
// Email-FS messages between people, devices and agents. Written by prompter@web-summit.indi for Indi's team, 9 November 2026.
// The formats and the envelope are specified in people/indi/messaging/FORMATS.md; the iOS team app implements the same.
//
// The envelope (ws-msg-env-1), the CRM's pattern (admin/tools/crm.mjs, ws-crm-env-1) plus a sender's signature:
//   {v, id, thread, recipients: [{to, key, env}], iv, ct, by, sig}
//   ct   = AES-256-GCM (tag appended) of the message JSON under a fresh content key (CEK), once per message;
//   env  = the CEK sealed to one reader: ws-ecies-1 to a P-256 key (a person's site key, a device key; the same steps as
//          admin/tools/person-key.mjs and assets/keyring.js), or sgit's hybrid v2 to an agent's RSA key (data/keys.json);
//   by   = the sender's signing fingerprint; sig = ECDSA P-256 / SHA-256, raw r||s (64 bytes), base64, over the
//          signed string (see signedString) so neither the content nor the list of readers can be changed.
// Opening checks the signature against the published keys AND that the signer is the message's "from"; a message that
// fails either is refused, never shown.
//
//   node admin/tools/messages.mjs whoami
//   node admin/tools/messages.mjs send --to indi,conductor@web-summit.indi [--group stand] --text "..."
//        [--email --subject "..."] [--thread <id>] [--reply-to <id>] --lane-dir <dir> | --out <file>
//   node admin/tools/messages.mjs open <file.json | lane dir> [--store ~/.sg-send/messages]
// Identity: an agent's own session key (~/.sg-send/keys/, pki-agent.mjs keygen --session); its name from AGENT=.
// Transport: --lane-dir appends one JSON line per reader to <dir>/<reader>.jsonl (local and tests). The shared messaging
// vault's append lanes (POST <endpoint>/api/vault/append/write/<vault_id>, as admin/tools/inbox.py) come once that vault
// exists: data/messaging/vault.json. Never a key, token or message text in this repository.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const rj = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const b64 = b => Buffer.from(b).toString('base64')
const ub64 = s => Buffer.from(s, 'base64')
const now = () => new Date().toISOString().replace(/\.\d+Z$/, 'Z')
const fail = m => { console.error('messages: ' + m); process.exit(1) }
const KEYS = process.env.MSG_KEYS || path.join(ROOT, 'data/keys.json')
const PEOPLE = process.env.MSG_PEOPLE || path.join(ROOT, 'data/person-keys.json')
const DEVICES = process.env.MSG_DEVICES || path.join(ROOT, 'data/messaging/device-keys.json')
const GROUPS = path.join(ROOT, 'data/messaging/groups.json')
const HOME = process.env.PKI_AGENT_HOME || path.join(os.homedir(), '.sg-send')

// ---------- the directory: who can be written to, and which keys speak for whom ----------
const active = k => k.status == null || /^active\b/.test(String(k.status))
const agentOf = k => k.agent || ((k.bundle || {}).label || k.label || '').split(' ')[0]
function directory() {
    const agents = fs.existsSync(KEYS) ? rj(KEYS).keys.filter(k => active(k) && (k.bundle || {}).encrypt) : []
    const people = fs.existsSync(PEOPLE) ? rj(PEOPLE).keys.filter(active) : []
    const devices = fs.existsSync(DEVICES) ? rj(DEVICES).keys.filter(active) : []
    return {
        // readers of a name: a person reads on their site key and every device key; an agent on its session key(s)
        readers(name) {
            if (name.includes('@')) return agents.filter(k => agentOf(k) === name).map(k => ({ to: name, key: k.bundle.fingerprint, kind: 'rsa', pub: k.bundle.encrypt }))
            return [...people.filter(k => k.person === name).map(k => ({ to: name, key: k.fingerprint, kind: 'ec', pub: k.encrypt })),
                    ...devices.filter(k => k.person === name).map(k => ({ to: name, key: k.fingerprint, kind: 'ec', pub: k.encrypt, device: k.device }))]
        },
        // the identity a signing fingerprint speaks for, and its public key
        signer(fp) {
            const a = agents.find(k => k.bundle.signing_fingerprint === fp); if (a) return { name: agentOf(a), pub: crypto.createPublicKey(a.bundle.sign) }
            const p = [...people, ...devices].find(k => k.signing_fingerprint === fp); if (p) return { name: p.person, pub: crypto.createPublicKey({ key: p.sign, format: 'jwk' }) }
            return null
        },
    }
}
const groupMembers = g => { const G = fs.existsSync(GROUPS) ? rj(GROUPS).groups || {} : {}; return G[g] || fail(`no group "${g}" in data/messaging/groups.json`) }

// ---------- my identity: the session key made by pki-agent.mjs keygen --session ----------
function me() {
    const dir = process.env.MSG_KEYDIR || (() => {
        const ks = fs.existsSync(path.join(HOME, 'keys')) ? fs.readdirSync(path.join(HOME, 'keys')) : []
        if (ks.length !== 1) fail(`expected one key in ${HOME}/keys (found ${ks.length}); set MSG_KEYDIR`)
        return path.join(HOME, 'keys', ks[0])
    })()
    const meta = rj(path.join(dir, 'metadata.json'))
    const name = process.env.AGENT || process.env.MSG_AS || meta.label
    const kind = fs.existsSync(path.join(dir, 'private_key.pem')) ? 'rsa' : 'ec'
    const enc = kind === 'rsa' ? crypto.createPrivateKey(fs.readFileSync(path.join(dir, 'private_key.pem'))) : crypto.createPrivateKey({ key: rj(path.join(dir, 'encrypt.jwk')), format: 'jwk' })
    const sign = fs.existsSync(path.join(dir, 'signing_private.pem')) ? crypto.createPrivateKey(fs.readFileSync(path.join(dir, 'signing_private.pem'))) : crypto.createPrivateKey({ key: rj(path.join(dir, 'sign.jwk')), format: 'jwk' })
    return { name, kind, enc, sign, fingerprint: meta.encryption_fingerprint, signing_fingerprint: meta.signing_fingerprint }
}

// ---------- sealing the content key to one reader ----------
function sealCek(r, cek) {
    const plain = Buffer.from(JSON.stringify({ cek: b64(cek) }))
    if (r.kind === 'rsa') {   // sgit's hybrid v2 (PKI__Crypto.hybrid_encrypt), so `sgit pki decrypt` opens it too
        const k = crypto.randomBytes(32), iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', k, iv)
        const ct = Buffer.concat([c.update(plain), c.final(), c.getAuthTag()])
        const w = crypto.publicEncrypt({ key: crypto.createPublicKey(r.pub), padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' }, k)
        return { v: 'sgit-hybrid-2', payload: b64(JSON.stringify({ v: 2, w: b64(w), i: b64(iv), c: b64(ct) })) }
    }
    // ws-ecies-1: an ephemeral P-256 key, ECDH, HKDF-SHA256 (empty salt, info "ws-ecies-1"), AES-256-GCM
    const eph = crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' })
    const secret = crypto.diffieHellman({ privateKey: eph.privateKey, publicKey: crypto.createPublicKey({ key: r.pub, format: 'jwk' }) })
    const key = Buffer.from(crypto.hkdfSync('sha256', secret, Buffer.alloc(0), Buffer.from('ws-ecies-1'), 32)), iv = crypto.randomBytes(12)
    const c = crypto.createCipheriv('aes-256-gcm', key, iv), ct = Buffer.concat([c.update(plain), c.final(), c.getAuthTag()])
    const epk = eph.publicKey.export({ format: 'jwk' })
    return { v: 'ws-ecies-1', epk: { kty: 'EC', crv: 'P-256', x: epk.x, y: epk.y }, iv: b64(iv), ct: b64(ct) }
}
function openCek(env, mine) {
    let plain
    if (env.v === 'sgit-hybrid-2') {
        const p = JSON.parse(ub64(env.payload).toString())
        const k = crypto.privateDecrypt({ key: mine.enc, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' }, ub64(p.w))
        plain = gcmOpen(k, ub64(p.i), ub64(p.c))
    } else if (env.v === 'ws-ecies-1') {
        const secret = crypto.diffieHellman({ privateKey: mine.enc, publicKey: crypto.createPublicKey({ key: env.epk, format: 'jwk' }) })
        plain = gcmOpen(Buffer.from(crypto.hkdfSync('sha256', secret, Buffer.alloc(0), Buffer.from('ws-ecies-1'), 32)), ub64(env.iv), ub64(env.ct))
    } else throw new Error(`unknown key envelope ${env.v}`)
    return ub64(JSON.parse(plain.toString()).cek)
}
function gcmOpen(key, iv, buf) {
    const d = crypto.createDecipheriv('aes-256-gcm', key, iv); d.setAuthTag(buf.subarray(buf.length - 16))
    return Buffer.concat([d.update(buf.subarray(0, buf.length - 16)), d.final()])
}

// ---------- the envelope ----------
// The signed string: every field that matters, in a fixed order, one per line. iOS builds the same bytes.
const signedString = e => ['ws-msg-env-1', e.id, e.thread, e.iv, e.ct, ...e.recipients.map(r => `${r.to} ${r.key}`)].join('\n')

export function seal(message, readers, mine) {
    const cek = crypto.randomBytes(32), iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', cek, iv)
    const ct = Buffer.concat([c.update(Buffer.from(JSON.stringify(message))), c.final(), c.getAuthTag()])
    const e = { v: 'ws-msg-env-1', id: message.id, thread: message.thread, recipients: readers.map(r => ({ to: r.to, key: r.key, env: sealCek(r, cek) })), iv: b64(iv), ct: b64(ct), by: mine.signing_fingerprint }
    e.sig = b64(crypto.sign('sha256', Buffer.from(signedString(e)), { key: mine.sign, dsaEncoding: 'ieee-p1363' }))
    return e
}

export function open(e, mine, dir = directory()) {
    if (e.v !== 'ws-msg-env-1') throw new Error(`not a ws-msg-env-1 envelope (${e.v})`)
    const signer = dir.signer(e.by)
    if (!signer) throw new Error(`signed by ${e.by}, which is on no published key list`)
    if (!crypto.verify('sha256', Buffer.from(signedString(e)), { key: signer.pub, dsaEncoding: 'ieee-p1363' }, ub64(e.sig))) throw new Error('the signature does not match: refused')
    const mineEntry = e.recipients.find(r => r.key === mine.fingerprint)
    if (!mineEntry) throw new Error(`not sealed to this key (${mine.fingerprint})`)
    const msg = JSON.parse(gcmOpen(openCek(mineEntry.env, mine), ub64(e.iv), ub64(e.ct)).toString())
    if (msg.from !== signer.name) throw new Error(`says it is from ${msg.from} but was signed by ${signer.name}: refused`)
    if (msg.id !== e.id || msg.thread !== e.thread) throw new Error('the id or thread outside does not match the message inside: refused')
    return { message: msg, signer: signer.name }
}

// ---------- Messaging-FS and Email-FS ----------
const KINDS = ['text', 'image', 'audio', 'markdown', 'link', 'location', 'miniapp']
export function chat({ from, to, thread, text, kind = 'text', reply_to = null, attachments = [] }) {
    if (!KINDS.includes(kind)) fail(`kind must be one of ${KINDS.join(', ')}`)
    return { format: 'messaging-fs/1', id: crypto.randomUUID(), thread, from, to, at: now(), kind, text, attachments, reply_to }
}
export function email({ from, to, thread, subject, text, reply_to = null }) {
    const id = crypto.randomUUID(), at = now()
    const eml = [`From: ${from}`, `To: ${to.join(', ')}`, `Subject: ${subject}`, `Date: ${new Date(at).toUTCString()}`, `Message-ID: <${id}@team.web-summit.sgit.ai>`,
        ...(reply_to ? [`In-Reply-To: <${reply_to}@team.web-summit.sgit.ai>`] : []), 'MIME-Version: 1.0', 'Content-Type: text/plain; charset=utf-8', '', text].join('\r\n')
    const card = { from, to, subject, date: at, thread, sha256: crypto.createHash('sha256').update(eml).digest('hex') }
    return { format: 'email-fs/1', id, thread, from, to, at, kind: 'email', card, eml, reply_to }
}
const threadFor = (from, to, group) => group ? `group:${group}` : 'dm:' + [from, ...to].sort().join('+')

// ---------- the command line ----------
const argv = process.argv.slice(2), cmd = argv[0], flags = {}
for (let i = 1; i < argv.length; i++) if (argv[i].startsWith('--')) { const k = argv[i].slice(2); flags[k] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true } else (flags._ ||= []).push(argv[i])

if (import.meta.url === `file://${process.argv[1]}`) {
    if (cmd === 'whoami') { const m = me(); console.log(JSON.stringify({ name: m.name, key: m.fingerprint, signs_as: m.signing_fingerprint }, null, 1)) }
    else if (cmd === 'send') {
        const m = me(), dir = directory()
        const to = flags.group ? groupMembers(flags.group).filter(x => x !== m.name) : String(flags.to || fail('--to <names> or --group <name>')).split(',').map(s => s.trim()).filter(Boolean)
        const readers = [...to, m.name].flatMap(n => { const r = dir.readers(n); if (!r.length && n !== m.name) fail(`no published key for ${n}`); return r })
        const thread = flags.thread || threadFor(m.name, to, flags.group)
        const msg = flags.email ? email({ from: m.name, to, thread, subject: flags.subject || fail('--subject for an email'), text: String(flags.text || fail('--text')), reply_to: flags['reply-to'] || null })
                                : chat({ from: m.name, to, thread, text: String(flags.text || fail('--text')), reply_to: flags['reply-to'] || null })
        const e = seal(msg, readers, m)
        if (flags.out) fs.writeFileSync(flags.out, JSON.stringify(e, null, 1))
        else if (flags['lane-dir']) { fs.mkdirSync(flags['lane-dir'], { recursive: true }); for (const n of new Set(to)) fs.appendFileSync(path.join(flags['lane-dir'], n + '.jsonl'), JSON.stringify(e) + '\n') }
        else fail('the shared messaging vault does not exist yet: use --lane-dir <dir> or --out <file> (data/messaging/vault.json, once made)')
        console.log(`sent ${msg.kind} ${msg.id} on ${thread} to ${to.join(', ')}: sealed to ${readers.length} key(s), signed ${m.signing_fingerprint}`)
    } else if (cmd === 'open') {
        const m = me(), src = (flags._ || [])[0] || fail('open <file | lane dir>'), store = flags.store || path.join(HOME, 'messages')
        const lines = fs.statSync(src).isDirectory() ? (fs.existsSync(path.join(src, m.name + '.jsonl')) ? fs.readFileSync(path.join(src, m.name + '.jsonl'), 'utf8').split('\n').filter(Boolean) : []) : [fs.readFileSync(src, 'utf8')]
        const doneF = path.join(store, 'processed.json'), done = new Set(fs.existsSync(doneF) ? rj(doneF) : [])
        let n = 0
        for (const l of lines) {
            const e = JSON.parse(l); if (done.has(e.id)) continue
            try {
                const { message, signer } = open(e, m)
                const f = path.join(store, message.thread.replace(/[^a-z0-9:+@._-]/gi, '_'), message.id + '.json')
                fs.mkdirSync(path.dirname(f), { recursive: true, mode: 0o700 }); fs.writeFileSync(f, JSON.stringify(message, null, 1), { mode: 0o600 })
                console.log(`${message.at} ${signer} → ${message.to.join(', ')} [${message.thread}] ${message.kind === 'email' ? 'Subject: ' + message.card.subject : message.text}`)
                done.add(e.id); n++
            } catch (err) { console.log(`refused ${e.id}: ${err.message}`) }
        }
        fs.mkdirSync(store, { recursive: true, mode: 0o700 }); fs.writeFileSync(doneF, JSON.stringify([...done]))
        console.log(`${n} new message(s) opened and verified; stored in ${store}`)
    } else console.log('usage: whoami | send --to <names> | --group <g> --text "..." [--email --subject S] (--lane-dir D | --out F) | open <file | lane dir>')
}
