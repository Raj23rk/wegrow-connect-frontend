import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  GraduationCap,
  Search,
  Filter,
  Download,
  Trash2,
  Edit2,
  Eye,
  X,
  CheckCircle2,
  Clock,
  Building,
  BookOpen,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  School
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchStudentFounders,
  fetchStudentFoundersStats,
  exportStudentFoundersCsv,
  updateStudentFounder,
  deleteStudentFounder
} from '../../services/api';

export default function AdminStudentFounders() {
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
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [status, setStatus] = useState('');

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
    collegeName: '',
    yearOfStudy: '1st Year',
    course: '',
    courseStartYear: '',
    courseEndYear: '',
    status: 'registered',
    notes: ''
  });

  // ─── Fetch Stats ─────────────────────────────────────────────────────────────
  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await fetchStudentFoundersStats();
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
      }
    } catch (err) {
      console.error('Failed to load student stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ─── Fetch List ──────────────────────────────────────────────────────────────
  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchStudentFounders({
        page,
        limit,
        search: search.trim(),
        yearOfStudy,
        collegeName: collegeName.trim(),
        status
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

        setData(items);
        setTotalPages(pages || 1);
        setTotalCount(total);
        if (summary) {
          setStats((prev: any) => ({ ...prev, ...summary }));
        }
      }
    } catch (err) {
      console.error('Failed to load student founders:', err);
      toast.error('Failed to load student registrations');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, yearOfStudy, collegeName, status]);

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
    setYearOfStudy('');
    setCollegeName('');
    setStatus('');
    setPage(1);
  };

  // ─── Export CSV ──────────────────────────────────────────────────────────────
  const handleExport = async () => {
    try {
      setIsExporting(true);
      toast.loading('Generating CSV...', { id: 'csv-student-export' });
      await exportStudentFoundersCsv();
      toast.success('CSV downloaded successfully!', { id: 'csv-student-export' });
    } catch (err) {
      toast.error('Failed to export CSV.', { id: 'csv-student-export' });
    } finally {
      setIsExporting(false);
    }
  };

  // ─── View Modal ──────────────────────────────────────────────────────────────
  const handleView = (item: any) => {
    setViewingItem(item);
  };

  // ─── Edit Modal ──────────────────────────────────────────────────────────────
  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setEditForm({
      fullName: item.fullName || '',
      phone: item.phone || '',
      email: item.email || '',
      collegeName: item.collegeName || item.college || '',
      yearOfStudy: item.yearOfStudy || '1st Year',
      course: item.course || '',
      courseStartYear: item.courseStartYear ? String(item.courseStartYear) : '',
      courseEndYear: item.courseEndYear ? String(item.courseEndYear) : '',
      status: item.status || 'registered',
      notes: item.notes || item.note || ''
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setIsUpdating(true);
      const payload: any = {
        fullName: editForm.fullName,
        phone: editForm.phone,
        email: editForm.email,
        collegeName: editForm.collegeName,
        yearOfStudy: editForm.yearOfStudy,
        course: editForm.course,
        status: editForm.status,
        notes: editForm.notes
      };
      if (editForm.courseStartYear) payload.courseStartYear = Number(editForm.courseStartYear);
      if (editForm.courseEndYear) payload.courseEndYear = Number(editForm.courseEndYear);

      const res = await updateStudentFounder(editingItem._id || editingItem.id, payload);
      if (res) {
        toast.success('Record updated successfully!');
        setEditingItem(null);
        loadList();
        loadStats();
      }
    } catch (err) {
      toast.error('Failed to update record.');
    } finally {
      setIsUpdating(false);
    }
  };

  // ─── Delete Record ───────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      await deleteStudentFounder(deletingId);
      toast.success('Registration deleted successfully!');
      setDeletingId(null);
      loadList();
      loadStats();
    } catch (err) {
      toast.error('Failed to delete registration.');
    } finally {
      setIsDeleting(false);
    }
  };

  const statusBadges: Record<string, { label: string; color: string }> = {
    registered: { label: 'Registered', color: 'bg-slate-100 text-slate-800 border-slate-300' },
    contacted: { label: 'Contacted', color: 'bg-sky-100 text-sky-800 border-sky-300' },
    confirmed: { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    attended: { label: 'Attended', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
    cancelled: { label: 'Cancelled', color: 'bg-rose-100 text-rose-800 border-rose-300' }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#F0791E] flex items-center justify-center font-black">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 leading-tight">
                  Student Founders Community
                </h1>
                <p className="text-xs text-slate-500">
                  Manage college student registrations, colleges, batches, and contact status
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
              onClick={() => { loadList(); loadStats(); }}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* ─── Stats Cards ──────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Students</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">
                  {statsLoading ? '…' : stats?.totalFounders ?? stats?.total ?? totalCount}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F0791E] flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Confirmed</p>
                <h3 className="text-2xl font-black text-emerald-600 mt-1 font-mono">
                  {statsLoading ? '…' : stats?.confirmed ?? stats?.counts?.confirmed ?? stats?.byStatus?.confirmed ?? 0}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Colleges</p>
                <h3 className="text-2xl font-black text-blue-600 mt-1 font-mono">
                  {statsLoading ? '…' : stats?.totalColleges ?? stats?.collegesCount ?? stats?.topColleges?.length ?? (totalCount > 0 ? 1 : 0)}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <School className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Attended / Active</p>
                <h3 className="text-2xl font-black text-purple-600 mt-1 font-mono">
                  {statsLoading ? '…' : stats?.attended ?? stats?.attend ?? stats?.byStatus?.attended ?? 0}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* ─── Search & Filters Bar ─────────────────────────────────────────── */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-center">
              <div className="flex-1 min-w-[220px] relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by student name, email, phone, college..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Year of Study Filter */}
              <select
                value={yearOfStudy}
                onChange={(e) => { setYearOfStudy(e.target.value); setPage(1); }}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none font-semibold text-slate-700"
              >
                <option value="">All Years of Study</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year (Final Year)</option>
                <option value="Post Graduate">Post Graduate</option>
                <option value="Recent Graduate">Recent Graduate</option>
              </select>

              {/* College Filter */}
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="Filter by college name..."
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:bg-white font-medium text-slate-700 min-w-[170px]"
              />

              {/* Status Filter */}
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none font-semibold text-slate-700"
              >
                <option value="">All Statuses</option>
                <option value="registered">Registered</option>
                <option value="contacted">Contacted</option>
                <option value="confirmed">Confirmed</option>
                <option value="attended">Attended</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Search
              </button>

              {(search || yearOfStudy || collegeName || status) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                >
                  Reset
                </button>
              )}
            </form>
          </div>

          {/* ─── Table ───────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">College &amp; Course</th>
                    <th className="py-3.5 px-4">Year &amp; Batch</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Registered Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#F0791E]" />
                        Loading student registrations...
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        No student founders found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    data.map((item: any) => {
                      const id = item._id || item.id;
                      const statusInfo = statusBadges[item.status] || { label: item.status || 'Registered', color: 'bg-slate-100 text-slate-700 border-slate-300' };

                      return (
                        <tr key={id} className="hover:bg-slate-50/60 transition">
                          {/* Student Name */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{item.fullName}</div>
                            {item.notes && (
                              <div className="text-[11px] text-slate-400 line-clamp-1 italic max-w-xs" title={item.notes}>
                                "{item.notes}"
                              </div>
                            )}
                          </td>

                          {/* Contact */}
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-semibold text-slate-800 flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <a href={`tel:${item.phone}`} className="hover:text-[#F0791E]">{item.phone}</a>
                            </div>
                            {item.email && (
                              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                <a href={`mailto:${item.email}`} className="hover:underline">{item.email}</a>
                              </div>
                            )}
                          </td>

                          {/* College & Course */}
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">{item.collegeName || item.college || '—'}</div>
                            <div className="text-[11px] text-slate-500">{item.course || '—'}</div>
                          </td>

                          {/* Year & Batch */}
                          <td className="py-3.5 px-4">
                            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              {item.yearOfStudy || '—'}
                            </span>
                            {(item.courseStartYear || item.courseEndYear) && (
                              <div className="text-[11px] font-mono text-slate-500 mt-1">
                                {item.courseStartYear || '?'} – {item.courseEndYear || '?'}
                              </div>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => handleView(item)}
                                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleOpenEdit(item)}
                                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                                title="Edit / Update Status"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeletingId(id)}
                                className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
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

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-600">
              <div>
                Showing {data.length} of {totalCount} total students
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
                  Page {page} of {totalPages}
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

        {/* ─── View Modal ────────────────────────────────────────────────────── */}
        {viewingItem && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-lg text-slate-900">Student Founder Details</h3>
                <button onClick={() => setViewingItem(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block">Student Full Name</span>
                  <span className="text-base font-extrabold text-slate-900">{viewingItem.fullName}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Phone / WhatsApp</span>
                    <span className="font-mono font-bold text-slate-800">{viewingItem.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Email</span>
                    <span className="font-medium text-slate-800">{viewingItem.email || '—'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">College Name</span>
                    <span className="font-semibold text-slate-800">{viewingItem.collegeName || viewingItem.college || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Course / Degree</span>
                    <span className="font-semibold text-slate-800">{viewingItem.course || '—'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Year of Study</span>
                    <span className="font-semibold text-slate-800">{viewingItem.yearOfStudy || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Batch Period</span>
                    <span className="font-mono font-bold text-slate-800">
                      {viewingItem.courseStartYear || '—'} to {viewingItem.courseEndYear || '—'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Status</span>
                    <span className="font-bold text-[#F0791E] capitalize">{viewingItem.status || 'Registered'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Industry Niche</span>
                    <span className="font-semibold text-slate-800">{viewingItem.industryNiche || '—'}</span>
                  </div>
                </div>

                {/* Entrepreneurial Survey Responses */}
                {(viewingItem.readiness || viewingItem.hasIdea || viewingItem.seriousness || viewingItem.lookingForFunding || viewingItem.readyToLearn) && (
                  <div className="p-3.5 bg-orange-50/60 rounded-2xl border border-orange-100 space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#F0791E] block mb-1">
                      Entrepreneurial Survey Responses
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 font-medium block">Ready to Begin:</span>
                        <span className="font-bold text-slate-800">{viewingItem.readiness || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium block">Business Idea:</span>
                        <span className="font-bold text-slate-800">{viewingItem.hasIdea || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium block">Timeline / Seriousness:</span>
                        <span className="font-bold text-slate-800">{viewingItem.seriousness || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium block">Looking for Funding:</span>
                        <span className="font-bold text-slate-800">{viewingItem.lookingForFunding || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium block">Ready to Learn:</span>
                        <span className="font-bold text-slate-800">{viewingItem.readyToLearn || '—'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {viewingItem.notes && (
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider block">Admin Notes</span>
                    <p className="mt-1 p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed border border-slate-200">
                      {viewingItem.notes}
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block">Registered On</span>
                  <span className="text-slate-600 font-mono">
                    {viewingItem.createdAt ? new Date(viewingItem.createdAt).toLocaleString('en-IN') : '—'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setViewingItem(null)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Edit Modal ────────────────────────────────────────────────────── */}
        {editingItem && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-lg text-slate-900">Update Student Record</h3>
                <button onClick={() => setEditingItem(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.fullName}
                    onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      value={editForm.phone}
                      onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={editForm.email}
                      onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">College Name</label>
                    <input
                      type="text"
                      value={editForm.collegeName}
                      onChange={(e) => setEditForm((f) => ({ ...f, collegeName: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">Course / Degree</label>
                    <input
                      type="text"
                      value={editForm.course}
                      onChange={(e) => setEditForm((f) => ({ ...f, course: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">Year of Study</label>
                    <select
                      value={editForm.yearOfStudy}
                      onChange={(e) => setEditForm((f) => ({ ...f, yearOfStudy: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Post Graduate">Post Graduate</option>
                      <option value="Recent Graduate">Recent Graduate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">Start Year</label>
                    <input
                      type="number"
                      value={editForm.courseStartYear}
                      onChange={(e) => setEditForm((f) => ({ ...f, courseStartYear: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">End Year</label>
                    <input
                      type="number"
                      value={editForm.courseEndYear}
                      onChange={(e) => setEditForm((f) => ({ ...f, courseEndYear: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-[#F0791E]"
                  >
                    <option value="registered">Registered</option>
                    <option value="contacted">Contacted</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="attended">Attended</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold uppercase tracking-wider mb-1">Notes / Admin Comments</label>
                  <textarea
                    rows={3}
                    value={editForm.notes}
                    onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Add follow-up notes, startup idea details, or comments..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-2 bg-[#F0791E] hover:bg-[#D9600B] text-white rounded-xl font-bold shadow-md transition disabled:opacity-50"
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
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-slate-900">Delete Registration?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove this student founder? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
