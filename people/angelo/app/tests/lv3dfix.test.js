// backlog 0c2, three fixes to the 3D (Angelo, 8 November). (1) "The current 3D view in the replay page doesn't show the messages
// flowing": the map's 3D (#collab?map=1&d3=1), played back, draws the messages in flight (as many as the 2D playback has) and they
// move from one moment to the next, with their lines lit. (2) "it should spin a little faster": the live 3D turns once every 50 s
// by itself (it was about 105), and holds while a hand turns it. (3) "the 3d live version once popped out is all black
// shadows": the popped-out live 3D (a real Document Picture-in-Picture window) draws the people's colours, not black.
// (1) at 1280 and 390 px, (2) and (3) on a desktop (no pop-out on a phone); light and dark.
const { chromium } = require('playwright');
const S = process.argv[2], U = 'http://127.0.0.1:8765/people/angelo/app/index.html';
// how many of the people's colour families (hue buckets of 60 degrees) a picture holds, counting only clearly coloured pixels
const hues = async (p, png) => p.evaluate(async b64 => {
  const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode()
  const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0)
  const d = x.getImageData(0, 0, c.width, c.height).data, n = new Array(6).fill(0); let col = 0
  for (let i = 0; i < d.length; i += 4 * 3) { const r = d[i], g = d[i + 1], bl = d[i + 2], mx = Math.max(r, g, bl), mn = Math.min(r, g, bl); if (mx - mn < 70 || mx < 90) continue
    col++; let h = mx === r ? (g - bl) / (mx - mn) : mx === g ? 2 + (bl - r) / (mx - mn) : 4 + (r - g) / (mx - mn); h = (h * 60 + 360) % 360; n[Math.floor(h / 60)]++ }
  return { coloured: col, families: n.filter(v => v > 25).length, n }
}, png.toString('base64'));
(async () => { const b = await chromium.launch(); let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const scheme of ['light', 'dark']) {
  const ctx = await b.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: 'block' }), p = await ctx.newPage(), errs = []
  p.on('pageerror', e => errs.push(e.message))
  // (1) the replay's 3D
  await p.goto(U + '#collab?map=1&d3=1', { waitUntil: 'networkidle' }); await p.waitForSelector('.tm-3d canvas', { timeout: 20000 }).catch(() => fail(`${n} ${scheme}: no 3D map`))
  await p.selectOption('[data-tmf-speed]', '360'); await p.click('[data-tmf-play]'); await p.waitForTimeout(1200)
  const a = await p.evaluate(() => { const v = document.querySelector('[data-tm-3dv]').dataset; return { dots: +v.lv3dDots, lit: +v.lv3dLit, d2: document.querySelectorAll('.tmf-pulses circle:not(.z)').length } })
  const s1 = await p.locator('.tm-3d canvas').screenshot({ path: `${S}/lv3dfix-replay-${n}-${scheme}.png` }); await p.waitForTimeout(500)
  const s2 = await p.locator('.tm-3d canvas').screenshot(); let diff = 0; for (let i = 0; i < Math.min(s1.length, s2.length); i += 101) if (s1[i] !== s2[i]) diff++
  console.log(n, scheme, 'replay', JSON.stringify(a), 'diff', diff)
  if (!(a.d2 > 0) || !(a.dots > 0) || !(a.lit > 0)) fail(`${n} ${scheme}: replay's 3D draws ${a.dots} dots and ${a.lit} lit lines while 2D has ${a.d2} in flight`)
  if (diff < 5) fail(`${n} ${scheme}: replay's 3D does not move (${diff})`)
  if (n === 'desktop') {
   // (2) the live 3D's own turn
   await p.goto(U + '#live?d3=1', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-3dc', { timeout: 20000 }).catch(() => fail(`${scheme}: no live 3D`)); await p.waitForTimeout(3500)
   const t0 = await p.evaluate(() => { const r = (r => r.spin ? r.spin() : { turnS: 0, ry: 0 })(document.querySelector('[data-lv3d]').r3); return { ...r, at: performance.now() } }); await p.waitForTimeout(2000)
   const t1 = await p.evaluate(() => { const r = (r => r.spin ? r.spin() : { turnS: 0, ry: 0 })(document.querySelector('[data-lv3d]').r3); return { ...r, at: performance.now() } })
   const perTurn = 2 * Math.PI / ((t1.ry - t0.ry) / ((t1.at - t0.at) / 1000))
   const box = await p.locator('.lv-3dc').boundingBox(); await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await p.mouse.down()
   for (let i = 0; i < 6; i++) { await p.mouse.move(box.x + box.width / 2 + i * 10, box.y + box.height / 2); await p.waitForTimeout(60) }
   const h0 = await p.evaluate(() => (r => r.spin ? r.spin() : { turnS: 0, ry: 0 })(document.querySelector('[data-lv3d]').r3).ry); await p.waitForTimeout(800); const h1 = await p.evaluate(() => (r => r.spin ? r.spin() : { turnS: 0, ry: 0 })(document.querySelector('[data-lv3d]').r3).ry); await p.mouse.up()
   console.log(scheme, 'spin', t0.turnS, 'measured s per turn', perTurn.toFixed(1), 'held', (h1 - h0).toFixed(4))
   if (t0.turnS !== 50 || !(perTurn > 40 && perTurn < 62)) fail(`${scheme}: live 3D turns once every ${perTurn.toFixed(1)} s, not about 50`)
   if (Math.abs(h1 - h0) > 0.01) fail(`${scheme}: live 3D kept turning under the hand (${h1 - h0})`)
   // (3) the pop-out: a real Document Picture-in-Picture window, its 3D in the people's colours
   const has = await p.evaluate(() => !!window.documentPictureInPicture)
   if (!has) fail(`${scheme}: no Document Picture-in-Picture in this Chromium`)
   else {
    const before = await hues(p, await p.locator('.lv-3dc').screenshot())
    const pip = ctx.waitForEvent('page', { timeout: 10000 }).catch(() => null); await p.click('[data-lv-pop]'); const w = await pip
    if (!w) fail(`${scheme}: the pop-out did not open`)
    else { await w.waitForSelector('.lv-3dc', { timeout: 20000 }).catch(() => fail(`${scheme}: no 3D in the pop-out`)); await w.waitForTimeout(2500)
     const shot = await w.locator('.lv-3dc').screenshot({ path: `${S}/lv3dfix-pip-${scheme}.png` }), got = await hues(p, shot)
     console.log(scheme, 'pop-out', JSON.stringify(got), 'page before', JSON.stringify(before))
     if (got.families < 3 || got.coloured < before.coloured * 0.15) fail(`${scheme}: the popped-out 3D is dark (${got.families} colour families, ${got.coloured} coloured pixels; the page had ${before.families}, ${before.coloured})`)
     await w.close() }
   }
  }
  if (errs.length) fail(`${n} ${scheme}: errors ${errs.join(' | ')}`)
  await ctx.close() }
 await b.close(); console.log(ok ? 'PASS' : 'FAIL') })();
