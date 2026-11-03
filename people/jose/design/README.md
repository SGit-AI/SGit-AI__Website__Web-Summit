# Jose's command centre: the design

Kept by `designer@web-summit.jose`, Jose Bota's designer. What `dev@web-summit.jose` builds in `people/jose/app/` (the opt-in app the site build already supports, WS-06: `data.mjs`, `app.css`, `app.js`), and the look of Jose's broadcast messages (WS-39).

**Status, 3 November 2026, 01:45 UTC: three directions from Jose's brief are proposed, and Jose is choosing.** Dev builds nothing until Jose picks. Then the full spec goes in this folder, handed over in a commit `For: dev@web-summit.jose`.

## Jose's brief (3 November)

The one page Jose opens first thing and between stand-ups, mostly on his phone. Top to bottom: **one attention line**; **needs me now** (overdue, due in 24 h, waiting on my decision, my stand-up items); **new since I last looked** (the browser remembers the last visit, marks new items with a "new since" divider, and falls back to 24 h on a first visit); **my agents** (conductor, dashboard, dev, designer: last run, next run, last commit, and a health of OK, Late or Quiet worked out **in the browser** against the current time); **the machinery** (WS-39, the channel issues, the technical board with Angelo); **my conductor's latest brief, my mentor's latest note, and the days to opening night**. Urgency is shown by position first; colour is only a backup, and always comes with a word or an icon. At most three levels: Act, Watch, OK. No vanity numbers. Show the build time, with a warning when it is stale. Dark (near-black), mostly greyscale with one accent, hairlines, a sans plus a mono for times and counts, a few section cards. Contrast at least 4.5:1, tap targets at least 44 px, motion under 200 ms and off under reduced motion. Real data only, with anything derived labelled.

## The three directions

All three share one data model and the same rules (below). They differ in layout, type and emphasis. Two states each, at phone (390 px) and desktop (1280 px):

- **All clear**: the real data at Tue 3 Nov 02:10 UTC, with the WS-39 route and Jose's two stand-up decisions marked answered (an example). One Watch item remains: WS-33, due today.
- **Overdue and quiet**: the real data at Wed 4 Nov 08:40 UTC. The conductor's, dashboard's and designer's runs since are **assumed** (an example, and labelled so). Dev has not committed since Tue 01:18, so WS-33 is overdue and dev is Quiet.

| | Direction | All clear | Overdue and quiet |
|---|---|---|---|
| **A** | **Mission Control.** Calm, dense, pro-tool. One attention box, then five section cards in two columns on desktop. Quiet until something is wrong, and then only the orange Act marks speak. IBM Plex Sans and Mono. | [phone](command-centre/A-clear-phone.jpg) · [desktop](command-centre/A-clear-desktop.jpg) | [phone](command-centre/A-alert-phone.jpg) · [desktop](command-centre/A-alert-desktop.jpg) |
| **B** | **Flight Deck.** A status board: three big counts that only light up when they are not zero (Overdue, Quiet, Decide), mono throughout, and run-history ticks per agent (filled = ran, hatched = missed, dot = ran by hand, no schedule). JetBrains Mono and Archivo Narrow. | [phone](command-centre/B-clear-phone.jpg) · [desktop](command-centre/B-clear-desktop.jpg) | [phone](command-centre/B-alert-phone.jpg) · [desktop](command-centre/B-alert-desktop.jpg) |
| **C** | **Morning Brief.** Editorial: the attention line as a serif headline, then a short summary of the day that the page writes from the data. One reading column, with agents and the countdown in a right rail on desktop. Newsreader and Source Sans 3. | [phone](command-centre/C-clear-phone.jpg) · [desktop](command-centre/C-clear-desktop.jpg) | [phone](command-centre/C-alert-phone.jpg) · [desktop](command-centre/C-alert-desktop.jpg) |

The live, tappable preview, with a third state, **Now** (the real data against Jose's own clock, with his last visit remembered), went to Jose as a private link in his Claude session. `command-centre/preview-data.mjs` is the snapshot script behind it: a starting point for dev's `data.mjs`.

## The rules all three share (draft for the spec)

- **Attention line:** the first thing that is true, in this order: an overdue issue (Act, the oldest first); a Quiet agent (Act); a decision waiting on Jose, or his items at the next stand-up (Act); a Late agent (Watch); the next issue due within 24 h (Watch); otherwise "All clear" (OK). The line always says why ("Derived: ...").
- **Needs me now:** overdue issues (any, shared or not); decisions waiting on Jose; open items `for: jose` at the next stand-up (`data/meetings/<next>/`); issues due within 24 h that Jose owns (he picked them, or they are for him alone). Issues due within 24 h that he shares with Angelo collapse into one row ("14 shared with Angelo due today"), because that pool is one decision, not fourteen.
- **Decisions waiting:** the board has no field for this. Proposal: `people/jose/app/asks.json`, a short list kept by Jose's agents, with each ask's source. The previews seed it with the one real ask (WS-39's route, from `people/jose/dev/README.md`).
- **Agent health,** in the browser, from the commit times of the agent's `Agent:` trailer and its cron in `agents.json`. A slot counts once 40 minutes have passed. **OK** if the agent committed at or after its last counted slot. **Late** if it missed only that one. **Quiet** if it missed two or more in a row. An agent with no schedule (designer, for now) is OK if it committed in the last 24 h, and Quiet otherwise. "Last run" is the last commit (an agent that runs and changes nothing leaves no trace, and the page says so).
- **New since:** `localStorage` keeps the last visit time; items after it get a "New" mark under a "New since ..." divider, then "Earlier". On a first visit (or in private mode) it falls back to 24 h. Feed: Jose's agents' commits, commits `For: jose`, and commits that name his issues.
- **Stale:** the build time is always shown. Past 3 hours it gets the Act mark and the word "Stale".
- **Numbers kept:** overdue, quiet agents, decisions, due in 24 h, days to opening night (Jose asked for it). Dropped: totals of open issues, commit counts, levels.
- **Colour:** greyscale plus one accent, Jose's orange (`#FF9A52` on `#0E1013`, 8.7:1), which only ever means Act or New. Every Act, Watch and OK carries an icon and a word (triangle "Act", clock "Watch", tick "OK").

## The broadcast look (WS-39)

Proposed in the first round, and still waiting for Jose's word. In a group chat, people read three points, not seven: a fixed title line, the day and the stand-up times, the first three points with their bold lead, then `+N more:` and the link. See [broadcast-looks.png](broadcast-looks.png).

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
- **3 November, 01:45, second round.** Tried: one data model and three renderers, so the directions differ only in design and never in what they claim. Learned: (1) frozen data against a moving clock makes every agent Quiet, which is the honest answer and the reason Jose asked for health to be computed in the browser; the "overdue and quiet" example therefore has to assume the other agents' runs, and says so. (2) The board has no "waiting on Jose" field, so decisions need a small file of their own (`asks.json`). (3) Due-in-24 h items shared with Angelo swamp the list (14 on Wed 4 Nov) unless they are grouped. (4) `*.html` is gitignored here (WS-83), so the previews live as JPEGs in the repository and as a private link for Jose.
