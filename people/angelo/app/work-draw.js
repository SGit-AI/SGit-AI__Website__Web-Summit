// The map's work view, its drawing (backlog 0f2; spec: people/angelo/proposals/live-map/spec-work-view.md, approved 8 November).
// dev.work@PrompTugal.angelo. Draws into the layer live.js's hook gives (host.lvGraph: pos, col, layer, svg, scale, win, doc;
// the hook is people/angelo/map/work/drafts/live-hook.patch, a draft For: dev.map@PrompTugal.angelo): the ten destinations as
// rounded squares on the hexagon's rim (a logo where the destination publishes one, else a plain mark), each name in a pill outside
// the rim, a count per square for the window shown, and each delivery as a typed icon travelling from its maker to its destination
// in the maker's colour (a darker shade in the light theme), merged with a number when several land in the same minute.
// The rules (places, merge, origin, strokes) are work.js's; this file only draws. No text from any commit is ever drawn: only the
// destinations' names and numbers. Runs in the browser as window.AngeloWorkDraw.
(function (root) {
    'use strict'
    const NS = 'http://www.w3.org/2000/svg'
    const W = () => root.AngeloWork
    // each destination's mark: its own logo (work-logos/, SOURCES.md) or a plain mark, one of the six icons, in the graph's style
    const LOGO = { news: { dark: 'pt-news-dark.svg', light: 'pt-news-light.svg' }, linkedin: { dark: 'linkedin.svg', light: 'linkedin.svg' } }
    const MARK = { site: 'cog', research: 'doc', infra: 'cog', app: 'cog', keys: 'key', crm: 'record', email: 'envelope', drafts: 'doc' }
    const SQ = 58, FONT = 19, MIN_PX = 12
    const CSS = `
.lv.lv-workview .lv-links, .lv.lv-workview .lv-pulses { opacity: .35; }
.lv.lv-workview .lv-svg { overflow: visible; }
.lv.lv-workview .lv-hex { width: min(58cqw, 84cqh); height: min(58cqw, 84cqh); }
@container (max-width: 640px) { .lv.lv-workview .lv-hex { width: min(94cqw, 64cqh); height: min(94cqw, 64cqh); } }
.wv-sq rect { fill: var(--rm-surface, #0E2035); stroke: var(--rm-border, #294A64); stroke-width: 2; }
.wv-sq.wv-lit rect { stroke: var(--rm-action, #4aa3ff); stroke-width: 4; }
.wv-sq .wv-mark { fill: none; stroke: var(--rm-text-secondary, #BCCCDC); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.wv-lead { fill: none; stroke: var(--rm-border, #294A64); stroke-width: 2; }
.wv-pill rect { fill: var(--rm-surface, #0E2035); stroke: var(--rm-border, #294A64); stroke-width: 1.5; }
.wv-pill text, .wv-n text, .wv-num { font-family: var(--rm-font, system-ui, sans-serif); font-weight: 600; fill: var(--rm-text, #F7FAFC); }
.wv-n circle { fill: var(--rm-action, #4aa3ff); }
.wv-n text { fill: #fff; font-size: 15px; }
.wv-fly circle.wv-bg { fill: var(--rm-bg, #07111F); }
.wv-fly path { fill: none; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.wv-trail { fill: none; stroke-width: 2.4; stroke-linecap: round; }
.wv-num { font-size: 15px; }
`
    const el = (doc, t, a, p) => { const e = doc.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e }
    const f1 = n => (+n).toFixed(1)

    // where each destination's name goes: outside the rim, away from the centre, inside the frame [lo, hi] (drawing units), never on
    // another pill. font: the pill's text size in drawing units, so it shows at least 12 px whatever the graph's size (dashboard@'s
    // note); sq: the squares' size. Beside its square where the frame leaves room; where it does not (a phone), every name goes in
    // rows above the hexagon (the upper half's) or below it (the lower half's), each joined to its square by a thin leader; on a
    // phone the hexagon keeps nearly the frame's width and the rows use the room above and below it (dashboard@'s review, de879c5).
    // avoid: the graph's own furniture (live.js's logos and LIVE, its date line, the layout switch) as boxes in drawing units;
    // no pill is left on one.
    function pillsFor(P, names, font, lo = -Infinity, hi = Infinity, sq = SQ, avoid = []) {
        const hits = b => avoid.find(o => b.x < o.x + o.w && o.x < b.x + b.w && b.y < o.y + o.h && o.y < b.y + b.h)
        const C = W().C, h = Math.round(font * 1.6), gap = Math.round(font * 0.5), out = new Map(), wOf = d => Math.round(names[d].length * font * 0.56 + font * 1.2)
        let fits = true
        for (const [d, p] of P) {
            const w = wOf(d); let x, y
            if (Math.abs(p.ny) > 0.8) { x = p.x - w / 2; y = p.ny < 0 ? p.y - sq / 2 - gap - h : p.y + sq / 2 + gap }   // top and bottom edges
            else { x = p.x > C ? p.x + sq / 2 + gap : p.x - sq / 2 - gap - w; y = p.y - h / 2; if (x < lo || x + w > hi) fits = false }
            out.set(d, { x: Math.max(lo, Math.min(hi - w, x)), y, w, h, mode: 'beside' })
        }
        if (fits) {
            const all = [...out.values()]   // pills that overlap move apart vertically, away from each other
            for (let pass = 0; pass < 6; pass++) for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
                const a = all[i], b = all[j]
                if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) { const up = a.y + a.h / 2 < b.y + b.h / 2 ? a : b, down = up === a ? b : a, need = (up.y + up.h + 4 - down.y) / 2; up.y -= need; down.y += need }
            }
            // a pill on the furniture steps off it vertically, the way away from the furniture's middle
            for (const a of all) for (let k = 0, o; k < 4 && (o = hits(a)); k++) a.y = a.y + a.h / 2 < o.y + o.h / 2 ? o.y - a.h - 4 : o.y + o.h + 4
            return out
        }
        // rows: the hexagon's top edge is at y 67 and its bottom at 933 (work.js's HEX); rows stack outwards from there
        out.clear()
        for (const upper of [true, false]) {
            const mine = [...P].filter(([, p]) => (p.y < C) === upper).sort((x, y) => x[1].x - y[1].x), rows = []
            for (const [d, p] of mine) {
                const w = wOf(d), x = Math.max(lo, Math.min(hi - w, p.x - w / 2))
                const edge = upper ? Math.min(67, p.y) - sq / 2 - gap : Math.max(933, p.y) + sq / 2 + gap, yAt = r => upper ? edge - h - r * (h + gap) : edge + r * (h + gap)
                let r = 0; while ((rows[r] || []).some(o => x < o.x + o.w + gap && o.x < x + w + gap) || (r < 12 && hits({ x, y: yAt(r), w, h }))) r++
                ;(rows[r] = rows[r] || []).push({ x, w })
                out.set(d, { x, y: yAt(r), w, h, mode: 'rows', row: r })
            }
        }
        return out
    }

    // a colour named by a custom property (live.js's col holds 'var(--rm-...)') as #rrggbb, for work.js's light-theme stroke
    function resolve(win, node, c) {
        const m = String(c || '').match(/^var\((--[\w-]+)/); if (!m) return c
        const v = win.getComputedStyle(node).getPropertyValue(m[1]).trim(); return v || c
    }
    function isLight(win, node) {
        const bg = (win.getComputedStyle(node).backgroundColor.match(/\d+(\.\d+)?/g) || [7, 17, 31]).slice(0, 3).map(Number)
        return (0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]) > 140
    }

    // attach(G, o): G is live.js's host.lvGraph; o.base is the app's folder (for the logos), o.clock 'manual' for replay and the clip
    // (frames stepped by step(now)), else the drawing runs on G.win's frames. Returns { fly(list, now), counts(c), step(now), destroy }.
    function attach(G, o = {}) {
        const A = W(), win = G.win || root, doc = G.doc || root.document, svg = G.svg, wrap = svg.closest('.lv') || svg.parentNode
        if (!doc.getElementById('wv-css')) { const s = doc.createElement('style'); s.id = 'wv-css'; s.textContent = CSS; doc.head.appendChild(s) }
        wrap.classList.add('lv-workview')
        const scale = G.scale || 0.84, C = A.C, light = o.light != null ? o.light : isLight(win, wrap)
        // the layer sits inside the graph's group (scaled by G.scale about the centre); this group undoes that, so the squares
        // sit on the hexagon's own rim, and maps the graph's positions out to the same frame
        const top = el(doc, 'g', { class: 'wv', transform: `translate(${C} ${C}) scale(${(1 / scale).toFixed(5)}) translate(${-C} ${-C})` }, G.layer)
        const out = p => ({ x: C + (p.x - C) * scale, y: C + (p.y - C) * scale })
        const trails = el(doc, 'g', { class: 'wv-trails' }, top), squares = el(doc, 'g', { class: 'wv-squares' }, top), flights = el(doc, 'g', { class: 'wv-flights' }, top)
        const P = A.places(1), sq = new Map()
        for (const d of A.DESTS) {
            const p = P.get(d), g = el(doc, 'g', { class: 'wv-sq', 'data-dest': d, transform: `translate(${f1(p.x)} ${f1(p.y)})` }, squares)
            el(doc, 'title', {}, g).textContent = A.DEST_NAMES[d]
            const inner = el(doc, 'g', { class: 'wv-sqi' }, g)
            el(doc, 'rect', { x: -SQ / 2, y: -SQ / 2, width: SQ, height: SQ, rx: 12 }, inner)
            const logo = LOGO[d]
            if (logo) el(doc, 'image', { href: (o.base || '') + 'work-logos/' + logo[light ? 'light' : 'dark'], x: -18, y: -18, width: 36, height: 36 }, inner)
            else el(doc, 'path', { class: 'wv-mark', d: A.ICON_PATHS[MARK[d]], transform: 'scale(1.5)' }, inner)
            const lead = el(doc, 'path', { class: 'wv-lead' }, squares)
            const pill = el(doc, 'g', { class: 'wv-pill', 'data-dest': d }, squares)
            const pr = el(doc, 'rect', {}, pill), pt = el(doc, 'text', { 'text-anchor': 'middle' }, pill); pt.textContent = A.DEST_NAMES[d]
            const n = el(doc, 'g', { class: 'wv-n', transform: `translate(${SQ / 2 - 4} ${-SQ / 2 + 4})`, style: 'display:none' }, inner)
            el(doc, 'circle', { r: 13 }, n); const nt = el(doc, 'text', { y: 5, 'text-anchor': 'middle' }, n)
            sq.set(d, { p, g, inner, lead, n, nt, pill, pr, pt, lit: 0 })
        }
        // the pills, laid out for the size the graph is shown at: text at least MIN_PX on screen, inside the frame (re-laid on resize)
        function layoutPills() {
            const r = svg.getBoundingClientRect(), fr = wrap.getBoundingClientRect(), k = r.width / A.S
            const font = k > 0 ? Math.max(FONT, MIN_PX / k) : FONT, size = k > 0 ? Math.max(SQ, 26 / k) : SQ
            const lo = k > 0 ? (fr.left - r.left) / k + 4 : -Infinity, hi = k > 0 ? (fr.right - r.left) / k - 4 : Infinity
            const box = e => { const b = e.getBoundingClientRect(); return { x: (b.left - r.left) / k - 6, y: (b.top - r.top) / k - 6, w: b.width / k + 12, h: b.height / k + 12 } }
            const avoid = k > 0 ? [...wrap.querySelectorAll('.lv-top, .lv-when, .lv-lay')].filter(e => e.getBoundingClientRect().width).map(box) : []
            const L = pillsFor(P, A.DEST_NAMES, font, lo, hi, size, avoid)
            for (const [d, s] of sq) {
                const b = L.get(d), p = s.p
                s.inner.setAttribute('transform', `scale(${(size / SQ).toFixed(3)})`)
                // the leader, in rows: from the pill's edge nearest the square, straight to the square's outer side
                const lx = Math.max(b.x + b.h / 2, Math.min(b.x + b.w - b.h / 2, p.x)), ly = p.y < A.C ? b.y + b.h : b.y
                s.lead.setAttribute('d', b.mode === 'rows' ? `M${f1(lx)} ${f1(ly)}L${f1(p.x)} ${f1(p.y + (p.y < A.C ? -size / 2 : size / 2))}` : '')
                s.pill.setAttribute('transform', `translate(${f1(b.x)} ${f1(b.y)})`)
                for (const [k2, v] of Object.entries({ width: b.w, height: b.h, rx: b.h / 2 })) s.pr.setAttribute(k2, f1(v))
                s.pt.setAttribute('x', f1(b.w / 2)); s.pt.setAttribute('y', f1(b.h / 2 + font * 0.36)); s.pt.style.fontSize = f1(font) + 'px'
            }
            return { font, px: font * k }
        }
        let laid = layoutPills()
        const RO = win.ResizeObserver ? new win.ResizeObserver(() => { laid = layoutPills() }) : null
        if (RO) RO.observe(wrap)
        const live = []      // the flights in the air: { d, t0, a, b, g, trail }
        const colourOf = maker => {
            const node = G.pos.get(A.origin(maker, G.pos)) || {}, c = G.col && G.col.get(node.person)
            return A.strokeFor(resolve(win, wrap, c) || '#9EB2C7', light)
        }
        // fly(list, now): each merged delivery (work.js's merge) leaves its maker's node now and lands about FLIGHT_MS later
        function fly(list, now) {
            for (const d of list) {
                const from = A.origin(d.maker, G.pos), s = sq.get(d.dest); if (!from || !s) continue
                const a = out(G.pos.get(from)), b = s.p, stroke = colourOf(d.maker)
                const trail = el(doc, 'path', { class: 'wv-trail', stroke, 'stroke-opacity': 0, d: '' }, trails)
                const g = el(doc, 'g', { class: 'wv-fly', 'data-icon': d.icon, 'data-dest': d.dest }, flights)
                el(doc, 'circle', { class: 'wv-bg', r: 17, stroke, 'stroke-width': 1.5 }, g)
                el(doc, 'path', { d: A.ICON_PATHS[d.icon], stroke }, g)
                if (d.n > 1) { const t = el(doc, 'text', { class: 'wv-num', x: 20, y: -12 }, g); t.textContent = String(d.n) }
                live.push({ d, t0: now, a, b, g, trail })
            }
            if (live.length) kick()
        }
        function counts(c) {
            for (const [d, s] of sq) { const v = (c && c[d]) || 0; s.n.style.display = v ? '' : 'none'; s.nt.textContent = v > 99 ? '99+' : String(v) }
        }
        // step(now): moves every flight to its place at now; a flight that has landed lights its square for a moment
        function step(now) {
            for (let i = live.length - 1; i >= 0; i--) {
                const f = live[i], u = (now - f.t0) / A.FLIGHT_MS
                if (u >= 1) { f.g.remove(); f.trail.remove(); live.splice(i, 1); const s = sq.get(f.d.dest); s.lit = now + 900; s.g.classList.add('wv-lit'); continue }
                if (u < 0) { f.g.style.display = 'none'; continue }
                f.g.style.display = ''
                const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2, p = A.along(f.a, f.b, e)
                f.g.setAttribute('transform', `translate(${f1(p.x)} ${f1(p.y)})`)
                const q = A.along(f.a, f.b, Math.max(0, e - 0.25)), m = A.along(f.a, f.b, Math.max(0, e - 0.12))
                f.trail.setAttribute('d', `M${f1(q.x)} ${f1(q.y)}Q${f1(m.x)} ${f1(m.y)} ${f1(p.x)} ${f1(p.y)}`)
                f.trail.setAttribute('stroke-opacity', f1(0.6 * Math.sin(Math.PI * u)))
            }
            for (const [, s] of sq) if (s.lit && s.lit <= now) { s.lit = 0; s.g.classList.remove('wv-lit') }
        }
        let raf = 0, alive = true
        const manual = o.clock === 'manual'
        const frame = ts => { raf = 0; if (!alive) return; step(ts); if (live.length || [...sq.values()].some(s => s.lit)) raf = win.requestAnimationFrame(frame) }
        const kick = () => { if (!manual && !raf && alive) raf = win.requestAnimationFrame(frame) }
        function destroy() { alive = false; if (RO) RO.disconnect(); if (raf) win.cancelAnimationFrame(raf); top.remove(); wrap.classList.remove('lv-workview'); live.length = 0 }
        return { fly, counts, step, destroy, inAir: () => live.length, light, pills: () => laid }
    }

    root.AngeloWorkDraw = { attach, pillsFor, LOGO, MARK }
})(typeof self !== 'undefined' ? self : this)
