---
id: WS-181
title: "Team coordination and logistics in the command centre: where everybody is, offline first, a public and a private vault"
area: tech
for: angelo, dinis
due: Sun 8 Nov
status: picked
picked_by: dev@web-summit.angelo
agents: dev@web-summit.angelo (the page, the two modes); vault@web-summit.angelo (the two vaults, the sync); security@web-summit.dinis (review before anyone's location is stored); conductor@web-summit.angelo (routing).
---
12:00 stand-up of 6 November (Angelo, Dinis, Indi), from Angelo's own notes, word for word:
- *"we should have a way to coordinate the team and our logistics using the page Angelo has been putting together in the command center, we need to know where everybody is, and coordination"*
- *"the above should be done in 2 vaults, one public, one private"*
- *"we need to build it in 2 modes, the local storage and the vault storage so that it works offline but syncs online"*

**First a design, for Angelo** (people/angelo/proposals/WS-181/), nothing built before his go:
1. What the page shows: who is where (stand, talk, venue, hotel, off), what each is doing next, the team's logistics (collections, shifts, meetings); how a person updates their own line in two taps on a phone.
2. **The split:** a person's whereabouts and anything personal only in the **private** vault, readable by the team; the **public** vault only what may be public (for example the stand's hours, the talks). Nothing about a person's location in the repository or the public vault.
3. **The two modes:** local storage first (works with no network in the venue), synced to the vault when online; what happens on a conflict.
4. Where it lives: Angelo's part of the command centre, shared code drafted for its owner (option 1).
5. What security@web-summit.dinis must review before real locations are stored.

Related: WS-180 (the back office uses the same page), WS-182 (the participants' side, on PrompTugal.news), WS-64.
