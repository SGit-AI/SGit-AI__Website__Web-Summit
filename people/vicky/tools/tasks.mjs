#!/usr/bin/env node
// tasks.mjs: the signature check for Vicky's signed task files (P6 as approved, step 1; standing answer 36 and update
// SA36-SIGN in people/vicky/decisions.md; the plan, people/vicky/plans/2026-11-11-p6-signed-messaging.md; security@'s
// review, people/vicky/reviews/security-p6.md). Built by dev@PrompTugal.vicky, 11 November 2026. Node only: no
// dependencies, no network, no keys or secrets of its own; it reads only the files it is given. Safe to publish
// (standing answer 35). Signing stays `node pki-agent.mjs sign <file>`, by each agent with its own key.
//
//   node people/vicky/tools/tasks.mjs verify <file> --fp <pinned signing fingerprint> [--keys <keys.json>] [--for <agent>] [--no-expiry]
//       Exit 0 only if all of these pass, in this order; otherwise exit 1 and one line saying why:
//       1. <file>.sig exists and names the pinned fingerprint;
//       2. a key in <keys.json> (default: data/keys.json of this repository) whose signing key HASHES to the pinned
//          fingerprint verifies the signature over the file's exact bytes. The fingerprint an entry claims is never
//          trusted: anyone who can push could add an entry that claims the pinned fingerprint with a key of their own;
//       3. unless --no-expiry: the file's front matter has `expires:` (an ISO time with its zone) and it is still in
//          the future by this machine's clock;
//       4. unless --no-expiry: no done file exists beside it (<id>.md -> <id>.done.md);
//       5. with --for <agent>: the front matter's `for:` names that agent.
//       Use --no-expiry for people/vicky/decisions.md (signed, never expires) and for a done file (the conductor
//       checks an agent's <id>.done.md against that agent's fingerprint).
//   node people/vicky/tools/tasks.mjs check-pointer "<message>"
//       Exit 0 only for exactly `Task: pull dev and read people/vicky/tasks/<id>.md.` or
//       `Done: people/vicky/tasks/<id>.done.md, commit <sha>.` (no other text, no extra spaces or lines).
//   node people/vicky/tools/tasks.mjs lint <file>
//       Exit 0 only if the task file has `id:` (matching its file name), `for:` and a valid `expires:`, and nothing
//       standing answer 35 forbids: no key-, token- or email-shaped strings, no phone numbers, no session or task ids,
//       and not the words CRM, shortlist or vault key.
//
// Exit codes: 0 pass, 1 refused, 2 wrong use. The one line printed never contains anything from a .sig but its
// fingerprint, and never a session id.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

// sgit's fingerprint of a public key: "sha256:" + the first 16 hex of SHA-256 over its DER SPKI (as pki-agent.mjs)
export const fingerprintOf = pem => 'sha256:' + crypto.createHash('sha256').update(crypto.createPublicKey(pem).export({ type: 'spki', format: 'der' })).digest('hex').slice(0, 16)
const FP = /^sha256:[0-9a-f]{16}$/

