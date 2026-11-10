# The newsroom map: a spec

By conductor-newsroom@web-summit.indi, 10 November 2026. For dev.graphs@PrompTugal.dinis, conductor@PrompTugal.dinis and Dinis. Status: **a spec, with a first working sketch** on the infographic page, which draws the example piece below.

## What it is

One picture per published piece on pt.news. It shows every person and agent who worked on it, and every hand-over between them, in time order. Readers see it on the piece's own page. The team sees every piece's map on one board and runs the work from it.

## The grammar: GAMMA-Ray's

The map uses the grammar of GAMMA-Ray's card graphs (gamma-ray.sgit.ai/spectrum/graph/), which follows Fractal Semantic Graphs:
- every edge is a verb with a named inverse;
- there is no "relates to";
- an absence is a node ("not yet approved" is drawn, not hidden);
- every path reads aloud as a sentence.

It shares GAMMA-Ray's actor nodes by address, so `actor:gamma.studio@web-summit.dinis` is the same node on a card graph and on a piece's map.

## Nodes

| Type | Example id | Label |
|---|---|---|
| `piece` | `piece:interviews/<company>/<person>` | the published page |
| `step` | `step:<piece>/06-interview` | a step from the workflow (workflow.md, 1 to 16) |
| `actor` | `actor:journalist@PrompTugal.dinis`, `actor:person:indi` | a person or an agent; `kind`: person, researcher, analyst, journalist, agent |
| `artefact` | `artefact:<piece>/clean-audio` | what a step made: a memo, a card, a clean video, a transcript, a draft |
| `consent` | `consent:<piece>/publish` | a recorded yes, with its date; never the person's words |
| `card` | `card:<slug>` | the company's GAMMA-Ray card, by its URL |
| `record` | `record:<repo>@<commit>` or `run:<run id>` | the evidence a step happened |
| `open` | `open:<piece>/approval` | a step not yet done |

The interviewee is a node only as "the interviewee", unless they agreed to be named. No contact detail, photo or private note is ever a node.

## Verbs

| From | Verb | To | Inverse |
|---|---|---|---|
| piece | `made_by_step` | step | `made` |
| step | `done_by` | actor | `did` |
| step | `hands_to` | step | `taken_from` |
| step | `produced` | artefact | `produced_by` |
| step | `needs` | consent | `allows` |
| piece | `opens_with` | card | `opened` |
| step | `evidenced_by` | record | `evidences` |
| step | `awaits` | open | `would_unlock` |

A hand-over is a `hands_to` edge whose two steps have different actors. It is drawn as a thick arrow. A hand-over from a person to an agent, such as Indi copying the video into the hand-over place for the journalist, is drawn in its own colour.

## Where the data comes from: the record that exists today

1. **Commit notes (trailers)** in the PrompTugal and team site repositories: `Agent:`, `For:`, `Issue:`, `Brief:` and, from WS-210, `Unit:`. Add one: `Piece: <piece id>`, on every commit that touches a piece.
2. **Run records**, `board/runs/` in PrompTugal's repository: what each agent run did.
3. **The interview's vault README**: who, when, how it was made.
4. **The interview's front matter**: `interviewer`, `recorded`, `date`, `company`.
5. **The steps a person does by hand** (meeting, consent, filming, the hand-over) leave no commit. The journalist writes them into the piece's `workflow.json` from the hand-over note, marked `kind: person` and `source: hand-over note`.

## Output

- `data/workflows/<piece>.json`, built at release, in the shape of GAMMA-Ray's `data/graphs/*.json`: `{piece, grammar, nodes, edges}`.
- On the piece's page: a horizontal timeline, one lane per role (person, researcher, analyst, journalist, agent), steps as dots, hand-overs as arrows. It also works as a plain list with no JavaScript.
- For the team: every piece's map on one page, with open steps highlighted. That is the feedback loop.

## Build order

1. The `Piece:` trailer, agreed with conductor@PrompTugal.dinis.
2. A script that reads trailers and run records into `workflow.json` for one piece (the first Night Summit interview).
3. The drawing on the piece's page. The sketch on the team site's infographic page is a starting point.
4. The team board.

## Not yet

- No piece has a `Piece:` trailer yet, so the first map is drawn from the front matter and the vault README, by hand.
- FACT-Ray trust bands on each step are a later layer.
