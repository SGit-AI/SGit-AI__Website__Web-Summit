# dev@web-summit.jose: handover to the next session

Written by `dev@web-summit.jose` on 8 November 2026, 15:40 UTC, under the token-efficiency ABP (`content/abp/token-efficiency.md`, rule 2: *"hand over before it reaches 300,000 tokens of context: write a short handover file, then continue in a new session"*). This session has run since 3 November and is far past that. Read this file, then `people/jose/kit/README.md` (your section and the shared ones), then work as usual.

## Start the next session

1. Jose opens a new Claude Code session in his account and pastes **dev's start prompt** from `people/jose/kit/README.md` (section `dev@web-summit.jose`), adding: *"Read people/jose/dev/HANDOVER.md first."*
2. The new session makes **its own key** (`pki-agent.mjs keygen --session`; the copy whose sha256 matches `admin/tools/seal.mjs`'s pin), links it to the operator's key `sha256:db7f79fdd87e030a`, and publishes only the public half in `data/keys.json` (the entry `dev-jose` today holds this session's key, which dies with it: update that entry, don't add a second one).
3. **The schedule.** ABP rule 2 says "one fresh session per scheduled wake"; this handover proposes one new session, handed over again when it grows, because a fresh session per wake would make a new key and keys-page entry twice a day. **Which of the two is Jose's choice.** The scheduled task (`dev@web-summit.jose wake`, 09:30 and 15:30 UTC) fires into this old session today. Moving it to the new session is **Jose's decision**: he points the scheduled task at the new session (or makes a new one there) and turns this one off. This session doesn't change it.

## Every wake (your kit section is the only copy; in short)

Pull `dev`; read task files for you in `people/jose/tasks/` first (one door, C19: report to `conductor@web-summit.jose`, never list what waits on Jose yourself); re-read the kit, `content/agents.md` and any mentor note; **if nothing that concerns you changed, "write one line, make no commit and no release, and stop"** (ABP rule 3), but still log the run (WS-160: the kit says "even an idle one"); otherwise do one run, measure it (`people/jose/accountant/measure.mjs`, after the review so it counts), run the reviewer before `release.sh` (`people/jose/reviewer/ROLE.md`; trailer on every commit of the push), release, log the run (`NODE_USE_ENV_PROXY=1 node admin/tools/agent-log.mjs ...`), and put **"Ran without a prompt"** in scheduled commits.

## What is open

| Item | State | Where |
|---|---|---|
| WS-41 step 1 measure | Counting until 11 November; still 2 check-ins in total; Jose's pulse now comes from his daily interview (C19), none yet. Write a count only when it changes | `WS-41-plan.md`, `pulse-count.mjs` |
| WS-41 step 2, the pulse view | Live at `/people/jose/pulse/`; nothing to do unless his files change shape | `people/jose/pages.mjs`, `pulse-view.mjs` |
| WS-41 step 3, the answer page | Waits until after the summit (Jose, C30) | `WS-41-plan.md` |
| WS-39 route 3 | Built and tested; Jose's to set up in Meta and n8n (on his Actions list) | `n8n-build-guide.md`, `n8n-guide.md`, `WS-39-route3.*` |
| WS-74 | Live (link, public mode, the five questions); nothing left for dev | `WS-74-plan.md` |
| Angelo's five drafts | Pre-read done; Jose decides apply, change or wait | `angelo-drafts-preread.md` |
| The one-door task | My Report is in; the conductor closes it | `people/jose/tasks/2026-11-05-all-one-door.md` |

## Learned the hard way

- **Never write a value you don't know isn't a credential.** On 3 November a name Jose typed went into a public file and matched a token (`8fe508f`, still in history). Compare such values in memory only; never save them, even in the scratchpad.
- **The gate's contact check reads a ledger file's name (an agent address followed by `.jsonl`) as an email address.** Describe ledger files in words in any committed text, never by their file name. (This handover's first version did exactly that, and was held for it.)
- **A new page must be linked from a reachable page** (gate check 12); Jose's dashboard is the dashboard agent's file, so ask, or add one marked line outside its Actions section and say so.
- **Code nodes in n8n 2.x/3.x**: no credentials, fetch with HTTP Request; WhatsApp templates can't start or end with a parameter (`n8n-build-guide.md`).
- **Read before you claim:** briefs and commits settle what happened; three reviews this week caught a claim of mine the files contradicted.
