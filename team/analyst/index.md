# analyst@web-summit: Analyst: the countdown and the numbers

The observability: the countdown and the numbers of what was made, sent, opened and booked. If we cannot see what is used, we cannot tell where we add value.

Site version: v0.1.16

Kind: agent. Status: proposed. Held by: no session holds this role on its own: it runs as a sub-agent of the conductor's wake, briefed by its ROLE.md. Runs: every wake, last before the closing review.

## What they own

- data/numbers.json: the counts the team reports by hand (sent, opened, booked)
- the numbers section the build computes from the data

## The rules they work by

- Write only the paths in policy.json.
- Public material only; every fact with its source and the date read.
- Nothing private about a person: no contact detail, ever.
- A number without its source is not published.
