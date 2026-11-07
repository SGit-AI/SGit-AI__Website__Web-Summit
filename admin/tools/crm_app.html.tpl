<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>The team CRM</title>
<!-- The vault app of ws-team-crm-public and ws-team-crm-private (WS-170), built by conductor@web-summit.dinis from
     admin/tools/crm_app.html.tpl in SGit-AI/SGit-AI__Website__Web-Summit (node admin/tools/crm.mjs app). Everything inline;
     data from sg.vfs: graph/nodes.json and graph/edges.json (derived), each record read when opened. Every string from a
     record reaches the page as text. A sealed record (ws-crm-env-1) shows who it is sealed to: it opens on
     web-summit.sgit.ai/crm/, in the browser of someone in its audience, never in this frame. -->
<style>
:root{--bg:#f7f6f2;--card:#fff;--line:#e5e1d5;--ink:#161615;--ink2:#5c5f66;--green:#1a7f5a;--blue:#1d4ed8;--gold:#b45309;--terra:#c8553d;--soft:#eef6f2}
@media (prefers-color-scheme:dark){:root{--bg:#141412;--card:#1c1c19;--line:#34332d;--ink:#ecebe6;--ink2:#a9a59b;--soft:#14302d}}
*{box-sizing:border-box}[hidden]{display:none!important}html,body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}
header{padding:14px 18px;border-bottom:1px solid var(--line);display:flex;flex-wrap:wrap;gap:10px;align-items:center}
h1{margin:0;font-size:20px}h1 span{color:var(--green)}
.tabs{display:flex;gap:6px;flex-wrap:wrap}.tabs button,.chip{font:inherit;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:999px;padding:5px 12px;cursor:pointer}
.tabs button[aria-pressed=true]{background:var(--green);border-color:var(--green);color:#fff}
input[type=search]{font:inherit;padding:7px 12px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:var(--ink);min-width:220px;flex:1}
main{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:14px;padding:14px 18px}
.list{background:var(--card);border:1px solid var(--line);border-radius:12px;max-height:calc(100vh - 120px);overflow:auto}
.row{display:block;width:100%;text-align:left;font:inherit;color:inherit;background:none;border:0;border-bottom:1px solid var(--line);padding:8px 12px;cursor:pointer}
.row:hover,.row[aria-current=true]{background:var(--soft)}.row b{display:block}.row span{color:var(--ink2);font-size:13px}
.lock{color:var(--terra);font-weight:700}
.detail{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px;min-height:300px}
.detail h2{margin:0 0 6px;font-size:18px}.detail dl{display:grid;grid-template-columns:max-content 1fr;gap:3px 12px;margin:8px 0}.detail dt{color:var(--ink2)}.detail dd{margin:0;overflow-wrap:anywhere}
.detail a{color:var(--blue)}svg{width:100%;height:320px;border:1px solid var(--line);border-radius:10px;background:var(--bg);margin-top:8px}
svg text{font:11px system-ui;fill:var(--ink)}svg line{stroke:var(--line);stroke-width:1.4}
.meta{color:var(--ink2);font-size:13px}
.unseal{margin:10px 0;padding:10px;border:1px dashed var(--terra);border-radius:10px}.opened{color:var(--green);font-weight:700;margin:0 0 6px}
@media (max-width:760px){main{grid-template-columns:1fr}.list{max-height:45vh}}
</style>
</head>
<body>
<header>
  <h1>The team CRM <span id="which"></span></h1>
  <span class="meta" id="bridge"></span>
  <div class="tabs" id="tabs"></div>
  <input type="search" id="q" placeholder="Search names, roles, titles..." aria-label="Search">
</header>
<main>
  <div class="list" id="list" role="list"></div>
  <section class="detail" id="detail"><p class="meta" id="intro">Pick a record. Companies, contacts and schedules hold public facts with their sources; the graph shows a record and what it is linked to.</p></section>
</main>
<section id="mail" hidden style="padding:14px 18px"></section>
<script>
// the email twin (WS-176): assets/crm-mail.js, inlined here by `node admin/tools/crm.mjs app`
/*__MAIL__*/
</script>
<script>
const WHICH = /*__WHICH__*/''
const BRIDGE_ORIGINS = /*__ORIGINS__*/['https://web-summit.sgit.ai']
;(function () {
  'use strict'
  const sg = window.sg || null, $ = id => document.getElementById(id)
  const el = (t, cls, txt) => { const e = document.createElement(t); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e }
  const readJson = async p => JSON.parse(await sg.vfs.readText(p))
  const TYPES = [['thread', 'Mail'], ['company', 'Companies'], ['contact', 'Contacts'], ['action', 'Actions'], ['schedule', 'Schedules'], ['vault-key', 'Keys']]
  let NODES = [], EDGES = [], BY = {}, TYPE = 'company', CUR = null
  const label = n => n.label || n.id
  const sub = n => n.type === 'company' ? [n.kind === 'organisation' ? 'organisation' : n.category, n.country].filter(Boolean).join(' · ')
    : n.type === 'contact' ? [n.role, n.organisation].filter(Boolean).join(', ')
    : n.type === 'schedule' ? [n.date, n.start, n.where].filter(Boolean).join(' · ')
    : n.type === 'action' ? [n.state, n.due && 'due ' + n.due, n.owner].filter(Boolean).join(' · ') : ''
  function tabs() {
    const t = $('tabs'); t.textContent = ''
    for (const [k, name] of TYPES) {
      const n = NODES.filter(x => x.type === k && x.file).length; if (!n) continue
      const b = el('button', null, name + ' (' + n + ')'); b.type = 'button'; b.setAttribute('aria-pressed', String(k === TYPE))
      b.onclick = () => { TYPE = k; tabs(); list() }; t.appendChild(b)
    }
    mailMode()
  }
  let MAILED = false
  function mailMode() {                                      // the Mail tab: the email twin takes the page (WS-176)
    const on = TYPE === 'thread' && !!window.WSCrmMail
    $('mail').hidden = !on; document.querySelector('main').hidden = on; $('q').hidden = on
    if (on && !MAILED) { MAILED = true; window.WSCrmMail.mount($('mail'), { nodes: NODES, edges: EDGES, readText: p => sg.vfs.readText(p) }) }
  }
  function list() {
    const q = $('q').value.trim().toLowerCase(), box = $('list'); box.textContent = ''
    const rows = NODES.filter(n => n.file && (q ? JSON.stringify([label(n), sub(n), n.file]).toLowerCase().includes(q) : n.type === TYPE))
      .sort((a, b) => (a.type === 'schedule' ? (a.date + a.start).localeCompare(b.date + b.start) : label(a).localeCompare(label(b)))).slice(0, 400)
    for (const n of rows) {
      const r = el('button', 'row'); r.type = 'button'; r.setAttribute('role', 'listitem')
      r.appendChild(el('b', n.sealed ? 'lock' : null, (n.sealed ? '🔒 ' : '') + label(n)))
      r.appendChild(el('span', null, n.sealed ? 'sealed to ' + (n.audience || []).join(', ') : sub(n)))
      r.onclick = () => show(n.id); box.appendChild(r)
    }
    if (!rows.length) box.appendChild(el('p', 'meta', '  Nothing matches.'))
  }
  async function show(id) {
    const n = BY[id], d = $('detail'); CUR = id; d.textContent = ''
    if (!n) return
    d.appendChild(el('h2', null, label(n)))
    d.appendChild(el('p', 'meta', n.type + (n.file ? ' · ' + n.file : '')))
    if (n.sealed) {
      d.appendChild(el('p', null, 'Sealed (layer 2, ws-crm-env-1) to: ' + (n.audience || []).join(', ') + '.'))
      const box = el('div', 'unseal'); d.appendChild(box)
      if (BRIDGE) {
        const b = el('button', 'chip', 'Unseal'); b.type = 'button'; box.appendChild(b)
        box.appendChild(el('span', 'meta', '  web-summit.sgit.ai opens it with your own key and hands back only this record.'))
        b.onclick = async () => {
          b.disabled = true; b.textContent = 'Asking web-summit.sgit.ai...'
          const r = await unseal(n.file)
          if (CUR !== id) return
          if (!r.ok) { b.disabled = false; b.textContent = 'Unseal'; box.appendChild(el('p', 'meta', 'Not opened: ' + String(r.reason || 'refused'))); return }
          box.textContent = ''; box.appendChild(el('p', 'opened', '🔓 Unsealed by web-summit.sgit.ai for you'))
          box.appendChild(recordView(r.record))
        }
      } else box.appendChild(el('p', 'meta', 'To unseal it, open this app from web-summit.sgit.ai/crm/ (Open the private CRM, then Open the CRM app here, with unsealing): your key lives in that site\'s browser storage, which this window cannot reach.'))
    } else if (n.file) {
      try { d.appendChild(recordView(await readJson(n.file))) } catch (e) { d.appendChild(el('p', 'meta', 'Could not read ' + n.file)) }
    }
    graph(id)
  }
  function recordView(r) {                                   // untrusted: every value reaches the page as text
    const dl = el('dl')
    if (!r || typeof r !== 'object') { dl.appendChild(el('dd', null, String(r))); return dl }
        for (const [k, v] of Object.entries(r)) {
          if (['id', 'type', 'topic_names', 'updated_by'].includes(k) || v == null || (Array.isArray(v) && !v.length)) continue
          dl.appendChild(el('dt', null, k))
          const dd = el('dd')
          if (k === 'sources' && Array.isArray(v)) v.forEach(s => { const a = el('a', null, String(s && s.url)); a.href = /^https?:\/\//.test(String(s && s.url)) ? s.url : '#'; dd.appendChild(a); dd.appendChild(el('span', 'meta', ' read ' + (s.read_at || '') + ' ')); dd.appendChild(el('br')) })
          else if (k === 'website' && /^https?:/.test(v)) { const a = el('a', null, v); a.href = v; dd.appendChild(a) }
          else dd.textContent = typeof v === 'string' ? v : JSON.stringify(v)
          dl.appendChild(dd)
        }
    return dl
  }
  // ---------- the bridge to web-summit.sgit.ai/crm/ (WS-170, "the dance") ----------
  // The person's key lives only in web-summit.sgit.ai's storage. When that page embeds this app, it answers a ping; then
  // Unseal asks it for one record by path. The page reads the sealed envelope itself, with the vault key it holds, and
  // sends back only that record's fields. Replies are taken only from window.top, from an allowed origin, with our nonce.
  let BRIDGE = false
  const nonce = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), b => b.toString(16).padStart(2, '0')).join('')
  function ask(msg, ms) {
    return new Promise(done => {
      const n = nonce(), t = setTimeout(() => { removeEventListener('message', on); done(null) }, ms)
      function on(e) {
        const d = e.data || {}
        if (e.source !== window.top || !BRIDGE_ORIGINS.includes(e.origin) || d.nonce !== n) return
        clearTimeout(t); removeEventListener('message', on); done(d)
      }
      addEventListener('message', on)
      try { window.top.postMessage({ ...msg, v: 1, nonce: n }, '*') } catch (e) { clearTimeout(t); done(null) }   // the page answers by nonce
    })
  }
  async function ping() { const r = await ask({ type: 'ws-crm-unseal-ping' }, 1500); BRIDGE = !!(r && r.type === 'ws-crm-unseal-pong'); return BRIDGE }
  async function unseal(path) {
    const r = await ask({ type: 'ws-crm-unseal-request', path }, 30000)
    if (!r) return { ok: false, reason: 'no answer from web-summit.sgit.ai' }
    return r.type === 'ws-crm-unseal-result' ? r : { ok: false, reason: 'unexpected answer' }
  }
  // a small force graph: the record and what it links to (one hop), laid out by a few hundred steps of a spring model
  function graph(id) {
    const near = EDGES.filter(e => e.from === id || e.to === id).slice(0, 40)
    const ids = [...new Set([id, ...near.flatMap(e => [e.from, e.to])])]
    const W = 600, H = 320, P = ids.map((x, i) => ({ id: x, x: W / 2 + (i ? Math.cos(i) * 120 : 0), y: H / 2 + (i ? Math.sin(i) * 100 : 0), vx: 0, vy: 0 }))
    const at = Object.fromEntries(P.map(p => [p.id, p]))
    for (let it = 0; it < 250; it++) {
      for (const a of P) for (const b of P) { if (a === b) continue; const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy + 0.01, f = 1800 / d2; a.vx += dx * f / 40; a.vy += dy * f / 40 }
      for (const e of near) { const a = at[e.from], b = at[e.to], dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1, f = (d - 110) / d * 0.05; a.vx += dx * f; a.vy += dy * f; b.vx -= dx * f; b.vy -= dy * f }
      for (const p of P) { if (p.id === id) { p.x = W / 2; p.y = H / 2; continue } p.x = Math.max(30, Math.min(W - 30, p.x + p.vx)); p.y = Math.max(20, Math.min(H - 20, p.y + p.vy)); p.vx *= 0.5; p.vy *= 0.5 }
    }
    const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg'), mk = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e }
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'What ' + label(BY[id] || { id }) + ' is linked to')
    const COL = { company: '#1a7f5a', contact: '#1d4ed8', schedule: '#b45309', action: '#c8553d', topic: '#7c3aed', event: '#0e7490', person: '#c8553d' }
    for (const e of near) { const a = at[e.from], b = at[e.to]; svg.appendChild(mk('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y })); const t = mk('text', { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, 'text-anchor': 'middle', opacity: 0.6 }); t.textContent = e.verb; svg.appendChild(t) }
    for (const p of P) {
      const n = BY[p.id] || { id: p.id, type: p.id.split(':')[0] }, g = mk('g', { style: 'cursor:pointer' })
      g.appendChild(mk('circle', { cx: p.x, cy: p.y, r: p.id === id ? 11 : 7, fill: COL[n.type] || '#888' }))
      const t = mk('text', { x: p.x + 10, y: p.y + 4 }); t.textContent = label(n).slice(0, 28); g.appendChild(t)
      g.addEventListener('click', () => { if (BY[p.id]) show(p.id) }); svg.appendChild(g)
    }
    $('detail').appendChild(svg)
    $('detail').appendChild(el('p', 'meta', near.length + ' link' + (near.length === 1 ? '' : 's') + (near.length === 40 ? ' (the first 40)' : '') + '. Click a node to open it.'))
  }
  async function start() {
    $('which').textContent = WHICH ? '(' + WHICH + ')' : ''
    try { NODES = (await readJson('graph/nodes.json')).nodes; EDGES = (await readJson('graph/edges.json')).edges }
    catch (e) { $('intro').textContent = 'Could not read graph/: run node admin/tools/crm.mjs derive.' }
    BY = Object.fromEntries(NODES.map(n => [n.id, n]))
    if (WHICH === 'private' && NODES.some(n => n.type === 'thread' && n.file)) TYPE = 'thread'   // the mail first (WS-176)
    if (!NODES.some(n => n.type === TYPE && n.file)) TYPE = (TYPES.find(([k]) => NODES.some(n => n.type === k && n.file)) || ['company'])[0]
    tabs(); list(); $('q').addEventListener('input', list)
    if (WHICH === 'private' && window.top !== window) ping().then(ok => { $('bridge').textContent = ok ? '🔑 Unsealing through web-summit.sgit.ai' : 'No unsealing here: open from web-summit.sgit.ai/crm/'; if (CUR) show(CUR) })
    try { window.parent && window.parent.postMessage({ type: 'sg-app-ready' }, '*') } catch (e) { }
  }
  start().catch(e => { console.error(e); try { window.parent.postMessage({ type: 'sg-app-ready' }, '*') } catch (x) { } })
})()
</script>
</body>
</html>
