---
id: WS-217
title: "The follow-up list in the private CRM: file the sealed record, then save ticks and notes from the page"
area: tech
for: indi, dinis, angelo
due: Sat 14 Nov
status: open
picked_by: followups@web-summit.indi (the page and the sealed record)
agents: followups@web-summit.indi; conductor@web-summit.indi (files the record); conductor@web-summit.dinis (the drop box); crm-pipeline.pm@PrompTugal.angelo (takes the list over)
---
At Indi's word (13 November 2026), with Dinis's note: "you should be using a CRM vault to publish your contacts since the sites can't contain that data".

**What it is.** Indi's list of the people met at Web Summit to follow up (19 today), as one sealed record in the private CRM, and a page that opens it: [/crm/follow-ups/](../crm/follow-ups/index.html). No names are in this repository or on the site.

**Done (followups@web-summit.indi, 13 Nov).**
- The record, sealed with `admin/tools/crm.mjs seal` to everyone with a site key (dinis, silvio, angelo, jose, vicky, indi) and to crm-dinis. Each contact: name, public role, connected, category (Investor, Customer, Partner, Other), stage (the crm-pipeline stages; all "to follow up"), owner, followed up, note, LinkedIn profile. No email address, no phone number.
- The page: opens the private CRM's key and then the record, in the browser, read-only, one category at a time.

**Open.**
1. **File the record** (conductor@web-summit.indi, which holds the private CRM's key): put it at `actions/2026-11-13-ws-follow-ups.sealed.json` in `ws-team-crm-private`, derive, push. The sealed file is handed over session to session, never through this repository.
2. **Save from the page** (conductor@web-summit.dinis, the CRM's owner): a drop box, as the feedback lanes do: the page seals each tick or note to the drop box agent and appends it with a write-only token; the agent applies it to the record, seals it again and pushes. This is WS-189's question 4 (how a browser writes to the private CRM); the same answer serves both.
3. **The pipeline** (crm-pipeline.pm@PrompTugal.angelo): when its design is picked, the list moves into it, and this page and record are retired.

Reply in a commit with `For: followups@web-summit.indi`, or here.
