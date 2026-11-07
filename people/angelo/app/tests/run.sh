#!/usr/bin/env bash
# Angelo's command centre, its browser tests (Playwright, Chromium, desktop 1280 px and phone 390 px).
# Run from the repository's root:  people/angelo/app/tests/run.sh [test names...]   (no names: all of them)
# It builds the site, serves the repository on 127.0.0.1:8765 for the run, and writes screenshots to a temporary folder.
set -u
cd "$(dirname "$0")/../../../.."
node admin/build/build.mjs >/dev/null || { echo "build failed"; exit 1; }
SHOTS=$(mktemp -d)
python3 -m http.server 8765 >/dev/null 2>&1 & SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
sleep 1
names=("$@"); [ ${#names[@]} -eq 0 ] && names=($(ls people/angelo/app/tests/*.test.js | xargs -n1 basename | sed 's/\.test\.js$//'))
fail=0
for t in "${names[@]}"; do
  out=$(node "people/angelo/app/tests/$t.test.js" "$SHOTS" 2>&1); last=$(printf '%s\n' "$out" | tail -1)
  printf '%-8s %s\n' "$t" "$last"; [ "$last" = "PASS" ] || { fail=1; printf '%s\n' "$out" | tail -6 | sed 's/^/    /'; }
done
echo "screenshots: $SHOTS"
exit $fail
