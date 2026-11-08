// The live map: Team and the machine's graph as a small always-on view, lines and dots only, in a hexagon
// (dev.map@PrompTugal.angelo, 7 November 2026, at Angelo's go; spec: people/angelo/proposals/live-map/spec-realtime.md).
// It draws the same graph as the command centre's map (the people ring: same layout, same colours, same classes), reads
// live.json (the last 48 hours of exchanges: who, to whom, when, never a word of text) again about every minute, and
// shows each exchange at its real moment, a few minutes behind (never accelerated, no replay), and under them a constant faint
// flow along every line, as dense as that pair has been in recent hours: it never stops, and nothing in it is invented.
// "Pop out" puts it in an always-on-top window (Document Picture-in-Picture: Chrome and Edge on a desktop); where that is
// missing (Safari on a Mac or iPad), in a floating video: the graph drawn into a canvas, the canvas's stream played in picture-in-picture.
// Inside the hexagon (backlog 0d): RiskMandate's and PrompTugal.news's logos (their sites' own files), a pulsing LIVE label, and the
// date and time of the moment on screen, in the viewer's time zone.
// 3D (d3=1, backlog 0c): the same engine, drawn by live3d.js in WebGL: the same flow, pulses, lit lines and breathing, turned by hand.
// Layouts (backlog 0e): the map's three (people ring, agents ring, agents and their work), switched by a quiet control in the hexagon's
// corner, in the page and in the pop-out alike, remembered on this device (lv=<layout> in the address wins).
(function (root) {
    'use strict'
    const NS = 'http://www.w3.org/2000/svg'
    // the same colours as the map in the command centre (app.js's TM_COL)
    const COL = ['var(--rm-role-conductor)', 'var(--rm-role-dev)', 'var(--rm-gold)', 'var(--rm-role-video)', 'var(--rm-green)', 'var(--rm-role-outreach)', 'var(--rm-orange)', 'var(--rm-blue)', 'var(--rm-red)']
    const S = 1000, C = S / 2
    // the map's three layouts (app.js's TM_LAYOUTS and placeFor, the same numbers): where the people sit, how far lines bend inward
    const LAYOUTS = [['ring', 'People ring'], ['agents', 'Agents ring'], ['work', 'Agents and their work']]
    // scale: the wide layouts (people at 445) a little smaller in the hexagon, so the top person clears the logos and LIVE
    const GEO = { ring: { rp: 300, pull: 0.55, scale: 0.84 }, agents: { rp: 445, pull: 0.25, scale: 0.74 }, work: { rp: 445, pull: 0.1, scale: 0.74 } }
    const LKEY = 'ak.lvLayout'
    const layoutPref = () => { try { const m = String(root.location.hash).match(/[?&]lv=(\w+)/) || String(root.location.search).match(/[?&]lv=(\w+)/); if (m && GEO[m[1]]) return m[1] } catch { } try { const v = root.localStorage.getItem(LKEY); if (GEO[v]) return v } catch { } return 'ring' }
    const KIND = { build: ['var(--rm-role-dev)', 6, 0], content: ['var(--rm-role-video)', 3, 0], outreach: ['var(--rm-role-outreach)', 5, 0.45], setup: ['var(--rm-green)', 4, 0], running: ['var(--rm-role-conductor)', 5, 0], riskmandate: ['var(--rm-gold)', 0, 0], merch: ['var(--rm-orange)', 8, 0] }
    const shapePts = (k, x, y, r) => { const [, n, inner] = KIND[k] || ['', 0, 0]; if (!n) return null; const pts = [], m = inner ? n * 2 : n; for (let q = 0; q < m; q++) { const a = -Math.PI / 2 + q * 2 * Math.PI / m, rr = inner && q % 2 ? r * inner : r; pts.push(`${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)}`) } return pts.join(' ') }
    const POLL = (() => { try { return +new URLSearchParams(root.location.search).get('livepoll') || 0 } catch { return 0 } })()   // seconds; only for the tests
    const POLL_MS = POLL ? POLL * 1000 : 60000, SPREAD_MS = POLL ? 0 : 10000, TRAVEL_MS = 1600, FADE_MS = 3200, STALE_MIN = 30
    const DELAY_MS = (+new URLSearchParams(root.location.search || '').get('livedelay') || 4) * 6e4   // a fixed few minutes behind
    const FLOW_BASE = 3.5, FLOW_MAX = 70, FLOW_TRAVEL_MS = 3000, HALF_LIFE_H = 3   // ambient dots a second, at most on screen, their travel, how fast the past fades
    const HEX = 'M250 67 L750 67 L1000 500 L750 933 L250 933 L0 500 Z'
    // the two logos, unchanged copies of what their own sites publish, served from this site; the newsroom's stamp in the page's tone
    const LOGO_RM = () => new URL('brand/riskmandate-mark.svg', HERE).href, LOGO_PT = tone => new URL(`brand/pt-news-stamp-${tone}.svg`, HERE).href   // local copies (brand/README.md): no call to another site
    const HERE = document.currentScript ? document.currentScript.src : root.location.href
    const CSS = `
.lv { container-type: size; position: relative; width: 100%; height: 100%; display: grid; place-items: center; background: var(--rm-bg, #07111F); }
/* no overflow: hidden here (backlog 0e): with it, Chromium hit-tested the layout switch in the corners as outside; the frame clips */
.lv-hex { width: min(100cqw, 100cqh); height: min(100cqw, 100cqh); position: relative; }
.lv-svg { width: 100%; height: 100%; display: block; }
.lv-rim { fill: none; stroke: var(--rm-action, #4aa3ff); stroke-width: 3; stroke-linejoin: round; filter: drop-shadow(0 0 7px var(--rm-action, #4aa3ff)); opacity: .8; }
.lv-fill { fill: var(--rm-surface, #0E2035); opacity: .55; }
.lv-links path { fill: none; stroke-linecap: round; }
.lv-links path.base { opacity: .1; }
.lv-pulses circle { stroke: var(--rm-surface, #0E2035); stroke-width: 1.5; pointer-events: none; }
.lv-pulses circle.flow { stroke: none; opacity: .8; }
/* brighter (Angelo, 7 November: "make them brighter, more evident"): a soft glow on every moving dot and on the lit lines */
.lv-pulses circle { filter: drop-shadow(0 0 3px rgba(255,255,255,.55)); }
.lv-links path:not(.base) { filter: drop-shadow(0 0 2px rgba(255,255,255,.35)); }
.lv-pulses circle.halo { stroke: none; opacity: .4; }
.lv .tm-p, .lv .tm-a { cursor: default; }
.lv .tm-a .lv-kr { fill: none; stroke: var(--rm-text, #fff); stroke-width: 2; stroke-dasharray: 3 3; opacity: .45; animation: lv-turn 6s linear infinite; }
.lv .tm-a.lv-ran .lv-kr { opacity: .95; stroke-width: 2.5; }
@keyframes lv-turn { to { stroke-dashoffset: -24; } }
@media (prefers-reduced-motion: reduce) { .lv .tm-a .lv-kr { animation: none; } }
.lv .tm-a.lv-hot > circle:not(.lv-kr), .lv .tm-a.lv-hot > rect { stroke: var(--rm-text, #fff); stroke-width: 3; }
/* inside the hexagon, small and quiet (backlog 0d): the logos and LIVE at the top, the moment shown at the bottom */
.lv-top { position: absolute; left: 50%; top: 8.4%; transform: translateX(-50%); display: flex; align-items: center; gap: max(5px, 1.5cqmin); pointer-events: none; z-index: 2; }
.lv-logo { width: clamp(14px, 4.6cqmin, 40px); height: clamp(14px, 4.6cqmin, 40px); border-radius: 22%; opacity: .92; display: block; }
.lv-logo.gone { display: none; }
.lv-live { display: inline-flex; align-items: center; gap: .45em; font: 700 clamp(8px, 2.2cqmin, 18px)/1 var(--rm-font, system-ui, sans-serif); letter-spacing: .14em; white-space: nowrap; color: var(--rm-red, #ff4d5e); padding: .32em .55em .32em .5em; border: 1px solid currentColor; border-radius: 999px; background: color-mix(in srgb, var(--rm-bg, #07111F) 75%, transparent); }
.lv-live i { width: .62em; height: .62em; border-radius: 50%; background: currentColor; box-shadow: 0 0 .7em currentColor; animation: lv-pulse 1.6s ease-in-out infinite; }
.lv-live.on { animation: lv-breathe 1.6s ease-in-out infinite; }
@keyframes lv-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .3; transform: scale(.65); } }
@keyframes lv-breathe { 0%, 100% { box-shadow: 0 0 0 0 transparent; } 50% { box-shadow: 0 0 .9em -.1em currentColor; } }
/* over 30 minutes old: amber and still; reads failing: grey and still */
.lv-live.old { color: var(--rm-orange, #f5a524); }
.lv-live.off { color: var(--rm-text-muted, #9EB2C7); }
.lv-live.old i, .lv-live.off i { animation: none; }
.lv-live.off i { box-shadow: none; }
@media (prefers-reduced-motion: reduce) { .lv-live i, .lv-live.on { animation: none; } }
.lv-when { position: absolute; left: 50%; bottom: 8.6%; transform: translateX(-50%); font: 500 clamp(8px, 2cqmin, 16px)/1 var(--rm-font, system-ui, sans-serif); color: var(--rm-text-secondary, #9EB2C7); white-space: nowrap; font-variant-numeric: tabular-nums; pointer-events: none; text-shadow: 0 0 4px var(--rm-bg, #07111F); z-index: 2; }
.lv-bar { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin: 0 0 10px; }
.lv-page { display: grid; gap: 10px; }
.lv-frame:fullscreen, .lv-frame:-webkit-full-screen { width: 100vw; height: 100vh; border: 0; border-radius: 0; }
/* display mode (?display=1): the graph alone, filling the screen, for a screen left on for days (spec-realtime.md) */
.lv-display { position: fixed; inset: 0; z-index: 300; background: var(--rm-bg, #07111F); }
.lv-display .lv { cursor: none; }
/* 3D (d3=1): the WebGL view inside the same hexagon; the SVG keeps the rim and the floor */
.lv-3d { position: absolute; inset: 0; clip-path: polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0 50%); touch-action: none; cursor: grab; }
.lv-3d:active { cursor: grabbing; }
.lv-3d canvas { display: block; }
.lv-3d .note { position: absolute; inset: 40% 15% auto; text-align: center; }
.lv-3d-on .lv-svg > g { visibility: hidden; }
.lv-3dl { position: absolute; left: 0; top: 0; pointer-events: none; font: 600 clamp(9px, 2.2cqmin, 14px)/1 var(--rm-font, system-ui, sans-serif); color: var(--rm-text, #fff); text-shadow: 0 0 4px var(--rm-bg, #07111F), 0 0 2px var(--rm-bg, #07111F); white-space: nowrap; }
.lv-frame { height: min(78vh, 760px); min-height: 320px; border-radius: var(--rm-radius-card, 12px); overflow: hidden; border: 1px solid var(--rm-border, #294A64); }
/* the layout switch (backlog 0e): in the empty upper right corner outside the hexagon, quiet until hovered or focused */
.lv-lay { position: absolute; right: 0; top: 1%; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; z-index: 3; opacity: .4; transition: opacity .2s; }
.lv-lay:hover, .lv-lay:focus-within { opacity: 1; }
.lv-lay button { font: 600 clamp(9px, 1.9cqmin, 13px)/1 var(--rm-font, system-ui, sans-serif); color: var(--rm-text-secondary, #9EB2C7); background: var(--rm-surface, #0E2035); border: 1px solid var(--rm-border, #294A64); border-radius: 999px; padding: .35em .6em; cursor: pointer; white-space: nowrap; }
.lv-lay button[aria-pressed="true"] { color: var(--rm-text, #fff); border-color: var(--rm-action, #4aa3ff); }
@container (max-width: 420px) { .lv-lay button { width: 1.6em; height: 1.6em; padding: 0; overflow: hidden; text-indent: 3em; position: relative; } .lv-lay button::after { content: attr(data-s); position: absolute; inset: 0; display: grid; place-items: center; text-indent: 0; } }
.lv-spokes line { stroke-width: 1.2; opacity: .18; }
.lv-k { opacity: .55; }
.lv-k polygon, .lv-k circle { fill: none; stroke: var(--kc); stroke-width: 3; }
.lv-k text { fill: var(--rm-text-secondary, #9EB2C7); font: 600 18px var(--rm-font, system-ui, sans-serif); text-anchor: middle; }
.lv-links path.wflow { opacity: .12; }
`
    const f1 = n => n.toFixed(1), SEEN = new Set()   // what has been shown, kept when the page redraws
    const personOf = n => { const m = String(n).match(/@(?:web-summit|promptugal)\.([a-z0-9-]+)$/i) || String(n).match(/^pt:([a-z0-9-]+):/); return m ? m[1].toLowerCase() : n }

    // the map's layouts, as app.js's teamMap draws them: "ring", people on a circle, each person's agents in two or three arcs
    // beside them; "agents" and "work", people outside and each person's agents in their own sector of one ring inside them,
    // "work" adding the kinds of work at the centre (from data.json's map.work), a faint flow from each agent to each kind
    function layout(M, L) {
        const G = GEO[L] || GEO.ring, NP = M.people.length, pos = new Map(), col = new Map(M.people.map((p, i) => [p.id, COL[i % COL.length]]))
        M.people.forEach((p, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / NP; pos.set(p.id, { x: C + G.rp * Math.cos(a), y: C + G.rp * Math.sin(a), a, kind: 'p', label: p.name.split(' ')[0], person: p.id }) })
        const all = M.agents.concat(M.sessionless || [])   // the sessionless agents not yet on the map stand beside their person too (00c)
        for (const p of M.people) {
            const mine = all.filter(a => a.person === p.id).sort((x, y) => (y.commits || 0) - (x.commits || 0)), N = mine.length, P = pos.get(p.id), at = []
            if (L === 'agents' || L === 'work') {
                const r0 = 290, r1 = 370, width = 2 * Math.PI / NP * 0.86, rows = Math.max(1, Math.ceil(N / 12)), perRow = Math.ceil(N / rows)
                for (let k = 0; k < N; k++) { const row = Math.floor(k / perRow), c2 = k % perRow, n = Math.min(perRow, N - row * perRow), t = P.a + (n > 1 ? -width / 2 + c2 * width / (n - 1) : 0), rr = rows > 1 ? r0 + (r1 - r0) * row / (rows - 1) : (r0 + r1) / 2; at.push({ x: C + rr * Math.cos(t), y: C + rr * Math.sin(t) }) }
            } else {
                const rows = N > 16 ? 3 : 2, spread = Math.min(Math.PI * (rows === 3 ? 1.3 : 0.95), (0.16 * N + 0.3) / (rows - 1))
                for (let k = 0; k < N; k++) { const t = P.a + (N > 1 ? -spread / 2 + k * spread / (N - 1) : 0), rr = 100 + (k % rows) * 32; at.push({ x: P.x + rr * Math.cos(t), y: P.y + rr * Math.sin(t) }) }
            }
            mine.forEach((a, k) => pos.set(a.id, { x: at[k].x, y: at[k].y, kind: 'a', person: a.person, family: a.family, commits: a.commits, label: a.short, fresh: a.kind === 'fresh' }))
        }
        // the kinds of work at the centre (work layout only), sized by their commits, as the map places them
        const W = L === 'work' && M.work ? M.work : null, wl = W ? W.links.filter(l => pos.has(l.agent)) : [], ktot = {}
        for (const l of wl) ktot[l.kind] = (ktot[l.kind] || 0) + l.n
        const kinds = W ? W.kinds.filter(k => ktot[k.id]) : [], kmax = Math.max(1, ...Object.values(ktot))
        kinds.forEach((k, q) => { const a = -Math.PI / 2 + q * 2 * Math.PI / kinds.length, r = kinds.length > 1 ? 170 : 0; pos.set('k:' + k.id, { x: C + r * Math.cos(a), y: C + r * Math.sin(a), kind: 'k', label: k.label, id: k.id, size: 16 + 22 * Math.sqrt(ktot[k.id] / kmax) }) })
        return { pos, col, pull: G.pull, wl }
    }
    const nodeOfIn = pos => n => { const x = pos.get(n); if (x && x.kind !== 'k') return n; const pid = personOf(n); return pos.has(pid) && pos.get(pid).kind === 'p' ? pid : null }

    // mount(host, { D, liveUrl, win }): draws the graph into host (an element, maybe in another window) and keeps it live.
    // Returns { destroy }. win is the window whose clock and frames drive it (the pop-out's own, so it runs when the page is hidden).
    // The layout switch redraws in place: the instance is replaced, the caller's handle stays the same.
    function mount(host, o) {
        let inst = null
        const relayout = L => { try { root.localStorage.setItem(LKEY, L) } catch { } if (inst) inst.destroy(); inst = mountOne(host, o, L, relayout) }
        inst = mountOne(host, o, o.layout || layoutPref(), relayout)
        return { destroy() { if (inst) inst.destroy() }, get layout() { return inst && inst.layout } }
    }
    function mountOne(host, o, L, relayout) {
        const win = o.win || root, doc = host.ownerDocument, M = o.D && o.D.collab && o.D.collab.map
        if (!M || M.error || !M.people) { host.innerHTML = '<p class="note">The map\'s data is missing from this build.</p>'; return { destroy() { } } }
        if (!GEO[L]) L = 'ring'
        const SCALE = GEO[L].scale            // the graph sits inside the hexagon: its corners are 7% in from the square's
        const { pos, col, pull: PULL, wl } = layout(M, L), nodeOf = nodeOfIn(pos), el = (t, a, p) => { const e = doc.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e }
        host.innerHTML = ''
        const wrap = doc.createElement('div'); wrap.className = 'lv'; wrap.setAttribute('role', 'img'); wrap.setAttribute('aria-label', 'The team as one live graph: lines and dots, new exchanges travel along their lines')
        const hex = doc.createElement('div'); hex.className = 'lv-hex'; wrap.appendChild(hex)
        const svg = el('svg', { class: 'lv-svg tm-svg', viewBox: `0 0 ${S} ${S}` }, hex)
        // the hexagon: a thin glowing rim and a slightly lighter floor; everything outside it is the page's own dark
        el('path', { class: 'lv-fill', d: HEX }, svg); el('path', { class: 'lv-rim', d: HEX }, svg)
        const g = el('g', { transform: `translate(${C} ${C}) scale(${SCALE}) translate(${-C} ${-C})` }, svg)
        const bend = (a, b) => { const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2; return { x: mx + (C - mx) * PULL, y: my + (C - my) * PULL } }
        const curve = (a, b) => { const q = bend(a, b); return `M${f1(a.x)} ${f1(a.y)}Q${f1(q.x)} ${f1(q.y)} ${f1(b.x)} ${f1(b.y)}` }
        // the rings' thin spokes (an agent to its person) and, for work, the faint flows to the kinds, under everything
        if (L !== 'ring') { const sp = el('g', { class: 'lv-spokes' }, g); for (const [id, n] of pos) if (n.kind === 'a' && pos.get(n.person)) { const P = pos.get(n.person); el('line', { x1: f1(P.x), y1: f1(P.y), x2: f1(n.x), y2: f1(n.y), stroke: col.get(n.person) }, sp) } }
        const links = el('g', { class: 'lv-links' }, g), nodes = el('g', { class: 'tm-nodes' }, g), pulses = el('g', { class: 'lv-pulses' }, g)
        // the graph as it is today: the static links faint under everything, then the people and their agents
        for (const l of M.links || []) { const a = pos.get(l.from), b = pos.get(l.to); if (a && b) el('path', { class: 'base', d: curve(a, b), stroke: col.get((a || {}).person) || 'var(--rm-text-muted)', 'stroke-width': f1(0.6 + 3.4 * Math.sqrt(l.n / Math.max(1, ...M.links.map(x => x.n)))) }, links) }
        if (wl.length) { const wmax = Math.max(1, ...wl.map(l => l.n)); for (const l of wl) { const a = pos.get(l.agent), b = pos.get('k:' + l.kind); if (a && b) el('path', { class: 'wflow', d: `M${f1(a.x)} ${f1(a.y)}Q${f1((a.x + b.x) / 2 - ((a.x + b.x) / 2 - C) * 0.15)} ${f1((a.y + b.y) / 2 - ((a.y + b.y) / 2 - C) * 0.15)} ${f1(b.x)} ${f1(b.y)}`, stroke: (KIND[l.kind] || ['var(--rm-text-muted)'])[0], 'stroke-width': f1(0.8 + 5 * Math.sqrt(l.n / wmax)) }, links) } }
        const N = new Map()
        for (const [id, n] of pos) {
            if (n.kind === 'k') { const gk = el('g', { class: 'lv-k', style: `--kc:${(KIND[n.id] || ['var(--rm-text-muted)'])[0]}` }, nodes), pts = shapePts(n.id, n.x, n.y, n.size); if (pts) el('polygon', { points: pts }, gk); else el('circle', { cx: f1(n.x), cy: f1(n.y), r: f1(n.size) }, gk); const t = el('text', { x: f1(n.x), y: f1(n.y + n.size + 18) }, gk); t.textContent = n.label; continue }
            if (n.kind === 'p') { const gp = el('g', { class: 'tm-p' }, nodes); el('circle', { cx: f1(n.x), cy: f1(n.y), r: 26, fill: col.get(id) }, gp); const t = el('text', { x: f1(n.x), y: f1(n.y + 5) }, gp); t.textContent = n.label; N.set(id, gp) }
            else { const ga = el('g', { class: 'tm-a' }, nodes), r = 4 + Math.min(8, Math.sqrt(n.commits || 0)); if (n.family !== 'web-summit') el('rect', { x: f1(n.x - 7), y: f1(n.y - 7), width: 14, height: 14, transform: `rotate(45 ${f1(n.x)} ${f1(n.y)})`, fill: col.get(n.person) }, ga); else el('circle', { cx: f1(n.x), cy: f1(n.y), r: f1(r), fill: col.get(n.person) }, ga)
                // a sessionless agent (a fresh session each run): the command centre's dashed ring, turning slowly between its runs
                // so it is seen while it sleeps, and lit for two hours after it last sent something (00c)
                if (n.fresh) { ga.classList.add('lv-fresh'); ga.setAttribute('data-lv-id', id); el('circle', { class: 'lv-kr', cx: f1(n.x), cy: f1(n.y), r: f1(n.family !== 'web-summit' ? 13 : 9 + Math.min(8, Math.sqrt(n.commits || 0))) }, ga) }
                N.set(id, ga) }
        }
        host.appendChild(wrap)
        const bg = (win.getComputedStyle(wrap).backgroundColor.match(/\d+(\.\d+)?/g) || [7, 17, 31]).slice(0, 3).map(Number), light = (0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]) > 140
        // the logos and LIVE at the top of the hexagon (LIVE replaces the old freshness light), the moment shown at its foot
        const top = doc.createElement('div'); top.className = 'lv-top'
        top.innerHTML = `<img class="lv-logo" data-lv-logo="riskmandate" alt="RiskMandate" title="RiskMandate" crossorigin="anonymous" referrerpolicy="no-referrer" src="${LOGO_RM()}"><span class="lv-live off" data-lv-live title="Reading the latest exchanges…"><i></i>LIVE</span><img class="lv-logo" data-lv-logo="promptugal" alt="PrompTugal.news" title="PrompTugal.news" crossorigin="anonymous" referrerpolicy="no-referrer" src="${LOGO_PT(light ? 'light' : 'dark')}">`
        for (const im of top.querySelectorAll('img')) im.onerror = () => im.classList.add('gone')   // offline: the label stays, the logo steps aside
        const dot = top.querySelector('[data-lv-live]'), when = doc.createElement('div'); when.className = 'lv-when'; when.setAttribute('data-lv-when', '')
        hex.appendChild(top); hex.appendChild(when)
        // the layout switch: quiet, in the hexagon box's upper right corner, the same in the pop-out
        const lay = doc.createElement('div'); lay.className = 'lv-lay'; lay.setAttribute('role', 'group'); lay.setAttribute('aria-label', 'Layout')
        lay.innerHTML = LAYOUTS.map(([k, t]) => `<button type="button" data-lv-l="${k}" data-s="${({ ring: 'P', agents: 'A', work: 'W' })[k]}" aria-pressed="${k === L}" title="${t}">${t}</button>`).join('')
        for (const b of lay.querySelectorAll('button')) b.onclick = () => { if (b.dataset.lvL !== L) relayout(b.dataset.lvL) }
        if (!o.bare) hex.appendChild(lay)   // display mode has no controls: its layout comes from the address or the device
        // the moment on screen: now, less the fixed delay, in the viewer's own time zone
        // a small pop-out (the hexagon under 300 px) gets the short form: the day and the time, without the weekday and the zone
        const F = o => { try { return new Intl.DateTimeFormat(undefined, o) } catch { return { format: d => d.toString().slice(0, 21) } } }
        const fmtL = F({ weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }), fmtS = F({ day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
        let whenAt = '', narrow = false, wAt = -1e9
        const paintWhen = () => { const t = Date.now() - DELAY_MS, d = new Date(t), m = Math.floor(t / 6e4)
            if (t - wAt > 1000) { wAt = t; const w = hex.clientWidth; if (w) narrow = w < 300 }
            const key = m + (narrow ? 'n' : 'w'); if (key === whenAt) return; whenAt = key; when.textContent = (narrow ? fmtS : fmtL).format(d); when.setAttribute('data-lv-shown', String(m * 6e4)); when.title = `What you see happened at this moment, ${Math.round(DELAY_MS / 6e4)} minutes behind now` }
        paintWhen()

        // 3D: the WebGL view over the hexagon's floor, fed by the engine below on each frame (live3d.js, loaded only now)
        let r3 = null, ranSet = new Set()
        if (o.d3) {
            wrap.classList.add('lv-3d-on'); const box = doc.createElement('div'); box.className = 'lv-3d'; box.setAttribute('data-lv3d', ''); hex.appendChild(box)
            const shell = new Map(), nodes3 = []
            for (const [id, n] of pos) {
                let z = 0; if (n.kind === 'a') { const k = shell.get(n.person) || 0; shell.set(n.person, k + 1); z = (k % 2 ? 1 : -1) * (40 + 38 * (Math.floor(k / 2) % 3)) }
                nodes3.push({ id, x: n.x - C, y: C - n.y, z, color: n.kind === 'k' ? (KIND[n.id] || ['var(--rm-text-muted)'])[0] : col.get(n.person) || 'var(--rm-text-muted)', size: n.kind === 'k' ? 1.4 * n.size : n.kind === 'p' ? 56 : n.family !== 'web-summit' ? 17 : 2 * (4 + Math.min(8, Math.sqrt(n.commits || 0))) + 2, ring: !!n.fresh, label: n.kind === 'p' || n.kind === 'k' ? n.label : '' })
            }
            const lib = root.AngeloLive3D ? Promise.resolve() : new Promise((ok, no) => { const s = document.createElement('script'); s.src = (() => { const u = new URL('live3d.js', HERE), v = ((win.document.querySelector('a.ver') || document.querySelector('a.ver') || {}).textContent || '').trim(); if (v) u.searchParams.set('v', v); return u.href })(); s.onload = ok; s.onerror = () => no(new Error('live3d.js could not load')); document.head.appendChild(s) })
            lib.then(() => root.AngeloLive3D.create(box, { nodes: nodes3, links: M.links || [], light, keep: !!o.keep3d, still: win.matchMedia('(prefers-reduced-motion: reduce)').matches, dist: Math.round(1650 * 0.84 / SCALE),
                ctrl: (a, b) => { const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, mz = (a.z + b.z) / 2; return { x: mx * (1 - PULL), y: my * (1 - PULL), z: mz * (1 - PULL) } } }))
                .then(r => { if (!r) return; if (!alive) { r.destroy(); return } r3 = r; box.r3 = r; kick() })
                .catch(e => { wrap.classList.remove('lv-3d-on'); box.innerHTML = `<p class="note">The 3D view could not load (${String(e && e.message || e).replace(/[<>&]/g, '')}); this is the 2D graph.</p>` })
        }

        // ---- what moves ----
        const lines = new Map(), fly = [], hot = new Map(), seen = SEEN, queue = []
        let alive = true, raf = 0, timer = 0, built = 0, lastOk = 0, last = 0, debt = 0, flowN = 0, weights = [], wsum = 0, act = 1
        const pairEl = (a, b) => { const k = a + '|' + b; let e = lines.get(k); if (!e) { e = { path: el('path', { stroke: col.get(pos.get(a).person) || 'var(--rm-text-muted)', 'stroke-width': 3.2, 'stroke-opacity': 0, d: curve(pos.get(a), pos.get(b)) }, links), at: -1e9 }; lines.set(k, e) } return e }
        const colOf = id => col.get(pos.get(id).person) || 'var(--rm-text-muted)'
        // a real exchange: a bright dot with a halo, the line lit behind it
        // the dots keep a minimum size on screen, so a small pop-out window still shows them moving (Angelo, 7 November: in the
        // pop-out "the messages stop": they were there, but a pixel wide). unit: screen pixels per drawing unit, measured as drawn
        let unit = 1, unitAt = -1e9
        const px = (base, minPx, now) => { if (now - unitAt > 1000) { const w = svg.getBoundingClientRect().width; if (w) unit = w / S * SCALE; unitAt = now } return f1(Math.max(base, minPx / Math.max(unit, 0.05))) }
        const launch = (from, to, now) => { const e = pairEl(from, to); e.at = now; const c = colOf(from); fly.push({ from, to, t0: now, ms: TRAVEL_MS, halo: el('circle', { r: px(14, 12, now), fill: c, class: 'halo' }, pulses), dot: el('circle', { r: px(7.5, 6, now), fill: c }, pulses) }); if (fly.length > 160) { const x = fly.shift(); x.dot.remove(); x.halo && x.halo.remove() } }
        // the constant flow: small, faint, slower dots on the lines, chosen by how busy each pair has been lately
        const flowOne = (now) => {
            if (!wsum || flowN >= FLOW_MAX) return
            let r = Math.random() * wsum, k = 0; while (k < weights.length - 1 && (r -= weights[k].w) > 0) k++
            const w = weights[k], e = pairEl(w.from, w.to), ms = FLOW_TRAVEL_MS * (0.8 + Math.random() * 0.5); e.flowAt = now; e.flowMs = ms; flowN++; fly.push({ from: w.from, to: w.to, t0: now, ms, flow: true, dot: el('circle', { r: px(5.5, 4.5, now), fill: colOf(w.from), class: 'flow' }, pulses) })
        }
        const busy = (id, now) => { if (!hot.has(id)) N.get(id).classList.add('lv-hot'); hot.set(id, now + 1200) }
        // one event: from its agent to each of its targets; with no target the agent alone lights up
        const play = (ev, now) => {
            const from = nodeOf(ev.agent); if (!from) return
            busy(from, now)
            for (const t of ev.to) { const to = nodeOf(t); if (to && to !== from) { launch(from, to, now); busy(to, now + TRAVEL_MS * 0.8) } }
        }
        const frame = ts => {
            raf = 0; if (!alive || !host.isConnected) return
            const now = ts, dt = Math.min(250, last ? now - last : 16); last = now
            while (queue.length && queue[0].at <= now) play(queue.shift().ev, now)
            paintWhen()
            // never stops: the flow's rate follows the last hour against the 48-hour average, and breathes slowly
            debt += FLOW_BASE * (0.6 + 0.4 * Math.min(2, act)) * (1 + 0.2 * Math.sin(now / 9000)) * dt / 1000
            while (debt >= 1) { debt -= 1; flowOne(now) }
            for (let i = fly.length - 1; i >= 0; i--) {
                const f = fly[i], u = (now - f.t0) / f.ms
                if (u >= 1) { f.dot.remove(); if (f.halo) f.halo.remove(); if (f.flow) flowN--; fly.splice(i, 1); continue }
                f.u = u; if (r3) continue
                const a = pos.get(f.from), b = pos.get(f.to), q = bend(a, b), v = 1 - u
                const x = f1(v * v * a.x + 2 * v * u * q.x + u * u * b.x), y = f1(v * v * a.y + 2 * v * u * q.y + u * u * b.y)
                f.dot.setAttribute('cx', x); f.dot.setAttribute('cy', y); if (f.halo) { f.halo.setAttribute('cx', x); f.halo.setAttribute('cy', y) }
                if (f.flow) f.dot.style.opacity = (0.55 + 0.45 * Math.sin(Math.PI * u)).toFixed(2)
            }
            for (const [, e] of lines) { const age = now - e.at, fa = e.flowAt ? now - e.flowAt : 1e9, fop = fa < e.flowMs ? 0.75 : Math.max(0, 0.75 * (1 - (fa - e.flowMs) / 1500)), op = Math.max(fop, age < TRAVEL_MS ? 0.95 : Math.max(0, 0.95 * (1 - (age - TRAVEL_MS) / FADE_MS))); const v = op.toFixed(2); if (v !== e.op) { e.op = v; if (!r3) e.path.setAttribute('stroke-opacity', v) } }
            for (const [id, until] of hot) if (until <= now) { hot.delete(id); N.get(id).classList.remove('lv-hot') }
            // 3D: the same state, drawn in WebGL; the dots breathe more when the team is busier
            if (r3) { try { r3.draw({ now, fly, lines, hot, ran: ranSet, breath: 0.035 + 0.035 * Math.min(2, act) }) } catch (e) { r3 = null } }
            raf = win.requestAnimationFrame(frame)
        }
        const kick = () => { if (!raf && alive) raf = win.requestAnimationFrame(frame) }
        const enqueue = (items) => { for (const it of items) queue.push(it); queue.sort((x, y) => x.at - y.at); kick() }

        // ---- the data: live.json, about once a minute ----
        // every repository's exchanges come in the same list (live.json's repos; e[5] is the repository, 0 this site's dev), drawn alike
        const toEv = (L, e) => ({ sha: (e[5] || 0) + ':' + e[4], ms: Date.parse(L.from) + e[0] * 6e4, agent: L.agents[e[1]], to: e[3].map(i => L.targets[i]), repo: (L.repos || [])[e[5] || 0] })
        // how busy each pair has been: events weighted by their age (half-life HALF_LIFE_H hours); with no recent events, the graph's own links
        const tally = evs => {
            const m = new Map(), nowMs = Date.now(); let hour = 0
            for (const e of evs) {
                const from = nodeOf(e.agent); if (!from) continue
                const w = Math.pow(0.5, Math.max(0, nowMs - e.ms) / 36e5 / HALF_LIFE_H); if (nowMs - e.ms < 36e5) hour++
                for (const t of e.to) { const to = nodeOf(t); if (to && to !== from) { const k = from + '|' + to; m.set(k, (m.get(k) || 0) + w) } }
            }
            if (!m.size) for (const l of M.links || []) if (pos.get(l.from) && pos.get(l.to)) m.set(l.from + '|' + l.to, l.n)
            weights = [...m].map(([k, w]) => { const [from, to] = k.split('|'); return { from, to, w } }); wsum = weights.reduce((x, y) => x + y.w, 0)
            act = evs.length ? hour / (evs.length / 48) : 1
            const ran = new Set(evs.filter(e => nowMs - e.ms < 2 * 36e5).map(e => nodeOf(e.agent)))
            for (const [id, g] of N) if (pos.get(id).fresh) g.classList.toggle('lv-ran', ran.has(id))
            ranSet = ran
        }
        async function read(first) {
            try {
                // no cache-busting query: the offline worker (sw.js) stores by address, so one copy is replaced each minute instead of a new one kept
                const r = await fetch(new URL(o.liveUrl || 'live.json', root.location.href).href, { cache: 'no-store' }); if (!r.ok) throw new Error(r.status)
                const L = await r.json(); if (!alive) return
                lastOk = Date.now(); built = Date.parse(L.built_at) || built
                const evs = L.events.map(e => toEv(L, e)).sort((x, y) => x.ms - y.ms); tally(evs)
                const firstEver = !seen.size, t = win.performance.now(), disp = Date.now() - DELAY_MS, items = []; let late = 0
                for (const e of evs) {
                    if (seen.has(e.sha)) continue; seen.add(e.sha)
                    if (firstEver && e.ms <= disp) continue                   // opening: nothing older than the delay is replayed
                    // each exchange at its real moment, a fixed delay behind; one that reached the site later than that plays at once, a beat apart
                    items.push({ ev: e, at: e.ms > disp ? t + (e.ms - disp) : t + 350 * late++ })
                }
                enqueue(items)
            } catch { lastOk = lastOk || 0 }
            paintDot()
            if (alive) timer = win.setTimeout(() => read(false), POLL_MS + (Math.random() * 2 - 1) * SPREAD_MS)
        }
        const paintDot = () => {
            const age = built ? (Date.now() - built) / 6e4 : Infinity, ok = lastOk && Date.now() - lastOk < 3 * (POLL_MS + SPREAD_MS)
            dot.className = 'lv-live ' + (!ok ? 'off' : age > STALE_MIN ? 'old' : 'on')
            dot.title = !ok ? 'Could not read the latest exchanges; trying again' : `Live: up to date as of ${new Date(built).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${age > STALE_MIN ? `, over ${STALE_MIN} minutes ago (a quiet spell, or a slow release)` : ''}`
        }
        // back from sleep or lost Wi-Fi: read at once instead of waiting for the next tick (a failed read is simply tried again)
        const again = () => { if (!alive || win.document.visibilityState === 'hidden') return; win.clearTimeout(timer); read(false) }
        win.addEventListener('online', again); win.document.addEventListener('visibilitychange', again)
        read(true); kick()
        return { layout: L, destroy() { alive = false; if (r3) { r3.destroy(); r3 = null } win.clearTimeout(timer); if (raf) win.cancelAnimationFrame(raf); fly.length = 0; win.removeEventListener('online', again); win.document.removeEventListener('visibilitychange', again) } }
    }

    // ---- the page view (#live) and the pop-out ----
    let current = null, popped = null
    function stylesInto(doc) {
        const s = doc.createElement('style'); s.textContent = CSS; doc.head.appendChild(s)
    }
    function copyTheme(from, to) {
        for (const a of from.documentElement.attributes) to.documentElement.setAttribute(a.name, a.value)
        for (const n of from.querySelectorAll('link[rel="stylesheet"], style')) to.head.appendChild(n.cloneNode(true))
        // relative addresses of the cloned links would resolve against the pop-out's blank page
        for (const l of to.querySelectorAll('link[rel="stylesheet"]')) l.href = new URL(l.getAttribute('href'), from.baseURI).href
    }
    const supported = () => !!(root.documentPictureInPicture && root.documentPictureInPicture.requestWindow)
    // Safari has no always-on-top page window, but it floats a video (macOS, and iPadOS 14 on). ?pip=video forces it, for the tests.
    const videoPip = () => { try { const V = root.HTMLVideoElement.prototype; return !!(root.HTMLCanvasElement.prototype.captureStream && (V.requestPictureInPicture && document.pictureInPictureEnabled !== false || V.webkitSetPresentationMode)) } catch { return false } }
    const pipMode = () => { try { if (/[?&]pip=video(&|$)/.test(root.location.search)) return videoPip() ? 'video' : '' } catch { } return supported() ? 'doc' : videoPip() ? 'video' : '' }
    // the graph as a picture: a copy of the drawing with the page's colours and the map's and the live graph's rules inside it
    // (every variable named in those rules or in the drawing's own attributes, the people's colours among them, given its value here)
    function svgStyle(doc, svgText) {
        const vars = new Set(), rules = [], names = t => { for (const m of t.matchAll(/--[\w-]+/g)) vars.add(m[0]) }
        for (const sh of doc.styleSheets) { let rs; try { rs = sh.cssRules } catch { continue } for (const r of rs) if (r.selectorText && /\.(tm-|lv-)/.test(r.selectorText)) { rules.push(r.cssText); names(r.cssText) } }
        names(svgText)
        const cs = root.getComputedStyle(doc.documentElement)
        return `svg{${[...vars].map(v => `${v}:${cs.getPropertyValue(v).trim()}`).filter(x => !/:$/.test(x)).join(';')}}\n` + rules.join('\n')
    }
    // the floating video: about 12 pictures a second of the graph on this page (which keeps running under it), closed from its own
    // window or the button. It moves while this page runs: Safari slows or pauses a page it hides, and the picture waits with it.
    function popVideo(src, onEnd) {
        const W = 440, R = 2, cv = document.createElement('canvas'); cv.width = cv.height = W * R
        const cx = cv.getContext('2d'), v = document.createElement('video')
        v.muted = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('data-lv-pipvideo', '')
        v.style.cssText = 'position:fixed;left:0;bottom:0;width:2px;height:2px;opacity:0.01;pointer-events:none'
        document.body.appendChild(v)
        let css = '', cssAt = 0; const bg = root.getComputedStyle(document.documentElement).getPropertyValue('--rm-bg').trim() || '#07111F'
        let busy = false, alive = true
        // the logos, LIVE and the moment shown, painted over the picture where they sit on the page (the logos are served for any origin)
        const over = s => {
            const hx = s.parentNode, hr = hx && hx.getBoundingClientRect(); if (!hr || !hr.width) return; const k = cv.width / hr.width
            for (const im of hx.querySelectorAll('.lv-logo')) { if (!im.complete || !im.naturalWidth || im.classList.contains('gone')) continue; const r = im.getBoundingClientRect(); try { cx.drawImage(im, (r.left - hr.left) * k, (r.top - hr.top) * k, r.width * k, r.height * k) } catch { } }
            for (const el of hx.querySelectorAll('.lv-live, .lv-when')) {
                const r = el.getBoundingClientRect(), cs = root.getComputedStyle(el), x = (r.left - hr.left) * k, y = (r.top - hr.top) * k, w = r.width * k, h = r.height * k
                cx.save(); cx.fillStyle = cx.strokeStyle = cs.color; cx.font = `${cs.fontWeight} ${parseFloat(cs.fontSize) * k}px ${cs.fontFamily}`; cx.textBaseline = 'middle'
                if (el.classList.contains('lv-live')) { cx.lineWidth = k; cx.beginPath(); cx.roundRect ? cx.roundRect(x, y, w, h, h / 2) : cx.rect(x, y, w, h); cx.stroke()
                    cx.globalAlpha = el.classList.contains('on') ? 0.3 + 0.7 * Math.abs(Math.cos(Date.now() / 1600 * Math.PI)) : 1; cx.beginPath(); cx.arc(x + h * 0.55, y + h / 2, h * 0.17, 0, 7); cx.fill(); cx.globalAlpha = 1
                    cx.textAlign = 'left'; cx.fillText('LIVE', x + h * 0.9, y + h / 2) }
                else { cx.textAlign = 'center'; cx.fillText(el.textContent, x + w / 2, y + h / 2) }
                cx.restore()
            }
        }
        const draw = () => {
            const s = src(); if (!alive || busy || !s) return
            const c3 = s.parentNode && s.parentNode.querySelector('.lv-3dc')
            if (c3) { cx.fillStyle = bg; cx.fillRect(0, 0, cv.width, cv.height); try { cx.drawImage(c3, 0, 0, cv.width, cv.height) } catch { } over(s); return }   // 3D: the WebGL picture itself
            busy = true
            const c = s.cloneNode(true); c.setAttribute('xmlns', NS); c.setAttribute('width', W * R); c.setAttribute('height', W * R); c.setAttribute('class', 'lv lv-svg tm-svg')
            if (!css || Date.now() - cssAt > 60000) { css = svgStyle(document, new root.XMLSerializer().serializeToString(s)); cssAt = Date.now() }   // again each minute: new agents, new colours
            const st = document.createElementNS(NS, 'style'); st.textContent = css; c.insertBefore(st, c.firstChild)
            const img = new root.Image(); img.onload = () => { cx.fillStyle = bg; cx.fillRect(0, 0, cv.width, cv.height); cx.drawImage(img, 0, 0, cv.width, cv.height); over(s); busy = false }; img.onerror = () => { busy = false }
            img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new root.XMLSerializer().serializeToString(c))
        }
        cx.fillStyle = bg; cx.fillRect(0, 0, cv.width, cv.height); draw()
        const iv = root.setInterval(draw, 1000 / 12), stream = cv.captureStream(12); v.srcObject = stream
        const stop = () => { if (!alive) return; alive = false; root.clearInterval(iv); for (const t of stream.getTracks()) t.stop(); v.remove(); onEnd() }
        v.addEventListener('leavepictureinpicture', stop); v.addEventListener('webkitpresentationmodechanged', () => { if (v.webkitPresentationMode === 'inline') stop() })
        const open = async () => {
            await v.play()
            if (v.requestPictureInPicture && document.pictureInPictureEnabled !== false) await v.requestPictureInPicture(); else v.webkitSetPresentationMode('picture-in-picture')
        }
        return { open, stop, close: async () => { try { if (document.pictureInPictureElement === v) await document.exitPictureInPicture(); else if (v.webkitPresentationMode === 'picture-in-picture') v.webkitSetPresentationMode('inline') } catch { } stop() } }
    }
    // full screen: the standard call, or Safari's (iPad and Mac); an iPhone has neither for a page, so the button is not shown there
    const fsOf = e => e.requestFullscreen ? () => e.requestFullscreen() : e.webkitRequestFullscreen ? () => e.webkitRequestFullscreen() : null
    const is3d = () => { try { return /(^|[?&])d3=1(&|$)/.test(root.location.search.slice(1)) || /[?&]d3=1(&|$)/.test(root.location.hash) } catch { return false } }
    const isDisplay = () => { try { return /(^|[?&])display=1(&|$)/.test(root.location.search.slice(1)) || /[?&]display=1(&|$)/.test(root.location.hash) } catch { return false } }
    // display mode keeps the screen awake where the browser allows it (asked again whenever the page is shown) and reloads every
    // six hours, at a moment with nothing in flight, so a screen left on for days returns all its memory
    let lock = null, reloadAt = 0
    async function wake() { try { if (root.navigator.wakeLock && document.visibilityState === 'visible' && !lock) { lock = await root.navigator.wakeLock.request('screen'); lock.addEventListener('release', () => { lock = null }) } } catch { lock = null } }
    function display(host, o) {
        if (current) { current.destroy(); current = null }
        if (!document.getElementById('lv-css')) { stylesInto(document); document.head.lastChild.id = 'lv-css' }
        host.innerHTML = '<div class="lv-display" data-lv-display></div>'
        current = mount(host.querySelector('[data-lv-display]'), { ...o, win: root, d3: is3d(), bare: true })
        wake(); if (!root.__lvWake) { root.__lvWake = true; document.addEventListener('visibilitychange', wake) }
        // no controls; Esc leaves display mode for the normal view
        if (!root.__lvEsc) { root.__lvEsc = true; root.addEventListener('keydown', e => { if (e.key === 'Escape' && isDisplay()) root.location.href = root.location.pathname + '#live' }) }
        if (!reloadAt) { reloadAt = Date.now() + 6 * 36e5; const tick = () => { if (Date.now() >= reloadAt && !document.querySelector('.lv-pulses circle:not(.flow)')) root.location.reload(); else root.setTimeout(tick, 30000) }; root.setTimeout(tick, 30000) }
        return { destroy() { if (current) { current.destroy(); current = null } } }
    }
    function view(host, o) {
        if (isDisplay()) return display(host, o)
        if (current) { current.destroy(); current = null }
        const d3 = is3d()
        if (!host.ownerDocument.getElementById('lv-css')) { stylesInto(host.ownerDocument); host.ownerDocument.head.lastChild.id = 'lv-css' }
        host.innerHTML = `<div class="lv-page"><div class="lv-bar"><button type="button" class="cc-btn" data-lv-pop>⧉ Pop out</button><button type="button" class="cc-btn" data-lv-fs hidden>⛶ Full screen</button><a class="cc-btn" data-lv-3dsw aria-pressed="${d3}" href="${d3 ? root.location.pathname + root.location.search.replace(/([?&])d3=1(&|$)/, '$1').replace(/[?&]$/, '') + '#live' : '#live?d3=1'}" title="${d3 ? 'Back to the flat graph' : 'The same live graph in 3D: drag to turn it; loads 1.6 MB of 3D libraries'}">${d3 ? '✓ 3D' : '3D'}</a><a class="cc-btn" data-lv-display href="?display=1${d3 ? '&d3=1' : ''}#live">Display mode</a><span class="note" data-lv-note>${pipMode() === 'doc' ? 'An always-on-top window with this graph. Close it to come back here.' : pipMode() === 'video' ? 'A floating window with this graph, over your other windows and apps. It moves while this page is open; close it from its own window.' : 'Pop-out needs Chrome or Edge on a computer, or Safari on a Mac or iPad. Otherwise use Full screen, or Display mode for a screen left on.'}</span></div><div class="lv-frame" data-lv-frame></div><p class="note">Lines and dots only. Each exchange between agents (a commit with a For: line, in any repository the agents work in: this site, its workers' branches, the newsroom, the apps) travels along its line a few minutes after it is made, at its real pace. The faint dots between are the flow of recent hours: busier pairs, more dots. A dashed ring that turns slowly is an agent that starts a fresh session each run: it is there between runs, and its ring is bright for two hours after it last sent something. LIVE at the top pulses while the data is fresh; it turns amber and still when the data is over 30 minutes old, and grey when it cannot be read. The time at the foot is the moment on screen, a few minutes behind now, in your time zone. The small buttons at the top right pick the layout, the map's three (remembered on this device). Names, edges and times only: no message text.</p></div>`
        const frame = host.querySelector('[data-lv-frame]'), btn = host.querySelector('[data-lv-pop]'), note = host.querySelector('[data-lv-note]')
        const inline = () => { current = mount(frame, { ...o, win: root, d3, keep3d: pipMode() === 'video' }) }
        if (popped) { frame.innerHTML = '<p class="note" style="padding:16px">Popped out.</p>' } else inline()
        const mode = pipMode(); btn.disabled = !mode
        const fb = host.querySelector('[data-lv-fs]'), go = fsOf(frame)
        if (go) { fb.hidden = false; fb.onclick = () => { try { const r = go(); if (r && r.catch) r.catch(() => { }) } catch { } } }
        btn.onclick = async () => {
            if (popped) { popped.close(); return }
            if (mode === 'video') {
                // the graph stays on this page, drawing the floating picture
                const pv = popVideo(() => frame.querySelector('.lv-svg'), () => { popped = null; btn.textContent = '⧉ Pop out' })
                popped = { close: () => pv.close() }; btn.textContent = '✕ Close the floating window'
                try { await pv.open() } catch (e) { pv.stop(); note.textContent = 'The floating window could not open: ' + (e && e.message ? e.message : e) }
                return
            }
            try {
                const w = await root.documentPictureInPicture.requestWindow({ width: 440, height: 440 })
                popped = w; if (current) { current.destroy(); current = null }
                copyTheme(document, w.document); stylesInto(w.document)
                const st = w.document.createElement('style'); st.textContent = 'html,body{margin:0;height:100%;background:var(--rm-bg,#07111F)} body>div{height:100%}'; w.document.head.appendChild(st)
                const box = w.document.createElement('div'); w.document.body.appendChild(box)
                const inst = mount(box, { ...o, win: w, d3 })
                frame.innerHTML = '<p class="note" style="padding:16px">Popped out. Close its window to bring the graph back here.</p>'; btn.textContent = '✕ Bring it back'
                w.addEventListener('pagehide', () => { inst.destroy(); popped = null; if (host.isConnected) { btn.textContent = '⧉ Pop out'; frame.innerHTML = ''; current = mount(frame, { ...o, win: root, d3, keep3d: pipMode() === 'video' }) } })
            } catch (e) { note.textContent = 'The pop-out window could not open: ' + (e && e.message ? e.message : e) }
        }
        return { destroy() { if (current) { current.destroy(); current = null } } }
    }
    root.AngeloLive = { mount, view, supported, isDisplay, is3d }
})(typeof self !== 'undefined' ? self : this)
