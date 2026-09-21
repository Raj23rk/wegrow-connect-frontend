import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  Briefcase,
  Search,
  Filter,
  Download,
  Trash2,
  Edit2,
  Eye,
  X,
  CheckCircle2,
  Clock,
  Building2,
  Building,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Target,
  Users,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchBusinessFounders,
  fetchBusinessFoundersStats,
  exportBusinessFoundersCsv,
  updateBusinessFounder,
  deleteBusinessFounder
} from '../../services/api';

export default function AdminBusinessFounders() {
  // ─── State ───────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [yearsInBusiness, setYearsInBusiness] = useState('');
  const [biggestPriority, setBiggestPriority] = useState('');
  const [status, setStatus] = useState('');
  const [eventId, setEventId] = useState('');
  const [distinctEvents, setDistinctEvents] = useState<string[]>([]);

  // Modals
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    businessName: '',
    industry: 'manufacturing',
    yearsInBusiness: '1_to_3_years',
    biggestPriority: 'More Sales',
    growthBlocker: 'Lack of Customers',
    hasTeam: 'Small Team',
    futureVision: 'A Business That Runs Without Me',
    growthChallenge: '',
    status: 'registered',
    notes: ''
  });

  // ─── Fetch Stats ─────────────────────────────────────────────────────────────
  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await fetchBusinessFoundersStats(eventId);
      if (res) {
        const statsData =
          res?.data?.stats ||
          res?.data?.summary ||
          res?.data?.counts ||
          res?.data ||
          res?.stats ||
          res?.summary ||
          res?.counts ||
          res;
        if (statsData) {
          setStats((prev: any) => ({ ...prev, ...statsData }));
        }
        const evList = res?.data?.distinctEvents || res?.distinctEvents || res?.data?.stats?.distinctEvents;
        if (Array.isArray(evList) && evList.length > 0) {
          setDistinctEvents((prev) => Array.from(new Set([...prev, ...evList])));
        }
      }
    } catch (err) {
      console.error('Failed to load business founders stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, [eventId]);

  // ─── Fetch List ──────────────────────────────────────────────────────────────
  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchBusinessFounders({
        page,
        limit,
        search: search.trim(),
        industry,
        yearsInBusiness,
        biggestPriority,
        status,
        eventId
      });

      if (res) {
        const rawData =
          res?.data?.data !== undefined
            ? res.data.data
            : res?.data !== undefined
            ? res.data
            : res;

        const items = Array.isArray(rawData)
          ? rawData
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.registrations)
          ? res.registrations
          : Array.isArray(res?.data?.registrations)
          ? res.data.registrations
          : Array.isArray(res?.founders)
          ? res.founders
          : Array.isArray(res?.results)
          ? res.results
          : Array.isArray(res)
          ? res
          : [];

        const pagination = res?.data?.pagination || res?.pagination;
        const summary =
          res?.data?.summary ||
          res?.data?.counts ||
          res?.data?.stats ||
          res?.summary ||
          res?.counts ||
          res?.stats;
        const total = pagination?.total ?? summary?.totalFounders ?? summary?.total ?? items.length;
        const pages = pagination?.totalPages ?? pagination?.pages ?? Math.ceil(total / limit) ?? 1;

        const evList = res?.data?.distinctEvents || res?.distinctEvents;
        if (Array.isArray(evList) && evList.length > 0) {
          setDistinctEvents((prev) => Array.from(new Set([...prev, ...evList])));
        }

        setData(items);
        setTotalPages(pages || 1);
        setTotalCount(total);
        if (summary) {
          setStats((prev: any) => ({ ...prev, ...summary }));
        }
      }
    } catch (err) {
      console.error('Failed to load business founders:', err);
      toast.error('Failed to load business registrations');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, industry, yearsInBusiness, biggestPriority, status, eventId]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  // ─── Search Handlers ─────────────────────────────────────────────────────────
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadList();
  };

  const handleResetFilters = () => {
    setSearch('');
    setIndustry('');
    setYearsInBusiness('');
    setBiggestPriority('');
    setStatus('');
    setEventId('');
    setPage(1);
  };

  // ─── Export CSV ──────────────────────────────────────────────────────────────
  const handleExport = async () => {
    try {
      setIsExporting(true);
      toast.loading('Generating CSV...', { id: 'csv-biz-export' });
      await exportBusinessFoundersCsv({ eventId, search, industry, yearsInBusiness, biggestPriority, status });
      toast.success('CSV downloaded successfully!', { id: 'csv-biz-export' });
    } catch (err) {
      toast.error('Failed to export CSV.', { id: 'csv-biz-export' });
    } finally {
      setIsExporting(false);
    }
  };

  // ─── Open Edit Modal ─────────────────────────────────────────────────────────
  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setEditForm({
      fullName: item.fullName || '',
      phone: item.phone || '',
      email: item.email || '',
      businessName: item.businessName || '',
      industry: item.industry || 'manufacturing',
      yearsInBusiness: item.yearsInBusiness || '1_to_3_years',
      biggestPriority: item.biggestPriority || 'More Sales',
      growthBlocker: item.growthBlocker || 'Lack of Customers',
      hasTeam: item.hasTeam || 'Small Team',
      futureVision: item.futureVision || 'A Business That Runs Without Me',
      growthChallenge: item.growthChallenge || '',
      status: item.status || 'registered',
      notes: item.notes || ''
    });
  };

  // ─── Save Edit ───────────────────────────────────────────────────────────────
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setIsUpdating(true);
      const res = await updateBusinessFounder(editingItem._id || editingItem.id, editForm);
      if (res) {
        toast.success('Founder details updated successfully!');
        setEditingItem(null);
        loadList();
        loadStats();
      }
    } catch (err) {
      toast.error('Failed to update founder details.');
    } finally {
      setIsUpdating(false);
    }
  };

  // ─── Quick Status Change ─────────────────────────────────────────────────────
  const handleQuickStatus = async (item: any, newStatus: string) => {
    try {
      await updateBusinessFounder(item._id || item.id, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      loadList();
      loadStats();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  // ─── Delete ──────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    try {
      setIsDeleting(true);
      await deleteBusinessFounder(deletingId);
      toast.success('Registration deleted successfully.');
      setDeletingId(null);
      loadList();
      loadStats();
    } catch (err) {
      toast.error('Failed to delete registration.');
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const formatIndustry = (ind: string) => {
    const map: Record<string, string> = {
      manufacturing: 'Manufacturing',
      printing_packaging: 'Printing & Packaging',
      fireworks_matches: 'Fireworks & Matches',
      retail_wholesale: 'Retail & Wholesale',
      textiles_garments: 'Textiles & Garments',
      services_agency: 'Services & Agencies',
      food_hospitality: 'Food & Hospitality',
      tech_digital: 'Tech & Digital',
      other: 'Other Business'
    };
    return map[ind] || ind || 'Business Owner';
  };

  const formatYears = (y: string) => {
    const map: Record<string, string> = {
      less_than_1_year: '< 1 Year',
      '1_to_3_years': '1 – 3 Years',
      '3_to_5_years': '3 – 5 Years',
      '5_plus_years': '5+ Years'
    };
    return map[y] || y || '1+ Year';
  };

  const statusBadges: Record<string, { label: string; color: string }> = {
    registered: { label: 'Registered', color: 'bg-slate-100 text-slate-800 border-slate-300' },
    contacted: { label: 'Contacted', color: 'bg-sky-100 text-sky-800 border-sky-300' },
    confirmed: { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    attended: { label: 'Attended', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
    cancelled: { label: 'Cancelled', color: 'bg-rose-100 text-rose-800 border-rose-300' }
  };

  const getStatusBadge = (st: string) => {
    switch (st?.toLowerCase()) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Confirmed
          </span>
        );
      case 'attended':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Attended
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Registered
          </span>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* ─── Top Header Bar ───────────────────────────────────────────────── */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#16225E]/10 flex items-center justify-center text-[#16225E] font-black">
                <Briefcase className="w-5 h-5 text-[#16225E]" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 leading-tight">
                  Business Founders Community
                </h1>
                <p className="text-xs text-slate-500">
                  Orientation Registrations, Founder Diagnostics &amp; Assessment CRM
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={isExporting || totalCount === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => {
                loadStats();
                loadList();
              }}
              disabled={loading}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        <div className="p-5 space-y-4">
          {/* ─── Stats KPI Overview ────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Founders</p>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5 font-mono">
                  {statsLoading ? '…' : stats?.totalFounders ?? stats?.total ?? stats?.totalCount ?? totalCount}
                </h3>
              </div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Confirmed</p>
                <h3 className="text-2xl font-black text-emerald-600 mt-0.5 font-mono">
                  {statsLoading ? '…' : stats?.confirmed ?? stats?.counts?.confirmed ?? stats?.byStatus?.confirmed ?? 0}
                </h3>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Attended</p>
                <h3 className="text-2xl font-black text-blue-600 mt-0.5 font-mono">
                  {statsLoading ? '…' : stats?.attended ?? stats?.attend ?? stats?.byStatus?.attended ?? 0}
                </h3>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">New Registrations</p>
                <h3 className="text-2xl font-black text-amber-600 mt-0.5 font-mono">
                  {statsLoading ? '…' : stats?.newRegs ?? stats?.registered ?? stats?.pending ?? 0}
                </h3>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* ─── Search & Filter Controls ──────────────────────────────────── */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-2.5 items-center">
              {/* Search input */}
              <div className="flex-1 min-w-[180px] relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, phone, email, company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#147A87]"
                />
              </div>

              {/* Event Filter */}
              <select
                value={eventId}
                onChange={(e) => {
                  setEventId(e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none font-semibold text-slate-700"
              >
                <option value="">All Events</option>
                {Array.from(new Set(['BUSINESS-SEP-16-2026', 'BUSINESS-SEP-30-2026', ...distinctEvents]))
                  .filter(Boolean)
                  .map((ev) => (
                    <option key={ev} value={ev}>
                      {ev}
                    </option>
                  ))}
              </select>

              {/* Industry Dropdown */}
              <select
                value={industry}
                onChange={(e) => {
                  setIndustry(e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none font-semibold text-slate-700"
              >
                <option value="">All Sectors</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="printing_packaging">Printing &amp; Packaging</option>
                <option value="fireworks_matches">Fireworks &amp; Matches</option>
                <option value="retail_wholesale">Retail &amp; Wholesale</option>
                <option value="textiles_garments">Textiles &amp; Garments</option>
                <option value="services_agency">Services &amp; Agencies</option>
                <option value="food_hospitality">Food &amp; Hospitality</option>
                <option value="tech_digital">Tech &amp; Digital</option>
                <option value="other">Other Business</option>
              </select>

              {/* Years in Business */}
              <select
                value={yearsInBusiness}
                onChange={(e) => {
                  setYearsInBusiness(e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none font-semibold text-slate-700"
              >
                <option value="">All Experience</option>
                <option value="less_than_1_year">&lt; 1 Year</option>
                <option value="1_to_3_years">1 – 3 Years</option>
                <option value="3_to_5_years">3 – 5 Years</option>
                <option value="5_plus_years">5+ Years</option>
              </select>

              {/* Biggest Priority */}
              <select
                value={biggestPriority}
                onChange={(e) => {
                  setBiggestPriority(e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none font-semibold text-slate-700"
              >
                <option value="">All Priorities</option>
                <option value="More Sales">More Sales</option>
                <option value="More Customers">More Customers</option>
                <option value="More Profit">More Profit</option>
                <option value="Better Team">Better Team</option>
                <option value="Business Growth">Business Growth</option>
                <option value="Better Systems">Better Systems</option>
              </select>

              {/* Status Filter */}
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none font-semibold text-slate-700"
              >
                <option value="">All Statuses</option>
                <option value="registered">Registered</option>
                <option value="confirmed">Confirmed</option>
                <option value="attended">Attended</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button
                type="submit"
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Search
              </button>

              {(search || industry || yearsInBusiness || biggestPriority || status || eventId) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Clear filters"
                >
                  Reset
                </button>
              )}
            </form>
          </div>

          {/* ─── Data Table Card ───────────────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="w-full overflow-hidden">
              <table className="w-full table-fixed text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                    <th className="w-[19%] py-3.5 px-4">Founder</th>
                    <th className="w-[13%] py-3.5 px-4">Event ID</th>
                    <th className="w-[16%] py-3.5 px-4">Enterprise &amp; Sector</th>
                    <th className="w-[9%] py-3.5 px-4">Experience</th>
                    <th className="w-[12%] py-3.5 px-4">Key Priority</th>
                    <th className="w-[10%] py-3.5 px-4">Status</th>
                    <th className="w-[10%] py-3.5 px-4">Date</th>
                    <th className="w-[11%] py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-16 text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-8 h-8 border-3 border-[#147A87] border-t-transparent rounded-full animate-spin" />
                          <p className="font-semibold text-xs text-slate-500">Loading Business Founders...</p>
                        </div>
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-16 text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Briefcase className="w-10 h-10 text-slate-300" />
                          <p className="font-bold text-slate-700 text-base">No registrations found</p>
                          <p className="text-xs text-slate-400 max-w-sm">
                            Try adjusting your search criteria or clear the active filters.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((item, idx) => {
                      const id = item._id || item.id || idx;
                      const statusInfo = statusBadges[item.status?.toLowerCase()] || {
                        label: item.status || 'Registered',
                        color: 'bg-slate-100 text-slate-700 border-slate-300'
                      };

                      return (
                        <tr
                          key={id}
                          className="hover:bg-slate-50/70 transition-colors group"
                        >
                          {/* Founder Info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-full bg-[#16225E] text-white flex items-center justify-center font-bold text-xs font-mono flex-shrink-0 shadow-sm">
                                {item.fullName
                                  ? item.fullName
                                      .split(' ')
                                      .map((n: string) => n[0])
                                      .slice(0, 2)
                                      .join('')
                                      .toUpperCase()
                                  : 'BF'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <strong className="text-slate-900 font-bold block text-xs sm:text-sm truncate" title={item.fullName}>
                                  {item.fullName}
                                </strong>
                                <div className="flex flex-col text-[11px] text-slate-500 font-mono mt-0.5 leading-tight">
                                  <a
                                    href={`tel:${item.phone}`}
                                    className="hover:text-[#147A87] transition flex items-center gap-1 truncate"
                                  >
                                    <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                    <span>{item.phone}</span>
                                  </a>
                                  {item.email && (
                                    <span className="text-slate-400 truncate text-[10.5px]" title={item.email}>
                                      {item.email}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Event ID */}
                          <td className="py-3.5 px-4">
                            {item.eventId ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-mono font-bold bg-[#147A87]/10 text-[#147A87] border border-[#147A87]/20">
                                {item.eventId}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-mono text-[11px]">—</span>
                            )}
                          </td>

                          {/* Enterprise & Sector */}
                          <td className="py-3.5 px-4">
                            <div className="min-w-0">
                              <strong className="text-slate-800 block text-xs truncate" title={item.businessName || 'Business Enterprise'}>
                                {item.businessName || 'Business Enterprise'}
                              </strong>
                              <span className="inline-block mt-0.5 text-[10.5px] font-semibold text-[#16225E] bg-[#16225E]/5 px-2 py-0.5 rounded truncate max-w-full" title={formatIndustry(item.industry)}>
                                {formatIndustry(item.industry)}
                              </span>
                            </div>
                          </td>

                          {/* Experience */}
                          <td className="py-3.5 px-4 text-xs font-semibold text-slate-600 truncate">
                            {formatYears(item.yearsInBusiness)}
                          </td>

                          {/* Priority */}
                          <td className="py-3.5 px-4">
                            <span className="inline-block text-[11px] font-bold text-[#F0791E] bg-[#F0791E]/10 px-2 py-1 rounded-md truncate max-w-full" title={item.biggestPriority || 'Business Growth'}>
                              {item.biggestPriority || 'Business Growth'}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </td>

                          {/* Registered At */}
                          <td className="py-3.5 px-4 text-[11px] text-slate-500 font-mono whitespace-nowrap">
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })
                              : '—'}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center justify-end gap-1 flex-nowrap">
                              <button
                                onClick={() => setViewingItem(item)}
                                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                title="View details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenEdit(item)}
                                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                title="Edit details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingId(item._id || item.id)}
                                className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ─── Pagination Footer ────────────────────────────────────────── */}
            <div className="p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-600">
              <div>
                Showing {data.length} of {totalCount} total founders
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono">
                  Page {page} of {totalPages || 1}
                </span>
                <button
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── View Details Modal ───────────────────────────────────────────── */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#16225E] text-white flex items-center justify-center font-bold">
                  <Briefcase className="w-5 h-5 text-[#F0791E]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{viewingItem.fullName}</h3>
                  <p className="text-xs text-slate-500 font-medium">Business Founder Application Profile</p>
                </div>
              </div>
              <button
                onClick={() => setViewingItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-sm text-slate-700">
              {/* Top Summary Banner */}
              <div className="bg-gradient-to-r from-[#16225E]/5 to-[#F0791E]/5 p-4 rounded-2xl border border-[#E7E1D4] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Business / Company</div>
                  <div className="text-base font-extrabold text-[#16225E]">
                    {viewingItem.businessName || 'Business Enterprise'}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    {formatIndustry(viewingItem.industry)} · {formatYears(viewingItem.yearsInBusiness)}
                  </div>
                </div>

                <div>{getStatusBadge(viewingItem.status)}</div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#147A87]" /> Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 block">Mobile Phone</span>
                    <a
                      href={`tel:${viewingItem.phone}`}
                      className="font-bold text-slate-900 hover:text-[#147A87] font-mono text-sm inline-flex items-center gap-1.5 mt-0.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#147A87]" />
                      {viewingItem.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Email Address</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5">
                      {viewingItem.email || 'Not provided'}
                    </span>
                  </div>
                  {viewingItem.eventId && (
                    <div className="col-span-2">
                      <span className="text-xs text-slate-400 block">Event ID</span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#147A87]/10 text-[#147A87] border border-[#147A87]/20 mt-1">
                        {viewingItem.eventId}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 4 Founder Survey Diagnostics */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#F0791E]" /> Founder Diagnostic Assessment
                </h4>

                <div className="space-y-3 bg-[#FBF6EE] p-5 rounded-2xl border border-[#E7E1D4]">
                  <div>
                    <span className="text-xs font-bold text-[#666C87] block">
                      1. Biggest priority for business right now:
                    </span>
                    <strong className="text-sm font-extrabold text-[#16225E] block mt-0.5">
                      {viewingItem.biggestPriority || 'N/A'}
                    </strong>
                  </div>

                  <div className="border-t border-[#E7E1D4] pt-3">
                    <span className="text-xs font-bold text-[#666C87] block">
                      2. What is stopping your business from growing faster:
                    </span>
                    <strong className="text-sm font-extrabold text-[#16225E] block mt-0.5">
                      {viewingItem.growthBlocker || 'N/A'}
                    </strong>
                  </div>

                  <div className="border-t border-[#E7E1D4] pt-3">
                    <span className="text-xs font-bold text-[#666C87] block">
                      3. Currently has a team to support:
                    </span>
                    <strong className="text-sm font-extrabold text-[#16225E] block mt-0.5">
                      {viewingItem.hasTeam || 'N/A'}
                    </strong>
                  </div>

                  <div className="border-t border-[#E7E1D4] pt-3">
                    <span className="text-xs font-bold text-[#666C87] block">
                      4. Vision for next 2–3 years:
                    </span>
                    <strong className="text-sm font-extrabold text-[#16225E] block mt-0.5">
                      {viewingItem.futureVision || 'N/A'}
                    </strong>
                  </div>

                  {viewingItem.growthChallenge && (
                    <div className="border-t border-[#E7E1D4] pt-3">
                      <span className="text-xs font-bold text-[#666C87] block">
                        Specific question / challenge for mentors:
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 mt-1 italic bg-white p-3 rounded-xl border border-[#E7E1D4]">
                        "{viewingItem.growthChallenge}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick WhatsApp Action */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/91${viewingItem.phone?.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                    viewingItem.fullName || 'Founder'
                  )}%2C%20this%20is%20WeGrow%20B%20School%20regarding%20your%20Business%20Founders%20Orientation%20registration.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm py-3 px-4 rounded-xl transition shadow-md"
                >
                  <Phone className="w-4 h-4" /> Message Founder on WhatsApp
                </a>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setViewingItem(null)}
                className="px-5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Edit Modal ─────────────────────────────────────────────────── */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
              <div>
                <h3 className="text-lg font-black text-slate-900">Edit Founder Details</h3>
                <p className="text-xs text-slate-500">Update contact, sector, or attendance status</p>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#147A87]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#147A87] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#147A87]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Business / Company Name
                </label>
                <input
                  type="text"
                  value={editForm.businessName}
                  onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#147A87]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Business Sector
                  </label>
                  <select
                    value={editForm.industry}
                    onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#147A87]"
                  >
                    <option value="manufacturing">Manufacturing</option>
                    <option value="printing_packaging">Printing &amp; Packaging</option>
                    <option value="fireworks_matches">Fireworks &amp; Matches</option>
                    <option value="retail_wholesale">Retail &amp; Wholesale</option>
                    <option value="textiles_garments">Textiles &amp; Garments</option>
                    <option value="services_agency">Services &amp; Agencies</option>
                    <option value="food_hospitality">Food &amp; Hospitality</option>
                    <option value="tech_digital">Tech &amp; Digital</option>
                    <option value="other">Other Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#147A87] font-bold"
                  >
                    <option value="registered">Registered</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="attended">Attended</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Internal Notes
                </label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Notes from mentor / follow up call..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#147A87] resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#147A87] hover:bg-[#10626D] rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation Modal ────────────────────────────────────── */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Delete Registration?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this founder registration? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
