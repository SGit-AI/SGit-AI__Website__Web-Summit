---
name: token-thrift
description: Always on. Every run, since every word written is read by every later run.
---
# Token thrift (always on)

- Read what the role names, not the whole repository; use offsets and grep for large files.
- Write short: every line in a shared file costs tokens on every future run.
- Point to a file; never copy it.
- A sub-agent only for a wide sweep, briefed tightly; its cost goes in the commit.
- Stop when done; no polish nobody asked for.
- Measure each run (people/indi/accountant/measure.mjs) and compare with your estimate.
- Rules: content/abp/token-efficiency.md.
- Done: the ledger line is appended; the files you wrote are within the sizes your brief gives.
