// Backlog 0c6, the live graph glowing all the time (Angelo, 9 November: "Can we have the glowy version all the time? Ideally on all
// views."; people/angelo/proposals/live-map/glow/README.md). In a quiet spell (no real exchange), with only the steady flow:
// 2D (#live): every flow dot carries its halo, as a real exchange's does, and the lines it lights reach min(1, 0.75 * 1.25) = 0.94,
// never above 1; 3D (#live?d3=1): each flow dot is drawn as a head and a three-dot trail (four points per flow dot, none of them a
// real exchange's), and the picture moves. At 1280 and 390 px, light and dark.
const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const scheme of ['dark', 'light']) {
  const p = await (await b.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: 'block' })).newPage(); const errs = []
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/507/.test(m.text())) errs.push(m.text()) })
  // quiet: every event moved three thousand minutes back, so only the steady flow moves
  await p.route('**/live.json*', async r => { const res = await r.fetch(); const L = await res.json(); L.events = L.events.map(e => [e[0] - 3000, ...e.slice(1)]); await r.fulfill({ response: res, json: L }) })
  await p.goto(U + '?livepoll=2#live', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-svg')
  const flat = () => p.evaluate(() => { const q = s => [...document.querySelectorAll(s)]
    const dots = q('.lv-pulses circle.flow:not(.halo)'), halos = q('.lv-pulses circle.halo.flow'), ops = q('.lv-links path:not(.base):not(.wflow)').map(x => +x.getAttribute('stroke-opacity') || 0)
    return { dots: dots.length, halos: halos.length, haloOp: Math.max(0, ...halos.map(h => +h.style.opacity || 0)), bright: q('.lv-pulses circle:not(.flow):not(.halo)').length, maxOp: Math.max(0, ...ops) } })
  let f2 = { dots: 0, halos: 0, haloOp: 0, bright: 0, maxOp: 0 }, mism = 0, maxOp = 0, minDots = 99
  for (let i = 0; i < 16; i++) { await p.waitForTimeout(250); const x = await flat(); if (x.dots !== x.halos) mism++; maxOp = Math.max(maxOp, x.maxOp); minDots = Math.min(minDots, x.dots); f2 = { ...x, maxOp } }
  await p.locator('.lv-hex').screenshot({ path: `${S}/lvglow-${n}-${scheme}-2d.png` })
  // 3D
  await p.click('[data-lv-3dsw]'); await p.waitForSelector('.lv-3d canvas', { timeout: 20000 }).catch(() => fail(`${n} ${scheme}: no 3D canvas`))
  await p.waitForFunction(() => +((document.querySelector('[data-lv3d]') || {}).dataset || {}).lv3dFrames > 10, null, { timeout: 15000 }).catch(() => fail(`${n} ${scheme}: 3D draws no frames`))
  let per = [], odd = 0
  for (let i = 0; i < 12; i++) { await p.waitForTimeout(250); const x = await p.evaluate(() => ({ pts: +document.querySelector('[data-lv3d]').dataset.lv3dDots, bright: document.querySelectorAll('.lv-pulses circle:not(.flow):not(.halo)').length }))
    if (!x.bright) { per.push(x.pts); if (x.pts % 4) odd++ } }
  const shotA = await p.locator('.lv-hex').screenshot({ path: `${S}/lvglow-${n}-${scheme}-3d.png` }); await p.waitForTimeout(700); const shotB = await p.locator('.lv-hex').screenshot()
  console.log(n, scheme, JSON.stringify({ f2, mism, minDots, per, odd }), errs.slice(0, 3))
  if (!(minDots > 0) || f2.bright) fail(`${n} ${scheme}: no quiet flow in 2D ${JSON.stringify(f2)}`)
  if (mism) fail(`${n} ${scheme}: a flow dot without its halo in 2D (${mism} samples)`)
  if (!(f2.haloOp > 0.2)) fail(`${n} ${scheme}: the flow's halo is not lit (${f2.haloOp})`)
  if (!(maxOp >= 0.9 && maxOp <= 1)) fail(`${n} ${scheme}: a line lit by the flow should reach 0.94 in 2D, not ${maxOp}`)
  if (!per.length || !per.some(x => x > 0) || odd) fail(`${n} ${scheme}: the 3D flow is not drawn as a head and three trail dots ${JSON.stringify(per)}`)
  if (shotA.equals(shotB)) fail(`${n} ${scheme}: the 3D picture does not move`)
  if (errs.length) fail(`${n} ${scheme}: errors ${errs.join(' | ')}`)
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
