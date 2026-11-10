# What each of Silvio's agents can reach: a proposal for Silvio to confirm

By gamma-ray@web-summit.silvio, 10 November 2026 (WS-206), as a draft of item 1 of the [scans' README](README.md): GAMMA-Ray indicator I23, "what it can reach is enumerated". **Nothing here is confirmed.** Silvio corrects it; each agent can check its own row in its own session. The Agent Behaviour Policies are not edited by this file.

Each item is marked:
- **declared**: written in the agent's policy (content/abp/<agent>-web-summit-silvio.md), people/silvio/agents.json or Silvio's pages;
- **seen**: seen by gamma-ray@web-summit.silvio in its own session in Silvio's account, on 10 November 2026, by listing its tools and the names (never the values) of its environment variables;
- **inferred**: seen here and assumed for another session because it is set on the account or the environment, not seen in that session.

## What every session in Silvio's account appears to hold

Seen in this session. If these are set on the account or on the shared cloud environment, every one of the eleven holds them too (inferred for each, until each agent confirms its own).

| Reach | What it allows | Mark |
|---|---|---|
| GitHub: push to SGit-AI/SGit-AI__Website__Web-Summit (git and the GitHub tools) | every file, the gate, the CI workflow; `main` protected, `dev` not | seen; declared in every policy |
| Gmail connector | read, search, labels, spam, trash, drafts; **no send, reply or forward tool** | seen |
| Google Calendar connector | read, and also create, change and delete events, and answer invitations | seen |
| Google Drive connector | read, search, create, update, copy, **share** and trash files | seen |
| Claude documents and artifacts | create and publish documents and pages | seen |
| Claude Code sessions | start other sessions, message them, create scheduled tasks | seen |
| SG/Send access token (environment variable) | create and write vaults on the team's vault server | seen; declared for vault@ and sgit@ |
| A GitHub token (environment variable) | GitHub access outside the git proxy | seen |
| Further cloud credentials (environment variables) | not tried; named to Silvio directly, not here | seen |

What this changes, if Silvio confirms it: the mail rule "never send" is held by the connector (a boundary) and not only by each agent's word; but Calendar and Drive allow changes that no agent's mandate mentions, and the Drive connector can share a file outside the team. Any session could create another session or a schedule; the Big Stop rule ("create no scheduled task and no other agent") is, today, a rule.

## Each agent: what its own job adds

| Agent | Also reaches | Mark | Open question for Silvio |
|---|---|---|---|
| conductor | private CRM vault and videos vault (holds their keys); signs as Silvio with his site key (WS-136, WS-138) | declared | Is the Silvio key it holds still in use? |
| outreach | Silvio's Gmail drafts (28 written, to 5 November) | declared | Does it still hold the Gmail connector, now that the mailbox is inbox@'s only? |
| video | YouTube, Instagram, LinkedIn accounts | not recorded | Does its session hold any publishing account? |
| dashboard | `assets/cc/` (shared command-centre code, runs for three people's pages) | declared | none |
| design | its lab: a copy of the PrompTugal.news front page on this site | declared | none |
| dev | the site's build, gate and CI (`admin/build/`) | declared | Is CI in its mandate, or does each change go through the conductor? |
| crm | the team's private CRM vault (opens it) | declared | none |
| inbox | Silvio's Gmail (account-wide), the private CRM's actions; a mail check every 2 hours | declared | Did Silvio turn off send, reply and forward himself, or does the connector never offer them? |
| procurement | Silvio's mail (drafts to printers, to 5 November); `content/procurement.md`, `content/print-order.md`, `assets/print/`, `admin/tools/signoff.mjs` (WS-101) | declared | Does it still hold the mail connector? |
| vault | SG/Send token; the vaults it created | declared | Which vaults, and which of vault@ and sgit@ owns which? |
| sgit | SG/Send token; the vaults it created; publishes read keys after an audit | declared | Same as vault@ |
| gamma-ray (this agent) | everything in the first table; vault `skz9rwpu` | seen | none |

## How Silvio confirms it

For each row: yes, no, or a correction, in Silvio's own words to any of his agents. A confirmed row becomes `declared` by its operator (and `seen` where the agent lists its own tools in its session), and the scans can then answer I23. Governance level 3 still needs I43 (watched while it runs).
