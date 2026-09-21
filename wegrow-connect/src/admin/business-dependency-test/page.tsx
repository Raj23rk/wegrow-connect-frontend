import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import {
  ClipboardCheck,
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
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getBusinessDependencySubmissions,
  getBusinessDependencyStats,
  exportBusinessDependencyCsv,
  deleteBusinessDependency
} from '../../services/businessDependencyApi';

export interface BDTSubmission {
  id: string;
  type?: 'Business Test' | 'Business Diagnostic' | string;
  submittedAt: string;
  name: string;
  company?: string;
  business?: string;
  designation?: string;
  industry?: string;
  phone: string;
  email?: string;
  size?: string;
  challengeSelect?: string;
  challengeNote?: string;
  score: number;
  category: string;
  answers?: (number | null)[];
  originalTestName?: string;
  originalBusiness?: string;
  stage?: string;
}

const STORAGE_KEY = 'wegrow_bdt_submissions';

const QUESTIONS_TEXT = [
  "1. Can your business operate smoothly if you take a 2-week holiday with zero calls?",
  "2. Do you have written SOPs that employees actually follow?",
  "3. Does customer acquisition happen without your direct personal involvement?",
  "4. Can your team resolve major client issues without escalating to you?",
  "5. Do key leaders make operational decisions without waiting for your approval?",
  "6. Are financial reports and cash-flow forecasts generated automatically without you chasing?",
  "7. If your top performer leaves tomorrow, will operations continue without disruption?",
  "8. Do you spend more than 60% of your working hours on strategic growth rather than firefighting?"
];

