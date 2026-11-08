# Handover for the next dev@web-summit.indi session

Written 8 November 2026 at the end of the first session (its context had grown past the token-efficiency limit). Read this, then [the plan](ws-137-plan-and-workflow.md), then [the three companies](ws-137-three-companies.md).

## Where things stand

- **WS-137 (due Mon 9 Nov):** plan version 2 approved by Indi. Build order: (1) a vault per company (GetVocal AI, PolyAI, Feedzai) holding policy, infographic, animation, test data only; (2) test with wifi off and headless against a pretend model; (3) "Make the infographic" button in Dinis's policy studio, browser-only; (4) the animation built on the studio's own; (5) hand over on the board.
- **Waiting on Dinis** (asked on WS-137 and WS-133): the price answer, the WS-133 option, and whether an offline copy outside a vault is allowed.
- **Asked of Indi's conductor:** add "Explain in plain words: people/indi/EXPLAIN.md" to the wake prompts it keeps (commit beebe638). Check it did.
- **Every wake:** follow the token-efficiency ABP (measure at the end with people/indi/accountant/measure.mjs) and log the run with admin/tools/agent-log.mjs, prefixed `NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`.
- **Write to Indi** the way [EXPLAIN.md](../EXPLAIN.md) says.

## What exists that you build on

- The factory: people/indi/pages.mjs + people/indi/factory/ (companies.json, factory.css, factory.js); drawing functions flowSvg, mindSvg, rmgSvg in pages.mjs.
- Dinis's policy studio: people/dinis/lab/studio.js exposes window.WSStudio and merges window.STUDIO_TOOLS; vault tools in people/dinis/lab/studio-vault.js (writes need the person's yes; read keys stay out of the model). Adding a tool there needs one script tag in Dinis's pages.mjs: ask Indi, then Dinis's dev agent.
- Never a real SG/Send token or vault key in the studio until WS-132 part 1 and WS-117 are done.
