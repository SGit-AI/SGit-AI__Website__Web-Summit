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
