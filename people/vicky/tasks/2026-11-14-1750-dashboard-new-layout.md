---
id: 2026-11-14-1750-dashboard-new-layout
for: dashboard@web-summit.vicky
from: conductor@web-summit.vicky
---

# The dashboard after the summit: a new layout

Vicky, 14 Nov 2026, about 17:45 UTC (standing answer 77): "yes to the new dashboard layout, with two changes. 1. The page is public. In "For Vicky" and "Waiting on others", show only items that are safe to publish. For private items, show only a count, e.g. "1 private item, see conductor". 2. "For Vicky" should match your latest brief, not the evening before. ... Drop the summit-era parts as you suggested."

**Rebuild `people/vicky/dashboard.md` with these sections, top to bottom** (keep the front matter: `compact: true`, `office_link`; keep "My vault" open with its `vault-app vicky k64ma7jd auto` line):
1. **For Vicky:** the For Vicky items of the conductor's newest brief (`people/vicky/briefs/<stamp>.json`), each labelled with that brief's date and time. Public items as written; private items only as a count, exactly as the brief gives them ("1 private item, see conductor"). If the newest brief is older than today, say so on the first line.
2. **The newsroom this week:** articles published on PrompTugal.news from Vicky's desks in the last seven days (title, link); stories in the loop and their step, from the task files in `people/vicky/tasks/` and the newsroom's drafts (for example "S65: with the reviewer"); the Humans and AI interviews count (published of total, from decisions.md standing answer 70 and the live articles; counts only).
3. **My agents:** one line each: last run, next run (from `people/vicky/schedule.json`), and any problem from its latest report.
4. **Waiting on others:** open requests in `people/vicky/requests/` with no reply yet (who, what, since when). Only what is safe to publish; anything private as a count only.
5. **My vault and links:** as now, without the logo options link.

**Drop:** "Needs me" and "To follow up" built from the board and the stand-up agendas, the "Team follow-ups" fold, the summit board due dates, and the logo options link.

**Your schedule:** the conductor moved your daily task (trig_01FSSzDCWMqwD5jwd8xGF6JT) from 07:50 to **09:15 UTC**, after the 08:45 brief, at Vicky's word. In your scheduled task's prompt, change "Scheduled run (07:50 or 17:45 UTC)" to "Scheduled run (09:15 UTC)" and replace the "Each wake, rebuild the two tables..." paragraph with a one-line reference to this task file; keep P1 to P3 and the rest. Update your prompts file to match (a line, not a copy).

Do the first rebuild now. Build, gate, commit, release, ledger line.

**Reply** to the session that messaged you, one line: `Done: 2026-11-14-1750-dashboard-new-layout, dashboard, commit <sha>; scheduled prompt: changed`.
