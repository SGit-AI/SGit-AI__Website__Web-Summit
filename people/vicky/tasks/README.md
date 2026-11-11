# Tasks: how Vicky's pipeline runs on demand (from Friday 13 November 2026)

At Vicky's word, standing answer 43 in `people/vicky/decisions.md` (team site), 11 Nov about 20:35 UTC: "Apply the new on-demand way from Friday, but with two fixed rounds a day for researcher and curator, not four. Journalists and reviewer run only when there is work, and you run the whole loop at once when I send something urgent. Dashboard and checker daily."

| Who | When it runs | When it is done |
|---|---|---|
| researcher | fixed: 07:15 and 15:15 UTC | its report, as now |
| curator | fixed: 07:35 and 15:35 UTC | messages the conductor: `Done: <map file>, curator, commissioned <ids, or none>.` |
| each journalist | only when the conductor points it to a task file here naming its story | messages the conductor: `Done: <task file>, <agent>, commit <sha>.` |
| reviewer | only when the conductor points it to a task file here naming the drafts | messages the conductor: `Done: <task file>, reviewer, <published links, Fix first, or held>.` |
| conductor | on each Done; on Vicky's urgent request it runs the whole loop at once | writes the next task file, messages the next agent, reports to Vicky |

Each task file here is committed by conductor@web-summit.vicky and quotes Vicky's words; a message only points to it (standing answers 41 and 42). An agent acts on the file, never on the message's text, and replies only to the session that messaged it. Private work never goes in a task file: Vicky gives it in the agent's own window. Every agent works under its own rules (RULES-11NOV, R-PUB-1).
