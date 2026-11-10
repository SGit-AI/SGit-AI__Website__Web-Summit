# RiskMandate, shown on our own agents. A deck for Dinis's meeting with a cybersecurity investor, Tuesday 10 November 2026, about 15:30 UTC.
# Built by conductor@web-summit.dinis at Dinis's word (about 14:57 UTC). The investor is not named here (the comms protocol): their record is in the private CRM.
# Claims for RiskMandate stay within riskmandate.ai and this site.
S.clear()
S.append(('cover', '''<div class="cover"><p class="kick">RiskMandate · Web Summit Lisbon 2026</p><h1>Give agents access. Not free rein.</h1><p class="big">For security teams: know exactly what every agent can do, what it was allowed to do, and what really stops it. Shown on our own team of more than a hundred agents.</p><p class="cap">Every number and scenario here is on the public record (git, the sites, the ABP pages), 10 November 2026. Links on the last slide.</p></div>'''))
S.append(('The problem', '<h2>Agents now have reach. Who decided what they may do with it?</h2>' + items([
    '<b>Agents sit in Gmail, HR, payroll, the CRM and meeting apps,</b> with the same access their users have',
    '<b>Reach:</b> what an agent can actually do. <b>Mandate:</b> what the business authorised it to do. <b>The gap</b> between the two is the risk',
    '<b>Today the gap is invisible:</b> nobody can list each agent, its reach, its mandate and what really stops it',
    '<b>RiskMandate:</b> know their reach, define their mandate, control the gap (riskmandate.ai)'])))
S.append(('For the security team', '<h2>A security must-have, not a compliance nice-to-have</h2>' + items([
    '<b>Built for the security team,</b> the people who answer when an agent does something it should not',
    '<b>Their questions, answered per agent:</b> what can it reach? what was it allowed to do? what actually stops it? what did it try?',
    '<b>Evidence, not paperwork:</b> each barrier is labelled a rule, a review or a technical control, with the commit or log that shows it',
    '<b>Enforced where security already works:</b> the gateway, proxy or IAM they run, or SHarness on the machine the agent runs on',
    '<b>Compliance follows from it:</b> the same record answers the auditor and the insurer, as a by-product, not the product']) ))
S.append(('RiskMandate', f'<h2>An Agent Behaviour Policy for every agent, enforced by the controls you already run</h2><div class="two">{shot("riskmandate-controls.jpg", "riskmandate.ai: one ABP per agent; your gateway allows, redacts, holds or blocks")}<div>' + items([
    '<b>The ABP</b> records each agent\'s reach, mandate, gap and the barrier that really stops it',
    '<b>Enforced</b> by your gateway, proxy or IAM, or SHarness, the open-source secure harness',
    '<b>Never in the request path:</b> RiskMandate writes the rules; your controls apply them',
    '<b>One record</b> read by operations, leadership, security and the insurer'])+'</div></div>'))
S.append(('Our own team', f'<h2>We run it on ourselves: nine people, 119 agents that have run, 85 at work in 48 hours</h2>{shot("angelo-live.jpg", "The team, live: each dot is an agent, each line a message between agents and people")}'))
S.append(('An ABP per agent', f'<h2>Every one of our agents has a published behaviour policy</h2><div class="two">{shot("abp-index.jpg", "web-summit.sgit.ai/abp/: 93 pages, one per agent")}<div>' + items([
    '<b>Reach, Mandate, Gap, Barrier</b> for every agent, each barrier labelled a rule, a review or a technical control, with the evidence',
    '<b>Explorer phase first:</b> observe and recommend, lock down step by step, always with an escape valve for a person',
    '<b>Then strict:</b> deny by default, with hooks that block what the policy denies',
    '<b>Kept by an agent</b> (abp@), reviewed hourly; security agents review every commit for keys, contact details and private data'])+'</div></div>'))
