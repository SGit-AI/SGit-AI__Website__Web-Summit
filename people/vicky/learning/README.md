# What Vicky's agents can learn from Dinis's

Kept by scout@web-summit.vicky, at Vicky's word (6 November 2026). One short note per topic: what Dinis's agents do and why it works, how Vicky's agents do it today, and proposals Vicky can accept. Accepted proposals reach her agents only through conductor@web-summit.vicky ("Updates for agents" in `people/vicky/decisions.md`); the scout never changes an agent's files, prompts or schedules. Each proposal stays **open** until Vicky marks it accepted or rejected.

## Notes

| # | Note | Written |
|---|---|---|
| 01 | [How Dinis keeps about 26 agents running](01-how-dinis-keeps-26-agents-running.md): scheduled tasks, usage, drift | 6 Nov 2026 |

## Proposals

| # | Proposal | For | Cost in usage | Note | State |
|---|---|---|---|---|---|
| P1 | A hold file `people/vicky/HOLD.md` that stops every run | every scheduled agent | about nothing | 01 | open |
| P2 | Re-read your own prompts file at every run | every scheduled agent | about 1 to 3k input tokens a run | 01 | open |
| P3 | A status block (state, done, next, ask, run) ending every report line | every scheduled agent | a few dozen tokens a run; idle runs cheaper | 01 | open |
| P4 | One schedule file `people/vicky/schedule.json`, checked daily | conductor | about 5 to 10k tokens a day | 01 | open |
| P5 | Stagger the five journalists by 6 minutes | five journalists (Vicky changes the tasks) | none | 01 | open |
| P6 | Measure each session's usage once a day; never block | conductor | about 20 to 40k tokens a day | 01 | open |
| P7 | Publish only when the permission is in the newsroom's own record | reviewer | about nothing | 01 | open |
| P8 | Shorter scheduled prompts that point at `conductor.md` | conductor | saves about 1.5k tokens a wake | 01 | open |

## Next topics, most worth learning first

1. **Behaviour policies that survive compaction.** How abp@ writes one policy per agent from one data file, and how hooks re-load it after every compaction. Also whether Vicky's agents could get the same, given their sessions run outside the newsroom's settings. (`board/abp/`, the newsroom's `.claude/`)
2. **Hand-overs between sessions.** One role, one running session. The outgoing debrief, the old key marked superseded, the old task disabled, and the new session's own folder, so nothing is lost when a session is replaced. (newsroom `CLAUDE.md`, "Handing a role to a new session"; `board/team/designer/debriefs/`)
3. **Workers and reviewers.** Cheap Sonnet workers on their own branches, reviewed by one main agent before anything reaches `dev`. This could fit Vicky's five journalists and her reviewer. (newsroom `CLAUDE.md`, "Dotted names and the review workflow")
4. **Status, run reports and the dashboard.** `status.json` per agent, run reports in `board/runs/`, and the dashboard and three-hourly picture for Dinis built from them. Compared with Vicky's reports and 08:30 brief. (`board/the-team-setup.md`)
5. **The operator's words, kept.** `board/guidance/` keeps Dinis's spoken feedback close to word for word, one file per topic, and agents read it at every wake. Compared with Vicky's rules given in chat and kept in each prompts file. (`board/guidance/README.md`)

Also worth a look later: the agents' sealed inboxes (`board/inboxes/`) and passes (`board/the-passes.md`).
