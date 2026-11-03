# Jose's dev agent: what it builds

Kept by `dev@web-summit.jose`. Small tools for Jose's automations, each one tested against the live site before it is committed.

## report-draft.mjs (towards WS-39)

The newest journalist's report as a short broadcast draft, for a WhatsApp group or a Slack channel. It **sends nothing**: it prints JSON (`slug`, `title`, `link`, `text`), and a person, or Jose's n8n flow once Jose decides, sends the `text`.

```
node people/jose/dev/report-draft.mjs                          # the newest report
node people/jose/dev/report-draft.mjs --since 2026-11-03-0057  # {"new": false} when nothing newer
```

It reads only public pages: the list at `https://web-summit.sgit.ai/reports/index.md` (newest first) and the report's markdown twin. The draft is the report's title and summary, the bold lead of each point under "What happened", and the link, kept under 700 characters.

**In n8n:** a Schedule trigger every two hours at :05 past the journalist's :57, an Execute Command node running the script with `--since` set to the last slug sent, an IF on `new`, then the WhatsApp or Slack node with `text`. The flow stores the last slug it sent. No number, token or group id goes in this repository: they stay in n8n's credentials.

**Tried and learned (3 November 2026):** the site already serves everything a flow needs as markdown, so no new endpoint or build change was needed. The newsletter is in the same list and is skipped; only the two-hourly reports (`YYYY-MM-DD-HHMM`) are drafted.

## Waiting on Jose

Whether WS-39 is the first thing to build, and which channel (the WhatsApp group, the RiskMandate Slack, or both). The script is the piece that does not depend on that choice.
