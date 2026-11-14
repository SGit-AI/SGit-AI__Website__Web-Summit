# journalist-ai@web-summit.vicky: reports

Vicky's AI and robotics journalist for the Web Summit 2026 newsroom (the technology itself, AI companies and robots at the summit): turns the curator's story candidates on that beat into drafts in desks/journalist-vicky/drafts/ of the newsroom repository, one story at a time when Vicky asks. One short line per piece of work.

## Thu 5 Nov 2026, 20:55 UTC (set-up and S15)

- Session key made and published as journalist-ai-vicky in data/keys.json (signing sha256:c173f1bc39a2ab0d, encryption sha256:96301f62bfbdb04c); pki-agent.mjs matched the sha256 pinned in admin/tools/seal.mjs.
- Draft S15, "Following robotics at Web Summit: from the lineup to Técnico's stand": desks/journalist-vicky/drafts/S15-following-robotics-at-web-summit.md in the newsroom repository (newsroom v0.1.25), status draft, for newsroom@web-summit.dinis.
- Sources, all read 5 Nov at their own addresses: Web Summit's speakers page and the speaker pages for Agibot A3, Galbot G1 and Li Chen (Unitree); Web Summit's schedule; Técnico's announcement (29 Oct, updated 3 Nov).
- Not confirmed: when or on which stage the robots and Li Chen appear (not on the public pages); speakers beyond the first 20 the page shows; the quadruped's model ("Unitree G02" per Técnico). The stage-to-stand link is a suggestion; no source says anyone will meet.

## Fri 6 Nov 2026 (WS-177: S12, not written)

- S12, "A robot among 800 speakers", not drafted: its two sources (Web Summit's speakers page, re-read 6 Nov, the same 20 names as on 5 Nov; Técnico's announcement) are the ones S15 already uses, and its angle (800 speakers, robots listed as speakers) is S15's lead. Told Vicky. An AI-companies angle would need new sources beyond names and job titles.
- Newsroom copy now points at PrompTugal/PrompTugal__News__Website (dev). Prompts and standing rules saved in people/vicky/prompts/journalist-ai.md.

## Fri 6 Nov 2026, 10:55 UTC (rename and schedule)

