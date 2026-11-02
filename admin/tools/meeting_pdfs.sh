#!/usr/bin/env bash
# PDFs of the pre-meeting briefings, in the editor brief's format (the book team's tool):
#   admin/tools/meeting_pdfs.sh [<meeting id> [<person id> ...]]     (default: the next stand-up, everyone)
# Builds the site first, so the briefings are current, then writes the PDFs OUTSIDE the repository
# (OUT, default ${TMPDIR:-/tmp}/web-summit-briefings/<meeting id>/), so the tree stays clean for the gate.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
node admin/build/build.mjs > /dev/null
ID=${1:-$(node admin/tools/agenda.mjs next)}; shift || true
OUT=${OUT:-${TMPDIR:-/tmp}/web-summit-briefings}/$ID; mkdir -p "$OUT"
PEOPLE=${*:-$(ls meetings/$ID/*.json | xargs -n1 basename | sed 's/\.json$//')}
for p in $PEOPLE; do
  sed 's#"path": "#"path": "'"$PWD"'/#' "meetings/$ID/$p.json" > "$OUT/$p.json"
  python3 -I team/conductor/tools/editor_brief.py "$OUT/$p.json" | sed 's#^editor_brief: ##'
done
