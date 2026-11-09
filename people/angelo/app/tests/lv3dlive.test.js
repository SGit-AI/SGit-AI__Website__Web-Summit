// Backlog 0c, the live graph in 3D (Angelo, 8 November: "interacting with the mouse is very slow, it lags heavily, and more
// importantly, dots and lines don't light up"). #live?d3=1: a WebGL view (live3d.js) inside the hexagon, fed by the live engine:
// the flow never stops in a quiet hour (faint dots drawn in every sample), a real exchange lights its line and travels as a bright
// dot, the picture changes from moment to moment; dragging turns it without lag (the time each frame takes to draw, measured while
// the mouse moves, and the frames the page still gets); the 3D switch in the bar turns it off again. At 1280 and 390 px, light and dark.
const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const scheme of ['dark', 'light']) {
  const p = await (await b.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: 'block' })).newPage(); const errs = []
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/507/.test(m.text())) errs.push(m.text()) })
  let mode = 'quiet'
  await p.route('**/live.json*', async r => { const res = await r.fetch(); const L = await res.json()
    if (mode === 'quiet') L.events = L.events.map(e => [e[0] - 3000, ...e.slice(1)])
    if (mode === 'new') { const like = L.events.filter(e => e[3].length && L.agents[e[1]].split('@')[1] !== String(L.targets[e[3][0]]).split('@')[1]).pop() || L.events.find(e => e[3].length); L.events.push([Math.round((Date.now() - Date.parse(L.from)) / 6e4) - 10, like[1], 'q', like[3], 'test3d01']) }
    await r.fulfill({ response: res, json: L }) })
  await p.goto(U + '?livepoll=2#live', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-svg')
  const flat = await p.evaluate(() => ({ canvas: !!document.querySelector('.lv-3d canvas'), sw: !!document.querySelector('[data-lv-3dsw]'), pressed: (document.querySelector('[data-lv-3dsw]') || {}).getAttribute?.('aria-pressed') }))
  await p.click('[data-lv-3dsw]'); await p.waitForSelector('.lv-3d canvas', { timeout: 20000 }).catch(() => fail(`${n} ${scheme}: no 3D canvas`))
  await p.waitForFunction(() => +((document.querySelector('[data-lv3d]') || {}).dataset || {}).lv3dFrames > 10, null, { timeout: 15000 }).catch(() => fail(`${n} ${scheme}: 3D draws no frames`))
  const st = () => p.evaluate(() => { const b = document.querySelector('[data-lv3d]'), r = b && b.r3 && b.r3.stats(), c = document.querySelector('.lv-3d canvas').getBoundingClientRect(), h = document.querySelector('.lv-hex').getBoundingClientRect()
    return { hash: location.hash, dots: +b.dataset.lv3dDots, lit: +b.dataset.lv3dLit, frames: +b.dataset.lv3dFrames, stats: r, labels: document.querySelectorAll('.lv-3dl').length, svgHidden: getComputedStyle(document.querySelector('.lv-svg > g')).visibility, fits: c.width <= h.width + 1 && c.height <= h.height + 1 && c.width > 100, bright: document.querySelectorAll('.lv-pulses circle:not(.flow):not(.halo)').length, ov: document.documentElement.scrollWidth - innerWidth } })
  // a quiet spell: the flow is drawn in every sample
  let minDots = 99, s0
  for (let i = 0; i < 12; i++) { await p.waitForTimeout(250); s0 = await st(); minDots = Math.min(minDots, s0.dots) }
  const shotA = await p.locator('.lv-hex').screenshot({ path: `${S}/lv3dlive-${n}-${scheme}.png` }); await p.waitForTimeout(700); const shotB = await p.locator('.lv-hex').screenshot()
  // a real exchange: its line lit in 3D and a bright dot on it
  mode = 'new'; let got = null
  for (let i = 0; i < 40 && !got; i++) { await p.waitForTimeout(200); const x = await st(); if (x.bright > 0 && x.lit > 0) got = x }
  // turning it by hand: a drag across the hexagon, measuring the page's frames and the time each 3D frame takes
  const box = await p.locator('.lv-3d').boundingBox(); const cx = box.x + box.width / 2, cy = box.y + box.height / 2
  await p.evaluate(() => { const b = document.querySelector('[data-lv3d]'); window.__f0 = +b.dataset.lv3dFrames; window.__t0 = performance.now(); const st = b.r3.stats(); window.__s0 = st })
  await p.mouse.move(cx - 60, cy); await p.mouse.down()
  for (let i = 0; i < 40; i++) { await p.mouse.move(cx - 60 + i * 4, cy + Math.sin(i / 5) * 20); await p.waitForTimeout(16) }
  await p.mouse.up()
  const drag = await p.evaluate(() => { const b = document.querySelector('[data-lv3d]'), s = b.r3.stats(), dt = performance.now() - window.__t0; return { fps: (+b.dataset.lv3dFrames - window.__f0) / dt * 1000, avgDraw: s.avg, maxDraw: s.max, calls: s.calls } })
  await p.locator('.lv-hex').screenshot({ path: `${S}/lv3dlive-${n}-${scheme}-turned.png` })
  // off again
  await p.click('[data-lv-3dsw]'); await p.waitForTimeout(600)
  const back = await p.evaluate(() => ({ hash: location.hash, canvas: !!document.querySelector('.lv-3d canvas'), svgVis: getComputedStyle(document.querySelector('.lv-svg > g')).visibility }))
  console.log(n, scheme, JSON.stringify({ flat, minDots, s0: { ...s0, stats: undefined }, got: got && { lit: got.lit, bright: got.bright }, drag, back }), errs.slice(0, 3))
  if (flat.canvas || !flat.sw || flat.pressed !== 'false') fail(`${n} ${scheme}: 3D should be off by default with its switch ${JSON.stringify(flat)}`)
  if (!s0.hash.includes('d3=1') || s0.svgHidden !== 'hidden' || !s0.fits || s0.labels < 3) fail(`${n} ${scheme}: 3D view ${JSON.stringify(s0)}`)
  if (!(minDots > 0)) fail(`${n} ${scheme}: the flow stopped in 3D (min dots ${minDots})`)
  if (shotA.equals(shotB)) fail(`${n} ${scheme}: the 3D picture does not move`)
  if (!got) fail(`${n} ${scheme}: a real exchange did not light a line in 3D`)
  if (!(drag.avgDraw < 6) || !(drag.calls <= 8)) fail(`${n} ${scheme}: drawing is too heavy: ${JSON.stringify(drag)}`)
  if (!(drag.fps > 20)) fail(`${n} ${scheme}: frames lag while turning: ${drag.fps.toFixed(1)} a second`)
  if (back.hash.includes('d3=1') || back.canvas || back.svgVis !== 'visible') fail(`${n} ${scheme}: back to flat ${JSON.stringify(back)}`)
  if (s0.ov > 1 || errs.length) fail(`${n} ${scheme}: overflow ${s0.ov} errors ${errs.join(' | ')}`)
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
