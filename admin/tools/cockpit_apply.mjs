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
// A file in the inbox is applied once: its name is recorded in people/<person>/cockpit-applied.json.
// Prints the For: trailers the commit should carry (the delegate's conductor, and conductor@web-summit.dinis).
import fs from 'fs'
import path from 'path'
import os from 'os'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d }
const person = arg('person'), inbox = (arg('inbox') || '').replace(/^~/, os.homedir()), dry = process.argv.includes('--dry')
if (!person || !inbox) { console.error('cockpit_apply: --person <id> --inbox <the inbox vault\'s feedback folder>'); process.exit(2) }
const appliedF = path.join(ROOT, 'people', person, 'cockpit-applied.json')
const applied = fs.existsSync(appliedF) ? JSON.parse(fs.readFileSync(appliedF, 'utf8')) : { about: `Messages from ${person}'s cockpit already applied by admin/tools/cockpit_apply.mjs (file names in the dashboard agent's inbox vault).`, files: [] }
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
    if (!ok) { skipped.push(`${id}: ${msg.verified || 'unsigned'}: not applied`); continue }
    for (const it of items) {
        const a = it.cockpit, when = `${(it.at || msg.sent_at).slice(0, 16).replace('T', ' ')} UTC`
        const said = `${a.option ? a.option + (a.words ? '. ' : '') : ''}${a.words || ''}`.trim()
        const words = `${said ? `"${said}" ` : ''}(${nameOf(person)}, ${when}, on the cockpit, signed with their key)`
        if (a.ref.startsWith('board/')) {
            const file = path.join(ROOT, a.ref); if (!fs.existsSync(file)) { skipped.push(`${a.ref}: no such issue`); continue }
            if (a.action === 'done') setFront(file, { status: 'done', done_said: JSON.stringify(`Done. ${words}`) })
            else if (a.action === 'delegate') { setFront(file, { picked_by: `${a.delegate_name}, ${a.delegate_agent} (delegated by ${nameOf(person)})`, delegated: JSON.stringify(`To ${a.delegate_name}. ${words}`) }); forTo.add(a.delegate_agent) }
            else if (a.action === 'later') setFront(file, { later: JSON.stringify(words) })
            done.push(`${a.ref}: ${a.action}${a.delegate_name ? ' to ' + a.delegate_name : ''}`)
        } else {
            const file = path.join(ROOT, 'data/meetings', a.ref); if (!fs.existsSync(file)) { skipped.push(`${a.ref}: no such agenda item`); continue }
            const item = JSON.parse(fs.readFileSync(file, 'utf8')), at = new Date().toISOString()
            if (a.action === 'decide' || a.action === 'drop') { item.status = 'decided'; item.decided = { said: a.action === 'drop' ? `No decision needed. ${words}` : words, by: person, at, via: 'cockpit' } }
            else if (a.action === 'delegate') { item.status = 'delegated'; item.delegated = { to: a.delegate, agent: a.delegate_agent, said: words, by: person, at }; forTo.add(a.delegate_agent) }
            else if (a.action === 'now' || a.action === 'later') item.priority = { set: a.action, said: words, by: person, at }
            if (!dry) fs.writeFileSync(file, JSON.stringify(item, null, 2) + '\n')
            done.push(`${a.ref}: ${a.action}${a.delegate_name ? ' to ' + a.delegate_name : ''}`)
        }
    }
    applied.files.push(id)
}
if (!dry && done.length) fs.writeFileSync(appliedF, JSON.stringify(applied, null, 2) + '\n')
console.log(done.length ? `applied ${done.length}:\n  ${done.join('\n  ')}` : 'cockpit_apply: nothing new to apply')
if (skipped.length) console.log(`not applied:\n  ${skipped.join('\n  ')}`)
if (done.length) console.log(`trailers:\n${['conductor@web-summit.dinis', ...forTo].map(x => `For: ${x}`).join('\n')}`)
