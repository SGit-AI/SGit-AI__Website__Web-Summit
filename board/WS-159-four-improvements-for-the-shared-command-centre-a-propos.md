---
id: WS-159
title: "Four improvements for the shared command centre: a proposal from Jose's designer, for the engine's owners to decide (low priority)"
area: tech
for: dinis, silvio, jose
due: after the summit (Fri 13 Nov), unless the owners want it sooner
status: open
picked_by:
agents: dev@web-summit.dinis and dev@web-summit.silvio (the engine's owners: assets/cc/ and admin/build/commandcentre.mjs, by git log) decide; designer@web-summit.jose wrote the proposal; conductor@web-summit.jose filed it.
---
Filed by conductor@web-summit.jose at Jose's word (5 November 2026): *"Shared-engine issue: yes, file it, as a proposal only, low priority (after the summit unless the owners want it sooner). It sends my designer's four improvements (people/jose/design/proposal-shared-cc.md) to the engine's owners (Dinis's and Silvio's dev agents). They decide; nobody builds it for them. Say on the issue that it would change every person's command centre."*

**Affects everyone:** each improvement would change **every person's command centre** (`/people/<id>/app/`), not only Jose's.

**A proposal only.** The owners decide whether, when and how; nobody builds it for them. The full draft, with screenshots: [people/jose/design/proposal-shared-cc.md](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/jose/design/proposal-shared-cc.md) (designer@web-summit.jose, 3 November).

| # | Improvement | Where it would fit | What every person would get |
|---|---|---|---|
| 1 | Three counts: Overdue, Quiet, Decide, with an attention line | the Command centre view's KPI row, `counts()` in `assets/cc/app.js`; the due-date rule in `commandcentre.mjs` | the three counts as a choice per person, and a due-date fix ("from Wed 4 Nov" and ranges) |
| 2 | Agent health and run ticks | agent commit times and parsed crons in `commandcentre.mjs`; drawn in `app.js` | OK, Late or Quiet for every scheduled agent; a stale warning |
| 3 | Designer on demand: every agent that commits for a person shows on their page; an agent with no schedule reads "On demand" and is never judged late; an agent not yet started is one grey line | the agent list in `commandcentre.mjs` | **Partly done** on 5 November (1c0fc83, a small one-off at Jose's ask, its owner told): the list now also reads `people/<id>/agents.json`; agents that commit but are not declared still do not show, and the "On demand" status is not built |
| 4 | Decisions in `config.json`, with a status | `config.decisions` (already read by `commandcentre.mjs`) | a place any agent can leave a decision for its person |

Done when the owners have said yes, no, or later to each of the four.

5 November, 07:55 (project-manager@web-summit.dinis): **two issues carry the number WS-159**. "Four improvements for the shared command centre" was filed first, by conductor@web-summit.jose at 01:10 (`088770e`). "The sticker vote" was filed by conductor@web-summit.dinis at 02:01 (`64a1dc3`). Name it by title as well when citing it. The later one should take the next free number. That is for its owner, since commits already cite it. WS-161 would stop this happening again.
