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
    // no two destinations alike (Angelo, 8 November about 23:00, backlog 0c4 (5): "there are various icons that use the same image"):
    // the three icons that are also kinds of delivery (key, record, envelope) mark keys, the CRM and email drafts; the rest have
    // their own marks, in the same 24 x 24 box and stroke: the team site a browser window, research a magnifier, infrastructure a
    // server rack, the app a phone, drafts a pencil
    const MARK = { site: 'site', research: 'research', infra: 'infra', app: 'app', keys: 'key', crm: 'record', email: 'envelope', drafts: 'drafts' }
    const MARK_PATHS = {
        site: 'M-9 -7h18v14h-18zM-9 -3h18M-6.5 -5h0.5M-4 -5h0.5',
        research: 'M-7 -3a5 5 0 1 0 10 0a5 5 0 1 0 -10 0M1.6 0.6l6.4 6.4',
        infra: 'M-8 -8h16v6h-16zM-8 2h16v6h-16zM-5 -5h3M-5 5h3M4 -5h0.5M4 5h0.5',
        app: 'M-5 -9h10v18h-10zM-2 6h4',
        drafts: 'M-7 7l1.5 -5l9 -9l3.5 3.5l-9 9zM-5.5 2l3.5 3.5M1.5 -5l3.5 3.5',
    }
    const markPath = (A, k) => MARK_PATHS[k] || A.ICON_PATHS[k] || A.ICON_PATHS.doc
    const SQ = 58, FONT = 19, MIN_PX = 12
    const CSS = `
/* the exchanges stay as visible as in Exchanges (Angelo, 8 November about 22:25, backlog 0c4: "the dots and arcs are faint"): the
   deliveries stand out by being brighter on top, never by dimming the rest */
.lv.lv-workview .lv-svg { overflow: visible; }
.lv.lv-workview .lv-hex { width: min(58cqw, 84cqh); height: min(58cqw, 84cqh); }
@container (max-width: 640px) { .lv.lv-workview .lv-hex { width: min(94cqw, 64cqh); height: min(94cqw, 64cqh); } }
.wv-sq rect { fill: var(--rm-surface, #0E2035); stroke: var(--rm-border, #294A64); stroke-width: 2; }
.wv-sq.wv-lit rect { stroke: var(--rm-action, #4aa3ff); stroke-width: 4; }
.wv-sq .wv-mark { fill: none; stroke: var(--rm-text-secondary, #BCCCDC); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.wv-pill rect { fill: var(--rm-surface, #0E2035); stroke: var(--rm-border, #294A64); stroke-width: 1.5; }
.wv-pill text, .wv-n text, .wv-num { font-family: var(--rm-font, system-ui, sans-serif); font-weight: 600; fill: var(--rm-text, #F7FAFC); }
.wv-n circle { fill: var(--rm-action, #4aa3ff); }
.wv-n text { fill: #fff; font-size: 15px; }
.wv-fly circle.wv-bg { fill: var(--rm-bg, #07111F); }
.wv-fly { filter: drop-shadow(0 0 6px currentColor); }
.wv-fly path { fill: none; stroke-width: 2.8; stroke-linecap: round; stroke-linejoin: round; }
.wv-trail { fill: none; stroke-width: 3; stroke-linecap: round; }
.wv-num { font-size: 15px; }
.wv-ws { font-family: var(--rm-font, system-ui, sans-serif); font-weight: 700; font-size: 22px; fill: var(--rm-text-secondary, #BCCCDC); }
`
    const el = (doc, t, a, p) => { const e = doc.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e }
    const f1 = n => (+n).toFixed(1)

    // where each destination's name goes: in a pill beside its own square (Angelo, 8 November about 23:00, backlog 0c4 (5): "the
    // labels aren't all clearly visible, can these be brought closer to their icon?"). Outside the rim, away from the centre, with
    // the full name where the frame [lo, hi] (drawing units) leaves room; else outside with the short name; else (a phone, where
    // the hexagon takes nearly the frame's width) inside the rim, on the square's inner side, with the short name cut to fit
    // ("…"). Never in rows away from the square. font: the pill's text size in drawing units, so it shows at least 12 px whatever
    // the graph's size; sq: the squares' size; avoid: the graph's own furniture (live.js's logos and LIVE, its date line, the
    // layout switch) as boxes in drawing units; no pill is left on one, nor on another destination's square. short: the short
    // names ({ dest: name }), falling back to the names. clearLow: how much of the frame's right side the lower half's pills leave
    // free (the app's floating Ask Claude button stays in that column on a phone: dashboard@'s review, 7a0de06c). Returns { dest: { x, y, w, h, mode: 'beside' | 'inside', text } }.
    function pillsFor(P, names, font, lo = -Infinity, hi = Infinity, sq = SQ, avoid = [], short = {}, clearLow = 0) {
        const C = W().C, h = Math.round(font * 1.6), gap = Math.round(font * 0.5), out = new Map()
        const wOf = t => Math.round(t.length * font * 0.56 + font * 1.2), fit = (t, room) => {
            if (wOf(t) <= room) return t
            const n = Math.max(4, Math.floor((room - font * 1.2) / (font * 0.56)))
            return t.length <= n ? t : t.slice(0, n - 1).replace(/[\s.,:;-]+$/, '') + '…'
        }
        const sqBox = (p, pad = 2) => ({ x: p.x - sq / 2 - pad, y: p.y - sq / 2 - pad, w: sq + 2 * pad, h: sq + 2 * pad })
        for (const [d, p] of P) {
            const full = names[d], sh = short[d] || full, right = p.x > C, hi2 = p.y > C ? hi - clearLow : hi
            let b = null
            if (Math.abs(p.ny) > 0.8) { const t = fit(full, hi - lo), w = wOf(t); b = { x: Math.max(lo, Math.min(hi - w, p.x - w / 2)), y: p.ny < 0 ? p.y - sq / 2 - gap - h : p.y + sq / 2 + gap, w, h, mode: 'beside', text: t } }   // top and bottom edges
            else {
                const room = right ? hi2 - (p.x + sq / 2 + gap) : (p.x - sq / 2 - gap) - lo
                for (const t of [full, sh]) if (!b && wOf(t) <= room) { const w = wOf(t); b = { x: right ? p.x + sq / 2 + gap : p.x - sq / 2 - gap - w, y: p.y - h / 2, w, h, mode: 'beside', text: t } }
                if (!b) {   // inside the rim, on the square's inner side: as far as 40% of the drawing across, and never past the frame
                    const inner = Math.min(0.4 * W().S, right ? (p.x - sq / 2 - gap) - lo : hi2 - (p.x + sq / 2 + gap)), t = fit(sh, inner), w = wOf(t)
                    b = { x: right ? p.x - sq / 2 - gap - w : p.x + sq / 2 + gap, y: p.y - h / 2, w, h, mode: 'inside', text: t }
                }
            }
            out.set(d, b)
        }
        const all = [...out.entries()]
        const overlap = (a, o) => a.x < o.x + o.w && o.x < a.x + a.w && a.y < o.y + o.h && o.y < a.y + a.h
        // pills that overlap move apart vertically, away from each other
        for (let pass = 0; pass < 6; pass++) for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
            const a = all[i][1], b = all[j][1]
            if (overlap(a, b)) { const up = a.y + a.h / 2 < b.y + b.h / 2 ? a : b, down = up === a ? b : a, need = (up.y + up.h + 4 - down.y) / 2; up.y -= need; down.y += need }
        }
        // a pill on the furniture or on another destination's square steps off it vertically, the way away from its middle
        for (const [d, a] of all) {
            const block = avoid.concat([...P].filter(([e]) => e !== d).map(([, q]) => sqBox(q)))
            for (let k = 0, o; k < 4 && (o = block.find(x => overlap(a, x))); k++) a.y = a.y + a.h / 2 < o.y + o.h / 2 ? o.y - a.h - 4 : o.y + o.h + 4
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

    // attach(G, o): G is live.js's host.lvGraph; o.base is the app's folder (for the logos); o.A another level's rules (work.js's
    // variant(), Workstreams: a WS square shows its number); o.clock 'manual' for replay and the clip
    // (frames stepped by step(now)), else the drawing runs on G.win's frames. Returns { fly(list, now), counts(c), step(now), destroy }.
    function attach(G, o = {}) {
        const A = o.A || W(), win = G.win || root, doc = G.doc || root.document, svg = G.svg, wrap = svg.closest('.lv') || svg.parentNode
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
            else if (/^WS-\d+$/.test(d)) { const t = el(doc, 'text', { class: 'wv-ws', 'text-anchor': 'middle', y: 8 }, inner); t.textContent = d.slice(3) }   // a workstream: its number
            else el(doc, 'path', { class: 'wv-mark', 'data-mark': MARK[d] || 'doc', d: markPath(A, MARK[d] || 'doc'), transform: 'scale(1.5)' }, inner)
            const pill = el(doc, 'g', { class: 'wv-pill', 'data-dest': d }, squares)
            el(doc, 'title', {}, pill).textContent = A.DEST_NAMES[d]
            const pr = el(doc, 'rect', {}, pill), pt = el(doc, 'text', { 'text-anchor': 'middle' }, pill); pt.textContent = A.DEST_NAMES[d]
            const n = el(doc, 'g', { class: 'wv-n', transform: `translate(${SQ / 2 - 4} ${-SQ / 2 + 4})`, style: 'display:none' }, inner)
            el(doc, 'circle', { r: 13 }, n); const nt = el(doc, 'text', { y: 5, 'text-anchor': 'middle' }, n)
            sq.set(d, { p, g, inner, n, nt, pill, pr, pt, lit: 0 })
        }
        // the pills, laid out for the size the graph is shown at: text at least MIN_PX on screen, inside the frame (re-laid on resize)
        function layoutPills() {
            const r = svg.getBoundingClientRect(), fr = wrap.getBoundingClientRect(), k = r.width / A.S
            const font = k > 0 ? Math.max(FONT, MIN_PX / k) : FONT, size = k > 0 ? Math.max(SQ, 26 / k) : SQ
            const lo = k > 0 ? (fr.left - r.left) / k + 4 : -Infinity, hi = k > 0 ? (fr.right - r.left) / k - 4 : Infinity
            const box = e => { const b = e.getBoundingClientRect(); return { x: (b.left - r.left) / k - 6, y: (b.top - r.top) / k - 6, w: b.width / k + 12, h: b.height / k + 12 } }
            const avoid = k > 0 ? [...wrap.querySelectorAll('.lv-top, .lv-when, .lv-lay')].filter(e => e.getBoundingClientRect().width).map(box) : []
            const fab = doc.querySelector('.cc-askfab'), fb = fab && fab.getBoundingClientRect(), clearLow = k > 0 && fb && fb.width && fb.left < fr.right && fb.right > fr.left ? (fr.right - fb.left) / k + 4 : 0
            const L = pillsFor(P, A.DEST_NAMES, font, lo, hi, size, avoid, A.DEST_SHORT || {}, clearLow)
            for (const [d, s] of sq) {
                const b = L.get(d), p = s.p
                s.inner.setAttribute('transform', `scale(${(size / SQ).toFixed(3)})`)
                s.pill.setAttribute('transform', `translate(${f1(b.x)} ${f1(b.y)})`)
                for (const [k2, v] of Object.entries({ width: b.w, height: b.h, rx: b.h / 2 })) s.pr.setAttribute(k2, f1(v))
                s.pt.textContent = b.text; s.pill.dataset.mode = b.mode
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
                const g = el(doc, 'g', { class: 'wv-fly', 'data-icon': d.icon, 'data-dest': d.dest, style: 'color:' + stroke }, flights)   // its glow in the maker's colour
                el(doc, 'circle', { class: 'wv-bg', r: 17, stroke, 'stroke-width': 2.5 }, g)
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
                f.trail.setAttribute('stroke-opacity', f1(0.85 * Math.sin(Math.PI * u)))
            }
            for (const [, s] of sq) if (s.lit && s.lit <= now) { s.lit = 0; s.g.classList.remove('wv-lit') }
        }
        let raf = 0, alive = true
        let manual = o.clock === 'manual'
        const frame = ts => { raf = 0; if (!alive) return; step(ts); if (live.length || [...sq.values()].some(s => s.lit)) raf = win.requestAnimationFrame(frame) }
        const kick = () => { if (!manual && !raf && alive) raf = win.requestAnimationFrame(frame) }
        function destroy() { alive = false; if (RO) RO.disconnect(); if (raf) win.cancelAnimationFrame(raf); top.remove(); wrap.classList.remove('lv-workview'); live.length = 0 }
        // manual(on): the clip (clip-button.js) takes the frames over while it records, and gives them back after
        const setManual = on => { manual = !!on; if (manual && raf) { win.cancelAnimationFrame(raf); raf = 0 } else if (!manual && live.length) kick() }
        return { fly, counts, step, destroy, inAir: () => live.length, light, pills: () => laid, manual: setManual }
    }

    root.AngeloWorkDraw = { attach, pillsFor, LOGO, MARK, MARK_PATHS }
})(typeof self !== 'undefined' ? self : this)
