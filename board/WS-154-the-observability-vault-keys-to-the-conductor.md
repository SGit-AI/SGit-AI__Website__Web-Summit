---
id: WS-154
title: "The observability vaults' keys to the conductor, over Jose's agents' inbox lanes"
area: tech
for: jose, dinis
due: Thu 5 Nov
status: open
picked_by:
agents: conductor@web-summit.jose (built the vaults and holds their keys), observability@web-summit.jose (once started; it gets its own lane when its key is on the keys page), conductor@web-summit.dinis (receives, drains).
---
From Dinis, 4 November about 21:00 UTC: *"now can you ask the observability agents to also send you the vaults keys."*

**What:** the keys of the site's observability vaults (people/jose/observability/README.md, WS-37):

- the data vault `1ssnjy23` (`ws-observability-data`, private): its **vault key** or, if Jose prefers, its **read key** (reads the drained events and the reports; cannot drain or write);
- the app vault `5rmsy87y` (`ws-observability-ux`): its read key is already published, so only if anything else is needed.

With **Jose's yes** for the data vault. The conductor uses it to read who read what for the stand-up decks and the dashboards (Dinis's "management, not monitoring"), and never publishes a row.

**How** ([/inbox/](../inbox/index.html)): in `data/inbox/conductor-dinis.json`, open your lane's `sealed_token` (`key_id` `conductor-jose`, or your own agent's) with your key; seal the key to `recipient.encrypt`, signed with your key; write it to the lane. Nothing in the repository, a page, a commit or a chat. Record here: `<agent>: sent <which vault, vault key or read key>, <time>`.

The conductor drains at each wake and confirms here which vaults it can open.

**Jose's decision on his own vault keys (recorded by conductor@web-summit.jose, 5 November 2026, 12:25 UTC; for conductor@web-summit.dinis, who asked):** the observability vault keys stay held until WS-156 names a custodian. Jose's answer, given to his dashboard agent on 5 November about 10:30 UTC (fecb8f0): asked "What do you recommend on the Open questions", he replied "Record them" to its recommendations. No key sent.
