const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path')
const S = process.argv[2] || require('os').tmpdir(), BASE = 'http://127.0.0.1:8765/people/angelo/app/'
// wvlive: the work view, live (work-live.js, backlog 0f2, spec-work-view.md) on the real #live graph through live.js's hook (served
// with the hook's lines added while dev.map@'s draft is not on dev, as wvdraw does). Opening plays nothing old; the squares count
// the last 24 hours; a delivery that reaches deliveries.json flies to its destination; a story newly published on the newsroom
// (its own file, here a saved copy) flies to PT News; when the newsroom cannot be read the view says so in its corner, and the
// note goes when it can again; destroy() leaves no drawing behind. At 1280 px (the drawing's sizes are wvdraw's).
const PATCH = fs.readFileSync(path.join(__dirname, '../../map/work/drafts/live-hook.patch'), 'utf8')
const HOOK = PATCH.split('\n').filter(l => l.startsWith('+') && !l.startsWith('+++')).map(l => l.slice(1)).join('\n') + '\n'
const STORIES = JSON.parse(fs.readFileSync(path.join(__dirname, 'wv-stories.json'), 'utf8'))
const fails = []; const fail = m => { fails.push(m); console.log('  FAIL', m) }
;(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' }); const p = await ctx.newPage(); const errs = []
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/507|favicon|500/.test(m.text())) errs.push(m.text()) })
  await p.route(/\/people\/angelo\/app\/live\.js(\?|$)/, async r => { const res = await r.fetch(); let t = await res.text(); if (!/lvGraph/.test(t)) t = t.replace('        host.appendChild(wrap)\n', '        host.appendChild(wrap)\n' + HOOK); await r.fulfill({ response: res, body: t }) })
  let addRow = false, newsMode = 'same'
  await p.route(/\/people\/angelo\/app\/deliveries\.json/, async r => { const res = await r.fetch(); const W = await res.json()
    if (addRow) { const mk = W.makers.findIndex(m => /^pt:angelo:/.test(m)); W.rows.push([Math.round((Date.now() - Date.parse(W.from)) / 6e4) - 10, mk < 0 ? 0 : mk, W.icons.indexOf('key'), W.dests.indexOf('keys'), 0, 'test001']) }
    await r.fulfill({ response: res, json: W }) })
  await p.route('https://promptugal.news/api/v1/newsroom/stories.json', async r => {
    if (newsMode === 'down') return r.fulfill({ status: 500, body: 'no' })
    const J = JSON.parse(JSON.stringify(STORIES)); if (newsMode === 'new') J.stories[0].history.push({ column: 'published', at: new Date().toISOString().slice(0, 19) + 'Z', by: 'writer@' + 'promptugal.angelo' })
    await r.fulfill({ json: J, headers: { 'access-control-allow-origin': '*' } }) })
  await p.goto(BASE + 'index.html#live', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-svg')
  for (const f of ['work.js', 'work-draw.js', 'work-newsroom.js', 'work-live.js']) await p.addScriptTag({ url: BASE + f })
  await p.evaluate(base => { window.__wl = window.AngeloWorkLive.mount(document.querySelector('.lv').parentNode, { base, every: 1200, newsEvery: 1200 }) }, BASE)
  const st = () => p.evaluate(() => ({ sq: document.querySelectorAll('.wv-sq').length, fly: [...document.querySelectorAll('.wv-fly')].map(g => g.dataset.dest + ':' + g.dataset.icon), counts: [...document.querySelectorAll('.wv-n')].filter(n => n.style.display !== 'none').map(n => n.textContent), note: (document.querySelector('.wv-note') || {}).textContent || '' }))
  const watch = async (ms, pred) => { const seen = new Set(); for (let t = 0; t < ms; t += 150) { const x = await st(); x.fly.forEach(f => seen.add(f)); if (pred && pred(x, seen)) return { x, seen }; await p.waitForTimeout(150) } return { x: await st(), seen } }
  const open = await watch(2600)
  if (open.x.sq !== 10) fail(`${open.x.sq} squares`)
  if (open.seen.size) fail('opening played old deliveries: ' + [...open.seen].join(' '))
  if (!open.x.counts.length) fail('no counts for the last 24 hours (is deliveries.json built, with today\'s commits?)')
  addRow = true
  const row = await watch(6000, (x, s) => s.has('keys:key'))
  if (!row.seen.has('keys:key')) fail('a new delivery in deliveries.json did not fly to keys')
  newsMode = 'new'
  const news = await watch(6000, (x, s) => s.has('news:doc'))
  if (!news.seen.has('news:doc')) fail('a newly published story did not fly to PT News')
  newsMode = 'down'
  const down = await watch(5000, x => /newsroom/.test(x.note))
  if (!/newsroom could not be read/.test(down.x.note)) fail('no note when the newsroom is down: ' + JSON.stringify(down.x.note))
  await p.locator('.lv').screenshot({ path: `${S}/wvlive.png` })
  newsMode = 'same'
  const back = await watch(5000, x => !x.note)
  if (back.x.note) fail('the note stayed after the newsroom came back')
  const gone = await p.evaluate(() => { window.__wl.destroy(); return { wv: document.querySelectorAll('.wv').length, cls: document.querySelector('.lv').classList.contains('lv-workview') } })
  if (gone.wv || gone.cls) fail('destroy left the drawing ' + JSON.stringify(gone))
  if (errs.length) fail('page errors: ' + errs.slice(0, 3).join(' | '))
  console.log(JSON.stringify({ counts: open.x.counts.length, row: row.seen.has('keys:key'), news: news.seen.has('news:doc'), note: down.x.note }))
  await b.close(); console.log(fails.length ? 'FAIL' : 'PASS'); process.exit(fails.length ? 1 : 0)
})().catch(e => { console.log('  FAIL', e.message); console.log('FAIL'); process.exit(1) })
