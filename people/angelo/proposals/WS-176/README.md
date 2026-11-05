# WS-176: the email twin, a mail view of the private CRM (proposal)

Drafted by crm@web-summit.angelo on 5 November 2026, at Dinis's word (conductor@web-summit.dinis, e467e0a4) and with Angelo's yes in this agent's session. The change touches shared code (`admin/tools/crm.mjs`, `admin/tools/crm_app.html.tpl`, `assets/crm.js`), so it comes here as a patch for its owner, conductor@web-summit.dinis, to review and apply. It applies cleanly to dev at 07d4e65c (`git apply people/angelo/proposals/WS-176/email-twin.patch`).

## What it does

**This is step one: read-only.** The "draft a reply" box comes next, once the shape of WS-173's real threads is known.

- **The inbox:** every thread in `companies/*/comms/*/`, newest first, with its company, its date, the number of messages, the direction of the last message, its state and its owner. You can filter by company and by owner, and search subjects, companies, people and summaries.
- **The thread view:** the thread's owner, state, next step, our people and their contacts, then its messages in order. Each message shows its card's direction, date, from, to and summary. "The card" shows every field of the card. "The message (as text)" reads the `.eml` and shows its main headers, a check of its sha256 against the card, the body as plain text and the attachments listed (never opened). "All headers" shows the rest.
- **The company view:** from the company name, its facts, all its threads and its actions.
- **Where it appears:**
  - In the private CRM's own vault app, as a **Mail** tab. It opens first when there is mail.
  - On /crm/ after **Open the private CRM**, as "Mail: the email twin", read from the vault that page already holds open. The message list there leaves out the mail cards, which now live in the mail view.

## Mail is untrusted

- **No HTML, ever.** Nothing from the vault is ever put into `innerHTML` or parsed as HTML: every string reaches the page through `textContent`. An HTML-only email is turned into text by removing its tags with a few regular expressions, not by a DOM parser, so it never runs, renders or loads anything. Its links appear as text in square brackets; images, frames, styles and scripts are dropped.
- **Size limits:** an EML is read up to 5 MB, a body up to 200,000 characters, a message up to 200 MIME parts and 8 levels of nesting. Each limit says so on the page when it is reached.
- **Nothing reaches out:** the parser and the views make no network request of their own. Every file is read through the same reader (`sg.vfs.readText` in the vault app, the opened vault on /crm/).

## The change, file by file (`email-twin.patch`)

- **`assets/crm-mail.js` (new):** the one module both places use. It holds `WSCrmMail.mount(root, { nodes, edges, readText })`, `parseEml(text)` (RFC 5322 and MIME: folded headers, RFC 2047 encoded words, multipart, base64, quoted-printable, charsets) and `htmlToText(html)`.
- **`admin/tools/crm.mjs`:**
  - `derive` adds `thread` nodes (from each `thread.json`: subject, owner, state, next step, channel, company) and `message` nodes (from each card: date, direction, from, to, summary, sha256, `reconstructed`, and its `.eml` if one sits beside it). It adds the edges `thread about company`, `message part_of thread` and `person owns thread`.
  - A file in comms that is not JSON is skipped with a line on the console, instead of stopping the whole derive.
  - It adds two schemas, `thread.schema.json` and `message.schema.json`. These are a proposal for inbox@web-summit.silvio's cards; the reader also accepts `title` for `subject`, `contacts` for `their_contacts` and `eml_sha256` for `sha256`.
  - `app` inlines `assets/crm-mail.js` into the vault app. It refuses the file if it ever contains a closing script tag.
- **`admin/tools/crm_app.html.tpl`:**
  - It adds the Mail tab and the mount point, and inlines the module.
  - It adds `[hidden]{display:none!important}`, because `main{display:grid}` otherwise keeps a hidden `main` visible.
- **`assets/crm.js`:** after the private vault is opened, it loads `assets/crm-mail.js` and mounts the mail view, when there is mail.

## How it was tested

`test/` holds the kit. Copy it to a scratch folder, then:

```
python3 -I make-fixture.py                      # writes vault/: two made-up companies, two threads, four messages
node <repo>/admin/tools/crm.mjs derive private --crm <a folder whose vaults.json points "private" at vault/>
node compose.js <repo with the patch applied>   # vault/index.html, built as `crm.mjs app` builds it
node test.js                                    # Playwright: the app with a stand-in for sg.vfs; screenshots in shots/
```

The fixture uses made-up names and example.* addresses only. It covers:
- a plain-text email with an RFC 2047 subject and a `<script>` written in its text;
- a multipart email: quoted-printable text, a base64 HTML part with a script, a remote image with `onerror`, a `javascript:` link and an iframe, and a PDF attachment;
- an HTML-only, quoted-printable email with a tracking pixel and an `<svg onload>`;
- a reconstructed draft whose sha256 is wrong on purpose;
- a broken `.json` file.

Results on 5 November 2026:

- **Nothing ran or loaded:** the script canary (`window.PWNED`) stayed unset, there were **no external requests**, no `img`, `iframe`, `svg`, `script` or `a[href]` element came from mail, and there were no console errors.
- **The checks behaved:** the right sha256 matched, the wrong one was flagged, and the broken file was skipped.
- **The views worked:**
  - the inbox lists newest first;
  - search ("stand") and the owner filter ("silvio") find the right threads;
  - the company view lists the company's threads and actions;
  - the Companies tab gives the page back to the old view;
  - at phone width (390 px) nothing overflows sideways.
- **Charsets decode:** ISO-8859-1 in quoted-printable decodes ("Olá, até já"), and named, numeric and accented HTML entities decode.
- **The public graph is unchanged:** `derive` with the patch on a copy of the real public CRM gave a graph byte-identical to the one without it (794 nodes, 1,041 edges).

**Not tested here:** /crm/ in a browser with a person's own key and the real private vault. That needs a person's key, so it is for the reviewer or Angelo once applied. The code path is the same module, given `readFile` on the vault the page already opened.

## Next

- Run it on WS-173's first real threads once inbox@web-summit.silvio writes them, and align the card fields with what it writes.
- Then the "draft a reply" box: a draft card (and `.eml`) saved beside the thread for the person to send from their own mail. That needs the vault app's write permission, which is a decision for the owner.
