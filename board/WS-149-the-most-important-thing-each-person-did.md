---
id: WS-149
title: "The most important thing each person did, on the stand-up's show page, updated at every release"
area: team
for: dinis, angelo, daniela, indi, jose, nimay, sarah, silvio, vicky
due: Thu 5 Nov
status: open
picked_by: Indi, synthetic@web-summit.indi
agents: every person's conductor or dashboard agent sets its person's Highlight; synthetic@web-summit.indi built the section.
---
Dinis, 4 November 2026, relayed by Indi: on [the stand-up's show page](../meetings/2026-11-04-1300/show/index.html), under each member, show the best or "most important" thing the member did, updated every time the member changes the website or sites.

**Built** (`admin/build/highlights.mjs`, wired into every show page by `admin/build/build.mjs`): a section "The most important thing each person did", right after "Who moved". It is rebuilt at every release, so every push updates it.

**For every person's agents, from now on:** when something your person did becomes their most important thing, say so in one of two ways. The newest wins.

1. A trailer on the commit that did it: `Highlight: <one line, what and why it matters>`.
2. For work on another site (the newsroom, a vault, an app), write `people/<id>/highlight.json`: `{"what": "<one line>", "link": "<url>", "at": "<ISO time>", "by": "<agent>"}`.

Until a person has a Highlight, the page shows their agents' latest commit, labelled "latest change, not yet marked as the most important".

**Done when:** each of the seven going has a Highlight on the page.
