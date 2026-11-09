// /people/silvio/riskmandate-explicado/: how RiskMandate helps with the problems companies report, as one page in the
// X-ray's visual language (dark stage, teal mandate, rose gap, gold accents, monospace labels, a step-by-step
// simulation). Portuguese first, English on a switch. By conductor@web-summit.silvio, 8 November 2026, at Silvio's word.
// Generic on purpose: no company is named (the cases behind it are internal, sealed to the team). RiskMandate is described
// only in riskmandate.ai's words: it "measures what your agents can actually reach, evidences the controls that contain
// them, prices the exposure, and produces that record", and is "never in the request path: read-only by design". So the
// simulation shows actions placed against the mandate, never RiskMandate blocking one.
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
// a text in both languages: shown in Portuguese, switched by explica.js
const T = (pt, en, tag = 'span', cls = '') => `<${tag}${cls ? ` class="${cls}"` : ''} data-pt="${esc(pt)}" data-en="${esc(en)}">${esc(pt)}</${tag}>`

const CSS = `<style>
.xe{--bg:#070d1a;--bg2:#0b1020;--panel:#0d1730;--line:#1e2b4a;--line2:#2c3d63;--ink:#e8eefc;--soft:#93a3c4;--cyan:#5eead4;--mandate:#2dd4bf;--gap:#fb7185;--gold:#fbbf24;--blue:#3c5590;
background:radial-gradient(1200px 600px at 20% -10%,#0f2a3a 0,transparent 60%),var(--bg);color:var(--ink);border-radius:22px;padding:22px;border:1px solid var(--line);font-size:16px}
.xe .bar{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.xe .brand{font:600 13px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;color:var(--soft)}.xe .brand b{color:var(--cyan)}
.xe .brand i{display:inline-block;width:10px;height:10px;border-radius:50%;border:2px solid var(--cyan);box-shadow:0 0 10px var(--cyan);margin-right:8px;vertical-align:-1px}
.xe button{font:inherit;cursor:pointer;border-radius:12px;padding:8px 14px;border:1px solid var(--line2);background:var(--panel);color:var(--ink)}
.xe button.on,.xe button.go{background:linear-gradient(180deg,#5eead4,#14b8a6);color:#04201c;border-color:transparent;font-weight:700}
.xe h1x{display:block;font-size:clamp(1.6rem,4vw,2.6rem);line-height:1.15;font-weight:800;margin:22px 0 8px}
.xe .lead{color:var(--soft);max-width:60rem;margin:0}
.xe .sec{margin-top:34px}.xe .sec>h2x{display:block;font-size:1.35rem;font-weight:800;margin:0 0 4px}.xe .sec>.k{font:600 12px ui-monospace,monospace;letter-spacing:.14em;color:var(--cyan);text-transform:uppercase}
.xe .stage{background:var(--bg2);border:1px solid var(--line);border-radius:18px;padding:14px}
.xe svg{width:100%;height:auto;display:block}.xe svg text{font-family:inherit}
.xe .sim{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:16px}@media(max-width:780px){.xe .sim{grid-template-columns:1fr}}
.xe ol.steps{margin:10px 0 0;padding-left:1.3rem}.xe ol.steps li{margin:0 0 10px;opacity:.28;transition:opacity .3s}.xe ol.steps li.lit{opacity:1}
.xe ol.steps .w{display:block;font-size:.82rem;color:var(--soft)}.xe .in{color:var(--mandate);font-weight:700}.xe .out{color:var(--gap);font-weight:700}
.xe .tally{font:600 13px ui-monospace,monospace;color:var(--soft);margin-top:6px}
.xe .five{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}
.xe .five div{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:14px;position:relative;overflow:hidden}
.xe .five div:before{content:"";position:absolute;inset:0 0 auto 0;height:3px;background:var(--c);box-shadow:0 0 14px var(--c)}
.xe .five b{display:block;color:var(--c);font:700 12px ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px}
.xe .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:12px}
.xe .card{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:14px;display:grid;grid-template-columns:64px 1fr;gap:12px;align-items:start}
.xe .card h3{margin:0 0 4px;font-size:1.02rem}.xe .card .p{font-size:.86rem;color:var(--soft);margin:0 0 6px}.xe .card .h{font-size:.92rem;margin:0}
.xe .lvl{font:700 11px ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;color:var(--l)}
.xe .dd{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:12px}
.xe .dd div{border-radius:16px;padding:16px;background:var(--panel);border:1px solid var(--c);box-shadow:inset 0 0 0 1px rgba(255,255,255,.02),0 0 22px -12px var(--c)}
.xe .dd b{display:block;color:var(--c);font:700 12px ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;margin-bottom:8px}
.xe .foot{color:var(--soft);font-size:.82rem;margin-top:26px}
@keyframes xepulse{0%{stroke-dashoffset:40}100%{stroke-dashoffset:0}}.xe .flow{stroke-dasharray:6 10;animation:xepulse 1.4s linear infinite}
@keyframes xeglow{0%,100%{opacity:.55}50%{opacity:1}}.xe .glow{animation:xeglow 2.4s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.xe .flow,.xe .glow{animation:none}}
</style>`

