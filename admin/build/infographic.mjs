// An infographic page from a JSON file (front matter `infographic: data/<file>.json`, placeholder {{infographic}} alone on
// its line): a band of big numbers, sections of screenshot tiles, and call-outs per person. Written for Dinis's night
// summary, 5 November 2026 ("an infographic with some screenshots ... call outs to the multiple agents and multiple
// humans that need to check out the stuff I've done"). By conductor@web-summit.dinis.
import fs from 'fs'
import path from 'path'

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const COLS = ['green', 'blue', 'terra', 'gold']

export const expandInfographic = (html, md, ROOT, file, rel) => {
    const d = JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'))
    const up = '../'.repeat(rel.split('/').length - 1)
    const href = h => /^https?:/.test(h) ? h : up + h
    const tile = t => `<a class="ig-tile" href="${esc(href(t.href))}">${t.img ? `<img src="${esc(up + t.img)}" alt="" loading="lazy" width="640" height="400">` : ''}<span class="ig-tt"><b>${esc(t.title)}</b>${esc(t.text)}</span></a>`
    const out = `<div class="ig">
<div class="ig-stats">${d.stats.map(([n, t], i) => `<div class="ig-stat ig-${COLS[i % 4]}"><b>${esc(n)}</b><span>${esc(t)}</span></div>`).join('')}</div>
${d.sections.map((s, i) => `<section class="ig-sec ig-${COLS[i % 4]}"><h2 id="${esc(s.id)}"><span class="ig-n">${i + 1}</span>${esc(s.title)}</h2><p class="ig-lead">${esc(s.lead)}</p><div class="ig-tiles">${s.tiles.map(tile).join('')}</div>${s.check ? `<p class="ig-check"><b>Check it:</b> ${esc(s.check)}</p>` : ''}</section>`).join('\n')}
<section class="ig-calls"><h2 id="callouts">Who needs to look at what</h2><div class="ig-people">${d.callouts.map(c => `<div class="ig-person"><h3>${esc(c.who)}</h3><ul>${c.items.map(([t, h]) => `<li><a href="${esc(href(h))}">${esc(t)}</a></li>`).join('')}</ul></div>`).join('')}</div></section>
</div>`
    const outMd = `${d.stats.map(([n, t]) => `- **${n}** ${t}`).join('\n')}\n\n${d.sections.map((s, i) => `## ${i + 1}. ${s.title}\n\n${s.lead}\n\n${s.tiles.map(t => `- [${t.title}](${/^https?:/.test(t.href) ? t.href : 'https://web-summit.sgit.ai/' + t.href}): ${t.text}`).join('\n')}${s.check ? `\n\n**Check it:** ${s.check}` : ''}`).join('\n\n')}\n\n## Who needs to look at what\n\n${d.callouts.map(c => `### ${c.who}\n\n${c.items.map(([t, h]) => `- [${t}](${/^https?:/.test(h) ? h : 'https://web-summit.sgit.ai/' + h})`).join('\n')}`).join('\n\n')}`
    return { html: html.replace('<p>{{infographic}}</p>', out), md: md.replace('{{infographic}}', outMd) }
}
