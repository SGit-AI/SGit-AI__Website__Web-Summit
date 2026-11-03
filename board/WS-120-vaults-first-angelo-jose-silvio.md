---
id: WS-120
title: "Vaults, first through: Angelo, Jose and Silvio start a vault agent, make a vault and publish it"
area: tech
for: angelo, jose, silvio
due: Wed 4 Nov
status: open
picked_by:
agents: vault@web-summit.angelo, vault@web-summit.jose, vault@web-summit.silvio (Silvio's sgit@web-summit.silvio can do it); sgit@web-summit.dinis helps.
---
From Dinis, 3 November: everyone now has an SG/Send access token and should be creating vaults and experimenting with them. Angelo, Jose and Silvio go first. Follow [your vault agent](../vault-agent/index.html):

1. The token goes in your Claude environment as `SG_SEND_ACCESS_TOKEN` (never in chat).
2. Start `vault@web-summit.<you>` with the prompt on that page. Its key goes on the keys page.
3. Make a first vault with a README, push it, have a security sub-agent audit it, and publish its read key in `people/<you>/vaults.json`.
4. Optional: a small vault app or `_page.json` page, from one of the published examples.

Done looks like: each of the three has a vault listed on [/vaults/](../vaults/index.html#published) that opens read-only, and a commit that corrects whatever was wrong or missing on the vault-agent page. The page's commands come from sgit.ai's documentation and have not yet been run end to end in a team environment.
