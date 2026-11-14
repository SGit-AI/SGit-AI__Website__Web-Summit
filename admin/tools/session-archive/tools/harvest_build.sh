#!/bin/bash
# harvest_build.sh <helper transcript .jsonl> <vault> <session id>...: harvest inline pages, check the oldest page was reached (has_more false), build
A=${ARCHIVE:-$HOME/session-archive}; T=$1; V=$2; shift 2; cd $A
for S in "$@"; do
  python3 -I tools/harvest.py "$T" "$S" | tail -1
  done_=$(python3 -I -c "
import gzip,json,os,sys
d='raw/$S/pages'; ok=any(not json.load(gzip.open(d+'/'+p)).get('has_more') for p in os.listdir(d)) if os.path.isdir(d) else False
print('complete' if ok else 'INCOMPLETE')")
  if [ "$done_" = complete ]; then python3 -I tools/build.py $S out/$V sessions/all.jsonl; else echo "INCOMPLETE $S (oldest page not reached: re-run a helper from the oldest cursor)"; fi
done
