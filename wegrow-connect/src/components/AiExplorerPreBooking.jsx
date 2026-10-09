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
  Plus,
  Trash2,
  Users,
  Calendar,
  Ticket,
  Clock,
  Sparkle
} from 'lucide-react';
import { aiExplorerApi } from '../services/aiExplorerApi';
import { singAlongApi } from '../services/singAlongApi';

const PREBOOKING_TOKEN_AMOUNT = 1000;

export default function AiExplorerPreBooking() {
  const [step, setStep] = useState(1);

  // Common Parent Information
  const [parent, setParent] = useState({
    fatherName: '',
    motherName: '',
    fatherPhone: '',
    motherPhone: '',
    email: '',
    address: '',
  });

  // Dynamic Array of Students (Family Members / Children)
  const [students, setStudents] = useState([
    {
      id: 1,
      name: '',
      standard: '',
      school: '',
      preferredBatch: 'Weekend Batch (Sat & Sun)',
    },
  ]);

  const [errors, setErrors] = useState({});
  const [isDeclared, setIsDeclared] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cashfree');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedPreBooking, setCompletedPreBooking] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const formTopRef = useRef(null);

  const totalAmount = students.length * PREBOOKING_TOKEN_AMOUNT;

  // Generate QR Code upon successful pre-booking
  useEffect(() => {
    if (completedPreBooking) {
      const qrPayload = JSON.stringify({
        id: completedPreBooking.id,
        bookingType: 'AI_EXPLORER_PRE_BOOKING',
        studentCount: completedPreBooking.studentCount || completedPreBooking.students?.length || 1,
        students: completedPreBooking.studentName,
        parentPhone: completedPreBooking.fatherPhone || completedPreBooking.motherPhone,
        amount: completedPreBooking.amount,
        status: completedPreBooking.paymentStatus,
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
  }, [completedPreBooking]);

  // Handle Parent Input Change
  const handleParentChange = (e) => {
    const { name, value } = e.target;
    if (name === 'fatherPhone' || name === 'motherPhone') {
      const clean = value.replace(/\D/g, '').slice(0, 10);
      setParent((prev) => {
        const updated = { ...prev, [name]: clean };
        if (
          updated.fatherPhone &&
          updated.motherPhone &&
          updated.fatherPhone === updated.motherPhone &&
          updated.fatherPhone.length === 10
        ) {
          setErrors((errs) => ({
            ...errs,
            motherPhone: "Father's phone number and Mother's phone number cannot be the same. Please provide an alternate contact number.",
          }));
        } else if (errors.motherPhone?.includes('cannot be the same')) {
          setErrors((errs) => ({ ...errs, motherPhone: '' }));
        }
        return updated;
      });
    } else {
      setParent((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name] && !errors[name]?.includes('cannot be the same')) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle Student Input Change
  const handleStudentChange = (index, field, value) => {
    setStudents((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });

    const errorKey = `student_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: '' }));
    }
  };

  // Add Another Student / Child
  const handleAddStudent = () => {
    if (students.length >= 6) {
      toast.error('Maximum 6 students can be added in a single pre-booking.');
      return;
    }
    const newId = Date.now();
    setStudents((prev) => [
      ...prev,
      {
        id: newId,
        name: '',
        standard: '',
        school: '',
        preferredBatch: 'Weekend Batch (Sat & Sun)',
      },
    ]);
    toast.success(`Child ${students.length + 1} added! Pre-booking total updated to ₹${(students.length + 1) * PREBOOKING_TOKEN_AMOUNT}.`);
  };

  // Remove a Student
  const handleRemoveStudent = (index) => {
    if (students.length <= 1) {
      toast.error('At least 1 student is required for pre-booking.');
      return;
    }
    setStudents((prev) => prev.filter((_, i) => i !== index));
    toast.info(`Student removed. Updated total: ₹${(students.length - 1) * PREBOOKING_TOKEN_AMOUNT}.`);
  };

  // Validate Step 1
  const validateStep1 = () => {
    const errs = {};

    // Validate Parents
    if (!parent.fatherName.trim()) errs.fatherName = "Father's name is required";
    if (!parent.fatherPhone.trim()) {
      errs.fatherPhone = "Father's phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(parent.fatherPhone.trim())) {
      errs.fatherPhone = 'Enter a valid 10-digit mobile number';
    }

    if (!parent.motherPhone.trim()) {
      errs.motherPhone = "Mother's phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(parent.motherPhone.trim())) {
      errs.motherPhone = 'Enter a valid 10-digit mobile number';
    }

    if (
      parent.fatherPhone.trim() &&
      parent.motherPhone.trim() &&
      parent.fatherPhone.trim() === parent.motherPhone.trim()
    ) {
      errs.motherPhone = "Father's phone number and Mother's phone number cannot be the same. Please provide an alternate contact number.";
    }

    if (!parent.motherName.trim()) errs.motherName = "Mother's name is required";

    if (!parent.email.trim()) {
      errs.email = 'Family Email ID is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parent.email.trim())) {
      errs.email = 'Enter a valid email address';
    }

    if (!parent.address.trim()) errs.address = 'Residential address is required';

    // Validate Each Student
    students.forEach((s, idx) => {
      if (!s.name.trim()) errs[`student_${idx}_name`] = `Student #${idx + 1} name is required`;
      if (!s.standard) errs[`student_${idx}_standard`] = `Please select student #${idx + 1} standard`;
      if (!s.school.trim()) errs[`student_${idx}_school`] = `School name for student #${idx + 1} is required`;
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextToStep2 = () => {
    if (!validateStep1()) {
      toast.error('Please fill all required student and parent fields.');
      return;
    }
    setStep(2);
    scrollToSection();
  };

  const handleNextToStep3 = () => {
    if (!isDeclared) {
      toast.error('Please agree to the pre-booking terms & seat reservation policy.');
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

  // Process Final Payment & Pre-Booking
  const [pendingOrder, setPendingOrder] = useState(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  // Build Payload Helper
  const buildPreBookingPayload = (orderId = '') => {
    return {
      students: students.map((s) => ({
        studentName: s.name.trim(),
        standard: s.standard,
        school: s.school.trim(),
        preferredBatch: s.preferredBatch,
      })),
      studentCount: students.length,
      totalStudents: students.length,
      fatherName: parent.fatherName.trim(),
      motherName: parent.motherName.trim(),
      fatherPhone: parent.fatherPhone.trim(),
      motherPhone: parent.motherPhone.trim(),
      email: parent.email.trim(),
      mailId: parent.email.trim(),
      address: parent.address.trim(),
      paymentMethod,
      amount: totalAmount,
      transactionId: orderId || `ORD_${Date.now().toString().slice(-8)}`,
      paymentStatus: 'PAID',
    };
  };

  // Verify Payment Status with Backend Gateway
  const verifyAndSubmitPreBooking = async (orderId, basePayload) => {
    setIsVerifyingPayment(true);
    try {
      const statusRes = await singAlongApi.checkPaymentStatus(orderId).catch(() => null);
      const isSuccess =
        statusRes?.isPaid === true ||
        statusRes?.status === 'SUCCESS' ||
        statusRes?.data?.isPaid === true ||
        statusRes?.data?.status === 'SUCCESS' ||
        (statusRes?.success && (statusRes?.data?.isPaid || statusRes?.data?.status === 'SUCCESS'));

      if (isSuccess) {
        const payloadToSubmit = {
          ...(basePayload || buildPreBookingPayload(orderId)),
          transactionId: orderId,
          paymentStatus: 'PAID',
          paymentMethod: 'Cashfree',
        };

        const response = await aiExplorerApi.enrollPreBooking(payloadToSubmit);
        if (response?.success) {
          setCompletedPreBooking(response.data);
          setPendingOrder(null);
          setStep(4);
          toast.success(`🎉 Payment verified! Pre-booking confirmed for ${students.length} student${students.length > 1 ? 's' : ''}!`, { id: 'prebook-pay' });
          scrollToSection();
          return true;
        } else {
          throw new Error(response?.message || 'Failed to save pre-booking details in database.');
        }
      } else {
        const rawStatus = statusRes?.status || statusRes?.data?.status || 'PENDING';
        setPendingOrder({
          orderId,
          status: rawStatus,
          message: `Payment status is ${rawStatus}. If amount was deducted from your account, click "Verify Payment Status".`,
        });
        toast.error(`⚠️ Payment status: ${rawStatus}. Payment was not completed or is pending.`, { id: 'prebook-pay' });
        return false;
      }
    } catch (err) {
      toast.error(err.message || 'Payment verification failed.', { id: 'prebook-pay' });
      return false;
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  // Process Final Payment & Pre-Booking
  const handlePaymentAndPreBook = async () => {
    setIsProcessing(true);
    const preBookingPayload = buildPreBookingPayload();

    try {
      if (paymentMethod === 'Cashfree') {
        const pgRes = await aiExplorerApi.createPreBookingOrder(preBookingPayload);
        if (!pgRes?.success || !pgRes?.data?.paymentSessionId) {
          throw new Error(pgRes?.message || 'Could not initiate payment session with Cashfree.');
        }

        const orderData = pgRes.data;
        const targetOrderId = orderData.orderId || orderData.order_id || `ORD_${Date.now()}`;
        setPendingOrder({
          orderId: targetOrderId,
          paymentSessionId: orderData.paymentSessionId,
          status: 'INITIATED',
        });

        if (typeof window !== 'undefined' && window.Cashfree) {
          toast.success('Opening Cashfree Checkout...');
          const cashfree = window.Cashfree({
            mode: (orderData.environment?.toLowerCase() === 'sandbox' || orderData.environment?.toLowerCase() === 'test')
              ? 'sandbox'
              : 'production',
          });

          await cashfree.checkout({
            paymentSessionId: orderData.paymentSessionId,
            redirectTarget: '_modal',
          });

          // After modal closes, verify with backend gateway
          toast.loading('Verifying payment with gateway...', { id: 'prebook-pay' });
          await new Promise((r) => setTimeout(r, 1200));
          await verifyAndSubmitPreBooking(targetOrderId, preBookingPayload);
        } else if (orderData.paymentLink) {
          window.location.href = orderData.paymentLink;
        } else {
          throw new Error('Cashfree checkout modal could not be loaded.');
        }
      } else {
        const response = await aiExplorerApi.enrollPreBooking(preBookingPayload);
        if (response?.success) {
          setCompletedPreBooking(response.data);
          setStep(4);
          toast.success(`🎉 Pre-booking registered successfully!`);
          scrollToSection();
        } else {
          throw new Error(response?.message || 'Pre-booking registration failed.');
        }
      }
    } catch (error) {
      toast.error(error.message || 'Payment processing failed. Please try again.', { id: 'prebook-pay' });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    toast.success('Pre-booking ID copied!');
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

      {/* Top Query / Doubt Helpline Strip */}
      <div className="print:hidden bg-gradient-to-r from-[#0f1f5c] via-[#1b2a6e] to-[#7b4dff] text-white py-1.5 sm:py-2 px-3 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-center text-xs font-bold">
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span className="bg-amber-400 text-slate-900 text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              Pre-Booking Helpline
            </span>
            <span className="text-[11px] sm:text-xs">Questions about AI Explorer Pre-Booking?</span>
            <a
              href="tel:+919344337331"
              className="inline-flex items-center gap-1 text-amber-300 hover:text-white font-black underline underline-offset-2 text-[11px] sm:text-xs whitespace-nowrap"
            >
              <Phone className="w-3 h-3 text-amber-300 shrink-0" />
              <span>+91 93443 37331</span>
            </a>
            <span className="text-white/40 hidden sm:inline">•</span>
            <a
              href="https://wa.me/919344337331?text=Hi%20WeGrow,%20I%20have%20a%20query%20regarding%20AI%20Explorer%20pre-booking"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-300 hover:text-white px-2 py-0.5 rounded-md font-black border border-emerald-500/40 text-[10px] sm:text-[11px] whitespace-nowrap"
            >
              <span>💬 WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Background Ambient Glows */}
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

          {/* Stepper Progress */}
          <div className="hidden lg:flex items-center gap-2 bg-white/80 p-1.5 rounded-full border border-[#e2dacb] shadow-2xs">
            {[
              { num: 1, label: 'Student(s) & Parents' },
              { num: 2, label: 'Review Pre-Booking' },
              { num: 3, label: 'Payment' },
            ].map((s) => (
              <React.Fragment key={s.num}>
                <div
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black transition-all ${
                    step >= s.num ? 'bg-[#7b4dff] text-white shadow-xs' : 'text-slate-500'
                  }`}
                  style={step >= s.num ? { background: 'linear-gradient(90deg, #7b4dff, #1846c4)' } : {}}
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
            <Link
              to="/ai-explorer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-[#f3ede3] px-3.5 py-2 rounded-xl border border-[#ded5c4] shadow-2xs transition-all"
            >
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>Full Enrollment</span>
            </Link>

            <button
              onClick={() => {
                if (step !== 1) setStep(1);
                scrollToSection();
              }}
              style={{ background: 'linear-gradient(90deg, #ff7a1a, #ff3d8b)' }}
              className="inline-flex items-center justify-center gap-1.5 text-white font-black text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Pre-Book Seat (₹1,000)</span>
            </button>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="lg:hidden flex items-center justify-between px-3 sm:px-4 py-2 bg-white/80 border-t border-[#ede6d8] text-[11px] font-black text-slate-700">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="truncate">
              Step {step} of 3: {step === 1 ? 'Students & Parents' : step === 2 ? 'Review & Terms' : 'Payment'}
            </span>
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
        {/* Pre-booking Spotlight Value Strip */}
        <div className="print:hidden grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mb-8 sm:mb-10">
          {[
            { icon: '🎟️', title: '₹1,000 Token', desc: 'Adjusted in total fee', border: 'border-[#ffedd5]', bg: 'bg-[#fff7ed]' },
            { icon: '👨‍👩‍👧‍👦', title: 'Multi-Child Ready', desc: 'Add 2 or 3 kids', border: 'border-[#ede9fe]', bg: 'bg-[#faf5ff]' },
            { icon: '⭐', title: 'Seat Guaranteed', desc: 'Priority batch slot', border: 'border-[#e0f2fe]', bg: 'bg-[#f0f9ff]' },
            { icon: '🎁', title: 'Early Starter Kit', desc: 'Bonus AI materials', border: 'border-[#dcfce7]', bg: 'bg-[#f0fdf4]' },
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

        {/* STEP 1: MULTI-STUDENT + PARENT FORM */}
        {step === 1 && (
          <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border-2 border-[#e6decf] shadow-lg transition-all">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 sm:pb-5 mb-6 gap-3">
              <div>
                <div className="flex items-center gap-2 text-xl sm:text-3xl font-black text-[#0f1f5c]">
                  <span>🚀</span>
                  <span>AI Explorer Seat Pre-Booking</span>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-1">
                  Reserve student seats with ₹1,000 token fee per child. Add multiple children below if needed!
                </p>
              </div>

              {/* Dynamic Live Price Badge */}
              <div className="flex items-center gap-2.5 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 px-4 py-2 rounded-2xl shadow-2xs self-start sm:self-auto">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm">
                  {students.length}
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    {students.length} {students.length === 1 ? 'Seat' : 'Seats'} Selected
                  </div>
                  <div className="text-sm sm:text-base font-black text-purple-900">
                    Total: ₹{totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNextToStep2();
              }}
              className="space-y-6 sm:space-y-8"
            >
              {/* SECTION A: STUDENT(S) DETAILS WITH DYNAMIC ADD BUTTON */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm sm:text-base font-black text-[#0f1f5c] uppercase tracking-wide">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Student(s) Enrolling for AI Explorer</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    ₹1,000 per student
                  </span>
                </div>

                {/* List of Student Form Cards */}
                <div className="space-y-4">
                  {students.map((student, idx) => (
                    <div
                      key={student.id}
                      className="p-4 sm:p-6 rounded-2xl bg-[#FAF8F5] border-2 border-[#e6ded0] relative transition-all hover:border-purple-300"
                    >
                      {/* Card Top Title & Remove Option */}
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#0f1f5c] text-white flex items-center justify-center text-xs font-black">
                            {idx + 1}
                          </span>
                          <span className="font-black text-xs sm:text-sm text-[#0f1f5c]">
                            Child #{idx + 1} Details
                          </span>
                          <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                            ₹1,000 Token Seat
                          </span>
                        </div>

                        {students.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStudent(idx)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-all cursor-pointer border border-red-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      {/* Student Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
                        {/* Student Name */}
                        <div>
                          <label className="block text-xs font-black text-[#0f1f5c] mb-1 uppercase tracking-wide">
                            Student Full Name <span className="text-pink-500">*</span>
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                            <input
                              type="text"
                              value={student.name}
                              onChange={(e) => handleStudentChange(idx, 'name', e.target.value)}
                              placeholder="e.g. Aarav Sharma"
                              className={`w-full h-11 pl-9 pr-3 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all outline-none ${
                                errors[`student_${idx}_name`]
                                  ? 'border-pink-500 bg-pink-50/50'
                                  : 'border-slate-200 bg-white focus:border-purple-600'
                              }`}
                            />
                          </div>
                          {errors[`student_${idx}_name`] && (
                            <p className="text-pink-600 text-[11px] font-bold mt-1">
                              {errors[`student_${idx}_name`]}
                            </p>
                          )}
                        </div>

                        {/* Standard */}
                        <div>
                          <label className="block text-xs font-black text-[#0f1f5c] mb-1 uppercase tracking-wide">
                            Standard / Grade <span className="text-pink-500">*</span>
                          </label>
                          <div className="relative">
                            <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                            <select
                              value={student.standard}
                              onChange={(e) => handleStudentChange(idx, 'standard', e.target.value)}
                              className={`w-full h-11 pl-9 pr-3 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all outline-none cursor-pointer ${
                                errors[`student_${idx}_standard`]
                                  ? 'border-pink-500 bg-pink-50/50'
                                  : 'border-slate-200 bg-white focus:border-purple-600'
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
                          {errors[`student_${idx}_standard`] && (
                            <p className="text-pink-600 text-[11px] font-bold mt-1">
                              {errors[`student_${idx}_standard`]}
                            </p>
                          )}
                        </div>

                        {/* School Name */}
                        <div>
                          <label className="block text-xs font-black text-[#0f1f5c] mb-1 uppercase tracking-wide">
                            School Name <span className="text-pink-500">*</span>
                          </label>
                          <div className="relative">
                            <School className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                            <input
                              type="text"
                              value={student.school}
                              onChange={(e) => handleStudentChange(idx, 'school', e.target.value)}
                              placeholder="e.g. KVS Matric School"
                              className={`w-full h-11 pl-9 pr-3 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all outline-none ${
                                errors[`student_${idx}_school`]
                                  ? 'border-pink-500 bg-pink-50/50'
                                  : 'border-slate-200 bg-white focus:border-purple-600'
                              }`}
                            />
                          </div>
                          {errors[`student_${idx}_school`] && (
                            <p className="text-pink-600 text-[11px] font-bold mt-1">
                              {errors[`student_${idx}_school`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Big Prominent "Add Another Student" Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleAddStudent}
                    className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-purple-400 hover:border-purple-600 bg-purple-50/70 hover:bg-purple-100/70 text-purple-900 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:scale-[1.01]"
                  >
                    <Plus className="w-4 h-4 stroke-[3] text-purple-700" />
                    <span>+ Add Another Child / Student (₹1,000 per seat)</span>
                  </button>
                </div>
              </div>

              {/* SECTION B: PARENT & CONTACT DETAILS */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm sm:text-base font-black text-[#0f1f5c] uppercase tracking-wide">
                  <User className="w-4 h-4 text-purple-600" />
                  <span>Parent &amp; Family Contact Details</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {/* Father's Name */}
                  <div>
                    <label className="block text-xs font-black text-[#0f1f5c] mb-1.5 uppercase tracking-wide">
                      Father's Full Name <span className="text-pink-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        name="fatherName"
                        value={parent.fatherName}
                        onChange={handleParentChange}
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
                        value={parent.fatherPhone}
                        onChange={handleParentChange}
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

                  {/* Mother's Name */}
                  <div>
                    <label className="block text-xs font-black text-[#0f1f5c] mb-1.5 uppercase tracking-wide">
                      Mother's Full Name <span className="text-pink-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        name="motherName"
                        value={parent.motherName}
                        onChange={handleParentChange}
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
                        value={parent.motherPhone}
                        onChange={handleParentChange}
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

                  {/* Family Email */}
                  <div>
                    <label className="block text-xs font-black text-[#0f1f5c] mb-1.5 uppercase tracking-wide">
                      Family / Parent Email ID <span className="text-pink-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        name="email"
                        value={parent.email}
                        onChange={handleParentChange}
                        placeholder="e.g. parent.family@gmail.com"
                        className={`w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl border-2 text-sm font-bold transition-all outline-none ${
                          errors.email
                            ? 'border-pink-500 bg-pink-50/50'
                            : 'border-slate-200 bg-slate-50/70 focus:border-purple-600 focus:bg-white'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-pink-600 text-xs font-bold mt-1">{errors.email}</p>}
                  </div>

                  {/* Residential Address */}
                  <div>
                    <label className="block text-xs font-black text-[#0f1f5c] mb-1.5 uppercase tracking-wide">
                      Residential Address <span className="text-pink-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        name="address"
                        value={parent.address}
                        onChange={handleParentChange}
                        placeholder="Door no, Street name, City, Pincode"
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
              </div>

              {Object.keys(errors).length > 0 && (
                <div className="p-3.5 rounded-xl bg-pink-50 border-2 border-pink-200 text-pink-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Please fill out all highlighted student and parent fields before continuing.</span>
                </div>
              )}

              {/* Submit to Step 2 */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
                <div className="text-xs sm:text-sm font-black text-slate-700">
                  Pre-booking token payable now:{' '}
                  <span className="text-purple-700 text-base sm:text-lg">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>{' '}
                  <span className="text-[11px] text-slate-500">
                    ({students.length} Student{students.length > 1 ? 's' : ''} × ₹1,000)
                  </span>
                </div>

                <button
                  type="submit"
                  style={{ background: 'linear-gradient(90deg, #ff7a1a, #ff3d8b, #7b4dff)' }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-black text-sm px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-102 transition-all cursor-pointer"
                >
                  <span>Next — Review Pre-Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </section>
        )}

        {/* STEP 2: REVIEW SUMMARY & PRE-BOOKING DECLARATION */}
        {step === 2 && (
          <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border-2 border-[#e6decf] shadow-lg transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 sm:pb-5 mb-5 sm:mb-6">
              <div>
                <div className="flex items-center gap-2 text-xl sm:text-3xl font-black text-[#0f1f5c]">
                  <span>📋</span>
                  <span>Review Pre-Booking Details</span>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-1">
                  Step 02 of 03 — Verify child seat allocation and enrollment declaration.
                </p>
              </div>
              <div className="px-3 py-1 rounded-xl bg-[#0f1f5c] text-white font-mono text-xs font-bold shrink-0">
                02 / 03
              </div>
            </div>

            {/* Pre-Booking Token Banner */}
            <div
              style={{ background: 'linear-gradient(135deg, #0f1f5c 0%, #1846c4 60%, #7b4dff 100%)' }}
              className="p-5 sm:p-6 rounded-2xl text-white shadow-md mb-6 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-300">
                    SEAT PRE-BOOKING TOKEN
                  </div>
                  <div className="text-xl sm:text-2xl font-black mt-1">
                    AI Explorer Course — {students.length} Student{students.length > 1 ? 's' : ''} Reserved
                  </div>
                  <div className="text-white/80 text-xs font-semibold mt-1">
                    Token amount of ₹1,000 per child will be adjusted in the final annual tuition fee.
                  </div>
                </div>

                <div className="text-right bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-2xl shrink-0 self-start sm:self-auto border border-white/30">
                  <div className="text-[10px] uppercase font-bold text-white/80">Token Payable Now</div>
                  <div className="text-2xl font-black text-amber-300">₹{totalAmount.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

            {/* List of Registered Children */}
            <div className="space-y-3 mb-6">
              <h3 className="text-xs font-black text-[#0f1f5c] uppercase tracking-wider">
                Enrolled Children ({students.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {students.map((st, i) => (
                  <div
                    key={st.id}
                    className="p-3.5 sm:p-4 rounded-xl bg-[#FAF8F5] border-2 border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-black text-xs sm:text-sm text-[#0f1f5c]">{st.name}</div>
                        <div className="text-[11px] font-bold text-slate-500">
                          {st.standard} • {st.school}
                        </div>
                      </div>
                    </div>
                    <span className="font-black text-xs text-purple-700 bg-purple-100 px-2.5 py-1 rounded-lg">
                      ₹1,000
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Declaration Checkbox */}
            <label className="flex items-start gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-purple-50 border-2 border-dashed border-purple-300 cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={isDeclared}
                onChange={(e) => setIsDeclared(e.target.checked)}
                className="w-5 h-5 rounded-md accent-purple-600 mt-0.5 cursor-pointer shrink-0"
              />
              <span className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
                I confirm that the details provided for{' '}
                <strong className="text-[#0f1f5c]">
                  {students.map((s) => s.name).filter(Boolean).join(', ')}
                </strong>{' '}
                are accurate. I agree to pay the pre-booking seat token of{' '}
                <strong className="text-purple-700">₹{totalAmount.toLocaleString('en-IN')}</strong> and abide by WeGrow Skill Campus &amp; B School admission guidelines.
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
                <span>Back to Edit Details</span>
              </button>

              <button
                type="button"
                onClick={handleNextToStep3}
                disabled={!isDeclared}
                style={{ background: isDeclared ? 'linear-gradient(90deg, #ff7a1a, #ff3d8b, #7b4dff)' : '#94a3b8' }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-black text-sm px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-102 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Proceed to Payment (₹{totalAmount.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* STEP 3: SECURE PAYMENT GATEWAY */}
        {step === 3 && (
          <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border-2 border-[#e6decf] shadow-lg transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 sm:pb-5 mb-5 sm:mb-6">
              <div>
                <div className="flex items-center gap-2 text-xl sm:text-3xl font-black text-[#0f1f5c]">
                  <span>🔐</span>
                  <span>Secure Payment Checkout</span>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-1">
                  Step 03 of 03 — Complete ₹{totalAmount.toLocaleString('en-IN')} token payment to lock student seat(s).
                </p>
              </div>
              <div className="px-3 py-1 rounded-xl bg-[#0f1f5c] text-white font-mono text-xs font-bold shrink-0">
                03 / 03
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* Summary Left Column */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-xs sm:text-sm font-black text-[#0f1f5c] uppercase tracking-wider">
                  Pre-Booking Order Summary
                </h3>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#faf8f5] border-2 border-[#e8dfcf] space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">Course</span>
                    <span className="font-extrabold text-purple-700">AI Explorer Program</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">Number of Students</span>
                    <span className="font-extrabold text-[#0f1f5c]">{students.length} Child(ren)</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">Student Name(s)</span>
                    <span className="font-extrabold text-[#0f1f5c] text-right max-w-[200px] truncate">
                      {students.map((s) => s.name).filter(Boolean).join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">Father's Contact</span>
                    <span className="font-bold text-[#0f1f5c]">
                      {parent.fatherName} ({parent.fatherPhone})
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">Family Email</span>
                    <span className="font-bold text-[#0f1f5c]">{parent.email}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">Fee Type</span>
                    <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      Seat Pre-Booking Token
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Token Amount Payable</span>
                    <span className="font-black text-purple-700 text-base">
                      ₹{totalAmount.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] text-slate-500 font-normal">
                        ({students.length} × ₹1,000)
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Gateway Right Column */}
              <div className="lg:col-span-6 space-y-4 sm:space-y-5">
                <h3 className="text-xs sm:text-sm font-black text-[#0f1f5c] uppercase tracking-wider">
                  Payment Gateway
                </h3>

                {/* Cashfree Online Gateway */}
                <div className="p-3.5 sm:p-4 rounded-2xl border-2 border-purple-600 bg-purple-50/70 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl">⚡</span>
                    <div>
                      <div className="font-black text-xs sm:text-sm text-[#0f1f5c]">Cashfree Online Checkout</div>
                      <div className="text-[10px] sm:text-[11px] font-bold text-slate-500">Instant UPI, Google Pay, Cards &amp; NetBanking</div>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                {/* Amount To Pay Banner */}
                <div
                  style={{ background: 'linear-gradient(135deg, #0f1f5c 0%, #1846c4 100%)' }}
                  className="p-4 sm:p-5 rounded-2xl text-white shadow-md"
                >
                  <div className="text-[11px] sm:text-xs font-bold text-white/80 uppercase tracking-wider">
                    Total Pre-Booking Token Due
                  </div>
                  <div className="text-2xl sm:text-4xl font-black mt-1">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-white/70 font-semibold mt-1">
                    Instant automated seat reservation • 100% Secure via WeGrow Connect
                  </div>
                </div>

                {/* Pending / Incomplete Payment Status Banner */}
                {pendingOrder && (
                  <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2.5 shadow-2xs">
                    <div className="flex items-center gap-2 text-amber-950 font-black text-xs sm:text-sm">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Payment Status: {pendingOrder.status || 'PENDING'}</span>
                    </div>
                    <p className="text-[11px] sm:text-xs font-bold text-amber-800 leading-relaxed">
                      {pendingOrder.message || `Pre-booking Order #${pendingOrder.orderId} was initiated. If amount was debited from your bank, please click Verify below.`}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => verifyAndSubmitPreBooking(pendingOrder.orderId)}
                        disabled={isVerifyingPayment}
                        className="inline-flex items-center gap-1.5 bg-[#0f1f5c] hover:bg-purple-900 text-white text-xs font-black px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {isVerifyingPayment ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <span>🔄 Check / Verify Payment</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handlePaymentAndPreBook}
                        disabled={isProcessing}
                        className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        <span>⚡ Retry Payment</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Pay Button */}
                <button
                  type="button"
                  onClick={handlePaymentAndPreBook}
                  disabled={isProcessing || isVerifyingPayment}
                  style={{ background: 'linear-gradient(90deg, #ff7a1a, #ff3d8b, #7b4dff)' }}
                  className="w-full h-12 sm:h-14 rounded-2xl text-white font-black text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-101 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing || isVerifyingPayment ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{isVerifyingPayment ? 'Verifying Payment Confirmation...' : 'Connecting to Gateway...'}</span>
                    </div>
                  ) : (
                    <span>
                      Pay ₹{totalAmount.toLocaleString('en-IN')} &amp; Confirm Pre-Booking 🎉
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
                    <span>Back to Review</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* STEP 4: DIGITAL PRE-BOOKING RECEIPT / CONFIRMATION */}
        {step === 4 && completedPreBooking && (
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
                Pre-Booking Successful! 🎉
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm font-semibold mt-1">
                Seats reserved for {completedPreBooking.studentCount || students.length} student(s) in AI Explorer with WeGrow Skill Campus &amp; B School.
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
                      OFFICIAL PRE-BOOKING RECEIPT
                    </div>
                    <div className="text-xs sm:text-sm font-black font-mono mt-0.5">
                      {completedPreBooking.id}
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
                    <span>Thank you for pre-booking your seats!</span>
                    <span>✨</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                    We have successfully registered <strong className="text-[#0f1f5c]">{completedPreBooking.studentName}</strong> for AI Explorer. Our team will contact <strong className="text-purple-700">{completedPreBooking.fatherPhone || completedPreBooking.motherPhone}</strong> regarding batch schedule and final enrollment adjustment.
                  </p>
                </div>

                {/* Subheader Status Strip */}
                <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs">
                  <div>
                    <span className="text-slate-500 font-bold">Program: </span>
                    <strong className="text-purple-900 font-black">
                      AI Explorer ({completedPreBooking.studentCount || students.length} Seat{completedPreBooking.studentCount > 1 ? 's' : ''})
                    </strong>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black text-[10px] uppercase tracking-wider shrink-0">
                    ✓ Pre-Booking Paid &amp; Confirmed
                  </span>
                </div>

                {/* Registered Students List in Receipt */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-slate-200 space-y-3 print:p-3.5 print:border print:border-slate-300">
                  <h3 className="text-xs font-black text-[#0f1f5c] uppercase tracking-wider border-b border-slate-100 pb-1.5 print:text-[11px]">
                    Registered Student(s) &amp; Parent Details
                  </h3>

                  {/* Students list */}
                  <div className="space-y-2 pb-2 border-b border-slate-100">
                    {(completedPreBooking.students || students).map((st, i) => (
                      <div key={i} className="flex justify-between items-center text-xs print:text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-900 font-black flex items-center justify-center text-[10px]">
                            {i + 1}
                          </span>
                          <span className="font-black text-[#0f1f5c]">{st.name}</span>
                          <span className="text-slate-500">({st.standard} • {st.school})</span>
                        </div>
                        <span className="font-bold text-emerald-700">₹1,000 Token</span>
                      </div>
                    ))}
                  </div>

                  {/* Parents info */}
                  <div className="grid grid-cols-2 gap-3 text-xs print:text-[11px] print:gap-2 pt-1">
                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-2">
                        <span className="text-slate-500 font-bold min-w-[90px]">Father's Name:</span>
                        <span className="font-bold text-[#0f1f5c]">
                          {completedPreBooking.fatherName} ({completedPreBooking.fatherPhone})
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-2">
                        <span className="text-slate-500 font-bold min-w-[90px]">Mother's Name:</span>
                        <span className="font-bold text-[#0f1f5c]">
                          {completedPreBooking.motherName} ({completedPreBooking.motherPhone})
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-2">
                        <span className="text-slate-500 font-bold min-w-[90px]">Email ID:</span>
                        <span className="font-bold text-[#0f1f5c]">{completedPreBooking.email || completedPreBooking.mailId}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-2">
                        <span className="text-slate-500 font-bold min-w-[90px]">Total Paid:</span>
                        <span className="font-black text-emerald-700">
                          ₹{Number(completedPreBooking.amount).toLocaleString('en-IN')} (CONFIRMED)
                        </span>
                      </div>
                    </div>

                    {completedPreBooking.address && (
                      <div className="col-span-2 pt-1 border-t border-slate-100 flex items-start gap-2">
                        <span className="text-slate-500 font-bold min-w-[90px]">Address:</span>
                        <span className="font-semibold text-slate-700">{completedPreBooking.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification QR & Seal Strip */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs print:p-2.5">
                  <div className="flex items-center gap-2.5">
                    {qrCodeUrl ? (
                      <img src={qrCodeUrl} alt="QR Verification" className="w-14 h-14 object-contain rounded-md border border-slate-300 shrink-0" />
                    ) : (
                      <div className="w-14 h-14 bg-purple-100 rounded-md flex items-center justify-center text-xl shrink-0">🎓</div>
                    )}
                    <div>
                      <div className="font-black text-[#0f1f5c] text-[11px]">Officially Verified Pre-Booking</div>
                      <div className="text-[10px] text-slate-500">Scan QR to verify student seat reservation</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">
                        Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
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

      {/* Footer with Helpline */}
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
