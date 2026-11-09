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

## Sun 8 Nov 2026, 14:50 UTC (manual run, at Vicky's request)

- PILOT-REPLIT content pushed: desks/journalist-vicky/companies/replit.md in the newsroom repository, status: in-review, For: reviewer@PrompTugal.vicky ("PILOT-REPLIT content ready for review"). About: four sentences from Replit's own pages (home page and "AI Coding Agent") and Web Summit's partner listing. At Web Summit 2026: event partner (AI and machine learning); three sessions on Tue 10 Nov from Web Summit's session pages (14:00 Centre Stage; 15:00 Stage 2 press conference, marked Media only, in the Media Village; 16:00 Stage 13, AI Summit). From the newsroom: S28, the only published article that names Replit. All sources read 8 Nov. S28 unchanged.
- Not confirmed: the time zone of the session times (Web Summit's pages do not state it, so the file does not either).
- state: ok; done: PILOT-REPLIT content pushed; next: the reviewer's check, then dev builds it; SA22 at my 15:09 run; ask: none; run: prompted

## Sun 8 Nov 2026, 14:50 UTC (scheduled run)

- Applied SA22: step 5 of my writing task's prompt replaced as given (up to three connection stories, only as the curator lists them); prompts file has the new times (writing :45 past 05, 10, 14, 18; fix-only :50 past 06, 11, 15, 19 UTC, both set by the conductor) and standing answer 22. SA19B and SA19C were applied at 11:20 (see above).
- No hold; P2: prompts file and memory agree. No new Connections storyline (S28 is published). PILOT-REPLIT file now status: ready (the reviewer's). S28's review file still reads Fix first in its header, but the reviewer re-checked it Ready at 12:22 and published it at 12:29; nothing open for me. For: reviewer@PrompTugal.vicky, if the header should be updated.
- state: ok; done: SA22 applied; next: new connection storylines from the curator; ask: none; run: scheduled

## Sun 8 Nov 2026, 16:15 UTC (manual run, at Vicky's request)

- SA23-REPLIT step 1 done: Replit's About section in desks/journalist-vicky/companies/replit.md revised to standing answer 23 (three short, plain sentences on what Replit does; no marketing quote; no event details, the partner line staying in At Web Summit 2026; each claim numbered to its source in a list below the paragraph). Sources re-read today: Replit's home page and its AI agent page, Web Summit's Replit page. Other sections unchanged. status: in-review, commit For: reviewer@PrompTugal.vicky ("SA23-REPLIT ready for review").
- state: ok; done: SA23-REPLIT step 1; next: the reviewer's check (19:15 or 20:20); ask: none; run: prompted

## Sun 8 Nov 2026, 18:10 UTC (company batch C1, manual run at Vicky's request)

- C1 ready for review: ten files in desks/journalist-vicky/companies/ in the newsroom repository (cloudflare, descope, emergence-ai, exein, ledger, manus-ai, you-com, proofpoint, proton, roost), status: in-review, pushed together, commit For: reviewer@PrompTugal.vicky. Backlog rows set to "in review".
- Sources, all read 8 Nov: each company's own site (About, two or three plain sentences with numbered sources; Manus has one sentence, as its site gives no more without marketing copy); Web Summit's speakers page (Cloudflare, Manus AI, You.com) and nine session pages (one each, except Manus, which has no session page in our sources). None is marked media only by Web Summit.
- Skipped: none. Left out on purpose: where each company is based (Web Summit's listings give a speaker's country, not the company's head office).
- Applied SA24X: standing answer 24 in my prompts file; I never added the withdrawn "6b" line to my writing task.
- state: ok; done: C1 written and pushed for review; next: the reviewer's C1 batch; my 18:45 writing run; ask: none; run: prompted

## Sun 8 Nov 2026, 18:55 UTC (scheduled run)

- Draft S30, "Eleven health startups at Web Summit, by the problem they tackle" (579 words, theme-led), For: journalist@PrompTugal.dinis. Source: Web Summit's featured startups page, first page, read 8 Nov, with each startup's own description; four groups (getting care 4, diagnosis sooner 3, new treatments 2, recovery and wellbeing 2). Cover card checked at 390px. No company dropped. Not confirmed: the companies' own figures; when or where each exhibits; later pages of the list. Countries left out except where a company's own description gives one (AURIMOD, Vienna; NeoCannBio, Korea).
- The only storyline the curator lists as ready for my desk; S29 is for journalist-ai.
- No hold; P2: prompts file and memory agree. No fix-first open for me: C1 all Ready and released (the batch's one fix, Fretefy, is journalist-portugal's P1); S28's review header still reads Fix first but it was re-checked and published at 12:22 and 12:29.
- state: ok; done: S30 drafted and pushed; next: the reviewer's check; ask: none; run: scheduled

## Sun 8 Nov 2026, 19:10 UTC (prompted, at Vicky's request)

- Correction to the 18:55 line: S30's handoff is to reviewer@PrompTugal.vicky through the normal review queue (it reviews every draft in desks/journalist-vicky/drafts/ without a review; S30 had none). Recorded in a commit For: reviewer@PrompTugal.vicky. Not duplicated, not released.
- S30 now says, in In short, What this does not claim and its source line, that the eleven come from page 1 of 26 of Web Summit's featured startups, whose 100 entries are all GROWTH stage, and are not a complete or representative list (re-checked on Web Summit's page today).
- state: ok; done: S30 handoff corrected and sample stated; next: the reviewer's check; ask: should my writing task's step 5 say For: reviewer@PrompTugal.vicky instead of journalist@PrompTugal.dinis? (recommended: yes); run: prompted

## Sun 8 Nov 2026, 19:00 UTC (prompted, at Vicky's request): routing fix

- **For conductor@web-summit.vicky's routing audit.** Cause: step 5 of my writing task (trig_01RqSqjPAC6WuwNmTbjKFzwa) said "For: journalist@PrompTugal.dinis", as set on 6 Nov, before Vicky's reviewer queue existed. So my draft commits (S23, S28, S30, and S14, S16, S19 and S21 earlier) named Dinis's journalist rather than reviewer@PrompTugal.vicky, and my 18:55 report line repeated it for S30. Effect: none on review, since the reviewer reviews every unreviewed draft in desks/journalist-vicky/drafts/; only the commit's address and the report were misleading. Fix: step 5 now says "For: reviewer@PrompTugal.vicky" (task updated 18:56 UTC; schedule unchanged, writing at :45 past 05, 10, 14, 18 UTC); prompts file synchronised; S30's handoff recorded For: reviewer@PrompTugal.vicky (commit 9fbce7be). The fix-only task already addressed the reviewer and is unchanged.
- state: ok; done: step 5 readdressed, prompts file synchronised, cause and fix recorded; next: next writing run 05:45 tomorrow; ask: none; run: prompted

## Sun 8 Nov 2026, 19:15 UTC (company batch C2, manual run at Vicky's request)

- C2 ready for review: ten files in desks/journalist-vicky/companies/ in the newsroom repository (rws, scrut-automation, shakers, spacecomputer, sphere, strawberry, sumsub, the-hacking-games, topsec-cloud-solutions, trent-ai), status: in-review, pushed together, commit For: reviewer@PrompTugal.vicky. Backlog rows set to "in review".
- Sources, all read 8 Nov: the companies' own sites; Web Summit's featured startups page (Shakers, SpaceComputer, Sphere, Strawberry: GROWTH-stage featured startups, each with its own description); eight Web Summit session pages for the other six.
- RWS (marked "website"): its site refused an automated read (HTTP 202, no content), so its About rests on Wikipedia's "RWS Group" article, noted in the source line. Its press conference (Tue 10 Nov, 11:30, Stage 2) is marked Media only, as Web Summit's page says.
- Skipped: none. Blockers: none. Left out on purpose: where each company is based, as in C1.
- state: ok; done: C2 written and pushed for review; next: my 19:50 fix-only run; no further batch; ask: none; run: prompted

## Sun 8 Nov 2026, 19:58 UTC (fix-only run)

- S30 fixed after the reviewer's Fix first, all points accepted and checked today: the eleven companies' own Web Summit pages now cited and linked (each with its description and GROWTH badge), and the text says the descriptions come from those pages; NeoCannBio "says it is building" its chain; AURIMOD's drug-free claim attributed; the cover card and its alt text say the eleven are from page 1 of Web Summit's featured list; group label now "doctors, bookings, claims". Status back to draft, For: reviewer@PrompTugal.vicky. Note for the record: the descriptions were also in the list page's embedded data, which is where I first read them; citing each company's page is clearer for readers.
- state: ok; done: S30 revised and pushed; next: the reviewer's 20:20 re-check; ask: none; run: scheduled

## Mon 9 Nov 2026, 00:10 UTC (OVERNIGHT-9NOV, C2 fixes)

- Shakers, SpaceComputer, Sphere and Strawberry fixed and pushed together, status: in-review, For: reviewer@PrompTugal.vicky: each cites its own Web Summit page (description and GROWTH stage), SpaceComputer's self-description and Strawberry's claim attributed, the times line dropped. Sources re-read 9 Nov.
- RWS left in fix: its site still sends no content to a plain request (HTTP 202), and loading it in a headless browser was refused by this session's permission check, so I did not try another way. Two smaller corrections made ("intellectual property"; an accurate source note). Its backlog row says why.
- state: partial; done: four C2 fixes in review, RWS left in fix with reason; next: batch S2 at the next wake; ask: for RWS, can the reviewer (who can open rws.com) source the About, or may it rest on Wikipedia alone?; run: scheduled

## Mon 9 Nov 2026, 00:20 UTC (OVERNIGHT-9NOV, batch S2)

- S2 written and pushed in three groups (crowdstrike, defined-ai, delinea, google-cloud; ibm, kiggu, lawvu, manageengine; neo, persona), status: in-review, For: reviewer@PrompTugal.vicky; all ten backlog rows "in review". Skipped: none.
- Sources, all read 9 Nov: the companies' own sites (CrowdStrike, Defined.ai, LawVu, Neo); the companies' own descriptions on their Web Summit pages (Delinea, Google Cloud, IBM, Kiggu, ManageEngine); Web Summit's partners list and thirteen session pages. Two press conferences marked Media only, as their Web Summit pages say (Defined.ai, Tue 10 Nov 16:00; the AI-regulation one with Neo's Ali Partovi, Tue 10 Nov 11:00).
- Persona (marked "website"): its site answered with a challenge page (HTTP 403), so I did not read it; its About rests on Wikipedia's "Persona Identities" article, noted in the source line. Same question as RWS for the reviewer.
- The last push took two tries of release.sh (others were pushing during the gate); no force.
- state: ok; done: S2 ten files in review; next: nothing more tonight for this desk; ask: may Persona's and RWS's About rest on Wikipedia, or should the reviewer source them from the companies' sites?; run: scheduled

## Mon 9 Nov 2026, 02:50 UTC (OVERNIGHT-9NOV, fix-only round)

- Only RWS is in fix in my batches (C2 and S2 otherwise all done). It cannot be fixed from here: the fix asks for an About sourced from rws.com, which sends this session no content, and a headless browser is refused by my session's permission check. File and row left as they are (status: fix, never live). Note: Persona was released overnight with an About resting on Wikipedia alone, the same situation as RWS.
- state: blocked; done: none; next: RWS when Vicky decides; ask: may RWS's About rest on Wikipedia, as Persona's now does (then I set it in-review), or should the reviewer, who can open rws.com, source it?; run: scheduled

## Mon 9 Nov 2026, 05:47 UTC (scheduled run)

- state: idle

## Mon 9 Nov 2026, 10:50 UTC (scheduled run)

- Applied SA26: standing answer 26 in my prompts file. Persona and RWS are my files (S2 and C2); each needs its own site or an official Web Summit company page under its About. Neither site answers this session, and our sources show no Web Summit company page for either (only session and speaker pages), so both wait for a batch Vicky starts (standing answer 24), not a scheduled run.
- No hold; P2: prompts file and memory agree; no new Connections storyline ready (S32 held by the curator); no fix-first open on my drafts.
- state: ok; done: SA26 applied; next: Persona and RWS when Vicky starts a batch; ask: none; run: scheduled
