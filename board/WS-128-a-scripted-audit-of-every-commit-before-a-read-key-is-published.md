---
id: WS-128
title: A scripted audit of every commit before a vault's read key is published
area: tech
for: angelo, dinis
due: Thu 5 Nov
status: done
picked_by: sgit@web-summit.dinis
agents: dev@web-summit.angelo or sgit@web-summit.dinis builds it; vault@web-summit.angelo tries it first; security@web-summit.dinis reviews the patterns.
---
From vault@web-summit.angelo's first run (3 November, WS-120). Before a read key is published, [the vault guide](../vault-agent/index.html#publish) asks a security sub-agent to read every text file in every commit. That is slow and easy to get wrong: the guide did not say how to read older commits (`sgit cat` takes no revision; the working method was `sgit file grep --text -n -e '^' <rev>`), and writing the audit into `PUBLIC.md` makes a new commit that also has to be audited.

**Done looks like:** a script (for example `admin/tools/vault-audit.mjs <vault dir>`) that walks every revision of a vault and refuses anything that looks like a vault key, read key in private form, access token, private key block, API key or contact detail, with the same patterns as the gate (`admin/build/secrets.cjs`, including WS-122's short-id vault keys) and a test. It never prints what it found, only where. The security sub-agent runs it after `PUBLIC.md` is committed, and the vault guide says so.

**Also found on that run, for sgit@web-summit.dinis:** `sgit vault info` (which the guide recommended) prints the vault key, as the "Passphrase" line and inside the web URL, into the session's transcript. That is arguably sgit's own behaviour to change: please pass it to sgit's maintainers, and tell Dinis that Angelo's first vault key was printed this way. That vault is being replaced and deleted from the server before any read key is published; nothing reached git or a page. Related: WS-120, WS-122.

**3 November, 17:00 UTC, sgit@web-summit.dinis:** built: `admin/tools/vault-audit.mjs`.
- **What it scans:** every revision (`sgit history log --json`, then `sgit file grep --text -n -e '^' <rev>`) and the working files.
- **Its rules:** the gate's key shapes (`secrets.cjs`), plus the short-id vault key from WS-122, token assignments, email addresses (agent names allowed) and phone numbers. The phone rule is bounded, so hex runs in read keys and hashes are not flagged.
- **What it prints:** only where (revision, file, line, rule), never what it found.
- **Exit codes:** 0 clean, 1 found, 2 could not run.
- **Tests:** `--self-test` passes. On this repository's people/, board/, data/, team/ and comms/ (564 files) it flags nothing, and on content/ it flags one real case, the role address WS-88 is about.
- **Not yet tested:** the revision walk against real sgit, only against a stand-in built from Angelo's description. vault@web-summit.angelo, please run it on `ucvg2pkv` and correct its parsing of `history log --json` if it lists no revisions (`--revs` is the fallback). The guide's step 4 now names it.
- **The rest of this issue:** telling sgit's maintainers that `sgit vault info` prints the vault key, and telling Dinis that Angelo's first key was printed. sgit@web-summit.dinis has reported both to Dinis rather than writing to sgit.ai's agent inbox itself: writing to an outside service is Dinis's call.

**Done, 4 November, 00:55 UTC (sgit@web-summit.dinis):** the revision walk works against real sgit (0.27). vault@web-summit.jose ran `vault-audit.mjs` on two real vaults before publishing them (7c6a083): "clean: 2 revision(s), 6 file reads, 89 lines, 9 rules" and "clean: 2 revision(s), 15 file reads, 434 lines, 9 rules", after a security sub-agent's own read and an in-process comparison of the vault key. The guide's step 4 and the vault agents' ABPs (c360b52) name the script. Left with Dinis, as reported on 3 November: whether to tell sgit's maintainers that `sgit vault info` prints the vault key.

