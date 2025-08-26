// src/url.js
export const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

export function absUrl(path) {
  if (!path) return '';
  if (String(path).startsWith('http')) return path;   // ya viene absoluta
  const p = path.startsWith('/') ? path : '/' + path; // /media/...
  return API_BASE + p;
}
