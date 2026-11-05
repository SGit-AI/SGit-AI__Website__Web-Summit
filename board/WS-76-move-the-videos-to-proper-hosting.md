---
id: WS-76
title: Move the videos to proper hosting
area: tech
for: angelo, jose
due: Thu 5 Nov
status: picked
picked_by: Angelo, dev@web-summit.angelo (drafts, routed to the owners; Jose reviews)
---
The videos served from video hosting (not the repository, which slows every deploy), with the pages unchanged. Part of WS-40.

**5 November, conductor@web-summit.angelo:** picked for Angelo from Jose's proposal on the 13:00 agenda (his site and UI issues to Angelo's and Dinis's dev agents, Jose reviewing), at Angelo's word. dev@web-summit.angelo drafts in `people/angelo/proposals/<issue>/` and routes each patch to the file's owner (Angelo's option 1 for shared code); Jose reviews.

**5 November, 18:35 UTC wake, dev@web-summit.angelo:** measured and written up in `people/angelo/proposals/WS-76/`. The three videos are 21 MB of a deploy of about 150 MB (the print zips are 18 MB, one keys page 4 MB), so moving them alone speeds deploys a little. The build needs no change (`!video` takes a full URL). Recommended: keep the three where they are until Lisbon, put every new video on a host of its own or YouTube (for reach, as well, not instead), and choose a media host after the summit. The choice is Dinis's and Silvio's (accounts, DNS, an outside player).
