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
  BarChart2
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getSingAlongBookings,
  getSingAlongStats,
  exportSingAlongCsv,
  verifySingAlongTicket,
  checkInSingAlongTicket
} from '../../services/singAlongApi';

const rupee = (n: number | string) => {
  const num = Number(n || 0);
  if (num % 1 !== 0) {
    return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return '₹' + num.toLocaleString('en-IN');
};

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

  // ─── Fetch Stats ─────────────────────────────────────────────────────────────
  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await getSingAlongStats();
      const statsData = res?.data?.data || res?.data?.stats || res?.data || res?.stats || res;
      if (statsData) {
        setStats((prev: any) => ({
          ...statsData,
          ...prev, // Keep confirmedCount, totalTickets, totalRevenueFormatted from /sing-along endpoint
          attendedCount: statsData.attendedCount ?? statsData.checkedInCount ?? prev?.attendedCount ?? 0,
          confirmedCount: prev?.confirmedCount ?? statsData.confirmedCount ?? statsData.totalConfirmed,
          totalTickets: prev?.totalTickets ?? statsData.totalTickets ?? statsData.totalTicketsSold,
          totalRevenueFormatted: prev?.totalRevenueFormatted ?? statsData.totalRevenueFormatted,
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

      const res = await getSingAlongBookings(params);
      const listData = extractBookingsList(res);
      setBookings(listData);

      const total = extractTotalCount(res, listData.length);
      setTotalCount(total);

      const serverPages = res?.data?.totalPages ?? res?.totalPages;
      if (typeof serverPages === 'number' && serverPages > 0) {
        setTotalPages(serverPages);
      } else {
        setTotalPages(Math.max(1, Math.ceil(total / limit)));
      }

      // Extract stats from /sing-along API response
      const resData = res?.data || {};
      const summary = resData?.summary || res?.summary || {};

      const confirmedCount = resData.confirmedCount ?? summary.confirmedCount ?? resData.totalConfirmed ?? summary.totalConfirmed;
      const totalTickets = resData.totalTickets ?? summary.totalTickets;
      const totalRevenueFormatted = resData.totalRevenueFormatted || summary.totalRevenueFormatted || (resData.totalRevenue != null ? rupee(resData.totalRevenue) : (summary.totalRevenue != null ? rupee(summary.totalRevenue) : undefined));
      const totalRevenue = resData.totalRevenue ?? summary.totalRevenue;
      const attendedCount = resData.attendedCount ?? summary.attendedCount ?? resData.checkedInCount ?? summary.checkedInCount;
      const attendedFromList = listData.filter((b: any) => b.attended || b.status === 'ATTENDED').length;

      setStats((prev: any) => ({
        ...prev,
        ...resData,
        ...summary,
        confirmedCount: confirmedCount !== undefined ? confirmedCount : prev?.confirmedCount,
        totalTickets: totalTickets !== undefined ? totalTickets : prev?.totalTickets,
        totalRevenueFormatted: totalRevenueFormatted || prev?.totalRevenueFormatted,
        totalRevenue: totalRevenue !== undefined ? totalRevenue : prev?.totalRevenue,
        attendedCount: attendedCount !== undefined ? attendedCount : (prev?.attendedCount ?? attendedFromList)
      }));
    } catch (err: any) {
      console.error('Failed to load Sing Along bookings:', err);
      toast.error(err.message || 'Failed to load bookings list');
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  }, [page, limit, search, status, eventId, dateFilter]);

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

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Admin Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#ff6a00] to-[#ee5007] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Sing Along Ticketing</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 font-bold text-xs">
                  <Sparkles className="w-3 h-3" />
                  Live Event 2026
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Manage ticket bookings, gate check-in, revenue, and attendee records
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => { loadStats(); loadBookings(); }}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#ff6a00]' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => { setShowGateCheckinModal(true); setVerifiedTicket(null); setVerifyInput(''); }}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Gate Check-In</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              disabled={isExporting}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="p-6 space-y-6 flex-1">
          {/* ─── Metric Cards ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Total Bookings */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Bookings</span>
                <div className="text-2xl font-black text-slate-900">
                  {statsLoading && !stats ? '...' : (stats?.confirmedCount ?? stats?.summary?.confirmedCount ?? stats?.totalConfirmed ?? 0)}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Unique booking orders</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#ff6a00] flex items-center justify-center">
                <Ticket className="w-6 h-6" />
              </div>
            </div>

            {/* Total Tickets Sold */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Tickets Sold</span>
                <div className="text-2xl font-black text-slate-900">
                  {statsLoading && !stats ? '...' : (stats?.totalTickets ?? stats?.summary?.totalTickets ?? 0)}
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold">Attendees Registered</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Revenue</span>
                <div className="text-2xl font-black text-slate-900">
                  {statsLoading && !stats
                    ? '...'
                    : (stats?.totalRevenueFormatted || stats?.summary?.totalRevenueFormatted || (stats?.totalRevenue != null ? rupee(stats.totalRevenue) : '₹0.00'))}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Ticket sales &amp; fees</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            {/* Checked-In Attendee Count */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Checked In</span>
                <div className="text-2xl font-black text-slate-900">
                  {statsLoading && !stats ? '...' : (stats?.attendedCount ?? stats?.checkedInCount ?? 0)}
                </div>
                <span className="text-[11px] text-purple-600 font-semibold">Verified at Gate</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* ─── Date-wise Booking Count Panel ───────────────────────────────── */}
          {(() => {
            // Build date-wise count from current loaded bookings
            const dateCounts: Record<string, { total: number; confirmed: number; pending: number }> = {};
            bookings.forEach((b: any) => {
              const raw = b.createdAt || b.paidAt || b.bookedAt || b.updatedAt;
              if (!raw) return;
              const d = new Date(raw).toLocaleDateString('en-CA'); // YYYY-MM-DD
              if (!dateCounts[d]) dateCounts[d] = { total: 0, confirmed: 0, pending: 0 };
              dateCounts[d].total += 1;
              const s = (b.status || '').toUpperCase();
              if (s === 'CONFIRMED' || s === 'ATTENDED') dateCounts[d].confirmed += 1;
              else dateCounts[d].pending += 1;
            });
            const dates = Object.keys(dateCounts).sort().reverse();
            if (dates.length === 0) return null;
            return (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart2 className="w-4 h-4 text-[#ff6a00]" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">Date-wise Booking Count</span>
                  <span className="ml-auto text-[10px] text-slate-400 font-medium">Showing counts from current page results</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dates.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => { setDateFilter(prev => prev === d ? '' : d); setPage(1); }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        dateFilter === d
                          ? 'border-[#ff6a00] bg-orange-50 text-[#ff6a00] shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-[#ff6a00]/50 hover:bg-orange-50/50'
                      }`}
                      title={`Filter by ${d}`}
                    >
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      <span className="inline-flex items-center gap-1 ml-1">
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold text-[10px]" title="Confirmed">{dateCounts[d].confirmed}✓</span>
                        {dateCounts[d].pending > 0 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 font-bold text-[10px]" title="Pending">{dateCounts[d].pending}⏳</span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
                {dateFilter && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] text-[#ff6a00] font-bold">📅 Filtered by: {dateFilter}</span>
                    <button
                      type="button"
                      onClick={() => { setDateFilter(''); setPage(1); }}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 font-semibold cursor-pointer transition-colors"
                    >Clear</button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ─── Search & Filters Card ────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search by Name, Phone, Booking ID (SA26-...), or UTR..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#ff6a00] focus:ring-2 focus:ring-[#ff6a00]/20 outline-none transition-all"
                />
              </div>

              {/* Status Filter + Date Filter + Limit */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <select
                  value={status}
                  onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                  className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:border-[#ff6a00] outline-none cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
                  <option value="ATTENDED">ATTENDED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>

                {/* Date Filter */}
                <div className="relative flex items-center">
                  <Calendar className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
                    className="h-10 pl-8 pr-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:border-[#ff6a00] outline-none cursor-pointer"
                    title="Filter by booking date"
                  />
                  {dateFilter && (
                    <button
                      type="button"
                      onClick={() => { setDateFilter(''); setPage(1); }}
                      className="absolute right-2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      title="Clear date filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Limit */}
                <select
                  value={limit}
                  onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                  className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:border-[#ff6a00] outline-none cursor-pointer"
                >
                  <option value={10}>10 / page</option>
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                </select>
              </div>
            </div>

            {/* Active filter summary + Export hint */}
            {(status || dateFilter) && (
              <div className="mt-2.5 flex items-center gap-3 flex-wrap">
                <span className="text-[11px] text-slate-500">
                  Active filters:
                  {status && <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">{status}</span>}
                  {dateFilter && <span className="ml-1 px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#ff6a00] font-bold">{dateFilter}</span>}
                </span>
                <span className="text-[11px] text-slate-400">
                  💡 Export CSV will download only the filtered results
                </span>
              </div>
            )}
          </div>

          {/* ─── Bookings Table ───────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Booking ID</th>
                    <th className="py-3.5 px-4">Attendee</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4 text-center">Passes</th>
                    <th className="py-3.5 px-4 text-right">Amount</th>
                    <th className="py-3.5 px-4">Payment / UTR</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Gate Check-in</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
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
                  ) : bookings.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <Ticket className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        No ticket bookings found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((item) => {
                      const isAttended = item.attended || item.status === 'ATTENDED' || item.status === 'USED';
                      const isConfirmed = item.status === 'CONFIRMED' || isAttended;
                      const bookingIdStr = item.bookingId || item.id || item._id;

                      return (
                        <tr key={item._id || item.bookingId} className="hover:bg-slate-50/80 transition-colors">
                          {/* Booking ID */}
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            <span className="px-2 py-1 rounded-md bg-slate-100 text-[#ff6a00] border border-slate-200">
                              {item.bookingId || 'SA26-XXXX'}
                            </span>
                          </td>

                          {/* Attendee Name */}
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 block">{item.fullName}</span>
                            {item.email && <span className="text-[10px] text-slate-400">{item.email}</span>}
                          </td>

                          {/* Phone */}
                          <td className="py-3 px-4 text-slate-600 font-mono">
                            {item.phone || '-'}
                          </td>

                          {/* Passes Count */}
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-[#ff6a00] font-black text-xs">
                              {item.ticketQty || 1}
                            </span>
                          </td>

                          {/* Amount */}
                          <td className="py-3 px-4 text-right font-bold text-slate-900">
                            {rupee(item.totalAmount || item.amount || (item.ticketQty || 1) * 254)}
                          </td>

                          {/* Payment / UTR */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[11px] text-slate-600 truncate max-w-[120px]" title={item.utr}>
                                {item.utr || 'Direct Online'}
                              </span>
                              {item.utr && (
                                <button
                                  type="button"
                                  onClick={() => handleCopy(item.utr, item._id)}
                                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                                  title="Copy UTR"
                                >
                                  {copiedUtr === item._id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              )}
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                              {item.paymentMethod || 'GPay / UPI'}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              isConfirmed
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {isConfirmed ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              <span>{item.status || 'CONFIRMED'}</span>
                            </span>
                          </td>

                          {/* Gate Check-in Status & Button */}
                          <td className="py-3 px-4 text-center">
                            {isAttended ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[10px] border border-purple-200">
                                <Check className="w-3 h-3 text-purple-600" />
                                Checked In
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleQuickCheckin(item)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-700 border border-slate-300 text-[10px] font-bold text-slate-700 transition-colors cursor-pointer"
                                title="Click to mark attendee as Checked In at gate"
                              >
                                Mark Check-In
                              </button>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
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
              <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
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
