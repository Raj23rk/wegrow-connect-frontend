const envBase = import.meta.env?.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.trim().replace(/\/+$/, '')
  : '';

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE = (isLocal && (!envBase || envBase.includes('render.com')))
  ? 'http://localhost:4000/api/v1'
  : (envBase
      ? (envBase.endsWith('/api/v1') ? envBase : `${envBase}/api/v1`)
      : 'https://wegrow-connect-backend-1.onrender.com/api/v1');
