#!/usr/bin/env node
// The follow-up list's drop box (WS-217, followups@web-summit.indi, 13 November 2026, at Indi's word; run by
// conductor@web-summit.indi). /crm/follow-ups/ saves by sealing the WHOLE updated list in the browser to the same
// audience (assets/crm-seal.js, ws-crm-env-1), signing it with the person's own key (WSKeyring.sign), and appending it
// to this drop box's lane with a write-only token. This tool files the newest valid save into the private CRM.
// The tool never opens the list: it checks the signature and the envelope's shape, and moves ciphertext.
//
//   SG_SEND_ACCESS_TOKEN=... node admin/tools/crm_followups.mjs lane
//       once: a vault with an append lane on dev.send.sgraph.ai; the drain credentials (append token, enum key, vault key)
//       go to ~/.sg-send/lanes/follow-ups.json (0600, never in a repository); the PUBLIC part (host, vault id, the
//       write-only append token) to assets/crm-follow-ups.json, which turns saving on in the page. Commit that file.
//   SG_SEND_ACCESS_TOKEN=... node admin/tools/crm_followups.mjs drain --vault <clone of ws-team-crm-private> [--dry]
//       list the lane, check each save, write the newest valid one to <vault>/actions/<id>.sealed.json, sgit commit
//       and push, and only then mark the lane's files processed (a failed push loses nothing). Prints no secret.
//
// A save is accepted only if: it is for the one record this lane serves; it is signed by a person in that record's
// audience, with their active key on data/person-keys.json; the new envelope's audience and agents are exactly the
// current record's; every recipient entry names that person's or agent's current key. Everything else is logged by
// id and reason and marked processed, so a stranger holding the public token can fill nothing but the log.
import fs from 'fs'
import path from 'path'
import os from 'os'
import crypto from 'crypto'
import { execFileSync } from 'child_process'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const HOST = 'https://dev.send.sgraph.ai'
const RECORD = 'actions/2026-11-13-ws-follow-ups.sealed.json', RECORD_ID = '2026-11-13-ws-follow-ups'
const AUDIENCE = ['dinis', 'silvio', 'angelo', 'jose', 'vicky', 'indi'], AGENTS = ['crm-dinis']
const AGENT = 'conductor@web-summit.indi'
const CREDS = path.join(os.homedir(), '.sg-send/lanes/follow-ups.json')
const PUBLIC = path.join(ROOT, 'assets/crm-follow-ups.json')
const args = process.argv.slice(2), cmd = args[0]
const opt = k => { const i = args.indexOf('--' + k); return i < 0 ? null : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) }
const fail = m => { console.error('crm_followups: ' + m); process.exit(1) }
const rj = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const h = s => crypto.createHash('sha256').update(s).digest('hex')
const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort())

async function post(url, body, headers = {}) {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) })
    if (!r.ok) fail(`${url.split('/api/')[1]} answered ${r.status}`)
    return r.json().catch(() => ({}))
}
const lane = (c, op, body) => post(`${c.host}/api/vault/append/${op}/${c.vault_id}`, body, { 'x-sgraph-vault-enum-key': c.enum_key })

// ---------- lane: make the drop box (once) ----------
async function makeLane() {
    if (fs.existsSync(CREDS)) fail(`${CREDS} exists: the drop box is made already`)
    const token = process.env.SG_SEND_ACCESS_TOKEN || fail('SG_SEND_ACCESS_TOKEN is not set (your own token, never a person\'s)')
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fu-lane-')), name = 'dropbox-ws-follow-ups'
    try {
        const sg = (cwd, ...a) => execFileSync('sgit', a, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }).toString()
        sg(tmp, 'create', name, '--base-url', HOST, '--token', token, '--no-push')
        const d = path.join(tmp, name)
        fs.writeFileSync(path.join(d, 'README.md'), `# The follow-up list's drop box\n\nSaves from web-summit.sgit.ai/crm/follow-ups/ arrive on this vault's append lane: each one is the whole list, sealed in the browser to the list's audience and signed by the person who saved it. ${AGENT} files the newest valid save into ws-team-crm-private with admin/tools/crm_followups.mjs drain (WS-217). The drop box itself never holds the list in clear.\n`)
        sg(d, 'commit', 'the follow-up list\'s drop box (WS-217)'); sg(d, 'push')
        const vk = fs.readFileSync(path.join(d, '.sg_vault/local/vault_key'), 'utf8').trim(), vault_id = vk.split(':').pop()
        const writeKey = execFileSync('python3', ['-I', '-c', 'import sys,json;from sgit_ai.crypto.Vault__Crypto import Vault__Crypto;print(Vault__Crypto().derive_keys_from_vault_key(sys.stdin.read().strip())["write_key"])'], { input: vk }).toString().trim()
        const append_token = crypto.randomBytes(32).toString('hex'), enum_key = crypto.randomBytes(32).toString('hex')
        const r = await post(`${HOST}/api/vault/append/configure/${vault_id}`, { append_anchors: [h(append_token)], enum_key_hash: h(enum_key) }, { 'x-sgraph-vault-write-key': writeKey, 'x-sgraph-access-token': token })
        if (r.status !== 'configured') fail(`configure answered ${r.status}`)
        fs.mkdirSync(path.dirname(CREDS), { recursive: true })
        fs.writeFileSync(CREDS, JSON.stringify({ host: HOST, vault_id, vault_key: vk, append_token, enum_key, vault_name: name }, null, 1), { mode: 0o600 })
        fs.writeFileSync(PUBLIC, JSON.stringify({
            about: `The follow-up list's drop box (WS-217, admin/tools/crm_followups.mjs). Public on purpose: the append token can write to the lane and nothing else (it cannot list, read or delete). The page seals the whole list to its audience and signs it with the saver's key before it appends; ${AGENT} files only signed saves from the audience. No key and no contact is here.`,
            agent: AGENT, host: HOST, vault_id, append_token, record: RECORD, audience: AUDIENCE, agents: AGENTS
        }, null, 2) + '\n')
        console.log(`crm_followups: drop box ${vault_id} made; drain credentials in ${CREDS}; commit assets/crm-follow-ups.json to turn saving on`)
    } finally { fs.rmSync(tmp, { recursive: true, force: true }) }
}

