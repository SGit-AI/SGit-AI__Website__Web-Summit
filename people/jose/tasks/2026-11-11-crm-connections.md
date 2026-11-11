---
for: crm@web-summit.jose
from: conductor@web-summit.jose, at Jose's word (11 November 2026: "go, both")
date: 2026-11-11
due: when Jose shares his connections file in your session
issues: WS-189, WS-170
status: blocked
---
# For crm@web-summit.jose: Jose's Web Summit connections into the private CRM, and the companies he owns

Jose has a spreadsheet of 37 Web Summit connections (name, company, job title, email, industry, country, date). It is personal data: it never goes into this repository, and the conductor has not copied it here. Jose shares the file with you in your own session.

1. **The people, into the private CRM only** (Dinis, WS-189: "the stand's interviews and everything we do goes first into a private CRM, including physical contacts ... then it goes public"): name, company, job title, country, date met and email, as Jose's contacts. Leave out the request messages. Skip the six RiskMandate teammates. Push the private CRM only with a token you are cleared to use (the 10 November task, 2026-11-10-vault-crm-push.md); until then keep it in your local clone and say so in your Report.
2. **The companies Jose owns (his word, 11 November):** 1Password (already in `data/companies.json`, now owner `jose`), and COREangels Cyber, YellowRocks.vc, Auriga Partners, PE and Growth, EquityMatch.co, Supabase, Vercel, Apify, LLM API, Oryksa and Attune. Add each of the eleven to `data/companies.json` with owner `jose` only once you have read a public source for it (the gate needs an id of lower-case letters, digits and hyphens not already in the file, the name, a source URL and the date read, and an attending status: say what the source shows, e.g. "met at Web Summit 2026 by Jose; attending not verified", with no person named). If a company's site does not open from your session, leave it out and list it in your Report.
3. No contact details and no person's name in the repository; companies only.
4. Run the reviewer before release.sh, measure, and log your run (the kit's shared sections).

**Done when:** your Report below says how many contacts are in the private CRM (pushed or local) and which of the eleven companies are in `data/companies.json`.

## Report

### crm@web-summit.jose, 2026-11-11 01:41 UTC: step 1 done (local), step 2 blocked by the network

**1. The people: 31 contacts in ws-team-crm-private, committed locally, not pushed.** Jose shared the file in my session on 11 November: 37 rows. The six RiskMandate teammates are skipped, which leaves 31. Each record is at `contacts/<slug>/contact.json` and holds the name, role, organisation, country, the date connected and the email (in `contact_details`). Each has `met_by: jose` and `owner: jose`, and each validates against the vault's contact schema. The request messages are left out. One links to an existing company record (1Password); the others carry their organisation as text. The file itself stays in my session and in no repository. Before writing, I pulled the vault (it was 23 commits behind) and merged; the only conflicts were the derived graph files, which I re-derived. Vault commit `d9e469ba`. The local branch is now 6 commits ahead of the remote: the channels area (since 6 November) and these contacts.

**Why not pushed:** `SG_SEND_ACCESS_TOKEN` is set in my environment, but Jose has not told me, or you for me, that he set the agents' token there (the 10 November task, step 1, "if you cannot tell, push nothing"). So I pushed nothing.

**2. The companies: none of the eleven added; `data/companies.json` is unchanged.** No company site opened from my session. The proxy refused supabase.com, vercel.com and apify.com (403 to the CONNECT, on its status page at 01:40 UTC). The fetch tool could not resolve equitymatch.co, llmapi.com, oryksa.com, coreangels.com, yellowrocks.vc, auriga-partners.com, attunecoach.ai and peandgrowth.com; it reports that for a host outside the environment's allowed domains or one that does not exist, so for these eight I cannot tell which. websummit.com does open, but a search of it found no exhibitor page for any of the eleven. Following your rule, each is left out. 1Password is already in the file with owner `jose`.

| Company | Why left out | What a search found (not read at the source) |
|---|---|---|
| Supabase, Vercel, Apify | site refused by the proxy (network policy) | no doubt about identity; only the source is missing |
| Auriga Partners | site did not resolve from my session | a Paris venture capital firm, with a cyber fund (Auriga Cyber Ventures) |
| YellowRocks.vc | site did not resolve from my session | an early-stage investor in San Francisco, with a Lisbon office in two directories |
| COREangels Cyber | site did not resolve from my session | a global angel network; no source names a "Cyber" fund |
| EquityMatch.co | site did not resolve from my session | one directory profile only |
| LLM API | site did not resolve from my session | a Microsoft Marketplace listing by Spendbase called "LLM API"; not confirmed as the same company |
| Attune | site did not resolve from my session | an AI coaching product incubated by Unlimit (attunecoach.ai); not confirmed as the same company |
| Oryksa, PE and Growth | no site known; guessed addresses (oryksa.com, peandgrowth.com) did not resolve | nothing found under these names |

**Ask for Jose** (no due date; about 5 minutes):
1. **The token:** if you set the agents' token in crm@web-summit.jose's environment, tell the conductor or me. Then the next run pushes the 6 local vault commits.
2. **The companies:** add the eleven sites to this environment's allowed domains (the environment's settings, Network access, Allowed domains), or pick a broader access level. Then the next run reads each site and adds the companies. Also, for LLM API, Attune, Oryksa and PE and Growth, give their websites if you know them: the names alone are ambiguous.

The reviewer passed this Report with notes before the push; I measured the run and logged it.
