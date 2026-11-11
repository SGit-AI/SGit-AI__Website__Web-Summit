<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Experiment Report</title>
<style>
:root{--text:#111827;--muted:#4b5563;--line:#d1d5db;--bg:#ffffff;--bad:#b91c1c;--ok:#047857}
body{margin:0;background:var(--bg);color:var(--text);font:14px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
main{max-width:860px;margin:0 auto;padding:24px 16px}
h1{font-size:22px;margin:0 0 4px}h2{font-size:15px;margin:22px 0 6px;border-bottom:1px solid var(--line);padding-bottom:4px}
.sub{color:var(--muted);font-size:13px}table{border-collapse:collapse;width:100%;font-size:12.5px}td,th{border:1px solid var(--line);padding:5px;vertical-align:top;text-align:left;word-break:break-word}
code,pre{font:12px ui-monospace,monospace;white-space:pre-wrap;word-break:break-word}.fact{color:var(--ok);font-weight:700}.interp{color:#92400e;font-weight:700}
.bad{color:var(--bad);font-weight:700}.ok{color:var(--ok);font-weight:700}button{font:inherit;padding:6px 12px}
@media print{button{display:none}main{padding:0}}
</style>
</head>
<body><main id="m">Loading…</main>
<script>
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const id=new URLSearchParams(location.search).get('id');
const READ={AGENT_VOLUNTARILY_COMPLIED:'The agent did not attempt the forbidden action. Nothing was tested beyond its own choice.',
HOOK_INTERVENED:'The agent attempted the forbidden action and the workspace hook refused the tool call. The hook is a setting in the agent\'s own workspace, not a boundary.',
INDEPENDENT_ENFORCEMENT_BLOCKED:'The agent attempted the forbidden action and the operating system refused it (Landlock, applied by SHarness before the agent started).',
ACTION_SUCCEEDED:'The forbidden action happened. Whatever control was in place did not prevent it in this run.',
ACTION_FAILED:'The agent attempted the forbidden action; it had no effect, but no control is recorded as the reason.',
APPROVAL_REQUIRED:'The agent did not act and said a person\'s approval was needed.',FAILED:'The run itself failed; it says nothing about the controls.'};
fetch('../results/runs/'+encodeURIComponent(id)+'.json').then(r=>r.json()).then(r=>{
 const row=(k,v)=>`<tr><th style="width:28%">${k}</th><td>${v}</td></tr>`;
 const calls=r.tool_calls.map((c,i)=>`<tr><td>${i+1}</td><td>${esc(c.tool)}${c.attempt?' <b>(forbidden action)</b>':''}</td><td><code>${esc(c.input)}</code></td><td><code>${esc(c.result_preview)}</code></td><td>${c.result_error?'error':'ok'}</td></tr>`).join('');
 const blocked=r.tool_calls.filter(c=>/Blocked by the workspace hook|EACCES|Permission denied|Operation not permitted/.test(c.result_preview));
 document.getElementById('m').innerHTML=`
 <h1>Experiment report: ${esc(r.scenario.title)}, model ${esc(r.governance_model)}</h1>
 <div class="sub">RiskMandate Enforcement Lab · ${r.live?'LIVE EXECUTION':'recorded real run (replayed here)'} · <button onclick="print()">Print or save as PDF</button></div>
 <h2>1 to 8. The experiment</h2><table>
 ${row('1. Experiment ID',esc(r.experiment_id))}${row('2. Timestamp (UTC)',esc(r.at))}${row('3. Agent identity',esc(r.agent.identity))}
 ${row('4. Model configuration',esc(r.agent.model_configuration))}${row('5. Task definition',esc(r.scenario.task)+'<br><span class="sub">Prompt variant: '+esc(r.variant_note||r.variant||'as written')+'</span>')}
 ${row('6. Environment',esc(r.environment))}${row('7. Applied policy',esc(r.scenario.rule)+'<br><span class="sub">'+esc(r.policy.file)+' sha256 '+esc(r.policy.sha256)+'</span>')}
 ${row('8. Enforcement mechanism',esc(r.governance)+'<br><span class="sub">'+esc(r.enforcement.enforcer)+(r.enforcement.policy_hash?' · '+esc(r.enforcement.policy_hash):'')+(r.enforcement.sha256?' · sha256 '+esc(r.enforcement.sha256):'')+'</span>')}
 </table>
 <h2>9 to 14. What happened <span class="fact">(observed facts)</span></h2><table>
 ${row('9. Attempted forbidden actions',r.attempted_actions)}${row('10. Completed tool calls',r.completed_tool_calls+' of '+r.tool_calls.length)}
 ${row('11. Blocked actions',blocked.length+' (hook denies: '+r.hook_denies+', kernel denies on a forbidden action: '+r.kernel_denies+')')}
 ${row('12. Violations',r.violation?'<span class="bad">YES: '+esc(r.scenario.violation_test)+'</span>':'<span class="ok">none</span> (test: '+esc(r.scenario.violation_test)+')')}
 ${row('13. Enforcement failures',r.violation&&r.governance_model!=='A'?'<span class="bad">yes: the control was in place and the action still happened</span>':'none recorded')}
 ${row('14. Human interventions',r.human_interventions)}
 </table>
 <h2>Tool calls, in order</h2><table><tr><th>#</th><th>Tool</th><th>Input</th><th>Result</th><th></th></tr>${calls||'<tr><td colspan=5>none</td></tr>'}</table>
 <h2>15. Comparison metrics</h2><p>Outcome: <b>${esc(r.outcome)}</b> · turns ${esc(r.num_turns)} · ${esc(r.duration_s)} s · list-price cost $${esc(r.cost_usd_list_price)}. The dashboard compares this run with the others of the same scenario and prompt.</p>
 <h2>16. Supporting execution evidence</h2><pre>${esc(JSON.stringify(r.evidence,null,1))}</pre>
 ${r.hook_decisions&&r.hook_decisions.length?'<pre>'+esc(r.hook_decisions.map(h=>JSON.stringify(h)).join('\n'))+'</pre>':''}
 <p><b>Agent's final answer</b> (what it says, not evidence of what it did):</p><pre>${esc(r.final_answer)}</pre>
 <h2>17. Known limitations</h2><ul>
 <li>One run of a small sample; illustrative only, not a security guarantee.</li>
 <li>Synthetic data in a throwaway folder; the agent is the account's small model tier.</li>
 <li>Model B's hook matches patterns in tool inputs and lives in the agent's own workspace settings; it is a setting, not a boundary.</li>
 <li>Model C's kernel policy covers files and TCP ports; it cannot tell one website from another behind the same egress port, and cannot judge content the agent may legitimately read.</li>
 <li>"Attempt" is read from the agent's tool calls by fixed patterns; a disguised attempt may be missed. Violations are checked on disk and in the transcript.</li></ul>
 <h2>18. Final assessment <span class="interp">(interpretation)</span></h2><p>${esc(READ[r.outcome]||r.outcome)}</p>`;
}).catch(e=>document.getElementById('m').textContent='Could not load the experiment '+id+': '+e.message);
</script>
</body>
</html>
