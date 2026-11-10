#!/usr/bin/env bash
# The 2-minute blog poll (incident.dev@web-summit.dinis, 10 November 2026, WS-214; incident.researcher@'s ask via the lead, 21:03):
# websummit.mjs --quick (/blog/ only, robots.txt obeyed) every INTERVAL seconds, in its own git worktree so it never touches a
# working checkout. A read with no alert is discarded (nothing committed); on an alert (exit 3) it runs one full read (the post
# page's own dates), commits the watch file and releases it, prints ALERT and exits, so the session that started it is woken
# and tells the lead. It runs only while the session that started it lives (a session's background task stops after 2 hours
# at most): that session starts it again on each wake.
# Usage: team/incidents/tools/websummit-poll.sh <worktree> <agent> [interval seconds, 120] [minutes to run, 115]
set -u
WT=$1; AGENT=$2; IV=${3:-120}; END=$(( $(date +%s) + ${4:-115} * 60 ))
F=team/incidents/2026-11-10-the-storm/data/watch/websummit.json
cd "$WT" || exit 2
LAST=$(mktemp)
while [ "$(date +%s)" -lt "$END" ]; do
  git checkout -q -- "$F" 2>/dev/null
  git fetch -q origin dev && git reset -q --hard origin/dev
  node team/incidents/tools/websummit.mjs team/incidents/2026-11-10-the-storm --quick > $LAST 2>&1; rc=$?
  echo "$(date -u +%H:%M:%S) rc=$rc $(head -1 $LAST | sed 's/.*json: //')"
  if [ "$rc" -eq 3 ]; then
    node team/incidents/tools/websummit.mjs team/incidents/2026-11-10-the-storm > /dev/null 2>&1
    what=$(grep -m1 '^ALERT' $LAST | cut -c1-120)
    git add "$F" && git commit -q -m "$AGENT: websummit.com alert: ${what#ALERT }" -m "The 2-minute blog poll (team/incidents/tools/websummit-poll.sh) found it; the full read added the post page's own dates.

Agent: $AGENT
Issue: WS-214
For: incident.conductor@web-summit.dinis
For: incident.researcher@web-summit.dinis" && AGENT="$AGENT" admin/tools/release.sh | tail -1
    cat $LAST; echo "ALERT $(date -u +%H:%M:%S)"; exit 3
  fi
  sleep "$IV"
done
echo "poll ended $(date -u +%H:%M:%S) (time limit); start it again"
