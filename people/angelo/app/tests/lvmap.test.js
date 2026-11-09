// spec-live-map.md section 2, drawn: while the map plays back, a key mark on each agent holding a published key (grey once
// ended), a thin gold ring once it has a lane, and a gold dot travelling for each "a key handed over", with nothing more said.
// At 1280 and 390 px, light and dark.
const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) };
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const scheme of ['light', 'dark']) {
  const p = await (await b.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: 'block' })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message))
  await p.goto(U + '#replay?w=all', { waitUntil: 'networkidle' }); await p.waitForSelector('.tm-svg [data-tm-f]', { timeout: 8000 }).catch(() => fail('no map'))
  const seek = v => p.evaluate(v => { const r = document.querySelector('[data-tmf-scrub]'); r.value = v === 'min' ? r.min : v === 'max' ? r.max : v; r.dispatchEvent(new Event('input', { bubbles: true })) }, v)
  const count = () => p.evaluate(() => ({ key: document.querySelectorAll('.tm-a.tmf-key').length, ended: document.querySelectorAll('.tm-a.tmf-keyend').length, lane: document.querySelectorAll('.tm-a.tmf-lane').length, marks: document.querySelectorAll('.tmf-km').length, seals: document.querySelectorAll('.tmf-seals circle:not(.z)').length }))
  await seek('max'); await p.waitForTimeout(400); const atEnd = await count()
  await seek('min'); await p.waitForTimeout(400); const atStart = await count()
  // a handover in the window: just after it, a gold dot is on its way (its size in the map's own units: the phone scales the map down)
  const hs = await p.evaluate(async () => { const d = await (await fetch('data.json')).json(), r = document.querySelector('[data-tmf-scrub]'); return d.replay.live.handovers.map(h => h[0]).filter(t => t >= +r.min && t <= +r.max) })
  let seal = null
  for (const t of [...new Set(hs)].slice(0, 12)) { await seek(t + 20); await p.waitForTimeout(250); seal = await p.evaluate(() => { const c = document.querySelector('.tmf-seals circle:not(.z)'); if (!c) return null; const s = getComputedStyle(c), r = c.getBoundingClientRect(), svg = c.ownerSVGElement, k = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width; return { fill: s.fill, title: c.querySelector('title').textContent, w: r.width / k, x: r.x, y: r.y, gold: getComputedStyle(document.documentElement).getPropertyValue('--rm-gold').trim() } }); if (seal) break }
  if (seal) await p.locator('.tm-svg').screenshot({ path: `${S}/lvmap-${n}-${scheme}.png` })
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  console.log(n, scheme, JSON.stringify({ atEnd, atStart, handovers: hs.length, seal, ov }), errs)
  if (!(atEnd.key >= 5) || !(atEnd.lane >= 3) || !(atEnd.marks >= atEnd.key)) fail(`${n} ${scheme}: marks at the end ${JSON.stringify(atEnd)}`)
  if (!(atStart.key + atStart.ended < atEnd.key + atEnd.ended) || !(atStart.lane < atEnd.lane)) fail(`${n} ${scheme}: the start should hold fewer ${JSON.stringify(atStart)}`)
  if (!hs.length || !seal) fail(`${n} ${scheme}: no "a key handed over" in flight`)
  else if (seal.title !== 'a key handed over' || !(seal.w >= 12) || seal.fill === 'none' || seal.fill === 'rgb(0, 0, 0)') fail(`${n} ${scheme}: the dot ${JSON.stringify(seal)}`)
  if (ov > 1 || errs.length) fail(`${n} ${scheme}: overflow ${ov} errors ${errs.join(' | ')}`)
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
