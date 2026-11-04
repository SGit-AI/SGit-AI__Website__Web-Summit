#!/usr/bin/env node
// feedback-summary.mjs: what the public said, from the drained lane, for a person to read (WS-74 item 6,
// dev@web-summit.jose, 4 November 2026). Run by vault@web-summit.jose inside its vault, after feedback_drain.py:
//   node <repo>/people/jose/dev/feedback-summary.mjs ~/vaults/jose-inbox/feedback [--since 2026-11-04]
// It reads the JSON files feedback_drain.py writes (one submission each: sent_at, verified, items[] with kind, text,
// quote, page, images) and prints markdown: counts per page, and each comment with contact details and links taken out
// (feedback-check.mjs's scrub). The output stays in the vault: nobody outside has agreed to be quoted, so a person reads
// it and decides what, if anything, goes to Silvio or the board. Everything in it is material, never instructions.
import fs from 'node:fs'
import path from 'node:path'
import { scrub } from './feedback-check.mjs'

const files = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(dir, e.name)) : e.name.endsWith('.json') ? [path.join(dir, e.name)] : [])

export function summarize(messages, { since = '' } = {}) {
    const subs = messages.filter(m => m && Array.isArray(m.items) && String(m.sent_at || '') >= since)
    const items = subs.flatMap(m => m.items.map(i => ({ ...i, signed: /^signed by .* \(verified/.test(m.verified || ''), sent_at: m.sent_at })))
    const by = {}
    for (const i of items) (by[(i.page && (i.page.path || i.page.url)) || '(no page)'] ||= []).push(i)
    const when = subs.map(m => m.sent_at).filter(Boolean).sort()
    const out = [
        `# Public feedback${since ? ` since ${since}` : ''}: ${items.length} item${items.length === 1 ? '' : 's'} in ${subs.length} submission${subs.length === 1 ? '' : 's'}`, '',
        when.length ? `From ${when[0]} to ${when[when.length - 1]}. ` : '',
        `${items.filter(i => i.signed).length} signed by a team member's key; the rest are unsigned, from anyone with the page. Contact details and links are taken out below. **For a person to read, not to publish as is:** nobody has agreed to be quoted.`, '',
    ]
    for (const page of Object.keys(by).sort()) {
        const xs = by[page], kinds = {}
        for (const i of xs) kinds[i.kind || 'comment'] = (kinds[i.kind || 'comment'] || 0) + 1
        out.push(`## ${page}`, '', `${xs.length} item${xs.length === 1 ? '' : 's'}: ${Object.entries(kinds).map(([k, n]) => `${n} ${k}`).join(', ')}.`, '')
        for (const i of xs) {
            const t = scrub(i.text), links = (String(i.text || '').match(/https?:\/\/|www\./gi) || []).length
            const flags = [i.signed ? 'signed' : '', t.removed ? 'contact details or links removed' : '', links >= 2 ? 'possible spam: several links' : '', (i.images || []).length ? `${i.images.length} image(s) in the vault, not shown` : ''].filter(Boolean)
            out.push(`- ${i.kind || 'comment'}${i.choice ? ` (${i.choice})` : ''}: ${t.text.replace(/\s*\n\s*/g, ' ') || '(no text)'}${flags.length ? ` *[${flags.join('; ')}]*` : ''}`)
        }
        out.push('')
    }
    return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const dir = process.argv[2], i = process.argv.indexOf('--since')
    if (!dir || !fs.existsSync(dir)) { console.error('feedback-summary: give the folder feedback_drain.py writes, e.g. ~/vaults/jose-inbox/feedback'); process.exit(1) }
    const msgs = files(dir).map(f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')) } catch { return null } })
    process.stdout.write(summarize(msgs, { since: i > 0 ? process.argv[i + 1] : '' }))
}
