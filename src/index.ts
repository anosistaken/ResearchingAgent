import http from 'http';
import readline from 'readline';
import { loadValidatedConfig, getSystemStatus } from './config.js';
import { processDecision } from './evaluator.js';
import { renderAppHtml } from './ui.js';
import { listRecentDecisions, getDecisionById, deleteDecisionById } from './db.js';
import { formatDecisionAsMarkdown } from './export.js';
import { DecisionRequestSchema } from './types.js';

const config = loadValidatedConfig();

// In-memory simple IP rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + config.rateLimitWindowMs });
    return true;
  }

  if (record.count >= config.rateLimitMaxRequests) {
    return false;
  }

  record.count += 1;
  return true;
}

function startHttpServer() {
  const server = http.createServer(async (req, res) => {
    const clientIp = req.socket.remoteAddress || 'unknown';
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

    // Security & CORS Headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // 1. Landing Page UI
    if (req.method === 'GET' && url.pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(renderAppHtml());
      return;
    }

    // 2. Health & Provider Status API
    if (req.method === 'GET' && url.pathname === '/api/status') {
      const status = getSystemStatus(config);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(status));
      return;
    }

    // 3. Decision History API (List recent decisions)
    if (req.method === 'GET' && url.pathname === '/api/decisions') {
      const decisions = listRecentDecisions(30);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ decisions }));
      return;
    }

    // 4. Export Decision as Markdown
    if (req.method === 'GET' && url.pathname.startsWith('/api/decisions/') && url.pathname.endsWith('/export')) {
      const id = url.pathname.replace('/api/decisions/', '').replace('/export', '');
      const decision = getDecisionById(id);
      if (!decision) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Decision not found' }));
        return;
      }
      const markdown = formatDecisionAsMarkdown(decision);
      res.writeHead(200, {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="greg-decision-${id}.md"`,
      });
      res.end(markdown);
      return;
    }

    // 5. Decision Record Detail API
    if (req.method === 'GET' && url.pathname.startsWith('/api/decisions/')) {
      const id = url.pathname.replace('/api/decisions/', '');
      const decision = getDecisionById(id);
      if (!decision) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Decision not found' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(decision));
      return;
    }

    // 6. Delete Decision API
    if (req.method === 'DELETE' && url.pathname.startsWith('/api/decisions/')) {
      const id = url.pathname.replace('/api/decisions/', '');
      const deleted = deleteDecisionById(id);
      if (!deleted) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Decision not found' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
      return;
    }

    // 7. Create Decision API
    if (req.method === 'POST' && url.pathname === '/api/decisions') {
      // Rate limit check
      if (!checkRateLimit(clientIp)) {
        res.writeHead(429, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Rate limit exceeded. Please wait a minute before requesting another decision.' }));
        return;
      }

      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
        if (body.length > 50000) {
          req.destroy();
        }
      });

      req.on('end', async () => {
        try {
          let parsedBody: any;
          try {
            parsedBody = JSON.parse(body);
          } catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON request payload' }));
            return;
          }

          const validation = DecisionRequestSchema.safeParse(parsedBody);
          if (!validation.success) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: validation.error.errors[0]?.message || 'Invalid input' }));
            return;
          }

          const record = await processDecision(validation.data, config);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(record));
        } catch (err: any) {
          const statusCode = err.message?.includes('Missing') || err.message?.includes('No LLM') ? 400 : 500;
          res.writeHead(statusCode, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message || 'Decision processing failed' }));
        }
      });
      return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  });

  server.listen(config.port, () => {
    const status = getSystemStatus(config);
    console.log(`\nGreg decision engine is running:`);
    console.log(`  Web app:   http://localhost:${config.port}`);
    console.log(`  LLM API:   ${status.activeLlmProvider || 'Not set up yet'}`);
    console.log(`  Search:    ${status.activeSearchProvider || 'Not set up yet'}`);
    if (!status.isConfigured) {
      console.log(`  Tip:       Add your keys in .env to run real research.`);
    }
    console.log('');

    startCliLoop();
  });
}

function startCliLoop() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function promptUser() {
    rl.question('Ask Greg a decision (or type "exit" to quit): ', async (query) => {
      const trimmed = query.trim();
      if (!trimmed || trimmed.toLowerCase() === 'exit') {
        process.exit(0);
      }

      rl.question('Any constraints? (Press Enter to skip): ', async (constraints) => {
        const status = getSystemStatus(config);
        if (!status.isConfigured) {
          console.error(`\n[Config Error]: ${status.error}`);
          console.error('Please configure your .env file with real API keys.\n');
          promptUser();
          return;
        }

        console.log(`\n[Greg] Searching live web sources and running decision engine...`);
        try {
          const record = await processDecision(
            {
              topic: trimmed,
              constraints: constraints.trim() || undefined,
            },
            config
          );

          console.log(`\n────────────────────────────────────────────────────────`);
          console.log(`🎯 RECOMMENDED WINNER: ${record.consensus.winner.toUpperCase()}`);
          console.log(`⏱  Completed in ${record.executionTimeMs}ms (Confidence: ${record.consensus.confidence})`);
          console.log(`────────────────────────────────────────────────────────`);
          console.log(`\nWhy it wins:`);
          record.consensus.whyItWins.forEach((why) => console.log(`  - ${why}`));
          console.log(`\nMain Trade-off: ${record.consensus.mainTradeoff}`);

          console.log(`\nVerified Sources:`);
          record.sources.forEach((s) => console.log(`  [${s.id}] ${s.title} (${s.domain})`));
          console.log(`────────────────────────────────────────────────────────\n`);
        } catch (err: any) {
          console.error(`[Execution Error]:`, err.message);
        }
        promptUser();
      });
    });
  }

  promptUser();
}

startHttpServer();
