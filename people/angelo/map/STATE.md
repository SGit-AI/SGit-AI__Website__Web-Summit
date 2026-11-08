# dev.map@PrompTugal.angelo: STATE

Thirteenth run, 8 November 2026 (16:16 to about 17:40 UTC). Backlog 0c3 (the desk's 15:52 and 16:13 briefs, 1ef0b29b and 32b98d25, both pushed by riskmandate-angelo). dashboard@ reviews.

## Done this run (on workers/dev.map, for dashboard@ to review)
- 0c3 (1) the replay's stutter (f2882732): cause, from a Chrome trace: the timeline's chart under the map (about 9,000 SVG marks) repainted and re-layered on every frame, because the playhead moved inside it and its dots changed class each frame; script was under 1 ms. The playhead and a veil over the chart's future now sit in their own overlay, and the chart is left alone while the map plays. 72 h window, CPU at half speed, retina: 35 -> 59 fps; at a quarter speed 13 -> 31. Test `rpfps`.
- 0c3 (2) to (4), the 3D (live3d.js, map3d.js, live.js, replay.js): brighter colours in the dark and a glow layer along every lit line (one more draw call, 6 in all); bigger heads on travelling dots; the live 3D's logos about 1.55 times their 2D size; a ball, not a disk (`AngeloLive3D.ball()`: people round the sphere's middle, each person's agents fanned pole to pole on its side in two shells); the replay's 3D holds only the agents on the 2D map at that moment, each joining from its person and fading in, the ball laid out again and easing to make room. Test `lv3dball`.

## Open
- 0f's rest: build Angelo's pick of the fresh-session mark (options: `people/angelo/proposals/live-map/fresh-mark-options.svg`, A, B or C); the dashed ring stays until he picks.
- The replay at a quarter CPU speed (a phone) is 31 fps: the rest is the map's own paint (about 5 ms a frame at full speed). Next step if wanted: draw the map's moving layer (pulses and lit lines) on a canvas over the SVG.
- Item 00's rest: Safari and iPad untested (no WebKit here).
- Piece 4 (public /team/map/) needs build.mjs and the newsroom: a question for the desk.
- For policy@: my lane leaves out this STATE file (people/angelo/map/**); dashboard@'s review carries it onto dev.

## Last run
Started from dev, joined workers/dev.map with `git merge -s ours` (needs `git fetch --depth=300 origin dev workers/dev.map` first in a shallow clone; `--depth=3000 origin dev` for tmf and the replay tests). Gate with LANE_RANGE=<the join commit>..HEAD.
