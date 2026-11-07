#!/usr/bin/env node
// The lane check (policy@PrompTugal.angelo's gate-lane-check.md, approved by Angelo on 7 November, "Go ahead with both";
// built by dev@PrompTugal.angelo from policy@'s prototype, audit.mjs). For each commit in a range by one of Angelo's
// agents (its "Agent:" trailer, else its subject's "<agent>:" prefix), every file it touched must be inside its lane
// (people/angelo/policy/lanes.json: common + writes), or be declared in the commit with a trailer
//   Outside: <path or glob>; <why: who asked, with a sha or a quote>
// Tier-3 paths need the same line, and its reason should quote Angelo. CI's releases ("site vX.Y.Z") and merges are
// skipped; other people's agents are not checked (their lanes may join later).
//   node people/angelo/policy/lane-check.mjs [<range, default origin/dev..HEAD>]     prints, exits 1 on a refusal
// The gate (admin/build/validate.js, check 21) runs it on LANE_RANGE (CI: the push's before..after) or origin/dev..HEAD
// (release.sh, before every push), so a write outside a lane never reaches dev from release.sh.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const toRe = g => new RegExp('^' + g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\0').replace(/\*/g, '[^/]*').replace(/\0/g, '.*') + '$')

// the commits of a range, checked; returns { refused: [lines], declared: [lines], checked: n }
export function laneCheck(root, range) {
    const git = (...a) => execFileSync('git', a, { cwd: root, encoding: 'utf8', maxBuffer: 256 << 20 })
    const lanes0 = JSON.parse(fs.readFileSync(path.join(root, 'people/angelo/policy/lanes.json'), 'utf8'))
    const lanes = {}
    for (const [k, v] of Object.entries(lanes0.agents || {})) for (const n of [k, ...(v.aliases || [])]) lanes[n.toLowerCase()] = { ...v, self: k }
    const common = (lanes0.common || []).map(toRe)
    const out = { refused: [], declared: [], checked: 0 }
    let shas = []
    try { shas = git('log', '--reverse', '--no-merges', '--format=%H', range).split('\n').filter(Boolean) } catch { return out }
    for (const sha of shas) {
        const [subject, ...body] = git('show', '-s', '--format=%s%n%b', sha).split('\n')
        if (/^site v\d/.test(subject)) continue
        const text = body.join('\n')
        const agent = (text.match(/^Agent:\s*([a-z0-9.-]+@(?:web-summit|promptugal)\.angelo)\b/mi) || subject.match(/^([a-z0-9.-]+@(?:web-summit|promptugal)\.angelo):/i) || [])[1]
        if (!agent) continue
        out.checked++
        const short = sha.slice(0, 8), lane = lanes[agent.toLowerCase()]
        if (!lane) { out.refused.push(`${short} ${agent.split('@')[0]}@: no lane in people/angelo/policy/lanes.json`); continue }
        const ok = (lane.writes || []).map(toRe), t3 = (lane.tier3_paths || []).map(toRe)
        // declared outside writes: "Outside: <path or glob>; <why>" (a reason is required)
        const decl = [...text.matchAll(/^Outside:\s*([^;\n]+?)\s*;\s*(\S[^\n]*)$/gmi)].map(m => ({ re: toRe(m[1].trim()), path: m[1].trim(), why: m[2].trim() }))
        for (const f of git('diff-tree', '--no-commit-id', '--name-only', '-r', '--root', sha).split('\n').filter(Boolean)) {
            if (common.some(r => r.test(f)) || ok.some(r => r.test(f))) continue
            const d = decl.find(x => x.re.test(f))
            const tier3 = t3.some(r => r.test(f)) ? ' (tier 3)' : ''
            if (d) out.declared.push(`${short} ${lane.self.split('@')[0]}@ wrote ${f}${tier3}: ${d.why}`)
            else out.refused.push(`${short} ${lane.self.split('@')[0]}@ wrote ${f}${tier3}, outside its lane: add "Outside: ${f}; <who asked, with a sha or a quote>" to the commit`)
        }
    }
    return out
}

// the range the gate checks: LANE_RANGE if set (CI), else this clone's commits not yet on origin/dev (release.sh)
export function gateRange(root) {
    const r = process.env.LANE_RANGE || ''
    if (r) return /^0+\.\./.test(r) ? '' : r   // a new branch's push has no "before": nothing to compare
    try { execFileSync('git', ['rev-parse', '--verify', '-q', 'origin/dev'], { cwd: root, stdio: 'pipe' }); return 'origin/dev..HEAD' } catch { return '' }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim()
    if (process.argv[2] === '--gate') {   // for the gate: the gate's range, as JSON, always exit 0 (the gate decides)
        const range = gateRange(root), r = range ? laneCheck(root, range) : { refused: [], declared: [], checked: 0 }
        const enforce = JSON.parse(fs.readFileSync(path.join(root, 'people/angelo/policy/lanes.json'), 'utf8')).enforce === true
        console.log(JSON.stringify({ range, enforce, ...r })); process.exit(0)
    }
    const r = laneCheck(root, process.argv[2] || 'origin/dev..HEAD')
    for (const l of r.declared) console.log('declared ' + l)
    for (const l of r.refused) console.log('REFUSED  ' + l)
    console.log(`lane-check: ${r.checked} commit(s) by Angelo's agents, ${r.declared.length} declared outside write(s), ${r.refused.length} refused`)
    process.exit(r.refused.length ? 1 : 0)
}
