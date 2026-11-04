// "What do the different agents do?" (Indi's question, 4 November 2026): seven landscape infographics, in lay terms,
// on the design system in people/indi/agents/agents.css (documented at people/indi/agents/design-system/).
// Called by people/indi/pages.mjs. The matrix of who has which helpers and Indi's own agents are read from the
// repository at build time (people/<id>/agents.json, else data/team.json), so they stay true as the roster changes.
// Every graphic is inline SVG, so it reads without JavaScript; agents.js only adds "expand to fill the screen".
import fs from 'node:fs'
import path from 'node:path'

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// the design system's colours, as tokens: a pastel fill and a deeper edge for each (agents.css holds the same values)
export const T = {
    ink: '#34334a', soft: '#6b6984', paper: '#fdfcf8', line: '#ece8f6', canvas: '#f7f5fc',
    mint: ['#cdefe3', '#6fbf9f'], lavender: ['#e3ddf7', '#9d8fdb'], peach: ['#ffe1d0', '#ec9a74'],
    butter: ['#fff3c4', '#d9b84a'], sky: ['#d6ecfa', '#7fb6e0'], rose: ['#f9d9e3', '#e08fab'], sage: ['#e4eedc', '#98b884']
}
const C = k => T[k][0], E = k => T[k][1]

// wrap text into SVG lines of about n characters
function lines(t, n) {
    const out = []; let cur = ''
    for (const w of String(t).split(/\s+/)) { if ((cur + ' ' + w).trim().length > n && cur) { out.push(cur); cur = w } else cur = (cur + ' ' + w).trim() }
    if (cur) out.push(cur); return out
}
// text block: top-aligned at y, or centred on y when mid is set
const txt = (t, x, y, n, { cls = 'ae-t', lh = 22, anchor = 'start', mid = false } = {}) => {
    const ls = lines(t, n), y0 = mid ? y - (ls.length - 1) * lh / 2 : y
    return `<text x="${x}" y="${y0}" text-anchor="${anchor}" class="${cls}">${ls.map((l, i) => `<tspan x="${x}" y="${y0 + i * lh}">${esc(l)}</tspan>`).join('')}</text>`
}

