#!/usr/bin/env bash
# The 2-minute blog poll (incident.dev@web-summit.dinis, 10 November 2026, WS-214; incident.researcher@'s ask via the lead, 21:03).
# Rewritten at 21:30 after security.repos@'s MEDIUM (report 2026-11-10T2130Z): the first version reset a worktree to dev every
# loop and ran whatever websummit.mjs was there (unreviewed code, run within 2 minutes, in a session that can push), and put the
# website's text into commit subjects. Now:
#   - PINNED: websummit.mjs is copied once, at start, from the checkout the session chose, and that copy (its sha256 printed)
#     is the only code the loop runs; no git command runs in the loop: no fetch, no reset, no commit, no push;
#   - it reads /blog/ only (--quick; robots.txt obeyed) into a scratch copy of the watch file, never the repository's;
#   - on an alert (exit 3) it prints the alert and stops; the session that started it is woken, reads the alert as data, and
#     commits the watch file itself, with a fixed subject ("websummit.com: new or changed post") and the site's words only in the
#     body, quoted. Bounded: it stops after <minutes> (default 115) and is started again on the session's next wake.
# Usage: team/incidents/tools/websummit-poll.sh <repo checkout> <scratch dir> [interval seconds, 120] [minutes, 115]
set -u
REPO=$1; SCR=$2; IV=${3:-120}; END=$(( $(date +%s) + ${4:-115} * 60 ))
INC=team/incidents/2026-11-10-the-storm
mkdir -p "$SCR/bin" "$SCR/inc/data/watch" || exit 2
cp "$REPO/team/incidents/tools/websummit.mjs" "$SCR/bin/websummit.mjs" || exit 2
cp "$REPO/$INC/data/watch/websummit.json" "$SCR/inc/data/watch/websummit.json" || exit 2
echo "pinned websummit.mjs sha256 $(sha256sum "$SCR/bin/websummit.mjs" | cut -c1-16) from $(git -C "$REPO" rev-parse --short HEAD); scratch $SCR/inc"
while [ "$(date +%s)" -lt "$END" ]; do
  out=$(node "$SCR/bin/websummit.mjs" "$SCR/inc" --quick 2>&1); rc=$?
  echo "$(date -u +%H:%M:%S) rc=$rc $(printf '%s\n' "$out" | head -1 | sed 's/.*json: //')"
  if [ "$rc" -eq 3 ]; then printf '%s\n' "$out"; echo "ALERT $(date -u +%H:%M:%S): the watch file with the alert is $SCR/inc/data/watch/websummit.json"; exit 3; fi
  sleep "$IV"
done
echo "poll ended $(date -u +%H:%M:%S) (time limit); start it again"
