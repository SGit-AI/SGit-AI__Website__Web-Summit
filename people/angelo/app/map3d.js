// Team and the machine in 3D (spec-live-map.md section 5 and piece 5; Angelo's decision 4, c6fc4442: "3D as a switch, off by
// default, built last"). The same map, tilted and turned, not a new one: x and y are the 2D layout's own positions, z puts each
// person's agents in a shell around them. The libraries are the site's own (assets/cc/brain-libs.js: 3d-force-graph and three,
// same origin, 1.6 MB), loaded only when 3D is switched on. On a phone, or with reduced motion, it is a still view you turn with
// a finger; elsewhere it orbits slowly. 2D stays the default and the only view with readable labels and keyboard focus.
// Public record only, as the 2D map: names and counts. By dev.map@PrompTugal.angelo, 8 November 2026.
(function () {
    const here = document.currentScript ? document.currentScript.src : location.href
    let libs = null, cur = null
    const loadLibs = () => libs || (libs = window.BrainLibs ? Promise.resolve(window.BrainLibs) : new Promise((ok, no) => {
        const s = document.createElement('script'); s.src = new URL('../../../assets/cc/brain-libs.js', here).href
        s.onload = () => window.BrainLibs ? ok(window.BrainLibs) : no(new Error('brain-libs.js loaded without its libraries'))
        s.onerror = () => { libs = null; no(new Error('brain-libs.js could not load')) }; document.head.appendChild(s)
    }))
    // a CSS colour (the map's colours are variables) as the browser resolves it, for WebGL
    const resolve = (el, v) => { const t = document.createElement('i'); t.style.color = v; t.hidden = true; el.appendChild(t); const c = getComputedStyle(t).color; t.remove(); return c }
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    function unmount() { if (!cur) return; try { cur.fg.pauseAnimation(); cur.fg._destructor && cur.fg._destructor() } catch { } try { cur.ro.disconnect() } catch { } cur = null }
    // o: { pos (the 2D map's nodes), C (its centre), links, colOf (a person's colour) }
    async function mount(el, o) {
        unmount()
        let L; try { L = await loadLibs() } catch (e) { el.innerHTML = `<p class="note">The 3D view could not load (${esc(e.message || e)}). Switch 3D off for the map.</p>`; return }
        if (!el.isConnected) return
        el.innerHTML = ''
        const phone = matchMedia('(max-width: 767px)').matches, still = phone || matchMedia('(prefers-reduced-motion: reduce)').matches
        const css = getComputedStyle(document.documentElement), bg = resolve(el, css.getPropertyValue('--rm-bg').trim() || '#07111F'), text = resolve(el, 'var(--rm-text)')
        // positions: the 2D layout's x and y, around the centre; z a shell for each person's agents (alternating in front and
        // behind, three depths), people and the kinds of work on the plane
        const seen = new Map(), nodes = []
        for (const [id, n] of o.pos) {
            let z = 0
            if (n.kind === 'a') { const k = seen.get(n.person) || 0; seen.set(n.person, k + 1); z = (k % 2 ? 1 : -1) * (45 + 40 * (Math.floor(k / 2) % 3)) }
            nodes.push({ id, kind: n.kind, name: n.kind === 'a' ? (n.name || n.label) : n.label, fx: n.x - o.C, fy: o.C - n.y, fz: z, x: n.x - o.C, y: o.C - n.y, z,
                color: resolve(el, n.kind === 'k' ? 'var(--rm-text-secondary)' : (o.colOf(n.person) || 'var(--rm-text-muted)')), val: n.kind === 'p' ? 40 : n.kind === 'k' ? 12 : 2 + Math.min(6, Math.sqrt(n.commits || 0)) })
        }
        const ids = new Set(nodes.map(n => n.id)), col = new Map(nodes.map(n => [n.id, n.color]))
        const links = (o.links || []).filter(l => ids.has(l.from) && ids.has(l.to)).map(l => ({ source: l.from, target: l.to, n: l.n, color: col.get(l.from) }))
        const max = Math.max(1, ...links.map(l => l.n))
        const box = () => { const r = el.getBoundingClientRect(); return [Math.max(200, r.width), Math.max(200, r.height || r.width)] }
        const [w, h] = box()
        const fg = new L.ForceGraph3D(el, { controlType: 'orbit', rendererConfig: { antialias: true, alpha: false } })
            .width(w).height(h).backgroundColor(bg).showNavInfo(false)
            .nodeId('id').nodeVal('val').nodeColor('color').nodeOpacity(0.95).nodeResolution(12)
            .nodeLabel(n => `<span style="color:${esc(text)}">${esc(n.name)}</span>`)
            .linkColor('color').linkOpacity(0.35).linkWidth(l => 0.3 + 2.2 * Math.sqrt(l.n / max)).linkCurvature(0.15)
            .cooldownTicks(0).warmupTicks(0)
            .graphData({ nodes, links })
        try { fg.renderer().setPixelRatio(Math.min(2, window.devicePixelRatio || 1)) } catch { }
        // seen from the front, a little from above, the whole map in view
        fg.cameraPosition({ x: 0, y: -420, z: 980 }, { x: 0, y: 0, z: 0 }, 0)
        const ctl = fg.controls(); if (ctl) { ctl.enableDamping = true; ctl.autoRotate = !still; ctl.autoRotateSpeed = 0.35 }
        el.dataset.tm3dNodes = String(nodes.length); el.dataset.tm3dLinks = String(links.length); el.dataset.tm3dOrbit = still ? 'still' : 'orbit'
        const ro = new ResizeObserver(() => { const [a, b] = box(); fg.width(a).height(b) }); ro.observe(el)
        cur = { fg, ro, el }
    }
    window.AngeloMap3D = { mount, unmount }
})()
