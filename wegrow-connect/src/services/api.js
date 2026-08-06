export const API_BASE = 'http://13.239.234.181:4000/api/v1';

export function getAuthHeaders() {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchProfile() {
  const response = await fetch(`${API_BASE}/users/profile`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function updateProfile(payload) {
  const response = await fetch(`${API_BASE}/users/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return response.json();
}

export async function deleteProfile() {
  const response = await fetch(`${API_BASE}/users/profile`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function logoutUser() {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

export function clearAuthStorage() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
}
