const { chromium } = require('playwright')
const S = process.argv[2] || require('os').tmpdir(), U = 'http://127.0.0.1:8765/people/angelo/app/index.html'
// wvpop: the pop-out window shows the map's three levels (backlog 0c4 (5), Angelo 8 Nov about 23:00: "The popped out window doesn't
// show the work option"). At 1280 px (the pop-out is for a computer), dark and light: from Deliverables, Pop out opens a window with
// "Messages | Workstreams | Deliverables" in its corner, Deliverables on, and the ten destinations drawn on its graph; Workstreams
// there draws the workstreams (their numbers) and sets the page's address; Messages takes the squares away; Deliverables on the
// page puts them back in the window; closing the window brings the graph back to the page at the level chosen. No page error.
// Headless Chromium has no Document Picture-in-Picture: where it is missing, the test stands in a plain popup window for it
// (requestWindow returns a window, as the real one does); what it cannot check is the real always-on-top window.
const fails = []; const fail = m => { fails.push(m); console.log('  FAIL', m) }
;(async () => {
  const b = await chromium.launch()
  for (const scheme of ['dark', 'light']) {
    const tag = '1280-' + scheme, ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: scheme, serviceWorkers: 'block' }), p = await ctx.newPage(), errs = []
    const watch = pg => { pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error' && !/507|favicon|Failed to load resource/.test(m.text())) errs.push(m.text()) }) }
    watch(p)
    await p.addInitScript(() => { if (!window.documentPictureInPicture) window.documentPictureInPicture = { requestWindow: async ({ width, height }) => window.open('', '_blank', `width=${width},height=${height}`) } })
    await p.goto(U + '#live?v=work', { waitUntil: 'networkidle' }); await p.waitForSelector('[data-lv-frame] .wv-sq')
    const [w] = await Promise.all([ctx.waitForEvent('page'), p.click('[data-lv-pop]')]); watch(w); await w.setViewportSize({ width: 440, height: 440 })   // the window's real size
    const state = () => w.evaluate(() => ({ chips: [...document.querySelectorAll('[data-wv-popsw] a')].map(a => a.textContent + (a.classList.contains('on') ? '*' : '')).join('|'), sq: document.querySelectorAll('.wv-sq').length, ws: document.querySelectorAll('.wv-ws').length, pills: document.querySelectorAll('.wv-pill').length, barH: Math.round((document.querySelector('[data-wv-popsw]') || { getBoundingClientRect: () => ({ height: 0 }) }).getBoundingClientRect().height) }))
    const until = async (f, ms = 8000) => { const t = Date.now(); let s; while (Date.now() - t < ms) { s = await state(); if (f(s)) return s; await w.waitForTimeout(150) } return s }
    let s = await until(x => x.sq === 10)
    if (s.chips !== 'Messages|Workstreams|Deliverables*' || s.sq !== 10 || s.pills !== 10 || !(s.barH > 10 && s.barH < 40)) fail(`${tag}: the pop-out on Deliverables ${JSON.stringify(s)}`)
    const inline = await p.evaluate(() => !!document.querySelector('[data-lv-frame] .lv-svg'))
    if (inline) fail(`${tag}: the graph is still on the page while popped out`)
    await w.screenshot({ path: `${S}/wvpop-${tag}-work.png` })
    await w.click('[data-wv-popsw] a:has-text("Workstreams")'); s = await until(x => x.ws > 0)
    if (!/Workstreams\*/.test(s.chips) || !s.ws || s.sq !== 10) fail(`${tag}: Workstreams in the pop-out ${JSON.stringify(s)}`)
    if (!/v=ws/.test(await p.evaluate(() => location.hash))) fail(`${tag}: the page's address did not follow the pop-out`)
    await w.screenshot({ path: `${S}/wvpop-${tag}-ws.png` })
    await w.click('[data-wv-popsw] a:has-text("Messages")'); s = await until(x => x.sq === 0 && /Messages\*/.test(x.chips))
    if (s.sq !== 0 || !/Messages\*/.test(s.chips)) fail(`${tag}: Messages in the pop-out ${JSON.stringify(s)}`)
    if (!/v=ws/.test(await w.evaluate(() => location.href)) && await w.evaluate(() => !document.querySelector('.lv-svg'))) fail(`${tag}: the pop-out lost its graph`)
    await p.click('[data-wv-sw] a:has-text("Deliverables")'); s = await until(x => x.sq === 10)
    if (s.sq !== 10 || !/Deliverables\*/.test(s.chips)) fail(`${tag}: Deliverables from the page did not reach the pop-out ${JSON.stringify(s)}`)
    await p.click('[data-lv-pop]'); await p.waitForTimeout(1500)
    const back = await p.evaluate(() => ({ svg: !!document.querySelector('[data-lv-frame] .lv-svg'), sq: document.querySelectorAll('[data-lv-frame] .wv-sq').length, btn: document.querySelector('[data-lv-pop]').textContent }))
    if (!back.svg || back.sq !== 10 || !/Pop out/.test(back.btn)) fail(`${tag}: after closing ${JSON.stringify(back)}`)
    if (errs.length) fail(`${tag}: page errors: ${errs.slice(0, 3).join(' | ')}`)
    console.log(tag, JSON.stringify({ last: s, back }))
    await ctx.close()
  }
  await b.close(); console.log(fails.length ? 'FAIL' : 'PASS'); process.exit(fails.length ? 1 : 0)
})().catch(e => { console.log('  FAIL', e.message); console.log('FAIL'); process.exit(1) })
