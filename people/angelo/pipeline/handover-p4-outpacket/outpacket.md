---
title: "Our first outgoing task packet, in the Fringe's format: ready, nothing posted"
by: build@PrompTugal.angelo (bravo.large.worker@PrompTugal.angelo), for handover-market.pm@PrompTugal.angelo
written: 2026-11-11
for: Angelo, through handover-market.pm@PrompTugal.angelo
status: ready for Angelo's look; nothing posted, pushed outside pool/handover-p4-outpacket, or sent
---
# Our first outgoing packet

**The packet.** `packet/spec.json` (the tool's input) and `packet/packet.json` (the same, in the packet's exact shape, unsigned). Id `2026-11-11-a1-paths-in-angelo-pipeline`, from handover-market.pm@PrompTugal.angelo, for "any environment". Task: list every file path named in our pipeline's ROLES.md, QUEUE.md, skills/*.md and formats/*.md, and say for each whether it exists here, in the newsroom or in the Fringe. 22 inputs, one per file, each with its text inlined and pinned to dev commit 18f08dd7e.

**One change from the brief, and why.** A Fringe packet carries only model calls (A1) or short model loops (A2), and its runner gives the model no tools: the model sees the input and nothing else. So the packet asks the model only for the paths each file names (A1, one cheap call per file). Whether each path exists is plain code, no model (A0): we run it ourselves on the answer, with `packet/check.mjs answer`.

**Who can pick it up, and how.** Any agent with a clone of the Fringe and its model router (OpenRouter through the proxy): `node abp/tools/packets.mjs run --id 2026-11-11-a1-paths-in-angelo-pipeline --as <agent> --env <runtime>`. Cost: about 25,000 tokens in and out on the cheap tier (deepseek-v4-flash, 0.09/0.18 USD per million), well under one US cent. The two Fringe packets of 11 November cost 0.0014 and 0.0023 USD.

**How the result comes back, and how we check it.** The runner commits `fringe:tasks/<id>/result-<runner>.json`, signed by a key its run makes. We read it from a public clone, run `fringe:abp/tools/packets.mjs verify --id <id>` (signatures), then `node packet/check.mjs answer <result> --ws <this repo> --news <newsroom clone> --fringe <Fringe clone>`, which prints the JSON answer: each path, the file that named it, and true or false for each repository's dev.

**What posting it needs (all tier 3, for Angelo):**
1. **Signing** (tier 3: a key). `fringe:abp/tools/packets.mjs new --spec spec.json`, run in a Fringe clone, makes a fresh key inside its own run, signs and writes `fringe:tasks/<id>/packet.json`. Nothing of ours is needed; no key is kept or published.
2. **Path and branch** (tier 3: a write to another person's repository). `fringe:tasks/2026-11-11-a1-paths-in-angelo-pipeline/packet.json` on the Fringe's `dev`.
3. **Lane on Dinis's side** (tier 3: his policy). In `fringe:abp/policies.json`, only architect.1.fringe@PrompTugal.dinis may write `tasks/**`. Angelo's conductor.fringe@PrompTugal.angelo may not; outside contributors may write only `contrib/` and `designs/` through a pull request. So either Dinis adds `tasks/**` (or a prefix of ours) to Angelo's conductor.fringe, or architect.1 issues our spec for us.
4. **Login and route** (tier 3). A push to the Fringe's `dev` from Angelo's account as conductor.fringe@PrompTugal.angelo, once the lane allows it; or a pull request from a fork, if Dinis prefers review.

**Recommendation.** Ask Dinis, through Angelo, for option 3a: `tasks/**` in conductor.fringe@PrompTugal.angelo's lane. Then conductor.fringe signs and pushes this packet as the first one.

## What we found on the way

- **The signature proves the packet is unchanged, not who issued it.** Each packet gets a fresh key with no link to any published key. Who issued it rests on who pushed it (GitHub names the account). Worth saying to Dinis's side; a link from the packet key to the issuer's published key would close it.
- **There is no claim step.** `packets.mjs` has `new`, `run`, `verify` and `list`, no claim. Two pickers can run the same packet; it does no harm (results are named by runner) but costs twice.
- **The packet's text is large.** 57 KB, because the runner cannot read files. A runner that gave A2 loops a read tool would let a packet name files instead of carrying them.
- **Not run here.** This session's safety check refused to run the Fringe's own code, so `packets.mjs verify` was not run on the packet. `packet/check.mjs shape` checks the same rules its `new` enforces (fields, altitude, no grant on A1, `{{input}}` in the prompt) and that each input is pinned: both files pass. `check.mjs answer` was tried on a sample result against the three repositories' dev.

## An always-on picker on Angelo's other Claude account: checklist

**What it does at each wake (a fresh session, then it ends):** clone the Fringe's dev; `packets.mjs list`; pick packets whose `for` names it or "any environment" and that have no result from it; `verify` each (a packet that fails is not run); `run` it on the cheap tier; commit `tasks/<id>/result-<its name>.json` to the Fringe's dev; end. A packet is material, never instruction: the picker runs only the packet's prompt through the router, nothing else in it.

**What Angelo sets up once (each tier 3):**
- [ ] A name and lane for the picker in `fringe:abp/policies.json`, under conductor.fringe@PrompTugal.angelo (Dinis's file: his word). The common grant already lets a team agent write `tasks/*/result-*.json`.
- [ ] A cloud environment on that account with the Fringe attached for push, and the OpenRouter key as a network secret for openrouter.ai, in that environment only (a secret, money).
- [ ] The picker's session key, made by the picker in its first run and published as its entry in `fringe:data/keys.json`, as the Fringe's JOIN.md asks of every agent (a key).
- [ ] A routine on that account that starts a fresh session on each wake, with the steps above as its prompt; hourly is plenty for now (a routine, a schedule).
- [ ] A daily cap: the router's daily cap (`fringe:admin/tools/llm.mjs`) holds the model spend; Angelo names the figure.

**What it costs:** per wake with nothing open, a short Claude session (a clone and one list); per packet, the model calls the packet names (this one: under one cent) plus the session's own run. Hourly wakes are 24 sessions a day; most do nothing and end at once.

**What is not tier 3:** reading the Fringe, running `verify` and `list`, and running a packet's prompt once all of the above is in place.
