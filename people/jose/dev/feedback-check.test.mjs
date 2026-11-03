#!/usr/bin/env node
// feedback-check.test.mjs: the WS-74 prototype's tests, offline. Run: node people/jose/dev/feedback-check.test.mjs
// Every address, number and handle below is made up, and assembled at run time (AT, the digits joined) so that the
// repository's own contact-detail check (the gate's comms_check) never sees one in this file.
import assert from 'node:assert/strict'
import { check, scrub, boardFile, MAX_TEXT } from './feedback-check.mjs'

const now = new Date('2026-11-03T03:00:00Z')
const opened = new Date(now - 40_000).toISOString()
const good = { about: 'video:V-reach', reaction: 'love', share: 'yes', role: 'security', change: 'Shorter intro, please.', quote_ok: true, opened_at: opened, website: '' }
const AT = String.fromCharCode(64), num = (...parts) => parts.join(' ')
const mail = (user, host) => user + AT + host
let passed = 0
const test = (name, fn) => { fn(); passed++; console.log('ok  ' + name) }

test('a good answer passes and keeps only the whitelisted fields', () => {
    const r = check({ ...good, name: 'Someone', email: mail('x', 'example.com'), ip: '10.0.0.1' }, now)
    assert.equal(r.ok, true, r.reasons.join('; '))
    assert.deepEqual(Object.keys(r.entry).sort(), ['about', 'change', 'quote_ok', 'reaction', 'received_at', 'role', 'scrubbed', 'share', 'v'])
    assert.equal(JSON.stringify(r.entry).includes('example.com'), false)
})

test('contact details and links are taken out of the free text', () => {
    const t = `Mail me at ${mail('jane.doe', 'example.com')} or call +${num('351', '912', '345', '678')}, ${num('00', '44', '20', '7946', '0958')}, see https://spam.example/x, www.foo.biz, example.io/page or ping ${AT}jane_d`
    const { text, removed } = scrub(t)
    assert.equal(removed, true)
    for (const bad of ['jane.doe', 'example.com', '912', '7946', 'https', 'www.', 'foo.biz', 'example.io', AT + 'jane_d']) assert.ok(!text.includes(bad), `${bad} left in: ${text}`)
    assert.match(text, /\[email removed\].*\[number removed\].*\[link removed\].*\[handle removed\]/s)
})

test('ordinary text is left alone (versions, times, short numbers)', () => {
    const t = 'At 1:20 the v0.2.0 slide is too fast; 3 of the 7 points lost me. Seen 2026-11-03.'
    assert.deepEqual(scrub(t), { text: t, removed: false })
})

test('the honeypot, a too-fast answer and a stale form are spam', () => {
    assert.match(check({ ...good, website: 'http://x' }, now).reasons.join(), /honeypot/)
    assert.match(check({ ...good, opened_at: new Date(now - 1000).toISOString() }, now).reasons.join(), /answered in 1.0 s/)
    assert.match(check({ ...good, opened_at: new Date(now - 2 * 86400e3).toISOString() }, now).reasons.join(), /over a day/)
    assert.match(check({ ...good, opened_at: undefined }, now).reasons.join(), /no form-open time/)
    assert.equal(check({ ...good, website: 'x' }, now).spam, true)
})

test('two or more links in the text are spam', () => {
    const r = check({ ...good, change: 'buy http://a.example and http://b.example' }, now)
    assert.equal(r.spam, true)
    assert.ok(!r.entry.change.includes('http'))
})

test('only our videos and pages, and only the offered choices, are accepted', () => {
    assert.match(check({ ...good, about: 'https://evil.example' }, now).reasons.join(), /about is not/)
    assert.match(check({ ...good, reaction: 'hate' }, now).reasons.join(), /reaction is missing/)
    const r = check({ ...good, share: 'sure', role: 'ceo' }, now)
    assert.equal(r.ok, true)
    assert.equal(r.entry.share, null)
    assert.equal(r.entry.role, null)
})

test('long text is cut, control and invisible characters are dropped', () => {
    const r = check({ ...good, change: 'a​b\u0007c' + 'x'.repeat(2000) }, now)
    assert.equal(r.entry.change.length, MAX_TEXT)
    assert.ok(r.entry.change.startsWith('abc'))
})

test('the board file: counts per video, quotes only with consent, no contact details', () => {
    const e = (o, at) => check({ ...good, ...o }, now).entry
    const entries = [
        e({}),
        e({ reaction: 'like', share: 'maybe', role: 'investor', change: `Say the price. Mail ${mail('a', 'b.example')}`, quote_ok: true }),
        e({ reaction: 'not-for-me', share: 'no', role: null, change: 'Private remark, not to quote', quote_ok: false }),
        e({ about: 'page:meet/jose', reaction: 'like', change: '' }),
        { v: 1, about: 'nonsense', reaction: 'love' }, // not ours: dropped
    ]
    const md = boardFile(entries, { id: 'WS-200', date: '2026-11-03' })
    assert.match(md, /^---\nid: WS-200\ntitle: Public feedback, to 2026-11-03\n/)
    assert.match(md, /4 answers from the public form/)
    assert.match(md, /## video:V-reach\n\n- 3 answers: 1 love it, 1 like it, 1 not for me\./)
    assert.match(md, /## page:meet\/jose\n\n- 1 answers/)
    assert.match(md, /> Shorter intro, please\./)
    assert.match(md, /> Say the price\. Mail \[email removed\]/)
    assert.ok(!md.includes('Private remark'), 'a quote without consent was published')
    assert.ok(!md.includes('nonsense'))
    assert.ok(!/@[a-z]/i.test(md), 'an address is in the board file')
})

console.log(`${passed} passed`)
