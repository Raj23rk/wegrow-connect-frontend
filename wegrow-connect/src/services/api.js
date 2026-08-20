// // =====================================================
// // API CONFIG
// // =====================================================

// export const API_BASE =
//   'https://wegrow-connect-backend-1.onrender.com/api/v1';

// // =====================================================
// // AUTH STORAGE
// // =====================================================

// /*
//  * IMPORTANT:
//  *
//  * We use sessionStorage for authentication.
//  *
//  * sessionStorage:
//  * - survives page refresh
//  * - survives route changes
//  * - works while the browser session is open
//  * - is cleared when the browser session ends
//  *
//  * localStorage is NOT used for authentication anymore.
//  */

// // =====================================================
// // AUTH HEADERS
// // =====================================================

// export function getAuthHeaders() {
//   const token = sessionStorage.getItem('accessToken');

//   return {
//     'Content-Type': 'application/json',
//     ...(token
//       ? { Authorization: `Bearer ${token}` }
//       : {}),
//   };
// }

// // =====================================================
// // PROFILE
// // =====================================================

// export async function fetchProfile() {
//   const response = await fetch(
//     `${API_BASE}/users/profile`,
//     {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     }
//   );

//   /*
//    * If token is expired/invalid,
//    * don't keep the old session.
//    */
//   if (response.status === 401) {
//     clearAuthStorage();
//   }

//   return response.json();
// }

// // =====================================================
// // UPDATE PROFILE
// // =====================================================

// export async function updateProfile(payload) {
//   const response = await fetch(
//     `${API_BASE}/users/profile`,
//     {
//       method: 'PUT',
//       headers: getAuthHeaders(),
//       body: JSON.stringify(payload),
//     }
//   );

//   if (response.status === 401) {
//     clearAuthStorage();
//   }

//   return response.json();
// }

// // =====================================================
// // DELETE PROFILE
// // =====================================================

// export async function deleteProfile() {
//   const response = await fetch(
//     `${API_BASE}/users/profile`,
//     {
//       method: 'DELETE',
//       headers: getAuthHeaders(),
//     }
//   );

//   if (response.status === 401) {
//     clearAuthStorage();
//   }

//   return response.json();
// }

// // =====================================================
// // LOGOUT API
// // =====================================================

// export async function logoutUser() {
//   const token =
//     sessionStorage.getItem('accessToken');

//   /*
//    * If there is no session token,
//    * simply clear local authentication data.
//    */
//   if (!token) {
//     clearAuthStorage();
//     return null;
//   }

//   try {
//     const response = await fetch(
//       `${API_BASE}/auth/logout`,
//       {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return await response.json();
//   } catch (error) {
//     console.error('logoutUser error:', error);

//     return null;
//   } finally {
//     /*
//      * Always clear browser authentication
//      * after logout.
//      */
//     clearAuthStorage();
//   }
// }

// // =====================================================
// // CLEAR AUTH STORAGE
// // =====================================================

// export function clearAuthStorage() {
//   /*
//    * NEW AUTH STORAGE
//    */
//   sessionStorage.removeItem('accessToken');
//   sessionStorage.removeItem('user');
//   sessionStorage.removeItem('role');

//   /*
//    * OLD AUTH STORAGE
//    *
//    * Remove these because your previous application
//    * stored authentication in localStorage.
//    *
//    * This prevents old tokens from automatically
//    * logging the user in.
//    */
//   localStorage.removeItem('accessToken');
//   localStorage.removeItem('user');
//   localStorage.removeItem('role');
// }

// // =====================================================
// // EVENTS / WORKSHOPS API
// // =====================================================

// export async function getAllEvents() {
//   try {
//     const response = await fetch(
//       `${API_BASE}/events`,
//       {
//         method: 'GET',
//         headers: getAuthHeaders(),
//       }
//     );

//     if (response.status === 401) {
//       clearAuthStorage();
//       return [];
//     }

