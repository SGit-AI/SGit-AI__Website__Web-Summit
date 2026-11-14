# programme@web-summit.vicky: reports

Vicky's programme desk for the Web Summit newsroom (brief 4; brief 5, step 1; brief 9, decision 6). One entry per run that did or found something; a run with nothing new writes nothing.

## Wed 4 Nov 2026, 20:15 UTC (first run)

- The agenda to Thursday 12 November is live: 210 items (registration days and places, Opening Night, Night Summit, every Centre Stage session, PITCH, all 15 press conferences, the team's picks), each with its source URL and read time, all read on 4 November (desks/programme/agenda.json in the newsroom repository, commit 5429e71, newsroom v0.1.5).
- For whoever keeps data/events.json: at the source today, 16 of its 80 sessions have new times and 3 no longer open at the recorded address; the agenda uses today's times and lists the 3 under gaps (desks/programme/agenda.json, "gaps").
- Announcements on the summit's schedule: Web Summit's CEO's press conference Wed 11 Nov 11:00, PITCH final Thu 12 Nov 12:30 and winner 15:00, the Road 2 Web Summit winner Thu 12 Nov 12:30 (websummit.com/schedule/, read 4 Nov 20:02 UTC; agenda.json, kind "announcement").
- Interview shortlist: 10 names ready (brief 9, decision 6), held only in this desk's session, outside both repositories, until the shortlist vault's key reaches it (people/vicky/reports/vault.md, 4 Nov).
- This desk's key is on the keys page as programme-vicky, and vault@web-summit.vicky was told in that commit (data/keys.json, commit 141b694, site v0.2.346).

## Wed 4 Nov 2026, 20:45 UTC (the shortlist in its vault)

- The shortlist vault's key reached this desk, sealed to programme-vicky by vault@web-summit.vicky, and opened to a file without being shown (its AUDIT.md, line of 20:32 UTC).
- The interview shortlist is now held only in that confidential vault: 10 names proposed and 4 reserves, one file each per its template; the local copy outside the repositories is deleted (the vault's AUDIT.md).
- vault-audit.mjs before the push: clean, 5 revisions, 8 actual values compared; pushed, in sync with the remote (admin/tools/vault-audit.mjs, run from this repository).

## Thu 5 Nov 2026, 08:15 UTC run

- URGENT: today's agenda (209 items from 5 November; the RWS press conference now 10 Nov 11:30, 17 of the 80 sessions in data/events.json now at other times, 4 entries answering 404) is committed in the newsroom repository (5d5be8f) but not released: the newsroom's gate now needs every desk to run admin/tools/derive.mjs and commit the derived entities in data/ (newsroom CLAUDE.md, "After a desk's file in desks/ changes"; locally 613 problems without it), and this desk writes only desks/programme/. It needs Vicky's or Dinis's word to write those files, or someone to derive after it, as for the curator's 07:45 map (people/vicky/reports/curator.md).
- Until then the live agenda keeps the 4 November reading (desks/programme/agenda.json at 5429e71).
- websummit.com moved its essentials pages to /essentials/registration/ and /essentials/schedule/; registration and Night Summit times are unchanged (read 5 Nov 08:17 UTC).
- WS-153 (team site commit f124bd1b): this desk holds one vault key, the shortlist vault's; it is not sent to anyone without Vicky's yes.
- Interview shortlist: 10 names and 4 reserves, all still on the summit's schedule today, held only in the confidential shortlist vault; vault-audit clean before the push (that vault's AUDIT.md).
- Resolved, at Vicky's word: the 08:15 agenda is live (newsroom v0.1.14, commit 87c8a90); release.sh now derives the data itself (newsroom commit 24a9aba) and committed it separately as 1eaff14, so this desk still writes only desks/programme/.

## Fri 6 Nov 2026, 08:15 UTC run

- The agenda from 6 November is live: 218 items, 19 of the 80 sessions in data/events.json now at other times, the same 4 entries answering 404 (PrompTugal/PrompTugal__News__Website, commit cd52b43 with its derived data ecf0c94, promptugal.news v0.1.174).
- New announcements on the summit's schedule: 8 more press conferences, among them PitchBook (Tue 10 Nov 10:30), Discord's expansion in Lisbon (Wed 11 Nov 10:30) and Unicorn Factory Lisboa with partners (Thu 12 Nov 11:00) (websummit.com/schedule/, press conference filter, read 6 Nov 08:20 UTC).
- This desk's newsroom clone had its origin set back to the old SGit-AI address overnight; it points at PrompTugal again, with a push redirect from the old address, and nothing went there. The release script is now newsroom/tools/release.sh (newsroom commit d5dcff8).
- Interview shortlist: 10 names and 4 reserves, all still on the summit's schedule today, held only in the confidential shortlist vault; vault-audit clean before the push. The conductor's reported showing of the overview to Dinis is recorded in that vault's AUDIT.md, attributed to the conductor, as it asked (team site commit 7523baf2).

## Sat 7 Nov 2026, 08:15 UTC run

- The agenda from 7 November is live: 222 items; Gravitee's press conference moves to Tue 10 Nov 14:30 and NXTPLAY's to 16:30; a new press conference with Vivaldi's CEO, Thu 12 Nov 10:30. Items before today now stay, marked past, so their pages and links stay: the gate had refused a broken link from portugal/algarve-evolution/ to the 6 November gathering's event page (PrompTugal/PrompTugal__News__Website 858a35cb and 93256c2c, promptugal.news v0.1.477).
- For sgit@web-summit.dinis: admin/tools/vault-audit.mjs (line 30) allows agent names only in the @web-summit form, so it reads the new PrompTugal names as email addresses. The shortlist vault now has one such line in its history, so its audit can no longer come back clean; the findings were read and ruled out, and logged in that vault's AUDIT.md.
- decisions.md read: applied P1 (no hold), P2 (my prompts file matches), P3 (the status line below) and P9 (no ~/.abp/log/; no "ABP re-anchored" text at my start); P10, P17, P22 and P27 noted. Flag: its guard asks to follow only entries pushed from Vicky's account, but GitHub shows every commit to it with the author "claude", so the account can't be checked from the commit; I followed the entries that quote Vicky with a date, all consistent with her chat instructions (GitHub commit 2d9bc363).
- Interview shortlist: 10 names and 4 reserves, held only in the confidential shortlist vault; one main-list person is no longer on the summit's schedule (noted there, rank kept until Dinis picks); pushed after the audit (that vault's AUDIT.md).
- Ask: until sgit@ updates the audit, may this desk push the shortlist vault when the audit's only findings are that ruled-out line? Recommended: yes.
- state: ok; done: agenda live, shortlist re-checked and pushed; next: 8 Nov 08:15 run; ask: the audit question above; run: scheduled

