// The golden checks for the Mission view's rules (people/jose/design/mission/BRIEF.md). Runs model.js on the frozen
// snapshot (fixture.json, the real repository data at 3 November 2026 02:00 UTC), on small hand-made cases, and on
// every due: form on the board now; exits 1 if any fails. The cases hold for any implementation of the same rules.
//   node people/jose/design/mission/check.mjs
import { createRequire } from 'module'
import path from 'path'
import fs from 'fs'
const require = createRequire(import.meta.url)
const R = require('./model.js'), S = require('./scenarios.js'), fixture = require('./fixture.json')
let failed = 0, passed = 0
const eq = (what, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); ok ? passed++ : failed++; if (!ok) console.log(`FAIL ${what}\n  got  ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`) }
const T = s => Date.parse(s)

// 1. due dates
const DUE = {
    'Wed 4 Nov': ['date', '2026-11-04T23:59:00.000Z'], 'Tue 3 Nov, 13:00': ['date', '2026-11-03T13:00:00.000Z'], 'Mon 2 Nov, now': ['date', '2026-11-02T23:59:00.000Z'],
    'Tue 3 to Wed 4 Nov': ['date', '2026-11-04T23:59:00.000Z'], 'Wed 4 Nov, 12:00': ['date', '2026-11-04T12:00:00.000Z'], 'Sun 8 Nov': ['date', '2026-11-08T23:59:00.000Z'],
    'daily from Tue 3 Nov': ['recurring', null], 'first note Tue 3 Nov, then daily': ['recurring', null], 'from Wed 4 Nov': ['recurring', null], 'from Mon 2 Nov': ['recurring', null],
    'later': ['none', null], '': ['none', null],
}
for (const [s, [kind, at]] of Object.entries(DUE)) { const p = R.parseDue(s); eq(`parseDue(${JSON.stringify(s)})`, [p.kind, p.at == null ? null : new Date(p.at).toISOString()], [kind, at]) }
{   // every due: on the board now must be a date, recurring, or "later": a new form shows up here
    const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../../..')
    const forms = new Set(fs.readdirSync(path.join(root, 'board')).filter(f => /^WS-\d+.*\.md$/.test(f)).map(f => (fs.readFileSync(path.join(root, 'board', f), 'utf8').match(/^due:\s*(.*)$/m) || [, ''])[1].trim()))
    for (const s of forms) eq(`board due ${JSON.stringify(s)} is understood`, R.parseDue(s).kind !== 'none' || /^(later)?$/i.test(s), true)
    console.log(`${forms.size} distinct due forms on the board`)
}

// 2. schedules, as people/jose/agents.json writes them
eq('cron conductor', R.cronTimes('cron 20 7,12,17 * * * (UTC), a scheduled task'), ['07:20', '12:20', '17:20'])
eq('cron dev', R.cronTimes('cron 30 9,15 * * * (UTC)'), ['09:30', '15:30'])
eq('cron step', R.cronTimes('cron 57 */6 * * *'), ['00:57', '06:57', '12:57', '18:57'])
eq('cron weekly is not understood', R.cronTimes('cron 0 9 * * 1'), null)
eq('no cron', R.cronTimes('runs when Jose asks'), null)

// 3. health (schedule 07:20 and 12:20; the agent's first commit Tue 3 Nov 06:00)
const ag = runs => ({ schedule_utc: ['07:20', '12:20'], runs })
const H = (runs, now) => R.health(ag(runs), T(now), T(now)).state
eq('no slot due yet', H(['2026-11-03T06:00:00Z'], '2026-11-03T07:59:00Z'), 'ok')
eq('within the 40 min grace: not judged', H(['2026-11-03T06:00:00Z'], '2026-11-03T07:59:59Z'), 'ok')
eq('one slot missed after grace: Late', H(['2026-11-03T06:00:00Z'], '2026-11-03T08:01:00Z'), 'late')
eq('a commit 5 min before the slot counts', H(['2026-11-03T06:00:00Z', '2026-11-03T07:15:00Z'], '2026-11-03T08:01:00Z'), 'ok')
eq('a late run before the next slot counts', H(['2026-11-03T06:00:00Z', '2026-11-03T11:00:00Z'], '2026-11-03T11:05:00Z'), 'ok')
eq('two in a row missed: Quiet', H(['2026-11-03T06:00:00Z'], '2026-11-03T13:05:00Z'), 'quiet')
eq('ran at the newest slot after missing one: OK', H(['2026-11-03T06:00:00Z', '2026-11-03T12:22:00Z'], '2026-11-03T13:05:00Z'), 'ok')
eq('slots before the first commit do not count', H(['2026-11-03T12:30:00Z'], '2026-11-03T13:05:00Z'), 'ok')
eq('across midnight', R.health({ schedule_utc: ['23:50'], runs: ['2026-11-03T20:00:00Z', '2026-11-04T00:05:00Z'] }, T('2026-11-04T01:00:00Z'), T('2026-11-04T01:00:00Z')).state, 'ok')
eq('on demand is never judged', R.health({ schedule_utc: [], runs: ['2026-11-01T10:00:00Z'] }, T('2026-11-04T10:00:00Z'), T('2026-11-04T10:00:00Z')).state, 'on-demand')
eq('stale flag', R.health(ag(['2026-11-03T06:00:00Z']), T('2026-11-03T10:00:00Z'), T('2026-11-03T06:30:00Z')).stale, true)

