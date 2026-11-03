#!/usr/bin/env node
// Audit a vault before its read key is published (WS-128). A published read key reads every commit, so
// every revision is scanned, not only the files on disk. Refuses anything shaped like a secret or a contact detail,
// with the gate's own key shapes (admin/build/secrets.cjs) plus the short-id vault key the gate misses (WS-122).
// It prints only WHERE (revision, file, line, which rule), never what it found, so its output is safe to keep.
//
//   node admin/tools/vault-audit.mjs <vault dir>              every revision (sgit history log) and the working files
//   node admin/tools/vault-audit.mjs --files <dir>            only the files on disk (no sgit needed)
//   node admin/tools/vault-audit.mjs --self-test              the rules against built-in samples
// Options: --revs <id,id>  scan these revisions instead of the whole history; --json  machine-readable result.
// Exit 0: clean. Exit 1: something found (nothing may be published). Exit 2: the audit could not run (treat as found).
//
// Revisions are read with `sgit history log --json` and `sgit file grep --text -n -e '^' <rev>` (the method
// vault@web-summit.angelo used on 3 November, sgit 0.27; `sgit cat` takes no revision). The vault's own key is not
// compared here: that needs `sgit vault show-key`, which auto mode rightly refuses. The key shapes catch it anyway.
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import { createRequire } from 'module'
const secrets = createRequire(import.meta.url)('../build/secrets.cjs')

