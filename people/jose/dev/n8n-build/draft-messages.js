// n8n Code node "Draft the messages" (JavaScript, Run Once for All Items). No network: the HTTP Request node before it
// fetched the report's markdown as Text into "data"; the report's id and link come from "Find the newest report".
const r = $('Find the newest report').first().json
const md = String($input.first().json.data || '')
const section = md.split(/^## /m).find(s => /^What happened/.test(s)) || ''
const points = [...section.matchAll(/^\d+\.\s+\*\*(.+?)\*\*/gm)].map(m => m[1].trim().replace(/[.:;,]+$/, ''))
const [, y, mo, d, hh, mm] = r.id.match(/^(\d{4})-(\d{2})-(\d{2})-(\d{2})(\d{2})$/)
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const day = `${DAYS[new Date(Date.UTC(+y, +mo - 1, +d)).getUTCDay()]} ${+d} ${MONTHS[+mo - 1]}`, time = `${hh}:${mm}`
// a report without numbered points falls back to its summary, then its title
const top = points.length ? points.slice(0, 3) : [(r.summary || r.title).replace(/[.:;,]+$/, '')], more = points.length - Math.min(points.length, 3)
// 1. free text, for the WhatsApp node's Send (only within 24 hours of Jose's last message to the number)
const text_whatsapp = [`*RiskMandate team · ${time} report*`, `${day} · stand-ups 13:00 and 18:00`, '',
  ...top.map(p => `▸ *${p}*`), '', more > 0 ? `+${more} more: ${r.link}` : r.link].join('\n').slice(0, 1000)
// 2. the two parameters of the approved template (Send Template): no new lines, tabs or runs of spaces in a parameter
const flat = s => s.replace(/\s+/g, ' ').trim()
const template_when = flat(`${day}, ${time}`)
const template_points = flat(`${top.join('; ')}${more > 0 ? `; and ${more} more` : ''}. Read it at ${r.link}`).slice(0, 900)
// 3. Slack mrkdwn, for later (route 4)
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const text_slack = [`*RiskMandate team · ${time} report*`, `${day} · stand-ups 13:00 and 18:00`, '',
  ...top.map(p => `• *${esc(p)}*`), '', `<${r.link}|${more > 0 ? `+${more} more in the full report` : 'Read the report'}>`].join('\n')
return [{ json: { id: r.id, title: r.title, link: r.link, text_whatsapp, template_when, template_points, text_slack } }]
