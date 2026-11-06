// The PrompTugal.news design lab (design@web-summit.silvio, at Silvio's word, 6 November 2026): /people/silvio/lab/.
// The copy of the original lives in front.htm (served as is); the front-page mock options in mocks/ (a.htm to d.htm,
// made by mocks/make.py from the copy's real content, screenshots in mocks/shots/). This page is the lab's hub.
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const REFS = [
    ['The Guardian', 'One lead story that clearly dominates; sections as strong bands; a serif headline voice.'],
    ['BBC News', 'A big image lead with two or three stories beside it, then a tidy grid; LIVE labels in red.'],
    ['Semafor', 'A numbered "world at a glance" briefing beside the lead; cream paper, serif, calm. Closest to our look.'],
    ['El País and Politico Europe', 'Labelled columns (top stories, around Europe, latest) with timestamps: the reader sees the structure at once.'],
    ['Rest of World', 'A "latest stories" rail, bold kickers, art-led cards; a global tech lens, close to our mandate.'],
    ['The Verge and Wired', 'Personality: huge type, colour, the brand as a voice. Tech readers expect to be surprised.'],
    ['TechCrunch', 'A "top headlines" list beside the lead; a strong brand band; fast to scan.'],
    ['Stratechery', 'One voice, reading first, a weekly summary; proof that a simple column can feel premium.'],
    ['Observador (Portugal)', 'Em direto (live) labels and a dense Portuguese front page; what our local readers know.'],
]
const OURS = [
    'Everything has the same weight: about 20 stories in one list, the same size, with small infographic thumbnails.',
    'Two search boxes at the top, and the lead image is a dense infographic that reads as a chart, not a story.',
    'The agenda repeats "Registration: collect your lanyard" for every desk, which pushes real events down.',
    'About 6,800 px tall on a laptop and 12,000 px on a phone.',
    'The most interesting thing about us is hidden: we are an AI newsroom (agents write, editors check, everything signed), and the page says so only in the footer.',
]
const OPTIONS = [
    ['a', 'The Edition', 'A broadsheet front page with a strict hierarchy: one lead, two seconds, a numbered briefing, the AI radar and "Now and next" in the rails, then a grid. Learns from the Guardian, Semafor and El País.', 'Readers who want the serious newspaper: the safest step from today.'],
    ['b', 'Summit Live', 'Built for the four days in Lisbon, on a phone: a live desk bar with a running countdown, the days as tabs, a timeline of what is on, story cards, and a tab bar at the bottom. Learns from BBC Live, Observador and TechCrunch.', 'The people at the venue, 9 to 12 November.'],
    ['c', 'The Atlas', 'The mandate first: "The universe of AI in Portugal, mapped", a big prompt to ask the map, the counts and the AI radar, then the stories as a visual grid and our Reach, Mandate, Gap question. Learns from Rest of World and The Verge.', 'Making us look like no one else: an AI publication, not a newspaper with AI in it.'],
    ['d', 'The Brief', 'Reading first, one column, skimmable in two minutes: a morning intro, the big story with a 20-second version by our agents, "also today", the calendar and the daily newsletter. Learns from Axios, Stratechery and Semafor.', 'Busy readers, the newsletter, and outreach emails that link to the front page.'],
]
const AI = [
    ['A prompt, not a search box', '"&gt;_ Ask PrompTugal anything", with suggested questions under it. The name is about prompts, so the first thing a reader does is prompt.'],
    ['The AI radar', 'Which fields are busiest among the companies we follow (security 30, AI agents 22, developer tools 18...), as bars that link to the companies.'],
    ['Provenance as a feature', 'Each story carries "✦ agent-written · checked · signed". Others hide their AI; we show it, because every fact is sourced and signed.'],
    ['A live countdown', 'To Opening Night (Monday 9 November, 20:00 Lisbon), ticking in the page: the site feels alive.'],
]

export function lab() {
    const opt = ([k, name, what, best]) => `<article class="opt"><h3>Option ${k.toUpperCase()}: ${esc(name)}</h3>
<p><a href="mocks/${k}.htm"><img src="mocks/shots/${k}-desktop.jpg" alt="Option ${k.toUpperCase()}, ${esc(name)}, on a laptop" loading="lazy" width="800"></a></p>
<p>${esc(what)}</p><p><b>Best for:</b> ${esc(best)}</p>
<p><a href="mocks/${k}.htm"><b>Open option ${k.toUpperCase()}</b></a> · <a href="mocks/shots/${k}-phone.jpg">on a phone</a></p></article>`
    const body = `<style>.opt{border-top:2px solid currentColor;padding-top:8px;margin:24px 0}.opt img{max-width:100%;height:auto;border:1px solid #8884;border-radius:8px}</style>
<p><b>A lab, not the live site.</b> Silvio's design agent (design@web-summit.silvio) tries out new designs for the <a href="https://promptugal.news/">PrompTugal.news</a> front page here. The original is never changed from here. An option Silvio chooses goes to the newsroom's designer as a proposal.</p>
<h2 id="options">Four options for the front page</h2>
<p>All four use our real stories, agenda and company counts from 6 November, our brand (Newsreader, IBM Plex, the paper, ink, red and green) and dark mode. Links inside them go to the live site.</p>
${OPTIONS.map(opt).join('\n')}
<h2 id="ai">What makes them an AI newsroom</h2>
<p>All four options share these, because we are an AI and tech publication and the page should show it:</p>
<ul>${AI.map(([t, d]) => `<li><b>${t}.</b> ${d}</li>`).join('')}</ul>
<h2 id="ours">The original today</h2>
<p>Strong: every fact sourced, a real agenda, a clear brand, dark mode, Ask. Where it loses the reader:</p>
<ul>${OURS.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
<p><a href="front.htm">The lab copy of the original</a>, a snapshot from 6 November 2026, 18:30 UTC.</p>
<h2 id="refs">What the best news sites do</h2>
<p>Front pages read on 6 November 2026, on a laptop and a phone:</p>
<ul>${REFS.map(([n, d]) => `<li><b>${esc(n)}:</b> ${esc(d)}</li>`).join('')}</ul>
<p>The New York Times, the Financial Times, The Economist, Público, Axios, Sifted, Reuters, AP, The Atlantic, Quartz and The Information blocked our automated browser, and Le Monde showed only its cookie wall. Option D's "20-second version" draws on Axios's well-known "why it matters" format.</p>
<p>How the lab works: <a href="https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/people/silvio/lab">people/silvio/lab/</a> (README.md, mocks/make.py).</p>`
    const md = `A lab for the PrompTugal.news front page (https://promptugal.news/), kept by design@web-summit.silvio. The original is never changed from here.\n\n## Four options for the front page\n\n${OPTIONS.map(([k, n, w, b]) => `- **Option ${k.toUpperCase()}: ${n}** (mocks/${k}.htm). ${w} Best for: ${b}`).join('\n')}\n\n## What makes them an AI newsroom\n\n${AI.map(([t, d]) => `- **${t}.** ${d.replace(/&gt;/g, '>')}`).join('\n')}\n\n## The original today\n\n${OURS.map(x => `- ${x}`).join('\n')}\n\n## What the best news sites do\n\n${REFS.map(([n, d]) => `- **${n}:** ${d}`).join('\n')}\n`
    return { rel: 'people/silvio/lab/index.html', title: 'The PrompTugal.news design lab', description: 'Four front-page options for PrompTugal.news, drawn from the best news sites and made for an AI newsroom, beside a lab copy of the original.', body, md }
}
