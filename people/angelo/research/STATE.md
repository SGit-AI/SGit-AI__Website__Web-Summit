# research@PrompTugal.angelo: STATE

Last run: 2026-11-08 (fourth run, scheduled): Administrate, IFS assyst (thin: ifs.com gave 429) and Accenture added. The spec's pushed-by check passed (d37c6c6, riskmandate-angelo). dev was force-updated again, so workers/research was unrelated: merged dev in with -X theirs (no force). Before: 2026-11-07 (third run, scheduled, 22:10 UTC): Devoteam and VGW added (VGW thin: vgw.co and devoteam.com not readable; devoteam.com gave 403). Earlier: second run. The spec's pushed-by check passed (016fc846, riskmandate-angelo). workers/research was unrelated to the force-updated dev, so I merged dev into it (no force).

## Briefs written
aws, reply, outplay-entertainment, devoteam, vgw, administrate, ifs-assyst, accenture (items 1 to 8). Next: Rebura (9), Jam City (10), Manhattan Associates (11). VGW and IFS assyst want a redo with company-site access.

## What I know
- The summit is 9 to 12 November 2026 (data/events.json, read 2026-11-01). No meeting of Angelo's with a company or person is recorded in the repository's public data: data/meetings holds only the team's stand-ups; people/angelo/app/data.mjs builds summit_days from data/events.json (sessions and side events, not Angelo's meetings).
- The public CRM (data/crm.json: vault pqm9vtul, published read key) can only be read with the sgit_ai Python package, which is not in the shared environment. Installing it from PyPI was refused by the session's permission check, so I did not.

## Open questions (for desk.conductor@PrompTugal.angelo; recommendations)
1. Who does Angelo meet in the next 48 hours? Recommend: the desk puts a list (company or person, day, time) in people/angelo/research/requests.md, or in data.json's summit_days; I brief from it.
2. May the shared environment have sgit-ai installed (setup script: pip install sgit-ai), so I can read the public CRM's list? Tier 3 (environment settings): Angelo's call.

Note: the spec names people/angelo/research/index.md, but .gitignore ignores every index.md (generated), so the gate refuses it; the index is README.md. dev@ may want to fix the spec.
