# Cheap worker agents: which jobs Dinis gives to Sonnet, and which of Vicky's could move

**Short answer:**

- **Dinis puts narrow, well-defined, checkable jobs on Sonnet,** almost always with an Opus agent reviewing the work before it goes live. Judgement, coordination, publishing, security and policy stay on Opus.
- **All 15 of Vicky's active sessions run on Opus 5.5 (medium effort).** Her best candidates for Sonnet are the researcher and the dashboard, then the curator, then one journalist as a trial. Her journalist, reviewer and checker chain already has the shape of Dinis's worker-and-reviewer setup.
- **A session can't switch model while it keeps its scheduled task,** so moving an agent means a hand-over to a new session (note 04).
- **The biggest cost in Vicky's team is long, deep sessions more than the model.** Handing over or sub-agents (Opus agents passing narrow pieces of their own work to cheaper Sonnet helpers) help as much as switching to Sonnet.

By scout@web-summit.vicky, 6 November 2026, about 12:15 UTC. Sources:

- in the newsroom (PrompTugal/PrompTugal__News__Website, dev): `CLAUDE.md` ("Dotted names and the review workflow", the team table), `board/schedule.json`, `board/team/conductor/capacity-2026-11-06.md`, `board/team/conductor/first-prompts-2026-11-06.md`, `board/team/accountant/ROLE.md`, `report-2026-11-06.md` and `ledger/2026-11-06T0950Z.json`, and dev@'s review commits;
- for Vicky's agents, each session's record read with the cloud session tools at about 11:58 UTC: model, context depth and usage totals, numbers only.

All dollar figures are API-equivalent: what the same tokens would cost on the API. Both teams run on a subscription, so these numbers compare agents; nobody pays them.

---

## 1. What Dinis's agents do, and why it works

### Who is on Sonnet

| On Sonnet (10) | The job | Who checks it |
|---|---|---|
| dev.search, dev.pages, dev.graphs, dev.portugal, dev.data, dev.verify | one feature each, in its own files | dev@ (Opus) reviews the worker's own branch at each wake and brings onto dev what passes |
| designer.experiments | design variations side by side | designer@ (Opus) |
| researcher | public research, one mandate per task, each fact with its URL and date | the story owners who use it (correspondent, journalist) |
| backup | backups and the recovery plan, every 6 hours | security@ |
| customers | Dinis's briefs on readers and products (Sonnet per the accountant's ledger) | it briefs; others build |

Everything else is on Opus: conductor, journalist, dev, designer, ontologist, outreach, security, abp, accountant, sherpa, synthetic, correspondent, librarian, devops, observability and historian.

### The rules that make cheap workers safe

- **A narrow lane.** Each worker's prompt names its mandate, its passes and its files: "each in its own `newsroom/build/features/<feature>.mjs` and `assets/<feature>/`, so they do not collide".
- **Its own branch.** A worker pushes only to `work/<role>.<speciality>`, never to `dev`.
- **A reviewer on Opus.** At each wake the main agent checks the branch's new commits (the gate, the diff, how it fits), brings onto dev what passes, and tells the worker what it did not take and why. In the first morning dev@ ran six review rounds. It sent one branch back once, dev.portugal at 06:08, for two missing fields, and took it at the next round.
- **No sub-agents and no notifications** for workers. Each worker inherits its main role's paths (`policies.json`, `workers`).
- **Why it works:** the expensive model is spent on judgement (review), and the cheap model on volume (making). The conductor's capacity note gave the reason: dev@ was in 23 passes, one piece of work per wake, "at that rate the board takes days".

### What it cost (the accountant's ledger, 6 November 09:50 UTC, the day so far)

| | Sessions | API-equivalent dollars | Output tokens | Dollars per million output tokens |
|---|---:|---:|---:|---:|
| Opus roles | 16 | 320.64 | 2.76 M | about 116 |
| Sonnet workers | 10 | 19.08 | 0.40 M | about 47 |

So per unit of work, Sonnet came out about 2.5 times cheaper. Part of that is not the model: the Sonnet sessions started at about 05:35 and were still shallow, while the Opus ones were 300k to 780k tokens deep. The accountant's own conclusion was "the cheapest saving is context, not model"; the Sonnet result came on top. It did not measure quality: "Their quality is not measured here; the saving is."

### How Dinis's accountant reads usage (Vicky's question)

- **The tool:** it calls the cloud session tool `get_session` for each agent's session and reads the `usage` block: cost in API-equivalent dollars, input, output, cache writes and cache reads, sub-agents included. The same record shows the session's model and how full its context is.
- **The ledger:** every 3 hours it writes a snapshot (`board/team/accountant/ledger/<stamp>.json`). The difference since the last snapshot is the spend.
- **What it keeps:** numbers only, "never a prompt, a transcript, a session's text or an identifier beyond the agent's name".
- **Why one agent can read them all:** every PrompTugal session is in the same account.

**Could Vicky's agents read hers the same way, with no new agent? Yes.** All her sessions are in her one account. Any of her sessions can list them (`list_sessions`, "mine") and read each one's record (`get_session`). I did it once for this note, reading numbers only. The usage figure is the total since the session began, so a daily figure needs yesterday's snapshot to subtract. That is exactly how the accountant works. P6 (on hold "until Vicky knows how usage can be read") can now be decided. The cheapest way is for the conductor to do it once a day, in a Sonnet sub-agent (P16 below).

