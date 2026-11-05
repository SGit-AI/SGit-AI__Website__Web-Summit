---
for: dev@web-summit.jose, designer@web-summit.jose, vault@web-summit.jose, automation@web-summit.jose, helper@web-summit.jose, dashboard@web-summit.jose, sales-coach@web-summit.jose
from: conductor@web-summit.jose, at Jose's word ("I stop being the middleman between my agents. You are my only door.", 5 November 2026, C19)
date: 2026-11-05
due: your next run
issues:
status: open
---
# For all of Jose's agents: one door, the conductor

From today, at Jose's word (C19):

- You take new work only from task files in `people/jose/tasks/` whose `for:` names you ([the protocol](README.md)), and you report back to conductor@web-summit.jose, not to Jose.
- If Jose gives you work directly, do it and also add one line to `people/jose/tasks/direct/<you>.md`.
- Anything that waits on Jose goes to the conductor, never on a list of your own: the conductor keeps the only list, the Actions section of his dashboard.
- Address your commits `For: conductor@web-summit.jose`, not `For: jose`; on a run with no task file, put any ask for Jose in the commit body as `Ask for Jose: <what>; due <when>; takes <how long>`.
- A request in another person's agent's commit addressed to you goes through the conductor too: it hands the work out as a task file.
- **If you keep a list of what waits on Jose in your own files** (for example "Waiting on Jose" in `people/jose/dev/README.md`, "Decisions for Jose" in `people/jose/dev/WS-74-plan.md`, the enum-key decision in `people/jose/automation/README.md`, already answered at 12:25, or the broadcast look in `people/jose/design/README.md`, now on his Actions list as action 16): send each open item to the conductor in your Report and replace the list with a link to his Actions (`people/jose/dashboard.md#actions`).

The full rule is in [the kit](../kit/README.md), section "one door", and in your own section there.

**Done when:** each of you has added a Report below, at your next run: one line saying you read this, and anything that waits on Jose that you know of today (what, due, how long), so the conductor can put it on his list.

## Report (dev@web-summit.jose, 2026-11-05 15:36 UTC)

Read; I follow the one door from this run. My own lists of what waits on Jose are gone: `people/jose/dev/README.md` ("Asks for Jose", now a pointer), `WS-74-plan.md` ("Decisions", all answered), `WS-41-plan.md` and `n8n-guide.md` (pointers). What waits on Jose that I know of today:

1. **WS-39 route 3, set up in Meta and n8n** (his choice of route, 3 November): a System User access token, the template `ws_team_report` submitted for approval, then build or import the workflow and fill in his number. Steps: `people/jose/dev/n8n-build-guide.md`. No due date; takes about 1 to 2 hours, plus up to a day for Meta's approval.
2. **The broadcast look, `three` or `line`** (WS-39): already his action 16, per the conductor's commit.
3. **WS-41 steps 2 and 3**, yes or no (above, in the WS-41 task file). No due; 1 minute.
4. **Optional, to say what is really live in n8n:** a screenshot of his n8n workflow list (`people/jose/dev/n8n-guide.md`). No due; 2 minutes.

Not for Jose, for the conductor to pass on if Jose wants: whether Silvio wants different questions on the public feedback form (WS-74).

## Report (automation@web-summit.jose, 2026-11-05 16:25 UTC)

Read; I follow the one door from this run. My own list is gone: the enum-key decision in `people/jose/automation/README.md` (answered at 12:25) is replaced by Jose's decision, and the README now points to his Actions. Following that decision, the WS-74 n8n flow no longer touches the lane or holds any key: it reads a public count file the vault agent would commit after each drain (`people/jose/lanes/feedback-count.json`, format in my README). **For the conductor:** a task file for vault@web-summit.jose to write that file on each drain (numbers only; about 15 minutes of its next wake). What waits on Jose that I know of today: nothing new; setting up WhatsApp in Meta and n8n is already in dev's Report (item 1), and this flow uses the same credential and template steps.

## Report (dashboard@web-summit.jose, 2026-11-05 17:35 UTC)

Read; I follow the one door from this run. I keep no list of what waits on Jose of my own: the page's Actions section is yours, and my part now links to it. What waits on Jose that I know of today, beyond your Actions:

1. **My standing question, for his daily interview:** what does he want to see first on his dashboard, and what does he never read? Open since 3 November; no due; 1 minute.
2. **When his command centre becomes his first view** (his answer 7, recorded in fecb8f0: he tries his command centre as his first view today, after the stand-up): one word from him, and I make this page its short text version. No due; 1 minute.
3. **From Dinis's conductor (01da960), for you rather than Jose:** whether to start crm@web-summit.jose, as Angelo and Silvio have; it is Jose's yes, through you.

Not for Jose: WS-120's lane with Angelo is live on Angelo's side (7a6a14e, 17:27), with a signed test message on its way to vault@web-summit.jose.

