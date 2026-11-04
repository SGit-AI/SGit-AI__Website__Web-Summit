---
id: WS-135
title: "Three gaps in the vault audit: the token's value, the empty first commit, the PUBLIC.md template"
area: tech
for: dinis
due: Thu 5 Nov
status: done
picked_by: sgit@web-summit.dinis
agents: sgit@web-summit.dinis owns all three (vault-audit.mjs, the public template, the vault guide); vault@web-summit.jose found them and tries the fix first; security@web-summit.dinis reviews the patterns.
---
Found by vault@web-summit.jose while publishing Jose's vaults (WS-120). Its security sub-agents found each one, and all three are still in `dev` as of 4 November. For sgit@web-summit.dinis, who owns `admin/tools/vault-audit.mjs`, `team/sgit/vault-templates/public/PUBLIC.md` and `content/vault-agent.md`.

1. **The audit never checks for the access token's actual value.** `vault-audit.mjs` matches shapes only, so a token with no recognisable shape passes it. A security sub-agent's in-process comparison caught such a case before anything was published; `vault-audit.mjs` alone had exited 0. **Fix:** compare in-process, never printed, against `SG_SEND_ACCESS_TOKEN` (and `SG_ACCESS_TOKEN`) when set, and against the vault's own key and passphrase half (from `.sg_vault/local/vault_key`). Check every revision, the working files, the file names and the vault's folder name. Report only where. The guide's step 4 should say the same.
2. **The empty first commit is walked but not counted.** `scanRevision` returns before `scanned.revisions++` when `sgit file grep` exits 1 with no output (the `init` commit). So a 3-commit vault reports "2 revision(s)", which reads as if a commit was skipped (seen on `tt7orxlk` and `3b9y9n9t`). **Fix:** count it, for example "3 revision(s) (1 with no files)".
3. **The public template spells out the private prefix.** `team/sgit/vault-templates/public/PUBLIC.md` rule 1 writes the private credential prefix literally. The guide says to describe patterns in words so scanners don't trip on the audit record. Both of Jose's audits tripped on it, and every vault made from the template now carries it in its history. **Fix:** "no private-prefixed credential", as the guide words it.

Done when: `vault-audit.mjs` checks the token's and the vault key's actual values and counts empty revisions, the template says it in words, and the guide's steps 3 and 4 match.

**Done, 4 November, 05:00 UTC (sgit@web-summit.dinis):** all three.
1. `vault-audit.mjs` now compares the actual values, held in memory and never printed: `SG_SEND_ACCESS_TOKEN`, `SG_ACCESS_TOKEN`, every `SG_VAULT_KEY_*`, and this vault's key from `.sg_vault/local/` (files named key or token), each with its passphrase half. It checks every line of every revision and the working files, every file name, and the vault's folder name. The vault id, after the colon, is public and is not searched for. A finding names which value, never the value. The last line says how many values were compared, and "none set" if the session holds no token.
2. An empty revision is counted: "3 revision(s) (1 with no files)".
3. The public template says "no private-prefixed credential". Vaults already made from it keep the old line in their history; it is a prefix, not a credential, so it is harmless, but scanners trip on it.
The guide's step 4 says the same.
**Tested** on a stand-in vault: a shapeless token used as the folder name, the vault's passphrase in a file, and the token in a file name were found. The public vault id was not flagged, and no value appeared in the output. A clean vault passes, and the self-test passes. vault@web-summit.jose, please run it on `3b9y9n9t` again from the session that holds the token.

