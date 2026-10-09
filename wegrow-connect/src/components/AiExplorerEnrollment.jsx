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
  Sparkle,
  X
} from 'lucide-react';
import { aiExplorerApi } from '../services/aiExplorerApi';

const BASE_PLANS = {
  full: {
    id: 'full',
    name: 'Full Payment',
    baseTotalFee: 43000,
    baseAmount: 43000,
    baseSavings: 2000,
    tag: 'BEST VALUE',
    desc: 'One-time payment covering full annual curriculum, practical labs & AI kit.',
    cycles: '1 Full Payment',
    color: 'from-emerald-500 to-teal-600',
    badgeBg: '#10b981',
  },
  half: {
    id: 'half',
    name: 'Half-Yearly',
    baseTotalFee: 45000,
    baseAmount: 22500,
    baseSavings: 0,
    tag: 'FLEXIBLE',
    desc: '2 convenient installments of ₹22,500 per student (Pay 1st Half now).',
    cycles: '2 Installments',
    color: 'from-purple-500 to-indigo-600',
    badgeBg: '#8b5cf6',
  },
  term: {
    id: 'term',
    name: 'Term Wise Payment',
    baseTotalFee: 45000,
    baseAmount: 15000,
    baseSavings: 0,
    tag: 'EASY TERMS',
    desc: '3 equal term payments (₹15,000 per term per student).',
    cycles: '3 Terms',
    color: 'from-blue-500 to-cyan-600',
    badgeBg: '#3b82f6',
  },
};

const BASE_TERM_OPTIONS = [
  { id: 'term1', label: 'Term I', baseAmount: 15000, desc: 'Pay 1st Term Now', enabled: true },
  { id: 'term2', label: 'Term II', baseAmount: 15000, desc: 'Payable in 2nd Term', enabled: false, disabledReason: 'Upcoming' },
  { id: 'term3', label: 'Term III', baseAmount: 15000, desc: 'Payable in 3rd Term', enabled: false, disabledReason: 'Upcoming' },
];

const BASE_HALF_OPTIONS = [
  { id: 'half1', label: '1st Half', baseAmount: 22500, desc: 'Pay 1st Installment Now', enabled: true },
  { id: 'half2', label: '2nd Half', baseAmount: 22500, desc: 'Payable in 2nd Installment', enabled: false, disabledReason: 'Upcoming' },
];

