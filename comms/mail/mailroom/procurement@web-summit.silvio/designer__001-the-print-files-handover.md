From: designer@web-summit.dinis
To: procurement@web-summit.silvio
Cc: conductor@web-summit.silvio, pm@web-summit.vicky
Date: 2026-11-03 01:20 UTC
Subject: Handover: the print files for the RiskMandate merch are yours to take to the printers
X-Kind: request
Issue: WS-48, WS-63

At Dinis's request (3 November, in designer@web-summit.dinis's session), I hand the merch over to you: the design side is done, and taking it to the printers is your job. Silvio sends every message and confirms every order, as always.

## Where everything is

- **The page for the printers:** https://web-summit.sgit.ai/print/ (one page: the order, the rules, every file per person, and a proof of each set).
- **The zip of everything:** https://web-summit.sgit.ai/team/designer/print/riskmandate-print-files.zip (one folder per person, with a README for the printer).
- **The source:** `team/designer/print/final.json` (the set and the specs) and `data/design.json` (the people, colours and lines), made into files by `team/designer/print/make-print.py`.

## What is in the order

| Item | How many | Print |
|---|---|---|
| T-shirts | 3 per person, 7 colours: 21 | front 280 mm wide, top 80 mm below the collar; back 220 mm wide, top 70 mm below the collar |
| Hoodies | 1 per person: 7 | left chest 90 mm wide; back 260 mm wide, top 90 mm below the collar |
| Business cards | 100 per person: 700 | 85 x 55 mm trim, 3 mm bleed, 350 g/m2 matt, both sides |

Style: the poster style of your own example picture (Dinis's choice, 3 November). Files: SVG and PDF vector at print size with every letter outlined, 300 dpi transparent PNGs for the garments, a 2-page PDF per card. Every QR code was read back from the final files as printed, each its own person's (`team/designer/print/check-print.py`).

## Before you confirm any printer

1. **Dinis has not signed it off yet.** The page says "Waiting for sign-off: do not print yet". The files are final once he signs off on /print/ (person by person, or all at once); I record it in `final.json` and the page flips to "ready to print". Send printers the link now for quotes, but confirm nothing until it flips.
2. **Sizes are missing.** Each person's sizes for 3 T-shirts and a hoodie (WS-48, Vicky and Silvio). Printer C needs them by the end of today, Tuesday 3 November.
3. **Dinis's yes to pay and the spending ceiling** (WS-13), as your brief to him already asks.
4. **Purple:** your note says TH Clothes Ankara has no true purple for Vicky (#6B3FA0). Ask Printer C which purple blank it has; if none, tell me and I will propose the nearest.

## Please change on your page

`content/print-order.md` is yours, so I have not touched the picture:

- **The example picture** (`assets/print/riskmandate-pedido-tshirts.jpg`) still says "WEB SUMMIT 2026" and, in Portuguese, "possible small logo on the sleeve (to be confirmed)". Both are now wrong: **RiskMandate only, nothing on the sleeves** (Dinis, 2 November). Replace it with the real proofs (`team/designer/print/proofs/<id>.svg`, one per person) or remove it.
- **"Before anyone can order"** still waits for "the final line for each person, from the design vote". There was no vote: the final lines are on /print/.
- **Business cards** are in the same pack (700): add them to what you ask the printers, or a card printer of your choice.

## The rules that hold

- RiskMandate only: no sponsor, no other brand, no Web Summit name or logo on anything printed.
- Nothing on the sleeves. Print at 100%, never scaled to fit. Never recolour or crop the QR codes; each person's code goes on that person's items only.
- Never edit the print files by hand. If a printer asks for a change (another format, CMYK, a different size or blank), commit a note with `For: designer@web-summit.dinis` and I make the files again, so the page, the zip and the checks stay true.

## What I am still doing

- Recording Dinis's sign-off and regenerating the files.
- Any change a printer asks for, on request.

designer@web-summit.dinis
