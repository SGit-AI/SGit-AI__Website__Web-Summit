// network-views d1 mocks: data, actors, the clock (live and replay), the detail card and the feed. Shared by a/, b/, c/.
export const COL = { bg: '#07111F', text: '#D5E1EE', dim: '#8FA6C2', line: 'rgba(148,186,222,.16)', cyan: '#05BFE9', gold: '#F5B942', violet: '#A855F7', green: '#3DDC97', orange: '#F97316', red: '#FF5C7A' }
// Where work runs: each has a colour AND a shape AND a word (nothing told by colour alone).
export const WHERE = {
  person: { label: 'Angelo (a person)', color: COL.gold, shape: 'star' },
  'account-b': { label: 'Account B (Claude)', color: COL.cyan, shape: 'diamond' },
  openrouter: { label: 'OpenRouter', color: COL.violet, shape: 'triangle' },
  local: { label: 'Local model (none yet)', color: COL.green, shape: 'square' },
  market: { label: 'Other accounts, the market (none yet)', color: COL.orange, shape: 'circle' },
}
export const SLOTS = ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel', 'india', 'juliett', 'kilo', 'lima']
export const short = n => n.replace(/@PrompTugal\.angelo$/, '').replace(/\.large\.worker$/, '').replace(/^google\//, '')
export const tierOf = n => n === 'Angelo' ? 0 : /^conductor\.b@/.test(n) ? 1 : /\.pm@|^digest\.b@|^accountant\.b@|^conductor\.fringe@/.test(n) ? 2 : /\.worker@/.test(n) ? 3 : n === 'sub-agent' ? 4 : 5
export const whereOfActor = n => n === 'Angelo' ? 'person' : /^ollama/.test(n) ? 'local' : /another account/.test(n) ? 'market' : /\//.test(n) ? 'openrouter' : 'account-b'
export const TIER_NAMES = ['Angelo', 'Conductor', 'Leads and helpers', 'Workers (slots)', 'Sub-agents', 'Outside the account']
export const hm = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(Math.floor(m % 60)).padStart(2, '0')}`
export const money = v => v == null ? 'not recorded' : v < 0.01 ? `$${v.toFixed(4)}` : `$${v.toFixed(2)}`
export const tok = v => v == null ? '' : v >= 1e6 ? (v / 1e6).toFixed(1) + 'M tok' : v >= 1e3 ? Math.round(v / 1e3) + 'k tok' : v + ' tok'
const min = s => { const d = new Date(s); return d.getUTCHours() * 60 + d.getUTCMinutes() + d.getUTCSeconds() / 60 }

export async function load(url = '../sample-handoffs.json') {
  const j = await (await fetch(url)).json()
  const rows = j.rows.map(r => ({ ...r, t0: min(r.at), t1: r.end ? min(r.end) : null }))
  // OpenRouter calls in the same minute are spread over it, so a burst reads as a burst.
  const seen = {}; for (const r of rows) if (r.where === 'openrouter') { const k = r.at; seen[k] = (seen[k] || 0) + 1; r.t0 += (seen[k] - 1) * 0.11 }
  rows.sort((a, b) => a.t0 - b.t0)
  const names = new Set(); rows.forEach(r => { names.add(r.from); names.add(r.to) })
  const actors = [...names].map(id => ({ id, label: short(id), tier: tierOf(id), where: whereOfActor(id), slot: SLOTS.indexOf(short(id).split('.')[0]) }))
  return { day: j.day, rows, actors, start: Math.floor(rows[0].t0 / 60) * 60, end: Math.ceil((rows.at(-1).t0 + 20) / 60) * 60 }
}

export function shapePath(ctx, shape, x, y, r) {
  ctx.beginPath()
  if (shape === 'diamond') { ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y); ctx.closePath() }
  else if (shape === 'triangle') { ctx.moveTo(x, y - r); ctx.lineTo(x + r * .95, y + r * .7); ctx.lineTo(x - r * .95, y + r * .7); ctx.closePath() }
  else if (shape === 'square') ctx.rect(x - r * .8, y - r * .8, r * 1.6, r * 1.6)
  else if (shape === 'star') { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * .45 : r; ctx.lineTo(x + q * Math.cos(a), y + q * Math.sin(a)) } ctx.closePath() }
  else ctx.arc(x, y, r, 0, Math.PI * 2)
}
export const shapeSvg = (shape, color, dashed) => {
  const s = { diamond: '<path d="M7 1 13 7 7 13 1 7Z"/>', triangle: '<path d="M7 1 13 12H1Z"/>', square: '<rect x="2" y="2" width="10" height="10"/>', star: '<path d="M7 .5 8.8 5.2 13.5 5.4 9.8 8.4 11.1 13 7 10.3 2.9 13 4.2 8.4.5 5.4 5.2 5.2Z"/>', circle: '<circle cx="7" cy="7" r="5.5"/>' }[shape]
  return `<svg viewBox="0 0 14 14" aria-hidden="true" style="fill:${dashed ? 'none' : color};stroke:${color};stroke-width:1.5${dashed ? ';stroke-dasharray:2 2' : ''}">${s}</svg>`
}
export const keyHtml = () => Object.entries(WHERE).map(([k, w]) => `<span class="${k === 'local' || k === 'market' ? 'ph' : ''}">${shapeSvg(w.shape, w.color, k === 'local' || k === 'market')}${w.label}</span>`).join('')

// The clock: replay a past day at a speed, or follow it live (in the mock, "live" plays the sample at real speed from the last hand-off).
export function clock(D, { root, onTick }) {
  root.innerHTML = `<button type="button" data-play aria-label="Play or pause">❚❚</button><span class="clock" data-clock>--:--</span>
    <div class="scrub"><canvas data-strip></canvas><input type="range" data-range min="${D.start}" max="${D.end}" step="0.5" aria-label="Time of day"></div>
    <button type="button" data-speed aria-label="Replay speed">10 min/s</button><button type="button" data-live aria-pressed="false">Live</button>`
  const $ = s => root.querySelector(s), st = { t: D.start, playing: true, speed: 10, live: false }
  const strip = $('[data-strip]')
  const drawStrip = () => {
    const w = strip.clientWidth, h = 36, dpr = devicePixelRatio || 1; strip.width = w * dpr; strip.height = h * dpr
    const c = strip.getContext('2d'); c.scale(dpr, dpr)
    const x = m => (m - D.start) / (D.end - D.start) * w
    for (let hh = D.start; hh <= D.end; hh += 60) { c.fillStyle = 'rgba(143,166,194,.5)'; c.fillRect(x(hh), h - 6, 1, 6); if (w > 300 && (hh / 60) % 2 === 0) { c.font = '9px ui-monospace,monospace'; c.fillText(hm(hh).slice(0, 2), x(hh) + 2, h - 1) } }
    for (const r of D.rows) { const W = WHERE[r.where]; c.globalAlpha = r.real ? .9 : .5; c.fillStyle = W.color; shapePath(c, W.shape, x(r.t0), 10 + ['person', 'account-b', 'openrouter', 'local', 'market'].indexOf(r.where) * 3, 2.4); c.fill() }
    c.globalAlpha = 1; c.fillStyle = COL.gold; c.fillRect(x(st.t) - 1, 0, 2, h)
  }
  const sync = () => { $('[data-clock]').textContent = hm(st.t); $('[data-range]').value = st.t; $('[data-play]').textContent = st.playing ? '❚❚' : '▶'; $('[data-live]').setAttribute('aria-pressed', st.live); drawStrip() }
  $('[data-play]').onclick = () => { st.playing = !st.playing; sync() }
  $('[data-live]').onclick = () => { st.live = !st.live; if (st.live) { st.t = D.rows.filter(r => r.real).at(-1).t0 - 1; st.playing = true } sync() }
  $('[data-speed]').onclick = e => { st.speed = st.speed === 10 ? 2 : st.speed === 2 ? 30 : 10; e.target.textContent = st.speed + ' min/s' }
  $('[data-range]').oninput = e => { st.t = +e.target.value; st.live = false; onTick(st, true); sync() }
  let last = performance.now(), acc = 0
  const frame = now => {
    const dt = Math.min(.1, (now - last) / 1000); last = now
    if (st.playing) { st.t += dt * (st.live ? 1 / 60 : st.speed); if (st.t > D.end) st.t = D.start }
    onTick(st, false, dt); acc += dt; if (acc > .25) { acc = 0; sync() }
    requestAnimationFrame(frame)
  }
  addEventListener('resize', drawStrip); sync(); requestAnimationFrame(frame)
  // ?t=HH:MM&paused=1 freezes a frame (for screenshots and for links to a moment).
  const q = new URLSearchParams(location.search)
  if (q.get('t')) { const [a, b] = q.get('t').split(':'); st.t = +a * 60 + +b }
  if (q.get('paused')) st.playing = false
  return st
}

// The detail card for one hand-off: who to whom, where, when, cost, source.
export function cardHtml(r) {
  if (!r) return '<h2>Hand-off</h2><p class="note">Tap a moving dot, a line or a row to see who gave what to whom, where it ran, when, and what it cost.</p>'
  const W = WHERE[r.where]
  return `<h2>Hand-off #${r.id}${r.real ? '' : '<span class="tag">placeholder</span>'}</h2>
  <div class="sel"><div class="who">${short(r.from)}<i>→</i>${short(r.to)}</div>
  <dl><dt>Where</dt><dd>${shapeSvg(W.shape, W.color, !r.real).replace('<svg', '<svg width="12" height="12" style="vertical-align:-1px;margin-right:4px"')}${W.label}</dd>
  <dt>When</dt><dd>${hm(r.t0)}${r.t1 ? ' to ' + hm(r.t1) : r.kind === 'worker' || r.kind === 'lead' ? ', still running' : ''}${r.approx ? ' (approximate)' : ''}</dd>
  <dt>What</dt><dd>${r.item}${r.role ? ' · ' + r.role : ''}</dd>
  <dt>Cost</dt><dd>${money(r.cost_usd)}${r.tokens ? ' · ' + tok(r.tokens) : ''}</dd>
  ${r.result ? `<dt>Result</dt><dd>${r.result}</dd>` : ''}
  <dt>Source</dt><dd style="font:11px var(--mono)">${r.source}</dd></dl></div>`
}
export function feed(ul, D, onPick) {
  let shown = 0
  return (t, sel) => {
    const vis = D.rows.filter(r => r.t0 <= t)
    if (vis.length !== shown) {
      const fresh = vis.length > shown && vis.length - shown < 4
      ul.innerHTML = vis.slice(-40).reverse().map((r, i) => { const W = WHERE[r.where]; return `<li data-id="${r.id}" class="${fresh && i < vis.length - shown ? 'new' : ''}${sel && sel.id === r.id ? ' on' : ''}"><time>${hm(r.t0)}</time>${shapeSvg(W.shape, W.color, !r.real)}<span class="t${r.real ? '' : ' ph'}">${short(r.from)} → ${short(r.to)}</span><span class="c">${r.cost_usd != null ? money(r.cost_usd) : ''}</span></li>` }).join('')
      shown = vis.length
    }
  }
}
export function wireFeed(ul, D, pick) { ul.addEventListener('click', e => { const li = e.target.closest('li'); if (li) pick(D.rows.find(r => r.id === +li.dataset.id)) }) }
export const totals = (D, t) => { const v = D.rows.filter(r => r.t0 <= t); return { n: v.length, out: v.filter(r => r.where !== 'account-b' && r.where !== 'person').length, cost: v.reduce((s, r) => s + (r.cost_usd || 0), 0), workers: new Set(v.filter(r => r.kind === 'worker').map(r => r.to)).size } }
export const hudHtml = (D, st, name) => { const T = totals(D, st.t); return `<span>VIEW <b>${name}</b></span><span>DAY <b>${D.day}</b></span><span>HAND-OFFS <b>${T.n}</b></span><span>OUT OF THE ACCOUNT <b>${T.out}</b></span><span>WORKERS <b>${T.workers}</b></span><span>COST <b>${money(T.cost)}</b></span><span class="${st.live ? 'live' : 'replay'}">${st.live ? 'LIVE' : 'REPLAY ' + hm(st.t)}</span>` }
