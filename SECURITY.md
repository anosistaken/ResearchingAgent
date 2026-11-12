# Security and Responsible Use Policy

## Security

### Reporting Vulnerabilities
If you discover a security vulnerability in Greg, please report it responsibly by contacting the repository maintainers directly or opening a private advisory on GitHub. Do not publish vulnerabilities in public issues.

### Server-Side Secrets
- Never commit `.env` files or API keys.
- All LLM and search provider keys are kept strictly on the backend.
- The web interface never exposes raw API credentials or tokens to the browser.

### Input Sanitization and Rate Limiting
- Greg uses strict schema validation (via Zod) for all inbound API payloads.
- Basic IP rate limiting is enforced on decision endpoints to prevent abuse.
- User input is escaped in HTML outputs to prevent cross-site scripting (XSS).

## Responsible Use

- Ground Truth Verification: Greg cites sources for factual claims. Always verify critical domain-specific constraints (e.g. legal compliance, emergency medical procedures, critical financial decisions) with certified human experts.
- No Guessing: If a specification, benchmark, or pricing tier is unverified, Greg marks it under Unknowns. Do not use AI outputs as financial or legal guarantees.
