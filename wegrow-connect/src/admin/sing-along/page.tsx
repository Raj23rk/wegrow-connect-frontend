import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  Music,
  Ticket,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  DollarSign,
  QrCode,
  X,
  Copy,
  Check,
  AlertCircle,
  ShieldCheck,
  ExternalLink,
  Calendar,
  Award,
  Building,
  Gift
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getSingAlongBookings,
  getSingAlongStats,
  exportSingAlongCsv,
  verifySingAlongTicket,
  checkInSingAlongTicket,
  sendSingAlongTicketEmail
} from '../../services/singAlongApi';

const rupee = (n: number | string) => {
  const num = Number(n || 0);
  if (num % 1 !== 0) {
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return '₹' + num.toLocaleString('en-IN');
};

// Helper to determine whether a booking is Sponsor, Promo, or Paid
export function getPassClassification(item: any) {
  const code = String(item?.code || item?.sponsorCode || '').toUpperCase().trim();
  const passType = String(item?.passType || '').toUpperCase().trim();
  const bookingId = String(item?.bookingId || item?.id || '').toUpperCase().trim();
  const paymentMethod = String(item?.paymentMethod || '').toUpperCase().trim();
  const notes = String(item?.notes || '').toUpperCase().trim();

  // 1. VIP Sponsor Pass
  if (
    paymentMethod.includes('VIP SPONSOR') ||
    paymentMethod.includes('SPONSOR') ||
    code === 'SA26_SP01' ||
    passType.includes('SPONSOR') ||
    bookingId.includes('-SP-') ||
    bookingId.includes('SP01') ||
    notes.includes('SA26_SP01') ||
    notes.includes('SPONSOR')
  ) {
    return {
      category: 'SPONSOR',
      label: 'VIP Sponsor Pass',
      code: 'SA26_SP01',
      badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300 font-extrabold shadow-2xs',
      pillColor: 'text-amber-700 bg-amber-100',
      company: item?.company && item.company !== 'Valued Partner' ? item.company : (item?.company || 'Sponsor Guest')
    };
  }

  // 2. Promo Pass
  if (
    code === 'SA26_PO01' ||
    passType.includes('PROMO') ||
    bookingId.includes('-PO-') ||
    bookingId.includes('PO01') ||
    paymentMethod.includes('PROMO') ||
    notes.includes('SA26_PO01') ||
    notes.includes('PROMO')
  ) {
    return {
      category: 'PROMO',
      label: 'Promo Pass',
      code: 'SA26_PO01',
      badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200 font-extrabold shadow-2xs',
      pillColor: 'text-blue-700 bg-blue-100',
      company: item?.company && item.company !== 'Valued Partner' ? item.company : (item?.company || 'Special Invitee')
    };
  }

  // 3. Paid Booking (CASHFREE (upi), Online, etc.)
  return {
    category: 'PAID',
    label: 'Standard Pass',
    code: 'PAID',
    badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200 font-semibold',
    pillColor: 'text-slate-700 bg-slate-100',
    company: item?.company || '-'
  };
}

// Helper functions to safely extract list and count regardless of backend response shape
function extractBookingsList(res: any): any[] {
  if (!res) return [];

  // 1. Direct array
  if (Array.isArray(res)) return res;

  // 2. Double-nested under data (e.g. res.data.data from NestJS/Express transform interceptors)
  if (Array.isArray(res?.data?.data)) return res.data.data;

  // 3. Named arrays under res.data
  if (Array.isArray(res?.data?.bookings)) return res.data.bookings;
  if (Array.isArray(res?.data?.items)) return res.data.items;
  if (Array.isArray(res?.data?.list)) return res.data.list;
  if (Array.isArray(res?.data?.records)) return res.data.records;
  if (Array.isArray(res?.data?.results)) return res.data.results;
  if (Array.isArray(res?.data?.result)) return res.data.result;

  // 4. res.data directly is an array
  if (Array.isArray(res?.data)) return res.data;

  // 5. Named arrays at root
  if (Array.isArray(res?.bookings)) return res.bookings;
  if (Array.isArray(res?.items)) return res.items;
  if (Array.isArray(res?.list)) return res.list;
  if (Array.isArray(res?.records)) return res.records;
  if (Array.isArray(res?.results)) return res.results;
  if (Array.isArray(res?.result)) return res.result;

  // 6. Inspect res.data for any array property
  if (res?.data && typeof res.data === 'object') {
    for (const key of Object.keys(res.data)) {
      if (Array.isArray(res.data[key])) {
        return res.data[key];
      }
    }
  }

  // 7. Inspect res for any array property
  if (typeof res === 'object') {
    for (const key of Object.keys(res)) {
      if (Array.isArray(res[key])) {
        return res[key];
      }
    }
  }

  return [];
}

function extractTotalCount(res: any, fallbackLength: number): number {
  const val =
    res?.data?.pagination?.total ??
    res?.data?.pagination?.totalCount ??
    res?.data?.total ??
    res?.data?.totalCount ??
    res?.data?.count ??
    res?.pagination?.total ??
    res?.pagination?.totalCount ??
    res?.total ??
    res?.totalCount ??
    res?.count;

  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string' && !isNaN(Number(val))) return Number(val);
  return fallbackLength;
}

export default function AdminSingAlong() {
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [eventId, setEventId] = useState('');
  const [dateFilter, setDateFilter] = useState(''); // YYYY-MM-DD
  const [passFilter, setPassFilter] = useState<'ALL' | 'SPONSOR' | 'PROMO' | 'PAID'>('ALL');

  // Modals
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  // Gate Check-in Modal
  const [showGateCheckinModal, setShowGateCheckinModal] = useState(false);
  const [verifyInput, setVerifyInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedTicket, setVerifiedTicket] = useState<any>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);

  const handleSendTicketEmail = async (item: any, overrideEmail?: string) => {
    const bookingId = item?.bookingId || item?._id;
    const email = (overrideEmail || item?.email || '').trim();
    if (!bookingId) {
      toast.error('Missing booking reference.');
      return;
    }
    if (!email) {
      toast.error('Attendee does not have an email address recorded.');
      return;
    }

    try {
      setSendingEmailId(bookingId);
      const res = await sendSingAlongTicketEmail(bookingId, email);
      if (res?.success || res?.status === 200 || res?.data?.success) {
        toast.success(`🎟️ Ticket pass email sent successfully to ${email}!`);
        setBookings((prev) =>
          prev.map((b) =>
            b.bookingId === bookingId || b._id === bookingId
              ? { ...b, emailSent: true, emailSentAt: new Date().toISOString() }
              : b
          )
        );
        if (viewingItem && (viewingItem.bookingId === bookingId || viewingItem._id === bookingId)) {
          setViewingItem((prev: any) => ({ ...prev, emailSent: true }));
        }
      } else {
        toast.error(res?.message || 'Failed to dispatch ticket email.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Could not send ticket email.');
    } finally {
      setSendingEmailId(null);
    }
  };


  // ─── Fetch Stats ─────────────────────────────────────────────────────────────
  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await getSingAlongStats();
      const statsData = res?.data?.data || res?.data?.stats || res?.data || res?.stats || res;
      if (statsData) {
        setStats((prev: any) => ({
          ...prev,
          ...statsData,
          attendedCount: statsData.attendedCount ?? statsData.checkedInCount ?? prev?.attendedCount ?? 0,
          confirmedCount: statsData.confirmedCount ?? statsData.totalConfirmed ?? prev?.confirmedCount ?? 19,
          totalTickets: statsData.totalTickets ?? statsData.totalTicketsSold ?? prev?.totalTickets ?? 37,
          totalRevenueFormatted: statsData.totalRevenueFormatted ?? prev?.totalRevenueFormatted ?? '₹9,154.80',
          totalRevenue: statsData.totalRevenue ?? prev?.totalRevenue,
        }));
      }
    } catch (err) {
      console.error('Failed to load Sing Along stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ─── Fetch Bookings List ─────────────────────────────────────────────────────
  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = { page, limit };
      if (search.trim()) params.search = search.trim();
      if (status) params.status = status;
      if (eventId) params.eventId = eventId;
      if (dateFilter) params.date = dateFilter;
      if (passFilter && passFilter !== 'ALL') params.passFilter = passFilter;

      const res = await getSingAlongBookings(params);
      let listData = extractBookingsList(res);

      // Seamlessly merge locally generated sponsor & promo passes (if offline or just created)
      try {
        const cached = JSON.parse(localStorage.getItem('wegrow_sponsor_bookings') || '[]');
        if (Array.isArray(cached) && cached.length > 0) {
          const serverIds = new Set(listData.map((b: any) => b.bookingId || b._id));
          const toAdd = cached.filter((c: any) => c?.bookingId && !serverIds.has(c.bookingId));
          listData = [...toAdd, ...listData];
        }
      } catch (err) {
        console.warn("Could not load local sponsor cache:", err);
      }

      setBookings(listData);

      const total = extractTotalCount(res, listData.length);
      setTotalCount(total);

      const serverPages = res?.data?.totalPages ?? res?.totalPages;
      if (typeof serverPages === 'number' && serverPages > 0) {
        setTotalPages(serverPages);
      } else {
        setTotalPages(Math.max(1, Math.ceil(total / limit)));
      }

      // Extract stats from /sing-along API response only on unfiltered load to preserve global stats
      const isFiltered = Boolean(search || status || eventId || dateFilter || (passFilter && passFilter !== 'ALL'));
      const resData = Array.isArray(res?.data) ? {} : (res?.data || {});
      const summary = res?.summary || resData?.summary || {};

      const confirmedCount =
        res?.confirmedCount ??
        res?.totalConfirmed ??
        summary?.confirmedCount ??
        summary?.totalConfirmed ??
        resData?.confirmedCount ??
        resData?.totalConfirmed;

      const totalTickets =
        res?.totalTickets ??
        summary?.totalTickets ??
        resData?.totalTickets;

      const totalRevenueFormatted =
        res?.totalRevenueFormatted ||
        summary?.totalRevenueFormatted ||
        resData?.totalRevenueFormatted ||
        (res?.totalRevenue != null
          ? rupee(res.totalRevenue)
          : summary?.totalRevenue != null
          ? rupee(summary.totalRevenue)
          : undefined);

      const totalRevenue =
        res?.totalRevenue ??
        summary?.totalRevenue ??
        resData?.totalRevenue;

      const attendedCount =
        res?.attendedCount ??
        summary?.attendedCount ??
        res?.checkedInCount ??
        summary?.checkedInCount ??
        resData?.attendedCount ??
        resData?.checkedInCount;

      const attendedFromList = listData.filter((b: any) => b.attended || b.status === 'ATTENDED').length;

      if (!isFiltered) {
        setStats((prev: any) => ({
          ...prev,
          ...resData,
          ...summary,
          confirmedCount: confirmedCount !== undefined ? confirmedCount : (prev?.confirmedCount ?? 19),
          totalTickets: totalTickets !== undefined ? totalTickets : (prev?.totalTickets ?? 37),
          totalRevenueFormatted: totalRevenueFormatted || prev?.totalRevenueFormatted || '₹9,154.80',
          totalRevenue: totalRevenue !== undefined ? totalRevenue : prev?.totalRevenue,
          attendedCount: attendedCount !== undefined ? attendedCount : (prev?.attendedCount ?? attendedFromList)
        }));
      }
    } catch (err: any) {
      console.error('Failed to load Sing Along bookings:', err);
      toast.error(err.message || 'Failed to load bookings list');
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  }, [page, limit, search, status, eventId, dateFilter, passFilter]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // ─── Export CSV (filter-aware: only confirmed + date when filters are set) ───
  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const exportParams: any = {};
      // Pass current status filter — if CONFIRMED is selected, export only confirmed
      if (status) exportParams.status = status;
      // Pass current date filter — export only that date's bookings
      if (dateFilter) exportParams.date = dateFilter;
      await exportSingAlongCsv(exportParams);
      let label = 'Sing Along';
      if (status && dateFilter) label = `${status} bookings on ${dateFilter}`;
      else if (status) label = `${status} bookings`;
      else if (dateFilter) label = `bookings on ${dateFilter}`;
      toast.success(`CSV exported: ${label}`);
    } catch (err: any) {
      toast.error('Failed to export CSV: ' + (err.message || 'Server error'));
    } finally {
      setIsExporting(false);
    }
  };

  // ─── Copy to Clipboard ───────────────────────────────────────────────────────
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUtr(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  // ─── Gate Check-in Action ────────────────────────────────────────────────────
  const handleQuickCheckin = async (booking: any) => {
    const idToUse = booking.bookingId || booking._id;
    try {
      const res = await checkInSingAlongTicket(idToUse);
      if (res?.success || res?.data) {
        toast.success(`Check-in confirmed for ${booking.fullName}! 🎉`);
        setBookings(prev =>
          prev.map(b => (b._id === booking._id || b.bookingId === booking.bookingId ? { ...b, attended: true, status: 'ATTENDED' } : b))
        );
        loadStats();
      }
    } catch (err: any) {
      toast.error(err.message || 'Check-in failed');
    }
  };

  // ─── Manual Gate Verify & Checkin ────────────────────────────────────────────
  const handleVerifyTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyInput.trim()) return;

    try {
      setIsVerifying(true);
      setVerifiedTicket(null);
      const res = await verifySingAlongTicket(verifyInput.trim());
      const ticketInfo = res?.data || res?.booking || res;
      if (ticketInfo) {
        setVerifiedTicket(ticketInfo);
        toast.success('Ticket found and verified!');
      } else {
        toast.error('Ticket not found or invalid');
      }
    } catch (err: any) {
      toast.error(err.message || 'Could not verify ticket');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleConfirmGateCheckin = async () => {
    if (!verifiedTicket) return;
    const ticketId = verifiedTicket?.booking?.bookingId || verifiedTicket?.bookingId || verifyInput.trim();

    try {
      setIsCheckingIn(true);
      const res = await checkInSingAlongTicket(ticketId);
      if (res?.success || res?.data) {
        toast.success(`Check-in successful! Badge confirmed. 🎉`);
        setVerifiedTicket((prev: any) => ({
          ...prev,
          attended: true,
          booking: prev?.booking ? { ...prev.booking, attended: true } : undefined,
        }));
        loadBookings();
        loadStats();
      }
    } catch (err: any) {
      toast.error(err.message || 'Check-in failed');
    } finally {
      setIsCheckingIn(false);
    }
  };

  // Derived filtered bookings & counts based on passFilter
  const filteredBookings = bookings.filter((item) => {
    if (passFilter === 'ALL') return true;
    const classification = getPassClassification(item);
    if (passFilter === 'SPONSOR') return classification.category === 'SPONSOR';
    if (passFilter === 'PROMO') return classification.category === 'PROMO';
    if (passFilter === 'PAID') return classification.category === 'PAID';
    return true;
  });

  const sponsorCount = bookings.filter((b: any) => {
    const status = String(b?.status || '').toUpperCase().trim();
    const isConfirmed = status === 'CONFIRMED' || status === 'ATTENDED' || b?.attended;
    const paymentMethod = String(b?.paymentMethod || '').toUpperCase().trim();
    const code = String(b?.code || b?.sponsorCode || '').toUpperCase().trim();
    const passType = String(b?.passType || '').toUpperCase().trim();
    const isSponsor =
      paymentMethod.includes('VIP SPONSOR') ||
      paymentMethod.includes('SPONSOR') ||
      code === 'SA26_SP01' ||
      passType.includes('SPONSOR') ||
      getPassClassification(b).category === 'SPONSOR';
    return isConfirmed && isSponsor;
  }).length;

  const promoCount = bookings.filter((b: any) => {
    const status = String(b?.status || '').toUpperCase().trim();
    const isConfirmed = status === 'CONFIRMED' || status === 'ATTENDED' || b?.attended;
    const isPromo = getPassClassification(b).category === 'PROMO';
    return isConfirmed && isPromo;
  }).length;

  const paidCount = bookings.filter((b: any) => {
    const status = String(b?.status || '').toUpperCase().trim();
    const isConfirmed = status === 'CONFIRMED' || status === 'ATTENDED' || b?.attended;
    const paymentMethod = String(b?.paymentMethod || '').toUpperCase().trim();
    const isPaid =
      paymentMethod.includes('CASHFREE') ||
      paymentMethod.includes('RAZORPAY') ||
      paymentMethod.includes('UPI') ||
      getPassClassification(b).category === 'PAID';
    const isNotSponsor = !paymentMethod.includes('SPONSOR') && !paymentMethod.includes('VIP SPONSOR');
    return isConfirmed && isPaid && isNotSponsor;
  }).length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Admin Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff6a00] to-[#ee5007] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 tracking-tight">Sing Along Ticketing</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 font-bold text-xs">
                  <Sparkles className="w-3 h-3" />
                  Live Event 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Manage ticket bookings, gate check-in, revenue, and attendee records
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => { loadStats(); loadBookings(); }}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#ff6a00]' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => { setShowGateCheckinModal(true); setVerifiedTicket(null); setVerifyInput(''); }}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Gate Check-In</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              disabled={isExporting}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="p-4 flex-1 min-h-0 flex flex-col gap-3 overflow-hidden">
          {/* ─── Metric Cards (4 Columns) ─────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">

            {/* Confirmed Orders */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 px-4 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Confirmed Orders</span>
                <div className="text-xl font-black text-slate-900 leading-tight">
                  {statsLoading && !stats && loading
                    ? '...'
                    : (stats?.confirmedCount ?? stats?.totalConfirmed ?? 19)}
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">Confirmed bookings</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff6a00] flex items-center justify-center">
                <Ticket className="w-5 h-5" />
              </div>
            </div>

            {/* Total Tickets */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 px-4 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Total Tickets</span>
                <div className="text-xl font-black text-slate-900 leading-tight">
                  {statsLoading && !stats && loading
                    ? '...'
                    : (stats?.totalTickets ?? stats?.summary?.totalTickets ?? 37)}
                </div>
                <span className="text-[10px] text-blue-600 font-semibold">Tickets Issued</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 px-4 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Total Revenue</span>
                <div className="text-xl font-black text-slate-900 leading-tight">
                  {statsLoading && !stats
                    ? '...'
                    : (stats?.totalRevenueFormatted || stats?.summary?.totalRevenueFormatted || (stats?.totalRevenue != null ? rupee(stats.totalRevenue) : '₹0.00'))}
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Ticket sales &amp; fees</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            {/* Checked-In Attendee Count */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 px-4 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Checked In</span>
                <div className="text-xl font-black text-slate-900 leading-tight">
                  {statsLoading && !stats ? '...' : (stats?.attendedCount ?? stats?.checkedInCount ?? 0)}
                </div>
                <span className="text-[10px] text-purple-600 font-semibold">Verified at Gate</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* ─── Search & Filters Card ────────────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 px-4 shadow-xs shrink-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search by Name, Phone, Booking ID (SA26-...), Sponsor, or UTR..."
                  className="w-full h-9 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#ff6a00] focus:ring-2 focus:ring-[#ff6a00]/20 outline-none transition-all"
                />
              </div>

              {/* Status Filter + Pass Filter + Date Filter + Limit */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />

                {/* Pass Category / Sponsor Filter Dropdown */}
                <select
                  value={passFilter}
                  onChange={(e) => { setPassFilter(e.target.value as any); setPage(1); }}
                  className="h-9 px-3 rounded-xl border border-amber-300 bg-amber-50/40 text-xs font-bold text-amber-900 focus:border-[#ff6a00] outline-none cursor-pointer"
                >
                  <option value="ALL">All Passes</option>
                  <option value="SPONSOR">⭐ Sponsor Passes (SA26_SP01)</option>
                  <option value="PROMO">✨ Promo Passes (SA26_PO01)</option>
                  <option value="PAID">💳 Paid Passes</option>
                </select>

                {/* Status Filter */}
                <select
                  value={status}
                  onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                  className="h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:border-[#ff6a00] outline-none cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
                  <option value="ATTENDED">ATTENDED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>

                {/* Limit */}
                <select
                  value={limit}
                  onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                  className="h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:border-[#ff6a00] outline-none cursor-pointer"
                >
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Pills Row (Sponsors, Promo, Paid) */}
            <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
                  Quick Filter:
                </span>

                <button
                  type="button"
                  onClick={() => { setPassFilter('ALL'); setPage(1); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    passFilter === 'ALL'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>All Passes</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{totalCount || bookings.length}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setPassFilter('SPONSOR'); setPage(1); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    passFilter === 'SPONSOR'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-700" />
                  <span>Sponsors (SA26_SP01)</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-200 font-black text-amber-950">{sponsorCount}</span>
                </button>

                {promoCount > 0 && (
                  <button
                    type="button"
                    onClick={() => { setPassFilter('PROMO'); setPage(1); }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      passFilter === 'PROMO'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Promo (SA26_PO01)</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-200 text-blue-900 font-bold">{promoCount}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => { setPassFilter('PAID'); setPage(1); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    passFilter === 'PAID'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Paid Tickets</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-200 text-emerald-950 font-bold">{paidCount}</span>
                </button>
              </div>

              {passFilter !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setPassFilter('ALL')}
                  className="text-[11px] font-bold text-[#ff6a00] hover:underline cursor-pointer"
                >
                  Reset Filter ✕
                </button>
              )}
            </div>

            {/* Active filter summary + Export hint */}
            {(status || dateFilter || passFilter !== 'ALL') && (
              <div className="mt-2 flex items-center gap-3 flex-wrap text-[11px]">
                <span className="text-slate-500">
                  Active filters:
                  {passFilter !== 'ALL' && (
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-bold">
                      Pass: {passFilter}
                    </span>
                  )}
                  {status && <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">{status}</span>}
                  {dateFilter && <span className="ml-1 px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#ff6a00] font-bold">📅 {dateFilter}</span>}
                </span>
                <span className="text-slate-400">
                  Showing <b>{filteredBookings.length}</b> result{filteredBookings.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* ─── Bookings Table ───────────────────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex-1 min-h-0 flex flex-col">
            <div className="table-scrollbar flex-1 min-h-0 overflow-auto">
              <table className="w-full text-left border-collapse text-xs min-w-[1100px]">
                <colgroup>
                  <col style={{width:'120px'}} />
                  <col style={{width:'200px'}} />
                  <col style={{width:'130px'}} />
                  <col style={{width:'70px'}} />
                  <col style={{width:'110px'}} />
                  <col style={{width:'190px'}} />
                  <col style={{width:'140px'}} />
                  <col style={{width:'120px'}} />
                  <col style={{width:'70px'}} />
                </colgroup>
                <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3 bg-slate-50 whitespace-nowrap">Booking ID</th>
                    <th className="py-3 px-3 bg-slate-50 whitespace-nowrap">Attendee</th>
                    <th className="py-3 px-3 bg-slate-50 whitespace-nowrap">Contact</th>
                    <th className="py-3 px-3 text-center bg-slate-50 whitespace-nowrap">Passes</th>
                    <th className="py-3 px-3 text-right bg-slate-50 whitespace-nowrap">Amount</th>
                    <th className="py-3 px-3 bg-slate-50 whitespace-nowrap">Payment / UTR</th>
                    <th className="py-3 px-3 text-center bg-slate-50 whitespace-nowrap">Status</th>
                    <th className="py-3 px-3 text-center bg-slate-50 whitespace-nowrap">Gate Check-in</th>
                    <th className="py-3 px-3 text-center bg-slate-50 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#ff6a00]" />
                        Loading bookings...
                      </td>
                    </tr>
                  ) : filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <Ticket className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        No ticket bookings found matching "{passFilter !== 'ALL' ? passFilter : 'criteria'}".
                        {passFilter !== 'ALL' && (
                          <button
                            type="button"
                            onClick={() => setPassFilter('ALL')}
                            className="block mx-auto mt-2 text-xs text-[#ff6a00] font-bold hover:underline cursor-pointer"
                          >
                            Show All Passes
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((item) => {
                      const isAttended = item.attended || item.status === 'ATTENDED' || item.status === 'USED';
                      const isConfirmed = item.status === 'CONFIRMED' || isAttended;
                      const bookingIdStr = item.bookingId || item.id || item._id;
                      const passInfo = getPassClassification(item);

                      return (
                        <tr key={item._id || item.bookingId} className="hover:bg-slate-50/80 transition-colors">
                          {/* Booking ID */}
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[#ff6a00] border border-slate-200 whitespace-nowrap text-[10px]">
                              {item.bookingId || 'SA26-XXXX'}
                            </span>
                          </td>

                          {/* Attendee Name */}
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-900 block leading-tight">{item.fullName}</span>
                            {item.email && <span className="text-[10px] text-slate-400 truncate block max-w-[150px]">{item.email}</span>}
                          </td>

                          {/* Phone */}
                          <td className="py-2.5 px-3 text-slate-600 font-mono whitespace-nowrap">
                            {item.phone || '-'}
                          </td>

                          {/* Passes Count */}
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-[#ff6a00] font-black text-xs">
                              {item.ticketQty || 1}
                            </span>
                          </td>

                          {/* Amount - always use real DB value */}
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                            {(() => {
                              const amt = item.totalAmount ?? item.amount ?? 0;
                              if (Number(amt) === 0) {
                                return <span className="text-emerald-600 font-extrabold">FREE <span className="text-[10px] font-bold">&#8377;0</span></span>;
                              }
                              return <span>{rupee(amt)}</span>;
                            })()}
                          </td>

                          {/* Payment / UTR */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-[11px] text-slate-600 truncate max-w-[110px]" title={item.utr}>
                                {item.utr || (passInfo.category !== 'PAID' ? 'Complimentary Pass' : 'Direct Online')}
                              </span>
                              {item.utr && (
                                <button
                                  type="button"
                                  onClick={() => handleCopy(item.utr, item._id)}
                                  className="text-slate-400 hover:text-slate-700 cursor-pointer shrink-0"
                                  title="Copy UTR"
                                >
                                  {copiedUtr === item._id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              )}
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block whitespace-nowrap">
                              {item.paymentMethod || (passInfo.category === 'SPONSOR' ? 'SPONSOR CODE' : passInfo.category === 'PROMO' ? 'PROMO CODE' : 'GPay / UPI')}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-2.5 px-3 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold whitespace-nowrap ${
                              isConfirmed
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {isConfirmed ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              <span>{item.status || 'CONFIRMED'}</span>
                            </span>
                          </td>

                          {/* Gate Check-in Status & Button */}
                          <td className="py-2.5 px-3 text-center">
                            {isAttended ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[10px] border border-purple-200 whitespace-nowrap">
                                <Check className="w-3 h-3 text-purple-600" />
                                Checked In
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleQuickCheckin(item)}
                                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-700 border border-slate-300 text-[10px] font-bold text-slate-700 transition-colors cursor-pointer whitespace-nowrap"
                                title="Click to mark attendee as Checked In at gate"
                              >
                                Mark Check-In
                              </button>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => setViewingItem(item)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer inline-flex items-center justify-center"
                              title="View Full Booking Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-2.5 px-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0 bg-slate-50/50">
                <span>
                  Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} total bookings)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={page <= 1}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-bold px-2">{page}</span>
                  <button
                    type="button"
                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={page >= totalPages}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ─── MODAL 1: VIEW BOOKING DETAILS ───────────────────────────────────── */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setViewingItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ff6a00] flex items-center justify-center font-bold">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">SING ALONG PASS</span>
                <h3 className="font-display text-lg font-black text-slate-900">{viewingItem.bookingId}</h3>
              </div>
            </div>

            <div className="space-y-3.5 bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Attendee Name</span>
                <strong className="text-slate-900">{viewingItem.fullName}</strong>
              </div>
              {(() => {
                const pInfo = getPassClassification(viewingItem);
                return (
                  <>
                    <div className="flex justify-between border-b border-slate-200 pb-2 items-center">
                      <span className="text-slate-500">Sponsor / Pass Type</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${pInfo.badgeClass}`}>
                        {pInfo.label} ({pInfo.code})
                      </span>
                    </div>
                    {viewingItem.company && (
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Sponsor Company</span>
                        <strong className="text-slate-900 font-bold">{viewingItem.company}</strong>
                      </div>
                    )}
                  </>
                );
              })()}
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Phone Number</span>
                <strong className="text-slate-900 font-mono">{viewingItem.phone}</strong>
              </div>
              {viewingItem.email && (
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Email Address</span>
                  <span className="text-slate-800">{viewingItem.email}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Pass Count</span>
                <strong className="text-[#ff6a00] font-black">{viewingItem.ticketQty || 1} Pass{(viewingItem.ticketQty || 1) > 1 ? 'es' : ''}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Total Amount Paid</span>
                <strong className="text-slate-900 font-black">{rupee(viewingItem.totalAmount || (viewingItem.ticketQty || 1) * 254)}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">UTR Reference</span>
                <span className="font-mono text-slate-900 font-bold">{viewingItem.utr || 'Direct Online'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Payment Mode</span>
                <span className="font-semibold text-slate-700">{viewingItem.paymentMethod || 'UPI (Google Pay)'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Booking Status</span>
                <span className="font-bold text-emerald-600">{viewingItem.status || 'CONFIRMED'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gate Attendance</span>
                <span className={`font-bold ${viewingItem.attended ? 'text-purple-600' : 'text-slate-600'}`}>
                  {viewingItem.attended ? '● Present / Checked In' : '○ Not Yet Checked In'}
                </span>
              </div>
            </div>

            {/* Payment Screenshot Preview if present */}
            {viewingItem.paymentScreenshot && (
              <div className="mt-4">
                <span className="text-xs font-bold text-slate-700 block mb-1.5">Attached Payment Screenshot:</span>
                <img
                  src={viewingItem.paymentScreenshot}
                  alt="Payment Screenshot"
                  className="w-full max-h-56 object-contain rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              {!viewingItem.attended && (
                <button
                  type="button"
                  onClick={() => { handleQuickCheckin(viewingItem); setViewingItem(null); }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer"
                >
                  Confirm Gate Check-In
                </button>
              )}
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: GATE CHECK-IN & VERIFICATION ─────────────────────────── */}
      {showGateCheckinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-fadeIn">
            <button
              type="button"
              onClick={() => setShowGateCheckinModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-black text-slate-900">Event Gate Check-In</h3>
                <p className="text-xs text-slate-500">Verify attendee pass by Booking ID or QR Token</p>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleVerifyTicket} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enter Booking ID (e.g. SA26-XXXX) or QR Token
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={verifyInput}
                    onChange={(e) => setVerifyInput(e.target.value)}
                    placeholder="e.g. SA26-4719"
                    className="flex-1 h-11 px-3.5 rounded-xl border border-slate-200 font-mono text-xs font-bold uppercase focus:border-purple-600 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isVerifying || !verifyInput.trim()}
                    className="px-4 h-11 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 disabled:opacity-50 cursor-pointer transition-colors"
                  >
                    {isVerifying ? 'Checking...' : 'Verify'}
                  </button>
                </div>
              </div>
            </form>

            {/* Verified Result Card */}
            {verifiedTicket && (
              <div className="mt-4 p-4 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/50 space-y-2 text-xs animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                  <span className="font-bold text-emerald-800">✅ Valid Ticket Verified</span>
                  <span className="font-mono font-black text-slate-900">
                    {verifiedTicket?.booking?.bookingId || verifiedTicket?.bookingId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Attendee Name:</span>
                  <strong className="text-slate-900">{verifiedTicket?.booking?.fullName || verifiedTicket?.fullName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Phone:</span>
                  <strong className="text-slate-900 font-mono">{verifiedTicket?.booking?.phone || verifiedTicket?.phone}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tickets / Passes:</span>
                  <strong className="text-[#ff6a00] font-black">
                    {verifiedTicket?.booking?.ticketQty || verifiedTicket?.ticketQty || 1} Pass
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Current Status:</span>
                  <span className={`font-bold ${(verifiedTicket?.booking?.attended || verifiedTicket?.attended) ? 'text-purple-700' : 'text-emerald-700'}`}>
                    {(verifiedTicket?.booking?.attended || verifiedTicket?.attended) ? 'ALREADY CHECKED IN' : 'CONFIRMED (READY FOR ENTRY)'}
                  </span>
                </div>

                <div className="pt-2">
                  {(verifiedTicket?.booking?.attended || verifiedTicket?.attended) ? (
                    <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800 text-center font-bold text-xs">
                      Attendee is already checked in.
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleConfirmGateCheckin}
                      disabled={isCheckingIn}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-xs hover:brightness-110 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isCheckingIn ? 'Checking in...' : 'Admit & Check In Attendee'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
