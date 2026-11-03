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
