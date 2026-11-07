// /people/silvio/eventos/: the side events of Web Summit 2026 week, for the team, in Portuguese and English (Silvio's ask,
// 7 November 2026), by outreach@web-summit.silvio. Built from events.json and themes.json; called from people/silvio/pages.mjs.
import fs from 'node:fs'
import path from 'node:path'

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const L = (pt, en) => `<span lang="pt">${pt}</span><span lang="en">${en}</span>`
const DAYS = { '2026-11-06': ['Sex', 'Fri', 'Sexta', 'Friday'], '2026-11-07': ['Sáb', 'Sat', 'Sábado', 'Saturday'], '2026-11-08': ['Dom', 'Sun', 'Domingo', 'Sunday'], '2026-11-09': ['Seg', 'Mon', 'Segunda', 'Monday'], '2026-11-10': ['Ter', 'Tue', 'Terça', 'Tuesday'], '2026-11-11': ['Qua', 'Wed', 'Quarta', 'Wednesday'], '2026-11-12': ['Qui', 'Thu', 'Quinta', 'Thursday'], '2026-11-13': ['Sex', 'Fri', 'Sexta', 'Friday'], '2026-11-14': ['Sáb', 'Sat', 'Sábado', 'Saturday'] }
const WORLDS = { 'Turismo e Algarve': 'Tourism and the Algarve', 'Portugal e Brasil': 'Portugal and Brazil', 'IA e agentes': 'AI and agents', 'Investidores': 'Investors', 'Criadores e media': 'Creators and media' }
const STATUS = { 'sold-out': ['Esgotado', 'Sold out'], closed: ['Inscrições fechadas', 'Registration closed'], postponed: ['Adiado', 'Postponed'] }
const dnum = d => String(Number(d.slice(-2)))
const plat = u => { const h = String(u || '').replace(/^https?:\/\/(www\.)?/, '').split('/')[0]; return ({ 'luma.com': 'Luma', 'lu.ma': 'Luma', 'meetup.com': 'Meetup', 'fienta.com': 'Fienta', 'b2match.com': 'b2match' })[h] || (h.includes('eventbrite') ? 'Eventbrite' : (h ? L('site do organizador', 'organiser\'s site') : '')) }
const part = t => { const h = /^(\d{2})/.exec(t || ''); if (!h) return 0; const n = +h[1]; return n < 12 ? 1 : n < 18 ? 2 : 3 }
const PARTS = [['Todo o dia', 'All day'], ['Manhã', 'Morning'], ['Tarde', 'Afternoon'], ['Noite', 'Evening']]

