// Indi's Today page (WS-06, ux@web-summit.indi, 4 November): the one page to open first, in plain words.
// What to do first, the next stand-up, what changed since Indi last looked (the releases, reworded, with "3 hours
// ago" and coloured topics) and what each of Indi's agents is doing. Built at every release from the board, the
// stand-up items and the git log (through people/indi/todo/todo.mjs's collect), people/indi/agents.json and
// data/team.json. people/indi/ui/ui.js keeps the times current in the browser; the page reads without it.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { collect } from '../todo/todo.mjs'

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const REPO = 'https://github.com/SGit-AI/SGit-AI__Website__Web-Summit'
export const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600&family=Nunito:wght@700;800&display=swap">'

// "3 hours ago", from the build's clock; the browser refreshes it
export function ago(iso, now) {
    const t = Date.parse(iso); if (isNaN(t)) return 'not yet'
    const s = Math.round((now - t) / 1000), f = s < 0, a = Math.abs(s)
    if (a < 60) return f ? 'in under a minute' : 'just now'
    const [n, u] = a < 3600 ? [Math.round(a / 60), 'minute'] : a < 86400 ? [Math.round(a / 3600), 'hour'] : [Math.round(a / 86400), 'day']
    if (u === 'day' && n === 1) return f ? 'tomorrow' : 'yesterday'
    const w = `${n} ${u}${n === 1 ? '' : 's'}`
    return f ? `in ${w}` : `${w} ago`
}
const clock = iso => { const d = new Date(iso); const h = d.getUTCHours(), m = d.getUTCMinutes(); return `${h % 12 || 12}${m ? ':' + String(m).padStart(2, '0') : ''} ${h < 12 ? 'am' : 'pm'}` }
const dayName = iso => new Date(iso).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
export const timeEl = (iso, now) => `<time datetime="${esc(iso)}" data-rel title="${esc(dayName(iso) + ', ' + clock(iso) + ' Lisbon time')}">${esc(ago(iso, now))}</time>`

// the pill bar on each of Indi's pages: the places Indi goes, one tap each (up: the path back to people/indi/)
export function nav(up, current, counts = {}) {
    const L = [['today', 'Today', 'today/index.html', 'lav'], ['todo', 'To do', 'todo/index.html', 'rose'], ['centre', 'Command centre', 'app/index.html', 'sky'],
        ['factory', 'Companies', 'factory/index.html', 'mint'], ['tokens', 'Token report', 'accountant/briefs/latest.pdf', 'butter'], ['page', 'My page', 'index.html', 'peach']]
    return `<nav aria-label="Indi's pages"><ul class="nav">${L.map(([k, t, h, c]) => `<li><a class="${c}" href="${up}${h}"${k === current ? ' aria-current="page"' : ''}>${t}${counts[k] ? ` <span class="n">${counts[k]}</span>` : ''}</a></li>`).join('')}</ul></nav>`
}

