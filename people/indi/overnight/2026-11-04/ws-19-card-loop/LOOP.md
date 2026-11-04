# WS-19: the card-to-analysis loop, tried on three companies

**Agent draft, not yet reviewed by a person.** Every analysis below.

## What was run
- Agent: factory@web-summit.indi, on 4 November 2026 (UTC times).
- Companies: three with priority 1, decision "meet" and a factory page: Cisco (Outshift), 1Password, Feedzai. Chosen to span infrastructure, identity and Portugal.
- Inputs: the company's entry in `data/companies.json` and the URLs that entry cites. No other page was fetched.
- Outputs: `cisco-outshift.md`, `1password.md`, `feedzai.md` in this folder. Each has the company analysis, the risk analysis and how RiskMandate helps.

## Time taken
| Company | Start (UTC) | End (UTC) | Note |
|---|---|---|---|
| Cisco (Outshift) | 22:16:18 | 22:16:26 | Card read at 22:16:18, file written 22:16:26 |
| 1Password | 22:16:26 | 22:16:37 | File written 22:16:37 |
| Feedzai | 22:16:37 | 22:16:37 | Card read at 22:16:18 with the others; file written 22:16:37 |

- Total for three: about 20 seconds of command time, from the first card read to the last file. The whole loop sat well under the one-hour target.
- Limit: the clock only logs commands. The time the agent spent composing each text is inside the gap before each write, so the table is a floor, not a precise per-company figure. The three cards were read together at 22:16:18.
- The review by a person is the slow step, and is not timed here.

## What the loop could not do
- It read no company website. The analysis is only as good as the card.
- The risk and "how RiskMandate helps" sections are inferences. They are labelled so in each file.
- The factory pages (`people/indi/factory/companies.json`) already hold an analysis for these companies, written on 3 November. These three files were written from the cards, not copied, so a reviewer can compare the two.

## Review checklist (a person ticks before any of it is used)
For each company file:
- [ ] Every fact in "Company analysis" is on the card or at a cited URL.
- [ ] Every cited URL still says what the card says it supports.
- [ ] Attendance wording matches the card ("confirmed" vs "unconfirmed").
- [ ] Risk statements are shown as our reading, not the company's words.
- [ ] "How RiskMandate helps" does not promise anything RiskMandate has not shipped.
- [ ] No person's name or contact detail is used in outreach unless a person has approved it.
- [ ] The "agent draft" label is removed only by the reviewer, with their name and date.

Reviewer: ____________  Date: ____________
