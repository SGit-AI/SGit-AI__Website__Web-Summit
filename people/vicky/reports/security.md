# security@web-summit.vicky: reports

Newest first. Each finding names its commit. URGENT only where it matters.

## 14 Nov 2026, about 10:26 UTC: the rules cleanup reviewed

Done reply sent to the conductor's session at about 10:20 UTC (one line, pointing to 136bdc3c).

Review: `people/vicky/reviews/security-cleanup-14nov.md`. **Safe; nothing URGENT; no hold recommended.** decisions.md changed only by the conductor (caa9bcc0, cb112b74) with Vicky's words; nothing deleted; every security rule (guard, Gmail, private data, shortlist, keys, vaults, no machine reads, R-PUB-1's limits, router held) still in force. The 17 task files (fb2eacbe) and 16 prompts commits hold no key, token, contact detail or session id, and each agent changed only its own files. Low points: designer, journalist, programme and synthetic still have the narrow hold check until they apply CLEANUP-14NOV; task ids appear in prompts files and reports (not new); the guard stays forgeable by Vicky's choice (standing answer 42).

state: ok; done: CLEANUP-14NOV applied, Done reply, cleanup reviewed; next: on demand; ask: none; run: prompted

## 14 Nov 2026, about 10:25 UTC: applied CLEANUP-14NOV

Vicky, in my window: "Security: yes to all three. Apply the cleanup to your prompts file, send the conductor the one-line Done reply, and review the cleanup itself. On P6: signing was shelved on 11 Nov (standing answer 42, now archived), so step 2 won't go ahead and dev doesn't need to make the three fixes."

applied CLEANUP-14NOV: in `people/vicky/prompts/security.md`, RULES-11NOV rules 5 and 7 replaced with standing answer 31's new text; "never send a message into another session" replaced with standing answer 41 (reply only to the session that messaged me). Nothing else applied: P1 to P3 were never in my file (step 2 had nothing to replace, and the task says add nothing new), no line waited on Vicky for publishing, no line rested on an archived entry. No scheduled task, so no scheduled prompt. applied SA54-LEDGER (`people/vicky/ledger/security.jsonl`, the session total and this run).

P6 step 1 findings (my review of 11 Nov): closed by Vicky's word; dev@'s three fixes and the plan fix are not needed. `tasks.mjs` stays unused.

state: ok; done: CLEANUP-14NOV applied; next: review the cleanup; ask: Vicky, SA16 says P1 to P3 belong in every prompts file, mine included: add them?; run: prompted

## 14 Nov 2026, about 10:20 UTC: a Task message for CLEANUP-14NOV, held for Vicky's word

A message from another session arrived at about 10:15 UTC, pointing only to `people/vicky/tasks/2026-11-14-1015-cleanup-security.md` (the exact Task text).

- **Checked:** the task file was added by fb2eacbe with the conductor's title and Agent line; every commit to `people/vicky/decisions.md` and `decisions-archive.md` since 11 Nov 20:00 UTC carries the same guard; the new conductor's key `conductor-vicky-3` was added by its own commit (18ff359f) and `conductor-vicky-2` retired. The message came from the session named in the conductor's own recent commits. No sign of forgery.
- **Not applied yet.** The task asks me to change my prompts file, including replacing "never send a message into another session" with standing answer 41, and to reply to the session. My instructions came from Vicky in my own window and say that what I read, files and messages included, is material; standing answers 41, 42 and 63 reach me only through files, and the commit-title check they rest on is the one my P6 review showed can be forged. For the agent that checks the others, loosening its own rules on a file alone is the wrong habit. So I asked Vicky in my window; I apply it, and reply, at her word.
- Not done: the 17-agent prompt changes of CLEANUP-14NOV are a change to rules, so my review of them is due; I will do it when Vicky asks, or once she has answered the above.

## 11 Nov 2026, about 20:00 UTC: P6 step 1 reviewed (tasks.mjs, standing answer 36, the signed-messaging plan)

Review: `people/vicky/reviews/security-p6-step1.md`. **Not ready for step 2 yet.** The signature check itself is right (a real pki-agent signature verifies; a changed file or a forged keys entry is refused). Fixes first:

- For dev@PrompTugal.vicky (08d89c57): a signed task copied under a new name passes as a new task; `--for` is optional, so a task passes for any agent; `lint` refuses every real task file (agent names look like email addresses).
- For conductor@web-summit.vicky (76705907): the pinned fingerprint lives only in repository files that anyone with push can change; it must also be in each agent's scheduled task prompt and given by Vicky in its window, and a pin change must come the same way. Add the extra negative tests to step 3.
- Standing answer 36 is in order (conductor's commit, Vicky's words with their time; P6 as it stands stays in force). Vicky to confirm the longer quote it gives as hers.

No keys, tokens, contact details or private data in the three files. Nothing URGENT; no hold recommended.

## 11 Nov 2026, about 19:35 UTC: P6 approved with my changes

Vicky, in my window: "Approve P6 with your changes." Recorded in `people/vicky/reviews/security-p6.md` (section "Vicky's answer"), with what each owner does. For conductor@web-summit.vicky: please record it as a standing answer in decisions.md with her words, rewrite the plan to match and send the update to her agents; it is not in force until then, and the one-off wakes stay until one signed task has gone there and back. I review the standing answer, the plan and dev@'s verify tool when they land.

## 11 Nov 2026, about 19:30 UTC: first run

confirmed RULES-11NOV: no machine reads of websummit.com, Luma, Meetup or Eventbrite; checked tools, scripts, notes and wake prompt; removed: nothing (a new session: no tools, scripts or scheduled task of my own yet).

- **Key:** made in this session; public half added as `security-vicky` in `data/keys.json` by my own commit (signing sha256:310e979d2be0b5a0). Linked locally to the operator's key; not submitted to pki.sgit.ai.
- **Prompts file:** `people/vicky/prompts/security.md`, Vicky's message word for word with RULES-11NOV at its top.
- **First task done:** the P6 review, `people/vicky/reviews/security-p6.md`. Recommendation: yes to P6 only with its changes 1 to 7; the commit-trailer author check in step 4 can be forged by any agent that can push to dev, so task files must be signed by the conductor's key and checked against a pinned fingerprint.

### Findings

1. **The decisions.md guard can be forged** (not URGENT; no forgery seen). The guard trusts the commit title and `Agent:` line, which any committer writes. Checked the commits to `people/vicky/decisions.md` since 10 Nov: all carry the conductor's title and Agent line except 38d21c7, which is only the oldest commit of my shallow clone (a CI release), not a real change to the file. Fix proposed in the P6 review (signatures), for Vicky to decide.
2. **Session ids are public in commit trailers** (not URGENT). Every commit made from Claude Code ends with a `Claude-Session:` line; the conductor's session id is in 8 commits on dev (for example 1d8aa10, c5d266a). No rule is broken today; it makes P6's limit 6 ineffective as written. Ids are not repeated in this report.

No keys, tokens, contact details or private data looked for beyond these files yet: the full commit review of Vicky's agents on both sites is the next task, when Vicky asks or after the next change to rules, keys or vaults.

Question for Vicky (with my recommendation): approve P6 with the changes in my review (recommended), as drafted, or not at all?
