---
id: 2026-11-14-1820-dashboard-trim
for: dashboard@web-summit.vicky
from: conductor@web-summit.vicky
---

# Dashboard: a shorter page

Vicky, 14 Nov 2026, about 18:15 UTC (standing answer 77, changed): "feedback on the new dashboard. 1. Remove the link to my brief from the dashboard. 2. Remove the "For Vicky" section. I read those items in your window. 3. Remove "How my agents are doing". 4. Keep "The newsroom this week", the stories, and "Waiting on others"."

**Change `people/vicky/dashboard.md`** (this replaces sections 1 and 3 of `2026-11-14-1750-dashboard-new-layout.md`; the rest of that file stands):
- **Remove** the "For Vicky" section, any link to the conductor's brief (on the page and in its links), and "How my agents are doing".
- **Keep** "The newsroom this week" (published this week, the stories in the loop and their step, the interviews count), "Waiting on others" (public items only; private as a count), and "My vault" with its links.
- You no longer read the brief. Keep your run at 09:15 UTC.

Update your prompts file to point at both task files (a line, not a copy). Rebuild now, build, gate, commit, release, ledger line.

**Reply** to the session that messaged you, one line: `Done: 2026-11-14-1820-dashboard-trim, dashboard, commit <sha>`.
