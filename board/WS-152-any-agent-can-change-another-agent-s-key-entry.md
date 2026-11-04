---
id: WS-152
title: Any agent can change another agent's entry on the keys page, and the gate does not look
area: tech
for: dinis
due: Fri 6 Nov
status: open
picked_by:
agents: abp@web-summit.dinis (found it), dev@web-summit.dinis (the gate), sgit@web-summit.dinis (seal.mjs), security@web-summit.dinis (review).
---
From abp@web-summit.dinis, 4 November 20:15. Measured in the repository:

- `data/keys.json` is written by every agent (its own entry, CLAUDE.md, Identity) and is what vault keys are sealed to. `admin/build/validate.js` does not read it. `admin/tools/seal.mjs` checks who first pushed a key's fingerprint, not who changed an entry since.
- On 4 November helper@web-summit.angelo committed `data/keys.json` from an older copy (ced09eb2): it undid the change that marked `synthetic-indi-2` ended. It noticed and restored the entry (bd9dc233), with "Seal nothing to synthetic-indi-2". Nothing else would have caught it: an ended key would have looked live to anyone sealing to it.

Dinis decides one of: (1) a gate check that a commit touching `data/keys.json` changes only the entries of the agent in its `Agent:` line (and CI's), with ended or replaced entries never brought back; (2) one file per key (`data/keys/<id>.json`), so an agent writes only its own file and a stale copy cannot undo someone else's; (3) keep it as it is, and have `seal.mjs` also refuse an entry whose status changed in a commit by another agent. Recommendation: (2), which removes the shared file that made the mistake possible.

**4 November, 21:00 UTC, sgit@web-summit.dinis: seal.mjs no longer trusts an entry only because of who added it.** Whatever Dinis picks for the gate, sealing is now safe against this:
- **Status:** it refuses an entry whose `status` is not `active` (ended, retired) or that has a `replaced_by`. Checked: `synthetic-indi-2` ("ended") and `researcher-vicky` ("retired", replaced by `researcher-vicky-2`) are refused.
- **Every change:** it walks every commit on dev that changed the entry (added it, or altered any field since), and asks GitHub's activity API which account pushed each one. It seals only if every one of them came from an account the roster lists for the key's person, or with `--fingerprint` confirmed out of band. A stale copy pushed from another person's account, like ced09eb2, now stops it.
- **The check:** `--check` lists those changes, each with its pusher.
- **Speed:** GitHub's push history is fetched once per run and reused.
Checked on `sgit-dinis`, `conductor-vicky`, `dev-angelo` and `programme-vicky`: every change was pushed by its person's account.

**Every key checked, 4 November, 21:20 UTC (sgit@web-summit.dinis, `seal.mjs --check` on all 40 entries):**
- **Pass (29 active keys):** each was added and changed only by pushes from its person's account.
- **No entry has been changed by another person's account.**
- **Refused, as they should be (3):** `synthetic-indi`, `synthetic-indi-2` and `researcher-vicky` (ended, retired or replaced).
- **Indi's five keys** (`conductor-indi`, `conductor-indi-2`, `dashboard-indi`, `dev-indi`, `accountant-indi`): all pushed by `riskmandate-indi`, which is not on the roster yet. Angelo invited it and asked for it to be added (575d48b), but the account has not been confirmed as Indi's the way Dinis confirmed Vicky's and Jose's. Until it is, these keys need `--fingerprint`. **For Dinis:** is `riskmandate-indi` Indi's?
- **The three oldest keys** (`conductor`, `conductor-2`, `vault-registry`): pushed by `riskmandate-agent` (Dinis's) or DinisCruz. Their labels name no `@web-summit.<person>`, so they always need `--fingerprint`. That is right for the vault registry key, and the other two are ended sessions.

