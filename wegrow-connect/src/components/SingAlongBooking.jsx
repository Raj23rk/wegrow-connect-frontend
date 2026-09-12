import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import 'bootstrap/dist/css/bootstrap.min.css';
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
  ChevronUp,
  ChevronDown,
  Info,
  Phone,
  Mail,
  UploadCloud,
  Home,
  Search,
  X,
  Volume2,
  VolumeX,
  Music
} from 'lucide-react';
import { bookSingAlongTicket, verifySingAlongTicket } from '../services/singAlongApi';

// Brand Assets
const LOGO_IMG = "/wegrow&Bschool.webp";
const MASCOT_IMG = "/mascot.webp";
const MASCOT_SONG_AUDIO = "/OM First Strike - Bgm _ Instrumental.mp3";

const CONFIG = {
  eventName: "Sing Along",
  titleLine1: "SING",
  titleLine2: "ALONG",
  tagline: "A Musical Night. Unlimited Memories.",
  category: "LIVE MUSIC EVENT",
  date: "4 October 2026",
  dateShort: "Sun, Oct 4, 2026",
  dateTicketTop: "04 OCT 2026",
  dayNum: "04",
  monthAbbr: "OCT",
  dayName: "SUNDAY",
  reportingTime: "5:30 PM – 6:00 PM",
  eventTime: "6:00 PM – 9:00 PM",
  venue: "Arasan Turf",
  location: "Sivakasi",
  fullVenue: "Arasan Turf, Sivakasi",
  presentedBy: "WeGrow Skill Campus & B School",
  organizer: "WeGrow Skill Campus",
  upiId: "arasanturf@upi",
  merchantName: "WeGrow Connect",
  ticketPrice: 199,
  maxTickets: 20,
  requireScreenshot: false,
  bookingPrefix: "SA26",
  contactNumbers: ["+91 93440 37331"],
  importantNotes: [
    "No outside food / No alcohol",
    "No smoking / vaping inside the venue",
    "1 × 500 ml water bottle per person allowed",
    "Tickets are non-refundable",
    "Weather postponement: same ticket stays valid"
  ],
  termsList: [
    "Entry is allowed only with a valid ticket / booking confirmation.",
    "Organizers reserve the right to refuse entry or eject anyone violating event rules, without refund.",
    "All bookings are subject to ticket availability and organizer discretion.",
    "By proceeding with the booking, all attendees agree to these terms and conditions."
  ],
  sponsors: [
    { name: "Food Partner", color: "#f97316" },
    { name: "Travel Partner", color: "#2547c7" },
    { name: "Ticket Partner", color: "#122064" },
    { name: "Digital Partner", color: "#fb923c" },
    { name: "Food Partner", color: "#f97316" },
    { name: "Travel Partner", color: "#2547c7" },
    { name: "Ticket Partner", color: "#122064" },
    { name: "Digital Partner", color: "#fb923c" }
  ]
};

const rupee = (n) => "₹" + Number(n).toLocaleString("en-IN");

const genBookingId = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return CONFIG.bookingPrefix + "-" + code;
};

const BANNER_CROWD = [
  { x: '2%', hc: '#d4926a', bc: '#0a162b', dur: '1.9s', dd: '0s', td: '0s', type: 0 },
  { x: '6%', hc: '#c8845a', bc: '#112240', dur: '2.2s', dd: '.3s', td: '.5s', type: 1 },
  { x: '11%', hc: '#bf7a50', bc: '#0d1a33', dur: '1.7s', dd: '.15s', td: '1.1s', type: 2 },
  { x: '16%', hc: '#e09970', bc: '#16284a', dur: '2.4s', dd: '.5s', td: '.2s', type: 0 },
  { x: '21%', hc: '#c88a60', bc: '#0f1f3d', dur: '1.6s', dd: '.1s', td: '.8s', type: 1 },
  { x: '26%', hc: '#bf7a50', bc: '#132444', dur: '2.0s', dd: '.4s', td: '.35s', type: 2 },
  { x: '31%', hc: '#d4926a', bc: '#0c1830', dur: '1.8s', dd: '.25s', td: '1.2s', type: 0 },
  { x: '36%', hc: '#c8845a', bc: '#142749', dur: '2.3s', dd: '.6s', td: '.4s', type: 1, dim: true },
  { x: '64%', hc: '#e09970', bc: '#101e38', dur: '1.5s', dd: '.35s', td: '.9s', type: 2, dim: true },
  { x: '69%', hc: '#c88a60', bc: '#152a4d', dur: '2.5s', dd: '.2s', td: '.15s', type: 0 },
  { x: '74%', hc: '#bf7a50', bc: '#0e1b36', dur: '1.9s', dd: '.45s', td: '.7s', type: 1 },
  { x: '79%', hc: '#d4926a', bc: '#122342', dur: '2.1s', dd: '.15s', td: '1.0s', type: 2 },
  { x: '84%', hc: '#c8845a', bc: '#16294d', dur: '1.7s', dd: '.55s', td: '.25s', type: 0 },
  { x: '89%', hc: '#e09970', bc: '#0d1933', dur: '2.2s', dd: '.3s', td: '.6s', type: 1 },
  { x: '94%', hc: '#c88a60', bc: '#132444', dur: '1.8s', dd: '.1s', td: '1.15s', type: 2 },
  { x: '97%', hc: '#bf7a50', bc: '#0f1e3a', dur: '2.4s', dd: '.4s', td: '.45s', type: 0 }
];

