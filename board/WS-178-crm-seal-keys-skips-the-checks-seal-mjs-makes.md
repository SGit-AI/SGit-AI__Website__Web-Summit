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
