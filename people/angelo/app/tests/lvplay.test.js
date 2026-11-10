// Angelo, 10 November: "the bar below that should allow to slide through time like in the replay view, doesn't actually seem to do
// anything. We need that to go back in time properly and also have a simple icon-based play button" and "a single play for the slow
// 1h / sec and the FF symbol for the 6h/sec". On the live view's dial (live.js) and the dumbbell that follows it (work-live.js):
// (1) ⏩ from live starts at the beginning of live.json and the moment at the foot runs about 6 hours a second, the dial's thumb with it;
// (2) the dumbbell (Deliverables) follows: its routes are the week ending at the moment shown, so they change as it plays;
// (3) ⏩ again pauses: the moment stays; ▶ then runs about 1 hour a second; (4) LIVE returns to now and stops;
// (5) dragged back (no play), lines light at once: the twenty minutes before that moment replayed over 1.5 s. 1280 and 390 px, dark.
// By dashboard@PrompTugal.angelo.
const { chromium } = require('playwright')
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html'
;(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 const L = require('../live.json'), from = Date.parse(L.from)
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const ctx = await b.newContext({ viewport: vp, colorScheme: 'dark', serviceWorkers: 'block' }), p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message))
  await p.addInitScript(() => { try { localStorage.setItem('cc.theme', '"dark"') } catch {} })
  await p.goto(U + '#live?v=work', { waitUntil: 'networkidle' }); await p.waitForSelector('[data-lv-play]'); await p.waitForTimeout(2500)
  const shown = () => p.evaluate(() => +document.querySelector('[data-lv-when]').getAttribute('data-lv-shown'))
  const routes = () => p.evaluate(() => [...document.querySelectorAll('.wb-route')].map(r => r.getAttribute('stroke-width')).join(','))
  const r0 = await routes()
  // (1) fast forward
  await p.click('[data-lv-play="21600"]'); await p.waitForTimeout(400); const a = await shown(); await p.waitForTimeout(2000); const c = await shown()
  const hours = (c - a) / 36e5
  if (!(a < from + 6 * 36e5)) fail(`${n}: ⏩ did not start near the beginning (${new Date(a).toISOString()})`)
  if (!(hours > 8 && hours < 16)) fail(`${n}: ⏩ ran ${hours.toFixed(1)} hours in 2 s, not about 12`)
  const pressed = await p.getAttribute('[data-lv-play="21600"]', 'aria-pressed'); if (pressed !== 'true') fail(`${n}: ⏩ not shown as running`)
  // (2) the dumbbell follows
  const r1 = await routes(); if (r1 === r0) fail(`${n}: the dumbbell's routes did not change while playing`)
  await p.screenshot({ path: `${S}/lvplay-${n}-ff.png` })
  // (3) pause, then play
  await p.click('[data-lv-play="21600"]'); const s1 = await shown(); await p.waitForTimeout(1200); const s2 = await shown()
  if (Math.abs(s2 - s1) > 5 * 6e4) fail(`${n}: paused, yet the moment moved ${((s2 - s1) / 6e4).toFixed(0)} min`)
  await p.click('[data-lv-play="3600"]'); const s3 = await shown(); await p.waitForTimeout(2000); const s4 = await shown(), h2 = (s4 - s3) / 36e5
  if (!(h2 > 1.2 && h2 < 3)) fail(`${n}: ▶ ran ${h2.toFixed(2)} hours in 2 s, not about 2`)
  // (4) Live
  await p.click('[data-lv-golive]'); await p.waitForTimeout(500); const live = await shown()
  if (Date.now() - live > 10 * 6e4) fail(`${n}: LIVE did not return to now`)
  if (await p.$eval('[data-lv-play="3600"]', e => e.getAttribute('aria-pressed')) !== 'false') fail(`${n}: still playing after LIVE`)
  // (5) dragged back: lines light at once
  await p.goto(U + '#live', { waitUntil: 'networkidle' }); await p.waitForSelector('[data-lv-dial-r]'); await p.waitForTimeout(1500)
  const busy = L.events.map(e => from + e[0] * 6e4).sort((x, y) => x - y), mid = busy[Math.floor(busy.length / 2)], back = Math.round((Date.now() - 4 * 6e4 - mid) / 6e4) - 5
  await p.$eval('[data-lv-dial-r]', (r, v) => { r.value = String(-v); r.dispatchEvent(new Event('input')); r.dispatchEvent(new Event('change')) }, back)
  await p.waitForTimeout(900)
  const lit = await p.evaluate(() => [...document.querySelectorAll('.lv-links path.lit, .lv-pulses circle')].length)
  if (!lit) fail(`${n}: dragged back, nothing lit within a second`)
  if (errs.length) fail(`${n}: page errors ${errs.slice(0, 2).join(' | ')}`)
  console.log(`${n}: ⏩ ${hours.toFixed(1)} h in 2 s, ▶ ${h2.toFixed(2)} h in 2 s, routes followed ${r1 !== r0}, lit after the drag ${lit}`)
  await ctx.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL')
})()
