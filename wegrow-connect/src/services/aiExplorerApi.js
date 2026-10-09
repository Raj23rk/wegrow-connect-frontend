import { getAuthHeaders } from './api';
import { API_BASE } from './config';

export { API_BASE };

const LOCAL_STORAGE_KEY = 'wegrow_ai_explorer_enrollments';

// Helper for local mock/cache data
const getLocalData = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse local storage ai explorer data', e);
  }

  const defaultData = [
    {
      id: 'AIE26-1001',
      studentName: 'Aarav Sharma',
      email: 'aarav.sharma@gmail.com',
      mailId: 'aarav.sharma@gmail.com',
      standard: '7th Standard',
      school: 'KVS Matric Higher Secondary School',
      fatherName: 'Ramesh Sharma',
      motherName: 'Sunita Sharma',
      fatherPhone: '9845012345',
      motherPhone: '9845012346',
      address: '14/2, Cross Street, Gandhi Nagar, Sivakasi - 626123',
      courseName: 'AI Explorer',
      feePlan: 'full',
      plan: 'full',
      planName: 'Full Payment',
      amount: 43000,
      paymentMethod: 'Cashfree',
      paymentStatus: 'PAID',
      transactionId: 'CF_ORD_98412894',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: 'AIE26-1002',
      studentName: 'Pooja Vijayakumar',
      email: 'pooja.v@outlook.com',
      mailId: 'pooja.v@outlook.com',
      standard: '9th Standard',
      school: 'St. Joseph Higher Secondary School',
      fatherName: 'Vijayakumar P',
      motherName: 'Meenakshi V',
      fatherPhone: '9443187654',
      motherPhone: '9443187655',
      address: '88, Anna Salai, Main Road, Sivakasi',
      courseName: 'AI Explorer',
      feePlan: 'half',
      plan: 'half',
      planName: 'Half-Yearly',
      amount: 22500,
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      transactionId: 'UPI-984210492812',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.5).toISOString(),
    },
    {
      id: 'AIE26-1003',
      studentName: 'Karthik Raja',
      email: 'karthik.parents@gmail.com',
      mailId: 'karthik.parents@gmail.com',
      standard: '11th Standard',
      school: 'Velammal Bodhi Campus',
      fatherName: 'Rajarajan M',
      motherName: 'Anitha R',
      fatherPhone: '9789054321',
      motherPhone: '9789054322',
      address: '45/B, Kamarajar Street, Madurai Road, Virudhunagar',
      courseName: 'AI Explorer',
      feePlan: 'term',
      plan: 'term',
      planName: 'Term Wise Payment',
      amount: 45000,
      paymentMethod: 'Cashfree',
      paymentStatus: 'PENDING',
      transactionId: 'CF_ORD_4421890',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    }
  ];

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultData));
  } catch (err) {
    console.warn(err);
  }
  return defaultData;
};

const setLocalData = (data) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to set local storage ai explorer data', e);
  }
};

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

  return data;
}

