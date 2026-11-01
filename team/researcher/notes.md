# Company map v1: research notes (read on 2026-11-01)

Output: `companies.json` in this folder. It holds 62 companies: 13 at priority 1, 18 at priority 2 and 31 at priority 3. 61 are confirmed for 2026 and 1 is unconfirmed (Hexamind).
The generator is `../scripts/build.py`. It reads `../dl/selected.json`, which was extracted from the saved websummit.com pages.

## What worked

- **websummit.com pages render on the server (Next.js).** Each list page embeds its first page of entries in `<script id="__NEXT_DATA__">`, under `props.pageProps.data.page.template.customPage.flexibleContent[]`, in the item whose `__typename` ends in `AttendeeList`, in `listItems[]`.
  - Every item carries `conferenceSlug`. **`lis26` means Web Summit Lisbon 2026.** Older slugs (ws19, cc22 and so on) mean a past event. This field is what made "confirmed" possible without guessing.
  - Company items (`listMode: appearances`) carry name, country, industry, `subcategory` (PARTNER, GROWTH and so on) and `elevatorPitch`.
  - People items (`listMode: attendees`) carry name, job_title and company.
- **Detail pages are public and stable.**
  - Companies: `https://websummit.com/appearances/lis26/<uuid>/<slug>`. The page's `__NEXT_DATA__` holds the company `website`, which is where the `website` fields came from.
  - People: `https://websummit.com/attendees/lis26/<uuid>/<slug>`.
- **robots.txt** is `Disallow: /api/` only, and the pages above are allowed.
- **Press confirmed some speakers.** Lusa (via aman-alliance.org) and Fast Company ME confirmed speakers that the first-page lists do not show (Henna Virkkunen, a16z), and the dated articles back them up.

## Lists on websummit.com, and how to re-read them

| List | URL | Server-rendered | Notes |
|---|---|---|---|
| Event partners 2026 | https://websummit.com/partners/event-partners-2026/ | first 40 (of up to 40 x 100 pages) | "Exhibition space at Web Summit 2026 is sold out". Filters: country, industry |
| Featured startups | https://websummit.com/startups/featured-startups/ | first 100, alphabetical, 0xbow to SunContract | all GROWTH in the first page. Filters: location, industry, programme (alpha/beta/growth) |
| Speakers | https://websummit.com/speakers/ | first 20 (up to 47 pages) | mostly the Chinese delegation and Replit in the first page |
| Featured attendees | https://websummit.com/featured-attendees/ | first 20 | Cloudflare, CrowdStrike, Atlassian, Neo, Amino Capital and others |
| Schedule | https://websummit.com/schedule/ | first sessions of 10 Nov | pagination 1 to 5 in the page. The full agenda is in the app (attend.websummit.com/lis26, login) |
| Tracks | https://websummit.com/tracks/ (cybersecurity-summit, ai-summit, developer-summit, saas-summit, policy-summit, venture-summit ...) | themes and logos only | the speaker block is filled client-side. Logos and highlights may be from 2025 |
| Media partners | https://websummit.com/media/media-partners/ | logos only (Axios, Bloomberg, Inc, The Telegraph) | not used |
| Sitemap | https://websummit.com/sitemap.xml | | every public page |

To re-read in a later run:

1. `curl -sSL <list url>`.
2. Pull out `__NEXT_DATA__` and walk it for `AttendeeList.listItems`.
3. Keep only `conferenceSlug == "lis26"`.
4. For each new company, fetch its `/appearances/lis26/...` link (the `href` is in the same HTML) and read `website`.
5. Diff against `companies.json` by name or uuid.

Query parameters (`?search=`, `?page=`) do NOT change what the server renders. Every request returns the same first page.

**Not used, on purpose.**
- The rest of each list loads in the browser from a search service (`dataSource: "algolia"`) and from `website-content-library.websummit.com/rest/v1/LIS26-tracks-<track>?limit=10`, a Supabase REST endpoint whose anon key is in the track page HTML.
- I tried to read both, and this session's permission check refused both as access circumvention. I did not work around that.
- If the operator wants the full lists, there are two routes:
  - (a) the operator explicitly allows reading those endpoints;
  - (b) a person exports or filters in the Web Summit app.
- The app's attendee search needs a login, and its terms should be checked first.

## What was hard to find

- **The full startup list.** Only the first 100 featured startups (to "Su") are readable. Startups after "Su", and every ALPHA/BETA startup outside "featured", are missing. That is where most small AI-security and GRC startups will be.
- **Track speakers.** The Cybersecurity, AI and Developer Summit pages name companies only as logos and past highlights, which cannot be told apart from 2025 content. I did not count them as 2026 confirmation, except IBM as official AI Summit partner.
- **Portuguese startups for 2026.** Road 2 Web Summit (Startup Portugal) selects up to 125 startups, but I found no published 2026 selected list. Portuguese entries come only from the websummit.com lists, where country is Portugal or the pitch says Portugal.
- **Algarve.** ANJE's "Algarve Empreende 2026" contest (24 startups, with Algarve Evolution among the partners) was reported for the 2025 edition (postal.pt, 30 Aug 2025). I found nothing for 2026 and listed no Algarve startup. This is a gap to ask the Algarve network about directly.
- **Third-party lists.**
  - Future Feed's "40 AI startups to meet" (14 Oct 2026) gave good leads: BackDoor, Forg3t Protocol, Hexamind, Keyban, Cobalt, Thunders, Cala, distil labs and Steelman Labs.
  - Only the ones that are also on websummit.com are marked confirmed. Hexamind is in the map as unconfirmed because it is too relevant to leave out; its own GitHub confirms what it does.
  - One entry, "Summit Cognitive", could not be found anywhere and was left out. Treat that list with care.
