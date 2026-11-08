const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
// the live graph's full screen and display mode (spec-realtime.md): the Full screen button fills the screen with the graph;
// ?display=1#live is the graph alone, covering the page, no controls and no text but the first names, the hexagon as large as the screen allows,
// still moving; reads that fail are tried again and it recovers when the network returns; Esc goes back to the normal view.
// At 1920x1080 (the stand's screen), 1280 and 390 px, light and dark.
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const [n, vp] of [['stand', { width: 1920, height: 1080 }], ['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const scheme of ['dark', 'light']) {
  const p = await (await b.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/507|Failed to load resource/.test(m.text())) errs.push(m.text()) })
  let down = false, reads = 0
  await p.route('**/live.json*', async r => { reads++; if (down) return r.abort('internetdisconnected'); await r.continue() })
  // the normal view: a Full screen button that fills the screen with the graph
  await p.goto(U + '?livepoll=2#live', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-svg')
  const fsBtn = await p.evaluate(() => { const x = document.querySelector('[data-lv-fs]'); return x && !x.hidden })
  if (fsBtn) await p.click('[data-lv-fs]'); await p.waitForTimeout(500)
  const fs = await p.evaluate(() => { const e = document.fullscreenElement; return e ? e.matches('[data-lv-frame]') && Math.abs(e.getBoundingClientRect().width - innerWidth) < 2 : false })
  await p.evaluate(() => document.exitFullscreen && document.fullscreenElement && document.exitFullscreen()).catch(() => { })
  // display mode
  await p.goto(U + '?display=1&livepoll=2#live', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-display .lv-svg'); await p.waitForTimeout(1500)
  const st = () => p.evaluate(() => { const d = document.querySelector('.lv-display').getBoundingClientRect(), h = document.querySelector('.lv-display .lv-hex').getBoundingClientRect(), top = document.elementFromPoint(innerWidth / 2, innerHeight / 2)
    return { covers: d.left <= 0 && d.top <= 0 && d.width >= innerWidth - 1 && d.height >= innerHeight - 1, hex: Math.round(h.width), short: Math.min(innerWidth, innerHeight), onTop: !!(top && top.closest('.lv-display')),
      buttons: document.querySelectorAll('.lv-display button, .lv-display a').length, txt: document.querySelector('.lv-display .lv').textContent.length, flow: document.querySelectorAll('.lv-display .lv-pulses circle').length, dot: document.querySelector('.lv-dot').className, scrollX: document.documentElement.scrollWidth - innerWidth } })
  const a = await st()
  await p.screenshot({ path: `${S}/lvdisp-${n}-${scheme}.png` })
  // the network goes: reads fail, nothing breaks, the graph keeps flowing; then it comes back and is read at once
  down = true; await p.context().setOffline(true); await p.waitForTimeout(6500); const off = await st()
  await p.context().setOffline(false); down = false; const r0 = reads; await p.evaluate(() => dispatchEvent(new Event('online'))); await p.waitForTimeout(1200); const back = await st(), reread = reads > r0
  await p.keyboard.press('Escape'); await p.waitForTimeout(800)
  const esc = await p.evaluate(() => !/display=1/.test(location.href) && !!document.querySelector('[data-lv-frame] .lv-svg'))
  console.log(n, scheme, JSON.stringify({ fsBtn, fs, a, off: [off.flow, off.dot], back: [back.flow, back.dot], reread, esc }), errs)
  if (!fsBtn || !fs || !a.covers || !a.onTop || a.hex < a.short * 0.9 || a.buttons || a.txt > 100 || !a.flow || a.scrollX > 0 || !off.flow || !/off/.test(off.dot) || /off/.test(back.dot) || !reread || !esc || errs.length) fail(n + ' ' + scheme)
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })()
