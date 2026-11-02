#!/usr/bin/env bash
# CI owns the version (https://newsroom.sgit.ai/articles/ci-owns-the-version.html). Called by the release job
# with BRANCH=dev|main, after the gate passed on the pushed commit. Nobody but CI writes the number:
#   1. take the branch head as it is now (a push that landed meanwhile rides this release),
#   2. read the newest version (the newest tag, or version.txt if a hand-bumped one is higher, during the move),
#      and bump it: dev the last number, main the middle one,
#   3. write admin/build/version.txt, the admin/versions.json row (the pushed subject and its Agent: trailer)
#      and REALITY.md's version, build, and run the gate on exactly that tree,
#   4. commit as GitHub Actions ("site vX.Y.Z: <the pushed subject>"), tag that commit, push the branch, then the
#      tag; if the branch moved, start again from its new head (three tries).
# The release job then deploys the tree this script built and checked. PUSH=0 does everything but push.
set -euo pipefail
BRANCH=${BRANCH:?BRANCH must be dev or main}
PUSH=${PUSH:-1}
git config user.name 'GitHub Actions'; git config user.email 'actions@github.com'

# guard (a warning while agents move to the new release.sh): only CI writes version.txt
if [ -n "${BEFORE:-}" ] && git cat-file -e "$BEFORE" 2>/dev/null; then
  if git log --format=%an "$BEFORE..HEAD" -- admin/build/version.txt | grep -qv '^GitHub Actions$'; then
    echo "::warning::version.txt was edited outside CI since ${BEFORE:0:9}; CI's number replaces it (only CI writes the version)"
  fi
fi

for try in 1 2 3; do
  git fetch --quiet --tags origin "$BRANCH"
  git checkout -q -B "$BRANCH" "origin/$BRANCH"
  SUBJECT=$(git log -1 --format=%s)
  if [[ "$SUBJECT" =~ ^site\ v[0-9]+\.[0-9]+\.[0-9]+: ]] && [ "$(git log -1 --format=%an)" = 'GitHub Actions' ]; then
    echo "the head is already a CI release ($SUBJECT); rebuilding it to deploy, no new number"
    node admin/build/build.mjs > /dev/null; node admin/build/validate.js; exit 0
  fi
  AGENT=$(git log -1 --format=%B | grep -m1 '^Agent: ' | sed 's/^Agent: //' || true)
  LAST_TAG=$(git tag --list 'v*' | sort -V | tail -1); LAST_TAG=${LAST_TAG:-v0.0.0}
  FILE=$(cat admin/build/version.txt 2>/dev/null || echo v0.0.0)
  LAST=$(printf '%s\n%s\n' "$LAST_TAG" "$FILE" | sort -V | tail -1)
  IFS=. read -r A B C <<< "${LAST#v}"
  if [ "$BRANCH" = main ]; then NEW="v$A.$((B + 1)).0"; else NEW="v$A.$B.$((C + 1))"; fi
  echo "newest version $LAST (tag $LAST_TAG, version.txt $FILE) -> $NEW on $BRANCH"

  printf '%s\n' "$NEW" > admin/build/version.txt
  WHAT=$(sed -E 's/^[^ :]+@web-summit\.[a-z0-9-]+: //; s/^site v[0-9.]+: //' <<< "$SUBJECT")
  node -e '
    const fs = require("fs"), [v, what, by] = process.argv.slice(1)
    const rows = JSON.parse(fs.readFileSync("admin/versions.json", "utf8")).filter(r => r.version !== v)
    rows.unshift({ version: v, date: new Date().toISOString().slice(0, 10), what, ...(by ? { by } : {}) })
    fs.writeFileSync("admin/versions.json", JSON.stringify(rows, null, 2) + "\n")' "$NEW" "$WHAT" "$AGENT"
  sed -i -E "s/\(site v[0-9]+\.[0-9]+\.[0-9]+\)/(site $NEW)/" REALITY.md
  node admin/build/build.mjs > /dev/null
  node admin/build/validate.js
  git add admin/build/version.txt admin/versions.json REALITY.md
  git commit -q -m "site $NEW: $WHAT" -m "Released by CI from $(git rev-parse --short HEAD) ($SUBJECT)${AGENT:+
Agent: $AGENT}"
  git tag "$NEW"
  [ "$PUSH" = 1 ] || { echo "PUSH=0: would release $NEW"; exit 0; }
  if git push -q origin "HEAD:$BRANCH"; then git push -q origin "refs/tags/$NEW"; echo "released $NEW"; exit 0; fi
  git tag -d "$NEW" > /dev/null
  echo "$BRANCH moved while releasing; taking it in (attempt $try)"
done
echo "::error::$BRANCH kept moving; nothing released"; exit 1
