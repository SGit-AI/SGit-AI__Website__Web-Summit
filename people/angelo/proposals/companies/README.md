# Angelo's companies at Web Summit Lisbon 2026 (WS-08)

Checked by crm@PrompTugal.angelo on 6 November 2026, between 16:55 and 17:15 UTC. The conductor asked for this check (8ac1ea16, 1881159d and 6db3d06e) for the 18 companies in answer 2 of [Angelo's card](../../card.md). Each company was identified by the website linked there. Only public sources were used.

**Result: one company is confirmed, at attendee level only (Accenture). One is reported but not confirmed (AWS). Nothing was found for the other 16.** **Applied on 7 November at 18:55 UTC** to `data/companies.json` by crm@PrompTugal.angelo (backlog item 6, under the protocol's five steps). The only draft entry is [accenture.json](accenture.json), in the shape of `data/companies.json`, for the conductor to route to that file's keeper. No person's name or contact detail is recorded here.

## What was read

Every entry on these websummit.com lists carries `conferenceSlug: lis26`, which is what makes it a 2026 confirmation. The same method was used for `data/companies.json`. The site's `/api/` was never called.

- **The 2026 event partners:** https://websummit.com/partners/event-partners-2026/, pages 1 to 8, 300 partners in all.
- **The speakers:** https://websummit.com/speakers/, 48 pages, about 916 people, matched on their company and job title.
- **The featured startups:** https://websummit.com/startups/featured-startups/, 26 pages, 2,562 startups.
- **The featured attendees:** https://websummit.com/featured-attendees/, **only pages 1 to 150 of 1,466**, so about a tenth of the list.
- **The logo strips** on the 2026 track pages and on https://websummit.com/web-summit-2026/.
- **A web search** for each company with "Web Summit" 2026 Lisbon, to look for its own announcements.
- **The team's public CRM** (ws-team-crm-public): the summit's people, organisations and agenda.

## The 18

| Company | Verdict | How present | Source |
|---|---|---|---|
| [AWS](https://aws.amazon.com) | reported, not confirmed | AWS's logo is on several 2026 track pages, in a strip of images headed "Headlined by industry-leading organisations". That strip may be reused from year to year, and there is no AWS record for LIS26. **Amazon, its parent, is on the agenda:** a press conference by Amazon's VP People, Experience & Technology, on 11 November at 16:00 (Stage 2). An attendee also lists "Amazon" as employer. | https://websummit.com/tracks/saas-summit/ ; the session: https://websummit.com/sessions/lis26/3f2286e3-46c8-46a8-8900-692ca0c3a8f9/ |
| [Reply](https://www.reply.com) | not found | A startup named "Reply Intelligence Group" (replyos.co.uk) is a different company. | |
| [Outplay Entertainment](https://www.outplay.com) | not found | It appears only at other events (Pocket Gamer Connects). | |
| [Devoteam](https://www.devoteam.com) | not found | | |
| [VGW](https://www.vgw.co) | not found | | |
| [Administrate](https://www.getadministrate.com) | not found | | |
| [IFS assyst](https://www.ifs.com/assyst) | not found | IFS, its parent, was not found either. | |
| [Rebura](https://www.rebura.com) | not found | | |
| [Accenture](https://www.accenture.com) | **confirmed, attendee level** | One featured attendee for LIS26 lists Accenture as employer (a consulting manager). Accenture is not a partner and has no speaker. Its logo is also in the strip on the Corporate Innovation Summit track page. | https://websummit.com/attendees/lis26/41af4fd8-15b9-4c2a-bdab-7fb602d77c38/ |
| [Jam City](https://www.jamcity.com) | not found | | |
| [Manhattan Associates](https://www.manh.com) | not found | | |
| [BlackRock](https://www.blackrock.com) | not found | | |
| [Iveco Group](https://www.ivecogroup.com) | not found | | |
| [Databricks](https://www.databricks.com) | not found | The only Lisbon results were a Databricks user-group meetup, not Web Summit. | |
| [Nory](https://nory.ai) | not found | | |
| [Ofcom](https://www.ofcom.org.uk) | not found | | |
| [Big Fish Games](https://www.bigfishgames.com/) | not found | | |
| [SYBO](https://sybogames.com) | not found | It appears only at other events (Pocket Gamer Connects). | |

"Not found" means: not in the complete partner, speaker and startup lists; not in the tenth of the attendee list that was read; and no announcement of its own in the searches.

## Limits

- **The attendee list was read only in part** (150 of 1,466 pages). Staff of other companies on this list may be among the rest. The site's attendee search is a client-side search service. Querying it directly was not attempted, because that would go around the site's public pages. Reading the rest means about 1,300 more page fetches, which I can do in a later run if the conductor wants it.
- **Session pages were not checked one by one**, so a session involving one of these companies, with no speaker listed under it, could be missed.
- **Companies' own newsrooms were checked only through web search** (a US-only engine).
- **Attendee level is not corporate participation.** It is one employee with a ticket, not a stand, a partnership or a session.
