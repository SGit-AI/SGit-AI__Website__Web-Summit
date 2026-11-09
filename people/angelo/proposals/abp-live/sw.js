// dev.abp@PrompTugal.angelo, 8 November 2026 (backlog 0m, the stand's iPads; rehearsal.md section 5).
// The ABP player keeps working when the stand's Wi-Fi drops: network first, and the last good copy when the network fails.
// Scope: this folder only (people/angelo/proposals/abp-live/). It caches only the player, the step view and their records (labels of fake
// secrets only, never a value), never anything else, and stores nothing about the viewer. To remove it: delete this file
// and the register line in player.htm; the next visit online fetches everything fresh.
const CACHE = 'abp-player-v2'
const FILES = ['player.htm', 'runs.js', 'runs.json', 'steps.htm', 'reach-runs.js', 'reach-runs.json']
const ours = url => { const u = new URL(url); return u.origin === location.origin && FILES.some(f => u.pathname.endsWith('/abp-live/' + f)) }

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f => fetch(f, { cache: 'no-store' })
    .then(r => r.ok && c.put(f, r)).catch(() => { })))).then(() => self.skipWaiting()))
})
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('abp-player-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()))
})
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !ours(e.request.url)) return
  const key = new URL(e.request.url).pathname.split('/').pop()
  e.respondWith(fetch(e.request, { cache: 'no-store' })
    .then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(key, copy)) } return r })
    .catch(() => caches.open(CACHE).then(c => c.match(key)).then(r => r || Response.error())))
})
