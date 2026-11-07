// What happened: how an X-ray was made (xray@web-summit.dinis, 7 November 2026, at Dinis's word: "add a big section
// to visualise and explain everything that happened with those agentic calls"). On /xray/<slug>/run/: the fan-out from
// the typed name to the four search agents, the calls replayed as bars (all four start together; the clock shows the
// real seconds), the flow from each agent's leads to confirmed, not found and unverified, and the presenter mode ("Walk
// me through it": one step at a time, full screen, arrows, tap or swipe). On /xray/how/: the pipeline, animated.
// Everything drawn comes from the page itself (a JSON block the build wrote from the run's own files); every text is
// set with textContent; no libraries, no network calls. The page reads in full without this script.
(() => {
    'use strict'
    const NS = 'http://www.w3.org/2000/svg'
    const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); if (parent) parent.appendChild(e); return e }
    const txt = (parent, x, y, s, cls, extra = {}) => { const t = el('text', { x, y, class: cls, ...extra }, parent); t.textContent = s; return t }
    const tip = (node, s) => { const t = el('title', {}, node); t.textContent = s }
    const readJson = id => { try { return JSON.parse((document.getElementById(id) || {}).textContent || 'null') } catch { return null } }
    const short = l => String(l || '').replace(/ (web )?search$/i, '')
    // split text into lines of at most n characters, at most k lines
    const wrap = (s, n, k) => { const out = []; let cur = ''; for (const w of String(s || '').split(/\s+/)) { if ((cur + ' ' + w).trim().length > n && cur) { out.push(cur); cur = w } else cur = (cur + ' ' + w).trim() } if (cur) out.push(cur); if (out.length > k) { out.length = k; out[k - 1] = out[k - 1].replace(/.{0,2}$/, '') + '…' } return out }
    const quoted = ls => ls.map((l, i) => (i === 0 ? '"' : '') + l + (i === ls.length - 1 ? '"' : ''))
    const narrowOf = host => (host.clientWidth || window.innerWidth) < 640

    // ---------- a node-and-edge drawing, played step by step ----------
    // nodes: [{ id, x, y, w, h, t, s, cls }]; edges: [{ id, a, b, kind: h | hl | v | loop }]
    function drawFlow(host, W, H, nodes, edges) {
        host.textContent = ''
        const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' }, host)
        const linkG = el('g', {}, svg), dotG = el('g', {}, svg), nodeG = el('g', {}, svg)
        const N = Object.fromEntries(nodes.map(n => [n.id, n]))
        const P = {}, E = {}
        for (const e of edges) {
            const A = N[e.a], B = N[e.b]; let d
            if (e.kind === 'v') { const x0 = A.x + A.w / 2, y0 = A.y + A.h, x1 = B.x + B.w / 2, y1 = B.y, m = (y1 - y0) / 2; d = `M${x0},${y0} C${x0},${y0 + m} ${x1},${y1 - m} ${x1},${y1}` }
            else if (e.kind === 'hl') { const x0 = A.x, y0 = A.y + A.h / 2, x1 = B.x + B.w, y1 = B.y + B.h / 2, m = (x0 - x1) / 2; d = `M${x0},${y0} C${x0 - m},${y0} ${x1 + m},${y1} ${x1},${y1}` }
            else if (e.kind === 'loop') { const x0 = A.x + A.w, y0 = A.y + A.h / 2, x1 = B.x + B.w, y1 = B.y + B.h / 2, r = Math.max(x0, x1) + 70; d = `M${x0},${y0} C${r},${y0} ${r},${y1} ${x1},${y1}` }
            else { const x0 = A.x + A.w, y0 = A.y + A.h / 2, x1 = B.x, y1 = B.y + B.h / 2, m = (x1 - x0) / 2; d = `M${x0},${y0} C${x0 + m},${y0} ${x1 - m},${y1} ${x1},${y1}` }
            P[e.id] = el('path', { d, class: 'xr-svg-link' }, linkG)
        }
        for (const n of nodes) {
            const g = el('g', { class: `xr-svg-node ${n.cls || ''}` }, nodeG)
            el('rect', { x: n.x, y: n.y, width: n.w, height: n.h, rx: 12, class: 'xr-svg-n' }, g)
            if (n.color) el('rect', { x: n.x, y: n.y + 8, width: 6, height: n.h - 16, rx: 3, fill: n.color }, g)
            const lines = Array.isArray(n.t) ? n.t : [n.t], lh = n.fs ? n.fs * 1.25 : 19, sub = n.s ? 16 : 0
            const top = n.y + n.h / 2 - (lines.length * lh + sub) / 2 + lh * .78
            lines.forEach((l, i) => txt(g, n.x + n.w / 2, top + i * lh, l, 'xr-svg-t', { 'text-anchor': 'middle', ...(n.fs ? { style: `font-size:${n.fs}px` } : {}) }))
            if (n.s) txt(g, n.x + n.w / 2, top + lines.length * lh - 2, n.s, 'xr-svg-s', { 'text-anchor': 'middle' })
            if (n.tip) tip(g, n.tip)
            E[n.id] = g
        }
        return { svg, P, E, dotG }
    }
    // play steps: [{ edges: [ids], light: [ids] }]; returns { stop, pause(bool) }
    function playFlow(f, steps, { loop = false, dur = 800, hold = 2200, onDone } = {}) {
        const all = () => { for (const s of steps) { (s.edges || []).forEach(id => f.P[id].classList.add('lit')); (s.light || []).forEach(id => f.E[id].classList.add('lit')) } }
        const clear = () => { for (const p of Object.values(f.P)) p.classList.remove('lit'); for (const g of Object.values(f.E)) g.classList.remove('lit'); f.dotG.textContent = '' }
        if (still()) { all(); if (onDone) onDone(); return { stop() {}, pause() {} } }
        let raf = 0, dead = false, paused = false, i = -1, t0 = 0, pausedAt = 0
        const dots = []
        const begin = k => {
            i = k; t0 = performance.now(); dots.length = 0; f.dotG.textContent = ''
            const s = steps[i]
            for (const id of s.edges || []) { const p = f.P[id]; dots.push({ p, len: p.getTotalLength(), c: el('circle', { r: 7, class: 'xr-svg-dot' }, f.dotG) }) }
        }
        const tick = now => {
            if (dead) return
            if (paused) { raf = requestAnimationFrame(tick); return }
            const t = now - t0
            if (i >= steps.length) {
                if (t > hold) { if (!loop) { if (onDone) onDone(); return } clear(); begin(0) }
            } else {
                const s = steps[i], k = Math.min(1, t / ((s.edges || []).length ? dur : 350)), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
                for (const o of dots) { const pt = o.p.getPointAtLength(e * o.len); o.c.setAttribute('cx', pt.x); o.c.setAttribute('cy', pt.y) }
                if (k >= 1) {
                    (s.edges || []).forEach(id => f.P[id].classList.add('lit')); (s.light || []).forEach(id => f.E[id].classList.add('lit'))
                    if (i + 1 < steps.length) begin(i + 1); else { i = steps.length; t0 = now; f.dotG.textContent = ''; dots.length = 0 }
                }
            }
            raf = requestAnimationFrame(tick)
        }
        clear(); begin(0); raf = requestAnimationFrame(tick)
        return {
            stop() { dead = true; cancelAnimationFrame(raf) },
            pause(on) { if (on && !paused) { paused = true; pausedAt = performance.now() } else if (!on && paused) { paused = false; t0 += performance.now() - pausedAt } },
        }
    }

    // ---------- the run page ----------
    const RUN = readJson('xr-run-data')
    const players = {}
    function drawFan() {
        const host = document.getElementById('xr-fan'); if (!host || !RUN) return
        document.documentElement.classList.add('xr-has-js')
        const ag = RUN.agents, n = ag.length, narrow = narrowOf(host)
        const colors = ag.map(a => getComputedStyle(host).getPropertyValue(`--m-${a.id}`).trim() || '#94a3b8')
        let W, H, nodes, kind
        if (narrow) {
            W = 400; const lines = wrap(RUN.typed, 30, 3), nh = 46 + lines.length * 19
            const aw = (W - 8 * (n - 1)) / n
            nodes = [{ id: 'name', x: 10, y: 6, w: 380, h: nh, t: ['You type:', ...quoted(lines)], fs: 16 },
                { id: 'orch', x: 70, y: nh + 46, w: 260, h: 62, t: 'The orchestrator', s: 'the search tool' },
                ...ag.map((a, i) => ({ id: 'a' + i, x: i * (aw + 8), y: nh + 190, w: aw, h: 70, t: wrap(short(a.label), 11, 2), fs: 13, color: colors[i], tip: `${a.label}: ${a.model}` }))]
            H = nh + 270; kind = 'v'
        } else {
            W = 1000; const lines = wrap(RUN.typed, 24, 3)
            nodes = [{ id: 'name', x: 10, y: 150 - (lines.length * 19 + 40) / 2, w: 250, h: lines.length * 19 + 50, t: ['You type:', ...quoted(lines)], fs: 16 },
                { id: 'orch', x: 340, y: 115, w: 220, h: 70, t: 'The orchestrator', s: 'the search tool' },
                ...ag.map((a, i) => ({ id: 'a' + i, x: 680, y: 14 + i * 70 * 4 / n, w: 310, h: 58, t: a.label, s: a.model, color: colors[i] }))]
            H = 300; kind = 'h'
        }
        if (n === 1 && !narrow) nodes[nodes.length - 1].y = 120
        const edges = [{ id: 'e0', a: 'name', b: 'orch', kind }, ...ag.map((_, i) => ({ id: 'f' + i, a: 'orch', b: 'a' + i, kind }))]
        const f = drawFlow(host, W, H, nodes, edges)
        f.svg.setAttribute('aria-label', `The name typed, sent by the orchestrator to ${n} search agents at once.`)
        txt(f.svg, narrow ? W / 2 : 620, narrow ? nodes[1].y + 92 : 296, 'same question, all at once, through OpenRouter', 'xr-svg-s', { 'text-anchor': 'middle' })
        if (players.fan) players.fan.stop()
        players.fan = playFlow(f, [{ light: ['name'] }, { edges: ['e0'], light: ['orch'] }, { edges: ag.map((_, i) => 'f' + i), light: ag.map((_, i) => 'a' + i) }], { dur: 900 })
    }

    // the calls: the bars grow at a scaled clock that shows the real seconds
    function playGantt() {
        const g = document.getElementById('xr-gantt'); if (!g) return
        const max = +g.dataset.max || 1, bars = [...g.querySelectorAll('.xr-g-bar')], vals = [...g.querySelectorAll('.xr-g-val')], clock = g.querySelector('.xr-g-clock')
        const btn = g.parentElement.querySelector('[data-gantt-replay]')
        if (btn) { btn.hidden = false; btn.onclick = playGantt }
        if (still()) { if (clock) clock.textContent = `All ${bars.length} answers back after ${(max / 1000).toFixed(1)} s`; return }
        if (players.gantt) cancelAnimationFrame(players.gantt)
        const span = Math.min(6000, Math.max(2500, max / 4)), t0 = performance.now()
        const tick = now => {
            const real = Math.min(max, (now - t0) / span * max)
            bars.forEach((b, i) => { const ms = +b.dataset.ms; b.style.width = (100 * Math.min(real, ms) / max) + '%'; if (vals[i]) vals[i].style.visibility = real >= ms ? 'visible' : 'hidden' })
            const back = bars.filter(b => real >= +b.dataset.ms).length
            if (clock) clock.textContent = `t = ${(real / 1000).toFixed(1)} s · ${back} of ${bars.length} answers back`
            if (real < max) players.gantt = requestAnimationFrame(tick)
        }
        players.gantt = requestAnimationFrame(tick)
    }

    // from claims to facts: each agent's leads flow to confirmed, not found or unverified
    function drawSankey() {
        const host = document.getElementById('xr-sankey'); if (!host || !RUN) return
        host.textContent = ''
        const narrow = narrowOf(host), cs = getComputedStyle(host)
        const ST = [['confirmed', 'confirmed'], ['not-found', 'not found'], ['unverified', 'unverified']].filter(([k]) => RUN.status[k] > 0)
        const ag = RUN.agents.filter(a => a.leads.total > 0)
        const total = ag.reduce((n, a) => n + a.leads.total, 0); if (!total) return
        const W = narrow ? 400 : 1000, H = narrow ? 360 : 420, top = 34, gap = 14, nw = 14
        const lx = narrow ? 112 : 250, rx = W - (narrow ? 112 : 230) - nw
        const scale = Math.min((H - top - 10 - gap * (ag.length - 1)) / total, (H - top - 10 - gap * (ST.length - 1)) / total)
        const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `${total} leads from ${ag.length} search agents, by what reading the sources found.` }, host)
        const ribG = el('g', {}, svg), nodeG = el('g', {}, svg)
        const col = id => cs.getPropertyValue(`--m-${id}`).trim() || '#94a3b8', scol = k => cs.getPropertyValue(`--s-${k}`).trim()
        // left nodes
        const L = {}; let y = top
        ag.forEach(a => { const h = a.leads.total * scale; L[a.id] = { y, h, off: 0 }; el('rect', { x: lx, y, width: nw, height: Math.max(1, h), rx: 3, fill: col(a.id) }, nodeG)
            txt(nodeG, lx - 8, y + h / 2 - (narrow ? 2 : 4), narrow ? short(a.label) : a.label, 'xr-svg-t', { 'text-anchor': 'end', style: narrow ? 'font-size:13px' : '' })
            txt(nodeG, lx - 8, y + h / 2 + (narrow ? 13 : 15), `${a.leads.total} leads`, 'xr-svg-s', { 'text-anchor': 'end' }); y += h + gap })
        // right nodes, centred
        const rTot = total * scale + gap * (ST.length - 1); const R = {}; y = top + ((H - top - 10) - rTot) / 2
        ST.forEach(([k, w]) => { const h = RUN.status[k] * scale; R[k] = { y, h, off: 0 }; el('rect', { x: rx, y, width: nw, height: Math.max(1, h), rx: 3, fill: scol(k) }, nodeG)
            txt(nodeG, rx + nw + 8, y + h / 2 - (narrow ? 2 : 4), w, 'xr-svg-t', { style: narrow ? 'font-size:13px' : '' })
            txt(nodeG, rx + nw + 8, y + h / 2 + (narrow ? 13 : 15), `${RUN.status[k]} of ${total}`, 'xr-svg-s'); y += h + gap })
        // the gate in the middle: where the sources were read
        const mx = (lx + nw + rx) / 2
        el('line', { x1: mx, y1: top - 6, x2: mx, y2: H - 6, class: 'xr-svg-gate' }, ribG)
        txt(svg, mx, 18, 'read on its source', 'xr-svg-s', { 'text-anchor': 'middle' })
        // ribbons
        const ribs = []
        ag.forEach(a => ST.forEach(([k, w]) => {
            const c = a.leads[k]; if (!c) return
            const t = c * scale, y0 = L[a.id].y + L[a.id].off, y1 = R[k].y + R[k].off; L[a.id].off += t; R[k].off += t
            const x0 = lx + nw, x1 = rx, m = (x1 - x0) / 2
            const p = el('path', { d: `M${x0},${y0} C${x0 + m},${y0} ${x1 - m},${y1} ${x1},${y1} L${x1},${y1 + t} C${x1 - m},${y1 + t} ${x0 + m},${y0 + t} ${x0},${y0 + t} Z`, fill: col(a.id), class: 'xr-svg-rib' }, ribG)
            tip(p, `${a.label}: ${c} ${w}`); ribs.push(p)
        }))
        if (!still()) ribs.forEach((p, i) => { p.style.opacity = 0; p.style.transition = `opacity .5s ${i * 0.12}s`; requestAnimationFrame(() => requestAnimationFrame(() => { p.style.opacity = '' })) })
    }

    // play each drawing when it comes into view (or at once, without IntersectionObserver)
    function whenSeen(id, fn) {
        const n = document.getElementById(id); if (!n) return
        if (!('IntersectionObserver' in window)) return fn()
        const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); fn() } }, { threshold: .05 })
        io.observe(n.closest('section') || n.parentElement || n)   // an empty mount is not displayed, so it is never seen itself
    }

    // ---------- presenter mode ----------
    function walk() {
        const pageEl = document.getElementById('xr-runpage'), bar = document.getElementById('xr-walkbar'); if (!pageEl || !bar) return
        const secs = [...pageEl.querySelectorAll('.xr-sec')]; if (!secs.length) return
        bar.hidden = false
        bar.innerHTML = '<button type="button" class="xr-btn">▶ Walk me through it</button><span class="meta">One step at a time, full screen: arrows, tap or swipe. Esc to leave.</span>'
        const nav = document.createElement('div'); nav.className = 'xr-walknav'; nav.setAttribute('role', 'toolbar'); nav.setAttribute('aria-label', 'Walk through the steps')
        nav.innerHTML = '<button type="button" class="xr-btn ghost" data-k="back">← Back</button><span class="xr-walkpos" aria-live="polite"></span><button type="button" class="xr-btn" data-k="next">Next →</button><button type="button" class="xr-btn ghost" data-k="close" aria-label="Leave the walk-through">✕</button>'
        pageEl.appendChild(nav)
        const pos = nav.querySelector('.xr-walkpos'), nextB = nav.querySelector('[data-k="next"]')
        let k = 0, on = false, back = null
        const show = i => {
            k = Math.max(0, Math.min(secs.length - 1, i))
            secs.forEach((s, j) => s.classList.toggle('cur', j === k))
            pos.textContent = `${k + 1} / ${secs.length}`; nextB.textContent = k === secs.length - 1 ? 'Done ✓' : 'Next →'
            pageEl.scrollTop = 0
            const s = secs[k]
            if (s.querySelector('#xr-fan')) drawFan(); if (s.querySelector('#xr-gantt')) playGantt(); if (s.querySelector('#xr-sankey')) drawSankey()
        }
        const open = () => { on = true; back = window.scrollY; document.body.classList.add('xr-walking'); show(0); nextB.focus() }
        const close = () => { on = false; document.body.classList.remove('xr-walking'); secs.forEach(s => s.classList.remove('cur')); window.scrollTo(0, back || 0); drawFan(); drawSankey(); bar.querySelector('button').focus() }
        const next = () => k === secs.length - 1 ? close() : show(k + 1)
        bar.querySelector('button').onclick = open
        nav.onclick = e => { const b = e.target.closest('button'); if (!b) return; e.stopPropagation(); b.dataset.k === 'next' ? next() : b.dataset.k === 'back' ? show(k - 1) : close() }
        document.addEventListener('keydown', e => {
            if (!on || e.altKey || e.ctrlKey || e.metaKey) return
            if (['ArrowRight', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.target.closest('summary, button, a'))) { e.preventDefault(); next() }
            else if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); show(k - 1) }
            else if (e.key === 'Home') show(0); else if (e.key === 'End') show(secs.length - 1)
            else if (e.key === 'Escape') close()
        })
        // a tap on the empty part of a step: the right half goes on, the left half goes back
        pageEl.addEventListener('click', e => {
            if (!on || e.target.closest('a, button, summary, details, table, .xr-acard, svg')) return
            e.clientX > window.innerWidth / 2 ? next() : show(k - 1)
        })
        let tx = null, ty = null
        pageEl.addEventListener('touchstart', e => { if (on && e.touches.length === 1) { tx = e.touches[0].clientX; ty = e.touches[0].clientY } }, { passive: true })
        pageEl.addEventListener('touchend', e => {
            if (!on || tx == null) return
            const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; tx = null
            if (Math.abs(dx) > 60 && Math.abs(dx) > 2 * Math.abs(dy)) dx < 0 ? next() : show(k - 1)
        }, { passive: true })
    }

    if (RUN) {
        drawFan()
        whenSeen('xr-gantt', playGantt)
        whenSeen('xr-sankey', drawSankey)
        walk()
    }

    // ---------- /xray/how/: the pipeline ----------
    const HOW = readJson('xr-how-data')
    let pipe = null
    function drawPipe() {
        const host = document.getElementById('xr-pipe'); if (!host || !HOW) return
        const narrow = narrowOf(host), cs = getComputedStyle(host.parentElement)
        const ms = HOW.models.length ? HOW.models : [{ id: 'other', label: 'Search agent' }]
        const col = id => cs.getPropertyValue(`--m-${id}`).trim() || '#94a3b8'
        let W, H, nodes, edges
        const outs = [['page', 'X-ray page'], ['deck', 'Deck'], ['log', 'Run log']]
        if (narrow) {
            W = 400; let y = 6; const row = (h, gapAfter = 34) => { const r = y; y += h + gapAfter; return r }
            const aw = (W - 8 * (ms.length - 1)) / ms.length, ow = (W - 16) / 3
            const yName = row(50), yOrch = row(56), yAg = row(60), yLeads = row(56), yRead = row(56), ySrc = row(56), yRec = row(56), yRev = row(56), yOut = row(50, 6)
            nodes = [
                { id: 'name', x: 60, y: yName, w: 280, h: 50, t: 'A typed name' },
                { id: 'orch', x: 60, y: yOrch, w: 280, h: 56, t: 'The orchestrator', s: 'sends one question to four' },
                ...ms.map((m, i) => ({ id: 'a' + i, x: i * (aw + 8), y: yAg, w: aw, h: 60, t: wrap(short(m.label), 11, 2), fs: 13, color: col(m.id) })),
                { id: 'leads', x: 60, y: yLeads, w: 280, h: 56, t: 'Leads', s: 'what the models said: not facts' },
                { id: 'read', x: 60, y: yRead, w: 280, h: 56, t: 'The reading agent', s: 'opens and reads the sources' },
                { id: 'src', x: 60, y: ySrc, w: 280, h: 56, t: 'Sources read', s: 'each with its URL and date' },
                { id: 'rec', x: 60, y: yRec, w: 280, h: 56, t: 'The verified record', s: 'xray.json' },
                { id: 'rev', x: 60, y: yRev, w: 280, h: 56, t: 'The review', s: 'xray@web-summit.dinis' },
                ...outs.map(([id, t], i) => ({ id, x: i * (ow + 8), y: yOut, w: ow, h: 50, t, fs: 14 })),
            ]
            H = y
            edges = [['name', 'orch'], ...ms.map((_, i) => ['orch', 'a' + i]), ...ms.map((_, i) => ['a' + i, 'leads']), ['leads', 'read'], ['read', 'src'], ['src', 'rec'], ['rec', 'rev'], ...outs.map(([id]) => ['rev', id])].map(([a, b]) => ({ id: a + '-' + b, a, b, kind: 'v' }))
        } else {
            // three rows: search (left to right), check (right to left), publish (left to right)
            W = 1060; const cw = 230, cx = [20, 395, 770], r1 = 10, r2 = 300, r3 = 440
            const ah = 52, ag = 10
            nodes = [
                { id: 'name', x: cx[0], y: r1 + 85, w: cw, h: 70, t: 'A typed name', s: 'company, use case, industry' },
                { id: 'orch', x: cx[1], y: r1 + 85, w: cw, h: 70, t: 'The orchestrator', s: 'one question, to four at once' },
                ...ms.map((m, i) => ({ id: 'a' + i, x: cx[2], y: r1 + i * (ah + ag), w: cw, h: ah, t: m.label, fs: 15, color: col(m.id) })),
                { id: 'leads', x: cx[2], y: r2, w: cw, h: 70, t: 'Leads', s: 'what the models said' },
                { id: 'read', x: cx[1], y: r2, w: cw, h: 70, t: 'The reading agent', s: 'a Claude Code sub-agent' },
                { id: 'src', x: cx[0], y: r2, w: cw, h: 70, t: 'Sources read', s: 'each with URL and date' },
                { id: 'rec', x: cx[0], y: r3 + 30, w: cw, h: 70, t: 'The verified record', s: 'xray.json' },
                { id: 'rev', x: cx[1], y: r3 + 30, w: cw, h: 70, t: 'The review', s: 'xray@web-summit.dinis' },
                ...outs.map(([id, t], i) => ({ id, x: cx[2], y: r3 + i * 48, w: cw, h: 40, t, fs: 15 })),
            ]
            H = r3 + 3 * 48
            edges = [{ a: 'name', b: 'orch', kind: 'h' }, ...ms.map((_, i) => ({ a: 'orch', b: 'a' + i, kind: 'h' })), ...ms.map((_, i) => ({ a: 'a' + i, b: 'leads', kind: 'loop' })),
                { a: 'leads', b: 'read', kind: 'hl' }, { a: 'read', b: 'src', kind: 'hl' }, { a: 'src', b: 'rec', kind: 'v' }, { a: 'rec', b: 'rev', kind: 'h' }, ...outs.map(([id]) => ({ a: 'rev', b: id, kind: 'h' }))].map(e => ({ ...e, id: e.a + '-' + e.b }))
            void ag
        }
        const f = drawFlow(host, W, H, nodes, edges)
        f.svg.setAttribute('aria-label', 'How an X-ray is made: a typed name, the orchestrator, four search agents, leads, the reading agent, sources read, the verified record, the review, then the page, the deck and the run log.')
        if (!narrow) { txt(f.svg, 20, 290, 'CHECK', 'xr-svg-s', { style: 'letter-spacing:.2em' }); txt(f.svg, 20, 460, 'PUBLISH', 'xr-svg-s', { style: 'letter-spacing:.2em' }) }
        const E = (a, b) => a + '-' + b
        const steps = [{ light: ['name'] }, { edges: [E('name', 'orch')], light: ['orch'] }, { edges: ms.map((_, i) => E('orch', 'a' + i)), light: ms.map((_, i) => 'a' + i) },
            { edges: ms.map((_, i) => E('a' + i, 'leads')), light: ['leads'] }, { edges: [E('leads', 'read')], light: ['read'] }, { edges: [E('read', 'src')], light: ['src'] },
            { edges: [E('src', 'rec')], light: ['rec'] }, { edges: [E('rec', 'rev')], light: ['rev'] }, { edges: outs.map(([id]) => E('rev', id)), light: outs.map(([id]) => id) }]
        if (pipe) pipe.stop()
        pipe = playFlow(f, steps, { loop: true, dur: 850, hold: 2600 })
        const btn = document.querySelector('[data-pipe-pause]')
        if (btn && !still()) { btn.hidden = false; btn.textContent = 'Pause'; btn.setAttribute('aria-pressed', 'false'); btn.onclick = () => { const p = btn.getAttribute('aria-pressed') !== 'true'; btn.setAttribute('aria-pressed', String(p)); btn.textContent = p ? 'Play' : 'Pause'; pipe.pause(p) } }
    }
    if (HOW) drawPipe()

    // redraw when the layout changes between narrow and wide
    let lastNarrow = narrowOf(document.querySelector('main') || document.body), rT = 0
    window.addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => {
        const n = narrowOf(document.querySelector('main') || document.body); if (n === lastNarrow) return; lastNarrow = n
        if (RUN) { drawFan(); drawSankey() } if (HOW) drawPipe()
    }, 200) })
})()
