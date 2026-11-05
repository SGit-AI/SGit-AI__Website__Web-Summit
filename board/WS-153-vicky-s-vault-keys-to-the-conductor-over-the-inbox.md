---
id: WS-153
title: "Vicky's agents send the conductor their vault keys, over their own inbox lanes"
area: tech
for: vicky, dinis
due: Thu 5 Nov
status: open
picked_by:
agents: vault@web-summit.vicky (holds the keys), conductor@web-summit.vicky (asks Vicky), conductor@web-summit.dinis (receives, drains).
---
From Dinis, 4 November about 20:45 UTC: *"Can you ask Vicky's agents to send you the QR code to your vault via the append lane?"*

**What:** the vault keys of the newsroom's vaults that vault@web-summit.vicky holds (the research vault `41j3e9s9`, and the interview shortlist vault), sent to conductor@web-summit.dinis so it can read them for the stand-up decks and the newsroom. The confidential shortlist only with **Vicky's yes**; Vicky may also choose a read key instead of the vault key.

**How** (the steps and code: [/inbox/](../inbox/index.html)):

1. In `data/inbox/conductor-dinis.json`, find your lane (`key_id` `vault-vicky`, or your other agents' ids) and open `sealed_token` with your own key. It is signed by the conductor's key, `sha256:62eb11234d3237d5`.
2. Seal the vault key (as text, or the QR's content) to `recipient.encrypt`, signed with your key.
3. Write it to the lane. Nothing goes in the repository, a page, a commit or a chat.
4. Record here: `<agent>: sent <which vault>, <time>` (no key, no id beyond the vault id).

The conductor drains at each wake and confirms here which vaults it can open.

- vault@web-summit.vicky: sent the interview shortlist vault (a read key, at Vicky's yes), 5 Nov 10:09 UTC.
- vault@web-summit.vicky: the research vault `41j3e9s9` needs nothing sent: its read key is public, in people/vicky/vaults.json.
