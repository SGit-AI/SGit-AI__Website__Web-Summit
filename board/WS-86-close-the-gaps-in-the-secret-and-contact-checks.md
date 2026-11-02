---
id: WS-86
title: Close the gaps in the secret and contact-detail checks
area: tech
for: dinis
due: Tue 3 Nov
status: done
picked_by: dev@web-summit.dinis
agents: conductor@web-summit.dinis, dev@web-summit.dinis.
---
From security@web-summit.dinis, review of 2 November 03:00 (`team/security/reviews/2026-11-02-0300.md`, finding 2). Before the team starts pushing:

1. `admin/tools/comms_check.mjs` (gate check 15): scan `content/` too, every text file type (not only .md .json .eml .txt), and stop skipping `index.md`.
2. Its key rule: add Anthropic keys (`sk-ant-...` does not match today), `github_pat_`, `gho_`, `ghs_`, `xox[abprs]-`, `AIza`, and JWK private members (`"d":` beside `"kty"`).
3. `admin/build/validate.js` check 5: match any `-----BEGIN [A-Z ]*PRIVATE KEY-----` (today it misses OPENSSH, ENCRYPTED and DSA), as comms_check already does.

Add a test fixture for each shape so the gate proves it catches them.

Added by security@web-summit.dinis, review of 2 November 03:10 (finding 2):

4. `.gitignore`: since `059f871` only `.credentials/`, `.env`, `.envrc` and `.venv` are guarded. Add `.sg-send/`, `*.pem`, `*.key`, `id_rsa*`, `id_ed25519*`, `.pypirc`, `*.log`. Tested with `git check-ignore`: each of these is committable today.

Done (dev@web-summit.dinis, v0.1.45). The shapes live once, in `admin/build/secrets.cjs`, used by gate check 5 (every file) and by `comms_check.mjs` (check 15). 1: comms_check now reads every non-binary file, skipping only what `.generated.txt` lists instead of every `index.md`; `content/` is key-scanned by check 5 (every file), and joins the contact-detail scan once WS-88 is decided (it finds one role address). 2: `sk-ant-`, `github_pat_`, `gho_`, `ghs_`, `xox[abprs]-`, `AIza` and private JWKs (`"d"` beside `"kty"`, either order) are caught. 3: any `-----BEGIN [A-Z ]*PRIVATE KEY-----`. Fixtures: each shape has samples the gate must catch on every run, and public shapes (a public JWK, a fingerprint) it must not; weakening a rule turns the gate red (tested). 4: `.gitignore` guards `.sg-send/`, `*.pem`, `*.key`, `id_rsa*`, `id_ed25519*`, `id_ecdsa*`, `.env.*`, `.pypirc`, `.npmrc`, `*.log`; checked with `git check-ignore`, and `people/*/key.json` stays committable.
