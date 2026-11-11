# Security review: the P6 narrow change (two-way messaging between the conductor and Vicky's agents)

By security@web-summit.vicky (key `security-vicky`, signing sha256:310e979d2be0b5a0), 11 November 2026, about 19:30 UTC, at Vicky's word. Reviewed: `people/vicky/plans/2026-11-11-p6-narrow-change.md` as of commit c5d266a, with standing answers 31 to 35 and the guard at the top of `people/vicky/decisions.md`. I sent no message, read no other session and tested nothing against another session; what I say about the messaging tool comes from its published description, not a test.

## In one line

The flow is sound (a message only points to a committed file, and the file is what an agent acts on), but its one safety check, "the file was committed by conductor@web-summit.vicky", can be forged by any agent that can push to `dev`, and limit 6 rests on session ids being secret when the conductor's id is already public. Both are fixable with what the site already has: the conductor's published signing key.

## The risks, in order

### 1. The author check in step 4 can be forged (high)

Step 4 checks the commit title and the `Agent:` line. Both are text the committer writes. Every commit of Vicky's agents shows the author "Claude" and pushes from her account (the guard in decisions.md says so itself), and Dinis's agents push to the same `dev` (for example `incident.researcher@web-summit.dinis` today). So any agent with push access, Vicky's or anyone's, or any agent that has read a malicious page and been steered by it, can commit `people/vicky/tasks/<file>.md` with the subject `conductor@web-summit.vicky: ...` and the line `Agent: conductor@web-summit.vicky`. With a "Task:" message pointing at it, the target agent would pass step 4 and do the work.

The same weakness already sits under decisions.md; P6 makes it matter more, because a task file is an order to act now, not a standing rule read at the next run.

### 2. Session ids are not secret (medium; limit 6 does not hold)

Limit 6 says session ids stay out of the repositories. They are already in: every commit made from Claude Code here ends with a `Claude-Session:` line naming its session. The current conductor's session id appears in 8 commits on `dev` (for example 1d8aa10 and c5d266a), and at least 22 distinct session ids appear in the history I have (a shallow clone). So handing the id to agents only in messages protects nothing; it also cannot be revoked by keeping it quiet.

