# Build the team-report broadcast in n8n, step by step

By `dev@web-summit.jose`, 5 November 2026, at Jose's word: *"create me an n8n guide on how to build the idea we have with all the steps detailed, research n8n docs and latest releases on how we can do this and what are the best ways."*

**The idea (WS-39, route 3, decided by Jose on 3 November):** every new two-hourly report from the team's journalist goes to Jose on WhatsApp as one short message; Jose forwards it to the team's WhatsApp group. Slack comes next (route 4). Nothing reaches the group without Jose.

This guide builds that **by hand in the n8n editor**, node by node, with the current n8n (3.0) and the way its documentation recommends. It replaces nothing: the importable workflow in [`WS-39-route3.n8n.json`](WS-39-route3.n8n.json) still works ([`n8n-guide.md`](n8n-guide.md)); section 9 compares the two.

**What this agent could and couldn't check.** Read on 5 November 2026: n8n's own documentation, from its source repository [`n8n-io/n8n-docs`](https://github.com/n8n-io/n8n-docs) (commit `b11d16f`, 4 November 2026; docs.n8n.io itself can't be opened from this session, and the repository is the same text). Meta's pages can't be opened from here either, so the WhatsApp rules marked *(third-party)* come from vendor guides and should be checked in Meta's WhatsApp Manager. The two Code nodes below are tested (section 11); the rest has not been clicked through in a real n8n, because this agent has none.

## Contents

1. What you will build
2. What changed in n8n that matters here
3. Before you start: Meta, WhatsApp and n8n
4. Create the message template in Meta
5. Create the data table in n8n
6. Create the WhatsApp credential in n8n
7. Build the workflow, node by node
8. Test, then publish
9. The best way, and the alternatives
10. Next: an error alert, and Slack (route 4)
11. How the Code nodes were tested
12. Troubleshooting
13. Sources

## 1. What you will build

One workflow, eight nodes in a line:

```
Every 30 min, 07:05-22:35 UTC
  -> Get the reports list           (HTTP Request: reports/index.md, as text)
  -> Find the newest report         (Code: which report is newest)
  -> Not sent yet?                  (Data Table: If Row Does Not Exist)
  -> Get the report                 (HTTP Request: that report's markdown, as text)
  -> Draft the messages             (Code: WhatsApp text, template parameters, Slack text)
  -> Send to Jose                   (WhatsApp Business Cloud: Send Template)
  -> Mark as sent                   (Data Table: Insert row)
```

What Jose receives, with the template from section 4:

> RiskMandate team update, Thu 5 Nov, 00:57 report: The first stand-up decisions are on record; The first five companies; ...; and 4 more. Read it at https://web-summit.sgit.ai/reports/2026-11-05-0057/. Forward it to the team group if it is useful.

Each report goes out once. If a send fails, the report is not marked as sent, so the next run (30 minutes later) tries again.

## 2. What changed in n8n that matters here

| Change | Since | What it means for this build | Source |
|---|---|---|---|
| **n8n 3.0** is the newest major release | 27 October 2026 | Self-hosted n8n must run in Docker (no more `npm`/`npx n8n`). Read its breaking changes before upgrading; **Settings > Migration Report** lists affected workflows | n8n release notes; v3.0 breaking changes |
| **Publish**, not Activate | n8n 2.x | Edits stay a draft until you **Publish**; schedules run only on the published version | "Save and publish workflows" |
| **Execute Command** node off by default | n8n 2.0 | Don't build on running scripts; turning it back on needs `NODES_EXCLUDE` changed by whoever runs n8n | v2.0 breaking changes |
| **Code nodes run on task runners** | n8n 2.0 | Keep Code nodes to pure logic | v2.0 breaking changes |
| Code nodes can't access credentials | by design | Fetch with the **HTTP Request** node, which supports credentials | Code node common issues |
| Code node task timeout down to **60 seconds** | n8n 3.0 | Our Code nodes take milliseconds | v3.0 breaking changes |
| `$evaluateExpression()` removed from the Code node | n8n 3.0 | Not used here | v3.0 breaking changes |
| **Static data** is experimental and doesn't work in test runs; **data tables** recommended instead | current docs | "Sent already?" is kept in a data table, which also works when you test | `getWorkflowStaticData` docs; data tables docs |
| Slack API credential requires the **signing secret** | n8n 3.0 | Matters for Slack (section 10) | v3.0 breaking changes |

## 3. Before you start: Meta, WhatsApp and n8n

**In Meta** (from n8n's WhatsApp credentials page):

1. A **Meta developer account**: [developers.facebook.com](https://developers.facebook.com), **Getting Started**.
2. A **Meta business portfolio**: [business.facebook.com](https://business.facebook.com), **Create an account**.
3. A **Meta app with WhatsApp**: Apps dashboard, **Create app**, add the **WhatsApp** product, choose the business portfolio. In **App settings > Basic**, set the Privacy Policy and Terms of Service URLs, and switch **App Mode** to **Live**.
4. A **WhatsApp business phone number** on that app (WhatsApp > API Setup). Note its **WhatsApp Business Account ID**.
5. An **access token**. The one from **WhatsApp > API Setup > Generate access token** is temporary (it expires within about a day, *third-party*). For a workflow that runs every day, make a **System User** token in Meta Business Settings with `whatsapp_business_messaging` and `whatsapp_business_management`, and assign the WhatsApp account and the app to that system user *(third-party guides; check the menu names in Meta)*. Keep the token only in n8n.

**In n8n:**

- A current n8n: n8n Cloud, or self-hosted in Docker (required from 3.0). The **Data tables** tab and the **Data Table** node must be there; they are in current versions.
- Jose's own WhatsApp number, to send to. It goes only into the n8n node, never into the repository.

## 4. Create the message template in Meta

**Why a template:** a business can send free text to someone only within 24 hours of that person's last message to the business number. Outside that window, only an approved **template** is delivered *(third-party: Rasayel, Vonage)*. Reports arrive all day, so the reliable way is a template. Free text also risks a silent loss: Meta can accept the message and report the failure (error 131047) later, on a webhook this workflow doesn't have (found by `automation@web-summit.jose`, `people/jose/automation/README.md`).

**The rules a template must meet** *(third-party: Bird, ChatDaddy, Zoho's BSP notes)*:

- It can't **start or end** with a parameter ("dangling parameters"). **A body of just `{{1}}` is rejected.**
- Enough fixed text per parameter (a rule of thumb: at least three words per parameter).
- A parameter's value can't contain new lines, tabs or more than four spaces in a row.
- The category must match the content: a team update to its own member is *Utility*; promotional wording gets recategorised as *Marketing*.

**Steps, in Meta's WhatsApp Manager** (Message templates, **Create template**):

1. **Category:** Utility. **Name:** `ws_team_report`. **Language:** English.
2. **Body:**

   ```
   RiskMandate team update, {{1}} report: {{2}}. Forward it to the team group if it is useful.
   ```

3. **Samples** (Meta asks for one per parameter):
   - `{{1}}`: `Thu 5 Nov, 00:57`
   - `{{2}}`: `The first stand-up decisions are on record; The first five companies; and 4 more. Read it at https://web-summit.sgit.ai/reports/2026-11-05-0057/`
4. **Submit**, and wait for **Approved** (it can take up to a day, *third-party*). The workflow's "Draft the messages" node makes exactly these two values.

Until it is approved, you can test with free text (section 8, step 3).

## 5. Create the data table in n8n

The table remembers which reports were sent. It works in test runs too, unlike static data.

1. In your n8n project, select the **Data tables** tab.
2. Use the split button at the top right and select **Create Data table**.
3. **Name:** `ws39_sent`, then choose **From scratch**.
4. **Columns:**
   - `report_id` (string): the report's id, for example `2026-11-05-0057`.
   - `sent_at` (string or date): when it was sent.
5. Leave it empty. (Data tables share a 200 MiB limit per instance by default; this table stays tiny.)

## 6. Create the WhatsApp credential in n8n

From n8n's "WhatsApp Business Cloud credentials" page (API key method):

1. **Credentials > Create credential > WhatsApp API** (the node's credential type, as n8n lists it).
2. **Access Token:** the system user token from section 3.
3. **Business Account ID:** the **WhatsApp Business Account ID** from WhatsApp > API Setup. Not the Phone number ID.
4. **Save**.

## 7. Build the workflow, node by node

Create a workflow called **WS-39: team report to Jose on WhatsApp**. First, open the workflow's settings and set its time zone to **UTC** (Lisbon is UTC in November). If you don't want a copy of every message in the execution log, set successful production executions not to be saved. (These labels are as the workflow settings dialog shows them; this agent couldn't check them in the docs it read.)

### Node 1: Schedule Trigger, "Every 30 min, 07:05-22:35 UTC"

- **Trigger Interval:** Custom (Cron).
- **Expression:** `5,35 7-22 * * *`.
- **Why:** the site doesn't announce new reports (no webhook, no feed), so the workflow checks every 30 minutes, a few minutes after the journalist's runs at :57. Nothing goes out at night; the night's last report goes at 07:05.

### Node 2: HTTP Request, "Get the reports list"

- **Method:** GET.
- **URL:** `https://web-summit.sgit.ai/reports/index.md`
- **Authentication:** None (a public page).
- **Options > Response > Response Format:** Text. **Put Output in Field:** `data`.

### Node 3: Code, "Find the newest report"

- **Language:** JavaScript. **Mode:** Run Once for All Items.
- **Code:** paste exactly:

```js
// n8n Code node "Find the newest report" (JavaScript, Run Once for All Items). No network: the HTTP Request node before
// it fetched https://web-summit.sgit.ai/reports/index.md as Text into the field "data". Skips the newsletter.
const SITE = 'https://web-summit.sgit.ai/'
const md = String($input.first().json.data || '')
const newest = [...md.matchAll(/^- \[(.+?)\]\(([^)/]+)\/index\.html\)(?::\s*(.*))?$/gm)]
  .map(m => ({ title: m[1], id: m[2], summary: m[3] || '' }))
  .find(r => /^\d{4}-\d{2}-\d{2}-\d{4}$/.test(r.id))
if (!newest) throw new Error('No two-hourly report found in reports/index.md')
return [{ json: { ...newest, link: `${SITE}reports/${newest.id}/`, source_url: `${SITE}reports/${newest.id}/index.md` } }]
```

It outputs `id`, `title`, `summary`, `link` and `source_url` for the newest two-hourly report (it skips the newsletter).

### Node 4: Data Table, "Not sent yet?"

- **Resource:** Row. **Operation:** If Row Does Not Exist.
- **Data table:** `ws39_sent`.
- **Must Match:** All Conditions.
- **Conditions:** column `report_id`, **Equals**, value `{{ $json.id }}`.
- **What it does:** if the report was already sent, it outputs nothing and the run stops here, quietly. If not, it passes the item on unchanged.

### Node 5: HTTP Request, "Get the report"

- **Method:** GET. **URL:** `{{ $json.source_url }}`
- **Options > Response > Response Format:** Text. **Put Output in Field:** `data`.

### Node 6: Code, "Draft the messages"

- **Language:** JavaScript. **Mode:** Run Once for All Items.
- **Code:** paste exactly:

```js
// n8n Code node "Draft the messages" (JavaScript, Run Once for All Items). No network: the HTTP Request node before it
// fetched the report's markdown as Text into "data"; the report's id and link come from "Find the newest report".
const r = $('Find the newest report').first().json
const md = String($input.first().json.data || '')
const section = md.split(/^## /m).find(s => /^What happened/.test(s)) || ''
const points = [...section.matchAll(/^\d+\.\s+\*\*(.+?)\*\*/gm)].map(m => m[1].trim().replace(/[.:;,]+$/, ''))
const [, y, mo, d, hh, mm] = r.id.match(/^(\d{4})-(\d{2})-(\d{2})-(\d{2})(\d{2})$/)
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const day = `${DAYS[new Date(Date.UTC(+y, +mo - 1, +d)).getUTCDay()]} ${+d} ${MONTHS[+mo - 1]}`, time = `${hh}:${mm}`
// a report without numbered points falls back to its summary, then its title
const top = points.length ? points.slice(0, 3) : [(r.summary || r.title).replace(/[.:;,]+$/, '')], more = points.length - Math.min(points.length, 3)
// 1. free text, for the WhatsApp node's Send (only within 24 hours of Jose's last message to the number)
const text_whatsapp = [`*RiskMandate team · ${time} report*`, `${day} · stand-ups 13:00 and 18:00`, '',
  ...top.map(p => `▸ *${p}*`), '', more > 0 ? `+${more} more: ${r.link}` : r.link].join('\n').slice(0, 1000)
// 2. the two parameters of the approved template (Send Template): no new lines, tabs or runs of spaces in a parameter
const flat = s => s.replace(/\s+/g, ' ').trim()
const template_when = flat(`${day}, ${time}`)
const template_points = flat(`${top.join('; ')}${more > 0 ? `; and ${more} more` : ''}. Read it at ${r.link}`).slice(0, 900)
// 3. Slack mrkdwn, for later (route 4)
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const text_slack = [`*RiskMandate team · ${time} report*`, `${day} · stand-ups 13:00 and 18:00`, '',
  ...top.map(p => `• *${esc(p)}*`), '', `<${r.link}|${more > 0 ? `+${more} more in the full report` : 'Read the report'}>`].join('\n')
return [{ json: { id: r.id, title: r.title, link: r.link, text_whatsapp, template_when, template_points, text_slack } }]
```

It outputs `text_whatsapp` (free text, the designer's look), `template_when` and `template_points` (the template's two values), and `text_slack` (for section 10). The node name **must be** "Find the newest report" for node 3, since this code reads it by name.

### Node 7: WhatsApp Business Cloud, "Send to Jose"

- **Credential:** the one from section 6.
- **Resource:** Message. **Operation:** Send Template.
- **Sender phone number:** pick the business number (the node lists the numbers of the Business Account).
- **Recipient's phone number:** Jose's own number, with country code. Only Jose.
- **Template:** `ws_team_report` (English).
- **Components:** add **Body**, then two **text** parameters, in this order:
  1. `{{ $json.template_when }}`
  2. `{{ $json.template_points }}`
- n8n's docs list the node's operations (Send, Send and Wait for Response, Send Template) but not its field labels. The labels above come from tutorials and may differ in your version: look for the sender number, the recipient, the template, and the body parameters.

### Node 8: Data Table, "Mark as sent"

- **Resource:** Row. **Operation:** Insert.
- **Data table:** `ws39_sent`.
- **Columns:** `report_id` = `{{ $('Draft the messages').item.json.id }}`, `sent_at` = `{{ $now.toISO() }}`.
- **Why last:** the row is written only after WhatsApp accepted the message, so a failed send is retried at the next run.

## 8. Test, then publish

1. **Run the first six nodes.** Select node 6 and use **Execute step** (or run the workflow with node 7 disabled). Check node 6's output: three points, the right link, and `template_points` on one line.
2. **Send a real test with the template** (once it is approved). Run the whole workflow with **Execute workflow**. Jose should get the message; the data table should have one row.
3. **Before the template is approved,** test with free text: from Jose's phone, send any message to the business number (that opens the 24-hour window); in node 7 temporarily set **Operation** to **Send**, a text message, with `{{ $json.text_whatsapp }}` as its text (field labels may differ, as in node 7); run; then set it back to **Send Template**.
4. **Run again at once.** Nothing should be sent: node 4 stops the run because the report is in the table. That proves "once per report".
5. **To test again from scratch,** delete the row in **Data tables > ws39_sent**.
6. **Publish** (top right). From now on the schedule runs on the published version; later edits stay a draft until you publish again.

## 9. The best way, and the alternatives

| Choice | Recommended | Why | Alternatives, and why not |
|---|---|---|---|
| How to build | **By hand (this guide)** | Native nodes, readable, current practice; the "sent" memory works in tests | Import [`WS-39-route3.n8n.json`](WS-39-route3.n8n.json): faster, tested, but uses HTTP Request for WhatsApp, static data (experimental) and a Code node that fetches |
| Remember what was sent | **Data table**, written after the send | Works in test runs; a failed send isn't recorded | **Remove Duplicates** ("Remove Items Processed in Previous Executions", value `{{ $json.id }}`): one node, but it records the report *before* the send, so a failed send is lost. **Static data**: experimental, not in test runs |
| Send | **WhatsApp node, Send Template** | Delivered at any time; credential handled by n8n | **Send** (free text): only within 24 hours of Jose's last message, and can fail silently. **HTTP Request** to the Graph API: full control, more setup |
| Trigger | **Schedule, every 30 minutes** | Simple; catches a late report within 30 minutes | A webhook from the site's CI when a report is published: instant, but needs a change to the site's deploy (not this agent's) and a public n8n URL |
| Fetch and parse | **HTTP Request, then a Code node with no network** | Matches n8n 2.x/3.x: the docs point HTTP calls to the HTTP Request node, and Code nodes can't use credentials | Fetch inside the Code node: not what the docs recommend, and route 3's JSON does it only as a fallback |
| Where the logic lives | **Two small Code nodes**, tested here | Same rules as the site's report format | **Execute Command** with `report-draft.mjs`: off by default since n8n 2.0 |

## 10. Next: an error alert, and Slack (route 4)

**An error alert (recommended).** n8n runs an *error workflow* when a published workflow fails:

1. Create a workflow **WS-39 errors** with an **Error Trigger** node, then a node that tells Jose: an email (the **Send Email** or **Gmail** node, to Jose's workspace address) is safest, since a WhatsApp free-text alert has the same 24-hour problem.
2. In **WS-39: team report to Jose on WhatsApp**, open the workflow settings and choose **WS-39 errors** as its error workflow (n8n's Error Trigger docs; the setting's label isn't in the pages read here).
3. You don't need to publish the error workflow, and you can't test it with a manual run: it runs only when the published workflow fails (n8n's Error Trigger docs).

**Slack (route 4), when someone with Slack admin is ready:**

1. In Slack, **Create New App > From a manifest** (n8n's Slack credentials page has the manifest). The bot needs at least `chat:write`.
2. Install it to the workspace, copy the **Bot User OAuth Token**, and the **Signing Secret** (n8n 3.0 requires it on the Slack API credential).
3. In n8n: **Credentials > Slack API**: Access Token = the bot token, Signature Secret = the signing secret.
4. In Slack, invite the app to the channel (for example `/invite @n8n integration`).
5. In the workflow, add a **Slack** node after node 6, on a second branch: **Resource:** Message, **Operation:** Send, the channel, **Message text** `{{ $json.text_slack }}`. Then move "Mark as sent" after both sends, or give Slack its own table, so a Slack failure doesn't block WhatsApp.

## 11. How the Code nodes were tested

The two Code nodes are kept as files, [`n8n-build/find-newest-report.js`](n8n-build/find-newest-report.js) and [`n8n-build/draft-messages.js`](n8n-build/draft-messages.js); this guide pastes them unchanged. [`n8n-build/n8n-build.test.mjs`](n8n-build/n8n-build.test.mjs) runs them the way n8n does (an async function body with `$input` and `$`) on every two-hourly report in `content/reports/`, and with `--live` on the live site. On 5 November 2026 at 01:18 UTC: 33 passed, the live site included.

```
node people/jose/dev/n8n-build/n8n-build.test.mjs --live
```

## 12. Troubleshooting

| What you see | Likely cause | What to do |
|---|---|---|
| Node 7: template not found, or parameter count mismatch | Template not approved yet, wrong name or language, or not two body parameters | Check WhatsApp Manager; the name `ws_team_report`, English, two `{{n}}` |
| Node 7: works once, then fails a day later | The temporary access token expired | Use a System User token (section 3) |
| Free-text test does nothing | Outside the 24-hour window, or failure reported later | Message the business number first; prefer the template |
| Node 4 always stops the run | The report is already in `ws39_sent` | That's correct; delete the row to test again |
| Node 3: "No two-hourly report found" | The site's report list changed shape | Run `n8n-build.test.mjs --live`; tell dev@web-summit.jose |
| "Bad request - please check your parameters" (WhatsApp node) | A field the node needs is empty or the wrong type | n8n's WhatsApp node common issues page |
| Nothing runs on schedule | Not published, or the published version is older | **Publish** again; check the workflow list's published indicator |

## 13. Sources

Read on 5 November 2026.

**n8n documentation** (from [`n8n-io/n8n-docs`](https://github.com/n8n-io/n8n-docs), commit `b11d16f`; the same pages are on docs.n8n.io):

- [Release notes](https://docs.n8n.io/release-notes) (`docs/changelog/release-notes.md`): n8n 3.0, released 2026-10-27.
- [v3.0 breaking changes](https://github.com/n8n-io/n8n-docs/blob/main/docs/changelog/v30-breaking-changes.md) and [v2.0 breaking changes](https://docs.n8n.io/2-0-breaking-changes).
- [Save and publish workflows](https://docs.n8n.io/build/understand-workflows/save-and-publish-workflows).
- [Schedule Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger), [HTTP Request](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest), [Code node common issues](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/common-issues).
- [Data tables](https://docs.n8n.io/build/work-with-data/data-tables) and [Data Table row operations](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.datatable/rows); [getWorkflowStaticData](https://docs.n8n.io/build/code-in-n8n/cookbook/built-in-methods-and-variables-examples/getworkflowstaticdata) ("Consider data tables"); [Remove Duplicates](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.removeduplicates).
- [WhatsApp Business Cloud node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.whatsapp), [WhatsApp Business Cloud credentials](https://docs.n8n.io/integrations/builtin/credentials/whatsapp), [WhatsApp Trigger](https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.whatsapptrigger).
- [Slack credentials](https://docs.n8n.io/integrations/builtin/credentials/slack), [Error Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.errortrigger).

**WhatsApp rules** *(third-party; Meta's own pages can't be opened from this session)*:

- The 24-hour window: [Rasayel](https://docs.rasayel.io/whatsapp-service-window), [Vonage](https://api.support.vonage.com/hc/en-us/articles/23794423565852-What-is-the-24-Hour-Customer-Care-Window).
- Template rules: [Bird: template guidelines](https://bird.com/docs/knowledge-base/whatsapp/template-guidelines), [ChatDaddy: error 2388293](https://help.chatdaddy.tech/article/meta-whatsapp-error-code-2388293-waba-variable-ratio-exceeds-limit-too-many-vari), [Zoho: template mistakes](https://help.zoho.com/portal/ja/community/topic/whatsapp-in-zoho-crm-7-template-mistakes-that-get-rejected-or-quietly-damage-your-number-notes-from-a-whatsapp-bsp).
- System User tokens: [WooCommerce: system user access token](https://woocommerce.com/?p=18734006930318), [Digital Inspiration](https://digitalinspiration.com/docs/document-studio/apps/whatsapp/token).
- Late failures (131047): `people/jose/automation/README.md` and its sources.
