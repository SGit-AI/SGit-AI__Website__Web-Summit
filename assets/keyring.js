// The person's key in this browser (Dinis, 3 November 2026): the key a conductor issues to its person
// (admin/tools/person-key.mjs) arrives as a link whose #key= fragment carries it (a fragment never reaches a server).
// This imports it as NON-EXTRACTABLE CryptoKeys into IndexedDB (a later script can use it, never copy it out), removes it
// from the address bar, and sets "who are you" to that person. It then opens what is sealed to them on the site
// (data/sealed/<id>/, ws-ecies-1) and signs what their browser sends. window.WSKeyring: { ready, person, fingerprint,
// open(envelope), sign(text), lock() }. Built by conductor@web-summit.dinis.
(() => {
    'use strict'
    const DB = 'ws-keyring', STORE = 'keys', te = new TextEncoder(), td = new TextDecoder()
    const fromB64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0))
    const toB64 = b => { let s = ''; for (const x of new Uint8Array(b)) s += String.fromCharCode(x); return btoa(s) }
    const fromB64u = s => atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4))
    const idb = () => new Promise((ok, no) => { const r = indexedDB.open(DB, 1); r.onupgradeneeded = () => r.result.createObjectStore(STORE); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error) })
    const tx = async (mode, fn) => { const db = await idb(); return new Promise((ok, no) => { const t = db.transaction(STORE, mode), s = t.objectStore(STORE), r = fn(s); t.oncomplete = () => ok(r && r.result); t.onerror = () => no(t.error) }) }
    const S = window.crypto && window.crypto.subtle
    const K = { person: '', fingerprint: '', enc: null, sig: null }

    async function importFromHash() {
        const m = location.hash.match(/(?:^#|&)key=([A-Za-z0-9_-]+)/)
        if (!m) return false
        history.replaceState(null, '', location.pathname + location.search)   // the key leaves the address bar at once
        return importPacked(m[1])
    }
    async function importPacked(packed) {
        const p = JSON.parse(fromB64u(packed))
        const jwk = ([d, x, y]) => ({ kty: 'EC', crv: 'P-256', d, x, y, ext: false })
        const enc = await S.importKey('jwk', jwk(p.e), { name: 'ECDH', namedCurve: 'P-256' }, false, ['deriveBits'])
        const sig = await S.importKey('jwk', jwk(p.s), { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign'])
        await tx('readwrite', s => s.put({ person: p.p, fingerprint: p.f, enc, sig, at: new Date().toISOString() }, 'me'))
        try { localStorage.setItem('ws.me', p.p) } catch { }
        return true
    }
    async function load() {
        if (!S || !window.indexedDB) return K
        try { await importFromHash() } catch (e) { console.warn('keyring: the key in the link could not be read', e) }
        try { const r = await tx('readonly', s => s.get('me')); if (r) Object.assign(K, r) } catch { }
        return K
    }
    async function open(env) {
        if (!K.enc) throw new Error('no key in this browser')
        if (env.key !== K.fingerprint) throw new Error(`sealed to ${env.key}, this browser holds ${K.fingerprint}`)
        const epk = await S.importKey('jwk', env.epk, { name: 'ECDH', namedCurve: 'P-256' }, false, [])
        const bits = await S.deriveBits({ name: 'ECDH', public: epk }, K.enc, 256)
        const hk = await S.importKey('raw', bits, 'HKDF', false, ['deriveKey'])
        const key = await S.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: te.encode('ws-ecies-1') }, hk, { name: 'AES-GCM', length: 256 }, false, ['decrypt'])
        return JSON.parse(td.decode(await S.decrypt({ name: 'AES-GCM', iv: fromB64(env.iv) }, key, fromB64(env.ct))))
    }
    async function sign(text) {
        if (!K.sig) throw new Error('no key in this browser')
        return toB64(await S.sign({ name: 'ECDSA', hash: 'SHA-256' }, K.sig, te.encode(text)))
    }
    async function lock() { await tx('readwrite', s => s.delete('me')); Object.assign(K, { person: '', fingerprint: '', enc: null, sig: null }) }
    // a pasted link (or the bare key): the same as opening the link
    async function add(text) {
        const m = String(text || '').trim().match(/key=([A-Za-z0-9_-]+)/) || String(text || '').trim().match(/^([A-Za-z0-9_-]{100,})$/)
        if (!m) throw new Error('that is not a key link')
        await importPacked(m[1]); const r = await tx('readonly', s => s.get('me')); if (r) Object.assign(K, r); return K.person
    }
    const ready = load()
    window.WSKeyring = { ready, open, sign, lock, add, get person() { return K.person }, get fingerprint() { return K.fingerprint } }
})()
