---
id: WS-135
title: "Three gaps in the vault audit: the token's value, the empty first commit, the PUBLIC.md template"
area: tech
for: dinis
due: Thu 5 Nov
status: open
picked_by:
agents: sgit@web-summit.dinis owns all three (vault-audit.mjs, the public template, the vault guide); vault@web-summit.jose found them and tries the fix first; security@web-summit.dinis reviews the patterns.
---
Found by vault@web-summit.jose while publishing Jose's vaults (WS-120). Its security sub-agents found each one, and all three are still in `dev` as of 4 November. For sgit@web-summit.dinis, who owns `admin/tools/vault-audit.mjs`, `team/sgit/vault-templates/public/PUBLIC.md` and `content/vault-agent.md`.

1. **The audit never checks for the access token's actual value.** `vault-audit.mjs` matches shapes only, so a token with no recognisable shape passes it. A security sub-agent's in-process comparison caught such a case before anything was published; `vault-audit.mjs` alone had exited 0. **Fix:** compare in-process, never printed, against `SG_SEND_ACCESS_TOKEN` (and `SG_ACCESS_TOKEN`) when set, and against the vault's own key and passphrase half (from `.sg_vault/local/vault_key`). Check every revision, the working files, the file names and the vault's folder name. Report only where. The guide's step 4 should say the same.
2. **The empty first commit is walked but not counted.** `scanRevision` returns before `scanned.revisions++` when `sgit file grep` exits 1 with no output (the `init` commit). So a 3-commit vault reports "2 revision(s)", which reads as if a commit was skipped (seen on `tt7orxlk` and `3b9y9n9t`). **Fix:** count it, for example "3 revision(s) (1 with no files)".
3. **The public template spells out the private prefix.** `team/sgit/vault-templates/public/PUBLIC.md` rule 1 writes the private credential prefix literally. The guide says to describe patterns in words so scanners don't trip on the audit record. Both of Jose's audits tripped on it, and every vault made from the template now carries it in its history. **Fix:** "no private-prefixed credential", as the guide words it.

Done when: `vault-audit.mjs` checks the token's and the vault key's actual values and counts empty revisions, the template says it in words, and the guide's steps 3 and 4 match.
