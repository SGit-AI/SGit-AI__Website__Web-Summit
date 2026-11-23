# What Vicky could reuse from the whole team's week (16 to 23 November)

**The weekly run's second note.** Same rule as last week: only a tool, workflow, rule or format Vicky could use, with where it lives, who made it, and what adopting it would take and cost.

**Short answer:** a smaller week. One item is worth adopting, and only in a narrow form: **a short review of each diff for private material, just before an agent commits** (P38). Everything else I found is already hers, or against a decision she made, or only interesting.

By scout@web-summit.vicky, Monday 23 November 2026, 07:15 UTC (scheduled run). Sources: the public team site and newsroom (both on dev), read on 23 November.

**Where the week's work is.** Of the team site's commits this week (357, of which about 195 are not CI releases), 192 come from Vicky's own agents, 2 from Jose and 1 from Indi, as I counted from the commit subjects. Dinis's team now works in the newsroom, so that is where the reusable material is. A Sonnet sub-agent read the newsroom's "New from Dinis" table, the new files under `board/` and `newsroom/tools/`, and five guidance files. It read none of the roughly 3,000 newsroom commits one by one and no dashboards, so it can have missed small things. I checked the team-site split myself and checked the evidence for the item below.

**Where last week's proposals stand** (standing answer 88, Vicky, 16 November): P33 accepted (done, the conductor totals usage with `tally.py`), P34 done (she ran the archive herself on 15 November). **P31 and P32 (lanes and the `Outside:` line) were deferred to this week.** Nothing in them has changed, so they are ready whenever she wants them. P35 to P37 (her own app) have no decision recorded yet.

---

## Inner passes: a review of the diff before an agent commits

**What it is.** Dinis's rule for every agent in his newsroom team, from 18 November: each wake runs five short steps inside the session, as Sonnet sub-agents:
1. a **conductor pass** checks the planned work against the guidance and the agent's grant;
2. a **security pre-review** checks the plan;
3. the work itself;
4. a **security post-review** reads the diff before the commit and checks it for secrets, private people's data or contacts, data without a licence link, writes outside the agent's paths, and any refusal worked around;
5. a **closing conductor pass** writes the status and the report.

The commit or status then says the passes ran and what the post-review found, or "clean". Cost is counted in the wake's usage.

**Where it lives (newsroom).** `board/guidance/2026-11-18-inner-passes-and-security.md`, with its row in `board/guidance/README.md`.

**Who made it.** conductor.b@PrompTugal.dinis, at Dinis's word on 18 November (commit `a58181087`). The same file adds a separate hourly security agent across every repository, which is not for Vicky.

**Evidence it is used.** I found about 110 lines in commit messages since the rule was written that say the passes ran or the post-review was clean, against about 1,330 non-CI commits in the same time. Examples are the place agents and the designer. Some agents say "inline" and run the passes themselves rather than as sub-agents. I did not check whether every agent follows it.

**Why only the post-review fits Vicky.** She already has a conductor, a hold file, lint scripts (`draft_lint.py`, `publish_check.py`) and a weekly security check. What those cannot do is read context. A script can refuse an email address, but it cannot know that a name belongs to the interview shortlist, which must never be public (P27, and the guard at the top of `decisions.md`). A model reading the diff can. The opening and closing passes would add cost without much gain for agents that already have a prompt and a status block.

**What adopting it would take.** One paragraph in the prompts file of each agent whose commits are public text, and a line in its report. No new files and no change to any gate.

**Cost.** One short Sonnet sub-agent call per run that commits, which reads only the diff. My estimate is 5 to 15k tokens. With her ledger and `tally.py`, one week of use shows the real cost per agent.

**Risks.**
- **Sub-agent grant in the newsroom.** The newsroom's hooks treat a sub-agent as outside an agent's grant unless the grant names it (rule R4, observe mode: logged, not blocked). The reviewer's session showed the hooks active (P9). The first runs may therefore appear in abp@'s hourly report. Vicky or Dinis can settle that before it spreads, as with P11.
- **A model review can miss things.** It is a second check, not a replacement for the lint scripts.
- **Not for her private agents.** Inbox and vault work in their own windows, and their public commits hold only report lines.

---

## Looked at, nothing to adopt

- **Commit-signature check for every agent** (`newsroom/tools/check-signatures.mjs`, Dinis's rule of 19 November). Vicky decided on 11 November not to use signing (standing answer 42), and it needs CI changes she doesn't control.
- **"Wake twice a day, not hourly" and "every run starts from a commit"** (19 November). Vicky's agents already run on demand or once or twice a day, and her tasks are not GitHub timers.
- **ABP case-study pages** (`board/abp/case-studies/`). One plain page per notable event. Good reading, but extra writing for her conductor.
- **The maestro (a conductor over conductors)** (19 November). She has one conductor, and `vicky_brief.py` already makes her brief.
- **The telemetry agent** reads session transcripts to cost runs. Her ledger does that without reading anyone's conversation.

---

## Proposal

Numbered after the last in the README (P37). Ready to paste into "Updates for agents".

**P38. A Sonnet post-review of the diff before you commit, for public text.** *For: journalist, journalist-portugal, journalist-europe, journalist-ai, journalist-connections, reviewer, curator, researcher, analyst, designer, checker.*
> Before each commit that adds or changes public text, run one short Sonnet sub-agent over the diff only. It checks that the diff holds: no private name (the interview shortlist or anything from a private vault), no contact detail, no key or token, nothing outside your own paths, every fact with its source, and no rule of `decisions.md` worked around. Fix or drop what it finds. Then end your report line with `post-review: clean` or what it found and what you did. If your run changes no public text, skip it.

Cost: one short call per run that commits, estimated at 5 to 15k tokens, on Sonnet. Watch the first week's cost per agent with `tally.py`. If the newsroom's hooks log the sub-agent as outside the grant, tell Vicky; do not change any hook.
