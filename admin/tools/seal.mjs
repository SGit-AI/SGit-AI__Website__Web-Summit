#!/usr/bin/env node
// Seal a secret (a vault key) to an agent key published on this site's keys page. The trust is the push
// (https://newsroom.sgit.ai/articles/the-push-is-the-authorisation.html, CLAUDE.md "Identity and names"): a key is
// accepted because the session that made it pushed its public half to data/keys.json on dev, which only an account
// with push access to this repository can do. The pki.sgit.ai register is not consulted.
//
//   node admin/tools/seal.mjs --to <key id | fingerprint>[,...] (--from-vault DIR | --file F) [--name N] [--expires DAYS] [--qr out.png|out.svg]
//   node admin/tools/seal.mjs --check <key id | fingerprint>     what the repository says about a key (nothing sealed)
//
// The recipient's bundle is read from origin/dev:data/keys.json (what was pushed, not the working tree) and must match
// the copy the live site serves (keys/sha256-<signing fp>.json). The sealing code is pki-agent.mjs's own, unmodified:
// its library half is loaded from the copy at $PKI_AGENT (default ~/.sg-send/tools/pki-agent.mjs, from
// https://pki.sgit.ai/agents/pki-agent.mjs), and the sender is this session's key (pki-agent.mjs keygen --session).
// The result is a pki.sgit.ai sealed link that the recipient opens with `node pki-agent.mjs open <link>`.
// The secret is never printed. A --from-vault key goes straight from `sgit vault show-key` into memory.
//
// Who pushed (WS-106): every commit here is authored as "Claude", so git cannot say whose account pushed a key. The
// tool asks GitHub instead (the repository's activity API: the account behind each push) and compares that account
// with the GitHub accounts data/team.json lists for the person the key's label names (<agent>@web-summit.<person>).
// It seals only when they match, or when the sealer passes --fingerprint <the recipient's signing fingerprint>, read
// to them out of band by its person (or from its QR code). pki-agent.mjs must match the pinned sha256 below.
import fs from 'fs'
import os from 'os'
import path from 'path'
import zlib from 'zlib'
import crypto from 'crypto'
import { execFileSync } from 'child_process'

const SITE = 'https://web-summit.sgit.ai/'
const REPO = 'SGit-AI/SGit-AI__Website__Web-Summit'
// pki-agent.mjs as read on 2 November 2026; a new version is accepted only with PKI_AGENT_SHA256=<its sha256>, by hand
const PKI_SHA256 = process.env.PKI_AGENT_SHA256 || 'fcb28a1cc40d05bf8ccc8fc61a2a907c934840cac7aa41d9d8283c1d461002ab'
const HOME = process.env.PKI_AGENT_HOME || path.join(os.homedir(), '.sg-send')
const die = m => { console.error('seal: ' + m); process.exit(1) }
const flags = {}
for (let a = process.argv.slice(2), i = 0; i < a.length; i++) if (a[i].startsWith('--')) flags[a[i].slice(2)] = a[i + 1] && !a[i + 1].startsWith('--') ? a[++i] : true

// pki-agent.mjs's library half (everything before its command-line tool), loaded as a module
async function pkiLib() {
    const file = process.env.PKI_AGENT || path.join(HOME, 'tools', 'pki-agent.mjs')
    if (!fs.existsSync(file)) die(`no pki-agent.mjs at ${file}: download https://pki.sgit.ai/agents/pki-agent.mjs there, or set PKI_AGENT`)
    const src = fs.readFileSync(file, 'utf8'), cut = src.indexOf('// ---------------------------------------------------------------- the tool')
    if (cut < 0) die(`${file} does not look like pki-agent.mjs`)
    const sha = crypto.createHash('sha256').update(src).digest('hex')
    if (sha !== PKI_SHA256) die(`${file} has sha256 ${sha}, not the pinned ${PKI_SHA256}: read the new version, then set PKI_AGENT_SHA256 to accept it`)
    const lib = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'seal-')), 'lib.mjs')
    fs.writeFileSync(lib, src.slice(0, cut) + '\nexport { __keys, __message, __qrcode, __qrread }\n')
    try { return await import(lib) } finally { fs.rmSync(path.dirname(lib), { recursive: true, force: true }) }
}

