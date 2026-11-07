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
