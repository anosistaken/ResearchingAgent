export function renderAppHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#ffffff">
  <title>Greg: Direct Decision Engine</title>
  <meta name="description" content="Research available options, compare what actually matters, verify facts, and get one clear recommendation.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #ffffff;
      --surface: #ffffff;
      --surface-subtle: #fafafa;
      --surface-muted: #f5f5f5;
      
      --text-primary: #171717;
      --text-secondary: #666666;
      --text-tertiary: #8f8f8f;
      --text-inverted: #ffffff;

      --accent-blue: #0070f3;
      --accent-ship: #ff5b4f;
      --accent-preview: #de1d8d;
      --accent-develop: #0a72ef;
      --focus-ring: hsla(212, 100%, 48%, 1);

      /* Vercel Shadow-as-Border tokens */
      --shadow-border: 0px 0px 0px 1px rgba(0, 0, 0, 0.08);
      --shadow-border-hover: 0px 0px 0px 1px rgba(0, 0, 0, 0.16);
      --shadow-card: 0px 0px 0px 1px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.04);
      --shadow-card-hover: 0px 0px 0px 1px rgba(0, 0, 0, 0.14), 0px 4px 12px rgba(0, 0, 0, 0.06);
      --shadow-elevated: 0px 0px 0px 1px rgba(0, 0, 0, 0.08), 0px 8px 24px rgba(0, 0, 0, 0.08);

      --radius-sm: 6px;
      --radius-md: 8px;
      --radius-lg: 12px;

      --font-sans: 'Geist', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: 'Geist Mono', "SF Mono", Menlo, Consolas, monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-feature-settings: "liga" 1, "calt" 1;
    }

    body {
      background-color: var(--bg);
      color: var(--text-primary);
      font-family: var(--font-sans);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      padding-bottom: 8rem;
    }

    ::selection {
      background: #000000;
      color: #ffffff;
    }

    .container {
      max-width: 960px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* Vercel Top Navigation */
    header {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(16px);
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.06);
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
      color: var(--text-primary);
    }

    .logo-badge {
      font-family: var(--font-mono);
      font-weight: 700;
      font-size: 0.76rem;
      background: var(--text-primary);
      color: #ffffff;
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
      letter-spacing: -0.04em;
    }

    .logo-title {
      font-size: 0.92rem;
      font-weight: 600;
      letter-spacing: -0.025em;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .status-pill {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      padding: 0.25rem 0.7rem;
      border-radius: 9999px;
      box-shadow: var(--shadow-border);
      display: flex;
      align-items: center;
      gap: 0.45rem;
      color: var(--text-secondary);
      background: var(--surface);
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--text-tertiary);
    }

    .status-dot.active {
      background: #10b981;
      box-shadow: 0 0 6px rgba(16, 185, 129, 0.5);
    }

    .status-dot.error {
      background: var(--accent-ship);
    }

    .nav-link {
      font-size: 0.82rem;
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.15s ease;
      cursor: pointer;
    }

    .nav-link:hover {
      color: var(--text-primary);
    }

    /* Hero Section */
    .hero {
      padding: 4.5rem 0 2.5rem;
      box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.05);
      margin-bottom: 2.5rem;
    }

    .hero-tag {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-tertiary);
      margin-bottom: 0.85rem;
    }

    .hero h1 {
      font-size: 2.85rem;
      font-weight: 700;
      letter-spacing: -0.055em;
      line-height: 1.08;
      margin-bottom: 1rem;
      color: var(--text-primary);
      text-wrap: balance;
    }

    .hero p {
      font-size: 1.12rem;
      color: var(--text-secondary);
      max-width: 680px;
      line-height: 1.55;
      text-wrap: pretty;
    }

    /* Quick Examples Pills */
    .examples-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1.6rem;
    }

    .examples-label {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-tertiary);
      margin-right: 0.25rem;
    }

    .example-chip {
      background: var(--surface);
      box-shadow: var(--shadow-border);
      border: none;
      border-radius: var(--radius-sm);
      padding: 0.35rem 0.75rem;
      font-size: 0.78rem;
      font-family: var(--font-sans);
      color: var(--text-secondary);
      cursor: pointer;
      transition: box-shadow 0.15s ease, color 0.15s ease, background-color 0.15s ease;
    }

    .example-chip:hover {
      box-shadow: var(--shadow-border-hover);
      color: var(--text-primary);
      background-color: var(--surface-subtle);
    }

    .example-chip:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px var(--focus-ring);
    }

    /* System Configuration Alert */
    #system-alert {
      display: none;
      background: #fff8f8;
      box-shadow: 0 0 0 1px rgba(255, 91, 79, 0.25);
      border-radius: var(--radius-md);
      padding: 1.25rem 1.4rem;
      margin-bottom: 2.5rem;
      font-size: 0.88rem;
    }

    #system-alert h3 {
      font-size: 0.82rem;
      font-family: var(--font-mono);
      color: var(--accent-ship);
      margin-bottom: 0.35rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    #system-alert p {
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }

    #system-alert code {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      background: var(--surface);
      padding: 0.2rem 0.4rem;
      border-radius: var(--radius-sm);
      box-shadow: var(--shadow-border);
    }

    /* Decision Form */
    .form-card {
      background: var(--surface);
      box-shadow: var(--shadow-card);
      border-radius: var(--radius-lg);
      padding: 1.85rem;
      margin-bottom: 2.5rem;
      transition: box-shadow 0.2s ease;
    }

    .form-card:hover {
      box-shadow: var(--shadow-card-hover);
    }

    .form-group {
      margin-bottom: 1.4rem;
    }

    label {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 0.74rem;
      font-family: var(--font-mono);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-secondary);
      margin-bottom: 0.55rem;
      cursor: pointer;
    }

    .label-hint {
      text-transform: none;
      letter-spacing: normal;
      color: var(--text-tertiary);
      font-size: 0.74rem;
    }

    input[type="text"], textarea {
      width: 100%;
      background: #ffffff;
      box-shadow: var(--shadow-border);
      border: none;
      color: var(--text-primary);
      padding: 0.85rem 1rem;
      font-size: 1rem; /* iOS zoom prevention */
      font-family: var(--font-sans);
      border-radius: var(--radius-sm);
      outline: none;
      transition: box-shadow 0.15s ease;
      line-height: 1.5;
    }

    input[type="text"]::placeholder, textarea::placeholder {
      color: var(--text-tertiary);
    }

    input[type="text"]:hover, textarea:hover {
      box-shadow: var(--shadow-border-hover);
    }

    input[type="text"]:focus-visible, textarea:focus-visible {
      box-shadow: 0 0 0 2px var(--focus-ring);
    }

    textarea {
      resize: vertical;
      min-height: 76px;
    }

    .form-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.4rem;
    }

    .active-engine-info {
      font-family: var(--font-mono);
      font-size: 0.74rem;
      color: var(--text-tertiary);
    }

    button.btn-primary {
      background: var(--text-primary);
      color: var(--text-inverted);
      border: none;
      font-family: var(--font-sans);
      font-weight: 500;
      font-size: 0.88rem;
      letter-spacing: -0.01em;
      padding: 0.65rem 1.45rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.08);
      transition: background-color 0.15s ease, opacity 0.15s ease, transform 0.05s ease;
    }

    button.btn-primary:hover {
      background: #000000;
    }

    button.btn-primary:active {
      transform: scale(0.99);
    }

    button.btn-primary:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--focus-ring);
    }

    button.btn-primary:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    button.btn-secondary {
      background: var(--surface);
      color: var(--text-secondary);
      border: none;
      box-shadow: var(--shadow-border);
      font-family: var(--font-sans);
      font-size: 0.78rem;
      font-weight: 500;
      padding: 0.4rem 0.85rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: box-shadow 0.15s ease, color 0.15s ease, background-color 0.15s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }

    button.btn-secondary:hover {
      box-shadow: var(--shadow-border-hover);
      color: var(--text-primary);
      background-color: var(--surface-subtle);
    }

    button.btn-secondary:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px var(--focus-ring);
    }

    /* Loader */
    #loader {
      display: none;
      background: var(--surface);
      box-shadow: var(--shadow-card);
      border-radius: var(--radius-lg);
      padding: 3.5rem 1.5rem;
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .spinner {
      width: 22px;
      height: 22px;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-top-color: var(--text-primary);
      border-radius: 50%;
      animation: spin 0.65s linear infinite;
      margin: 0 auto 1.15rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loader-title {
      font-weight: 600;
      font-size: 0.95rem;
      letter-spacing: -0.02em;
      margin-bottom: 0.35rem;
    }

    .loader-sub {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--text-tertiary);
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
      background: var(--surface);
      box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.14), 0px 8px 30px rgba(0, 0, 0, 0.06);
      border-radius: var(--radius-lg);
      padding: 2.25rem;
      margin-bottom: 2.5rem;
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
      background: var(--text-primary);
      color: #ffffff;
      padding: 0.22rem 0.6rem;
      border-radius: var(--radius-sm);
    }

    .confidence-badge {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      padding: 0.2rem 0.55rem;
      border-radius: var(--radius-sm);
      box-shadow: var(--shadow-border);
      color: var(--text-secondary);
      background: var(--surface-subtle);
    }

    .meta-time {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-tertiary);
      font-variant-numeric: tabular-nums;
    }

    .winner-name {
      font-size: 2.4rem;
      font-weight: 700;
      letter-spacing: -0.05em;
      line-height: 1.12;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .winner-tagline {
      font-size: 1.1rem;
      color: var(--text-secondary);
      margin-bottom: 1.85rem;
      line-height: 1.5;
    }

    .winner-section-title {
      font-family: var(--font-mono);
      font-size: 0.74rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
      margin-bottom: 0.65rem;
    }

    .reasons-list {
      list-style-type: none;
      margin-bottom: 1.85rem;
    }

    .reasons-list li {
      position: relative;
      padding-left: 1.35rem;
      margin-bottom: 0.6rem;
      font-size: 0.95rem;
      color: var(--text-primary);
      line-height: 1.5;
    }

    .reasons-list li::before {
      content: "→";
      position: absolute;
      left: 0;
      color: var(--text-primary);
      font-weight: 600;
    }

    .tradeoff-box {
      background: var(--surface-subtle);
      box-shadow: var(--shadow-border);
      border-radius: var(--radius-md);
      padding: 1rem 1.25rem;
      font-size: 0.9rem;
    }

    .tradeoff-label {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      text-transform: uppercase;
      color: var(--text-tertiary);
      margin-bottom: 0.35rem;
      letter-spacing: 0.04em;
    }

    /* Result Action Bar */
    .result-actions-bar {
      display: flex;
      justify-content: flex-end;
      gap: 0.65rem;
      margin-top: 1.6rem;
      padding-top: 1.35rem;
      box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.06);
    }

    /* Section Headers */
    .section-header {
      font-family: var(--font-mono);
      font-size: 0.74rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
      margin: 2.85rem 0 0.85rem;
    }

    /* Comparison Table (Tabular Numbers) */
    .matrix-wrapper {
      box-shadow: var(--shadow-card);
      border-radius: var(--radius-lg);
      overflow-x: auto;
      background: var(--surface);
      margin-bottom: 2.5rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.88rem;
      text-align: left;
    }

    th, td {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      border-right: 1px solid rgba(0, 0, 0, 0.06);
      vertical-align: top;
      line-height: 1.5;
      font-variant-numeric: tabular-nums;
    }

    th:last-child, td:last-child {
      border-right: none;
    }

    tr:last-child td {
      border-bottom: none;
    }

    th {
      background: var(--surface-subtle);
      font-family: var(--font-mono);
      font-size: 0.74rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-weight: 600;
      color: var(--text-secondary);
    }

    td.metric-col {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--text-secondary);
      background: var(--surface-subtle);
      width: 26%;
    }

    /* 3 Columns Grid */
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
      margin-bottom: 2.5rem;
    }

    @media (max-width: 820px) {
      .grid-3 {
        grid-template-columns: 1fr;
      }
    }

    .info-card {
      background: var(--surface);
      box-shadow: var(--shadow-card);
      border-radius: var(--radius-lg);
      padding: 1.35rem;
    }

    .info-card h4 {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
      margin-bottom: 0.85rem;
      padding-bottom: 0.5rem;
      box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.06);
    }

    .info-card ul {
      list-style-type: none;
      font-size: 0.84rem;
      color: var(--text-secondary);
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
      color: var(--text-tertiary);
    }

    /* 2 Columns Grid */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
      margin-bottom: 2.5rem;
    }

    @media (max-width: 768px) {
      .grid-2 {
        grid-template-columns: 1fr;
      }
    }

    /* Source Citations */
    .sources-card {
      background: var(--surface);
      box-shadow: var(--shadow-card);
      border-radius: var(--radius-lg);
      padding: 1.35rem;
      margin-bottom: 2.5rem;
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
      background: var(--surface-subtle);
      padding: 0.15rem 0.45rem;
      border-radius: var(--radius-sm);
      box-shadow: var(--shadow-border);
      color: var(--text-tertiary);
      flex-shrink: 0;
    }

    .source-link {
      color: var(--text-primary);
      text-decoration: underline;
      text-decoration-color: rgba(0, 0, 0, 0.2);
      text-underline-offset: 3px;
      transition: text-decoration-color 0.15s ease;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .source-link:hover {
      text-decoration-color: var(--text-primary);
    }

    .source-domain {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-tertiary);
      flex-shrink: 0;
    }

    /* History Section */
    .history-section {
      box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.06);
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
      background: var(--surface);
      box-shadow: var(--shadow-card);
      border-radius: var(--radius-md);
      padding: 0.95rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: box-shadow 0.15s ease, background-color 0.15s ease;
      text-decoration: none;
      color: var(--text-primary);
    }

    .history-item:hover {
      box-shadow: var(--shadow-card-hover);
      background-color: var(--surface-subtle);
    }

    .history-topic {
      font-weight: 500;
      font-size: 0.92rem;
      letter-spacing: -0.015em;
      margin-bottom: 0.25rem;
    }

    .history-meta {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-tertiary);
      font-variant-numeric: tabular-nums;
    }

    .history-winner {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--text-primary);
      text-align: right;
    }

    .history-delete-btn {
      background: transparent;
      border: none;
      color: var(--text-tertiary);
      cursor: pointer;
      font-size: 0.9rem;
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
      transition: color 0.15s ease;
      margin-left: 0.75rem;
    }

    .history-delete-btn:hover {
      color: var(--accent-ship);
    }

    /* Bottom-Right Notifications (Vercel Style) */
    #toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column-reverse;
      gap: 0.75rem;
      max-width: 420px;
      width: calc(100vw - 48px);
      pointer-events: none;
    }

    .toast-card {
      background: #ffffff;
      box-shadow: var(--shadow-elevated);
      border-radius: var(--radius-md);
      padding: 1rem 1.25rem;
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      transform: translateY(10px);
      opacity: 0;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
    }

    .toast-card.show {
      transform: translateY(0);
      opacity: 1;
    }

    .toast-card.error {
      box-shadow: 0 0 0 1px rgba(255, 91, 79, 0.35), 0px 8px 24px rgba(255, 91, 79, 0.12);
    }

    .toast-card.success {
      box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.35), 0px 8px 24px rgba(16, 185, 129, 0.12);
    }

    .toast-icon {
      font-size: 0.95rem;
      line-height: 1.2;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .toast-body {
      flex: 1;
      min-width: 0;
    }

    .toast-title {
      font-size: 0.86rem;
      font-weight: 600;
      letter-spacing: -0.015em;
      margin-bottom: 0.25rem;
      color: var(--text-primary);
    }

    .toast-message {
      font-size: 0.8rem;
      color: var(--text-secondary);
      line-height: 1.45;
      word-break: break-word;
    }

    .toast-close {
      background: transparent;
      border: none;
      color: var(--text-tertiary);
      cursor: pointer;
      font-size: 1rem;
      line-height: 1;
      padding: 0.1rem 0.25rem;
      margin-left: 0.25rem;
      transition: color 0.15s ease;
    }

    .toast-close:hover {
      color: var(--text-primary);
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
          <span id="status-text">Checking status…</span>
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

    <!-- Configuration Alert Banner -->
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
            placeholder="e.g. PostgreSQL vs MongoDB vs ClickHouse for high-write event logs…" 
            required 
            minlength="3" 
            maxlength="500"
            autocomplete="off"
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
            placeholder="e.g. Solo developer, under $100/mo cloud cost, 15M writes/day, no Kubernetes…"
            maxlength="1000"
          ></textarea>
        </div>

        <div class="form-bottom">
          <div id="engine-hint" class="active-engine-info">Checking server readiness…</div>
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
      <div class="loader-sub">Pulls live web search, checks sources, and runs decision synthesis…</div>
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

  <div id="toast-container" aria-live="polite"></div>

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
    const exportMdBtn = document.getElementById('export-md-btn');
    const toastContainer = document.getElementById('toast-container');

    function notify({ title, message, type = 'info', duration = 4500 }) {
      const card = document.createElement('div');
      card.className = \`toast-card \${type}\`;

      const iconMap = {
        error: '⚠️',
        success: '✓',
        info: 'ℹ'
      };

      card.innerHTML = \`
        <span class="toast-icon">\${iconMap[type] || 'ℹ'}</span>
        <div class="toast-body">
          <div class="toast-title">\${escapeHtml(title)}</div>
          <div class="toast-message">\${escapeHtml(message)}</div>
        </div>
        <button type="button" class="toast-close" title="Dismiss">&times;</button>
      \`;

      const closeBtn = card.querySelector('.toast-close');
      const dismiss = () => {
        card.classList.remove('show');
        setTimeout(() => card.remove(), 250);
      };

      closeBtn.addEventListener('click', dismiss);
      toastContainer.appendChild(card);

      requestAnimationFrame(() => card.classList.add('show'));

      if (duration > 0) {
        setTimeout(dismiss, duration);
      }
    }

    function showToast(msg) {
      notify({ title: 'Notice', message: msg, type: 'info', duration: 2500 });
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
        } else {
          notify({
            title: 'Load Failed',
            message: 'Could not find or retrieve that saved decision.',
            type: 'error'
          });
        }
      } catch (err) {
        notify({
          title: 'Network Error',
          message: err.message || 'Failed to communicate with server.',
          type: 'error'
        });
      }
    }

    async function deleteHistoryItem(event, id) {
      event.stopPropagation();
      if (!confirm('Delete this saved decision?')) return;

      try {
        const res = await fetch(\`/api/decisions/\${id}\`, { method: 'DELETE' });
        if (res.ok) {
          notify({ title: 'Success', message: 'Decision record deleted.', type: 'success' });
          loadHistory();
          if (currentDecision && currentDecision.id === id) {
            resultView.style.display = 'none';
          }
        } else {
          notify({ title: 'Delete Failed', message: 'Could not delete decision from database.', type: 'error' });
        }
      } catch (err) {
        notify({ title: 'Error', message: err.message || 'Failed to delete record.', type: 'error' });
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
          const rawError = data.error || 'Decision evaluation failed';

          if (rawError.includes('No LLM provider is configured') || rawError.includes('No Web Search provider')) {
            notify({
              title: 'API Configuration Required',
              message: rawError.replace('Please add ', '').replace('to your .env file.', 'Add this to your local .env file to enable live research.'),
              type: 'error',
              duration: 8000
            });
            systemAlert.style.display = 'block';
            systemAlert.scrollIntoView({ behavior: 'smooth' });
          } else if (response.status === 429) {
            notify({
              title: 'Rate Limit Reached',
              message: rawError,
              type: 'error',
              duration: 6000
            });
          } else {
            notify({
              title: 'Decision Error',
              message: rawError,
              type: 'error',
              duration: 7000
            });
          }
          return;
        }

        renderDecision(data);
        loadHistory();
        notify({
          title: 'Decision Ready',
          message: \`Recommended pick: \${data.consensus.winner}\`,
          type: 'success',
          duration: 3500
        });
      } catch (error) {
        notify({
          title: 'Connection Error',
          message: error.message || 'Server is offline or unreachable.',
          type: 'error'
        });
      } finally {
        submitBtn.disabled = false;
        loader.style.display = 'none';
      }
    });

    function renderDecision(record) {
      currentDecision = record;
      const c = record.consensus;

      document.getElementById('res-winner').textContent = c.winner;
      document.getElementById('res-tagline').textContent = c.tagline;
      document.getElementById('res-confidence').textContent = \`Confidence: \${c.confidence}\`;
      document.getElementById('res-meta').textContent = \`\${record.executionTimeMs}ms • \${record.engineUsed}\`;

      exportMdBtn.href = \`/api/decisions/\${record.id}/export\`;

      const reasonsList = document.getElementById('res-reasons');
      reasonsList.innerHTML = c.whyItWins.map(r => \`<li>\${escapeHtml(r)}</li>\`).join('');

      document.getElementById('res-tradeoff').textContent = c.mainTradeoff;

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

      document.getElementById('res-facts').innerHTML = (c.verifiedFacts || []).map(f => \`<li>\${escapeHtml(f)}</li>\`).join('') || '<li>None recorded</li>';
      document.getElementById('res-assumptions').innerHTML = (c.assumptions || []).map(a => \`<li>\${escapeHtml(a)}</li>\`).join('') || '<li>None recorded</li>';
      document.getElementById('res-unknowns').innerHTML = (c.unknowns || []).map(u => \`<li>\${escapeHtml(u)}</li>\`).join('') || '<li>None identified</li>';

      document.getElementById('res-rejected').innerHTML = (c.rejectedAlternatives || []).map(r => \`<li><strong>\${escapeHtml(r.name)}</strong>: \${escapeHtml(r.reasonRejected)}</li>\`).join('') || '<li>No alternatives evaluated</li>';
      document.getElementById('res-fluff').innerHTML = (c.discardedFluff || []).map(f => \`<li>\${escapeHtml(f)}</li>\`).join('') || '<li>No marketing claims cut</li>';

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
