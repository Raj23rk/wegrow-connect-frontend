import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import {
  MessageSquare,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Phone,
  Mail,
  Copy,
  Check,
  X,
  FileSpreadsheet,
  AlertTriangle,
  Building2,
  User,
  Activity,
  Calendar,
  Sparkles,
  ThumbsUp,
  CheckCircle,
  Share2,
  Heart,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getMeetupFeedbacks,
  deleteMeetupFeedback,
  updateMeetupFeedback,
  exportMeetupFeedbackCsv
} from '../../services/businessDependencyApi';

export interface MeetupFeedbackItem {
  id: string;
  name: string;
  experience: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement' | string;
  willingToGrow: 'Yes' | 'No' | 'Maybe' | string;
  canRefer: 'Yes' | 'No' | string;
  referralName?: string;
  referralBusiness?: string;
  referralMobile?: string;
  likedMost?: string;
  suggestions?: string;
  keyTakeaways?: string;
  eventName?: string;
  eventDate?: string;
  submittedAt?: string;
  status?: 'new' | 'reviewed' | 'contacted' | 'archived' | string;
  notes?: string;
}

export default function AdminMeetupFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<MeetupFeedbackItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Search
  const [search, setSearch] = useState<string>('');
  const [filterExperience, setFilterExperience] = useState<string>('ALL');
  const [filterWilling, setFilterWilling] = useState<string>('ALL');
  const [filterReferral, setFilterReferral] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // Modal View
  const [viewingItem, setViewingItem] = useState<MeetupFeedbackItem | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (filterExperience !== 'ALL') params.experience = filterExperience;
      if (filterWilling !== 'ALL') params.willingToGrow = filterWilling;
      if (filterReferral !== 'ALL') params.canRefer = filterReferral;
      if (search.trim()) params.search = search.trim();

      const res = await getMeetupFeedbacks(params);
      const rawList = res?.data?.feedbacks || res?.data || (Array.isArray(res) ? res : []);
      const normalizedList: MeetupFeedbackItem[] = (Array.isArray(rawList) ? rawList : (rawList ? [rawList] : [])).map((item: any, idx: number) => ({
        id: item._id || item.id || `fb_${idx}`,
        name: item.name || item.fullName || 'Anonymous',
        experience: item.experience || 'Good',
        willingToGrow: item.willingToGrow || item.willing_to_grow || 'Yes',
        canRefer: item.canRefer || item.can_refer || 'No',
        referralName: item.referralName || item.referral_name || '',
        referralBusiness: item.referralBusiness || item.referral_business || '',
        referralMobile: item.referralMobile || item.referral_mobile || '',
        likedMost: item.likedMost || item.liked_most || '',
        suggestions: item.suggestions || '',
        keyTakeaways: item.keyTakeaways || item.key_takeaways || '',
        eventName: item.eventName || item.eventTitle || 'Business Transformation Meetup',
        eventDate: item.eventDate || item.event_date || (item.submittedAt ? item.submittedAt.slice(0, 10) : '2026-10-09'),
        submittedAt: item.submittedAt || item.createdAt || new Date().toISOString(),
        status: item.status || 'new',
        notes: item.notes || ''
      }));
      setFeedbacks(normalizedList);
    } catch (err) {
      console.warn('Could not fetch from backend:', err);
      toast.error('Failed to load feedback from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [filterExperience, filterWilling, filterReferral, startDate, endDate]);

  const handleOct9Preset = () => {
    setStartDate('2026-10-09');
    setEndDate('2026-10-09');
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setFilterExperience('ALL');
    setFilterWilling('ALL');
    setFilterReferral('ALL');
    setStartDate('');
    setEndDate('');
    setSortBy('newest');
    setPage(1);
  };

  // Copy helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied ${fieldName}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Filtered and Sorted list
  const filteredFeedbacks = useMemo(() => {
    let list = feedbacks.filter((item) => {
      // Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(query);
        const matchesRefName = item.referralName?.toLowerCase().includes(query);
        const matchesRefBiz = item.referralBusiness?.toLowerCase().includes(query);
        const matchesPhone = item.referralMobile?.toLowerCase().includes(query);
        const matchesLiked = item.likedMost?.toLowerCase().includes(query);
        const matchesTakeaways = item.keyTakeaways?.toLowerCase().includes(query);
        const matchesSuggestions = item.suggestions?.toLowerCase().includes(query);

        if (!matchesName && !matchesRefName && !matchesRefBiz && !matchesPhone && !matchesLiked && !matchesTakeaways && !matchesSuggestions) {
          return false;
        }
      }

      // Experience
      if (filterExperience !== 'ALL' && item.experience !== filterExperience) {
        return false;
      }

      // Willing to grow
      if (filterWilling !== 'ALL' && item.willingToGrow !== filterWilling) {
        return false;
      }

      // Referral
      if (filterReferral !== 'ALL' && item.canRefer !== filterReferral) {
        return false;
      }

      return true;
    });

    // Sorting
    list.sort((a, b) => {
      const dateA = new Date(a.submittedAt || 0).getTime();
      const dateB = new Date(b.submittedAt || 0).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return list;
  }, [feedbacks, search, filterExperience, filterWilling, filterReferral, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = feedbacks.length;
    const excellent = feedbacks.filter((f) => f.experience === 'Excellent').length;
    const good = feedbacks.filter((f) => f.experience === 'Good').length;
    const average = feedbacks.filter((f) => f.experience === 'Average').length;
    const needsImp = feedbacks.filter((f) => f.experience === 'Needs Improvement').length;
    const readyToGrow = feedbacks.filter((f) => f.willingToGrow === 'Yes').length;
    const withReferrals = feedbacks.filter((f) => f.canRefer === 'Yes').length;
    const ratingPct = total > 0 ? Math.round(((excellent * 100 + good * 80 + average * 50 + needsImp * 25) / (total * 100)) * 100) : 0;

    return { total, excellent, good, average, needsImp, readyToGrow, withReferrals, ratingPct };
  }, [feedbacks]);

  // Pagination slice
  const totalPages = Math.ceil(filteredFeedbacks.length / limit) || 1;
  const paginatedFeedbacks = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredFeedbacks.slice(start, start + limit);
  }, [filteredFeedbacks, page, limit]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this feedback record?')) return;
    try {
      await deleteMeetupFeedback(id);
      toast.success('Feedback deleted successfully');
      setFeedbacks((prev) => prev.filter((item) => item.id !== id));
      if (viewingItem?.id === id) setViewingItem(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const handleExportCSV = async () => {
    if (filteredFeedbacks.length === 0) {
      toast.error('No feedback entries to export');
      return;
    }

    try {
      await exportMeetupFeedbackCsv({
        startDate,
        endDate,
        experience: filterExperience !== 'ALL' ? filterExperience : undefined
      });
      toast.success('Feedback CSV exported from server');
      return;
    } catch (err) {
      console.warn('Server CSV notice, generating client CSV:', err);
    }

    const headers = [
      'Date & Time',
      'Attendee Name',
      'Experience',
      'Willing To Grow',
      'Can Refer',
      'Referral Name',
      'Referral Business',
      'Referral Phone',
      'Liked Most',
      'Key Takeaways',
      'Suggestions',
      'Event Name',
      'Status'
    ];

    const rows = filteredFeedbacks.map((f) => [
      `"${new Date(f.submittedAt || '').toLocaleString()}"`,
      `"${(f.name || '').replace(/"/g, '""')}"`,
      `"${f.experience || ''}"`,
      `"${f.willingToGrow || ''}"`,
      `"${f.canRefer || ''}"`,
      `"${(f.referralName || '').replace(/"/g, '""')}"`,
      `"${(f.referralBusiness || '').replace(/"/g, '""')}"`,
      `"${(f.referralMobile || '').replace(/"/g, '""')}"`,
      `"${(f.likedMost || '').replace(/"/g, '""')}"`,
      `"${(f.keyTakeaways || '').replace(/"/g, '""')}"`,
      `"${(f.suggestions || '').replace(/"/g, '""')}"`,
      `"${(f.eventName || '').replace(/"/g, '""')}"`,
      `"${f.status || 'new'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `meetup_feedback_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloaded client CSV');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Admin Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1B2A6B] to-[#F26A1B] text-white flex items-center justify-center shadow-md shadow-orange-900/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 tracking-tight">
                  Business Transformation Meetup
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#F26A1B] font-bold text-xs">
                  <Sparkles className="w-3 h-3" />
                  Feedback Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Attendee responses, experience ratings, growth readiness, and founder referrals
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleOct9Preset}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-xs ${
                startDate === '2026-10-09'
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-orange-50 hover:bg-orange-100 text-[#F26A1B] border-orange-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Oct 9 Meetup Event</span>
            </button>

            <Link
              to="/feedback"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all border border-slate-200 shadow-xs"
            >
              <span>Live Form</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={fetchFeedbacks}
              disabled={loading}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs cursor-pointer"
              title="Refresh Feedback List"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#F26A1B]' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-4 flex-1 min-h-0 flex flex-col gap-3 overflow-hidden">
          {/* ─── Metric Cards ───────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
            {/* Total Submissions */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 px-4 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Total Responses
                </span>
                <div className="text-xl font-black text-slate-900 leading-tight">
                  {stats.total}
                </div>
                <span className="text-[10px] text-slate-500 font-medium">All attendee reviews</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>

            {/* Satisfaction Rating */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 px-4 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-0.5">
                  Satisfaction Score
                </span>
                <div className="text-xl font-black text-slate-900 leading-tight">
                  {stats.ratingPct}%
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  {stats.excellent} Excellent • {stats.good} Good
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ThumbsUp className="w-5 h-5" />
              </div>
            </div>

            {/* Willing to Grow */}
            <div
              onClick={() => {
                setFilterWilling(filterWilling === 'Yes' ? 'ALL' : 'Yes');
                setPage(1);
              }}
              className={`bg-white rounded-xl border p-3.5 px-4 shadow-xs flex items-center justify-between cursor-pointer transition-all ${
                filterWilling === 'Yes' ? 'border-orange-500 ring-2 ring-orange-200 bg-orange-50/20' : 'border-slate-200 hover:border-orange-400'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block mb-0.5">
                  Willing to Grow
                </span>
                <div className="text-xl font-black text-slate-900 leading-tight">
                  {stats.readyToGrow}
                </div>
                <span className="text-[10px] text-orange-600 font-semibold">Ready to scale business</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>

            {/* Founder Referrals */}
            <div
              onClick={() => {
                setFilterReferral(filterReferral === 'Yes' ? 'ALL' : 'Yes');
                setPage(1);
              }}
              className={`bg-white rounded-xl border p-3.5 px-4 shadow-xs flex items-center justify-between cursor-pointer transition-all ${
                filterReferral === 'Yes' ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50/20' : 'border-slate-200 hover:border-purple-400'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block mb-0.5">
                  Founder Referrals
                </span>
                <div className="text-xl font-black text-slate-900 leading-tight">
                  {stats.withReferrals}
                </div>
                <span className="text-[10px] text-purple-600 font-semibold">New warm leads introduced</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* ─── Search & Filter Bar ─────────────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 px-4 shadow-xs shrink-0 space-y-2.5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
              {/* Experience Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit flex-wrap">
                <button
                  type="button"
                  onClick={() => { setFilterExperience('ALL'); setPage(1); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    filterExperience === 'ALL'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({stats.total})
                </button>
                <button
                  type="button"
                  onClick={() => { setFilterExperience('Excellent'); setPage(1); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    filterExperience === 'Excellent'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🌟 Excellent</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                    {stats.excellent}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => { setFilterExperience('Good'); setPage(1); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    filterExperience === 'Good'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>👌 Good</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                    {stats.good}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => { setFilterExperience('Average'); setPage(1); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    filterExperience === 'Average'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>👍 Average</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                    {stats.average}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => { setFilterExperience('Needs Improvement'); setPage(1); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    filterExperience === 'Needs Improvement'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>💡 Needs Imp</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                    {stats.needsImp}
                  </span>
                </button>
              </div>

              {/* Items Per Page Selector */}
              <div className="flex items-center gap-2 self-end lg:self-auto">
                <span className="text-xs text-slate-500 font-semibold">Per page:</span>
                <select
                  value={limit}
                  onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                  className="h-8 px-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:border-[#F26A1B] outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            {/* Search Input and Sub-filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search by Attendee Name, Referral Name, Business, Phone, Takeaways..."
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-xs text-slate-800 placeholder-slate-400 focus:border-[#F26A1B] focus:ring-1 focus:ring-[#F26A1B] outline-none transition-all"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Willing to Grow filter */}
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={filterWilling}
                  onChange={(e) => { setFilterWilling(e.target.value); setPage(1); }}
                  className="h-9 px-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:border-[#F26A1B] outline-none cursor-pointer"
                >
                  <option value="ALL">All Growth Interest</option>
                  <option value="Yes">Willing: Yes</option>
                  <option value="Maybe">Willing: Maybe</option>
                  <option value="No">Willing: No</option>
                </select>
              </div>

              {/* Referral Filter */}
              <select
                value={filterReferral}
                onChange={(e) => { setFilterReferral(e.target.value); setPage(1); }}
                className="h-9 px-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:border-[#F26A1B] outline-none cursor-pointer"
              >
                <option value="ALL">All Referral Status</option>
                <option value="Yes">Has Referrals (Yes)</option>
                <option value="No">No Referrals</option>
              </select>

              {/* Sort selector */}
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="h-9 px-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:border-[#F26A1B] outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>

              {(search || filterExperience !== 'ALL' || filterWilling !== 'ALL' || filterReferral !== 'ALL' || startDate || endDate) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="h-9 px-3 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors whitespace-nowrap"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* ─── Feedback Table ────────────────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse min-w-[950px]">
                <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 z-10">
                  <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-4 w-12 text-center">#</th>
                    <th className="py-2.5 px-4">Date & Time</th>
                    <th className="py-2.5 px-4">Attendee</th>
                    <th className="py-2.5 px-4">Experience</th>
                    <th className="py-2.5 px-4">Willing to Grow</th>
                    <th className="py-2.5 px-4">Referral Lead</th>
                    <th className="py-2.5 px-4">Key Takeaway / Notes</th>
                    <th className="py-2.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-slate-400">
                        <RefreshCw className="w-6 h-6 mx-auto animate-spin text-[#F26A1B] mb-2" />
                        <span className="font-semibold text-xs">Loading feedback entries…</span>
                      </td>
                    </tr>
                  ) : paginatedFeedbacks.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-slate-400">
                        <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        <p className="font-bold text-sm text-slate-600">No feedback submissions found</p>
                        <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or date range</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedFeedbacks.map((item, idx) => {
                      const displayIdx = (page - 1) * limit + idx + 1;
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                          onClick={() => setViewingItem(item)}
                        >
                          {/* Index */}
                          <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                            #{displayIdx}
                          </td>

                          {/* Date & Time */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : '09/10/2026'}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono block pl-5">
                              {item.submittedAt ? new Date(item.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                            </span>
                          </td>

                          {/* Attendee Name */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span>{item.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 pl-5 block">
                              {item.eventName || 'Business Transformation Meetup'}
                            </span>
                          </td>

                          {/* Experience Rating */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                item.experience === 'Excellent'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : item.experience === 'Good'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : item.experience === 'Average'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {item.experience === 'Excellent' && '🌟'}
                              {item.experience === 'Good' && '👌'}
                              {item.experience === 'Average' && '👍'}
                              {item.experience === 'Needs Improvement' && '💡'}
                              <span>{item.experience}</span>
                            </span>
                          </td>

                          {/* Willing to Grow */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                                item.willingToGrow === 'Yes'
                                  ? 'text-emerald-700 bg-emerald-50'
                                  : item.willingToGrow === 'Maybe'
                                  ? 'text-amber-700 bg-amber-50'
                                  : 'text-slate-500 bg-slate-100'
                              }`}
                            >
                              {item.willingToGrow === 'Yes' ? '✓ Yes' : item.willingToGrow === 'Maybe' ? '~ Maybe' : '✕ No'}
                            </span>
                          </td>

                          {/* Referral Lead Info */}
                          <td className="py-3.5 px-4">
                            {item.canRefer === 'Yes' && item.referralName ? (
                              <div className="space-y-0.5">
                                <div className="font-bold text-purple-700 flex items-center gap-1">
                                  <span>{item.referralName}</span>
                                </div>
                                {item.referralBusiness && (
                                  <div className="text-[11px] text-slate-500 font-medium">
                                    {item.referralBusiness}
                                  </div>
                                )}
                                {item.referralMobile && (
                                  <a
                                    href={`tel:${item.referralMobile}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 text-[11px] text-[#F26A1B] font-bold hover:underline"
                                  >
                                    <Phone className="w-3 h-3" />
                                    {item.referralMobile}
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs font-medium">None</span>
                            )}
                          </td>

                          {/* Key Takeaways */}
                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="text-slate-600 line-clamp-2 text-xs">
                              {item.keyTakeaways || item.likedMost || item.suggestions || '—'}
                            </p>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-center">
                            <div
                              className="flex items-center justify-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => setViewingItem(item)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                title="View Feedback Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete Record"
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

            {/* Pagination Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 text-xs">
              <span className="text-slate-500 font-medium">
                Showing{' '}
                <strong className="text-slate-800">
                  {filteredFeedbacks.length === 0 ? 0 : (page - 1) * limit + 1}
                </strong>{' '}
                to{' '}
                <strong className="text-slate-800">
                  {Math.min(page * limit, filteredFeedbacks.length)}
                </strong>{' '}
                of <strong className="text-slate-800">{filteredFeedbacks.length}</strong> feedbacks
                {totalPages > 1 && ` (Page ${page} of ${totalPages})`}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 transition-all cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-bold text-slate-800">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 transition-all cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ─── Detail View Modal ─────────────────────────────────────────────── */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="bg-slate-50 border-b border-slate-200 p-5 px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F26A1B] flex items-center justify-center font-bold">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Feedback Details: {viewingItem.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Submitted on {new Date(viewingItem.submittedAt || '').toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* Summary Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Experience Rating
                  </span>
                  <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1">
                    {viewingItem.experience === 'Excellent' && '🌟'}
                    {viewingItem.experience === 'Good' && '👌'}
                    {viewingItem.experience === 'Average' && '👍'}
                    {viewingItem.experience === 'Needs Improvement' && '💡'}
                    {viewingItem.experience}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Willing to Grow
                  </span>
                  <span className="font-extrabold text-sm text-slate-900">
                    {viewingItem.willingToGrow}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Can Refer Founder
                  </span>
                  <span className="font-extrabold text-sm text-slate-900">
                    {viewingItem.canRefer}
                  </span>
                </div>
              </div>

              {/* Referral Details if any */}
              {viewingItem.canRefer === 'Yes' && viewingItem.referralName && (
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-purple-600" />
                      Referred Founder Contact
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          `${viewingItem.referralName} - ${viewingItem.referralBusiness} - ${viewingItem.referralMobile}`,
                          'Referral Info'
                        )
                      }
                      className="text-[11px] font-bold text-purple-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      Copy Info
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Founder Name:</span>
                      <strong className="text-slate-900">{viewingItem.referralName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Business Name:</span>
                      <strong className="text-slate-900">{viewingItem.referralBusiness || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Mobile Number:</span>
                      {viewingItem.referralMobile ? (
                        <a
                          href={`tel:${viewingItem.referralMobile}`}
                          className="font-bold text-[#F26A1B] hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          {viewingItem.referralMobile}
                        </a>
                      ) : (
                        '—'
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Liked Most */}
              {viewingItem.likedMost && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 text-xs block mb-1">
                    ❤️ What they liked most:
                  </span>
                  <p className="text-slate-700 leading-relaxed">{viewingItem.likedMost}</p>
                </div>
              )}

              {/* Key Takeaways */}
              {viewingItem.keyTakeaways && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 text-xs block mb-1">
                    🎯 Key Takeaway Points:
                  </span>
                  <p className="text-slate-700 leading-relaxed">{viewingItem.keyTakeaways}</p>
                </div>
              )}

              {/* Suggestions */}
              {viewingItem.suggestions && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 text-xs block mb-1">
                    💡 Suggestions for improvement:
                  </span>
                  <p className="text-slate-700 leading-relaxed">{viewingItem.suggestions}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => handleDelete(viewingItem.id)}
                className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Feedback</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