//     const data = await response.json();

//     return data?.data || [];
//   } catch (error) {
//     console.error(
//       'getAllEvents error:',
//       error
//     );

//     return [];
//   }
// }

// // =====================================================
// // CREATE EVENT
// // =====================================================

// export async function createEvent(payload) {
//   const response = await fetch(
//     `${API_BASE}/events`,
//     {
//       method: 'POST',
//       headers: getAuthHeaders(),
//       body: JSON.stringify(payload),
//     }
//   );

//   if (response.status === 401) {
//     clearAuthStorage();
//   }

//   return response.json();
// }

// // =====================================================
// // DELETE EVENT
// // =====================================================

// export async function deleteEvent(id) {
//   const response = await fetch(
//     `${API_BASE}/events/${id}`,
//     {
//       method: 'DELETE',
//       headers: getAuthHeaders(),
//     }
//   );

//   if (response.status === 401) {
//     clearAuthStorage();
//   }

//   return response.json();
// }
// // =====================================================
// // NORMALIZATION HELPERS
// // =====================================================

// export function normalizeCertificate(c) {
//   if (!c) return null;
//   return {
//     ...c,
//     id: c.id || c._id || c.certificateId || 'CERT-N/A',
//     studentName: c.studentName || c.user?.name || c.user?.fullName || c.userName || 'Student',
//     studentEmail: c.studentEmail || c.user?.email || c.userEmail || '',
//     title: c.title || c.courseName || c.courseTitle || 'Course Certificate',
//     courseName: c.courseName || c.title || c.courseTitle || 'Course Certificate',
//     issuer: c.issuer || c.instructor || 'WeGrow Skill Campus',
//     instructor: c.instructor || c.issuer || 'WeGrow Instructor',
//     issueDate: c.issueDate || c.issuedAt || (c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Aug 2026'),
//     status: c.status || 'Verified',
//     grade: c.grade || 'A+',
//     credentialUrl: c.credentialUrl || c.filePath || c.pdfUrl || '#',
//     skills: Array.isArray(c.skills) ? c.skills : (typeof c.skills === 'string' ? c.skills.split(',').map(s => s.trim()) : ['Full Stack Development', 'React', 'Next.js']),
//     isUnlocked: c.isUnlocked !== undefined ? Boolean(c.isUnlocked) : (c.status !== 'Locked'),
//     downloads: typeof c.downloads === 'number' ? c.downloads : 0,
//   };
// }

// export function normalizeInvoice(inv) {
//   if (!inv) return null;
//   const rawTotal = inv.total ?? inv.amount ?? inv.subtotal ?? 0;
//   const formattedAmount = typeof rawTotal === 'number' ? `₹${rawTotal.toLocaleString('en-IN')}` : String(rawTotal);
//   const itemsList = Array.isArray(inv.items) ? inv.items : [];
//   const planName = inv.plan || inv.planName || (itemsList[0]?.description) || 'Subscription Invoice';
  
//   return {
//     ...inv,
//     id: inv.id || inv._id || inv.invoiceNumber || 'INV-N/A',
//     invoiceNumber: inv.invoiceNumber || inv.id || inv._id || 'INV-N/A',
//     date: inv.date || inv.issuedDate || (inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'),
//     issuedDate: inv.issuedDate || inv.date || inv.createdAt || '-',
//     amount: inv.amount || formattedAmount,
//     total: typeof rawTotal === 'number' ? rawTotal : parseFloat(rawTotal) || 0,
//     plan: planName,
//     status: inv.status || 'Paid',
//     filePath: inv.filePath || inv.pdfUrl || inv.url || '',
//     customerName: inv.customerName || inv.user?.name || inv.user?.fullName || inv.userName || 'Customer',
//     customerEmail: inv.customerEmail || inv.user?.email || inv.userEmail || '',
//   };
// }

