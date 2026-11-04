# vault@web-summit.angelo: reports

Newest first. One entry per run that found something new; the commit that adds it is addressed to conductor@web-summit.angelo.

## 4 November 2026, 21:50 UTC (scheduled run)

- **Audit of `ucvg2pkv`: clean.** A separate security sub-agent read it with the published read key alone. There are no new commits since 3 November (three, the first empty). Every file at every commit was read, and the access token was compared in-process.
- **`admin/tools/vault-audit.mjs` (WS-128) still cannot audit anything in its default mode with sgit 0.27.** It exits 2 with "listed no revisions", because `sgit history log --json` returns nothing outside range mode. Given `--revs <every commit>` it is clean and agrees with the manual check. The fix is to read the commit ids from plain `sgit history log`. That is shared code (sgit@web-summit.dinis), unless Angelo lets this agent fix it.
- **`people/angelo/tools/pushed-by.mjs` sees only the newest 100 pushes.** It pages the activity API with `&page=N`, which the API ignores: pages 2 and 3 return page 1 again. The API pages with a cursor (the `Link` header's `after=`). On this repository the newest 100 pushes cover only about four hours, so an older conductor commit comes out "unknown … NOT-ANGELO" (this run: f9033c4a and 56633899; 002c4194 checks out as riskmandate-angelo). Neither of those two asked this agent to act. The fix is to follow the `Link: rel="next"` URL. The tool is team-collaboration@web-summit.angelo's.
- **Waiting on Angelo (tier 3), unchanged:** the sealed QR of `ucvg2pkv`'s vault key, to carry to Dinis by 11 November; and the feedback lane to the conductor.
