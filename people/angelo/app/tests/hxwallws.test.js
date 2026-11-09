// WS-203, the live wallpaper's Workstreams and Deliverables levels (Angelo, 9 November 2026: "choosing the view as in the website"; his go in
// dashboard@'s cd90cac2). The wallpaper's Work.java is a port of the page's work.js (variant, places, merge, along, strokeFor),
// work-draw.js (pillsFor, the flight's easing) and work-live.js (opening and counts). This test runs it on a JVM over the site's
// own built workstreams.json and holds it to those files, loaded as they are: (1) the ten squares' places, names, short names and
// numbers; (2) every delivery merged by minute and destination, with the same icon, maker and number; (3) the pills for a phone's
// frame (the wallpaper's: the hexagon 98% of the width) and a wide one; (4) the light theme's strokes, 3:1 on white; (5) the
// flight's curve and easing; (6) opening: nothing older than the delay queued, the counts for the last 24 hours. By dashboard@PrompTugal.angelo.
const fs = require('fs'); const path = require('path'); const os = require('os'); const vm = require('vm'); const { execFileSync } = require('child_process')
const APP = path.join(__dirname, '..'), W = path.join(APP, 'android/wallpaper')
;(() => { let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 const Wk = require(path.join(APP, 'work.js'))
 const box = { self: { AngeloWork: Wk }, document: {} }; box.self.document = box.document; vm.runInNewContext(fs.readFileSync(path.join(APP, 'work-draw.js'), 'utf8').replace(/typeof self !== 'undefined' \? self : this/, 'self'), box)
 const D = box.self.AngeloWorkDraw, pillsFor = D.pillsFor
 const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hxws-')), src = ['Graph', 'Json', 'Iso', 'Work'].map(n => path.join(W, 'src/main/java/news/promptugal/wallpaper', n + '.java')).concat(path.join(W, 'src/test/java/news/promptugal/wallpaper/WorkDump.java'))
 try { execFileSync('javac', ['-encoding', 'UTF-8', '-d', tmp, ...src], { stdio: ['ignore', 'pipe', 'pipe'] }) } catch (e) { console.log('javac failed:', String(e.stderr).slice(0, 600)); console.log('FAIL'); return }
 for (const [level, file] of [['workstreams', 'workstreams.json'], ['deliverables', 'deliveries.json']]) {
 const wsF = path.join(APP, file)
 if (!fs.existsSync(wsF)) { fail('no built ' + file); continue }
 const F = JSON.parse(fs.readFileSync(wsF, 'utf8')), A = level === 'workstreams' ? Wk.variant(F.dests || [], F.names || {}) : Wk
 const from = Date.parse(F.from), lastMin = Math.max(...F.rows.map(r => r[0])), wall = from + (lastMin + 2) * 6e4
 const near = (a, b, e = 1e-3) => Math.abs(a - b) <= e
 for (const [tag, font, lo, hi] of [['phone', 30, -6, 1006], ['wide', 19, -400, 1400]]) {
  const J = JSON.parse(execFileSync('java', ['-cp', tmp, 'news.promptugal.wallpaper.WorkDump', wsF, level, String(wall), String(font), String(lo), String(hi), '58'], { encoding: 'utf8', maxBuffer: 64 << 20 }))
  if (tag === 'phone') {
   // (1) the squares
   const P = A.places(1)
   if (J.dests.length !== A.DESTS.length) fail(`${J.dests.length} squares, the page ${A.DESTS.length}`)
   J.dests.forEach((d, i) => { const id = A.DESTS[i], p = P.get(id); if (d.id !== id || !near(d.x, p.x) || !near(d.y, p.y) || d.name !== A.DEST_NAMES[id] || d.short !== A.DEST_SHORT[id] || d.mark !== (/^WS-\d+$/.test(id) ? id.slice(3) : '') || d.logo !== (level === 'deliverables' && !!D.LOGO[id]) || d.path !== (D.MARK_PATHS[D.MARK[id] || 'doc'] || Wk.ICON_PATHS[D.MARK[id] || 'doc'] || Wk.ICON_PATHS.doc)) fail(`square ${i} ${id}: ${JSON.stringify(d)} vs ${JSON.stringify({ p, name: A.DEST_NAMES[id], short: A.DEST_SHORT[id] })}`) })
   // (2) merged
   const M = A.merge(A.unpack(F).map(d => ({ ...d, min: Math.floor((from + d.min * 6e4) / 6e4) })))
   if (JSON.stringify(J.icons) !== JSON.stringify(Wk.ICON_PATHS)) fail('the six icons differ from work.js')
   if (J.rows !== A.unpack(F).length) fail(`rows ${J.rows}, the page ${A.unpack(F).length}`)
   if (J.merged.length !== M.length) fail(`merged ${J.merged.length}, the page ${M.length}`)
   let bad = 0; M.forEach((m, i) => { const j = J.merged[i] || []; if ((j[0] !== m.min || j[1] !== m.dest || j[2] !== m.n || j[3] !== m.icon || j[4] !== m.maker) && bad++ < 3) console.log('   merge', i, JSON.stringify(j), JSON.stringify([m.min, m.dest, m.n, m.icon, m.maker])) })
   if (bad) fail(`${bad} merged flights differ`)
   // (4) strokes
   const css = fs.readFileSync(path.join(APP, '../../../assets/cc/app.css'), 'utf8'), lightHex = n => { const all = [...css.matchAll(new RegExp(n + ':\\s*(#[0-9A-Fa-f]{6})', 'g'))].map(m => m[1]); return all[1] || all[0] }
   const cols = ['--rm-role-conductor', '--rm-role-dev', '--rm-gold', '--rm-role-video', '--rm-green', '--rm-role-outreach', '--rm-orange', '--rm-blue', '--rm-red'].map(lightHex)
   cols.forEach((c, i) => { const want = parseInt(Wk.strokeFor(c, true).slice(1), 16); if (J.strokes[i] !== want) fail(`light stroke ${c}: ${J.strokes[i].toString(16)} vs ${want.toString(16)}`) })
   // (5) the flight
   const p = Wk.along({ x: 100, y: 200 }, { x: 900, y: 300 }, 0.3), e = u => u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2
   if (!near(J.along[0], p.x, 1e-4) || !near(J.along[1], p.y, 1e-4) || !near(J.ease[0], e(0.3), 1e-5) || !near(J.ease[1], e(0.8), 1e-5)) fail('the flight\'s curve or easing differs')
   // (6) opening
   const rows = A.unpack(F).map(d => from + d.min * 6e4), delay = 4 * 6e4
   const queuedRows = A.unpack(F).filter((d, i, all) => all.findIndex(x => (x.repo || '') + ':' + x.sha + ':' + x.dest === (d.repo || '') + ':' + d.sha + ':' + d.dest) === i).filter(d => from + d.min * 6e4 > wall - delay), queued = A.merge(queuedRows.map(d => ({ ...d, min: Math.floor((from + d.min * 6e4) / 6e4) }))).length
   if (J.queued !== queued) fail(`queued on opening ${J.queued}, expected ${queued}`)
   // work-live.js keeps each delivery once by its key (repository, sha, destination): a commit naming two issues that both fall in
   // "other" counts once there
   const seen = new Set(), once = A.unpack(F).filter(d => { const k = (d.repo || '') + ':' + d.sha + ':' + d.dest; if (seen.has(k)) return false; seen.add(k); return true })
   const counts = A.DESTS.map(id => once.filter(d => d.dest === id && from + d.min * 6e4 > wall - 864e5 && from + d.min * 6e4 <= wall - delay).length)
   if (JSON.stringify(J.counts) !== JSON.stringify(counts)) fail(`counts ${J.counts} vs ${counts}`)
   console.log(`${level}: squares ${J.dests.length}, rows ${J.rows}, merged ${J.merged.length}, queued ${J.queued}, counts ${J.counts.join(' ')}`)
  }
  // (3) the pills
  const L = pillsFor(A.places(1), A.DEST_NAMES, font, lo, hi, 58, [], A.DEST_SHORT, 0); let bad = 0
  for (const [d, b] of L) { const j = J.pills[d]; if ((!j || !near(j.x, b.x) || !near(j.y, b.y) || !near(j.w, b.w) || j.mode !== b.mode || j.text !== b.text) && bad++ < 3) console.log('   pill', tag, d, JSON.stringify(j), JSON.stringify(b)) }
  if (bad) fail(`${tag}: ${bad} pills differ`)
  console.log(`${level} ${tag}: pills ${[...L.values()].map(b => b.mode[0]).join('')}`)
 }
 }
 console.log(ok ? 'PASS' : 'FAIL')
})()
