---
id: WS-143
title: "The home page revamped: rich and dynamic, what is happening now, with the agenda building day by day"
area: content
for: dinis, everyone
due: Fri 6 Nov
status: open
picked_by:
agents: journalist@web-summit.dinis (owner: what is happening, the words), designer@web-summit.dinis (the look; WS-103 was its design), dev@web-summit.dinis (the data and the charts in admin/build/home.mjs), dashboard@web-summit.dinis (the For-you layer on it); the newsroom agent links in.
---
From Dinis, 4 November about 11:00 UTC: *"brief the team to revamp the home page to reflect what we are doing now (for example this is a good one for the journalist). That page should be a super rich and dynamic page about what is happening, for example the agenda (which should be built dynamically as the days go by) should be very visible."*

**What the home page should be now**, five days from the summit:

1. **The agenda, first and very visible**: today to Thursday 12 November, built at every release from the data, so it grows and moves as the days go by: the stand-ups (data/meetings/schedule.json), the deadlines due on the board (the burn-down to 12 November), the print order's dates, the summit itself (data/events.json: opening night Mon 9, the conference 10 to 12, our stand Thu 12), and who of us is where. Past items fold away; today is open; the next thing is marked.
2. **What is happening now**: the journalist's latest report, the newest releases and what changed, the newsroom's latest articles (web-summit.newsroom.sgit.ai), keys and lanes going live (WS-136), in pictures: the activity by agent and hour, the agents map, the setup levels.
3. **Needs you**, for the person who has chosen who they are (the For-you layer), kept as it is.
4. **Rich, not long**: phone first; each block one glance; every number from the data, none typed (as WS-103).

**Split:** the journalist proposes the content and keeps the words fresh at every report; the designer proposes the layout (a sketch in team/designer/home/ before building, Dinis decides); dev builds the agenda and the blocks as build-time data and SVG (admin/build/home.mjs, admin/build/charts.mjs); the dashboard agent keeps the For-you layer on it. First a proposal on this issue by the journalist and the designer, by tomorrow's 13:00.

**Item 1's data, built (dev@web-summit.dinis, 4 November, 12:40 wake), ahead of the layout:** `admin/build/agenda.mjs` builds the agenda at every release, a day at a time from yesterday to Thu 12 Nov: the stand-ups (with what is open on each), the board's due dates (one entry per day, with its issues), the plan's dated steps (data/plan.json, "Thu 12: our day on the stand"), and the summit from its published facts (badge pickup from Sat 7, Opening Night and Night Summit on Mon 9, the three conference days, the sessions that matter each day, the side events). Past days fold, today is marked, so is the next thing. It is data at `/agenda.json` and a block any page can ask for with "```chart agenda" then "```" (a plain list, classes `ag-*` only, a readable default in site.css for the designer to replace); shown on /site-review/#charts, not yet on the home page, which waits for the layout. Checked green with the clock at 5, 8, 12 and 13 November. Missing from the data: who of us is where (travel, the stand rota), and the print order's dates as data (they show only through WS-48 and WS-113's due dates). For the designer: an open item carries over to every later stand-up, so each shows the same count; how to show that is a layout call.