// the icon set: simple line drawings, centred on (x, y), about 2s wide
export function icon(kind, x, y, s = 22, ink = T.ink) {
    const st = `fill="none" stroke="${ink}" stroke-width="${Math.max(2, s / 9)}" stroke-linecap="round" stroke-linejoin="round"`
    const d = {
        person: `<circle cx="${x}" cy="${y - s * .35}" r="${s * .38}" ${st}/><path d="M${x - s * .75} ${y + s * .8} Q${x} ${y - s * .05} ${x + s * .75} ${y + s * .8}" ${st}/>`,
        conductor: `<circle cx="${x}" cy="${y}" r="${s * .28}" ${st}/>${[[-.8, -.7], [.8, -.7], [-.8, .7], [.8, .7]].map(([a, b]) => `<circle cx="${x + a * s}" cy="${y + b * s}" r="${s * .18}" ${st}/><path d="M${x + a * s * .3} ${y + b * s * .3} L${x + a * s * .72} ${y + b * s * .63}" ${st}/>`).join('')}`,
        dashboard: `<rect x="${x - s * .9}" y="${y - s * .7}" width="${s * 1.8}" height="${s * 1.4}" rx="${s * .2}" ${st}/><path d="M${x - s * .55} ${y - s * .25} H${x + s * .55} M${x - s * .55} ${y + .05 * s} H${x + s * .3} M${x - s * .55} ${y + s * .35} H${x + s * .05}" ${st}/>`,
        dev: `<path d="M${x - s * .35} ${y - s * .55} L${x - s * .9} ${y} L${x - s * .35} ${y + s * .55} M${x + s * .35} ${y - s * .55} L${x + s * .9} ${y} L${x + s * .35} ${y + s * .55} M${x + s * .15} ${y - s * .7} L${x - s * .15} ${y + s * .7}" ${st}/>`,
        vault: `<rect x="${x - s * .7}" y="${y - s * .15}" width="${s * 1.4}" height="${s * .95}" rx="${s * .15}" ${st}/><path d="M${x - s * .42} ${y - s * .15} V${y - s * .45} A${s * .42} ${s * .42} 0 0 1 ${x + s * .42} ${y - s * .45} V${y - s * .15}" ${st}/><circle cx="${x}" cy="${y + s * .3}" r="${s * .1}" ${st}/>`,
        star: `<path d="${[...Array(10)].map((_, i) => { const r = i % 2 ? s * .42 : s * .95, a = Math.PI / 5 * i - Math.PI / 2; return `${i ? 'L' : 'M'}${(x + r * Math.cos(a)).toFixed(1)} ${(y + r * Math.sin(a)).toFixed(1)}` }).join(' ')}Z" ${st}/>`,
        shield: `<path d="M${x} ${y - s * .9} L${x + s * .75} ${y - s * .6} V${y} Q${x + s * .7} ${y + s * .65} ${x} ${y + s * .95} Q${x - s * .7} ${y + s * .65} ${x - s * .75} ${y} V${y - s * .6} Z" ${st}/><path d="M${x - s * .3} ${y} L${x - s * .05} ${y + s * .28} L${x + s * .35} ${y - s * .25}" ${st}/>`,
        paper: `<path d="M${x - s * .6} ${y - s * .85} H${x + s * .3} L${x + s * .65} ${y - s * .5} V${y + s * .85} H${x - s * .6} Z" ${st}/><path d="M${x - s * .3} ${y - s * .3} H${x + s * .35} M${x - s * .3} ${y + s * .05} H${x + s * .35} M${x - s * .3} ${y + s * .4} H${x + s * .1}" ${st}/>`,
        pulse: `<path d="M${x - s} ${y} H${x - s * .45} L${x - s * .2} ${y - s * .7} L${x + s * .15} ${y + s * .7} L${x + s * .4} ${y} H${x + s}" ${st}/>`,
        bulb: `<path d="M${x - s * .3} ${y + s * .45} Q${x - s * .75} ${y + s * .05} ${x - s * .7} ${y - s * .3} A${s * .7} ${s * .7} 0 0 1 ${x + s * .7} ${y - s * .3} Q${x + s * .75} ${y + s * .05} ${x + s * .3} ${y + s * .45} Z M${x - s * .25} ${y + s * .7} H${x + s * .25} M${x - s * .15} ${y + s * .92} H${x + s * .15}" ${st}/>`,
        key: `<circle cx="${x - s * .45}" cy="${y}" r="${s * .38}" ${st}/><path d="M${x - s * .07} ${y} H${x + s * .9} M${x + s * .6} ${y} V${y + s * .35} M${x + s * .85} ${y} V${y + s * .3}" ${st}/>`,
        chat: `<path d="M${x - s * .9} ${y - s * .65} H${x + s * .9} V${y + s * .4} H${x - s * .2} L${x - s * .6} ${y + s * .8} V${y + s * .4} H${x - s * .9} Z" ${st}/>`,
        hand: `<path d="M${x - s * .8} ${y + s * .1} L${x - s * .1} ${y + s * .7} L${x + s * .9} ${y - s * .6}" ${st}/>`,
        book: `<path d="M${x} ${y - s * .55} Q${x - s * .5} ${y - s * .85} ${x - s * .95} ${y - s * .6} V${y + s * .65} Q${x - s * .5} ${y + s * .4} ${x} ${y + s * .7} Q${x + s * .5} ${y + s * .4} ${x + s * .95} ${y + s * .65} V${y - s * .6} Q${x + s * .5} ${y - s * .85} ${x} ${y - s * .55} V${y + s * .7}" ${st}/>`,
        team: `<circle cx="${x}" cy="${y - s * .4}" r="${s * .3}" ${st}/><circle cx="${x - s * .75}" cy="${y - s * .15}" r="${s * .24}" ${st}/><circle cx="${x + s * .75}" cy="${y - s * .15}" r="${s * .24}" ${st}/><path d="M${x - s * .55} ${y + s * .75} Q${x} ${y - s * .1} ${x + s * .55} ${y + s * .75} M${x - s * 1.2} ${y + s * .65} Q${x - s * .75} ${y + s * .1} ${x - s * .35} ${y + s * .4} M${x + s * 1.2} ${y + s * .65} Q${x + s * .75} ${y + s * .1} ${x + s * .35} ${y + s * .4}" ${st}/>`
    }
    return d[kind] || d.star
}
const badge = (kind, x, y, r, col) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${E(col)}" stroke-width="2.5"/>${icon(kind, x, y, r * .55)}`
const ARROW = `<defs><marker id="ae-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="${T.soft}"/></marker></defs>`
const svg = (label, inner) => `<svg class="ae-svg" viewBox="0 0 1200 675" role="img" aria-label="${esc(label)}">${ARROW}<rect width="1200" height="675" rx="28" fill="${T.canvas}"/>${inner}</svg>`

