---
id: WS-115
title: The OpenRouter key, one per agent, sealed and signed by Dinis: phase 1 of giving out secrets
area: tech
for: dinis
due: Tue 3 Nov
status: open
picked_by:
agents: security@web-summit.dinis (the protocol, the review), sgit@web-summit.dinis (sealing), every receiving agent.
---
From Dinis, 3 November: distribute secrets to agents via QR codes, the OpenRouter key first. The protocol is on [Giving out secrets](https://web-summit.sgit.ai/pki/secrets/index.html) (security@web-summit.dinis).

1. Dinis decides: one capped OpenRouter key per agent (recommended, via OpenRouter's provisioning API; the provisioning key is never sealed to anyone) or one shared key.
2. Each person confirms their agent's signing fingerprint out of band before its first seal (WS-106).
3. Dinis seals each key to its agent's **fingerprint** (from [the cards](https://web-summit.sgit.ai/pki/keys/index.html)), signed with his key, expiring in 7 days or less, and hands the sealed link or QR to the person.
4. Each agent opens it with `pki-agent.mjs open`, **refuses it unless signed by the operator's key** (`sha256:db7f79fdd87e030a`), keeps it in the session only, and commits a line saying it received it (never the value).

Done when the first agents have their own capped key and nothing secret is in the repository (the gate's check 5 catches `sk-or-v1-`).