// 4. the Open issues view (slice 7): done and dropped left out, grouped by when, filters, two files with one number
{
    const I = (id, due, status = 'open', picked_by = '', f = ['angelo', 'jose'], file) => ({ id, title: id, due, status, picked_by, for: f, file: file || id + '.md' })
    const issues = [I('WS-1', 'Mon 2 Nov'), I('WS-2', 'Wed 4 Nov, 12:00', 'picked', 'Angelo'), I('WS-3', 'Wed 4 Nov'), I('WS-4', 'Fri 6 Nov'), I('WS-5', 'Fri 20 Nov'),
        I('WS-6', 'daily from Tue 3 Nov'), I('WS-7', 'later'), I('WS-8', 'Wed 4 Nov', 'done'), I('WS-9', 'Thu 5 Nov', 'open', 'dropped by Dinis'),
        I('WS-10', 'Tue 3 Nov', 'open', '', ['dinis']), I('WS-10', 'Tue 3 Nov', 'open', 'dev@web-summit.jose', ['dinis'], 'WS-10-other.md')]
    const now = T('2026-11-04T10:00:00Z'), b = R.openBoard(issues, now, 'all')
    eq('open board: groups and counts', b.groups.map(g => [g.id, g.count]), [['overdue', 3], ['today', 2], ['week', 1], ['later', 1], ['ongoing', 1], ['nodate', 1]])
    eq('open board: done and dropped left out', [b.open, b.done], [9, 2])
    eq('open board: overdue, earliest first, then by number', b.groups[0].items.map(r => r.key), ['WS-1.md', 'WS-10.md', 'WS-10-other.md'])
    eq('open board: two files with one number both kept', b.groups[0].items.filter(r => r.id === 'WS-10').length, 2)
    eq('open board: a time on the due date counts', b.groups[1].items.map(r => r.id), ['WS-2', 'WS-3'])
    eq('open board: nobody picked', R.openBoard(issues, now, 'unpicked').shown, 7)
    eq('open board: mine (for: jose, or picked by Jose or his agents)', R.openBoard(issues, now, 'mine').shown, 8)
}

// 5. the whole view, in the four states of the screenshots
const want = {
    clear: { level: 'watch', starts: 'WS-33 is due in 22 h', counts: { overdue: 0, quiet: 0, decide: 0 }, agents: ['ok', 'ok', 'ok', 'on-demand'], stale: false, newCount: 10 },
    alert: { level: 'act', starts: 'WS-33 is 9 h overdue', counts: { overdue: 1, quiet: 1, decide: 1 }, agents: ['ok', 'ok', 'quiet', 'on-demand'], stale: false, newCount: 2 },
    stale: { level: 'act', starts: 'Choose the WS-39 broadcast route', counts: { overdue: 0, quiet: 0, decide: 3 }, agents: ['late', 'late', 'ok', 'on-demand'], stale: true, newCount: 0 },
    first: { level: 'act', starts: 'Choose the WS-39 broadcast route', counts: { overdue: 0, quiet: 0, decide: 3 }, agents: ['ok', 'ok', 'ok', 'on-demand'], stale: false, newCount: 28 },
}
for (const [k, s] of Object.entries(S.scenarios(fixture))) {
    const m = R.model(s.d, s.now, s.seen), w = want[k]
    eq(`${k}: attention level`, m.attn.level, w.level)
    eq(`${k}: attention text`, m.attn.text.slice(0, w.starts.length), w.starts)
    eq(`${k}: counts`, m.counts, w.counts)
    eq(`${k}: agents`, m.agents.map(a => a.h.state), w.agents)
    eq(`${k}: stale`, m.stale, w.stale)
    eq(`${k}: new since`, m.newCount, w.newCount)
}
console.log(failed ? `${failed} failed, ${passed} passed` : `OK: ${passed} checks passed`)
process.exit(failed ? 1 : 0)
