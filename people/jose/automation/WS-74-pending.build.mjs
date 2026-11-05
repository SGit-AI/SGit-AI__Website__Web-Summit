#!/usr/bin/env node
// WS-74-pending.build.mjs: writes WS-74-pending.n8n.json, the n8n workflow for the n8n side of WS-74: how many answers
// are waiting on vault@web-summit.jose's feedback lane, as a note to Jose only (automation@web-summit.jose, 4 November
// 2026). Run after changing this file; WS-74-pending.test.mjs checks that the JSON is what this script makes.
//   node people/jose/automation/WS-74-pending.build.mjs
// The workflow holds no number, token, enum key, chat id or credential: "Settings" has empty fields and both HTTP nodes
// an empty credential, filled in inside n8n (people/jose/automation/README.md, "WS-74: to fill in n8n").
// The append lane API (https://sgit.ai/api/append-lanes.md, read 4 November 2026): POST <host>/api/vault/append/list/<vault>
// with the header x-sgraph-vault-enum-key; pages of 50, cursor after_file_id, `truncated` while more remain; each entry's
// `inbox` is the lane's append token; at most 1000 pending per token (507 after that); a bad key returns 404 (HTML).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(here, 'WS-74-pending.n8n.json')

// Three times a day, 40 minutes before each stand-up (13:00 and 18:00 UTC) and once in the morning.
export const CRON = '20 7,12,17 * * *'
export const MAX_PAGES = 25 // 25 pages of 50 = 1250, more than the lane's 1000 pending

export const SETTINGS = `// Settings: fill these in n8n, never in the repository (people/jose/automation/README.md, "WS-74: to fill in n8n").
const s = $getWorkflowStaticData('global')
return [{ json: {
  last: s.last || '',         // what the last note said (a count, or 'stale'); kept by "Remember the note"
  site: 'https://web-summit.sgit.ai/',
  agent: 'vault@web-summit.jose', // whose lane: the entry in the site's assets/feedback.json lanes[]
  host: 'https://dev.send.sgraph.ai', // the only server the enum key is ever sent to; a lane on any other host stops the run
  warn_at: 800,               // say so loudly from here: at 1000 pending the lane refuses new answers (507)
  mode: 'text',               // 'text' (needs Jose to have messaged the number in the last 24 h) or 'template'
  to: '',                     // FILL IN: Jose's own WhatsApp number, digits with country code, only Jose
  phone_number_id: '',        // FILL IN: the business number's Phone number ID (Meta app, WhatsApp, API setup)
  graph_version: '',          // FILL IN: the Graph API version your Meta app uses, e.g. v23.0
  template_name: '',          // FILL IN for mode 'template': an approved Utility template with two body parameters and fixed text around them, e.g. "RiskMandate feedback inbox (WS-74): {{1}}. {{2}} This note goes to Jose only." (people/jose/automation/README.md)
  template_language: '',      // FILL IN for mode 'template': its language code, e.g. en
} }]`

// The lane is read from the live site, not written here, so a new token or vault (a new vault session) is followed. The
// site is fetched by an HTTP Request node: since n8n 2.0 Code nodes run on task runners and are kept to pure logic
// (people/jose/dev/n8n-build-guide.md, section 2).
export const FIND = `// Find the lane: the agent's entry in the site's public assets/feedback.json (host, vault id, append token: all public).
const s = $('Settings').first().json, r = $input.first().json
const url = s.site + 'assets/feedback.json'
const cfg = typeof r.data === 'string' ? JSON.parse(r.data) : (r.data && typeof r.data === 'object' ? r.data : r)
const lane = (cfg.lanes || [cfg]).find(l => l.agent === s.agent)
if (!lane) throw new Error('WS-74: no lane for ' + s.agent + ' in ' + url)
if (lane.host !== s.host) throw new Error('WS-74: the lane in ' + url + ' is on ' + lane.host + ', not ' + s.host + ': the enum key goes nowhere else (change host in Settings if the lane really moved)')
if (!/^[a-z0-9]+$/.test(lane.vault_id) || !/^[0-9a-f]{16,128}$/.test(lane.append_token)) throw new Error('WS-74: the lane in ' + url + ' does not look right')
return [{ json: { agent: lane.agent, vault_id: lane.vault_id, append_token: lane.append_token, url: lane.host + '/api/vault/append/list/' + lane.vault_id } }]`

