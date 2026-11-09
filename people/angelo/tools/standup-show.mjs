#!/usr/bin/env node
// Prototype (team-collaboration@web-summit.angelo): the "decide and unblock" half of a stand-up show,
// built only from data/meetings/ and board/. Same CSS vocabulary as team/conductor/shows/*.show.
//   node people/angelo/tools/standup-show.mjs . <meeting id> [now ISO]          one-page fragment (.show)
//   node people/angelo/tools/standup-show.mjs --deck . <meeting id> [now ISO]   JSON [[title, slide body], ...] for
//     team/conductor/tools/show_deck.py's S list (deck.js, 16:9): S += json.load(...); the first pair's body carries the CSS
//   node people/angelo/tools/standup-show.mjs --rank . <meeting id> [now ISO]   JSON: the five things that need us today
//     (WS-150, Angelo's brief of 5 November) and the counts strip, for show_deck.py's "What needs us today" slide
// Read-only: it writes to stdout and changes nothing. Proposal and options: board/WS-150.
import fs from 'node:fs'
import path from 'node:path'

const DECK = process.argv.includes('--deck'), RANK = process.argv.includes('--rank')
const [ROOT, MEETING, NOW_ARG] = process.argv.slice(2).filter(a => a !== '--deck' && a !== '--rank')
const NOW = new Date(NOW_ARG || Date.now())
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const MDIR = path.join(ROOT, 'data/meetings')
const ids = fs.readdirSync(MDIR).filter(x => /^\d{4}-\d\d-\d\d-\d{4}$/.test(x)).sort()
const upto = ids.filter(x => x <= MEETING)
const items = upto.flatMap(id => fs.readdirSync(path.join(MDIR, id)).filter(f => f.endsWith('.json'))
  .map(f => ({ meeting: id, ...JSON.parse(fs.readFileSync(path.join(MDIR, id, f), 'utf8')) })))
const open = items.filter(x => x.status === 'open')
const prevId = upto[upto.length - 2]
const prevAt = prevId ? new Date(`${prevId.slice(0, 10)}T${prevId.slice(11, 13)}:${prevId.slice(13)}:00Z`) : new Date(0)
const settled = items.filter(x => x.status === 'decided' && new Date(x.decided?.at || 0) > prevAt)
const carried = x => upto.length - 1 - upto.indexOf(x.meeting)          // stand-ups it has already sat through

// the board: due dates and owners, for the issues the items point at
const board = {}
for (const f of fs.readdirSync(path.join(ROOT, 'board')).filter(f => /^WS-\d+/.test(f))) {
  const fm = {}; for (const l of (fs.readFileSync(path.join(ROOT, 'board', f), 'utf8').split('---')[1] || '').split('\n')) { const m = l.match(/^(\w+):\s*(.*)$/); if (m) fm[m[1]] = m[2] }
  board[fm.id] = fm
}
const dueDay = due => { const m = String(due || '').match(/(\d{1,2}) Nov/); return m && !/daily/i.test(due) ? +m[1] : null }
const today = NOW.getUTCDate()
const issueOf = x => board[(String(x.issue || '').match(/WS-\d+/) || [])[0]]
const urgency = x => { const d = dueDay(issueOf(x)?.due); return d === null ? 99 : d - today }

const NAMES = { dinis: 'Dinis', silvio: 'Silvio', nimay: 'Nimay', angelo: 'Angelo', vicky: 'Vicky', jose: 'Jose', indi: 'Indi', daniela: 'Daniela', sarah: 'Sarah', everyone: 'Everyone' }
const COL = { dinis: '#111111', vicky: '#7c3aed', jose: '#0e7490', indi: '#c2410c', angelo: '#15803d', silvio: '#b91c1c', nimay: '#a16207', daniela: '#be185d', sarah: '#4338ca', everyone: '#6b7280' }
const who = x => (x.for || ['everyone'])
const pill = p => `<span class="who" style="background:${COL[p] || '#6b7280'}">${esc(NAMES[p] || p)}</span>`
const age = n => n === 0 ? '<span class="age new">new</span>' : `<span class="age${n >= 3 ? ' old' : ''}">carried ${n}×</span>`
const due = x => { const i = issueOf(x), d = urgency(x); if (!i || d === 99) return ''; return `<span class="due${d < 0 ? ' late' : d === 0 ? ' now' : ''}">${d < 0 ? `${-d}d late` : d === 0 ? 'due today' : `due in ${d}d`}</span>` }

