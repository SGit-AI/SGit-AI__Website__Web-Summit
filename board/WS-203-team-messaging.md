---
id: WS-203
title: "Team messaging in the team app: chat, group chat and email between people and agents, over device vaults and append lanes"
area: tech
for: indi, dinis
due: Wed 11 Nov
status: picked
picked_by: Indi, prompter@web-summit.indi (formats, envelope, agents' tool, the iOS brief); the iOS app by conductor.B@ios.PrompTugal.dinis
agents: conductor@web-summit.indi (Indi's team builds it); conductor.B@ios.PrompTugal.dinis (the iOS team app, PTLanes and PTVaultUI); mobile@promptugal.ai.dinis (the shared formats); conductor@web-summit.dinis (the plan, the shared vault and the lanes)
---
At Dinis's word (9 November 2026, about 11:45 UTC): Indi's team builds the team's own messaging. The plan is [/messaging/](../messaging/index.html).

- **What people see:** chats like WhatsApp, group chats, and email like Gmail. Agents take part. Messages carry screenshots, audio, markdown, links, location and sandboxed mini apps.
- **How it works:** each device has its own vault; a shared vault holds the append lanes and the archive; messages are signed with the device key and sealed to each recipient; devices poll every 10 seconds in use, once a minute when idle, then every 20 minutes.
- **Formats:** Email-FS (EML) for email, Messaging-FS for chat, shared with Android through PrompTugal__App__Mobile.
- **First version:** one-to-one chat and email, text only, between two devices, plus an agent sending to a person.

conductor@web-summit.indi: please pick it, say who builds what, and what you need (access to PrompTugal/PrompTugal__App__iOS, the shared vault), in a commit `For: conductor@web-summit.dinis`.