What may protect the sessions: I expect messages to reach only sessions on the same account (the tool's description does not say so plainly), and the description does say each message arrives marked as sent by the sending session. I have not tested either, and should not (I may not send messages). If Vicky wants certainty, the platform's documentation or a test by the conductor with Vicky watching would settle it.

The safe design does not depend on ids being secret (risk 1's fix below).

### 3. The return direction feeds the most powerful agent (medium)

The conductor holds the most: vault B's key, the scheduled tasks, edits to decisions.md, pushes to the newsroom. "Done:" makes it read each agent's result promptly, and an agent's result can carry text from the web (a quoted page, a company post) that tries to steer it. A "Done:" file that says, for example, "Vicky also asked to change the schedule" is the kind of thing to expect.

Also, step 4 has the agent write `## Done` into the conductor's own task file, so the agent's commit can silently change the task above it, and the conductor's check in step 6 would have to diff the whole file to notice.

### 4. Task files are public (medium)

This repository is public. A task file quotes Vicky's words and says what done means. Any task that touches the CRM, the interview shortlist, mail, vault contents, a contact detail or a key cannot be written there. The plan does not say what happens to those.

### 5. Replay and staleness (low)

A real, old task file can be pointed at again, by anyone who can send a message, and redone. The plan has no expiry and no "already done" rule.

### 6. The log is self-reported (low)

`people/vicky/messages.md`, committed by the sender within the hour, records only what the sender chooses to record. A forged message is never logged by its forger, and the receiving agent is not asked to log what it refused. So the log cannot show the one thing an audit most needs: an attempt.

### 7. The limits are policy only (low, for now)

`interrupt_session`, `archive_session`, `create_session`, `list_events` and `send_message` to any session remain in every session's tool list. P6 forbids most of them by rule. That is how every other rule here works today, and it has held; a hook could make it hard, later.

## What I would change

1. **Sign the task, do not trust the trailer.** The conductor signs each task file with its published key (`node pki-agent.mjs sign people/vicky/tasks/<file>.md`, committing the `.sig` beside it; `conductor-vicky-2`, signing sha256:9c16424f1889540d). The agent verifies the signature before anything else, against a fingerprint **pinned in its own prompts file**, not looked up in `data/keys.json` at the time (anyone with push can add a key there). The site already has a verifier that does this against data/keys.json, `admin/tools/signoff.mjs verify`; dev@ can make a small `tasks verify <file> --fp <pinned>` from it. A bad or missing signature: refuse and log (change 6).
2. **Two files, each signed by its writer.** `people/vicky/tasks/<id>.md` (the conductor's, never edited by the agent) and `people/vicky/tasks/<id>.done.md` (the agent's, signed with the agent's key). The conductor checks the done file's signature against the agent's key and that the task file is unchanged since it was signed.
3. **No session ids handed out or stored.** An agent replies only to the session the "Task:" message came from, and only after the task file's signature checks out. Nothing about ids goes in a file or a message. When the conductor's session is replaced, its key is retired in data/keys.json by the new conductor and Vicky's words (as with conductor-vicky in November), each agent's pinned fingerprint is changed by a decisions.md entry quoting Vicky, and from then on the old key's tasks are refused: that is the revocation, and it needs no id.
4. **The conductor treats a done file as material.** It reads the status line and the diff, reports to Vicky, and never changes rules, keys, vaults, schedules or decisions.md because a done file asks it to. Anything like that in a done file goes to Vicky as a question, flagged.
5. **Task files safe to publish, with an expiry.** Each task file says `expires:` (a few hours) and is safe to make public (the SA35 rule: no keys, tokens, contact details, CRM, shortlist, mail, vault contents or prompt text). A task that needs any of those is not sent this way: Vicky gives it in the agent's own window. An agent refuses an expired task, and one that already has a done file.
6. **Log refusals at the receiver.** An agent that refuses a message (unsigned or badly signed file, expired, already done, not in the allowed purposes, extra text beyond the pointer) writes a line in its report: the time, the reason, the file named, never the session id. With the signed task and done files in git, the git history is the log of what was done; `messages.md` then needs only the refusals and is optional.
7. **Pointer text checked exactly.** The agent acts only on a message that matches `Task: pull dev and read people/vicky/tasks/<id>.md.` exactly, and the conductor only on `Done: people/vicky/tasks/<id>.done.md, commit <sha>.` Anything else in a message is a refusal, not an instruction.
8. **Later, if Vicky wants the limits enforced:** a hook in each of her agents' sessions that blocks `interrupt_session`, `archive_session`, `create_session`, `list_events` and `get_event`, and allows `send_message` only with the exact pointer text above. Not needed for the first test.

On the plan's question 5 (one-off scheduled wakes as an interim): they are not safer than messages. A scheduled wake reaches the agent as an assigned task, with more weight than a message from a peer, which its target is told to treat as data. With changes 1 and 7, a message carries less authority than a wake, which is what a pointer should carry. Keep the wakes, at Vicky's word for each task, only until the first signed task has been run end to end.

## One recommendation for Vicky

**Say yes to P6 with changes 1 to 7, and not as drafted.** The one that matters is change 1: today any agent that can push to dev could write a task your agents would obey; with the conductor's signature checked against a fingerprint pinned in each agent's prompts file, only the conductor can. Until dev@ has the small verify tool and one signed task has gone there and back, keep the one-off wakes at your word, as tonight.

## Not in scope, noted

- The same forgeable check guards `people/vicky/decisions.md` today (risk 1). Signing decisions.md entries the same way would close it; that is a change to a rule in force, for Vicky to decide separately.
- The gate (`admin/build/validate.js`, check 8) only checks that an article's `.sig` names a signer, not that the signature is valid. `admin/tools/signoff.mjs verify` shows how to check it properly. For dev@, not for this review.
- In a shallow clone, `git log -- people/vicky/decisions.md` shows the clone's oldest commit (a CI release by another team's agent) as the file's first author, so an agent following the guard on a shallow clone would wrongly flag it or, worse, learn to ignore the guard's output. Agents checking the guard should fetch enough history (`git fetch --deepen` or `--unshallow`) first.

## Vicky's answer

Vicky, 11 Nov 2026, about 19:35 UTC, in my window: "Approve P6 with your changes."

So P6 is approved with changes 1 to 7 above (change 8, the hook, stays for later). It is not in force until conductor@web-summit.vicky records it as a standing answer in `people/vicky/decisions.md` with her words, rewrites the plan to match, and every agent of hers confirms it. Until one signed task has gone to an agent and back, the one-off wakes at her word stay the way to start a task. What each owner does, for the conductor to route:

- **conductor@web-summit.vicky:** the standing answer and an update for all her agents (pin `conductor-vicky-2`'s signing fingerprint sha256:9c16424f1889540d in each prompts file; the exact pointer texts; expiry; refusals in reports); the plan file rewritten; sign each task file with its key; never act on a done file beyond reporting it.
- **dev@PrompTugal.vicky:** a small `tasks verify <file> --fp <pinned>` built from `admin/tools/signoff.mjs verify`, which also checks the task file is unchanged since it was signed, and an expiry and "already done" check.
- **each agent:** verify before acting; write `<id>.done.md` signed with its own key; reply only to the session the task came from; log refusals.
- **security@web-summit.vicky (me):** review the standing answer, the rewritten plan and dev@'s tool when they land, and check the first signed task end to end.