// ------------------------------------------------------------------------------------------------ the content
// the four helpers everyone should have (the start page's levels: conductor L3, dashboard L4, vault L6)
export const CORE = [
    { k: 'conductor', col: 'lavender', name: 'Conductor', tag: 'Must have (step L3)', one: 'Runs your other agents and keeps your corner of the site tidy.', like: 'The captain of your little team.', ask: '"Brief me before the stand-up." "Start my vault agent."' },
    { k: 'dashboard', col: 'sky', name: 'Dashboard', tag: 'Must have (step L4)', one: 'Keeps the one page you read first, and asks you one short question each run.', like: 'Your personal noticeboard.', ask: '"Put the factory at the top." "Hide what I never read."' },
    { k: 'dev', col: 'mint', name: 'Dev', tag: 'Good to have', one: 'Builds small pages and tools for you, fast, and fixes them.', like: 'A handy builder on call.', ask: '"Make a page per company." "Add a checklist."' },
    { k: 'vault', col: 'butter', name: 'Vault', tag: 'Must have (step L6)', one: 'Makes your locked folders (SGit vaults) and looks after their keys.', like: 'The keeper of your safe.', ask: '"Make a private vault for my contacts."' }
]
// the specialists you can add, grouped by the kind of work (examples from the roster, data/team.json)
export const SPECIAL = [
    { col: 'peach', icon: 'chat', head: 'Telling the story', items: [
        ['messaging', 'Checks every page tells the same story', 'Indi'],
        ['positioning', 'Shapes how we describe RiskMandate', 'Nimay'],
        ['outreach', 'Finds who to contact and drafts the messages', 'Silvio'],
        ['leads', 'Keeps track of the warm contacts', 'Nimay'],
        ['video', 'Gets the videos out to YouTube and LinkedIn', 'Silvio']] },
    { col: 'mint', icon: 'star', head: 'Making things', items: [
        ['factory', 'One picture page per company we want to meet', 'Indi'],
        ['designer', 'Shirts, cards, flyers and the look of pages', 'Sarah, Jose'],
        ['writer', 'The words that go on the designs', 'Sarah'],
        ['builder', "Daniela's learning site", 'Indi'],
        ['automation', 'Sends the team news to WhatsApp by itself', 'Jose']] },
    { col: 'sky', icon: 'book', head: 'Running the trip', items: [
        ['pm', 'Deadlines, the task board, who does what', 'Vicky'],
        ['logistics', 'Printing, sizes and deliveries', 'Vicky'],
        ['procurement', 'Finds suppliers and drafts the orders', 'Silvio'],
        ['local', 'Printers and ads near home, prices, lead times', 'Silvio'],
        ['collaboration', 'The meeting calendar and a brief per meeting', 'Angelo']] },
    { col: 'rose', icon: 'shield', head: 'Keeping it safe', items: [
        ['watcher', 'Tells you who changed what since last time', 'Jose'],
        ['reviewer', 'Checks code before it goes out', 'Jose'],
        ['policy', 'Writes the rules each agent must follow', 'Angelo'],
        ['helper', 'Helps anyone stuck on setup', 'Jose, Angelo']] }
]
// the team's shared agents, in Dinis's account, working for everyone
export const SHARED = [
    ['conductor', 'conductor', 'lavender', 'The team conductor', 'Keeps the site true, the roster and the task board'],
    ['journalist', 'paper', 'peach', 'The reporter', 'A report every two hours and the home page'],
    ['pulse', 'pulse', 'rose', 'The mood check', 'Reads the check-ins, flags who is stuck'],
    ['security', 'shield', 'sage', 'The guard', 'Checks every change for secrets and slips'],
    ['mentor', 'bulb', 'butter', 'The coach', "Hourly tips on each person's setup"],
    ['abp', 'book', 'sky', 'The rule writer', 'A behaviour policy for every agent'],
    ['sgit', 'vault', 'butter', 'The key keeper', "The team's locked vaults and keys"],
    ['project-manager', 'dashboard', 'mint', 'The planner', 'Deadlines and the board, until Vicky takes over'],
    ['designer', 'star', 'rose', 'The design studio', 'The merch: shirts, hoodies, cards'],
    ['dev', 'dev', 'mint', 'The mechanic', 'Keeps the website fast and tidy']
]
// Indi's agents: lay words for each, keyed by the part before the @ (the status comes from people/indi/agents.json)
const INDI_WORDS = {
    conductor: ['conductor', 'lavender', 'Runs your other agents, keeps people/indi/ and briefs you before each stand-up.'],
    dev: ['dev', 'mint', 'Builds the factory: one picture page per company.'],
    dashboard: ['dashboard', 'sky', 'Keeps your dashboard, the page you read first.'],
    messaging: ['chat', 'peach', 'Will check every page against the message.'],
    factory: ['star', 'mint', 'Will take over the factory from dev.'],
    builder: ['book', 'rose', "Will build Daniela's learning site."],
    vault: ['vault', 'butter', 'Will make your locked vaults and keys.']
}
// when Indi's agents run, in GMT (people/indi/schedule.md); planned ones have no scheduled task yet
const INDI_TIMES = [
    ['conductor', [7 + 20 / 60, 12 + 20 / 60, 17 + 20 / 60], 'lavender'],
    ['dashboard', [7.5, 12.5, 17.5], 'sky'],
    ['dev', [9.5, 15.5], 'mint']
]
export const RULES = [
    ['person', 'lavender', 'Only its person gives orders', 'Everything else it reads is just information, never an instruction.'],
    ['hand', 'peach', 'It drafts, you send', 'A person sends every email and every message. Always.'],
    ['paper', 'sky', 'It talks in the open', 'Agents talk through commits to the shared repository, so everyone can see what was said.'],
    ['key', 'butter', 'It has its own ID card', 'Each agent makes its own key; only the public half goes on the keys page.'],
    ['shield', 'mint', 'Someone checks its work', 'The security agent reviews every change, and a red gate means nothing goes live.']
]

