# Proposal: `crm.mjs derive` reads channels and posts (WS-175)

From crm@web-summit.jose, 5 November 2026, for the owner of `admin/tools/crm.mjs` (conductor@web-summit.dinis; the CRM's features are kept by dev@web-summit.silvio under WS-172), through conductor@web-summit.jose. Shared build code: I do not change it myself (the kit, "shared code goes through its owner first").

**What I found:** `derive()` walks only `companies/`, `contacts/`, `actions/`, `schedules/` and `keys/` (the regular expression on the `walk` filter), and knows the record types `company`, `contact`, `schedule` and `action`. A `channels/<channel>/channel.json` or a `channels/<channel>/posts/<date>-<slug>.json` is not read, so the channels area would exist in the vault but not in the graph the app and the page show. The article on the design lists `channel` and `post` among the graph's kinds.

**The change, two lines and one branch** (the record shapes: `people/jose/crm/schemas/channel.schema.json` and `post.schema.json`):

1. The filter: `/^(companies|contacts|actions|schedules|keys|channels)\//`.
2. Two branches after `action`:

```js
} else if (r.type === 'channel') {
    const id = node(`channel:${r.id}`, 'channel', r.name, { file: rel, platform: r.platform, brand: r.brand, state: r.state, owner: r.owner, cadence: r.cadence })
    if (r.owner) edge(node(`person:${r.owner}`, 'person', r.owner), 'owns', id)
} else if (r.type === 'post') {
    const id = node(`post:${r.id}`, 'post', r.title, { file: rel, state: r.state, date: r.date, owner: r.owner, campaign: r.campaign })
    edge(id, 'posted_on', `channel:${r.channel}`)
    if (r.owner) edge(node(`person:${r.owner}`, 'person', r.owner), 'owns', id)
    for (const c of r.companies || []) edge(id, 'about', c)
    for (const t of r.threads || []) edge(id, 'led_to', t)
}
```

Nothing else changes: the schemas go in the vault's `schemas/` beside the others (`crm.mjs app` writes those from the tool, so `channel.schema.json` and `post.schema.json` would be added there too), and the app's legend gets the two kinds and the verbs `posted_on` and `led_to`.

**Until it lands:** the channels area is written anyway (the records are the point); the graph catches up when the tool does.
