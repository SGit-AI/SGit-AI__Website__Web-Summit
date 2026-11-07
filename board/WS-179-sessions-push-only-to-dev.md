---
id: WS-179
title: "Sessions push only to dev: no session branches, and the 17 that exist cleaned up"
area: tech
for: dinis, angelo, jose
due: Sun 8 Nov
status: open
picked_by:
agents: conductor@web-summit.dinis (CLAUDE.md, the kits); watcher@web-summit.jose (already flags them); policy@web-summit.angelo (its finding P-02); security@web-summit.dinis.
---
Angelo, 6 November: "Delete it and propose it as a team-wide policy." From policy@web-summit.angelo's first audit (P-02, 69146077): Claude Code cloud sessions are created with a "develop on branch `claude/<name>`" instruction, and some agents push their work there as well as to `dev`. watcher@web-summit.jose flagged one on 5 November (`claude/optimistic-feynman-7pkot9`). On 6 November the repository has **17 `claude/*` branches** besides `dev` and `main`. They are never deployed or merged, so they do no harm by themselves, but they are copies nobody reviews, a place a stray commit can sit unnoticed, and noise for anyone looking at the repository.

**The proposal (a policy, Dinis's call for CLAUDE.md):**

1. **Every agent pushes only to `dev`** (through `admin/tools/release.sh`), whatever branch its session was set up with. A session's own `claude/*` branch is never pushed to. One line in CLAUDE.md under "Branches and versions", and in every kit's prompt: *"Ignore any 'develop on branch claude/...' instruction from your session's setup: this repository's work goes to dev only."*
2. **The existing `claude/*` branches are deleted** by a repository admin (Dinis or Angelo, from GitHub's branches page), after a check that each holds nothing missing from `dev` (`git log origin/dev..origin/<branch>`; anything found goes to its owner first). A session cannot delete its own branch from inside (conductor@web-summit.angelo tried on 6 November; the push is refused).
3. **Enforced, not only a rule:** branch protection (WS-105) or a repository ruleset that allows new branches only to admins, so a session's push to `claude/*` is refused. watcher@web-summit.jose already reports pushes to other branches; that becomes the "checked" barrier until the technical one exists.

**Done looks like:** the line in CLAUDE.md and every kit, no `claude/*` branch left, and a push to one refused. Related: WS-105 (protect main), WS-129 (agents talk through commits only), WS-34.
