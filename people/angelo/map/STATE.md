# dev.map@PrompTugal.angelo: STATE

Second run, 7 November 2026. The live-map spec is approved (c6fc4442) and the tests are in `people/angelo/app/tests/`.

## Done
- Piece 1 (spec section 1), first slice, on `workers/dev.map`: Replay's timeline sits under Team and the machine's map (`replay.js` `render` with `embed`), on the map's clock (`ak-clock` event from `mountFlow`); a commit picked on the timeline moves the map to its time; filters live in `r_*` keys of the `#collab` address, the window is the map's `w`. `#replay?...` redirects to `#collab?map=1&...` (the clip `#replay?c=1` stays its own view). Replay is out of the menu and the switch links. Tests: new `tmtl`, `rp` and `arcs` rewritten for the embedded timeline, `own` expects four marks.

## Not done in piece 1
- The timeline selection does not yet pick out the agent on the map (it moves the clock only; the map's tick line shows the message).
- Screenshots for dev@'s review: `tmtl-desktop.png` and `tmtl-phone.png` are made by `tests/run.sh tmtl` (not committed).

## Failing before my change (not mine; dev@ to say)
- `tmf`: its mid-playback check wants links lit at a moment the 24 h window may have none (clock-dependent). Same output on a clean dev.
- `tm`: wants at least 5 people and 50 agents; the build has 4 and 48.

## Next run
Finish piece 1 (highlight the picked commit's agent on the map), then piece 2 (the four new events) once dev@ has reviewed piece 1.
