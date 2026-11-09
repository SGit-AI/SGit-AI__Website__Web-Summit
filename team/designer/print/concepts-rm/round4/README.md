# RiskMandate business cards, round 4: three audience cards, no names

**Redesigned on 5 November 2026 by designer@web-summit.dinis, at Dinis's word (design A of the design pass):** every front on the container #161615 with the key line in the lighter green #22C55E, the audience coded by a 3.5 mm bar along the bottom (gold #B45309, green #1A7F5A, blue #1D4ED8) and by the same colour as the back's right-hand panel; "RISK MANDATE.ai" and the knockout seal on the front; the brand lockup (the containered seal and the "RiskMandate" wordmark from the lockup EPS) and riskmandate.ai on the back; the back in a 3 mm safe area with larger type and a 26 mm QR. Executives' colour is now gold (it was the container). The tables below describe the first version. `check-concepts.py <scratch> round4`: 6 sides, OK.

By designer@web-summit.indi, 4 November 2026, at Indi's word. **No individual names.** There are three cards, about 200 of each, one per kind of person the team meets at Web Summit. Each card has the team's chosen main line, much bigger than its tagline. The audience is never printed: each card is colour-coded, so the team knows which one to hand over.

| Card | Colour code | Main line | Tagline | Source |
|---|---|---|---|---|
| Executives | Container black #161615 (C0 M0 Y5 K91) | Do you know what your agents are doing? | Clarity. Control. Confidence. | T1 shirt front, `final.json` |
| GRC (governance, risk and compliance) | RiskMandate green #1A7F5A (C80 M0 Y29 K50) | Know their reach. Define their mandate. Control the gap. | Govern AI. Grow with Confidence. | T8 shirt front |
| Security professionals | RiskMandate blue #1D4ED8 (C87 M64 Y0 K15) | Your AI has access. Does it have permission? | AI Agents. Your Rules. | T9 shirt front |

- **Front:** the code colour, full bleed. The main line in Barlow Condensed ExtraBold capitals (the shirts' voice), 24.5 to 28.8 pt; the tagline in Geist at 9 pt, about a third of the size; then RISK MANDATE.
- **Back:**
  - **Left, on white:** the seal and RISK MANDATE, then "AGENT BEHAVIOUR POLICIES" and what RiskMandate does (the brand's own line). Below that, Web Summit Lisbon, Thursday 12 November and the stand.
  - **Right, in the code colour:** the team QR on its own white panel, and the URL.
- **QR:** the team's, unaltered (`team/designer/qr/qr-meet.svg`), to https://web-summit.sgit.ai/meet/, the page listing all seven. A card no longer carries a person.
- **Why these colours:** all three are RiskMandate's own (the mark's container, the brand green, the brand blue), so the cards add no new hue. Black, green and blue also stay apart for the common kinds of colour blindness. The seal never sits on the colour: on the front it is RISK MANDATE in words; on the back the mark sits on white, clear of the colour.
- **One page with all three:** `../cards-overview-round4.pdf` (A4 landscape).

## Before print

- **Web Summit edition and the stand** (Indi, 4 November, evening): every front carries "WEB SUMMIT EDITION" small, on the wordmark's line; every back reads "Meet us between Booths A1-30" under Thursday 12 November, in place of the placeholder. The event is written "Web Summit", as everywhere on the site.
- **Quantities:** about 200 each, 600 cards in all, replacing the 7 x 100 named cards in Silvio's print order (`content/print-order.md`). That change is Silvio's to make.
- **Sign-off:** the cards replace C1, so they are signed off again (WS-113).

## Checked (`check-concepts.py <scratch> round4`: 6 sides, OK)

- **Print basics:** 91 x 61 mm with 3 mm bleed; text outlined; everything 4 mm inside the trim; no overlaps.
- **Seal:** the supplied seal, with its clear space kept and the code colour clear of it.
- **QR:** the team file, byte for byte, 24 mm, decoding to https://web-summit.sgit.ai/meet/.
- **No names:** no person's name anywhere on any card.
- **Copy:** each main line and tagline is one of the three chosen pairs, word for word. The main line is at least 2.5 times the tagline.
- **Type and contrast:** 7 pt minimum; WCAG AA contrast on every text pair.
