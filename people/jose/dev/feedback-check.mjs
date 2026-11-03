// feedback-check.mjs: the check every WS-74 option needs, offline and with no dependencies (dev@web-summit.jose,
// 3 November 2026; a prototype, not wired to anything). Plain ES module: it runs in a browser, in Node, and (pasted
// without the exports) in an n8n Code node.
//   check(raw, now)    -> { ok, reasons, entry }   one public submission: whitelist the fields, catch spam,
//                                                  take contact details out of the free text before anything is stored
//   boardFile(entries) -> markdown                 a board-ready summary: counts, and quotes only where the person
//                                                  agreed to be quoted anonymously
// What it cannot do: tell a person from a careful bot. The lane (or n8n) caps volume; a person reads before anything
// is published.

export const REACTIONS = ['love', 'like', 'not-for-me']
export const SHARE = ['yes', 'maybe', 'no']
export const ROLES = ['security', 'risk-or-compliance', 'builder', 'investor', 'press', 'other']
export const MAX_TEXT = 500
export const MIN_SECONDS = 3       // a person takes longer than this to read the form and answer
export const MAX_AGE_HOURS = 24    // a form left open longer is treated as stale

// what the site links to: /videos/ ids and page paths; anything else is not ours to be feedback about
const ABOUT = /^(video:[A-Za-z0-9-]{1,40}|page:[a-z0-9/_-]{1,80})$/

// contact details and links, replaced in free text: the repository and the site are public, forever
const SCRUB = [
    [/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[email removed]'],
    [/\b(?:https?:\/\/|www\.)\S+/gi, '[link removed]'],
    [/\b[a-z0-9-]+\.(?:com|net|org|io|ai|co|pt|uk|me|info|biz|xyz)\b(?:\/\S*)?/gi, '[link removed]'],
    [/(?:\+|00)?\d[\d\s().-]{7,}\d/g, m => /^\d{4}-\d{2}-\d{2}$/.test(m) ? m : '[number removed]'], // a date stays
    [/(^|\s)@[A-Za-z0-9_.]{2,30}\b/g, '$1[handle removed]'],
]
const INVISIBLE = new RegExp('[\\u0000-\\u0008\\u000B-\\u001F\\u007F\\u200B-\\u200F\\u2028-\\u202E\\uFEFF]', 'g') // control and invisible characters
export const scrub = text => {
    let t = String(text ?? '').normalize('NFC').replace(INVISIBLE, '')
    const before = t
    for (const [re, sub] of SCRUB) t = t.replace(re, sub)
    t = t.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
    return { text: t.length > MAX_TEXT ? t.slice(0, MAX_TEXT - 1) + '…' : t, removed: t !== before.trim() && /removed\]/.test(t) }
}

export function check(raw = {}, now = new Date()) {
    const reasons = [], spam = []
    // the honeypot: a field people never see (hidden with CSS), which form-filling bots fill in
    if (String(raw.website ?? '').trim()) spam.push('honeypot filled')
    const opened = Date.parse(raw.opened_at), secs = (now - opened) / 1000
    if (!Number.isFinite(secs)) spam.push('no form-open time')
    else if (secs < MIN_SECONDS) spam.push(`answered in ${secs.toFixed(1)} s`)
    else if (secs > MAX_AGE_HOURS * 3600) spam.push('form open for over a day')

    const about = String(raw.about ?? '')
    if (!ABOUT.test(about)) reasons.push('about is not one of our videos or pages')
    const reaction = REACTIONS.includes(raw.reaction) ? raw.reaction : null
    if (!reaction) reasons.push('reaction is missing')
    const share = SHARE.includes(raw.share) ? raw.share : null
    const role = ROLES.includes(raw.role) ? raw.role : null
    const change = scrub(raw.change)
    const links = (String(raw.change ?? '').match(/https?:\/\/|www\./gi) || []).length
    if (links >= 2) spam.push(`${links} links in the text`)
    const quote_ok = raw.quote_ok === true || raw.quote_ok === 'on' || raw.quote_ok === 'yes'

    const entry = {
        v: 1,
        about,
        reaction,
        share,
        role,
        change: change.text,
        quote_ok,
        scrubbed: change.removed,
        received_at: now.toISOString(),
        // nothing else is kept: no name, email, IP, user agent or free field the form did not ask for
    }
    return { ok: !reasons.length && !spam.length, spam: spam.length > 0, reasons: [...reasons, ...spam], entry }
}

// a board-ready file: front matter like board/WS-NN-*.md, counts per video or page, anonymous quotes only with consent
export function boardFile(entries, { id = 'WS-NN', title = 'Public feedback', date = new Date().toISOString().slice(0, 10) } = {}) {
    const good = entries.filter(e => e && e.v === 1 && ABOUT.test(e.about) && REACTIONS.includes(e.reaction))
    const by = {}
    for (const e of good) (by[e.about] ||= []).push(e)
    const n = (xs, k, v) => xs.filter(x => x[k] === v).length
    const out = [
        '---', `id: ${id}`, `title: ${title}, to ${date}`, 'area: content', 'for: silvio, jose', 'status: open', 'picked_by:', '---',
        `${good.length} answer${good.length === 1 ? '' : 's'} from the public form, read by a person before this file was committed. Contact details and links were removed before storing; quotes appear only where the person ticked "you may quote this anonymously".`, '',
    ]
    for (const about of Object.keys(by).sort()) {
        const xs = by[about]
        out.push(`## ${about}`, '', `- ${xs.length} answers: ${n(xs, 'reaction', 'love')} love it, ${n(xs, 'reaction', 'like')} like it, ${n(xs, 'reaction', 'not-for-me')} not for me.`,
            `- Would show it to someone: ${n(xs, 'share', 'yes')} yes, ${n(xs, 'share', 'maybe')} maybe, ${n(xs, 'share', 'no')} no.`)
        const roles = ROLES.map(r => [r, n(xs, 'role', r)]).filter(([, c]) => c).map(([r, c]) => `${r} ${c}`)
        if (roles.length) out.push(`- Who said they were: ${roles.join(', ')}.`)
        const quotes = xs.filter(x => x.quote_ok && x.change).map(x => `> ${x.change.replace(/\n+/g, ' ')}`)
        if (quotes.length) out.push('', 'What to change, in their words:', '', ...quotes.flatMap(q => [q, '']))
        out.push('')
    }
    return out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
}