export default function AdminBusinessDependencyTest() {
  const [submissions, setSubmissions] = useState<BDTSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'Business Test' | 'Business Diagnostic'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'score_high' | 'score_low'>('newest');

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modal detail view
  const [viewingItem, setViewingItem] = useState<BDTSubmission | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Helper to normalize any record structure
  const normalizeItem = (item: any, idx: number): BDTSubmission => {
    let type = item.type;
    if (!type) {
      if (item.challengeSelect || item.email || item.designation || item.stage === 'Diagnostic Booked') {
        type = 'Business Diagnostic';
      } else {
        type = 'Business Test';
      }
    }
    return {
      id: item._id || item.id || `bdt_${Date.now()}_${idx}`,
      type,
      submittedAt: item.submittedAt || item.createdAt || new Date().toISOString(),
      name: item.name || item.fullName || 'Anonymous',
      company: item.company || item.business || '-',
      business: item.business || item.company || '-',
      designation: item.designation || '-',
      industry: item.industry || '-',
      phone: item.phone || '-',
      email: item.email || '-',
      size: item.size || '-',
      challengeSelect: item.challengeSelect || '-',
      challengeNote: item.challengeNote || '',
      score: typeof item.score === 'number' ? item.score : 0,
      category: item.category || 'Not Calculated',
      answers: item.answers,
      stage: item.stage
    };
  };

  // Load from Backend API (with graceful local fallback)
  const loadData = async () => {
    setLoading(true);
    let loadedFromApi = false;

    try {
      const params: any = {
        page,
        limit,
        type: typeFilter !== 'ALL' ? typeFilter : undefined,
        category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
        sortBy
      };
      if (search.trim()) params.search = search.trim();

      const res = await getBusinessDependencySubmissions(params);

      // Handle array or wrapped object responses
      let listData: any[] | null = null;
      if (Array.isArray(res)) listData = res;
      else if (Array.isArray(res?.data?.items)) listData = res.data.items;
      else if (Array.isArray(res?.data?.submissions)) listData = res.data.submissions;
      else if (Array.isArray(res?.data?.data)) listData = res.data.data;
      else if (Array.isArray(res?.data?.list)) listData = res.data.list;
      else if (Array.isArray(res?.data)) listData = res.data;
      else if (Array.isArray(res?.items)) listData = res.items;

      if (listData && listData.length > 0) {
        const normalized = listData.map((item: any, idx: number) => normalizeItem(item, idx));
        setSubmissions(normalized);
        loadedFromApi = true;
      }
    } catch (err: any) {
      console.warn("Backend API query notice, keeping local store active:", err?.message || err);
    }

    // If API is empty or not yet seeded on remote DB, load/merge with local storage
    if (!loadedFromApi) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        let list: any[] = [];
        if (stored) {
          try { list = JSON.parse(stored); } catch (e) { list = []; }
        }

        // Also scan for individual submission:* keys
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('submission:')) {
            try {
              const item = JSON.parse(localStorage.getItem(key) || '{}');
              if (item && !list.some(x => x.id === item.id || (x.phone === item.phone && x.submittedAt === item.submittedAt))) {
                list.push(item);
              }
            } catch (e) {}
          }
        }

        const normalized: BDTSubmission[] = list.map((item, idx) => normalizeItem(item, idx));
        setSubmissions(normalized);
      } catch (e) {
        console.error("Local storage read error:", e);
      }
    }

    // Also attempt fetching aggregate stats: GET /business-dependency/stats
    try {
      const statsRes = await getBusinessDependencyStats();
      if (statsRes && (statsRes.data || statsRes.stats)) {
        // Stats available
      }
    } catch (e) {
      // optional
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [page, limit, typeFilter, categoryFilter, sortBy]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = submissions.length;
    const testCount = submissions.filter(s => s.type === 'Business Test').length;
    const diagnosticCount = submissions.filter(s => s.type === 'Business Diagnostic').length;
    const avgScore = total > 0 ? Math.round(submissions.reduce((acc, s) => acc + (s.score || 0), 0) / total) : 0;
    return { total, testCount, diagnosticCount, avgScore };
  }, [submissions]);

  // Filtered and sorted data
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(item => {
      // Type filter
      if (typeFilter !== 'ALL' && item.type !== typeFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'ALL') {
        if (categoryFilter === 'red' && item.score > 25) return false;
        if (categoryFilter === 'high' && (item.score <= 25 || item.score > 50)) return false;
        if (categoryFilter === 'growing' && (item.score <= 50 || item.score > 75)) return false;
        if (categoryFilter === 'self' && item.score <= 75) return false;
      }

      // Search term
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCompany = (item.company || '').toLowerCase().includes(q) || (item.business || '').toLowerCase().includes(q);
        const matchPhone = (item.phone || '').toLowerCase().includes(q);
        const matchEmail = (item.email || '').toLowerCase().includes(q);
        const matchChallenge = (item.challengeSelect || '').toLowerCase().includes(q);
        const matchCategory = (item.category || '').toLowerCase().includes(q);
        if (!matchName && !matchCompany && !matchPhone && !matchEmail && !matchChallenge && !matchCategory) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      if (sortBy === 'oldest') return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      if (sortBy === 'score_high') return b.score - a.score;
      if (sortBy === 'score_low') return a.score - b.score;
      return 0;
    });
  }, [submissions, typeFilter, categoryFilter, search, sortBy]);

  // Pagination calculation
  const totalFiltered = filteredSubmissions.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / limit));
  const currentPage = Math.min(page, totalPages);

  const paginatedSubmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * limit;
    return filteredSubmissions.slice(startIndex, startIndex + limit);
  }, [filteredSubmissions, currentPage, limit]);

  // Handlers
  const handleCopy = (text: string | undefined | null, fieldId: string) => {
    if (!text || text === '-') return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast.success(`Copied: ${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) return;

    // Call DELETE /business-dependency/:id
    try {
      if (!id.startsWith('bdt_')) {
        await deleteBusinessDependency(id);
      }
    } catch (err: any) {
      console.warn("Server delete notice (removing locally):", err?.message || err);
    }

    const updated = submissions.filter(s => s.id !== id);
    setSubmissions(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      toast.success("Submission deleted");
    } catch (e) {
      toast.error("Failed to update storage");
    }
  };

  const handleClearAll = () => {
    if (!window.confirm("WARNING: This will permanently delete ALL stored test submissions. Are you sure?")) return;
    setSubmissions([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      // Remove any submission:* keys
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('submission:')) keysToRemove.push(k);
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      toast.success("All submissions cleared");
    } catch (e) {
      toast.error("Failed to clear storage");
    }
  };

  const handleExportCSV = async () => {
    if (filteredSubmissions.length === 0) {
      toast.error("No submissions to export");
      return;
    }

    // 1. Try server export endpoint: GET /business-dependency/export
    try {
      const params: any = {};
      if (typeFilter !== 'ALL') params.type = typeFilter;
      if (categoryFilter !== 'ALL') params.category = categoryFilter;
      if (search.trim()) params.search = search.trim();
      await exportBusinessDependencyCsv(params);
      toast.success("Exported CSV from server");
      return;
    } catch (serverErr) {
      console.warn("Server CSV export notice, generating client CSV:", serverErr);
    }

    const headers = [
      "Type",
      "Date & Time",
      "Name",
      "Company / Business",
      "Designation",
      "Industry",
      "Phone",
      "Email",
      "Business Size",
      "Challenge",
      "Notes",
      "Independence Score",
      "Category"
    ];

    const rows = filteredSubmissions.map(s => [
      `"${s.type || 'Business Test'}"`,
      `"${new Date(s.submittedAt).toLocaleString()}"`,
      `"${(s.name || '').replace(/"/g, '""')}"`,
      `"${(s.company || s.business || '').replace(/"/g, '""')}"`,
      `"${(s.designation || '').replace(/"/g, '""')}"`,
      `"${(s.industry || '').replace(/"/g, '""')}"`,
      `"${(s.phone || '').replace(/"/g, '""')}"`,
      `"${(s.email || '').replace(/"/g, '""')}"`,
      `"${(s.size || '').replace(/"/g, '""')}"`,
      `"${(s.challengeSelect || '').replace(/"/g, '""')}"`,
      `"${(s.challengeNote || '').replace(/"/g, '""')}"`,
      s.score,
      `"${(s.category || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wegrow_bdt_${typeFilter.toLowerCase()}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredSubmissions.length} rows to CSV`);
  };

  const getScoreColor = (score: number) => {
    if (score <= 25) return { bg: '#FBE7E5', text: '#C63B32', border: '#F4B0AA', label: 'Red Zone' };
    if (score <= 50) return { bg: '#FBEADC', text: '#C1541B', border: '#F6CBB4', label: 'High Risk' };
    if (score <= 75) return { bg: '#FBF1DA', text: '#B9820A', border: '#F6DFAC', label: 'Growing' };
    return { bg: '#E7F5EE', text: '#1E8A5F', border: '#A6DFC5', label: 'Self-Running' };
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Admin Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#131C3A] to-[#2F4FD6] text-white flex items-center justify-center shadow-md shadow-blue-900/20">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 tracking-tight">
                  Business Dependency Test
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs">
                  <Sparkles className="w-3 h-3" />
                  Diagnostic Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Monitor independence scores, test attempts, and business diagnostic bookings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              to="/business-dependency-test"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all border border-slate-200 shadow-xs"
            >
              <span>Live Test Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs cursor-pointer"
              title="Refresh Submissions"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#ff6a00]' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            {submissions.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-all cursor-pointer"
                title="Clear all stored test submissions"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            )}
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
                  Total Submissions
                </span>
                <div className="text-xl font-black text-slate-900 leading-tight">
                  {stats.total}
                </div>
                <span className="text-[10px] text-slate-500 font-medium">All captured entries</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            {/* Business Test Submissions */}
            <div 
              onClick={() => { setTypeFilter('Business Test'); setPage(1); }}
              className={`bg-white rounded-xl border p-3.5 px-4 shadow-xs flex items-center justify-between cursor-pointer transition-all ${
                typeFilter === 'Business Test' ? 'border-cyan-500 ring-2 ring-cyan-200 bg-cyan-50/20' : 'border-slate-200 hover:border-cyan-400'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 block mb-0.5">
                  Business Test
                </span>
                <div className="text-xl font-black text-slate-900 leading-tight">
                  {stats.testCount}
                </div>
                <span className="text-[10px] text-cyan-600 font-semibold">Self-assessment completed</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5" />
              </div>
            </div>

            {/* Business Diagnostic Bookings */}
            <div 
              onClick={() => { setTypeFilter('Business Diagnostic'); setPage(1); }}
              className={`bg-white rounded-xl border p-3.5 px-4 shadow-xs flex items-center justify-between cursor-pointer transition-all ${
                typeFilter === 'Business Diagnostic' ? 'border-orange-500 ring-2 ring-orange-200 bg-orange-50/20' : 'border-slate-200 hover:border-orange-400'
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block mb-0.5">
                  Business Diagnostic
                </span>
                <div className="text-xl font-black text-slate-900 leading-tight">
                  {stats.diagnosticCount}
                </div>
                <span className="text-[10px] text-orange-600 font-semibold">1-on-1 consultations</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>

            {/* Avg Score */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 px-4 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Avg Independence Score
                </span>
                <div className="text-xl font-black text-slate-900 flex items-baseline gap-1 leading-tight">
                  {stats.avgScore}
                  <span className="text-[10px] text-slate-400 font-semibold">/ 100</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500">
                  {stats.avgScore <= 25 ? '🔴 The Red Zone' : stats.avgScore <= 50 ? '🟠 High Risk' : stats.avgScore <= 75 ? '🟡 Growing Independence' : '🟢 Self-Running'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* ─── Search & Filters Bar ─────────────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 px-4 shadow-xs shrink-0 space-y-2.5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
              {/* Type Filter Buttons / Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
                <button
                  type="button"
                  onClick={() => { setTypeFilter('ALL'); setPage(1); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    typeFilter === 'ALL'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({stats.total})
                </button>
                <button
                  type="button"
                  onClick={() => { setTypeFilter('Business Test'); setPage(1); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    typeFilter === 'Business Test'
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Business Test</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                    {stats.testCount}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => { setTypeFilter('Business Diagnostic'); setPage(1); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    typeFilter === 'Business Diagnostic'
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Business Diagnostic</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                    {stats.diagnosticCount}
                  </span>
                </button>
              </div>

              {/* Items Per Page Selector */}
              <div className="flex items-center gap-2 self-end lg:self-auto">
                <span className="text-xs text-slate-500 font-semibold">Per page:</span>
                <select
                  value={limit}
                  onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                  className="h-8 px-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:border-[#ff6a00] outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search by Name, Business, Phone, Email, or Challenge..."
                  className="w-full h-9 pl-10 pr-4 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#ff6a00] focus:ring-2 focus:ring-[#ff6a00]/20 outline-none transition-all"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => { setSearch(''); setPage(1); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Dropdown Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <select
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                  className="h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:border-[#ff6a00] outline-none cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  <option value="red">The Red Zone (0–25)</option>
                  <option value="high">High Risk (26–50)</option>
                  <option value="growing">Growing Independence (51–75)</option>
                  <option value="self">Self-Running (76–100)</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value as any); setPage(1); }}
                  className="h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:border-[#ff6a00] outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="score_high">Highest Score</option>
                  <option value="score_low">Lowest Score</option>
                </select>
              </div>
            </div>
          </div>

          {/* ─── Regular Format Data Table ────────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex-1 min-h-0 flex flex-col">
            <div className="table-scrollbar flex-1 min-h-0 overflow-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[960px]">
                <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-2xs">
                  <tr className="bg-slate-50 text-slate-600 font-extrabold text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4 bg-slate-50"># / Type</th>
                    <th className="py-3.5 px-4 bg-slate-50">Date & Time</th>
                    <th className="py-3.5 px-4 bg-slate-50">Participant</th>
                    <th className="py-3.5 px-4 bg-slate-50">Company / Business</th>
                    <th className="py-3.5 px-4 bg-slate-50">Contact</th>
                    <th className="py-3.5 px-4 text-center bg-slate-50">Score & Category</th>
                    <th className="py-3.5 px-4 bg-slate-50">Challenge / Size</th>
                    <th className="py-3.5 px-4 text-right bg-slate-50">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-14 text-center">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                            <ClipboardCheck className="w-6 h-6" />
                          </div>
                          <h3 className="font-bold text-slate-800 text-sm mb-1">No Submissions Found</h3>
                          <p className="text-slate-500 text-xs mb-4">
                            {search || typeFilter !== 'ALL' || categoryFilter !== 'ALL'
                              ? "Try adjusting your filters or search terms."
                              : "Take the Business Dependency Test to see participant records here."}
                          </p>
                          {(search || typeFilter !== 'ALL' || categoryFilter !== 'ALL') && (
                            <button
                              type="button"
                              onClick={() => { setSearch(''); setTypeFilter('ALL'); setCategoryFilter('ALL'); setPage(1); }}
                              className="text-xs font-bold text-[#ff6a00] hover:underline"
                            >
                              Reset all filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedSubmissions.map((item, idx) => {
                      const colorInfo = getScoreColor(item.score);
                      const isDiagnostic = item.type === 'Business Diagnostic';
                      const rowNum = (currentPage - 1) * limit + idx + 1;

                      return (
                        <tr key={item.id || idx} className="hover:bg-slate-50/70 transition-colors">
                          {/* Type Badge */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono text-slate-400">#{rowNum}</span>
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                isDiagnostic
                                  ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                  : 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                              }`}>
                                {isDiagnostic ? <Sparkles className="w-3 h-3 text-orange-600" /> : <ClipboardCheck className="w-3 h-3 text-cyan-600" />}
                                <span>{item.type || 'Business Test'}</span>
                              </span>
                            </div>
                          </td>

                          {/* Date & Time */}
                          <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-semibold text-slate-700">
                                {new Date(item.submittedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block ml-5">
                              {new Date(item.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>

                          {/* Participant Name */}
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 block text-xs">{item.name}</span>
                            {item.designation && item.designation !== '-' && (
                              <span className="text-[10px] text-slate-500 font-medium">{item.designation}</span>
                            )}
                          </td>

                          {/* Company / Business */}
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-800 block text-xs">
                              {item.company || item.business || '-'}
                            </span>
                            {item.industry && item.industry !== '-' && (
                              <span className="text-[10px] text-slate-500 block">{item.industry}</span>
                            )}
                          </td>

                          {/* Contact Info */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              {item.phone && item.phone !== '-' && (
                                <div className="flex items-center gap-1.5">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <a href={`tel:${item.phone}`} className="text-slate-700 font-mono text-[11px] hover:text-[#ff6a00]">
                                    {item.phone}
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(item.phone, `p_${item.id}`)}
                                    className="text-slate-400 hover:text-slate-700"
                                    title="Copy Phone"
                                  >
                                    {copiedField === `p_${item.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                              )}
                              {item.email && item.email !== '-' && (
                                <div className="flex items-center gap-1.5">
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  <a href={`mailto:${item.email}`} className="text-slate-700 text-[11px] truncate max-w-[140px] hover:text-[#ff6a00]" title={item.email}>
                                    {item.email}
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(item.email, `e_${item.id}`)}
                                    className="text-slate-400 hover:text-slate-700"
                                    title="Copy Email"
                                  >
                                    {copiedField === `e_${item.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Score & Category */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex flex-col items-center">
                              <span
                                className="px-2.5 py-0.5 rounded-full font-black text-xs border"
                                style={{ background: colorInfo.bg, color: colorInfo.text, borderColor: colorInfo.border }}
                              >
                                {item.score} / 100
                              </span>
                              <span className="text-[10px] font-semibold text-slate-500 mt-0.5">
                                {item.category}
                              </span>
                            </div>
                          </td>

                          {/* Challenge / Size */}
                          <td className="py-3.5 px-4 max-w-[180px]">
                            {item.challengeSelect && item.challengeSelect !== '-' ? (
                              <span className="font-medium text-slate-800 text-[11px] block truncate" title={item.challengeSelect}>
                                {item.challengeSelect}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">-</span>
                            )}
                            {item.size && item.size !== '-' && (
                              <span className="text-[10px] text-slate-500 block">
                                Size: {item.size}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setViewingItem(item)}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs"
                                title="View Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-800 transition-colors shadow-2xs"
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

            {/* ─── Pagination with Count ────────────────────────────────────────── */}
            <div className="p-2.5 px-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 shrink-0">
              <div>
                {totalFiltered > 0 ? (
                  <span>
                    Showing <strong>{(currentPage - 1) * limit + 1}</strong> to{' '}
                    <strong>{Math.min(currentPage * limit, totalFiltered)}</strong> of{' '}
                    <strong>{totalFiltered}</strong> submissions (Page <strong>{currentPage}</strong> of{' '}
                    <strong>{totalPages}</strong>)
                  </span>
                ) : (
                  <span>0 submissions found</span>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPage(1)}
                    disabled={currentPage <= 1}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    First
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage <= 1}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(pNum => pNum === 1 || pNum === totalPages || Math.abs(pNum - currentPage) <= 1)
                      .map((pNum, index, arr) => {
                        const showEllipsis = index > 0 && pNum - arr[index - 1] > 1;
                        return (
                          <React.Fragment key={pNum}>
                            {showEllipsis && <span className="px-1 text-slate-400">...</span>}
                            <button
                              type="button"
                              onClick={() => setPage(pNum)}
                              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                                currentPage === pNum
                                  ? 'bg-[#131C3A] text-white shadow-xs'
                                  : 'border border-slate-200 hover:bg-white text-slate-700'
                              }`}
                            >
                              {pNum}
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage(totalPages)}
                    disabled={currentPage >= totalPages}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Last
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ─── MODAL: VIEW SUBMISSION DETAILS ─────────────────────────────────── */}
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

            {/* Header */}
            <div className="mb-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                  viewingItem.type === 'Business Diagnostic'
                    ? 'bg-orange-100 text-orange-800 border border-orange-200'
                    : 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                }`}>
                  {viewingItem.type === 'Business Diagnostic' ? <Sparkles className="w-3.5 h-3.5" /> : <ClipboardCheck className="w-3.5 h-3.5" />}
                  <span>{viewingItem.type || 'Business Test'}</span>
                </span>
                <span className="text-xs text-slate-400">ID: {viewingItem.id}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">{viewingItem.name}</h3>
              <p className="text-xs text-slate-500">
                Submitted on {new Date(viewingItem.submittedAt).toLocaleString()}
              </p>
            </div>

            {/* Score Highlight */}
            <div className="mb-5 p-4 rounded-2xl border" style={{
              background: getScoreColor(viewingItem.score).bg,
              borderColor: getScoreColor(viewingItem.score).border
            }}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-0.5">
                    Independence Score
                  </span>
                  <div className="text-3xl font-black" style={{ color: getScoreColor(viewingItem.score).text }}>
                    {viewingItem.score} <span className="text-xs font-semibold">/ 100</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: getScoreColor(viewingItem.score).text }}>
                    {viewingItem.category}
                  </span>
                </div>
                <div className="w-14 h-14 rounded-full border-4 flex items-center justify-center font-black text-sm shadow-xs" style={{
                  borderColor: getScoreColor(viewingItem.score).text,
                  color: getScoreColor(viewingItem.score).text,
                  background: '#FFFFFF'
                }}>
                  {viewingItem.score}%
                </div>
              </div>
            </div>

            {/* Contact & Company Details */}
            <div className="space-y-3 text-xs mb-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Company / Business</span>
                  <span className="font-bold text-slate-800 text-sm block">
                    {viewingItem.company || viewingItem.business || '-'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Designation</span>
                  <span className="font-bold text-slate-800 text-sm block">{viewingItem.designation || '-'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Phone Number</span>
                  <div className="flex items-center justify-between">
                    <a href={`tel:${viewingItem.phone}`} className="font-mono font-bold text-slate-800 hover:text-[#ff6a00]">
                      {viewingItem.phone}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy(viewingItem.phone, 'modal_phone')}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      {copiedField === 'modal_phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Email Address</span>
                  <div className="flex items-center justify-between">
                    <a href={`mailto:${viewingItem.email}`} className="font-semibold text-slate-800 truncate hover:text-[#ff6a00]" title={viewingItem.email}>
                      {viewingItem.email || '-'}
                    </a>
                    {viewingItem.email && viewingItem.email !== '-' && (
                      <button
                        type="button"
                        onClick={() => handleCopy(viewingItem.email!, 'modal_email')}
                        className="text-slate-400 hover:text-slate-700 flex-shrink-0 ml-1"
                      >
                        {copiedField === 'modal_email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Industry</span>
                  <span className="font-semibold text-slate-800">{viewingItem.industry || '-'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Business Size</span>
                  <span className="font-semibold text-slate-800">{viewingItem.size || '-'}</span>
                </div>
              </div>

              {viewingItem.challengeSelect && viewingItem.challengeSelect !== '-' && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Biggest Challenge</span>
                  <span className="font-bold text-slate-800 block text-xs">{viewingItem.challengeSelect}</span>
                  {viewingItem.challengeNote && (
                    <p className="mt-1 text-slate-600 text-xs italic bg-white p-2 rounded-lg border border-slate-200">
                      "{viewingItem.challengeNote}"
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Test Answers Breakdown if available */}
            {viewingItem.answers && viewingItem.answers.length > 0 && (
              <div className="mb-5">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">
                  Question Responses
                </h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {QUESTIONS_TEXT.map((q, qIdx) => {
                    const ans = viewingItem.answers ? viewingItem.answers[qIdx] : null;
                    return (
                      <div key={qIdx} className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-2 text-[11px]">
                        <span className="text-slate-600 truncate">{q}</span>
                        <span className="font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800 whitespace-nowrap">
                          {ans !== null && ans !== undefined ? `${ans} / 5` : '-'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  handleDeleteItem(viewingItem.id);
                  setViewingItem(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all border border-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Submission</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
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
