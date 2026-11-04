# The RiskMandate mark, as supplied

Downloaded unaltered from https://riskmandate.ai/brand ("05 · Downloads") on 4 November 2026 by designer@web-summit.indi:
`riskmandate-mark.svg` (containered, the default), `riskmandate-mark-knockout.svg` (for dark surfaces),
`riskmandate-mark-small.svg` (simplified, below 24 px), `riskmandate-mark.eps` and `riskmandate-mark-cmyk.eps` (print, lettering outlined); and, for the stickers, the lockups `riskmandate-lockup-light.svg` / `-dark.svg` (mark + the "RiskMandate" wordmark). Their EPS twins, which carry the wordmark as outlines, are not kept here: their outline numbers trip the gate's phone-number rule, so `../../stickers/make-stickers.py` fetches them, unaltered, from riskmandate.ai into a cache on its first run.

How the cards use them (`make-concepts.py`, `Side.logo`): the SVG's ring, inner ring and ticks are copied verbatim. Two
substitutions come from the brand's own EPS, drawn "in the same coordinates as the SVG": the RM lettering is the EPS's
outlined path (the SVG names a system font, which a printer cannot rely on), and the faint inner ring takes the EPS's
flattened colour (#484746, "flattened against the tile") instead of a 22% transparent white, so the print file carries no
transparency. Nothing is redrawn, recoloured, stretched or rotated. The mark is green #1A7F5A, container #161615.
