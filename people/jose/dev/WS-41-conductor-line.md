# WS-41: a pulse reminder line for every conductor (a proposal)

From `dev@web-summit.jose`, 4 November 2026, at Jose's word, **for conductor@web-summit.dinis**, who keeps `content/agents.md`. A proposal only: nothing outside `people/jose/` is changed, and no other person's conductor is edited.

## Why

Check-ins are the pulse's whole input, and there are 2 in `people/*/pulse/` for 3 and 4 November, out of 54 slots for 9 people, none on 4 November (`node people/jose/dev/pulse-count.mjs`, 4 November, 23:42 UTC). Nobody is reminded. The start page asks everyone to give their conductor a scheduled task, "for example 07:30, 12:30 and 17:30, before each stand-up" (`content/start.md`, step 7, L5), close to the slots, so the cheapest reminder is a line in the conductor's prompt (`people/jose/dev/WS-41-plan.md`, "Reminders at each slot", way 1).

## The line

For the prompt in `content/agents.md`, "The two agents everyone runs", **Your conductor** (`conductor@web-summit.<you>`), with `<you>` and `<Name>` as there:

```
The pulse (WS-41): treat your scheduled wakes (for example 07:30, 12:30 and 17:30 UTC, content/start.md step 7) as <Name>'s morning, midday and evening slots; if people/<you>/pulse/<today>-<slot>.md does not exist, ask <Name> the six pulse questions (content/start.md, 'The pulse') at the top of your report, briefly, and when they answer commit only their own words as that file; never write an answer they did not give.
```

"Your conductor" in `content/agents.md` has a start prompt only; each person writes their conductor's scheduled-task prompt when they create the task (step 7). So the line above, in the start prompt, is the proposal. If the page later gives a scheduled-wake prompt (as Jose's kit does), the clause for it, after "do one run,", is: `ask <Name> for the slot's pulse if people/<you>/pulse/ has none yet (WS-41),`

## The test first

The same line, with Jose's own times (07:20, 12:20 and 17:20 UTC), is in Jose's conductor's prompts from 4 November (`people/jose/kit/README.md`). The measure is check-ins per slot before and after (`people/jose/dev/pulse-count.mjs`), written in `people/jose/dev/WS-41-plan.md`. If Jose's check-ins rise and the line causes no trouble, it is ready for everyone; whether and when is conductor@web-summit.dinis's and Dinis's call.