const CSS = `<style>
.evp{--ink:#1b2328;--soft:#66727a;--line:#e3e6e8;--card:#ffffff;--ac:#0b6e69;--red:#b4432a;color:var(--ink)}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .evp{--ink:#e6ecef;--soft:#98a5ad;--line:#2c373f;--card:#1a2228;--ac:#4cc3b8;--red:#ec8b72}}
:root[data-theme=dark] .evp{--ink:#e6ecef;--soft:#98a5ad;--line:#2c373f;--card:#1a2228;--ac:#4cc3b8;--red:#ec8b72}
.evp [lang=en]{display:none}.evp.en [lang=en]{display:inline}.evp.en [lang=pt]{display:none}
.evp .langs{display:flex;gap:6px;margin:0 0 12px}.evp .langs button{border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:99px;padding:3px 12px;font:inherit;cursor:pointer}.evp .langs button[aria-pressed=true]{background:var(--ac);border-color:var(--ac);color:#fff}
.evp .lead{color:var(--soft);max-width:62ch;font-size:1.05rem}
.evp .stats{display:flex;flex-wrap:wrap;gap:28px;margin:12px 0 24px}.evp .stats b{display:block;font-size:1.6rem}.evp .stats span{color:var(--soft);font-size:.9rem}
.evp h2{margin:2rem 0 .8rem}
.evp .week{display:grid;gap:8px}.evp .week div{display:grid;grid-template-columns:80px 1fr;gap:12px;padding:10px 14px;background:var(--card);border:1px solid var(--line);border-radius:8px}.evp .week span{color:var(--soft)}.evp .week .us{border-color:var(--ac)}.evp .week .us b{color:var(--ac)}
.evp .themes{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:14px}
.evp .theme{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px 18px;min-width:0}.evp .theme h3{margin:0;font-size:1.05rem}.evp .who{color:var(--soft);font-size:.9rem;margin:4px 0 12px}.evp .who b{color:var(--ink)}
.evp .theme ol{margin:0;padding:0;list-style:none;display:grid;gap:10px}.evp .theme li{display:grid;grid-template-columns:96px 1fr;column-gap:10px}.evp .pd{color:var(--soft);font-size:.88rem;grid-row:span 2;font-variant-numeric:tabular-nums}.evp .theme a{color:var(--ink);font-weight:600;text-decoration:none}.evp .theme a:hover{color:var(--ac)}.evp .pw{color:var(--soft);font-size:.88rem}
.evp .tools{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:12px}.evp .tools input,.evp .tools select{flex:1 1 220px;padding:8px 12px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink);font:inherit}
.evp .tabs{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px}.evp .tab{flex:0 0 auto;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:10px;padding:6px 12px;font:inherit;cursor:pointer;display:grid;justify-items:center;min-width:62px}.evp .tab small{color:var(--soft);font-size:.72rem}.evp .tab b{font-size:1.1rem}.evp .tab[aria-selected=true]{background:var(--ac);border-color:var(--ac);color:#fff}.evp .tab[aria-selected=true] small{color:#fff}
.evp .panel h3{font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;color:var(--soft);margin:20px 0 4px}
.evp ul.evs{list-style:none;margin:0;padding:0}.evp .ev{display:grid;grid-template-columns:100px 1fr;gap:12px;padding:12px 0;border-top:1px solid var(--line)}.evp .tm{color:var(--soft);font-size:.9rem;font-variant-numeric:tabular-nums}
.evp .nm{margin:0;font-weight:600}.evp .mt{margin:2px 0 0;color:var(--soft);font-size:.9rem}.evp .ac{margin:6px 0 0;display:flex;flex-wrap:wrap;gap:14px;font-size:.85rem}.evp .ac a{color:var(--ac);font-weight:600;text-decoration:none}
.evp .gone{color:var(--red);font-weight:600}.evp .appr{color:var(--soft)}
.evp .note{color:var(--soft);font-size:.85rem;margin-top:2rem;border-top:1px solid var(--line);padding-top:12px}
@media(max-width:560px){.evp .ev,.evp .week div,.evp .theme li{grid-template-columns:1fr;gap:2px}.evp .pd{grid-row:auto}.evp .themes{grid-template-columns:1fr}}
</style>`

