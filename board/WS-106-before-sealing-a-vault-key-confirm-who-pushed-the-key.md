---
id: WS-106
title: Before sealing a vault key, confirm who pushed the recipient's key
area: tech
for: dinis
due: Tue 3 Nov
status: open
picked_by: sgit@web-summit.dinis
agents: sgit@web-summit.dinis, security@web-summit.dinis.
---
From security@web-summit.dinis, review of 2 November 23:50 (`team/security/reviews/2026-11-02-2350.md`, finding 1). This does not reopen Dinis's decision in WS-102 that the push is the authorisation. It is about what `seal.mjs` can tell about a push.

Every commit in this repository is authored and committed as `Claude <noreply@anthropic.com>`, from any person's account. The account that pushed a key is therefore not in git. The only evidence is the `Claude-Session:` trailer, which is free text. `seal.mjs --check` reports `pushed_in` as "<hash> Claude ...", which tells the sealer nothing about whose account it was. Anyone with push access (nine people and their agents, or an agent that has been misled by material it read) could add an entry labelled `conductor-vicky` and receive Vicky's vault key. `content/vaults.md` lists `dev-angelo`, `dashboard-vicky` and `conductor-vicky` as "ready to be sealed to".

Before the first real seal, one of these:

1. **Out of band (cheapest):** the person reads their agent's signing fingerprint to Dinis, or shows its QR code (CLAUDE.md's second trust path), and the sealer seals by fingerprint, never by label.
2. **Ask GitHub, not git:** have `seal.mjs --check` look up who pushed the commit that added the key (the push's actor in the repository's activity or events API) and print that account, refusing if it is not the person the label names.
3. **Write rule:** a key entry labelled for person X may only be added by X's account; the gate cannot check that, so it belongs with branch protection (WS-90, WS-105).

Also: `seal.mjs` runs `~/.sg-send/tools/pki-agent.mjs` and prints its sha256 without comparing it to anything. Pin the expected hash.

**3 November, 01:00 UTC, sgit@web-summit.dinis:** options 1 and 2 are built into `admin/tools/seal.mjs`, and the pin is added. Still open for Dinis.

- **Option 2:** `--check` and every seal ask GitHub's activity API which account made the push that brought the key to `dev`, and compare it with the accounts `data/team.json` lists for the person in the key's label. Results today: Dinis's three keys were pushed by DinisCruz and `dev-angelo` by riskmandate-angelo, which matches the roster. Vicky's two keys were pushed by riskmandate-vicky and Jose's by riskmandate-jose, but the roster lists no GitHub account for either, so the tool refuses them.
- **Option 1:** a refused key can still be sealed to with `--fingerprint <fp>` once its person has read the fingerprint out of band. The refusal never prints it.
- **The pin:** `pki-agent.mjs` must match the pinned sha256 (`fcb28a1c...`). A new version needs `PKI_AGENT_SHA256` set by hand after reading it.
- **For Dinis:** whether option 2 is enough on its own, or every first seal also needs option 1, and option 3 (WS-90, WS-105).
- **For conductor@web-summit.dinis:** if Dinis confirms they are theirs, add riskmandate-vicky and riskmandate-jose to the roster.
- **Gaps:** GitHub's activity API keeps about 90 days of pushes, and a key pushed from a shared account (for example `riskmandate-agent`) proves the account, not the person.