// the simulation's stage: the gap (dashed rose), the mandate (teal), the agent at the centre; the actions are drawn by explica.js
function stage() {
    return `<svg viewBox="0 0 520 520" role="img" aria-label="O mandato do agente dentro do seu alcance; cada ação é colocada dentro do mandato ou na diferença.">
<defs><radialGradient id="xeg" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fb7185" stop-opacity=".10"/><stop offset="1" stop-color="#fb7185" stop-opacity="0"/></radialGradient>
<radialGradient id="xem" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#2dd4bf" stop-opacity=".18"/><stop offset="1" stop-color="#2dd4bf" stop-opacity=".02"/></radialGradient></defs>
<circle cx="260" cy="270" r="215" fill="url(#xeg)" stroke="#fb7185" stroke-width="2" stroke-dasharray="6 8" opacity=".85"/>
<text x="260" y="40" text-anchor="middle" fill="#fb7185" font-size="13" font-weight="700" letter-spacing="2" font-family="ui-monospace,monospace" data-pt="A DIFERENÇA: ALCANCE PARA LÁ DO MANDATO" data-en="THE GAP: REACH BEYOND THE MANDATE">A DIFERENÇA: ALCANCE PARA LÁ DO MANDATO</text>
<circle cx="260" cy="270" r="105" fill="url(#xem)" stroke="#2dd4bf" stroke-width="2.5" class="glow"/>
<text x="260" y="185" text-anchor="middle" fill="#5eead4" font-size="12" font-weight="700" letter-spacing="2" font-family="ui-monospace,monospace" data-pt="O MANDATO" data-en="THE MANDATE">O MANDATO</text>
<g transform="translate(240 250)"><rect x="0" y="6" width="40" height="30" rx="9" fill="#0f1b38" stroke="#5eead4" stroke-width="2"/><circle cx="13" cy="21" r="4" fill="#5eead4"/><circle cx="27" cy="21" r="4" fill="#5eead4"/><line x1="20" y1="6" x2="20" y2="-2" stroke="#5eead4" stroke-width="2"/><circle cx="20" cy="-4" r="3" fill="#fbbf24"/></g>
<g id="xe-dots"></g></svg>`
}

// one record, four readers: a glowing hub and four nodes, with flowing links
function readers() {
    const R = [['Gestão', 'Leadership', 'que agentes temos e que risco correm', 'which agents we run, and their risk', 90, 70], ['Segurança', 'Security', 'que acessos sobram e que barreiras há', 'which access is spare, which barriers hold', 810, 70], ['Auditor e regulador', 'Auditor and regulator', 'a prova do que cada sistema faz', 'evidence of what each system does', 90, 290], ['Seguradora', 'Insurer', 'a exposição, com um preço', 'the exposure, priced', 810, 290]]
    return `<svg viewBox="0 0 900 360" role="img" aria-label="Um registo por agente, lido pela gestão, segurança, auditor e seguradora.">
${R.map(([, , , , x, y]) => `<path d="M450 180 C ${(450 + x) / 2} 180, ${(450 + x) / 2} ${y}, ${x < 450 ? x + 150 : x - 150} ${y}" fill="none" stroke="#2c3d63" stroke-width="2"/><path d="M450 180 C ${(450 + x) / 2} 180, ${(450 + x) / 2} ${y}, ${x < 450 ? x + 150 : x - 150} ${y}" fill="none" stroke="#5eead4" stroke-width="2" class="flow" opacity=".7"/>`).join('')}
<circle cx="450" cy="180" r="74" fill="#0d1730" stroke="#5eead4" stroke-width="3"/><circle cx="450" cy="180" r="90" fill="none" stroke="#5eead4" stroke-width="1" opacity=".35" class="glow"/>
<text x="450" y="172" text-anchor="middle" fill="#e8eefc" font-size="17" font-weight="800" data-pt="O registo" data-en="The record">O registo</text>
<text x="450" y="194" text-anchor="middle" fill="#93a3c4" font-size="12" font-family="ui-monospace,monospace" data-pt="por agente · só leitura" data-en="per agent · read-only">por agente · só leitura</text>
${R.map(([pt, en, spt, sen, x, y]) => { const bx = x < 450 ? 10 : 590; return `<rect x="${bx}" y="${y - 34}" width="300" height="68" rx="14" fill="#0d1730" stroke="#1e2b4a"/><circle cx="${x < 450 ? bx + 300 : bx}" cy="${y}" r="7" fill="#5eead4"/><text x="${bx + 20}" y="${y - 6}" fill="#e8eefc" font-size="16" font-weight="700" data-pt="${esc(pt)}" data-en="${esc(en)}">${esc(pt)}</text><text x="${bx + 20}" y="${y + 18}" fill="#93a3c4" font-size="12.5" data-pt="${esc(spt)}" data-en="${esc(sen)}">${esc(spt)}</text>` }).join('')}
</svg>`
}

