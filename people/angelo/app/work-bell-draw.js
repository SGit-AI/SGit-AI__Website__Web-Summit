// The map's deliveries as a dumbbell, its drawing (backlog 0c5; spec: people/angelo/proposals/live-map/dumbbell/spec-dumbbell.md,
// approved by Angelo on 9 November). dev.work@PrompTugal.angelo. Draws on live.js's graph through its hook (host.lvGraph): the
// graph moved, smaller, into a circle at the team's end; the ten destinations as icons with their 3 to 4 letter abbreviations on
// the bell at the other end (work-bell.js's places: the busiest in the middle, the quiet ones dimmed at the ends); one route per
// person and destination, in the person's colour, as wide as the last seven days; each new delivery flying along its route as
// its typed icon and lighting its destination when it lands. No counts, no list (Angelo, 17:25 and 17:35). The full name is each
// icon's title. A tap on a person shows their agents' own routes, the others dimmed; a tap on them again, anywhere off a
// person, or Escape, shows everyone again (the spec, question 2). Orientation is a setting (Automatic, top, below, left, right), kept in this browser. Same face as work-draw.js's
// attach() (fly, counts, step, destroy, inAir, manual), so work-live.js can use either; plus week(list, now) for the routes.
// Runs in the browser as window.AngeloWorkBellDraw; needs AngeloWork, AngeloWorkBell and AngeloWorkDraw (for the marks and logos).
(function (root) {
    'use strict'
    const NS = 'http://www.w3.org/2000/svg', OKEY = 'angelo.workbell.orient'
    const ICON = 72, ABBR_FONT = 26, MIN_PX = 12
    const CSS = `
.lv.lv-bellview .lv-hex { width: 100cqw; height: 100cqh; }
.lv.lv-bellview .lv-fill, .lv.lv-bellview .lv-rim { display: none; }
.lv.lv-bellview .lv-svg { overflow: visible; }
.wb-net { fill: var(--rm-surface, #0E2035); fill-opacity: .55; stroke: var(--rm-action, #1A8FB0); stroke-opacity: .7; stroke-width: 3; }
/* the routes extremely faint (Angelo, 10 November: "the lines that go to the deliverables are too bright, they should be extremely faint"); the flights along them stay bright */
.wb-route { fill: none; stroke-linecap: round; stroke-opacity: .1; mix-blend-mode: screen; transition: stroke-opacity .2s; }
.wb-route.wb-dim { stroke-opacity: .03; }
.wb-route.wb-agent { stroke-opacity: .3; stroke-dasharray: none; }
.lv.lv-bellview .tm-p { cursor: pointer; }
.lv.lv-bellview[data-focus] .tm-p:not(.wb-on) { opacity: .45; }
:root[data-theme="light"] .wb-route { mix-blend-mode: multiply; stroke-opacity: .14; }
.wb-ic rect { fill: var(--rm-surface, #0E2035); stroke: var(--rm-border, #294A64); stroke-width: 2.5; }
.wb-ic .wv-mark { fill: none; stroke: var(--rm-text, #F7FAFC); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.wb-ic .wv-ws { font-family: var(--rm-font, system-ui, sans-serif); font-weight: 700; font-size: 24px; fill: var(--rm-text, #F7FAFC); }
.wb-ic .wb-ab { font-family: var(--rm-font, system-ui, sans-serif); font-weight: 700; letter-spacing: .06em; fill: var(--rm-text-secondary, #BCCCDC); }
.wb-ic.wb-quiet { opacity: .38; }
.wb-ic.wv-lit rect { stroke: var(--rm-action, #4aa3ff); stroke-width: 5; }
.wb-ic.wv-lit { opacity: 1; }
/* the setting in the upper left: the lower edge holds the dial and its play buttons (dashboard@, 10 November) */
.wb-or { position: absolute; left: 8px; top: 8px; z-index: 3; font: 500 12px/1.2 var(--rm-font, system-ui, sans-serif); color: var(--rm-text-secondary, #9EB2C7); background: var(--rm-surface, #0E2035); border: 1px solid var(--rm-border, #294A64); border-radius: 6px; padding: 3px 4px; opacity: .55; }
.wb-or:hover, .wb-or:focus { opacity: 1; }
.wb .wv-fly circle.wv-bg { fill: var(--rm-bg, #07111F); }
.wb .wv-fly { filter: drop-shadow(0 0 6px currentColor); }
.wb .wv-fly path { fill: none; stroke-width: 2.8; stroke-linecap: round; stroke-linejoin: round; }
.wb .wv-num { font-family: var(--rm-font, system-ui, sans-serif); font-weight: 600; font-size: 15px; fill: var(--rm-text, #F7FAFC); }
.lv.lv-bellview .wv-note { bottom: 36px !important; }
`
    const el = (doc, t, a, p) => { const e = doc.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e }
    const f1 = n => (+n).toFixed(1)
    const pref = () => { try { return root.localStorage.getItem(OKEY) || 'auto' } catch { return 'auto' } }
    const setPref = v => { try { root.localStorage.setItem(OKEY, v) } catch { } }
    function resolve(win, node, c) { const m = String(c || '').match(/^var\((--[\w-]+)/); if (!m) return c; const v = win.getComputedStyle(node).getPropertyValue(m[1]).trim(); return v || c }
    function isLight(win, node) { const bg = (win.getComputedStyle(node).backgroundColor.match(/\d+(\.\d+)?/g) || [7, 17, 31]).slice(0, 3).map(Number); return (0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]) > 140 }

    // attach(G, o): G is live.js's host.lvGraph; o.A: the level's rules (work.js, or its variant() for Workstreams); o.base: the
    // app's folder (logos); o.orient: a fixed setting (else this browser's, else Automatic); o.clock 'manual': frames stepped by step(now); o.tap false: no taps on people (the host has its own)
    function attach(G, o = {}) {
        const A = o.A || root.AngeloWork, B = root.AngeloWorkBell, D = root.AngeloWorkDraw
        const win = G.win || root, doc = G.doc || root.document, svg = G.svg, wrap = svg.closest('.lv') || svg.parentNode, graph = G.layer.parentNode
        if (!doc.getElementById('wb-css')) { const s = doc.createElement('style'); s.id = 'wb-css'; s.textContent = CSS; doc.head.appendChild(s) }
        const light = o.light != null ? o.light : isLight(win, wrap)
        const vb0 = svg.getAttribute('viewBox'), tr0 = graph.getAttribute('transform') || '', par0 = svg.getAttribute('preserveAspectRatio')
        wrap.classList.add('lv-bellview')
        const under = el(doc, 'g', { class: 'wb wb-under' }); svg.insertBefore(under, graph)
        const over = el(doc, 'g', { class: 'wb wb-over' }, svg)
        const netC = el(doc, 'circle', { class: 'wb-net' }, under), routesG = el(doc, 'g', { class: 'wb-routes' }, under)
        const icons = el(doc, 'g', { class: 'wb-icons' }, over), flights = el(doc, 'g', { class: 'wv-flights' }, over)
        let PS = 1, focus = null, setting = o.orient || pref(), or = null, L = null, NM = null, weights = {}, R = { routes: [], weights: {}, max: 0 }, lastList = [], lastNow = 0
        const IC = new Map()
        // a graph node's place in the frame: live.js's own scale about the centre, then into the network's circle
        const placeOf = id => { const p = G.pos.get(id); if (!p || !NM) return null; return NM.map({ x: G.C + (p.x - G.C) * G.scale, y: G.C + (p.y - G.C) * G.scale }) }
        const colourOf = person => A.strokeFor(resolve(win, wrap, G.col && G.col.get(person)) || '#9EB2C7', light)
        let pad = 0
        const sizeK = () => { const r = svg.getBoundingClientRect(); return r.width > 0 && L ? Math.min(r.width / (L.w + 2 * pad), r.height / (L.h + 2 * pad)) : 0 }
        for (const d of A.DESTS) {
            const g = el(doc, 'g', { class: 'wb-ic wv-sq', 'data-dest': d }, icons)
            el(doc, 'title', {}, g).textContent = A.DEST_NAMES[d]
            const inner = el(doc, 'g', {}, g)
            el(doc, 'rect', { x: -ICON / 2, y: -ICON / 2, width: ICON, height: ICON, rx: 14 }, inner)
            const logo = D.LOGO[d]
            if (logo) el(doc, 'image', { href: (o.base || '') + 'work-logos/' + logo[light ? 'light' : 'dark'], x: -24, y: -24, width: 48, height: 48 }, inner)
            else if (/^WS-\d+$/.test(d)) { const t = el(doc, 'text', { class: 'wv-ws', 'text-anchor': 'middle', y: 8 }, inner); t.textContent = d.slice(3) }
            else { const k = D.MARK[d] || 'doc'; el(doc, 'path', { class: 'wv-mark', 'data-mark': k, d: D.MARK_PATHS[k] || A.ICON_PATHS[k] || A.ICON_PATHS.doc, transform: 'scale(1.9)' }, inner) }
            const ab = el(doc, 'text', { class: 'wb-ab' }, g); ab.textContent = B.ABBR[d] || B.abbrOf(d, A.DEST_NAMES[d])
            IC.set(d, { g, inner, ab, lit: 0 })
        }
        // the frame for the setting and the screen's shape; the icons in their places and the network moved into its circle
        function lay() {
            const r = wrap.getBoundingClientRect(), o2 = B.orient(setting, win.innerWidth || r.width, win.innerHeight || r.height)   // Automatic: by the screen's shape (the spec), not the box's; a pop-out is its own window
            const order = B.ordered(A.DESTS, weights).join()
            if (L && o2 === or && L.order === order) return
            or = o2; L = B.layout(or, A.DESTS, weights); L.order = order; NM = B.netMap(L, G.C, G.S)
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet'); wrap.dataset.bell = or
            graph.setAttribute('transform', `translate(${f1(NM.tx)} ${f1(NM.ty)}) scale(${NM.k.toFixed(4)}) ` + tr0)
            for (const a of ['cx', 'cy']) netC.setAttribute(a, f1(a === 'cx' ? L.net.x : L.net.y)); netC.setAttribute('r', f1(L.net.r))
            fit(); drawRoutes()
        }
        // the frame's margin: none, unless an icon or its abbreviation lies on live.js's furniture (its logos and LIVE, the date
        // line, the layout switch) or past the view's edge; then the drawing steps in, a little at a time, until nothing does
        const box = e => e.getBoundingClientRect(), hit = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom
        function fit() {
            const furn = [...wrap.querySelectorAll('.lv-top > *, .lv-when, .lv-lay > *')].map(box).filter(b => b.width > 0)
            for (pad = 0; ; pad += 50) {
                svg.setAttribute('viewBox', `${-pad} ${-pad} ${L.w + 2 * pad} ${L.h + 2 * pad}`); size()
                const fr = box(svg.closest('.lv') ? wrap : svg), out = b => b.width > 0 && (b.left < fr.left || b.right > fr.right || b.top < fr.top || b.bottom > fr.bottom)
                if (pad >= 400 || !(furn.some(f => [...IC.values()].some(x => hit(box(x.inner), f) || hit(box(x.ab), f))) || [...IC.values()].some(x => out(box(x.inner)) || out(box(x.ab))))) break
            }
        }
        // the icons' size and the abbreviations' text: at least 12 px on screen whatever the frame's size
        function size() {
            const k = sizeK(), font = k > 0 ? Math.max(ABBR_FONT, MIN_PX / k) : ABBR_FONT, s = k > 0 ? Math.max(1, 24 / k / ICON) : 1   // icons at least 24 px
            for (const [d, x] of IC) {
                const p = L.places.get(d)
                x.g.setAttribute('transform', `translate(${f1(p.x)} ${f1(p.y)})`); x.g.classList.toggle('wb-quiet', p.quiet)
                x.inner.setAttribute('transform', `scale(${s.toFixed(3)})`)
                const lb = B.label(p, ICON * s / 2, font, x.ab.textContent.length, font > ABBR_FONT * 1.2)   // straight out from the icon, away from the team; on a small screen every other one on the inner side, whichever end
                x.ab.setAttribute('x', f1(lb.x)); x.ab.setAttribute('y', f1(lb.y)); x.ab.setAttribute('text-anchor', lb.anchor); x.ab.style.fontSize = f1(font) + 'px'
            }
            // the people: the network is shrunk into its circle, so their nodes grow around their centres until their names are
            // 12 px on screen, at most twice their size (the map's own r, y and font put back on destroy)
            const q = k * NM.k * G.scale
            PS = q > 0 ? Math.min(2, Math.max(1, MIN_PX / (15 * q))) : 1
            for (const n of graph.querySelectorAll('.tm-p')) {
                const c = n.querySelector('circle'), t = n.querySelector('text'); if (!c || !t) continue
                if (!n.dataset.wbR) { n.dataset.wbR = c.getAttribute('r'); n.dataset.wbY = t.getAttribute('y'); n.dataset.wbF = parseFloat(win.getComputedStyle(t).fontSize) || 15 }
                const cy = +c.getAttribute('cy'), y0 = +n.dataset.wbY
                c.setAttribute('r', f1(+n.dataset.wbR * PS)); t.setAttribute('y', f1(cy + (y0 - cy) * PS)); t.style.fontSize = PS > 1 ? f1(+n.dataset.wbF * PS) + 'px' : ''
            }
        }
        function unsizePeople() {
            for (const n of graph.querySelectorAll('.tm-p')) {
                if (!n.dataset.wbR) continue
                const c = n.querySelector('circle'), t = n.querySelector('text'); if (c) c.setAttribute('r', n.dataset.wbR); if (t) { t.setAttribute('y', n.dataset.wbY); t.style.fontSize = '' }
                delete n.dataset.wbR; delete n.dataset.wbY; delete n.dataset.wbF
            }
        }
        // the routes by person; with a person tapped, that person's by agent (from each agent the graph draws, the rest from the
        // person) and everyone else's dimmed. Widths on the same scale either way.
        function drawRoutes() {
            while (routesG.firstChild) routesG.firstChild.remove()
            const path = (a, b, cls, at) => el(doc, 'path', { class: cls, ...at, d: B.svgPath(B.route(or, a, b)) }, routesG)
            for (const rt of R.routes) {
                if (rt.person === focus) continue
                const a = placeOf(rt.person), b = L.places.get(rt.dest); if (!a || !b) continue
                path(a, b, 'wb-route' + (focus ? ' wb-dim' : ''), { 'data-person': rt.person, 'data-dest': rt.dest, stroke: colourOf(rt.person), 'stroke-width': f1(B.width(rt.n, R.max)) })
            }
            if (focus) for (const rt of B.agentRoutes(lastList, lastNow, focus, id => G.pos.has(id))) {
                const a = placeOf(rt.from), b = L.places.get(rt.dest); if (!a || !b) continue
                path(a, b, 'wb-route wb-agent', { 'data-person': rt.person, 'data-from': rt.from, 'data-dest': rt.dest, stroke: colourOf(rt.person), 'stroke-width': f1(B.width(rt.n, R.max)) })
            }
        }
        // a tap: the person under it (their node, or near enough to hit on a phone: 22 px), else nobody
        function personAt(cx, cy) {
            const m = svg.getScreenCTM(); if (!m || !NM) return null
            const pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy; const q = pt.matrixTransform(m.inverse()), k = sizeK()
            const reach = Math.max(26 * PS * G.scale * NM.k * 1.3, k > 0 ? 22 / k : 0)
            let best = null, bd = Infinity
            for (const [id, n] of G.pos) { if (n.kind !== 'p') continue; const p = placeOf(id), d = p ? Math.hypot(p.x - q.x, p.y - q.y) : Infinity; if (d < bd) { bd = d; best = id } }
            return bd <= reach ? best : null
        }
        function setFocus(id) {
            focus = id && G.pos.has(id) && G.pos.get(id).kind === 'p' ? id : null
            if (focus) wrap.dataset.focus = focus; else delete wrap.dataset.focus
            for (const n of graph.querySelectorAll('.tm-p')) n.classList.remove('wb-on')
            if (focus) { const p = G.pos.get(focus); for (const n of graph.querySelectorAll('.tm-p')) { const c = n.querySelector('circle'); if (c && Math.abs(+c.getAttribute('cx') - p.x) < 0.2 && Math.abs(+c.getAttribute('cy') - p.y) < 0.2) n.classList.add('wb-on') } }
            if (L) drawRoutes()
        }
        const onTap = e => { if (e.button) return; const id = personAt(e.clientX, e.clientY); if (id || focus) setFocus(id === focus ? null : id) }
        const onKey = e => { if (e.key === 'Escape' && focus) setFocus(null) }
        const tap = o.tap !== false   // o.tap false: the host has its own taps on people (the map's focus, in replay)
        if (tap) { svg.addEventListener('click', onTap); doc.addEventListener('keydown', onKey) }
        // week(list, now): the last seven days' deliveries ({ at, maker, dest }) as routes; the bell re-ordered if the busiest changed
        function week(list, now) {
            lastList = list; lastNow = now
            const people = [...G.pos].filter(([, n]) => n.kind === 'p').map(([id]) => id)
            R = B.routes(list, now, people); weights = R.weights
            const before = L && L.order; lay(); if (L.order === before) drawRoutes()
        }
        lay()
        const RO = win.ResizeObserver ? new win.ResizeObserver(() => { const was = or; lay(); if (or === was) fit() }) : null
        if (RO) RO.observe(wrap)
        // the setting, in the view's lower left corner
        const sel = doc.createElement('select'); sel.className = 'wb-or'; sel.setAttribute('aria-label', 'Where the team sits')
        for (const v of B.ORIENTS) { const op = doc.createElement('option'); op.value = v; op.textContent = B.ORIENT_NAMES[v]; sel.appendChild(op) }
        sel.value = B.ORIENTS.includes(setting) ? setting : 'auto'
        sel.addEventListener('change', () => { setting = sel.value; setPref(setting); lay() })
        if (!o.orient) wrap.appendChild(sel)

        const live = []
        function fly(list, now) {
            for (const d of list) {
                const person = B.personOf(d.maker), from = G.pos.has(d.maker) ? d.maker : person, a = from && placeOf(from), b = L.places.get(d.dest); if (!a || !b) continue
                const stroke = colourOf(person || (G.pos.get(d.maker) || {}).person)
                const g = el(doc, 'g', { class: 'wv-fly', 'data-icon': d.icon, 'data-dest': d.dest, style: 'color:' + stroke }, flights)
                el(doc, 'circle', { class: 'wv-bg', r: 19, stroke, 'stroke-width': 2.5 }, g)
                el(doc, 'path', { d: A.ICON_PATHS[d.icon], stroke }, g)
                if (d.n > 1) { const t = el(doc, 'text', { class: 'wv-num', x: 22, y: -13 }, g); t.textContent = String(d.n) }
                live.push({ d, t0: now, c: B.route(or, a, b), g })
            }
            if (live.length) kick()
        }
        function step(now) {
            for (let i = live.length - 1; i >= 0; i--) {
                const f = live[i], u = (now - f.t0) / A.FLIGHT_MS
                if (u >= 1) { f.g.remove(); live.splice(i, 1); const s = IC.get(f.d.dest); if (s) { s.lit = now + 900; s.g.classList.add('wv-lit') } continue }
                if (u < 0) { f.g.style.display = 'none'; continue }
                f.g.style.display = ''
                const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2, p = B.at(f.c, e)
                f.g.setAttribute('transform', `translate(${f1(p.x)} ${f1(p.y)})`)
            }
            for (const [, s] of IC) if (s.lit && s.lit <= now) { s.lit = 0; s.g.classList.remove('wv-lit') }
        }
        let raf = 0, alive = true, manual = o.clock === 'manual'
        const frame = ts => { raf = 0; if (!alive) return; step(ts); if (live.length || [...IC.values()].some(s => s.lit)) raf = win.requestAnimationFrame(frame) }
        const kick = () => { if (!manual && !raf && alive) raf = win.requestAnimationFrame(frame) }
        function destroy() {
            alive = false; if (RO) RO.disconnect(); svg.removeEventListener('click', onTap); doc.removeEventListener('keydown', onKey); setFocus(null); if (raf) win.cancelAnimationFrame(raf)
            under.remove(); over.remove(); sel.remove(); live.length = 0
            if (vb0) svg.setAttribute('viewBox', vb0); if (par0) svg.setAttribute('preserveAspectRatio', par0); else svg.removeAttribute('preserveAspectRatio')
            if (tr0) graph.setAttribute('transform', tr0); else graph.removeAttribute('transform')
            unsizePeople(); wrap.classList.remove('lv-bellview'); delete wrap.dataset.bell
        }
        const setManual = on => { manual = !!on; if (manual && raf) { win.cancelAnimationFrame(raf); raf = 0 } else if (!manual && live.length) kick() }
        return { fly, counts() { }, step, destroy, week, inAir: () => live.length, light, manual: setManual, focus: id => { if (id !== undefined) setFocus(id); return focus }, orient: () => or, layout: () => L, routes: () => R, bell: true }
    }
    root.AngeloWorkBellDraw = { attach, OKEY }
})(typeof self !== 'undefined' ? self : this)
