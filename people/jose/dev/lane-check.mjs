#!/usr/bin/env node
// lane-check.mjs: is the site's lane for an agent still sealed to that agent's live key? (WS-74 item 5, dev@web-summit.jose,
// 4 November 2026). Public feedback is sealed to the recipient in assets/feedback.json; if that is a session key whose
// session has ended, every answer sent from then on is lost. Run it in the agent's own session, on every run:
//   node people/jose/dev/lane-check.mjs --live sha256:<this session's encryption fingerprint, from pki-agent.mjs whoami>
//   node people/jose/dev/lane-check.mjs [--agent vault@web-summit.jose]   the repository's own consistency only
// It reads only public files, prints no key, and exits 1 when something is wrong.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const pem = s => String(s || '').replace(/\s+/g, '')

export function checkLane(feedback, keys, { agent = 'vault@web-summit.jose', live } = {}) {
    const problems = [], lanes = feedback.lanes || [feedback]
    const lane = lanes.find(l => l.agent === agent)
    if (!lane) return { ok: false, problems: [`no lane for ${agent} in assets/feedback.json lanes[]: answers cannot be sent to it`] }
    const r = lane.recipient || {}
    const entry = (keys.keys || []).find(k => k.id === r.keys_page_id)
    if (!entry) problems.push(`the lane names keys page id "${r.keys_page_id}", which is not in data/keys.json`)
    else {
        if (entry.bundle.fingerprint !== r.fingerprint) problems.push(`the lane is sealed to ${r.fingerprint}, but the keys page says ${entry.id} is ${entry.bundle.fingerprint}`)
        if (pem(entry.bundle.encrypt) !== pem(r.encrypt)) problems.push(`the lane's public key is not the one published as ${entry.id}`)
    }
    if (live !== undefined && live !== r.fingerprint) problems.push(`this session's key is ${live || '(none given)'}, but the lane is sealed to ${r.fingerprint}: answers sent now cannot be opened here. Publish this session's key and ask the owner of assets/feedback.json to update the recipient`)
    return { ok: !problems.length, lane: { agent, vault_id: lane.vault_id, sealed_to: r.fingerprint, keys_page_id: r.keys_page_id }, problems }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const arg = n => { const i = process.argv.indexOf('--' + n); return i > 0 ? (process.argv[i + 1] ?? '') : undefined }
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
    const read = f => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'))
    const r = checkLane(read('assets/feedback.json'), read('data/keys.json'), { agent: arg('agent') || undefined, live: arg('live') })
    console.log(JSON.stringify(r, null, 2))
    process.exit(r.ok ? 0 : 1)
}