S.append(('The circuit', f'<h2>Every agent, through its policy and its barriers, to what it can touch</h2>{shot("silvio-circuit.jpg", "Silvio\'s circuit, live: 109 agents, 94 with a written policy; each wired through its ABP and barriers to the resources it reaches")}'))
S.append(('What the policies caught', f'<h2>What the policies caught in the first five days</h2><div class="two">{shot("abp-in-action.jpg", "ABP in action: every scenario tied to its commit")}<div>' + items([
    '<b>7 caught by a review</b> before they went out: a token about to be published, a stale key entry, a vault key printed into a transcript, a read key about to reach a model provider',
    '<b>7 found by an ABP</b> and fixed by their owner',
    '<b>1 rule failed and became a technical barrier:</b> "never push to main" did not hold once; main is now protected',
    '<b>The lesson:</b> rules alone failed once; reviews caught seven; every technical barrier we have was added after an ABP or a review named the gap'])+'</div></div>'))
S.append(('Watch it', f'<h2>Policies you can watch</h2><div class="two">{shot("abp-player.jpg", "The ABP player: a policy in action, step by step")}<div>' + items([
    '<b>For the demo at the stand:</b> the same request with and without the policy, side by side',
    '<b>Try it in five minutes</b> on Claude or ChatGPT: paste one line that says the agent must not, and watch it refuse. That line is the first row of an ABP',
    '<b>Then the stronger barriers:</b> why a rule the agent keeps by choice is the weakest of the four'])+'</div></div>'))
S.append(('Measuring the market', f'<h2>GAMMA-Ray: how much an agent does on its own, and how well that is governed</h2><div class="two">{shot("gamma-spectrum.jpg", "Seven Spectrum cards published (beta)")}{shot("gamma-lens.jpg", "The lens: what is said about an agent, what its grant lets it do, and the delta")}</div>' + items([
    '<b>One short set of questions</b> over 8 public maturity instruments and 279 provisions',
    '<b>Every agent product at the summit</b> can be scanned from public evidence: Replit, Manus, and ten Portuguese companies in review',
    '<b>RiskMandate\'s lens:</b> the grant measures what permissions let an agent do; the delta is the gap'])))
S.append(('Trust in each fact', f'<h2>FACT-Ray: how far to trust each fact behind a score</h2><div class="two">{shot("fact-ray.jpg", "gamma-ray.sgit.ai/fact-ray/")}<div>' + items([
    '<b>Who says it, how firmly it is recorded, who stands behind it:</b> trust, not truth',
    '<b>Companies answer for themselves</b> with one file on their own domain',
    '<b>The same discipline</b> we apply to our own agents\' evidence'])+'</div></div>'))
S.append(('How we work', f'<h2>How the agentic team delivers: a voice brief in, a release out</h2><div class="two">{shot("pipeline.jpg", "From a voice brief to TestFlight in 1 h 40, traced across five repositories")}<div>' + items([
    '<b>Every agent has its own key;</b> every commit names its agent; every push is a version that passed a gate',
    '<b>Only the operator instructs;</b> agents draft, people send; humans can stop or restart any agent',
    '<b>Since 2 November:</b> two sites (4,716 and 3,070 commits), a new standard and its site, apps on TestFlight, interviews published from the summit floor',
    '<b>The big stop:</b> every team paused in minutes, realigned and restarted, a live test of control'])+'</div></div>'))
S.append(('Why it matters', '<h2>Why security teams need this now</h2>' + items([
    '<b>Every company is about to run teams of agents</b> with real reach. Security teams will be asked what each one can do, and today they cannot answer',
    '<b>We already run such a team,</b> at speed, and show where the risk sits and what controls it',
    '<b>Our own team is the case study:</b> the scenarios, the failures and the fixes are public, each with its commit',
    '<b>An open approach:</b> the ABP model and SHarness are public; enforcement uses the controls customers already have',
    '<b>Next:</b> design partnerships with security teams; from explorer to strict policies with hooks; GAMMA-Ray scans of the agent products they buy'])))
S.append(('Live links', '<h2>See it live</h2>' + items([
    '<b>RiskMandate:</b> riskmandate.ai (the film, the six examples, "try it in five minutes")',
    '<b>Our ABPs:</b> web-summit.sgit.ai/abp/ · ABP in action: web-summit.sgit.ai/abp/in-action/',
    '<b>The circuit:</b> web-summit.sgit.ai/people/silvio/app/ then Universe, Circuit',
    '<b>The team, live:</b> web-summit.sgit.ai/people/angelo/app/#live',
    '<b>GAMMA-Ray:</b> gamma-ray.sgit.ai/spectrum/ · the lens: gamma-ray.sgit.ai/lens/ · FACT-Ray: gamma-ray.sgit.ai/fact-ray/'])))
