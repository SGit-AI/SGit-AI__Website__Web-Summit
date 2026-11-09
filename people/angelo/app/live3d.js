// The live graph in 3D (backlog 0c; Angelo, 8 November: "interacting with the mouse is very slow, it lags heavily, and more
// importantly, dots and lines don't light up, so it's cool static graph but not what we wanted"). A light renderer on the site's
// own three.js (assets/cc/brain-libs.js, loaded only when 3D is switched on): every node in one draw call, every line in two (the
// faint graph and the lit layer), every moving dot in one, and no ray casting on mouse moves (the old view tested every curved tube
// under the pointer on each move, which was the lag). It draws, it does not decide: live.js keeps one engine (the real exchanges at
// their moment, the constant flow, the breathing, what is lit) and hands its state to draw() on each of its frames, so 2D and 3D
// show exactly the same thing. map3d.js uses it too, for the command centre's map in 3D. Drag to turn, wheel or pinch to zoom.
// Public record only: names, lines and times. By dev.map@PrompTugal.angelo, 8 November 2026.
(function (root) {
    'use strict'
    const here = document.currentScript ? document.currentScript.src : location.href
    let libs = null
    const loadLibs = () => libs || (libs = root.BrainLibs ? Promise.resolve(root.BrainLibs) : new Promise((ok, no) => {
        const s = document.createElement('script'); s.src = new URL('../../../assets/cc/brain-libs.js', here).href
        s.onload = () => root.BrainLibs ? ok(root.BrainLibs) : no(new Error('brain-libs.js loaded without its libraries'))
        s.onerror = () => { libs = null; no(new Error('brain-libs.js could not load')) }; document.head.appendChild(s)
    }))
    const sheetsReady = doc => Promise.all([...doc.querySelectorAll('link[rel="stylesheet"]')].filter(l => !l.sheet).map(l => new Promise(ok => {
        l.addEventListener('load', ok, { once: true }); l.addEventListener('error', ok, { once: true }); (doc.defaultView || root).setTimeout(ok, 4000) })))
    const SEG = 18, TRAIL = 5, MAXPAIRS = 900, MAXDOTS = 220
    // a ball, not a disk (backlog 0c3, Angelo, 8 November: "the actual 3d model should be less squashed and more inflated to be
    // closer to a ball rather than a disk"). Each node keeps its direction round the centre from the 2D layout (so every person and
    // colour stays where the flat map has it); the people sit round the sphere's middle, a little above and below it in turn; each
    // person's agents fan out over the sphere from pole to pole along their person's side, in two shells; the kinds of work inside.
    // nodes: [{ id, x, y, kind: 'p'|'a'|'k', person }] (x and y round the centre); returns Map(id -> { x, y, z })
    function ball(nodes) {
        const out = new Map(), ppl = nodes.filter(n => n.kind === 'p'), Rs = Math.max(260, ...ppl.map(n => Math.hypot(n.x, n.y))), dir = new Map(), mine = new Map()
        const put = (id, phi, lat, r) => out.set(id, { x: r * Math.cos(lat) * Math.cos(phi), y: r * Math.cos(lat) * Math.sin(phi), z: r * Math.sin(lat) })
        ppl.forEach((n, i) => { const phi = Math.atan2(n.y, n.x); dir.set(n.id, phi); put(n.id, phi, (i % 2 ? 1 : -1) * 0.16, Rs) })
        for (const n of nodes) if (n.kind === 'a') { if (!mine.has(n.person)) mine.set(n.person, []); mine.get(n.person).push(n) }
        for (const [p, list] of mine) {
            const pp = dir.get(p), m = list.length
            list.forEach((n, k) => {
                const own = Math.atan2(n.y, n.x), d = pp == null ? 0 : Math.atan2(Math.sin(own - pp), Math.cos(own - pp)), phi = (pp == null ? own : pp + Math.max(-0.5, Math.min(0.5, d * 1.6))) + (k % 3 - 1) * 0.07
                const f = m < 2 ? 0.5 : k / (m - 1), lat = (k % 2 ? 1 : -1) * (0.3 + 0.95 * Math.abs(f - 0.5) * 2) * (m < 3 ? 0.6 : 1)
                put(n.id, phi, Math.max(-1.32, Math.min(1.32, lat)), Rs * (k % 2 ? 1.12 : 0.96))
            })
        }
        for (const n of nodes) if (!out.has(n.id)) { const r = Math.hypot(n.x, n.y); put(n.id, Math.atan2(n.y, n.x), 0, n.kind === 'k' ? Math.min(r, Rs * 0.45) : r) }
        return out
    }
    // a CSS colour (the graph's colours are variables) as the browser resolves it, for WebGL
    const resolver = el => { const cache = new Map(); return v => { if (cache.has(v)) return cache.get(v); const t = el.ownerDocument.createElement('i'); t.style.color = v; t.hidden = true; el.appendChild(t); const c = el.ownerDocument.defaultView.getComputedStyle(t).color; t.remove(); cache.set(v, c); return c } }
    const VS_PTS = `attribute float size; attribute float alpha; attribute vec3 col; uniform float scale; varying vec3 vC; varying float vA;
void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = max(1.5, size * scale / -mv.z); gl_Position = projectionMatrix * mv; vC = col; vA = alpha; }`
    // kind 0: a solid dot with a crisp edge; 1: a dot with a soft glow round it; 2: a ring (the sessionless agents' mark)
    const FS_PTS = kind => `uniform float soft; varying vec3 vC; varying float vA;
void main() { float r = length(gl_PointCoord - 0.5) * 2.0; if (r > 1.0) discard;
  ${kind === 3 ? 'float a = exp(-r * r * 4.5) - 0.011;' : kind === 2 ? 'float a = smoothstep(0.62, 0.72, r) * (1.0 - smoothstep(0.9, 1.0, r));' : kind === 1 ? 'float a = max(1.0 - smoothstep(0.3, 0.4, r), 0.85 * pow(1.0 - r, 1.6));' : 'float a = 1.0 - smoothstep(0.82, 1.0, r);'}
  gl_FragColor = vec4(mix(vC, vec3(1.0), ${kind === 1 ? '0.35 * (1.0 - smoothstep(0.0, 0.4, r))' : '0.0'}), vA * a); }`
    const VS_LN = `attribute float alpha; attribute vec3 col; varying vec3 vC; varying float vA;
void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); vC = col; vA = alpha; }`
    const FS_LN = `varying vec3 vC; varying float vA; void main() { gl_FragColor = vec4(vC, vA); }`

    // create(el, { nodes: [{ id, x, y, z, color, size, ring, label }], links: [{ from, to, n }], ctrl(a, b) -> {x,y,z}, still })
    async function create(el, o) {
        const L = await loadLibs(), T = L.THREE, doc = el.ownerDocument, win = doc.defaultView || root
        // a pop-out window's stylesheets are copied in as links and load after it opens: wait for them, or every colour (CSS
        // variables) reads as black and stays so (Angelo, 8 November, backlog 0c2: "the 3d live version once popped out is all black shadows")
        await sheetsReady(doc)
        if (!el.isConnected) return null
        const light = typeof o.light === 'function' ? !!o.light() : !!o.light
        // brighter in the dark (backlog 0c3, Angelo: "The 3d version should use a bit brighter colors for messages and lines, I like
        // if they have a glow effect"): each colour lifted towards white, and the lit lines and dots glow; on a light page, as they are
        const res = resolver(el), rgb0 = v => new T.Color(res(v)), rgb = v => { const c = rgb0(v); return light ? c : new T.Color(Math.min(1, c.r * 1.12 + 0.1), Math.min(1, c.g * 1.12 + 0.1), Math.min(1, c.b * 1.12 + 0.1)) }
        const canvas = doc.createElement('canvas'); canvas.className = 'lv-3dc'; el.appendChild(canvas)
        const R = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: !!o.keep })
        R.setClearColor(0x000000, 0)
        const scene = new T.Scene(), cam = new T.PerspectiveCamera(38, 1, 10, 6000), world = new T.Group(); scene.add(world)
        const byId = new Map(o.nodes.map((n, i) => [n.id, Object.assign({ i, c: null, v: n.v == null ? 1 : n.v, tv: n.v == null ? 1 : n.v }, n)]))
        const P = id => byId.get(id)
        const curveAt = (a, b, u, out) => { const q = o.ctrl(a, b), v = 1 - u; out.x = v * v * a.x + 2 * v * u * q.x + u * u * b.x; out.y = v * v * a.y + 2 * v * u * q.y + u * u * b.y; out.z = v * v * a.z + 2 * v * u * q.z + u * u * b.z; return out }
        const mat = (vs, fs, blend) => new T.ShaderMaterial({ vertexShader: vs, fragmentShader: fs, transparent: true, depthWrite: false, blending: blend || T.NormalBlending, uniforms: { scale: { value: 1 }, soft: { value: 1 } } })
        const buf = (g, name, n, k) => { const a = new T.BufferAttribute(new Float32Array(n * k), k); a.setUsage && a.setUsage(T.DynamicDrawUsage); g.setAttribute(name, a); return a }

        // the faint graph: every line of the map, as the 2D view's base lines
        const max = Math.max(1, ...(o.links || []).map(l => l.n || 1)), base = (o.links || []).filter(l => P(l.from) && P(l.to))
        const bg = new T.BufferGeometry(), bpos = buf(bg, 'position', base.length * SEG * 2, 3), bcol = buf(bg, 'col', base.length * SEG * 2, 3), bal = buf(bg, 'alpha', base.length * SEG * 2, 1)
        const writeBase = (colours) => { const p = {}, q = {}
          base.forEach((l, k) => { const a = P(l.from), b = P(l.to), c = colours && rgb(a.color), w = (0.13 + 0.26 * Math.sqrt((l.n || 1) / max)) * Math.min(a.v, b.v)
            for (let s = 0; s < SEG; s++) { curveAt(a, b, s / SEG, p); curveAt(a, b, (s + 1) / SEG, q); const j = (k * SEG + s) * 2; bpos.setXYZ(j, p.x, p.y, p.z); bpos.setXYZ(j + 1, q.x, q.y, q.z); if (c) { bcol.setXYZ(j, c.r, c.g, c.b); bcol.setXYZ(j + 1, c.r, c.g, c.b) } bal.setX(j, w); bal.setX(j + 1, w) } })
          bpos.needsUpdate = bal.needsUpdate = true; if (colours) bcol.needsUpdate = true }
        writeBase(true); { const bo = new T.LineSegments(bg, mat(VS_LN, FS_LN)); bo.frustumCulled = false; world.add(bo) }

        // the lit layer: a slot per pair the first time it moves, its brightness written only when it changes
        const lit = new T.BufferGeometry(), lpos = buf(lit, 'position', MAXPAIRS * SEG * 2, 3), lcol = buf(lit, 'col', MAXPAIRS * SEG * 2, 3), lal = buf(lit, 'alpha', MAXPAIRS * SEG * 2, 1)
        lit.setDrawRange(0, 0); const litObj = new T.LineSegments(lit, mat(VS_LN, FS_LN, light ? T.NormalBlending : T.AdditiveBlending)); litObj.frustumCulled = false; world.add(litObj)
        const slots = new Map(), GS = SEG + 1
        const glow = new T.BufferGeometry(), gpos = buf(glow, 'position', MAXPAIRS * GS, 3), gcol = buf(glow, 'col', MAXPAIRS * GS, 3), gsz = buf(glow, 'size', MAXPAIRS * GS, 1), gal = buf(glow, 'alpha', MAXPAIRS * GS, 1)
        glow.setDrawRange(0, 0); const glowMat = mat(VS_PTS, FS_PTS(3), light ? T.NormalBlending : T.AdditiveBlending), glowObj = new T.Points(glow, glowMat); glowObj.frustumCulled = false; world.add(glowObj)
        const writeSlot = (key, s, colours) => { const [f, t] = key.split('|'), a = P(f), b = P(t), c = colours && rgb(a.color), p = {}, q = {}
            for (let k = 0; k < SEG; k++) { curveAt(a, b, k / SEG, p); curveAt(a, b, (k + 1) / SEG, q); const j = (s * SEG + k) * 2; lpos.setXYZ(j, p.x, p.y, p.z); lpos.setXYZ(j + 1, q.x, q.y, q.z); if (c) { lcol.setXYZ(j, c.r, c.g, c.b); lcol.setXYZ(j + 1, c.r, c.g, c.b) } }
            for (let k = 0; k < GS; k++) { curveAt(a, b, k / SEG, p); const j = s * GS + k; gpos.setXYZ(j, p.x, p.y, p.z); if (c) { gcol.setXYZ(j, c.r, c.g, c.b); gsz.setX(j, light ? 16 : 30) } }
            lpos.needsUpdate = gpos.needsUpdate = true; if (c) lcol.needsUpdate = gcol.needsUpdate = gsz.needsUpdate = true }
        const slotOf = key => { let s = slots.get(key); if (s !== undefined) return s; if (slots.size >= MAXPAIRS) return -1; const [f, t] = key.split('|'); if (!P(f) || !P(t)) return -1
            s = slots.size; slots.set(key, s); writeSlot(key, s, true); lit.setDrawRange(0, slots.size * SEG * 2); glow.setDrawRange(0, slots.size * GS); return s }

        // the nodes: one draw call; size and brightness change when an agent is busy, and everything breathes slowly
        const nN = o.nodes.length, ng = new T.BufferGeometry(), npos = buf(ng, 'position', nN, 3), ncol = buf(ng, 'col', nN, 3), nsz = buf(ng, 'size', nN, 1), nal = buf(ng, 'alpha', nN, 1)
        const ncols = o.nodes.map(n => rgb(n.color)), white = new T.Color(1, 1, 1)
        const live = o.nodes.map(n => P(n.id))
        live.forEach((n, i) => { npos.setXYZ(i, n.x, n.y, n.z); const c = ncols[i]; ncol.setXYZ(i, c.r, c.g, c.b); nsz.setX(i, n.size); nal.setX(i, 0.95 * n.v) })
        const nodesMat = mat(VS_PTS, FS_PTS(0)), nodesObj = new T.Points(ng, nodesMat); nodesObj.frustumCulled = false; world.add(nodesObj)
        // the sessionless agents' ring: faint while they sleep, bright for two hours after they last sent something
        const rings = o.nodes.filter(n => n.ring), rg = new T.BufferGeometry(), rpos = buf(rg, 'position', Math.max(1, rings.length), 3), rcol = buf(rg, 'col', Math.max(1, rings.length), 3), rsz = buf(rg, 'size', Math.max(1, rings.length), 1), ral = buf(rg, 'alpha', Math.max(1, rings.length), 1)
        const tc = rgb('var(--rm-text, #fff)'); rings.forEach((n, i) => { n = P(n.id); rpos.setXYZ(i, n.x, n.y, n.z); rcol.setXYZ(i, tc.r, tc.g, tc.b); rsz.setX(i, n.size * 2.1); ral.setX(i, 0.45) }); rg.setDrawRange(0, rings.length)
        const ringMat = mat(VS_PTS, FS_PTS(2)), ringObj = new T.Points(rg, ringMat); ringObj.frustumCulled = false; world.add(ringObj)

        // the moving dots: real exchanges bright with a glow and a short trail, the flow small and faint
        const dg = new T.BufferGeometry(), dpos = buf(dg, 'position', MAXDOTS * (TRAIL + 1), 3), dcol = buf(dg, 'col', MAXDOTS * (TRAIL + 1), 3), dsz = buf(dg, 'size', MAXDOTS * (TRAIL + 1), 1), dal = buf(dg, 'alpha', MAXDOTS * (TRAIL + 1), 1)
        dg.setDrawRange(0, 0); const dotsMat = mat(VS_PTS, FS_PTS(1), light ? T.NormalBlending : T.AdditiveBlending), dotsObj = new T.Points(dg, dotsMat); dotsObj.frustumCulled = false; world.add(dotsObj)

        // people's names, as the 2D view writes them: a few HTML labels placed on the projected point each frame
        const labels = live.filter(n => n.label).map(n => { const s = doc.createElement('span'); s.className = 'lv-3dl'; s.textContent = n.label; el.appendChild(s); return { n, s } })

        // the camera and the turning: drag to turn, wheel or pinch to zoom; it turns slowly by itself unless still
        const view = { rx: -0.42, ry: 0, vy: 0, vx: 0, dist: o.dist || 1500, drag: null, idleAt: 0 }
        const pts = new Map()
        const down = e => { pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); try { canvas.setPointerCapture(e.pointerId) } catch { } view.drag = true; view.idleAt = win.performance.now() }
        const move = e => { const p = pts.get(e.pointerId); if (!p) return
            if (pts.size === 2) { const [a, b] = [...pts.values()], d0 = Math.hypot(a.x - b.x, a.y - b.y); p.x = e.clientX; p.y = e.clientY; const [c, d] = [...pts.values()], d1 = Math.hypot(c.x - d.x, c.y - d.y); if (d0 > 0 && d1 > 0) view.dist = Math.min(4000, Math.max(500, view.dist * d0 / d1)); return }
            const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY; view.vy = dx * 0.006; view.vx = dy * 0.006; view.ry += view.vy; view.rx = Math.max(-1.45, Math.min(1.45, view.rx + view.vx)); view.idleAt = win.performance.now() }
        const up = e => { pts.delete(e.pointerId); if (!pts.size) view.drag = null }
        const wheel = e => { e.preventDefault(); view.dist = Math.min(4000, Math.max(500, view.dist * Math.exp(e.deltaY * 0.001))) }
        canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up); canvas.addEventListener('wheel', wheel, { passive: false })

        // the turn by itself: one turn every o.turnS seconds (the live graph's default 50, Angelo, 8 November, backlog 0c2: "it should
        // spin a little faster"; it was about 105), held while a hand turns it and for 2.5 s after
        const spin = 2 * Math.PI / (1000 * (o.turnS || 50))
        let W = 0, H = 0, PR = 1, frames = 0, ftSum = 0, ftMax = 0, lastT = 0, ringAt = -1e9
        const size = () => { const r = el.getBoundingClientRect(), w = Math.max(50, Math.round(r.width)), h = Math.max(50, Math.round(r.height)); if (w === W && h === H) return; W = w; H = h
            PR = Math.min(2, win.devicePixelRatio || 1); if (w * h * PR * PR > 4.5e6) PR = Math.max(1, Math.sqrt(4.5e6 / (w * h)))   // a big screen: fewer pixels, the same picture
            R.setPixelRatio(PR); R.setSize(w, h, false); canvas.style.width = w + 'px'; canvas.style.height = h + 'px'; cam.aspect = w / h; cam.updateProjectionMatrix()
            const sc = H * PR / (2 * Math.tan(cam.fov * Math.PI / 360)); nodesMat.uniforms.scale.value = ringMat.uniforms.scale.value = dotsMat.uniforms.scale.value = glowMat.uniforms.scale.value = sc }
        const ro = new (win.ResizeObserver || root.ResizeObserver)(size); ro.observe(el); size()
        const tmp = {}, tmp2 = {}, v3 = new T.Vector3()

        // state: { now, fly: [{ from, to, u, flow }], lines: Map(key -> { op }), hot: Map(id -> until), ran: Set(id), breath, still }
        function draw(st) {
            const t0 = win.performance.now(), dt = lastT ? Math.min(100, t0 - lastT) : 16; lastT = t0
            size()
            if (!view.drag) { view.vy *= 0.92; view.vx *= 0.92; if (Math.abs(view.vy) > 1e-4) view.ry += view.vy; if (Math.abs(view.vx) > 1e-4) view.rx = Math.max(-1.45, Math.min(1.45, view.rx + view.vx))
                if (!o.still && t0 - view.idleAt > 2500) view.ry += spin * dt }
            world.rotation.set(view.rx, view.ry, 0, 'XYZ'); cam.position.set(0, 0, view.dist); cam.lookAt(0, 0, 0)
            // nodes arriving, leaving and making room (the replay's 3D, backlog 0c3: "the 3d map doesn't adapt as agents appear and
            // disappear"): st.place (id -> where it should be) and st.vis (id -> 0 or 1); each eases there, and the lines follow
            if (st.place || st.vis) {
                const ke = 1 - Math.exp(-dt / 1000 * 4); let moved = false, faded = false
                for (const n of live) {
                    const g = st.place && st.place.get(n.id); if (g) { const dx = g.x - n.x, dy = g.y - n.y, dz = g.z - n.z; if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) > 0.5) { n.x += dx * ke; n.y += dy * ke; n.z += dz * ke; moved = true } else if (dx || dy || dz) { n.x = g.x; n.y = g.y; n.z = g.z; moved = true } }
                    if (st.vis) { const tv = st.vis.has(n.id) ? st.vis.get(n.id) : 1, dv = tv - n.v; if (dv) { n.v = Math.abs(dv) < 0.02 ? tv : n.v + dv * Math.min(1, ke * 1.6); faded = true } }
                }
                if (moved || faded) {
                    live.forEach((n, i) => { npos.setXYZ(i, n.x, n.y, n.z); nal.setX(i, 0.95 * n.v) }); npos.needsUpdate = nal.needsUpdate = true
                    rings.forEach((r, i) => { const n = P(r.id); rpos.setXYZ(i, n.x, n.y, n.z) }); rpos.needsUpdate = true
                    writeBase(false); if (moved) for (const [key, s] of slots) writeSlot(key, s, false)
                }
                el.dataset.lv3dShown = String(live.filter(n => n.v > 0.5).length)
            }
            // the lines lit by the engine, as bright as in 2D
            if (st.lines) { let ch = false; for (const [k, e] of st.lines) { const v = +e.op || 0; if (v === e.op3) continue; const s = slotOf(k); if (s < 0) continue; e.op3 = v; const a = Math.min(1, v * 1.05), ga = a * (light ? 0.22 : 0.3); for (let j = s * SEG * 2, n = j + SEG * 2; j < n; j++) lal.setX(j, a); for (let j = s * GS, n = j + GS; j < n; j++) gal.setX(j, ga); ch = true } if (ch) lal.needsUpdate = gal.needsUpdate = true }
            // the nodes: busy ones larger and whiter, all breathing gently with the team's activity
            const br = st.breath || 0, now = st.now || t0
            for (let i = 0; i < nN; i++) { const n = live[i], h = st.hot && st.hot.has(n.id), c = ncols[i], b = 1 + br * Math.sin(now / 1400 + i * 1.7)
                const s = n.size * b * (h ? 1.55 : 1) * (0.25 + 0.75 * n.v); if (nsz.getX(i) !== s) nsz.setX(i, s)
                if (h) ncol.setXYZ(i, c.r + (1 - c.r) * 0.45, c.g + (1 - c.g) * 0.45, c.b + (1 - c.b) * 0.45); else ncol.setXYZ(i, c.r, c.g, c.b) }
            nsz.needsUpdate = ncol.needsUpdate = true
            if (t0 - ringAt > 1000 && rings.length) { ringAt = t0; rings.forEach((n, i) => ral.setX(i, st.ran && st.ran.has(n.id) ? 0.95 : 0.45)); ral.needsUpdate = true }
            // the moving dots, with a short fading trail behind each real exchange
            let k = 0
            for (const f of st.fly || []) { if (k >= MAXDOTS * (TRAIL + 1) - TRAIL - 1) break; const a = P(f.from), b = P(f.to); if (!a || !b) continue; const c = a.c || (a.c = rgb(a.color))
                if (f.flow) { curveAt(a, b, f.u, tmp); dpos.setXYZ(k, tmp.x, tmp.y, tmp.z); dcol.setXYZ(k, c.r, c.g, c.b); dsz.setX(k, 13); dal.setX(k, 0.5 + 0.45 * Math.sin(Math.PI * f.u)); k++; continue }
                for (let j = 0; j <= TRAIL; j++) { const u = Math.max(0, f.u - j * 0.025); curveAt(a, b, u, tmp2); dpos.setXYZ(k, tmp2.x, tmp2.y, tmp2.z); dcol.setXYZ(k, c.r, c.g, c.b); dsz.setX(k, j ? 26 - j * 3.5 : 48); dal.setX(k, j ? 0.65 * (1 - j / (TRAIL + 1)) : 1); k++ } }
            dg.setDrawRange(0, k); if (k) { dpos.needsUpdate = dcol.needsUpdate = dsz.needsUpdate = dal.needsUpdate = true }
            R.render(scene, cam)
            // the names, where their people now are
            world.updateMatrixWorld()
            for (const { n, s } of labels) { v3.set(n.x, n.y, n.z).applyMatrix4(world.matrixWorld).project(cam); const vis = v3.z < 1 && n.v > 0.5; s.style.transform = `translate(${((v3.x + 1) / 2 * W).toFixed(1)}px, ${((1 - v3.y) / 2 * H).toFixed(1)}px) translate(-50%, -50%)`; s.style.opacity = vis ? '' : '0' }
            const ft = win.performance.now() - t0; frames++; ftSum += ft; ftMax = Math.max(ftMax, ft)
            if (frames % 10 === 0) { const sh = shape(); el.dataset.lv3dShape = `${sh.x},${sh.y},${sh.z}` }
            el.dataset.lv3dFrames = String(frames); el.dataset.lv3dDots = String(k); el.dataset.lv3dLit = String(slots.size)
        }
        function destroy() { try { ro.disconnect() } catch { } canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up); canvas.removeEventListener('wheel', wheel)
            scene.traverse(x => { if (x.geometry) x.geometry.dispose(); if (x.material) x.material.dispose() }); R.dispose(); try { R.forceContextLoss() } catch { } canvas.remove(); for (const { s } of labels) s.remove() }
        // for the tests: the time draw() takes, per frame, in milliseconds
        // for the tests: how round the picture is, the spread of the nodes present along each axis (a disk has little depth)
        const shape = () => { const on = live.filter(n => n.v > 0.5), m = k => on.reduce((a, n) => a + n[k], 0) / (on.length || 1), sd = k => { const c = m(k); return Math.sqrt(on.reduce((a, n) => a + (n[k] - c) ** 2, 0) / (on.length || 1)) }; return { x: Math.round(sd('x')), y: Math.round(sd('y')), z: Math.round(sd('z')), n: on.length } }
        const stats = () => ({ shape: shape(), glow: glow.drawRange.count, frames, avg: frames ? ftSum / frames : 0, max: ftMax, nodes: nN, links: base.length, lit: slots.size, calls: R.info.render.calls })
        const turn = (dx, dy) => { view.ry += dx; view.rx = Math.max(-1.45, Math.min(1.45, view.rx + dy)); view.idleAt = win.performance.now() }
        return { draw, destroy, stats, turn, canvas, spin: () => ({ turnS: o.turnS || 50, ry: view.ry }) }
    }
    root.AngeloLive3D = { create, loadLibs, ball }
})(typeof self !== 'undefined' ? self : this)
