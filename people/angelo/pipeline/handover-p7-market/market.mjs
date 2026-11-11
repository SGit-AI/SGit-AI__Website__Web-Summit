#!/usr/bin/env node
// Handover market prototype (handover-p7-market): offers, claims and lapses, copied and extended from people/angelo/tools/pool-claim.mjs.
// An offer is offers/<id>.json on a branch of a remote GIVEN BY ARGUMENT (default branch handover/claims). Every change is a push WITHOUT force:
// if another claimer pushed first, git refuses ours, we fetch and decide again, so the first push wins. The commit is built with git's
// plumbing in a temporary index, so the working tree and current branch are never touched. This prototype REFUSES the remote named
// "origin" or origin's URL: tests run on a local bare repository only.
//   node market.mjs offer <id> --remote R --offerer <name> --cost <usd> --size large|small --start-within <min> [--env claude] [--package <path>]
//   node market.mjs claim-offer <id> --remote R --worker <name> --account <label> [--capacity capacity.json]   (needs room >= 1.5 x cost when a capacity file is given)
//   node market.mjs lapse <id> --remote R --by <name>      (only when the claim has no worker commit on pool/<id> after 10 minutes)
//   node market.mjs list --remote R [--json]
// Exit 0: done; 1: refused; 2: usage; 3: could not reach the remote. Test hooks: MARKET_NOW (ISO), --now.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { hasRoom, load, key } from './capacity.mjs'

const LAPSE_MS = 10 * 60e3, MARGIN = 1.5, TRIES = 6, LOCAL = 'refs/market/head'
const argv = process.argv.slice(2), cmd = argv[0]
const opt = k => { const i = argv.indexOf('--' + k); return i < 0 ? undefined : argv[i + 1] }
const now = () => new Date(opt('now') || process.env.MARKET_NOW || Date.now())
const REMOTE = opt('remote'), BRANCH = opt('branch') || 'handover/claims'
const git = (a, env = {}, input) => execFileSync('git', a, { encoding: 'utf8', env: { ...process.env, ...env }, input, stdio: ['pipe', 'pipe', 'pipe'] }).trim()
const tryGit = (a, env, input) => { try { return { ok: true, out: git(a, env, input) } } catch (e) { return { ok: false, err: String(e.stderr || e.message) } } }
const usage = m => { console.error(`market: ${m}\nusage: offer|claim-offer|lapse <id> | list   (--remote <bare repo> is required; never origin)`); process.exit(2) }
const ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/, NAME = /^[a-z0-9.-]+@PrompTugal\.[a-z]+$/i

if (!['offer', 'claim-offer', 'lapse', 'list'].includes(cmd)) usage('unknown command')
if (!REMOTE) usage('--remote is required')
if (REMOTE === 'origin' || (tryGit(['remote', 'get-url', 'origin']).out || '#') === REMOTE) { console.error('market: a prototype; it never writes to origin. Give a local bare repository.'); process.exit(2) }

function fetchState() {
    const r = tryGit(['fetch', '-q', '--no-tags', REMOTE, `+refs/heads/${BRANCH}:${LOCAL}`])
    if (!r.ok) {
        if (/couldn't find remote ref|could not find remote ref/i.test(r.err)) { tryGit(['update-ref', '-d', LOCAL]); return { head: '', offers: {} } }
        throw new Error('fetch: ' + r.err.split('\n')[0])
    }
    const head = git(['rev-parse', LOCAL]), offers = {}
    const ls = tryGit(['ls-tree', '--name-only', `${head}:offers`])
    for (const f of ls.ok ? ls.out.split('\n').filter(Boolean) : []) { try { offers[f.replace(/\.json$/, '')] = JSON.parse(git(['show', `${head}:offers/${f}`])) } catch { } }
    return { head, offers }
}
// has the claimer's worker made a first commit on pool/<id> since the claim? (a trailer "Agent: <worker>" on a commit at or after claimed_at)
function started(o) {
    if (!o.claim) return false
    const ref = `refs/market/pool-${o.id}`
    if (!tryGit(['fetch', '-q', '--no-tags', REMOTE, `+refs/heads/pool/${o.id}:${ref}`]).ok) return false
    const log = tryGit(['log', '--format=%cI%x1f%B%x1e', ref]).out || ''
    return log.split('\x1e').some(e => { const [t, body] = e.trim().split('\x1f'); return t && body && Date.parse(t) >= Date.parse(o.claim.claimed_at) && new RegExp('^Agent: ' + o.claim.worker.replace(/[.]/g, '\\.') + '\\s*$', 'mi').test(body) })
}
// open | claimed (live, waiting for the first commit) | started | lapsed (claim older than 10 min, no first commit: open again)
function status(o) {
    if (!o.claim) return 'open'
    if (started(o)) return 'started'
    return now() - Date.parse(o.claim.claimed_at) < LAPSE_MS ? 'claimed' : 'lapsed'
}
function write(head, id, body, message, who) {
    const idx = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'market-')), 'index'), env = { GIT_INDEX_FILE: idx }
    try {
        if (head) git(['read-tree', head], env); else git(['read-tree', '--empty'], env)
        const blob = git(['hash-object', '-w', '--stdin'], {}, JSON.stringify(body, null, 1) + '\n')
        git(['update-index', '--add', '--cacheinfo', `100644,${blob},offers/${id}.json`], env)
        const tree = git(['write-tree'], env)
        const ident = { GIT_AUTHOR_NAME: who, GIT_AUTHOR_EMAIL: '', GIT_COMMITTER_NAME: who, GIT_COMMITTER_EMAIL: '' }
        const commit = git(['commit-tree', tree, ...(head ? ['-p', head] : []), '-m', `${message}\n\nAgent: ${who}\nItem: ${id}`], ident)
        return tryGit(['push', '-q', REMOTE, `${commit}:refs/heads/${BRANCH}`]).ok   // never --force
    } finally { fs.rmSync(path.dirname(idx), { recursive: true, force: true }) }
}
function act(decide) {
    for (let i = 0; i < TRIES; i++) {
        let s; try { s = fetchState() } catch (e) { console.log('market: ' + e.message); process.exit(3) }
        const d = decide(s.offers)
        if (d.refuse) { console.log(d.refuse); process.exit(1) }
        if (write(s.head, d.id, d.body, d.message, d.who)) { console.log(d.said); process.exit(0) }
        execFileSync('sleep', [String(0.1 + Math.random() * (i + 1) * 0.5)])   // someone pushed first: look again
    }
    console.log(`market: could not write ${BRANCH} after ${TRIES} tries`); process.exit(3)
}
const id = argv[1] && !argv[1].startsWith('--') ? argv[1] : undefined
const t = now().toISOString()

