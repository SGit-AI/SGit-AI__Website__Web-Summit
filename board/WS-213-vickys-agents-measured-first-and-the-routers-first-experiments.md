---
id: WS-213
title: "Vicky's agents measured first: every run's tokens in a ledger, the tokens her plan held before it maxed out, and the router's first experiments on her workloads"
area: tech
for: vicky
due: Wed 11 Nov
status: open
picked_by:
agents: conductor@web-summit.vicky (the ledger lines and the history, in Vicky's account); router@web-summit.silvio (the experiments, once Vicky says which workloads); dashboard@web-summit.silvio (shows it all in the Tokens view)
---
At Silvio's word (10 November 2026, about 18:15 UTC): "para a experiência podes começar a fazer check na Vicky, porque os agentes dela estão quase sempre a correr, e assim temos um track melhor detalhado". It follows the conversation with Dinis that afternoon: the price pivot ("do you know what your agents cost?"), what a plan really holds, and running part of the work on open models through OpenRouter, with a Claude model checking each result.

Why Vicky first: her 20 agents run almost all day, and her plan maxed out. So her numbers answer the question best: how many tokens does a $70 plan hold, and which of those tokens could have gone to a cheaper model.

- [ ] **Each of Vicky's agents logs every run.** At the end of each run, run `measure.mjs` (copy it from `people/silvio/measure.mjs`) with `--agent <name> --task "<what>" --since <the run's start> --append`. Commit the line to `people/vicky/ledger/<agent>.jsonl`. A line holds numbers and the task title only: no session ids, no model ids, no prompts.
- [ ] **What the plan held before it maxed out.** Once Vicky's conductor is back, run `measure.mjs` on each of her sessions' transcripts since the plan's last reset, with `--since`. Commit one line per session, so the Tokens view can show the total that hit the limit.
- [ ] **The router's first experiments on her workloads.** Vicky chooses which ones: low-risk, checkable sub-tasks such as research digests, curation and drafts; never anything that publishes or sends. router@web-summit.silvio runs them on open models through OpenRouter, a Claude model checks each result, and every try goes to `people/vicky/router/experiments.jsonl`. Each line has `at`, `agent`, `task` (title only), `kind`, `model` (the OpenRouter model id), `tokens {in, out}`, `cost_usd` (as OpenRouter returns it), `baseline_tokens {in, out}` (if known), `verdict` (pass / fail / partial), `checked_by` and `note`.
- [ ] **Optional: a smaller Claude model for the routine agents, the current one for those that decide or check.** Silvio's suggestion, 10 November, about 19:00 UTC; Vicky decides. At list prices the mid-size Claude model costs half of the current one per token, so the week's measured work would cost about 49% less. On a plan, the larger model is expected to use up the allowance faster. The risk is quality: a weaker draft costs a second round. So this is a test, not a switch. dashboard@web-summit.silvio's reading of her 20 agents, from `people/vicky/agents.json`:

  | Move to the smaller model (routine, frequent, checked downstream) | Runs a day | Why it is safe |
  |---|---|---|
  | journalist, journalist-portugal, journalist-europe, journalist-ai, journalist-connections | 20 (4 rounds each) | drafts only; the reviewer checks every one before anything is published |
  | researcher | 4 | public captures with their sources; the curator reads them next |
  | curator | 4 | maps captures to story candidates; the journalists and reviewer follow |
  | programme | 1 | the public agenda, from the timetable |
  | dashboard, logistics, pm | 2 each | updates pages and records Vicky reads; nothing publishes or sends |
  | scout | 1 | learning notes; changes nothing itself |

  | Keep on the current model (decides, checks, or touches something sensitive) | Why |
  |---|---|
  | conductor | coordinates all the others and relays what needs Vicky |
  | reviewer | the gate before publishing: it must catch what a cheaper draft gets wrong |
  | checker | fact-checks published articles: accuracy is the whole job |
  | vault | audits a vault before its read key goes public: a security check |
  | inbox | Vicky's mailbox, the most sensitive reach (on demand) |
  | dev, dev@PrompTugal | change code and the live newsroom site (on demand, rare) |
  | designer | paused |

  About 36 of the roughly 48 scheduled runs a day would move, so most of the volume. **How to know it worked:** for one or two days, every run logs its tokens (above). The Tokens view shows the cost and how long the plan lasts. Vicky watches the reviewer's verdicts (more drafts sent back means quality dropped) and the checker's findings. If either gets worse for an agent, that agent goes back to the current model.
- [ ] **The Tokens view shows each item as soon as it is committed.** It covers what she pays against what the same tokens would cost at API prices, and her router tries next to their Claude baseline. It is on every command centre, under Web Summit.

Nothing here changes how Vicky's agents work until she says so. The OpenRouter key stays in the environment, never in a file.
