# PrompTugal.news: the agentic team. A deck for Dinis's meeting, Tuesday 10 November 2026, about 15:15 UTC (investors and partners).
# Built by conductor@web-summit.dinis at Dinis's word (about 14:35 UTC): the best of Angelo's and Silvio's live views, focused on pt.news.
S.clear()
S.append(('cover', '''<div class="cover"><p class="kick">PrompTugal.news · Web Summit Lisbon 2026</p><h1>A newsroom of agents, about agents</h1><p class="big">How our agentic team works, what it has delivered in nine days, and where it goes next.</p><p class="cap">Every number here comes from the public record (git, the sites' releases, the live maps) on 10 November 2026. The views shown are live: the links are on the last slide.</p></div>'''))
S.append(('What pt.news is', f'<h2>pt.news: the place to learn about agents</h2><div class="two">{shot("pt-front.jpg", "promptugal.news, live")}<div>' + items([
    '<b>If you want to learn about agents,</b> be informed about agents, or know what everyone is saying about agents: this is the site',
    '<b>Interviews</b> about what companies do <i>with agents</i>: what their agents do, for whom, with what reach and controls',
    '<b>The summit, now:</b> what is happening at Web Summit, filtered to agents',
    '<b>Scores:</b> every company we cover gets a GAMMA-Ray card, from public evidence',
    '<b>Made by agents, shown openly:</b> each piece shows the workflow that made it'])+'</div></div>'))
S.append(('The team, live', f'<h2>The team, live: every dot is an agent, every line a message</h2>{shot("angelo-live.jpg", "Angelo\'s live map: six people, their agents, the messages flowing between them, read from the record")}'))
S.append(('Deliverables', f'<h2>What the agents deliver, as it happens</h2><div class="two">{shot("angelo-deliverables.jpg", "Deliverables: the work flowing out to the CRM, keys, the sites, drafts, infrastructure, the apps, pt.news, research")}<div>' + items([
    '<b>A slider replays</b> every exchange since 5 November: watch the team grow',
    '<b>2D and 3D,</b> pop-out and display mode for the stand',
    '<b>Nothing is drawn by hand:</b> it reads the commits, the agents\' names and the releases'])+'</div></div>'))
S.append(('The people and the machine', f'<h2>Nine people, 119 agents that have run, 85 at work in the last 48 hours</h2>{shot("angelo-collab.jpg", "Team and the machine: each person, their agents, what they picked, when each runs next")}'))
S.append(('The Universe', f'<h2>Silvio\'s Universe: the whole summit and our agents in one live map</h2><div class="two">{shot("silvio-cinema.jpg", "1,014 points, 1,662 links, read live: Web Summit\'s companies, speakers and sessions joined to our agents and their policies")}<div>' + items([
    '<b>Live:</b> it reads its sources each time it opens: the team, every agent\'s behaviour policy, each agent\'s latest commit, the Web Summit CRM',
    '<b>Circuit view:</b> each agent on a bus, through its policy, barriers, gate and owner, to the resources it may touch',
    '<b>A second brain:</b> capture anything at the stand, Claude files and links it, ask it questions'])+'</div></div>'))
S.append(('GAMMA-Ray', f'<h2>GAMMA-Ray: how much an agent does on its own, and how well that is governed</h2><div class="two">{shot("gamma-spectrum.jpg", "GAMMA-Ray Spectrum: seven cards published (beta)")}{shot("gamma-graph.jpg", "Every card is a graph, down to the sentence on a public page")}</div>' + items([
    '<b>One short list of questions</b> over 8 public instruments and 279 provisions (Salesforce, Microsoft, SEI and others)',
    '<b>Four dimensions:</b> Autonomy, Reach, Control, Openness; Replit Agent A4 · R2 · C2 · O2, Manus A3 · R2 · C1 · O2',
    '<b>A pipeline of agents</b> scans, reviews and approves; ten Portuguese companies are in review now'])))
S.append(('FACT-Ray', f'<h2>FACT-Ray: how far to trust each fact</h2><div class="two">{shot("fact-ray.jpg", "gamma-ray.sgit.ai/fact-ray/")}<div>' + items([
    '<b>Trust, not truth:</b> who says it, how firmly it is recorded, who stands behind it',
    '<b>Every fact is scored,</b> for example π Moderate · S1·R5·A1: read by an agent, captured and hashed, checked by two agents, no human yet',
    '<b>Companies answer for themselves</b> with one file on their own domain (/.well-known/fact-ray.json)'])+'</div></div>'))
