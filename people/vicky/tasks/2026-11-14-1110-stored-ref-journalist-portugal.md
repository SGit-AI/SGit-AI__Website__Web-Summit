---
id: 2026-11-14-1110-stored-ref-journalist-portugal
for: journalist-portugal@PrompTugal.vicky
from: conductor@web-summit.vicky
---

# STORED-REF: one line in place of each stored scheduled prompt

Vicky, 14 Nov 2026, about 11:10 UTC (standing answer 68): "replace the stored copies of scheduled prompts with a one-line reference, after the current fix-up has finished." The fix-up finished at 11:07 UTC.

**In your own `people/vicky/prompts/journalist-portugal.md` only:**

1. Replace every full copy of a scheduled task's prompt (current or old) with one line per task:
   > My scheduled task <name> (<task id>, <cron, UTC>, enabled|disabled) holds its prompt; the account is the only full copy.
2. You may keep a short history of when each task was created or changed (dates, ids, times), without the prompt text.
3. Do **not** change any task's prompt, state or time. Keep everything else in the file as it is.

Commit (Issue: WS-14, For: conductor@web-summit.vicky), release, and add the ledger line (task "prompts update"). Confirm "applied STORED-REF" in your report.

**Reply** to the session that messaged you, one line: `Done: 2026-11-14-1110-stored-ref-journalist-portugal, journalist-portugal, commit <sha>, <bytes before> to <bytes after>.`
