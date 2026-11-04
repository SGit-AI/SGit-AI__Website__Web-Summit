# RiskMandate business card: three concepts, all seven people

By designer@web-summit.indi, 4 November 2026, for the team to choose one. **Not for print yet**: the seal is a placeholder (see Assumptions), and the chosen concept needs signing off again (WS-113), since it replaces C1.

- `compare.png`: the three concepts side by side, front and back, for Indi.
- `<concept>/sheet.png`: one concept, all seven people, both sides.
- `<concept>/<id>-card-front.svg`, `-back.svg`: print files. 91 x 61 mm (85 x 55 trim, 3 mm bleed), `viewBox="0 0 91 61"`, every letter outlined, QR and seal vector.
- `<concept>/<id>-card.pdf`: both sides in one PDF, 91 x 61 mm, vector, as most card printers ask for.
- `<concept>/<id>-card-front.png`, `-back.png`: previews at trim size (85 x 55 mm at 300 dpi), no bleed, no marks.
- `<concept>/live/`: the same files with live text, for editing (needs Barlow, Barlow Condensed, Inter and JetBrains Mono installed).
- `<concept>/spec.json`: every text item with its font, size in pt, colour and box.
- Remake: `make-concepts.py`, then `render-concepts.mjs <scratch>`, then `check-concepts.py <scratch>` (the header of each says how).

## A. Band

**Rationale:** C1 kept, made more RiskMandate. The seal and the green join the band, the role is added and the type is tightened.

| Colour | Hex | CMYK (naive, for reference) |
|---|---|---|
| White | #FFFFFF | C0 M0 Y0 K0 |
| Container black | #161615 | C0 M0 Y5 K91 |
| RiskMandate green | #1A7F5A | C80 M0 Y29 K50 |
| Accent | the person's colour (table below) | |

**Type:** Barlow Condensed (name, line, asks, wordmark) + Barlow (role, URL).

**Design notes:**
- The band stays 9 mm wide on the trimmed card, as on C1. A wider band (12 to 15 mm) gives the person's colour more weight. Below 6 mm, a 1 mm trim drift starts to show.
- The role is set in RiskMandate green, so the brand colour is on every card whatever the person's colour. For one ink only, set it in container black.
- The QR is on the back only, as on C1. Putting it on the front means dropping the line or the seal.

## B. Seal

**Rationale:** The seal leads. A calm, dark brand face, and a white working face where the name and the QR sit together.

| Colour | Hex | CMYK (naive, for reference) |
|---|---|---|
| Container black | #161615 | C0 M0 Y5 K91 |
| White | #FFFFFF | C0 M0 Y0 K0 |
| RiskMandate green | #1A7F5A | C80 M0 Y29 K50 |
| Accent | the person's colour (table below) | |

**Type:** Barlow Condensed (name, wordmark) + Inter (role, line, asks, URL).

**Design notes:**
- The front is full-bleed container black with the knockout seal, the cut the brand keeps for dark surfaces. Ask the printer for a rich black (for example C60 M40 Y40 K100), or it prints grey on matt stock.
- The person's colour is only a short rule on the white side, far from the mark. Dinis's colour is near black, so his rule reads as black.
- Name and QR share the white side, so one look gives both. The line moves to the brand side under the wordmark. It could go back under the role if the team wants it beside the name.

## C. Poster

**Rationale:** The card is a small version of the shirt: the person's line, big, in their colour, with the seal on white below.

| Colour | Hex | CMYK (naive, for reference) |
|---|---|---|
| White | #FFFFFF | C0 M0 Y0 K0 |
| Container black | #161615 | C0 M0 Y5 K91 |
| RiskMandate green | #1A7F5A | C80 M0 Y29 K50 |
| Accent | the person's colour, as the poster field (table below) | |

**Type:** Barlow Condensed (name, role, line, wordmark) + JetBrains Mono (asks, URL).

**Design notes:**
- The back is the person's colour with their line in Barlow Condensed ExtraBold, the same voice as their T-shirt, so card and shirt read as one set.
- The seal sits on white with half its width clear on every side. The mark never sits on a coloured field and the colour never touches it.
- Jose's white line on orange is 3.2:1. That passes AA only as large text, which it is (31 pt). Setting Jose's ink to container black gives 5.6:1, but breaks the match with his shirt (white ink).

