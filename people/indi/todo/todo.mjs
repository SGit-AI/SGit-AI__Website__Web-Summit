// Indi's list of everything left to do, as a pastel infographic: /people/indi/todo/.
// Command Centre tasks are rebuilt from the board (board/*.md, the same rule as the command centre: open, and named
// for Indi, everyone or anyone) and the stand-up items (data/meetings/*/*.json, open, for Indi) at every release, so
// a closed issue drops off by itself. people/indi/todo/todo.json adds a next step per issue and the tasks that are
// not on the board. Today's activity of Indi's conductor, dev and dashboard agents comes from the git log.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { nav, timeEl, FONTS } from '../today/today.mjs'   // the pill bar and "3 hours ago" shared with the Today page (WS-06)

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const HEAD = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600&family=Nunito:wght@700;800&display=swap"><link rel="stylesheet" href="todo.css"><link rel="stylesheet" href="../ui/ui.css"><script src="../ui/ui.js" defer></script>'
const fm = raw => { const m = raw.match(/^---\n([\s\S]*?)\n---/); const o = {}; if (m) for (const l of m[1].split('\n')) { const i = l.indexOf(':'); if (i > 0) o[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"(.*)"$/, '$1') } return o }
const dueDate = due => { const m = String(due).match(/(\d{1,2}) Nov(?:,? (\d{1,2}):(\d{2}))?/); return m ? new Date(Date.UTC(2026, 10, +m[1], m[2] ? +m[2] : 23, m[3] ? +m[3] : 59)) : null }
const day = d => d.toISOString().slice(0, 10)

// the data, shared with Indi's Today page (people/indi/today/today.mjs, WS-06)
export function collect(ROOT) {
    const T = JSON.parse(fs.readFileSync(path.join(ROOT, 'people/indi/todo/todo.json'), 'utf8'))
    const now = new Date(process.env.BUILD_NOW || Date.now()), today = day(now), tomorrow = day(new Date(now.getTime() + 864e5))
    // the board: open and named for Indi (or everyone / anyone)
    const issues = fs.readdirSync(path.join(ROOT, 'board')).filter(f => /^WS-\d+.*\.md$/.test(f)).map(f => ({ ...fm(fs.readFileSync(path.join(ROOT, 'board', f), 'utf8')), _f: f }))
        .filter(i => i.id && !/^(done|closed)/i.test(i.status || '') && /\b(indi|everyone|anyone)\b/.test(i.for || ''))
    const lanes = { overdue: [], today: [], tomorrow: [], later: [], daily: [], done: [] }
    for (const i of issues) {
        if (T.done_for_indi[i.id]) { lanes.done.push(i); continue }
        if (/daily/i.test(i.due || '')) { lanes.daily.push(i); continue }
        const d = dueDate(i.due); i._d = d
        if (!d) lanes.later.push(i); else if (day(d) < today) lanes.overdue.push(i); else if (day(d) === today) lanes.today.push(i); else if (day(d) === tomorrow) lanes.tomorrow.push(i); else lanes.later.push(i)
    }
    for (const k of Object.keys(lanes)) lanes[k].sort((a, b) => (a._d || 0) - (b._d || 0) || a.id.localeCompare(b.id, 'en', { numeric: true }))
    // stand-up decisions and questions waiting on Indi
    const mdir = path.join(ROOT, 'data/meetings'), decisions = []
    for (const d of fs.existsSync(mdir) ? fs.readdirSync(mdir) : []) {
        const p = path.join(mdir, d); if (!fs.statSync(p).isDirectory()) continue
        for (const f of fs.readdirSync(p).filter(f => f.endsWith('.json'))) { try { const j = JSON.parse(fs.readFileSync(path.join(p, f), 'utf8')); if (j.status === 'open' && (j.for || []).includes('indi') && /decision|question/.test(j.type)) decisions.push(j) } catch { } }
    }
    // today's activity of the three agents
    const act = ['conductor', 'dev', 'dashboard'].map(a => {
        let log = []; try { log = execFileSync('git', ['log', '--since=' + today + 'T00:00Z', '--format=%cI', `--grep=^${a}@web-summit.indi:`], { cwd: ROOT }).toString().trim().split('\n').filter(Boolean) } catch { }
        let last = ''; try { last = execFileSync('git', ['log', '-1', '--format=%cI', `--grep=^${a}@web-summit.indi:`], { cwd: ROOT }).toString().trim() } catch { }
        return { a, n: log.length, last }
    })
    return { T, now, lanes, decisions, act }
}

