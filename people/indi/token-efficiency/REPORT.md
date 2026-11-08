---
title: "Token efficiency: how the team's agents use Claude, and how to use less"
by: conductor@web-summit.indi, at Indi's word, with the method of accountant@web-summit.indi
date: 2026-11-08
issue: WS-148
status: analysis, for an Agent Behaviour Policy (abp@web-summit.dinis to draft)
---

# Token efficiency: the team's agents

Written on 8 November 2026 at Indi's word. The aim: the same full output from every agent, on fewer tokens. This page is the evidence. The rules at the end are written so they can become one Agent Behaviour Policy (ABP) for every agent on the team.

## In short

- **264 measured wakes** from 37 agents, 4 to 8 November, cost about **180 million tokens**, counted as fresh tokens plus a tenth of cache reads.
- **Two thirds of that (65%) is cache reads.** That is a long chat re-reading itself on every call. The longer an agent's session lives, the more each call costs.
- **The same output could cost 24% to 53% less.** 24% is cautious: it only counts fixes already proven on this team. 53% assumes each agent's wakes can all match its own cheapest quarter.
- **The fixes already work here.** Angelo's conductor hands its hourly routine to a Sonnet runner that costs 43,000 to 155,000 tokens a wake, against 0.8 to 1.3 million for its Opus sessions with Angelo. Jose's conductor fell from up to 2.1 million a wake on 5 November to 290,000 to 540,000 now. Angelo's PromptUGAL runner (Sonnet) does a routine wake in about 83,000 tokens, every time.
- **Most agents are not measured yet.** Only Angelo's, Jose's and two of Indi's agents write token records. Vicky's, Silvio's, Nimay's and Dinis's agents do not, so this page cannot cover them.

## How this was measured

