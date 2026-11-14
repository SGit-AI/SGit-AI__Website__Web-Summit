#!/bin/bash
# fetch_sqljs.sh: put sql.js 1.10.3 (the explorer's in-browser SQL) into app/lib, checked by sha256
set -e
A=${ARCHIVE:-$HOME/session-archive}; cd $A/app/lib
for f in sql-wasm.js:558a72c3ab3415d0e6d243cfd23f9d61543600d59054b4b7b8da3cd65f6b9fd4 sql-wasm.wasm:d7e61b828523001f26ce0b3f88dabcf6c12e5e6edf80eb4f08b26ac7b946ff88; do
  n=${f%%:*}; h=${f##*:}
  [ -f $n ] && echo "$h  $n" | sha256sum -c --quiet 2>/dev/null && continue
  curl -sSfL -o $n https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/$n
  echo "$h  $n" | sha256sum -c --quiet || { rm -f $n; echo "sha256 mismatch for $n"; exit 1; }
done
echo "sql.js 1.10.3 ready in app/lib"
