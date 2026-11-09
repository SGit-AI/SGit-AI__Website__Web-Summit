#!/usr/bin/env node
// The worker pool's claims (spec-worker-pool.md section 2, approved by Angelo on 9 November, the desk's 6d341f27).
// A claim is a file claims/<item>.json on the branch pool/claims of origin. Claiming is a push WITHOUT force: if another
// worker pushed first, git refuses ours, and we fetch and look again, so two workers never hold the same item.
// A claim is live for two hours from its last renewal; after that the next worker may take it over.
//   node people/angelo/tools/pool-claim.mjs list [--json]
//   node people/angelo/tools/pool-claim.mjs claim <item> [--worker worker.N@PrompTugal.angelo]
//   node people/angelo/tools/pool-claim.mjs renew <item>
//   node people/angelo/tools/pool-claim.mjs release <item>        (the holder; the desk may add --by desk.conductor@PrompTugal.angelo)
// The worker's name comes from --worker or POOL_WORKER. Exit 0: done; 1: refused (held by another, or not yours); 2: usage;
// 3: could not reach the remote after retries. It never touches the working tree or the current branch: it builds the
// claims commit with git's plumbing in a temporary index, so a worker can claim in the middle of its work.
// For tests: POOL_REMOTE (default origin) and POOL_NOW (an ISO time instead of the clock).
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const LIVE_MS = 2 * 3600e3, BRANCH = 'pool/claims', TRIES = 6
const REMOTE = process.env.POOL_REMOTE || 'origin'
const now = () => process.env.POOL_NOW ? new Date(process.env.POOL_NOW) : new Date()
const git = (args, env = {}, input) => execFileSync('git', args, { encoding: 'utf8', env: { ...process.env, ...env }, input, stdio: ['pipe', 'pipe', 'pipe'] }).trim()
const tryGit = (args, env, input) => { try { return { ok: true, out: git(args, env, input) } } catch (e) { return { ok: false, err: String(e.stderr || e.message) } } }
const ITEM = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/
const WORKER = /^[a-z0-9.-]+@PrompTugal\.angelo$/i

const argv = process.argv.slice(2), cmd = argv[0]
const opt = k => { const i = argv.indexOf('--' + k); return i < 0 ? undefined : argv[i + 1] }
const item = argv[1] && !argv[1].startsWith('--') ? argv[1] : undefined
const me = opt('worker') || process.env.POOL_WORKER || ''
const usage = m => { console.error(`pool-claim: ${m}\nusage: pool-claim.mjs list [--json] | claim|renew|release <item> [--worker <name>] [--by <name>]`); process.exit(2) }

// the remote's pool/claims: its commit (or '' if it does not exist yet) and its claims
const LOCAL = 'refs/pool-claim/head'
function fetchClaims() {
    const r = tryGit(['fetch', '-q', '--no-tags', REMOTE, `+refs/heads/${BRANCH}:${LOCAL}`])
    if (!r.ok) {
        if (/couldn't find remote ref|could not find remote ref/i.test(r.err)) { tryGit(['update-ref', '-d', LOCAL]); return { head: '', claims: {} } }
        throw new Error('fetch: ' + r.err.split('\n')[0])
    }
    const head = git(['rev-parse', LOCAL]), claims = {}
    const ls = tryGit(['ls-tree', '--name-only', `${head}:claims`])
    for (const f of ls.ok ? ls.out.split('\n').filter(Boolean) : []) {
        try { claims[f.replace(/\.json$/, '')] = JSON.parse(git(['show', `${head}:claims/${f}`])) } catch { }
    }
    return { head, claims }
}
const isLive = c => c && now() - Date.parse(c.renewed || c.claimed) < LIVE_MS
const ageMin = c => Math.round((now() - Date.parse(c.renewed || c.claimed)) / 6e4)

// a commit on top of head with claims/<item>.json set to body (or removed if body is null), pushed without force
function write(head, it, body, message, who) {
    const idx = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'pool-claim-')), 'index'), env = { GIT_INDEX_FILE: idx }
    try {
        if (head) git(['read-tree', head], env); else git(['read-tree', '--empty'], env)
        const p = `claims/${it}.json`
        if (body === null) git(['update-index', '--force-remove', p], env)
        else { const blob = git(['hash-object', '-w', '--stdin'], {}, JSON.stringify(body, null, 1) + '\n'); git(['update-index', '--add', '--cacheinfo', `100644,${blob},${p}`], env) }
        const tree = git(['write-tree'], env)
        const id = { GIT_AUTHOR_NAME: who, GIT_AUTHOR_EMAIL: '', GIT_COMMITTER_NAME: who, GIT_COMMITTER_EMAIL: '' }
        const commit = git(['commit-tree', tree, ...(head ? ['-p', head] : []), '-m', `${message}\n\nAgent: ${who}\nItem: ${it}`], id)
        const r = tryGit(['push', '-q', REMOTE, `${commit}:refs/heads/${BRANCH}`])   // never --force: a newer claims head refuses us
        return r.ok
    } finally { fs.rmSync(path.dirname(idx), { recursive: true, force: true }) }
}

