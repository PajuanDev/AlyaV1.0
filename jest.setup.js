import '@testing-library/jest-dom';

// Polyfill matchMedia
if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {}
  });
}

process.env.VITE_API_URL = process.env.VITE_API_URL || 'http://localhost:3001';
