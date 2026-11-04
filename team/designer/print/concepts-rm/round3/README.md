# RiskMandate business cards, round 3: the revamp

By designer@web-summit.indi, 4 November 2026, from the [card revamp handover](https://claude.ai/artifact/CXYHsdD4bYD1FW38UNvmKS) (the synthetic user tests, WS-142). Record won round 2 (4 of 5 invented buyers picked it); Indi chose Record for everyone plus a Terminal version for engineers.

**Not for print yet.** Each card carries two grey placeholders:

- **"Job title to confirm"**, until each person gives a plain job title. Vicky's card already reads "Project Manager", from `people/vicky/business-card.json`.
- **"Stand number to confirm"**, until the stand is known.

Change both in `make-round3.py`, or add a person's `title` to their `people/<id>/business-card.json`, then remake.

| Design | For | Front | Back |
|---|---|---|---|
| R3-1 Record | everyone | Seal + RISK MANDATE, "AGENT BEHAVIOUR POLICIES", "Would your agent pass an audit?", then REACH / AUTHORISED / GAP | Name, title, Web Summit Lisbon, Thursday 12 November, stand, URL beside the QR |
| R3-2 Terminal | engineers | Seal + RISK MANDATE, "AGENT BEHAVIOUR POLICIES", "Building is not authorising.", the brand line, "Open source, and sixteen are published free." | The same back, on the dark canvas |

## The handover's brief, and where each point landed

| Must have | Done |
|---|---|
| What RiskMandate does, in words, on the front | The brand's own line, word for word (Indi's choice): R3-1 as the three rows, R3-2 as one line |
| A plain job title | A grey placeholder until the titles come; Vicky's "Project Manager" |
| "Web Summit Lisbon" and the stand beside "Thursday 12 November" | On both backs; the stand is a grey placeholder |
| RiskMandate's name in words on the front | RISK MANDATE beside the seal, top left |
| The QR as it is, with the URL beside it | 24 mm, the person's own file, the URL printed beside it |

**Avoided, as the brief asks:** personal slogans, "Talk to my agent", and the "Meet me" / "Book a meeting" pair.

**Not done yet, waiting on the team:**

- a named framework (DORA, the EU AI Act);
- a contact route beside the QR (WS-146).

## Checked (`check-concepts.py <scratch> round3`: 28 sides, OK)

- **Print basics:** the same checks as rounds 1 and 2: size and bleed, outlined text, safe zone, no overlaps, the supplied seal with its clear space.
- **QR:** each is the person's own and decodes to its URL.
- **Type and contrast:** 7 pt minimum; WCAG AA contrast, including the grey placeholders.
- **Copy:** every line is checked against its source:
  - the headlines, from `content/design.md`;
  - the event lines, from `content/meet*.md`;
  - the product line and the number hook, from the brand page;
  - the two placeholders, by their exact text.
