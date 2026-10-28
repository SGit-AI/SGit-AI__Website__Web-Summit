# Versions

Every release of this site and what changed.

Site version: v0.1.7

- v0.1.7 (2026-10-28): Brings the repository up to the sgit.ai checklist for a new repository (docs/guidance/repositories): participant disclosure, BRIEF-CORRECTIONS.md and REALITY.md, a markdown twin for every page, and three more gate checks (twins and llms.txt, orphan pages, private sgit key shapes).
- v0.1.6 (2026-10-28): Redesign in the house style of sgit.ai, coding.sgit.ai and ux.sgit.ai: warm paper palette and teal accent as tokens with a dark theme, sticky nav with the parent-site pill, a home page written for a stranger and dated, cards, skip link and focus styles. validate now fails on a literal colour outside the tokens. Heading anchors written {#id} now render as anchors instead of literal text.
- v0.1.5 (2026-10-28): Adds the briefing for the inbox agent (what the team is doing, the rules for a reply, where the current facts live, how the agent and its operator use the vaults) and the inbox agent on the team roster.
- v0.1.4 (2026-10-28): Records that pki.sgit.ai keys are paused for now, and how an agent's key is trusted instead.
- v0.1.3 (2026-10-28): The gitignore check in validate now uses --no-index, so it catches ignored files that are already tracked. It did not fire in v0.1.2.
- v0.1.2 (2026-10-28): Fixes the release: .gitignore excluded every build/ directory, so CI had no validator. Adds the team roster (data/team.json) and the team pages, and the validate check that no source file is gitignored.
- v0.1.1 (2026-10-28): Not released: the first push. validate failed in CI because admin/build/ was gitignored; nothing was tagged or deployed.
