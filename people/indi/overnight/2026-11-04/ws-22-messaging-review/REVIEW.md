# WS-22: messaging review against the draft message

By messaging@web-summit.indi, 4 November 2026. Agent draft, not yet reviewed by a person. Suggestions only: I changed none of the pages listed.

The draft message is `../ws-15-message/MESSAGE.md`. Its test: does the page say (1) what RiskMandate does in plain words, (2) Reach, Mandate, Gap, (3) the three audiences (run, buy, sell), (4) "Web Summit Lisbon, 9 to 12 November 2026", with no claim that SHarness or signed email is shipped.

## The table

| Page | What it says | What differs from the message | Suggested change |
|---|---|---|---|
| `content/index.md` (home) | Lead: "all championing RiskMandate, each with our own team of AI agents. This is where we run it from." "We are all RiskMandate." | Never says what RiskMandate is. A visitor who is not on the team cannot tell. Only the word "RiskMandate" appears. | Add one sentence after the lead: "RiskMandate gives every AI agent a behaviour policy: what it can reach, what it was authorised to do, and the gap between them." |
| `content/meet.md` | "RiskMandate: AI agents under behaviour policies." Lists seven people with one line each. | Close to the message. It does not say Reach, Mandate, Gap, and it does not name the three audiences. The stand day is stated (Thursday 12 November), no stand number. | Add the 30-second paragraph (or its first three sentences) under the opening line. Link to the three video pages. Add the stand number when it exists. |
| `content/meet-indi.md` (and the six other `meet-<id>.md`) | "RiskMandate, in short": Reach, Mandate, Gap, Barriers, Licence to Operate. Three questions (run, buy, sell). | Matches the message and is its source. Differences: it names no category up front ("AI agent behaviour policies"), and "Find Indi at Web Summit: at our stand on Thursday 12 November" gives no hall or stand. The seven pages are identical except for the name and line. | Put "A behaviour policy for every AI agent." as the first sentence (cards finding 1). Keep the three questions as the openers in the message. Change all seven together, so they stay identical. |
| `content/meet-<id>.md`, the personal line | Seven lines: "Ask me what my agents did today." (Dinis); "My agents have a policy. Do yours?" (Nimay); "Ask me how I control my agents." (Angelo); "I brought 6 agents. Ask me why." (Jose); "Who's on the other side of your agent?" (Vicky); "Agents with a mandate." (Silvio); "Your agents. Your rules." (Indi). | Dinis's line read as "a cute question with no product in it" (`people/indi/synthetic/cards-run-2/findings.md`, finding 3). Vicky's, Nimay's and Silvio's map to the buy, run and sell openers, the others do not. | Keep the personal lines (they are the people's own). Suggest Dinis's line is paired with the product line on the page. |
| `content/start.md` | The team's start page. "We are all RiskMandate. Everyone champions it." The roles column: Indi is "The message, outreach, and the factory of examples". | Gives the team no message to say. It does not tell a team member what to say when asked. Role lines are internal (cards finding 4: not a title a buyer can place). | Add a short "What to say" block with the 30-second paragraph and the three openers. Link it from "What we are doing". Plain job titles are the designer's and Dinis's choice. |
| `people/indi/factory/companies.json`, key `riskmandate`, and the pages `pages.mjs` builds from it | `n`: the full ABP wording (Reach, Mandate, Gap, Barriers, Provenance, Licence to Operate, "know their reach, define their mandate, control the gap"). `l`: the master-key employee. Each company has an `opener`. | Consistent with the message. The five parts are listed without the three-audience framing. Several openers speak to infrastructure builders ("Could every agent on them carry a licence...") rather than the run, buy or sell question. | Add the three audience openers to the factory index. Per company, tag which of run, buy or sell the opener is. Leave `pages.mjs` and the data alone until Indi agrees. |
| `team/designer/print/concepts-rm/round2/README.md` | Six card designs. Copy table: "Would your agent pass an audit?", "Your customer will ask. Have an answer.", "Same agent. Different reach. Building is not authorising.", REACH / AUTHORISED / GAP, AGENT BEHAVIOUR POLICIES. "Find us at our stand on Thursday 12 November". | Record and Terminal match the message (category stated). Four designs never say what RiskMandate does (findings 1). The message uses "Mandate", the cards say "AUTHORISED". "Boardroom" names no subject (finding 2). No stand number. | Use AGENT BEHAVIOUR POLICIES on the winner (it is in two designs already). Keep "AUTHORISED" if the brand's own wording is fixed, and gloss it once ("what you authorised: its mandate"). Add "Web Summit Lisbon" to all. |

## Words to keep identical everywhere

- "Know their reach. Define their mandate. Control the gap."
- "Agent Behaviour Policy", then "behaviour policy" on later mentions.
- "Reach, Mandate, Gap, Barriers, Licence to Operate."
- "Web Summit Lisbon, 9 to 12 November 2026."

## What I did not check

- The seven personal dashboards and briefs, the videos' own pages, the print pages (`content/print.md`, `content/design.md`).
- The live site as rendered: I read the source files only, not the built pages.
- `/meet/` blockers from `board/WS-146-*.md` (open, for Dinis).

## Questions

- Does Nimay approve the draft message first? These suggestions assume it.
- Should one person own the seven `meet-<id>.md` edits so they stay identical?
- Is a stand number coming? Four pages wait on it.
