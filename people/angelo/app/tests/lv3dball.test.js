// backlog 0c3, the 3D (Angelo, 8 November): (2) "brighter colors for messages and lines, I like if they have a glow effect": every
// lit line carries a glow layer (soft blobs along it, one draw call), within the live 3D's budget of 8 draw calls; (3) "in the
// replay, the 3d map doesn't adapt as agents appear and disappear": the map's 3D played back holds only the agents on the 2D map
// at that moment, more at the end of the window than at its start, and they move to make room; (4) "the 2 logos bigger and the
// actual 3d model ... closer to a ball rather than a disk": the logos at least 1.4 times their 2D size, and the nodes' spread in
// depth at least 0.6 of their spread across, live and in the replay (the old shells gave about 0.2). 1280 and 390 px, light and dark.
const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
const round = sh => sh ? sh.z / ((sh.x + sh.y) / 2) : 0;
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const scheme of ['light', 'dark']) {
  const ctx = await b.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: 'block' }), p = await ctx.newPage(), errs = []
  p.on('pageerror', e => errs.push(e.message))
  // the logos in 2D, then the live 3D
  await p.goto(U + '#live', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-logo'); await p.waitForTimeout(500)
  const logo2 = await p.evaluate(() => document.querySelector('.lv-logo').getBoundingClientRect().width)
  await p.goto(U + '#live?d3=1', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-3dc', { timeout: 20000 }).catch(() => fail(`${n} ${scheme}: no live 3D`)); await p.waitForTimeout(4000)
  const live = await p.evaluate(() => { const r = document.querySelector('[data-lv3d]').r3, st = r && r.stats ? r.stats() : {}; return { shape: st.shape, glow: st.glow, lit: st.lit, calls: st.calls, logo: document.querySelector('.lv-logo').getBoundingClientRect().width } })
  await p.locator('.lv-hex').screenshot({ path: `${S}/lv3dball-live-${n}-${scheme}.png` }).catch(() => {})
  // the replay's 3D over the whole record (Since 2 Nov): the window's start, then its end
  await p.goto(U + '#collab?map=1&d3=1&w=all', { waitUntil: 'networkidle' }); await p.waitForSelector('.tm-3d canvas', { timeout: 20000 }).catch(() => fail(`${n} ${scheme}: no 3D map`))
  const at = async v => { await p.$eval('[data-tmf-scrub]', (s, v) => { s.value = v === 'min' ? s.min : s.max; s.dispatchEvent(new Event('input')) }, v) }
  const rd = () => p.evaluate(() => { const d = document.querySelector('[data-tm-3dv]').dataset; return { on: +d.tm3dOn, shown: +d.lv3dShown, shape: d.lv3dShape, two: document.querySelectorAll('.tm-svg .tm-a[data-tm-f]:not(.tmf-gone)').length } })
  await at('min'); await p.waitForTimeout(2500); const s0 = await rd()
  await at('max'); await p.waitForTimeout(250); const mid = await rd(); await p.waitForTimeout(2500); const s1 = await rd()
  await p.locator('.tm-3d canvas').screenshot({ path: `${S}/lv3dball-replay-${n}-${scheme}.png` }).catch(() => {})
  const shp = t => { if (!t) return null; const [x, y, z] = t.split(',').map(Number); return { x, y, z } }
  console.log(n, scheme, JSON.stringify({ logo2, live, replay: { s0, mid, s1 } }), errs)
  if (!(live.logo >= 1.4 * logo2)) fail(`${n} ${scheme}: the logos in 3D are ${live.logo} px, in 2D ${logo2}`)
  if (!(round(live.shape) >= 0.6)) fail(`${n} ${scheme}: the live 3D is a disk, not a ball (${JSON.stringify(live.shape)})`)
  if (live.lit > 0 && live.glow !== live.lit * 19) fail(`${n} ${scheme}: ${live.lit} lit lines but ${live.glow} glow points`)
  if (!(live.calls <= 8)) fail(`${n} ${scheme}: ${live.calls} draw calls`)
  if (!(s1.on > s0.on) || s0.on !== s0.two || s1.on !== s1.two) fail(`${n} ${scheme}: the replay's 3D holds ${s0.on} then ${s1.on} agents, the 2D ${s0.two} then ${s1.two}`)
  if (!(s1.shown > s0.shown)) fail(`${n} ${scheme}: the replay's 3D shows ${s0.shown} then ${s1.shown} nodes`)
  if (mid.shape === s1.shape) fail(`${n} ${scheme}: nothing moved to make room (${mid.shape})`)
  if (!(round(shp(s1.shape)) >= 0.6)) fail(`${n} ${scheme}: the replay's 3D is a disk, not a ball (${s1.shape})`)
  if (errs.length) fail(`${n} ${scheme}: errors`)
  await ctx.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })()
