---
title: "For the sgit team: first-run feedback from a non-technical user (the Try page and the Quickstart)"
summary: Vicky, on the RiskMandate team, tried sgit for the first time on 30 October 2026 as a non-technical user. The Try page's terminal never connected; the Quickstart worked on a Mac in about 15 minutes after four errors, three of them before sgit could run and one an access token the page never mentions. Steps, expected and actual, what worked, and the changes she recommends, in her priority order.
path: family/sgit-first-run/index.html
---
**For:** the sgit team and its agents (sgit.ai, the `sgit-ai` package). **From:** the Web Summit 2026 team, at Dinis Cruz's word, 5 November 2026. Part of [briefings for the SGit family](../index.html).

**Reporter:** Vicky (RiskMandate team), testing as a non-technical first-time user, 30 October 2026. **Her two published reports** (with screenshots): [the Try page](https://wyh2994.github.io/riskmandate-feedback/2026-10-30-sgit-try-in-browser/) and [the Quickstart](https://wyh2994.github.io/riskmandate-feedback/2026-10-30-sgit-quickstart/). Compiled from them by Agent (RiskMandate.ai), the assistant that works with Dinis; quotes are as published.

## In short {#summary}

- **The Try page could not create a vault:** the terminal never connected (a bug; the cause shows only in the log).
- **The Quickstart worked on a Mac in about 15 minutes, after four errors.** Three came before sgit could run at all (the Python set-up); one was an **access token the page never mentions**.
- **Once installed, every sgit command worked first time**, and the "Next steps" hints were "the clearest guidance I met".

Suggested labels: `docs`, `onboarding`, `bug` (the Try page terminal), `ux`.

## What we ask of the sgit team {#ask}

1. Fix the Try page's terminal, or say on the page that it is not working and point to the Quickstart (Issue 1).
2. Explain the access token in the Quickstart: what it is, how it differs from the vault key, where to get one (Issue 2, change 1, and the open question at the end).
3. Add "Before you start" and "If the install fails" to the Quickstart (Issue 2, changes 2 and 3).
4. Never offer turning off TLS verification as the easy way out of a certificate error (Issue 2, change 4).

**How to reply:** a commit on [SGit-AI/SGit-AI__Website__Web-Summit](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit) (branch dev) with the trailer `For: conductor@web-summit.dinis`, or tell Dinis in your session; we update this page with what was fixed, and in which version.

## Status {#status}

| Item | Status |
|---|---|
| Issue 1, the Try page terminal | reported 5 November 2026, open |
| Issue 2, the Quickstart | reported 5 November 2026, open |

## Issue 1: Try page: the terminal never connects (bug)

**Page:** https://sgit.ai/try/index.html (site v0.7.87), Mac, Chrome
**Time:** about 30 minutes, 13:40 to 14:10 Lisbon time

### Steps to reproduce

1. Open the Try page from sgit.ai, Docs, "Try it in the browser".
2. Load the engine. It loads in about one second ("Engine loaded ✓").
3. Click demo buttons 1, 2 and 3. Each works.
4. Try the terminal below the demos.

### Expected

The terminal accepts commands, so a new user can create and push a vault.

### Actual

- The terminal box says **"load the engine above to start"**, although the section above says "Engine loaded ✓". The same after a refresh.
- The log shows **"! terminal setup not found, demos and console still work."** It is easy to miss, and it is the real cause.
- After a refresh, the user could not click into the terminal input line.
- The Python console's Run button, with the example code, did nothing visible.

### Other problems on the page

- It opens with technical text (Pyodide, the PyPI wheel, an in-memory filesystem, CORS, PBKDF2, WebAssembly) instead of steps.
- The demo output is full of technical terms (PBKDF2, ciphertext, obj-cas-imm): each step visibly works, but not what it shows.
- The grey "help" placeholder in the terminal looks already filled in.
- The example commands do not say where to type them, or one line at a time.
- The page says files are lost on refresh, but not that the results are lost too.

### What worked

- The three numbered demo buttons each ran and showed a result.
- The engine loaded in about one second.

### Recommended changes (in the reporter's priority order)

1. Fix the terminal, or say on the page that it is not working and point to the Quickstart.
2. When the terminal fails, say so in the terminal itself (for example "The terminal did not load. Refresh the page and try again."), not only in the log.
3. Open the page with a few short steps, including "Scroll down and click 1, 2, 3".
4. Add one plain sentence under each demo button saying what it shows.
5. Say where and how to type the example commands ("Type each line in the box above and press Enter").

Keep the practical notes: the first load is about 20 MB, a refresh clears everything, and the page freezes briefly during network commands.

---

## Issue 2: Quickstart: four errors before the first push (docs and UX)

**Page:** https://sgit.ai/docs/quickstart.html, steps 1, 2, 3 and 5 (step 4 not done)
**Environment:** MacBook Air, Terminal, sgit-ai 0.27.0
**Time:** about 15 minutes of work, 16:19 to 16:43 Lisbon time

### What happened, in order

1. **No "before you start".** The page does not say where to type commands, how to open a terminal, which Python version is needed, or what must be installed first. "If Claude had not told me, I would not have known to open Terminal at all."
2. `pip3 install sgit-ai` failed:
   ```
   ERROR: Could not find a version that satisfies the requirement sgit-ai
   No matching distribution found for sgit-ai
   ```
   Read as "sgit does not exist". The real cause: the Mac's Python was too old, which the page does not say.
3. `python3 -m pip install sgit-ai` failed:
   ```
   No module named pip.__main__; 'pip' is a package and cannot be directly executed
   ```
   pip had to be repaired first.
4. After the repair: `Successfully installed ... sgit-ai-0.27.0`, followed by a pip upgrade hint the user did not know whether to follow.
5. `sgit push` printed `No remote configured for this vault.` and stopped at `Access token:`. **The Quickstart never mentions an access token.** The prompt timed out after 30 seconds and cancelled; nothing said there was a time limit.
6. **The page and the output disagree.** The Quickstart says `sgit create` shows "Initial commit pushed"; `sgit status` said "This vault has never been pushed. It only exists on this machine."
7. With the token pasted in time, push failed:
   ```
   error: could not reach remote, certificate verify failed
   Token not saved
   ```
   The message lists three causes; one option is to turn off a security check. The user did not understand the causes and was uneasy that disabling security was offered ("felt like the wrong one"). The fix was a one-off Python certificate set-up step on the Mac.
8. The user could not tell whether the vault key and the access token were the same thing.
9. `sgit history diff` printed "No changes (vs HEAD)". The page says the diff shows "what changed", so the user expected to see plan.md; it only shows unsaved changes.
10. The vault opened in SG/Vault as "Untitled Vault", although it was named my-vault.

### What worked

- Every sgit command worked first time: create, status, commit, push, vault info, history.
- The **"Next steps" hints** after each command (for example "Next steps: cd my-vault, sgit status"): "the clearest guidance I met".
- Push shows each stage as it runs: "Push complete. Named branch updated. Pushed 1 commit(s), 1 object(s) uploaded."
- Seeing the file in the browser app straight after pushing: "This was the moment it made sense."
- `sgit history log --oneline` was easy to read.

### Not done: step 4, clone elsewhere

The page says "on another machine, or in an agent's session" but not how to do it with an agent, nor that an agent should get a read-only key rather than the vault key.

### Recommended changes (in the reporter's priority order)

1. Explain the access token on the page: what it is, how it differs from the vault key, and where to get one.
2. Add a "Before you start" section: where to type the commands, how to open a terminal, and what is needed on the computer first.
3. Make installing easier, or add an "If the install fails" section (three of the four errors came before sgit could be used).
4. When something goes wrong, say what to do next in plain words, and do not offer turning off security as the easy way out.
5. Make the page match what the user actually sees (for example "Initial commit pushed"), and show when a prompt will time out, or wait longer.
6. Explain how to let an AI agent use the vault safely (a read-only key).

### Open question from the reporter

Where should a new user get an access token: sign up somewhere, or ask the team?

---

## Cross-page note

The Try page links to the Quickstart, but the Quickstart does not mention the Try page.

---

*Compiled by Agent (RiskMandate.ai), the AI assistant that works with Dinis Cruz, from Vicky's two published reports, 5 November 2026. Quotes are as published in the reports; screenshots are in the reports themselves.*
