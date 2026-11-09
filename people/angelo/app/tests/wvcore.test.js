// wvcore: the work view's rules in work.js (backlog 0f2, spec-work-view.md), no browser: ten destinations placed inside the
// square, in order round the rim, none on top of another, none on the top edge or the foot; ten deliveries to one destination in one minute merge into one icon
// with 10; counts for a window; a maker the map does not draw leaves from its person; the light theme's stroke readable on
// white (3:1) for every person's colour; and the built deliveries.json unpacked with nothing dropped.
const path = require('path'), fs = require('fs')
const W = require('../work.js'), ROOT = path.resolve(__dirname, '../../../..')
let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
try { W.selfTest() } catch (e) { fail(e.message) }
const P = W.places(), pts = [...P.values()]
if (P.size !== 10 || W.DESTS.some(d => !P.has(d))) fail('ten places, one per destination')
for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) if (Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y) < 120) fail(`places ${W.DESTS[i]} and ${W.DESTS[j]} too close`)
const ang = pts.map(p => Math.atan2(p.y - W.C, p.x - W.C)), turns = ang.slice(1).map((a, i) => ((a - ang[i]) + 2 * Math.PI) % (2 * Math.PI))
if (turns.some(t => t <= 0 || t > Math.PI)) fail('places not in order round the rim')
// none on the top edge (live.js's logos and LIVE) or the foot (its date line): dashboard@'s review, de879c5
for (const [d, p] of P) if (Math.abs(p.ny) > 0.8) fail(`the place for ${d} is on the hexagon's top or foot`)
const ten = Array.from({ length: 10 }, (_, i) => ({ min: 5, dest: 'news', icon: i < 7 ? 'doc' : 'post', maker: i < 4 ? 'b' : 'a', sha: 'abc' + i }))
const M = W.merge([...ten, { min: 6, dest: 'news', icon: 'doc', maker: 'a', sha: 'x' }, { min: 5, dest: 'keys', icon: 'key', maker: 'a', sha: 'y' }])
const m5 = M.find(x => x.min === 5 && x.dest === 'news')
if (M.length !== 3 || !m5 || m5.n !== 10 || m5.icon !== 'doc' || m5.maker !== 'a') fail('merge: ' + JSON.stringify(M.map(x => [x.min, x.dest, x.n, x.icon, x.maker])))
const c = W.counts(ten.concat([{ min: 9, dest: 'crm' }]), 0, 9)
if (c.news !== 10 || c.crm !== 0 || Object.keys(c).length !== 10) fail('counts: ' + JSON.stringify(c))
const pos = new Map([['angelo', { x: 1, y: 1 }], ['pt:angelo:dev', { x: 2, y: 2 }], ['dinis', { x: 3, y: 3 }]])
if (W.origin('pt:angelo:dev', pos) !== 'pt:angelo:dev' || W.origin('pt:angelo:dev.work', pos) !== 'angelo' || W.origin('dev@' + 'web-summit.dinis', pos) !== 'dinis' || W.origin('x@' + 'web-summit.nobody', pos) !== null) fail('origin')
const a = W.along({ x: 0, y: 0 }, { x: 100, y: 0 }, 0), b = W.along({ x: 0, y: 0 }, { x: 100, y: 0 }, 1)
if (a.x !== 0 || b.x !== 100) fail('along: ends')
// every person's colour (live.js's COL: the --rm-* tokens, both themes' values in assets/cc/app.css), as the light theme strokes it, reads on white
const css = fs.readFileSync(path.join(ROOT, 'assets/cc/app.css'), 'utf8'), cols = new Set()
for (const m of css.matchAll(/--rm-(?:role-conductor|role-dev|gold|role-video|green|role-outreach|orange|blue|red):\s*(#[0-9a-fA-F]{6})\b/g)) cols.add(m[1])
if (cols.size < 9) fail(`only ${cols.size} person colours found in app.css`)
for (const h of cols) { const s = W.strokeFor(h, true); if (W.contrast(W.hex2rgb(s), [255, 255, 255]) < 3) fail(`light stroke for ${h}: ${s}`) }
if (W.strokeFor('#F5D547', false) !== '#F5D547') fail('dark theme keeps the colour')
const WJ = path.join(ROOT, 'people/angelo/app/deliveries.json')
if (fs.existsSync(WJ)) { const J = JSON.parse(fs.readFileSync(WJ, 'utf8')), U = W.unpack(J); if (U.length !== J.rows.length) fail(`unpack dropped ${J.rows.length - U.length}`); console.log(JSON.stringify({ deliveries: U.length, merged: W.merge(U).length, colours: cols.size })) }
console.log(ok ? 'PASS' : 'FAIL')
