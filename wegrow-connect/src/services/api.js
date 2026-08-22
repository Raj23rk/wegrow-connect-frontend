import { API_BASE } from './config';

// =====================================================
// AUTH STORAGE
// =====================================================

/*
 * Authentication is stored in sessionStorage.
 *
 * Required keys:
 * - accessToken
 * - user
 * - role
 */

// =====================================================
// AUTH HEADERS
// =====================================================

export function getAuthHeaders() {
  const token = sessionStorage.getItem('accessToken');

  return {
    'Content-Type': 'application/json',
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

// =====================================================
// GET ACCESS TOKEN
// =====================================================

export function getAccessToken() {
  return sessionStorage.getItem('accessToken');
}

// =====================================================
// CHECK AUTHENTICATION
// =====================================================

export function isAuthenticated() {
  return Boolean(sessionStorage.getItem('accessToken'));
}

// =====================================================
// CLEAR AUTH STORAGE
// =====================================================

export function clearAuthStorage() {
  // Session storage
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('role');

  // Old localStorage authentication
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
}

// =====================================================
// COMMON RESPONSE HANDLER
// =====================================================

async function parseResponse(response) {
  if (response.status === 401 || response.status === 403) {
    clearAuthStorage();
  }

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  console.log('======================================');
  console.log('API STATUS:', response.status);
  console.log('API RESPONSE:', data);
  console.log('======================================');

  return data;
}

// =====================================================
// PROFILE
// =====================================================

export async function fetchProfile() {
  try {
    const response = await fetch(`${API_BASE}/users/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return await parseResponse(response);
  } catch (error) {
    console.error('fetchProfile error:', error);
    return null;
  }
}

// =====================================================
// UPDATE PROFILE
// =====================================================

export async function updateProfile(payload) {
  try {
    const response = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    return await parseResponse(response);
  } catch (error) {
    console.error('updateProfile error:', error);
    return null;
  }
}

// =====================================================
// DELETE PROFILE
// =====================================================

export async function deleteProfile() {
  try {
    const response = await fetch(`${API_BASE}/users/profile`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    return await parseResponse(response);
  } catch (error) {
    console.error('deleteProfile error:', error);
    return null;
  }
}

// =====================================================
// LOGOUT API
// =====================================================

export async function logoutUser() {
  const token = sessionStorage.getItem('accessToken');

  if (!token) {
    clearAuthStorage();
    return null;
  }

  try {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error('logoutUser error:', error);
    return null;
  } finally {
    clearAuthStorage();
  }
}

// =====================================================
// EVENTS / WORKSHOPS API
// =====================================================

export async function getAllEvents() {
  try {
    const response = await fetch(`${API_BASE}/events/all-event?page=1&limit=1000`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await parseResponse(response);

    if (Array.isArray(data?.data)) {
      return data.data;
    }
    if (Array.isArray(data?.data?.events)) {
      return data.data.events;
    }
    if (Array.isArray(data?.events)) {
      return data.events;
    }
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    console.error('getAllEvents error:', error);
    return [];
  }
}

// =====================================================
// GET EVENT BY ID
// =====================================================

export async function getEventById(id) {
  try {
    const response = await fetch(`${API_BASE}/events/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return await parseResponse(response);
  } catch (error) {
    console.error('getEventById error:', error);
    return null;
  }
}

// =====================================================
// CREATE EVENT
// =====================================================

export async function createEvent(payload) {
  try {
    const response = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    return await parseResponse(response);
  } catch (error) {
    console.error('createEvent error:', error);
    return null;
  }
}

// =====================================================
// DELETE EVENT
// =====================================================

export async function deleteEvent(id) {
  try {
    const response = await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    return await parseResponse(response);
  } catch (error) {
    console.error('deleteEvent error:', error);
    return null;
  }
}

// =====================================================
// ADMIN USERS API
// =====================================================

export async function getAdminUsers(page = 1, limit = 10) {
  try {
    const response = await fetch(`${API_BASE}/users/admin/all?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return await parseResponse(response);
  } catch (error) {
    console.error('getAdminUsers error:', error);
    return null;
  }
}

// =====================================================
// ALL BOOKINGS API
// =====================================================

export async function getAllBookings(page = 1, limit = 10) {
  try {
    const response = await fetch(`${API_BASE}/bookings/all-bookings?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    return await parseResponse(response);
  } catch (error) {
    console.error('getAllBookings error:', error);
    return null;
  }
}

// =====================================================
// CREATE BOOKING
// =====================================================

export async function createBooking(eventId) {
  try {
    const token = sessionStorage.getItem('accessToken');

    if (!token) {
      throw new Error('Please login to book this event.');
    }
    if (!eventId) {
      throw new Error('Event ID is missing.');
    }

    console.log('Creating booking for event:', eventId);

    const response = await fetch(`${API_BASE}/bookings/create-booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        event: eventId,
      }),
    });

    return await parseResponse(response);
  } catch (error) {
    console.error('createBooking error:', error);
    throw error;
  }
}

// =====================================================
// NORMALIZE CERTIFICATE
// =====================================================

export function normalizeCertificate(c) {
  if (!c) return null;

  return {
    ...c,
    id: c.id || c._id || c.certificateId || 'CERT-N/A',
    studentName: c.studentName || c.user?.name || c.user?.fullName || c.userName || 'Student',
    studentEmail: c.studentEmail || c.user?.email || c.userEmail || '',
    title: c.title || c.courseName || c.courseTitle || 'Course Certificate',
    courseName: c.courseName || c.title || c.courseTitle || 'Course Certificate',
    issuer: c.issuer || c.instructor || 'WeGrow Skill Campus',
    instructor: c.instructor || c.issuer || 'WeGrow Instructor',
    issueDate:
      c.issueDate ||
      c.issuedAt ||
      (c.createdAt
        ? new Date(c.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'Aug 2026'),
    status: c.status || 'Verified',
    grade: c.grade || 'A+',
    credentialUrl: c.credentialUrl || c.filePath || c.pdfUrl || '#',
    skills: Array.isArray(c.skills)
      ? c.skills
      : typeof c.skills === 'string'
      ? c.skills.split(',').map((s) => s.trim())
      : ['Full Stack Development', 'React', 'Next.js'],
    isUnlocked: c.isUnlocked !== undefined ? Boolean(c.isUnlocked) : c.status !== 'Locked',
    downloads: typeof c.downloads === 'number' ? c.downloads : 0,
  };
}

// =====================================================
// INVOICE NORMALIZATION
// =====================================================

export function normalizeInvoice(inv) {
  if (!inv) return null;

  const rawTotal = inv.total ?? inv.amount ?? inv.subtotal ?? 0;
  const formattedAmount =
    typeof rawTotal === 'number' ? `₹${rawTotal.toLocaleString('en-IN')}` : String(rawTotal);

  const itemsList = Array.isArray(inv.items) ? inv.items : [];
  const planName =
    inv.plan || inv.planName || itemsList[0]?.description || 'Subscription Invoice';

  return {
    ...inv,
    id: inv.id || inv._id || inv.invoiceNumber || 'INV-N/A',
    invoiceNumber: inv.invoiceNumber || inv.id || inv._id || 'INV-N/A',
    date:
      inv.date ||
      inv.issuedDate ||
      (inv.createdAt
        ? new Date(inv.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : '-'),
    issuedDate: inv.issuedDate || inv.date || inv.createdAt || '-',
    amount: inv.amount || formattedAmount,
    total: typeof rawTotal === 'number' ? rawTotal : parseFloat(rawTotal) || 0,
    plan: planName,
    status: inv.status || 'Paid',
    filePath: inv.filePath || inv.pdfUrl || inv.url || '',
    customerName: inv.customerName || inv.user?.name || inv.user?.fullName || inv.userName || 'Customer',
    customerEmail: inv.customerEmail || inv.user?.email || inv.userEmail || '',
  };
}

// =====================================================
// PLAN NORMALIZATION
// =====================================================

export function normalizePlan(plan) {
  if (!plan) return null;

  const price = Number(plan.price ?? plan.monthlyPrice ?? 0) || 0;
  const durationDays = Number(plan.durationDays ?? 30) || 30;

  return {
    ...plan,
    id: plan.id || plan._id || '',
    name: plan.name || 'Subscription Plan',
    type: String(plan.type || 'STUDENT').toUpperCase(),
    description: plan.description || plan.desc || '',
    desc: plan.desc || plan.description || '',
    price,
    currency: plan.currency || 'INR',
    durationDays,
    period: plan.period || (durationDays === 365 ? '/ year' : '/ month'),
    features: Array.isArray(plan.features) ? plan.features : [],
    status: plan.status || 'ACTIVE',
    isActive: plan.isActive !== undefined ? Boolean(plan.isActive) : true,
    monthlyPrice: `₹${price.toLocaleString('en-IN')}`,
    yearlyPrice: `₹${price.toLocaleString('en-IN')}`,
    current: Boolean(plan.current),
    buttonText: plan.buttonText || 'Subscribe Now',
  };
}

// =====================================================
// SUBSCRIPTION NORMALIZER
// =====================================================

export function normalizeSubscription(subscription) {
  if (!subscription) return null;

  const planObject =
    subscription.plan && typeof subscription.plan === 'object' ? subscription.plan : null;
  const userObject =
    subscription.user && typeof subscription.user === 'object' ? subscription.user : null;

  const amount = subscription.amount ?? subscription.price ?? planObject?.price ?? 0;
  const currency = subscription.currency || planObject?.currency || 'INR';
  const durationDays = subscription.durationDays ?? planObject?.durationDays ?? 30;
  const status = subscription.status || 'PENDING';

  return {
    ...subscription,
    id: subscription.id || subscription._id || subscription.subscriptionId || '',
    userId: subscription.userId || userObject?.id || userObject?._id || '',
    userName:
      subscription.userName ||
      userObject?.name ||
      userObject?.fullName ||
      userObject?.username ||
      'Unknown User',
    userEmail: subscription.userEmail || userObject?.email || '-',
    planId: subscription.planId || planObject?.id || planObject?._id || '',
    planName:
      subscription.planName ||
      planObject?.name ||
      (typeof subscription.plan === 'string' ? subscription.plan : 'Unknown Plan'),
    plan: subscription.plan || planObject?.name || 'Unknown Plan',
    type: subscription.type || planObject?.type || 'STUDENT',
    amount: Number(amount) || 0,
    currency,
    durationDays,
    cycle:
      subscription.cycle ||
      subscription.billingCycle ||
      (durationDays === 365 ? 'Yearly' : durationDays === 30 ? 'Monthly' : `${durationDays} Days`),
    startDate: subscription.startDate || subscription.startedAt || null,
    endDate: subscription.endDate || subscription.expiryDate || subscription.expiresAt || null,
    nextBilling:
      subscription.nextBilling ||
      subscription.nextRenewal ||
      subscription.endDate ||
      subscription.expiryDate ||
      subscription.expiresAt ||
      null,
    status,
  };
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

    const data = await parseResponse(response);
    const rawList = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    return rawList.map(normalizeCertificate);
  } catch (error) {
    console.error('getCertificates error:', error);
    return [];
  }
}

// =====================================================
// CREATE CERTIFICATE
// =====================================================

export async function createCertificate(payload) {
  try {
    const response = await fetch(`${API_BASE}/certificates`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await parseResponse(response);
    return data?.data ? normalizeCertificate(data.data) : data;
  } catch (error) {
    console.error('createCertificate error:', error);
    return null;
  }
}

// =====================================================
// GET SUBSCRIPTION PLANS (filtered by type optional)
// =====================================================

export async function getSubscriptions(type) {
  try {
    const endpoint = type
      ? `${API_BASE}/subscriptions/plans?type=${encodeURIComponent(type.toUpperCase())}`
      : `${API_BASE}/subscriptions/plans`;

    console.log('Fetching subscription plans:', endpoint);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await parseResponse(response);
    console.log('Subscription Plans Response:', data);

    let list = [];
    if (Array.isArray(data?.data)) {
      list = data.data;
    } else if (Array.isArray(data?.data?.plans)) {
      list = data.data.plans;
    } else if (Array.isArray(data?.plans)) {
      list = data.plans;
    } else if (Array.isArray(data)) {
      list = data;
    }

    return list.map(normalizePlan).filter(Boolean);
  } catch (error) {
    console.error('getSubscriptions error:', error);
    return [];
  }
}

// =====================================================
// STUDENT SUBSCRIPTION PLANS
// =====================================================

export async function getStudentSubscriptions() {
  try {
    const response = await fetch(`${API_BASE}/subscriptions/plans/student`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await parseResponse(response);
    console.log('Student Plans Response:', data);

    let list = [];
    if (Array.isArray(data?.data)) {
      list = data.data;
    } else if (Array.isArray(data?.data?.plans)) {
      list = data.data.plans;
    } else if (Array.isArray(data?.plans)) {
      list = data.plans;
    } else if (Array.isArray(data)) {
      list = data;
    }

    return list.map(normalizePlan).filter(Boolean);
  } catch (error) {
    console.error('getStudentSubscriptions error:', error);
    return [];
  }
}

// =====================================================
// BUSINESS SUBSCRIPTION PLANS
// =====================================================

export async function getBusinessSubscriptions() {
  try {
    const response = await fetch(`${API_BASE}/subscriptions/plans/business`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await parseResponse(response);
    console.log('Business Plans Response:', data);

    let list = [];
    if (Array.isArray(data?.data)) {
      list = data.data;
    } else if (Array.isArray(data?.data?.plans)) {
      list = data.data.plans;
    } else if (Array.isArray(data?.plans)) {
      list = data.plans;
    } else if (Array.isArray(data)) {
      list = data;
    }

    return list.map(normalizePlan).filter(Boolean);
  } catch (error) {
    console.error('getBusinessSubscriptions error:', error);
    return [];
  }
}

// =====================================================
// CREATE SUBSCRIPTION PLAN
// =====================================================

export async function createSubscriptionPlan(payload) {
  try {
    const response = await fetch(`${API_BASE}/subscriptions/plans`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await parseResponse(response);
    console.log('CREATE PLAN RESPONSE:', data);
    return data;
  } catch (error) {
    console.error('createSubscriptionPlan error:', error);
    throw error;
  }
}

// =====================================================
// UPDATE SUBSCRIPTION PLAN
// =====================================================

export async function updateSubscriptionPlan(id, payload) {
  try {
    if (!id) {
      throw new Error('Subscription plan ID is required.');
    }

    const response = await fetch(`${API_BASE}/subscriptions/plans/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await parseResponse(response);
    console.log('Update Subscription Plan Response:', data);
    return data;
  } catch (error) {
    console.error('updateSubscriptionPlan error:', error);
    return null;
  }
}

// =====================================================
// UPDATE SUBSCRIPTION STATUS
// =====================================================

export async function updateSubscriptionStatus(id, status) {
  try {
    if (!id) {
      throw new Error('Subscription ID is required.');
    }

    const response = await fetch(`${API_BASE}/subscriptions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        status,
      }),
    });

    const data = await parseResponse(response);
    console.log('UPDATE SUBSCRIPTION RESPONSE:', data);
    return data;
  } catch (error) {
    console.error('updateSubscriptionStatus error:', error);
    throw error;
  }
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

    const data = await parseResponse(response);
    const rawList = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    return rawList.map(normalizeInvoice).filter(Boolean);
  } catch (error) {
    console.error('getInvoices error:', error);
    return [];
  }
}

// =====================================================
// CREATE INVOICE
// =====================================================

export async function createInvoice(payload) {
  try {
    const response = await fetch(`${API_BASE}/invoices/create-invoice`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    return await parseResponse(response);
  } catch (error) {
    console.error('createInvoice error:', error);
    return null;
  }
}

// =====================================================
// GET ALL ADMIN SUBSCRIPTIONS
// =====================================================

export async function adminGetSubscriptions(page = 1, limit = 10) {
  try {
    const response = await fetch(`${API_BASE}/subscriptions/all?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await parseResponse(response);
    console.log('ADMIN SUBSCRIPTIONS RESPONSE:', data);

    let list = [];
    if (Array.isArray(data?.data)) {
      list = data.data;
    } else if (Array.isArray(data?.data?.subscriptions)) {
      list = data.data.subscriptions;
    } else if (Array.isArray(data?.subscriptions)) {
      list = data.subscriptions;
    } else if (Array.isArray(data)) {
      list = data;
    }

    return {
      subscriptions: list.map(normalizeSubscription).filter(Boolean),
      total: data?.total ?? data?.data?.total ?? data?.pagination?.total ?? list.length,
      page: data?.page ?? data?.data?.page ?? page,
      limit: data?.limit ?? data?.data?.limit ?? limit,
    };
  } catch (error) {
    console.error('adminGetSubscriptions error:', error);
    return {
      subscriptions: [],
      total: 0,
      page,
      limit,
    };
  }
}

// =====================================================
// ADMIN SUBSCRIPTIONS WITH PAGINATION
// =====================================================

export async function getAdminSubscriptions(page = 1, limit = 10) {
  try {
    const response = await fetch(`${API_BASE}/subscriptions/all?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await parseResponse(response);
    console.log('Admin Subscription Response:', data);

    return {
      subscriptions: Array.isArray(data?.subscriptions)
        ? data.subscriptions
        : Array.isArray(data?.data?.subscriptions)
        ? data.data.subscriptions
        : [],
      pagination: data?.pagination || data?.data?.pagination || {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  } catch (error) {
    console.error('getAdminSubscriptions error:', error);
    return {
      subscriptions: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  }
}

// =====================================================
// BACKWARD COMPATIBILITY
// =====================================================

export const admingetSubscriptions = adminGetSubscriptions;

// =====================================================
// NOTIFICATIONS API
// =====================================================

export async function getNotifications() {
  try {
    const response = await fetch(`${API_BASE}/notifications`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await parseResponse(response);
    return Array.isArray(data?.notifications)
      ? data.notifications
      : Array.isArray(data?.data?.notifications)
      ? data.data.notifications
      : Array.isArray(data?.data)
      ? data.data
      : [];
  } catch (error) {
    console.error('getNotifications error:', error);
    return [];
  }
}

export async function getAdminNotifications() {
  try {
    const response = await fetch(`${API_BASE}/notifications/admin/all`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await parseResponse(response);
    return Array.isArray(data?.notifications)
      ? data.notifications
      : Array.isArray(data?.data?.notifications)
      ? data.data.notifications
      : Array.isArray(data?.data)
      ? data.data
      : [];
  } catch (error) {
    console.error('getAdminNotifications error:', error);
    return [];
  }
}

export async function markNotificationRead(notificationId) {
  try {
    let response = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      response = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
    }
    return await parseResponse(response);
  } catch (error) {
    console.error('markNotificationRead error:', error);
    return null;
  }
}

