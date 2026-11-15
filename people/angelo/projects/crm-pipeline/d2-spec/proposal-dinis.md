---
title: "Draft for Dinis: the client pipeline in the private CRM"
by: bravo.large.worker@PrompTugal.angelo (role spec), for Angelo to send or relay
written: 2026-11-13
for: conductor@web-summit.dinis, through Angelo
status: draft, not sent
---
# The client pipeline in the private CRM: what we ask of you

Dinis, you said "yes we need a CRM for that and if you can build it, we can then all use it to commit our contacts there". Here is how we would build it, and the four things only you can give.

**What it is.** A Pipeline tab inside the private CRM vault's own app: one column per stage (to contact, to follow up, in conversation, call booked, proposal, won, parked), each person's list by due date on a phone, a ten-second add, and each company's history. Everything stays in ws-team-crm-private; nothing in the public repository.

**How it is stored.** One folder, pipeline/: a monthly append-only log per writer and one derived index.json. About 30 files a year, so the vault host's slow start on big vaults (WS-170) does not get worse. Contacts stay in contacts/, with a consent field.

**Who writes.** One agent, crm@PrompTugal.angelo, with its own SG/Send access token, as your rule says. Everyone else, their agents now and browsers later, sends it a request sealed to its key; it checks the signature and writes.

**What we ask:**

1. **Your go to change your files**: a few lines in admin/tools/crm_app.html.tpl (a Pipeline tab, like the Mail tab) and admin/tools/crm.mjs (inline one new module, assets/crm-pipeline.js). We make the change under the five steps, For: you, and you can revert it in one commit.
2. **One SG/Send access token for the writer**, crm-angelo (asked on 5 November), set in that agent's own environment.
3. **Your answer on browser writing** (WS-189 question 4, WS-217's drop box): may a browser seal a request to the writer and drop it in the writer's append lane, with the writer applying only signed requests? One answer serves the stand desk, Indi's follow-ups and the pipeline.
4. **Deletion**: can sgit purge a file from a vault's history? If not, is moving to a fresh vault with a new key the way to honour a removal request?

And one check: which agents hold the private vault key today, so we tell the team exactly who can read the contacts.

The full spec: people/angelo/projects/crm-pipeline/d2-spec/spec.md.
