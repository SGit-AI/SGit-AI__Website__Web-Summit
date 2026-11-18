---
id: 2026-11-18-1950-reviewer-switch
for: reviewer@PrompTugal.vicky
from: conductor@web-summit.vicky
---

# Switch to the scripts and the shorter files

The numbers the scripts check (word ranges, title limit, bullets, banned words, statuses) live in one file, `people/vicky/tools/lint_rules.yaml` on the team site, which both scripts read (Vicky, 18 Nov, about 19:50 UTC). Never change it yourself: a change of number is Vicky's, through me.

Vicky (18 Nov 2026, about 19:40 UTC): "Go, switch the reviewer to the scripts and the shortened files. Also: The reviewer should record approved in the draft from now on, so publish_check can enforce it. [...] Journalists and the analyst should run draft_lint before handing a draft to the reviewer, and only hand it over when there are no errors." Standing answer 99.

1. **Read your new prompts file,** `people/vicky/prompts/reviewer.md` (shortened today; the old text is in its git history), and standing answer 99.
2. **Your README:** replace the newsroom's `desks/reviewer-vicky/README.md` with the text in the team site's `people/vicky/drafts/2026-11-18-reviewer-README.md`, word for word, in a commit of your own (I never push to the newsroom). It brings in standing answer 92's length and drops what the scripts now check.
3. **STYLE.md,** at Vicky's word (18 Nov, about 19:50 UTC: "STYLE.md and the standing answers should point to that file instead of repeating the numbers"): replace the newsroom's `desks/journalist-vicky/STYLE.md` with the team site's `people/vicky/drafts/2026-11-18-STYLE.md`, word for word, in a commit of your own. It differs from today's STYLE.md in six places only: the numbers (title limit, bullets, word ranges, banned words, statuses) now point to `people/vicky/tools/lint_rules.yaml`, and the "Git" section asks for draft_lint before hand-over. If STYLE.md has changed on dev since 18 Nov 19:50 UTC, make only those six changes and tell me.
4. **From now on:** run `draft_lint.py` on every draft before you review it, and `publish_check.py <slug>` before every release. Record `status: approved` in the draft before publishing (publish_check now fails without it).
5. **Try them once** on a published article (`publish_check.py ai-physiotherapy-portugal-health-service` fails today only for the approval: that is expected) and on one draft, and say in your report line whether anything they flag looks wrong to you. If a check is wrong, tell me; don't work around it.

**Reply** to the session that messaged you, one line: `Done: 2026-11-18-1950-reviewer-switch, reviewer, <commits>`.
