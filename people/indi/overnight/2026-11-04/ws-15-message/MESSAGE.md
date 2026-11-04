# WS-15: the RiskMandate message (DRAFT for Indi, Nimay approves)

By messaging@web-summit.indi, 4 November 2026. Agent draft, not yet reviewed by a person. Nothing here is published or sent.

## The 30-second paragraph

> AI agents now act for companies: they read the mail, touch the systems, spend the money. Most firms cannot say what their agents can actually reach, or what they were allowed to do. RiskMandate gives every agent one factual record, an Agent Behaviour Policy. It shows the agent's **Reach** (what it can access), its **Mandate** (what the business authorised), and the **Gap** between them, where the risk lives. It lists the **Barriers** that really hold, with evidence, and ends in a Licence to Operate: who authorised it and who is accountable. Operators, security, leadership and insurers read the same page. Know their reach. Define their mandate. Control the gap.

About 95 words, roughly 30 seconds aloud. Sources: `content/meet-indi.md` ("RiskMandate, in short"), `people/indi/factory/companies.json` (key `riskmandate`, fields `n` and the five parts).

## Three openers

The three questions are already on every meet page (`content/meet-indi.md`). Each opener turns one into a first line.

| You meet | Opener | One line to follow |
|---|---|---|
| **Someone who runs agents** | "Do you know what your agents can reach?" | "We write it down: reach, mandate, and the gap between them." |
| **Someone who buys agents** | "When you buy an agent, do you know what is on the other side?" | "A behaviour policy tells you, before you switch it on." |
| **Someone who sells agents** | "When your customer asks what your agent can reach, what do you say?" | "Hand them the policy. It answers in plain words." |

Why these: the cards test says buyers want to know what RiskMandate does about the gap, not only that it exists (`people/indi/synthetic/cards-run-2/findings.md`, finding 7: "Record says what the gap is, not what RiskMandate does about it").

## One-line card versions

Short, for cards, shirts and the stand. Existing lines marked (existing).

- **Runs agents:** "Know their reach. Define their mandate. Control the gap." (existing, `content/meet-indi.md`)
- **Buys agents:** "Who is on the other side of your agent?" (Vicky's line, `content/meet.md`)
- **Sells agents:** "What do you say when they ask what your agent can reach?" (`content/videos.md`, next videos)
- **Plain version:** "A behaviour policy for every AI agent." Adds the category the cards test says was missing (finding 1: four of six designs never say what RiskMandate does).
- **Engineers:** "Building is not authorising." (existing, Terminal card, finding "What held")
- **Do not use as the main line:** "Ask me what my agents did today." It read as a cute question with no product in it (finding 3).

## Plain-words gloss (for anyone new)

From `people/indi/factory/companies.json`, key `riskmandate`, field `l`: "An AI agent is like a new employee with a master key. RiskMandate writes down which doors the key opens, which rooms the employee is meant to be in, and what stops them wandering into the others." Use it as the second sentence when the listener is not technical.

## The one demo: recommendation

**Recommend: "the grant, not the prompt" (WS-109) as the one demo. Keep Hack the Agent and ReachCheck as follow-ups for people who ask for more.**

| Option | For | Against |
|---|---|---|
| **The grant, not the prompt** (WS-109) | Two minutes. Needs one chat and one question ("what emails do I have?"). It shows the Reach and Mandate idea without jargon: the access was set when it was granted, not by the prompt. It needs no audience action. | The demo's setup is not yet tested (see `ws-109-demo/DEMO-SCRIPT.md`). It needs a chat connected to a mailbox. |
| **Hack the Agent** (Jose, https://agent-defense-arena.lovable.app/) | The audience joins by QR code and plays. Its last lesson ("any rule only the model enforces is a rule an attacker can argue with") supports the same message. | A game runs longer than two minutes and needs the room's phones and signal. It shows attacks, which is the prompt side, not the grant side. |
| **ReachCheck** (Jose, https://reach-check-agent.lovable.app/) | Checks an agent's configuration against its owner's mandate, in the browser. It is closest to the product itself. | Needs a configuration to check. Easy to read as a tool, not a message. |

Reasons, in order:

1. It is the shortest, and a stand conversation is short.
2. It makes the **gap** visible without a diagram.
3. It does not show attacks, so it does not sell fear.
4. Jose's two apps are the best second step: Hack the Agent for groups, ReachCheck for a technical visitor. Source for both: `board/WS-15-*.md` and the newsroom article https://newsroom.sgit.ai/articles/jose-botas-two-agent-apps.html.

I could not test any of the three. The choice is Indi's and Nimay's.

## Rules for using the message

- Never say SHarness or signed email is shipped (`board/WS-109-*.md`).
- Say "Web Summit Lisbon, 9 to 12 November 2026". Our stand day is Thursday 12 November (`content/meet.md`).
- No hall or stand number is on record yet (cards findings, point 5). Do not invent one.

## Questions

- Does Nimay want "behaviour policy" or "Agent Behaviour Policy" on first mention?
- Is the plain version ("A behaviour policy for every AI agent.") the line for the stand?
- Which demo does Dinis want on the stand screen? He chooses the lines (WS-109).
