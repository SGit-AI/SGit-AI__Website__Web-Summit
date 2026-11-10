// The incident dashboard (incident.dev@web-summit.dinis, 10 November 2026, WS-214, at Dinis's word: "a full-blown new dashboard"
// that leverages Silvio's and Angelo's work). It reads the incident's data folder (the page's ```incident <dir>``` block), the files
// their owners write (data/README.md), and draws:
//   1. the timeline: IPMA's warning windows as bars, the meteorologist's worst window (analysis), the warnings' history, and every
//      row of timeline.md (signals.json) at its real time;
//   2. the decision graph (researcher's decisions/graph.json): each decision in its decider's lane, an arrow from each decision it
//      followed; FACT solid, EVIDENCE dashed, HYPOTHESIS dotted and in italics with its reasons, not yet announced hollow;
//   3. the weather (meteorologist's weather/*.json): observed mean wind at Lisbon stations and the airport's gusts against IPMA's
//      hourly model and the red window; the warnings; the analysis, labelled as such; IPMA's five days.
// Reused, not loaded (a person's script is never loaded here, WS-164): Silvio's fetch with a timeout and no cache (assets/cc/brain.js),
// Angelo's minute poll and his "LIVE, or amber when the data is over 30 minutes old" (people/angelo/app/live.js), and his habit of
// drawing plain SVG by hand. No library: one file, the site's colour tokens only, light and dark.
(function () {
    'use strict'
    const mount = document.getElementById('incident')
    if (!mount) return
    const NS = 'http://www.w3.org/2000/svg'
    const BASE = new URL('../../' + mount.dataset.dir, location.href).href
    const POLL_MS = 60000, STALE_MIN = 30
    const get = async (u, ms = 12000) => { const c = new AbortController(), t = setTimeout(() => c.abort(), ms); try { const r = await fetch(u, { signal: c.signal, cache: 'no-cache' }); if (!r.ok) throw new Error(u + ' HTTP ' + r.status); return await r.json() } finally { clearTimeout(t) } }
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
    const safe = u => /^https:\/\//.test(String(u || '')) ? u : ''
    const T = s => Date.parse(s)
    const hm = t => new Date(t).toISOString().slice(11, 16)
    const day = t => new Date(t).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })
    const el = (tag, attrs = {}, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n }
    const title = (n, text) => { el('title', {}, n).textContent = text; return n }
    const srcHtml = ss => (ss || []).map(s => safe(s.url) ? `<a href="${esc(s.url)}" rel="noopener">${esc(s.label)}</a>` : esc(s.label)).join('; ')
    const LEVEL = { yellow: 'var(--st-gold)', orange: 'var(--warm)', red: 'var(--bad)' }
    const LABEL = { fact: 'Fact', evidence: 'Evidence', hypothesis: 'Hypothesis' }

    const CSS = `
.incident { --if: var(--ok); --ie: var(--sent); --ih: var(--warn); margin: 1rem 0 2rem; }
.incident h2 { margin-top: 2rem; }
.inc-status { display: flex; flex-wrap: wrap; gap: .5rem 1rem; align-items: center; font-size: .9rem; color: var(--ink-2); }
.inc-live { display: inline-flex; align-items: center; gap: .4em; font-weight: 700; letter-spacing: .12em; color: var(--bad); border: 1px solid currentColor; border-radius: 999px; padding: .15em .6em; font-size: .78rem; }
.inc-live i { width: .6em; height: .6em; border-radius: 50%; background: currentColor; animation: inc-pulse 1.6s ease-in-out infinite; }
.inc-live.old { color: var(--warn); } .inc-live.old i, .inc-live.down i { animation: none; } .inc-live.down { color: var(--wait); }
@keyframes inc-pulse { 50% { opacity: .3; } }
@media (prefers-reduced-motion: reduce) { .inc-live i { animation: none; } }
.inc-p1 { font-weight: 700; color: var(--bad); }
.inc-legend { display: flex; flex-wrap: wrap; gap: .4rem 1rem; font-size: .82rem; color: var(--ink-2); margin: .5rem 0; }
.inc-legend span { display: inline-flex; align-items: center; gap: .35em; }
.inc-chip { display: inline-block; width: 1.4em; height: .9em; border-radius: 3px; border: 2px solid; }
.inc-chip.fact { border-color: var(--if); background: var(--ok-soft); }
.inc-chip.evidence { border-color: var(--ie); border-style: dashed; background: var(--sent-soft); }
.inc-chip.hypothesis { border-color: var(--ih); border-style: dotted; background: var(--warn-soft); }
.inc-chip.pending { border-color: var(--ink-2); background: transparent; }
.inc-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); }
.inc-scroll svg { display: block; }
.inc-tlwrap { display: flex; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); overflow: hidden; }
.inc-tlwrap .inc-scroll { border: 0; border-radius: 0; flex: 1; min-width: 0; }
.inc-tl-l { flex: none; border-right: 1px solid var(--line); background: var(--surface-2); }
.inc-tl-l svg { display: block; }
.incident svg text { fill: var(--ink); font: 12px/1.2 system-ui, sans-serif; }
.incident svg .muted { fill: var(--ink-2); font-size: 11px; }
.incident svg .grid { stroke: var(--line); stroke-width: 1; }
.incident svg .now { stroke: var(--bad); stroke-width: 2; stroke-dasharray: 4 3; }
.incident svg .mk { cursor: pointer; }
.incident svg .mk:focus { outline: none; } .incident svg .mk:focus > :first-child { stroke: var(--focus); stroke-width: 3; }
.inc-detail { min-height: 3.2em; margin: .5rem 0 0; padding: .6rem .8rem; border-left: 3px solid var(--line-2); background: var(--surface-2); font-size: .9rem; }
.inc-detail .lab { font-weight: 700; text-transform: uppercase; font-size: .72rem; letter-spacing: .08em; margin-right: .4em; }
.lab.fact { color: var(--if); } .lab.evidence { color: var(--ie); } .lab.hypothesis { color: var(--ih); }
.inc-graph .node rect { stroke-width: 2; }
.inc-graph .node.fact rect { stroke: var(--if); fill: var(--ok-soft); }
.inc-graph .node.evidence rect { stroke: var(--ie); fill: var(--sent-soft); stroke-dasharray: 6 4; }
.inc-graph .node.hypothesis rect { stroke: var(--ih); fill: var(--warn-soft); stroke-dasharray: 2 3; }
.inc-graph .node.pending rect { fill: var(--surface); stroke: var(--ink-2); stroke-width: 2.5; }
.inc-graph .node.hypothesis text { font-style: italic; }
.inc-graph .node .tag { font-size: 10px; font-weight: 700; letter-spacing: .06em; }
.inc-graph .node.fact .tag { fill: var(--if); } .inc-graph .node.evidence .tag { fill: var(--ie); } .inc-graph .node.hypothesis .tag { fill: var(--ih); } .inc-graph .node.pending .tag { fill: var(--bad); }
.inc-graph .edge { fill: none; stroke: var(--line-2); stroke-width: 1.5; }
.inc-graph .edge.supports, .inc-graph .edge.predicts { stroke-dasharray: 3 3; }
.inc-graph .edge.on { stroke: var(--accent); stroke-width: 2.5; }
.inc-graph .node.dim { opacity: .35; } .inc-graph .edge.dim { opacity: .2; }
.inc-graph .lane-h { font-weight: 700; } .inc-graph .lane-bg { fill: var(--surface-2); }
.inc-arrow { fill: var(--line-2); }
.inc-wx { display: grid; grid-template-columns: repeat(auto-fit, minmax(7.5rem, 1fr)); gap: .5rem; margin: .5rem 0; }
.inc-wx div { border: 1px solid var(--line); border-radius: 8px; padding: .5rem; background: var(--surface); font-size: .85rem; }
.inc-wx b { display: block; }
.inc-warn { list-style: none; padding: 0; margin: .5rem 0; }
.inc-warn li { padding: .35rem .6rem; border-left: 6px solid; margin: .25rem 0; background: var(--surface); font-size: .9rem; }
.inc-warn li.gone { opacity: .55; text-decoration: line-through; }
.inc-list { font-size: .88rem; }
.inc-list td:first-child { white-space: nowrap; }
.inc-err { color: var(--bad); }
`
    const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style)

    const FILES = { signals: 'signals.json', graph: 'decisions/graph.json', warnings: 'weather/warnings.json', stations: 'weather/stations.json', forecast: 'weather/forecast.json', airport: 'weather/airport.json', analysis: 'weather/analysis.json' }
    let state = {}
    async function load() {
        const names = Object.keys(FILES), got = await Promise.allSettled(names.map(n => get(BASE + FILES[n])))
        const next = {}; names.forEach((n, i) => { next[n] = got[i].status === 'fulfilled' ? got[i].value : (state[n] || null); if (got[i].status !== 'fulfilled') next[n + 'Err'] = String(got[i].reason && got[i].reason.message || got[i].reason) })
        next.readAt = Date.now(); state = next
        const sig = JSON.stringify(Object.keys(FILES).map(n => next[n]))
        if (sig !== lastSig || !mount.querySelector('#inc-st')) { lastSig = sig; draw() } else status()
    }
    let lastSig = ''

    function freshest() { const s = state, ts = [s.signals && s.signals.made_at, s.graph && s.graph.updated, s.warnings && s.warnings.read_utc].filter(Boolean).map(T).filter(Number.isFinite); return ts.length ? Math.max(...ts) : 0 }

    function status() {
        const s = state, f = freshest(), age = f ? (Date.now() - f) / 6e4 : Infinity
        const errs = Object.keys(FILES).filter(n => s[n + 'Err']).map(n => FILES[n])
        mount.querySelector('#inc-st').innerHTML = `
  <span class="inc-live ${!f ? 'down' : age > STALE_MIN ? 'old' : ''}" title="${f ? 'newest data: ' + new Date(f).toISOString().slice(0, 16) + 'Z' : 'no data'}"><i></i>${!f ? 'NO DATA' : age > STALE_MIN ? Math.round(age) + ' MIN OLD' : 'LIVE'}</span>
  <span class="inc-p1">P1 · open</span>
  <span>Data read ${hm(s.readAt)} UTC, again every minute</span>
  <span>Timeline ${s.signals ? hm(T(s.signals.made_at)) : '—'} · graph ${s.graph ? hm(T(s.graph.updated)) : '—'} · IPMA ${s.warnings ? hm(T(s.warnings.read_utc)) : '—'} (UTC)</span>
  ${errs.length ? `<span class="inc-err">Not read: ${errs.map(esc).join(', ')}</span>` : ''}`
    }

    function draw() {
        mount.innerHTML = `
<div class="inc-status" id="inc-st"></div>
<div class="inc-legend" aria-label="How to read the dashboard">
  <span><i class="inc-chip fact"></i>Fact: read from the body that decides or warns</span>
  <span><i class="inc-chip evidence"></i>Evidence: reported by someone else, with its source</span>
  <span><i class="inc-chip hypothesis"></i>Hypothesis: our analysis, with its reasons; never a fact</span>
  <span><i class="inc-chip pending"></i>Decision still pending</span>
</div>
<h2 id="inc-timeline">The timeline</h2>
<div class="inc-tlwrap"><div class="inc-tl-l" id="inc-tl-l"></div><div class="inc-scroll" id="inc-tl"></div></div>
<p class="inc-detail" id="inc-tl-d" aria-live="polite">Select a mark for its detail and source. The dashed red line is now.</p>
<h2 id="inc-graph">The decision graph</h2>
<p class="meta">Every decision in its decider's lane, an arrow from each decision it followed. Select a box to light its links. The thick box is the one everyone waits for.</p>
<div class="inc-scroll inc-graph" id="inc-g"></div>
<div class="inc-detail" id="inc-g-d" aria-live="polite">Select a box for its detail, its sources and, for a hypothesis, its reasons.</div>
<h2 id="inc-weather">The weather</h2>
<div id="inc-wx"></div>
<details><summary>Every timeline item as a list</summary><div id="inc-list"></div></details>`
        status()
        try { timeline() } catch (e) { mount.querySelector('#inc-tl').innerHTML = `<p class="inc-err">${esc(e.message)}</p>` }
        try { graph() } catch (e) { mount.querySelector('#inc-g').innerHTML = `<p class="inc-err">${esc(e.message)}</p>` }
        try { weather() } catch (e) { mount.querySelector('#inc-wx').innerHTML = `<p class="inc-err">${esc(e.message)}</p>` }
        list()
    }

    // 1. the timeline: Lisbon's warnings (one row per type), the analysis's worst window, the warnings' history, then timeline.md's rows
    function timeline() {
        const box = mount.querySelector('#inc-tl'), detail = mount.querySelector('#inc-tl-d')
        const items = (state.signals && state.signals.items) || [], warns = (state.warnings && state.warnings.lisbon) || []
        const hist = ((state.warnings && state.warnings.history) || []).filter(h => Number.isFinite(T(h.at_utc)))   // "between A and B" is left to the list
        const wl = state.analysis && state.analysis.wednesday_lisbon
        const types = [...new Set(warns.map(w => w.type))]
        const rows = [...types.map(t => ({ id: 'w:' + t, name: t })), ...(wl ? [{ id: 'analysis', name: 'Worst window (analysis)' }] : []), { id: 'hist', name: 'Warnings issued' }, { id: 'official', name: 'Official (fact)' }, { id: 'signal', name: 'Signals (evidence)' }, { id: 'team', name: 'Our team (fact)' }]
        const times = [...items.map(i => T(i.at)), ...hist.map(h => T(h.at_utc)), ...warns.flatMap(w => [T(w.start_utc), T(w.end_utc)]), Date.now()].filter(Number.isFinite)
        const t0 = Math.floor(Math.min(...times) / 36e5) * 36e5, t1 = Math.ceil(Math.max(...times) / 36e5) * 36e5
        const LW = innerWidth < 600 ? 104 : 168, L = 6, W = Math.max(900, (t1 - t0) / 36e5 * 22) + L + 20, RH = 32, H = 36 + rows.length * RH + 10
        const x = t => L + (t - t0) / (t1 - t0) * (W - L - 20)
        const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': 'Timeline of the incident, UTC' }, box)
        for (let t = t0; t <= t1; t += 36e5) {
            const h = new Date(t).getUTCHours()
            if (h % 3) continue
            el('line', { x1: x(t), x2: x(t), y1: 24, y2: H - 6, class: 'grid' }, svg)
            el('text', { x: x(t) + 3, y: 14, class: 'muted' }, svg).textContent = h === 0 ? day(t) : String(h).padStart(2, '0')
        }
        const lab = el('svg', { viewBox: `0 0 ${LW} ${H}`, width: LW, height: H, 'aria-hidden': 'true' }, mount.querySelector('#inc-tl-l'))
        rows.forEach((r, k) => { const y = 36 + k * RH, t = el('text', { x: 8, y: y + RH / 2 + 4 }, lab); t.textContent = r.name.length > LW / 6.4 ? r.name.slice(0, Math.floor(LW / 6.4) - 1) + '…' : r.name; title(t, r.name); el('line', { x1: 0, x2: LW, y1: y + RH, y2: y + RH, class: 'grid' }, lab); el('line', { x1: L, x2: W - 10, y1: y + RH, y2: y + RH, class: 'grid' }, svg) })
        const rowY = id => 36 + rows.findIndex(r => r.id === id) * RH
        const show = (lab, html) => { detail.innerHTML = `<span class="lab ${lab}">${LABEL[lab] || lab}</span>${html}` }
        const focusable = (n, fn) => { n.setAttribute('tabindex', '0'); n.setAttribute('class', 'mk'); n.addEventListener('click', fn); n.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn() } }) }
        for (const w of warns) {
            const g = el('g', {}, svg), y = rowY('w:' + w.type) + 7, a = T(w.start_utc), b = T(w.end_utc)
            el('rect', { x: x(a), y, width: Math.max(3, x(b) - x(a)), height: RH - 14, rx: 3, fill: LEVEL[w.level] || 'var(--wait)', opacity: .85 }, g)
            title(g, `${w.level} warning, ${w.type}: ${hm(a)} to ${hm(b)} ${day(a)}`)
            focusable(g, () => show('fact', ` <b>${esc(w.level)} warning, ${esc(w.type)}</b>, ${day(a)} ${hm(a)} to ${day(b)} ${hm(b)} UTC: ${esc(w.text_pt)} <span class="meta">(<a href="${esc(safe(w.source))}" rel="noopener">IPMA open data</a>, read ${hm(T(w.read_utc))})</span>`))
        }
        if (wl) {
            const g = el('g', {}, svg), y = rowY('analysis') + 7, a = T(wl.worst_window_utc[0]), b = T(wl.worst_window_utc[1]), pa = T(wl.likely_peak_utc[0]), pb = T(wl.likely_peak_utc[1])
            el('rect', { x: x(a), y, width: x(b) - x(a), height: RH - 14, rx: 9, fill: 'var(--warn-soft)', stroke: 'var(--ih)', 'stroke-width': 2, 'stroke-dasharray': '2 3' }, g)
            el('rect', { x: x(pa), y: y + 4, width: x(pb) - x(pa), height: RH - 22, rx: 4, fill: 'var(--ih)', opacity: .5 }, g)
            title(g, 'Analysis: the worst window and the likely peak')
            focusable(g, () => show('hypothesis', ` <b>Analysis by ${esc(state.analysis.by)}</b> (${hm(T(state.analysis.written_utc))}): worst ${hm(a)} to ${hm(b)}, likely peak ${hm(pa)} to ${hm(pb)} (darker), easing from ${hm(T(wl.easing_from_utc))}, over by ${hm(T(wl.ends_utc))}; confidence: window ${esc(wl.confidence.window)}, peak ${esc(wl.confidence.peak_hour_and_strength)}.<br><b>Reasons:</b> ${(wl.why || []).map(esc).join('; ')}`))
        }
        for (const h of hist) {
            const g = el('g', {}, svg), cx = x(T(h.at_utc)), cy = rowY('hist') + RH / 2, lab = h.kind === 'evidence' ? 'evidence' : 'fact'
            el('rect', { x: cx - 5, y: cy - 7, width: 10, height: 14, rx: 2, fill: lab === 'evidence' ? 'var(--sent-soft)' : 'var(--ok-soft)', stroke: lab === 'evidence' ? 'var(--ie)' : 'var(--if)', 'stroke-width': 2 }, g)
            title(g, `${hm(T(h.at_utc))}: ${h.event}`)
            focusable(g, () => show(lab, ` <b>${day(T(h.at_utc))} ${hm(T(h.at_utc))} UTC</b>: ${esc(h.event)} <span class="meta">(${safe(h.source) ? `<a href="${esc(h.source)}" rel="noopener">source</a>` : esc(h.source || '')}${h.read_utc ? ', read ' + hm(T(h.read_utc)) : ''}${h.read_by ? ' by ' + esc(h.read_by) : ''})</span>`))
        }
        for (const it of items) {
            const g = el('g', {}, svg), cx = x(T(it.at)), cy = rowY(it.kind) + RH / 2, r = it.key ? 8 : 6
            const fill = it.label === 'evidence' ? 'var(--sent-soft)' : 'var(--ok-soft)', stroke = it.label === 'evidence' ? 'var(--ie)' : 'var(--if)'
            if (it.label === 'evidence') el('rect', { x: cx - r, y: cy - r, width: 2 * r, height: 2 * r, transform: `rotate(45 ${cx} ${cy})`, fill, stroke, 'stroke-width': 2, 'stroke-dasharray': '3 2' }, g)
            else el('circle', { cx, cy, r, fill, stroke, 'stroke-width': 2 }, g)
            title(g, `${hm(T(it.at))}${it.approx ? ' (about)' : ''}: ${it.text}`)
            focusable(g, () => show(it.label, ` <b>${it.approx ? 'about ' : ''}${hm(T(it.at))} UTC</b>, ${day(T(it.at))}: ${esc(it.text)} <span class="meta">(${srcHtml(it.sources)})</span>`))
        }
        const nx = x(Date.now()); el('line', { x1: nx, x2: nx, y1: 20, y2: H - 4, class: 'now' }, svg); el('text', { x: nx + 4, y: 30, class: 'muted' }, svg).textContent = 'now'
        box.scrollLeft = Math.max(0, nx - box.clientWidth * 0.6)
    }

    // 2. the decision graph (graph.json): nodes are the deciders, edges their decisions; drawn the other way round, as a reader asks
    //    it: each decision a box in its decider's lane, an arrow from every decision it `follows`
    const LANES = [['Weather and civil protection', ['authority']], ['Government', ['government']], ['City and schools', ['municipality', 'service']], ['Transport', ['transport']], ['Venue and organisers', ['venue', 'organiser']]]
    const STATUS = { happened: 'made', not_announced: 'not announced', unknown: 'unknown', expected: 'expected' }
    function graph() {
        const box = mount.querySelector('#inc-g'), detail = mount.querySelector('#inc-g-d'), d = state.graph
        if (!d) { box.innerHTML = '<p class="meta">No decisions/graph.json yet.</p>'; return }
        const who = Object.fromEntries(d.nodes.map(n => [n.id, n])), short = id => who[id] ? who[id].name.replace(/\s*\(.*\)\s*$/, '') : id
        const laneOf = e => { const k = (who[e.by] || {}).kind; const i = LANES.findIndex(l => l[1].includes(k)); return i < 0 ? LANES.length - 1 : i }
        const CW = 220, GAP = 40, NW = CW - 16, PAD = 12, TOP = 50
        const wrap = (t, n) => { const out = []; let line = ''; for (const w of String(t).split(/\s+/)) { if ((line + ' ' + w).trim().length > n) { if (line) out.push(line); line = w } else line = (line + ' ' + w).trim() } if (line) out.push(line); return out }
        const tkey = e => /T\d\d:\d\d/.test(e.at || '') ? e.at : (e.at ? e.at + 'T23:59Z' : '9999')
        const pos = {}; let H = 0
        LANES.forEach((_, li) => { let y = TOP; for (const e of d.edges.filter(e => laneOf(e) === li).sort((a, b) => tkey(a).localeCompare(tkey(b)))) { const lines = wrap(e.decision.replace(/^HYPOTHESIS:\s*/, ''), 30).slice(0, 5), h = 38 + lines.length * 15; pos[e.id] = { x: PAD + li * (CW + GAP), y, w: NW, h, lines, e }; y += h + 14 } H = Math.max(H, y) })
        const W = PAD * 2 + LANES.length * (CW + GAP) - GAP; H += 6
        const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': 'The decision graph' }, box)
        const defs = el('defs', {}, svg), mk = el('marker', { id: 'inc-ar', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs); el('path', { d: 'M0 0L10 5L0 10z', class: 'inc-arrow' }, mk)
        LANES.forEach((l, li) => { const lx = PAD + li * (CW + GAP) - 6; el('rect', { x: lx, y: 4, width: NW + 12, height: H - 8, rx: 8, class: 'lane-bg' }, svg); el('text', { x: lx + 8, y: 26, class: 'lane-h' }, svg).textContent = l[0] })
        const eg = el('g', {}, svg), links = []
        for (const e of d.edges) for (const f of e.follows || []) {
            const a = pos[f], b = pos[e.id]; if (!a || !b) continue
            let p
            if (a.x === b.x) { const x0 = a.x + a.w, y0 = a.y + a.h / 2, y1 = b.y + b.h / 2, bend = 18 + Math.min(40, Math.abs(y1 - y0) / 12); p = `M${x0} ${y0} C${x0 + bend} ${y0} ${x0 + bend} ${y1} ${x0} ${y1}` }
            else { const fwd = b.x > a.x, x0 = fwd ? a.x + a.w : a.x, x1 = fwd ? b.x : b.x + b.w, y0 = a.y + a.h / 2, y1 = b.y + b.h / 2, mx = (x0 + x1) / 2; p = `M${x0} ${y0} C${mx} ${y0} ${mx} ${y1} ${x1} ${y1}` }
            const path = el('path', { d: p, class: 'edge' + (e.label === 'hypothesis' ? ' predicts' : ''), 'marker-end': 'url(#inc-ar)' }, eg); links.push({ from: f, to: e.id, path })
        }
        const boxes = {}
        for (const id in pos) {
            const { x, y, w, h, lines, e } = pos[id], pend = e.label !== 'hypothesis' && e.status !== 'happened', key = id === d.first_priority
            const g = el('g', { class: `node ${e.label}${pend ? ' pending' : ''}`, tabindex: 0, transform: `translate(${x} ${y})` }, svg); boxes[id] = g
            const r = el('rect', { width: w, height: h, rx: e.label === 'hypothesis' ? 14 : 6 }, g); if (key) r.setAttribute('stroke-width', 5)
            el('text', { x: 8, y: 15, class: 'tag' }, g).textContent = (key ? 'WAITING FOR · ' : '') + (e.label === 'hypothesis' ? 'H? ' : LABEL[e.label].toUpperCase() + ' · ') + (STATUS[e.status] || e.status).toUpperCase() + (/T\d\d:\d\d/.test(e.at || '') ? ' · ' + hm(T(e.at)) : '')
            el('text', { x: 8, y: 30, class: 'muted' }, g).textContent = short(e.by) + ((who[e.by] || {}).blocked ? ' ⚠' : '')
            lines.forEach((ln, k) => { el('text', { x: 8, y: 46 + k * 15 }, g).textContent = ln })
            title(g, `${LABEL[e.label]}: ${e.decision}`)
            const pick = () => {
                const near = new Set([id]); for (const l of links) { if (l.from === id) near.add(l.to); if (l.to === id) near.add(l.from) }
                for (const k in boxes) boxes[k].classList.toggle('dim', !near.has(k))
                for (const l of links) { const on = l.from === id || l.to === id; l.path.classList.toggle('on', on); l.path.classList.toggle('dim', !on) }
                const by = who[e.by] || {}
                detail.innerHTML = `<span class="lab ${e.label}">${LABEL[e.label]} · ${esc(STATUS[e.status] || e.status)}</span><b>${esc(short(e.by))}</b>${e.at ? `, ${/T\d\d:\d\d/.test(e.at) ? day(T(e.at)) + ' ' + hm(T(e.at)) + ' UTC' : esc(e.at)}` : ''}: ${esc(e.decision)}` +
                    (e.note ? `<br><span class="meta">${esc(e.note)}</span>` : '') +
                    (e.reasons ? `<br><b>Reasons:</b> ${e.reasons.map(esc).join(' ')}` : '') + (e.against ? `<br><b>Against:</b> ${e.against.map(esc).join(' ')}` : '') +
                    ((e.to || []).length ? `<br>Touches: ${e.to.map(t => esc(short(t))).join(', ')}` : '') +
                    ((e.follows || []).length ? `<br>Followed: ${e.follows.map(f => esc(pos[f] ? pos[f].e.decision.slice(0, 70) : f)).join(' · ')}` : '') +
                    `<br><span class="meta">${safe(e.source) ? `<a href="${esc(e.source)}" rel="noopener">source</a>` : 'no public source'}${e.read ? ', read ' + esc(e.read.slice(11, 16) || e.read) : ''}${e.read_by ? ' by ' + esc(e.read_by) : ''}${by.blocked ? ' · ⚠ ' + esc(short(e.by)) + "'s own site: " + esc(by.blocked) : ''}</span>`
            }
            g.addEventListener('click', pick); g.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pick() } })
        }
    }

    // 3. the weather: observed against forecast, the warnings, the analysis (labelled), IPMA's five days
    const WX_STATIONS = ['1200535', '1210762', '6215360']
    function weather() {
        const box = mount.querySelector('#inc-wx'), wr = state.warnings, st = state.stations, fc = state.forecast, ap = state.airport, an = state.analysis
        if (!wr && !st) { box.innerHTML = '<p class="meta">No weather files yet.</p>'; return }
        const wl = an && an.wednesday_lisbon
        box.innerHTML = `<p class="meta">Kept by incident.meteorologist@web-summit.dinis from IPMA's open data and the airport's METAR and TAF (<a href="../../${esc(mount.dataset.dir)}weather/README.md">the weather README</a>). Facts, except the analysis, which is labelled.</p>
<h3>Mean wind observed, gusts at the airport, and IPMA's model (km/h, UTC)</h3><div class="inc-scroll" id="inc-obs"></div>
<p class="meta">Solid lines: mean wind at Lisbon stations (IPMA; this feed has no gusts). Dots: the airport's METAR gusts. Dashed: IPMA's hourly model, mean wind. Red band: the red wind warning.</p>
${wl ? `<div class="inc-detail"><span class="lab hypothesis">Analysis</span>by ${esc(an.by)} at ${hm(T(an.written_utc))}: worst <b>${hm(T(wl.worst_window_utc[0]))} to ${hm(T(wl.worst_window_utc[1]))}</b> on Wednesday, likely peak ${hm(T(wl.likely_peak_utc[0]))} to ${hm(T(wl.likely_peak_utc[1]))}, over by ${hm(T(wl.ends_utc))} (confidence: window ${esc(wl.confidence.window)}, peak ${esc(wl.confidence.peak_hour_and_strength)}). ${(an.lead_times || []).length ? `<br><b>Lead times:</b> ${an.lead_times.filter(l => Number.isFinite(+l.lead_hours) && l.lead_hours !== null).map(l => `${esc(l.warning)} ${Math.round(l.lead_hours)} h ahead`).join('; ')}` : ''}</div>` : ''}
<h3>Warnings, Lisbon district</h3><ul class="inc-warn">${((wr && wr.lisbon) || []).map(x => `<li style="border-left-color:${LEVEL[x.level] || 'var(--wait)'}"><b>${esc(x.level)} · ${esc(x.type)}</b>, ${day(T(x.start_utc))} ${hm(T(x.start_utc))} to ${day(T(x.end_utc))} ${hm(T(x.end_utc))} UTC: ${esc(x.text_pt)}</li>`).join('') || '<li>None above green.</li>'}</ul>
<h3>IPMA's forecast for Lisbon</h3><div class="inc-wx">${((fc && fc.daily && fc.daily.days) || []).map(dd => `<div><b>${day(T(dd.forecastDate + 'T12:00Z'))}</b>${esc(dd.tMin)}° to ${esc(dd.tMax)}°<br>rain ${Math.round(+dd.precipitaProb)}% (class ${esc(dd.classPrecInt)})<br>wind ${esc(dd.predWindDir)} (class ${esc(dd.classWindSpeed)})</div>`).join('')}</div>`
        const sts = ((st && st.stations) || []).filter(s => WX_STATIONS.includes(s.id)).map(s => ({ name: s.name, pts: (s.hourly || []).filter(h => h.wind_mean_kmh != null).map(h => [T(h.time_utc), h.wind_mean_kmh]) }))
        const gusts = ((ap && ap.metars) || []).filter(m => m.gust_kmh != null).map(m => [T(m.time_utc), m.gust_kmh, m.raw])
        const model = ((fc && fc.hourly && fc.hourly.rows) || []).filter(r => r.wind_mean_kmh != null).map(r => [T(r.time_utc), r.wind_mean_kmh])
        const red = ((wr && wr.lisbon) || []).filter(w => w.level === 'red' && /vento/i.test(w.type))
        const all = [...sts.flatMap(s => s.pts), ...gusts, ...model]; if (!all.length) return
        const t0 = Math.min(...all.map(p => p[0])), t1 = Math.max(...all.map(p => p[0]), ...red.map(w => T(w.end_utc)))
        const L = 40, W = Math.max(760, (t1 - t0) / 36e5 * 16 + L + 30), H = 240, top = 22, bot = 205
        const vmax = Math.ceil(Math.max(60, ...all.map(p => p[1])) / 20) * 20
        const x = t => L + (t - t0) / (t1 - t0) * (W - L - 20), y = v => bot - v / vmax * (bot - top)
        const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': 'Wind observed against forecast' }, mount.querySelector('#inc-obs'))
        for (const w of red) title(el('rect', { x: x(T(w.start_utc)), y: top, width: x(T(w.end_utc)) - x(T(w.start_utc)), height: bot - top, fill: 'var(--bad-soft)' }, svg), `red wind warning ${hm(T(w.start_utc))} to ${hm(T(w.end_utc))}`)
        for (let v = 0; v <= vmax; v += 20) { el('line', { x1: L, x2: W - 14, y1: y(v), y2: y(v), class: 'grid' }, svg); el('text', { x: 4, y: y(v) + 4, class: 'muted' }, svg).textContent = v }
        for (let t = Math.ceil(t0 / 36e5) * 36e5; t <= t1; t += 36e5) { const h = new Date(t).getUTCHours(); if (h % 6 === 0) el('text', { x: x(t) - 12, y: bot + 16, class: 'muted' }, svg).textContent = h === 0 ? day(t).replace(/^\w+ /, '') : hm(t) }
        const COLS = ['var(--accent)', 'var(--sent)', 'var(--ok)']
        if (model.length) title(el('polyline', { points: model.map(p => `${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`).join(' '), fill: 'none', stroke: 'var(--ink-2)', 'stroke-width': 2, 'stroke-dasharray': '6 4' }, svg), "IPMA's hourly model, mean wind")
        sts.forEach((s, k) => { if (s.pts.length) title(el('polyline', { points: s.pts.map(p => `${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`).join(' '), fill: 'none', stroke: COLS[k % 3], 'stroke-width': 2.2 }, svg), s.name + ', mean wind') })
        for (const g of gusts) title(el('circle', { cx: x(g[0]), cy: y(g[1]), r: 3.2, fill: 'var(--warm)' }, svg), `${hm(g[0])}: gust ${g[1]} km/h (${g[2]})`)
        const nx = x(Date.now()); if (nx > L && nx < W) { el('line', { x1: nx, x2: nx, y1: top, y2: bot, class: 'now' }, svg); el('text', { x: nx + 4, y: top + 10, class: 'muted' }, svg).textContent = 'now' }
        const leg = [...sts.map((s, k) => [COLS[k % 3], s.name]), ['var(--warm)', 'Airport gusts (METAR)'], ['var(--ink-2)', 'IPMA model (dashed)']]
        let lx = L; for (const [c, n] of leg) { el('rect', { x: lx, y: 6, width: 12, height: 4, fill: c }, svg); const t = el('text', { x: lx + 16, y: 12, class: 'muted' }, svg); t.textContent = n; lx += 26 + n.length * 6.2 }
        mount.querySelector('#inc-obs').scrollLeft = Math.max(0, nx - 500)
    }

    function list() {
        const items = (state.signals && state.signals.items) || []
        mount.querySelector('#inc-list').innerHTML = `<table class="inc-list"><thead><tr><th>UTC</th><th>Label</th><th>What</th><th>Source</th></tr></thead><tbody>${items.map(i => `<tr><td>${i.approx ? '~' : ''}${day(T(i.at))} ${hm(T(i.at))}</td><td><span class="lab ${i.label}">${LABEL[i.label]}</span></td><td>${esc(i.text)}</td><td>${srcHtml(i.sources)}</td></tr>`).join('')}</tbody></table>`
    }

    load().catch(e => { mount.innerHTML = `<p class="inc-err">The data could not be read: ${esc(e.message)}</p>` })
    setInterval(() => { if (!document.hidden) load().catch(() => { }) }, POLL_MS)
})()
