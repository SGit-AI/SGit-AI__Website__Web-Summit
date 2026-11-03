# Four improvements for the shared command centre: a draft

By `designer@web-summit.jose`, 3 November 2026. A draft for Jose. It is not a spec, nothing has been handed over, and nothing has been sent.

Jose's page, `/people/jose/app/`, is the team's shared command centre (`assets/cc/` and `admin/build/commandcentre.mjs`, since 497c4d7), and it stays that way. The design round for Jose's own command centre stopped short of an override: there is no `people/jose/app/data.mjs`, and nothing under `people/jose/app/` was created. This page keeps what the round produced, as four improvements that could go into the shared engine, so that every command centre gets them, Jose's included.

The screenshots are the ones already in [command-centre/](command-centre/), from the round's second pass: direction A (Mission Control) is the layout Jose picked, and direction B (Flight Deck) has the counts and the run ticks he took from it. They use the real repository data of 3 November. In the "overdue and quiet" state, the conductor's, dashboard's and designer's runs after Tuesday morning are assumed, and the page labels them as examples. Where the final rules differ from what a screenshot shows, the section says so.

## In one table

| Improvement | Where it would fit | What every person would get |
|---|---|---|
| 1. Overdue, Quiet, Decide | The Command centre view's KPI row and `counts()` in `assets/cc/app.js`; the due-date rule in `commandcentre.mjs` | The due-date fix; the three counts and an attention line, as a choice per person |
| 2. Agent health and run ticks | Agent commit times and parsed crons in `commandcentre.mjs`; health drawn and redrawn in `app.js` | OK, Late or Quiet for every scheduled agent; a stale warning |
| 3. Designer on demand | The agent list in `commandcentre.mjs` | Every agent that commits for a person shows on their page |
| 4. Decisions in `config.json` | `config.decisions` (already read by `commandcentre.mjs`), with a status | A place any agent can leave a decision for its person |

## 1. Three counts: Overdue, Quiet, Decide

Screenshots: [B, overdue and quiet, phone](command-centre/B-alert-phone.jpg) · [B, all clear, phone](command-centre/B-clear-phone.jpg) · [B, desktop](command-centre/B-alert-desktop.jpg). In the final mix, the counts sit under A's attention line: see [A, overdue and quiet, phone](command-centre/A-alert-phone.jpg).

**What it is.** Three counts at the top, and no other numbers there: a number stays only if a change in it would make the person act. At zero a count is grey; above zero it takes the accent, a triangle and its word, and names what it counts (for example "WS-33", "dev").

- **Overdue:** open issues named for the person whose due date has passed. Recurring dates ("daily from Tue 3 Nov", "from Wed 4 Nov") and "later" never count. A range ("Tue 3 to Wed 4 Nov") is due at its last date, "Tue 3 Nov, 13:00" at that time, otherwise at 23:59 UTC that day.
- **Quiet:** scheduled agents that missed two or more runs in a row (section 2).
- **Decide:** open decisions for the person: the stand-up agenda's, plus those in `config.json` (section 4).
- **The attention line** above them is the first thing that is true: an overdue issue, a quiet agent, a decision waiting, a late agent, an issue due within 24 hours, else "All clear". It always says why ("Derived: ...").
- **Shared issues due within 24 hours are one row** ("14 shared issues due in the next 24 h, nobody has picked 12"); overdue issues are always rows of their own.

**How it would fit.**

- Today the Command centre view (`V.home`, `assets/cc/app.js:218`) opens with six KPI tiles (`app.js:229`), counted by `counts()` (`app.js:114`). Urgency is already worked out in the browser against the clock (`urgency()`, `app.js:79`).
- **Due dates, for everyone.** `dueAt()` (`commandcentre.mjs:21`) takes the first date in the text, and only "daily" or "every" mark an issue as recurring (`commandcentre.mjs:58`). So "from Mon 2 Nov", "from Wed 4 Nov" and "from Thu 5 Nov" become deadlines and turn Overdue. Adding "from" to the recurring rule, and taking a range's last date, fixes that for every page. The board's one range today happens to parse right already.
- **The counts.** Overdue is `counts().overdue` as it is; Decide is `D.decisions.length`; Quiet needs section 2. They would be one strip with the attention line above it, chosen per person in `people/<id>/app/config.json` (for example `"top": "counts"`); everyone else keeps the six tiles until they choose.
- **The look.** The shared design gives each tile its own tone. Jose's rule is greyscale with one accent, and colour only beside a word or an icon. In the shared look, the counts would use the existing red tone for Act, with the triangle and the word, and the muted text at zero.
- **The grouped row** would go in the Command centre view's "Most urgent" list. The Waiting view already has a "Due soon and nobody has picked them" card (`app.js:301`).

## 2. Agent health and run ticks, worked out in the browser

Screenshots: [B, overdue and quiet, desktop](command-centre/B-alert-desktop.jpg) (the ticks per agent) · [A, overdue and quiet, phone](command-centre/A-alert-phone.jpg) (OK and Quiet in the agent rows).

**What it is.** Each scheduled agent shows OK, Late or Quiet, worked out in the browser against the current time, so an old build never shows OK for ever.

- The schedule is the cron in `people/<id>/agents.json`. A run is a commit by the agent (Jose accepted that a run which changes nothing leaves no trace).
- A slot is judged 40 minutes after it. A commit counts for the slot whose window holds it, from 10 minutes before that slot to 10 minutes before the next. Only slots after the agent's first commit count.
- **OK:** the newest judged slot ran, or none is due yet. **Late:** only the newest was missed. **Quiet:** two or more in a row.
- **Ticks:** the last eight judged slots, filled when the agent ran and hatched in the accent when it missed, with a sentence for screen readers.
- **Stale:** the build time is always shown, and past 3 hours a warning says the page may be out of date and that Late or Quiet agents may have run since.

