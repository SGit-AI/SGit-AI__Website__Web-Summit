const { chromium, devices } = require('playwright')
const S = process.argv[2], B = 'http://127.0.0.1:8765/people/angelo/', U = B + 'app/desktop/ipad.html'
// backlog 0m, the stand's iPads (dev.app@PrompTugal.angelo): (1) the set-up page at 1280 and 390 px, light and dark: its
// sections (links, once per iPad, each morning), Auto-Lock and Guided Access named, no sideways scroll, every link on it
// answering; (2) at iPad sizes with touch (Chromium's iPad profiles; Safari itself is not in these sessions): the live graph's
// display mode and the ABP player's two modes draw, with no page error and no sideways scroll, and the interactive player's
// buttons are big enough for a finger, and a tap on the second story selects it.
;(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const scheme of ['dark', 'light']) {
  const p = await (await b.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message))
  await p.goto(U, { waitUntil: 'networkidle' })
  const r = await p.evaluate(async () => {
   const t = document.body.innerText, hrefs = [...document.querySelectorAll('#links ~ ul a, .hx-steps a')].map(a => a.href)
   const st = await Promise.all([...new Set(hrefs)].map(h => fetch(h.split('#')[0]).then(x => x.status).catch(() => 0)))
   return { secs: ['links', 'setup', 'day'].every(id => document.getElementById(id)), lock: /Auto-Lock/.test(t) && /Never/.test(t), guided: /Guided Access/.test(t) && /triple-click/.test(t), n: hrefs.length, st, scrollX: document.documentElement.scrollWidth - innerWidth }
  })
  await p.screenshot({ path: `${S}/hxappipad-${n}-${scheme}.png`, fullPage: true })
  console.log(n, scheme, JSON.stringify(r), errs)
  if (!r.secs || !r.lock || !r.guided || r.n < 4 || !r.st.every(s => s === 200) || r.scrollX > 0 || errs.length) fail(`page ${n} ${scheme}`)
  await p.close() }
 for (const dn of ['iPad (gen 7) landscape', 'iPad Pro 11']) for (const [w, u, sel] of [['display', 'app/index.html?display=1#live', '.lv-display .lv-svg'], ['loop', 'proposals/abp-live/player.htm?mode=loop', 'svg'], ['interactive', 'proposals/abp-live/player.htm?mode=interactive', 'svg']]) {
  const c = await b.newContext({ ...devices[dn], serviceWorkers: 'block' }), p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message))
  await p.goto(B + u, { waitUntil: 'networkidle' }); await p.waitForSelector(sel, { timeout: 15000 }).catch(() => { }); await p.waitForTimeout(1500)
  const r = await p.evaluate(sel => ({ drawn: !!document.querySelector(sel), scrollX: document.documentElement.scrollWidth - innerWidth,
   btns: [...document.querySelectorAll('button')].filter(x => x.offsetParent).map(x => { const q = x.getBoundingClientRect(); return Math.round(Math.min(q.width, q.height)) }) }), sel)
  let tapped = true
  if (w === 'interactive') { const sel1 = () => p.evaluate(() => [...document.querySelectorAll('button')].filter(x => x.offsetParent).findIndex(x => /\bsel\b/.test(x.className))); const before = await sel1(); await p.locator('button:visible').nth(1).tap().catch(() => { tapped = false }); await p.waitForTimeout(800); tapped = tapped && before === 0 && await sel1() === 1 }
  await p.screenshot({ path: `${S}/hxappipad-${dn.replace(/\W/g, '')}-${w}.png` })
  console.log(dn, w, JSON.stringify(r), 'tapped', tapped, errs)
  if (!r.drawn || r.scrollX > 0 || errs.length || (w === 'interactive' && (!r.btns.length || r.btns.some(x => x < 32) || !tapped))) fail(`${dn} ${w}`)
  await c.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })()
