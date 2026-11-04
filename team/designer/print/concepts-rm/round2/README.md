# RiskMandate business cards, round 2: six designs for Web Summit

By designer@web-summit.indi, 4 November 2026, at Dinis's word (11:02, relayed by Indi): *"6 complete different variations of the cards, including audience specific ones (C-Level Execs, Risk & Policy focused, and tech & engineering focused) ... web summit specific and point them to our booth on the 12th"*. For the team to vote on at [/design/](https://web-summit.sgit.ai/design/index.html#cards-r2). **Not for print yet**: the team picks, and the chosen card is signed off (WS-113).

- `compare.png`: the six, front and back, for Indi.
- `<design>/sheet.png`: one design, all seven people, both sides.
- `<design>/<id>-card-front.svg`, `-back.svg`: print files, 91 x 61 mm (85 x 55 trim, 3 mm bleed), every letter outlined; `<id>-card.pdf` both sides; `<id>-card-*.png` trim-size previews; `live/` live text for editing.
- Remake: `make-round2.py`, then `render-concepts.mjs <scratch> round2`, then `check-concepts.py <scratch> round2`.

## What every round-2 card shares

- **The real RiskMandate mark** from riskmandate.ai/brand (`../brand/`, see `SOURCE.md`): knockout on dark, containered on light, half its width clear on every side.
- **Web Summit by name, in plain text only**: "Web Summit Lisbon, 9 to 12 November 2026" (`content/meet.md`) and "Find us at our stand on Thursday 12 November" (the meet pages). Never Web Summit's logo, and no other brand.
- **Your own QR**, unaltered, 24 mm, to `https://web-summit.sgit.ai/meet/<id>/`, and the URL in text.
- **Your name and role** as in round 1; your colour on every design.

## 1. Seal (general)

**Rationale:** The chosen B, now pointing to the stand: the seal leads on the container black, the brand strip ends in your colour.

| Colour | Hex | CMYK (naive, for reference) |
|---|---|---|
| Container | #161615 | C0 M0 Y5 K91 |
| Warm white | #F7F6F2 | C0 M0 Y2 K3 |
| Ink | #0D0D0C | C0 M0 Y8 K95 |
| White | #FFFFFF | C0 M0 Y0 K0 |
| Green | #1A7F5A | C80 M0 Y29 K50 |
| Lighter green | #22C55E | C83 M0 Y52 K23 |
| Blue | #1D4ED8 | C87 M64 Y0 K15 |
| Gold | #B45309 | C0 M54 Y95 K29 |
| Red | #C0392B | C0 M70 Y78 K25 |
| Accent | the person's colour | see `../README.md` |

**Type:** Barlow Condensed (name, wordmark) + Geist.

**Design notes:**
- The stand day sits in the lighter green under the line, the only place it is used as text (8:1 on the container).
- The seal is 20 mm (B had 22 mm) to make room for the stand line within its 10 mm clear space.
- The back is B's back unchanged: name, role, QR, asks, URL, the strip.

## 2. Pass (general, Web Summit)

**Rationale:** The card as a ticket to our stand: Web Summit and the day on the main part, the seal and your colour on the stub.

| Colour | Hex | CMYK (naive, for reference) |
|---|---|---|
| White | #FFFFFF | C0 M0 Y0 K0 |
| Ink | #0D0D0C | C0 M0 Y8 K95 |
| Muted | #4A4845 | C0 M3 Y7 K71 |
| Faint (perforation) | #8A8780 | C0 M2 Y7 K46 |
| Green | #1A7F5A | C80 M0 Y29 K50 |
| Accent | the person's colour | see `../README.md` |

**Type:** Barlow Condensed (name, day) + Geist (role, asks, URL) + JetBrains Mono for the ticket labels: three faces, one over the brief, as the brand pairs a sans with a mono.

**Design notes:**
- The perforation is a printed dashed line, not a die cut: no extra cost, no finish.
- The stub's colour block bleeds off the top-right edge only; the seal sits on white above it, 5 mm clear.
- The QR is on the back with the asks, so the ticket face can stay about the place and the day.

## 3. Record (Risk & Policy)

**Rationale:** For risk and policy people: the card reads like the record RiskMandate makes, the reach, the mandate and the gap, with the seal as its stamp.

| Colour | Hex | CMYK (naive, for reference) |
|---|---|---|
| Warm background | #F7F6F2 | C0 M0 Y2 K3 |
| Ink | #0D0D0C | C0 M0 Y8 K95 |
| Text | #1A1917 | C0 M4 Y12 K90 |
| Muted | #4A4845 | C0 M3 Y7 K71 |
| Border | #E2DFD8 | C0 M1 Y4 K11 |
| Green | #1A7F5A | C80 M0 Y29 K50 |
| Gold (the gap) | #B45309 | C0 M54 Y95 K29 |
| Accent | the person's colour | see `../README.md` |

**Type:** Geist (headline, register) + JetBrains Mono (labels); Barlow Condensed for the name and day.

**Design notes:**
- The three rows are the brand's own badge line, word for word: what one agent can reach, what you authorised it to do, and the gap between the two.
- GAP is the one word in gold, the brand's caution colour, used once.
- The warm background is the brand's page colour; the QR keeps its own white panel on it.

## 4. Boardroom (C-Level)

**Rationale:** For executives: one question about what their customers will ask, a lot of quiet, and a meeting at our stand.

