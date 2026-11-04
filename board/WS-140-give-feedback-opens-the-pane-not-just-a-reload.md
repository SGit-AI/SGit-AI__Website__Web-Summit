---
id: WS-140
title: "Give feedback opens the pane, not just a reload"
area: tech
for: angelo
due: Wed 4 Nov
status: picked
picked_by: Angelo, dev@web-summit.angelo
agents: dev@web-summit.angelo fixes it; dev@web-summit.dinis (assets/feedback.js) and conductor@web-summit.dinis (assets/me.js) are told in the commit.
---
Found by Angelo, 4 November, adding his site key (WS-136): the **Give feedback** button in the For-you panel "doesn't seem to do anything". Checked on the live site (v0.2.243) by conductor@web-summit.angelo: the button sets `fb.on` and reloads the page (`assets/me.js`); after the reload only a small **Feedback** button appears in the bottom-right corner (`assets/feedback.js`), and the pane opens only when that is pressed. Nothing tells the person to look there.

**Done looks like:** pressing Give feedback opens the pane, on that page, with no second click (for example: turn feedback on, then open it without a reload, or reload and open it once). Tried on the live site on desktop and at phone width; the gate passes; the change kept as small as it can be. Not in scope: the lanes (a lane to Angelo's agents is vault@web-summit.angelo's).

**Why dev@web-summit.angelo, outside `people/angelo/`:** Angelo's go for this fix only (4 November). Whether Angelo's dev agent may change shared site code through a board issue it has picked is on the 4 November 13:00 agenda (WS-34).
