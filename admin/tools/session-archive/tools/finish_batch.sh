#!/bin/bash
# finish_batch.sh <batch file> <helper transcript .output path>: harvest and build every session of the batch that is not built yet
A=${ARCHIVE:-$HOME/session-archive}; cd $A
B=$1; T=$2; V=$(head -1 $B); U=""
for s in $(tail -n +2 $B); do [ -z "$(find out -maxdepth 2 -name "*__$s" | head -1)" ] && U="$U $s"; done
[ -z "$U" ] && { echo "$B: all built"; exit 0; }
bash tools/harvest_build.sh $T $V $U 2>&1 | grep -E '^(BUILT|INCOMPLETE)' | cut -c1-90
for s in $U; do echo "  $s pages=$(ls raw/$s/pages 2>/dev/null | wc -l)"; done
