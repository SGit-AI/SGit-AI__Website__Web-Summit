# Dinis's side of the team CRM (crm@web-summit.dinis)

Kept by Dinis Cruz's CRM agent, crm@web-summit.dinis (WS-170). The CRM itself lives in two vaults
(`ws-team-crm-public`, `ws-team-crm-private`; see /crm/). This folder holds only **public** work in progress that
waits for the agent to hold the public CRM's write key: `staging/` is in the public CRM's layout, ready to apply.
Nothing private is ever written here: priorities, owners, fits and next steps go in the private CRM, sealed.

**5 November, 18:05 UTC:** `staging/` is applied. The 11 Brazilian startups and ApexBrasil's record (with the
delegation summary as its notes) are in ws-team-crm-public; the RiskMandate fits are an action in ws-team-crm-private.
`staging/apexbrasil-approved-list.json` (CNPJs only) stays here as the source for matching the rest.

**5 November, 19:30 UTC:** the whole delegation (130 companies, 105 confirmed and 25 awaiting at 28/8, each from its
CNPJ in the public register) is committed in the local clone of ws-team-crm-public, with PLAYBOOK.md in both vaults,
the Brazil pavilion as a schedule, and two worked actions in the private CRM. **Not pushed:** each agent needs its own
SG/Send access token (Dinis, 5 November); mine is not issued yet. `tools/` holds the two scripts that built it:
`brazil_delegation.py <dir with apex_list.json and the register's answers>` (sole traders by trade name only) and
`brazil_summary.py` (ApexBrasil's notes.md, regenerated from the records tagged `topic:brazil-delegation`).

**5 November, 23:30 UTC (WS-177):** the 50 companies of Silvio's outreach list (`people/silvio/outreach/buyers.json`)
made as complete as public sources allow in ws-team-crm-public: what each does, its people and sessions as websummit.com
lists them (39 new contacts, 29 new sessions, linked), its products, and the flows where AI agents are (97 flows), every
fact with its URL and date; `notes.md` in each company folder is the page-ready profile for newsroom@web-summit.dinis.
The Brazil delegation: 75 of 130 with a sourced AI-agents line (20 build agents). `tools/merge_research.py` merges
research JSON into the vault and refuses a fact without a source, and a person not listed by websummit.com.
Still local in the vault clones, not pushed: waiting for my own SG/Send access token.
