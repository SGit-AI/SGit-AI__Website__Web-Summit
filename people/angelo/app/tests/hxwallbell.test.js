// WS-203, the live wallpaper's dumbbell (spec-dumbbell.md, approved by Angelo 9 November; question 5: "dev.work@ builds the page's
// version, then dashboard@ ports it to the wallpaper with a test holding the two together"). Bell.java is a port of work-bell.js;
// this test runs it on a JVM over the site's own built deliveries.json and workstreams.json and holds it to work-bell.js loaded
// as it is: the week's routes by person (and their widths), and for each of the four ends of the setting the frame, the network's
// circle, the bell's order and each icon's place, facing, row, quiet, abbreviation, its label (beside, and staggered on a small
// screen) and a point on its route; Automatic by the screen's shape; whose a maker is. By dashboard@PrompTugal.angelo.
const fs = require('fs'); const path = require('path'); const os = require('os'); const { execFileSync } = require('child_process')
const APP = path.join(__dirname, '..'), W = path.join(APP, 'android/wallpaper')
;(() => { let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 const B = require(path.join(APP, 'work-bell.js')), Wk = require(path.join(APP, 'work.js'))
 const M = JSON.parse(fs.readFileSync(path.join(APP, 'data.json'), 'utf8')).collab.map, people = M.people.map(p => p.id)
 const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hxbell-')), src = ['Graph', 'Json', 'Iso', 'Work', 'Bell'].map(n => path.join(W, 'src/main/java/news/promptugal/wallpaper', n + '.java')).concat(path.join(W, 'src/test/java/news/promptugal/wallpaper/BellDump.java'))
 try { execFileSync('javac', ['-encoding', 'UTF-8', '-d', tmp, ...src], { stdio: ['ignore', 'pipe', 'pipe'] }) } catch (e) { console.log('javac failed:', String(e.stderr).slice(0, 600)); console.log('FAIL'); return }
 const near = (a, b, e = 1e-3) => Math.abs(a - b) <= e
 for (const [level, file] of [['deliverables', 'deliveries.json'], ['workstreams', 'workstreams.json']]) {
  const F = JSON.parse(fs.readFileSync(path.join(APP, file), 'utf8')), A = level === 'workstreams' ? Wk.variant(F.dests || [], F.names || {}) : Wk
  const from = Date.parse(F.from), now = from + Math.max(...F.rows.map(r => r[0])) * 6e4 + 6e4
  const list = A.unpack(F).map(d => ({ at: from + d.min * 6e4, maker: d.maker, dest: d.dest }))
  const J = JSON.parse(execFileSync('java', ['-cp', tmp, 'news.promptugal.wallpaper.BellDump', path.join(APP, file), level, String(now), people.join(',')], { encoding: 'utf8', maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] }))
  const R = B.routes(list, now, people)
  if (J.max !== R.max || J.routes.length !== R.routes.length) fail(`${level}: routes ${J.routes.length}/${J.max}, the page ${R.routes.length}/${R.max}`)
  R.routes.forEach((r, i) => { const j = J.routes[i] || []; if (j[0] !== r.person || j[1] !== r.dest || j[2] !== r.n || !near(j[3], B.width(r.n, R.max), 0.011)) fail(`${level}: route ${i} ${JSON.stringify(j)} vs ${JSON.stringify(r)}`) })
  for (const or of ['left', 'right', 'top', 'below']) {
   const L = B.layout(or, A.DESTS, R.weights), j = J.layouts[or]
   if (!near(j.w, L.w) || !near(j.h, L.h) || !near(j.net[0], L.net.x) || !near(j.net[1], L.net.y) || !near(j.net[2], L.net.r)) fail(`${level} ${or}: frame ${JSON.stringify(j.net)} vs ${JSON.stringify(L.net)}`)
   if (j.order !== B.ordered(A.DESTS, R.weights).join()) fail(`${level} ${or}: order ${j.order}`)
   let bad = 0
   for (const [d, p] of L.places) { const q = j.places[d], abbr = B.ABBR[d] || B.abbrOf(d, A.DEST_NAMES[d]); p.abbr = abbr
    const l1 = B.label(p, 36, 26, abbr.length, false), l2 = B.label(p, 36, 40, abbr.length, true), m = B.at(B.route(or, L.net, p), 0.37)
    if ((!q || !near(q.x, p.x) || !near(q.y, p.y) || !near(q.nx, p.nx, 1e-4) || !near(q.ny, p.ny, 1e-4) || q.row !== p.row || q.quiet !== p.quiet || q.abbr !== abbr || !near(q.l1[0], l1.x) || !near(q.l1[1], l1.y) || !near(q.l2[0], l2.x) || !near(q.l2[1], l2.y) || !near(q.mid[0], m.x) || !near(q.mid[1], m.y)) && bad++ < 3) console.log('   ', level, or, d, JSON.stringify(q), JSON.stringify({ x: p.x, y: p.y, abbr, l1, l2, m })) }
   if (bad) fail(`${level} ${or}: ${bad} places differ`)
  }
  console.log(`${level}: ${R.routes.length} routes (max ${R.max}), four ends, ${A.DESTS.length} icons each: ${Object.values(J.layouts.top.places).map(p => p.abbr).join(' ')}`)
  if (level === 'deliverables') {
   if (JSON.stringify(J.orient) !== JSON.stringify([B.orient('auto', 390, 844), B.orient('auto', 1280, 800), B.orient('below', 1280, 800)])) fail('Automatic or a fixed end differs')
   if (JSON.stringify(J.person) !== JSON.stringify(['pt:angelo:dev.map', 'conductor@web-summit.dinis', 'vicky'].map(B.personOf))) fail('personOf differs')
  }
 }
 console.log(ok ? 'PASS' : 'FAIL')
})()
