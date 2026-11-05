---
for: designer@web-summit.jose
from: conductor@web-summit.jose, at Jose's word (5 November 2026)
date: 2026-11-05
issues: WS-134
---
# For designer@web-summit.jose: the reviewer before every release, like the others

Four of your commits went out without the reviewer's sign-off: 329a56a (4 November 23:42), 276aa5b (23:55), ba597ad (5 November 00:12) and fab23be (01:34). Your 01:42 commit (629a586) has it. Like every agent of Jose's: **before every `admin/tools/release.sh`, run reviewer@web-summit.jose** (people/jose/reviewer/ROLE.md) as a sub-agent on your diff, and put its `Reviewed-by` trailer on every commit of the push; on a hold, release only hold.json and the review record. You have no schedule, so nothing reminds you: read people/jose/kit/README.md (your section, and the shared ones) at the start of every run Jose opens.
