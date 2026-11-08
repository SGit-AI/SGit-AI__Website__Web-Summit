// /people/silvio/riskmandate-explicado/: how RiskMandate helps with the problems companies report, as one infographic
// page in Portuguese, for Silvio and the team at the stand. By conductor@web-summit.silvio, 8 November 2026.
// Generic on purpose: no company is named here (the cases behind it are internal, sealed to the team). RiskMandate is
// described only in riskmandate.ai's own words: it "measures what your agents can actually reach, evidences the controls
// that contain them, prices the exposure, and produces that record", and is "never in the request path: read-only by
// design". So nothing here says it blocks or prevents anything.
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const CSS = `<style>
.rx{--ink:#1d2433;--soft:#5b6478;--line:#d9dee8;--card:#fff;--bg2:#f4f6fa;--reach:#2f6fdf;--mandate:#c9a227;--gap:#d64f6a;--ok:#14a37f;--mid:#e0892b;--low:#8a93a6;font-size:16px;color:var(--ink)}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .rx{--ink:#e8ecf4;--soft:#a3acbf;--line:#334058;--card:#18202e;--bg2:#111826;--reach:#6c9cf0;--mandate:#e5c75c;--gap:#ec7a90;--ok:#3cc9a2;--mid:#f0a85a;--low:#8a93a6}}
:root[data-theme=dark] .rx{--ink:#e8ecf4;--soft:#a3acbf;--line:#334058;--card:#18202e;--bg2:#111826;--reach:#6c9cf0;--mandate:#e5c75c;--gap:#ec7a90;--ok:#3cc9a2;--mid:#f0a85a;--low:#8a93a6}
.rx .hero{background:var(--bg2);border:1px solid var(--line);border-radius:20px;padding:22px;margin:0 0 18px}
.rx .hero b.big{display:block;font-size:1.7rem;line-height:1.25}.rx .hero p{color:var(--soft);margin:.5rem 0 0}
.rx h2{margin-top:2rem}.rx svg{width:100%;height:auto;display:block}.rx svg text{fill:var(--ink);font-family:inherit}.rx svg .s{fill:var(--soft)}
.rx .panel{background:var(--bg2);border:1px solid var(--line);border-radius:18px;padding:16px;margin:12px 0}
.rx .five{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px}
.rx .five div{background:var(--card);border:1px solid var(--line);border-top:5px solid var(--c);border-radius:14px;padding:12px}.rx .five b{display:block;font-size:1.05rem}
.rx .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}
.rx .card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:8px}
.rx .card h3{margin:0;font-size:1.05rem}.rx .lvl{display:flex;gap:4px;align-items:center;font-size:.85rem;color:var(--soft)}
.rx .lvl i{width:22px;height:8px;border-radius:4px;background:var(--line)}.rx .lvl i.on{background:var(--l)}
.rx .tag{font-weight:700;color:var(--l)}.rx .how{font-size:.95rem}.rx .no{font-size:.85rem;color:var(--soft)}
.rx .dd{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}
.rx .dd div{border-radius:14px;padding:14px;border:2px solid var(--c);background:var(--card)}.rx .dd b{color:var(--c)}
.rx .meta{color:var(--soft);font-size:.85rem}
</style>`

// the reach / mandate / gap picture: a big dome (reach), a small ring (mandate), the gap between them
function model() {
    return `<svg viewBox="0 0 900 430" role="img" aria-label="O alcance de um agente é maior do que o seu mandato; a diferença entre os dois é o risco.">
<defs><pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="10" stroke="var(--gap)" stroke-width="3" opacity=".45"/></pattern></defs>
<circle cx="300" cy="215" r="150" fill="url(#hatch)" stroke="var(--reach)" stroke-width="4"/>
<circle cx="300" cy="215" r="150" fill="var(--reach)" opacity=".08"/>
<circle cx="300" cy="215" r="70" fill="var(--card)" stroke="var(--mandate)" stroke-width="5"/>
<text x="300" y="208" text-anchor="middle" font-size="20" font-weight="700">MANDATO</text><text x="300" y="232" text-anchor="middle" font-size="14" class="s">o que foi autorizado</text>
<text x="300" y="30" text-anchor="middle" font-size="20" font-weight="700" style="fill:var(--reach)">ALCANCE</text>
<text x="300" y="52" text-anchor="middle" font-size="14" class="s">tudo o que o agente consegue tocar</text>
<path d="M200 320 L130 392" stroke="var(--gap)" stroke-width="2.5"/><circle cx="200" cy="320" r="5" fill="var(--gap)"/><text x="110" y="408" text-anchor="middle" font-size="18" font-weight="700" style="fill:var(--gap)">A DIFERENÇA</text>
<text x="110" y="428" text-anchor="middle" font-size="14" class="s">consegue, mas ninguém pediu</text>
<g font-size="15"><rect x="510" y="90" width="370" height="250" rx="16" fill="var(--bg2)" stroke="var(--line)"/>
<text x="530" y="128" font-weight="700" font-size="18">Um agente de IA típico</text>
<circle cx="540" cy="162" r="6" fill="var(--reach)"/><text x="556" y="167">Alcance: email, ficheiros, CRM, pagamentos</text>
<circle cx="540" cy="198" r="6" fill="var(--mandate)"/><text x="556" y="203">Mandato: responder a pedidos de clientes</text>
<circle cx="540" cy="234" r="6" fill="var(--gap)"/><text x="556" y="239">Diferença: pagamentos, apagar ficheiros,</text>
<text x="556" y="259">enviar dados para fora</text>
<text x="530" y="306" class="s">É na diferença que o risco vive.</text></g>
</svg>`
}

