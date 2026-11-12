export function renderAppHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Greg: Direct Decision Engine</title>
  <meta name="description" content="Research available options, compare what actually matters, verify facts, and get one clear recommendation.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0b0c0e;
      --card: #121316;
      --card-muted: #18191d;
      --border: #22242a;
      --border-hover: #32353e;
      --border-focus: #525666;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --text-dim: #6b7280;
      --accent: #f9fafb;
      --accent-bg: #1f2127;
      --tag-bg: #181a20;
      --tag-border: #2a2d36;
      --danger: #ef4444;
      --success: #10b981;
      --warning: #f59e0b;
      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', "SF Mono", Menlo, Consolas, monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font-sans);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      padding-bottom: 7rem;
    }

    ::selection {
      background: #272a33;
      color: #fff;
    }

    .container {
      max-width: 980px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* Top Bar */
    header {
      border-bottom: 1px solid var(--border);
      background: rgba(11, 12, 14, 0.82);
      backdrop-filter: blur(16px);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .header-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 56px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      text-decoration: none;
      color: var(--text);
    }

    .logo-badge {
      font-family: var(--font-mono);
      font-weight: 700;
      font-size: 0.8rem;
      background: var(--text);
      color: #000;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      letter-spacing: -0.02em;
    }

    .logo-title {
      font-size: 0.95rem;
      font-weight: 600;
      letter-spacing: -0.02em;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .status-pill {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      padding: 0.22rem 0.65rem;
      border-radius: 9999px;
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 0.45rem;
      color: var(--text-muted);
      background: var(--card);
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--text-dim);
    }

    .status-dot.active {
      background: var(--success);
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
    }

    .status-dot.error {
      background: var(--danger);
    }

    .nav-link {
      font-size: 0.82rem;
      color: var(--text-muted);
      text-decoration: none;
      transition: color 0.15s ease;
      cursor: pointer;
    }

    .nav-link:hover {
      color: var(--text);
    }

    /* Hero */
    .hero {
      padding: 3.5rem 0 2rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 2rem;
    }

    .hero-tag {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-dim);
      margin-bottom: 0.75rem;
    }

    .hero h1 {
      font-size: 2.25rem;
      font-weight: 700;
      letter-spacing: -0.035em;
      line-height: 1.2;
      margin-bottom: 0.75rem;
      color: #fff;
    }

    .hero p {
      font-size: 1.05rem;
      color: var(--text-muted);
      max-width: 720px;
      line-height: 1.6;
    }

    /* Quick Examples Chips */
    .examples-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1.25rem;
    }

    .examples-label {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-dim);
      margin-right: 0.25rem;
    }

    .example-chip {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 0.25rem 0.6rem;
      font-size: 0.78rem;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .example-chip:hover {
      border-color: var(--border-hover);
      color: var(--text);
      background: var(--card-muted);
    }

    /* Alert Banner */
    #system-alert {
      display: none;
      background: rgba(239, 68, 68, 0.06);
      border: 1px solid rgba(239, 68, 68, 0.22);
      border-radius: 6px;
      padding: 1.1rem 1.35rem;
      margin-bottom: 2rem;
      font-size: 0.88rem;
    }

    #system-alert h3 {
      font-size: 0.82rem;
      font-family: var(--font-mono);
      color: var(--danger);
      margin-bottom: 0.35rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    #system-alert p {
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }

    #system-alert code {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      background: #000;
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      border: 1px solid var(--border);
    }

    /* Form Section */
    .form-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1.6rem;
      margin-bottom: 2.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    label {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 0.76rem;
      font-family: var(--font-mono);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }

    .label-hint {
      text-transform: none;
      letter-spacing: normal;
      color: var(--text-dim);
      font-size: 0.72rem;
    }

    input[type="text"], textarea {
      width: 100%;
      background: #07080a;
      border: 1px solid var(--border);
      color: var(--text);
      padding: 0.85rem 1.05rem;
      font-size: 0.95rem;
      font-family: var(--font-sans);
      border-radius: 6px;
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    input[type="text"]:focus, textarea:focus {
      border-color: var(--border-focus);
      box-shadow: 0 0 0 1px var(--border-focus);
    }

    textarea {
      resize: vertical;
      min-height: 72px;
      line-height: 1.5;
    }

    .form-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.5rem;
    }

    .active-engine-info {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-dim);
    }

    button.btn-primary {
      background: var(--accent);
      color: #000;
      border: none;
      font-family: var(--font-sans);
      font-weight: 600;
      font-size: 0.85rem;
      padding: 0.72rem 1.7rem;
      border-radius: 5px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: opacity 0.15s ease, transform 0.1s ease;
    }

    button.btn-primary:hover {
      opacity: 0.92;
    }

    button.btn-primary:active {
      transform: scale(0.99);
    }

    button.btn-primary:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    button.btn-secondary {
      background: transparent;
      color: var(--text-muted);
      border: 1px solid var(--border);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      padding: 0.35rem 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.15s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }

    button.btn-secondary:hover {
      border-color: var(--border-hover);
      color: var(--text);
    }

    /* Loader */
    #loader {
      display: none;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 3.5rem 1.5rem;
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 2px solid var(--border);
      border-top-color: var(--text);
      border-radius: 50%;
      animation: spin 0.65s linear infinite;
      margin: 0 auto 1.15rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loader-title {
      font-weight: 600;
      font-size: 0.98rem;
      margin-bottom: 0.35rem;
    }

    .loader-sub {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--text-dim);
    }

    /* Result View */
    #result-view {
      display: none;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Winner Banner Card */
    .winner-card {
      background: var(--card);
      border: 1px solid #3b3f4d;
      border-radius: 8px;
      padding: 2.2rem;
      margin-bottom: 2.2rem;
      position: relative;
    }

    .winner-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }

    .winner-badges-group {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .winner-badge {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: var(--text);
      color: #000;
      padding: 0.22rem 0.6rem;
      border-radius: 4px;
    }

    .confidence-badge {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      padding: 0.2rem 0.55rem;
      border-radius: 4px;
      border: 1px solid var(--border);
      color: var(--text-muted);
      background: var(--card-muted);
    }

    .meta-time {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-dim);
    }

    .winner-name {
      font-size: 2.2rem;
      font-weight: 700;
      letter-spacing: -0.035em;
      line-height: 1.15;
      margin-bottom: 0.5rem;
      color: #fff;
    }

    .winner-tagline {
      font-size: 1.1rem;
      color: var(--text-muted);
      margin-bottom: 1.75rem;
      line-height: 1.5;
    }

    .winner-section-title {
      font-family: var(--font-mono);
      font-size: 0.74rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-dim);
      margin-bottom: 0.6rem;
    }

    .reasons-list {
      list-style-type: none;
      margin-bottom: 1.75rem;
    }

    .reasons-list li {
      position: relative;
      padding-left: 1.35rem;
      margin-bottom: 0.6rem;
      font-size: 0.95rem;
      color: var(--text);
      line-height: 1.5;
    }

    .reasons-list li::before {
      content: "-";
      position: absolute;
      left: 0;
      color: var(--text-dim);
      font-weight: bold;
    }

    .tradeoff-box {
      background: #090a0d;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 1rem 1.25rem;
      font-size: 0.9rem;
    }

    .tradeoff-label {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      text-transform: uppercase;
      color: var(--text-dim);
      margin-bottom: 0.35rem;
      letter-spacing: 0.04em;
    }

    /* Result Action Bar */
    .result-actions-bar {
      display: flex;
      justify-content: flex-end;
      gap: 0.6rem;
      margin-top: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border);
    }

    /* Section Headers */
    .section-header {
      font-family: var(--font-mono);
      font-size: 0.76rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-dim);
      margin: 2.75rem 0 0.85rem;
    }

    /* Matrix Table */
    .matrix-wrapper {
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow-x: auto;
      background: var(--card);
      margin-bottom: 2rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.88rem;
      text-align: left;
    }

    th, td {
      padding: 0.95rem 1.2rem;
      border-bottom: 1px solid var(--border);
      border-right: 1px solid var(--border);
      vertical-align: top;
      line-height: 1.5;
    }

    th:last-child, td:last-child {
      border-right: none;
    }

    tr:last-child td {
      border-bottom: none;
    }

    th {
      background: #0d0e12;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-weight: 600;
      color: var(--text-muted);
    }

    td.metric-col {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--text-dim);
      background: rgba(0, 0, 0, 0.25);
      width: 25%;
    }

    /* 3 Columns Grid */
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    @media (max-width: 820px) {
      .grid-3 {
        grid-template-columns: 1fr;
      }
    }

    .info-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1.35rem;
    }

    .info-card h4 {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-dim);
      margin-bottom: 0.85rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.5rem;
    }

    .info-card ul {
      list-style-type: none;
      font-size: 0.84rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .info-card ul li {
      margin-bottom: 0.6rem;
      position: relative;
      padding-left: 1.15rem;
    }

    .info-card ul li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: var(--text-dim);
    }

    /* 2 Columns Grid */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
      .grid-2 {
        grid-template-columns: 1fr;
      }
    }

    /* Source Citations */
    .sources-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1.35rem;
      margin-bottom: 2rem;
    }

    .sources-list {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      margin-top: 0.85rem;
    }

    .source-item {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      font-size: 0.84rem;
    }

    .source-index {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      background: var(--card-muted);
      padding: 0.1rem 0.45rem;
      border-radius: 3px;
      border: 1px solid var(--border);
      color: var(--text-dim);
      flex-shrink: 0;
    }

    .source-link {
      color: var(--text);
      text-decoration: none;
      border-bottom: 1px solid var(--border);
      transition: border-color 0.15s ease;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .source-link:hover {
      border-color: var(--text);
    }

    .source-domain {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-dim);
      flex-shrink: 0;
    }

    /* History Section */
    .history-section {
      border-top: 1px solid var(--border);
      padding-top: 2.5rem;
      margin-top: 3.5rem;
    }

    .history-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .history-item {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 0.95rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: all 0.15s ease;
      text-decoration: none;
      color: var(--text);
    }

    .history-item:hover {
      border-color: var(--border-hover);
      background: var(--card-muted);
    }

    .history-topic {
      font-weight: 500;
      font-size: 0.92rem;
      margin-bottom: 0.25rem;
    }

    .history-meta {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-dim);
    }

    .history-winner {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--text);
      text-align: right;
    }

    .history-delete-btn {
      background: transparent;
      border: none;
      color: var(--text-dim);
      cursor: pointer;
      font-size: 0.9rem;
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
      transition: color 0.15s ease;
      margin-left: 0.75rem;
    }

    .history-delete-btn:hover {
      color: var(--danger);
    }

    /* Toast Notification */
    #toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #18191d;
      border: 1px solid var(--border-hover);
      color: var(--text);
      font-size: 0.82rem;
      font-family: var(--font-mono);
      padding: 0.65rem 1.1rem;
      border-radius: 6px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.2s ease;
      pointer-events: none;
      z-index: 100;
    }

    #toast.show {
      opacity: 1;
      transform: translateY(0);
    }
  </style>
