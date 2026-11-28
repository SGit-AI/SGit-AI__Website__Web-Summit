# journalist-portugal@web-summit.vicky: reports

Vicky's Portugal journalist for the Web Summit 2026 newsroom (Portuguese startups, funding, universities, government support, the Portuguese ecosystem): turns the curator's story candidates on that beat into drafts in desks/journalist-vicky/drafts/ of the newsroom repository, one story at a time when Vicky asks. One short line per piece of work.

## Thu 5 Nov 2026, 20:40 UTC (set-up and S10)

- Session key made and published as journalist-portugal-vicky in data/keys.json (signing sha256:f3c5113e46068c5c, encryption sha256:397766fec1bee839); pki-agent.mjs matched the sha256 pinned in admin/tools/seal.mjs.
- Draft S10, "Lisbon's universities at Web Summit: two stands and a pitch day": desks/journalist-vicky/drafts/S10-lisbon-universities-at-web-summit.md in the newsroom repository, status draft, for newsroom@web-summit.dinis.
- Sources, all read 5 Nov at their own addresses: ULisboa's announcement (19 Oct), Técnico's announcement (29 Oct, updated 3 Nov), Web Summit's venue essentials (the dates).
- Not confirmed: ULisboa's own rankings and figures (Startup Portugal's 2025 ranking, the Dealroom numbers, the four unicorns), attributed to ULisboa and not checked; which startups pitch at UniVerse; the day and time of Arlindo Oliveira's panel; the quadruped's model ("Unitree G02" per Técnico); "first day of the event" read as 10 November, as ULisboa says.

## Fri 6 Nov 2026, 09:50 UTC (WS-177: S3, S4, S7, S13, S20)

- Newsroom copy now points at PrompTugal/PrompTugal__News__Website; all five drafts pushed to its dev through newsroom/tools/release.sh, For: newsroom@web-summit.dinis, following STYLE.md (435 to 518 words each).
- S3, Road 2 Web Summit: Tek Notícias (14 Aug) and Startup Portugal's programme page, read 6 Nov. The curator's Startup Portugal link (/pt/programs/road-2-web-summit-pt/) was a 404; read at /pt/programs/road-2-web-summit/. Not confirmed: the 2026 class (only "up to 125"); the totals differ (Tek: over 1,200 since 2016; Startup Portugal: over 1,000).
- S4 and S7 overlap on the three rounds (Granter, Intuitivo, Seamoretech). S4 covers them, from Portugal Startup News (3 Nov, 23 Oct, 2 Nov); the companies' figures are their own, via press statements not seen. None is confirmed at Web Summit.
- S7, now the awards and the Algarve: Portugal Startup News (27 Oct, 1 Nov) and Técnico (RTBeamTech on its stand), read 6 Nov. Not confirmed: Algarve Evolution's targets and the Informa D&B study (not read); the report spells the startup both "knok" and "knock".
- S13, the EY figures: Executive Digest with Lusa (5 Nov), read 6 Nov. EY's report itself not read; its method not checked. The press conference's remarks on protests left out as off the story.
- S20, Octo Health: Jornal Económico (4 Nov) and Portugal Startup News (5 Nov), read 6 Nov. Not confirmed: attendance at Web Summit, the round's date, the company's privacy and compliance claims.

## Fri 6 Nov 2026, 10:55 UTC (reviews; new name journalist-portugal@PrompTugal.vicky)

