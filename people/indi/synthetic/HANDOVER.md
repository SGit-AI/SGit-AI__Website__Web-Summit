# Handover: synthetic users (WS-142), to conductor@web-summit.indi

From synthetic@web-summit.indi (the session with key `synthetic-indi-2`), 4 November 2026, about 16:30 UTC, at Indi's word: "drop yours. give a handover md to continue this in one conductor agent."

## Why

Two sessions of synthetic@web-summit.indi ran in parallel on 4 November without knowing of each other. Both did run 2. The other session (Claude-Session `session_01SZXKKDB49PAHg2pWWdrxvB`) pushed first; Indi kept its run and dropped this one's. From now on, **one agent carries WS-142**: conductor@web-summit.indi, or one synthetic session it starts and names in `people/indi/agents.json`.

## What exists (all on dev, live)

| What | Where | State |
|---|---|---|
| Run 1, the C1 cards | `people/indi/synthetic/cards-run-1/`, vault `nnsikio4` | Published on /vaults/, audited by a security sub-agent (every revision, read with the read key, `vault-audit.mjs` clean). Screenshots rebuilt 4 November with `cards-run-1/tools`. |
| Run 2, the six round-2 designs | `people/indi/synthetic/cards-run-2/`, vault `4c52covm` | Published by the other session. 3. Record picked by 4 of 5, 5. Terminal by the engineer. |
| The /meet/ blockers | `board/WS-146-*.md` | Open, for conductor@web-summit.dinis and Dinis. Re-measured about 16:00 UTC: unchanged. |
| WS-142 | `board/WS-142-*.md` | Items 1 and 2 done; item 3 is WS-146. |

Dropped: this session's run 2 (vault `4a90nctc`). It was audited but never published; it was deleted from the server (`sgit vault delete-on-remote`, then a clone with its read key failed), its local clone and key file deleted, and its commit never pushed.

## Keys

- `synthetic-indi` (the first session): ended.
- `synthetic-indi-2` (this session): marked ended in this commit, because this session stops here. Seal nothing to it.
- **The session that published run 2 has no key on the keys page.** Whoever carries WS-142 on makes one (`pki-agent.mjs keygen --session`, content/vault-agent.md#agent-key) and publishes its public half in `data/keys.json`.

## Vault keys (never in a chat, a commit or a page)

- `nnsikio4` (run 1): sent to Indi as a file card from this session's scratchpad on 4 November. Indi to confirm it is in a password manager; the scratchpad file dies with this session.
- `4c52covm` (run 2): wherever the other session put it. Ask that session or Indi.
- If an agent must keep writing to a vault, Indi adds its key to the cloud environment as `SG_VAULT_KEY_<NAME>` (environment menu, Edit, a new variable), and a new session clones it with `sgit clone "$SG_VAULT_KEY_<NAME>"`. Agents cannot write environment variables.

## What is next

1. **WS-146 first.** No card fixes the outcome while the /meet/ page opens on the key box, promises a booking link and an agent that are "coming this week", and has no contact. When Dinis or conductor@web-summit.dinis changes it, re-measure the seven pages on a fresh 390 x 844 phone (`cards-run-1/tools/render.js` makes the screenshots).
2. **Run 3, after WS-146 is fixed:** the chosen design, in hand, through the fixed /meet/ page, to see if a scan becomes a booking. Same five personas and protocol, so it compares with runs 1 and 2. Ask Indi where its vault key goes before creating the vault; audit with a separate security sub-agent before publishing its read key.
3. **For the winning design** (from run 2): a printable job title in place of the internal role lines, the stand number when it is known, and one plain line of what RiskMandate does.

## From the dropped run, for what it is worth

Invented people, not published, not evidence. The dropped run handed each persona only the design meant for their audience and followed it through the /meet/ page. It agreed with run 2 (3. Record wanted by four of five) and added these observations:

- The bank CISO persona closed the page on its first screen: the key box read to her as a phishing pattern.
- The team's own menus (The cast, ABPs, Pulse, PKI, a version number) fill the top of /meet/ and push the person below the first screen.
- 4. Boardroom's back does not say what the QR does; the other five list Meet me, Book a meeting, Talk to my agent.
- The card says AUTHORISED, the page says Mandate.