export default function AiExplorerEnrollment() {
  const [step, setStep] = useState(1);

  // Common Parent Details
  const [parent, setParent] = useState({
    fatherName: '',
    motherName: '',
    fatherPhone: '',
    motherPhone: '',
    email: '',
    address: '',
  });

  // Dynamic Array of Students (Family Children)
  const [students, setStudents] = useState([
    {
      id: 1,
      name: '',
      standard: '',
      school: '',
    },
  ]);

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

  const studentCount = students.length;

  const getActivePayDetails = () => {
    const count = students.length || 1;
    if (selectedPlan === 'term') {
      const t = BASE_TERM_OPTIONS.find((item) => item.id === selectedTerm) || BASE_TERM_OPTIONS[0];
      const perTermAmount = t.baseAmount * count;
      const totalAnnualFee = 45000 * count;
      return {
        planName: `Term Wise Payment (${t.label})`,
        basePlanName: 'Term Wise Payment',
        subLabel: t.label,
        studentCount: count,
        basePerStudent: t.baseAmount,
        amount: perTermAmount,
        totalFee: totalAnnualFee,
        savings: 0,
        dueDesc: `${t.label} Payment Due (${count} ${count > 1 ? 'Students' : 'Student'})`,
        tag: `${t.label} Fee (₹${t.baseAmount.toLocaleString('en-IN')} × ${count})`,
      };
    }
    if (selectedPlan === 'half') {
      const h = BASE_HALF_OPTIONS.find((item) => item.id === selectedHalf) || BASE_HALF_OPTIONS[0];
      const perHalfAmount = h.baseAmount * count;
      const totalAnnualFee = 45000 * count;
      return {
        planName: `Half-Yearly (${h.label})`,
        basePlanName: 'Half-Yearly',
        subLabel: h.label,
        studentCount: count,
        basePerStudent: h.baseAmount,
        amount: perHalfAmount,
        totalFee: totalAnnualFee,
        savings: 0,
        dueDesc: `${h.label} Payment Due (${count} ${count > 1 ? 'Students' : 'Student'})`,
        tag: `${h.label} Fee (₹${h.baseAmount.toLocaleString('en-IN')} × ${count})`,
      };
    }
    const fullAmount = 43000 * count;
    const totalAnnualFee = 43000 * count;
    const savings = 2000 * count;
    return {
      planName: 'Full Payment',
      basePlanName: 'Full Payment',
      subLabel: 'Full Payment',
      studentCount: count,
      basePerStudent: 43000,
      amount: fullAmount,
      totalFee: totalAnnualFee,
      savings: savings,
      dueDesc: `Total Amount Due (${count} ${count > 1 ? 'Students' : 'Student'})`,
      tag: `Full Payment (₹43,000 × ${count})`,
    };
  };

  // Generate QR Code upon successful enrollment
  useEffect(() => {
    if (completedEnrollment) {
      const qrPayload = JSON.stringify({
        id: completedEnrollment.id,
        bookingType: 'AI_EXPLORER_ENROLLMENT',
        studentCount: completedEnrollment.studentCount || completedEnrollment.students?.length || 1,
        student: completedEnrollment.studentName,
        standard: completedEnrollment.standard,
        parentPhone: completedEnrollment.fatherPhone || completedEnrollment.motherPhone,
        plan: completedEnrollment.planName,
        amount: completedEnrollment.amount,
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
      toast.error('Maximum 6 students can be enrolled in a single transaction.');
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
      },
    ]);
    toast.success(`Child #${students.length + 1} added! Fees updated dynamically.`);
  };

  // Remove Student
  const handleRemoveStudent = (idToRemove) => {
    if (students.length <= 1) {
      toast.error('At least 1 student is required.');
      return;
    }
    setStudents((prev) => prev.filter((s) => s.id !== idToRemove));
    toast.success('Student removed. Total fees adjusted.');
  };

  // Validate Step 1
  const validateStep1 = () => {
    const errs = {};

    // Validate Each Student
    students.forEach((s, idx) => {
      if (!s.name.trim()) {
        errs[`student_${idx}_name`] = `Student #${idx + 1} name is required`;
      }
      if (!s.standard) {
        errs[`student_${idx}_standard`] = `Select standard for Student #${idx + 1}`;
      }
      if (!s.school.trim()) {
        errs[`student_${idx}_school`] = `School name for Student #${idx + 1} is required`;
      }
    });

    // Validate Parent & Contact Details
    if (!parent.email.trim()) {
      errs.email = 'Email ID is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parent.email.trim())) {
      errs.email = 'Enter a valid email address';
    }

    if (!parent.fatherName.trim()) errs.fatherName = "Father's name is required";
    if (!parent.motherName.trim()) errs.motherName = "Mother's name is required";

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

    if (!parent.address.trim()) errs.address = 'Residential address is required';

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

  const [pendingOrder, setPendingOrder] = useState(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const checkedUrlParamRef = useRef(false);

  // Check URL query parameters for return from 3DS redirect
  useEffect(() => {
    if (checkedUrlParamRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const orderIdParam = params.get('order_id') || params.get('orderId') || params.get('txnid');

    if (orderIdParam) {
      checkedUrlParamRef.current = true;
      setIsVerifyingPayment(true);
      toast.loading('Checking payment confirmation...', { id: 'url-verify' });
      aiExplorerApi
        .checkEnrollmentStatus(orderIdParam)
        .then(async (res) => {
          const isSuccess =
            res?.isPaid === true ||
            res?.status === 'SUCCESS' ||
            res?.data?.isPaid === true ||
            res?.data?.status === 'SUCCESS' ||
            (res?.success && (res?.data?.isPaid || res?.data?.status === 'SUCCESS'));

          if (isSuccess) {
            const payDetails = getActivePayDetails();
            const studentNames = students.map((s) => s.name.trim()).join(', ');
            const enrollmentPayload = {
              studentName: studentNames,
              students: students.map((s) => ({
                name: s.name.trim(),
                standard: s.standard,
                school: s.school.trim(),
              })),
              totalStudents: students.length,
              studentCount: students.length,
              email: parent.email.trim(),
              mailId: parent.email.trim(),
              standard: students.map((s) => s.standard).join(', '),
              school: students.map((s) => s.school.trim()).join(', '),
              fatherName: parent.fatherName.trim(),
              motherName: parent.motherName.trim(),
              fatherPhone: parent.fatherPhone.trim(),
              motherPhone: parent.motherPhone.trim(),
              address: parent.address.trim(),
              course: 'AI Explorer',
              courseName: 'AI Explorer',
              plan: selectedPlan,
              feePlan: selectedPlan,
              planName: payDetails.planName,
              selectedTerm: selectedPlan === 'term' ? payDetails.subLabel : '',
              amount: payDetails.amount,
              totalFee: payDetails.totalFee,
              paymentMethod: 'Cashfree',
              transactionId: orderIdParam,
              paymentStatus: 'PAID',
            };
            const submitRes = await aiExplorerApi.submitEnrollment(enrollmentPayload);
            if (submitRes?.success) {
              setCompletedEnrollment(submitRes.data);
              setStep(4);
              toast.success('🎉 Payment verified! Enrollment confirmed.', { id: 'url-verify' });
              try {
                window.history.replaceState({}, document.title, window.location.pathname);
              } catch (_) {}
            }
          } else {
            toast.error(`Payment status: ${res?.status || 'PENDING'}. Please complete payment.`, { id: 'url-verify' });
          }
        })
        .catch(() => {
          toast.dismiss('url-verify');
        })
        .finally(() => {
          setIsVerifyingPayment(false);
        });
    }
  }, []);

  // Build Payload Helper
  const buildEnrollmentPayload = (orderId = '') => {
    const payDetails = getActivePayDetails();
    const studentNames = students.map((s) => s.name.trim()).join(', ');
    const studentStandards = students.map((s) => s.standard).join(', ');
    const studentSchools = students.map((s) => s.school.trim()).join(', ');

    return {
      studentName: studentNames,
      students: students.map((s) => ({
        name: s.name.trim(),
        standard: s.standard,
        school: s.school.trim(),
      })),
      totalStudents: students.length,
      studentCount: students.length,
      email: parent.email.trim(),
      mailId: parent.email.trim(),
      standard: studentStandards,
      school: studentSchools,
      fatherName: parent.fatherName.trim(),
      motherName: parent.motherName.trim(),
      fatherPhone: parent.fatherPhone.trim(),
      motherPhone: parent.motherPhone.trim(),
      address: parent.address.trim(),
      course: 'AI Explorer',
      courseName: 'AI Explorer',
      plan: selectedPlan,
      feePlan: selectedPlan,
      planName: payDetails.planName,
      selectedTerm: selectedPlan === 'term' ? payDetails.subLabel : '',
      amount: payDetails.amount,
      totalFee: payDetails.totalFee,
      paymentMethod,
      transactionId: orderId || utrNumber.trim() || `ORD_${Date.now().toString().slice(-8)}`,
      paymentStatus: 'PAID',
    };
  };

  // Verify payment status with backend gateway before submitting
  const verifyAndSubmitEnrollment = async (orderId, basePayload) => {
    setIsVerifyingPayment(true);
    try {
      const statusRes = await aiExplorerApi.checkEnrollmentStatus(orderId).catch(() => null);
      const isSuccess =
        statusRes?.isPaid === true ||
        statusRes?.status === 'SUCCESS' ||
        statusRes?.data?.isPaid === true ||
        statusRes?.data?.status === 'SUCCESS' ||
        (statusRes?.success && (statusRes?.data?.isPaid || statusRes?.data?.status === 'SUCCESS'));

      if (isSuccess) {
        const payloadToSubmit = {
          ...(basePayload || buildEnrollmentPayload(orderId)),
          transactionId: orderId,
          paymentStatus: 'PAID',
          paymentMethod: 'Cashfree',
        };

        const response = await aiExplorerApi.submitEnrollment(payloadToSubmit);
        if (response?.success) {
          setCompletedEnrollment(response.data);
          setPendingOrder(null);
          setStep(4);
          toast.success(`🎉 Payment verified! Enrollment confirmed for ${students.length} student${students.length > 1 ? 's' : ''}!`, { id: 'payment-act' });
          scrollToSection();
          return true;
        } else {
          throw new Error(response?.message || 'Failed to save enrollment details in database.');
        }
      } else {
        const rawStatus = statusRes?.status || statusRes?.data?.status || 'PENDING';
        setPendingOrder({
          orderId,
          status: rawStatus,
          message: `Payment status is ${rawStatus}. If money was debited from your account, click "Verify Payment Status".`,
        });
        toast.error(`⚠️ Payment status: ${rawStatus}. Payment was not completed or is pending.`, { id: 'payment-act' });
        return false;
      }
    } catch (err) {
      toast.error(err.message || 'Payment verification failed.', { id: 'payment-act' });
      return false;
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  // Process Final Payment & Enrollment
  const handlePaymentAndEnroll = async () => {
    setIsProcessing(true);
    const payDetails = getActivePayDetails();
    const studentNames = students.map((s) => s.name.trim()).join(', ');
    const enrollmentPayload = buildEnrollmentPayload();

    try {
      if (paymentMethod === 'Cashfree') {
        const cashfreePayload = {
          amount: payDetails.amount,
          orderAmount: payDetails.amount,
          customerName: students[0]?.name?.trim() || parent.fatherName.trim() || 'Parent',
          studentName: studentNames,
          email: parent.email.trim(),
          customerEmail: parent.email.trim(),
          fatherPhone: parent.fatherPhone.trim(),
          customerPhone: parent.fatherPhone.trim(),
          motherPhone: parent.motherPhone.trim(),
          fatherName: parent.fatherName.trim(),
          motherName: parent.motherName.trim(),
          address: parent.address.trim(),
          feePlan: selectedPlan,
          plan: selectedPlan,
          planName: payDetails.planName,
          selectedTerm: selectedPlan === 'term' ? payDetails.subLabel : '',
          totalFee: payDetails.totalFee,
          orderNote: `AI Explorer Enrollment (${payDetails.planName} • ${students.length} Student${students.length > 1 ? 's' : ''}) - ${studentNames}`,
          students: students.map((s) => ({
            name: s.name.trim(),
            standard: s.standard,
            school: s.school.trim(),
          })),
        };

        const cfRes = await aiExplorerApi.createEnrollmentOrder(cashfreePayload);
        if (!cfRes?.success || !cfRes?.data?.paymentSessionId) {
          throw new Error(cfRes?.message || 'Could not initiate payment session with Cashfree.');
        }

        const orderData = cfRes.data;
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

          // After modal closes or finishes, verify with backend gateway
          toast.loading('Verifying payment with gateway...', { id: 'payment-act' });
          await new Promise((r) => setTimeout(r, 1200));
          await verifyAndSubmitEnrollment(targetOrderId, enrollmentPayload);
        } else if (orderData.paymentLink) {
          window.location.href = orderData.paymentLink;
        } else {
          throw new Error('Cashfree checkout modal could not be loaded.');
        }
      } else {
        // Direct / Offline payment mode
        const response = await aiExplorerApi.submitEnrollment(enrollmentPayload);
        if (response?.success) {
          setCompletedEnrollment(response.data);
          setStep(4);
          toast.success(`🎉 Enrollment registered successfully!`);
          scrollToSection();
        } else {
          throw new Error(response?.message || 'Enrollment registration failed.');
        }
      }
    } catch (error) {
      toast.error(error.message || 'Payment processing failed. Please try again.', { id: 'payment-act' });
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

  const payDetails = getActivePayDetails();

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
              <span>🎟️ Pre-Book (₹1k/Child)</span>
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
                  Step 01 of 03 — Provide child details and parent contact information.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-100 text-purple-900 font-black text-xs">
                  <Users className="w-3.5 h-3.5 text-purple-700" />
                  <span>{students.length} Child{students.length > 1 ? 'ren' : ''}</span>
                </span>
                <div className="px-3 py-1 rounded-xl bg-[#0f1f5c] text-white font-mono text-xs font-bold shrink-0">
                  01 / 03
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
              {/* DYNAMIC STUDENTS SECTION */}
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-black text-sm">
                      1
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#0f1f5c]">
                        Child &amp; Student Information
                      </h3>
                      <p className="text-xs text-slate-500 font-bold">
                        Enrolling multiple children? Click "+ Add Another Student" below to calculate combined fees.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddStudent}
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Another Student / Child</span>
                  </button>
                </div>

                {/* Student Cards List */}
                <div className="space-y-4">
                  {students.map((stud, idx) => (
                    <div
                      key={stud.id}
                      className="p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-white to-[#faf8f5] border-2 border-purple-200 shadow-2xs relative transition-all"
                    >
                      {/* Card Top Strip */}
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-[#0f1f5c] text-white flex items-center justify-center text-xs font-black">
                            #{idx + 1}
                          </span>
                          <span className="text-sm sm:text-base font-black text-[#0f1f5c]">
                            Child / Student #{idx + 1} Details
                          </span>
                          {idx === 0 && (
                            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                              Primary Student
                            </span>
                          )}
                        </div>

                        {students.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStudent(stud.id)}
                            className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-lg text-xs font-bold border border-pink-200 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Child</span>
                          </button>
                        )}
                      </div>

                      {/* Student Input Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
                        {/* Student Name */}
                        <div>
                          <label className="block text-xs font-black text-[#0f1f5c] mb-1.5 uppercase tracking-wide">
                            Student Full Name <span className="text-pink-500">*</span>
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                            <input
                              type="text"
                              value={stud.name}
                              onChange={(e) => handleStudentChange(idx, 'name', e.target.value)}
                              placeholder={`e.g. ${idx === 0 ? 'Aarav Sharma' : 'Ananya Sharma'}`}
                              className={`w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl border-2 text-sm font-bold transition-all outline-none ${
                                errors[`student_${idx}_name`]
                                  ? 'border-pink-500 bg-pink-50/50'
                                  : 'border-slate-200 bg-slate-50/70 focus:border-purple-600 focus:bg-white'
                              }`}
                            />
                          </div>
                          {errors[`student_${idx}_name`] && (
                            <p className="text-pink-600 text-xs font-bold mt-1">
                              {errors[`student_${idx}_name`]}
                            </p>
                          )}
                        </div>

                        {/* Standard Dropdown */}
                        <div>
                          <label className="block text-xs font-black text-[#0f1f5c] mb-1.5 uppercase tracking-wide">
                            Standard / Grade <span className="text-pink-500">*</span>
                          </label>
                          <div className="relative">
                            <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                            <select
                              value={stud.standard}
                              onChange={(e) => handleStudentChange(idx, 'standard', e.target.value)}
                              className={`w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl border-2 text-sm font-bold transition-all outline-none cursor-pointer ${
                                errors[`student_${idx}_standard`]
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
                          {errors[`student_${idx}_standard`] && (
                            <p className="text-pink-600 text-xs font-bold mt-1">
                              {errors[`student_${idx}_standard`]}
                            </p>
                          )}
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
                              value={stud.school}
                              onChange={(e) => handleStudentChange(idx, 'school', e.target.value)}
                              placeholder="e.g. KVS Matric Higher Secondary School"
                              className={`w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl border-2 text-sm font-bold transition-all outline-none ${
                                errors[`student_${idx}_school`]
                                  ? 'border-pink-500 bg-pink-50/50'
                                  : 'border-slate-200 bg-slate-50/70 focus:border-purple-600 focus:bg-white'
                              }`}
                            />
                          </div>
                          {errors[`student_${idx}_school`] && (
                            <p className="text-pink-600 text-xs font-bold mt-1">
                              {errors[`student_${idx}_school`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Multi-student Add More Banner */}
                <div className="p-3 sm:p-4 rounded-2xl bg-purple-50/80 border-2 border-dashed border-purple-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">👨‍👩‍👧‍👦</span>
                    <div>
                      <span className="font-black text-[#0f1f5c]">
                        Have another child or sibling to enroll?
                      </span>
                      <span className="text-slate-600 font-bold block sm:inline sm:ml-1">
                        Enroll together in one step to streamline batch scheduling &amp; fees.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddStudent}
                    className="inline-flex items-center gap-1.5 bg-[#0f1f5c] hover:bg-purple-900 text-white font-black px-4 py-2 rounded-xl text-xs shadow-2xs transition-all cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-300" />
                    <span>+ Add Another Child ({students.length + 1})</span>
                  </button>
                </div>
              </div>

              {/* COMMON PARENT / GUARDIAN CONTACT SECTION */}
              <div className="pt-4 border-t-2 border-slate-100 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-black text-sm">
                    2
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#0f1f5c]">
                      Parent / Guardian &amp; Contact Details
                    </h3>
                    <p className="text-xs text-slate-500 font-bold">
                      Common communications and official receipts will be sent here.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {/* Email ID */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black text-[#0f1f5c] mb-1.5 uppercase tracking-wide">
                      Student / Parent Email ID <span className="text-pink-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        name="email"
                        value={parent.email}
                        onChange={handleParentChange}
                        placeholder="e.g. parent.name@gmail.com"
                        className={`w-full h-11 sm:h-12 pl-10 pr-4 rounded-xl border-2 text-sm font-bold transition-all outline-none ${
                          errors.email
                            ? 'border-pink-500 bg-pink-50/50'
                            : 'border-slate-200 bg-slate-50/70 focus:border-purple-600 focus:bg-white'
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-pink-600 text-xs font-bold mt-1">{errors.email}</p>}
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
                        value={parent.address}
                        onChange={handleParentChange}
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
                  <span>Next — Choose Fee Plan ({students.length} Student{students.length > 1 ? 's' : ''})</span>
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
                  Step 02 of 03 — Select tuition payment schedule for {students.length} enrolled student{students.length > 1 ? 's' : ''}.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-100 text-purple-900 font-black text-xs">
                  <Users className="w-3.5 h-3.5 text-purple-700" />
                  <span>{students.length} Child{students.length > 1 ? 'ren' : ''}</span>
                </span>
                <div className="px-3 py-1 rounded-xl bg-[#0f1f5c] text-white font-mono text-xs font-bold shrink-0">
                  02 / 03
                </div>
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
                  {students.length} Student{students.length > 1 ? 's' : ''} Enrolled
                </div>
              </div>
            </div>

            {/* Enrolled Students Quick Badges */}
            <div className="p-3 sm:p-4 rounded-2xl bg-purple-50/70 border border-purple-200 mb-6 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-[#0f1f5c]">Enrolled Children:</span>
                {students.map((s, i) => (
                  <span
                    key={s.id || i}
                    className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-purple-200 text-xs font-bold text-purple-900 shadow-2xs"
                  >
                    <span>🧑‍🎓</span>
                    <span>{s.name || `Student #${i + 1}`}</span>
                    <span className="text-slate-400 text-[10px]">({s.standard || 'Grade'})</span>
                  </span>
                ))}
              </div>
              <span className="text-xs font-extrabold text-purple-700">
                Total Multiplier: ×{students.length}
              </span>
            </div>

            {/* Dynamic Plan Selector Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-6">
              {Object.values(BASE_PLANS).map((p) => {
                const isSelected = selectedPlan === p.id;
                const calcTotalFee = p.baseTotalFee * students.length;
                const calcSavings = p.baseSavings * students.length;
                const calcPayNow = p.baseAmount * students.length;

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
                      <p className="text-slate-500 text-xs font-bold mt-1 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 mt-4">
                      <div className="text-2xl sm:text-3xl font-black text-[#0f1f5c]">
                        ₹{calcTotalFee.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-extrabold text-slate-500 mt-0.5">
                        {p.id === 'full' && (
                          <span className="text-emerald-700 font-black">
                            1 Full Payment • Save ₹{calcSavings.toLocaleString('en-IN')} ({students.length} student{students.length > 1 ? 's' : ''})
                          </span>
                        )}
                        {p.id === 'half' && (
                          <span>
                            2 Installments • Pay ₹{calcPayNow.toLocaleString('en-IN')} (1st Half)
                          </span>
                        )}
                        {p.id === 'term' && (
                          <span>
                            3 Terms • Pay ₹{calcPayNow.toLocaleString('en-IN')} (Term I)
                          </span>
                        )}
                      </div>
                      {students.length > 1 && (
                        <div className="text-[10px] font-bold text-purple-700 mt-1">
                          Calculated for {students.length} students (₹{p.baseTotalFee.toLocaleString('en-IN')} / student)
                        </div>
                      )}
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
                    <span>Half-Yearly Payment Schedule ({students.length} Student{students.length > 1 ? 's' : ''}):</span>
                  </div>
                  <div className="text-[11px] font-bold text-purple-700">
                    1st Half is currently active for admission
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {BASE_HALF_OPTIONS.map((halfItem) => {
                    const isEnabled = halfItem.enabled !== false;
                    const isHalfSelected = selectedHalf === halfItem.id;
                    const halfTotal = halfItem.baseAmount * students.length;
                    return (
                      <button
                        type="button"
                        key={halfItem.id}
                        disabled={!isEnabled}
                        onClick={() => {
                          if (isEnabled) setSelectedHalf(halfItem.id);
                        }}
                        className={`relative p-3.5 sm:p-4 rounded-xl text-left border-2 transition-all flex items-center justify-between ${
                          !isEnabled
                            ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed select-none'
                            : isHalfSelected
                            ? 'bg-white border-purple-600 shadow-md ring-2 ring-purple-300 scale-101 cursor-pointer'
                            : 'bg-white/80 hover:bg-white border-purple-200 hover:border-purple-300 opacity-85 hover:opacity-100 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              !isEnabled
                                ? 'border-slate-300 bg-slate-100 text-slate-400'
                                : isHalfSelected
                                ? 'border-purple-600 bg-purple-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isHalfSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-black text-[#0f1f5c] flex items-center gap-1.5">
                              <span>{halfItem.label}</span>
                              {!isEnabled && (
                                <span className="text-[10px] text-slate-400 font-bold">(Locked)</span>
                              )}
                            </div>
                            <div className="text-[10px] sm:text-[11px] font-bold text-slate-500">
                              {!isEnabled
                                ? halfItem.desc
                                : `₹${halfItem.baseAmount.toLocaleString('en-IN')} × ${students.length} student${students.length > 1 ? 's' : ''}`}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm sm:text-base font-black ${!isEnabled ? 'text-slate-400' : 'text-purple-700'}`}>
                            ₹{halfTotal.toLocaleString('en-IN')}
                          </div>
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              !isEnabled
                                ? 'bg-slate-200 text-slate-500'
                                : isHalfSelected
                                ? 'text-purple-600 bg-purple-100'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {!isEnabled ? '🔒 Upcoming' : isHalfSelected ? 'Active Now' : 'Half'}
                          </span>
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
                    <span>Term Payment Schedule ({students.length} Student{students.length > 1 ? 's' : ''}):</span>
                  </div>
                  <div className="text-[11px] font-bold text-blue-700">
                    Term I is currently active for admission
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {BASE_TERM_OPTIONS.map((termItem) => {
                    const isEnabled = termItem.enabled !== false;
                    const isTermSelected = selectedTerm === termItem.id;
                    const termTotal = termItem.baseAmount * students.length;
                    return (
                      <button
                        type="button"
                        key={termItem.id}
                        disabled={!isEnabled}
                        onClick={() => {
                          if (isEnabled) setSelectedTerm(termItem.id);
                        }}
                        className={`relative p-3.5 sm:p-4 rounded-xl text-left border-2 transition-all flex flex-col justify-between ${
                          !isEnabled
                            ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed select-none'
                            : isTermSelected
                            ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-300 scale-101 cursor-pointer'
                            : 'bg-white/80 hover:bg-white border-blue-200 hover:border-blue-300 opacity-85 hover:opacity-100 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              !isEnabled
                                ? 'border-slate-300 bg-slate-100 text-slate-400'
                                : isTermSelected
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isTermSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              !isEnabled
                                ? 'bg-slate-200 text-slate-500 font-bold'
                                : isTermSelected
                                ? 'bg-blue-600 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {!isEnabled ? '🔒 Upcoming' : isTermSelected ? 'Active Now' : 'Term'}
                          </span>
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-black text-[#0f1f5c] flex items-center gap-1.5">
                            <span>{termItem.label}</span>
                            {!isEnabled && (
                              <span className="text-[10px] text-slate-400 font-bold">(Locked)</span>
                            )}
                          </div>
                          <div className={`text-base sm:text-lg font-black mt-0.5 ${!isEnabled ? 'text-slate-400' : 'text-blue-700'}`}>
                            ₹{termTotal.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 mt-0.5">
                            {!isEnabled
                              ? termItem.desc
                              : `₹${termItem.baseAmount.toLocaleString('en-IN')} × ${students.length} student${students.length > 1 ? 's' : ''}`}
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
                I confirm that the details provided for{' '}
                <strong className="text-[#0f1f5c]">
                  {students.map((s) => s.name).filter(Boolean).join(', ') || `${students.length} students`}
                </strong>{' '}
                are accurate, and I agree to the selected{' '}
                <strong className="text-[#0f1f5c]">{getActivePayDetails().planName}</strong> fee plan (₹{getActivePayDetails().amount.toLocaleString('en-IN')} payable now for {students.length} student{students.length > 1 ? 's' : ''}) and WeGrow Skill Campus &amp; B School enrollment terms.
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
                <span>Back to Student Details</span>
              </button>

              <button
                type="button"
                onClick={handleNextToStep3}
                disabled={!isDeclared}
                style={{ background: isDeclared ? 'linear-gradient(90deg, #ff7a1a, #ff3d8b, #7b4dff)' : '#94a3b8' }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-black text-sm px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-102 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Continue to Payment (₹{getActivePayDetails().amount.toLocaleString('en-IN')})</span>
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
                  Step 03 of 03 — Final step to confirm student seats for {students.length} child{students.length > 1 ? 'ren' : ''} in AI Explorer.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-100 text-purple-900 font-black text-xs">
                  <Users className="w-3.5 h-3.5 text-purple-700" />
                  <span>{students.length} Child{students.length > 1 ? 'ren' : ''}</span>
                </span>
                <div className="px-3 py-1 rounded-xl bg-[#0f1f5c] text-white font-mono text-xs font-bold shrink-0">
                  03 / 03
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* Left Column: Summary */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-xs sm:text-sm font-black text-[#0f1f5c] uppercase tracking-wider">
                  Enrollment Summary ({students.length} Student{students.length > 1 ? 's' : ''})
                </h3>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#faf8f5] border-2 border-[#e8dfcf] space-y-3 text-xs sm:text-sm">
                  {/* Students Roster */}
                  <div className="space-y-2 pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold block">Enrolled Students:</span>
                    {students.map((s, idx) => (
                      <div key={s.id || idx} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-[10px] font-black shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-extrabold text-[#0f1f5c] block">{s.name}</span>
                            <span className="text-[10px] text-slate-500 font-bold">{s.school}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md shrink-0">
                          {s.standard}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">Email ID</span>
                    <span className="font-extrabold text-[#0f1f5c]">{parent.email}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">Father's Contact</span>
                    <span className="font-extrabold text-[#0f1f5c]">
                      {parent.fatherName} ({parent.fatherPhone})
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">Course</span>
                    <span className="font-extrabold text-purple-700">AI Explorer</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">Selected Plan</span>
                    <span className="font-extrabold text-emerald-700">{payDetails.planName}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-bold">Total Combined Annual Fee</span>
                    <span className="font-bold text-[#0f1f5c]">₹{payDetails.totalFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Now Payable</span>
                    <span className="font-black text-purple-700">
                      ₹{payDetails.amount?.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] text-slate-500 font-semibold">
                        ({payDetails.tag})
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
                    {payDetails.dueDesc}
                  </div>
                  <div className="text-2xl sm:text-4xl font-black mt-1">
                    ₹{payDetails.amount?.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-white/70 font-semibold mt-1">
                    {selectedPlan === 'term'
                      ? `Total Fee for ${students.length} students: ₹${payDetails.totalFee.toLocaleString('en-IN')} (${payDetails.subLabel} chosen • other terms payable in subsequent terms)`
                      : selectedPlan === 'half'
                      ? `Total Fee for ${students.length} students: ₹${payDetails.totalFee.toLocaleString('en-IN')} (${payDetails.subLabel} chosen • other installment payable bi-annually)`
                      : `100% Secure Transaction via WeGrow Connect (${students.length} student${students.length > 1 ? 's' : ''})`}
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
                      {pendingOrder.message || `Order #${pendingOrder.orderId} was initiated. If amount was debited from your bank, please click Verify below.`}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => verifyAndSubmitEnrollment(pendingOrder.orderId)}
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
                        onClick={handlePaymentAndEnroll}
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
                  onClick={handlePaymentAndEnroll}
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
                      Pay {payDetails.subLabel} ₹{payDetails.amount.toLocaleString('en-IN')} &amp; Complete Enrollment 🎉
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
                Welcome aboard, future AI Explorers! Confirmed admission for{' '}
                <strong className="text-[#0f1f5c]">
                  {completedEnrollment.studentCount || (completedEnrollment.students ? completedEnrollment.students.length : 1)} Student{(completedEnrollment.studentCount || (completedEnrollment.students ? completedEnrollment.students.length : 1)) > 1 ? 's' : ''}
                </strong>{' '}
                with WeGrow Skill Campus &amp; B School.
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
                    <span>Thank you for completing your enrollment!</span>
                    <span>✨</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                    We are thrilled to welcome{' '}
                    <strong className="text-[#0f1f5c]">{completedEnrollment.studentName}</strong> to the AI Explorer Program. Our academic team will connect with you on{' '}
                    <strong className="text-purple-700">{completedEnrollment.fatherPhone || completedEnrollment.motherPhone}</strong> regarding batch schedule, curriculum, and practical lab access.
                  </p>
                </div>

                {/* Subheader Status Strip */}
                <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs">
                  <div>
                    <span className="text-slate-500 font-bold">Program: </span>
                    <strong className="text-purple-900 font-black">AI Explorer Course (Grades 5 – 12)</strong>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black text-[10px] uppercase tracking-wider shrink-0">
                    ✓ Paid &amp; Confirmed ({completedEnrollment.studentCount || (completedEnrollment.students ? completedEnrollment.students.length : 1)} Seat{(completedEnrollment.studentCount || (completedEnrollment.students ? completedEnrollment.students.length : 1)) > 1 ? 's' : ''})
                  </span>
                </div>

                {/* Enrolled Students Table Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-slate-200 space-y-3 print:p-3.5 print:border print:border-slate-300">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <h3 className="text-xs font-black text-[#0f1f5c] uppercase tracking-wider print:text-[11px]">
                      Enrolled Student(s) Roster
                    </h3>
                    <span className="text-[10px] font-black text-purple-700">
                      Total: {completedEnrollment.studentCount || (completedEnrollment.students ? completedEnrollment.students.length : 1)} Student{(completedEnrollment.studentCount || (completedEnrollment.students ? completedEnrollment.students.length : 1)) > 1 ? 's' : ''}
                    </span>
                  </div>

                  {completedEnrollment.students && completedEnrollment.students.length > 0 ? (
                    <div className="space-y-2">
                      {completedEnrollment.students.map((st, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs print:text-[10px]">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-500">#{i + 1}</span>
                            <strong className="text-[#0f1f5c] font-black">{st.name}</strong>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-purple-700 font-bold">{st.standard}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-600 max-w-[150px] truncate">{st.school}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 text-xs print:text-[11px]">
                      <div>
                        <span className="text-slate-500 font-bold">Student Name: </span>
                        <strong className="text-[#0f1f5c]">{completedEnrollment.studentName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold">Standard: </span>
                        <strong className="text-purple-700">{completedEnrollment.standard}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500 font-bold">School: </span>
                        <span className="text-slate-800">{completedEnrollment.school}</span>
                      </div>
                    </div>
                  )}

                  {/* Parent & Payment Details Subgrid */}
                  <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-100 print:text-[11px] print:gap-2">
                    <div className="space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-2">
                        <span className="text-slate-500 font-bold min-w-[90px]">Email ID:</span>
                        <span className="font-bold text-[#0f1f5c]">{completedEnrollment.mailId || completedEnrollment.email || '—'}</span>
                      </div>
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
                    </div>

                    <div className="space-y-1.5">
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
                      <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-2">
                        <span className="text-slate-500 font-bold min-w-[90px]">Payment ID:</span>
                        <span className="font-mono text-slate-700">
                          {completedEnrollment.transactionId || completedEnrollment.id}
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
                <span>Print Official Receipt</span>
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
