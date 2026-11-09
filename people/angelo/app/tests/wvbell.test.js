// wvbell: the dumbbell's geometry and rules in work-bell.js (backlog 0c5, spec-dumbbell.md), no browser. For each of the four
// ends (top, below, left, right): the ten destinations inside the frame with room for the icon and its abbreviation, no two
// closer than an icon and its gap, all well away from the network's circle, the middle of the bell nearest the team; the busiest
// in the middle and the quiet ones at the ends; Automatic picks top on a portrait screen and left on a landscape one; routes by
// person over the last seven days only (older, future and unknown makers dropped), widths growing with the count and capped;
// each route leaving along the dumbbell's axis and arriving square on at its icon; the abbreviations 3 to 4 letters, one per
// destination, none alike; a workstream's from its first word; and the built deliveries.json turned into routes with nothing invented.
const path = require('path'), fs = require('fs')
const B = require('../work-bell.js'), W = require('../work.js'), ROOT = path.resolve(__dirname, '../../../..')
let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
const ICON = 72, LABEL = 48
const weights = { site: 40, infra: 22, drafts: 15, keys: 3, research: 1 }
for (const or of ['top', 'below', 'left', 'right']) {
    const L = B.layout(or, W.DESTS, weights), pts = [...L.places]
    if (pts.length !== 10) fail(or + ': ten places')
    for (const [d, p] of pts) {
        if (p.x - ICON / 2 < 0 || p.x + ICON / 2 > L.w || p.y - ICON / 2 < 0 || p.y + ICON / 2 + LABEL > L.h) fail(`${or}: ${d} at ${p.x.toFixed(0)},${p.y.toFixed(0)} leaves the ${L.w} x ${L.h} frame`)
        if (Math.hypot(p.x - L.net.x, p.y - L.net.y) < L.net.r + 300) fail(`${or}: ${d} too near the network`)
        if (Math.abs(Math.hypot(p.nx, p.ny) - 1) > 1e-6) fail(`${or}: ${d}'s facing is not a unit vector`)
        if ((L.net.x - p.x) * p.nx + (L.net.y - p.y) * p.ny <= 0) fail(`${or}: ${d} does not face the team`)
    }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const a = pts[i][1], b = pts[j][1]; if (Math.hypot(a.x - b.x, a.y - b.y) < ICON + 30) fail(`${or}: ${pts[i][0]} and ${pts[j][0]} too close`) }
    const dist = ([, p]) => Math.hypot(p.x - L.net.x, p.y - L.net.y), byDist = pts.slice().sort((a, b) => dist(a) - dist(b))
    if (!['site', 'infra'].includes(byDist[0][0]) || !['site', 'infra'].includes(byDist[1][0])) fail(`${or}: the busiest are not in the middle (${byDist.slice(0, 2).map(x => x[0])})`)
    const ends = [B.ordered(W.DESTS, weights)[0], B.ordered(W.DESTS, weights)[9]]
    if (ends.some(d => weights[d])) fail(`${or}: a busy destination at an end (${ends})`)
    if (pts.filter(([, p]) => p.quiet).length !== 5) fail(`${or}: five quiet ones dimmed`)
    // a route: leaves along the axis (towards the bell), arrives square on
    const [a, c1, c2, b] = B.route(or, { x: L.net.x, y: L.net.y }, L.places.get('site'))
    const ax = B.turn(or, { x: 1, y: 0 }), o = B.turn(or, { x: 0, y: 0 }), axis = { x: ax.x - o.x, y: ax.y - o.y }
    const u = { x: c1.x - a.x, y: c1.y - a.y }, cr = Math.abs(u.x * axis.y - u.y * axis.x) / Math.hypot(u.x, u.y)
    if (cr > 1e-6 || u.x * axis.x + u.y * axis.y <= 0) fail(`${or}: a route does not leave along the axis`)
    const v = { x: c2.x - b.x, y: c2.y - b.y }, s = L.places.get('site'), cr2 = Math.abs(v.x * s.ny - v.y * s.nx) / Math.hypot(v.x, v.y)
    if (cr2 > 1e-6) fail(`${or}: a route does not arrive square on`)
    const e0 = B.at([a, c1, c2, b], 0), e1 = B.at([a, c1, c2, b], 1)
    if (Math.hypot(e0.x - a.x, e0.y - a.y) > 1e-9 || Math.hypot(e1.x - b.x, e1.y - b.y) > 1e-9) fail(`${or}: at() ends`)
    if (!/^M[\d. -]+C[\d. -]+$/.test(B.svgPath([a, c1, c2, b]))) fail(`${or}: svgPath`)
    // the network's graph: its centre on the circle's, and the graph (at most 0.84 of the square) inside the circle
    const N = B.netMap(L), m = N.map({ x: 500, y: 500 }), edge = N.map({ x: 500 + 500 * 0.84, y: 500 })
    if (Math.hypot(m.x - L.net.x, m.y - L.net.y) > 1e-9 || Math.hypot(edge.x - L.net.x, edge.y - L.net.y) > L.net.r) fail(`${or}: netMap`)
}
// stable: a quiet week keeps the destinations' own order (centre outwards)
if (B.ordered(W.DESTS, {}).join() !== B.ordered(W.DESTS, {}).join() || B.ordered(W.DESTS, {})[4] !== W.DESTS[0]) fail('ordered: a quiet week')
if (B.orient('auto', 390, 844) !== 'top' || B.orient('auto', 1280, 800) !== 'left' || B.orient(undefined, 0, 0) !== 'left' || B.orient('below', 1280, 800) !== 'below' || B.orient('nonsense', 390, 844) !== 'top') fail('orient')
if (B.ORIENTS.length !== 5 || B.ORIENTS.some(o => !B.ORIENT_NAMES[o])) fail('the five settings, each named')
// routes: the last seven days, by person
const now = Date.parse('2026-11-09T22:00:00Z'), H = 36e5
const list = [
    { at: now - H, maker: 'pt:angelo:dev', dest: 'site' }, { at: now - 2 * H, maker: 'pt:angelo:dev.work', dest: 'site' }, { at: now - 3 * H, maker: 'angelo', dest: 'site' },
    { at: now - 4 * H, maker: 'conductor@' + 'web-summit.dinis', dest: 'infra' }, { at: now - 8 * 24 * H, maker: 'conductor@' + 'web-summit.dinis', dest: 'news' },
    { at: now + H, maker: 'pt:angelo:dev', dest: 'keys' }, { at: now - H, maker: 'x@' + 'web-summit.nobody', dest: 'crm' }, { at: now - H, maker: 'Claude', dest: 'app' },
]
const R = B.routes(list, now, ['angelo', 'dinis', 'indi'])
const key = R.routes.map(r => `${r.person}>${r.dest}:${r.n}`).join(' ')
if (key !== 'angelo>site:3 dinis>infra:1' || R.max !== 3 || R.weights.site !== 3 || R.weights.news || R.weights.keys || R.weights.crm) fail('routes: ' + key + ' ' + JSON.stringify(R.weights))
if (!(B.width(1, 3) < B.width(2, 3) && B.width(2, 3) < B.width(3, 3)) || B.width(3, 3) > 18 || B.width(0, 3) !== 0 || B.width(1, 0) !== 0) fail('width')
if (B.personOf('pt:angelo:dev.work') !== 'angelo' || B.personOf('dev@' + 'web-summit.dinis') !== 'dinis' || B.personOf('Claude') !== null) fail('personOf')
// the abbreviations: one per destination, 3 to 4 capitals, none alike, as the spec lists them
const ab = W.DESTS.map(d => B.ABBR[d])
if (ab.some(a => !/^[A-Z]{3,4}$/.test(a || '')) || new Set(ab).size !== 10) fail('abbreviations: ' + ab)
if (ab.join(' ') !== 'PTN SITE RSCH INFR APP KEYS CRM MAIL LNKD DRFT') fail('abbreviations not the spec\'s: ' + ab.join(' '))
if (B.abbrOf('WS-181', 'WS-181 Venues and the team\'s locations') !== 'VENU' || B.abbrOf('WS-12', 'WS-12 CRM') !== 'CRM') fail('a workstream\'s abbreviation')
// the built deliveries.json: routes made from it, every one with a known destination and a person the map draws
const f = path.join(ROOT, 'people/angelo/app/deliveries.json')
if (fs.existsSync(f)) {
    const J = JSON.parse(fs.readFileSync(f, 'utf8')), from = Date.parse(J.from), rows = W.unpack(J).map(d => ({ at: from + d.min * 6e4, maker: d.maker, dest: d.dest }))
    const last = Math.max(...rows.map(r => r.at)), RR = B.routes(rows, last, null), n = RR.routes.reduce((s, r) => s + r.n, 0)
    const inWeek = rows.filter(r => r.at > last - B.WEEK && B.personOf(r.maker)).length
    if (n !== inWeek) fail(`deliveries.json: ${n} in routes, ${inWeek} in the week`)
    if (RR.routes.some(r => !W.DESTS.includes(r.dest))) fail('deliveries.json: a route to an unknown destination')
} else console.log('  (deliveries.json not built: run node admin/build/build.mjs)')
console.log(ok ? 'PASS' : 'FAIL')
process.exit(ok ? 0 : 1)