// export function normalizePlan(plan) {
//   if (!plan) return null;
//   const priceVal = plan.price ?? 0;
//   const priceStr = typeof priceVal === 'number' ? `₹${priceVal.toLocaleString('en-IN')}` : String(priceVal);
//   const planType = (plan.type || 'STUDENT').toUpperCase();
  
//   return {
//     ...plan,
//     id: plan.id || plan._id || plan.name?.toLowerCase().replace(/\s+/g, '-') || 'plan',
//     name: plan.name || 'Subscription Plan',
//     type: planType,
//     desc: plan.desc || plan.description || 'Access WeGrow platform features and mentor guidance.',
//     description: plan.description || plan.desc || 'Access WeGrow platform features and mentor guidance.',
//     monthlyPrice: plan.monthlyPrice || priceStr,
//     yearlyPrice: plan.yearlyPrice || priceStr,
//     price: typeof priceVal === 'number' ? priceVal : parseFloat(priceVal) || 0,
//     period: plan.period || '/ month',
//     popular: Boolean(plan.popular),
//     features: Array.isArray(plan.features) ? plan.features : [],
//     current: Boolean(plan.current),
//     buttonText: plan.buttonText || 'Subscribe Now',
//   };
// }

// // =====================================================
// // CERTIFICATES API
// // =====================================================

// export async function getCertificates() {
//   try {
//     const response = await fetch(`${API_BASE}/certificates`, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     });
//     if (response.status === 401) { clearAuthStorage(); return []; }
//     const data = await response.json();
//     const rawList = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
//     return rawList.map(normalizeCertificate);
//   } catch (error) {
//     console.error('getCertificates error:', error);
//     return [];
//   }
// }

// export async function createCertificate(payload) {
//   const response = await fetch(`${API_BASE}/certificates`, {
//     method: 'POST',
//     headers: getAuthHeaders(),
//     body: JSON.stringify(payload),
//   });
//   if (response.status === 401) clearAuthStorage();
//   const data = await response.json();
//   return data?.data ? normalizeCertificate(data.data) : data;
// }

// // =====================================================
// // SUBSCRIPTIONS API
// // =====================================================

// export async function getStudentSubscriptions() {
//   try {
//     const response = await fetch(`${API_BASE}/subscriptions/plans/student`, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     });
//     if (response.status === 401) { clearAuthStorage(); return []; }
//     const data = await response.json();
//     const rawList = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
//     if (rawList.length > 0) {
//       return rawList.map(normalizePlan);
//     }
//   } catch (error) {
//     console.error('getStudentSubscriptions main endpoint error:', error);
//   }

//   try {
//     const response = await fetch(`${API_BASE}/subscriptions/plans?type=STUDENT`, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     });
//     if (response.status === 401) { clearAuthStorage(); return []; }
//     const data = await response.json();
//     const rawList = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
//     return rawList.map(normalizePlan);
//   } catch (error) {
//     console.error('getStudentSubscriptions fallback error:', error);
//     return [];
//   }
// }

// export async function getBusinessSubscriptions() {
//   try {
//     const response = await fetch(`${API_BASE}/subscriptions/plans/business`, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     });
//     if (response.status === 401) { clearAuthStorage(); return []; }
//     const data = await response.json();
//     const rawList = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
//     if (rawList.length > 0) {
//       return rawList.map(normalizePlan);
//     }
//   } catch (error) {
//     console.error('getBusinessSubscriptions main endpoint error:', error);
//   }

//   try {
//     const response = await fetch(`${API_BASE}/subscriptions/plans?type=BUSINESS`, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     });
//     if (response.status === 401) { clearAuthStorage(); return []; }
//     const data = await response.json();
//     const rawList = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
//     return rawList.map(normalizePlan);
//   } catch (error) {
//     console.error('getBusinessSubscriptions fallback error:', error);
//     return [];
//   }
// }