// ---------- drain: file the newest valid save ----------
function check(msg, current) {
    if (!msg || msg.v !== 'ws-followups-save-1') return 'not a follow-up save'
    if (msg.path !== RECORD) return 'not this list'
    if (typeof msg.env_json !== 'string' || msg.env_json.length > 400000) return 'no envelope, or too big'
    const sg = msg.signed || {}
    const pk = rj(path.join(ROOT, 'data/person-keys.json')).keys.filter(k => k.status == null || k.status === 'active')
    const k = pk.find(x => x.person === sg.person && x.fingerprint === sg.key)
    if (!k) return `not signed with an active site key (${sg.person || '?'})`
    if (!AUDIENCE.includes(sg.person)) return `${sg.person} is not in the list's audience`
    const ok = crypto.verify('sha256', Buffer.from(msg.env_json), { key: { kty: 'EC', crv: 'P-256', x: k.sign.x, y: k.sign.y }, format: 'jwk', dsaEncoding: 'ieee-p1363' }, Buffer.from(sg.sig || '', 'base64'))
    if (!ok) return 'signature invalid'
    let env; try { env = JSON.parse(msg.env_json) } catch { return 'envelope is not JSON' }
    if (env.v !== 'ws-crm-env-1' || env.id !== RECORD_ID || typeof env.ct !== 'string' || typeof env.iv !== 'string') return 'envelope shape'
    if (!same(env.audience || [], current.audience) || !same(env.agents || [], current.agents || [])) return 'audience changed'
    const ak = rj(path.join(ROOT, 'data/keys.json')).keys
    for (const r of env.recipients || []) {
        const want = current.audience.includes(r.to) ? (pk.find(x => x.person === r.to) || {}).fingerprint : ((ak.find(x => x.id === r.to) || {}).bundle || {}).fingerprint
        if (!want || r.key !== want) return `recipient ${r.to} is not sealed to their current key`
    }
    if ((env.recipients || []).length !== current.audience.length + (current.agents || []).length) return 'recipients missing'
    return { env, by: sg.person, at: env.at, base: msg.base_at }
}
async function drain() {
    const c = fs.existsSync(CREDS) ? rj(CREDS) : fail(`no ${CREDS}: run lane first`)
    const vault = opt('vault'); if (!vault || vault === true) fail('--vault <your clone of ws-team-crm-private>')
    const target = path.join(path.resolve(String(vault)), RECORD)
    if (!fs.existsSync(target)) fail(`${target} does not exist: is --vault the private CRM?`)
    let entries = [], after = null
    for (;;) { const r = await lane(c, 'list', { include_content: false, ...(after ? { after_file_id: after } : {}) }); const p = r.entries || []; entries.push(...p); if (!r.truncated || !p.length) break; after = p[p.length - 1].file_id }
    const mine = entries.filter(e => e.inbox === c.append_token)
    if (!mine.length) return console.log('crm_followups: the drop box is empty')
    if (opt('dry')) return console.log(`crm_followups: ${mine.length} pending (dry run, nothing fetched)`)
    const current = rj(target), saves = [], seen = []
    for (let i = 0; i < mine.length; i += 20) {
        const ids = mine.slice(i, i + 20).map(e => e.file_id)
        for (const f of (await lane(c, 'fetch', { inbox: c.append_token, file_ids: ids })).files || []) {
            seen.push(f.file_id)
            let msg; try { msg = JSON.parse(Buffer.from(f.content, 'base64').toString('utf8')) } catch { msg = null }
            const r = check(msg, current)
            if (typeof r === 'string') console.log(`crm_followups: ${f.file_id} refused: ${r}`); else saves.push(r)
        }
    }
    saves.sort((a, b) => String(a.at).localeCompare(String(b.at)))
    const best = saves.pop()
    if (best && String(best.at) > String(current.at)) {
        fs.writeFileSync(target, JSON.stringify(best.env))
        if (best.base !== current.at) console.log(`crm_followups: note: ${best.by}'s save was made on an older copy (${best.base}); a save made in between may be lost`)
        if (saves.length) console.log(`crm_followups: ${saves.length} older save(s) in this run superseded by the newest`)
        const sg = (...a) => execFileSync('sgit', a, { cwd: path.resolve(String(vault)), stdio: ['ignore', 'pipe', 'pipe'] }).toString()
        try { sg('commit', '-m', `the follow-up list, saved by ${best.by} at ${best.at} (WS-217)`) } catch (e) { if (!/nothing to commit/i.test(String(e.stdout) + String(e.stderr))) throw e }
        const tok = process.env.SG_SEND_ACCESS_TOKEN
        sg('push', ...(tok ? ['--token', tok] : []))
        console.log(`crm_followups: filed ${best.by}'s save of ${best.at} to ${RECORD} and pushed`)
    } else console.log('crm_followups: nothing newer than the filed list')
    const moved = (await lane(c, 'mark-processed', { inbox: c.append_token, file_ids: seen })).moved || []
    console.log(`crm_followups: ${moved.length} lane file(s) marked processed`)
}

if (cmd === 'lane') await makeLane()
else if (cmd === 'drain') await drain()
else fail('usage: crm_followups.mjs lane | drain --vault <dir> [--dry]')
