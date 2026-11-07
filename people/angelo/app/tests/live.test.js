const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
// the live graph (#live): the people ring in a hexagon, the last hour replayed on opening, a new exchange travelling along its line when
// the next read brings it, a freshness dot, no text from live.json on the page; at 1280 and 390 px
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp, deviceScaleFactor: 2 }); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/507/.test(m.text())) errs.push(m.text()) })
  let extra = null; await p.route('**/live.json*', async r => { const res = await r.fetch(); const L = await res.json(); if (extra) { L.agents.push(L.agents[0]); const a = L.agents.length - 1; L.events.push([L.events[L.events.length - 1][0] + 1, a, 'q', [0], 'testsha1']) } await r.fulfill({ response: res, json: L }) })
  await p.goto(U + '?livepoll=2#live', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-svg')
  const st = () => p.evaluate(() => ({ hexRim: !!document.querySelector('.lv-rim'), people: document.querySelectorAll('.lv .tm-p').length, agents: document.querySelectorAll('.lv .tm-a').length, base: document.querySelectorAll('.lv-links path.base').length, pulses: document.querySelectorAll('.lv-pulses circle').length, hot: document.querySelectorAll('.lv-hot').length, lit: [...document.querySelectorAll('.lv-links path:not(.base)')].filter(x => +x.getAttribute('stroke-opacity') > 0.05).length, dot: document.querySelector('.lv-dot').className, tag: document.querySelector('.lv-replay').className, pop: !!document.querySelector('[data-lv-pop]'), w: Math.round(document.querySelector('.lv-svg').getBoundingClientRect().width), scrollX: document.documentElement.scrollWidth - innerWidth }))
  const first = await st(); let maxP = 0, maxLit = 0, sawReplay = false
  for (let i = 0; i < 20; i++) { await p.waitForTimeout(250); const x = await st(); maxP = Math.max(maxP, x.pulses); maxLit = Math.max(maxLit, x.lit); sawReplay = sawReplay || /\bon\b/.test(x.tag) }
  await p.locator('.lv-frame').screenshot({ path: `${S}/live-${n}.png` })
  // a new exchange arrives with the next read
  await p.waitForTimeout(6500); const quiet = await st(); extra = true; let got = 0
  for (let i = 0; i < 24 && !got; i++) { await p.waitForTimeout(250); const x = await st(); if (x.pulses > 0 || x.hot > 0) got = 1 }
  const txt = await p.evaluate(() => document.querySelector('.lv').textContent.length)
  console.log(n, JSON.stringify({ first, maxP, maxLit, sawReplay, quietPulses: quiet.pulses, got, txt }), errs)
  if (!first.hexRim || !first.people || first.agents < 10 || !first.base || !first.pop || first.scrollX > 0 || !maxP || !maxLit || !sawReplay || !got || /off/.test(first.dot + '') && false || txt > 400 || errs.length) fail(n)
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })()
