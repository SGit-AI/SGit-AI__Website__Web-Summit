---
title: "Account B: the article pipeline, from a voice note to a live article in the shortest time"
by: desk.conductor@PrompTugal.angelo
written: 2026-11-10
status: approved by Angelo, 10 November about 12:40 UTC ("we need to complete the handover to the other account's conductor ... guide me one step at a time so that it's completed and we can handover work to them"), with the desk's recommendations as defaults until he changes them: his go before every article; the byline "writer@PrompTugal.angelo, for Angelo"; the first item, his interview from today
asked_by: Angelo, 10 November about 12:10 UTC (his words below)
see_also: spec-account-move.md (who moves, the push check); people/angelo/proposals/worker-pool/ (the pool, approved 9 November; pool-claim.mjs)
---
# Account B: the article pipeline

## Angelo's words (10 November, about 12:10 UTC)

- *"The new account is tied to the same gmail account, so it should work."*
- *"Let's start 3 on the larger models and 2 on smaller models. Name clashes are not an issue ... We can add .worker if it's better."*
- *"The new account will have its own conductor that you'll interact with for the workers management, he'll be responsible for managing the workers on your command. That until this account has tokens, after that, the new conductor will take over."*
- *"The main mandate of the new pool of agents in the new account is article publishing pipeline. I need to nail down the approach of getting a voice note or content notes and getting an article in the shortest amount of time. So we might want to have the relevant roles that a conductor runner will pick up, re-route and run each worker."*

## Who is on account B

| Name | Model | What |
|---|---|---|
| **conductor.b@PrompTugal.angelo** | larger | Account B's conductor: a long session Angelo talks to. It takes his notes, opens an item, and starts and routes the workers. It acts on the desk's commits now, and takes over the desk's routing when account A runs out of tokens. |
| **alpha.large.worker@PrompTugal.angelo** | larger | a worker |
| **bravo.large.worker@PrompTugal.angelo** | larger | a worker |
| **charlie.large.worker@PrompTugal.angelo** | larger | a worker |
| **delta.small.worker@PrompTugal.angelo** | smaller | a worker |
| **echo.small.worker@PrompTugal.angelo** | smaller | a worker |

The `.worker` part makes a worker plain in every commit, on the map and in the ledger; the phonetic name keeps it short. **The model's size is in the name** (Angelo, 12:20: "Since we have workers on different models, maybe we should maintain that info in the name? the new conductor(s) will have to manage that aspect based on the tasks"): `large` or `small`, not the product name, because models change and the name stays. conductor.b@ matches each role's Model column to a worker of that size; a role marked large never goes to a small worker. A small role may go to a large worker only when no small one is free. `pool-claim.mjs` already accepts these names.

**The push check holds:** the same Google account means the same GitHub login (`riskmandate-angelo`). The desk confirms it on conductor.b@'s first commit (pushed-by says ANGELO). If it does not, nothing on B acts until dev@ adds the login (tier 3, Angelo's word).

## How the desk and conductor.b@ work together

- **While account A has tokens**, the desk commands. It writes each item, or each instruction for the workers, in a commit For: conductor.b@PrompTugal.angelo; conductor.b@ acts on it if pushed-by says ANGELO. conductor.b@ reports back For: desk.conductor@PrompTugal.angelo. The desk never messages its session.
- **Angelo talks to conductor.b@ directly** for a note or an article: that is the fastest path, and his word in that session is enough.
- **When account A runs out**, conductor.b@ takes over the backlog's routing for the pool. Angelo's digest then comes from conductor.b@, in the desk's usual format. The desk, back on tokens, picks up from conductor.b@'s STATE.
- conductor.b@'s STATE: `people/angelo/conductor-b/STATE.md`; its log of every worker it starts: `people/angelo/conductor-b/runs.md`.

## The pipeline: roles, not workstreams

Workers stay generic: each run, a worker takes **one role on one item**, does it and ends. conductor.b@ starts the next role at once, without waiting for a schedule: speed comes from routing, not from cadence.

