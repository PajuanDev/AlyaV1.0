
# Alya AI Chat

This project uses Vite and React.

## Requirements

- Node.js v22 (see `.nvmrc`)

Use `nvm install` then `nvm use` to activate the correct Node version.
=======

# Environment Variables

Create a `.env` file based on `.env.example` and provide values for the following keys:

- `VITE_API_URL` - Base URL used for API requests, e.g. `http://localhost:3000/api`.
- `DB_URL` - Connection string for the database, e.g. `postgresql://user:password@localhost:5432/database`.
- `JWT_SECRET` - Secret value used to sign JWT tokens.

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

Run the Jest test suite with:

```bash
npm test
```

This executes all files in `src/__tests__` using `jest`. The current suite covers the authentication context, chat context and the theme toggle component. Use this command in your CI pipeline to ensure new changes do not break existing functionality.

### Continuous Integration

GitHub Actions runs the test suite on every push and pull request targeting `main`. The workflow defined in `.github/workflows/test.yml` checks out the code, installs Node.js 20, runs `npm install`, and then executes `npm test`.


