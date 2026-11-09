// The brain (dashboard@web-summit.silvio, 7 November 2026), on the command centres of Silvio, Angelo and Jose: two
// brains on one 3D map. "My brain" is the second brain of "The Second Brain Build (Claude Code)": what you capture,
// organised by Claude, kept in this browser only (nothing is sent to the site). "Summit brain" is the public CRM of
// Web Summit 2026 (companies, organisations, speakers, sessions, pitches, side events, topics) joined to what the site
// already has (the team, our company map and its reasons, our open summit tasks): public facts only, from
// summit-brain.json beside this file. Each person's balloon is their T-shirt colour (the print set, /print/).
// The 3D libraries (3d-force-graph 1.80.1, three 0.186.1) are bundled in brain-libs.js, same origin, loaded only when
// the map opens. Built in Silvio's Lab first, then brought here at his word.
(function () {
    'use strict'
    const BASE = (document.currentScript && document.currentScript.src || location.href).replace(/[^/]*$/, '')
    const LS = 'cc.brain', COLS = ['inbox', 'wiki', 'outputs']
    const empty = () => ({ inbox: [], notes: [], reports: [] })
    const local = () => { try { return JSON.parse(localStorage.getItem(LS)) || null } catch { return null } }
    let cache = local() || empty(), db = null, sample = null, ready = false
    const changed = () => window.dispatchEvent(new Event('cc-brain'))
    const toDocs = b => ({ inbox: b.inbox, wiki: b.notes.filter(n => n.kind !== 'answer'), outputs: b.notes.filter(n => n.kind === 'answer') })
    // writes one at a time, only what changed
    let queue = Promise.resolve()
    function sync(prev, next) {
        if (!db) return
        const a = toDocs(prev), z = toDocs(next)
        for (const c of COLS) {
            const old = new Map(a[c].map(x => [x.id, JSON.stringify(x)])), now = new Map(z[c].map(x => [x.id, x]))
            for (const [id, x] of now) if (old.get(id) !== JSON.stringify(x)) queue = queue.then(() => db.collection(c).doc(id).set(x)).catch(e => console.warn('brain write', e && e.message))
            for (const id of old.keys()) if (!now.has(id)) queue = queue.then(() => c === 'inbox' ? db.collection(c).doc(id).delete() : db.collection(c).doc(id).set({ deleted: true })).catch(e => console.warn('brain delete', e && e.message))
        }
        if (JSON.stringify(prev.reports) !== JSON.stringify(next.reports)) queue = queue.then(() => db.collection('reports').doc('latest').set({ list: next.reports.slice(0, 10) })).catch(() => {})
    }
    const api = {
        get: () => cache,
        set: b => { const prev = cache; cache = { inbox: b.inbox || [], notes: b.notes || [], reports: b.reports || [] }; try { localStorage.setItem(LS, JSON.stringify(cache)) } catch {} ; if (ready) sync(prev, cache) },
        hasLLM: () => !!sample,
        llm: async prompt => { const r = await sample(prompt, { modelTier: 'default' }); return (r && r.text) || '' },
        where: () => db ? 'this private page' : 'this browser',
        graph, pulse, intro,
    }
    // how the brain works, in one card: four steps, the colours, and where things come from
    function intro() {
        let hide = false; try { hide = localStorage.getItem('cc.brain.intro') === 'hidden' } catch {}
        if (hide) return `<div class="cc-span-12 bi-again"><button type="button" class="bi-q" data-bi="show" aria-label="How the brain works">?</button><span>How the brain works</span></div>`
        const step = (n, t, d, svg) => `<li><div class="bi-ico" aria-hidden="true">${svg}</div><div><b><span>${n}</span>${t}</b><p>${d}</p></div></li>`
        const I = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`
        return `<section class="cc-card cc-span-12 bi" aria-labelledby="bi-h"><header class="bi-head"><h2 id="bi-h">How the brain works</h2><button type="button" class="more" data-bi="hide">Got it ✕</button></header>
<p class="bi-lead">Your second brain keeps everything about Web Summit in one place and lets Claude connect it. Nothing to sort: you throw things in, Claude files them and links them, and you ask questions.</p>
<ol class="bi-steps">
${step(1, 'Capture', 'Paste anything into <b>Capture</b> (a note, a link, an email, what someone said at the stand). It lands in the <b>Inbox</b>. At the stand, what visitors ask goes in by itself.', I('<path d="M12 5v14M5 12h14"/>'))}
${step(2, 'Claude organises', '<b>Organise with Claude</b> turns each item into a note in the <b>Wiki</b>: a title, 3 lines of summary, tags, and links to the notes on the same theme. It also reports the themes and anything that contradicts.', I('<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>'))}
${step(3, 'Ask', '<b>Ask my brain</b> answers only from your notes, and shows which notes it used. If the answer is not there, it says so instead of guessing.', I('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'))}
${step(4, 'Save, and it gets sharper', '<b>Save as a note</b> puts a good answer in <b>Outputs</b>, linked to the notes it came from. Next time, the brain uses your own past thinking.', I('<path d="M5 12l4 4L19 6"/>'))}
</ol>
<div class="bi-map"><h3>Reading the map</h3><p>Every point is a note; every line is a link between two notes. Bigger points have more links. Tap a point to read it; <b>Play demo</b> flies through the main themes; <b>Cinema</b> fills the screen for the stand.</p>
<p class="bi-legend">${LEG.map(([k, l]) => `<span><i style="--c:${COL[k]}"></i>${l}</span>`).join('')}</p></div>
<div class="bi-map"><h3>Where things come from</h3><ul>
${db ? '' : '<li><b>The Summit brain</b>: the public CRM of Web Summit (companies, speakers, sessions, pitches, side events, topics) joined to our team, our company map and our summit tasks. Switch to it at the top of the map.</li>'}${db ? `<li><b>The Summit demo</b>: every visitor becomes a point, linked to their company, the themes they asked about, who follows up, and their stage in the plan (Visitor → Lead → Meeting → Customer).</li>
<li><b>The plan</b>: the pipeline stages are points of their own, and Dinis's answers to the six questions become notes the brain can quote.</li>` : ''}
<li><b>The site</b>: the tasks, the companies we mapped, the sessions, side events, the team and their agents.</li>
<li><b>You</b>: whatever you capture. ${db ? 'Private: only people who can edit this page can read it.' : 'It stays in this browser only: nothing is sent to the site. <b>Export</b> keeps a copy.'}</li></ul></div></section>`
    }
    document.addEventListener('click', e => { const b2 = e.target.closest && e.target.closest('[data-bi]'); if (!b2) return; try { localStorage.setItem('cc.brain.intro', b2.dataset.bi === 'hide' ? 'hidden' : 'shown') } catch {} ; window.dispatchEvent(new Event('cc-brain')) })
    window.CC_BRAIN = api
    // the page's own folders, live: another device or Claude Code writing them shows up here
    ;(async () => {
        if (!window.claude || !window.claude.use) return
        try { sample = await window.claude.use('sample') } catch { sample = null }
        try { db = await window.claude.use('db') } catch { db = null }
        if (!db) { changed(); return }
        const parts = { inbox: null, wiki: null, outputs: null, reports: null }
        const merge = () => {
            if (Object.values(parts).some(x => x === null)) return
            cache = { inbox: parts.inbox.sort((x, y) => String(x.at).localeCompare(String(y.at))), notes: [...parts.wiki, ...parts.outputs], reports: parts.reports }
            try { localStorage.setItem(LS, JSON.stringify(cache)) } catch {}
            ready = true; changed(); if (G.fg) G.refresh()
        }
        const t = setTimeout(() => { if (!ready) { db = null; changed() } }, 10000)
        const unpack = docs => { const base = [], own = new Map(), dead = new Set(); for (const d of docs) { const x = d.data() || {}; if (Array.isArray(x.pack)) base.push(...x.pack); else if (x.deleted) dead.add(d.id); else own.set(d.id, { ...x, id: d.id }) } return [...base.filter(n => !own.has(n.id) && !dead.has(n.id)), ...own.values()] }
        for (const c of COLS) db.collection(c).limit(1000).onSnapshot(s => { clearTimeout(t); parts[c] = c === 'inbox' ? s.docs.map(d => ({ ...d.data(), id: d.id })) : unpack(s.docs); merge() }, () => { clearTimeout(t) })
        db.collection('reports').limit(5).onSnapshot(s => { const d = s.docs.find(x => x.id === 'latest'); parts.reports = d ? (d.data().list || []) : []; merge() }, () => { parts.reports = []; merge() })
    })()

    // ---------------- the 3D map, premium: points of light, real glow (bloom), deep space, a geodesic core ----------------
    // One graphics engine for all: 3d-force-graph 1.80.1 as a module, and three 0.186.1 (the version it is built on)
    // for the glow pass, the stars, the core and the ring. Sharp on Retina: pixel ratio up to 2.
    const COL = { hub: '#F2C66D', person: '#E6ECFF', issue: '#E46FD0', company: '#F79A62', session: '#41D3EE', side: '#9B8CFF', agent: '#56E0A8', answer: '#C7A5FF', note: '#EE8FD6', merch: '#F2D27A', visitor: '#FF6B86', speaker: '#A9C7FF', org: '#B9A07A', pitch: '#FF9DB5', ours: '#F2C66D' }
    const LEGS = { summit: [['visitor', 'Visitors'], ['ours', 'RiskMandate'], ['person', 'Our team'], ['issue', 'Our tasks'], ['hub', 'Topics'], ['company', 'Companies'], ['org', 'Organisations'], ['speaker', 'Speakers'], ['session', 'Sessions'], ['pitch', 'Pitches'], ['side', 'Side events']] }
    const LEG = [['visitor', 'Visitors'], ['hub', 'Themes'], ['person', 'People'], ['issue', 'Tasks'], ['session', 'Sessions'], ['side', 'Side events'], ['company', 'Companies'], ['agent', 'Agents'], ['note', 'My notes'], ['answer', 'Answers']]
    const G = { fg: null, holder: null, sig: '', hot: new Set(), hotLinks: new Set(), off: new Set(), raf: 0, opts: {}, demo: null, deco: null }
    let THREE = null, FG = null, Bloom = null
    const libs = async () => { if (FG) return; if (window.BrainLibs) { FG = window.BrainLibs.ForceGraph3D; THREE = window.BrainLibs.THREE; Bloom = window.BrainLibs.UnrealBloomPass; return } await new Promise((ok, no) => { const s = document.createElement('script'); s.src = BASE + 'brain-libs.js'; s.onload = ok; s.onerror = () => no(new Error('brain-libs.js')); document.head.appendChild(s) }); const m = window.BrainLibs; FG = m.ForceGraph3D; THREE = m.THREE; Bloom = m.UnrealBloomPass }
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    // each person's balloon in their T-shirt colour (the print set, /print/), as luminous glass:
    // black → smoked obsidian, royal blue → sapphire, green → emerald, orange → amber, purple → amethyst, red → ruby, yellow → gold
    const SHIRT = { dinis: '#7D879E', nimay: '#4F7BFF', angelo: '#2ED48C', jose: '#FF8A3D', vicky: '#A877FF', silvio: '#FF3347', indi: '#FFD23F' }
    const colOf = n => { const m = /^(?:ours:)?p-([a-z]+)$/.exec(n.id || ''); return (m && SHIRT[m[1]]) || COL[n.type] }
    const typeOf = n => n.kind === 'answer' ? 'answer' : (n.type && COL[n.type] ? n.type : 'note')
    // a soft point of light: white-hot centre, the colour, then a long faint halo
    const TEX = {}
    function glow(color) {
        if (TEX[color]) return TEX[color]
        const s = 256, c = document.createElement('canvas'); c.width = c.height = s; const g = c.getContext('2d')
        const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
        r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.07, 'rgba(255,255,255,0.9)'); r.addColorStop(0.14, color); r.addColorStop(0.3, color + '66'); r.addColorStop(0.55, color + '18'); r.addColorStop(1, color + '00')
        g.fillStyle = r; g.fillRect(0, 0, s, s)
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return (TEX[color] = t)
    }
    const mix = (hex, to, k) => { const a = parseInt(hex.slice(1), 16), b = parseInt(to.slice(1), 16); const c = s => Math.round(((a >> s) & 255) * (1 - k) + ((b >> s) & 255) * k); return `rgb(${c(16)},${c(8)},${c(0)})` }
    function orb(color) {
        const k = 'glass' + color; if (TEX[k]) return TEX[k]
        const s = 512, c = document.createElement('canvas'); c.width = c.height = s; const g = c.getContext('2d'), m = s / 2, R = s * 0.4
        const rgba = (hex, al) => { const v = parseInt(hex.slice(1), 16); return `rgba(${(v >> 16) & 255},${(v >> 8) & 255},${v & 255},${al})` }
        let r = g.createRadialGradient(m, m, R * 0.98, m, m, R * 1.22)                     // a faint outer glow
        r.addColorStop(0, rgba(color, 0.28)); r.addColorStop(1, rgba(color, 0)); g.fillStyle = r; g.beginPath(); g.arc(m, m, R * 1.22, 0, 7); g.fill()
        r = g.createRadialGradient(m, m, 0, m, m, R)                                          // the glass: almost clear inside, coloured toward the edge
        r.addColorStop(0, rgba(color, 0.03)); r.addColorStop(0.55, rgba(color, 0.06)); r.addColorStop(0.82, rgba(color, 0.24)); r.addColorStop(0.95, rgba(color, 0.7)); r.addColorStop(1, rgba(color, 0.9))
        g.fillStyle = r; g.beginPath(); g.arc(m, m, R, 0, 7); g.fill()
        g.lineWidth = s * 0.006; g.strokeStyle = mix(color, '#FFFFFF', 0.7); g.beginPath(); g.arc(m, m, R - g.lineWidth / 2, 0, 7); g.stroke()   // the rim
        r = g.createLinearGradient(m - R * 0.7, m - R * 0.7, m, m)                             // the window highlight, top-left
        r.addColorStop(0, 'rgba(255,255,255,0.85)'); r.addColorStop(1, 'rgba(255,255,255,0)')
        g.fillStyle = r; g.beginPath(); g.ellipse(m - R * 0.36, m - R * 0.42, R * 0.38, R * 0.2, -0.75, 0, 7); g.fill()
        g.fillStyle = 'rgba(255,255,255,0.9)'; g.beginPath(); g.arc(m - R * 0.5, m - R * 0.52, R * 0.06, 0, 7); g.fill()   // a sharp glint
        r = g.createRadialGradient(m + R * 0.42, m + R * 0.5, 0, m + R * 0.42, m + R * 0.5, R * 0.3)   // a soft reflection, bottom-right
        r.addColorStop(0, rgba(mixHex(color, '#FFFFFF', 0.5), 0.45)); r.addColorStop(1, rgba(color, 0)); g.fillStyle = r; g.beginPath(); g.ellipse(m + R * 0.42, m + R * 0.5, R * 0.3, R * 0.14, -0.75, 0, 7); g.fill()
        const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; return (TEX[k] = tx)
    }
    const mixHex = (hex, to, k) => { const a = parseInt(hex.slice(1), 16), b = parseInt(to.slice(1), 16); const c = s => Math.round(((a >> s) & 255) * (1 - k) + ((b >> s) & 255) * k); return '#' + [c(16), c(8), c(0)].map(x => x.toString(16).padStart(2, '0')).join('') }
    // a nebula: no bright centre, only a soft wash of colour
    function veil(color) {
        const k = 'veil' + color; if (TEX[k]) return TEX[k]
        const s = 256, c = document.createElement('canvas'); c.width = c.height = s; const g = c.getContext('2d')
        const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); r.addColorStop(0, color + '30'); r.addColorStop(0.5, color + '12'); r.addColorStop(1, color + '00')
        g.fillStyle = r; g.fillRect(0, 0, s, s); const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; return (TEX[k] = tx)
    }
    const sizeOf = n => n.type === 'ours' ? 34 : n.type === 'hub' ? 27 + Math.min(12, n.deg * 0.28) : n.type === 'person' ? 23 + Math.min(7, n.deg * 0.18) : n.type === 'visitor' ? 20 : 11 + Math.min(9, n.deg * 1.0)
    let SUMMIT = null
    const loadSummit = () => SUMMIT ? Promise.resolve(SUMMIT) : fetch(BASE + 'summit-brain.json').then(r => r.json()).then(x => (SUMMIT = x)).catch(() => (SUMMIT = []))
    function source() {
        if (G.which !== 'summit') return cache.notes
        const live = cache.notes.filter(n => n.type === 'visitor' || /^h-stage-|^plan-|^c-new-/.test(n.id))
        const byTitle = new Map((SUMMIT || []).filter(n => n.type === 'company' || n.type === 'org').map(n => [String(n.title).toLowerCase().split(' (')[0], n.id]))
        // a visitor links to the CRM's company of the same name, and to RiskMandate
        const liv = live.map(n => ({ ...n, links: [...(n.related || []).map(r => byTitle.get(String(r).toLowerCase().split(' (')[0])).filter(Boolean), 'ours:riskmandate'] }))
        return [...(SUMMIT || []), ...liv]
    }
    function data() {
        const notes = source().filter(n => !G.off.has(typeOf(n)))
        const byTitle = new Map(notes.map(n => [String(n.title).trim().toLowerCase(), n.id]))
        const nodes = notes.map(n => ({ id: n.id, title: n.title, type: typeOf(n), deg: 0, n }))
        const ids = new Set(nodes.map(x => x.id)), seen = new Set(), links = []
        for (const n of notes) for (const to of n.links || []) {
            if (!to || to === n.id || !ids.has(to)) continue
            const k = n.id < to ? n.id + '|' + to : to + '|' + n.id; if (seen.has(k)) continue; seen.add(k); links.push({ source: n.id, target: to, c: COL[typeOf(n)] })
        }
        for (const n of notes) for (const r of n.related || []) {
            const to = byTitle.get(String(r).trim().toLowerCase()); if (!to || to === n.id || !ids.has(to)) continue
            const k = n.id < to ? n.id + '|' + to : to + '|' + n.id; if (seen.has(k)) continue; seen.add(k); links.push({ source: n.id, target: to, c: COL[typeOf(n)] })
        }
        const deg = new Map(); links.forEach(l => { deg.set(l.source, (deg.get(l.source) || 0) + 1); deg.set(l.target, (deg.get(l.target) || 0) + 1) })
        nodes.forEach(x => { x.deg = deg.get(x.id) || 0 })
        if (G.which === 'summit') { // the main network only: loose islands drift off and shrink the view
            const adj = new Map(); links.forEach(l => { (adj.get(l.source) || adj.set(l.source, []).get(l.source)).push(l.target); (adj.get(l.target) || adj.set(l.target, []).get(l.target)).push(l.source) })
            const keep = new Set(['ours:riskmandate']), q = ['ours:riskmandate']; while (q.length) for (const y of adj.get(q.pop()) || []) if (!keep.has(y)) { keep.add(y); q.push(y) }
            const ns = nodes.filter(x => keep.has(x.id) || x.type === 'visitor'); return { nodes: ns, links: links.filter(l => keep.has(l.source) && keep.has(l.target)) } }
        return { nodes, links }
    }
    const sigOf = () => (G.which || 'mine') + ':' + (SUMMIT ? SUMMIT.length : 0) + ':' + cache.notes.length + ':' + cache.notes.map(n => n.id + (n.related || []).length).join(',').length + ':' + [...G.off].join()
    const legend = () => (G.which === 'summit' ? LEGS.summit : LEG).map(([k, l]) => `<button type="button" data-bm-type="${k}" aria-pressed="${!G.off.has(k)}"><i style="--c:${COL[k]}"></i>${l}</button>`).join('')
    const who = () => { const n = (document.querySelector('.cc-me b') || {}).textContent || ''; return n ? n.split(' ')[0] + "'s brain" : 'My brain' }
    function shell() {
        const h = document.createElement('div'); h.className = 'bm'
        h.innerHTML = `<div class="bm-canvas" aria-label="A 3D map of the brain: drag to turn, pinch or scroll to zoom, tap a point to open the note"></div><div class="bm-vignette" aria-hidden="true"></div><div class="bm-labels" aria-hidden="true"></div>
<div class="bm-top"><div class="bm-title"><b class="bm-name">${G.which === 'summit' ? 'Summit brain' : esc(who())}</b><span class="bm-count"></span></div><div class="bm-which" role="group" aria-label="Which brain"><button type="button" data-bm-which="mine" aria-pressed="${G.which !== 'summit'}">My brain</button><button type="button" data-bm-which="summit" aria-pressed="${G.which === 'summit'}">Summit brain</button></div><label class="sr" for="bm-q">Find in the map</label><input id="bm-q" class="bm-q" type="search" placeholder="Find…" autocomplete="off"></div>
<div class="bm-card" hidden></div>
<button type="button" class="bm-exit" data-bm="cinema" aria-label="Leave cinema">✕</button>
<div class="bm-msg" hidden></div>`
        G.dock = document.createElement('div'); G.dock.className = 'bm-dock'
        G.dock.innerHTML = `<div class="bm-legend" role="group" aria-label="Show or hide a kind">${legend()}</div><div class="bm-bar" role="group" aria-label="The map"><button type="button" class="bm-btn play" data-bm="demo">▶ Play demo</button><button type="button" class="bm-btn bm-fullbtn" data-bm="full" aria-pressed="false" title="Full screen">${FULL_ICO(false)}<span class="lbl">Full screen</span></button><button type="button" class="bm-btn" data-bm="cinema">Cinema</button><button type="button" class="bm-btn" data-bm="reset">Reset</button></div>`
        const onClick = e => {
            const t = e.target.closest('[data-bm],[data-bm-type],[data-bm-go],[data-bm-open],[data-bm-which]'); if (!t) return
            if (t.dataset.bmWhich) { const w = t.dataset.bmWhich; if (w === (G.which || 'mine')) return; G.which = w; G.off.clear(); stopDemo(); card(null); G.hot.clear(); G.hotLinks.clear()
                h.querySelectorAll('[data-bm-which]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.bmWhich === w))); h.querySelector('.bm-name').textContent = w === 'summit' ? 'Summit brain' : who(); G.dock.querySelector('.bm-legend').innerHTML = legend()
                const go = () => { G.refresh(true); setTimeout(() => { G.fg.zoomToFit(1000, 30); fitRing() }, 1800) }; if (w === 'summit') { h.querySelector('.bm-count').textContent = 'Opening the Summit brain…'; loadSummit().then(go) } else go(); return }
            if (t.dataset.bmType) { const k = t.dataset.bmType; G.off.has(k) ? G.off.delete(k) : G.off.add(k); t.setAttribute('aria-pressed', String(!G.off.has(k))); G.refresh(true) }
            else if (t.dataset.bmGo) { const n = G.fg.graphData().nodes.find(x => x.id === t.dataset.bmGo); if (n) focus(n) }
            else if (t.dataset.bmOpen) { G.opts.open && G.opts.open(t.dataset.bmOpen) }
            else if (t.dataset.bm === 'demo') G.demo ? stopDemo() : demo()
            else if (t.dataset.bm === 'cinema') cinema()
            else if (t.dataset.bm === 'full') full()
            else if (t.dataset.bm === 'reset') { stopDemo(); G.hot.clear(); G.hotLinks.clear(); card(null); G.fg.zoomToFit(900, 30); paint() }
            else if (t.dataset.bm === 'close') card(null)
        }
        h.addEventListener('click', onClick); G.dock.addEventListener('click', onClick)
        h.querySelector('.bm-q').addEventListener('input', e => {
            const v = e.target.value.trim().toLowerCase(); G.hot.clear(); G.hotLinks.clear()
            if (v.length > 1) G.fg.graphData().nodes.forEach(n => { if ((n.title + ' ' + (n.n.tags || []).join(' ')).toLowerCase().includes(v)) G.hot.add(n.id) })
            paint()
        })
        return h
    }
    // highlight: the chosen points stay bright, the rest fade into the sky
    function paint() {
        if (!G.fg) return
        const dim = G.hot.size > 0
        G.fg.graphData().nodes.forEach(n => { const sp = n.__sp; if (!sp) return; const on = !dim || G.hot.has(n.id); sp.material.opacity = on ? 1 : 0.12; sp.scale.setScalar(sizeOf(n) * (dim && G.hot.has(n.id) ? 1.35 : 1)) })
        G.fg.linkColor(l => G.hotLinks.has(l) ? '#FFFFFF' : l.c).linkOpacity(dim ? 0.05 : 0.18)
            .linkWidth(l => G.hotLinks.has(l) ? 0.9 : 0)
            .linkDirectionalParticles(l => G.hotLinks.has(l) ? 5 : 0)
    }
    function card(n) {
        const c = G.holder.querySelector('.bm-card'); if (!n) { c.hidden = true; return }
        const rel = G.fg.graphData().links.filter(l => l.source.id === n.id || l.target.id === n.id).map(l => l.source.id === n.id ? l.target : l.source)
        c.innerHTML = `<button type="button" class="bm-x" data-bm="close" aria-label="Close">✕</button><p class="bm-kind"><i style="--c:${colOf(n)}"></i>${esc((LEG.find(x => x[0] === n.type) || [, 'Note'])[1])}${n.n.tags && n.n.tags.length ? ' · ' + n.n.tags.slice(0, 4).map(t => '#' + esc(t)).join(' ') : ''}</p><h3>${esc(n.title)}</h3>
${n.n.bullets && n.n.bullets.length ? `<ul>${n.n.bullets.slice(0, 4).map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : n.n.body ? `<p>${esc(String(n.n.body).slice(0, 280))}…</p>` : ''}
${rel.length ? `<p class="bm-rel">Related: ${rel.slice(0, 8).map(r => `<button type="button" data-bm-go="${esc(r.id)}">${esc(r.title)}</button>`).join(' · ')}${rel.length > 8 ? ` · +${rel.length - 8}` : ''}</p>` : ''}
<p class="bm-acts">${G.which === 'summit' && n.n.src ? '' : `<button type="button" class="bm-btn" data-bm-open="${esc(n.id)}">Open the note</button>`}${n.n.url ? ` <a class="bm-btn" href="${esc(n.n.url)}" target="_blank" rel="noopener">Source ↗</a>` : ''}</p>`
        c.hidden = false
    }
    function focus(n, ms = 1500) {
        const d = 120 + Math.min(140, n.deg * 6), r = Math.hypot(n.x || 1, n.y || 1, n.z || 1) || 1, k = 1 + d / r
        G.fg.cameraPosition({ x: (n.x || 1) * k, y: (n.y || 1) * k, z: (n.z || 1) * k }, n, ms)
        G.hot = new Set([n.id]); G.hotLinks = new Set()
        G.fg.graphData().links.forEach(l => { if (l.source.id === n.id || l.target.id === n.id) { G.hot.add(l.source.id); G.hot.add(l.target.id); G.hotLinks.add(l) } })
        paint(); card(n)
    }
    // names float over the biggest points (or the highlighted ones), crisp HTML text, nearer ones brighter
    function labels() {
        const box = G.holder && G.holder.querySelector('.bm-labels')
        if (box && G.fg && box.isConnected) {
            const ns = G.fg.graphData().nodes, cam = G.fg.camera()
            const pick = G.hot.size ? ns.filter(n => G.hot.has(n.id)).sort((a, b) => b.deg - a.deg).slice(0, 14) : [...ns].filter(n => n.type === 'hub' || n.type === 'person' || n.type === 'ours' || (G.which === 'summit' && n.deg > 12)).sort((a, b) => b.deg - a.deg).slice(0, 12)
            const placed = [], W = box.clientWidth, H = box.clientHeight
            box.innerHTML = pick.map(n => { const p = G.fg.graph2ScreenCoords(n.x || 0, n.y || 0, n.z || 0); const txt = n.title.length > 30 ? n.title.slice(0, 29) + '…' : n.title, w = txt.length * 7.4 + 20, y = p.y - 14; if (p.x < 0 || p.x > W || y < 60 || y > H - 70) return ''; if (placed.some(q => Math.abs(q.x - p.x) < (q.w + w) / 2 && Math.abs(q.y - y) < 26)) return ''; placed.push({ x: p.x, y, w }); const dist = cam.position.distanceTo({ x: n.x || 0, y: n.y || 0, z: n.z || 0 }); const o = Math.max(0.75, Math.min(1, 1300 / dist)); return `<span class="${n.type === 'hub' || n.type === 'person' ? 'big' : ''}" style="transform:translate(${p.x | 0}px,${y | 0}px);opacity:${o.toFixed(2)}">${esc(txt)}</span>` }).join('')
        }
        if (G.sky) G.sky.rotation.y += 0.00004; if (G.stars) G.stars.material.opacity = 0.7 + Math.sin(performance.now() / 700) * 0.1
        if (G.deco) { const t = performance.now() / 1000; G.deco.core.rotation.y = t * 0.12; G.deco.core.rotation.x = t * 0.05; G.deco.halo.material.opacity = 0.55 + Math.sin(t * 1.3) * 0.12 }
        G.raf = requestAnimationFrame(labels)
    }
    // deep space: far stars, two soft nebulae, the geodesic core with its glow, and the orbit ring
    // a seeded random, value noise and fractal noise, to paint the sky the same way every time
    const rng = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(20261109)
    const P = new Uint8Array(512); { const q = [...Array(256).keys()]; for (let i = 255; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [q[i], q[j]] = [q[j], q[i]] } for (let i = 0; i < 512; i++) P[i] = q[i & 255] }
    const H = (x, y) => P[(P[x & 255] + y) & 511] / 255, sm = t => t * t * (3 - 2 * t)
    const noise = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = sm(xf), v = sm(yf); const a = H(xi, yi), b = H(xi + 1, yi), c = H(xi, yi + 1), d = H(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v }
    const fbm = (x, y, o = 5) => { let f = 0, a = 0.5, s = 1; for (let i = 0; i < o; i++) { f += a * noise(x * s, y * s); s *= 2; a *= 0.5 } return f }
    function sky() {
        const C = document.createElement('canvas'); C.width = 4096; C.height = 2048; const G2 = C.getContext('2d')
        const bg = G2.createLinearGradient(0, 0, 0, C.height); bg.addColorStop(0, '#020309'); bg.addColorStop(0.5, '#03050D'); bg.addColorStop(1, '#020309'); G2.fillStyle = bg; G2.fillRect(0, 0, C.width, C.height)
        const tint = () => { const t = rng(); return t < 0.6 ? [215, 228, 255] : t < 0.85 ? [255, 246, 232] : t < 0.95 ? [255, 222, 180] : [170, 196, 255] }
        for (let k = 0; k < 7000; k++) { const x = rng() * C.width, y = rng() * C.height, m = Math.pow(rng(), 6), [r, g, b] = tint(); G2.fillStyle = `rgba(${r},${g},${b},${0.18 + m * 0.7})`; G2.beginPath(); G2.arc(x, y, 0.5 + m * 1.3, 0, 7); G2.fill() }
        const tx = new THREE.CanvasTexture(C); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8; return tx
    }
    function decorate() {
        const sc = G.fg.scene(), add = o => (sc.add(o), o)
        const N = 1400, pos = new Float32Array(N * 3), col = new Float32Array(N * 3)
        for (let i = 0; i < N; i++) { const r = 1800 + Math.random() * 2200, u = Math.random() * 2 - 1, a = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u); pos.set([r * s * Math.cos(a), r * u, r * s * Math.sin(a)], i * 3); const w = 0.55 + Math.random() * 0.45; col.set([w * (0.8 + Math.random() * 0.2), w * (0.85 + Math.random() * 0.15), w], i * 3) }
        const gs = new THREE.BufferGeometry(); gs.setAttribute('position', new THREE.BufferAttribute(pos, 3)); gs.setAttribute('color', new THREE.BufferAttribute(col, 3))
        G.stars = add(new THREE.Points(gs, new THREE.PointsMaterial({ size: 1.2, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0.8, depthWrite: false })))
        const neb = (c, x, y, z, s) => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: veil(c), transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending })); m.position.set(x, y, z); m.scale.setScalar(s); return add(m) }
        try { const cam = G.fg.camera(); cam.far = 30000; cam.updateProjectionMatrix(); const skyM = new THREE.Mesh(new THREE.SphereGeometry(12000, 64, 32), new THREE.MeshBasicMaterial({ map: sky(), side: THREE.BackSide, depthWrite: false, toneMapped: false })); skyM.rotation.set(0.35, 0, 0.5); add(skyM); G.sky = skyM } catch (e) { console.warn('sky', e && e.message) }
        const core = add(new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(34, 2)), new THREE.LineBasicMaterial({ color: '#7FF3FF', transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })))
        const halo = add(new THREE.Sprite(new THREE.SpriteMaterial({ map: glow('#40E6FF'), transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending }))); halo.scale.setScalar(190)
        const ringPts = []; for (let i = 0; i <= 160; i++) { const a = i / 160 * Math.PI * 2; ringPts.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a))) }
        const ring = add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(ringPts), new THREE.LineBasicMaterial({ color: '#59D8FF', transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })))
        ring.rotation.set(1.2, 0.2, -0.15); ring.scale.setScalar(420)
        G.deco = { core, halo, ring }
    }
    G.refresh = force => {
        if (!G.fg) return; const s = sigOf(); if (!force && s === G.sig) return; G.sig = s
        const d = data(), big = G.which === 'summit'
        G.fg.d3Force('charge').strength(big ? -34 : -70); G.fg.d3Force('link').distance(l => (l.source.type === 'hub' || l.target.type === 'hub' || l.source.type === 'ours' || l.target.type === 'ours') ? (big ? 48 : 70) : (big ? 22 : 38))
        G.fitNext = !!force; G.fg.graphData(d); paint()
        const cnt = G.holder.querySelector('.bm-count'); if (cnt) cnt.textContent = `${d.nodes.length} notes · ${d.links.length} links`
    }
    async function graph(el, b, opts) {
        G.opts = opts || {}
        if (G.which == null) G.which = cache.notes.length ? 'mine' : 'summit'
        if (G.which === 'summit') await loadSummit()
        if (!G.holder) G.holder = shell()
        el.appendChild(G.holder)
        G.mapEl = el; if (!G.holder.classList.contains('full')) placeDock(el)
        const msg = G.holder.querySelector('.bm-msg')
        if (!cache.notes.length && G.which !== 'summit') { msg.hidden = false; msg.textContent = db && !ready ? 'Opening your brain…' : 'Empty for now: capture things above and organise them with Claude, and they appear here.' }
        else msg.hidden = true
        try { await libs() } catch (e) { msg.hidden = false; msg.textContent = 'The 3D map could not load (' + (e.message || e) + ').'; return }
        const cv = G.holder.querySelector('.bm-canvas')
        const size = () => { const r = G.holder.getBoundingClientRect(); if (G.fg && r.width) { G.fg.width(r.width).height(r.height); if (G.bloom) G.bloom.setSize(r.width, r.height) } }
        if (!G.fg) {
            G.fg = new FG(cv, { controlType: 'orbit', rendererConfig: { antialias: true, alpha: false, powerPreference: 'high-performance' } })
                .backgroundColor('#03040C').showNavInfo(false)
                .nodeLabel(n => `<b>${esc(n.title)}</b>`).nodeRelSize(4)
                .nodeThreeObject(n => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: orb(colOf(n)), transparent: true, opacity: 1, depthWrite: false, depthTest: true, toneMapped: false })); sp.scale.setScalar(sizeOf(n)); n.__sp = sp; return sp })
                .linkColor(l => l.c).linkOpacity(0.22).linkWidth(0)
                .linkDirectionalParticleWidth(1.8).linkDirectionalParticleSpeed(0.0065).linkDirectionalParticleColor(() => '#FFFFFF')
                .d3VelocityDecay(0.28).warmupTicks(80).cooldownTime(8000)
                .onEngineStop(() => { if (G.fitNext && !G.demo && !G.hot.size) { G.fitNext = false; G.fg.zoomToFit(1200, 20); fitRing() } })
                .onNodeClick(n => { stopDemo(); focus(n) })
                .onBackgroundClick(() => { if (!G.demo) { G.hot.clear(); G.hotLinks.clear(); paint(); card(null) } })
            G.fg.d3Force('charge').strength(-70); G.fg.d3Force('link').distance(l => (l.source.type === 'hub' || l.target.type === 'hub') ? 70 : 38)
            try { G.fg.renderer().setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); G.fg.renderer().toneMapping = THREE.ACESFilmicToneMapping; G.fg.renderer().toneMappingExposure = 0.95 } catch {}
            try { if (Bloom) { const r = G.holder.getBoundingClientRect(); G.bloom = new Bloom(new THREE.Vector2(r.width || 800, r.height || 600), 0.35, 0.3, 0.8); G.fg.postProcessingComposer().addPass(G.bloom) } } catch (e) { console.warn('glow off', e && e.message) }
            try { decorate() } catch (e) { console.warn('deco', e && e.message) }
            G.fg.controls().autoRotate = true; G.fg.controls().autoRotateSpeed = 0.3; G.fg.controls().enableDamping = true
            new ResizeObserver(size).observe(G.holder)
            labels()
        } else if (!cv.isConnected) G.holder.prepend(cv)
        size(); G.sig = ''; G.refresh(true)
        setTimeout(() => { G.fg.zoomToFit(1000, 30); fitRing() }, 1700)
    }
    const FULL_ICO = on => `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${on ? '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>' : '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'}</svg>`
    function placeDock(el) {
        G.dock.classList.remove('in-full')
        const again = document.querySelector('.bi-again'), mapCard = el.closest('.br-mapcard') || el
        if (again) { again.classList.add('has-dock'); const q = again.querySelector('.bi-q'); if (q) q.title = 'How the brain works'; again.appendChild(G.dock); G.dock.classList.remove('cc-span-12', 'alone') } else { mapCard.before(G.dock); G.dock.classList.add('cc-span-12', 'alone') }
    }
    function full(force) {
        const h = G.holder, on = force === undefined ? !h.classList.contains('full') : force
        if (on === h.classList.contains('full')) return
        h.classList.toggle('full', on); document.documentElement.classList.toggle('bm-full', on)
        const b = G.dock.querySelector('[data-bm="full"]'); b.innerHTML = FULL_ICO(on) + `<span class="lbl">${on ? 'Exit full screen' : 'Full screen'}</span>`; b.title = on ? 'Exit full screen (Esc)' : 'Full screen'; b.setAttribute('aria-pressed', String(on))
        if (on) { G.dock.classList.add('in-full'); h.appendChild(G.dock); if (h.requestFullscreen) h.requestFullscreen().catch(() => {}) }
        else { placeDock(G.mapEl || h.parentElement); if (document.fullscreenElement) document.exitFullscreen().catch(() => {}) }
        card(null); setTimeout(() => { if (G.fg) { G.fg.zoomToFit(900, 20); fitRing() } }, 400)
    }
    function fitRing() { if (!G.deco) return; const ns = G.fg.graphData().nodes; let m = 0; ns.forEach(n => { m = Math.max(m, Math.hypot(n.x || 0, n.y || 0, n.z || 0)) }); G.deco.ring.scale.setScalar(Math.max(200, m * 1.08)) }
    function pulse(ids) {
        if (!G.fg || !ids || !ids.length) return
        G.refresh(true)
        setTimeout(() => {
            const set = new Set(ids); G.hot = new Set(ids); G.hotLinks = new Set()
            G.fg.graphData().links.forEach(l => { if (set.has(l.source.id) || set.has(l.target.id)) { G.hot.add(l.source.id); G.hot.add(l.target.id); G.hotLinks.add(l) } })
            paint(); const n = G.fg.graphData().nodes.find(x => set.has(x.id)); if (n) { G.fg.cameraPosition({ x: (n.x || 1) * 2.4, y: (n.y || 1) * 2.4, z: (n.z || 1) * 2.4 }, n, 1600); card(n) }
        }, 900)
    }
    function demo() {
        const btn = G.dock.querySelector('.play'); btn.textContent = '■ Stop'
        const ns = G.fg.graphData().nodes, hubs = [...ns].sort((a, b) => b.deg - a.deg).slice(0, 8)
        let i = 0; G.fg.controls().autoRotate = false
        const step = () => { if (!G.demo) return; if (i >= hubs.length) { stopDemo(); G.fg.zoomToFit(1200, 30); return } focus(hubs[i++], 1900); G.demo = setTimeout(step, 4300) }
        G.demo = setTimeout(step, 50)
    }
    function stopDemo() { if (G.demo) clearTimeout(G.demo); G.demo = null; const b = G.dock && G.dock.querySelector('.play'); if (b) b.textContent = '▶ Play demo'; if (G.fg) G.fg.controls().autoRotate = true }
    function cinema() {
        const h = G.holder, on = !h.classList.contains('cinema')
        h.classList.toggle('cinema', on); document.documentElement.classList.toggle('bm-cinema', on)
        if (on && h.requestFullscreen) h.requestFullscreen().catch(() => {})
        if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {})
        card(null); G.fg.controls().autoRotateSpeed = on ? 0.8 : 0.3; setTimeout(() => G.fg.zoomToFit(1000, 10), 350)
    }
    document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && G.holder && G.holder.classList.contains('full') && !G.holder.classList.contains('cinema')) full(false); if (!document.fullscreenElement && G.holder && G.holder.classList.contains('cinema')) { G.holder.classList.remove('cinema'); document.documentElement.classList.remove('bm-cinema'); if (G.fg) G.fg.controls().autoRotateSpeed = 0.3 } })
    document.addEventListener('keydown', e => { if (e.key !== 'Escape' || !G.holder) return; if (G.holder.classList.contains('cinema')) cinema(); else if (G.holder.classList.contains('full')) full(false) })
})()
