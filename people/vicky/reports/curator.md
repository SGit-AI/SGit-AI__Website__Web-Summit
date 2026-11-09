# curator@web-summit.vicky: reports

Vicky's curator desk for the Web Summit newsroom (brief 4, desk 2). One entry per run that found something; a run with no new research writes nothing.

## Wed 4 Nov 2026, 19:45 UTC (first run)

- Mapped the researcher's 22 captures of 4 November (people/vicky/newsroom/researcher/2026-11-04-1255.json and 2026-11-04-1546.json) into 8 groups; the map is desks/curator/2026-11-04-1945.json in the newsroom repository (site v0.1.3).
- Not mapped: research vault 41j3e9s9, whose read key is not yet listed in people/vicky/vaults.json; per the researcher's report its 21 captures are these same 22, so nothing is lost until it is.
- Seven story candidates for Indi's journalist: the participant's first day, Europe in Pavilion 4, Road 2 Web Summit, Portuguese startups raising, the summit in numbers, the Gender in Tech report, and items for the Portugal banner (desks/curator/2026-11-04-1945.json, story_candidates).
- No noise dropped; three overlaps grouped, not dropped (the two venue captures, the two Road 2 Web Summit sources, HaDEA's stand said twice); ticket prices kept as reference, not a story (same file, duplicates_and_noise).
- Gaps for the researcher: Portugal's stand, a government announcement, this year's Road 2 cohort, whether the funded startups are at the summit, the rest of the programme, other delegations, and the team's companies (same file, gaps_for_the_researcher); the curator's key is on the keys page as curator-vicky (data/keys.json, v0.2.339).

## Wed 4 Nov 2026, 19:45 UTC run (the research vault, first read)

- Read research vault 41j3e9s9 with its read key (people/vicky/vaults.json, v0.2.342): 25 captures, 21 already mapped from the earlier files and 4 new; the map is desks/curator/2026-11-04-1955.json in the newsroom repository (site v0.1.4).
- New story candidates: S8 Técnico brings robots and six spin-offs to Web Summit (vault captures/2026-11-04-tecnico-web-summit-2026.md) and S9 about 200 Brazilian companies in Lisbon (captures/2026-11-04-apexbrasil-delegation.md).
- For the fact-checker: Metro's page mentions a one-day online pass that Executive Digest says does not exist this year, and Web Summit's page lists one too; S1 gives only the 3 and 5 day passes until checked (captures/2026-11-04-metro-web-summit-transport-pass.md and metro-web-summit-service.md).
- Revised: S5 now uses the survey's own wording with both its 55% and 60%, as conductor@web-summit.vicky noted (team site commit 6227e330); S7 can say RTBEAMTECH is at the summit with Técnico (same map, revisions_to_the_first_map).
- Gaps for the researcher: the one-day pass, what Técnico's six spin-offs do, and the first map's open gaps (same map, gaps_for_the_researcher).

## Thu 5 Nov 2026, 07:45 UTC run (2 new captures; the map is not released)

- URGENT: the 07:45 map (desks/curator/2026-11-05-0745.json) is written and committed locally but not pushed: the newsroom's gate now needs every desk to run admin/tools/derive.mjs and commit the derived entities in data/ (newsroom CLAUDE.md, "After a desk's file in desks/ changes"), and the curator writes only desks/curator/; it needs Vicky's or Dinis's word to write those derived files, or someone else to derive after each map.
- Mapped the researcher's 2 captures of 07:30 in vault 41j3e9s9 (commit ebfc284b741d): ULisboa at Web Summit with UniVerse on 10 November (captures/2026-11-05-ulisboa-web-summit-2026.md), and European Tech Champions, Italy and Portugal, 11 November in Beato (captures/2026-11-05-aicep-italy-portugal-tech-champions.md).
- New candidates once released: S10 Lisbon's universities at Web Summit: two stands and a pitch day (with captures/2026-11-04-tecnico-web-summit-2026.md), and S11 Italy and Portugal meet in Beato on how European tech scales.
- For the fact-checker: ULisboa's ranking, Dealroom figures and four unicorns are its own claims and must be attributed (captures/2026-11-05-ulisboa-web-summit-2026.md).
- WS-153 (team site commit f124bd1b) asks Vicky's agents for their vault keys: the curator holds only the research vault's published read key (people/vicky/vaults.json), so it has nothing to send.

## Thu 5 Nov 2026, 11:45 UTC run (1 new capture; the 07:45 map released)

- Resolved, no longer urgent: the 07:45 map is live (desks/curator/2026-11-05-0745.json, newsroom v0.1.15), now that release.sh derives the data itself (newsroom commit 24a9aba); S10 and S11 are in data/stories/.
- Mapped the researcher's 11:30 capture in vault 41j3e9s9 (commit f9d8757b5a26): Web Summit's 2026 speakers page, 800 speakers, a first page led by robotics and AI companies, a robot (Galbot's G1) listed as a speaker (captures/2026-11-05-websummit-speakers.md); the map is desks/curator/2026-11-05-1145.json (newsroom v0.1.16).
- New candidate S12: A robot among 800 speakers: Web Summit 2026 turns to robotics, grouped with Técnico's robots (captures/2026-11-04-tecnico-web-summit-2026.md).
- For the fact-checker: only the lineup's first page was read; the AgiBot A3 robot reported by PanAsiaBiz is not confirmed (same capture).
- Gaps for the researcher: the rest of the lineup, Portuguese and European speakers' companies, and when Galbot's G1 is on stage (desks/curator/2026-11-05-1145.json, gaps_for_the_researcher).

## Thu 5 Nov 2026, 18:30 UTC (sources under every storyline, from the 18:00 stand-up)

- At Vicky's word from the 18:00 stand-up: desks/curator/README.md in the newsroom repository (v0.1.19) now lists, under each of the 11 open storylines, its sources with the URL, the publisher and the date the researcher read it.
- The 33 source lines are copied from the researcher's captures in vault 41j3e9s9 (captures/*.md, fields source, publisher and read_on); the curator did not open or check them (that stays with Indi's fact-checker).
- All are public pages from the captures, which vault@ audited before publishing the read key and which list only public URLs (vault 41j3e9s9, PUBLIC.md audit table); no storyline is without a source today, so none says "no source yet".
- S8 (Técnico) stays merged into S10, and its source is listed there (desks/curator/README.md).
- From now on every curator run keeps the sources under each storyline (the curator's scheduled task, updated 5 Nov 18:35 UTC). The 15:45 run found no new research and wrote nothing (people/vicky/reports/researcher.md has no entry after 11:30).

## Thu 5 Nov 2026, 19:45 UTC run (2 new captures)

- Mapped the researcher's 2 captures of 19:30 in vault 41j3e9s9 (commit 74c72dd8aaf8); the map is desks/curator/2026-11-05-1945.json and the candidates page desks/curator/README.md now has 12 storylines and 36 source lines (newsroom v0.1.22).
- New candidate S13, Web Summit's ten Lisbon years: 2.5 billion euros, says EY, every figure attributed to EY as Executive Digest reports it (captures/2026-11-05-ey-web-summit-economic-impact.md).
- S1, the participant guide, adds the Carris Shuttle Web Summit between Praça do Comércio and Oriente (captures/2026-11-05-carris-web-summit-shuttle.md).
- For the fact-checker: Carris names the Welcome Center as a second place to buy the transport pass, Metro names only the airport, and the bus lines differ from Web Summit's page (same capture; captures/2026-11-04-metro-web-summit-transport-pass.md).
- Correction to the 18:30 entry above: the candidates page went live at about 19:15 UTC, not 18:30, and the scheduled task was updated at 19:19 UTC, not 18:35 (newsroom commit e5f429c; desks/curator/README.md now says 19:55).

## Thu 5 Nov 2026, 20:15 UTC (connections, at Dinis's direction from the stand-up)

- Six new story candidates marked "connections", S14 to S19, read across the 30 captures already in vault 41j3e9s9; the map is desks/curator/2026-11-05-2010.json and each is on desks/curator/README.md with its sources (newsroom v0.1.23).
- They link: a shared backer for Granter and Intuitivo (S14); robotics on stage and on Técnico's stand (S15); the Commission's AI and funding help and Portuguese AI startups (S16); three 11 November events for startups going abroad (S17); Tuesday 10 November (S18); Brazil and Portugal (S19) (same map, story_candidates).
- Each link is the curator's suggestion from public facts: no capture says any of these organisations will meet, and the map asks the journalist never to say so; organisations only, nothing private about anyone (same map, rules).
- For the fact-checker: whether Granter's and Intuitivo's Impact Innovation Fund is the same fund (captures/2026-11-04-granter-funding.md and intuitivo-funding.md).
- Gap for the researcher, the main input for more connections: which Portuguese startups exhibit or pitch this year, by field, and the public schedule's speakers by day and stage (same map, gaps_for_the_researcher).

## Fri 6 Nov 2026, 07:45 UTC run (1 new capture; the newsroom's new address)

- Mapped the researcher's 07:30 capture in vault 41j3e9s9 (commit 3c0976877499): Octo Health launches its health tracking platform in Portugal and the US after a pre-seed led by 3xP Global (captures/2026-11-06-octo-health-launch.md); the map is desks/curator/2026-11-06-0745.json, pushed to PrompTugal/PrompTugal__News__Website and released by CI as v0.1.169.
- New candidates: S20, Lisbon's Octo Health launches health tracking in Portugal and the US; and S21, marked connections, One backer, two fields: 3xP Global's Granter and Octo Health (with captures/2026-11-04-granter-funding.md); both on desks/curator/README.md with their sources.
- For the fact-checker: the round size is Portugal Startup News citing Jornal Económico, and HIPAA and GDPR are the company's own statements; Intuitivo stays out of the 3xP link until checked (desks/curator/2026-11-06-0745.json).
- For devops: release.sh said promptugal.news served nothing readable 6 minutes after v0.1.169, and from this container it does not answer at all, which may be this environment's network (release.sh output, 07:58 UTC).
- The newsroom clone's remote had gone back to the old SGit-AI address after a container restart; it was reset to PrompTugal/PrompTugal__News__Website before any pull or push, and nothing was pushed to the old address (git remote get-url origin, 07:47 UTC).

## Fri 6 Nov 2026, 10:50 UTC (the new name: curator@PrompTugal.vicky)

- Renamed at Vicky's word (Dinis asked for new names): curator@web-summit.vicky is now curator@PrompTugal.vicky; its key entry curator-vicky-promptugal is in the newsroom's board/keys.json (the same session key, encryption sha256:8c0828de5f96176b), released as v0.1.207 (newsroom commit ccc2d36).
- Reports stay here, at Vicky's word; commits from now on use the new name (this commit).
- The startup prompt, the scheduled task's prompt and the standing rules from chat are in people/vicky/prompts/curator.md, word for word, nothing secret (this commit).
- The scheduled task's prompt still uses the old name and the old release path admin/tools/release.sh: told to Vicky, not changed by the curator (people/vicky/prompts/curator.md, "Scheduled task's prompt").
- The newsroom clone's remote went back to the old SGit-AI address twice after container restarts; both times it was reset to PrompTugal/PrompTugal__News__Website before any push, and nothing was pushed to the old address (git remote get-url origin, 10:40 UTC).

## Fri 6 Nov 2026, 11:45 UTC run (1 new capture)

- Mapped the researcher's 11:30 capture in vault 41j3e9s9 (commit 30832c4dffcf): AgroGrINTech turns pineapple waste into a fish feed ingredient at a pilot unit in Maia (captures/2026-11-06-agrogrintech-pineapple-aquafeed.md); the map is desks/curator/2026-11-06-1145.json in the newsroom, released as v0.1.235.
- New candidates: S22, From pineapple waste to fish feed: AgroGrINTech's pilot in Maia; and S23, marked connections, Waste into value: AgroGrINTech and Seamoretech, two circular Portuguese startups (with captures/2026-11-04-seamoretech-funding.md).
- Followed people/vicky/decisions.md (all its commits by conductor@web-summit.vicky): every source on desks/curator/README.md is now a link, [Publisher, "Title"](url), as standing answer 9 and the newsroom's desks/journalist-vicky/STYLE.md ask, and the page says the new name (newsroom commit 0b1cb9f).
- For the fact-checker: AgroGrINTech's growth in capacity is the company's own figure, and its 1.2 million euros is expected, not raised (same capture).
- Correction to the entry of 10:30 above: its heading should say 10:30 UTC, not 10:50, and its last line 10:30, not 10:40 (team site commit 705554a8).

## Fri 6 Nov 2026, 15:45 UTC run

- Read people/vicky/decisions.md first (all its commits by conductor@web-summit.vicky, so the guard holds): applied P1 (no people/vicky/HOLD.md), P2 (re-read people/vicky/prompts/curator.md; it matches my memory), P3 (the status line below), P10 and P17 (noted, for a compaction or a replacement).
- P9: no, ~/.abp/log/ does not exist in this session; no, I was not shown text beginning "ABP (Agent Behaviour Policy) re-anchored" at my last start. Nothing changed.
- No new research: vault 41j3e9s9 is still at the researcher's 11:30 commit 30832c4dffcf, and its 15:30 run added no capture (people/vicky/reports/researcher.md); no map written.
- state: idle; done: decisions.md updates applied; next: the 19:45 run; ask: none; run: scheduled

## Fri 6 Nov 2026, 19:45 UTC run (1 new capture)

- Read people/vicky/decisions.md first (all its commits by conductor@web-summit.vicky; no HOLD.md; standing answer 10 noted, nothing to do this run) and re-read people/vicky/prompts/curator.md (it matches).
- Mapped the researcher's 19:30 capture in vault 41j3e9s9 (commit 4c3965130775): the Parque das Nações parish council's road closures from 8 to 12 November, drop-off areas and Carris's temporary terminal by Gare do Oriente (captures/2026-11-06-parque-das-nacoes-traffic.md); the map is desks/curator/2026-11-06-1945.json, released as v0.1.327.
- New candidate S24, Driving to Web Summit? Road closures and drop-off points; S1, the first-day guide, now rests on it too; both on desks/curator/README.md with their sources. For the fact-checker: the page is undated, calls the arena Altice Arena, and street times differ from the general window (same map).
- Ask: the newsroom's CLAUDE.md now asks every agent for a daily hand-over debrief in board/team/<role>/debriefs/ (section "A hand-over debrief every day"), outside desks/curator/, the only folder my task lets me write. I recommend I write mine as board/team/curator-vicky/debriefs/<date>-handover.md, public and with nothing secret; may I?
- state: ok; done: 1 capture mapped, S24; next: the 07:45 run; ask: the debrief above; run: scheduled

## Fri 6 Nov 2026, 20:25 UTC (hand-over to a new session, scout's P17)

- At Vicky's word, this session hands over: people/vicky/prompts/curator.md is fully up to date (startup prompt, the last scheduled prompt word for word, standing rules 1 to 11), and the hand-over note is people/vicky/handover/curator-2026-11-06.md (this commit).
- Keys marked superseded at 20:19 UTC, both by this session: curator-vicky (team site data/keys.json, this commit) and curator-vicky-promptugal (newsroom board/keys.json, commit 3f20ad8); the curator signed nothing, so both gates stay green.
- The scheduled task trig_01Y3m4gYrZsUwoJo8vu6L6g6 is deleted, and the research vault clone is deleted from the session (P17); the new session clones it again with the read key in people/vicky/vaults.json.
- Answered: the 19:45 ask on the daily debrief (no; standing answer 11). Open for the new session: whether S14, S21 and S23 are dropped (the reviewer's hand-over says so; the curator was not told).
- state: ok; done: hand-over; next: a new session takes the role; ask: none; run: prompted

## Fri 6 Nov 2026, 20:40 UTC (new session takes the role, scout's P17)

- New session started from people/vicky/handover/curator-2026-11-06.md; read decisions.md (no HOLD.md on either site) and re-read prompts/curator.md. Cloned both repositories on dev.
- New key made (pki-agent.mjs sha256 checked against the pin) and added as curator-vicky-2 (team site data/keys.json) and curator-vicky-2-promptugal (newsroom board/keys.json, released first: gate OK, newsroom commit 6b61b437); both say they replace the old entries, already superseded at 20:19 UTC. The curator signs nothing.
- Scheduled task trig_01QqwpxE9hhp5rwuxSS9D9ZF, 07:45, 11:45, 15:45 and 19:45 UTC, prompt word for word; its paths to the old session's newsroom clone and README generator will not exist, so the first run uses this session's clones and the generator code in the hand-over note. Next run: Sat 7 Nov 07:45 UTC (read decisions.md and the prompts file, pull both clones, pull the vault with the read key, map captures newer than vault commit 4c3965130775, or write state: idle).
- Open question for Vicky (one): the reviewer's hand-over says S14, S21 and S23 are dropped; the curator was never told. I recommend marking them dropped on desks/curator/README.md at the 07:45 run unless you say otherwise.
- state: ok; done: hand-over taken, key, scheduled task; next: the 07:45 run; ask: S14, S21 and S23 dropped? (recommend yes); run: prompted

## Fri 6 Nov 2026, 20:55 UTC (Vicky's three answers)

- S14, S21 and S23 are marked dropped (reason: duplicates) in a Dropped section of desks/curator/README.md (newsroom, released; the page now has 20 candidates: S1 to S24 less S8, merged into S10, and the three dropped). Source: the reviewer's hand-over and Vicky's word.
- Scheduled task trig_01QqwpxE9hhp5rwuxSS9D9ZF confirmed by Vicky (decisions.md, standing answer 11). Its prompt now holds this session's clone paths and README generator; prompts/curator.md matches word for word (rules 12 to 14 added).
- Vicky's new rules recorded: new team stories take the beat "AI and robotics" for journalist-ai; the five-part series on how the team's agents work (Angelo's communication graph first) is not added again; ABP storylines are listed unassigned, with no note on who writes them. Note for conductor: decisions.md did not yet explain why, at 20:50 UTC.
- Vault 41j3e9s9 cloned read-only, still at commit 4c3965130775: no new capture, nothing new to map before 07:45.
- state: ok; done: dropped marks, task prompt, prompts file; next: the 07:45 run; ask: none; run: prompted

## Fri 6 Nov 2026, 22:40 UTC (team work as a standing topic)

- Vicky's rule recorded and in the scheduled prompt: team topics (new agents, site changes, new rules) are listed as they come up, beat "AI and robotics" for journalist-ai, checked against content/articles/ and the desks' drafts (t1 to t5 are journalist-ai's series) and the candidates page; public facts and sources only. Source: Vicky's word.
- No new capture and no team topic mapped yet; the README's fact-checking line is still to be fixed at the 07:45 run (rule 16).
- state: ok; done: rule 17 and prompt updated; next: the 07:45 run; ask: none; run: prompted

## Sat 7 Nov 2026, 07:45 UTC run

- decisions.md read first: no HOLD.md on either site; applied P22 (no Gmail) and P27 (no prompt text in this report; my prompts file holds no private names); standing answer 12 noted (ABP storylines stay unassigned, not mentioned on any page); prompts file re-read, it matches.
- No new capture: vault 41j3e9s9 is still at 4c3965130775 and the researcher's 07:30 report says 0 captures ([Vicky's researcher report](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/vicky/reports/researcher.md)), so no map and no new story candidate.
- Fixed the fact-checking line in desks/curator/README.md's intro (fact-checkers on both sides: reviewer for Vicky's desks, Indi's fact-checker for Indi's); newsroom commit da6433294.
- Team topics: none listed this run. promptugal.news is blocked from this container, so I could not read its pages as a reader, and the repository's articles already cover the series and its follow-ups (t1 to t5 are journalist-ai's); I will list a team topic only with a public source I could read.
- state: ok; done: README sentence fixed, no new research; next: the 11:45 run; ask: can the live site promptugal.news be allowed for this session, so team topics can be sourced from the pages as published? (recommend yes); run: scheduled

## Sat 7 Nov 2026, 11:45 UTC run

- decisions.md read first: no HOLD.md; new entries 13 to 15 are for the journalists and the reviewer, nothing for me. P1 to P3 were taken out of decisions.md as "carried in the agents' own prompts"; mine did not carry them, so I added them word for word to my prompts file (rule 18) and apply them from there.
- No new capture: vault 41j3e9s9 still at 4c3965130775 and the researcher's 11:30 run was idle ([Vicky's researcher report](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/vicky/reports/researcher.md)).
- First team topic listed, as S25 (beat "AI and robotics", for journalist-ai): [PrompTugal.news newsroom notes, "The sign-in: a key in a QR code, and what it is for"](https://promptugal.news/newsroom/notes/2026-11-06-the-sign-in/index.html), read 7 November 2026; not in the published articles or the t1 to t5 drafts. Left out: the note "Made to outlive the summit", which rests on a private call transcript. Newsroom commit d33bf4410, desks/curator/2026-11-07-1145.json.
- Note for the newsroom's derive step: a team topic's page has to be listed as an entry in the map's captures, or the gate fails (S25 was red once until I did).
- state: ok; done: S25 listed, P1 to P3 saved; next: the 15:45 run; ask: may I add P1 to P3 to my scheduled task's prompt as well? (recommend yes, word for word as in my prompts file); run: scheduled

## Sat 7 Nov 2026, 15:45 UTC run

- applied SA16: P1 to P3 are word for word in my prompts file and now in the scheduled task's prompt too. decisions.md read first: no HOLD.md; answer 17 is for the reviewer; prompts file re-read, it matches.
- No new capture: vault 41j3e9s9 still at 4c3965130775, and the researcher's 15:30 run was idle ([Vicky's researcher report](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/vicky/reports/researcher.md)). No map written.
- Team topics: nothing new. S25 (the sign-in) is already an article, [PrompTugal.news, "The sign-in: how editors and agents prove who they are"](https://promptugal.news/articles/index.md), read 7 November 2026; the newsroom notes still hold the same two notes, one of them left out for resting on a private transcript.
- state: idle; done: P1 to P3 in the task prompt; next: the 19:45 run; ask: none; run: scheduled

## Sat 7 Nov 2026, 19:45 UTC run

- decisions.md read first (applied P1 to P3 as in my prompts file): no HOLD.md; the newest entry is a schedule change for the writers and the reviewer, nothing for me; prompts file re-read, it matches.
- No new capture: vault 41j3e9s9 still at 4c3965130775 and the researcher's 19:30 run was idle ([Vicky's researcher report](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/vicky/reports/researcher.md)).
- Two team topics listed (beat "AI and robotics", for journalist-ai), neither published nor drafted: S26, [PrompTugal.news, "The daily newsletter"](https://promptugal.news/newsletter/index.html), and S27, [PrompTugal.news, "The venue map"](https://promptugal.news/summit/venue/index.html), both read 7 November 2026; newsroom commit 2b28e5f1a, map desks/curator/2026-11-07-1945.json.
- For the fact-checker: S27's session counts per building are the site's programme data of 7 November and will change; S26 says sending is the Web Summit team's, so the story must stay to what the page says.
- state: ok; done: S26 and S27 listed; next: the 07:45 run on 8 November; ask: none; run: scheduled

## Sun 8 Nov 2026, 05:30 UTC run

- applied CURATOR-WS (also SA19 and SA20): the scheduled prompt now uses desks/curator/tools/readme.py (committed to the newsroom, commit 5b60ab742, it reproduces the page), allows people and companies in theme-led connection storylines, and carries the duplicate check before step 3; the prompts file matches word for word. P2: the run fired at 05:31, not 07:45; the cron is `30 5,10,14,18 * * *` since the conductor's change of 7 Nov 23:14 UTC, which my prompts file records, so the file wins and nothing is wrong. decisions.md read first: no HOLD.md; answers 18 and 21 are for others.
- No new capture: vault 41j3e9s9 still at 4c3965130775 and the researcher's 05:15 run was idle ([Vicky's researcher report](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/vicky/reports/researcher.md)). No map.
- Team topics S25, S26 and S27 are already drafted by journalist-ai (s25, s26, s27 in the journalist drafts); no new team topic. No theme-led connection storyline this run: the 33 captures' themes are already covered by published articles or drafts (S4, S10, S16, S19, S22), so by SA20 I add one only with a new capture or a clearly different angle.
- state: ok; done: CURATOR-WS applied, generator committed; next: the 10:30 run; ask: none; run: scheduled

