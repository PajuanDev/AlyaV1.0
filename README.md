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
=======
- **Node.js** 22.x (see `.nvmrc`)
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

### Running tests


=======
Run the Jest test suite with:


```bash
npm test
```


Use this command in your CI pipeline to ensure new changes do not break existing functionality.
=======
This executes all files in `src/__tests__` using `jest`. The current suite covers the authentication context, chat context and the theme toggle component. Use this command in your CI pipeline to ensure new changes do not break existing functionality.

### Continuous Integration

GitHub Actions runs the test suite on every push and pull request targeting `main`. The workflow defined in `.github/workflows/test.yml` checks out the code, installs Node.js 20, runs `npm install`, and then executes `npm test`.



