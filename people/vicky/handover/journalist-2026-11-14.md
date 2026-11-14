# Hand-over: the summit journalist (journalist@PrompTugal.vicky), 14 November 2026

At Vicky's word (14 November 2026, in this window), the summit journalist becomes the internal journalist, internal@web-summit.vicky, in the same session. This note is for the curator, so it can reassign anything still open from the summit beat (Web Summit itself, practical guides, its numbers and reports, delegations). From now on, any new Web Summit story goes to journalist-portugal, under the "Web Summit 2026" category (standing answer 35).

## First, for the curator

- **No open drafts.** Every draft on this beat is published, dropped or withdrawn. No review of mine is marked Fix first or Hold.
- **No scheduled task.** My writing task (journalist@PrompTugal.vicky scheduled run) was disabled on 12 November 2026 at 21:12 UTC and last fired at 19:53 UTC that day. My fix-only task was already disabled. I keep neither for the new role.

## My drafts and where they ended up

All are in the newsroom's `desks/journalist-vicky/drafts/`. The published article is in `content/articles/`.

| Story | Draft | Article | State (14 Nov) |
|---|---|---|---|
| S9 | S9-brazil-startup-mission.md | brazil-startup-mission | published |
| S1 | S1-your-first-day.md | your-first-day-at-web-summit | published (takedown group B: stays) |
| S6 | S6-gender-in-tech-report.md | gender-in-tech-report-2026 | published (group B) |
| S5 | S5-web-summit-in-numbers.md | web-summit-2026-in-numbers | published (group B, "borderline") |
| WS-177 | ws177-web-summit-before-2026.md | web-summit-before-2026 | published, with no `beat` line (see below) |
| S24 | S24-driving-to-web-summit.md | driving-to-web-summit | published (group B) |
| S33 | S33-ibm-sports-tech-challenge.md | ibm-sports-tech-challenge | published (group B) |
| S35 | S35-press-conferences-day-by-day.md | press-conferences-day-by-day | **withdrawn on 11 November 2026** (group A, `data/site/withdrawn.json`) |
| S40 | S40-gravitee-agent-security-survey.md | gravitee-agent-security-survey | published (listed as unclear: stays) |
| S58 | S58-thursday-last-day-guide.md | thursday-last-day-guide | published (group B) |

The company files from the overnight batch of 9 November (`desks/journalist-vicky/companies/`: 0xbow, 1password, air-apps, airia, aisle, akamai, arima, atlassian, c4ail, cerebras, cognizant) are all done. The About-claims check from takedown step 2 (standing answer 49) belongs to journalist-portugal, journalist-europe and journalist-ai, not to me.

## Open items, small

- **WS-177's beat.** The draft was published without a `beat` line, at Vicky's word on 6 November. Its uppercase path had broken a link that `topics.mjs` builds from a desk .md file. dev@PrompTugal.dinis was told then. Once that is fixed, `beat: The summit` can go back in. This is low priority, and anyone on the desk can do it.
- **S9's live article** (brazil-startup-mission) links `events/german-brazilian-startup-night/`, a page that came off in the takedown. The newsroom gate warns about it ("wsonly", step 4, release v0.1.1448 of 14 November). The fix belongs to whoever signs articles (the gate names journalist@): re-source the link or take it out, then sign again. I did not touch the article.
- **S35.** It stays withdrawn. Nearly every fact in it came from Web Summit's session pages, so it cannot be re-sourced under standing answer 31 without each company's own announcement. I do not propose bringing it back.

## Leads, unchecked, for the "what happened next" theme (standing answer 58, theme 1)

These are only pointers from my own drafts. I have checked nothing in them since the summit. Each needs a fresh read at the company's or the official source.

1. **IBM Sports Tech Startup Challenge (S33):** who won the prize challenge on Wednesday 11 November, given that the day was cancelled for Storm Charles. Look on IBM's newsroom.
2. **Gravitee (S40):** whether its CEO's press conference of 10 November produced a release or a new report. Look on Gravitee's blog.
3. **The Brazil startup mission (S9):** whether the organisers or the companies posted results after the summit. Look in their own posts.

## Where things are

- Style: `desks/journalist-vicky/STYLE.md` (newsroom).
- My run reports: `people/vicky/reports/journalist.md` (team site). This was its last role run. From now on I report in `people/vicky/reports/internal.md`.
- My prompts file for the old role: `people/vicky/prompts/journalist.md`. The new one is `people/vicky/prompts/internal.md`.
- Keys: my newsroom key `journalist-vicky-promptugal-c` is marked superseded in the newsroom's `board/keys.json` when this hand-over is made. The new key is `internal-vicky` in the team site's `data/keys.json`. Only public halves are published. No vault key was ever sealed to my journalist keys.