- **Eversec Technology, Amino Capital, Cyberspace Administration of China.** Their own sites were not read (or not readable), so `website` is empty and `what` says it is not yet sourced.
- **Dates conflict.** Lusa says 8 to 12 November. websummit.com and most sources say 9 to 12, with the exhibition 10 to 12.

## Gaps and next steps

1. Full partner, startup and speaker lists. This needs an operator decision on the search endpoints, or the app (see above).
2. Re-check the Future Feed leads on websummit.com once the full startup list is readable: BackDoor (AI-agent pentesting), Forg3t Protocol (LLM unlearning with audit evidence), Keyban (agent wallets), Cobalt (coding-agent harness), Thunders (testing agents), Cala and Steelman Labs.
3. The Road 2 Web Summit 2026 selected list: ask Startup Portugal. The ANJE / Algarve Empreende 2026 cohort, if there is one.
4. The 2026 Cybersecurity Summit and AI Summit sessions (the schedule has pagination; the app has the rest). A CrowdStrike "AI vs. AI" session with its EMEA CTO was reported by a search summary, but I could not trace it to a primary source, so it is not used.
5. No people data beyond public speakers listed by Web Summit with their public role. No emails, phones or addresses were collected.
6. Owners and status (to contact, contacted, and so on) are left for the cartographer and the team. The brief wants an owner among the seven for each company.

## Second pass, 2026-11-01 (researcher@web-summit, sub-agent of the conductor's wake started 2026-11-01T02:28:14Z)

Output: 29 companies added to `data/companies.json` (now 88). Every one is confirmed for 2026 by a LIS26 session page naming its speaker's organisation. 6 at priority 1, 11 at priority 2, 12 at priority 3.

### What I read

- `https://websummit.com/robots.txt` first: still `Disallow: /api/`, `Allow: /`. Nothing under /api/ was read.
- The 40 session pages listed in `data/events.json` (`/sessions/lis26/<uuid>/<slug>/`). Each page's `__NEXT_DATA__` holds the session under `props.pageProps.data.page.template.customPage.sessionDetailsTemplate[0].session`, with `conferenceSlug: "lis26"`, `starts_at`, `location`, `schedule_track`, and `timeslot_participations[]` (name, `company_name`, `job_title`, `attendance_id`). Hosted sessions also carry `appearance_id`, `appearance_name`, `appearance_country`, `appearance_industry`.
- The speakers' public attendee pages, built as `/attendees/lis26/<attendance_id>/<name-slug>/`. They give company, country, industry and a public bio. Note: the country on an attendee page is the attendee's listing and may not be the company's headquarters (Descope shows United Kingdom there and United States on its appearance page; I used the appearance page). Two slugs 404'd (Qualcomm's and AICEP's speakers); the session page alone confirms them.
- Two appearance pages: Descope, and AICEP (its slug is `aicep---portugal-trade-%26-invest`, copied from the session page's href; a guessed slug 404s).
- Each company's own homepage, title and meta description only.

### What I added (priority)

By id and priority: descope 1, airia 1, emergence-ai 1, feedzai 1, linux-foundation-aaif 1; persona 2, aisle 2, trent-ai 2, launchdarkly 2, jetbrains 2, roost 2, ncsc-uk 2, rws 2, lawvu 2, trustscale 2, aicep 2, ledger 2; sumsub 3, proofpoint 3, testmu-ai 3, sageox 3, neo4j 3, directus 3, factorial 3, qualcomm 3, eversec 3, data-protection-commission 3, c4ail 3, crystal-intelligence 3.

Speakers' organisations in the 40 sessions that I left out as off-topic or not companies: The Atlantic, POLITICO, Foreign Policy, Dataconomy, Wired, TIME, HBR, Mashable, The Guardian, PCMag, ECO, Renascença and other media; Purpose, Berkeley Center for Law and Business, Georgetown University, Future Government Institute, Kill List, The New World, Human intention, AI-Curious, Lush, the US Government, the Government of Portugal; Tencent, Granola, Aaru (relevant only at the edge). Elastic, Delinea, Startup Portugal, Cloudflare, CrowdStrike, Cisco, Primitive and the European Commission were already in the map; I did not change their entries (the new session pages could be added to their sources by a later pass).

### What I could not confirm

- **Persona**: `withpersona.com` answered 403 with a bot challenge. I stopped there; its `what` rests on its CEO's Web Summit bio, and its own site is not listed as a source.
- **RWS Group**: `rws.com` returned 202 with an empty body; `website` left empty, `what` rests on the session and bio.
- **Eversec Technology**: `eversec.com.cn` loads (title 行为智能) but the page does not name Eversec, so I could not tie the domain to the company; `website` left empty.
- **Country fields** for speaker-only companies come from the attendee page (the speaker's listing), so they may be the speaker's country rather than the headquarters (check AISLE, Crystal Intelligence, Trent AI).
- Still not read: the full startup, partner and speaker lists (client-side search service; see the first pass). No Algarve company found this pass either.
- No personal data beyond public speakers' names and roles as Web Summit lists them; no contact details collected.
