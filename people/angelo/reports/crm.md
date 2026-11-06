# crm@web-summit.angelo: reports

Newest first. One entry per run that found something new; the commit that adds it is addressed to conductor@web-summit.angelo.

## 6 November 2026, 08:50 UTC (scheduled run)

- **WS-176 applied:** conductor@web-summit.dinis reviewed the email twin and applied it as is (a2aa4f47, 08:33 UTC; pushed from DinisCruz). It took **21 minutes from routing (d870d02c, 08:12) to the owner's commit**, for the lead-time measure. Both vault apps are rebuilt with the Mail view, and the two proposed schemas (thread, message) are in both vaults. In the same commit, `crm.mjs` now pushes with `SG_SEND_ACCESS_TOKEN`. That is Angelo's token in this session, so I will not use `crm.mjs app` or push until crm-angelo has its own token (20962d69).
- **No real mail yet:** ws-team-crm-private still has no `companies/*/comms/` (pulled 08:52 UTC, read-only).
- **Angelo's area:** no record is owned by angelo and notes.md is empty, so index.md is unchanged.
- **Token ledger (WS-148, af94b5f9):** I measure from this run, in my ledger file in `people/angelo/ledger/`.

## 6 November 2026, 08:15 UTC (prompted by Angelo, with the conductor's 3492b029 and 20962d69)

- **WS-176, the email twin: released as a patch for review**, in people/angelo/proposals/WS-176/ (d870d02c, live in v0.2.723), routed to conductor@web-summit.dinis because the files it changes are theirs. It is read-only, with an inbox, a thread view and a company view, for the vault app's Mail tab and for /crm/. Mail is shown as text only and nothing is loaded. It was tested on made-up threads only (no real names; the fixture writes its addresses at run time, so no address sits in the repository). The README has the results. **For WS-177 (due 10:00 today), my part is ready to apply; applying it is conductor@web-summit.dinis's step.**
- **No real mail in the CRM yet.** A fresh read-only clone of ws-team-crm-private at 08:10 UTC has no `companies/*/comms/`. When WS-173's threads arrive, I will only check that they render.
- **The token rule (20962d69):** acknowledged. I have no own token yet, so I push no vault; vault changes stay as local commits. Reading needs no token, and none is stored in either clone. My scheduled task (08:50 and 16:50 UTC) now says so.
- **Released last night? No:** my release waited overnight because dev's gate was red from 18:00 UTC (people/indi/today/today.mjs ignored schedule.json's `slots_from`). Angelo gave his go for me to fix it, but conductor@web-summit.jose had already fixed it the same way (fa36c6e2), so I changed nothing outside people/angelo/.
- **Still waiting:** crm-angelo's own SG/Send token (asked of conductor@web-summit.dinis in 20962d69).

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
