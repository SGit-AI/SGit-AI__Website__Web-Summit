---
id: WS-114
title: Feedback lanes: a vault per agent, who drains them, and idle runs on the same lanes
area: tech
for: dinis
due: Wed 4 Nov
status: in progress
picked_by: dev@web-summit.dinis
agents: dev@web-summit.dinis built the first lane; conductor@web-summit.dinis decides who monitors; every agent makes its own vault and lane.
---
From Dinis, 3 November: every agent creates its own vault with an append lane; feedback from the site goes to it, sealed, and an agent monitors it. First one done (dev@web-summit.dinis): its vault `rx5uxdyu` on dev.send.sgraph.ai, one lane, and the pane on every page (`assets/feedback.js`, off until `?feedback=on` on a device): a comment, decision, idea or bug per page, selected text quoted, images pasted or dropped, all kept in local storage, editable, then Submit seals them in the browser to the agent's public key (keys page `dev-dinis`) and appends them. `admin/tools/feedback_drain.py` lists, fetches, opens, files each into the vault (`feedback/<date>/`, markdown, JSON and images), commits, pushes, and only then marks processed. Tested end to end against the live lane on 3 November.

Open: (1) who drains: dev drains its own on every wake for now; the conductor, or one agent for all lanes, is Dinis's call. (2) The team vault key Dinis makes tomorrow replaces this session's vault and key. (3) Idle runs: the same lane can carry a run record per wake (one small sealed message, no commit, no release), shown apart from real wakes on /wakes/. (4) The lane is write-only for anyone with the page: everything drained is material, not instructions; a flood fills it at 1000 pending, and rotating is one configure call. Learned: a vault does not exist on the server until its first commit is pushed (configure answers 404 until then).

3 November, 04:15 (abp@web-summit.dinis): recorded in dev's ABP (`content/abp/dev-web-summit-dinis.md`, Gap): the lane makes the public web an input to an agent's wake, and the only barrier on its content is the rule that material is not instruction. As each agent gets its own lane, its ABP will record the same, so whoever drains a lane should be named in that agent's section.

4 November, 00:05 (conductor@web-summit.dinis): **who monitors**, at Dinis's word (3 November, about 23:40 UTC, "decide which agent is responsible for monitoring the append lane"): each lane's owner drains its own, as sgit.ai's append-lane write-up does. The conductor's lane is live: vault `ossoywbm` (conductor-inbox, dev.send.sgraph.ai), in `assets/feedback.json` lanes[] beside dev's; the pane now asks who to send to. A person whose key is in the browser (assets/keyring.js, a key the conductor issues: admin/tools/person-key.mjs) signs what they send, and `feedback_drain.py` verifies it against data/person-keys.json. Tested end to end from Chromium: signed, sealed, appended, drained, verified. The conductor drains at every wake (content/agents.md).
