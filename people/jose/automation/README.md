# Jose's automation agent: the n8n flows

Kept by `automation@web-summit.jose` (started 4 November 2026, at Jose's word; its prompt is in `people/jose/kit/README.md`). The n8n flows that carry the team's information to people, as code with tests. **It never sends:** every flow here is inactive on import, sends only to Jose, and Jose decides what goes further. No number, token, enum key, chat id, webhook URL or invite link goes in this folder: they stay in n8n's credentials.

## Schedule

A scheduled task fires into this agent's own session at **10:10 and 16:10 UTC** (cron `10 10,16 * * *`), with the scheduled-task prompt in `people/jose/kit/README.md`. Created on 4 November 2026 at 23:34 UTC, at Jose's word; the first wake is 5 November at 10:10. Each wake pulls dev, re-reads the kit and its sections of `content/agents.md` (it has none yet; the kit is where its prompt lives), reads Jose's latest mentor note, does one run, runs the reviewer before `release.sh`, releases, and reports in five lines; if nothing changed, it commits nothing. Commits from a wake carry the body line `Ran without a prompt (scheduled wake, <HH:MM> UTC).` (the convention in `people/jose/dev/README.md`).

| Flow | What it does | Files | Tests |
|---|---|---|---|
| WS-39 route 3 | The journalist's newest report, drafted, to Jose on WhatsApp; Jose forwards it to the group | kept by dev@web-summit.jose in `people/jose/dev/` (`WS-39-route3.*`, `WS-39-findings.md`) | `node people/jose/dev/WS-39-route3.test.mjs` |
| WS-74 pending | How many answers are waiting on vault@web-summit.jose's feedback lane, as a note to Jose, only when the number changes | `WS-74-pending.build.mjs` makes `WS-74-pending.n8n.json` | `node people/jose/automation/WS-74-pending.test.mjs` (11, offline; `--live` adds a check of the live site) |

All the tests: `for t in people/jose/dev/*.test.mjs people/jose/automation/*.test.mjs; do node "$t" || break; done`

## WS-74 pending: the n8n side of the feedback lane

Eight nodes in a line: a schedule (07:20, 12:20 and 17:20 UTC, 40 minutes before each stand-up and once in the morning) → **Settings** → **Get the site's lanes** (an HTTP Request node, the public `assets/feedback.json` as text, no credential) → **Find the lane** (pure logic: vault@web-summit.jose's entry in the live site's `assets/feedback.json`: host, vault id and append token, all public, so a new lane is followed without editing the flow; the host must be the one in Settings, `https://dev.send.sgraph.ai`, so the enum key is never sent anywhere else) → **List the lane** (`POST <host>/api/vault/append/list/<vault>`, metadata only, `include_content: false`, page by page) → **Draft the note** → **Send to Jose** (WhatsApp Cloud API, as route 3) → **Remember the note** (only after Meta accepted it).

What Jose gets, for example: *"WS-74 feedback lane: 4 answers are waiting on vault@web-summit.jose's vault (was 3 at the last note). vault@web-summit.jose drains them into jose-inbox; feedback-summary.mjs makes the summary a person reads, and nothing is quoted without the person's tick."* It counts every pending file on the vault, whatever its lane, since answers sent under an earlier token (before a new vault session) are drained too; when some are, it adds how many are on the site's current lane. From 800 pending on that lane it adds a warning: at 1000 the lane refuses new answers (507). Nothing is sent when the count is unchanged, or when the lane is empty after a drain (that is remembered, so the next answers are still reported).

**It counts, it never reads.** The listing asks for no content, and the answers are sealed to the vault agent's key anyway; execution data of successful runs is not saved (`saveDataSuccessExecution: none`).

### WS-74: to fill in n8n

1. **A decision for Jose first: the enum key.** Listing a lane needs the vault's **enum key** (`x-sgraph-vault-enum-key`); the public append token can only write ([sgit.ai: append lanes](https://sgit.ai/api/append-lanes.md), read 4 November 2026). The enum key can list, fetch (ciphertext only, sealed to the vault agent) and mark processed; it cannot write, purge or open anything. Today it exists only in vault@web-summit.jose's session (`people/jose/lanes/README.md`). Putting it in n8n puts a second copy of a vault credential outside that session, which WS-129 asks us to think about: it is Jose's call. If yes, vault@web-summit.jose hands it to Jose (never in the repository or a commit), and:
2. **The credential** on "List the lane": a new *Header Auth* credential, name `x-sgraph-vault-enum-key`, value the enum key; call it "WS-74 lane enum key".
3. **The credential** on "Send to Jose", and **`to`**, **`phone_number_id`**, **`graph_version`** (and for `mode: 'template'`, `template_name` and `template_language`) in "Settings": the same as route 3, `people/jose/dev/WS-39-findings.md`, "To fill in n8n" (the same WhatsApp credential can be reused).
4. **Template mode (recommended, as for route 3):** a Utility template in Meta's WhatsApp Manager with **two** body parameters and fixed text before and after, for example *"RiskMandate feedback inbox (WS-74): {{1}}. {{2}} This note goes to Jose only."* `{{1}}` is the headline ("4 answers are waiting on vault@web-summit.jose's vault", or "n8n could not list ... (404)"), `{{2}}` the rest, with the 507 warning when there is one. Not a body of just `{{1}}`: Meta rejects a template that starts or ends with a parameter (`people/jose/dev/n8n-build-guide.md`, section 4; its third-party sources in section 13). Then `mode: 'template'`, `template_name`, `template_language` in Settings.
5. **Publish** the workflow (n8n 2.x and 3.0; "Activate" in older versions): schedules run only on the published version, and n8n keeps static data (the last note) only for those runs, not for test runs.

**When the vault session changes,** it makes a new enum key, and the old one in n8n gets 404. The flow then tells Jose once: *"n8n could not list vault@web-summit.jose's lane (404): ... Ask vault@web-summit.jose for the new key and update the n8n credential."* Nothing is lost; the answers stay pending.

## Proposed to dev@web-summit.jose: route 3 can mark a report sent that Jose never got

In `mode: 'text'`, "Send to Jose" succeeds when Meta *accepts* the message and returns a message id. Outside the 24-hour window, the failure (error **131047**, "re-engagement message") can arrive afterwards, as a `failed` status on the business number's webhook, not in the send's response. Route 3 has no webhook, so "Remember the report" records the report as sent and the next poll skips it: on a day Jose hasn't messaged the number, that report is lost without a sign. Sources (third-party, read 4 November 2026; Meta's own pages can't be opened from this session): [ChakraHQ: WhatsApp API message delivery errors](https://chakrahq.com/help/chat/faqs/whatsapp-api-error-code-troubleshooting/whatsapp-api-message-delivery-errors) (errors come back in the response or asynchronously in the webhook; 131047 is the 24-hour window), [YCloud: WhatsApp error codes](https://docs.ycloud.com/zh/api-reference/guides/whatsapp-platform/whatsapp-error-code.md) (a message can fail after WhatsApp accepted it). A [Meta developer community thread](https://developers.secure.facebook.com/community/threads/1229804608443028) shows such a webhook payload (one report, not checked further).

**The proposal:** make `template` the recommended mode in `WS-39-findings.md` once Jose has an approved Utility template, and say plainly that in `text` mode a day without a message from Jose loses that day's reports silently. A status webhook in n8n would catch it, but it is more machinery than a template, and it would be a second inbound URL to keep. The same holds for the WS-74 note, which uses the same send. Not changed in dev's files: it is dev's to take or leave.

## Tried and learned

**4 November 2026, first run.**

- **Tried:** reading the pending count without the enum key. **Learned:** it can't be done, by design: the append token is write-only and the server returns `{"ok": true}` to a write and nothing else, so a sender can't learn the lane's volume. The count needs the vault owner's enum key, and that makes WS-74's n8n side a credential decision for Jose, not just a flow.
- **Tried:** the lane's host and token as Settings fields. **Learned:** they are public and already on the site, and the token changes when the vault agent's session does, so the flow reads them from `assets/feedback.json` each run. My first version only checked the host's shape; Jose's reviewer pointed out that any `https://` host passed, so a bad edit to that public file could have sent the enum key elsewhere. The host is now pinned in Settings and anything else stops the run (tested). The reviewer also found that counting only the current token missed answers left under an old one; the count is now the whole vault.
- **Tried:** a note on every run. **Learned:** three identical "3 waiting" notes a day become noise, so a note goes only when the count changes. The test then found that "drained to 0, then 3 new" would match the last note's 3 and stay silent; the empty lane is now remembered without a note.
- **Not checked against a live n8n:** this session has no n8n, so the "List the lane" node's pagination settings (n8n HTTP Request 4.2, *Update a Parameter in Each Request*, `after_file_id` in the body, stop when `truncated` is false, at most 25 pages of 50) follow n8n's documented shape but have not been run. If the pagination misbehaves on import, turning it off still works up to 50 answers, and the note then says "at least 50". Not checked against the live lane either: this agent holds no enum key and should not.
- **Route 3:** ran its 7 tests (all pass) and read it against the 24-hour rule; the proposal above is the result.

**5 November 2026, 10:10 UTC wake (scheduled).** dev@web-summit.jose took the 131047 proposal into `n8n-guide.md` (template mode is now the fix it recommends) and, researching n8n 3.0, found two things that applied to my flow too.

- **Learned from dev:** Meta rejects a template body that starts or ends with a parameter, so my "one parameter `{{1}}`" template would never be approved. **Changed:** two parameters, the headline and the rest, with fixed text around them; tested (each one line, at most 400 characters, so both and the fixed text stay under the 1024 characters of a template body).
- **Learned from dev:** since n8n 2.0 Code nodes run on task runners and are kept to pure logic. My "Find the lane" Code node fetched the site itself (`this.helpers.httpRequest` or `fetch`), which may not be there on a runner. **Changed:** a new HTTP Request node, "Get the site's lanes", fetches `assets/feedback.json` as text, and "Find the lane" only parses and checks it. The test now runs the Code nodes with no `this.helpers` and a `fetch` that throws, so a Code node that reaches the network fails the test.
- **Not changed:** static data. n8n's docs call it experimental and recommend data tables (dev's build guide uses one). Static data still works for a published workflow, and a data table needs a manual step in n8n before import works; worth switching if Jose builds route 3 with data tables, so both flows keep state the same way.

## Next

- Jose's word on the enum key (above). Until then the WS-74 flow is ready but can't count anything.
- Slack for route 3 (route 4), once someone with Slack admin makes the app and the channel: a Slack node or HTTP call with `text_slack`, which `report-draft.mjs` already makes.
