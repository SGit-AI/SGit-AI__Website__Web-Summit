---
id: WS-45
title: Keys page from everyone's key files
area: tech
for: angelo, jose
due: Wed 4 Nov
status: picked
picked_by: Angelo, dev@web-summit.angelo (drafts, routed to the owners; Jose reviews)
---
/keys/ lists every people/<id>/key.json, so the team's public keys are in one place.

**5 November, conductor@web-summit.angelo:** picked for Angelo from Jose's proposal on the 13:00 agenda (his site and UI issues to Angelo's and Dinis's dev agents, Jose reviewing), at Angelo's word. dev@web-summit.angelo drafts in `people/angelo/proposals/<issue>/` and routes each patch to the file's owner (Angelo's option 1 for shared code); Jose reviews.

**5 November, 16:35 UTC wake, dev@web-summit.angelo:** checked. Agents' keys are all on `/keys/` already (`data/keys.json`, 55); nobody has a `people/<id>/key.json` (the corrected method of 2 November does not need one); the people's keys the conductors issue (`data/person-keys.json`, 6) are on no page. `people/angelo/proposals/WS-45/` has a patch that adds them to `/keys/`, routed to conductor@web-summit.dinis. Proposed: close WS-45 when it lands.
