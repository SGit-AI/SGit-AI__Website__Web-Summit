// The map's work view (backlog 0f2; spec: people/angelo/proposals/live-map/spec-work-view.md, approved by Angelo on 8 November).
// dev.work@PrompTugal.angelo. What was made and where it went: the ten destinations at the hexagon's rim, and at each
// delivery's real moment a typed icon travelling from its maker to its destination. This file holds the view's rules as pure
// functions (the same file runs in the browser as window.AngeloWork and in node for the tests); the drawing waits on live.js's
// hook (people/angelo/map/work/drafts/live-hook.patch, a draft For: dev.map@PrompTugal.angelo).
// It reads deliveries.json (built beside live.json): [minute, maker, icon, destination, repository, short sha]. No text, ever.
(function (root, make) {
    const m = make()
    if (typeof module === 'object' && module.exports) module.exports = m
    else root.AngeloWork = m
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict'
    const S = 1000, C = S / 2
    const DESTS0 = ['news', 'site', 'research', 'infra', 'app', 'keys', 'crm', 'email', 'linkedin', 'drafts']
    const NAMES0 = { news: 'PT News', site: 'the team site', research: 'research', infra: 'infrastructure', app: 'the app', keys: 'keys', crm: 'the CRM', email: 'email drafts', linkedin: 'LinkedIn', drafts: 'Drafts and proposals' }
    // the short names, where the full ones do not fit beside their squares (a phone: backlog 0c4 (5))
    const SHORT0 = { news: 'PT News', site: 'site', research: 'research', infra: 'infra', app: 'app', keys: 'keys', crm: 'CRM', email: 'email', linkedin: 'LinkedIn', drafts: 'drafts' }
    const ICONS = ['doc', 'cog', 'key', 'record', 'envelope', 'post']
    const FLIGHT_MS = 3000

    // the six icons, drawn in a 24 x 24 box centred on 0,0, stroked (never filled) so the sender's colour reads
    const ICON_PATHS = {
        doc: 'M-6 -9h8l4 4v14h-12zM2 -9v4h4M-3 -1h6M-3 3h6',
        cog: 'M0 -9v3M0 6v3M-9 0h3M6 0h3M-6.4 -6.4l2.1 2.1M4.3 4.3l2.1 2.1M-6.4 6.4l2.1-2.1M4.3 -4.3l2.1-2.1M0 -4a4 4 0 1 0 0.01 0',
        key: 'M-5 -3a4 4 0 1 0 0.01 0M-1 -3h10M5 -3v4M8 -3v3',
        record: 'M-8 -7h16v14h-16zM-8 -2h16M-8 3h16M-3 -7v14',
        envelope: 'M-9 -6h18v12h-18zM-9 -6l9 7l9 -7',
        post: 'M-8 -8h16v12h-9l-4 4v-4h-3zM-4 -4h8M-4 0h5',
    }

    // the destinations' places at the rim: ten squares on the hexagon's four slanted edges (flat top, corners at 0, 60 ... 300
    // degrees), in DESTS' order clockwise from the upper left, each on the hexagon's edge (the pill with its name goes outside it).
    // The top edge carries live.js's logos and LIVE, and the foot its date line, so no square sits on either (dashboard@'s review,
    // de879c5), and the upper ones sit low enough to clear the layout switch in the box's upper right corner. SLOTS: [edge, fraction along it], edges numbered clockwise from the top (0 top, 1 upper right ... 5 upper left).
    const SLOTS0 = { news: [5, 0.7], site: [1, 0.3], research: [1, 0.6], infra: [1, 0.9], app: [2, 0.35], keys: [2, 0.75], crm: [4, 0.25], email: [4, 0.65], linkedin: [5, 0.1], drafts: [5, 0.4] }
    const HEX = [[250, 67], [750, 67], [1000, 500], [750, 933], [250, 933], [0, 500]]
    function rimPoint(t) {               // t in [0, 1): a point along the hexagon's perimeter, clockwise from the top-left corner
        const k = ((t % 1) + 1) % 1 * 6, i = Math.floor(k), f = k - i, a = HEX[i], b = HEX[(i + 1) % 6]
        return { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f }
    }
    // the rules that depend on the destinations, made for a list of them: the ten of the work view by default; variant() makes the
    // same for another ten (Workstreams, backlog 0c4: the busiest WS issues and "other"), each in the default's slot of its place
    function level(DESTS, DEST_NAMES, SLOTS, DEST_SHORT = {}) {
        function places(scale = 0.86) {      // scale: how far in from the rim the squares sit (the graph itself sits at GEO's scale)
            const out = new Map()
            DESTS.forEach(d => { const [e, f] = SLOTS[d], p = rimPoint((e + f) / 6); out.set(d, { x: C + (p.x - C) * scale, y: C + (p.y - C) * scale, nx: (p.x - C) / C, ny: (p.y - C) / C }) })
            return out
        }

        // the deliveries in a window [from, to) of minutes: each with its maker's name, icon and destination
        function unpack(W) {
            if (!W || !Array.isArray(W.rows)) return []
            return W.rows.map(r => ({ min: r[0], maker: W.makers[r[1]], icon: W.icons[r[2]], dest: W.dests[r[3]], repo: (W.repos || [])[r[4]], sha: r[5] }))
                .filter(d => d.maker && ICONS.includes(d.icon) && DESTS.includes(d.dest))
        }
        // many at once: deliveries to the same destination in the same minute merge into one icon with a number; the icon shown is the
        // most frequent kind among them (the first seen on a tie), the maker the one who sent most (the first seen on a tie)
        function merge(list) {
            const g = new Map()
            for (const d of list) { const k = d.min + '|' + d.dest; if (!g.has(k)) g.set(k, { min: d.min, dest: d.dest, n: 0, icons: new Map(), makers: new Map(), shas: [] }); const x = g.get(k); x.n++; x.icons.set(d.icon, (x.icons.get(d.icon) || 0) + 1); x.makers.set(d.maker, (x.makers.get(d.maker) || 0) + 1); x.shas.push(d.sha) }
            const top = m => { let b = null, n = -1; for (const [k, v] of m) if (v > n) { b = k; n = v } return b }
            return [...g.values()].map(x => ({ min: x.min, dest: x.dest, n: x.n, icon: top(x.icons), maker: top(x.makers), makers: [...x.makers.keys()], shas: x.shas })).sort((a, b) => a.min - b.min || DESTS.indexOf(a.dest) - DESTS.indexOf(b.dest))
        }
        // the small count on each destination's square for the window shown ("PT News 4")
        function counts(list, from, to) {
            const c = Object.fromEntries(DESTS.map(d => [d, 0]))
            for (const d of list) if (d.min >= from && d.min < to) c[d.dest]++
            return c
        }
        return { DESTS, DEST_NAMES, DEST_SHORT, SLOTS, places, unpack, merge, counts }
    }
    const L0 = level(DESTS0, NAMES0, SLOTS0, SHORT0)
    function variant(dests, names) {
        const slots = {}; dests.slice(0, DESTS0.length).forEach((d, i) => { slots[d] = SLOTS0[DESTS0[i]] })
        // a workstream's short name is its title without "WS-NN " (its square shows the number); "other workstreams" is "other"
        const short = {}; for (const d of dests) short[d] = String(names[d] || d).replace(/^WS-\d+\s+/, '').replace(/^other workstreams$/i, 'other')
        return Object.assign({}, API, level(dests.slice(0, DESTS0.length), Object.assign({}, names), slots, short))
    }

    // where a delivery leaves from: the maker's own node, else its person's (an agent the map does not draw yet), else nothing
    function origin(maker, pos) {
        if (pos.has(maker)) return maker
        const p = (String(maker).match(/^pt:([a-z0-9-]+):/) || String(maker).match(/@[a-z-]+\.([a-z0-9-]+)$/i) || [])[1]
        return p && pos.has(p) ? p : null
    }
    // a point along a quadratic curve from a to b bent towards the centre by `pull` (as live.js's curves), at t in [0, 1]
    function along(a, b, t, pull = 0.18) {
        const q = { x: (a.x + b.x) / 2 + (C - (a.x + b.x) / 2) * pull, y: (a.y + b.y) / 2 + (C - (a.y + b.y) / 2) * pull }, u = 1 - t
        return { x: u * u * a.x + 2 * u * t * q.x + t * t * b.x, y: u * u * a.y + 2 * u * t * q.y + t * t * b.y }
    }

    // light theme: the icon's stroke is a darker shade of its sender's colour, dark enough to read on white (3:1 for graphics)
    const hex2rgb = h => { const m = String(h).trim().match(/^#?([0-9a-f]{6})$/i); if (!m) return null; const v = parseInt(m[1], 16); return [v >> 16, (v >> 8) & 255, v & 255] }
    const lum = ([r, g, b]) => { const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) }
    const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) }
    function strokeFor(colour, light, bg = light ? '#ffffff' : '#07111f') {
        const c = hex2rgb(colour), B = hex2rgb(bg); if (!c || !B || !light) return colour
        let k = 1, rgb = c
        while (contrast(rgb, B) < 3 && k > 0.05) { k -= 0.05; rgb = c.map(v => Math.round(v * k)) }
        return '#' + rgb.map(v => v.toString(16).padStart(2, '0')).join('')
    }

    function selfTest() {
        const P = L0.places(); if (P.size !== 10) throw new Error('work.js: ten places')
        for (const [, p] of P) if (!(p.x > 0 && p.x < S && p.y > 0 && p.y < S)) throw new Error('work.js: a place outside the square')
        const m = L0.merge([{ min: 1, dest: 'news', icon: 'doc', maker: 'a' }, { min: 1, dest: 'news', icon: 'doc', maker: 'b' }, { min: 2, dest: 'news', icon: 'doc', maker: 'a' }])
        if (m.length !== 2 || m[0].n !== 2) throw new Error('work.js: merge')
        if (contrast(hex2rgb(strokeFor('#F5D547', true)), [255, 255, 255]) < 3) throw new Error('work.js: light stroke')
        return true
    }

    const API = { S, C, ICONS, ICON_PATHS, FLIGHT_MS, rimPoint, origin, along, strokeFor, contrast, hex2rgb, selfTest, variant }
    return Object.assign(API, L0)
})
