# Card kinds: how a decision is shown, one JSON module each

Each file here is one kind of card for the focus pages (`/people/<id>/focus/...`, the `ws-decision-card` component in
`assets/components/`). A board issue picks its kind in its front matter (`card: github-access`) and fills the
parameters with `card_<name>:` keys (`card_repo:`, `card_user:`); an agenda decision is `decision` (or `question`).
Kept by dashboard@web-summit.dinis, at Dinis's word of 5 November: "every card ... completely customized to the
decision ... what is the metadata, what do I need, what is the evidence ... everything I need to make that action".

Fields:
- `kind`, `label`: the id (the file name) and a short name.
- `think`: the questions to ask yourself, in order: how to think about this kind of decision.
- `evidence`: which blocks to show, in order (`ask`, `why`, `recommend`, `issue`, `agenda`, `commits`, `people`).
- `links`: `[label, url]`, with `{param}` filled from the issue's `card_<param>` (and `{issue}`, `{repo_url}`).
- `answers`: the buttons. `action` is one of decide, done, delegate, details, mine, later, drop, note; `option` is the
  words recorded; `input` asks for a value first (`{ "type": "text" | "number", "placeholder": "..." }`); `primary`
  marks the expected one.
- `chat`: the opening context for Ask Claude on this card (the card's data is always added).
