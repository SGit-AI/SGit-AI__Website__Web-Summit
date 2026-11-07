// Angelo's command centre, offline (WS-84 step 1; dev@web-summit.angelo, 5 November 2026, at Angelo's go: "Ok with A and
// E"). A service worker scoped to people/angelo/app/: it controls this one page and stores what the page loads, so the
// page opens on the summit's wifi, or with none. Brief: BRIEF.md beside this file; the draft: ../proposals/WS-84/.
//
// - Network first, for everything: online, the page is always current; if the network fails, or is slower than
//   WAIT_MS, the stored copy answers, and the network still refreshes the store in the background.
// - Each stored response carries the time it was stored (x-ak-stored), so the page can say "offline: the copy from…".
// - The page tells the worker what it loaded (a message), so the first visit is stored whole.
// - The two RiskMandate videos only when asked (a button), and played offline with range requests.
// - Same-origin GETs only; nothing is sent anywhere. ?offline=off on the page unregisters this and deletes its store.
'use strict'
const STORE = 'ak-offline-v1'
const WAIT_MS = 4000
let stopped = false // set by the page's off switch: store nothing more, until this worker is gone

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('ak-offline-') && k !== STORE) await caches.delete(k)
    await self.clients.claim()
})()))

// a copy of a response, stamped with when it was stored
async function stamp(res) {
    const h = new Headers(res.headers); h.set('x-ak-stored', new Date().toISOString())
    return new Response(await res.blob(), { status: res.status, statusText: res.statusText, headers: h })
}
async function put(req, res) { if (!stopped && res && res.ok && res.status === 200 && res.type === 'basic') { const c = await caches.open(STORE); await c.put(req, await stamp(res)) } }
// one stored copy per file: the release number a script carries (?v=) is not part of its key, so a new release replaces the copy
const keyOf = req => { const u = new URL(req.url); u.hash = ''; u.searchParams.delete('v'); return u.href }

// the stored copy of a range of a stored file (a video element asks for ranges)
async function ranged(req, stored) {
    const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range') || ''); if (!m) return stored
    const buf = await stored.arrayBuffer(), size = buf.byteLength
    const start = m[1] ? +m[1] : Math.max(0, size - +m[2]), end = m[1] && m[2] ? Math.min(+m[2], size - 1) : size - 1
    if (start >= size) return new Response(null, { status: 416, headers: { 'content-range': `bytes */${size}` } })
    const h = new Headers(stored.headers); h.set('content-range', `bytes ${start}-${end}/${size}`); h.set('content-length', String(end - start + 1))
    return new Response(buf.slice(start, end + 1), { status: 206, headers: h })
}

self.addEventListener('fetch', e => {
    const req = e.request
    if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return
    const key = keyOf(req)
    // videos: from the store when kept (ranges included), otherwise straight from the network, never stored by accident
    if (/\.(mp4|webm)$/.test(new URL(req.url).pathname)) {
        e.respondWith(caches.open(STORE).then(c => c.match(key)).then(s => s ? ranged(req, s) : fetch(req)))
        return
    }
    e.respondWith((async () => {
        const c = await caches.open(STORE)
        const net = fetch(req).then(async res => { await put(key, res.clone()); return res })
        const late = new Promise(r => setTimeout(r, WAIT_MS, 'late'))
        const first = await Promise.race([net.catch(() => 'down'), late])
        if (first !== 'down' && first !== 'late') return first
        const stored = await c.match(key, { ignoreSearch: false })
        if (stored) { if (first === 'late') e.waitUntil(net.catch(() => null)); return stored }
        return first === 'late' ? net : Response.error()
    })())
})

// from the page: store these URLs now (what the first visit loaded), or the videos, or forget everything
self.addEventListener('message', e => {
    const { type, urls } = e.data || {}
    if (type === 'forget') { stopped = true; e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('ak-offline-')).map(k => caches.delete(k)))).then(() => self.registration.unregister())); return }
    if (type === 'keep') e.waitUntil((async () => {
        const c = await caches.open(STORE)
        for (const u of urls || []) {
            try { const url = new URL(u, self.registration.scope); if (url.origin !== location.origin) continue; url.hash = ''; if (!(await c.match(url.href))) { const r = await fetch(url.href, { cache: 'no-cache' }); await put(url.href, r) } } catch { /* one missing file does not stop the rest */ }
        }
        if (e.source) e.source.postMessage({ type: 'kept', n: (await c.keys()).length })
    })())
})
