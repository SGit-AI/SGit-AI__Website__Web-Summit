// The home page (WS-103, designed by designer@web-summit.dinis, approved by Dinis on 2 November 2026): for a person on
// the team, on a phone, in under ten seconds: what needs me, what is happening now, who is doing it. Every number and
// line here is read from the data at build time, none typed. The design: team/designer/home/SPEC.md and /design/#home.
// People are drawn round (cast.mjs humanFigure), agents square with a screen for a head (agentFigure), each in their
// person's colour, so the two read apart at a glance. Placeholders in content/index.md: {{hero}} {{needs}} {{now}}
// {{people}} {{numbers}}; each gives html (for the page) and md (for the twin, so an agent reads what a person sees).
import fs from 'fs'
import path from 'path'
import * as CAST from './cast.mjs'

const NOW = () => new Date(process.env.BUILD_NOW || Date.now())
const SUMMIT = '2026-11-09'
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const plain = s => String(s || '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/`([^`]+)`/g, '$1').replace(/\*\*?([^*]+)\*\*?/g, '$1').trim()
const names = list => list.length <= 1 ? list.join('') : `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`
const fig = (body, label) => `<svg class="fig" viewBox="0 0 40 50" role="img" aria-label="${esc(label)}">${body}</svg>`
// "Mon 2 Nov, 16:00" or "Wed 4 Nov": the day of November, or null
const WORDS = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s
// a line cut at a word, never inside one, with an ellipsis when cut
const clip = (s, n) => s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n)).replace(/[,;:]$/, '') + '…'
const dayName = iso => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
const dueDay = due => { const m = String(due || '').match(/(\d{1,2}) Nov/); return m ? Number(m[1]) : null }

