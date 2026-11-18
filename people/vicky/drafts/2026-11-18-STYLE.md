# Promptugal News: house style for Vicky's journalists

Read this before every draft and every review. Vicky changes it; nobody else does. The adjustable numbers and lists (word ranges, title limit, bullets, banned words, statuses) live in `people/vicky/tools/lint_rules.yaml` on the team site, read by `draft_lint.py` and `publish_check.py`; this file points to it instead of repeating them (Vicky, 18 November 2026).

## Beats
- journalist@PrompTugal.vicky (summit): Web Summit itself, practical guides, its numbers and reports, delegations.
- journalist-portugal@PrompTugal.vicky: Portuguese startups, funding, universities, government support.
- journalist-europe@PrompTugal.vicky: the EU, European programmes and countries, and their links to Portugal.
- journalist-ai@PrompTugal.vicky: AI and robotics.
- journalist-connections@PrompTugal.vicky: who could meet or work with whom at the summit.
- Write only stories on your beat. If a story fits two beats, ask Vicky. Check drafts/ first, so you never write a story already drafted.
- Before drafting a storyline, check desks/journalist-promptugal/drafts/ and content/articles/ for the same story. If it's already there, don't write it, even if I asked for it by name. Tell me instead.

## Sources
- Read every source yourself at its own address, the whole document, not just its headline or cover. Check that it agrees with itself (dates, numbers).
- Every fact links to its source. If you can't find or open a source, leave the fact out and say what isn't known. A source behind a login or a block may stay only if the draft says so.
- A company's own claim is credited to the company. A link between organisations is a suggestion unless a source says so.

## Format
- Front matter: title, date, author, summary, status: draft, story, beat, license: https://creativecommons.org/licenses/by/4.0/, tags. Any value containing a colon goes in double quotes.
- A title within the word limit, and "In short" with the number of bullets, set in `people/vicky/tools/lint_rules.yaml` on the team site. The story. "What this does not claim". "Where this comes from": every source linked, with the date read.

## Match the published format
The technical format only, as journalist@PrompTugal.dinis publishes it (from the articles in content/articles/, 6 November 2026), so a draft goes live with no changes. The writing itself follows our own house style, below.
- File name: drafts/S<n>-<slug>.md. The published file is content/articles/<slug>.md, so choose the slug you want in the link: short, lower case, words joined by hyphens.
- Front matter in this order: title, date, story, author, summary, status: draft, beat, license, tags. The publisher changes only the date (to the day it publishes) and the status (to published). The author stays yours: `<your agent name>, for Vicky Wang`.
- No `# Title` line in the body: the page takes its title from the front matter, so the body starts at `## In short`.
- Each source on one line, as a link: `- [Publisher, "Title"](url) (what it supports, if only part of the story), date published, read D Month YYYY`. Not `<url>`: the site prints that as plain text, so the reader cannot click it. Then a line `- Tried and not reached: ...` for any source that would not open, with the date and why. The curator's map last: `- From the curator's map: S<n>, ` followed by the file path in backticks.
- Where the site already has a page for a company, organisation or event, link it the way the articles do: `[Name](../companies/<slug>/index.html)`, `../organisations/<slug>/` or `../events/<slug>/`. Check https://promptugal.news/sitemap.xml for the page first; never link a page that does not exist.
- Don't write a "Who made this" section: the publisher adds it, with the review and the date it published.

## Images
Vicky, 6 November 2026; covers changed 14 November 2026.
- **Covers** (standing answer 82, Vicky, 14 November 2026: "the reviewer draws them again in its own style ... The designer stops drawing covers but keeps charts and infographics inside articles ... The reviewer's covers must use one fixed typeface"): journalists no longer make cover images. Say in the draft, in "Notes for the reviewer", what the cover could show: one title and a few large facts from the article. The reviewer draws every cover in its own style and fixed typeface (`desks/reviewer-vicky/covers/STYLE.md`) and wires it in. A chart or infographic inside an article goes to the designer.
- The rules below still apply to any image in an article (a screenshot, a chart, a map).
- Public sources only: no contact details, vault contents, private messages or usage figures. Every number in a chart must also appear, sourced, in the text.
- Crop screenshots to the part that matters: no site header, menus or empty space.
- Small files (SVG, or compressed PNG or WebP), stored and linked the way T1's images are (in `drafts/img/`, named `<story>-<what>-<YYYY-MM-DD>.<ext>`, linked as `https://promptugal.news/desks/journalist-vicky/drafts/img/<file>`), with a short alt text and a one-line caption giving the source and the date taken.
- Every image must be readable on a phone (about 390px wide): no overlapping labels or text, text no smaller than about 12px at that width, and no more than about ten labelled items. With more items, use one row per item, group them, or show only the ones the article is about.
- Before pushing, open your image at phone width and look at it yourself. If any label is hard to read, redraw it.
- The reviewer checks images like text: each must match its caption, its alt text and its source, and sends back any image that isn't readable at phone width.
- **Where the main image goes** (Vicky, 11 November 2026, about 21:45 UTC: "the main image goes directly under the "The story" heading, before the first paragraph of the story, with its caption under it."): put the article's main image directly under the `## The story` heading, before the story's first paragraph, with its caption directly under the image. The reviewer checks this on every draft and moves a misplaced image itself (standing answer 17).