if (cmd === 'list') {
    let s; try { s = fetchState() } catch (e) { console.log('market: ' + e.message); process.exit(3) }
    const rows = Object.values(s.offers).sort((a, b) => a.id.localeCompare(b.id)).map(o => ({ id: o.id, status: status(o), offerer: o.offerer, env: o.env, cost_usd: o.cost_usd, size: o.size, claimer: o.claim?.worker || null, lapses: o.lapses?.length || 0 }))
    if (argv.includes('--json')) { console.log(JSON.stringify(rows, null, 1)); process.exit(0) }
    if (!rows.length) console.log('no offers')
    for (const r of rows) console.log(`${r.id}\t${r.status}\t${r.env}\t${r.size}\t${r.cost_usd} USD\t${r.offerer}${r.claimer ? '\tclaimed by ' + r.claimer : ''}${r.lapses ? `\t${r.lapses} lapse(s)` : ''}`)
    process.exit(0)
}
if (!id || !ID.test(id)) usage('an offer id such as handover-p7-market')

if (cmd === 'offer') {
    const offerer = opt('offerer'), cost = Number(opt('cost')), size = opt('size'), within = Number(opt('start-within'))
    if (!NAME.test(offerer || '')) usage('--offerer <agent name>')
    if (!(cost > 0) || !['large', 'small'].includes(size) || !(within > 0)) usage('--cost <usd> --size large|small --start-within <min>')
    act(o => {
        if (o[id]) return { refuse: `${id}: already offered (${status(o[id])})` }
        return { id, who: offerer, message: `${offerer.split('@')[0]}: offers ${id}`, said: `${id}: offered by ${offerer}, ${cost} USD, ${size}, start within ${within} min`,
            body: { id, offerer, env: opt('env') || 'claude', cost_usd: cost, size, start_within_min: within, package: opt('package') || null, offered_at: t, claim: null, lapses: [] } }
    })
}
if (cmd === 'claim-offer') {
    const worker = opt('worker'), account = opt('account'), cap = opt('capacity')
    if (!NAME.test(worker || '') || !account) usage('--worker <name> --account <label>')
    act(offers => {
        const o = offers[id]
        if (!o) return { refuse: `${id}: no such offer` }
        const st = status(o)
        if (st === 'claimed' || st === 'started') return { refuse: `${id}: ${st} by ${o.claim.worker}: take another offer` }
        if (cap) {   // the claimer's own capacity row for the environment the offer needs
            const row = (load(cap).rows || {})[key({ environment: o.env, account })]
            if (!hasRoom(row, now())) return { refuse: `${id}: no room on ${o.env}:${account} (row ${row ? 'stale or empty' : 'missing'}); the offer stays open` }
            if (row.headroom_usd_est < MARGIN * o.cost_usd) return { refuse: `${id}: headroom ${row.headroom_usd_est} USD is under ${MARGIN} x ${o.cost_usd} USD; the offer stays open` }
        }
        const lapses = st === 'lapsed' ? [...(o.lapses || []), { worker: o.claim.worker, claimed_at: o.claim.claimed_at, lapsed_at: t }] : (o.lapses || [])
        return { id, who: worker, message: `${worker.split('@')[0]}: claims ${id}${st === 'lapsed' ? ` (took over from ${o.claim.worker}, lapsed)` : ''}`,
            said: `${id}: claimed by ${worker} on ${account}${st === 'lapsed' ? `; took over from ${o.claim.worker}, whose claim lapsed` : ''}; first commit due on pool/${id} within 10 min`,
            body: { ...o, claim: { worker, account, claimed_at: t }, lapses } }
    })
}
if (cmd === 'lapse') {
    const by = opt('by'); if (!NAME.test(by || '')) usage('--by <name>')
    act(offers => {
        const o = offers[id]
        if (!o) return { refuse: `${id}: no such offer` }
        const st = status(o)
        if (st !== 'lapsed') return { refuse: `${id}: ${st}, not lapsed` }
        return { id, who: by, message: `${by.split('@')[0]}: lapses claim on ${id}`, said: `${id}: claim by ${o.claim.worker} lapsed; the offer is open again`,
            body: { ...o, claim: null, lapses: [...(o.lapses || []), { worker: o.claim.worker, claimed_at: o.claim.claimed_at, lapsed_at: t }] } }
    })
}