| Colour | Hex | CMYK (naive, for reference) |
|---|---|---|
| Ink | #0D0D0C | C0 M0 Y8 K95 |
| Warm white | #F7F6F2 | C0 M0 Y2 K3 |
| Faint | #8A8780 | C0 M2 Y7 K46 |
| White | #FFFFFF | C0 M0 Y0 K0 |
| Green | #1A7F5A | C80 M0 Y29 K50 |
| Accent | the person's colour | see `../README.md` |

**Type:** Geist (headline, details) + Barlow Condensed (name, wordmark); JetBrains Mono for the event line.

**Design notes:**
- No strip and no asks list on this one: fewer things, said more slowly, as a board member reads.
- The seal is small (12 mm) beside the wordmark, as the brand advises for a serious register: "keep it small, keep it quiet".
- The back gives the day to meet in place of the three asks; the QR still leads to the person's page.

## 5. Terminal (Tech & Engineering)

**Rationale:** For engineers: set in the brand's machine-output face on the darkest canvas, about reach, not models.

| Colour | Hex | CMYK (naive, for reference) |
|---|---|---|
| Canvas | #0A0A09 | C0 M0 Y10 K96 |
| Warm white | #F7F6F2 | C0 M0 Y2 K3 |
| Faint | #8A8780 | C0 M2 Y7 K46 |
| Lighter green | #22C55E | C83 M0 Y52 K23 |
| Green | #1A7F5A | C80 M0 Y29 K50 |
| Accent | the person's colour | see `../README.md` |

**Type:** JetBrains Mono throughout + Barlow Condensed for the wordmark.

**Design notes:**
- The headline is in the lighter green, which the brand keeps for dark surfaces.
- The back is dark too, with the QR on its own white panel and quiet zone, as the print rule asks.
- The asks carry a › prompt, a little playful; the stand day and the URL follow in the same face.

## 6. Signature (general)

**Rationale:** Name first, as big as the card allows, over a line in your colour; the seal and the QR together on the dark back.

| Colour | Hex | CMYK (naive, for reference) |
|---|---|---|
| White | #FFFFFF | C0 M0 Y0 K0 |
| Ink | #0D0D0C | C0 M0 Y8 K95 |
| Muted | #4A4845 | C0 M3 Y7 K71 |
| Green | #1A7F5A | C80 M0 Y29 K50 |
| Container | #161615 | C0 M0 Y5 K91 |
| Warm white | #F7F6F2 | C0 M0 Y2 K3 |
| Accent | the person's colour | see `../README.md` |

**Type:** Barlow Condensed (name, wordmark) + Geist; JetBrains Mono for the stand line.

**Design notes:**
- The colour line runs edge to edge, so the seven together read as a set across a table.
- The person's own line stays on the front, under the role.
- The back pairs the knockout seal with the QR, on the container black.

## Copy and its sources

| Where | Text | Source |
|---|---|---|
| 3. Record, front | Would your agent pass an audit? | `content/design.md`, more lines to choose from |
| 3. Record, front | REACH: what one agent can reach. AUTHORISED: what you authorised it to do. GAP: the gap between the two. | riskmandate.ai/brand, the "Badge" boilerplate, word for word |
| 3. Record, 5. Terminal | AGENT BEHAVIOUR POLICIES | riskmandate.ai/brand |
| 4. Boardroom, front | Your customer will ask. Have an answer. | `content/design.md` |
| 5. Terminal, front | Same agent. Different reach. / Building is not authorising. | `content/design.md` |
| every design | Web Summit Lisbon, 9 to 12 November 2026 / Find us at our stand on Thursday 12 November | `content/meet.md`, `content/meet-<id>.md` |
| 1. Seal, 6. Signature | the person's own line | `content/print.md` |

## Checked (`check-concepts.py <scratch> round2`: 84 sides, OK)

- 91 x 61 mm, `viewBox="0 0 91 61"`, no live text, no raster image.
- Text, seal and QR panel at least 4 mm inside the trim, measured in the browser; **no two of them overlap** (new in round 2).
- The seal is the supplied artwork, element for element, with its clear space free of text and of the person's colour.
- Every QR is the person's own file, byte for byte, 24 mm, and decodes to its own URL at 600 dpi.
- Names, roles, lines and URLs as in round 1. Every headline, event and register line matches its source text above. 7 pt minimum; WCAG AA contrast on every text pair.
- No contact detail, no other brand; the Web Summit name is allowed in round 2 only.

## Assumptions and open items

- **The stand location** is not known yet (`content/design.md`), so every card names the day only. When it is known, it goes in one place (`COPY` in `make-round2.py`) and every card is remade.
- **Web Summit's name** goes on the cards at Dinis's word of 4 November, which changes, for the cards, his rule of 2 November (no Web Summit name). Plain text only: the Web Summit logo is their trademark and stays off.
- **Typefaces:** 1. Seal and 5. Terminal use two faces. The other four use three (Barlow Condensed, Geist and JetBrains Mono, as the brand pairs a sans with a mono for labels), one over the brief's limit of two. Each can drop to two if the team prefers.
- **Colours:** several designs use more than the brief's three colours plus the accent, because they use the brand's own tokens (ink, warm white, muted, border). No text sits on an accent colour.
- **Audience cards:** each person could carry two kinds (an everyone card and their audience's card). That is a print-order decision for Silvio (`content/print-order.md`).
- **Lines:** the audience designs carry the audience's line in place of the person's own line. Your line is still on 1. Seal and 6. Signature.
