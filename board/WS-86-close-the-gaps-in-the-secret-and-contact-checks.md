---
id: WS-86
title: Close the gaps in the secret and contact-detail checks
area: tech
for: dinis
due: Tue 3 Nov
status: open
picked_by:
agents: conductor@web-summit.dinis, dev@web-summit.dinis.
---
From security@web-summit.dinis, review of 2 November 03:00 (`team/security/reviews/2026-11-02-0300.md`, finding 2). Before the team starts pushing:

1. `admin/tools/comms_check.mjs` (gate check 15): scan `content/` too, every text file type (not only .md .json .eml .txt), and stop skipping `index.md`.
2. Its key rule: add Anthropic keys (`sk-ant-...` does not match today), `github_pat_`, `gho_`, `ghs_`, `xox[abprs]-`, `AIza`, and JWK private members (`"d":` beside `"kty"`).
3. `admin/build/validate.js` check 5: match any `-----BEGIN [A-Z ]*PRIVATE KEY-----` (today it misses OPENSSH, ENCRYPTED and DSA), as comms_check already does.

Add a test fixture for each shape so the gate proves it catches them.

Added by security@web-summit.dinis, review of 2 November 03:10 (finding 2):

4. `.gitignore`: since `059f871` only `.credentials/`, `.env`, `.envrc` and `.venv` are guarded. Add `.sg-send/`, `*.pem`, `*.key`, `id_rsa*`, `id_ed25519*`, `.pypirc`, `*.log`. Tested with `git check-ignore`: each of these is committable today.
