// Run: node people/jose/design/command-centre/preview-data.mjs . > snap.json  (from the repository root; prints JSON, writes nothing)
// Snapshot of the public repository data Jose's command centre needs. Prototype for dev's people/jose/app/data.mjs.
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
const ROOT = process.argv[2], P = 'jose'
const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8')
const fm = t => { const m = t.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/), o = {}; if (m) for (const l of m[1].split('\n')) { const i = l.indexOf(':'); if (i > 0) o[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"|"$/g, '') } return { meta: o, body: m ? m[2] : t } }
// due: the last "<d> Nov" in the field, end of that day UTC (Lisbon = UTC in November); "now" and "later" have none
const dueAt = s => { const all = [...(s || '').matchAll(/(\d{1,2}) Nov/g)]; if (!all.length) return null; const d = +all.at(-1)[1]; return new Date(Date.UTC(2026, 10, d, 23, 59)).toISOString() }
const git = a => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 << 20 })

const issues = fs.readdirSync(path.join(ROOT, 'board')).filter(f => /^WS-\d+.*\.md$/.test(f)).map(f => {
  const { meta } = fm(rd('board/' + f)); const fr = (meta.for || '').split(/,\s*/).filter(Boolean)
  return { id: meta.id, title: meta.title, area: meta.area, for: fr, due: meta.due, due_at: dueAt(meta.due), status: (meta.status || 'open').toLowerCase(), picked_by: meta.picked_by || '', file: 'board/' + f }
}).filter(i => (i.for.includes(P) || /jose/i.test(i.picked_by)) && i.status !== 'done')
  .map(i => ({ ...i, group: i.id === 'WS-39' || /whatsapp|slack|n8n|broadcast|automation/i.test(i.title) ? 'channels' : i.area === 'tech' ? 'tech' : 'other', with_angelo: i.for.includes('angelo') }))

const agentsJson = JSON.parse(rd('people/jose/agents.json'))
const cronOf = s => (s.match(/cron ([0-9,*\/ ]+?) \*/) || [])[1]
const names = ['conductor', 'dashboard', 'dev', 'designer']
const log = git(['log', '--since=4 days ago', '--format=%x1e%h%x1f%cI%x1f%s%x1f%b']).split('\x1e').filter(Boolean).map(c => { const [h, at, s, b] = c.split('\x1f'); return { h, at, s, b: b || '' } })
const work = log.filter(c => !/^site v\d/.test(c.s))
const agents = names.map(n => {
  const full = `${n}@web-summit.${P}`, a = agentsJson.find(x => x.name === full) || {}
  const mine = work.filter(c => c.s.startsWith(full + ':') || c.b.includes('Agent: ' + full))
  const cron = a.schedule ? cronOf(a.schedule) : null // "M H,H" -> minute and hours
  const [min, hrs] = cron ? cron.split(' ') : []
  return { name: n, full, in_agents_json: !!a.name, schedule_utc: cron ? hrs.split(',').map(h => `${h.padStart(2, '0')}:${min.padStart(2, '0')}`) : [], runs: mine.slice(0, 20).map(c => c.at), last_commit: mine[0] ? { h: mine[0].h, at: mine[0].at, s: mine[0].s.replace(full + ': ', '') } : null }
})

// what is new for Jose: his agents' commits, commits For: jose, and other agents' commits on his issues
const ids = new Set(issues.map(i => i.id))
const feed = work.filter(c => c.s.includes('@web-summit.jose:') || /^For: .*\bjose\b/m.test(c.b) || [...`${c.s} ${c.b}`.matchAll(/WS-\d+/g)].some(m => ids.has(m[0])))
  .slice(0, 30).map(c => ({ h: c.h, at: c.at, who: (c.s.match(/^([a-z0-9-]+@web-summit\.[a-z]+):/) || [])[1] || '', s: c.s.replace(/^[^:]+: /, ''), for_jose: /^For: .*\bjose\b/m.test(c.b) }))

const nextMeetings = fs.readdirSync(path.join(ROOT, 'data/meetings')).filter(d => /^\d{4}-\d\d-\d\d-\d{4}$/.test(d)).sort()
const standup = nextMeetings.flatMap(m => fs.readdirSync(path.join(ROOT, 'data/meetings', m)).filter(f => f.endsWith('.json')).map(f => ({ m, ...JSON.parse(rd(`data/meetings/${m}/${f}`)) })))
  .filter(x => (x.for || []).includes(P) && x.status === 'open').map(x => ({ meeting: x.m, type: x.type, title: x.title, by: x.by, issue: x.issue || '' }))

const briefF = fs.readdirSync(path.join(ROOT, 'people/jose/briefs')).filter(f => f.endsWith('.json')).sort().at(-1)
const brief = JSON.parse(rd('people/jose/briefs/' + briefF))
const mentorF = fs.readdirSync(path.join(ROOT, 'people/jose/mentor')).filter(f => /^\d{4}-.*\.md$/.test(f)).sort().at(-1)
const mentorBody = rd('people/jose/mentor/' + mentorF)
const mentorLine = (mentorBody.split('## Suggestions')[1] || '').split('\n').find(l => /^\d\./.test(l)) || ''
const repF = fs.readdirSync(path.join(ROOT, 'content/reports')).filter(f => /^\d{4}-\d\d-\d\d-\d{4}\.md$/.test(f)).sort().at(-1)
const rep = fm(rd('content/reports/' + repF)).meta

console.log(JSON.stringify({
  built_at: new Date().toISOString(), version: rd('admin/build/version.txt').trim(),
  opening_night: '2026-11-09T18:00:00Z', standups_utc: ['13:00', '18:00'],
  issues, agents, feed, standup,
  brief: { n: brief.number, title: brief.title, when: brief.when, asks: brief.for_you.map(x => x.ask), file: 'people/jose/briefs/' + briefF.replace('.json', '.pdf') },
  mentor: { file: 'people/jose/mentor/' + mentorF, at: mentorF.replace('.md', ''), line: mentorLine.replace(/^\d\.\s*/, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') },
  report: { slug: repF.replace('.md', ''), title: rep.title, link: `https://web-summit.sgit.ai/reports/${repF.replace('.md', '')}/` },
}, null, 1))
