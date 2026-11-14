#!/bin/bash
# sgit_timed.sh <label> <vault_dir> <sgit args...>
# Runs one sgit command in <vault_dir>, times it and appends one JSON line to $A/perf/sgit-perf.jsonl:
#   {t, label, op, vault, files, bytes, objects_local, seconds, rc, sgit_version}
# files/bytes count the working tree (not .sg_vault); objects_local counts .sg_vault/bare objects. Never logs a key.
A=${ARCHIVE:-$HOME/session-archive}
mkdir -p "$A/perf"
LABEL="$1"; DIR="$2"; shift 2
count() { [ -d "$DIR" ] && find "$DIR" -path "$DIR/.sg_vault" -prune -o -type f -print 2>/dev/null | wc -l || echo 0; }
bytes() { [ -d "$DIR" ] && du -sb --exclude=.sg_vault "$DIR" 2>/dev/null | cut -f1 || echo 0; }
objs()  { [ -d "$DIR/.sg_vault" ] && find "$DIR/.sg_vault" -type f 2>/dev/null | wc -l || echo 0; }
T0=$(date +%s.%N)
( cd "$(dirname "$DIR")" 2>/dev/null; [ -d "$DIR" ] && cd "$DIR"; sgit "$@" ) > "$A/perf/last-$LABEL.log" 2>&1
RC=$?
T1=$(date +%s.%N)
python3 -I - "$LABEL" "$1" "$(basename "$DIR")" "$(count)" "$(bytes)" "$(objs)" "$T0" "$T1" "$RC" "$(sgit --version 2>&1 | head -1)" >> "$A/perf/sgit-perf.jsonl" <<'EOF'
import json, sys, datetime
l, op, v, f, b, o, t0, t1, rc, ver = sys.argv[1:]
print(json.dumps({'t': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'), 'label': l, 'op': op, 'vault': v,
                  'files': int(f or 0), 'bytes': int(b or 0), 'objects_local': int(o or 0), 'seconds': round(float(t1) - float(t0), 2), 'rc': int(rc), 'sgit_version': ver}))
EOF
tail -1 "$A/perf/sgit-perf.jsonl"
exit $RC
