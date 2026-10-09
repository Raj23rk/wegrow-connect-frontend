import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Phone,
  BookOpen,
  School,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  GraduationCap,
  X
} from 'lucide-react';
import { aiExplorerApi } from '../services/aiExplorerApi';
import { singAlongApi } from '../services/singAlongApi';

const PLANS = {
  full: {
    id: 'full',
    name: 'Full Payment',
    totalFee: 43000,
    amount: 43000,
    label: '₹43,000',
    payNowLabel: '₹43,000',
    tag: 'BEST VALUE',
    desc: 'One-time payment covering full annual curriculum, practical labs & AI kit.',
    cycles: '1 Full Payment • Save ₹2,000',
    color: 'from-emerald-500 to-teal-600',
    badgeBg: '#10b981',
  },
  half: {
    id: 'half',
    name: 'Half-Yearly',
    totalFee: 45000,
    amount: 22500,
    label: '₹45,000',
    payNowLabel: '₹22,500 (1st Half)',
    tag: 'FLEXIBLE',
    desc: '2 convenient installments of ₹22,500 (Pay 1st Half ₹22,500 now).',
    cycles: '2 Installments • Pay 1st Half ₹22,500 now',
    color: 'from-purple-500 to-indigo-600',
    badgeBg: '#8b5cf6',
  },
  term: {
    id: 'term',
    name: 'Term Wise Payment',
    totalFee: 45000,
    amount: 15000,
    label: '₹45,000',
    payNowLabel: '₹15,000 (Term I)',
    tag: 'EASY TERMS',
    desc: '3 equal term payments (Term I: ₹15k, Term II: ₹15k, Term III: ₹15k).',
    cycles: '3 Terms • Pay 1st Term ₹15,000 now',
    color: 'from-blue-500 to-cyan-600',
    badgeBg: '#3b82f6',
  },
};

const TERM_OPTIONS = [
  { id: 'term1', label: 'Term I', amount: 15000, desc: 'Pay 1st Term Now' },
  { id: 'term2', label: 'Term II', amount: 15000, desc: 'Pay 2nd Term' },
  { id: 'term3', label: 'Term III', amount: 15000, desc: 'Pay 3rd Term' },
];

const HALF_OPTIONS = [
  { id: 'half1', label: '1st Half', amount: 22500, desc: 'Pay 1st Installment Now' },
  { id: 'half2', label: '2nd Half', amount: 22500, desc: 'Pay 2nd Installment' },
];

