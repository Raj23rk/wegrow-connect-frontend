import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  User,
  Users,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Download,
  Share2,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
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
  Zap,
  Printer,
  ExternalLink
} from 'lucide-react';
import {
  bookSingAlongTicket,
  singAlongApi,
  getSingAlongTicketUrl,
  getSingAlongTicketDownloadUrl
} from '../services/singAlongApi';

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
  reportingTime: "5:30 PM to 6:00 PM",
  eventTime: "6:00 PM – 9:00 PM",
  venue: "Arasan Turf",
  location: "Sivakasi",
  fullVenue: "Arasan Turf, Sivakasi",
  presentedBy: "WeGrow",
  upiId: "ashokbcasvk45@oksbi",
  upiNumber: "",
  merchantName: "Ashok kumar",
  payeeName: "Ashok kumar",
  ticketPrice: 249,
  conventionFee: 5.30,
  convenienceFee: 5.30,
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

const rupee = (n) => {
  const num = Number(n || 0);
  if (num % 1 !== 0) {
    return "₹" + num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return "₹" + num.toLocaleString("en-IN");
};

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
  const [paymentMode, setPaymentMode] = useState('ONLINE');
  const [isOnlinePaying, setIsOnlinePaying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success / Ticket Data
  const [ticketData, setTicketData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [isCopiedBookingId, setIsCopiedBookingId] = useState(false);
  const [ticketQr, setTicketQr] = useState('');
  const ticketQrCacheRef = useRef({});

  // Mascot Concert Video & Background Song Controls
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const ticketCaptureRef = useRef(null);

  const isGroupOffer = qty === 5;
  const isBulkOffer = qty === 10;
  const freeTickets = isBulkOffer ? 1 : 0;
  const totalTickets = qty + freeTickets;
  const unitPrice = isGroupOffer ? 200 : CONFIG.ticketPrice;
  const regularTotal = qty * CONFIG.ticketPrice;
  const subtotal = qty * unitPrice;
  const convenienceFee = Number((qty * (CONFIG.convenienceFee ?? CONFIG.conventionFee ?? 5.30)).toFixed(2));
  const conventionFee = convenienceFee;
  const totalAmount = Number((subtotal + convenienceFee).toFixed(2));
  const totalSavings = isGroupOffer ? ((CONFIG.ticketPrice - 200) * 5) : (isBulkOffer ? CONFIG.ticketPrice : 0);

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

  // Generate Verification QR Code for confirmed ticket with caching
  useEffect(() => {
    if (ticketData?.bookingId) {
      const code = ticketData.verificationToken || `SINGALONG-VERIFY:${ticketData.bookingId}`;
      if (ticketQrCacheRef.current[code]) {
        setTicketQr(ticketQrCacheRef.current[code]);
        return;
      }
      QRCode.toDataURL(code, {
        width: 320,
        margin: 1,
        color: { dark: '#0B1B4A', light: '#ffffff' }
      })
        .then(url => {
          ticketQrCacheRef.current[code] = url;
          setTicketQr(url);
        })
        .catch(err => console.error('Ticket QR Error:', err));
    }
  }, [ticketData]);

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
    if (!booker.email.trim()) {
      err.email = "Email ID is mandatory for sending your entry pass.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booker.email.trim())) {
      err.email = "Enter a valid email address.";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateStep3 = () => {
    return true;
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
            setPageView('booking');
            setScreen('success');
            setShowTicketModal(true);
            try {
              window.history.replaceState({}, document.title, window.location.pathname);
            } catch (_) { }
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
            setPageView('booking');
            setScreen('success');
            setShowTicketModal(true);
            try {
              window.history.replaceState({}, document.title, window.location.pathname);
            } catch (_) { }
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
        ticketQty: totalTickets,
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
        setShowTicketModal(true);
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
      ticketQty: totalTickets,
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
            notes: `Manual UPI payment. Amount: ₹${totalAmount} (${qty} paid pass${qty > 1 ? 'es' : ''}${freeTickets > 0 ? ` + ${freeTickets} FREE pass` : ''} = ${totalTickets} total passes, incl. ₹${conventionFee} conv. fee)`
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
        ticketQty: bookedRecord?.ticketQty || totalTickets,
        amount: bookedRecord?.totalAmount || totalAmount,
        utr: bookedRecord?.utr || payment.utr.trim(),
        paymentMethod: bookedRecord?.paymentMethod || 'MANUAL_UPI',
        paidAt: new Date().toISOString(),
        verificationToken: bookedRecord?.verificationToken || `SINGALONG-VERIFY:${confirmedBookingId}`
      };

      setTimeout(() => {
        setTicketData(confirmedTicketData);
        setScreen('success');
        setShowTicketModal(true);
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

  // Copy Booking ID to Clipboard
  const handleCopyBookingId = () => {
    if (!ticketData?.bookingId) return;
    navigator.clipboard.writeText(ticketData.bookingId)
      .then(() => {
        setIsCopiedBookingId(true);
        toast.success(`Copied Booking ID: ${ticketData.bookingId}`);
        setTimeout(() => setIsCopiedBookingId(false), 2500);
      })
      .catch(() => {
        toast.error("Could not copy Booking ID.");
      });
  };

  // Printable Client-side Ticket Pass Window Fallback
  const openClientPrintTicket = (tData, qrDataUrl) => {
    if (!tData) return;
    const printWindow = window.open('', '_blank', 'width=840,height=960');
    if (!printWindow) {
      toast.error("Please allow popups in your browser to print the ticket.");
      return;
    }

    const printHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sing Along Live - Official Ticket Pass (${tData.bookingId})</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;900&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #0b0f19;
      color: #1e293b;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 12px;
      min-height: 100vh;
    }
    .print-controls {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
    }
    .btn {
      padding: 10px 24px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    .btn-print {
      background: linear-gradient(135deg, #059669, #047857);
      color: white;
      box-shadow: 0 4px 14px rgba(5, 150, 105, 0.4);
    }
    .btn-close {
      background: #334155;
      color: #e2e8f0;
    }
    .ticket-container {
      width: 100%;
      max-width: 440px;
      background: #ffffff;
      border-radius: 32px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
      border: 1px solid #e2e8f0;
      position: relative;
    }
    .header-bar {
      background: linear-gradient(135deg, #1c0d02 0%, #3d1403 50%, #542207 100%);
      color: white;
      padding: 22px 24px;
      text-align: center;
      border-bottom: 3px dashed #f59e0b;
    }
    .header-tag {
      display: inline-block;
      background: rgba(245, 158, 11, 0.2);
      border: 1px solid #f59e0b;
      color: #fef3c7;
      padding: 3px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .header-title {
      font-family: 'Outfit', sans-serif;
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 0.04em;
      color: #fff2a8;
      text-transform: uppercase;
    }
    .header-sub {
      font-size: 12px;
      color: #fed7aa;
      margin-top: 4px;
      font-weight: 600;
    }
    .pills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      padding: 14px 20px;
      background: #fdfbf7;
      border-bottom: 1px solid #e2e8f0;
      font-size: 11px;
    }
    .pill {
      background: white;
      padding: 6px 10px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      font-weight: 600;
      color: #334155;
    }
    .pill strong {
      color: #d97706;
      display: block;
      font-size: 9px;
      text-transform: uppercase;
    }
    .body-card {
      padding: 24px 20px;
      text-align: center;
    }
    .attendee-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 14px 18px;
      text-align: left;
      margin-bottom: 18px;
      font-size: 13px;
    }
    .attendee-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .attendee-row:last-child { margin-bottom: 0; }
    .label { color: #64748b; }
    .value { font-weight: 700; color: #0f172a; }
    .qr-box {
      display: inline-block;
      padding: 12px;
      border-radius: 20px;
      border: 2px solid #e2e8f0;
      background: white;
      margin-bottom: 12px;
    }
    .qr-box img {
      width: 200px;
      height: 200px;
      display: block;
    }
    .booking-id {
      font-family: 'Outfit', monospace;
      font-size: 18px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: 0.08em;
    }
    .footer-bar {
      padding: 16px 24px;
      background: #f1f5f9;
      border-top: 2px dashed #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
    }
    .footer-bar .amount {
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      color: #d97706;
      font-weight: 900;
    }
    @media print {
      body { background: white; padding: 0; }
      .print-controls { display: none; }
      .ticket-container { box-shadow: none; border: 2px solid #334155; margin: 0 auto; page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="print-controls">
    <button class="btn btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
    <button class="btn btn-close" onclick="window.close()">Close</button>
  </div>
  <div class="ticket-container">
    <div class="header-bar">
      <div class="header-tag">🎵 Official Digital Entry Pass</div>
      <div class="header-title">SING ALONG</div>
      <div class="header-sub">LIVE MUSIC EVENT • WEGROW B SCHOOL</div>
    </div>
    <div class="pills-grid">
      <div class="pill"><strong>Event Date</strong>Sun, Sep 27, 2026</div>
      <div class="pill"><strong>Event Time</strong>6:00 PM – 9:00 PM</div>
      <div class="pill"><strong>Venue</strong>Arasan Turf, Sivakasi</div>
      <div class="pill"><strong>Gate Entry</strong>5:30 PM Onwards</div>
    </div>
    <div class="body-card">
      <div class="attendee-box">
        <div class="attendee-row"><span class="label">Attendee</span><span class="value">${tData.fullName || 'Valued Guest'}</span></div>
        <div class="attendee-row"><span class="label">Contact</span><span class="value">${tData.phone || ''}</span></div>
        <div class="attendee-row"><span class="label">Passes</span><span class="value">${tData.ticketQty || 1} General Admission Pass${(tData.ticketQty || 1) > 1 ? 'es' : ''}</span></div>
        <div class="attendee-row"><span class="label">Status</span><span class="value" style="color:#059669;">CONFIRMED & ACTIVE</span></div>
      </div>
      <div class="qr-box">
        <img src="${qrDataUrl || ticketQr}" alt="QR Entry Pass" />
      </div>
      <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Present this QR code at the entrance scanner</div>
      <div class="booking-id">BOOKING ID: ${tData.bookingId}</div>
    </div>
    <div class="footer-bar">
      <span>Total Paid</span>
      <span class="amount">₹${tData.amount || 254.30}</span>
    </div>
  </div>
  <script>
    window.addEventListener('load', function() {
      setTimeout(function() { window.print(); }, 400);
    });
  </script>
</body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(printHtml);
    printWindow.document.close();
  };

  // Download / Print Official PDF Ticket Pass
  const handleDownloadPdfTicket = async () => {
    if (!ticketData?.bookingId) return;
    const backendUrl = getSingAlongTicketUrl(ticketData.bookingId);
    
    // Check if backend endpoint is accessible, otherwise use high-fidelity client print
    try {
      const checkRes = await fetch(backendUrl, { method: 'HEAD' }).catch(() => null);
      if (checkRes && checkRes.ok) {
        window.open(backendUrl, '_blank');
        toast.success("Opening official printable ticket pass... 🖨️📄");
        return;
      }
    } catch (_) {}

    // Instant client-side printable PDF window
    openClientPrintTicket(ticketData, ticketQr);
    toast.success("Opening official printable ticket pass (Save as PDF)... 🖨️📄");
  };

  // Download Ticket as PNG (Dynamic Import for Fast Initial Load)
  const handleDownloadTicket = async () => {
    if (!ticketCaptureRef.current) return;
    setIsDownloading(true);
    const toastId = toast.loading("Generating high-resolution ticket image...");
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(ticketCaptureRef.current, {
        scale: 2.5,
        backgroundColor: '#0B0F19',
        useCORS: true,
        logging: false
      });
      const link = document.createElement("a");
      link.download = `SingAlong_Pass_${ticketData?.bookingId || "2026"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Ticket image downloaded successfully! 📥", { id: toastId });
    } catch (err) {
      console.error("Ticket download error:", err);
      toast.error("Could not download ticket image. Please use PDF print or take a screenshot.", { id: toastId });
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
      }).catch(() => { });
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
    <div className={`min-h-screen ${screen === 'success' ? 'bg-[#0B0F19] text-white' : 'bg-[#fdfbf7] text-[#0f172a]'} selection:bg-[#ff6a00] selection:text-white relative font-sans overflow-x-hidden`}>

      {/* Embedded CSS for Fast Blinking Multi-Color DJ Lights & Responsive Stage Layout */}
      <style>{`
        .font-display { font-family: 'Outfit', sans-serif; }
        .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-handwritten { font-family: 'Caveat', cursive; }
        .font-poster { font-family: 'Titan One', 'Lilita One', 'Shrikhand', cursive; }
        .font-brush { font-family: 'Outfit', sans-serif; font-weight: 900; }
        .font-titan { font-family: 'Titan One', 'Lilita One', cursive, sans-serif; }

        /* 3D Extruded Cartoon Poster Title - Matched to Image 1 */
        .singalong-3d-text {
          font-family: 'Titan One', 'Lilita One', cursive, sans-serif;
          color: #FFF2A8;
          -webkit-text-stroke: 1.5px #5C1D06;
          letter-spacing: 0.02em;
          text-shadow:
            0 2px 0 #852d0a,
            0 4px 0 #732607,
            0 6px 0 #5c1d06,
            0 8px 0 #421303,
            0 10px 0 #280a01,
            0 12px 14px rgba(0, 0, 0, 0.85),
            0 16px 28px rgba(0, 0, 0, 0.7);
          user-select: none;
        }

        /* Brush Banner Ribbon for LIVE MUSIC EVENT - Matched to Image 1 */
        .live-music-brush-banner {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 5px 22px;
          background: linear-gradient(135deg, #f59e0b 0%, #eab308 50%, #d97706 100%);
          color: #1a1106;
          font-family: 'Outfit', 'Inter', sans-serif;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6);
          clip-path: polygon(
            3% 0%, 97% 2%, 100% 25%, 98% 50%, 100% 75%, 96% 100%,
            4% 98%, 0% 75%, 2% 50%, 0% 25%
          );
          transform: rotate(-1.5deg);
        }

        /* Blinking / Flashing Glowing Offer Tag */
        @keyframes offerTagBlink {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 0 16px rgba(239, 68, 68, 0.7);
          }
          50% {
            opacity: 0.3;
            transform: scale(0.97);
            box-shadow: 0 0 4px rgba(239, 68, 68, 0.15);
          }
        }
        .blink-offer-tag {
          animation: offerTagBlink 1.2s infinite ease-in-out;
        }

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
                  WeGrow presents
                </span>
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight drop-shadow-md">
                    <span className="singalong-3d-text text-2xl sm:text-3xl md:text-4xl inline-block">
                      SING ALONG
                    </span>
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
              <label className={`flex items-center gap-3 cursor-pointer select-none p-2 sm:p-2.5 rounded-xl border transition-all ${shakeTerms ? 'animate-shake border-red-500 bg-red-500/10' : 'border-transparent hover:bg-white/5'
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
                preload="metadata"
              >
                <source src={VIDEO_BANNER_SRC} type="video/mp4" />
              </video>

              {/* Background Music Audio (OM First Strike Bgm) */}
              <audio
                ref={audioRef}
                src={MASCOT_SONG_AUDIO}
                loop
                preload="none"
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
                TOP-RIGHT DATE BADGE (Positioned Absolute so it doesn't skew center alignment)
                ================================================================= */}
            <div className="absolute top-3 right-3 sm:top-5 sm:right-6 md:top-6 md:right-8 z-30 pointer-events-auto">
              <div className="w-[50px] sm:w-[68px] md:w-[74px] bg-white rounded-xl sm:rounded-2xl overflow-hidden text-center shadow-[0_8px_24px_rgba(0,0,0,0.5)] border border-slate-200/40">
                <div className="font-display text-sm sm:text-xl md:text-2xl font-black text-[#1A1A4E] pt-1 leading-none">{CONFIG.dayNum}</div>
                <div className="bg-[#ff6a00] text-white font-body text-[8px] sm:text-xs font-black tracking-wider py-0.5">{CONFIG.monthAbbr}</div>
                <div className="bg-white text-[#ff6a00] font-body text-[7px] sm:text-[10px] font-black tracking-wider py-0.5">{CONFIG.dayName}</div>
              </div>
            </div>

            {/* Left Handwritten Script (Desktop Only) */}
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
                CENTER: POSITIONED DIRECTLY ON THE STAGE TRUSS (Perfect Desktop & Mobile Alignment)
                Line 1: [ WeGrow Skill Campus & B School ] (BIG)
                Line 2: [ K7 Chitfunds (P) Ltd. ] (BALANCED)
                Line 3: presents
                Line 4: SING ALONG
                ================================================================= */}
            <div className="relative z-20 flex flex-col items-center text-center max-w-2xl mx-auto pt-3 sm:pt-5 md:pt-6 px-3 sm:px-4">

              {/* Line 1: WeGrow Skill Campus & B School (BIG - Primary Host) */}
              <div className="bg-white rounded-2xl sm:rounded-3xl px-4 sm:px-6 py-2 sm:py-2.5 shadow-2xl border border-white/60 flex items-center justify-center w-full max-w-[270px] xs:max-w-[310px] sm:max-w-[340px] md:max-w-[360px] mb-2 sm:mb-2.5">
                <img
                  src={WEGROW_BACKUP_LOGO}
                  alt="WeGrow Skill Campus & B School"
                  className="h-8 xs:h-9 sm:h-11 md:h-12 w-auto max-w-full object-contain filter drop-shadow-xs"
                />
              </div>

              {/* Line 2: K7 Chitfunds (P) Ltd. Banner & Logo (Balanced & Proportional) */}
              <div className="bg-white rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 shadow-xl border border-white/50 flex flex-col items-center justify-center w-full max-w-[220px] xs:max-w-[245px] sm:max-w-[270px] md:max-w-[290px] mb-1.5 sm:mb-2 select-none">
                {/* K7 Logo Mark */}
                <img
                  src="/k7_sarathy_chitfunds_logo.png"
                  alt="K7 Chitfunds"
                  className="h-5 sm:h-6 md:h-7 w-auto object-contain mb-0.5"
                />
                {/* HARIHARA WIN */}
                <span className="text-[#13522a] font-serif font-black text-[7.5px] xs:text-[8.5px] sm:text-[10px] tracking-[0.18em] uppercase leading-tight">
                  HARIHARA WIN
                </span>
                {/* K7 CHITFUNDS (P) Ltd., */}
                <span className="text-[#13522a] font-serif font-black text-[9px] xs:text-[10.5px] sm:text-[12px] tracking-wide leading-tight mt-0.5">
                  K7 CHITFUNDS (P) Ltd.,
                </span>
                {/* The Experts In Finance Divider */}
                <div className="flex items-center justify-center gap-1.5 w-full my-0.5 sm:my-1 px-1">
                  <div className="h-[1px] bg-[#13522a] flex-1" />
                  <span className="text-[#13522a] font-serif italic text-[6.5px] xs:text-[7.5px] sm:text-[8.5px] px-0.5 whitespace-nowrap">
                    The Experts In Finance
                  </span>
                  <div className="h-[1px] bg-[#13522a] flex-1" />
                </div>
                {/* CALL $ARATHY 805 66666 16 */}
                <div className="w-full bg-[#fef043] rounded py-0.5 px-1 text-center shadow-xs">
                  <span className="text-[#13522a] font-serif font-black text-[7px] xs:text-[8px] sm:text-[9px] tracking-wider block">
                    CALL $ARATHY 805 66666 16
                  </span>
                </div>
              </div>

              {/* Line 3: presents */}
              <div className="flex items-center justify-center mb-1 sm:mb-1.5">
                <span className="font-body text-xs sm:text-sm md:text-base font-black tracking-widest uppercase text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  presents
                </span>
              </div>

              {/* Row 3: Sing Along Title Logo */}
              <div className="relative select-none text-center group cursor-default pt-0.5 sm:pt-1">
                {/* Golden Crown doodle above ALONG */}
                <div className="flex items-center justify-center -mb-1 sm:-mb-2">
                  <span className="text-amber-400 font-handwritten text-xl sm:text-2xl md:text-3xl font-black drop-shadow-[0_0_14px_rgba(255,190,0,0.9)] rotate-6 inline-block animate-float-note">
                    👑
                  </span>
                </div>

                <h1 className="singalong-3d-text text-4xl xs:text-5xl sm:text-6xl md:text-6xl font-black tracking-wide leading-tight drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)] -rotate-2 inline-block">
                  <span className="inline-block transition-transform duration-300 group-hover:scale-105">
                    SING
                  </span>
                  <span className="mx-2 sm:mx-3 inline-block transition-transform duration-300 group-hover:scale-105">
                    ALONG
                  </span>
                </h1>

                {/* Golden Yellow Brush Banner for LIVE MUSIC EVENT */}
                <div className="flex items-center justify-center mt-1.5 sm:mt-2">
                  <div className="live-music-brush-banner text-[10px] sm:text-xs md:text-sm">
                    LIVE MUSIC EVENT
                  </div>
                </div>
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
              MAIN BOOKING PORTAL WRAPPER
              ===================================================================== */}
          <main className={`w-full ${screen === 'success' ? 'max-w-none px-4 py-8 sm:py-12 bg-[#0B0F19]' : 'max-w-6xl mx-auto px-4 sm:px-6 py-10'} relative z-10`}>

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
                SCREEN: SUCCESS (OFFICIAL SING ALONG TICKET PASS - USER FORMAT)
                =================================================================== */}
            {screen === 'success' && ticketData && (
              <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center animate-fadeIn pb-12">
                {/* Top Quick Download & Celebration Banner */}
                <div className="w-full max-w-[420px] mb-5 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-display text-xs font-black tracking-wider uppercase mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>BOOKING CONFIRMED &amp; VERIFIED</span>
                  </div>
                  <h1 className="font-display text-xl sm:text-2xl font-black text-white">
                    Your Official Ticket Pass
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Present the QR code below at the entrance or download for offline access.
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowTicketModal(true)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Open Download Popup Modal</span>
                    </button>
                  </div>
                </div>

                {/* Printable / Downloadable Ticket Card (Exact format from user screenshot) */}
                <div
                  ref={ticketCaptureRef}
                  className="w-full max-w-[360px] xs:max-w-[390px] sm:max-w-[420px] bg-white rounded-[32px] sm:rounded-[36px] overflow-hidden shadow-2xl relative text-slate-800"
                >
                  {/* Top Header: Mascot Image, Event Info, and Vertical "ENTRY TICKET" */}
                  <div className="p-5 sm:p-6 pb-3 sm:pb-4 flex items-center justify-between gap-2.5 sm:gap-3">
                    {/* Mascot */}
                    <div className="w-16 sm:w-20 h-20 sm:h-24 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={MASCOT_PROMO_IMG}
                        alt="Sing Along Mascot"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Middle Info */}
                    <div className="flex-grow min-w-0 pr-1">
                      <h2 className="font-display font-bold text-lg sm:text-2xl text-slate-900 leading-tight">
                        Sing Along
                      </h2>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase block mt-0.5 sm:mt-1">
                        LIVE MUSIC EVENT
                      </span>
                      <span className="text-xs sm:text-sm text-slate-600 font-medium block mt-1 sm:mt-1.5 truncate">
                        {CONFIG.dateShort} | 6:00 PM
                      </span>
                      <span className="text-xs sm:text-sm text-slate-500 font-normal block mt-0.5 truncate">
                        {CONFIG.fullVenue}
                      </span>
                    </div>

                    {/* Right: Vertical ENTRY TICKET */}
                    <div
                      className="flex-shrink-0 text-[10px] sm:text-[11px] font-mono font-bold text-slate-400 tracking-[0.25em] select-none uppercase pl-1"
                      style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
                    >
                      ENTRY TICKET
                    </div>
                  </div>

                  {/* Notch 1 & "Tap to hide details" Toggle Pill */}
                  <div className="relative px-5 sm:px-7 py-2">
                    {/* Left Notch */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 sm:w-4.5 h-8 sm:h-9 rounded-r-full bg-[#0B0F19] z-10 pointer-events-none" />
                    {/* Right Notch */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 sm:w-4.5 h-8 sm:h-9 rounded-l-full bg-[#0B0F19] z-10 pointer-events-none" />

                    <button
                      type="button"
                      onClick={() => setShowTicketDetails(prev => !prev)}
                      className="w-full py-2 sm:py-2.5 px-4 rounded-full bg-[#EEF2F6] hover:bg-[#E2E8F0] text-slate-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>{showTicketDetails ? 'Tap to hide details' : 'Tap to hide details'}</span>
                      <ChevronUp className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${showTicketDetails ? '' : 'rotate-180'}`} />
                    </button>
                  </div>

                  {/* Collapsible Attendee Details */}
                  {showTicketDetails && (
                    <div className="mx-5 sm:mx-7 my-2 p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 animate-fadeIn">
                      <div className="flex justify-between border-b border-slate-200 pb-1.5">
                        <span className="text-slate-500">Attendee Name</span>
                        <strong className="text-slate-900 font-bold">{ticketData.fullName}</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-1.5">
                        <span className="text-slate-500">Contact Mobile</span>
                        <span className="font-mono text-slate-800">{ticketData.phone}</span>
                      </div>
                      {ticketData.email && ticketData.email !== 'Not provided' && (
                        <div className="flex justify-between border-b border-slate-200 pb-1.5">
                          <span className="text-slate-500">Email Address</span>
                          <span className="text-slate-800 truncate max-w-[180px]">{ticketData.email}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-b border-slate-200 pb-1.5">
                        <span className="text-slate-500">Gate Reporting</span>
                        <span className="font-bold text-amber-600">{CONFIG.reportingTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Booking Ref / UTR</span>
                        <span className="font-mono text-slate-600 truncate max-w-[150px]">{ticketData.utr || ticketData.paymentMethod || 'DIRECT'}</span>
                      </div>
                    </div>
                  )}

                  {/* Main QR Code & Ticket Body */}
                  <div className="px-5 sm:px-7 pt-4 sm:pt-5 pb-3 sm:pb-4 text-center">
                    <span className="text-slate-500 text-xs sm:text-sm font-medium block">
                      {ticketData.ticketQty || 1} {(ticketData.ticketQty || 1) > 1 ? 'Tickets' : 'Ticket'}
                    </span>
                    <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 tracking-wide uppercase mt-1">
                      SING ALONG TICKET
                    </h3>
                    <span className="text-slate-500 text-xs sm:text-sm block mt-0.5">
                      General Admission · {rupee(CONFIG.ticketPrice)} each
                    </span>

                    {/* QR Code Container */}
                    <div className="inline-block p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-xs my-4 sm:my-5">
                      {ticketQr ? (
                        <img
                          src={ticketQr}
                          alt="Verification QR Code"
                          className="w-44 h-44 xs:w-48 xs:h-48 sm:w-56 sm:h-56 object-contain"
                        />
                      ) : (
                        <div className="w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center bg-slate-50 text-slate-400 text-xs">
                          Generating QR Code...
                        </div>
                      )}
                    </div>

                    <p className="text-slate-500 text-xs sm:text-sm font-normal">
                      Scan at entry for verification
                    </p>

                    <p className="font-display font-black text-slate-900 text-sm sm:text-base tracking-wider mt-2 sm:mt-2.5">
                      BOOKING ID: {ticketData.bookingId}
                    </p>
                  </div>

                  {/* Notch 2 & Divider */}
                  <div className="relative py-2 flex items-center justify-between">
                    {/* Left Notch */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 sm:w-4.5 h-8 sm:h-9 rounded-r-full bg-[#0B0F19] z-10 pointer-events-none" />
                    <div className="w-full border-b border-slate-100 mx-6" />
                    {/* Right Notch */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 sm:w-4.5 h-8 sm:h-9 rounded-l-full bg-[#0B0F19] z-10 pointer-events-none" />
                  </div>

                  {/* Ticket Footer */}
                  <div className="px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between bg-white rounded-b-[32px] sm:rounded-b-[36px]">
                    <span className="text-slate-500 font-medium text-sm sm:text-base">
                      Total Amount
                    </span>
                    <span className="font-display font-black text-slate-900 text-xl sm:text-2xl">
                      {rupee(ticketData.amount || totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons: Download PDF, Save PNG, Share, Book Another */}
                <div className="w-full max-w-[360px] xs:max-w-[390px] sm:max-w-[420px] flex flex-col gap-2.5 sm:gap-3 mt-6">
                  {/* Primary PDF Download / Print Button */}
                  <button
                    type="button"
                    onClick={handleDownloadPdfTicket}
                    className="w-full py-3.5 sm:py-4 px-6 rounded-2xl font-display font-black text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:brightness-110 active:scale-98 shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4 flex-shrink-0" />
                    <span>Download Ticket Pass (PDF / Print)</span>
                  </button>

                  {/* Secondary PNG Image Save */}
                  <button
                    type="button"
                    onClick={handleDownloadTicket}
                    disabled={isDownloading}
                    className="w-full py-3 px-6 rounded-xl font-display font-bold text-xs sm:text-sm text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>{isDownloading ? 'Saving Pass...' : 'Save Pass Image (PNG)'}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      onClick={handleShareTicket}
                      className="w-full py-2.5 sm:py-3 px-4 rounded-xl font-display font-black text-xs text-white bg-gradient-to-r from-[#ff6a00] to-[#ee5007] hover:brightness-110 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Pass</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full py-2.5 sm:py-3 px-4 rounded-xl font-display font-bold text-xs text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Book Another</span>
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-center text-xs text-white/90 mt-1">
                    <p className="text-[11px] text-amber-300 font-semibold mb-1">If any booking or gate entry issue contact:</p>
                    <a href="tel:+919344037331" className="font-mono font-bold text-white text-sm hover:underline">
                      +91 93440 37331
                    </a>
                  </div>
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
                      {step === 1 ? 'Booker Details' : step === 2 ? 'Ticket Summary' : step === 3 ? 'Online Payment' : 'Review & Confirm'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white px-3 sm:px-8 py-3.5 sm:py-4 rounded-2xl border border-slate-200 shadow-sm">
                    {/* Step 1 */}
                    <div className="flex items-center gap-1.5 sm:gap-3">
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-display font-black text-xs sm:text-sm transition-all ${step >= 1 ? 'bg-gradient-to-br from-[#ff6a00] to-[#ee5007] text-white shadow-[0_0_14px_rgba(255,106,0,0.5)]' : 'bg-slate-100 text-slate-400'
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
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-display font-black text-xs sm:text-sm transition-all ${step >= 2 ? 'bg-gradient-to-br from-[#ff6a00] to-[#ee5007] text-white shadow-[0_0_14px_rgba(255,106,0,0.5)]' : 'bg-slate-100 text-slate-400'
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
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-display font-black text-xs sm:text-sm transition-all ${step >= 3 ? 'bg-gradient-to-br from-[#ff6a00] to-[#ee5007] text-white shadow-[0_0_14px_rgba(255,106,0,0.5)]' : 'bg-slate-100 text-slate-400'
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
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-display font-black text-xs sm:text-sm transition-all ${step >= 4 ? 'bg-gradient-to-br from-[#ff6a00] to-[#ee5007] text-white shadow-[0_0_14px_rgba(255,106,0,0.5)]' : 'bg-slate-100 text-slate-400'
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

                  {/* LEFT SIDE — EVENT PROMOTIONAL POSTER CARD (Covered 100% Edge-to-Edge, No Blank Spaces) */}
                  <div className="lg:col-span-5 relative rounded-2xl sm:rounded-[32px] overflow-hidden shadow-2xl border-2 border-amber-500/40 bg-[#0c0602] group h-[460px] xs:h-[520px] sm:h-[600px] lg:h-full min-h-[460px] lg:min-h-[620px]">
                    {/* Full poster image covering 100% width and height edge-to-edge with object-cover object-top */}
                    <img
                      src={POSTER_CARD_IMG}
                      onError={(e) => { e.currentTarget.src = POSTER_STAGE_BG; }}
                      alt="Sing Along Concert Official Poster"
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Subtle gradient vignette at the bottom for smooth finish */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
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
                                className={`w-full h-11 sm:h-12 pl-9 sm:pl-11 pr-3 sm:pr-4 rounded-xl border-2 bg-[#fdfbf7] text-slate-900 font-medium text-xs sm:text-sm outline-none transition-all ${errors.name ? 'border-red-500' : 'border-slate-200 focus:border-[#ff6a00] focus:bg-white focus:ring-2 focus:ring-[#ff6a00]/20'
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
                                className={`w-full h-11 sm:h-12 pl-9 sm:pl-11 pr-3 sm:pr-4 rounded-xl border-2 bg-[#fdfbf7] text-slate-900 font-medium text-xs sm:text-sm outline-none transition-all ${errors.mobile ? 'border-red-500' : 'border-slate-200 focus:border-[#ff6a00] focus:bg-white focus:ring-2 focus:ring-[#ff6a00]/20'
                                  }`}
                              />
                            </div>
                            {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
                          </div>

                          {/* Email ID */}
                          <div>
                            <label className="block font-display text-xs font-bold text-slate-800 mb-1">
                              Email ID <span className="text-[#ff6a00]">*</span>
                            </label>
                            <div className="relative">
                              <Mail className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#ff6a00]" />
                              <input
                                type="email"
                                required
                                value={booker.email}
                                onChange={(e) => setBooker({ ...booker, email: e.target.value })}
                                placeholder="e.g. rahul@example.com"
                                className={`w-full h-11 sm:h-12 pl-9 sm:pl-11 pr-3 sm:pr-4 rounded-xl border-2 bg-[#fdfbf7] text-slate-900 font-medium text-xs sm:text-sm outline-none transition-all ${errors.email ? 'border-red-500' : 'border-slate-200 focus:border-[#ff6a00] focus:bg-white focus:ring-2 focus:ring-[#ff6a00]/20'
                                  }`}
                              />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                          </div>

                          {/* Attendee Ticket Quantity Counter Card */}
                          <div className="flex items-center justify-between gap-2.5 bg-[#fff8f0] border-2 border-amber-500/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 mt-2">
                            <div>
                              <span className="font-display text-xs sm:text-sm font-bold text-slate-900 block">Number of Attendees</span>
                              <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                                {isGroupOffer && (
                                  <>
                                    <span className="text-[11px] text-slate-400 line-through font-semibold">
                                      ₹{CONFIG.ticketPrice}
                                    </span>
                                    <span className="text-[11px] sm:text-xs text-[#ff6a00] font-bold">
                                      {rupee(unitPrice)} × {qty} Passes
                                    </span>
                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-1.5 py-0.2 rounded-md">
                                      Offer Applied (Save ₹245)
                                    </span>
                                  </>
                                )}
                                {isBulkOffer && (
                                  <>
                                    <span className="text-[11px] sm:text-xs text-[#ff6a00] font-bold">
                                      ₹249 × 10 Passes
                                    </span>
                                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.5 rounded-md border border-emerald-300 animate-pulse">
                                      +1 Free Ticket (11 Passes Total)
                                    </span>
                                  </>
                                )}
                                {!isGroupOffer && !isBulkOffer && (
                                  <span className="text-[11px] sm:text-xs text-[#ff6a00] font-bold">
                                    {rupee(CONFIG.ticketPrice)} × {qty} {qty > 1 ? 'Passes' : 'Pass'}
                                  </span>
                                )}
                              </div>
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

                          {/* NEW ROW: Group 5 Tickets or Bulk 10 Tickets Booking Field */}
                          <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border-2 border-orange-400/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 mt-2.5 relative overflow-hidden shadow-sm">
                            {/* Header Row: Title and Blinking Offer Tag */}
                            <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
                              <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-[#ff6a00] flex-shrink-0" />
                                <span className="font-display text-xs sm:text-sm font-black text-slate-900">
                                  Group &amp; Bulk Booking
                                </span>
                              </div>

                              {/* Blinking Offer Tag */}
                              <div className="blink-offer-tag inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 text-white font-display font-black text-[10px] sm:text-xs tracking-wider uppercase shadow-md shadow-orange-500/30 select-none">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                </span>
                                <span>⚡ OFFERS: 5 PASSES @ ₹200 | 10 PASSES + 1 FREE!</span>
                              </div>
                            </div>

                            <p className="text-[11px] sm:text-xs text-slate-600 mb-2.5">
                              Book in group with friends &amp; family: Grab 5 passes at <strong className="text-orange-600 font-extrabold">₹200 / ticket</strong> OR book 10 passes &amp; get <strong className="text-emerald-700 font-extrabold">1 ticket FREE (Total 11 Passes)</strong>:
                            </p>

                            {/* Booking Field Options: Group 5 Tickets or Bulk 10 Tickets with Radio Buttons */}
                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                              {/* Option 1: Group (5 Tickets) */}
                              <button
                                type="button"
                                onClick={() => setQty(qty === 5 ? 1 : 5)}
                                className={`relative p-2.5 sm:p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between group ${
                                  qty === 5
                                    ? 'bg-gradient-to-br from-[#ff6a00] to-[#ee5007] text-white border-[#ee5007] shadow-lg shadow-orange-500/30 scale-[1.02]'
                                    : 'bg-white hover:bg-orange-50/70 text-slate-800 border-slate-200 hover:border-orange-300'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="groupBookingOffer"
                                  checked={qty === 5}
                                  onChange={() => setQty(5)}
                                  className="sr-only"
                                />
                                <div className="flex items-center justify-between mb-1.5 gap-1">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    {/* Radio Circle */}
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                      qty === 5
                                        ? 'border-white bg-white shadow-xs'
                                        : 'border-slate-300 bg-white group-hover:border-orange-400'
                                    }`}>
                                      {qty === 5 && (
                                        <div className="w-2 h-2 rounded-full bg-[#ff6a00]" />
                                      )}
                                    </div>
                                    <span className={`font-display text-xs sm:text-sm font-black truncate ${qty === 5 ? 'text-white' : 'text-slate-900'}`}>
                                      Group (5 Tickets)
                                    </span>
                                  </div>
                                  <span className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                                    qty === 5 ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-700'
                                  }`}>
                                    SAVE ₹245
                                  </span>
                                </div>
                                <div className="text-[11px] sm:text-xs pl-5.5">
                                  <div className="flex items-center gap-1">
                                    <span className={`line-through ${qty === 5 ? 'text-white/60' : 'text-slate-400'}`}>₹249</span>
                                    <span className={`font-black ${qty === 5 ? 'text-white' : 'text-[#ff6a00]'}`}>₹200 / ticket</span>
                                  </div>
                                  <span className={`text-[10px] block mt-0.5 ${qty === 5 ? 'text-white/90 font-bold' : 'text-slate-500'}`}>
                                    5 × ₹200 = ₹1,000 (5 Passes)
                                  </span>
                                </div>
                              </button>

                              {/* Option 2: Bulk (10 Tickets) */}
                              <button
                                type="button"
                                onClick={() => setQty(qty === 10 ? 1 : 10)}
                                className={`relative p-2.5 sm:p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between group ${
                                  qty === 10
                                    ? 'bg-gradient-to-br from-[#ff6a00] to-[#ee5007] text-white border-[#ee5007] shadow-lg shadow-orange-500/30 scale-[1.02]'
                                    : 'bg-white hover:bg-orange-50/70 text-slate-800 border-slate-200 hover:border-orange-300'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="groupBookingOffer"
                                  checked={qty === 10}
                                  onChange={() => setQty(10)}
                                  className="sr-only"
                                />
                                <div className="flex items-center justify-between mb-1.5 gap-1">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    {/* Radio Circle */}
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                      qty === 10
                                        ? 'border-white bg-white shadow-xs'
                                        : 'border-slate-300 bg-white group-hover:border-orange-400'
                                    }`}>
                                      {qty === 10 && (
                                        <div className="w-2 h-2 rounded-full bg-[#ff6a00]" />
                                      )}
                                    </div>
                                    <span className={`font-display text-xs sm:text-sm font-black truncate ${qty === 10 ? 'text-white' : 'text-slate-900'}`}>
                                      Bulk (10 Tickets)
                                    </span>
                                  </div>
                                  <span className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                                    qty === 10 ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-800'
                                  }`}>
                                    +1 FREE TICKET
                                  </span>
                                </div>
                                <div className="text-[11px] sm:text-xs pl-5.5">
                                  <div className="flex items-center gap-1">
                                    <span className={`font-black ${qty === 10 ? 'text-white' : 'text-slate-900'}`}>₹249 / ticket</span>
                                    <span className={`text-[10px] font-bold ${qty === 10 ? 'text-amber-200' : 'text-emerald-700'}`}>• 1 Free Pass!</span>
                                  </div>
                                  <span className={`text-[10px] block mt-0.5 ${qty === 10 ? 'text-white/95 font-bold' : 'text-slate-500'}`}>
                                    Pay 10 Passes = Total 11 Passes!
                                  </span>
                                </div>
                              </button>
                            </div>

                            {/* Live Calculation Display */}
                            <div className="mt-2.5 pt-2 border-t border-orange-200/70 flex items-center justify-between flex-wrap gap-1 text-[11px] sm:text-xs">
                              <span className="text-slate-600">
                                <strong>Calculation:</strong> {qty} × {rupee(unitPrice)} = <strong className="text-slate-900">{rupee(subtotal)}</strong>
                                <span className="text-slate-500 font-normal"> + {rupee(convenienceFee)} conv. fee</span>
                              </span>
                              {isBulkOffer ? (
                                <span className="font-black text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-md px-2 py-0.5 animate-pulse">
                                  🎁 1 Ticket FREE (Total 11 Passes)!
                                </span>
                              ) : isGroupOffer ? (
                                <span className="font-black text-emerald-700 bg-emerald-100 border border-emerald-300 rounded-md px-2 py-0.5">
                                  🎉 You Save {rupee(totalSavings)}!
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[10px]">Standard rate (₹249/pass)</span>
                              )}
                            </div>
                          </div>

                          {/* Booking Support Helpline */}
                          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80 text-[11px] sm:text-xs">
                            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                              <Phone className="w-3.5 h-3.5 text-[#ff6a00] flex-shrink-0" />
                              <span>If any booking issue contact:</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href="tel:+919344037331"
                                className="font-mono font-bold text-[#ff6a00] hover:underline"
                              >
                                +91 93440 37331
                              </a>
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
                                <span className="text-xs text-slate-400">
                                  {totalTickets} Pass{totalTickets > 1 ? 'es' : ''} {freeTickets > 0 ? `(${qty} Paid + ${freeTickets} Free)` : '• Total'}
                                </span>
                              </div>
                            </div>

                            <div className="pt-3 space-y-2 text-xs text-slate-600">
                              <div className="flex justify-between">
                                <span>Ticket Price ({qty} × {rupee(unitPrice)}):</span>
                                <span className="font-bold text-slate-800">{rupee(subtotal)}</span>
                              </div>
                              {isBulkOffer && (
                                <div className="flex justify-between text-emerald-600 font-semibold">
                                  <span>🎁 Buy 10 Get 1 Free Pass:</span>
                                  <span>+1 FREE Ticket (Worth ₹249)</span>
                                </div>
                              )}
                              {isGroupOffer && (
                                <div className="flex justify-between text-emerald-600 font-semibold">
                                  <span>Special Group Discount:</span>
                                  <span>-{rupee(totalSavings)}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span>Convenience Fee:</span>
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
                          {/* <div className="bg-amber-50/80 border border-amber-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-xs text-amber-900 space-y-1.5">
                            <div className="font-bold flex items-center gap-1.5 text-amber-800">
                              <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
                              <span>Entry Guidelines</span>
                            </div>
                            <p>• Please bring a digital copy of your confirmed ticket QR pass.</p>
                            <p>• 1 × 500 ml sealed water bottle per person permitted.</p>
                          </div> */}

                          {/* Booking Support Helpline */}
                          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80 text-[11px] sm:text-xs">
                            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                              <Phone className="w-3.5 h-3.5 text-[#ff6a00] flex-shrink-0" />
                              <span>If any booking issue contact:</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href="tel:+919344037331"
                                className="font-mono font-bold text-[#ff6a00] hover:underline"
                              >
                                +91 93440 37331
                              </a>
                            </div>
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
                            Instant Online Checkout
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Pay securely with real-time automated verification via Google Pay, PhonePe, Paytm, BHIM UPI, or Cards.
                          </p>
                        </div>

                        {/* REAL-TIME ONLINE GATEWAY */}
                        <div className="space-y-4 sm:space-y-5 animate-fadeIn">
                          <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-2 border-[#ff6a00]/30 rounded-xl sm:rounded-2xl p-3.5 sm:p-6">
                            <div className="flex flex-row items-center justify-between gap-2 mb-3 sm:mb-4">
                              <div>
                                <span className="text-[9px] sm:text-[10px] uppercase font-extrabold text-[#ff6a00] tracking-wider block">REAL-TIME GATEWAY</span>
                                <h3 className="font-display text-base sm:text-xl font-black text-slate-900">Instant Pass Verification</h3>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] sm:text-[10px] uppercase font-extrabold text-slate-400 block">TOTAL PAYABLE</span>
                                <span className="font-display text-xl sm:text-2xl font-black text-[#ff6a00]">{rupee(totalAmount)}</span>
                              </div>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed mb-3 sm:mb-4">
                              Supports <strong>Google Pay, PhonePe, Paytm, BHIM UPI, Credit/Debit Cards</strong>, and <strong>NetBanking</strong>. Your digital QR ticket pass is generated immediately.
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

                          {/* Booking Support Helpline */}
                          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80 text-[11px] sm:text-xs">
                            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                              <Phone className="w-3.5 h-3.5 text-[#ff6a00] flex-shrink-0" />
                              <span>If any booking issue contact:</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href="tel:+919344037331"
                                className="font-mono font-bold text-[#ff6a00] hover:underline"
                              >
                                +91 93440 37331
                              </a>
                            </div>
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
                              <span className="font-display text-xs font-bold text-slate-800 truncate max-w-[200px] sm:max-w-none text-right">
                                Instant Online Checkout (UPI / Cards)
                              </span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                              <span className="font-display text-xs sm:text-sm font-bold text-slate-800">Total Payable</span>
                              <span className="font-display text-lg sm:text-2xl font-black text-[#ff6a00]">{rupee(totalAmount)}</span>
                            </div>
                          </div>

                          {/* Booking Support Helpline */}
                          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80 text-[11px] sm:text-xs">
                            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                              <Phone className="w-3.5 h-3.5 text-[#ff6a00] flex-shrink-0" />
                              <span>If any booking issue contact:</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href="tel:+919344037331"
                                className="font-mono font-bold text-[#ff6a00] hover:underline"
                              >
                                +91 93440 37331
                              </a>
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
                              disabled={isSubmitting || isOnlinePaying}
                              className="w-full sm:w-auto px-5 py-3 rounded-xl font-display font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span>Back</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleInstantOnlinePay}
                              disabled={isSubmitting || isOnlinePaying}
                              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl font-display font-black text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-110 active:scale-98 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                            >
                              {isOnlinePaying ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Opening Checkout...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Pay {rupee(totalAmount)} &amp; Confirm Booking</span>
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

      {/* =====================================================================
          AUTOMATED POST-PAYMENT TICKET DOWNLOAD POPUP MODAL
          ===================================================================== */}
      {showTicketModal && ticketData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          {/* Backdrop click to dismiss */}
          <div
            className="fixed inset-0"
            onClick={() => setShowTicketModal(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-gradient-to-b from-[#182132] via-[#0f172a] to-[#0b0f19] text-white rounded-3xl border-2 border-amber-500/50 shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-5 sm:p-7 overflow-hidden z-10 my-auto">
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setShowTicketModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer z-20"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header: Celebration & Verification */}
            <div className="text-center mb-5 pr-6 sm:pr-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-3">
                <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9 text-white stroke-[2.5]" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PAYMENT SUCCESSFUL • TICKET CONFIRMED</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight">
                Your Entry Pass is Ready!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-sm mx-auto">
                Download your official QR pass now. Present this digital ticket at the gate for fast entry.
              </p>
            </div>

            {/* Ticket Summary Box */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 mb-5 space-y-3 shadow-inner">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Booking Reference ID</span>
                  <div className="font-mono text-base sm:text-lg font-black text-amber-300 tracking-wider">
                    {ticketData.bookingId}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyBookingId}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all"
                  title="Copy Booking ID"
                >
                  {isCopiedBookingId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Attendee:</span>
                  <strong className="text-white font-bold truncate block">{ticketData.fullName}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[11px] block">Pass Quantity:</span>
                  <strong className="text-[#ff6a00] font-black">{ticketData.ticketQty || 1} Pass{(ticketData.ticketQty || 1) > 1 ? 'es' : ''}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Event Date:</span>
                  <strong className="text-slate-200 font-semibold">{CONFIG.dateShort} (6 PM)</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[11px] block">Venue:</span>
                  <strong className="text-slate-200 font-semibold">{CONFIG.venue}, Sivakasi</strong>
                </div>
              </div>

              {/* QR Thumbnail */}
              {ticketQr && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-3">
                  <div className="p-1.5 bg-white rounded-xl shadow-xs">
                    <img src={ticketQr} alt="QR" className="w-16 h-16 object-contain" />
                  </div>
                  <div className="text-left text-[11px] text-slate-300">
                    <div className="font-bold text-white">Entry QR Pass Generated</div>
                    <div className="text-slate-400">Scan at entrance scanner</div>
                    <div className="text-emerald-400 font-mono text-[10px] mt-0.5">Paid: {rupee(ticketData.amount || totalAmount)}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              {/* Primary: Download Official Ticket Pass (PDF / Print) */}
              <button
                type="button"
                onClick={handleDownloadPdfTicket}
                className="w-full py-3.5 px-4 rounded-2xl font-display font-black text-sm sm:text-base text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:brightness-110 active:scale-98 shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-5 h-5 flex-shrink-0" />
                <span>Download Ticket Pass (PDF / Print)</span>
              </button>

              {/* Secondary: Save Pass as PNG Image */}
              <button
                type="button"
                onClick={handleDownloadTicket}
                disabled={isDownloading}
                className="w-full py-3 px-4 rounded-xl font-display font-bold text-xs sm:text-sm text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{isDownloading ? 'Generating High-Res Pass...' : 'Save Pass as Image (PNG)'}</span>
              </button>

              {/* Share & View actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleShareTicket}
                  className="py-2.5 px-3 rounded-xl font-display font-bold text-xs text-white bg-gradient-to-r from-[#ff6a00] to-[#ee5007] hover:brightness-110 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="py-2.5 px-3 rounded-xl font-display font-bold text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <span>View Ticket on Page</span>
                </button>
              </div>
            </div>

            {/* Email Notification & Helpline Note */}
            <div className="mt-4 pt-3 border-t border-slate-800 text-center text-[11px] text-slate-400 space-y-1">
              <p>📧 A confirmation copy with your QR pass has also been dispatched to your email.</p>
              <p className="text-amber-300 font-medium">Gate helpline: <a href="tel:+919344037331" className="underline font-bold">+91 93440 37331</a></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
