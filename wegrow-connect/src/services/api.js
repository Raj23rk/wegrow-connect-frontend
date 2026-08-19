// =====================================================
// API CONFIG
// =====================================================

export const API_BASE =
  'https://wegrow-connect-backend-1.onrender.com/api/v1';

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
// =====================================================
// CERTIFICATES API
// =====================================================

export async function getCertificates() {
  try {
    const response = await fetch(`${API_BASE}/certificates`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (response.status === 401) { clearAuthStorage(); return []; }
    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error('getCertificates error:', error);
    return [];
  }
}

export async function createCertificate(payload) {
  const response = await fetch(`${API_BASE}/certificates`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (response.status === 401) clearAuthStorage();
  return response.json();
}

// =====================================================
// SUBSCRIPTIONS API
// =====================================================

export async function getSubscriptions() {
  try {
    const response = await fetch(`${API_BASE}/subscriptions/plans`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (response.status === 401) { clearAuthStorage(); return []; }
    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error('getSubscriptions error:', error);
    return [];
  }
}

export async function createSubscriptionPlan(payload) {
  const response = await fetch(`${API_BASE}/subscriptions/plans`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (response.status === 401) clearAuthStorage();
  return response.json();
}

export async function updateSubscriptionStatus(id, status) {
  const response = await fetch(`${API_BASE}/subscriptions/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (response.status === 401) clearAuthStorage();
  return response.json();
}

// =====================================================
// INVOICES API
// =====================================================

export async function getInvoices() {
  try {
    const response = await fetch(`${API_BASE}/invoices`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (response.status === 401) { clearAuthStorage(); return []; }
    const data = await response.json();
    return data?.data || [];
  } catch (error) {
    console.error('getInvoices error:', error);
    return [];
  }
}

export async function createInvoice(payload) {
  const response = await fetch(`${API_BASE}/invoices/generate`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (response.status === 401) clearAuthStorage();
  return response.json();
}


export async function admingetSubscriptions() {
  try {
    const response = await fetch(
      `${API_BASE}/subscriptions/all?page=1&limit=10`,
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

    console.log("Subscriptions API Response:", data);

    return data?.data || [];
  } catch (error) {
    console.error("getSubscriptions error:", error);
    return [];
  }
}
