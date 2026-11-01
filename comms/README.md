# comms: the team's board and mailroom, as files in git

Set up as the cold read's team used them (Issues-FS lite and Email-FS lite). **Everything here is public, forever**: this repository and its site are public, and a later commit does not unpublish an earlier one. Nothing private, no contact detail, no key, ever; `node admin/tools/comms_check.mjs` (also run by the gate) refuses email addresses, phone numbers and key shapes.

- **The board**: `comms/issues/<member>/issues/{open,blocked,done}/NNN-slug.md`, one writer per file: the member that owns the board.
- **The mail**: a request is a file `comms/mail/mailroom/<recipient>/<sender>__NNN-slug.md` with a header block (From, To, Date, Subject, X-Kind: request|reply|update). The recipient answers at the next wake that runs it: an issue on its board, and a reply in the sender's mailroom. Never edit or delete a letter in a mailroom: it is the sender's.
- **People's contact details** never come here: they stay in the owner's own email account and personal CRM vault.
