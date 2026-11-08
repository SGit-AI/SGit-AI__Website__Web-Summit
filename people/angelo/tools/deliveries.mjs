#!/usr/bin/env node
// The map's work view: what was made, and where it went (backlog 0f2; spec: people/angelo/proposals/live-map/spec-work-view.md,
// approved by Angelo 8 November about 16:30 UTC, the desk's 7fcaf108). dev.work@PrompTugal.angelo.
//
// One list of deliveries feeds the live graph and the map's playback. A delivery is [minute, maker, icon, destination,
// repository, short sha]: names and times only. A file path is read to classify a commit and then dropped; a subject, a body,
// a recipient or any other text is never kept. Nothing is drawn that has no commit.
//
// Three sources, in this order (the spec's "Where the deliveries come from"):
//   1. the files each commit changed, by RULES (first match wins; a commit delivers at most one icon per destination);
//   2. "Delivered: <kind>, <what> <path or link>" lines in the commit's body (kind first; an older line by the path it names);
//   3. the backfill, people/angelo/app/deliveries-backfill.json: { at, agent, kind, destination, sha }, each with its commit.
//
//   node people/angelo/tools/deliveries.mjs [--root <clone>] [--since <ISO>] [--repo <owner/name>] [--json]
// prints the counts per destination (or, with --json, the list); read-only, it writes nothing.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const ICONS = ['doc', 'cog', 'key', 'record', 'envelope', 'post']
// the ten destinations at the rim, in the mock-up's order
export const DESTS = ['news', 'site', 'research', 'infra', 'app', 'keys', 'crm', 'email', 'linkedin', 'drafts']
export const DEST_NAMES = { news: 'PT News', site: 'the team site', research: 'research', infra: 'infrastructure', app: 'the app', keys: 'keys', crm: 'the CRM', email: 'email drafts', linkedin: 'LinkedIn', drafts: 'Drafts and proposals' }

