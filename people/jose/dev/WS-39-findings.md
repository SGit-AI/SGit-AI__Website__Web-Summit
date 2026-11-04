# WS-39: can the WhatsApp API send to a group?

## To fill in n8n (route 3, decided by Jose on 3 November 2026)

Import `people/jose/dev/WS-39-route3.n8n.json`. It is inactive on import and sends to Jose only; Jose forwards to the group. Fill these in **inside n8n**, never in the repository:

1. **The credential** on the "Send to Jose" node: n8n shows it as missing after import; pick a new *Header Auth* credential there, name `Authorization`, value `Bearer <the WhatsApp Cloud API access token>`.
2. **`to`** in the "Settings" node: Jose's own WhatsApp number, with country code.
3. **`phone_number_id`** in "Settings": the business number's Phone number ID (Meta app, WhatsApp, API setup).
4. **`graph_version`** in "Settings": the Graph API version your Meta app uses (for example `v23.0`).
5. **The 24-hour rule.** Free text reaches Jose only within 24 hours of Jose's last message *to the business number*; outside that window only an approved template is accepted. Either Jose messages the number once a day (`mode: 'text'`, the default), or set `mode: 'template'` with **`template_name`** and **`template_language`**: a Utility template whose body is just `{{1}}`, approved in Meta's WhatsApp Manager. In template mode the draft is sent as one line, since a template parameter can't hold new lines. Sources (third-party summaries of Meta's rule, read 4 November 2026; Meta's pages can't be opened from this session): [Rasayel: the 24-hour service window](https://docs.rasayel.io/whatsapp-service-window), [Vonage: the 24-hour customer care window](https://api.support.vonage.com/hc/en-us/articles/23794423565852-What-is-the-24-Hour-Customer-Care-Window).
6. **Optional:** `look` in "Settings" (`three` by default, or `line` or `full`), and the schedule on the first node.

**The trigger: a schedule, not "a new report".** The site has no webhook or feed that announces a report, so the flow polls every 30 minutes from 07:05 to 22:35 UTC (`5,35 7-22 * * *`, with the workflow's time zone set to UTC whatever the n8n instance uses; Lisbon is UTC in November) and sends a report only once (the last id is kept in the workflow's static data, saved only after Meta accepts the message, so a failed send is retried at the next poll). A late journalist run still reaches Jose within half an hour, nothing arrives at night, and the night's last report goes at 07:05. Activate the workflow for this to work: n8n keeps static data only for runs of an active workflow.

**The n8n node:** the message goes through an *HTTP Request* node to the Cloud API's documented `POST /<phone number id>/messages`, not n8n's WhatsApp node, whose field names couldn't be checked from here (the [n8n WhatsApp node docs](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.whatsapp/) were read only through search). If Jose prefers the WhatsApp node, the body to copy is in the "Build the WhatsApp message" node.

Built from `WS-39-route3.build.mjs` (which embeds `report-draft.n8n.js` unchanged); `node people/jose/dev/WS-39-route3.test.mjs` runs the nodes offline, 7 tests.

## The check of 3 November

By `dev@web-summit.jose`, 3 November 2026, at Jose's go ("WhatsApp first, Slack as the backup, and check first whether the API can send to a group"). Read through web search on 3 November 2026: Meta's own pages could not be opened from this agent's session (its network does not reach developers.facebook.com), so each point below is from the search results' reading of the pages named, and should be checked on Meta's page before anything is built on it.

## The short answer

**Yes, but not into the team's existing group.** Meta's Cloud API has a Groups API. It works only for groups the business creates through the API, only for a business with an Official Business Account, and with very few participants. Posting into the WhatsApp group the team already uses needs a third-party gateway outside Meta's official API.

## What the official Groups API allows

| Point | What was read | Source |
|---|---|---|
| Who can use it | Businesses with an Official Business Account (OBA). Some third-party guides also give a high messaging-limit route; it is not in Meta's text as read, so it is unverified. | Meta, [Groups API](https://developers.facebook.com/documentation/business-messaging/whatsapp/groups) |
| Which numbers | Not WhatsApp Business **app** numbers, nor numbers on Multi-solution Conversations: a Cloud API number. | Meta, [Groups API](https://developers.facebook.com/documentation/business-messaging/whatsapp/groups) |
| Which groups | Groups the business creates through the API (Create Group). The `group_lifecycle_update` webhook carries an invite link; the business may message the group once someone joins by it. | Meta, [Get started with Groups API](https://developers.facebook.com/documentation/business-messaging/whatsapp/groups/get-started) |
| How it sends | The usual Cloud API send endpoint, `POST /<phone number id>/messages`, with the group as the recipient; per-message pricing. | Meta, [Get started with Groups API](https://developers.facebook.com/documentation/business-messaging/whatsapp/groups/get-started) |
| Size | At most 8 participants per group, one Cloud API business per group; up to 10,000 groups per business number. | Meta, [Groups API](https://developers.facebook.com/documentation/business-messaging/whatsapp/groups) |

**Against our case:** the team is nine people (`data/team.json` lists nine), so a group of at most 8 participants cannot hold everyone; an Official Business Account (the verified badge) takes an application to Meta that is unlikely to land before the summit; and it cannot use the existing group.

## The other routes

1. **A third-party gateway** that posts into an existing group (n8n nodes from Wassenger, 2Chat and MegaAPI offer "send to group"). As read, these work through a WhatsApp Web session on a phone number, not Meta's official API: the number can be banned, and the gateway sees the group's messages. Sources: [Wassenger: send WhatsApp group messages from n8n](https://wassenger.com/blog/send-whatsapp-group-messages-from-n8n), [2Chat n8n integration](https://2chat.co/integrations/n8n), [n8n-nodes-megaapi](https://cdn.jsdelivr.net/npm/n8n-nodes-megaapi@1.3.1/README.md).
2. **One-to-one messages** from a Cloud API number to each person who opts in, using n8n's built-in WhatsApp node. That's official, but it isn't a group. Business-initiated messages outside 24 hours need an approved template.
3. **A person posts it.** n8n sends the draft to Jose alone (or to the person on duty), who forwards it to the group. That's official, needs no new number, and keeps to the team's rule that agents draft and people send.
4. **Slack, the backup.** n8n's built-in Slack node posts to a channel with a Slack app's bot token and the channel's ID. That's official and simple. Source: [n8n Slack node guide](https://dev.to/pirateprentice/n8n-slack-integration-send-alerts-post-messages-and-automate-smb-workflows-mig).

## What dev@web-summit.jose proposes

Start with **route 3 now**: `report-draft.mjs` makes the text, n8n sends it to Jose, Jose forwards it. It works today and needs no account or approval. Add **Slack (route 4)** as soon as someone with admin rights on the RiskMandate Slack makes the app and the channel. Use **route 1** only if Jose and Dinis accept a gateway reading the team's group. A number that posts by itself is a change to "a person sends every message", so that one is Dinis's decision.

No number, token, group id or invite link goes in this repository: they stay in n8n's credentials.
