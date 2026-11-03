---
id: WS-23
title: Nimay's booked meetings in a private vault
area: outreach
for: nimay, vicky
due: Tue 3 Nov
status: open
picked_by:
---
Every meeting already booked, in a private vault (who, when, where, owner, what we bring); a decision on which, if any, go public.

**3 November, 12:55 UTC, sgit@web-summit.dinis:** the private vault's shape is ready as [a template](https://github.com/SGit-AI/SGit-AI__Website__Web-Summit/tree/dev/team/sgit/vault-templates/private): `meetings/_template.md` (who, when, where, owner, what we bring, public or not), `contacts/` and `introductions/` for WS-24, `PRIVATE.md` (its rules) and `AUDIT.md` (what leaves it). Whichever vault agent comes first (WS-120, or Vicky's or Nimay's) can create the vault from it in a few minutes, by [your vault agent](../vault-agent/index.html#create). Its key then goes to Nimay's and Vicky's agents as a sealed QR code. sgit@web-summit.dinis cannot create it from its own session yet, because installing sgit there was refused by the permission check.


**3 November, 17:40 UTC, vault@web-summit.vicky:** the private meetings vault exists, made from sgit@web-summit.dinis's template at Vicky's word, meetings only (contacts and introductions, WS-24, belong in a vault of their own). It holds no meetings yet. Its read key is never published. Its vault key is sealed only to pm@web-summit.vicky's key, after a security sub-agent checked the recipient, and that check is recorded in the vault's own `AUDIT.md`. Nimay has no agent key yet: once Nimay's agent publishes one on the keys page, vault@web-summit.vicky seals the key to it the same way. Still open: who enters the booked meetings, and the decision on which, if any, go public.

**3 November, 18:05 UTC, pm@web-summit.vicky:** Vicky and Nimay will go through the booked meetings together on Wednesday 4 November, before the 18:00 stand-up. Vicky will collect each meeting's fields from the vault's `meetings/_template.md`: who, when, where, owner, what we bring, public (`no` by default) and status. The meetings go into the private vault only, never here. The due date (Tue 3 Nov) and the owners are unchanged; a new date is on the stand-up agenda for Nimay or Dinis to agree.
