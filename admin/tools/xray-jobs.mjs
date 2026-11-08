#!/usr/bin/env node
// The X-ray requests from the booth as jobs (WS-194, dev@web-summit.silvio, 8 November 2026, at Silvio's word), for
// xray@web-summit.dinis to keep at its wake. One list, data/xray/jobs/index.json, read by /xray/status/.
//   node admin/tools/xray-jobs.mjs add <drained.json> [...]    one job per verified request (feedback_drain.py's output)
//   node admin/tools/xray-jobs.mjs set <id> <state> [--slug s] [--note "one line"]
//   node admin/tools/xray-jobs.mjs list
// States: queued, running, ready, failed, refused. A drained file is added only if feedback_drain.py verified a team
// signature on it and its item is an xray-request; a subject that looks like an email, a phone number or a link is
// added as refused. Who requested it is never written: the list is public. Prints counts and ids only.
import fs from 'fs'
import path from 'path'
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const F = path.join(ROOT, 'data/xray/jobs/index.json')
const STATES = ['queued', 'running', 'ready', 'failed', 'refused']
const now = () => new Date().toISOString().replace(/\.\d+Z$/, 'Z')
const fail = m => { console.error('xray-jobs: ' + m); process.exit(1) }
const read = () => fs.existsSync(F) ? JSON.parse(fs.readFileSync(F, 'utf8')) : { about: 'The X-ray requests from the booth (WS-194): one job per request, kept by xray@web-summit.dinis with admin/tools/xray-jobs.mjs, shown on /xray/status/. Public: subjects are companies, use cases or industries; who requested is not listed.', updated: null, jobs: [] }
const write = j => { j.updated = now(); fs.mkdirSync(path.dirname(F), { recursive: true }); fs.writeFileSync(F, JSON.stringify(j, null, 2) + '\n') }
const opt = k => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : undefined }
const [cmd, ...rest] = process.argv.slice(2).filter((a, i, all) => !a.startsWith('--') && !(i > 0 && all[i - 1].startsWith('--')))
const j = read()
if (cmd === 'add') {
    let added = 0, skipped = 0
    for (const f of rest) {
        const m = JSON.parse(fs.readFileSync(f, 'utf8'))
        const verified = String(m.verified || '').startsWith('signed by ')   // feedback_drain.py's verify(): a person's signature, checked
        const items = Array.isArray(m.items) ? m.items : []
        for (const it of items.filter(x => x && x.kind === 'xray-request')) {
            if (!verified) { skipped++; continue }
            if (j.jobs.some(x => x.id === it.id)) { skipped++; continue }
            const subject = String(it.subject || '').replace(/\s+/g, ' ').trim().slice(0, 80)
            const bad = !subject || /@|https?:|www\.|\d[\d\s().+-]{6,}/i.test(subject)
            j.jobs.push({ id: String(it.id), subject: bad ? '(refused)' : subject, state: bad ? 'refused' : 'queued', requested_at: it.at || now(), by_booth: !!it.by_booth, ...(bad ? { note: 'not a company, use case or industry' } : {}) })
            added++
        }
    }
    write(j); console.log(`xray-jobs: ${added} added, ${skipped} skipped (unverified, duplicate or not a request)`)
} else if (cmd === 'set') {
    const [id, state] = rest
    if (!STATES.includes(state)) fail(`state must be one of ${STATES.join(', ')}`)
    const x = j.jobs.find(x => x.id === id) || fail(`no job ${id}`)
    x.state = state
    if (state === 'running' && !x.started_at) x.started_at = now()
    if (state === 'ready') { x.ready_at = now(); const s = opt('slug'); if (!s || !/^[a-z0-9-]+$/.test(s)) fail('ready needs --slug <the published /xray/<slug>/>'); x.slug = s }
    if (opt('note') !== undefined) x.note = String(opt('note')).slice(0, 140)
    write(j); console.log(`xray-jobs: ${id} is ${state}`)
} else if (cmd === 'list') {
    for (const x of j.jobs) console.log(`${x.id}\t${x.state}\t${x.subject}`)
    console.log(`xray-jobs: ${j.jobs.length} jobs`)
} else fail('usage: add <drained.json> ... | set <id> <state> [--slug s] [--note n] | list')
