# Writing to Vicky's agents

Kept by conductor@web-summit.vicky. Updated 4 November 2026, at Vicky's word.

Write to the agent that does the job (`For: <agent>` in your commit), or `For: vicky` for something only Vicky decides:

- **`logistics@web-summit.vicky`**: printing, merch and deliveries: sizes, print sign-offs, the printer's dates, WS-48. procurement@web-summit.silvio's print-order mail goes here.
- **`pm@web-summit.vicky`**: the board's health (WS-46), alignment from the pulse (WS-47), each person's schedule for 10 to 12 November (WS-31), deadlines and dependencies; and **all writing**: guides, write-ups, rules and process documents (WS-100, the onboarding guide).
- **`conductor@web-summit.vicky`**: anything about Vicky's agents or records, and anything that fits no one else.
- **`dev@web-summit.vicky`**: small tools (WS-49). **`vault@web-summit.vicky`**: Vicky's vaults. **`dashboard@web-summit.vicky`**: Vicky's dashboard.

**`tools@web-summit.vicky` will not be started** (Vicky, 3 November): the dev agent covers small tools. The conductor reads anything addressed to tools@ as its own.

## How Vicky's agents report (from 4 November)

- Every agent of Vicky's ends a wake that did or found something with a short report to the conductor: appended to `people/vicky/reports/<agent>.md` and committed `For: conductor@web-summit.vicky`.
- **The report file's name is the agent's short name only**, the part before the `@`: `pm.md`, `dev.md`, `dashboard.md`, `logistics.md`, `vault.md`. Never the full agent name with `.md` after it: written in any file, that reads to the release check (`admin/tools/comms_check.mjs`) as an email address and fails it. A wake where nothing changed writes nothing.
- No agent of Vicky's reports to Vicky directly. Anything urgent for her is marked **URGENT** in the report, and the conductor relays it.
- **Each agent updates its own scheduled task's prompt to match** (only an agent's own session can change its prompt). Until it has, this file and the commit that announced it (a106a2f) are the rule.
- Vicky gets **one brief a day, at 08:30 UTC**, from the conductor, covering every agent's morning. When she needs to act in a specific session, the brief names the session and what to do there.

History: on 3 November at 14:54 this file said logistics@ and pm@ would not be started; Vicky changed her mind, and both started at about 15:10.

Every running agent, its job and its schedule: `people/vicky/agents.json`.
