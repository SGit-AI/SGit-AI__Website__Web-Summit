# journalist-connections@web-summit.vicky: reports

Vicky's Connections journalist for the Web Summit 2026 newsroom (which startups, companies, investors and programmes could meet or work together at Web Summit): turns the curator's story candidates on that beat into drafts in desks/journalist-vicky/drafts/ of the newsroom repository, one story at a time when Vicky asks. One short line per piece of work.

## Thu 5 Nov 2026, 20:50 UTC (set-up and S18)

- Session key made and published as journalist-connections-vicky in data/keys.json (signing sha256:e48c110d522879b5, encryption sha256:19dd7c031e5ef3db); pki-agent.mjs matched the sha256 pinned in admin/tools/seal.mjs.
- Draft S18, "Tuesday 10 November: Europe on stage, universities pitching, first-timers meeting": desks/journalist-vicky/drafts/S18-tuesday-10-november-three-ways-in.md in the newsroom repository, status draft, for newsroom@web-summit.dinis.
- Sources, all read 5 Nov at their own addresses: the Commission's DigitalEU at Web Summit 2026 page (3 Nov), Web Summit's schedule and the first-timers meetup session page, ULisboa's announcement (19 Oct), Técnico's announcement (updated 3 Nov).
- Not confirmed: the Virkkunen fireside on Web Summit's own schedule (only on the Commission's page); the masterclass's room; UniVerse's time and whether its venue is inside Web Summit's; which startups pitch; which days each Commission stand is open; times assumed Lisbon time. All links between organisations are labelled suggestions.

## Thu 5 Nov 2026 (S18 review)

- S18 fixed as reviewer-vicky's "Fix first" asked: "she will talk about" became "the talk covers" (the Commission gives no pronoun), and the meetup quote now starts at "Calling all", checked against the session page. Length left for the style pass, as the review says. No point disputed.

## Fri 6 Nov 2026, 09:50 UTC (WS-177)

- Newsroom copy now points at PrompTugal/PrompTugal__News__Website; all pushes to dev there, through newsroom/tools/release.sh.
- Draft S14, "Granter and Intuitivo: two PITCH winners, one backer, new markets" (475 words). Sources: Portugal Startup News on Granter (3 Nov) and Intuitivo (23 Oct), read 6 Nov. Not confirmed: whether either company or 3xP Global is at Web Summit 2026; the companies' own figures.
- Draft S16, "Europe's AI and funding help, and Portuguese startups it could suit" (513 words). Sources: the Commission's DigitalEU agenda (3 Nov), HaDEA's event page, Portugal Startup News on Granter, Técnico's announcement, all read 6 Nov. Not confirmed: Granter at the summit; what Técnico's spin-offs make; masterclass rooms.
- Draft S19, "Brazil comes to Lisbon as Intuitivo heads to Brazil" (463 words). Sources: Executive Digest (4 Nov), Portugal Startup News on Intuitivo, read 6 Nov. Not confirmed: Intuitivo at the summit; which Brazilian companies come; ApexBrasil's 700 million dollar figure.
- Draft S21, "One backer, two fields: 3xP Global's Granter and Octo Health" (480 words). Sources: Portugal Startup News on Octo Health (5 Nov), Granter, Intuitivo, read 6 Nov. Not confirmed: which 3xP Global vehicle led Octo's round; Jornal Económico's report (not read); presence at the summit.
- S17 not drafted: already drafted by journalist-promptugal and published as wednesday-11-november-going-abroad.

## Fri 6 Nov 2026, 10:55 UTC (reviews, new name, scheduled task)

- Now journalist-connections@PrompTugal.vicky. Key entered in the newsroom's board/keys.json as journalist-connections-vicky-promptugal (same key, signing sha256:e48c110d522879b5).
- S16 fixed per review: published format only (no title line, front matter order, sources as one line with <url>, map path in backticks), links to the site's pages for Granter, Técnico, HaDEA and EuroHPC. No fact changed.
- S19 fixed per review: summary now says Intuitivo "has raised"; same format fixes; ApexBrasil, Sebrae Startups and Intuitivo linked. The reviewer's overlap note (S9 and S4 already published) is left for Vicky.
- S14 and S21 dropped as duplicates, as Vicky said; files left as they are.
- STYLE.md now asks for sources as <url>, which differs from Vicky's chat rule ([Source name](URL)); followed STYLE.md as the newer rule.
- Scheduled task made: 08:00 and 16:00 UTC daily, into this session.

## Fri 6 Nov 2026, 11:10 UTC (source links)

- S16 and S19: source lines switched to [Publisher, "Title"](url), date, read D Month YYYY, per the updated STYLE.md. Nothing else changed. S19 runs, at Vicky's word.
- S20 is journalist-portugal's draft, not mine; left for that agent. For: journalist-portugal@PrompTugal.vicky.

## Fri 6 Nov 2026, 16:15 UTC (scheduled run)

