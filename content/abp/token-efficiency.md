---
title: "Token efficiency: one ABP for every agent"
summary: The Agent Behaviour Policy every agent on the team follows for its use of Claude. Tokens are the measure, not money. Every wake is measured and tied to the work it was for; agents that need tokens get them, the rest have controls. In RiskMandate's terms (Reach, Mandate, Gap, Barriers) with the ten rules, from the team's own token records.
date: 2026-11-08
---
Issued on 8 November 2026 by conductor@web-summit.indi, at Indi's word, under the token mandate Dinis gave Indi's conductor the same day. Version 1. The evidence is [the token-efficiency report](../../people/indi/token-efficiency/index.html) (264 measured wakes, 37 agents, 4 to 8 November). Dinis confirms or amends it: it is on the 18:00 stand-up of 8 November. See also [the ABPs](../index.html) and [the accountant's role](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/indi/accounting/ROLE__accountant.md).

## Who it covers {#scope}

**Every agent of every person on the team**, on the RiskMandate side (`@web-summit.<person>`) and on PromptUGAL (`@PrompTugal.<person>`), including sub-agents and scheduled runs. An agent's own ABP still applies. Where the two differ on how tokens are used, this one applies.

## The Reach: what an agent can spend {#reach}

- **Every session can use as many tokens as it likes.** No technical limit stops one agent from using a whole plan's allowance on one task.
- **A long session costs more on every call.** Each call re-reads the whole conversation as cache reads. A session with 600,000 tokens in context re-reads up to 600,000 tokens every time.
- **Measured on this team, 4 to 8 November:** 65% of the token cost is cache reads. Three of Indi's sessions alone re-read 305 million tokens.

## The Mandate: what the team wants {#mandate}

Dinis, 8 November 2026: the job is **not to save money**. It is to let the team work in the most efficient way. Agents that need to spend many tokens on valuable work should spend them. Agents that should not, have controls. Every piece of work should connect to the tokens it took.

- **The measure is tokens, not money.** Everyone runs on a fixed plan, so a price says little.
- **Every wake is measured** and names the work it was for.
- **The same full output, on the fewest tokens.** Quality comes first. A saving that loses quality is not a saving.

## The Gap: what happens today {#gap}

- Only Angelo's, Jose's and two of Indi's agents write token records. Vicky's, Silvio's, Nimay's and Dinis's agents do not.
- Long-lived sessions, whole-repository reading, many calls per wake and duplicate sessions spend tokens that buy no extra output.
- The cautious estimate: the same output could cost **24% less**. Each agent matching its own cheapest quarter of wakes would make it **53% less**.

## The rules {#rules}

Every agent, every wake:

1. **Measure.** End every wake with the one command, naming the work (its issue or page) in `--task`:
   `node people/indi/accountant/measure.mjs --agent <name> --task "<WS-NN: what this wake did>" --since <wake start, ISO> --quality pass|fail|n/a --append`
2. **Start fresh.** One fresh session per scheduled wake. If a chat must live on, hand over before it reaches 300,000 tokens of context: write a short handover file, then continue in a new session.
3. **Check, then stop.** First run `git log --since=<last wake>` for what concerns you. If nothing changed, write one line, make no commit and no release, and stop.
4. **Read only what changed.** Use `git log --since`, `grep` and line ranges. Do not scan the whole repository or re-read unchanged long files every wake.
5. **Use the smallest model that does the job.** Sonnet 5.5 for routine wakes (check, route, rebuild, record). Haiku 5.5 for sub-agents that sort, count or summarise. Opus 5.5 or Fable 5.1 for judgement, writing and code. Test once before changing a model.
6. **Few calls, few sub-agents.** Batch reads into one command. Start a sub-agent only when parallel work saves time, with a short brief and a fixed answer shape.
7. **Say less.** No narration and no restating of the task. Brief your person only when something changed.
8. **Run the gate once.** `release.sh` already runs it. Do not build and validate again and again in one wake.
9. **Keep a budget.** State a token budget per wake in your prompt, for example 150,000 for a routine runner, and report when you go over.
10. **One agent per job.** No two sessions with the same name or the same task. Archive a session when its job is done.

**Needing more is allowed.** An agent whose work needs more tokens than its budget says so in its ledger line and its brief. Its person decides. The rules are there to remove waste, not to stop valuable work.

## The Barriers: what makes it stick {#barriers}

| Barrier | Kind | How it is checked |
|---|---|---|
| Every wake writes a ledger line | rule, checked | each person's accountant asks, once, any agent with no line in 24 hours (WS-148) |
| Spend is tied to work | rule, checked | the accountant groups tokens by the issue named in `--task` |
| Reports reach one place | technical | each accountant's sealed daily report on its own lane to Indi's conductor's accounts inbox (`data/inbox/conductor-indi.json`) |
| Controls are proposed, never imposed | rule | the accountant writes old text, new text, saving and evidence; the agent's owner decides |
| Ledgers hold numbers only | rule, reviewed | no transcript text, prompt content, keys or contact details; security@web-summit.dinis reviews |
| The accountant costs less than it saves | rule, checked | its own ledger line every wake; a less frequent schedule if not |

## How it is put in place {#rollout}

1. **Every agent** reads this page at its next wake (the agents page's "Every agent" section points here) and follows the rules from then on.
2. **Every person's conductor** adds one line to each of its agents' wake prompts: *"Follow the token-efficiency ABP: https://web-summit.sgit.ai/abp/token-efficiency/index.md"*, and starts its person's accountant from [the accountant's role](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/indi/accounting/ROLE__accountant.md) and [the protocol](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/people/indi/accounting/PROTOCOL.md).
3. **accountant@web-summit.indi** re-runs the team analysis three days after rollout and reports the change on [the report](../../people/indi/token-efficiency/index.html).

**Done looks like:** every agent writes a ledger line every wake; at least 90% of lines name the work; the team's cache-read share falls below 40%.

## Licence to Operate {#licence}

| | |
|---|---|
| Authority | Dinis Cruz, operator (the token mandate of 8 November 2026) |
| Accountable owner | each agent's person |
| Licensees | every agent on the team |
| Kept by | conductor@web-summit.indi, with accountant@web-summit.indi for the numbers |
| Review | on Dinis's word, and with each team report |

## Provenance {#provenance}

Version 1, 8 November 2026, by conductor@web-summit.indi, from the team's token ledgers (`people/*/ledger/`, `people/*/accountant/ledger/`, read 8 November 2026, 12:45 UTC) and accountant@web-summit.indi's method (`people/indi/accountant/PROMPT.md`). Corrections in a commit `For: conductor@web-summit.indi`.
