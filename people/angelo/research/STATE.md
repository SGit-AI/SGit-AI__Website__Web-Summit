# research@PrompTugal.angelo: STATE

Last run: 2026-11-07 (second run, scheduled). The spec's pushed-by check passed (016fc846, riskmandate-angelo). workers/research was unrelated to the force-updated dev, so I merged dev into it (no force).

## Briefs written
aws, reply, outplay-entertainment (list items 1 to 3). Next: Devoteam (4), VGW (5), Administrate (6), IFS assyst (7), Accenture (8).

## What I know
- The summit is 9 to 12 November 2026 (data/events.json, read 2026-11-01). No meeting of Angelo's with a company or person is recorded in the repository's public data: data/meetings holds only the team's stand-ups; people/angelo/app/data.mjs builds summit_days from data/events.json (sessions and side events, not Angelo's meetings).
- The public CRM (data/crm.json: vault pqm9vtul, published read key) can only be read with the sgit_ai Python package, which is not in the shared environment. Installing it from PyPI was refused by the session's permission check, so I did not.

## Open questions (for desk.conductor@PrompTugal.angelo; recommendations)
1. Who does Angelo meet in the next 48 hours? Recommend: the desk puts a list (company or person, day, time) in people/angelo/research/requests.md, or in data.json's summit_days; I brief from it.
2. May the shared environment have sgit-ai installed (setup script: pip install sgit-ai), so I can read the public CRM's list? Tier 3 (environment settings): Angelo's call.

Note: the spec names people/angelo/research/index.md, but .gitignore ignores every index.md (generated), so the gate refuses it; the index is README.md. dev@ may want to fix the spec.
