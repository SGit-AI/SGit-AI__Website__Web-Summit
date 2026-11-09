// backlog 00a2, the Android live wallpaper of the agents map (dev.app@PrompTugal.angelo, 8 November 2026): the drawing contract.
// The wallpaper (people/angelo/app/android/wallpaper/) draws natively with OpenGL ES, so the page's code cannot run on it; its
// Graph.java is a port of the page's. This test holds the two together, on the site's own built data.json and live.json:
// (1) where: every node, in the same order, at the same place on the ball (live.js's layout() for the people ring, then
// live3d.js's ball()), the same size, colour (dark theme, lifted) and ring, the people's names; (2) the faint graph: the same
// links, alphas and curves; (3) who is who in live.json: every event's time, sender and targets resolved as live.js does;
// (4) the engine: the same activity, breathing, agents lit for two hours, exchanges queued and played over 30 s, the flow
// running within its cap and lines lit; (5) the wallpaper's shaders compile and link as GLSL ES 1.00 (WebGL 1 in Chromium, the
// same language as OpenGL ES 2.0), and draw. Run it with run.sh (it builds the site first); needs a JDK (javac, java).
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const vm = require('vm'); const os = require('os'); const { execFileSync } = require('child_process')
const APP = path.join(__dirname, '..'), W = path.join(APP, 'android/wallpaper')
;(async () => { let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 const dataF = path.join(APP, 'data.json'), liveF = path.join(APP, 'live.json')
 if (!fs.existsSync(dataF) || !fs.existsSync(liveF)) { console.log('no built data.json or live.json: run node admin/build/build.mjs first'); console.log('FAIL'); return }
 const D = JSON.parse(fs.readFileSync(dataF, 'utf8')), L = JSON.parse(fs.readFileSync(liveF, 'utf8')), M = D.collab.map

 // ---- the page's side: live.js's layout() and constants, live3d.js's ball(), taken from the files themselves
 const live = fs.readFileSync(path.join(APP, 'live.js'), 'utf8'), l3 = fs.readFileSync(path.join(APP, 'live3d.js'), 'utf8')
 const grab = re => { const m = live.match(re); if (!m) throw new Error('live.js changed shape: ' + re); return m[0] }
 const src = [grab(/const COL = \[[^\n]*\]/), grab(/const S = 1000, C = S \/ 2/), grab(/const GEO = \{[^\n]*\}/), grab(/function layout\(M, L\) \{[\s\S]*?\n    \}\n/), grab(/const personOf = [^\n]*/), grab(/const nodeOfIn = [^\n]*/)].join('\n')
 const page = new Function(src + '\nreturn { layout, nodeOfIn, C, GEO, personOf }')()
 const box = { self: {}, document: { currentScript: null }, location: { href: 'http://x/' } }; box.self.document = box.document; vm.runInNewContext(l3.replace('typeof self !== \'undefined\' ? self : this', 'self'), box)
 const ball = box.self.AngeloLive3D.ball
 // live.js's nodes3 (its 3D branch), for the people ring
 const { pos, col } = page.layout(M, 'ring'), C = page.C, nodes3 = []
 for (const [id, n] of pos) nodes3.push({ id, kind: n.kind, person: n.person, x: n.x - C, y: C - n.y, z: 0, color: col.get(n.person) || 'var(--rm-text-muted)', size: n.kind === 'p' ? 56 : n.family !== 'web-summit' ? 17 : 2 * (4 + Math.min(8, Math.sqrt(n.commits || 0))) + 2, ring: !!n.fresh, label: n.kind === 'p' ? n.label : '' })
 const at = ball(nodes3); for (const n of nodes3) Object.assign(n, at.get(n.id))
 // the dark theme's colours (assets/cc/app.css), lifted as live3d.js's rgb() does in the dark
 const css = fs.readFileSync(path.join(APP, '../../../assets/cc/app.css'), 'utf8'), hex = v => { const name = (String(v).match(/--[\w-]+/) || [])[0], m = name && css.match(new RegExp(name + ':\\s*(#[0-9A-Fa-f]{6})')); return m && m[1] }   // the first is the dark theme's
 const lift = h => [1, 3, 5].map(i => Math.min(1, parseInt(h.slice(i, i + 2), 16) / 255 * 1.12 + 0.1))

 // ---- the wallpaper's side: Graph.java on a JVM, over the same files
 const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hxwall-')), javaSrc = ['Graph', 'Json', 'Iso', 'Shaders'].map(n => path.join(W, 'src/main/java/news/promptugal/wallpaper', n + '.java')).concat(path.join(W, 'src/test/java/news/promptugal/wallpaper/ContractDump.java'))
 const evs = L.events.map(e => ({ sha: (e[5] || 0) + ':' + e[4], ms: Date.parse(L.from) + e[0] * 6e4, agent: L.agents[e[1]], to: e[3].map(i => L.targets[i]) })).sort((x, y) => x.ms - y.ms)
 const DELAY = 4 * 6e4, wall = evs[evs.length - 1].ms + DELAY - 20000
 let J
 try { execFileSync('javac', ['-encoding', 'UTF-8', '-d', tmp, ...javaSrc], { stdio: ['ignore', 'pipe', 'pipe'] }); J = JSON.parse(execFileSync('java', ['-cp', tmp, 'news.promptugal.wallpaper.ContractDump', dataF, liveF, String(wall)], { encoding: 'utf8', maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] })) }
 catch (e) { console.log('the JVM side did not run (needs a JDK):', String(e.stderr || e.message).slice(0, 400)); console.log('FAIL'); return }

 // (1) the nodes
 const near = (a, b, e = 1e-3) => Math.abs(a - b) <= e
 if (J.nodes.length !== nodes3.length) fail(`nodes: ${J.nodes.length} on the wallpaper, ${nodes3.length} on the page`)
 let bad = 0
 nodes3.forEach((n, i) => { const j = J.nodes[i] || {}, c = hex(n.color), rgb = c ? lift(c) : null
  const why = j.id !== n.id ? 'order' : !(near(j.x, n.x) && near(j.y, n.y) && near(j.z, n.z)) ? 'place' : !near(j.size, n.size) ? 'size' : j.ring !== n.ring ? 'ring' : (j.label || '') !== (n.label || '') ? 'label' : !rgb || !rgb.every((v, k) => near(v, j.rgb[k], 2e-3)) ? `colour ${n.color} ${c}` : ''
  if (why && bad++ < 5) console.log('   node', i, n.id, why, JSON.stringify(j).slice(0, 160)) })
 if (bad) fail(`${bad} nodes differ from the page's ball`)
 const people = nodes3.filter(n => n.kind === 'p').length, rings = nodes3.filter(n => n.ring).length
 console.log(`nodes ${J.nodes.length} (people ${people}, sessionless rings ${rings}); the ball's spread x/y/z`, ['x', 'y', 'z'].map(k => Math.round(Math.sqrt(nodes3.reduce((a, n) => a + n[k] ** 2, 0) / nodes3.length))).join('/'))
 if (people !== M.people.length || !rings) fail('people or rings missing')
 // (2) the faint graph
 const byId = new Map(nodes3.map(n => [n.id, n])), base = (M.links || []).filter(l => byId.get(l.from) && byId.get(l.to)), max = Math.max(1, ...(M.links || []).map(l => l.n || 1)), PULL = page.GEO.ring.pull
 if (J.links.length !== base.length) fail(`links: ${J.links.length} on the wallpaper, ${base.length} on the page`)
 bad = 0
 base.forEach((l, i) => { const j = J.links[i] || {}, a = byId.get(l.from), b = byId.get(l.to), w = 0.13 + 0.26 * Math.sqrt((l.n || 1) / max), q = { x: (a.x + b.x) / 2 * (1 - PULL), y: (a.y + b.y) / 2 * (1 - PULL), z: (a.z + b.z) / 2 * (1 - PULL) }, mid = ['x', 'y', 'z'].map(k => 0.25 * a[k] + 0.5 * q[k] + 0.25 * b[k])
  if ((j.from !== l.from || j.to !== l.to || !near(j.alpha, w, 1e-5) || !mid.every((v, k) => near(v, j.mid[k], 1e-2))) && bad++ < 5) console.log('   link', i, l.from, l.to, JSON.stringify(j)) })
 if (bad) fail(`${bad} links differ`)
 // (3) who is who in live.json
 const nodeOf = page.nodeOfIn(pos)
 if (J.events.length !== evs.length) fail(`events: ${J.events.length} read, ${evs.length} in live.json`)
 bad = 0
 evs.forEach((e, i) => { const j = J.events[i] || {}, from = nodeOf(e.agent), to = e.to.map(nodeOf)
  if ((j.sha !== e.sha || j.ms !== e.ms || j.from !== from || JSON.stringify(j.to) !== JSON.stringify(to)) && bad++ < 5) console.log('   event', i, e.sha, e.agent, '->', from, JSON.stringify(j)) })
 if (bad) fail(`${bad} events resolved differently`)
 const resolved = evs.filter(e => nodeOf(e.agent)).length
 console.log(`events ${evs.length}, ${resolved} from an agent or person on the map; links ${J.links.length}`)
 // (4) the engine, as live.js's tally() and read() would have it at the same moment
 let hour = 0; for (const e of evs) if (nodeOf(e.agent) && wall - e.ms < 36e5) hour++
 const act = evs.length ? hour / (evs.length / 48) : 1, ran = new Set(evs.filter(e => wall - e.ms < 2 * 36e5).map(e => nodeOf(e.agent)).filter(Boolean)), disp = wall - DELAY
 const queued = evs.filter(e => e.ms > disp), tEnd = (() => { let t = 1000; for (let f = 0; f < 450; f++) t += 1000 / 15; return t })()
 const played = queued.filter(e => 1000 + (e.ms - disp) <= tEnd)
 const launched = played.reduce((a, e) => { const f = nodeOf(e.agent); return f ? a + e.to.map(nodeOf).filter(t => t && t !== f).length : a }, 0)
 console.log('engine', JSON.stringify(J.engine), 'expected', JSON.stringify({ act: +act.toFixed(6), queued: queued.length, launched, ran: ran.size }))
 if (!near(J.engine.act, act, 1e-5) || !near(J.engine.breath, 0.035 + 0.035 * Math.min(2, act), 1e-5)) fail('activity or breathing differs')
 if (J.engine.queued !== queued.length) fail('a different number of exchanges queued')
 if (J.engine.realLaunched !== launched) fail(`exchanges played in 30 s: ${J.engine.realLaunched}, the page ${launched}`)
 if (J.engine.ran.length !== ran.size || !J.engine.ran.every(id => ran.has(id))) fail('the agents lit for two hours differ')
 if (!(J.engine.maxFlow > 0 && J.engine.maxFlow <= 70) || !J.engine.lines || !(J.engine.maxOp > 0.5)) fail('the flow did not run, or ran over its cap, or no line lit')
 if (!(launched > 0)) console.log('  note: no exchange fell in the 30 s window; the queue was still checked')

 // (5) the shaders, as GLSL ES 1.00 in WebGL 1, and a frame drawn with them
 const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }), p = await b.newPage()
 const r = await p.evaluate(S => {
  const c = document.createElement('canvas'); c.width = c.height = 64; const gl = c.getContext('webgl', { preserveDrawingBuffer: true }); if (!gl) return { err: 'no WebGL' }
  const out = [], prog = (vs, fs, name) => { const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) out.push(name + ': ' + gl.getShaderInfoLog(x)); return x }
   const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) out.push(name + ' link: ' + gl.getProgramInfoLog(pr)); return pr }
  const pts = S.fsPts.map((f, k) => prog(S.vsPts, f, 'points ' + k)); prog(S.vsLn, S.fsLn, 'lines'); prog(S.vsTx, S.fsTx, 'texture')
  if (out.length) return { err: out.join('; ') }
  // one glowing dot (kind 1) in the middle, the identity camera 10 units back: it must light the centre pixel
  const pr = pts[1]; gl.useProgram(pr); const I = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -10, 1]
  gl.uniformMatrix4fv(gl.getUniformLocation(pr, 'uMV'), false, I); gl.uniformMatrix4fv(gl.getUniformLocation(pr, 'uP'), false, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, -1, 0, 0, 0, 0].map((v, i) => i === 14 ? -2 : v)); gl.uniform1f(gl.getUniformLocation(pr, 'scale'), 300)
  const attr = (n, k, d) => { const l = gl.getAttribLocation(pr, n), bf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(d), gl.STATIC_DRAW); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, k, gl.FLOAT, false, 0, 0) }
  attr('position', 3, [0, 0, 0]); attr('size', 1, [1]); attr('alpha', 1, [1]); attr('col', 3, [0.2, 0.8, 0.9])
  gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.drawArrays(gl.POINTS, 0, 1)
  const px = new Uint8Array(4); gl.readPixels(32, 32, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); return { px: [...px] } }, J.shaders)
 await b.close()
 console.log('shaders', JSON.stringify(r))
 if (r.err) fail('shaders: ' + r.err); else if (!(r.px[1] > 120 && r.px[2] > 120)) fail('the glowing dot did not draw')
 fs.rmSync(tmp, { recursive: true, force: true })
 console.log(ok ? 'PASS' : 'FAIL')
})().catch(e => { console.log(e.stack || e); console.log('FAIL') })
