// Backlog 0d, the floating live graph's labels (Angelo, 8 November: "it should show the RiskMandate and PT News logos; is should
// have a pulsing 'LIVE' label; it should show date & time of what's showing, which I expect to be a little in the past"). Inside the
// hexagon: both logos, local copies of their own sites' files (brand/README.md, so no other site is called) (the newsroom's stamp in the page's tone); LIVE pulsing while live.json is fresh,
// amber and still when it was built over 30 minutes ago, grey when it cannot be read (the old freshness light is gone); the moment on
// screen (now less the delay) in the viewer's time zone (the test runs in New York's). All of it inside the hexagon and readable from
// a 160 px pop-out to display mode at 1920 px, in 2D and in 3D, light and dark.
const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html', TZ = 'America/New_York';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 const cases = [['desktop', { width: 1280, height: 900 }, '#live'], ['phone', { width: 390, height: 844 }, '#live'], ['desktop-3d', { width: 1280, height: 900 }, '#live?d3=1'], ['display', { width: 1920, height: 1080 }, '#live', '&display=1']]
 for (const [n, vp, hash, extra] of cases) for (const scheme of ['dark', 'light']) {
  const p = await (await b.newContext({ viewport: vp, colorScheme: scheme, timezoneId: TZ, serviceWorkers: 'block' })).newPage(); const errs = []
  p.on('pageerror', e => errs.push(e.message))
  let mode = 'fresh'
  await p.route('**/live.json*', async r => { if (mode === 'down') return r.fulfill({ status: 503, body: '' }); const res = await r.fetch(); const L = await res.json(); L.built_at = new Date(Date.now() - (mode === 'stale' ? 40 : 2) * 6e4).toISOString(); await r.fulfill({ response: res, json: L }) })
  await p.goto(U + '?livepoll=1' + (extra || '') + hash, { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-svg')
  if (hash.includes('d3')) await p.waitForSelector('.lv-3d canvas', { timeout: 20000 }).catch(() => fail(`${n} ${scheme}: no 3D`))
  await p.waitForFunction(() => /\bon\b/.test(document.querySelector('[data-lv-live]').className), null, { timeout: 8000 }).catch(() => { })
  const st = () => p.evaluate(() => { const hx = document.querySelector('.lv-hex').getBoundingClientRect(), inside = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.left >= hx.left && r.right <= hx.right && r.top >= hx.top + hx.height * 0.066 && r.bottom <= hx.bottom - hx.height * 0.066 }
    const live = document.querySelector('[data-lv-live]'), when = document.querySelector('[data-lv-when]'), logos = [...document.querySelectorAll('.lv-logo')], cs = getComputedStyle(live), dotA = getComputedStyle(live.querySelector('i')).animationName
    return { cls: live.className, color: cs.color, anim: dotA, liveIn: inside(live), liveFont: parseFloat(cs.fontSize), logos: logos.map(i => ({ src: i.getAttribute('src'), w: i.getBoundingClientRect().width, inside: inside(i), loaded: i.naturalWidth > 0 })),
      when: when.textContent, shown: +when.dataset.lvShown, whenIn: inside(when), whenFont: parseFloat(getComputedStyle(when).fontSize), oldDot: !!document.querySelector('.lv-dot'), now: Date.now() } })
  const a = await st()
  // the page follows the viewer's locale (en-US here: 12-hour); a 24-hour expectation failed after 13:00 in New York (dev.map, 8 November)
  const expect = new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(a.shown))
  await p.locator('.lv-hex').screenshot({ path: `${S}/lvlabel-${n}-${scheme}.png` })
  mode = 'stale'; await p.waitForFunction(() => /\bold\b/.test(document.querySelector('[data-lv-live]').className), null, { timeout: 8000 }).catch(() => { }); const o = await st()
  mode = 'down'; await p.waitForFunction(() => /\boff\b/.test(document.querySelector('[data-lv-live]').className), null, { timeout: 15000 }).catch(() => { }); const d = await st()
  mode = 'fresh'
  let small = null
  if (!extra) { await p.evaluate(() => { const f = document.querySelector('.lv-frame'); f.style.cssText = 'width:160px;height:160px;min-height:0' }); await p.waitForTimeout(400); small = await st()
    await p.locator('.lv-frame').screenshot({ path: `${S}/lvlabel-${n}-${scheme}-small.png` }) }
  console.log(n, scheme, JSON.stringify({ a: { ...a, now: undefined }, expect, o: { cls: o.cls, color: o.color, anim: o.anim }, d: { cls: d.cls, anim: d.anim }, small: small && { liveIn: small.liveIn, whenIn: small.whenIn, liveFont: small.liveFont, whenFont: small.whenFont, logos: small.logos.map(l => [l.w | 0, l.inside]) } }), errs.slice(0, 2))
  if (!/\bon\b/.test(a.cls) || a.anim !== 'lv-pulse' || !a.liveIn || a.oldDot) fail(`${n} ${scheme}: LIVE while fresh ${JSON.stringify(a)}`)
  if (a.logos.length !== 2 || !/\/people\/angelo\/app\/brand\/riskmandate-mark\.svg$/.test(a.logos[0].src) || !/\/people\/angelo\/app\/brand\/pt-news-stamp-(light|dark)\.svg$/.test(a.logos[1].src) || a.logos.some(l => !l.inside || l.w < 14 || !l.loaded || !l.src.startsWith('http://127.0.0.1:8765/'))) fail(`${n} ${scheme}: logos ${JSON.stringify(a.logos)}`)
  if (!(Math.abs(a.now - 4 * 6e4 - a.shown) < 61e3) || !a.when.includes(expect) || !a.whenIn) fail(`${n} ${scheme}: the moment shown ${a.when} (${new Date(a.shown).toISOString()}), expected ${expect} in ${TZ}`)
  if (!/\bold\b/.test(o.cls) || o.anim !== 'none' || o.color === a.color) fail(`${n} ${scheme}: stale should be amber and still ${JSON.stringify(o)}`)
  if (!/\boff\b/.test(d.cls) || d.anim !== 'none') fail(`${n} ${scheme}: unreadable should be grey and still ${JSON.stringify(d)}`)
  if (small && (!small.liveIn || !small.whenIn || small.liveFont < 8 || small.whenFont < 8)) fail(`${n} ${scheme}: a 160 px window ${JSON.stringify(small)}`)
  if (errs.length) fail(`${n} ${scheme}: errors ${errs.join(' | ')}`)
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
