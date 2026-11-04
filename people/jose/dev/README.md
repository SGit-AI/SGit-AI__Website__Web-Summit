# Jose's dev agent: what it builds

Kept by `dev@web-summit.jose`. Small tools for Jose's automations, each one tested against the live site before it is committed.

## report-draft.mjs (towards WS-39)

The newest journalist's report as a short broadcast draft, for a WhatsApp group or a Slack channel. It **sends nothing**: it prints JSON, and a person, or Jose's n8n flow once Jose decides, sends it. Jose's n8n runs the script itself, so no draft is ever committed here.

```
node people/jose/dev/report-draft.mjs                          # the newest report, look "full"
node people/jose/dev/report-draft.mjs --look three             # the designer's look 1
node people/jose/dev/report-draft.mjs --look line              # the designer's look 2
node people/jose/dev/report-draft.mjs --since 2026-11-03-0057  # {"new": false, "id": ...} when nothing is newer
node people/jose/dev/report-draft.test.mjs                     # the tests (offline)
```

The three looks: `full` (title, summary, the bold lead of each point, the link; under 700 characters), `three` (the designer's look 1 in `people/jose/design/README.md`: a title line, the day and the stand-ups, the first three points, `+N more:` and the link) and `line` (look 2: one line of leads, then the link). Which one goes out is Jose's pick.

It reads only public pages: the list at `https://web-summit.sgit.ai/reports/index.md` (newest first) and the report's markdown twin. The newsletter is in the same list and is skipped; only the two-hourly reports (`YYYY-MM-DD-HHMM`) are drafted. It needs Node 18 or later (for `fetch`).

### The output

| Field | What it is |
|---|---|
| `id` | The report's slug, e.g. `2026-11-03-0057`: one per report, so the flow can skip repeats. |
| `created_at` | When this draft was made (ISO 8601, UTC), not when the report was written; the report's time is in `id`. |
| `source_url` | The markdown the draft was made from (`…/reports/<id>/index.md`). |
| `new` | `true` for a draft; `false` (with only `id` and `slug`) when `--since` names the newest report. |
| `slug`, `title`, `link`, `look` | The report's slug, its title, the page to link to, and the look used (absent for `full`). |
| `text` | The look's text, as before. |
| `text_whatsapp` | Plain text for WhatsApp, always under 1000 characters: no HTML and no markdown links; WhatsApp's own `*bold*` is kept, since WhatsApp renders it. If a look ran over, the last points are dropped and the link is kept. |
| `text_slack` | The same in Slack mrkdwn: `*bold*`, `&`, `<` and `>` escaped, the link as `<url\|label>` (`Read the report`, or `+N more in the full report`). |

### n8n, setup 1: Execute Command

For when the n8n host can run commands and has a copy of the script (a clone of this repository, or the one file).

1. **Schedule Trigger**: every two hours at :05, a few minutes after the journalist's :57 (cron `5 1-23/2 * * *`, UTC).
2. **Code** ("last id"): `return [{ json: { since: $getWorkflowStaticData('global').lastId || '' } }]`
3. **Execute Command**: `node /path/to/report-draft.mjs --look three --since "{{ $json.since }}"`
4. **Code** ("parse"): `return [{ json: JSON.parse($json.stdout) }]`
5. **IF**: `{{ $json.new }}` is true; the false branch ends there.
6. **The sending node Jose chooses**, with `{{ $json.text_whatsapp }}` or `{{ $json.text_slack }}`. Which channel and who receives it is Jose's decision, not recorded here.
7. **Code** ("remember"), after a successful send: `$getWorkflowStaticData('global').lastId = $json.id; return $input.all()` (n8n keeps static data only for runs of an active workflow, not manual tests).

### n8n, setup 2: a Code node, when Execute Command is off

Some n8n setups exclude the Execute Command node. Then paste the whole of **`report-draft.n8n.js`** into one Code node (JavaScript, "Run Once for All Items"). It uses only the network: n8n's `this.helpers.httpRequest` if the node has it, otherwise `fetch`, and never the file system. It reads `since` and `look` from the item before it and returns one item with the same fields.

1. **Schedule Trigger**, as above.
2. **Code** ("last id"): `return [{ json: { since: $getWorkflowStaticData('global').lastId || '', look: 'three' } }]`
3. **Code** ("report-draft"): the contents of `report-draft.n8n.js`.
4. **IF**, **the sending node** and **remember**, as in setup 1 (steps 5 to 7).

`report-draft.test.mjs` checks that the two versions give the same output (all three looks; 2, 7 and 60 points), that `text_whatsapp` stays under 1000 characters and keeps the link, that `text_slack` escapes and links, `--since`, and both of the Code node's ways of fetching. If one copy is changed, change the other and run the test. It also runs every two-hourly report in `content/reports/`, as the journalist really writes them: each must yield at least one point, and every look must stay under 1000 characters with the link. On 3 November at 09:40 UTC, all 8 did (11 at 15:40); the 06:57 report has one point, which is real, not a parsing miss.

No number, token, group id or invite link goes in this repository: they stay in n8n's credentials.

### Dry run on the newest report

`node people/jose/dev/report-draft.mjs --look three`, 3 November 2026, 02:09 UTC, against the live site (v0.2.33). The newest two-hourly report then was 00:57. The Code-node version, run the same minute, gave the same output except `created_at`.

```json
{
  "id": "2026-11-03-0057",
  "created_at": "2026-11-03T02:09:08.437Z",
  "source_url": "https://web-summit.sgit.ai/reports/2026-11-03-0057/index.md",
  "new": true,
  "slug": "2026-11-03-0057",
  "title": "What happened: Tuesday 3 November, 00:57",
  "link": "https://web-summit.sgit.ai/reports/2026-11-03-0057/",
  "look": "three",
  "text": "*RiskMandate team · 00:57 report*\nTue 3 Nov · stand-ups 13:00 and 18:00\n\n▸ *The print files are ready for sign-off*\n▸ *A printer can make Friday*\n▸ *The home page is built from data*\n\n+4 more: https://web-summit.sgit.ai/reports/2026-11-03-0057/",
  "text_whatsapp": "*RiskMandate team · 00:57 report*\nTue 3 Nov · stand-ups 13:00 and 18:00\n\n▸ *The print files are ready for sign-off*\n▸ *A printer can make Friday*\n▸ *The home page is built from data*\n\n+4 more: https://web-summit.sgit.ai/reports/2026-11-03-0057/",
  "text_slack": "*RiskMandate team · 00:57 report*\nTue 3 Nov · stand-ups 13:00 and 18:00\n\n▸ *The print files are ready for sign-off*\n▸ *A printer can make Friday*\n▸ *The home page is built from data*\n\n<https://web-summit.sgit.ai/reports/2026-11-03-0057/|+4 more in the full report>"
}
```

**Tried and learned (3 November 2026):** the site already serves everything a flow needs as markdown, so no new endpoint or build change was needed. Overnight, Jose asked for channel fields, a Code-node copy and no committed drafts. Tried: one wrapper (`enrich`) that adds the fields to every look, so the looks and the flags stayed as they were. Learned: an n8n Code node body is an async function, so the CLI's module can't be pasted as-is. A copy plus a test that compares the two was simpler than generating one from the other. The test fails when the copies drift (checked by changing one label).

## Conventions

- **The reviewer before every release** (Jose, 4 November, `473be416`): before `admin/tools/release.sh`, run reviewer@web-summit.jose (`people/jose/reviewer/ROLE.md`) as a sub-agent on `git diff origin/dev...HEAD`, after checking `people/jose/reviewer/hold.json`; commit its record in `people/jose/reviewer/reviews/` with the trailer `Reviewed-by: reviewer@web-summit.jose (pass)`; on a hold, release only `hold.json` and the record, and tell Jose.
- **Scheduled runs say so** (Jose, 4 November, from his mentor's suggestion): every commit from a scheduled wake, one not prompted by a person, carries the body line `Ran without a prompt (scheduled wake, <HH:MM> UTC).`, so the two-day clock before the mentor hands over is easy to see. A run Jose prompted doesn't carry it.

## WS-39 route 3 (decided by Jose)

`WS-39-route3.n8n.json`: the n8n workflow to import, made by `WS-39-route3.build.mjs` and tested by `WS-39-route3.test.mjs`. What to fill in inside n8n is at the top of `WS-39-findings.md`.

## WS-74, picked up (4 November): the public feedback form

Jose chose the vault option. Answers go through the site's feedback pane, sealed in the browser, to vault@web-summit.jose's lane. The link `?feedback=on&to=vault@web-summit.jose` (on `/videos/` and each video page) opens the pane on that lane. `lane-check.mjs` checks the lane is sealed to the vault agent's live key; `feedback-summary.mjs` makes the summary a person reads; `node people/jose/dev/WS-74.test.mjs` tests both. The plan, what is built and what is still missing: `WS-74-plan.md`. The earlier prototype `feedback-check.mjs` provides the scrubbing.

## Vaults are not this agent's job (WS-120, WS-129)

On 3 November at about 10:00, Jose asked this agent to create a vault named `ws-risk-mandate`. This session can't: its network blocks `dev.send.sgraph.ai` and `sgit.ai`, and it has no access token. My first answer told Jose to add `SG_SEND_ACCESS_TOKEN` to this agent's environment. **That was wrong.** WS-129 ("secrets per environment") says the token and vault keys belong only in the vault agent's own environment, because every session in an environment can read its variables. `vault@web-summit.jose` already exists (`66b19976`), so it makes the vault there, and `dev@web-summit.jose` never holds the token.

## On hold

**Jose's command centre** (`people/jose/app/`, the designer's spec in `people/jose/design/`): held at Jose's word on 3 November 2026, because Dinis made a shared one for every person (commit `497c4d7`, `admin/build/commandcentre.mjs`). WS-39 is the priority.

## Waiting on Jose

WS-39 is picked up (Jose, 3 November: WhatsApp first, Slack as the backup). The API check is in `WS-39-findings.md`: the official Groups API cannot post into the team's existing group. The route is Jose's decision (and Dinis's, for an automated post), and is not recorded here. Also Jose's: which broadcast look, `three` or `line`.
