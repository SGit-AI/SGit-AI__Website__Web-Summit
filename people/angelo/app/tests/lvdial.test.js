// Backlog 0c4 (4), Angelo, 8 November: "We should add to the live view the replay dial, so that it's possible to move back and forth in
// time." The live view (#live, 2D and 3D) has a time dial under the hexagon over all that live.json holds: at live it shows no "Live" button;
// dragged back, the moment at the foot follows while dragging, and on release the moment shown is that far back, LIVE goes grey and a
// "LIVE" button appears; a real exchange from that time then travels at its real pace (a bright dot leaves its agent); "LIVE" brings the
// moment back to a few minutes behind now. Display mode has no dial. At 1280 and 390 px, light and dark.
const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 const L = require('../live.json'), from = Date.parse(L.from), evMs = L.events.map(e => from + e[0] * 6e4).sort((x, y) => x - y)
 if (evMs.length < 5) fail(`live.json holds ${evMs.length} exchanges`)
 let pulsed = false
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const scheme of ['dark', 'light']) for (const d3 of [false, true]) {
  if (d3 && n === 'phone' && scheme === 'light') continue
  const ctx = await b.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: 'block' }), p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message))
  await p.addInitScript(t => { try { localStorage.setItem('cc.theme', JSON.stringify(t)) } catch {} }, scheme)
  const tag = `${n} ${scheme}${d3 ? ' 3D' : ''}`
  await p.goto(U + (d3 ? '#live?d3=1' : '#live'), { waitUntil: 'networkidle' }); await p.waitForSelector('[data-lv-dial-r]'); await p.waitForTimeout(d3 ? 1500 : 600)
  const st = () => p.evaluate(() => { const r = document.querySelector('[data-lv-dial-r]'), w = document.querySelector('[data-lv-when]'), go = document.querySelector('[data-lv-golive]'), q = r.getBoundingClientRect(), hx = document.querySelector('.lv-hex').getBoundingClientRect()
    return { min: +r.min, val: +r.value, shown: +w.getAttribute('data-lv-shown'), text: w.textContent, go: !go.hidden, live: document.querySelector('[data-lv-live]').className, back: document.querySelector('.lv-frame, [data-lv-frame]').lvGraph ? document.querySelector('[data-lv-frame]').lvGraph.back : null, inside: q.left >= hx.left && q.right <= hx.right && q.bottom <= hx.bottom + 1 && q.width > 60, w: q.width } })
  const a = await st()
  if (a.go || a.val !== 0 || !(a.min <= -600) || !a.inside || Math.abs(a.shown - (Date.now() - 4 * 6e4)) > 2 * 6e4) fail(`${tag}: at live ${JSON.stringify(a)}`)
  // drag back: the foot follows while dragging, before release nothing else changes
  const pick = Math.round(a.min / 2)
  await p.evaluate(v => { const r = document.querySelector('[data-lv-dial-r]'); r.value = v; r.dispatchEvent(new Event('input', { bubbles: true })) }, pick); await p.waitForTimeout(150)
  const mid = await st()
  if (Math.abs(mid.shown - (Date.now() - 4 * 6e4 + pick * 6e4)) > 2 * 6e4 || mid.go) fail(`${tag}: while dragging ${JSON.stringify(mid)}`)
  await p.evaluate(() => document.querySelector('[data-lv-dial-r]').dispatchEvent(new Event('change', { bubbles: true }))); await p.waitForTimeout(300)
  const c = await st()
  if (!c.go || !/past/.test(c.live) || c.back !== -pick * 6e4 || Math.abs(c.shown - (Date.now() - 4 * 6e4 + pick * 6e4)) > 2 * 6e4 || c.val !== pick) fail(`${tag}: after release ${JSON.stringify(c)}`)
  await p.screenshot({ path: `${S}/lvdial-${n}-${scheme}${d3 ? '-3d' : ''}-back.png` })
  // a real exchange from that time travels (2D, once): go to just before one, so it is due within seconds
  if (!d3 && !pulsed && n === 'desktop') {
    // a few exchanges from at least half an hour ago, each due three seconds after going back (host.lvGraph.setBack, as the dial calls it)
    const cand = [...new Set(evMs.filter(E => E < Date.now() - 34 * 6e4))].reverse().slice(0, 25)
    for (const E of cand.filter((_, k) => k % 5 === 0)) {
      await p.evaluate(E => { const h = document.querySelector('[data-lv-frame]'); h.lvGraph.setBack(Date.now() - 4 * 6e4 - E + 3000) }, E)
      if (await p.waitForFunction(() => document.querySelectorAll('.lv-pulses circle:not(.flow):not(.halo)').length > 0, null, { timeout: 6000 }).then(() => true, () => false)) { pulsed = true; break }
    }
    if (!pulsed) fail(`${tag}: no exchange travelled after going back to any of ${cand.length} moments`)
  }
  // back to live
  await p.click('[data-lv-golive]'); await p.waitForTimeout(300)
  const e = await st()
  if (e.go || e.val !== 0 || e.back !== 0 || /past/.test(e.live) || Math.abs(e.shown - (Date.now() - 4 * 6e4)) > 2 * 6e4) fail(`${tag}: back to live ${JSON.stringify(e)}`)
  if (errs.length) fail(`${tag}: page errors ${errs.slice(0, 2)}`)
  console.log(tag, JSON.stringify({ min: a.min, back: c.back, text: c.text, w: Math.round(a.w) }))
  await ctx.close()
 }
 if (!pulsed) fail('no exchange seen travelling after going back')
 // display mode: no dial
 { const p = await (await b.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' })).newPage(); await p.goto('http://127.0.0.1:8765/people/angelo/app/index.html?display=1#live', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-hex'); if (await p.$('[data-lv-dial-r]')) fail('display mode has a dial') }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })()
