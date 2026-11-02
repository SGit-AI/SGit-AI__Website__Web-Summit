#!/usr/bin/env bash
# Release from any person's or agent's clone, safely while others push too.
#   AGENT=pm@web-summit.vicky admin/tools/release.sh "one sentence: what this release does"
# Before running: commit your SOURCE changes (content/, data/, board/, people/, admin/, team/...), never the
# generated pages. This script then, in order: fetches dev, rebases your commits on it, sets the next
# version (one more than dev's), adds the versions row, builds, runs the gate, commits the release
# ("site vX.Y.Z: <sentence>"), and pushes. If someone pushed first, it drops its own release commit and
# starts again (up to 5 times). Finally it polls the live site until it serves the new version.
#   SKIP_LIVE=1  do not wait for the live site     DRY=1  do everything but push
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
SENTENCE=${1:?usage: AGENT=<agent>@web-summit.<person> admin/tools/release.sh "<one sentence>"}
AGENT=${AGENT:?set AGENT to your name, e.g. AGENT=pm@web-summit.vicky}
BRANCH=dev
[ "$(git rev-parse --abbrev-ref HEAD)" = "$BRANCH" ] || { echo "release.sh: be on $BRANCH"; exit 1; }
if [ -n "$(git status --porcelain)" ]; then
  echo "release.sh: commit your source changes first (and do not commit generated pages); the tree is not clean:"; git status --short | head -20; exit 1
fi
for attempt in 1 2 3 4 5; do
  git fetch -q origin "$BRANCH"
  if ! git rebase -q "origin/$BRANCH"; then
    # generated output is rebuilt below, so a conflict only in generated files can take dev's side;
    # a conflict in any source file stops the release for a person to resolve
    while [ -n "$(git diff --name-only --diff-filter=U)" ]; do
      CONFLICTS=$(git diff --name-only --diff-filter=U)
      if echo "$CONFLICTS" | grep -qE '^content/' || echo "$CONFLICTS" | grep -qvE '(\.html|/index\.md|^index\.md|^llms\.txt|^sitemap\.xml|^admin/versions\.md)$'; then
        echo "release.sh: a source file conflicts with dev; resolve it by hand:"; echo "$CONFLICTS"; git rebase --abort; exit 1
      fi
      git checkout --ours -- $CONFLICTS
      git add -A; GIT_EDITOR=true git rebase --continue >/dev/null || true
    done
  fi
  CUR=$(cat admin/build/version.txt); N=${CUR##*.}; NEXT="${CUR%.*}.$((N + 1))"
  echo "$NEXT" > admin/build/version.txt
  node -e '
    const fs = require("fs"), [v, what, by] = process.argv.slice(1)
    const rows = JSON.parse(fs.readFileSync("admin/versions.json", "utf8"))
    rows.unshift({ version: v, date: new Date().toISOString().slice(0, 10), what, by })
    fs.writeFileSync("admin/versions.json", JSON.stringify(rows, null, 2) + "\n")' "$NEXT" "$SENTENCE" "$AGENT"
  sed -i -E "s/\(site v[0-9]+\.[0-9]+\.[0-9]+\)/(site $NEXT)/" REALITY.md
  node admin/build/build.mjs >/dev/null
  node admin/build/validate.js
  git add -A
  git commit -q -m "site $NEXT: $SENTENCE" -m "Agent: $AGENT"
  [ "${DRY:-0}" = 1 ] && { echo "DRY: would push $NEXT"; exit 0; }
  if git push -q origin "$BRANCH"; then echo "pushed $NEXT"; break; fi
  echo "release.sh: someone pushed first; dropping $NEXT and trying again"
  git reset -q --hard HEAD~1
  [ "$attempt" = 5 ] && { echo "release.sh: gave up after 5 attempts"; exit 1; }
  sleep $((attempt * 3))
done
[ "${SKIP_LIVE:-0}" = 1 ] && exit 0
HOST=$(cat CNAME)
for i in $(seq 1 24); do
  LIVE=$(curl -s "https://$HOST/llms.txt" | grep -o 'v[0-9]*\.[0-9]*\.[0-9]*' | head -1 || true)
  [ "$LIVE" = "$NEXT" ] && { echo "live: $HOST serves $NEXT"; exit 0; }
  sleep 10
done
echo "release.sh: pushed $NEXT, but $HOST still serves ${LIVE:-nothing} after 4 minutes: check the deploy-pages run"; exit 1
