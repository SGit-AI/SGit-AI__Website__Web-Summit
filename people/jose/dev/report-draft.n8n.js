// report-draft.n8n.js: report-draft.mjs for an n8n Code node, when Execute Command is off (WS-39).
// Paste the whole file into a Code node (JavaScript, mode "Run Once for All Items"). Network only, no fs.
// Input (optional), from the item before it: { "since": "<id of the last draft sent>", "look": "full" | "three" | "line" }
// Output: one item, the same JSON as `node report-draft.mjs` (id, created_at, source_url, text_whatsapp, text_slack, ...),
// or { new: false, id } when the newest report is `since`. It drafts only: the next node sends, if Jose's flow says so.
// Kept equal to report-draft.mjs by report-draft.test.mjs: change both, then run the test.

const SITE = 'https://web-summit.sgit.ai/'
const MAX = 700, WA_MAX = 1000
const STANDUPS = '13:00 and 18:00' // data/channels.json, "Stand-ups, 13:00 and 18:00"
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// n8n's own HTTP helper when the Code node has it, otherwise the runtime's fetch
const helpers = (typeof this !== 'undefined' && this && this.helpers) || {}
const get = async url => {
    if (typeof helpers.httpRequest === 'function') return String(await helpers.httpRequest({ method: 'GET', url, json: false }))
    const r = await fetch(url)
    if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`)
    return r.text()
}

const parseIndex = md => [...md.matchAll(/^- \[(.+?)\]\(([^)/]+)\/index\.html\)(?::\s*(.*))?$/gm)].map(m => ({ title: m[1], slug: m[2], summary: m[3] || '' }))
const points = md => {
    const sec = md.split(/^## /m).find(s => /^What happened/.test(s)) || ''
    return [...sec.matchAll(/^\d+\.\s+\*\*(.+?)\*\*/gm)].map(m => m[1].trim())
}
const when = slug => {
    const [, y, mo, d, hh, mm] = slug.match(/^(\d{4})-(\d{2})-(\d{2})-(\d{2})(\d{2})$/) || []
    if (!y) return { day: '', time: '' }
    const dt = new Date(Date.UTC(+y, +mo - 1, +d))
    return { day: `${DAYS[dt.getUTCDay()]} ${+d} ${MONTHS[+mo - 1]}`, time: `${hh}:${mm}` }
}
const lead = p => p.replace(/[.:;,]+$/, '')

const draftThree = (item, reportMd = '') => {
    const link = `${SITE}reports/${item.slug}/`, { day, time } = when(item.slug), ps = points(reportMd)
    const lines = [`*RiskMandate team · ${time} report*`, `${day} · stand-ups ${STANDUPS}`, '', ...ps.slice(0, 3).map(p => `▸ *${lead(p)}*`), '']
    lines.push(ps.length > 3 ? `+${ps.length - 3} more: ${link}` : link)
    return { new: true, slug: item.slug, title: item.title, link, look: 'three', text: lines.join('\n') }
}
const draftLine = (item, reportMd = '') => {
    const link = `${SITE}reports/${item.slug}/`, { time } = when(item.slug), ps = points(reportMd).map(lead)
    let body = ''
    for (const p of ps) { const next = body ? `${body}; ${p.replace(/^(The|A|An) /, w => w.toLowerCase())}` : p; if (next.length > 160) break; body = next }
    return { new: true, slug: item.slug, title: item.title, link, look: 'line', text: `*${time}* · ${body || item.summary}.\n${link}` }
}
const draft = (item, reportMd = '') => {
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

const slackEscape = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const forWhatsApp = (text, link) => {
    if (text.length <= WA_MAX) return text
    const lines = text.split('\n').filter(l => !l.includes(link)), tail = `\n\n${link}`
    while (lines.length && (lines.join('\n') + tail).length > WA_MAX) lines.pop()
    return (lines.join('\n').trimEnd() + tail).slice(0, WA_MAX)
}
const forSlack = (text, link) => slackEscape(text)
    .replace(/^\+(\d+) more: (\S+)$/m, (_, n, u) => `<${u}|+${n} more in the full report>`)
    .replace(new RegExp(`(^|\\s)${link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=\\s|$)`, 'g'), (_, sp) => `${sp}<${link}|Read the report>`)
const enrich = (d, now = new Date()) => {
    const text_whatsapp = forWhatsApp(d.text, d.link)
    return { id: d.slug, created_at: now.toISOString(), source_url: `${SITE}reports/${d.slug}/index.md`, ...d, text_whatsapp, text_slack: forSlack(text_whatsapp, d.link) }
}

const input = (typeof $input !== 'undefined' && $input.first() && $input.first().json) || {}
const items = parseIndex(await get(SITE + 'reports/index.md'))
const newest = items.find(x => /^\d{4}-\d{2}-\d{2}-\d{4}$/.test(x.slug)) // the two-hourly reports, not the newsletter
if (!newest) throw new Error('report-draft: no report found in the list')
if (input.since === newest.slug) return [{ json: { new: false, id: newest.slug, slug: newest.slug } }]
const make = { three: draftThree, line: draftLine, full: draft }[input.look || 'full']
if (!make) throw new Error(`report-draft: unknown look ${input.look}: three, line or full`)
return [{ json: enrich(make(newest, await get(`${SITE}reports/${newest.slug}/index.md`))) }]
