// ─────────────────────────────────────────────────────────────
// config.js — Backend connection settings
//
// ✏️  EDIT THIS FILE when:
//   - Your backend URL changes
//   - You deploy to Render and need to update the live URL
//
// HOW IT WORKS:
//   - In development (npm start): uses localhost:8000
//   - In production (npm run build): uses your Render URL
// ─────────────────────────────────────────────────────────────

const BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default BASE_URL;
