#!/usr/bin/env node
// Capacity board prototype (handover-p7-market). One row per environment+account, written into a capacity.json given as an argument.
//   write: node capacity.mjs write --file capacity.json --environment claude --account angelo.B [--tier T] [--window five_hour]
//            [--rate-limit '<get_session rate_limit_info as JSON>' | --rate-limit-file f] [--ledger <file>]... [--calibration-usd N]
//            [--usage-log f.jsonl] [--declared-headroom N] [--note text]
//   list:  node capacity.mjs list --file capacity.json [--json]
// Rows older than 2 hours count as no room (decided when read, never by trusting the row). Test hooks: --now <ISO> or CAPACITY_NOW.
// Spend: USD estimates from token counts at an ASSUMED rate card (RATES below), labelled as such in the row; headroom is an estimate.
import fs from 'node:fs'

export const STALE_MS = 2 * 3600e3
export const ENVIRONMENTS = ['claude', 'openrouter', 'ollama', 'aws']
// assumed API-equivalent USD per million tokens; a placeholder until the accountant publishes a rate card
export const RATES = { input: 5, output: 25, cache_creation: 6.25, cache_read: 0.5 }

export const usd = s => ((s.input_tokens || 0) * RATES.input + (s.output_tokens || 0) * RATES.output +
    (s.cache_creation_input_tokens || 0) * RATES.cache_creation + (s.cache_read_input_tokens || 0) * RATES.cache_read) / 1e6

// spend since `since` (ISO) from ledger lines (people/angelo/ledger/*.jsonl shape: session and subagents blocks)
export function ledgerSpend(files, since, now) {
    let spend = 0, tokens = 0, lines = 0
    for (const f of files) for (const l of fs.readFileSync(f, 'utf8').split('\n').filter(Boolean)) {
        let r; try { r = JSON.parse(l) } catch { continue }
        const t = Date.parse(r.at); if (!(t >= Date.parse(since) && t <= now.getTime())) continue
        for (const b of [r.session, r.subagents]) if (b) { spend += usd(b); tokens += b.total_without_cache_reads || 0 }
        lines++
    }
    return { spend_usd: +spend.toFixed(2), tokens, lines }
}
// OpenRouter: spend so far today (UTC) from a usage log, one JSON per line {at, usd}
export function usageSpendToday(file, now) {
    const day = now.toISOString().slice(0, 10); let s = 0
    for (const l of fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)) {
        try { const r = JSON.parse(l); if (String(r.at).startsWith(day)) s += Number(r.usd) || 0 } catch { }
    }
    return +s.toFixed(4)
}
// a row has room only if fresh, not limited, and a headroom is known and above zero
export function hasRoom(row, now) {
    if (!row || !(now - Date.parse(row.updated_at) < STALE_MS)) return false
    if (row.status === 'limited') return false
    return typeof row.headroom_usd_est === 'number' && row.headroom_usd_est > 0
}
export const key = r => `${r.environment}:${r.account}`
export const load = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')) } catch { return { rows: {} } } }

