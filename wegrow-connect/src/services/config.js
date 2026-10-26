const envBase = import.meta.env?.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.trim().replace(/\/+$/, '')
  : '';

export const API_BASE = envBase
  ? (envBase.endsWith('/api/v1') ? envBase : `${envBase}/api/v1`)
  : 'https://wegrow-connect-backend-1.onrender.com/api/v1';

export const API_ROOT = API_BASE.replace(/\/api\/v1\/?$/, '');