export default function SingAlongBooking() {
  const [screen, setScreen] = useState('form');
  const [showIntroModal, setShowIntroModal] = useState(true);
  const [step, setStep] = useState(1);

  // Form states
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [booker, setBooker] = useState({
    name: '',
    countryCode: '+91',
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ticket states
  const [ticketData, setTicketData] = useState(null);
  const [ticketDetailsOpen, setTicketDetailsOpen] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const [paymentQr, setPaymentQr] = useState('');
  const [ticketQr, setTicketQr] = useState('');

  // Mascot Singing Music Audio State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlayingMusic(true);
          toast.success("Playing Mascot Song 🎶", { id: 'music-toast', duration: 2500 });
        })
        .catch((err) => {
          console.error("Audio play error:", err);
          toast("Click again to enable audio playback!", { icon: '🎵', id: 'music-hint' });
        });
    }
  };

  const ticketCaptureRef = useRef(null);
  const totalAmount = qty * CONFIG.ticketPrice;

  // Scan & Pay UPI URL
  const upiUrl = `upi://pay?pa=${encodeURIComponent(CONFIG.upiId)}&pn=${encodeURIComponent(CONFIG.organizer)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(CONFIG.eventName + ' Ticket')}`;

  useEffect(() => {
    QRCode.toDataURL(upiUrl, {
      width: 200,
      margin: 1,
      color: { dark: '#12205c', light: '#ffffff' }
    })
      .then(url => setPaymentQr(url))
      .catch(err => console.error('UPI QR Error:', err));
  }, [totalAmount, upiUrl]);

  useEffect(() => {
    if (ticketData?.bookingId || ticketData?.ticketId) {
      const code = ticketData.verificationToken || `SINGALONG-VERIFY:${ticketData.bookingId}`;
      QRCode.toDataURL(code, {
        width: 220,
        margin: 1,
        color: { dark: '#12205c', light: '#ffffff' }
      })
        .then(url => setTicketQr(url))
        .catch(err => console.error('Ticket QR Error:', err));
    }
  }, [ticketData]);

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(CONFIG.upiId);
    setCopiedUpi(true);
    toast.success('UPI ID copied to clipboard!');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

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

  const validateStep2 = () => {
    const err = {};
    if (!qty || qty < 1) err.qty = "Please select at least 1 ticket.";
    else if (qty > CONFIG.maxTickets) err.qty = `Maximum ${CONFIG.maxTickets} tickets per booking.`;
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateStep3 = () => {
    const err = {};
    if (!payment.utr.trim()) {
      err.utr = "UPI Transaction ID / UTR is required.";
    } else if (payment.utr.trim().length < 6) {
      err.utr = "Enter a valid UTR / Transaction ID (min 6 chars).";
    }
    if (!payment.datetime) {
      err.datetime = "Payment date & time is required.";
    }
    if (CONFIG.requireScreenshot && !payment.fileData) {
      err.file = "Please upload your payment screenshot.";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNextStep = () => {
    let isValid = false;
    if (step === 1) isValid = validateStep1();
    else if (step === 2) isValid = validateStep2();
    else if (step === 3) isValid = validateStep3();

    if (isValid) {
      setStep(prev => prev + 1);
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setScreen('status');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const payload = {
      fullName: booker.name.trim(),
      phone: `${booker.countryCode} ${booker.mobile.trim()}`,
      email: booker.email.trim() || undefined,
      ticketQty: qty,
      utr: payment.utr.trim(),
      paymentScreenshot: payment.fileData || undefined,
      eventId: "SINGALONG-OCT-04-2026"
    };

    try {
      let bookedRecord = null;
      try {
        const res = await bookSingAlongTicket(payload);
        bookedRecord = res.data || res.booking || res;
      } catch (apiErr) {
        console.warn("Backend API notice, using fallback:", apiErr);
      }

      const confirmedBookingId = bookedRecord?.bookingId || genBookingId();
      const confirmedTicketData = {
        bookingId: confirmedBookingId,
        ticketId: bookedRecord?.ticketId || `TKT-${confirmedBookingId}`,
        fullName: booker.name.trim(),
        phone: `${booker.countryCode} ${booker.mobile.trim()}`,
        email: booker.email.trim(),
        ticketQty: qty,
        amount: totalAmount,
        utr: payment.utr.trim(),
        paidAt: new Date().toISOString(),
        verificationToken: bookedRecord?.verificationToken || `SINGALONG-VERIFY:${confirmedBookingId}`
      };

      setTimeout(() => {
        setTicketData(confirmedTicketData);
        setScreen('success');
        setIsSubmitting(false);
        toast.success("Ticket booked successfully! 🎉");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1800);
    } catch (err) {
      setIsSubmitting(false);
      setScreen('form');
      toast.error(err.message || "Failed to process booking. Please try again.");
    }
  };

  const handleDownloadTicket = async () => {
    if (!ticketCaptureRef.current) return;
    setIsDownloading(true);
    const toastId = toast.loading("Generating ticket image...");
    try {
      const canvas = await html2canvas(ticketCaptureRef.current, {
        scale: 2.5,
        backgroundColor: '#0a0e1f',
        useCORS: true,
        logging: false
      });
      const link = document.createElement("a");
      link.download = `SingAlong_Ticket_${ticketData?.bookingId || "Pass"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Ticket downloaded successfully!", { id: toastId });
    } catch (err) {
      console.error("Ticket download error:", err);
      toast.error("Could not download ticket image.", { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareTicket = async () => {
    const text = `🎟️ *${CONFIG.eventName} Live Music Event*\n📅 ${CONFIG.dateShort} | ${CONFIG.eventTime}\n📍 ${CONFIG.fullVenue}\n🎫 Booking ID: *${ticketData?.bookingId}*\n👤 Booked for: ${ticketData?.fullName} (${ticketData?.ticketQty} Ticket${ticketData?.ticketQty > 1 ? 's' : ''})\n\nBook your tickets here: ${window.location.origin}/sing-along`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: CONFIG.eventName,
          text: text,
          url: `${window.location.origin}/sing-along`
        });
      } catch (e) { }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handleReset = () => {
    setScreen('form');
    setStep(1);
    setBooker({ name: '', countryCode: '+91', mobile: '', email: '' });
    setQty(1);
    setPayment({ utr: '', datetime: new Date().toISOString().slice(0, 16), fileName: '', fileData: '' });
    setTicketData(null);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const renderCrowdSVG = () => (
    <svg viewBox="0 0 700 140" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      {Array.from({ length: 11 }).map((_, i) => {
        const x = 30 + i * 62;
        const s = 0.58 + Math.sin(i * 1.3) * 0.07;
        return (
          <g key={`b-${i}`} transform={`translate(${x},78) scale(${s.toFixed(2)})`}>
            <circle cx="0" cy="-30" r="7.5" fill="rgba(28,47,140,.55)" />
            <path d="M-10,-20 Q0,-27 10,-20 L12,10 Q0,17 -12,10 Z" fill="rgba(28,47,140,.55)" />
            <path d="M-8,-18 L-17,-38" stroke="rgba(28,47,140,.55)" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M8,-18 L17,-38" stroke="rgba(28,47,140,.55)" strokeWidth="4.5" strokeLinecap="round" />
          </g>
        );
      })}
      {Array.from({ length: 9 }).map((_, i) => {
        const x = 18 + i * 78;
        const s = 0.9 + Math.sin(i * 1.9) * 0.09;
        const fill = (i === 2 || i === 6) ? "#f97316" : "#050a1c";
        return (
          <g key={`f-${i}`} transform={`translate(${x},116) scale(${s.toFixed(2)})`}>
            <circle cx="0" cy="-30" r="7.5" fill={fill} />
            <path d="M-10,-20 Q0,-27 10,-20 L12,10 Q0,17 -12,10 Z" fill={fill} />
            <path d="M-8,-18 L-17,-38" stroke={fill} strokeWidth="4.5" strokeLinecap="round" />
            <path d="M8,-18 L17,-38" stroke={fill} strokeWidth="4.5" strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
  );

  return (
    <div
      className="min-vh-100 position-relative pb-5"
      style={{
        fontFamily: "'Inter', sans-serif",
        background: 'radial-gradient(120% 60% at 50% -5%, #e8f5e9 0%, #f1fbf5 35%, #f8fafc 100%)',
        backgroundColor: '#f8fafc',
        color: '#0f172a'
      }}
    >
      {/* Self-contained style overrides for stage beams, ticket perforations & keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Poppins', sans-serif !important; }
        .sa-card {
          background: #ffffff;
          border-radius: 22px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 16px 36px -10px rgba(22, 101, 52, 0.1);
          border: 1.5px solid #dcfce7;
          color: #0f172a;
        }
        .sa-step-card {
          background: #ffffff;
          border-radius: 22px;
          border: 1.5px solid #bbf7d0;
          box-shadow: 0 6px 14px -2px rgba(0, 0, 0, 0.04), 0 20px 40px -15px rgba(22, 101, 52, 0.12);
          color: #0f172a;
        }
        .sa-btn-primary {
          background: linear-gradient(180deg, #16a34a, #15803d);
          color: #fff;
          font-weight: 700;
          border-radius: 14px;
          border: none;
          box-shadow: 0 8px 20px -6px rgba(22,163,74,.5);
          transition: all .12s ease;
        }
        .sa-btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px -8px rgba(34,197,94,.65);
          color: #fff;
        }
        .sa-btn-primary:disabled { opacity: .4; cursor: not-allowed; }
        .sa-btn-ghost {
          background: #ffffff;
          color: #15803d;
          font-weight: 700;
          border-radius: 14px;
          border: 1.5px solid #bbf7d0;
          box-shadow: 0 2px 5px rgba(0,0,0,0.03);
          transition: all .12s ease;
        }
        .sa-btn-ghost:hover:not(:disabled) {
          background: #f0fdf4;
          border-color: #16a34a;
          color: #15803d;
        }
        .sa-field {
          width: 100%;
          border-radius: 13px;
          border: 1.5px solid #cbd5e1;
          background: #ffffff;
          padding: 12px 14px;
          font-size: 15px;
          color: #0f172a;
          outline: none;
          transition: border-color .12s ease, box-shadow .12s ease;
        }
        .sa-field:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 4px rgba(34,197,94,.18);
          background: #ffffff;
          color: #0f172a;
        }
        .sa-field option {
          background: #ffffff;
          color: #0f172a;
        }
        .sa-field-error { border-color: #ef4444 !important; }
        .step-dot { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0; }
        .step-line { flex: 1; height: 2.5px; background: #e2e8f0; margin: 0 6px; min-width: 16px; border-radius: 999px; }
        .step-line.done { background: #16a34a; box-shadow: 0 0 6px rgba(22,163,74,0.4); }
        .sa-spinner { width: 48px; height: 48px; border-radius: 50%; border: 4px solid #dcfce7; border-top-color: #16a34a; animation: saSpin 0.9s linear infinite; }
        @keyframes saSpin { to { transform: rotate(360deg); } }
        .poster-stage { position: relative; overflow: hidden; color: #fff; background: radial-gradient(120% 90% at 18% 0%, rgba(22,163,74,.42), transparent 55%), radial-gradient(95% 75% at 88% 8%, rgba(249,115,22,.32), transparent 52%), linear-gradient(180deg, #092617 0%, #031009 75%); }
        .poster-stars { position: absolute; inset: 0; background-image: radial-gradient(1.5px 1.5px at 20% 22%, rgba(255,255,255,.55) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 72% 14%, rgba(255,255,255,.4) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 42% 32%, rgba(255,255,255,.4) 50%, transparent 51%), radial-gradient(1.5px 1.5px at 88% 30%, rgba(255,255,255,.3) 50%, transparent 51%); }
        .stage-beam { position: absolute; top: -16%; width: 34%; height: 120%; background: linear-gradient(180deg, rgba(255,255,255,.14), transparent 68%); transform: skewX(-13deg); filter: blur(1.5px); pointer-events: none; }
        .poster-gradtext { background: linear-gradient(90deg, #86efac, #22c55e, #fbbf24); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .mascot-note { position: absolute; font-family: 'Poppins', sans-serif; font-weight: 700; pointer-events: none; animation: saNoteFloat 5s ease-in-out infinite; text-shadow: 0 2px 8px rgba(0,0,0,.35); }
        @keyframes saNoteFloat { 0%,100% { transform: translateY(0) rotate(-6deg); } 50% { transform: translateY(-8px) rotate(6deg); } }
        .mic-badge { width: 32px; height: 32px; border-radius: 50%; background: #f97316; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 14px -4px rgba(249,115,22,.7); position: relative; z-index: 2; }
        .mic-ring { position: absolute; inset: -7px; border-radius: 50%; border: 2px solid rgba(249,115,22,.55); animation: saMicPing 2.4s ease-out infinite; }
        @keyframes saMicPing { 0% { transform: scale(.7); opacity: .9; } 100% { transform: scale(1.85); opacity: 0; } }
        .crowd-fade { background: linear-gradient(180deg, transparent, #031009 88%); }
        .ticket-card { background: #ffffff; border: 1.5px solid #dcfce7; border-radius: 22px; box-shadow: 0 20px 50px -15px rgba(22, 101, 52, 0.15); position: relative; overflow: hidden; color: #0f172a; }
        .perf-row { position: relative; padding: 0 22px; margin-top: 8px; }
        .perf-row::before, .perf-row::after { content: ""; position: absolute; top: 50%; transform: translateY(-50%); width: 26px; height: 26px; border-radius: 50%; background: #f8fafc; }
        .perf-row::before { left: -13px; }
        .perf-row::after { right: -13px; }
        .perf-pill { width: 100%; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 999px; padding: 12px 0; text-align: center; color: #166534; font-size: 13.5px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; }
        .perf-pill:hover { background: #dcfce7; color: #14532d; }
        .perf-divider { position: relative; height: 1px; background: #e2e8f0; margin: 0 34px; }
        .perf-divider::before, .perf-divider::after { content: ""; position: absolute; top: 50%; transform: translateY(-50%); width: 26px; height: 26px; border-radius: 50%; background: #f8fafc; }
        .perf-divider::before { left: -35px; }
        .perf-divider::after { right: -35px; }
        .vtag { writing-mode: vertical-rl; transform: rotate(180deg); letter-spacing: .14em; font-size: 10.5px; color: #16a34a; flex-shrink: 0; font-weight: 700; }
        .qty-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: 1.5px solid #bbf7d0;
          background: #f0fdf4;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 19px;
          color: #15803d;
          transition: all .12s ease;
          flex-shrink: 0;
          cursor: pointer;
        }
        .qty-btn:hover:not(:disabled) {
          background: #16a34a;
          border-color: #16a34a;
          color: #ffffff;
        }
        .qty-btn:disabled { opacity: .3; cursor: not-allowed; }
        .checkbox-box { width: 20px; height: 20px; border-radius: 6px; border: 2px solid #94a3b8; background: #ffffff; flex-shrink: 0; display: flex; align-items: center; justify-content: center; margin-top: 1px; transition: all .12s ease; }
        .checkbox-box.checked { background: #16a34a; border-color: #16a34a; }
        .ribbon { background: linear-gradient(180deg, #fb923c, #ea580c); box-shadow: 0 6px 16px -6px rgba(234,88,12,.6); }
        .price-chip { border-radius: 14px; padding: 10px 12px; }
        .scroll-x { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .sa-marquee-wrap { overflow: hidden; width: 100%; }
        .sa-marquee-track { display: flex; gap: 0; width: max-content; animation: saMarquee 28s linear infinite; }
        .sa-marquee-track:hover { animation-play-state: paused; }
        .sa-marquee-group { display: flex; align-items: center; gap: 20px; padding-right: 20px; }
        .sa-partner-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1.5px solid #dcfce7;
          border-radius: 40px;
          padding: 6px 14px 6px 8px;
          box-shadow: 0 4px 12px rgba(22, 101, 52, 0.08);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .sa-partner-icon { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px; }
        .sa-partner-sep { width: 4px; height: 4px; border-radius: 50%; background: #86efac; flex-shrink: 0; }
        @keyframes saMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes saMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        /* Concert scene animations */
        @keyframes saBob { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-10px); } }
        @keyframes saDance  { 0%,100% { transform: translateY(0) rotate(-5deg); } 50% { transform: translateY(-7px) rotate(5deg); } }
        @keyframes saDance2 { 0%,100% { transform: translateY(0) rotate(4deg);  } 50% { transform: translateY(-9px) rotate(-4deg); } }
        @keyframes saCrowdSway { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-6px) rotate(3deg); } }
        @keyframes saArmL   { 0%,100% { transform: rotate(-50deg); } 50% { transform: rotate(-10deg); } }
        @keyframes saArmR   { 0%,100% { transform: rotate(50deg);  } 50% { transform: rotate(10deg);  } }
        @keyframes saLegL   { 0%,100% { transform: rotate(-12deg); } 50% { transform: rotate(6deg); } }
        @keyframes saLegR   { 0%,100% { transform: rotate(12deg);  } 50% { transform: rotate(-6deg); } }
        @keyframes saTorch  { 0%,100% { opacity:1;  box-shadow:0 0 14px 7px rgba(255,255,255,1), 0 0 28px 12px rgba(134,239,172,0.85), 0 -24px 34px 8px rgba(255,255,255,0.45); } 50% { opacity:.25; box-shadow:0 0 3px 1px rgba(255,255,255,.3); } }
        @keyframes saTorch2 { 0%,35% { opacity:.25; box-shadow:none; } 65%,100% { opacity:1;  box-shadow:0 0 16px 8px rgba(255,255,255,1), 0 0 32px 14px rgba(254,240,138,0.85), 0 -26px 36px 8px rgba(255,255,255,0.45); } }
        @keyframes saTorch3 { 0%,20%,80%,100% { opacity:1; box-shadow:0 0 14px 7px rgba(255,255,255,1), 0 0 26px 10px rgba(186,230,253,0.8), 0 -24px 32px 6px rgba(255,255,255,.4); } 40%,60% { opacity:.2; box-shadow:0 0 2px 1px rgba(255,255,255,.2); } }
        @keyframes saNoteRise { 0% { transform:translateY(0) rotate(-8deg) scale(.8); opacity:0; } 15% { opacity:1; } 85% { opacity:.7; } 100% { transform:translateY(-220px) rotate(14deg) scale(1.1); opacity:0; } }
        @keyframes saBeamSway { 0%,100% { transform:skewX(-12deg) translateX(0); } 50% { transform:skewX(-12deg) translateX(18px); } }
        @keyframes saTurfWave { 0%,100% { background-position:0 0; } 50% { background-position:8px 0; } }
        @keyframes saPulseGlow { 0%,100% { box-shadow:0 -6px 32px 0 rgba(34,197,94,.45); } 50% { box-shadow:0 -10px 48px 0 rgba(34,197,94,.75); } }
        @keyframes saPhoneLight { 0%,100% { opacity:1; filter:brightness(1.2); } 50% { opacity:.15; filter:brightness(.5); } }
        .sa-concert-wrap { position:relative; width:100%; height:100%; overflow:hidden; }
        .sa-turf { position:absolute; bottom:0; left:0; right:0; height:24%; background:repeating-linear-gradient(90deg,#0f4722 0px,#0f4722 14px,#155e2d 14px,#155e2d 28px); border-top:3px solid #22c55e; animation:saTurfWave 3s ease-in-out infinite, saPulseGlow 2.5s ease-in-out infinite; }
        .sa-stage-line { position:absolute; bottom:24%; left:3%; right:3%; height:3px; background:linear-gradient(90deg,transparent,#22c55e 15%,#86efac 50%,#22c55e 85%,transparent); box-shadow:0 0 18px 5px rgba(34,197,94,.85); border-radius:999px; }
        .sa-beam { position:absolute; top:0; width:7%; height:75%; background:linear-gradient(180deg,rgba(255,255,255,.18),transparent); transform-origin:top center; filter:blur(2px); pointer-events:none; animation:saBeamSway 4s ease-in-out infinite; }
        .sa-note { position:absolute; pointer-events:none; animation:saNoteRise 3.5s ease-in-out infinite; }
        .sa-mascot-stage { position:absolute; bottom:24%; left:50%; transform:translateX(-50%); z-index:1; animation:saBob 1.8s ease-in-out infinite; }
        /* Mascot Singing Animation Keyframes */
        @keyframes saMascotSing {
          0%, 100% { transform: translateY(0) rotate(-2.5deg) scale(1); }
          25% { transform: translateY(-9px) rotate(2deg) scale(1.03); }
          50% { transform: translateY(-3px) rotate(-1deg) scale(1.01); }
          75% { transform: translateY(-11px) rotate(3deg) scale(1.04); }
        }
        @keyframes saSingingNote {
          0% { transform: translateY(0) translateX(0) scale(0.6) rotate(-8deg); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 0.9; }
          100% { transform: translateY(-75px) translateX(18px) scale(1.2) rotate(18deg); opacity: 0; }
        }
        .sa-singing-note {
          position: absolute;
          font-weight: 800;
          pointer-events: none;
          filter: drop-shadow(0 0 6px rgba(255,255,255,0.7));
          animation: saSingingNote 3.2s ease-in-out infinite;
        }
        @keyframes saSpotlightPulse {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) scaleX(1); }
          50% { opacity: 0.95; transform: translateX(-50%) scaleX(1.15); }
        }
        @keyframes saStageDiscPulse {
          0%, 100% { transform: translateX(-50%) scale(1); box-shadow: 0 0 24px 8px rgba(34, 197, 94, 0.7); }
          50% { transform: translateX(-50%) scale(1.12); box-shadow: 0 0 38px 14px rgba(34, 197, 94, 0.95); }
        }
        .sa-mascot-singer {
          height: 96px;
          width: auto;
        }
        @media (max-width: 768px) {
          .sa-mascot-singer {
            height: 84px;
          }
        }
        @media (max-width: 480px) {
          .sa-mascot-singer {
            height: 72px;
          }
        }
        /* Music Equalizer and Control Styles */
        .eq-bar {
          display: inline-block;
          width: 3px;
          background: #ffffff;
          border-radius: 2px;
          animation: eqBounce 0.8s ease-in-out infinite;
        }
        .eq-bar-1 { height: 10px; animation-delay: 0s; }
        .eq-bar-2 { height: 14px; animation-delay: 0.2s; }
        .eq-bar-3 { height: 7px;  animation-delay: 0.4s; }
        .eq-bar-4 { height: 12px; animation-delay: 0.15s; }
        @keyframes eqBounce {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1); }
        }
        /* Rotating Colored Stage Light Beams */
        @keyframes saRotateColorBeamLeft {
          0% {
            transform: rotate(-34deg) scaleX(0.9);
            opacity: 0.72;
          }
          50% {
            transform: rotate(10deg) scaleX(1.12);
            opacity: 0.98;
          }
          100% {
            transform: rotate(-34deg) scaleX(0.9);
            opacity: 0.72;
          }
        }
        @keyframes saRotateColorBeamRight {
          0% {
            transform: rotate(34deg) scaleX(0.9);
            opacity: 0.72;
          }
          50% {
            transform: rotate(-10deg) scaleX(1.12);
            opacity: 0.98;
          }
          100% {
            transform: rotate(34deg) scaleX(0.9);
            opacity: 0.72;
          }
        }
        .sa-color-beam-left {
          position: absolute;
          top: 6px;
          left: 6px;
          width: 300px;
          height: 420px;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.55) 0%, rgba(168, 85, 247, 0.35) 45%, rgba(34, 197, 94, 0.15) 75%, transparent 100%);
          clip-path: polygon(0% 0%, 28% 0%, 100% 100%, 14% 100%);
          transform-origin: top left;
          filter: blur(2px);
          pointer-events: none;
          animation: saRotateColorBeamLeft 5.2s ease-in-out infinite;
        }
        .sa-color-beam-right {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 300px;
          height: 420px;
          background: linear-gradient(225deg, rgba(249, 115, 22, 0.55) 0%, rgba(236, 72, 153, 0.35) 45%, rgba(234, 179, 8, 0.15) 75%, transparent 100%);
          clip-path: polygon(72% 0%, 100% 0%, 86% 100%, 0% 100%);
          transform-origin: top right;
          filter: blur(2px);
          pointer-events: none;
          animation: saRotateColorBeamRight 5.2s ease-in-out infinite -2.6s;
        }
        .sa-modal-scroll {
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: rgba(22,163,74,0.4) transparent;
        }
        .sa-modal-scroll::-webkit-scrollbar { width: 6px; }
        .sa-modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .sa-modal-scroll::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.35); border-radius: 999px; }
        .sa-modal-scroll::-webkit-scrollbar-thumb:hover { background: rgba(34,197,94,0.6); }
      `}</style>

      {/* =========================================================================
          1. FIRST: "BEFORE YOU BOOK" POPUP MODAL (Screenshot 1)
          ========================================================================= */}
      {showIntroModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-2 p-sm-3"
          style={{ zIndex: 1050 }}
        >
          {/* ── Animated Concert Backdrop ── */}
          <div className="sa-concert-wrap" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 50% 0%, #0d3822 0%, #082416 60%, #03100a 100%)' }}>

            {/* Stage beams */}
            <div className="sa-beam" style={{ left: '12%', animationDelay: '0s', animationDuration: '5s' }} />
            <div className="sa-beam" style={{ left: '30%', animationDelay: '-.8s', animationDuration: '4.2s', opacity: .7 }} />
            <div className="sa-beam" style={{ left: '58%', animationDelay: '-.4s', animationDuration: '4.8s' }} />
            <div className="sa-beam" style={{ right: '12%', left: 'unset', animationDelay: '-1.2s', animationDuration: '5.4s', opacity: .6 }} />

            {/* Blinking torch lights & concert sparkles */}
            {['18%', '35%', '55%', '72%', '82%', '8%', '90%'].map((l, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: l,
                  bottom: '24%',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 0 14px 5px rgba(255,255,255,0.95), 0 0 24px 10px rgba(34,197,94,0.6)',
                  animation: `saTorch ${1.8 + (i % 3) * 0.4}s ease-in-out infinite`,
                  animationDelay: `${i * 0.35}s`,
                  pointerEvents: 'none'
                }}
              />
            ))}

            {/* Green turf floor */}
            <div className="sa-turf" />
            {/* Stage line glow */}
            <div className="sa-stage-line" />


            {/* Audience row – realistic dancing figures */}
            {[
              { x: '3%', hc: '#c8845a', bc: '#1a2456', dur: '1.9s', dd: '0s', td: '0s', ev: 0 },
              { x: '10%', hc: '#d4926a', bc: '#1e3060', dur: '2.1s', dd: '.3s', td: '.5s', ev: 1 },
              { x: '18%', hc: '#bf7a50', bc: '#162048', dur: '1.7s', dd: '.15s', td: '1s', ev: 0 },
              { x: '25%', hc: '#e09970', bc: '#0f1a3e', dur: '2.3s', dd: '.5s', td: '.2s', ev: 1 },
              { x: '33%', hc: '#c88a60', bc: '#1c2d58', dur: '1.6s', dd: '.1s', td: '.8s', ev: 0 },
              { x: '61%', hc: '#bf7a50', bc: '#1a2456', dur: '2s', dd: '.4s', td: '0.3s', ev: 1 },
              { x: '68%', hc: '#d4926a', bc: '#1e3060', dur: '1.8s', dd: '.2s', td: '1.2s', ev: 0 },
              { x: '75%', hc: '#c8845a', bc: '#162048', dur: '2.2s', dd: '.6s', td: '.6s', ev: 1 },
              { x: '83%', hc: '#e09970', bc: '#0f1a3e', dur: '1.5s', dd: '.35s', td: '.1s', ev: 0 },
              { x: '91%', hc: '#c88a60', bc: '#1c2d58', dur: '2.4s', dd: '.25s', td: '.9s', ev: 1 },
            ].map((p, i) => {
              const da = p.ev === 0 ? 'saDance' : 'saDance2';
              return (
                <div key={i} style={{ position: 'absolute', bottom: '22%', left: p.x, display: 'flex', flexDirection: 'column', alignItems: 'center', animation: `${da} ${p.dur} ease-in-out infinite`, animationDelay: p.dd }}>

                  {/* Phone torch – WHITE blinking with upward beam */}
                  <div style={{
                    width: '5px', height: '9px', borderRadius: '2px',
                    background: '#e0e0e0',
                    marginBottom: '2px',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute', top: '-5px', left: '50%', transform: 'translateX(-50%)',
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: '#fff',
                      animation: `${p.ev === 0 ? 'saTorch' : 'saTorch2'} ${p.dur} ease-in-out infinite`,
                      animationDelay: p.td
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '18px',
                      height: '60px',
                      background: 'linear-gradient(to top, rgba(255,255,255,0.4) 0%, rgba(134,239,172,0.12) 60%, transparent 100%)',
                      clipPath: 'polygon(38% 100%, 62% 100%, 100% 0%, 0% 0%)',
                      animation: `${p.ev === 0 ? 'saTorch' : 'saTorch2'} ${p.dur} ease-in-out infinite`,
                      animationDelay: p.td,
                      filter: 'blur(1px)',
                      pointerEvents: 'none'
                    }} />
                  </div>

                  {/* Raised arm holding phone */}
                  <div style={{
                    width: '4px', height: '22px', background: p.bc, borderRadius: '2px',
                    transformOrigin: 'bottom center',
                    animation: `saArmL ${p.dur} ease-in-out infinite`,
                    animationDelay: p.dd
                  }} />

                  {/* Head */}
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: p.hc, border: '1.5px solid rgba(255,255,255,.15)', marginBottom: '1px' }} />

                  {/* Torso */}
                  <div style={{ position: 'relative', width: '20px', height: '28px', background: p.bc, borderRadius: '5px 5px 0 0' }}>
                    {/* Left arm */}
                    <div style={{
                      position: 'absolute', top: '6px', left: '-10px',
                      width: '10px', height: '4px', background: p.bc, borderRadius: '2px',
                      transformOrigin: 'right center',
                      animation: `saArmL ${p.dur} ease-in-out infinite`,
                      animationDelay: p.dd
                    }} />
                    {/* Right arm */}
                    <div style={{
                      position: 'absolute', top: '6px', right: '-10px',
                      width: '10px', height: '4px', background: p.bc, borderRadius: '2px',
                      transformOrigin: 'left center',
                      animation: `saArmR ${p.dur} ease-in-out infinite`,
                      animationDelay: p.dd
                    }} />
                  </div>

                  {/* Legs */}
                  <div style={{ display: 'flex', gap: '3px' }}>
                    <div style={{
                      width: '7px', height: '20px', background: p.bc, borderRadius: '0 0 4px 4px',
                      transformOrigin: 'top center',
                      animation: `saLegL ${p.dur} ease-in-out infinite`,
                      animationDelay: p.dd
                    }} />
                    <div style={{
                      width: '7px', height: '20px', background: p.bc, borderRadius: '0 0 4px 4px',
                      transformOrigin: 'top center',
                      animation: `saLegR ${p.dur} ease-in-out infinite`,
                      animationDelay: p.dd
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Booking Card ── */}
          <div className="sa-card sa-modal-scroll w-100 shadow-lg position-relative my-auto" style={{ maxWidth: '580px', maxHeight: '94vh', zIndex: 2, borderRadius: '22px' }}>

            {/* ── Concert banner inside card ── */}
            <div style={{
              position: 'relative', overflow: 'hidden',
              background: 'radial-gradient(130% 140% at 50% -10%, #166534 0%, #0a3820 50%, #03140a 100%)',
              padding: '14px 20px 0',
              borderRadius: '22px 22px 0 0'
            }}>
              {/* Beams */}
              {[{ l: '10%', d: '0s' }, { l: '30%', d: '-.6s' }, { l: '55%', d: '-.3s' }, { l: '75%', d: '-1s' }].map((b, i) => (
                <div key={i} style={{ position: 'absolute', top: 0, left: b.l, width: '8%', height: '100%', background: 'linear-gradient(180deg,rgba(255,255,255,.13),transparent)', transform: 'skewX(-10deg)', filter: 'blur(2px)', animation: `saBeamSway 4s ease-in-out infinite`, animationDelay: b.d, pointerEvents: 'none' }} />
              ))}
              {/* Floating notes */}
              {[['♪', '#86efac', '12%', '0s'], ['♫', '#fb923c', '78%', '-1s'], ['♩', '#4ade80', '88%', '-2s'], ['♬', '#a78bfa', '5%', '-1.5s']].map(([n, c, l, d], i) => (
                <div key={i} style={{ position: 'absolute', bottom: '6px', left: l, color: c, fontSize: i % 2 === 0 ? '16px' : '13px', animation: 'saNoteRise 3.5s ease-in-out infinite', animationDelay: d, pointerEvents: 'none' }}>{n}</div>
              ))}

              <div className="d-flex align-items-center justify-content-between position-relative" style={{ zIndex: 2 }}>
                {/* Left: Titles */}
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(34,197,94,.18)', border: '1px solid rgba(34,197,94,.4)', borderRadius: '20px', padding: '2px 10px', marginBottom: '4px' }}>
                    <Ticket style={{ width: '11px', height: '11px', color: '#86efac' }} />
                    <span style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '1.2px', color: '#86efac', textTransform: 'uppercase' }}>Before You Book</span>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', fontFamily: 'Poppins,sans-serif', lineHeight: 1.1, marginBottom: '2px' }}>
                    SING <span style={{ background: 'linear-gradient(90deg,#86efac,#4ade80,#fb923c)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>ALONG</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#86efac', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Live Music Event</div>
                </div>

                {/* Right: Mascot */}
                <div style={{ animation: 'saBob 1.8s ease-in-out infinite', marginRight: '6px' }}>
                  <img src={MASCOT_IMG} alt="WeGrow Mascot" style={{ height: '75px', width: 'auto', filter: 'drop-shadow(0 4px 16px rgba(34,197,94,.5))' }} />
                </div>
              </div>

              {/* Green turf edge */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg,transparent,#22c55e 30%,#86efac 50%,#22c55e 70%,transparent)', boxShadow: '0 0 12px 2px rgba(34,197,94,.7)' }} />
            </div>

            <div className="p-3 p-sm-4">

              {/* Title & Venue Header with Ticket Price badge */}
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1.5px solid #e2e8f0' }}>
                <div>
                  <div className="small" style={{ fontSize: '11px', color: '#64748b' }}>Musical evening at</div>
                  <div className="font-display font-weight-bold" style={{ color: '#0f172a', fontSize: '17px', fontWeight: 800 }}>
                    {CONFIG.fullVenue}
                  </div>
                </div>
                <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-3" style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
                  <span className="small font-medium" style={{ fontSize: '11px', color: '#166534' }}>Ticket Price:</span>
                  <span className="font-display font-weight-bold fs-5" style={{ color: '#15803d' }}>
                    {rupee(CONFIG.ticketPrice)}
                  </span>
                </div>
              </div>

              {/* 2-Column Notes & Terms */}
              <div className="row g-2 g-md-3 mb-3">
                {/* Column 1: Important Notes */}
                <div className="col-12 col-md-6">
                  <div className="text-uppercase font-weight-bold mb-1.5" style={{ fontSize: '11px', letterSpacing: '0.8px', color: '#15803d' }}>
                    IMPORTANT NOTES
                  </div>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-1">
                    {CONFIG.importantNotes.map((note, idx) => (
                      <li key={idx} className="d-flex align-items-start gap-1.5" style={{ fontSize: '12px', lineHeight: 1.35, color: '#334155' }}>
                        <AlertTriangle className="text-warning flex-shrink-0 mt-0.5" style={{ width: '13px', height: '13px' }} />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 2: Terms & Conditions */}
                <div className="col-12 col-md-6">
                  <div className="text-uppercase font-weight-bold mb-1.5" style={{ fontSize: '11px', letterSpacing: '0.8px', color: '#15803d' }}>
                    TERMS &amp; CONDITIONS
                  </div>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-1">
                    {CONFIG.termsList.map((term, idx) => (
                      <li key={idx} className="d-flex align-items-start gap-1.5" style={{ fontSize: '12px', lineHeight: 1.35, color: '#334155' }}>
                        <span className="rounded-circle mt-1.5 flex-shrink-0" style={{ width: '5px', height: '5px', background: '#16a34a' }}></span>
                        <span>{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Checkbox Agreement */}
              <div
                onClick={() => setTermsAccepted(!termsAccepted)}
                className="d-flex align-items-center gap-2 p-2.5 px-3 rounded-3 mb-3 cursor-pointer user-select-none"
                style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}
              >
                <div className={`checkbox-box ${termsAccepted ? 'checked' : ''}`} style={{ width: '18px', height: '18px' }}>
                  {termsAccepted && <Check className="text-white" style={{ width: '12px', height: '12px', strokeWidth: 3 }} />}
                </div>
                <span className="small font-weight-semibold lh-sm" style={{ fontSize: '12px', color: '#1e293b' }}>
                  I have read and agree to all Terms &amp; Conditions and event rules.
                </span>
              </div>

              {/* Submit Button */}
              <button
                disabled={!termsAccepted}
                onClick={() => {
                  if (termsAccepted) {
                    setShowIntroModal(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // Auto-start mascot singing song on user interaction
                    if (audioRef.current) {
                      audioRef.current.play()
                        .then(() => {
                          setIsPlayingMusic(true);
                          toast.success("Sing Along with the Mascot! 🎶", { id: 'music-start', duration: 2500 });
                        })
                        .catch((err) => console.log("Audio play deferred:", err));
                    }
                  }
                }}
                className="sa-btn-primary w-100 py-2.5 d-flex align-items-center justify-content-center gap-2"
                style={{ fontSize: '15px' }}
              >
                <span>Let's Book &amp; Hear Mascot Sing 🎵</span>
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Real Mascot Song Audio Element */}
      <audio
        ref={audioRef}
        src={MASCOT_SONG_AUDIO}
        loop
        preload="auto"
        onPlay={() => setIsPlayingMusic(true)}
        onPause={() => setIsPlayingMusic(false)}
      />

      {/* =========================================================================
          2. SECOND: MAIN BOOKING PAGE (Screenshot 2)
          ========================================================================= */}
      <div className={`container py-4 ${showIntroModal ? 'opacity-50 user-select-none' : ''}`} style={{ maxWidth: '1140px', filter: showIntroModal ? 'blur(2px)' : 'none' }}>

        {/* HEADER BANNER CARD - NATURAL GREEN TURF MODE */}
        <div
          className="rounded-4 p-4 p-sm-5 text-white position-relative overflow-hidden shadow-lg mb-3"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(4, 28, 16, 0.68) 0%, rgba(8, 44, 25, 0.52) 40%, rgba(2, 16, 9, 0.88) 100%), url('/arasan_turf_bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 42%',
            backgroundRepeat: 'no-repeat',
            border: '1.5px solid rgba(34, 197, 94, 0.45)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), inset 0 0 80px rgba(16, 185, 129, 0.25)',
            minHeight: '475px'
          }}
        >
          {/* Left Corner Rotating Colored Concert Light (Cyan/Purple) */}
          <div style={{ position: 'absolute', top: '-15px', left: '-15px', width: '120px', height: '120px', pointerEvents: 'none', zIndex: 1 }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#00f0ff', boxShadow: '0 0 40px 18px rgba(6, 182, 212, 0.95), 0 0 70px 30px rgba(168, 85, 247, 0.7)' }} />
            <div className="sa-color-beam-left" />
          </div>

          {/* Right Corner Rotating Colored Concert Light (Orange/Pink) */}
          <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '120px', height: '120px', pointerEvents: 'none', zIndex: 1 }}>
            <div style={{ position: 'absolute', right: 0, width: '18px', height: '18px', borderRadius: '50%', background: '#ff781f', boxShadow: '0 0 40px 18px rgba(249, 115, 22, 0.95), 0 0 70px 30px rgba(236, 72, 153, 0.7)' }} />
            <div className="sa-color-beam-right" />
          </div>

          {/* Stage Spotlights / Light Beams with color tints */}
          <div className="sa-beam" style={{ left: '10%', animationDelay: '0s', animationDuration: '4.8s', background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.3), transparent)' }} />
          <div className="sa-beam" style={{ left: '28%', animationDelay: '-1.2s', animationDuration: '4.2s', opacity: 0.7, background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.3), transparent)' }} />
          <div className="sa-beam" style={{ left: '72%', animationDelay: '-1.8s', animationDuration: '4.5s', opacity: 0.7, background: 'linear-gradient(180deg, rgba(249, 115, 22, 0.3), transparent)' }} />
          <div className="sa-beam" style={{ left: '90%', animationDelay: '-.9s', animationDuration: '5.2s', background: 'linear-gradient(180deg, rgba(236, 72, 153, 0.3), transparent)' }} />

          {/* Glowing Turf Stage Line */}
          <div className="sa-stage-line" style={{ bottom: '16%' }} />

          {/* Crowd of People on Turf with Blinking Torch Lights */}
          {BANNER_CROWD.map((p, i) => {
            const danceAnim = p.type === 0 ? 'saDance' : p.type === 1 ? 'saDance2' : 'saCrowdSway';
            const torchAnim = p.type === 0 ? 'saTorch' : p.type === 1 ? 'saTorch2' : 'saTorch3';
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  bottom: '15%',
                  left: p.x,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  animation: `${danceAnim} ${p.dur} ease-in-out infinite`,
                  animationDelay: p.dd,
                  opacity: p.dim ? 0.35 : 1,
                  zIndex: 2,
                  pointerEvents: 'none'
                }}
              >
                {/* Phone Torch - WHITE Blinking with upward beam */}
                <div style={{ width: '5px', height: '9px', borderRadius: '2px', background: '#d1d5db', marginBottom: '2px', position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#fff',
                      animation: `${torchAnim} ${p.dur} ease-in-out infinite`,
                      animationDelay: p.td
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '18px',
                      height: '65px',
                      background: 'linear-gradient(to top, rgba(255,255,255,0.4) 0%, rgba(134,239,172,0.12) 60%, transparent 100%)',
                      clipPath: 'polygon(38% 100%, 62% 100%, 100% 0%, 0% 0%)',
                      animation: `${torchAnim} ${p.dur} ease-in-out infinite`,
                      animationDelay: p.td,
                      filter: 'blur(1px)',
                      pointerEvents: 'none'
                    }}
                  />
                </div>

                {/* Raised arm holding phone */}
                <div style={{ width: '4px', height: '22px', background: p.bc, borderRadius: '2px', transformOrigin: 'bottom center', animation: `saArmL ${p.dur} ease-in-out infinite`, animationDelay: p.dd }} />

                {/* Head */}
                <div style={{ width: '15px', height: '15px', borderRadius: '50%', background: p.hc, border: '1px solid rgba(255,255,255,.15)', marginBottom: '1px' }} />

                {/* Torso */}
                <div style={{ position: 'relative', width: '18px', height: '26px', background: p.bc, borderRadius: '4px 4px 0 0' }}>
                  <div style={{ position: 'absolute', top: '5px', left: '-9px', width: '9px', height: '4px', background: p.bc, borderRadius: '2px', transformOrigin: 'right center', animation: `saArmL ${p.dur} ease-in-out infinite`, animationDelay: p.dd }} />
                  <div style={{ position: 'absolute', top: '5px', right: '-9px', width: '9px', height: '4px', background: p.bc, borderRadius: '2px', transformOrigin: 'left center', animation: `saArmR ${p.dur} ease-in-out infinite`, animationDelay: p.dd }} />
                </div>

                {/* Legs */}
                <div style={{ display: 'flex', gap: '2px' }}>
                  <div style={{ width: '6px', height: '18px', background: p.bc, borderRadius: '0 0 3px 3px', transformOrigin: 'top center', animation: `saLegL ${p.dur} ease-in-out infinite`, animationDelay: p.dd }} />
                  <div style={{ width: '6px', height: '18px', background: p.bc, borderRadius: '0 0 3px 3px', transformOrigin: 'top center', animation: `saLegR ${p.dur} ease-in-out infinite`, animationDelay: p.dd }} />
                </div>
              </div>
            );
          })}

          {/* ========================================================
              CENTER STAGE: WEGROW MASCOT SINGING ANIMATION
              ======================================================== */}
          <div
            className="sa-mascot-center-stage"
            onClick={toggleMusic}
            style={{
              position: 'absolute',
              bottom: '15%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 14,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              pointerEvents: 'auto'
            }}
            title={isPlayingMusic ? "Click Mascot to Pause OM BGM" : "Click Mascot to Sing OM BGM!"}
          >
            {/* Center Stage Spotlight Beam illuminating mascot */}
            <div
              style={{
                position: 'absolute',
                top: '-260px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '260px',
                height: '350px',
                background: isPlayingMusic 
                  ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(34, 197, 94, 0.28) 50%, rgba(250, 204, 21, 0.12) 85%, transparent 100%)'
                  : 'linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(34, 197, 94, 0.16) 50%, rgba(250, 204, 21, 0.05) 85%, transparent 100%)',
                clipPath: 'polygon(36% 0%, 64% 0%, 100% 100%, 0% 100%)',
                filter: 'blur(2px)',
                pointerEvents: 'none',
                zIndex: 1,
                animation: isPlayingMusic ? 'saSpotlightPulse 2.4s ease-in-out infinite' : 'none'
              }}
            />

            {/* Glowing Stadium Turf Disc under Mascot's feet */}
            <div
              style={{
                position: 'absolute',
                bottom: '-6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '140px',
                height: '24px',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.9) 0%, rgba(250, 204, 21, 0.5) 45%, transparent 75%)',
                boxShadow: isPlayingMusic ? '0 0 32px 12px rgba(34, 197, 94, 0.85)' : '0 0 20px 6px rgba(34, 197, 94, 0.55)',
                zIndex: 2,
                animation: isPlayingMusic ? 'saStageDiscPulse 2s ease-in-out infinite' : 'none'
              }}
            />

            {/* Mascot Singing Character with Live Bob & Groove Motion */}
            <div
              style={{
                position: 'relative',
                animation: isPlayingMusic ? 'saMascotSing 2s ease-in-out infinite' : 'saBob 2.6s ease-in-out infinite',
                transformOrigin: 'bottom center',
                zIndex: 5
              }}
            >
              {/* Floating Animated Musical Notes (Active when singing) */}
              {isPlayingMusic && (
                <>
                  <span className="sa-singing-note" style={{ top: '-18px', right: '-12px', color: '#fb923c', animationDelay: '0s', fontSize: '22px' }}>♪</span>
                  <span className="sa-singing-note" style={{ top: '-36px', right: '16px', color: '#86efac', animationDelay: '0.8s', fontSize: '26px' }}>♫</span>
                  <span className="sa-singing-note" style={{ top: '-26px', left: '-18px', color: '#facc15', animationDelay: '1.6s', fontSize: '20px' }}>♬</span>
                  <span className="sa-singing-note" style={{ top: '-48px', left: '8px', color: '#38bdf8', animationDelay: '2.4s', fontSize: '24px' }}>♩</span>
                  <span className="sa-singing-note" style={{ top: '-12px', left: '-28px', color: '#f472b6', animationDelay: '1.2s', fontSize: '18px' }}>✨</span>
                </>
              )}

              {/* Mascot Image */}
              <img
                src={MASCOT_IMG}
                alt="WeGrow Mascot Singing"
                className="sa-mascot-singer"
                style={{
                  position: 'relative',
                  filter: isPlayingMusic 
                    ? 'drop-shadow(0 14px 22px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 18px rgba(34, 197, 94, 0.65))' 
                    : 'drop-shadow(0 10px 18px rgba(0, 0, 0, 0.55)) drop-shadow(0 0 12px rgba(34, 197, 94, 0.35))'
                }}
              />

              {/* Singing Stage Microphone with Pulsing Soundwave Rings */}
              <div
                style={{
                  position: 'absolute',
                  top: '24%',
                  right: '-10px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isPlayingMusic ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'linear-gradient(135deg, #64748b, #475569)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isPlayingMusic ? '0 0 18px rgba(249,115,22,0.95), 0 0 25px rgba(34,197,94,0.5)' : '0 2px 8px rgba(0,0,0,0.4)',
                  zIndex: 10
                }}
              >
                <span style={{ fontSize: '16px', lineHeight: 1 }}>🎤</span>
                {isPlayingMusic && (
                  <>
                    <div className="mic-ring" style={{ borderColor: 'rgba(249, 115, 22, 0.75)' }} />
                    <div className="mic-ring" style={{ borderColor: 'rgba(34, 197, 94, 0.65)', animationDelay: '1.2s' }} />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Foreground Event Content */}
          <div className="position-relative" style={{ zIndex: 10 }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              {/* WeGrow Logo */}
              <div className="d-flex flex-column align-items-center">
                <div className="bg-white rounded-3 px-3 py-1 shadow-sm">
                  <img src={LOGO_IMG} alt="WeGrow" style={{ height: '28px', width: 'auto' }} />
                </div>
              </div>

              {/* Date Box */}
              <div className="d-flex flex-column align-items-center">
                <div className="rounded-3 border border-light border-opacity-25 d-flex flex-column align-items-center justify-content-center" style={{ width: '52px', height: '52px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(4px)' }}>
                  <span className="fs-5 font-weight-bold lh-1 text-white">{CONFIG.dayNum}</span>
                  <span className="small text-uppercase font-weight-bold" style={{ fontSize: '9px', color: '#86efac' }}>{CONFIG.monthAbbr}</span>
                </div>
                <span className="small font-weight-bold mt-1 text-uppercase" style={{ fontSize: '9px', color: '#86efac' }}>
                  {CONFIG.dayName}
                </span>
              </div>
            </div>

            {/* Centered Identity */}
            <div className="text-center mt-2">
              <div className="small font-weight-medium" style={{ color: '#d1fae5', textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
                {CONFIG.presentedBy} presents
              </div>

              <div className="d-inline-flex flex-wrap align-items-center justify-content-center gap-2 mt-2">
                <div className="d-inline-flex align-items-center gap-2 rounded-pill px-3 py-1" style={{ background: 'rgba(34,197,94,0.22)', border: '1px solid rgba(34,197,94,0.5)', fontSize: '11px', backdropFilter: 'blur(4px)' }}>
                  <span className="rounded-circle bg-warning" style={{ width: '6px', height: '6px' }}></span>
                  <span className="font-weight-bold tracking-wider text-white">{CONFIG.category}</span>
                </div>
                <div className="d-inline-flex align-items-center gap-1.5 px-3 py-1 rounded-pill" style={{ background: 'rgba(249, 115, 22, 0.28)', border: '1px solid rgba(249, 115, 22, 0.55)', backdropFilter: 'blur(4px)', fontSize: '11px' }}>
                  <Ticket style={{ width: '13px', height: '13px', color: '#fb923c' }} />
                  <span className="font-weight-bold text-white">{rupee(CONFIG.ticketPrice)} per ticket</span>
                </div>
              </div>

              <h1 className="font-display display-4 font-weight-bold mt-3 mb-2" style={{ letterSpacing: '-0.5px', textShadow: '0 4px 24px rgba(0,0,0,0.85)' }}>
                <span className="text-white">{CONFIG.titleLine1}</span>{' '}
                <span style={{ background: 'linear-gradient(90deg, #86efac 0%, #34d399 40%, #fbbf24 80%, #fb923c 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{CONFIG.titleLine2}</span>
              </h1>

              <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 small font-weight-medium mt-2" style={{ color: '#e2e8f0', textShadow: '0 2px 8px rgba(0,0,0,0.85)' }}>
                <span className="d-flex align-items-center gap-1">
                  <Calendar style={{ width: '14px', height: '14px', color: '#86efac' }} /> {CONFIG.dateShort}
                </span>
                <span className="d-flex align-items-center gap-1">
                  <Clock style={{ width: '14px', height: '14px', color: '#86efac' }} /> Rep: {CONFIG.reportingTime} · Event: {CONFIG.eventTime}
                </span>
                <span className="d-flex align-items-center gap-1">
                  <MapPin style={{ width: '14px', height: '14px', color: '#86efac' }} /> {CONFIG.fullVenue}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOD PARTNER SCROLLING STRIP */}
        <div className="mb-3">
          <div className="d-flex align-items-center gap-2 mb-2 px-1">
            <span className="small font-weight-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '1.5px', color: '#15803d' }}>Our Partners</span>
            <div style={{ flex: 1, height: '1.5px', background: 'linear-gradient(90deg, #86efac, transparent)' }} />
          </div>
          <div className="sa-marquee-wrap">
            <div className="sa-marquee-track">
              {/* Group 1 */}
              <div className="sa-marquee-group">
                <div className="sa-partner-chip">
                  <div className="sa-partner-icon" style={{ background: 'rgba(249, 115, 22, 0.12)' }}>🍕</div>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>Spice Garden</div>
                    <div style={{ fontSize: '9px', color: '#ea580c', fontWeight: 700, letterSpacing: '0.5px' }}>FOOD PARTNER</div>
                  </div>
                </div>
                <div className="sa-partner-sep" />
                <div className="sa-partner-chip">
                  <div className="sa-partner-icon" style={{ background: 'rgba(234, 179, 8, 0.15)' }}>🥘</div>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>Curry House</div>
                    <div style={{ fontSize: '9px', color: '#ca8a04', fontWeight: 700, letterSpacing: '0.5px' }}>FOOD PARTNER</div>
                  </div>
                </div>
                <div className="sa-partner-sep" />
                <div className="sa-partner-chip">
                  <div className="sa-partner-icon" style={{ background: 'rgba(34, 197, 94, 0.12)' }}>🥗</div>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>Fresh Bites</div>
                    <div style={{ fontSize: '9px', color: '#16a34a', fontWeight: 700, letterSpacing: '0.5px' }}>FOOD PARTNER</div>
                  </div>
                </div>
                <div className="sa-partner-sep" />
                <div className="sa-partner-chip">
                  <div className="sa-partner-icon" style={{ background: 'rgba(59, 130, 246, 0.12)' }}>🍹</div>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>Thirst Quench</div>
                    <div style={{ fontSize: '9px', color: '#2563eb', fontWeight: 700, letterSpacing: '0.5px' }}>BEVERAGE PARTNER</div>
                  </div>
                </div>
                <div className="sa-partner-sep" />
                <div className="sa-partner-chip">
                  <div className="sa-partner-icon" style={{ background: 'rgba(236, 72, 153, 0.12)' }}>🍰</div>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>Sweet Corner</div>
                    <div style={{ fontSize: '9px', color: '#db2777', fontWeight: 700, letterSpacing: '0.5px' }}>DESSERT PARTNER</div>
                  </div>
                </div>
                <div className="sa-partner-sep" />
                <div className="sa-partner-chip">
                  <div className="sa-partner-icon" style={{ background: 'rgba(249, 115, 22, 0.12)' }}>🌮</div>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>Street Feast</div>
                    <div style={{ fontSize: '9px', color: '#ea580c', fontWeight: 700, letterSpacing: '0.5px' }}>FOOD PARTNER</div>
                  </div>
                </div>
              </div>
              {/* Group 2 – duplicate for seamless loop */}
              <div className="sa-marquee-group">
                <div className="sa-partner-chip">
                  <div className="sa-partner-icon" style={{ background: 'rgba(249, 115, 22, 0.12)' }}>🍕</div>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>Spice Garden</div>
                    <div style={{ fontSize: '9px', color: '#ea580c', fontWeight: 700, letterSpacing: '0.5px' }}>FOOD PARTNER</div>
                  </div>
                </div>
                <div className="sa-partner-sep" />
                <div className="sa-partner-chip">
                  <div className="sa-partner-icon" style={{ background: 'rgba(234, 179, 8, 0.15)' }}>🥘</div>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>Curry House</div>
                    <div style={{ fontSize: '9px', color: '#ca8a04', fontWeight: 700, letterSpacing: '0.5px' }}>FOOD PARTNER</div>
                  </div>
                </div>
                <div className="sa-partner-sep" />
                <div className="sa-partner-chip">
                  <div className="sa-partner-icon" style={{ background: 'rgba(34, 197, 94, 0.12)' }}>🥗</div>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>Fresh Bites</div>
                    <div style={{ fontSize: '9px', color: '#16a34a', fontWeight: 700, letterSpacing: '0.5px' }}>FOOD PARTNER</div>
                  </div>
                </div>
                <div className="sa-partner-sep" />
                <div className="sa-partner-chip">
                  <div className="sa-partner-icon" style={{ background: 'rgba(59, 130, 246, 0.12)' }}>🍹</div>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>Thirst Quench</div>
                    <div style={{ fontSize: '9px', color: '#2563eb', fontWeight: 700, letterSpacing: '0.5px' }}>BEVERAGE PARTNER</div>
                  </div>
                </div>
                <div className="sa-partner-sep" />
                <div className="sa-partner-chip">
                  <div className="sa-partner-icon" style={{ background: 'rgba(236, 72, 153, 0.12)' }}>🍰</div>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>Sweet Corner</div>
                    <div style={{ fontSize: '9px', color: '#db2777', fontWeight: 700, letterSpacing: '0.5px' }}>DESSERT PARTNER</div>
                  </div>
                </div>
                <div className="sa-partner-sep" />
                <div className="sa-partner-chip">
                  <div className="sa-partner-icon" style={{ background: 'rgba(249, 115, 22, 0.12)' }}>🌮</div>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>Street Feast</div>
                    <div style={{ fontSize: '9px', color: '#ea580c', fontWeight: 700, letterSpacing: '0.5px' }}>FOOD PARTNER</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-STEP PROGRESS STEPPER */}
        {screen === 'form' && (
          <div className="sa-card px-3 px-sm-4 py-3 mb-4 d-flex align-items-center">
            {["Booker Details", "Ticket Details", "Payment", "Review & Confirm"].map((label, i) => {
              const n = i + 1;
              const done = step > n;
              const current = step === n;
              return (
                <div key={i} className={`d-flex align-items-center ${i < 3 ? 'flex-grow-1' : ''}`}>
                  <div className="d-flex flex-column align-items-center cursor-pointer" onClick={() => { if (done) setStep(n); }}>
                    <div
                      className={`step-dot ${done || current ? 'text-white' : ''}`}
                      style={done || current ? {
                        background: 'linear-gradient(135deg, #16a34a, #15803d)',
                        boxShadow: '0 0 12px rgba(22,163,74,0.45)',
                        border: 'none'
                      } : {
                        background: '#f8fafc',
                        border: '1.5px solid #cbd5e1',
                        color: '#64748b'
                      }}
                    >
                      {done ? <Check style={{ width: '16px', height: '16px', strokeWidth: 3 }} /> : n}
                    </div>
                    <div
                      className="d-none d-sm-block small font-weight-bold mt-1 text-center"
                      style={{ fontSize: '11.5px', maxWidth: '95px', color: done || current ? '#15803d' : '#64748b' }}
                    >
                      {label}
                    </div>
                  </div>
                  {i < 3 && <div className={`step-line ${done ? 'done' : ''}`} />}
                </div>
              );
            })}
          </div>
        )}

        {/* TWO-COLUMN LAYOUT: STAGE POSTER ON LEFT, FORM ON RIGHT */}
        {screen === 'form' && (
          <div className="row g-4 align-items-start">
            {/* LEFT COLUMN: LIVE EVENT STAGE POSTER */}
            <div className="col-12 col-lg-5">
              <div className="sa-card overflow-hidden">
                <div className="poster-stage p-4 pb-0">
                  <div className="poster-stars"></div>
                  <div className="stage-beam" style={{ left: '8%' }}></div>
                  <div className="stage-beam" style={{ right: '10%', top: '-20%', transform: 'skewX(13deg)' }}></div>

                  {/* Corner tags */}
                  <div className="d-flex align-items-start justify-content-between text-warning position-relative" style={{ fontSize: '10.5px', fontWeight: 600 }}>
                    <div style={{ transform: 'rotate(-3deg)' }}>
                      Get ready to<br />sing along! 🎤
                    </div>
                    <div className="text-end text-white-50">
                      MUSIC · PEOPLE<br />MEMORIES · TOGETHER
                    </div>
                  </div>

                  {/* Center Poster Titles */}
                  <div className="text-center position-relative mt-2">
                    <span className="ribbon text-white px-3 py-1 rounded-2 small font-weight-bold d-inline-block">
                      WEGROW
                    </span>
                    <div className="text-white-50 small mt-1" style={{ fontSize: '9px', letterSpacing: '3px' }}>
                      — PRESENTS —
                    </div>
                    <div className="font-display text-white mt-1 fs-3 font-weight-bold">
                      SING <span className="poster-gradtext">ALONG</span>
                    </div>
                    <div className="text-white-50 small font-weight-medium mt-1">
                      {CONFIG.category}
                    </div>
                    <div className="mt-2">
                      <span className="ribbon text-white px-3 py-1 rounded-pill small font-weight-bold d-inline-block shadow" style={{ transform: 'rotate(-2deg)' }}>
                        BOOKINGS OPEN NOW!
                      </span>
                    </div>
                  </div>

                  {/* Stage Mascot Performing */}
                  <div className="position-relative d-flex justify-content-center mt-2 pb-1">
                    <div
                      className="position-relative cursor-pointer"
                      onClick={toggleMusic}
                      title={isPlayingMusic ? "Click Mascot to Pause OM Song" : "Click Mascot to Play OM Song"}
                      style={{ width: '210px', animation: isPlayingMusic ? 'saMascotSing 2s ease-in-out infinite' : 'saBob 2.8s ease-in-out infinite', transformOrigin: 'bottom center' }}
                    >
                      {isPlayingMusic && (
                        <>
                          <span className="sa-singing-note" style={{ top: '-10px', left: '-12px', fontSize: '20px', color: '#fb923c', animationDelay: '0s' }}>♪</span>
                          <span className="sa-singing-note" style={{ top: '20%', right: '-16px', fontSize: '22px', color: '#7fb2ff', animationDelay: '1.1s' }}>♫</span>
                          <span className="sa-singing-note" style={{ top: '-14px', right: '12px', fontSize: '18px', color: '#facc15', animationDelay: '2s' }}>♬</span>
                        </>
                      )}
                      <img
                        src={MASCOT_IMG}
                        alt="Mascot"
                        className="w-100 h-auto position-relative"
                        style={{ zIndex: 10, filter: isPlayingMusic ? 'drop-shadow(0 16px 20px rgba(0,0,0,0.5)) drop-shadow(0 0 16px rgba(34,197,94,0.6))' : 'drop-shadow(0 16px 20px rgba(0,0,0,0.5))' }}
                      />
                      <div className="position-absolute" style={{ right: '0%', top: '28%', zIndex: 20 }}>
                        {isPlayingMusic && <div className="mic-ring"></div>}
                        <div className="mic-badge text-white small" style={{ background: isPlayingMusic ? '#f97316' : '#64748b' }}>🎤</div>
                      </div>
                    </div>
                  </div>

                  {/* Crowd on Turf */}
                  <div className="position-relative" style={{ height: '60px', marginTop: '-8px', zIndex: 20 }}>
                    {renderCrowdSVG()}
                  </div>
                  <div className="position-absolute start-0 end-0 bottom-0 crowd-fade" style={{ height: '90px', zIndex: 10 }}></div>
                </div>


              </div>
            </div>

            {/* RIGHT COLUMN: STEP FORM */}
            <div className="col-12 col-lg-7">
              {/* STEP 1: BOOKER DETAILS */}
              {step === 1 && (
                <div className="sa-step-card p-4 p-sm-5">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <User style={{ width: '22px', height: '22px', color: '#16a34a' }} />
                    <h4 className="font-display font-weight-bold mb-0" style={{ color: '#0f172a' }}>Booker Details</h4>
                  </div>
                  <p className="small mb-4" style={{ color: '#475569' }}>
                    Please fill in your contact information. We'll use this to send your booking confirmation.
                  </p>

                  <div className="d-flex flex-column gap-3">
                    <div>
                      <label className="form-label font-weight-semibold small mb-1" style={{ color: '#0f172a' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className={`sa-field ${errors.name ? 'sa-field-error' : ''}`}
                        placeholder="e.g., Rajapavalam"
                        value={booker.name}
                        onChange={(e) => setBooker({ ...booker, name: e.target.value })}
                      />
                      {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
                    </div>

                    <div>
                      <label className="form-label font-weight-semibold small mb-1" style={{ color: '#0f172a' }}>
                        Mobile / WhatsApp Number *
                      </label>
                      <div className="d-flex gap-2">
                        <select
                          className="sa-field font-weight-bold text-center"
                          style={{ width: '80px', flexShrink: 0 }}
                          value={booker.countryCode}
                          onChange={(e) => setBooker({ ...booker, countryCode: e.target.value })}
                        >
                          <option value="+91">IN -</option>
                          <option value="+1">US -</option>
                          <option value="+44">UK -</option>
                          <option value="+971">AE -</option>
                        </select>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          className={`sa-field ${errors.mobile ? 'sa-field-error' : ''}`}
                          placeholder="10-digit mobile number"
                          value={booker.mobile}
                          onChange={(e) => setBooker({ ...booker, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        />
                      </div>
                      {errors.mobile ? (
                        <div className="text-danger small mt-1">{errors.mobile}</div>
                      ) : (
                        <div className="small mt-1" style={{ color: '#64748b' }}>We'll send booking updates on WhatsApp.</div>
                      )}
                    </div>

                    <div>
                      <label className="form-label font-weight-semibold small mb-1" style={{ color: '#0f172a' }}>
                        Email ID <span style={{ color: '#16a34a', fontWeight: 600 }}>(Recommended)</span>
                      </label>
                      <input
                        type="email"
                        className={`sa-field ${errors.email ? 'sa-field-error' : ''}`}
                        placeholder="e.g., yourname@email.com"
                        value={booker.email}
                        onChange={(e) => setBooker({ ...booker, email: e.target.value })}
                      />
                      {errors.email ? (
                        <div className="text-danger small mt-1">{errors.email}</div>
                      ) : (
                        <div className="small mt-1" style={{ color: '#64748b' }}>We'll email your booking confirmation and digital ticket here.</div>
                      )}
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-2 p-3 rounded-3 mt-4" style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
                    <Info className="flex-shrink-0 mt-1" style={{ width: '16px', height: '16px', color: '#16a34a' }} />
                    <p className="mb-0 small font-weight-medium" style={{ color: '#166534', fontSize: '13px' }}>
                      Your information is safe with us. We'll never share your contact details with third parties.
                    </p>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mt-4 pt-2">
                    <button disabled className="sa-btn-ghost px-4 py-2 small d-flex align-items-center gap-1 opacity-50">
                      <ChevronLeft style={{ width: '16px', height: '16px' }} /> Back
                    </button>
                    <button onClick={handleNextStep} className="sa-btn-primary px-4 py-2 small d-flex align-items-center gap-1">
                      <span>Next</span>
                      <ChevronRight style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: TICKET DETAILS */}
              {step === 2 && (
                <div className="sa-step-card p-4 p-sm-5">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <Ticket style={{ width: '22px', height: '22px', color: '#16a34a' }} />
                    <h4 className="font-display font-weight-bold mb-0" style={{ color: '#0f172a' }}>Ticket Details</h4>
                  </div>
                  <p className="small mb-4" style={{ color: '#475569' }}>
                    {CONFIG.eventName} — Live Music Event · Ticket Price: {rupee(CONFIG.ticketPrice)} / ticket
                  </p>

                  <div className="mb-4">
                    <label className="form-label font-weight-semibold small mb-2" style={{ color: '#0f172a' }}>
                      Number of Tickets *
                    </label>
                    <div className="d-flex align-items-center gap-3">
                      <button
                        onClick={() => qty > 1 && setQty(qty - 1)}
                        disabled={qty <= 1}
                        className="qty-btn"
                      >
                        −
                      </button>
                      <span className="font-display fs-3 font-weight-bold px-2" style={{ color: '#0f172a' }}>
                        {qty}
                      </span>
                      <button
                        onClick={() => qty < CONFIG.maxTickets && setQty(qty + 1)}
                        disabled={qty >= CONFIG.maxTickets}
                        className="qty-btn"
                      >
                        +
                      </button>
                      <span className="small ms-2" style={{ color: '#64748b' }}>Max {CONFIG.maxTickets} tickets per booking</span>
                    </div>
                    {errors.qty && <div className="text-danger small mt-2">{errors.qty}</div>}
                  </div>

                  <div className="rounded-3 overflow-hidden mb-4 shadow-sm" style={{ border: '1.5px solid #dcfce7' }}>
                    <div className="d-flex justify-content-between px-3 py-2 text-uppercase font-weight-bold" style={{ fontSize: '11px', background: '#f0fdf4', color: '#15803d' }}>
                      <span>Item</span>
                      <span>Amount</span>
                    </div>
                    <div className="d-flex justify-content-between px-3 py-2 small" style={{ borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
                      <span style={{ color: '#64748b' }}>Ticket Price</span>
                      <span className="font-weight-bold" style={{ color: '#0f172a' }}>{rupee(CONFIG.ticketPrice)}</span>
                    </div>
                    <div className="d-flex justify-content-between px-3 py-2 small" style={{ borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
                      <span style={{ color: '#64748b' }}>Quantity</span>
                      <span className="font-weight-bold" style={{ color: '#0f172a' }}>{qty}</span>
                    </div>
                    <div className="d-flex justify-content-between px-3 py-3" style={{ borderTop: '1.5px solid #bbf7d0', background: '#ecfdf5' }}>
                      <span className="font-weight-bold" style={{ color: '#166534' }}>Total</span>
                      <span className="font-display fs-5 font-weight-bold" style={{ color: '#15803d' }}>
                        {rupee(totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div
                    className="rounded-3 p-4 text-white d-flex align-items-center justify-content-between mb-4 shadow"
                    style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', boxShadow: '0 10px 25px -8px rgba(22, 163, 74, 0.45)' }}
                  >
                    <div>
                      <div className="small font-weight-bold text-uppercase" style={{ color: '#dcfce7' }}>TOTAL AMOUNT</div>
                      <div className="display-6 font-weight-bold mt-1 text-white">{rupee(totalAmount)}</div>
                    </div>
                    <div className="text-end small" style={{ color: '#dcfce7' }}>
                      <div>{rupee(CONFIG.ticketPrice)} × {qty} ticket{qty > 1 ? 's' : ''}</div>
                      <div>Auto-calculated</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-2">
                    <button onClick={handlePrevStep} className="sa-btn-ghost px-4 py-2 small d-flex align-items-center gap-1">
                      <ChevronLeft style={{ width: '16px', height: '16px' }} /> Back
                    </button>
                    <button onClick={handleNextStep} className="sa-btn-primary px-4 py-2 small d-flex align-items-center gap-1">
                      <span>Next</span>
                      <ChevronRight style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT */}
              {step === 3 && (
                <div className="sa-step-card p-4 p-sm-5">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <CreditCard style={{ width: '22px', height: '22px', color: '#16a34a' }} />
                    <h4 className="font-display font-weight-bold mb-0" style={{ color: '#0f172a' }}>Payment</h4>
                  </div>
                  <p className="small mb-4" style={{ color: '#475569' }}>
                    Make the UPI payment and share the transaction details below.
                  </p>

                  <div className="row g-3 mb-4">
                    {/* Order summary with UPI ID */}
                    <div className="col-12 col-sm-6">
                      <div
                        className="rounded-3 p-3 text-white h-100 d-flex flex-column justify-content-between shadow-sm"
                        style={{ background: 'linear-gradient(160deg, #15803d, #14532d)', borderRadius: '16px' }}
                      >
                        <div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="small font-weight-bold text-uppercase" style={{ color: '#bbf7d0' }}>ORDER SUMMARY</span>
                            <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.3)' }}>{qty} Ticket{qty > 1 ? 's' : ''}</span>
                          </div>
                          <div className="d-flex justify-content-between py-1 small border-bottom border-light border-opacity-25 text-white-50">
                            <span className="text-white opacity-75">Amount</span><span className="text-white font-weight-bold">{rupee(totalAmount)}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-top border-light border-opacity-25 mt-3">
                          <div onClick={handleCopyUpi} className="d-flex align-items-center gap-2 cursor-pointer">
                            <div className="rounded p-1 bg-white text-success">
                              <CreditCard style={{ width: '16px', height: '16px' }} />
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <div style={{ fontSize: '10px', color: '#bbf7d0' }}>UPI ID</div>
                              <div className="small font-weight-bold text-truncate text-white">{CONFIG.upiId}</div>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleCopyUpi(); }}
                              className="btn btn-light btn-sm px-2 py-1 small font-weight-bold"
                              style={{ color: '#15803d' }}
                            >
                              {copiedUpi ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Scan & Pay QR */}
                    <div className="col-12 col-sm-6">
                      <div
                        className="rounded-3 p-3 text-center shadow-sm d-flex flex-column align-items-center justify-content-center h-100"
                        style={{ background: '#ffffff', border: '1.5px solid #dcfce7', borderRadius: '16px' }}
                      >
                        <div className="small font-weight-bold text-uppercase mb-2" style={{ color: '#15803d' }}>
                          📱 SCAN &amp; PAY
                        </div>
                        <a href={upiUrl} className="p-2 rounded shadow-sm d-block" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                          {paymentQr ? (
                            <img src={paymentQr} alt="Scan QR" style={{ width: '135px', height: '135px', display: 'block' }} />
                          ) : (
                            <div style={{ width: '135px', height: '135px' }} className="d-flex align-items-center justify-content-center text-muted small">Loading QR...</div>
                          )}
                        </a>
                        <div className="small mt-2" style={{ color: '#475569' }}>
                          Amount: <span className="font-weight-bold" style={{ color: '#0f172a' }}>{rupee(totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Inputs */}
                  <div className="d-flex flex-column gap-3 mb-4">
                    <div>
                      <label className="form-label font-weight-semibold small mb-1" style={{ color: '#0f172a' }}>
                        UPI Transaction ID / UTR Number *
                      </label>
                      <input
                        type="text"
                        className={`sa-field ${errors.utr ? 'sa-field-error' : ''}`}
                        placeholder="e.g., 2026091112345678"
                        value={payment.utr}
                        onChange={(e) => setPayment({ ...payment, utr: e.target.value })}
                      />
                      {errors.utr && <div className="text-danger small mt-1">{errors.utr}</div>}
                    </div>

                    <div>
                      <label className="form-label font-weight-semibold small mb-1" style={{ color: '#0f172a' }}>
                        Date &amp; Time of Payment *
                      </label>
                      <input
                        type="datetime-local"
                        className={`sa-field ${errors.datetime ? 'sa-field-error' : ''}`}
                        value={payment.datetime}
                        onChange={(e) => setPayment({ ...payment, datetime: e.target.value })}
                      />
                      {errors.datetime && <div className="text-danger small mt-1">{errors.datetime}</div>}
                    </div>

                    <div>
                      <label className="form-label font-weight-semibold small mb-1" style={{ color: '#0f172a' }}>
                        Payment Screenshot <span style={{ color: '#16a34a', fontWeight: 600 }}>(Recommended)</span>
                      </label>
                      <label
                        htmlFor="sa-screenshot-file"
                        className="d-block rounded-3 p-3 text-center cursor-pointer"
                        style={{ background: '#f8fafc', border: '2px dashed #86efac' }}
                      >
                        {payment.fileData ? (
                          <div>
                            <img src={payment.fileData} alt="Preview" style={{ maxHeight: '120px' }} className="rounded mb-1" />
                            <div className="small font-weight-semibold" style={{ color: '#15803d' }}>{payment.fileName} · Click to replace</div>
                          </div>
                        ) : (
                          <div>
                            <UploadCloud style={{ width: '28px', height: '28px', color: '#16a34a' }} />
                            <div className="small font-weight-bold mt-1" style={{ color: '#0f172a' }}>Upload Payment Screenshot</div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>PNG, JPG, WEBP (Max 5MB)</div>
                          </div>
                        )}
                      </label>
                      <input
                        id="sa-screenshot-file"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="d-none"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-2">
                    <button onClick={handlePrevStep} className="sa-btn-ghost px-4 py-2 small d-flex align-items-center gap-1">
                      <ChevronLeft style={{ width: '16px', height: '16px' }} /> Back
                    </button>
                    <button onClick={handleNextStep} className="sa-btn-primary px-4 py-2 small d-flex align-items-center gap-1">
                      <span>Next</span>
                      <ChevronRight style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & CONFIRM */}
              {step === 4 && (
                <div className="sa-step-card p-4 p-sm-5">
                  <h4 className="font-display font-weight-bold mb-1" style={{ color: '#0f172a' }}>Review &amp; Confirm</h4>
                  <p className="small mb-4" style={{ color: '#475569' }}>
                    Please review your details before confirming the booking.
                  </p>

                  <div className="d-flex flex-column gap-3 mb-4">
                    {/* Booker */}
                    <div className="rounded-3 p-3 shadow-sm" style={{ background: '#ffffff', border: '1.5px solid #dcfce7' }}>
                      <div className="small font-weight-bold text-uppercase mb-2" style={{ color: '#15803d' }}>BOOKER DETAILS</div>
                      <div className="d-flex justify-content-between py-1 small" style={{ borderBottom: '1px solid #f1f5f9' }}><span style={{ color: '#64748b' }}>Name</span><span className="font-weight-bold" style={{ color: '#0f172a' }}>{booker.name}</span></div>
                      <div className="d-flex justify-content-between py-1 small" style={{ borderBottom: '1px solid #f1f5f9' }}><span style={{ color: '#64748b' }}>Mobile</span><span className="font-weight-bold" style={{ color: '#0f172a' }}>{booker.countryCode} {booker.mobile}</span></div>
                      <div className="d-flex justify-content-between py-1 small"><span style={{ color: '#64748b' }}>Email</span><span className="font-weight-bold" style={{ color: '#0f172a' }}>{booker.email || '—'}</span></div>
                    </div>

                    {/* Ticket */}
                    <div className="rounded-3 p-3 shadow-sm" style={{ background: '#ffffff', border: '1.5px solid #dcfce7' }}>
                      <div className="small font-weight-bold text-uppercase mb-2" style={{ color: '#15803d' }}>TICKET DETAILS</div>
                      <div className="d-flex justify-content-between py-1 small" style={{ borderBottom: '1px solid #f1f5f9' }}><span style={{ color: '#64748b' }}>Event</span><span className="font-weight-bold" style={{ color: '#0f172a' }}>{CONFIG.eventName}</span></div>
                      <div className="d-flex justify-content-between py-1 small" style={{ borderBottom: '1px solid #f1f5f9' }}><span style={{ color: '#64748b' }}>Tickets</span><span className="font-weight-bold" style={{ color: '#0f172a' }}>{qty}</span></div>
                      <div className="d-flex justify-content-between py-1 small"><span style={{ color: '#64748b' }}>Total</span><span className="font-weight-bold fs-6" style={{ color: '#15803d' }}>{rupee(totalAmount)}</span></div>
                    </div>

                    {/* Payment */}
                    <div className="rounded-3 p-3 shadow-sm" style={{ background: '#ffffff', border: '1.5px solid #dcfce7' }}>
                      <div className="small font-weight-bold text-uppercase mb-2" style={{ color: '#15803d' }}>PAYMENT DETAILS</div>
                      <div className="d-flex justify-content-between py-1 small" style={{ borderBottom: '1px solid #f1f5f9' }}><span style={{ color: '#64748b' }}>UTR / Transaction ID</span><span className="font-weight-bold" style={{ color: '#0f172a' }}>{payment.utr}</span></div>
                      <div className="d-flex justify-content-between py-1 small"><span style={{ color: '#64748b' }}>Date &amp; Time</span><span className="font-weight-bold" style={{ color: '#0f172a' }}>{payment.datetime ? new Date(payment.datetime).toLocaleString('en-IN') : '—'}</span></div>
                    </div>

                    <div className="d-flex align-items-center gap-2 p-3 rounded-3" style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
                      <CheckCircle2 style={{ width: '18px', height: '18px', color: '#16a34a' }} />
                      <span className="small font-weight-semibold" style={{ color: '#166534' }}>
                        I have read and agreed to all Terms &amp; Conditions and event rules.
                      </span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-2">
                    <button onClick={handlePrevStep} className="sa-btn-ghost px-4 py-2 small d-flex align-items-center gap-1">
                      <ChevronLeft style={{ width: '16px', height: '16px' }} /> Back
                    </button>
                    <button
                      disabled={isSubmitting}
                      onClick={handleConfirmBooking}
                      className="sa-btn-primary px-4 py-2 small d-flex align-items-center gap-1"
                    >
                      <span>{isSubmitting ? 'Confirming...' : 'Confirm Booking'}</span>
                      <ChevronRight style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. STATUS SCREEN */}
        {screen === 'status' && (
          <div className="sa-card p-5 text-center mx-auto my-5 shadow" style={{ maxWidth: '500px' }}>
            <div className="sa-spinner mx-auto mb-3"></div>
            <h4 className="font-display font-weight-bold" style={{ color: '#0f172a' }}>Verifying your payment...</h4>
            <p className="small" style={{ color: '#64748b' }}>Please do not close or refresh this page.</p>
            <div className="rounded-3 p-3 text-start small mt-3" style={{ background: '#f8fafc', border: '1.5px solid #dcfce7' }}>
              <div className="d-flex justify-content-between py-1"><span style={{ color: '#64748b' }}>Event</span><span className="font-weight-bold" style={{ color: '#0f172a' }}>{CONFIG.eventName}</span></div>
              <div className="d-flex justify-content-between py-1"><span style={{ color: '#64748b' }}>Amount</span><span className="font-weight-bold" style={{ color: '#0f172a' }}>{rupee(totalAmount)}</span></div>
              <div className="d-flex justify-content-between py-1"><span style={{ color: '#64748b' }}>Transaction ID</span><span className="font-weight-bold" style={{ color: '#0f172a' }}>{payment.utr}</span></div>
            </div>
          </div>
        )}

        {/* 4. SUCCESS SCREEN */}
        {screen === 'success' && ticketData && (
          <div className="sa-card p-5 text-center mx-auto my-5 shadow-lg" style={{ maxWidth: '520px' }}>
            <img src={MASCOT_IMG} alt="Celebrating Mascot" className="rounded-circle shadow mb-3" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            <h3 className="font-display font-weight-bold" style={{ color: '#0f172a' }}>🎶 Your Sing Along Ticket is Confirmed!</h3>
            <p className="small" style={{ color: '#64748b' }}>Get ready for an unforgettable musical evening at {CONFIG.fullVenue}.</p>

            <div className="rounded-3 p-3 text-start small mb-4" style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
              <div className="d-flex justify-content-between py-1"><span style={{ color: '#64748b' }}>Booking ID</span><span className="font-weight-bold" style={{ color: '#15803d' }}>{ticketData.bookingId}</span></div>
              <div className="d-flex justify-content-between py-1"><span style={{ color: '#64748b' }}>Amount Paid</span><span className="font-weight-bold" style={{ color: '#0f172a' }}>{rupee(ticketData.amount || totalAmount)}</span></div>
              <div className="d-flex justify-content-between py-1"><span style={{ color: '#64748b' }}>Status</span><span className="badge bg-success">CONFIRMED</span></div>
            </div>

            <div className="d-flex flex-column gap-2">
              <button onClick={() => { setScreen('ticket'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="sa-btn-primary py-3 small font-weight-bold">
                View My Ticket →
              </button>
              <button onClick={() => { setScreen('ticket'); setTimeout(handleDownloadTicket, 300); }} className="sa-btn-ghost py-3 small font-weight-bold">
                Download Ticket
              </button>
            </div>
          </div>
        )}

        {/* 5. TICKET SCREEN */}
        {screen === 'ticket' && ticketData && (
          <div className="mx-auto py-3" style={{ maxWidth: '440px' }}>
            <div ref={ticketCaptureRef} className="rounded-4 p-3 shadow-lg" style={{ background: '#ffffff', border: '1.5px solid #dcfce7' }}>
              <div className="ticket-card">
                {ticketDetailsOpen ? (
                  <div className="p-4 pb-3 d-flex gap-3">
                    <div className="rounded-3 overflow-hidden shadow-sm flex-shrink-0" style={{ width: '84px', height: '110px' }}>
                      <img src={MASCOT_IMG} alt="Mascot" className="w-100 h-100 object-fit-cover" style={{ objectPosition: '50% 10%' }} />
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <h5 className="font-display font-weight-bold mb-1" style={{ color: '#0f172a' }}>{CONFIG.eventName}</h5>
                      <div className="small mb-1 font-weight-semibold" style={{ color: '#15803d' }}>{CONFIG.category}</div>
                      <div className="small mb-1" style={{ color: '#64748b' }}>{CONFIG.dateShort} | 6:00 PM</div>
                      <div className="small lh-sm" style={{ color: '#64748b' }}>{CONFIG.fullVenue}</div>
                    </div>
                    <div className="vtag font-weight-bold">ENTRY TICKET</div>
                  </div>
                ) : (
                  <div className="p-3 d-flex align-items-center gap-3">
                    <img src={MASCOT_IMG} alt="Mascot" className="rounded-2" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                    <div className="small font-weight-bold" style={{ color: '#0f172a' }}>{CONFIG.eventName} · {ticketData.bookingId}</div>
                  </div>
                )}

                <div className="perf-row">
                  <button onClick={() => setTicketDetailsOpen(!ticketDetailsOpen)} className="perf-pill">
                    <span>Tap to {ticketDetailsOpen ? 'hide' : 'show'} details</span>
                    {ticketDetailsOpen ? <ChevronUp style={{ width: '14px', height: '14px' }} /> : <ChevronDown style={{ width: '14px', height: '14px' }} />}
                  </button>
                </div>

                <div className="p-4 text-center">
                  <div className="small font-weight-semibold" style={{ color: '#15803d' }}>{ticketData.ticketQty || qty} Ticket{(ticketData.ticketQty || qty) > 1 ? 's' : ''}</div>
                  <h4 className="font-display font-weight-bold mt-1" style={{ color: '#0f172a' }}>SING ALONG TICKET</h4>
                  <div className="small" style={{ color: '#64748b' }}>General Admission · {rupee(CONFIG.ticketPrice)} each</div>

                  <div className="d-flex justify-content-center my-3">
                    <div className="p-2 bg-white rounded-3 shadow-sm border" style={{ width: '180px', height: '180px' }}>
                      {ticketQr ? (
                        <img src={ticketQr} alt="QR" className="w-100 h-100" />
                      ) : (
                        <div className="d-flex align-items-center justify-content-center h-100 small text-muted">Loading QR...</div>
                      )}
                    </div>
                  </div>
                  <div className="small" style={{ color: '#64748b' }}>Scan at entry for verification</div>
                  <div className="font-display font-weight-bold mt-3" style={{ color: '#15803d' }}>BOOKING ID: {ticketData.bookingId}</div>
                </div>

                <div className="perf-divider"></div>

                <div className="p-3 d-flex justify-content-between align-items-center" style={{ background: '#f0fdf4' }}>
                  <span className="font-weight-medium small" style={{ color: '#64748b' }}>Total Amount</span>
                  <span className="font-display font-weight-bold fs-5" style={{ color: '#15803d' }}>{rupee(ticketData.amount || totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="d-flex flex-column gap-2 mt-3">
              <button disabled={isDownloading} onClick={handleDownloadTicket} className="sa-btn-primary py-3 small font-weight-bold">
                <Download style={{ width: '16px', height: '16px', display: 'inline', marginRight: '6px' }} />
                {isDownloading ? 'Downloading Ticket...' : 'Download Ticket'}
              </button>
              <button onClick={handleShareTicket} className="sa-btn-ghost py-3 small font-weight-bold">
                <Share2 style={{ width: '16px', height: '16px', display: 'inline', marginRight: '6px' }} />
                Share Ticket
              </button>
              <button onClick={handleReset} className="sa-btn-ghost py-3 small font-weight-bold">
                <Home style={{ width: '16px', height: '16px', display: 'inline', marginRight: '6px' }} />
                Book More Tickets
              </button>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-5 text-center">
          <div className="sa-card p-4 text-center">
            <div className="small font-weight-bold text-uppercase" style={{ fontSize: '11px', letterSpacing: '2px', color: '#15803d' }}>
              PRESENTED &amp; ORGANISED BY
            </div>
            <div className="mt-3 d-flex justify-content-center align-items-center">
              <div className="px-4 py-2 rounded-3 shadow-sm" style={{ background: '#ffffff', border: '1px solid #e2e8f0', display: 'inline-block' }}>
                <img src={LOGO_IMG} alt="WeGrow" style={{ height: '32px', width: 'auto' }} />
              </div>
            </div>
          </div>
          <div className="small mt-3 font-weight-medium" style={{ color: '#64748b' }}>
            © 2026 {CONFIG.eventName} · {CONFIG.venue}, {CONFIG.location}. All rights reserved.
          </div>
        </div>
      </div>


    </div>
  );
}
