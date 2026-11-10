const { chromium } = require('playwright'); const path = require('path')
const S = process.argv[2] || require('os').tmpdir(), BASE = 'http://127.0.0.1:8765/people/angelo/app/'
// wvbelldraw: the dumbbell's drawing (work-bell-draw.js, backlog 0c5, spec-dumbbell.md) on the real live page, at 1280 and 390 px,
// dark and light. Deliverables (#live?v=work) and Workstreams (#live?v=ws) draw the dumbbell, not the rim: Automatic puts the team
// on the left on the desktop and on top on the phone; ten icons, each with its abbreviation (3 to 4 letters, at least 12 px on
// screen) and its full name as its title, inside the view, none overlapping another; the network inside its circle (every
// person's node inside it); routes from people to destinations, none to an unknown one, widths from the last seven days; no
// count anywhere; on a phone, nothing in the part of the floating Ask Claude button's column it can reach at some scroll, in every setting. A tap on a person shows their agents' own routes and dims the rest; a second tap, or Escape, undoes it. The setting (lower left) moves the team below, to the right, and back to Automatic, and is remembered. Then,
// on the graph directly (clock stepped by hand): deliveries from deliveries.json fly along their routes as typed icons in their
// makers' colours, land on their icons and light them; destroy() gives live.js its graph back as it was. No page error.
const fails = []; const fail = m => { fails.push(m); console.log('  FAIL', m) }
;(async () => {
  const b = await chromium.launch()
  for (const [n, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) for (const theme of ['dark', 'light']) {
    const tag = `${n}-${theme}`
    const ctx = await b.newContext({ viewport: vp, serviceWorkers: 'block', colorScheme: theme }); const p = await ctx.newPage(); const errs = []
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/507|favicon|ERR_|Failed to load resource/.test(m.text())) errs.push(m.text()) })
    await p.addInitScript(t => { try { localStorage.setItem('cc-theme', t); if (!sessionStorage.getItem('wb-t')) { localStorage.removeItem('angelo.workbell.orient'); sessionStorage.setItem('wb-t', '1') } } catch { } }, theme)
    for (const lvl of ['work', 'ws']) {
      await p.goto(BASE + 'index.html#live?v=' + lvl, { waitUntil: 'networkidle' })
      try { await p.waitForSelector('.lv.lv-bellview .wb-ic', { timeout: 15000 }) } catch { fail(`${tag} ${lvl}: no dumbbell`); continue }
      await p.waitForTimeout(800)
      const r = await p.evaluate(() => {
        const q = s => [...document.querySelectorAll(s)], wrap = document.querySelector('.lv.lv-bellview'), fr = wrap.getBoundingClientRect()
        const ics = q('.wb-ic').map(g => { const r = g.querySelector('rect').getBoundingClientRect(), t = g.querySelector('.wb-ab'), tb = t.getBoundingClientRect(); const bx = x => ({ l: x.left, t: x.top, r: x.right, b: x.bottom }); return { d: g.dataset.dest, title: (g.querySelector('title') || {}).textContent || '', ab: t.textContent, px: tb.height, ic: bx(r), lb: bx(tb), r: { l: Math.min(r.left, tb.left), t: Math.min(r.top, tb.top), r: Math.max(r.right, tb.right), b: Math.max(r.bottom, tb.bottom) }, quiet: g.classList.contains('wb-quiet') } })
        const net = document.querySelector('.wb-net').getBoundingClientRect(), nc = { x: (net.left + net.right) / 2, y: (net.top + net.bottom) / 2, r: net.width / 2 }
        const people = q('.tm-p circle').map(c => { const b = c.getBoundingClientRect(); return Math.hypot((b.left + b.right) / 2 - nc.x, (b.top + b.bottom) / 2 - nc.y) - nc.r })
        const routes = q('.wb-route').map(e => ({ d: e.dataset.dest, w: +e.getAttribute('stroke-width'), s: e.getAttribute('stroke') }))
        const texts = q('.wb text').map(t => t.textContent)
        const fe = document.querySelector('.cc-askfab'), fb = fe && fe.getBoundingClientRect(), fab = fb && fb.width && fb.left < fr.right && fb.right > fr.left ? { l: fb.left, t: fr.top + Math.max(0, fb.top - (fr.top + scrollY)) } : null
        return { fab, bell: wrap.dataset.bell, fr: { l: fr.left, t: fr.top, r: fr.right, b: fr.bottom }, ics, nc, people, routes, texts, sel: !!document.querySelector('.wb-or'), rimShown: getComputedStyle(document.querySelector('.lv-rim')).display !== 'none' }
      })
      const want = n === 'desktop' ? 'left' : 'top'
      if (r.bell !== want) fail(`${tag} ${lvl}: Automatic gave ${r.bell}, not ${want}`)
      if (r.rimShown) fail(`${tag} ${lvl}: the hexagon's rim still shows`)
      if (r.ics.length !== 10) fail(`${tag} ${lvl}: ${r.ics.length} icons`)
      for (const i of r.ics) {
        if (!/^[A-Z0-9]{2,4}$/.test(i.ab)) fail(`${tag} ${lvl}: ${i.d}'s abbreviation "${i.ab}"`)
        if (i.px < 12) fail(`${tag} ${lvl}: ${i.d}'s abbreviation ${i.px.toFixed(1)} px high`)
        if (!i.title) fail(`${tag} ${lvl}: ${i.d} has no title`)
        if (i.r.l < r.fr.l - 1 || i.r.r > r.fr.r + 1 || i.r.t < r.fr.t - 1 || i.r.b > r.fr.b + 1) fail(`${tag} ${lvl}: ${i.d} leaves the view`)
      }
      // no icon on another, no abbreviation on another icon or abbreviation (the text's own box, a pixel's slack)
      const hit = (a, c) => a.l + 1 < c.r && c.l + 1 < a.r && a.t + 1 < c.b && c.t + 1 < a.b
      for (const x of r.ics) for (const y of r.ics) if (x !== y && (hit(x.ic, y.ic) || hit(x.lb, y.ic) || hit(x.lb, y.lb))) fail(`${tag} ${lvl}: ${x.d} and ${y.d} overlap`)
      // the floating Ask Claude button (fixed to the window's lower right; the map scrolls under it): no icon or abbreviation in the
      // part of its column it can reach at some scroll (dashboard@'s note 3 in 96e5de79: on a phone it covered RSCH and LNKD)
      if (r.fab) for (const i of r.ics) for (const b of [i.ic, i.lb]) if (b.r > r.fab.l && b.b > r.fab.t) fail(`${tag} ${lvl}: ${i.d} can lie under the Ask Claude button`)
      if (n === 'phone' && !r.fab) fail(`${tag} ${lvl}: no Ask Claude button to keep clear of`)
      if (!r.people.length || r.people.some(x => x > 0)) fail(`${tag} ${lvl}: a person outside the network's circle (${r.people.map(x => x.toFixed(0))})`)
      if (lvl === 'work' && !r.routes.length) fail(`${tag} ${lvl}: no routes`)
      const ds = new Set(r.ics.map(i => i.d)); if (r.routes.some(x => !ds.has(x.d) || !(x.w > 0))) fail(`${tag} ${lvl}: a route to nowhere or with no width`)
      if (r.texts.some(t => /^\d+$/.test(t) && lvl === 'work')) fail(`${tag} ${lvl}: a count is drawn`)
      if (!r.sel) fail(`${tag} ${lvl}: no setting`)
      if (lvl === 'work' && theme === 'dark') await p.screenshot({ path: path.join(S, `wvbell-${n}-${lvl}.png`) })
      if (lvl === 'work') {
        // tap a person (the spec, question 2): their agents' own routes, everyone else's dimmed; tap again, or Escape, for everyone
        const who = await p.evaluate(() => { const c = {}; for (const e of document.querySelectorAll('.wb-route')) c[e.dataset.person] = (c[e.dataset.person] || 0) + 1; return Object.entries(c).sort((a, b) => b[1] - a[1])[0] })
        const at = who && await p.evaluate(id => { const G = document.querySelector('.lv').parentNode.lvGraph, n = G.pos.get(id), c = [...document.querySelectorAll('.tm-p circle')].find(c => Math.abs(+c.getAttribute('cx') - n.x) < 0.2 && Math.abs(+c.getAttribute('cy') - n.y) < 0.2); if (!c) return null; c.scrollIntoView({ block: 'center', behavior: 'instant' }); const b = c.getBoundingClientRect(); return { x: (b.left + b.right) / 2, y: (b.top + b.bottom) / 2 } }, who[0])
        if (!at) fail(`${tag}: no person to tap`)
        else {
          const seen = () => p.evaluate(id => { const q = s => [...document.querySelectorAll(s)]; return { focus: document.querySelector('.lv.lv-bellview').dataset.focus || null, agent: q('.wb-route.wb-agent').filter(e => e.dataset.person === id).length, agentOther: q('.wb-route.wb-agent').filter(e => e.dataset.person !== id).length, fromOk: q('.wb-route.wb-agent').every(e => e.dataset.from), mineByPerson: q('.wb-route:not(.wb-agent)').filter(e => e.dataset.person === id).length, others: q('.wb-route:not(.wb-agent)').length, dim: q('.wb-route.wb-dim').length, on: q('.tm-p.wb-on').length } }, who[0])
          await p.mouse.click(at.x, at.y); await p.waitForTimeout(150); const s1 = await seen()
          if (s1.focus !== who[0] || !s1.agent || s1.agentOther || !s1.fromOk || s1.mineByPerson || s1.dim !== s1.others || s1.on !== 1) fail(`${tag}: tapping ${who[0]} gave ${JSON.stringify(s1)}`)
          if (theme === 'dark') await p.screenshot({ path: path.join(S, `wvbell-${n}-focus.png`) })
          await p.mouse.click(at.x, at.y); await p.waitForTimeout(150); const s2 = await seen()
          if (s2.focus || s2.agent || s2.dim || s2.on || s2.mineByPerson !== who[1]) fail(`${tag}: tapping ${who[0]} again gave ${JSON.stringify(s2)}`)
          await p.mouse.click(at.x, at.y); await p.keyboard.press('Escape'); await p.waitForTimeout(100); const s3 = await seen()
          if (s3.focus || s3.dim) fail(`${tag}: Escape gave ${JSON.stringify(s3)}`)
        }
        for (const [o, side] of [['below', 'b'], ['right', 'r'], ['top', 't'], ['left', 'l']]) {
          await p.selectOption('.wb-or', o); await p.waitForTimeout(150)
          const s = await p.evaluate(() => { const w = document.querySelector('.lv.lv-bellview'), f = w.getBoundingClientRect(), c = document.querySelector('.wb-net').getBoundingClientRect(), ic = [...document.querySelectorAll('.wb-ic rect')].map(e => e.getBoundingClientRect()); return { bell: w.dataset.bell, cx: (c.left + c.right) / 2 - (f.left + f.right) / 2, cy: (c.top + c.bottom) / 2 - (f.top + f.bottom) / 2, ix: ic.reduce((s, b) => s + (b.left + b.right) / 2, 0) / ic.length - (f.left + f.right) / 2, iy: ic.reduce((s, b) => s + (b.top + b.bottom) / 2, 0) / ic.length - (f.top + f.bottom) / 2, fab: (() => { const fe = document.querySelector('.cc-askfab'), fb = fe && fe.getBoundingClientRect(); if (!fb || !fb.width || fb.left >= f.right) return null; const top = f.top + Math.max(0, fb.top - (f.top + scrollY)); return [...document.querySelectorAll('.wb-ic')].filter(g => [g.querySelector('rect'), g.querySelector('.wb-ab')].some(e => { const b = e.getBoundingClientRect(); return b.right > fb.left && b.bottom > top })).map(g => g.dataset.dest).join() || null })() } })
          if (n === 'phone' && s.fab) fail(`${tag}: the setting "${o}" puts ${s.fab} under the Ask Claude button`)
          const ok = s.bell === o && ({ b: s.cy > 0 && s.iy < 0, t: s.cy < 0 && s.iy > 0, l: s.cx < 0 && s.ix > 0, r: s.cx > 0 && s.ix < 0 })[side]
          if (!ok) fail(`${tag}: the setting "${o}" gave ${JSON.stringify(s)}`)
          if (theme === 'dark' && o === 'below' && n === 'phone') await p.screenshot({ path: path.join(S, `wvbell-${n}-below.png`) })
          if (theme === 'dark' && o === 'right' && n === 'desktop') await p.screenshot({ path: path.join(S, `wvbell-${n}-right.png`) })
        }
        await p.selectOption('.wb-or', 'below'); await p.reload({ waitUntil: 'networkidle' }); await p.waitForSelector('.lv.lv-bellview .wb-ic', { timeout: 15000 })
        if (await p.evaluate(() => document.querySelector('.lv.lv-bellview').dataset.bell) !== 'below') fail(`${tag}: the setting is not remembered`)
        await p.selectOption('.wb-or', 'auto')
      }
    }
    // on the graph directly: flights along the routes
    await p.goto(BASE + 'index.html#live', { waitUntil: 'networkidle' }); await p.waitForSelector('.lv-svg')
    for (const f of ['work.js', 'work-draw.js', 'work-bell.js', 'work-bell-draw.js']) await p.addScriptTag({ url: BASE + f })
    const f = await p.evaluate(async ({ base }) => {
      const host = document.querySelector('.lv').parentNode, G = host.lvGraph; if (!G) return { err: 'no lvGraph' }
      const graph = G.layer.parentNode, before = { vb: G.svg.getAttribute('viewBox'), tr: graph.getAttribute('transform') }
      const A = window.AngeloWork, B = window.AngeloWorkBell, V = window.AngeloWorkBellDraw.attach(G, { base, clock: 'manual', orient: 'left' })
      const W = await (await fetch(base + 'deliveries.json', { cache: 'no-store' })).json(), from = Date.parse(W.from), rows = A.unpack(W)
      const list = rows.map(d => ({ at: from + d.min * 6e4, maker: d.maker, dest: d.dest })), last = Math.max(...list.map(d => d.at))
      V.week(list, last)
      const M = A.merge(rows).filter(d => G.pos.has(d.maker) || G.pos.has(B.personOf(d.maker))).slice(-10)
      V.fly(M, 0); V.step(1500)
      const mid = [...document.querySelectorAll('.wb .wv-fly')].map(g => ({ icon: g.dataset.icon, stroke: g.querySelector('path').getAttribute('stroke'), t: g.getAttribute('transform') }))
      V.step(3100); const lit = document.querySelectorAll('.wb-ic.wv-lit').length, air = V.inAir()
      V.step(5000); const unlit = document.querySelectorAll('.wb-ic.wv-lit').length
      V.destroy()
      const after = { vb: G.svg.getAttribute('viewBox'), tr: graph.getAttribute('transform'), left: document.querySelectorAll('.wb, .wb-or').length, cls: document.querySelector('.lv').classList.contains('lv-bellview') }
      return { n: M.length, mid, lit, air, unlit, restored: after.vb === before.vb && after.tr === before.tr && !after.left && !after.cls }
    }, { base: BASE })
    if (f.err) fail(`${tag}: ${f.err}`)
    else {
      if (!f.n) fail(`${tag}: nothing to fly`)
      if (f.mid.length !== f.n) fail(`${tag}: ${f.mid.length} of ${f.n} in the air`)
      if (f.mid.some(m => !m.stroke || !/^translate/.test(m.t || ''))) fail(`${tag}: a flight without colour or place`)
      if (f.air !== 0 || f.lit < 1 || f.unlit !== 0) fail(`${tag}: landing (in air ${f.air}, lit ${f.lit}, still lit ${f.unlit})`)
      if (!f.restored) fail(`${tag}: destroy() did not give the graph back`)
    }
    if (errs.length) fail(`${tag}: page errors: ${errs.slice(0, 3).join(' | ')}`)
    await ctx.close()
  }
  await b.close()
  console.log(fails.length ? 'FAIL' : 'PASS'); process.exit(fails.length ? 1 : 0)
})()
