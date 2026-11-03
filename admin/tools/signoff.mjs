#!/usr/bin/env node
// Official sign-off of a set of files (first: each person's merch print set on /print/), by the person, through their
// agent, on GitHub, signed with the agent's PKI key. Asked for by Dinis on 3 November 2026 ("we all have the ability to
// sign off, via our agents and GitHub plus our agents' signature, via PKI"). Written by procurement@web-summit.silvio.
//
//   node admin/tools/signoff.mjs sign --person <id> --by <agent> --said "<the person's own words>" \
//        [--decision approved|changes] [--note "what to change"] [--set print]
//        [--on-word-of dinis]   (only for Dinis's agents signing someone else's set on Dinis's word)
//     writes people/<id>/signoff/<set>.json: the decision, the person's words, the agent, the time, and the sha256 of
//     every file in the set, so a sign-off covers exactly those bytes. Then sign it with the agent's key:
//       node pki-agent.mjs sign people/<id>/signoff/<set>.json     (-> <set>.json.sig)
//     and commit both with `Agent: <agent>` and `Issue: WS-NN`. The agent's public key must be on data/keys.json.
//   node admin/tools/signoff.mjs verify [--person <id>] [--set print] [--json]
//     checks every sign-off: the signature against the key on data/keys.json, that the key's label names the agent who
//     signed, and that the files are still the files that were signed (a file changed after sign-off: "superseded").
//     Exit 1 if a signature is bad. Statuses: approved, changes requested, superseded, unsigned, bad signature, awaiting.
//
// A sign-off is the person's decision, never the agent's: --said is required, in the person's words. Rule: the person
// signs their own set; Dinis signs the shared designs (hoodie, card) and may sign for anyone on their word.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const SETS = { print: { files: id => path.join(ROOT, 'team/designer/print/files', id), page: '/print/' } }
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d }
const sha = b => crypto.createHash('sha256').update(b).digest('hex')
const people = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'data/team.json'), 'utf8')).members.filter(m => m.kind === 'human' && m.core)
const fileHashes = (set, id) => {
    const dir = SETS[set].files(id)
    if (!fs.existsSync(dir)) return null
    return Object.fromEntries(fs.readdirSync(dir).filter(f => !f.startsWith('.')).sort().map(f => [f, sha(fs.readFileSync(path.join(dir, f)))]))
}
// WS-116 (security@web-summit.dinis): an agent is <agent>@web-summit.<person>; a key belongs to the agent its label's
// first word names (or its `agent` field), exactly; an agent signs only for its own person, or it is Dinis's agent and
// the statement says it signs on Dinis's word (on_word_of: "dinis").
const personOf = agent => (/^[a-z0-9.-]+@web-summit\.([a-z0-9-]+)$/.exec(agent || '') || [])[1]
const keyAgent = k => k.agent || ((k.bundle && k.bundle.label) || k.label || '').trim().split(/\s+/)[0]
const mayBind = st => personOf(st.by) === st.person || (personOf(st.by) === 'dinis' && st.on_word_of === 'dinis')
const canonical = o => JSON.stringify(o, Object.keys(o).sort(), 2) + '\n'

function sign() {
    const set = arg('set', 'print'), person = arg('person'), by = arg('by'), said = arg('said')
    const decision = arg('decision', 'approved'), note = arg('note', ''), onWordOf = arg('on-word-of')
    if (!SETS[set]) fail(`unknown set ${set}`)
    if (!person || !by || !said) fail('sign needs --person, --by and --said (the person\'s own words)')
    if (!['approved', 'changes'].includes(decision)) fail('--decision is approved or changes')
    if (decision === 'changes' && !note) fail('--decision changes needs --note saying what to change')
    if (!personOf(by)) fail(`--by must be <agent>@web-summit.<person>, not ${by}`)
    const files = fileHashes(set, person)
    if (!files) fail(`no files for ${person} in set ${set}`)
    const st = { v: 1, set, page: SETS[set].page, person, decision, said, note, by, at: new Date().toISOString().replace(/\.\d+Z$/, 'Z'), files }
    if (onWordOf) st.on_word_of = onWordOf
    if (!mayBind(st)) fail(`${by} may not sign ${person}'s set: only ${person}'s own agents, or Dinis's with --on-word-of dinis`)
    const out = path.join(ROOT, 'people', person, 'signoff', set + '.json')
    fs.mkdirSync(path.dirname(out), { recursive: true })
    fs.writeFileSync(out, JSON.stringify(st, null, 2) + '\n')
    try { fs.unlinkSync(out + '.sig') } catch {}
    console.log(`written: ${path.relative(ROOT, out)} (${Object.keys(files).length} files, ${decision})`)
    console.log(`next: node pki-agent.mjs sign ${path.relative(ROOT, out)}   then commit both, with Agent: ${by}`)
}

export function check(set = 'print') {
    const keys = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/keys.json'), 'utf8')).keys
    return people().map(m => {
        const f = path.join(ROOT, 'people', m.id, 'signoff', set + '.json'), r = { person: m.id, name: m.name, set }
        if (!fs.existsSync(f)) return { ...r, status: 'awaiting' }
        const bytes = fs.readFileSync(f), st = JSON.parse(bytes)
        Object.assign(r, { decision: st.decision, said: st.said, note: st.note, by: st.by, at: st.at })
        if (!fs.existsSync(f + '.sig')) return { ...r, status: 'unsigned' }
        const sig = JSON.parse(fs.readFileSync(f + '.sig', 'utf8')), key = keys.find(k => k.bundle && k.bundle.signing_fingerprint === sig.fingerprint)
        r.fingerprint = sig.fingerprint
        if (!key) return { ...r, status: 'bad signature', why: `key ${sig.fingerprint} is not on data/keys.json` }
        r.key = key.id
        let ok = false
        try { ok = crypto.verify('sha256', bytes, { key: key.bundle.sign, dsaEncoding: 'ieee-p1363' }, Buffer.from(sig.signature, 'base64')) } catch {}
        if (!ok) return { ...r, status: 'bad signature', why: 'the signature does not verify' }
        if (keyAgent(key) !== st.by) return { ...r, status: 'bad signature', why: `key ${key.id} is ${keyAgent(key)}'s, not ${st.by}'s` }
        if (st.person !== m.id || !mayBind(st)) return { ...r, status: 'bad signature', why: `${st.by} may not sign ${m.id}'s set` }
        const now = fileHashes(set, m.id) || {}, changed = Object.keys({ ...now, ...st.files }).filter(k => now[k] !== st.files[k])
        if (changed.length) return { ...r, status: 'superseded', why: `changed since: ${changed.join(', ')}` }
        return { ...r, status: st.decision === 'approved' ? 'approved' : 'changes requested' }
    })
}

function verify() {
    const rows = check(arg('set', 'print')).filter(r => !arg('person') || r.person === arg('person'))
    if (process.argv.includes('--json')) console.log(JSON.stringify(rows, null, 2))
    else for (const r of rows) console.log(`${r.person.padEnd(8)} ${r.status.padEnd(18)} ${r.by ? `${r.by} ${r.at} ${r.fingerprint || ''}` : ''}${r.why ? '  (' + r.why + ')' : ''}`)
    if (rows.some(r => r.status === 'bad signature')) process.exit(1)
}
function fail(m) { console.error('signoff: ' + m); process.exit(2) }

const cmd = process.argv[2]
if (cmd === 'sign') sign()
else if (cmd === 'verify') verify()
else if (import.meta.url === `file://${process.argv[1]}`) fail('use: sign --person <id> --by <agent> --said "..." | verify')