// a help gauge: an arc filled to 1, 2 or 3 thirds
function gauge(n, col) {
    const arc = f => { const a = Math.PI * (1 - f), x = 32 + 26 * Math.cos(a), y = 36 - 26 * Math.sin(a); return `M6 36 A26 26 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}` }
    return `<svg viewBox="0 0 64 44" aria-hidden="true"><path d="M6 36 A26 26 0 0 1 58 36" fill="none" stroke="#1e2b4a" stroke-width="7" stroke-linecap="round"/><path d="${arc(n / 3)}" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round"/><text x="32" y="40" text-anchor="middle" fill="${col}" font-size="13" font-weight="800">${n}/3</text></svg>`
}

const PROBLEMS = [
    [3, 'Acessos que ficaram a mais', 'Access left behind', 'Uma conta ou um agente ainda alcança dados que já não está autorizado a ver.', 'An account or an agent still reaches data it is no longer authorised to see.', 'O registo mostra essa diferença, conta a conta e agente a agente, antes de alguém a usar.', 'The record shows that gap, account by account and agent by agent, before anyone uses it.'],
    [3, 'Fornecedores e integrações', 'Suppliers and integrations', 'O risco entra por quem tem acesso indireto: um fornecedor, um conector, uma credencial esquecida.', 'Risk comes in through indirect access: a supplier, a connector, a forgotten credential.', 'Mostra a que cada ligação e cada fornecedor consegue chegar, num só sítio.', 'It shows what each connection and supplier can reach, in one place.'],
    [3, 'Agentes de IA fora do mandato', 'AI agents beyond their mandate', 'Um agente apaga dados, envia informação para fora ou age sem aprovação.', 'An agent deletes data, sends information out or acts without approval.', 'Torna visível, antes, o que o agente consegue fazer além do que lhe pediram, para quem o pode fechar.', 'It makes visible, beforehand, what the agent can do beyond what it was asked, for whoever can close it.'],
    [2, 'Multas e auditorias', 'Fines and audits', 'O regulador pergunta quem autorizou o quê e com que controlos.', 'The regulator asks who authorised what, with which controls.', 'O registo é prova documentada: o que cada sistema faz e que barreiras tem, com evidência.', 'The record is documented evidence: what each system does and which barriers it has.'],
    [2, 'Chatbots que respondem mal', 'Chatbots that answer badly', 'O assistente automático erra ou não resolve, e os clientes queixam-se.', 'The automated assistant gets it wrong or does not solve it, and customers complain.', 'Ajuda a fixar o mandato do chatbot: o que lhe confiar e o que passar a uma pessoa. Não corrige as respostas.', 'It helps set the chatbot\'s mandate: what to trust it with, and what goes to a person. It does not fix the answers.'],
    [1, 'Ransomware e quedas de serviço', 'Ransomware and outages', 'Um ataque cifra ou derruba os sistemas.', 'An attack encrypts or takes down the systems.', 'Não impede o ataque. Mostra que agentes e contas automáticas tocam nos sistemas críticos, e com que barreiras.', 'It does not stop the attack. It shows which agents and automated accounts touch critical systems, and with which barriers.']
]
const LVL = { 3: ['Ajuda muito', 'Helps a lot', '#2dd4bf'], 2: ['Ajuda em parte', 'Helps partly', '#fbbf24'], 1: ['Ajuda pouco', 'Helps a little', '#93a3c4'] }

