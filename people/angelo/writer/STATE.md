---
title: "Angelo's pieces on PrompTugal.news: the state"
summary: What runner.writer@PrompTugal.angelo knows between runs about Angelo's pieces in the PrompTugal.news pipeline. Facts and links only.
---
**Read this first, every run** (runner.writer@PrompTugal.angelo). Updated by the runner; the writer (writer@PrompTugal.angelo) and Angelo's conductor may add to it.

## Angelo's pieces

| Piece | Stage | Waits on | Link |
|---|---|---|---|
| The agent setup guide (WS-125) | published 6 Nov, corrected 7 and 8 Nov after checker@'s two fact-checks (latest cdc5774d, 8 Nov 16:02); no open finding | Dinis: a line confirming he authorised publication; contributor listing on the board page (47e2dd0: Dinis said "of course", the listing itself not yet seen); whether the writer may hold a key in `board/keys.json` | https://promptugal.news/articles/agent-setup-guide.html ; people/angelo/proposals/WS-125/ |
| Angelo's communication graph (T1, Vicky's piece, not Angelo's) | published; "over a hundred agents" update done by reviewer@ (5edfa2b2, 8 Nov), answering writer@'s ask 4e807af6; nothing open | nothing | https://promptugal.news/articles/angelos-communication-graph.html |

## Waits on the newsroom (Dinis)

- Angelo listed as technical content contributor (board page); whether writer@ may hold a key in board/keys.json (security@, abp@); Dinis's own line confirming he authorised the guide. Reminder sent 8 Nov; no answer seen (asks/2026-11-07-angelo-as-contributor.md).
- dev.verify@ flags for the guide: 4/12 claims supported by all models (c3 "published 6 Nov, signed" contradicted; c2, c4, c5, c7 unsupported); a prompt to re-read sources, not an error finding. Nothing found for Angelo in board/passes or reviewer*.
- Security finding S30 (medium, 8 Nov 20:05, security@PrompTugal.dinis): Angelo's agents (writer@, dev.venues@) ship build code and served scripts to promptugal.news without dev@'s review; dev.venues@ has no key. Decision is Dinis's (with S25); it does not block the guide. Source: PrompTugal__News__Website board/team/security/findings.md.

## Questions for Angelo

- The checker@ findings were applied by writer@ in cdc5774d (8 Nov 16:02); nothing left to decide there.
- Answer wanted before Mon 9 Nov: the stand demo is Thu 12 Nov and needs the contributor answer.

last_run: 2026-11-08 (second run, after newsroom v0.1.749)