const r = (c, n) => c.repeat(n)
const RULES = [
    ...secrets.KEY_RULES.map(([re, what]) => [re, what]),
    // WS-122: <passphrase>:<vault id> with today's short ids (8 to 12 lowercase characters)
    [/(?<![A-Za-z0-9_-])[A-Za-z0-9]{20,40}:[a-z0-9]{8,12}(?![A-Za-z0-9_-])/, 'a vault key (passphrase:vault id)'],
    [/\b(append_token|delete_auth|access_token)\b["']?\s*[:=]\s*["']?[A-Za-z0-9_-]{16,}/i, 'a token assignment'],
    [/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}/, 'an email address', m => /@web-summit\.[a-z0-9-]+$|noreply@|@example\.(com|org)$/.test(m)],
    // bounded on both sides, so a run of hex (a read key, a hash) is never read as a number
    [/(?<![A-Za-z0-9_])(?:\+|00)\d{1,3}[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}(?![A-Za-z0-9_])/, 'a phone number'],
]
const hitsIn = line => RULES.filter(([re, , ok]) => { const m = re.exec(line); return m && !(ok && ok(m[0])) }).map(([, what]) => what)

const SAMPLES = {
    found: ['sgit_private_' + 'vault_Ab1x', r('a', 24) + ':' + 'ucvg2pkx', '-----BEGIN ' + 'PRIVATE KEY-----', 'ghp' + '_' + r('c', 36), 'append_token' + '": "' + r('f', 32), 'someone' + '@' + 'company.com', '+351 912 345 678'],
    clean: ['sgit_public_read_' + r('0', 64) + ':ucvg2pkv', 'sgit_public_read_3fbcdfae' + '0015735922' + r('e', 46) + ':ucvg2pkv', 'sha256:' + '00351912345678' + 'ab', 'vault@web-summit.angelo', 'sha256:db7f79fdd87e030a', 'see https://sgit.ai/docs/credentials.md', '2026-11-03 18:00', 'no private-prefixed credential'],
}
function selfTest() {
    const errors = []
    for (const s of SAMPLES.found) if (!hitsIn(s).length) errors.push(`not caught: sample ${SAMPLES.found.indexOf(s) + 1}`)
    for (const s of SAMPLES.clean) if (hitsIn(s).length) errors.push(`flagged, but public: "${s.slice(0, 24)}"`)
    return errors.concat(secrets.selfTest())
}

const flags = {}, args = []
for (let a = process.argv.slice(2), i = 0; i < a.length; i++) a[i].startsWith('--') ? (flags[a[i].slice(2)] = a[i + 1] && !a[i + 1].startsWith('--') && ['revs', 'files'].includes(a[i].slice(2)) ? a[++i] : true) : args.push(a[i])
const out = (result, code) => { console.log(flags.json ? JSON.stringify(result, null, 2) : result.lines.join('\n')); process.exit(code) }

if (flags['self-test']) { const e = selfTest(); out({ ok: !e.length, lines: e.length ? e : ['vault-audit: self-test OK'] }, e.length ? 1 : 0) }

const findings = [], scanned = { revisions: 0, files: 0, lines: 0 }
const scanText = (where, text) => text.split('\n').forEach((line, i) => { scanned.lines++; for (const what of hitsIn(line)) findings.push({ ...where, line: i + 1, rule: what }) })
function walk(d, base = d, acc = []) { for (const n of fs.readdirSync(d)) { if (n === '.sg_vault' || n === '.git') continue; const p = path.join(d, n); fs.statSync(p).isDirectory() ? walk(p, base, acc) : acc.push(path.relative(base, p)) } return acc }
function scanFiles(dir) {
    for (const f of walk(dir)) { if (secrets.BINARY.test(f)) continue; scanned.files++; scanText({ rev: 'working', file: f }, fs.readFileSync(path.join(dir, f), 'utf8')) }
}
const sgit = (dir, argv) => execFileSync('sgit', argv, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 << 20 })
function revisions(dir) {
    if (flags.revs) return String(flags.revs).split(',').map(s => s.trim()).filter(Boolean)
    const log = sgit(dir, ['history', 'log', '--json'])
    let ids = []
    try { const j = JSON.parse(log); const list = Array.isArray(j) ? j : (j.commits || j.log || j.entries || []); ids = list.map(c => c.commit_id || c.id || c.commit || c.hash).filter(Boolean) } catch {}
    if (!ids.length) ids = [...new Set(log.match(/\b[0-9a-f]{12,64}\b/g) || [])]
    if (!ids.length) throw new Error('sgit history log --json listed no revisions (pass --revs)')
    return ids
}
function scanRevision(dir, rev) {
    let text
    try { text = sgit(dir, ['file', 'grep', '--text', '-n', '-e', '^', rev]) }
    catch (e) { if (e.status === 1 && !String(e.stdout || '').trim()) return; throw new Error(`sgit file grep at ${rev} failed (exit ${e.status})`) }   // exit 1, no output: a commit with no files
    scanned.revisions++
    const byFile = new Map()
    for (const raw of text.split('\n')) { const m = /^(.+?):(\d+):(.*)$/.exec(raw); if (!m) continue; if (!byFile.has(m[1])) byFile.set(m[1], []); byFile.get(m[1]).push([Number(m[2]), m[3]]) }
    for (const [file, lines] of byFile) { scanned.files++; for (const [n, line] of lines) { scanned.lines++; for (const what of hitsIn(line)) findings.push({ rev, file, line: n, rule: what }) } }
}

try {
    if (flags.files) scanFiles(path.resolve(String(flags.files)))
    else {
        const dir = path.resolve(args[0] || '.')
        if (!fs.existsSync(path.join(dir, '.sg_vault'))) throw new Error(`${dir} is not a vault (no .sg_vault/); use --files for a plain folder`)
        for (const rev of revisions(dir)) scanRevision(dir, rev)
        scanFiles(dir)
    }
} catch (e) { out({ ok: false, error: e.message, lines: [`vault-audit: could not run: ${e.message}. Treat the vault as not audited.`] }, 2) }

const lines = findings.map(f => `FOUND ${f.rule}: ${f.rev} ${f.file}:${f.line}`)
lines.push(findings.length
    ? `vault-audit: ${findings.length} finding(s) in ${scanned.revisions} revision(s), ${scanned.files} file reads, ${scanned.lines} lines. Do not publish: rule each one out by reading it, or make a clean new vault.`
    : `vault-audit: clean: ${scanned.revisions} revision(s), ${scanned.files} file reads, ${scanned.lines} lines, ${RULES.length} rules.`)
out({ ok: !findings.length, findings, scanned, lines }, findings.length ? 1 : 0)
