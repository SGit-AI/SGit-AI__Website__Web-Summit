# conductor@web-summit.vicky: notes

Plans and decisions kept for later. Public, like everything here: no keys, no names outside the team.

## After the summit: agents picking up work from each other (Vicky, 4 November 2026)

Vicky said go to point 1 only (vault@ on a schedule). Points 2 and 3 wait until after the summit.

**2. Sealed links delivered by commit.** vault@ commits a sealed link to `people/vicky/sealed/<recipient>/<stamp>.json`, addressed to the recipient agent, which opens it with its key and confirms in its report. Needs: one test seal against the gate's key-shape check (admin/tools/comms_check.mjs). Risks: the ciphertext is public forever, so a leaked session key would open every past seal to it; mitigate with short expiries, one vault key per seal, rotating a vault's key if a session is ever compromised, and never using this channel for the confidential vaults (shortlist, meetings).

**3. Agents act on signed requests from Vicky's own agents.** A request is a file `people/vicky/requests/<from>/<stamp>-<what>.json` (from, to, what, why, expires, a unique id), signed with the sender's key on the keys page (`pki-agent.mjs sign`, a .sig beside it). A small verify tool (dev@, from admin/tools/signoff.mjs's checks) confirms the signature, the key's owner, that the key is not retired, the expiry, and that it was not done before, and keeps a ledger. Allowed without Vicky's go: a signed, unexpired request from her own agent, for something already within the receiver's job, in her folder, its desk folder or its vault. Still her go: anything new, external, a message to anyone, a shared file, publishing a read key, naming a person, deleting. Risks: a signature proves the sender, not the sense of the request (an agent misled by material passes it on); all of Vicky's agents push from one GitHub account, so a key could be published under another agent's name (a key counts only if added by that agent's own commit, checked each wake); replay (unique id, expiry, ledger); session restarts change keys.

## After the summit: vault@ on a schedule, in its own environment

Planned on 4 November, then put off by Vicky the same evening: vault@ stays on demand in its current session, and its requests go in her 08:30 brief.

- The plan: vault@ in its own environment (`web-summit-vault`, Limited, the six domains), with `SG_SEND_ACCESS_TOKEN` and one `SG_VAULT_KEY_<NAME>` per vault it keeps working on, so Vicky's other agents (who share the main environment, and a session reads every variable of its environment) cannot read vault keys. A new session there, a new session key, a scheduled task at 08:20, 12:20 and 17:20 UTC.
- On its own: adding booked meetings from pm@ or Vicky (never through this repository); sealing to an agent's first key after the check. With Vicky's one-word go only: a reseal to a replacement key.
- The prompt for that session was given to Vicky on 4 November (this conversation, about 18:50 UTC).

## The main environment's variables (4 November 2026)

- Vicky removed `SG_VAULT_KEY_WS_MEETINGS` from the main environment on 4 November; the only shared variable left is `SG_SEND_ACCESS_TOKEN`.
- While it was there, any session started in that environment could read it, and a session keeps the variables it started with until it ends. After the summit: consider a new key for the meetings vault (`sgit vault rekey`, then delete the old copy on the server), so no session that saw it still holds a working key.
