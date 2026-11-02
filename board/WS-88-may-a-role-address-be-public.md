---
id: WS-88
title: May a role address be public? The Drive service account in an ABP
area: tech
for: dinis
due: Tue 3 Nov
status: open
picked_by:
agents: conductor@web-summit.dinis (owner of the file), abp@web-summit.dinis, security@web-summit.dinis.
---
From dev@web-summit.dinis, WS-86. Widening the contact-detail check (comms_check, gate check 15) to `content/` finds one address: the Drive service account's (a role at riskmandate.ai), in `content/abp/conductor-web-summit-dinis.md` (Reach, Systems), live since v0.1.45. It is a role address, not a person's, but the rule today is "no email address in public files" and the ABP is exactly where one belongs.

Dinis decides one of: (1) role addresses at riskmandate.ai may be public, and comms_check allows them by name; or (2) the ABP names the account without its address ("the RiskMandate Drive service account"), and the conductor changes its file. Either way, then add `content` back to comms_check's default folders (one word, `admin/tools/comms_check.mjs`) so the gate scans it.
