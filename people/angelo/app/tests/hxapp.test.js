const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path')
const S = process.argv[2], B = 'http://127.0.0.1:8765/people/angelo/app/', U = B + 'desktop/index.html'
// backlog 00a, the live graph as a hexagonal app (dev.app@PrompTugal.angelo): (1) the download page and install guide, at
// 1280 and 390 px, light and dark: its three ways, the first-open steps for unsigned apps, no sideways scroll, the web app
// manifest valid with its start_url on the display mode and every icon loading at its size; (2) opened as a Home Screen app
// (standalone) the page goes straight to the display mode, the same page as the pop-out; (3) the desktop app's own start-up
// script (INIT in desktop/src-tauri/src/main.rs, run here in Chromium): on a transparent window the corners stay clear and
// the hexagon is drawn, the graph moves, and Esc does not leave display mode; (4) its calm setting (15 frames a second).
const INIT = (fs.readFileSync(path.join(__dirname, '../desktop/src-tauri/src/main.rs'), 'utf8').match(/const INIT: &str = r#"([\s\S]*?)"#;/) || [])[1]
;(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const scheme of ['dark', 'light']) {
  const p = await (await b.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message))
  await p.goto(U, { waitUntil: 'networkidle' })
  const r = await p.evaluate(async () => {
   const m = document.querySelector('link[rel=manifest]'), man = m ? await (await fetch(m.href)).json() : null
   const icons = man ? await Promise.all(man.icons.map(i => new Promise(res => { const im = new Image(); im.onload = () => res(`${im.naturalWidth}x${im.naturalHeight}` === i.sizes); im.onerror = () => res(false); im.src = new URL(i.src, m.href) }))) : []
   const t = document.body.innerText
   return { man: !!man, start: man && new URL(man.start_url, m.href).href, scope: man && new URL(man.scope, m.href).pathname, display: man && man.display, icons, apple: !!document.querySelector('link[rel=apple-touch-icon]') && !!document.querySelector('meta[name=apple-mobile-web-app-capable]'),
    ways: ['desktop', 'ipad', 'browser'].every(id => document.getElementById(id)), mac: /Open Anyway/.test(t) && /right-click/.test(t), win: /More info/.test(t) && /Run anyway/.test(t), scrollX: document.documentElement.scrollWidth - innerWidth,
    live: !!document.querySelector('a[href="../index.html#live"]'), disp: !!document.querySelector('a[href="../index.html?display=1#live"]') } })
  await p.screenshot({ path: `${S}/hxapp-${n}-${scheme}.png`, fullPage: true })
  console.log(n, scheme, JSON.stringify(r), errs)
  if (!r.man || !/\/people\/angelo\/app\/index\.html\?display=1#live$/.test(r.start) || r.scope !== '/people/angelo/app/' || r.display !== 'standalone' || r.icons.length < 3 || !r.icons.every(Boolean) || !r.apple || !r.ways || !r.mac || !r.win || r.scrollX > 0 || !r.live || !r.disp || errs.length) fail(`page ${n} ${scheme}`)
  await p.close() }
 // (2) the Home Screen app: standalone goes to the display mode
 { const c = await b.newContext({ viewport: { width: 1024, height: 768 }, serviceWorkers: 'block' }); await c.addInitScript(() => Object.defineProperty(navigator, 'standalone', { get: () => true }))
  const p = await c.newPage(); await p.goto(U); await p.waitForSelector('.lv-display .lv-svg', { timeout: 15000 }).catch(() => { })
  const st = await p.evaluate(() => ({ url: location.pathname + location.search + location.hash, disp: !!document.querySelector('.lv-display .lv-svg') }))
  console.log('standalone', JSON.stringify(st)); if (st.url !== '/people/angelo/app/index.html?display=1#live' || !st.disp) fail('standalone'); await c.close() }
 // (3) the desktop app's start-up script on a transparent window
 { if (!INIT) fail('INIT not found in main.rs')
  const c = await b.newContext({ viewport: { width: 420, height: 420 }, colorScheme: 'dark', serviceWorkers: 'block' }); await c.addInitScript(INIT || '')
  const p = await c.newPage(); await p.goto(B + 'index.html?display=1&transparent=1#live', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-display .lv-svg'); await p.waitForTimeout(1500)
  const shot = await p.screenshot({ omitBackground: true, path: `${S}/hxapp-window.png` })
  const v = await b.newPage(); await v.setContent(`<img id=i src="data:image/png;base64,${shot.toString('base64')}">`); await v.waitForFunction(() => document.getElementById('i').complete)
  const px = await v.evaluate(() => { const i = document.getElementById('i'), cv = document.createElement('canvas'); cv.width = i.naturalWidth; cv.height = i.naturalHeight; const g = cv.getContext('2d'); g.drawImage(i, 0, 0)
   const a = (x, y) => g.getImageData(x, y, 1, 1).data[3]; const w = cv.width, h = cv.height
   return { corners: [a(3, 3), a(w - 4, 3), a(3, h - 4), a(w - 4, h - 4), a(w / 2, 4)], centre: a(w / 2, h / 2), rim: a(Math.round(w * 0.6), Math.round(h * 0.068)) } }); await v.close()
  const flow = await p.evaluate(() => document.querySelectorAll('.lv-display .lv-pulses circle').length)
  await p.keyboard.press('Escape'); await p.waitForTimeout(600); const stays = await p.evaluate(() => /display=1/.test(location.href))
  console.log('window', JSON.stringify({ px, flow, stays }))
  if (px.corners.some(x => x !== 0) || !(px.centre > 0) || !flow || !stays) fail('window')
  // (4) calm: frames a second held to about 15 when on (and remembered), about 60 when off; the graph still moves; the
  // right-click hands the menu the current setting; a cancelled frame never runs
  const fps = () => p.evaluate(() => new Promise(res => { let k = 0; const f = () => { k++; requestAnimationFrame(f) }; requestAnimationFrame(f); setTimeout(() => res(k), 1000) }))
  await p.evaluate(() => { window.__calls = []; window.__TAURI_INTERNALS__ = { invoke: (cmd, args) => { __calls.push([cmd, args]); return Promise.resolve() } } })
  const off = await fps(); await p.evaluate(() => __hexapp.setCalm(true)); const on = await fps()
  await p.mouse.click(210, 210, { button: 'right' }); const call = await p.evaluate(() => __calls.find(x => x[0] === 'show_menu'))
  const cancelled = await p.evaluate(() => new Promise(res => { let ran = false; const id = requestAnimationFrame(() => ran = true); cancelAnimationFrame(id); setTimeout(() => res(!ran), 300) }))
  const f0 = await p.evaluate(() => document.querySelectorAll('.lv-display .lv-pulses circle').length)
  await p.reload({ waitUntil: 'networkidle' }); await p.waitForSelector('.lv-display .lv-svg'); await p.waitForTimeout(1500)
  const kept = await p.evaluate(() => __hexapp.calm()), moving = await p.evaluate(() => document.querySelectorAll('.lv-display .lv-pulses circle').length)
  await p.evaluate(() => __hexapp.setCalm(false))
  console.log('calm', JSON.stringify({ off, on, call, cancelled, f0, kept, moving }))
  if (!(off >= 40) || !(on >= 10 && on <= 17) || !call || !call[1] || call[1].calm !== true || !cancelled || !kept || !moving) fail('calm')
  await c.close() }
 // (5) 3D, in step with the pop-out (1f87ac2: the popped-out 3D drew black): in the app's transparent window the 3D canvas
 // draws, the corners stay clear, it is not black (lit pixels), and the page's own hiding stands, so the app shows the same
 // flat layers as the browser's display mode (none, in 3D; the start-up script once forced them visible, a stray dot);
 // the menu's 3D entry is remembered across a reload, and turning it off goes back to the flat graph
 { const U3 = B + 'index.html?display=1&transparent=1&d3=1#live'
  const seen = p => p.evaluate(() => [...document.querySelectorAll('.lv-display .lv-svg > g')].filter(e => getComputedStyle(e).visibility === 'visible').length)
  const bc = await b.newContext({ viewport: { width: 420, height: 420 }, colorScheme: 'dark', serviceWorkers: 'block' }), bp = await bc.newPage()
  await bp.goto(U3, { waitUntil: 'networkidle' }); await bp.waitForSelector('.lv-display .lv-3d canvas', { timeout: 20000 }).catch(() => { }); const browserSeen = await seen(bp); await bc.close()
  const c = await b.newContext({ viewport: { width: 420, height: 420 }, colorScheme: 'dark', serviceWorkers: 'block' }); await c.addInitScript(INIT || '')
  const p = await c.newPage(); await p.goto(U3, { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-display .lv-3d canvas', { timeout: 20000 }).catch(() => { }); await p.waitForTimeout(2500)
  const appSeen = await seen(p), canvas = await p.evaluate(() => !!document.querySelector('.lv-display .lv-3d canvas'))
  const shot = await p.screenshot({ omitBackground: true, path: `${S}/hxapp-window-3d.png` })
  const v = await b.newPage(); await v.setContent(`<img id=i src="data:image/png;base64,${shot.toString('base64')}">`); await v.waitForFunction(() => document.getElementById('i').complete)
  const px = await v.evaluate(() => { const i = document.getElementById('i'), cv = document.createElement('canvas'); cv.width = i.naturalWidth; cv.height = i.naturalHeight; const g = cv.getContext('2d'); g.drawImage(i, 0, 0)
   const w = cv.width, h = cv.height, d = g.getImageData(0, 0, w, h).data, a = (x, y) => d[(y * w + x) * 4 + 3]
   let lit = 0; for (let y = Math.round(h * 0.15); y < h * 0.85; y += 2) for (let x = Math.round(w * 0.2); x < w * 0.8; x += 2) { const k = (y * w + x) * 4; if (Math.max(d[k], d[k + 1], d[k + 2]) > 140) lit++ }
   return { corners: [a(3, 3), a(w - 4, 3), a(3, h - 4), a(w - 4, h - 4), a(40, 40)], lit } }); await v.close()
  const menu = await p.evaluate(() => { window.__calls = []; window.__TAURI_INTERNALS__ = { invoke: (cmd, args) => { __calls.push([cmd, args]); return Promise.resolve() } }; return __hexapp.d3() })
  await p.mouse.click(210, 210, { button: 'right' }); const call = await p.evaluate(() => __calls.find(x => x[0] === 'show_menu'))
  // remembered: set on, then a fresh load of the flat page comes back in 3D; set off, back to flat
  await p.evaluate(() => __hexapp.set3d(true)); await p.goto(B + 'index.html?display=1&transparent=1#live', { waitUntil: 'networkidle' }); const kept = await p.evaluate(() => /[?&]d3=1/.test(location.search))
  await p.evaluate(() => __hexapp.set3d(false)); await p.waitForURL(u => !/d3=1/.test(String(u)), { timeout: 10000 }).catch(() => { }); await p.waitForSelector('.lv-display .lv-svg', { timeout: 15000 }).catch(() => { })
  const flat = await p.evaluate(() => !/d3=1/.test(location.search) && !document.querySelector('.lv-3d') && localStorage.getItem('hexapp-3d') === '0')
  console.log('3d', JSON.stringify({ canvas, browserSeen, appSeen, px, menu, call: call && call[1], kept, flat }))
  if (!canvas || appSeen !== browserSeen || px.corners.some(x => x !== 0) || !(px.lit >= 20) || menu !== true || !call || !call[1] || call[1].d3 !== true || !kept || !flat) fail('3d')
  await c.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })()
