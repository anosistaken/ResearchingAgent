import type { LlmConfig } from './config.js';
import type { SearchCitation, OptionEvaluation, FinalConsensus, ComparisonMatrix } from './types.js';

const SYSTEM_PROMPT = `You are Greg, a ruthless and analytical AI decision agent.
Your mission:
1. Help the user pick the single best option for their situation and constraints without wasting their time.
2. Ground all factual statements in the provided search citations.
3. Compare only factors that truly matter in production or real life: total maintenance cost, real reliability, lock-in, hard dealbreakers, and operational traps.
4. Separate findings strictly into:
   - Verified facts (proven by search sources)
   - Reasonable assumptions
   - Unknowns (things that cannot be verified or depend on private data)
5. Discard marketing fluff, buzzwords, synthetic micro-benchmarks, and trivial cosmetic features.
6. Give exactly ONE winner. Explain why it wins and what critical tradeoff the user accepts.
7. Explain clearly why every rejected alternative was dismissed.
8. Output strictly valid JSON with no markdown formatting or extra text outside the JSON.`;

function buildPrompt(topic: string, constraints: string | undefined, sources: SearchCitation[]): string {
  const sourcesText = sources
    .map(
      (s) =>
        `[Source ${s.id}] Title: ${s.title}\nURL: ${s.url}\nDomain: ${s.domain}\nContent:\n${s.snippet}`
    )
    .join('\n\n---\n\n');

  return `DECISION TOPIC: "${topic}"
${constraints ? `USER CONSTRAINTS: "${constraints}"` : 'NO SPECIFIC USER CONSTRAINTS PROVIDED.'}

VERIFIED SEARCH SOURCES:
${sourcesText}

INSTRUCTIONS:
Carefully analyze the top 2 to 3 real contenders using only the facts above and real-world engineering standards.
Return a single JSON object matching this exact structure:
{
  "consensus": {
    "winner": "Exact Name of the Single Best Pick",
    "tagline": "One sentence summary of why this option is superior for this situation",
    "confidence": "HIGH" | "MEDIUM" | "LOW",
    "whyItWins": [
      "Key reason 1 with clear justification",
      "Key reason 2 with clear justification",
      "Key reason 3 with clear justification"
    ],
    "mainTradeoff": "The single biggest downside or cost you accept by choosing the winner",
    "verifiedFacts": [
      "Fact directly confirmed by search citations (reference source IDs if applicable)"
    ],
    "assumptions": [
      "Plausible assumption made based on typical usage patterns"
    ],
    "unknowns": [
      "Specific unknown that cannot be verified without internal metrics or hands-on testing"
    ],
    "rejectedAlternatives": [
      {
        "name": "Alternative Option Name",
        "reasonRejected": "Concrete reason why this failed compared to the winner"
      }
    ],
    "discardedFluff": [
      "Specific marketing claim, buzzword, or trivial feature deliberately ignored"
    ]
  },
  "options": [
    {
      "name": "Option Name",
      "tagline": "Factual role or position of this contender",
      "keyPros": ["Pro 1", "Pro 2"],
      "keyCons": ["Con 1", "Con 2"],
      "hardDealbreaker": "Specific scenario where choosing this option is a fatal mistake (or null)",
      "score": 88,
      "citations": [1, 2]
    }
  ],
  "matrix": {
    "options": ["Option 1", "Option 2"],
    "metrics": [
      {
        "name": "Primary Advantage",
        "values": { "Option 1": "Details", "Option 2": "Details" }
      },
      {
        "name": "Operational Burden",
        "values": { "Option 1": "Low", "Option 2": "High" }
      },
      {
        "name": "Critical Vulnerability",
        "values": { "Option 1": "None", "Option 2": "Lock-in" }
      },
      {
        "name": "Hard Dealbreaker",
        "values": { "Option 1": "None", "Option 2": "Single node write lock" }
      }
    ]
  }
}`;
}

export async function runDecisionAgent(
  llmConfig: LlmConfig,
  topic: string,
  constraints: string | undefined,
  sources: SearchCitation[]
): Promise<{
  options: OptionEvaluation[];
  consensus: FinalConsensus;
  matrix: ComparisonMatrix;
}> {
  const prompt = buildPrompt(topic, constraints, sources);
  const timeoutMs = 45000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let rawJson = '';

    if (llmConfig.id === 'anthropic') {
      rawJson = await callAnthropic(llmConfig, SYSTEM_PROMPT, prompt, controller.signal);
    } else if (llmConfig.id === 'openai') {
      rawJson = await callOpenAI(llmConfig, SYSTEM_PROMPT, prompt, controller.signal);
    } else if (llmConfig.id === 'gemini') {
      rawJson = await callGemini(llmConfig, SYSTEM_PROMPT, prompt, controller.signal);
    } else if (llmConfig.id === 'groq') {
      rawJson = await callOpenAICompatible(llmConfig, SYSTEM_PROMPT, prompt, controller.signal);
    } else if (llmConfig.id === 'ollama') {
      rawJson = await callOllama(llmConfig, SYSTEM_PROMPT, prompt, controller.signal);
    } else {
      throw new Error(`Unsupported LLM provider: ${llmConfig.id}`);
    }

    const parsed = cleanAndParseJSON(rawJson);
    validateAgentOutput(parsed);

    return {
      options: parsed.options,
      consensus: parsed.consensus,
      matrix: parsed.matrix,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function callAnthropic(config: LlmConfig, system: string, user: string, signal: AbortSignal): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal,
    headers: {
      'x-api-key': config.apiKey || '',
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 3000,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${errorText.slice(0, 200)}`);
  }

  const data = (await res.json()) as { content?: Array<{ text: string }> };
  return data.content?.[0]?.text || '';
}

async function callOpenAI(config: LlmConfig, system: string, user: string, signal: AbortSignal): Promise<string> {
  const baseUrl = config.baseUrl || 'https://api.openai.com/v1';
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    signal,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${errorText.slice(0, 200)}`);
  }

  const data = (await res.json()) as { choices?: Array<{ message: { content: string } }> };
  return data.choices?.[0]?.message?.content || '';
}

async function callGemini(config: LlmConfig, system: string, user: string, signal: AbortSignal): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents: [{ parts: [{ text: user }] }],
      generationConfig: {
        response_mime_type: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google Gemini API error (${res.status}): ${errorText.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text: string }> } }>;
  };
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callOpenAICompatible(config: LlmConfig, system: string, user: string, signal: AbortSignal): Promise<string> {
  return callOpenAI(config, system, user, signal);
}

async function callOllama(config: LlmConfig, system: string, user: string, signal: AbortSignal): Promise<string> {
  const baseUrl = config.baseUrl || 'http://localhost:11434';
  const res = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.model,
      stream: false,
      format: 'json',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Ollama API error (${res.status}): ${errorText.slice(0, 200)}`);
  }

  const data = (await res.json()) as { message?: { content: string } };
  return data.message?.content || '';
}

function cleanAndParseJSON(raw: string): any {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

function validateAgentOutput(data: any): void {
  if (!data || typeof data !== 'object') {
    throw new Error('LLM returned invalid non-object response');
  }
  if (!data.consensus || !data.consensus.winner || !data.consensus.whyItWins) {
    throw new Error('LLM response missing required consensus fields');
  }
  if (!Array.isArray(data.options) || data.options.length === 0) {
    throw new Error('LLM response missing evaluated options list');
  }
  if (!data.matrix || !Array.isArray(data.matrix.metrics)) {
    throw new Error('LLM response missing comparison matrix');
  }
}