// One note, or nothing. Every page the HTTP node fetched is one item ({ statusCode, body }).
export const NOTE = `// Draft the note: count what is pending on the lane; nothing new to say means no items, so nothing is sent.
const s = $('Settings').first().json, lane = $('Find the lane').first().json
const pages = $input.all().map(i => i.json)
const bad = pages.find(p => p.statusCode !== 200)
let state, head, detail, warn = ''
if (bad && (bad.statusCode === 404 || bad.statusCode === 401 || bad.statusCode === 403)) {
  state = 'stale'
  head = 'n8n could not list ' + lane.agent + "'s lane (" + bad.statusCode + ')'
  detail = 'The enum key in n8n is no longer the lane\\'s, usually because a new vault session made a new one. Ask vault@web-summit.jose for the new key and update the n8n credential "WS-74 lane enum key". Nothing was lost: answers stay pending until drained.'
} else if (bad) {
  throw new Error('WS-74: listing the lane returned ' + bad.statusCode)
} else {
  const body = p => typeof p.body === 'string' ? JSON.parse(p.body) : (p.body || {})
  const entries = pages.flatMap(p => body(p).entries || [])
  // every pending file on the vault, whatever its lane: answers sent under an earlier token (before a new vault session)
  // are drained too (feedback_drain.py takes every lane it holds), so they count; the 507 limit is per lane, the site's one
  const all = new Map(entries.map(e => [e.file_id, e.inbox]))
  const n = all.size, onLane = [...all.values()].filter(t => t === lane.append_token).length
  const more = !!body(pages[pages.length - 1]).truncated
  state = String(n) + (more ? '+' : '')
  if (n === 0) state = '0'
  const was = /^\\d+\\+?$/.test(s.last) && s.last !== '0' ? ' (was ' + s.last.replace('+', ' or more') + ' at the last note)' : ''
  head = (more ? 'At least ' : '') + n + (n === 1 ? ' answer is' : ' answers are') + ' waiting on ' + lane.agent + "'s vault" + (onLane !== n ? ' (' + onLane + ' on the lane the site uses now)' : '') + was
  detail = 'vault@web-summit.jose drains them into jose-inbox; feedback-summary.mjs makes the summary a person reads, and nothing is quoted without the person\\'s tick.'
  if (onLane >= s.warn_at) warn = 'Warning: at 1000 pending the lane refuses new answers (507). Ask vault@web-summit.jose to drain it now.'
}
const text = '*WS-74 feedback lane*\\n' + head + '. ' + detail + (warn ? '\\n\\n*' + warn.replace(':', ':*') : '')
// say something only when it changed; an empty lane (after a drain) is remembered without a note, so the next answers
// are reported even if their count equals the last note's
if (state === '0') { $getWorkflowStaticData('global').last = '0'; return [] }
if (state === s.last) return []
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
return [{ json: { state, text, url: 'https://graph.facebook.com/' + s.graph_version + '/' + s.phone_number_id + '/messages', body: msg } }]`

export const REMEMBER = `// Remember the note: only after Meta accepted it, so a failed send is tried again at the next run.
// n8n keeps static data for runs of the published workflow, not for manual test runs.
$getWorkflowStaticData('global').last = $('Draft the note').first().json.state
return $input.all()`

export function workflow() {
    const node = (name, type, typeVersion, x, parameters, extra = {}) => ({ parameters, id: 'ws74-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name, type, typeVersion, position: [x, 300], ...extra })
    const code = (name, x, jsCode) => node(name, 'n8n-nodes-base.code', 2, x, { jsCode })
    const names = ['07:20, 12:20 and 17:20 UTC', 'Settings', "Get the site's lanes", 'Find the lane', 'List the lane', 'Draft the note', 'Send to Jose', 'Remember the note']
    const nodes = [
        node(names[0], 'n8n-nodes-base.scheduleTrigger', 1.2, 0, { rule: { interval: [{ field: 'cronExpression', expression: CRON }] } }),
        code(names[1], 220, SETTINGS),
        node(names[2], 'n8n-nodes-base.httpRequest', 4.2, 440, {
            method: 'GET', url: "={{ $json.site + 'assets/feedback.json' }}", options: { response: { response: { responseFormat: 'text' } } },
        }),
        code(names[3], 660, FIND),
        node(names[4], 'n8n-nodes-base.httpRequest', 4.2, 880, {
            method: 'POST', url: '={{ $json.url }}', authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth',
            sendBody: true, specifyBody: 'json', jsonBody: '={{ JSON.stringify({ include_content: false }) }}',
            options: {
                response: { response: { fullResponse: true, neverError: true } },
                pagination: { pagination: {
                    paginationMode: 'updateAParameterInEachRequest',
                    parameters: { parameters: [{ type: 'body', name: 'after_file_id', value: '={{ ($response.body.entries || []).slice(-1)[0]?.file_id }}' }] },
                    paginationCompleteWhen: 'other', completeExpression: '={{ $response.statusCode !== 200 || !$response.body.truncated || !($response.body.entries || []).length }}',
                    limitPagesFetched: true, maxRequests: MAX_PAGES,
                } },
            },
        }, { credentials: { httpHeaderAuth: { id: '', name: '' } } }),
        code(names[5], 1100, NOTE),
        node(names[6], 'n8n-nodes-base.httpRequest', 4.2, 1320, {
            method: 'POST', url: '={{ $json.url }}', authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth',
            sendBody: true, specifyBody: 'json', jsonBody: '={{ JSON.stringify($json.body) }}', options: {},
        }, { credentials: { httpHeaderAuth: { id: '', name: '' } } }),
        code(names[7], 1540, REMEMBER),
    ]
    const connections = Object.fromEntries(names.slice(0, -1).map((n, i) => [n, { main: [[{ node: names[i + 1], type: 'main', index: 0 }]] }]))
    return {
        name: 'WS-74: answers waiting on Jose\'s feedback lane, a note to Jose',
        nodes, connections, active: false,
        settings: { executionOrder: 'v1', timezone: 'UTC', saveDataSuccessExecution: 'none' },
        meta: { note: 'From people/jose/automation/WS-74-pending.build.mjs (automation@web-summit.jose). Counts only, never content; to Jose only. Fill in the Settings node and the two credentials (people/jose/automation/README.md, "WS-74: to fill in n8n").' },
    }
}

export const render = () => JSON.stringify(workflow(), null, 2) + '\n'

if (import.meta.url === `file://${process.argv[1]}`) { fs.writeFileSync(OUT, render()); console.log('wrote ' + path.relative(process.cwd(), OUT)) }
