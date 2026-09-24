import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  Sparkles,
  Search,
  Filter,
  Download,
  Trash2,
  Edit2,
  Eye,
  X,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Trophy,
  HelpCircle,
  Award,
  Crown,
  ExternalLink,
  MessageSquare,
  Tag
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchEventTeasers,
  fetchEventTeaserStats,
  exportEventTeasersCsv,
  updateEventTeaser,
  deleteEventTeaser
} from '../../services/api';

interface EventTeaserItem {
  _id?: string;
  id?: string;
  name: string;
  phone: string;
  email: string;
  guess: string;
  eventId: string;
  status: 'PENDING' | 'REVIEWED' | 'CORRECT' | 'WINNER' | string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminEventTeaser() {
  // ─── State ───────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [data, setData] = useState<EventTeaserItem[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState('');
  const [guessFilter, setGuessFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [eventIdFilter, setEventIdFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [distinctEvents, setDistinctEvents] = useState<string[]>(['MYSTERY-EVENT-2026']);

  // Modals
  const [viewingItem, setViewingItem] = useState<EventTeaserItem | null>(null);
  const [editingItem, setEditingItem] = useState<EventTeaserItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    status: 'PENDING',
    notes: ''
  });

  // ─── Fetch Stats ─────────────────────────────────────────────────────────────
  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await fetchEventTeaserStats(eventIdFilter);
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
      console.error('Failed to load event teaser stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, [eventIdFilter]);

  // ─── Fetch List ──────────────────────────────────────────────────────────────
  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchEventTeasers({
        page,
        limit,
        search: search.trim(),
        guess: guessFilter.trim(),
        status: statusFilter,
        eventId: eventIdFilter,
        sortBy,
        sortOrder,
        startDate,
        endDate
      });

      if (res) {
        const rawData =
          res?.data?.data !== undefined
            ? res.data.data
            : res?.data?.guesses !== undefined
            ? res.data.guesses
            : res?.data?.items !== undefined
            ? res.data.items
            : res?.data !== undefined
            ? res.data
            : res?.guesses !== undefined
            ? res.guesses
            : res;

        const items: EventTeaserItem[] = Array.isArray(rawData)
          ? rawData
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data?.guesses)
          ? res.data.guesses
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.guesses)
          ? res.guesses
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

        const total = pagination?.total ?? pagination?.totalCount ?? summary?.totalGuesses ?? summary?.total ?? items.length;
        const pages = pagination?.totalPages ?? pagination?.pages ?? (Math.ceil(total / limit) || 1);

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
      console.error('Failed to load event teasers:', err);
      toast.error('Failed to load event guesses');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, guessFilter, statusFilter, eventIdFilter, sortBy, sortOrder, startDate, endDate]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  // ─── Search & Reset Handlers ─────────────────────────────────────────────────
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadList();
  };

  const handleResetFilters = () => {
    setSearch('');
    setGuessFilter('');
    setStatusFilter('');
    setEventIdFilter('');
    setStartDate('');
    setEndDate('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  // ─── Export CSV ──────────────────────────────────────────────────────────────
  const handleExport = async () => {
    try {
      setIsExporting(true);
      toast.loading('Generating Event Teasers CSV...', { id: 'csv-teaser-export' });
      await exportEventTeasersCsv({
        eventId: eventIdFilter,
        status: statusFilter,
        search: search.trim(),
        guess: guessFilter.trim(),
        startDate,
        endDate
      });
      toast.success('CSV downloaded successfully!', { id: 'csv-teaser-export' });
    } catch (err) {
      console.error('Export CSV error:', err);
      toast.error('Failed to export CSV.', { id: 'csv-teaser-export' });
    } finally {
      setIsExporting(false);
    }
  };

  // ─── Edit Modal ──────────────────────────────────────────────────────────────
  const handleOpenEdit = (item: EventTeaserItem) => {
    setEditingItem(item);
    setEditForm({
      status: (item.status || 'PENDING').toUpperCase(),
      notes: item.notes || ''
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const id = editingItem._id || editingItem.id;
    if (!id) {
      toast.error('Missing item ID');
      return;
    }

    try {
      setIsUpdating(true);
      await updateEventTeaser(id, {
        status: editForm.status,
        notes: editForm.notes.trim()
      });
      toast.success('Guess status updated successfully!');
      setEditingItem(null);
      loadList();
      loadStats();
    } catch (err: any) {
      console.error('Update error:', err);
      toast.error(err?.message || 'Failed to update guess');
    } finally {
      setIsUpdating(false);
    }
  };

  // ─── Quick Status Change ─────────────────────────────────────────────────────
  const handleQuickStatus = async (item: EventTeaserItem, newStatus: string) => {
    const id = item._id || item.id;
    if (!id) return;
    try {
      await updateEventTeaser(id, { status: newStatus });
      toast.success(`Marked as ${newStatus}`);
      if (viewingItem && (viewingItem._id === id || viewingItem.id === id)) {
        setViewingItem({ ...viewingItem, status: newStatus });
      }
      loadList();
      loadStats();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update status');
    }
  };

  // ─── Delete ──────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      await deleteEventTeaser(deletingId);
      toast.success('Guess deleted successfully');
      setDeletingId(null);
      if (viewingItem && (viewingItem._id === deletingId || viewingItem.id === deletingId)) {
        setViewingItem(null);
      }
      loadList();
      loadStats();
    } catch (err: any) {
      console.error('Delete error:', err);
      toast.error(err?.message || 'Failed to delete guess');
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper status badge styles
  const getStatusBadge = (statusStr: string) => {
    const s = String(statusStr || 'PENDING').toUpperCase();
    switch (s) {
      case 'WINNER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-600 border border-amber-500/30">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            WINNER
          </span>
        );
      case 'CORRECT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            CORRECT
          </span>
        );
      case 'REVIEWED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-600 border border-blue-500/30">
            <Eye className="w-3.5 h-3.5 text-blue-500" />
            REVIEWED
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 border border-amber-400/30">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            PENDING
          </span>
        );
    }
  };

  // Computed stat values
  const totalGuessesCount = stats?.totalGuesses ?? stats?.total ?? totalCount ?? 0;
  const winnerCount = stats?.winner ?? stats?.winners ?? stats?.byStatus?.WINNER ?? data.filter((d) => (d.status || '').toUpperCase() === 'WINNER').length;
  const correctCount = stats?.correct ?? stats?.byStatus?.CORRECT ?? data.filter((d) => (d.status || '').toUpperCase() === 'CORRECT').length;
  const pendingCount = stats?.pending ?? stats?.byStatus?.PENDING ?? data.filter((d) => (d.status || '').toUpperCase() === 'PENDING').length;
  const reviewedCount = stats?.reviewed ?? stats?.byStatus?.REVIEWED ?? data.filter((d) => (d.status || '').toUpperCase() === 'REVIEWED').length;

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 sticky top-0 z-10 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#F0791E]/10 text-[#F0791E]">
                  <HelpCircle className="w-5 h-5" />
                </span>
                <div>
                  <h1 className="text-xl font-black text-[#16225E] tracking-tight">
                    Event Teaser Management
                  </h1>
                  <p className="text-xs font-medium text-slate-500">
                    Review public event guesses, select winners, and track mystery campaign engagement
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <a
                href="/event-teaser"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Page</span>
              </a>

              <button
                onClick={() => {
                  loadList();
                  loadStats();
                  toast.success('Data refreshed');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                title="Refresh data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16225E] hover:bg-[#1f2f80] text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {/* ─── Metric Stat Cards ──────────────────────────────────────────────── */}
          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {/* Total Guesses */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Guesses</p>
                <p className="text-xl font-black text-[#16225E]">{statsLoading ? '...' : totalGuessesCount}</p>
              </div>
            </div>

            {/* Pending Review */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending</p>
                <p className="text-xl font-black text-amber-600">{statsLoading ? '...' : pendingCount}</p>
              </div>
            </div>

            {/* Reviewed */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reviewed</p>
                <p className="text-xl font-black text-indigo-600">{statsLoading ? '...' : reviewedCount}</p>
              </div>
            </div>

            {/* Correct Guesses */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Correct</p>
                <p className="text-xl font-black text-emerald-600">{statsLoading ? '...' : correctCount}</p>
              </div>
            </div>

            {/* Winners */}
            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs flex items-center gap-3 bg-gradient-to-br from-amber-500/5 to-orange-500/5 col-span-2 sm:col-span-1">
              <div className="p-3 rounded-xl bg-amber-500/15 text-amber-600 shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-black text-amber-700 uppercase tracking-wider">Winners</p>
                <p className="text-xl font-black text-amber-600">{statsLoading ? '...' : winnerCount}</p>
              </div>
            </div>
          </section>

          {/* ─── Search & Filters Bar ────────────────────────────────────────────── */}
          <section className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {/* Search */}
              <div className="col-span-1 sm:col-span-2 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, phone, email, guess..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#F0791E] focus:ring-1 focus:ring-[#F0791E] text-slate-800"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#F0791E] text-slate-800"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REVIEWED">REVIEWED</option>
                  <option value="CORRECT">CORRECT</option>
                  <option value="WINNER">WINNER</option>
                </select>
              </div>

              {/* Event ID Filter */}
              <div>
                <select
                  value={eventIdFilter}
                  onChange={(e) => {
                    setEventIdFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#F0791E] text-slate-800"
                >
                  <option value="">All Event IDs</option>
                  {distinctEvents.map((ev) => (
                    <option key={ev} value={ev}>
                      {ev}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <select
                  value={`${sortBy}:${sortOrder}`}
                  onChange={(e) => {
                    const [f, o] = e.target.value.split(':');
                    setSortBy(f);
                    setSortOrder(o as 'desc' | 'asc');
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#F0791E] text-slate-800"
                >
                  <option value="createdAt:desc">Newest First</option>
                  <option value="createdAt:asc">Oldest First</option>
                  <option value="name:asc">Name (A-Z)</option>
                  <option value="status:asc">Status</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-xl bg-[#F0791E] hover:bg-[#d96714] text-white text-xs font-bold transition-all cursor-pointer text-center"
                >
                  Filter
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all cursor-pointer"
                  title="Reset all filters"
                >
                  Reset
                </button>
              </div>
            </form>
          </section>

          {/* ─── Data Table ──────────────────────────────────────────────────────── */}
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Participant</th>
                    <th className="px-4 py-3.5">Contact</th>
                    <th className="px-4 py-3.5 min-w-[200px]">Guess</th>
                    <th className="px-4 py-3.5">Event ID</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Admin Notes</th>
                    <th className="px-4 py-3.5">Submitted</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-16">
                        <div className="inline-flex flex-col items-center gap-2 text-slate-400">
                          <div className="w-8 h-8 border-3 border-slate-200 border-t-[#F0791E] rounded-full animate-spin" />
                          <span className="text-xs font-medium">Loading event guesses...</span>
                        </div>
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-16">
                        <div className="inline-flex flex-col items-center gap-2 text-slate-400">
                          <AlertCircle className="w-8 h-8 text-slate-300" />
                          <p className="text-sm font-bold text-slate-600">No guesses found</p>
                          <p className="text-xs text-slate-400">Try adjusting your search criteria or filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((item, idx) => {
                      const id = item._id || item.id || `guess-${idx}`;
                      const formattedDate = item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : '—';

                      return (
                        <tr
                          key={id}
                          className="hover:bg-slate-50/60 transition-colors group"
                        >
                          {/* Name */}
                          <td className="px-5 py-3.5">
                            <div className="font-bold text-[#16225E] text-xs">
                              {item.name || 'Anonymous'}
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="px-4 py-3.5 space-y-0.5">
                            {item.phone && (
                              <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{item.phone}</span>
                              </div>
                            )}
                            {item.email && (
                              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] truncate max-w-[160px]">
                                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                <span title={item.email}>{item.email}</span>
                              </div>
                            )}
                          </td>

                          {/* Guess */}
                          <td className="px-4 py-3.5">
                            <div className="bg-amber-500/10 border border-amber-500/20 text-[#16225E] font-medium px-3 py-1.5 rounded-xl text-xs inline-block max-w-sm break-words">
                              "{item.guess}"
                            </div>
                          </td>

                          {/* Event ID */}
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px]">
                              <Tag className="w-2.5 h-2.5 text-slate-400" />
                              {item.eventId || 'MYSTERY-EVENT-2026'}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5">
                            {getStatusBadge(item.status)}
                          </td>

                          {/* Notes */}
                          <td className="px-4 py-3.5">
                            {item.notes ? (
                              <p className="text-slate-600 text-xs italic line-clamp-2 max-w-[180px]" title={item.notes}>
                                {item.notes}
                              </p>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>

                          {/* Submitted */}
                          <td className="px-4 py-3.5 text-[11px] text-slate-500 whitespace-nowrap">
                            {formattedDate}
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1">
                              {/* View */}
                              <button
                                onClick={() => setViewingItem(item)}
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-[#16225E] transition-all cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => handleOpenEdit(item)}
                                className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-600 hover:text-amber-600 transition-all cursor-pointer"
                                title="Edit Status / Notes"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => setDeletingId(id)}
                                className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-all cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
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

            {/* ─── Pagination Footer ──────────────────────────────────────────────── */}
            <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <div>
                Showing <span className="font-bold text-slate-800">{data.length > 0 ? (page - 1) * limit + 1 : 0}</span> to{' '}
                <span className="font-bold text-slate-800">{Math.min(page * limit, totalCount)}</span> of{' '}
                <span className="font-bold text-slate-800">{totalCount}</span> guesses
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page <= 1 || loading}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 text-xs font-bold text-slate-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page >= totalPages || loading}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ─── MODAL: VIEW DETAILS ─────────────────────────────────────────────────── */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F0791E]" />
                <h3 className="font-black text-[#16225E] text-base">Guess Details</h3>
              </div>
              <button
                onClick={() => setViewingItem(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Guess Highlight */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-1">Mystery Guess</p>
                <p className="text-base font-black text-[#16225E]">"{viewingItem.guess}"</p>
              </div>

              {/* User Details Grid */}
              <div className="grid grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{viewingItem.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                  <div className="mt-1">{getStatusBadge(viewingItem.status)}</div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                  <p className="font-medium text-slate-700 mt-0.5">{viewingItem.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                  <p className="font-medium text-slate-700 mt-0.5 truncate">{viewingItem.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Event ID</p>
                  <p className="font-mono text-slate-700 mt-0.5">{viewingItem.eventId || 'MYSTERY-EVENT-2026'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submitted Date</p>
                  <p className="font-medium text-slate-700 mt-0.5">
                    {viewingItem.createdAt ? new Date(viewingItem.createdAt).toLocaleString() : '—'}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {viewingItem.notes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Admin Notes</p>
                  <p className="text-slate-700">{viewingItem.notes}</p>
                </div>
              )}

              {/* Quick Status Buttons */}
              <div className="pt-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Actions</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleQuickStatus(viewingItem, 'WINNER')}
                    className="py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer border border-amber-500/30"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    Mark Winner
                  </button>
                  <button
                    onClick={() => handleQuickStatus(viewingItem, 'CORRECT')}
                    className="py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer border border-emerald-500/30"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark Correct
                  </button>
                  <button
                    onClick={() => handleQuickStatus(viewingItem, 'REVIEWED')}
                    className="py-2 px-3 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-700 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer border border-blue-500/30"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Mark Reviewed
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => {
                  const item = viewingItem;
                  setViewingItem(null);
                  handleOpenEdit(item);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-all cursor-pointer"
              >
                Edit Details
              </button>
              <button
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: EDIT STATUS & NOTES ─────────────────────────────────────────── */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#F0791E]" />
                <h3 className="font-black text-[#16225E] text-base">Update Status & Notes</h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">
                  Participant: <span className="font-bold text-slate-800">{editingItem.name}</span>
                </p>
                <p className="text-xs text-slate-500 italic">"{editingItem.guess}"</p>
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Submission Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-[#F0791E] focus:ring-1 focus:ring-[#F0791E]"
                >
                  <option value="PENDING">PENDING — Under Review</option>
                  <option value="REVIEWED">REVIEWED — Verified & Checked</option>
                  <option value="CORRECT">CORRECT — Guessed the exact mystery event</option>
                  <option value="WINNER">WINNER — Selected Grand Winner 🏆</option>
                </select>
              </div>

              {/* Notes Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Admin Internal Notes
                </label>
                <textarea
                  rows={3}
                  value={editForm.notes}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g., Guessed correctly first / eligible for early bird prize..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-[#F0791E] focus:ring-1 focus:ring-[#F0791E]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-xl bg-[#F0791E] hover:bg-[#d96714] text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: DELETE CONFIRMATION ─────────────────────────────────────────── */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-slate-100 overflow-hidden p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-800 text-base mb-1">Delete Guess Submission?</h3>
            <p className="text-xs text-slate-500 mb-6">
              Are you sure you want to delete this event teaser guess? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
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
