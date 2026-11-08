---
title: "dev@PrompTugal.angelo: STATE"
summary: What dev@PrompTugal.angelo holds open, what it waits on, and its open questions, kept short (the kit's Context rules). Read first at every run.
---
**Last updated:** 8 November 2026, about 11:45 UTC (scheduled run). From 251d793b: dashboard@ reviews dev.map, dev.work and dev.app; I review dev.venues, dev.links, research, dev.abp, social-media (and dev.android once it runs). Reviews: unstage before committing per worker (git apply --3way stages everything; 8 November lesson, see the commit after the dev.map review of 8 November 10:15).

## Every run (the routine)

1. Pull dev. Read the kit's protocol, then `people/angelo/backlog.md`, then only the commits since the last run that name me.
2. Review the worker branches:
   - `git fetch origin 'refs/heads/workers/*:refs/remotes/origin/workers/*'`, and check for new commits since `people/angelo/workers/reviewed.json`.
   - Skip vault.kms: vault@ reviews it.
   - Take only the worker's own commits, as a patch onto current dev. Never take the branch's tip: dev.map's is based on an older dev.
   - Run the gate and `people/angelo/app/tests/run.sh` (13 tests).
   - Commit "review: bring workers/<agent>'s new work onto dev (one commit)" For: the worker, and update reviewed.json.
3. Refresh the PrompTugal snapshot (`people/angelo/tools/promptugal-snapshot.mjs`, clone at `/home/user/promptugal/promptugal__news__website`) and every repository's exchanges for the live graph (`people/angelo/tools/repos-snapshot.mjs`, list in `people/angelo/app/repos.json`).
4. Commit, release, run log (`agent-log.mjs`, with my name in lower case and `--key sha256:b478b82a3a9995eb`), ledger line (by_model removed).

## Open now

| What | State | Next |
|---|---|---|
| **Kanban as Angelo's task board** (backlog #0, approved cb97bf39) | Built: For me is the default of `#kanban` (B, the copied line, works now); test `tasks.test.js` | A (signed on the desk's lane) once the desk's token comes (WS-170); the desk adds the backlog Status column and `[A-NN]` ids |
| **Android** (backlog #7) | Spec approved; dev.android@ in agents.json, kit, new-agents spec, backlog #14 | Repository: I cannot create it (this session's GitHub scope); Angelo creates it, and dev.android@'s task |
| **ABPs you can watch** (00d) | First night's experiment delivered (64213f46); handed over to dev.abp@PrompTugal.angelo (d37c6c6f), whose workers/dev.abp branch I review | Angelo's decisions in proposals/abp-live/spec-abp-live.md |
| **pushed-by.mjs** (0a) | Fixed (81e9965a): the same answer in a fresh shallow session; UNKNOWN is not NOT-ANGELO | nothing |
| **The newsroom fix** (0b, 10b) | Handed to Dinis's agents at Angelo's word (0aa99384) | nothing for me |
| **policy@'s two barriers** (backlog 1b, 318b1c2d) | Built: the signed-only drain (d89d2576) and the lane check, check 21 (42198055), warnings until lanes.json says "enforce": true | policy@ widens dashboard@'s and writer@'s lanes, then turns enforcement on |
| **Review workers/dev.links** | Reviewed to 069b5509 (run 2: crawler fix, five external 404s for their signers) | Its next run: 1547 unchecked links |
| **Review workers/dev.map** | Reviewed to 8c028f12: the live graph in a hexagon (#live, Pop out) is on dev | Its next steps: Safari/iPad picture-in-picture, full screen, the four-hour test | Its next pieces: the four new events, external connections, `/team/map/`, 3D |
| **Review workers/dev.venues** | Reviewed to 811f0b36: B1 items 1 and 2 shipped on the newsroom | B1 items 3 and 4: My day on the map, links |
| **research@** | Reviewed; no briefs yet | Waits on Angelo: his meeting list, and sgit-ai in the shared environment (tier 3) |
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
4. **The page-view telemetry lane 1 is full** (507, WS-37). conductor@web-summit.jose corrected me (d203aef2): the browser falls back to lane 2, so no views are lost; only the one logged error remains until lane 1 is drained. My kb and cb tests ignore that error until then. Nothing for Angelo.
5. **The interactive guide's questionnaire** (WS-125): "posting in public" and "company documents" still land on the mail assistant at "Reviewed". I recommend posting in public counts as irreversible (Enforced). It changes the advice, so it is Angelo's or policy@'s call.
6. **My key's label** on the keys page: done. It carries `renamed_to: dev@PrompTugal.angelo` (2541d857), same key and id.

## Where things are

- **Angelo's command centre:** `people/angelo/app/` (data.mjs, app.js, replay.js, where.js, kanban-core.js), with its tests in `people/angelo/app/tests/`.
- **Specs and proposals:** `people/angelo/proposals/` (new-agents, live-map, WS-181, android, WS-125, kms).
- **Worker reviews:** `people/angelo/workers/reviewed.json`.
- **My scheduled task:** hourly at :35 (trig_018DaUjPCtYv2gceZZ7BjXYp), into this session.
