// The newsroom curator's story candidates (Dinis's request, through Vicky, 5 November 2026): /people/vicky/stories/.
// Built from people/vicky/stories/candidates.md, an exact copy of desks/curator/README.md in the public newsroom
// repository (PrompTugal/PrompTugal__News__Website, branch dev), refreshed by dashboard@web-summit.vicky
// at each of its runs. The data lives there and in that one copy; nothing else. Comments go through the site's
// feedback pane (assets/feedback.js). Called by admin/build/build.mjs; written by dashboard@web-summit.vicky.
import fs from 'node:fs'
import path from 'node:path'

const SRC = 'https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/curator/README.md'
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function build(ROOT) {
    const md = fs.readFileSync(path.join(ROOT, 'people/vicky/stories/candidates.md'), 'utf8')
    const updated = (md.match(/^Last updated: (.+?)\.?$/m) || [])[1] || 'unknown'
    // two layouts: since 5 Nov 18:30 one "## S12: title" section per story (first line "Beat, added 5 Nov. Angle", then a
    // "Sources:" list of "- Publisher, read <date>: <url>"); before that, one table row per story with the angle in it
    // Two source formats: the curator's current one, `- [Publisher, "Title"](url), read D Month YYYY` (decisions.md answer 9),
    // and the earlier `- Publisher, read date: <url>`.
    const parseSources = t => [
        ...[...t.matchAll(/^- \[(.+)\]\((https?:[^)\s]+)\)(?:,\s*read\s+(.+?))?\s*$/gm)].map(m => ({ label: m[1], url: m[2], read: m[3] || '' })),
        ...[...t.matchAll(/^- (.+?): <(https?:[^>\s]+)>\s*$/gm)].map(m => ({ label: m[1], url: m[2], read: '' }))
    ]
    let stories = md.split(/^## (?=S\d+:)/m).slice(1).map(sec => {
        const [head, ...rest] = sec.split('\n'), body = rest.join('\n')
        const [, id, title] = head.match(/^(S\d+):\s*(.+)$/) || []
        const first = (body.trim().split(/\n\s*\n/)[0] || '').replace(/\s+/g, ' ').trim()
        const [, beat, added, angle] = first.match(/^(.+?), added ([^.]+)\.\s*(.*)$/) || [, '', '', first]
        return { id, title, beat, added, angle, sources: parseSources(body) }
    }).filter(x => x.id)
    if (!stories.length) stories = md.split('\n').filter(l => /^\|\s*S\d+\s*\|/.test(l)).map(l => l.split('|').slice(1, -1).map(c => c.trim()))
        .map(([id, title, beat, angle, added]) => ({ id, title, beat, angle, added, sources: [] }))
    const srcList = s => s.sources.length ? `<p class="meta">Sources:</p><ul class="story-sources">${s.sources.map(x => `<li><a href="${esc(x.url)}" rel="noopener">${esc(x.label)}</a>${x.read ? `, read ${esc(x.read)}` : ''}</li>`).join('')}</ul>` : '<p class="meta">No source yet.</p>'
    // Each card is a native <details> (no script): collapsed it shows the number, title, beat and the one-line angle;
    // open it shows when it was added, the sources and the Comment button. Collapsed by default (Vicky, 6 Nov).
    const card = s => `<details class="card story" id="${esc(s.id.toLowerCase())}"><summary><span class="meta"><strong class="story-id">${esc(s.id)}</strong> · <span class="pill">${esc(s.beat)}</span></span><h3 class="story-title">${esc(s.title)}</h3><span class="story-angle">${esc(s.angle)}</span></summary><div class="story-more"><p class="meta">Added ${esc(s.added)}</p>${srcList(s)}<p><button type="button" class="story-comment" data-story="${esc(s.id.toLowerCase())}">Comment on ${esc(s.id)}</button></p></div></details>`
    const storyCss = `<style>
.stories-list details.story > summary { cursor: pointer; list-style: none; display: block; min-height: 44px; -webkit-tap-highlight-color: transparent }
.stories-list details.story > summary::-webkit-details-marker { display: none }
.stories-list details.story > summary > * { display: block }
.stories-list details.story > summary .story-title { margin: .25rem 0 }
.stories-list details.story > summary .story-id, .stories-list details.story > summary .pill { display: inline }
.stories-list details.story > summary::after { content: "Show more \\25BE"; display: block; margin-top: .5rem; padding: .25rem 0; font-size: .9rem; color: var(--accent-dk) }
.stories-list details.story[open] > summary::after { content: "Show less \\25B4" }
.stories-list details.story > summary:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px }
.stories-list .story-more { margin-top: .75rem; border-top: 1px solid currentColor; padding-top: .5rem }
.stories-list .story-sources a { overflow-wrap: anywhere }
</style>`
    const body = `<p>The story ideas the newsroom's curator (curator@web-summit.vicky) suggests for the journalist, newest first. None is fact-checked yet. Source: <a href="${SRC}">desks/curator/README.md</a> in the newsroom repository, last updated by the curator on ${esc(updated)}; this page is refreshed at each run of Vicky's dashboard agent.</p>
<p class="meta"><b>To comment on a story:</b> press its <i>Comment</i> button. It selects the story's id and title and opens the site's feedback pane with them quoted; write your comment and press Submit. The first time, the pane may need turning on for your device (<a href="?feedback=on">turn on feedback</a>). Choose newsroom@web-summit.dinis as the recipient for the newsroom.</p>
${storyCss}
<div class="cards stories-list">${stories.map(card).join('')}</div>
<script>
document.addEventListener('click', e => {
  const b = e.target.closest('.story-comment'); if (!b) return
  const a = document.getElementById(b.dataset.story), r = document.createRange()
  r.setStart(a.querySelector('.story-id'), 0); r.setEnd(a.querySelector('.story-title'), 1)
  const s = getSelection(); s.removeAllRanges(); s.addRange(r)
  const fb = document.querySelector('.fb-btn')
  if (fb) fb.click(); else location.href = '?feedback=on#' + b.dataset.story
})
</script>`
    const twinMd = `The newsroom curator's story candidates, newest first, from ${SRC} (last updated by the curator on ${updated}). None is fact-checked yet.\n\n${stories.map(s => `- **${s.id}** (${s.beat}, added ${s.added}): ${s.title}. ${s.angle}${s.sources.map(x => `\n  - [${x.label}](${x.url})${x.read ? `, read ${x.read}` : ''}`).join('')}`).join('\n')}`
    return [...promptugal(ROOT), ...workSoFar(ROOT), ...office(ROOT), { rel: 'people/vicky/stories/index.html', title: "The newsroom's story candidates", description: "The curator's open story ideas for the Web Summit 2026 newsroom: id, title, beat, angle and date added, with a way to comment on each.", body, md: twinMd }]
}

