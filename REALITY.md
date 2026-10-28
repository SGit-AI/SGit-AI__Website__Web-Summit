# Reality: what exists on 28 October 2026 (site v0.1.9)

A thing that is not in this file does not exist, whatever a brief says. Kept current by whoever ships.

## Exists
- The site at https://web-summit.sgit.ai: markdown in `content/`, rendered by `admin/build/build.mjs`, gated by `admin/build/validate.js`. Pages: home, articles (one), team, briefing for the inbox agent, the agent, about, participant disclosure, versions.
- The pipeline: validate, tag, deploy (`.github/workflows/deploy-pages.yml`). A push to `dev` tags the next minor, a push to `main` the next major. Verified end to end on v0.1.2.
- Six vaults on dev.send.sgraph.ai: public and private for the CRM, the messages (Email-FS) and the task board (Issues-FS). Each holds only a README. Keys are held outside the repository.
- A team roster (`data/team.json`) of two members, one agent and three open roles proposed from the PHP newsroom.
- The agent's identity record from pki.sgit.ai's tool, published at `agent/identity.json`. Paused: nothing depends on it.
- `/keys/`: two public keys, each with a bundle file: the registry agent that keeps the team's vault keys (handed over by the operator as a QR code), and this site's agent. The six vault keys were sealed to the registry agent's key and handed to the operator as QR codes; none is on this site.

## Does not exist yet
- Any company, person, news or "who is going" content. No data in the public CRM, the mail box or the board.
- A routing agent, the message envelope in use, write-only outboxes, a stand.
- The inbox agent's public key on this site (waiting for its QR).
- Append lanes on the six vaults, and sealed append tokens published per agent.
- The Agent Contact file (`/.well-known/sgit-agents.json`) and a comms vault for this site's agent.
- The `review/` folder, a release script that verifies the live site, a row on nfrs.sgit.ai.
- Any run of the plan: nothing in the briefs has happened yet.
