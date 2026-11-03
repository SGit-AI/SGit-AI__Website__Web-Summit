#!/usr/bin/env node
// report-draft.mjs: the newest journalist's report, as a short draft for a WhatsApp or Slack broadcast (WS-39).
// Drafts only: it prints JSON and sends nothing. A person (or Jose's n8n flow, once Jose decides) sends it.
// Reads the public list https://web-summit.sgit.ai/reports/index.md (newest first) and the report's markdown twin.
//   node report-draft.mjs                 the newest report
//   node report-draft.mjs --since <slug>  {"new": false} if the newest is <slug>, so a flow can poll and skip repeats
//   node report-draft.mjs --look three    the designer's look 1 (people/jose/design/README.md): title line, day and
//                                         stand-ups, the first three points, "+N more:" and the link
//   node report-draft.mjs --look line     the designer's look 2: one line of leads, then the link
//   node report-draft.mjs --file <index.md> [--report <report.md>]   offline, from saved copies (for tests)
// Every draft also carries id (the slug), created_at (when this draft was made, UTC), source_url (the markdown read),
// text_whatsapp (plain text, WhatsApp's own *bold*, under 1000 characters) and text_slack (Slack mrkdwn).
// report-draft.n8n.js is the same logic for an n8n Code node (network only, no fs); report-draft.test.mjs keeps the two equal.
import fs from 'node:fs'

const SITE = process.env.SITE || 'https://web-summit.sgit.ai/'
const MAX = 700 // a broadcast people read on a phone: the headline, the summary, the first points and the link
const arg = n => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : undefined }
const get = async (url, file) => file ? fs.readFileSync(file, 'utf8') : (async r => { if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`); return r.text() })(await fetch(url))

// "- [Title](slug/index.html): summary" lines, newest first
export const parseIndex = md => [...md.matchAll(/^- \[(.+?)\]\(([^)/]+)\/index\.html\)(?::\s*(.*))?$/gm)].map(m => ({ title: m[1], slug: m[2], summary: m[3] || '' }))

// the numbered points under "## What happened", bold lead only: "1. **Lead.** detail" -> "Lead."
export const points = md => {
    const sec = md.split(/^## /m).find(s => /^What happened/.test(s)) || ''
    return [...sec.matchAll(/^\d+\.\s+\*\*(.+?)\*\*/gm)].map(m => m[1].trim())
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const STANDUPS = '13:00 and 18:00' // data/channels.json, "Stand-ups, 13:00 and 18:00"
// slug YYYY-MM-DD-HHMM -> { day: 'Tue 3 Nov', time: '00:57' }
export const when = slug => {
    const [, y, mo, d, hh, mm] = slug.match(/^(\d{4})-(\d{2})-(\d{2})-(\d{2})(\d{2})$/) || []
    if (!y) return { day: '', time: '' }
    const dt = new Date(Date.UTC(+y, +mo - 1, +d))
    return { day: `${DAYS[dt.getUTCDay()]} ${+d} ${MONTHS[+mo - 1]}`, time: `${hh}:${mm}` }
}
const lead = p => p.replace(/[.:;,]+$/, '')

export const draftThree = (item, reportMd = '') => {
    const link = `${SITE}reports/${item.slug}/`, { day, time } = when(item.slug), ps = points(reportMd)
    const lines = [`*RiskMandate team · ${time} report*`, `${day} · stand-ups ${STANDUPS}`, '', ...ps.slice(0, 3).map(p => `▸ *${lead(p)}*`), '']
    lines.push(ps.length > 3 ? `+${ps.length - 3} more: ${link}` : link)
    return { new: true, slug: item.slug, title: item.title, link, look: 'three', text: lines.join('\n') }
}

export const draftLine = (item, reportMd = '') => {
    const link = `${SITE}reports/${item.slug}/`, { time } = when(item.slug), ps = points(reportMd).map(lead)
    let body = ''
    for (const p of ps) { const next = body ? `${body}; ${p.replace(/^(The|A|An) /, w => w.toLowerCase())}` : p; if (next.length > 160) break; body = next }
    return { new: true, slug: item.slug, title: item.title, link, look: 'line', text: `*${time}* · ${body || item.summary}.\n${link}` }
}

// The fields every look shares, for Jose's n8n flow (WS-39). text stays as it was; the two channel texts are made from it.
export const WA_MAX = 1000
export const slackEscape = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
export const forWhatsApp = (text, link) => {
    if (text.length <= WA_MAX) return text
    const lines = text.split('\n').filter(l => !l.includes(link)), tail = `\n\n${link}`
    while (lines.length && (lines.join('\n') + tail).length > WA_MAX) lines.pop() // drop the last points first, keep the link
    return (lines.join('\n').trimEnd() + tail).slice(0, WA_MAX)
}
export const forSlack = (text, link) => slackEscape(text)
    .replace(/^\+(\d+) more: (\S+)$/m, (_, n, u) => `<${u}|+${n} more in the full report>`)
    .replace(new RegExp(`(^|\\s)${link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=\\s|$)`, 'g'), (_, sp) => `${sp}<${link}|Read the report>`)
export const enrich = (d, now = new Date()) => {
    const text_whatsapp = forWhatsApp(d.text, d.link)
    return { id: d.slug, created_at: now.toISOString(), source_url: `${SITE}reports/${d.slug}/index.md`, ...d, text_whatsapp, text_slack: forSlack(text_whatsapp, d.link) }
}

export const draft = (item, reportMd = '') => {
    const link = `${SITE}reports/${item.slug}/`
    const head = [`*${item.title}*`, item.summary].filter(Boolean).join('\n')
    let text = head, used = 0
    for (const p of points(reportMd)) {
        const next = `${text}${used ? '' : '\n'}\n• ${p}`
        if ((next + '\n\n' + link).length > MAX) break
        text = next; used++
    }
    return { new: true, slug: item.slug, title: item.title, link, text: `${text}\n\n${link}` }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    try {
        const items = parseIndex(await get(SITE + 'reports/index.md', arg('file')))
        const newest = items.find(x => /^\d{4}-\d{2}-\d{2}-\d{4}$/.test(x.slug)) // the two-hourly reports, not the newsletter
        if (!newest) throw new Error('no report found in the list')
        if (arg('since') === newest.slug) { console.log(JSON.stringify({ new: false, id: newest.slug, slug: newest.slug })); process.exit(0) }
        const report = await get(`${SITE}reports/${newest.slug}/index.md`, arg('report'))
        const make = { three: draftThree, line: draftLine, full: draft }[arg('look') || 'full']
        if (!make) throw new Error(`unknown --look ${arg('look')}: three, line or full`)
        console.log(JSON.stringify(enrich(make(newest, report)), null, 2))
    } catch (e) { console.error('report-draft: ' + e.message); process.exit(1) }
}