</head>
<body>

  <header>
    <div class="container header-inner">
      <a href="/" class="logo">
        <span class="logo-badge">GREG</span>
        <span class="logo-title">Decision Engine</span>
      </a>
      <div class="nav-actions">
        <div id="system-status-pill" class="status-pill">
          <span id="status-dot" class="status-dot"></span>
          <span id="status-text">Checking status...</span>
        </div>
        <a href="#history" class="nav-link">History</a>
        <a href="https://github.com/anosistaken/ResearchingAgent" target="_blank" rel="noopener noreferrer" class="nav-link">GitHub</a>
      </div>
    </div>
  </header>

  <main class="container">
    <section class="hero">
      <div class="hero-tag">Direct AI Evaluation</div>
      <h1>Cut research time. Get one clear recommendation.</h1>
      <p>Greg finds the top contenders, compares factors that actually affect real production use, throws out marketing fluff, and states what is verified vs uncertain.</p>
      
      <div class="examples-bar">
        <span class="examples-label">Try:</span>
        <button type="button" class="example-chip" onclick="setExample('PostgreSQL vs MongoDB vs ClickHouse for high-write event logs', 'Solo developer, under $100/mo cloud cost, 15M writes/day, no Kubernetes')">High-Write Database</button>
        <button type="button" class="example-chip" onclick="setExample('Next.js vs Remix vs Vite SPA for a fast internal dashboard', 'Solo dev, fast turnaround, minimal server maintenance')">Frontend Stack</button>
        <button type="button" class="example-chip" onclick="setExample('Hetzner VPS vs AWS ECS vs Fly.io for hosting Docker services', 'Budget under $50/mo, 3 microservices, predictable billing')">Cloud Infrastructure</button>
      </div>
    </section>

    <!-- Configuration Needed Banner -->
    <div id="system-alert">
      <h3 id="alert-title">Configuration Needed</h3>
      <p id="alert-msg">Missing server environment keys.</p>
      <div>See <code>.env.example</code> to configure Anthropic/OpenAI/Gemini and Tavily/Brave search keys.</div>
    </div>

    <!-- Input Form -->
    <div class="form-card">
      <form id="decision-form">
        <div class="form-group">
          <label for="topic">
            <span>Decision Topic</span>
            <span class="label-hint">What are you deciding between?</span>
          </label>
          <input 
            type="text" 
            id="topic" 
            name="topic" 
            placeholder="e.g. PostgreSQL vs MongoDB vs ClickHouse for high-write event logs" 
            required 
            minlength="3" 
            maxlength="500"
            autocomplete="off"
            autofocus
          >
        </div>

        <div class="form-group">
          <label for="constraints">
            <span>Hard Constraints (Optional)</span>
            <span class="label-hint">Budget, team size, technical requirements</span>
          </label>
          <textarea 
            id="constraints" 
            name="constraints" 
            rows="2" 
            placeholder="e.g. Solo developer, under $100/mo cloud cost, 15M writes/day, no Kubernetes"
            maxlength="1000"
          ></textarea>
        </div>

        <div class="form-bottom">
          <div id="engine-hint" class="active-engine-info">Checking server readiness...</div>
          <button type="submit" id="submit-btn" class="btn-primary">
            <span>Decide for me</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Loading State -->
    <div id="loader">
      <div class="spinner"></div>
      <div class="loader-title">Researching and verifying options</div>
      <div class="loader-sub">Pulls live web search, checks sources, and runs decision synthesis...</div>
    </div>

    <!-- Results Display -->
    <div id="result-view">
      <!-- Winner Card -->
      <div class="winner-card">
        <div class="winner-top">
          <div class="winner-badges-group">
            <span class="winner-badge">Recommended Pick</span>
            <span id="res-confidence" class="confidence-badge"></span>
          </div>
          <span id="res-meta" class="meta-time"></span>
        </div>
        <h2 id="res-winner" class="winner-name"></h2>
        <div id="res-tagline" class="winner-tagline"></div>

        <div class="winner-section-title">Why this option wins</div>
        <ul id="res-reasons" class="reasons-list"></ul>

        <div class="tradeoff-box">
          <div class="tradeoff-label">Accepted Trade-off</div>
          <div id="res-tradeoff"></div>
        </div>

        <div class="result-actions-bar">
          <button type="button" class="btn-secondary" onclick="copyShareSummary()">
            <span>Copy summary</span>
          </button>
          <a id="export-md-btn" href="#" class="btn-secondary" download>
            <span>Download .md</span>
          </a>
        </div>
      </div>

      <!-- Comparison Matrix -->
      <div class="section-header">What Actually Matters (Direct Matrix)</div>
      <div class="matrix-wrapper">
        <table>
          <thead id="matrix-head"></thead>
          <tbody id="matrix-body"></tbody>
        </table>
      </div>

      <!-- 3 Columns: Verified Facts, Assumptions, Unknowns -->
      <div class="grid-3">
        <div class="info-card">
          <h4>Verified Facts</h4>
          <ul id="res-facts"></ul>
        </div>
        <div class="info-card">
          <h4>Reasonable Assumptions</h4>
          <ul id="res-assumptions"></ul>
        </div>
        <div class="info-card">
          <h4>Unknowns (No Guessing)</h4>
          <ul id="res-unknowns"></ul>
        </div>
      </div>

      <!-- 2 Columns: Rejected Alternatives & Discarded Fluff -->
      <div class="grid-2">
        <div class="info-card">
          <h4>Why Alternatives Were Rejected</h4>
          <ul id="res-rejected"></ul>
        </div>
        <div class="info-card">
          <h4>Discarded Marketing Fluff</h4>
          <ul id="res-fluff"></ul>
        </div>
      </div>

      <!-- Source Citations -->
      <div class="sources-card">
        <div class="winner-section-title">Verified Web Sources</div>
        <div id="res-sources" class="sources-list"></div>
      </div>
    </div>

    <!-- History Section -->
    <section id="history" class="history-section">
      <div class="history-top-bar">
        <div class="section-header" style="margin: 0;">Recent Decision History</div>
      </div>
      <div id="history-container" class="history-list">
        <div class="history-meta">No saved decisions yet.</div>
      </div>
    </section>
  </main>

  <div id="toast">Copied to clipboard</div>

  <script>
    let currentDecision = null;

    const form = document.getElementById('decision-form');
    const topicInput = document.getElementById('topic');
    const constraintsInput = document.getElementById('constraints');
    const submitBtn = document.getElementById('submit-btn');
    const loader = document.getElementById('loader');
    const resultView = document.getElementById('result-view');
    const systemAlert = document.getElementById('system-alert');
    const alertMsg = document.getElementById('alert-msg');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    const engineHint = document.getElementById('engine-hint');
    const historyContainer = document.getElementById('history-container');
    const toast = document.getElementById('toast');
    const exportMdBtn = document.getElementById('export-md-btn');

    function showToast(msg) {
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    }

    function setExample(topic, constraints) {
      topicInput.value = topic;
      constraintsInput.value = constraints;
      topicInput.focus();
    }

    // 1. Fetch system status
    async function checkStatus() {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();

        if (data.isConfigured) {
          statusDot.className = 'status-dot active';
          statusText.textContent = 'Ready';
          engineHint.textContent = \`Engine: \${data.activeLlmProvider} • Search: \${data.activeSearchProvider}\`;
          systemAlert.style.display = 'none';
        } else {
          statusDot.className = 'status-dot error';
          statusText.textContent = 'Needs Config';
          systemAlert.style.display = 'block';
          alertMsg.textContent = data.error || 'Server is missing required API keys.';
          engineHint.textContent = 'Configuration missing in .env';
        }
      } catch (err) {
        statusDot.className = 'status-dot error';
        statusText.textContent = 'Offline';
      }
    }

    // 2. Fetch history
    async function loadHistory() {
      try {
        const res = await fetch('/api/decisions');
        const data = await res.json();
        if (data.decisions && data.decisions.length > 0) {
          historyContainer.innerHTML = data.decisions.map(d => \`
            <div class="history-item" onclick="loadSingleDecision('\${d.id}')">
              <div style="flex: 1; min-width: 0;">
                <div class="history-topic">\${escapeHtml(d.topic)}</div>
                <div class="history-meta">\${new Date(d.createdAt).toLocaleDateString()} • \${d.executionTimeMs}ms • Confidence: \${d.confidence}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div class="history-winner">
                  <span>Pick: <strong>\${escapeHtml(d.winner)}</strong></span>
                </div>
                <button class="history-delete-btn" title="Delete record" onclick="deleteHistoryItem(event, '\${d.id}')">✕</button>
              </div>
            </div>
          \`).join('');
        } else {
          historyContainer.innerHTML = '<div class="history-meta">No saved decisions yet.</div>';
        }
      } catch (err) {
        console.error('Failed to load history', err);
      }
    }

    async function loadSingleDecision(id) {
      try {
        const res = await fetch(\`/api/decisions/\${id}\`);
        if (res.ok) {
          const decision = await res.json();
          renderDecision(decision);
        }
      } catch (err) {
        alert('Could not load decision: ' + err.message);
      }
    }

    async function deleteHistoryItem(event, id) {
      event.stopPropagation();
      if (!confirm('Delete this saved decision?')) return;

      try {
        const res = await fetch(\`/api/decisions/\${id}\`, { method: 'DELETE' });
        if (res.ok) {
          showToast('Decision deleted');
          loadHistory();
          if (currentDecision && currentDecision.id === id) {
            resultView.style.display = 'none';
          }
        }
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    }

    // 3. Submit decision
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const topic = topicInput.value.trim();
      const constraints = constraintsInput.value.trim();

      if (!topic) return;

      submitBtn.disabled = true;
      loader.style.display = 'block';
      resultView.style.display = 'none';

      try {
        const response = await fetch('/api/decisions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, constraints })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Decision evaluation failed');
        }

        renderDecision(data);
        loadHistory();
      } catch (error) {
        alert('Decision error: ' + error.message);
      } finally {
        submitBtn.disabled = false;
        loader.style.display = 'none';
      }
    });

    function renderDecision(record) {
      currentDecision = record;
      const c = record.consensus;

      // Header & Winner
      document.getElementById('res-winner').textContent = c.winner;
      document.getElementById('res-tagline').textContent = c.tagline;
      document.getElementById('res-confidence').textContent = \`Confidence: \${c.confidence}\`;
      document.getElementById('res-meta').textContent = \`\${record.executionTimeMs}ms • \${record.engineUsed}\`;

      exportMdBtn.href = \`/api/decisions/\${record.id}/export\`;

      // Why it wins
      const reasonsList = document.getElementById('res-reasons');
      reasonsList.innerHTML = c.whyItWins.map(r => \`<li>\${escapeHtml(r)}</li>\`).join('');

      // Tradeoff
      document.getElementById('res-tradeoff').textContent = c.mainTradeoff;

      // Matrix
      const thead = document.getElementById('matrix-head');
      const tbody = document.getElementById('matrix-body');

      thead.innerHTML = \`
        <tr>
          <th>Evaluation Factor</th>
          \${record.matrix.options.map(opt => \`<th>\${escapeHtml(opt)}</th>\`).join('')}
        </tr>
      \`;

      tbody.innerHTML = record.matrix.metrics.map(m => \`
        <tr>
          <td class="metric-col">\${escapeHtml(m.name)}</td>
          \${record.matrix.options.map(opt => \`<td>\${escapeHtml(m.values[opt] || '-')}</td>\`).join('')}
        </tr>
      \`).join('');

      // Facts, Assumptions, Unknowns
      document.getElementById('res-facts').innerHTML = (c.verifiedFacts || []).map(f => \`<li>\${escapeHtml(f)}</li>\`).join('') || '<li>None recorded</li>';
      document.getElementById('res-assumptions').innerHTML = (c.assumptions || []).map(a => \`<li>\${escapeHtml(a)}</li>\`).join('') || '<li>None recorded</li>';
      document.getElementById('res-unknowns').innerHTML = (c.unknowns || []).map(u => \`<li>\${escapeHtml(u)}</li>\`).join('') || '<li>None identified</li>';

      // Rejected & Fluff
      document.getElementById('res-rejected').innerHTML = (c.rejectedAlternatives || []).map(r => \`<li><strong>\${escapeHtml(r.name)}</strong>: \${escapeHtml(r.reasonRejected)}</li>\`).join('') || '<li>No alternatives evaluated</li>';
      document.getElementById('res-fluff').innerHTML = (c.discardedFluff || []).map(f => \`<li>\${escapeHtml(f)}</li>\`).join('') || '<li>No marketing claims cut</li>';

      // Sources
      const sourcesDiv = document.getElementById('res-sources');
      sourcesDiv.innerHTML = record.sources.map(s => \`
        <div class="source-item">
          <span class="source-index">[Source \${s.id}]</span>
          <a class="source-link" href="\${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">\${escapeHtml(s.title)}</a>
          <span class="source-domain">\${escapeHtml(s.domain)}</span>
        </div>
      \`).join('');

      resultView.style.display = 'block';
      resultView.scrollIntoView({ behavior: 'smooth' });
    }

    function copyShareSummary() {
      if (!currentDecision) return;
      const c = currentDecision.consensus;
      const text = \`GREG DECISION: \${currentDecision.topic}
Recommended Pick: \${c.winner}
Why: \${c.tagline}
Trade-off: \${c.mainTradeoff}\`;

      navigator.clipboard.writeText(text).then(() => {
        showToast('Summary copied to clipboard');
      });
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    checkStatus();
    loadHistory();
  </script>
</body>
</html>`;
}
