# WS-36: a conductor of conductors, a draft

By dev@web-summit.angelo, 5 November 2026, 22:35 UTC wake, from the conductor (f4565d64, item 4), starting from Angelo's protocol (`people/angelo/kit/README.md#protocol`), as asked. Nothing is applied. Jose reviews.

WS-36 asks how the agents in everyone's accounts coordinate: who opens what, how they talk, and how a stuck agent is noticed. Measured on `dev` (the commits since 4 November) before proposing anything:

| What | Measured |
|---|---|
| Messages from one person's agents to another person's (`For:` lines) | 320: **257 through a conductor**, 63 directly agent to agent |
| The direct ones | Mostly specialist pairs: Vicky's newsroom desks to newsroom@web-summit.dinis, Jose's watcher to security@web-summit.dinis, dev agents to each other (patches to an owner) |
| Between conductors | 107, nearly all to or from conductor@web-summit.dinis: it is already the hub of hubs |
| Written protocols | Angelo's kit has one (the hub, three tiers, a check on who pushed, reports in commits, run logs). Jose's kit names one. The other six kits have none |
| A stuck agent | `/wakes/` already marks a scheduled run as **missed** (its slot passed more than an hour ago with no commit after it), and quiet runs show in the run log (WS-160) |

So the team already works as a conductor of conductors. What it lacks is the protocol written down for everyone, and a way to see a request one conductor sent another that is still waiting.

## Proposal: not a new agent, three rules and one view

1. **Every person's conductor is their hub.** Each kit gets the protocol Angelo's has, adapted by its own conductor:
   - work in commits, with a check that the commit was pushed from the person's account;
   - reports in commits;
   - three tiers (just do it; do it and tell the owner; only with the person's own word);
   - shared code routed to its owner, never applied (`Routed:`);
   - run logs (WS-160).

   The template is Angelo's section, which works today. The check on who pushed is `people/angelo/tools/pushed-by.mjs`, which pages through GitHub's activity API (fixed in a3dc0f41). Moved to `admin/tools/`, every conductor could use it.
2. **conductor@web-summit.dinis is the conductor of conductors,** as the traffic already shows. Across people:
   - a request that needs a decision goes conductor to conductor;
   - routing work to a file's owner, or a desk to its newsroom, may go agent to agent, copying the sender's conductor (`For:`) when it asks for anything beyond the owner's own file.
3. **A request between conductors is answered within one wake of the receiver** (hourly for most conductors): done, refused with why, or "received, by <time>". Silence past two wakes is a stuck conductor.
4. **One view: "Waiting between conductors".** On `/wakes/` or the board's health page, list every commit `For: conductor@web-summit.<x>` from another conductor that conductor x has not answered since. An answer is a later commit from x naming the same sha or issue. Show it with its age, red after two of x's wakes. Built from the git log like `/wakes/`, with no new data.

## What would change, and whose it is

| Change | Whose |
|---|---|
| The protocol in each kit (`people/<id>/kit/README.md`) | Each person's conductor, with its person's yes (tier 3: it changes how their agents behave) |
| `pushed-by.mjs` to `admin/tools/` | conductor@web-summit.dinis (the tools); Angelo's conductor, whose tool it is now |
| Rules 2 and 3, in `content/agents.md` | conductor@web-summit.dinis, with Dinis's word |
| The "Waiting between conductors" view (`admin/build/build.mjs`) | conductor@web-summit.dinis; I can draft the patch once the rules are agreed |

**Recommendation:** agree rules 2 and 3 at a stand-up (one decision item, Dinis's call), and I draft the view's patch. Then, for each person, their conductor offers the protocol to its person.
