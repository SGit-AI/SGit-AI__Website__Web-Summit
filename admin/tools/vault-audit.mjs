#!/usr/bin/env node
// Audit a vault before its read key is published (WS-128). A published read key reads every commit, so
// every revision is scanned, not only the files on disk. Refuses anything shaped like a secret or a contact detail,
// with the gate's own key shapes (admin/build/secrets.cjs) plus the short-id vault key the gate misses (WS-122).
// It also compares the ACTUAL values (WS-135): the access token, any SG_VAULT_KEY_*, this vault's own key and their
// passphrase halves, in every line, file name and the vault's folder name. It prints only WHERE (revision, file, line,
// which rule or which value), never what it found, so its output is safe to keep.
//
//   node admin/tools/vault-audit.mjs <vault dir>              every revision (sgit history log) and the working files
//   node admin/tools/vault-audit.mjs --files <dir>            only the files on disk (no sgit needed)
//   node admin/tools/vault-audit.mjs --self-test              the rules against built-in samples
// Options: --revs <id,id>  scan these revisions instead of the whole history; --json  machine-readable result.
// Exit 0: clean. Exit 1: something found (nothing may be published). Exit 2: the audit could not run (treat as found).
//
// Revisions are read with `sgit history log --json` and `sgit file grep --text -n -e '^' <rev>` (the method
// vault@web-summit.angelo used on 3 November, sgit 0.27; `sgit cat` takes no revision). The vault's own key is read from
// .sg_vault/local/ (files named *key* or *token*), in memory, without `sgit vault show-key`.
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

const findings = [], scanned = { revisions: 0, empty: 0, files: 0, lines: 0 }
// WS-135: the actual values, not only their shapes. A token can have no recognisable shape, so the audit also looks for
// the access token's value, every SG_VAULT_KEY_* in the environment, and this vault's own key, each with its passphrase
// half (a vault id, after the colon, is public and is never searched for). Held in memory, never printed: a finding names
// which value, never the value.
const VALUES = []
const addValue = (what, v) => {
    v = String(v || '').trim(); if (v.length < 12) return
    VALUES.push([what, v])
    const i = v.lastIndexOf(':'); if (i >= 12) VALUES.push([`${what} (its passphrase half)`, v.slice(0, i)])
}
function collectValues(vaultDir) {
    for (const k of ['SG_SEND_ACCESS_TOKEN', 'SG_ACCESS_TOKEN']) addValue(`the value of ${k}`, process.env[k])
    for (const [k, v] of Object.entries(process.env)) if (/^SG_VAULT_KEY_/.test(k)) addValue(`the value of ${k}`, v)
    const local = vaultDir && path.join(vaultDir, '.sg_vault', 'local')
    if (local && fs.existsSync(local)) for (const n of fs.readdirSync(local)) {
        const f = path.join(local, n)
        if (!/key|token/i.test(n) || !fs.statSync(f).isFile() || fs.statSync(f).size > 4096) continue
        for (const line of fs.readFileSync(f, 'utf8').split('\n')) addValue(`this vault's ${n.replace(/[^a-z_]/gi, '')}`, line)
    }
}
const valueHits = text => VALUES.filter(([, v]) => text.includes(v)).map(([what]) => what)
const check = (where, text) => { for (const what of [...hitsIn(text), ...valueHits(text)]) findings.push({ ...where, rule: what }) }
const checkName = (rev, file) => { for (const what of valueHits(file)) findings.push({ rev, file: '(a file name)', line: 0, rule: what }) }
const scanText = (where, text) => text.split('\n').forEach((line, i) => { scanned.lines++; check({ ...where, line: i + 1 }, line) })
function walk(d, base = d, acc = []) { for (const n of fs.readdirSync(d)) { if (n === '.sg_vault' || n === '.git') continue; const p = path.join(d, n); fs.statSync(p).isDirectory() ? walk(p, base, acc) : acc.push(path.relative(base, p)) } return acc }
function scanFiles(dir) {
    for (const f of walk(dir)) { checkName('working', f); if (secrets.BINARY.test(f)) continue; scanned.files++; scanText({ rev: 'working', file: f }, fs.readFileSync(path.join(dir, f), 'utf8')) }
}
const sgit = (dir, argv) => execFileSync('sgit', argv, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 << 20 })
function revisions(dir) {
    if (flags.revs) return String(flags.revs).split(',').map(s => s.trim()).filter(Boolean)
    // 1. sgit history log --json (it lists nothing outside range mode in sgit 0.27: vault@web-summit.angelo, WS-128)
    let ids = []
    try { const j = JSON.parse(sgit(dir, ['history', 'log', '--json'])); const list = Array.isArray(j) ? j : (j.commits || j.log || j.entries || []); ids = list.map(c => c.commit_id || c.id || c.commit || c.hash).filter(Boolean) } catch {}
    // 2. then the plain log: commit ids are obj-cas-imm-<hex> (sgit's object ids); failing that, hex runs of 7+ with a
    //    letter in them (so a timestamp or a date is never taken for an id)
    for (const argv of [['history', 'log'], ['history', 'log', '--oneline']]) {
        if (ids.length) break
        let log = ''; try { log = sgit(dir, argv) } catch { continue }
        ids = [...new Set(log.match(/\bobj-cas-imm-[0-9a-f]{8,64}\b/g) || [])]
        if (!ids.length) ids = [...new Set(log.match(/\b(?=[0-9a-f]*[a-f])[0-9a-f]{7,64}\b/g) || [])]
    }
    if (!ids.length) throw new Error('neither sgit history log --json nor the plain log listed any revision (pass --revs)')
    return ids
}
function scanRevision(dir, rev) {
    let text
    try { text = sgit(dir, ['file', 'grep', '--text', '-n', '-e', '^', rev]) }
    catch (e) { if (e.status === 1 && !String(e.stdout || '').trim()) { scanned.revisions++; scanned.empty++; return } throw new Error(`sgit file grep at ${rev} failed (exit ${e.status})`) }   // exit 1, no output: a commit with no files (init), counted
    scanned.revisions++
    const byFile = new Map()
    for (const raw of text.split('\n')) { const m = /^(.+?):(\d+):(.*)$/.exec(raw); if (!m) continue; if (!byFile.has(m[1])) byFile.set(m[1], []); byFile.get(m[1]).push([Number(m[2]), m[3]]) }
    for (const [file, lines] of byFile) { checkName(rev, file); scanned.files++; for (const [n, line] of lines) { scanned.lines++; check({ rev, file, line: n }, line) } }
}

