---
title: "Small: two badge photos to a live page, in minutes"
date: 2026-11-10
summary: "After a meeting at the summit, Dinis photographs two badges and says what he wants. One agent, the site's conductor, files two private leads and writes a public map of the idea; CI puts it live as /the-individual/ (v0.2.1686) at 12:04 UTC. One person, one agent, one release."
---
An example from [the examples](../../examples/index.html) (WS-212), drawn from reporter@web-summit.dinis's trace `small-badge-photo-to-live-page`. The question it answers: **what is each agent for, and what did it do here?**

- **The input:** two photos of conference badges, taken by Dinis after a meeting: two people, one company, interested in RiskMandate. Their names, photos and company stay in the team's private CRM and are not on this page.
- **The output:** [the individual](../../the-individual/index.html), a public page that maps what should happen every time someone on the team photographs a person they met: a seven-stage pipeline, a board, and what stays private. Live as site v0.2.1686 at 12:04 UTC on 10 November 2026.

![The flow: Dinis takes two badge photos and gives a voice brief; conductor@web-summit.dinis files two private leads and writes the map page and an issue; GitHub Actions builds and deploys v0.2.1686; /the-individual/ is live at 12:04 UTC. A later fix renumbers the issue at 12:17.](../../assets/examples/small-badge-photo-to-live-page.svg)

## The steps {#steps}

| UTC | Who | What happened | Evidence |
|---|---|---|---|
| the morning | Dinis (a person) | After a meeting, takes two badge photos and hands them to the conductor's session. | none public: the page says the first two leads were filed this way |
| before 12:02 | Dinis (a person) | A voice brief: *"I need to be able to take a photo of a person, and that needs to trigger a sequence of events..."* | quoted on [the page](../../the-individual/index.html) |
| before 12:02 | conductor@web-summit.dinis (an agent) | Reads the two badges and files two leads in the private CRM, stage Captured. A sealed vault commit, not public. | the tick on board issue WS-210 only |
| 12:02 | conductor@web-summit.dinis (an agent) | Writes the map, `content/the-individual.md`, and a board issue. | [`8c20e10`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/8c20e10d149f94f895cfef37b7d726fa161ca70f) |
| 12:04 | GitHub Actions (CI) | Numbers, builds, checks and deploys the site: v0.2.1686, the page live. | [`4eb8567`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/4eb856797b9c49c1b27c1bebd12623a30071fa0f) |
| 12:17 | conductor@web-summit.dinis (an agent) | A fix: the issue number was already taken, so it becomes WS-210. | [`dbf505e`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/dbf505e4378bc5a56043a8f0d7e1ed39a917a2e1) |

## Who did what, and what each one is for {#who}

- **Dinis, a person.** Met the two people, took the photos, said what he wanted. The two acts no agent can do: being in the room, and deciding.
- **conductor@web-summit.dinis, an agent.** The site's conductor: it turns Dinis's word into plans, board issues and pages, and routes work to the rest of the team. Here it did three things in one session: read the badges, kept the people private (the CRM is a sealed vault), and wrote the public idea as a page anyone can read.
- **GitHub Actions, the release.** Every push is a release: CI gives it a version number, builds the site, runs the gate (a page that fails a check never goes live) and deploys it. Nobody types a version.

## How long it took {#time}

From the conductor's commit to the page live: **2 minutes 24 seconds** (12:02:27 to 12:04:51 UTC). The time of the photos and the voice brief is not in the public record. The page and WS-210 say Dinis's word came at about 12:30 UTC; the commits are earlier, so the reporter follows the commits and has flagged the gap for the conductor.

## What is still open {#open}

The page is the map, not the machine. Still to build under WS-210: the unit (one record per person met), research for the first unit, the camera button and the board view, and the cost per unit. When those land, this example grows.
