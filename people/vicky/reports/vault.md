# Reports from vault@web-summit.vicky

For conductor@web-summit.vicky, under the rule in people/vicky/inbox.md ("How Vicky's agents report"). Newest last.

## Wed 4 Nov 2026 (the newsroom's two vaults, from people/vicky/requests/2026-11-04-vault-newsroom.md)

- The research vault exists: `41j3e9s9`, in pack mode (`sgit create --packs`), with a README, `PUBLIC.md` (the rules, and an audit before every push) and `captures/_template.md`. Its key is sealed to researcher@web-summit.vicky's key (`researcher-vicky`), checked first by a security sub-agent. Vicky has the sealed link to paste into the researcher's session, as text at Vicky's choice. The researcher's 19 + 3 captures in people/vicky/newsroom/researcher/ can move into it.
- Its read key is not published yet. At Vicky's word, it goes on /vaults/ after the researcher's first captures are in the vault and audited. Pack vaults have no web view, so it opens with `sgit clone` only.
- The interview shortlist vault exists: confidential, with `PRIVATE.md`, `AUDIT.md` and `shortlist/_template.md`, and no names. Its read key is never published. Its key is held by vault@ and Vicky only, until programme@web-summit.vicky publishes a key; then it is sealed to programme@ after the same check.
- Vicky has her own copy of both vault keys (a file she opens in the app, deleted after she saves it).

## Wed 4 Nov 2026, evening (the research vault's key, resealed)

- From people/vicky/requests/2026-11-04-vault-research-key-reseal.md: the research vault `41j3e9s9`'s key is sealed to researcher@web-summit.vicky's new key, `researcher-vicky-2`, after a security sub-agent's check. The key was pushed by riskmandate-vicky in f22e6e0 and matches the live keys page. Vicky has the sealed text link to paste into the researcher's session. Nothing more is sealed to the retired `researcher-vicky`.
- The vault's `PUBLIC.md` now names its writers (vault@ and researcher@, key `researcher-vicky-2`), as step 4 of the vault guide now asks. It also requires `node admin/tools/vault-audit.mjs` before every push, with its last line logged in the vault. `vault-audit.mjs` on the vault as it stands: clean, 3 revisions.
- For researcher@, on receipt: check that `SG_SEND_ACCESS_TOKEN` is set without printing it, and that `vault-audit.mjs` runs from your clone of this repository. If either fails, don't push, and say so in your report. The read key stays unpublished until your captures are in the vault and audited.

## Wed 4 Nov 2026, 19:40 UTC (the research vault is public)

- The research vault `41j3e9s9` is now listed on /vaults/ with its read key (`people/vicky/vaults.json`, `"pack": true`, so the listing shows only its `sgit clone` line). curator@web-summit.vicky can read it with that line.
- First, vault@'s own audit: `vault-audit.mjs` was clean on all 6 revisions, and a separate security sub-agent read every file, file name and commit message in every revision. It found no secret, no personal data and nothing confidential, and every one of the 25 captures has a public URL and a read date. The result is logged in the vault's `PUBLIC.md`.
- For researcher@: your two audit rows in `PUBLIC.md` give times (18:10, 19:40) later than the commits that contain them (18:01, 19:34). Log the time the audit actually ran. Two captures disagree about a one-day transport pass (websummit-getting-around against the two Metro captures), which is for the curator.

## Wed 4 Nov 2026, 20:35 UTC (the interview shortlist vault's key, to programme@)

- The confidential shortlist vault's key is sealed to programme@web-summit.vicky's key `programme-vicky`, after a security sub-agent's check. The key was pushed by riskmandate-vicky in 141b694, is the only programme@ key, and matches the live keys page. The decision is logged in the vault's own `AUDIT.md`. Vicky has the sealed text link to paste into programme@'s session. The vault's read key is never published.
- For programme@: once the key arrives, move the names you hold into the vault, one file per person, using its template. Keep every shortlist name out of desks/programme/ and every other public place, until Dinis has picked (newsroom brief 9, decision 6).
- For conductor@: programme@ is not yet in people/vicky/agents.json or in data/team.json's list of Vicky's agents.

## Sun 8 Nov 2026, 10:00 UTC (the showcase in Vicky's public vault)

- Vault `k64ma7jd`'s app is v1.2.0. It opens on a Showcase tab: nine public pages Vicky chose from the team site and PrompTugal.news, each with Open and a live Preview. The card text is in the vault's `content.json`, and the live page is the source of truth. Its /vaults/ description says so (people/vicky/vaults.json).
- Audited before the push: `vault-audit.mjs` was clean on 12 revisions, and a separate security sub-agent was clean too (secrets, personal data, URLs on the two public sites only, code review). Logged in the vault's `PUBLIC.md`.
- Checked in the real vault viewer: all nine previews load the live pages, all nine Open buttons open the right page in a new tab, and all 10 files verify.
- Open by the app's own declared permission (`externalLinks`) skips the viewer's confirm bar, which the app's README says it shows. That is for Vicky to choose: keep direct opening and correct the README, or drop the permission and get the confirm back.
