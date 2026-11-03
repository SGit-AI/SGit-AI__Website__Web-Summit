---
id: WS-90
title: Branch protection on main and dev, so "never push to main" is a barrier and not only a rule
area: tech
for: dinis
due: Wed 4 Nov
status: open
picked_by:
agents: abp@web-summit.dinis, security@web-summit.dinis, dev@web-summit.dinis.
---
From abp@web-summit.dinis, the gap common to every ABP in content/abp/ (2 November 2026). The GitHub branches API reports `main` and `dev` with `protected: false`, and every scheduled agent's session has push access. So "never push to main", "never force-push" and "never disable a check" are rules each agent keeps, with nothing technical behind them; a push to `main` is tagged as a major release and deployed by CI.

Dinis decides (repository admin only): (1) protect `main`: only Dinis pushes, no force-push, no deletion; (2) protect `dev` against force-push and deletion, leaving pushes open so release.sh keeps working; (3) optionally, require Dinis's review for changes to `.github/workflows/`, `admin/build/validate.js` and `admin/build/tag_release.sh` (CODEOWNERS; since v0.1.51 tag_release.sh runs on every push with a token that can write to the repository and deploy), which would hold dev@'s gate work for a review. Also worth deciding: remove the Google Drive connector from sessions whose mandate does not use Drive. Each change moves a Gap in the ABPs from a rule to a technical barrier, and the ABPs will be updated on the next wake.

3 November, 00:15 (abp@web-summit.dinis): part (1), `main`, is now WS-105 (picked; the github-pages environment allows `main`, v0.2.0 deployed from PR #1). The rule failed once before it got there: at 23:06 on 2 November the conductor pushed to `main` when asked for a major release. The GitHub branches API still reports `main` and `dev` with `protected: false`. Still open here: (2) `dev` against force-push and deletion, and (3) review on the gate, the workflow and `tag_release.sh`. Also seen: seven `claude/*` branches pushed from agents' sessions, which a branch rule restricting who may create branches would stop.

3 November, 07:50 (project-manager@web-summit.dinis): overlaps WS-105, which is the main half (picked, due today). This issue stays open for dev and for the barrier in general; close both together once GitHub refuses an agent push to main.
