const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path')
const S = process.argv[2] || require('os').tmpdir(), BASE = 'http://127.0.0.1:8765/people/angelo/app/'
// wvdraw: the work view's drawing (work-draw.js, backlog 0f2, spec-work-view.md) on the real live graph (#live), through live.js's
// hook (host.lvGraph). Until dev.map@ lands the hook (people/angelo/map/work/drafts/live-hook.patch), this test serves live.js
// with the hook's lines added, as the patch does, and says so. At 1280 and 390 px, dark and light: ten destination squares on the
// hexagon's rim, each with its name in a pill outside the rim (none overlapping another, none crossing the rim, text at least 12 px
// on screen, inside the frame); PT News and LinkedIn show their logos; deliveries from deliveries.json fly from their makers' nodes
// as typed icons in their makers' colours (in light, a shade readable on white), merged ones carry their number, each lands on its
// square and lights it; the counts show; no text but the destinations' names and numbers; no page error.
const PATCH = fs.readFileSync(path.join(__dirname, '../../map/work/drafts/live-hook.patch'), 'utf8')
const HOOK = PATCH.split('\n').filter(l => l.startsWith('+') && !l.startsWith('+++')).map(l => l.slice(1)).join('\n') + '\n'
const fails = []; const fail = m => { fails.push(m); console.log('  FAIL', m) }
;(async () => {
  const b = await chromium.launch(); let patched = false
  for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const theme of ['dark', 'light']) {
    const tag = `${n}-${theme}`
    const ctx = await b.newContext({ viewport: vp, serviceWorkers: 'block', colorScheme: theme }); const p = await ctx.newPage(); const errs = []
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/507|favicon/.test(m.text())) errs.push(m.text()) })
    await p.route(/\/people\/angelo\/app\/live\.js(\?|$)/, async r => { const res = await r.fetch(); let t = await res.text()
      if (!/lvGraph/.test(t)) { const at = '        host.appendChild(wrap)\n'; if (t.length > 1000 && t.split(at).length !== 2) errs.push('live.js: the hook point moved'); t = t.replace(at, at + HOOK); patched = true }
      await r.fulfill({ response: res, body: t, headers: { ...res.headers(), 'content-type': 'application/javascript' } }) })
    await p.addInitScript(t => { try { localStorage.setItem('cc-theme', t) } catch { } }, theme)
    await p.goto(BASE + 'index.html#live', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-svg')
    await p.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme)
    await p.addScriptTag({ url: BASE + 'work.js' }); await p.addScriptTag({ url: BASE + 'work-draw.js' })
    const r = await p.evaluate(async ({ base }) => {
      const host = document.querySelector('.lv').parentNode, G = host.lvGraph; if (!G) return { err: 'no lvGraph on the host' }
      const A = window.AngeloWork, D = window.AngeloWorkDraw, V = D.attach(G, { base, clock: 'manual' })
      // deliveries: the built file's last ones, merged by minute; makers the graph cannot place are left out by fly()
      const W = await (await fetch(base + 'deliveries.json', { cache: 'no-store' })).json(), list = A.merge(A.unpack(W)).filter(d => A.origin(d.maker, G.pos))
      const pick = list.slice(-12), merged = list.filter(d => d.n > 1).slice(-1)
      const shown = merged.length && !pick.includes(merged[0]) ? pick.concat(merged) : pick
      V.counts(A.counts(A.unpack(W), -1e9, 1e9)); V.fly(shown, 0); window.__wv = { V, shown }
      const q = s => [...document.querySelectorAll(s)]
      V.step(1500)
      const mid = q('.wv-fly').map(g => ({ icon: g.dataset.icon, stroke: g.querySelector('path').getAttribute('stroke'), num: (g.querySelector('.wv-num') || {}).textContent || '', box: g.getBoundingClientRect() }))
      // the rim: the hexagon's own path, on screen; a pill crosses it if any corner is inside
      const rim = document.querySelector('.lv-rim'), svg = G.svg, pt = svg.createSVGPoint()
      const inside = (x, y) => { const m = svg.getScreenCTM().inverse(); pt.x = x; pt.y = y; const v = pt.matrixTransform(m); return rim.isPointInFill(v) }
      const frame = document.querySelector('.lv').getBoundingClientRect()
      const pills = q('.wv-pill').map(g => { const r = g.getBoundingClientRect(), t = g.querySelector('text'); return { d: g.dataset.dest, r: { l: r.left, t: r.top, r: r.right, b: r.bottom }, px: parseFloat(getComputedStyle(t).fontSize) * (svg.getBoundingClientRect().width / 1000), text: t.textContent,
        crosses: [[r.left + 2, r.top + 2], [r.right - 2, r.top + 2], [r.left + 2, r.bottom - 2], [r.right - 2, r.bottom - 2]].some(([x, y]) => inside(x, y)) } })
      const squares = q('.wv-sq').map(g => { const r = g.getBoundingClientRect(); return { d: g.dataset.dest, x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2, logo: !!g.querySelector('image'), w: r.width } })
      // the squares sit on the rim: their centres within a few pixels of the hexagon's edge (inside one way, outside the other)
      const onRim = squares.map(s => { const k = s.w * 0.25; return [[k, 0], [-k, 0], [0, k], [0, -k]].map(([dx, dy]) => inside(s.x + dx, s.y + dy)) }).map(a => a.includes(true) && a.includes(false))
      V.step(3200)
      const after = { inAir: V.inAir(), lit: q('.wv-sq.wv-lit').length }
      V.step(4500)
      const texts = q('.wv text').map(t => t.textContent)
      const counts = q('.wv-n').filter(n => n.style.display !== 'none').length
      const logosOk = await Promise.all(q('.wv-sq image').map(i => fetch(i.getAttribute('href')).then(r => r.ok)))
      return { n: shown.length, merged: merged.length ? merged[0].n : 0, mid, pills, squares, onRim, after, litLater: q('.wv-sq.wv-lit').length, texts, counts, logosOk, light: V.light, frame: { l: frame.left, r: frame.right }, names: A.DEST_NAMES }
    }, { base: BASE })
    if (r.err) { fail(`${tag}: ${r.err}`); await ctx.close(); continue }
    if (r.squares.length !== 10 || r.pills.length !== 10) fail(`${tag}: ${r.squares.length} squares, ${r.pills.length} pills`)
    r.onRim.forEach((ok, i) => { if (!ok) fail(`${tag}: the square for ${r.squares[i].d} is not on the rim`) })
    for (const s of r.squares) if (['news', 'linkedin'].includes(s.d) !== s.logo) fail(`${tag}: ${s.d} logo ${s.logo}`)
    if (r.logosOk.some(x => !x)) fail(`${tag}: a logo does not load`)
    for (const pl of r.pills) {
      if (pl.crosses) fail(`${tag}: the pill for ${pl.d} is on the rim`)
      if (pl.px < 11.9) fail(`${tag}: the pill for ${pl.d} at ${pl.px.toFixed(1)} px`)
      if (pl.r.l < r.frame.l - 1 || pl.r.r > r.frame.r + 1) fail(`${tag}: the pill for ${pl.d} leaves the frame`)
    }
    for (let i = 0; i < r.pills.length; i++) for (let j = i + 1; j < r.pills.length; j++) { const a = r.pills[i].r, c = r.pills[j].r; if (a.l < c.r && c.l < a.r && a.t < c.b && c.t < a.b) fail(`${tag}: pills ${r.pills[i].d} and ${r.pills[j].d} overlap`) }
    if (r.n < 3) fail(`${tag}: only ${r.n} deliveries to fly (is deliveries.json built?)`)
    if (r.mid.length !== r.n) fail(`${tag}: ${r.mid.length} of ${r.n} icons in the air at 1.5 s`)
    if (r.light !== (theme === 'light')) fail(`${tag}: the drawing thinks the theme is ${r.light ? 'light' : 'dark'}`)
    const A = require('../work.js')
    for (const m of r.mid) { if (!A.ICONS.includes(m.icon)) fail(`${tag}: icon ${m.icon}`); if (theme === 'light' && /^#/.test(m.stroke) && A.contrast(A.hex2rgb(m.stroke), [255, 255, 255]) < 3) fail(`${tag}: stroke ${m.stroke} faint on white`); if (!/^#[0-9a-f]{6}$/i.test(m.stroke)) fail(`${tag}: stroke ${m.stroke} not resolved`) }
    if (r.merged > 1 && !r.mid.some(m => m.num === String(r.merged))) fail(`${tag}: the merged delivery's number ${r.merged} not shown`)
    if (r.after.inAir !== 0 || r.after.lit < 1) fail(`${tag}: after landing ${JSON.stringify(r.after)}`)
    if (r.litLater !== 0) fail(`${tag}: squares still lit long after`)
    const allowed = new Set(Object.values(r.names)); for (const t of r.texts) if (!allowed.has(t) && !/^(\d+|99\+)$/.test(t)) fail(`${tag}: text drawn: ${t}`)
    if (r.counts < 1) fail(`${tag}: no counts shown`)
    if (errs.length) fail(`${tag}: page errors: ${errs.slice(0, 3).join(' | ')}`)
    // a picture with icons in the air, for the reviewer
    await p.evaluate(() => { const { V, shown } = window.__wv; V.fly(shown, 10000); V.step(11400) })
    await p.locator('.lv').screenshot({ path: `${S}/wvdraw-${tag}.png` })
    console.log(tag, JSON.stringify({ flew: r.n, merged: r.merged, minPx: Math.min(...r.pills.map(x => x.px)).toFixed(1), lit: r.after.lit, counts: r.counts }))
    await ctx.close()
  }
  await b.close()
  if (patched) console.log('note: live.js served with the hook added (people/angelo/map/work/drafts/live-hook.patch), not yet on dev')
  console.log(fails.length ? 'FAIL' : 'PASS'); process.exit(fails.length ? 1 : 0)
})().catch(e => { console.log('  FAIL', e.message); console.log('FAIL'); process.exit(1) })
