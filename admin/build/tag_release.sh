#!/usr/bin/env bash
# Tags the release commit. Called by CI (tag-release job) with BRANCH=dev|main; PUSH=0 for a dry run.
#   dev  -> the next minor: v0.1.N -> v0.1.N+1
#   main -> the next major: v0.N.M -> v0.N+1.0
# The version is owned by admin/build/version.txt and must also be in the subject of the release
# commit ("site vX.Y.Z: ..."). The release commit is the newest commit whose subject says so: HEAD on a
# direct push, HEAD's parent when a pull request lands as a merge commit.
set -euo pipefail
BRANCH=${BRANCH:?BRANCH must be dev or main}
PUSH=${PUSH:-1}
git fetch --tags --quiet 2>/dev/null || true

VER=$(grep -oP '^v\K[0-9]+\.[0-9]+\.[0-9]+' admin/build/version.txt)
TAG="v$VER"
echo "version.txt says $TAG (branch $BRANCH)"

# Read the history once: piping git log into an early-exiting reader dies of SIGPIPE under pipefail.
LOG=$(git log --format='%H;%s')
NEWEST=$(grep -oP '^[0-9a-f]+;site v\K[0-9]+\.[0-9]+\.[0-9]+(?=:)' <<< "$LOG" | head -1 || true)
if [ -z "$NEWEST" ]; then
  echo "::error::no commit in this history carries a version in its subject (\"site vX.Y.Z: ...\")"; exit 1
fi
if [ "$NEWEST" != "$VER" ]; then
  echo "::error::version.txt says $TAG but the newest release commit is v$NEWEST — the two disagree"; exit 1
fi
REL=$(grep -m1 -F ";site v$VER:" <<< "$LOG" | cut -d';' -f1)

if git rev-parse -q --verify "refs/tags/$TAG" >/dev/null; then
  if [ "$(git rev-parse "refs/tags/$TAG^{commit}")" = "$REL" ]; then
    echo "$TAG is already on the release commit; nothing to do"; exit 0
  fi
  echo "::error::$TAG already exists on an earlier commit — version.txt was not bumped for this release"; exit 1
fi

PREV=$(git tag --list 'v*' | sort -V | tail -1 || true)
if [ -n "$PREV" ]; then
  MINOR=$(awk -F. '{printf "%s.%s.%d", $1, $2, $3+1}' <<< "$PREV")
  MAJOR=$(awk -F. '{split($1,a,"v"); printf "v%s.%d.0", a[2], $2+1}' <<< "$PREV")
  case "$BRANCH" in
    dev)  WANT=$MINOR ;;
    main) WANT=$MAJOR ;;
    *) echo "::error::unknown branch $BRANCH"; exit 1 ;;
  esac
  if [ "$TAG" != "$WANT" ]; then
    echo "::error::latest tag is $PREV; a push to $BRANCH must be $WANT, got $TAG"; exit 1
  fi
fi

git tag "$TAG" "$REL"
[ "$PUSH" = 1 ] && git push origin "refs/tags/$TAG"
echo "tagged ${REL:0:9} as $TAG"
