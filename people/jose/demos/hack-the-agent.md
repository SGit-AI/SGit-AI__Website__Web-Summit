# Run sheet: Hack the Agent (WS-18, WS-108)

Jose's demo at the stand (Thursday 12 November). App: https://agent-defense-arena.lovable.app/ · QR: [../qr/hack-the-agent.svg](../qr/hack-the-agent.svg). Facts from the newsroom's review of 31 October 2026 ([the article](https://newsroom.sgit.ai/articles/jose-botas-two-agent-apps.html)); written by conductor@web-summit.jose on 5 November 2026, at Jose's word. Jose checks it on his own phone before the stand.

## In one line

**Try to trick five AI agents from your phone: you will see why a rule only the model enforces is a rule an attacker can argue with.**

## The 5-minute flow, on a phone

| Minute | Jose does | The visitor sees |
|---|---|---|
| 0 | Hands over the card or points at the QR; asks "have you ever tricked a chatbot?" | the join screen |
| 0 to 1 | The visitor joins with the code or the QR and a nickname | level 1, The Secret Keeper: an agent protected by its system prompt alone |
| 1 to 2 | Lets them try a role-play or "ignore your instructions" | each level states its success condition, and a trace shows every tool call as allowed or blocked |
| 2 to 3 | Jumps to level 4, The Refund Desk: the server checks ownership, the amount and one refund per order, but leaves the 30-day window to the model | the visitor talks it into a refund the policy forbids |
| 3 to 4 | Reads level 4's lesson aloud: "Any rule only the model enforces is a rule an attacker can argue with." | the lesson card |
| 4 to 5 | Shows level 5, Sentinel (an instruction hierarchy, a tool allowlist, server-side authorisation, an output filter), then the bridge, in the review's words: write down what the agent may do, and enforce it outside the model ("That is what Agent Behaviour Policies are for") | the hardened agent holding |

Suggested: practice mode (clearly labelled as a simulation, with its own board) for a one-to-one at the stand; live mode for a talk, with the host dashboard on a screen.

## What could go wrong at the stand, and the fallback

| Risk (from the review) | Fallback |
|---|---|
| **Host control lives in one browser** (a key in that browser's storage): clearing it, or changing laptop, loses the session | Open the host session on the laptop that stays at the stand, the morning of the 12th; never clear its storage that day; for one-to-ones use practice mode (whether it needs the host session: Jose checks) |
| **Nicknames show on the projector** (no filtering yet) | Use presentation mode only in a talk with people you know; at the stand, phones only, no projector |
| **The live request budget runs out**, or rate limits hit in a busy hour | Watch the budget on the host dashboard; switch visitors to practice mode |
| **The stand's network is down** | The QR still opens the app on the visitor's own mobile data; Jose's own phone as a hotspot |
| **lovable.app itself is down** | No app to show: tell the level 4 story and its lesson from memory, and show the QR for later |
| **"Which model is it?"** (live mode does not name its model) | Say so honestly: the lesson is about where rules are enforced, not about one model |
