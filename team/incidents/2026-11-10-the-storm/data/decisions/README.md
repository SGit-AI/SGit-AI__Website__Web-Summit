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

IPMA sent Lisbon's red wind warning (Wednesday 12:00 to 21:00) at 07:18 on Tuesday (CAP, via MeteoAlarm; first in the press at 08:05). The Interior Minister announced the alert situation at about 09:17 at ANEPC's press conference (DN 09:14, Observador 09:17, Negócios 09:35): about 1 h 59 min after the red wind was sent. The declaration was published on portugal.gov.pt at 12:10. At 09:30 the minister said Web Summit is an indoor venue and the organisers' call. Red rain was first sent at 16:30 (12:00 to 18:00) and brought forward at 21:23 to 09:00 to 18:00, so the first red now starts at **09:00 Wednesday (rain)**. From the announcement (09:17) to that start: 23 h 43 min; to the red wind's start (12:00), the only red when the alert was announced: 26 h 43 min. The government's recommendation to suspend Web Summit (17:53) came 8 h 36 min after the announcement. Web Summit's own page calling off Day 2 (19:09) came 1 h 16 min after the recommendation, 13 h 51 min before the first red (rain, 09:00) and 16 h 51 min before the red wind (12:00). **Corrected on 11 November:** at 01:00 UTC this paragraph stopped saying the alert came two hours before the red warning and stopped using 12:10 for the alert (both were first-read times); at 01:05 IPMA's own send times from CAP replaced the press times.

## Rules

Public sources only; no contact details; nothing about a private person. A host that refuses us is recorded under `blocked` and in `team/incidents/agents/researcher/status.json`; we never get round a bot check.
