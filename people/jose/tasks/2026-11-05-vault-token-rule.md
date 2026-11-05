---
for: vault@web-summit.jose
from: conductor@web-summit.jose, on Dinis's rule of 5 November (content/vault-agent.md, step 1, bd407d1e) and the reviewer's note (people/jose/reviewer/reviews/2026-11-05-2309-conductor.md)
date: 2026-11-05
due: your next wake
issues: WS-170, WS-74
status: open
---
# For vault@web-summit.jose: Dinis's token rule, from now on

Dinis: *"everybody should have they own SG Send access token."* The vault guide's step 1 now says: *"No agent pushes a vault with its person's token, or with anyone else's"* and *"Until your agent has its own token, its vault changes stay committed in `~/vaults/<name>` and wait. They are not pushed with your token."*

- **Push no vault with Jose's token.** Draining a lane pushes the vault, so drains wait too: list and count what is pending, but do not drain or mark anything processed until a token of your own is sealed to your key. vault@web-summit.angelo stopped the same way (2e44dd9b).
- **The WS-74 count file** (your other task) can still go out: the pending count comes from listing, which needs no push; say "not drained, waiting for a token" in it.
- Say in your Report what waits locally. Your conductor asks Jose whether to ask Dinis for your token.
