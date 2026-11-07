# What Vicky's agents can learn from Dinis's

Kept by scout@web-summit.vicky, at Vicky's word (6 November 2026). One short note per topic: what Dinis's agents do and why it works, how Vicky's agents do it today, and proposals Vicky can accept. Accepted proposals reach her agents only through conductor@web-summit.vicky ("Updates for agents" in `people/vicky/decisions.md`); the scout never changes an agent's files, prompts or schedules. A proposal stays **open** until Vicky marks it accepted, on hold or rejected.

The scout writes the next topic from the list below every day at 22:00 UTC (its scheduled task, Vicky's word of 6 November).

## Notes

| # | Note | Written |
|---|---|---|
| 01 | [How Dinis keeps about 26 agents running](01-how-dinis-keeps-26-agents-running.md): scheduled tasks, usage, drift | 6 Nov 2026 |
| 02 | [Behaviour policies that survive memory compression](02-policies-that-survive-compaction.md) | 6 Nov 2026 |
| 03 | [Cheap worker agents](03-cheap-worker-agents.md): which jobs Dinis gives to Sonnet, which of Vicky's could move, and how usage is read | 6 Nov 2026 |
| 04 | [Handing a role to a new session](04-handing-a-role-to-a-new-session.md) | 6 Nov 2026 |
| 05 | [The inbox agent](05-the-inbox-agent.md): how inbox@web-summit.dinis is set up, and what Vicky would copy | 6 Nov 2026 |
| 06 | [Status, run reports and the dashboard](06-status-run-reports-and-the-dashboard.md) | 6 Nov 2026 |

Questions put to Dinis's mentor agent (mentor@web-summit.dinis), and which are answered: [questions-for-the-mentor.md](questions-for-the-mentor.md).

## Proposals

| # | Proposal | For | Cost in usage | Note | State |
|---|---|---|---|---|---|
| P1 | A hold file `people/vicky/HOLD.md` that stops every run | every scheduled agent | about nothing | 01 | accepted (6 Nov) |
| P2 | Re-read your own prompts file at every run | every scheduled agent | about 1 to 3k input tokens a run | 01 | accepted (6 Nov) |
| P3 | A status block (state, done, next, ask, run) ending every report line | every scheduled agent | a few dozen tokens a run; idle runs cheaper | 01 | accepted (6 Nov) |
| P4 | One schedule file `people/vicky/schedule.json`, checked daily | conductor | about 5 to 10k tokens a day | 01 | accepted (6 Nov) |
| P5 | Stagger the five journalists by 6 minutes | five journalists (Vicky changes the tasks) | none | 01 | accepted (6 Nov) |
| P6 | Measure each session's usage once a day; never block | conductor | about 20 to 40k tokens a day | 01 | accepted (6 Nov) |
| P7 | Publish only when the permission is in the newsroom's own record | reviewer | about nothing | 01 | on hold (until Dinis records the reviewer's permission) |
| P8 | Shorter scheduled prompts that point at `conductor.md` | conductor | saves about 1.5k tokens a wake | 01 | accepted (6 Nov) |
| P9 | Check, once, whether the newsroom's hooks run in your session | newsroom desks, curator, programme | about nothing | 02 | accepted (6 Nov: to the desks first) |
| P10 | After a compression in a chat, re-read your files before acting | every agent | 2 to 5k tokens, only after a compaction | 02 | accepted (6 Nov) |
| P11 | Ask Dinis how the newsroom's hooks treat Vicky's agents | Vicky (to raise with Dinis) | none | 02 | open |
| P12 | Try a start-up hook of Vicky's own on one agent | Vicky (environment), then conductor | 3 to 5k tokens per start; Vicky's time | 02 | open |
| P13 | Move the researcher to Sonnet at its next hand-over | researcher, through Vicky | one hand-over; saves perhaps half to two-thirds | 03 | open |
| P14 | Move the dashboard to Sonnet at its next hand-over | dashboard, through Vicky | one hand-over; the largest saving of the candidates | 03 | open |
| P15 | Trial one journalist (journalist-ai) on Sonnet for two days | journalist-ai, reviewer, conductor | one hand-over; small saving, a measured answer | 03 | open |
| P16 | Narrow reading in a Sonnet sub-agent inside the conductor's run | conductor | one Sonnet sub-agent a brief; saves on the costliest session | 03 | accepted (6 Nov) |
| P17 | A debrief, and secrets removed, when you are replaced | every agent | 20 to 40k tokens once per hand-over | 04 | accepted (6 Nov) |
| P18 | The conductor runs the hand-over checklist | conductor | 10 to 20k tokens per hand-over | 04 | accepted (6 Nov) |
| P19 | A commit from a replaced session is URGENT | conductor | about nothing | 04 | accepted (6 Nov) |
| P20 | A fresh session for sessions past about 500k context, when Vicky chooses | Vicky, then P17 and P18 | one hand-over each; saves on every later run | 04 | open |
| P21 | Turn off sending (`send_message`, `reply`, `forward`) for the Gmail connector | Vicky (account setting) | none | 05 | open |
| P22 | Every agent but the inbox agent leaves Gmail alone | every agent; conductor checks | about nothing | 05 | accepted (6 Nov) |
| P23 | Start inbox@web-summit.vicky, copying Silvio's inbox policy | Vicky, then conductor | a new Opus session; 50 to 150k tokens a mail run | 05 | open |
| P24 | The conductor seals the private CRM's key to the inbox agent, at Vicky's word | conductor | 10 to 20k tokens once | 05 | open |
| P25 | An "agents" table on Vicky's dashboard from the status blocks, with stale rows and open asks | dashboard | 15 to 30k tokens a dashboard run | 06 | open |
| P26 | A small grid of today's scheduled runs at the top of the 08:30 brief | conductor | a few thousand tokens a brief | 06 | open |
| P27 | Never copy a received prompt into a public file | every agent | none | 06 | open |

## Next topics, most worth learning first

1. **The operator's words, kept.** `board/guidance/` keeps Dinis's spoken feedback close to word for word, one file per topic, and agents read it at every wake. Compared with Vicky's rules given in chat and kept in each prompts file. (`board/guidance/README.md`)

Written: behaviour policies (02), cheap workers (03), hand-overs (04), at Vicky's request the inbox agent (05), and status, run reports and the dashboard (06).
