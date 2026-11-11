---
title: "Account B's team: project leads that start and retire, and accountant.b@"
by: spec@PrompTugal.angelo (bravo.large.worker@PrompTugal.angelo), for conductor.b@PrompTugal.angelo
written: 2026-11-11
for: Angelo, to read with conductor.b@ (one screen first: summary.md, beside this file)
issue: WS-208
status: "draft for Angelo"
brief: people/angelo/pipeline/b1-team-spec/brief.md (Angelo's go, 11 November, "Let's go with b1")
---
# Account B's team: leads and the accountant

**In one line:** each project gets a lead Angelo can talk to, started from a short project brief and retired with a debrief; one small accountant reads only Angelo's records and tells him what each item, role and lead cost, against a budget that is recorded, never enforced.

## What and why

Angelo, 11 November: *"when a new project is started you spawn a new lead that I can interact with when I need, and then we retire it when it's over"*; *"we need an accountant agent to make sure we optimize our use of tokens across the account"*; *"we want to be able to track each and every agentic activity though commits"*. Today the pipeline has slots for single steps (people/angelo/pipeline/ROLES.md) and one lead already running (conductor.fringe@, people/angelo/conductor-b/runs.md), but no rule for how a lead starts or ends, and no one reads the ledger for account B.

## Out of scope

Starting any session, task, key, lane or project; changing ROLES.md, lanes.json or runs.md (this spec lists those changes for their owners); Indi's and Dinis's accountants.

## 1. The lead lifecycle

**Name.** Angelo asked: *"This means we have things like abp-article.writer or live-map.dev etc?"* Two real options:

| Option | Example | Good | Bad |
|---|---|---|---|
| A. `<project>.lead@PrompTugal.angelo` | `live-map.lead@` | the role is plain; the writing and coding stay with the slots (tenet 1, session-less slots) | not quite his examples |
| B. `<project>.<role>@PrompTugal.angelo` | `live-map.dev@` | his words | reads as a worker; clashes with account A's role-first names (`dev.map@`, `dev.abp@` in people/angelo/ledger/) |

**Recommendation: A.** The steps inside a project (`abp-article` writing, `live-map` coding) are done by slots with the role in their `Role:` trailer, so "abp-article.writer" is visible in every commit without being a session.

**conductor.fringe@PrompTugal.angelo** was named by Dinis's swarm (board/WS-215-lisbon-fringe.md: "each person's conductor.fringe@"), so its name stays. We treat it as the lead of the project `fringe`: same rules below, its records in the Fringe repository as already agreed (people/angelo/conductor-b/STATE.md, "Lisbon Fringe").

**Start** (conductor.b@, on Angelo's go):
1. A project brief, `people/angelo/projects/<project>/brief.md` (new folder), with four fields: **goal** (one line), **done when** (checkable), **budget** (tokens, see section 2), **skills** (from people/angelo/pipeline/skills/). Plus Angelo's words, quoted.
2. The lead's prompt: the ROLES.md "lead" block. Note: the common preamble says "do it and end" and "fresh session", which does not fit a long session, so ROLES.md needs a short lead preamble (change for its owner, below).
3. The lane request for policy@, ready for Angelo to paste in policy@'s session, each name in full, no wildcard:
   > policy@: please add `<project>.lead@PrompTugal.angelo` to people/angelo/policy/lanes.json, writes `people/angelo/projects/<project>/**` only, no wildcard. Angelo's go: "<his words>".
4. A line in people/angelo/conductor-b/runs.md (role: lead).

**Running.**
- Talks to Angelo in people/angelo/pipeline/formats/conductor.md (snapshot, then one point at a time).
- Wants a step done: a line in `requests.md` in its folder (role, size, what, done when), committed For: conductor.b@, which starts a slot. The lead never starts a session or task, makes a key, or publishes.
- Its memory is the project's `STATE.md`, not the chat: goal, decisions with Angelo's words, open steps, open questions. Committed after each exchange and at every pause.
- **Fresh session, same name:** when the lead's context gets large (rule of thumb: its ledger line passes its per-session budget, or after about a day of talk), conductor.b@ starts a new session with the same prompt and the lead reads STATE.md first. The old session is archived.

**Retiring** (Angelo decides; nobody else can):
1. The lead writes `debrief.md`: what was delivered (paths, links), lessons (each one also added to the Lessons section of the skill it belongs to), total cost (from accountant.b@).
2. conductor.b@ archives the session (Angelo's "Yes, please go ahead" for finished workers, 11 November; extended to leads by his retire word).
3. The lane removal for policy@, ready to paste like the request above.

## 2. accountant.b@PrompTugal.angelo

**Reads, and only these** (all Angelo's):
- people/angelo/ledger/*.jsonl (one line per run, from people/indi/accountant/measure.mjs)
- people/angelo/estimates/*.jsonl (estimate against actual, people/angelo/estimates/README.md)
- people/angelo/conductor-b/runs.md (who ran, which item, role, session)
- people/angelo/pipeline/*/times.json (each step's start and end)
- The platform's cost per session, where conductor.b@ has recorded it in runs.md (there is no column for it yet: a change for conductor.b@, below).

**Reports**, in one file per run under people/angelo/reports/ (already in every agent's common lane in lanes.json):
- cost per item, per role, per slot size and per lead; queue waits (times.json); empty runs (a session with no commit); small steps run on large slots;
- each number naming the file it came from (skills/analyst.md);
- budgets proposed per item and per lead, and one line "Ceiling: keep / raise to n" (QUEUE.md's rule).

**Budgets: record, not block.** A budget is a line in the brief; over budget is raised to Angelo through conductor.b@, never stops a run (content/abp/token-efficiency.md: "Needing more is allowed ... The rules are there to remove waste, not to stop valuable work").

**Which number.** The ledger gives `total` and `total_without_cache_reads`. Cache reads dominate: alpha's spec run was 1,777,044 total but 83,330 without cache reads (people/angelo/ledger/, alpha.large.worker's file, line 1). **Recommendation:** budget on `total_without_cache_reads`, and show both.

**How it runs.** A fresh small-model session each time, no key, started by conductor.b@: every four hours while any slot or lead has run since the last report, and whenever Angelo asks. One commit and one ledger line per run. The prompt is ROLES.md's "accountant (small)" block, widened to the reads above.

**Reused, not copied:** people/indi/accountant/measure.mjs (the measuring), people/indi/accountant/PROMPT.md and people/indi/accounting/ROLE__accountant.md (the role's shape: "tokens not money"), people/indi/accounting/PROTOCOL.md (the ledger line), content/abp/token-efficiency.md (the rules). newsroom: board/budgets.json (the budgets' shape): **not opened**; this session was not allowed to attach the newsroom repository. The accountant's first run should read it.

**Kept apart.** accountant.b@ reads nothing outside people/angelo/ and sends nothing to anyone. Indi's protocol has each person's accountant send a sealed report to Indi's conductor (people/indi/accounting/PROTOCOL.md, "The flow", step 3): reaching another person's agent, so tier 3, a question below.

## The data and who may see it

Token counts, times, item names and roles: numbers only, no message text (measure.mjs writes no text). Public in the repository like every ledger today. No contact detail, no person's name beyond Angelo's agents.

## Changes, by owner

| Owner | Change |
|---|---|
| conductor.b@ | ROLES.md: a lead preamble (long session, reads STATE.md first, never ends on its own); the accountant block's reads widened; runs.md: a "Tokens" column (from the ledger, or the platform where it shows it) |
| conductor.b@ | Create `people/angelo/projects/<project>/` per project from Angelo's go |
| policy@ (Angelo asks) | One lane per lead, named in full; one for accountant.b@ (common lanes already cover reports/ and ledger/) |
| Angelo | His go per project; his retire word; the answers below |

## Risks

- **Long sessions cost the most** (conductor.b@'s one session: 7,534,353 total, people/angelo/ledger/, conductor.b's file). Mitigation: the fresh-session rule, STATE.md as memory.
- **Too many voices for Angelo.** Each lead talks to him. Mitigation: the conductor format; conductor.b@'s snapshot lists every lead in one line.
- **Name confusion** with account A's role-first names. Mitigation: option A.
- **Budgets ignored** if they never block. Mitigation: every over-budget run is a line in Angelo's snapshot.

## How we will know it works

- The next project starts with a brief holding all four fields, a lane request Angelo pasted unchanged, and a runs.md line, in one day.
- Every exchange with a lead has a STATE.md commit For: conductor.b@.
- accountant.b@'s first report names the source file of every number, and shows each item's cost against its budget.
- The first retired lead has debrief.md, at least one Lesson in a skill, an archived session and its lane removed.

## Questions for Angelo

1. **Lead names:** `<project>.lead@` (A) or `<project>.<role>@` (B)? *Recommendation: A.*
2. **conductor.fringe@** keeps its name and counts as the `fringe` lead? *Recommendation: yes.*
3. **Budgets** on tokens without cache reads, recorded not enforced, starting at the brief's number? *Recommendation: yes; accountant.b@ proposes numbers after its first report.*
4. **Accountant cadence:** every four hours while work runs, plus on your ask (conductor.b@ starts it), rather than a scheduled task you create (tier 3)? *Recommendation: the four hours via conductor.b@ first.*
5. **Indi's protocol:** send accountant.b@'s report to Indi's conductor (tier 3, another person's agent)? *Recommendation: not now; her accountant may read our ledger, as people/angelo/kit/README.md already says.*
