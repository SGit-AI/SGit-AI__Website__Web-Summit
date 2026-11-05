// The newsroom curator's story candidates (Dinis's request, through Vicky, 5 November 2026): /people/vicky/stories/.
// Built from people/vicky/stories/candidates.md, an exact copy of desks/curator/README.md in the public newsroom
// repository (SGit-AI/SGit-AI__Website__Newsroom__Web-Summit, branch dev), refreshed by dashboard@web-summit.vicky
// at each of its runs. The data lives there and in that one copy; nothing else. Comments go through the site's
// feedback pane (assets/feedback.js). Called by admin/build/build.mjs; written by dashboard@web-summit.vicky.
import fs from 'node:fs'
import path from 'node:path'

const SRC = 'https://github.com/SGit-AI/SGit-AI__Website__Newsroom__Web-Summit/blob/dev/desks/curator/README.md'
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function build(ROOT) {
    const md = fs.readFileSync(path.join(ROOT, 'people/vicky/stories/candidates.md'), 'utf8')
    const updated = (md.match(/^Last updated: (.+?)\.?$/m) || [])[1] || 'unknown'
    const rows = md.split('\n').filter(l => /^\|\s*S\d+\s*\|/.test(l)).map(l => l.split('|').slice(1, -1).map(c => c.trim()))
    const stories = rows.map(([id, title, beat, angle, added]) => ({ id, title, beat, angle, added }))
    const card = s => `<article class="card story" id="${esc(s.id.toLowerCase())}"><p class="meta"><strong class="story-id">${esc(s.id)}</strong> · <span class="pill">${esc(s.beat)}</span> · added ${esc(s.added)}</p><h3 class="story-title">${esc(s.title)}</h3><p>${esc(s.angle)}</p><p><button type="button" class="story-comment" data-story="${esc(s.id.toLowerCase())}">Comment on ${esc(s.id)}</button></p></article>`
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
    const twinMd = `The newsroom curator's story candidates, newest first, from ${SRC} (last updated by the curator on ${updated}). None is fact-checked yet.\n\n${stories.map(s => `- **${s.id}** (${s.beat}, added ${s.added}): ${s.title}. ${s.angle}`).join('\n')}`
    return [{ rel: 'people/vicky/stories/index.html', title: "The newsroom's story candidates", description: "The curator's open story ideas for the Web Summit 2026 newsroom: id, title, beat, angle and date added, with a way to comment on each.", body, md: twinMd }]
}
