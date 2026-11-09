---
title: "Angelo's editorial team: from a one-line idea to a published, refined piece"
by: research@PrompTugal.angelo (a proposal; the survey it rests on is survey-editorial.md)
written: 2026-11-09
for: Angelo, reviewed with desk.conductor@PrompTugal.angelo; policy@PrompTugal.angelo adds its findings
issue: WS-08
status: draft for Angelo's review (backlog 0p); nothing here is built, and no agent changes its prompt until he approves
---
## What and why

Angelo, 9 November about 09:30: *"can we take inspiration from other team members on how to setup the best editorial team so that when I have an article in mind, it's produced in the most effective and refined way?"*

The survey (survey-editorial.md) shows the others' strengths: Vicky's desks review against sources *before* publication and tune the rules through numbered answers; Dinis's newsroom adds checkers that are not the writer (dev.verify@, synthetic@, designer@) and a visible board; Jose's writer keeps a `checks/` file of every fact re-opened at its source. Our own record shows the gap to close: the setup guide went out first and was corrected after, by three different checkers (checker@, dev.verify@, dev@), each seeing it only once published.

**The proposal in one sentence:** keep Angelo's writer and add three things the others have, without a new agent: an angle step he answers in one line, a source table before drafting, and a check by a fresh session that did not write the piece, before Angelo's yes, so errors are fixed before publication.

## The flow

| # | Step | Who | What it produces |
|---|---|---|---|
| 1 | **Idea** | Angelo, one line, to writer@ in a new session (or into `people/angelo/backlog.md` for a later one) | the line, in his words |
| 2 | **Frame** | writer@ | `ideas/<id>.md` in its desk: the reader, the claim in one sentence, what the piece does not claim, and **one question for Angelo** if the angle is unclear (for example "for founders or for engineers?"); never more than two |
| 3 | **Sources** | research@ if a company or person is in it (its brief already exists for 18 companies); else writer@ | `checks/<id>.md`: every fact the piece will need, with its public source and the date read; what cannot be sourced is listed as left out |
| 4 | **Draft** | writer@ | `drafts/<id>-<slug>.md` in the newsroom's article shape, status draft, from the source table only |
| 5 | **Fresh check** | a different session from the writer's: runner.writer@ or research@ (Angelo's choice, question 2) | re-opens each source for each claim, marks it Supported, Not found, or Contradicted, in `checks/<id>.md`; changes no text; the writer fixes |
| 6 | **Ask the shared desks** | writer@, as a request through the pipeline (an ask file in the newsroom desk, like `asks/2026-11-08-graph-article-count.md`), only when the piece needs it | reviewer@PrompTugal.vicky or checker@PrompTugal.vicky for facts, designer@PrompTugal.dinis for a visual piece, dev.verify@ for claims it can read. **A request, not a command:** their answer or silence is theirs |
| 7 | **Angelo's yes** | Angelo | the final yes, with the draft and the check beside it (see the table below) |
| 8 | **Publish** | writer@ at his word, through the newsroom's release script, as with the wristband piece | live and signed |
| 9 | **After** | social-media@ drafts the LinkedIn post; writer@ answers a checker's later finding in one update | post draft; corrections |

**What Angelo does:** the idea (one line), the angle (at most two answers), and the yes. Nothing else needs him: about five minutes of his attention per piece, which is a target, not a measurement.

**The shared-desk rule:** a fact-check or review by another person's agent is a request through the pipeline; never ours to command, never the reason a piece waits indefinitely. Requests to other people's agents are tier 1 under the kit. Where they are silent, the fresh check (step 5) is our own.

## Angelo's yes: two modes, his choice per piece

| Mode | When | Rule |
|---|---|---|
| **Show me first** (the default) | a claim about a person or a company, anything in his name he has not seen, or a first piece on a subject | the writer stops at step 7 and shows the draft, the check and any open ask |
| **Publish when ready** | a fix, a correction, or a follow-up to a piece he already approved | the kit's rule of 7 November: once a piece is in the pipeline through his input, agents publish unless something needs his clarification |

Recommendation: the default is "show me first", because it matches his words of 9 November (the draft for him to see before it is published) and the kit's exception for claims about people and companies.

## Target times (targets, not promises)

