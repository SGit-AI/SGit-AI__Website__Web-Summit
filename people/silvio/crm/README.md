# Silvio's companies, staged for the public CRM (WS-170, WS-172)

Kept by crm@web-summit.silvio, from 5 November 2026. The public CRM (`ws-team-crm-public`, read key in `data/crm.json`) was read on 5 November 2026 at 17:19 UTC (graph derived at that time) and compared with Silvio's three lists:

| List | Companies | In the public CRM | Missing, staged here |
|---|---|---|---|
| The 50 targets (`people/indi/overnight/2026-11-04/ws-26-outreach-targets/targets.json`) | 50 | 50 | 0 |
| The 50 buyers (`people/silvio/outreach/buyers.json`) | 50 | 9 | 41 |
| The 38 not at Web Summit (`people/silvio/outreach/online.json`) | 38 | 0 | 38 |

`public/companies/<slug>/company.json` and `notes.md` are the 79 missing records, in the public CRM's layout and schema, ready to copy into the vault. This agent cannot push them itself yet: writing the public CRM needs its vault key, which is sealed in the private CRM (`keys/public-crm.sealed.json`).

**What they hold:** public facts only, each with its source URL and the date read: the name, whether the company is listed at Web Summit Lisbon 2026 (the lis26 partner, appearance or speaker page), and, for the ones not at Web Summit, the AI facts read on the company's own site (with its sector, country and website). Not here, on purpose: why we want them, priorities, owners, channels (those are the team's own notes, for the private CRM), and never a contact detail. Where no public page was read for what a company is (25 of the 38, marked "sector fit" in `online.json`), `category`, `country` and `website` are left empty with a `to_source` note. 'Novo' is listed by Web Summit under that name only; which company it is has not been verified, so it has no website or country.

**To move them in** (whoever holds the public CRM's vault key):

    cp -r people/silvio/crm/public/companies/* <ws-team-crm-public>/companies/
    node admin/tools/crm.mjs derive public    # then commit and push the vault

The graph is derived in the vault from the records, so it is not kept here.

## 6 November, morning run

crm@web-summit.dinis has the 50 buyers, fuller than these (what each does, AI flows, people and sessions as websummit.com lists them), committed in its local clone of the public CRM and not pushed yet (its commit 1781ccd, waiting for its own token); it also verified that "Novo" is Novo Nordisk. So when that push lands, its 41 buyer records win and the 41 staged here are dropped. The 38 companies not at Web Summit (`online.json`) are still only here. The private CRM's key is not sealed to crm-silvio yet, so no actions yet; no outreach or inbox commit has reported a sent email, a reply or a meeting since 5 November 17:30 UTC.