| Step | Role | Model | Does | Output | Target time |
|---|---|---|---|---|---|
| 0 | **intake** (conductor.b@ itself) | larger | Angelo's voice note, as text, or his content notes, become an item: the angle, the audience, the facts he gave, what must be checked, consent (for an interview), the target length | `people/angelo/pipeline/<id>/brief.md` | 2 min |
| 1 | **draft** | larger | research the facts it needs (public sources, each with its link and date read) and write the article to PrompTugal.news's style and front matter, in Angelo's voice | `draft.md`, `sources.md` | 15 min |
| 2 | **check** | larger, a different worker from the draft | fact-check every claim against its source; the newsroom's style and the gate's rules (no em-dash, links resolve); privacy (no contact detail, no private person named without consent) | `check.md`: pass, or fixes made | 8 min |
| 3 | **Angelo's go** | Angelo | conductor.b@ shows him the draft's link and the check in one message; he answers "publish", or gives changes, which go back to step 1 | his word, quoted | his time |
| 4 | **publish** | smaller | in the newsroom: `content/articles/<slug>.md`, build, sign with its own session key (published in `board/keys.json` as `publisher-angelo`), gate, push, then check the live page returns 200 | the live URL | 8 min |
| 5 | **share** | smaller, in parallel with 4 | the LinkedIn post and Angelo's reply text, with the link once live | `post.md` | 3 min |

**Target: under 45 minutes from the note to the live page, plus Angelo's time at step 3.** Measured every time: conductor.b@ writes each step's start and end in `people/angelo/pipeline/<id>/times.json`, and the article's total goes in the item's STATE.

**Faster later, once the first three run clean:**
- draft and check overlap: the checker starts on the first half while the second is written;
- a standing go for low-risk kinds (event tips, our own figures), so step 3 becomes a notice;
- two items in flight at once.

## Voice notes

- **Now:** Angelo dictates into the Claude app in conductor.b@'s session (the phone's own dictation gives text), or pastes notes or a transcript. Text is what step 0 takes.
- **Audio files:** Indi's team owns "noisy audio to clean transcript" in THE RESTART (WS-208). When it exists, step 0 uses it rather than building a second one. Until then, an audio file waits for the phone's transcript.
- Interviews (Mikael's today) come in the same way: Angelo's notes, plus the consent he recorded.

## What workers may and may not do

As the pool spec: fresh session, no secret, only the item's files.
- **May:** write in `people/angelo/pipeline/<id>/`. The publish role may also write in the newsroom's `content/articles/` and `board/keys.json`, its own entry only, under the newsroom's CLAUDE.md and gate.
- **Never:**
  - publish without Angelo's quoted go;
  - send or post anything;
  - name a private person without consent;
  - touch another desk's article.
- Each newsroom change says, For: dev@PrompTugal.dinis, what it changes and how to undo it (Angelo's rule of 8 November).

## How the workers are run on B

- conductor.b@ **starts a worker's session for each step**, with the step's prompt (`people/angelo/pipeline/ROLES.md`: one prompt per role, the item's id filled in). That is the "conductor runner picks up, re-routes and runs each worker".
- If B's safety check refuses starting sessions, the fallback is the five scheduled tasks. Each has a slow fallback cadence (every two hours, staggered), takes the next step of the oldest item waiting, and Angelo taps Run now for speed.
- **The five names stay fixed**, so the ledger and the map count them as five. A worker's name goes with the session conductor.b@ starts; it takes the next free name.

## Setting it up (in this order)

1. **Angelo, in account B, once:**
   - connect GitHub, push to this repository and to the newsroom;
   - create an environment with no secrets (as "PrompTugal.angelo shared").
2. **Angelo:** starts a session with conductor.b@'s first prompt, `tasks/conductor.b.md`, written by the desk.
3. **conductor.b@'s first run:**
   - its STATE and runs.md;
   - `pipeline/ROLES.md` from this spec, for Angelo's read;
   - a first commit, so the desk can check the push.
4. **Angelo gives one real note** (Mikael's interview is a good first one). Measure it.
5. **The desk** retires the old workstream agents on A as the pool takes their rows (pool spec, section 7).

## Overlaps, to keep clear with the team

- **Indi's team:** the interview pipeline for the team's interviews. Ours is Angelo's own pieces; we share the transcript step.
- **Vicky's desks:** articles from GAMMA-Ray reports and the team's interviews. Ours do not take theirs.
- If the team wants one pipeline for everyone later, ours is a working example (WS-208 section 5: "ourselves as the case study").

## Questions for Angelo

1. **Step 3:** your go for every article, at least for the first few? *Recommendation: yes, then a standing go for low-risk kinds.*
2. **The publisher's byline:** "writer@PrompTugal.angelo, for Angelo" as today, or the publishing worker's own name?
3. **First item:** Mikael's interview from today?
