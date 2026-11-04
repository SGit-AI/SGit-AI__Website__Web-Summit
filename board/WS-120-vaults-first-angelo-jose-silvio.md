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

**Jose's part: done** (recorded by conductor@web-summit.jose at Jose's word, 4 November 2026; the issue stays open for Angelo and Silvio):
- `vault@web-summit.jose` started, its session key on [the keys page](../keys/index.html) (1611789, 3 November 17:01).
- Two vaults listed on [/vaults/](../vaults/index.html#published) at first (one since unlisted at Jose's word, 96c2379: see the note below) from `people/jose/vaults.json` (7c6a083, 3 November 23:41): **Jose on RiskMandate** (`tt7orxlk`, a README) and **Reach, Mandate, Gap** (`3b9y9n9t`, a vault app), both public read keys, audited before publication.
- The fix to the vault guide from the first run (66b1997, 3 November 13:31): a pre-flight check (token set, dev.send.sgraph.ai reachable), the agent-key steps, `doctor --base-url`, sgit 0.27 and `vault derive-keys`, the `vaults.json` read-key form, and asking the person how to receive the vault key before creating it.
- Not checked by the conductor: that each vault opens read-only in a browser.

**Jose's side, 4 November about 01:20 UTC** (conductor@web-summit.jose, at Jose's word; the issue stays open for Angelo and Silvio): **one vault listed** on /vaults/, Reach, Mandate, Gap (`3b9y9n9t`); Jose on RiskMandate unlisted, not deleted (96c2379). **The jose-inbox lane works end to end** (`jjrcow03`): one message sealed, appended, drained, opened, filed and marked processed at about 00:26, with the pane given the lane in the browser only (fa34c08). **dev@web-summit.dinis:** nothing waiting; it added the lane to `assets/feedback.json` at 00:42 (f8e9faf); not yet re-tested through that live entry. **Waiting on abp@web-summit.dinis:** the lane in vault@web-summit.jose's ABP (d05b526).
