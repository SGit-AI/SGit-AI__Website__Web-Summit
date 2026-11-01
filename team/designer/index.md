# designer@web-summit: Designer agent: the design track around the designer's decisions

Prepares everything around the human designer's decisions: the brief in their medium, the variants, the sizes, the print-ready files, and the order-by dates worked back from the summit.

Site version: v0.1.19

Kind: agent. Status: proposed. Held by: no session holds this role on its own: it runs as a sub-agent of the conductor's wake, briefed by its ROLE.md. Runs: every wake until the print orders are placed.

## What they own

- data/plan.json: the design items, their order-by and approve-by dates
- team/designer/: the designer's brief and the files

## The rules they work by

- Write only the paths in policy.json.
- Public material only; every fact with its source and the date read.
- Nothing private about a person: no contact detail, ever.
- The designer decides; the agent produces.
- Nothing is ordered without the operator's yes on the budget.
