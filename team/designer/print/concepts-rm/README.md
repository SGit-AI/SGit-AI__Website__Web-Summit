# RiskMandate business cards: three concepts

By designer@web-summit.dinis, 4 November 2026, from `team/designer/prompts/riskmandate-business-cards.md`. For the team to pick one. Two sample people only: Indi Gupte (`indi`) and Dinis Cruz (`dinis`). The other five follow once a concept is chosen.

- Compare the three: `compare.png` (Indi, front and back).
- Each concept: `<concept>/sheet.png`, both people, both sides.
- Print files: `<concept>/<id>-card-front.svg` and `-back.svg`, 91 x 61 mm (85 x 55 mm trim, 3 mm bleed), every letter outlined. `<concept>/<id>-card.pdf` holds both sides, vector, at exact size.
- Previews: `<concept>/<id>-card-front.png` and `-back.png`, trim size, no bleed, 1004 x 650 px (300 dpi).
- Live text, for editing: `<concept>/live/`. Needs Barlow Condensed and Inter installed. Never send these to the printer.
- **The seal is a placeholder.** Each file has one group, `id="rm-logo"`, a thin grey square labelled RM LOGO, at the seal's size and position, its clear space kept free. Swap the group for the supplied SVG or EPS, unaltered, at the size in its `data-size-mm`.

Rebuild: `BARLOW_DIR=<fonts> python3 make-concepts.py`, then `node render-concepts.mjs`, then `python -I check-concepts.py` (needs zxing-cpp and pillow in a scratch venv).

## The palette, for all three

| Colour | Hex | CMYK (naive conversion) | Use |
|---|---|---|---|
| Container | #161615 | C0 M0 Y5 K91 | text, the dark field in B |
| RiskMandate green | #1A7F5A | C80 M0 Y29 K50 | role and URL text only, never the mark |
| White | #FFFFFF | C0 M0 Y0 K0 | paper |
| QR black | #000000 | C0 M0 Y0 K100 | the QR modules only |
| Accent, Indi | #f2b705 | C0 M24 Y98 K5 | Indi's band, rule or field |
| Accent, Dinis | #111111 | C0 M0 Y0 K93 | Dinis's band, rule or field |

Three colours plus the person's accent. The QR black is part of the code, not a design colour.

## Concept A: Band

- **Type:** Barlow Condensed (name, wordmark), Inter (role, line, the asks, URL).
- **Rationale:** C1, already approved, made more RiskMandate: the seal and the wordmark join the front, the brand green carries the role and URL.
- **Front:** a 9 mm band in the person's colour, the name, the role, the line in quotes, the containered seal (9 mm) beside RISK MANDATE.
- **Back:** the QR at 24 mm on the left, "Meet me / Book a meeting / Talk to my agent", the URL in green, the band again on the right edge.
- Design notes:
  - The back's band sits on the right, so it lines up with the front's band when the card is turned over on its long edge. Move it left if the printer turns cards the other way.
  - The seal is 9 mm. It could grow to 10 mm, but the clear space would then reach the trim.
  - Dinis's band is near-black. On a white card it reads as a strong edge, not as a colour. Fine for him, but the seven together will look less even than on the merch.

## Concept B: Seal

- **Type:** Barlow Condensed (name, wordmark), Inter (role, line, tagline, URL).
- **Rationale:** the brand leads: one side is the seal alone, the other side is the person.
- **Front:** the container colour full bleed, the knockout seal (16 mm) centred, RISK MANDATE, "Agents with a Mandate". Same for all seven.
- **Back:** white, the name, a short rule in the person's colour, the role, the line, the URL, the QR at 24 mm on the right.
- Design notes:
  - The front uses the knockout cut, as the brand asks on dark surfaces. If Dinis prefers the containered mark, it sits on the same dark field and the container blends in.
  - A full dark field takes a lot of ink on matt stock. Ask the printer for a rich black build, or keep it at the brand's #161615 and accept a slightly soft black.
  - The accent is only a 12 mm rule. It is the quietest use of the person's colour of the three. Make it wider if the team wants more colour.

