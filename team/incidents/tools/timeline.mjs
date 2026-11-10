#!/usr/bin/env node
// timeline.md -> signals.json (incident.dev@web-summit.dinis, 10 November 2026, WS-214). The lead keeps the timeline as a markdown
// table (UTC | Signal or decision | Source); this turns just that table into data, so the dashboard and Vicky's agents read JSON
// and the markdown stays the one place it is written. Each row gets:
//   at      ISO time (UTC); approx: true when the cell says "~"
//   kind    signal (a report someone else made: press, social; the text starts "signal" or the source is "via social.watch@"), official (read directly from the body that decides or warns),
//           team (our own record: a word from Dinis, a declaration)
//   label   evidence for a signal (second-hand, carries its source), fact for official and team rows
//   decision  true when the text starts "DECISION" (the lead's mark for a decision that happened)
//   (a row with a press or social link and no official source counts as a signal too)
//   text, sources [{ label, url }]
// Usage: node team/incidents/tools/timeline.mjs <incident dir>   (reads timeline.md, writes data/signals.json)
import fs from 'node:fs'
import path from 'node:path'

const dir = process.argv[2]
if (!dir) { console.error('usage: timeline.mjs <incident dir>'); process.exit(2) }
const md = fs.readFileSync(path.join(dir, 'timeline.md'), 'utf8')
const YEAR = (md.match(/\b(20\d\d)\b/) || [, String(new Date().getUTCFullYear())])[1]
const MON = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 }
const OFFICIAL = /\bIPMA\b|portugal\.gov\.pt|websummit\.com|Web Summit's (?:email|site|own)|ANEPC|S41|desks\/weather-vicky/
// a press or social link with no official source in the cell: a report someone else made
const PRESS = src => /\]\(https:\/\//.test(src) && !OFFICIAL.test(src)
const plain = s => s.replace(/\*\*/g, '').replace(/`/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim()

const rows = []
for (const line of md.split('\n')) {
    if (!line.startsWith('|')) continue
    const cells = line.replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(c => c.trim())
    const m = cells[0].match(/^(\d{1,2}) ([A-Z][a-z]{2}),?\s*(~)?(\d{1,2}):(\d\d)$/)
    if (!m || cells.length < 3) continue
    const at = `${YEAR}-${String(MON[m[2]]).padStart(2, '0')}-${m[1].padStart(2, '0')}T${m[4].padStart(2, '0')}:${m[5]}Z`
    const raw = cells[1], src = cells.slice(2).join(' | ')
    // a signal: the text says so ("signal:", "signal (unofficial):"), or the row is a press read relayed by the signals desk
    const signal = /^signal\b[^:]{0,30}:/i.test(raw) || /via social\.watch@/.test(src) || PRESS(src), team = !signal && !OFFICIAL.test(src)
    const kind = signal ? 'signal' : team ? 'team' : 'official'
    const sources = [...src.matchAll(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g)].map(([, label, url]) => ({ label, url }))
    const rest = plain(src.replace(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g, '')).replace(/^[,;\s]+/, '')
    if (rest) sources.push({ label: rest, url: null })
    rows.push({ at, approx: !!m[3], kind, label: signal ? 'evidence' : 'fact', key: /\*\*/.test(raw), decision: /^\**DECISION\b/.test(raw), text: plain(raw.replace(/^signal:\s*/i, '').replace(/^signal \(([^)]+)\):\s*/i, '($1) ')), sources })
}
rows.sort((a, b) => a.at.localeCompare(b.at))
const out = { about: 'The incident timeline as data, made from timeline.md by team/incidents/tools/timeline.mjs (never edit by hand; edit timeline.md). See README.md.', source: path.join(dir, 'timeline.md'), made_at: new Date().toISOString().slice(0, 16) + 'Z', items: rows }
fs.mkdirSync(path.join(dir, 'data'), { recursive: true })
fs.writeFileSync(path.join(dir, 'data', 'signals.json'), JSON.stringify(out, null, 1) + '\n')
console.log(`${path.join(dir, 'data', 'signals.json')}: ${rows.length} items (${['signal', 'official', 'team'].map(k => rows.filter(r => r.kind === k).length + ' ' + k).join(', ')})`)
