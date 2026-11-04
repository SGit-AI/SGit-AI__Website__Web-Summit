#!/usr/bin/env node
// WS-39-route3.build.mjs: writes WS-39-route3.n8n.json, the n8n workflow for WS-39 route 3 (Jose, 3 November 2026:
// "report-draft.mjs makes the text, n8n sends it to me, I forward it to the group"). Run after changing
// report-draft.n8n.js or this file; WS-39-route3.test.mjs checks that the JSON is what this script makes.
//   node people/jose/dev/WS-39-route3.build.mjs
// The workflow holds no number, token, chat id, credential or invite link: the "Settings" node has empty fields and the
// HTTP node an empty credential, filled in inside n8n (the list is at the top of WS-39-findings.md).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(here, 'WS-39-route3.n8n.json')

// Node 1's schedule. Polling, not an event: the site has no webhook or feed for a new report, and the id check below
// sends each report once. Every 30 minutes, 07:05 to 22:35 UTC (Lisbon is UTC in November), so a late journalist run
// still reaches Jose within half an hour and nothing pings him at night; the night's last report goes at 07:05.
export const CRON = '5,35 7-22 * * *'

export const SETTINGS = `// Settings: fill these in n8n, never in the repository (WS-39-findings.md, "To fill in n8n").
const s = $getWorkflowStaticData('global')
return [{ json: {
  since: s.lastId || '',      // the last report sent; kept by "Remember the report"
  look: 'three',              // 'three', 'line' or 'full' (people/jose/dev/README.md)
  mode: 'text',               // 'text' (needs Jose to have messaged the number in the last 24 h) or 'template'
  to: '',                     // FILL IN: Jose's own WhatsApp number, digits with country code, only Jose
  phone_number_id: '',        // FILL IN: the business number's Phone number ID (Meta app, WhatsApp, API setup)
  graph_version: '',          // FILL IN: the Graph API version your Meta app uses, e.g. v23.0
  template_name: '',          // FILL IN for mode 'template': an approved template with one body parameter {{1}}
  template_language: '',      // FILL IN for mode 'template': its language code, e.g. en
} }]`

export const BUILD = `// Build the WhatsApp message: nothing new means no items, so nothing is sent.
const d = $input.first().json, s = $('Settings').first().json
if (!d.new) return []
const need = ['to', 'phone_number_id', 'graph_version'].concat(s.mode === 'template' ? ['template_name', 'template_language'] : [])
const missing = need.filter(k => !String(s[k] || '').trim())
if (missing.length) throw new Error('route 3: fill in the Settings node first: ' + missing.join(', '))
if (!['text', 'template'].includes(s.mode)) throw new Error('route 3: mode is text or template')
const to = String(s.to).replace(/[^0-9]/g, '')
// a template parameter may not hold new lines, tabs or more than four spaces in a row
const flat = d.text_whatsapp.replace(/\\s*\\n+\\s*/g, ' · ').replace(/\\t/g, ' ').replace(/ {2,}/g, ' ').slice(0, 1000)
const body = s.mode === 'text'
  ? { messaging_product: 'whatsapp', recipient_type: 'individual', to, type: 'text', text: { preview_url: true, body: d.text_whatsapp } }
  : { messaging_product: 'whatsapp', recipient_type: 'individual', to, type: 'template', template: { name: s.template_name, language: { code: s.template_language }, components: [{ type: 'body', parameters: [{ type: 'text', text: flat }] }] } }
return [{ json: { id: d.id, mode: s.mode, url: 'https://graph.facebook.com/' + s.graph_version + '/' + s.phone_number_id + '/messages', body } }]`

export const REMEMBER = `// Remember the report: only after Meta accepted the message, so a failed send is retried at the next poll.
// n8n keeps static data for runs of the active workflow, not for manual test runs.
$getWorkflowStaticData('global').lastId = $('Build the WhatsApp message').first().json.id
return $input.all()`

export function workflow() {
    const draft = fs.readFileSync(path.join(here, 'report-draft.n8n.js'), 'utf8')
    const node = (name, type, typeVersion, x, parameters, extra = {}) => ({ parameters, id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name, type, typeVersion, position: [x, 300], ...extra })
    const code = (name, x, jsCode) => node(name, 'n8n-nodes-base.code', 2, x, { jsCode })
    const names = ['Every 30 minutes, 07:05 to 22:35 UTC', 'Settings', 'Draft the report', 'Build the WhatsApp message', 'Send to Jose', 'Remember the report']
    const nodes = [
        node(names[0], 'n8n-nodes-base.scheduleTrigger', 1.2, 0, { rule: { interval: [{ field: 'cronExpression', expression: CRON }] } }),
        code(names[1], 220, SETTINGS),
        code(names[2], 440, draft),
        code(names[3], 660, BUILD),
        node(names[4], 'n8n-nodes-base.httpRequest', 4.2, 880, {
            method: 'POST', url: '={{ $json.url }}', authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth',
            sendBody: true, specifyBody: 'json', jsonBody: '={{ JSON.stringify($json.body) }}', options: {},
        }, { credentials: { httpHeaderAuth: { id: '', name: '' } } }),
        code(names[5], 1100, REMEMBER),
    ]
    const connections = Object.fromEntries(names.slice(0, -1).map((n, i) => [n, { main: [[{ node: names[i + 1], type: 'main', index: 0 }]] }]))
    return {
        name: 'WS-39 route 3: the journalist\'s report to Jose on WhatsApp',
        nodes, connections, active: false,
        settings: { executionOrder: 'v1', timezone: 'UTC' }, // the schedule is in UTC whatever the n8n instance's own time zone
        meta: { note: 'From people/jose/dev/WS-39-route3.build.mjs (dev@web-summit.jose). Drafts only, to Jose only; Jose forwards to the group. Fill in the Settings node and the credential (WS-39-findings.md, "To fill in n8n").' },
    }
}

export const render = () => JSON.stringify(workflow(), null, 2) + '\n'

if (import.meta.url === `file://${process.argv[1]}`) { fs.writeFileSync(OUT, render()); console.log('wrote ' + path.relative(process.cwd(), OUT)) }