// the record and who reads it: one record, four readers
function readers() {
    const R = [['Gestão', 'que agentes temos e que risco correm'], ['Segurança', 'que acessos sobram e que barreiras há'], ['Auditor e regulador', 'a prova do que cada sistema faz'], ['Seguradora', 'a exposição, com um preço']]
    return `<svg viewBox="0 0 900 250" role="img" aria-label="Um só registo por agente, lido pela gestão, segurança, auditor e seguradora.">
<rect x="20" y="70" width="240" height="110" rx="18" fill="var(--card)" stroke="var(--reach)" stroke-width="3"/>
<text x="140" y="112" text-anchor="middle" font-size="18" font-weight="700">O registo do agente</text><text x="140" y="138" text-anchor="middle" font-size="14" class="s">Agent Behaviour Policy</text>
<text x="140" y="160" text-anchor="middle" font-size="13" class="s">só leitura, nunca no caminho</text>
${R.map(([t, s], i) => { const y = 14 + i * 58; return `<path d="M262 125 C 380 125, 420 ${y + 24}, 520 ${y + 24}" fill="none" stroke="var(--line)" stroke-width="3"/><rect x="520" y="${y}" width="360" height="48" rx="12" fill="var(--bg2)" stroke="var(--line)"/><text x="538" y="${y + 21}" font-size="16" font-weight="700">${esc(t)}</text><text x="538" y="${y + 39}" font-size="13" class="s">${esc(s)}</text>` }).join('')}
</svg>`
}

// problem types, each with how much RiskMandate helps (3 strong, 2 partial, 1 little) and how
const PROBLEMS = [
    ['Acessos que ficaram a mais', 3, 'Uma conta ou um agente ainda alcança dados que já não está autorizado a ver.', 'O registo mostra essa diferença, conta a conta e agente a agente, antes de alguém a usar.'],
    ['Fornecedores e integrações', 3, 'O risco entra por quem tem acesso indireto: um fornecedor, um conector, uma credencial esquecida.', 'Mostra a que cada ligação e cada fornecedor consegue chegar, num só sítio.'],
    ['Agentes de IA fora do mandato', 3, 'Um agente apaga dados, envia informação para fora ou age sem aprovação.', 'Torna visível, antes, o que o agente consegue fazer além do que lhe pediram, para quem o pode fechar.'],
    ['Multas e auditorias', 2, 'O regulador pergunta quem autorizou o quê e com que controlos.', 'O registo é prova documentada: o que cada sistema faz e que barreiras tem, com evidência.'],
    ['Chatbots que respondem mal', 2, 'O assistente automático erra ou não resolve, e os clientes queixam-se.', 'Ajuda a fixar o mandato do chatbot: o que lhe confiar e o que passar a uma pessoa. Não corrige as respostas.'],
    ['Ransomware e quedas de serviço', 1, 'Um ataque cifra ou derruba os sistemas.', 'Não impede o ataque. Mostra que agentes e contas automáticas tocam nos sistemas críticos e com que barreiras.']
]
const LVL = { 3: ['Ajuda muito', '--ok'], 2: ['Ajuda em parte', '--mid'], 1: ['Ajuda pouco', '--low'] }

