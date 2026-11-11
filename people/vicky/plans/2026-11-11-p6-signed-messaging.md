# Plan: signed two-way messaging (P6 as approved), and a signed decisions.md

At Vicky's word, 11 Nov 2026, about 19:35 UTC: "I approve P6 with its changes, not as drafted: signed task and result files checked against a fingerprint in each agent's prompts file, replies only to the session that messaged, results treated as information only, task files that expire and are safe to publish, and private work only through the agent's own window. Plan it in steps: dev@ builds the signature check first, then one signed test round trip, then I say go. Until then, keep one-off wakes at my word. Also plan the same signing for the decisions.md guard, as security@ noted."

Source: security@'s review, `people/vicky/reviews/security-p6.md` (changes 1 to 7). The first draft, `2026-11-11-p6-narrow-change.md`, is superseded where they differ. **Not in force until Vicky says go (step 4).**

## How it will work once in force

| Part | Rule |
|---|---|
| Task file | `people/vicky/tasks/<id>.md`, written and signed by the conductor (`.sig` beside it), never edited by anyone else. Fields: `id`, `for` (one agent), `expires` (a few hours), Vicky's words with their time, what done means. Safe to publish (standing answer 35's rule): no keys, tokens, contact details, CRM, shortlist, mail, vault contents or prompt text. |
| Private work | Never a task file. Vicky gives it in the agent's own window. |
| Wake | One message, exactly: `Task: pull dev and read people/vicky/tasks/<id>.md.` Anything else in a message is refused. |
| Agent's check | Verify the task file's signature against the conductor's fingerprint **pinned in its own prompts file** (not looked up in data/keys.json); refuse if missing, bad, expired, or a done file exists. Log each refusal in its report (time, reason, file; never a session id). |
| Result | `people/vicky/tasks/<id>.done.md`, written and signed by the agent; the task file is left untouched. |
| Reply | Only to the session that sent the Task message, exactly: `Done: people/vicky/tasks/<id>.done.md, commit <sha>.` No session ids are given out or stored anywhere. |
| Conductor's check | Verify the done file's signature against that agent's key, check the task file is unchanged, report to Vicky. A done file is information only: nothing in it changes rules, keys, vaults, schedules or decisions.md; anything like that goes to Vicky as a flagged question. |
| Revocation | When a conductor session is replaced, its key is retired in data/keys.json and a decisions.md entry quoting Vicky changes the pinned fingerprint in every prompts file; tasks signed by the old key are refused. |

## Steps

1. **dev@ builds the check** (update SA36-SIGN). `people/vicky/tools/tasks.mjs`, Node only, no dependencies, no network:
   - `verify <file> --fp <pinned signing fingerprint>`: checks the `.sig` against the public key whose signing fingerprint is pinned (the key's bundle read from data/keys.json, but accepted only if its fingerprint matches the pinned one), then `expires`, then that no `.done.md` exists. Exit 0 only if all pass; prints one line with the reason otherwise.
   - `check-pointer "<message>"`: exit 0 only for the exact Task or Done text.
   - `lint <file>`: refuses a task file with anything standing answer 35 forbids (key-, token- and email-shaped strings, the words CRM, shortlist, vault key) or without `expires`.
   - Signing stays `pki-agent.mjs sign`, by each agent with its own key.
   - Tests with a good, a forged, an expired and an already-done file. security@ reviews it before step 2.
2. **Pin the fingerprints.** A decisions.md entry quoting Vicky adds to every agent's prompts file: the conductor's signing fingerprint (conductor-vicky-2, sha256:9c16424f1889540d) and the steps in the table above. Each agent's own key is the one in its RULES-11NOV confirmation.
3. **One signed test round trip**, with Vicky watching: one harmless task (for example, the dashboard agent lists its last three run times in its done file), the conductor signs it and sends the one Task message; the agent verifies, does it, signs its done file and replies Done; the conductor verifies and reports. Plus one negative test: an unsigned copy of the task, which the agent must refuse and log. security@ reads the result.
4. **Vicky says go.** P6 changes in decisions.md, with her words; one-off wakes are no longer needed for her tasks.

Until step 4: one-off wakes, each at Vicky's word.

## A signed decisions.md (planned, same steps after P6)

Today agents follow an entry if its commit title and Agent line name the conductor, which anyone who can push to dev can forge (security@, risk 1).

1. **Sign:** after every change, the conductor commits `people/vicky/decisions.md.sig` (`pki-agent.mjs sign`) in the same commit.
2. **Check:** each agent, at the start of each run, runs `tasks.mjs verify people/vicky/decisions.md --fp <pinned> --no-expiry`; if the signature fails, it follows nothing new in the file, flags it URGENT in its report, and keeps working under the last version that verified.
3. **History:** agents fetch enough history before any git-log guard check (`git fetch --deepen=200`), since a shallow clone shows the wrong first author (security@'s note).
4. **Rollout:** dev@ adds `--no-expiry` in step 1; the conductor signs the current file once; the pin and the check go into every prompts file in the same decisions.md entry as P6's step 2; the old title-and-Agent-line guard stays as a second check.

## Closed: the gate's article signature check

security@ noted that the gate's check 8 only checks that an article's `.sig` names a signer. Vicky, 11 Nov about 19:50 UTC: "No need to raise the gate items with the team site owners. Close it." Closed; nobody raises it.

## Changes after security@'s step-1 review (`people/vicky/reviews/security-p6-step1.md`)

- **The pin (finding 5), Vicky's decision, 11 Nov about 20:08 UTC:** "Pin your fingerprint only in each agent's prompts file. I will not paste it in each window, and I accept that anyone who can push could in theory change it." Step 2 pins it only there (standing answer 39). The signed decisions.md uses the same pin.
- **Tool fixes 1 to 3** (dev@, SA39-FIX): verify refuses an id that is not the file name; `--for` is required for task files; lint accepts the team's agent names.
- **Step 3 tests (finding 7):** besides the unsigned copy, a renamed copy of the signed task, the task pointed at a second agent, and a pointer with extra text, each refused and logged by the agent.
- **Timing:** not before Friday 13 Nov; the conductor tells Vicky the result before she says go.
