const { chromium, devices } = require('playwright')
// backlog 0m, the stand's iPads, for the step view (steps.htm, Angelo's two stories at five rungs; dev.abp@, 9 November).
// Safari is not in these sessions; this checks, at Chromium's iPad profiles with touch, both ways round, what the page can do
// for it: the Home Screen tags; touch-action on every control (no double-tap zoom); the loop (?loop=1) asking to keep the
// screen on and the plain view not asking (a stubbed navigator.wakeLock counts the calls); the picture and the bubble inside
// the visible window in the loop; no sideways scroll; a tap on a rung turning it on; no page error.
// Run from the repository's root while it is served on 127.0.0.1:8765 (python3 -m http.server 8765):
//   node people/angelo/proposals/abp-live/tests/ipad-steps.test.js [screenshot folder]
const S = process.argv[2] || '.', U = (process.env.BASE || 'http://127.0.0.1:8765') + '/people/angelo/proposals/abp-live/steps.htm'
;(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const dn of ['iPad (gen 7) landscape', 'iPad (gen 7)', 'iPad Pro 11 landscape', 'iPad Pro 11']) for (const mode of ['loop', 'view']) {
  const c = await b.newContext({ ...devices[dn], serviceWorkers: 'block' })
  await c.addInitScript(() => { window.__wake = 0; Object.defineProperty(navigator, 'wakeLock', { configurable: true, value: { request: () => { window.__wake++; return Promise.resolve({ release() { } }) } } }) })
  const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message))
  await p.goto(mode === 'loop' ? `${U}?loop=1` : U, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500)
  const r = await p.evaluate(() => {
   const meta = n => (document.querySelector(`meta[name="${n}"]`) || {}).content
   const ctl = [...document.querySelectorAll('button,.ladder li')].filter(x => x.offsetParent)
   const svg = document.getElementById('svg').getBoundingClientRect(), bub = document.getElementById('bubble').getBoundingClientRect()
   return { home: meta('apple-mobile-web-app-capable') === 'yes' && !!meta('apple-mobile-web-app-title'), ctl: ctl.length,
    notouch: ctl.filter(x => getComputedStyle(x).touchAction !== 'manipulation').length, wake: window.__wake,
    svgH: Math.round(svg.height), bubbleIn: bub.bottom <= innerHeight + 1, scrollX: document.documentElement.scrollWidth - innerWidth,
    title: document.getElementById('title').textContent }
  })
  let tap = true
  if (mode === 'view') {                                 // tap a rung button that is not on; it turns on
   const i = await p.evaluate(() => [...document.querySelectorAll('#rungs button')].findIndex(x => !x.classList.contains('on')))
   if (i < 0) tap = false; else { await p.locator('#rungs button').nth(i).tap(); await p.waitForTimeout(500); tap = await p.evaluate(i => document.querySelectorAll('#rungs button')[i].classList.contains('on'), i) }
  }
  await p.screenshot({ path: `${S}/abp-steps-ipad-${dn.replace(/\W/g, '')}-${mode}.png` })
  console.log(dn, mode, JSON.stringify(r), 'tap', tap, errs)
  if (!r.home || !r.ctl || r.notouch || r.svgH < 150 || r.scrollX > 0 || errs.length || !tap || !r.title ||
   (mode === 'loop' && (r.wake < 1 || !r.bubbleIn)) || (mode === 'view' && r.wake)) fail(`${dn} ${mode}`)
  await c.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })()