const decisions = open.filter(x => x.type === 'decision').sort((a, b) => urgency(a) - urgency(b) || carried(b) - carried(a))
const nOpt = decisions.filter(x => !x.options || !x.recommend)
const people = Object.keys(NAMES).filter(p => p !== 'everyone')
const load = people.map(p => ({ p, n: open.filter(x => who(x).includes(p)).length })).filter(r => r.n).sort((a, b) => b.n - a.n)
const max = Math.max(1, ...load.map(r => r.n))
const late = Object.values(board).filter(b => b.status !== 'done' && dueDay(b.due) !== null && dueDay(b.due) < today)
const lateNoOwner = late.filter(b => !b.picked_by)
const oldest = open.filter(x => x.type === 'decision' && carried(x) >= 3)

const card = x => `<div class="card"><div class="meta">${who(x).map(pill).join('')}${age(carried(x))}${due(x)}${x.issue ? `<span class="iss">${esc(x.issue)}</span>` : ''}</div><b>${esc(x.title)}</b>${x.options ? `<ol class="opts">${x.options.map(o => `<li${x.recommend && o.toLowerCase().slice(0, 25) === x.recommend.toLowerCase().slice(0, 25) ? ' class="rec"' : ''}>${esc(o)}</li>`).join('')}</ol>` : '<p class="miss">No options yet: bring them, or move it on.</p>'}${x.recommend ? `<p class="recline">Recommended: ${esc(x.recommend)}</p>` : ''}</div>`

const css = `<style>.show .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:14px}
.show .card{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:14px 16px;font-size:16px}
.show .card b{display:block;font:700 19px/1.3 Georgia,serif;margin:8px 0 6px}.show .meta{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.show .who{color:#fff;border-radius:99px;padding:2px 10px;font:600 12px/1.6 ui-monospace,monospace}
.show .age,.show .due,.show .iss{font:600 12px/1.6 ui-monospace,monospace;border:1px solid var(--line);border-radius:99px;padding:1px 8px;color:var(--ink-2)}
.show .age.new{border-color:var(--accent);color:var(--accent)}.show .age.old,.show .due.late{background:#b91c1c;border-color:#b91c1c;color:#fff}.show .due.now{background:#a16207;border-color:#a16207;color:#fff}
.show .opts{font-size:15px;margin:4px 0 4px 1.2em;padding:0}.show .opts li{margin:.2em 0}.show .opts li.rec{font-weight:700}.show .opts li.rec::after{content:"  ← recommended";color:var(--accent);font-weight:600}
.show .recline{font-size:14px;color:var(--ink-2);margin:4px 0 0}.show .miss{color:#b91c1c;font-size:15px;margin:4px 0}
.show .big{font:800 clamp(48px,9vw,96px)/1 Georgia,serif;color:var(--accent)}</style>`


