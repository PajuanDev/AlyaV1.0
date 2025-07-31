# Alya AI Chat

Alya AI Chat is a full-stack chat application built with React and Vite on the frontend and an Express API backed by MongoDB.

## Requirements

- Node.js v22 (see `.nvmrc`)
- npm 9+

Use `nvm install` then `nvm use` to activate the correct Node version.

## Environment Variables

Create a `.env` file based on `.env.example` and set:

- `VITE_API_URL` – Base URL used by the frontend to contact the API (e.g. `http://localhost:3001`).

For the API server copy `server/.env.example` to `server/.env` and configure:

- `MONGO_URL` – MongoDB connection string.
- `JWT_SECRET` – Secret used to sign JWT tokens.
- `PORT` – Port for the API (defaults to `3001`).

## Installation

Install dependencies for the frontend and the server:

```bash
npm install
cd server && npm install
```

### Development

Start the server:

```bash
cd server
npm start
```

In another terminal, run the frontend with hot reload:

```bash
npm run dev
```

### Build

Create an optimized production build with:

```bash
npm run build
```

### Running tests

Run the Jest test suite with:

```bash
npm test
```

This executes all files in `src/__tests__`. The same command is run in CI.

### Continuous Integration

GitHub Actions runs the test suite on each push and pull request using `.github/workflows/test.yml`.