// the front matter: `key: value` lines between the first two `---` lines
export function frontMatter(text) {
    const m = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text)
    const out = {}
    if (m) for (const line of m[1].split(/\r?\n/)) { const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line); if (kv) out[kv[1]] = kv[2].replace(/^(["'])(.*)\1$/, '$2').trim() }
    return out
}
// an ISO time with its zone (Z or +hh:mm): nothing looser, so "tomorrow" or a time without a zone is refused
const parseTime = s => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/.test(String(s || '')) ? Date.parse(s) : NaN

export function verify(file, { fp, keys = path.join(ROOT, 'data/keys.json'), forAgent = null, noExpiry = false } = {}) {
    const no = why => ({ ok: false, why })
    if (!FP.test(String(fp || ''))) return no('no pinned fingerprint given (--fp sha256:<16 hex>)')
    let bytes, sig, list
    try { bytes = fs.readFileSync(file) } catch { return no('the file cannot be read') }
    try { sig = JSON.parse(fs.readFileSync(file + '.sig', 'utf8')) } catch { return no('no signature file (.sig) beside it, or it is not valid JSON') }
    if (!sig || sig.fingerprint !== fp) return no(`signed by ${FP.test(String(sig && sig.fingerprint)) ? sig.fingerprint : 'an unnamed key'}, not the pinned key ${fp}`)
    try { list = JSON.parse(fs.readFileSync(keys, 'utf8')).keys || [] } catch { return no('the keys file cannot be read') }
    // every key on file whose signing key itself hashes to the pinned fingerprint (normally exactly one)
    const pems = []
    for (const k of list) { const pem = k && k.bundle && k.bundle.sign; if (typeof pem !== 'string') continue; try { if (fingerprintOf(pem) === fp) pems.push(pem) } catch { } }
    if (!pems.length) return no(`no key on file hashes to the pinned fingerprint ${fp}`)
    let good = false
    for (const pem of pems) { try { if (crypto.verify('sha256', bytes, { key: pem, dsaEncoding: 'ieee-p1363' }, Buffer.from(String(sig.signature || ''), 'base64'))) good = true } catch { } }
    if (!good) return no('the signature does not verify: the file was changed after signing, or it was signed by another key')
    const meta = frontMatter(bytes.toString('utf8'))
    if (!noExpiry) {
        const t = parseTime(meta.expires)
        if (isNaN(t)) return no('no valid expires: in its front matter (an ISO time with its zone, for example 2026-11-11T23:00Z)')
        if (Date.now() >= t) return no(`expired at ${new Date(t).toISOString().slice(0, 16)}Z`)
        const done = file.replace(/\.md$/, '') + '.done.md'
        if (done !== file && fs.existsSync(done)) return no(`already done: ${path.basename(done)} exists`)
    }
    if (forAgent && meta.for !== forAgent) return no(`it is for ${meta.for || 'nobody named'}, not ${forAgent}`)
    return { ok: true, why: `signed by ${fp}${noExpiry ? '' : `, expires ${meta.expires}`}${forAgent ? `, for ${forAgent}` : ''}` }
}

// the two pointer messages, exactly; an id is lower-case letters, digits and hyphens
const TASK = /^Task: pull dev and read people\/vicky\/tasks\/([a-z0-9][a-z0-9-]{0,63})\.md\.$/
const DONE = /^Done: people\/vicky\/tasks\/([a-z0-9][a-z0-9-]{0,63})\.done\.md, commit ([0-9a-f]{7,40})\.$/
export function checkPointer(message) {
    const s = String(message), t = TASK.exec(s), d = DONE.exec(s)
    if (t) return { ok: true, why: `a Task pointer to people/vicky/tasks/${t[1]}.md` }
    if (d) return { ok: true, why: `a Done pointer to people/vicky/tasks/${d[1]}.done.md, commit ${d[2]}` }
    return { ok: false, why: 'not exactly a Task or Done pointer: refuse it and log the refusal (time, reason, file named; never a session id)' }
}

// what standing answer 35 forbids in a file that may be made public, by shape; the words are matched whole
export const FORBIDDEN = [
    ['a private key or certificate', /-----BEGIN [A-Z ]+-----/],
    ['a token', /\b(?:ghp_|gho_|ghs_|github_pat_|sk-|xox[abprs]-|AKIA|ASIA)[A-Za-z0-9_-]{8,}/],
    ['a session or scheduled-task id', /\b(?:session_|cse_|trig_)[A-Za-z0-9]{8,}/],
    // a run of 32+ letters and digits mixing upper case, lower case and digits (paths and links, with their /, do not match)
    ['a long secret-shaped string', /(?<![A-Za-z0-9+=_-])(?=[A-Za-z0-9+_-]*[A-Z])(?=[A-Za-z0-9+_-]*[a-z])(?=[A-Za-z0-9+_-]*\d)[A-Za-z0-9+_-]{32,}={0,2}(?![A-Za-z0-9+=_-])/],
    ['a long hex string', /\b[0-9a-f]{41,}\b/i],
    ['an email address', /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}\b/],
    ['a phone number', /(?:\+\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]\d{3,4}[\s.-]\d{3,4}\b|\+\d{9,14}\b/],
    ['the word CRM', /\bCRM\b/i],
    ['the word shortlist', /\bshort-?list/i],
    ['the words vault key', /\bvault[\s-]+keys?\b/i],
]
export function lint(file) {
    let text
    try { text = fs.readFileSync(file, 'utf8') } catch { return { ok: false, why: 'the file cannot be read' } }
    const meta = frontMatter(text), problems = []
    const id = path.basename(file).replace(/\.md$/, '')
    if (!meta.id) problems.push('no id:'); else if (meta.id !== id) problems.push(`id: ${meta.id} is not the file's name (${id})`)
    if (!meta.for) problems.push('no for:')
    if (isNaN(parseTime(meta.expires))) problems.push('no valid expires: (an ISO time with its zone)')
    for (const [what, re] of FORBIDDEN) if (re.test(text)) problems.push(`it holds ${what}`)
    return problems.length ? { ok: false, why: problems.join('; ') } : { ok: true, why: 'safe to publish by shape, with id, for and expires' }
}

// the command line
function main(argv) {
    const [cmd, ...rest] = argv
    const opt = n => { const i = rest.indexOf(n); return i >= 0 ? rest[i + 1] : undefined }
    const flags = new Set(['--fp', '--keys', '--for']), files = rest.filter((a, i) => !a.startsWith('--') && !flags.has(rest[i - 1]))
    const out = (r, label) => { console.log(`${r.ok ? 'OK' : 'REFUSED'} ${label}: ${r.why}`); return r.ok ? 0 : 1 }
    if (cmd === 'verify' && files.length === 1) return out(verify(files[0], { fp: opt('--fp'), keys: opt('--keys') || undefined, forAgent: opt('--for') || null, noExpiry: rest.includes('--no-expiry') }), files[0])
    if (cmd === 'check-pointer' && rest.length === 1) return out(checkPointer(rest[0]), 'message')
    if (cmd === 'lint' && files.length === 1) return out(lint(files[0]), files[0])
    console.error('use: tasks.mjs verify <file> --fp sha256:<16 hex> [--keys <keys.json>] [--for <agent>] [--no-expiry] | check-pointer "<message>" | lint <file>')
    return 2
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main(process.argv.slice(2)))
