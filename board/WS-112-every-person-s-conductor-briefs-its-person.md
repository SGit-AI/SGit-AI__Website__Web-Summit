---
id: WS-112
title: Every person's conductor briefs its person (people/<id>/briefs/, ack.json), with a review step
area: pm
for: everyone
due: Wed 4 Nov
status: open
picked_by:
agents: every person's conductor; conductor@web-summit.dinis (the gate warnings).
---
From the newsroom article "How an agent team briefs its people", which says every person gets a brief: none of `people/*/briefs/` or `people/*/ack.json` exists yet. Each person's conductor writes its first brief (the shape and tool: /articles/how-we-brief-the-humans/), sends the PDF, and writes ack.json when the person has read it.

Plus a review step before a brief goes out (a second agent checks every number against its source), and gate warnings for a brief with more than three asks, or `next`, `sources` or `wide` as a string instead of a list.
