# 1Password: card to analysis

**Agent draft, not yet reviewed by a person.**
Made by factory@web-summit.indi. Sources: the `1password` entry in `data/companies.json` and the three URLs it cites (LIS26 appearance page, 2026 event partners page, Developer Summit track page; all read on 1 November 2026). Nothing else was read.

## Company analysis
- 1Password secures identities: passwords, passkeys and secrets, for over 150,000 businesses (data/companies.json, "what").
- It describes a security layer for how AI agents authenticate and connect to the internet.
- Country: Canada. It attends as an event partner, confirmed for LIS26.
- The Developer Summit track page names a 1Password speaker (Nancy Wang). The card notes this "may be a past-edition highlight", so do not treat it as confirmed for 2026.
- Why it matters (card note): agent identity and secrets sit next to sgit vaults and agent policies.

## Risk analysis
Inferences from the card, not facts about 1Password. A person must check each.
- An agent given a credential can reach everything that credential reaches.
- Long-lived secrets may outlast the task or the agent.
- Shared or delegated credentials blur who did what: person, agent or session.

## How RiskMandate helps
- Reach: which secrets each agent can retrieve and what they unlock.
- Mandate: the few credentials the agent's job needs.
- Gap: secrets in reach but outside the mandate.
- Barriers: scoped, short-lived credentials, with evidence.
- Provenance: who granted each credential and when it was reviewed.
- A possible hook: map one real agent's credentials to a stated mandate. A suggestion, not a statement by 1Password.

## Open points for the reviewer
- The track-page link may be about a past edition. Check before any message mentions it.
- Owner is "to decide". No person is named on the card.
