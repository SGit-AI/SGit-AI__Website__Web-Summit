const { chromium } = require('playwright')
const S = process.argv[2] || require('os').tmpdir(), BASE = 'http://127.0.0.1:8765/people/angelo/app/'
// wvsw: the "Exchanges | Work" switch on #live (app.js, backlog 0f2, spec-work-view.md). Exchanges by default, with no work file
// loaded; Work (#live?v=work) loads the work files, draws the ten squares on the live graph through live.js's hook and shows the
// legend's six icons in one line under the graph; back to Exchanges removes the drawing and the legend. At 1280 and 390 px, dark
// and light; the newsroom's file is answered here so the test needs no outside network.
const fails = []; const fail = m => { fails.push(m); console.log('  FAIL', m) }
;(async () => {
  const b = await chromium.launch(); const out = {}
  for (const [w, h] of [[1280, 900], [390, 844]]) for (const scheme of ['dark', 'light']) {
    const tag = `${w}-${scheme}`
    const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, serviceWorkers: 'block' }); const p = await ctx.newPage(); const errs = []
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/507|favicon|500|ERR_/.test(m.text())) errs.push(m.text()) })
    await p.route('https://promptugal.news/**', r => r.fulfill({ json: { stories: [] }, headers: { 'access-control-allow-origin': '*' } }))
    await p.goto(BASE + 'index.html#live', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-svg')
    const st = () => p.evaluate(() => ({ sw: [...document.querySelectorAll('[data-wv-sw] a')].map(a => a.textContent + ':' + a.getAttribute('aria-pressed')), sq: document.querySelectorAll('.wv-sq').length,
      leg: (() => { const l = document.querySelector('[data-wv-legend]'); return l && !l.hidden ? l.querySelectorAll('svg').length : 0 })(), loaded: !!window.AngeloWorkLive,
      cls: !!document.querySelector('.lv.lv-workview'), over: document.documentElement.scrollWidth > innerWidth }))
    const ex = await st()
    if (ex.sw.join() !== 'Exchanges:true,Work:false') fail(`${tag}: the switch on opening ${ex.sw.join()}`)
    if (ex.sq || ex.leg || ex.cls) fail(`${tag}: work drawn in Exchanges ${JSON.stringify(ex)}`)
    if (ex.loaded) fail(`${tag}: work files loaded before Work was asked for`)
    await p.click('[data-wv-sw] a:has-text("Work")')
    await p.waitForFunction(() => document.querySelectorAll('.wv-sq').length === 10, null, { timeout: 8000 }).catch(() => null)
    await p.waitForTimeout(600)
    const wk = await st()
    if (!/v=work/.test(await p.evaluate(() => location.hash))) fail(`${tag}: the address does not say Work`)
    if (wk.sw.join() !== 'Exchanges:false,Work:true') fail(`${tag}: the switch in Work ${wk.sw.join()}`)
    if (wk.sq !== 10) fail(`${tag}: ${wk.sq} squares in Work`)
    if (wk.leg !== 6) fail(`${tag}: legend icons ${wk.leg}`)
    if (!wk.cls) fail(`${tag}: the graph is not in the work view`)
    if (wk.over) fail(`${tag}: the page scrolls sideways`)
    if (w === 390) { const lines = await p.evaluate(() => { const l = document.querySelector('[data-wv-legend]'); return Math.round(l.querySelector('span').getBoundingClientRect().height) }); if (lines > 24) fail(`${tag}: a legend item wraps (${lines} px)`) }
    await p.screenshot({ path: `${S}/wvsw-${tag}.png`, fullPage: false })
    await p.click('[data-wv-sw] a:has-text("Exchanges")'); await p.waitForTimeout(700)
    const back = await st()
    if (back.sq || back.leg || back.cls) fail(`${tag}: Work left behind after Exchanges ${JSON.stringify(back)}`)
    if (errs.length) fail(`${tag}: page errors: ` + errs.slice(0, 3).join(' | '))
    out[tag] = { work: wk.sq, legend: wk.leg }
    await ctx.close()
  }
  console.log(JSON.stringify(out))
  await b.close(); console.log(fails.length ? 'FAIL' : 'PASS'); process.exit(fails.length ? 1 : 0)
})().catch(e => { console.log('  FAIL', e.message); console.log('FAIL'); process.exit(1) })
