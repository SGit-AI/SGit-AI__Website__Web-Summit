// The map's deliveries as a dumbbell (backlog 0c5; spec: people/angelo/proposals/live-map/dumbbell/spec-dumbbell.md, approved by
// Angelo on 9 November about 17:30 UTC, with his 17:35 change: icons and a 3 to 4 letter abbreviation, no list, no counts).
// dev.work@PrompTugal.angelo. The team and the machine at one end (the live graph, smaller, in a circle), the destinations at the
// other as a second bell of ten icons on the arc that faces the team (the busiest in the middle, the quiet ones dimmed towards the
// ends), and between them one route per person and destination, as wide as that person's deliveries there over the last seven
// days. Orientation is a setting: the team on top, below, on the left or on the right, or Automatic (top on a portrait screen,
// left on a landscape one). This file holds the view's geometry and rules as pure functions (window.AngeloWorkBell in the
// browser, a module in node for the tests); work-draw.js draws with them. It reads only what work.js unpacks from deliveries.json
// or workstreams.json: names and times, never a commit's text.
(function (root, make) {
    const m = make()
    if (typeof module === 'object' && module.exports) module.exports = m
    else root.AngeloWorkBell = m
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict'
    const ORIENTS = ['auto', 'top', 'below', 'left', 'right']
    const ORIENT_NAMES = { auto: 'Automatic', top: 'Team on top', below: 'Team below', left: 'Team on the left', right: 'Team on the right' }
    // the abbreviations under the icons (the spec, Angelo's 17:35 answer); the full name is the icon's title
    const ABBR = { news: 'PTN', site: 'SITE', research: 'RSCH', infra: 'INFR', app: 'APP', keys: 'KEYS', crm: 'CRM', email: 'MAIL', linkedin: 'LNKD', drafts: 'DRFT' }
    const WEEK = 7 * 864e5

    // The frame, drawn for the team on the left and turned for the other three: a landscape box 1700 x 1100 (a portrait one,
    // 1100 x 1700, for top and below). The network's circle on the left; the bell's ten places on an arc of a circle whose centre
    // lies beyond the right edge, so the middle of the bell is nearest the team and its ends curve away (the mock-ups).
    const LW = 1700, LH = 1100
    const NET = { x: 440, y: 550, r: 400 }
    const BELL = { x: 1850, y: 550, r: 500, span: Math.PI / 3 }   // span: half the arc; places from x 1350 (the middle) to 1600 (the ends), y 117 to 983, room below each for its abbreviation
    const SLOT_ORDER = n => { const mid = (n - 1) / 2, idx = [...Array(n).keys()]; return idx.sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid) || a - b) }   // the middle first, then outwards, alternating

    function orient(o, w, h) { return ORIENTS.includes(o) && o !== 'auto' ? o : (w > 0 && h > w ? 'top' : 'left') }
    // turn a point of the left frame into the chosen one; vectors (no translation) turn the same way
    function turn(or, p) {
        if (or === 'left') return { x: p.x, y: p.y }
        if (or === 'right') return { x: LW - p.x, y: p.y }
        if (or === 'top') return { x: p.y, y: p.x }
        return { x: p.y, y: LW - p.x }               // below
    }
    const turnV = (or, v) => { const a = turn(or, { x: 0, y: 0 }), b = turn(or, v); return { x: b.x - a.x, y: b.y - a.y } }
    function box(or) { return or === 'left' || or === 'right' ? { w: LW, h: LH } : { w: LH, h: LW } }

    // ordered(dests, weights): the destinations in the bell's places, the busiest in the middle, the quiet ones (0) towards the
    // ends; a tie keeps the destinations' own order, so a quiet week does not shuffle them
    function ordered(dests, weights = {}) {
        const by = dests.map((d, i) => ({ d, i, w: weights[d] || 0 })).sort((a, b) => b.w - a.w || a.i - b.i)
        const out = new Array(dests.length); SLOT_ORDER(dests.length).forEach((slot, k) => { out[slot] = by[k].d }); return out
    }

    // layout(or, dests, weights): { or, w, h, net: { x, y, r }, places: Map(dest -> { x, y, nx, ny, quiet, abbr }) }; nx, ny: the
    // way the icon faces (towards the team), so a route arrives square on
    function layout(or, dests, weights = {}) {
        const order = ordered(dests, weights), n = order.length, P = new Map()
        order.forEach((d, i) => {
            const t = n > 1 ? i / (n - 1) * 2 - 1 : 0, a = Math.PI + t * BELL.span           // from the upper end round to the lower
            const p = { x: BELL.x + BELL.r * Math.cos(a), y: BELL.y - BELL.r * Math.sin(a) }
            const q = turn(or, p), f = turnV(or, { x: Math.cos(a), y: -Math.sin(a) })   // from the bell's centre out: towards the team
            P.set(d, { x: q.x, y: q.y, nx: f.x, ny: f.y, quiet: !(weights[d] > 0), abbr: ABBR[d] || abbrOf(d) })
        })
        const c = turn(or, NET)
        return { or, ...box(or), net: { x: c.x, y: c.y, r: NET.r }, places: P }
    }
    // a workstream's abbreviation (the spec: "the issue's first word"), cut to four letters; anything else, its first four letters
    function abbrOf(d, name) { const w = String(name || d).replace(/^WS-\d+\s+/, '').split(/[^A-Za-z0-9]+/).find(Boolean) || String(d); return w.slice(0, 4).toUpperCase() }

    // the person a maker belongs to (pt:<person>:<agent>, <agent>@<project>.<person>, or a person's own id)
    function personOf(maker) {
        const s = String(maker || ''), m = s.match(/^pt:([a-z0-9-]+):/) || s.match(/@[a-z0-9-]+\.([a-z0-9-]+)$/i)
        return m ? m[1].toLowerCase() : /^[a-z0-9-]+$/.test(s) ? s : null
    }
    // routes(list, now, people): the last seven days' deliveries ({ at, maker, dest }) by person and destination; people: the
    // persons the map draws (a Set or array), others dropped. Returns { routes: [{ person, dest, n }], weights: { dest: n }, max }
    function routes(list, now, people) {
        const keep = people ? new Set(people) : null, g = new Map(), weights = {}
        for (const d of list) {
            if (!(d.at > now - WEEK && d.at <= now)) continue
            const p = personOf(d.maker); if (!p || (keep && !keep.has(p))) continue
            const k = p + '|' + d.dest; g.set(k, (g.get(k) || 0) + 1); weights[d.dest] = (weights[d.dest] || 0) + 1
        }
        const out = [...g].map(([k, n]) => { const [person, dest] = k.split('|'); return { person, dest, n } }).sort((a, b) => b.n - a.n || (a.person + a.dest).localeCompare(b.person + b.dest))
        return { routes: out, weights, max: out.reduce((m, r) => Math.max(m, r.n), 0) }
    }
    // a route's width in the frame's units: thin for one delivery, at most 18 for the busiest (by the square root, so the busiest
    // does not drown the rest)
    const width = (n, max) => n > 0 && max > 0 ? +(1.5 + 16.5 * Math.sqrt(n / max)).toFixed(2) : 0

    // the route from a person's place a to its destination's place b (with b's facing nx, ny): a cubic that leaves a along the
    // dumbbell's axis, crosses the middle and arrives square on at b. Returns the four points.
    function route(or, a, b) {
        const ax = turnV(or, { x: 1, y: 0 }), L = Math.hypot(b.x - a.x, b.y - a.y) * 0.42
        return [a, { x: a.x + ax.x * L, y: a.y + ax.y * L }, { x: b.x + b.nx * L, y: b.y + b.ny * L }, b]
    }
    function at(c, t) {
        const u = 1 - t, k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t]
        return { x: k.reduce((s, w, i) => s + w * c[i].x, 0), y: k.reduce((s, w, i) => s + w * c[i].y, 0) }
    }
    function svgPath(c) { const f = p => p.x.toFixed(1) + ' ' + p.y.toFixed(1); return `M${f(c[0])}C${f(c[1])} ${f(c[2])} ${f(c[3])}` }

    // where the network's graph goes: live.js draws it in a 1000 square about its centre C; the dumbbell shows it in the circle
    // net, so a graph point p lands at net + (p - C) * k
    function netMap(L, C = 500, S = 1000) { const k = L.net.r / (S / 2); return { k, tx: L.net.x - C * k, ty: L.net.y - C * k, map: p => ({ x: L.net.x + (p.x - C) * k, y: L.net.y + (p.y - C) * k }) } }

    return { ORIENTS, ORIENT_NAMES, ABBR, WEEK, orient, turn, box, ordered, layout, abbrOf, personOf, routes, width, route, at, svgPath, netMap }
})