try {
    if (flags.files) { collectValues(null); scanFiles(path.resolve(String(flags.files))) }
    else {
        const dir = path.resolve(args[0] || '.')
        if (!fs.existsSync(path.join(dir, '.sg_vault'))) throw new Error(`${dir} is not a vault (no .sg_vault/); use --files for a plain folder`)
        collectValues(dir)
        for (const what of valueHits(path.basename(dir))) findings.push({ rev: 'working', file: "(the vault's folder name)", line: 0, rule: what })
        for (const rev of revisions(dir)) scanRevision(dir, rev)
        scanFiles(dir)
    }
} catch (e) { out({ ok: false, error: e.message, lines: [`vault-audit: could not run: ${e.message}. Treat the vault as not audited.`] }, 2) }

const revs = `${scanned.revisions} revision(s)${scanned.empty ? ` (${scanned.empty} with no files)` : ''}`
const vals = `${VALUES.length} actual value(s) compared${VALUES.length ? '' : ' (none set: no token in the environment, no key in .sg_vault/local/)'}`
const lines = findings.map(f => `FOUND ${f.rule}: ${f.rev} ${f.file}${f.line ? ':' + f.line : ''}`)
lines.push(findings.length
    ? `vault-audit: ${findings.length} finding(s) in ${revs}, ${scanned.files} file reads, ${scanned.lines} lines, ${vals}. Do not publish: rule each one out by reading it, or make a clean new vault.`
    : `vault-audit: clean: ${revs}, ${scanned.files} file reads, ${scanned.lines} lines, ${RULES.length} rules, ${vals}.`)
out({ ok: !findings.length, findings, scanned, lines }, findings.length ? 1 : 0)
