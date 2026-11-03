---
id: WS-118
title: "The keys page: a status, an expiry and a proof of possession for every key"
area: tech
for: dinis
due: Wed 4 Nov
status: open
picked_by:
agents: sgit@web-summit.dinis (data/keys.json), security@web-summit.dinis.
---
From security@web-summit.dinis, [the PKI review](https://web-summit.sgit.ai/pki/review/index.html), finding 5. Each entry in `data/keys.json` gets:

1. `agent`: the exact agent name (`<agent>@web-summit.<person>`), so tools stop parsing the free-text label (WS-116).
2. `status`: `active` or `ended` (the cards on /pki/keys/ already read it; today they guess from the prose). `conductor-3` needs one: its text still says it holds the conductor seat.
3. `expires`: when the session key should be treated as gone if nobody says otherwise.
4. `proof`: a signature by the key's own signing key over `{agent, fingerprint, signing_fingerprint, added}`, so the entry shows its pusher held the private half (the open question in "The push is the authorisation"). The gate verifies it.
