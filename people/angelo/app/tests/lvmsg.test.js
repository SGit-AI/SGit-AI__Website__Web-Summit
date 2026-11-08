// spec-live-map.md section 2, the last event: "a sealed message sent or verified", only where an agent says so in its own commit.
// data.json's replay.live.messages holds [minute, agent, 'sent'|'verified', short commit], never the subject's text; while the map
// plays back, a dot with a lock appears at the sender, in its person's colour, titled "a sealed message sent|verified" and linked
// to that commit. At 1280 and 390 px, light and dark.
const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) };
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const scheme of ['light', 'dark']) {
  const p = await (await b.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message))
  await p.goto(U + '#replay?w=all', { waitUntil: 'networkidle' }); await p.waitForSelector('.tm-svg [data-tm-f]', { timeout: 8000 }).catch(() => fail('no map'))
  const seek = v => p.evaluate(v => { const r = document.querySelector('[data-tmf-scrub]'); r.value = v === 'min' ? r.min : v === 'max' ? r.max : v; r.dispatchEvent(new Event('input', { bubbles: true })) }, v)
  // the data: well formed, short commits only, no text beyond the kind
  const data = await p.evaluate(async () => { const d = await (await fetch('data.json')).json(), r = document.querySelector('[data-tmf-scrub]'); return { ms: d.replay.live.messages || [], min: +r.min, max: +r.max } })
  const bad = data.ms.filter(m => m.length !== 4 || typeof m[0] !== 'number' || !/^(sent|verified)$/.test(m[2]) || !/^[0-9a-f]{7,12}$/.test(m[3]))
  if (data.ms.length < 3 || bad.length) fail(`${n} ${scheme}: messages ${data.ms.length}, malformed ${JSON.stringify(bad.slice(0, 2))}`)
  await seek('min'); await p.waitForTimeout(250)
  const none = await p.evaluate(() => document.querySelectorAll('.tmf-msgs a:not(.z)').length)
  let dot = null
  for (const m of data.ms.filter(m => m[0] >= data.min && m[0] <= data.max).slice(0, 9)) {
    await seek(m[0] + 10); await p.waitForTimeout(300)
    dot = await p.evaluate(h => { const a = [...document.querySelectorAll('.tmf-msgs a:not(.z)')].find(a => a.dataset.h === h); if (!a) return null; const c = a.querySelector('circle'), r = c.getBoundingClientRect(), svg = a.ownerSVGElement, k = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width
      return { title: a.querySelector('title').textContent, href: a.getAttribute('href'), fill: getComputedStyle(c).fill, lock: !!a.querySelector('path'), w: r.width / k, op: +a.style.opacity } }, m[3])
    if (dot) { dot.kind = m[2]; dot.h = m[3]; break }
  }
  if (dot) await p.locator('.tm-svg').screenshot({ path: `${S}/lvmsg-${n}-${scheme}.png` })
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  console.log(n, scheme, JSON.stringify({ messages: data.ms.length, none, dot, ov }), errs)
  if (none) fail(`${n} ${scheme}: ${none} lock dots at the window's start, before any message`)
  if (!dot) fail(`${n} ${scheme}: no lock dot just after a claimed message`)
  else if (dot.title !== `a sealed message ${dot.kind}` || !dot.href.endsWith(`/commit/${dot.h}`) || !dot.lock || !(dot.w >= 12) || dot.fill === 'none' || !(dot.op > 0.3)) fail(`${n} ${scheme}: the dot ${JSON.stringify(dot)}`)
  if (ov > 1 || errs.length) fail(`${n} ${scheme}: overflow ${ov} errors ${errs.join(' | ')}`)
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
