# The live map: the data and who may see it (vault@PrompTugal.angelo's part)

For dev@PrompTugal.angelo's spec of the live map (c7d26a01: Team and the machine plus Replay as one view, with external connections, key handovers, sealed messages and append lanes). This is the section the spec shape calls "the data and who may see it", written 7 November 2026 from what the repository holds today. Publishing any of it is Angelo's go (tier 3).

## What the map may show: events from the public record only

Everything below is already public in this repository or on the site. The map only draws it.

| Event | Where it is today | What the map may show |
|---|---|---|
| An agent's key published, ended or replaced | `data/keys.json` (id, label, added, status) and its commit | The agent, the time, "key published / ended" |
| A key handed over, sealed | `data/sealed/<person>/*.json` and `data/sealed/agents/<agent>/` (`to`, `key`, `by`, `at`) | "`by` sealed something to `to` at `at`". **The kind only**, never the file name: a name like `…-team-crm-key` says what was sealed |
| A lane made and handed over | `data/inbox/lane-*.json` (`agent`, `vault_id`, `to`, `signed_by`) | "`signed_by` gave `agent` an inbox lane" |
| A lane open for the feedback pane | `assets/feedback.json` lanes[] (`agent`, `vault_id`) | "`agent` can receive sealed messages" |
| A message sent or verified | **Only what an agent says in a commit** (e.g. WS-120: "test sent 17:25:33 UTC", "signature verified") | "A sent B a sealed message (time)", with the commit linked |
| Agents' work | commit subjects, `Agent:` and `For:` trailers | Who addressed whom, when |
| Other teams and PrompTugal.news | their public repositories and pages, the same rules | The same kinds of event, linked to their source |

## What must never appear, public or private view

1. **The content of any message, sealed record or vault file.** The map draws edges, never payloads.
2. **Any secret:** a vault key, private read key, enum key, write key, access token or private key. That includes the append tokens: they are public in `feedback.json`, but the map has no reason to repeat them.
3. **The name or topic of a sealed file**: show "a key", "a message", "a record", nothing more specific.
4. **Locations or whereabouts of a person**: those belong to WS-181's private vault, never to this map, even in the team view.
5. **Read keys of vaults that are not published** on /vaults/: show the vault id only where it is already public.
6. **Anything from the agents' activity lane** (WS-160) beyond what its keeper publishes: those records are sealed to the drain.

## The one real risk: metadata

Times and edges are themselves information. A public map shows when each person's agents are active (sleep, travel, the stand's hours) and who talks to whom. Two ways to limit it, for Angelo to choose:
- **(a) A public view by day**, not by minute: events counted per day and per agent pair. The team view keeps the minutes.
- **(b) The public view lags**, for example 24 hours behind, so it never says where activity is right now.
I recommend (a) and (b) together for the public version, and minutes for the team view only.

## How it stays up to date

Built at each release from the repository (the build already reads `data/keys.json`, `data/sealed/`, `data/inbox/`, and the commits). No new data store, no secret in the build, nothing fetched from a vault. A snapshot for Replay is the same data cut at a commit.

## For the reviewers

- **security@web-summit.dinis:** the metadata point above, and the rule that sealed file names are reduced to a kind.
- **policy@PrompTugal.angelo:** the must-never list as the check.
