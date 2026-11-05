#!/usr/bin/env node
// WS-74-pending.build.mjs: writes WS-74-pending.n8n.json, the n8n workflow for the n8n side of WS-74: new answers on the
// public feedback form, as a note to Jose only (automation@web-summit.jose). Run after changing this file;
// WS-74-pending.test.mjs checks that the JSON is what this script makes.
//   node people/jose/automation/WS-74-pending.build.mjs
// Jose's decision (5 November 2026, recorded on board WS-74 at 12:25 UTC): the count is made by vault@web-summit.jose on
// its drains, and n8n never holds the lane's enum key. So this flow reads only a public file the vault agent commits,
// people/jose/lanes/feedback-count.json (its format: people/jose/automation/README.md), from the live site, with no
// credential on the reading side. The workflow holds no number, token, chat id or credential: "Settings" has empty
// fields and "Send to Jose" an empty credential, filled in inside n8n (README.md, "WS-74: to fill in n8n").
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(here, 'WS-74-pending.n8n.json')

// Every 30 minutes in the day, like route 3: a GET of one small public file, and a note only when the count moved.
// The vault agent drains at 11:40 and 17:40 UTC (people/jose/kit/README.md), so a new count reaches Jose within about
// half an hour of its release.
export const CRON = '15,45 7-22 * * *'

export const SETTINGS = `// Settings: fill these in n8n, never in the repository (people/jose/automation/README.md, "WS-74: to fill in n8n").
const s = $getWorkflowStaticData('global')
return [{ json: {
  last_total: s.last_total || 0,  // the vault agent's received_total at the last note; kept by "Remember the note"
  last_state: s.last_state || '', // what the last note was about; kept by "Remember the note"
  now: new Date().toISOString(),
  count_url: 'https://web-summit.sgit.ai/people/jose/lanes/feedback-count.json', // public, committed by vault@web-summit.jose
  agent: 'vault@web-summit.jose',
  stale_hours: 26,            // no count for this long: the vault agent's drains may have stopped; 0 turns this off (needs "at" updated on every drain)
  warn_at: 800,               // answers left pending on the lane: at 1000 it refuses new ones (507)
  mode: 'text',               // 'text' (needs Jose to have messaged the number in the last 24 h) or 'template'
  to: '',                     // FILL IN: Jose's own WhatsApp number, digits with country code, only Jose
  phone_number_id: '',        // FILL IN: the business number's Phone number ID (Meta app, WhatsApp, API setup)
  graph_version: '',          // FILL IN: the Graph API version your Meta app uses, e.g. v23.0
  template_name: '',          // FILL IN for mode 'template': an approved Utility template with two body parameters and fixed text around them, e.g. "RiskMandate feedback inbox (WS-74): {{1}}. {{2}} This note goes to Jose only." (people/jose/automation/README.md)
  template_language: '',      // FILL IN for mode 'template': its language code, e.g. en
} }]`

