# Run sheet: ReachCheck (WS-18, WS-108)

Jose's demo for one-to-one conversations at the stand (Thursday 12 November). App: https://reach-check-agent.lovable.app/ · QR: [../qr/reachcheck.svg](../qr/reachcheck.svg). Facts from the newsroom's review of 31 October 2026 ([the article](https://newsroom.sgit.ai/articles/jose-botas-two-agent-apps.html)); written by conductor@web-summit.jose on 5 November 2026, at Jose's word. Jose checks it on his own phone before the stand.

## In one line

**Paste what your agent is configured to do, say what you allowed, and see red, yellow or green, with the evidence.**

## The 5-minute flow, on a phone

| Minute | Jose does | The visitor sees |
|---|---|---|
| 0 | Asks "do you know what your agents can reach?" | the start screen (English or Portuguese) |
| 0 to 1 | Opens one of the built-in demo scenarios: the **n8n auto-sender**, an agent configured to send email against a rule never to send | Import: the configuration (an MCP configuration, a list of tools, or an n8n workflow snapshot) |
| 1 to 2 | Shows the **Mandate**: the owner's instruction and role, and rules (allow, require approval, never, must) for actions such as read, draft, send, export, delete, pay, run code | the mandate the owner wrote |
| 2 to 4 | Runs the **Review** | **red**: the conflict, with evidence pointing at the exact place in the configuration; counts of servers, actions, mismatches and unverified tools; open questions |
| 4 to 5 | Shows **Export** (Markdown or JSON, version-stamped), then the bridge, in the review's words: write down what the agent may do, and enforce it outside the model ("That is what Agent Behaviour Policies are for") | the export |

Second scenario if there is time: a configuration with an instruction hidden in a tool's description, also flagged red.

## What could go wrong at the stand, and the fallback

| Risk (from the review) | Fallback |
|---|---|
| **A real configuration comes back yellow with no mismatches**: ReachCheck does not guess what a tool does from its name, so unrecognised tools are "unverified", not matched | Run the built-in demos, not a visitor's own setup; if they bring one, say plainly that yellow means "could not verify", which is the honest answer and the reason to write a mandate |
| **A plainly worded hidden instruction is missed** (it looks for certain patterns) | Do not promise detection; show the hidden-instruction demo that it does catch |
| **A visitor wants to paste a real configuration with secrets in it** | It runs entirely in the browser (nothing sent, apart from the site's own analytics, in the review's test), but never ask anyone to paste keys or tokens at a stand |
| **"Is this a security certification?"** | No: it says throughout it is a draft review, "not runtime verification or security certification" |
| **The stand's network is down** | The QR opens it on the visitor's mobile data; Jose's phone as a hotspot |
| **lovable.app itself is down** | No app to show: tell the red n8n auto-sender example from memory, and show the QR for later |
