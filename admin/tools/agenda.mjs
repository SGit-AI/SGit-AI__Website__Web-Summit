#!/usr/bin/env node
// Add an item to a stand-up's agenda, or record what was decided. One file per item, so many people and agents add at once.
//   node admin/tools/agenda.mjs add --by <agent or person> --type decision|question|idea|sync --title "..." \
//        [--meeting next|after-next|<YYYY-MM-DD-HHMM>] [--for dinis,nimay|everyone] [--detail "..."] \
//        [--options "a|b"] [--recommend "..."] [--issue WS-NN]
//        [--link <site path, e.g. people/indi/agents/index.html>] [--link-text "..."]
//   node admin/tools/agenda.mjs decide --item <meeting id>/<file> --said "the decider's own words" --by dinis
//   node admin/tools/agenda.mjs next          (prints the next stand-up's id)
// Then commit data/meetings/ with the convention and release. Times are UTC (= Lisbon in November).
import fs from 'node:fs'
import path from 'node:path'
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const DIR = path.join(ROOT, 'data/meetings')
const S = JSON.parse(fs.readFileSync(path.join(DIR, 'schedule.json'), 'utf8'))
export function slots() {
    const out = [], d = new Date(S.from + 'T00:00:00Z'), end = new Date(S.until + 'T23:59:59Z')
    for (; d <= end; d.setUTCDate(d.getUTCDate() + 1)) for (const t of S.slots) {
        const day = d.toISOString().slice(0, 10), at = new Date(`${day}T${t}:00Z`)
        out.push({ id: `${day}-${t.replace(':', '')}`, at: at.toISOString(), day, time: t })
    }
    return out
}
const nextSlot = (n = 0, now = new Date()) => slots().filter(s => new Date(s.at) > now)[n]
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d }
const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)
const cmd = process.argv[2]
if (cmd === 'next') { console.log(nextSlot().id) }
else if (cmd === 'add') {
    const by = arg('by'), type = arg('type', 'question'), title = arg('title')
    if (!by || !title || !['decision', 'question', 'idea', 'sync'].includes(type)) { console.error('agenda: --by, --title and --type decision|question|idea|sync are required'); process.exit(2) }
    const m = arg('meeting', 'next'), meeting = m === 'next' ? nextSlot().id : m === 'after-next' ? nextSlot(1).id : m
    if (!slots().some(s => s.id === meeting)) { console.error(`agenda: no stand-up ${meeting} in data/meetings/schedule.json`); process.exit(2) }
    const now = new Date().toISOString(), item = { type, title, for: (arg('for', 'everyone')).split(',').map(x => x.trim()), by, added: now, status: 'open' }
    for (const k of ['detail', 'recommend', 'issue']) if (arg(k)) item[k] = arg(k)
    if (arg('link')) { item.link = arg('link').replace(/^\/+/, ''); if (arg('link-text')) item.link_text = arg('link-text') }
    if (arg('options')) item.options = arg('options').split('|').map(x => x.trim())
    const f = path.join(DIR, meeting, `${now.slice(0, 16).replace(/[-:]/g, '')}-${slug(title)}.json`)
    fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(item, null, 2) + '\n')
    console.log(`added to the ${meeting} stand-up: ${path.relative(ROOT, f)}`)
} else if (cmd === 'decide') {
    const f = path.join(DIR, arg('item') || ''), said = arg('said'), by = arg('by')
    if (!fs.existsSync(f) || !said || !by) { console.error('agenda: --item <meeting id>/<file>, --said and --by are required'); process.exit(2) }
    const item = JSON.parse(fs.readFileSync(f, 'utf8'))
    item.status = 'decided'; item.decided = { said, by, at: new Date().toISOString() }
    fs.writeFileSync(f, JSON.stringify(item, null, 2) + '\n'); console.log(`recorded: ${path.relative(ROOT, f)}`)
} else if (import.meta.url === `file://${process.argv[1]}`) { console.error('usage: agenda.mjs add|decide|next (see the top of this file)'); process.exit(2) }
