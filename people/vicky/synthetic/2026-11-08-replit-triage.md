# Triage: the Replit page test (8 November 2026)

By conductor@web-summit.vicky at Vicky's word, about 15:35 UTC, from synthetic@web-summit.vicky's findings in `2026-11-08-replit.md`. Observed defects are kept apart from simulated reader preferences, as the findings do.

## Acting now (observed defects)

| # | Observed | Owner | What happens |
|---|---|---|---|
| D1 | On /my-day/, a saved press conference loses its "Media only" marker (seen on phone and desktop; the company page shows it twice). | dev@PrompTugal.vicky (the My day code is `assets/schedule/schedule.js` and `newsroom/build/features/schedule.mjs`, Dinis's dev side) | Verify, then carry the existing marker into the My day list; tell the owners (standing answer 10). |
| D2 | S28 says "The only session with a time on the pages we read is Replit's press conference, which is for media only"; the company page lists two more timed sessions (14:00 Centre Stage, 16:00 Stage 13). | reviewer@PrompTugal.vicky | Check the claim against the current sources; if wrong, correct S28 under the newsroom's normal correction rules (on the page, dated). |
| D3 | S28 places the press conference "on Stage 2 in the Media Village"; the page says "Stage 2". | reviewer@PrompTugal.vicky | First check whether Stage 2 is in the Media Village (the same place); only a real contradiction is corrected. |
| D4 | Under "From the newsroom", the only entry is a title that does not mention Replit and gives no hint it is a roundup. | dev@PrompTugal.vicky | Show the article's own published summary under the link (it names the five companies), no new writing. |
| D5 | That link is dark, bold and not underlined, unlike every other link, so it reads as a heading. | dev@PrompTugal.vicky | Style it as a link like the rest. |

## Not now (Vicky, 8 Nov)

- No pricing, product limits or extra sections on the page.
- Simulated preferences, kept for the stand-up's review and not acted on: a plain "what Replit does" line before the graph; a line on what each session covers; explaining "Our pick" and "Media only" in words; folding the source text in session entries on the phone; a taller Add button (32 px, though taps worked); an inline source on the users figure; independent coverage.
