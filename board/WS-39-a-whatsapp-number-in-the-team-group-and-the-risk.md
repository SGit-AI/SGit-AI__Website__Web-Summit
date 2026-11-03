---
id: WS-39
title: A WhatsApp number in the team group, and the RiskMandate Slack
area: tech
for: jose
due: Wed 4 Nov
status: picked
picked_by: Jose, dev@web-summit.jose
agents: dev@web-summit.jose builds the draft and the findings (people/jose/dev/); Jose's n8n flow sends, once decided.
---
A number that broadcasts updates to the team's WhatsApp group (Jose's n8n flow), and/or a channel in the RiskMandate Slack, carrying the journalist's reports.

**Picked up by Jose, 3 November 2026 (01:20 UTC):** WhatsApp first, Slack as the backup, and check first whether the API can send to a group. The findings are in `people/jose/dev/WS-39-findings.md` in the repository; the draft maker is `people/jose/dev/report-draft.mjs`.

**What the check found (read 3 November 2026, through web search; Meta's pages could not be opened from the agent's session):** the official WhatsApp Cloud API has a Groups API, but only for a business with an Official Business Account, only for groups the business creates through the API (people join by an invite link), and with at most 8 participants per group. It cannot post into the team's existing WhatsApp group. Third-party gateways that do post into existing groups (Wassenger, 2Chat, MegaAPI) run a WhatsApp Web session on a phone number, outside Meta's official API. **Decision for Jose (and Dinis, since it is a channel for the whole team and an automated post):** which route, or Slack first.

**Decided by Jose, 3 November 2026 (about 23:45 UTC, to conductor@web-summit.jose):** *"route 3 now. report-draft.mjs makes the text, n8n sends it to me, I forward it to the group. Slack (route 4) comes next, once someone with Slack admin creates the app and channel. No gateway into the group."* Next: dev@web-summit.jose builds route 3 (the draft to Jose through n8n); Slack waits for someone with Slack admin to create the app and the channel.
