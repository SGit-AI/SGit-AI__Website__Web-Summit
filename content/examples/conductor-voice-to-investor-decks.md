---
title: "Small: two spoken asks to two meeting decks, about 15 minutes each"
date: 2026-11-10
summary: "On the afternoon of 10 November Dinis asks twice for a deck for a meeting about to start. The site's conductor picks screenshots of the team's live views, writes the slides and a PDF; each deck is live about 15 minutes after the ask. The conductor's own work, traced. One person, one agent, three releases."
---
An example from [the examples](../../examples/index.html) (WS-212), drawn from reporter@web-summit.dinis's trace `conductor-voice-to-investor-decks`. The question it answers: **what is each agent for, and what did it do here?**

- **The input:** two spoken asks from Dinis, at about 14:35 and about 14:57 UTC on 10 November, each for a meeting that afternoon.
- **The output:** two decks, each with slides, screenshots and a PDF: [deck 1](../../meetings/2026-11-10-1500/show/index.html), on PrompTugal.news and the agentic team, and [deck 2](../../meetings/2026-11-10-1600/show/index.html), RiskMandate shown on our own agents, for a cybersecurity investor. The investor is not named: their record is in the private CRM.

![The flow: Dinis's first ask at about 14:35; conductor@web-summit.dinis builds deck 1 and links it; CI puts it live at 14:50; the second ask at about 14:57; deck 2 at 15:01, live at 15:10; a second version at 15:27, live at 15:30; then the two meetings, which are private.](../../assets/examples/conductor-voice-to-investor-decks.svg)

## The steps {#steps}

| UTC | Who | What happened | Evidence |
|---|---|---|---|
| about 14:35 | Dinis (a person) | Asks for a deck for a meeting at about 15:15: PrompTugal.news, the agentic team, the best of Angelo's and Silvio's live views. | the deck's own header |
| 14:45 | conductor@web-summit.dinis (an agent) | Deck 1: slides, 11 screenshots of the live sites, a PDF. | [`e1a626e`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/e1a626e6af8d59454b0c0f01b9ff0fc4bc92a626) |
| 14:46 | conductor@web-summit.dinis | Links it from the board. | [`d29ff06`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/d29ff066029008981eda0c072ce85b9ac2214bed) |
| 14:50 | GitHub Actions (CI) | v0.2.1705: deck 1 live. | [`28c91c3`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/28c91c351307d6f01ac33519882173466d856fd8) |
| about 14:57 | Dinis (a person) | Asks for a second deck, for a meeting at about 15:30 with a cybersecurity investor: RiskMandate, shown on our own agents. | the deck's own header |
| 15:01 | conductor@web-summit.dinis | Deck 2: slides, 14 screenshots (six reused from deck 1), a PDF. | [`164bc16`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/164bc16de3561cea93c92b4e091ff463eb362dfa) |
| 15:10 | GitHub Actions (CI) | v0.2.1707: deck 2 live, after waiting behind another release. | [`d3c5f36`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/d3c5f36106f72ab512ce7fbf0eab1bbf891ad8e2) |
| 15:27 | conductor@web-summit.dinis | Deck 2, version 2: RiskMandate leads with security teams, a must-have, with compliance as a by-product. What prompted it is not in the record. | [`f02ce25`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/f02ce25c3d115a52dfbea43e467372e6724d8383) |
| 15:30 | GitHub Actions (CI) | v0.2.1709: version 2 live. | [`890b4d6`](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/commit/890b4d6b6da5d542aade8bbeaabec1ef1dd238c7) |
| about 15:15, 15:30 | Dinis (a person) | The two meetings. | none: meetings are private |

## Who did what, and what each one is for {#who}

- **Dinis, a person.** Knew who he was meeting and what they needed to see, and said so in a sentence. Then went to the meetings.
- **conductor@web-summit.dinis, an agent.** The site's conductor: it turns Dinis's word into plans, pages and, here, decks. Its job in this example: know what the team has live right now, pick the screens that make the point, and keep the private parts private (the investor is not named anywhere public).
- **GitHub Actions, the release.** Every push is a release, numbered, checked and deployed. Three here.

## How long it took {#time}

- **Deck 1: about 15 minutes**, from the ask (about 14:35) to live (14:50:25).
- **Deck 2: about 14 minutes**, from the ask (about 14:57) to live (15:10:39), five of them waiting behind another release.

## What is still open {#open}

The meetings themselves have no public record, by design. If an outcome is public, it will come through the conductor.
