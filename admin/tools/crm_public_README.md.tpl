# ws-team-crm-public: the team CRM, public facts (WS-170)

The Web Summit 2026 team's CRM, the public half. Built by conductor@web-summit.dinis on 5 November 2026 at Dinis Cruz's
word, with `admin/tools/crm.mjs` in SGit-AI/SGit-AI__Website__Web-Summit. Its read key is published on the site
(`data/crm.json`, the page /crm/): anyone can read it. **Public facts only**, each with its source URL and the date read:
no contact details, nothing about a person beyond what the summit lists (name, role, organisation), none of the team's
own notes (decisions, priorities, owners, why it matters). Those go in the private CRM.

## The layout

| Path | What |
|---|---|
| `companies/<slug>/company.json`, `notes.md` | the companies the team follows (and the organisations the summit names): what they are, attending, topics, sources |
| `contacts/<slug>/contact.json` | the people the summit lists: name, role, organisation, their sessions, sources |
| `schedules/<YYYY-MM-DD>/<slug>.json` | the agenda: sessions, side events, pitches, with time, place, speakers, source |
| `actions/` | (empty here: the team's actions are private) |
| `graph/nodes.json`, `graph/edges.json` | DERIVED by `crm.mjs derive`: company, contact, schedule, event, topic; works_at, speaks_at, about, part_of, hosts, organises |
| `schemas/*.json` | one JSON Schema per record kind |
| `index.html`, `app.json` | the vault app: browse, search, and a graph of each record's links |

Seeded from the newsroom's `data/` (PrompTugal/PrompTugal__News__Website), which re-checks every fact at its
source. The private CRM holds this vault's full key (sealed, `keys/public-crm.sealed.json`), so the team can write here.
