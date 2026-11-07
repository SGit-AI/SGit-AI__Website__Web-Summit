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
