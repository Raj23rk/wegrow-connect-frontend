import { API_BASE } from './config';
import { getAuthHeaders } from './api';

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
// SING ALONG TICKET BOOKING & VERIFICATION APIs
// =====================================================

export async function bookSingAlongTicket(data) {
  try {
    const response = await fetch(`${API_BASE}/sing-along/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('bookSingAlongTicket error:', error);
    throw error;
  }
}

export async function verifySingAlongTicket(id) {
  try {
    const response = await fetch(
      `${API_BASE}/sing-along/verify/${encodeURIComponent(id)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return await parseResponse(response);
  } catch (error) {
    console.error('verifySingAlongTicket error:', error);
    throw error;
  }
}

export async function checkInSingAlongTicket(id) {
  try {
    const response = await fetch(
      `${API_BASE}/sing-along/checkin/${encodeURIComponent(id)}`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      },
    );
    return await parseResponse(response);
  } catch (error) {
    console.error('checkInSingAlongTicket error:', error);
    throw error;
  }
}

export async function getSingAlongBookings(params = {}) {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    const response = await fetch(`${API_BASE}/sing-along?${query.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('getSingAlongBookings error:', error);
    throw error;
  }
}

export async function getSingAlongStats() {
  try {
    const response = await fetch(`${API_BASE}/sing-along/stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('getSingAlongStats error:', error);
    throw error;
  }
}

export async function exportSingAlongCsv() {
  try {
    const response = await fetch(`${API_BASE}/sing-along/export-csv`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to export CSV');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sing_along_bookings_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('exportSingAlongCsv error:', error);
    throw error;
  }
}