if (RANK) {
  // "What needs us today" (WS-150, Angelo's brief, 5 November): at most five, decisions and urgent actions together, ranked by
  // what blocks Lisbon: needs a decision, summit-critical, no owner, due soon, carried. One owner (or two) each, what is
  // needed (Decide, Write, Needs owner) and by when. Deterministic: same repository and time, same list.
  const LISBON = 9, CRIT = /print|merch|garment|card|collect|travel|hotel|badge|ticket|booth|stand(?![-\w])|lisbon|offer|lead|\bapp\b|outreach|meeting|pitch|demo/i
  const day = d => d === null ? null : d
  const byWhen = d => d === null || d <= today ? 'Today' : `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(Date.UTC(2026, 10, d)).getUTCDay()]} ${d}`
  const ownersOf = list => { const ps = list.filter(p => p !== 'everyone').map(p => NAMES[p] || p); return ps.length ? ps.slice(0, 2).join(', ') : 'everyone' }
  const cand = []
  for (const x of open.filter(x => x.type === 'decision')) {
    const iss = issueOf(x), d = dueDay(iss?.due), c = carried(x)
    const score = 30 + (CRIT.test(x.title) ? 20 : 0) + (d !== null && d <= today + 2 ? 15 : 0) + Math.min(c, 4) * 4 + (d !== null && d < today ? 5 : 0)
    const why = [c ? `carried ${c}×` : 'new', d !== null && d < today ? `${today - d}d late` : null, who(x).length === 1 && who(x)[0] === 'dinis' ? 'only Dinis can close it' : null].filter(Boolean).join(' · ')
    cand.push({ score, key: x.issue || x.title, title: x.title.replace(/\s*\((WS-\d+[^)]*)\)\s*$/, ''), sub: `${why}${x.issue ? ' · ' + x.issue : ''}`, owner: ownersOf(who(x)), need: 'Decide', by: byWhen(d === null ? null : Math.max(d, today)), tone: score >= 50 ? 'hot' : 'warm' })
  }
  for (const b of Object.values(board)) {
    if (b.status === 'done') continue
    const d = dueDay(b.due); if (d === null || d > Math.min(today + 2, LISBON)) continue
    const crit = CRIT.test(b.title || ''), owned = !!b.picked_by
    if (!crit && owned) continue                                    // the owned, non-critical ones stay on the board
    const score = (crit ? 25 : 0) + (owned ? 10 : 20) + (d <= today ? 10 : 0)
    if (score < 30) continue
    cand.push({ score, key: b.id, title: (b.title || '').replace(/^"|"$/g, ''), sub: `${d < today ? `${today - d}d late` : d === today ? 'due today' : 'due soon'}${crit ? ' · before Lisbon' : ''} · ${b.id}`, owner: owned ? b.picked_by.split(',')[0].trim() : 'nobody yet', need: owned ? 'Do' : 'Needs owner', by: byWhen(d), tone: score >= 50 ? 'hot' : 'warm' })
  }
  const seen = new Set(), top = []
  for (const c of cand.sort((a, b) => b.score - a.score || a.key.localeCompare(b.key))) { const k = (c.key.match(/WS-\d+/) || [c.key])[0]; if (seen.has(k)) continue; seen.add(k); top.push(c); if (top.length === 5) break }
  const lateAll = Object.values(board).filter(b => b.status !== 'done' && dueDay(b.due) !== null && dueDay(b.due) < today)
  const strip = { late: lateAll.length, late_unowned: lateAll.filter(b => !b.picked_by).length, due_today: Object.values(board).filter(b => b.status !== 'done' && dueDay(b.due) === today).length, decisions_open: decisions.length }
  process.stdout.write(JSON.stringify({ meeting: MEETING, built: NOW.toISOString(), top, strip }, null, 1) + '\n')
  process.exit(0)
}

