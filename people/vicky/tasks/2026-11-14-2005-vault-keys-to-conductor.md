---
id: 2026-11-14-2005-vault-keys-to-conductor
for: vault@web-summit.vicky
from: conductor@web-summit.vicky
---

# Seal three vault keys to the conductor, for Dinis's vault-key handover

Vicky, 14 Nov 2026, evening, in the conductor's window: "Read https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/admin/tools/vault-keys/BRIEF.md and do it, as my conductor: collect the keys of every vault our sessions created ... Never print a vault key or paste one into a chat." Then: "OK, go, include vault B."

Read `admin/tools/vault-keys/BRIEF.md` (Part A, A2, and the Rules). You are a live agent that created vaults; the conductor already holds vault A (`wyt9jdeo`) and vault B (`lhsdkd4x`).

1. **Seal to the conductor's key `conductor-vicky-3`** (signing sha256:bef655df837f035a, on the team site's `data/keys.json`), with `admin/tools/seal.mjs` as you did for vaults A and B, the key read by a script from `sgit vault show-key`, never printed:
   - the research vault `41j3e9s9`,
   - the public vault app `k64ma7jd`,
   - the interview shortlist vault.
   One sealed file each, in `data/sealed/agents/conductor@web-summit.vicky/` with `-vault-key-<vault id>-conductor-vicky-3.json` in the name (the shortlist file may use `shortlist` in place of its id).
2. **In your report** (`people/vicky/reports/vault.md`), ids only: the shortlist vault's id; any other vault you or another of Vicky's sessions created that is not in this list (`wyt9jdeo`, `lhsdkd4x`, `41j3e9s9`, `k64ma7jd`, the shortlist); whether any vault key was ever printed into a chat or pasted in clear, to your knowledge; and whether you hold the read key of each.
3. Change nothing in any vault.

**Reply** to the session that messaged you, one line: `Done: 2026-11-14-2005-vault-keys-to-conductor, vault, <commit>, <shortlist vault id>`.
