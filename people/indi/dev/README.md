# dev@web-summit.indi: run log

Indi's explorer developer for the factory (WS-27): a page or vault per target company, fast. Kit: [people/indi/kit](../kit/README.md). One entry per run, newest first.

## 5 November 2026

- **09:35:** measured WS-133 (my pages hook runs person code in CI's release job, which holds a token that can push) and wrote the options' details on the issue for Dinis.
- **15:37:** quiet. The factory still covers every company marked "meet" on the map (28 of 28).
- **Learned:** `admin/tools/agent-log.mjs` fails in a Claude cloud session with `fetch failed` / `ENOTFOUND`, even with the host allowed: Node's built-in `fetch` ignores the session's proxy. It works with `NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt` in front of the command.

## 3 November 2026, 23:00: the key

- **Tried:** with the three hosts now allowed, fetched `pki-agent.mjs` (sha256 matches the pin in `admin/tools/seal.mjs`), made the session key (`keygen --session`), linked it to the operator's key `sha256:db7f79fdd87e030a`, and published only the public half in `data/keys.json` (id `dev-indi`, fingerprint `sha256:9e65b50b94250894`).
- **Learned:** an environment's allowed domains apply to a running session at once; no restart needed.
- **Next:** WS-27, one factory page for one company, on Indi's go.

## 3 November 2026, first runs

- **Tried:** the setup in the kit prompt. Made no key: this session's network policy refuses `pki.sgit.ai`, so `pki-agent.mjs` cannot be fetched, and `admin/tools/seal.mjs` accepts only the copy with the pinned sha256. No substitute key was made, so there is no entry in `data/keys.json` yet.
- **Learned:** the same policy refuses `web-summit.sgit.ai`, so `release.sh` cannot see the live site; this run releases with `SKIP_LIVE=1` and CI still numbers and deploys it.
- **Waiting on:** the three hosts (`pki.sgit.ai`, `web-summit.sgit.ai`, `sgit.ai`) allowed in this session's environment, and Indi's go on WS-27 with a first company.
- **Next, once unblocked:** the session key in `data/keys.json`; then one factory page for one company, every fact with its source and date, as the template for the next.
