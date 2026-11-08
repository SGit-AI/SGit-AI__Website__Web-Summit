const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
// the live graph's sessionless agents (backlog 00c): every agent declared as a fresh session each run is drawn, with the
// command centre's dashed ring, even one not yet on the map (between its runs, or with its commits on its workers/ branch);
// its ring lights when it has sent something in the last two hours, and dims again when it has not; at 1280 and 390 px, light and dark
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const scheme of ['dark', 'light']) {
  const p = await (await b.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/507/.test(m.text())) errs.push(m.text()) })
  let mode = 'quiet'
  await p.route('**/live.json*', async r => { const res = await r.fetch(); const L = await res.json()
    L.events = L.events.map(e => [e[0] - 3000, ...e.slice(1)])   // all two days old: no ring is lit
    if (mode === 'ran') { L.agents.push('pt:angelo:research'); const t = L.targets.indexOf('pt:angelo:desk.conductor') >= 0 ? L.targets.indexOf('pt:angelo:desk.conductor') : 0; L.events.push([Math.round((Date.now() - Date.parse(L.from)) / 6e4) - 30, L.agents.length - 1, 'x', [t], 'testfresh', 0]) }
    await r.fulfill({ response: res, json: L }) })
  const D = await (await fetch('http://127.0.0.1:8765/people/angelo/app/data.json')).json(), M = D.collab.map
  const want = M.agents.filter(a => a.kind === 'fresh').length + (M.sessionless || []).length
  await p.goto(U + '?livepoll=2#live', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-svg'); await p.waitForTimeout(800)
  const st = () => p.evaluate(() => ({ rings: document.querySelectorAll('.lv .tm-a .lv-kr').length, ids: [...document.querySelectorAll('.lv-fresh')].map(g => g.getAttribute('data-lv-id')), ran: [...document.querySelectorAll('.lv-ran')].map(g => g.getAttribute('data-lv-id')),
    dash: (() => { const k = document.querySelector('.lv .tm-a .lv-kr'); return k ? getComputedStyle(k).strokeDasharray : '' })(), scrollX: document.documentElement.scrollWidth - innerWidth }))
  const q = await st()
  mode = 'ran'; let lit = []
  for (let i = 0; i < 30 && !lit.length; i++) { await p.waitForTimeout(250); lit = (await st()).ran }
  await p.locator('.lv-frame').screenshot({ path: `${S}/lvfresh-${n}-${scheme}.png` })
  console.log(n, scheme, JSON.stringify({ want, ...q, lit }), errs)
  if (want < 3 || q.rings !== want || !q.ids.includes('pt:angelo:research') || !q.ids.includes('pt:angelo:dev.map') || q.ran.length || !/3/.test(q.dash) || lit.join() !== 'pt:angelo:research' || q.scrollX > 0 || errs.length) fail(n + ' ' + scheme)
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })()