// Promptugal News's logo options (Jose's request, through Vicky, 5 November 2026): /people/vicky/promptugal/. Built from
// people/vicky/promptugal/source/, an exact copy of desks/designer-vicky/ (brief.md, README.md, logos/) in the newsroom
// repository, refreshed only when Vicky asks. Each SVG follows light or dark mode by itself (a prefers-color-scheme
// block in its <style>); the page shows each copied file twice, forced light and forced dark. The files are never changed.
const DESK = 'https://github.com/PrompTugal/PrompTugal__News__Website/tree/dev/desks/designer-vicky'
const inline = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*]+)\*/g, '<i>$1</i>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>').replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '$1')
function mdHtml(md) {
    const out = []; let list = null
    const close = () => { if (list) { out.push(`</${list}>`); list = null } }
    for (const block of md.replace(/\r/g, '').split(/\n\s*\n/)) {
        const lines = block.split('\n').filter(l => l.trim())
        if (!lines.length) continue
        const h = lines[0].match(/^(#{1,3}) (.+)$/)
        if (h && lines.length === 1) { close(); const n = Math.min(h[1].length + 1, 4); out.push(`<h${n}>${inline(h[2])}</h${n}>`); continue }
        if (lines.every(l => /^(- |\d+\. |\s)/.test(l))) {
            const kind = /^\d+\. /.test(lines[0]) ? 'ol' : 'ul'; if (list !== kind) { close(); out.push(`<${kind}>`); list = kind }
            const items = []; for (const l of lines) { if (/^(- |\d+\. )/.test(l)) items.push(l.replace(/^(- |\d+\. )/, '')); else items[items.length - 1] += ' ' + l.trim() }
            out.push(items.map(i => `<li>${inline(i)}</li>`).join('')); continue
        }
        close(); out.push(`<p>${inline(lines.join(' '))}</p>`)
    }
    close(); return out.join('\n')
}
// each SVG picks its colours from prefers-color-scheme, which for an <img> follows that element's CSS color-scheme:
// so the same copied file is shown twice, once with color-scheme: light and once with color-scheme: dark
const asImg = (file, mode, alt) => `<img src="source/logos/${esc(file)}" style="color-scheme:${mode}" alt="${esc(alt)} (${mode})" loading="lazy">`
function promptugal(ROOT) {
    const dir = path.join(ROOT, 'people/vicky/promptugal/source')
    if (!fs.existsSync(dir)) return []
    const readme = fs.readFileSync(path.join(dir, 'README.md'), 'utf8'), brief = fs.readFileSync(path.join(dir, 'brief.md'), 'utf8')
    const opts = readme.split('\n').filter(l => /^\|\s*\d+\s*\|/.test(l)).map(l => {
        const c = l.split('|').slice(1, -1).map(x => x.trim())
        const [, alt, file] = c[1].match(/!\[([^\]]*)\]\(logos\/([^)\s]+\.svg)\)/) || []
        const name = ((c[2].match(/\*\*([^*]+)\*\*/) || [])[1] || '').replace(/[.,]$/, '')
        const idea = c[2].replace(/\s*Header: .*$/, '').replace(/\*\*[^*]+\*\*[.,]?\s*/, '').trim()
        return { n: c[0], alt, file, name, idea }
    }).filter(o => o.file && fs.existsSync(path.join(dir, 'logos', o.file)))
    const card = o => `<article class="card story logo-opt" id="option-${esc(o.n)}"><p class="meta"><strong class="story-id">Option ${esc(o.n)}</strong></p><h3 class="story-title">${esc(o.name)}</h3><p>${inline(o.idea)}</p>
<div class="logo-pair"><figure class="logo-light">${asImg(o.file, 'light', o.alt)}<figcaption>Light</figcaption></figure><figure class="logo-dark">${asImg(o.file, 'dark', o.alt)}<figcaption>Dark</figcaption></figure></div>
<p><button type="button" class="story-comment" data-story="option-${esc(o.n)}">Comment on option ${esc(o.n)}</button></p></article>`
    const head = `<style>.logo-opt{display:block}.logo-pair{display:grid;gap:.6rem;margin:.6rem 0}.logo-pair figure{margin:0;padding:1rem;border:1px solid var(--line);border-radius:var(--radius)}.logo-pair img{display:block;width:100%;height:auto;max-height:7rem;object-fit:contain}.logo-pair figcaption{font-size:.8rem;margin-top:.4rem}.logo-light{background:#f6f3ec;color:#121317}.logo-dark{background:#111214;color:#eceae4}.logo-list{display:grid;gap:1rem;margin:1.2rem 0}</style>`
    const body = `<p>The logo options for <b>Promptugal News</b>, the Web Summit newsroom's new name, by Vicky's designer (designer@web-summit.vicky). First the brief, then the eight options, each in light and in dark. Source: <a href="${DESK}">desks/designer-vicky/</a> in the newsroom repository; this page shows an exact copy of those files, refreshed when Vicky asks.</p>
<p class="meta"><b>To vote or comment:</b> press an option's <i>Comment</i> button. It opens the site's feedback pane with the option quoted; write your vote or comment and press Submit. The first time, the pane may need turning on for your device (<a href="?feedback=on">turn on feedback</a>). Choose newsroom@web-summit.dinis as the recipient.</p>
<p><a href="#options">Jump to the options</a></p>
<section class="logo-brief">${mdHtml(brief)}</section>
<h2 id="options">The eight options</h2>
<div class="logo-list">${opts.map(card).join('')}</div>
<script>
document.addEventListener('click', e => {
  const b = e.target.closest('.story-comment'); if (!b) return
  const a = document.getElementById(b.dataset.story), r = document.createRange()
  r.setStart(a.querySelector('.story-id'), 0); r.setEnd(a.querySelector('.story-title'), 1)
  const s = getSelection(); s.removeAllRanges(); s.addRange(r)
  const fb = document.querySelector('.fb-btn')
  if (fb) fb.click(); else location.href = '?feedback=on#' + b.dataset.story
})
</script>`
    const md = `The logo options for Promptugal News, by designer@web-summit.vicky, from ${DESK}.\n\n${brief.replace(/^# .*\n/, '')}\n\n## The eight options\n\n${opts.map(o => `- **Option ${o.n}: ${o.name}.** ${o.idea}`).join('\n')}`
    return [{ rel: 'people/vicky/promptugal/index.html', title: 'Promptugal News: the logo options', description: "The brief and the eight logo options for Promptugal News, the newsroom's new name, in light and dark, with a way to comment on each.", body, head, md }]
}

