#!/usr/bin/env node
// Apply what a person decided on their cockpit (assets/cockpit.js), after the dashboard agent has drained its lane
// (admin/tools/feedback_drain.py) into its inbox vault. Written by dashboard@web-summit.dinis, 5 November 2026.
//
//   node admin/tools/cockpit_apply.mjs --person dinis --inbox ~/vaults/<inbox>/feedback [--dry]
//
// Only a message whose signature the drain VERIFIED against data/person-keys.json, signed by that person, is applied;
// anything else is listed and left alone (material, not instruction). Each answer is recorded in the person's own
// words, with when and where (WS-107):
//   - a stand-up item (data/meetings/<meeting>/<file>.json): decide/drop -> status decided; delegate -> status delegated,
//     with whom; now/later -> a priority the cockpit ranks on (the item stays open);
//   - a board issue (board/WS-NN-*.md, "Only you can do this"): done -> status: done; delegate -> picked_by; later -> later:.
// A file in the inbox is applied once, and every action's outcome is written BY ITS ID to people/<person>/cockpit-log.json
// (applied, with what was done; or refused, with why), which the build carries to the cockpit as `processed`, so the
// person's browser can tell sent-but-not-processed from processed (Dinis, 5 November).
// Prints the For: trailers the commit should carry (the delegate's conductor, and conductor@web-summit.dinis).
import fs from 'fs'
import path from 'path'
import os from 'os'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d }
const person = arg('person'), inbox = (arg('inbox') || '').replace(/^~/, os.homedir()), dry = process.argv.includes('--dry')
if (!person || !inbox) { console.error('cockpit_apply: --person <id> --inbox <the inbox vault\'s feedback folder>'); process.exit(2) }
const appliedF = path.join(ROOT, 'people', person, 'cockpit-log.json')
const applied = fs.existsSync(appliedF) ? JSON.parse(fs.readFileSync(appliedF, 'utf8')) : { about: `What happened to each action sent from ${person}'s cockpit, by its id: written by admin/tools/cockpit_apply.mjs when the dashboard agent processes its lane; read by the build (admin/build/cockpit.mjs) so the cockpit shows each action as processed. files: the inbox messages already handled.`, files: [], entries: [] }
applied.entries ??= []
const log = (it, status, result) => applied.entries.push({ uid: (it.cockpit && it.cockpit.uid) || it.id, ref: it.cockpit && it.cockpit.ref, action: it.cockpit && it.cockpit.action, title: it.cockpit && it.cockpit.title, status, result, sent_at: it.at, applied_at: new Date().toISOString() })
const team = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/team.json'), 'utf8')).members
const nameOf = id => (team.find(m => m.id === id) || { name: id }).name.split(' ')[0]
const files = fs.existsSync(inbox) ? fs.readdirSync(inbox).flatMap(d => fs.statSync(path.join(inbox, d)).isDirectory() ? fs.readdirSync(path.join(inbox, d)).filter(f => f.endsWith('.json')).map(f => path.join(inbox, d, f)) : []) : []
const forTo = new Set(), done = [], skipped = []

const setFront = (file, kv) => {   // set front-matter keys in a board file, keeping the rest as it is
    let s = fs.readFileSync(file, 'utf8'); const m = s.match(/^---\n([\s\S]*?)\n---\n/); if (!m) throw new Error(`${file}: no front matter`)
    let fm = m[1]
    for (const [k, v] of Object.entries(kv)) { const line = `${k}: ${v}`; fm = new RegExp(`^${k}:.*$`, 'm').test(fm) ? fm.replace(new RegExp(`^${k}:.*$`, 'm'), line) : fm + '\n' + line }
    if (!dry) fs.writeFileSync(file, s.replace(m[0], `---\n${fm}\n---\n`))
}

