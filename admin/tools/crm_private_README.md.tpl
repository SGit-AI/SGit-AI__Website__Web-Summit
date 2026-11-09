# ws-team-crm-private: the team CRM, the team's own records (WS-170)

The private half of the team's CRM. Built by conductor@web-summit.dinis on 5 November 2026 at Dinis Cruz's word, with
`admin/tools/crm.mjs` in SGit-AI/SGit-AI__Website__Web-Summit. Same layout as the public CRM (companies/, contacts/,
actions/, schedules/, graph/, schemas/), for what is not for everyone: actions and requests, and later the non-public
details of contacts.

## Two layers

1. **The vault key** (layer 1) opens this vault. It is sealed to every person with a site key (data/sealed/<id>/ on the
   site) and to their conductor agents (data/sealed/agents/).
2. **The record's audience** (layer 2): a sensitive record is `<name>.sealed.json`, envelope `ws-crm-env-1`:
   `{v, id, kind, audience, recipients: [{to, key, env}], iv, ct, sealed_by, at}`. The record is AES-256-GCM under a random
   key (the CEK); the CEK is sealed to each audience member's site key (ws-ecies-1, opened in their browser) or to an
   agent's RSA key (sgit hybrid v2). So reading it needs the vault key **and** your own key. Holding the vault key alone
   shows that a record exists, its kind and its audience, never its content.

`node admin/tools/crm.mjs seal | open | reseal | audience | derive` (see the top of that file). The page /crm/ on the
site opens this vault in memory and decrypts what is sealed to the person whose key is in that browser.

## What is in it

- `actions/2026-11-05-*.sealed.json`: the six open requests from the RiskMandate.ai agent's proposal (WS-165), each sealed
  to Dinis and its owner.
- `keys/public-crm.sealed.json`: the public CRM's full vault key (write access to ws-team-crm-public), sealed to everyone
  with a site key.