// export async function getSubscriptions(type) {
//   try {
//     const endpoint = type
//       ? `${API_BASE}/subscriptions/plans?type=${encodeURIComponent(type)}`
//       : `${API_BASE}/subscriptions/plans`;
//     const response = await fetch(endpoint, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     });
//     if (response.status === 401) { clearAuthStorage(); return []; }
//     const data = await response.json();
//     const rawList = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
//     return rawList.map(normalizePlan);
//   } catch (error) {
//     console.error('getSubscriptions error:', error);
//     return [];
//   }
// }

// export async function createSubscriptionPlan(payload) {
//   const response = await fetch(`${API_BASE}/subscriptions/plans`, {
//     method: 'POST',
//     headers: getAuthHeaders(),
//     body: JSON.stringify(payload),
//   });
//   if (response.status === 401) clearAuthStorage();
//   return response.json();
// }

// export async function updateSubscriptionStatus(id, status) {
//   const response = await fetch(`${API_BASE}/subscriptions/${id}`, {
//     method: 'PUT',
//     headers: getAuthHeaders(),
//     body: JSON.stringify({ status }),
//   });
//   if (response.status === 401) clearAuthStorage();
//   return response.json();
// }

// // =====================================================
// // INVOICES API
// // =====================================================

// export async function getInvoices() {
//   try {
//     const response = await fetch(`${API_BASE}/invoices`, {
//       method: 'GET',
//       headers: getAuthHeaders(),
//     });
//     if (response.status === 401) { clearAuthStorage(); return []; }
//     const data = await response.json();
//     const rawList = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
//     return rawList.map(normalizeInvoice);
//   } catch (error) {
//     console.error('getInvoices error:', error);
//     return [];
//   }
// }

// export async function createInvoice(payload) {
//   const response = await fetch(`${API_BASE}/invoices/create-invoice`, {
//     method: 'POST',
//     headers: getAuthHeaders(),
//     body: JSON.stringify(payload),
//   });
//   if (response.status === 401) clearAuthStorage();
//   return response.json();
// }

// export async function adminGetSubscriptions() {
//   try {
//     const response = await fetch(
//       `${API_BASE}/subscriptions/all?page=1&limit=10`,
//       {
//         method: 'GET',
//         headers: getAuthHeaders(),
//       }
//     );

//     if (response.status === 401) {
//       clearAuthStorage();
//       return [];
//     }

//     const data = await response.json();

//     console.log("Subscriptions API Response:", data);

//     return data?.data || [];
//   } catch (error) {
//     console.error("adminGetSubscriptions error:", error);
//     return [];
//   }
// }

// export const admingetSubscriptions = adminGetSubscriptions;

// =====================================================
// API CONFIG
// =====================================================

export const API_BASE =
  'https://wegrow-connect-backend-1.onrender.com/api/v1';


// =====================================================
// AUTH STORAGE
// =====================================================

