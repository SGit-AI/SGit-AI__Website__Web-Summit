---
id: WS-150
title: "The stand-up show: decide-and-unblock slides, built from the agenda and the board"
area: pm
for: dinis, angelo
due: Thu 5 Nov
status: open
picked_by:
agents: conductor@web-summit.dinis keeps the shows; team-collaboration@web-summit.angelo proposes and keeps the generator
---
At the 4 November stand-up, Dinis showed /meetings/2026-11-04-1300/show/ as a better way to run a stand-up. Angelo asked team-collaboration@web-summit.angelo to build the other half: make the pending decisions and the blockers as visible as the activity.

**What the show has now:** a fragment hand-made by conductor@web-summit.dinis (`team/conductor/shows/<meeting id>.show`), with seven slides, nearly all about what happened (commits, agents, keys, what shipped). Decisions are one short list at the end, with no options, no person they wait on, and no blockers.

**The proposal:** `people/angelo/tools/standup-show.mjs`, a read-only generator. It builds four or five more slides in the same CSS vocabulary, from `data/meetings/` and `board/` only:

1. **Decide:** the headline numbers. On 4 Nov for the 18:00: 29 open items, 19 decisions, 11 carried three times or more, 0 settled since the last stand-up, 1 with no options.
2. **The five that cannot wait:** a card per decision, sorted by due date and then by age. Each card shows who it waits on (a colour per person), how many times it has been carried, how late it is, the options, and the recommendation. It ends with the line *"decided: &lt;item&gt;: &lt;words&gt;"*, so the record carries each decision.
3. **Who is waited on:** open items per person, as bars (on 4 Nov: Dinis 22 of 29).
4. **Blocked and late:** the board issues past their date (24), in red when nobody is in `picked_by:` (19).
5. **Settled since the last stand-up:** each decision in the decider's own words. Shown only when there is one.

Try it: `node people/angelo/tools/standup-show.mjs . 2026-11-04-1800 > /tmp/part.show`

**Three ways to land it (Dinis's conductor chooses):**

1. **Use it as it is:** the conductor runs the generator before each stand-up and pastes its output into the end of its own `.show`, in place of the short "Decide" list. No code change for anyone.
2. **Two contributors per show:** a small change to the show block in `admin/build/build.mjs`, so the page joins `team/conductor/shows/<id>.show` with any `<id>.*.show` beside it (for example `<id>.decide.show` from team-collaboration). Each agent then keeps its own slides. That is shared build code, so it waits for WS-34 or goes to dev@web-summit.dinis.
3. **Blockers as data:** blockers live only in prose today ("cannot be done today", "waiting on the accounts"), and no board issue has ever been `status: blocked`. Add two optional fields: `blocked_by:` and `waiting_on:` on board issues, and `waiting_on` on agenda items (`agenda.mjs add --waiting-on`). Then the show lists real blockers instead of inferring them from lateness. Agreed at a stand-up; every agent fills them in from then on.

**Done when** the conductor has chosen one or more of these, and the next stand-up's show has its decisions slide built from the data.

**Update, 4 November 17:45 (team-collaboration@web-summit.angelo):** part of this is done another way. conductor@web-summit.dinis now builds every stand-up as a deck (`team/conductor/tools/show_deck.py`, `assets/deck.js`). From Angelo's signed ask at 17:25, slide 2 is "open points: urgent, late, logistics", built from the board (eb50d0b7). The 18:00 deck also has decisions and follow-ups (fd577f32). Still open from this issue: the decision cards (who each waits on, how many times carried, options and recommendation), the waited-on bars, and blockers as data (way 3). They could become slides in `show_deck.py` rather than a second generator. `people/angelo/tools/standup-show.mjs` stays as the reference for those slides.
