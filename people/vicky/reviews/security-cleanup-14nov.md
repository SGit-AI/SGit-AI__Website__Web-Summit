# Security review: the rules cleanup of 14 November 2026 (standing answer 63, CLEANUP-14NOV)

By security@web-summit.vicky, 14 November 2026, about 10:25 UTC, at Vicky's word in my window ("review the cleanup itself"). Reviewed on dev:

- `people/vicky/decisions.md` and `people/vicky/decisions-archive.md` (conductor@web-summit.vicky, caa9bcc0 and cb112b74), against the version before the cleanup (bbda0ba7);
- the 17 task files `people/vicky/tasks/2026-11-14-1015-cleanup-*.md` (fb2eacbe);
- the 16 prompts-file commits made for CLEANUP-14NOV so far (15 agents and the conductor, from 42f36807 to 7fa35b72), and my own (136bdc3c).

## Result

**The cleanup is safe. Nothing URGENT, no hold recommended.** Every rule that protects a key, a vault, private data, Vicky's mail or the sites we may not read by machine is still in force, in decisions.md and in the agents' own files. What was retired is what Vicky named. Three small points follow, none of them a breach.

## What I checked

| Check | Result |
|---|---|
| Who changed decisions.md and the archive since 11 Nov | Only the conductor, every commit with its title and Agent line; Vicky's words quoted with their time in standing answer 63 and its status line. |
| Nothing deleted | Retired text is in `decisions-archive.md`; entry numbers kept. |
| The rules that matter for security, still in decisions.md | the guard; "Ask Vicky only when it" (keys, tokens, vaults, publishing, pushes, deletes); P22 (only inbox@ uses Gmail); P27 (prompts and run reports private); P17 (debrief and key clean-up when replaced); P10; the shortlist's confidentiality; no CRM or private material in stories; RULES-11NOV rules 1 to 4 and 6 (no machine reads of Web Summit, Luma, Meetup or Eventbrite; sources); R-PUB-1's limits; the router held; vault A's safe-to-publish rule; private work only in the agent's own window; never `interrupt_session` or read another session. All present. |
| The 17 task files | All added by the conductor's commit; no key, token, contact detail, session id or private content. "Shortlist" appears in inbox's and vault's only as the name of the rule that stays. |
| The 16 prompts commits | Each agent changed only its own files. No key, token, contact detail or session id added. The lines removed are the retired ones (old rule 5, the agenda freeze, the narrow hold check, "never publish at a scheduled run", the fix-only and timetable tasks). Every prohibition I compared against the version before the cleanup is either still there or replaced by the newer rule. The conductor kept "the interview shortlist stays out of the public repository ... Never a shortlist name" and archived only "until Dinis has picked", as Vicky said. |

## Points

1. **Four prompts files are not updated yet: designer, journalist, programme, synthetic** (low). They still carry the narrow hold check (only `people/vicky/HOLD.md`), so if one of them runs before it applies CLEANUP-14NOV it would not stop for Dinis's stop files. Designer is paused, and journalist and programme are due for their role changes; it matters only if one is woken first. The conductor's brief already tracks who has confirmed.
2. **Scheduled-task ids are in prompts files and reports** (low, not new). Several agents name their task ids (`trig_...`) when they report what they changed, as these files did before. Vault A's rule (standing answer 35) counts them as private; for these public files no rule forbids them, and a task id is usable only from within Vicky's account. If Vicky wants, a later rule could keep them out, as for session ids.
3. **The decisions.md guard is still the commit-title check** (accepted). Standing answer 42 keeps it, knowing it can be forged by anyone who can push; nothing in this cleanup changed that. Vicky's decision; noted only so the record is complete.

Also noted, not a finding: the conductor added a "Closed" section to my review `security-p6-step1.md` (b032d669), quoting Vicky's word in its window. The content is right; it is another agent's file, so in future I would rather record such a closure myself, as I did in my report.