S.append(('Interviews', f'<h2>From a noisy recording at the stand to a published interview</h2><div class="two">{shot("pt-interviews.jpg", "The interview pipeline, public at /newsroom/interviews/")}<div>' + items([
    '<b>Two interviews live,</b> recorded on the floor, transcribed, drafted, approved by the interviewee, signed',
    '<b>The person steps in</b> where it matters: the conversation, the yes, the approval',
    '<b>Agents do the rest:</b> transcript, draft, facts checked at source, the page, the signature'])+'</div></div>'))
S.append(('How we work', f'<h2>How we work: a voice brief in, a release out</h2><div class="two">{shot("pipeline.jpg", "From a voice brief to TestFlight in 1 h 40, traced across five repositories")}<div>' + items([
    '<b>A voice brief</b> becomes a brief, then commits by named agents, then a release, then a review',
    '<b>Every push is a version,</b> every page has a gate; every article is signed; every agent has its own key',
    '<b>Conductors</b> route the work; one main conductor, focused ones per team; the humans can stop or restart any of them',
    '<b>Only the operator instructs;</b> agents draft, people send'])+'</div></div>'))
S.append(('Governed agents', f'<h2>RiskMandate governs our own agents</h2><div class="two">{shot("abp-player.jpg", "Agent Behaviour Policies you can watch")}<div>' + items([
    '<b>Each agent has a policy:</b> its reach, its mandate and the gap between them',
    '<b>Deny by default,</b> reviewed hourly; security agents review every commit for keys, contact details and private data',
    '<b>We are our own case study:</b> what we do to our agents is what RiskMandate offers'])+'</div></div>'))
S.append(('Nine days', '<h2>What we have executed since 2 November</h2>' + items([
    '<b>Two sites, released on every push:</b> the team site (4,716 commits, 1,786 releases) and pt.news (3,070 commits and 979 releases since 5 November; 1,484 pages)',
    '<b>GAMMA-Ray and FACT-Ray:</b> a standard, a site, a scan pipeline and seven published cards, built in a day and a half',
    '<b>Apps:</b> the Team app and the news app on TestFlight (the venue map in Team 0.4.76), the news app on the web, Android with an on-device model',
    '<b>Interviews</b> from the floor to the page; a newsroom of desks, a checker, a reviewer, beat correspondents',
    '<b>The big stop and the restart:</b> every team paused in minutes, realigned, restarted on one theme',
    '<b>The live views:</b> Angelo\'s map, Silvio\'s Universe, the command centres for every person']) ))
S.append(('Next', '<h2>Next: from the big picture to the detail</h2>' + items([
    '<b>"Each dot is an agent: what is it for?"</b> Small, medium and large examples, from a photo, a video or a voice memo to a live page, a deck or a repository, documented as they happen by a reporter and a journalist agent',
    '<b>The visual newsroom:</b> every piece on pt.news shows its workflow: where the human, the researcher, the journalist and the agents came in',
    '<b>The individual:</b> a photo of someone we meet starts research, a unit of agents and a card on our board',
    '<b>The redesign:</b> pt.news led by the interviews, the summit now and the scores'])))
S.append(('Live links', '<h2>See it live</h2>' + items([
    '<b>Angelo\'s live map:</b> web-summit.sgit.ai/people/angelo/app/#live (Messages, Workstreams, Deliverables; 3D; Full screen)',
    '<b>Silvio\'s Universe:</b> web-summit.sgit.ai/people/silvio/app/ then Universe (Play demo, Cinema, Circuit)',
    '<b>pt.news:</b> promptugal.news · the interviews: promptugal.news/newsroom/interviews/',
    '<b>GAMMA-Ray:</b> gamma-ray.sgit.ai/spectrum/ · FACT-Ray: gamma-ray.sgit.ai/fact-ray/',
    '<b>How we work:</b> web-summit.sgit.ai/pipeline/ · the ABPs: web-summit.sgit.ai/people/angelo/proposals/abp-live/player.htm'])))
