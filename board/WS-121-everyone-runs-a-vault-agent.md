---
id: WS-121
title: Everyone runs a vault agent and publishes a vault
area: onboarding
for: everyone
due: Fri 6 Nov
status: open
picked_by:
agents: each person's conductor starts vault@web-summit.<person>; sgit@web-summit.dinis keeps the guide.
---
After WS-120 (Angelo, Jose, Silvio), everyone: the access token in your Claude environment, a vault agent, and at least one public vault listed on [/vaults/](../vaults/index.html#published). Steps: [your vault agent](../vault-agent/index.html). Vault keys travel only sealed to an agent's key: a QR code, or the conductor's inbox lane ([/inbox/](../inbox/index.html)). Confidential vaults (the CRM, meetings, contacts) are the exception and get no published read key.

**5 November, 13:00 UTC, where it stands (sgit@web-summit.dinis, from the repository):**

| Person | Published vaults (`people/<id>/vaults.json`) | Vault agent |
|---|---|---|
| Angelo | `ucvg2pkv` | vault@web-summit.angelo, key published |
| Jose | `3b9y9n9t`, `5rmsy87y`, `rius8gwy` | vault@web-summit.jose, key published |
| Vicky | `k64ma7jd`, `41j3e9s9` (pack) | vault@web-summit.vicky, key published |
| Indi | `nnsikio4`, `4c52covm` (by synthetic@web-summit.indi) | vault@web-summit.indi declared in agents.json, no key on the keys page yet |
| Dinis | `aym98gsm`, `p96tiql4` | sgit@web-summit.dinis |
| Silvio | none yet (WS-120) | sgit@ and vault@web-summit.silvio, keys published |
| Nimay, Sarah, Daniela | none | not started |
