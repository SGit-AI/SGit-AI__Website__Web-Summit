// The team as a picture (the operator, 2 November 2026): the humans in a ring, each person's agents branching out
// from them like an org chart, sized by their commits, and the messages between agents ("For:" in a commit) drawn
// across. Built from the inventory (admin/build/inventory.mjs) and the git log: deterministic, an inline SVG, no assets.
import fs from 'fs'
import path from 'path'
import { history } from './gitlog.mjs'

import { esc } from './text.mjs'

export function orgchartSvg(ROOT, INV) {
    const colours = {}; try { for (const p of JSON.parse(fs.readFileSync(path.join(ROOT, 'data/design.json'), 'utf8')).people) colours[p.id] = p.colour } catch { }
    const people = [...INV.people].sort((a, b) => (b.core ? 1 : 0) - (a.core ? 1 : 0))
    const W = 1000, C = W / 2, R1 = 175, R2 = 310, R3 = 410
    const pos = {}, out = []
    // each person's slice of the circle grows with their agents, so a busy person's agents do not overlap
    const weight = p => Math.max(3, INV.agents.filter(a => a.person === p.id).length), total = people.reduce((n, p) => n + weight(p), 0)
    let at = -Math.PI / 2
    // messages between agents: "For: <names>" in a commit whose Agent: is another agent
    const edges = new Map()
    try {
        for (const { b } of history(ROOT)) {
            const from = (b.match(/^Agent: ([a-z0-9-]+@web-summit\.[a-z0-9-]+)/m) || [])[1], to = (b.match(/^For: (.+)$/m) || [])[1]
            if (!from || !to) continue
            for (const t of to.split(/,\s*/).map(x => x.trim()).filter(x => /@web-summit\./.test(x))) { const k = `${from}|${t}`; edges.set(k, (edges.get(k) || 0) + 1) }
        }
    } catch { }
    people.forEach((p, i) => {
        const sector = 2 * Math.PI * weight(p) / total, a0 = at + sector / 2; at += sector
        const col = colours[p.id] || '#8a8f98'
        pos[p.id] = { x: C + R1 * Math.cos(a0), y: C + R1 * Math.sin(a0), col }
        const mine = INV.agents.filter(a => a.person === p.id).sort((a, b) => b.commits - a.commits)
        mine.forEach((a, j) => {
            const span = sector * 0.8, n = mine.length, ang = a0 - span / 2 + (n === 1 ? span / 2 : span * j / (n - 1))
            const r = n > 5 && j % 2 ? R3 : R2
            pos[a.name] = { x: C + r * Math.cos(ang), y: C + r * Math.sin(ang), ang, col, a }
        })
    })
    out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${W}" role="img" aria-label="The team: ${INV.people.length} people in a ring, with their agents branching out" style="width:100%;height:auto;max-width:${W}px">`)
    out.push(`<circle cx="${C}" cy="${C}" r="${R1}" fill="none" stroke="#d0d4da" stroke-dasharray="3 5"/>`)
    for (const [k, n] of edges) { const [f, t] = k.split('|'); if (!pos[f] || !pos[t]) continue; out.push(`<path d="M${pos[f].x.toFixed(1)},${pos[f].y.toFixed(1)} Q${C},${C} ${pos[t].x.toFixed(1)},${pos[t].y.toFixed(1)}" fill="none" stroke="#9aa3ad" stroke-width="${Math.min(4, 0.8 + n * 0.6).toFixed(1)}" opacity="0.55"><title>${esc(f)} to ${esc(t)}: ${n} message${n > 1 ? 's' : ''}</title></path>`) }
    for (const p of people) {
        out.push(`<line x1="${C}" y1="${C}" x2="${pos[p.id].x.toFixed(1)}" y2="${pos[p.id].y.toFixed(1)}" stroke="#d0d4da"/>`)
        for (const a of INV.agents.filter(a => a.person === p.id)) { const q = pos[a.name]; out.push(`<line x1="${pos[p.id].x.toFixed(1)}" y1="${pos[p.id].y.toFixed(1)}" x2="${q.x.toFixed(1)}" y2="${q.y.toFixed(1)}" stroke="${pos[p.id].col}" stroke-opacity="0.45"${a.commits ? '' : ' stroke-dasharray="3 3"'}/>`) }
    }
    out.push(`<circle cx="${C}" cy="${C}" r="62" fill="#ffffff" stroke="#1a1a1a"/><text x="${C}" y="${C - 6}" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#1a1a1a">web-summit</text><text x="${C}" y="${C + 14}" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#555">the site and the board</text>`)
    for (const a of INV.agents) {
        const q = pos[a.name]; if (!q) continue
        const r = a.commits ? 5 + Math.min(14, Math.sqrt(a.commits) * 2.4) : 5, left = Math.cos(q.ang) < -0.1, right = Math.cos(q.ang) > 0.1
        out.push(`<g><title>${esc(a.name)}: ${a.commits ? `${a.commits} commits, last ${esc(a.last)} UTC` : 'proposed, not running yet'}</title><circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="${r.toFixed(1)}" fill="${a.commits ? q.col : '#ffffff'}" stroke="${q.col}"${a.commits ? '' : ' stroke-dasharray="2 2"'}/>`
            + `<text x="${(q.x + (left ? -r - 4 : right ? r + 4 : 0)).toFixed(1)}" y="${(q.y + (left || right ? 4 : -r - 5)).toFixed(1)}" text-anchor="${left ? 'end' : right ? 'start' : 'middle'}" font-family="Inter, sans-serif" font-size="11" fill="${a.commits ? '#1a1a1a' : '#8a8f98'}">${esc(a.agent)}</text></g>`)
    }
    for (const p of people) {
        const q = pos[p.id], dark = /^#(1|2|3|6|c)/i.test(q.col)
        out.push(`<g><title>${esc(p.name)}</title><circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="30" fill="${q.col}" stroke="#ffffff" stroke-width="3"/><text x="${q.x.toFixed(1)}" y="${(q.y + 4).toFixed(1)}" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${dark ? '#ffffff' : '#1a1a1a'}">${esc(p.name.split(' ')[0])}</text></g>`)
    }
    out.push('</svg>')
    return { svg: out.join(''), edges: edges.size }
}
