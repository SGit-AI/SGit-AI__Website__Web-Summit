const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
// the live graph (#live): the people ring in a hexagon that never stops: a constant faint flow on the lines even in a quiet hour,
// a real new exchange as a brighter pulse (at its real moment, a delay behind: ?livedelay), no replay and no text, the status
// light outside the graph, the hexagon fitting a small window; at 1280 and 390 px
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const p = await (await b.newContext({ viewport: vp, deviceScaleFactor: 2, serviceWorkers: 'block' })).newPage(); /* the offline worker's fetches bypass page.route */ const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/507/.test(m.text())) errs.push(m.text()) })
  let mode = 'quiet'   // quiet: every event is two days old (a quiet spell); new: one real exchange, 10 minutes old, appears
  await p.route('**/live.json*', async r => { const res = await r.fetch(); const L = await res.json()
    if (mode === 'quiet') L.events = L.events.map(e => [e[0] - 3000, ...e.slice(1)])
    if (mode === 'new') { const like = L.events.filter(e => e[3].length && L.agents[e[1]].split('@')[1] !== String(L.targets[e[3][0]]).split('@')[1]).pop() || L.events.find(e => e[3].length); L.events.push([Math.round((Date.now() - Date.parse(L.from)) / 6e4) - 10, like[1], 'q', like[3], 'testsha1']) }
    await r.fulfill({ response: res, json: L }) })
  await p.goto(U + '?livepoll=2#live', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-svg')
  const st = () => p.evaluate(() => { const hex = document.querySelector('.lv-hex').getBoundingClientRect(), dot = document.querySelector('.lv-dot').getBoundingClientRect()
    return { hexRim: !!document.querySelector('.lv-rim'), people: document.querySelectorAll('.lv .tm-p').length, agents: document.querySelectorAll('.lv .tm-a').length, base: document.querySelectorAll('.lv-links path.base').length,
      flow: document.querySelectorAll('.lv-pulses circle.flow').length, bright: document.querySelectorAll('.lv-pulses circle:not(.flow):not(.halo)').length, hot: document.querySelectorAll('.lv-hot').length,
      replay: !!document.querySelector('.lv-replay'), pop: !!document.querySelector('[data-lv-pop]'), scrollX: document.documentElement.scrollWidth - innerWidth,
      dotInGraph: dot.left > hex.left && dot.right < hex.right && dot.top > hex.top && dot.bottom < hex.bottom && Math.abs((dot.top + dot.bottom) / 2 - (hex.top + hex.bottom) / 2) < hex.height * .2 } })
  // a quiet window: nothing new, yet the flow never stops (some dots in every sample over several seconds)
  let minFlow = 99, maxBright = 0, last
  await p.waitForTimeout(1500)
  for (let i = 0; i < 16; i++) { await p.waitForTimeout(250); last = await st(); minFlow = Math.min(minFlow, last.flow); maxBright = Math.max(maxBright, last.bright) }
  await p.locator('.lv-frame').screenshot({ path: `${S}/live-${n}.png` })
  // one real exchange arrives with the next read: a bright pulse, at once because it is older than the delay
  mode = 'new'; let got = 0
  for (let i = 0; i < 30 && !got; i++) { await p.waitForTimeout(250); const x = await st(); if (x.bright > 0 && x.hot > 0) got = 1 }
  // a small window: the hexagon fits inside whatever it is given
  await p.evaluate(() => { const f = document.querySelector('.lv-frame'); f.style.cssText = 'width:150px;height:150px;min-height:0' }); await p.waitForTimeout(300)
  const small = await p.evaluate(() => { const f = document.querySelector('.lv-frame').getBoundingClientRect(), h = document.querySelector('.lv-hex').getBoundingClientRect(); return h.width <= f.width + 1 && h.height <= f.height + 1 && h.width > 100 })
  const txt = await p.evaluate(() => document.querySelector('.lv').textContent.length)
  console.log(n, JSON.stringify({ minFlow, maxBright, got, small, txt, last }), errs)
  if (!last.hexRim || !last.people || last.agents < 10 || !last.base || !last.pop || last.scrollX > 0 || minFlow < 1 || maxBright > 0 || !got || last.replay || last.dotInGraph || !small || txt > 400 || errs.length) fail(n)
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })()
