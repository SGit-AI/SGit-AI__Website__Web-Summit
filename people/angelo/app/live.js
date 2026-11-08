// The live map: Team and the machine's graph as a small always-on view, lines and dots only, in a hexagon
// (dev.map@PrompTugal.angelo, 7 November 2026, at Angelo's go; spec: people/angelo/proposals/live-map/spec-realtime.md).
// It draws the same graph as the command centre's map (the people ring: same layout, same colours, same classes), reads
// live.json (the last 48 hours of exchanges: who, to whom, when, never a word of text) again about every minute, and
// shows each exchange at its real moment, a few minutes behind (never accelerated, no replay), and under them a constant faint
// flow along every line, as dense as that pair has been in recent hours: it never stops, and nothing in it is invented.
// "Pop out" puts it in an always-on-top window (Document Picture-in-Picture: Chrome and Edge on a desktop).
(function (root) {
    'use strict'
    const NS = 'http://www.w3.org/2000/svg'
    // the same colours as the map in the command centre (app.js's TM_COL)
    const COL = ['var(--rm-role-conductor)', 'var(--rm-role-dev)', 'var(--rm-gold)', 'var(--rm-role-video)', 'var(--rm-green)', 'var(--rm-role-outreach)', 'var(--rm-orange)', 'var(--rm-blue)', 'var(--rm-red)']
    const S = 1000, C = S / 2, RP = 300, PULL = 0.55
    const SCALE = 0.84                    // the graph sits inside the hexagon: its corners are 7% in from the square's
    const POLL = (() => { try { return +new URLSearchParams(root.location.search).get('livepoll') || 0 } catch { return 0 } })()   // seconds; only for the tests
    const POLL_MS = POLL ? POLL * 1000 : 60000, SPREAD_MS = POLL ? 0 : 10000, TRAVEL_MS = 1600, FADE_MS = 3200, STALE_MIN = 20
    const DELAY_MS = (+new URLSearchParams(root.location.search || '').get('livedelay') || 4) * 6e4   // a fixed few minutes behind
    const FLOW_BASE = 3.5, FLOW_MAX = 70, FLOW_TRAVEL_MS = 3000, HALF_LIFE_H = 3   // ambient dots a second, at most on screen, their travel, how fast the past fades
    const HEX = 'M250 67 L750 67 L1000 500 L750 933 L250 933 L0 500 Z'
    const CSS = `
.lv { container-type: size; position: relative; width: 100%; height: 100%; display: grid; place-items: center; background: var(--rm-bg, #07111F); overflow: hidden; }
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
.lv .tm-a.lv-hot > circle, .lv .tm-a.lv-hot > rect { stroke: var(--rm-text, #fff); stroke-width: 3; }
.lv-dot { display: none; position: absolute; left: 8px; top: 8px; width: 7px; height: 7px; border-radius: 50%; background: var(--rm-green, #3ecf8e); box-shadow: 0 0 6px currentColor; color: var(--rm-green, #3ecf8e); opacity: .8; }
.lv-dot.old, .lv-dot.off { display: block; }
/* the light shows only when something is wrong (Angelo, 7 November: a green dot that belongs to no one reads as an agent) */
.lv-dot.old { background: var(--rm-orange, #f5a524); color: var(--rm-orange, #f5a524); }
.lv-dot.off { background: var(--rm-text-muted, #9EB2C7); color: transparent; }
.lv-bar { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin: 0 0 10px; }
.lv-page { display: grid; gap: 10px; }
.lv-frame { height: min(78vh, 760px); min-height: 320px; border-radius: var(--rm-radius-card, 12px); overflow: hidden; border: 1px solid var(--rm-border, #294A64); }
`
    const f1 = n => n.toFixed(1), SEEN = new Set()   // what has been shown, kept when the page redraws
    const personOf = n => { const m = String(n).match(/@(?:web-summit|promptugal)\.([a-z0-9-]+)$/i) || String(n).match(/^pt:([a-z0-9-]+):/); return m ? m[1].toLowerCase() : n }

    // the people ring, as the map draws it: people on a circle, each person's agents in two or three arcs beside them
    function layout(M) {
        const NP = M.people.length, pos = new Map(), col = new Map(M.people.map((p, i) => [p.id, COL[i % COL.length]]))
        M.people.forEach((p, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / NP; pos.set(p.id, { x: C + RP * Math.cos(a), y: C + RP * Math.sin(a), a, kind: 'p', label: p.name.split(' ')[0], person: p.id }) })
        for (const p of M.people) {
            const mine = M.agents.filter(a => a.person === p.id).sort((x, y) => (y.commits || 0) - (x.commits || 0)), N = mine.length, P = pos.get(p.id)
            const rows = N > 16 ? 3 : 2, spread = Math.min(Math.PI * (rows === 3 ? 1.3 : 0.95), (0.16 * N + 0.3) / (rows - 1))
            mine.forEach((a, k) => { const t = P.a + (N > 1 ? -spread / 2 + k * spread / (N - 1) : 0), rr = 100 + (k % rows) * 32; pos.set(a.id, { x: P.x + rr * Math.cos(t), y: P.y + rr * Math.sin(t), kind: 'a', person: a.person, family: a.family, commits: a.commits, label: a.short }) })
        }
        return { pos, col }
    }
    const nodeOfIn = pos => n => { const x = pos.get(n); if (x) return n; const pid = personOf(n); return pos.has(pid) && pos.get(pid).kind === 'p' ? pid : null }
    const bend = (a, b) => { const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2; return { x: mx + (C - mx) * PULL, y: my + (C - my) * PULL } }
    const curve = (a, b) => { const q = bend(a, b); return `M${f1(a.x)} ${f1(a.y)}Q${f1(q.x)} ${f1(q.y)} ${f1(b.x)} ${f1(b.y)}` }

    // mount(host, { D, liveUrl, win }): draws the graph into host (an element, maybe in another window) and keeps it live.
    // Returns { destroy }. win is the window whose clock and frames drive it (the pop-out's own, so it runs when the page is hidden).
    function mount(host, o) {
        const win = o.win || root, doc = host.ownerDocument, M = o.D && o.D.collab && o.D.collab.map
        if (!M || M.error || !M.people) { host.innerHTML = '<p class="note">The map\'s data is missing from this build.</p>'; return { destroy() { } } }
        const { pos, col } = layout(M), nodeOf = nodeOfIn(pos), el = (t, a, p) => { const e = doc.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e }
        host.innerHTML = ''
        const wrap = doc.createElement('div'); wrap.className = 'lv'; wrap.setAttribute('role', 'img'); wrap.setAttribute('aria-label', 'The team as one live graph: lines and dots, new exchanges travel along their lines')
        const hex = doc.createElement('div'); hex.className = 'lv-hex'; wrap.appendChild(hex)
        const svg = el('svg', { class: 'lv-svg tm-svg', viewBox: `0 0 ${S} ${S}` }, hex)
        // the hexagon: a thin glowing rim and a slightly lighter floor; everything outside it is the page's own dark
        el('path', { class: 'lv-fill', d: HEX }, svg); el('path', { class: 'lv-rim', d: HEX }, svg)
        const g = el('g', { transform: `translate(${C} ${C}) scale(${SCALE}) translate(${-C} ${-C})` }, svg)
        const links = el('g', { class: 'lv-links' }, g), nodes = el('g', { class: 'tm-nodes' }, g), pulses = el('g', { class: 'lv-pulses' }, g)
        // the graph as it is today: the static links faint under everything, then the people and their agents
        for (const l of M.links || []) { const a = pos.get(l.from), b = pos.get(l.to); if (a && b) el('path', { class: 'base', d: curve(a, b), stroke: col.get((a || {}).person) || 'var(--rm-text-muted)', 'stroke-width': f1(0.6 + 3.4 * Math.sqrt(l.n / Math.max(1, ...M.links.map(x => x.n)))) }, links) }
        const N = new Map()
        for (const [id, n] of pos) {
            if (n.kind === 'p') { const gp = el('g', { class: 'tm-p' }, nodes); el('circle', { cx: f1(n.x), cy: f1(n.y), r: 26, fill: col.get(id) }, gp); const t = el('text', { x: f1(n.x), y: f1(n.y + 5) }, gp); t.textContent = n.label; N.set(id, gp) }
            else { const ga = el('g', { class: 'tm-a' }, nodes), r = 4 + Math.min(8, Math.sqrt(n.commits || 0)); if (n.family !== 'web-summit') el('rect', { x: f1(n.x - 7), y: f1(n.y - 7), width: 14, height: 14, transform: `rotate(45 ${f1(n.x)} ${f1(n.y)})`, fill: col.get(n.person) }, ga); else el('circle', { cx: f1(n.x), cy: f1(n.y), r: f1(r), fill: col.get(n.person) }, ga); N.set(id, ga) }
        }
        const dot = doc.createElement('i'); dot.className = 'lv-dot off'; dot.title = 'Reading the latest exchanges…'; wrap.appendChild(dot)   // a status light in the window's corner, outside the graph
        host.appendChild(wrap)

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
            // never stops: the flow's rate follows the last hour against the 48-hour average, and breathes slowly
            debt += FLOW_BASE * (0.6 + 0.4 * Math.min(2, act)) * (1 + 0.2 * Math.sin(now / 9000)) * dt / 1000
            while (debt >= 1) { debt -= 1; flowOne(now) }
            for (let i = fly.length - 1; i >= 0; i--) {
                const f = fly[i], u = (now - f.t0) / f.ms
                if (u >= 1) { f.dot.remove(); if (f.halo) f.halo.remove(); if (f.flow) flowN--; fly.splice(i, 1); continue }
                const a = pos.get(f.from), b = pos.get(f.to), q = bend(a, b), v = 1 - u
                const x = f1(v * v * a.x + 2 * v * u * q.x + u * u * b.x), y = f1(v * v * a.y + 2 * v * u * q.y + u * u * b.y)
                f.dot.setAttribute('cx', x); f.dot.setAttribute('cy', y); if (f.halo) { f.halo.setAttribute('cx', x); f.halo.setAttribute('cy', y) }
                if (f.flow) f.dot.style.opacity = (0.55 + 0.45 * Math.sin(Math.PI * u)).toFixed(2)
            }
            for (const [, e] of lines) { const age = now - e.at, fa = e.flowAt ? now - e.flowAt : 1e9, fop = fa < e.flowMs ? 0.75 : Math.max(0, 0.75 * (1 - (fa - e.flowMs) / 1500)), op = Math.max(fop, age < TRAVEL_MS ? 0.95 : Math.max(0, 0.95 * (1 - (age - TRAVEL_MS) / FADE_MS))); const v = op.toFixed(2); if (v !== e.op) { e.op = v; e.path.setAttribute('stroke-opacity', v) } }
            for (const [id, until] of hot) if (until <= now) { hot.delete(id); N.get(id).classList.remove('lv-hot') }
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
            dot.className = 'lv-dot ' + (!ok ? 'off' : age > STALE_MIN ? 'old' : '')
            dot.title = !ok ? 'Could not read the latest exchanges; trying again' : `Up to date as of ${new Date(built).toISOString().slice(11, 16)} UTC${age > STALE_MIN ? ' (a quiet spell, or a slow release)' : ''}`
        }
        read(true); kick()
        return { destroy() { alive = false; win.clearTimeout(timer); if (raf) win.cancelAnimationFrame(raf); fly.length = 0 } }
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
    function view(host, o) {
        if (current) { current.destroy(); current = null }
        if (!host.ownerDocument.getElementById('lv-css')) { stylesInto(host.ownerDocument); host.ownerDocument.head.lastChild.id = 'lv-css' }
        host.innerHTML = `<div class="lv-page"><div class="lv-bar"><button type="button" class="cc-btn" data-lv-pop>⧉ Pop out</button><span class="note" data-lv-note>${supported() ? 'An always-on-top window with this graph. Close it to come back here.' : 'Pop-out needs Chrome or Edge on a computer. On a Mac or iPad, keep this page open on its own.'}</span></div><div class="lv-frame" data-lv-frame></div><p class="note">Lines and dots only. Each exchange between agents (a commit with a For: line, in any repository the agents work in: this site, its workers' branches, the newsroom, the apps) travels along its line a few minutes after it is made, at its real pace. The faint dots between are the flow of recent hours: busier pairs, more dots. The light in the corner is green while the data is fresh. Names, edges and times only: no message text.</p></div>`
        const frame = host.querySelector('[data-lv-frame]'), btn = host.querySelector('[data-lv-pop]'), note = host.querySelector('[data-lv-note]')
        const inline = () => { current = mount(frame, { ...o, win: root }) }
        if (popped) { frame.innerHTML = '<p class="note" style="padding:16px">Popped out.</p>' } else inline()
        btn.disabled = !supported()
        btn.onclick = async () => {
            if (popped) { popped.close(); return }
            try {
                const w = await root.documentPictureInPicture.requestWindow({ width: 440, height: 440 })
                popped = w; if (current) { current.destroy(); current = null }
                copyTheme(document, w.document); stylesInto(w.document)
                const st = w.document.createElement('style'); st.textContent = 'html,body{margin:0;height:100%;background:var(--rm-bg,#07111F)} body>div{height:100%}'; w.document.head.appendChild(st)
                const box = w.document.createElement('div'); w.document.body.appendChild(box)
                const inst = mount(box, { ...o, win: w })
                frame.innerHTML = '<p class="note" style="padding:16px">Popped out. Close its window to bring the graph back here.</p>'; btn.textContent = '✕ Bring it back'
                w.addEventListener('pagehide', () => { inst.destroy(); popped = null; if (host.isConnected) { btn.textContent = '⧉ Pop out'; frame.innerHTML = ''; current = mount(frame, { ...o, win: root }) } })
            } catch (e) { note.textContent = 'The pop-out window could not open: ' + (e && e.message ? e.message : e) }
        }
        return { destroy() { if (current) { current.destroy(); current = null } } }
    }
    root.AngeloLive = { mount, view, supported }
})(typeof self !== 'undefined' ? self : this)
