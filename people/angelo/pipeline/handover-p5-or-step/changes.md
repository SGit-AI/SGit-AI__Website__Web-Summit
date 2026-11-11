# Changes (inner agent's list, wrapper's check at the end)

Checked by the wrapper: every other path below was fetched from the named repository's dev (HTTP 200).

| file | line | old | new | why |
|---|---|---|---|---|
| people/angelo/pipeline/ROLES.md | 18 | formats/handover.md | formats/handover.md (proposed) | not in this clone; planned (b3 STATE.md says it does not exist yet) |
| people/angelo/pipeline/ROLES.md | 85 | content/articles/<slug>.md, articles/<slug>.md.sig, board/keys.json | `newsroom:` on content/articles/<slug>.md and board/keys.json; the .sig path left as it was (UNDONE by the wrapper: its real path in the newsroom could not be confirmed) | the line says these are in PrompTugal/PrompTugal__News__Website |
| people/angelo/pipeline/ROLES.md | 86 | the newsroom's board/keys.json | the newsroom's newsroom: board/keys.json | no board/keys.json here (this site's is data/keys.json); text says newsroom's |
| people/angelo/pipeline/ROLES.md | 87 | to content/articles/<slug>.md | to newsroom: content/articles/<slug>.md | the newsroom's repo, per line 85 |
| people/angelo/pipeline/ROLES.md | 88 | newsroom/build/build.mjs, newsroom/build/validate.js | each prefixed `newsroom:` | not in this clone; newsroom repo |
| people/angelo/pipeline/ROLES.md | 89 | newsroom/tools/release.sh | newsroom: newsroom/tools/release.sh | not in this clone; newsroom repo |
| people/angelo/pipeline/ROLES.md | 145 | board/guidance/README.md | newsroom: board/guidance/README.md | not in this clone; line says newsroom repo |
| people/angelo/pipeline/ROLES.md | 145 | the Fringe's team/angelo/status.json | the Fringe's fringe: team/angelo/status.json | not in this clone; line names PrompTugal__News__Fringe |
| people/angelo/pipeline/QUEUE.md | 9 | the newsroom's board/the-story-pipeline.md | the newsroom's newsroom: board/the-story-pipeline.md | not in this clone; text says newsroom's |
| people/angelo/pipeline/formats/conductor.md | 18 | the newsroom's board/guidance/README.md | the newsroom's newsroom: board/guidance/README.md | not in this clone; text says newsroom's |
| people/angelo/pipeline/skills/designer.md | 24 | Lisbon Fringe: work/09-design.md | Lisbon Fringe: fringe: work/09-design.md | not in this clone; text names the Fringe |

Left alone: placeholder and template paths ({ID}/..., people/<id>, <slug>), runtime pool/{ID} files (ops-accounts/..., ops-digest/..., publish.md and so on), `pki-agent.mjs` (a downloaded tool, URL given), URLs, already-prefixed `newsroom:` paths, and every path that exists here (checked with ls).
