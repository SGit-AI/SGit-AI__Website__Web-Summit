// spec-live-map.md piece 5, the 3D switch (decision 4: off by default, built last). Off: the 2D map exactly as before, and the
// 3D libraries (assets/cc/brain-libs.js, 1.6 MB) never requested. On: d3=1 in the address, the libraries loaded, a WebGL canvas
// over the map holding every node and line of the 2D map (the same map tilted, not a new one), orbiting on a desktop and still on
// a phone; a reload keeps it; off again brings the 2D map back. At 1280 and 390 px, light and dark.
const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) };
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const scheme of ['light', 'dark']) {
  const p = await (await b.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: 'block' })).newPage(); const errs = [], libs = []
  p.on('pageerror', e => errs.push(e.message)); p.on('request', r => { if (r.url().includes('brain-libs.js')) libs.push(r.url()) })
  await p.goto(U + '#collab?map=1', { waitUntil: 'networkidle' }); await p.waitForSelector('.tm-svg [data-tm-f]', { timeout: 8000 }).catch(() => fail('no map'))
  const off = await p.evaluate(() => { const b = document.querySelector('[data-tm-3d]'); return { btn: !!b, pressed: b && b.getAttribute('aria-pressed'), canvas: !!document.querySelector('.tm-3d canvas'), svgVis: getComputedStyle(document.querySelector('.tm-svg')).visibility, nodes: document.querySelectorAll('.tm-svg [data-tm-f]').length, lines: document.querySelectorAll('.tm-links path').length } })
  const libsOff = libs.length
  await p.click('[data-tm-3d]'); await p.waitForSelector('.tm-3d canvas', { timeout: 20000 }).catch(() => fail(`${n} ${scheme}: no 3D canvas`)); await p.waitForTimeout(1200)
  const on = await p.evaluate(() => { const v = document.querySelector('[data-tm-3dv]') || {}, c = document.querySelector('.tm-3d canvas'), r = c ? c.getBoundingClientRect() : {}; return { hash: location.hash, pressed: document.querySelector('[data-tm-3d]').getAttribute('aria-pressed'), nodes: +(v.dataset || {}).tm3dNodes, links: +(v.dataset || {}).tm3dLinks, orbit: (v.dataset || {}).tm3dOrbit, w: r.width, h: r.height, svgVis: getComputedStyle(document.querySelector('.tm-svg')).visibility } })
  // something is drawn: the canvas is not one flat colour
  const shot = await p.locator('.tm-3d').screenshot({ path: `${S}/lv3d-${n}-${scheme}.png` }), varied = new Set(); for (let i = 200; i < shot.length; i += 997) varied.add(shot[i])
  await p.reload({ waitUntil: 'networkidle' }); await p.waitForSelector('.tm-3d canvas', { timeout: 20000 }).catch(() => fail(`${n} ${scheme}: reload lost 3D`))
  await p.click('[data-tm-3d]'); await p.waitForTimeout(500)
  const back = await p.evaluate(() => ({ hash: location.hash, canvas: !!document.querySelector('.tm-3d canvas'), svgVis: getComputedStyle(document.querySelector('.tm-svg')).visibility, nodes: document.querySelectorAll('.tm-svg [data-tm-f]').length }))
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  console.log(n, scheme, JSON.stringify({ off, libsOff, on, back, ov }), errs.slice(0, 3))
  if (!off.btn || off.pressed !== 'false' || off.canvas || off.svgVis !== 'visible' || libsOff) fail(`${n} ${scheme}: off by default ${JSON.stringify(off)}, libraries requested ${libsOff}`)
  if (!on.hash.includes('d3=1') || on.pressed !== 'true' || on.nodes !== off.nodes || on.links !== off.lines || on.svgVis !== 'hidden' || !(on.w > 200) || !(on.h > 200)) fail(`${n} ${scheme}: on ${JSON.stringify(on)} vs 2D ${off.nodes} nodes, ${off.lines} lines`)
  if (on.orbit !== (n === 'phone' ? 'still' : 'orbit')) fail(`${n} ${scheme}: orbit ${on.orbit}`)
  if (varied.size < 3) fail(`${n} ${scheme}: the 3D view looks empty`)
  if (back.hash.includes('d3=1') || back.canvas || back.svgVis !== 'visible' || back.nodes !== off.nodes) fail(`${n} ${scheme}: back to 2D ${JSON.stringify(back)}`)
  if (ov > 1 || errs.length) fail(`${n} ${scheme}: overflow ${ov} errors ${errs.join(' | ')}`)
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
