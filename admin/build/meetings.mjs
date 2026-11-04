// The stand-ups (the operator, 2 November 2026): two a day, an agenda that builds through the day, and a pre-meeting
// briefing for every person, all from JSON. Sources: data/meetings/schedule.json, one file per agenda item in
// data/meetings/<meeting id>/, and people/<id>/ack.json (when the person last said "seen it"). Everything this writes
// is generated: /meetings/ (pages, and each briefing as JSON in the editor brief's shape, for a PDF:
// admin/tools/meeting_pdfs.sh). Deterministic: the same sources and history give the same pages.
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import { slots } from '../tools/agenda.mjs'

const TYPES = [['decision', 'Decisions'], ['question', 'Questions'], ['idea', 'Ideas'], ['sync', 'Quick syncs']]
const NOW = () => new Date(process.env.BUILD_NOW || Date.now())

export function meetingsContext(ROOT) {
    const DIR = path.join(ROOT, 'data/meetings')
    const S = JSON.parse(fs.readFileSync(path.join(DIR, 'schedule.json'), 'utf8'))
    const all = slots()
    const items = id => { const d = path.join(DIR, id); return fs.existsSync(d) ? fs.readdirSync(d).filter(f => f.endsWith('.json')).sort().map(f => ({ file: `${id}/${f}`, meeting: id, ...JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')) })) : [] }
    // an open item from an earlier stand-up carries over to every later one until it is decided or closed
    const agenda = id => { const i = all.findIndex(s => s.id === id); return all.slice(0, i + 1).flatMap(s => items(s.id).filter(x => s.id === id || x.status === 'open').map(x => ({ ...x, carried: s.id !== id }))) }
    const next = () => all.find(s => new Date(s.at) > NOW()) || all[all.length - 1]
    // the history is read once per build and filtered here: it was one git process per person, per stand-up, four
    // times over (about 300 a build, 1.9 of the build's 2.6 seconds, and the gate builds twice; dev@web-summit.dinis)
    let history = null
    const readHistory = () => { try { return execFileSync('git', ['log', '--format=%cI%x1f%an%x1f%s'], { cwd: ROOT, maxBuffer: 64 << 20 }).toString().split('\n').filter(Boolean).map(l => { const [at, an, s] = l.split('\x1f'); return { at, t: Date.parse(at), an, s, release: /^site v[0-9]/.test(s) } }) } catch { return [] } }
    const log = since => { history ??= readHistory(); const from = Date.parse(since); return history.filter(x => x.t >= from).map(({ t, ...x }) => x) }
    const ack = id => { const f = path.join(ROOT, 'people', id, 'ack.json'); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null }
    return { S, all, items, agenda, next, log, ack }
}

const forMe = (x, id) => (x.for || ['everyone']).some(f => f === id || f === 'everyone')
const when = iso => iso ? iso.replace('T', ' ').slice(0, 16) + ' UTC' : 'never'
const dueSoon = (due, today) => { const m = String(due || '').match(/(\d{1,2}) Nov/); if (!m) return /now|today/i.test(due || ''); const d = Number(m[1]); return d <= Number(today.slice(8, 10)) + 1 }

// "since you last looked": today, the last 24 hours, and since the person's last acknowledgement
export function sinceMd(C, id, up) {
    const now = NOW(), a = C.ack(id), day = now.toISOString().slice(0, 10)
    const span = from => { const l = C.log(from); return { rel: l.filter(x => x.release), work: l.filter(x => !x.release) } }
    const ackFrom = a?.acknowledged_at || new Date(now - 864e5).toISOString()
    const t = span(day + 'T00:00:00Z'), d = span(new Date(now - 864e5).toISOString()), s = span(ackFrom)
    const lines = s.rel.slice(0, 8).map(x => `- ${when(x.at).slice(11)} ${x.s.replace(/^site (v[0-9.]+): /, '**$1** ')}`).join('\n')
    return `| | Releases | Agent and people commits |\n|---|---|---|\n| Today (since 00:00 UTC) | ${t.rel.length} | ${t.work.length} |\n| The last 24 hours | ${d.rel.length} | ${d.work.length} |\n| Since you last acknowledged (${a ? when(a.acknowledged_at) : 'never: showing the last 24 hours'}) | ${s.rel.length} | ${s.work.length} |\n\n${lines ? `Newest releases since then:\n\n${lines}\n\n` : ''}Seen it? Tell your agent *"acknowledge"*: it writes \`people/${id}/ack.json\` with the time, and your next briefing starts from there.`
}

export function buildMeetings({ ROOT, C, PEOPLE, ISSUES, write, page, render, twin, pages }) {
    const today = NOW().toISOString().slice(0, 10), nx = C.next()
    const show = C.all.filter(s => s.day >= today && s.day <= new Date(NOW().getTime() + 2 * 864e5).toISOString().slice(0, 10) || C.items(s.id).length)
    const itemMd = (x, up = '../../') => `- **${x.title}**${x.carried ? ` *(carried over from ${x.meeting})*` : ''}. For: ${(x.for || ['everyone']).join(', ')}. Added by ${x.by}.${x.detail ? ` ${x.detail}` : ''}${x.options ? ` Options: ${x.options.map((o, i) => `(${i + 1}) ${o}`).join('; ')}.` : ''}${x.recommend ? ` *Recommended:* ${x.recommend}` : ''}${x.issue ? ` [${x.issue}](${up}briefs/index.html#issues)` : ''}${x.status === 'decided' ? ` **Decided** by ${x.decided.by}: "${x.decided.said}" (${when(x.decided.at)})` : ''}`
    const agendaMd = (list, up = '../../') => TYPES.map(([k, h]) => { const xs = list.filter(x => x.type === k); return xs.length ? `### ${h}\n\n${xs.map(x => itemMd(x, up)).join('\n')}` : '' }).filter(Boolean).join('\n\n') || 'Nothing on the agenda yet. Add an item: `node admin/tools/agenda.mjs add --meeting ' + nx.id + ' --by <you> --type decision --title "..."`.'
    const rows = show.map(s => { const a = C.agenda(s.id); return `| [${s.day} ${s.time}](${s.id}/index.html)${s.id === nx.id ? ' **next**' : ''} | ${TYPES.map(([k]) => a.filter(x => x.type === k && x.status === 'open').length).join(' · ')} | ${a.filter(x => x.status === 'decided').length} |` })
    const idx = `${C.S.about}\n\n**Next: [${nx.day} ${nx.time} UTC](${nx.id}/index.html)**, ${C.agenda(nx.id).filter(x => x.status === 'open').length} items open. Every person's briefing for it is linked from its page.\n\n## The rules {#rules}\n\n${C.S.rules.map(r => `- ${r}`).join('\n')}\n\n## The stand-ups {#list}\n\n| Stand-up | Open: decisions · questions · ideas · syncs | Decided |\n|---|---|---|\n${rows.join('\n')}\n\n## Add an item {#add}\n\nTell your agent *"add to the next stand-up: ..."*, or run:\n\n\`\`\`\nnode admin/tools/agenda.mjs add --by <your name> --type decision --title "..." --for dinis --options "a|b" --recommend "..." [--meeting after-next|<YYYY-MM-DD-HHMM>]\n\`\`\`\n\nthen commit \`data/meetings/\` and release. One file per item, so nobody collides.`
    const rel = 'meetings/index.html', title = 'Stand-ups: the agenda, building through the day'
    write(rel, page({ rel, title, description: `Two stand-ups a day; next ${nx.id}.`, body: render(idx), mdTwin: rel.replace(/\.html$/, '.md') })); pages.push({ rel, title, description: `Two stand-ups a day; next ${nx.id}.` }); twin(rel, title, `Two stand-ups a day; next ${nx.id}.`, idx)
    // personal briefings only for today's stand-ups and those still to come: one from an earlier day, rebuilt later,
    // showed TODAY's "since you last looked" under an old date, and cost 27 files a stand-up. Today's stay, because
    // dashboards and briefs link them during the day. Its agenda page always stays: that is the record.
    // (dev@web-summit.dinis, 3 November)
    const upcoming = s => s.day >= today
    for (const s of show) {
        const list = C.agenda(s.id), people = PEOPLE()
        const md = `${s.day} at ${s.time} UTC (Lisbon). Decisions first, then questions, ideas and quick syncs. Read your briefing before.\n\n## Agenda {#agenda}\n\n${agendaMd(list)}\n\n## Everyone's briefing {#briefings}\n\n${upcoming(s) ? people.map(p => `- [${p.name}](${p.id}/index.html): ${list.filter(x => x.status === 'open' && forMe(x, p.id)).length} items for them`).join('\n') : `This stand-up has passed: the agenda above is the record. Briefings are built for the stand-ups still to come; these addresses now point there: ${people.map(p => `[${p.name.split(' ')[0]}](${p.id}/index.html)`).join(' · ')}.`}`
        const r = `meetings/${s.id}/index.html`, t = `Stand-up, ${s.day} ${s.time}`
        write(r, page({ rel: r, title: t, description: `The agenda for the ${s.day} ${s.time} stand-up.`, body: render(md), mdTwin: r.replace(/\.html$/, '.md') })); pages.push({ rel: r, title: t, description: `The agenda for the ${s.day} ${s.time} stand-up.` }); twin(r, t, `The agenda for the ${s.day} ${s.time} stand-up.`, md)
        // a past day's briefing addresses still resolve, to a short page with no numbers on it: links to them in anyone's
        // text must not turn the gate red at midnight (they did on 4 November, until the conductor fixed one by hand)
        if (!upcoming(s)) for (const p of people) {
            const pr = `meetings/${s.id}/${p.id}/index.html`, pt = `${p.name.split(' ')[0]}'s briefing: stand-up ${s.day} ${s.time} (passed)`
            const bmd = `This briefing was for the stand-up on ${s.day} at ${s.time} UTC, which has passed. Briefings are built only for the stand-ups still to come, because their numbers are worked out when the site is built.\n\n- [What was on that stand-up's agenda](../index.html)\n- [${p.name.split(' ')[0]}'s briefing for the next stand-up, ${nx.day} ${nx.time}](../../${nx.id}/${p.id}/index.html)`
            write(pr, page({ rel: pr, title: pt, description: `A briefing for a stand-up that has passed.`, body: render(bmd), mdTwin: pr.replace(/\.html$/, '.md') })); pages.push({ rel: pr, title: pt, description: 'A briefing for a stand-up that has passed.' }); twin(pr, pt, 'A briefing for a stand-up that has passed.', bmd)
        }
        for (const p of upcoming(s) ? people : []) {
            const mine = list.filter(x => x.status === 'open' && forMe(x, p.id)), first = p.name.split(' ')[0]
            const iss = ISSUES.issues.filter(x => x.status !== 'done' && (x.for.includes(p.id) || (p.core && x.for.includes('everyone'))) && dueSoon(x.due, s.day))
            const bmd = `Your briefing for the ${s.day} ${s.time} stand-up, ${first}. Read it before; the stand-up is for deciding, not for reporting.\n\n## On the agenda for you {#agenda}\n\n${agendaMd(mine, '../../../')}\n\n## Your issues due by tomorrow {#due}\n\n${iss.length ? iss.map(x => `- **${x.id}** ${x.title} (due ${x.due}, ${x.status})`).join('\n') : 'None.'}\n\n## Since you last looked {#since}\n\n${sinceMd(C, p.id, '../../../')}\n\n## The whole agenda {#all}\n\n[The ${s.time} stand-up](../index.html)`
            const pr = `meetings/${s.id}/${p.id}/index.html`, pt = `${first}'s briefing: stand-up ${s.day} ${s.time}`
            write(pr, page({ rel: pr, title: pt, description: `${mine.length} agenda items and ${iss.length} issues due for ${first}.`, body: render(bmd), mdTwin: pr.replace(/\.html$/, '.md') })); pages.push({ rel: pr, title: pt, description: `${mine.length} agenda items for ${first}.` }); twin(pr, pt, `${mine.length} agenda items for ${first}.`, bmd)
            // the same briefing in the editor brief's JSON shape, for a PDF (admin/tools/meeting_pdfs.sh)
            const a = C.ack(p.id), since = C.log(a?.acknowledged_at || new Date(NOW() - 864e5).toISOString())
            write(`meetings/${s.id}/${p.id}.json`, JSON.stringify({
                number: `${s.id}`, date: s.day, kicker: `Web Summit 2026 · stand-up briefing`, title: `${first}: your briefing for the ${s.time} stand-up`,
                when: `${s.day} ${s.time} UTC`, by: 'built from the board, the agenda and the git log',
                headline: `${mine.filter(x => x.type === 'decision').length} decisions and ${mine.filter(x => x.type !== 'decision').length} other items for you; ${iss.length} of your issues due by tomorrow; ${since.filter(x => x.release).length} releases since you last acknowledged (${a ? when(a.acknowledged_at) : 'never'}).`,
                stats: [{ n: String(mine.filter(x => x.type === 'decision').length), label: 'decisions for you' }, { n: String(iss.length), label: 'your issues due by tomorrow' }, { n: String(since.filter(x => x.release).length), label: 'releases since you looked' }],
                for_you: mine.filter(x => x.type === 'decision').map((x, i) => ({ id: String(i + 1), ask: x.title, detail: x.detail || '', options: x.options || ['yes', 'no'], ...(x.recommend ? { recommend: x.recommend } : {}) })),
                sections: [{ title: 'Questions, ideas and syncs for you', items: mine.filter(x => x.type !== 'decision').map(x => `${x.title} (${x.type}, from ${x.by})`) }, { title: 'Your issues due by tomorrow', items: iss.map(x => `${x.id} ${x.title} (due ${x.due})`) }].filter(x => x.items.length),
                next: [`The whole agenda: https://web-summit.sgit.ai/meetings/${s.id}/`], sources: ['data/meetings/', 'board/', 'git log']
            }, null, 2) + '\n')
        }
    }
}
