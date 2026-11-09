# Hand-over: dashboard@web-summit.vicky, 6 November 2026

Written by the old session of dashboard@web-summit.vicky at about 19:00 UTC on 6 November 2026, at Vicky's word, before a new session takes the role (scout's P17: a new model and a clean start). Nothing secret is here: no keys, tokens or vault contents.

## First, for the new session

1. Read [people/vicky/decisions.md](../decisions.md), then [people/vicky/prompts/dashboard.md](../prompts/dashboard.md). That file holds the startup prompt, the scheduled prompt word for word and every standing rule Vicky has given; work from it.
2. Make your own key (`pki-agent.mjs keygen --session`) and commit only its public half as a new entry in `data/keys.json`. The old entry, `dashboard-vicky`, is marked superseded; don't reuse or edit its bundle.
3. Set your scheduled tasks again. The old session deleted both of its own: 07:50 UTC (cron `50 7 * * *`) and 17:45 UTC (cron `45 17 * * *`), both firing the same prompt (in the prompts file) into the session. Ask Vicky first if she wants different times.
4. Your first run is a normal wake: rebuild the two tables, refresh the story candidates, report.

## What I was in the middle of

Nothing half-done. The last wake (6 Nov, 17:45 UTC) was committed and pushed as 3c9d391; release.sh timed out waiting for the live site (decisions.md, standing answer 4: ignore it). The live site showed the 17:55 tables at about 19:00 UTC.

## Open items

- **For Vicky, on the dashboard's "Needs me"** (as of 17:55): one line for the record on the 5 Nov newsroom decision (her conductor's 08:45 brief); WS-31, how the schedules leave the private vault (pm@ recommends its own token from Dinis, or vault@ pushes them; due Sat 7 Nov); the onboarding guide's token step (pm@'s proposal, "one token per agent", WS-170).
- **To follow up** (as of 17:55): WS-153 (Vicky's, waiting on conductor@web-summit.dinis); WS-41 and WS-53 (no owner; not Vicky's at her word); WS-177 (conductor@web-summit.dinis, overdue since 10:00); WS-163 (others' photos); WS-32 (sessions, Sat); WS-168 (Dinis and Nimay to answer; WS-29 waits on it).
- **people/vicky/prompts/README.md** still points this agent's row at the kit; the conductor was asked to link prompts/dashboard.md (report of 6 Nov, 10:55).

## What the next run would have done

At 07:50 UTC on Saturday 7 November: pull dev; read decisions.md (check its new commits with pushed-by.mjs) and prompts/dashboard.md; stop if people/vicky/HOLD.md exists; rebuild "Needs me" and "To follow up" for Sat 7 and Sun 8 (WS-31 is due Sat; drop what is done; never show WS-107, WS-09, WS-48's collection or WS-113; WS-25, WS-29, WS-41 and WS-53 never in "Needs me"); refresh people/vicky/stories/candidates.md from the newsroom's new address; build, gate, commit with the report For: conductor@web-summit.vicky, release.

## What I learned that isn't in the prompts file

- **Where things are.** Dashboard: `people/vicky/dashboard.md` (the top of the page is built for Vicky, not yours). The two extra pages are built by `people/vicky/pages.mjs`: /people/vicky/stories/ from `people/vicky/stories/candidates.md`, and /people/vicky/promptugal/ from `people/vicky/promptugal/source/` (copied at newsroom commit 05c03e9). Reports: `people/vicky/reports/dashboard.md`.
- **The curator's file changes shape.** On 5 Nov at 18:30 it moved from one table with the angle in it to one `## S12: title` section per story ("Beat, added date. Angle", then "Sources:" as `- Publisher, read date: <url>`). pages.mjs reads both. decisions.md now says sources are written `[Publisher, "Title"](url)`; if the curator switches to that, `parseSources` in pages.mjs needs a second pattern. Check the story count on the page after each refresh.
- **The gate.** It refuses `data:` image URLs (WS-132) and a page nothing links to. The Promptugal page shows each SVG twice by setting CSS `color-scheme: light` and `dark` on the `<img>`: the SVGs switch colours by their own prefers-color-scheme, which for an image follows that element's color-scheme. The copied files are never changed.
- **The feedback pane** (`assets/feedback.js`) is off on a device until `?feedback=on`; it quotes whatever is selected when its button is pressed, which is how the Comment buttons work (they select the card's id and title, then click the pane's button). Recipients come from `assets/feedback.json`; newsroom@web-summit.dinis is there, Vicky's agents are not. Sending needs the person's key in the browser.
- **The newsroom repository** is public at PrompTugal/PrompTugal__News__Website (branch dev). Raw files read without attaching it; the GitHub API needs it attached. Never use the old SGit-AI address.
- **Links into the board** go to the issue file on GitHub (the site's board page has no per-issue anchor). Check the file name exists before linking; a guessed slug passes the gate but 404s.
- **The scheduler** fires a few minutes after the set time, and a wake can arrive late after a session restart (5 Nov: the 11:45 wake arrived at 12:31). The 08:30 brief is Vicky's morning; her stand-up is at 12:00 UTC and 18:00 UTC.
- **Release queue.** Several agents push at the same minutes; CI cancels and queues runs, so a release can take over six minutes to show.
- **Verifying who pushed a commit:** `node people/angelo/tools/pushed-by.mjs <sha>` prints the GitHub account.
