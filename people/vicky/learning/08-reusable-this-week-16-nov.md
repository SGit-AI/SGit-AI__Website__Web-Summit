# What Vicky could reuse from the whole team's week (9 to 16 November)

**The weekly run's first note.** The rule is "whole team, reusable only" (standing answer 56): only a tool, a workflow, a rule or a format that Vicky could use, with where it lives, who made it, and what adopting it would take and cost. Nothing that is only interesting.

**Short answer:** four things are worth Vicky's time. Three are small and one needs her decision.
1. **A lane check** from Angelo's team: a list of the paths each agent may write, and a check that catches a commit outside it. Start with the read-only audit, which needs no change to the shared gate (P31, P32).
2. **A ledger tally** from Indi's accountant that totals the token ledger without counting the same tokens twice. Vicky's ledger now has exactly that double counting problem (P33).
3. **The session archive kit** from Dinis's conductor. It is Dinis's request to every team member, and it conflicts with one of Vicky's own rules. This is her decision, not an agent update (P34).

By scout@web-summit.vicky, Monday 16 November 2026, 07:05 UTC (scheduled run). Everything below is from the public team site and newsroom (both on dev), read on 16 November.

**How it was read, and its limits.** A Sonnet sub-agent read the week's commit history (about 2,200 commits on the team site and 3,000 on the newsroom since 9 November), the dashboards and the newsroom's briefs. It looked at a sample, not every commit, and returned eight candidates. I opened the files and commits behind each one I kept and corrected the figures below where they differed. The team site's "What happened" pages stop at 10 November, so they did not cover the week. I read no private material, no vault, no mail and nothing from Web Summit's site. The mentor still has not answered my eight questions.

---

## 1. The lane check (Angelo's team)

**What it is.** Each agent has a list of the paths it may write. A commit by that agent that touches a file outside the list is refused, unless the commit message carries a line saying why:

`Outside: <path or glob>; <why: who asked, with a sha or a quote>`

A few paths are reserved: only the agents named for them may write there, with or without the line.

**Where it lives (team site).**
- `people/angelo/policy/lanes.json`: the lists, 24 agents with their aliases, a `common` set every agent may write, and `reserved` paths.
- `people/angelo/policy/lane-check.mjs`: the check.
- `people/angelo/policy/audit.mjs`: a read-only version. It prints each commit in a range, the files written outside the lane, and whether the commit names another owner. The check was built from it.
- `admin/build/validate.js`, check 21: the gate runs the lane check on every push, before `release.sh` pushes and in CI.
- `people/angelo/policy/decisions.md`: Angelo's yes, 7 November: "Go ahead with both".

**Who made it.** Angelo's policy agent (policy@) wrote the prototype and the proposal. dev@PrompTugal.angelo built the gate check from it. Angelo approved it on 7 November, and policy@ turned enforcement on on 8 November. So the core is older than this week. This week it was extended to the account-B agents and the handover agents (commits `c9c73984` on 10 November, `36a2a0d0` on 11 November, `9034290d` on 13 November).

**Evidence it works.** The file says that when enforcement was turned on, all 5 of 5 outside writes since the check went in had been declared and none refused. I counted 94 commit-message lines starting "Outside:" on dev since 9 November.

**What adopting it would take.**
- **Step 1, no change to the shared gate:** a lanes file for Vicky's agents, drafted by her conductor from each agent's prompts file and task files and approved by Vicky, as Angelo approved his. Then a copy of `audit.mjs` with Vicky's paths and the name patterns `@web-summit.vicky` and `@PrompTugal.vicky`. The conductor runs it daily and lists the findings in the brief.
- **Step 2, later:** the gate itself. `lane-check.mjs` and check 21 both hard-code Angelo's folder and the pattern `@(web-summit|promptugal).angelo`, so the gate would need Vicky's lanes added. The gate is Dinis's team's file, so that is for Vicky to raise with Dinis, not for her agents.
- **Newsroom desks:** the lane check covers commits to the team site. Vicky's desks also commit to the newsroom, where abp@PrompTugal.dinis already logs writes outside each agent's grant. It is not part of this proposal.

**Cost.** One conductor run once to draft the lanes and copy the script (estimate 50 to 100k tokens). Then a few thousand tokens a day for the audit. The check itself uses no model.

**Risk.** Vicky's agents write across `people/vicky/`, `board/`, `desks/` and `content/`, so the lists will be long. A first audit may show many harmless outside writes until the lists are right. Angelo's team ran it in warning mode overnight, about nine hours, before turning enforcement on.

## 2. The ledger tally (Indi's accountant)

**What it is.** A Python script that totals the token ledger per agent and counts each stretch of time once. A ledger line whose `--since` window sits inside a wider line of the same agent is skipped, and sub-agent totals that repeat exactly are counted once. It prints numbers only.

**Where it lives (team site).** `people/indi/accountant/tally.py`.

**Who made it.** accountant@web-summit.indi (WS-148). It was added on 10 November (`9fd2185b`).

**Why it matters for Vicky.** Standing answer 54's ledger asks each agent for a run line with `--since` and, once, a session total with no `--since`. The total covers the same time as the run lines. Adding the lines gives the wrong number. Vicky has 22 ledger files in `people/vicky/ledger/` and, as far as I can tell, no tool of hers sums them. My own file today holds 5 run lines and 1 session total.

**What adopting it would take.** Copy it to `people/vicky/tools/` and change its ledger folder to `people/vicky/ledger/`. Run `python3 -I people/vicky/tools/tally.py <since ISO>` whenever a brief needs usage.

**Cost.** Small: a copy and one path change. Running it uses no model.

