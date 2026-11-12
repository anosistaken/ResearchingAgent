# Contributing to Greg

Thank you for your interest in contributing to Greg. We build clean, reliable tools to help people make decisions without wasting hours researching.

## Core Rules

1. Plain English Only:
   - No buzzwords or marketing fluff.
   - Use straightforward language in code, comments, documentation, and UI.

2. Punctuation:
   - Do not use em dashes. Use regular hyphens, colons, or parentheses.

3. Code Standards:
   - Clean, readable TypeScript.
   - Small functions, direct error handling, no bloated abstractions.
   - Never mock AI outputs in production. If API keys are missing, report a clean configuration error.

4. Greg Decision Philosophy:
   - Cut useless information.
   - Compare only what matters.
   - Separate verified facts, assumptions, and unknowns.
   - Provide one clear recommendation.

## Development Workflow

1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and add your development API keys:
   ```bash
   cp .env.example .env
   ```
4. Run in development mode:
   ```bash
   npm run dev
   ```
5. Run the build to verify types and compilation:
   ```bash
   npm run build
   ```
6. Submit a Pull Request describing your changes directly.
