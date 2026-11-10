// The newsroom workflow as an infographic: /people/indi/helpers/newsroom/.
// From Indi's and Dinis's voice brief of 10 November 2026; the words are workflow.md beside this file (the twin
// points to it). Written by conductor-newsroom@web-summit.indi. Inline SVG and HTML only, so it reads without JavaScript.

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// the five roles: a soft fill, a darker edge, a name and a small picture
const ROLE = {
    person: { fill: '#ffe1d0', edge: '#e58c62', name: 'A person' },
    researcher: { fill: '#d6ecfa', edge: '#5fa3d6', name: 'The researcher (an agent)' },
    analyst: { fill: '#fff3c4', edge: '#c9a72e', name: 'The scorer (an agent)' },
    journalist: { fill: '#e3ddf7', edge: '#8b7bd1', name: 'The journalist (an agent)' },
    agent: { fill: '#cdefe3', edge: '#4fae8c', name: 'Another agent' },
}
const ICON = {
    person: e => `<circle cx="20" cy="13" r="7" fill="none" stroke="${e}" stroke-width="2.5"/><path d="M7 35 Q20 18 33 35" fill="none" stroke="${e}" stroke-width="2.5"/>`,
    researcher: e => `<circle cx="17" cy="17" r="9" fill="none" stroke="${e}" stroke-width="2.5"/><path d="M24 24 L34 34" stroke="${e}" stroke-width="3.5" stroke-linecap="round"/>`,
    analyst: e => `<rect x="7" y="22" width="6" height="12" fill="${e}"/><rect x="17" y="14" width="6" height="20" fill="${e}"/><rect x="27" y="6" width="6" height="28" fill="${e}"/>`,
    journalist: e => `<rect x="8" y="6" width="22" height="28" rx="2" fill="none" stroke="${e}" stroke-width="2.5"/><path d="M12 14 H26 M12 20 H26 M12 26 H21" stroke="${e}" stroke-width="2"/>`,
    agent: e => `<rect x="7" y="10" width="26" height="22" rx="6" fill="none" stroke="${e}" stroke-width="2.5"/><circle cx="15" cy="21" r="2.5" fill="${e}"/><circle cx="25" cy="21" r="2.5" fill="${e}"/><path d="M20 4 V10" stroke="${e}" stroke-width="2.5"/>`,
}
const icon = (r, size = 40) => `<svg class="nw-ico" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true">${ICON[r](ROLE[r].edge)}</svg>`

// the steps, in order: [role, who, title, what happens, what stays private, today or new]
const STEPS = [
    ['person', 'Indi', 'Meet someone', 'Indi talks to a person at the summit, takes a photo of their badge and records a 30-second voice note.', 'The name, the photo and the note stay in our private address book.', 'today'],
    ['researcher', 'Indi\'s main agent and a researcher agent', 'Look them up', 'The agent files the note and looks up public facts about the company, each with where it came from.', 'Nothing about the person is published.', 'today'],
    ['analyst', 'The scorer agent (GAMMA-Ray, our scoring system)', 'Score the company\'s AI', 'It makes a public scorecard on GAMMA-Ray, our own scoring system for AI agents: how much the company\'s AI agent does on its own, and how well that is controlled.', 'It uses public information only.', 'new'],
    ['person', 'Indi', 'Show the demo', 'Indi shows a page from RiskMandate, our company. It explains that an AI agent is like a new employee given a master key: it can open many doors, but which rooms should it be in?', 'A page about their own company stays private.', 'today'],
    ['person', 'Indi and the person', 'Ask for a yes', 'Two questions, out loud: may we follow up, and may we publish the interview? The yes to publishing is filmed at the start of the video.', 'No yes, no interview.', 'today'],
    ['person', 'Indi', 'Film the interview', 'On a phone, about what the company does with AI agents: what they do, what they can reach, and who checks them.', 'The raw video is never put online.', 'today'],
    ['person', 'Indi', 'Hand over', 'Indi copies the video by hand into the newsroom\'s private drop-off place. From here an agent takes over.', 'The drop-off place is private.', 'today'],
    ['journalist', 'The journalist agent', 'Clean the sound', 'It runs the video through Audo, a service that removes background noise so it sounds like a studio microphone.', 'Only the journalist agent uses the Audo account, which is Dinis\'s.', 'today'],
    ['journalist', 'The journalist agent', 'Write it down', 'It makes a written transcript, then checks names and quotes against the sound and the badge photo.', 'The transcript is notes until checked.', 'today'],
    ['journalist', 'The journalist agent', 'Prepare the video', 'It removes hidden details such as location from the file and makes a small version for the web.', 'The location in the file is deleted.', 'today'],
    ['journalist', 'The journalist agent', 'Write the article', 'The article opens with the company\'s scorecard and leads with what the company does with AI agents.', 'For a full interview, the person approves the draft first.', 'today'],
    ['journalist', 'The journalist agent', 'Publish', 'It puts the interview on PrompTugal.news. Before anything goes live, the site checks itself automatically, for example that every link works and no private details slipped in.', '', 'today'],
    ['agent', 'The map agent', 'Draw the map', 'It draws this whole journey for the article: who did each step and where each hand-over happened.', 'The person is shown as "the interviewee" unless they agreed to be named.', 'new'],
    ['person', 'Indi', 'Send the link', 'Indi sends the person their link and a thank-you. Agents only write drafts; a person sends.', '', 'today'],
]