// fetch, decide, write; on a refused push, fetch again and decide again
function act(decide) {
    for (let i = 0; i < TRIES; i++) {
        let s
        try { s = fetchClaims() } catch (e) { console.log(`pool-claim: ${e.message}`); process.exit(3) }
        const d = decide(s.claims)
        if (d.refuse) { console.log(d.refuse); process.exit(1) }
        if (d.done) { console.log(d.done); process.exit(0) }
        if (write(s.head, d.item, d.body, d.message, d.who)) { console.log(d.said); process.exit(0) }
        execFileSync('sleep', [String(0.2 + Math.random() * (i + 1))])   // someone pushed first: look again
    }
    console.log(`pool-claim: could not write ${BRANCH} after ${TRIES} tries`); process.exit(3)
}

if (cmd === 'list') {
    let s; try { s = fetchClaims() } catch (e) { console.log(`pool-claim: ${e.message}`); process.exit(3) }
    if (argv.includes('--json')) { console.log(JSON.stringify(Object.fromEntries(Object.entries(s.claims).map(([k, c]) => [k, { ...c, live: isLive(c) }])), null, 1)); process.exit(0) }
    const rows = Object.entries(s.claims).sort()
    if (!rows.length) console.log('no claims')
    for (const [k, c] of rows) console.log(`${k}\t${c.worker}\t${isLive(c) ? 'live' : 'STALE'}\t${ageMin(c)} min since renewed\t${c.branch || ''}`)
    process.exit(0)
}
if (!['claim', 'renew', 'release'].includes(cmd)) usage('unknown command')
if (!item || !ITEM.test(item) || item === 'claims') usage('an item id, such as 0o or 0-POOL')
const by = opt('by'), who = by || me
if (!WORKER.test(who)) usage('--worker <worker.N@PrompTugal.angelo> or POOL_WORKER')
const t = now().toISOString(), short = who.split('@')[0]

if (cmd === 'claim') act(cl => {
    const c = cl[item]
    if (c && isLive(c) && c.worker.toLowerCase() !== who.toLowerCase()) return { refuse: `${item}: held by ${c.worker}, renewed ${ageMin(c)} min ago: take another item` }
    const took = c && !isLive(c) && c.worker.toLowerCase() !== who.toLowerCase()
    const body = { item, worker: who, claimed: c && !took ? c.claimed : t, renewed: t, branch: `pool/${item}`, ...(took ? { took_over_from: c.worker, stale_since: c.renewed || c.claimed } : {}) }
    return { item, body, who, message: `${short}: claims ${item}${took ? ` (took over from ${c.worker}, stale)` : ''}`, said: `${item}: claimed by ${who}${took ? `; took over from ${c.worker} (claim stale since ${c.renewed || c.claimed}): say "Took over: ${item} from ${c.worker.split('@')[0]}, claim stale since ${c.renewed || c.claimed}" in your first commit` : ''}; branch pool/${item}` }
})
if (cmd === 'renew') act(cl => {
    const c = cl[item]
    if (!c || c.worker.toLowerCase() !== who.toLowerCase()) return { refuse: `${item}: not held by ${who}${c ? ` (held by ${c.worker})` : ''}: claim it first` }
    return { item, body: { ...c, renewed: t }, who, message: `${short}: renews ${item}`, said: `${item}: renewed by ${who}` }
})
if (cmd === 'release') act(cl => {
    const c = cl[item]
    if (!c) return { done: `${item}: no claim` }
    if (c.worker.toLowerCase() !== who.toLowerCase() && !/^desk\.conductor@/i.test(who)) return { refuse: `${item}: held by ${c.worker}; only it or desk.conductor@ may release it` }
    return { item, body: null, who, message: `${short}: releases ${item}${c.worker.toLowerCase() !== who.toLowerCase() ? ` (held by ${c.worker})` : ''}`, said: `${item}: released by ${who}` }
})
