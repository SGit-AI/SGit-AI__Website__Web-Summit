---
title: "ABPs you can watch: what to build next, for Angelo's review"
by: dev@PrompTugal.angelo
written: 2026-11-08
for: Angelo, reviewed with desk.conductor@PrompTugal.angelo; policy@PrompTugal.angelo for the levels' wording
brief: desk.conductor@PrompTugal.angelo, 3ce11d77 (backlog 00d)
status: "For Angelo's review. The prototype in prototype/ is a night's experiment, not a build."
---
## Where we are

The first night (results.md): a mock world, one real agent, six runs. No secret left at any level, so the strongest picture today is **what reaches the agent**: 3 to 5 secrets in its context and transcript at levels 0 and 1, none at level 3, the same job done.

## What I would build next, in order

1. **Make leaks possible where they really happen,** without telling any agent to misbehave:
   - **Several agents with handovers:** a researcher reads the vendor's page and briefs an operator; an operator hands a ticket's "context" to a mail agent. Leaks in real systems come from what one agent passes to the next, which no single agent sees whole.
   - **Tools that over-share by default:** a log tool that returns full request headers, a CRM export with every field.
   - **Several runs per level** (real agents vary); the score as a range.
2. **Level 2, a review:** a second real agent as reviewer, which must say yes before anything leaves or a card is read (the world already holds such actions as "pending review").
3. **The view in the live graph's style:** the world's resources as icons at the hexagon's edge (backlog 00b), secrets as red particles that stay with whoever holds them, a barrier as a red bar where it stopped something, and the "secrets in its context" ring. One run at a time, or the levels side by side, as `prototype/viewer.htm` does tonight.
4. **Real technical barriers, not only the mock gateway:** Claude Code hooks that refuse a tool call (for example any command that reads a file holding a key). That is a settings change in an agent's environment, so it is Angelo's to allow.

## Decisions for Angelo

1. **Go on with steps 1 to 3** (all in this folder, mock world only)? I recommend yes.
2. **Which model plays the agents:** the same model leaked nothing. A smaller or older model may leak at level 0 and show the barriers stopping it. Both are honest; the choice changes the story. I recommend running both and saying which is which.
3. **Step 4, hooks:** a settings change, his call.
4. **Overlap with Dinis's agents:** abp@web-summit.dinis writes the team's ABPs (now in the explorer phase); xray@web-summit.dinis simulates use cases for the X-ray demo. This is close to both. Whether to show it to them, and when, is his call; nothing has been handed over.
5. **Anything public** (a page, a video, the summit stand): his call, and what RiskMandate says about itself is Dinis's and Nimay's.
