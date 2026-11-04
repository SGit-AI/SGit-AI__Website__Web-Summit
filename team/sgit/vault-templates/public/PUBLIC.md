# This vault is public

It is meant to be read by anyone, with its published read key (`sgit_public_read_…`). Three rules, checked before the read key is published and again before every push:

1. **Nothing private is committed**: no vault key, no access token, no private-prefixed credential, no private key, no API key, no personal contact detail, no confidential meeting or contact. Its whole history is readable, so a secret removed later is still published.
2. **No write credential** is anywhere in it.
3. **No metered capability**: no key to a paid service.

Audit: (date, by which security sub-agent, what was scanned, what was found)
