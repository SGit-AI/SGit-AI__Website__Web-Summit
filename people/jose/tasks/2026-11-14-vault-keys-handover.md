---
for: dinis, conductor@web-summit.dinis, vault@web-summit.jose, jose
from: conductor@web-summit.jose, at Jose's word (14 November 2026)
date: 2026-11-14
due: when Jose sends the sealed QR
status: open
---
# Jose's vault keys for Dinis's conductor: the report, and one key still to collect

On Dinis's brief of 13 November (`admin/tools/vault-keys/BRIEF.md`), at Jose's word in the conductor's session on 14 November ("let's proceed", then "proceed with all the instructions"). No key is in this file, in the commit or in the chat.

## Report (conductor@web-summit.jose, 14 November 2026)

- **Handover vault:** `7zb2qu4r` (`ws26-keys-jose`, dev.send.sgraph.ai), pushed, one commit, checked by a fresh clone. Its key is sealed to `sha256:62eb11234d3237d5` (conductor.3@web-summit; the published bundle's fingerprint matched the brief's), signed by `sha256:006ceb9a9e3febbe`, expires in 7 days. The QR read back as kind sealed, to that fingerprint. **Jose carries the QR or its link to Dinis**; before he does, he compares the fingerprint with the one in Dinis's message to him.
- **Six vaults** were created by Jose's agents' sessions. **Five keys are in the handover vault**, each verified on 14 November by a read-only clone and fetch that decrypted the README and the file list:

| Vault id | What | Created by | Key sent | Shown in a chat |
|---|---|---|---|---|
| `1ssnjy23` | ws-observability-data, private (WS-37) | conductor@web-summit.jose, 4 Nov | yes | yes (handed to Jose, 4 Nov) |
| `5rmsy87y` | ws-observability-ux, read key public | conductor@web-summit.jose, 4 Nov | yes | not known |
| `3b9y9n9t` | Reach, Mandate, Gap, read key public | vault@web-summit.jose, 3 Nov | yes | yes (handed to Jose, 4 Nov) |
| `tt7orxlk` | Jose on RiskMandate, unlisted (WS-120) | vault@web-summit.jose, 3 Nov | yes | yes (handed to Jose, 4 Nov) |
| `jjrcow03` | jose-inbox, private, the feedback lane | vault@web-summit.jose, 4 Nov | yes | yes (handed to Jose, 4 Nov) |
| `rius8gwy` | Agent policy explorer, read key public | vault@web-summit.jose, 4 Nov | **no** | yes (shown to Jose, 4 Nov, about 11:45 UTC) |

- **Missing: `rius8gwy`.** Its key was never in the conductor's environment; it is in vault@web-summit.jose's session and, if he saved it, Jose's password manager. See the task below.
- **For rotation:** the five keys marked yes above. "Handed to Jose" is the repository's record (`people/jose/lanes/README.md`, `people/jose/observability/README.md`, `people/jose/tasks/2026-11-05-all-one-door.md`); the conductor did not read the sessions.
- **Held, not created by Jose's sessions, not sent:** `5n0aocvz` (ws-team-crm-private, made by conductor@web-summit.dinis). crm@web-summit.jose reported local commits in its clone that were never pushed (vault commit `9cdb4fbc`; the 31 connections of 11 November).
- **Jose's other agents** (dev, dashboard, designer, automation, helper, watcher, sales-coach, crm, writer@PrompTugal.jose, conductor.fringe@PrompTugal.jose): the repository records no vault created by any of them. That is from the repository, not from their sessions.
- **WS-154:** this supersedes Jose's hold on the observability keys: the data vault's key is in the handover.
- The opened key files and the verify clones are shredded. The handover vault's clone stays in the conductor's session until `rius8gwy` is added or Jose says to drop it.
- Not run: reviewer@web-summit.jose on this commit (two files of prose, no key; the gate's secrets check ran).

## For vault@web-summit.jose (or Jose): the key of `rius8gwy`

Either:

1. **vault@web-summit.jose**, when Jose wakes it (its task is off, A-28): follow the brief's Setup and step A2, sealing to the conductor's published key (keys page `conductor-jose`, signing `sha256:006ceb9a9e3febbe`, encryption `sha256:5dc78b978e0a1750`) with `seal-to-key --from-vault <its rius8gwy folder>`, and give Jose the QR for the conductor. Never print the key. Report below.
2. **Jose**, from his password manager: the brief's step A3 (the conductor's send link, sealed in the browser), never pasted into a chat.

The conductor then verifies it, adds `keys/rius8gwy.json` to the handover vault and pushes; the sealed QR Jose already holds stays valid, since it carries the handover vault's key.

**Done when:** Dinis's conductor confirms it opened the handover vault, and `rius8gwy` is in it or recorded as not recoverable.

## Report
