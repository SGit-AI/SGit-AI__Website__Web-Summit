#!/usr/bin/env node
// Every repository the agents work in, for the live graph (backlog 00 point 7; dev@PrompTugal.angelo, 7 November 2026).
// Reads people/angelo/app/repos.json; for each repository keeps a small read-only clone outside this repository (no file
// contents, three days of history), fetches the listed branches (globs allowed), and writes people/angelo/app/repos-events.json:
// the last 48 hours of exchanges, each [ISO time, sender, [For: names], repository index, short sha]. Names and times only:
// never a subject, a body or a file. Public repositories, no token. A repository that cannot be read is listed with its error
// and skipped; the run never fails because of one.
//   node people/angelo/tools/repos-snapshot.mjs [--dir <clones, default /home/user/promptugal/repos>] [--hours 48]
// Names are kept as the views keep them: <role>@web-summit.<person>, or pt:<person>:<role> for PrompTugal names (the gate's
// contact check reads a lower-case PrompTugal name as an address).
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d }
const DIR = arg('--dir', '/home/user/promptugal/repos'), HOURS = +arg('--hours', 48)
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'people/angelo/app/repos.json'), 'utf8'))
const roster = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'data/team.json'), 'utf8')).members.filter(m => m.kind === 'human').map(m => m.id))
const NAME = /^([a-z0-9][a-z0-9.-]*)@([A-Za-z][A-Za-z0-9-]*)\.([a-z0-9-]+)$/
const idOf = n => { const m = String(n).trim().match(NAME); if (!m || !roster.has(m[3].toLowerCase())) return null; return /^promptugal$/i.test(m[2]) ? `pt:${m[3].toLowerCase()}:${m[1].toLowerCase()}` : `${m[1].toLowerCase()}@web-summit.${m[3].toLowerCase()}` }
const git = (cwd, args) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 256 << 20, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, GIT_LFS_SKIP_SMUDGE: '1', GIT_TERMINAL_PROMPT: '0' } })
const since = Date.now() - HOURS * 36e5, sinceArg = `--shallow-since=${new Date(since - 24 * 36e5).toISOString()}`

const repos = [], events = [], seen = new Set()
fs.mkdirSync(DIR, { recursive: true })
for (const r of cfg.repos) {
    const rec = { repo: r.repo, exchanges: !!r.exchanges, branches: 0, events: 0 }
    repos.push(rec)
    try {
        const url = `https://github.com/${r.repo}`, dir = path.join(DIR, r.repo.replace('/', '__'))
        const heads = git(DIR, ['ls-remote', '--heads', url]).split('\n').filter(Boolean).map(l => l.split('\t')[1].replace('refs/heads/', ''))
        const globRe = g => new RegExp('^' + g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$')
        const want = heads.filter(h => r.branches.some(g => globRe(g).test(h))), ex = r.exclude && heads.includes(r.exclude) ? [r.exclude] : []
        rec.branches = want.length
        if (!want.length || !r.exchanges) continue
        if (!fs.existsSync(path.join(dir, '.git'))) { git(DIR, ['init', '-q', dir]); git(dir, ['remote', 'add', 'origin', url]); git(dir, ['config', 'remote.origin.promisor', 'true']); git(dir, ['config', 'remote.origin.partialclonefilter', 'blob:none']) }
        git(dir, ['fetch', '-q', '--filter=blob:none', sinceArg, '--force', 'origin', ...[...want, ...ex].map(b => `+refs/heads/${b}:refs/remotes/origin/${b}`)])
        // own_only: each workers/<agent> branch on its own, keeping only that agent's commits; otherwise all branches at once
        const runs = r.own_only ? want.map(b => [[b], b.split('/').pop()]) : [[want, null]]
        for (const [bs, own] of runs) {
        const out = git(dir, ['log', '--no-merges', `--since=${new Date(since).toISOString()}`, '--format=%H%x1f%cI%x1f%s%x1f%b%x1f%aI%x1e', ...bs.map(b => `refs/remotes/origin/${b}`), ...ex.map(b => `^refs/remotes/origin/${b}`)])
        for (const c of out.split('\x1e')) {
            const [h, at, s = '', b = '', au = ''] = c.trim().split('\x1f')
            // a commit copied to another branch (a rebase, a cherry-pick, a worker's work brought onto dev) keeps its author time
            // and subject but not its sha: one exchange, however many branches carry it
            const key = `${au}|${s}`
            if (!h || seen.has(key) || /^(site|release:?) v\d/i.test(s)) continue
            seen.add(key)
            const who = (s.match(/^([a-z0-9][a-z0-9.-]*@[A-Za-z][A-Za-z0-9-]*\.[a-z0-9-]+):/i) || b.match(/^Agent: *([a-z0-9][a-z0-9.-]*@[A-Za-z][A-Za-z0-9-]*\.[a-z0-9-]+)/mi) || [])[1]
            const from = who && idOf(who); if (!from) continue
            if (own && !(from.startsWith('pt:') ? from.split(':')[2] === own : from.split('@')[0] === own)) continue
            const to = [...new Set((b.match(/^For: *(.+)$/gmi) || []).flatMap(l => l.slice(4).split(/,\s*/)).map(t => idOf(t) || (roster.has(t.trim().toLowerCase()) ? t.trim().toLowerCase() : null)).filter(t => t && t !== from))]
            if (!to.length) continue   // an exchange names someone: a commit For nobody is not drawn
            events.push([new Date(at).toISOString(), from, to, repos.length - 1, h.slice(0, 8)]); rec.events++
        }
        }
    } catch (e) { const m = String(e.stderr || e.message || e); rec.error = /could not read Username|not found/i.test(m) ? 'not found (not created yet, or not public)' : m.split('\n').find(Boolean)?.slice(0, 160) || 'unreadable' }
}
events.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)
// compact: names once in `names`, each exchange [minutes after `from`, sender index, [For: indexes], repository index, short sha]
const names = [...new Set(events.flatMap(e => [e[1], ...e[2]]))], ni = new Map(names.map((n, i) => [n, i]))
const from = events.length ? events[0][0].slice(0, 16) + ':00.000Z' : new Date(since).toISOString(), f0 = Date.parse(from)
const doc = { about: `The last ${HOURS} hours of exchanges (commits naming someone in For:) in every repository of repos.json, for the live graph: [minutes after from, sender, [For: names], repository, short sha], names by index into names. Names and times only. Written by people/angelo/tools/repos-snapshot.mjs.`, read_at: new Date().toISOString(), hours: HOURS, from, repos, names, events: events.map(e => [Math.round((Date.parse(e[0]) - f0) / 6e4), ni.get(e[1]), e[2].map(t => ni.get(t)), e[3], e[4]]) }
fs.writeFileSync(path.join(ROOT, 'people/angelo/app/repos-events.json'), JSON.stringify(doc) + '\n')
console.log(`repos-snapshot: ${events.length} exchanges in ${HOURS} h from ${repos.filter(r => r.events).length} of ${repos.length} repositories` + repos.filter(r => r.error).map(r => `; ${r.repo}: ${r.error}`).join(''))
