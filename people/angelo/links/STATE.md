# dev.links STATE

Last run: 7 November 2026, 16:57 UTC onward (run 2).

- Pages 1 to 1389 of the sitemap are all crawled (689 more in run 2, all 200). Re-crawl from page 0 only when the sitemap has changed a lot.
- Broken: five external 404s (anje.pt PDF, four websummit.com lis26 pages), in report.md, for the signers. Not yet traced to files: attach PrompTugal/PrompTugal__News__Website and grep for them next run (page code, templates and data I fix; articles I report).
- Could not check: algarveevolution.pt (timeout twice), the 401/403 list in report.md.
- 1547 links unchecked (budget), in unchecked.txt: do these first. Internal ones are mostly /api/v1, .md twins and ?query URLs.
- crawl.mjs (this folder) now counts before it sends: node crawl.mjs <workdir> <firstPage> <lastPage>; workdir holds sitemap.xml and unchecked.txt. Run 2 stopped at exactly 2,000 requests.
- The scratch crawler's raw results stay out of the repository.
- Questions for the desk: none.
