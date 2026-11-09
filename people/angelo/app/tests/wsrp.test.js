const { chromium } = require('playwright')
const S = process.argv[2] || require('os').tmpdir(), BASE = 'http://127.0.0.1:8765/people/angelo/app/'
// wsrp (backlog 0c4, spec-work-view.md part 3): as wvrp, for Workstreams in playback (r_ws=1, workstreams.json). wvrp: the work view in playback (backlog 0f2, spec-work-view.md; work-replay.js's mountMap, app.js's drawCollab). The map's
// playback bar carries "Exchanges | Work"; Exchanges by default with no work file loaded; Work (r_work=1 in the address) opens the
// map's frame for the rim (viewBox), draws the ten squares, and as the playback runs over the window icons fly and the squares
// count; the address keeps it through a change of window; Exchanges puts the map back as it was. At 1280 and 390 px, dark and light.
const fails = []; const fail = m => { fails.push(m); console.log('  FAIL', m) }
;(async () => {
  const b = await chromium.launch(); const out = {}
  for (const [w, h] of [[1280, 900], [390, 844]]) for (const scheme of ['dark', 'light']) {
    const tag = `${w}-${scheme}`
    const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, serviceWorkers: 'block' }); await ctx.addInitScript(t => { try { localStorage.setItem('cc.theme', JSON.stringify(t)) } catch { } }, scheme); const p = await ctx.newPage(); const errs = []   // the app's own theme choice wins over the scheme (dashboard@'s a32ac287)
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/507|favicon|500|ERR_/.test(m.text())) errs.push(m.text()) })
    await p.goto(BASE + 'index.html#collab?map=1', { waitUntil: 'networkidle' }); await p.waitForSelector('[data-tmf-play]')
    const st = () => p.evaluate(() => ({ sw: [...document.querySelectorAll('[data-wv-sw] a')].map(a => a.textContent + ':' + a.getAttribute('aria-pressed')), sq: document.querySelectorAll('.tm-svg .wv-sq').length,
      vb: document.querySelector('.tm-svg').getAttribute('viewBox'), loaded: !!window.AngeloWorkReplay, fly: document.querySelectorAll('.tm-svg .wv-fly').length,
      n: [...document.querySelectorAll('.tm-svg .wv-n')].filter(e => e.style.display !== 'none').length, over: document.documentElement.scrollWidth > innerWidth }))
    const ex = await st()
    if (ex.sw.join() !== 'Messages:true,Workstreams:false,Deliverables:false') fail(`${tag}: the switch on opening ${ex.sw.join()}`)
    if (ex.sq || ex.vb !== '0 0 1000 1000') fail(`${tag}: work drawn in Exchanges ${JSON.stringify(ex)}`)
    if (ex.loaded) fail(`${tag}: work files loaded before Work was asked for`)
    await p.click('[data-wv-sw] a:has-text("Workstreams")')
    await p.waitForFunction(() => document.querySelectorAll('.tm-svg .wv-sq').length === 10, null, { timeout: 8000 }).catch(() => null)
    const wk = await st()
    if (!/r_ws=1/.test(await p.evaluate(() => location.hash))) fail(`${tag}: the address does not say Work`)
    if (wk.sw.join() !== 'Messages:false,Workstreams:true,Deliverables:false') fail(`${tag}: the switch in Work ${wk.sw.join()}`)
    if (wk.sq !== 10) fail(`${tag}: ${wk.sq} squares in Work`)
    if (wk.vb === '0 0 1000 1000') fail(`${tag}: the map's frame was not opened for the rim`)
    if (wk.over) fail(`${tag}: the page scrolls sideways`)
    // play the window from its start: icons fly, the squares count
    await p.$eval('[data-tmf-scrub]', s => { s.value = s.min; s.dispatchEvent(new Event('input')) })
    await p.click('[data-tmf-play]'); let maxFly = 0, shot = false
    { const th = await p.evaluate(() => { const on = document.querySelector('[data-wv-sw] .on'), off = document.querySelector('[data-wv-sw] a:not(.on)'), cs = e => getComputedStyle(e); return { theme: document.documentElement.dataset.theme, onBg: cs(on).backgroundColor, offBg: cs(off).backgroundColor, line: cs(on).textDecorationLine } })
      if (th.theme !== scheme) fail(`${tag}: the page is in the ${th.theme} theme, not ${scheme}`)
      if (th.onBg === th.offBg || th.line !== 'none') fail(`${tag}: the switch's on state is not filled ${JSON.stringify(th)}`) }   // dashboard@'s a32ac287
    for (let i = 0; i < 40; i++) { await p.waitForTimeout(250); const s = await st(); maxFly = Math.max(maxFly, s.fly); if (s.fly && !shot) { await p.locator('section.tm').screenshot({ path: `${S}/wsrp-${tag}.png` }); shot = true } }
    const end = await st()
    if (!maxFly) fail(`${tag}: no icon flew in playback`)
    if (!end.n) fail(`${tag}: no square counts after playback`)
    if (!shot) await p.locator('section.tm').screenshot({ path: `${S}/wsrp-${tag}.png` })
    // the window changes, Work stays
    await p.selectOption('[data-tmf-w]', '72h'); await p.waitForSelector('[data-tmf-play]')
    await p.waitForFunction(() => document.querySelectorAll('.tm-svg .wv-sq').length === 10, null, { timeout: 8000 }).catch(() => null)
    const w72 = await st(), h72 = await p.evaluate(() => location.hash)
    if (!/r_ws=1/.test(h72) || !/w=72h/.test(h72) || w72.sq !== 10) fail(`${tag}: Work lost on a change of window (${h72}, ${w72.sq} squares)`)
    await p.click('[data-wv-sw] a:has-text("Messages")'); await p.waitForTimeout(700)
    const back = await st()
    if (back.sq || back.vb !== '0 0 1000 1000' || /r_ws/.test(await p.evaluate(() => location.hash))) fail(`${tag}: Work left behind after Exchanges ${JSON.stringify(back)}`)
    if (errs.length) fail(`${tag}: page errors: ` + errs.slice(0, 3).join(' | '))
    out[tag] = { squares: wk.sq, maxFly, counted: end.n }
    await ctx.close()
  }
  console.log(JSON.stringify(out))
  await b.close(); console.log(fails.length ? 'FAIL' : 'PASS'); process.exit(fails.length ? 1 : 0)
})().catch(e => { console.log('  FAIL', e.message); console.log('FAIL'); process.exit(1) })