export default function AiExplorerEnrollment() {
  const [step, setStep] = useState(1);

  const [student, setStudent] = useState({
    name: '',
    mailId: '',
    standard: '',
    school: '',
    fatherName: '',
    motherName: '',
    fatherPhone: '',
    motherPhone: '',
    address: '',
  });

  const [errors, setErrors] = useState({});
  const [selectedPlan, setSelectedPlan] = useState('full');
  const [selectedTerm, setSelectedTerm] = useState('term1');
  const [selectedHalf, setSelectedHalf] = useState('half1');
  const [isDeclared, setIsDeclared] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cashfree');
  const [utrNumber, setUtrNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedEnrollment, setCompletedEnrollment] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const formTopRef = useRef(null);

  const getActivePayDetails = () => {
    if (selectedPlan === 'term') {
      const t = TERM_OPTIONS.find((item) => item.id === selectedTerm) || TERM_OPTIONS[0];
      return {
        planName: `Term Wise Payment (${t.label})`,
        basePlanName: 'Term Wise Payment',
        subLabel: t.label,
        amount: t.amount,
        totalFee: 45000,
        dueDesc: `${t.label} Payment Due`,
        tag: `${t.label} Fee`,
      };
    }
    if (selectedPlan === 'half') {
      const h = HALF_OPTIONS.find((item) => item.id === selectedHalf) || HALF_OPTIONS[0];
      return {
        planName: `Half-Yearly (${h.label})`,
        basePlanName: 'Half-Yearly',
        subLabel: h.label,
        amount: h.amount,
        totalFee: 45000,
        dueDesc: `${h.label} Payment Due`,
        tag: `${h.label} Fee`,
      };
    }
    return {
      planName: 'Full Payment',
      basePlanName: 'Full Payment',
      subLabel: 'Full Payment',
      amount: 43000,
      totalFee: 43000,
      dueDesc: 'Total Amount Due',
      tag: 'Full Payment',
    };
  };

  // Generate QR Code upon successful enrollment
  useEffect(() => {
    if (completedEnrollment) {
      const qrPayload = JSON.stringify({
        id: completedEnrollment.id,
        student: completedEnrollment.studentName,
        standard: completedEnrollment.standard,
        school: completedEnrollment.school,
        parentPhone: completedEnrollment.fatherPhone,
        plan: completedEnrollment.planName,
        status: completedEnrollment.paymentStatus,
        verifiedBy: 'WeGrow Skill Campus & B-School',
      });

      QRCode.toDataURL(qrPayload, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f1f5c',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error('QR generation error:', err));
    }
  }, [completedEnrollment]);

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'fatherPhone' || name === 'motherPhone') {
      const clean = value.replace(/\D/g, '').slice(0, 10);
      setStudent((prev) => ({ ...prev, [name]: clean }));
    } else {
      setStudent((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate Step 1
  const validateStep1 = () => {
    const errs = {};
    if (!student.name.trim()) errs.name = 'Student name is required';
    if (!student.mailId.trim()) {
      errs.mailId = 'Email ID is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.mailId.trim())) {
      errs.mailId = 'Enter a valid email address';
    }
    if (!student.standard) errs.standard = 'Please select student standard';
    if (!student.school.trim()) errs.school = 'School name is required';
    if (!student.fatherName.trim()) errs.fatherName = "Father's name is required";
    if (!student.motherName.trim()) errs.motherName = "Mother's name is required";

    if (!student.fatherPhone.trim()) {
      errs.fatherPhone = "Father's phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(student.fatherPhone.trim())) {
      errs.fatherPhone = 'Enter a valid 10-digit mobile number';
    }

    if (!student.motherPhone.trim()) {
      errs.motherPhone = "Mother's phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(student.motherPhone.trim())) {
      errs.motherPhone = 'Enter a valid 10-digit mobile number';
    }

    if (!student.address.trim()) errs.address = 'Residential address is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextToStep2 = () => {
    if (!validateStep1()) {
      toast.error('Please fill all mandatory fields correctly.');
      return;
    }
    setStep(2);
    scrollToSection();
  };

  const handleNextToStep3 = () => {
    if (!selectedPlan) {
      toast.error('Please choose a fee plan.');
      return;
    }
    if (!isDeclared) {
      toast.error('Please agree to the enrollment declaration.');
      return;
    }
    setStep(3);
    scrollToSection();
  };

  const scrollToSection = () => {
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Process Final Payment & Enrollment
  const handlePaymentAndEnroll = async () => {
    setIsProcessing(true);
    const payDetails = getActivePayDetails();
    const enrollmentPayload = {
      studentName: student.name.trim(),
      mailId: student.mailId.trim(),
      standard: student.standard,
      school: student.school.trim(),
      fatherName: student.fatherName.trim(),
      motherName: student.motherName.trim(),
      fatherPhone: student.fatherPhone.trim(),
      motherPhone: student.motherPhone.trim(),
      address: student.address.trim(),
      course: 'AI Explorer',
      plan: selectedPlan,
      planName: payDetails.planName,
      selectedTerm: selectedPlan === 'term' ? payDetails.subLabel : undefined,
      selectedHalf: selectedPlan === 'half' ? payDetails.subLabel : undefined,
      amount: payDetails.amount,
      paymentMethod,
      transactionId: utrNumber.trim() || `ORD_${Date.now().toString().slice(-8)}`,
      paymentStatus: 'PAID',
    };

    try {
      // 1. If Cashfree chosen and SDK available, trigger checkout
      if (paymentMethod === 'Cashfree') {
        try {
          const cashfreePayload = {
            orderAmount: payDetails.amount,
            customerName: student.name.trim(),
            customerEmail: student.mailId.trim(),
            customerPhone: student.fatherPhone.trim(),
            orderNote: `AI Explorer Enrollment (${payDetails.planName}) - ${student.name}`,
          };

          const cfRes = await singAlongApi.createOnlineOrder(cashfreePayload).catch(() => null);

          if (cfRes?.success && cfRes?.data?.paymentSessionId && window.Cashfree) {
            toast.success('Opening Cashfree Checkout...');
            const cashfree = window.Cashfree({
              mode: cfRes.data.environment === 'sandbox' ? 'sandbox' : 'production',
            });
            await cashfree.checkout({
              paymentSessionId: cfRes.data.paymentSessionId,
              redirectTarget: '_modal',
            });
          }
        } catch (cfErr) {
          console.warn('Cashfree online checkout fallback handled gracefully:', cfErr);
        }
      }

      // 2. Submit Enrollment to DB / Storage
      const response = await aiExplorerApi.submitEnrollment(enrollmentPayload);
      if (response?.success) {
        setCompletedEnrollment(response.data);
        setStep(4);
        toast.success('🎉 Student enrollment successful!');
        scrollToSection();
      } else {
        throw new Error(response?.message || 'Enrollment could not be processed.');
      }
    } catch (error) {
      toast.error(error.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    toast.success('Enrollment ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#16204a] font-sans antialiased selection:bg-purple-200">
      {/* Print Specific CSS */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 8mm 8mm 8mm;
          }
          html, body, #root, .min-h-screen {
            background: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            min-height: auto !important;
            height: auto !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden,
          .print-hidden {
            display: none !important;
          }
          .print-receipt-card {
            border: 2px solid #0f1f5c !important;
            border-radius: 12px !important;
            box-shadow: none !important;
            background: #ffffff !important;
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 auto !important;
            padding: 16px 20px !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          section {
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
          }
        }
      `}</style>

      {/* Top Query / Doubt Helpline Strip (Included on All Pages) */}
      <div className="print:hidden bg-gradient-to-r from-[#0f1f5c] via-[#1b2a6e] to-[#7b4dff] text-white py-1.5 sm:py-2 px-3 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-center text-xs font-bold">
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span className="bg-amber-400 text-slate-900 text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              Helpline
            </span>
            <span className="text-[11px] sm:text-xs">Any doubts or queries?</span>
            <a
              href="tel:+919344337331"
              className="inline-flex items-center gap-1 text-amber-300 hover:text-white font-black underline underline-offset-2 text-[11px] sm:text-xs whitespace-nowrap"
            >
              <Phone className="w-3 h-3 text-amber-300 shrink-0" />
              <span>+91 93443 37331</span>
            </a>
            <span className="text-white/40 hidden sm:inline">•</span>
            <a
              href="https://wa.me/919344337331?text=Hi%20WeGrow,%20I%20have%20a%20query%20regarding%20AI%20Explorer%20enrollment"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-300 hover:text-white px-2 py-0.5 rounded-md font-black border border-emerald-500/40 text-[10px] sm:text-[11px] whitespace-nowrap"
            >
              <span>💬 WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Warm Ambient Floating Background Glows */}
      <div className="print:hidden fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-80px] left-[-80px] w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#ffedd5]/60 blur-3xl" />
        <div className="absolute top-[35%] right-[-80px] w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#ede9fe]/60 blur-3xl" />
        <div className="absolute bottom-[-80px] left-[15%] w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-[#e0f2fe]/60 blur-3xl" />
      </div>

      {/* Top Navbar */}
      <header className="print:hidden sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#e9e2d5] shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center group shrink-0">
            <div className="bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-xs border border-[#e5ded0] flex items-center justify-center hover:scale-102 transition-transform">
              <img
                src="/wegrow&Bschool.webp"
                alt="WeGrow B School"
                className="h-8 sm:h-12 w-auto object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/logo.webp';
                }}
              />
            </div>
          </Link>

          {/* Stepper Progress (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 bg-white/80 p-1.5 rounded-full border border-[#e2dacb] shadow-2xs">
            {[
              { num: 1, label: 'Student Details' },
              { num: 2, label: 'Fee Plan' },
              { num: 3, label: 'Payment' },
            ].map((s) => (
              <React.Fragment key={s.num}>
                <div
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black transition-all ${
                    step >= s.num
                      ? 'bg-[#7b4dff] text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                  style={
                    step >= s.num
                      ? { background: 'linear-gradient(90deg, #7b4dff, #1846c4)' }
                      : {}
                  }
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      step >= s.num ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {s.num}
                  </span>
                  <span>{s.label}</span>
                </div>
                {s.num < 3 && <div className="w-4 h-0.5 bg-slate-300" />}
              </React.Fragment>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <a
              href="tel:+919344337331"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-black text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-xl border border-purple-200 transition-all shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-purple-600" />
              <span>+91 93443 37331</span>
            </a>
            <Link
              to="/ai-explorer/pre-booking"
              className="inline-flex items-center gap-1.5 text-xs font-black text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-2 rounded-xl border border-amber-300 transition-all shadow-2xs"
            >
              <span>🎟️ Pre-Book (₹1,000)</span>
            </Link>
            <Link
              to="/admin/ai-explorer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-[#f3ede3] px-3.5 py-2 rounded-xl border border-[#ded5c4] shadow-2xs transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Admin Portal</span>
            </Link>
            <button
              onClick={() => {
                if (step !== 1) setStep(1);
                scrollToSection();
              }}
              style={{ background: 'linear-gradient(90deg, #ff7a1a, #ff3d8b)' }}
              className="inline-flex items-center justify-center gap-1.5 text-white font-black text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Enroll Now</span>
            </button>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="lg:hidden flex items-center justify-between px-3 sm:px-4 py-2 bg-white/80 border-t border-[#ede6d8] text-[11px] font-black text-slate-700">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="truncate">Step {step} of 3: {step === 1 ? 'Student Details' : step === 2 ? 'Fee Plan' : 'Payment'}</span>
          </div>
          <div className="flex gap-1 shrink-0 ml-2">
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className={`w-5 h-1.5 rounded-full transition-all ${
                  step >= i ? 'bg-purple-600' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* HERO ANIMATED BANNER VIDEO */}
      <section className="print:hidden w-full relative bg-black overflow-hidden shadow-md border-b border-[#e7decb]">
        <div className="w-full relative flex items-center justify-center bg-black">
          <video
            src="/Animate_website_background_natural_20261008182800.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-contain block mx-auto"
          />
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10" ref={formTopRef}>

        {/* STATS STRIP */}
        <div className="print:hidden grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mb-8 sm:mb-10">
          {[
            { icon: '🧪', title: 'Hands-on Labs', desc: 'Real AI tools', border: 'border-[#ffedd5]', bg: 'bg-[#fff7ed]' },
            { icon: '🛠️', title: 'Real Projects', desc: 'Build & showcase', border: 'border-[#ede9fe]', bg: 'bg-[#faf5ff]' },
            { icon: '🎓', title: 'Certificates', desc: 'WeGrow verified', border: 'border-[#e0f2fe]', bg: 'bg-[#f0f9ff]' },
            { icon: '👥', title: 'Small Batches', desc: 'Personal attention', border: 'border-[#dcfce7]', bg: 'bg-[#f0fdf4]' },
          ].map((stat) => (
            <div
              key={stat.title}
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 ${stat.border} bg-white flex items-center gap-2.5 sm:gap-3 shadow-2xs`}
            >
              <div className={`w-9 sm:w-11 h-9 sm:h-11 rounded-xl ${stat.bg} flex items-center justify-center text-lg sm:text-xl shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <div className="font-black text-xs sm:text-sm text-[#0f1f5c]">{stat.title}</div>
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-500">{stat.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* STEP 1: STUDENT & PARENTS DETAILS FORM */}
        {step === 1 && (
          <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border-2 border-[#e6decf] shadow-lg transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 sm:pb-5 mb-5 sm:mb-6">
              <div>
                <div className="flex items-center gap-2 text-xl sm:text-3xl font-black text-[#0f1f5c]">
                  <span>🧑‍🚀</span>
                  <span>Student Enrollment Details</span>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-1">
                  Step 01 of 03 — Provide student, parent and contact details.
                </p>
              </div>
              <div className="px-3 py-1 rounded-xl bg-[#0f1f5c] text-white font-mono text-xs font-bold shrink-0">
                01 / 03
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNextToStep2();
              }}
              className="space-y-4 sm:space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {/* Student Name */}
                <div>
                  <label className="block text-xs font-black text-[#0f1f5c] mb-1.5 uppercase tracking-wide">
                    Student Full Name <span className="text-pink-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="name"
                      value={student.name}
                      onChange={handleChange}
                      placeholder="e.g. Aarav Sharma"
                      className={`w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl border-2 text-sm font-bold transition-all outline-none ${
                        errors.name
                          ? 'border-pink-500 bg-pink-50/50'
                          : 'border-slate-200 bg-slate-50/70 focus:border-purple-600 focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-pink-600 text-xs font-bold mt-1">{errors.name}</p>}
                </div>

                {/* Email / mailId */}
                <div>
                  <label className="block text-xs font-black text-[#0f1f5c] mb-1.5 uppercase tracking-wide">
                    Student / Parent Email ID <span className="text-pink-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      name="mailId"
                      value={student.mailId}
                      onChange={handleChange}
                      placeholder="e.g. parent.name@gmail.com"
                      className={`w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl border-2 text-sm font-bold transition-all outline-none ${
                        errors.mailId
                          ? 'border-pink-500 bg-pink-50/50'
                          : 'border-slate-200 bg-slate-50/70 focus:border-purple-600 focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.mailId && <p className="text-pink-600 text-xs font-bold mt-1">{errors.mailId}</p>}
                </div>

                {/* Standard Dropdown */}
                <div>
                  <label className="block text-xs font-black text-[#0f1f5c] mb-1.5 uppercase tracking-wide">
                    Standard / Grade <span className="text-pink-500">*</span>
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <select
                      name="standard"
                      value={student.standard}
                      onChange={handleChange}
                      className={`w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl border-2 text-sm font-bold transition-all outline-none cursor-pointer ${
                        errors.standard
                          ? 'border-pink-500 bg-pink-50/50'
                          : 'border-slate-200 bg-slate-50/70 focus:border-purple-600 focus:bg-white'
                      }`}
                    >
                      <option value="">Select Standard (5th to 12th)</option>
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
                  {errors.standard && <p className="text-pink-600 text-xs font-bold mt-1">{errors.standard}</p>}
                </div>

                {/* School Name */}
                <div>
                  <label className="block text-xs font-black text-[#0f1f5c] mb-1.5 uppercase tracking-wide">
                    School Name <span className="text-pink-500">*</span>
                  </label>
                  <div className="relative">
                    <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="school"
                      value={student.school}
                      onChange={handleChange}
                      placeholder="e.g. KVS Matric Higher Secondary School"
                      className={`w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl border-2 text-sm font-bold transition-all outline-none ${
                        errors.school
                          ? 'border-pink-500 bg-pink-50/50'
                          : 'border-slate-200 bg-slate-50/70 focus:border-purple-600 focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.school && <p className="text-pink-600 text-xs font-bold mt-1">{errors.school}</p>}
                </div>

                {/* Father's Name */}
                <div>
                  <label className="block text-xs font-black text-[#0f1f5c] mb-1.5 uppercase tracking-wide">
                    Father's Name <span className="text-pink-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="fatherName"
                      value={student.fatherName}
                      onChange={handleChange}
                      placeholder="Father's full name"
                      className={`w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl border-2 text-sm font-bold transition-all outline-none ${
                        errors.fatherName
                          ? 'border-pink-500 bg-pink-50/50'
                          : 'border-slate-200 bg-slate-50/70 focus:border-purple-600 focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.fatherName && <p className="text-pink-600 text-xs font-bold mt-1">{errors.fatherName}</p>}
                </div>

                {/* Mother's Name */}
                <div>
                  <label className="block text-xs font-black text-[#0f1f5c] mb-1.5 uppercase tracking-wide">
                    Mother's Name <span className="text-pink-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="motherName"
                      value={student.motherName}
                      onChange={handleChange}
                      placeholder="Mother's full name"
                      className={`w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl border-2 text-sm font-bold transition-all outline-none ${
                        errors.motherName
                          ? 'border-pink-500 bg-pink-50/50'
                          : 'border-slate-200 bg-slate-50/70 focus:border-purple-600 focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.motherName && <p className="text-pink-600 text-xs font-bold mt-1">{errors.motherName}</p>}
                </div>

                {/* Father's Phone */}
                <div>
                  <label className="block text-xs font-black text-[#0f1f5c] mb-1.5 uppercase tracking-wide">
                    Father's Mobile Number <span className="text-pink-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      name="fatherPhone"
                      value={student.fatherPhone}
                      onChange={handleChange}
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      className={`w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl border-2 text-sm font-bold transition-all outline-none ${
                        errors.fatherPhone
                          ? 'border-pink-500 bg-pink-50/50'
                          : 'border-slate-200 bg-slate-50/70 focus:border-purple-600 focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.fatherPhone && <p className="text-pink-600 text-xs font-bold mt-1">{errors.fatherPhone}</p>}
                </div>

                {/* Mother's Phone */}
                <div>
                  <label className="block text-xs font-black text-[#0f1f5c] mb-1.5 uppercase tracking-wide">
                    Mother's Mobile Number <span className="text-pink-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      name="motherPhone"
                      value={student.motherPhone}
                      onChange={handleChange}
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      className={`w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl border-2 text-sm font-bold transition-all outline-none ${
                        errors.motherPhone
                          ? 'border-pink-500 bg-pink-50/50'
                          : 'border-slate-200 bg-slate-50/70 focus:border-purple-600 focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.motherPhone && <p className="text-pink-600 text-xs font-bold mt-1">{errors.motherPhone}</p>}
                </div>

                {/* Residential Address */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-[#0f1f5c] mb-1.5 uppercase tracking-wide">
                    Residential Address <span className="text-pink-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      name="address"
                      value={student.address}
                      onChange={handleChange}
                      placeholder="Door no, Street name, Area, City, Pincode"
                      className={`w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl border-2 text-sm font-bold transition-all outline-none ${
                        errors.address
                          ? 'border-pink-500 bg-pink-50/50'
                          : 'border-slate-200 bg-slate-50/70 focus:border-purple-600 focus:bg-white'
                      }`}
                    />
                  </div>
                  {errors.address && <p className="text-pink-600 text-xs font-bold mt-1">{errors.address}</p>}
                </div>
              </div>

              {Object.keys(errors).length > 0 && (
                <div className="p-3.5 rounded-xl bg-pink-50 border-2 border-pink-200 text-pink-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Please correct the highlighted fields before proceeding.</span>
                </div>
              )}

              <div className="flex justify-end pt-3 sm:pt-4">
                <button
                  type="submit"
                  style={{ background: 'linear-gradient(90deg, #ff7a1a, #ff3d8b, #7b4dff)' }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-black text-sm px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-102 transition-all cursor-pointer"
                >
                  <span>Next — Choose Fee Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </section>
        )}

        {/* STEP 2: COURSE & FEE PLANS */}
        {step === 2 && (
          <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border-2 border-[#e6decf] shadow-lg transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 sm:pb-5 mb-5 sm:mb-6">
              <div>
                <div className="flex items-center gap-2 text-xl sm:text-3xl font-black text-[#0f1f5c]">
                  <span>🎯</span>
                  <span>AI Explorer Fee Plan</span>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-1">
                  Step 02 of 03 — Select your preferred tuition payment schedule.
                </p>
              </div>
              <div className="px-3 py-1 rounded-xl bg-[#0f1f5c] text-white font-mono text-xs font-bold shrink-0">
                02 / 03
              </div>
            </div>

            {/* AI Explorer Course Spotlight Card */}
            <div
              style={{ background: 'linear-gradient(135deg, #0f1f5c 0%, #1846c4 60%, #7b4dff 100%)' }}
              className="p-5 sm:p-6 rounded-2xl text-white shadow-md relative overflow-hidden mb-6 sm:mb-8"
            >
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl sm:text-3xl shadow-inner shrink-0">
                    🤖
                  </div>
                  <div>
                    <div className="text-lg sm:text-2xl font-black tracking-wide">AI Explorer Program</div>
                    <div className="text-white/90 text-[11px] sm:text-xs font-bold mt-0.5">
                      WeGrow Skill Campus &amp; B School • Artificial Intelligence &amp; Robotics for Grades 5 – 12
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="text-[9px] sm:text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-black">
                        🧠 ML Basics
                      </span>
                      <span className="text-[9px] sm:text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-black">
                        💬 Chatbots
                      </span>
                      <span className="text-[9px] sm:text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-black">
                        👁️ Computer Vision
                      </span>
                      <span className="text-[9px] sm:text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-black">
                        🎮 AI Games
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-400 text-slate-900 font-black text-xs px-3.5 py-1.5 rounded-xl text-center self-start md:self-auto shadow-sm">
                  Active Batch
                </div>
              </div>
            </div>

            {/* Plan Selector Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-6">
              {Object.values(PLANS).map((p) => {
                const isSelected = selectedPlan === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`relative p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 shadow-md scale-101'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        style={{ backgroundColor: isSelected ? p.badgeBg : '#f1f5f9', color: isSelected ? '#fff' : '#475569' }}
                        className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-2xs"
                      >
                        {p.tag}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#0f1f5c]">{p.name}</h3>
                      <p className="text-slate-500 text-xs font-bold mt-1 leading-relaxed">{p.desc}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 mt-4">
                      <div className="text-2xl sm:text-3xl font-black text-[#0f1f5c]">
                        {p.label}
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-extrabold text-slate-500 mt-0.5">{p.cycles}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Half-yearly breakdown detail box if Half-Yearly is chosen */}
            {selectedPlan === 'half' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-50/90 via-indigo-50/60 to-purple-50/90 border-2 border-purple-300 shadow-xs mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                  <div className="text-xs font-black text-purple-950 flex items-center gap-1.5 uppercase tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                    <span>Choose Installment to Pay Now:</span>
                  </div>
                  <div className="text-[11px] font-bold text-purple-700">
                    Click to choose 1st Half or 2nd Half
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {HALF_OPTIONS.map((halfItem) => {
                    const isHalfSelected = selectedHalf === halfItem.id;
                    return (
                      <button
                        type="button"
                        key={halfItem.id}
                        onClick={() => setSelectedHalf(halfItem.id)}
                        className={`relative p-3.5 sm:p-4 rounded-xl text-left border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isHalfSelected
                            ? 'bg-white border-purple-600 shadow-md ring-2 ring-purple-300 scale-101'
                            : 'bg-white/80 hover:bg-white border-purple-200 hover:border-purple-300 opacity-85 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isHalfSelected ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isHalfSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-black text-[#0f1f5c]">{halfItem.label}</div>
                            <div className="text-[10px] sm:text-[11px] font-bold text-slate-500">{halfItem.desc}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm sm:text-base font-black text-purple-700">₹{halfItem.amount.toLocaleString('en-IN')}</div>
                          {isHalfSelected && (
                            <span className="text-[9px] font-black uppercase text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                              Selected
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Term breakdown detail box if Term Wise is chosen */}
            {selectedPlan === 'term' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-blue-50/90 border-2 border-blue-300 shadow-xs mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                  <div className="text-xs font-black text-blue-950 flex items-center gap-1.5 uppercase tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span>Choose Term to Pay Now:</span>
                  </div>
                  <div className="text-[11px] font-bold text-blue-700">
                    Click an option below (Term I, II, or III)
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {TERM_OPTIONS.map((termItem) => {
                    const isTermSelected = selectedTerm === termItem.id;
                    return (
                      <button
                        type="button"
                        key={termItem.id}
                        onClick={() => setSelectedTerm(termItem.id)}
                        className={`relative p-3.5 sm:p-4 rounded-xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isTermSelected
                            ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-300 scale-101'
                            : 'bg-white/80 hover:bg-white border-blue-200 hover:border-blue-300 opacity-85 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isTermSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isTermSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              isTermSelected
                                ? 'bg-blue-600 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {isTermSelected ? 'Selected' : 'Term'}
                          </span>
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-black text-[#0f1f5c]">{termItem.label}</div>
                          <div className="text-base sm:text-lg font-black text-blue-700 mt-0.5">
                            ₹{termItem.amount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 mt-0.5">
                            {termItem.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Declaration Checkbox */}
            <label className="flex items-start gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-purple-50 border-2 border-dashed border-purple-300 cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={isDeclared}
                onChange={(e) => setIsDeclared(e.target.checked)}
                className="w-5 h-5 rounded-md accent-purple-600 mt-0.5 cursor-pointer shrink-0"
              />
              <span className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
                I confirm that the student details provided for <strong className="text-[#0f1f5c]">{student.name}</strong> ({student.standard}) are accurate, and I agree to the selected{' '}
                <strong className="text-[#0f1f5c]">{getActivePayDetails().planName}</strong> fee plan and WeGrow Skill Campus &amp; B School enrollment terms.
              </span>
            </label>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm px-6 py-3.5 rounded-2xl transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNextToStep3}
                disabled={!isDeclared}
                style={{ background: isDeclared ? 'linear-gradient(90deg, #ff7a1a, #ff3d8b, #7b4dff)' : '#94a3b8' }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-black text-sm px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-102 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 3: SECURE PAYMENT */}
        {step === 3 && (
          <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border-2 border-[#e6decf] shadow-lg transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 sm:pb-5 mb-5 sm:mb-6">
              <div>
                <div className="flex items-center gap-2 text-xl sm:text-3xl font-black text-[#0f1f5c]">
                  <span>🔐</span>
                  <span>Review &amp; Secure Payment</span>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-1">
                  Step 03 of 03 — Final step to confirm student seat in AI Explorer.
                </p>
              </div>
              <div className="px-3 py-1 rounded-xl bg-[#0f1f5c] text-white font-mono text-xs font-bold shrink-0">
                03 / 03
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* Left Column: Summary */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-xs sm:text-sm font-black text-[#0f1f5c] uppercase tracking-wider">
                  Enrollment Summary
                </h3>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#faf8f5] border-2 border-[#e8dfcf] space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">Student Name</span>
                    <span className="font-extrabold text-[#0f1f5c]">{student.name}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">Email ID</span>
                    <span className="font-extrabold text-[#0f1f5c]">{student.mailId}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">Standard</span>
                    <span className="font-extrabold text-[#0f1f5c]">{student.standard}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">School</span>
                    <span className="font-extrabold text-[#0f1f5c] text-right max-w-[180px] sm:max-w-[200px] truncate">
                      {student.school}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">Father's Contact</span>
                    <span className="font-extrabold text-[#0f1f5c]">
                      {student.fatherName} ({student.fatherPhone})
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">Course</span>
                    <span className="font-extrabold text-purple-700">AI Explorer</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">Selected Plan</span>
                    <span className="font-extrabold text-emerald-700">{getActivePayDetails().planName}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">Total Annual Fee</span>
                    <span className="font-bold text-[#0f1f5c]">₹{getActivePayDetails().totalFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Now Payable</span>
                    <span className="font-black text-purple-700">
                      ₹{getActivePayDetails().amount?.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] text-slate-500 font-semibold">
                        ({getActivePayDetails().tag})
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Payment Options */}
              <div className="lg:col-span-6 space-y-4 sm:space-y-5">
                <h3 className="text-xs sm:text-sm font-black text-[#0f1f5c] uppercase tracking-wider">
                  Payment Method
                </h3>

                {/* Single Verified Online Payment Method */}
                <div className="p-3.5 sm:p-4 rounded-2xl border-2 border-purple-600 bg-purple-50/70 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl">⚡</span>
                    <div>
                      <div className="font-black text-xs sm:text-sm text-[#0f1f5c]">Cashfree Online Checkout</div>
                      <div className="text-[10px] sm:text-[11px] font-bold text-slate-500">Instant UPI, Cards &amp; NetBanking</div>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                {/* Amount To Pay Hero Banner */}
                <div
                  style={{ background: 'linear-gradient(135deg, #0f1f5c 0%, #1846c4 100%)' }}
                  className="p-4 sm:p-5 rounded-2xl text-white shadow-md"
                >
                  <div className="text-[11px] sm:text-xs font-bold text-white/80 uppercase tracking-wider">
                    {getActivePayDetails().dueDesc}
                  </div>
                  <div className="text-2xl sm:text-4xl font-black mt-1">
                    ₹{getActivePayDetails().amount?.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-white/70 font-semibold mt-1">
                    {selectedPlan === 'term'
                      ? `Total Annual Fee: ₹45,000 (${getActivePayDetails().subLabel} chosen • other terms payable in subsequent terms)`
                      : selectedPlan === 'half'
                      ? `Total Annual Fee: ₹45,000 (${getActivePayDetails().subLabel} chosen • other installment payable bi-annually)`
                      : '100% Secure Transaction via WeGrow Connect'}
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  type="button"
                  onClick={handlePaymentAndEnroll}
                  disabled={isProcessing}
                  style={{ background: 'linear-gradient(90deg, #ff7a1a, #ff3d8b, #7b4dff)' }}
                  className="w-full h-12 sm:h-14 rounded-2xl text-white font-black text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-101 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span>
                      Pay {getActivePayDetails().subLabel} ₹{getActivePayDetails().amount.toLocaleString('en-IN')} &amp; Complete Enrollment 🎉
                    </span>
                  )}
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-xs cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Fee Plans</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* STEP 4: DIGITAL ENROLLMENT CONFIRMATION */}
        {step === 4 && completedEnrollment && (
          <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border-2 border-emerald-300 shadow-xl transition-all print:p-0 print:border-none print:shadow-none print:bg-transparent">
            {/* Top Congratulatory Header (Screen Only) */}
            <div className="print:hidden text-center max-w-xl mx-auto mb-6 sm:mb-8">
              <div
                style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)' }}
                className="w-14 sm:w-16 h-14 sm:h-16 rounded-full text-white flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-3 shadow-md animate-bounce"
              >
                ✓
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-[#0f1f5c]">
                Enrollment Successful! 🎉
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm font-semibold mt-1">
                Welcome aboard, future AI Explorer! Your student seat is confirmed with WeGrow Skill Campus &amp; B School.
              </p>
            </div>

            {/* Official Confirmation / Print Receipt Card */}
            <div className="print-receipt-card max-w-2xl mx-auto bg-gradient-to-b from-white to-[#faf8f5] rounded-2xl sm:rounded-3xl border-2 border-purple-300 shadow-lg overflow-hidden mb-6 relative print:border-2 print:border-[#0f1f5c] print:rounded-2xl print:bg-white print:p-5 print:mb-0">
              {/* Header */}
              <div
                style={{ background: 'linear-gradient(135deg, #0f1f5c 0%, #1846c4 60%, #7b4dff 100%)' }}
                className="text-white p-4 sm:p-5 text-center relative print:!bg-[#0f1f5c] print:!text-white print:p-4 print:rounded-xl"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="bg-white p-1.5 rounded-lg shrink-0">
                      <img
                        src="/wegrow&Bschool.webp"
                        alt="WeGrow"
                        className="h-8 w-auto object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/logo.webp';
                        }}
                      />
                    </div>
                    <div>
                      <div className="font-black text-sm sm:text-base leading-tight">WeGrow Skill Campus &amp; B School</div>
                      <div className="text-[10px] text-white/80 font-bold">Empowering Young Innovators • Sivakasi</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[9px] sm:text-[10px] font-black tracking-widest text-amber-300 uppercase">
                      OFFICIAL ADMISSION RECEIPT
                    </div>
                    <div className="text-xs sm:text-sm font-black font-mono mt-0.5">
                      {completedEnrollment.id}
                    </div>
                  </div>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="p-4 sm:p-6 space-y-4 print:p-3 print:space-y-3">
                {/* Thank You Message Box (Screen Only) */}
                <div className="print:hidden p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border-2 border-purple-200 text-center space-y-1.5 shadow-2xs">
                  <div className="text-sm sm:text-base font-black text-purple-900 flex items-center justify-center gap-1.5">
                    <span>✨</span>
                    <span>Thank you for creating your enrollment!</span>
                    <span>✨</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                    We are thrilled to welcome <strong className="text-[#0f1f5c]">{completedEnrollment.studentName}</strong> to the AI Explorer Program. Our academic team will connect with you on <strong className="text-purple-700">{completedEnrollment.fatherPhone || completedEnrollment.motherPhone}</strong> regarding batch schedule, curriculum, and practical lab access.
                  </p>
                </div>

                {/* Subheader Status Strip */}
                <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs">
                  <div>
                    <span className="text-slate-500 font-bold">Program: </span>
                    <strong className="text-purple-900 font-black">AI Explorer Course (Grades 5 – 12)</strong>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black text-[10px] uppercase tracking-wider shrink-0">
                    ✓ Paid &amp; Confirmed
                  </span>
                </div>

                {/* Student & Parent Details Grid */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-slate-200 space-y-3 print:p-3.5 print:border print:border-slate-300">
                  <h3 className="text-xs font-black text-[#0f1f5c] uppercase tracking-wider border-b border-slate-100 pb-1.5 print:text-[11px]">
                    Student &amp; Parent Details
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs print:text-[11px] print:gap-2">
                    {/* Left Column */}
                    <div className="space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-2">
                        <span className="text-slate-500 font-bold min-w-[90px]">Student Name:</span>
                        <span className="font-black text-[#0f1f5c]">{completedEnrollment.studentName}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-2">
                        <span className="text-slate-500 font-bold min-w-[90px]">Standard / Grade:</span>
                        <span className="font-black text-purple-700">{completedEnrollment.standard}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-2">
                        <span className="text-slate-500 font-bold min-w-[90px]">School:</span>
                        <span className="font-bold text-[#0f1f5c]">{completedEnrollment.school}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-2">
                        <span className="text-slate-500 font-bold min-w-[90px]">Email ID:</span>
                        <span className="font-bold text-[#0f1f5c]">{completedEnrollment.mailId || completedEnrollment.email || '—'}</span>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-2">
                        <span className="text-slate-500 font-bold min-w-[90px]">Father's Contact:</span>
                        <span className="font-bold text-[#0f1f5c]">
                          {completedEnrollment.fatherName} ({completedEnrollment.fatherPhone})
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-2">
                        <span className="text-slate-500 font-bold min-w-[90px]">Mother's Contact:</span>
                        <span className="font-bold text-[#0f1f5c]">
                          {completedEnrollment.motherName} ({completedEnrollment.motherPhone})
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-2">
                        <span className="text-slate-500 font-bold min-w-[90px]">Fee Plan:</span>
                        <span className="font-black text-[#0f1f5c]">
                          {completedEnrollment.planName || completedEnrollment.plan || 'Full Payment'}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-2">
                        <span className="text-slate-500 font-bold min-w-[90px]">Amount Paid:</span>
                        <span className="font-black text-emerald-700">
                          ₹{Number(completedEnrollment.amount).toLocaleString('en-IN')} (PAID)
                        </span>
                      </div>
                    </div>

                    {completedEnrollment.address && (
                      <div className="col-span-2 pt-2 border-t border-slate-100 flex items-start gap-2">
                        <span className="text-slate-500 font-bold min-w-[90px]">Address:</span>
                        <span className="font-semibold text-slate-700">{completedEnrollment.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification & Signatory Strip */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs print:p-2.5">
                  <div className="flex items-center gap-2.5">
                    {qrCodeUrl ? (
                      <img src={qrCodeUrl} alt="QR Verification" className="w-14 h-14 object-contain rounded-md border border-slate-300 shrink-0" />
                    ) : (
                      <div className="w-14 h-14 bg-purple-100 rounded-md flex items-center justify-center text-xl shrink-0">🎓</div>
                    )}
                    <div>
                      <div className="font-black text-[#0f1f5c] text-[11px]">Officially Verified Admission</div>
                      <div className="text-[10px] text-slate-500">Scan QR to verify student admission status</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-black text-purple-900">WeGrow Skill Campus &amp; B School</div>
                    <div className="text-[9px] text-slate-500 font-bold">Authorized Signatory</div>
                    <div className="text-[9px] text-emerald-700 font-black mt-0.5">SEAL VERIFIED ✓</div>
                  </div>
                </div>

                {/* Support Helpline Box (Screen Only) */}
                <div className="print:hidden p-3.5 sm:p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💬</span>
                    <div>
                      <div className="font-black text-slate-900">If any doubts or queries?</div>
                      <div className="text-slate-600 font-semibold">Our admission team is here to assist you.</div>
                    </div>
                  </div>
                  <a
                    href="tel:+919344337331"
                    className="inline-flex items-center gap-1.5 bg-[#0f1f5c] hover:bg-purple-900 text-white font-black px-4 py-2 rounded-xl transition-all shadow-2xs whitespace-nowrap"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-300" />
                    <span>+91 93443 37331</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Actions (Screen Only) */}
            <div className="print:hidden flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>

              <a
                href="tel:+919344337331"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-xs text-center"
              >
                <Phone className="w-4 h-4" />
                <span>Contact Admissions (+91 93443 37331)</span>
              </a>

              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-xs text-center"
              >
                <span>Back to Home</span>
              </Link>
            </div>
          </section>
        )}
      </main>

      {/* Footer with Helpline on all pages */}
      <footer className="print:hidden text-center py-6 sm:py-8 px-4 text-xs font-bold text-[#5f6a8a] border-t border-[#e8dfcf] bg-white/70 space-y-2">
        <div>
          If any doubts or queries? Contact:{' '}
          <a href="tel:+919344337331" className="text-purple-700 font-black underline underline-offset-2">
            +91 93443 37331
          </a>
        </div>
        <div>
          Made with 💜 by <strong>WeGrow Skill Campus &amp; B School</strong> • Empowering young innovators
        </div>
      </footer>
    </div>
  );
}