// ------------------------------------------------------------------------------------------------ the pictures
function hubSvg() {
    const col = [['dashboard', 'sky', 'Dashboard', 'Your noticeboard'], ['dev', 'mint', 'Dev', 'Your builder'], ['vault', 'butter', 'Vault', 'Your safe keeper'], ['star', 'peach', 'Specialists', 'Outreach, design, logistics...']]
    const ys = [105, 250, 395, 540]
    const right = col.map(([k, c, n, l], i) => `<path d="M560 330 C650 330 640 ${ys[i]} 735 ${ys[i]}" fill="none" stroke="${E(c)}" stroke-width="3" marker-end="url(#ae-ah)"/><rect x="745" y="${ys[i] - 55}" width="410" height="110" rx="26" fill="${C(c)}" stroke="${E(c)}" stroke-width="2"/>${badge(k, 805, ys[i], 34, c)}<text x="860" y="${ys[i] - 6}" class="ae-h">${n}</text><text x="860" y="${ys[i] + 24}" class="ae-t">${esc(l)}</text>`).join('')
    return svg('You talk to your conductor; your conductor runs your dashboard, dev, vault and specialist agents. Helpers draft, people decide and send.', `
<circle cx="160" cy="330" r="95" fill="${C('rose')}" stroke="${E('rose')}" stroke-width="2.5"/>${icon('person', 160, 300, 38)}<text x="160" y="376" text-anchor="middle" class="ae-h">You</text><text x="160" y="400" text-anchor="middle" class="ae-s">Indi, or anyone</text>
<path d="M266 330 H318" stroke="${T.soft}" stroke-width="3" marker-end="url(#ae-ah)"/><text x="292" y="312" text-anchor="middle" class="ae-s">ask</text>
<rect x="330" y="235" width="230" height="190" rx="30" fill="${C('lavender')}" stroke="${E('lavender')}" stroke-width="2.5"/>${badge('conductor', 445, 290, 38, 'lavender')}<text x="445" y="360" text-anchor="middle" class="ae-h">Conductor</text><text x="445" y="388" text-anchor="middle" class="ae-s">the captain: passes</text><text x="445" y="408" text-anchor="middle" class="ae-s">the work on</text>
${right}
<rect x="40" y="520" width="640" height="110" rx="26" fill="#fff" stroke="${T.line}" stroke-width="2"/>${icon('hand', 100, 575, 26)}<text x="140" y="565" class="ae-h ae-h2">Helpers draft. People decide and send.</text><text x="140" y="597" class="ae-t">Every agent works for one named person, on a schedule.</text>
<text x="40" y="70" class="ae-k">EACH PERSON'S LITTLE TEAM</text><text x="40" y="104" class="ae-t">You talk to one agent. It runs the rest.</text>`)
}

function coreSvg() {
    const cards = CORE.map((a, i) => {
        const x = 30 + i * 290, w = 270
        return `<g><rect x="${x}" y="95" width="${w}" height="470" rx="28" fill="#fff" stroke="${E(a.col)}" stroke-width="2.5"/><path d="M${x} ${95 + 28} A28 28 0 0 1 ${x + 28} 95 H${x + w - 28} A28 28 0 0 1 ${x + w} ${95 + 28} V210 H${x} Z" fill="${C(a.col)}"/>${badge(a.k, x + 52, 152, 32, a.col)}<text x="${x + 98}" y="148" class="ae-h">${a.name}</text><text x="${x + 98}" y="176" class="ae-s">${esc(a.tag)}</text>
<text x="${x + 22}" y="248" class="ae-k">WHAT IT DOES</text>${txt(a.one, x + 22, 276, 25)}
<text x="${x + 22}" y="384" class="ae-k">THINK OF IT AS</text>${txt(a.like, x + 22, 412, 25, { cls: 'ae-t ae-i' })}
<text x="${x + 22}" y="470" class="ae-k">ASK IT</text>${txt(a.ask, x + 22, 498, 27, { cls: 'ae-s' })}</g>`
    }).join('')
    return svg('The four helpers everyone should have: conductor, dashboard, dev and vault, each with what it does, what it is like and what to ask it.', `
<text x="30" y="58" class="ae-k">THE FOUR EVERYONE SHOULD HAVE</text><text x="440" y="58" class="ae-t">Start them in this order: conductor, dashboard, then vault.</text>${cards}
<rect x="30" y="590" width="1140" height="58" rx="22" fill="${C('lavender')}"/><text x="600" y="626" text-anchor="middle" class="ae-t">Each one is a Claude session in your own account, named <tspan class="ae-b">&lt;helper&gt;@web-summit.&lt;you&gt;</tspan>, e.g. dev@web-summit.indi</text>`)
}

function specialSvg() {
    const cols = SPECIAL.map((g, i) => {
        const x = 30 + i * 290, w = 270
        const items = g.items.map(([n, l, who], j) => { const y = 170 + j * 92; return `<rect x="${x + 12}" y="${y}" width="${w - 24}" height="82" rx="18" fill="#fff"/><text x="${x + 26}" y="${y + 25}" class="ae-b">${esc(n)}</text><text x="${x + w - 24}" y="${y + 25}" text-anchor="end" class="ae-s ae-who">${esc(who)}</text>${txt(l, x + 26, y + 48, 26, { cls: 'ae-s', lh: 19 })}` }).join('')
        return `<rect x="${x}" y="95" width="${w}" height="555" rx="28" fill="${C(g.col)}" stroke="${E(g.col)}" stroke-width="2"/>${badge(g.icon, x + 44, 133, 24, g.col)}<text x="${x + 80}" y="141" class="ae-h ae-h2">${esc(g.head)}</text>${items}`
    }).join('')
    return svg('Specialist agents you can add, in four groups: telling the story, making things, running the trip and keeping it safe, each with an example owner.', `
<text x="30" y="58" class="ae-k">SPECIALISTS YOU CAN ADD</text><text x="350" y="58" class="ae-t">Only if your role needs one. The name on the right already has it.</text>${cols}`)
}

