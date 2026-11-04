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
