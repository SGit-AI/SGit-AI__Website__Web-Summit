# The editor's briefs

Copied from the book team (The Ultimate Insider) on 2 November 2026; see their guide "How to brief the editor". Here the editor is Dinis Cruz and the conductor is conductor@web-summit.dinis. After every run, the conductor writes the editor a brief: a JSON file here, cut to `<stamp>.html` and `<stamp>.pdf` by `python3 -I team/conductor/tools/editor_brief.py team/conductor/editor-briefs/<stamp>.json`, and published at `/updates/` on web-summit.sgit.ai (the JSON and the PDF are committed, the PDF because it is what was sent; the HTML is not kept, since it is not a site page and the tool remakes it from the JSON). The shape is the RC1 companion's, which worked for him on paper. Public, like everything here: no key, no contact detail, no leaked value.

## The fields

- `number` and `date` (required from brief 9, at the editor's word): printed at the foot of every page.
- `kicker`, `title`, `when`, `by`, `headline`: the top of the first page.
- `stats`: up to four tiles, `{"n": ..., "label": ...}`.
- `for_you`: what waits on the editor, each `{"id", "ask", "detail", "options": [...]}`, printed with tick boxes; an optional `"recommend"` prints as the conductor's recommendation, and an entry with only `"group"` starts a group heading. Nothing in it is decided until he says so; his words are quoted with where and when.
- `you_asked`: the replay, each `{"at", "said" (his words, quoted), "done", "where", "status": done | in progress | waiting}`, so he can check his briefing was understood.
- `team`: each `{"id", "status": new | old | ..., "doing", "key"}`.
- `sections`: `{"title", "text" or "items": [...] or "table": {"head": [...], "rows": [[...]]}}`.
- `images`: `{"path" (from the repository's root), "caption"}`, embedded, so the HTML stands alone. Reuse what exists.
- `next`, `sources`.
