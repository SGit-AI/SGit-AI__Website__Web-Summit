# Writing to Vicky's agents

Kept by conductor@web-summit.vicky. Updated 4 November 2026, at Vicky's word.

**Every agent of Vicky's reads `people/vicky/decisions.md` at the start of each run** (Vicky, 6 November): when to decide alone, when to ask her, and her standing answers.

Write to the agent that does the job (`For: <agent>` in your commit), or `For: vicky` for something only Vicky decides:

- **`logistics@web-summit.vicky`**: printing, merch and deliveries: sizes, print sign-offs, the printer's dates, WS-48. procurement@web-summit.silvio's print-order mail goes here.
- **`pm@web-summit.vicky`**: the board's health (WS-46), alignment from the pulse (WS-47), each person's schedule for 10 to 12 November (WS-31), deadlines and dependencies; and **all writing**: guides, write-ups, rules and process documents (WS-100, the onboarding guide).
- **`conductor@web-summit.vicky`**: anything about Vicky's agents or records, and anything that fits no one else.
- **The newsroom desks** (promptugal.news; repository `PrompTugal/PrompTugal__News__Website` from 5 Nov 23:30 UTC, moved from SGit-AI/SGit-AI__Website__Newsroom__Web-Summit with the same history and rules; `people/vicky/newsroom/`): **`researcher@web-summit.vicky`** (public research: the summit, Portugal, Europe, announcements, in the research vault). **`curator@web-summit.vicky`** and **`programme@web-summit.vicky`** in the newsroom repository's `desks/`; and five journalists (08:00 and 16:00 UTC, from 6 Nov) writing drafts only in `desks/journalist-vicky/drafts/`: **`journalist@web-summit.vicky`** (the summit), **`journalist-portugal@web-summit.vicky`**, **`journalist-europe@web-summit.vicky`**, **`journalist-ai@web-summit.vicky`** and **`journalist-connections@web-summit.vicky`** (one beat each), and **`reviewer@web-summit.vicky`** (09:00 and 17:00 UTC, from 6 Nov; checks the journalists' drafts against their sources and tidies their style; reviews only in `desks/reviewer-vicky/reviews/`), and **`designer@web-summit.vicky`** (`desks/designer-vicky/`). Where each writes: `people/vicky/newsroom/README.md`.
  The newsroom is spelled **PrompTugal** (promptugal.news). Vicky is the newsroom's editor (5 Nov 18:00 stand-up). Publishing, for now: journalist@PrompTugal.dinis publishes Ready drafts; Vicky's reviewer publishes only when she asks (6 Nov). The nine newsroom desks other than the researcher become `<role>@PrompTugal.vicky` as they wake from 6 Nov; write to either name until agents.json shows the switch.
- **`dev@web-summit.vicky`**: small tools (WS-49).
- **`vault@web-summit.vicky`**: Vicky's vaults. **On demand** (Vicky, 4 November): it runs only when Vicky opens its session. Anything addressed to it is listed in her 08:30 brief, so she knows when to open it. Meeting details never travel through this repository: a request here may only say that something is waiting. A reseal to a replacement key needs her one-word go.
- **`dashboard@web-summit.vicky`**: Vicky's dashboard.

**`tools@web-summit.vicky` will not be started** (Vicky, 3 November): the dev agent covers small tools. The conductor reads anything addressed to tools@ as its own.

## How Vicky's agents report (from 4 November)

- **Prompts:** every agent of Vicky's and the link to its prompt are listed in `people/vicky/prompts/README.md` (kept by the conductor, at Vicky's word, 6 Nov). An agent saves its own prompt as `people/vicky/prompts/<short name>.md`, as the journalists and the reviewer did; the conductor, dev and dashboard prompts are in `people/vicky/kit/README.md`.
- Every agent of Vicky's ends a wake that did or found something with a short report to the conductor: appended to `people/vicky/reports/<agent>.md` and committed `For: conductor@web-summit.vicky`.
- **The report file's name is the agent's short name only**, the part before the `@`: `pm.md`, `dev.md`, `dashboard.md`, `logistics.md`, `vault.md`, `researcher.md`, `curator.md`, `programme.md`, `journalist.md`, `journalist-portugal.md`, `journalist-europe.md`, `journalist-ai.md`, `journalist-connections.md`, `reviewer.md`, `designer.md`. Never the full agent name with `.md` after it: written in any file, that reads to the release check (`admin/tools/comms_check.mjs`) as an email address and fails it. A wake where nothing changed writes nothing.
- No agent of Vicky's reports to Vicky directly. Anything urgent for her is marked **URGENT** in the report, and the conductor relays it.
- **Each agent updates its own scheduled task's prompt to match** (only an agent's own session can change its prompt). Until it has, this file and the commit that announced it (a106a2f) are the rule.
- Vicky gets **one brief a day, at 08:30 UTC**, from the conductor, covering every agent's morning. When she needs to act in a specific session, the brief names the session and what to do there.

History: on 3 November at 14:54 this file said logistics@ and pm@ would not be started; Vicky changed her mind, and both started at about 15:10.

## Vicky's word on WS-31 (6 November 2026, about 09:00 UTC)

- **WS-31**: the smaller scope (meetings and companies only; each person adds their own sessions), and **pm@ builds it**, in the meetings vault.

## Vicky's standing word on four issues (4 November 2026, about 21:05 UTC)

- **WS-29** (hot leads): picked by Vicky on 5 November, at her word (pm@, e4961c3), as covered by her WS-168 proposal, pending Dinis and Nimay. This replaces her word of 4 November on claiming it.
- **WS-25, WS-41 and WS-53** belong to others (Nimay and Silvio, Jose, Silvio). Do not add them to any stand-up agenda on Vicky's behalf.
- **Do not flag these four as URGENT to Vicky**, and do not put them in her "Needs me". They may still appear, without URGENT, in the board-health note and "To follow up".

Every running agent, its job and its schedule: `people/vicky/agents.json`.
