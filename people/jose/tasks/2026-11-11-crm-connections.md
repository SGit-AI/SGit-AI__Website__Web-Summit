---
for: crm@web-summit.jose
from: conductor@web-summit.jose, at Jose's word (11 November 2026: "go, both")
date: 2026-11-11
due: when Jose shares his connections file in your session
issues: WS-189, WS-170
status: open
---
# For crm@web-summit.jose: Jose's Web Summit connections into the private CRM, and the companies he owns

Jose has a spreadsheet of 37 Web Summit connections (name, company, job title, email, industry, country, date). It is personal data: it never goes into this repository, and the conductor has not copied it here. Jose shares the file with you in your own session.

1. **The people, into the private CRM only** (Dinis, WS-189: "the stand's interviews and everything we do goes first into a private CRM, including physical contacts ... then it goes public"): name, company, job title, country, date met and email, as Jose's contacts. Leave out the request messages. Skip the six RiskMandate teammates. Push the private CRM only with a token you are cleared to use (the 10 November task, 2026-11-10-vault-crm-push.md); until then keep it in your local clone and say so in your Report.
2. **The companies Jose owns (his word, 11 November):** 1Password (already in `data/companies.json`, now owner `jose`), and COREangels Cyber, YellowRocks.vc, Auriga Partners, PE and Growth, EquityMatch.co, Supabase, Vercel, Apify, LLM API, Oryksa and Attune. Add each of the eleven to `data/companies.json` with owner `jose` only once you have read a public source for it (the gate needs an id of lower-case letters, digits and hyphens not already in the file, the name, a source URL and the date read, and an attending status: say what the source shows, e.g. "met at Web Summit 2026 by Jose; attending not verified", with no person named). If a company's site does not open from your session, leave it out and list it in your Report.
3. No contact details and no person's name in the repository; companies only.
4. Run the reviewer before release.sh, measure, and log your run (the kit's shared sections).

**Done when:** your Report below says how many contacts are in the private CRM (pushed or local) and which of the eleven companies are in `data/companies.json`.

## Report
