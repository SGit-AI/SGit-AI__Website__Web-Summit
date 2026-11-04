# Review: the business cards (round 4) and the laptop stickers, before tonight's order

By designer@web-summit.dinis, 4 November 2026, 22:30 UTC, at conductor@web-summit.dinis's request (relaying Dinis, about 21:15 UTC: review before he orders from ProntaPrint Chiswick tonight, for pickup on Friday). An independent read of designer@web-summit.indi's files: nothing of Indi's is changed here. Each finding says what it is: **print risk**, **brand rule**, **fact to source**, or **taste**. Read on the files in the repository at dev `201db2b9` and on https://riskmandate.ai/brand (read today).

## Verdict

- **Cards (round 4): printable tonight once three things are settled**: the booth line (source it or cut it), the "Web Summit" words (Dinis's yes, since his 2 November rule said none), and the blue (ask for a hard proof or accept the shift). The files themselves are sound: 91 x 61 mm with 3 mm bleed, text outlined, 7 pt minimum, QR 24 mm on its own white panel with its quiet zone, decoding to https://web-summit.sgit.ai/meet/ on all three backs (zxing-cpp, from the PNGs).
- **Stickers (the four): not ready to send as they are.** The cut line is not a spot colour in the PDFs, so a cutter will not find it and a printer may print it. Fixable in minutes: send a separate cut file, or have the shop set the cut from the SVG.
- **The creative set: a good brief, but not for tonight.** Twelve generated images still need vectorising, a cut path each, the seal placed and a proof. Order the corporate four now (fixed) and the creative set next week from a sticker specialist, or for the stand only.

## The cards

1. **Fact to source: "Meet us between Booths A1-30".** Its only source in the repository is Indi's note (`check-concepts.py`, "Indi, 4 November, evening"); there is nothing from the organisers in the repository, the design page still says the stand location "goes on once we know it", and the /meet/ pages every QR opens say only "find us at our stand on Thursday 12 November" (as `content/cards-brief.md` notes). 600 cards will carry it. Either confirm it from the organisers' stand allocation (email or exhibitor portal) before ordering, or print "Find us on Thursday 12 November" without a booth, and keep the booth on the /meet/ page, which can change.
2. **Brand rule: "Web Summit" on the cards.** The fronts say WEB SUMMIT EDITION and the backs WEB SUMMIT LISBON, Thursday 12 November. Dinis's rule of 2 November (in `team/designer/print/final.json`) was "no Web Summit name or logo on any garment or card". His words tonight ("RiskMandate Web Summit Edition", in the creative brief) suggest he has changed it; if so, words only, never the logo (as the cards do). **Needs Dinis's explicit yes**, and then the rule in `final.json` should change with it.
3. **Brand rule: RISK MANDATE vs RiskMandate.** The brand page writes the name one way only, "RiskMandate", and never "RISK MANDATE"; its lockup is the seal plus "RiskMandate". The two-word condensed form came from the print order's example picture and went onto the shirts in the poster style Dinis chose (3 November): so I share the cause. My proposal: **on the card backs, where the seal sits next to the name, use the supplied lockup** (`brand/riskmandate-lockup-light.svg`) instead of the seal plus a typeset RISK MANDATE, since that pairing reads as a lockup the brand did not make. The fronts' RISK MANDATE is the poster voice of the shirts: keep it for consistency with the garments, or change cards and garments together to "RiskMandate". Dinis's call; either is defensible, mixing them on one side is not.
4. **Fact to source: the three taglines** ("Clarity. Control. Confidence.", "Govern AI. Grow with Confidence.", "AI Agents. Your Rules.") are not on the brand page. They came from the AI-generated example picture in the print order, by way of the shirts. The brand's own line is "RiskMandate creates and sells Agent Behaviour Policies" (the cards use "Agent Behaviour Policies", which is the brand's). Fine to keep if Dinis owns them; they should not be presented as the brand's. Small fix: "Grow with Confidence" has a capital C that the other two do not: "Govern AI. Grow with confidence." reads as one sentence style with the rest.
5. **Print risk: the blue card.** #1D4ED8 is an RGB blue well outside CMYK; the README's CMYK (C87 M64 Y0 K15) will print noticeably duller and more violet than the screen. The brand page lists no blue at all (only green #1A7F5A and container #161615; Indi took the blue from the brand site's CSS tokens). Ask ProntaPrint for a hard proof of the blue, or choose a CMYK build and accept it on the proof. The green (C80 M0 Y29 K50) will also shift; less.
6. **Print risk, small: colour space and black.** All three PDFs are RGB (no DeviceCMYK, Chromium writes RGB); most digital shops convert, but say so in the order and ask for their proof. The black front is a large solid: ask for **rich black** (for example C60 M40 Y40 K100), as the README already notes, or it prints as a flat grey-black.
7. **Taste:** the cards are clear and strong. The colour code works without printing the audience. Keep the main line at least 2.5 times the tagline, as now.

## The stickers (the four)

1. **Print risk: the cut line.** Each SVG has `<g id="cutline" data-spot="CutContour">` with a magenta (#FF00FF) 0.25 mm stroke; the PDFs, made by Chromium, carry it as an ordinary RGB stroke: no spot colour named CutContour (no Separation in any of the four PDFs). A cutter's software will not recognise it, and a printer that prints the PDF as it is would print a magenta hairline around each sticker. **Fix before sending:** send the artwork without the cut layer plus a separate cut file per sticker (the cut path alone, SVG or PDF), or ask the shop to set CutContour from the SVG in Illustrator. The page's claim "a magenta hairline in the spot colour CutContour" should then be corrected.
2. **Print risk: the shop.** Die-cut (or kiss-cut) matt vinyl is a specialist job: confirm ProntaPrint Chiswick does it in-house by Friday, or order the cards there and the stickers from a sticker printer.
3. **Sizes and bleed check out:** 104 x 44 mm and 80 x 80 mm pages, which is the 100 x 40 and 76 mm cuts with 2 mm bleed.
4. **Taste:** the corporate and the cartoon are the strongest. "The gap" works now; "know, define, control" has a lot of detail for 40 mm high: check the radar and dial at real size on the print proof.

## The creative set (the brief)

1. **Good guardrails:** words only for "Web Summit Edition", no third-party marks, the seal never generated (placed from the supplied file), a white cut border, 2048 px or more (about 580 to 680 dpi at these sizes). Keep "an image model misspells long text: set the words in the vector afterwards": for print, set **all** the words in the vector, not only the long ones.
2. **Print risk:** an image model gives a raster and no cut path. Each sticker needs its cut path drawn (or traced) and the seal placed, then a proof. That is a day of work for twelve, not an evening.
3. **Taste:** 1 (the patch), 5 (the stamp) and 12 (the sardines) are the strongest, as the brief says. 8 (a "security hologram" reading VERIFIED) could read as an official security seal: keep it clearly playful. 2 should stay a generic tram ticket, not the operator's own design.

## What I propose, in order, for tonight

1. Dinis: yes or no to the Web Summit words on the cards, and to RISK MANDATE vs RiskMandate (or the lockup on the backs).
2. Indi's agent: the booth line sourced or removed; "confidence" lower-case; the cut files for the stickers.
3. The order: the cards with a hard proof of the blue and rich black; the stickers only where the shop confirms die-cut by Friday.

designer@web-summit.dinis
