import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import {
  Trophy,
  Award,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  Printer,
  Share2,
  Building,
  Phone,
  Mail,
  MapPin,
  Check,
  Calendar,
  AlertCircle,
  Loader2,
  QrCode,
  Download,
  Copy,
  ExternalLink,
  X
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { diwaliChallengeApi, DEFAULT_CHALLENGE_QUESTIONS } from '../services/diwaliChallengeApi';

export default function DiwaliSkillChallenge() {
  // Steps: 1: Enroll | 2: Quiz | 3: Result
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(DEFAULT_CHALLENGE_QUESTIONS);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOption (0..3) }
  const [resultData, setResultData] = useState(null);

  // QR Code States
  const [standeeQrUrl, setStandeeQrUrl] = useState('');
  const [passQrUrl, setPassQrUrl] = useState('');
  const [showPosterQrModal, setShowPosterQrModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    mobileNo: '',
    collegeOrSchool: '',
    courseInterested: 'Full Stack Web & Cloud Development',
    preferredCampus: 'WeGrow Sivakasi Campus'
  });

  // Timer State (20 mins)
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    document.title = 'Diwali Skill Challenge · Score 80+ to Win 1-Week Free Demo · WeGrow B-School';

    // Generate Standee/Poster QR on component mount
    QRCode.toDataURL('https://www.wegrowbschool.in/diwali-challenge', {
      width: 400,
      margin: 2,
      color: { dark: '#450a0a', light: '#ffffff' },
      errorCorrectionLevel: 'H'
    })
      .then(setStandeeQrUrl)
      .catch((err) => console.error('Standee QR generation error:', err));
  }, []);

  // Generate Golden Pass QR dynamically whenever resultData is available
  useEffect(() => {
    if (resultData) {
      const code = resultData.demoTicketCode || 'WGW-DEMO-2024';
      const email = formData.email || '';
      const voucherUrl = `https://www.wegrowbschool.in/diwali-challenge?voucher=${encodeURIComponent(code)}&email=${encodeURIComponent(email)}`;
      QRCode.toDataURL(voucherUrl, {
        width: 400,
        margin: 2,
        color: { dark: '#1e1b4b', light: '#ffffff' },
        errorCorrectionLevel: 'H'
      })
        .then(setPassQrUrl)
        .catch((err) => console.error('Pass QR generation error:', err));
    }
  }, [resultData, formData.email]);

  // Check URL query parameters for voucher on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const voucherParam = urlParams.get('voucher');
    const emailParam = urlParams.get('email');

    if (voucherParam) {
      diwaliChallengeApi.verifyTicket(voucherParam).then((res) => {
        if (res.success && res.data) {
          const v = res.data;
          setResultData({
            score: v.student?.score || 85,
            correctCount: v.student?.correctCount || 17,
            totalQuestions: 20,
            maxScore: 100,
            isQualifiedForDemo: v.benefit?.isQualified ?? true,
            demoTicketCode: v.ticketCode || voucherParam,
            student: v.student,
            rewardDetails: {
              title: v.benefit?.title || '1-Week Free Live Demo Batch Access',
              scholarship: '₹5,000 Direct Fee Waiver on Course Admission',
              location: 'WeGrow B-School Campus / Online Interactive Lab',
              schedule: 'Upcoming Batch: Starts Every Monday (9:30 AM & 6:00 PM)',
              instructions: 'Present this digital pass or QR code at reception to activate your batch access.'
            }
          });
          setStep(3);
        }
      });
    }
  }, []);

  // Timer Countdown
  useEffect(() => {
    let interval = null;
    if (step === 2 && isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, isTimerRunning, timeLeft]);

  // Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Step 1: Submit Enrollment
  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    const cleanMobile = formData.mobileNo.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      toast.error('Please enter a valid 10-digit WhatsApp number');
      return;
    }

    setLoading(true);
    try {
      const res = await diwaliChallengeApi.enroll(formData);
      setLoading(false);

      if (res.alreadySubmitted) {
        setResultData(res.data);
        setStep(3);
        toast.success('Welcome back! Displaying your challenge results.');
        return;
      }

      if (res.success) {
        // Load the 20 questions and start quiz
        const qData = await diwaliChallengeApi.getQuestions();
        const loadedQuestions = qData.questions || DEFAULT_CHALLENGE_QUESTIONS;
        setQuestions(loadedQuestions);
        setStep(2);
        setIsTimerRunning(true);
        toast.success('Enrollment successful! Challenge unlocked. Best of luck!', {
          duration: 4000,
          icon: '🚀'
        });
      } else {
        toast.error(res.message || 'Enrollment failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      console.error('Enrollment error:', err);
      // Fallback
      setStep(2);
      setIsTimerRunning(true);
    }
  };

  // Option selection (0..3)
  const handleSelectOption = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  // Step 2: Submit Quiz Answers
  const handleSubmitQuiz = async () => {
    const formattedAnswers = questions.map((q) => ({
      questionId: q.id,
      selectedOption: answers[q.id] !== undefined ? answers[q.id] : -1
    }));

    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${questions.length} questions. Unanswered questions will receive 0 marks. Submit now?`
      );
      if (!confirmSubmit) return;
    }

    setLoading(true);
    setIsTimerRunning(false);

    try {
      const res = await diwaliChallengeApi.submitAnswers(formData.email, formattedAnswers);
      setLoading(false);

      if (res.success) {
        setResultData(res.data);
        setStep(3);
        if (res.data?.isQualifiedForDemo || res.data?.score >= 80) {
          toast.success(
            `🎉 OUTSTANDING! You scored ${res.data?.score}/100 and unlocked a 1-Week Free Demo Batch!`,
            { duration: 7000 }
          );
        } else {
          toast.success(
            `Challenge finished! You scored ${res.data?.score}/100 and unlocked a 10% Scholarship!`,
            { duration: 5000 }
          );
        }
      } else {
        toast.error(res.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      console.error('Quiz submission error:', err);
      toast.error('Network error during evaluation. Please try again.');
    }
  };

  // Copy Challenge Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://www.wegrowbschool.in/diwali-challenge');
    setCopiedLink(true);
    toast.success('Challenge link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Download Golden Pass QR Image
  const handleDownloadPassQr = () => {
    const url = passQrUrl || resultData?.qrCodeDataUrl || standeeQrUrl;
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `WeGrow_Diwali_Pass_${resultData?.demoTicketCode || 'Ticket'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Pass QR Code downloaded!');
  };

  // Share on WhatsApp
  const handleWhatsAppShare = () => {
    const isQual = resultData?.isQualifiedForDemo || (resultData?.score || 0) >= 80;
    const rewardTitle = isQual ? '1-Week Free Live Demo Batch Pass' : '10% Course Scholarship Voucher';
    const text = `🎉 I just scored ${resultData?.score}/100 in the WeGrow Diwali Skill Challenge!\n\n🏆 My Benefit: ${rewardTitle}\n🎫 Ticket Code: ${resultData?.demoTicketCode}\n🏫 Campus: ${formData.preferredCampus}\n\nTake the 20-question challenge to win your 1-week free demo pass: https://www.wegrowbschool.in/diwali-challenge`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Format MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0D0105] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <Toaster position="top-center" />

      {/* TOPBAR BANNER */}
      <header className="relative z-20 bg-gradient-to-r from-[#7F1D1D] via-[#991B1B] to-[#7F1D1D] border-b border-amber-500/30 px-4 py-2.5 text-xs text-amber-100 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            <span className="text-base">🪔</span>
            <span className="bg-amber-400/20 border border-amber-300/40 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-amber-200">
              Diwali Skill Challenge
            </span>
            <span className="truncate font-bold text-white">
              WeGrow B-School • 20 Questions (5 Marks Each) • Score 80+ to Join 1-Week Free Live Demo!
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Poster QR Quick Trigger */}
            <button
              type="button"
              onClick={() => setShowPosterQrModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-xs font-black uppercase hover:brightness-110 transition shadow-md cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Campus Poster QR</span>
            </button>
            <Link
              to="/diwali-challenge-qr"
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-amber-200 transition border border-white/10"
              title="Print Standee Poster A4"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden xl:inline">Standee Poster</span>
            </Link>
            <Link
              to="/spin-and-win"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase hover:bg-amber-300 transition"
            >
              <span>🎡</span>
              <span className="hidden sm:inline">Spin Wheel</span>
            </Link>
            <Link
              to="/campus-desk"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition border border-white/10"
            >
              <Building className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Counselor Desk</span>
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">

        {/* ======================================================== */}
        {/* STEP 1: STUDENT ENROLLMENT DETAILS (SCAN POSTER QR)     */}
        {/* ======================================================== */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto w-full bg-gradient-to-b from-[#240612] via-[#1A030C] to-[#120207] rounded-3xl p-6 sm:p-8 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden">
            {/* Header Badge */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold uppercase tracking-widest mb-3">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Diwali Skill Challenge • Step 1 of 3</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-400 uppercase tracking-tight">
                Student Enrollment & Challenge Entry
              </h1>
              <p className="text-xs sm:text-sm text-amber-100/80 mt-1.5 max-w-lg mx-auto">
                Scan QR or register your details below. Answer 20 questions (5 marks each = 100 marks).
                <strong className="text-amber-300 block mt-0.5">
                  Score 80+ Marks to unlock a 1-Week Free Live Demo Batch at WeGrow Campus!
                </strong>
              </p>
            </div>

            {/* Quick Reward Highlight Pill */}
            <div className="grid grid-cols-2 gap-2 mb-6 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200">
                <span className="font-extrabold block text-amber-300 text-sm">20 Questions</span>
                <span>5 Marks Each • 100 Total</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-200">
                <span className="font-extrabold block text-emerald-300 text-sm">Pass Mark: 80+</span>
                <span>1-Week Free Live Demo Pass</span>
              </div>
            </div>

            {/* Quick Mobile Scan QR Banner */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-amber-500/15 border border-amber-400/30 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left shadow-inner">
              <div className="shrink-0 p-1.5 bg-white rounded-xl shadow-lg border border-amber-300">
                {standeeQrUrl ? (
                  <img
                    src={standeeQrUrl}
                    alt="Scan with Mobile Camera"
                    className="w-24 h-24 object-contain"
                  />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center text-[10px] text-slate-600">
                    <QrCode className="w-8 h-8 text-amber-600" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-amber-300 text-xs font-black uppercase tracking-wider mb-1">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Scan QR To Take Challenge On Mobile</span>
                </div>
                <p className="text-xs text-amber-100/80 leading-relaxed">
                  Point your phone camera or Google Lens to load this challenge directly on your mobile device.
                </p>
                <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPosterQrModal(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 text-[11px] font-bold transition cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View Standee QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/10 text-[11px] font-bold transition cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-400" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                  <Link
                    to="/diwali-challenge-qr"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 text-[11px] font-bold transition"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Print Standee Poster</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleEnrollSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-amber-200 mb-1">
                  Student Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="studentName"
                  required
                  placeholder="e.g. Aditya Sharma"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-amber-400/30 focus:border-amber-400 focus:outline-none text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">
                    Email Address (For Certificate & Pass) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-amber-400/30 focus:border-amber-400 focus:outline-none text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">
                    Student WhatsApp Mobile <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNo"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={formData.mobileNo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-amber-400/30 focus:border-amber-400 focus:outline-none text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">
                    College / School / Degree
                  </label>
                  <input
                    type="text"
                    name="collegeOrSchool"
                    placeholder="e.g. RV College of Engineering"
                    value={formData.collegeOrSchool}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-amber-400/30 focus:border-amber-400 focus:outline-none text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">
                    Course Interested
                  </label>
                  <select
                    name="courseInterested"
                    value={formData.courseInterested}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-amber-400/30 focus:border-amber-400 focus:outline-none text-white text-sm"
                  >
                    <option value="Full Stack Web & Cloud Development" className="bg-slate-900">
                      Full Stack Web & Cloud Development
                    </option>
                    <option value="AI & Data Science (B.Tech / Specialization)" className="bg-slate-900">
                      AI & Data Science (B.Tech / Specialization)
                    </option>
                    <option value="Python Full Stack & Automation" className="bg-slate-900">
                      Python Full Stack & Automation
                    </option>
                    <option value="Digital Business & Tech Leadership" className="bg-slate-900">
                      Digital Business & Tech Leadership
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-200 mb-1">
                  Preferred WeGrow Campus for 1-Week Demo Class
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label
                    className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                      formData.preferredCampus.includes('Sivakasi')
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                        : 'bg-black/30 border-white/10 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="preferredCampus"
                      value="WeGrow Sivakasi Campus"
                      checked={formData.preferredCampus.includes('Sivakasi')}
                      onChange={handleInputChange}
                      className="accent-amber-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold block text-white">Sivakasi Campus</span>
                      <span className="text-[11px] text-amber-100/70">Ayyapan Kovil Opp, Sivakasi</span>
                    </div>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                      formData.preferredCampus.includes('Srivilliputtur')
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                        : 'bg-black/30 border-white/10 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="preferredCampus"
                      value="WeGrow Srivilliputtur Campus"
                      checked={formData.preferredCampus.includes('Srivilliputtur')}
                      onChange={handleInputChange}
                      className="accent-amber-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold block text-white">Srivilliputtur Campus</span>
                      <span className="text-[11px] text-amber-100/70">129 North Car Street</span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.5)] transition hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enrolling Student...</span>
                  </>
                ) : (
                  <>
                    <span>Start 20-Question Challenge Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: 20-QUESTION SKILL CHALLENGE                     */}
        {/* ======================================================== */}
        {step === 2 && questions.length > 0 && (
          <div className="max-w-3xl mx-auto w-full bg-[#18030C] rounded-3xl p-5 sm:p-7 border-2 border-amber-500/40 shadow-2xl flex flex-col">
            {/* Top Challenge Status Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-500/20 mb-5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase">
                  Question {currentQIndex + 1} of {questions.length}
                </span>
                <span className="text-xs text-amber-200/80 font-semibold">
                  (5 Marks Each • Pass Cutoff: 80+)
                </span>
              </div>

              {/* Countdown Timer */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${
                  timeLeft < 300
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Time Left: {formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Current Question Body */}
            {(() => {
              const currentQ = questions[currentQIndex];
              const selectedOption = answers[currentQ.id];

              return (
                <div className="flex-1 flex flex-col">
                  {/* Category Pill */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-300/80">
                      Category: {currentQ.category || 'Skill Assessment'}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400">+5 Marks</span>
                  </div>

                  {/* Question Text */}
                  <h2 className="text-base sm:text-lg font-bold text-white mb-5 leading-relaxed">
                    {currentQIndex + 1}. {currentQ.question}
                  </h2>

                  {/* Options Grid (0..3) */}
                  <div className="space-y-2.5 mb-6">
                    {currentQ.options?.map((optText, optIdx) => {
                      const isChosen = selectedOption === optIdx;
                      const optLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(currentQ.id, optIdx)}
                          className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                            isChosen
                              ? 'bg-amber-500/25 border-amber-400 text-amber-100 shadow-md ring-2 ring-amber-400/50'
                              : 'bg-black/30 border-white/10 hover:bg-white/5 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                                isChosen
                                  ? 'bg-amber-400 text-slate-950 font-black'
                                  : 'bg-white/10 text-amber-200'
                              }`}
                            >
                              {optLetter}
                            </span>
                            <span className="text-xs sm:text-sm font-medium">{optText}</span>
                          </div>
                          {isChosen && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Bottom Navigation & Question Jumper Palette */}
            <div className="pt-4 border-t border-amber-500/20">
              {/* Question Grid Palette */}
              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                <span className="text-[10px] uppercase font-bold text-amber-200/70 mr-2">
                  Jump to:
                </span>
                {questions.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isCurrent = idx === currentQIndex;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQIndex(idx)}
                      className={`w-7 h-7 rounded-lg text-[11px] font-black transition cursor-pointer ${
                        isCurrent
                          ? 'bg-amber-400 text-slate-950 ring-2 ring-white shadow-md'
                          : isAnswered
                          ? 'bg-emerald-600/40 text-emerald-200 border border-emerald-500/40'
                          : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Prev / Next / Submit Controls */}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQIndex === 0}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-white transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <div className="text-xs font-bold text-amber-200/80">
                  Answered: {Object.keys(answers).length} / {questions.length}
                </div>

                {currentQIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQIndex((prev) => prev + 1)}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    disabled={loading}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 text-xs font-black uppercase tracking-wider transition shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 cursor-pointer animate-pulse"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluating Score...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit 20-Question Challenge</span>
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: RESULT & 1-WEEK FREE DEMO PASS UNLOCKED         */}
        {/* ======================================================== */}
        {step === 3 && resultData && (
          <div className="max-w-2xl mx-auto w-full">
            {/* Header Result Celebration Card */}
            <div className="text-center mb-6">
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3 ${
                  resultData.isQualifiedForDemo || resultData.score >= 80
                    ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'bg-amber-500/20 border border-amber-400 text-amber-300'
                }`}
              >
                {resultData.isQualifiedForDemo || resultData.score >= 80 ? (
                  <Trophy className="w-4 h-4 animate-bounce" />
                ) : (
                  <Award className="w-4 h-4" />
                )}
                <span>
                  {resultData.isQualifiedForDemo || resultData.score >= 80
                    ? '★ QUALIFIED: 1-WEEK FREE LIVE DEMO PASS UNLOCKED ★'
                    : 'CHALLENGE COMPLETED • SCHOLARSHIP VOUCHER UNLOCKED'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white">
                {resultData.isQualifiedForDemo || resultData.score >= 80
                  ? 'Outstanding Performance!'
                  : 'Great Effort!'}
              </h1>
              <p className="text-xs sm:text-sm text-amber-100/80 mt-1 max-w-md mx-auto">
                {resultData.isQualifiedForDemo || resultData.score >= 80
                  ? `You achieved ${resultData.score}/100 marks (Cutoff: 80 marks). Your 1-Week Live Hands-On Demo Pass has been activated!`
                  : `You scored ${resultData.score}/100 marks. Visit our campus reception to claim your ₹5,000 course scholarship and free AI Starter Kit!`}
              </p>
            </div>

            {/* GOLDEN DIGITAL PASS CARD (Printable) */}
            <div
              id="printableChallengePass"
              className="bg-gradient-to-b from-[#2B0616] via-[#1A030D] to-[#110207] border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden print:bg-white print:text-slate-900 print:border-none print:shadow-none"
            >
              {/* Pass Top Branding */}
              <div className="flex items-center justify-between pb-4 border-b border-amber-400/20 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
                    WG
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white print:text-slate-900">
                      WeGrow Skill Campus & B-School
                    </h3>
                    <span className="text-[11px] text-amber-200/80 print:text-slate-600">
                      Diwali Skill Challenge • Verified Voucher Pass
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-black block print:text-slate-800">
                    {resultData.demoTicketCode || 'WGW-DEMO-PASS'}
                  </span>
                  <span className="text-[10px] text-amber-200/60 mt-0.5 block print:text-slate-500">
                    Pass Verified
                  </span>
                </div>
              </div>

              {/* Student & Score Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-5">
                {/* Details Column */}
                <div className="md:col-span-7 space-y-3">
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-400/20 print:bg-slate-50 print:border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-amber-200/70 block">
                      Student Name & College
                    </span>
                    <span className="text-base font-extrabold text-white block print:text-slate-900">
                      {formData.studentName || resultData.student?.name || 'Enrolled Student'}
                    </span>
                    <span className="text-xs text-amber-100/80 print:text-slate-700">
                      {formData.collegeOrSchool || resultData.student?.collegeOrSchool || 'WeGrow Skill Participant'}
                    </span>
                  </div>

                  {/* Score Highlight Box */}
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/30">
                      <span className="text-[10px] uppercase font-bold text-amber-300 block">
                        Marks Scored
                      </span>
                      <span className="text-2xl font-black text-white print:text-slate-900">
                        {resultData.score} / 100
                      </span>
                      <span className="text-[10px] text-amber-100/60 block mt-0.5">
                        {resultData.correctCount || Math.round(resultData.score / 5)} / 20 Correct
                      </span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl border ${
                        resultData.isQualifiedForDemo || resultData.score >= 80
                          ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                          : 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold block">
                        Benefit Unlocked
                      </span>
                      <span className="text-xs font-black block mt-1">
                        {resultData.isQualifiedForDemo || resultData.score >= 80
                          ? '1-Week Free Live Demo Pass'
                          : '10% Course Scholarship'}
                      </span>
                      <span className="text-[10px] opacity-80 block mt-0.5">
                        {resultData.rewardDetails?.scholarship || '₹5,000 Fee Waiver'}
                      </span>
                    </div>
                  </div>

                  {/* Campus & Schedule */}
                  <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-400/30 space-y-1 text-xs text-rose-200 print:text-slate-700">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block print:text-slate-900">
                          Campus Location:
                        </span>
                        <span>{formData.preferredCampus}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-rose-400/20 text-[11px] text-amber-200">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{resultData.rewardDetails?.schedule || 'Upcoming Batch: Starts Every Monday'}</span>
                    </div>
                  </div>
                </div>

                {/* QR Code Column */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-black/40 border border-amber-400/30 text-center print:bg-white print:border-slate-300">
                  <div className="p-1.5 bg-white rounded-2xl border-4 border-amber-400 shadow-xl">
                    <img
                      src={passQrUrl || resultData.qrCodeDataUrl || standeeQrUrl}
                      alt="Verified Voucher QR Code"
                      className="w-40 h-40 object-contain rounded-lg"
                    />
                  </div>
                  <span className="text-xs text-amber-200 mt-2 font-black tracking-wide print:text-slate-800">
                    Scan at Reception to Activate
                  </span>
                  <span className="text-[10px] text-amber-100/60 print:text-slate-500 font-mono mt-0.5">
                    Code: {resultData.demoTicketCode}
                  </span>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadPassQr}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 text-[11px] font-black transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download QR</span>
                    </button>
                    <Link
                      to="/diwali-challenge-qr"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 text-[11px] font-bold transition"
                    >
                      <QrCode className="w-3.5 h-3.5 text-amber-300" />
                      <span>Poster QR</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Notice */}
              <div className="pt-3 border-t border-amber-400/20 text-xs text-amber-100/70 flex items-center justify-between print:text-slate-600">
                <span>* Valid on campus visit to WeGrow B-School. Non-transferable.</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Evaluation
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition border border-white/10 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print / Save Pass</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="p-3 rounded-2xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-200 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition border border-emerald-500/30 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>Share WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setCurrentQIndex(0);
                  setTimeLeft(20 * 60);
                  setStep(2);
                  setIsTimerRunning(true);
                }}
                className="p-3 rounded-2xl bg-amber-600/25 hover:bg-amber-600/35 text-amber-200 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition border border-amber-500/30 cursor-pointer"
              >
                <RotateCw className="w-4 h-4 text-amber-400" />
                <span>Retake Challenge</span>
              </button>

              <a
                href="tel:+919344337331"
                className="p-3 rounded-2xl bg-rose-600/25 hover:bg-rose-600/35 text-rose-200 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition border border-rose-500/30 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-rose-400" />
                <span>Call Counselor</span>
              </a>
            </div>
          </div>
        )}
      </main>

      {/* POSTER QR STAND-ALONE MODAL */}
      {showPosterQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#1F050F] border-2 border-amber-400 rounded-3xl p-6 shadow-2xl relative text-center">
            <button
              type="button"
              onClick={() => setShowPosterQrModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase mb-3">
              <QrCode className="w-3.5 h-3.5 text-amber-400" />
              <span>Campus Poster & Standee QR</span>
            </div>

            <h3 className="text-xl font-black text-amber-300">
              Diwali Skill Challenge QR Code
            </h3>
            <p className="text-xs text-amber-100/70 mt-1 mb-4">
              Place on campus posters & desks. Students scan to take the 20-question challenge and win a 1-Week Free Live Demo Pass!
            </p>

            <div className="p-3 bg-white rounded-2xl shadow-xl inline-block border-4 border-amber-400">
              {standeeQrUrl ? (
                <img
                  src={standeeQrUrl}
                  alt="Campus Standee QR"
                  className="w-56 h-56 object-contain"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-slate-700">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
                </div>
              )}
            </div>

            <div className="mt-3 text-xs font-mono text-amber-200/90 bg-black/40 px-3 py-2 rounded-xl truncate border border-amber-500/20">
              https://www.wegrowbschool.in/diwali-challenge
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <Link
                to="/diwali-challenge-qr"
                className="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-1.5 transition shadow-lg"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Poster</span>
              </Link>
              <button
                type="button"
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition border border-white/10 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
