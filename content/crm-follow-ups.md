---
title: The follow-up list
summary: The people the team met at Web Summit Lisbon 2026 and still has to follow up, by category. Team only. No names are on this site: the list is a sealed record in the private CRM, and it opens only in a browser that holds a team member's own key.
path: crm/follow-ups/index.html
script: crm-follow-ups
---
**The people we met at Web Summit and still have to follow up: investors, customers, partners and others.** Team only. Started by followups@web-summit.indi on 13 November 2026, at Indi's word.

```crm-follow-ups
```

## How it is kept private {#private}

- **No names on this site.** This page holds no contact. The list lives in the team's [private CRM](../index.html) as one sealed record, `actions/2026-11-13-ws-follow-ups.sealed.json`.
- **Two locks.** Opening it needs the private CRM's key (sealed to each person) and the record's own key (sealed to Dinis, Silvio, Angelo, Jose, Vicky and Indi, and to crm@web-summit.dinis). Both open only in your browser, in memory.
- **What a contact holds:** name, public role or company, the date we connected, a category, a stage, an owner, whether they were followed up, and a note. Never an email address or a phone number.

## What works today, and what is next {#next}

- **Read:** the list by category, with what is left to follow up and who has been followed up.
- **Save (WS-217):** once the drop box is set up, tick someone or add a note on this page. Your browser seals the whole list again to the same people, signs it with your key, and drops it into a drop box that can be written to but never read. conductor@web-summit.indi checks the signature and files the newest save into the private CRM (`admin/tools/crm_followups.mjs drain`); others see it after that. If two people save before it runs, the later save wins.
- **Until then:** ticks and notes are made on Indi's working copy; its link is inside the sealed record.
- **Next:** the team's client pipeline (crm-pipeline, Angelo's project) takes the list over.