- Applied P1 (no HOLD.md on the team site or board/HOLD.md in the newsroom), P2 (prompts file re-read; it matches), P3 (status block below), P5 (scheduled task moved to 08:24 and 16:24 UTC; prompts file updated), P9 (~/.abp/log/ does not exist: no; shown "ABP (Agent Behaviour Policy) re-anchored" at last start: no).
- Newsroom remote had reverted to the old SGit-AI address after a restart; reset to PrompTugal before any push. Nothing was pushed to the old address.
- Draft S23, "Waste into value: AgroGrINTech and Seamoretech, two circular Portuguese startups" (517 words), For: journalist@PrompTugal.dinis. Sources: AICEP Portugal Global on AgroGrINTech (4 Nov) and Portugal Startup News on Seamoretech (2 Nov), both read 6 Nov. Not confirmed: whether either company is at Web Summit 2026; the companies' own figures.
- No other Connections storyline is open: S15, S16, S18, S19 drafted; S14 and S21 dropped; S17 published by Dinis's journalist.
- state: ok; done: S23 drafted and pushed, P1 P2 P3 P5 P9 applied; next: next Connections storyline the curator adds; ask: none; run: scheduled

## Fri 6 Nov 2026, 16:27 UTC (scheduled run)

- state: idle

## Sat 7 Nov 2026, 08:30 UTC (scheduled run)

- Applied P22 (Gmail never used) and P27 (no prompt text in reports; prompts file holds no private names).
- state: idle

## Sat 7 Nov 2026, 16:30 UTC (scheduled run)

- Applied SA13 (no draft of mine is fix-first: S16, S18 and S19 Ready, S23 Dropped), SA15 (an image, wired as the card cover, from my next draft), SA16 (P1 to P3 word for word in my prompts file and in my scheduled task's prompt), SCHED-7NOV (my task now runs at 08:24, 12:24 and 20:24 UTC; the 16:24 run is gone after today), P10 (after a compaction I re-read decisions.md and my prompts file first) and P17 (a debrief in people/vicky/debriefs/ if I am replaced).
- P2: prompts file and memory agree. No hold. No new Connections storyline (S25 is AI and robotics).
- state: ok; done: SA13, SA15, SA16, SCHED-7NOV, P10 and P17 applied; scheduled prompt changed (SA13 and P1 to P3 added); next: next Connections storyline from the curator; ask: none; run: scheduled

## Sat 7 Nov 2026, 20:27 UTC (scheduled run)

- Applied SCHED-7NOV (four rounds): my task now runs at 08:24, 12:24, 16:24 and 20:24 UTC, prompt kept; prompts file updated.
- No hold; P2: prompts file and memory agree; no fix-first draft (S16, S18, S19 Ready; S23 Dropped); no new Connections storyline (S26 and S27 are AI and robotics).
- state: ok; done: SCHED-7NOV (four rounds) applied; next: next Connections storyline from the curator; ask: none; run: scheduled

## Sun 8 Nov 2026, 06:15 UTC (scheduled run)

- Applied SCHED-WS: both tasks match (writing at :09 past 06, 11, 15 and 19 UTC, trig_01RqSqjPAC6WuwNmTbjKFzwa; fix-only at :14 past 07, 12, 16 and 20 UTC, trig_014fa4xbTLFyrXdfF4pzv8KD).
- Applied SA18 (fix-only task's prompt and standing answer 18 in my prompts file; I had not made a fix-only task myself, so there is no duplicate), SA19 (in my writing task's prompt and prompts file) and REMOTE-WS (step 2 replaced in both tasks, trig_01RqSqjPAC6WuwNmTbjKFzwa and trig_014fa4xbTLFyrXdfF4pzv8KD; prompts file copies updated).
- P10 and P17 were confirmed in my report at 16:30 on 7 Nov; confirmed again here, as the 00:10 list still shows them open.
- P2: the prompts file had the conductor's SCHED-WS line, which matches the tasks; no disagreement. No hold. No fix-first (S16, S18, S19 Ready). No new Connections storyline on the map (05:32 UTC).
- state: ok; done: SCHED-WS, SA18, SA19, REMOTE-WS applied, P10 and P17 reconfirmed; next: theme-led Connections storylines when the curator adds them; ask: none; run: scheduled

## Sun 8 Nov 2026, 11:20 UTC (scheduled run)

- Draft S28, "Five AI builders on Web Summit's speaker list worth knowing" (525 words, theme-led), For: journalist@PrompTugal.dinis. Sources, all read 8 Nov: Web Summit's speakers page and its session page for Replit's press conference; the five companies' own sites (Replit, Manus, MiniMax, ModelBest, You.com). Cover card S28-cover-card-2026-11-08.svg in drafts/img/, checked at 390px, set as the front matter image. Not confirmed: when and where four of the five speak; the companies' own claims (MiniMax's 300 million users among them). Web Summit's attendee pages load in the browser only, so they gave no extra context.
- Applied SA19B (in my writing task's prompt and prompts file) and SA19C (workflow paragraph in my prompts file; I write only storylines the curator lists, as S28 is).
- No hold; P2: prompts file and memory agree; no fix-first (S16, S18, S19 Ready).
- state: ok; done: S28 drafted and pushed, SA19B and SA19C applied; next: further theme-led storylines from the curator; ask: none; run: scheduled

## Sun 8 Nov 2026, 12:20 UTC (fix-only run)

- S28 fixed after the reviewer's Fix first: Replit's press conference is a media-only event in the Media Village (checked again on Web Summit's session page today); now said where it is named, in the connection line, in What this does not claim and in its source line. Status back to draft, For: reviewer@PrompTugal.vicky. No point disputed.
- state: ok; done: S28 revised and pushed; next: the reviewer's re-check; ask: none; run: scheduled
