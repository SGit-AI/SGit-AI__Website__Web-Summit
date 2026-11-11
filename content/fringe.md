---
title: "Lisbon Fringe: everyone brings a conductor"
summary: "Storm Charles cancelled Web Summit's Wednesday, and the week is moving elsewhere. Lisbon Fringe (fringe.promptugal.news) is our independent guide to the alternative, community and side events around the summit, built by the whole team at once. Each person runs one conductor; Dinis is the head conductor. How to join in five minutes."
---
At Dinis's word (11 November 2026, about 10:45 UTC), WS-215. The repository is [PrompTugal/PrompTugal__News__Fringe](https://github.com/PrompTugal/PrompTugal__News__Fringe). The site will be fringe.promptugal.news once it serves.

> Dinis: "This is a great opportunity for us to take this to the next level ... everybody should have a conductor for this ... this is also a good example of how we can now swarm, not just agents, but with the humans and the teams. I'm going to be the head conductor."

## What Lisbon Fringe is {#what}

An independent guide to everything happening around Web Summit Lisbon this week:
- the alternative and unconference events;
- side events and meetups, and the communities behind them;
- what moved because of the storm.

It has two jobs: help someone in Lisbon find what is on and how to join, and connect the dots between people, events and topics. It is not Web Summit's site, and every page says so. The full brief is [BRIEF.md](https://github.com/PrompTugal/PrompTugal__News__Fringe/blob/dev/BRIEF.md).

## The swarm {#swarm}

- **One conductor per person,** in your own Claude account: `conductor.fringe@PrompTugal.<your id>`. Sub-agents only when the work needs them.
- **Dinis is the head conductor.** His agent, conductor.fringe@PrompTugal.dinis, keeps the board and routes the work.
- **One board:** [`work/`](https://github.com/PrompTugal/PrompTugal__News__Fringe/tree/dev/work), one file per piece of work. You claim an item with a commit.
- **One status file each:** `team/<id>/status.json`, written by your conductor at each wake.
- **Everyone pushes to `dev`.** Public sources only, no contact details, no private people.

The protocol in full: [SWARM.md](https://github.com/PrompTugal/PrompTugal__News__Fringe/blob/dev/SWARM.md).

## Join in five minutes {#join}

1. Open a new Claude Code session in your own account, with the repository **PrompTugal/PrompTugal__News__Fringe** attached. Ask Dinis for push access if you do not have it.
2. Paste the prompt in [JOIN.md](https://github.com/PrompTugal/PrompTugal__News__Fringe/blob/dev/JOIN.md), with your id filled in.
3. Your conductor reads the brief, makes its key, writes your status, claims an item that fits your lane, and wakes hourly until Friday.

## Suggested lanes {#lanes}

| Person | Lane | First item on the board |
|---|---|---|
| Dinis | head conductor | direction, priorities, what is published |
| Vicky | the editorial check | 02: verify the 21 seed events |
| Indi | communities and organisers | 03: find the unconference; 04: communities page |
| Angelo | the graph and live views | 05: connect the dots |
| Silvio | on the ground, video | 03, 08: posts (a person sends) |
| Jose | the channels | 08: posts that point to the site (a person sends) |
| Nimay | business events | 10: founders, investors, partners |
| Daniela | education events | 11: learning events |
| Sarah | the look | 09: mobile-first design |

Each person picks their lane; the head conductor adjusts. The pipeline (01), the submit form (06) and the storm block (07) go to whoever takes the dev lane, or to dev.fringe@PrompTugal.dinis.

## Where things are {#where}

- **The brief, swarm, join prompt, roster and board:** [PrompTugal__News__Fringe](https://github.com/PrompTugal/PrompTugal__News__Fringe).
- **The storm, live:** [storm-charles.promptugal.news](https://storm-charles.promptugal.news), the incident team's site and data source.
- **The publication:** [promptugal.news](https://promptugal.news).
