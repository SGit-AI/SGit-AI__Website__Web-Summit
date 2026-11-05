# crm@web-summit.angelo: reports

Newest first. One entry per run that found something new; the commit that adds it is addressed to conductor@web-summit.angelo.

## 5 November 2026, 17:35 UTC (prompted by Angelo)

- **Angelo has an area in the private CRM**: `people/angelo/` in ws-team-crm-private, at Angelo's word ("Folder in private CRM", his choice in this session). It holds README.md (what the area is for, who keeps it, who can read it), index.md (Angelo's records across the CRM, which I rebuild each run; empty for now) and notes.md (his working notes, which I turn into actions when they become one). Pushed, and confirmed in a fresh clone.
- **Angelo's actions stay in `actions/`**, with `owner: "angelo"`, so `crm.mjs derive` and /crm/ keep finding them. derive reads only companies/, contacts/, actions/, schedules/ and keys/, so the new folder does not touch the graph.
- **Readers:** everyone with the vault key, because layer 2 is paused (bc8e2187). Angelo has been told.
- **My scheduled task (08:50 and 16:50 UTC) now also rebuilds index.md.**

## 5 November 2026, 17:20 UTC (prompted by Angelo, with the conductor's 5e43828)

- **The private CRM's key is open.** The conductor's 5e43828 was pushed from riskmandate-angelo (`pushed-by.mjs`). Its sealed link in `data/sealed/agents/crm@web-summit.angelo/` was signed by `sha256:f34e311a93db5ddb`, which is conductor-angelo on the keys page. I opened it with my session key into `~/.sg-send/crm/` (0600). It was never printed.
- **Both CRMs are cloned with write access.** `ws-team-crm-private` (`5n0aocvz`) uses the sealed key. `ws-team-crm-public` (`pqm9vtul`) uses its vault key, which I took from the private CRM's `keys/public-crm`. That record is under layer 1 only, so the conductor@web-summit.dinis audience change asked for in 5e43828 is not needed for my access.
- **Writing works in both.** I added one test record to each vault, with no real names: a company `crm-angelo-write-test` in the public CRM (its source is /crm/), and an action `2026-11-05-crm-angelo-write-test` in the private one. I ran `crm.mjs derive`, then committed and pushed. Fresh clones confirmed both records: the public one with only the published read key, the private one with the vault key. I then removed both, derived again and pushed. Fresh clones show both gone. The public graph is back at 781 nodes and 1,025 links, as /crm/ states.
- **For the tool's owner (conductor@web-summit.dinis):** `admin/tools/crm.mjs` needs `~/.sg-send/crm/vaults.json`, which only `create` writes. An agent that opens a sealed key has to write that file by hand (`{public|private: {name, dir, vault_id}}`, with no key in it). The `AGENT` constant also names conductor@web-summit.dinis as every record's `updated_by`; the change would be to take it from the environment. These are notes only, not changes.
- **Scheduled task set, at Angelo's word:** 08:50 and 16:50 UTC (cron `50 8,16 * * *`), into this session. The first run is 6 November at 08:50.
- **Not done:** no real CRM records yet. Angelo's actions and requests come next, from the conductor's work.
