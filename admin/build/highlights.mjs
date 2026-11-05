// The most important thing each person did (Dinis, 4 November 2026, relayed by Indi: on the stand-up's show page, under
// each member, the best or most important thing they did, updated every time they change the website or sites).
// Built at every release, so it moves with every push. For each human on the roster, newest first of:
//   1. a commit by one of their agents (<agent>@web-summit.<id>) with a trailer "Highlight: <one line>", or
//   2. people/<id>/highlight.json: {"what": "<one line>", "link": "<url, optional>", "at": "<ISO time>", "by": "<agent>"}
//      (for work on another site, which this repository's git log cannot see);
// and, when neither exists, their agents' latest commit, labelled as the latest change rather than the most important.
// The person's agents choose: they set a Highlight whenever something they did becomes the most important thing.
import fs from 'fs'
import path from 'path'
import { since } from './gitlog.mjs'

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

export function highlights(ROOT, teamData) {
    let log = []
    try {
        log = since(ROOT, Date.now() - 14 * 864e5).map(({ sha: h, at, s, b }) => ({ h, at, s, b }))
    } catch { /* no git: only the files count */ }
    const ownerOf = c => { const m = (c.b.match(/^Agent:\s*\S+@web-summit\.([a-z0-9-]+)\s*$/m) || c.s.match(/^\S+@web-summit\.([a-z0-9-]+):/) || [])[1]; return m }
    const out = []
    for (const m of teamData.members.filter(m => m.kind === 'human')) {
        const mine = log.filter(c => ownerOf(c) === m.id && !/^site v/.test(c.s))
        const tagged = mine.find(c => /^Highlight:\s*\S/m.test(c.b))
        const cands = []
        if (tagged) cands.push({ what: tagged.b.match(/^Highlight:\s*(.+)$/m)[1].trim(), at: tagged.at, by: (tagged.b.match(/^Agent:\s*(\S+)/m) || [])[1] || tagged.s.split(':')[0], commit: tagged.h.slice(0, 8), kind: 'highlight' })
        const f = path.join(ROOT, 'people', m.id, 'highlight.json')
        if (fs.existsSync(f)) { try { const j = JSON.parse(fs.readFileSync(f, 'utf8')); if (j.what) cands.push({ what: j.what, link: j.link, at: j.at || '', by: j.by || '', kind: 'highlight' }) } catch { /* a broken file is skipped, not fatal */ } }
        cands.sort((a, b) => String(b.at).localeCompare(String(a.at)))
        const latest = mine[0]
        out.push({ id: m.id, name: m.name, best: cands[0] || null, latest: latest ? { what: latest.s.replace(/^\S+@web-summit\.[a-z0-9-]+:\s*/, ''), at: latest.at, by: latest.s.split(':')[0], commit: latest.h.slice(0, 8) } : null, commits14d: mine.length })
    }
    return out
}

const when = at => at ? `${at.slice(8, 10)} Nov, ${at.slice(11, 16)} UTC` : ''

export function highlightsHtml(H, repo) {
    const li = h => {
        const b = h.best, l = h.latest
        const main = b
            ? `<b>${esc(b.what)}</b>${b.link ? ` <a href="${esc(b.link)}">open</a>` : ''}<span class="sub"> ${esc(b.by)}, ${when(b.at)}${b.commit ? ` (<a href="${repo}/commit/${b.commit}">${b.commit}</a>)` : ''}</span>`
            : l ? `<b>${esc(l.what)}</b><span class="sub"> latest change, not yet marked as the most important: ${esc(l.by)}, ${when(l.at)} (<a href="${repo}/commit/${l.commit}">${l.commit}</a>)</span>` : `<span class="sub">nothing yet</span>`
        return `<li><span class="who">${esc(h.name.split(' ')[0])}</span> ${main}</li>`
    }
    return `<section class="highlights"><style>.show .hl{list-style:none;padding:0}.show .hl li{margin:.8em 0}.show .hl .who{display:inline-block;min-width:90px;font-weight:700;color:var(--accent)}.show .hl .sub{display:block;font-size:15px;margin-left:90px}</style><div class="k">Most important</div><h2>The most important thing each person did</h2><ul class="hl">${H.map(li).join('')}</ul><p class="sub">Rebuilt at every release. A person's agents mark it with a commit trailer <code>Highlight: &lt;one line&gt;</code>, or in <code>people/&lt;id&gt;/highlight.json</code> for work on another site; the newest wins.</p></section>`
}

export function highlightsMd(H) {
    return '## The most important thing each person did\n\n' + H.map(h => {
        const b = h.best, l = h.latest
        return `- **${h.name.split(' ')[0]}:** ` + (b ? `${b.what} (${b.by}, ${when(b.at)})` : l ? `${l.what} (latest change, not yet marked as the most important: ${l.by}, ${when(l.at)})` : 'nothing yet')
    }).join('\n') + '\n\nRebuilt at every release. Marked with a commit trailer `Highlight: <one line>`, or in `people/<id>/highlight.json`.\n'
}

// place it in a show fragment right after the "Who moved" section, or before the last section
export function withHighlights(frag, html) {
    const i = frag.indexOf('Commits in 24 hours'), j = i < 0 ? -1 : frag.indexOf('</section>', i)
    if (j >= 0) return frag.slice(0, j + 10) + html + frag.slice(j + 10)
    const k = frag.lastIndexOf('<section')
    return k >= 0 ? frag.slice(0, k) + html + frag.slice(k) : frag + html
}