- Renamed journalist-ai@PrompTugal.vicky (Dinis's new names). The same session key is now also in the newsroom's board/keys.json as journalist-ai-vicky-promptugal (signing sha256:c173f1bc39a2ab0d), newsroom v0.1.219.
- Scheduled task created: daily at 08:00 and 16:00 UTC, the prompt Vicky gave, saved in people/vicky/prompts/journalist-ai.md.
- Found the newsroom remote back on the old SGit-AI address after a session restart; pointed it at PrompTugal/PrompTugal__News__Website before pushing. I check it before every push.

## Fri 6 Nov 2026, 16:10 UTC (scheduled run)

- No hold. No new storyline on my beat: S20 to S23 are Portugal and Connections: Portugal; S12 stays skipped (repeats S15). No draft written.
- Applied P1 (hold check), P2 (re-read my prompts file; it matches), P3 (status block), P5 (my task moved to 08:18 and 16:18 UTC, `18 8,16 * * *`, noted in my prompts file), P10 (noted). P9: `~/.abp/log/` does not exist; I was not shown "ABP (Agent Behaviour Policy) re-anchored" at my last start.
- The newsroom remote was back on the old SGit-AI address after a restart; reset to PrompTugal before pulling. Nothing was pushed there.
- decisions.md: every commit to it is subject-named conductor@web-summit.vicky; I can't see from git which account pushed them.
- state: ok; done: updates applied, no new beat material; next: S-candidates on AI or robotics when the curator adds them; ask: none; run: scheduled

## Fri 6 Nov 2026, 16:20 UTC (scheduled run)

- state: idle

## Fri 6 Nov 2026, about 21:00 UTC (team series, article 1 of 5)

- Draft T1, "Angelo's communication graph: watch our agents talk": desks/journalist-vicky/drafts/t1-angelos-communication-graph.md in the newsroom (pushed f25da575, dev), status draft, For: journalist@PrompTugal.dinis. 616 words.
- Sources, read 6 Nov: Angelo's command centre (#collab?map=1 and #replay) and its data.json (v0.2.862, built 20:26 UTC); people/angelo/tools/team-map.mjs and people/angelo/app/replay.js on the team site; security@PrompTugal.dinis's "What our agents say to each other, counted".
- Not confirmed or left out: that Dinis asked for the graph to be shown (said at the stand-up, no public source); the map's figures move with each release (6 people, 111 agents, 2,915 "For:" lines when read); its "104 PrompTugal" count looks inconsistent with 111 agents, so not quoted. People listed as left out of the map are not named.
- Fixed my own mistake: the file was first named T1-..., and the newsroom gate failed (api/v1/graph/whole.json: a story's source path must be lower case; curator stories take the curator file's path, a non-curator draft its own). Renamed to t1-...; gate green. For dev@PrompTugal.dinis: the graph could lower-case or map non-curator drafts' paths, since STYLE.md names drafts S<n>-....
- state: ok; done: T1 drafted and pushed; next: article 2, who does the work, when Vicky asks; ask: none; run: prompted

## Fri 6 Nov 2026, about 21:15 UTC (T1 screenshots)

- T1 now has two screenshots, taken in my session's browser from the live pages (team site v0.2.871/v0.2.872): the team map ("People ring", full-screen mode, 800 px, WebP 68 KB) and Replay (last 24 hours, phone layout, one row per person, 869 px, WebP 27 KB). In desks/journalist-vicky/drafts/img/, linked by their promptugal.news address as the published articles do; captions link the live views and credit Angelo; short alt text. Newsroom v0.1.343, gate green.
- Note: the map is drawn on a dark background (the page's dark theme in my browser); there is no light version.
- state: ok; done: T1 screenshots; next: article 2 when Vicky asks; ask: none; run: prompted

## Fri 6 Nov 2026, about 22:00 UTC (team series, articles 2 to 5; T1 caption links)

- T1: "Open the live map →" and "Open the live replay →" added after the captions (newsroom v0.1.343).
- T2, "Who does the work: six people and their 93 agents" (594 words, v0.1.344). Counted from data/keys.json (team site) and board/keys.json (newsroom), leaving out superseded, retired and ended keys, one agent per key fingerprint or exact name; checked against each person's agents.json (Vicky 18, Indi 10 and Silvio 9 match their running agents exactly; Dinis's 27 newsroom keys match the newsroom's CLAUDE.md). Grouping by job is mine, from the agents' names. Not confirmed: that every keyed agent is running now (keys without a status may belong to stopped sessions).
- T3, "How our agents talk: commits, inboxes and signed keys" (591 words, v0.1.345). Sources: both CLAUDE.md files, WS-129, board/tools/agent_inboxes.py, board/keys.json, one of my commits as the example; links to security@'s article rather than repeating it.
- T4, "Many agents, one newsroom: how they avoid collisions" (622 words, v0.1.346). Sources: /how-we-publish/, both CLAUDE.md files, board/schedule.json, decisions.md, release.sh, STYLE.md. ABP mentioned in one line only; Angelo's article to be linked when live.
- T5, "Three mistakes our agents made, and the rules they left" (619 words, v0.1.347). Sources: the curator's dropped list and commit, the reviewer's and dev@PrompTugal.vicky's link commits, STYLE.md's rule commit, the agents' reports here, decisions.md. Careful: S9 was reworked by Dinis's journalist from Vicky's first version, not written twice independently; written that way.
- Cross-links between T1 to T5 wait until they are live (none is published yet).
- state: ok; done: T2 to T5 drafted and pushed; next: cross-links once the series is live, and Angelo's ABP article link; ask: none; run: prompted

## Fri 6 Nov 2026, about 22:30 UTC (T1 review; closing line on T1 to T5)

- T1, reviewer@PrompTugal.vicky's Fix first, all four points fixed as the review suggested (the hubs bullet; one line per pair over seven days; the commit card with a GitHub link; "from Angelo's command centre" in both captions), plus its two small wording points ("a bigger round dot", "another of our pages"). The "ask him for a tour" line is gone with the new closing line. 697 words. Status left at `fix` for the reviewer to re-check.
- T1 to T5 now end with Vicky's closing line (booth A1-30, Pavilion 1, Thursday 12 November), sourced in a "Who made this" section to the team site's /summit/ page, read 6 Nov, at Vicky's word (STYLE.md otherwise leaves that section to the publisher). T5's last paragraph was not a closing line, so the new line follows it. T2's table no longer names RiskMandate in Dinis's role. Newsroom v0.1.353.
- For Vicky: the newsroom's outreach desk notes that booth A1-30 is RiskMandate's and asks Dinis whether PrompTugal.news should invite people to it (desks/outreach/README.md). The closing line does that.
- state: ok; done: T1 fixes and closing lines pushed; next: cross-links once live; ask: is the booth invitation agreed with Dinis? (recommend: confirm with him before publishing); run: prompted

## Fri 6 Nov 2026, about 22:45 UTC (closing line names RiskMandate)

- T1 to T5: the closing line now names the RiskMandate booth (A1-30, Pavilion 1, Thursday 12 November), at Vicky's word from Dinis; same source in "Who made this" (the team site's /summit/). T2's table: "Operator: RiskMandate, the strategy" again. Newsroom v0.1.354. This answers my earlier ask about the booth invitation.
- The newsroom remote was on the old SGit-AI address again after a restart; reset before pulling; nothing pushed there.
- state: ok; done: closing lines updated; next: cross-links once live; ask: none; run: prompted

## Fri 6 Nov 2026, about 23:00 UTC (reviews: T2 to T5 fixed; T1 trimmed)

- T2 to T5: reviewer@PrompTugal.vicky's Fix-first points fixed as suggested (T2: how the 93 were counted, Vicky's list matches exactly and Indi's and Silvio's in total, helpers without keys, names instead of pronouns; T3: Angelo's own words, "is to check" a signature; T4: checking runs one way, newsroom helpers' own branches, my report added as the gate source, names; T5: summary and In short as the record shows, "published articles", the S12 skip under the older check-first line, names). Most small points taken too (S9 "rewritten, crediting", the 08:00 and 16:00 wakes, the prompts files and the commit's full subject as sources, "research, write and check").
- Not changed, with reasons: the closing line's source stays in "Who made this", as Vicky asked; the reviewer's other closing-line points are settled by Dinis's wording (it names the RiskMandate booth). The reviewer notes the booth details on /summit/ come from a non-public Web Summit email; that is Vicky's and Dinis's call.
- T4: "Angelo is writing a separate article" cut (no public source yet); the sentence now says behaviour policies are "a story of their own". I'll link Angelo's article when it is live.
- T5: "three that Vicky Wang asked about" dropped, at Vicky's word. T1: "Open the map view." and "Open Replay." removed.
- Statuses left as the reviewer set them (T1 ready, T2 to T5 fix). Newsroom v0.1.359.
- The newsroom remote was on the old SGit-AI address again; reset before pulling; nothing pushed there.
- state: ok; done: review fixes pushed; next: re-review by the reviewer, cross-links once live; ask: none; run: prompted

## Fri 6 Nov 2026, about 23:40 UTC (images for T2, T4, T5)

- One commit (newsroom v0.1.360): T2, a bar chart of agents per person (SVG, 3 KB, from both key lists); T4, the minute each newsroom agent wakes within the hour (SVG, 9 KB, from board/schedule.json, read late on 6 Nov, when many tasks were paused, shown in grey); T5, Road 2 Web Summit's sources before and after the link fix (WebP, 87 KB: the page built locally from the commit before cf2ed858, v0.1.316, and the live page, v0.1.358). Site colours, with a dark variant in the SVGs. Short alt text and a one-line caption with source and date under each. Public sources only; no contact details, vault contents or usage figures.
- state: ok; done: three images; next: re-review, cross-links once live; ask: none; run: prompted

## Fri 6 Nov 2026, about 23:55 UTC (T4 chart redrawn; phone check)

- T4's chart redrawn at Vicky's word: one row per agent, sorted by wake minute, the minute first; Vicky's five journalists, reviewer, checker and curator (people/vicky/schedule.json) and four of Dinis's agents as examples (security :03, dev :08, observability :18, conductor :52, board/schedule.json); caption says so, source added. T2's chart redrawn 420 wide so its text reads on a phone. Checked at phone width (343 to 375 px): measured every label in both SVGs, none overlaps or leaves the image; T5's image reads cleanly. Newsroom v0.1.361 (released; the deploy was still queued after 6 minutes).
- state: ok; done: charts fixed; next: re-review, cross-links once live; ask: none; run: prompted

## Sat 7 Nov 2026, about 00:20 UTC (T4's chart redrawn again)

- T4's chart now shows ten of Dinis's newsroom agents that wake every hour at their own minute (:04 to :52), one row per agent, from board/schedule.json as it stood from 05:36 to 21:20 UTC on 6 November (17 agents hourly then; at 21:20 most were paused or moved to every two hours, so the source is linked at that version). Caption as Vicky gave it, plus source and date. The journalists' staggered times stay a sentence in the text. Phone check: no label overlaps or leaves the image. 694 words; the paragraph's own ":08, :18, :52" examples cut, as the chart shows them. Newsroom v0.1.363.
- The earlier caption change ("Scheduled wakes only...") was stopped by Vicky before it was pushed; it never went out.
- state: ok; done: T4 chart; next: re-review, cross-links once live; ask: none; run: prompted

## Sat 7 Nov 2026, 08:20 UTC (scheduled run)

- No hold. Nothing new on my beat (the only new storyline, S24, is the summit beat and already drafted). Applied P22 (I never use the Gmail connector) and P27 (no prompt text in reports; my prompts file holds no private name). Newsroom remote was on the old SGit-AI address again; reset before pulling; nothing pushed there.
- state: idle; done: checks only; next: the T series' re-review and cross-links once live; ask: none; run: scheduled

## Sat 7 Nov 2026, about 12:30 UTC (S25)

- Draft S25, "The sign-in: how editors and agents prove who they are": desks/journalist-vicky/drafts/s25-the-sign-in.md in the newsroom, status draft, For: reviewer@PrompTugal.vicky. 644 words.
- One source, read 7 Nov at its own address: the newsroom's note "The sign-in: a key in a QR code, and what it is for" (dev@PrompTugal.dinis, 6 Nov). The note's limit (the conductor keeps a copy of each private key it issues) is in the same "In short" bullet and the same paragraph as the benefit.
- Image: a six-step diagram of my own (SVG, 5 KB) with the limit in a red box; no QR code, key, passphrase or sign-in link, in the image or the text. Checked at phone width: no overlaps.
- Not confirmed: anything beyond the note (the sign-in was not tested); the note says "five ways in" but lists six, so the draft says "several".
- state: ok; done: S25 drafted; next: review; ask: none; run: prompted

## Sat 7 Nov 2026, 16:20 UTC (scheduled run)

- No hold. decisions.md read; its new entries carry the conductor's commit title and Agent line. Prompts file re-read; it agreed with my memory, and now holds the updated scheduled prompt.
- applied SA16: P1 to P3 word for word in my prompts file and in my scheduled task's prompt. applied SCHED-7NOV: my task now runs at 08:18, 12:18 and 20:18 UTC. applied SA15: every draft from now has an image wired for the cover (T1 to T5 and S25 already have one). SA13: no draft of mine is open; T1 to T5 and S25 are published, and their reviews' "Fix first" dates from before the fixes.
- Nothing new on my beat (S25 is published). The newsroom remote was on the old SGit-AI address again; reset before pulling; nothing pushed there.
- state: ok; done: SA13, SA15, SA16, SCHED-7NOV applied; next: new AI or robotics storylines; ask: none; run: scheduled

## Sat 7 Nov 2026, 20:20 UTC (scheduled run)

- No hold. decisions.md read (the revised SCHED-7NOV carries the conductor's title and Agent line); prompts file re-read, it agreed with my memory. applied SCHED-7NOV (four rounds): my task now runs at 08:18, 12:18, 16:18 and 20:18 UTC; prompts file updated. SA13: no open review of mine (T1 to T5 and S25 are published).
- Draft S26, "Two editions a day: PrompTugal.news starts a daily newsletter" (517 words, newsroom v0.1.627). Sources, read 7 Nov: the newsletter's page, its morning and evening editions, the evening email version, newsletter.json. Cover: a summary card of the two editions (SVG). Note: the page says subscribers are handled by "the Web Summit team"; the email says the newsletter is "not affiliated with Web Summit", so the draft says it is the team behind PrompTugal.news. How to subscribe is not published.
- Draft S27, "A map of Web Summit's buildings, and what each holds" (482 words, v0.1.628). Sources, read 7 Nov: the venue map page, venue-map.json, OpenStreetMap's licence page. Cover: a bar chart of the page's own session counts by building (SVG). For dev@PrompTugal.dinis: the map's building labels are about 9px at 390px wide, and "Oriente station" overlaps its outline, so I did not use a screenshot of it.
- The newsroom remote was on the old SGit-AI address again; reset before pulling; nothing pushed there.
- state: ok; done: S26 and S27 drafted, SCHED-7NOV (four rounds) applied; next: review; ask: none; run: scheduled

## Sat 7 Nov 2026, about 21:45 UTC (S27 review fixes)

- S27, reviewer@PrompTugal.vicky's two fact fixes, at Vicky's word: "the page runs no script" and "nothing is stored about the reader" replaced by what the build code says (the map itself is plain SVG drawn in advance, with no script of its own; the site's usual scripts still run, 21 script files as served, checked); "Centro Vasco de Gama" corrected to "the Vasco da Gama centre" in the text, alt text and chart label (as venue-map.json names it). The heading "Built to be safe to open" made neutral, as it leaned on the same claim. venue.mjs added as a source. Nothing else changed; status left at fix for the reviewer. Newsroom v0.1.644, For: reviewer@PrompTugal.vicky.
- For dev.venues@PrompTugal.angelo (via the reviewer's note): the venue page's own "runs no script" sentence and its "Centro Vasco de Gama" spelling overstate and misspell in the same way.
- The newsroom remote was on the old SGit-AI address again; reset before pulling; nothing pushed there. No new storyline taken.
- state: ok; done: S27 fixes; next: re-review; ask: none; run: prompted

## Sun 8 Nov 2026, 06:05 UTC (scheduled run)

- No hold. decisions.md read (the new entries carry the conductor's title and Agent line); prompts file re-read, it agreed with my memory once SCHED-WS was added.
- applied SCHED-WS: writing task trig_014T4B2EkggPSUDazhhJZ1Gf at 06:03, 11:03, 15:03, 19:03 UTC; fix-only task trig_01FpXptzb91YorA9vNLuwjUu at 07:08, 12:08, 16:08, 20:08 UTC; both match. applied REMOTE-WS: step 2 replaced word for word in both tasks (trig_014T4B2EkggPSUDazhhJZ1Gf, trig_01FpXptzb91YorA9vNLuwjUu) and in my prompts file, which now also holds the fix-only prompt. Read SA18 to SA21.
- Nothing new on my beat; S26 and S27 are published; no Fix first open. Remote set and confirmed before pulling.
- state: ok; done: SCHED-WS and REMOTE-WS applied; next: new AI or robotics storylines; ask: none; run: scheduled

## Sun 8 Nov 2026, 11:05 UTC (scheduled run)

- state: idle

## Sun 8 Nov 2026, 15:10 UTC (scheduled run)

- No hold. decisions.md read; prompts file re-read, it agreed with my memory apart from the new times, now added. applied SA22: writing at :09 past 06, 11, 15, 19 UTC (trig_014T4B2EkggPSUDazhhJZ1Gf) and fix-only at :14 past 07, 12, 16, 20 UTC (trig_01FpXptzb91YorA9vNLuwjUu), both as the conductor set them. applied SA18: the fix-only task runs as given (silent when nothing to fix). applied P17: if Vicky replaces this session, I write the hand-over note in people/vicky/handover/ first.
- Nothing new on my beat (S28 is journalist-connections', now published). Remote set and confirmed before pulling.
- state: ok; done: SA22, SA18, P17 confirmed; next: new AI or robotics storylines; ask: none; run: scheduled

## Sun 8 Nov 2026, 19:15 UTC (scheduled run)

- No hold. decisions.md and STYLE.md read; prompts file re-read, it agreed with my memory. applied HANDOFF-FIX: step 5 of my writing task (trig_014T4B2EkggPSUDazhhJZ1Gf) now ends ", For: reviewer@PrompTugal.vicky (the review hand-off).", word for word, and so does the copy in my prompts file. Added standing answer 23 to my prompts file (SA23).
- Draft S29, "Who builds the parts of an AI agent? Startups at Web Summit" (508 words, newsroom v0.1.738, For: reviewer@PrompTugal.vicky). Source, read 8 Nov: Web Summit's featured startups list (the eight on its first of 26 pages, each in its own words); links to the five existing company pages. Cover: a layered diagram (SVG), phone-checked. Not checked: the companies' own claims ("leading", "first"), attributed and flagged.
- S30 is journalist-connections' (Connections beat). Remote set and confirmed before pulling.
- state: ok; done: HANDOFF-FIX and SA23 applied, S29 drafted; next: review; ask: none; run: scheduled

## Sun 8 Nov 2026, 20:20 UTC (fix-only run: S29)

- S29 revised after the reviewer's Fix first (54a2b751): the eight descriptions and countries now cite each company's own Web Summit page (all eight opened today, each carrying the quoted words), linked from the featured list at its current address; Beyond Presence's link to agents is stated as our reading (in "In short", the story and the summary). Wording fixes as suggested (Acrab's "purpose-built chips", Polygraf's own words, the "leading/first" caveat dropped, the image's bottom layer named "The base"). Image re-checked at phone width. 538 words. Newsroom v0.1.743, For: reviewer@PrompTugal.vicky.
- state: ok; done: S29 revised; next: re-check by the reviewer; ask: none; run: scheduled

## Mon 9 Nov 2026, 00:15 UTC (OVERNIGHT-9NOV, batch A1)

- All 11 A1 companies written and pushed for review, status: in-review, in three pushes (newsroom v0.1.755, 8f0a358d, v0.1.756): cisco-outshift, datadog, deque, directus; elastic, exa, genspark, jetbrains; keewano, launchdarkly, linux-foundation-aaif. Backlog rows set "in review". Every source read 9 Nov: each company's own site for About (SA23: two or three plain sentences, claims marked, sources below) and Web Summit's own pages (appearance, event partners list, session pages with times) for "At Web Summit 2026".
- Notes for the reviewer: Genspark's own site showed a security check (403, also in a browser), so its About rests on its Web Summit page and says so. The AAIF press conference is marked "Media only" because its page says "Media event only". Cisco's Portugal Tech Week showcase was left out (a side event, not Web Summit). Deque is not on the event partners list, so only its session is listed. Speakers named by role only, as on Web Summit's pages.
- state: ok; done: batch A1, 11 of 11 in review; next: review fixes at my fix-only runs; ask: none; run: scheduled

## Mon 9 Nov 2026, 06:17 UTC (scheduled run)

- state: idle

## Mon 9 Nov 2026, 11:16 UTC (scheduled run)

- No hold. applied SA26: standing answer 26 added word for word to my prompts file. None of my 11 company pages rests on Wikipedia; Genspark's About rests on its official Web Summit page, which SA26 allows. Nothing new on my beat (S33 is the summit beat). Remote set and confirmed before pulling.
- state: ok; done: SA26 applied; next: new AI or robotics storylines; ask: none; run: scheduled

## Mon 9 Nov 2026, 15:15 UTC (scheduled run)

- state: idle

## Mon 9 Nov 2026, 19:11 UTC (scheduled run)

- state: idle

## Tue 10 Nov 2026, 01:30 UTC (OVERNIGHT-10NOV)

- No hold. decisions.md (standing answers 29 and 30) and my prompts file read. The curator assigned me one batch story, S37, not two (curator commit 201d9513: four stories in all). Draft S37, "What failed when Teamworks built an AI assistant for NFL coaches" (621 words, newsroom v0.1.932, For: reviewer@PrompTugal.vicky): from Mastra's case study only, re-read 10 Nov, with the curator's conditions met (only source said, not in production, no Teamworks or PFF source, nobody named, Mastra's Web Summit listing as context only). Cover: a five-step diagram (SVG), phone-checked. Links S29.
- state: ok; done: S37 drafted; next: fix-only at 03:01 and 04:06 if the reviewer sends it back; ask: none; run: scheduled; OVERNIGHT-10NOV

## Tue 10 Nov 2026, 03:03 UTC (OVERNIGHT-10NOV fix-only)

- S37 revised after the reviewer's Fix first: the 7,000 teams and PFF's coverage since 2006 credited to Mastra's case study (re-read today); title now "What failed first as Teamworks builds an AI assistant for coaches", since it is still being built; the featured list added as the source for "featured". 637 words. Newsroom v0.1.939, For: reviewer@PrompTugal.vicky, for the 03:35 re-check.
- state: ok; done: S37 fixed; next: re-check at 03:35; ask: none; run: scheduled; OVERNIGHT-10NOV

## Tue 10 Nov 2026, 04:07 UTC (OVERNIGHT-10NOV fix-only 2)

- state: idle

## Wed 11 Nov 2026, 19:18 UTC (RULES-11NOV confirmation wake)

- confirmed RULES-11NOV: no machine reads of websummit.com, Luma, Meetup or Eventbrite; checked tools, scripts, notes and wake prompt; removed: from this session's scratchpad, the fetch script I used for Web Summit pages (grab.py), three parsers of saved Web Summit page data (fs.py, fs8.py, fs9.py), a list of Web Summit session URLs, and 37 saved copies of websummit.com pages (company, attendee, session, partner and featured-startup pages read for S15, S29 and batch A1); my desk notes and both scheduled prompts read none of these sites (the notes only state the rules); key: journalist-ai-vicky-promptugal-2 (signing sha256:d4da9c136ca67397, encryption sha256:b8c3958efddef919), newsroom board/keys.json, v0.1.1292; journalist-ai-vicky-promptugal-b marked superseded at 19:16 UTC. Both tasks (trig_014T4B2EkggPSUDazhhJZ1Gf, trig_01FpXptzb91YorA9vNLuwjUu) now carry the rules and stay disabled.
- For the conductor: (1) ten scheduled wakes from 10 Nov 06:09 to 11 Nov 07:14 reached this session only now, after restarts; I did not replay them (the twin covered those days, and this wake says confirmation only). (2) The twin's leads file desks/journalist-vicky/leads/2026-11-11-ai.md cites three luma.com pages read at 13:45 UTC, before the Luma rule (14:40); left unchanged, but they rest on Luma reads. (3) Published work of mine (S15, S29, T1, the 11 A1 company pages) used machine reads of websummit.com before 11 Nov; per rule 3 nothing existing is changed until Dinis decides. (4) My 5 Nov key journalist-ai-vicky in the team site's data/keys.json is still marked active; left as is (the newsroom holds this role's key now).
- state: ok; done: RULES-11NOV confirmed, fresh key, wake prompts updated; next: wait for the conductor or Vicky; ask: conductor@PrompTugal.dinis to re-issue my lane to the new key (asked in the key commit); run: scheduled

## Wed 11 Nov 2026, 20:03 UTC (scheduled run)

- state: idle

## Thu 12 Nov 2026, 08:05 UTC (scheduled run)

- No hold. applied SA43-ONDEMAND: added word for word to my prompts file (plus how task files work). From Friday 13 Nov I run only when the conductor points me to a task file in people/vicky/tasks/, and reply to the conductor with the commit; the conductor disables my tasks on Friday morning. Nothing new on my beat (the curator's list has no unwritten AI and robotics storyline; S59 is Portugal). Remote set and confirmed before pulling.
- state: ok; done: SA43-ONDEMAND applied; next: wait for a task file; ask: none; run: scheduled

## Thu 12 Nov 2026, 12:25 UTC (scheduled run)

- No hold. Draft S60, "What PagerDuty says it learned running AI agents in production" (700 words, newsroom v0.1.1389, For: reviewer@PrompTugal.vicky): from PagerDuty's own engineering post (11 June 2026) and its Paige announcement (3 November 2026), both read today; the company's own account, said so; the 80 to 90 per cent injection figure attributed as research PagerDuty cites; the diagram's problem-and-fix pairings flagged as our reading; categories AI, Corporate; the main image directly under "The story" (standing answer 50). Neither source is Web Summit, Luma, Meetup or Eventbrite. Cover: a five-pair diagram (SVG), phone-checked.
- Not checked: any second source on PagerDuty's claims, as the curator noted; nothing says PagerDuty is at Web Summit, and the article does not.
- state: ok; done: S60 drafted; next: review (fix-only task at 12:14 passed; after Friday I run on task files); ask: none; run: scheduled

## 2026-11-13: About claims that only Web Summit supported (task 2026-11-13-about-claims, step 2)
Newsroom commit c4427f3be. 33 files, 53 claims. Re-sourced: 3 (Persona's two Stage 8 sessions to its events page, RWS's keynote to its event page; read 13 Nov). Cut: 50 (own-domain searches and fetches found no other source; Sumsub's release was listed but its page returned 404, so its session is cut). Where a File's Web Summit section was cut to nothing, it says so. Status set to fix on all 33 for the reviewer.
state: ok; done: step 2 of the About-claims task; next: nothing until the next task file; ask: none; run: prompted

## 2026-11-13: Humans and AI story 2 (task 2026-11-13-1805-humans-ai-story-2)
Draft pushed: `desks/journalist-vicky/drafts/s62-why-people-trust-ai-summaries.md` (newsroom commit 128052dea, on dev as 77beb6065), For: reviewer@PrompTugal.vicky. "Why people trust AI summaries more than they check them": the BBC and Ipsos report (read 13 Nov) and an arXiv preprint on over-reliance (read 13 Nov); no quotes except word for word from those two; cover chart under "The story". The EBU's own page refused an automated request, so its 45% is credited to the BBC report that cites it. Also done earlier today: RWS About re-sourced to rws.com (58d94cb98). Story 3 comes after, once Vicky or the conductor sends it.
state: ok; done: story 2 drafted; next: story 3 when the conductor sends its task file; ask: none; run: prompted

## 2026-11-13: Humans and AI story 3 (task 2026-11-13-1805-humans-ai-story-3)
Draft pushed: `desks/journalist-vicky/drafts/s63-women-learning-and-building-ai-in-portugal.md` (newsroom commit 6435685e2, on dev as aa87a3585), For: reviewer@PrompTugal.vicky. "Where women in Portugal can learn and build with AI": free courses (AI Skills 4 Women, BORA Mulheres Academia), W35's Build Lab, the 13 Nov forum, API's May event, Portuguese Women in Tech, and Defined.ai's Lisbon link; from the organisers' own pages and Portuguese press, all read 13 Nov; no quotes, no personal details, no Web Summit sources. Honest limit stated in the draft: it is mostly programmes, not a list of women who built AI companies in Portugal (I found no source I could read that supports such a list). The Mastercard figures are as PME Magazine reports them.
state: ok; done: story 3 drafted; next: wait for the conductor's next task file; ask: none; run: prompted

## 2026-11-13: S63 fix first (task 2026-11-13-1855-s63-fix)
Newsroom commit db96ca42c. All six points fixed: Build Lab now planned, not held; "Ms Braga" gone; Defined.ai wording follows its page (Seattle founding, Lisbon R&D centre, Porto office); API speakers as "enterprise, healthcare and people (HR) roles"; Portuguese Women in Tech no longer equated with the forum's partner; APDC description dropped. Wording points taken too ("Executiva reports", 2025 and 2026, forum "scheduled"). Sentences made shorter and active. The reviewer's cover card is kept. Note: STYLE.md in the newsroom does not yet hold the "Write like a person" section (standing answer 60), so I applied the existing short, plain-sentence rule; tell me if it lands elsewhere.
state: ok; done: S63 fixed; next: wait for the conductor's next task file; ask: none; run: prompted

## 2026-11-14: CLEANUP-14NOV (task 2026-11-14-1015-cleanup-journalist-ai)
applied CLEANUP-14NOV. In `people/vicky/prompts/journalist-ai.md`: P1 replaced with the widened text (both places); RULES-11NOV rule 5 replaced (lisbontechfringe.com only) and rule 7 replaced with the "Retired 14 Nov" line; removed the two schedule paragraphs (Web Summit timetable, fix-only times) and the whole fix-only follow-up section (standing answer 18), and the SCHED-WS and midday-timing sentences in the task-id paragraph. My own scheduled task (trig_014T4B2EkggPSUDazhhJZ1Gf, still disabled) got the same P1 and rule 5 and a note on rule 7. No line said publishing waits for Vicky's word, and none said never message another session (SA43-ONDEMAND already says reply to the session that messaged me), so nothing changed there. Unsure, so kept: the schedule history in the task-id paragraph (SCHED-7NOV, P5, HANDOFF-FIX, REMOTE-WS), and my five standing rules given in chat. The old fix-only task (trig_01FpXptzb91YorA9vNLuwjUu) is disabled and rests on retired answer 18; I left it as it was and did not delete it. Ledger: two lines added ("prompts update"; session total so far).
state: ok; done: CLEANUP-14NOV applied; next: wait for the conductor's next task file; ask: none; run: prompted

## 2026-11-14: PROMPTS-SHORT (task 2026-11-14-1055-prompts-short-journalist-ai)
applied PROMPTS-SHORT. `people/vicky/prompts/journalist-ai.md`: 15,998 to 9,039 bytes. The RULES-11NOV block, the P1 to P3 section and the copies of standing answers 23, 26 and 43 are replaced by the one-line pointer to decisions.md; kept my "For you (journalist)" line, the startup prompt, the scheduled prompt as stored (with its own P1 to P3, and the scheduled task itself untouched), the desk-specific SA43 paragraph and my five chat rules. Kept as unsure: the "For you (journalist)" line still says "rule 4" and "rule 6", which now point at standing answer 31.
state: ok; done: PROMPTS-SHORT applied; next: wait for the conductor's next task file; ask: none; run: prompted

## 2026-11-14: scheduled-prompt fix-up (task 2026-11-14-1105-sched-fixup-journalist-ai)
Both of my scheduled tasks (trig_014T4B2EkggPSUDazhhJZ1Gf and the old fix-only trig_01FpXptzb91YorA9vNLuwjUu, both still disabled, times unchanged) now point at `people/vicky/decisions.md` instead of "the top of your prompts file"; everything else word for word. The stored copy in my prompts file now matches the main task's prompt.
state: ok; done: scheduled-prompt fix-up; next: wait for the conductor's next task file; ask: none; run: prompted

## 2026-11-14: STORED-REF (task 2026-11-14-1110-stored-ref-journalist-ai)
applied STORED-REF. `people/vicky/prompts/journalist-ai.md`: 10,863 to 7,404 bytes. The stored copy of the scheduled prompt is replaced by one reference line per task (the main task and the old fix-only task, both disabled); the schedule history is kept without prompt text. No task's prompt, state or time was changed.
state: ok; done: STORED-REF applied; next: wait for the conductor's next task file; ask: none; run: prompted

## 2026-11-14: COVERS-14NOV (task 2026-11-14-1115-covers-journalist-ai)
applied COVERS-14NOV. One line added to my prompts file: I no longer make covers; each draft carries one line saying what the cover could show, and the designer then the reviewer take it from there. My startup prompt's older cover wording stays as stored; the new line says it is replaced.
state: ok; done: COVERS-14NOV applied; next: wait for the conductor's next task file; ask: none; run: prompted

## 2026-11-14: interview page (task 2026-11-14-1300-humans-and-ai-page-vicky)
1 interview page drafted, sealed.
state: ok; done: 1 interview page drafted, sealed; next: wait for the conductor's next task file; ask: none; run: prompted

## 2026-11-14: my key on the team site (task 2026-11-14-1340-journalist-ai-key-team-site)
Added `journalist-ai-vicky-2` (public half only, the key published in the newsroom as journalist-ai-vicky-promptugal-2, sha256:b8c3958efddef919) to `data/keys.json`; marked `journalist-ai-vicky` superseded. My session still holds that key.
state: ok; done: key added to the team site; next: open sealed write-ups when the conductor seals them to me; ask: none; run: prompted

## 2026-11-14: Vicky's approved page in the drafts folder (task 2026-11-14-1355-humans-and-ai-vicky-final)
1 interview page opened, put in the newsroom drafts as ready (newsroom commit b83f3c5a3), unsealed copy deleted.
state: ok; done: 1 interview page put in drafts for the designer and the reviewer; next: wait for the conductor's next task file; ask: none; run: prompted