## Sun 8 Nov 2026, 00:10 UTC (at Vicky's word in chat)

- applied PROGRAMME-WS: task trig_01RhHHq7KU16JfguhbU1d7HU's prompt now says 05:00 UTC (its cron was already 0 5 * * *), uses the clone /home/user/PrompTugal__News__Website with its remote set at every run, and carries decisions.md's current guard; the three changes were made exactly as written (decisions.md entry in commit 843617aa).
- The word-for-word copy in people/vicky/prompts/programme.md matches the stored prompt; the conductor's SCHED-WS header line is kept.
- The new clone exists at /home/user/PrompTugal__News__Website (dev, origin PrompTugal), ready for the 05:00 run; the old folder is no longer used.
- state: ok; done: applied PROGRAMME-WS; next: 05:00 run; ask: none; run: prompted

## Sun 8 Nov 2026, 05:00 UTC run

- The agenda from 8 November is live: 222 items; two new press conferences (Defined.ai's founder, Tue 10 Nov 16:00; Campus Tejo, Wed 11 Nov 14:30); 7 November's side events kept as past (PrompTugal/PrompTugal__News__Website 91d824a3 with derived data abd28172, promptugal.news v0.1.691), from the new clone /home/user/PrompTugal__News__Website.
- applied SA16: P1 to P3 word for word in my prompts file and in my scheduled task's prompt (task trig_01RhHHq7KU16JfguhbU1d7HU, changed at 05:02 UTC); P2 check: the prompts file and my memory agree.
- applied SCHED-WS: my task runs at 05:00 UTC (cron 0 5 * * *), as set by the conductor; my prompts file carries the time. SA21 read: nothing for this desk. No hold (people/vicky/decisions.md, commits 07c7ceb5, 7a4d6602 and 212e084d, each from the conductor).
- Interview shortlist: 10 names and 4 reserves, held only in the confidential shortlist vault; all re-read today; vault-audit clean before the push (that vault's AUDIT.md).
- state: ok; done: agenda live, SA16 and SCHED-WS applied, shortlist re-checked; next: 9 Nov 05:00 run; ask: none; run: scheduled

## Mon 9 Nov 2026, 05:00 UTC run

- The agenda from 9 November, the summit's opening day, is live: 226 items. The Opening Night programme on Centre Stage is now public (Welcome to Web Summit 2026 at 18:00, The age of agents 18:35, The future of AI 18:55, Welcome to tomorrow 19:20); a Web Summit Spotlight press conference, Tue 10 Nov 12:30; Brazil's blueprint for cyber resilience moves to Wed 11 Nov 14:32 (PrompTugal/PrompTugal__News__Website 599a7ee7 with derived data 21c5cb70, promptugal.news v0.1.787).
- Registration and Night Summit times unchanged (websummit.com/essentials/registration/ and /essentials/schedule/, read 9 Nov 05:07 UTC); the same 4 entries in data/events.json still answer 404.
- decisions.md read, no hold; nothing new for this desk; my prompts file and memory agree.
- Interview shortlist: 10 names and 4 reserves, held only in the confidential shortlist vault; all re-read today; vault-audit clean before the push (that vault's AUDIT.md).
- state: ok; done: agenda live for opening day, shortlist re-checked; next: 10 Nov 05:00 run; ask: none; run: scheduled

## Tue 10 Nov 2026, 05:00 UTC run

- The agenda from 10 November is live: 225 items, 9 November's kept as past (PrompTugal/PrompTugal__News__Website 75e10954 with derived data befb2d2b, promptugal.news v0.1.949). Registration and Night Summit times unchanged (websummit.com/essentials/registration/ and /essentials/schedule/, read 10 Nov 05:07 UTC).
- applied SA28: my part is in my prompts file and in my scheduled task's prompt (task trig_01RhHHq7KU16JfguhbU1d7HU, changed at 05:06 UTC); this report ends with the agenda changes line (people/vicky/decisions.md, commit d567a14d). No hold; my prompts file and memory agree.
- Interview shortlist: 10 names and 4 reserves, held only in the confidential shortlist vault; all re-read today; vault-audit clean before the push (that vault's AUDIT.md).
- agenda changes: dropped: "The techstyle stack", Wed 11 Nov 14:00-14:25 (https://websummit.com/sessions/lis26/f6f39b57-a911-4000-8f01-64e87e2f3c7d/the-techstyle-stack/); new: "What comes after the Blue Wave?", Tue 10 Nov 15:40-16:00 (https://websummit.com/sessions/lis26/6c621c75-9688-4416-99e1-d9afb195f598/what-comes-after-the-blue-wave/); new: "The race for industrial AI: can Europe win?", Thu 12 Nov 11:45-12:05 (https://websummit.com/sessions/lis26/cfc9da37-1584-443c-b395-78d005524b73/the-race-for-industrial-ai-can-europe-win/); retitled (same session, was "The race for compute, agentic AI, and ROI"): "Navigating today's AI landscape", Wed 11 Nov 11:25-11:45 (https://websummit.com/sessions/lis26/d7d7a0c0-7a21-459f-9c2d-62c6fffed106/navigating-today-s-ai-landscape/); retitled (same session, was with NordVPN's CTO): "Press conference with NordVPN CPSO Domininkas Virbickas", Wed 11 Nov 15:00-15:20 (https://websummit.com/sessions/lis26/f3712e6e-481b-47b6-b43e-69a312c07ef2/press-conference-with-nordvpn-cpso-domininkas-virbickas/); moved: "What does a self-driving company look like?" from 16:00-16:20 to 15:40-16:00, Tue 10 Nov (https://websummit.com/sessions/lis26/a54a6d5f-1f53-43fd-93c6-dd2c3d63a4fe/what-does-a-self-driving-company-look-like/)
- state: ok; done: agenda live, SA28 applied, shortlist re-checked; next: 11 Nov 05:00 run; ask: none; run: scheduled

## Wed 11 Nov 2026, 19:15 UTC (RULES-11NOV confirmation wake)

- confirmed RULES-11NOV: no machine reads of websummit.com, Luma, Meetup or Eventbrite; checked tools, scripts, notes and wake prompt; removed: this session's five scratch scripts that read websummit.com and built the agenda from it (never committed) and their saved copies of Web Summit pages, and the agenda and schedule-read steps from my scheduled task's prompt (rules put in; it stays disabled); key: programme-vicky-2-promptugal (newsroom board/keys.json, commit b055a4e7, promptugal.news v0.1.1292; programme-vicky-promptugal-b superseded at 19:08 UTC).
- applied SA33-PROGRAMME: my task's prompt has the Thursday 07:00 side events step (lisbontechfringe.com as a pointer, each item at its organiser's own page, into desks/programme/side-events-2026-11-12.md) in place of the agenda step, and keeps the shortlist step, reworded to rule 6 sources only; agenda.json untouched (people/vicky/decisions.md, standing answer 33).
- This morning's 05:00 run was delivered to this session only at 19:05 UTC and was not run: no normal work before this confirmation, and the agenda is frozen (standing answer 31, rule 7). Shortlist vault: its key is sealed to my first key (programme-vicky), which this session still holds, so no reseal is needed; nothing in it changed today.
- state: ok; done: confirmed RULES-11NOV, new key, applied SA33-PROGRAMME; next: wait for the conductor or Vicky (task enabled only by the conductor); ask: none; run: scheduled

## Thu 12 Nov 2026, 07:00 UTC run (side events only, standing answer 33)

- Thursday's side events are in desks/programme/side-events-2026-11-12.md (PrompTugal/PrompTugal__News__Website c7d2eb20, promptugal.news v0.1.1362), for the conductor to relay to the fringe conductor: lisbontechfringe.com's list read at 07:02 UTC as a pointer; 68 events on Thursday.
- 1 checked at its organiser's own page: Elevon CZ/SK Community Night, 17:00 to 19:00 on a catamaran on the Tagus, moved from Wednesday (elevon.io/websummit/night, read 07:04 UTC). The other 67 have organiser pages on Luma (66) or Meetup (1), which no agent reads by machine, so they are listed as unchecked pointers that need a person's browser check (standing answer 31, rule 2).
- No hold; decisions.md read (nothing new for this desk; paused from Friday 06:30, standing answer 43); my prompts file and memory agree. Interview shortlist: 10 names and 4 reserves, held only in the confidential shortlist vault; unchanged (no rule 6 proof of any change).
- agenda changes: none (agenda.json frozen, standing answer 31, rule 7)
- state: ok; done: Thursday's side events written, 1 checked, 67 pointers; next: paused from Friday 06:30 UTC (standing answer 43); ask: a person's browser check of the 67 Luma and Meetup pointers if the fringe conductor wants them stated as fact; run: scheduled

## Sat 14 Nov 2026, 10:45 UTC (the last programme entry: the desk becomes the reporter)

- Programme hand-over written: people/vicky/handover/programme-2026-11-14.md (where the agenda and side-event files are, what is open). The agenda and side-event files stay in the newsroom's desks/programme/, unchanged.
- The interview shortlist is handed back to vault@web-summit.vicky (commit For: vault@, and the vault's own AUDIT.md, audit clean before the push); this session's copy of the vault's key and its clone are deleted, and a search of the session's disk found neither left.
- From now this session is reporter@PrompTugal.vicky (key reporter-vicky-promptugal; programme-vicky-2-promptugal superseded at 10:37 UTC; newsroom commit 55bfb2e7, promptugal.news v0.1.1448). Its reports start in people/vicky/reports/reporter.md.
- agenda changes: none
- state: ok; done: hand-over, vault handed back and deleted from the session, reporter key; next: none (programme desk closed); ask: none; run: prompted
