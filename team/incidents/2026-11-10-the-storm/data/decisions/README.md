# The decision graph of the storm (WS-214)

Kept by incident.researcher@web-summit.dinis for the incident team, the dashboard and Vicky's agents (as material). JSON first: read the data, not the pages.

## Files

- **`graph.json`**: who decides what, and what each decision followed.
  - `nodes[]`: decision-makers (IPMA, ANEPC, the government, the Interior Ministry, the Prime Minister, the Câmara de Lisboa, schools, Metro, Carris, CP, Lusoponte's bridges, the tunnels, ferries, coaches, the airport, the maritime authority, the venue, Web Summit, the side events). Fields: `id`, `name`, `kind`, `role`, `label`, `source`, `read`, `read_by`, and `blocked` where the source refuses us.
  - `edges[]`: decisions. `by` is the node that decided; `to` the nodes it touches; `follows` the ids of earlier decisions it followed; `at` when it was made (UTC; empty if not yet); `status` is `happened`, `not_announced`, `expected` (hypotheses only) or `unknown`; `note` where the time or source needs a caveat; `reasons`/`against` on hypotheses.
  - `effect_from_utc`, `effect_to_utc`, `effect_note` on every edge: the hours a decision covers, only from the source's own words; null with "hours not stated" (and any day named) where it gives none.
  - `first_priority`: the edge everyone is waiting for (`websummit-wednesday`).
- **`sources.json`**: every source used: URL, what it holds, how often it changes, whether a machine can read it, its status when last tried, and `parser_ask` where we need incident.dev@ to parse one part.

## Labels (on every node and edge)

- **fact**: read on the decision-maker's own channel, by us or by a named desk.
- **evidence**: a secondary source (press, a reported statement) or a primary page we could not read. Holds until a primary source says otherwise.
- **hypothesis**: our reasoning, with `reasons` and `against`. Never stated as fact.

Every item has `source` (URL), `read` (UTC) and `read_by` (us, or the desk whose read we reuse: weather@PrompTugal.vicky, social.watch@PrompTugal.dinis). Lisbon is on UTC in November, so local times in Portuguese sources are UTC.

## Lead times (first read)

IPMA's red warnings for Wednesday were in the press by 08:05 on Tuesday (DN; Observador 08:34). The Interior Minister announced the alert situation at about 09:17 at ANEPC's press conference (DN 09:14, Observador 09:17, Negócios 09:35): about 1 h 12 min after the red warnings were first reported and about 26 h 43 min before they start (12:00 Wednesday). The declaration was published on portugal.gov.pt at 12:10. At 09:30 the minister said Web Summit is an indoor venue and the organisers' call. The government's recommendation to suspend Web Summit (17:53) came 8 h 36 min after the announcement. Web Summit's own page calling off Day 2 (19:09) came 1 h 16 min after the recommendation and 16 h 51 min before the red warnings start. **Corrected at 01:00 UTC on 11 November:** this paragraph used to say the alert came two hours before the red warning and used 12:10 for the alert; both were the times we first read, not when it happened.

## Rules

Public sources only; no contact details; nothing about a private person. A host that refuses us is recorded under `blocked` and in `team/incidents/agents/researcher/status.json`; we never get round a bot check.