/*
 * Authentication is stored in sessionStorage.
 *
 * Required keys:
 *
 * accessToken
 * user
 * role
 *
 * Example:
 *
 * sessionStorage.setItem('accessToken', token);
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
  return Boolean(
    sessionStorage.getItem('accessToken')
  );
}


// =====================================================
// CLEAR AUTH STORAGE
// =====================================================

export function clearAuthStorage() {
  // Current session storage
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('role');

  // Remove old localStorage authentication
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
}


// =====================================================
// COMMON RESPONSE HANDLER
// =====================================================

async function parseResponse(response) {
  if (
    response.status === 401 ||
    response.status === 403
  ) {
    clearAuthStorage();
  }

  let data = null;

  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  console.log(
    '======================================'
  );

  console.log(
    'API STATUS:',
    response.status
  );

  console.log(
    'API RESPONSE:',
    data
  );

  console.log(
    '======================================'
  );

  return data;
}


// =====================================================
// PROFILE
// =====================================================

export async function fetchProfile() {
  try {
    const response = await fetch(
      `${API_BASE}/users/profile`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return await parseResponse(response);
  } catch (error) {
    console.error(
      'fetchProfile error:',
      error
    );

    return null;
  }
}


// =====================================================
// UPDATE PROFILE
// =====================================================

export async function updateProfile(payload) {
  try {
    const response = await fetch(
      `${API_BASE}/users/profile`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      }
    );

    return await parseResponse(response);
  } catch (error) {
    console.error(
      'updateProfile error:',
      error
    );

    return null;
  }
}


// =====================================================
// DELETE PROFILE
// =====================================================

export async function deleteProfile() {
  try {
    const response = await fetch(
      `${API_BASE}/users/profile`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }
    );

    return await parseResponse(response);
  } catch (error) {
    console.error(
      'deleteProfile error:',
      error
    );

    return null;
  }
}


// =====================================================
// LOGOUT API
// =====================================================

export async function logoutUser() {
  const token =
    sessionStorage.getItem('accessToken');

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
    console.error(
      'logoutUser error:',
      error
    );

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
    /*
     * API:
     *
     * GET
     * /api/v1/events/all-event?page=1&limit=1000
     */

    const response = await fetch(
      `${API_BASE}/events/all-event?page=1&limit=1000`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const data =
      await parseResponse(response);

    /*
     * Response:
     *
     * {
     *   data: [...]
     * }
     */

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    /*
     * Possible:
     *
     * {
     *   data: {
     *     events: [...]
     *   }
     * }
     */

    if (
      Array.isArray(
        data?.data?.events
      )
    ) {
      return data.data.events;
    }

    /*
     * Possible:
     *
     * {
     *   events: [...]
     * }
     */

    if (
      Array.isArray(data?.events)
    ) {
      return data.events;
    }

    /*
     * Response itself is array
     */

    if (Array.isArray(data)) {
      return data;
    }

    return [];
  } catch (error) {
    console.error(
      'getAllEvents error:',
      error
    );

    return [];
  }
}


// =====================================================
// GET EVENT BY ID
// =====================================================

export async function getEventById(id) {
  try {
    const response = await fetch(
      `${API_BASE}/events/${id}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return await parseResponse(response);
  } catch (error) {
    console.error(
      'getEventById error:',
      error
    );

    return null;
  }
}


// =====================================================
// CREATE EVENT
// =====================================================

export async function createEvent(payload) {
  try {
    const response = await fetch(
      `${API_BASE}/events`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      }
    );

    return await parseResponse(response);
  } catch (error) {
    console.error(
      'createEvent error:',
      error
    );

    return null;
  }
}


// =====================================================
// DELETE EVENT
// =====================================================

export async function deleteEvent(id) {
  try {
    const response = await fetch(
      `${API_BASE}/events/${id}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }
    );

    return await parseResponse(response);
  } catch (error) {
    console.error(
      'deleteEvent error:',
      error
    );

    return null;
  }
}


// =====================================================
// ADMIN USERS API
// =====================================================

export async function getAdminUsers(
  page = 1,
  limit = 10
) {
  try {
    /*
     * API:
     *
     * GET
     * /api/v1/users/admin/all?page=1&limit=10
     */

    const response = await fetch(
      `${API_BASE}/users/admin/all?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const data =
      await parseResponse(response);

    return data;
  } catch (error) {
    console.error(
      'getAdminUsers error:',
      error
    );

    return null;
  }
}


// =====================================================
// ALL BOOKINGS API
// =====================================================

export async function getAllBookings(
  page = 1,
  limit = 10
) {
  try {
    /*
     * API:
     *
     * GET
     * /api/v1/bookings/all-bookings?page=1&limit=10
     */

    const response = await fetch(
      `${API_BASE}/bookings/all-bookings?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const data =
      await parseResponse(response);

    return data;
  } catch (error) {
    console.error(
      'getAllBookings error:',
      error
    );

    return null;
  }
}


// =====================================================
// CREATE BOOKING
// =====================================================

export async function createBooking(eventId) {
  try {
    /*
     * Check login
     */

    const token =
      sessionStorage.getItem('accessToken');

    if (!token) {
      throw new Error(
        'Please login to book this event.'
      );
    }

    /*
     * Check event ID
     */

    if (!eventId) {
      throw new Error(
        'Event ID is missing.'
      );
    }

    console.log(
      'Creating booking for event:',
      eventId
    );

    /*
     * API:
     *
     * POST
     * /api/v1/bookings/create-booking
     *
     * Body:
     *
     * {
     *   event: "EVENT_ID"
     * }
     */

    const response = await fetch(
      `${API_BASE}/bookings/create-booking`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify({
          event: eventId,
        }),
      }
    );

    const data =
      await parseResponse(response);

    /*
     * IMPORTANT:
     *
     * Don't throw here.
     * Return backend response
     * so UI can show backend message.
     */

    return data;
  } catch (error) {
    console.error(
      'createBooking error:',
      error
    );

    throw error;
  }
}


