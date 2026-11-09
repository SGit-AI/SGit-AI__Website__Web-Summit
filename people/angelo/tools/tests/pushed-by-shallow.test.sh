#!/usr/bin/env bash
# pushed-by.mjs --last-touch from a shallow clone (backlog 0-FIX, the desk's 76bc54fa): research@ stopped on 9 November because,
# in a depth-1 clone, git log -- <path> named the clone's boundary commit, which never touched the spec. This makes a depth-1
# clone of dev, shows what git log says there, and checks that --last-touch names the same commit as GitHub's commits API and
# answers ANGELO or NOT-ANGELO, never the boundary commit (unless that commit really is the last to touch the path).
# Needs the network (GitHub). Run from the repository's root: bash people/angelo/tools/tests/pushed-by-shallow.test.sh [<path>]
set -u
P=${1:-people/angelo/proposals/new-agents/spec-new-agents.md}
ROOT=$(git rev-parse --show-toplevel); T=$(mktemp -d); trap 'rm -rf "$T"' EXIT
git clone -q --depth 1 --branch dev "$(git -C "$ROOT" remote get-url origin)" "$T/c" || { echo "FAIL could not clone"; exit 1; }
cp "$ROOT/people/angelo/tools/pushed-by.mjs" "$T/c/people/angelo/tools/pushed-by.mjs"   # the version under test
cd "$T/c"
[ "$(git rev-parse --is-shallow-repository)" = true ] || { echo "FAIL the clone is not shallow"; exit 1; }
BOUNDARY=$(git log -1 --format=%h -- "$P"); echo "shallow git log -- $P: $BOUNDARY (the boundary: $(git rev-parse --short HEAD))"
OUT=$(node people/angelo/tools/pushed-by.mjs --last-touch "$P"); RC=$?; echo "$OUT"
WANT=$(gh api "repos/SGit-AI/SGit-AI__Website__Web-Summit/commits?sha=dev&per_page=1&path=$P" --jq '.[0].sha' 2>/dev/null | cut -c1-9)
GOT=$(echo "$OUT" | sed -n 's/.*last touched on dev by \([0-9a-f]*\).*/\1/p')
ok=1
[ -n "$GOT" ] || { echo "FAIL no commit named"; ok=0; }
[ -z "$WANT" ] || [ "$GOT" = "$WANT" ] || { echo "FAIL named $GOT, GitHub says $WANT"; ok=0; }
[ $RC -eq 0 ] || [ $RC -eq 1 ] || { echo "FAIL exit $RC (unknown)"; ok=0; }
echo "$OUT" | tail -1 | grep -qE ' (ANGELO|NOT-ANGELO)$' || { echo "FAIL no verdict"; ok=0; }
[ $ok = 1 ] && echo PASS || exit 1
