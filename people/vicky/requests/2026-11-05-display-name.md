# Vicky's display name: "Vicky Wang" (5 November 2026)

> **Moved, 5 Nov 23:30 UTC (Dinis confirmed):** the newsroom repository is now https://github.com/PrompTugal/PrompTugal__News__Website (site promptugal.news), same history and rules. Paths below in the newsroom repository are unchanged; the old address named here is kept as written at the time.

From conductor@web-summit.vicky, at Vicky's word (5 November 2026, about 12:50 UTC): "I'd like my display name to be "Vicky Wang" instead of "Vicky" on the team site and the newsroom site. Keep the people/vicky/ paths as they are."

Her id stays `vicky`, and every path stays as it is (`people/vicky/`, `/brief-vicky/`, `/meet/vicky/`, `<agent>@web-summit.vicky`). Only where her name is shown as a name. Possessive prose ("Vicky's agents") can stay as it is.

## Done, in Vicky's own folder

- `people/vicky/profile.json`: `name` is "Vicky Wang".
- `people/vicky/dashboard.md`: the title is "Vicky Wang's dashboard".

## The team site, for each file's owner

**conductor@web-summit.dinis** (the roster and the shared pages):

1. `data/team.json`, Vicky's entry: `"name": "Vicky"` to "Vicky Wang", and "Vicky" in the `about` list of the seven going. The roster drives /team/, her person page, the setup leaderboard and the command centres' name lists, so most generated places follow.
2. `content/start.md`: the people table, `| **Vicky** |`.
3. `content/briefs.md`: the briefs table, `[Vicky](../brief-vicky/index.html)`.
4. `content/brief-vicky.md`: the title, "Brief for Vicky, and Vicky's agents".
5. `content/meet-vicky.md`: the title "Meet Vicky", and the name in its summary and first line ("You met Vicky").
6. `content/meet.md`: `[Vicky](vicky/index.html)`.
7. `content/command-centre.md`: `[Vicky](../people/vicky/app/index.html)`.

**designer@web-summit.dinis** (the design and print pages; Vicky's card already reads "Vicky Wang", WS-48):

8. `content/design.md`, `content/print.md`, `content/print-order.md`: the label "Vicky" on her proofs and sets.
9. `data/design.json` and `data/stickers-vote.json`: her `"name": "Vicky"`, if they are shown.

## The newsroom site (SGit-AI/SGit-AI__Website__Newsroom__Web-Summit), for newsroom@web-summit.dinis

10. `content/about/index.md`: the editors table, `| **Vicky**, editor |`.
11. `content/index.md`: "editors Dinis Cruz, Indi Gupte and Vicky".
12. `data/site/site.json`: `footer_note`, "Edited by Dinis Cruz, Indi Gupte and Vicky".
13. `design/tools/page-about.mjs`: `<dd>Vicky<small>`.
14. `admin/build/features/admin-model.mjs`: `PEOPLE = { ..., vicky: 'Vicky', ... }`.
15. `data/admin/agents.json`: `"started_by": "Vicky"` (three entries), if shown.

Not to change: the brief pack (`content/brief/`, brief 1 is Dinis's words verbatim; the others are corrected only through BRIEF-CORRECTIONS.md), and the newsroom's article text where it quotes the record.

## Two corrections on the newsroom's status article, at Vicky's word

`content/articles/newsroom-status-four-days-out.md` (a986965):

- It says 210 agenda items. Today's agenda (programme desk, 5 November) has 209: the Elastic evening was dropped.
- The Portugal items' dates come from their URLs, not from confirmed publication dates; say so, or confirm each at its source.
