const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
// the live graph's floating window where Document Picture-in-Picture is missing (Safari on a Mac or iPad): the graph drawn into a
// canvas, played as a video in picture-in-picture. Chromium has both, so ?pip=video forces the video path. Checks: Pop out is
// enabled and says what it does; the video plays a picture of the graph (its colours resolved, not a black or empty frame) that
// changes over time; the graph stays on the page; closing removes the video and the button comes back. At 1280 and 390 px, light and dark.
// What this cannot check: Safari itself (Playwright's WebKit is not in the sessions) and how Safari treats a hidden page.
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const scheme of ['dark', 'light']) {
  const p = await (await b.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/507|Failed to load resource/.test(m.text())) errs.push(m.text()) })
  await p.goto(U + '?pip=video#live', { waitUntil: 'networkidle' }); await p.waitForSelector('[data-lv-frame] .lv-svg'); await p.waitForTimeout(800)
  const before = await p.evaluate(() => { const x = document.querySelector('[data-lv-pop]'); return { enabled: !x.disabled, note: document.querySelector('[data-lv-note]').textContent } })
  await p.click('[data-lv-pop]'); await p.waitForTimeout(1500)
  // one frame of the video, read back: how many distinct colours, and how much of it is not the background
  const grab = () => p.evaluate(() => { const v = document.querySelector('[data-lv-pipvideo]'); if (!v || !v.videoWidth) return null
    const c = document.createElement('canvas'); c.width = 220; c.height = 220; const x = c.getContext('2d'); x.drawImage(v, 0, 0, 220, 220); const d = x.getImageData(0, 0, 220, 220).data
    const cols = new Set(); let fg = 0; const bg = [d[0], d[1], d[2]]; for (let i = 0; i < d.length; i += 4) { cols.add((d[i] >> 4) + ',' + (d[i + 1] >> 4) + ',' + (d[i + 2] >> 4)); if (Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]) > 40) fg++ }
    return { w: v.videoWidth, playing: !v.paused, pip: document.pictureInPictureElement === v, cols: cols.size, fg, sum: [...d].reduce((a, y, i) => a + y * ((i % 97) + 1), 0) } })
  const f1 = await grab(); await p.waitForTimeout(1200); const f2 = await grab()
  const mid = await p.evaluate(() => ({ btn: document.querySelector('[data-lv-pop]').textContent, inline: !!document.querySelector('[data-lv-frame] .lv-svg'), note: document.querySelector('[data-lv-note]').textContent }))
  if (f1) await p.evaluate(() => { const v = document.querySelector('[data-lv-pipvideo]'), c = document.createElement('canvas'); c.width = c.height = 440; c.getContext('2d').drawImage(v, 0, 0, 440, 440); const i = new Image(); i.src = c.toDataURL(); i.id = 'shot'; i.style.cssText = 'position:fixed;right:0;top:0;width:220px;height:220px;z-index:99;border:1px solid red'; document.body.appendChild(i) })
  await p.screenshot({ path: `${S}/lvpip-${n}-${scheme}.png` })
  await p.click('[data-lv-pop]'); await p.waitForTimeout(500)
  const after = await p.evaluate(() => ({ video: !!document.querySelector('[data-lv-pipvideo]'), btn: document.querySelector('[data-lv-pop]').textContent, inline: !!document.querySelector('[data-lv-frame] .lv-svg') }))
  console.log(n, scheme, JSON.stringify({ before, f1, f2: f2 && { cols: f2.cols, fg: f2.fg }, moved: !!(f1 && f2 && f1.sum !== f2.sum), mid, after }), errs)
  if (!before.enabled || !/floating window/.test(before.note) || !f1 || f1.w < 400 || !f1.playing || f1.cols < 6 || f1.fg < 500 || !f2 || f1.sum === f2.sum || !mid.inline || !/Close/.test(mid.btn) || /could not open/.test(mid.note) || after.video || !/Pop out/.test(after.btn) || !after.inline || errs.length) fail(n + ' ' + scheme)
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })()
