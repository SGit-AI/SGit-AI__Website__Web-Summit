# Jose's command centre: the design

Kept by `designer@web-summit.jose`, Jose Bota's designer: the design of Jose's command centre, and the look of Jose's broadcast messages (WS-39).

**Status, 4 November 2026: a brief for dev.** At Jose's word, Jose gets his own app in `people/jose/app/`, built the way Angelo's is: it extends the shared command centre instead of replacing it, adds a **Mission** view with the design Jose picked, and changes nobody else's page. The brief, the tested rules and the screenshots: [mission/](mission/BRIEF.md), for `dev@web-summit.jose`. (On 3 November it was on hold, and the round was written up as a draft for the shared engine, [proposal-shared-cc.md](proposal-shared-cc.md); that draft stays as it is.)

## Jose's brief (3 November)

The one page Jose opens first thing and between stand-ups, mostly on his phone. Top to bottom: **one attention line**; **needs me now** (overdue, due in 24 h, waiting on my decision, my stand-up items); **new since I last looked** (the browser remembers the last visit, marks new items with a "new since" divider, and falls back to 24 h on a first visit); **my agents** (conductor, dashboard, dev, designer: last run, next run, last commit, and a health of OK, Late or Quiet worked out **in the browser** against the current time); **the machinery** (WS-39, the channel issues, the technical board with Angelo); **my conductor's latest brief, my mentor's latest note, and the days to opening night**. Urgency is shown by position first; colour is only a backup, and always comes with a word or an icon. At most three levels: Act, Watch, OK. No vanity numbers. Show the build time, with a warning when it is stale. Dark (near-black), mostly greyscale with one accent, hairlines, a sans plus a mono for times and counts, a few section cards. Contrast at least 4.5:1, tap targets at least 44 px, motion under 200 ms and off under reduced motion. Real data only, with anything derived labelled.

## Jose's pick (3 November)

A's layout with B's three top counts (Overdue / Quiet / Decide) and B's run-history ticks per agent. Yes to a list of decisions waiting on him, kept by his conductor (any agent may add one with its source); first proposed as `asks.json`, then, at his word, as `decisions` in `config.json`. Yes to grouping shared issues due soon on one row, with overdue always separate. Last commit = last run, a 40-minute grace, stale after 3 hours. The designer shown as on demand, not judged against 24 hours.

A private preview of that pick went to Jose in his Claude session; the screenshots in this folder are of the three directions it was mixed from.

## The three directions Jose chose from

All three shared one data model and the same rules, and differed only in layout, type and emphasis. Two states each, at phone (390 px) and desktop (1280 px): **all clear** (the real data at Tue 3 Nov 02:10 UTC, with the open decisions marked answered) and **overdue and quiet** (the real data at Wed 4 Nov 08:40 UTC, with the other agents' runs assumed and labelled).

| | Direction | All clear | Overdue and quiet |
|---|---|---|---|
| **A** | **Mission Control.** Calm, dense, pro-tool. One attention box, then five section cards in two columns on desktop. IBM Plex Sans and Mono. | [phone](command-centre/A-clear-phone.jpg) · [desktop](command-centre/A-clear-desktop.jpg) | [phone](command-centre/A-alert-phone.jpg) · [desktop](command-centre/A-alert-desktop.jpg) |
| **B** | **Flight Deck.** A status board: three big counts that light up only above zero, mono throughout, run-history ticks per agent. JetBrains Mono and Archivo Narrow. | [phone](command-centre/B-clear-phone.jpg) · [desktop](command-centre/B-clear-desktop.jpg) | [phone](command-centre/B-alert-phone.jpg) · [desktop](command-centre/B-alert-desktop.jpg) |
| **C** | **Morning Brief.** Editorial: the attention line as a serif headline, then a short summary of the day written from the data. Newsreader and Source Sans 3. | [phone](command-centre/C-clear-phone.jpg) · [desktop](command-centre/C-clear-desktop.jpg) | [phone](command-centre/C-alert-phone.jpg) · [desktop](command-centre/C-alert-desktop.jpg) |

## What is in this folder

| Path | What it is |
|---|---|
| [proposal-shared-cc.md](proposal-shared-cc.md) | The draft: four improvements for the shared command centre, each linked to the screenshots here and how it would fit. |
| `command-centre/A-*`, `B-*`, `C-*` | Screenshots of the three directions, phone and desktop, all clear and overdue and quiet. |
| [command-centre/preview-data.mjs](command-centre/preview-data.mjs) | A reference: the snapshot script behind the previews, which reads the repository and prints JSON. It is not dev's `data.mjs`, and nothing on the site loads it. |
| [broadcast-looks.png](broadcast-looks.png) | Two looks for the WS-39 broadcast. |

## The broadcast look (WS-39)

Proposed in the first round; the choice is on [Jose's Actions](../dashboard.md#actions) (one door, C19), not kept here. Both looks as they would appear in WhatsApp and in Slack, from dev's script: [broadcast/](broadcast/README.md). In a group chat, people read three points, not seven: a fixed title line, the day and the stand-up times, the first three points with their bold lead, then `+N more:` and the link. See [broadcast-looks.png](broadcast-looks.png).

```
*RiskMandate team · 00:57 report*
Tue 3 Nov · stand-ups 13:00 and 18:00

▸ *Print files ready* for sign-off
▸ *A printer can make Friday*, if confirmed today
▸ *First major release*, v0.2.0

+4 more: https://web-summit.sgit.ai/reports/2026-11-03-0057/
```

## Tried and learned

- **3 November, 01:30, first round.** Tried: three looks (control room, flow, builder log) from my own reading of the brief. Superseded by Jose's own brief at 01:40; the screenshots are removed and the reasoning stays in the git history.
- **3 November, 01:45, second round.** Tried: one data model and three renderers, so the directions differ only in design and never in what they claim. Learned: frozen data against a moving clock makes every agent Quiet, which is the honest answer and the reason Jose asked for health to be computed in the browser; the board has no "waiting on Jose" field; due-in-24 h issues shared with Angelo swamp the list (14 on Wed 4 Nov) unless they are grouped; `*.html` is gitignored here (WS-83), so previews live as JPEGs and as a private link.
- **3 November, third round.** Tried: Jose's pick (A's layout with B's counts and run ticks) as a final preview. Learned: since 497c4d7 every person has the shared command centre, so a person's own `data.mjs` would replace the team's engine and its switcher; at Jose's word the work is on hold as a draft proposal for the shared engine, with decisions kept in `config.json` rather than a new file.
