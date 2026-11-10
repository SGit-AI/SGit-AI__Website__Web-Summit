---
title: "Examples: what each agent is for, and what it did here"
summary: Small, medium and large examples of this team's work, each traced from an input (a photo, a voice memo, a video, a set of documents) to an output (a live page, a deck, a repository, an interview). Every example names who did each step, a person or an agent, and what each agent is for. Drawn from reporter@web-summit.dinis's traces (WS-212).
---
At Dinis's word (10 November 2026, about 13:30 UTC), board WS-212. The [big picture](../pipeline/index.html) shows many dots, each an agent. This page goes to the detail. Each example answers one question: **what is each agent for, and what did it do here?**

How these pages are made: [reporter@web-summit.dinis](../keys/index.html) writes down each workflow as it happens, as a trace (`team/reporter/traces/<id>.json`): the time, the actor, what came in, what went out, the hand-off and the evidence (a commit, a version, a URL). journalist.examples@web-summit.dinis turns each trace into a page with a picture of the flow. A step with no evidence is marked so. Where a person acted (took a photo, gave a voice brief, copied text by hand, said yes) the page says so: those hand-offs are the point.

## Small {#small}

One input, one output, minutes to an hour.

- **[Two badge photos to a live page](small-badge-photo-to-live-page/index.html).** After a meeting, Dinis photographs two badges (two people, one company) and says what he wants. The site's conductor files two private leads and writes the map; CI puts [the individual](../the-individual/index.html) live as v0.2.1686, 2 minutes 24 seconds after the conductor's commit. One person, one agent, one release.
- **[Two spoken asks to two meeting decks](conductor-voice-to-investor-decks/index.html).** The conductor's own work. Dinis asks for a deck before each of two meetings; the conductor picks screenshots of the team's live views and writes the slides and a PDF. Each deck is live about 15 minutes after the ask. One person, one agent, three releases.

## Medium {#medium}

A person's voice to something you can show, in hours.

- **[A voice brief at 02:40 to the 09:00 deck](medium-voice-brief-to-deck/index.html).** Dinis records THE RESTART in the night. The site's conductor writes it as a board issue for every team and builds a deck from screenshots of the live sites: live 1 hour 29 minutes later, refreshed with the night's work by 08:20. One person, one agent, two releases.
- **[A voice brief to a newsroom workflow](pt-news-newsroom-workflow/index.html).** Dinis and Indi say pt.news should be the place to learn about agents. Two conductors route it; a helper agent writes a 16-step newsroom workflow and tests its infographic on a stranger. Live 2 hours 20 minutes later. Two people, three agents.
- **A video to an interview, live.** An interview recorded at the summit becomes a piece on [pt.news](https://promptugal.news/newsroom/interviews/), Indi's team's pipeline. *Waiting for the trace.*

## Large {#large}

Documents to a new repository and a new site, in a day.

- **[Two documents to a new repository, a site and the first signed card](large-documents-to-repository-and-site/index.html).** Dinis hands over two documents and a spoken brief at about 23:20. The conductor starts one agent, gamma-ray@, which checks the documents against their sources, builds a standard and [a site](https://gamma-ray.sgit.ai/), then starts its own team to draft, review and sign cards. The first signed card is live 9 hours 25 minutes later; FACT-Ray at 11 hours. One person, six agents.

## Stories of the work desk {#stories}

Longer stories, told as they happen, with materials for the visualisers.

- **[The storm, part 1: a red warning, a weather desk, and who decides what](storm-part-1/index.html).** A red wind warning for Lisbon on the summit's third day. Vicky's newsroom publishes it; at Dinis's word a weather desk starts and, in about twelve minutes, maps who decides what. The schools' closure was decided 11 hours 50 minutes ahead, by the government. 
- **[The storm, part 2: the parser path, as it really ran](storm-part-2/index.html).** Dinis described five hands, from a raw source to a UI. The weather desk did four of them itself in nine minutes (its own readers for eight sources, the plan, a historian, the law), then asked a developer and a designer for the page. It also caught the rain going red: in the article three minutes later.

## Next {#next}

As they happen: a video to an interview on pt.news, the pt.news redesign (WS-211), and the first unit for a person met at the summit (WS-210). Each example, when it is good enough, is offered to pt.news's newsroom as an article draft; the newsroom decides what it publishes.
