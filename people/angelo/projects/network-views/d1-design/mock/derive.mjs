// Derives sample-handoffs.json for one day from Angelo's real records (a design sample, not the d2 collector).
// Run from the repository root: node people/angelo/projects/network-views/d1-design/mock/derive.mjs [YYYY-MM-DD]
// Every row says its source; rows with real:false are placeholders for lanes that have no record yet.
import fs from 'node:fs'
import path from 'node:path'

const A = 'people/angelo'
const DAY = process.argv[2] || '2026-11-11'
const OUT = path.join(A, 'projects/network-views/d1-design/mock/sample-handoffs.json')
const rows = []
const read = f => { try { return fs.readFileSync(f, 'utf8') } catch { return '' } }
const lines = f => read(f).split('\n').filter(Boolean)
const iso = hm => `${DAY}T${hm.replace('~', '').trim().slice(0, 5)}Z`
const short = n => (n || '').split(' ')[0].trim()
const usd = s => { const m = /([\d.]+) USD/.exec(s || ''); return m ? +m[1] : null }
const add = r => rows.push({ end: null, cost_usd: null, tokens: null, real: true, ...r })

// 1. conductor.b@'s runs.md: workers, leads, scheduled helpers and in-session sub-agents it started.
for (const l of lines(`${A}/conductor-b/runs.md`)) {
  const c = l.split('|').map(s => s.trim())
  if (c.length < 8 || !c[1].startsWith(DAY.slice(0)) && !c[1].includes(DAY)) continue
  const at = iso(c[1].split(' ').pop()), who = c[2], end = c[6] ? iso(c[6].split(' ').pop()) : null
  let kind = 'worker', to = short(who)
  if (/sub-agent/.test(who)) { kind = 'subagent'; to = 'sub-agent' }
  else if (/a lead/.test(who)) kind = 'lead'
  else if (/scheduled task/.test(who)) kind = 'schedule'
  const where = /PrompTugal__News__Fringe/.test(c[5]) ? 'account-b (Fringe repository)' : 'account-b'
  add({ at, end, from: 'conductor.b@PrompTugal.angelo', to, where: 'account-b', where_note: where, kind, item: c[3], role: c[4], result: c[7].slice(0, 90), cost_usd: usd(c[7]), source: 'conductor-b/runs.md' })
  // A lead or a project starts at Angelo's word (BRIEF.md front matter: "by conductor.b@ at Angelo's word").
  if (kind === 'lead') add({ at: new Date(Date.parse(at) - 60e3).toISOString().slice(0, 17) + '00Z', from: 'Angelo', to: 'conductor.b@PrompTugal.angelo', where: 'person', kind: 'word', item: c[3], role: 'open a project', source: 'projects/*/BRIEF.md started: at Angelo\'s word (time: one minute before the lead)' })
}
// 2. Angelo's word arriving at conductor.b@: intake steps in pipeline/*/times.json.
for (const d of fs.readdirSync(`${A}/pipeline`)) {
  const t = read(`${A}/pipeline/${d}/times.json`); if (!t) continue
  const j = JSON.parse(t), s = j.steps.find(x => x.role === 'intake')
  if (s && s.start.startsWith(DAY)) add({ at: s.start, end: s.end, from: 'Angelo', to: 'conductor.b@PrompTugal.angelo', where: 'person', kind: 'word', item: j.item, role: 'intake', source: `pipeline/${d}/times.json` })
}
// 3. Each project lead's runs.md (table or list).
for (const p of fs.readdirSync(`${A}/projects`)) {
  for (const l of lines(`${A}/projects/${p}/runs.md`)) {
    let c = l.split('|').map(s => s.trim())
    if (l.startsWith('- ')) c = ['', ...c.map(s => s.replace(/^- /, ''))]
    if (c.length < 5 || !/\d\d:\d\d/.test(c[1]) || /Start/.test(c[1])) continue
    const at = iso(c[1].replace(DAY, '').replace('UTC', '').trim())
    const end = (c.find(x => /^end:|^\d\d:\d\d$/.test(x)) || '').match(/\d\d:\d\d/)
    const sub = /sub-agent/.test(c[2])
    add({ at, end: end ? iso(end[0]) : null, from: `${p}.pm@PrompTugal.angelo`, to: sub ? 'sub-agent' : short(c[2]), where: 'account-b', kind: sub ? 'subagent' : 'worker', item: c[3].split(' (')[0], role: (c[4] || '').slice(0, 40), result: c.slice(-1)[0].slice(0, 90), cost_usd: usd(l), source: `projects/${p}/runs.md` })
  }
}
// 4. Workers whose start is only in their estimates file (the handover-market's first items, and this item).
const have = new Set(rows.map(r => r.to + '|' + r.item))
const leadOf = item => item.startsWith('handover-') ? 'handover-market' : item.startsWith('network-views') ? 'network-views' : item.startsWith('a') ? 'prod-pipeline' : null
for (const f of fs.readdirSync(`${A}/estimates`).filter(f => f.endsWith('.jsonl') && f.includes('worker'))) {
  const ev = lines(`${A}/estimates/${f}`).map(l => JSON.parse(l)).filter(e => (e.at || '').startsWith(DAY))
  for (const s of ev.filter(e => e.event === 'start')) {
    const lead = leadOf(s.item), to = short(s.agent)
    if (!lead || [...have].some(k => k.startsWith(to + '|') && k.includes(s.item.replace(/^a\d-/, '')))) continue
    const d = ev.find(e => e.event === 'done' && e.item === s.item)
    add({ at: s.at.replace(':00Z', 'Z').slice(0, 16) + 'Z', end: d ? d.at.slice(0, 16) + 'Z' : null, from: `${lead}.pm@PrompTugal.angelo`, to, where: 'account-b', kind: 'worker', item: s.item, role: s.what.split(':')[0], result: d ? d.note.slice(0, 90) : 'running', source: `estimates/${f}` })
  }
}
// 4b. A lead with no row in conductor.b@'s runs.md (handover-market.pm@): its start is approximate, ten minutes before its first worker.
for (const p of fs.readdirSync(`${A}/projects`)) {
  const pm = `${p}.pm@PrompTugal.angelo`
  if (rows.some(r => r.to === pm) || !read(`${A}/projects/${p}/BRIEF.md`).includes(`started: ${DAY}`)) continue
  const first = rows.filter(r => r.from === pm).map(r => r.at).sort()[0]; if (!first) continue
  const at = new Date(Date.parse(first) - 600e3).toISOString().slice(0, 17) + '00Z'
  add({ at, from: 'conductor.b@PrompTugal.angelo', to: pm, where: 'account-b', kind: 'lead', item: 'project ' + p, role: 'lead', approx: true, source: `projects/${p}/BRIEF.md (time approximate: 10 min before its first worker)` })
  add({ at: new Date(Date.parse(at) - 60e3).toISOString().slice(0, 17) + '00Z', from: 'Angelo', to: 'conductor.b@PrompTugal.angelo', where: 'person', kind: 'word', item: 'project ' + p, role: 'open a project', approx: true, source: `projects/${p}/BRIEF.md started: at Angelo's word (time approximate)` })
}
// 5. Tokens from the ledger (session total without cache reads), joined on worker and item.
for (const f of fs.readdirSync(`${A}/ledger`)) for (const l of lines(`${A}/ledger/${f}`)) {
  let x; try { x = JSON.parse(l) } catch { continue }
  if (!(x.at || '').startsWith(DAY)) continue
  const item = (x.task || '').split(':')[0], r = rows.find(r => r.to === x.agent && (r.item.includes(item) || item.includes(r.item.split(' ')[0])))
  if (r && r.tokens == null) { r.tokens = x.session.total_without_cache_reads; r.source += ' + ledger line ' + x.at.slice(11, 16) + 'Z' }
}
// 6. Calls to OpenRouter (handover-p3: charlie.large.worker@), one row per call.
for (const l of lines(`${A}/pipeline/handover-p3-openrouter/usage.jsonl`)) {
  const x = JSON.parse(l)
  add({ at: x.at, from: 'charlie.large.worker@PrompTugal.angelo', to: x.model, where: 'openrouter', kind: 'model-call', item: 'handover-p3-openrouter', role: x.tier + ' tier: ' + x.task.slice(0, 40), cost_usd: x.cost_usd ?? 0, tokens: (x.prompt_tokens || 0) + (x.completion_tokens || 0), ok: x.ok, source: 'pipeline/handover-p3-openrouter/usage.jsonl' })
}
// 7. Placeholders: no local model has run and no market hand-over has completed (network-views STATE.md, section 2).
const ph = { real: false, source: 'placeholder: no record exists yet' }
add({ ...ph, at: `${DAY}T18:10Z`, end: `${DAY}T18:12Z`, from: 'hotel.large.worker@PrompTugal.angelo', to: 'ollama:llama3.1-8b (example)', where: 'local', kind: 'model-call', item: 'example', role: 'local tier', cost_usd: 0, tokens: 4200 })
add({ ...ph, at: `${DAY}T18:40Z`, end: `${DAY}T19:20Z`, from: 'handover-market.pm@PrompTugal.angelo', to: 'another account (example)', where: 'market', kind: 'market', item: 'handover-p1-writeback (example)', role: 'hand-over out', cost_usd: null })
add({ ...ph, at: `${DAY}T19:25Z`, from: 'another account (example)', to: 'handover-market.pm@PrompTugal.angelo', where: 'market', kind: 'market', item: 'handover-p1-writeback (example)', role: 'result back', cost_usd: null })

rows.sort((a, b) => a.at.localeCompare(b.at))
rows.forEach((r, i) => { r.id = i + 1 })
fs.writeFileSync(OUT, JSON.stringify({ day: DAY, derived_by: 'mock/derive.mjs', note: 'design sample; real:false rows are placeholders', rows }, null, 1) + '\n')
console.log(`${rows.length} rows (${rows.filter(r => r.real).length} real) -> ${OUT}`)