// =====================================================
// NORMALIZATION HELPERS
// =====================================================

export function normalizeCertificate(c) {
  if (!c) return null;

  return {
    ...c,

    id:
      c.id ||
      c._id ||
      c.certificateId ||
      'CERT-N/A',

    studentName:
      c.studentName ||
      c.user?.name ||
      c.user?.fullName ||
      c.userName ||
      'Student',

    studentEmail:
      c.studentEmail ||
      c.user?.email ||
      c.userEmail ||
      '',

    title:
      c.title ||
      c.courseName ||
      c.courseTitle ||
      'Course Certificate',

    courseName:
      c.courseName ||
      c.title ||
      c.courseTitle ||
      'Course Certificate',

    issuer:
      c.issuer ||
      c.instructor ||
      'WeGrow Skill Campus',

    instructor:
      c.instructor ||
      c.issuer ||
      'WeGrow Instructor',

    issueDate:
      c.issueDate ||
      c.issuedAt ||
      (
        c.createdAt
          ? new Date(
              c.createdAt
            ).toLocaleDateString(
              'en-US',
              {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }
            )
          : 'Aug 2026'
      ),

    status:
      c.status ||
      'Verified',

    grade:
      c.grade ||
      'A+',

    credentialUrl:
      c.credentialUrl ||
      c.filePath ||
      c.pdfUrl ||
      '#',

    skills:
      Array.isArray(c.skills)
        ? c.skills
        : typeof c.skills ===
          'string'
        ? c.skills
            .split(',')
            .map(
              (s) => s.trim()
            )
        : [
            'Full Stack Development',
            'React',
            'Next.js',
          ],

    isUnlocked:
      c.isUnlocked !== undefined
        ? Boolean(c.isUnlocked)
        : c.status !== 'Locked',

    downloads:
      typeof c.downloads === 'number'
        ? c.downloads
        : 0,
  };
}


// =====================================================
// INVOICE NORMALIZATION
// =====================================================

export function normalizeInvoice(inv) {
  if (!inv) return null;

  const rawTotal =
    inv.total ??
    inv.amount ??
    inv.subtotal ??
    0;

  const formattedAmount =
    typeof rawTotal === 'number'
      ? `₹${rawTotal.toLocaleString(
          'en-IN'
        )}`
      : String(rawTotal);

  const itemsList =
    Array.isArray(inv.items)
      ? inv.items
      : [];

  const planName =
    inv.plan ||
    inv.planName ||
    itemsList[0]?.description ||
    'Subscription Invoice';

  return {
    ...inv,

    id:
      inv.id ||
      inv._id ||
      inv.invoiceNumber ||
      'INV-N/A',

    invoiceNumber:
      inv.invoiceNumber ||
      inv.id ||
      inv._id ||
      'INV-N/A',

    date:
      inv.date ||
      inv.issuedDate ||
      (
        inv.createdAt
          ? new Date(
              inv.createdAt
            ).toLocaleDateString(
              'en-US',
              {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }
            )
          : '-'
      ),

    issuedDate:
      inv.issuedDate ||
      inv.date ||
      inv.createdAt ||
      '-',

    amount:
      inv.amount ||
      formattedAmount,

    total:
      typeof rawTotal === 'number'
        ? rawTotal
        : parseFloat(rawTotal) || 0,

    plan:
      planName,

    status:
      inv.status ||
      'Paid',

    filePath:
      inv.filePath ||
      inv.pdfUrl ||
      inv.url ||
      '',

    customerName:
      inv.customerName ||
      inv.user?.name ||
      inv.user?.fullName ||
      inv.userName ||
      'Customer',

    customerEmail:
      inv.customerEmail ||
      inv.user?.email ||
      inv.userEmail ||
      '',
  };
}


