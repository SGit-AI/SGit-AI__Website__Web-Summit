#!/usr/bin/env node
// The stylised venue map for Angelo's command centre (Where), from OpenStreetMap's own outlines (Angelo, 7 November:
// "draw a stylized version of the relevant parts of the map ... all contained in the same area ... less noise").
// Reads an OpenStreetMap extract (the API's map call for the area, saved as JSON), keeps only what matters for the
// summit (the venues, the station, the shopping centre, the two main streets, the river), simplifies each outline and
// projects it to a 1000-wide SVG frame. Writes people/angelo/app/venue-map.js (data only, no code that runs).
//   curl -A <agent> "https://api.openstreetmap.org/api/0.6/map.json?bbox=-9.1035,38.7650,-9.0890,38.7745" -o osm.json
//   node people/angelo/tools/venue-map.mjs osm.json [--newsroom <path>/assets/venue/venue-map.json]
// With --newsroom it writes the same data a second time, as plain JSON, for PrompTugal.news's /summit/venue/ (WS-181 Part B):
// one generator, two copies.
// Map data © OpenStreetMap contributors, under the ODbL (https://www.openstreetmap.org/copyright).
import fs from 'fs'
const NEWS = process.argv.includes('--newsroom') ? process.argv[process.argv.indexOf('--newsroom') + 1] : null
const src = process.argv[2]; if (!src) { console.error('venue-map: an OSM extract (JSON) is needed'); process.exit(2) }
const d = JSON.parse(fs.readFileSync(src, 'utf8'))
const N = new Map(), W = new Map(), R = new Map()
for (const e of d.elements) (e.type === 'node' ? N : e.type === 'way' ? W : R).set(e.id, e)
// the frame: Oriente station in the west, FIL's north end, the river in the east, Pavilhão de Portugal in the south
const B = { s: 38.7652, n: 38.7742, w: -9.1030, e: -9.0896 }
const K = Math.cos((38.77 * Math.PI) / 180), WID = 1000, HEI = Math.round(WID * (B.n - B.s) / ((B.e - B.w) * K))
const px = ([la, lo]) => [+(((lo - B.w) / (B.e - B.w)) * WID).toFixed(1), +(((B.n - la) / (B.n - B.s)) * HEI).toFixed(1)]
const pts = w => w.nodes.map(n => N.get(n)).filter(Boolean).map(n => px([n.lat, n.lon]))
// Douglas-Peucker, in SVG units (1 unit is about 1.2 m)
function simplify(p, tol) {
    if (p.length < 3) return p
    const dist = (q, a, b) => { const [x, y] = q, [x1, y1] = a, [x2, y2] = b, L = Math.hypot(x2 - x1, y2 - y1) || 1; return Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) / L }
    let i0 = 0, dm = 0; for (let i = 1; i < p.length - 1; i++) { const dd = dist(p[i], p[0], p[p.length - 1]); if (dd > dm) { dm = dd; i0 = i } }
    if (dm <= tol) return [p[0], p[p.length - 1]]
    return [...simplify(p.slice(0, i0 + 1), tol).slice(0, -1), ...simplify(p.slice(i0), tol)]
}
// a closed ring's first and last points are the same, which collapses Douglas-Peucker: split it at the point farthest
// from the start, and simplify the two halves
function simplifyRing(p, tol) {
    if (p.length < 4) return p
    let k = 1, dm = 0; for (let i = 1; i < p.length - 1; i++) { const dd = Math.hypot(p[i][0] - p[0][0], p[i][1] - p[0][1]); if (dd > dm) { dm = dd; k = i } }
    return [...simplify(p.slice(0, k + 1), tol).slice(0, -1), ...simplify(p.slice(k), tol)]
}
const centre = p => { const xs = p.map(q => q[0]), ys = p.map(q => q[1]); return [+((Math.min(...xs) + Math.max(...xs)) / 2).toFixed(1), +((Math.min(...ys) + Math.max(...ys)) / 2).toFixed(1)] }
const path = (p, close) => 'M' + p.map(([x, y]) => `${x} ${y}`).join('L') + (close ? 'Z' : '')
const area = (id, label, kind, tol = 3) => { const w = W.get(id); if (!w) throw new Error('missing way ' + id); const q = simplifyRing(pts(w), tol); return { id: 'osm-' + id, label, kind, d: path(q, true), c: centre(q), osm: 'https://www.openstreetmap.org/way/' + id } }
// a relation's outer ways, joined end to end
function relArea(id, label, kind) {
    const r = R.get(id); if (!r) throw new Error('missing relation ' + id)
    const ways = r.members.filter(m => m.type === 'way' && m.role !== 'inner').map(m => W.get(m.ref)).filter(Boolean).map(w => w.nodes.slice())
    let ring = ways.shift() || []
    while (ways.length) { const end = ring[ring.length - 1], i = ways.findIndex(w => w[0] === end || w[w.length - 1] === end); if (i < 0) break; const w = ways.splice(i, 1)[0]; ring = ring.concat((w[0] === end ? w : w.reverse()).slice(1)) }
    const q = simplifyRing(ring.map(n => N.get(n)).filter(Boolean).map(n => px([n.lat, n.lon])), 3)
    return { id: 'osm-r' + id, label, kind, d: path(q, true), c: centre(q), osm: 'https://www.openstreetmap.org/relation/' + id }
}
const areas = [
    area(821641463, 'FIL', 'site', 4),
    area(821643074, 'Pavilion 1', 'hall'), area(821643075, 'Pavilion 2', 'hall'), area(821643076, 'Pavilion 3', 'hall'), area(821643077, 'Pavilion 4', 'hall'),
    area(821784762, 'MEO Arena', 'arena', 2),
    relArea(3266709, 'Pavilhão de Portugal', 'landmark'),
    area(189718436, 'Oriente station', 'station', 4),
    area(240816973, 'Vasco da Gama centre', 'landmark', 4),
]
// streets: every way of the two that frame the venues, simplified
const streets = [['Avenida Dom João II', 'Av. Dom João II'], ['Alameda dos Oceanos', 'Alameda dos Oceanos']].map(([name, short]) => {
    const ws = [...W.values()].filter(w => (w.tags || {}).name === name && /secondary|residential|pedestrian/.test((w.tags || {}).highway || '')).map(w => simplify(pts(w), 4))
    // the label: along the street, near the top of the frame, at the street's own angle
    const all = ws.flat().filter(([x, y]) => x >= 0 && x <= WID && y >= 0 && y <= HEI).sort((a, b) => a[1] - b[1]), top = all[0] || [0, 0], low = all.find(q => q[1] > top[1] + 120) || all[all.length - 1] || top
    return { name, short, d: ws.map(q => path(q, false)).join(''), at: [top[0], +(top[1] + 40).toFixed(1)], angle: +(Math.atan2(low[1] - top[1], low[0] - top[0]) * 180 / Math.PI).toFixed(1) }
})
// the river: the coastline inside the frame, closed along the frame's east edge
const coast = W.get(680558215)
const inFrame = ([x, y]) => x >= -50 && x <= WID + 50 && y >= -50 && y <= HEI + 50
const cp = simplify(pts(coast).filter(inFrame), 4).sort((a, b) => a[1] - b[1])
const river = path([[WID + 20, -20], ...cp.map(([x, y]) => [x, y]), [WID + 20, HEI + 20]], true)
const out = { about: 'The stylised venue map for Angelo\'s command centre, from OpenStreetMap (read ' + new Date().toISOString().slice(0, 10) + ', the API\'s map call for the frame below), simplified by people/angelo/tools/venue-map.mjs. Map data © OpenStreetMap contributors, ODbL.', frame: { ...B, width: WID, height: HEI }, areas, streets, river }
fs.writeFileSync(new URL('../app/venue-map.js', import.meta.url), '// Generated by people/angelo/tools/venue-map.mjs from OpenStreetMap; do not edit by hand. Map data © OpenStreetMap contributors (ODbL).\nself.AngeloVenueMap = ' + JSON.stringify(out) + '\n')
if (NEWS) fs.writeFileSync(NEWS, JSON.stringify(out) + '\n')
console.log(`venue-map: ${areas.length} areas, ${streets.length} streets, frame ${WID}x${HEI}`)
