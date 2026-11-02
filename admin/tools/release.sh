#!/usr/bin/env bash
# Release from any person's or agent's clone, safely while others push too. CI owns the version
# (https://newsroom.sgit.ai/articles/ci-owns-the-version.html): you never write a number.
#   AGENT=pm@web-summit.vicky admin/tools/release.sh ["one sentence, for your own log"]
# Before running: commit your SOURCE changes with the convention (subject "<your name>: <what>", trailer
# "Agent: <your name>"); never generated pages, version.txt or versions.json. This script then: fetches dev,
# rebases your commits on it, builds and runs the gate locally (so a red gate never leaves your machine),
# pushes (rebasing again if someone pushed first), and waits for CI to number your release and for the live
# site to serve it. CI's release commit is "site vX.Y.Z: <your subject>".
#   SKIP_LIVE=1  do not wait for CI and the live site     DRY=1  do everything but push
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
AGENT=${AGENT:?set AGENT to your name, e.g. AGENT=pm@web-summit.vicky}
BRANCH=dev
[ "$(git rev-parse --abbrev-ref HEAD)" = "$BRANCH" ] || { echo "release.sh: be on $BRANCH"; exit 1; }
if [ -n "$(git status --porcelain)" ]; then
  echo "release.sh: commit your source changes first (never generated pages); the tree is not clean:"; git status --short | head -20; exit 1
fi
for attempt in 1 2 3 4 5; do
  git fetch -q origin "$BRANCH"
  if ! git rebase -q "origin/$BRANCH"; then
    echo "release.sh: your commits conflict with dev; resolve them by hand:"; git diff --name-only --diff-filter=U; git rebase --abort; exit 1
  fi
  [ "$(git rev-list --count "origin/$BRANCH..HEAD")" = 0 ] && { echo "release.sh: nothing of yours to push"; exit 0; }
  if git diff --name-only "origin/$BRANCH..HEAD" | grep -qxE 'admin/build/version.txt|admin/versions.json'; then
    echo "release.sh: your commits change version.txt or versions.json; only CI writes those now. Drop those changes."; exit 1
  fi
  node admin/build/build.mjs > /dev/null
  node admin/build/validate.js
  [ "${DRY:-0}" = 1 ] && { echo "DRY: would push $(git rev-list --count "origin/$BRANCH..HEAD") commit(s)"; exit 0; }
  MINE=$(git rev-parse HEAD)
  if git push -q origin "HEAD:$BRANCH"; then echo "pushed ${MINE:0:9}; CI numbers the release"; break; fi
  echo "release.sh: someone pushed first; rebasing and trying again"
  [ "$attempt" = 5 ] && { echo "release.sh: gave up after 5 attempts"; exit 1; }
  sleep $((attempt * 3))
done
[ "${SKIP_LIVE:-0}" = 1 ] && exit 0
HOST=$(cat CNAME)
for i in $(seq 1 36); do
  git fetch -q --tags origin "$BRANCH"
  TAG=$(git tag --contains "$MINE" --list 'v*' | sort -V | head -1 || true)
  if [ -n "$TAG" ]; then
    LIVE=$(curl -s "https://$HOST/llms.txt" | grep -o 'v[0-9]*\.[0-9]*\.[0-9]*' | head -1 || true)
    if [ "$(printf '%s\n%s\n' "$TAG" "${LIVE:-v0.0.0}" | sort -V | tail -1)" = "${LIVE:-}" ]; then echo "live: $HOST serves $LIVE (your commit is in $TAG)"; exit 0; fi
  fi
  sleep 10
done
echo "release.sh: pushed, but no live release contains ${MINE:0:9} after 6 minutes: check the deploy-pages run"; exit 1