// =====================================================
// PLAN NORMALIZATION
// =====================================================

export function normalizePlan(plan) {
  if (!plan) return null;

  const priceVal =
    plan.price ?? 0;

  const priceStr =
    typeof priceVal === 'number'
      ? `₹${priceVal.toLocaleString(
          'en-IN'
        )}`
      : String(priceVal);

  const planType =
    (
      plan.type ||
      'STUDENT'
    ).toUpperCase();

  return {
    ...plan,

    id:
      plan.id ||
      plan._id ||
      plan.name
        ?.toLowerCase()
        .replace(
          /\s+/g,
          '-'
        ) ||
      'plan',

    name:
      plan.name ||
      'Subscription Plan',

    type:
      planType,

    desc:
      plan.desc ||
      plan.description ||
      'Access WeGrow platform features and mentor guidance.',

    description:
      plan.description ||
      plan.desc ||
      'Access WeGrow platform features and mentor guidance.',

    monthlyPrice:
      plan.monthlyPrice ||
      priceStr,

    yearlyPrice:
      plan.yearlyPrice ||
      priceStr,

    price:
      typeof priceVal === 'number'
        ? priceVal
        : parseFloat(priceVal) || 0,

    period:
      plan.period ||
      '/ month',

    popular:
      Boolean(plan.popular),

    features:
      Array.isArray(plan.features)
        ? plan.features
        : [],

    current:
      Boolean(plan.current),

    buttonText:
      plan.buttonText ||
      'Subscribe Now',
  };
}


// =====================================================
// CERTIFICATES API
// =====================================================

export async function getCertificates() {
  try {
    const response = await fetch(
      `${API_BASE}/certificates`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const data =
      await parseResponse(response);

    const rawList =
      Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

    return rawList.map(
      normalizeCertificate
    );
  } catch (error) {
    console.error(
      'getCertificates error:',
      error
    );

    return [];
  }
}


// =====================================================
// CREATE CERTIFICATE
// =====================================================

export async function createCertificate(
  payload
) {
  try {
    const response = await fetch(
      `${API_BASE}/certificates`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      }
    );

    const data =
      await parseResponse(response);

    return data?.data
      ? normalizeCertificate(
          data.data
        )
      : data;
  } catch (error) {
    console.error(
      'createCertificate error:',
      error
    );

    return null;
  }
}


// =====================================================
// STUDENT SUBSCRIPTIONS
// =====================================================

