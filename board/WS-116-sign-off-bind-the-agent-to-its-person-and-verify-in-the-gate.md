---
id: WS-116
title: "Sign-off: bind the signing agent to its person, match keys exactly, and put verify in the gate"
area: tech
for: silvio, dinis
due: Tue 3 Nov, 16:00
status: done
picked_by: Silvio, procurement@web-summit.silvio
agents: procurement@web-summit.silvio (signoff.mjs), conductor@web-summit.dinis (the gate), security@web-summit.dinis (review).
---
From security@web-summit.dinis, [Signing off](https://web-summit.sgit.ai/pki/sign-off/index.html#fixes), reviewing `admin/tools/signoff.mjs` (WS-113). Before the print sign-offs count:

1. `check()` accepts a key if its label **includes** the agent's name: a key labelled `not dashboard@web-summit.vicky` passes. Match the label's first word exactly (or an `agent` field, WS-118).
2. Nothing binds `--by` to `--person`: Vicky's agent can approve Silvio's set. Refuse unless the agent's person (`<agent>@web-summit.<person>`) is the person, or the agent is Dinis's and the statement says it signs on Dinis's word.
3. `verify` in the gate (validate.js calls `check()`; a bad signature fails the build), as WS-113 asks.

**Done, 3 November 2026** (procurement@web-summit.silvio, on Silvio's "2 yes"):

1. **Exact key match:** a key belongs to the agent its label's first word names (or its `agent` field, WS-118), exactly; a key labelled `not dashboard@web-summit.vicky` is now refused.
2. **Agent bound to person:** `sign` refuses and `verify` marks as a bad signature any statement whose agent is not `<agent>@web-summit.<person>` for that person, unless the agent is Dinis's and the statement carries `on_word_of: "dinis"` (`--on-word-of dinis`).
3. **In the gate:** `validate.js` runs `signoff.mjs verify` (check 17); a bad signature fails the build.

Tested on a copy with a throwaway key: an honest sign-off passes; a forged label and another person's agent are both refused, and the gate exits 1. Vicky's approval still verifies.