- Renamed journalist-portugal@PrompTugal.vicky; the same key entered in the newsroom's board/keys.json as journalist-portugal-vicky-promptugal (signing sha256:f3c5113e46068c5c).
- S20 fixed after its review (Fix first): "personally identifiable data", the S4 link now to the published from-pitch-to-new-markets.html, "both reports place it before the launch", the published format, organisation page links; plus the one line S21's review suggested (3xP Global's stated focus, from Portugal Startup News on Granter, read 6 Nov). 473 words. S21 (Hold, journalist-connections') left untouched.
- Scheduled task created: daily at 08:00 and 16:00 UTC, Vicky's prompt word for word; prompts file updated.
- The newsroom copy's remote had reverted to the old SGit-AI address after a container restart; the pull at 10:49 went through it (GitHub redirects), nothing was pushed there. Repointed to PrompTugal before any push.

## Fri 6 Nov 2026, 11:00 UTC (S20 sources)

- S20: source lines switched to [Publisher, "Title"](url), read D Month YYYY, per STYLE.md. S16 and S19 not touched: they are journalist-connections@PrompTugal.vicky's drafts; asked Vicky.

## Fri 6 Nov 2026, 16:25 UTC (scheduled run)

- Read decisions.md (all entries in conductor@web-summit.vicky commits); no people/vicky/HOLD.md (applied P1). Re-read prompts/journalist-portugal.md: it matches what I hold (applied P2). Applied P3 (status block below). Applied P5: my scheduled task moved to 08:06 and 16:06 UTC (trig_01R4SDnvm1qg6LrQVcmCRPaH, next 7 Nov 08:06). P9: ~/.abp/log/ does not exist (no); not shown "ABP (Agent Behaviour Policy) re-anchored" at my last start (no). P10: no compaction seen.
- The newsroom remote had reverted to the old SGit-AI address again; reset to PrompTugal before any push; nothing pushed there (standing answer 3).
- Draft S22, "From pineapple waste to fish feed: AgroGrINTech's pilot in Maia" (530 words), pushed For: journalist@PrompTugal.dinis. Sources read 6 Nov: AICEP Portugal Global (4 Nov), Pep4Fish's own report (19 Oct), AgroGrIN Tech's home page. Not confirmed: Web Summit attendance; the 1.2 million euros (Pep4Fish: investment in the unit; AICEP: the project's expected funding); capacity and fish-health claims are the company's and project's.
- No other Portugal storyline without a draft: S23 (Connections) is journalist-connections' and already drafted; S21 is on Hold.
- state: ok; done: S22 drafted and pushed, P1 P2 P3 P5 P9 applied; next: next scheduled run 7 Nov 08:06 UTC; ask: none; run: scheduled

## Fri 6 Nov 2026, 17:15 UTC (S22 review)

- S22 fixed after its review (Fix first): pineapple flour "allowing more of the fruit to be used"; Débora Campos's quote marked as cut and translated from Portuguese; the name's spellings corrected (AICEP: AgroGrINTech; Pep4Fish: both; the company: AgroGrIN Tech). 619 words.
- The pairing with Seamoretech (S23, dropped): reviewer@PrompTugal.vicky had already folded it into S22 on dev at Vicky's word, so I kept that line as it was and added its limits (neither company confirmed at the summit; the pairing is a suggestion, no link claimed). My own version of the line clashed with it on rebase and was dropped.
- The newsroom remote had reverted to the old SGit-AI address again; reset before pulling; nothing pushed there.
- state: ok; done: S22 fixed and pushed; next: scheduled run 7 Nov 08:06 UTC; ask: none; run: prompted

## Sat 7 Nov 2026, 08:10 UTC (scheduled run)

- state: idle (applied P22, P27; run: scheduled)

## Sat 7 Nov 2026, 16:15 UTC (scheduled run)

- state: idle (applied SA16: P1 to P3 added to my prompts file and scheduled task; no fix-first reviews of mine; run: scheduled)

## Sat 7 Nov 2026, 20:10 UTC (scheduled run)

- state: idle (applied SCHED-7NOV (four rounds): 08:06, 12:06, 16:06, 20:06 UTC, cron 6 8,12,16,20; I missed the three-round version at the 16:06 run; run: scheduled)

## Sun 8 Nov 2026, 05:55 UTC (scheduled run)

- state: idle (applied SCHED-WS: writing 05:51, 10:51, 14:51, 18:51 trig_01R4SDnvm1qg6LrQVcmCRPaH and fix-only 06:56, 11:56, 15:56, 19:56 trig_015W8aURM2zEyH9Sd9gJvzNx, both match; applied REMOTE-WS in both tasks, trig_01R4SDnvm1qg6LrQVcmCRPaH and trig_015W8aURM2zEyH9Sd9gJvzNx; applied SA18, no duplicate task of mine; prompts file updated; run: scheduled)

## Sun 8 Nov 2026, 10:55 UTC (scheduled run)

- state: idle

## Sun 8 Nov 2026, 15:00 UTC (scheduled run)

- state: idle (applied SA22: writing :57 past 05, 10, 14, 18; fix-only :02 past 07, 12, 16, 20; both tasks match; prompts file updated)

## Sun 8 Nov 2026, 18:10 UTC (company batch P1, at Vicky's word)

- Batch P1: nine company files pushed status: in-review to desks/journalist-vicky/companies/ in the newsroom (just-travel, meo, mobile-brain, sheerme, ai-infinity, chatplace, dig-in, fido, fretefy), For: reviewer@PrompTugal.vicky; backlog rows set to "in review". None skipped.
- Sources, all read 8 Nov: each company's Web Summit LIS26 appearance page (MEO: its session page and its CTO's attendee page) and its own site. Limits: Fretefy's site loads by script (title and description only); MEO's country is not stated on either source, so About does not give one; no growth startup's Web Summit page gives an exhibition day.
- state: ok; done: P1 in review; next: scheduled writing run 18:57 UTC; ask: none; run: prompted

## Sun 8 Nov 2026, 18:45 UTC (batch P1, Fretefy fix, at Vicky's word)

- Fretefy fixed after the reviewer's Fix first (company-batches-C1-P1.md) and pushed status: in-review, For: reviewer@PrompTugal.vicky; backlog row back to "in review". Re-read 8 Nov: Web Summit's page, fretefy.com.br as served (banner "Fretefy agora é Mobiis", link to mobiis.com.br) and mobiis.com.br (still refers to the "plataforma Fretefy"). My earlier note that the site loads by script was wrong: my text extraction dropped the page header, where the banner is. No contact details used.
- state: ok; done: Fretefy back in review; next: scheduled writing run 18:57 UTC; ask: none; run: prompted

## Sun 8 Nov 2026, 19:05 UTC (scheduled run)

- state: idle (applied HANDOFF-FIX: writing task step 5 now For: reviewer@PrompTugal.vicky with For: journalist@PrompTugal.dinis as a copy, prompts file updated, STYLE.md re-read, no draft re-pushed; confirming P17, SA13 and SA15, applied since 7 Nov: a debrief if replaced; my own reviews checked each run; a cover image on every new draft; run: scheduled)

## Sun 8 Nov 2026, 20:05 UTC (fix-only run)

- applied HANDOFF-FIX (revised): copy removed from the task (trig_01R4SDnvm1qg6LrQVcmCRPaH) and the prompts file; step 5 now ends ", For: reviewer@PrompTugal.vicky (the review hand-off)." No Fix first on my drafts. state: ok; done: HANDOFF-FIX revised; next: writing run 9 Nov 05:57 UTC; ask: none; run: scheduled

## Mon 9 Nov 2026, 00:20 UTC (one-off overnight company batch, OVERNIGHT-9NOV)

- Batch P2 and A2 rows 7 to 11: 13 company files pushed status: in-review For: reviewer@PrompTugal.vicky (hablla, itrecruiter, kpmg-portugal, naporta; ola-doutor, prohound, raras-health, vtex; prisma, runpod, sageox, testmu-ai, twilio); rows set "in review". Skipped: rapidoc (its site refuses automated reads, HTTP 406; only its Web Summit pitch). Sources read 9 Nov: each Web Summit appearance or session and attendee page, the event partners page, each company site. Notes: Prisma, SageOx and TestMu AI About rest on their own sites only, and give no location (their speakers' countries are not the company's); KPMG and VTEX carry Web Summit's "Portugal". Pending SA23 confirmation: SA23 is applied in every company file.
- state: ok; done: 13 in review, 1 skipped; next: writing run 05:57 UTC; ask: none; run: scheduled

## Mon 9 Nov 2026, 02:55 UTC (one-off overnight fix-only round, OVERNIGHT-9NOV)

- iTRecruiter and Prisma revised after the reviewer's notes and pushed status: in-review, For: reviewer@PrompTugal.vicky; rows "in review". iTRecruiter: now cites the working Web Summit page (titled iTRTech Group, GROWTH, AI and machine learning, Portugal) and says the group is listed in its place; the slugged page returns not found. Prisma: second session added, "We are all developers now", 12 Nov 12:00 to 12:45, Developer Lounge, from its own session page. All sources re-read 9 Nov.
- state: ok; done: 2 fixes in review; next: writing run 05:57 UTC; ask: none; run: scheduled

## Mon 9 Nov 2026, 06:10 UTC (scheduled run)

- Draft S31, "Beyond Lisbon: where Road 2 Web Summit's 78 startups come from" (546 words, cover chart S31-places-2026-11-09.svg checked at 390 px), pushed For: reviewer@PrompTugal.vicky. Sources read 9 Nov: Startup Portugal's R2WS Startup Booklet 2026 (PDF; 78 startups, the place counts match Portugal Startup News exactly: Lisbon 41, Porto 11, Braga 9, Aveiro 4, Azores, Madeira and Leiria 2 each, seven places 1 each), Startup Portugal's programme page (78, 24 sectors, 14 places), Portugal Startup News (8 Nov). Not known: the pitch sessions' day and stage. S32 (Connections: Portugal) left to journalist-connections. Applied SA23: added to my prompts file.
- state: ok; done: S31 drafted; next: fix-only run 07:02 UTC; ask: none; run: scheduled

## Mon 9 Nov 2026, 11:05 UTC (scheduled run)

- state: idle (applied SA26: added to my prompts file; my company files all rest on the company's own site or its Web Summit page, none on Wikipedia; run: scheduled)

## Mon 9 Nov 2026, 15:15 UTC (scheduled run)

- Draft S34, "Where to find Portugal at Web Summit: Pavilion 1, stand E145" (397 words, a short news piece rather than a full guide: the sources are thin; cover card checked at 390 px), pushed For: reviewer@PrompTugal.vicky. Sources read 9 Nov: AICEP's release of 9 Nov (stand, teams, the chair's quote) and Tek Notícias of 14 Aug (Road 2 startups' extra space on the Portugal stand). Not known: the stand's programme, opening hours, which startups exhibit when. SA28 read (for programme, researcher, curator; nothing for me to change).
- state: ok; done: S34 drafted; next: fix-only run 16:02 UTC; ask: none; run: scheduled

## Mon 9 Nov 2026, 19:15 UTC (scheduled run)

- Draft S36, "Portugal on the programme: a masterclass, a meetup and three announcements" (cover card of the five times, checked at 390 px), pushed For: reviewer@PrompTugal.vicky. Sources read 9 Nov: the five Web Summit session pages (times, rooms, speakers as listed) and AICEP's release (the stand). Not known: what the press conferences will announce; who may attend the two not marked "media event only"; Hub71 and Q Branch not read at their own pages.
- state: ok; done: S36 drafted; next: fix-only run 20:02 UTC; ask: none; run: scheduled

## Mon 9 Nov 2026, 20:10 UTC (fix-only run)

- S36 fixed after its review (Fix first): all three press conferences are "Media event only" (re-read 9 Nov: the Discord and scaleups pages carry it on a second line of their description, which my extraction cut off); In short, the Discord paragraph and the limits corrected; the three event pages on the site linked. Status back to draft, For: reviewer@PrompTugal.vicky.
- state: ok; done: S36 revised; next: writing run 10 Nov 05:57 UTC; ask: none; run: scheduled

## Wed 11 Nov 2026, 19:15 UTC (RULES-11NOV confirmation wake, team account)

- confirmed RULES-11NOV: no machine reads of websummit.com, Luma, Meetup or Eventbrite; checked tools, scripts, notes and wake prompt; removed: from my session scratchpad, a parser for Web Summit page data (nd.py), the company-batch generator scripts that wrote Web Summit links, and 46 saved Web Summit pages from the 8 to 9 Nov company batches and S36 (my own files only; nothing in the repositories changed); the role's notes, leads and hand-overs in the newsroom already carried no read step; RULES-11NOV written into both scheduled task prompts (both stay disabled); key: journalist-portugal-vicky-promptugal-c (signing sha256:794aa3e9ad59c7de), the -b entry marked superseded at 19:13 UTC, for conductor@PrompTugal.dinis to re-issue the lane.
- Ten wakes of 10 and 11 Nov (writing and fix-only) reached this session only now, up to 37 hours late, while both tasks were disabled; none was acted on.
- state: ok; done: RULES-11NOV confirmed, fresh key; next: wait for work from the conductor or Vicky; ask: none; run: scheduled

## Thu 12 Nov 2026, 08:15 UTC (scheduled run)

- Draft S59, "Discord opens its first engineering hub outside San Francisco, in Lisbon" (587 words, cover card checked at 390 px, main image under "The story"), pushed For: reviewer@PrompTugal.vicky. No machine read of websummit.com: sources read 12 Nov are Discord's own job posting (General Catalyst's board), Observador (6 Nov), Tek Notícias and DN (11 Nov) and Devs.com.pt (19 Oct). Not known: the hub's address, opening date and budget; what the city or Unicorn Factory Lisboa will do for it; the press release itself (not read). Categories for the curator: Portugal and Corporate.
- applied SA35-WS and SA43-ONDEMAND (both in my prompts file; I leave my two disabled-on-Friday tasks to the conductor, as SA43 says).
- Noticed: S36 (my draft, with the Discord press conference) lists it for Wednesday 11 Nov, the day the summit closed for weather; its "What this does not claim" already says what is announced is not known, but its times may now be stale. Reviewer to judge.
- state: ok; done: S59 drafted, SA35-WS and SA43-ONDEMAND applied; next: on demand from Friday (conductor's task files); ask: none; run: scheduled

## Thu 12 Nov 2026, 12:05 UTC (scheduled run)

- state: idle (S59 is already published; no Portugal storyline without a draft; no Fix first on my drafts; task files for Friday exist in people/vicky/tasks/ but wait for the conductor to point me to them; run: scheduled)

## Thu 12 Nov 2026, 16:05 UTC (scheduled run)

- state: idle (the curator's map is unchanged since 11:38 UTC; no Portugal storyline without a draft; no Fix first on my drafts; no new decisions entries; run: scheduled)

## Thu 12 Nov 2026, 20:05 UTC (scheduled run)

- state: idle (the curator's map is unchanged since 11:38 UTC; no Portugal storyline without a draft; no Fix first on my drafts; standing answer 51 is for researcher, curator and the conductor; run: scheduled)

## Fri 13 Nov 2026, 17:25 UTC (task 2026-11-13-about-claims, step 2, prompted by the conductor)

- My part of ws-only-claims.json: 34 files, 66 claims. 23 re-sourced to another source I read on 13 Nov (company sites, press, the companies' own releases), several only in part, so those lines say only what the source says (a day or time dropped where the source gives none; EasyDMARC's own release gives 15:35 to 16:00 for its panel, not the 15:25 to 15:50 listed before); 43 cut. The inline location clauses that rested only on Web Summit (a Canadian company (1), based in Hungary according to Web Summit (1)) removed too. All 34 files set to status: fix, commit f89ae2aee in the newsroom, For: reviewer@PrompTugal.vicky; gate OK.
- Correction to that commit message, which said 5 files have an empty About and an empty At Web Summit section: only akamai has both empty (its site answers a plain read with 403, and no other source was found); 27 of the 34 files have an empty "At Web Summit 2026" section; 7 keep one or more lines there. The reviewer can skip akamai.
- Method: four read-only research sub-agents found candidate sources (told never to touch websummit.com, Luma, Meetup or Eventbrite); I re-fetched every returned page and checked each quote at the page (18 passed, 2 partly, 7 failed; the 7 failures mostly pages my fetch cannot read, which I did not use); two sources I could not open myself (Manila Times, CNBC) were not used; Elevon's agenda for Emergence AI was not used (a third party's guide built from the same schedule).
- Not done: the other two journalists' parts; dev's three-part split is by file name, so some files in my part were written by journalist@, journalist-europe@ and journalist-connections@ (their authors stay as they were).
- state: ok; done: About check, my 34 files, in review; next: on demand; ask: none; run: prompted

## Fri 13 Nov 2026, 18:10 UTC (task 2026-11-13-1715-s61-humanos, prompted by the conductor)

- Draft S61, "Humanos wins Road 2 Web Summit's top prize, 15,000 euros" (631 words, cover card under "The story", checked at 390 px), pushed For: reviewer@PrompTugal.vicky, commit d6d05e936. Sources read 13 Nov: Tek Notícias (the curator's), Jornal Económico, JM Madeira and PCGuia for the prize, Portugal Startup News relaying Sifted (28 Sep) and Humanos's own site for what it builds. No machine read of websummit.com, Luma, Meetup or Eventbrite.
- Where Humanos is based, as asked: four press reports say created in Madeira; Sifted via Portugal Startup News says Lisbon-based; its own site is signed "Humanos Labs, Inc." with no country; our published article S29 (who-builds-the-parts-of-an-ai-agent) says "from the United States" from Web Summit's listing, while S31 says Madeira from Startup Portugal's booklet. For the reviewer: S29 may need a correction (not my file; I left it).
- Not confirmed: the 350-organisation figure and the 3.2 million dollar round (the company's, via Sifted and the press); the prize details from Startup Portugal's or Galp's own release (not found).
- state: ok; done: S61 drafted; next: on demand; ask: none; run: prompted

## Sat 14 Nov 2026, 10:20 UTC (task 2026-11-14-1015-cleanup-journalist-portugal, prompted by the conductor)

- applied CLEANUP-14NOV: in my prompts file, P1 replaced by the widened text of standing answer 16; RULES-11NOV rule 5 now standing answer 31's new rule 5 (lisbontechfringe.com only) and rule 7 its "Retired 14 Nov" line; the schedule paragraphs (SCHED-WS, the fix-only task's times) and the whole fix-only task section (standing answer 18) taken out; the scheduled task's copy now also carries its line 0 (RULES-11NOV), which the file lacked. Everything else word for word. No line said publishing waits for Vicky's word (my startup prompt's "you never publish or sign an article" is my role and stays) and none said never message another session.
- Scheduled prompt: changed (trig_01R4SDnvm1qg6LrQVcmCRPaH: widened P1, and line 0 now names lisbontechfringe.com only; still disabled). Could not apply: the fix-only task (trig_015W8aURM2zEyH9Sd9gJvzNx) rests only on archived standing answer 18; I left its prompt as it is (disabled) because the task is the conductor's to remove; I cannot delete it from here.
- Ledger (SA54-LEDGER): added "prompts update", and, because I had missed it since 12 Nov, the one-off "session total so far" line.
- state: ok; done: CLEANUP-14NOV applied; next: on demand; ask: none; run: prompted

## Sat 14 Nov 2026, 10:50 UTC (task 2026-11-14-1055-prompts-short-journalist-portugal, prompted by the conductor)

- applied PROMPTS-SHORT: in my prompts file, the RULES-11NOV block and the copied standing answers 23, 26, 35 and 43 are replaced by the one-line pointer to decisions.md; kept: my role line, my startup prompt, my scheduled prompt as stored (with its P1 to P3, standing answer 64), and the rules Vicky gave me in my own window, with their dates. 14279 to 9036 bytes. My scheduled task's prompt itself not changed.
- Kept as unsure: the "For you (journalist)" line (it names the discovery-workflow leads folder, so I judged it specific to me, but its "rule 4" and "rule 6" now point at standing answer 31 through the pointer).
- Ledger line added (task "prompts update").
- state: ok; done: PROMPTS-SHORT applied; next: on demand; ask: none; run: prompted

## Sat 14 Nov 2026, 11:10 UTC (task 2026-11-14-1105-sched-fixup-journalist-portugal, prompted by the conductor)

- Nothing to change: neither of my tasks (the writing task trig_01R4SDnvm1qg6LrQVcmCRPaH and the fix-only task trig_015W8aURM2zEyH9Sd9gJvzNx, both disabled) says the RULES-11NOV text or any rule is at the top of or in my prompts file; their line 0 already points at people/vicky/decisions.md (standing answer 31), and P2 only tells me to re-read my prompts file. The stored copy in my prompts file already matches. No ledger line (no prompts change).
- state: ok; done: scheduled-prompt fix-up checked, nothing to change; next: on demand; ask: none; run: prompted

## Sat 14 Nov 2026, 11:20 UTC (task 2026-11-14-1110-stored-ref-journalist-portugal, prompted by the conductor)

- applied STORED-REF: in my prompts file the stored copy of my writing task's prompt is replaced by one line per task (the writing task trig_01R4SDnvm1qg6LrQVcmCRPaH and the fix-only task trig_015W8aURM2zEyH9Sd9gJvzNx, both disabled), with a short dated history of changes and no prompt text. 9036 to 7319 bytes. No task changed. Ledger line added (task "prompts update").
- state: ok; done: STORED-REF applied; next: on demand; ask: none; run: prompted

## Sat 14 Nov 2026, 11:20 UTC (task 2026-11-14-1115-covers-journalist-portugal, prompted by the conductor)

- applied COVERS-14NOV: my prompts file now has a line saying I no longer make covers; each draft gets one line on what the cover could show, and the designer makes it after my Done. Ledger line added (task "prompts update").
- state: ok; done: COVERS-14NOV applied; next: on demand; ask: none; run: prompted

## Sat 14 Nov 2026, 17:40 UTC (task 2026-11-14-1730-s65-best-number-one, prompted by the conductor)

- S65 drafted: `desks/journalist-vicky/drafts/S65-best-number-one-3wx-loule.md`, newsroom commit 4287458c9. I read the three sources again today (Postal do Algarve, A Voz do Algarve, the platform's own page); the two papers count as one source (same quote, near-identical text). The launch at Web Summit and the 300 sign-ups are attributed to 3WX; no Web Summit page read; no founder name; no contact details; not called a startup or exhibitor. No cover: a cover idea is in a comment at the end of the draft for the designer. The site has no page for 3WX in the sitemap, so no internal link.
- state: ok; done: S65 drafted; next: on demand (reviewer and designer next); ask: none; run: prompted

## Mon 16 Nov 2026 (task 2026-11-16-1240-s64-s66-portugal, prompted by the conductor)

- S66 drafted: `desks/journalist-vicky/drafts/S66-neuraspace-coimbra-raises-15-6-million.md`, newsroom commit cc91f7660. AICEP and Tech.eu (one announcement), the company's own page (who decides: an operator picks from suggested manoeuvres) and the investor's 2022 post (22 percent claim kept only in "does not claim"). Every figure attributed. AI connection in the Notes for the reviewer block (direct, 0 steps).
- S64 drafted: `desks/journalist-vicky/drafts/S64-amalia-and-ania-portugal-ai-plans.md`, newsroom commit a3a7eaf26. Seven sources re-read today. AMALIA not linked to ANIA; researcher counts 80 (INESC-ID) and about 60 (NOVA FCT, the government explainer) both given; no ANIA budget; the explainer says multimodal but the model page read describes text only, stated as unclear. AI connection written by me: direct, 0 steps, Portugal. INESC-ID and ANIA pages show no confirmed publication date, so none is given.
- Both: terms explained at first use (SA90), no repetition (SA89), no cover (a cover idea in the notes). Applied the PrompTugal test note (SA81), SA89, SA90 and SA91 as written.
- state: ok; done: S64 and S66 drafted; next: on demand (reviewer next); ask: none; run: prompted

## Mon 16 Nov 2026, evening (task 2026-11-16-2050-s67-portugal, prompted by the conductor)

- S67 drafted: `desks/journalist-vicky/drafts/S67-center-for-responsible-ai-money-partners-goals.md`, newsroom commit 7200bd372. Three sources re-read today. The State's 51.49 and 45.67 million euros and the programme's 77.7 million euros are given each with its source, not related. Goals stated as aims; no outcome after 30 June 2026 claimed, no delay or failure suggested. Named only Sword Health, INESC-ID and Unbabel; the 2024 founder by role, no name; the retailer in the interview left out. AI connection in the Notes for the reviewer block (direct, 0 steps). Terms explained, no repetition, no cover (idea in the notes), about 590 words.
- state: ok; done: S67 drafted; next: on demand (reviewer next); ask: none; run: prompted

## Mon 16 Nov 2026, night (task 2026-11-16-2110-s67-fix, prompted by the conductor)

- S67 fixed after the reviewer's Fix first, newsroom commit 296f331c5. I re-read the State's portal: it lists IAPMEI as intermediate beneficiary and 20 beneficiaries (Unbabel 14.83, Sword Health 9.26, Priberam 3.48, INESC-ID 3.17 million euros assigned), more behind "see more". The draft now calls INESC-ID one beneficiary and its PDF "INESC-ID's sheet", gives the four largest, says "world leader" and "lists five, among others" as the sheet does, attributes the 18 products to Diário de Notícias, cuts the closing line, tags in comma form. My error: I had read the PDF's "beneficiary" line as the programme's and did not open the portal's Beneficiaries tab.
- state: ok; done: S67 fixed; next: on demand (reviewer re-check); ask: none; run: prompted

## Tue 17 Nov 2026 (task 2026-11-17-0850-s68, prompted by the conductor)

- S68 drafted as an update note for the published S67: `desks/journalist-vicky/drafts/S68-center-for-responsible-ai-chief-executive-status-update.md`, newsroom commit 354fd09dc. The curator's note names the Portugal desk, so I drafted it. Source re-read today (Dinheiro Vivo / Diário de Notícias, 18 July 2026). Every figure and example is the chief executive's as the newspaper reports it; the Unbabel collapse and the August 2025 purchase are the newspaper's words; no independent check found; the 49 and 27 million euros are not reconciled with S67's 51.49 and 77.7. The chief executive is not named. One point for the reviewer: the 2026 page gives the chief executive the same name as the 2024 founder whom S67 gives by role as working at Unbabel; S67 does not say they are one person.
- state: ok; done: S68 drafted; next: on demand (reviewer next); ask: none; run: prompted

## Tue 17 Nov 2026, evening (task 2026-11-17-2050-s69, prompted by the conductor)

- S69 drafted: `desks/journalist-vicky/drafts/S69-ai-physiotherapy-portugal-health-service.md`, newsroom commit 01b5815b7. The curator's note names the Portugal desk. Both sources re-read today (the government's item and Observador). The 97 and 45 percent figures are called estimates (Observador attributes them to the company), the 200 euros is Observador's report of Sword, the page's inconsistent dates (19 June, updated 24 June, text 18 June, caption 18 May) are said once in "does not claim"; "from next week" is quoted as the page said it; the two-years-to-ten-days claim is not confirmed and no link to the Center is made beyond a pointer to the update. Ministers by office, no names beyond the companies. AI connection in the Notes for the reviewer (direct, 0 steps). About 570 words.
- state: ok; done: S69 drafted; next: on demand (reviewer next); ask: none; run: prompted

## Wed 18 Nov 2026 (task 2026-11-18-0855-s70, prompted by the conductor)

- S70 drafted as an update note: `desks/journalist-vicky/drafts/S70-sao-joao-2023-pilot-update.md`, newsroom commit a0f3bfa8f. I read the whole RTP/Lusa page (21 December 2023). Intro line plus a short list per STYLE.md "Update notes"; attributed to the report; no results, no wait-time figure; the pilot not said to have become the 2026 service; the report's platform not said to use AI; the doctors quoted by RTP not named. One thing for the conductor and reviewer: the curator's commission names S69 as the article to update and your task text names S67. I followed the curator (the file says `updates: ai-physiotherapy-portugal-health-service`) and the note links to S67, so it fits either. AI connection: one step. A word-count correction followed in a second commit.
- state: ok; done: S70 drafted; next: on demand (reviewer next); ask: none; run: prompted

## Wed 18 Nov 2026, evening (task 2026-11-18-2050-s71, prompted by the conductor)

- S71 drafted as an update note for S69: `desks/journalist-vicky/drafts/S71-two-years-to-ten-days-who-said-it-update.md`, newsroom commit 186613073. I read the whole DNOTICIAS page (18 June 2026). Two points: the nine units, and the waiting-time figure, which the report attributes to the Cova da Beira board president while our update on S67 gave it as the Center chief executive's claim about a Porto hospital. Said once at the end that the accounts differ and neither was checked, no side taken. The board president, the company founder and the patient are not named. draft_lint.py: 0 errors, 0 warnings. A suggested one-clause pointer for S67's update is in the notes for the reviewer to decide. AI connection: direct, 0 steps.
- state: ok; done: S71 drafted; next: on demand (reviewer next); ask: none; run: prompted

## Thu 19 Nov 2026 (tasks 2026-11-19-0850-s73 and 2026-11-19-0850-s72, prompted by the conductor)

- S73 drafted: `desks/journalist-vicky/drafts/S73-superhuman-to-buy-rows-porto.md`, newsroom commit 3b45ab8b0. Both company posts re-read today; everything attributed to the company that says it; no founder names; no price, headcount or Porto plan inferred; the way the company came to our attention is not mentioned. One new finding for the reviewer and the curator: Rows' own page, read today, now begins with the line "Rows joined Superhuman" (undated). The curator's note says the sources do not state whether the deal closed. I used the line as an undated company statement, not as proof, and said so in the draft and the notes. The support contact next to it is left out. AI connection: direct, 0 steps. draft_lint.py: 0 errors, 0 warnings.
- S72 drafted as an update note for S69: `desks/journalist-vicky/drafts/S72-remote-physiotherapy-open-to-any-provider-update.md`, newsroom commit 0830e1c44. I read the gazette notice and clauses 1 to 5 myself (the file is the whole 587-page issue) and the letter as an unchecked copy. Not read: annexes, eligible conditions, prices. No claim that Sword Health is the only provider or that others joined. One point for the reviewer: clause 4(5)(b) on effective human oversight reads as applying to every device and platform, not only to AI ones, and the note says so as worded. AI connection: one step. draft_lint.py: 0 errors, 0 warnings.
- state: ok; done: S73 and S72 drafted; next: on demand (reviewer next); ask: none; run: prompted

## Thu 19 Nov 2026, evening (tasks 2026-11-19-2050-s74 and 2026-11-19-2050-s75, prompted by the conductor)

- S74 drafted as the first update note on S73: `desks/journalist-vicky/drafts/S74-rows-team-in-the-north-stays-update.md`, newsroom commit f36434208. I read the whole ECO article. Attributed to ECO (the "stays" sentence has no named speaker, so the note does not give it to anyone); the value, headcount and funding are ECO's; no names. Two lines of S73 no longer hold ("no independent report", "no headcount"): the note says so in its intro and the notes for the reviewer suggest editing them in the body. Closing still not confirmed by a later source. draft_lint.py: 0 errors, 0 warnings.
- S75 drafted as a follow-up article to S69 (not a note): `desks/journalist-vicky/drafts/S75-health-service-pays-remote-physiotherapy.md`, newsroom commit 34b073121. I read the gazette terms and the price order myself, in the parts the commission names (and clauses 4 to 8 inside 1 to 12); nothing from clauses 14 to 18, 24, 25 or annexes I and II. 200 euros for 12 months per treated patient and 100 euros for a later programme, from annex IV and the order (the order prints no currency, the terms give euros); the seven groups of conditions from annex III in plain words; provider duties; the AI rules as conditional, with clause 21 (the health service doctor validates, human assessment prevails). One thing worth a look: the terms' conditions list is wider than the musculoskeletal ones the government named at launch, which the article says once. The line for the top of S69 is in the notes. AI connection: one step. draft_lint.py: 0 errors, 0 warnings.
- state: ok; done: S74 and S75 drafted; next: on demand (reviewer next); ask: none; run: prompted

## Fri 20 Nov 2026 (task 2026-11-20-0850-s76, prompted by the conductor)

- S76 drafted as the first update note on S75: `desks/journalist-vicky/drafts/S76-patients-can-pick-their-provider-update.md`, newsroom commit 5d5e9535e. I read the notice and clauses 1 to 31 of the gazette myself (annexes I and II not read, nothing said from them). Five points under "The gazette says": free choice of provider and the price conditions, admission documents and automatic exclusion, audits and statistics, the data and portability rules, ending on 60 days' notice after six months. One wording care: clause 16 speaks of "price conditions" for patients holding a valid MCDT requisition, so I did not write "patients pay nothing extra"; the free-to-patients claim stays the government's. No claim that any provider has joined. AI connection: one step. draft_lint.py: 0 errors, 0 warnings.
- state: ok; done: S76 drafted; next: on demand (reviewer next); ask: none; run: prompted

## Sat 28 Nov 2026 (task 2026-11-28-0750-s88 from the curator, standing answer 101)

- S88 drafted as the first update note on S64: `desks/journalist-vicky/drafts/S88-amalia-second-phase-update.md`, newsroom commit dd54c3504. I read the whole ECO article (15 September 2026). Everything is ECO's report of a government statement and a resolution I did not read, and the note says so; it is a development S64 did not cover and not news since; no adoption figures; the 7.3 and 5.5 million euro figures are not reconciled; no names. About 300 words (longer than a short update, flagged for the reviewer). AI connection: direct, 0 steps. draft_lint.py: 0 errors, 0 warnings.
- Passed to the reviewer under standing answer 102: task file `people/vicky/tasks/2026-11-28-0805-review-s88.md`.
- The newsroom release gate was red locally at first for two reasons on this machine, not in the draft: `ssh-keygen` was missing (I installed `openssh-client` with apt) and the clone was shallow (`git fetch --unshallow`). Both fixed, the gate passed, nothing pushed while it was red. A fresh session of mine may need the same two steps; the environment's setup script could install `openssh-client`.
- state: ok; done: S88 drafted and passed to the reviewer; next: on demand; ask: Dinis: the setup script could install openssh-client so the newsroom gate runs in a new session; run: prompted
