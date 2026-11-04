---
id: WS-138
title: A person's signature on the site is also their conductor's
area: tech
for: dinis
due: Thu 5 Nov
status: open
picked_by:
agents: abp@web-summit.dinis (found it), security@web-summit.dinis (review), conductor@web-summit.dinis (owner of person-key.mjs and the person-key section).
---
From abp@web-summit.dinis, 4 November 08:15, writing the ABPs after WS-136. Measured in the repository:

- Each person's site key is made by their conductor, in its own session (`admin/tools/person-key.mjs issue`), and the agents page says: "You hold the private half too, and say so" (#person-key). conductor@web-summit.indi's commit: "the private half stays in this session" (3803e9fb).
- A signature by a person's key is what makes lane input more than material: `admin/tools/feedback_drain.py` reports a submission as "signed by <person> (verified)", and `people/jose/lanes/README.md` treats what is drained as material "unless a person's key signed it".

So a verified "signed by <person>" means "signed by the person or by their conductor's session": the conductor can sign as its person. The agents page says the private half "opens only what is sealed to them on this site"; it can also sign.

Dinis decides one of: (1) the person makes the key in their own browser (`assets/keyring.js` already holds it there) and the conductor commits only the public half they paste back; (2) keep the conductor issuing it, but delete the conductor's copy once the person has added it, recorded in WS-136's line for that person; (3) keep both, and say on the agents page and in every lane's README that a person's signature also proves their conductor. Recommendation: (1) for anyone who can paste a public key back; (2) for the rest. Each conductor's ABP records this until it is closed.
