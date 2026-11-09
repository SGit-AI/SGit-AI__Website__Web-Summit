// n8n Code node "Find the newest report" (JavaScript, Run Once for All Items). No network: the HTTP Request node before
// it fetched https://web-summit.sgit.ai/reports/index.md as Text into the field "data". Skips the newsletter.
const SITE = 'https://web-summit.sgit.ai/'
const md = String($input.first().json.data || '')
const newest = [...md.matchAll(/^- \[(.+?)\]\(([^)/]+)\/index\.html\)(?::\s*(.*))?$/gm)]
  .map(m => ({ title: m[1], id: m[2], summary: m[3] || '' }))
  .find(r => /^\d{4}-\d{2}-\d{2}-\d{4}$/.test(r.id))
if (!newest) throw new Error('No two-hourly report found in reports/index.md')
return [{ json: { ...newest, link: `${SITE}reports/${newest.id}/`, source_url: `${SITE}reports/${newest.id}/index.md` } }]