for (const f of files.sort()) {
    const id = path.basename(f)
    if (applied.files.includes(id)) continue
    const msg = JSON.parse(fs.readFileSync(f, 'utf8'))
    const ok = typeof msg.verified === 'string' && msg.verified.startsWith(`signed by ${person} (verified`)
    const items = (msg.items || []).filter(i => i.cockpit)
    if (!items.length) continue
    if (!ok) { skipped.push(`${id}: ${msg.verified || 'unsigned'}: not applied`); for (const it of items) log(it, 'refused', `not applied: ${msg.verified || 'unsigned'}`); applied.files.push(id); continue }
    for (const it of items) {
        const a = it.cockpit, when = `${(it.at || msg.sent_at).slice(0, 16).replace('T', ' ')} UTC`
        const said = `${a.option ? a.option + (a.words ? '. ' : '') : ''}${a.words || ''}`.trim()
        const words = `${said ? `"${said}" ` : ''}(${nameOf(person)}, ${when}, on the cockpit, signed with their key)`
        if (a.ref.startsWith('board/')) {
            const file = path.join(ROOT, a.ref); if (!fs.existsSync(file)) { skipped.push(`${a.ref}: no such issue`); log(it, 'refused', 'no such issue on the board'); continue }
            if (a.action === 'done') setFront(file, { status: 'done', done_said: JSON.stringify(`Done. ${words}`) })
            else if (a.action === 'delegate') { setFront(file, { picked_by: `${a.delegate_name}, ${a.delegate_agent} (delegated by ${nameOf(person)})`, delegated: JSON.stringify(`To ${a.delegate_name}. ${words}`) }); forTo.add(a.delegate_agent) }
            else if (a.action === 'later') setFront(file, { later: JSON.stringify(words) })
            else if (a.action === 'decide' || a.action === 'drop') setFront(file, { status: 'done', decided: JSON.stringify(`${a.action === 'drop' ? 'No decision needed. ' : ''}${words}`) })
            else if (a.action === 'mine') setFront(file, { picked_by: `${nameOf(person)} (said on the cockpit)`, status: 'picked' })
            else if (a.action === 'details' || a.action === 'note') { if (!dry) fs.appendFileSync(file, `\n\n**${a.action === 'details' ? `${nameOf(person)} needs more details` : `A note from ${nameOf(person)}`}:** ${words}\n`); const asker = (fs.readFileSync(file, 'utf8').match(/^agents:.*?([a-z0-9-]+@web-summit\.[a-z0-9-]+)/m) || [])[1]; if (asker && a.action === 'details') forTo.add(asker) }
            done.push(`${a.ref}: ${a.action}${a.delegate_name ? ' to ' + a.delegate_name : ''}`)
            log(it, 'applied', { done: `${a.issue || a.ref} marked done on the board`, delegate: `${a.issue || a.ref} picked by ${a.delegate_name}; told by a commit For:`, later: `${a.issue || a.ref}: later, recorded on the issue`, decide: `${a.issue || a.ref}: decided, in your words, and closed`, drop: `${a.issue || a.ref}: closed, no decision needed`, mine: `${a.issue || a.ref}: picked by you`, details: `${a.issue || a.ref}: your question is on the issue; whoever raised it is asked`, note: `${a.issue || a.ref}: your note is on the issue` }[a.action] || `${a.action}: recorded`)
        } else {
            const file = path.join(ROOT, 'data/meetings', a.ref); if (!fs.existsSync(file)) { skipped.push(`${a.ref}: no such agenda item`); log(it, 'refused', 'no such agenda item'); continue }
            const item = JSON.parse(fs.readFileSync(file, 'utf8')), at = new Date().toISOString()
            if (a.action === 'decide' || a.action === 'drop') { item.status = 'decided'; item.decided = { said: a.action === 'drop' ? `No decision needed. ${words}` : words, by: person, at, via: 'cockpit' } }
            else if (a.action === 'delegate') { item.status = 'delegated'; item.delegated = { to: a.delegate, agent: a.delegate_agent, said: words, by: person, at }; forTo.add(a.delegate_agent) }
            else if (a.action === 'now' || a.action === 'later') item.priority = { set: a.action, said: words, by: person, at }
            else if (a.action === 'mine') { item.priority = { set: 'now', said: `Mine. ${words}`, by: person, at }; item.owner = person }
            else if (a.action === 'details') { (item.details_requested ??= []).push({ said: words, by: person, at }); if (item.by) forTo.add(item.by) }
            else if (a.action === 'note') (item.notes ??= []).push({ said: words, by: person, at })
            if (!dry) fs.writeFileSync(file, JSON.stringify(item, null, 2) + '\n')
            done.push(`${a.ref}: ${a.action}${a.delegate_name ? ' to ' + a.delegate_name : ''}`)
            log(it, 'applied', { decide: 'recorded as decided on the agenda, in your words', drop: 'closed on the agenda: no decision needed', delegate: `delegated to ${a.delegate_name} on the agenda; told by a commit For:`, now: 'priority set: do this first', later: 'priority set: later', mine: 'yours, at the top of your list', details: `your question is on the item; ${item.by || 'whoever raised it'} is asked`, note: 'your note is on the item' }[a.action] || `${a.action}: recorded`)
        }
    }
    applied.files.push(id)
}
if (!dry && (done.length || skipped.length)) fs.writeFileSync(appliedF, JSON.stringify(applied, null, 2) + '\n')
console.log(done.length ? `applied ${done.length}:\n  ${done.join('\n  ')}` : 'cockpit_apply: nothing new to apply')
if (skipped.length) console.log(`not applied:\n  ${skipped.join('\n  ')}`)
if (done.length) console.log(`trailers:\n${['conductor@web-summit.dinis', ...forTo].map(x => `For: ${x}`).join('\n')}`)
