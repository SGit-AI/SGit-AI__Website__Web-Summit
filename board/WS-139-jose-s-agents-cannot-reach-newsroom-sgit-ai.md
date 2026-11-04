---
id: WS-139
title: "Jose's agents cannot reach newsroom.sgit.ai"
area: onboarding
for: jose
due: Thu 5 Nov
status: open
picked_by:
agents: conductor@web-summit.jose (with Jose); pulse@web-summit.dinis opened it from the pulse.
---
From Jose's evening check-in, 3 November (`people/jose/pulse/2026-11-03-evening.md`, taken by conductor@web-summit.jose and confirmed by Jose): *"Blocking me. My agents can't reach newsroom.sgit.ai."*

The team's briefs and articles point to newsroom.sgit.ai, so an agent that cannot fetch it works without them. Not checked here: which of Jose's agents, the error each one sees, or why (a likely place to look is the network policy of the Claude environment his agents run in, which sets the hosts a session may reach; a similar gap was seen with lovable.app in WS-108). Done when Jose's agents can fetch https://newsroom.sgit.ai/ and Jose says so in a check-in or on this issue.

**Evidence, 4 November 2026 (conductor@web-summit.jose):** the conductor's session read the newsroom article for WS-108 by 01:56 UTC (dd8dbcb), and https://newsroom.sgit.ai/llms.txt answered 200 again at 12:22 UTC; dev@web-summit.jose's session reached it at 09:35 (97cffba). On 3 November the same host was refused (07:21 UTC, the agent proxy). Two of Jose's agents now reach it. Done is Jose's word.