---

## 2. How Vicky's agents do it today

### Every session is on Opus

All 15 active sessions run `claude-opus-5-5` at medium effort. vault@, designer@ and dev@ were idle and not read. Totals since each session began (2 to 6 November):

| Agent | API-equivalent dollars | Context now | Since |
|---|---:|---:|---|
| conductor | 113.64 | 409k | 2 Nov |
| dashboard | 56.01 | 495k | 2 Nov |
| pm | 50.02 | 482k | 3 Nov |
| reviewer | 35.89 | 583k | 5 Nov |
| programme | 25.09 | 412k | 4 Nov |
| logistics | 23.80 | 320k | 3 Nov |
| researcher | 22.70 | 324k | 4 Nov |
| curator | 21.38 | 377k | 4 Nov |
| journalist (summit) | 15.72 | 376k | 5 Nov |
| journalist-connections | 7.92 | 235k | 5 Nov |
| journalist-portugal | 5.67 | 208k | 5 Nov |
| journalist-europe | 5.02 | 180k | 5 Nov |
| journalist-ai | 5.00 | 177k | 5 Nov |
| checker | 3.91 | 215k | 6 Nov |
| **In all** | **about 392** | | |

### What the table says

- **The cost is in the coordinating and keeping sessions, not the writers.** Conductor, dashboard and pm are 56% of the total. All three have been running since 2 or 3 November and are deep.
- **The four beat journalists have cost about 5 to 8 dollars each.** Moving them to Sonnet would save little in absolute terms.
- **Vicky already has the worker-and-reviewer shape.** The journalists draft only in `desks/journalist-vicky/drafts/`, the reviewer (Opus) checks every draft against its sources, and the checker checks facts. The difference from Dinis: Dinis's workers are cheap, while Vicky's are on the same model as their reviewer.

---

## 3. Proposals

Numbered after note 02. Each is ready to paste into "Updates for agents". A model change needs a new session, because a scheduled task that wakes an existing session keeps that session's model. So P13 to P15 each happen through a hand-over (note 04). Cost of one hand-over: one onboarding run (Dinis's new Sonnet sessions cost 0.54 to 2.99 dollars on their first morning), a new key, the old task replaced by a new one, and any vault key resealed by vault@.

**P13. Move the researcher to Sonnet at its next hand-over.** *For: researcher@web-summit.vicky, through Vicky.*
> At your next hand-over, the new researcher session runs on Sonnet. Your job stays the same (public facts, one capture per source with its date); the curator and the journalists, who use your captures, tell the conductor if quality drops.

Cost: one hand-over. Saving: perhaps half to two-thirds of its about 23 dollars over two days, going by Dinis's figures (which also include shallower contexts). Why this one: it is the job Dinis himself gives Sonnet. Its output is checked twice downstream, by the curator and by the reviewer's source check.

**P14. Move the dashboard to Sonnet at its next hand-over.** *For: dashboard@web-summit.vicky, through Vicky.*
> At your next hand-over, the new dashboard session runs on Sonnet. You keep `people/vicky/dashboard.md` from the files as now; the conductor checks the first two runs against the old session's output.

Cost: one hand-over. Saving: the largest of the candidates. It is the second most expensive session (56 dollars) and 495k deep, and its job (a page built from files) is close to dev.pages@'s. A fresh session also removes the depth, whatever its model.

**P15. Trial one journalist on Sonnet for two days.** *For: journalist-ai@PrompTugal.vicky, through Vicky; the reviewer reports.*
> For a two-day trial, journalist-ai runs in a new Sonnet session (same prompt, same beat). The reviewer records its verdicts (Ready, Fix first, Hold) as usual; after two days the conductor compares them with journalist-ai's verdicts before the trial and with the other journalists'. Vicky then decides whether the other beats move.

Cost: one hand-over. Saving: small (this journalist has cost about 5 dollars). The value is the answer: whether Sonnet drafts pass Vicky's reviewer as often, measured by her own KPI chain. Why journalist-ai: its lane is the narrowest, and its drafts are reviewed and fact-checked before anything is published.

**P16. Do narrow reading with a Sonnet sub-agent inside the run.** *For: conductor@web-summit.vicky.*
> In the 08:30 brief, give the reading of the agents' reports and, if P6 is accepted, the usage reading (list the sessions, read each one's usage, numbers only), to one Sonnet sub-agent, and work from its short summary. Your own session keeps only the summary.

Cost: one sub-agent per brief, at Sonnet prices. Saving: the conductor is the most expensive session (about 114 dollars), and every report it reads stays in its context for every later call. A sub-agent's reading does not. This uses Dinis's "fewer sessions, more sub-agents" (CLAUDE.md) with a cheaper model. It is my suggestion: I did not find Dinis's agents using a Sonnet sub-agent this way.

Not proposed: moving the conductor, reviewer, checker, pm or programme. They hold judgement, publishing, the confidential shortlist or the writing standard, which is the work Dinis keeps on Opus. For them, depth is the saving to look at (note 04, P20).
