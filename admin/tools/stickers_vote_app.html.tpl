<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Pick the sticker: the team vote</title>
<!-- The vault app of ws-stickers-vote (WS-159), built by conductor@web-summit.dinis from
     admin/tools/stickers_vote_app.html.tpl in SGit-AI/SGit-AI__Website__Web-Summit (admin/tools/stickers_vote.py app).
     Everything is inline (the vault-app contract); images are set from JS; data comes from sg.vfs, with an inlined
     fallback. Every string from a ballot or a file reaches the page as text, never as HTML. -->
<style>
:root{--bg:#141412;--bg2:#1c1c19;--card:#24241f;--line:#3a3933;--ink:#f7f6f2;--ink2:#b9b5aa;--green:#1a7f5a;--mint:#5fd4c8;--gold:#f2c230;--terra:#c8553d;--blue:#1d4ed8}
*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}
body{background-image:radial-gradient(circle at 15% 0%,rgba(26,127,90,.35),transparent 40%),radial-gradient(circle at 90% 10%,rgba(242,194,48,.18),transparent 35%),radial-gradient(circle at 50% 100%,rgba(29,78,216,.25),transparent 45%);min-height:100vh}
a{color:var(--mint)}
.wrap{max-width:1280px;margin:0 auto;padding:28px 20px 80px}
header.top{display:flex;flex-wrap:wrap;gap:18px;align-items:flex-end;justify-content:space-between;margin-bottom:22px}
h1{font-size:clamp(34px,6vw,68px);line-height:.95;margin:0;letter-spacing:-.02em}
h1 span{display:inline-block;color:var(--gold);transform:rotate(-4deg);animation:wob 3s ease-in-out infinite}
@keyframes wob{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(3deg) scale(1.05)}}
.sub{color:var(--ink2);max-width:46ch;margin:10px 0 0}
.pill{display:inline-flex;gap:8px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:999px;padding:8px 14px;font-weight:600}
.pill b{color:var(--gold);font-variant-numeric:tabular-nums}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:22px}
.card{position:relative;background:var(--card);border:1px solid var(--line);border-radius:22px;padding:14px 14px 16px;cursor:pointer;transform:translateY(30px) scale(.92);opacity:0;transition:transform .35s cubic-bezier(.2,1.4,.4,1),box-shadow .3s,border-color .3s;outline:none}
.card.in{opacity:1;transform:none;transition:opacity .5s,transform .6s cubic-bezier(.2,1.5,.4,1),box-shadow .3s,border-color .3s}
.card:hover,.card:focus-visible{transform:translateY(-4px);box-shadow:0 18px 40px rgba(0,0,0,.45);border-color:var(--c,var(--gold))}
.card .img{aspect-ratio:1;border-radius:16px;overflow:hidden;background:var(--c,#333);display:grid;place-items:center}
.card img{width:100%;height:100%;object-fit:contain;display:block;transition:transform .5s}
.card:hover img{transform:scale(1.05)}
.num{position:absolute;top:22px;left:22px;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;font-weight:900;font-size:20px;background:var(--gold);color:#161615;border:3px solid #161615;z-index:2}
.card h3{margin:12px 2px 2px;font-size:19px}
.card p{margin:2px;color:var(--ink2);font-size:14px}
.card .votes{position:absolute;top:10px;right:10px;background:#161615;color:var(--gold);border-radius:999px;padding:4px 10px;font-weight:800;font-size:14px;z-index:2;display:none}
.card .votes.on{display:block;animation:pop .5s cubic-bezier(.2,1.8,.4,1)}
.card.lead{border-color:var(--gold);box-shadow:0 0 0 3px rgba(242,194,48,.35)}
.card.lead::after{content:"";position:absolute;top:-18px;left:50%;width:44px;height:30px;transform:translateX(-50%);background:var(--gold);clip-path:polygon(0 100%,0 30%,25% 60%,50% 0,75% 60%,100% 30%,100% 100%);animation:wob 2s infinite}
@keyframes pop{0%{transform:scale(0)}100%{transform:scale(1)}}
section.panel{margin-top:42px;background:var(--bg2);border:1px solid var(--line);border-radius:22px;padding:22px}
section.panel h2{margin:0 0 6px;font-size:26px}
.muted{color:var(--ink2)}
.bars{display:grid;gap:10px;margin-top:14px}
.bar{display:grid;grid-template-columns:44px 1fr 46px;gap:12px;align-items:center;animation:race .6s cubic-bezier(.2,1.4,.4,1) both}
@keyframes race{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:none}}
.bar img{width:44px;height:44px;object-fit:cover;border-radius:10px;background:#333}
.bar .t{position:relative;height:34px;background:var(--card);border-radius:10px;overflow:hidden}
.bar .t i{position:absolute;inset:0 auto 0 0;width:0;background:linear-gradient(90deg,var(--green),var(--mint));border-radius:10px;transition:width 1.2s cubic-bezier(.2,1,.3,1)}
.bar .t span{position:absolute;left:12px;top:6px;font-weight:600;font-size:14px;white-space:nowrap;text-shadow:0 1px 2px #000}
.bar b{font-size:20px;text-align:right;font-variant-numeric:tabular-nums}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.chip{background:var(--card);border:1px solid var(--line);border-radius:999px;padding:6px 12px;font-weight:600}
.chip::before{content:"\2713  ";color:var(--mint)}
.drain{border-color:var(--terra)}
.drain input{font:inherit;padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--ink);width:min(420px,100%)}
button{font:700 15px/1 system-ui,sans-serif;padding:12px 18px;border-radius:12px;border:0;background:var(--gold);color:#161615;cursor:pointer}
button:disabled{opacity:.5;cursor:default}
button.ghost{background:var(--card);color:var(--ink);border:1px solid var(--line)}
.log{font:13px/1.5 ui-monospace,monospace;background:#0d0d0c;border-radius:12px;padding:12px;margin-top:12px;white-space:pre-wrap;max-height:260px;overflow:auto}
.lb{position:fixed;inset:0;background:rgba(10,10,9,.94);display:none;z-index:50;align-items:center;justify-content:center;flex-direction:column;padding:16px}
.lb.open{display:flex;animation:fade .25s}
@keyframes fade{from{opacity:0}to{opacity:1}}
.lb img{max-width:min(92vw,1100px);max-height:72vh;object-fit:contain;border-radius:18px;box-shadow:0 30px 80px rgba(0,0,0,.6);animation:zoom .35s cubic-bezier(.2,1.4,.4,1)}
@keyframes zoom{from{transform:scale(.85) rotate(-3deg)}to{transform:none}}
.lb .cap{text-align:center;max-width:720px;margin-top:14px}
.lb .cap h2{margin:0;font-size:28px}
.lb .cap .w{color:var(--gold);font-weight:800;letter-spacing:.04em;margin:4px 0}
.lb .nav{position:absolute;top:50%;transform:translateY(-50%);font-size:30px;width:56px;height:56px;border-radius:50%;padding:0}
.lb .prev{left:14px}.lb .next{right:14px}
.lb .x{position:absolute;top:14px;right:14px}
.lb .row{display:flex;gap:10px;justify-content:center;margin-top:12px;flex-wrap:wrap}
.ph{display:inline-block;background:var(--terra);color:#fff;border-radius:6px;padding:1px 7px;font-size:12px;font-weight:700;margin-left:6px;vertical-align:middle}
footer{margin-top:40px;color:var(--ink2);font-size:14px}
@media (max-width:560px){.grid{grid-template-columns:repeat(2,1fr);gap:12px}.card{padding:8px 8px 10px;border-radius:16px}.card h3{font-size:15px}.card p{display:none}.num{width:36px;height:36px;font-size:16px}.lb .nav{display:none}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.card{opacity:1;transform:none}}
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <div>
      <h1 id="title">Pick the <span>sticker</span></h1>
      <p class="sub" id="tagline"></p>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
      <span class="pill" id="clock">Voting closes in <b id="cd">...</b></span>
      <a class="pill" id="votelink" href="https://web-summit.sgit.ai/stickers/vote/index.html">Vote on the site (team only) &rarr;</a>
    </div>
  </header>
  <main class="grid" id="grid"></main>

  <section class="panel" id="results">
    <h2>The leaderboard so far</h2>
    <p class="muted" id="rnote">Reading results.json...</p>
    <div class="bars" id="bars"></div>
    <div class="chips" id="voters"></div>
  </section>

  <section class="panel drain" id="drain" hidden>
    <h2>Drain the votes</h2>
    <p class="muted">You opened this vault writable, so you can drain. This lists every team lane, opens each ballot with the drain key (identity/private/, unwrapped with the drain passphrase from your sealed message), checks the person's signature against identity/person-keys.json and that it came on their own lane, appends the sealed ballots to votes/, recounts results.json, pushes the vault, and only then marks the lane files processed.</p>
    <p><label for="pass" class="muted">Drain passphrase</label><br><input id="pass" type="password" autocomplete="off" placeholder="from your sealed message on the site"> <button id="go" type="button">Drain</button></p>
    <div class="log" id="log" hidden></div>
  </section>

  <footer>
    <p>An encrypted SG/Vault, rendered straight from it: the images, this app and the count live in the vault; the votes arrive sealed, one append lane per team person, and only a drainer opens them. Who voted is public; what each person chose is counted, never listed. <span id="meta"></span></p>
  </footer>
</div>

<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Sticker">
  <button class="x ghost" id="lbx" type="button" aria-label="Close">Close</button>
  <button class="nav prev ghost" id="lbp" type="button" aria-label="Previous">&lsaquo;</button>
  <img id="lbimg" alt="">
  <div class="cap"><h2 id="lbt"></h2><p class="w" id="lbw"></p><p class="muted" id="lbj"></p>
    <div class="row"><button class="ghost" id="lbo" type="button">Open the original</button></div></div>
  <button class="nav next ghost" id="lbn" type="button" aria-label="Next">&rsaquo;</button>
</div>

<script>
const FALLBACK = /*__DATA__*/{};
(function () {
  'use strict'
  const sg = window.sg || null
  const $ = id => document.getElementById(id)
  const el = (t, cls, txt) => { const e = document.createElement(t); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e }
  const readText = async p => { if (!sg || !sg.vfs) throw new Error('no vault bridge'); return sg.vfs.readText(p) }
  const readJson = async p => JSON.parse(await readText(p))
  let DATA = FALLBACK, idx = 0, RESULTS = null

  // ---------- the gallery ----------
  function build() {
    $('tagline').textContent = DATA.tagline || ''
    const g = $('grid'); g.textContent = ''
    DATA.stickers.forEach((s, i) => {
      const c = el('article', 'card'); c.tabIndex = 0; c.style.setProperty('--c', s.colour); c.dataset.id = s.id
      c.setAttribute('aria-label', s.id + '. ' + s.name)
      const n = el('span', 'num', String(s.id)), v = el('span', 'votes'), box = el('div', 'img'), img = el('img')
      img.alt = s.name; img.loading = 'lazy'; img.src = s.thumb          // set from JS: the bridge routes it
      box.appendChild(img)
      const h = el('h3', null, s.name); if (s.placeholder) h.appendChild(el('span', 'ph', 'placeholder'))
      c.append(n, v, box, h, el('p', null, s.joke))
      c.addEventListener('click', () => show(i))
      c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i) } })
      g.appendChild(c)
      setTimeout(() => c.classList.add('in'), 60 + i * 70)
    })
  }
  function show(i) {
    idx = (i + DATA.stickers.length) % DATA.stickers.length
    const s = DATA.stickers[idx]
    $('lbimg').src = s.web; $('lbimg').alt = s.name
    $('lbt').textContent = s.id + '. ' + s.name; $('lbw').textContent = s.words; $('lbj').textContent = s.joke
    $('lb').classList.add('open')
  }
  const hide = () => $('lb').classList.remove('open')
  $('lbx').onclick = hide; $('lbp').onclick = () => show(idx - 1); $('lbn').onclick = () => show(idx + 1)
  $('lb').addEventListener('click', e => { if (e.target === $('lb')) hide() })
  $('lbo').onclick = () => { const s = DATA.stickers[idx]; try { sg.ui.preview(s.full) } catch (e) { } }
  document.addEventListener('keydown', e => {
    if (!$('lb').classList.contains('open')) return
    if (e.key === 'Escape') hide(); else if (e.key === 'ArrowLeft') show(idx - 1); else if (e.key === 'ArrowRight') show(idx + 1)
  })
  let tx = null
  $('lb').addEventListener('touchstart', e => { tx = e.touches[0].clientX }, { passive: true })
  $('lb').addEventListener('touchend', e => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); tx = null })

  // ---------- the countdown ----------
  function tick() {
    const ms = Date.parse(DATA.closes_at || '2026-11-05T18:00:00Z') - Date.now()
    if (ms <= 0) { $('clock').textContent = 'Voting has closed'; return }
    const h = Math.floor(ms / 3.6e6), m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60
    $('cd').textContent = (h ? h + 'h ' : '') + String(m).padStart(2, '0') + 'm ' + String(s).padStart(2, '0') + 's'
  }

  // ---------- the count ----------
  function showResults(r) {
    RESULTS = r
    const bars = $('bars'), chips = $('voters'); bars.textContent = ''; chips.textContent = ''
    const n = r && r.voters_count || 0
    $('rnote').textContent = n ? n + ' of the team ' + (n === 1 ? 'has' : 'have') + ' voted (counted ' + String(r.as_of || '').replace('T', ' ').slice(0, 16) + ' UTC' + (r.changed_votes ? ', ' + r.changed_votes + ' replaced ballot' + (r.changed_votes === 1 ? '' : 's') : '') + '). Each person ranks a top 6: 1st = 6 points, 6th = 1. The newest ballot counts.' : 'No ballots counted yet. They arrive sealed in the lanes and are counted when someone drains them.'
    const by = {}; (r.ranking || []).forEach(x => { by[x.id] = x })
    const pts = id => (by[id] && by[id].points != null ? by[id].points : ((r.counts || {})[id] || 0))
    const max = Math.max(1, ...DATA.stickers.map(s => pts(s.id)))
    const order = DATA.stickers.slice().sort((a, b) => pts(b.id) - pts(a.id) || a.id - b.id)
    order.forEach((s, k) => {
      const v = pts(s.id), x = by[s.id] || {}, row = el('div', 'bar'), img = el('img'), t = el('div', 't'), i = el('i')
      img.src = s.thumb; img.alt = ''
      row.style.animationDelay = (k * 70) + 'ms'
      t.append(i, el('span', null, (v ? '#' + (k + 1) + '  ' : '') + s.id + '. ' + s.name + (x.top6 ? '  ·  in ' + x.top6 + ' top 6' + (x.top6 === 1 ? '' : 's') : '') + (x.not_for_me ? '  ·  ' + x.not_for_me + ' not for me' : '')))
      row.append(img, t, el('b', null, String(v))); bars.appendChild(row)
      requestAnimationFrame(() => setTimeout(() => { i.style.width = (100 * v / max) + '%' }, 150 + k * 90))
      const card = document.querySelector('.card[data-id="' + s.id + '"]')
      if (card) { const b = card.querySelector('.votes'); b.textContent = v + (v === 1 ? ' pt' : ' pts'); b.classList.toggle('on', v > 0); card.classList.toggle('lead', !!(r.leader && r.leader.id === s.id && v > 0)) }
    })
    ;(r.voters || []).forEach(x => chips.appendChild(el('span', 'chip', x.person)))
  }

  // ---------- the drain (writable only) ----------
  const b64d = s => Uint8Array.from(atob(s), c => c.charCodeAt(0))
  const hex = buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
  const sha256 = async s => hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))
  const iso = ms => new Date(ms).toISOString().replace(/\.\d+Z$/, 'Z')
  let KEY = null
  async function drainKey(pass) {
    if (KEY) return KEY
    const w = await readJson('identity/private/drain-key.sealed.json')
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveKey'])
    const k = await crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: b64d(w.salt), iterations: w.iterations }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt'])
    let inner
    try { inner = JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64d(w.iv) }, k, b64d(w.ct)))) }
    catch (e) { throw new Error('the drain passphrase does not open the drain key') }
    KEY = await crypto.subtle.importKey('pkcs8', b64d(inner.encrypt_pkcs8), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['decrypt'])
    return KEY
  }
  async function openEnv(content, key) {                                   // the lane payload is base64 of the .enc text
    const env = JSON.parse(atob(atob(content)))
    const aes = await crypto.subtle.importKey('raw', await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, key, b64d(env.w)), { name: 'AES-GCM' }, false, ['decrypt'])
    return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64d(env.i), tagLength: 128 }, aes, b64d(env.c))))
  }
  // a ballot's [ranking, not_for_me]: v2 (a top 6, ranked) or v1 (one choice, a top 6 of one); the same rules as the CLI
  function ballot(v) {
    const ok = x => Number.isInteger(x) && x >= 1 && x <= 12, uniq = a => new Set(a).size === a.length
    if (v.type === 'web-summit.sticker-vote/v1') { if (!ok(v.choice)) throw new Error('choice is not 1 to 12'); return [[v.choice], []] }
    if (v.type !== 'web-summit.sticker-vote/v2') throw new Error('not a sticker vote')
    const rk = v.ranking, nf = v.not_for_me || []
    if (!Array.isArray(rk) || rk.length < 1 || rk.length > 6 || !rk.every(ok) || !uniq(rk)) throw new Error('ranking is not 1 to 6 distinct stickers')
    if (!Array.isArray(nf) || !nf.every(ok) || !uniq(nf) || nf.some(x => rk.includes(x))) throw new Error('not_for_me is not a list of other stickers')
    return [rk, nf]
  }
  function tally(ballots) {
    const t = {}; DATA.stickers.forEach(s => { t[s.id] = { id: s.id, name: s.name, points: 0, top6: 0, firsts: 0, not_for_me: 0 } })
    for (const [rk, nf] of ballots) { rk.forEach((n, i) => { t[n].points += 6 - i; t[n].top6++; if (!i) t[n].firsts++ }); nf.forEach(n => { t[n].not_for_me++ }) }
    return Object.values(t).sort((a, b) => b.points - a.points || b.top6 - a.top6 || a.not_for_me - b.not_for_me || a.id - b.id)
  }
  async function verify(p, lanePerson, keys) {
    const vote = JSON.parse(p.signed)
    ballot(vote)
    const k = keys.find(k => k.person === vote.person && k.fingerprint === p.key)
    if (!k) throw new Error('no published key ' + p.key + ' for ' + vote.person)
    if (k.status !== 'active') throw new Error('key ' + k.fingerprint + ' is ' + k.status)
    const pub = await crypto.subtle.importKey('jwk', { kty: 'EC', crv: 'P-256', x: k.sign.x, y: k.sign.y }, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify'])
    if (!await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, pub, b64d(p.sig), new TextEncoder().encode(p.signed))) throw new Error('the signature does not verify')
    if (vote.person !== lanePerson) throw new Error('signed by ' + vote.person + ' but written on the lane of ' + lanePerson)
    return vote
  }
  async function loadRows() {
    let names = []
    try { names = (await sg.vfs.list('votes')).filter(e => e.type !== 'folder').map(e => String(e.path || e.name || '').split('/').pop()).filter(n => /\.jsonl$/.test(n)).sort() } catch (e) { }
    const rows = []
    for (const n of names) { try { (await readText('votes/' + n)).split('\n').forEach(l => { if (l.trim()) rows.push(JSON.parse(l)) }) } catch (e) { } }
    return rows
  }
  async function recount(rows, key) {
    const close = DATA.closes_at, best = {}, now = iso(Date.now())
    let late = 0, bad = 0
    for (const r of rows) {
      if (!r.verified) { bad++; continue }
      if (r.received > close) { late++; continue }
      if (!best[r.person] || r.received > best[r.person].received) best[r.person] = r
    }
    const ballots = []
    for (const r of Object.values(best)) ballots.push(ballot(JSON.parse((await openEnv(r.envelope, key)).signed)))
    const ranking = tally(ballots), counts = {}; ranking.forEach(x => { counts[String(x.id)] = x.points })
    const okRows = rows.filter(r => r.verified && r.received <= close).length
    return { v: 2, method: 'Borda: 1st = 6 points, 2nd = 5 ... 6th = 1; a v1 ballot is a top 6 of one', as_of: now, closes_at: close, closed: now >= close, voters_count: Object.keys(best).length, counts, ranking,
      leader: ranking[0].points ? ranking[0] : null, voters: Object.entries(best).map(([p, r]) => ({ person: p, at: r.received })).sort((a, b) => a.at < b.at ? -1 : 1),
      ballots: rows.length, changed_votes: okRows - Object.keys(best).length, late, rejected: bad, drained_by: 'the vault app (in the browser)',
      note: 'A top 6 per team person, ranked; a new ballot replaces the earlier one (the newest counts). Ballots stay sealed in votes/: who voted is public, what each person chose is not.' }
  }
  async function drain(say) {
    const key = await drainKey($('pass').value.trim())
    say('Drain key opened. Listing the lanes...')
    const lanes = (await readJson('identity/lanes.json')).lanes, keys = (await readJson('identity/person-keys.json')).keys
    let entries = [], after = null
    for (;;) {
      const page = await sg.append.list({ include_content: false, after_file_id: after, limit: 200 })
      const got = (page && page.entries) || []; entries = entries.concat(got)
      if (!page || !page.truncated || !got.length) break
      after = got[got.length - 1].file_id
    }
    if (!entries.length) { say('The lanes are empty: nothing to drain. Recounting what is in votes/...') }
    const byLane = {}; entries.forEach(e => { (byLane[e.inbox] = byLane[e.inbox] || []).push(e.file_id) })
    const old = await loadRows(), seen = new Set(old.map(r => r.file)), fresh = [], done = {}
    let rejected = 0
    for (const tok in byLane) {
      const person = lanes[await sha256(tok)] || null, ids = byLane[tok]
      say((person || 'an unknown lane') + ': ' + ids.length + ' pending')
      for (let i = 0; i < ids.length; i += 50) {
        const r = await sg.append.fetch({ inbox: tok, file_ids: ids.slice(i, i + 50) })
        for (const f of (r && r.files) || []) {
          (done[tok] = done[tok] || []).push(f.file_id)
          if (seen.has(f.file_id)) continue
          const row = { envelope: f.content, file: f.file_id, finding: null, lane: person, person: null, received: iso(parseInt(String(f.file_id).slice(0, 13), 10) || 0), verified: false }
          try { const v = await verify(await openEnv(f.content, key), person, keys); row.person = v.person; row.verified = true }
          catch (e) { row.finding = String(e.message || e).slice(0, 200); rejected++ }
          fresh.push(row); seen.add(f.file_id)
        }
      }
    }
    if (fresh.length) {
      const path = 'votes/' + iso(Date.now()).slice(0, 10) + '.jsonl'
      let prev = ''; try { prev = await readText(path) } catch (e) { }
      await sg.vfs.write(path, prev + (prev && !prev.endsWith('\n') ? '\n' : '') + fresh.map(r => JSON.stringify(r)).join('\n') + '\n')
    }
    const res = await recount(old.concat(fresh), key)
    await sg.vfs.write('results.json', JSON.stringify(res, null, 2) + '\n')
    say(fresh.length + ' new ballot(s), ' + rejected + ' rejected. Pushing the vault...')
    await sg.sync.push()
    for (const tok in done) for (let k = 0; k < done[tok].length; k += 100) await sg.append.markProcessed({ inbox: tok, file_ids: done[tok].slice(k, k + 100) })
    say('Drained ' + fresh.length + ', pushed, marked processed. ' + res.voters_count + ' voter(s) so far.')
    showResults(res)
  }
  function drainPanel() {
    if (!sg || !sg.app || !sg.app.writable) return
    $('drain').hidden = false
    const log = $('log'), say = t => { log.hidden = false; log.textContent += t + '\n'; log.scrollTop = 1e9 }
    $('go').onclick = async () => {
      $('go').disabled = true
      try { await drain(say) }
      catch (e) { const c = String(e.code || e.message || e); say(/EREADONLY|read.only/i.test(c) ? 'This vault is open read-only: add your SG/Send access token in the vault host (the lock button), then press Drain again. Nothing was marked processed.' : 'The drain stopped: ' + c + '. Nothing was marked processed.') }
      $('go').disabled = false
    }
  }

  async function start() {
    try { const j = await readJson('content.json'); if (j && j.stickers) DATA = j } catch (e) { }
    build(); tick(); setInterval(tick, 1000)
    try { showResults(await readJson('results.json')) } catch (e) { $('rnote').textContent = 'No count yet (results.json is written by the drain).' }
    drainPanel()
    $('meta').textContent = sg && sg.app ? '(' + (sg.app.writable ? 'open writable' : 'open read-only') + ')' : ''
    try { window.parent && window.parent.postMessage({ type: 'sg-app-ready' }, '*') } catch (e) { }
  }
  start().catch(e => { console.error('[stickers] start failed', e); try { window.parent.postMessage({ type: 'sg-app-ready' }, '*') } catch (x) { } })
})()
</script>
</body>
</html>
