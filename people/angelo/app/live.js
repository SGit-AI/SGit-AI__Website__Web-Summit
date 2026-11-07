// The live map: Team and the machine's graph as a small always-on view, lines and dots only, in a hexagon
// (dev.map@PrompTugal.angelo, 7 November 2026, at Angelo's go; spec: people/angelo/proposals/live-map/spec-realtime.md).
// It draws the same graph as the command centre's map (the people ring: same layout, same colours, same classes), reads
// live.json (the last 48 hours of exchanges: who, to whom, when, never a word of text) again about every minute, and
// lets each new exchange travel along its line as it arrives. Opening it replays the last hour in a few seconds.
// "Pop out" puts it in an always-on-top window (Document Picture-in-Picture: Chrome and Edge on a desktop).
(function (root) {
    'use strict'
    const NS = 'http://www.w3.org/2000/svg'
    // the same colours as the map in the command centre (app.js's TM_COL)
    const COL = ['var(--rm-role-conductor)', 'var(--rm-role-dev)', 'var(--rm-gold)', 'var(--rm-role-video)', 'var(--rm-green)', 'var(--rm-role-outreach)', 'var(--rm-orange)', 'var(--rm-blue)', 'var(--rm-red)']
    const S = 1000, C = S / 2, RP = 300, PULL = 0.55
    const SCALE = 0.84                    // the graph sits inside the hexagon: its corners are 7% in from the square's
    const POLL = (() => { try { return +new URLSearchParams(root.location.search).get('livepoll') || 0 } catch { return 0 } })()   // seconds; only for the tests
    const POLL_MS = POLL ? POLL * 1000 : 60000, SPREAD_MS = POLL ? 0 : 10000, TRAVEL_MS = 1600, FADE_MS = 3200, REPLAY_MIN = 60, REPLAY_MS = 20000, STALE_MIN = 20
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
.lv .tm-p, .lv .tm-a { cursor: default; }
.lv .tm-a.lv-hot > circle, .lv .tm-a.lv-hot > rect { stroke: var(--rm-text, #fff); stroke-width: 3; }
.lv-dot { position: absolute; left: 15%; top: 50%; width: 10px; height: 10px; border-radius: 50%; background: var(--rm-green, #3ecf8e); box-shadow: 0 0 8px currentColor; color: var(--rm-green, #3ecf8e); transform: translateY(-50%); }
.lv-dot.old { background: var(--rm-orange, #f5a524); color: var(--rm-orange, #f5a524); }
.lv-dot.off { background: var(--rm-text-muted, #9EB2C7); color: transparent; }
.lv-dot.on { animation: lv-beat 1s ease-out; }
@keyframes lv-beat { 0% { transform: translateY(-50%) scale(2.2); } 100% { transform: translateY(-50%) scale(1); } }
.lv-replay { white-space: nowrap; position: absolute; left: 50%; bottom: 10%; transform: translateX(-50%); font: 600 11px/1 var(--rm-font, system-ui); letter-spacing: .08em; text-transform: uppercase; color: var(--rm-text-muted, #9EB2C7); opacity: 0; transition: opacity .4s; pointer-events: none; }
.lv-replay.on { opacity: 1; }
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
        const dot = doc.createElement('i'); dot.className = 'lv-dot off'; dot.title = 'Reading the latest exchanges…'; hex.appendChild(dot)
        const tag = doc.createElement('span'); tag.className = 'lv-replay'; tag.textContent = 'replay of the last hour'; hex.appendChild(tag)
        host.appendChild(wrap)

        // ---- what moves ----
        const lines = new Map(), fly = [], hot = new Map(), seen = SEEN, queue = []
        let alive = true, raf = 0, timer = 0, built = 0, lastOk = 0
        const pairEl = (a, b) => { const k = a + '|' + b; let e = lines.get(k); if (!e) { e = { path: el('path', { stroke: col.get(pos.get(a).person) || 'var(--rm-text-muted)', 'stroke-width': 2.2, 'stroke-opacity': 0, d: curve(pos.get(a), pos.get(b)) }, links), at: 0 }; lines.set(k, e) } return e }
        const launch = (from, to, now) => { const e = pairEl(from, to); e.at = now; fly.push({ from, to, t0: now, c: col.get(pos.get(from).person) || 'var(--rm-text-muted)', dot: el('circle', { r: 5, fill: col.get(pos.get(from).person) || 'var(--rm-text-muted)' }, pulses) }); if (fly.length > 120) fly.shift().dot.remove() }
        const busy = (id, now) => { if (!hot.has(id)) N.get(id).classList.add('lv-hot'); hot.set(id, now + 1200) }
        // one event: from its agent to each of its targets; with no target the agent alone lights up
        const play = (ev, now) => {
            const from = nodeOf(ev.agent); if (!from) return
            busy(from, now)
            for (const t of ev.to) { const to = nodeOf(t); if (to && to !== from) { launch(from, to, now); busy(to, now + TRAVEL_MS * 0.8) } }
        }
        const frame = ts => {
            raf = 0; if (!alive || !host.isConnected) return
            const now = ts
            // events waiting their turn: one every 350 ms (a replay compresses the hour; a poll's new ones stagger the same way)
            while (queue.length && queue[0].at <= now) play(queue.shift().ev, now)
            for (let i = fly.length - 1; i >= 0; i--) {
                const f = fly[i], u = (now - f.t0) / TRAVEL_MS
                if (u >= 1) { f.dot.remove(); fly.splice(i, 1); continue }
                const a = pos.get(f.from), b = pos.get(f.to), q = bend(a, b), v = 1 - u
                f.dot.setAttribute('cx', f1(v * v * a.x + 2 * v * u * q.x + u * u * b.x)); f.dot.setAttribute('cy', f1(v * v * a.y + 2 * v * u * q.y + u * u * b.y))
            }
            for (const [, e] of lines) { const age = now - e.at, op = age < TRAVEL_MS ? 0.8 : Math.max(0, 0.8 * (1 - (age - TRAVEL_MS) / FADE_MS)); const v = op.toFixed(2); if (v !== e.op) { e.op = v; e.path.setAttribute('stroke-opacity', v) } }
            for (const [id, until] of hot) if (until <= now) { hot.delete(id); N.get(id).classList.remove('lv-hot') }
            tag.classList.toggle('on', replaying && (queue.length > 0 || fly.length > 0))
            if (queue.length || fly.length || hot.size || [...lines.values()].some(e => e.op !== '0.00')) raf = win.requestAnimationFrame(frame)
        }
        const kick = () => { if (!raf && alive) raf = win.requestAnimationFrame(frame) }
        let replaying = false
        const enqueue = (evs, spacing, start) => { let at = start; for (const ev of evs) { queue.push({ ev, at }); at += spacing } kick() }

        // ---- the data: live.json, about once a minute ----
        const toEv = (L, e) => ({ sha: e[4], t: e[0], agent: L.agents[e[1]], to: e[3].map(i => L.targets[i]) })
        async function read(first) {
            try {
                const r = await fetch(new URL(o.liveUrl || 'live.json', root.location.href).href + '?t=' + Date.now(), { cache: 'no-store' }); if (!r.ok) throw new Error(r.status)
                const L = await r.json(); if (!alive) return
                lastOk = Date.now(); built = Date.parse(L.built_at) || built
                const evs = L.events.map(e => toEv(L, e)).sort((x, y) => x.t - y.t)
                const fresh = evs.filter(e => !seen.has(e.sha)), firstEver = !seen.size; for (const e of evs) seen.add(e.sha)
                const t = win.performance.now()
                if (first && firstEver) {   // opening: the last hour, played in REPLAY_MS (not again when the page redraws)
                    const lastMin = evs.length ? evs[evs.length - 1].t : 0, hour = evs.filter(e => e.t >= lastMin - REPLAY_MIN)
                    replaying = true; enqueue(hour, Math.min(500, REPLAY_MS / Math.max(1, hour.length)), t + 300)
                    win.setTimeout(() => { replaying = false }, REPLAY_MS + 4000)
                } else if (fresh.length) { dot.classList.remove('on'); void dot.offsetWidth; dot.classList.add('on'); enqueue(fresh, 350, t) }
            } catch { lastOk = lastOk || 0 }
            paintDot()
            if (alive) timer = win.setTimeout(() => read(false), POLL_MS + (Math.random() * 2 - 1) * SPREAD_MS)
        }
        const paintDot = () => {
            const age = built ? (Date.now() - built) / 6e4 : Infinity, ok = lastOk && Date.now() - lastOk < 3 * (POLL_MS + SPREAD_MS)
            dot.className = 'lv-dot ' + (!ok ? 'off' : age > STALE_MIN ? 'old' : '')
            dot.title = !ok ? 'Could not read the latest exchanges; trying again' : `Up to date as of ${new Date(built).toISOString().slice(11, 16)} UTC${age > STALE_MIN ? ' (a quiet spell, or a slow release)' : ''}`
        }
        read(true)
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
        host.innerHTML = `<div class="lv-page"><div class="lv-bar"><button type="button" class="cc-btn" data-lv-pop>⧉ Pop out</button><span class="note" data-lv-note>${supported() ? 'An always-on-top window with this graph. Close it to come back here.' : 'Pop-out needs Chrome or Edge on a computer. On a Mac or iPad, keep this page open on its own.'}</span></div><div class="lv-frame" data-lv-frame></div><p class="note">Lines and dots only. Each exchange between agents (a commit with a For: line) travels along its line when it reaches the site, a few minutes after it is made. The dot at the left is green while the data is fresh. Names, edges and times only: no message text.</p></div>`
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
