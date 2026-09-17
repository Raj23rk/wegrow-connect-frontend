import { getAuthHeaders } from './api';
import { API_BASE } from './config';

export { API_BASE };

async function parseResponse(response) {
  const contentType = response.headers.get('content-type');
  let data = null;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg =
      (data && data.message) ||
      (typeof data === 'string' ? data : 'API Request Failed');
    throw new Error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
  }

  return data;
}

// =====================================================
// PUBLIC ENDPOINTS (Users / Test Takers)
// =====================================================

/**
 * 1. Submit Business Test (Self-Assessment completion)
 * POST /business-dependency/test
 */
export async function submitBusinessTest(data) {
  try {
    const response = await fetch(`${API_BASE}/business-dependency/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await parseResponse(response);
  } catch (error) {
    // If endpoint returns 404, fallback to /business-dependency
    try {
      const fallback = await fetch(`${API_BASE}/business-dependency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: 'Business Test' }),
      });
      return await parseResponse(fallback);
    } catch (fallbackErr) {
      console.warn('submitBusinessTest backend offline or failed, handled locally:', error);
      throw error;
    }
  }
}

/**
 * 2. Submit Business Diagnostic (Lead booking form)
 * POST /business-dependency/diagnostic
 */
export async function submitBusinessDiagnostic(data) {
  try {
    const response = await fetch(`${API_BASE}/business-dependency/diagnostic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await parseResponse(response);
  } catch (error) {
    // Fallback to /business-dependency
    try {
      const fallback = await fetch(`${API_BASE}/business-dependency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: 'Business Diagnostic' }),
      });
      return await parseResponse(fallback);
    } catch (fallbackErr) {
      console.warn('submitBusinessDiagnostic backend offline or failed, handled locally:', error);
      throw error;
    }
  }
}

/**
 * 3. General submission endpoint
 * POST /business-dependency
 */
export async function submitBusinessDependency(data) {
  try {
    const response = await fetch(`${API_BASE}/business-dependency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await parseResponse(response);
  } catch (error) {
    console.warn('submitBusinessDependency backend offline or failed:', error);
    throw error;
  }
}

// =====================================================
// ADMIN ENDPOINTS (Protected with JwtAuthGuard, AdminGuard)
// =====================================================

/**
 * 4. Get submissions list with pagination, filters, and total counts
 * GET /business-dependency?page=1&limit=10&type=...&search=...&category=...
 */
export async function getBusinessDependencySubmissions(params = {}) {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== 'ALL') {
        query.append(k, v);
      }
    });

    const response = await fetch(`${API_BASE}/business-dependency?${query.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('getBusinessDependencySubmissions error:', error);
    throw error;
  }
}

/**
 * 5. Get aggregate statistics
 * GET /business-dependency/stats
 */
export async function getBusinessDependencyStats() {
  try {
    const response = await fetch(`${API_BASE}/business-dependency/stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('getBusinessDependencyStats error:', error);
    throw error;
  }
}

/**
 * 6. Export CSV
 * GET /business-dependency/export
 */
export async function exportBusinessDependencyCsv(params = {}) {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== 'ALL') {
        query.append(k, v);
      }
    });
    const queryStr = query.toString();
    const url = `${API_BASE}/business-dependency/export${queryStr ? `?${queryStr}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to export CSV from server');
    const blob = await response.blob();

    const fileSuffix = new Date().toISOString().slice(0, 10);
    const typeTag = params.type ? `_${params.type.replace(/\s+/g, '_').toLowerCase()}` : '';
    const filename = `business_dependency${typeTag}_${fileSuffix}.csv`;

    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(objectUrl);
    return true;
  } catch (error) {
    console.error('exportBusinessDependencyCsv error:', error);
    throw error;
  }
}

/**
 * 7. Get single submission by ID
 * GET /business-dependency/:id
 */
export async function getBusinessDependencyById(id) {
  try {
    const response = await fetch(`${API_BASE}/business-dependency/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('getBusinessDependencyById error:', error);
    throw error;
  }
}

/**
 * 8. Patch/Update submission
 * PATCH /business-dependency/:id
 */
export async function updateBusinessDependency(id, data) {
  try {
    const response = await fetch(`${API_BASE}/business-dependency/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('updateBusinessDependency error:', error);
    throw error;
  }
}

/**
 * 9. Delete submission
 * DELETE /business-dependency/:id
 */
export async function deleteBusinessDependency(id) {
  try {
    const response = await fetch(`${API_BASE}/business-dependency/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('deleteBusinessDependency error:', error);
    throw error;
  }
}
