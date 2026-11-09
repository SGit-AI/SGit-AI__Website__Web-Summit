# The 12:00 stand-up of Friday 6 November 2026: its narrative slides.
S.append(('Since the 18:00', f'<h2>Since yesterday\'s 18:00: who moved what</h2>{bars(since, "Commits on the team site since 18:00 yesterday, by person (their agents).")}' + items([
    '<b>PrompTugal.news</b>: the name, the brand v2.0, the domain <b>promptugal.news live</b>; its own repository and organisation; <b>381 commits</b> by its agents overnight, 15 articles',
    '<b>The team CRM</b>: public and private vaults; crm agents for Dinis and Angelo; the Brazilian delegation mapped; <b>the email twin</b> live (Angelo\'s crm agent)',
    '<b>Vicky\'s desks</b>: four journalist desks and a reviewer; storylines S1 to S21 drafted and reviewed; the agenda live on PrompTugal',
    '<b>Every agent has its own inbox lane</b>; the two teams\' conductors linked by sealed lanes',
    '<b>An ABP agent</b> for all of Dinis\'s agents: strict, hourly, hooks that survive compaction'])))
S.append(('PrompTugal.news', f'<h2>PrompTugal.news: the Web Summit Lisbon 2026 edition</h2><div class="two">{shot("pt-front.jpg", "promptugal.news: the front page")}{shot("pt-events.jpg", "Events: the official programme and the side events")}</div>' + items([
    '<b>Mandate</b>: map the universe of AI in Portugal; technology and AI in context, from Portugal for Europe',
    '<b>Its own team</b>: 16 agents and 9 workers, hourly runs, passes with budgets, a security review first and last',
    '<b>Outreach from today</b>: as PrompTugal\'s editors, each email leading with the company\'s page'])))
S.append(('Companies and the newsroom', f'<h2>Companies, and the newsroom behind it</h2><div class="two">{shot("pt-companies.jpg", "The companies, sourced")}{shot("pt-newsroom.jpg", "The newsroom: runs, agents, observability")}</div>'))
# added by team-collaboration@web-summit.angelo at Angelo's ask (6 November, 11:30): the whole team as one map (WS-97)
S.append(('The whole team as one map', '<h2>The whole team as one map: who writes to whom</h2><div class="two" style="grid-template-columns:1.15fr 1fr"><figure class="shot"><img src="../../../assets/shows/2026-11-06-1200/team-map.jpg" alt="The team\'s people and agents, and who writes to whom" loading="lazy" style="object-fit:contain;background:#141413"><figcaption>Each arc is a commit\'s For: line, last 7 days. people/angelo/tools/team-map.mjs</figcaption></figure><ul style="font-size:.95em"><li><b>6 people, 79 agents</b> active in 7 days (68 RiskMandate squares, 11 Promptugal diamonds), <b>2,119</b> messages</li><li>Everything runs through Dinis: his conductor is written to most (326); the five strongest pairs all include him</li><li>Few links across: Angelo–Vicky 49 is the best without Dinis; Jose–Vicky 2, Indi–Jose 3</li><li>Dark: Nimay\'s, Daniela\'s and Sarah\'s agents have not committed; Dinis–Nimay, one message in a week</li></ul></div><p class="cap">Added at Angelo\'s ask by team-collaboration@web-summit.angelo (WS-97). Inactive agents and people left out.</p>'))
S.append(('To decide now', '<h2>To decide at this stand-up</h2><ol class="decide">' + ''.join(f'<li>{x}</li>' for x in [
    '<b>Silvio on PrompTugal</b>: push access, and his own agents (<i>role</i>.PrompTugal.silvio)',
    '<b>Outreach as PrompTugal</b>: the email addresses on promptugal.news, and the first emails sent today',
    '<b>Stand-up notes</b>: Meet transcripts to the record (WS-98), or one line per decision',
    '<b>Access tokens</b>: one per agent, starting with the crm and inbox agents',
    '<b>Personal cards and the garments</b>: still open from Thursday']) + '</ol>'))
S.append(('Follow-ups', '<h2>Follow-ups, each with an owner</h2>' + items([
    '<b>Silvio</b>: the outreach drafts as PrompTugal reviewed; the garments\' collection on Monday',
    '<b>Vicky, Indi</b>: the stories through review to PrompTugal; the editors\' cards',
    '<b>Jose</b>: the channels for PrompTugal (WS-175)',
    '<b>Angelo</b>: the email twin with the first real threads (WS-173, WS-176)',
    '<b>Dinis\'s conductor</b>: record this stand-up; the 18:00 deck'])))
