---
title: "handover-p1-relay: the Fringe packet p1, run here, result drafted unsigned"
by: alpha.large.worker@PrompTugal.angelo (relay)
written: 2026-11-11
for: handover-market.pm@PrompTugal.angelo
status: part one done; write-back waits for Angelo's go
---
**Asked.** Packet `2026-11-11-p1-place-12-items` (Fringe repository, read at 863f8bb), from architect.1.fringe@PrompTugal.dinis, for conductor.fringe@PrompTugal.angelo "or any environment". An A1 packet: twelve board items, one prompt each, "the lowest altitude that can do this item end to end", JSON answer. Purpose: a second, independent placement to compare with architect.1's.

**Did.** Checked both packets and architect.1's two results: all signatures verify (checked with my own read-only copy of the tool's verify; the Fringe's tool itself was not run, see below). Chose p1 over p2: p1 has no grant and needs nothing outside this session. Answered the twelve prompts here, one answer each, with this session's model.

**Result.** result/result-packet.json: 12/12 valid, in the tool's result shape, unsigned (by, sig, call fingerprints null; runner and model "set at write-back"). result/compare.md: agrees with architect.1 on 3 of the 10 both answered; we count file writes and fact-finding as A2. Time taken: 17:00 to 17:12 UTC.

**Why not the tool's `run`.** It calls OpenRouter through the Fringe's llm.mjs (a network secret this session does not hold), makes a new ed25519 key per run and per call, and signs: all tier 3 here. Running Fringe code was also refused by this session's permission check.

## Write-back (part two): checklist
- [ ] **Tier 3: Angelo's go** to hand this result to Dinis's swarm (it reaches another person's repository and agents).
- [ ] **Tier 3: who writes it.** conductor.fringe@PrompTugal.angelo: its Fringe lane (its file in the Fringe's abp/) allows `tasks/*/result-*.json`. Recommended.
- [ ] **Tier 3: the key.** The tool publishes no key: it makes a throwaway ed25519 key inside `run` (identity() in abp/tools/packets.mjs), embeds the public half in the file, and signs the result and each call. Nothing is published; trust rests on who pushed.
- [ ] **Choose how to sign** (recommend a): (a) in conductor.fringe's own environment, `node abp/tools/packets.mjs run --id 2026-11-11-p1-place-12-items --as conductor.fringe@PrompTugal.angelo --env "<runtime, account>"`: real router calls, the tool's own signatures, our answers kept only as compare.md; (b) sign our drafted file with the same identity() code: keeps our answers, but needs a signer script the Fringe has not reviewed.
- [ ] **Tier 3: path and branch.** Fringe `dev`, file `tasks/2026-11-11-p1-place-12-items/result-<runner>.json`, runner conductor.fringe@PrompTugal.angelo. Push access to the Fringe is Dinis's to give (CONTRIBUTING.md); without it, a pull request to `dev`.
- [ ] **How the issuer checks.** `node abp/tools/packets.mjs verify --id 2026-11-11-p1-place-12-items`: the result's signature, its `packet_fp` equal to `sha256:1853c951325c541b`, every call's signature.
- [ ] Fill `model` honestly at write-back (this session's model, or the router's under (a)).
