---
title: "crm-pipeline-r1: the best way to run the team's private CRM, an open review"
by: charlie.large.worker@PrompTugal.angelo (role research), for crm-pipeline.pm@PrompTugal.angelo
written: 2026-11-13
for: Angelo's read
status: ready for Angelo's read
---
# The best way to run the team's private CRM

## The answer (one screen)

**Recommendation: keep the private vault, but make it simpler (option 2), and set a point where we stop waiting.** One SG/Send token per person's CRM agent (six tokens, not one per agent), each agent writing its own log as the d2 spec already allows; browsers drop sealed, signed requests through the drop box Indi's agent has already built (WS-217, 3efb5e1). Why: the data is encrypted in the browser with AES-256-GCM and the server never sees the key, which no hosted CRM here offers. Every person and their agents already hold the vault key. The vault and its layout exist. It is also Dinis's own product, and this would show it working.

**The catch is real, and it is all on one desk.** Eight days after the first ask, **no access token is on record as issued**. Browser writing still fails (WS-189 q4). The vault's write API has no public documentation. The vault app hung for over two minutes at 891 files. Nobody yet knows how to truly delete a contact from the vault's history. Each of these is Dinis's to answer.

**Runner-up: Twenty, cloud in Frankfurt (option 4, hosted).** It is open source (AGPLv3), so we could leave for our own server later. It has a pipeline board and custom objects. Its official MCP server takes its permissions from the API key's role. It costs $9 per user a month (about $54 for six). Against it: contacts sit with a third party, there is no native phone app (only the web), and full audit logs need the $39 plan. It wins if Angelo and Dinis decide the vault cannot carry the ten-second add soon enough.

**Not recommended:** HubSpot's free plan (two users only), a shared Google Sheet (no history of who changed what, and agents need a Google credential), and a git repository of records (git history keeps a deleted contact, which fights the right to erasure).

**Who decides:** Angelo, then Dinis. Questions at the end.

## The comparison

Marks: ++ strong, + fine, 0 neutral, - weak, -- blocking. Sources are in each option's section.

