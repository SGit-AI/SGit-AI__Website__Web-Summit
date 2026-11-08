const { chromium, devices } = require('playwright')
// backlog 0m, the stand's iPads (dev.app@ with dev.abp@): the ABP player at Chromium's iPad profiles with touch, both ways round.
// Safari itself is not in these sessions; this checks what a page can do for it: the Home Screen tags, touch-action on every
// control (no double-tap zoom), the loop asking to keep the screen on (a stubbed navigator.wakeLock records the call), the
// picture inside the visible window, no sideways scroll, a tap on a dial stop turning it on, and a stop with no recorded run
// saying so on the button. Run from the repository's root while it is served on 127.0.0.1:8765
// (python3 -m http.server 8765):  node people/angelo/proposals/abp-live/tests/ipad.test.js <screenshot folder>
const S = process.argv[2] || '.', U = 'http://127.0.0.1:8765/people/angelo/proposals/abp-live/player.htm'
;(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const dn of ['iPad (gen 7) landscape', 'iPad (gen 7)', 'iPad Pro 11 landscape', 'iPad Pro 11']) for (const mode of ['loop', 'interactive']) {
  const c = await b.newContext({ ...devices[dn], serviceWorkers: 'block' })
  await c.addInitScript(() => { window.__wake = 0; Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request: () => { window.__wake++; return Promise.resolve({ release() { } }) } } }) })
  const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message))
  await p.goto(`${U}?mode=${mode}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500)
  const r = await p.evaluate(mode => {
   const meta = n => (document.querySelector(`meta[name="${n}"]`) || {}).content
   const ctl = [...document.querySelectorAll('button,input,label')].filter(x => x.offsetParent)
   const svg = document.querySelector(mode === 'loop' ? '#lSvg' : '#iSvg').getBoundingClientRect()
   const off = [...document.querySelectorAll('.stop:disabled')].map(x => x.textContent)
   return { home: meta('apple-mobile-web-app-capable') === 'yes' && !!meta('apple-mobile-web-app-title'), ctl: ctl.length,
    notouch: ctl.filter(x => getComputedStyle(x).touchAction !== 'manipulation').length, wake: window.__wake,
    svgH: Math.round(svg.height), fits: mode === 'interactive' || svg.bottom <= innerHeight + 1, scrollX: document.documentElement.scrollWidth - innerWidth,
    offSaid: off.every(t => /not recorded yet/.test(t)), offN: off.length }
  }, mode)
  let tap = true
  if (mode === 'interactive') {                          // tap the first stop that is not on and not disabled; it turns on
   const i = await p.evaluate(() => [...document.querySelectorAll('.stop')].findIndex(x => !x.disabled && !x.classList.contains('on')))
   if (i < 0) tap = false; else { await p.locator('.stop').nth(i).tap(); await p.waitForTimeout(500); tap = await p.evaluate(i => document.querySelectorAll('.stop')[i].classList.contains('on'), i) }
  }
  await p.screenshot({ path: `${S}/abp-ipad-${dn.replace(/\W/g, '')}-${mode}.png` })
  console.log(dn, mode, JSON.stringify(r), 'tap', tap, errs)
  if (!r.home || !r.ctl && mode === 'interactive' || r.notouch || r.svgH < 200 || !r.fits || r.scrollX > 0 || !r.offSaid || errs.length || !tap ||
   (mode === 'loop' && r.wake < 1) || (mode === 'interactive' && r.wake)) fail(`${dn} ${mode}`)
  await c.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })()
