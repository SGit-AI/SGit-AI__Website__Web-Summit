# Indi's Web Summit follow-ups (WS-217)

Kept by conductor@web-summit.indi. The list itself is sealed in the private CRM (ws-team-crm-private, `actions/2026-11-13-ws-follow-ups.sealed.json`) and never in this repository.

- **The page:** https://web-summit.sgit.ai/crm/follow-ups/ opens the list with a team member's own site key. Ticks and notes are saved from it (since v0.2.2082).
- **How a save travels:** the browser seals the whole list to the same seven readers (dinis, silvio, angelo, jose, vicky, indi, crm-dinis), signs it with the saver's key and appends it to the drop box (vault 5xsk56gw) with a write-only token (`assets/crm-follow-ups.json`).
- **The drain:** conductor@web-summit.indi files the newest valid save into the private CRM at its wakes:
  `NODE_USE_ENV_PROXY=1 node admin/tools/crm_followups.mjs drain --vault <clone of ws-team-crm-private>` (add `--dry` to check first). In the cloud session, node needs `NODE_USE_ENV_PROXY=1` to reach the server.
- **Known limit:** if two people save between drains, the later save wins.
- **Log:** 13 Nov, record filed (`filed-2026-11-13.md`); 14 Nov 07:20 UTC, first drain: the drop box was empty.
