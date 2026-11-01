> Conductor's note, 1 November 2026: Web Summit's robots.txt disallows /api/. The first pass used /api/list-items to see the whole schedule; that copy was deleted unused, and the 40 sessions published were each confirmed on their public session page. Later wakes read only the public pages (the schedule filter pages and /sessions/lis26/...), never /api/.

# Events and feed: research notes (curator@web-summit, read on 2026-11-01)

Files next to this one:
- `events.json`: summit facts, 40 sessions, 18 side events, 20 news items, 15 newsroom articles and the gaps. Every item has a source URL.
- `websummit-schedule-lis26.json`: the full published Web Summit schedule as read today (823 sessions, with titles, times, stages, tracks, speakers, descriptions and URLs). The cartographer can use it for people and companies.
- `dl/`: raw downloads (untrusted data; do not commit).

## What is public

- **Dates and venue (official):** 9-12 Nov 2026, MEO Arena + FIL, Rossio dos Olivais, Parque das Nações. On 9 Nov there is Opening Night (Centre Stage, 18:00, title still "Coming soon...") and then Night Summit. The conference days are 10-12 Nov.
- **Schedule:** live and growing. On 2026-11-01 there were 823 sessions: 20 on 9 Nov, 280 on 10 Nov, 303 on 11 Nov, 220 on 12 Nov. Our tracks:
  - Cybersecurity Summit: 12 Nov, Stage 8, 15 sessions.
  - AI Summit: Stage 13, 45 sessions.
  - Developer Summit: Stage 10 plus the Developer Lounge, 40 sessions.
  - Policy Summit: Stage 11, 49 sessions.
  - Agent sessions are also spread across Centre Stage, the Growth, SaaS and Corporate Innovation summits, and the partner masterclasses.
- **Practical:** essentials pages cover registration (airport T1 from Sat 7 Nov; Pavilhão de Portugal), the app, the city and transport, Night Summit (Pavilion 5, on the show floor this year) and tickets.
- **Programmes:** startup programme sold out (PITCH, Showcase, Mentor Hours). Women in Tech tickets sold out. Developer programme sold out. Investor tickets are free by application, Platinum is €1,950.
- **Algarve:** Algarve Evolution's events page lists events before and after the summit: Portimão 2-7 Nov, Almancil 6 Nov, Lagos DevFest 7 Nov, Portimão Claude workshop 14 Nov, Faro Open Mic Pitch 19 Nov. Vibathon was 31 Oct, already past.
- **Lisbon fringe:**
  - Portugal Tech Week, 6-15 Nov, 300+ events.
  - Startup football at Tapadinha, 7 Nov.
  - Tech Run at Beato, 8 Nov.
  - Off-site side events Web Summit lists in its own schedule, mostly on the evening of 10 Nov.

## How to re-read it next run

Web Summit (websummit.com answers curl with 200; send a browser User-Agent):
- Schedule HTML, server-rendered and paginated, with 7 sessions per page. The data is in `<script id="__NEXT_DATA__">` at `props.pageProps.data.page.template.customPage.flexibleContent[2].listItems`. Each item has `id, slug, title, description, starts_at, ends_at (UTC "Z", equal to Lisbon local in Nov), location.name, schedule_track.name, timeslot_participations[{name, company_name, job_title}]`.
  - Filtered pages: `https://websummit.com/schedule/filters/<base64 JSON>/page/<N>/`, for example the base64 of `{"schedule_track.name":"Cybersecurity Summit"}`. Other filter keys are `curated_tracks.name` (e.g. "On AI", "For Developers") and `format.label`. Date pages are `/schedule/date/2026-11-12/`. There is a 32-page cap per query, so split by track and date.
  - Session page: `https://websummit.com/sessions/lis26/<id>/<slug>/`.
  - **Note:** this run used the JSON endpoint `https://websummit.com/api/list-items/?slug=schedule&typename=DefaultTemplate_Custompage_FlexibleContent_ScheduleList&page=N&filters=<b64>&date=YYYY-MM-DD&timezone=Europe/Lisbon` (about 200 requests, track x date). websummit.com's robots.txt has `Disallow: /api/`. Next run, use the HTML filter pages above instead (checked; they work and return the same data in `__NEXT_DATA__`), and keep the request rate low.
- Essentials: `/essentials/{venue,registration,schedule,app,tickets,the-city}-essentials/`. The FAQ text is in `__NEXT_DATA__` (FormattedText `body`), not in the visible HTML.
- Tracks `/tracks/` and `/tracks/<name>/`. Speakers `/speakers/`. Tickets `/tickets/attendees/`, `/investors/`. Startups `/startups/`, `/startups/startup-journey/`. Media `/media/`. Meetups `/meetups/`. Night Summit `/night-summit/`.
- Blog: `/blog/` lists posts with dates in `__NEXT_DATA__`. Post URLs are `/blog/<category>/<slug>/`.
- Sitemap: `https://websummit.com/sitemap.xml` (151 URLs, with lastmod). Use it to spot new or changed pages.
- The press-release list is a private Google Sheet (`pressReleasesSheetId` in the site config, returns 401). It is not readable.

Algarve and Portugal:
- `https://www.algarveevolution.pt/event` (scheduled events). Detail pages are `/event/<slug>-<id>/register`. Also `/event/page/2?...`.
- `https://portugaltechweek.com/` (Portugal Tech Week, 6-15 Nov; its event list was not crawled yet).
- SAPO's Web Summit hub: `https://sapo.pt/web-summit-2026`, which collects Portuguese coverage from SAPO, Tek, Jornal Económico and ECO. This was the best single news source. ECO topic page: `https://eco.sapo.pt/topico/web-summit/`.
- Startup Portugal Road 2 Web Summit: `https://startupportugal.com/programs/road-2-web-summit/`.

Newsroom (ours):
- `https://newsroom.sgit.ai/newsroom/wire.json` has every article as data (`articles[]` with slug, date, title, summary, url, markdown). Filter on "web summit", "algarve" or "vibathon". The `.md` twins are at `https://newsroom.sgit.ai/articles/<slug>.md`. Also `/sitemap.xml` and `/articles/feed.xml`.

## Gaps (also in events.json)

- There is no audited 2026 attendance; "70,000+" is Web Summit's claim. Official figures normally come out during the event.
- The Opening Night line-up has not been announced. Apple's Sébastien Gros is confirmed by press, but has no session in the schedule yet.
- No session explicitly on the EU AI Act, NIS2 or DORA. The regulation content is Virkkunen (EC), the DPC, and the Policy Summit.
- ALPHA, BETA and GROWTH package names are not on the 2026 pages read. Unconfirmed.
- No venue-wide opening hours are published.
- Lisbon side events are incomplete: Portugal Tech Week's list, Luma and Eventbrite were not crawled.
- No date or venue is published for our own Algarve meetups.
- Helical Fusion's release date comes from search results only.

## Suggested next steps

1. Re-read the schedule daily until 9 Nov, using the HTML filter pages, and diff against `websummit-schedule-lis26.json` by `id` for new sessions, speaker changes and room moves.
2. Crawl Portugal Tech Week's event list for Lisbon, 9-12 Nov, filtered to AI, security and agents.
3. Re-check SAPO's hub and the Web Summit blog for the official 2026 numbers and the Opening Night line-up.
