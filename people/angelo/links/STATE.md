# dev.links STATE

Last run: 8 November 2026 (run 6).

- Run 6: the sitemap is 1,411 pages; crawled the new tail (1408 to 1410, 17 requests): all 200, no new broken link. Rechecked the 404s: startupportugal pt, anje.pt PDF and websummit.com qase still 404; algarveevolution.pt still unreachable (could not check). 10b is with Dinis's team (backlog 0b). Next run: re-crawl from page 1411 for new pages.

- Run 5: the sitemap is 1,408 pages; crawled the new tail (1400 to 1407, 39 requests): all 200, no new broken link. Rechecked the five 404 sources I can reach: the same four 404s (startupportugal pt, anje.pt PDF, websummit.com qase and paul-jenkinson); algarveevolution.pt still times out (could not check). Two github.com links (WS-177 board file, newsroom REALITY.md) answered 504: could not check, a transient, not broken. Next run: re-crawl from page 1408 for new pages. The newsroom's repository is not attached to this task, so backlog 10b and any newsroom fix wait for dev@ (backlog 0b).

- First full pass is done: all sitemap pages crawled, all links found checked, none left over (unchecked.txt removed).
- Broken: six external 404s, traced to files in report.md. One is in a signed article (startupportugal.com, replacement found: for journalist@PrompTugal.dinis); five are cited sources in the evidence data (anje.pt PDF, four websummit.com lis26 pages), where there is no replacement address, so not edited.
- Could not check: 21 x 403 (ebu.ch, LinkedIn share links), the earlier 401/403 list, algarveevolution.pt (timeout).
- Run 4: the sitemap is 1,400 pages; crawled the new tail (1395 to 1400, 20 requests): all 200. The six 404s are still 404 (algarveevolution.pt still times out: could not check).
- Backlog 10b (mark five dead sources "page removed"): the edit is done as a draft, drafts/10b-page-removed.patch (six one-line changes: `supports` of the four companies' sources.json, `how` of anje and algarve-evolution organisation.json; against newsroom dev e407b04, JSON valid). NOT pushed: the newsroom's gate (node newsroom/build/validate.js) was refused by auto mode in my session ("code from external"), and the spec forbids a push without a passing gate. Needs: someone able to run that gate applies it (dev@PrompTugal.angelo, For: dev@PrompTugal.dinis), or Angelo allows the run.
- Next run (old note, partly done): the sitemap has grown (1,399 pages): re-crawl from page 1218 for new pages, then re-check the six 404s; crawl.mjs <workdir> <first> <last>.
- Newsroom clone worked (read-only so far; no fix of mine needed there).
- Questions for the desk: should the data owners (programme desk, journalist) drop or mark the dead websummit.com sources? Recommend: mark "page removed, read 7 Nov" and keep the fact.
