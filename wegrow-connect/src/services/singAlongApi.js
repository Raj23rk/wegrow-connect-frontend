import { getAuthHeaders } from './api';

// Base URLs: Local backend if running on localhost, otherwise Render production
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
export const API_BASE = isLocal
  ? 'http://localhost:3000/api/v1'
  : 'https://wegrow-connect-backend-1.onrender.com/api/v1';

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
    return res.json();
  },

  // 2. Initialize Cashfree Online Order
  async createOnlineOrder(data) {
    const res = await fetch(`${API_BASE}/sing-payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // 3. Payment Status Check by Order ID
  async checkPaymentStatus(orderId) {
    const res = await fetch(`${API_BASE}/sing-payment/status/${encodeURIComponent(orderId)}`);
    return res.json();
  },

  // 4. Verify Ticket by Booking ID
  async verifyTicket(bookingId) {
    const res = await fetch(`${API_BASE}/sing-along/verify/${encodeURIComponent(bookingId)}`);
    return res.json();
  },
};

// Aliases for compatibility
export const submitSingPaymentUtr = singAlongApi.submitManualUtr;
export const createSingPaymentOrder = singAlongApi.createOnlineOrder;
export const getSingPaymentStatus = singAlongApi.checkPaymentStatus;
export const verifySingAlongTicket = singAlongApi.verifyTicket;

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
