import crypto from 'crypto';
import type { AppConfig } from './config.js';
import type { DecisionRequest, DecisionRecord } from './types.js';
import { searchWeb } from './search.js';
import { runDecisionAgent } from './agent.js';
import { saveDecision } from './db.js';

export async function processDecision(
  req: DecisionRequest,
  config: AppConfig
): Promise<DecisionRecord> {
  const startTime = Date.now();

  // Validate that backend has required providers
  if (!config.activeLlm) {
    throw new Error(
      'No LLM provider is configured on the server. Please add ANTHROPIC_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY, or GROQ_API_KEY to your .env file.'
    );
  }

  if (!config.activeSearch) {
    throw new Error(
      'No Web Search provider is configured on the server. Please add TAVILY_API_KEY, BRAVE_API_KEY, or SERPER_API_KEY to your .env file.'
    );
  }

  // 1. Gather live grounding search results
  const sources = await searchWeb(req.topic, config.activeSearch);

  // 2. Run real LLM decision engine
  const { options, consensus, matrix } = await runDecisionAgent(
    config.activeLlm,
    req.topic,
    req.constraints,
    sources
  );

  const executionTimeMs = Date.now() - startTime;
  const id = `dec_${crypto.randomBytes(8).toString('hex')}`;

  const record: DecisionRecord = {
    id,
    topic: req.topic,
    constraints: req.constraints,
    createdAt: new Date().toISOString(),
    executionTimeMs,
    engineUsed: `${config.activeLlm.name} (${config.activeLlm.model})`,
    searchProviderUsed: config.activeSearch.name,
    sources,
    options,
    consensus,
    matrix,
  };

  // 3. Persist to SQLite
  saveDecision(record);

  return record;
}
