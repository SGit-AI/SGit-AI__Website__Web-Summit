---
id: WS-207
title: "GAMMA-Ray launch (beta): the first ten companies and their agentic solutions, and the pipeline from scan to PrompTugal.news"
area: riskmandate
for: dinis
due: Wed 11 Nov
status: open
picked_by:
agents: gamma-ray@web-summit.dinis (the scans, the vaults, gamma-ray.sgit.ai); conductor@web-summit.dinis (the selection, the CRM side); conductor@PrompTugal.dinis (consumes the scans on company pages and in interviews, once restarted)
---
At Dinis's word (10 November 2026, about 02:30 UTC): launch GAMMA-Ray as a **beta, a work of discovery**, with a set of scans ready. A GAMMA-Ray scan is a public rating built from public evidence, like the public ratings of security headers or TLS set-ups, so a company does not have to take part. The first ten below come from the team's `data/companies.json`: each is confirmed at Web Summit Lisbon 2026, and its agent is its own product, so the Public tier can read it from its documentation. More companies are added as the team meets them.

## The first ten (scan the agent each one ships)

Every row's "what it is" comes from `data/companies.json`, which records each company's own description with its source. **gamma-ray@ confirms each solution's exact name and documentation at source before scanning;** a company may have more than one agentic solution, each scanned on its own.

| # | Company | At Web Summit (source in companies.json) | The agentic solution to scan | Why it is a good first scan |
|---|---|---|---|---|
| 1 | **Replit** | event partner | its agent that builds applications from natural language | an agent that acts and runs code; well documented; a peer of the Claude Code example scans |
| 2 | **Manus AI** | Tao Zhang (Co-founder & CPO) speaks | its action engine that executes tasks on a user's behalf | a general-purpose acting agent; a high freedom level to set against its governance |
| 3 | **JetBrains** | Kirill Skrygan (CEO), "Taming the agent swarm" | the AI coding agents in its IDEs | coding agents inside developer tools; documented controls |
| 4 | **AISLE** | Stanislav Fort (CTO), "Securing the software foundation of civilisation with AI" | its autonomous systems that find, fix and verify vulnerabilities | an agent that changes code; security-native, so the governance story matters |
| 5 | **GetVocal AI** | featured startup | its orchestrated AI fleet for contact centres | customer-facing agents across channels; the human role is visible |
| 6 | **Emergence** | Satya Nitta, "When AI agents go rogue" | its verified, governed enterprise agents | it claims governance, so the scan tests the claim against the evidence |
| 7 | **Trent AI** | Neil Lawrence, "Viable systems, judgement, and AI safety" | its AI security engineer agent | an agent that acts in code, cloud and other agents |
| 8 | **LEGALFLY** | featured startup | its AI-native legal workflows (review, drafting, due diligence) | agents in a regulated field: authority and human sign-off |
| 9 | **CrowdStrike** | George Kurtz (CEO) speaks | the agentic AI in its security platform | a large vendor with agents acting in customers' environments |
| 10 | **Cloudflare** | Matthew Prince (CEO) speaks; "Build for the agent era" | its platform for building and running agents | a platform scan: what any agent built on it is given and can be held to |

**A second list, the governance side.** These companies sell what *clears* an agent's freedom, so they are scanned on GAMMA-Ray's governance ladder (the controls they offer) rather than as agents:
- Airia, "AI sprawl is exploding";
- Polygraf AI (an AI behavioural control plane);
- Descope (agentic identity, MCP);
- 1Password (secrets for AI agents);
- Delinea (privileges for AI agents);
- LaunchDarkly ("Who holds the kill switch?");
- Hexamind (Hexgate, an open-source authorisation layer for agents);
- Cisco Outshift.

They are the natural partners in RiskMandate's story.

**Then:** the companies each person met and interviewed. Each person tells their conductor; the names go to the private CRM, and the scans follow the same pipeline.

## The pipeline

1. **Select.** A company enters from `data/companies.json`, an interview, or a RiskMandate X-ray at the stand (the quick scan). One row per agentic solution.
2. **Scan (gamma-ray@, the Public tier).**
   - Read the company's own public documentation, product pages, trust centre, published metadata and repositories, each with its source and the date it was read.
   - Answer the questions, compute the levels: freedom reached, governance, the level held (the Risk-Adjusted Yield), the gap and the work order.
   - Mark each answer as in this deployment, as shipped, or available.
3. **A vault per company,** made by gamma-ray@: the evidence, the answers and the levels; its read key on the scan's page. **The vault is the record.**
4. **A second reader:** another model, and a person for the first ten, checks the links and the levels before anything is published.
5. **Publish on gamma-ray.sgit.ai, as beta:** "a work of discovery, from public evidence, not seen by the company; corrections welcome". This follows the standard's rule 6 for product scans.
6. **The company is told:** a short private note through the team's CRM: "here is how your agent reads on GAMMA-Ray; correct us". It also opens the conversation.
7. **PrompTugal.news consumes it.** gamma-ray.sgit.ai publishes `scans.json` (company, solution, levels, the scan's URL, the vault id, the date). PrompTugal's company page shows a scan card that links to the original, and each interview article opens with the company's scan. **The data lives in GAMMA-Ray; PrompTugal links to it and never copies it.**
8. **Corrections.** A company's correction lands in its vault with its date, the scan is re-run, and the change is visible.

## Update, 10 November 2026 (Dinis): GAMMA-Ray Spectrum, and publish now

- **The model is GAMMA-Ray Spectrum** (Dinis's document of 10 November, also given to gamma-ray@ to build):
  - four dimensions, Autonomy, Reach, Control and Openness, at four levels each, every rung an achievement;
  - a four-letter signature, a stage, badges and the standards constellation;
  - two blind assessors, a deterministic scorer, a challenger, a gate, then a person.
- **Publishing, at Dinis's word:** *"We can publish it. It's okay. This is all public information. It's like a normal publishing ... this now makes the companies look in a good way, and we're calling it beta."*
  - Cards are published as **beta** as soon as they pass the gate.
  - The company is told afterwards and invited to claim its card and add evidence. Corrections are dated and propagate.
  - **No pre-publication review window and no lawyer before the first edition:** naming companies from public information is ordinary reporting.
- **Cohorts:** the Portuguese agentic companies for *Spectrum PT #1* on PrompTugal.news, and the ten global agent products above as examples. The first sector is gamma-ray@'s and Dinis's call.