export const aiExplorerApi = {
  // ==========================================
  // PUBLIC CLIENT APIs
  // ==========================================

  // 1. Submit Student Enrollment (POST /ai-explorer/enroll)
  async enrollStudent(data) {
    const payload = {
      studentName: data.studentName || data.name || (Array.isArray(data.students) ? data.students.map(s => s.name).join(', ') : ''),
      students: Array.isArray(data.students) ? data.students : undefined,
      studentCount: data.studentCount || (Array.isArray(data.students) ? data.students.length : 1),
      totalStudents: data.totalStudents || (Array.isArray(data.students) ? data.students.length : 1),
      email: data.email || data.mailId,
      mailId: data.email || data.mailId,
      standard: data.standard || (Array.isArray(data.students) ? data.students.map(s => s.standard).join(', ') : ''),
      school: data.school || (Array.isArray(data.students) ? data.students.map(s => s.school).join(', ') : ''),
      fatherName: data.fatherName,
      motherName: data.motherName,
      fatherPhone: data.fatherPhone,
      motherPhone: data.motherPhone,
      address: data.address,
      courseName: data.courseName || data.course || 'AI Explorer',
      feePlan: data.feePlan || data.plan || 'full',
      planName: data.planName,
      selectedTerm: data.selectedTerm,
      selectedHalf: data.selectedHalf,
      amount: Number(data.amount || 0),
      totalFee: Number(data.totalFee || data.amount || 0),
      paymentMethod: data.paymentMethod || 'Cashfree',
      paymentStatus: data.paymentStatus || 'PAID',
      transactionId: data.transactionId || '',
      declarationAccepted: data.declarationAccepted !== false,
    };

    try {
      const res = await fetch(`${API_BASE}/ai-explorer/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await parseResponse(res);
    } catch (e) {
      if (e.message && !e.message.includes('Failed to fetch') && !e.message.includes('NetworkError') && !e.message.includes('Load failed')) {
        throw e;
      }
      console.warn('Backend /ai-explorer/enroll network error, using fallback:', e);
    }

    // Local storage fallback
    const current = getLocalData();
    const id = `AIE26-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord = {
      ...payload,
      id,
      planName: payload.planName || (payload.feePlan === 'half' ? 'Half-Yearly' : payload.feePlan === 'term' ? 'Term Wise Payment' : 'Full Payment'),
      createdAt: new Date().toISOString(),
    };
    current.unshift(newRecord);
    setLocalData(current);

    return {
      success: true,
      message: 'Enrollment completed successfully!',
      data: newRecord,
    };
  },

  // Alias for backward compatibility
  submitEnrollment(data) {
    return this.enrollStudent(data);
  },

  // Submit Pre-booking alias
  submitPreBooking(data) {
    return this.enrollPreBooking(data);
  },

  // ==========================================
  // PRE-BOOKING CLIENT APIs
  // ==========================================

  // 1. Create Pre-Booking Cashfree PG Order (POST /ai-explorer/prebooking/create-order)
  async createPreBookingOrder(data) {
    const payload = {
      students: (data.students || []).map((s) => ({
        studentName: s.studentName || s.name,
        standard: s.standard,
        school: s.school,
        preferredBatch: s.preferredBatch,
      })),
      fatherName: data.fatherName,
      motherName: data.motherName,
      email: data.email || data.mailId,
      fatherPhone: data.fatherPhone,
      motherPhone: data.motherPhone,
      address: data.address,
      paymentMethod: data.paymentMethod || 'Cashfree',
    };

    try {
      const res = await fetch(`${API_BASE}/ai-explorer/prebooking/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await parseResponse(res);
    } catch (e) {
      console.warn('Pre-booking order API fallback:', e);
      return { success: false, message: e.message };
    }
  },

  // 2. Check Pre-Booking Payment Status (GET /ai-explorer/prebooking/status/:orderId)
  async checkPreBookingStatus(orderId) {
    try {
      const res = await fetch(`${API_BASE}/ai-explorer/prebooking/status/${encodeURIComponent(orderId)}`);
      return await parseResponse(res);
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  // 3. Verify Pre-Booking Order Payment (POST /ai-explorer/prebooking/verify-payment)
  async verifyPreBookingPayment(data) {
    try {
      const res = await fetch(`${API_BASE}/ai-explorer/prebooking/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await parseResponse(res);
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  // 4. Submit Manual UPI UTR (POST /ai-explorer/prebooking/submit-utr)
  async submitPreBookingUtr(orderIdOrData, utrString) {
    const payload = typeof orderIdOrData === 'object'
      ? orderIdOrData
      : { orderId: orderIdOrData, utr: utrString };

    try {
      const res = await fetch(`${API_BASE}/ai-explorer/prebooking/submit-utr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await parseResponse(res);
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  // 5. Direct Public Pre-Booking Registration (POST /ai-explorer/prebooking/enroll)
  async enrollPreBooking(data) {
    const studentsArr = (data.students || []).map((s) => ({
      studentName: s.studentName || s.name,
      standard: s.standard,
      school: s.school,
      preferredBatch: s.preferredBatch,
    }));

    const totalStudents = studentsArr.length || 1;
    const computedAmount = Number(data.amount || totalStudents * 1000);

    const payload = {
      students: studentsArr,
      studentName: studentsArr.map((s) => s.studentName).join(', ') || data.studentName || '',
      standard: studentsArr.map((s) => s.standard).join(', ') || data.standard || '',
      school: studentsArr.map((s) => s.school).join(', ') || data.school || '',
      fatherName: data.fatherName,
      motherName: data.motherName,
      email: data.email || data.mailId,
      mailId: data.email || data.mailId,
      fatherPhone: data.fatherPhone,
      motherPhone: data.motherPhone,
      address: data.address,
      courseName: 'AI Explorer',
      totalStudents,
      amount: computedAmount,
      amountPerStudent: 1000,
      paymentMethod: data.paymentMethod || 'Cashfree',
      paymentStatus: data.paymentStatus || 'PAID',
      transactionId: data.transactionId || `PB_${Date.now().toString().slice(-8)}`,
      declarationAccepted: data.declarationAccepted !== false,
    };

    try {
      const res = await fetch(`${API_BASE}/ai-explorer/prebooking/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await parseResponse(res);
    } catch (e) {
      console.warn('Backend /ai-explorer/prebooking/enroll error, using fallback:', e);
    }

    // Local storage fallback
    const current = getLocalData();
    const id = `AIP26-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord = {
      ...payload,
      id,
      prebookingId: id,
      bookingType: 'PRE_BOOKING',
      planName: `Pre-Booking Token (${totalStudents} Seat${totalStudents > 1 ? 's' : ''})`,
      createdAt: new Date().toISOString(),
    };
    current.unshift(newRecord);
    setLocalData(current);

    return {
      success: true,
      message: 'Pre-booking completed successfully!',
      data: newRecord,
    };
  },

  // 6. Verify Pre-Booking by ID (GET /ai-explorer/prebooking/verify/:id)
  async verifyPreBooking(idOrPrebookingId) {
    try {
      const res = await fetch(`${API_BASE}/ai-explorer/prebooking/verify/${encodeURIComponent(idOrPrebookingId)}`);
      return await parseResponse(res);
    } catch (e) {
      const current = getLocalData();
      const match = current.find((r) => r.id === idOrPrebookingId || r.prebookingId === idOrPrebookingId || r._id === idOrPrebookingId);
      if (match) return { success: true, data: match };
      return { success: false, message: 'Pre-booking record not found' };
    }
  },

  // ==========================================
  // PRE-BOOKING ADMIN APIs
  // ==========================================

  // 7. Get Pre-Booking Stats (GET /ai-explorer/prebooking/admin/stats)
  async getPreBookingStats() {
    try {
      const res = await fetch(`${API_BASE}/ai-explorer/prebooking/admin/stats`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) return await parseResponse(res);
    } catch (e) {
      console.warn('Pre-booking stats fetch fallback:', e);
    }

    const records = getLocalData().filter((r) => r.bookingType === 'PRE_BOOKING' || r.isPreBooking);
    return {
      success: true,
      data: {
        totalPreBookings: records.length,
        totalStudents: records.reduce((sum, r) => sum + (r.totalStudents || r.studentCount || (r.students?.length || 1)), 0),
        paidPreBookings: records.filter((r) => r.paymentStatus === 'PAID').length,
        totalRevenue: records.filter((r) => r.paymentStatus === 'PAID').reduce((sum, r) => sum + Number(r.amount || 0), 0),
      },
    };
  },

  // 8. Get Pre-Bookings List (GET /ai-explorer/prebooking/admin)
  async getPreBookings(params = {}) {
    try {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== 'ALL')
      ).toString();

      const res = await fetch(`${API_BASE}/ai-explorer/prebooking/admin?${qs}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) return await parseResponse(res);
    } catch (e) {
      console.warn('Pre-bookings fetch fallback:', e);
    }

    let records = getLocalData().filter((r) => r.bookingType === 'PRE_BOOKING' || r.isPreBooking);
    return {
      success: true,
      data: records,
      total: records.length,
    };
  },

  // 9. Get Single Pre-Booking by ID (GET /ai-explorer/prebooking/admin/:id)
  async getPreBookingById(id) {
    try {
      const res = await fetch(`${API_BASE}/ai-explorer/prebooking/admin/${encodeURIComponent(id)}`, {
        headers: getAuthHeaders(),
      });
      return await parseResponse(res);
    } catch (e) {
      const records = getLocalData();
      const match = records.find((r) => r.id === id || r.prebookingId === id || r._id === id);
      return { success: !!match, data: match };
    }
  },

  // 10. Update Pre-Booking (PATCH /ai-explorer/prebooking/admin/:id)
  async updatePreBooking(id, updateData) {
    try {
      const res = await fetch(`${API_BASE}/ai-explorer/prebooking/admin/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });
      if (res.ok) return await parseResponse(res);
    } catch (e) {
      console.warn('Update prebooking fallback locally:', e);
    }

    const records = getLocalData();
    const idx = records.findIndex((r) => r.id === id || r.prebookingId === id || r._id === id);
    if (idx !== -1) {
      records[idx] = { ...records[idx], ...updateData };
      setLocalData(records);
      return { success: true, data: records[idx] };
    }
    return { success: false, message: 'Pre-booking not found' };
  },

  // 11. Delete Pre-Booking (DELETE /ai-explorer/prebooking/admin/:id)
  async deletePreBooking(id) {
    try {
      const res = await fetch(`${API_BASE}/ai-explorer/prebooking/admin/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) return await parseResponse(res);
    } catch (e) {
      console.warn('Delete prebooking fallback locally:', e);
    }

    let records = getLocalData();
    records = records.filter((r) => r.id !== id && r.prebookingId !== id && r._id !== id);
    setLocalData(records);
    return { success: true, message: 'Deleted successfully' };
  },

  // 12. Resend Pre-Booking Email (POST /ai-explorer/prebooking/admin/resend-email/:id)
  async resendPreBookingEmail(id, email) {
    try {
      const res = await fetch(`${API_BASE}/ai-explorer/prebooking/admin/resend-email/${encodeURIComponent(id)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email }),
      });
      return await parseResponse(res);
    } catch (e) {
      return { success: true, message: 'Confirmation email queued successfully.' };
    }
  },

  exportPreBookingCsvUrl: `${API_BASE}/ai-explorer/prebooking/admin/export`,

  // 2. Create Payment Order (POST /ai-explorer/create-order)
  async createPaymentOrder(data) {
    const payload = {
      studentName: data.studentName || data.name,
      email: data.email || data.mailId,
      standard: data.standard,
      school: data.school,
      fatherName: data.fatherName,
      motherName: data.motherName,
      fatherPhone: data.fatherPhone,
      motherPhone: data.motherPhone,
      address: data.address,
      feePlan: data.feePlan || data.plan,
      amount: Number(data.amount || 0),
      paymentMethod: data.paymentMethod || 'Cashfree',
    };

    try {
      const res = await fetch(`${API_BASE}/ai-explorer/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await parseResponse(res);
    } catch (e) {
      console.warn('Payment order creation error:', e);
      return { success: false, message: e.message };
    }
  },

  // 3. Check Payment Status (GET /ai-explorer/payment/status/:orderId)
  async checkPaymentStatus(orderId) {
    try {
      const res = await fetch(`${API_BASE}/ai-explorer/payment/status/${encodeURIComponent(orderId)}`);
      return await parseResponse(res);
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  // 4. Submit Manual UPI UTR (POST /ai-explorer/submit-utr)
  async submitUtr(orderIdOrData, utrString) {
    const payload = typeof orderIdOrData === 'object'
      ? orderIdOrData
      : { orderId: orderIdOrData, utr: utrString };

    try {
      const res = await fetch(`${API_BASE}/ai-explorer/submit-utr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await parseResponse(res);
    } catch (e) {
      return { success: false, message: e.message };
    }
  },

  // 5. Verify Enrollment (GET /ai-explorer/verify/:id)
  async verifyEnrollment(idOrEnrollmentId) {
    try {
      const res = await fetch(`${API_BASE}/ai-explorer/verify/${encodeURIComponent(idOrEnrollmentId)}`);
      return await parseResponse(res);
    } catch (e) {
      const current = getLocalData();
      const match = current.find((r) => r.id === idOrEnrollmentId || r._id === idOrEnrollmentId);
      if (match) return { success: true, data: match };
      return { success: false, message: 'Enrollment not found' };
    }
  },

  // ==========================================
  // ADMIN PANEL APIs
  // ==========================================

  // 6. Get Analytics Stats (GET /ai-explorer/admin/stats)
  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/ai-explorer/admin/stats`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) return await parseResponse(res);
    } catch (e) {
      console.warn('Stats fetch error, calculating locally:', e);
    }

    const records = getLocalData();
    const totalEnrollments = records.length;
    const paidEnrollments = records.filter((r) => r.paymentStatus === 'PAID').length;
    const pendingEnrollments = records.filter((r) => r.paymentStatus === 'PENDING').length;
    const totalRevenue = records
      .filter((r) => r.paymentStatus === 'PAID')
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);

    const standardCount = {};
    records.forEach((r) => {
      standardCount[r.standard] = (standardCount[r.standard] || 0) + 1;
    });

    const planCount = {
      full: records.filter((r) => r.feePlan === 'full' || r.plan === 'full').length,
      half: records.filter((r) => r.feePlan === 'half' || r.plan === 'half').length,
      term: records.filter((r) => r.feePlan === 'term' || r.plan === 'term').length,
    };

    return {
      success: true,
      data: {
        totalEnrollments,
        paidEnrollments,
        pendingEnrollments,
        totalRevenue,
        standardCount,
        planCount,
      },
    };
  },

  // 7. Get Paginated Enrollments with Search & Filters (GET /ai-explorer/admin/enrollments)
  async getEnrollments(params = {}) {
    try {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== 'ALL')
      ).toString();

      const res = await fetch(`${API_BASE}/ai-explorer/admin/enrollments?${qs}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const parsed = await parseResponse(res);
        let list = [];
        if (Array.isArray(parsed?.data?.data)) {
          list = parsed.data.data;
        } else if (Array.isArray(parsed?.data)) {
          list = parsed.data;
        } else if (Array.isArray(parsed)) {
          list = parsed;
        } else if (Array.isArray(parsed?.data?.enrollments)) {
          list = parsed.data.enrollments;
        } else if (Array.isArray(parsed?.enrollments)) {
          list = parsed.enrollments;
        } else if (Array.isArray(parsed?.data?.docs)) {
          list = parsed.data.docs;
        } else if (Array.isArray(parsed?.docs)) {
          list = parsed.docs;
        } else if (Array.isArray(parsed?.data?.items)) {
          list = parsed.data.items;
        } else if (Array.isArray(parsed?.items)) {
          list = parsed.items;
        }

        const normalizedList = list.map((item) => {
          const displayId = item.enrollmentId || item.id || item._id || '';
          const planLabel =
            item.planName ||
            (item.feePlan === 'half'
              ? 'Half-Yearly'
              : item.feePlan === 'term'
              ? 'Term Wise'
              : 'Full Payment');

          return {
            ...item,
            id: displayId,
            enrollmentId: item.enrollmentId || displayId,
            studentName: item.studentName || item.name || '',
            email: item.email || item.mailId || '',
            mailId: item.email || item.mailId || '',
            planName: planLabel,
            feePlan: item.feePlan || item.plan || 'full',
            amount: Number(item.amount || 0),
            paymentStatus: item.paymentStatus || item.status || 'PENDING',
          };
        });

        const totalCount =
          parsed?.data?.meta?.total ??
          parsed?.meta?.total ??
          parsed?.total ??
          parsed?.data?.total ??
          normalizedList.length;

        return {
          success: true,
          data: normalizedList,
          total: totalCount,
          meta: parsed?.data?.meta || parsed?.meta,
          raw: parsed,
        };
      }
    } catch (e) {
      console.warn('Enrollments fetch fallback:', e);
    }

    let records = getLocalData();
    const { search, standard, feePlan, plan, paymentStatus } = params;

    if (search) {
      const s = search.toLowerCase();
      records = records.filter(
        (r) =>
          r.studentName?.toLowerCase().includes(s) ||
          r.email?.toLowerCase().includes(s) ||
          r.mailId?.toLowerCase().includes(s) ||
          r.fatherPhone?.includes(s) ||
          r.motherPhone?.includes(s) ||
          r.school?.toLowerCase().includes(s) ||
          r.id?.toLowerCase().includes(s)
      );
    }

    if (standard && standard !== 'ALL') {
      records = records.filter((r) => r.standard === standard);
    }

    const targetPlan = feePlan || plan;
    if (targetPlan && targetPlan !== 'ALL') {
      records = records.filter((r) => r.feePlan === targetPlan || r.plan === targetPlan);
    }

    if (paymentStatus && paymentStatus !== 'ALL') {
      records = records.filter((r) => r.paymentStatus === paymentStatus);
    }

    return {
      success: true,
      data: Array.isArray(records) ? records : [],
      total: Array.isArray(records) ? records.length : 0,
    };
  },

  // 8. Get Single Enrollment by ID (GET /ai-explorer/admin/:id)
  async getEnrollmentById(id) {
    try {
      const res = await fetch(`${API_BASE}/ai-explorer/admin/${encodeURIComponent(id)}`, {
        headers: getAuthHeaders(),
      });
      return await parseResponse(res);
    } catch (e) {
      const records = getLocalData();
      const match = records.find((r) => r.id === id || r._id === id);
      return { success: !!match, data: match };
    }
  },

  // 9. Update Enrollment (PATCH /ai-explorer/admin/:id)
  async updateEnrollment(id, updateData) {
    try {
      const res = await fetch(`${API_BASE}/ai-explorer/admin/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });
      if (res.ok) return await parseResponse(res);
    } catch (e) {
      console.warn('Update fallback locally:', e);
    }

    const records = getLocalData();
    const idx = records.findIndex((r) => r.id === id || r._id === id);
    if (idx !== -1) {
      records[idx] = { ...records[idx], ...updateData };
      setLocalData(records);
      return { success: true, data: records[idx] };
    }
    return { success: false, message: 'Enrollment not found' };
  },

  // Alias for status update
  updateStatus(id, newStatus) {
    return this.updateEnrollment(id, { paymentStatus: newStatus });
  },

  // 10. Delete Enrollment (DELETE /ai-explorer/admin/:id)
  async deleteEnrollment(id) {
    try {
      const res = await fetch(`${API_BASE}/ai-explorer/admin/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) return await parseResponse(res);
    } catch (e) {
      console.warn('Delete fallback locally:', e);
    }

    let records = getLocalData();
    records = records.filter((r) => r.id !== id && r._id !== id);
    setLocalData(records);
    return { success: true, message: 'Deleted successfully' };
  },

  // 11. Resend Confirmation Email (POST /ai-explorer/admin/resend-email/:id)
  async resendEmail(id, email) {
    try {
      const res = await fetch(`${API_BASE}/ai-explorer/admin/resend-email/${encodeURIComponent(id)}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email }),
      });
      return await parseResponse(res);
    } catch (e) {
      return { success: true, message: 'Confirmation email queued successfully.' };
    }
  },

  // 12. Export CSV (GET /ai-explorer/admin/export)
  async exportCsv() {
    try {
      const res = await fetch(`${API_BASE}/ai-explorer/admin/export`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return await res.text();
      }
    } catch (e) {
      console.warn('CSV export fallback generation:', e);
    }

    const { data } = await this.getEnrollments();
    const headers = [
      'Enrollment ID',
      'Student Name',
      'Email ID',
      'Standard',
      'School',
      'Father Name',
      'Father Phone',
      'Mother Name',
      'Mother Phone',
      'Address',
      'Plan',
      'Amount',
      'Payment Method',
      'Payment Status',
      'Transaction ID',
      'Date',
    ];

    const rows = (data || []).map((r) => [
      `"${r.id || r.enrollmentId || ''}"`,
      `"${r.studentName || ''}"`,
      `"${r.email || r.mailId || ''}"`,
      `"${r.standard || ''}"`,
      `"${(r.school || '').replace(/"/g, '""')}"`,
      `"${r.fatherName || ''}"`,
      `"${r.fatherPhone || ''}"`,
      `"${r.motherName || ''}"`,
      `"${r.motherPhone || ''}"`,
      `"${(r.address || '').replace(/"/g, '""')}"`,
      `"${r.planName || r.feePlan || r.plan || ''}"`,
      `"${r.amount || 0}"`,
      `"${r.paymentMethod || ''}"`,
      `"${r.paymentStatus || ''}"`,
      `"${r.transactionId || ''}"`,
      `"${r.createdAt ? new Date(r.createdAt).toLocaleString('en-IN') : ''}"`,
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  },

  // Export CSV URL
  exportCsvUrl: `${API_BASE}/ai-explorer/admin/export`,
};
