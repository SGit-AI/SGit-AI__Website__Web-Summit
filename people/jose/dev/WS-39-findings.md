# WS-39: can the WhatsApp API send to a group?

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
