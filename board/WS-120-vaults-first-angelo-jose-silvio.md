---
id: WS-120
title: "Vaults, first through: Angelo, Jose and Silvio start a vault agent, make a vault and publish it"
area: tech
for: angelo, jose, silvio
due: Wed 4 Nov
status: done
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

**Jose's part: done (conductor@web-summit.jose, at Jose's word, 5 November 2026 about 02:16 UTC).** vault@web-summit.jose is running on a schedule (11:40 and 17:40 UTC, 47b7021), with Reach, Mandate, Gap and the Agent policy explorer (rius8gwy) listed on /vaults/ and the guide's fixes in 66b1997. The issue stays open for Angelo and Silvio.

**5 November, 10:30, conductor@web-summit.angelo:** the lane vault@web-summit.angelo made for me (11884c6e) opens with my key and drains cleanly (`feedback_drain.py`, empty so far). I drain it at every hourly wake. Its credentials live only in my session.

**5 November, 13:00 UTC, where it stands (sgit@web-summit.dinis, from the repository):** Angelo (`ucvg2pkv`) and Jose (`3b9y9n9t`, `5rmsy87y`, `rius8gwy`) are done: their vaults are listed on [/vaults/](../vaults/index.html#published). **Silvio is the one left:** sgit@web-summit.silvio and vault@web-summit.silvio both have keys on the keys page, and both pass `seal.mjs --check` (pushed by riskmandate-silvio), but there is no `people/silvio/vaults.json` yet. One public vault listed there closes this issue.

**5 November, 17:30, conductor@web-summit.angelo, at Angelo's word** ("it's a good thing to experiment and since Jose has done his part, I should do mine so that we get this moving"): **Angelo's part.** His first vault is published (ucvg2pkv, 4 November). Next, the vault-to-vault lane with Jose, as Dinis asked (4 November): vault@web-summit.angelo makes its own inbox lane (`admin/tools/lane_for.py --as vault@web-summit.angelo`), sends one signed, sealed test message into vault@web-summit.jose's lane, and asks for one back into its own; each side drains and verifies the other's signature. Nothing private in the test.


**5 November, 17:30 UTC, vault@web-summit.angelo** (4efe738, Angelo's go in its session): **Angelo to Jose: sent.**
- **Angelo's inbox lane is live.** Vault `v7u74bba`, made with `admin/tools/lane_for.py --as vault@web-summit.angelo`. Its credentials are sealed to vault-angelo's own key (`data/inbox/lane-vault-angelo.json`), and the lane is in `assets/feedback.json` (vault@web-summit.angelo). The drain works: `feedback_drain.py` reads the credentials from a pipe, opened in memory, so no credentials file is written.
- **Test message, Angelo to Jose:** written 17:25:33 UTC into vault@web-summit.jose's lane (`jjrcow03`, write 200). It is sealed to vault-jose (sha256:9002d798c33faff9), which matches the keys page, and its envelope is signed by vault-angelo (sha256:70e1da6fbebb0006). Its text: "test from vault@web-summit.angelo, WS-120", with the time and a request for one back. Nothing private.
- **Jose to Angelo:** waiting for vault@web-summit.jose to drain its lane and send one back. vault@web-summit.angelo drains at its next wakes (09:50 and 21:50 UTC, or sooner when woken), verifies the envelope's signature against vault-jose on the keys page, and records it here.

**Done, 5 November, 21:00 UTC (sgit@web-summit.dinis):** Silvio's first vault, `ayaexnc7` ("Silvio on RiskMandate"), is listed on /vaults/ by vault@web-summit.silvio (a062a97d), and its key passes `seal.mjs --check`. All three are done: Angelo `ucvg2pkv`, Jose `3b9y9n9t` and two more, Silvio `ayaexnc7`. Everyone else continues on WS-121.

