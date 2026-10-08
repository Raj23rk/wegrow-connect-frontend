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
  const payload = {
    name: data.fullName || data.name || 'Anonymous',
    company: data.company || data.business || 'Not Specified',
    phone: data.phone || '',
    score: Number(data.score ?? 0),
  };
  if (Array.isArray(data.answers)) {
    payload.answers = data.answers;
  }

  try {
    const response = await fetch(`${API_BASE}/business-dependency/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await parseResponse(response);
  } catch (error) {
    console.warn('submitBusinessTest failed:', error);
    throw error;
  }
}

/**
 * 2. Submit Business Diagnostic (Lead booking form)
 * POST /business-dependency/diagnostic
 */
export async function submitBusinessDiagnostic(data) {
  const payload = {
    name: data.fullName || data.name || '',
    company: data.company || data.business || '',
    phone: data.phone || '',
    email: data.email || '',
    designation: data.designation || '',
    industry: data.industry || '',
    businessSize: data.businessSize || data.size || '',
    biggestChallenge: data.biggestChallenge || data.challengeSelect || '',
    challengeDetails: data.challengeDetails || data.challengeNote || '',
    score: Number(data.score ?? 0),
  };
  if (Array.isArray(data.answers)) {
    payload.answers = data.answers;
  }

  try {
    const response = await fetch(`${API_BASE}/business-dependency/diagnostic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await parseResponse(response);
  } catch (error) {
    console.warn('submitBusinessDiagnostic failed:', error);
    throw error;
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

// =====================================================
// MEETUP FEEDBACK ENDPOINTS (Business Transformation Meetup)
// =====================================================

/**
 * 10. Submit Meetup Feedback
 * POST /business-dependency/feedback or /business-dependency/meetup-feedback
 */
export async function submitMeetupFeedback(data) {
  const payload = {
    name: (data.name || data.fullName || '').trim(),
    experience: data.experience || '',
    willingToGrow: data.willingToGrow || data.willing_to_grow || '',
    canRefer: data.canRefer || data.can_refer || '',
    referralName: (data.referralName || data.referral_name || '').trim(),
    referralBusiness: (data.referralBusiness || data.referral_business || '').trim(),
    referralMobile: (data.referralMobile || data.referral_mobile || '').trim(),
    likedMost: (data.likedMost || data.liked_most || '').trim(),
    suggestions: (data.suggestions || '').trim(),
    keyTakeaways: (data.keyTakeaways || data.key_takeaways || '').trim(),
    eventName: data.eventName || 'Business Transformation Meetup',
    eventDate: data.eventDate || '2026-10-09',
    submittedAt: data.submittedAt || new Date().toISOString(),
  };

  const endpoints = [
    `${API_BASE}/business-dependency/feedback`,
    `${API_BASE}/business-dependency/meetup-feedback`,
    `${API_BASE}/business-dependency`,
    `${API_BASE}/feedback`,
    'https://wegrow-connect-backend-1.onrender.com/api/v1/business-dependency/feedback',
    'https://wegrow-connect-backend-1.onrender.com/api/v1/business-dependency/meetup-feedback',
    'https://wegrow-connect-backend-1.onrender.com/api/v1/business-dependency',
    'http://localhost:4000/api/v1/business-dependency/feedback',
    'http://localhost:4000/api/v1/business-dependency/meetup-feedback',
    'http://localhost:5000/business-dependency/feedback',
    '/api/v1/business-dependency/feedback',
    '/business-dependency/feedback'
  ];

  const uniqueEndpoints = [...new Set(endpoints.filter(Boolean))];
  let lastErrorMsg = 'API request failed';

  for (const url of uniqueEndpoints) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return await parseResponse(response);
      }

      // If backend responded with explicit business validation error (400)
      if (response.status === 400 || response.status === 422) {
        return await parseResponse(response);
      }

      lastErrorMsg = `Server responded with status ${response.status} (${response.statusText || 'Not Found'})`;
    } catch (err) {
      lastErrorMsg = err.message || 'Network connection error';
    }
  }

  throw new Error(`Failed to submit feedback: ${lastErrorMsg}`);
}

/**
 * 11. Get Meetup Feedbacks list with Search, Date Filter (e.g. Oct 9), and Status
 * GET /business-dependency/feedback
 */
export async function getMeetupFeedbacks(params = {}) {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== 'ALL') {
        query.append(k, v);
      }
    });

    const url = `${API_BASE}/business-dependency/feedback?${query.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('getMeetupFeedbacks error:', error);
    throw error;
  }
}

/**
 * 12. Get Meetup Feedback Statistics & Analytics
 * GET /business-dependency/feedback/stats
 */
export async function getMeetupFeedbackStats() {
  try {
    const response = await fetch(`${API_BASE}/business-dependency/feedback/stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('getMeetupFeedbackStats error:', error);
    throw error;
  }
}

/**
 * 13. Export Meetup Feedback to CSV
 * GET /business-dependency/feedback/export
 */
export async function exportMeetupFeedbackCsv(params = {}) {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== 'ALL') {
        query.append(k, v);
      }
    });
    const queryStr = query.toString();
    const url = `${API_BASE}/business-dependency/feedback/export${queryStr ? `?${queryStr}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to export feedback CSV');
    const blob = await response.blob();

    const fileSuffix = params.startDate ? `_${params.startDate}_to_${params.endDate || 'now'}` : `_${new Date().toISOString().slice(0, 10)}`;
    const filename = `meetup_feedback${fileSuffix}.csv`;

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
    console.error('exportMeetupFeedbackCsv error:', error);
    throw error;
  }
}

/**
 * 14. Get single Meetup Feedback by ID
 * GET /business-dependency/feedback/:id
 */
export async function getMeetupFeedbackById(id) {
  try {
    const response = await fetch(`${API_BASE}/business-dependency/feedback/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('getMeetupFeedbackById error:', error);
    throw error;
  }
}

/**
 * 15. Update Feedback Status & Notes
 * PATCH /business-dependency/feedback/:id
 */
export async function updateMeetupFeedback(id, data) {
  try {
    const response = await fetch(`${API_BASE}/business-dependency/feedback/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('updateMeetupFeedback error:', error);
    throw error;
  }
}

/**
 * 16. Delete Feedback
 * DELETE /business-dependency/feedback/:id
 */
export async function deleteMeetupFeedback(id) {
  try {
    const response = await fetch(`${API_BASE}/business-dependency/feedback/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('deleteMeetupFeedback error:', error);
    throw error;
  }
}

