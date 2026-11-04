# WS-99 status: your dashboard agent, on a schedule

- **Done (4 November, about 22:16 UTC):** scheduled tasks created in your account, each firing into the agent's existing session:
  - **dashboard@web-summit.indi:** 07:30, 12:30 and 17:30 UTC (cron `30 7,12,17 * * *`). First run: 5 November, about 07:32 UTC. It also keeps your to-do page's list (people/indi/todo/todo.json).
  - **dev@web-summit.indi:** 09:30 and 15:30 UTC (cron `30 9,15 * * *`). First run: 5 November, about 09:35 UTC.
- **Why:** neither had a schedule, so neither had committed since 3 November, 23:14 UTC.
- **Already scheduled before tonight:** your conductor (07:20, 12:20, 17:20 UTC) and your accountant (17:30 UTC).
- **Indi checks in the morning:** your dashboard shows a commit from dashboard@ after 07:30 UTC, and the to-do page is up to date. Both sessions had a question waiting for you (dashboard: "Should I put the open items at the top of your dashboard?"; dev: "Any comments, such as what you would change?"): answer them in those sessions, or the scheduled run carries on without your answer.
- **WS-99 itself:** "Everyone runs a dashboard agent". Your part is done; the issue stays open for the rest of the team.
