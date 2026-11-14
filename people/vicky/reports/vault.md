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
- 10:10 UTC: Vicky chose to keep Open going straight to the live page (no confirm bar). Vault app v1.2.1 corrects its README to say so, nothing else changed; audited before the push (clean), and checked in the viewer.

## Mon 9 Nov 2026, 11:35 UTC (SA27: the interview shortlist vault's key to inbox@)

- applied SA27. The interview shortlist vault's key is sealed to inbox@web-summit.vicky's key `inbox-vicky`, in addition to programme@'s copy. Vicky has the sealed text link to paste into inbox@'s session; it expires in 2 days.
- Checked first: `seal.mjs --check inbox-vicky` shows both fingerprints as Vicky gave them, pushed by riskmandate-vicky in 714a214 and unchanged since, matching the live keys page. The seal also passed `--fingerprint`, which Vicky confirmed from inbox@'s session. SA27 was added by conductor@'s own commit (8dcdec1a), pushed by riskmandate-vicky. A separate security sub-agent agreed, and the decision is logged in the vault's own AUDIT.md.
- For Vicky to decide: the vault's PRIVATE.md rule 4 allows only public facts about each person, "nothing from a private conversation", and rule 6 names only programme@ as an owner. Interview recordings and transcripts under SA27 need those rules updated, or a separate vault for recordings.
- For inbox@: before using the key, add the vault's rules to your prompts file. Nothing from the vault goes into a Gmail draft, the CRM, a report or a commit message.

## 11 November 2026, 19:35 UTC (one-off confirmation wake, RULES-11NOV)

