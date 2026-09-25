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
      (data && (data.message || data.error || data.err)) ||
      (typeof data === 'string' ? data : 'API Request Failed');
    throw new Error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
  }

  if (data && typeof data === 'object' && data.success === false) {
    const errorMsg = data.message || data.error || data.err || 'Request failed';
    throw new Error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
  }

  return data;
}

// =====================================================
// CORE SING ALONG PAYMENT & TICKETING OBJECT
// =====================================================
export const singAlongApi = {
  // 1. Submit Manual 12-digit UTR
  async submitManualUtr(data) {
    const res = await fetch(`${API_BASE}/sing-payment/submit-utr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await parseResponse(res);
  },

  // 2. Initialize Cashfree Online Order
  async createOnlineOrder(data) {
    const res = await fetch(`${API_BASE}/sing-payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await parseResponse(res);
  },

  // 3. Payment Status Check by Order ID
  async checkPaymentStatus(orderId) {
    const res = await fetch(`${API_BASE}/sing-payment/status/${encodeURIComponent(orderId)}`);
    return await parseResponse(res);
  },

  // 4. Verify Ticket by Booking ID
  async verifyTicket(bookingId) {
    const res = await fetch(`${API_BASE}/sing-along/verify/${encodeURIComponent(bookingId)}`);
    return await parseResponse(res);
  },
};

// Aliases for compatibility
export const submitSingPaymentUtr = singAlongApi.submitManualUtr;
export const createSingPaymentOrder = singAlongApi.createOnlineOrder;
export const getSingPaymentStatus = singAlongApi.checkPaymentStatus;
export const verifySingAlongTicket = singAlongApi.verifyTicket;

// Ticket View & Download URLs
export function getSingAlongTicketUrl(bookingId) {
  return `${API_BASE}/sing-along/ticket/${encodeURIComponent(bookingId)}`;
}

export async function sendSingAlongTicketEmail(bookingId, email = '') {
  try {
    const response = await fetch(
      `${API_BASE}/sing-along/send-ticket/${encodeURIComponent(bookingId)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ email }),
      }
    );
    return await parseResponse(response);
  } catch (error) {
    console.error('sendSingAlongTicketEmail error:', error);
    throw error;
  }
}

export function getSingAlongTicketDownloadUrl(bookingId) {
  return `${API_BASE}/sing-along/ticket/${encodeURIComponent(bookingId)}/download`;
}

// =====================================================
// ADDITIONAL TICKET BOOKING & ADMIN GATEWAY HELPERS
// =====================================================

export async function bookSingAlongTicket(data) {
  try {
    const response = await fetch(`${API_BASE}/sing-along/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('bookSingAlongTicket error:', error);
    throw error;
  }
}

export async function bookSingAlongTicketAlias(data) {
  try {
    const response = await fetch(`${API_BASE}/sing-along`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('bookSingAlongTicketAlias error:', error);
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
      }
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
    const response = await fetch(`${API_BASE}/sing-along/admin/list?${query.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('getSingAlongBookings error:', error);
    throw error;
  }
}

export async function exportSingAlongCsv(params = {}) {
  try {
    // Build query string from filter params (status, date, etc.)
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    const queryStr = query.toString();
    const url = `${API_BASE}/sing-along/export-csv${queryStr ? `?${queryStr}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to export CSV');
    const blob = await response.blob();

    // Build a descriptive filename based on active filters
    let fileSuffix = new Date().toISOString().slice(0, 10);
    if (params.date) fileSuffix = params.date;
    const statusTag = params.status ? `_${params.status.toLowerCase()}` : '';
    const filename = `sing_along${statusTag}_${fileSuffix}.csv`;

    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(objectUrl);
    return true;
  } catch (error) {
    console.error('exportSingAlongCsv error:', error);
    throw error;
  }
}

// Razorpay helpers
export async function getPaymentConfig() {
  try {
    const response = await fetch(`${API_BASE}/payments/config`);
    return await parseResponse(response);
  } catch (error) {
    console.error('getPaymentConfig error:', error);
    throw error;
  }
}

export async function createPaymentOrder(payload) {
  try {
    const response = await fetch(`${API_BASE}/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('createPaymentOrder error:', error);
    throw error;
  }
}

export async function verifyPayment(payload) {
  try {
    const response = await fetch(`${API_BASE}/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('verifyPayment error:', error);
    throw error;
  }
}

export async function verifySingPayment(payload) {
  try {
    const response = await fetch(`${API_BASE}/sing-payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('verifySingPayment error:', error);
    throw error;
  }
}

export default singAlongApi;
