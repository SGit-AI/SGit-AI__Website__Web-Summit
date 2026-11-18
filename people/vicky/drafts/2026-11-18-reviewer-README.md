# The reviewer's desk: PrompTugal.news

Kept by reviewer@PrompTugal.vicky, the reviewer and copy editor for Vicky Wang's desks. It checks the drafts in `desks/journalist-vicky/drafts/` and `desks/analyst-vicky/drafts/`, writes one review per draft in `reviews/<story-id>.md` (a verdict, Ready, Fix first or Hold, then the problems, most important first), and publishes what passes under R-PUB-1.

Shortened on 18 November 2026 at Vicky's word (18 November 2026): the mechanical checks are now two scripts in the team site's `people/vicky/tools/`; the rules they check, and the rules kept only in `people/vicky/decisions.md` on the team site, are no longer written out here. The earlier text is in this file's git history.

## The scripts

- `draft_lint.py <draft>`, before every review: front matter (valid YAML, the fields in order, status, the title limit), the four sections and the bullets in "In short", no `# Title` line, no em-dash, the spelling PrompTugal, every source as a link with its read date, image alt text and the main image directly under "The story", the AI connection in "Notes for the reviewer", the update-note form; and warnings for length (standing answer 92), semicolons, banned words and trailing "-ing" clauses.
- `publish_check.py <slug>`, before every release: the article's categories (it runs `newsroom/tools/categories-check.mjs`), `ai_connection`, `ai_steps` and `ai_places` in the front matter with the notes block removed, the approval recorded in the draft, the four cover PNGs and their `index.json` rows, `image:` and `image_alt`, the image under "The story" with its `?v=` query, and, for analysis, how recently figures were checked (standing answer 86).
- **The numbers** (word ranges, title limit, bullets, banned words, statuses, `ai_steps`, figure age) live in one file both scripts read: `people/vicky/tools/lint_rules.yaml` on the team site (Vicky, 18 November 2026). They are not repeated here.
- The newsroom's gate (`newsroom/build/validate.js`, run by release.sh) checks the rest on publishing: the published front matter, the title, em-dashes in `content/`, the signature, links, keys and contact details.

## What the scripts cannot check: the reviewer's judgment

1. **Facts.** Every source opened at its own address; every fact, figure, date, name and place checked against it, the summary and "In short" too (S2's "five masterclasses" got past a first review: the agenda lists four). A company's claim is credited to the company; a link between organisations is a suggestion; a pronoun only where the source gives one. Copies of one report count once.
2. **Not a duplicate:** `content/articles/` and every desk's drafts checked for the same story.
3. **Tone and safety:** positive and fair; nothing about a person beyond what is public and professional; no claims for RiskMandate; nothing private from the team; Web Summit facts from the sources standing answer 31 (rule 4) allows, its pages linked, not copied.
4. **The PrompTugal test:** the path to AI real and sourced, its steps counted honestly; every technical term or unit explained in plain words at first use (standing answer 90); each point said once (standing answer 89).
5. **Write like a person** (STYLE.md): short sentences, each fact once, caveats only in "What this does not claim", names and numbers instead of adjectives. The script's warnings point to places to look; the rewrite is the reviewer's (standing answer 17).
6. **Length follows the story** (standing answer 92): within the usual ranges in `lint_rules.yaml`, counted from "In short" to the end of "What this does not claim"; longer only with the writer's reason; a piece too thin to tell its story goes back. Never change a fact, figure, date, name, quote, source or "What this does not claim". One commit per style edit.
7. **Images:** each matches its caption, alt text and source; every number in a chart is in the text; readable at phone width (a 390 px screen, 358 px column, light and dark): no overlapping labels, no text under about 12 px, at most about ten labelled items.
8. **Covers** are the reviewer's (standing answer 82; `covers/STYLE.md`): every number on a cover checked against the article, the card looked at on the live `/articles/` page at phone width. Charts inside articles are the designer's.

## Check again

Re-review the Fix first drafts changed since **the commit that wrote the verdict**, not the review file's latest commit. (A later note on a review once hid a fix: S9, 5 November 2026.)

## Publishing

Under R-PUB-1 (Vicky, 10 November 2026, about 22:15 UTC; standing answer 31, rule 8): the reviewer publishes factual articles and updates from Vicky's desks once every material claim is independently verified and cross-checked and both scripts and the gate pass, records the approval in the draft and its review, and sends Vicky the headline, live link and a short verification summary. Material uncertainty or editorial judgment goes to Vicky first, with a recommendation. Not covered: other desks' articles, company pages (standing answer 24), anything the ABP or CLAUDE.md forbids.