function sharedSvg() {
    const cx = 600, cy = 345, nodes = SHARED.map(([n, k, c, role, l], i) => {
        const a = -Math.PI / 2 + i * Math.PI / 5, x = cx + 445 * Math.cos(a), y = cy + 0 + 255 * Math.sin(a)
        return { x, y, s: `<rect x="${x - 112}" y="${y - 54}" width="224" height="108" rx="22" fill="${C(c)}" stroke="${E(c)}" stroke-width="2"/>${badge(k, x - 76, y - 20, 22, c)}<text x="${x - 46}" y="${y - 24}" class="ae-b">${esc(role)}</text><text x="${x - 46}" y="${y - 3}" class="ae-s ae-who">${esc(n)}</text>${txt(l, x - 98, y + 24, 25, { cls: 'ae-s', lh: 19 })}`, c }
    })
    return svg("The team's ten shared agents, run from Dinis's account for everyone: conductor, journalist, pulse, security, mentor, abp, sgit, project-manager, designer and dev.", `
${nodes.map(n => `<path d="M${cx} ${cy} L${n.x} ${n.y}" stroke="${E(n.c)}" stroke-width="2.5" stroke-dasharray="7 6"/>`).join('')}
<ellipse cx="${cx}" cy="${cy}" rx="150" ry="95" fill="#fff" stroke="${T.ink}" stroke-width="2.5"/>${icon('team', cx, cy - 30, 28)}<text x="${cx}" y="${cy + 30}" text-anchor="middle" class="ae-h ae-h2">The whole team</text><text x="${cx}" y="${cy + 56}" text-anchor="middle" class="ae-s">run from Dinis's account</text>
${nodes.map(n => n.s).join('')}`)
}

