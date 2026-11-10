---
title: "Medium: a voice brief at 02:40 to the 09:00 deck"
date: 2026-11-10
summary: "At about 02:40 UTC Dinis records THE RESTART, a voice brief to every team. The site's conductor turns it into a board issue and a deck with ten screenshots and a PDF, live at 04:08 UTC (1 hour 29 minutes), and refreshes it with the night's work for 08:20. One person, one agent, two releases."
---
An example from [the examples](../../examples/index.html) (WS-212), drawn from reporter@web-summit.dinis's trace `medium-voice-brief-to-deck`. The question it answers: **what is each agent for, and what did it do here?**

- **The input:** a voice brief from Dinis at about 02:40 UTC on 10 November 2026, THE RESTART: the pause of the night before is over, restart and accelerate, every team on one theme (agentic, GAMMA-Ray).
- **The output:** [the 09:00 team briefing](../../meetings/2026-11-10-0900/show/index.html): slides, screenshots of the live sites, and a PDF.

![The flow: Dinis's voice brief at about 02:40; conductor@web-summit.dinis writes WS-208, builds the deck and links it; GitHub Actions puts deck v1 live as v0.2.1642 at 04:08; a side note for Angelo's team at 04:19; the final refresh at 08:17, live as v0.2.1662 at 08:20; Dinis presents at 09:00, not yet evidenced.](../../assets/examples/medium-voice-brief-to-deck.svg)

## The steps {#steps}

| UTC | Who | What happened | Evidence |
|---|---|---|---|
| about 02:40 | Dinis (a person) | A voice brief in the conductor's session: THE RESTART. | the time is quoted in [`63794d6`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/63794d60a6148af9b67c0ac710a8fcac7222a4b6) |
| 04:02 | conductor@web-summit.dinis (an agent) | Writes it down as board issue WS-208: one theme, who takes what, each person confirms their piece. Addressed to every team's conductor. | [`63794d6`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/63794d60a6148af9b67c0ac710a8fcac7222a4b6) |
| 04:05 | conductor@web-summit.dinis (an agent) | Builds the deck: the slide source, the slides, ten screenshots of the live sites and a PDF, with two small tools it keeps. | [`aed5d61`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/aed5d61ba87842a800f4e499f747556b1bb269ad) |
| 04:06 | conductor@web-summit.dinis (an agent) | Links the deck from WS-208. | [`e97f26d`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/e97f26d218a5a7fdfc654f841eaabf62d7729d06) |
| 04:08 | GitHub Actions (CI) | v0.2.1642: the first deck live. | [`7b8d790`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/7b8d79087b1d4c6da388dd17fd3f445c1591aa3e) |
| 04:19 | conductor@web-summit.dinis (an agent) | A side step from the same brief: a note for Angelo's team to share the demo scenarios with Android and iOS. | [`9aeaead`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/9aeaead7ed16c3f9133973fefa25c8a5c89d3117) |
| 08:17 | conductor@web-summit.dinis (an agent) | The final refresh: an "Overnight" slide with what the teams shipped in the night, new screenshots, a new PDF. | [`f8071be`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/f8071be49640bcab66f48a86488b623e9a3aa3ed) |
| 08:20 | GitHub Actions (CI) | v0.2.1662: the final deck live. | [`9b031ed`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/9b031ed7eb0f5ed8d737c95de76362bd1c07f0dc) |
| 09:00 | Dinis (a person) | Presents it to the team. | none: at 15:25 the reporter found no meeting notes or later commit recording it |

## Who did what, and what each one is for {#who}

- **Dinis, a person.** Spoke for a few minutes in the middle of the night, and presented at 09:00. Everything between was done for him.
- **conductor@web-summit.dinis, an agent.** The site's conductor: it turns Dinis's word into plans, board issues and pages, and routes work to the rest of the team. Here it did two jobs a chief of staff would do: it wrote the plan down so every team could pick its piece (WS-208), and it made the deck that shows the plan, from screenshots of what is actually live, then refreshed it with what the teams did overnight.
- **GitHub Actions, the release.** Every push is a release: CI numbers it, builds the site, runs the gate and deploys it. Twice here.

## How long it took {#time}

- **1 hour 29 minutes** from the voice brief to the first deck live (about 02:40 to 04:08 UTC).
- **5 hours 40 minutes** to the final deck (08:20 UTC), most of it waiting for the night's work to report in. The deck's own header says it was updated hourly until 09:00; the record shows two versions.

## What is still open {#open}

The presentation at 09:00 has no evidence yet, and the teams' confirmations of their pieces of WS-208 are not yet in the trace as hand-offs. Both are for the reporter's next wake.
