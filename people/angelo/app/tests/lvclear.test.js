const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
// transparent=1 on the live graph's display mode (backlog 00a; draft people/angelo/app/desktop/drafts/live-transparent.md):
// with it, the page itself has no background, so a shaped window (the desktop app) shows the desktop at the hexagon's corners:
// a screenshot with no background has clear corners and an opaque centre, in 2D and 3D, with no start-up script helping.
// Without it, display mode is as before: corners opaque. 600x600 and 390x844, light and dark.
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 const alpha = async (shot) => { const v = await b.newPage(); await v.setContent(`<img id=i src="data:image/png;base64,${shot.toString('base64')}">`); await v.waitForFunction(() => document.getElementById('i').complete)
  const r = await v.evaluate(() => { const i = document.getElementById('i'), cv = document.createElement('canvas'); cv.width = i.naturalWidth; cv.height = i.naturalHeight; const g = cv.getContext('2d'); g.drawImage(i, 0, 0)
   const a = (x, y) => g.getImageData(Math.round(x), Math.round(y), 1, 1).data[3]; const w = cv.width, h = cv.height
   return { corners: [a(3, 3), a(w - 4, 3), a(3, h - 4), a(w - 4, h - 4)], centre: a(w / 2, h / 2) } }); await v.close(); return r }
 for (const [n, vp] of [['square', { width: 600, height: 600 }], ['phone', { width: 390, height: 844 }]]) for (const scheme of ['dark', 'light']) for (const d3 of [false, true]) {
  const c = await b.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: 'block' }); const p = await c.newPage(); const errs = []
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/507|Failed to load resource/.test(m.text())) errs.push(m.text()) })
  const q = d3 ? '&d3=1' : ''
  await p.goto(U + '?display=1&transparent=1' + q + '#live', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-display .lv-svg'); await p.waitForTimeout(d3 ? 3000 : 1500)
  const on = await alpha(await p.screenshot({ omitBackground: true, path: `${S}/lvclear-${n}-${scheme}${d3 ? '-3d' : ''}.png` }))
  const st = await p.evaluate(() => ({ cls: document.documentElement.classList.contains('lv-transparent'), flow: document.querySelectorAll('.lv-display .lv-pulses circle').length, scrollX: document.documentElement.scrollWidth - innerWidth }))
  await p.goto(U + '?display=1' + q + '#live', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-display .lv-svg'); await p.waitForTimeout(1000)
  const off = await alpha(await p.screenshot({ omitBackground: true }))
  const plain = await p.evaluate(() => !document.documentElement.classList.contains('lv-transparent') && !document.querySelector('.lv-display-clear'))
  console.log(n, scheme, d3 ? '3d' : '2d', JSON.stringify({ on, st, off, plain }), errs)
  if (on.corners.some(x => x !== 0) || !(on.centre > 0) || !st.cls || !st.flow || st.scrollX > 0 || off.corners.some(x => x !== 255) || !plain || errs.length) fail(`${n} ${scheme} ${d3 ? '3d' : '2d'}`)
  await c.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })()
