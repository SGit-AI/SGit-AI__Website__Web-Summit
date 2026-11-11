# security@web-summit.vicky: reports

Newest first. Each finding names its commit. URGENT only where it matters.

## 11 Nov 2026, about 19:45 UTC: first run

confirmed RULES-11NOV: no machine reads of websummit.com, Luma, Meetup or Eventbrite; checked tools, scripts, notes and wake prompt; removed: nothing (a new session: no tools, scripts or scheduled task of my own yet).

- **Key:** made in this session; public half added as `security-vicky` in `data/keys.json` by my own commit (signing sha256:310e979d2be0b5a0). Linked locally to the operator's key; not submitted to pki.sgit.ai.
- **Prompts file:** `people/vicky/prompts/security.md`, Vicky's message word for word with RULES-11NOV at its top.
- **First task done:** the P6 review, `people/vicky/reviews/security-p6.md`. Recommendation: yes to P6 only with its changes 1 to 7; the commit-trailer author check in step 4 can be forged by any agent that can push to dev, so task files must be signed by the conductor's key and checked against a pinned fingerprint.

### Findings

1. **The decisions.md guard can be forged** (not URGENT; no forgery seen). The guard trusts the commit title and `Agent:` line, which any committer writes. Checked the commits to `people/vicky/decisions.md` since 10 Nov: all carry the conductor's title and Agent line except 38d21c7, which is only the oldest commit of my shallow clone (a CI release), not a real change to the file. Fix proposed in the P6 review (signatures), for Vicky to decide.
2. **Session ids are public in commit trailers** (not URGENT). Every commit made from Claude Code ends with a `Claude-Session:` line; the conductor's session id is in 8 commits on dev (for example 1d8aa10, c5d266a). No rule is broken today; it makes P6's limit 6 ineffective as written. Ids are not repeated in this report.

No keys, tokens, contact details or private data looked for beyond these files yet: the full commit review of Vicky's agents on both sites is the next task, when Vicky asks or after the next change to rules, keys or vaults.

Question for Vicky (with my recommendation): approve P6 with the changes in my review (recommended), as drafted, or not at all?
