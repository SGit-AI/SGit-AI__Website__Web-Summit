#!/usr/bin/env node
// report-draft.mjs: the newest journalist's report, as a short draft for a WhatsApp or Slack broadcast (WS-39).
// Drafts only: it prints JSON and sends nothing. A person (or Jose's n8n flow, once Jose decides) sends it.
// Reads the public list https://web-summit.sgit.ai/reports/index.md (newest first) and the report's markdown twin.
//   node report-draft.mjs                 the newest report
//   node report-draft.mjs --since <slug>  {"new": false} if the newest is <slug>, so a flow can poll and skip repeats
//   node report-draft.mjs --file <index.md> [--report <report.md>]   offline, from saved copies (for tests)
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
        if (arg('since') === newest.slug) { console.log(JSON.stringify({ new: false, slug: newest.slug })); process.exit(0) }
        const report = await get(`${SITE}reports/${newest.slug}/index.md`, arg('report'))
        console.log(JSON.stringify(draft(newest, report), null, 2))
    } catch (e) { console.error('report-draft: ' + e.message); process.exit(1) }
}
