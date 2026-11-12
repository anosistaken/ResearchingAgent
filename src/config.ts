import dotenv from 'dotenv';
import type { ProviderStatus, SystemStatus } from './types.js';

dotenv.config();

export interface LlmConfig {
  id: 'anthropic' | 'openai' | 'gemini' | 'groq' | 'ollama';
  name: string;
  model: string;
  apiKey?: string;
  baseUrl?: string;
}

export interface SearchConfig {
  id: 'tavily' | 'brave' | 'serper';
  name: string;
  apiKey: string;
}

export interface AppConfig {
  port: number;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  activeLlm: LlmConfig | null;
  activeSearch: SearchConfig | null;
  availableLlms: LlmConfig[];
  availableSearches: SearchConfig[];
}

export function loadValidatedConfig(): AppConfig {
  const port = parseInt(process.env.PORT || '3000', 10);
  const rateLimitWindowMs = 60 * 1000; // 1 minute
  const rateLimitMaxRequests = 20; // 20 requests per minute per IP

  const availableLlms: LlmConfig[] = [];

  // Anthropic
  if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim() !== '') {
    availableLlms.push({
      id: 'anthropic',
      name: 'Anthropic Claude',
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
      apiKey: process.env.ANTHROPIC_API_KEY.trim(),
    });
  }

  // OpenAI
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '') {
    availableLlms.push({
      id: 'openai',
      name: 'OpenAI',
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      apiKey: process.env.OPENAI_API_KEY.trim(),
    });
  }

  // Google Gemini
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
    availableLlms.push({
      id: 'gemini',
      name: 'Google Gemini',
      model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
      apiKey: process.env.GEMINI_API_KEY.trim(),
    });
  }

  // Groq
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim() !== '') {
    availableLlms.push({
      id: 'groq',
      name: 'Groq Cloud',
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      apiKey: process.env.GROQ_API_KEY.trim(),
      baseUrl: 'https://api.groq.com/openai/v1',
    });
  }

  // Local Ollama (explicitly enabled if configured)
  if (process.env.OLLAMA_ENABLED === 'true') {
    availableLlms.push({
      id: 'ollama',
      name: 'Ollama Local',
      model: process.env.OLLAMA_MODEL || 'llama3.1:latest',
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    });
  }

  const availableSearches: SearchConfig[] = [];

  // Tavily
  if (process.env.TAVILY_API_KEY && process.env.TAVILY_API_KEY.trim() !== '') {
    availableSearches.push({
      id: 'tavily',
      name: 'Tavily Search',
      apiKey: process.env.TAVILY_API_KEY.trim(),
    });
  }

  // Brave
  if (process.env.BRAVE_API_KEY && process.env.BRAVE_API_KEY.trim() !== '') {
    availableSearches.push({
      id: 'brave',
      name: 'Brave Search',
      apiKey: process.env.BRAVE_API_KEY.trim(),
    });
  }

  // Serper
  if (process.env.SERPER_API_KEY && process.env.SERPER_API_KEY.trim() !== '') {
    availableSearches.push({
      id: 'serper',
      name: 'Serper Google Search',
      apiKey: process.env.SERPER_API_KEY.trim(),
    });
  }

  return {
    port,
    rateLimitWindowMs,
    rateLimitMaxRequests,
    activeLlm: availableLlms[0] || null,
    activeSearch: availableSearches[0] || null,
    availableLlms,
    availableSearches,
  };
}

export function getSystemStatus(config: AppConfig): SystemStatus {
  const isLlmReady = config.activeLlm !== null;
  const isSearchReady = config.activeSearch !== null;
  const isConfigured = isLlmReady && isSearchReady;

  const providers: ProviderStatus[] = [
    {
      id: 'anthropic',
      name: 'Anthropic Claude',
      type: 'llm',
      configured: Boolean(process.env.ANTHROPIC_API_KEY?.trim()),
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
    },
    {
      id: 'openai',
      name: 'OpenAI',
      type: 'llm',
      configured: Boolean(process.env.OPENAI_API_KEY?.trim()),
      model: process.env.OPENAI_MODEL || 'gpt-4o',
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      type: 'llm',
      configured: Boolean(process.env.GEMINI_API_KEY?.trim()),
      model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
    },
    {
      id: 'groq',
      name: 'Groq Cloud',
      type: 'llm',
      configured: Boolean(process.env.GROQ_API_KEY?.trim()),
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    },
    {
      id: 'tavily',
      name: 'Tavily Search API',
      type: 'search',
      configured: Boolean(process.env.TAVILY_API_KEY?.trim()),
    },
    {
      id: 'brave',
      name: 'Brave Search API',
      type: 'search',
      configured: Boolean(process.env.BRAVE_API_KEY?.trim()),
    },
    {
      id: 'serper',
      name: 'Serper Google Search API',
      type: 'search',
      configured: Boolean(process.env.SERPER_API_KEY?.trim()),
    },
  ];

  let error: string | undefined;
  if (!isLlmReady && !isSearchReady) {
    error = 'Missing both an LLM API key and a Web Search API key. Configure .env to run real research.';
  } else if (!isLlmReady) {
    error = 'Missing LLM API key. Provide ANTHROPIC_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY, or GROQ_API_KEY in .env.';
  } else if (!isSearchReady) {
    error = 'Missing Web Search API key. Provide TAVILY_API_KEY, BRAVE_API_KEY, or SERPER_API_KEY in .env.';
  }

  return {
    isConfigured,
    activeLlmProvider: config.activeLlm ? `${config.activeLlm.name} (${config.activeLlm.model})` : null,
    activeSearchProvider: config.activeSearch ? config.activeSearch.name : null,
    providers,
    error,
  };
}
