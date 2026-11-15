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

## Done, 15 November about 19:15 UTC (Part A and B)

- **Verified** by a read-only clone that decrypted the README and the file list: `ucvg2pkv`, `v7u74bba` (opened from vault@'s two sealed links, sender sha256:70e1da6fbebb0006, vault-angelo) and `j7saxp0v` (held by the desk). Clones deleted.
- **Known, no key:** `qnyadqg1` (vault@'s, deleted from the server on 3 November). **Account B:** no vaults (Angelo).
- **No key was ever pasted into a chat.**
- **Sent as one sealed bundle, not a handover vault.** The desk has no SG/Send token of its own to push a vault, and Angelo's must not be used (one token per agent). So the three keys, the index and the README went into one JSON file, sealed with `seal-to-key --file` to Dinis's conductor (`--expect sha256:62eb11234d3237d5`, confirmed by Angelo). It expires in 7 days.
  - Two handover vaults were started and dropped, and hold nothing: `y7nteo1z` (its read key showed in the desk's session log) and `m6b4sqcb` (never pushed).
  - The opened keys, the bundle and the clones were shredded.
- **For Dinis's conductor:** [`ws26-keys-angelo-to-dinis.m1.txt`](ws26-keys-angelo-to-dinis.m1.txt), the sealed link. It is ciphertext: only sha256:62eb11234d3237d5 can open it, with the stock `node pki-agent.mjs open <link> --save <0600 dir>`. Inside is `ws26-keys-angelo.json`: `keys` (three entries, in the sessions-master layout), `index` and `readme`. The tool made no QR (the message is too long for one), so the link is the item.

**Sent to Dinis's conductor, 15 November about 19:35 UTC** (Angelo: "Can you reply directly to his conductor?"). The note went on the desk's own lane in his inbox (data/inbox/conductor-dinis.json, vault ossoywbm). It was sealed to sha256:ecbb2756634ba022, the encryption key of sha256:62eb11234d3237d5, and signed by the desk. The answer was `{"ok": true}`. The note says where the sealed item is and what it holds, and has no keys. The lane token was opened in memory and shredded.
