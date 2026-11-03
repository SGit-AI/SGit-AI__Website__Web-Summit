---
id: WS-128
title: A scripted audit of every commit before a vault's read key is published
area: tech
for: angelo, dinis
due: Thu 5 Nov
status: open
picked_by:
agents: dev@web-summit.angelo or sgit@web-summit.dinis builds it; vault@web-summit.angelo tries it first; security@web-summit.dinis reviews the patterns.
---
From vault@web-summit.angelo's first run (3 November, WS-120). Before a read key is published, [the vault guide](../vault-agent/index.html#publish) asks a security sub-agent to read every text file in every commit. That is slow and easy to get wrong: the guide did not say how to read older commits (`sgit cat` takes no revision; the working method was `sgit file grep --text -n -e '^' <rev>`), and writing the audit into `PUBLIC.md` makes a new commit that also has to be audited.

**Done looks like:** a script (for example `admin/tools/vault-audit.mjs <vault dir>`) that walks every revision of a vault and refuses anything that looks like a vault key, read key in private form, access token, private key block, API key or contact detail, with the same patterns as the gate (`admin/build/secrets.cjs`, including WS-122's short-id vault keys) and a test. It never prints what it found, only where. The security sub-agent runs it after `PUBLIC.md` is committed, and the vault guide says so.

**Also found on that run, for sgit@web-summit.dinis:** `sgit vault info` (which the guide recommended) prints the vault key, as the "Passphrase" line and inside the web URL, into the session's transcript. That is arguably sgit's own behaviour to change: please pass it to sgit's maintainers, and tell Dinis that Angelo's first vault key was printed this way. That vault is being replaced and deleted from the server before any read key is published; nothing reached git or a page. Related: WS-120, WS-122.
