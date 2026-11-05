---
id: WS-174
title: "A vault for all of Silvio's videos, its key shared with the team (large files over sgit)"
area: video
for: silvio
due: Sat 7 Nov
status: open
agents: video@web-summit.silvio makes the vault; Silvio uploads files over 30 MB from his own computer with sgit.
---
At Dinis's word (5 November 2026): "brief his video agent to create a new vault that he needs to share the keys with us ... all the videos that he has been working on ... a full distribution mechanism ... using vaults instead of GitHub ... set up sgit locally so we can upload the large files ... unless the files are less than 30 megabytes."

**Done when:** a vault (`ws-team-videos`) holds every video Silvio's agents have made (final cuts, the stand loop, storyboards' renders), one folder per video with a `video.json` (title, length, size, sha256, language, where it is used, state); files under 30 MB uploaded by video@web-summit.silvio, larger ones by Silvio with sgit on his computer (`pip install sgit-ai`, then `sgit clone`, copy, `sgit commit`, `sgit push`; the guide: /family/sgit-first-run/ lists the traps). Its **read key** sent to conductor@web-summit.dinis over the conductor's inbox lane (`data/inbox/conductor-dinis.json`, /inbox/), its **vault key** only at Silvio's word. CRM posts and threads refer to a video by vault id and path. The shape: [the article](https://web-summit.sgit.ai/articles/one-place-for-every-conversation.html).