if (DECK) {
  // slides for conductor@web-summit.dinis's deck: the parts its deck does not have yet (WS-150). Its slide 2
  // already lists late, due-today and logistics issues, so this gives decisions and who they wait on.
  const dcss = `<style>.deck .dcards{display:grid;grid-template-columns:1fr 1fr;gap:.7em;flex:1 1 0;min-height:0}
.deck .dcard{border:1px solid var(--line);border-radius:12px;padding:.6em .8em;font-size:.72em;overflow:hidden;background:var(--surface-2,var(--surface))}
.deck .dcard b{display:block;font:700 1.15em/1.25 Georgia,serif;margin:.35em 0}.deck .dmeta{display:flex;flex-wrap:wrap;gap:.35em}
.deck .who{color:#fff;border-radius:99px;padding:.05em .7em;font:600 .85em/1.6 ui-monospace,monospace}
.deck .age,.deck .due{font:600 .85em/1.6 ui-monospace,monospace;border:1px solid var(--line);border-radius:99px;padding:0 .6em;color:var(--ink-2)}
.deck .age.old,.deck .due.late{background:#b91c1c;border-color:#b91c1c;color:#fff}.deck .due.now{background:#a16207;border-color:#a16207;color:#fff}
.deck .dcard ol{margin:.2em 0 0 1.1em;padding:0}.deck .dcard .rec{color:var(--ink-2);margin:.3em 0 0}.deck .dcard .miss{color:#b91c1c}</style>`
  const dcard = x => `<div class="dcard"><div class="dmeta">${who(x).map(p => `<span class="who" style="background:${COL[p] || '#6b7280'}">${esc(NAMES[p] || p)}</span>`).join('')}${age(carried(x))}${due(x)}</div><b>${esc(x.title)}</b>${x.options ? `<ol>${x.options.slice(0, 3).map(o => `<li>${esc(o.slice(0, 90))}</li>`).join('')}</ol>` : '<p class="miss">No options yet.</p>'}${x.recommend ? `<p class="rec">Recommended: ${esc(x.recommend.slice(0, 120))}</p>` : ''}</div>`
  const slides = []
  slides.push(['Decide now', `${dcss}<div class="kick">Decide · ${decisions.length} waiting, ${oldest.length} carried 3× or more</div><h2>The four that cannot wait</h2><div class="dcards">${decisions.slice(0, 4).map(dcard).join('')}</div><p class="cap">Most urgent first (a date this week), then the oldest. Say each as “decided: &lt;item&gt;: &lt;words&gt;”. From data/meetings/ and board/ (team-collaboration@web-summit.angelo, WS-150).</p>`])
  slides.push(['Who is waited on', `<div class="kick">Who is waited on</div><h2>${open.length} open items, by the person they wait for</h2><div class="bars">${load.map(r => `<div class="b"><span>${esc(NAMES[r.p])}</span><i style="width:${Math.round(100 * r.n / max)}%;background:${COL[r.p]}"></i><b>${r.n}</b></div>`).join('')}</div><p class="cap">${load[0] ? `${esc(NAMES[load[0].p])} holds ${load[0].n} of ${open.length}; ${oldest.length} decisions have been carried three times or more. Who takes one off them today?` : ''}</p>`])
  if (settled.length) slides.push(['Settled since the last stand-up', `<div class="kick">Settled</div><h2>Decided since the last stand-up</h2><ul>${settled.map(x => `<li><b>${esc(x.title)}</b>: “${esc(x.decided.said)}” (${esc(NAMES[x.decided.by] || x.decided.by)})</li>`).join('')}</ul>`])
  process.stdout.write(JSON.stringify(slides, null, 1) + '\n')
  process.exit(0)
}
const s = []
s.push(`<section><div class="k">Decide · ${esc(MEETING)}</div><h1>${decisions.length} decisions waiting, <em>${oldest.length}</em> carried three times or more</h1><p class="sub">Built from data/meetings/ and board/ at ${NOW.toISOString().slice(11, 16)} UTC. Most urgent first: a deadline this week, then the oldest.</p><div class="tiles"><div><b>${open.length}</b>open agenda items</div><div><b>${decisions.length}</b>decisions</div><div><b>${settled.length}</b>settled since the last stand-up</div><div><b>${nOpt.length}</b>decisions with no options yet</div></div></section>`)
s.push(`<section><div class="k">Decide now</div><h2>The five that cannot wait</h2><div class="cards">${decisions.slice(0, 5).map(card).join('')}</div><p class="sub">Say each as <b>“decided: &lt;item&gt;: &lt;words&gt;”</b> so the record carries it.</p></section>`)
s.push(`<section><div class="k">Who is waited on</div><h2>Open items, by the person they wait for</h2><div class="bars">${load.map(r => `<div class="b"><span>${esc(NAMES[r.p])}</span><i style="width:${Math.round(100 * r.n / max)}%;background:${COL[r.p]}"></i><b>${r.n}</b></div>`).join('')}</div><p class="sub">${load[0] ? `${esc(NAMES[load[0].p])} holds ${load[0].n} of ${open.length}. Can anyone take one off them today?` : ''}</p></section>`)
s.push(`<section><div class="k">Blocked and late</div><h2>${late.length} board issues past their date, ${lateNoOwner.length} with nobody on them</h2><div class="bars small">${late.sort((a, b) => dueDay(a.due) - dueDay(b.due)).slice(0, 10).map(b => `<div class="b"><span>${esc(b.id)} ${esc((b.title || '').slice(0, 38))}</span><i style="width:${Math.min(100, 25 * (today - dueDay(b.due)))}%;background:${b.picked_by ? '#a16207' : '#b91c1c'}"></i><b>${today - dueDay(b.due)}d</b></div>`).join('')}</div><p class="sub">Red: nobody in picked_by. A new date, an owner, or closed as overtaken.</p></section>`)
if (settled.length) s.push(`<section><div class="k">Settled since the last stand-up</div><h2>Already decided: close these in one line</h2><ul>${settled.map(x => `<li><b>${esc(x.title)}</b>: “${esc(x.decided.said)}” (${esc(NAMES[x.decided.by] || x.decided.by)})</li>`).join('')}</ul></section>`)
process.stdout.write(`${css}<div class="show">${s.join('')}</div>\n`)
