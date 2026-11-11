---
title: "Spec: the handover market (capacity board, package, claims)"
by: spec@PrompTugal.angelo (bravo.large.worker@PrompTugal.angelo), for conductor.b@PrompTugal.angelo
written: 2026-11-11
for: Angelo
issue: WS-208
brief: people/angelo/pipeline/b3-team-offers/brief.md (from b5593420)
status: draft for Angelo
---
# The handover market

**The idea in one line:** when one account runs short of usage, its conductor packages the work, and any teammate's conductor with room claims it within minutes, runs it on their account under our name, and pushes the result back.

## Why
Angelo, 11 November: *"The point of each handover is to get it done as soon as possible, so I think there should be a collaboration element where each conductor is able to claim "outsourced" work depending on their own capacity available, as soon as possible."* Account B hit its five-hour limit at about 13:35 today and lost a run (people/angelo/conductor-b/runs.md, b3 row one). Waiting for a reset wastes the hours; a teammate with room does not.

## Out of scope
Building any of it before Angelo's go; sending the offers; creating board/capacity.json or a board item; changing anyone's schedule or settings.

## 1. The capacity board
**New file, proposed:** board/capacity.json, one row per Claude account. Kept by **every session** on that account, not by the accountant (Angelo: *"let's each have each session update the board"*): a few lines added to every prompt read the session's own rate_limit_info with get_session and write the account's row from a fresh dev in one small commit, at most once every 30 minutes per account.

| Field | Meaning | Source |
|---|---|---|
| account | person and A or B, e.g. angelo.B | declared |
| tier | plan tier, as its person declares it | the person |
| window | five_hour or weekly | rate_limit_info.rateLimitType |
| status | allowed, warning, limited | rate_limit_info.status |
| pct_used | percent used, **only when the platform shows it** | rate_limit_info |
| resets_at | when the window resets (UTC) | rate_limit_info.resetsAt |
| spend_usd, tokens | spend in this window: API-equivalent dollars, tokens without cache reads | people/angelo/ledger/, measure.mjs |
| headroom_usd_est | spend_usd / pct_used x (100 - pct_used), **labelled an estimate** | computed |
| next_awake | which session wakes next on the account, and when | the account's schedules |
| updated_at | time of the write | the session |

**What the platform shows, and what it does not.** This session's own get_session at 14:4x UTC returned only `rateLimitType: five_hour`, `status: allowed`, `resetsAt` (19:40 UTC) and `isUsingOverage: false`: **no percent, and no absolute tokens left**. A percent means different things on different tiers, so the board never compares percents across accounts; it compares estimated dollars. When no percent is shown, the estimate falls back to calibration: the dollars an account spent in a window that reached its limit (account B's this morning, from runs.md and the ledger) minus its spend so far. Both are estimates and say so.

## 2. The package
**New file per offer, proposed:** people/<offerer>/handover/<id>.md (people/vicky/handover/ already exists, for a different use). Angelo's four parts, then what makes it run:
1. **How to create the agent:** a fresh cloud session, session-less (no long session), the model size (large or small), **no schedule**, an environment with no secrets.
2. **The full prompt:** the common preamble, the role, its skills and format from people/angelo/pipeline/ROLES.md, skills/ and formats/, filled in.
3. **The name**, derived as usual: `<project>.<role>.<n>@PrompTugal.<offerer>`, e.g. `b3.spec.1@PrompTugal.angelo`. The name is the offerer's; the run is on the claimer's account, and the first commit says so (`Run-on: <claimer account>`).
4. **Everything else it needs:** repository and branch; the instruction commit and its check (people/angelo/tools/pushed-by.mjs <sha> must say the offerer's person); push only to pool/<id>, never dev; "done when"; size and estimated cost; how to log the run and its cost (admin/tools/agent-log.mjs, people/indi/accountant/measure.mjs); archive the session when done; `For:` the offering conductor.

## 3. The market
- **An offer** is the package plus three fields: cost estimate (USD), size, and "start within" (minutes).
- **Who may claim:** any conductor whose capacity row shows headroom_usd_est of at least **1.5 times** the estimate.
- **How:** extend people/angelo/tools/pool-claim.mjs with an `offer` mode whose claims live on a new branch handover/claims. A claim is a no-force push, so the first claim wins, exactly as pool/claims works today.
- **Lapse:** a claim with no worker's first commit on pool/<id> within **10 minutes** lapses, and the offer is open again (today's pool claims live two hours; offers are shorter on purpose).
- **When conductors look:** at every wake, and whenever their own row shows room.
- **Unclaimed by "start within":** the offerer's conductor tells its person, who decides (wait for the reset, cut the work, or ask someone directly).
- **Results** return as commits on pool/<id>; the offerer's conductor reviews them onto dev as today. The claimer's account is credited in its ledger line (`for_account: <offerer>`).

## 4. Pilot
Dinis's live conductors first (newsroom: board/the-conductors.md in PrompTugal/PrompTugal__News__Website, read only: who wakes how often), and only those waking at least hourly, so a 10-minute lapse can work. Angelo, 11 November: *"from now on, let's delegate to Dinis's agents."* Not read in this run; the pilot list is the next step's work.

## Changes by owner
| Owner | Change |
|---|---|
| Angelo's dev worker | pool-claim.mjs: `offer`, `claim-offer`, the 10-minute lapse, branch handover/claims; tests beside people/angelo/tools/tests/ |
| conductor.b@ | the capacity lines in the common preamble of ROLES.md; a handover format file (formats/handover.md is named in ROLES.md tenet 5 but does not exist yet) |
| Each conductor (theirs to accept) | keep its account's row; read open offers at each wake; credit claimed runs |
| Each person | declare their tier once |

## Risks
| Risk | Guard |
|---|---|
| A claim never starts | 10-minute lapse; the offerer's conductor watches its own offers |
| One person's agent name pushed from another person's login | pushed-by.mjs checks the **instruction**, not the worker's push; the worker's commits carry `Run-on:`; the offerer reviews before dev, as with every pool branch. Policy@'s lane check must accept this case (a question below) |
| Usage read wrong (no percent, stale row) | rows older than 2 hours count as no room; the estimate is labelled; the 1.5 margin |
| Many sessions writing one file | one row each, from a fresh dev, a small commit, retry on refusal (the shared-data rule in people/angelo/kit/README.md) |
| Work in Angelo's name done by another's agent | drafts only on pool/<id>; anything public still needs Angelo's go |

## How we will know it works
- In the pilot week, every package on a short account is claimed within its "start within", and its worker's first commit lands within 10 minutes.
- No run is lost to a usage limit while another account shows room.
- Each claimed run's cost is in both ledgers, and the estimate is within half of the actual.

## Questions for Angelo
1. **Headroom when no percent is shown:** calibrate from the dollars of a window that hit its limit (recommended), or leave the field empty? *Recommend calibrate, labelled an estimate.*
2. **Who keeps a row:** every session on the account, at most every 30 minutes (recommended), or only conductors? *Recommend every session, as you said, with the 30-minute limit to keep commits few.*
3. **Handing work to another person's agents is tier 3** (people/angelo/kit/README.md): is this spec, once approved, your standing go for packages offered to the pilot conductors, or do you want each offer shown to you? *Recommend a standing go for drafts on pool/<id>, nothing public.*
4. **Names pushed from another login:** ask policy@PrompTugal.angelo to accept `Run-on:` commits from the pilot's accounts. *Recommend yes, before the pilot.*
5. **Build order:** pool-claim.mjs and the board first, then the offers. *Recommend this order, one dev worker.*
