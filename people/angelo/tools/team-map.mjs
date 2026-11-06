#!/usr/bin/env node
// The whole team as one map (team-collaboration@web-summit.angelo, WS-97; Angelo asked, 6 November, to extend his
// command centre's map "to include everyone and their agents in the team"). Every person on data/team.json around a
// ring, each with their agents fanned around them (from admin/build/inventory.mjs: the roster, people/<id>/agents.json
// and the git log), and an arc for every For: message between two of them over the last N days.
//   node people/angelo/tools/team-map.mjs [--days 7] [--json] > team-map.html
// Read-only: public sources only (the repository), output to stdout. --json prints the data, for the command centre.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../..')
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d }
const DAYS = +arg('days', 7), JSONOUT = process.argv.includes('--json')
const INV = await import(path.join(ROOT, 'admin/build/inventory.mjs'))
const team = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/team.json'), 'utf8'))
const humans = team.members.filter(m => m.kind === 'human')
const inv = INV.inventory(ROOT, team)
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

// nodes: people, and every agent named <agent>@web-summit.<person> of a person on the roster
const people = humans.map(m => ({ id: m.id, name: m.name, role: m.role || '' }))
const pid = new Set(people.map(p => p.id))
const agentPerson = n => { const m = String(n).match(/^([a-z0-9-]+)@web-summit\.([a-z0-9-]+)$/); return m && pid.has(m[2]) ? m[2] : null }

// edges and activity: For: trailers (comma- or line-separated) in commits from the last DAYS days
const log = execFileSync('git', ['log', `--since=${DAYS} days ago`, '--format=%s%x1f%b%x1e'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 << 20 })
const commits = {}, edges = {}
for (const c of log.split('\x1e')) {
  const [s, b] = c.trim().split('\x1f'); if (!s || /^site v\d/.test(s)) continue
  const from = (s.match(/^([a-z0-9-]+@web-summit\.[a-z0-9-]+):/) || [])[1]; if (!from || !agentPerson(from)) continue
  commits[from] = (commits[from] || 0) + 1
  for (const line of String(b || '').matchAll(/^For:\s*(.+)$/gm)) for (const raw of line[1].split(/[,\s]+/)) {
    const to = raw.trim().toLowerCase(); if (!to || to === from) continue
    const ok = agentPerson(to) || pid.has(to); if (!ok) continue
    const k = from + '>' + to; edges[k] = (edges[k] || 0) + 1
  }
}
const agentNames = new Set([...inv.agents.map(a => a.name).filter(agentPerson), ...Object.keys(commits), ...Object.keys(edges).flatMap(k => k.split('>')).filter(agentPerson)])
const agents = [...agentNames].map(n => ({ id: n, person: agentPerson(n), short: n.split('@')[0], commits: commits[n] || 0 }))
const links = Object.entries(edges).map(([k, n]) => { const [a, b] = k.split('>'); return { from: a, to: b, n } })
const data = { built: new Date().toISOString(), days: DAYS, people, agents, links,
  totals: { people: people.length, agents: agents.length, active: agents.filter(a => a.commits).length, messages: links.reduce((s, l) => s + l.n, 0) } }
if (JSONOUT) { process.stdout.write(JSON.stringify(data, null, 1) + '\n'); process.exit(0) }

// layout: people evenly on a ring; each person's agents on an arc around them, further out; size by commits
const COL = { dinis: '#e5e7eb', vicky: '#a78bfa', jose: '#22d3ee', indi: '#fb923c', angelo: '#5fd6c9', silvio: '#f87171', nimay: '#60a5fa', daniela: '#facc15', sarah: '#f472b6' }
const W = 1600, H = 1600, CX = W / 2, CY = H / 2, RP = 300, RA = 560
const pos = {}, P = people.length
people.forEach((p, i) => { const t = -Math.PI / 2 + (2 * Math.PI * i) / P; pos[p.id] = { x: CX + RP * Math.cos(t), y: CY + RP * Math.sin(t), t } })
for (const p of people) {
  const mine = agents.filter(a => a.person === p.id).sort((a, b) => b.commits - a.commits || a.short.localeCompare(b.short))
  const span = Math.min((2 * Math.PI) / P * 0.92, 0.075 * Math.max(mine.length, 1)), t0 = pos[p.id].t - span / 2
  mine.forEach((a, j) => { const t = mine.length === 1 ? pos[p.id].t : t0 + (span * j) / (mine.length - 1); const r = RA + (j % 2) * 70; pos[a.id] = { x: CX + r * Math.cos(t), y: CY + r * Math.sin(t), t } })
}
const maxC = Math.max(1, ...agents.map(a => a.commits)), maxN = Math.max(1, ...links.map(l => l.n))
const size = a => 7 + 19 * Math.sqrt(a.commits / maxC)
const colOf = id => COL[agentPerson(id) || id] || '#9ca3af'
const arc = l => { const a = pos[l.from], b = pos[l.to]; if (!a || !b) return ''; const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, qx = mx + (CX - mx) * 0.55, qy = my + (CY - my) * 0.55
  return `<path d="M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${qx.toFixed(1)},${qy.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}" stroke="${colOf(l.from)}" stroke-opacity="${(0.18 + 0.5 * l.n / maxN).toFixed(2)}" stroke-width="${(0.8 + 6 * Math.sqrt(l.n / maxN)).toFixed(1)}" fill="none" data-from="${esc(l.from)}" data-to="${esc(l.to)}"><title>${esc(l.from)} → ${esc(l.to)}: ${l.n} message${l.n > 1 ? 's' : ''}</title></path>` }
