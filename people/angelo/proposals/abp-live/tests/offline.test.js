const { chromium, devices } = require('playwright')
// backlog 0m, the stand's iPads (rehearsal.md section 5): once the player has been opened online, it still opens and plays
// with the network gone, in both modes, from sw.js's last good copy; and online it still fetches fresh (network first).
// Run from the repository's root while it is served on 127.0.0.1:8765 (python3 -m http.server 8765):
//   node people/angelo/proposals/abp-live/tests/offline.test.js
const U = (process.env.BASE || 'http://127.0.0.1:8765') + '/people/angelo/proposals/abp-live/player.htm'
;(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const mode of ['loop', 'interactive']) {
  const c = await b.newContext({ ...devices['iPad Pro 11 landscape'] }); const p = await c.newPage(); const errs = []
  p.on('pageerror', e => errs.push(e.message))
  await p.goto(`${U}?mode=${mode}`, { waitUntil: 'networkidle' })
  await p.evaluate(() => navigator.serviceWorker.ready)
  await p.waitForFunction(async () => (await (await caches.open('abp-player-v2')).keys()).length === 6, null, { timeout: 10000 }).catch(() => fail(`${mode}: the six files were not cached`))
  await c.setOffline(true)
  await p.reload({ waitUntil: 'load' }).catch(e => fail(`${mode}: reload offline: ${e.message.split('\n')[0]}`))
  await p.waitForTimeout(2500)
  const r = await p.evaluate(mode => ({ empty: !document.getElementById('empty').hidden,
   shown: !document.getElementById(mode === 'loop' ? 'loop' : 'inter').hidden,
   title: mode === 'loop' ? document.getElementById('lTitle').textContent : document.querySelectorAll('#cards .card:not([disabled])').length,
   runs: (window.ABP_RUNS || { runs: [] }).runs.length }), mode)
  if (r.empty || !r.shown || !r.title || !r.runs) fail(`${mode} offline: ${JSON.stringify(r)}`)
  await c.setOffline(false)
  const fresh = await p.evaluate(async () => (await fetch('runs.json', { cache: 'no-store' })).headers.get('content-type'))
  if (!/json/.test(fresh || '')) fail(`${mode}: online again, runs.json not fetched: ${fresh}`)
  if (errs.length) fail(`${mode}: page errors ${JSON.stringify(errs)}`)
  console.log(`  ${mode}: offline ${JSON.stringify(r)}`)
  await c.close()
 }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL'); process.exit(ok ? 0 : 1) })()