// One note, or nothing. Pure logic: the file is fetched by the HTTP node before it (since n8n 2.0 Code nodes run on task
// runners; people/jose/dev/n8n-build-guide.md, section 2).
export const NOTE = `// Draft the note: from the vault agent's published count; nothing new to say means no items, so nothing is sent.
const s = $('Settings').first().json, r = $input.first().json
if (r.statusCode === 404) return []   // the vault agent has not published a count yet
if (r.statusCode !== 200) throw new Error('WS-74: reading ' + s.count_url + ' returned ' + r.statusCode)
const c = typeof r.body === 'string' ? JSON.parse(r.body) : (r.body || {})
const int = (v, d) => v === undefined ? d : (Number.isInteger(v) && v >= 0 ? v : NaN)
const total = int(c.received_total), left = int(c.pending_left, 0), lost = int(c.could_not_open, 0), at = Date.parse(c.at)
if (c.agent !== s.agent || [total, left, lost, at].some(Number.isNaN)) throw new Error('WS-74: ' + s.count_url + ' does not look like the vault agent\\'s count')
const statics = $getWorkflowStaticData('global')
let last = Number(s.last_total) || 0, lastState = s.last_state
if (total < last) { last = total; lastState = ''; statics.last_total = total; statics.last_state = '' } // a new counter: start again from it
const when = new Date(at).toISOString().slice(0, 16).replace('T', ' ') + ' UTC'
const n = total - last, stale = s.stale_hours > 0 && (Date.parse(s.now) - at) / 3.6e6 > s.stale_hours, full = left >= s.warn_at
// everything a note can say, in one state: a note goes when it changed and there is something to say, so each thing is
// said once; when there is nothing to say (the lane drained, a lost answer recovered) the state is remembered silently
const state = 'total:' + total + '|stale:' + (stale ? c.at : '') + '|lost:' + lost + '|full:' + (full ? 1 : 0)
if (state === lastState) return []
if (!n && !stale && !lost && !full) { statics.last_state = state; return [] }
const staleLine = s.agent + "'s last count is from " + when + ', over ' + s.stale_hours + ' hours ago: its scheduled drains (11:40 and 17:40 UTC) may have stopped, or its session ended. Answers wait on the lane until it drains; ask your conductor to check on it.'
let head, detail
if (n) {
  head = n + (n === 1 ? ' new answer' : ' new answers') + ' on the public feedback form (' + total + ' in all)'
  detail = 'Drained into jose-inbox by ' + s.agent + ' at ' + when + '. Ask it for the summary (feedback-summary.mjs); nothing is quoted without the person\\'s tick.' + (stale ? ' ' + staleLine : '')
} else if (stale) {
  head = s.agent + ' has not counted the feedback lane since ' + when
  detail = staleLine
} else {
  head = 'No new answers on the public feedback form (' + total + ' in all)'
  detail = 'From ' + s.agent + "'s count at " + when + '.'
}
if (lost) detail += ' ' + lost + (lost === 1 ? ' answer' : ' answers') + ' could not be opened (sealed to an earlier session key?): ask ' + s.agent + '.'
const warn = full ? 'Warning: ' + left + ' answers are still pending on the lane, and at 1000 it refuses new ones (507). Ask ' + s.agent + ' to drain it now.' : ''
const text = '*WS-74 feedback*\\n' + head + '. ' + detail + (warn ? '\\n\\n*' + warn.replace(':', ':*') : '')
const need = ['to', 'phone_number_id', 'graph_version'].concat(s.mode === 'template' ? ['template_name', 'template_language'] : [])
const missing = need.filter(k => !String(s[k] || '').trim())
if (missing.length) throw new Error('WS-74: fill in the Settings node first: ' + missing.join(', '))
if (!['text', 'template'].includes(s.mode)) throw new Error('WS-74: mode is text or template')
const to = String(s.to).replace(/[^0-9]/g, '')
// the template's two parameters, {{1}} the headline and {{2}} the rest; a parameter may not hold new lines, tabs or more
// than four spaces in a row, and Meta rejects a template that starts or ends with a parameter (people/jose/dev/n8n-build-guide.md, section 4; its sources in section 13)
const flat = t => t.replace(/\\s*\\n+\\s*/g, ' · ').replace(/\\t/g, ' ').replace(/ {2,}/g, ' ').slice(0, 400) // two of these and the fixed text stay under Meta's 1024 characters for a template body
const msg = s.mode === 'text'
  ? { messaging_product: 'whatsapp', recipient_type: 'individual', to, type: 'text', text: { preview_url: false, body: text } }
  : { messaging_product: 'whatsapp', recipient_type: 'individual', to, type: 'template', template: { name: s.template_name, language: { code: s.template_language }, components: [{ type: 'body', parameters: [{ type: 'text', text: flat(head) }, { type: 'text', text: flat(detail + (warn ? ' ' + warn : '')) }] }] } }
return [{ json: { state, total, text, url: 'https://graph.facebook.com/' + s.graph_version + '/' + s.phone_number_id + '/messages', body: msg } }]`

export const REMEMBER = `// Remember the note: only after Meta accepted it, so a failed send is tried again at the next run.
// n8n keeps static data for runs of the published workflow, not for manual test runs.
const d = $('Draft the note').first().json, s = $getWorkflowStaticData('global')
s.last_state = d.state
s.last_total = d.total
return $input.all()`

export function workflow() {
    const node = (name, type, typeVersion, x, parameters, extra = {}) => ({ parameters, id: 'ws74-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name, type, typeVersion, position: [x, 300], ...extra })
    const code = (name, x, jsCode) => node(name, 'n8n-nodes-base.code', 2, x, { jsCode })
    const names = ['Every 30 minutes, 07:15 to 22:45 UTC', 'Settings', "Get the vault agent's count", 'Draft the note', 'Send to Jose', 'Remember the note']
    const nodes = [
        node(names[0], 'n8n-nodes-base.scheduleTrigger', 1.2, 0, { rule: { interval: [{ field: 'cronExpression', expression: CRON }] } }),
        code(names[1], 220, SETTINGS),
        node(names[2], 'n8n-nodes-base.httpRequest', 4.2, 440, {
            method: 'GET', url: '={{ $json.count_url }}',
            options: { response: { response: { fullResponse: true, neverError: true, responseFormat: 'text' } } },
        }),
        code(names[3], 660, NOTE),
        node(names[4], 'n8n-nodes-base.httpRequest', 4.2, 880, {
            method: 'POST', url: '={{ $json.url }}', authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth',
            sendBody: true, specifyBody: 'json', jsonBody: '={{ JSON.stringify($json.body) }}', options: {},
        }, { credentials: { httpHeaderAuth: { id: '', name: '' } } }),
        code(names[5], 1100, REMEMBER),
    ]
    const connections = Object.fromEntries(names.slice(0, -1).map((n, i) => [n, { main: [[{ node: names[i + 1], type: 'main', index: 0 }]] }]))
    return {
        name: 'WS-74: new feedback answers, from the vault agent\'s count, a note to Jose',
        nodes, connections, active: false,
        settings: { executionOrder: 'v1', timezone: 'UTC', saveDataSuccessExecution: 'none' },
        meta: { note: 'From people/jose/automation/WS-74-pending.build.mjs (automation@web-summit.jose). Reads only the vault agent\'s public count, never the lane and never an enum key (Jose, 5 November 2026). To Jose only. Fill in the Settings node and the WhatsApp credential (people/jose/automation/README.md, "WS-74: to fill in n8n").' },
    }
}

export const render = () => JSON.stringify(workflow(), null, 2) + '\n'

if (import.meta.url === `file://${process.argv[1]}`) { fs.writeFileSync(OUT, render()); console.log('wrote ' + path.relative(process.cwd(), OUT)) }
