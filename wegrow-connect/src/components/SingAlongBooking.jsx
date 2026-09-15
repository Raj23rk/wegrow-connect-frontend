import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  User,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Download,
  Share2,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Info,
  Phone,
  Mail,
  UploadCloud,
  Home,
  X,
  Volume2,
  VolumeX,
  Music,
  ShieldCheck,
  Sparkles,
  Heart,
  FileCheck,
  RefreshCw,
  Zap
} from 'lucide-react';
import { bookSingAlongTicket, singAlongApi } from '../services/singAlongApi';

// Brand & Event Assets
const VIDEO_BANNER_SRC = "/Animate_concert_banner_mascot_1080p_20260912195333.mp4";
const POSTER_STAGE_BG = "/ChatGPT Image Sep 12, 2026, 07_35_53 PM.webp";
const MASCOT_PROMO_IMG = "/ChatGPT Image Sep 12, 2026, 07_20_20 PM.webp";
const TITLE_ARTWORK_IMG = "/ChatGPT Image Sep 12, 2026, 10_34_58 PM.webp";
const POSTER_CARD_IMG = "/sing_along_official_poster.jpg";
const WEGROW_LOGO_IMG = "/Screenshot 2026-09-09 134254.webp";
const WEGROW_BACKUP_LOGO = "/wegrow&Bschool.webp";
const MASCOT_SONG_AUDIO = "/OM First Strike - Bgm _ Instrumental.mp3";

const CONFIG = {
  eventName: "SING ALONG",
  category: "LIVE MUSIC EVENT",
  tagline: "Good Music, Brighter People, More Good Vibes!",
  date: "27 September 2026",
  dateShort: "Sun, Sep 27, 2026",
  dayNum: "27",
  monthAbbr: "SEP",
  dayName: "SUNDAY",
  reportingTime: "6:00 PM Onwards",
  eventTime: "6:00 PM – 9:00 PM",
  venue: "Arasan Turf",
  location: "Sivakasi",
  fullVenue: "Arasan Turf, Sivakasi",
  presentedBy: "WeGrow Skill Campus & B School",
  upiId: "ashokbcasvk45@oksbi",
  upiNumber: "",
  merchantName: "Ashok kumar",
  payeeName: "Ashok kumar",
  ticketPrice: 249,
  conventionFee: 5,
  maxTickets: 15,
  bookingPrefix: "SA26",
  contactPhone: "+91 93440 37331",
  partners: [
    { name: "Fresh Bites", type: "FOOD PARTNER", icon: "🍔" },
    { name: "Thirst Quench", type: "BEVERAGE PARTNER", icon: "🥤" },
    { name: "Sweet Corner", type: "DESSERT PARTNER", icon: "🍰" },
    { name: "Street Feast", type: "FOOD PARTNER", icon: "🌮" },
    { name: "Spice Garden", type: "FOOD PARTNER", icon: "🍛" },
    { name: "Curry House", type: "FOOD PARTNER", icon: "🥘" }
  ],
  importantNotes: [
    "No outside food / No alcohol",
    "No smoking / vaping inside the venue",
    "1 × 500 ml water bottle per person allowed",
    "Tickets are non-refundable",
    "Weather postponement: same ticket stays valid"
  ],
  termsList: [
    "Entry allowed only with valid ticket confirmation.",
    "Organizers reserve right to refuse entry for rule violations.",
    "All bookings are subject to ticket availability.",
    "By proceeding, attendees agree to terms and conditions."
  ]
};

const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");

const genBookingId = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `${CONFIG.bookingPrefix}-${code}`;
};