- No HOLD.md. Read decisions.md (standing answers 31 and 32: commits 2414b15, bbe5613, 865821f and c5d266a, each by conductor@web-summit.vicky and pushed by riskmandate-vicky) and the RULES-11NOV section at the top of prompts/vault.md.
- confirmed RULES-11NOV: no machine reads of websummit.com, Luma, Meetup or Eventbrite; checked tools, scripts, notes and wake prompt; removed: nothing (none found: my scratchpad scripts, my vault tools and apps, my notes, reports and prompts file, ~/.sg-send/tools, and this one-off wake's prompt; I have no recurring task); key: kept vault-vicky (encryption sha256:7a94165343647f9e, signing sha256:7039652f756f7269), which still signs. There is no "-b" entry for it, so nothing needs a reseal on my side.
- Not mine to change, left as rule 3 says: the research vault's existing captures, written by researcher@, include websummit.com source URLs. My copy of that vault is only a clone. I read nothing from those sites.
- Waiting, after this confirmation: vault A (decisions.md, the RULES-11NOV request list), and P1 to P3 in prompts/vault.md (SA16, 7 Nov; never applied, as no wake reached me).
- state: ok; done: RULES-11NOV confirmed; next: wait for the conductor or Vicky (vault A; SA16's P1 to P3); ask: none; run: scheduled

## 11 November 2026, 19:55 UTC (SA33-VAULTS)

- applied SA33-VAULTS: vault A `wyt9jdeo` (tools, apps and agent reports) and vault B `lhsdkd4x` (Vicky's ideas) exist. Both are private, with no read key ever made. Each has its rules (PRIVATE.md: vault A's carry standing answer 35's safe-to-publish rule and security@'s pass before any tool is shared) and an AUDIT.md. Both were audited with vault-audit.mjs (clean).
- Both keys are sealed to conductor-vicky-2, after a security sub-agent's check (pushed by riskmandate-vicky in f21a60e, unchanged since, matches the live keys page, no newer conductor key anywhere), logged in each vault's AUDIT.md. Vicky has both sealed links for the conductor's session, and her own copy of vault B's key.
- For dev@PrompTugal.vicky (vault A, not sealed yet): the team site's data/keys.json still lists your old key `dev-vicky-promptugal` as active, while the newsroom marks it superseded and your current key is `dev-vicky-promptugal-c`. seal.mjs reads only the team site's list. To unblock: add `dev-vicky-promptugal-c` to the team site's data/keys.json by your own commit, the same bundle, marking `dev-vicky-promptugal` superseded with the time. Then vault@ checks it and seals vault A to it.
- state: partial; done: vault A and vault B made and sealed to the conductor; next: seal vault A to dev@ once its current key is on the team site, and to any other agent the conductor lists; ask: none; run: prompted

## 11 November 2026, 20:15 UTC (one-off wake, SA38-SEAL)

- applied SA38-SEAL: vault A `wyt9jdeo`'s key is sealed to dev@PrompTugal.vicky's current key `dev-vicky-promptugal-c` (signing sha256:beac4728d9e041b1). Vicky has the sealed text link for dev@'s session; it expires in 2 days.
- Checked first: standing answer 38 is conductor@'s commit 89278cad3, pushed by riskmandate-vicky. `seal.mjs --check dev-vicky-promptugal-c` shows the key added by dev@'s own commit c282c5e, pushed by riskmandate-vicky, unchanged since, matching the live keys page. It is identical to the newsroom's entry, the old `dev-vicky-promptugal` is superseded, and no newer dev@ key exists. A security sub-agent agreed, logged in vault A's AUDIT.md (vault-audit.mjs clean).
- Vault A is now sealed to the conductor (conductor-vicky-2) and dev@. Its rules: tools are safe to publish later, and none is shared until security@ passes it.
- state: ok; done: vault A sealed to dev@; next: wait for the conductor or Vicky (any other agent the conductor lists for vault A); ask: none; run: scheduled

## 14 November 2026, 09:40 UTC (vault A and vault B resealed to conductor-vicky-3)

- Vault A `wyt9jdeo` and vault B `lhsdkd4x` are resealed from conductor-vicky-2 to conductor-vicky-3, at Vicky's word. The sealed files are committed for the new conductor in data/sealed/agents/conductor@web-summit.vicky/ (2026-11-14T0938Z-vault-a-key-conductor-vicky-3.json and -vault-b-), valid 7 days. Open each with `node pki-agent.mjs open "<link>" --save <dir>` and never print the opened key.
- Checked first: conductor-vicky-3 was added by the conductor's own commit 18ff359, pushed by riskmandate-vicky, unchanged since, and matches the live keys page (once the 09:30 release finished). A security sub-agent agreed and found no sign that conductor-vicky-2 leaked, so no key rotation is needed. Logged in each vault's AUDIT.md, and both audits are clean. Vault B's README and PRIVATE.md now name conductor-vicky-3.
- For the outgoing conductor: once the new conductor confirms it has opened both, delete the opened vault keys and conductor-vicky-2's private half, and stop.
- For the new conductor:
  - The newsroom's board/keys.json still lists the old key as conductor-vicky-2-promptugal, "active", and has no conductor-vicky-3. Retire the old entry there and publish the new key, so nobody seals to the retired one.
  - The start kit says sealed files go under data/sealed/, and conductor-notes.md says people/vicky/sealed/. These went to data/sealed/agents/, as the start kit says; correct the notes.
- state: ok; done: vault A and B resealed to conductor-vicky-3, sealed files committed; next: wait for the conductor or Vicky; ask: none; run: prompted

## 14 November 2026, 10:20 UTC (CLEANUP-14NOV, from people/vicky/tasks/2026-11-14-1015-cleanup-vault.md)

- applied CLEANUP-14NOV: in prompts/vault.md, RULES-11NOV rule 5 is now standing answer 31's new rule 5 (lisbontechfringe.com only), and rule 7 is its "Retired 14 Nov" line. My file had no lines on publishing waiting for Vicky, on never messaging another session, or resting on archived entries, and no summit-only shortlist rules. Everything else is unchanged.
- applied SA16: P1 to P3 were not in my file (no wake reached me on 7 Nov), so they are now added word for word from standing answer 16 as it stands, with P1 widened by standing answer 63. I have no scheduled task, so there is no prompt to change.
- SA54-LEDGER: people/vicky/ledger/vault.jsonl holds my first line (the session total so far) and this run's ("prompts update"), numbers only.
- For Vicky or the conductor: the interview shortlist vault's own PRIVATE.md still carries its summit purpose ("until Dinis has picked"). That file is inside the vault, not in my prompts file, so I left it. Standing answer 63 says to archive the vault's summit rules; tell me if you want that wording changed there.
- state: ok; done: CLEANUP-14NOV and SA16 applied, ledger started; next: wait for the conductor or Vicky; ask: none; run: prompted

## 14 November 2026 (the interview shortlist vault is an archive)

- At Vicky's word: the interview shortlist vault's PRIVATE.md description now says "Web Summit is over. This vault is kept as an archive; no new work." in place of "until Dinis has picked". Rule 1, that nothing leaves the vault until Dinis has picked and the person has been asked, is unchanged, at her choice. vault-audit.mjs is clean.
- state: ok; done: shortlist vault marked as an archive; next: wait for the conductor or Vicky; ask: none; run: prompted

## 14 November 2026, 10:50 UTC (PROMPTS-SHORT, from people/vicky/tasks/2026-11-14-1055-prompts-short-vault.md)

- applied PROMPTS-SHORT: in prompts/vault.md, the RULES-11NOV block and P1 to P3 are replaced by the one-line pointer to decisions.md (standing answer 64). Kept as they were: my startup prompt, the note that I have no scheduled task, and the standing rules Vicky gave me in my own window, each with its date. 11,289 to 6,329 bytes. I have no scheduled task, so there is no prompt to keep P1 to P3 in.
- state: ok; done: prompts file shortened; next: wait for the conductor or Vicky; ask: none; run: prompted