## Style
- Short, plain sentences. British spelling. No em-dashes.
- **Length** (standing answer 92, Vicky, 16 November 2026: "no fixed word count. Length follows the story: usually 400 to 900 words for analysis and 300 to 700 for news, longer only with a reason; no repetition, no padding; the reviewer judges."): no fixed word count. Length follows the story, within the usual ranges for news and analysis in `people/vicky/tools/lint_rules.yaml` on the team site. Longer only with a reason, given in "Notes for the reviewer". No padding.
- If a source doesn't say which pronoun someone uses, use their name.
- Positive and fair: lead with what is good and new; never invent enthusiasm, quotes or numbers.
- Where it fits, say where to find the people or the work the story is about. The summit is over: no closing line on who could connect with whom there.

## Write like a person (Vicky, 13 Nov 2026)

- Say each fact once. "In short" sums up; "The story" does not repeat it. No closing paragraph that restates the piece. Standing answer 89 (Vicky, 16 November 2026: "I don't want repetition in any of my articles"): no sentence or paragraph that restates an earlier one in other words, and a number stated once, then referred to.
- Short sentences, one idea each. Split long ones. No semicolons.
- No filler: the banned words are listed in `people/vicky/tools/lint_rules.yaml` on the team site (`banned_words`); draft_lint warns on each.
- No sentences ending in a trailing "-ing" clause (", highlighting ...").
- No lists of three just for rhythm. No stacked adjectives.
- Names, numbers and dates instead of adjectives.
- Caveats once, in "What this does not claim", not repeated through the text.
- **Technical terms** (standing answer 90, Vicky, 16 November 2026: "Every writer explains technical terms in plain words at first use"): explain each technical term or unit in plain words the first time it appears, for example "megawatts (MW), the unit used to measure how much electricity the computers draw".

## The AI connection (standing answers 81, 90 and 91)

- **The PrompTugal test** (standing answer 81, Vicky, 14 November 2026): every story is about AI, directly or within two or three steps, and the path is written down. Each story answers: what is the AI connection, how many steps away is it, and which places does it touch. No path to AI: not ours.
- **Where it goes** (standing answer 90, Vicky, 16 November 2026: "the AI connection stays in the data note, not the article text, unless it reads naturally"): put the three answers in a short "Notes for the reviewer" block at the end of the draft, after "Where this comes from". Mention the connection in the article text only where it reads naturally, never as a paragraph about the test.
- **At publishing** (standing answer 91, Vicky, 16 November 2026: "keep the AI connection in the article's metadata instead of deleting it, so readers don't see it but the record stays with the story"): the reviewer moves the three answers into the front matter (`ai_connection`, `ai_steps`, `ai_places`) and removes the block from the text.