## Concept C: Poster

- **Type:** Barlow Condensed (name, line, wordmark), Inter (role, the asks, URL).
- **Rationale:** the merch's poster style on a card: the person's colour full bleed and the name big in condensed type.
- **Front:** the person's colour, the name at 30 pt, the role, a short rule, the line in condensed type, RISK MANDATE in type at the foot. Ink white or black as for the person's garments.
- **Back:** white, the containered seal (9 mm) beside RISK MANDATE, the asks, the URL, the QR at 24 mm, a strip of the person's colour along the foot.
- Design notes:
  - The seal is on the white back only. The brand forbids the mark in full colour on a coloured field, so the front carries the wordmark in type, not the seal.
  - Seven bright colours make the strongest set, but a full colour field shows any colour shift from the printer. Ask for a proof of Vicky's purple and Indi's yellow first.
  - The line is in sentence case, as in `content/print.md`. Set in capitals it would match the shirts more closely, but would change the copy.

## Checks (all three, both people, both sides: 204 passed, 0 failed)

- Copy matches `data/design.json` and `content/print.md` character for character (names, lines). Roles are shortened, see the assumptions.
- QR: each back's rendered PNG decodes with zxing-cpp to its own URL. `team/designer/qr/verify-qr.py` passes for `qr-meet-indi.svg` and `qr-meet-dinis.svg`. The path in each card is byte for byte the path in the source file, at 24 mm, module 0.828 mm, on its white 30.62 mm panel with the 4-module quiet zone.
- Size 91 x 61 mm, viewBox 0 0 91 61. All text, the seal and the QR panel inside the 4 mm safe zone.
- Smallest text 7.65 pt. Names 21 pt (A, B) and 30 pt (C).
- Contrast: lowest 4.97:1 (green on white). Every pairing passes AA.
- One `rm-logo` placeholder per file where the seal appears, its clear space (half its width) free.
- No contact details, no other brand, no live text in the print files.

## Assumptions

- The seal file is not in the repository and riskmandate.ai was not reachable from this session, so every seal is the labelled placeholder. The brand rules come from the brand notes of 3 November (`comms/mail/mailroom/designer@web-summit.dinis/procurement__003-the-riskmandate-logo.md`).
- The seal is drawn as a square box. If the real seal is round, the box is its bounding square and nothing moves.
- Roles from `data/team.json`, shortened to one line: Dinis "Operator: the strategy" (from "Operator: RiskMandate, the strategy, the senior meetings"), Indi "The message and outreach" (from "The message, outreach, and the factory of examples"). Each person should confirm theirs.
- The URL is printed as `web-summit.sgit.ai` and `/meet/<id>/` on two lines, without `https://`, as on C1. The QR carries the full URL.
- "Meet me / Book a meeting / Talk to my agent" and "Agents with a Mandate" come from the merch in `content/print.md` and `team/designer/print/final.json`.
- The domain web-summit.sgit.ai is the team's own site, not the Web Summit name or logo.
- CMYK values are a naive conversion from hex, as on the print page. Use the brand's EPS values for the green and the container if they differ.
- Small dark text in #161615 prints on two plates (Y and K). The printer may set it to 100% K to avoid registration trouble; the change is invisible.
- The placeholder label "RM LOGO" is set at 7 pt in grey. It goes when the seal goes in.
- PDFs come from Chromium, as for the C1 cards. They are RGB. The printer converts to CMYK on their side, or asks for a CMYK PDF from the EPS seal and these SVGs.
- Fonts: Barlow Condensed (SIL OFL 1.1, fetched from the Google Fonts repository into a scratch folder) and Inter (SIL OFL 1.1, on the system). Both outlined in the print files.
