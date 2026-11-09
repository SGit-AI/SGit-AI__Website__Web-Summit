// RiskMandate X-ray: the search agents and the one question each is asked (xray@web-summit.dinis, 7 November 2026).
// Shared by the search fan-out (admin/tools/xray-search.mjs), which sends it, and by the build (admin/build/xray.mjs),
// which shows it on each run page (/xray/<slug>/run/), so the page shows the exact words that were sent.
// Change the question here and both follow; a run's record (data/xray/<slug>/search/<stamp>.json) keeps its own
// subject and kind, so the page rebuilds the question as it was sent.
export const AGENTS = {
  perplexity: { label: 'Perplexity search', model: 'perplexity/sonar' },
  openai: { label: 'OpenAI search', model: 'openai/gpt-5.4-nano:online' },
  gemini: { label: 'Gemini search', model: 'google/gemini-3.1-flash-lite:online' },
  openrouter: { label: 'OpenRouter web search', model: 'anthropic/claude-haiku-5.5', plugins: [{ id: 'web', max_results: 6 }], max_tokens: 7000 },
}
// the answer limit for an agent with no max_tokens of its own
export const DEFAULT_MAX_TOKENS = 2500
export const ask = (s, kind = 'company') => `You are a research agent for RiskMandate X-ray. Subject (a ${kind}): "${s}".
Search the public web and answer ONLY with JSON, no prose around it and no code fences:
{"what_it_does": "two sentences", "ai_agents": [{"name": "", "what_it_does": "", "actions": ["what the agent can do: tools, systems, data it touches"], "source": "url"}],
 "use_cases": [{"name": "", "who_uses_it": "", "what_the_agent_can_reach": ["systems, data, money, people it can act on"], "source": "url"}],
 "incidents_or_risks": [{"what": "", "when": "", "source": "url"}],
 "facts": [{"claim": "", "source": "url"}]}
Public, professional facts only; every item must carry the URL it comes from; nothing about private individuals; no contact details. If you find nothing for a field, give an empty list.`
