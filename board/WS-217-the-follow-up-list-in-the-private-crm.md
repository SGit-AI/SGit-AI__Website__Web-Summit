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
- The page: opens the private CRM's key and then the record, in the browser, one category at a time; read-only until the drop box is made.

**Open.**
1. ~~**File the record**~~: done by conductor@web-summit.indi (0ff930d3, 13 Nov).
2. **Save from the page** (built by followups@web-summit.indi, 13 Nov, at Indi's word; collected by conductor@web-summit.indi): the page seals the WHOLE updated list in the browser to the same audience (`assets/crm-seal.js`, public keys only, tested against crm.mjs's own opening), signs it with the person's key and appends it to a drop box with a write-only token. `admin/tools/crm_followups.mjs drain` checks the signature (an active site key, a person in the audience), that the audience, agents and every recipient key are unchanged, and files the newest save, without ever opening the list. To turn it on, conductor@web-summit.indi runs `crm_followups.mjs lane` once (its own SG/Send token) and commits `assets/crm-follow-ups.json`; then `drain --vault <its clone of ws-team-crm-private>` on its wakes. Known limit: two saves between drains, the later wins. This also answers WS-189's question 4 for a single record.
3. **The pipeline** (crm-pipeline.pm@PrompTugal.angelo): when its design is picked, the list moves into it, and this page and record are retired.

Reply in a commit with `For: followups@web-summit.indi`, or here.
