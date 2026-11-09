---
title: "How the others produce articles: a survey for Angelo's editorial team"
by: research@PrompTugal.angelo
written: 2026-11-09
for: Angelo, through desk.conductor@PrompTugal.angelo (backlog 0p); the proposal that follows is spec-editorial.md
issue: WS-08
status: for review; public record only, every figure read on 9 November 2026
---
## What this is

Backlog 0p asked what each step of the other desks adds, how long a piece takes from idea to published, and what goes wrong. Everything below is from public files: promptugal.news's pages and its story board data, and this site's `people/` folders. Counts come from the story board's data (https://promptugal.news/api/v1/newsroom/stories.json, 59 stories, read 9 November 2026). **The board records dates, and times only for some steps, so the durations are in days, not hours; where I give hours they are from commit times and say so.** I read no agent's transcript.

## 1. Vicky's desks (people/vicky/newsroom/README.md, people/vicky/prompts/)

A production line, one agent per step, each writing only in its own folder:

| Step | Agent | What it adds |
|---|---|---|
| Find | researcher@, then curator@ | captures public sources with dates into a vault; the curator maps them and proposes story candidates (idea) |
| Plan | programme@ | the summit's public agenda, so stories are timed to the programme |
| Write | five journalists, one per beat (summit, Portugal, Europe, AI, connections) | drafts only, from the curator's candidates; four writing rounds a day (05:45, 10:45, 14:45, 18:45 UTC), six minutes apart, plus fix-only follow-ups about an hour later |
| Review | reviewer@ | checks every draft against its sources and the house style; verdict Ready, Fix first or Hold; a draft without a cover image is not Ready (standing answer 15); fixes wording, structure and length itself and marks Ready, and sends back only for fact or source problems (standing answer 17) |
| Fact-check | checker@ | fact-checks published articles written outside Vicky's desks, with findings per article (standing answer 25) |
| Publish | reviewer@, at Vicky's word | "Routine review and publication ... go through reviewer@ only, which publishes Ready drafts when she asks" (README, 8 November) |
| Standing answers | Vicky, via her conductor | numbered answers to the desks' questions (13, 15, 17 and 25 above); every desk reads `decisions.md` at the start of each run; the reviewer stops if `HOLD.md` exists (P1) |

**Speed** (story board): of the 32 published pieces that have both an idea date and a published date, 13 went from idea to published the same day, 11 the next day and 8 after two days. **Throughput:** 30 of the 42 published pieces came from her journalist desks.
**What goes wrong:** the reviewer's files give 17 Ready, 9 Fix first, 3 Dropped and 5 "published already, review only". Four stories are held, three because the curator found them already covered (S8, S12, S14, duplicates of published pieces) and one because it rested on two reports marked for internal use (BR5). Publishing waits on her word, by her own rule. The fix-first loop is fact and source problems, which the reviewer cannot fix itself.

## 2. Dinis's newsroom (brief 4, newsroom/workflows, the story board)

The pipeline has eight steps (research, curate, write, check, publish, the desk, security, conductor), and the board shows each story in one of nine columns: Idea, Drafting, Draft, Fact-check, Review, Waits on Dinis, Ready, Published, Held. Today: 7 in Idea, 1 Draft, 1 Fact-check, 2 Review, 1 Waits on Dinis, 1 Ready, 42 Published, 4 Held.

| Step | Agent | What it adds |
|---|---|---|
| Idea | correspondent@ (series such as BR1 to BR7, Brazil) and the curator | a numbered story with its beat |
| Write and sign | journalist@ | writes in the article shape, publishes and signs; after the newsroom's review, for every desk, including Angelo's and Jose's |
| Fact-check | dev.verify@ | checks claims with several models against readable sources; it flagged 9 of 12 claims in Angelo's setup guide, most as "unsupported" because the models could not read the source (conductor STATE, 9 November) |
| Readers | synthetic@ | invented readers read the site on phone and desktop; 61 fixes sent to owners, 29 verified live. It tests the site, not an article's facts, and says so on the page |
| Design | designer@ | brand and layout; read Angelo's guide and made one note (headings under the sticky bar) |
| Security | security@ | reviews diffs; its findings S25 and S30 raised whether other operators' agents may publish and ship code, which waits on Dinis (writer STATE, 9 November) |
| Decisions | "For Dinis" list | what is his alone (the brand, people, what RiskMandate is, what an email may promise); six are listed open on 9 November |

**Speed:** the BR series went from idea (6 November 03:55 UTC) to published in 0 to 1 days each. **What goes wrong:** the story of the name waits on Dinis for text approval; the credit for the fact-checking models was exhausted on 6 November (the budgets decision, 12:50 UTC) and that blocked dev.verify@'s re-checks as of that page; "Waits on Dinis" is a column of its own.

## 3. Jose's writer (people/jose/prompts/writer.md)

One agent, a new session per piece, started by Jose, no schedule. Its desk in the newsroom holds `ideas/<id>.md`, `drafts/<id>-<slug>.md` and `checks/<id>.md` (every fact re-opened at its source, with the date read). It never publishes or signs; journalist@ does, after the newsroom's review. It was modelled on Angelo's writer. **Speed:** one piece (JW1, "One door") went from idea to fact-check in one evening (7 November, 20:02 drafting, 20:15 fact-check, by the board's times) and is still in fact-check: the wait is after the draft, not in it. **What goes wrong:** the same open question as ours: whether another operator's agents may publish (S25 and S30).

## 4. Angelo's own record (people/angelo/reports/writer.md, writer/STATE.md)

- The agent setup guide (WS125): idea, draft and published on 6 November; then a fact-check by checker@PrompTugal.vicky with five findings (7 November), re-signed; then dev.verify@'s flags; then dev@'s review (a broken link, six wording fixes). **Lesson:** the piece went out first and was corrected after, three times, by three different checkers, each seeing it after publication.
- Wristband queues: Angelo's request about 23:30 on 8 November; research@'s brief that night; the piece was written from it, and its scheduled run's push was blocked with nobody in the session, so it waited for his go; published 9 November, the report at 08:56. **About nine hours, mostly a night.** The article says plainly that no 2026 queue report existed.

## What each step adds, in one line each

The idea step finds what is new; the plan step sets its time; a beat journalist keeps one subject; the reviewer catches facts and style before publication; the fact-check catches what is unsupported; synthetic readers catch what a reader cannot understand; the designer keeps the brand; the decisions list holds what only a person may say. **What the others lack:** none of the three has a step where the *person who owns the idea* sets the angle before drafting; every line starts with a candidate from a curator, or a writer's own idea.

## What I could not measure

Hours between steps (the board has dates); how much of a "same day" piece waited on a person; how long a review takes; any cost per piece. I did not read transcripts or private vaults.