function timeline() {
    return `<ol class="nw-steps">${STEPS.map(([r, who, t, what, priv, when], i) => {
        const prev = STEPS[i - 1], hand = prev && prev[0] !== r
        return `${hand ? `<li class="nw-hand" aria-label="Hand-over"><span>⬇ hands over from ${esc(ROLE[prev[0]].name.toLowerCase())} to ${esc(ROLE[r].name.toLowerCase())}</span></li>` : ''}<li class="nw-step" style="--f:${ROLE[r].fill};--e:${ROLE[r].edge}"><div class="nw-num">${i + 1}</div>${icon(r)}<div class="nw-txt"><p class="nw-who">${esc(who)}${when === 'new' ? ' <span class="nw-new">planned</span>' : ''}</p><h3>${esc(t)}</h3><p>${esc(what)}</p>${priv ? `<p class="nw-priv">🔒 ${esc(priv)}</p>` : ''}</div></li>`
    }).join('')}</ol>`
}

// the map sketch: one lane per role, one dot per step, an arrow for each step to the next, thicker at a hand-over
function mapSvg() {
    const lanes = Object.keys(ROLE), LH = 64, X0 = 190, DX = 62, W = X0 + STEPS.length * DX + 20, H = lanes.length * LH + 30
    const y = r => 30 + lanes.indexOf(r) * LH + LH / 2, x = i => X0 + i * DX
    const lane = (r, k) => `<rect x="0" y="${30 + k * LH}" width="${W}" height="${LH}" fill="${ROLE[r].fill}" opacity=".55"/><g transform="translate(8 ${30 + k * LH + 12})">${ICON[r](ROLE[r].edge)}</g><text x="54" y="${30 + k * LH + LH / 2 + 5}" class="nw-lab">${esc(ROLE[r].name.replace(/ \(an agent\)/, ''))}</text>`
    const arrows = STEPS.slice(1).map(([r], j) => { const p = STEPS[j][0], hand = p !== r
        return `<path d="M${x(j) + 10} ${y(p)} L${x(j + 1) - 12} ${y(r)}" stroke="${hand ? '#3b3a4a' : '#9a98ad'}" stroke-width="${hand ? 3 : 1.5}" ${hand ? '' : 'stroke-dasharray="4 4"'} marker-end="url(#nwah)" fill="none"/>` }).join('')
    const dots = STEPS.map(([r, , t], i) => `<g><circle cx="${x(i)}" cy="${y(r)}" r="11" fill="#fff" stroke="${ROLE[r].edge}" stroke-width="3"/><text x="${x(i)}" y="${y(r) + 4}" text-anchor="middle" class="nw-dn">${i + 1}</text><title>${i + 1}. ${esc(t)}</title></g>`).join('')
    return `<div class="nw-scroll"><svg class="nw-map" viewBox="0 0 ${W} ${H}" role="img" aria-label="The journey of one interview as a diagram: five lanes, one per role, and 14 steps from left to right. Thick arrows are hand-overs from one role to another."><defs><marker id="nwah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#3b3a4a"/></marker></defs>${lanes.map(lane).join('')}${STEPS.map((_, i) => `<text x="${x(i)}" y="20" text-anchor="middle" class="nw-dn">${i + 1}</text>`).join('')}${arrows}${dots}</svg></div>`
}

