---
id: WS-137
title: Dinis's lab: from a conversation to an agent policy, researched, animated and kept in a vault
area: tech
for: dinis, angelo, jose, indi, nimay
due: Mon 9 Nov
status: in progress
picked_by: dev@web-summit.dinis (E1, E2, E5 images)
agents: dev@web-summit.dinis; sgit@web-summit.dinis (E3); security@web-summit.dinis (E4, review before any real key); dev@web-summit.indi and designer@web-summit.dinis (E5, E6); dev@web-summit.jose (E7); abp@web-summit.dinis (judges the policies); Angelo's dev agent (E9).
---
From Dinis, 4 November, after the day's call: in the browser, with the keys and the models we now have, make agent policies programmatically for the people we meet and the scenarios we demo, with tools chosen per session (this site's content, the vaults, research on a company, creating and opening vaults, a vault for our vault keys), voice in and out, images and infographics, and RiskMandate's animations made for the scenario. Mapped as nine experiments on [Dinis's lab](../people/dinis/lab/index.html), each with how, what it reuses (the research found most of the pieces already built in the estate: sgit.ai's chat on a static site, the vault chat panel's tool picker, the newsroom's pinned browser vault library, pki.sgit.ai's passkey and master vault), and who could take it.

Done on 4 November (dev@web-summit.dinis): E1, [the policy studio](../people/dinis/lab/studio/index.html): a chat in the browser with the model you pick (Claude Sonnet 5.5 by default; Opus, Haiku, GPT-5.5, Gemini 3.8 Flash), the tools you tick, a policy written section by section on the right, the scenario animated (people round, agents square, the steps in the gap in red), talk mode; E2, research on the web as a tool (with sources); E5's first half, an image tool. Tested in a browser against a stubbed model: the tool loop, the tools, the drawing.

Next, by owner: E3 vault tools in the studio (sgit@web-summit.dinis, from the newsroom's vendored library); E4 the key vault on its own origin (security@web-summit.dinis, Dinis decides the origin, WS-117 and WS-132); E5 and E6 the factory's pictures and RiskMandate's animations from the studio's JSON (dev@web-summit.indi, designer@web-summit.dinis); E7 real-time voice (dev@web-summit.jose); E8 the demo pack (Nimay and Indi choose the first three companies); E9 tools declared by vaults (Angelo). Done looks like: after a meeting, in minutes, a company gets a link to its policy, its animation and its infographic, in a vault they hold a read key to.

**4 November, 09:30 UTC, sgit@web-summit.dinis: E3 built (first pass).** [The policy studio](../people/dinis/lab/studio/index.html) has a fourth tool group, **Vaults**, off by default (`people/dinis/lab/studio-vault.js`).
- **The library:** the vault UI's own, pinned on this origin in `assets/vendor/sg-vault/2026-11-04/` (twelve files, sha256s in its README).
- **The tools:**
  - `team_vaults` lists the vaults on /vaults/.
  - `read_vault` opens any vault by its public read key, and refuses a vault key.
  - `create_vault` makes a vault with a README and returns its id and public read key.
  - `write_to_vault` writes one file into a vault made in this browser and publishes it with compare-and-swap.
  - `read_my_vault` reads one back.
- **What the model never gets:** a vault key or the access token. The person pastes the token into the panel under the studio, and sees and copies each new vault key there.
- **Tested** in a headless browser against dev.send.sgraph.ai: it listed Angelo's, Vicky's and Jose's vaults, read Jose's `3b9y9n9t`, made the test vault `f1s6q1lo`, wrote `/policy/policy.md` twice and read it back. No tool result held the key or the token. That test vault's key lived only in the test browser, so the vault is frozen: readable, never writable, holding only test text.
- **For security@web-summit.dinis before a real token is used:** the token and the vault keys sit in this origin's local storage, which every script on the site can read (the same concern as Ask Claude's OpenRouter key). A key vault (E4) or a separate origin (WS-117) is the fix.
- **For dev@web-summit.dinis:** one line in `studio.js` (`Object.assign(TOOLS, window.STUDIO_TOOLS || {})`) and one script tag in `pages.mjs`.

