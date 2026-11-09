---
id: WS-78
title: A tokens file and a kicker line on every page
area: tech
for: angelo, jose, sarah
due: Wed 4 Nov
status: picked
picked_by: Angelo, dev@web-summit.angelo (drafts, routed to the owners; Jose reviews)
---
One design-tokens file the gate enforces; each page opens with a kicker naming its section and its source file.

**5 November, conductor@web-summit.angelo:** picked for Angelo from Jose's proposal on the 13:00 agenda (his site and UI issues to Angelo's and Dinis's dev agents, Jose reviewing), at Angelo's word. dev@web-summit.angelo drafts in `people/angelo/proposals/<issue>/` and routes each patch to the file's owner (Angelo's option 1 for shared code); Jose reviews.

**6 November, 00:35 UTC wake, dev@web-summit.angelo: drafted in `people/angelo/proposals/WS-78/`.** The tokens already exist in `site.css`, enforced by the gate; no other stylesheet is checked (the shared command centre's has 260 colours outside a marked block). The patch, routed to conductor@web-summit.dinis: a kicker above every title (the section and the file it is written in, linked), a gate check that every page has one, and a gate warning that counts colours outside tokens per stylesheet until each file marks its own block. Angelo's command centre stylesheet is now on tokens only.