The evidence: of 32 published pieces on the newsroom's board, 13 took the same day from idea to published, 11 one day, 8 two days (dates, not hours). Angelo's wristband piece took about nine hours, mostly a night, with his go the last step.

| Piece | Target, idea to ready for his yes | Includes |
|---|---|---|
| A short note (under about 500 words, facts we already hold) | about 2 hours | steps 1 to 5 |
| A researched piece on a company or person | same day, about 6 hours | research@'s brief first; step 6 asked, not awaited |
| A guide or a technical article with commands | one to two days | steps 1 to 5, with the example commands run |

Waiting for his yes is not counted. The writer's report and the estimates file record each piece's actual time (the kit's "Estimate, then measure").

## How it fits the agents we have

- **writer@PrompTugal.angelo:** unchanged, a session per piece; it gains the `ideas/` and `checks/` files (Jose's pattern, `desks/writer-angelo/` in the newsroom) and the angle step. runner.writer@ keeps the scheduled waits.
- **research@PrompTugal.angelo:** step 3 for company and person pieces; step 5 if Angelo chooses it. It already writes sourced briefs; its files stay in `people/angelo/research/`. A fresh check reads sources only, never changes the draft.
- **social-media@PrompTugal.angelo:** step 9, as its prompt says for a piece by or about Angelo.
- **No new agent.** The fresh check is a role a second session plays, so the independence comes from a fresh context, not a new name. Any later agent for it would start as its own spec.

## Out of scope

Publishing in Angelo's name outside the pipeline; changing the newsroom's rules, its checkers or its desks; anything about Vicky's or Dinis's agents beyond a request; a model or price choice for any task (Angelo's settings); LinkedIn.

## The data, and who may see it

Public only: the desk's files are in the newsroom's `desks/writer-angelo/`, where the gate refuses contact details; ours sit in `people/angelo/`. Sources are public pages with the read date; nothing from a login-only page; nothing about a person beyond a public professional role; no key or secret in any file.

## The changes, by owner (after approval only)

| Owner | Change | Tier |
|---|---|---|
| desk.conductor@ | the editorial flow in the kit (`people/angelo/kit/README.md`) and the two modes | 3 (kit, Angelo's word) |
| writer@ | its prompt (`people/angelo/prompts/writer.md`): the angle step, `ideas/` and `checks/` | 3 (an agent's prompt) |
| research@ | its prompt: step 3, and step 5 if chosen | 3 |
| the newsroom (writer@'s desk) | `ideas/` and `checks/` folders, as Jose's desk has | 1 (our own desk) |
| social-media@ | none; its prompt already covers step 9 | none |

## Risks

- **Added steps slow a quick piece.** Mitigation: step 6 is asked, not awaited, and the short-note target is two hours.
- **A fresh check that reads the same pages as the writer repeats its error.** It is a second reading, not an independent source; it says "Not found" rather than guessing, and a claim with one source only is marked so.
- **dev.verify@ flagged 9 of 12 claims in the guide, mostly "unsupported" because its models could not read the source.** If used (step 6), its answers are read as questions, not verdicts.
- **The fact-check models' credit was exhausted on 6 November** (the budgets decision); it may still be, so step 6 must not depend on it.
- **Silence from other people's agents.** The piece is not held by it; the cost is a correction later, as with the guide.
- **A fresh check cannot judge opinion or tone.** Angelo's yes is where that is judged.

## Questions for Angelo, with my recommendation

1. Is the default "show me first", with "publish when ready" only for fixes and follow-ups? **Recommend: yes.**
2. Who runs the fresh check: runner.writer@ or research@? **Recommend: research@ for pieces about companies (it has read them), runner.writer@ for the rest;** one session per check, never the one that drafted.
3. Do we ask Vicky's reviewer or checker routinely, or only for pieces about a person or a company? **Recommend: only then, as a request through the pipeline.**
4. Should the idea step also accept a spoken idea at the summit, to be written up later? **Recommend: yes, as one line in the backlog.**

## How we will know it works

For the next five pieces: the time from idea to ready (estimates file), the number of corrections after publication (target: none that a source check would have caught), how many times Angelo had to answer more than two questions (target: none), and whether Angelo's yes needed a second draft. If corrections after publication stay at zero for five pieces, the fresh check stays; if the added step only slows pieces down, step 5 drops to the pieces about people and companies.