export async function getStudentSubscriptions() {
  try {
    const response = await fetch(
      `${API_BASE}/subscriptions/plans/student`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const data =
      await parseResponse(response);

    const rawList =
      Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

    if (rawList.length > 0) {
      return rawList.map(
        normalizePlan
      );
    }
  } catch (error) {
    console.error(
      'getStudentSubscriptions main endpoint error:',
      error
    );
  }

  try {
    const response = await fetch(
      `${API_BASE}/subscriptions/plans?type=STUDENT`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const data =
      await parseResponse(response);

    const rawList =
      Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

    return rawList.map(
      normalizePlan
    );
  } catch (error) {
    console.error(
      'getStudentSubscriptions fallback error:',
      error
    );

    return [];
  }
}


// =====================================================
// BUSINESS SUBSCRIPTIONS
// =====================================================

export async function getBusinessSubscriptions() {
  try {
    const response = await fetch(
      `${API_BASE}/subscriptions/plans/business`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const data =
      await parseResponse(response);

    const rawList =
      Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

    if (rawList.length > 0) {
      return rawList.map(
        normalizePlan
      );
    }
  } catch (error) {
    console.error(
      'getBusinessSubscriptions main endpoint error:',
      error
    );
  }

  try {
    const response = await fetch(
      `${API_BASE}/subscriptions/plans?type=BUSINESS`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const data =
      await parseResponse(response);

    const rawList =
      Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

    return rawList.map(
      normalizePlan
    );
  } catch (error) {
    console.error(
      'getBusinessSubscriptions fallback error:',
      error
    );

    return [];
  }
}


// =====================================================
// GET SUBSCRIPTIONS
// =====================================================

export async function getSubscriptions(
  type
) {
  try {
    const endpoint = type
      ? `${API_BASE}/subscriptions/plans?type=${encodeURIComponent(
          type
        )}`
      : `${API_BASE}/subscriptions/plans`;

    const response = await fetch(
      endpoint,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const data =
      await parseResponse(response);

    const rawList =
      Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

    return rawList.map(
      normalizePlan
    );
  } catch (error) {
    console.error(
      'getSubscriptions error:',
      error
    );

    return [];
  }
}


// =====================================================
// CREATE SUBSCRIPTION PLAN
// =====================================================

export async function createSubscriptionPlan(
  payload
) {
  try {
    const response = await fetch(
      `${API_BASE}/subscriptions/plans`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      }
    );

    return await parseResponse(response);
  } catch (error) {
    console.error(
      'createSubscriptionPlan error:',
      error
    );

    return null;
  }
}


// =====================================================
// UPDATE SUBSCRIPTION STATUS
// =====================================================

export async function updateSubscriptionStatus(
  id,
  status
) {
  try {
    const response = await fetch(
      `${API_BASE}/subscriptions/${id}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status,
        }),
      }
    );

    return await parseResponse(response);
  } catch (error) {
    console.error(
      'updateSubscriptionStatus error:',
      error
    );

    return null;
  }
}


// =====================================================
// INVOICES API
// =====================================================

export async function getInvoices() {
  try {
    const response = await fetch(
      `${API_BASE}/invoices`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const data =
      await parseResponse(response);

    const rawList =
      Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

    return rawList.map(
      normalizeInvoice
    );
  } catch (error) {
    console.error(
      'getInvoices error:',
      error
    );

    return [];
  }
}


// =====================================================
// CREATE INVOICE
// =====================================================

export async function createInvoice(
  payload
) {
  try {
    const response = await fetch(
      `${API_BASE}/invoices/create-invoice`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      }
    );

    return await parseResponse(response);
  } catch (error) {
    console.error(
      'createInvoice error:',
      error
    );

    return null;
  }
}


// =====================================================
// ADMIN SUBSCRIPTIONS
// =====================================================

export async function adminGetSubscriptions() {
  try {
    const response = await fetch(
      `${API_BASE}/subscriptions/all?page=1&limit=10`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const data =
      await parseResponse(response);

    console.log(
      'Subscriptions API Response:',
      data
    );

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (
      Array.isArray(
        data?.data?.subscriptions
      )
    ) {
      return data.data.subscriptions;
    }

    if (
      Array.isArray(
        data?.subscriptions
      )
    ) {
      return data.subscriptions;
    }

    return [];
  } catch (error) {
    console.error(
      'adminGetSubscriptions error:',
      error
    );

    return [];
  }
}


// =====================================================
// BACKWARD COMPATIBILITY
// =====================================================

export const admingetSubscriptions =
  adminGetSubscriptions;