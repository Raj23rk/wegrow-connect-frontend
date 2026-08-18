// =====================================================
// API CONFIG
// =====================================================

export const API_BASE =
  'https://8866-13-239-234-181.ngrok-free.app/api/v1';

// =====================================================
// AUTH STORAGE
// =====================================================

/*
 * IMPORTANT:
 *
 * We use sessionStorage for authentication.
 *
 * sessionStorage:
 * - survives page refresh
 * - survives route changes
 * - works while the browser session is open
 * - is cleared when the browser session ends
 *
 * localStorage is NOT used for authentication anymore.
 */

// =====================================================
// AUTH HEADERS
// =====================================================

export function getAuthHeaders() {
  const token = sessionStorage.getItem('accessToken');

  return {
    'Content-Type': 'application/json',
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {}),
  };
}

// =====================================================
// PROFILE
// =====================================================

export async function fetchProfile() {
  const response = await fetch(
    `${API_BASE}/users/profile`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  /*
   * If token is expired/invalid,
   * don't keep the old session.
   */
  if (response.status === 401) {
    clearAuthStorage();
  }

  return response.json();
}

// =====================================================
// UPDATE PROFILE
// =====================================================

export async function updateProfile(payload) {
  const response = await fetch(
    `${API_BASE}/users/profile`,
    {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  if (response.status === 401) {
    clearAuthStorage();
  }

  return response.json();
}

// =====================================================
// DELETE PROFILE
// =====================================================

export async function deleteProfile() {
  const response = await fetch(
    `${API_BASE}/users/profile`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }
  );

  if (response.status === 401) {
    clearAuthStorage();
  }

  return response.json();
}

// =====================================================
// LOGOUT API
// =====================================================

export async function logoutUser() {
  const token =
    sessionStorage.getItem('accessToken');

  /*
   * If there is no session token,
   * simply clear local authentication data.
   */
  if (!token) {
    clearAuthStorage();
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE}/auth/logout`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error('logoutUser error:', error);

    return null;
  } finally {
    /*
     * Always clear browser authentication
     * after logout.
     */
    clearAuthStorage();
  }
}

// =====================================================
// CLEAR AUTH STORAGE
// =====================================================

export function clearAuthStorage() {
  /*
   * NEW AUTH STORAGE
   */
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('role');

  /*
   * OLD AUTH STORAGE
   *
   * Remove these because your previous application
   * stored authentication in localStorage.
   *
   * This prevents old tokens from automatically
   * logging the user in.
   */
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
}

// =====================================================
// EVENTS / WORKSHOPS API
// =====================================================

export async function getAllEvents() {
  try {
    const response = await fetch(
      `${API_BASE}/events`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    if (response.status === 401) {
      clearAuthStorage();
      return [];
    }

    const data = await response.json();

    return data?.data || [];
  } catch (error) {
    console.error(
      'getAllEvents error:',
      error
    );

    return [];
  }
}

// =====================================================
// CREATE EVENT
// =====================================================

export async function createEvent(payload) {
  const response = await fetch(
    `${API_BASE}/events`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  if (response.status === 401) {
    clearAuthStorage();
  }

  return response.json();
}

// =====================================================
// DELETE EVENT
// =====================================================

export async function deleteEvent(id) {
  const response = await fetch(
    `${API_BASE}/events/${id}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }
  );

  if (response.status === 401) {
    clearAuthStorage();
  }

  return response.json();
}