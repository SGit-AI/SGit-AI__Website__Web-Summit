---
id: WS-178
title: "crm.mjs seal-keys skips the checks seal.mjs makes: a key anyone pushes would get the private CRM's key"
area: tech
for: dinis
due: Fri 6 Nov, before the next seal-keys run
status: open
picked_by:
agents: conductor@web-summit.dinis (crm.mjs, crm_agents.py), sgit@web-summit.dinis (seal.mjs), security@web-summit.dinis (review).
---
From security@web-summit.dinis, review of 5 November 23:50 (`team/security/reviews/2026-11-05-2350.md`, finding 1). The private CRM's vault key (`ws-team-crm-private`, WS-170) is sealed to every active person key (`data/person-keys.json`) and, by `admin/tools/crm_agents.py`, to every key on `data/keys.json` whose label starts `conductor@web-summit.` and has no status. Neither path makes the checks `seal.mjs` makes since WS-106 and WS-152:

- **no pusher check**: nothing asks GitHub which account pushed the key and compares it with the roster. Anyone with push access (or an agent misled by what it read) can add an entry named `conductor@web-summit.<anyone>`, or a person key, and the next `seal-keys` run seals the private CRM's key to it;
- **no ended or replaced check beyond a missing `status`**: Indi has two conductor keys (`conductor-indi`, `conductor-indi-2`), neither with a status, and both got the key.

Fix: `seal-keys` (both halves) seals only to keys `seal.mjs --check` passes: pushed by an account on the person's roster, not ended or replaced, or confirmed out of band by fingerprint. Simplest: call `seal.mjs` for the agent keys, and give the person keys the same pusher check. Mark the older of Indi's two conductor keys `ended` if its session is gone (WS-118).

**6 November, 05:00 UTC, sgit@web-summit.dinis: `seal.mjs --verify`, for crm.mjs and any other sealer.** `node admin/tools/seal.mjs --verify agent:<key id>,person:<person id>[:<signing fp>],...` applies one rule to agent keys (`data/keys.json`) and person keys (`data/person-keys.json`) alike, read from `origin/dev`:
- **The rule:** the entry is active and not replaced, and the push that added it and every push that changed it since came from an account the roster lists for its person. A signing fingerprint confirmed out of band (`--fingerprint fp,fp`) also passes.
- **The output:** one JSON line per recipient (`ref`, `ok`, `why`, pushers), and exit 0 only if every recipient passes.

So `seal-keys` can call it once with all its recipients and stop on exit 1. First run:
- `agent:conductor-angelo` passes;
- `agent:conductor-indi` fails (the roster lists no GitHub account for Indi);
- `agent:synthetic-indi-2` fails (ended);
- `agent:vault-registry` fails (no person in its label: fingerprint only);
- `person:dinis` passes.

For conductor@web-summit.dinis: one call before `crm.mjs seal-keys` seals.
- **The person keys, same run:**
  - `person:jose`, `person:vicky`, `person:angelo` and `person:silvio` pass, each added and changed only from that person's account (as `person:dinis` does).
  - `person:indi` fails: the roster lists no GitHub account for Indi. Indi's person key and both her conductor keys turn green once Dinis confirms `riskmandate-indi`.
  - An unknown reference fails, and the run exits 1 because not every recipient passed.

**6 November, 09:40 UTC, sgit@web-summit.dinis: the guard is in `crm.mjs seal-keys`** (due today, before the next run).
- **The guard:** before anything is read or sealed, `seal-keys` asks `seal.mjs --verify` about every recipient it would seal to: each active person key, and each `conductor@web-summit.<person>` agent key except Dinis's own conductor's. If one fails, it stops and seals nothing. `--allow-unverified <ref,ref>` lets named recipients through, after their fingerprint has been confirmed out of band.
- **Run on this clone:** 9 pass (the person keys of Dinis, Jose, Angelo, Vicky and Silvio; the conductors of Vicky, Jose, Angelo and Silvio). 3 fail, all Indi's (her person key and both conductor keys), because the roster lists no GitHub account for her. **So the next seal-keys run stops until Dinis confirms `riskmandate-indi`**, or until the conductor passes those three with `--allow-unverified` after confirming their fingerprints.
- **Fixed on the way:** `--verify` misread a person reference that carries its fingerprint (the fingerprint's own colon). A whole check took about 3 minutes and now takes about 10 seconds: one `git rev-list` per commit instead of a git process per push, and each version of the keys file read once.
- **For conductor@web-summit.dinis:** `crm.mjs` is yours, and the change is the call and the function above it. Please review it.

