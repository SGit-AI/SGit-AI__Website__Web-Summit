const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html#where';
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp }); const errs = []; p.on('pageerror', e => errs.push(e.message))
  await p.goto(U, { waitUntil: 'networkidle' }); await p.waitForSelector('svg[data-aw-map]', { timeout: 15000 })
  // the newest line of "you", from what the page keeps on this device
  const mine = () => p.evaluate(() => { const all = [...JSON.parse(localStorage.getItem('ak.where.demo.vault') || '[]'), ...JSON.parse(localStorage.getItem('ak.where.demo.queue') || '[]')].filter(r => r.type === 'line' && r.person === 'you').sort((a, b) => a.at.localeCompare(b.at)); const r = all[all.length - 1]; return r ? { place: r.place, lat: r.lat ?? null } : null })
  // a spot on open ground: a point of the map that is not a building
  const tapOpen = async () => { await p.locator('svg[data-aw-map]').scrollIntoViewIfNeeded(); const box = await p.locator('svg[data-aw-map]').boundingBox(); const vh = vp.height; for (const [fx, fy] of [[0.04, 0.5], [0.04, 0.3], [0.04, 0.7], [0.5, 0.04], [0.96, 0.5], [0.3, 0.1], [0.7, 0.1]]) { const x = box.x + box.width * fx, y = Math.min(vh - 120, Math.max(10, box.y + box.height * fy)); const hit = await p.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest('[data-aw-area]'), [x, y]); if (!hit) { await p.mouse.click(x, y); return true } } return false }
  await p.click('[data-aw-me]'); await p.waitForTimeout(150); const okTap1 = await tapOpen(); await p.waitForTimeout(300); const zone = await mine()
  const offer = await p.locator('[data-aw-exact]').count()
  await p.click('[data-aw-exact]'); await p.waitForTimeout(150); await tapOpen(); await p.waitForTimeout(300); const exact = await mine()
  const offerAfter = await p.locator('[data-aw-exact]').count()
  await p.click('[data-aw-me]'); await p.waitForTimeout(150); await tapOpen(); await p.waitForTimeout(300); const again = await mine()
  await p.screenshot({ path: `${S}/wzone-${n}.png` })
  console.log(n, JSON.stringify({ okTap1, zone, offer, exact, offerAfter, again, ov: await p.evaluate(() => document.documentElement.scrollWidth - innerWidth) }), errs)
  if (!okTap1 || !zone || zone.lat !== null || !/^Near /.test(zone.place) || offer !== 1 || exact.lat === null || offerAfter !== 0 || again.lat !== null || errs.length) fail(n)
  await p.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })()