// the simulation's steps (read by explica.js from data attributes): a generic customer-service agent
const STEPS = [
    ['in', 'Lê o pedido do cliente', 'Reads the customer\'s request', 'email do apoio ao cliente', 'the support inbox'],
    ['in', 'Consulta a encomenda no CRM', 'Looks up the order in the CRM', 'registo de encomendas', 'order records'],
    ['in', 'Responde ao cliente', 'Replies to the customer', 'email de saída', 'outgoing email'],
    ['out', 'Faz um reembolso de 2.000 € sem aprovação', 'Issues a €2,000 refund without approval', 'sistema de pagamentos', 'the payments system'],
    ['out', 'Exporta a lista completa de clientes', 'Exports the full customer list', 'base de dados de clientes', 'the customer database'],
    ['out', 'Apaga ficheiros na pasta partilhada', 'Deletes files in the shared drive', 'ficheiros da empresa', 'company files']
]

export function explica() {
    const five = [['Alcance', 'Reach', '#3c8cf0', 'Tudo o que o agente consegue tocar: sistemas, dados, ações, ligações.', 'Everything the agent can touch: systems, data, actions, connections.'], ['Mandato', 'Mandate', '#2dd4bf', 'O que a empresa o autorizou a fazer: a tarefa, o âmbito, o propósito.', 'What the business authorised it to do: the task, the scope, the purpose.'], ['Diferença', 'Gap', '#fb7185', 'O que consegue fazer mas ninguém pediu. É aqui que está o risco.', 'What it can do but nobody asked for. This is where the risk lives.'], ['Barreiras', 'Barriers', '#fbbf24', 'Os controlos reais que o travam, cada um com prova.', 'The real controls that contain it, each with evidence.'], ['Proveniência', 'Provenance', '#93a3c4', 'Quem é o dono, quem o reviu, que versão está a correr.', 'Who owns it, who reviewed it, which version is running.']]
    const body = `<div class="xe" id="xe">
<div class="bar"><span class="brand"><i></i>RISKMANDATE <b data-pt="EXPLICADO" data-en="EXPLAINED">EXPLICADO</b></span><span><button type="button" class="on" data-lang="pt">PT</button> <button type="button" data-lang="en">EN</button></span></div>
${T('A RiskMandate não apaga fogos. Mostra onde está a gasolina.', 'RiskMandate does not put out fires. It shows where the fuel is.', 'h1x')}
${T('Nas palavras de riskmandate.ai: mede o que os agentes conseguem realmente alcançar, prova os controlos que os contêm, põe um preço na exposição e produz esse registo. Só lê: nunca está no caminho das operações, por isso nunca bloqueia nada.', 'In riskmandate.ai\'s words: it measures what your agents can actually reach, evidences the controls that contain them, prices the exposure, and produces that record. Read-only: never in the request path, so it never blocks anything.', 'p', 'lead')}

<div class="sec">${T('01 · A simulação', '01 · The simulation', 'span', 'k')}${T('Cada ação de um agente, colocada contra o seu mandato', 'Each action of an agent, placed against its mandate', 'h2x')}
${T('Um agente de apoio ao cliente, ilustrativo. Carrega em Play: as ações dentro do mandato ficam no círculo; as que ele consegue fazer mas ninguém pediu caem na diferença. A RiskMandate não as trava: regista-as e mostra-as, antes.', 'An illustrative customer-service agent. Press Play: actions inside the mandate stay in the circle; those it can do but nobody asked for fall in the gap. RiskMandate does not stop them: it records them and shows them, beforehand.', 'p', 'lead')}
<div class="sim" style="margin-top:12px"><div class="stage">${stage()}</div>
<div class="stage"><div><button type="button" class="go" id="xe-play">▶ Play</button> <button type="button" id="xe-step" data-pt="Passo" data-en="Step">Passo</button> <button type="button" id="xe-reset">↺ <span data-pt="Recomeçar" data-en="Restart">Recomeçar</span></button></div>
<ol class="steps" id="xe-steps">${STEPS.map(([k, pt, en, wpt, wen]) => `<li data-k="${k}">${T(pt, en, 'b')}<span class="w">${T('alcança: ' + wpt, 'reaches: ' + wen)} · <span class="${k}">${T(k === 'in' ? 'dentro do mandato' : 'na diferença', k === 'in' ? 'inside the mandate' : 'in the gap')}</span></span></li>`).join('')}</ol>
<div class="tally" id="xe-tally"></div></div></div></div>

<div class="sec">${T('02 · O registo', '02 · The record', 'span', 'k')}${T('O registo de cada agente, em cinco partes', 'Each agent\'s record, in five parts', 'h2x')}
<div class="five" style="margin-top:12px">${five.map(([pt, en, c, spt, sen]) => `<div style="--c:${c}"><b data-pt="${esc(pt)}" data-en="${esc(en)}">${esc(pt)}</b>${T(spt, sen)}</div>`).join('')}</div></div>

<div class="sec">${T('03 · Quem o lê', '03 · Who reads it', 'span', 'k')}${T('Um registo, quatro leitores', 'One record, four readers', 'h2x')}<div class="stage" style="margin-top:12px">${readers()}</div></div>

<div class="sec">${T('04 · Onde entra', '04 · Where it fits', 'span', 'k')}${T('Os problemas que as empresas relatam, e quanto a RiskMandate ajuda em cada um', 'The problems companies report, and how much RiskMandate helps with each', 'h2x')}
${T('Os tipos vêm dos casos públicos que a equipa recolheu (lista interna, encriptada). Nenhuma empresa é nomeada aqui.', 'The kinds come from public cases the team collected (an internal, sealed list). No company is named here.', 'p', 'lead')}
<div class="grid" style="margin-top:12px">${PROBLEMS.map(([n, pt, en, ppt, pen, hpt, hen]) => { const [lpt, len, col] = LVL[n]; return `<div class="card" style="--l:${col}">${gauge(n, col)}<div><span class="lvl" data-pt="${esc(lpt)}" data-en="${esc(len)}">${esc(lpt)}</span>${T(pt, en, 'h3')}${T(ppt, pen, 'p', 'p')}${T(hpt, hen, 'p', 'h')}</div></div>` }).join('')}</div></div>

<div class="sec">${T('05 · Como o dizer', '05 · How to say it', 'span', 'k')}${T('Numa conversa com uma empresa', 'In a conversation with a company', 'h2x')}
<div class="dd" style="margin-top:12px"><div style="--c:#fb7185"><b data-pt="Não dizer" data-en="Do not say">Não dizer</b>${T('"A RiskMandate teria impedido isto." E não abrir o contacto com o problema deles.', '"RiskMandate would have stopped this." And do not open the conversation with their problem.')}</div>
<div style="--c:#2dd4bf"><b data-pt="Dizer" data-en="Say">Dizer</b>${T('"Os agentes de IA vão ter acessos como os que causaram estes casos. A RiskMandate mostra-vos, agente a agente, o que cada um consegue alcançar, o que está autorizado a fazer e a diferença, num registo que a gestão, a segurança e a seguradora entendem." Abrir com valor: a página PromptUGAL sobre a empresa.', '"AI agents will have access like the access behind these cases. RiskMandate shows you, agent by agent, what each can reach, what it is authorised to do and the gap, in one record leadership, security and your insurer can read." Open with value: the company\'s PromptUGAL page.')}</div></div></div>
${T('Feito por conductor@web-summit.silvio para o Silvio e a equipa, 8 de novembro de 2026, no estilo do X-ray. As frases sobre a RiskMandate são as de riskmandate.ai.', 'Made by conductor@web-summit.silvio for Silvio and the team, 8 November 2026, in the X-ray\'s style. What it says about RiskMandate is in riskmandate.ai\'s words.', 'p', 'foot')}
</div>`
    const md = `A RiskMandate não apaga fogos: mostra onde está a gasolina. Nas palavras de riskmandate.ai, mede o que os agentes conseguem realmente alcançar, prova os controlos que os contêm, põe um preço na exposição e produz esse registo; só lê, nunca bloqueia.\n\n## A simulação (um agente de apoio ao cliente, ilustrativo)\n\n${STEPS.map(([k, pt, , wpt]) => `- ${pt} (alcança: ${wpt}): ${k === 'in' ? 'dentro do mandato' : 'na diferença'}`).join('\n')}\n\n## O registo, em cinco partes\n\n${five.map(([t, , , s]) => `- **${t}:** ${s}`).join('\n')}\n\n## Um registo, quatro leitores\n\nGestão, segurança, auditor e regulador, seguradora.\n\n## Os problemas e quanto ajuda\n\n${PROBLEMS.map(([n, t, , p, , h]) => `- **${t}** (${LVL[n][0]}, ${n}/3): ${p} ${h}`).join('\n')}\n\n## Como o dizer\n\n- Não dizer: "a RiskMandate teria impedido isto"; não abrir com o problema deles.\n- Dizer: o registo mostra, agente a agente, alcance, mandato e diferença; abrir com a página PromptUGAL da empresa.\n`
    return { rel: 'people/silvio/riskmandate-explicado/index.html', title: 'Como a RiskMandate ajuda: o problema, o registo e onde entra', description: 'A RiskMandate explicada no estilo do X-ray: uma simulação de um agente contra o seu mandato, o registo em cinco partes, quem o lê, os problemas que as empresas relatam e quanto ajuda em cada um, e como o dizer. Português e inglês.', body, md, head: CSS + '<script src="../explica/explica.js" defer></script>' }
}
