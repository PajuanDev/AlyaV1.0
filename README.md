# Alya AI Chat

Alya AI Chat is a React and Vite based web application providing an intelligent assistant experience. It offers onboarding to configure your workspace, a dashboard for quick actions and insights, and a chat interface backed by AI. The project includes pages for integrations, automation workflows and more.

## Features

- **AI powered chat interface** with contextual suggestions.
- **Onboarding workflow** that collects company data and user preferences.
- **Dashboard** with quick links to automations and integrations.
- **Automation management** to create and track automated tasks.
- **Documentation, FAQ, and tutorials** sections to help users get started.

## Prerequisites

- **Node.js** 20.19.1 (see `.nvmrc`)
- npm 9+
- Optional global tools: `pnpm` or `yarn` if you prefer alternative package managers.

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

For development with hot reload:

```bash
npm run dev
```

To create an optimized production build:

```bash
npm run build
```

## Development workflow

1. Install dependencies with `npm install`.
2. Use `npm run dev` to start the Vite development server.
3. Code changes in `src/` will hot reload in the browser.
4. Linting can be executed using `npm run lint` once an ESLint configuration is available.
5. When ready, build the project with `npm run build`.

### Running tests

Tests are not included yet. Once a test framework is added (e.g. Jest or Vitest), run:

```bash
npm test
```

Use this command in your CI pipeline to ensure new changes do not break existing functionality.