## The seven

| Person | Name on card | Role on card | Line | Colour (CMYK) | Ink on colour | QR / URL |
|---|---|---|---|---|---|---|
| dinis | Dinis Cruz | Operator: the strategy, the senior meetings | Ask me what my agents did today. | #111111 (C0 M0 Y0 K93) | white | /meet/dinis/ |
| nimay | Nimay Parekh | Business, positioning, outreach and investors | My agents have a policy. Do yours? | #1f3a93 (C79 M61 Y0 K42) | white | /meet/nimay/ |
| angelo | Angelo | Technical lead: the site, the agents, the behaviour policies | Ask me how I control my agents. | #1e7b4f (C76 M0 Y36 K52) | white | /meet/angelo/ |
| jose | Jose Bota | Technical: automation, messaging, the agents | I brought 6 agents. Ask me why. | #e86a1c (C0 M54 Y88 K9) | white | /meet/jose/ |
| vicky | Vicky Wang | Project Manager | Who's on the other side of your agent? | #6b3fa0 (C33 M61 Y0 K37) | white | /meet/vicky/ |
| silvio | Silvio Switha | Ideas, outreach, local, and video | Agents with a mandate. | #c62828 (C0 M80 Y80 K22) | white | /meet/silvio/ |
| indi | Indi Gupte | The message, outreach, and the factory of examples | Your agents. Your rules. | #f2b705 (C0 M24 Y98 K5) | black | /meet/indi/ |

URLs are `https://web-summit.sgit.ai/meet/<id>/`, from `team/designer/qr/qr-meet-<id>.svg`.

## Checked (`check-concepts.py`: 42 sides, OK)

- Every print file is 91 x 61 mm with `viewBox="0 0 91 61"`, has no live text and no raster image.
- Every text item, the seal and the QR panel with its quiet zone sit at least 4 mm inside the trim, as measured by the browser.
- One `rm-logo` per file, with half its width clear of every other element and of the person's colour.
- Every QR is the person's own file, byte for byte, scaled only (symbol 24.00 mm, panel 30.62 mm). The 600 dpi render of every file decodes to its own URL (zxing-cpp). `verify-qr.py` passes for all seven source codes.
- Names, roles, lines and URLs match the sources character for character. Text is 7 pt or more, names 14 to 20 pt. Every text pair passes WCAG AA (the lowest is Jose's poster line, 3.2:1, as large text).
- No email, phone, address, handle, Web Summit name or other brand anywhere.

## Assumptions

- **Logo:** no seal file is in the repository, and riskmandate.ai is blocked by this session's network policy. Every file has a placeholder group `id="rm-logo"` at the seal's size and position: a thin grey ring, labelled "RM LOGO". `data-cut` says which cut goes there (containered on white, knockout on black). RISK MANDATE is set as the wordmark beside it, in the merch's style (Barlow Condensed, RISK light, MANDATE bold). Seal sizes: A 11 mm, B 16 mm, C 8.5 mm, all above the 24 px small-cut threshold.
- **Vicky's name and role:** "Vicky Wang", "Project Manager", from `people/vicky/business-card.json` (her words, 4 November). `data/team.json`, `data/design.json` and the live site still say "Vicky".
- **Roles:** from `data/team.json`, kept whole where they fit one line at 7 pt or more. Dinis's drops "RiskMandate, " because the card already carries the name.
- **Asks:** "Meet me / Book a meeting / Talk to my agent", kept from C1 and the shirt backs.
- **URL in text:** without `https://`, as on C1. A and C break it after the domain.
- **Safe zone:** 4 mm, as in this brief. `final.json` and the print page say 3 mm; 4 mm satisfies both.
- **QR size:** 24 mm is read as the symbol (as on C1), so the white panel with its quiet zone is 30.62 mm.
- **Colour:** the files are RGB hex, as the existing print files are. The CMYK values are a naive conversion for reference; the printer converts and proofs.
- **No crop marks** in the print files, as on C1. Most online printers place their own. The PDFs carry the 3 mm bleed.
- **Fonts:** Barlow, Barlow Condensed, Inter and JetBrains Mono, all SIL OFL 1.1. Outlined in the print files, so the printer needs none.
- **Sign-off:** C1 is signed off by Dinis for everyone. Any concept chosen here supersedes it, and the seven sets are signed again.
