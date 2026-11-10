// The stand works without the venue wifi (dev@web-summit.silvio, 10 November 2026; a PROPOSAL, not registered by any page
// until Silvio says yes; hotspots are prohibited at Web Summit, so the iPad must not depend on the network).
// Served from the site root as /stand-sw.js. It keeps a copy of the stand's pages only, all of them public:
//   /xray/ (and booth mode), each prepared X-ray (/xray/<slug>/ and data/xray/<slug>/xray.json), /xray/riskmandate/,
//   /people/silvio/riskmandate-explicado/, /meet/ and each /meet/<person>/, and the same-origin scripts, styles and images
//   those pages load. Nothing else is cached (an allow-list: of data/, only the X-ray replays): no feedback or lane traffic, no other host.
// Network first, the copy only when the network fails, so online the iPad always shows the live site.
const CACHE = 'ws-stand-v1'
const PAGES = ['xray/index.html', 'xray/riskmandate/index.html', 'people/silvio/riskmandate-explicado/index.html', 'meet/index.html']
const PEOPLE = ['angelo', 'dinis', 'indi', 'jose', 'nimay', 'silvio', 'vicky']
const ROOT = new URL('./', self.location).pathname                     // where the site lives (the worker sits at its root)
const rel = u => { const p = new URL(u, self.location).pathname; return p.startsWith(ROOT) ? p.slice(ROOT.length) : null }
const STAND = p => p != null && (
    /^xray\/(index\.html)?$/.test(p) || /^xray\/[a-z0-9-]+\/(index\.html)?$/.test(p) || /^data\/xray\/[a-z0-9-]+\/xray\.json$/.test(p) ||
    /^people\/silvio\/riskmandate-explicado\/(index\.html)?$/.test(p) || /^meet\/([a-z0-9-]+\/)?(index\.html)?$/.test(p) ||
    /^assets\/.+\.(js|css|svg|png|jpe?g|webp|woff2?)$/.test(p) && !/^assets\/(feedback|obs-[a-z]+)\.json$/.test(p) || /^(people|team)\/.+\.(png|jpe?g|webp|svg)$/.test(p))
const assetsOf = html => [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m => m[1]).filter(u => !/^(https?:|mailto:|data:)/.test(u))
async function collect() {
    const c = await caches.open(CACHE), done = new Set()
    const put = async u => { const abs = new URL(u, self.location).href.split('#')[0]; if (done.has(abs) || !STAND(rel(abs))) return null; done.add(abs); const r = await fetch(abs, { cache: 'no-store' }); if (r.ok) await c.put(abs, r.clone()); return r }
    const pages = [...PAGES, ...PEOPLE.map(p => `meet/${p}/index.html`)]
    for (const p of pages) {
        const r = await put(p); if (!r) continue
        const html = await r.text(), base = new URL(p, self.location)
        for (const a of assetsOf(html)) await put(new URL(a, base).href).catch(() => {})
        if (p === 'xray/index.html') {                                     // every prepared X-ray: its page, its data, its assets
            const m = html.match(/<script[^>]*id="xray-index"[^>]*>([\s\S]*?)<\/script>/)
            for (const s of (m ? JSON.parse(m[1]) : []).filter(s => s.status === 'prepared')) {
                await put(`data/xray/${s.slug}/xray.json`).catch(() => {})
                const pr = await put(`xray/${s.slug}/index.html`).catch(() => null)
                if (pr) for (const a of assetsOf(await pr.text())) await put(new URL(a, new URL(`xray/${s.slug}/index.html`, self.location)).href).catch(() => {})
            }
        }
    }
}
self.addEventListener('install', e => { e.waitUntil(collect().then(() => self.skipWaiting())) })
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('ws-stand-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())) })
self.addEventListener('fetch', e => {
    const u = new URL(e.request.url)
    if (e.request.method !== 'GET' || u.origin !== self.location.origin || !STAND(rel(u.href))) return     // the network, untouched
    e.respondWith(fetch(e.request).then(r => { if (r.ok) caches.open(CACHE).then(c => c.put(e.request, r.clone())); return r })
        .catch(async () => (await caches.match(e.request, { ignoreSearch: true })) || (await caches.match(new URL(u.pathname.endsWith('/') ? u.pathname + 'index.html' : u.pathname, u).href, { ignoreSearch: true })) || new Response('Offline, and this page was not saved on this device.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })))
})
