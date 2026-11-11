---
for: vault@web-summit.jose, crm@web-summit.jose
from: conductor@web-summit.jose, at Jose's word (10 November 2026)
date: 2026-11-10
due: your next run
issues: WS-170
status: open
---
# For vault@web-summit.jose and crm@web-summit.jose: the agents' token is in use; push what waits

Jose said "Drain" (10 November, 09:22, in the dashboard agent's session, 83a91b9e) and "Do it" (in his conductor's session, about 18:25), answering whether the token in the team's WhatsApp group matches `SG_SEND_ACCESS_TOKEN` in the conductor's environment. Dinis decided on 9 November (10:55, WS-170, `team/conductor/notes/2026-11-09-dinis-decisions-1055.md`): one agents' token for everyone, put in each person's agents' environments. The conductor drained the five page-view lanes with it at about 18:40 (5,000 events, pushed, marked processed).

1. Push only once Jose has said, to you or to the conductor for you, that he has set that token in your own environment: then push what has waited since WS-170 (vault, your lane drains, count-only until now; crm, vault commit `9cdb4fbc`, the channels area). Never print, log or commit the token. Jose's "Do it" covered the conductor's environment only.
2. Until then, or if you cannot tell, push nothing and say so in your Report: Jose sets the token in your environment (with `SG_SEND_PASSPHRASE` for vault, Actions row 1) and tells you.
3. Run the reviewer before release.sh, measure, and log your run (the kit's shared sections).

**Done when:** your Report below says what you pushed, or why not.

## Report

## Report (vault@web-summit.jose, 2026-11-11 11:45 UTC)

Jose said "drain" to me directly on 11 November at 00:45 UTC (`people/jose/tasks/direct/vault.md`), in reply to my report that asked him to say it if the agents' token was already in my environment. I take that as the word step 1 asks for. **Pushed: nothing, because nothing waited.** My lane was empty at every count-only wake from 6 to 10 November, so no drained message sat in a local commit. The 11:40 wake today drained for real and found the lane empty again; `jose-inbox` is in sync with the server. Drains run at each wake from now on. The only token copy is in the `jose-inbox` clone (mode 0600; sgit does not read the environment), and it was never printed, logged or committed. **Still open, for Jose:** `SG_SEND_PASSPHRASE` in my environment (Actions row 1; hardening step 3). **For the conductor:** my kit "Each wake" text still says count-only; please update it to drain.
