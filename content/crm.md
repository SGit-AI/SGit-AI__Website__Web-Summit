---
title: The team CRM
summary: Two vaults, one layout. The public CRM holds public facts about the companies, people and sessions of Web Summit Lisbon, each with its source, and its read key is published here. The private CRM holds the team's own records; its sensitive records are sealed a second time, to the people who may read them, so opening one needs the vault key and your own key.
path: crm/index.html
script: crm
---
**A CRM for the team: companies, contacts, actions and schedules, a folder each, and a graph that links them.** It lives in two SGit vaults, like the observability vaults: a **public CRM** anyone can read, and a **private CRM** for what not everybody needs to see. Built by conductor@web-summit.dinis on 5 November 2026 (WS-170), seeded with public information first.

```crm
```

## The two CRMs {#two}

| | Public CRM | Private CRM |
|---|---|---|
| Vault | `ws-team-crm-public` | `ws-team-crm-private` |
| Who reads it | anyone: its read key is published ([data/crm.json](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/blob/dev/data/crm.json)) | the team: its key is sealed to each person and their conductor |
| What goes in | public facts only, each with its source URL and the date read | the team's own records: actions, requests, later the non-public details of contacts |
| Seeded with | the newsroom's companies, organisations, the people the summit lists (name, role, organisation) and the agenda | the six open requests from WS-165, and the public CRM's own vault key |

## The layout {#layout}

Both vaults use the same folders, so a record can move from one to the other:

- `companies/<slug>/company.json` and `notes.md`: what a company is, where it is from, whether it is at the summit, its topics, its sources.
- `contacts/<slug>/contact.json`: a person. In the public CRM only what the summit lists: name, role, organisation, their sessions. Never a contact detail.
- `actions/<YYYY-MM-DD>-<slug>.json`: something to do: kind, owner, due, state, the company and contact it is about, the next step, links.
- `schedules/<YYYY-MM-DD>/<slug>.json`: sessions, meetings, stand times.
- `graph/nodes.json` and `graph/edges.json`: derived from the records (`node admin/tools/crm.mjs derive`): companies, contacts, schedules, events, topics, actions; linked by works_at, speaks_at, about, part_of, hosts, organises, owns.
- `schemas/*.json` (one per record kind), `README.md`, and `index.html`: the vault's own app, to browse, search and see the graph.

Every record carries its id, its sources (url and when read) for public facts, when it was updated and by whom.

## Two layers of encryption {#layers}

1. **The vault (layer 1).** A vault is encrypted with its key. The public CRM's read key is published on purpose. The private CRM's key is sealed to each person's own key (it appears in their For you panel and opens on this page) and to their conductor agent's key.
2. **The record (layer 2).** Inside the private CRM, a sensitive record is stored as `<name>.sealed.json` (envelope `ws-crm-env-1`): the record is encrypted with its own random key, and that key is sealed to each person in the record's **audience**, with the same keys and the same steps as everything else sealed to you on this site. So reading it needs **both** the vault key **and** your own key; with the vault key alone you see that a record exists, its kind and who it is for, never what it says. Agents can be in an audience too, with their own keys.

Who can read a record can change: `node admin/tools/crm.mjs reseal --audience dinis,silvio <file>` seals it again under a new key. The six seeded requests are sealed to Dinis and each request's owner; the public CRM's vault key is sealed to everyone with a site key.

## For an agent {#agents}

- Read the public CRM with the read key in `data/crm.json`; clone it with `sgit clone <read key>:<vault id>`.
- The private CRM's key is sealed to your conductor in `data/sealed/agents/<agent>/` (sgit hybrid v2, signed by conductor@web-summit.dinis; open it with `sgit pki decrypt`).
- `admin/tools/crm.mjs`: `seal`, `open`, `reseal`, `audience`, `derive`, `seal-keys` (see the top of the file). Public facts only in the public CRM, each with its source; no contact details, ever, in either repository.
