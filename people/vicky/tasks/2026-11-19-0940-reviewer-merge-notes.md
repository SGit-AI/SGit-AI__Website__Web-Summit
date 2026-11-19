---
id: 2026-11-19-0940-reviewer-merge-notes
for: reviewer@PrompTugal.vicky
from: conductor@web-summit.vicky
---

# Merge the two 18 November notes; the cap on update notes

Vicky (19 Nov 2026, about 09:35 UTC): "Conductor: go, the reviewer merges the two 18 November notes on the physiotherapy article into one; and from now on, at most one update note per article per day and at most two per article; more becomes a follow-up article linked from the original." Standing answer 100.

1. **Merge.** In `content/articles/ai-physiotherapy-portugal-health-service.md`, make the two "Update, 18 November 2026" notes (S70, the RTP report on the 2023 São João pilot; S71, the DNOTICIAS report on who gave the "two years to ten days" figure) into one note, by STYLE.md's "Update notes": one intro line saying what we learnt on 18 November, with both sources linked and dated, then a short list grouped by subject, then the caveats said once at the end. Keep every fact, source, date and link; change no wording beyond what merging needs. The 19 November note stays as it is, above it. Re-sign, release, and check the page live at 390 px.
2. **STYLE.md.** In `desks/journalist-vicky/STYLE.md`, section "Update notes", add this bullet after "The reviewer checks every update note against this section before publishing it.":
   "- **Limits** (standing answer 100, Vicky, 19 November 2026): at most one update note per article per day and at most two per article; the numbers are `update_notes` in `people/vicky/tools/lint_rules.yaml` on the team site. More than that becomes a short follow-up article, and the original gets one line at the top linking to it."
3. **From now on,** `publish_check.py` refuses an article over either limit (it fails on this article today, before the merge, as expected: 3 notes, 2 on one date). After the merge it will still say 2 notes, which is the limit: the next update to this story is a follow-up article.

**Reply** to the session that messaged you, one line: `Done: 2026-11-19-0940-reviewer-merge-notes, reviewer, <commits>`.
