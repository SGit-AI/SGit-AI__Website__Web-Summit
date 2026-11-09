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
    const LW = 1700, LH = 1100, TP = 100, TALL_R = 1200, TALL_SPAN = 0.5   // the tall frame: 1300 x 1700, its bell flatter (found with wvbell at a phone's sizes)
    const NET = { x: 440, y: 550, r: 400 }
    // span: half the arc. Wide (team left or right): places from x 1270 (the middle) to 1520 (the ends), y 117 to 983, each
    // abbreviation beside its icon. Tall (team on top or below): a flatter bell, so the abbreviations under the icons have room.
    const BELLS = { wide: { x: 1770, y: 550, r: 500, span: Math.PI / 3 }, tall: { x: 1270 + TALL_R, y: 550, r: TALL_R, span: TALL_SPAN } }
    const SLOT_ORDER = n => { const mid = (n - 1) / 2, idx = [...Array(n).keys()]; return idx.sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid) || a - b) }   // the middle first, then outwards, alternating

    function orient(o, w, h) { return ORIENTS.includes(o) && o !== 'auto' ? o : (w > 0 && h > w ? 'top' : 'left') }
    // turn a point of the left frame into the chosen one; vectors (no translation) turn the same way
    function turn(or, p) {
        if (or === 'left') return { x: p.x, y: p.y }
        if (or === 'right') return { x: LW - p.x, y: p.y }
        if (or === 'top') return { x: p.y + TP, y: p.x }   // TP: the tall frame is wider than the wide one is tall, for the flatter bell
        return { x: p.y + TP, y: LW - p.x }               // below
    }
    const turnV = (or, v) => { const a = turn(or, { x: 0, y: 0 }), b = turn(or, v); return { x: b.x - a.x, y: b.y - a.y } }
    function box(or) { return or === 'left' || or === 'right' ? { w: LW, h: LH } : { w: LH + 2 * TP, h: LW } }

    // ordered(dests, weights): the destinations in the bell's places, the busiest in the middle, the quiet ones (0) towards the
    // ends; a tie keeps the destinations' own order, so a quiet week does not shuffle them
    function ordered(dests, weights = {}) {
        const by = dests.map((d, i) => ({ d, i, w: weights[d] || 0 })).sort((a, b) => b.w - a.w || a.i - b.i)
        const out = new Array(dests.length); SLOT_ORDER(dests.length).forEach((slot, k) => { out[slot] = by[k].d }); return out
    }

    // layout(or, dests, weights): { or, w, h, net: { x, y, r }, places: Map(dest -> { x, y, nx, ny, quiet, abbr }) }; nx, ny: the
    // way the icon faces (towards the team), so a route arrives square on
    function layout(or, dests, weights = {}) {
        const order = ordered(dests, weights), n = order.length, P = new Map(), BELL = BELLS[or === 'left' || or === 'right' ? 'wide' : 'tall']
        order.forEach((d, i) => {
            const t = n > 1 ? i / (n - 1) * 2 - 1 : 0, a = Math.PI + t * BELL.span           // from the upper end round to the lower
            const p = { x: BELL.x + BELL.r * Math.cos(a), y: BELL.y - BELL.r * Math.sin(a) }
            const q = turn(or, p), f = turnV(or, { x: Math.cos(a), y: -Math.sin(a) })   // from the bell's centre out: towards the team
            P.set(d, { x: q.x, y: q.y, nx: f.x, ny: f.y, row: i % 2, quiet: !(weights[d] > 0), abbr: ABBR[d] || abbrOf(d) })
        })
        const c = turn(or, NET)
        return { or, ...box(or), net: { x: c.x, y: c.y, r: NET.r }, places: P }
    }
    // where an icon's abbreviation goes: straight out from the icon, away from the team (beside it in the middle of the bell when
    // the team is on the left or the right, under or over it when the team is on top or below, outwards along the arc's ends), so
    // an abbreviation never lands on a neighbour along the bell. half: half the icon's size; font: the text's size; n: its letters.
    // stagger: on a small screen, where the text is large beside the icons, every other place (p.row 1) sets its abbreviation on
    // the bell's inner side instead, so neighbours' abbreviations do not touch. Returns { x, y, anchor: 'middle' } relative to the icon's centre
    // (y: the text's baseline), its centre cx, cy and its box w, h.
    function label(p, half, font, n = 4, stagger = false) {
        const w = n * font * 0.86, h = font, flip = stagger && p.row, ox = flip ? p.nx : -p.nx, oy = flip ? p.ny : -p.ny
        // the least distance along (ox, oy) at which the text's box clears the icon's square, across or along, with a small gap
        const g = font * 0.35, ax = Math.abs(ox) > 1e-9 ? (half + w / 2 + g) / Math.abs(ox) : Infinity, ay = Math.abs(oy) > 1e-9 ? (half + h / 2 + g) / Math.abs(oy) : Infinity
        const d = Math.min(ax, ay), cx = ox * d, cy = oy * d
        return { x: cx, y: cy + font * 0.36, anchor: 'middle', w, h, cx, cy }
    }
    // a workstream's abbreviation (the spec: "the issue's first word"), cut to four letters; anything else, its first four letters
    // (its first word that says something: "The", "A", "An", "Of" and the like are skipped); the rest of the workstreams, OTHR
    const SMALL = new Set(['the', 'a', 'an', 'of', 'and', 'for', 'to', 'in', 'on', 'our', 'its', 'with'])
    function abbrOf(d, name) {
        const t = String(name || d).replace(/^WS-\d+\s+/, ''); if (/^other workstreams$/i.test(t) || d === 'other') return 'OTHR'
        const ws = t.split(/[^A-Za-z0-9]+/).filter(Boolean), w = ws.find(x => !SMALL.has(x.toLowerCase())) || ws[0] || String(d)
        return w.slice(0, 4).toUpperCase()
    }

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
    // agentRoutes(list, now, person, has): one person's last seven days by maker and destination, for "tap a person to see their
    // agents' own routes" (the spec, question 2). has(id): whether the graph draws that maker; a maker it does not draw, and the
    // person's own commits, go from the person. Returns [{ from, person, dest, n }], the busiest first.
    function agentRoutes(list, now, person, has = () => true) {
        const g = new Map()
        for (const d of list) {
            if (!(d.at > now - WEEK && d.at <= now) || personOf(d.maker) !== person) continue
            const from = d.maker !== person && has(d.maker) ? d.maker : person, k = from + '|' + d.dest
            g.set(k, (g.get(k) || 0) + 1)
        }
        return [...g].map(([k, n]) => { const i = k.lastIndexOf('|'); return { from: k.slice(0, i), person, dest: k.slice(i + 1), n } }).sort((a, b) => b.n - a.n || (a.from + a.dest).localeCompare(b.from + b.dest))
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

    return { ORIENTS, ORIENT_NAMES, ABBR, WEEK, orient, turn, box, ordered, layout, label, abbrOf, personOf, routes, agentRoutes, width, route, at, svgPath, netMap }
})
