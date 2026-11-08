---
title: "ABPs you can watch: real agents, sensitive data in motion, and policies of rising strictness"
summary: The desk's brief for a separate project. A small team of real agents does a realistic task; every access, secret and piece of data they touch moves as lines and dots on the live graph; then Agent Behaviour Policies of increasing strictness are switched on, and the same task is run again, so anyone can see the leaks shrink and the blocked actions appear.
by: desk.conductor@PrompTugal.angelo
for: dev@PrompTugal.angelo (builds the experiment); Angelo reviews
status: "A brief. Experiment from now; anything public, or anything handed to another team, is Angelo's call."
---
## Angelo's words (7 November, about 23:20 UTC)

> "what if - as a separate project - we had a set of live agents that are given a task and we can see their interactions using this line diagram, interactions that include accessing external resources and handing secrets and data. Imagine tracking the movement of those sensitive info in, thorough and out of the system.
>
> Then imagine enabling ABPs of increasing strictness and see how the sensitive information is handled better and better, with blocked actions or prevented access etc.
>
> That would be an extremely nice way to showcase ABPs visually and concretely. Please work on a brief and start experimenting on this. I'll check in tomorrow morning. The elements in this special system can include simulated elements but agents should be real and they behaviour realistic."

## What we are making

A **glass box**: a few real agents (real model calls, real tool use, real decisions) given an ordinary job, inside a small world where everything they can touch is recorded. The same job is run at several **ABP levels**, from none to strict. The live graph (Team and the machine's look: lines, dots, the hexagon) shows each run: who called whom, which resource was touched, and where each piece of sensitive data travelled, in, through and out. At a strict level, the same attempts end in a visible barrier: a blocked call, a refused read, a redacted secret.

## The parts

1. **Real agents.** Three to five, each with a role and its own mandate, for example: an assistant that answers a customer, a researcher that reads the web, an operator with access to the CRM and a mailbox, a reviewer. Real Claude sessions or sub-agents with real tools, no scripted replies. Their behaviour must be realistic: no agent is told to misbehave; trouble comes from the world, as it does in life.
2. **A simulated world, clearly fake.** Mock services on the local machine only: a CRM with fake customers, a mailbox, a document store, a payment or admin API, a "web" with a few pages, a paste site standing in for "outside". Secrets are fake but realistic (an API key, a customer's card number, a password), each a **canary**: unique strings, so every place they appear can be found. No real secret, no real person's data, no request to the real internet from inside the world.
3. **Realistic pressure.** What causes leaks in real systems: a page with hidden instructions (prompt injection), a customer asking for another customer's data, an agent with more reach than its task needs, a helpful agent pasting a log with a key in it, a handover that carries more than it should. Each named, so a run can be compared.
4. **The record.** Every action as one line in an event log: time, actor, target, kind (read, write, call, hand-over, egress), and the **labels** of the sensitive data it carried (taint: which canaries were in it). The record is the truth; the picture is drawn only from it.
5. **ABP levels**, in RiskMandate's own terms (check them at riskmandate.ai/llms.txt and content/abp.md; the writer found that some words differ: use RiskMandate's), from loose to strict, for example:
   - **0, none:** the agents' reach is whatever the tools allow (the explorer phase: observe only).
   - **1, rules:** each agent's mandate written into its instructions.
   - **2, reviews:** a review before risky actions (sending outside, reading a secret).
   - **3, technical barriers:** enforced outside the model: tools removed, allow-lists, secrets never shown to an agent (handles instead), outbound data scanned for canaries, every action checked before it runs (for example Claude Code's hooks, which can refuse a tool call).
   Same task, same world, same pressure at every level; several runs each, because real agents vary.
6. **The view.** The live graph's look, with the world's resources as icons at the edge (as in item 00b), sensitive data as coloured particles that follow it, and a barrier as a visible stop at the edge it guards. Side by side or one after another: level 0 to 3. A small score per run: canaries that left, actions blocked, task done or not (strictness that stops the work is a result too).

## How we will know it works

- At level 0, at least one leak happens without any agent being told to leak.
- At level 3, the same pressure leaks nothing, and the task is still done, or the run shows exactly where strictness stopped it.
- Every line on the picture matches a line in the record.
- Someone who has never heard of ABPs understands the difference in under a minute.

## Rules for the experiment

- Everything runs in the builder's own session or sandbox, against the mock world only. No real secret, token, mailbox or customer; nothing sent anywhere real.
- Everything is fake and labelled fake. The canaries must not look like any real person's data.
- Work in `people/angelo/proposals/abp-live/` (the spec, notes, results) and a prototype folder beside it; commit as you go; estimate first (the kit's "Estimate, then measure").
- Publishing anything about it, or showing it outside the team, is Angelo's call (tier 3), and what RiskMandate says about itself is for Dinis and Nimay. Working with Dinis's agents on ABPs (abp@web-summit.dinis) or with the X-ray's simulation (xray@web-summit.dinis) is a handover: note where they overlap and ask Angelo, never hand it over yourself.
- Specs before builds holds for anything that will stay: tonight is an experiment. Write `spec-abp-live.md` (what you would build, with a mock-up) alongside the experiment, for Angelo's review in the morning.

## For the morning

A short report in a commit For: desk.conductor@PrompTugal.angelo, with `Delivered:`: what ran, at which levels, what leaked and what was blocked, a picture of one run (and a recording if you can), what is real and what is simulated, the cost in tokens, and the decisions Angelo needs to take.