// the recipient: pushed to dev, and served by the site
function published() {
    try { execFileSync('git', ['fetch', '-q', 'origin', 'dev'], { stdio: 'ignore' }) } catch { console.error('seal: git fetch failed; using the last fetched origin/dev') }
    return JSON.parse(execFileSync('git', ['show', 'origin/dev:data/keys.json'], { encoding: 'utf8' })).keys
}
async function recipient(keys, ref) {
    const k = keys.find(k => k.id === ref || k.bundle.signing_fingerprint === ref || k.bundle.fingerprint === ref)
    if (!k) die(`${ref}: not on the keys page as pushed to dev (origin/dev:data/keys.json)`)
    if (JSON.stringify(k.bundle).includes('PRIVATE')) die(`${k.id}: the entry holds a private key; refusing`)
    const commit = execFileSync('git', ['log', '--format=%H %ad %s', '--date=short', '-S', k.bundle.signing_fingerprint, '--reverse', 'origin/dev', '--', 'data/keys.json'], { encoding: 'utf8' }).split('\n')[0]
    const sha = commit.split(' ')[0], person = (/@web-summit\.([a-z0-9-]+)/.exec(k.label) || [])[1] || null
    const by = sha ? await pushedBy(sha) : null, accounts = person ? rosterAccounts(person) : []
    const url = `${SITE}keys/sha256-${k.bundle.signing_fingerprint.split(':')[1]}.json`
    let live = 'not checked'
    try { const r = await fetch(url, { cache: 'no-store' }); live = r.ok && JSON.stringify((await r.json()).bundle) === JSON.stringify(k.bundle) ? 'matches' : `differs or missing (${r.status})` } catch (e) { live = `unreachable (${e.message})` }
    if (live.startsWith('differs')) die(`${k.id}: the live site's copy ${live}: ${url}`)
    return { k, commit: commit ? commit.slice(0, 7) + commit.slice(40) : '(not found in the fetched history)', url, live, person, pushed_by: by, roster: accounts, pusher_matches: !!(by && accounts.includes(by)) }
}
// the account behind the push that brought a commit to dev, from GitHub (git only ever says "Claude")
const isAncestor = (a, b) => { try { execFileSync('git', ['merge-base', '--is-ancestor', a, b], { stdio: 'ignore' }); return true } catch { return false } }
async function pushedBy(sha) {
    // the one push whose "after" holds the commit and whose "before" does not; the API pages by cursor (the Link header)
    let url = `https://api.github.com/repos/${REPO}/activity?ref=refs/heads/dev&per_page=100`
    // curl, not fetch: curl honours HTTPS_PROXY (a cloud session's authenticated proxy); GITHUB_TOKEN is used if set
    for (let n = 0; url && n < 20; n++) {
        let head = '', list
        try {
            const args = ['-sS', '-m', '30', '-D', '-', '-H', 'accept: application/vnd.github+json', '-H', 'user-agent: web-summit-seal', ...(process.env.GITHUB_TOKEN ? ['-H', `authorization: Bearer ${process.env.GITHUB_TOKEN}`] : []), url]
            let out = execFileSync('curl', args, { encoding: 'utf8', maxBuffer: 64 << 20 })
            while (out.startsWith('HTTP/')) { const cut = out.indexOf('\r\n\r\n'); head = out.slice(0, cut); out = out.slice(cut + 4) }   // a proxy's CONNECT block comes first
            list = JSON.parse(out)
        } catch (e) { console.error(`seal: GitHub's activity API did not answer: ${e.message.split('\n')[0]}`); return null }
        if (!Array.isArray(list)) { console.error(`seal: GitHub's activity API: ${list.message || 'not a list'}`); return null }
        for (const a of list) {
            if (!/^[0-9a-f]{40}$/.test(a.after || '') || !isAncestor(sha, a.after)) continue
            if (/^[0-9a-f]{40}$/.test(a.before || '') && !/^0+$/.test(a.before) && isAncestor(sha, a.before)) continue
            return (a.actor && a.actor.login) || null
        }
        url = ((/^link:(.*)$/im.exec(head) || [])[1] || '').match(/<([^>]+)>;\s*rel="next"/)?.[1] || null
        if (url) url = url.replace(/\/repositories\/\d+\//, `/repos/${REPO}/`)   // a session proxy refuses numeric-id paths
    }
    return null
}
// the GitHub accounts the roster (data/team.json on dev) lists for a person: the first word of each entry
function rosterAccounts(person) {
    try { const m = JSON.parse(execFileSync('git', ['show', 'origin/dev:data/team.json'], { encoding: 'utf8' })).members.find(m => m.id === person); return ((m && m.github) || []).map(g => String(g).split(/\s/)[0]) } catch { return [] }
}

const keys = published()
if (flags.check) {
    const r = await recipient(keys, String(flags.check))
    console.log(JSON.stringify({ id: r.k.id, label: r.k.label, signing_fingerprint: r.k.bundle.signing_fingerprint, encryption_fingerprint: r.k.bundle.fingerprint, pushed_in: r.commit, pushed_by: r.pushed_by || 'unknown (GitHub did not say)', person: r.person, roster_accounts: r.roster, pusher_matches_roster: r.pusher_matches, live: r.live, url: r.url }, null, 2))
    process.exit(0)
}
if (!flags.to || flags.to === true) die('--to <key id | fingerprint>[,...] (see the header of this file)')
const { __keys: K, __message: M, __qrcode: Q, __qrread: QR } = await pkiLib()

// the sender: this session's own key
async function me() {
    const st = path.join(HOME, 'pki', 'agent.json'), fp = fs.existsSync(st) ? JSON.parse(fs.readFileSync(st, 'utf8')).default : null
    const dir = path.join(HOME, 'keys')
    for (const d of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
        const mf = path.join(dir, d, 'metadata.json'); if (!fs.existsSync(mf)) continue
        const m = JSON.parse(fs.readFileSync(mf, 'utf8'))
        if (fp && m.signing_fingerprint !== fp && m.encryption_fingerprint !== fp) continue
        return K.importKeystore({ privateKeyPem: fs.readFileSync(path.join(dir, d, 'private_key.pem'), 'utf8'), signingPrivatePem: fs.readFileSync(path.join(dir, d, 'signing_private.pem'), 'utf8'), passphrase: process.env.SG_SEND_PASSPHRASE || '', label: m.label, created: m.created })
    }
    die(`no key of this session in ${dir}: node pki-agent.mjs keygen --session --name "<agent>@web-summit.<person>"`)
}

// the secret
let data, name = flags.name && flags.name !== true ? String(flags.name) : ''
if (flags['from-vault']) {
    const dir = flags['from-vault'] === true ? '.' : String(flags['from-vault'])
    let out; try { out = execFileSync('sgit', ['vault', 'show-key'], { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) } catch (e) { die(`sgit vault show-key in ${dir} failed`) }
    const m = new RegExp('sgit_private_' + 'vault_[A-Za-z0-9]+:[a-z0-9]+').exec(out); if (!m) die('sgit printed no vault key this tool recognises: nothing sealed')
    data = K.utf8(m[0]); name = name || `vault key: ${m[0].split(':').pop()}`
} else if (flags.file && flags.file !== true) { data = fs.readFileSync(String(flags.file)); name = name || path.basename(String(flags.file)) }
else die('--from-vault DIR or --file F (never a secret on the command line)')

const id = await me()
const expires = flags.expires && flags.expires !== true ? new Date(Date.now() + Number(flags.expires) * 86400000).toISOString() : ''
const tos = String(flags.to).split(',').map(s => s.trim()).filter(Boolean)
for (const ref of tos) {
    const r = await recipient(keys, ref), to = r.k.bundle
    console.error(`seal: to ${r.k.id} (${to.signing_fingerprint}), pushed in ${r.commit} by ${r.pushed_by || 'an account GitHub did not name'}; live copy ${r.live}`)
    const oob = flags.fingerprint && flags.fingerprint !== true && String(flags.fingerprint).split(',').includes(to.signing_fingerprint)
    if (!r.pusher_matches && !oob) die(`${r.k.id}: pushed by ${r.pushed_by || 'an unknown account'}, which is not one of ${r.person || 'its person'}'s accounts on the roster (${r.roster.join(', ') || 'none listed'}). Ask ${r.person || 'its person'} to read you its signing fingerprint (or show its QR code), then pass --fingerprint <that fingerprint>; this tool will not print it for you. Nothing sealed.`)
    console.error(`seal: trusted because ${[r.pusher_matches && `the pusher ${r.pushed_by} is ${r.person}'s account on the roster`, oob && 'the fingerprint was confirmed out of band (--fingerprint)'].filter(Boolean).join(' and ')}`)
    const msg = await M.compose({ to, from: id, subject: `A secret: ${name || 'unnamed'}`, text: `Sealed to ${to.signing_fingerprint} (${r.k.id} on ${SITE}keys/) by ${id.bundle.signing_fingerprint}. Open it with your key; the secret is the file inside.`, files: [{ name: name || 'secret', data }], expires })
    const sealed = await M.sealMessage(msg, to, id)
    console.log(`${r.k.label} (${to.signing_fingerprint}):`); console.log(sealed.url)
    const qr = flags.qr && flags.qr !== true ? (tos.length > 1 ? String(flags.qr).replace(/(\.(svg|png))?$/i, x => `-${r.k.id}${x || '.png'}`) : String(flags.qr)) : ''
    if (qr) {
        const text = M.qrSealed({ to: to.signing_fingerprint, from: id.bundle.signing_fingerprint, code: sealed.code })
        if (text.length > M.MAX_QR_CHARS) { console.error(`seal: ${text.length} characters, too long for one QR code; the link still works`); continue }
        const q = Q.qrcode(0, 'L'); q.addData(text, 'Byte'); q.make()
        const n = q.getModuleCount(), mg = 4, px = 8, size = (n + mg * 2) * px, lum = new Uint8Array(size * size).fill(255)
        for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.isDark(y, x)) for (let d = 0; d < px; d++) lum.fill(0, ((y + mg) * px + d) * size + (x + mg) * px, ((y + mg) * px + d) * size + (x + mg + 1) * px)
        fs.writeFileSync(qr, await QR.encodePng(lum, size, size, b => zlib.deflateSync(b))); console.error(`seal: QR code in ${qr}`)
    }
}
