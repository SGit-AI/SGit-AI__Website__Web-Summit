---
title: "dev@PrompTugal.angelo: STATE"
summary: What dev@PrompTugal.angelo holds open, what it waits on, and its open questions, kept short (the kit's Context rules). Read first at every run.
---
**Last updated:** 7 November 2026, about 17:05 UTC, at Angelo's word ("Write your current state and open questions to your report and commit, then I'll compact").

## Every run (the routine)

1. Pull dev. Read the kit's protocol, then `people/angelo/backlog.md`, then only the commits since the last run that name me.
2. Review the worker branches:
   - `git fetch origin 'refs/heads/workers/*:refs/remotes/origin/workers/*'`, and check for new commits since `people/angelo/workers/reviewed.json`.
   - Skip vault.kms: vault@ reviews it.
   - Take only the worker's own commits, as a patch onto current dev. Never take the branch's tip: dev.map's is based on an older dev.
   - Run the gate and `people/angelo/app/tests/run.sh` (13 tests).
   - Commit "review: bring workers/<agent>'s new work onto dev (one commit)" For: the worker, and update reviewed.json.
3. Refresh the PrompTugal snapshot (`people/angelo/tools/promptugal-snapshot.mjs`, clone at `/home/user/promptugal/promptugal__news__website`).
4. Commit, release, run log (`agent-log.mjs`, with my name in lower case and `--key sha256:b478b82a3a9995eb`), ledger line (by_model removed).

## Open now

| What | State | Next |
|---|---|---|
| **Review workers/dev.links** | c8a45d67 (16:58, "crawler counts each request before it sends it") is not reviewed yet | Review at the next run |
| **Review workers/dev.map** | Reviewed to 445f95df: piece 1 of the live map (the timeline under Team and the machine) is on dev (4cab435a) | Its next pieces: the four new events, external connections, `/team/map/`, 3D |
| **Review workers/dev.venues** | Reviewed to efe679fc | Builds spec-venues Part B1 next (the public venue map on PrompTugal.news) |
| **research@** | Reviewed; no briefs yet | Waits on Angelo: his meeting list, and sgit-ai in the shared environment (tier 3) |
| **Android spec** (backlog #7) | Written, `people/angelo/proposals/android/spec-android.md` (775f02bf) | Waits on Angelo's review |
| **Context rules** (backlog #10) | Done: the kit's "Context" section, and my scheduled prompt (5fae3759) | The desk ticks it off |

**Specs approved:**
- `new-agents/spec-new-agents.md`: six agents, created by Angelo;
- `live-map/spec-live-map.md`;
- `WS-181/spec-venues.md`, Parts A and B. B2, the team's layer, waits on security@web-summit.dinis's review and vault@'s token.

## Open questions, with my recommendation

1. **The Android app** (spec-android.md):
   - approve native Kotlin and Compose;
   - create or name the repository (`PrompTugal/PrompTugal__App__Android`, telling Dinis first);
   - choose the beta's distribution. I recommend a signed APK on the releases page for the summit, and Play's internal testing after, which needs a developer account;
   - then create dev.android@'s task.
   
   All tier 3, Angelo's.
2. **dev.map@'s model:** its commits name the lighter model, though the desk recorded the default (the stronger one) for it (ae3d64a4). If the task's setting is wrong, it is Angelo's to change. I recommend the stronger model for the map's code.
3. **research@:** Angelo's meeting list (company or person, day, time) in `people/angelo/research/requests.md`, and whether the shared environment may install sgit-ai so research@ can read the public CRM. I recommend both; the second is an environment setting, tier 3.
4. **The page-view telemetry lane is full** (507 on vault 1ssnjy23, WS-37). It is conductor@web-summit.jose's, and I reported it in 5fae3759. Page views are lost until it has room, and my kb and cb tests ignore that one error until then.
5. **The interactive guide's questionnaire** (WS-125): "posting in public" and "company documents" still land on the mail assistant at "Reviewed". I recommend posting in public counts as irreversible (Enforced). It changes the advice, so it is Angelo's or policy@'s call.
6. **My key's label** on the keys page: done. It carries `renamed_to: dev@PrompTugal.angelo` (2541d857), same key and id.

## Where things are

- **Angelo's command centre:** `people/angelo/app/` (data.mjs, app.js, replay.js, where.js, kanban-core.js), with its tests in `people/angelo/app/tests/`.
- **Specs and proposals:** `people/angelo/proposals/` (new-agents, live-map, WS-181, android, WS-125, kms).
- **Worker reviews:** `people/angelo/workers/reviewed.json`.
- **My scheduled task:** hourly at :35 (trig_018DaUjPCtYv2gceZZ7BjXYp), into this session.