export function buildRow(o, now) {
    const row = { environment: o.environment, account: o.account, tier: o.tier || null, window: o.window || (o.environment === 'claude' ? 'five_hour' : 'day'),
        status: 'unknown', pct_used: null, resets_at: null, spend_usd: null, tokens: null, headroom_usd_est: null, headroom_basis: null, updated_at: now.toISOString() }
    const rl = o.rateLimit
    if (rl) {
        row.window = rl.rateLimitType || row.window; row.status = rl.status || 'unknown'
        row.resets_at = rl.resetsAt ? new Date(typeof rl.resetsAt === 'number' ? rl.resetsAt * (rl.resetsAt < 1e12 ? 1000 : 1) : rl.resetsAt).toISOString() : null
        if (typeof rl.percentUsed === 'number') row.pct_used = rl.percentUsed
    }
    if (o.environment === 'claude' && o.ledger?.length) {
        // spend in the current window: the last five hours, or since the window's start when resets_at is known
        const start = row.resets_at ? new Date(Date.parse(row.resets_at) - (row.window === 'weekly' ? 7 * 864e5 : 5 * 3600e3)) : new Date(now - 5 * 3600e3)
        const s = ledgerSpend(o.ledger, start.toISOString(), now); row.spend_usd = s.spend_usd; row.tokens = s.tokens
    }
    if (o.environment === 'openrouter' && o.usageLog) row.spend_usd = usageSpendToday(o.usageLog, now)
    if (typeof o.declaredHeadroom === 'number') { row.headroom_usd_est = o.declaredHeadroom; row.headroom_basis = 'declared' }
    else if (row.pct_used != null && row.pct_used > 0 && row.pct_used < 100 && row.spend_usd != null) {
        row.headroom_usd_est = +(row.spend_usd / row.pct_used * (100 - row.pct_used)).toFixed(2); row.headroom_basis = 'estimate: spend / pct_used x (100 - pct_used)'
    } else if (typeof o.calibrationUsd === 'number' && row.spend_usd != null) {
        row.headroom_usd_est = Math.max(0, +(o.calibrationUsd - row.spend_usd).toFixed(2)); row.headroom_basis = 'estimate: spend of a window that hit its limit, minus spend so far'
    }
    if (row.status === 'limited') { row.headroom_usd_est = 0; row.headroom_basis = 'limited' }
    if (o.note) row.note = o.note
    row.cost_basis = 'assumed rate card (capacity.mjs RATES), API-equivalent; not a bill'
    return row
}

export function writeRow(file, row) {
    const db = load(file); db.rows ||= {}; db.rows[key(row)] = row
    fs.writeFileSync(file, JSON.stringify(db, null, 1) + '\n')
    return row
}
export function roomList(file, now) {
    return Object.values(load(file).rows || {}).sort((a, b) => key(a).localeCompare(key(b))).map(r => ({ ...r, room: hasRoom(r, now), age_min: Math.round((now - Date.parse(r.updated_at)) / 6e4) }))
}

if (process.argv[1]?.endsWith("capacity.mjs")) main()
function main() {
    const argv = process.argv.slice(2), cmd = argv[0]
    const all = k => argv.flatMap((a, i) => a === '--' + k ? [argv[i + 1]] : [])
    const opt = k => all(k)[0]
    const die = m => { console.error('capacity: ' + m); process.exit(2) }
    const now = new Date(opt('now') || process.env.CAPACITY_NOW || Date.now())
    const file = opt('file'); if (!file) die('--file capacity.json is required')
    if (cmd === 'list') {
        const rows = roomList(file, now)
        if (argv.includes('--json')) return console.log(JSON.stringify(rows, null, 1))
        if (!rows.length) return console.log('no rows')
        for (const r of rows) console.log(`${key(r)}\t${r.room ? 'ROOM' : 'no room'}\t${r.status}\theadroom ${r.headroom_usd_est ?? '?'} USD (${r.headroom_basis || 'none'})\t${r.age_min} min old`)
        return
    }
    if (cmd !== 'write') die('usage: write|list --file capacity.json')
    const environment = opt('environment'), account = opt('account')
    if (!ENVIRONMENTS.includes(environment)) die('--environment is one of ' + ENVIRONMENTS.join(', '))
    if (!account || !/^[a-z0-9._-]+$/i.test(account)) die('--account is a label such as angelo.B')
    let rateLimit; try { const j = opt('rate-limit') || (opt('rate-limit-file') && fs.readFileSync(opt('rate-limit-file'), 'utf8')); if (j) rateLimit = JSON.parse(j) } catch { die('rate limit input is not JSON') }
    const num = k => opt(k) == null ? undefined : Number(opt(k))
    const row = writeRow(file, buildRow({ environment, account, tier: opt('tier'), window: opt('window'), rateLimit, ledger: all('ledger'), usageLog: opt('usage-log'),
        declaredHeadroom: num('declared-headroom'), calibrationUsd: num('calibration-usd'), note: opt('note') }, now))
    console.log(`${key(row)}: ${row.status}, headroom ${row.headroom_usd_est ?? '?'} USD (${row.headroom_basis || 'unknown'}), updated ${row.updated_at}`)
}
