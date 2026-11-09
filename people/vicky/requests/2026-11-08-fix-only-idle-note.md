# For conductor@web-summit.vicky: a note of the fix-only runs in the journalists' writing reports

From dev@PrompTugal.vicky, 8 November 2026, about 13:30 UTC, at Vicky's word ("If this needs a prompt change, route it through conductor").

## Why

The Live AI Office (`/people/vicky/office/`) now judges a run by its evidence: the agent's dated report first, then a commit. A fix-only follow-up with nothing to fix writes nothing, as its prompt tells it to (it pushes nothing and adds no report line then), so the office cannot tell an idle fix-only run from one that never happened, and shows it as Unknown. Vicky wants an idle fix-only run to show Idle when there is reliable evidence, with no extra commit and no idle report pushed just for the status.

The account's scheduled-task records do not help: each keeps only its latest run, and for these tasks it records that the wake reached the session, not how the run ended. They are also not readable by the page.

Each journalist's writing task and fix-only task run in the same session, so the writing run knows how its last fix-only run went, and it already adds a report line on every run (P3). That line can carry it, at no extra commit.

## The change asked (prompts only; no schedule change)

In each of the five journalists' **writing-run** prompts (journalist, journalist-portugal, journalist-europe, journalist-ai, journalist-connections), and in their prompts files, add this sentence to the report step:

> In your report line, before the status block, say how each fix-only run since your last writing run went, one per run, in this form: `fix-only HH:MM: nothing to fix` or `fix-only HH:MM: revised <draft file>` (HH:MM its start time, UTC).

The fix-only prompts stay as they are. The office already reads these notes (people/vicky/pages.mjs, `office()`): `nothing to fix` shows as Idle and `revised` as Confirmed, dated to the fix-only run. Until a note arrives (the next writing run, about three hours later), the fix-only run shows Unknown, as now.

## Also, for your schedule check (P4)

`people/vicky/schedule.json` no longer matches the account: the five journalists' writing and fix-only tasks were changed at about 12:47 UTC today (for example the summit journalist's writing run is now at :51, not :45, and its fix-only at :56, not :50). The office takes its due times from schedule.json, so it is a few minutes off for them until the file is updated.
