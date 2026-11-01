#!/usr/bin/env node
// The start and end banners every session report opens and closes with (team/conductor/WAKE.md).
// Inner width 68; start and end are unmistakably different; content before decoration.
//   node admin/tools/banner.mjs start <agent> --kind K --objective O [--commit C] [--plan "a|b"]
//   node admin/tools/banner.mjs end <agent> --started ISO --release R --achieved "a|b" --blockers "a|b" --for-you "a|b" --next N [--outcome ok]
//   node admin/tools/banner.mjs hold <agent> --reason R
import { pathToFileURL } from 'url'
const W = 68
const now = () => new Date().toISOString().replace(/\.\d+Z$/, 'Z')

function wrap(text, width) {
    const out = []
    for (const para of String(text).split('\n')) {
        let line = ''
        for (const word of para.split(/\s+/).filter(Boolean)) {
            if ((line + ' ' + word).trim().length > width) { if (line) out.push(line); line = word.length > width ? word.slice(0, width) : word }
            else line = (line + ' ' + word).trim()
        }
        out.push(line)
    }
    return out
}

export function box(kind, title, rows) {
    const [tl, tr, bl, br, h, v] = kind === 'start' ? ['╔', '╗', '╚', '╝', '═', '║'] : kind === 'end' ? ['┏', '┓', '┗', '┛', '━', '┃'] : ['#', '#', '#', '#', '#', '#']
    const line = s => `${v} ${s.padEnd(W - 2)} ${v}`
    const out = [tl + h.repeat(W) + tr, line(title), line(''.padEnd(W - 2, kind === 'start' ? '▶' : kind === 'end' ? '■' : '!'))]
    for (const [k, val] of rows) {
        const items = Array.isArray(val) ? val : [val]
        const label = `${k.toUpperCase()}`.padEnd(11)
        items.filter(x => x !== undefined && x !== '').forEach((it, n) => {
            wrap(Array.isArray(val) ? `- ${it}` : it, W - 2 - 11).forEach((w, j) => out.push(line(((n === 0 && j === 0) ? label : ' '.repeat(11)) + w)))
        })
    }
    out.push(bl + h.repeat(W) + br)
    return out.join('\n')
}

export function args(argv) {
    const o = { _: [] }
    for (let i = 0; i < argv.length; i++) if (argv[i].startsWith('--')) o[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; else o._.push(argv[i])
    return o
}
const list = s => (s && s !== true ? String(s).split('|').map(x => x.trim()).filter(Boolean) : ['none'])

export function banner(which, agent, o) {
    const who = `${agent}@web-summit`
    if (which === 'start') return box('start', `START  ${who}  ${o.at || now()}`, [['kind', o.kind || 'unstated'], ['objective', o.objective || 'unstated'], ['commit', o.commit || 'unknown'], ['plan', list(o.plan)]])
    if (which === 'end') return box('end', `END    ${who}  ${now()}`, [['started', o.started || 'unknown'], ['outcome', o.outcome || 'ok'], ['release', o.release || 'none'], ['achieved', list(o.achieved)], ['blockers', list(o.blockers)], ['for you', list(o['for-you'])], ['next', o.next || 'unstated']])
    if (which === 'hold') return box('hold', `HOLD   ${who}  ${now()}`, [['reason', o.reason || 'see team/*/HOLD.md'], ['do', 'no work: print the end banner with --outcome hold and stop']])
    throw new Error(`unknown banner: ${which}`)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    const o = args(process.argv.slice(2)), [which, agent] = o._
    if (!which || !agent) { console.error('usage: banner.mjs start|end|hold <agent> [--options]'); process.exit(2) }
    console.log(banner(which, agent, o))
}
