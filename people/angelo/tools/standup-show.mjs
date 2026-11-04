#!/usr/bin/env node
// Prototype (team-collaboration@web-summit.angelo): the "decide and unblock" half of a stand-up show,
// built only from data/meetings/ and board/. Same CSS vocabulary as team/conductor/shows/*.show.
//   node people/angelo/tools/standup-show.mjs . <meeting id> [now ISO] > team/conductor/shows/<meeting id>.part.show
// Read-only: it writes to stdout and changes nothing. Proposal and options: board/WS-150.
import fs from 'node:fs'
import path from 'node:path'

const [ROOT, MEETING, NOW_ARG] = process.argv.slice(2)
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

const s = []
s.push(`<section><div class="k">Decide · ${esc(MEETING)}</div><h1>${decisions.length} decisions waiting, <em>${oldest.length}</em> carried three times or more</h1><p class="sub">Built from data/meetings/ and board/ at ${NOW.toISOString().slice(11, 16)} UTC. Most urgent first: a deadline this week, then the oldest.</p><div class="tiles"><div><b>${open.length}</b>open agenda items</div><div><b>${decisions.length}</b>decisions</div><div><b>${settled.length}</b>settled since the last stand-up</div><div><b>${nOpt.length}</b>decisions with no options yet</div></div></section>`)
s.push(`<section><div class="k">Decide now</div><h2>The five that cannot wait</h2><div class="cards">${decisions.slice(0, 5).map(card).join('')}</div><p class="sub">Say each as <b>“decided: &lt;item&gt;: &lt;words&gt;”</b> so the record carries it.</p></section>`)
s.push(`<section><div class="k">Who is waited on</div><h2>Open items, by the person they wait for</h2><div class="bars">${load.map(r => `<div class="b"><span>${esc(NAMES[r.p])}</span><i style="width:${Math.round(100 * r.n / max)}%;background:${COL[r.p]}"></i><b>${r.n}</b></div>`).join('')}</div><p class="sub">${load[0] ? `${esc(NAMES[load[0].p])} holds ${load[0].n} of ${open.length}. Can anyone take one off them today?` : ''}</p></section>`)
s.push(`<section><div class="k">Blocked and late</div><h2>${late.length} board issues past their date, ${lateNoOwner.length} with nobody on them</h2><div class="bars small">${late.sort((a, b) => dueDay(a.due) - dueDay(b.due)).slice(0, 10).map(b => `<div class="b"><span>${esc(b.id)} ${esc((b.title || '').slice(0, 38))}</span><i style="width:${Math.min(100, 25 * (today - dueDay(b.due)))}%;background:${b.picked_by ? '#a16207' : '#b91c1c'}"></i><b>${today - dueDay(b.due)}d</b></div>`).join('')}</div><p class="sub">Red: nobody in picked_by. A new date, an owner, or closed as overtaken.</p></section>`)
if (settled.length) s.push(`<section><div class="k">Settled since the last stand-up</div><h2>Already decided: close these in one line</h2><ul>${settled.map(x => `<li><b>${esc(x.title)}</b>: “${esc(x.decided.said)}” (${esc(NAMES[x.decided.by] || x.decided.by)})</li>`).join('')}</ul></section>`)
process.stdout.write(`${css}<div class="show">${s.join('')}</div>\n`)
