# Alya AI Chat

Alya AI Chat is a React and Vite based web application that communicates with a small Express API server.

## Requirements

- Node.js v22 (see `.nvmrc`)

Use `nvm install` then `nvm use` to activate the correct Node version.

## Environment Variables

Create a `.env` file based on `.env.example` and provide values for:

- `VITE_API_URL` - Base URL used for API requests (e.g. `http://localhost:3001`).

## Server Setup

The Express API is located in the `server/` directory.

```bash
cd server
npm install
cp .env.example .env # edit values if necessary
npm start
```

Server environment variables:

- `PORT` - Port for the API (default `3001`).
- `MONGO_URL` - MongoDB connection string.
- `JWT_SECRET` - Secret used to sign JWT tokens.

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

### Running tests

```bash
npm test
```

Use this command in your CI pipeline to ensure new changes do not break existing functionality.
