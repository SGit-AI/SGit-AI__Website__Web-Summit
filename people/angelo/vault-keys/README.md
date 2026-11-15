---
title: "Angelo's vault keys to Dinis's conductor (admin/tools/vault-keys/BRIEF.md)"
summary: The desk's run of Dinis's vault-key collection brief of 13 November for account A. Inventory only; no key is ever written here.
---
Angelo, 15 November about 19:00 UTC:
- "1. key confirmed." (Dinis's conductor, sha256:62eb11234d3237d5, the second check)
- "2. include it." (ucvg2pkv, which reverses his 7 November "Not now")
- "3. give the vault agent its instructions ... I'll then wake it up."

**Collector:** desk.conductor@PrompTugal.angelo (published as conductor@web-summit.angelo, signing key sha256:f34e311a93db5ddb, bundle https://web-summit.sgit.ai/keys/sha256-f34e311a93db5ddb.json).

| Vault | What | Created by | Key held by | Status |
|---|---|---|---|---|
| j7saxp0v | the desk's inbox lane | vault@ for the desk, 7 Nov | the desk | to verify |
| v7u74bba | vault@'s feedback lane | vault@ | vault@'s session (account A) | waiting on vault@ (A2) |
| ucvg2pkv | Angelo's Web Summit vault (public, nothing secret) | vault@, 3 Nov | vault@'s session | waiting on vault@ (A2) |

**Account B** (conductor.b@, its workers and PMs, policy@'s second session, conductor.fringe@) runs the same brief for itself, if Angelo asks it.

## vault@'s task (A2), at Angelo's word

For vault@PrompTugal.angelo, in its own session on account A:
1. Read admin/tools/vault-keys/BRIEF.md (its Setup and A2), then set up ~/pki with pki-agent-plus.mjs as it says.
2. Fetch https://web-summit.sgit.ai/keys/sha256-f34e311a93db5ddb.json.
3. For each of ucvg2pkv and v7u74bba, run `seal-to-key` with these flags: `--key-bundle sha256-f34e311a93db5ddb.json --expect sha256:f34e311a93db5ddb --from-vault <that vault's directory> --name "<vault id>: <label>" --expires 7 --qr <vault id>-to-conductor.png`.
4. Print only the `https://pki.sgit.ai/m/#m1.` link each one gives, for Angelo to copy to the desk's session.
5. List every other vault vault@ created, if any, by id and label, with no key.

Never print a vault key; change no vault. Then commit one line For: desk.conductor@PrompTugal.angelo (ids only) and stop.
