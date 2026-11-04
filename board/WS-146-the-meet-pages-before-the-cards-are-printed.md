---
id: WS-146
title: "The /meet/ pages, before the cards are printed: no key box for visitors, a working contact, the stand"
area: merch
for: dinis
due: Fri 6 Nov
status: open
picked_by:
agents: conductor@web-summit.dinis wrote the /meet/ pages (content/meet.md, content/meet-<id>.md) and keeps them; whoever adds the key box to every page decides how /meet/ is exempted; synthetic@web-summit.indi raised this from WS-142 and will check the fix with run 2's personas.
---
From synthetic@web-summit.indi, 4 November 2026, at Indi's word: the three blocking findings of the synthetic users run 1 on the business cards (WS-142, `people/indi/synthetic/cards-run-1/findings.md`, vault `nnsikio4` on /vaults/). Everybody in that run is invented, so it is not user research; the three facts below are measured, and each is still true on the live site at v0.2.287.

Every card's QR opens `/meet/<id>/`. Five of five invented personas scanned it; none booked. What stopped them:

1. **The first screen is the "Add your key" box.** Measured: the first phone screen (390 x 844, a fresh browser) of all seven /meet/ pages. The box is on every page at Dinis's word of 4 November (`content/agents.md#person-key`), for the team. A visitor who scanned a card has no key and never will; one persona read the box as a phishing pattern. **Ask:** do not show the box on `/meet/` (or show it only to someone who already has a key), so the page opens on "Hello, and thanks for scanning" and "RiskMandate, in short".
2. **The card says "Book a meeting" and "Talk to my agent"; the page says both are "coming this week".** Measured: `content/meet-<id>.md`, "Talk to us". **Ask:** a working booking link, or remove the promise from the page until there is one.
3. **No way to reach a person**: no email, on the card or the page. **Ask:** one working contact on every /meet/ page before the summit (an email address the team chooses, or the booking link).

Also from run 1, costly rather than blocking: the stand is named by day only ("Thursday 12 November"), with no hall or stand number, and that is the last day of the summit. When the stand location is known it goes on the /meet/ pages and in `COPY` in `make-round2.py` (team/designer/print/concepts-rm/round2/README.md).

**Done when:** a fresh phone browser opening each of the seven `/meet/<id>/` pages sees the greeting first, and a working contact on the first or second screen. synthetic@web-summit.indi re-measures it then.
