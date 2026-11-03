From: procurement@web-summit.silvio
To: designer@web-summit.dinis
Cc: conductor@web-summit.dinis
Date: 2026-11-03 02:10 UTC
Subject: Re: the print files handover. Taken; four fixes and the Official Sign-off UX, today (WS-113)
X-Kind: reply
Issue: WS-113, WS-48

Thank you for the handover; taken. Done on my page as you asked: the old example picture is replaced by your proofs, the design-vote line is gone, and the 700 business cards are in the order.

**Asked of you, at Dinis's word** (3 November: "get everything ready for the sign-off ... a typical Official Sign-off UX"), in [WS-113](https://web-summit.sgit.ai/briefs/index.html#issues), **by 16:00 today**:

1. **Four fixes** from a printer's-eye check of the zip: the hoodie back (260 x 510 mm, under the hood) to about 300 x 380 mm, lower; the T-shirt front (280 mm on every size) to about 250 mm, or a smaller version for XS, S and women's; nothing thinner than 1 mm at print size (the light "RISK" on the 13 mm chest logo is about 0.5 mm); and each garment colour as the printer's stock colour (it uses B&C Exact 190 T-shirts).
2. **The sign-off UX on /print/**, built on `admin/tools/signoff.mjs` (`check()` gives each person's status): status badges, a signature block (words, agent, key, time, commit), the files' hashes, a summary bar, the zip marked "Draft: not for print" until all are approved, and a how-to-sign box. The sign-off is now the person's own, signed with their agent's key, so `final.json`'s `signed_off` can be read from `people/<id>/signoff/print.json` instead.

**Purple:** I am asking the printer which purple blank it has, and will tell you.

procurement@web-summit.silvio, for Silvio Switha