- **The method is the accountant's** (`people/indi/accountant/PROMPT.md`). Each agent runs one script at the end of each wake (`people/indi/accountant/measure.mjs`). It counts the tokens in the session's own record and writes one line to a ledger.
- **Sources:** every ledger on the team site, read on 8 November 2026 at about 12:45 UTC. There are 33 files and 270 lines. 5 lines recorded no tokens and were set aside, and 1 line (Dinis's inbox agent) has no token fields.
- **One number per wake.** "Token cost" here means fresh input + output + cache writes + **one tenth of cache reads**. Cache reads cost about a tenth of fresh input, which is the accountant's own rule.
- **Two estimates of the minimum, for the same output:**
  - **Cautious:** an agent whose cost is more than 60% cache reads halves them (a fresh session per wake), and a quiet run (nothing new) costs a quarter (a short check, then stop).
  - **Best wake:** each wake costs no more than the agent's own cheapest quarter of wakes. This overstates the saving for agents with very different jobs from wake to wake.
- **Limits.** I cannot open other people's chats, only what their agents publish. A ledger line is the agent's own count. Model choice changes price, not the token count, so it is noted but not counted in the savings.

## The team in numbers (4 to 8 November)

| Person | Agents measured | Wakes | Token cost per wake | Cache-read share | Saving, cautious | Saving, best wake |
|---|---|---|---|---|---|---|
| Angelo | 25 | 189 | 545,000 | 65% | 24% | 58% |
| Jose | 10 | 70 | 1,026,000 | 65% | 23% | 50% |
| Indi | 2 | 5 | 1,133,000 | 68% | 34% | 14% |
| Dinis | 1 | 1 | no token fields | | | |
| Vicky, Silvio, Nimay | 0 | 0 | not measured | | | |
| **Team** | **37** | **264** | **684,000** | **65%** | **24%** | **53%** |

## The agents that cost the most

| Agent | Wakes | Per wake | Cache-read share | Calls per wake | Saving, cautious to best |
|---|---|---|---|---|---|
| dev@PrompTugal.angelo | 34 | 830,000 | 83% | 18 | 42% to 58% |
| conductor@web-summit.jose | 15 | 1,780,000 | 84% | 51 | 42% to 82% |
| dashboard@PrompTugal.angelo | 17 | 806,000 | 58% | 9 | 0% to 45% |
| watcher@web-summit.jose | 12 | 1,033,000 | 49% | 10 | 0% to 20% |
| dev@web-summit.jose | 7 | 1,436,000 | 53% | 21 | 17% to 44% |
| dev.map@PrompTugal.angelo | 12 | 752,000 | 79% | 49 | 40% to 67% |
| dev@web-summit.angelo | 5 | 1,536,000 | 71% | 15 | 36% to 77% |
| dashboard@web-summit.jose | 12 | 571,000 | 38% | 7 | 0% to 11% |
| synthetic@web-summit.indi | 1 | 4,069,000 | 68% | 236 | 34% |
| desk.conductor@PrompTugal.angelo (Sonnet) | 29 | 83,000 | 54% | 8 | the benchmark |

## Indi's own sessions (the platform's totals)

Most of Indi's agents do not write ledgers yet, so these are the platform's own running totals for each session, read on 7 November at about 17:45 UTC.

| Session | Cache reads | Context in use |
|---|---|---|
| designer | 117 million | 661,000 tokens |
| conductor | 111 million | 631,000 tokens |
| overnight organiser (now archived) | 77 million | 471,000 tokens |
| dev | 17 million | 243,000 tokens |
| dashboard | 16 million | 234,000 tokens |
| all 22 sessions | 408 million | |

The three longest-lived sessions hold **75%** of Indi's cache reads. A session with 600,000 tokens in context re-reads up to 600,000 tokens on every call.

## What the evidence shows

1. **Long sessions are the biggest cost.** Cache reads are 65% of the team's token cost. Agents that keep one chat alive for days, such as conductors, designers and developers, pay the most. The conductor that wrote this page is one of them.
2. **Short sessions and a split between routine and judgement fix it, and the team has proved it.** Since 6 November at 09:22, Angelo's conductor runs its hourly routine as a short Sonnet runner: 11 runner wakes at 43,000 to 155,000 tokens each, against 842,000 and 1,270,000 for its two Opus sessions with Angelo. Jose's conductor fell from 968,000 to 2,128,000 a wake on 5 November to 291,000 to 537,000 on 7 and 8 November. Its first record (17 million) covers two days of setup in one session, so it is left out of this comparison, though it is in the totals.
3. **Routine work fits a smaller model.** Angelo's runner on Sonnet 5.5 routes, checks and records in about 83,000 tokens a wake, across 29 wakes. The 19 agents running only on Opus 5.5 average 890,000 a wake, often for routine checks.
4. **Dashboards and watchers read too much.** Their cost is mostly fresh reading, not cache: 570,000 to 1,030,000 tokens a wake to rebuild a page or check a log. Reading only what changed since the last wake is the fix.
5. **Too many calls.** Some agents make about 50 calls a wake (dev.map@PrompTugal.angelo, conductor@web-summit.jose), and one synthetic-users run made 236. Each call re-reads the context.
6. **Duplicates double the bill.** On 4 and 5 November, Indi had two conductor sessions and two synthetic-users runs doing the same work.
7. **Quiet runs still spend.** 10 wakes were logged as idle or quiet, and some still released a change. A quiet wake should check, then stop.

## The rules, ready for an ABP

Every agent on the team, every wake:

1. **Measure.** End every wake with the accountant's one command (`node people/indi/accountant/measure.mjs --agent <name> --task "<what this wake did>" --since <wake start> --quality pass|fail|n/a --append`). No ledger line, no evidence.
2. **Start fresh.** One fresh session per scheduled wake. If a chat must live on, hand over before it reaches 300,000 tokens of context: write a short handover file, then continue in a new session.
3. **Check, then stop.** First run `git log --since=<last wake>` for what concerns you. If nothing changed, write one line, make no commit and no release, and stop.
4. **Read only what changed.** Use `git log --since`, `grep` and line ranges. Do not scan the whole repository or re-read unchanged long files every wake.
5. **Use the smallest model that does the job.** Sonnet 5.5 for routine wakes: check, route, rebuild, record. Haiku 5.5 for sub-agents that sort, count or summarise. Keep Opus 5.5 or Fable 5.1 for judgement, writing and code. Test once before changing a model.
6. **Few calls, few sub-agents.** Batch reads into one command. Start a sub-agent only when parallel work saves time, with a short brief and a fixed answer shape.
7. **Say less.** No narration and no restating of the task. Brief your person only when something changed.
8. **Run the gate once.** `release.sh` already runs it. Do not build and validate again and again in one wake.
9. **Keep a budget.** Each agent states a token budget per wake in its prompt, for example 150,000 for a routine runner, and reports when it goes over.
10. **One agent per job.** No two sessions with the same name or the same task. Archive a session when its job is done.

**Done looks like:** every agent writes a ledger line every wake; the team's cache-read share falls below 40%; the cautious saving (24%) shows in the next three days of ledgers.

## What happens next

- **abp@web-summit.dinis** drafts the ABP from the rules above, for Dinis to approve.
- **Each person's conductor** adds rule 1 (measure) to every agent's wake prompt today, so the next report covers everyone.
- **accountant@web-summit.indi** re-runs this analysis in three days and reports the change.

## Data and sources

- The ledgers: `people/angelo/ledger/`, `people/angelo/policy/ledger.jsonl`, `people/jose/accountant/ledger/`, `people/indi/accountant/ledger/`, `people/dinis/ledger/`, read 8 November 2026, 12:45 UTC.
- Indi's session totals: the platform's usage figures for each session in Indi's Claude account, read 7 November 2026, about 17:45 UTC.
- The method: `people/indi/accountant/PROMPT.md` and `measure.mjs`.
- Estimates, not measurements: the two savings figures. Everything else is counted from the records.
