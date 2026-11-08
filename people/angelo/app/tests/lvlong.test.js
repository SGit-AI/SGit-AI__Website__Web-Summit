const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
// the four-hour test (spec-realtime.md, "How we will know it works"): the display mode left on at the stand's 1920x1080 for four
// hours with a fake feed, on Playwright's faked clock so it takes about a minute. Each simulated minute: the clock jumps, then
// 0.6 s of frames run. A new exchange every ten minutes. Checks: the flow never stops (dots in every minute's sample); memory flat
// (heap after a forced collection, and the page's element count, within 10% from the end of the first hour to the last); reads that
// fail for twenty minutes (hour three) leave the graph moving, with the status light off and no error in its place; and once the
// network is back, it is read again and the light comes back within one tick (60 s, plus the 10 s spread).
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 }, colorScheme: 'dark', serviceWorkers: 'block' })
 const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/507|Failed to load resource|internetdisconnected/i.test(m.text())) errs.push(m.text()) })
 const t0 = Date.now(); let sim = t0, down = false, reads = 0, n = 0, base = null
 await p.clock.install({ time: t0 })
 // the fake feed: the real live.json's agents and targets; its events moved so the newest is five minutes before the start, and
 // one more exchange every ten simulated minutes; 48 hours kept, as the real one
 await p.route('**/live.json*', async r => { reads++; if (down) return r.abort('internetdisconnected')
  if (!base) { const res = await r.fetch(); base = await res.json() }
  const L = JSON.parse(JSON.stringify(base)), F = Date.parse(L.from), m = t => Math.round((t - F) / 6e4), last = Math.max(...L.events.map(e => e[0])), shift = m(t0) - 5 - last
  const real = L.events.filter(e => e[3].length && L.agents[e[1]].split('@')[1] !== String(L.targets[e[3][0]]).split('@')[1])
  L.events = L.events.map(e => [e[0] + shift, ...e.slice(1)])
  for (let k = 1; t0 + k * 6e5 <= sim; k++) { const e = real[k % real.length]; L.events.push([m(t0 + k * 6e5), e[1], 'w', e[3], 'long' + k, 0]) }
  L.events = L.events.filter(e => e[0] >= m(sim) - 48 * 60); L.built_at = new Date(sim).toISOString()
  await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(L) }) })
 await p.goto(U + '?display=1#live', { waitUntil: 'domcontentloaded' })
 for (let i = 0; i < 50 && !(await p.$('.lv-display .lv-svg')); i++) { await p.clock.runFor(100); await p.waitForTimeout(20) }
 const cdp = await ctx.newCDPSession(p)
 const mem = async () => { await cdp.send('HeapProfiler.collectGarbage'); const h = await cdp.send('Runtime.getHeapUsage'); return { heap: h.usedSize, els: await p.evaluate(() => document.getElementsByTagName('*').length) } }
 const st = () => p.evaluate(() => { const d = document.querySelector('.lv-display'); return { svg: !!(d && d.querySelector('.lv-svg')), txt: d ? d.querySelector('.lv').textContent.length : -1, flow: document.querySelectorAll('.lv-display .lv-pulses circle').length, dot: (document.querySelector('.lv-live') || {}).className || '' } })
 // one simulated minute: jump 59.4 s (timers and reads due fire once), let the read land, then 0.6 s of frames
 const minute = async () => { await p.clock.fastForward(59400); sim += 59400; await p.waitForTimeout(25); await p.clock.runFor(600); sim += 600; n++; return st() }
 let minFlow = 1e9, h1 = null, offAt = null, during = null, back = null
 for (let i = 1; i <= 240; i++) {
  if (i === 181) down = true                                            // hour three: twenty minutes with no network
  const s = await minute(); minFlow = Math.min(minFlow, s.flow)
  if (i === 60) h1 = await mem()
  if (i === 200) { during = s; offAt = reads; down = false             // the twentieth minute down; then the network returns
   let k = 0, x = s; while (k < 70 && (reads === offAt || /off/.test(x.dot))) { await p.clock.runFor(1000); sim += 1000; await p.waitForTimeout(25); k++; x = await st() }
   back = { s: x, after_s: k } }
  if (!s.svg) { fail(`minute ${i}: the graph is gone`); break }
 }
 const h4 = await mem()
 await p.screenshot({ path: `${S}/lvlong-stand.png` })
 const grow = (a, b) => (b - a) / a
 console.log('stand', JSON.stringify({ minutes: n, reads, minFlow, h1, h4, heap: +grow(h1.heap, h4.heap).toFixed(3), els: +grow(h1.els, h4.els).toFixed(3), during, back }), errs)
 if (n < 240 || !minFlow || Math.abs(grow(h1.heap, h4.heap)) > 0.1 || Math.abs(grow(h1.els, h4.els)) > 0.1 || !during.svg || during.txt > 100 || !during.flow || !/off/.test(during.dot) || !back || /off/.test(back.s.dot) || back.after_s > 70 || errs.length) fail('stand')
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })()
