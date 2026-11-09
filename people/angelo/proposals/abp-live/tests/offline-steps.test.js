const { chromium, devices } = require('playwright')
// backlog 0m, the stand's iPads (rehearsal.md section 5), for the step view (steps.htm, dev.abp@, 9 November).
// offline.test.js checks the player; this checks the step view the same way: once opened online, it still opens and plays
// with the network gone, looping and plain, from sw.js's last good copy (steps.htm, reach-runs.js, reach-runs.json);
// and online again it still fetches fresh (network first).
// Run from the repository's root while it is served on 127.0.0.1:8765 (python3 -m http.server 8765):
//   node people/angelo/proposals/abp-live/tests/offline-steps.test.js
// or against the published site, which is what the iPads will open:
//   BASE=https://web-summit.sgit.ai node people/angelo/proposals/abp-live/tests/offline-steps.test.js
const U = (process.env.BASE || 'http://127.0.0.1:8765') + '/people/angelo/proposals/abp-live/steps.htm'
;(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const mode of ['loop', 'view']) {
  const c = await b.newContext({ ...devices['iPad Pro 11 landscape'] }); const p = await c.newPage(); const errs = []
  p.on('pageerror', e => errs.push(e.message))
  await p.goto(mode === 'loop' ? `${U}?loop=1` : U, { waitUntil: 'networkidle' })
  await p.evaluate(() => navigator.serviceWorker.ready)
  const need = ['steps.htm', 'reach-runs.js', 'reach-runs.json']
  await p.waitForFunction(async need => { const k = (await (await caches.open('abp-player-v2')).keys()).map(r => r.url.split('/').pop())
   return need.every(f => k.includes(f)) }, need, { timeout: 15000 }).catch(() => fail(`${mode}: the step view's three files were not cached`))
  await c.setOffline(true)
  await p.reload({ waitUntil: 'load' }).catch(e => fail(`${mode}: reload offline: ${e.message.split('\n')[0]}`))
  await p.waitForTimeout(2500)
  const r = await p.evaluate(() => ({ empty: !document.getElementById('empty').hidden, stage: !document.getElementById('stage').hidden,
   title: document.getElementById('title').textContent, bubble: document.getElementById('bT').textContent }))
  if (r.empty || !r.stage || !r.title || !r.bubble) fail(`${mode} offline: ${JSON.stringify(r)}`)
  await c.setOffline(false)
  const fresh = await p.evaluate(async () => (await fetch('reach-runs.json', { cache: 'no-store' })).headers.get('content-type'))
  if (!/json/.test(fresh || '')) fail(`${mode}: online again, reach-runs.json not fetched: ${fresh}`)
  if (errs.length) fail(`${mode}: page errors ${JSON.stringify(errs)}`)
  console.log(`  ${mode}: offline ${JSON.stringify(r)}`)
  await c.close()
 }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL'); process.exit(ok ? 0 : 1) })()