export function eventos(ROOT) {
    const dir = path.join(ROOT, 'people/silvio/eventos')
    const D = JSON.parse(fs.readFileSync(path.join(dir, 'events.json'), 'utf8')), T = JSON.parse(fs.readFileSync(path.join(dir, 'themes.json'), 'utf8'))
    for (const e of D.events) if (e.register) e.register = e.register.replace(/~([0-9a-z]+)/, (_, x) => String(parseInt(x, 36)))   // long ids kept in base 36 (see events.json about)
    const E = D.events, days = [...new Set(E.map(e => e.day))].sort(), start = '2026-11-09'
    const find = k => E.find(e => e.name.toLowerCase().includes(k.toLowerCase()))
    const time = e => e.time || L('todo o dia', 'all day')
    const status = e => STATUS[e.status] ? `<span class="gone">${L(...STATUS[e.status])}</span>` : ''
    const appr = e => e.approval ? `<span class="appr">🔒 ${L('precisa de aprovação', 'needs approval')}</span>` : ''
    const dd = d => L(`${DAYS[d][0]} ${dnum(d)}`, `${DAYS[d][1]} ${dnum(d)}`)
    const picks = T.themes.map(t => `<section class="theme"><h3>${L(esc(t.pt), esc(t.en))}</h3><p class="who">${L(esc(t.dpt), esc(t.den))} ${L('Bom para', 'Good for')}: <b>${L(esc(t.for.pt), esc(t.for.en))}</b></p><ol>${t.picks.map(([k, wpt, wen]) => { const e = find(k); return e ? `<li><span class="pd">${dd(e.day)} · ${esc((e.time || '').split('-')[0])}</span><a href="${esc(e.register)}">${esc(e.name)}</a><span class="pw">${L(esc(wpt), esc(wen))}${e.approval ? ' · 🔒' : ''} ${status(e)}</span></li>` : '' }).join('')}</ol></section>`).join('')
    const week = T.week.map(w => `<div${w.us ? ' class="us"' : ''}><b>${dd(w.day)}</b><span>${L(esc(w.pt), esc(w.en))}</span></div>`).join('')
    const item = e => `<li class="ev" data-w="${esc(e.worlds.join('|'))}" data-s="${esc(`${e.name} ${e.venue} ${e.organiser}`.toLowerCase())}"><span class="tm">${time(e)}</span><div><p class="nm">${esc(e.name)}</p><p class="mt">${[e.venue, e.organiser, e.price].filter(Boolean).map(esc).join(' · ')}</p><p class="ac">${e.register ? `<a href="${esc(e.register)}">${L('Inscrição', 'Register')} · ${plat(e.register)}</a>` : ''}${e.promptugal ? `<a href="${esc(e.promptugal)}">PromptUGAL</a>` : ''}${appr(e)}${status(e)}</p></div></li>`
    const tabs = days.map(d => `<button type="button" class="tab" data-d="${d}" aria-selected="${d === start}"><small>${L(DAYS[d][0], DAYS[d][1])}</small><b>${dnum(d)}</b><small>${E.filter(e => e.day === d).length}</small></button>`).join('')
    const panels = days.map(d => { const v = E.filter(e => e.day === d); return `<section class="panel" data-d="${d}"${d === start ? '' : ' hidden'}><h2>${L(`${DAYS[d][2]}, ${dnum(d)} de novembro`, `${DAYS[d][3]} ${dnum(d)} November`)}${d === '2026-11-12' ? L(' · a nossa banca', ' · our stand') : ''}</h2>${PARTS.map((p, i) => { const g = v.filter(e => part(e.time) === i); return g.length ? `<h3>${L(...p)}</h3><ul class="evs">${g.map(item).join('')}</ul>` : '' }).join('')}</section>` }).join('')
    const n = E.length, nA = E.filter(e => e.approval).length, busiest = Math.max(...days.map(d => E.filter(e => e.day === d).length))
    const body = `<div class="evp" id="evp">
<div class="langs" role="group" aria-label="Language"><button type="button" data-l="pt" aria-pressed="true">PT</button><button type="button" data-l="en" aria-pressed="false">EN</button></div>
<p class="lead">${L('Para a equipa RiskMandate e PromptUGAL: jantares, encontros de investidores, pequenos-almoços, conversas e festas na semana da Web Summit, em Lisboa e no Algarve. Horas de Lisboa. Cada evento liga à sua página de inscrição.', 'For the RiskMandate and PromptUGAL team: dinners, investor meetups, breakfasts, talks and parties in Web Summit week, in Lisbon and the Algarve. Lisbon time. Each event links to its registration page.')}</p>
<div class="stats"><div><b>${n}</b><span>${L('eventos, 6 a 14 de novembro', 'events, 6 to 14 November')}</span></div><div><b>${nA}</b><span>${L('precisam de aprovação: o organizador escolhe quem entra', 'need approval: the organiser chooses who gets in')}</span></div><div><b>${busiest}</b><span>${L('na terça, o dia mais cheio', 'on Tuesday, the busiest day')}</span></div></div>
<h2 id="week">${L('A semana numa olhada', 'The week at a glance')}</h2><div class="week">${week}</div>
<h2 id="picks">${L('Escolhas para a equipa', 'Picks for the team')}</h2><p class="lead">${L('Os eventos que mais interessam a cada parte do trabalho da equipa. É uma sugestão: o resto está na lista completa.', 'The events that matter most to each part of the team\'s work. A suggestion: everything else is in the full list.')}</p><div class="themes">${picks}</div>
<h2 id="all">${L('Todos os eventos, dia a dia', 'All events, day by day')}</h2>
<div class="tools"><input id="evp-q" aria-label="Search" placeholder="Procurar / Search"><select id="evp-w" aria-label="Theme"><option value="">Todos os temas / All themes</option>${Object.entries(WORLDS).map(([pt, en]) => `<option value="${esc(pt)}">${esc(pt)} / ${esc(en)}</option>`).join('')}</select></div>
<div class="tabs" role="tablist">${tabs}</div>
${panels}
<p class="note">${L('Fontes: a página de inscrição de cada evento (Luma, Eventbrite, Meetup e outras) e os eventos da semana no PromptUGAL. Lista de partida: "Web Summit Lisbon 2026 Side Events", do iProxy, lida a 6 de novembro. Os temas são marcados automaticamente e podem falhar. O programa oficial (palcos, Night Summit) está no PromptUGAL. Preços, horas e vagas mudam: confirma na inscrição.', 'Sources: each event\'s registration page (Luma, Eventbrite, Meetup and others) and PromptUGAL\'s events of the week. Starting list: "Web Summit Lisbon 2026 Side Events" by iProxy, read on 6 November. Themes are tagged automatically and may be wrong. The official programme (stages, Night Summit) is on PromptUGAL. Prices, times and places change: check the registration page.')} <a href="https://promptugal.news/events/">PromptUGAL</a> · <a href="https://iproxy.online/blog/web-summit-2026-side-events/">iProxy</a></p>
<script>(function(){var r=document.getElementById('evp'),q=document.getElementById('evp-q'),w=document.getElementById('evp-w'),day='${start}';
function lang(l){r.classList.toggle('en',l==='en');r.querySelectorAll('.langs button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.l===l))});try{localStorage.setItem('evp-lang',l)}catch(e){}}
try{var s=localStorage.getItem('evp-lang');if(s)lang(s)}catch(e){}
r.querySelectorAll('.langs button').forEach(function(b){b.onclick=function(){lang(b.dataset.l)}});
function show(){var s=q.value.trim().toLowerCase(),t=w.value;r.querySelectorAll('.panel').forEach(function(p){var on=p.dataset.d===day;p.hidden=!on;if(!on)return;p.querySelectorAll('.ev').forEach(function(e){e.hidden=!((!t||e.dataset.w.split('|').indexOf(t)>=0)&&(!s||e.dataset.s.indexOf(s)>=0))});p.querySelectorAll('h3').forEach(function(h){h.hidden=![].some.call(h.nextElementSibling.children,function(e){return !e.hidden})})})}
r.querySelectorAll('.tab').forEach(function(b){b.onclick=function(){day=b.dataset.d;r.querySelectorAll('.tab').forEach(function(x){x.setAttribute('aria-selected',String(x===b))});show()}});q.oninput=show;w.onchange=show})();</script>
</div>`
    const md = `Side events of Web Summit Lisbon 2026 week, for the team / Eventos paralelos da semana da Web Summit, para a equipa. ${n} events, 6 to 14 November, Lisbon time. ${D.about}\n\n## Picks for the team / Escolhas para a equipa\n\n${T.themes.map(t => `### ${t.en} / ${t.pt}\n\nGood for / Bom para: ${t.for.en}\n\n${t.picks.map(([k, , wen]) => { const e = find(k); return e ? `- ${e.day} ${e.time || 'all day'}: [${e.name}](${e.register}). ${wen}${e.approval ? ' (needs approval)' : ''}` : '' }).filter(Boolean).join('\n')}`).join('\n\n')}\n\n## All events / Todos os eventos\n\n${days.map(d => `### ${DAYS[d][3]} ${dnum(d)} November\n\n${E.filter(e => e.day === d).map(e => `- ${e.time || 'all day'}: [${e.name}](${e.register || e.promptugal}), ${e.venue}${e.organiser ? `, ${e.organiser}` : ''}${e.price ? `, ${e.price}` : ''}${e.approval ? ', needs approval' : ''}${e.status ? `, ${e.status}` : ''}`).join('\n')}`).join('\n\n')}\n`
    return { rel: 'people/silvio/eventos/index.html', title: 'Fora da Web Summit / Outside Web Summit', description: `${n} side events in Web Summit 2026 week, in Lisbon and the Algarve, with the team's picks; in Portuguese and English.`, body, md, head: CSS }
}