export function homeBlocks({ ROOT, teamData, onboard, LEVELS, INV, MEET, ISSUES, plan, castData, merch }) {
    const now = NOW(), today = now.toISOString().slice(0, 10), dom = now.getUTCMonth() === 10 ? now.getUTCDate() : (now < new Date('2026-11-01') ? 0 : 99)
    const core = teamData.members.filter(m => m.kind === 'human' && m.core)
    const first = m => m.name.split(' ')[0]
    const colourOf = id => merch[id] || ((castData.people || []).find(p => p.id === id) || {}).colour || CAST.FILL2
    const ob = Object.fromEntries(core.map(m => [m.id, onboard(m.id)]))
    const running = INV.agents.filter(a => a.commits > 0)
    const days = Math.max(0, Math.ceil((new Date(SUMMIT + 'T09:00:00Z') - now) / 86400000))
    const connected = core.filter(m => ob[m.id].level >= 2).length

    // 1. the hero band: the headline Dinis chose, and three numbers
    const heroNums = [[`<span data-days="${SUMMIT}">${days}</span>`, String(days), days === 1 ? 'day to the summit' : 'days to the summit', 'summit/index.html'],
        [`${connected} of ${core.length}`, `${connected} of ${core.length}`, 'of us connected', 'team/setup/index.html'],
        [String(running.length), String(running.length), 'agents running', 'team/map/index.html']]
    const hero = {
        html: `<section class="hm-hero"><h1>Seven of us. Our agents.<br>One RiskMandate.</h1><p>Web Summit Lisbon, 9 to 12 November 2026. Our stand: Thursday 12 November.</p><div class="hm-count">${heroNums.map(([h, , t, href]) => `<a href="${href}"><b>${h}</b><span>${t}</span></a>`).join('')}</div></section><script src="assets/countdown.js" defer></script>`,
        md: `## Seven of us. Our agents. One RiskMandate.\n\nWeb Summit Lisbon, 9 to 12 November 2026. Our stand: Thursday 12 November.\n\n${heroNums.map(([, m, t]) => `- **${m}** ${t}`).join('\n')}`
    }

    // 2. needs you: a setup step people are stuck at (grouped), the next stand-up's decisions by who decides,
    //    then open issues for the seven due today or overdue. Four cards at most, in that order.
    const nx = MEET.next(), nxDay = /^\d{4}-\d{2}-\d{2}$/.test(nx.day) ? dayName(nx.day) : nx.day, agenda = MEET.agenda(nx.id).filter(x => x.status === 'open')
    const cards = []
    const stuck = {}
    for (const m of core) { const o = ob[m.id]; if (o.next && o.level < 3) (stuck[o.next.step] ||= { how: o.next.how, level: o.level, who: [] }).who.push(m) }
    Object.entries(stuck).sort((a, b) => a[1].level - b[1].level || b[1].who.length - a[1].who.length).slice(0, 1)
        .forEach(([step, g]) => cards.push({ who: g.who, title: names(g.who.map(first)), what: `${cap(g.how)}.${g.who.length > 1 ? ` ${g.who.length === 2 ? 'Both' : `All ${WORDS[g.who.length] || g.who.length}`} are stuck at this one step (${step.toLowerCase()}).` : ''}`, ref: 'setup', href: 'team/setup/index.html' }))
    const decisions = agenda.filter(x => (x.type || 'decision') === 'decision')
    const byDecider = {}
    for (const x of decisions) for (const id of (x.for || [])) if (core.some(m => m.id === id)) (byDecider[id] ||= []).push(x)
    Object.entries(byDecider).sort((a, b) => b[1].length - a[1].length).slice(0, 2).forEach(([id, xs]) => {
        const m = core.find(c => c.id === id)
        cards.push({ who: [m], title: first(m), what: `${xs.length === 1 ? 'A decision' : `${xs.length} decisions`} at the ${nx.time} stand-up: ${xs.slice(0, 2).map(x => clip(plain(x.title).replace(/[.?]$/, ''), 60)).join('; ')}${xs.length > 2 ? `; and ${xs.length - 2} more` : ''}.`, ref: 'stand-up', href: `meetings/${nx.id}/index.html` })
    })
    const due = ISSUES.issues.filter(x => !/done/i.test(x.status || '') && dueDay(x.due) !== null && dueDay(x.due) <= dom)
        .filter(x => x.for.some(f => f === 'everyone' || core.some(m => m.id === f)))
        .sort((a, b) => dueDay(a.due) - dueDay(b.due) || a.id.localeCompare(b.id))
    for (const x of due.slice(0, Math.max(1, 4 - cards.length))) {
        const who = x.for.includes('everyone') ? [] : core.filter(m => x.for.includes(m.id))
        cards.push({ who, title: who.length ? names(who.map(first)) : 'Everyone', what: `${plain(x.title)}. ${dueDay(x.due) < dom ? `Was due ${x.due}.` : `Due ${x.due}.`}`, ref: x.id, href: 'briefs/index.html#issues' })
    }
    const shown = cards.slice(0, 4), more = due.length - shown.filter(c => /^WS-/.test(c.ref)).length
    const nItems = agenda.length, nDec = decisions.length
    const standup = { html: `<a class="hm-standup" href="meetings/${nx.id}/index.html"><b>${esc(nx.time)}</b><span><strong>Next stand-up, ${esc(nxDay)}</strong><small>${nItems} item${nItems === 1 ? '' : 's'} on the agenda, ${nDec} decision${nDec === 1 ? '' : 's'} first</small></span></a>`,
        md: `- **Next stand-up:** ${nxDay} ${nx.time}, ${nItems} items, ${nDec} decisions first: https://web-summit.sgit.ai/meetings/${nx.id}/` }
    const needs = {
        html: `<section class="hm-needs"><h2 id="needs">Needs you</h2>${shown.length ? shown.map(c => `<a class="hm-need" href="${c.href}" data-for="${esc(c.who.map(w => w.id).join(' '))}" style="--c:${c.who.length ? colourOf(c.who[0].id) : 'var(--accent)'}"><span><b>${esc(c.title)}</b><span>${esc(c.what)}</span></span><em>${esc(c.ref)}</em></a>`).join('') : '<p>Nothing is waiting on anyone right now.</p>'}${more > 0 ? `<p class="meta"><a href="briefs/index.html#issues">${more} more due by today on the board</a></p>` : ''}${standup.html}</section>`,
        md: `## Needs you\n\n${shown.map(c => `- **${c.title}** (${c.ref}): ${c.what}`).join('\n') || 'Nothing is waiting on anyone right now.'}${more > 0 ? `\n- ${more} more due by today on the board.` : ''}\n${standup.md}`
    }

    // 4. happening now: the newest report's first three lines, and the agents it names in "Who did what"
    const RDIR = path.join(ROOT, 'content/reports')
    const latest = (fs.existsSync(RDIR) ? fs.readdirSync(RDIR).filter(f => /^\d{4}-\d{2}-\d{2}-\d{4}\.md$/.test(f)).sort() : []).pop()
    let now_ = { html: '', md: '' }
    if (latest) {
        const text = fs.readFileSync(path.join(RDIR, latest), 'utf8'), slug = latest.replace(/\.md$/, '')
        const section = h => (text.split(new RegExp(`^## ${h}\\s*$`, 'm'))[1] || '').split(/^## /m)[0]
        const lines = section('What happened').split('\n').filter(l => /^\d+\. /.test(l)).slice(0, 3).map(l => {
            const m = l.replace(/^\d+\. /, '').match(/^\*\*([^*]+)\*\*\s*(.*)$/)
            const head = m ? m[1].replace(/[.:,]+$/, '') : ''
            // drop the agent's name in front (the figures show who) and anything in brackets, then the first clause
            const rest = plain(m ? m[2] : l).replace(/^[a-z0-9-]+@web-summit\.[a-z0-9-]+:\s*/, '').replace(/\s*\([^)]*\)/g, '').replace(/^[,;:]\s*/, '')
            const short = clip((rest.match(/^.*?[.;](?=\s[A-Z]|$)/) || [rest])[0].replace(/[.;]\s*$/, ''), 90)
            return { head, short }
        })
        const who = [...section('Who did what').matchAll(/\*\*([a-z0-9-]+@web-summit\.[a-z0-9-]+)\*\*/g)].map(m => m[1])
        const byName = Object.fromEntries((castData.agents || []).map(a => [a.name, a]))
        const figs = [...new Set(who)].slice(0, 8).map(n => { const [a, p] = n.split('@web-summit.'); const c = byName[n] || { colour: CAST.FILL2, head: 'none', hand: 'none' }; return fig(CAST.agentFigure(c, colourOf(p)), n) })
        const when = slug.slice(11, 13) + ':' + slug.slice(13, 15)
        now_ = {
            html: `<section class="hm-now"><h2 id="now">Happening now</h2><div class="hm-box"><p class="meta">${when} · journalist@web-summit.dinis · <a href="reports/${slug}/index.html">the full report</a></p><ol>${lines.map(l => `<li>${l.head ? `<b>${esc(l.head)}:</b> ` : ''}${esc(l.short)}${l.short.endsWith('…') ? '' : '.'}</li>`).join('')}</ol>${figs.length ? `<div class="hm-agents">${figs.join('')}<span>the agents who did it</span></div>` : ''}</div></section>`,
            md: `## Happening now\n\n${when}, journalist@web-summit.dinis (https://web-summit.sgit.ai/reports/${slug}/):\n\n${lines.map((l, i) => `${i + 1}. ${l.head ? `**${l.head}:** ` : ''}${l.short}${l.short.endsWith('…') ? '' : '.'}`).join('\n')}${who.length ? `\n\nThe agents who did it: ${[...new Set(who)].join(', ')}.` : ''}`
        }
    }

    // 5. who is doing it: the seven, round, in their colour, with their level and their agents; the stuck look worried
    const ranked = core.map(m => ({ m, o: ob[m.id] })).sort((a, b) => b.o.level - a.o.level || b.o.done - a.o.done || b.o.agents - a.o.agents)
    const people = {
        html: `<section class="hm-people"><h2 id="who">Who is doing it</h2><div class="hm-cast">${ranked.map(({ m, o }) => `<a href="team/${m.id}/index.html">${fig(CAST.humanFigure({ colour: colourOf(m.id) }, 'round', o.level >= 3 ? 'happy' : 'worried'), `${m.name}, drawn as a person`)}<b>${esc(first(m))}</b><i class="hm-lvl"><i style="width:${Math.round(o.level / (LEVELS.length - 1) * 100)}%;background:${colourOf(m.id)}"></i></i><small>L${o.level} · ${o.agents} agent${o.agents === 1 ? '' : 's'}</small></a>`).join('')}</div><p class="meta">People are round, agents are square. Everyone and their agents: <a href="team/map/index.html">the team map</a> · <a href="team/setup/index.html">who has set up what</a> · <a href="wakes/index.html">the agents at work</a></p></section>`,
        md: `## Who is doing it\n\n${ranked.map(({ m, o }) => `- **${m.name}**: ${LEVELS[o.level]}, ${o.agents} agents running`).join('\n')}\n\nThe team map: https://web-summit.sgit.ai/team/map/ · who has set up what: https://web-summit.sgit.ai/team/setup/`
    }

    // 6. the numbers: four, not eleven (the eleven are on /team/everything/)
    const open = ISSUES.issues.filter(x => !/done/i.test(x.status || '')).length
    const votes = core.filter(m => fs.existsSync(path.join(ROOT, 'people', m.id, 'feedback', 'design.json'))).length
    const waiting = (plan.decisions || []).filter(d => d.status !== 'decided').length
    const nums = [[open, `issues open, of ${ISSUES.issues.length}`, 'briefs/index.html#issues'], [nItems, 'stand-up items waiting', `meetings/${nx.id}/index.html`],
        [`${votes} of ${core.length}`, 'design votes in', 'design/index.html#vote'], [waiting, 'decisions waiting on the plan', 'plan/index.html#decisions']]
    const numbers = {
        html: `<section class="hm-numbers"><h2 id="numbers">The numbers</h2><div class="hm-nums">${nums.map(([n, t, h]) => `<a href="${h}"><b>${esc(n)}</b><span>${esc(t)}</span></a>`).join('')}</div><p class="meta">Everything counted: <a href="team/everything/index.html">every person, agent and channel</a>.</p></section>`,
        md: `## The numbers\n\n${nums.map(([n, t]) => `- **${n}** ${t}`).join('\n')}`
    }
    return { hero, needs, now: now_, people, numbers, today }
}

// content/index.md's placeholders, each alone on its line: {{hero}} and the others
export const expandHome = (html, md, B) => {
    for (const k of ['hero', 'needs', 'now', 'people', 'numbers']) {
        html = html.replace(`<p>{{${k}}}</p>`, B[k].html)
        md = md.replace(`{{${k}}}`, B[k].md)
    }
    return { html, md }
}
