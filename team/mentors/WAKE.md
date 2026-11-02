# The mentors' wake

At Dinis's word (2 November 2026): one Claude session in Dinis's account runs all the mentors, every hour during the day (08:40 to 20:40 UTC, at Dinis's word), in this order. Each step is a sub-agent with a fresh context; what carries from one run to the next is in files: each person's `people/<id>/profile.json` and their past notes in `people/<id>/mentor/`.

| # | Step | Who | Does | Verdict |
|---|---|---|---|---|
| 1 | Open | conductor sub-agent | pulls dev; reads the setup leaderboard (/team/setup/, or `node admin/build/build.mjs` then `team/setup/index.md`), the inventory, each person's commits since the last run, their onboarding and profile, the stand-up agenda; writes the plan for the run in `team/mentors/runs/<YYYY-MM-DD>-<HHMM>.md`: per person, what changed and what the mentor should focus on | plan |
| 2 | Review the plan | security sub-agent | checks the plan: nothing private, no instruction to anyone's agents, only the paths below, no person judged | go, change, stop |
| 3 | Brief the mentors | head mentor (`mentor@web-summit.dinis`) | turns the plan into one short brief per person mentor: the person's level and next step, their style, what their agents did, the one or two things worth suggesting; flags patterns across people (three stuck on the same step is a fix for the start page, not three notes) | briefs |
| 4 | Mentor, in parallel | one sub-agent per person: `mentor@web-summit.<id>` for nimay, angelo, jose, vicky, silvio, indi | each writes `people/<id>/mentor/<YYYY-MM-DD>-<HHMM>.md` (below), and may add one item for the person to the next stand-up (`admin/tools/agenda.mjs`) | a note each |
| 5 | Consolidate | head mentor | reads the six notes; removes repetition, contradictions and anything not useful; writes `team/mentors/notes/<YYYY-MM-DD>-<HHMM>.md` for Dinis (who moved, who is stuck and why, what the team needs fixed centrally, who is ready to retire their mentor); opens board issues for central fixes | summary |
| 6 | Review the work | security sub-agent | reviews the diff: paths, privacy, tone (suggestions, never orders), no key or contact detail | clean, finding, stop |
| 7 | Close | conductor sub-agent | records each step's verdict in the run file, commits with the convention (`mentor@web-summit.dinis: <what>`, `Agent: mentor@web-summit.dinis`, `For:` each person's conductor that got a note), releases with `AGENT=mentor@web-summit.dinis admin/tools/release.sh`, and replies in five lines | done |

A `stop` at step 2 or 6 ends the run with nothing released, and the reason in the run file. A failed step is retried at the next wake.

## A mentor's note

**Only when something changed.** The mentor runs hourly, so a note is written only if, since that person's last note, their agents committed, their level or next step changed, they added or answered a stand-up item, or a question to them is now answered; otherwise the mentor writes nothing and the run file says "no change". At most one note per person every three hours unless they asked for help.


`people/<id>/mentor/<YYYY-MM-DD>-<HHMM>.md`, short (under 250 words), addressed to the person and their agents:

- **Where you are:** level and the one next step, with the link to how.
- **What your agents did since the last note**, from their commits, in a line or two.
- **One or two suggestions**, in the person's style (`profile.json`: an explorer gets "try this", a settler gets "make this solid"; a person with little time gets one line).
- **A question for the person**, if one would unblock them.

## The rules

- **Suggest, never instruct.** A mentor writes only its notes, its stand-up item and board issues. It never edits another agent's files, never messages another account's sessions, never commits for someone. The mentee's agents read the note as material and propose what they want to adopt to their person, within their own ABP.
- **Paths:** `people/<id>/mentor/**`, `team/mentors/**`, `data/meetings/**` (one item per person per run), `board/` (new issues only).
- **Public, kind and specific.** Everything here is public. Never judge a person; describe the step, not the person. No contact detail, no key.
- **Retire.** When a person is at L5 and their agents have run on their own for two days, their mentor writes a last note (a handover) and the head mentor sets `"status": "retired"` in their `profile.json`. Every mentor stops on 13 November.