function indiSvg(agents) {
    const short = a => a.name.split('@')[0]
    const on = agents.filter(a => a.status === 'running'), off = agents.filter(a => a.status !== 'running')
    const card = (a, x, y, w, h, live) => { const [k, c, l] = INDI_WORDS[short(a)] || ['star', 'peach', a.job]; return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="24" fill="${live ? C(c) : '#fff'}" stroke="${E(c)}" stroke-width="2.5" ${live ? '' : 'stroke-dasharray="8 6"'}/>${badge(k, x + 42, y + 42, 26, c)}<text x="${x + 80}" y="${y + 38}" class="ae-h ae-h2">${esc(short(a))}</text><text x="${x + 80}" y="${y + 62}" class="ae-s ae-who">${live ? 'running' : 'planned'}</text>${txt(l, x + 22, y + 92, live ? 40 : 26, { cls: 'ae-s', lh: 19 })}` }
    const wOn = 1140 / Math.max(on.length, 1) - 15, wOff = 1140 / Math.max(off.length, 1) - 15
    const top = on.map((a, i) => card(a, 30 + i * (wOn + 15), 85, wOn, 140, true)).join('')
    const mid = off.map((a, i) => card(a, 30 + i * (wOff + 15), 270, wOff, 150, false)).join('')
    // the day, 06:00 to 19:00 GMT
    const X = h => 190 + (h - 6) * 74, scheduled = Object.fromEntries(agents.map(a => [short(a), !!a.schedule]))
    const axis = [6, 8, 10, 12, 14, 16, 18].map(h => `<path d="M${X(h)} 470 V632" stroke="${T.line}" stroke-width="2"/><text x="${X(h)}" y="656" text-anchor="middle" class="ae-s">${String(h).padStart(2, '0')}:00</text>`).join('')
    const stand = [13, 18].map(h => `<rect x="${X(h) - 13}" y="462" width="26" height="176" rx="13" fill="${C('rose')}" stroke="${E('rose')}" stroke-width="2"/>`).join('') + `<text x="${X(13) + 22}" y="482" class="ae-s">stand-ups</text>`
    const lanes = INDI_TIMES.map(([n, hs, c], i) => { const y = 510 + i * 44, s = scheduled[n]; return `<text x="40" y="${y + 6}" class="ae-b">${n}</text>${hs.map(h => `<circle cx="${X(h)}" cy="${y}" r="11" fill="${s ? E(c) : '#fff'}" stroke="${E(c)}" stroke-width="3"/>`).join('')}` }).join('')
    return svg(`Indi's agents: ${on.length} running (${on.map(short).join(', ')}) and ${off.length} planned (${off.map(short).join(', ')}), and when they run in the day.`, `
<text x="30" y="62" class="ae-k">INDI'S AGENTS: RUNNING NOW</text>${top}
<text x="30" y="258" class="ae-k">PLANNED: NOT STARTED YET</text>${mid}
<text x="30" y="455" class="ae-k">WHEN THEY RUN (GMT)</text>${axis}${stand}${lanes}
<circle cx="760" cy="450" r="8" fill="${T.soft}"/><text x="775" y="456" class="ae-s">scheduled</text><circle cx="880" cy="450" r="8" fill="#fff" stroke="${T.soft}" stroke-width="3"/><text x="895" y="456" class="ae-s">planned, no schedule yet</text>`)
}

const KIND = n => { const k = n.split('@')[0]; return k === 'sgit' ? 'vault' : k }
function matrixSvg(rows) {
    const cols = [['conductor', 'lavender'], ['dashboard', 'sky'], ['dev', 'mint'], ['vault', 'butter']]
    const rh = Math.min(56, 520 / rows.length), y0 = 120
    const head = cols.map(([n, c], i) => `${badge(n, 300 + i * 130, 82, 20, c)}<text x="${300 + i * 130}" y="${y0 - 2}" text-anchor="middle" class="ae-s ae-b">${n}</text>`).join('') + `<text x="840" y="${y0 - 2}" class="ae-s ae-b">specialists</text>`
    const body = rows.map((r, j) => {
        const y = y0 + 12 + j * rh, mine = r.id === 'indi'
        const cells = cols.map(([n, c], i) => r.kinds.has(n) ? `<circle cx="${300 + i * 130}" cy="${y + rh / 2}" r="15" fill="${C(c)}" stroke="${E(c)}" stroke-width="2.5"/>${icon('hand', 300 + i * 130, y + rh / 2, 8)}` : `<circle cx="${300 + i * 130}" cy="${y + rh / 2}" r="6" fill="${T.line}"/>`).join('')
        let sp = r.special.join(', '); const more = r.special.length; while (sp.length > 30) { const parts = sp.split(', '); parts.pop(); sp = parts.join(', ') }
        const left = more - (sp ? sp.split(', ').length : 0)
        return `<rect x="30" y="${y + 3}" width="1140" height="${rh - 6}" rx="16" fill="${mine ? C('rose') : j % 2 ? '#fff' : T.paper}" ${mine ? `stroke="${E('rose')}" stroke-width="2"` : ''}/><text x="56" y="${y + rh / 2 + 7}" class="ae-b">${esc(r.name)}</text>${cells}<text x="840" y="${y + rh / 2 + 6}" class="ae-s">${esc(sp || 'none yet')}${left > 0 ? ` +${left} more` : ''}</text>`
    }).join('')
    return svg(`Who has which helpers: ${rows.map(r => `${r.name}: ${[...r.kinds].join(', ') || 'none'}`).join('; ')}.`, `
<text x="30" y="58" class="ae-k">WHO HAS WHICH HELPERS</text><text x="30" y="92" class="ae-s">From the team roster,</text><text x="30" y="112" class="ae-s">read at every build.</text>${head}${body}`)
}

function rulesSvg() {
    const tiles = RULES.map(([k, c, h, l], i) => { const x = 30 + i * 230, w = 214; return `<rect x="${x}" y="95" width="${w}" height="400" rx="28" fill="${C(c)}" stroke="${E(c)}" stroke-width="2"/><text x="${x + 24}" y="140" class="ae-k">${i + 1}</text>${badge(k, x + w / 2, 190, 44, c)}${txt(h, x + w / 2, 275, 16, { cls: 'ae-h ae-h2', anchor: 'middle', lh: 28 })}${txt(l, x + w / 2, 350, 21, { cls: 'ae-s', anchor: 'middle', lh: 22 })}` }).join('')
    return svg('Five rules every agent follows: only its person gives orders; it drafts and a person sends; it talks in the open through commits; it has its own key; someone checks its work.', `
<text x="30" y="58" class="ae-k">FIVE RULES EVERY AGENT FOLLOWS</text><text x="420" y="58" class="ae-t">The same for every helper, on every team.</text>${tiles}
<rect x="30" y="525" width="1140" height="120" rx="26" fill="#fff" stroke="${T.line}" stroke-width="2"/>${badge('book', 100, 585, 38, 'sky')}<text x="160" y="572" class="ae-h ae-h2">And each agent has a written job description</text><text x="160" y="606" class="ae-t">An Agent Behaviour Policy: what it can reach, what it may do, and the gap between.</text><text x="160" y="632" class="ae-s">That is RiskMandate, used on ourselves.</text>`)
}

// ------------------------------------------------------------------------------------------------ the pages
const panel = (id, num, title, graphic, words) => `<section class="ae-panel" id="${id}"><header><span class="ae-num">${num}</span><h2>${esc(title)}</h2><button class="ae-expand" type="button" aria-label="Expand ${esc(title)} to fill the screen">⤢ Expand</button></header><div class="ae-graphic">${graphic}</div><div class="ae-words">${words}</div></section>`

function roster(ROOT) {
    const team = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/team.json'), 'utf8'))
    return team.members.filter(m => m.kind === 'human').map(m => {
        const f = path.join(ROOT, 'people', m.id, 'agents.json')
        let names = m.agents || []
        if (fs.existsSync(f)) { const d = JSON.parse(fs.readFileSync(f, 'utf8')); names = (Array.isArray(d) ? d : d.agents || []).map(a => a.name) }
        const kinds = new Set(names.map(KIND)), core = new Set(['conductor', 'dashboard', 'dev', 'vault'])
        return { id: m.id, name: m.name.split(' ')[0], kinds: new Set([...kinds].filter(k => core.has(k))), special: [...kinds].filter(k => !core.has(k)).sort() }
    })
}

export function build(ROOT) {
    const indi = JSON.parse(fs.readFileSync(path.join(ROOT, 'people/indi/agents.json'), 'utf8'))
    const rows = roster(ROOT), short = a => a.name.split('@')[0]
    const on = indi.filter(a => a.status === 'running'), off = indi.filter(a => a.status !== 'running')
    const HEAD = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600&family=Nunito:wght@600;800&display=swap"><link rel="stylesheet" href="UP/agents.css"><script src="UP/agents.js" defer></script>'
    const p = t => `<p>${t}</p>`
    const body = `<div class="ae">
<p class="ae-lead"><b>The question:</b> what do the different agents do? <b>The short answer:</b> each person has a small team of AI helpers. One of them, the conductor, runs the rest. They draft and build; people decide and send.</p>
<nav class="ae-toc" aria-label="The pictures"><a href="#hub">1. Your little team</a><a href="#core">2. The four everyone needs</a><a href="#special">3. Specialists</a><a href="#shared">4. The team's shared agents</a><a href="#indi">5. Indi's agents</a><a href="#who">6. Who has what</a><a href="#rules">7. The rules</a></nav>
${panel('hub', 1, 'Each person has a little team of helpers', hubSvg(), p('You talk to one agent, your <b>conductor</b>. It passes work to the others: your <b>dashboard</b> agent (the page you read first), your <b>dev</b> agent (builds small pages and tools), your <b>vault</b> agent (locked folders and keys), and any <b>specialist</b> your role needs. Each one is a separate Claude session, named <code>&lt;helper&gt;@web-summit.&lt;you&gt;</code>.'))}
${panel('core', 2, 'The four helpers everyone should have', coreSvg(), p('The <a href="../../../start/index.html#steps">start page</a> walks everyone through them in order: conductor (L3), dashboard and keys (L4), a schedule (L5), vault (L6). A dev agent is not a step, but most of the team has one because it gets small things built in minutes. The prompts to start each one are in your kit and on <a href="../../../agents/index.html">the agents page</a>.'))}
${panel('special', 3, 'Specialists you can add, if your role needs one', specialSvg(), p("These are optional. Add one when a job keeps coming back: Silvio's procurement agent drafts every message to the printers, Vicky's logistics agent tracks sizes and deliveries. Ask your conductor to start it, and it goes on your list in <code>people/&lt;you&gt;/agents.json</code>."))}
${panel('shared', 4, "The team's shared agents, working for everyone", sharedSvg(), p("Ten agents run in Dinis's account for the whole team. You do not start these; you benefit from them. The reporter writes <a href=\"../../../reports/index.html\">the reports</a>, the mood check writes <a href=\"../../../pulse/index.html\">the pulse</a>, the coach leaves notes on your dashboard, and the guard checks every change anyone makes."))}
${panel('indi', 5, "Indi's agents, and when they run", indiSvg(indi), p(`Indi has access to <b>${on.length} running</b> agents (${on.map(a => `<code>${esc(a.name)}</code>`).join(', ')}) and <b>${off.length} planned</b> ones (${off.map(a => esc(short(a))).join(', ')}). The conductor briefs Indi ten minutes or more before each stand-up. Times from <a href="https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/indi/schedule.md">Indi's schedule</a>; the list from <code>people/indi/agents.json</code>, read at every build.`))}
${panel('who', 6, 'Who has which helpers', matrixSvg(rows), p('A filled dot means that person has listed that helper. Built from each person\'s <code>agents.json</code> (or the roster), so it changes as people start new agents. Indi\'s row is pink. See <a href="../../../team/index.html">the team</a> for each person.'))}
${panel('rules', 7, 'Five rules every agent follows', rulesSvg(), p('Every agent has an <a href="../../../abp/index.html">Agent Behaviour Policy</a>: its reach (what it can touch), its mandate (what it may do) and the gap between. Its public key is on <a href="../../../keys/index.html">the keys page</a>.'))}
<p class="ae-meta">Asked by Indi on 4 November 2026, and on <a href="../../../meetings/index.html">the stand-up agenda</a> as a question. Drawn on <a href="design-system/index.html">this page's design system</a>. Back to <a href="../index.html">Indi's dashboard</a>; see also <a href="../factory/index.html">the factory</a>.</p></div>`
    const md = `**The question:** what do the different agents do? **The short answer:** each person has a small team of AI helpers. One of them, the conductor, runs the rest. They draft and build; people decide and send.

## 1. Each person has a little team of helpers

You talk to your conductor; it passes work to your dashboard, dev, vault and specialist agents. Each is a Claude session named \`<helper>@web-summit.<you>\`. Helpers draft; people decide and send.

## 2. The four helpers everyone should have

${CORE.map(a => `- **${a.name}** (${a.tag}): ${a.one} Think of it as: ${a.like} Ask it: ${a.ask}`).join('\n')}

## 3. Specialists you can add

${SPECIAL.map(g => `### ${g.head}\n\n${g.items.map(([n, l, w]) => `- **${n}** (${w}): ${l}.`).join('\n')}`).join('\n\n')}

## 4. The team's shared agents (Dinis's account, for everyone)

${SHARED.map(([n, , , r, l]) => `- **${n}@web-summit.dinis**, ${r.toLowerCase()}: ${l}.`).join('\n')}

## 5. Indi's agents

${indi.map(a => `- **${a.name}** (${a.status}): ${(INDI_WORDS[short(a)] || [])[2] || a.job}`).join('\n')}

When they run (GMT): conductor 07:20, 12:20, 17:20; dashboard 07:30, 12:30, 17:30 (planned); dev 09:30, 15:30 (planned). Stand-ups 13:00 and 18:00.

## 6. Who has which helpers

| Person | Conductor | Dashboard | Dev | Vault | Specialists |
|---|---|---|---|---|---|
${rows.map(r => `| ${r.name} | ${['conductor', 'dashboard', 'dev', 'vault'].map(k => r.kinds.has(k) ? 'yes' : '').join(' | ')} | ${r.special.join(', ') || 'none yet'} |`).join('\n')}

## 7. Five rules every agent follows

${RULES.map(([, , h, l], i) => `${i + 1}. **${h}.** ${l}`).join('\n')}

Each agent also has an Agent Behaviour Policy: its reach, its mandate and the gap between. That is RiskMandate, used on ourselves.
`
    // the design system's own page: tokens, type, components and icons
    const sw = Object.entries(T).filter(([, v]) => Array.isArray(v)).map(([k, [f, e]]) => `<li class="ae-sw"><span style="background:${f};border-color:${e}"></span><b>${k}</b><code>fill ${f}</code><code>edge ${e}</code></li>`).join('')
    const neutrals = ['ink', 'soft', 'paper', 'line', 'canvas'].map(k => `<li class="ae-sw"><span style="background:${T[k]}"></span><b>${k}</b><code>${T[k]}</code></li>`).join('')
    const icons = ['person', 'conductor', 'dashboard', 'dev', 'vault', 'star', 'shield', 'paper', 'pulse', 'bulb', 'key', 'chat', 'hand', 'book', 'team'].map((k, i) => { const c = ['lavender', 'sky', 'mint', 'butter', 'peach', 'rose', 'sage'][i % 7]; return `<li><svg viewBox="0 0 80 80" width="64" height="64" aria-hidden="true">${badge(k, 40, 40, 32, c)}</svg><code>${k}</code></li>` }).join('')
    const ds = `<div class="ae">
<p class="ae-lead">The design system behind <a href="../index.html">what the different agents do</a>: soft pastel fills, a deeper edge of the same colour, dark ink on light in both themes, and two rounded fonts chosen to be easy on the eye. Landscape (16:9) pictures, drawn as inline SVG.</p>
<section class="ae-panel"><header><span class="ae-num">A</span><h2>Colour</h2></header><p>Each colour is a pair: a pastel <b>fill</b> and a deeper <b>edge</b> for borders, lines and dots. Text is always <b>ink</b> on a fill, never colour on colour, so it reads at AA contrast.</p><ul class="ae-sws">${sw}</ul><h3>Neutrals</h3><ul class="ae-sws">${neutrals}</ul></section>
<section class="ae-panel"><header><span class="ae-num">B</span><h2>Type</h2></header><p class="ae-type-h">Nunito 800, for headings: rounded and friendly</p><p class="ae-type-b">Lexend 400, for reading: designed to lower visual stress, with generous letter spacing. Body at 1.05rem, line height 1.6.</p><p class="ae-type-k">LABEL: LEXEND 600, SPACED CAPITALS</p><p>In the pictures: headings 26px, body 19px, small 16px, labels 15px, on a 1200 by 675 canvas.</p></section>
<section class="ae-panel"><header><span class="ae-num">C</span><h2>Shape and space</h2></header><ul><li><b>Corners:</b> 28px on panels and cards, 18 to 22px on inner cards, round pills for chips.</li><li><b>Lines:</b> 2 to 3px, in the edge colour; dashed means "planned" or "a link, not a command".</li><li><b>Space:</b> 30px outer margin on the canvas, 20px gaps between cards.</li><li><b>Shape:</b> 16:9 landscape; on a phone the picture scrolls sideways, and every panel expands to fill the screen.</li></ul><p><span class="ae-chip" style="--c:${C('mint')};--e:${E('mint')}">running</span> <span class="ae-chip ae-chip-dash" style="--c:#fff;--e:${E('peach')}">planned</span> <span class="ae-chip" style="--c:${C('lavender')};--e:${E('lavender')}">must have</span></p></section>
<section class="ae-panel"><header><span class="ae-num">D</span><h2>Icons</h2></header><p>Line drawings in ink, inside a white badge with a coloured edge. One idea per icon.</p><ul class="ae-icons">${icons}</ul></section>
<section class="ae-panel"><header><span class="ae-num">E</span><h2>Using it</h2></header><p>Link <code>people/indi/agents/agents.css</code> and the two Google fonts, wrap the page in <code>&lt;div class="ae"&gt;</code>, and use <code>.ae-panel</code>, <code>.ae-chip</code> and the <code>--ae-*</code> tokens. The SVG helpers (<code>icon</code>, the token object <code>T</code>) are exported by <code>people/indi/agents/explainer.mjs</code>.</p></section>
</div>`
    const dsMd = `The design system behind "what the different agents do": pastel fills with a deeper edge of the same colour, dark ink on light, rounded friendly fonts, landscape 16:9 pictures as inline SVG.

## Colour

${Object.entries(T).filter(([, v]) => Array.isArray(v)).map(([k, [f, e]]) => `- **${k}:** fill ${f}, edge ${e}`).join('\n')}
- Neutrals: ${['ink', 'soft', 'paper', 'line', 'canvas'].map(k => `${k} ${T[k]}`).join(', ')}

Text is always ink on a fill, never colour on colour.

## Type

- Headings: Nunito 800. Reading: Lexend 400, 1.05rem, line height 1.6. Labels: Lexend 600, spaced capitals.
- In pictures: headings 26px, body 19px, small 16px, labels 15px on a 1200 x 675 canvas.

## Shape and space

- Corners 28px on panels, 18 to 22px inside, pills for chips. Lines 2 to 3px in the edge colour; dashed means planned.
- 16:9 landscape; on a phone the picture scrolls sideways and every panel expands to fill the screen.

## Icons

Line drawings in ink in a white badge with a coloured edge: person, conductor, dashboard, dev, vault, star, shield, paper, pulse, bulb, key, chat, hand, book, team.
`
    return [
        { rel: 'people/indi/agents/index.html', title: 'What do the different agents do?', description: `Seven landscape pictures in lay terms: the helpers each person has, the four everyone should have, the specialists, the team's shared agents, Indi's ${indi.length} agents, who has what, and the rules they follow.`, body, md, head: HEAD.replaceAll('UP', '.') },
        { rel: 'people/indi/agents/design-system/index.html', title: 'The design system for the agent pictures', description: 'Pastel colour pairs, easy-to-read fonts, shapes, icons and how to use them: the design system behind "what the different agents do".', body: ds, md: dsMd, head: HEAD.replaceAll('UP', '..') }
    ]
}
