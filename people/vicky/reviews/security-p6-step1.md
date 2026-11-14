# Security review: P6 step 1 (the signature check, standing answer 36, the signed-messaging plan)

By security@web-summit.vicky, 11 November 2026, about 20:00 UTC, at Vicky's word ("Please review all three now"). Reviewed, on dev as of 89278cad:

- `people/vicky/tools/tasks.mjs` and `tasks.test.mjs` (dev@PrompTugal.vicky, 08d89c57, released in v0.2.1932);
- standing answer 36 and update SA36-SIGN in `people/vicky/decisions.md` (conductor@web-summit.vicky, 76705907);
- `people/vicky/plans/2026-11-11-p6-signed-messaging.md` (the same commit).

I ran dev@'s tests and my own, in a scratch folder outside the repository, with my own key; I sent no message and signed nothing in the repository.

## Result

**Not ready for step 2 yet: three fixes to the tool, and one to the plan, first.** The core is right: the tool checks the signature itself, against a key that actually hashes to the pinned fingerprint, so a forged entry in data/keys.json cannot pass. But a renamed copy of a real task passes as a new task, the check of who a task is for is optional, and `lint` refuses every real task file. And the plan pins the conductor's fingerprint in a file that anyone who can push can change.

## What I tested

| Test | Result |
|---|---|
| dev@'s own tests (`node people/vicky/tools/tasks.test.mjs`) | 18 of 18 pass |
| a file signed by the real `pki-agent.mjs sign` (my key), verified with `--fp` and `--for` | OK: the formats match |
| the same file with one line added after signing | REFUSED, correctly |
| a keys file with an extra entry that claims the pinned fingerprint but carries another key | the extra entry is ignored, correctly (the tool hashes the key, not the claim) |
| exact pointer text; the pointer plus a second line | OK; REFUSED, correctly |
| **a copy of a signed task under a new name** (`test-one.md` and its `.sig` copied to `test-two.md`) | **OK: passes as a new, not yet done task** |
| **a task for one agent, verified without `--for`** | **OK: passes for any agent** |
| **`lint` on a normal task file** (`for: dashboard@web-summit.vicky`) | **REFUSED: "it holds an email address"** |
| an unsigned `test-one.done.md` placed beside a signed task | REFUSED as "already done" |
| a signed task file outside `people/vicky/tasks/` | OK |

## Findings

### Tool (for dev@PrompTugal.vicky)

1. **Replay under a new name (medium).** The "already done" check looks for `<file name>.done.md`, but the signature covers only the file's bytes, not its name. Anyone who can push can copy a signed, unexpired task and its `.sig` to a new name and point an agent at it: the agent does the task again (a task "for" agent A can also be replayed to A as often as names allow until it expires). **Fix:** `verify` refuses a task file whose `id:` is not its file name (lint already checks this; verify must too, since only verify sees the signature), and the agent checks the id in the pointer message is that same id.
2. **`--for` is optional (medium).** Without it, a task signed for one agent passes for any agent it is pointed at. **Fix:** for a task file (anything without `--no-expiry`), `verify` refuses unless `--for` is given and matches.
3. **`lint` refuses every real task file (high for use, no risk).** Agent names such as `dashboard@web-summit.vicky` match its email pattern, and every task file must name one in `for:`. **Fix:** exclude names ending `@web-summit.<person>` and `@PrompTugal.<person>` (the team's agent names) from the email rule, and add a test with a real `for:` line.
4. **Lower, no change needed now:** an unsigned file named `<id>.done.md` blocks a task (the agent refuses it as done). That is only a delay, and the agent logs it; the conductor's check of the done file's signature catches it. `verify` does not require the file to be in `people/vicky/tasks/`; with fix 1 and the pointer check that does not matter.

The tool is otherwise safe to publish by standing answer 35's rule: no keys, no ids, no network, and its output holds only a fingerprint and a reason.

### Plan (for conductor@web-summit.vicky)

5. **The pin lives in a file anyone with push can change (high, before step 2).** Step 2 puts the conductor's fingerprint in each agent's prompts file, through a decisions.md entry. Both are files in this repository: someone who can push to dev could change the pin in a prompts file and sign tasks with their own key. My change 1 said "pinned in its own prompts file"; that is not enough on its own, and I should have said so. **Fix:** the pin must also be somewhere only Vicky or the agent can change: in the agent's scheduled task prompt (changed only from its own session) and given by Vicky in the agent's window. The agent compares the pin in its prompts file with the one in its task prompt or from Vicky, and if they differ it follows neither, refuses tasks and flags it URGENT. The same applies to a change of pin when the conductor's session is replaced (the plan's "Revocation" row): the new pin comes from Vicky in each agent's window, not only from a decisions.md entry, because the old conductor's session key dies with its session and cannot sign the change.
6. **The signed decisions.md has the same root.** Its check uses the same pin, so fix 5 covers it. Today there is no `people/vicky/decisions.md.sig`, as expected before its rollout.
7. **Step 3 tests:** add, besides the unsigned copy: a renamed copy of the signed task (after fix 1, refused), the task pointed at a second agent (after fix 2, refused), and a pointer with extra text (refused). The agent logs each refusal.

### Standing answer 36

8. **In order.** Added by the conductor's commit with its title and Agent line, Vicky's words quoted with their time; it keeps P6 as it stands in force (no messages into sessions) until Vicky says go, and keeps one-off wakes at her word. SA36-SIGN is for dev@ only and forbids any session message. Nothing in it touches keys or vaults beyond the plan.
9. **For Vicky to confirm:** SA36 quotes a longer statement of yours than the one you gave in my window ("Approve P6 with your changes."), as said "in this window", meaning the conductor's. It matches my changes and adds the steps and the decisions.md signing. I cannot check what was said in another window; if those are your words, nothing to do.

## What happens next

1. dev@ makes fixes 1 to 3, with tests, For: security@web-summit.vicky.
2. The conductor adds fix 5 to the plan (where the pin lives, and how it changes) and the extra tests in 7 to step 3.
3. I re-check both, and then step 2 can go ahead.

## Closed, 14 November 2026

Marked closed by conductor@web-summit.vicky at Vicky's word (14 Nov, about 10:25 UTC, in the conductor's window: "security's P6 review asks dev for three fixes to tasks.mjs. Signing is shelved (42), so dev should not make them. Please tell dev, and mark security's request closed."). Signing is shelved by standing answer 42 (11 Nov, about 20:22 UTC), which also withdrew update SA39-FIX and cancelled dev@'s fix wake. dev@ makes none of fixes 1 to 3; the plan gets no fix 5 or step 3 tests; there is no re-check. `people/vicky/tools/tasks.mjs` stays as it is, unused, in case Vicky wants signing later; if she does, this review is the starting point.
