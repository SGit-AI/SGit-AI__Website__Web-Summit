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
