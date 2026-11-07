// The RiskMandate X-ray (xray@web-summit.dinis, 7 November 2026, for the booth at Web Summit, 9 to 12 November; at
// Dinis's word: "a big input in the middle ... we actually need graphs ... really go to town on this").
// On /xray/: type a name, press X-ray. A prepared subject plays the REPLAY of its real run (data/xray/<slug>/xray.json,
// run.agents: their order, their timings scaled to about ten seconds, their citation counts, the cost): the orchestrator
// fans out to the search agents, citations flow as particles to the collector, the collector seals the sources it read
// into the vault, and the graph of the X-ray grows. A name that is not prepared plays the dispatch and says so honestly.
// On /xray/<slug>/: the graph (tap a node for its detail and its sources) and a player per use case that places each
// action against the mandate and grows the record. RiskMandate is never in the request path: read-only by design, so
// nothing here ever shows it blocking, stopping or denying anything. Booth mode: ?booth=1 or the toggle (full screen,
// larger type, an attract loop after 60 s idle, back to the input on any touch). prefers-reduced-motion skips to the
// end state. No libraries, no network calls but this site's own data, and nothing typed is stored or sent.
(() => {
    'use strict'
    const mount = document.getElementById('xray'); if (!mount) return
    const up = document.body.dataset.up || ''
    const me = document.currentScript, ver = ((me && me.src) || '').match(/\?v=([^&#]+)/)
    if (!document.querySelector('link[href*="assets/xray/xray.css"]')) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = `${up}assets/xray/xray.css${ver ? '?v=' + ver[1] : ''}`; document.head.appendChild(l) }
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    const okUrl = u => /^https?:\/\//i.test(String(u || ''))
    const NS = 'http://www.w3.org/2000/svg'
    const RM = { path: 'never in the request path: read-only by design', does: 'measures what your agents can actually reach, evidences the controls that contain them, prices the exposure, and produces that record' }
    const DEFAULT_AGENTS = [{ id: 'perplexity', label: 'Perplexity search' }, { id: 'openai', label: 'OpenAI web search' }, { id: 'gemini', label: 'Gemini search' }, { id: 'openrouter', label: 'OpenRouter web search' }]
    const KIND_WORD = { code: 'code', data: 'data', system: 'systems', money: 'money', people: 'people', outside: 'the outside world' }
    const motionQ = matchMedia('(prefers-reduced-motion: reduce)')
    const still = () => motionQ.matches
    const el = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); if (parent) parent.appendChild(e); return e }
    const txt = (parent, x, y, s, cls, extra = {}) => { const t = el('text', { x, y, class: cls, ...extra }, parent); t.textContent = s; return t }
    const clip = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s }
    const when = at => { const t = Date.parse(at || ''); return isNaN(t) ? String(at || '') : new Date(t).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC' }
    const money = n => typeof n === 'number' ? '$' + n.toFixed(4) : ''

    // ---------- data ----------
    const INDEX = (() => { try { return JSON.parse((document.getElementById('xray-index') || {}).textContent || '[]') } catch { return [] } })()
    const cache = new Map()
    const load = slug => cache.get(slug) || (cache.set(slug, fetch(`${up}data/xray/${encodeURIComponent(slug)}/xray.json`).then(r => { if (!r.ok) throw new Error(r.status); return r.json() })), cache.get(slug))
    const norm = s => String(s || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '')
    const lev = (a, b) => { const d = Array.from({ length: b.length + 1 }, (_, i) => i); for (let i = 1; i <= a.length; i++) { let p = d[0]; d[0] = i; for (let j = 1; j <= b.length; j++) { const q = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, p + (a[i - 1] === b[j - 1] ? 0 : 1)); p = q } } return d[b.length] }
    // the best prepared subject for what was typed, or null: exact, then prefix, then contained, then a typo or two
    function match(q) {
        const n = norm(q); if (n.length < 2) return null
        let best = null, score = Infinity
        for (const s of INDEX) for (const k of [norm(s.subject), norm(s.slug)]) {
            let v = k === n ? 0 : k.startsWith(n) && n.length >= 3 ? 1 : n.startsWith(k) && k.length >= 4 ? 2 : (k.includes(n) && n.length >= 4) ? 3 : 10 + lev(n, k)
            if (v >= 10 && v - 10 > Math.max(1, Math.floor(k.length / 4))) continue
            if (v < score) { score = v; best = s }
        }
        return best
    }
    // The booth's request path (WS-194, Silvio's team): not wired yet. It stores nothing anywhere (no localStorage of
    // what was typed, no network call) and never collects an email. WS-194 wires it to the real request queue.
    function requestXray(subject) { void subject; return { status: 'not-wired' } }

    // ---------- the timeline: events at times, frame functions, and particles along paths ----------
    function Timeline() {
        const ev = [], frames = [], parts = []
        let raf = 0, t0 = 0, dead = false, end = 0, instant = false, onEnd = null
        const api = {
            get instant() { return instant },
            at(ms, fn) { ev.push({ ms, fn }); end = Math.max(end, ms); return api },
            frame(fn) { frames.push(fn); return api },
            particle(layer, path, dur, cls, onArrive) {
                if (instant || dead) { if (onArrive) onArrive(); return }
                const c = el('circle', { r: cls === 'big' ? 9 : 6, class: 'xr-p ' + (cls || '') }, layer)
                parts.push({ c, path, len: path.getTotalLength(), dur, s: performance.now() - t0, onArrive })
            },
            start(done) {
                onEnd = done; ev.sort((a, b) => a.ms - b.ms)
                if (still()) return api.finish()
                t0 = performance.now()
                const tick = now => {
                    if (dead) return
                    const t = now - t0
                    while (ev.length && ev[0].ms <= t) ev.shift().fn(t)
                    for (const f of frames) f(t)
                    for (let i = parts.length - 1; i >= 0; i--) {
                        const p = parts[i], k = Math.min(1, (t - p.s) / p.dur), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
                        const pt = p.path.getPointAtLength(e * p.len); p.c.setAttribute('cx', pt.x); p.c.setAttribute('cy', pt.y)
                        if (k >= 1) { p.c.remove(); parts.splice(i, 1); if (p.onArrive) p.onArrive() }
                    }
                    if (ev.length || parts.length || t < end) raf = requestAnimationFrame(tick)
                    else if (onEnd) { const f = onEnd; onEnd = null; f() }
                }
                raf = requestAnimationFrame(tick)
                return api
            },
            finish() {   // the end state at once (reduced motion)
                instant = true; ev.sort((a, b) => a.ms - b.ms)
                for (const f of frames) f(Infinity)
                while (ev.length) ev.shift().fn(Infinity)
                for (const p of parts.splice(0)) { p.c.remove(); if (p.onArrive) p.onArrive() }
                if (onEnd) { const f = onEnd; onEnd = null; f() }
                return api
            },
            stop() { dead = true; cancelAnimationFrame(raf); for (const p of parts.splice(0)) p.c.remove() },
        }
        return api
    }

    // ---------- the mini agents ----------
    function bot(g, x, y, s, kind) {
        const b = el('g', { class: 'xr-bot xr-bot-' + kind, transform: `translate(${x} ${y}) scale(${s})` }, g)
        el('circle', { class: 'xr-halo', r: 34 }, b)
        el('line', { x1: 0, y1: -24, x2: 0, y2: -34, class: 'xr-ant' }, b)
        el('circle', { cx: 0, cy: -37, r: 4.5, class: 'xr-ant-ball' }, b)
        el('rect', { x: -22, y: -24, width: 44, height: 34, rx: 11, class: 'xr-head' }, b)
        el('rect', { x: -15, y: -16, width: 30, height: 16, rx: 7, class: 'xr-visor' }, b)
        el('circle', { cx: -7, cy: -8, r: 3.4, class: 'xr-eye' }, b)
        el('circle', { cx: 7, cy: -8, r: 3.4, class: 'xr-eye' }, b)
        el('rect', { x: -16, y: 13, width: 32, height: 17, rx: 6, class: 'xr-body' }, b)
        if (kind === 'orch') el('path', { d: 'M-14 -24 L-9 -32 L-3 -26 L0 -33 L3 -26 L9 -32 L14 -24 Z', class: 'xr-crown' }, b)
        if (kind === 'coll') el('path', { d: 'M-20 18 h40 l-5 14 h-30 Z', class: 'xr-basket' }, b)
        return b
    }
    function vault(g, x, y, s) {
        const v = el('g', { class: 'xr-vault', transform: `translate(${x} ${y}) scale(${s})` }, g)
        el('rect', { x: -40, y: -40, width: 80, height: 80, rx: 12, class: 'xr-vault-box' }, v)
        const door = el('g', { class: 'xr-vault-door' }, v)
        el('circle', { r: 24, class: 'xr-vault-dial' }, door)
        for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; el('line', { x1: Math.cos(a) * 8, y1: Math.sin(a) * 8, x2: Math.cos(a) * 20, y2: Math.sin(a) * 20, class: 'xr-vault-spoke' }, door) }
        el('rect', { x: 32, y: -14, width: 6, height: 28, rx: 3, class: 'xr-vault-hinge' }, v)
        return v
    }

    // ---------- the run network: orchestrator, search agents, collector, vault ----------
    function netLayout(n, narrow) {
        if (narrow) {
            const rows = Math.ceil(n / 2), H = 360 + rows * 150 + 170
            return { narrow, w: 600, h: H, s: 1.05, O: { x: 300, y: 85 }, C: { x: 300, y: H - 210 }, V: { x: 300, y: H - 70 }, card: { w: 270, h: 136 },
                A: Array.from({ length: n }, (_, i) => ({ x: n === 1 ? 300 : i % 2 ? 448 : 152, y: 270 + Math.floor(i / 2) * 150 })) }
        }
        const gap = Math.min(128, 470 / Math.max(1, n - 1 || 1)), H = 600
        return { narrow, w: 1000, h: H, s: 1.15, O: { x: 105, y: H / 2 }, C: { x: 770, y: H / 2 }, V: { x: 918, y: H / 2 }, card: { w: 240, h: 116 },
            A: Array.from({ length: n }, (_, i) => ({ x: 450, y: H / 2 + (i - (n - 1) / 2) * gap })) }
    }
    const curve = (a, b, vertical) => vertical ? `M${a.x},${a.y} C${a.x},${(a.y + b.y) / 2} ${b.x},${(a.y + b.y) / 2} ${b.x},${b.y}` : `M${a.x},${a.y} C${(a.x + b.x) / 2},${a.y} ${(a.x + b.x) / 2},${b.y} ${b.x},${b.y}`
    function drawNet(svg, agents, narrow) {
        svg.textContent = ''
        const L = netLayout(agents.length, narrow)
        svg.setAttribute('viewBox', `0 0 ${L.w} ${L.h}`)
        svg.classList.toggle('narrow', narrow)
        const defs = el('defs', {}, svg)
        const pat = el('pattern', { id: 'xr-grid-' + (narrow ? 'n' : 'w'), width: 40, height: 40, patternUnits: 'userSpaceOnUse' }, defs)
        el('path', { d: 'M40 0H0V40', class: 'xr-gridline' }, pat)
        el('rect', { x: 0, y: 0, width: L.w, height: L.h, fill: `url(#xr-grid-${narrow ? 'n' : 'w'})`, class: 'xr-gridbg' }, svg)
        const wires = el('g', { class: 'xr-wires' }, svg), layer = el('g', { class: 'xr-parts' }, svg), nodes = el('g', {}, svg)
        const cw = L.card.w, ch = L.card.h
        const inP = [], outP = [], cards = []
        agents.forEach((a, i) => {
            const P = L.A[i]
            const enter = narrow ? { x: P.x, y: P.y - ch / 2 } : { x: P.x - cw / 2, y: P.y }, leave = narrow ? { x: P.x, y: P.y + ch / 2 } : { x: P.x + cw / 2, y: P.y }
            inP.push(el('path', { d: curve(narrow ? { x: L.O.x, y: L.O.y + 50 } : { x: L.O.x + 50, y: L.O.y }, enter, narrow), class: 'xr-wire', pathLength: 1 }, wires))
            outP.push(el('path', { d: curve(leave, narrow ? { x: L.C.x, y: L.C.y - 50 } : { x: L.C.x - 50, y: L.C.y }, narrow), class: 'xr-wire', pathLength: 1 }, wires))
            const g = el('g', { class: 'xr-card' }, nodes)
            el('rect', { x: P.x - cw / 2, y: P.y - ch / 2, width: cw, height: ch, rx: 18, class: 'xr-card-bg' }, g)
            bot(g, P.x - cw / 2 + 38, P.y + 8, .74, 'search')
            const tx = P.x - cw / 2 + 80
            const k = narrow ? 1.12 : 1
            txt(g, tx, P.y - ch / 2 + 30 * k, clip(a.label || a.id, 15), 'xr-card-t')
            txt(g, tx, P.y - ch / 2 + 52 * k, clip(a.model || '', 20), 'xr-card-m')
            const cnt = txt(g, tx, P.y - ch / 2 + 80 * k, '', 'xr-card-c')
            const tim = txt(g, tx, P.y - ch / 2 + 103 * k, '', 'xr-card-ms')
            cards.push({ g, cnt, tim })
        })
        const vPath = el('path', { d: narrow ? `M${L.C.x},${L.C.y + 46} L${L.V.x},${L.V.y - 46}` : `M${L.C.x + 46},${L.C.y} L${L.V.x - 46},${L.V.y}`, class: 'xr-wire', pathLength: 1 }, wires)
        const og = el('g', { class: 'xr-hub' }, nodes); bot(og, L.O.x, L.O.y, L.s * 1.2, 'orch'); txt(og, L.O.x, L.O.y + (narrow ? -10 : 66), 'Orchestrator', 'xr-hub-t', { 'text-anchor': narrow ? 'start' : 'middle', ...(narrow ? { x: L.O.x + 56 } : {}) })
        const cg = el('g', { class: 'xr-hub' }, nodes); bot(cg, L.C.x, L.C.y, L.s * 1.2, 'coll'); txt(cg, narrow ? L.C.x + 56 : L.C.x, narrow ? L.C.y - 10 : L.C.y + 70, 'Collector', 'xr-hub-t', { 'text-anchor': narrow ? 'start' : 'middle' })
        const cc = txt(cg, narrow ? L.C.x + 56 : L.C.x, narrow ? L.C.y + 18 : L.C.y + 96, '', 'xr-hub-c', { 'text-anchor': narrow ? 'start' : 'middle' })
        const vg = el('g', { class: 'xr-hub' }, nodes); const vv = vault(vg, L.V.x, L.V.y, L.s * .9); txt(vg, narrow ? L.V.x + 56 : L.V.x, narrow ? L.V.y - 6 : L.V.y + 66, 'Vault', 'xr-hub-t', { 'text-anchor': narrow ? 'start' : 'middle' })
        const vc = txt(vg, narrow ? L.V.x + 56 : L.V.x, narrow ? L.V.y + 22 : L.V.y + 92, '', 'xr-hub-c', { 'text-anchor': narrow ? 'start' : 'middle' })
        return { svg, layer, inP, outP, vPath, cards, og, cg, cc, vg, vv, vc }
    }

    // ---------- the graph of an X-ray ----------
    function buildGraph(x) {
        const N = [], E = [], SRC = Object.fromEntries((x.sources || []).map(s => [s.id, s]))
        const C = { x: 500, y: 500 }
        const ucs = x.use_cases || [], agents = (x.agents || []).slice()
        const ucsOf = id => ucs.filter(u => u.agent === id)
        const orphanUc = ucs.filter(u => !agents.some(a => a.id === u.agent))
        if (orphanUc.length) agents.push({ id: '__other', name: 'Other use cases', what: '', actions: [], _virtual: true })
        const units = a => Math.max(4, (a.id === '__other' ? orphanUc : ucsOf(a.id)).reduce((k, u) => k + Math.max(1, (u.reach || []).length), 0))
        const total = agents.reduce((k, a) => k + units(a), 0) || 1
        const pol = (r, a) => ({ x: C.x + r * Math.cos(a), y: C.y + r * Math.sin(a) })
        const gapIds = u => new Set((u.gap || []).flatMap(g => g.reach || []))
        N.push({ id: 'subject', type: 'subject', label: x.subject, ...C, r: 62, stage: 0, data: x, srcs: (x.what_it_does || {}).sources || [] })
        let a0 = -Math.PI / 2
        for (const a of agents) {
            const span = units(a) / total * Math.PI * 2, mid = a0 + span / 2
            const an = { id: 'agent:' + a.id, type: 'agent', label: a.name, ...pol(agents.length === 1 ? 0.01 : 195, mid), r: 34, stage: 1, data: a, srcs: a.sources || [], ang: mid }
            if (!a._virtual) { N.push(an); E.push(['subject', an.id, 1]) }
            const list = a.id === '__other' ? orphanUc : ucsOf(a.id)
            let b0 = a0
            for (const u of list) {
                const uspan = Math.max(1, (u.reach || []).length) / units(a) * span, um = b0 + uspan / 2
                const un = { id: 'uc:' + u.id, type: 'uc', label: u.name, ...pol(325, um), r: 26, stage: 2, data: u, srcs: [], ang: um }
                N.push(un); E.push([a._virtual ? 'subject' : an.id, un.id, 2])
                const gi = gapIds(u), rs = u.reach || []
                rs.forEach((r, k) => {
                    const ra = b0 + (k + .5) / rs.length * uspan
                    const rn = { id: `reach:${u.id}:${r.id}`, type: 'reach', label: r.what, kind: r.kind, gap: gi.has(r.id), ...pol(425 + (k % 2) * 34, ra), r: 15, stage: 3, data: r, uc: u, srcs: r.sources || [], ang: ra }
                    N.push(rn); E.push([un.id, rn.id, 3])
                })
                b0 += uspan
            }
            a0 += span
        }
        // sources: satellites on the outer ring, near what cites them, spread so they never sit on each other
        const cites = id => N.filter(n => (n.srcs || []).includes(id))
        const sl = (x.sources || []).map((s, i) => { const by = cites(s.id); const ang = by.length ? Math.atan2(by.reduce((k, n) => k + Math.sin(n.ang ?? 0), 0), by.reduce((k, n) => k + Math.cos(n.ang ?? -Math.PI / 2), 0)) : i / Math.max(1, (x.sources || []).length) * Math.PI * 2; return { s, by, ang } })
        sl.sort((a, b) => a.ang - b.ang)
        const gapA = Math.min(Math.PI * 2 / Math.max(1, sl.length), .16)
        for (let i = 1; i < sl.length; i++) if (sl[i].ang < sl[i - 1].ang + gapA) sl[i].ang = sl[i - 1].ang + gapA
        if (sl.length > 1) { const over = sl[sl.length - 1].ang - (sl[0].ang + Math.PI * 2 - gapA); if (over > 0) sl.forEach((q, i) => { q.ang -= over * i / (sl.length - 1) }) }
        for (const q of sl) {
            const sn = { id: 'src:' + q.s.id, type: 'source', label: q.s.id, kind: q.s.kind, ...pol(520, q.ang), r: 9, stage: 4, data: q.s, srcs: [] }
            N.push(sn); for (const n of q.by) E.push([n.id, sn.id, 4, 'cite'])
        }
        return { N, E, SRC }
    }
    function drawGraph(svg, x, onPick) {
        svg.textContent = ''
        svg.setAttribute('viewBox', '-150 -50 1300 1100')
        const { N, E, SRC } = buildGraph(x), byId = Object.fromEntries(N.map(n => [n.id, n]))
        const defs = el('defs', {}, svg)
        const rg = el('radialGradient', { id: 'xr-core' }, defs); el('stop', { offset: '0', class: 'xr-core-a' }, rg); el('stop', { offset: '1', class: 'xr-core-b' }, rg)
        for (const r of [195, 325, 440, 520]) el('circle', { cx: 500, cy: 500, r, class: 'xr-orbit' }, svg)
        const scan = el('g', { class: 'xr-scan' }, svg); el('path', { d: 'M500 500 L500 -40 A540 540 0 0 1 882 118 Z', class: 'xr-scan-beam' }, scan)
        const eg = el('g', {}, svg), ng = el('g', {}, svg)
        const edges = E.map(([a, b, st, kind]) => ({ st, b, e: el('path', { d: `M${byId[a].x},${byId[a].y} L${byId[b].x},${byId[b].y}`, class: 'xg-e' + (kind ? ' xg-cite' : '') + (byId[b].gap ? ' xg-gap' : ''), pathLength: 1 }, eg) }))
        const els = new Map()
        for (const n of N) {
            const g = el('g', { class: `xg-n xg-${n.type}${n.kind ? ' xr-k-' + n.kind : ''}${n.gap ? ' gap' : ''}`, tabindex: 0, role: 'button', 'aria-label': `${n.type === 'uc' ? 'use case' : n.type}: ${n.label}${n.gap ? ' (in the gap)' : ''}`, style: `transform-origin:${n.x}px ${n.y}px` }, ng)
            if (n.type === 'subject') { el('circle', { cx: n.x, cy: n.y, r: n.r + 22, class: 'xg-pulse' }, g); el('circle', { cx: n.x, cy: n.y, r: n.r, fill: 'url(#xr-core)', class: 'xg-dot' }, g) }
            else el('circle', { cx: n.x, cy: n.y, r: n.r, class: 'xg-dot' }, g)
            if (n.gap) el('circle', { cx: n.x, cy: n.y, r: n.r + 8, class: 'xg-gapring' }, g)
            el('circle', { cx: n.x, cy: n.y, r: Math.max(n.r + 14, 30), class: 'xg-hit' }, g)
            if (n.type === 'subject') txt(g, n.x, n.y + 10, clip(n.label, 14), 'xg-l xg-l-subject', { 'text-anchor': 'middle' })
            else if (n.type === 'agent' || n.type === 'uc') {
                const out = n.type === 'uc' ? 1 : 0, ang = n.ang ?? 0, right = Math.cos(ang) >= 0
                const lone = n.type === 'agent' && Math.abs(Math.cos(ang)) < .35   // an agent straight above or below: its label sits under it
                const lx = lone ? n.x : n.x + (right ? 1 : -1) * (n.r + 10), ly = lone ? n.y + (Math.sin(ang) < 0 ? -n.r - 14 : n.r + 32) : n.y + 9
                txt(g, lx, ly, clip(n.label, 17), 'xg-l xg-l-' + n.type, { 'text-anchor': lone ? 'middle' : right ? 'start' : 'end' }); void out
            } else if (n.type === 'reach') txt(g, n.x, n.y + 7, (n.kind || '?').slice(0, 1).toUpperCase(), 'xg-l xg-l-reach', { 'text-anchor': 'middle' })
            else txt(g, n.x, n.y + 4, '', 'xg-l')
            const pick = () => { svg.querySelectorAll('.xg-n.sel').forEach(e => e.classList.remove('sel')); g.classList.add('sel'); onPick && onPick(n, SRC) }
            g.addEventListener('click', pick)
            g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick() } })
            els.set(n.id, g)
        }
        const show = n => { els.get(n.id).classList.add('on'); for (const ed of edges) if (ed.b === n.id) ed.e.classList.add('on') }
        return {
            N, SRC,
            reset() { svg.classList.add('growing'); els.forEach(g => g.classList.remove('on', 'sel')); edges.forEach(e => e.e.classList.remove('on')) },
            show, all() { N.forEach(show); svg.classList.remove('growing') }, done() { svg.classList.remove('growing') },
            pick(id) { const g = els.get(id); if (g) g.dispatchEvent(new Event('click')) },
        }
    }
    // what a tapped node says, with its sources
    function detailHtml(n, SRC) {
        const srcs = ids => (ids || []).filter(id => SRC[id]).map(id => { const s = SRC[id]; return `<li><b>${esc(id)}</b> ${okUrl(s.url) ? `<a href="${esc(s.url)}" rel="noopener">${esc(s.title || s.url)}</a>` : esc(s.title || s.url)}<br><span>${esc(s.publisher || '')}${s.publisher ? ', ' : ''}${esc(s.kind || 'other')}, read ${esc(s.read_on || '?')}</span></li>` }).join('')
        const ul = (h, xs) => xs && xs.length ? `<h4>${h}</h4><ul>${xs.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''
        const d = n.data, S = ids => { const h = srcs(ids); return h ? `<h4>Sources</h4><ul class="xr-d-src">${h}</ul>` : '' }
        if (n.type === 'subject') return `<p class="xr-d-k">The subject</p><h3>${esc(d.subject)}</h3><p>${esc(d.tagline || '')}</p><p>${esc((d.what_it_does || {}).text || '')}</p>${S((d.what_it_does || {}).sources)}`
        if (n.type === 'agent') return `<p class="xr-d-k">Its AI agent</p><h3>${esc(d.name)}</h3><p>${esc(d.what || '')}</p>${ul('What it can do', d.actions)}${S(d.sources)}`
        if (n.type === 'uc') return `<p class="xr-d-k">A use case</p><h3>${esc(d.name)}</h3>${d.who ? `<p>Who uses it: ${esc(d.who)}</p>` : ''}${ul('Mandate (illustrative)', (d.mandate || []).map(m => m.what))}${ul('Gap: reach beyond the mandate', (d.gap || []).map(g => g.what))}${ul('Controls that publicly stand in the way', (d.controls || []).map(c => c.what))}${S((d.controls || []).flatMap(c => c.sources || []))}`
        if (n.type === 'reach') return `<p class="xr-d-k">Reach · <span class="xr-kind xr-k-${esc(n.kind)}">${esc(KIND_WORD[n.kind] || n.kind)}</span></p><h3>${esc(d.what)}</h3><p>In the use case: ${esc(n.uc.name)}.</p><p>${n.gap ? '<b class="xr-d-gap">In the gap:</b> reach beyond the mandate, authority nobody accepted.' : 'Within what the mandate covers, or not named in the gap.'}</p>${S(d.sources)}`
        return `<p class="xr-d-k">Source · ${esc(d.kind || 'other')}</p><h3>${esc(d.title || d.url)}</h3><p>${esc(d.publisher || '')}${d.read_on ? ` · read ${esc(d.read_on)}` : ''}</p>${okUrl(d.url) ? `<p><a href="${esc(d.url)}" rel="noopener">${esc(d.url)}</a></p>` : ''}`
    }

    // ---------- the replay of a run (or the dispatch alone, for a name that is not X-rayed yet) ----------
    function replay({ netSvg, graph, log, name, x, onDone }) {
        const real = x && x.run && (x.run.agents || []).length ? x.run.agents : null
        const agents = real || DEFAULT_AGENTS
        const narrow = netSvg.parentElement.clientWidth < 620
        const net = drawNet(netSvg, agents, narrow)
        const T = Timeline()
        const say = (ms, s, cls) => T.at(ms, () => { const li = document.createElement('li'); if (cls) li.className = cls; li.textContent = s; log.appendChild(li); while (log.children.length > 7) log.firstChild.remove() })
        log.textContent = ''
        if (graph) graph.reset()
        T.at(0, () => net.og.classList.add('live'))
        say(0, `Orchestrator: dispatching "${name}" to ${agents.length} search agents.`)
        if (graph && x) T.at(300, () => graph.show(graph.N[0]))
        const D0 = 650
        agents.forEach((a, i) => T.at(D0 + i * 140, () => { net.inP[i].classList.add('on'); T.particle(net.layer, net.inP[i], 650, 'big', () => net.cards[i].g.classList.add('live')) }))
        const searchStart = D0 + 700
        if (!real) {   // not X-rayed: the agents are shown the name, and nothing more happens; we say so
            agents.forEach((a, i) => T.at(searchStart + i * 140, () => { net.cards[i].cnt.textContent = 'not run yet' }))
            T.at(searchStart + 1900, () => { net.cards.forEach(c => c.g.classList.replace('live', 'idle')); net.og.classList.remove('live') })
            say(searchStart + 1900, `"${name}" is not X-rayed yet: no search was run, nothing was stored or sent.`, 'warn')
            T.at(searchStart + 2300, () => {})
            return T.start(() => onDone && onDone(false))
        }
        const maxMs = Math.max(...agents.map(a => a.ms || 1000)), scale = 6200 / maxMs
        let ends = 0, inCount = 0
        const totalCit = agents.reduce((k, a) => k + (a.citations || 0), 0)
        agents.forEach((a, i) => {
            const s = searchStart + i * 140, d = Math.max(900, (a.ms || 1000) * scale), c = a.citations || 0, card = net.cards[i]
            let shown = -1, sent = 0
            ends = Math.max(ends, s + d)
            T.frame(t => {
                if (t < s) return
                const p = Math.min(1, (t - s) / d), n = Math.floor(p * c)
                if (n !== shown) {
                    for (let k = Math.max(0, shown); k < n && sent < 14; k++, sent++) T.particle(net.layer, net.outP[i], 900, 'k', () => { inCount++; net.cc.textContent = `${Math.min(inCount, totalCit)} citations in` })
                    shown = n; card.cnt.textContent = `${n} citation${n === 1 ? '' : 's'}`
                }
                card.tim.textContent = ((a.ms || 0) * p / 1000).toFixed(1) + ' s'
                if (p >= 1 && !card.g.classList.contains('done')) { card.g.classList.add('done'); net.outP[i].classList.add('on'); card.cnt.textContent = `${c} citations`; card.tim.textContent = `${((a.ms || 0) / 1000).toFixed(1)} s · ${a.leads ?? '?'} leads` }
            })
            T.at(s + d, () => {})
            say(s + d, `${a.label || a.id} (${a.model || 'model unknown'}): ${c} citations, ${a.leads ?? '?'} leads, in ${((a.ms || 0) / 1000).toFixed(1)} s.`)
        })
        // the graph grows while the agents search: agents, use cases, reach; the sources once the collector has read them
        const N = graph ? graph.N : [], body = N.filter(n => n.stage >= 1 && n.stage <= 3), srcs = N.filter(n => n.stage === 4)
        body.forEach((n, k) => T.at(searchStart + 400 + k / Math.max(1, body.length) * (ends - searchStart - 400), () => graph.show(n)))
        const nS = (x.sources || []).length, conf = (x.leads || []).filter(l => l.status === 'confirmed').length
        T.at(ends + 300, () => { net.cc.textContent = `${totalCit} citations in`; net.cg.classList.add('live'); net.vPath.classList.add('on') })
        say(ends + 300, `Collector: read the sources behind the leads; ${nS} sources kept, ${conf} of ${(x.leads || []).length} leads confirmed.`)
        for (let k = 0; k < 6; k++) T.at(ends + 400 + k * 160, () => T.particle(net.layer, net.vPath, 600, 'v'))
        srcs.forEach((n, k) => T.at(ends + 500 + k / Math.max(1, srcs.length) * 1200, () => graph.show(n)))
        T.at(ends + 1900, () => { net.vg.classList.add('sealed'); net.vc.textContent = `${nS} sources sealed`; net.cg.classList.remove('live'); net.og.classList.remove('live'); if (graph) graph.done() })
        say(ends + 1900, `Vault: ${nS} sources sealed, each with its URL and the date read.${typeof x.run.cost_usd === 'number' ? ` Run cost ${money(x.run.cost_usd)}.` : ''}`, 'ok')
        T.at(ends + 2300, () => {})
        return T.start(() => onDone && onDone(true))
    }

    // ---------- the simulation player: each action placed against the mandate, and the record it leaves ----------
    function simPlayer(host, x) {
        const ucs = (x.use_cases || []).filter(u => (u.simulation || []).length)
        if (!ucs.length) return
        host.innerHTML = `<div class="xr-sim-head"><h2 class="xr-h">The simulation: each action, placed against the mandate</h2><p class="xr-cap">RiskMandate is ${esc(RM.path)}. It does not stop an action: it ${esc(RM.does)}. The mandate here is illustrative.</p>
<div class="xr-tabs" role="group" aria-label="Use cases">${ucs.map((u, i) => `<button type="button" class="xr-tab" data-i="${i}" aria-pressed="${i ? 'false' : 'true'}">${esc(u.name)}</button>`).join('')}</div></div>
<div class="xr-sim-body"><div class="xr-ring-wrap"><svg class="xr-ring" viewBox="0 0 600 600" role="img" aria-label="The mandate ring: actions inside it are within the mandate, actions outside it are in the gap"></svg></div>
<div class="xr-sim-side"><div class="xr-ctl" role="group" aria-label="Simulation controls"><button type="button" data-play>▶ Play</button><button type="button" data-step>Step</button><button type="button" data-reset>↺ Restart</button></div>
<ol class="xr-steps"></ol><div class="xr-record"><h3>The record</h3><p class="xr-tally"></p><ol aria-live="polite"></ol></div></div></div>`
        const svg = host.querySelector('.xr-ring'), stepsEl = host.querySelector('.xr-steps'), rec = host.querySelector('.xr-record ol'), tally = host.querySelector('.xr-tally')
        const playB = host.querySelector('[data-play]')
        let u = null, i = 0, timer = 0, dots = [], trail = null, pts = []
        const stop = () => { clearInterval(timer); timer = 0; playB.textContent = '▶ Play'; playB.setAttribute('aria-pressed', 'false') }
        function setup(k) {
            stop(); u = ucs[k]; i = 0; svg.textContent = ''; rec.textContent = ''; dots = []; pts = []
            host.querySelectorAll('.xr-tab').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.i === k)))
            el('circle', { cx: 300, cy: 300, r: 288, class: 'xr-zone-gap' }, svg)
            txt(svg, 300, 46, 'THE GAP: reach beyond the mandate', 'xr-zone-t xr-zone-t-gap', { 'text-anchor': 'middle' })
            el('circle', { cx: 300, cy: 300, r: 150, class: 'xr-zone-mandate' }, svg)
            txt(svg, 300, 180, 'THE MANDATE', 'xr-zone-t', { 'text-anchor': 'middle' })
            const ag = el('g', {}, svg); bot(ag, 300, 304, 1, 'search')
            trail = el('polyline', { points: '300,300', class: 'xr-trail' }, svg)
            const sim = u.simulation, ins = sim.filter(s => s.in_mandate), outs = sim.filter(s => !s.in_mandate)
            sim.forEach((st, k) => {
                const grp = st.in_mandate ? ins : outs, j = grp.indexOf(st), n = grp.length
                const a = (st.in_mandate ? -Math.PI * .85 : -Math.PI * .1) + (j + .5) / n * (st.in_mandate ? Math.PI * 1.7 : Math.PI * 1.2) * (n > 1 ? 1 : 0) + (n > 1 ? 0 : Math.PI * (st.in_mandate ? .85 : .6))
                const r = st.in_mandate ? 92 + (j % 2) * 26 : 212 + (j % 2) * 28
                const p = { x: 300 + r * Math.cos(a), y: 300 + r * Math.sin(a) }
                pts.push(p)
                const g = el('g', { class: 'xr-step ' + (st.in_mandate ? 'in' : 'out') }, svg)
                g.style.transform = 'translate(300px,300px) scale(.2)'
                const inner = el('g', {}, g)
                if (!st.in_mandate) el('circle', { r: 30, class: 'xr-step-glow' }, inner)
                el('circle', { r: 21, class: 'xr-step-dot' }, inner)
                txt(inner, 0, 8, String(k + 1), 'xr-step-n', { 'text-anchor': 'middle' })
                dots.push({ g, p })
            })
            stepsEl.innerHTML = sim.map((st, k) => { const r = (u.reach || []).find(q => q.id === st.reach); return `<li class="${st.in_mandate ? 'in' : 'out'}" data-k="${k}"><b>${esc(st.action)}</b><span>${r ? `reaches ${esc(r.what)} · ` : ''}${st.in_mandate ? 'inside the mandate' : 'outside the mandate: in the gap'}</span></li>` }).join('')
            count()
        }
        const count = () => { const done = u.simulation.slice(0, i); tally.textContent = `${done.length} of ${u.simulation.length} actions placed · ${done.filter(s => s.in_mandate).length} in the mandate · ${done.filter(s => !s.in_mandate).length} in the gap` }
        function step() {
            if (!u || i >= u.simulation.length) { stop(); return false }
            const st = u.simulation[i], d = dots[i], r = (u.reach || []).find(q => q.id === st.reach)
            d.g.style.transform = `translate(${d.p.x}px,${d.p.y}px) scale(1)`; d.g.classList.add('on')
            trail.setAttribute('points', ['300,300', ...pts.slice(0, i + 1).map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)].join(' '))
            stepsEl.querySelectorAll('li').forEach(li => li.classList.toggle('cur', +li.dataset.k === i))
            stepsEl.querySelector(`li[data-k="${i}"]`).classList.add('seen')
            const li = document.createElement('li'); li.className = st.in_mandate ? 'in' : 'out'
            li.innerHTML = `<span class="xr-rec-t">t${esc(st.t ?? i + 1)}</span> <b>${esc(st.action)}</b><br>${r ? `reaches ${esc(r.what)} <span class="xr-kind xr-k-${esc(r.kind)}">${esc(r.kind)}</span> · ` : ''}${st.in_mandate ? 'within the mandate' : '<b class="xr-d-gap">outside the mandate: in the gap</b>'}${st.note ? `<br><i>What RiskMandate's record shows:</i> ${esc(st.note)}` : ''}`
            rec.appendChild(li); i++; count()
            return true
        }
        const play = () => { if (i >= u.simulation.length) setup(ucs.indexOf(u)); if (still()) { while (step()); return } playB.textContent = '❚❚ Pause'; playB.setAttribute('aria-pressed', 'true'); step(); timer = setInterval(() => { if (!step()) stop() }, 1500) }
        playB.onclick = () => timer ? stop() : play()
        host.querySelector('[data-step]').onclick = () => { stop(); if (i >= u.simulation.length) setup(ucs.indexOf(u)); step() }
        host.querySelector('[data-reset]').onclick = () => setup(ucs.indexOf(u))
        host.querySelectorAll('.xr-tab').forEach(b => b.onclick = () => setup(+b.dataset.i))
        setup(0)
        return { play, setup }
    }

    // ---------- shared pieces of the stage ----------
    const stageTop = right => `<div class="xr-top"><span class="xr-brand"><span class="xr-logo" aria-hidden="true"></span>RiskMandate <b>X-ray</b></span>${right || ''}</div>`
    const runHtml = `<p class="xr-replay"></p><div class="xr-panes"><div class="xr-net-wrap"><svg class="xr-net" role="img" aria-label="The run: an orchestrator, the search agents, a collector and a vault"></svg></div>
<div class="xr-graph-wrap"><svg class="xr-graph" role="group" aria-label="The graph of the X-ray: tap a node for its detail and its sources"></svg><div class="xr-legend" aria-hidden="true">${Object.keys(KIND_WORD).map(k => `<span class="xr-kind xr-k-${k}">${k}</span>`).join('')}<span class="xr-kind xr-gapk">gap</span></div></div></div>
<div class="xr-detail" aria-live="polite" hidden></div><ol class="xr-log" aria-live="polite" aria-label="The run, step by step"></ol>`
    const pickInto = det => (n, SRC) => { det.hidden = false; det.innerHTML = `<button type="button" class="xr-x" aria-label="Close the detail">×</button>${detailHtml(n, SRC)}`; det.querySelector('.xr-x').onclick = () => { det.hidden = true }; if (det.getBoundingClientRect().top > innerHeight) det.scrollIntoView({ block: 'nearest', behavior: still() ? 'auto' : 'smooth' }) }

    // ---------- /xray/<slug>/: the graph, the replay and the simulation ----------
    if (mount.dataset.mode === 'subject') {
        const slug = mount.dataset.slug
        mount.innerHTML = `<section class="xr-stage xr-subj" aria-label="The X-ray, drawn">${stageTop(`<span class="xr-acts"><button type="button" class="xr-btn" data-replay>▶ Replay the run</button><a class="xr-btn ghost" href="deck/index.html">Open the deck</a></span>`)}<div class="xr-run">${runHtml}</div><div class="xr-sim"></div></section>`
        const S = sel => mount.querySelector(sel)
        S('.xr-net-wrap').hidden = true; S('.xr-log').hidden = true
        load(slug).then(x => {
            const graph = drawGraph(S('.xr-graph'), x, pickInto(S('.xr-detail')))
            graph.all()
            S('.xr-replay').textContent = `${x.subject}: ${(x.agents || []).length} agents, ${(x.use_cases || []).length} use cases, ${(x.sources || []).length} sources read${x.read_on ? ' on ' + x.read_on : ''}. Tap a node.`
            simPlayer(S('.xr-sim'), x)
            let T = null
            S('[data-replay]').onclick = () => {
                if (T) T.stop()
                S('.xr-net-wrap').hidden = false; S('.xr-log').hidden = false; S('.xr-run').classList.add('playing')
                S('.xr-replay').textContent = x.run && x.run.at ? `Replay of the run of ${when(x.run.at)}` : 'Replay'
                T = replay({ netSvg: S('.xr-net'), graph, log: S('.xr-log'), name: x.subject, x, onDone: () => { graph.all() } })
            }
        }).catch(() => { S('.xr-replay').textContent = 'The X-ray data could not be loaded; everything is written out below.' })
        return
    }

    // ---------- /xray/: the input, the chips, the run, booth mode ----------
    const prepared = INDEX.filter(s => s.status === 'prepared')
    mount.innerHTML = `<section class="xr-stage xr-home" aria-label="RiskMandate X-ray">${stageTop('<button type="button" class="xr-btn ghost xr-booth-btn" aria-pressed="false">Booth mode</button>')}
<div class="xr-hero"><form class="xr-ask" role="search" autocomplete="off"><label for="xr-q" class="xr-q-label">Type a company, a use case or an industry</label>
<div class="xr-q-row"><span class="xr-q-scan" aria-hidden="true"></span><input id="xr-q" name="q" type="text" placeholder="e.g. Replit" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="go" maxlength="80"><button type="submit" class="xr-go">X-ray</button></div></form>
${INDEX.length ? `<div class="xr-chips" role="group" aria-label="Already X-rayed">${INDEX.map(s => `<button type="button" class="xr-chip" data-slug="${esc(s.slug)}"><b>${esc(s.subject)}</b><span>${esc(s.kind)}${s.status !== 'prepared' ? ' · ' + esc(s.status) : ''}</span></button>`).join('')}</div>` : ''}
<p class="xr-cap">What a model says is a lead; only facts whose sources we read reach the page. Nothing you type is stored or sent.</p></div>
<div class="xr-run" hidden>${runHtml}<div class="xr-result" hidden></div><p class="xr-again-row"><button type="button" class="xr-btn ghost xr-again">← X-ray another name</button></p></div></section>`
    const S = sel => mount.querySelector(sel)
    const stage = S('.xr-stage'), input = S('#xr-q'), runEl = S('.xr-run'), hero = S('.xr-hero'), result = S('.xr-result')
    let T = null, busy = false
    function reset(focus) {
        if (T) T.stop(); T = null; busy = false
        runEl.hidden = true; hero.hidden = false; result.hidden = true; result.textContent = ''; S('.xr-detail').hidden = true
        input.value = ''
        if (focus) input.focus({ preventScroll: true })
    }
    async function go(q) {
        q = String(q || '').trim(); if (!q) { input.focus(); return }
        if (T) T.stop()
        busy = true; hero.hidden = true; runEl.hidden = false; result.hidden = true; S('.xr-detail').hidden = true
        const hit = match(q)
        let x = null
        if (hit && hit.status === 'prepared') { try { x = await load(hit.slug) } catch { x = null } }
        const gw = S('.xr-graph-wrap')
        gw.hidden = !x
        S('.xr-replay').textContent = x ? (x.run && x.run.at ? `Replay of the run of ${when(x.run.at)}` : `The X-ray of ${x.subject}`) : `Dispatch: "${q}"`
        const graph = x ? drawGraph(S('.xr-graph'), x, pickInto(S('.xr-detail'))) : null
        stage.scrollIntoView({ block: 'start', behavior: still() ? 'auto' : 'smooth' })
        T = replay({ netSvg: S('.xr-net'), graph, log: S('.xr-log'), name: x ? x.subject : q, x, onDone: ok => {
            busy = false
            result.hidden = false
            if (ok) {
                const ucs = x.use_cases || [], gaps = ucs.reduce((k, u) => k + (u.gap || []).length, 0), reach = ucs.reduce((k, u) => k + (u.reach || []).length, 0)
                result.innerHTML = `<p class="xr-k">X-rayed</p><h2 class="xr-h">${esc(x.subject)}</h2><p class="xr-tag">${esc(x.tagline || '')}</p>
<ul class="xr-stats"><li><b>${(x.agents || []).length}</b>AI agents</li><li><b>${ucs.length}</b>use cases</li><li><b>${reach}</b>things they can reach</li><li class="gap"><b>${gaps}</b>in the gap</li><li><b>${(x.sources || []).length}</b>sources read</li>${typeof (x.run || {}).cost_usd === 'number' ? `<li><b>${money(x.run.cost_usd)}</b>run cost</li>` : ''}</ul>
<p class="xr-links"><a class="xr-btn" href="${up}xray/${encodeURIComponent(x.slug || hit.slug)}/index.html">Open the full X-ray →</a><a class="xr-btn ghost" href="${up}xray/${encodeURIComponent(x.slug || hit.slug)}/deck/index.html">Open the deck</a><a class="xr-btn ghost" href="${up}xray/${encodeURIComponent(x.slug || hit.slug)}/run/index.html">How it was made</a></p>`
            } else {
                const r = requestXray(q)
                result.innerHTML = `<p class="xr-k">Not X-rayed yet</p><h2 class="xr-h">${esc(q)}</h2><p class="xr-tag">Not on our list yet. Soon a name typed here becomes a request our agents run between visits, so you can come back in an hour; that path is being built now.</p><p class="xr-cap">${hit && hit.status !== 'prepared' ? `${esc(hit.subject)} is ${esc(hit.status)}, not ready yet. ` : ''}The request path from the booth is being built (WS-194); for now nothing was stored or sent (${esc(r.status)}).${prepared.length ? ' Try one that is ready:' : ''}</p>${prepared.length ? `<div class="xr-chips">${prepared.map(s => `<button type="button" class="xr-chip" data-slug="${esc(s.slug)}"><b>${esc(s.subject)}</b><span>${esc(s.kind)}</span></button>`).join('')}</div>` : ''}`
                result.querySelectorAll('.xr-chip').forEach(bindChip)
            }
            if (onRunEnd) onRunEnd()
        } })
    }
    const bindChip = b => b.addEventListener('click', () => { const s = INDEX.find(q => q.slug === b.dataset.slug); if (s) { input.value = s.subject; go(s.subject) } })
    S('.xr-ask').addEventListener('submit', e => { e.preventDefault(); go(input.value) })
    mount.querySelectorAll('.xr-hero .xr-chip').forEach(bindChip)
    S('.xr-again').addEventListener('click', () => reset(true))

    // booth mode: full screen, larger type, an attract loop after 60 s idle, back to the input on any touch
    let booth = false, idleT = 0, attract = false, attractI = 0, typeT = 0, onRunEnd = null
    const boothBtn = S('.xr-booth-btn')
    function setBooth(on, gesture) {
        booth = on; document.documentElement.classList.toggle('xr-booth-on', on); stage.classList.toggle('booth', on)
        boothBtn.setAttribute('aria-pressed', String(on)); boothBtn.textContent = on ? 'Exit booth mode' : 'Booth mode'
        if (on && gesture && stage.requestFullscreen && !document.fullscreenElement) stage.requestFullscreen().catch(() => {})
        if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {})
        arm()
    }
    function stopAttract() { if (!attract) return; attract = false; clearTimeout(typeT); onRunEnd = null; stage.classList.remove('attract'); reset(false) }
    function arm() { clearTimeout(idleT); if (booth && !attract) idleT = setTimeout(startAttract, 60000) }
    function startAttract() {
        if (!booth || busy || !prepared.length) return arm()
        attract = true; stage.classList.add('attract'); reset(false)
        const s = prepared[attractI++ % prepared.length]
        let k = 0
        const type = () => { if (!attract) return; input.value = s.subject.slice(0, ++k); if (k < s.subject.length) typeT = setTimeout(type, 110); else typeT = setTimeout(() => attract && go(s.subject), 500) }
        onRunEnd = () => { typeT = setTimeout(() => { if (attract) startAttract() }, 9000) }
        typeT = setTimeout(type, 600)
    }
    const touched = e => { if (attract && !(e.target.closest && e.target.closest('.xr-booth-btn'))) { stopAttract(); input.focus({ preventScroll: true }) } arm() }
    for (const ev of ['pointerdown', 'keydown']) document.addEventListener(ev, touched, true)
    input.addEventListener('input', arm)
    boothBtn.addEventListener('click', () => setBooth(!booth, true))
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && booth && !document.fullscreenElement) setBooth(false) })
    document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && booth && stage.dataset.fsAsked) setBooth(false) ; stage.dataset.fsAsked = document.fullscreenElement ? '1' : '' })
    if (new URLSearchParams(location.search).get('booth') === '1') setBooth(true, false)
})()
