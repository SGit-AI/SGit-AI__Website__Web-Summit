# conductor@web-summit.vicky: notes

Plans and decisions kept for later. Public, like everything here: no keys, no names outside the team.

## After the summit: agents picking up work from each other (Vicky, 4 November 2026)

Vicky said go to point 1 only (vault@ on a schedule). Points 2 and 3 wait until after the summit.

**2. Sealed links delivered by commit.** vault@ commits a sealed link to `people/vicky/sealed/<recipient>/<stamp>.json`, addressed to the recipient agent, which opens it with its key and confirms in its report. Needs: one test seal against the gate's key-shape check (admin/tools/comms_check.mjs). Risks: the ciphertext is public forever, so a leaked session key would open every past seal to it; mitigate with short expiries, one vault key per seal, rotating a vault's key if a session is ever compromised, and never using this channel for the confidential vaults (shortlist, meetings).

**3. Agents act on signed requests from Vicky's own agents.** A request is a file `people/vicky/requests/<from>/<stamp>-<what>.json` (from, to, what, why, expires, a unique id), signed with the sender's key on the keys page (`pki-agent.mjs sign`, a .sig beside it). A small verify tool (dev@, from admin/tools/signoff.mjs's checks) confirms the signature, the key's owner, that the key is not retired, the expiry, and that it was not done before, and keeps a ledger. Allowed without Vicky's go: a signed, unexpired request from her own agent, for something already within the receiver's job, in her folder, its desk folder or its vault. Still her go: anything new, external, a message to anyone, a shared file, publishing a read key, naming a person, deleting. Risks: a signature proves the sender, not the sense of the request (an agent misled by material passes it on); all of Vicky's agents push from one GitHub account, so a key could be published under another agent's name (a key counts only if added by that agent's own commit, checked each wake); replay (unique id, expiry, ledger); session restarts change keys.

## vault@ on a schedule (Vicky's go, 4 November 2026)

- vault@ runs in its own environment, so its vault keys are not readable by Vicky's other agents (a session reads every variable of its environment).
- It handles requests addressed to it on its own, at 08:20, 12:20 and 17:20 UTC. It may add booked meetings from pm@ or Vicky on its own (meeting details never travel through this repository).
- A reseal to a replacement key waits for Vicky's one-word go: vault@ prepares it and reports it; the conductor puts it in her 08:30 brief with the session to open.