// The rule table, one row per line of the spec's table (row ids are what the tests name). A row's `test` takes a path relative
// to the repository's root; `icon: null` is hidden (inner workings, or the team talking). First match wins.
const seg = re => p => re.test(p)
const CODE = /\.(m?js|cjs|py|sh)$/
export const RULES = [
    { id: 'hidden-inner', icon: null, dest: null, test: p =>
        /^(REALITY\.md|version\.txt|admin\/versions\.json|admin\/metrics\.json|data\/log\.json)$/.test(p)
        || /(^|\/)(STATE|RUNNER)\.md$/.test(p)
        || /(^|\/)(ledger|estimates|pulse|policy)\//.test(p)
        || /^data\/sealed\//.test(p)
        // snapshots: the build's and the tools' generated data beside the app (repos-events.json, promptugal.json, live.json ...)
        || /^people\/[^/]+\/app\/(data|live|repos-events|promptugal|deliveries[\w-]*)\.json$/.test(p)
        // the generated pages committed before WS-83 (2 November): the site's HTML outside people/, twins, the built folders
        || (/\.html$/.test(p) && !/^people\//.test(p))
        || /(^|\/)index\.md$/.test(p) || /\.md\.sig$/.test(p)
        || /^(team|companies|about|versions|meetings|keys|articles|agent)\//.test(p) && !/^agent\/identity\.json$/.test(p)
        || /^(llms\.txt|sitemap\.xml|admin\/versions\.md|me\.json|agenda\.json)$/.test(p) },
    { id: 'keys', icon: 'key', dest: 'keys', test: p => /^data\/(keys|person-keys)\.json$/.test(p) || /^people\/[^/]+\/key\.json$/.test(p) },
    { id: 'research', icon: 'doc', dest: 'research', test: seg(/^people\/[^/]+\/research\//) },
    { id: 'crm', icon: 'record', dest: 'crm', test: p => /^data\/(crm|companies)\.json$/.test(p) || /(^|\/)crm\//.test(p) },
    { id: 'drafts', icon: 'doc', dest: 'drafts', test: p =>
        /^people\/[^/]+\/proposals\//.test(p) || /(^|\/)drafts\//.test(p) || /\.fragment$/.test(p)
        || (/^people\//.test(p) && /\.html$/.test(p) && !/^people\/[^/]+\/app\//.test(p)) },
    { id: 'app', icon: 'cog', dest: 'app', test: seg(/^people\/[^/]+\/app\//) },
    { id: 'infra', icon: 'cog', dest: 'infra', test: p =>
        /^\.github\//.test(p) || /^admin\/tools\//.test(p) || /^people\/[^/]+\/tools\//.test(p)
        || (CODE.test(p) && !/^(assets|admin\/build)\//.test(p)) },
    { id: 'hidden-comms', icon: null, dest: null, test: p => /^(content|board|people)\//.test(p) },
    { id: 'site', icon: 'cog', dest: 'site', test: seg(/^(assets|admin\/build)\//) },
]
// anything no row names (a data file of the team's, the repository's own README) is inner workings
export function ruleOf(file) { for (const r of RULES) if (r.test(file)) return r; return { id: 'hidden-other', icon: null, dest: null } }

// "Delivered:" kinds (the kit's short list, as data.mjs's DELIVERY_KINDS) to icon and destination
export const KINDS = {
    'article': ['doc', 'news'], 'brief': ['doc', 'research'], 'page': ['doc', 'site'], 'post': ['post', 'linkedin'],
    'email draft': ['envelope', 'email'], 'record': ['record', 'crm'], 'key': ['key', 'keys'], 'tool': ['cog', 'infra'],
    'app': ['cog', 'app'], 'spec': ['doc', 'drafts'], 'report': ['doc', 'drafts'],
}
const REPO_PATH = /(?:https:\/\/(?:web-summit\.sgit\.ai|github\.com\/SGit-AI\/SGit-AI__Website__Web-Summit\/(?:blob|tree)\/[\w.-]+)\/)?((?:people|board|content|data|admin|assets|\.github)\/[\w./@-]+)/

// what one commit delivers: [{ icon, dest, via }], at most one per destination; [] for a release, a review or inner workings.
// Only the kind and the path of a "Delivered:" line are read; the rest of the line is dropped here.
export function classify({ subject = '', body = '', files = [] }) {
    if (/^site v\d+\.\d+\.\d+:/.test(subject) || /^review:/i.test(subject)) return []
    const out = new Map()
    for (const f of files) { const r = ruleOf(f); if (r.icon && !out.has(r.dest)) out.set(r.dest, { icon: r.icon, dest: r.dest, via: r.id }) }
    for (const m of String(body).matchAll(/^Delivered:\s*(.+)$/gm)) {
        const line = m[1], kind = ((line.match(/^([a-z ]{3,14}),/i) || [])[1] || '').trim().toLowerCase()
        let hit = KINDS[kind] ? { icon: KINDS[kind][0], dest: KINDS[kind][1], via: 'delivered:' + kind } : null
        if (!hit) { const p = (line.match(REPO_PATH) || [])[1]; const r = p && ruleOf(p.replace(/[.,;)]+$/, '')); if (r && r.icon) hit = { icon: r.icon, dest: r.dest, via: 'delivered:path' } }
        if (hit && !out.has(hit.dest)) out.set(hit.dest, hit)
    }
    return [...out.values()]
}

// who made it: the agent in the subject's lead or the Agent: trailer (as data.mjs's committer()); none, nothing is drawn
const NAME = '([a-z0-9][a-z0-9.-]*)@(web-summit|promptugal)\\.([a-z0-9-]+)'
export function maker(subject, body) {
    const m = String(subject).match(new RegExp('^' + NAME + ':', 'i')) || String(body || '').match(new RegExp('^Agent: *' + NAME, 'im'))
    return m ? `${m[1]}@${/^promptugal$/i.test(m[2]) ? 'PrompTugal' : 'web-summit'}.${m[3].toLowerCase()}` : null
}

// read one clone's history: [{ at, maker, icon, dest, repo, sha }]
export function readRepo(root, { since = '2026-10-28T00:00:00Z', rev = 'HEAD', repo = 'SGit-AI/SGit-AI__Website__Web-Summit' } = {}) {
    let raw = ''
    try { raw = execFileSync('git', ['log', rev, `--since=${since}`, '--name-only', '--format=%x1e%h%x1f%cI%x1f%s%x1f%b%x1f'], { cwd: root, encoding: 'utf8', maxBuffer: 256 << 20 }) } catch { return [] }
    const out = []
    for (const c of raw.split('\x1e')) {
        const [h, at, s = '', b = '', rest = ''] = c.split('\x1f'); if (!h || !at) continue
        const who = maker(s, b); if (!who) continue
        for (const d of classify({ subject: s, body: b, files: rest.split('\n').map(x => x.trim()).filter(Boolean) })) out.push({ at, maker: who, icon: d.icon, dest: d.dest, repo, sha: h })
    }
    return out.sort((x, y) => Date.parse(x.at) - Date.parse(y.at))
}

// the backfill: entries { at, agent, kind, destination, sha }; an entry with an unknown kind or destination, or no sha, is left out
export function backfill(file, repo = 'SGit-AI/SGit-AI__Website__Web-Summit') {
    let rows = []; try { rows = JSON.parse(fs.readFileSync(file, 'utf8')).entries || [] } catch { return [] }
    return rows.filter(e => e && Date.parse(e.at) && maker(e.agent + ':') && ICONS.includes(e.kind) && DESTS.includes(e.destination) && /^[0-9a-f]{7,40}$/.test(e.sha || ''))
        .map(e => ({ at: e.at, maker: maker(e.agent + ':'), icon: e.kind, dest: e.destination, repo, sha: e.sha.slice(0, 8) }))
}

// the compact form for the page: names by index, minutes since `from` (as live.json)
export function pack(list, from) {
    const f = Date.parse(from), makers = [], mi = new Map(), repos = [], ri = new Map()
    const idx = (m, a, x) => { if (!m.has(x)) { m.set(x, a.length); a.push(x) } return m.get(x) }
    const rows = list.map(d => [Math.round((Date.parse(d.at) - f) / 6e4), idx(mi, makers, d.maker), ICONS.indexOf(d.icon), DESTS.indexOf(d.dest), idx(ri, repos, d.repo), d.sha])
    return { from, icons: ICONS, dests: DESTS, makers, repos, rows }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const a = process.argv.slice(2), opt = k => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : undefined }
    const list = readRepo(opt('--root') || '.', { since: opt('--since'), repo: opt('--repo') })
    if (a.includes('--json')) { console.log(JSON.stringify(pack(list, opt('--since') || '2026-10-28T00:00:00Z'))); process.exit(0) }
    const by = {}; for (const d of list) by[d.dest] = (by[d.dest] || 0) + 1
    const commits = new Set(list.map(d => d.sha)).size
    console.log(`${list.length} deliveries in ${commits} commits`); for (const k of DESTS) if (by[k]) console.log(`  ${DEST_NAMES[k].padEnd(22)} ${by[k]}`)
}