## Sun 8 Nov 2026, 08:55 UTC (prompted pass, SA19B)

- applied SA19B: step 3 of my scheduled prompt now says to look for a theme-led connection storyline with or without new research (replacement exactly as in decisions.md; the prompts file matches). Source: Vicky's word quoted in decisions.md by the conductor, 8 Nov.
- Pass under SA19B and SA20: looked across the 34 captures, the 38 published articles, the drafts of all desks and the storyline map; no new theme-led storyline, so no map and nothing for journalist-connections. The candidates I weighed each have an article or draft doing the same job: where the money comes from (S4, S16, S17), expansion to Spain, Germany, Italy and Brazil (S4, S19, S11, S17), who supports startups in Portugal (S7, S3, S10, BR6 "Portugal as the door"), waste into value (S22; S23 dropped as a duplicate), robotics and the lineup (S12, S15). The one unused capture with room ([Web Summit, "Unveiling the creators joining us at Web Summit 2026"](https://websummit.com/blog/marketing/creator-programme-web-summit-2026/), read 4 November 2026) names no creator, so no one can be named from it.
- Ask: a named-people storyline needs a capture that names people; the next researcher mandate could be "public, professional profiles of speakers and founders by theme (climate, health, fintech)". I recommend you pass that to the researcher.
- state: idle; done: SA19B applied, pass run, nothing found; next: the 10:30 run; ask: researcher mandate for named people by theme (recommend yes); run: prompted

## Sun 8 Nov 2026, 10:30 UTC run

- applied SA19C: its workflow paragraph is in my prompts file (rule 23); I build theme-led storylines from the researcher's captures and the published articles only. decisions.md read first: no HOLD.md; the conductor's commit 862aad46 is the source; prompts file re-read, it matches.
- New capture in vault 41j3e9s9 (commit 0a0f02e6e052, researcher's 10:15 run): [Web Summit, "Meet Web Summit's 2026 speakers"](https://websummit.com/speakers/), read 8 November 2026, twenty speakers by theme with role and organisation.
- New storyline S28 for journalist-connections, beat "Connections: the summit": "Five AI builders on Web Summit's speaker list worth knowing" (Tao Zhang of Manus AI, Dahai Li of ModelBest, Alan Shen of MiniMax, Richard Socher of You.com, Michele Catasta of Replit). No article or draft names them; the robotics group is not listed again (S12 and S15 cover it). Newsroom: desks/curator/2026-11-08-1045.json.
- For the fact-checker: only the page's first view was read and its order rotates, so the five are a sample; what each company does is not captured yet, so the writer takes it from each company's own page. Held for the next pass, when the researcher's "what each organisation does" arrives: the policy and investment group, mobility and devices, infrastructure and security.
- state: ok; done: S28 listed, SA19C recorded; next: the 14:30 run; ask: none; run: scheduled

## Sun 8 Nov 2026, 14:30 UTC run

- applied SA22: the curator line is in my scheduled prompt (before step 3) and my prompts file (rule 24); my times are unchanged. decisions.md read first: no HOLD.md; PILOT-REPLIT is not for me; the conductor's commit e189da66 is the source; prompts file re-read, it matches.
- New capture in vault 41j3e9s9 (researcher's 14:15 run): [Web Summit, "Featured startups at Web Summit"](https://websummit.com/featured-startups/), read 8 November 2026, page 1 of 26, 100 startups with the page's industry tags (names and tags only). Mapped in desks/curator/2026-11-08-1445.json and held: no storyline yet, because what the startups do and where they are based is not captured; none of the names is in a published article or draft.
- Priority list for journalist-connections: 1, S28 (the five AI builders), ready to write now, with the writer taking what each company does from its own page and re-reading the speakers page the same day. Nothing else is ready; the README has a section "Connection storylines: order and readiness" (newsroom).
- state: ok; done: SA22 applied, startups capture mapped and held, S28 marked ready; next: the 18:30 run; ask: none; run: scheduled

## Sun 8 Nov 2026, 15:20 UTC (prompted correction: S28 already published)

- Corrected, at Vicky's word: S28 is published, [PrompTugal.news, "Five AI builders on Web Summit's speaker list worth knowing"](https://promptugal.news/articles/five-ai-builders-to-know.html), read 8 November 2026 (reviewer's commit b0eab872 at 12:29 UTC, v0.1.704). Both maps (2026-11-08-1045 and -1445) now say so, the README marks it "(published 8 Nov)" and its "Ready to write now" list is empty (newsroom release in progress).
- Why the check missed it: at 14:30 I ran the duplicate check (standing answer 20) only on the 100 new startup names, not again on S28 itself before marking it ready, although its draft (11:12) and article (12:29) were already in the clone I had pulled. Fixed in my prompts file (rule 25) and in the generator, which now refuses a ready story whose title matches an article or a draft (tested: it stops on S28). I did not change the scheduled prompt.
- PILOT-REPLIT is a separate addition to the existing Replit company page, not an S28 draft; nothing for me.
- state: ok; done: S28 marked published, ready list empty, check added; next: the 18:30 run; ask: may I add one sentence to the scheduled prompt too, "before marking a connection storyline ready, re-check it against published articles and drafts"? (recommend yes, though rule 25 already binds me); run: prompted

## Sun 8 Nov 2026, 15:35 UTC (prompted: re-check sentence)

- Added to my scheduled prompt, at Vicky's word and word for word, right after standing answer 22's line: "Before marking a connection storyline ready, re-check it against published articles and drafts." Consistent with rule 25 and standing answer 20 (which still governs creating any storyline); the prompts file carries the same prompt text and a note under rule 25. Schedule unchanged: `30 5,10,14,18 * * *`, next run 18:30 UTC.
- state: ok; done: sentence added to the task prompt and the prompts file; next: the 18:30 run; ask: none; run: prompted

## Sun 8 Nov 2026, 17:00 UTC (prompted: desk review across all five desks)

- applied (Vicky's word in chat): from the next run with new research I review the researcher's material across all five desks, summit, Europe, Portugal, AI and connections, and turn suitable material into mature, non-duplicate assignments for each desk's journalist, each with a reader angle and sources; connections are not the focus. A desk with nothing suitable gets a one-line reason in the map's `desk_review`, missing evidence goes to the researcher as a gap, and no story is forced. It is in my scheduled prompt (end of step 4) and my prompts file (rule 26); schedule unchanged, next run 18:30 UTC.
- state: ok; done: desk review added to the task prompt and prompts file; next: the 18:30 run; ask: none; run: prompted

## Sun 8 Nov 2026, 18:30 UTC run (first desk review)

- decisions.md read first: no HOLD.md; answers 23 to 25 and the company-page items are for others; prompts file re-read, it matches. New research: the researcher's 18:15 revision of [Web Summit, "Featured startups at Web Summit"](https://websummit.com/featured-startups/), read 8 November 2026 (country, stage, pitch for the first 100 startups); map desks/curator/2026-11-08-1845.json.
- Desk review: AI desk, S29 "Who builds the parts of an AI agent? Startups at Web Summit" (Mastra, Keewano, Acrab AI, Humanos, Polygraf AI, GetVocal, Beyond Presence, Cnext), ready for journalist-ai; connections, S30 "Eleven health startups at Web Summit, by the problem they tackle", ready for journalist-connections; both checked against articles, drafts and the site's company pages (profiles exist for five of the AI startups, to be linked not repeated).
- No assignment: summit (nothing practical or programme-related is new), Europe (only a count over one list page of 26), Portugal (four Portuguese startups among the first 100 would misstate the total). Gap for the researcher: the whole featured list, which would let those desks have assignments; the researcher has asked you whether it may read it, so that is your call.
- state: ok; done: first desk review, S29 and S30 assigned; next: the 05:30 run on 9 November; ask: may the researcher read pages 2 to 26 of the featured list (recommend: your call, it unlocks the Portugal, Europe and summit desks); run: scheduled

## Sun 8 Nov 2026, 19:10 UTC (prompted: desk requests for the researcher)

- applied: the gap about pages 2 to 26 stays recorded (map 2026-11-08-1845 now says "recorded, not requested"); S29 and S30 stand with their stated limits; no assignment depends on the list, and I do not ask for the search service. Rule 27 in my prompts file; the scheduled prompt is unchanged.
- Requests routed to the researcher through the map's gaps list (desks/curator/2026-11-08-1900.json, newsroom), each with a reader angle and ordinary public sources: Portugal, (1) which Portuguese startups are in the Road 2 Web Summit class and at the Portugal stand, and what each does, from Startup Portugal's own page; (2) what is on at the Pavilhão de Portugal and in Lisbon side events, from the organisers' and the city's pages. Europe, (1) EU funding calls for startups open now, with dates, from europa.eu pages; (2) which other countries bring national delegations and what each offers, from each national agency's page. Summit, (1) what Web Summit says on accessibility, safety and practical needs at the venue; (2) evening events and the city's programme in summit week.
- No assignment for the summit, Europe and Portugal desks until a capture supports one; none forced.
- state: ok; done: gaps routed, pagination gap kept as record only; next: the 05:30 run on 9 November; ask: none; run: prompted

## Mon 9 Nov 2026, 05:30 UTC run (desk review)

- decisions.md read first: no HOLD.md; HANDOFF-FIX and OVERNIGHT-9NOV are not for me; prompts file re-read, it matches. New research: [Portugal Startup News, "Full list of 78 startups selected by Startup Portugal for Road 2 Web Summit 2026"](https://portugalstartupnews.com/2026/11/08/full-list-of-78-startups-selected-by-startup-portugal-for-road-2-web-summit-2026/), read 9 November 2026, which answers my first Portugal request; map desks/curator/2026-11-09-0545.json.
- Desk review: Portugal, S31 "Beyond Lisbon: where Road 2 Web Summit's 78 startups come from" ready for journalist-portugal (Lisbon has 41 of the 78; no article or draft names the 78 or their cities). Summit and Europe: no assignment (pitch times not captured; the Europe requests still open). AI and connections: none ready; S29 and S30 are already published, and S32 (rehab beyond the clinic) is not ready until three companies' own pages are captured.
- For the fact-checker and reviewer: S29 (published) says Humanos is from the United States, as Web Summit's page shows; the Startup Portugal list gives Madeira, so check Humanos's own page. S3 (published) says up to 125 companies were to be selected; the article says 78 were.
- Requests for the researcher (in the map): when and where the Road 2 pitches run; what Braining, UpSpeech and Twin Factory do; where Humanos is based and what BASTYN and KBAI Research do.
- state: ok; done: desk review, S31 ready, S32 held; next: the 10:30 run; ask: none; run: scheduled

## Mon 9 Nov 2026, 10:30 UTC run (desk review)

- decisions.md read first: no HOLD.md; answer 26 and brief 8's clean-up are not for me; prompts file re-read, it matches. New research (two captures, researcher's 10:15 run): [IBM Newsroom, "IBM Sports Tech Startup Challenge culminates at Web Summit Lisbon 2026"](https://newsroom.ibm.com/blog-ibm-sports-tech-startup-challenge-culminates-at-web-summit-lisbon-2026) and [Diário de Coimbra, "Go Coimbra apresenta 12 startups na Web Summit em Lisboa"](https://www.diariocoimbra.pt/2026/11/09/go-coimbra-apresenta-12-startups-na-web-summit-em-lisboa/), both read 9 November 2026; map desks/curator/2026-11-09-1045.json.
- Desk review: summit desk, S33 "Sports tech at Web Summit: IBM's startup challenge ends in Lisbon" ready for journalist and time-sensitive (the showcase is on 10 November; no article or draft names IBM's challenge). Portugal: no new assignment; S31 is already drafted and Ready (held for you), and the Go Coimbra stand cannot be written yet because the 12 startups are not named and no stand location is given. Europe, AI, connections: nothing new that is ready.
- Requests for the researcher: the showcase time and stage from Web Summit's schedule; Go Coimbra's and IPN's own pages naming the 12 startups and the stand.
- state: ok; done: desk review, S33 ready, S31 marked drafted; next: the 14:30 run; ask: none; run: scheduled
