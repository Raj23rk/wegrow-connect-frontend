import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  Sparkles,
  Gift,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle2,
  Clock,
  Ticket,
  Copy,
  ExternalLink,
  Eye,
  Printer,
  X,
  ChevronLeft,
  ChevronRight,
  Award,
  AlertCircle,
  Calendar,
  Mail,
  Phone,
  Building2,
  Tag,
  Dices,
  TrendingUp,
  MapPin,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import { spinWheelApi, REWARD_POOL } from '../../services/spinWinApi';

export default function AdminSpinWheelPage() {
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Filters
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [spinFilter, setSpinFilter] = useState('');
  const [redeemedFilter, setRedeemedFilter] = useState('');

  // Overview Stats
  const [stats, setStats] = useState({
    totalRegistered: 0,
    totalVerified: 0,
    totalSpun: 0,
    totalRedeemed: 0,
    spinRatePercentage: 0,
    redemptionRatePercentage: 0,
  });

  // Modal State
  const [selectedParticipant, setSelectedParticipant] = useState<any | null>(null);
  const [modalQrUrl, setModalQrUrl] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Quick Campus Desk Redemption State
  const [quickCode, setQuickCode] = useState('');
  const [quickStaffNote, setQuickStaffNote] = useState('');
  const [quickRedeeming, setQuickRedeeming] = useState(false);

  // Wheel Budget Breakdown Toggle
  const [showRewardsModal, setShowRewardsModal] = useState(false);

  // Load Data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [partRes, statsRes] = await Promise.allSettled([
        spinWheelApi.getAdminParticipants({
          search: search.trim() || undefined,
          course: courseFilter || undefined,
          hasSpun: spinFilter !== '' ? spinFilter : undefined,
          isRedeemed: redeemedFilter !== '' ? redeemedFilter : undefined,
          page,
          limit,
        }),
        spinWheelApi.getAdminStats(),
      ]);

      if (partRes.status === 'fulfilled' && partRes.value?.success) {
        const d = partRes.value.data;
        setParticipants(d?.participants || []);
        setTotalCount(d?.total || 0);
        setTotalPages(d?.totalPages || Math.ceil((d?.total || 0) / limit) || 1);

        if (d?.summary) {
          setStats((prev) => ({
            ...prev,
            totalRegistered: d.summary.totalRegistered || prev.totalRegistered,
            totalVerified: d.summary.totalVerified || prev.totalVerified,
            totalSpun: d.summary.totalSpun || prev.totalSpun,
            totalRedeemed: d.summary.totalRedeemed || prev.totalRedeemed,
          }));
        }
      }

      if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
        const s = statsRes.value.data;
        const ov = s?.overview || s;
        setStats({
          totalRegistered: ov?.totalRegistered ?? 0,
          totalVerified: ov?.totalVerified ?? 0,
          totalSpun: ov?.totalSpun ?? 0,
          totalRedeemed: ov?.totalRedeemed ?? 0,
          spinRatePercentage:
            ov?.spinRatePercentage ??
            (ov?.totalRegistered > 0
              ? Math.round((ov.totalSpun / ov.totalRegistered) * 100)
              : 0),
          redemptionRatePercentage:
            ov?.redemptionRatePercentage ??
            (ov?.totalSpun > 0
              ? Math.round((ov.totalRedeemed / ov.totalSpun) * 100)
              : 0),
        });
      }
    } catch (err) {
      console.error('Failed to load spin wheel data:', err);
      toast.error('Failed to load spin wheel data.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, courseFilter, spinFilter, redeemedFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Generate QR for selected student voucher pass
  useEffect(() => {
    if (selectedParticipant) {
      const code = selectedParticipant.voucherCode || 'WGW-SPIN-REWARD';
      const payload = JSON.stringify({
        code,
        name: selectedParticipant.fullName || selectedParticipant.name,
        reward: selectedParticipant.rewardTitle || selectedParticipant.wonReward?.title,
        badge: selectedParticipant.rewardBadge || selectedParticipant.wonReward?.badge,
        campus: 'WeGrow Skill Campus & B-School',
        redeemed: selectedParticipant.isRedeemed ? 'YES' : 'NO',
      });

      QRCode.toDataURL(payload, { width: 260, margin: 2 })
        .then((url) => setModalQrUrl(url))
        .catch((e) => console.error(e));
    }
  }, [selectedParticipant]);

  // Copy to clipboard helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    toast.success('Voucher code copied!');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Quick Campus Desk Redemption
  const handleQuickRedeem = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = quickCode.trim().toUpperCase();
    if (!clean) {
      toast.error('Please enter a voucher code');
      return;
    }

    setQuickRedeeming(true);
    try {
      const res = await spinWheelApi.redeemVoucher(clean, quickStaffNote.trim());
      if (res?.success) {
        toast.success(res.message || `Voucher ${clean} redeemed successfully!`);
        setQuickCode('');
        setQuickStaffNote('');
        loadData();
      } else {
        toast.error(res?.message || 'Could not redeem voucher.');
      }
    } catch {
      toast.error('Failed to redeem voucher.');
    } finally {
      setQuickRedeeming(false);
    }
  };

  // One-click Table Row Redeem
  const handleRowRedeem = async (code: string) => {
    if (!window.confirm(`Mark voucher ${code} as REDEEMED at WeGrow campus desk?`)) return;
    try {
      const res = await spinWheelApi.redeemVoucher(code, 'Campus front-desk quick verification');
      if (res?.success) {
        toast.success(`Voucher ${code} marked as REDEEMED!`);
        loadData();
        if (selectedParticipant && selectedParticipant.voucherCode === code) {
          setSelectedParticipant({ ...selectedParticipant, isRedeemed: true, redeemedAt: new Date().toISOString() });
        }
      } else {
        toast.error(res?.message || 'Could not redeem voucher.');
      }
    } catch {
      toast.error('Failed to redeem voucher.');
    }
  };

  // Export CSV
  const handleExportCsv = async () => {
    try {
      toast.loading('Exporting Spin & Win participants...', { id: 'csv' });
      const csv = await spinWheelApi.exportParticipantsCsv();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `spin_wheel_participants_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('CSV downloaded successfully!', { id: 'csv' });
    } catch {
      toast.error('Failed to export CSV.', { id: 'csv' });
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans antialiased overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-orange-500 text-white rounded-xl shadow-md">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Spin & Win Wheel (Skill Edition)
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      Live Admin
                    </span>
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Participant registrations, digital wheel spin history, scholarship vouchers & campus front-desk claim desk
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowRewardsModal(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-all cursor-pointer shadow-xs"
              >
                <Dices className="w-4 h-4" />
                <span>Reward Sectors</span>
              </button>

              <a
                href="/spin-and-win"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer shadow-xs"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Live Wheel</span>
              </a>

              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => loadData()}
                disabled={loading}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#147A87] hover:bg-[#0f626d] text-white transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* KPI Analytics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Total Registrations */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span>Registrations</span>
                <Building2 className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {stats.totalRegistered.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">Students registered</div>
            </div>

            {/* Total Spun */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-purple-600 text-xs font-bold">
                <span>Spins Completed</span>
                <Dices className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-purple-900 tracking-tight">
                {stats.totalSpun.toLocaleString()}
              </div>
              <div className="text-[11px] text-purple-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{stats.spinRatePercentage}% spin conversion</span>
              </div>
            </div>

            {/* Pending Spins */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-amber-600 text-xs font-bold">
                <span>Pending Spins</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-900 tracking-tight">
                {Math.max(0, stats.totalRegistered - stats.totalSpun).toLocaleString()}
              </div>
              <div className="text-[11px] text-amber-600 font-semibold">Registered, yet to spin</div>
            </div>

            {/* Vouchers Redeemed */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-emerald-600 text-xs font-bold">
                <span>Campus Redeemed</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-900 tracking-tight">
                {stats.totalRedeemed.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold">Claimed at front desk</div>
            </div>

            {/* Active Vouchers Available */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1 col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between text-blue-600 text-xs font-bold">
                <span>Active Vouchers</span>
                <Ticket className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-blue-900 tracking-tight">
                {Math.max(0, stats.totalSpun - stats.totalRedeemed).toLocaleString()}
              </div>
              <div className="text-[11px] text-blue-600 font-semibold">Ready for campus claim</div>
            </div>
          </div>

          {/* Campus Desk Quick Voucher Verification Tool */}
          <div className="bg-gradient-to-r from-[#147A87]/10 via-purple-50 to-pink-50 p-5 rounded-2xl border border-teal-200/80 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#147A87] text-white rounded-lg">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">
                    Front-Desk Voucher Claim Station
                  </h3>
                </div>
                <p className="text-xs text-slate-600">
                  Instantly verify and mark a student’s Spin & Win scholarship voucher as redeemed upon campus visit.
                </p>
              </div>

              <form onSubmit={handleQuickRedeem} className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={quickCode}
                    onChange={(e) => setQuickCode(e.target.value)}
                    placeholder="Enter Voucher Code (e.g. WGW-SPIN-46561)"
                    className="w-64 sm:w-72 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold uppercase placeholder:font-sans placeholder:normal-case placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#147A87]"
                  />
                </div>

                <input
                  type="text"
                  value={quickStaffNote}
                  onChange={(e) => setQuickStaffNote(e.target.value)}
                  placeholder="Staff Note (Optional)"
                  className="w-44 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#147A87]"
                />

                <button
                  type="submit"
                  disabled={quickRedeeming || !quickCode.trim()}
                  className="bg-[#147A87] hover:bg-[#0f626d] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{quickRedeeming ? 'Redeeming...' : 'Verify & Redeem'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by student name, email, phone, or voucher..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#147A87] focus:bg-white transition-all"
                />
              </div>

              {/* Course Interested */}
              <div>
                <select
                  value={courseFilter}
                  onChange={(e) => {
                    setCourseFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#147A87] cursor-pointer"
                >
                  <option value="">All Interested Courses</option>
                  <option value="AI Explorer">AI Explorer</option>
                  <option value="B-School PGDM">B-School PGDM</option>
                  <option value="B-School BBA">B-School BBA</option>
                  <option value="Full Stack Development">Full Stack Development</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Campus Immersion">Campus Immersion</option>
                </select>
              </div>

              {/* Spin Status */}
              <div>
                <select
                  value={spinFilter}
                  onChange={(e) => {
                    setSpinFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#147A87] cursor-pointer"
                >
                  <option value="">All Spin Statuses</option>
                  <option value="true">Spun (Reward Won)</option>
                  <option value="false">Pending Spin</option>
                </select>
              </div>

              {/* Redemption Status */}
              <div>
                <select
                  value={redeemedFilter}
                  onChange={(e) => {
                    setRedeemedFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#147A87] cursor-pointer"
                >
                  <option value="">All Voucher Claims</option>
                  <option value="true">Redeemed at Campus</option>
                  <option value="false">Active / Unclaimed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Participants Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                    <th className="py-3 px-4">Student & Contact</th>
                    <th className="py-3 px-4">Parents & City</th>
                    <th className="py-3 px-4">Course & Campus</th>
                    <th className="py-3 px-4">Reward Won</th>
                    <th className="py-3 px-4">Voucher Code</th>
                    <th className="py-3 px-4">Campus Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#147A87]" />
                        <span>Loading live Spin & Win records...</span>
                      </td>
                    </tr>
                  ) : participants.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Dices className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <span>No participant records found matching the filters.</span>
                      </td>
                    </tr>
                  ) : (
                    participants.map((p) => {
                      const studentName = p.fullName || p.name || 'Student';
                      const studentMail = p.email || '—';
                      const studentPhone = p.mobileNo || p.phone || '—';
                      const parentName = p.parentName || p.fatherName || 'Parent';
                      const parentPhone = p.parentPhone || p.fatherMobile || p.motherMobile || '—';
                      const courseName = p.courseInterested || 'General Skills';
                      const voucher = p.voucherCode || 'PENDING';
                      const rewardTitle = p.rewardTitle || p.wonReward?.title || (p.hasSpun ? 'Mystery Reward' : 'Not Spun Yet');
                      const rewardBadge = p.rewardBadge || p.wonReward?.badge || (p.hasSpun ? 'REWARD WON' : 'PENDING');
                      const rewardDesc = p.rewardDescription || p.wonReward?.description || '';

                      return (
                        <tr key={p._id || p.id || voucher} className="hover:bg-purple-50/30 transition-colors">
                          {/* Student & Contact */}
                          <td className="py-3.5 px-4">
                            <div className="font-black text-slate-900 text-sm">{studentName}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{studentMail}</span>
                            </div>
                            <div className="text-[11px] text-blue-700 flex items-center gap-1 font-bold">
                              <Phone className="w-3 h-3 text-blue-500" />
                              <span>{studentPhone}</span>
                            </div>
                          </td>

                          {/* Parents & City */}
                          <td className="py-3.5 px-4">
                            <div className="text-slate-800 font-bold text-[11px]">
                              👨 {parentName}: <span className="text-slate-600 font-normal">{parentPhone}</span>
                            </div>
                            {p.city && (
                              <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-semibold">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{p.city}</span>
                              </div>
                            )}
                            {p.institutionName && (
                              <div className="text-[10px] text-slate-500 truncate max-w-[160px] font-medium">
                                🏫 {p.institutionName}
                              </div>
                            )}
                          </td>

                          {/* Course & Campus */}
                          <td className="py-3.5 px-4">
                            <span className="inline-block bg-teal-100 text-teal-900 font-black text-[10px] px-2 py-0.5 rounded-md">
                              {courseName}
                            </span>
                            <div className="text-[10px] text-slate-500 mt-1">
                              {p.campusPreference ? `📍 ${p.campusPreference}` : 'WeGrow Campus'}
                            </div>
                          </td>

                          {/* Reward Won */}
                          <td className="py-3.5 px-4">
                            {p.hasSpun ? (
                              <div>
                                <span className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 font-black text-[10px] px-2 py-0.5 rounded-md border border-purple-200">
                                  {rewardBadge}
                                </span>
                                <div className="font-bold text-slate-900 text-xs mt-0.5">{rewardTitle}</div>
                                {rewardDesc && (
                                  <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                                    {rewardDesc}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-bold">
                                <Clock className="w-3 h-3" />
                                <span>Wheel not spun</span>
                              </span>
                            )}
                          </td>

                          {/* Voucher Code */}
                          <td className="py-3.5 px-4">
                            {p.hasSpun && voucher !== 'PENDING' ? (
                              <div className="flex items-center gap-1">
                                <span className="font-mono font-black text-xs text-purple-900 bg-purple-100/70 border border-purple-300 px-2 py-0.5 rounded-md">
                                  {voucher}
                                </span>
                                <button
                                  onClick={() => handleCopy(voucher)}
                                  className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors"
                                  title="Copy voucher code"
                                >
                                  {copiedCode === voucher ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-mono text-[11px]">—</span>
                            )}
                          </td>

                          {/* Campus Status */}
                          <td className="py-3.5 px-4">
                            {p.isRedeemed ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Redeemed</span>
                              </span>
                            ) : p.hasSpun ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-100 text-purple-800 border border-purple-300">
                                <Gift className="w-3 h-3" />
                                <span>Active Voucher</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
                                <Clock className="w-3 h-3" />
                                <span>Pending Spin</span>
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {p.hasSpun && (
                                <button
                                  onClick={() => setSelectedParticipant(p)}
                                  className="p-2 rounded-lg bg-slate-100 hover:bg-purple-100 text-purple-700 transition-all cursor-pointer"
                                  title="View Campus Voucher Pass"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}

                              {p.hasSpun && !p.isRedeemed && voucher !== 'PENDING' && (
                                <button
                                  onClick={() => handleRowRedeem(voucher)}
                                  className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all cursor-pointer"
                                  title="Mark as Redeemed at Campus Front Desk"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              )}
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
            <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-600">
              <div className="flex items-center gap-3">
                <span className="text-slate-500">
                  Showing{' '}
                  <span className="text-slate-900 font-extrabold">
                    {totalCount === 0 ? 0 : (page - 1) * limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="text-slate-900 font-extrabold">
                    {Math.min(page * limit, totalCount)}
                  </span>{' '}
                  of <span className="text-slate-900 font-extrabold">{totalCount}</span> participants
                </span>

                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold cursor-pointer"
                >
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 text-slate-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Selected Student Voucher Pass Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Pass Header */}
            <div className="bg-gradient-to-r from-[#147A87] via-teal-700 to-purple-800 p-6 text-white text-center relative">
              <button
                onClick={() => setSelectedParticipant(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-block p-2 rounded-2xl bg-white/10 backdrop-blur-md mb-2">
                <Gift className="w-8 h-8 text-amber-300" />
              </div>
              <h2 className="text-lg font-black tracking-tight">WeGrow Campus Scholarship Pass</h2>
              <p className="text-xs text-white/80 font-medium">Official Digital Reward Voucher</p>
            </div>

            {/* Pass Body */}
            <div className="p-6 space-y-4">
              {/* QR Code */}
              {modalQrUrl && (
                <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <img src={modalQrUrl} alt="Voucher QR" className="w-44 h-44 rounded-xl" />
                  <div className="text-center mt-2">
                    <div className="font-mono font-black text-sm text-purple-900 tracking-wider">
                      {selectedParticipant.voucherCode}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                      Scan at WeGrow Front Desk
                    </div>
                  </div>
                </div>
              )}

              {/* Student & Prize Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-semibold">Student Name:</span>
                  <span className="font-black text-slate-900">
                    {selectedParticipant.fullName || selectedParticipant.name}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-semibold">Reward Won:</span>
                  <span className="font-black text-purple-700 text-right">
                    {selectedParticipant.rewardTitle || selectedParticipant.wonReward?.title}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-semibold">Interested Course:</span>
                  <span className="font-bold text-slate-800">{selectedParticipant.courseInterested}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-semibold">Phone:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedParticipant.mobileNo || selectedParticipant.phone}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-semibold">Redemption Status:</span>
                  <span
                    className={`font-black px-2 py-0.5 rounded-md text-[10px] ${
                      selectedParticipant.isRedeemed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedParticipant.isRedeemed ? 'REDEEMED' : 'ACTIVE / UNCLAIMED'}
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Pass</span>
                </button>

                {!selectedParticipant.isRedeemed && selectedParticipant.voucherCode && (
                  <button
                    onClick={() => handleRowRedeem(selectedParticipant.voucherCode)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Redeem at Desk</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rewards Sectors Breakdown Modal */}
      {showRewardsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black flex items-center gap-2">
                  <Dices className="w-5 h-5 text-amber-400" />
                  Active Wheel Sectors & Budget Allocation
                </h3>
                <p className="text-xs text-slate-400">
                  8 Sectors configured for the WeGrow Spin & Win Lucky Draw
                </p>
              </div>
              <button
                onClick={() => setShowRewardsModal(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {REWARD_POOL.map((r, i) => (
                  <div
                    key={r.rewardId || i}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-start gap-3"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 font-black text-xs shadow-xs"
                      style={{ backgroundColor: r.color || '#7c3aed' }}
                    >
                      #{i + 1}
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-slate-900 truncate">{r.title}</span>
                        <span className="text-[10px] font-bold text-slate-500">Weight: {r.probabilityWeight || 15}%</span>
                      </div>
                      <div className="text-[11px] text-purple-700 font-bold">{r.badge}</div>
                      <div className="text-[10px] text-slate-500 truncate">{r.description}</div>
                      <div className="text-[10px] text-slate-400 font-medium">Max Budget Cap: {r.maxTotalBudget || 'Unlimited'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
