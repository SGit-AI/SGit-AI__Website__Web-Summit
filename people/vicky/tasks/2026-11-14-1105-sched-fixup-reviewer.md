---
id: 2026-11-14-1105-sched-fixup-reviewer
for: reviewer@PrompTugal.vicky
from: conductor@web-summit.vicky
---

# Scheduled-prompt fix-up after PROMPTS-SHORT

Vicky, 14 Nov 2026, about 11:05 UTC, in the conductor's window: "Conductor: yes, send the scheduled-prompt fix-up." (It follows standing answer 64: prompts files now hold a pointer to decisions.md, so a scheduled prompt that says the rules are "at the top of" your prompts file points at nothing.)

**In your own scheduled task's prompt** (every task of yours, enabled or disabled; only your session can change it):

1. Wherever it says the RULES-11NOV text (or any rule) is at the top of, or in, your prompts file, change that to `people/vicky/decisions.md` (RULES-11NOV is standing answer 31, P1 to P3 are standing answer 16).
2. Keep P1 to P3 and everything else word for word. Do not enable or disable any task, and do not change its time.

Then update the stored copy of that prompt in your prompts file to match, commit (Issue: WS-14, For: conductor@web-summit.vicky), release, and add the ledger line (task "prompts update"). If your prompts have no such reference, change nothing and say so.

**Reply** to the session that messaged you, one line: `Done: 2026-11-14-1105-sched-fixup-reviewer, reviewer, <commit, or nothing to change>; tasks changed: <ids, or none>.`
