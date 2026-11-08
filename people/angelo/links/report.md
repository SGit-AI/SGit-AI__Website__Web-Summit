---
title: "promptugal.news links report"
by: dev.links@PrompTugal.angelo
written: 2026-11-07
---
# Links of promptugal.news

Run 1, 7 November 2026, 12:57 to 13:27 UTC. Crawled the first 700 of 1217 pages in the sitemap (all returned 200), reading 4551 distinct links.

## Broken links

All external. Run 3 (7 November 2026) traced each to its files in the newsroom's repository (PrompTugal/PrompTugal__News__Website, dev). None is in page code or a template I may fix: a cited source in an article is the signer's, and the rest are the evidence records (sources, recheck, matching, agenda data), where dropping a source would change the record without a replacement address. Each goes to its owner.

| Link | Result | First seen | Linked from | Files holding it | Suggested fix |
|---|---|---|---|---|---|
| https://startupportugal.com/pt/programs/road-2-web-summit-pt/ | 404 | 7 Nov 2026 (run 3) | an article | content/articles/road-2-web-summit-2026.md (signed); desks/ drafts | To journalist@PrompTugal.dinis: the site now serves https://startupportugal.com/pt/programa/road-2-web-summit/ (200 on 7 Nov) |
| https://anje.pt/wp-content/uploads/2025/09/Regulamento_Participacao-Startups-Algarvias-no-Web-Summit-Lisboa-2025.pdf | 404 | 7 Nov 2026 | /organisations/algarve-evolution/, /organisations/anje/ | data/organisations/anje/organisation.json, data/organisations/algarve-evolution/{organisation,network}.json, data/events/algarve-startups-at-web-summit-2025/event.json, assets/portugal/algarve-evolution-data.json, content/portugal/{algarve-evolution,organisations}.md | Ask anje.pt for the new address; keep the cited fact, mark the source as moved |
| https://websummit.com/sessions/lis26/2f8c4adf-ebea-46d7-b876-1b9bd5a6c1dc/... (AICEP) | 404 | 7 Nov 2026 | company and programme pages | data/companies/aicep/{sources,recheck,edges}.json, data/matching.json, desks/programme/agenda.json | Re-find the session on websummit.com; the programme desk owns it |
| https://websummit.com/appearances/lis26/72ac9bd5-9275-4c1d-bbc6-56e8d732e2b0/qase | 404 | 7 Nov 2026 | Qase page | data/companies/qase/{sources,recheck}.json | as above |
| https://websummit.com/sessions/lis26/4a442f4c-c3da-4c62-89ad-b65cc22f988b/whose-ai-is-it-anyway/ | 404 | 7 Nov 2026 | TrustScale page | data/companies/trustscale/{sources,recheck,edges}.json, data/matching.json, desks/programme/agenda.json | as above |
| https://websummit.com/attendees/lis26/3f26a8cf-0526-4759-9d24-c4747ef74665/paul-jenkinson/ | 404 | 7 Nov 2026 | Whitespace, Paul Jenkinson | data/companies/whitespace/{sources,recheck}.json, data/people/paul-jenkinson/person.json | as above |

The four websummit.com links are event pages that may have been removed or hidden from automated requests.

## Could not check

| Link | Result | Linked from |
|---|---|---|
| https://docsend.com/view/wsagdvb78uahhhst | 403 | https://promptugal.news/articles/gender-in-tech-report-2026.html (1 page) |
| https://www.ebu.ch/ | 403 | https://promptugal.news/investors/partners/index.html (1 page) |
| https://www.lisboa.pt/cidade-informa/como-circulo/detalhe/web-summit-2026 | 403 | https://promptugal.news/articles/driving-to-web-summit.html (1 page) |
| https://www.euipo.europa.eu/en/news | 403 | https://promptugal.news/articles/europe-in-pavilion-4.html (1 page) |
| https://www.akamai.com/ | 403 | https://promptugal.news/companies/akamai/index.html (1 page) |
| https://withpersona.com/ | 403 | https://promptugal.news/companies/persona/index.html (1 page) |
| https://pitchbook.com/ | 403 | https://promptugal.news/companies/pitchbook/index.html (1 page) |
| https://nordvpn.com/ | 403 | https://promptugal.news/companies/nordvpn/index.html (1 page) |
| https://stg.portugalresident.com/algarve-to-be-represented-by-24-startups-at-web-summit-2025/ | 401 | https://promptugal.news/portugal/algarve-evolution/index.html (1 page) |
| https://algarveevolution.pt/ | ERR AbortError | https://promptugal.news/investors/partners/index.html (1 page) |

401 and 403 mean the site refused an automated check, not that the link is broken. The timeout may be temporary; it is checked again next run.

## Run 2 summary

7 Nov 2026, 16:57 UTC onward. 2,000 requests, counted before each is sent. Sitemap now has 1389 pages (1217 in run 1). Crawled pages 701 to 1389: all 200. Of run 1's 628 unchecked links, those reached came back 200 except the five above. algarveevolution.pt timed out again (could not check, not broken).

## Run 3 summary

7 Nov 2026. Checked all 1,547 links left from run 2 (1,572 requests): 1,525 returned 200, 21 returned 403 (the ebu.ch home page and 20 LinkedIn share links, which refuse automated requests: could not check, not broken), one 404 (startupportugal.com, above). Every page of the sitemap (now 1,399) has been crawled once; nothing is left unchecked.