// Vicky's agents: the work so far (Vicky's request, 6 November 2026): /people/vicky/work-so-far/. Built from
// people/vicky/work-so-far/source.md, written and kept by conductor@web-summit.vicky. Public material only.
function workSoFar(ROOT) {
    const f = path.join(ROOT, 'people/vicky/work-so-far/source.md')
    if (!fs.existsSync(f)) return []
    const src = fs.readFileSync(f, 'utf8').replace(/^# .*\n/, '')
    const body = `<p class="meta">Written by Vicky's conductor (conductor@web-summit.vicky) on 6 November 2026, about 19:30 UTC, from her records on this site and the newsroom repository. Plain words, public material only.</p>\n${mdHtml(src)}`
    return [{ rel: 'people/vicky/work-so-far/index.html', title: "Vicky's agents: the work so far", description: "Vicky's agents and their jobs, how a story reaches PrompTugal.news, what is live, the rules and files she set up, what changed on 6 November, and what is next.", body, md: src }]
}

// The Live AI Office (Vicky, 8 November 2026; decisions.md, standing answer 21): /people/vicky/office/, a near-live
// pixel-art office of Vicky's agents, by dev@PrompTugal.vicky. At build time, from files already on this site and the
// site's own git log (Node's standard library only), it puts together the office's data: per agent its short name,
// role, area, cron times (UTC), the times of its last commits carrying "Agent: <name>", the status word from its report
// and whether that entry says URGENT; and the newsroom's counts. Nothing else: no report text, prompts, session or task
// ids, keys, nothing about the CRM, vaults or the shortlist; inbox and vault are "on demand", with no times at all. No
// wall-clock time: the same commit always gives the same data. The data travels inside the generated page, as an inline
// <script type="application/json" id="office-data"> (a block the gate's check 18 knows and leaves alone), so no extra file
// is written: the page is the build's own output like any other. The browser (office/office.js) re-reads the page
// every minute and works out each state with the viewer's clock.
function office(ROOT) {
    const V = path.join(ROOT, 'people/vicky'), read = f => { try { return fs.readFileSync(path.join(V, f), 'utf8') } catch { return '' } }
    // who, in which room, doing what (public, in my words); the order is the order on the page
    const ROLES = {
        conductor: ['coord', 'Coordinates the team'], dashboard: ['coord', "Keeps Vicky's dashboard"], pm: ['coord', 'Plans and board health'], scout: ['coord', 'Learns from other teams'],
        researcher: ['research', 'Finds public sources'], curator: ['stories', 'Suggests storylines'], programme: ['stories', 'Keeps the agenda'],
        journalist: ['writing', 'Writes: the summit'], 'journalist-portugal': ['writing', 'Writes: Portugal'], 'journalist-europe': ['writing', 'Writes: Europe'], 'journalist-ai': ['writing', 'Writes: AI and robotics'], 'journalist-connections': ['writing', 'Writes: connections'],
        reviewer: ['review', 'Reviews drafts'], checker: ['review', 'Fact-checks articles'],
        logistics: ['logistics', 'Print and merch'], designer: ['logistics', 'Design (paused)'],
        dev: ['ondemand', 'Builds pages'], inbox: ['ondemand', 'On demand'], vault: ['ondemand', 'On demand'],
    }
    const NO_TIMES = new Set(['inbox', 'vault'])   // Vicky (SA21): visible as "On demand", none of their activity
    let agents = []; try { agents = JSON.parse(read('agents.json')) } catch { }
    const names = {}   // short -> every name it has committed under (its own, and the one before a rename)
    for (const a of agents) {
        const short = String(a.name || '').split('@')[0]
        if (!ROLES[short] || /replaced by/i.test(String(a.state || ''))) continue
        names[short] = [a.name, ...((String(a.was || '').match(/^[\w.-]+@[\w.-]+/) || []))]
    }
    // cron times: "M H,H * * *" rows of schedule.json, as HH:MM (UTC); a task's id and name are never copied
    const hhmm = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    const cronTimes = c => { const [m, h, ...rest] = String(c || '').trim().split(/\s+/); if (!/^\d+$/.test(m) || !/^[\d,]+$/.test(h || '') || rest.join(' ') !== '* * *') return []; return h.split(',').map(x => hhmm(+x, +m)) }
    let tasks = []; try { tasks = JSON.parse(read('schedule.json')).tasks || [] } catch { }
    const live = t => !t.state || t.state === 'enabled', cron = {}, rounds = {}
    for (const t of tasks.filter(live)) {
        const short = String(t.agent || '').split('@')[0]; if (!names[short] || NO_TIMES.has(short)) continue
        cron[short] = [...new Set([...(cron[short] || []), ...cronTimes(t.cron_utc)])].sort()
        const kind = /fix-only/i.test(t.task) ? 'fix' : /re-check/i.test(t.task) ? 'recheck' : /first review/i.test(t.task) ? 'first' : null
        if (kind && !rounds[kind]) rounds[kind] = cronTimes(t.cron_utc).length
    }
    // confirmed: the author times of the last commits carrying "Agent: <name>"; no git, no times (never a failure)
    const confirmed = {}; let dataAt = null
    try {
        const cp = process.getBuiltinModule && process.getBuiltinModule('node:child_process')
        if (cp) {
            const out = cp.execFileSync('git', ['log', '-n', '4000', '--format=%x1e%aI%x1f%B'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] })
            const utc = iso => new Date(iso).toISOString().slice(0, 16) + 'Z'
            const who = {}; for (const [s, ns] of Object.entries(names)) for (const n of ns) who[n.toLowerCase()] = s
            for (const rec of out.split('\x1e').slice(1)) {
                const [at, body = ''] = rec.split('\x1f'), short = who[((body.match(/^Agent:\s*(\S+)\s*$/m) || [])[1] || '').toLowerCase()]
                if (!short || NO_TIMES.has(short)) continue
                ;(confirmed[short] ||= []).length < 3 && confirmed[short].push(utc(at))
            }
            dataAt = utc(cp.execFileSync('git', ['log', '-1', '--format=%cI'], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim())
        }
    } catch { }
    // the status word of each agent's last report entry (its last "state:" line), and whether that entry says URGENT
    const report = short => {
        const t = read(`reports/${short}.md`), all = [...t.matchAll(/state:\s*(ok|partial|idle|blocked)\b/gi)]
        if (!all.length) return { status: null, urgent: false }
        const last = all[all.length - 1], before = t.slice(0, last.index), start = Math.max(before.lastIndexOf('\n## '), before.lastIndexOf('\n- '), 0)
        return { status: last[1].toLowerCase(), urgent: /\bURGENT\b/.test(t.slice(start, t.indexOf('\n', last.index) < 0 ? t.length : t.indexOf('\n', last.index))) }
    }
    const list = Object.keys(ROLES).filter(s => names[s]).map(short => {
        const [area, role] = ROLES[short], quiet = NO_TIMES.has(short)
        const r = quiet ? { status: null, urgent: false } : report(short)
        return { short, role, area, on_demand: quiet || !(cron[short] || []).length, cron: quiet ? [] : (cron[short] || []), confirmed: quiet ? [] : (confirmed[short] || []), status: r.status, urgent: r.urgent }
    })
    // the newsroom strip, from files on this site: the curator's candidates, the reports' status words, the schedule
    const cand = read('stories/candidates.md'), writers = list.filter(a => a.area === 'writing')
    const published = new Set(read('reports/reviewer.md').split('\n').filter(l => /\bpublished\b/i.test(l)).flatMap(l => l.match(/https:\/\/promptugal\.news\/articles\/[a-z0-9-]+\.html/g) || []))
    const newsroom = [
        { stage: 'research', count: new Set(cand.match(/https?:\/\/[^\s)>\]]+/g) || []).size, unit: 'sources behind the storylines' },
        { stage: 'storylines', count: cand.split('\n').filter(l => /^\|\s*S\d+\s*\|/.test(l)).length, unit: 'open' },
        // not a count of drafts (those are in the newsroom repository): how many of the writers said "ok" on their last run
        { stage: 'writers', count: writers.filter(a => a.status === 'ok').length, of: writers.length, unit: 'reported ok on their last run' },
        { stage: 'first review', count: rounds.first || 0, unit: 'rounds a day' },
        { stage: 'fix only', count: rounds.fix || 0, unit: 'rounds a day' },
        { stage: 're-check', count: rounds.recheck || 0, unit: 'rounds a day' },
        { stage: 'live', count: published.size, unit: 'articles Vicky\'s reviewer published' },
    ]
    const status = { about: "Vicky's agents for the Live AI Office (people/vicky/office/). Public facts only: names, roles, rooms, cron times (UTC), last commit times, status words and counts. Built at each site release.", data_at: dataAt, late_after_minutes: 30, agents: list, newsroom }
    const json = JSON.stringify(status, null, 1) + '\n'
    // the build fails rather than publish anything that looks private (Vicky's brief): an email address, a phone number,
    // a token's shape or the word "shortlist"; the patterns are tried on known examples first
    const BAD = [['an email address', /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z0-9.-]+/], ['a phone number', /(?:\+\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]\d{3,4}[\s.-]\d{3,4}\b|\+\d{9,14}\b/],
        ['a token', /\b(?:ghp_|gho_|github_pat_|sk-|xox[abprs]-|AKIA|trig_|session_)[A-Za-z0-9_-]{6,}|[A-Za-z0-9+/_-]{32,}/], ['the word "shortlist"', /shortlist/i]]
    // the examples are put together here, so no literal contact detail sits in this file (the comms check reads it too)
    const phone = ['+351', '912', '345', '678'], sample = [[['a', 'b.pt'].join('@')], [phone.join(' '), phone.join('')], ['ghp_' + 'abcdefghijkl', 'trig_' + '01QqwpxE9hhp'], ['the Short' + 'list']], clean = ['2026-11-08T05:31Z', '05:45', 'journalist-ai', '21 sources']
    if (!BAD.every(([, re], i) => sample[i].every(x => re.test(x))) || BAD.some(([, re]) => clean.some(c => re.test(c)))) throw new Error('people/vicky/pages.mjs office(): the privacy check failed its own examples')
    for (const [what, re] of BAD) if (re.test(json)) throw new Error(`the Live AI Office's data would contain ${what}; nothing written (Vicky's brief, SA21)`)
    const AREAS = { research: 'Research', stories: 'Storylines', writing: 'Writing desks', review: 'Review', coord: 'Coordination', logistics: 'Logistics and design', ondemand: 'On demand' }
    const when = a => a.on_demand ? 'On demand' : a.cron.join(', ') + ' UTC'
    const row = a => `<tr data-agent="${esc(a.short)}"><th scope="row"><img src="sprites/${esc(a.short)}.png" alt="" width="16" height="24" class="office-face">${esc(a.short)}</th><td>${esc(a.role)}</td><td>${esc(AREAS[a.area])}</td><td>${esc(when(a))}</td><td class="office-state">${a.on_demand ? 'On demand' : 'needs JavaScript'}</td></tr>`
    const at = dataAt ? dataAt.slice(11, 16) : 'unknown'
    const head = `<style>
.office-banner { margin: .5rem 0 1rem; padding: .55rem .8rem; border: 1px solid var(--line-2); border-radius: var(--radius, 8px); background: var(--surface-2); font-size: .92rem }
.office-banner b { font-weight: 600 }
.office-stage { position: relative; margin: 0 0 .5rem; border: 1px solid var(--line-2); border-radius: var(--radius, 8px); overflow: hidden; background: var(--surface-2) }
.office-stage canvas { display: block; width: 100%; image-rendering: pixelated; image-rendering: crisp-edges; cursor: pointer; touch-action: manipulation }
.office-detail { min-height: 1.6em; font-size: .92rem; margin: .25rem 0 1rem }
.office-legend { display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: .5rem .9rem; list-style: none; padding: 0; margin: .5rem 0 1.25rem; font-size: .9rem }
.office-legend li { display: flex; gap: .55rem; align-items: flex-start }
.office-key { flex: none; display: inline-block; min-width: 3.4rem; text-align: center; font: 600 .75rem/1.6 ui-monospace, monospace; border-radius: 999px; padding: 0 .4rem; border: 2px solid transparent }
.k-confirmed { background: var(--ok); color: var(--accent-ink, #fff); border-color: var(--ok) }
.k-scheduled { border: 2px dashed var(--ink-2); color: var(--ink) }
.k-inferred { border-color: var(--line-2); color: var(--ink-2); opacity: .7 }
.k-late { background: var(--warn-soft); color: var(--warn); border-color: var(--warn) }
.k-error { background: var(--bad); color: var(--accent-ink, #fff); border-color: var(--bad) }
.k-ondemand { background: var(--wait-soft); color: var(--wait); border-color: var(--line-2) }
.office-strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(8.2rem, 1fr)); gap: .4rem; list-style: none; padding: 0; margin: .5rem 0 1.25rem; counter-reset: st }
.office-strip li { border: 1px solid var(--line-2); border-radius: var(--radius, 8px); padding: .45rem .6rem; background: var(--surface); font-size: .85rem; line-height: 1.3 }
.office-strip b { display: block; font-size: 1.35rem; line-height: 1.2 }
.office-strip .st { display: block; font-weight: 600 }
.office-strip .st::first-letter { text-transform: uppercase }
.office-table { width: 100%; border-collapse: collapse; font-size: .88rem }
.office-table th, .office-table td { text-align: left; padding: .35rem .4rem; border-bottom: 1px solid var(--line); vertical-align: middle }
.office-table th { white-space: nowrap; font-weight: 600 }
.office-face { image-rendering: pixelated; width: 16px; height: 24px; object-fit: none; object-position: 0 0; vertical-align: middle; margin-right: .4rem }
.office-wrap { overflow-x: auto }
@media (max-width: 600px) { .office-table th:nth-child(2), .office-table td:nth-child(2), .office-table th:nth-child(3), .office-table td:nth-child(3) { display: none } .office-table th[scope=row] { white-space: normal } }
</style>`
    const body = `<p>Vicky's AI agents at work, drawn as an office: each agent has a desk in its team's room, walks to it when a run is due, and rests in the lounge between runs. Tap a figure to see who it is and what we know.</p>
<p class="office-banner" id="office-banner">Near-live: updated with each site release, last data <b>${esc(at)} UTC</b>.</p>
<div class="office-stage"><canvas id="office-canvas" width="720" height="420" role="img" aria-label="An animated office of Vicky's agents; the same facts are in the table below">Your browser shows no canvas; the table below has the same facts.</canvas></div>
<p class="office-detail" id="office-detail" aria-live="polite"></p>
<h2>How to read it</h2>
<ul class="office-legend">
<li><span class="office-key k-confirmed">12:05</span><span><b>Confirmed</b>: the agent committed its work; the badge shows when (UTC). Solid, because the site's record shows it.</span></li>
<li><span class="office-key k-scheduled">due</span><span><b>Scheduled</b>: a run is due at the time shown (dashed outline), from its schedule. Nothing has happened yet.</span></li>
<li><span class="office-key k-inferred">?</span><span><b>Inferred</b>: the run should be under way (faded, with a "?"), from the due time until a commit confirms it or 30 minutes pass; then it shows <span class="office-key k-late">late</span>.</span></li>
<li><span class="office-key k-error">!</span><span><b>Error</b>: the agent's last report says blocked or URGENT.</span></li>
<li><span class="office-key k-ondemand">On demand</span><span><b>On demand</b>: works only when Vicky asks; no times are shown for the inbox or the vault agent.</span></li>
</ul>
<h2>The newsroom</h2>
<ol class="office-strip" id="office-strip">${newsroom.map(n => `<li><span class="st">${esc(n.stage)}</span><b>${n.count}${n.of ? ` <small>of ${n.of}</small>` : ''}</b>${esc(n.unit)}</li>`).join('')}</ol>
<h2>Who is where</h2>
<div class="office-wrap"><table class="office-table"><thead><tr><th scope="col">Agent</th><th scope="col">Job</th><th scope="col" class="col-room">Room</th><th scope="col">Runs (UTC)</th><th scope="col">Now</th></tr></thead><tbody id="office-rows">${list.map(row).join('')}</tbody></table></div>
<p class="meta">Built from <code>people/vicky/schedule.json</code>, the site's commit record, the agents' reports and <code>people/vicky/stories/candidates.md</code>, at each site release: facts as of the last data time above. Characters and furniture are original pixel art (<a href="https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/vicky/office/CREDITS.md">credits</a>).</p>
<script type="application/json" id="office-data">${json.replace(/</g, '\\u003c')}</script>
<script src="office.js" defer></script>`
    const md = `Vicky's AI agents as an office, near-live: updated with each site release, last data ${at} UTC. States: confirmed (a commit shows the work), scheduled (a run is due), inferred (a run should be under way; late after 30 minutes without a commit), error (blocked or URGENT), on demand.\n\n## The newsroom\n\n${newsroom.map(n => `- ${n.stage}: ${n.count}${n.of ? ` of ${n.of}` : ''} ${n.unit}`).join('\n')}\n\n## Who is where\n\n| Agent | Job | Room | Runs (UTC) | Last confirmed (UTC) | Last report |\n|---|---|---|---|---|---|\n${list.map(a => `| ${a.short} | ${a.role} | ${AREAS[a.area]} | ${when(a)} | ${a.confirmed[0] ? a.confirmed[0].replace('T', ' ').replace('Z', '') : (a.on_demand && NO_TIMES.has(a.short) ? 'not shown' : 'none')} | ${a.urgent ? 'URGENT' : a.status || 'none'} |`).join('\n')}\n\nThe same facts as JSON are inside the page, in its office-data block.`
    return [{ rel: 'people/vicky/office/index.html', title: 'The Live AI Office', description: "Vicky's AI agents as a near-live pixel-art office: who is at their desk, who is due, who is late, and the newsroom's pipeline, updated with each site release.", body, head, md }]
}
