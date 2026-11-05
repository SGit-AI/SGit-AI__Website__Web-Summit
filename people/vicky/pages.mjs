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
    const parseSources = t => [...t.matchAll(/^- (.+?): <(https?:[^>\s]+)>\s*$/gm)].map(m => ({ label: m[1], url: m[2] }))
    let stories = md.split(/^## (?=S\d+:)/m).slice(1).map(sec => {
        const [head, ...rest] = sec.split('\n'), body = rest.join('\n')
        const [, id, title] = head.match(/^(S\d+):\s*(.+)$/) || []
        const first = (body.trim().split(/\n\s*\n/)[0] || '').replace(/\s+/g, ' ').trim()
        const [, beat, added, angle] = first.match(/^(.+?), added ([^.]+)\.\s*(.*)$/) || [, '', '', first]
        return { id, title, beat, added, angle, sources: parseSources(body) }
    }).filter(x => x.id)
    if (!stories.length) stories = md.split('\n').filter(l => /^\|\s*S\d+\s*\|/.test(l)).map(l => l.split('|').slice(1, -1).map(c => c.trim()))
        .map(([id, title, beat, angle, added]) => ({ id, title, beat, angle, added, sources: [] }))
    const srcList = s => s.sources.length ? `<p class="meta">Sources:</p><ul class="story-sources">${s.sources.map(x => `<li><a href="${esc(x.url)}" rel="noopener">${esc(x.label)}</a></li>`).join('')}</ul>` : '<p class="meta">No source yet.</p>'
    const card = s => `<article class="card story" id="${esc(s.id.toLowerCase())}"><p class="meta"><strong class="story-id">${esc(s.id)}</strong> · <span class="pill">${esc(s.beat)}</span> · added ${esc(s.added)}</p><h3 class="story-title">${esc(s.title)}</h3><p>${esc(s.angle)}</p>${srcList(s)}<p><button type="button" class="story-comment" data-story="${esc(s.id.toLowerCase())}">Comment on ${esc(s.id)}</button></p></article>`
    const body = `<p>The story ideas the newsroom's curator (curator@web-summit.vicky) suggests for the journalist, newest first. None is fact-checked yet. Source: <a href="${SRC}">desks/curator/README.md</a> in the newsroom repository, last updated by the curator on ${esc(updated)}; this page is refreshed at each run of Vicky's dashboard agent.</p>
<p class="meta"><b>To comment on a story:</b> press its <i>Comment</i> button. It selects the story's id and title and opens the site's feedback pane with them quoted; write your comment and press Submit. The first time, the pane may need turning on for your device (<a href="?feedback=on">turn on feedback</a>). Choose newsroom@web-summit.dinis as the recipient for the newsroom.</p>
<div class="cards">${stories.map(card).join('')}</div>
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
    const twinMd = `The newsroom curator's story candidates, newest first, from ${SRC} (last updated by the curator on ${updated}). None is fact-checked yet.\n\n${stories.map(s => `- **${s.id}** (${s.beat}, added ${s.added}): ${s.title}. ${s.angle}${s.sources.map(x => `\n  - [${x.label}](${x.url})`).join('')}`).join('\n')}`
    return [...promptugal(ROOT), { rel: 'people/vicky/stories/index.html', title: "The newsroom's story candidates", description: "The curator's open story ideas for the Web Summit 2026 newsroom: id, title, beat, angle and date added, with a way to comment on each.", body, md: twinMd }]
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