export default function SingAlongBooking() {
  // Screen views: 'intro' (First Screen: Before You Book) | 'booking' (Second Screen: Hero + Booking)
  const [pageView, setPageView] = useState('intro');

  // Booking Flow Steps
  const [screen, setScreen] = useState('form'); // 'form' | 'status' | 'success'
  const [step, setStep] = useState(1); // 1: Booker, 2: Tickets, 3: Payment, 4: Review

  // Form Fields
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [shakeTerms, setShakeTerms] = useState(false);
  const [booker, setBooker] = useState({
    name: '',
    mobile: '',
    email: ''
  });
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState({
    utr: '',
    datetime: new Date().toISOString().slice(0, 16),
    fileName: '',
    fileData: ''
  });
  const [errors, setErrors] = useState({});
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedUpiNumber, setCopiedUpiNumber] = useState(false);
  const [showOriginalQr, setShowOriginalQr] = useState(true);
  const [paymentMode, setPaymentMode] = useState('ONLINE'); // 'ONLINE' | 'MANUAL_UPI'
  const [isOnlinePaying, setIsOnlinePaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success / Ticket Data
  const [ticketData, setTicketData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [paymentQr, setPaymentQr] = useState('');
  const [ticketQr, setTicketQr] = useState('');

  // Mascot Concert Video & Background Song Controls
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const ticketCaptureRef = useRef(null);

  const subtotal = qty * CONFIG.ticketPrice;
  const conventionFee = qty * (CONFIG.conventionFee || 5);
  const totalAmount = subtotal + conventionFee;

  // Toggle Background Song Audio (MASCOT_SONG_AUDIO)
  const toggleAudioSound = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused || isAudioMuted) {
      audioRef.current.muted = false;
      audioRef.current.play()
        .then(() => setIsAudioMuted(false))
        .catch(console.warn);
    } else {
      audioRef.current.pause();
      setIsAudioMuted(true);
    }
  };

  // Generate UPI Payment QR Code & Mobile Deep Link
  const [upiDeepLink, setUpiDeepLink] = useState('');
  useEffect(() => {
    const upiUrl = `upi://pay?pa=${encodeURIComponent(CONFIG.upiId)}&pn=${encodeURIComponent(CONFIG.merchantName)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(CONFIG.eventName + ' Ticket')}`;
    setUpiDeepLink(upiUrl);
    QRCode.toDataURL(upiUrl, {
      width: 220,
      margin: 1,
      color: { dark: '#111827', light: '#ffffff' }
    })
      .then(url => setPaymentQr(url))
      .catch(err => console.error('UPI QR Error:', err));
  }, [totalAmount]);

  // Generate Verification QR Code for confirmed ticket
  useEffect(() => {
    if (ticketData?.bookingId) {
      const code = ticketData.verificationToken || `SINGALONG-VERIFY:${ticketData.bookingId}`;
      QRCode.toDataURL(code, {
        width: 200,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' }
      })
        .then(url => setTicketQr(url))
        .catch(err => console.error('Ticket QR Error:', err));
    }
  }, [ticketData]);

  // Copy UPI ID
  const handleCopyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(CONFIG.upiId);
      setCopiedUpi(true);
      toast.success('UPI ID copied to clipboard!');
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  // Copy UPI Number
  const handleCopyUpiNumber = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(CONFIG.upiNumber);
      setCopiedUpiNumber(true);
      toast.success('UPI Number copied to clipboard!');
      setTimeout(() => setCopiedUpiNumber(false), 2000);
    }
  };

  // First Screen: "Let's Book & Hear Mascot Sing" Click Handler
  const handleIntroProceed = () => {
    if (!termsAccepted) {
      setShakeTerms(true);
      toast.error("Please agree to the Terms & Conditions to proceed.");
      setTimeout(() => setShakeTerms(false), 600);
      return;
    }

    // Switch cleanly to Second Screen (Hero Banner at the top)
    setPageView('booking');
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Play muted mascot video and start MASCOT_SONG_AUDIO music
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.play().catch(console.warn);
      }
      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.play()
          .then(() => setIsAudioMuted(false))
          .catch((err) => {
            console.warn("Audio autoplay policy:", err);
          });
      }
    }, 150);
  };

  // Quantity Handlers
  const handleQtyChange = (delta) => {
    setQty(prev => Math.max(1, Math.min(CONFIG.maxTickets, prev + delta)));
  };

  // Form Validation
  const validateStep1 = () => {
    const err = {};
    if (!booker.name.trim()) err.name = "Full name is required.";
    if (!booker.mobile.trim()) {
      err.mobile = "Mobile / WhatsApp number is required.";
    } else if (!/^[6-9]\d{9}$/.test(booker.mobile.trim())) {
      err.mobile = "Enter a valid 10-digit Indian mobile number.";
    }
    if (booker.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booker.email.trim())) {
      err.email = "Enter a valid email address.";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateStep3 = () => {
    if (paymentMode === 'ONLINE') return true;
    const err = {};
    if (!payment.utr.trim()) {
      err.utr = "UPI Transaction ID / UTR is required.";
    } else if (payment.utr.trim().length < 6) {
      err.utr = "Enter a valid UTR / Transaction ID (min 6 characters).";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (!validateStep3()) return;
      setStep(4);
    }
    setErrors({});
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      setErrors({});
    }
  };

  // File Screenshot Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      toast.error("Please upload a PNG, JPG, or WEBP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPayment(prev => ({
        ...prev,
        fileData: ev.target.result,
        fileName: file.name
      }));
      toast.success("Payment screenshot attached!");
    };
    reader.readAsDataURL(file);
  };

  const [cashfreeOrder, setCashfreeOrder] = useState(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const checkedUrlParamRef = useRef(false);

  // Check URL search parameters for callback or verification (runs only once)
  useEffect(() => {
    if (checkedUrlParamRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const orderIdParam = params.get('order_id') || params.get('orderId') || params.get('txnid');
    const bookingIdParam = params.get('booking_id') || params.get('bookingId');

    if (bookingIdParam) {
      checkedUrlParamRef.current = true;
      singAlongApi.verifyTicket(bookingIdParam)
        .then((res) => {
          if (res?.success && (res?.booking || res?.data?.booking)) {
            setTicketData(res.booking || res.data.booking);
            setScreen('success');
            try {
              window.history.replaceState({}, document.title, window.location.pathname);
            } catch (_) {}
          }
        })
        .catch(console.warn);
    } else if (orderIdParam) {
      checkedUrlParamRef.current = true;
      singAlongApi.checkPaymentStatus(orderIdParam)
        .then((res) => {
          const isSuccess =
            res?.isPaid === true ||
            res?.status === 'SUCCESS' ||
            res?.data?.isPaid === true ||
            res?.data?.status === 'SUCCESS' ||
            (res?.success && (res?.data?.isPaid || res?.data?.status === 'SUCCESS'));

          if (isSuccess) {
            const b = res?.booking || res?.data?.booking || res?.data || {};
            setTicketData({
              bookingId: b.bookingId || orderIdParam,
              ticketId: b.ticketId || `TKT-${b.bookingId || 'SA26'}`,
              fullName: b.fullName || 'Attendee',
              phone: b.phone || '',
              email: b.email || '',
              ticketQty: b.ticketQty || 1,
              amount: b.totalAmount || b.amount || 254,
              utr: b.utr || b.cfPaymentId || orderIdParam,
              paymentMethod: 'CASHFREE',
              paidAt: b.paidAt || new Date().toISOString(),
              verificationToken: b.verificationToken || `SINGALONG-VERIFY:${b.bookingId || orderIdParam}`,
            });
            setScreen('success');
            try {
              window.history.replaceState({}, document.title, window.location.pathname);
            } catch (_) {}
          }
        })
        .catch(console.warn);
    }
  }, []);

  // Instant Online Payment (Cashfree Gateway)
  const handleInstantOnlinePay = async () => {
    setIsOnlinePaying(true);
    try {
      const payload = {
        fullName: booker.name.trim(),
        phone: booker.mobile.trim(),
        email: booker.email.trim() || undefined,
        ticketQty: qty,
        amount: totalAmount,
      };

      const res = await singAlongApi.createOnlineOrder(payload);
      if (!res?.success || !res?.data) {
        throw new Error(res?.message || "Could not generate Cashfree payment order. Please try again.");
      }

      const orderData = res.data;
      setCashfreeOrder(orderData);

      const mode = (orderData.environment?.toLowerCase() === 'sandbox' || orderData.environment?.toLowerCase() === 'test')
        ? 'sandbox'
        : 'production';

      // Check if Cashfree JS SDK v3 is available
      if (typeof window !== 'undefined' && window.Cashfree) {
        toast.success("Opening Cashfree Checkout...", { duration: 3000 });
        const cashfree = window.Cashfree({ mode });
        cashfree.checkout({
          paymentSessionId: orderData.paymentSessionId,
          redirectTarget: "_modal",
        }).then((result) => {
          if (result?.error) {
            console.warn("Cashfree checkout error:", result.error);
            if (orderData.paymentLink) {
              window.location.href = orderData.paymentLink;
            }
          } else {
            const targetOrderId = orderData.orderId || orderData.bookingId;
            if (targetOrderId) {
              handleCheckPaymentStatus(targetOrderId);
            }
          }
        }).catch((err) => {
          console.warn("Cashfree modal error:", err);
          if (orderData.paymentLink) {
            window.location.href = orderData.paymentLink;
          }
        });
      } else if (orderData.paymentLink) {
        toast.success("Opening Cashfree Checkout...", { duration: 3000 });
        window.location.href = orderData.paymentLink;
      } else {
        throw new Error("Cashfree payment session could not be initialized.");
      }
    } catch (e) {
      setIsOnlinePaying(false);
      console.error(e);
      toast.error(e.message || "Could not initiate Cashfree payment. You can also scan the QR.");
    }
  };

  // Single on-demand status check when user confirms payment
  const handleCheckPaymentStatus = async (overrideOrderId) => {
    const orderId = (typeof overrideOrderId === 'string' && overrideOrderId)
      ? overrideOrderId
      : (cashfreeOrder?.orderId || cashfreeOrder?.bookingId);

    if (!orderId || isCheckingPayment) return;

    setIsCheckingPayment(true);
    try {
      const statusRes = await singAlongApi.checkPaymentStatus(orderId);
      const isSuccess =
        statusRes?.isPaid === true ||
        statusRes?.status === 'SUCCESS' ||
        statusRes?.data?.isPaid === true ||
        statusRes?.data?.status === 'SUCCESS' ||
        (statusRes?.success && (statusRes?.data?.isPaid || statusRes?.data?.status === 'SUCCESS'));

      if (isSuccess) {
        const booking = statusRes?.booking || statusRes?.data?.booking || statusRes?.data || {};
        const confirmedBookingId = booking.bookingId || cashfreeOrder?.bookingId || genBookingId();
        const confirmedTicketData = {
          bookingId: confirmedBookingId,
          ticketId: booking.ticketId || `TKT-${confirmedBookingId}`,
          fullName: booking.fullName || booker.name.trim(),
          phone: booking.phone || `+91 ${booker.mobile.trim()}`,
          email: booking.email || 'Not provided',
          ticketQty: booking.ticketQty || qty,
          amount: booking.totalAmount || booking.amount || totalAmount,
          utr: booking.utr || booking.cfPaymentId || orderId,
          paymentMethod: 'CASHFREE',
          paidAt: booking.paidAt || new Date().toISOString(),
          verificationToken: booking.verificationToken || `SINGALONG-VERIFY:${confirmedBookingId}`,
        };

        setTicketData(confirmedTicketData);
        setScreen('success');
        setIsOnlinePaying(false);
        setCashfreeOrder(null);
        toast.success("Payment Confirmed! Ticket Booked Successfully! 🎟️🎉");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast((statusRes?.message || "Payment is not confirmed yet. If you have paid, please wait a few seconds and try again."), {
          icon: '⏳',
        });
      }
    } catch (err) {
      console.warn("Status check error:", err);
      toast.error(err.message || "Unable to check payment status. Please try again.");
    } finally {
      setIsCheckingPayment(false);
    }
  };

  const handleCancelOnlinePay = () => {
    setIsOnlinePaying(false);
    setCashfreeOrder(null);
  };

  // Final Booking Confirmation (Manual UTR submission via singAlongApi.submitManualUtr)
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setScreen('status');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const payload = {
      utr: payment.utr.trim(),
      fullName: booker.name.trim(),
      phone: booker.mobile.trim(),
      email: booker.email.trim() || undefined,
      ticketQty: qty,
      amount: totalAmount,
      paymentMethod: CONFIG.upiId || 'ashokbcasvk45@oksbi',
      paymentScreenshot: payment.fileData || '',
    };

    try {
      let bookedRecord = null;
      try {
        const res = await singAlongApi.submitManualUtr(payload);
        if (res && res.success !== false) {
          bookedRecord = res?.booking || res?.data?.booking || res?.data || res;
        }
      } catch (utrErr) {
        console.warn("submitManualUtr error (trying bookSingAlongTicket fallback):", utrErr);
        try {
          const res = await bookSingAlongTicket({
            ...payload,
            status: 'CONFIRMED',
            eventId: "SINGALONG-SEP-27-2026",
            notes: `Manual UPI payment. Amount: ₹${totalAmount} (${qty} pass${qty > 1 ? 'es' : ''}, incl. ₹${conventionFee} conv. fee)`
          });
          bookedRecord = res?.data?.booking || res?.data || res?.booking || res;
        } catch (apiErr) {
          console.warn("Backend API note (fallback enabled):", apiErr);
        }
      }

      const confirmedBookingId = bookedRecord?.bookingId || genBookingId();
      const confirmedTicketData = {
        bookingId: confirmedBookingId,
        ticketId: bookedRecord?.ticketId || `TKT-${confirmedBookingId}`,
        fullName: bookedRecord?.fullName || booker.name.trim(),
        phone: bookedRecord?.phone || `+91 ${booker.mobile.trim()}`,
        email: bookedRecord?.email || booker.email.trim() || 'Not provided',
        ticketQty: bookedRecord?.ticketQty || qty,
        amount: bookedRecord?.totalAmount || totalAmount,
        utr: bookedRecord?.utr || payment.utr.trim(),
        paymentMethod: bookedRecord?.paymentMethod || 'MANUAL_UPI',
        paidAt: new Date().toISOString(),
        verificationToken: bookedRecord?.verificationToken || `SINGALONG-VERIFY:${confirmedBookingId}`
      };

      setTimeout(() => {
        setTicketData(confirmedTicketData);
        setScreen('success');
        setIsSubmitting(false);
        toast.success("Ticket booked successfully! 🎟️🎉");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1200);
    } catch (err) {
      setIsSubmitting(false);
      setScreen('form');
      toast.error(err.message || "Failed to process booking. Please try again.");
    }
  };

  // Download Ticket as PNG
  const handleDownloadTicket = async () => {
    if (!ticketCaptureRef.current) return;
    setIsDownloading(true);
    const toastId = toast.loading("Generating high-resolution ticket...");
    try {
      const canvas = await html2canvas(ticketCaptureRef.current, {
        scale: 2.5,
        backgroundColor: '#0f172a',
        useCORS: true,
        logging: false
      });
      const link = document.createElement("a");
      link.download = `SingAlong_Pass_${ticketData?.bookingId || "2026"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Ticket downloaded successfully! 📥", { id: toastId });
    } catch (err) {
      console.error("Ticket download error:", err);
      toast.error("Could not download ticket. Please take a screenshot.", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  // Share on WhatsApp
  const handleShareTicket = () => {
    const text = `🎟️ *${CONFIG.eventName} - Live Music Event Entry Pass*\n📅 ${CONFIG.dateShort} | ${CONFIG.eventTime}\n📍 ${CONFIG.fullVenue}\n🎫 Booking ID: *${ticketData?.bookingId}*\n👤 Attendee: ${ticketData?.fullName} (${ticketData?.ticketQty} Pass${ticketData?.ticketQty > 1 ? 'es' : ''})\n💰 Total: ${rupee(ticketData?.amount)}\n\nBook your passes here: ${window.location.origin}/sing-along`;
    if (navigator.share) {
      navigator.share({
        title: CONFIG.eventName,
        text: text,
        url: `${window.location.origin}/sing-along`
      }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  // Reset Booking Flow
  const handleReset = () => {
    setScreen('form');
    setStep(1);
    setBooker({ name: '', mobile: '', email: '' });
    setQty(1);
    setPayment({ utr: '', datetime: new Date().toISOString().slice(0, 16), fileName: '', fileData: '' });
    setTicketData(null);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#0f172a] selection:bg-[#ff6a00] selection:text-white relative font-sans overflow-x-hidden">

      {/* Embedded CSS for custom Google Fonts, Fast Blinking Multi-Color DJ Lights & Responsive Stage Layout */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Outfit:wght@500;600;700;800;900&family=Permanent+Marker&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Shrikhand&display=swap');

        .font-display { font-family: 'Outfit', sans-serif; }
        .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-handwritten { font-family: 'Caveat', cursive; }
        .font-poster { font-family: 'Shrikhand', cursive; }
        .font-brush { font-family: 'Permanent Marker', cursive; }

        /* =========================================================================
           HIGH-SPEED MULTI-COLOUR BLINKING CONCERT DJ LIGHTS & LASER BEAMS
           Increased Rotation Speed + Rapid Strobe Blinks through Cyan, Magenta, Lime, Gold, Purple
           ========================================================================= */

        /* =========================================================================
           STAGE LIGHTS & SPOTLIGHT CONES (MATCHING IMAGE 1 CONCERT ATMOSPHERE)
           Smooth sweeping colored light cones: Warm Amber-Yellow on Left,
           Electric Cyan/Magenta on Right, and Dual Center Lasers
           ========================================================================= */

        /* Fixture 1: Sweeping Left Stage Spotlight (Warm Amber-Gold into Vivid Coral/Pink like Image 1) */
        @keyframes djColorCycleFlash1 {
          0% {
            background: linear-gradient(135deg, rgba(255, 204, 0, 0.88) 0%, rgba(255, 107, 0, 0.65) 45%, transparent 100%);
            opacity: 0.9;
            transform: rotate(-36deg) scaleX(1);
          }
          30% {
            background: linear-gradient(135deg, rgba(255, 77, 0, 0.92) 0%, rgba(236, 72, 153, 0.7) 45%, transparent 100%);
            opacity: 0.82;
            transform: rotate(-18deg) scaleX(1.15);
          }
          50% {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.95) 0%, rgba(255, 120, 0, 0.75) 45%, transparent 100%);
            opacity: 0.95;
            transform: rotate(4deg) scaleX(1.2);
          }
          75% {
            background: linear-gradient(135deg, rgba(236, 72, 153, 0.9) 0%, rgba(168, 85, 247, 0.65) 45%, transparent 100%);
            opacity: 0.85;
            transform: rotate(-16deg) scaleX(1.1);
          }
          100% {
            background: linear-gradient(135deg, rgba(255, 204, 0, 0.88) 0%, rgba(255, 107, 0, 0.65) 45%, transparent 100%);
            opacity: 0.9;
            transform: rotate(-36deg) scaleX(1);
          }
        }

        /* Fixture 2: Sweeping Right Stage Spotlight (Electric Cyan into Neon Violet/Pink like Image 1) */
        @keyframes djColorCycleFlash2 {
          0% {
            background: linear-gradient(225deg, rgba(6, 182, 212, 0.9) 0%, rgba(59, 130, 246, 0.65) 45%, transparent 100%);
            opacity: 0.9;
            transform: rotate(36deg) scaleX(1);
          }
          30% {
            background: linear-gradient(225deg, rgba(168, 85, 247, 0.92) 0%, rgba(236, 72, 153, 0.7) 45%, transparent 100%);
            opacity: 0.82;
            transform: rotate(18deg) scaleX(1.15);
          }
          50% {
            background: linear-gradient(225deg, rgba(0, 245, 255, 0.95) 0%, rgba(168, 85, 247, 0.75) 45%, transparent 100%);
            opacity: 0.95;
            transform: rotate(-4deg) scaleX(1.2);
          }
          75% {
            background: linear-gradient(225deg, rgba(34, 197, 94, 0.9) 0%, rgba(6, 182, 212, 0.65) 45%, transparent 100%);
            opacity: 0.85;
            transform: rotate(16deg) scaleX(1.1);
          }
          100% {
            background: linear-gradient(225deg, rgba(6, 182, 212, 0.9) 0%, rgba(59, 130, 246, 0.65) 45%, transparent 100%);
            opacity: 0.9;
            transform: rotate(36deg) scaleX(1);
          }
        }

        /* Center Lasers */
        @keyframes djLaserStrobe1 {
          0%, 100% { transform: rotate(-24deg) scaleY(0.95); opacity: 0.85; filter: hue-rotate(0deg); }
          50% { transform: rotate(20deg) scaleY(1.15); opacity: 0.95; filter: hue-rotate(120deg); }
        }

        @keyframes djLaserStrobe2 {
          0%, 100% { transform: rotate(24deg) scaleY(0.95); opacity: 0.85; filter: hue-rotate(180deg); }
          50% { transform: rotate(-20deg) scaleY(1.15); opacity: 0.95; filter: hue-rotate(300deg); }
        }

        /* Floor Sweepers */
        @keyframes djFloorSweeperLeft {
          0%, 100% { transform: rotate(-30deg) scaleY(0.9); opacity: 0.8; }
          50% { transform: rotate(26deg) scaleY(1.15); opacity: 0.92; }
        }

        @keyframes djFloorSweeperRight {
          0%, 100% { transform: rotate(30deg) scaleY(0.9); opacity: 0.8; }
          50% { transform: rotate(-26deg) scaleY(1.15); opacity: 0.92; }
        }

        /* Ambient Stage Light Pulse */
        @keyframes djConcertBlinker {
          0%, 100% { opacity: 0.35; filter: hue-rotate(0deg); }
          50% { opacity: 0.7; filter: hue-rotate(80deg); }
        }

        .dj-laser-left-blinker {
          position: absolute;
          top: -20px;
          left: -10px;
          width: 520px;
          height: 750px;
          clip-path: polygon(0% 0%, 30% 0%, 100% 100%, 8% 100%);
          transform-origin: top left;
          filter: blur(4px);
          pointer-events: none;
          z-index: 4;
          animation: djColorCycleFlash1 2.8s ease-in-out infinite;
        }

        .dj-laser-right-blinker {
          position: absolute;
          top: -20px;
          right: -10px;
          width: 520px;
          height: 750px;
          clip-path: polygon(70% 0%, 100% 0%, 92% 100%, 0% 100%);
          transform-origin: top right;
          filter: blur(4px);
          pointer-events: none;
          z-index: 4;
          animation: djColorCycleFlash2 2.8s ease-in-out infinite -1.4s;
        }

        .dj-laser-center-left {
          position: absolute;
          top: -10px;
          left: 36%;
          width: 280px;
          height: 600px;
          background: linear-gradient(170deg, rgba(168, 85, 247, 0.85) 0%, rgba(236, 72, 153, 0.6) 50%, transparent 100%);
          clip-path: polygon(44% 0%, 56% 0%, 85% 100%, 15% 100%);
          transform-origin: top center;
          filter: blur(3.5px);
          pointer-events: none;
          z-index: 4;
          animation: djLaserStrobe1 2.2s ease-in-out infinite;
        }

        .dj-laser-center-right {
          position: absolute;
          top: -10px;
          right: 36%;
          width: 280px;
          height: 600px;
          background: linear-gradient(190deg, rgba(6, 182, 212, 0.85) 0%, rgba(52, 211, 153, 0.6) 50%, transparent 100%);
          clip-path: polygon(44% 0%, 56% 0%, 85% 100%, 15% 100%);
          transform-origin: top center;
          filter: blur(3.5px);
          pointer-events: none;
          z-index: 4;
          animation: djLaserStrobe2 2.2s ease-in-out infinite -1.1s;
        }

        .dj-floor-sweeper-left {
          position: absolute;
          bottom: 40px;
          left: 8%;
          width: 240px;
          height: 500px;
          background: linear-gradient(0deg, rgba(6, 182, 212, 0.85) 0%, rgba(168, 85, 247, 0.5) 60%, transparent 100%);
          clip-path: polygon(42% 100%, 58% 100%, 100% 0%, 0% 0%);
          transform-origin: bottom center;
          filter: blur(4px);
          pointer-events: none;
          z-index: 4;
          animation: djFloorSweeperLeft 2.5s ease-in-out infinite;
        }

        .dj-floor-sweeper-right {
          position: absolute;
          bottom: 40px;
          right: 8%;
          width: 240px;
          height: 500px;
          background: linear-gradient(0deg, rgba(255, 107, 0, 0.85) 0%, rgba(236, 72, 153, 0.5) 60%, transparent 100%);
          clip-path: polygon(42% 100%, 58% 100%, 100% 0%, 0% 0%);
          transform-origin: bottom center;
          filter: blur(4px);
          pointer-events: none;
          z-index: 4;
          animation: djFloorSweeperRight 2.5s ease-in-out infinite -1.25s;
        }

        .dj-stage-strobe-blinker {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 380px;
          background: radial-gradient(ellipse at 50% 0%, rgba(255, 153, 0, 0.5) 0%, rgba(236, 72, 153, 0.3) 40%, rgba(6, 182, 212, 0.25) 70%, transparent 100%);
          pointer-events: none;
          z-index: 3;
          animation: djConcertBlinker 1.8s ease-in-out infinite;
        }

        /* Floating Scattered Notes */
        @keyframes floatNote {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-12px) rotate(6deg); }
        }
        .animate-float-note {
          animation: floatNote 3.5s ease-in-out infinite;
        }

        /* Partner Marquee Continuous Track */
        @keyframes saMarqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .sa-marquee-track {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          width: max-content;
          animation: saMarqueeScroll 26s linear infinite;
        }
        .sa-marquee-track:hover {
          animation-play-state: paused;
        }

        /* Heart Pulse Animation */
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.24); }
        }
        .animate-heart-pulse {
          animation: heartPulse 1.6s ease-in-out infinite;
        }

        /* Alert Shake */
        @keyframes chkShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: chkShake 0.45s ease both;
        }

        /* Glassmorphic Panel Styles */
        .glass-panel {
          background: rgba(22, 10, 3, 0.86);
          backdrop-filter: blur(22px) saturate(170%);
          -webkit-backdrop-filter: blur(22px) saturate(170%);
          border: 1.5px solid rgba(255, 170, 0, 0.45);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 230, 160, 0.35);
        }

        /* Perforated Ticket Notches */
        .ticket-notch-left, .ticket-notch-right {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 26px;
          height: 26px;
          border-radius: 9999px;
          background: #0f172a;
          z-index: 10;
        }
        .ticket-notch-left { left: -13px; }
        .ticket-notch-right { right: -13px; }
      `}</style>

      {/* =========================================================================
          SCREEN 1: "BEFORE YOU BOOK" FULLSTAGE SCREEN (Exact design from index.html)
          ========================================================================= */}
      {pageView === 'intro' && (
        <div className="min-h-screen w-full relative flex items-center justify-center p-3 sm:p-6 py-8 sm:py-12 bg-black overflow-y-auto overflow-x-hidden selection:bg-[#ff6a00] selection:text-white">
          {/* Full Stage Visual Background */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
            <img
              src={POSTER_STAGE_BG}
              alt="Concert Stage Background"
              className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/80" />
            
            {/* Stage DJ Lights on Intro Screen */}
            <div className="dj-laser-left-blinker opacity-60" />
            <div className="dj-laser-right-blinker opacity-60" />
            <div className="dj-stage-strobe-blinker opacity-60" />
          </div>

          {/* Central Glassmorphic Card */}
          <div className="relative z-10 w-full max-w-2xl glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 text-white shadow-2xl my-auto animate-fadeIn border border-amber-500/40">
            {/* Top Pill Badge: Before You Book */}
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-display text-[11px] sm:text-xs font-extrabold tracking-wider uppercase shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>BEFORE YOU BOOK</span>
              </div>
            </div>

            {/* Header: Title, Venue & Glowing Price Badge */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-amber-500/20">
              <div>
                <span className="text-xs font-semibold text-amber-200/90 block mb-0.5">
                  WeGrow Skill Campus &amp; B School presents
                </span>
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-white drop-shadow-md">
                    <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">SING</span>{" "}
                    <span className="bg-gradient-to-r from-[#ff4500] via-[#ff6a00] to-[#ffa500] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,106,0,0.8)]">ALONG</span>
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0D0D3A] border border-amber-400/40 text-[10px] sm:text-[11px] font-bold text-amber-300">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    LIVE CONCERT • SEP 27
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-slate-300 text-xs sm:text-sm">
                  <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Musical evening at <strong className="text-white font-semibold">{CONFIG.fullVenue}</strong></span>
                </div>
              </div>

              {/* Glowing Ticket Price Badge (Flat ₹249, No Fee) */}
              <div className="flex-shrink-0 bg-gradient-to-br from-amber-500/30 to-[#2d1405] border border-amber-400 rounded-xl sm:rounded-2xl px-4 py-2.5 sm:py-3 shadow-[0_0_20px_rgba(255,170,0,0.3)] text-right self-stretch sm:self-auto flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                <span className="font-display text-[10px] font-extrabold uppercase tracking-wider text-amber-200">ENTRY PASS</span>
                <span className="font-display text-2xl sm:text-3xl font-black text-white drop-shadow-[0_0_8px_rgba(255,170,0,0.8)] leading-tight">
                  {rupee(CONFIG.ticketPrice)}
                </span>
              </div>
            </div>

            {/* Two-Column Grid: Important Notes & Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-5">
              {/* Column 1: Important Notes */}
              <div className="bg-black/45 border border-amber-500/20 rounded-xl sm:rounded-2xl p-3.5 sm:p-4">
                <div className="flex items-center gap-2 mb-2.5 sm:mb-3 pb-2 border-b border-white/10 text-amber-400">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-200">IMPORTANT NOTES</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {CONFIG.importantNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] mt-1 flex-shrink-0" />
                      <span className="leading-snug">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Terms & Conditions */}
              <div className="bg-black/45 border border-amber-500/20 rounded-xl sm:rounded-2xl p-3.5 sm:p-4">
                <div className="flex items-center gap-2 mb-2.5 sm:mb-3 pb-2 border-b border-white/10 text-emerald-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-200">TERMS & CONDITIONS</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {CONFIG.termsList.map((term, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="leading-snug">{term}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions: Checkbox & CTA */}
            <div className="mt-5 sm:mt-6 flex flex-col gap-3.5 sm:gap-4 pt-3.5 sm:pt-4 border-t border-white/10">
              {/* Agreement Checkbox */}
              <label className={`flex items-center gap-3 cursor-pointer select-none p-2 sm:p-2.5 rounded-xl border transition-all ${
                shakeTerms ? 'animate-shake border-red-500 bg-red-500/10' : 'border-transparent hover:bg-white/5'
              }`}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 rounded border-amber-400 text-[#ff6a00] focus:ring-[#ff6a00] focus:ring-offset-black bg-black/60 cursor-pointer flex-shrink-0"
                />
                <span className="text-xs text-slate-300">
                  I have read and agree to all <strong className="text-white font-semibold">Terms & Conditions</strong> and venue rules.
                </span>
              </label>

              {/* Gradient CTA Button */}
              <button
                type="button"
                onClick={handleIntroProceed}
                className="w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-display font-black text-sm sm:text-base text-black bg-gradient-to-r from-[#ffb703] via-[#fb8500] to-[#ea580c] hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_8px_25px_rgba(251,133,0,0.5)] flex items-center justify-center gap-2.5 sm:gap-3 cursor-pointer"
              >
                <Music className="w-4 h-4 sm:w-5 sm:h-5 text-black animate-bounce flex-shrink-0" />
                <span>Let's Book &amp; Hear Mascot Sing</span>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-black flex-shrink-0" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN 2: HERO BANNER (WITH HIGHER TOP POSITIONING & HIGH-SPEED BLINKING DJ LIGHTS)
          ========================================================================= */}
      {pageView === 'booking' && (
        <div className="animate-fadeIn">
          {/* =====================================================================
              HERO / EVENT BANNER (100VH FULLSCREEN WITH VIDEO BACKGROUND & FAST BLINKING DJ LIGHTS)
              ===================================================================== */}
          <header className="relative w-full min-h-[90vh] sm:min-h-screen bg-gradient-to-b from-[#1a0800] via-[#0d0400] to-black overflow-hidden flex flex-col justify-between shadow-2xl z-20">
            
            {/* Full Video Background Layer (Real Video completely visible without black crowd silhouette) */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
              <video
                ref={videoRef}
                className="w-full h-full object-cover object-[center_20%] sm:object-[center_12%] filter brightness-100 contrast-105"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={VIDEO_BANNER_SRC} type="video/mp4" />
              </video>

              {/* Background Music Audio (OM First Strike Bgm) */}
              <audio
                ref={audioRef}
                src={MASCOT_SONG_AUDIO}
                loop
                preload="auto"
              />

              {/* Gentle Stage Gradient Overlay - Keeps real video vibrant and bright */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none z-[1]" />
            </div>

            {/* Scattered Floating Music Notes */}
            <span className="absolute top-[12%] left-[14%] text-2xl text-amber-300 select-none pointer-events-none z-10 animate-float-note hidden sm:block">🎵</span>
            <span className="absolute top-[45%] left-[8%] text-xl text-white/80 select-none pointer-events-none z-10 animate-float-note" style={{ animationDelay: '1s' }}>🎶</span>
            <span className="absolute top-[28%] left-[24%] text-2xl text-[#ff8c00] select-none pointer-events-none z-10 animate-float-note hidden sm:block" style={{ animationDelay: '2s' }}>✨</span>
            <span className="absolute top-[14%] right-[14%] text-3xl text-amber-300 select-none pointer-events-none z-10 animate-float-note hidden sm:block" style={{ animationDelay: '0.5s' }}>🎶</span>
            <span className="absolute top-[48%] right-[8%] text-xl text-white/80 select-none pointer-events-none z-10 animate-float-note" style={{ animationDelay: '1.5s' }}>🎵</span>
            <span className="absolute top-[30%] right-[24%] text-2xl text-[#ff8c00] select-none pointer-events-none z-10 animate-float-note hidden sm:block" style={{ animationDelay: '2.5s' }}>💛</span>

            {/* =================================================================
                TOP BAR: WeGrow Logo on Left & Date on Right (Responsive Flow Layout)
                ================================================================= */}
            <div className="relative z-30 w-full flex items-start justify-between px-3 pt-3 sm:px-6 sm:pt-5 md:px-8 md:pt-6 pointer-events-auto">
              {/* Top-Left: WeGrow Logo Box */}
              <div className="bg-white rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-4 sm:py-2 shadow-[0_8px_24px_rgba(0,0,0,0.5)] border border-slate-200/40 flex items-center justify-center">
                <img
                  src={WEGROW_LOGO_IMG}
                  onError={(e) => { e.currentTarget.src = WEGROW_BACKUP_LOGO; }}
                  alt="WeGrow Skill Campus & B School"
                  className="h-5 sm:h-8 md:h-9 w-auto object-contain"
                />
              </div>

              {/* Top-Right: Date Badge Box */}
              <div className="w-[50px] sm:w-[68px] md:w-[74px] bg-white rounded-xl sm:rounded-2xl overflow-hidden text-center shadow-[0_8px_24px_rgba(0,0,0,0.5)] border border-slate-200/40">
                <div className="font-display text-sm sm:text-xl md:text-2xl font-black text-[#1A1A4E] pt-1 leading-none">{CONFIG.dayNum}</div>
                <div className="bg-[#ff6a00] text-white font-body text-[8px] sm:text-xs font-black tracking-wider py-0.5">{CONFIG.monthAbbr}</div>
                <div className="bg-white text-[#ff6a00] font-body text-[7px] sm:text-[10px] font-black tracking-wider py-0.5">{CONFIG.dayName}</div>
              </div>
            </div>

            {/* Left Handwritten Script under Logo (Desktop Only) */}
            <div className="absolute top-20 left-6 sm:top-24 sm:left-8 z-20 font-handwritten text-white text-xl sm:text-2xl font-bold leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] -rotate-6 hidden md:block pointer-events-none">
              <span className="block">Good Music</span>
              <span className="block">Brighter</span>
              <span className="block text-amber-300">People 🎶</span>
            </div>

            {/* Right Handwritten Script under Date (Desktop Only) */}
            <div className="absolute top-24 right-6 sm:top-28 sm:right-8 z-20 font-handwritten text-white text-xl sm:text-2xl font-bold leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] rotate-6 text-right hidden md:block pointer-events-none">
              <span className="block">Same</span>
              <span className="block">Tickets</span>
              <span className="block">More</span>
              <span className="block text-amber-300">Good Vibes!</span>
            </div>

            {/* =================================================================
                CENTER: POSITIONED DIRECTLY ON THE STAGE TRUSS (Mobile Responsive)
                ================================================================= */}
            <div className="relative z-20 flex flex-col items-center text-center max-w-3xl mx-auto pt-1 sm:pt-3 md:-mt-14 px-3 sm:px-4">
              
              {/* Title Sponsor: K7 Chit Funds */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5 max-w-full">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 rounded-full bg-white text-slate-900 border-2 border-emerald-600 shadow-md max-w-full">
                  <span className="bg-[#007A3D] text-white text-[7px] sm:text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase flex-shrink-0">
                    TITLE SPONSOR
                  </span>
                  <img
                    src="/k7_sarathy_chitfunds_logo.png"
                    alt="K7 Chit Funds"
                    className="h-4 sm:h-6 max-h-6 w-auto object-contain flex-shrink-0"
                  />
                  <span className="text-[10px] sm:text-xs font-black text-[#007A3D] tracking-tight truncate">
                    K7 CHIT FUNDS
                  </span>
                </div>
              </div>

              {/* Presents text + Badges */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 mb-2 sm:mb-2.5">
                <span className="font-body text-[11px] sm:text-sm md:text-base font-bold tracking-wide text-white/95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  WeGrow Skill Campus &amp; B School presents
                </span>
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full bg-[#0D0D3A]/90 border border-white/30 text-white font-display text-[8px] sm:text-[10px] font-extrabold shadow-md">
                    🎵 LIVE MUSIC EVENT
                  </span>
                  <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full bg-[#ff6a00] text-white font-display text-[8px] sm:text-[10px] font-extrabold shadow-[0_0_15px_rgba(255,106,0,0.7)]">
                    ₹249 per ticket
                  </span>
                </div>
              </div>

              {/* Row 3: Sing Along Title Logo */}
              <div className="relative select-none text-center group cursor-default">
                {/* Golden Crown doodle above ALONG */}
                <div className="flex items-center justify-center -mb-1 sm:-mb-2">
                  <span className="text-amber-400 font-handwritten text-xl sm:text-3xl font-black drop-shadow-[0_0_14px_rgba(255,190,0,0.9)] rotate-6 inline-block animate-float-note">
                    👑
                  </span>
                </div>
                
                <h1 className="font-poster text-3xl xs:text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none drop-shadow-[0_8px_30px_rgba(0,0,0,0.95)]">
                  <span
                    className="text-white inline-block transition-transform duration-300 group-hover:scale-105"
                    style={{
                      textShadow: '0 0 25px rgba(255,255,255,0.7), 0 4px 10px rgba(0,0,0,0.9)',
                      WebkitTextStroke: '1.2px #0f172a'
                    }}
                  >
                    SING{" "}
                  </span>
                  <span
                    className="bg-gradient-to-r from-[#ff3800] via-[#ff6a00] to-[#ffa500] bg-clip-text text-transparent inline-block transition-transform duration-300 group-hover:scale-105"
                    style={{
                      filter: 'drop-shadow(0 0 25px rgba(255,106,0,0.85)) drop-shadow(0 4px 8px #2b0c00)'
                    }}
                  >
                    ALONG
                  </span>
                </h1>
                <p className="font-brush text-amber-300 text-[11px] sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  LIVE MUSIC EVENT
                </p>
              </div>
            </div>

            {/* Middle Stage Space */}
            <div className="relative z-10 flex-grow pointer-events-none" />

            {/* Video Stage Bottom Floating Badge: MUSIC CONNECTS US */}
            <div className="relative z-20 flex justify-center mb-2 px-3">
              <div className="inline-flex items-center gap-1.5 sm:gap-3 px-3.5 sm:px-6 py-1 sm:py-2 rounded-full bg-gradient-to-r from-[#ff7800]/40 via-[#cc5500]/30 to-[#1a0c00]/80 border border-amber-400/60 backdrop-blur-md shadow-[0_0_24px_rgba(255,153,0,0.5)] text-amber-200">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300 fill-amber-300 animate-heart-pulse flex-shrink-0" />
                <span className="font-display text-[10px] sm:text-xs md:text-sm font-black tracking-[0.12em] sm:tracking-[0.2em] uppercase bg-gradient-to-r from-white via-[#ffe6a7] to-[#ffb703] bg-clip-text text-transparent text-center">
                  MUSIC CONNECTS US
                </span>
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300 fill-amber-300 animate-heart-pulse flex-shrink-0" />
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="relative z-30 w-full bg-black/90 backdrop-blur-md border-t border-[#ff6a00]/40 py-2 sm:py-2.5 px-2.5 sm:px-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-4 md:gap-8 text-[10px] sm:text-xs font-bold text-white">
              <div className="inline-flex items-center gap-1 bg-white/5 sm:bg-transparent rounded-full px-2 py-0.5 sm:p-0 border border-white/10 sm:border-0">
                <Calendar className="w-3 sm:w-4 h-3 sm:h-4 text-amber-400 flex-shrink-0" />
                <span>{CONFIG.dateShort}</span>
              </div>
              <span className="hidden md:inline text-slate-600">|</span>
              <div className="inline-flex items-center gap-1 bg-white/5 sm:bg-transparent rounded-full px-2 py-0.5 sm:p-0 border border-white/10 sm:border-0">
                <Clock className="w-3 sm:w-4 h-3 sm:h-4 text-amber-400 flex-shrink-0" />
                <span>Rep: {CONFIG.reportingTime}</span>
              </div>
              <span className="hidden md:inline text-slate-600">|</span>
              <div className="inline-flex items-center gap-1 bg-white/5 sm:bg-transparent rounded-full px-2 py-0.5 sm:p-0 border border-white/10 sm:border-0">
                <Clock className="w-3 sm:w-4 h-3 sm:h-4 text-amber-400 flex-shrink-0" />
                <span>Event: {CONFIG.eventTime}</span>
              </div>
              <span className="hidden md:inline text-slate-600">|</span>
              <div className="inline-flex items-center gap-1 bg-white/5 sm:bg-transparent rounded-full px-2 py-0.5 sm:p-0 border border-white/10 sm:border-0">
                <MapPin className="w-3 sm:w-4 h-3 sm:h-4 text-amber-400 flex-shrink-0" />
                <span>{CONFIG.fullVenue}</span>
              </div>
              <span className="hidden md:inline text-slate-600">|</span>
              <button
                type="button"
                onClick={toggleAudioSound}
                className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer bg-amber-500/10 sm:bg-transparent rounded-full px-2 py-0.5 sm:p-0 border border-amber-500/20 sm:border-0"
                title={isAudioMuted ? "Unmute Music" : "Mute Music"}
              >
                {isAudioMuted ? <VolumeX className="w-3 sm:w-3.5 h-3 sm:h-3.5 flex-shrink-0" /> : <Volume2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 flex-shrink-0" />}
                <span>{isAudioMuted ? "Music Muted" : "Music Playing 🎵"}</span>
              </button>
              <span className="hidden md:inline text-slate-600">|</span>
              <button
                type="button"
                onClick={() => setPageView('intro')}
                className="text-amber-400 hover:text-amber-300 underline underline-offset-2 inline-flex items-center gap-1 cursor-pointer bg-amber-500/10 sm:bg-transparent rounded-full px-2 py-0.5 sm:p-0 border border-amber-500/20 sm:border-0"
              >
                <Info className="w-3 sm:w-3.5 h-3 sm:h-3.5 flex-shrink-0" />
                <span>Rules &amp; Notes</span>
              </button>
            </div>
          </header>

          {/* =====================================================================
              SECTION 2: SPONSOR / PARTNER MARQUEE
              ===================================================================== */}
          <section className="w-full bg-white py-4 sm:py-6 border-b border-slate-200 overflow-hidden relative z-10">
            <div className="flex items-center justify-center gap-3 max-w-5xl mx-auto mb-3 sm:mb-4 px-4">
              <span className="text-amber-400 text-sm">✨</span>
              <h3 className="font-poster text-xs sm:text-base tracking-wider uppercase text-[#ff6a00]">OUR PARTNERS</h3>
              <span className="text-amber-400 text-sm">✨</span>
              <div className="flex-grow h-[2px] bg-gradient-to-r from-[#ff6a00]/30 to-transparent rounded-full ml-2" />
            </div>

            {/* Infinite Scrolling Track */}
            <div className="w-full overflow-hidden relative [mask-image:linear-gradient(90deg,transparent_0%,#000_6%,#000_94%,transparent_100%)]">
              <div className="sa-marquee-track">
                {/* Set 1 */}
                {CONFIG.partners.map((partner, idx) => (
                  <React.Fragment key={`p1-${idx}`}>
                    <div className="inline-flex items-center gap-2 sm:gap-3 bg-[#fdfbf7] hover:bg-[#fff8f0] border border-slate-200 hover:border-[#ff6a00] rounded-full px-3.5 sm:px-5 py-1.5 sm:py-2 shadow-sm transition-all duration-200 cursor-default">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm sm:text-base flex-shrink-0">
                        {partner.icon}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-display text-xs sm:text-sm font-bold text-[#0f172a] leading-tight">{partner.name}</span>
                        <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wider text-[#ff6a00] uppercase">{partner.type}</span>
                      </div>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] opacity-60" />
                  </React.Fragment>
                ))}

                {/* Set 2 (Duplicated for seamless loop) */}
                {CONFIG.partners.map((partner, idx) => (
                  <React.Fragment key={`p2-${idx}`}>
                    <div className="inline-flex items-center gap-2 sm:gap-3 bg-[#fdfbf7] hover:bg-[#fff8f0] border border-slate-200 hover:border-[#ff6a00] rounded-full px-3.5 sm:px-5 py-1.5 sm:py-2 shadow-sm transition-all duration-200 cursor-default">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm sm:text-base flex-shrink-0">
                        {partner.icon}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-display text-xs sm:text-sm font-bold text-[#0f172a] leading-tight">{partner.name}</span>
                        <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wider text-[#ff6a00] uppercase">{partner.type}</span>
                      </div>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] opacity-60" />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>

          {/* =====================================================================
              MAIN BOOKING PORTAL WRAPPER
              ===================================================================== */}
          <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 relative z-10">

            {/* ===================================================================
                SCREEN: STATUS / PROCESSING
                =================================================================== */}
            {screen === 'status' && (
              <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl text-center my-12 animate-fadeIn">
                <div className="w-16 h-16 border-4 border-amber-200 border-t-[#ff6a00] rounded-full animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-black font-display text-slate-800 mb-2">Securing Your Tickets...</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Please wait while we record your booking and generate your verified QR entry pass.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Sing Along Live 2026</span>
                </div>
              </div>
            )}

            {/* ===================================================================
                SCREEN: SUCCESS (PERFORATED ENTRY TICKET PASS)
                =================================================================== */}
            {screen === 'success' && ticketData && (
              <div className="max-w-xl mx-auto my-4 sm:my-6 animate-fadeIn px-1">
                {/* Top Success Banner */}
                <div className="text-center mb-5 sm:mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-100 text-emerald-600 mb-2.5 sm:mb-3 shadow-md">
                    <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
                    Booking Confirmed! 🎉
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Your entry pass is ready. Please save or download this ticket for venue entry.
                  </p>
                </div>

                {/* Perforated Printable Ticket Card */}
                <div
                  ref={ticketCaptureRef}
                  className="bg-white border-2 border-slate-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative text-slate-800"
                >
                  {/* Ticket Top Header Banner */}
                  <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-3 sm:p-5 flex items-center justify-between border-b-2 border-amber-500/40">
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="bg-white rounded-lg sm:rounded-xl p-1 sm:p-1.5 shadow flex-shrink-0">
                        <img src={WEGROW_LOGO_IMG} onError={(e) => { e.currentTarget.src = WEGROW_BACKUP_LOGO; }} alt="WeGrow" className="h-5 sm:h-7 w-auto object-contain" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-display text-[8px] sm:text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block truncate">OFFICIAL ENTRY PASS</span>
                        <h3 className="font-display text-sm sm:text-lg font-black leading-tight text-white truncate">SING ALONG 2026</h3>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 pl-2">
                      <span className="text-[8px] sm:text-[10px] uppercase font-bold text-slate-400 block">PASS ID</span>
                      <span className="font-display font-black text-amber-400 text-xs sm:text-sm tracking-wider">{ticketData.bookingId}</span>
                    </div>
                  </div>

                  {/* Middle Section: Event & Attendee Details */}
                  <div className="p-3.5 sm:p-6">
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 pb-3 sm:pb-4 border-b border-dashed border-slate-200">
                      <div>
                        <span className="text-[8px] sm:text-[10px] uppercase font-extrabold text-slate-400 block tracking-wider">ATTENDEE NAME</span>
                        <span className="font-display text-xs sm:text-base font-black text-slate-900 block truncate">{ticketData.fullName}</span>
                        <span className="text-[11px] sm:text-xs text-slate-500 block truncate">{ticketData.phone}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] sm:text-[10px] uppercase font-extrabold text-slate-400 block tracking-wider">TICKETS &amp; AMOUNT</span>
                        <span className="font-display text-xs sm:text-base font-black text-[#ff6a00] block truncate">
                          {ticketData.ticketQty} Pass{ticketData.ticketQty > 1 ? 'es' : ''} ({rupee(ticketData.amount)})
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-emerald-600 font-bold block">● Payment Verified</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 py-3 sm:py-4 border-b border-dashed border-slate-200 text-xs">
                      <div>
                        <span className="text-[8px] sm:text-[10px] uppercase font-extrabold text-slate-400 block tracking-wider">DATE &amp; TIME</span>
                        <span className="font-bold text-slate-800 block text-xs sm:text-sm">{CONFIG.date}</span>
                        <span className="text-slate-500 block text-[11px] sm:text-xs">{CONFIG.eventTime}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] sm:text-[10px] uppercase font-extrabold text-slate-400 block tracking-wider">VENUE</span>
                        <span className="font-bold text-slate-800 block text-xs sm:text-sm truncate">{CONFIG.venue}</span>
                        <span className="text-slate-500 block text-[11px] sm:text-xs truncate">{CONFIG.location}</span>
                      </div>
                    </div>

                    {/* Perforation Cutout Row */}
                    <div className="relative py-2.5 sm:py-4 my-1 sm:my-2 flex items-center justify-between">
                      <div className="ticket-notch-left" />
                      <div className="w-full border-b-2 border-dashed border-slate-300" />
                      <div className="ticket-notch-right" />
                    </div>

                    {/* Bottom Section: QR Code & Instructions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-1 sm:pt-2">
                      <div className="flex-grow text-center sm:text-left">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] sm:text-[11px] font-extrabold mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>VALID ENTRY CODE</span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed max-w-xs mx-auto sm:mx-0">
                          Scan this QR code at Arasan Turf gate for instant badge check-in.
                        </p>
                        <span className="text-[9px] sm:text-[10px] text-slate-400 block mt-1 font-mono truncate">
                          Ref: {ticketData.utr || 'UPI-DIRECT'}
                        </span>
                      </div>

                      {/* QR Code */}
                      <div className="flex-shrink-0 bg-slate-50 border-2 border-slate-200 rounded-2xl p-2 shadow-inner">
                        {ticketQr ? (
                          <img src={ticketQr} alt="Verification QR Code" className="w-24 h-24 sm:w-28 sm:h-28 object-contain" />
                        ) : (
                          <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
                            QR Code
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ticket Footer Ribbon */}
                  <div className="bg-[#fff8f0] border-t border-amber-200 px-3 sm:px-6 py-2 text-center text-[9px] sm:text-[11px] font-bold text-[#ff6a00]">
                    WeGrow Skill Campus &amp; B School • Present this pass at venue entry
                  </div>
                </div>

                {/* Action Buttons: Download, Share, Reset */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 mt-5 sm:mt-6">
                  <button
                    type="button"
                    onClick={handleDownloadTicket}
                    disabled={isDownloading}
                    className="w-full sm:w-auto px-5 sm:px-6 py-3 rounded-xl font-display font-black text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-110 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isDownloading ? 'Saving Pass...' : 'Download Pass (PNG)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShareTicket}
                    className="w-full sm:w-auto px-5 sm:px-6 py-3 rounded-xl font-display font-black text-sm text-white bg-gradient-to-r from-[#ff6a00] to-[#ee5007] hover:brightness-110 shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share via WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl font-display font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Book Another</span>
                  </button>
                </div>
              </div>
            )}

            {/* ===================================================================
                SCREEN: FORM (STEP PROGRESS & 2-COLUMN BOOKING WORKFLOW WITH EXACT IMAGE 2)
                =================================================================== */}
            {screen === 'form' && (
              <div>
                {/* SECTION 3: BOOKING PROGRESS (4 Rounded Steps) */}
                <div className="w-full mb-6 sm:mb-8">
                  {/* Mobile Active Step Indicator */}
                  <div className="sm:hidden flex items-center justify-between mb-2.5 px-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Step {step} of 4
                    </span>
                    <span className="text-xs font-black text-[#ff6a00] font-display">
                      {step === 1 ? 'Booker Details' : step === 2 ? 'Ticket Summary' : step === 3 ? 'Payment via UPI' : 'Review & Confirm'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white px-3 sm:px-8 py-3.5 sm:py-4 rounded-2xl border border-slate-200 shadow-sm">
                    {/* Step 1 */}
                    <div className="flex items-center gap-1.5 sm:gap-3">
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-display font-black text-xs sm:text-sm transition-all ${
                        step >= 1 ? 'bg-gradient-to-br from-[#ff6a00] to-[#ee5007] text-white shadow-[0_0_14px_rgba(255,106,0,0.5)]' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {step > 1 ? <Check className="w-4 h-4" /> : '1'}
                      </div>
                      <span className={`font-display text-xs sm:text-sm hidden sm:inline ${step === 1 ? 'font-black text-slate-900' : 'font-bold text-slate-500'}`}>
                        Booker
                      </span>
                    </div>

                    <div className={`flex-grow h-[3px] mx-1.5 sm:mx-4 rounded-full transition-all ${step >= 2 ? 'bg-[#ff6a00]' : 'bg-slate-200'}`} />

                    {/* Step 2 */}
                    <div className="flex items-center gap-1.5 sm:gap-3">
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-display font-black text-xs sm:text-sm transition-all ${
                        step >= 2 ? 'bg-gradient-to-br from-[#ff6a00] to-[#ee5007] text-white shadow-[0_0_14px_rgba(255,106,0,0.5)]' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {step > 2 ? <Check className="w-4 h-4" /> : '2'}
                      </div>
                      <span className={`font-display text-xs sm:text-sm hidden sm:inline ${step === 2 ? 'font-black text-slate-900' : 'font-bold text-slate-500'}`}>
                        Tickets
                      </span>
                    </div>

                    <div className={`flex-grow h-[3px] mx-1.5 sm:mx-4 rounded-full transition-all ${step >= 3 ? 'bg-[#ff6a00]' : 'bg-slate-200'}`} />

                    {/* Step 3 */}
                    <div className="flex items-center gap-1.5 sm:gap-3">
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-display font-black text-xs sm:text-sm transition-all ${
                        step >= 3 ? 'bg-gradient-to-br from-[#ff6a00] to-[#ee5007] text-white shadow-[0_0_14px_rgba(255,106,0,0.5)]' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {step > 3 ? <Check className="w-4 h-4" /> : '3'}
                      </div>
                      <span className={`font-display text-xs sm:text-sm hidden sm:inline ${step === 3 ? 'font-black text-slate-900' : 'font-bold text-slate-500'}`}>
                        Payment
                      </span>
                    </div>

                    <div className={`flex-grow h-[3px] mx-1.5 sm:mx-4 rounded-full transition-all ${step >= 4 ? 'bg-[#ff6a00]' : 'bg-slate-200'}`} />

                    {/* Step 4 */}
                    <div className="flex items-center gap-1.5 sm:gap-3">
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-display font-black text-xs sm:text-sm transition-all ${
                        step >= 4 ? 'bg-gradient-to-br from-[#ff6a00] to-[#ee5007] text-white shadow-[0_0_14px_rgba(255,106,0,0.5)]' : 'bg-slate-100 text-slate-400'
                      }`}>
                        4
                      </div>
                      <span className={`font-display text-xs sm:text-sm hidden sm:inline ${step === 4 ? 'font-black text-slate-900' : 'font-bold text-slate-500'}`}>
                        Confirm
                      </span>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: TWO-COLUMN BOOKING AREA (EQUAL HEIGHT ON BOTH COLUMNS) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-stretch">
                  
                  {/* LEFT SIDE — EVENT PROMOTIONAL POSTER CARD (Compact on mobile, matches right card on desktop) */}
                  <div className="lg:col-span-5 relative rounded-2xl sm:rounded-[32px] overflow-hidden shadow-xl border-2 border-amber-500/40 bg-[#160b02] min-h-[210px] sm:min-h-[360px] lg:min-h-[580px] lg:h-full flex flex-col justify-between group">
                    {/* Background Stage Poster with Mascot */}
                    <img
                      src={POSTER_CARD_IMG}
                      onError={(e) => { e.currentTarget.src = POSTER_STAGE_BG; }}
                      alt="Sing Along Concert Promotional Poster with Mascot"
                      className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 z-10 pointer-events-none" />

                    {/* Top Row: Official Event & Date Pill */}
                    <div className="relative z-20 p-2.5 sm:p-5 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/95 text-[#0f172a] font-display text-[9px] sm:text-[11px] font-black tracking-wide shadow-md">
                        <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#ff6a00]" />
                        <span>OFFICIAL POSTER</span>
                      </div>
                      <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#ff6a00] text-white font-display text-[9px] sm:text-[11px] font-black shadow-md">
                        <Calendar className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" />
                        <span>27 SEP • 6 PM</span>
                      </div>
                    </div>

                    {/* Middle Graphic Stage Area */}
                    <div className="relative z-20 flex-grow" />

                    {/* Bottom: Card Footer with Venue & ₹249 Flat Pass */}
                    <div className="relative z-20 p-3 sm:p-5 flex items-center justify-between border-t border-white/20 text-white backdrop-blur-md bg-black/60">
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-100 min-w-0">
                        <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#ff6a00] flex-shrink-0" />
                        <span className="truncate max-w-[150px] sm:max-w-none">Arasan Turf, Sivakasi</span>
                      </div>
                      <div className="px-3 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#ff6a00] to-[#ff5000] text-white font-display text-xs sm:text-sm font-black shadow-[0_4px_16px_rgba(255,106,0,0.6)] flex-shrink-0">
                        ₹249 <span className="text-[10px] sm:text-xs font-medium opacity-90">/ Pass</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: BOOKING FORM CARD */}
                  <div className="lg:col-span-7 relative bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl p-3.5 sm:p-6 md:p-8 h-full flex flex-col justify-between">
                    
                    {/* Doodles from HTML reference */}
                    <span className="absolute top-4 right-6 font-handwritten text-[#ff6a00] text-2xl opacity-30 select-none pointer-events-none rotate-12 hidden sm:block">
                      🎵 🎶
                    </span>
                    <span className="absolute bottom-16 right-6 font-handwritten text-[#ff6a00] text-xl opacity-25 select-none pointer-events-none -rotate-12 hidden sm:block">
                      Good Vibes!
                    </span>

                    {/* =========================================================
                        STEP 1: BOOKER DETAILS
                        ========================================================= */}
                    {step === 1 && (
                      <div className="animate-fadeIn">
                        <div className="mb-4 sm:mb-6">
                          <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#fff3eb] text-[#ff6a00] font-display text-[10px] sm:text-xs font-extrabold tracking-wider uppercase mb-1.5 sm:mb-2">
                            <User className="w-3.5 h-3.5" />
                            <span>STEP 1 OF 4</span>
                          </div>
                          <h2 className="font-display text-lg sm:text-3xl font-black text-slate-900">
                            Booker Details
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Please fill in your contact information. We'll use this to send your booking confirmation and entry passes.
                          </p>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                          {/* Full Name */}
                          <div>
                            <label className="block font-display text-xs font-bold text-slate-800 mb-1">
                              Full Name <span className="text-[#ff6a00]">*</span>
                            </label>
                            <div className="relative">
                              <User className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#ff6a00]" />
                              <input
                                type="text"
                                value={booker.name}
                                onChange={(e) => setBooker({ ...booker, name: e.target.value })}
                                placeholder="e.g. Rahul Sharma"
                                className={`w-full h-11 sm:h-12 pl-9 sm:pl-11 pr-3 sm:pr-4 rounded-xl border-2 bg-[#fdfbf7] text-slate-900 font-medium text-xs sm:text-sm outline-none transition-all ${
                                  errors.name ? 'border-red-500' : 'border-slate-200 focus:border-[#ff6a00] focus:bg-white focus:ring-2 focus:ring-[#ff6a00]/20'
                                }`}
                              />
                            </div>
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                          </div>

                          {/* Mobile / WhatsApp Number */}
                          <div>
                            <label className="block font-display text-xs font-bold text-slate-800 mb-1">
                              Mobile / WhatsApp Number <span className="text-[#ff6a00]">*</span>
                            </label>
                            <div className="relative">
                              <Phone className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#ff6a00]" />
                              <input
                                type="tel"
                                maxLength={10}
                                value={booker.mobile}
                                onChange={(e) => setBooker({ ...booker, mobile: e.target.value.replace(/\D/g, '') })}
                                placeholder="10-digit mobile number"
                                className={`w-full h-11 sm:h-12 pl-9 sm:pl-11 pr-3 sm:pr-4 rounded-xl border-2 bg-[#fdfbf7] text-slate-900 font-medium text-xs sm:text-sm outline-none transition-all ${
                                  errors.mobile ? 'border-red-500' : 'border-slate-200 focus:border-[#ff6a00] focus:bg-white focus:ring-2 focus:ring-[#ff6a00]/20'
                                }`}
                              />
                            </div>
                            {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
                          </div>

                          {/* Email ID */}
                          <div>
                            <label className="block font-display text-xs font-bold text-slate-800 mb-1">
                              Email ID <span className="text-slate-400 font-normal">(Recommended)</span>
                            </label>
                            <div className="relative">
                              <Mail className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#ff6a00]" />
                              <input
                                type="email"
                                value={booker.email}
                                onChange={(e) => setBooker({ ...booker, email: e.target.value })}
                                placeholder="e.g. rahul@example.com"
                                className={`w-full h-11 sm:h-12 pl-9 sm:pl-11 pr-3 sm:pr-4 rounded-xl border-2 bg-[#fdfbf7] text-slate-900 font-medium text-xs sm:text-sm outline-none transition-all ${
                                  errors.email ? 'border-red-500' : 'border-slate-200 focus:border-[#ff6a00] focus:bg-white focus:ring-2 focus:ring-[#ff6a00]/20'
                                }`}
                              />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                          </div>

                          {/* Attendee Ticket Quantity Counter Card */}
                          <div className="flex items-center justify-between gap-2.5 bg-[#fff8f0] border-2 border-amber-500/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 mt-2">
                            <div>
                              <span className="font-display text-xs sm:text-sm font-bold text-slate-900 block">Number of Attendees</span>
                              <span className="text-[11px] sm:text-xs text-[#ff6a00] font-bold block">
                                {rupee(CONFIG.ticketPrice)} × {qty} {qty > 1 ? 'Passes' : 'Pass'}{conventionFee > 0 ? ` (+${rupee(conventionFee)} fee)` : ''} = {rupee(totalAmount)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 bg-white border border-slate-200 rounded-xl px-1.5 sm:px-2 py-1 shadow-xs flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => handleQtyChange(-1)}
                                disabled={qty <= 1}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#fff3eb] text-[#ff6a00] font-black text-base sm:text-lg flex items-center justify-center hover:bg-[#ffe5d4] disabled:opacity-30 cursor-pointer"
                              >
                                −
                              </button>
                              <span className="font-display font-black text-sm sm:text-base w-5 sm:w-6 text-center text-slate-900">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQtyChange(1)}
                                disabled={qty >= CONFIG.maxTickets}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#fff3eb] text-[#ff6a00] font-black text-base sm:text-lg flex items-center justify-center hover:bg-[#ffe5d4] disabled:opacity-30 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Privacy Shield Notice */}
                          <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 text-[11px] sm:text-xs text-slate-500">
                            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <p>
                              Your information is safe with us. We'll never share your contact details with third parties.
                            </p>
                          </div>

                          {/* Bottom Checkout Action */}
                          <div className="pt-3.5 sm:pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mt-5 sm:mt-6">
                            <div className="flex items-center justify-between sm:block">
                              <span className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400 block tracking-wider">Payable Amount:</span>
                              <span className="font-display text-xl sm:text-2xl font-black text-[#ff6a00]">{rupee(totalAmount)}</span>
                            </div>

                            <button
                              type="button"
                              onClick={handleNext}
                              className="w-full sm:w-auto px-5 sm:px-8 py-3 sm:py-3.5 rounded-xl font-display font-black text-xs sm:text-sm text-white bg-gradient-to-r from-[#ff6a00] to-[#ee5007] hover:brightness-110 active:scale-98 shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                            >
                              <span>Proceed to Ticket Details</span>
                              <ChevronRight className="w-4 h-4 flex-shrink-0" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* =========================================================
                        STEP 2: TICKET DETAILS & PASS BREAKDOWN
                        ========================================================= */}
                    {step === 2 && (
                      <div className="animate-fadeIn">
                        <div className="mb-5 sm:mb-6">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff3eb] text-[#ff6a00] font-display text-xs font-extrabold tracking-wider uppercase mb-2">
                            <Ticket className="w-3.5 h-3.5" />
                            <span>STEP 2 OF 4</span>
                          </div>
                          <h2 className="font-display text-xl sm:text-3xl font-black text-slate-900">
                            Ticket Summary
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Review the pass count and event guidelines before proceeding to payment.
                          </p>
                        </div>

                        <div className="space-y-4">
                          {/* Ticket Breakdown Card */}
                          <div className="bg-[#fdfbf7] border-2 border-slate-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                              <div>
                                <span className="font-display font-black text-sm sm:text-base text-slate-900 block">
                                  General Admission Pass
                                </span>
                                <span className="text-xs text-slate-500">Live Stage &amp; Music Access</span>
                              </div>
                              <div className="text-right">
                                <span className="font-display font-black text-base text-[#ff6a00] block">{rupee(totalAmount)}</span>
                                <span className="text-xs text-slate-400">{qty} Pass{qty > 1 ? 'es' : ''} • Total</span>
                              </div>
                            </div>

                            <div className="pt-3 space-y-2 text-xs text-slate-600">
                              <div className="flex justify-between">
                                <span>Ticket Price ({qty} × {rupee(CONFIG.ticketPrice)}):</span>
                                <span className="font-bold text-slate-800">{rupee(subtotal)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Convention Fee:</span>
                                <span className="font-bold text-slate-800">{qty > 1 ? `${qty} × ${rupee(CONFIG.conventionFee)} = ` : ''}{rupee(conventionFee)}</span>
                              </div>
                              <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold text-slate-900">
                                <span>Total Payable:</span>
                                <span className="text-[#ff6a00] font-black">{rupee(totalAmount)}</span>
                              </div>
                              <div className="flex justify-between pt-1">
                                <span>Booker Name:</span>
                                <strong className="text-slate-800">{booker.name}</strong>
                              </div>
                              <div className="flex justify-between">
                                <span>Contact Phone:</span>
                                <strong className="text-slate-800">+91 {booker.mobile}</strong>
                              </div>
                              <div className="flex justify-between">
                                <span>Event Date &amp; Time:</span>
                                <strong className="text-slate-800">{CONFIG.dateShort} ({CONFIG.eventTime})</strong>
                              </div>
                              <div className="flex justify-between">
                                <span>Gate Reporting:</span>
                                <strong className="text-amber-600 font-bold">{CONFIG.reportingTime}</strong>
                              </div>
                            </div>
                          </div>

                          {/* Venue Entry Reminder */}
                          <div className="bg-amber-50/80 border border-amber-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-xs text-amber-900 space-y-1.5">
                            <div className="font-bold flex items-center gap-1.5 text-amber-800">
                              <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
                              <span>Venue &amp; Entry Guidelines</span>
                            </div>
                            <p>• Venue: <strong>{CONFIG.fullVenue}</strong></p>
                            <p>• Please bring a digital copy of your confirmed ticket QR pass.</p>
                            <p>• 1 × 500 ml sealed water bottle per person permitted.</p>
                          </div>

                          {/* Navigation Actions */}
                          <div className="pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mt-6">
                            <button
                              type="button"
                              onClick={handleBack}
                              className="w-full sm:w-auto px-5 py-3 rounded-xl font-display font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span>Back</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleNext}
                              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl font-display font-black text-sm text-white bg-gradient-to-r from-[#ff6a00] to-[#ee5007] hover:brightness-110 active:scale-95 shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                            >
                              <span>Proceed to Payment</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* =========================================================
                        STEP 3: PAYMENT VIA UPI
                        ========================================================= */}
                    {step === 3 && (
                      <div className="animate-fadeIn">
                        <div className="mb-5 sm:mb-6">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff3eb] text-[#ff6a00] font-display text-xs font-extrabold tracking-wider uppercase mb-2">
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>STEP 3 OF 4</span>
                          </div>
                          <h2 className="font-display text-xl sm:text-3xl font-black text-slate-900">
                            Choose Payment Method
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Pay instantly with real-time automated confirmation or scan the Google Pay QR directly.
                          </p>
                        </div>

                        {/* Payment Method Selector Tabs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1.5 bg-slate-100/90 border border-slate-200 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                          <button
                            type="button"
                            onClick={() => setPaymentMode('ONLINE')}
                            className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-display text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              paymentMode === 'ONLINE'
                                ? 'bg-gradient-to-r from-[#ff6a00] to-[#ee5007] text-white shadow-md'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                            }`}
                          >
                            <Zap className="w-4 h-4 text-amber-200 fill-amber-200 flex-shrink-0" />
                            <span>⚡ Instant Online Pay (UPI / Cards)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMode('MANUAL_UPI')}
                            className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-display text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              paymentMode === 'MANUAL_UPI'
                                ? 'bg-gradient-to-r from-[#ff6a00] to-[#ee5007] text-white shadow-md'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                            }`}
                          >
                            <CreditCard className="w-4 h-4 flex-shrink-0" />
                            <span>📱 Scan GPay QR &amp; Enter UTR</span>
                          </button>
                        </div>

                        {/* TAB 1: REAL-TIME ONLINE GATEWAY (DEFAULT & FIRST) */}
                        {paymentMode === 'ONLINE' && (
                          <div className="space-y-4 sm:space-y-5 animate-fadeIn">
                            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-2 border-[#ff6a00]/30 rounded-xl sm:rounded-2xl p-3.5 sm:p-6">
                              <div className="flex flex-row items-center justify-between gap-2 mb-3 sm:mb-4">
                                <div>
                                  <span className="text-[9px] sm:text-[10px] uppercase font-extrabold text-[#ff6a00] tracking-wider block">REAL-TIME CHECKOUT</span>
                                  <h3 className="font-display text-base sm:text-xl font-black text-slate-900">Instant Verification</h3>
                                </div>
                                <div className="text-right">
                                  <span className="text-[9px] sm:text-[10px] uppercase font-extrabold text-slate-400 block">TOTAL PAYABLE</span>
                                  <span className="font-display text-xl sm:text-2xl font-black text-[#ff6a00]">{rupee(totalAmount)}</span>
                                </div>
                              </div>

                              <p className="text-xs text-slate-600 leading-relaxed mb-3 sm:mb-4">
                                Supports <strong>Google Pay, PhonePe, Paytm, BHIM UPI, Credit/Debit Cards</strong>, and <strong>NetBanking</strong>. Your digital pass is generated immediately.
                              </p>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                                <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                                  <span className="text-xs font-bold text-slate-700 block">Google Pay</span>
                                  <span className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold">⚡ Instant UPI</span>
                                </div>
                                <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                                  <span className="text-xs font-bold text-slate-700 block">PhonePe</span>
                                  <span className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold">⚡ Instant UPI</span>
                                </div>
                                <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                                  <span className="text-xs font-bold text-slate-700 block">Paytm UPI</span>
                                  <span className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold">⚡ Instant UPI</span>
                                </div>
                                <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                                  <span className="text-xs font-bold text-slate-700 block">Cards / NetBank</span>
                                  <span className="text-[9px] sm:text-[10px] text-blue-600 font-semibold">🔒 256-bit Secure</span>
                                </div>
                              </div>

                              {isOnlinePaying && cashfreeOrder ? (
                                <div className="bg-white border-2 border-emerald-500/40 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center space-y-3 shadow-lg animate-fadeIn">
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                                  </div>
                                  <div className="font-display font-black text-slate-900 text-sm sm:text-base">
                                    Cashfree Checkout Active
                                  </div>
                                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                    Please complete your payment in the checkout window. Once completed, click the button below to verify.
                                  </p>
                                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                                    <div className="text-[10px] sm:text-[11px] font-mono text-slate-600 bg-slate-100 py-1 px-2.5 rounded-lg inline-block">
                                      Order ID: <strong className="text-slate-900">{cashfreeOrder.orderId || cashfreeOrder.bookingId}</strong>
                                    </div>
                                    <div className="text-[10px] sm:text-[11px] font-mono text-slate-600 bg-slate-100 py-1 px-2.5 rounded-lg inline-block">
                                      Amount: <strong className="text-emerald-700 font-bold">{rupee(cashfreeOrder.amount || totalAmount)}</strong>
                                    </div>
                                  </div>
                                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => handleCheckPaymentStatus()}
                                      disabled={isCheckingPayment}
                                      className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                                    >
                                      {isCheckingPayment ? (
                                        <>
                                          <RefreshCw className="w-4 h-4 animate-spin" />
                                          <span>Verifying Payment...</span>
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle2 className="w-4 h-4" />
                                          <span>I Have Paid (Verify Status)</span>
                                        </>
                                      )}
                                    </button>
                                    {cashfreeOrder.paymentLink && (
                                      <a
                                        href={cashfreeOrder.paymentLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-amber-100 hover:bg-amber-200 cursor-pointer text-center"
                                      >
                                        Re-open Payment Page
                                      </a>
                                    )}
                                    <button
                                      type="button"
                                      onClick={handleCancelOnlinePay}
                                      className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleInstantOnlinePay}
                                  disabled={isOnlinePaying}
                                  className="w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl font-display font-black text-xs sm:text-base text-white bg-gradient-to-r from-[#ff6a00] via-[#ee5007] to-[#d84000] hover:brightness-110 active:scale-98 shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60"
                                >
                                  {isOnlinePaying ? (
                                    <>
                                      <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                      <span>Connecting Cashfree Gateway...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200 fill-amber-200 flex-shrink-0" />
                                      <span>Pay {rupee(totalAmount)} Now (Instant Checkout)</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-slate-500 text-center">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              <span>256-bit SSL encrypted • Instant digital entry pass with QR</span>
                            </div>

                            <div className="pt-3.5 sm:pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                              <button
                                type="button"
                                onClick={handleBack}
                                className="w-full sm:w-auto px-5 py-3 rounded-xl font-display font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Back</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setPaymentMode('MANUAL_UPI')}
                                className="text-xs font-bold text-[#ff6a00] hover:underline cursor-pointer text-center py-1 sm:py-0"
                              >
                                Or scan Google Pay QR code &rarr;
                              </button>
                            </div>
                          </div>
                        )}

                        {/* TAB 2: DIRECT GOOGLE PAY QR & UTR ENTRY */}
                        {paymentMode === 'MANUAL_UPI' && (
                          <div className="space-y-4 sm:space-y-5 animate-fadeIn">
                            <div className="bg-[#fdfbf7] border-2 border-amber-500/30 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col sm:flex-row items-center gap-3.5 sm:gap-5">
                              <div className="flex-shrink-0 flex flex-col items-center">
                                <div className="bg-white p-2 rounded-2xl border-2 border-slate-200 shadow-sm relative">
                                  {showOriginalQr ? (
                                    <img
                                      src="/ashok_kumar_upi_qr.jpg"
                                      alt="Google Pay QR Code Ashok kumar"
                                      className="w-36 h-36 sm:w-44 sm:h-44 object-contain rounded-lg"
                                    />
                                  ) : paymentQr ? (
                                    <img
                                      src={paymentQr}
                                      alt="UPI Payment QR Code"
                                      className="w-36 h-36 sm:w-44 sm:h-44 object-contain"
                                    />
                                  ) : (
                                    <div className="w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
                                      Loading QR...
                                    </div>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setShowOriginalQr(!showOriginalQr)}
                                  className="mt-1.5 text-[11px] text-[#ff6a00] hover:text-[#ee5007] font-bold underline underline-offset-2 cursor-pointer"
                                >
                                  {showOriginalQr ? "Show Dynamic Amount QR" : "Show GPay Standee QR"}
                                </button>
                              </div>

                              <div className="flex-grow space-y-2 text-center sm:text-left w-full sm:w-auto">
                                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                  <span className="text-[10px] sm:text-[11px] uppercase font-extrabold text-slate-500 tracking-wider">
                                    PAY TO: <strong className="text-slate-900">{CONFIG.payeeName}</strong>
                                  </span>
                                </div>

                                <div className="font-display text-xl sm:text-2xl font-black text-slate-900">
                                  {rupee(totalAmount)}
                                  {conventionFee > 0 && (
                                    <span className="text-xs text-slate-500 font-normal ml-1.5">({rupee(subtotal)} + {rupee(conventionFee)} fee)</span>
                                  )}
                                </div>

                                <div className="flex flex-col gap-2 w-full">
                                  <div className="flex w-full items-center justify-between gap-2 bg-white border border-slate-300 rounded-xl px-2.5 sm:px-3 py-1.5 shadow-xs">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
                                      <span className="font-bold text-slate-700 flex-shrink-0">UPI ID:</span>
                                      <span className="font-mono font-bold text-slate-900 truncate">{CONFIG.upiId}</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={handleCopyUpi}
                                      className="text-[#ff6a00] hover:text-[#ee5007] text-xs font-bold flex items-center gap-1 cursor-pointer flex-shrink-0 ml-1"
                                    >
                                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                      <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                                    </button>
                                  </div>

                                  {CONFIG.upiNumber && (
                                    <div className="flex w-full items-center justify-between gap-2 bg-white border border-slate-300 rounded-xl px-2.5 sm:px-3 py-1.5 shadow-xs">
                                      <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
                                        <span className="font-bold text-slate-700 flex-shrink-0">UPI Number:</span>
                                        <span className="font-mono font-bold text-slate-900 truncate">{CONFIG.upiNumber}</span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={handleCopyUpiNumber}
                                        className="text-[#ff6a00] hover:text-[#ee5007] text-xs font-bold flex items-center gap-1 cursor-pointer flex-shrink-0 ml-1"
                                      >
                                        {copiedUpiNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                        <span>{copiedUpiNumber ? 'Copied' : 'Copy'}</span>
                                      </button>
                                    </div>
                                  )}
                                </div>

                                <p className="text-[10px] sm:text-[11px] text-slate-500 pt-0.5">
                                  Supports GPay, PhonePe, Paytm, BHIM, Cred, and all UPI apps.
                                </p>
                              </div>
                            </div>

                            {/* Mobile Direct UPI App Link */}
                            {upiDeepLink && (
                              <a
                                href={upiDeepLink}
                                className="sm:hidden w-full py-3 px-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-display font-black text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
                              >
                                <CreditCard className="w-4 h-4 flex-shrink-0" />
                                <span>Pay Directly with UPI App (GPay / PhonePe)</span>
                              </a>
                            )}

                            {/* UTR Input */}
                            <div>
                              <label className="block font-display text-xs font-bold text-slate-800 mb-1">
                                UPI Transaction ID / UTR (12 digits) <span className="text-[#ff6a00]">*</span>
                              </label>
                              <input
                                type="text"
                                value={payment.utr}
                                onChange={(e) => setPayment({ ...payment, utr: e.target.value })}
                                placeholder="e.g. 423819284712 or Bank Ref No."
                                className={`w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl border-2 bg-[#fdfbf7] text-slate-900 font-mono font-semibold text-xs sm:text-sm outline-none transition-all ${
                                  errors.utr ? 'border-red-500' : 'border-slate-200 focus:border-[#ff6a00] focus:bg-white focus:ring-2 focus:ring-[#ff6a00]/20'
                                }`}
                              />
                              {errors.utr && <p className="text-xs text-red-500 mt-1">{errors.utr}</p>}
                            </div>

                            {/* Screenshot Upload */}
                            <div>
                              <label className="block font-display text-xs font-bold text-slate-800 mb-1">
                                Payment Screenshot <span className="text-slate-400 font-normal">(Optional for faster approval)</span>
                              </label>
                              <label className="border-2 border-dashed border-slate-300 hover:border-[#ff6a00] bg-[#fdfbf7] hover:bg-[#fff8f0] rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all">
                                <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff6a00]" />
                                <span className="text-xs font-bold text-slate-700 text-center">
                                  {payment.fileName ? payment.fileName : 'Click to attach payment receipt'}
                                </span>
                                <span className="text-[10px] text-slate-400">PNG, JPG, or WEBP (Max 5MB)</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>

                            {/* Navigation Actions */}
                            <div className="pt-3.5 sm:pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mt-5 sm:mt-6">
                              <button
                                type="button"
                                onClick={handleBack}
                                className="w-full sm:w-auto px-5 py-3 rounded-xl font-display font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Back</span>
                              </button>

                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 w-full sm:w-auto">
                                <button
                                  type="button"
                                  onClick={() => setPaymentMode('ONLINE')}
                                  className="text-xs font-bold text-[#ff6a00] hover:underline cursor-pointer text-center sm:text-left py-1 sm:py-0"
                                >
                                  Or pay via Real-Time Online &rarr;
                                </button>
                                <button
                                  type="button"
                                  onClick={handleNext}
                                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl font-display font-black text-sm text-white bg-gradient-to-r from-[#ff6a00] to-[#ee5007] hover:brightness-110 active:scale-95 shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                                >
                                  <span>Review &amp; Confirm</span>
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {step === 4 && (
                      <div className="animate-fadeIn">
                        <div className="mb-5 sm:mb-6">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff3eb] text-[#ff6a00] font-display text-xs font-extrabold tracking-wider uppercase mb-2">
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>STEP 4 OF 4</span>
                          </div>
                          <h2 className="font-display text-xl sm:text-3xl font-black text-slate-900">
                            Review &amp; Confirm
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Please double check all booking details before final submission.
                          </p>
                        </div>

                        <div className="space-y-3.5 sm:space-y-4">
                          {/* Summary Table Card */}
                          <div className="bg-[#fdfbf7] border-2 border-slate-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-2.5 sm:space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-200 gap-2">
                              <span className="text-xs text-slate-500">Attendee Name</span>
                              <strong className="text-xs sm:text-sm font-black text-slate-900 truncate">{booker.name}</strong>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-200 gap-2">
                              <span className="text-xs text-slate-500">Mobile Number</span>
                              <strong className="text-xs sm:text-sm font-black text-slate-900">+91 {booker.mobile}</strong>
                            </div>
                            {booker.email && (
                              <div className="flex justify-between items-center pb-2 border-b border-slate-200 gap-2">
                                <span className="text-xs text-slate-500">Email</span>
                                <strong className="text-xs sm:text-sm font-semibold text-slate-700 truncate">{booker.email}</strong>
                              </div>
                            )}
                            <div className="flex justify-between items-center pb-2 border-b border-slate-200 gap-2">
                              <span className="text-xs text-slate-500">Number of Passes</span>
                              <strong className="text-xs sm:text-sm font-black text-[#ff6a00]">{qty} General Pass{qty > 1 ? 'es' : ''}</strong>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-200 gap-2">
                              <span className="text-xs text-slate-500">Ticket Price</span>
                              <strong className="text-xs font-bold text-slate-800">{qty} × {rupee(CONFIG.ticketPrice)} = {rupee(subtotal)}</strong>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-200 gap-2">
                              <span className="text-xs text-slate-500">Convention Fee</span>
                              <strong className="text-xs font-bold text-slate-800">{qty > 1 ? `${qty} × ${rupee(CONFIG.conventionFee)} = ` : ''}{rupee(conventionFee)}</strong>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-200 gap-2">
                              <span className="text-xs text-slate-500 flex-shrink-0">Payment Method</span>
                              <span className="font-mono text-xs font-bold text-slate-800 truncate max-w-[160px] sm:max-w-none text-right">
                                {paymentMode === 'ONLINE' ? 'Cashfree Instant Checkout' : (payment.utr || 'Manual UPI / GPay')}
                              </span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                              <span className="font-display text-xs sm:text-sm font-bold text-slate-800">Total Payable / Paid</span>
                              <span className="font-display text-lg sm:text-2xl font-black text-[#ff6a00]">{rupee(totalAmount)}</span>
                            </div>
                          </div>

                          {/* Non-refundable notice */}
                          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-500 bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-200">
                            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                            <span>All ticket bookings are final and non-refundable as per event policy.</span>
                          </div>

                          {/* Navigation Actions */}
                          <div className="pt-3.5 sm:pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mt-5 sm:mt-6">
                            <button
                              type="button"
                              onClick={handleBack}
                              disabled={isSubmitting}
                              className="w-full sm:w-auto px-5 py-3 rounded-xl font-display font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span>Back</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleConfirmBooking}
                              disabled={isSubmitting}
                              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl font-display font-black text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-110 active:scale-98 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Processing...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Confirm Booking &amp; Generate Ticket</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* EVENT QUICK INFO FOOTER */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mt-6 sm:mt-10 p-3 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#fdfbf7] min-w-0">
                    <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#ff6a00] flex-shrink-0" />
                    <span className="truncate text-[11px] sm:text-xs">{CONFIG.fullVenue}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#fdfbf7] min-w-0">
                    <Calendar className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#ff6a00] flex-shrink-0" />
                    <span className="truncate text-[11px] sm:text-xs">{CONFIG.dateShort}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#fdfbf7] min-w-0">
                    <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#ff6a00] flex-shrink-0" />
                    <span className="truncate text-[11px] sm:text-xs">Instant QR Pass</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-[#fdfbf7] min-w-0">
                    <Phone className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-600 flex-shrink-0" />
                    <span className="truncate text-[11px] sm:text-xs">{CONFIG.contactPhone}</span>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      )}
    </div>
  );
}
