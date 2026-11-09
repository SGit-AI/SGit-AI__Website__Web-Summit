// WS-203, the live wallpaper's views (Angelo, 9 November 2026: "Can we enhance the live wallpaper to enable choosing the view as
// in the website?"; his go in dashboard@'s cd90cac2). The wallpaper now offers the 3D ball, the People ring and the Agents ring,
// dark or light. hxappwall holds the 3D ball in the dark to the page; this test holds the two flat layouts and the light theme:
// Graph.java on a JVM, over the site's own built data.json and live.json, against live.js's own layout(M, L) taken from the
// file: (1) every node in the same order at the page's place, centred, y up and scaled into the hexagon by GEO's scale; (2) the
// lines bent by GEO's pull; (3) the agents ring's spokes, one per agent; (4) the light theme's colours as they are (app.css's
// light tokens, gold #976000), the dark lifted; (5) the 3D ball unchanged by the choice of theme's place. By dashboard@PrompTugal.angelo.
const fs = require('fs'); const path = require('path'); const os = require('os'); const { execFileSync } = require('child_process')
const APP = path.join(__dirname, '..'), W = path.join(APP, 'android/wallpaper')
;(() => { let ok = true; const fail = m => { ok = false; console.log('  FAIL', m) }
 const dataF = path.join(APP, 'data.json'), liveF = path.join(APP, 'live.json')
 if (!fs.existsSync(dataF) || !fs.existsSync(liveF)) { console.log('no built data.json or live.json'); console.log('FAIL'); return }
 const M = JSON.parse(fs.readFileSync(dataF, 'utf8')).collab.map, L = JSON.parse(fs.readFileSync(liveF, 'utf8'))
 const live = fs.readFileSync(path.join(APP, 'live.js'), 'utf8'), grab = re => { const m = live.match(re); if (!m) throw new Error('live.js changed shape: ' + re); return m[0] }
 const page = new Function([grab(/const COL = \[[^\n]*\]/), grab(/const S = 1000, C = S \/ 2/), grab(/const GEO = \{[^\n]*\}/), grab(/function layout\(M, L\) \{[\s\S]*?\n    \}\n/)].join('\n') + '\nreturn { layout, C, GEO }')()
 const css = fs.readFileSync(path.join(APP, '../../../assets/cc/app.css'), 'utf8')
 const tok = (name, light) => { const re = new RegExp(name + ':\\s*(#[0-9A-Fa-f]{6})', 'g'); const all = [...css.matchAll(re)].map(m => m[1]); return light && all.length > 1 ? all[1] : all[0] }   // dark first, then light
 const rgbOf = (h, light) => [1, 3, 5].map(i => { const v = parseInt(h.slice(i, i + 2), 16) / 255; return light ? v : Math.min(1, v * 1.12 + 0.1) })
 const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hxviews-')), src = ['Graph', 'Json', 'Iso', 'Shaders'].map(n => path.join(W, 'src/main/java/news/promptugal/wallpaper', n + '.java')).concat(path.join(W, 'src/test/java/news/promptugal/wallpaper/ContractDump.java'))
 try { execFileSync('javac', ['-encoding', 'UTF-8', '-d', tmp, ...src], { stdio: ['ignore', 'pipe', 'pipe'] }) } catch (e) { console.log('javac failed:', String(e.stderr).slice(0, 400)); console.log('FAIL'); return }
 const wall = String(Date.parse(L.from) + 60 * 6e4)
 const dump = (lay, th) => JSON.parse(execFileSync('java', ['-cp', tmp, 'news.promptugal.wallpaper.ContractDump', dataF, liveF, wall, lay, th], { encoding: 'utf8', maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] }))
 const near = (a, b, e = 1e-3) => Math.abs(a - b) <= e
 for (const lay of ['ring', 'agents']) for (const th of ['dark', 'light']) {
  const J = dump(lay, th), { pos, col } = page.layout(M, lay), G = page.GEO[lay], C = page.C, tag = `${lay}/${th}`
  if (!J.view.flat || J.view.layout !== lay || J.view.light !== (th === 'light')) fail(`${tag}: the view is ${JSON.stringify(J.view)}`)
  if (!near(J.view.pull, G.pull, 1e-4)) fail(`${tag}: pull ${J.view.pull}, the page ${G.pull}`)
  const ids = [...pos.keys()].filter(id => pos.get(id).kind !== 'k')
  if (J.nodes.length !== ids.length) fail(`${tag}: ${J.nodes.length} nodes, the page ${ids.length}`)
  let bad = 0
  ids.forEach((id, i) => { const n = pos.get(id), j = J.nodes[i] || {}, x = (n.x - C) * G.scale, y = (C - n.y) * G.scale
   const css1 = (col.get(n.person) || '').match(/--[\w-]+/), hex = css1 && tok(css1[0], th === 'light'), want = hex && rgbOf(hex, th === 'light')
   const why = j.id !== id ? 'order' : !(near(j.x, x) && near(j.y, y) && j.z === 0) ? `place ${j.x},${j.y} vs ${x},${y}` : !want || !want.every((v, k) => near(v, j.rgb[k], 2e-3)) ? `colour ${hex} ${j.rgb}` : (n.kind === 'p' ? j.label !== n.label : j.label !== '') ? 'label' : ''
   if (why && bad++ < 5) console.log('   ', tag, i, id, why) })
  if (bad) fail(`${tag}: ${bad} nodes differ from live.js's layout`)
  // the lines: the page's bend, the midpoint pulled towards the centre by GEO's pull
  const byId = new Map(J.nodes.map(n => [n.id, n])); bad = 0
  J.links.forEach(l => { const a = byId.get(l.from), b = byId.get(l.to), q = ['x', 'y'].map(k => (a[k] + b[k]) / 2 * (1 - G.pull)), mid = ['x', 'y'].map((k, i) => 0.25 * a[k] + 0.5 * q[i] + 0.25 * b[k]); if (!mid.every((v, i) => near(v, l.mid[i], 1e-2)) && bad++ < 3) console.log('   ', tag, 'link', l.from, l.to) })
  if (bad) fail(`${tag}: ${bad} lines bent differently`)
  const agents = ids.filter(id => pos.get(id).kind === 'a' && pos.get(pos.get(id).person)).length
  if (J.view.spokes !== (lay === 'agents' ? agents : 0)) fail(`${tag}: ${J.view.spokes} spokes, expected ${lay === 'agents' ? agents : 0}`)
  console.log(`${tag}: ${J.nodes.length} nodes, ${J.links.length} lines, ${J.view.spokes} spokes, pull ${J.view.pull}, light ${J.view.light}`)
 }
 // the 3D ball: the light theme changes the colours only, never the places
 const d3 = dump('3d', 'dark'), l3 = dump('3d', 'light')
 if (d3.view.flat || l3.view.flat) fail('3d drawn flat')
 if (d3.nodes.some((n, i) => !near(n.x, l3.nodes[i].x) || !near(n.y, l3.nodes[i].y) || !near(n.z, l3.nodes[i].z))) fail('3d: the light theme moved a node')
 if (!d3.nodes.some(n => n.z !== 0)) fail('3d: the ball is flat')
 console.log(`3d: ${d3.nodes.length} nodes on the ball, dark and light in the same places`)
 console.log(ok ? 'PASS' : 'FAIL')
})()