// a person or agent in plain words: designer@web-summit.dinis -> "Dinis's designer"; Indi's own -> "your designer"
function who(name, people) {
    const m = String(name || '').match(/^([a-z0-9-]+)@web-summit\.([a-z]+)$/); if (!m) return ''
    const role = m[1].replace(/-/g, ' ')
    return m[2] === 'indi' ? `your ${role}` : `${people[m[2]] || m[2]}'s ${role}`
}
// a release's subject, reworded for someone new to all this: issue numbers become pills, handles become names,
// page paths become page names, file paths, vault ids and brackets of detail go
export function plain(s, people) {
    const ws = [...new Set((s.match(/\bWS-\d+/g) || []))]
    const nums = x => x.match(/\d+/g), list = n => n.length > 1 ? `tasks ${n.slice(0, -1).join(', ')} and ${n[n.length - 1]}` : `task ${n[0]}`
    let t = s
        .replace(/\(([^()]*)\)/g, (m, x) => /^\s*WS-\d+(?:[^()]*)$/.test(x) || /[\/@]|\.(json|md|mjs|js)\b/.test(x) ? '' : m)
        .replace(/"\s*"/g, 'the task number')
        .replace(/^WS-\d+(?:,? (?:and )?WS-\d+)*\s*[:,]\s*/, '')
        .replace(/\bWS-\d+(?:(?:,| and|, and) WS-\d+)+/g, m => list(nums(m)))
        .replace(/\bWS-(\d+)/g, 'task $1')
        .replace(/\b([a-z0-9-]+)@web-summit\.([a-z]+)/g, (_, r, p) => p === 'indi' ? `your ${r}` : `${people[p] || p}'s ${r}`)
        .replace(/\b([a-z]+)@([a-z]+)\b/g, (_, r, p) => `${people[p] || p}'s ${r}`)
        .replace(/\b([a-z]+)@(?=[\s,).']|$)/g, '$1 agent')
        .replace(/(^|\s)\/([a-z0-9-]+(?:\/[a-z0-9-]+)*)\/?(?:#[a-z0-9-]+)?(?=[\s:,.]|$)/g, (_, a, p) => `${a}the ${p.split('/').join(' ')} page`)
        .replace(/\b[\w.-]+\/[\w./-]+\.(?:json|md)\b/g, 'a data file').replace(/\b[\w.-]+\/[\w./-]+\.(?:mjs|js)\b/g, 'a tool')
        .replace(/\b[\w-]+\.(?:mjs|js)\b/g, 'a tool').replace(/\b[\w-]+\.json\b/g, 'a data file')
        .replace(/\b[0-9a-f]{7,8}\b(?=\))/g, 'saved').replace(/\b(vault|key) [0-9a-z]{8}\b/g, '$1').replace(/\(\s*[0-9a-z]{8}(?:, [^)]*)?\)/g, '').replace(/\b[0-9a-z]{8}\b(?= clean)/g, 'the vault')
        .replace(/\(sha256:[0-9a-f]+\)/g, '').replace(/\bsha256:[0-9a-f]+/g, 'its key')
        .replace(/\bABPs?\b/g, 'behaviour policies').replace(/\bUTC\b/g, '').replace(/\bpushed\b/g, 'saved').replace(/\bgate\b/g, 'check').replace(/\bcommits?\b/g, m => m.endsWith('s') ? 'saved changes' : 'saved change')
        .replace(/\bthe the\b/gi, 'the').replace(/\bpage pages\b/g, 'pages').replace(/\bthe ([a-z ]+) page page\b/g, 'the $1 page')
        .replace(/\s+([,.:;])/g, '$1').replace(/[,:;]\s*$/, '').replace(/\(\s*\)/g, '').replace(/\s{2,}/g, ' ').replace(/^[\s,:;]+/, '').trim()
    t = t.charAt(0).toUpperCase() + t.slice(1)
    return { text: t || 'A small update', ws }
}
// one or two coloured topics a release is about
const TOPICS = [['you', 'For you', 'lav', /\bindi\b|\byour\b/i], ['print', 'Print and cards', 'peach', /card|sticker|print|merch|shirt|sleeve|logo/i],
    ['companies', 'Companies', 'mint', /factory|compan|outreach|lead|target|riskmandate|message/i], ['meetings', 'Stand-ups', 'butter', /stand-up|agenda|brief\b|briefing|decision|meeting/i],
    ['agents', 'Agents and keys', 'sky', /agent|key|vault|session|wake|run\b|run:|token/i], ['site', 'The website', 'rose', /page|site|dashboard|start|guide|help|view/i]]
const topicsOf = (s, mine) => { const t = TOPICS.filter(([k, , , re]) => k === 'you' ? mine : re.test(s)).slice(0, 2); return t.length ? t : [['other', 'Other', 'grey']] }

// plain jobs for Indi's agents (their own job lines carry file paths)
const JOBS = { conductor: 'Runs your other agents, keeps your pages up to date and briefs you before each stand-up.', dev: 'Builds the company pages in your factory.',
    dashboard: 'Keeps your page and your to-do list up to date.', messaging: 'Checks that everything we publish says the same thing about RiskMandate.',
    factory: 'Researches each company we want to meet: what it does, its risks, how RiskMandate helps.', builder: "Builds Daniela's site and learning space, under her rules.",
    vault: 'Looks after your private, encrypted folders and who can open them.', designer: 'Designs the RiskMandate business cards and stickers.',
    synthetic: 'Plays pretend customers to test your work before real people see it.', accountant: 'Measures what your agents cost and how to spend less.',
    journalist: 'Writes you a short report of what happened, every few hours.', ux: 'Makes your pages easier to use (this page is its work).' }

export function build(ROOT) {
    const { T, now, lanes, decisions } = collect(ROOT), N = now.getTime()
    const people = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(ROOT, 'data/team.json'), 'utf8')).members.filter(m => m.kind === 'human').map(m => [m.id, m.name.split(' ')[0]]))
    // the git log of the last two days: releases, and who made each (the work commit with the same subject)
    let log = []; try { log = execFileSync('git', ['log', '--since=' + new Date(N - 2 * 864e5).toISOString(), '--format=%cI%x1f%s'], { cwd: ROOT, maxBuffer: 16 << 20 }).toString().split('\n').filter(Boolean).map(l => l.split('\x1f')) } catch { }
    const author = {}; for (const [, s] of log) { const m = s.match(/^([a-z0-9-]+@web-summit\.[a-z]+): (.*)$/); if (m && !author[m[2]]) author[m[2]] = m[1] }
    const ackF = path.join(ROOT, 'people/indi/ack.json'), ack = fs.existsSync(ackF) ? JSON.parse(fs.readFileSync(ackF, 'utf8')).acknowledged_at : null
    const from = ack ? Date.parse(ack) : N - 864e5
    const rel = log.filter(([at, s]) => /^site v[0-9.]+: /.test(s) && Date.parse(at) >= from).map(([at, s]) => {
        const subj = s.replace(/^site (v[0-9.]+): /, ''), v = s.match(/^site (v[0-9.]+)/)[1], by = author[subj] || ''
        const mine = /@web-summit\.indi$/.test(by) || /\bIndi\b/.test(subj)
        return { at, v, by, mine, ...plain(subj, people), topics: topicsOf(subj + ' ' + by, mine) }
    })
    const item = r => `<li class="${r.topics[0][2]}" data-tags="${r.topics.map(t => t[0]).join(' ')}"><span class="when">${timeEl(r.at, N)}</span><span class="said">${esc(r.text)}</span><span class="tags">${r.topics.map(([, l, c]) => `<span class="pill ${c}">${esc(l)}</span>`).join('')}${r.ws.map(w => `<span class="pill grey">Task ${esc(w.slice(3))}</span>`).join('')}</span><span class="src">${r.by ? `By ${esc(who(r.by, people))} · ` : ''}<a href="${REPO}/releases/tag/${esc(r.v)}">details</a></span></li>`
    const mineFirst = [...rel.filter(r => r.mine), ...rel.filter(r => !r.mine)]
    const shown = mineFirst.slice(0, 6), rest = mineFirst.slice(6)
    const used = TOPICS.filter(([k]) => rel.some(r => r.topics.some(t => t[0] === k)))

    // the next stand-up (Lisbon is UTC in November)
    const S = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/meetings/schedule.json'), 'utf8'))
    const slots = []; for (let d = new Date(S.from + 'T00:00:00Z'); d <= new Date(S.until + 'T23:59:59Z'); d = new Date(d.getTime() + 864e5)) for (const s of ((k => k ? S.slots_from[k] : S.slots)(Object.keys(S.slots_from || {}).filter(x => x <= d.toISOString().slice(0, 10)).sort().pop()))) slots.push(new Date(d.toISOString().slice(0, 10) + 'T' + s + ':00Z'))
    const nx = slots.find(d => d.getTime() > N) || slots[slots.length - 1], nxId = nx.toISOString().slice(0, 16).replace('T', '-').replace(':', '')
    const nxIso = nx.toISOString().replace('.000', ''), nxDay = nx.toISOString().slice(0, 10) === now.toISOString().slice(0, 10) ? 'today' : dayName(nxIso)

    // Indi's agents: working now (in the last 3 hours), ran today, quiet today, not started yet
    const A = JSON.parse(fs.readFileSync(path.join(ROOT, 'people/indi/agents.json'), 'utf8'))
    const last = name => { try { return execFileSync('git', ['log', '-1', '--format=%cI', '--grep=^' + name + ':', '--grep=^Agent: ' + name + '$'], { cwd: ROOT }).toString().trim() } catch { return '' } }
    const today0 = Date.parse(now.toISOString().slice(0, 10) + 'T00:00:00Z')
    const agents = A.map(a => { const l = last(a.name), t = l ? Date.parse(l) : 0, short = a.name.split('@')[0]
        const st = /planned/.test(a.status) ? ['Not started yet', 'grey', 4] : /handed/.test(a.status) ? ['Handed over', 'grey', 4] : !t ? ['Not started yet', 'grey', 4]
            : N - t < 3 * 36e5 ? ['Working now', 'mint', 0] : t >= today0 ? ['Ran today', 'sky', 1] : ['Quiet today', 'butter', 2]
        return { short, l, st, job: JOBS[short] || a.job } }).sort((x, y) => x.st[2] - y.st[2] || (Date.parse(y.l) || 0) - (Date.parse(x.l) || 0))
    const counts = { todo: lanes.overdue.length + lanes.today.length }
    const tile = (n, what, go, href, c) => `<a class="${c}" href="${href}"><span class="big">${n}</span><span class="what">${esc(what)}</span><span class="go">${esc(go)}</span></a>`
    const hour = now.getUTCHours(), hi = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

    const body = `<div class="ux">
${nav('../', 'today', counts)}
<p class="hello"><b>${hi}, Indi.</b> Here is your day on one screen. Tap a box to go straight there.</p>
<p class="small">Updated ${timeEl(now.toISOString(), N)}, each time anyone on the team saves their work.</p>
<h2>Do these first</h2>
<div class="first">
${tile(lanes.overdue.length, lanes.overdue.length === 1 ? 'task is late' : 'tasks are late', 'See them, oldest first', '../todo/index.html#lanes', 'rose')}
${tile(lanes.today.length, lanes.today.length === 1 ? 'task is due today' : 'tasks are due today', 'See what is due', '../todo/index.html#lanes', 'peach')}
${tile(decisions.length, decisions.length === 1 ? 'decision waits for you' : 'decisions wait for you', 'Decide them', '../todo/index.html#decisions', 'butter')}
</div>
<h2>Next stand-up</h2>
<div class="standup"><span class="big">${timeEl(nxIso, N)}</span><span>${esc(nxDay === 'today' ? 'Today' : nxDay)} at ${esc(clock(nxIso))} Lisbon time. Decisions first, so read your briefing before.</span><a href="../../../meetings/${esc(nxId)}/indi/index.html">Read your briefing</a></div>
<h2 id="changed">What changed ${ack ? 'since you last looked' : 'in the last day'}</h2>
${rel.length ? `<p class="small"><b>${rel.length} ${rel.length === 1 ? 'update' : 'updates'}.</b> ${rel.filter(r => r.mine).length ? `Yours first: ${rel.filter(r => r.mine).length} ${rel.filter(r => r.mine).length === 1 ? 'is' : 'are'} about you or by your agents.` : 'None of these are by your agents.'} Tap a colour to see only that kind.</p>
<div class="filters" role="group" aria-label="Show only">${[['all', 'Everything', 'grey'], ...used.map(([k, l, c]) => [k, l, c])].map(([k, l, c], i) => `<button type="button" class="${c}" data-filter="${k}" aria-pressed="${i ? 'false' : 'true'}">${esc(l)}</button>`).join('')}</div>
<ul class="feed" data-feed>${shown.map(item).join('')}</ul>
${rest.length ? `<details class="more"><summary>Show ${rest.length} more</summary><ul class="feed" data-feed>${rest.map(item).join('')}</ul></details>` : ''}` : '<p>Nothing new since you last looked.</p>'}
<p class="small">Seen it all? Tell your agent <b>"acknowledge"</b> and this list starts again from now.</p>
<h2 id="agents">Your agents</h2>
<div class="agents">${agents.map(a => `<div class="agent ${a.st[1]}${a.st[2] >= 2 ? ' quiet' : ''}"><span class="top"><b>${esc(a.short.charAt(0).toUpperCase() + a.short.slice(1))}</b><span class="pill ${a.st[1]}"><span class="dot"></span>${esc(a.st[0])}</span></span><span class="job">${esc(a.job)}</span><span class="last">${a.l ? `Last saved work ${timeEl(a.l, N)}` : 'No work saved yet'}</span></div>`).join('')}</div>
<p class="key"><span class="pill mint"><span class="dot"></span>Working now: saved work in the last 3 hours</span><span class="pill sky"><span class="dot"></span>Ran today</span><span class="pill butter"><span class="dot"></span>Quiet today</span><span class="pill grey"><span class="dot"></span>Not started yet</span></p>
<p class="meta">Source: the board, the stand-up items, the team's saved work (git history), <a href="${REPO}/blob/dev/people/indi/agents.json">your agents list</a> and <a href="${REPO}/blob/dev/people/indi/today/today.mjs">this page's code</a>. Made by ux@web-summit.indi (WS-06).</p>
</div>`
    const md = `Indi's day on one page, in plain words. Updated ${now.toISOString().slice(0, 16).replace('T', ' ')} UTC.\n\n## Do these first\n\n- ${lanes.overdue.length} tasks are late\n- ${lanes.today.length} tasks are due today\n- ${decisions.length} decisions wait for Indi\n\n## Next stand-up\n\n${nxDay} at ${clock(nxIso)} Lisbon time: [Indi's briefing](../../../meetings/${nxId}/indi/index.md)\n\n## What changed\n\n${mineFirst.map(r => `- ${r.at.slice(11, 16)} UTC: ${r.text}${r.ws.length ? ` (${r.ws.join(', ')})` : ''}${r.by ? `, by ${who(r.by, people)}` : ''}`).join('\n') || 'Nothing new.'}\n\n## Indi's agents\n\n${agents.map(a => `- **${a.short}**: ${a.st[0]}. ${a.job}${a.l ? ` Last saved work ${a.l.slice(0, 16).replace('T', ' ')} UTC.` : ''}`).join('\n')}\n`
    return [{ rel: 'people/indi/today/index.html', title: "Indi's day", description: `Indi's day on one page in plain words: ${lanes.overdue.length} tasks late, ${lanes.today.length} due today, ${decisions.length} decisions, the next stand-up, what changed and what each agent is doing.`, body, md,
        head: FONTS + '<link rel="stylesheet" href="../ui/ui.css"><script src="../ui/ui.js" defer></script>' }]
}