| | 1. Vault, as spec | 2. Vault, simpler | 3. Hosted CRM (HubSpot, Attio, Pipedrive, folk) | 4. Twenty (cloud or self-host) | 4b. EspoCRM self-host | 5. Google Sheet | 6. Git repo of records |
|---|---|---|---|---|---|---|---|
| Only the team can read | ++ client-side encryption | ++ same | + vendor can read; DPA | + vendor (cloud) / ++ (self-host) | ++ our server | + Google can read | + private repo; ++ with SOPS |
| EU data | ? host region not documented publicly | ? same | + HubSpot, folk, Pipedrive EU; Attio not stated | ++ Frankfurt | ++ where we host | ? needs a data-regions edition | - EU residency is Enterprise only |
| True deletion | ? unanswered (history) | ? same | ++ permanent delete | + record delete | + record delete | - version history keeps it | -- needs history rewrite |
| Who changed what | + event log by design | + same | - full audit only on top plans | + change log; audit on $39 plan | ++ field audit, free | - | ++ git log |
| Agents (API/MCP, least privilege) | 0 sgit CLI, one writer | + one token per person's agent | ++ official MCP on all four | ++ official MCP, role-scoped keys | + REST, role-scoped API user; no official MCP | 0 Sheets API, broad credential | + fine-grained token per repo |
| Ten-second add on a phone | -- to build; browser write blocked | - drop box exists, needs switching on | ++ native apps (HubSpot, Pipedrive, folk, Attio) | + responsive web only | + responsive web only | + Sheets app, clumsy | -- to build |
| Effort to first use | -- 7 build steps, 4 asks to Dinis | - fewer asks, same build | + sign-up and import | + sign-up (cloud) or a server | - a server and upkeep | ++ minutes | - an app to build |
| Cost a month (six users) | $0 | $0 | HubSpot Starter about $120; Attio about $215; Pipedrive Lite $84; folk about $144 | $54 (Pro) | server only | in Workspace | $0 (private repo) |
| Fit with the team (Dinis's products) | ++ | ++ | -- | - | - | 0 | + agents speak git |
| Exit | + our files | + our files | + CSV export | ++ open source, self-host | ++ | ++ | ++ |

## Option 1: the vault, as the d2 spec has it

What it is: a Pipeline tab in the private vault's own app, a monthly append-only log per writer plus a derived index, one writer agent (crm@PrompTugal.angelo) with its own token, and sealed drops from everyone else (d2-spec/spec.md on origin/pool/crm-pipeline-d2).

- **Well:** the strongest privacy of any option; it reuses the vault, its layout and the keys already sealed to every person and their conductors; the event log is the audit trail; it keeps the file count to about 30 a year, so the host's slowness is not made worse.
- **Badly:** one writer is one point of failure; everything waits on tokens and browser writing; seven build steps and four asks to Dinis.
- **Risks:** deletion from vault history is unanswered (the spec's own open question); the vault API has no public reference, so we build against Dinis's code, not a published contract.

## Option 2: the vault, but simpler (recommended)

The same layout and app as option 1, with two changes: **one token per person's CRM agent** (six, matching Angelo's "each member of the team needs to have at least 1 agent that can write"), each writing its own log, which the spec's log-per-writer layout already allows; and **browsers use WS-217's drop box** rather than a second one. A shared single drainer was considered and rejected: it is option 1's single point of failure again.

- **Well:** each person's agent writes without waiting for another; one ask to Dinis instead of several; reuses Indi's drop box.
- **Badly:** still needs Dinis to issue six tokens and the drop box's lane token; the phone add still needs the Pipeline tab built.
- **Needs:** Dinis: six tokens, a working browser drop, an answer on deletion. Then the spec's build steps, fewer of them.

## Option 3: a hosted CRM with an API

- **HubSpot:** free plan up to 2 users, so six need Starter, $20 a seat at list price (a new-customer offer shows less); Free has no custom pipelines, Starter has 15; official MCP server with OAuth scopes; private-app tokens with chosen scopes on Free and Starter; iOS and Android apps with a card scanner; EU data centre in Frankfurt, AES-256 at rest; DPA in the terms; audit log from Starter, CRM record changes from Professional (inferred); permanent delete on all plans.
- **Attio:** free up to 3 users; Plus is $40 a month with one user, then $35 per seat (about $215 for six, annual); official MCP on all plans, within each user's permissions; user-level OAuth tokens with scopes; mobile app on all plans; encryption at rest and in transit, Google Cloud, DPA with SCCs; EU region **not stated**; audit log only on Enterprise or with a $30-a-user add-on, and it skips API changes.
- **Pipedrive:** no free plan; Lite $14 a seat annual; pipelines, API and phone apps on every plan; official MCP on all plans, changes in the change log; personal API token without scopes; AWS Frankfurt and Dublin, EU placement not guaranteed; AES-256 at rest; security audit log Ultimate only; deleted items restorable 30 days, then gone.
- **folk:** Standard $24 a seat annual; no free plan confirmed; pipelines on all plans; official MCP; API keys have **no scopes** yet (roadmap); phone app; servers in Ireland; no customer audit log found; export only per group, without interactions.
- **For us:** the best phone experience and the least to build. Against: personal data with a US-owned third party, a credential per agent that a vendor holds, cheap plans lack the "who changed what", and it shows nothing of the team's own products.

## Option 4: a self-hosted open-source CRM

- **Twenty:** AGPLv3 (some Enterprise-licensed files); Docker Compose with Postgres and Redis, at least 2 GB RAM; kanban from any view, custom objects; REST and GraphQL; official MCP server, also self-hosted, permissions from the API key's role; no official phone app (responsive web, open complaints); cloud Pro $9, Organization $39 (audit logs, field permissions); cloud on AWS Frankfurt; about 60.9k stars, release v2.58.0 on 13 Nov.
- **EspoCRM:** AGPLv3; PHP and MySQL, MariaDB or Postgres; install script with Docker; kanban on opportunities; field audit log; REST API through a separate API user with a role; no official MCP (community only); responsive web only; cloud from $15 a user (minimum 3), US or Germany.
- **SuiteCRM 8:** AGPLv3, LAMP; no built-in kanban (paid add-on); OAuth2 API without scopes; no official MCP. Weakest of the three.
- **For us:** self-hosting means someone runs a server, patches it and backs it up; nobody on the team has that job today. Twenty cloud removes that and keeps the exit open.

## Option 5: the team's workspace (a shared Google Sheet)

Minutes to start, and the team has Workspace (WS-124). Data regions only on some editions (Business Standard and up), and whether Sheets is covered was not confirmed. AppSheet could give a phone form on paid editions. Against: anyone with the link can copy everything, no per-row history of who changed what, version history keeps deleted contacts, and agents need a Google credential (a service account), which is tier 3. Good as a **stopgap**, not as the CRM.

## Option 6: a private git repository of JSON records

Agents already speak git; GitHub fine-grained tokens can be limited to one repository's contents. Encryption: git-crypt cannot revoke a person, and anyone with an old key reads old history; SOPS with age encrypts values per recipient and can re-key, but field names stay in clear. The blocker: deleting a contact for good means rewriting history, which changes every hash, and forks and caches keep the data. EU residency on GitHub is Enterprise only. Not recommended for personal data.

## Anything better? What was looked for

- **NocoDB, Baserow, Notion:** each has a table, a kanban view and an MCP server (Baserow's MCP URL carries its secret; Notion's EU residency is Enterprise only; NocoDB's licence is not OSI open source). None beats Twenty for a pipeline.
- **Looked for and not found:** a public reference for the SG/Send vault API, its token scopes or its revocation; Attio's hosting region; HubSpot's plan for MCP; folk's free plan; a mobile quick-add page for Attio and Pipedrive; whether self-hosted Twenty has audit logs without an Enterprise licence.

## What changes in our design and spec

The recommendation is option 2, close to the spec, so the changes are small:
- One writer per person's CRM agent instead of crm@PrompTugal.angelo alone (the log-per-writer layout stays).
- Browsers drop through WS-217's drop box; no second drop mechanism.
- The ask to Dinis becomes one list: six tokens, the drop box's token, browser writing (WS-189 q4), deletion from vault history, and whether the host stays fast as records grow.
- Add a stop point: if Angelo judges the answers too slow, the runner-up (Twenty cloud) replaces the vault for the pipeline only, with an export back to the vault.

## Sources (all read 2026-11-13 UTC)

| Claim | Source | Confidence |
|---|---|---|
| SG/Send encrypts in the browser, AES-256-GCM, server never sees the key; private beta | https://github.com/the-cyber-boardroom/SGraph-AI__App__Send/blob/dev/README.md | high |
| No public vault API reference; tokens only named as admin function | same README; https://send.sgraph.ai/ (redirect page only) | high |
| sgit CLI syncs encrypted vaults; AES-256-GCM, PBKDF2, HKDF | https://pypi.org/project/sg-send-cli/0.7.1/ | high |
| No access token on record as issued; asks of 5, 6, 7 Nov, reminder 8 Nov | repo:board/WS-170-the-team-crm.md | high |
| Browser write fails (sg.auth.check valid: false) | repo:board/WS-189-the-summit-desk-writes-to-the-private-crm.md | high |
| Indi's drop box built, needs a lane token | repo:board/WS-217-the-follow-up-list-in-the-private-crm.md (origin/dev) | high |
| Vault app hung over two minutes at 891 files | repo:board/WS-170-the-team-crm.md; d2-spec/spec.md | high |
| Spec: log per writer, one writer, sealed drops, 7 build steps | repo:people/angelo/projects/crm-pipeline/d2-spec/spec.md (origin/pool/crm-pipeline-d2) | high |
| HubSpot Free up to 2 users; Starter $20 a seat list | https://www.hubspot.com/pricing/crm | high / medium |
| HubSpot pipelines: Free 0 custom, Starter 15 | https://knowledge.hubspot.com/deals/set-up-and-customize-your-deal-pipelines-and-deal-stages | high |
| HubSpot official MCP, OAuth scopes | https://developers.hubspot.com/mcp | high |
| HubSpot private-app tokens with scopes | https://developers.hubspot.com/docs/guides/apps/private-apps/overview | high |
| HubSpot phone app, card scanner | https://knowledge.hubspot.com/records/work-with-records-in-the-hubspot-mobile-app (search result) | medium |
| HubSpot EU data centre, AES-256 at rest | https://legal.hubspot.com/security | high |
| HubSpot DPA in terms | https://legal.hubspot.com/dpa | high |
| HubSpot audit log tiers | https://knowledge.hubspot.com/account-management/view-and-export-account-activity-history | medium |
| HubSpot permanent delete | https://knowledge.hubspot.com/privacy-and-consent/understand-restorable-and-permanent-contact-deletions | high |
| Attio prices and seat limits | https://attio.com/pricing | high |
| Attio official MCP | https://attio.com/help/reference/attio-ai/attio-mcp | high |
| Attio token scopes | https://docs.attio.com/rest-api/guides/authentication | high |
| Attio DPA, encryption, Google Cloud | https://attio.com/legal/attio-data-processing-addendum | high |
| Attio audit log plans, skips API changes | https://attio.com/help/reference/workspace-settings-billing/security/export-audit-logs | high |
| Attio permanent delete | https://attio.com/help/reference/managing-your-data/records/merge-and-delete-records | high |
| Pipedrive prices (English page refused; German page read) | https://www.pipedrive.com/de/pricing | high |
| Pipedrive features on all plans | https://support.pipedrive.com/en/article/what-features-do-the-pipedrive-plans-have | high |
| Pipedrive official MCP | https://www.pipedrive.com/en/features/mcp-server | high |
| Pipedrive EU regions, not guaranteed | https://www.pipedrive.com/en/subprocessors | high |
| Pipedrive AES-256 at rest | https://www.pipedrive.com/en/privacy/dpa | high |
| Pipedrive security audit log Ultimate only | https://support.pipedrive.com/en/article/security-dashboard | medium |
| folk prices, pipelines | https://www.folk.app/pricing | high |
| folk official MCP | https://developer.folk.app/mcp/connect | high |
| folk API key scopes on roadmap | https://developer.folk.app/roadmap | high |
| folk servers in Ireland | https://help.folk.app/en/articles/5007534-security-privacy | high |
| Twenty licence | https://github.com/twentyhq/twenty/blob/main/LICENSE | high |
| Twenty Docker, 2 GB RAM | https://docs.twenty.com/developers/self-hosting/docker-compose | high |
| Twenty kanban | https://docs.twenty.com/user-guide/views-pipelines/how-tos/create-a-kanban-view-for-projects | high |
| Twenty MCP, role-scoped keys | https://docs.twenty.com/user-guide/ai/capabilities/mcp.md | high |
| Twenty prices, audit logs on Organization | https://twenty.com/pricing | high |
| Twenty cloud in Frankfurt | https://docs.twenty.com/user-guide/legal/how-tos/legal-faq | high |
| Twenty no official phone app | https://github.com/twentyhq/twenty/issues/15933 | medium |
| EspoCRM licence, stack | https://github.com/espocrm/espocrm | high |
| EspoCRM kanban | https://docs.espocrm.com/user-guide/sales-management/ | high |
| EspoCRM API user with role | https://docs.espocrm.com/development/api/ | high |
| EspoCRM field audit | https://docs.espocrm.com/administration/fields/ | high |
| EspoCRM cloud prices, US or Germany | https://www.espocrm.com/pricing/ | high |
| SuiteCRM 8 stack | https://docs.suitecrm.com/8.x/admin/compatibility-matrix/ | high |
| SuiteCRM kanban is an add-on | https://store.suitecrm.com/addons/mts-kanban | medium |
| Workspace data regions by edition | https://knowledge.workspace.google.com/admin/compliance/choose-a-geographic-location-for-your-data | high |
| NocoDB licence, MCP | https://github.com/nocodb/nocodb ; https://nocodb.com/docs/apis-and-mcp/mcp | high |
| Baserow MCP URL carries a secret | https://baserow.io/user-docs/mcp-server | high |
| Notion EU residency Enterprise only | https://www.notion.com/help/data-residency | high |
| git-crypt cannot revoke; old key reads history | https://github.com/AGWA/git-crypt | high |
| SOPS per-recipient keys, keys in clear | https://getsops.io/_print/docs/usage/ | high |
| GitHub fine-grained tokens per repository | https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens | high |
| GitHub EU residency is Enterprise Cloud | https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/about-github-enterprise-cloud-with-data-residency | high |
| Removing data from git means rewriting history | https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository | high |

websummit.com was not read (its terms forbid automated reading). Prices are list prices on the vendor's page today, before tax.

## Questions (tier 3; for Angelo, then Dinis through Angelo)

1. **Angelo: keep the vault (option 2) or move the pipeline to Twenty cloud?** Recommendation: option 2, with a stop point you set; switch to Twenty only if Dinis's answers do not come in time for the follow-ups now being collected.
2. **Dinis (through Angelo): six tokens, one per person's CRM agent, plus the drop box's lane token?** Recommendation: ask as one list, with the four below.
3. **Dinis: can a browser write (WS-189 q4), can sgit truly delete a record from vault history, which region hosts the vault, and does the host stay fast past 891 files?** Recommendation: the deletion answer is required before contacts go in, as the spec says.
4. **Angelo: a stopgap for contacts taken this week before the pipeline exists?** Recommendation: each person's agent keeps them in their own sealed WS-217-style record, not a Sheet.
