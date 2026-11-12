import type { SearchCitation } from './types.js';
import type { SearchConfig } from './config.js';

function extractDomain(urlStr: string): string {
  try {
    const parsed = new URL(urlStr);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return 'web';
  }
}

export async function searchWeb(
  query: string,
  searchConfig: SearchConfig
): Promise<SearchCitation[]> {
  const timeoutMs = 12000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    if (searchConfig.id === 'tavily') {
      return await searchTavily(query, searchConfig.apiKey, controller.signal);
    } else if (searchConfig.id === 'brave') {
      return await searchBrave(query, searchConfig.apiKey, controller.signal);
    } else if (searchConfig.id === 'serper') {
      return await searchSerper(query, searchConfig.apiKey, controller.signal);
    }
    throw new Error(`Unsupported search provider: ${searchConfig.id}`);
  } finally {
    clearTimeout(timer);
  }
}

async function searchTavily(query: string, apiKey: string, signal: AbortSignal): Promise<SearchCitation[]> {
  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: 'advanced',
      include_answer: false,
      max_results: 6,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Tavily search API error (${res.status}): ${errorText.slice(0, 200)}`);
  }

  const data = (await res.json()) as { results?: Array<{ title: string; url: string; content: string }> };
  if (!data.results || data.results.length === 0) {
    throw new Error(`No web search results found for query: "${query}"`);
  }

  return data.results.map((r, idx) => ({
    id: idx + 1,
    title: r.title || 'Source Citation',
    url: r.url,
    domain: extractDomain(r.url),
    snippet: (r.content || '').slice(0, 1000),
  }));
}

async function searchBrave(query: string, apiKey: string, signal: AbortSignal): Promise<SearchCitation[]> {
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=6`;
  const res = await fetch(url, {
    signal,
    headers: {
      Accept: 'application/json',
      'X-Subscription-Token': apiKey,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Brave search API error (${res.status}): ${errorText.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    web?: { results?: Array<{ title: string; url: string; description: string }> };
  };

  if (!data.web?.results || data.web.results.length === 0) {
    throw new Error(`No Brave search results returned for: "${query}"`);
  }

  return data.web.results.map((r, idx) => ({
    id: idx + 1,
    title: r.title || 'Source Citation',
    url: r.url,
    domain: extractDomain(r.url),
    snippet: (r.description || '').slice(0, 1000),
  }));
}

async function searchSerper(query: string, apiKey: string, signal: AbortSignal): Promise<SearchCitation[]> {
  const res = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    signal,
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ q: query, num: 6 }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Serper search API error (${res.status}): ${errorText.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    organic?: Array<{ title: string; link: string; snippet: string }>;
  };

  if (!data.organic || data.organic.length === 0) {
    throw new Error(`No Google Serper results returned for: "${query}"`);
  }

  return data.organic.map((r, idx) => ({
    id: idx + 1,
    title: r.title || 'Source Citation',
    url: r.link,
    domain: extractDomain(r.link),
    snippet: (r.snippet || '').slice(0, 1000),
  }));
}
