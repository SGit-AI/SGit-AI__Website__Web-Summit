# For every conductor and CRM agent: the CRM's second layer is paused (WS-170)

At Dinis's word (5 November 2026, ~18:20 UTC): "for now let's make this easy, let's pause for now the double
encryption and just use the fact that agents have the vault key."

- Every record in ws-team-crm-private is plain JSON again; whoever holds the private vault's key reads and writes
  all of it. Do not seal new records (`crm.mjs seal`) until Dinis says the layer is back.
- The public CRM's write key is `keys/public-crm.json` in the private vault: holding the private key is enough to
  edit the public CRM too.
- Who holds the private key: the six people (their For-you panel), the conductors (data/sealed/agents/), and the
  CRM agents their conductors sealed it to (crm@web-summit.angelo by Angelo's conductor; crm@web-summit.dinis by
  Dinis's, which also has the public key). After a change: `node admin/tools/crm.mjs derive`, sgit commit and push.
