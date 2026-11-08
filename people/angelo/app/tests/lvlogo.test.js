// Backlog 0c4 (6), Angelo, 8 November: "the riskmandate logo is too small, it should equal the PT one". In the live view, 2D and 3D:
// RiskMandate's mark and PT News's stamp drawn in squares of the same size, side by side at the top of the hexagon; on a dark hexagon,
// where RiskMandate's dark tile would melt into it, the tile has a visible edge so the whole square shows (PT's square always shows);
// the logo files themselves unchanged. At 1280 and 390 px, light and dark.
const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const scheme of ['dark', 'light']) for (const d3 of [false, true]) {
  const p = await (await b.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message))
  await p.addInitScript(t => { try { localStorage.setItem('cc.theme', JSON.stringify(t)) } catch {} }, scheme)
  await p.goto(U + (d3 ? '#live?d3=1' : '#live'), { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-logo'); await p.waitForTimeout(d3 ? 1500 : 500)
  const r = await p.evaluate(() => {
    const top = document.querySelector('.lv-top'), wrap = top.closest('.lv-hex').parentElement, bg = getComputedStyle(wrap).backgroundColor.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number)
    const one = k => { const i = document.querySelector(`.lv-logo[data-lv-logo="${k}"]`), q = i.getBoundingClientRect(); return { w: q.width, h: q.height, cy: q.y + q.height / 2, edge: getComputedStyle(i).boxShadow, loaded: i.complete && i.naturalWidth > 0 } }
    return { dark: (0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]) <= 140, cls: top.className, rm: one('riskmandate'), pt: one('promptugal') } })
  const tag = `${n} ${scheme}${d3 ? ' 3D' : ''}`
  if (!r.rm.loaded || !r.pt.loaded) fail(`${tag}: a logo did not load`)
  if (Math.abs(r.rm.w - r.pt.w) > 0.5 || Math.abs(r.rm.h - r.pt.h) > 0.5 || r.rm.w < 14) fail(`${tag}: sizes differ, RiskMandate ${r.rm.w}x${r.rm.h}, PT ${r.pt.w}x${r.pt.h}`)
  if (Math.abs(r.rm.cy - r.pt.cy) > 1) fail(`${tag}: not side by side (centres ${r.rm.cy}, ${r.pt.cy})`)
  if (r.dark !== /lv-on-dark/.test(r.cls)) fail(`${tag}: the hexagon is ${r.dark ? 'dark' : 'light'} but the top says "${r.cls}"`)
  if (r.dark && (!r.rm.edge || r.rm.edge === 'none')) fail(`${tag}: RiskMandate's tile has no edge on a dark hexagon`)
  if (!r.dark && r.rm.edge !== 'none') fail(`${tag}: an edge on a light hexagon (${r.rm.edge})`)
  if (errs.length) fail(`${tag}: page errors ${errs.slice(0, 2)}`)
  const bb = await (await p.$('.lv-top')).boundingBox(); await p.screenshot({ path: `${S}/lvlogo-${n}-${scheme}${d3 ? '-3d' : ''}.png`, clip: { x: Math.max(0, bb.x - 16), y: Math.max(0, bb.y - 8), width: Math.min(bb.width + 32, vp.width), height: bb.height + 16 } })
  console.log(tag, JSON.stringify({ rm: r.rm.w, pt: r.pt.w, dark: r.dark }))
  await p.context().close()
 }
 // the files are the sites' own, unchanged (brand/README.md)
 const fs = require('fs'), path = require('path'); const rm = fs.readFileSync(path.join(__dirname, '../brand/riskmandate-mark.svg'), 'utf8')
 if (!/<rect width="64" height="64" rx="17" fill="#161615"\/>/.test(rm)) fail('riskmandate-mark.svg changed')
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })()
