const {
  VITE_API_URL: apiUrl,
  DB_URL: dbUrl,
  JWT_SECRET: jwtSecret
} = process.env;

export const API_URL = apiUrl;
export const DB_URL = dbUrl;
export const JWT_SECRET = jwtSecret;
