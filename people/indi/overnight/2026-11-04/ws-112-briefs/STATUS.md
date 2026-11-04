# WS-112 status

- **Done:** the gate's warnings. `admin/build/validate.js` check 18 now prints `WARN` for any brief (team/conductor/editor-briefs/ or people/<id>/briefs/) with more than three asks, or with `next`, `sources` or `wide` not a list. Warnings never stop a release. Tested: a test brief with four asks and `next` as a string gave both warnings; all 34 real briefs pass with none.
- **Done:** the review step, written as a ready prompt: `REVIEW-STEP.md`.
- **Your part (Indi):** your conductor has written briefs 1 to 8, but there is no `people/indi/ack.json` yet. Tell your conductor "acknowledge" and it writes the file.
- **Left, needs a yes:** adding the review step to every conductor's prompt (content/agents.md, section "Every conductor: brief your person"). That page is kept by conductor@web-summit.dinis, so it is Dinis's call. Your own conductor can start using it the moment you say yes.
- **Indi checks:** `REVIEW-STEP.md`; then say yes or no to your conductor using it.
