// Team and the machine in 3D (spec-live-map.md section 5 and piece 5; Angelo's decision 4, c6fc4442: "3D as a switch, off by
// default, built last"). The same map, tilted and turned, not a new one: x and y are the 2D layout's own positions, z puts each
// person's agents in a shell around them. The libraries are the site's own (assets/cc/brain-libs.js's three.js, same origin, 1.6 MB),
// loaded only when 3D is switched on, and drawn by live3d.js. On a phone, or with reduced motion, it is a still view you turn with
// a finger; elsewhere it orbits slowly. 2D stays the default and the only view with every label and keyboard focus.
// Public record only, as the 2D map: names and counts. By dev.map@PrompTugal.angelo, 8 November 2026.
(function () {
    const here = document.currentScript ? document.currentScript.src : location.href
    let cur = null
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    function unmount() { if (!cur) return; cur.alive = false; try { cur.win.cancelAnimationFrame(cur.raf) } catch { } try { cur.r.destroy() } catch { } cur = null }
    // o: { pos (the 2D map's nodes), C (its centre), links, colOf (a person's colour) }
    // Drawn by live3d.js (backlog 0c, Angelo, 8 November: "interacting with the mouse is very slow, it lags heavily"): one draw
    // call for the nodes and one for the lines, no ray casting under the mouse. Its link leads to the live graph in 3D.
    async function mount(el, o) {
        unmount()
        const here3 = new URL('live3d.js', here).href
        try { if (!window.AngeloLive3D) await new Promise((ok, no) => { const s = document.createElement('script'); s.src = here3; s.onload = ok; s.onerror = () => no(new Error('live3d.js could not load')); document.head.appendChild(s) }) }
        catch (e) { el.innerHTML = `<p class="note">The 3D view could not load (${esc(e.message || e)}). Switch 3D off for the map.</p>`; return }
        if (!el.isConnected) return
        el.innerHTML = ''
        const phone = matchMedia('(max-width: 767px)').matches, still = phone || matchMedia('(prefers-reduced-motion: reduce)').matches
        // positions: the 2D layout's x and y, around the centre; z a shell for each person's agents (alternating in front and
        // behind, three depths), people and the kinds of work on the plane
        const seen = new Map(), nodes = []
        for (const [id, n] of o.pos) {
            let z = 0
            if (n.kind === 'a') { const k = seen.get(n.person) || 0; seen.set(n.person, k + 1); z = (k % 2 ? 1 : -1) * (45 + 40 * (Math.floor(k / 2) % 3)) }
            nodes.push({ id, x: n.x - o.C, y: o.C - n.y, z, color: n.kind === 'k' ? 'var(--rm-text-secondary)' : (o.colOf(n.person) || 'var(--rm-text-muted)'),
                size: n.kind === 'p' ? 56 : n.kind === 'k' ? 30 : 2 * (4 + Math.min(8, Math.sqrt(n.commits || 0))) + 2, label: n.kind === 'p' ? n.label : '' })
        }
        const ids = new Set(nodes.map(n => n.id)), links = (o.links || []).filter(l => ids.has(l.from) && ids.has(l.to))
        let r
        try { r = await window.AngeloLive3D.create(el, { nodes, links, still, dist: 1700, ctrl: (a, b) => { const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, mz = (a.z + b.z) / 2; return { x: mx * 0.8, y: my * 0.8, z: mz * 0.8 } } }) }
        catch (e) { el.innerHTML = `<p class="note">The 3D view could not load (${esc(e.message || e)}). Switch 3D off for the map.</p>`; return }
        if (!r || !el.isConnected) { r && r.destroy(); return }
        const go = el.ownerDocument.createElement('a'); go.className = 'cc-btn tm-3dlive'; go.href = '#live?d3=1'; go.textContent = '◉ Live, in 3D'; go.title = 'The live graph in 3D: every exchange travels and lights its line'; el.appendChild(go)
        el.dataset.tm3dNodes = String(nodes.length); el.dataset.tm3dLinks = String(links.length); el.dataset.tm3dOrbit = still ? 'still' : 'orbit'
        const win = el.ownerDocument.defaultView || window, c = { r, win, alive: true, raf: 0, el }
        const tick = t => { if (!c.alive || !el.isConnected) return; r.draw({ now: t }); c.raf = win.requestAnimationFrame(tick) }
        c.raf = win.requestAnimationFrame(tick); cur = c
    }
    window.AngeloMap3D = { mount, unmount }
})()
