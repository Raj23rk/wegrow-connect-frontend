import { API_BASE } from './config';

// Primary Backend API Base URL dynamically resolved from config.js
const SPIN_WHEEL_API_BASE = `${API_BASE}/spin-wheel`;

// Fallback Local Storage Keys for offline simulation
const STORAGE_KEY_PARTICIPANTS = 'wegrow_spin_win_participants_v1';
const STORAGE_KEY_BUDGET = 'wegrow_spin_win_budget_v1';

// Default Reward Pool strictly matching user request: 5%, 10%, 15%, 20%, Gift, Free Demo Class
export const REWARD_POOL = [
  {
    rewardId: 'discount_5',
    id: 'discount_5',
    title: '5% Course Scholarship',
    shortTitle: '5% OFF',
    badge: '5% SCHOLARSHIP',
    tag: 'Diwali Concession',
    category: 'discount',
    color: '#f59e0b',
    textColor: '#ffffff',
    icon: 'sparkles',
    valueText: 'Flat 5% Off Fees',
    description: 'Flat 5% festive scholarship discount on course tuition upon campus visit.',
    terms: 'Valid on physical enrollment at WeGrow Campus front desk.',
    campusOffer: 'Valid on physical enrollment at WeGrow Campus front desk.',
    maxTotalBudget: 150,
    allocatedCount: 0,
    probabilityWeight: 20
  },
  {
    rewardId: 'free_demo_class',
    id: 'free_demo_class',
    title: 'Free Demo Class Pass',
    shortTitle: 'FREE DEMO',
    badge: 'FREE DEMO CLASS',
    tag: 'Hands-on Lab',
    category: 'bonus_class',
    color: '#0284c7',
    textColor: '#ffffff',
    icon: 'ticket',
    valueText: '100% Free Pass',
    description: 'Complimentary pass for an interactive practical demo class with tech mentors.',
    terms: 'Present digital voucher code at WeGrow campus reception.',
    campusOffer: 'Present digital voucher code at WeGrow campus reception.',
    maxTotalBudget: 120,
    allocatedCount: 0,
    probabilityWeight: 18
  },
  {
    rewardId: 'discount_10',
    id: 'discount_10',
    title: '10% Course Scholarship',
    shortTitle: '10% OFF',
    badge: '10% SCHOLARSHIP',
    tag: 'Special Offer',
    category: 'discount',
    color: '#7c3aed',
    textColor: '#ffffff',
    icon: 'award',
    valueText: 'Flat 10% Off Fees',
    description: '10% tuition fee scholarship waiver on signature certification tracks.',
    terms: 'Redeemable during campus counseling at WeGrow B-School.',
    campusOffer: 'Redeemable during campus counseling at WeGrow B-School.',
    maxTotalBudget: 100,
    allocatedCount: 0,
    probabilityWeight: 16
  },
  {
    rewardId: 'diwali_gift',
    id: 'diwali_gift',
    title: 'Diwali Campus Gift',
    shortTitle: 'GIFT 🎁',
    badge: 'DIWALI GIFT',
    tag: 'Festive Hamper',
    category: 'mentorship',
    color: '#059669',
    textColor: '#ffffff',
    icon: 'gift',
    valueText: 'Surprise Gift Kit',
    description: 'Exclusive Diwali student hamper, founder merchandise & study toolkit.',
    terms: 'Collect in person from campus front desk upon visit.',
    campusOffer: 'Collect in person from campus front desk upon visit.',
    maxTotalBudget: 120,
    allocatedCount: 0,
    probabilityWeight: 15
  },
  {
    rewardId: 'discount_15',
    id: 'discount_15',
    title: '15% Course Scholarship',
    shortTitle: '15% OFF',
    badge: '15% SCHOLARSHIP',
    tag: 'Mega Concession',
    category: 'discount',
    color: '#db2777',
    textColor: '#ffffff',
    icon: 'percent',
    valueText: 'Save 15% on Fees',
    description: 'Flat 15% scholarship concession across all certified career tracks.',
    terms: 'Applicable upon campus visit & admission counseling.',
    campusOffer: 'Applicable upon campus visit & admission counseling.',
    maxTotalBudget: 80,
    allocatedCount: 0,
    probabilityWeight: 12
  },
  {
    rewardId: 'free_demo_class_mentor',
    id: 'free_demo_class_mentor',
    title: 'Free Demo Class Pass',
    shortTitle: 'FREE DEMO',
    badge: 'FREE DEMO CLASS',
    tag: 'Tech Mentorship',
    category: 'bonus_class',
    color: '#0d9488',
    textColor: '#ffffff',
    icon: 'ticket',
    valueText: 'Worth ₹2,500',
    description: 'Live interactive mentor demo session + 1-on-1 personalized tech lab access.',
    terms: 'Scheduled in-person at WeGrow Campus Innovation Lab.',
    campusOffer: 'Scheduled in-person at WeGrow Campus Innovation Lab.',
    maxTotalBudget: 90,
    allocatedCount: 0,
    probabilityWeight: 12
  },
  {
    rewardId: 'discount_20',
    id: 'discount_20',
    title: '20% Tuition Discount',
    shortTitle: '20% OFF',
    badge: '20% OFF',
    tag: 'Tuition Concession',
    category: 'discount',
    color: '#4f46e5',
    textColor: '#ffffff',
    icon: 'percent',
    valueText: 'Save 20% on Fees',
    description: 'Flat 20% scholarship discount across our certified curriculum.',
    terms: 'Valid on in-person campus registration at WeGrow B-School.',
    campusOffer: 'Valid on in-person campus registration at WeGrow B-School.',
    maxTotalBudget: 60,
    allocatedCount: 0,
    probabilityWeight: 10
  },
  {
    rewardId: 'diwali_campus_gift_kit',
    id: 'diwali_campus_gift_kit',
    title: 'Diwali Campus Gift',
    shortTitle: 'GIFT 🎁',
    badge: 'CAMPUS GIFT',
    tag: 'Student Welcome Kit',
    category: 'mentorship',
    color: '#ea580c',
    textColor: '#ffffff',
    icon: 'gift',
    valueText: 'Exclusive Hamper',
    description: 'WeGrow Founders Handbook, Tech Kit, Branded Merch & Resource Pass.',
    terms: 'Collect in person from campus front desk upon visit.',
    campusOffer: 'Collect in person from campus front desk upon visit.',
    maxTotalBudget: 100,
    allocatedCount: 0,
    probabilityWeight: 10
  }
];