export function explica() {
    const five = [['Alcance', '--reach', 'Tudo o que o agente consegue tocar: sistemas, dados, ações, ligações.'], ['Mandato', '--mandate', 'O que a empresa o autorizou a fazer: a tarefa, o âmbito, o propósito.'], ['Diferença', '--gap', 'O que consegue fazer mas ninguém pediu. É aqui que está o risco.'], ['Barreiras', '--ok', 'Os controlos reais que o travam, cada um com prova.'], ['Proveniência', '--soft', 'Quem é o dono, quem o reviu, que versão está a correr.']]
    const body = `<div class="rx">
<div class="hero"><b class="big">A RiskMandate não apaga fogos. Mostra onde está a gasolina.</b>
<p>Nas palavras de riskmandate.ai: mede o que os agentes conseguem realmente alcançar, prova os controlos que os contêm, põe um preço na exposição e produz esse registo. Só lê: nunca está no caminho das operações, e por isso nunca bloqueia nada.</p></div>
<h2 id="modelo">1. O problema numa imagem</h2><div class="panel">${model()}</div>
<h2 id="registo">2. O registo de cada agente, em cinco partes</h2>
<div class="five">${five.map(([t, c, s]) => `<div style="--c:var(${c})"><b>${esc(t)}</b>${esc(s)}</div>`).join('')}</div>
<h2 id="leitores">3. Um registo, quatro leitores</h2><div class="panel">${readers()}</div>
<h2 id="problemas">4. Os problemas que as empresas relatam, e quanto a RiskMandate ajuda em cada um</h2>
<p class="meta">Os tipos de problema vêm dos casos públicos que a equipa recolheu em empresas portuguesas e da Web Summit (lista interna, encriptada para a equipa). Nenhuma empresa é nomeada aqui.</p>
<div class="grid">${PROBLEMS.map(([t, n, p, h]) => { const [lab, col] = LVL[n]; return `<div class="card" style="--l:var(${col})"><h3>${esc(t)}</h3><div class="lvl">${[1, 2, 3].map(k => `<i class="${k <= n ? 'on' : ''}"></i>`).join('')} <span class="tag">${lab}</span></div><div class="no"><b>O problema:</b> ${esc(p)}</div><div class="how"><b>Como ajuda:</b> ${esc(h)}</div></div>` }).join('')}</div>
<h2 id="mensagem">5. Como o dizer a uma empresa</h2>
<div class="dd"><div style="--c:var(--gap)"><b>Não dizer</b><br>"A RiskMandate teria impedido isto."<br>Abrir o contacto com o problema deles.</div>
<div style="--c:var(--ok)"><b>Dizer</b><br>"Os agentes de IA vão ter acessos como os que causaram estes casos. A RiskMandate mostra-vos, agente a agente, o que cada um consegue alcançar, o que está autorizado a fazer e a diferença, num registo que a gestão, a segurança e a seguradora entendem."<br>Abrir com valor: a página PromptUGAL sobre a empresa.</div></div>
<p class="meta">Feito por conductor@web-summit.silvio para o Silvio e a equipa, 8 de novembro de 2026. As frases sobre a RiskMandate são as de riskmandate.ai e do site da equipa.</p></div>`
    const md = `A RiskMandate não apaga fogos: mostra onde está a gasolina. Nas palavras de riskmandate.ai, mede o que os agentes conseguem realmente alcançar, prova os controlos que os contêm, põe um preço na exposição e produz esse registo; só lê, nunca bloqueia.\n\n## O registo, em cinco partes\n\n${five.map(([t, , s]) => `- **${t}:** ${s}`).join('\n')}\n\n## Um registo, quatro leitores\n\nGestão, segurança, auditor e regulador, seguradora.\n\n## Os problemas e quanto ajuda\n\n${PROBLEMS.map(([t, n, p, h]) => `- **${t}** (${LVL[n][0]}): ${p} ${h}`).join('\n')}\n\n## Como o dizer\n\n- Não dizer: "a RiskMandate teria impedido isto"; não abrir com o problema deles.\n- Dizer: o registo mostra, agente a agente, alcance, mandato e diferença; abrir com a página PromptUGAL da empresa.\n`
    return { rel: 'people/silvio/riskmandate-explicado/index.html', title: 'Como a RiskMandate ajuda: o problema, o registo e onde entra', description: 'A RiskMandate explicada numa página: alcance, mandato e a diferença entre os dois; o registo de cada agente em cinco partes; quem o lê; os problemas que as empresas relatam e quanto ajuda em cada um; como o dizer.', body, md, head: CSS }
}