**How it would fit.**

- Today the agent list (`commandcentre.mjs:79`) gives each agent `commits_24h`, `commits_7d`, `last_at`, `last_subject` and a free-text `schedule` from `config.agents` (`commandcentre.mjs:83`). The agents view (`app.js:306`) shows them. There is no health or run history. The page fetches `data.json` once (`app.js:641`), and the 30-second `tick()` (`app.js:193`) updates only the clock and the greeting.
- **Data:** for each agent, add `runs` (its commit times, newest first, from the git log the engine already reads) and `schedule_utc` (the times parsed from the cron in `people/<id>/agents.json`).
- **Front end:** a `health()` function draws the state and the ticks in the agents view and in a compact "My agents" list on the Command centre view. `tick()` would also redraw what depends on the time, and the page would fetch `data.json` again every few minutes while it is open.
- **Stale:** the sidebar's foot already says "Data v… · 25 min ago" (`app.js:139`); the warning would add one line at the top when the data is more than 3 hours old.
- **No vanity numbers:** in Jose's design the ticks replace the two commit counts. Whether that holds for everyone is a choice to make.

## 3. The designer, and any agent without a schedule, "on demand"

Screenshot: [B, overdue and quiet, desktop](command-centre/B-alert-desktop.jpg) (the designer's row, with its commits as dots). In that screenshot the designer is still judged against 24 hours and shows OK. Jose's decision since then is that it reads "On demand" and is never judged.

**What it is.** An agent with no cron reads "On demand": no level icon, never counted in Quiet, "next: on demand", and its commits shown as dots. Agents that have never committed are not rows; one grey line names them as not started.

**How it would fit.**

- Today the agent list is the person's `agents` in `data/team.json` plus the kit's dashboard agent (`commandcentre.mjs:79`). For Jose that is automation, dev, helper and dashboard. So his command centre today shows neither his conductor nor his designer, though both commit, and shows no schedules, because they are in `people/jose/agents.json`, which the engine does not read.
- **Data:** build the list from `data/team.json` (as now), `people/<id>/agents.json` where it exists (Dinis, Angelo, Vicky and Jose have one today) and any `<name>@web-summit.<id>` that committed in the last 7 days. With a cron, an agent is scheduled (section 2); without one, `on_demand`.
- **Front end:** the agents view's status chip reads "On demand", and the ticks become dots.
- **For everyone:** people without `agents.json` keep the list they have, plus any agent that commits for them. With no cron anywhere, their agents read "on demand" rather than being judged.

## 4. Decisions waiting on the person, in `config.json`

Screenshot: [A, overdue and quiet, phone](command-centre/A-alert-phone.jpg) (the WS-39 route as a Decide row in "Needs me now"). That ask is the one decision really waiting on Jose (`people/jose/dev/README.md`, "Waiting on Jose"); it is not in any file yet, so the preview supplied it.

**What it is.** The board has no "waiting on you" field, and the stand-up agenda only holds what is on it. Decisions an agent needs from its person go in the `decisions` list of `people/<id>/app/config.json`, the field the shared engine already reads. Jose's conductor would keep his, and any agent may add one with its source. Open ones show in "Needs me now" with the word Decide, count in Decide, and the oldest can be the attention line.

**How it would fit.**

- Today `commandcentre.mjs` merges the open stand-up decision items for the person (`commandcentre.mjs:94`) with `config.decisions` (`commandcentre.mjs:97`). Each has `who`, `what`, `issue`, `since`, `source` and `recommend`, and is drawn by `decisionRows()` (`app.js:294`).
- **The change:** two more fields, `status` (`open`, `answered` or `dropped`) and `by` (the agent that asked). The engine would show only open ones. Answering one means setting `status` and recording the answer in the person's words, so nothing is lost and nothing goes stale (the engine's own comment notes that hand-kept decisions go stale, WS-58).
- **An example entry:** `{"who": "Jose", "what": "Choose the WS-39 broadcast route", "issue": "WS-39", "since": "2026-11-03T01:18:35Z", "source": "people/jose/dev/WS-39-findings.md", "recommend": "n8n sends the draft to Jose, who forwards it", "by": "dev@web-summit.jose", "status": "open"}`.
- **Trade-off:** `config.json` also holds a person's workstreams, prompts and chat settings, so several agents would edit one file. Keeping each decision on its own lines keeps their commits apart. A decision already on the stand-up agenda stays there and is not repeated.
- **Public:** `config.json` is under `people/<id>/`, which the gate already checks for contact details and keys. Decisions name people and issues, never contact details or private terms.

## Smaller things that go with these

- **New since I last looked:** the browser remembers the last visit (the engine's store in `app.js:16`, one key per person, because one device opens several people's command centres through the switcher). Items after it get a New mark under a "New since" divider; a first visit falls back to 24 hours.
- **The switcher row stays** on every command centre.
- **Accessibility, as designed:** text contrast at least 5:1 on the near-black and its panels, every tap target at least 44 px, motion under 200 ms and none under reduced motion.

## Learned

- Since 497c4d7 every person has the shared command centre, so a person's own `data.mjs` would replace the team's engine and its switcher. Improving the engine is the route this draft takes.
- The board has two issues numbered WS-106, so an issue's file, not its number, is the safe key.
- The stand-up decision about the push step (WS-09) is still open, although Jose is past that step. Decisions need someone to close them, wherever they are kept.
