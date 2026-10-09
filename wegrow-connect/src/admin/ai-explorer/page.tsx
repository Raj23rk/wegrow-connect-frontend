import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  GraduationCap,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Mail,
  RefreshCw,
  X,
  Copy,
  Check,
  Layers,
  BookOpen,
  Trash2,
  Printer,
  Send,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import { aiExplorerApi } from '../../services/aiExplorerApi';

const rupee = (n: number | string) => {
  const num = Number(n || 0);
  return '₹' + num.toLocaleString('en-IN');
};

export default function AdminAiExplorerPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [standardFilter, setStandardFilter] = useState('ALL');
  const [planFilter, setPlanFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Modal State
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [modalQrUrl, setModalQrUrl] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // Helpers for status classification
  const isPaidStatus = (s?: string) =>
    ['PAID', 'COMPLETED', 'ENROLLED', 'SUCCESS'].includes((s || '').toUpperCase());

  // Load Data with pagination support
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const enrollRes = await aiExplorerApi.getEnrollments({
        page,
        limit,
        search: search.trim() || undefined,
        standard: standardFilter,
        plan: planFilter,
        paymentStatus: statusFilter,
      });

      let list: any[] = [];
      if (Array.isArray(enrollRes?.data?.data)) {
        list = enrollRes.data.data;
      } else if (Array.isArray(enrollRes?.data)) {
        list = enrollRes.data;
      } else if (Array.isArray(enrollRes?.enrollments)) {
        list = enrollRes.enrollments;
      } else if (Array.isArray(enrollRes)) {
        list = enrollRes;
      }

      setEnrollments(list);

      const serverTotal =
        enrollRes?.total ??
        enrollRes?.meta?.total ??
        enrollRes?.data?.total ??
        enrollRes?.data?.meta?.total ??
        list.length;

      setTotalCount(serverTotal);

      // Compute stats
      const paidCount = list.filter((e) => isPaidStatus(e.paymentStatus) || isPaidStatus(e.status)).length;
      const totalFee = list
        .filter((e) => isPaidStatus(e.paymentStatus) || isPaidStatus(e.status))
        .reduce((sum, e) => sum + Number(e.amount || 0), 0);
      const pendingCount = list.filter(
        (e) => !isPaidStatus(e.paymentStatus) && !isPaidStatus(e.status)
      ).length;

      setStats({
        totalEnrollments: serverTotal,
        paidEnrollments: paidCount,
        totalRevenue: totalFee,
        pendingEnrollments: pendingCount,
      });
    } catch (err: any) {
      console.error('Failed to load AI Explorer enrollments:', err);
      toast.error('Failed to load AI Explorer enrollments.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, standardFilter, planFilter, statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Generate QR when viewing student modal
  useEffect(() => {
    if (selectedStudent) {
      QRCode.toDataURL(
        JSON.stringify({
          id: selectedStudent.id,
          student: selectedStudent.studentName,
          standard: selectedStudent.standard,
          school: selectedStudent.school,
          parentPhone: selectedStudent.fatherPhone,
          plan: selectedStudent.planName,
          status: selectedStudent.paymentStatus,
          verifiedBy: 'WeGrow Skill Campus & B-School',
        }),
        { width: 280, margin: 2 }
      )
        .then((url) => setModalQrUrl(url))
        .catch((e) => console.error(e));
    }
  }, [selectedStudent]);

  // Export CSV
  const handleExportCsv = async () => {
    try {
      toast.loading('Exporting enrollments CSV...', { id: 'csv' });
      const csv = await aiExplorerApi.exportCsv();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ai_explorer_students_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('CSV downloaded successfully!', { id: 'csv' });
    } catch {
      toast.error('Failed to export CSV.', { id: 'csv' });
    }
  };

  // Update Status
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await aiExplorerApi.updateStatus(id, newStatus);
      if (res?.success) {
        toast.success(`Status updated to ${newStatus}`);
        loadData();
        if (selectedStudent && selectedStudent.id === id) {
          setSelectedStudent({ ...selectedStudent, paymentStatus: newStatus });
        }
      }
    } catch {
      toast.error('Failed to update status.');
    }
  };

  // Delete Record
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this enrollment record?')) return;
    try {
      const res = await aiExplorerApi.deleteEnrollment(id);
      if (res?.success) {
        toast.success('Enrollment deleted.');
        if (selectedStudent?.id === id) setSelectedStudent(null);
        loadData();
      }
    } catch {
      toast.error('Failed to delete enrollment.');
    }
  };

  // Resend Confirmation Email
  const handleResendEmail = async (id: string, email?: string) => {
    try {
      toast.loading('Sending confirmation email...', { id: 'email' });
      const res = await aiExplorerApi.resendEmail(id, email);
      if (res?.success !== false) {
        toast.success('Confirmation email sent successfully!', { id: 'email' });
      } else {
        toast.error(res?.message || 'Could not send email.', { id: 'email' });
      }
    } catch {
      toast.error('Failed to send email.', { id: 'email' });
    }
  };

  const copyText = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedId(true);
    toast.success('Copied!');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const validPage = Math.min(Math.max(1, page), totalPages);

  // If backend returns all records at once, slice locally for smooth UI pagination
  const displayedEnrollments =
    safeEnrollments.length > limit && totalCount === safeEnrollments.length
      ? safeEnrollments.slice((validPage - 1) * limit, validPage * limit)
      : safeEnrollments;

  const startItem = totalCount === 0 ? 0 : (validPage - 1) * limit + 1;
  const endItem = Math.min(validPage * limit, totalCount);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (validPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (validPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', validPage - 1, validPage, validPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex h-screen bg-[#F0F4F8] text-[#1E293B] font-sans overflow-hidden select-none">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-600 mb-0.5">
              <GraduationCap className="w-4 h-4" />
              <span>WeGrow School Campus • AI Explorer</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Student Enrollment Hub</span>
              <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                Grades 5 – 12
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-300 shadow-2xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => loadData()}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-300 shadow-2xs transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-purple-600 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-6 space-y-6 max-w-7xl">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Enrollments */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Enrollments
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-heading">
                  {stats?.totalEnrollments ?? totalCount}
                </div>
                <div className="text-[11px] text-purple-600 font-bold mt-0.5">Students registered</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
                🧑‍🚀
              </div>
            </div>

            {/* Paid Enrollments */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Confirmed (Paid)
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 font-heading">
                  {stats?.paidEnrollments ??
                    safeEnrollments.filter((e) => isPaidStatus(e.paymentStatus) || isPaidStatus(e.status)).length}
                </div>
                <div className="text-[11px] text-emerald-600 font-bold mt-0.5">Seats confirmed</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                ✓
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Fee Collected
                </div>
                <div className="text-2xl sm:text-3xl font-black text-blue-700 mt-1 font-heading">
                  {rupee(
                    stats?.totalRevenue ??
                      safeEnrollments
                        .filter((e) => isPaidStatus(e.paymentStatus) || isPaidStatus(e.status))
                        .reduce((s, e) => s + Number(e.amount || 0), 0)
                  )}
                </div>
                <div className="text-[11px] text-blue-600 font-bold mt-0.5">Processed revenue</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                💎
              </div>
            </div>

            {/* Pending Fee */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Pending Status
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 font-heading">
                  {stats?.pendingEnrollments ??
                    safeEnrollments.filter(
                      (e) => !isPaidStatus(e.paymentStatus) && !isPaidStatus(e.status)
                    ).length}
                </div>
                <div className="text-[11px] text-amber-600 font-bold mt-0.5">Verification pending</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
                ⏳
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search student, phone, email, school, enrollment ID..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold focus:bg-white focus:border-purple-600 outline-none"
              />
            </div>

            {/* Standard Filter */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <BookOpen className="w-4 h-4 text-purple-600 shrink-0" />
              <select
                value={standardFilter}
                onChange={(e) => {
                  setStandardFilter(e.target.value);
                  setPage(1);
                }}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs outline-none cursor-pointer"
              >
                <option value="ALL">All Standards</option>
                <option value="5th Standard">5th Standard</option>
                <option value="6th Standard">6th Standard</option>
                <option value="7th Standard">7th Standard</option>
                <option value="8th Standard">8th Standard</option>
                <option value="9th Standard">9th Standard</option>
                <option value="10th Standard">10th Standard</option>
                <option value="11th Standard">11th Standard</option>
                <option value="12th Standard">12th Standard</option>
              </select>
            </div>

            {/* Plan Filter */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
              <select
                value={planFilter}
                onChange={(e) => {
                  setPlanFilter(e.target.value);
                  setPage(1);
                }}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs outline-none cursor-pointer"
              >
                <option value="ALL">All Fee Plans</option>
                <option value="full">Full Payment (₹43k)</option>
                <option value="half">Half-Yearly (₹22.5k)</option>
                <option value="term">Term Wise (₹45k)</option>
              </select>
            </div>

            {/* Payment Status Filter */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <Filter className="w-4 h-4 text-emerald-600 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-xs outline-none cursor-pointer"
              >
                <option value="ALL">All Payment Status</option>
                <option value="PAID">PAID</option>
                <option value="PENDING">PENDING</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-black tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Enrollment ID</th>
                    <th className="py-3.5 px-4">Student Name</th>
                    <th className="py-3.5 px-4">Standard &amp; School</th>
                    <th className="py-3.5 px-4">Parent Contacts</th>
                    <th className="py-3.5 px-4">Fee Plan &amp; Amount</th>
                    <th className="py-3.5 px-4">Payment Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold text-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 font-bold">
                        <div className="inline-block w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mb-2" />
                        <div>Loading AI Explorer registrations...</div>
                      </td>
                    </tr>
                  ) : displayedEnrollments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 font-bold">
                        No student enrollments found matching the criteria.
                      </td>
                    </tr>
                  ) : (
                    displayedEnrollments.map((student) => {
                      const isPaid = isPaidStatus(student.paymentStatus) || isPaidStatus(student.status);
                      const displayId = student.enrollmentId || student.id || student._id;
                      const displayMail = student.email || student.mailId || '—';
                      return (
                        <tr key={displayId} className="hover:bg-purple-50/40 transition-colors">
                          {/* ID */}
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-black text-purple-900">{displayId}</div>
                            <div className="text-[10px] text-slate-400 font-normal">
                              {student.createdAt
                                ? new Date(student.createdAt).toLocaleDateString('en-IN')
                                : 'Recent'}
                            </div>
                          </td>

                          {/* Student Name */}
                          <td className="py-3.5 px-4">
                            <div className="font-black text-slate-900 text-sm">{student.studentName}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{displayMail}</span>
                            </div>
                          </td>

                          {/* Standard & School */}
                          <td className="py-3.5 px-4">
                            <span className="inline-block bg-purple-100 text-purple-800 font-black text-[10px] px-2 py-0.5 rounded-md mb-0.5">
                              {student.standard}
                            </span>
                            <div className="text-slate-600 text-[11px] max-w-[200px] truncate">
                              {student.school}
                            </div>
                          </td>

                          {/* Parent Contacts */}
                          <td className="py-3.5 px-4">
                            <div className="text-[11px] font-bold text-slate-800">
                              👨 {student.fatherName}:{' '}
                              <span className="text-blue-700">{student.fatherPhone}</span>
                            </div>
                            <div className="text-[11px] font-bold text-slate-600 mt-0.5">
                              👩 {student.motherName}:{' '}
                              <span className="text-pink-700">{student.motherPhone}</span>
                            </div>
                          </td>

                          {/* Fee Plan */}
                          <td className="py-3.5 px-4">
                            <div className="font-black text-slate-900">{rupee(student.amount)}</div>
                            <div className="text-[10px] text-slate-500">{student.planName || student.plan || student.feePlan}</div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                isPaid
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {isPaid ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <Clock className="w-3 h-3" />
                              )}
                              <span>{student.paymentStatus || student.status || 'PENDING'}</span>
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedStudent(student)}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-purple-100 text-purple-700 transition-all cursor-pointer"
                                title="View Pass & Student Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    student.id || student._id,
                                    isPaid ? 'PENDING' : 'PAID'
                                  )
                                }
                                className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-100 text-emerald-700 transition-all cursor-pointer"
                                title="Toggle Payment Status"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleResendEmail(student.id || student._id, student.email || student.mailId)}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-blue-100 text-blue-700 transition-all cursor-pointer"
                                title="Resend Confirmation Email"
                              >
                                <Send className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDelete(student.id || student._id)}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-pink-100 text-pink-700 transition-all cursor-pointer"
                                title="Delete Enrollment"
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

            {/* Pagination Controls Footer */}
            <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-600">
              {/* Range & Limit Selector */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-slate-500">
                  Showing <span className="text-slate-900 font-extrabold">{startItem}</span> to{' '}
                  <span className="text-slate-900 font-extrabold">{endItem}</span> of{' '}
                  <span className="text-purple-900 font-black">{totalCount}</span> registrations
                </div>

                <div className="flex items-center gap-1.5 border-l border-slate-300 pl-3">
                  <span className="text-slate-500 text-[11px]">Rows per page:</span>
                  <select
                    value={limit}
                    onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                    }}
                    className="h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none cursor-pointer focus:border-purple-500"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-1.5">
                {/* First Page */}
                <button
                  type="button"
                  disabled={validPage <= 1 || loading}
                  onClick={() => setPage(1)}
                  className="p-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:hover:bg-white cursor-pointer transition-all shadow-2xs"
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Previous Page */}
                <button
                  type="button"
                  disabled={validPage <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:hover:bg-white cursor-pointer transition-all shadow-2xs"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1 mx-1">
                  {getPageNumbers().map((pNum, idx) => {
                    if (pNum === '...') {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-1.5 text-slate-400 font-mono">
                          ...
                        </span>
                      );
                    }
                    const isCurrent = pNum === validPage;
                    return (
                      <button
                        type="button"
                        key={`page-${pNum}`}
                        disabled={loading}
                        onClick={() => setPage(Number(pNum))}
                        className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Page */}
                <button
                  type="button"
                  disabled={validPage >= totalPages || loading}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:hover:bg-white cursor-pointer transition-all shadow-2xs"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Last Page */}
                <button
                  type="button"
                  disabled={validPage >= totalPages || loading}
                  onClick={() => setPage(totalPages)}
                  className="p-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:hover:bg-white cursor-pointer transition-all shadow-2xs"
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* STUDENT DETAIL & PASS MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200 my-8 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-center pb-4 border-b border-slate-200">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black uppercase mb-1">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>AI Explorer Enrollment Pass</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 font-heading">
                {selectedStudent.studentName}
              </h2>
              <div className="text-xs font-bold text-slate-500">
                {selectedStudent.standard} • {selectedStudent.school}
              </div>
              {(Array.isArray(selectedStudent.students) && selectedStudent.students.length > 1) && (
                <div className="mt-1.5 inline-flex items-center gap-1 bg-purple-50 text-purple-800 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-purple-200">
                  <Users className="w-3 h-3 text-purple-600" />
                  <span>{selectedStudent.students.length} Children Enrolled</span>
                </div>
              )}
            </div>

            {/* QR Code */}
            {modalQrUrl && (
              <div className="flex flex-col items-center justify-center p-3 bg-purple-50/50 rounded-2xl border-2 border-dashed border-purple-200 my-4">
                <img src={modalQrUrl} alt="QR" className="w-36 h-36 object-contain" />
                <div className="text-[10px] font-mono font-black text-purple-900 mt-1 flex items-center gap-1">
                  <span>{selectedStudent.id}</span>
                  <button
                    onClick={() => copyText(selectedStudent.id)}
                    className="p-1 hover:bg-white rounded transition-all cursor-pointer"
                  >
                    {copiedId ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Individual Enrolled Students Roster */}
            {Array.isArray(selectedStudent.students) && selectedStudent.students.length > 0 && (
              <div className="space-y-2 mb-4">
                <div className="text-[11px] font-black uppercase tracking-wider text-[#0f1f5c] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-600" />
                    <span>Enrolled Children Details ({selectedStudent.students.length})</span>
                  </span>
                  <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                    Student Roster
                  </span>
                </div>
                <div className="space-y-1.5">
                  {selectedStudent.students.map((child: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-gradient-to-r from-purple-50/80 to-indigo-50/50 border border-purple-200 flex items-center justify-between gap-3 text-xs shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-2xs">
                          #{idx + 1}
                        </span>
                        <div className="truncate">
                          <div className="font-black text-slate-900 truncate text-xs sm:text-sm">
                            {child.name || child.studentName || `Child #${idx + 1}`}
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate mt-0.5">
                            🏫 {child.school || selectedStudent.school || '—'}
                          </div>
                        </div>
                      </div>
                      <span className="shrink-0 bg-white text-purple-900 font-black text-[10px] px-2.5 py-1 rounded-lg border border-purple-200 shadow-2xs">
                        {child.standard || selectedStudent.standard || 'Grade'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details Table */}
            <div className="space-y-2.5 text-xs font-semibold text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Email ID:</span>
                <span className="font-bold text-slate-900">{selectedStudent.mailId || '—'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Father's Info:</span>
                <span className="font-bold text-slate-900">
                  {selectedStudent.fatherName} ({selectedStudent.fatherPhone})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Mother's Info:</span>
                <span className="font-bold text-slate-900">
                  {selectedStudent.motherName} ({selectedStudent.motherPhone})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Residential Address:</span>
                <span className="font-bold text-slate-900 text-right max-w-[220px]">
                  {selectedStudent.address || selectedStudent.residentialAddress || selectedStudent.parentAddress || selectedStudent.city || '—'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Fee Plan:</span>
                <span className="font-black text-blue-700">
                  {selectedStudent.planName}
                </span>
              </div>
              {(selectedStudent.totalFee && selectedStudent.totalFee !== selectedStudent.amount) && (
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Total Course Fee:</span>
                  <span className="font-bold text-slate-800">
                    {rupee(selectedStudent.totalFee)}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Amount:</span>
                <span className="font-black text-purple-700">
                  {rupee(selectedStudent.amount)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-slate-800">
                  {selectedStudent.orderId || selectedStudent.cfOrderId || selectedStudent.transactionId || selectedStudent.id}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Payment Status:</span>
                <span
                  className={`font-black px-2 py-0.5 rounded-md text-[10px] ${
                    isPaidStatus(selectedStudent.paymentStatus) || isPaidStatus(selectedStudent.status)
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedStudent.paymentStatus || selectedStudent.status || 'PENDING'} ({selectedStudent.paymentMethod || 'Online'})
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-4 border-t border-slate-200 mt-4">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Pass</span>
              </button>

              <button
                onClick={() => handleResendEmail(selectedStudent.id || selectedStudent._id, selectedStudent.email || selectedStudent.mailId)}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Resend Email</span>
              </button>

              <button
                onClick={() =>
                  handleStatusChange(
                    selectedStudent.id || selectedStudent._id,
                    isPaidStatus(selectedStudent.paymentStatus) || isPaidStatus(selectedStudent.status)
                      ? 'PENDING'
                      : 'PAID'
                  )
                }
                className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  Mark as{' '}
                  {isPaidStatus(selectedStudent.paymentStatus) || isPaidStatus(selectedStudent.status)
                    ? 'PENDING'
                    : 'PAID'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
