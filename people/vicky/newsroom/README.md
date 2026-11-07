# Vicky's newsroom desks (PrompTugal, promptugal.news)

Kept by conductor@web-summit.vicky. Started 4 November 2026, at Vicky's word, from the newsroom's brief (https://promptugal.news/brief/index.md, read in full that day).

**What Vicky owns, as proposed in brief 4 ("Who owns it") and still waiting on Dinis's decision (brief 9, decision 3):** the research and the programme: what we know, and when things happen; the interviews' logistics. Indi owns the editorial side; newsroom@web-summit.dinis conducts the newsroom and publishes.

**From the 18:00 stand-up of 5 November** (Vicky's words, 6 Nov): "Dinis made Vicky the newsroom's editor; her KPI is published articles." Who writes the articles is still being settled (Dinis's journalist writes too).

**The name** is spelled **PrompTugal**; its branding is live at promptugal.news (Vicky, 6 Nov).

**Publishing, for now** (Vicky, 6 Nov; Dinis will set up a proper workflow): journalist@PrompTugal.dinis publishes drafts the reviewer has marked Ready, and Vicky's reviewer publishes only when she asks. The first eight drafts (S1, S2, S5, S6, S9, S10, S15, S18) were published by journalist@PrompTugal.dinis just after midnight on 6 November. At Vicky's word, her reviewer published S16, S19, S20 and WS177 on 6 November at 11:07 UTC (newsroom 8fcfb9ff): **twelve of Vicky's desks' articles are live** (Vicky, 6 Nov). The publish workflow, draft v0.1 for comment by both sides: `desks/checker-vicky/publish-workflow.md` in the newsroom repository.

**Decide or ask:** every desk reads `people/vicky/decisions.md` at the start of each run (Vicky, 6 Nov).

**New names** (Vicky, 6 Nov): the nine newsroom desks below (curator, programme, the five journalists, reviewer, designer) become `<role>@PrompTugal.vicky` as each wakes today; the researcher keeps its name. Each keeps its report file on this site under its short name (`people/vicky/reports/<role>.md`). This table and agents.json change as each switches; until then the old name stands. Every agent's prompt: `people/vicky/prompts/README.md`.

## The desks

From 4 November 2026 (Vicky's word): Vicky's GitHub account can push to the newsroom repository (https://github.com/PrompTugal/PrompTugal__News__Website; moved there from SGit-AI/SGit-AI__Website__Newsroom__Web-Summit on 5 November 2026, Dinis confirmed at 23:30 UTC; same history and rules, so every desk path below is unchanged), so the desks work there, as brief 10 says. Keys and reports stay on this site.

| Desk | Agent | Writes only | Schedule (UTC) | State |
|---|---|---|---|---|
| Researcher | `researcher@web-summit.vicky` | the research vault `41j3e9s9`, in pack mode (brief 4), made by vault@web-summit.vicky; its read key is published after the first captures are in and audited | 07:30, 11:30, 15:30, 19:30 | running since 4 Nov 12:53 UTC; in the vault from its 19:30 run |
| Curator | `curator@PrompTugal.vicky` (was curator@web-summit.vicky until 6 Nov 10:34 UTC) | `desks/curator/` in the newsroom repository | 07:45, 11:45, 15:45, 19:45 | running since 4 Nov 19:30 UTC (first map dcbbfeb in the newsroom repository; key curator-vicky) |
| Programme desk | `programme@PrompTugal.vicky` (was programme@web-summit.vicky until 6 Nov 10:26 UTC) | `desks/programme/` in the newsroom repository (public: the agenda); the interview shortlist only in its confidential vault | 08:15, once a day (before the conductor's 09:45 brief) | running since 4 Nov 19:58 UTC (agenda 5429e71 in the newsroom repository; key programme-vicky; the shortlist in its confidential vault) |
| Journalist (the summit) | `journalist@PrompTugal.vicky` (was journalist@web-summit.vicky until 6 Nov 10:18 UTC) | `desks/journalist-vicky/drafts/` in the newsroom repository (drafts only) | 08:00, 12:00, 16:00 and 20:00, six minutes apart, each on its own scheduled task (from 7 Nov), in the web-summit-research environment | since 5 Nov 19:22 UTC (key journalist-vicky) |
| Journalist (Portugal beat) | `journalist-portugal@PrompTugal.vicky` (was journalist-portugal@web-summit.vicky until 6 Nov 10:50 UTC) | `desks/journalist-vicky/drafts/` in the newsroom repository (drafts only) | 08:00, 12:00, 16:00 and 20:00, six minutes apart, each on its own scheduled task (from 7 Nov), in the web-summit-research environment | set up 5 Nov, evening (Vicky's word) |
| Journalist (Europe beat) | `journalist-europe@PrompTugal.vicky` (was journalist-europe@web-summit.vicky until 6 Nov 10:49 UTC) | `desks/journalist-vicky/drafts/` in the newsroom repository (drafts only) | 08:00, 12:00, 16:00 and 20:00, six minutes apart, each on its own scheduled task (from 7 Nov), in the web-summit-research environment | set up 5 Nov, evening (Vicky's word) |
| Journalist (AI beat) | `journalist-ai@PrompTugal.vicky` (was journalist-ai@web-summit.vicky until 6 Nov 10:49 UTC) | `desks/journalist-vicky/drafts/` in the newsroom repository (drafts only) | 08:00, 12:00, 16:00 and 20:00, six minutes apart, each on its own scheduled task (from 7 Nov), in the web-summit-research environment | set up 5 Nov, evening (Vicky's word) |
| Journalist (connections beat) | `journalist-connections@PrompTugal.vicky` (was journalist-connections@web-summit.vicky until 6 Nov 10:50 UTC) | `desks/journalist-vicky/drafts/` in the newsroom repository (drafts only) | 08:00, 12:00, 16:00 and 20:00, six minutes apart, each on its own scheduled task (from 7 Nov), in the web-summit-research environment | set up 5 Nov, evening (Vicky's word) |
| Reviewer | `reviewer@PrompTugal.vicky` (was reviewer@web-summit.vicky until 6 Nov 10:20 UTC) | `desks/reviewer-vicky/reviews/` in the newsroom repository (reviews of the journalists' drafts against their sources, and style) | 09:00, 13:00, 17:00 and 21:00, on its own scheduled task (from 7 Nov), in the web-summit-research environment | set up 5 Nov, night (Vicky's word) |
| Checker | `checker@PrompTugal.vicky` | `desks/checker-vicky/` in the newsroom repository: fact-checks of the articles Dinis's agents write (`findings/`), and the publish workflow draft (`publish-workflow.md`) | 09:48 and 17:48, on its own scheduled task | since 6 Nov 11:02 UTC (keys checker-vicky-promptugal and checker-vicky) |
| Designer | `designer@PrompTugal.vicky` (was designer@web-summit.vicky until 6 Nov 10:27 UTC) | `desks/designer-vicky/` in the newsroom repository | paused until Vicky asks (6 Nov; Dinis's designer owns the brand) | since 5 Nov 19:22 UTC (key designer-vicky) |
| Dev | `dev@PrompTugal.vicky` | the newsroom site, only when Vicky asks; tells the owner of what it changes in a commit For: that agent (standing answer 10) | on demand | set up 6 Nov, evening (replaces dev@web-summit.vicky) |

`researcher/` here holds the researcher's first two files (4 Nov, 12:55 and 15:46), written before the vault existed; their captures move into the vault. `curator/` and `programme/` here are not used: those desks write in the newsroom repository.

## Rules (brief 8, and Vicky's)

- Public material only; every fact with its source URL and the date it was read; no contact details; positive, never puffery; nothing about a person that is not already public and professional.
- **The interview shortlist is never in this repository** (Vicky, 4 November): it is our judgement about people, so it lives in a private vault until Dinis has picked. Only the public programme goes in `programme/`.
- Each desk writes only its own folder or vault. Each run ends with a report on this site, `people/vicky/reports/<desk>.md`, committed `For: conductor@web-summit.vicky` and `For: newsroom@web-summit.dinis` (brief 4: every run ends with one line on the team's site). The newsroom's gate checks `content/` and `data/` for contact details but not `desks/`, so each desk checks its own files before committing.
