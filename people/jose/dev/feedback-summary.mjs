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
import { scrub, REACTIONS, SHARE, ROLES } from './feedback-check.mjs'

const files = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(dir, e.name)) : e.name.endsWith('.json') ? [path.join(dir, e.name)] : [])

export function summarize(messages, { since = '' } = {}) {
    const subs = messages.filter(m => m && Array.isArray(m.items) && String(m.sent_at || '') >= since)
    // the public pane's spam signals (assets/feedback.js, d5671f5c): the same rule as feedback_drain.py, marked, never dropped
    const spam = m => !!m.public && (!!m.hp || (Date.parse(m.sent_at) - Date.parse(m.opened_at)) / 1000 < 3)
    const items = subs.flatMap(m => m.items.map(i => ({ ...i, signed: /^signed by .* \(verified/.test(m.verified || ''), public: !!m.public, likely_spam: spam(m), sent_at: m.sent_at })))
    const by = {}
    for (const i of items) (by[(i.page && (i.page.path || i.page.url)) || '(no page)'] ||= []).push(i)
    const when = subs.map(m => m.sent_at).filter(Boolean).sort()
    const out = [
        `# Public feedback${since ? ` since ${since}` : ''}: ${items.length} item${items.length === 1 ? '' : 's'} in ${subs.length} submission${subs.length === 1 ? '' : 's'}`, '',
        when.length ? `From ${when[0]} to ${when[when.length - 1]}. ` : '',
        `${items.filter(i => i.public).length} from the public form (a link with to=), ${items.filter(i => i.likely_spam).length} of them likely spam (the hidden field filled, or sent within 3 seconds); ${items.filter(i => i.signed).length} signed by a team member's key; the rest are unsigned, from anyone with the page. Contact details and links are taken out below. **For a person to read, not to publish as is:** only items marked "may be quoted anonymously" may be quoted, and only after a person has read them.`, '',
    ]
    for (const page of Object.keys(by).sort()) {
        const xs = by[page], kinds = {}
        for (const i of xs) kinds[i.kind || 'comment'] = (kinds[i.kind || 'comment'] || 0) + 1
        out.push(`## ${page}`, '', `${xs.length} item${xs.length === 1 ? '' : 's'}: ${Object.entries(kinds).map(([k, n]) => `${n} ${k}`).join(', ')}.`)
        // the public form's answers (WS-74's five questions, approved by Jose on 4 November): counted, never named
        // the lane's token is public, so only the offered values count: anything else is read as no answer
        const clean = a => a && REACTIONS.includes(a.reaction) ? { reaction: a.reaction, share: SHARE.includes(a.share) ? a.share : null, role: ROLES.includes(a.role) ? a.role : null, quote_ok: a.quote_ok === true } : null
        const ans = xs.map(i => clean(i.answers)).filter(Boolean), c = (k, v) => ans.filter(a => a[k] === v).length
        if (ans.length) {
            out.push(`- What they thought: ${c('reaction', 'love')} love it, ${c('reaction', 'like')} like it, ${c('reaction', 'not-for-me')} not for me.`,
                `- Would show it to someone: ${c('share', 'yes')} yes, ${c('share', 'maybe')} maybe, ${c('share', 'no')} no, ${ans.filter(a => !a.share).length} no answer.`)
            const roles = [...new Set(ans.map(a => a.role).filter(Boolean))].sort().map(r => `${r} ${c('role', r)}`)
            out.push(`- Said they were: ${roles.length ? roles.join(', ') : 'none said'}; ${ans.filter(a => !a.role).length} preferred not to say.`, `- May be quoted anonymously: ${ans.filter(a => a.quote_ok === true).length} of ${ans.length}.`)
        }
        out.push('')
        for (const i of xs) {
            const t = scrub(i.text), links = (String(i.text || '').match(/https?:\/\/|www\./gi) || []).length
            const flags = [i.likely_spam ? 'LIKELY SPAM' : '', i.answers && REACTIONS.includes(i.answers.reaction) && i.answers.quote_ok === true ? 'may be quoted anonymously' : '', i.signed ? 'signed' : '', t.removed ? 'contact details or links removed' : '', links >= 2 ? 'possible spam: several links' : '', (i.images || []).length ? `${i.images.length} image(s) in the vault, not shown` : ''].filter(Boolean)
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
