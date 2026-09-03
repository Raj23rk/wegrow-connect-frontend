import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Loader2, 
  AlertCircle, 
  Trophy, 
  Star, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Award,
  Users
} from 'lucide-react';
import { getCampaignByLookup } from '../services/api';

export default function CampaignLanding() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    if (!campaignId) {
      setError('Invalid campaign link. Please verify the URL.');
      setLoading(false);
      return;
    }
    getCampaignByLookup(campaignId)
      .then((res) => {
        const data = res?.data?.campaign || res?.data || res;
        if (!data || !data.name) throw new Error('Campaign details not found.');
        if (!data.isActive) throw new Error('This campaign is currently inactive or has concluded.');
        setCampaign(data);
      })
      .catch((err) => setError(err.message || 'Unable to load campaign details.'))
      .finally(() => setLoading(false));
  }, [campaignId]);

  const handleSelect = (type) => {
    navigate(`/campaign/${campaignId}/register?type=${type}`);
  };

  /* ── Loading State ───────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 font-['Inter',sans-serif] px-4">
        <div className="flex flex-col items-center justify-center bg-white/95 backdrop-blur-md px-10 py-12 rounded-3xl shadow-xl border border-slate-200/80 text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 text-[#104288] shadow-inner">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Loading Campaign</h3>
          <p className="text-xs text-slate-500 font-medium">Preparing your registration portal…</p>
        </div>
      </div>
    );
  }

  /* ── Error State ─────────────────────────────────── */
  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 font-['Inter',sans-serif] px-4">
        <div className="flex flex-col items-center justify-center bg-white/95 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200/80 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4 text-red-500 shadow-inner">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Campaign Notice</h2>
          <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => navigate('/home')}
            className="w-full py-3.5 px-6 rounded-xl bg-[#104288] hover:bg-[#0c336b] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            Go to Home Page
          </button>
        </div>
      </div>
    );
  }

  /* ── Main Landing ────────────────────────────────── */
  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-b from-[#f8fafc] via-[#f1f6fe] to-[#f8fafc] font-['Inter',sans-serif] text-slate-800 flex flex-col justify-between">
      {/* Decorative Ambient Background Lights */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[360px] bg-gradient-to-b from-blue-200/40 via-blue-100/25 to-transparent blur-3xl pointer-events-none -z-0" 
      />
      <div 
        className="absolute top-36 -left-20 w-80 h-80 bg-amber-200/35 rounded-full blur-3xl pointer-events-none -z-0" 
      />
      <div 
        className="absolute top-60 -right-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none -z-0" 
      />

      {/* Main Content Container */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-12 relative z-10 flex flex-col items-center">
        
        {/* ===================================================
            HEADER: Official WeGrow B School Logo
        =================================================== */}
        <header className="flex flex-col items-center text-center mb-6">
          <div 
            onClick={() => navigate('/home')}
            title="WeGrow B School Home"
            className="group cursor-pointer bg-white hover:bg-slate-50/90 backdrop-blur-md px-7 py-3.5 rounded-2xl shadow-sm hover:shadow-md border border-slate-200/80 transition-all duration-300 flex items-center justify-center mb-4"
          >
            <img 
              src="/wegrow-logo.png" 
              alt="WeGrow B School" 
              className="h-11 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback branded text if image fails */}
            <div className="hidden items-center gap-1.5 text-2xl font-black tracking-tight">
              <span className="text-[#104288]">WeGrow</span>
              <span className="text-[#f3a812]">B School</span>
            </div>
          </div>

          {/* Campaign Source Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/90 border border-blue-200 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#f3a812]" />
            <span className="text-xs font-black text-[#104288] tracking-widest uppercase">
              {campaign?.source || 'Special'} Campaign
            </span>
          </div>
        </header>

        {/* ===================================================
            HERO SECTION: Title & Description
        =================================================== */}
        <section className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black tracking-tight text-slate-900 leading-[1.15] mb-4">
            Welcome to{' '}
            <span className="text-[#104288]">WeGrow</span>{' '}
            <span className="text-[#f3a812]">Connect</span>
          </h1>

          <p className="text-base sm:text-lg font-medium text-slate-600 leading-relaxed max-w-2xl mx-auto mb-6">
            <span className="text-slate-800 font-bold">{campaign?.name || 'Talent Identification & Skills Initiative'}</span>
            {' '}— Register now to showcase your skills, solve interactive tasks, and win exciting recognition!
          </p>

          {/* Value Proposition Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200/80 shadow-xs text-xs sm:text-sm font-semibold text-slate-700 hover:border-amber-300 transition-colors">
              <Trophy className="w-4 h-4 text-[#f3a812]" />
              <span>Win Exciting Prizes</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200/80 shadow-xs text-xs sm:text-sm font-semibold text-slate-700 hover:border-blue-300 transition-colors">
              <Star className="w-4 h-4 text-[#2563eb]" />
              <span>Get Recognized</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200/80 shadow-xs text-xs sm:text-sm font-semibold text-slate-700 hover:border-emerald-300 transition-colors">
              <Zap className="w-4 h-4 text-[#16a34a]" />
              <span>100% Free to Join</span>
            </div>
          </div>
        </section>

        {/* ===================================================
            CATEGORY SELECTION HEADER
        =================================================== */}
        <div className="w-full max-w-2xl flex items-center justify-center gap-4 mb-8">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-slate-200" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 bg-white/80 px-4 py-1.5 rounded-full border border-slate-200/70 shadow-xs">
            Select Your Category
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-slate-200" />
        </div>

        {/* ===================================================
            STUDENT CATEGORY CARDS (School vs College)
        =================================================== */}
        <div className="w-full max-w-4xl relative">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">

            {/* ── CARD 1: School Student ── */}
            <div
              id="btn-school-student"
              role="button"
              tabIndex={0}
              onClick={() => handleSelect('SCHOOL')}
              onMouseEnter={() => setHoveredCard('SCHOOL')}
              onMouseLeave={() => setHoveredCard(null)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect('SCHOOL'); }}
              className={`cursor-pointer text-left rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group bg-white border-2 ${
                hoveredCard === 'SCHOOL' 
                  ? 'border-[#104288] shadow-2xl -translate-y-1.5' 
                  : 'border-slate-200/80 shadow-md hover:shadow-xl'
              }`}
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#104288] via-[#1d4ed8] to-[#3b82f6]" />

              <div>
                {/* Category Pill + Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-blue-50 text-[#104288] text-xs font-extrabold tracking-wide border border-blue-100">
                    Classes 8th – 12th
                  </span>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    hoveredCard === 'SCHOOL' ? 'bg-[#104288] text-white shadow-md' : 'bg-blue-50 text-[#104288]'
                  }`}>
                    <BookOpen className="w-7 h-7" />
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2.5 group-hover:text-[#104288] transition-colors">
                  School Student
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                  Designed for ambitious high school students ready to demonstrate their creative problem-solving and foundational talents.
                </p>

                {/* Highlight Perks */}
                <ul className="space-y-2.5 mb-8">
                  <li className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#104288] shrink-0" />
                    <span>Age-appropriate fun & academic tasks</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#104288] shrink-0" />
                    <span>Official WeGrow Talent Certificate</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#104288] shrink-0" />
                    <span>Win trophies, badges & school rewards</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <div className="w-full pt-4 border-t border-slate-100">
                <button
                  type="button"
                  className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
                    hoveredCard === 'SCHOOL'
                      ? 'bg-[#104288] text-white shadow-blue-900/25'
                      : 'bg-[#104288] text-white hover:bg-[#0c336b]'
                  }`}
                >
                  <span>Register as School Student</span>
                  <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${hoveredCard === 'SCHOOL' ? 'translate-x-1' : ''}`} />
                </button>
              </div>
            </div>

            {/* ── CARD 2: College Student ── */}
            <div
              id="btn-college-student"
              role="button"
              tabIndex={0}
              onClick={() => handleSelect('COLLEGE')}
              onMouseEnter={() => setHoveredCard('COLLEGE')}
              onMouseLeave={() => setHoveredCard(null)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect('COLLEGE'); }}
              className={`cursor-pointer text-left rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group bg-white border-2 ${
                hoveredCard === 'COLLEGE' 
                  ? 'border-[#f3a812] shadow-2xl -translate-y-1.5' 
                  : 'border-slate-200/80 shadow-md hover:shadow-xl'
              }`}
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#f3a812] via-[#f59e0b] to-[#ea580c]" />

              <div>
                {/* Category Pill + Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-amber-50 text-[#b45309] text-xs font-extrabold tracking-wide border border-amber-100">
                    UG / PG / Diploma
                  </span>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    hoveredCard === 'COLLEGE' ? 'bg-[#f3a812] text-white shadow-md' : 'bg-amber-50 text-[#f3a812]'
                  }`}>
                    <GraduationCap className="w-7 h-7" />
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2.5 group-hover:text-[#d97706] transition-colors">
                  College Student
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                  Tailored for college undergraduates, postgraduates, and diploma scholars eager to test practical and technical prowess.
                </p>

                {/* Highlight Perks */}
                <ul className="space-y-2.5 mb-8">
                  <li className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#f3a812] shrink-0" />
                    <span>Real-world case studies & domain tasks</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#f3a812] shrink-0" />
                    <span>Direct connect to mentors & internships</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#f3a812] shrink-0" />
                    <span>National recognition & cash reward opportunities</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <div className="w-full pt-4 border-t border-slate-100">
                <button
                  type="button"
                  className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
                    hoveredCard === 'COLLEGE'
                      ? 'bg-gradient-to-r from-[#f3a812] to-[#ea580c] text-white shadow-amber-900/25'
                      : 'bg-[#f3a812] text-white hover:bg-[#d9920a]'
                  }`}
                >
                  <span>Register as College Student</span>
                  <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${hoveredCard === 'COLLEGE' ? 'translate-x-1' : ''}`} />
                </button>
              </div>
            </div>

          </div>

          {/* Floating OR Divider Badge (Desktop only) */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border-2 border-slate-200 shadow-lg items-center justify-center z-20 pointer-events-none">
            <span className="text-xs font-black text-slate-400">OR</span>
          </div>

        </div>

        {/* Security & Verification Assurance */}
        <div className="mt-10 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 bg-white/70 px-4 py-2 rounded-full border border-slate-200/60 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Official WeGrow B School Talent Portal • 100% Free & Secure</span>
        </div>
      </main>

      {/* ===================================================
          FOOTER
      =================================================== */}
      <footer className="w-full border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-6 text-center text-xs font-medium text-slate-500 relative z-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">WeGrow Connect</span>
            <span>•</span>
            <span className="text-[#104288] font-semibold">WeGrow B School</span>
          </div>
          <div className="text-slate-400">
            Campaign ID: <span className="font-mono font-semibold text-slate-700">{campaignId}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
