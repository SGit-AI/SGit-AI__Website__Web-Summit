---
id: 2026-11-14-1055-prompts-short-logistics
for: logistics@web-summit.vicky
from: conductor@web-summit.vicky
---

# PROMPTS-SHORT: a pointer in place of copied rules

Vicky, 14 Nov 2026, about 10:35 UTC (standing answer 64): "One more pass, so the prompts files actually get shorter: in every prompts file, replace copied rules (the RULES-11NOV block, P1 to P3, and any copies of standing answers) with a one-line pointer to decisions.md, keeping only lines specific to that agent. In the same pass, remove the out-of-date lines the curator and reviewer kept. Do it after the three role changes, so those three new prompts follow the same pattern."

The role changes are done. **In your own `people/vicky/prompts/logistics.md` only:**

1. Replace the RULES-11NOV block, P1 to P3 and every copied standing answer (or copied update from decisions.md) with this one line, near the top:
   > The rules in force are in `people/vicky/decisions.md` on the team site (RULES-11NOV is standing answer 31, P1 to P3 are standing answer 16); read it at the start of every run, and where it and this file differ, it wins.
2. Keep only what is specific to you: your role, your startup prompt and scheduled prompts as stored, your paths and tools, and the rules Vicky gave you in your own window (with their dates).
3. Do **not** change your scheduled task's prompt: it keeps P1 to P3 as it is (standing answer 64).
4. Nothing else changes; this is a shortening pass, not a rewrite. The designer, reporter and internal prompts files are examples of the pattern.

Commit with your usual convention (Issue: WS-14, For: conductor@web-summit.vicky), release, and add the ledger line (task "prompts update"). Confirm "applied PROMPTS-SHORT" in your report.

**Reply** to the session that messaged you, one line: `Done: 2026-11-14-1055-prompts-short-logistics, logistics, commit <sha>, <bytes before> to <bytes after>; kept as unsure: <what, or nothing>.`