const label = (x, y, t, text, cls) => { const right = Math.cos(t) >= 0; const dx = right ? 1 : -1; const rot = (t * 180 / Math.PI) + (right ? 0 : 180)
  return `<text class="${cls}" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(1)})" x="${dx * 16}" text-anchor="${right ? 'start' : 'end'}" dominant-baseline="middle">${esc(text)}</text>` }
const svgAgents = agents.filter(a => pos[a.id]).map(a => { const p = pos[a.id], s = size(a); return `<g class="ag" data-id="${esc(a.id)}"><rect x="${(p.x - s / 2).toFixed(1)}" y="${(p.y - s / 2).toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" rx="${(s / 5).toFixed(1)}" fill="${a.commits ? colOf(a.id) : 'none'}" stroke="${colOf(a.id)}" stroke-width="1.5"><title>${esc(a.id)}: ${a.commits} commits in ${DAYS} days</title></rect>${label(p.x, p.y, p.t, a.short, 'al')}</g>` }).join('')
const svgPeople = people.map(p => { const q = pos[p.id], n = agents.filter(a => a.person === p.id), act = n.filter(a => a.commits).length
  return `<g class="pp" data-id="${esc(p.id)}"><circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="46" fill="#1a1a19" stroke="${COL[p.id] || '#9ca3af'}" stroke-width="3"/><text x="${q.x.toFixed(1)}" y="${(q.y - 6).toFixed(1)}" class="pn" text-anchor="middle">${esc(p.name.split(' ')[0])}</text><text x="${q.x.toFixed(1)}" y="${(q.y + 16).toFixed(1)}" class="pc" text-anchor="middle">${act}/${n.length} agents</text><title>${esc(p.name)}: ${esc(p.role)}</title></g>` }).join('')
const T = data.totals
process.stdout.write(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The team, as one map</title>
<style>body{margin:0;background:#141413;color:#e7e5e4;font-family:system-ui,sans-serif}main{max-width:1100px;margin:0 auto;padding:16px}h1{font:700 1.6rem Georgia,serif;margin:.4em 0}.cap{color:#a8a29e;font-size:.95rem}
svg{width:100%;height:auto;display:block}.al{font:13px system-ui;fill:#d6d3d1}.pn{font:700 20px system-ui;fill:#fafaf9}.pc{font:12px system-ui;fill:#a8a29e}
svg.focus path{stroke-opacity:.04!important}svg.focus path.on{stroke-opacity:.9!important}svg.focus .ag:not(.on) text{opacity:.3}</style>
<main><h1>The team, as one map</h1><p class="cap">${T.people} people and ${T.agents} agents (${T.active} committed in the last ${DAYS} days), and ${T.messages} messages between them: each arc is a commit's <code>For:</code> line, coloured by its sender, thicker for more. A filled square has committed; an outline has not. Hover or tap a person or agent to see only their links. Built ${esc(data.built.slice(0, 16).replace('T', ' '))} UTC from the repository.</p>
<svg viewBox="0 0 ${W} ${H}" id="m" role="img" aria-label="The team's people and agents, and who writes to whom"><g>${links.map(arc).join('')}</g>${svgAgents}${svgPeople}</svg></main>
<script>const m=document.getElementById('m');function f(id){m.classList.toggle('focus',!!id);m.querySelectorAll('path').forEach(p=>p.classList.toggle('on',!!id&&(p.dataset.from===id||p.dataset.to===id||p.dataset.from.endsWith('.'+id)||p.dataset.to.endsWith('.'+id))));m.querySelectorAll('.ag').forEach(g=>g.classList.toggle('on',!id||g.dataset.id===id||g.dataset.id.endsWith('.'+id)))}
m.querySelectorAll('.ag,.pp').forEach(g=>{g.addEventListener('mouseenter',()=>f(g.dataset.id));g.addEventListener('click',e=>{e.stopPropagation();f(m.classList.contains('focus')&&g.classList.contains('on')&&g.dataset.id===m.dataset.sel?null:g.dataset.id);m.dataset.sel=g.dataset.id})});m.addEventListener('mouseleave',()=>f(null))</script></html>
`)
