// src/api.js
const BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

export async function api(path) {
  const url = BASE + (path.startsWith('/') ? path : '/' + path);
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}
