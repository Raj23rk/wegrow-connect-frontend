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

/**
 * Alias endpoint to book tickets (POST /sing-along)
 */
export async function bookSingAlongTicketAlias(data) {
  try {
    const response = await fetch(`${API_BASE}/sing-along`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('bookSingAlongTicketAlias error:', error);
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

// =====================================================
// PAYMENTS & RAZORPAY APIs (/payments)
// =====================================================

/**
 * Fetch public Razorpay keyId to initialize Checkout SDK on client
 * GET /api/v1/payments/config
 */
export async function getPaymentConfig() {
  try {
    const response = await fetch(`${API_BASE}/payments/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('getPaymentConfig error:', error);
    throw error;
  }
}

/**
 * Create a Razorpay Order ID for checkout
 * POST /api/v1/payments/create-order
 */
export async function createPaymentOrder(payload) {
  try {
    const response = await fetch(`${API_BASE}/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('createPaymentOrder error:', error);
    throw error;
  }
}

/**
 * Verify payment HMAC-SHA256 signature and confirm booking
 * POST /api/v1/payments/verify
 */
export async function verifyPayment(payload) {
  try {
    const response = await fetch(`${API_BASE}/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('verifyPayment error:', error);
    throw error;
  }
}

/**
 * Get payment status and details by Order ID or Payment ID
 * GET /api/v1/payments/:id
 */
export async function getPaymentDetails(id) {
  try {
    const response = await fetch(
      `${API_BASE}/payments/${encodeURIComponent(id)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return await parseResponse(response);
  } catch (error) {
    console.error('getPaymentDetails error:', error);
    throw error;
  }
}

// =====================================================
// SING ALONG CASHFREE & UPI PAYMENT APIs (/sing-payment)
// =====================================================

/**
 * Submit 12-digit UPI Transaction ID / UTR after QR scan
 * POST /api/v1/sing-payment/submit-utr
 */
export async function submitSingPaymentUtr(payload) {
  try {
    const response = await fetch(`${API_BASE}/sing-payment/submit-utr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('submitSingPaymentUtr error:', error);
    throw error;
  }
}

/**
 * Create Cashfree order & payment_session_id for Sing Along
 * POST /api/v1/sing-payment/create-order
 */
export async function createSingPaymentOrder(payload) {
  try {
    const response = await fetch(`${API_BASE}/sing-payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('createSingPaymentOrder error:', error);
    throw error;
  }
}

/**
 * Verify payment by Order ID and return confirmed booking
 * POST /api/v1/sing-payment/verify
 */
export async function verifySingPayment(payload) {
  try {
    const response = await fetch(`${API_BASE}/sing-payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return await parseResponse(response);
  } catch (error) {
    console.error('verifySingPayment error:', error);
    throw error;
  }
}

/**
 * Get payment status of an order by Order ID
 * GET /api/v1/sing-payment/status/:orderId
 */
export async function getSingPaymentStatus(orderId) {
  try {
    const response = await fetch(
      `${API_BASE}/sing-payment/status/${encodeURIComponent(orderId)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return await parseResponse(response);
  } catch (error) {
    console.error('getSingPaymentStatus error:', error);
    throw error;
  }
}