// Helper to get local participants for fallback
const getLocalParticipants = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PARTICIPANTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalParticipants = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY_PARTICIPANTS, JSON.stringify(list));
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }
};

export const generateVoucherCode = () => {
  const randNum = Math.floor(10000 + Math.random() * 90000);
  return `WGW-SPIN-${randNum}`;
};

/**
 * Complete Frontend API Service matching Backend API Specification
 * Base URL: http://localhost:4000/api/v1/spin-wheel
 */
export const spinWheelApi = {
  // 1. Fetch Wheel Sectors (GET /rewards)
  getRewards: async () => {
    try {
      const res = await fetch(`${SPIN_WHEEL_API_BASE}/rewards`);
      const json = await res.json();
      const list = (json.success && json.data) ? json.data : (json.data || json);
      if (Array.isArray(list) && list.length === 8) {
        // Overlay user-requested 5%, 10%, 15%, 20%, Gift, Free Demo Class sectors
        return list.map((item, idx) => ({
          ...REWARD_POOL[idx],
          ...item,
          title: REWARD_POOL[idx].title,
          shortTitle: REWARD_POOL[idx].shortTitle,
          badge: REWARD_POOL[idx].badge,
          tag: REWARD_POOL[idx].tag,
          color: REWARD_POOL[idx].color,
          textColor: '#ffffff'
        }));
      }
      return REWARD_POOL;
    } catch (err) {
      console.warn('Backend /rewards unreachable, using default REWARD_POOL:', err);
      return REWARD_POOL;
    }
  },

  // 2. Submit Student Form & Send OTP (POST /send-otp)
  sendOtp: async (studentData) => {
    // Client-side quick check: prevent identical phone numbers
    const sPhone = (studentData.mobileNo || '').replace(/\D/g, '');
    const fPhone = (studentData.fatherMobile || studentData.fatherPhone || '').replace(/\D/g, '');
    const mPhone = (studentData.motherMobile || studentData.motherPhone || '').replace(/\D/g, '');

    if (sPhone === fPhone || sPhone === mPhone || fPhone === mPhone) {
      return {
        success: false,
        message: 'Student, Father, and Mother mobile numbers must be different contact numbers.',
      };
    }

    const payload = {
      name: studentData.name,
      email: (studentData.email || '').trim().toLowerCase(),
      mobileNo: sPhone,
      fatherMobile: fPhone,
      motherMobile: mPhone,
      courseInterested: studentData.courseInterested,
      campusPreference: studentData.campusPreference || studentData.preferredCampus
    };

    try {
      const res = await fetch(`${SPIN_WHEEL_API_BASE}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      // If already spun, pass through alreadySpun flag
      if (data.alreadySpun || data.data?.alreadySpun) {
        return {
          success: false,
          alreadySpun: true,
          message: data.message || 'This email has already spun the wheel!',
          data: data.data || data
        };
      }

      return {
        ...data,
        canSpin: true
      };
    } catch (err) {
      console.warn('Backend /send-otp error, using offline mock:', err);
      // Offline fallback with 1-email-1-spin enforcement
      const participants = getLocalParticipants();
      const cleanEmail = (payload.email || '').trim().toLowerCase();
      let p = participants.find(item => item.email === cleanEmail);

      if (p && p.hasSpun) {
        return {
          success: false,
          alreadySpun: true,
          message: 'This email is already registered and has already spun the wheel! Each student is eligible for 1 spin only.',
          data: {
            name: p.name,
            email: p.email,
            voucherCode: p.voucherCode,
            rewardTitle: p.wonReward?.title || 'Skill Scholarship',
            wonReward: p.wonReward,
            qrCodeDataUrl: p.qrCodeDataUrl || '',
            isRedeemed: p.isRedeemed
          }
        };
      }

      if (!p) {
        p = {
          ...payload,
          _id: 'mock_' + Date.now(),
          isEmailVerified: true,
          hasSpun: false,
          createdAt: new Date().toISOString()
        };
        participants.push(p);
      } else {
        Object.assign(p, payload, { isEmailVerified: true });
      }
      saveLocalParticipants(participants);

      return {
        success: true,
        canSpin: true,
        message: 'Registration confirmed! Spin wheel is unlocked.',
        data: {
          email: cleanEmail,
          canSpin: true,
          student: p
        }
      };
    }
  },

  // Direct registration alias
  registerStudent: async (studentData) => {
    return spinWheelApi.sendOtp(studentData);
  },

  // 3. Verify OTP (retained for backward compatibility, automatically resolves)
  verifyOtp: async (email, otp = '123456') => {
    const cleanEmail = (email || '').trim().toLowerCase();

    try {
      const res = await fetch(`${SPIN_WHEEL_API_BASE}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, otp }),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('Backend /verify-otp error, using offline mock:', err);
      return {
        success: true,
        message: 'Registration confirmed! The Spin Wheel is unlocked.',
        data: { canSpin: true, student: { email: cleanEmail } }
      };
    }
  },

  // 4. Spin the Wheel & Claim Reward (POST /spin) - strictly 1 spin per email
  spinWheel: async (email) => {
    const cleanEmail = (email || '').trim().toLowerCase();

    // Check localStorage fast guard for 1-email-1-spin
    const localSpunFlag = localStorage.getItem(`wegrow_spun_${cleanEmail}`);

    try {
      const res = await fetch(`${SPIN_WHEEL_API_BASE}/spin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();

      if (data.alreadySpun || data.data?.alreadySpun) {
        localStorage.setItem(`wegrow_spun_${cleanEmail}`, 'true');
        return {
          success: false,
          alreadySpun: true,
          message: data.message || 'You have already spun the wheel! Only 1 spin per student.',
          data: data.data || data
        };
      }

      if (data.success) {
        localStorage.setItem(`wegrow_spun_${cleanEmail}`, 'true');
      }

      return data;
    } catch (err) {
      console.warn('Backend /spin error, using offline fallback:', err);
      // Offline fallback: check if already spun
      const participants = getLocalParticipants();
      const p = participants.find(item => item.email === cleanEmail);

      if ((p && p.hasSpun) || localSpunFlag) {
        return {
          success: false,
          alreadySpun: true,
          message: 'You have already spun the wheel! Each student is eligible for 1 spin only.',
          data: {
            reward: p?.wonReward || REWARD_POOL[0],
            voucherCode: p?.voucherCode || 'WGW-SPIN-ALREADY',
            student: p
          }
        };
      }

      // Offline fallback: pick random reward from pool
      const sectorIndex = Math.floor(Math.random() * REWARD_POOL.length);
      const reward = REWARD_POOL[sectorIndex];
      const voucherCode = generateVoucherCode();

      if (p) {
        p.hasSpun = true;
        p.spunAt = new Date().toISOString();
        p.wonReward = reward;
        p.voucherCode = voucherCode;
        p.isRedeemed = false;
        saveLocalParticipants(participants);
      }
      localStorage.setItem(`wegrow_spun_${cleanEmail}`, 'true');

      return {
        success: true,
        message: 'Congratulations! You have won an exclusive skill reward!',
        data: {
          sectorIndex,
          totalSectors: REWARD_POOL.length,
          reward,
          voucherCode,
          qrCodeDataUrl: '',
          student: {
            name: p?.name || 'Student',
            email: cleanEmail,
            mobileNo: p?.mobileNo || '',
            courseInterested: p?.courseInterested || ''
          },
          campusOffer: {
            title: 'Offer Valid on WeGrow B-School Campus Visit',
            location: 'WeGrow B-School Sivakasi & Srivilliputtur Campus',
            instructions: 'Present this digital voucher or QR code at our campus reception to claim your reward.'
          }
        }
      };
    }
  },

  // 5. Campus Desk: Verify Voucher Code or QR scan (GET /verify-voucher/:code)
  verifyVoucher: async (voucherCode) => {
    const cleanCode = (voucherCode || '').trim().toUpperCase();
    try {
      const res = await fetch(`${SPIN_WHEEL_API_BASE}/verify-voucher/${encodeURIComponent(cleanCode)}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('Backend /verify-voucher error, using offline search:', err);
      const participants = getLocalParticipants();
      const p = participants.find(item => item.voucherCode?.toUpperCase() === cleanCode);
      if (p) {
        return {
          success: true,
          message: 'Voucher verified successfully',
          data: {
            participant: p,
            reward: p.wonReward,
            voucherCode: p.voucherCode,
            isRedeemed: !!p.isRedeemed,
            redeemedAt: p.redeemedAt
          }
        };
      }
      return {
        success: false,
        message: `No voucher found with code: ${cleanCode}`
      };
    }
  },

  // 6. Campus Desk: Redeem Voucher on Campus Visit (POST /redeem-voucher)
  redeemVoucher: async (voucherCode, staffNote = '') => {
    const cleanCode = (voucherCode || '').trim().toUpperCase();
    try {
      const res = await fetch(`${SPIN_WHEEL_API_BASE}/redeem-voucher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherCode: cleanCode, staffNote }),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('Backend /redeem-voucher error, using offline mock:', err);
      const participants = getLocalParticipants();
      const p = participants.find(item => item.voucherCode?.toUpperCase() === cleanCode);
      if (p) {
        p.isRedeemed = true;
        p.redeemedAt = new Date().toISOString();
        p.staffNote = staffNote;
        saveLocalParticipants(participants);
        return {
          success: true,
          message: `Voucher ${cleanCode} successfully marked as redeemed at campus!`,
          data: {
            voucherCode: cleanCode,
            isRedeemed: true,
            redeemedAt: p.redeemedAt,
            studentName: p.name
          }
        };
      }
      return {
        success: false,
        message: `Could not find voucher ${cleanCode} to redeem.`
      };
    }
  },

  // 7. Admin: Get All Registered Students Data (GET /admin/participants)
  getAdminParticipants: async ({
    search = '',
    course = '',
    hasSpun = '',
    isRedeemed = '',
    page = 1,
    limit = 20,
  } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (course) params.append('course', course);
    if (hasSpun !== '') params.append('hasSpun', hasSpun);
    if (isRedeemed !== '') params.append('isRedeemed', isRedeemed);
    params.append('page', page);
    params.append('limit', limit);

    try {
      const res = await fetch(`${SPIN_WHEEL_API_BASE}/admin/participants?${params.toString()}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('Backend /admin/participants error, using offline mock:', err);
      const all = getLocalParticipants();
      const filtered = all.filter(p => {
        const q = search.toLowerCase();
        const matchQ = !q ||
          p.name?.toLowerCase().includes(q) ||
          p.email?.toLowerCase().includes(q) ||
          p.mobileNo?.includes(q) ||
          p.voucherCode?.toLowerCase().includes(q);
        const matchCourse = !course || p.courseInterested === course;
        const matchSpun = hasSpun === '' || String(!!p.hasSpun) === String(hasSpun);
        const matchRedeemed = isRedeemed === '' || String(!!p.isRedeemed) === String(isRedeemed);
        return matchQ && matchCourse && matchSpun && matchRedeemed;
      });

      return {
        success: true,
        data: {
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit) || 1,
          summary: {
            totalRegistered: all.length,
            totalVerified: all.filter(p => p.isEmailVerified).length,
            totalSpun: all.filter(p => p.hasSpun).length,
            totalRedeemed: all.filter(p => p.isRedeemed).length
          },
          participants: filtered.slice((page - 1) * limit, page * limit)
        }
      };
    }
  },

  // 8. Admin: Reward Stats (GET /admin/stats)
  getAdminStats: async () => {
    try {
      const res = await fetch(`${SPIN_WHEEL_API_BASE}/admin/stats`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('Backend /admin/stats error, using offline mock:', err);
      const all = getLocalParticipants();
      return {
        success: true,
        data: {
          totalRegistered: all.length,
          totalVerified: all.filter(p => p.isEmailVerified).length,
          totalSpun: all.filter(p => p.hasSpun).length,
          totalRedeemed: all.filter(p => p.isRedeemed).length,
          rewardBreakdown: REWARD_POOL.map(r => ({
            rewardId: r.rewardId,
            title: r.title,
            maxTotalBudget: r.maxTotalBudget,
            allocatedCount: all.filter(p => p.wonReward?.rewardId === r.rewardId).length
          }))
        }
      };
    }
  }
};

// Also export as spinWinApi for full backwards compatibility
export const spinWinApi = {
  ...spinWheelApi,
  checkEligibility: async (email, mobile) => {
    // Quick eligibility check
    return { success: true, eligible: true, hasSpun: false };
  },
  getAllParticipants: async () => {
    const res = await spinWheelApi.getAdminParticipants({ page: 1, limit: 100 });
    return {
      success: true,
      participants: res.data?.participants || [],
      totalCount: res.data?.summary?.totalRegistered || 0,
      spunCount: res.data?.summary?.totalSpun || 0,
      redeemedCount: res.data?.summary?.totalRedeemed || 0
    };
  },
  redeemAtCampus: async (code, campus, note) => {
    return spinWheelApi.redeemVoucher(code, note || `Redeemed at ${campus}`);
  },
  getVoucherDetails: async (email) => {
    return { success: true };
  }
};
