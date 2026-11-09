---
title: "The comms protocol: every private conversation lives here, PrompTugal stays public"
summary: Every email, message and contact detail, for RiskMandate and for PrompTugal.news alike, lives in this team's private CRM and is handled from here; the PrompTugal team works only with public material. How a PrompTugal agent asks us to contact someone, how a message is drafted, sent by a person and recorded, and how a reply goes back, without a private detail ever leaving the private CRM.
---
At Dinis's word (6 November 2026, about 16:00 UTC): *"our CRM lives here ... we need to have all the interactions, all the messages, all the emails ... every email, even if sent on behalf of PrompTugal ... it all comes from our web summit area. So ... everything that is on the other agents is almost like 100% public ... I think that's super critical."* Kept by conductor@web-summit.dinis (WS-184).

## The rule {#rule}

- **Private lives here, and only here:** contact details, emails (as EML), messages, call notes, who said what in private, and every next step with a person. All of it is in the private team CRM (`ws-team-crm-private`, under `companies/<company>/comms/` and `contacts/`), handled by this team's agents.
- **PrompTugal.news is public, all of it:** its repository, its board, its vaults and its agents hold only what may be published. No email address, phone number, private note or unpublished quote, ever.
- **Every email is sent by a person,** from their own address (a promptugal.news editor's, or RiskMandate's), even when it is on PrompTugal's behalf. No agent sends.

## The flow {#flow}

1. **Request.** A PrompTugal agent that needs someone contacted (outreach@, customers@, a journalist, the conductor) sends a **contact request** on its lane to `conductor@web-summit.dinis` (its lane is in this site's `data/inbox/conductor-dinis.json`; the PrompTugal conductor also has a peer lane). Only public material in it: the company's id, the purpose, the public page or prompt to share, a proposed text with no private detail, who it should come from (PrompTugal's editors, RiskMandate, or both), and by when.
2. **Intake.** The conductor drains it at its next wake and records it in the private CRM as a thread under the company (`comms/<date>-<subject>/`, a `request.json`), with an owner and a due date.
3. **Draft.** The private side adds what only it holds (the person's address, the history of the conversation) and writes the email as a draft card and EML in that thread: `crm@web-summit.dinis` for Dinis's contacts, each person's own crm or inbox agent for theirs (inbox@web-summit.silvio for Silvio's mailbox).
4. **Approve and send.** A person reads the draft and sends it from their own mailbox. The sent message is saved back into the thread as EML (WS-173's shape), with its card.
5. **Replies.** The person's inbox agent saves each reply into the same thread as EML. The conversation's owner decides what of it may be public.
6. **Back to PrompTugal.** Only what may be public goes back, on the conductor's lane to the requesting agent: "sent on <date>", and any public outcome ("he asked us to add this paragraph to his page"), never an address or a private line. Changes to pages follow as guidance or tasks there.

## The contact request {#request}

```
{
  "type": "contact-request/v1",
  "from": "<agent>@PrompTugal.dinis",
  "company": "<company id, as in the public CRM>",
  "person": "<a public role or name, only if already public; else empty>",
  "purpose": "<one line>",
  "share": ["<public URLs: the page, the prompt>"],
  "proposed_text": "<the email's body, with no private detail>",
  "sender": "promptugal-editors | riskmandate | both",
  "by": "<YYYY-MM-DD>"
}
```

Seal it to the conductor's key and append it on your lane, as `/inbox/` says. The answer comes back on the conductor's lane to you, public material only.

## Who enforces it {#enforced}

The Agent Behaviour Policies (abp@PrompTugal.dinis for PrompTugal, abp@web-summit.dinis here): no PrompTugal agent holds a contact detail, uses a mail connector or sends; a contact goes only through this request. security@PrompTugal.dinis's reviews and the gates' contact checks refuse an email address or a phone number in PrompTugal's repository. The first case is Algarve Evolution (6 November): his paragraph went to PrompTugal as public guidance; his address and the call stayed in the private CRM.
