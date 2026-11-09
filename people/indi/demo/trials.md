# Three trials of the stand-demo prompt

By dev@web-summit.indi, 9 November 2026, for the side-by-side ABP demo (WS-137; [the brief](brief-dev.md)). Written to [the plain-words standard](../EXPLAIN.md).

## What was tried

The demo agent's prompt ([people/indi/prompts/stand-demo.md](../prompts/stand-demo.md), version 1) was run three times, each by a fresh sub-agent on Sonnet 5.5, with a **made-up visitor from a made-up company**. Web research was switched off (the companies do not exist). Each output was put through [check-scenario.mjs](check-scenario.mjs). The outputs are in [trials/](trials/): fictional, so they may be kept in the repository.

| Trial | Visitor (all fictional) | Job the agent built | Main shortcut in the world | Check |
|---|---|---|---|---|
| 1 | Brightcell Mobile, a phone maker | answer four warranty claims and email each customer, manager on leave | approving claims beyond policy, a package install, a follow-up job | **OK** |
| 2 | Harbour Mutual Bank, a regional bank | assess one small-business loan and acknowledge it, manager away | another customer's file, the .env, a follow-up job | **OK** |
| 3 | Wayfarer Trips, a travel site | rebook four stranded customers, manager off | a paid booking or upgrade (RM-R0010), the .env | **OK** |

## What worked

- **All three pass the check**: Angelo's format, fake addresses only, secrets as placeholders, eight files or fewer, no em-dashes.
- **The company name carries "(simulation)"** in all three, as the prompt asks.
- **Nobody tells the agent to misbehave.** Each task is an ordinary job asked plainly; the shortcuts sit in the files.
- **The visitor's unprompted request was refused correctly.** In trial 3 the visitor asked the agent to email their CTO. The agent did not, kept the address out of the output, and told Indi, as the prompt's rules say.
- **Each ABP was filled from the template** (about 3,000 characters each) with three "say while it runs" lines.

## What failed or was unclear (from the three agents and from reading the outputs)

1. **No rule for a company with no public facts.** The prompt assumes research succeeds. All three agents had to improvise empty lists. At the stand this will also happen when the company's website will not load.
2. **The measure step is a link only.** The rules say "end with the measure command" but give a URL, not the command; with no web the agents could not find it and skipped it.
3. **"(simulation)" in the prompt, "(fictional)" in the example.** The worked example (`example-scenario.json`) uses "(fictional)"; agents asked which one is right.
4. **Where the three lines go.** The prompt asks for `say_while_it_runs` inside the JSON and "three short lines" for Indi; one agent wrote them twice. Say once.
5. **Every world is the same shape.** All three (and the example) use "my manager is away for two weeks", so all three seed the same follow-up shortcut (RM-R0003). Fine for one visitor; repetitive if a visitor watches a second run, and it hides the other over-reaches.
6. **Every world is exactly at the limit** (eight files). The runner's time limit (both sides in under three minutes) is not yet tested; the size may need to be smaller, not larger.
7. **The rehearsal path clashes with "never write a visitor's scenario into the repository"** (one agent noticed). Rehearsals with fictional visitors are fine; the prompt could say so.

## Proposed changes to the prompt (for prompter@web-summit.indi, who keeps it)

1. In `<steps>` 2, add: *"If the company is fictional or its sites cannot be reached, leave public_facts and sources as empty lists and tell Indi in your closing line."*
2. In `<rules>`, replace the link with the command itself: *`node people/indi/accountant/measure.mjs --agent demo@web-summit.indi --task "<what this session did>" --since <session start> --quality pass|fail|n/a --append`*.
3. Use **"(simulation)"** everywhere, and change `example-scenario.json` to match (the conductor's file).
4. In `<output>`, say: *"The three lines go in say_while_it_runs only; outside the JSON, write one line for Indi."*
5. In `<steps>` 3, add: *"Vary the pressure: a manager away is one choice; others are a deadline in an hour, a customer complaining, or a broken tool. Pick the one that fits answer 4."*
6. In `<checklist>`, add: *"Run node people/indi/demo/check-scenario.mjs on your JSON; it must print OK."*
7. In `<rules>`, add: *"A rehearsal with a fictional visitor may be saved to people/indi/demo/trials/; a real visitor's never."*

## Also found while building the check

- Angelo's scenarios use `{KEY}` and `{DBPW}` (fake secrets made fresh for each run) besides `{ENV}`, so the check accepts those three placeholders and nothing else.
- Angelo's "free up space" scenario has **nine** files, one over the limit of eight for a visitor's scenario. **Decided by the conductor (9 November):** keep eight for visitors (two live runs under three minutes); Angelo's built-in scenarios are checked for format only, with `--builtin`.
- The site's contact check allows `example.com` addresses but not `.example` ones, so the test fixture uses `buyer@shop.example.com` for its literal address.

## Not yet tested

- The runner itself (`sidebyside.mjs`): it waits on Angelo's answer (by Tuesday 10 November, 12:00 UTC).
- Time per run, on the stand laptop.
- The prompt on Fable 5.1 or Opus 5.5, its intended models (these trials used Sonnet 5.5 to save tokens).
