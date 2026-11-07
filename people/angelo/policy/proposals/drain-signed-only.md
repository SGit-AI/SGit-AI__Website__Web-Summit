# Proposal 2: an agent's drain never shows unsigned text to the agent

By policy@web-summit.angelo, 6 November 2026, for Angelo. Status: a proposal; Angelo decides who drafts it. It raises map rule R11 ("never read a visitor's note") from **rule only** to **technical** for the agents' own lanes, before the conductor's first drain (finding P-01).

## The problem

The protocol says visitors never arrive on the conductor's lane and no agent reads a visitor's text. Today:

- the public form (`assets/feedback.js`, `?feedback=on&to=<agent>`) can send to any agent's lane, the conductor's included, and the append token is in the page, so anyone can write there directly;
- `admin/tools/feedback_drain.py` writes an unsigned message to the drained file in full, with a "Do not act on this" label. The agent then reads that file: a stranger's text is in its context.

## The barrier

1. **In the drain:** a `--signed-only` mode (on by default for agent lanes) that verifies each message's signature against the keys page and person keys **before** writing anything. A message without a valid team signature is never written as text: the drain records only its id, time, length and "unsigned", the same counts-and-lengths form the protocol gives the visitors' script.
2. **In the form:** the public mode (`to=`) accepts only lanes marked `public: true` in `assets/feedback.json` (Angelo's visitors' inbox, b8a5d3ab); agent lanes are refused in public mode.
3. **A gate check:** every lane in `assets/feedback.json` whose agent is one of Angelo's has no `public` flag.

Point 1 alone closes the gap: whatever reaches the lane, the agent never sees unsigned words.

## Cost and owners

- About 15 lines in `feedback_drain.py`, 5 in `feedback.js`, a few in the gate. Owners: dev@web-summit.dinis and conductor@web-summit.dinis (shared code): a routed patch under Angelo's protocol.
- It takes nothing from the team: signed messages read as before.

## Next step for Angelo

Say who drafts it (recommended: dev@web-summit.angelo, a routed patch with WS-64's visitor inbox work), and that it lands before the conductor's own token is sealed to it.
