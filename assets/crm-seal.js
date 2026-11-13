// Sealing a CRM record in the browser (WS-217, followups@web-summit.indi, 13 November 2026): the same envelope as
// admin/tools/crm.mjs seal (ws-crm-env-1), made with WebCrypto, so a page can save a record without any secret.
//   ct  = AES-256-GCM of the record JSON (tag appended) under a fresh random key (CEK)
//   a person's entry = ws-ecies-1 of {"cek"} to their site key (data/person-keys.json): ECDH P-256 with a one-time key,
//                      HKDF-SHA256 (no salt, info "ws-ecies-1") to an AES-256-GCM key; opened by WSKeyring.open
//   an agent's entry = sgit's hybrid v2 of {"cek"} to its RSA key (data/keys.json), as assets/feedback.js seals
// Only PUBLIC keys are used. The page that calls this already holds the record in memory (it opened it with the
// person's own key). Exposes window.WSCrmSeal.seal(record, {audience, agents, personKeys, agentKeys, by}).
;(() => {
    'use strict'
    const S = globalThis.crypto.subtle, te = new TextEncoder()
    const b64 = bytes => { let s = ''; for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b); return btoa(s) }
    const unpem = pem => Uint8Array.from(atob(pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '')), c => c.charCodeAt(0))
    const rnd = n => globalThis.crypto.getRandomValues(new Uint8Array(n))
    const now = () => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')

    async function gcm(rawKey, plain) {
        const k = await S.importKey('raw', rawKey, { name: 'AES-GCM' }, false, ['encrypt']), iv = rnd(12)
        return { iv: b64(iv), ct: b64(await S.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, k, te.encode(plain))) }
    }
    async function ecies(k, plain, by) {                                    // k: one entry of data/person-keys.json
        const pub = await S.importKey('jwk', { kty: 'EC', crv: 'P-256', x: k.encrypt.x, y: k.encrypt.y, ext: true }, { name: 'ECDH', namedCurve: 'P-256' }, false, [])
        const eph = await S.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits'])
        const secret = await S.deriveBits({ name: 'ECDH', public: pub }, eph.privateKey, 256)
        const hk = await S.importKey('raw', secret, 'HKDF', false, ['deriveBits'])
        const key = await S.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: te.encode('ws-ecies-1') }, hk, 256)
        const { iv, ct } = await gcm(key, JSON.stringify(plain))
        const epk = await S.exportKey('jwk', eph.publicKey)
        return { v: 'ws-ecies-1', to: k.person, key: k.fingerprint, by, at: now(), epk: { kty: 'EC', crv: 'P-256', x: epk.x, y: epk.y }, iv, ct }
    }
    async function hybrid(pem, text) {                                      // byte-compatible with sgit pki encrypt
        const pub = await S.importKey('spki', unpem(pem), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt'])
        const aes = rnd(32), { iv, ct } = await gcm(aes, text)
        const w = await S.encrypt({ name: 'RSA-OAEP' }, pub, aes)
        return btoa(JSON.stringify({ v: 2, w: b64(w), i: iv, c: ct }))
    }
    async function seal(record, { audience, agents = [], personKeys, agentKeys = [], by }) {
        const cek = rnd(32), { iv, ct } = await gcm(cek, JSON.stringify(record)), cekMsg = { cek: b64(cek) }
        const recipients = []
        for (const p of audience) {
            const k = personKeys.find(x => x.person === p && (x.status == null || x.status === 'active'))
            if (!k) throw new Error('no active site key for ' + p)
            const env = await ecies(k, cekMsg, by); recipients.push({ to: p, key: env.key, env })
        }
        for (const id of agents) {
            const k = agentKeys.find(x => x.id === id && (x.status == null || x.status === 'active') && (x.bundle || {}).encrypt)
            if (!k) throw new Error('no active agent key ' + id)
            recipients.push({ to: id, agent: k.agent || ((k.bundle.label || '').split(' ')[0]), key: k.bundle.fingerprint, env: await hybrid(k.bundle.encrypt, JSON.stringify(cekMsg)) })
        }
        return { v: 'ws-crm-env-1', id: record.id, kind: record.type || record.kind || 'record', audience, agents, recipients, iv, ct, sealed_by: by, at: now() }
    }
    const api = Object.freeze({ seal })
    if (typeof window !== 'undefined') window.WSCrmSeal = api
    if (typeof module !== 'undefined' && module.exports) module.exports = api
})()
