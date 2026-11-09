#!/usr/bin/env node
// check-scenario.mjs: is one stand-demo scenario safe, and in the format Angelo's runner reads?
// Usage: node people/indi/demo/check-scenario.mjs [--builtin] <scenario.json>
//   --builtin: one of Angelo's own scenarios, not a visitor's: its format is checked, not the visitor limits (8 files,
//   2 KB each), as conductor@web-summit.indi decided on 9 November.
// Prints OK (exit 0) or every failure, one per line (exit 1). No dependencies (Node 18+). WS-137, dev@web-summit.indi.
//
// The rules (people/indi/demo/brief-dev.md):
//   1. scenario.title, rule, task, need and files are present, as stories/reach/scenarios.mjs expects
//   2. every file in need exists in files
//   3. every address is written name{AT}domain and its domain ends in .example; no literal addresses
//   4. secrets are placeholders only: a .env holds exactly {ENV}; {KEY} and {DBPW} (Angelo's per-run fake canaries) are
//      the only other placeholders; nothing that looks like a real key
//   5. at most eight files, none bigger than 2 KB
//   6. company.sources has a URL for every public fact
//   7. no em-dashes, anywhere in the file
import fs from 'node:fs'

const MAX_FILES = 8, MAX_BYTES = 2048
const KEYLIKE = [
    [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'a private key block'],
    [/\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{16,}/, 'an API key (sk-...)'],
    [/\bAKIA[0-9A-Z]{16}\b/, 'an AWS access key id'],
    [/\bgh[pousr]_[A-Za-z0-9]{20,}/, 'a GitHub token'],
    [/\bxox[abposr]-[A-Za-z0-9-]{10,}/, 'a Slack token'],
    [/\bsgit_public_read_[0-9a-f]{64}\b/, 'a vault read key'],
    [/\b[A-Za-z0-9+/]{40,}={0,2}(?![A-Za-z0-9+/=])/, 'a long secret-looking string'],
]
const isUrl = s => typeof s === 'string' && /^https?:\/\/[^\s]+\.[^\s]+/.test(s)

export function check(doc, { builtin = false } = {}) {
    const f = []
    if (!doc || typeof doc !== 'object') return ['not a JSON object']
    const s = doc.scenario
    // 1. Angelo's shape
    if (!s || typeof s !== 'object') f.push('no scenario object')
    else {
        for (const k of ['title', 'rule', 'task']) if (typeof s[k] !== 'string' || !s[k].trim()) f.push(`scenario.${k} is missing or empty`)
        if (!Array.isArray(s.need)) f.push('scenario.need is missing or not a list')
        if (!s.files || typeof s.files !== 'object' || Array.isArray(s.files)) f.push('scenario.files is missing or not an object')
    }
    const files = s && s.files && typeof s.files === 'object' && !Array.isArray(s.files) ? s.files : {}
    const names = Object.keys(files)
    for (const n of names) if (typeof files[n] !== 'string') f.push(`file ${n}: content is not text`)
    // 2. need inside files
    for (const n of Array.isArray(s?.need) ? s.need : []) if (!(n in files)) f.push(`need lists ${n}, which is not in files`)
    // 5. size
    if (!builtin && names.length > MAX_FILES) f.push(`${names.length} files: at most ${MAX_FILES}`)
    if (!builtin) for (const n of names) if (typeof files[n] === 'string' && Buffer.byteLength(files[n]) > MAX_BYTES) f.push(`file ${n} is ${Buffer.byteLength(files[n])} bytes: at most ${MAX_BYTES}`)
    // 3 and 4: every text the runner turns into the world (the task and the files)
    const texts = [['scenario.task', s?.task], ...names.map(n => [`file ${n}`, files[n]])].filter(([, t]) => typeof t === 'string')
    for (const [where, t] of texts) {
        for (const m of t.matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g)) f.push(`${where}: a literal address (${m[0]}); write name{AT}domain.example`)
        for (const m of t.matchAll(/[A-Za-z0-9._%+-]*\{AT\}([A-Za-z0-9.-]+)/g)) if (!/\.example$/.test(m[1])) f.push(`${where}: address domain ${m[1]} does not end in .example`)
        for (const m of t.matchAll(/\{([A-Z]+)\}/g)) if (!['AT', 'ENV', 'KEY', 'DBPW'].includes(m[1])) f.push(`${where}: unknown placeholder {${m[1]}}`)
        for (const [re, what] of KEYLIKE) if (re.test(t.replace(/\{[A-Z]+\}/g, ''))) f.push(`${where}: looks like ${what}; use {ENV}`)
    }
    for (const n of names) if (/(^|\/)\.env(\.|$)/.test(n) && files[n] !== '{ENV}') f.push(`file ${n} must hold exactly {ENV}`)
    // 6. sources for every public fact
    const c = doc.company || {}, facts = Array.isArray(c.public_facts) ? c.public_facts : [], srcs = Array.isArray(c.sources) ? c.sources : []
    if (!('company' in doc)) f.push('no company object')
    if (c.public_facts !== undefined && !Array.isArray(c.public_facts)) f.push('company.public_facts is not a list')
    const srcUrl = x => isUrl(x) ? x : (x && typeof x === 'object' ? [x.url, x.source, x.href].find(isUrl) : undefined)
    srcs.forEach((x, i) => { if (!srcUrl(x)) f.push(`company.sources[${i}] has no URL`) })
    facts.forEach((x, i) => {
        const own = x && typeof x === 'object' ? srcUrl(x) : undefined
        if (!own && !srcUrl(srcs[i])) f.push(`company.public_facts[${i}] has no source URL`)
    })
    // 7. em-dashes, anywhere
    const raw = JSON.stringify(doc)
    if (raw.includes('—')) f.push(`${(raw.match(/—/g) || []).length} em-dash(es): none allowed`)
    return f
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(new URL(import.meta.url).pathname)) {
    const args = process.argv.slice(2), builtin = args.includes('--builtin'), file = args.find(a => !a.startsWith('--'))
    if (!file) { console.error('usage: node check-scenario.mjs [--builtin] <scenario.json>'); process.exit(2) }
    let doc
    try { doc = JSON.parse(fs.readFileSync(file, 'utf8')) } catch (e) { console.log(`FAIL ${file}: not readable JSON (${e.message})`); process.exit(1) }
    const f = check(doc, { builtin })
    if (!f.length) { console.log(`OK ${file}`); process.exit(0) }
    for (const x of f) console.log(`FAIL ${x}`)
    process.exit(1)
}
