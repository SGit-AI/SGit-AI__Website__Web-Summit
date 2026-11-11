---
title: "b3-team-offers: the handover market spec, and two offers to the team"
item: b3-team-offers
by: conductor.b@PrompTugal.angelo (intake)
written: 2026-11-11
role: spec
size: large
skills: writer, analyst, plain-language (+ always-on)
format: web-summit-site
go: Angelo, 11 Nov (his words below)
---
# b3-team-offers

## Angelo's words (11 November)
- Capacity: *"I like the capacity board idea"*; *"Can we distinguish between percentages of usage left, which might mean very different things depending on the account tier, and actual tokens/usage left?"*; *"I'm not sure the accountant is a good fit if it runs every 4 ours, so yeah, let's each have each session update the board."*
- The market: *"The point of each handover is to get it done as soon as possible, so I think there should be a collaboration element where each conductor is able to claim "outsourced" work depending on their own capacity available, as soon as possible."*
- The package: *"how the other persons' conductor has to create the agent (session-less, what model, no schedule, etc); the full prompt including skill, and craft; the name, which is derived from above like usual, and @PrompTugal.angelo; other necessary info so that it works as you make it work."*
- Now: *"When we are short on usage, we start delegating to others, like right in this very moment. So from now on, let's delegate to Dinis's agents."*
- The offers: *"I think we should make 2 offers to each members of the team: 1. our conductors/pms/workers approach as a suggestion to consider and get feedback on; 2. the handover market model as a request to help members of the team that are short on usage."*
- He reads little: *"That's A LOT of text to read."*

## What to write (all in people/angelo/pipeline/b3-team-offers/)
1. **spec-handover-market.md** (kit's spec shape, under about 120 lines, status "draft for Angelo"):
   - **The capacity board:** board/capacity.json on this site, one row per Claude account; refreshed by every session that runs on that account (a few lines every prompt adds: read your own session's rate_limit_info with get_session, write your account's row from a fresh dev in one small commit). Row: account (person and A/B), plan tier (declared by its person), window (five_hour or weekly), status, percent used where shown, reset time, spend measured in this window (API-equivalent dollars and tokens without cache reads, from the ledger), **estimated headroom in dollars** (spend / percent used x percent left, labelled an estimate), who is awake next and when, updated at. Say plainly what the platform shows and what it does not (no absolute tokens left).
   - **The package** (people/<person>/handover/<id>.md): Angelo's four parts plus what makes it run: environment with no secrets, repository and branch, model size, no schedule, the instruction commit and its pushed-by check, the branch to push to (pool/<id>, never dev), done when, estimated cost, how to log the run and its cost, archive when done, For: the offering conductor. The agent's name is the offerer's (<project>.<role>.<n>@PrompTugal.<offerer>), run on the claimer's account, and says so.
   - **The market:** an offer has a cost estimate, a size and "start within"; any conductor whose row shows headroom of at least 1.5 times the estimate claims it with a no-force push (extend people/angelo/tools/pool-claim.mjs: claims on the branch handover/claims), first claim wins; a claim lapses if no worker started within 10 minutes; conductors read open offers at every wake and when their row shows room; unclaimed by "start within": the offerer's conductor tells its person. Results return as commits on pool/<id>; the claimer's account is credited in the ledger.
   - **Pilot:** Dinis's live conductors first (board/the-conductors.md in PrompTugal/PrompTugal__News__Website, read only: who wakes how often; only those waking at least hourly).
   - Changes by owner, risks (a claim never started; a name from one person's agents pushed from another's login; usage read wrong), how we will know it works, questions for Angelo with recommendations.
2. **offer-1-our-approach.md**: a short note for every team member and their conductor (data/team.json for who), **a suggestion asking for feedback**: Angelo's conductor, project managers and session-less workers; the prompt library (role + skills + format), every agentic activity in commits, costs measured. What worked today, with numbers from people/angelo/conductor-b/runs.md (three workers, minutes each, cost each). Links to ROLES.md, skills/, formats/. Three questions for their feedback. One phone screen, then the links. Written for Angelo to send as his own words: plain, no jargon unexplained, no em-dash.
3. **offer-2-handover-market.md**: a short note for every team member and their conductor, **a request**: help teammates who are short on usage by claiming their packaged work when you have room; how it works in five lines; what we ask of each conductor (keep your account's capacity row; read open offers at each wake); that Angelo's side starts with Dinis's conductors as the pilot. One phone screen, then a link to the spec.
4. **summary.md**: one phone screen for Angelo: the three files in five bullets, and his questions with recommendations (including how to deliver the offers: a board item for everyone and a commit For: each person's conductor, after his go).

## Out of scope
Posting or sending anything; creating board/capacity.json or any board item; writing outside this folder (and your estimates and ledger lines). Angelo's go comes first.

## Done when
The four files on pool/b3-team-offers, the gate OK, no em-dash, every path named exists, STATE.md says "ready for Angelo's read".
