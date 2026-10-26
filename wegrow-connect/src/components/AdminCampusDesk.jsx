import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
  Building,
  Search,
  CheckCircle2,
  Clock,
  Download,
  RotateCw,
  Gift,
  Award,
  Users,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Filter,
  Check,
  AlertCircle,
  FileSpreadsheet,
  Trophy
} from 'lucide-react';
import { spinWheelApi, REWARD_POOL } from '../services/spinWinApi';

export default function AdminCampusDesk() {
  // Navigation Tabs: 'desk' (Voucher Redemption), 'students' (All Registrations), 'quotas' (Reward Analytics)
  const [activeTab, setActiveTab] = useState('desk');

  // Loading & Connection state
  const [loading, setLoading] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    totalRegistered: 0,
    totalVerified: 0,
    totalSpun: 0,
    totalRedeemed: 0,
    rewardBreakdown: []
  });

  // ==========================================
  // TAB 1: CAMPUS DESK VOUCHER LOOKUP & REDEEM
  // ==========================================
  const [voucherInput, setVoucherInput] = useState('');
  const [isVerifyingVoucher, setIsVerifyingVoucher] = useState(false);
  const [verifiedVoucher, setVerifiedVoucher] = useState(null);
  const [verificationError, setVerificationError] = useState('');
  const [staffNote, setStaffNote] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  // ==========================================
  // TAB 2: STUDENTS REGISTRATION TABLE
  // ==========================================
  const [participants, setParticipants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterSpun, setFilterSpun] = useState('');
  const [filterRedeemed, setFilterRedeemed] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Load Admin Stats & Participants
  const fetchParticipants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await spinWheelApi.getAdminParticipants({
        search: searchQuery,
        course: filterCourse,
        hasSpun: filterSpun,
        isRedeemed: filterRedeemed,
        page,
        limit
      });

      if (res && res.success && res.data) {
        setIsBackendConnected(true);
        setParticipants(res.data.participants || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalRecords(res.data.total || 0);

        if (res.data.summary) {
          setStats((prev) => ({
            ...prev,
            totalRegistered: res.data.summary.totalRegistered || 0,
            totalVerified: res.data.summary.totalVerified || 0,
            totalSpun: res.data.summary.totalSpun || 0,
            totalRedeemed: res.data.summary.totalRedeemed || 0
          }));
        }
      }
    } catch (err) {
      console.warn('Error fetching participants:', err);
      setIsBackendConnected(false);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterCourse, filterSpun, filterRedeemed, page, limit]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await spinWheelApi.getAdminStats();
      if (res && res.success && res.data) {
        setStats((prev) => ({
          ...prev,
          ...res.data
        }));
      }
    } catch (err) {
      console.warn('Error fetching stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchParticipants();
    fetchStats();
  }, [fetchParticipants, fetchStats]);

  // Handle Voucher Verification in Campus Desk
  const handleVerifyVoucherCode = async (codeToVerify) => {
    const code = (codeToVerify || voucherInput).trim().toUpperCase();
    if (!code) {
      toast.error('Please enter a voucher code to verify');
      return;
    }

    setIsVerifyingVoucher(true);
    setVerificationError('');
    setVerifiedVoucher(null);

    try {
      const res = await spinWheelApi.verifyVoucher(code);
      if (res.success && res.data) {
        setVerifiedVoucher(res.data);
        setVoucherInput(code);
        toast.success(`Voucher ${code} verified!`, { icon: '✅' });
      } else {
        setVerificationError(res.message || `No voucher found with code: ${code}`);
        toast.error(res.message || 'Invalid voucher code');
      }
    } catch {
      setVerificationError('Error connecting to voucher verification server.');
      toast.error('Verification failed. Check server connection.');
    } finally {
      setIsVerifyingVoucher(false);
    }
  };

  // Handle Mark Redeemed
  const handleRedeemVoucher = async () => {
    if (!verifiedVoucher?.voucherCode) return;
    setIsRedeeming(true);

    try {
      const res = await spinWheelApi.redeemVoucher(
        verifiedVoucher.voucherCode,
        staffNote || 'Redeemed during campus counseling visit'
      );

      if (res.success) {
        toast.success(res.message || 'Voucher marked as redeemed successfully!', {
          icon: '🎉',
          duration: 5000
        });
        // Update local verified state
        setVerifiedVoucher((prev) => ({
          ...prev,
          isRedeemed: true,
          redeemedAt: new Date().toISOString(),
          staffNote
        }));
        setStaffNote('');
        fetchParticipants();
        fetchStats();
      } else {
        toast.error(res.message || 'Could not redeem voucher.');
      }
    } catch {
      toast.error('Redemption failed. Check server connection.');
    } finally {
      setIsRedeeming(false);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    if (!participants.length) {
      toast.error('No participants to export');
      return;
    }

    const headers = [
      'Student Name',
      'Email',
      'Mobile No',
      'Father Mobile',
      'Mother Mobile',
      'Course Interested',
      'Campus Preference',
      'Voucher Code',
      'Reward Title',
      'Reward Badge',
      'Email Verified',
      'Has Spun',
      'Is Redeemed',
      'Spun At',
      'Redeemed At',
      'Registration Date'
    ];

    const rows = participants.map((p) => [
      `"${p.name || ''}"`,
      `"${p.email || ''}"`,
      `"${p.mobileNo || ''}"`,
      `"${p.fatherMobile || p.fatherPhone || ''}"`,
      `"${p.motherMobile || p.motherPhone || ''}"`,
      `"${p.courseInterested || ''}"`,
      `"${p.campusPreference || p.preferredCampus || ''}"`,
      `"${p.voucherCode || ''}"`,
      `"${p.rewardTitle || p.wonReward?.title || ''}"`,
      `"${p.rewardBadge || p.wonReward?.badge || ''}"`,
      p.isEmailVerified ? 'Yes' : 'No',
      p.hasSpun ? 'Yes' : 'No',
      p.isRedeemed ? 'Yes' : 'No',
      `"${p.spunAt || ''}"`,
      `"${p.redeemedAt || ''}"`,
      `"${new Date(p.createdAt || Date.now()).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WeGrow_CampusDesk_Students_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Student records exported to CSV!');
  };

  return (
    <div className="min-h-screen bg-[#140308] text-slate-100 font-sans selection:bg-amber-500 selection:text-white">
      <Toaster position="top-center" reverseOrder={false} />

      {/* TOPBAR / HEADER */}
      <header className="sticky top-0 z-40 bg-[#1F050F]/90 backdrop-blur-md border-b border-amber-500/30 px-4 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & Desk Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg md:text-xl text-white tracking-tight">
                  WeGrow Campus Counselor Desk
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400/20 border border-amber-400/40 text-amber-300">
                  Admin Portal
                </span>
              </div>
              <p className="text-xs text-amber-200/70">
                Diwali Deal • Student Registrations, Fair Wheel Allocation & Campus Redemption Desk
              </p>
            </div>
          </div>

          {/* Quick Actions & Live Connection Status */}
          <div className="flex items-center gap-2.5">
            {/* Backend Status Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isBackendConnected
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              }`}
              title="API Base: http://localhost:4000/api/v1/spin-wheel"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                }`}
              />
              <span>{isBackendConnected ? 'Campus Server Live' : 'Offline Mock Mode'}</span>
            </div>

            {/* Refresh Data */}
            <button
              onClick={() => {
                fetchParticipants();
                fetchStats();
                toast.success('Refreshed data!');
              }}
              disabled={loading}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-amber-200 transition cursor-pointer"
              title="Refresh Records"
            >
              <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition cursor-pointer"
              title="Export all student registrations to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Open Spin & Win Wheel */}
            <Link
              to="/spin-and-win"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 text-xs font-black uppercase tracking-wide transition shadow-md cursor-pointer"
            >
              <span>🪔</span>
              <span>Open Wheel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
          <button
            onClick={() => setActiveTab('desk')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'desk'
                ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'text-amber-200/80 hover:bg-white/5'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Campus Desk (Voucher Scanner)</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'students'
                ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'text-amber-200/80 hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Registrations ({totalRecords})</span>
          </button>

          <button
            onClick={() => setActiveTab('quotas')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'quotas'
                ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'text-amber-200/80 hover:bg-white/5'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Reward Quotas & Fair Play</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* ======================================================== */}
        {/* KPI SUMMARY CARDS                                        */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-[#1C050E] border border-amber-400/20 shadow-md">
            <span className="text-amber-200/70 text-xs font-bold block">Total Registered</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">{stats.totalRegistered}</span>
              <span className="text-[11px] text-amber-400 font-semibold">Students</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#1C050E] border border-amber-400/20 shadow-md">
            <span className="text-amber-200/70 text-xs font-bold block">Verified OTPs</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-blue-400">{stats.totalVerified}</span>
              <span className="text-[11px] text-blue-300 font-semibold">Unlocked Wheel</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#1C050E] border border-amber-400/20 shadow-md">
            <span className="text-amber-200/70 text-xs font-bold block">Completed Spins</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-400">{stats.totalSpun}</span>
              <span className="text-[11px] text-amber-300 font-semibold">Vouchers Issued</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#1C050E] border border-amber-400/20 shadow-md">
            <span className="text-amber-200/70 text-xs font-bold block">Campus Redemptions</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-400">{stats.totalRedeemed}</span>
              <span className="text-[11px] text-emerald-300 font-semibold">Admissions Claimed</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: CAMPUS RECEPTION / VOUCHER VERIFICATION & REDEEM   */}
        {/* ======================================================== */}
        {activeTab === 'desk' && (
          <div className="space-y-6">
            {/* Voucher Search Bar */}
            <div className="bg-[#1C050E] border-2 border-amber-400/40 rounded-3xl p-6 shadow-2xl">
              <div className="max-w-2xl mx-auto text-center mb-6">
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-amber-400/20 border border-amber-400/40 text-amber-300 inline-block mb-2">
                  Front Desk Voucher Verification
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white">
                  Verify Student Voucher Pass
                </h2>
                <p className="text-xs text-amber-200/70 mt-1">
                  Enter student's digital voucher code (e.g. <strong>WGW-SPIN-83921</strong>) or search from registered records to confirm eligibility and mark claimed.
                </p>
              </div>

              {/* Input & Search Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerifyVoucherCode();
                }}
                className="max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-3"
              >
                <div className="relative w-full">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" />
                  <input
                    type="text"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                    placeholder="Enter Voucher Code (e.g. WGW-SPIN-83921)..."
                    className="w-full bg-[#120308] border-2 border-amber-400/40 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-400 tracking-wider font-mono shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingVoucher}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 active:scale-95 transition shadow-lg shrink-0 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isVerifyingVoucher ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify Pass</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick autofill pills for recently spun unredeemed students */}
              <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-amber-200/60 text-[11px] font-semibold">Quick Select Unredeemed:</span>
                {participants
                  .filter((p) => p.hasSpun && !p.isRedeemed && p.voucherCode)
                  .slice(0, 4)
                  .map((p) => (
                    <button
                      key={p.voucherCode}
                      type="button"
                      onClick={() => handleVerifyVoucherCode(p.voucherCode)}
                      className="px-2.5 py-1 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-200 font-mono text-[11px] font-bold transition cursor-pointer"
                    >
                      {p.voucherCode} ({p.name})
                    </button>
                  ))}
              </div>
            </div>

            {/* Error Message */}
            {verificationError && (
              <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{verificationError}</span>
              </div>
            )}

            {/* VERIFIED STUDENT DOSSIER PASS CARD */}
            {verifiedVoucher && (
              <div className="bg-gradient-to-b from-[#2A0815] to-[#18040C] border-2 border-amber-400 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                {/* Golden Accent Top Line */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500" />

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-amber-400/20">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs uppercase font-black tracking-widest text-amber-400">
                        Official Student Verification Dossier
                      </span>
                      <span
                        className={`px-3 py-0.5 rounded-full text-xs font-black uppercase ${
                          verifiedVoucher.isRedeemed
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-amber-400 text-slate-950 animate-pulse'
                        }`}
                      >
                        {verifiedVoucher.isRedeemed ? 'Already Redeemed' : 'Valid Voucher (Ready For Claim)'}
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-white mt-1">
                      {verifiedVoucher.participant?.name || verifiedVoucher.studentName || 'Student Participant'}
                    </h3>
                    <p className="text-xs text-amber-200/80 mt-0.5">
                      Voucher Code: <strong className="text-amber-300 font-mono text-sm">{verifiedVoucher.voucherCode}</strong>
                    </p>
                  </div>

                  {/* QR Preview / Status Stamp */}
                  <div className="shrink-0 flex items-center gap-3">
                    {verifiedVoucher.isRedeemed ? (
                      <div className="px-4 py-2 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 text-center">
                        <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-1" />
                        <span className="text-xs font-black uppercase block">Redeemed At Campus</span>
                        <span className="text-[10px] text-emerald-200 block">
                          {new Date(verifiedVoucher.redeemedAt || Date.now()).toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <div className="px-4 py-2 rounded-2xl bg-amber-400/20 border-2 border-amber-400 text-amber-300 text-center">
                        <Gift className="w-8 h-8 mx-auto text-amber-300 mb-1 animate-bounce" />
                        <span className="text-xs font-black uppercase block">Ready For Claim</span>
                        <span className="text-[10px] text-amber-200/70 block">Presenting on campus</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Student Contact Info */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>Student Registration Details</span>
                    </h4>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-200/60">Email Address:</span>
                        <span className="font-bold text-white">{verifiedVoucher.participant?.email}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-amber-200/60">Student Mobile:</span>
                        <span className="font-bold text-white">+91 {verifiedVoucher.participant?.mobileNo}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-amber-200/60">Father's Contact:</span>
                        <span className="font-bold text-white">
                          +91 {verifiedVoucher.participant?.fatherMobile || verifiedVoucher.participant?.fatherPhone || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-amber-200/60">Mother's Contact:</span>
                        <span className="font-bold text-white">
                          +91 {verifiedVoucher.participant?.motherMobile || verifiedVoucher.participant?.motherPhone || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-amber-200/60">Interested Course:</span>
                        <span className="font-bold text-amber-300 text-right">
                          {verifiedVoucher.participant?.courseInterested || 'Full Stack & AI Track'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-amber-200/60">Campus Preference:</span>
                        <span className="font-bold text-rose-300 text-right">
                          {verifiedVoucher.participant?.campusPreference || verifiedVoucher.participant?.preferredCampus || 'Sivakasi Campus'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Won Reward Details */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>Awarded Skill Reward</span>
                    </h4>

                    <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-400/40 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-950">
                          {verifiedVoucher.reward?.badge || verifiedVoucher.participant?.rewardBadge || 'FESTIVE REWARD'}
                        </span>
                        <span className="text-amber-300 font-bold text-xs">
                          {verifiedVoucher.reward?.valueText || 'Diwali Special'}
                        </span>
                      </div>

                      <div className="text-lg font-black text-white mt-1">
                        {verifiedVoucher.reward?.title || verifiedVoucher.participant?.rewardTitle || 'Skill Scholarship Pass'}
                      </div>

                      <p className="text-amber-100/80 leading-relaxed text-[11px]">
                        {verifiedVoucher.reward?.description || 'Exclusive campus course fee reduction & masterclass privileges.'}
                      </p>

                      <div className="pt-2 border-t border-amber-400/20 text-[11px] text-amber-200/70 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{verifiedVoucher.reward?.terms || 'Valid on physical enrollment at WeGrow Campus front desk.'}</span>
                      </div>
                    </div>

                    {/* Counselor Redemption Action */}
                    {!verifiedVoucher.isRedeemed ? (
                      <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/30 space-y-3">
                        <label className="block text-[11px] font-bold uppercase text-emerald-300">
                          Counselor Admission Notes:
                        </label>
                        <input
                          type="text"
                          value={staffNote}
                          onChange={(e) => setStaffNote(e.target.value)}
                          placeholder="e.g. Student enrolled in AI batch with ₹25,000 scholarship applied..."
                          className="w-full bg-[#120308] border border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-emerald-200/40 focus:outline-none focus:border-emerald-400"
                        />
                        <button
                          type="button"
                          onClick={handleRedeemVoucher}
                          disabled={isRedeeming}
                          className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer flex items-center justify-center gap-2"
                        >
                          {isRedeeming ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                              <span>Processing Campus Claim...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Mark Voucher Redeemed at Campus</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                        <strong>Redemption Staff Note:</strong>{' '}
                        {verifiedVoucher.staffNote || verifiedVoucher.participant?.staffNote || 'Student attended counseling at WeGrow Campus.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ALL REGISTERED STUDENTS TABLE                     */}
        {/* ======================================================== */}
        {activeTab === 'students' && (
          <div className="bg-[#1C050E] border-2 border-amber-400/30 rounded-3xl p-6 shadow-2xl">
            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search name, email, phone, voucher..."
                  className="w-full bg-[#120308] border border-amber-400/30 rounded-xl pl-10 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Course Filter */}
              <select
                value={filterCourse}
                onChange={(e) => {
                  setFilterCourse(e.target.value);
                  setPage(1);
                }}
                className="bg-[#120308] border border-amber-400/30 rounded-xl px-3 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-400"
              >
                <option value="">All Courses</option>
                <option value="Full Stack Web & Cloud Development">Full Stack Web & Cloud</option>
                <option value="Applied AI, Machine Learning & Data Analytics">Applied AI & ML</option>
                <option value="Business Management & Entrepreneurship (MBA Track)">MBA Track</option>
                <option value="Performance Digital Marketing & Growth">Digital Marketing</option>
                <option value="Corporate Accounting, GST & Tally Prime">Corporate Accounting</option>
                <option value="AI Explorer — Tech & Robotics Foundation">AI Explorer</option>
              </select>

              {/* Spin Filter */}
              <select
                value={filterSpun}
                onChange={(e) => {
                  setFilterSpun(e.target.value);
                  setPage(1);
                }}
                className="bg-[#120308] border border-amber-400/30 rounded-xl px-3 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-400"
              >
                <option value="">All Spin Status</option>
                <option value="true">Spun Wheel Only</option>
                <option value="false">Not Spun Yet</option>
              </select>

              {/* Redeem Filter */}
              <select
                value={filterRedeemed}
                onChange={(e) => {
                  setFilterRedeemed(e.target.value);
                  setPage(1);
                }}
                className="bg-[#120308] border border-amber-400/30 rounded-xl px-3 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-400"
              >
                <option value="">All Redemption Status</option>
                <option value="true">Redeemed at Campus</option>
                <option value="false">Pending Campus Visit</option>
              </select>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/60 text-amber-300 font-extrabold uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-3.5">Student</th>
                    <th className="p-3.5">Family Contacts</th>
                    <th className="p-3.5">Course & Campus</th>
                    <th className="p-3.5">Reward Won</th>
                    <th className="p-3.5">Voucher Code</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Desk Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {participants.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        {loading ? 'Loading registered students...' : 'No student records found matching filters.'}
                      </td>
                    </tr>
                  ) : (
                    participants.map((p) => (
                      <tr key={p._id || p.id || p.email} className="hover:bg-white/5 transition">
                        {/* Student Name & Email */}
                        <td className="p-3.5">
                          <div className="font-bold text-white text-sm">{p.name}</div>
                          <div className="text-amber-100/60 text-[11px] flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-amber-400" />
                            <span>{p.email}</span>
                          </div>
                          {p.isEmailVerified && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald-400 font-bold uppercase mt-1">
                              <Check className="w-2.5 h-2.5" />
                              <span>Verified OTP</span>
                            </span>
                          )}
                        </td>

                        {/* Contacts */}
                        <td className="p-3.5 space-y-0.5 text-[11px]">
                          <div className="font-semibold text-white">
                            Student: <strong>+91 {p.mobileNo}</strong>
                          </div>
                          <div className="text-amber-100/70">
                            Father: +91 {p.fatherMobile || p.fatherPhone || 'N/A'}
                          </div>
                          <div className="text-amber-100/70">
                            Mother: +91 {p.motherMobile || p.motherPhone || 'N/A'}
                          </div>
                        </td>

                        {/* Course & Campus */}
                        <td className="p-3.5 max-w-[200px]">
                          <div className="font-bold text-amber-200 truncate">{p.courseInterested}</div>
                          <div className="text-amber-100/60 text-[11px] truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                            <span>{p.campusPreference || p.preferredCampus || 'Sivakasi Campus'}</span>
                          </div>
                        </td>

                        {/* Reward Won */}
                        <td className="p-3.5">
                          {p.wonReward || p.rewardTitle ? (
                            <div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                {p.rewardBadge || p.wonReward?.badge || 'DIWALI REWARD'}
                              </span>
                              <div className="text-white font-bold text-xs mt-1 truncate">
                                {p.rewardTitle || p.wonReward?.title}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic">Not spun yet</span>
                          )}
                        </td>

                        {/* Voucher Code */}
                        <td className="p-3.5">
                          {p.voucherCode ? (
                            <span className="font-mono text-amber-300 font-extrabold text-xs bg-black/40 px-2 py-1 rounded border border-amber-400/30">
                              {p.voucherCode}
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-3.5">
                          {p.isRedeemed ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Redeemed</span>
                            </span>
                          ) : p.hasSpun ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3" />
                              <span>Spun (Pending)</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-700 text-slate-300 w-fit block">
                              Registered
                            </span>
                          )}
                        </td>

                        {/* Desk Action */}
                        <td className="p-3.5 text-right">
                          {p.hasSpun && (
                            <button
                              onClick={() => {
                                setActiveTab('desk');
                                handleVerifyVoucherCode(p.voucherCode);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition cursor-pointer"
                            >
                              Verify at Desk
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-200/80">
              <div>
                Showing <strong>{participants.length}</strong> of <strong>{totalRecords}</strong> total registered students
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 transition cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                <span className="px-3 py-1 bg-black/40 rounded-lg font-bold text-white">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 transition cursor-pointer flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: REWARD QUOTAS & FAIR PLAY ANALYTICS                */}
        {/* ======================================================== */}
        {activeTab === 'quotas' && (
          <div className="bg-[#1C050E] border-2 border-amber-400/30 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="max-w-2xl">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-block mb-2">
                Fair Budget Guarantee (Anti-Gambling Compliance)
              </span>
              <h2 className="text-2xl font-black text-white">
                Reward Allocation Quotas & Campus Budget
              </h2>
              <p className="text-xs text-amber-200/70 mt-1">
                Every sector on the wheel represents a legitimate educational scholarship or campus resource pass, capped to an institutional marketing budget.
              </p>
            </div>

            {/* Grid of 8 Reward Quotas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {REWARD_POOL.map((r) => {
                const allocated =
                  stats.rewardBreakdown?.find((item) => item.rewardId === r.rewardId)?.allocatedCount ||
                  participants.filter((p) => p.wonReward?.rewardId === r.rewardId || p.rewardTitle === r.title).length ||
                  0;
                const max = r.maxTotalBudget || 100;
                const percent = Math.min(Math.round((allocated / max) * 100), 100);

                return (
                  <div
                    key={r.rewardId}
                    className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-black uppercase text-slate-950"
                          style={{ backgroundColor: r.color }}
                        >
                          {r.badge || r.shortTitle}
                        </span>
                        <span className="text-xs text-amber-300 font-bold">{r.valueText}</span>
                      </div>

                      <h4 className="font-extrabold text-white text-sm leading-snug">{r.title}</h4>
                      <p className="text-[11px] text-amber-100/70 mt-1 line-clamp-2">{r.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-amber-200/70 font-semibold">Budget Claimed:</span>
                        <span className="font-bold text-white">
                          {allocated} / {max} seats
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percent}%`,
                            backgroundColor: r.color
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
