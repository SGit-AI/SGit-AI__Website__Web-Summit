#!/usr/bin/env node
// pulse-count.mjs: check-ins per slot, from people/*/pulse/ (WS-41 step 1, dev@web-summit.jose, 4 November 2026).
// The measure for the reminder test: run it before and after the reminder line goes into a conductor's prompt.
//   node people/jose/dev/pulse-count.mjs [--person jose] [--json]
// Reads only file names (people/<id>/pulse/<YYYY-MM-DD>-<morning|midday|evening>.md); never prints what anyone wrote.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const SLOTS = ['morning', 'midday', 'evening']

// files: [{ person, name }] -> { days: { 'YYYY-MM-DD': { morning: [ids], midday: [...], evening: [...] } }, total, by_person }
export function count(files, { person } = {}) {
    const days = {}, by_person = {}
    let total = 0
    for (const f of files) {
        if (person && f.person !== person) continue
        const m = f.name.match(/^(\d{4}-\d{2}-\d{2})-(morning|midday|evening)\.md$/)
        if (!m) continue
        const d = (days[m[1]] ||= Object.fromEntries(SLOTS.map(s => [s, []])))
        d[m[2]].push(f.person); total++
        by_person[f.person] = (by_person[f.person] || 0) + 1
    }
    return { days: Object.fromEntries(Object.entries(days).sort()), total, by_person }
}

export function table(r) {
    const rows = Object.entries(r.days).map(([d, s]) => `| ${d} | ${SLOTS.map(x => s[x].length ? `${s[x].length} (${s[x].sort().join(', ')})` : '0').join(' | ')} |`)
    return ['| Day | Morning | Midday | Evening |', '|---|---|---|---|', ...rows, '', `Total: ${r.total} check-in${r.total === 1 ? '' : 's'}.`].join('\n') + '\n'
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
    const arg = n => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : undefined }
    const people = path.join(root, 'people')
    const files = fs.readdirSync(people, { withFileTypes: true }).filter(e => e.isDirectory()).flatMap(e => {
        const d = path.join(people, e.name, 'pulse')
        return fs.existsSync(d) ? fs.readdirSync(d).map(name => ({ person: e.name, name })) : []
    })
    const r = count(files, { person: arg('person') })
    process.stdout.write(process.argv.includes('--json') ? JSON.stringify(r, null, 2) + '\n' : table(r))
}
