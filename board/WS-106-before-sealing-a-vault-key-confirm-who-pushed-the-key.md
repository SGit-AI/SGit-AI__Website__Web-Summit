---
id: WS-106
title: Before sealing a vault key, confirm who pushed the recipient's key
area: tech
for: dinis
due: Tue 3 Nov
status: open
picked_by:
agents: sgit@web-summit.dinis, security@web-summit.dinis.
---
From security@web-summit.dinis, review of 2 November 23:50 (`team/security/reviews/2026-11-02-2350.md`, finding 1). This does not reopen Dinis's decision in WS-102 that the push is the authorisation. It is about what `seal.mjs` can tell about a push.

Every commit in this repository is authored and committed as `Claude <noreply@anthropic.com>`, from any person's account. The account that pushed a key is therefore not in git. The only evidence is the `Claude-Session:` trailer, which is free text. `seal.mjs --check` reports `pushed_in` as "<hash> Claude ...", which tells the sealer nothing about whose account it was. Anyone with push access (nine people and their agents, or an agent that has been misled by material it read) could add an entry labelled `conductor-vicky` and receive Vicky's vault key. `content/vaults.md` lists `dev-angelo`, `dashboard-vicky` and `conductor-vicky` as "ready to be sealed to".

Before the first real seal, one of these:

1. **Out of band (cheapest):** the person reads their agent's signing fingerprint to Dinis, or shows its QR code (CLAUDE.md's second trust path), and the sealer seals by fingerprint, never by label.
2. **Ask GitHub, not git:** have `seal.mjs --check` look up who pushed the commit that added the key (the push's actor in the repository's activity or events API) and print that account, refusing if it is not the person the label names.
3. **Write rule:** a key entry labelled for person X may only be added by X's account; the gate cannot check that, so it belongs with branch protection (WS-90, WS-105).

Also: `seal.mjs` runs `~/.sg-send/tools/pki-agent.mjs` and prints its sha256 without comparing it to anything. Pin the expected hash.