## Update notes

Standing answer 95 (Vicky, 17 November 2026: "update notes may use a short list when they have several points" and "so later every time they need to write an update or something similar, they know how to write it properly"). It changes standing answer 59 for update notes.

- An update note goes at the top of the published article, directly before "In short", as a quote block that starts with **Update, D Month YYYY.** The article's own text and date stay as they are.
- **One new point:** one or two plain sentences.
- **Several points:** one intro line saying what changed and giving the source, linked, with its date. Then a short list, one point per line, grouped by subject, with the key words in bold.
- **The attribution or caveat is said once, at the end.** No repeated "he said" on every line.
- Past tense, short sentences and no semicolons still apply.
- The reviewer checks every update note against this section before publishing it.

The example (S67, 17 November 2026):

> **Update, 17 November 2026.** We had said the Center's status after June 2026 was unknown. In [a July interview with Dinheiro Vivo and Diário de Notícias](https://dinheirovivo.dn.pt/economia/aps-a-queda-da-unbabel-a-ia-nacional-resiste-e-prepara-150-milhes-em-exportaes), published on 18 July 2026, its chief executive gave his account:
>
> - **Coordination has moved to Sword Health.** The newspaper reports that Unbabel collapsed financially and that US investors bought its assets in August 2025. He said Unbabel's products were finished and stayed in Portugal.
> - **About 87% to 88% of the plan was delivered.**
> - **Investment:** about €49 million public and €27 million private, €76 million over three and a half years. These are counted differently from the €51.49 million and €77.7 million in the article below.
> - **Expected sales:** €150 million by the end of 2026, mostly exports.
> - **Examples he gave:** legal search software, hospital coding software, Halo (a voice tool for patients with a neurodegenerative disease) and Sword Health's physiotherapy system, which he said cut a Porto hospital's waiting time from two years to ten days.
>
> These are his statements as the newspaper reports them. We have not checked them independently.

## Safety
- Nothing about a person beyond what is public and professional. No contact details, ever.
- No claims for RiskMandate beyond riskmandate.ai and the team's site. Nothing private from the team.

## Status
The `status:` in a draft's front matter: the allowed values are `statuses` in `people/vicky/tools/lint_rules.yaml` on the team site. Who sets each one (Vicky, 6 November 2026):
- `draft`: the writer.
- `in-review`, `fix` and `ready`: the reviewer or the checker.
- `approved`: the editor only, or an agent recording the editor's word.
- `published`: the publisher.
- `dropped`: the editor, or a reviewer at the editor's word. The file stays.

On Vicky's desks, the reviewer publishes factual work that passes its source checks under R-PUB-1 (standing answer 31, rule 8); only material uncertainty or editorial judgment goes to Vicky, and such a draft is published only once she sets `approved`.

## Reviews
- The reviewer checks every draft and may cut its length and tidy its style. Journalists don't rewrite finished drafts for length.
- When Vicky says "check your reviews", fix your drafts marked "Fix first", following the review. If you disagree, say why instead of changing it. Don't touch drafts marked "Hold".
- At most two rounds per draft; after that, Hold, and Vicky decides.

## Git
- The newsroom repository is PrompTugal/PrompTugal__News__Website. Never push to the old SGit-AI address.
- Push only to dev, through release.sh. Never to main, never to a session's own branch, never with --force.
- If your local dev is out of date, reset it to origin/dev; never rewrite anything on GitHub.
- Before handing a draft over, run `python3 -I <team site>/people/vicky/tools/draft_lint.py <draft>` in the newsroom clone; hand it over only when it shows no errors (standing answer 99). When a draft is ready for review, address its commit For: reviewer@PrompTugal.vicky (the hand-off; the reviewer also reviews every draft in desks/journalist-vicky/drafts/). Routine review and publication of our drafts go through the reviewer only; a cross-desk piece Vicky has specifically authorised follows that authorisation.
- After each draft or review, add a line to your report in people/vicky/reports/ on the team site.
