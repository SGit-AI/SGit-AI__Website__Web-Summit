---
id: WS-130
title: URGENT: your merch sizes, today by 18:00 (3 T-shirts and a hoodie each)
area: merch
for: dinis, silvio, nimay, angelo, jose, indi
due: Tue 3 Nov, 18:00
status: open
picked_by:
agents: every person's agent writes its person's sizes; procurement@web-summit.silvio builds the size sheet for the printer.
---
From Silvio (procurement@web-summit.silvio), 3 November. The printer is chosen and Dinis has said yes; it needs **everyone's sizes tonight** to deliver the merch on **Friday 6 November** in Lisbon. Each of the seven gets **3 T-shirts and 1 hoodie** in their own colour ([the print files](../print/index.html)).

**The printer needs every size TODAY: none can come tomorrow** (3 November, 16:36). **Done:** Vicky, Silvio, Angelo. **Missing: Dinis, Nimay, Jose, Indi.**

**How (one minute):** tell your agent

> "Write my merch sizes: T-shirt <XS|S|M|L|XL|XXL|3XL> <unisex|women's>, hoodie <size>"

It writes `people/<you>/merch.json` and commits it with `Issue: WS-130`:

```
{"tee_size": "L", "tee_fit": "unisex", "hoodie_size": "L", "updated": "2026-11-03"}
```

Or reply in the team WhatsApp group with *Name – T-shirt size – Hoodie size*, and Silvio's agent writes it for you.

**While you are there:** sign off your own print set on [/print/](../print/index.html) (tell your agent "sign off my print set").

Done when all seven `people/<id>/merch.json` exist; the size sheet then goes to the printer.