export function build(ROOT) {
    const { T, now, lanes, decisions, act } = collect(ROOT)
    const when = s => s ? `${+s.slice(8, 10)} Nov, ${s.slice(11, 16)} UTC` : 'never'

    // the picture
    const LANES = [['overdue', 'Late', 'rose'], ['today', 'Due today', 'peach'], ['tomorrow', 'Due tomorrow', 'butter'], ['later', 'Later this week', 'sky'], ['daily', 'Every day', 'mint']]
    const card = i => `<li class="t"><a class="id" href="https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/board/${esc(i._f)}">${esc(i.id)}</a> <b>${esc(i.title.replace(/^"|"$/g, ''))}</b>${i.due ? `<span class="due">${esc(i.due)}</span>` : ''}${T.next[i.id] ? `<span class="nx">${esc(T.next[i.id])}</span>` : ''}</li>`
    const total = LANES.reduce((s, [k]) => s + lanes[k].length, 0)
    const tiles = [[total, 'tasks open', 'lav'], [lanes.overdue.length + lanes.today.length, 'late or due today', 'rose'], [decisions.length, 'decisions waiting on you', 'butter'], [T.other.length, 'other tasks', 'mint']]
    const groups = [...new Set(T.other.map(o => o.group))]
    const gcol = { 'Your agents': 'lav', 'Waiting on you': 'peach', 'Waiting on others': 'sky' }
    const body = `<div class="td">
<div class="ux">${nav('../', 'todo', { todo: lanes.overdue.length + lanes.today.length })}</div>
<p class="lead">Everything left for you, in one picture. Late things are pink, today's are orange. Updated ${timeEl(now.toISOString(), now.getTime())}.</p>
<div class="tiles">${tiles.map(([n, l, c]) => `<div class="tile ${c}"><b>${n}</b><span>${esc(l)}</span></div>`).join('')}</div>
<section class="agents"><h2>Your agents today</h2><div class="ag">${act.map(x => `<div class="a ${x.n ? 'on' : 'off'}"><b>${x.a}</b><span class="n">${x.n}</span><span>${x.n ? (x.n === 1 ? 'piece of work saved today' : 'pieces of work saved today') : 'nothing saved today'}</span><span class="last">${x.last ? `last saved work ${timeEl(x.last, now.getTime())}` : 'no work saved yet'}</span></div>`).join('')}</div></section>
<section><h2><span class="pill lav">1</span> Command Centre tasks</h2>
<div class="lanes" id="lanes">${LANES.filter(([k]) => lanes[k].length).map(([k, t, c]) => `<div class="lane ${c}"><h3>${t} <span class="cnt">${lanes[k].length}</span></h3><ul>${lanes[k].map(card).join('')}</ul></div>`).join('')}</div>
${decisions.length ? `<div class="lane butter wide" id="decisions"><h3>Decisions and questions waiting on you <span class="cnt">${decisions.length}</span></h3><ul>${decisions.map(d => `<li class="t"><span class="id">${esc(d.issue || '')}</span> <b>${esc(d.title)}</b>${d.recommend ? `<span class="nx">Recommended: ${esc(d.recommend)}</span>` : ''}</li>`).join('')}</ul></div>` : ''}
${lanes.done.length ? `<p class="done">Done for you, still open for the team: ${lanes.done.map(i => `${esc(i.id)} (${esc(T.done_for_indi[i.id])})`).join(' · ')}</p>` : ''}
</section>
<section><h2><span class="pill peach">2</span> Other tasks</h2>
<div class="lanes three">${groups.map(g => `<div class="lane ${gcol[g] || 'mint'}"><h3>${esc(g)} <span class="cnt">${T.other.filter(o => o.group === g).length}</span></h3><ul>${T.other.filter(o => o.group === g).map(o => `<li class="t"><b>${esc(o.title)}</b><span class="nx">${esc(o.detail)}</span><span class="due">${esc(o.source)}</span></li>`).join('')}</ul></div>`).join('')}</div>
</section>
<p class="meta">Built by <code>people/indi/todo/todo.mjs</code> from the board, the stand-up items, the git log and <code>people/indi/todo/todo.json</code> (next steps and the tasks not on the board, kept by dashboard@web-summit.indi at each run). <a href="../app/index.html#tasks">Open the Command Centre</a>.</p>
</div>`
    const mdLane = k => lanes[k].map(i => `- **${i.id}** ${i.title.replace(/^"|"$/g, '')} (${i.due})${T.next[i.id] ? `: ${T.next[i.id]}` : ''}`).join('\n')
    const md = `Everything left for Indi. Built ${when(now.toISOString())}.\n\n## Your agents today\n\n${act.map(x => `- ${x.a}@web-summit.indi: ${x.n} commits today, last ${when(x.last)}`).join('\n')}\n\n## 1. Command Centre tasks (${total})\n\n${LANES.filter(([k]) => lanes[k].length).map(([k, t]) => `### ${t}\n\n${mdLane(k)}`).join('\n\n')}\n\n### Decisions and questions waiting on you\n\n${decisions.map(d => `- ${d.issue || ''} ${d.title}${d.recommend ? ` (recommended: ${d.recommend})` : ''}`).join('\n')}\n\n## 2. Other tasks\n\n${groups.map(g => `### ${g}\n\n${T.other.filter(o => o.group === g).map(o => `- **${o.title}.** ${o.detail} (${o.source})`).join('\n')}`).join('\n\n')}\n`
    return [{ rel: 'people/indi/todo/index.html', title: "Indi: everything left to do", description: `Indi's open tasks as one picture: ${total} Command Centre tasks by when they are due, ${decisions.length} decisions, and ${T.other.length} other tasks, rebuilt at every release.`, body, md, head: HEAD }]
}