## 3. The session archive kit (Dinis's conductor)

**What it is.** A kit that has an archive agent copy a person's Claude Code sessions into encrypted vaults, one per project of their choosing. Each vault opens with a Sessions Explorer, and each session gets a review of how its agent behaved. Dinis writes that he ran it on 581 sessions in 11 vaults.

**Where it lives (team site).** `admin/tools/session-archive/`: `BRIEF.md`, `START.md`, `FOR-EVERYONE.md` and the `tools/` folder.

**Who made it.** conductor@web-summit.dinis, 14 November (`63ff4373`, `8f0c56ea`).

**What it asks of Vicky.** `FOR-EVERYONE.md` is Dinis's message to the whole team: "Please archive every Claude Code session on your account into your own encrypted vaults." The steps:
- open a new Opus session in an environment with an SG/Send access token;
- paste the kit's start prompt;
- send the archive agent's key fingerprint to Dinis;
- paste the sealed key he sends back;
- answer one question about which projects the sessions belong to.

It is about 10 minutes of her time, then check-ins.

**Cost.** Large. The kit's own figure is roughly 50,000 tokens per session. Vicky has about 20 sessions, so roughly a million tokens in all (my estimate). It suggests doing one project vault at a time.

**Why this is not an agent update.**
- **It conflicts with one of her own rules.** Standing answers 41 and 42 say her agents "still never read another session's conversation" (`list_events`, `get_event`). The kit's agent reads exactly that: `START.md` says it uses `list_sessions` and `list_events`, read-only. Adopting it needs an exception she writes, limited to one archive agent.
- **Her sessions hold material her rules keep private.** That includes the interview shortlist, vault B and mail. An archive would gather it, with its reviews, in vaults she controls. She decides who gets each vault's key.
- **It may already be on her conductor's list.** It is Dinis's request to everyone, and `decisions.md` does not mention it.

**My recommendation.** Ask Dinis what he needs from her archive, and decide after the summit week. If yes, start with one small project vault and a written exception for the archive agent only.

---

## Looked at, nothing to adopt

- **Handover inbox for an absent person** (Angelo's conductor, `people/angelo/handover/`). Two hourly agents ran Angelo's requests and ran two days with no requests. Its own state file says the idle wakes cost about 20 dollars API-equivalent, and it was put on hold on 15 November. The lesson, that an idle hourly wake is not free, is one Vicky already acted on when her agents went on demand (standing answer 43).
- **Worker pool claims** (`people/angelo/tools/pool-claim.mjs`). Agents claim a work item by pushing one file, so two never take the same one. It only helps if several agents pick from one shared queue. Vicky's task files have one owner each.
- **Scenario checker** (`people/indi/demo/`). It checks Angelo's stand-demo scenario files only.
- **The "only on Web Summit's site" rule and tool** (newsroom, 11 November). Standing answer 31, rules 1, 3 and 4, already covers it for Vicky.
- **The accountant's cost pages** (newsroom, 16 November). They mostly duplicate what Vicky has. The one useful idea, counting each stretch once, is item 2.

---

## Proposals

Numbered after the last in the README (P30). Each is ready to paste into "Updates for agents", except P34, which is for Vicky.

**P31. Lanes for Vicky's agents, and a daily read-only audit.** *For: conductor@web-summit.vicky.*
> Draft `people/vicky/policy/lanes.json`: for each agent of Vicky's, the paths it may write on the team site, taken from its prompts file and task files, plus the paths every agent may write (its own report, its ledger file). Send it to Vicky for approval; do not use it before she approves. Copy `people/angelo/policy/audit.mjs` to `people/vicky/tools/lane-audit.mjs`, read-only, with the lanes path and the agent-name patterns (`@web-summit.vicky`, `@PrompTugal.vicky`) changed to Vicky's. Once approved, list in each daily brief, under the agent table, every commit by one of Vicky's agents in the last day that wrote outside its lane and has no `Outside:` line. Change no agent's file.

Cost: one conductor run once (estimate 50 to 100k tokens), then a few thousand tokens a day. The script is read-only.

**P32. Say why, when you write outside your lane.** *For: every agent of Vicky's, after Vicky approves the lanes in P31.*
> If a commit of yours must write a path outside your lane in `people/vicky/policy/lanes.json`, say so in the commit message on one line: `Outside: <path>; <why: who asked, with a sha or Vicky's words>`. Without that line, the conductor's daily audit lists the commit in the brief.

Cost: one line in the occasional commit.

**P33. Total the ledger without counting twice.** *For: conductor@web-summit.vicky.*
> Copy `people/indi/accountant/tally.py` to `people/vicky/tools/tally.py`, with its ledger folder changed to `people/vicky/ledger` and Indi's names changed to Vicky's. Whenever a brief needs the usage of the week or the day, run `python3 -I people/vicky/tools/tally.py <since ISO>` and use its per-agent totals. Never add up ledger lines by hand: each run line and each session total line cover the same time.

Cost: small, a copy and one path change. Each run of the script uses no model.

**P34. The session archive kit.** *For: Vicky (her decision, not an agent update).*
> Decide whether to archive her sessions as Dinis asks in `admin/tools/session-archive/FOR-EVERYONE.md`. If yes, write the exception to the rule in standing answers 41 and 42 that lets one archive agent read her sessions' conversations, and say which projects and who holds each vault's key. If not yet, tell Dinis when.

Cost: large (the kit's figure: about 50,000 tokens per session, roughly a million for her sessions) and about 10 minutes of her time. My recommendation is to ask Dinis what he needs, then decide after the summit week.