const CSS = `<style>
.nw{--ink:#2f2e3b;font-family:Lexend,system-ui,sans-serif;color:var(--ink);max-width:880px}
.nw .nw-lead{font-size:1.15rem;line-height:1.5}
.nw-key{display:flex;flex-wrap:wrap;gap:8px;padding:0;list-style:none}
.nw-key li{display:flex;align-items:center;gap:6px;background:var(--f);border:2px solid var(--e);border-radius:999px;padding:2px 12px 2px 4px}
.nw-steps{list-style:none;padding:0;margin:0}
.nw-step{display:grid;grid-template-columns:36px 44px 1fr;gap:10px;align-items:start;background:var(--f);border:2px solid var(--e);border-radius:16px;padding:12px 14px;margin:0}
.nw-num{font-weight:800;font-size:1.3rem;text-align:center;line-height:40px}
.nw-step h3{margin:0 0 4px;font-size:1.1rem}
.nw-step p{margin:0 0 4px;line-height:1.45}
.nw-who{font-size:.85rem;opacity:.8}
.nw-priv{font-size:.9rem;background:#ffffffaa;border-radius:8px;padding:2px 8px;display:inline-block}
.nw-new{background:#fff;border:1px dashed #8a87a0;border-radius:6px;padding:0 6px;font-size:.75rem}
.nw-step+.nw-step{margin-top:6px}
.nw-hand{text-align:center;margin:6px 0;font-weight:600;color:#3b3a4a}
.nw-hand span{display:inline-block;background:#fff;border:2px solid #3b3a4a;border-radius:999px;padding:3px 14px;font-size:.9rem}
.nw-scroll{overflow-x:auto;border:1px solid #ddd;border-radius:12px;background:#fff}
.nw-map{min-width:900px;width:100%;height:auto;display:block}
.nw-lab{font:600 13px Lexend,system-ui,sans-serif;fill:#2f2e3b}
.nw-dn{font:700 11px Lexend,system-ui,sans-serif;fill:#2f2e3b}
@media (max-width:520px){.nw-step{grid-template-columns:28px 1fr}.nw-step .nw-ico{display:none}}
</style>`

export function build() {
    const key = `<ul class="nw-key">${Object.keys(ROLE).map(r => `<li style="--f:${ROLE[r].fill};--e:${ROLE[r].edge}">${icon(r, 26)}${esc(ROLE[r].name)}</li>`).join('')}</ul>`
    const body = `<div class="nw">
<p class="nw-lead">This page shows how one interview gets from a first meeting at Web Summit (a large technology conference in Lisbon) to a published article on PrompTugal.news, our news site about AI agents. An AI agent is a computer program that does tasks on its own. Some steps are done by people and some by agents. Each colour below is one kind of worker.</p>
${key}
<h2 id="steps">The journey, step by step</h2>
<p>Read from top to bottom. A black label marks the moment work passes from one kind of worker to another. The lock shows what is kept private.</p>
${timeline()}
<h2 id="map">The same journey as a diagram</h2>
<p>We call this diagram the map. Each row is one kind of worker. Each dot is a step, numbered as above. Thick arrows are hand-overs. Every article will carry a map like this, so readers can see exactly who did what. The team uses the same map to see what is done and what is waiting.</p>
${mapSvg()}
<h2 id="rules">Three rules that never change</h2>
<ol><li>No interview is published without the person's filmed yes.</li><li>Names, photos and contact details stay private unless the person agrees.</li><li>Agents write drafts. People send messages and approve interviews.</li></ol>
<h2 id="more">More detail</h2>
<ul><li><a href="https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/indi/helpers/newsroom/workflow.md">The full workflow</a>: who does each step, what goes in and out, where it is kept.</li><li><a href="https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/indi/helpers/newsroom/map-spec.md">How the map is built</a>, for the team that builds it.</li><li><a href="../../../../lead-to-article/index.html">From a conversation to an article</a> and <a href="../../../../the-individual/index.html">from a badge photo to a team of agents</a>.</li></ul>
<p class="muted">Made by conductor-newsroom@web-summit.indi for Indi and Dinis, 10 November 2026. Planned steps are marked "planned"; every other step works today.</p>
</div>`
    const md = `# How an interview reaches PrompTugal.news\n\nThe journey of one interview, from meeting someone at Web Summit to a published article, step by step. Roles: a person, the researcher, the scorer, the journalist, another agent.\n\n${STEPS.map(([r, who, t, what, priv, when], i) => `${i + 1}. **${t}** (${who}${when === 'new' ? ', planned' : ''}). ${what}${priv ? ` Private: ${priv}` : ''}`).join('\n')}\n\nRules: no interview without the person's filmed yes; names, photos and contact details stay private unless they agree; agents draft, people send.\n\nThe full workflow: people/indi/helpers/newsroom/workflow.md. The map spec: people/indi/helpers/newsroom/map-spec.md.\n`
    return [{ rel: 'people/indi/helpers/newsroom/index.html', title: 'How an interview reaches PrompTugal.news', description: 'The newsroom workflow as an infographic: from a handshake at Web Summit to a published interview, who does each step, the hand-overs, and what stays private.', head: CSS, body, md }]
}
