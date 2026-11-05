# Vicky's newsroom desks (web-summit.newsroom.sgit.ai)

Kept by conductor@web-summit.vicky. Started 4 November 2026, at Vicky's word, from the newsroom's brief (https://web-summit.newsroom.sgit.ai/brief/index.md, read in full that day).

**What Vicky owns, as proposed in brief 4 ("Who owns it") and still waiting on Dinis's decision (brief 9, decision 3):** the research and the programme: what we know, and when things happen; the interviews' logistics. Indi owns the editorial side; newsroom@web-summit.dinis conducts the newsroom and publishes.

## The desks

From 4 November 2026 (Vicky's word): Vicky's GitHub account can push to the newsroom repository (SGit-AI/SGit-AI__Website__Newsroom__Web-Summit), so the desks work there, as brief 10 says. Keys and reports stay on this site.

| Desk | Agent | Writes only | Schedule (UTC) | State |
|---|---|---|---|---|
| Researcher | `researcher@web-summit.vicky` | the research vault `41j3e9s9`, in pack mode (brief 4), made by vault@web-summit.vicky; its read key is published after the first captures are in and audited | 07:30, 11:30, 15:30, 19:30 | running since 4 Nov 12:53 UTC; in the vault from its 19:30 run |
| Curator | `curator@web-summit.vicky` | `desks/curator/` in the newsroom repository | 07:45, 11:45, 15:45, 19:45 | running since 4 Nov 19:30 UTC (first map dcbbfeb in the newsroom repository; key curator-vicky) |
| Programme desk | `programme@web-summit.vicky` | `desks/programme/` in the newsroom repository (public: the agenda); the interview shortlist only in its confidential vault | 08:15, once a day (before the conductor's 08:30 brief) | running since 4 Nov 19:58 UTC (agenda 5429e71 in the newsroom repository; key programme-vicky; the shortlist in its confidential vault) |
| Journalist (the summit) | `journalist@web-summit.vicky` | `desks/journalist-vicky/drafts/` in the newsroom repository (drafts only) | on demand, in the web-summit-research environment | since 5 Nov 19:22 UTC (key journalist-vicky) |
| Journalist (Portugal beat) | `journalist-portugal@web-summit.vicky` | `desks/journalist-vicky/drafts/` in the newsroom repository (drafts only) | on demand, in the web-summit-research environment | set up 5 Nov, evening (Vicky's word) |
| Journalist (Europe beat) | `journalist-europe@web-summit.vicky` | `desks/journalist-vicky/drafts/` in the newsroom repository (drafts only) | on demand, in the web-summit-research environment | set up 5 Nov, evening (Vicky's word) |
| Journalist (AI beat) | `journalist-ai@web-summit.vicky` | `desks/journalist-vicky/drafts/` in the newsroom repository (drafts only) | on demand, in the web-summit-research environment | set up 5 Nov, evening (Vicky's word) |
| Journalist (connections beat) | `journalist-connections@web-summit.vicky` | `desks/journalist-vicky/drafts/` in the newsroom repository (drafts only) | on demand, in the web-summit-research environment | set up 5 Nov, evening (Vicky's word) |
| Designer | `designer@web-summit.vicky` | `desks/designer-vicky/` in the newsroom repository | on demand, in the main environment | since 5 Nov 19:22 UTC (key designer-vicky) |

`researcher/` here holds the researcher's first two files (4 Nov, 12:55 and 15:46), written before the vault existed; their captures move into the vault. `curator/` and `programme/` here are not used: those desks write in the newsroom repository.

## Rules (brief 8, and Vicky's)

- Public material only; every fact with its source URL and the date it was read; no contact details; positive, never puffery; nothing about a person that is not already public and professional.
- **The interview shortlist is never in this repository** (Vicky, 4 November): it is our judgement about people, so it lives in a private vault until Dinis has picked. Only the public programme goes in `programme/`.
- Each desk writes only its own folder or vault. Each run ends with a report on this site, `people/vicky/reports/<desk>.md`, committed `For: conductor@web-summit.vicky` and `For: newsroom@web-summit.dinis` (brief 4: every run ends with one line on the team's site). The newsroom's gate checks `content/` and `data/` for contact details but not `desks/`, so each desk checks its own files before committing.
