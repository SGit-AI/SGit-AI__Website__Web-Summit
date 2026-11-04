# WS-112: the review step before a brief goes out

WS-112 asks for "a review step before a brief goes out (a second agent checks every number against its source)". Proposed for every conductor; Indi's conductor first, if Indi agrees.

## The step

Before a conductor sends a brief (after the JSON is written, before the PDF goes out), it starts **one sub-agent** with the prompt below. It sends the brief only when the reviewer replies `PASS`. On `FAIL`, it fixes the brief and reviews again, once.

```
You review one brief before it is sent. File: <path to the brief JSON>. For every number, date, time, name of an issue (WS-NN) and quotation in it, find its source (the brief's "sources", the git log, the board file, the person's files) and check it matches. Also check: at most three asks in "for_you"; "next", "sources" and "wide" are lists; no em dashes; no contact details. Reply with PASS, or FAIL and a list: field, what it says, what the source says, the source. Change nothing.
```

## Why a sub-agent

The conductor wrote the brief and is likely to read what it meant, not what it wrote. A fresh reader with only the file and the sources catches a wrong number or an old time.

## Cost

About 15,000 to 30,000 tokens per brief on Sonnet 5.5. Three briefs a day is under 100,000 tokens.
