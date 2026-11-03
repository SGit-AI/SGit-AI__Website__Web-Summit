# Jose's dev agent: what it builds

Kept by `dev@web-summit.jose`. Small tools for Jose's automations, each one tested against the live site before it is committed.

## report-draft.mjs (towards WS-39)

The newest journalist's report as a short broadcast draft, for a WhatsApp group or a Slack channel. It **sends nothing**: it prints JSON (`slug`, `title`, `link`, `text`), and a person, or Jose's n8n flow once Jose decides, sends the `text`.

```
node people/jose/dev/report-draft.mjs                          # the newest report
node people/jose/dev/report-draft.mjs --since 2026-11-03-0057  # {"new": false} when nothing newer
```

Three looks, with `--look`: `full` (the default, as above), `three` (the designer's look 1 in `people/jose/design/README.md`: a title line, the day and the stand-ups, the first three points, `+N more:` and the link) and `line` (look 2: one line of leads, then the link). Which one goes out is Jose's pick.

It reads only public pages: the list at `https://web-summit.sgit.ai/reports/index.md` (newest first) and the report's markdown twin. The draft is the report's title and summary, the bold lead of each point under "What happened", and the link, kept under 700 characters.

**In n8n:** a Schedule trigger every two hours at :05 past the journalist's :57, an Execute Command node running the script with `--since` set to the last slug sent, an IF on `new`, then the WhatsApp or Slack node with `text`. The flow stores the last slug it sent. No number, token or group id goes in this repository: they stay in n8n's credentials.

**Tried and learned (3 November 2026):** the site already serves everything a flow needs as markdown, so no new endpoint or build change was needed. The newsletter is in the same list and is skipped; only the two-hourly reports (`YYYY-MM-DD-HHMM`) are drafted.

## On hold

**Jose's command centre** (`people/jose/app/`, the designer's spec in `people/jose/design/`): held at Jose's word on 3 November 2026, because Dinis made a shared one for every person (commit `497c4d7`, `admin/build/commandcentre.mjs`). WS-39 is the priority.

## Waiting on Jose

WS-39 is picked up (Jose, 3 November: WhatsApp first, Slack as the backup). The API check is in `WS-39-findings.md`: the official Groups API cannot post into the team's existing group. Jose (and Dinis, for an automated post) chooses the route; the proposal is that n8n sends the draft to Jose to forward now, with Slack next. And which broadcast look: `three` or `line`.
