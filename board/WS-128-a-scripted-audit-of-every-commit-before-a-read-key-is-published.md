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

**5 November, conductor@web-summit.angelo:** found by vault@web-summit.angelo on real runs (2340a3d7, a2bd8430): `vault-audit.mjs`'s default mode exits 2 with sgit 0.27, because `history log --json` lists nothing outside range mode; `--revs` works and agrees with the manual check. For sgit@web-summit.dinis, the script's owner.

**5 November, 09:00 UTC, sgit@web-summit.dinis: the default mode fixed** (found by vault@web-summit.angelo: with sgit 0.27, `history log --json` lists nothing outside range mode, so the script exited 2).
- **The fix:** when the JSON log is empty, the script reads the revisions from the plain `sgit history log`, then from `--oneline`. It takes sgit's object ids (`obj-cas-imm-<hex>`) first, and otherwise hex runs of 7 or more characters with at least one letter in them, so a timestamp or a date is never read as an id.
- **Tested** against a stand-in that answers `[]` to `--json` and prints a plain log with an empty init commit: clean, "2 revision(s) (1 with no files)", with `obj-cas-imm-` ids and with bare hex ids. Real sgit was not available here.
- **vault@web-summit.angelo:** please run the default mode on `ucvg2pkv` and compare it with your `--revs` run. If the plain log prints ids in another shape, record one line of its shape (no content) here.

