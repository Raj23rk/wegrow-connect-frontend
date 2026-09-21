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
  CheckCircle2,
  Download,
  Share2,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Info,
  Phone,
  Mail,
  Home,
  Volume2,
  VolumeX,
  Music,
  ShieldCheck,
  Sparkles,
  Printer,
  Building,
  Award,
  Star
} from 'lucide-react';
import { bookSingAlongTicket } from '../services/singAlongApi';

// Brand & Event Assets
const VIDEO_BANNER_SRC = "/Animate_concert_banner_mascot_1080p_20260912195333.mp4";
const POSTER_STAGE_BG = "/ChatGPT Image Sep 12, 2026, 07_35_53 PM.webp";
const MASCOT_PROMO_IMG = "/ChatGPT Image Sep 12, 2026, 07_20_20 PM.webp";
const TITLE_ARTWORK_IMG = "/ChatGPT Image Sep 12, 2026, 10_34_58 PM.webp";
const POSTER_CARD_IMG = "/sing_along_official_poster.jpg";
const WEGROW_LOGO_IMG = "/Screenshot 2026-09-09 134254.webp";
const MASCOT_SONG_AUDIO = "/OM First Strike - Bgm _ Instrumental.mp3";

// Sponsor Data for Scrolling Marquee
const SPONSORS = [
  {
    id: 'fashion-woorld',
    name: 'Fashion Woorld',
    subtitle: 'The Readymade Showroom',
    logo: '/sponsors/fashion_world.png',
    badge: 'Title Sponsor'
  },
  {
    id: 'mahaan-ventures',
    name: 'Mahaan Ventures',
    subtitle: 'Strategic Investments',
    logo: '/sponsors/mahaan_ventures.jpg',
    badge: 'Associate Sponsor'
  },
  {
    id: 'mayann-architectx',
    name: 'Mayann Architectx',
    subtitle: 'Thoughtful Homes. Timeless Design',
    logo: '/sponsors/mayann_architectx.png',
    badge: 'Design Partner'
  },
  {
    id: 'sense-connect',
    name: 'Sense Connect',
    subtitle: 'Technology & Networking Partner',
    logo: '/sponsors/sense_connect.jpg',
    badge: 'Tech Partner'
  },
  {
    id: 'kerala-wood-furniture',
    name: 'Kerala Wood Furniture',
    subtitle: 'The Quality You Can Trust',
    logo: '/sponsors/kerala_wood_furniture.jpg',
    badge: 'Official Sponsor'
  }
];

const CONFIG = {
  eventName: "SING ALONG",
  category: "LIVE MUSIC EVENT • SPONSORS & VIP ACCESS",
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
  fullVenue: "Arasan Turf, Sivakasi, Tamil Nadu",
  presentedBy: "WeGrow Skill Campus & B-School",
  bookingPrefix: "SA26",
  supportPhone: "+91 9363337331",
  supportEmail: "wegrowskillcampus@gmail.com",
};

const PASS_OPTIONS = [
  {
    id: 'SA26_PO01',
    code: 'SA26_PO01',
    type: 'PROMO CODE',
    title: 'Promo Access Pass',
    badge: 'Special Invitee',
    badgeColor: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
    description: 'Complimentary promotional entry pass for registered partners, campus ambassadors & special invitees.',
    benefits: ['Full Live Concert Access', 'General Seating & Lawn Zone', 'Free Entry with Verified Code', 'Instant Digital E-Ticket']
  },
  {
    id: 'SA26_SP01',
    code: 'SA26_SP01',
    type: 'SPONSOR CODE',
    title: 'VIP Sponsor Pass',
    badge: 'VIP Sponsor Guest',
    badgeColor: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-slate-950 font-black',
    description: 'Exclusive VIP Sponsor pass for honored event sponsors, corporate partners & executive delegates.',
    benefits: ['Reserved VIP Lounge Seating', 'Priority Fast-Track Entry Gate', 'Complimentary Refreshments', 'VIP Networking Access']
  }
];

const genBookingId = (code) => {
  const prefix = code.includes('SP') ? 'SA26-SP' : 'SA26-PO';
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomStr = "";
  for (let i = 0; i < 6; i++) randomStr += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${randomStr}`;
};

export default function SingAlongSponsorBooking() {
  // Screen views: 'intro' | 'booking'
  const [pageView, setPageView] = useState('intro');

  // Booking Flow Steps: 1 (User Details) -> 2 (Select Code) -> 3 (Confirmation & Pass)
  const [step, setStep] = useState(1);

  // Form Fields
  const [booker, setBooker] = useState({
    name: '',
    mobile: '',
    email: '',
    company: '',
    city: 'Sivakasi'
  });
  const [errors, setErrors] = useState({});

  // Step 2: Selected Code Option (Radio)
  const [selectedCode, setSelectedCode] = useState('SA26_SP01'); // default to Sponsor VIP
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 3: Generated Ticket Data
  const [ticketData, setTicketData] = useState(null);
  const [ticketQr, setTicketQr] = useState('');
  const [isCopiedBookingId, setIsCopiedBookingId] = useState(false);
  const [emailSentNotice, setEmailSentNotice] = useState(false);

  // Audio / Video refs
  const audioRef = useRef(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const ticketRef = useRef(null);

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

  // Generate QR Code on confirmation
  useEffect(() => {
    if (ticketData?.bookingId) {
      const qrPayload = JSON.stringify({
        bookingId: ticketData.bookingId,
        name: ticketData.fullName,
        code: ticketData.code,
        type: ticketData.passType,
        event: "SING ALONG 2026",
        venue: CONFIG.venue
      });
      QRCode.toDataURL(qrPayload, {
        width: 300,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }).then(url => setTicketQr(url)).catch(console.error);
    }
  }, [ticketData]);

  // Validation for Step 1
  const validateStep1 = () => {
    const err = {};
    if (!booker.name.trim()) err.name = "Full name is required.";
    if (!booker.mobile.trim()) {
      err.mobile = "Mobile / WhatsApp number is required.";
    } else if (booker.mobile.replace(/\D/g, '').length < 10) {
      err.mobile = "Please enter a valid 10-digit mobile number.";
    }
    if (!booker.email.trim()) {
      err.email = "Email address is required for ticket delivery.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booker.email.trim())) {
      err.email = "Please enter a valid email address.";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNextToStep2 = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error("Please fill in all required fields accurately.");
    }
  };

  // Generate Ticket Directly on Step 2 (No Payment Gateway!)
  const handleGenerateTicket = async () => {
    setIsSubmitting(true);

    const activeOption = PASS_OPTIONS.find(p => p.code === selectedCode) || PASS_OPTIONS[0];
    const generatedBookingId = genBookingId(activeOption.code);

    const newTicket = {
      bookingId: generatedBookingId,
      ticketId: `TKT-${generatedBookingId}`,
      fullName: booker.name.trim(),
      phone: `+91 ${booker.mobile.trim()}`,
      email: booker.email.trim(),
      company: booker.company.trim() || (activeOption.code.includes('SP') ? 'VIP Sponsor Partner' : 'Special Guest'),
      city: booker.city.trim() || 'Sivakasi',
      code: activeOption.code,
      sponsorCode: activeOption.code,
      passType: activeOption.type,
      passTitle: activeOption.title,
      ticketQty: 1,
      amount: 0,
      totalAmount: 0,
      status: 'CONFIRMED',
      paymentMethod: activeOption.code === 'SA26_SP01' ? 'VIP SPONSOR PASS (FREE)' : 'PROMO PASS (FREE)',
      notes: `SPONSOR/PROMO: ${activeOption.title} (${activeOption.code}) - ${booker.company.trim() || 'VIP Sponsor Partner'}`,
      isFree: true,
      issuedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Save to local cache so Sing Along Admin immediately reflects it
    try {
      const existing = JSON.parse(localStorage.getItem('wegrow_sponsor_bookings') || '[]');
      const updated = [newTicket, ...existing.filter(b => b.bookingId !== generatedBookingId)];
      localStorage.setItem('wegrow_sponsor_bookings', JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save to localStorage cache:", e);
    }

    // Also dispatch to backend API
    try {
      await bookSingAlongTicket({
        bookingId: newTicket.bookingId,
        ticketId: newTicket.ticketId,
        fullName: newTicket.fullName,
        phone: newTicket.phone,
        email: newTicket.email,
        ticketQty: 1,
        totalAmount: 0,
        amount: 0,
        status: 'CONFIRMED',
        eventId: 'SINGALONG-SEP-27-2026',
        notes: newTicket.notes,
        passType: newTicket.passType,
        code: newTicket.code,
        sponsorCode: newTicket.code,
        company: newTicket.company,
        city: newTicket.city,
        paymentMethod: newTicket.paymentMethod,
        isFree: true
      });
    } catch (apiErr) {
      console.warn("Backend API note (ticket preserved in local cache):", apiErr);
    }

    setTimeout(() => {
      setTicketData(newTicket);
      setStep(3);
      setIsSubmitting(false);
      setEmailSentNotice(true);
      toast.success("🎉 Pass generated & confirmation email dispatched!");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const handleCopyBookingId = () => {
    if (!ticketData?.bookingId) return;
    navigator.clipboard.writeText(ticketData.bookingId)
      .then(() => {
        setIsCopiedBookingId(true);
        toast.success(`Copied Pass ID: ${ticketData.bookingId}`);
        setTimeout(() => setIsCopiedBookingId(false), 2500);
      })
      .catch(() => toast.error("Could not copy Pass ID."));
  };

  const handleShareWhatsApp = () => {
    if (!ticketData) return;
    const msg = encodeURIComponent(
      `🎵 I got my Official VIP Sponsor Pass for WeGrow SING ALONG 2026!\n\n🎟️ Pass ID: ${ticketData.bookingId}\n👤 Name: ${ticketData.fullName}\n🌟 Pass: ${ticketData.passTitle} (${ticketData.code})\n📅 Date: Sun, Sep 27, 2026 (6 PM)\n📍 Venue: Arasan Turf, Sivakasi`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-white selection:bg-[#F0791E] selection:text-white font-['Plus_Jakarta_Sans',sans-serif] relative overflow-x-hidden">
      {/* Background Audio */}
      <audio ref={audioRef} src={MASCOT_SONG_AUDIO} loop preload="none" />

      {/* Floating Audio Toggle */}
      <button
        onClick={toggleAudioSound}
        className="fixed bottom-6 right-24 z-40 p-3 rounded-full bg-black/60 hover:bg-[#F0791E] border border-white/20 text-white backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer"
        title={isAudioMuted ? "Play concert music" : "Mute music"}
      >
        {isAudioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-amber-400 animate-pulse" />}
      </button>

      {/* =========================================================================
          TOP BANNER: RIGHT-TO-LEFT SCROLLING SPONSORS MARQUEE
      ========================================================================= */}
      <div className="w-full bg-gradient-to-r from-[#0d1627] via-[#10203d] to-[#0d1627] border-b border-amber-500/25 py-3 relative overflow-hidden z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-widest text-[#FFC862] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Official Event Sponsors &amp; Partners
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:block">
            Sing Along Live 2026 • Arasan Turf, Sivakasi
          </span>
        </div>

        {/* Marquee Scroller (Right-to-Left Continuous Flow) */}
        <div className="relative w-full overflow-hidden flex items-center select-none group">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#070B14] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#070B14] to-transparent z-10 pointer-events-none" />

          {/* Scrolling Track with duplicate for seamless infinite loop */}
          <div className="flex items-center gap-6 animate-marquee-sponsors whitespace-nowrap group-hover:[animation-play-state:paused]">
            {[...SPONSORS, ...SPONSORS, ...SPONSORS].map((sp, idx) => (
              <div
                key={`${sp.id}-${idx}`}
                className="inline-flex items-center gap-3.5 bg-white/95 text-slate-900 px-4 py-2 rounded-xl shadow-md border border-amber-400/40 shrink-0 hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={sp.logo}
                  alt={sp.name}
                  className="h-9 w-auto max-w-[120px] object-contain"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-black text-slate-900 leading-tight">
                    {sp.name}
                  </span>
                  <span className="text-[9px] font-bold text-[#F0791E] uppercase tracking-wider">
                    {sp.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: FIRST SCREEN (INTRO / BEFORE YOU BOOK - SAME CONTENT)
      ========================================================================= */}
      {pageView === 'intro' ? (
        <div className="relative min-h-screen flex flex-col justify-between">
          {/* Hero Header */}
          <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 flex items-center justify-between z-20">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src={WEGROW_LOGO_IMG}
                alt="WeGrow Logo"
                className="h-9 sm:h-10 w-auto object-contain rounded-md bg-white p-1"
                onError={(e) => { e.currentTarget.src = '/wegrow-logo.webp'; }}
              />
              <span className="text-xs font-black uppercase tracking-wider text-white/90 group-hover:text-amber-400 transition">
                WeGrow Connect
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                <Star className="w-3.5 h-3.5" /> VIP &amp; Sponsor Portal
              </span>
              <button
                onClick={() => setPageView('booking')}
                className="bg-gradient-to-r from-[#F0791E] to-[#FF9F45] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg shadow-orange-500/25 transition-all hover:scale-105 cursor-pointer"
              >
                Claim Sponsor Pass ➔
              </button>
            </div>
          </header>

          {/* Hero Concert Presentation */}
          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-center flex-1 flex flex-col items-center justify-center relative z-10">
            {/* Live Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest text-[#FFC862] mb-6 backdrop-blur-md">
              <Music className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>WeGrow Presents Live Musical Concert</span>
            </div>

            {/* Concert Title */}
            <h1 className="font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-[#F0791E] drop-shadow-2xl">
              SING ALONG
            </h1>

            <p className="text-base sm:text-xl md:text-2xl font-bold text-amber-300/90 mb-8 max-w-2xl">
              {CONFIG.tagline}
            </p>

            {/* Key Event Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full mb-10">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md flex items-center gap-3 text-left">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Date</span>
                  <span className="text-sm font-extrabold text-white">{CONFIG.dateShort}</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md flex items-center gap-3 text-left">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Concert Time</span>
                  <span className="text-sm font-extrabold text-white">{CONFIG.eventTime}</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md flex items-center gap-3 text-left">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Venue</span>
                  <span className="text-sm font-extrabold text-white">{CONFIG.venue}, {CONFIG.location}</span>
                </div>
              </div>
            </div>

            {/* CTA Button to proceed */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => setPageView('booking')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#F0791E] via-[#FF8A00] to-[#E0680A] text-white font-black text-base shadow-[0_10px_35px_rgba(240,121,30,0.4)] hover:shadow-[0_15px_45px_rgba(240,121,30,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Claim VIP / Sponsor Pass</span>
                <ChevronRight className="w-5 h-5" />
              </button>

              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 transition-all duration-300"
              >
                Back to Home
              </Link>
            </div>
          </main>

          {/* Footer note */}
          <footer className="max-w-7xl mx-auto w-full px-4 py-6 text-center text-xs text-gray-500 border-t border-white/10">
            © 2026 WeGrow Skill Campus &amp; B-School. Sing Along Live Concert Sponsors Portal.
          </footer>
        </div>
      ) : (
        /* =========================================================================
            VIEW 2: SPONSOR BOOKING FLOW (3 CLEAN STEPS - ZERO PAYMENT)
        ========================================================================= */
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => {
                if (step === 1) setPageView('intro');
                else if (step === 2) setStep(1);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{step === 1 ? "Back to Event Overview" : "Back to User Details"}</span>
            </button>

            <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Sponsor &amp; VIP Pass Desk
            </span>
          </div>

          {/* 3-Step Progress Tracker */}
          <div className="grid grid-cols-3 gap-2 mb-8">
            <div className={`p-3 rounded-xl border text-center transition-all ${step >= 1 ? 'bg-[#10203d] border-amber-400 text-white font-bold' : 'bg-white/5 border-white/10 text-gray-500'}`}>
              <span className="text-[10px] uppercase block tracking-wider text-amber-400 font-black">Step 1</span>
              <span className="text-xs sm:text-sm font-extrabold">User Details</span>
            </div>

            <div className={`p-3 rounded-xl border text-center transition-all ${step >= 2 ? 'bg-[#10203d] border-amber-400 text-white font-bold' : 'bg-white/5 border-white/10 text-gray-500'}`}>
              <span className="text-[10px] uppercase block tracking-wider text-amber-400 font-black">Step 2</span>
              <span className="text-xs sm:text-sm font-extrabold">Select Code</span>
            </div>

            <div className={`p-3 rounded-xl border text-center transition-all ${step === 3 ? 'bg-emerald-950/80 border-emerald-400 text-white font-bold' : 'bg-white/5 border-white/10 text-gray-500'}`}>
              <span className="text-[10px] uppercase block tracking-wider text-emerald-400 font-black">Step 3</span>
              <span className="text-xs sm:text-sm font-extrabold">Generate Pass</span>
            </div>
          </div>

          {/* =========================================================================
              STEP 1: USER DETAILS (PAGE 1)
          ========================================================================= */}
          {step === 1 && (
            <div className="bg-[#0e1626] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl animate-fadeIn">
              <div className="text-center max-w-xl mx-auto mb-8">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <User className="w-6 h-6" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Attendee &amp; Guest Details
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1.5">
                  Enter your details accurately. Your Sing Along pass and verification QR will be issued to this name and email.
                </p>
              </div>

              <form onSubmit={handleNextToStep2} className="space-y-4 max-w-xl mx-auto">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={booker.name}
                    onChange={(e) => setBooker({ ...booker, name: e.target.value })}
                    placeholder="e.g. Ashok Kumar"
                    className="w-full bg-[#162238] border border-white/15 focus:border-[#F0791E] focus:ring-1 focus:ring-[#F0791E] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition"
                  />
                  {errors.name && <span className="text-xs text-red-400 mt-1 block">{errors.name}</span>}
                </div>

                {/* Mobile / WhatsApp */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    WhatsApp / Mobile Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={booker.mobile}
                      onChange={(e) => setBooker({ ...booker, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      placeholder="9876543210"
                      className="w-full bg-[#162238] border border-white/15 focus:border-[#F0791E] focus:ring-1 focus:ring-[#F0791E] rounded-xl pl-14 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition"
                    />
                  </div>
                  {errors.mobile && <span className="text-xs text-red-400 mt-1 block">{errors.mobile}</span>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={booker.email}
                    onChange={(e) => setBooker({ ...booker, email: e.target.value })}
                    placeholder="e.g. ashok@example.com"
                    className="w-full bg-[#162238] border border-white/15 focus:border-[#F0791E] focus:ring-1 focus:ring-[#F0791E] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition"
                  />
                  {errors.email && <span className="text-xs text-red-400 mt-1 block">{errors.email}</span>}
                </div>

                {/* Company / Sponsor Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      Company / Organization (Optional)
                    </label>
                    <input
                      type="text"
                      value={booker.company}
                      onChange={(e) => setBooker({ ...booker, company: e.target.value })}
                      placeholder="e.g. Fashion Woorld"
                      className="w-full bg-[#162238] border border-white/15 focus:border-[#F0791E] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                      City / Location
                    </label>
                    <input
                      type="text"
                      value={booker.city}
                      onChange={(e) => setBooker({ ...booker, city: e.target.value })}
                      placeholder="Sivakasi"
                      className="w-full bg-[#162238] border border-white/15 focus:border-[#F0791E] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#F0791E] to-[#FF9F45] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Continue: Select Pass Code</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =========================================================================
              STEP 2: SELECT TWO OPTION RADIO OPTIONS (PAGE 2)
          ========================================================================= */}
          {step === 2 && (
            <div className="bg-[#0e1626] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl animate-fadeIn">
              <div className="text-center max-w-xl mx-auto mb-8">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Ticket className="w-6 h-6" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Choose Pass Option
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1.5">
                  Select your authorization code to claim 100% complimentary entry. No payment required.
                </p>
              </div>

              {/* TWO RADIO OPTIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                {PASS_OPTIONS.map((opt) => {
                  const isSelected = selectedCode === opt.code;
                  return (
                    <div
                      key={opt.code}
                      onClick={() => setSelectedCode(opt.code)}
                      className={`relative rounded-2xl p-5 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#152442] border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)] scale-[1.02]'
                          : 'bg-[#121c2e] border-white/15 hover:border-white/30 opacity-80 hover:opacity-100'
                      }`}
                    >
                      {/* Top Row: Radio Circle & Badge */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-amber-400 bg-amber-400' : 'border-gray-500'}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 block">
                              {opt.type}
                            </span>
                            <span className="text-base font-black text-white">
                              {opt.code}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full ${opt.badgeColor}`}>
                          {opt.badge}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-300 font-medium leading-relaxed mb-4">
                        {opt.description}
                      </p>

                      {/* Benefits list */}
                      <ul className="space-y-1.5 text-[11px] text-gray-300 mb-4">
                        {opt.benefits.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Price Badge */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-gray-400 font-semibold">Pass Fee:</span>
                        <span className="font-black text-emerald-400 text-sm">
                          FREE (₹0)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary & Confirmation Box */}
              <div className="max-w-2xl mx-auto bg-[#131f33] border border-amber-400/30 rounded-2xl p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                      Pass Summary
                    </span>
                    <span className="text-sm font-bold text-white">
                      {booker.name} • {selectedCode === 'SA26_SP01' ? 'VIP SPONSOR PASS (SA26_SP01)' : 'PROMO PASS (SA26_PO01)'}
                    </span>
                    <span className="text-xs text-gray-400 block mt-0.5">
                      Dispatched to: {booker.email}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Payment Due</span>
                    <span className="text-lg font-black text-emerald-400">₹0.00</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="max-w-2xl mx-auto flex items-center gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  ← Edit Details
                </button>

                <button
                  onClick={handleGenerateTicket}
                  disabled={isSubmitting}
                  className="w-2/3 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating Pass...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Directly Generate Ticket Pass ➔</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 3: DIRECTLY GENERATE TICKET & SEND MAIL (PAGE 3)
          ========================================================================= */}
          {step === 3 && ticketData && (
            <div className="space-y-6 animate-fadeIn">
              {/* Email Sent Success Alert */}
              {emailSentNotice && (
                <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between gap-3 text-emerald-300 text-xs sm:text-sm shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="block text-emerald-200 font-black">
                        Pass Confirmation Dispatched!
                      </strong>
                      <span>Official digital pass copy sent to <b>{ticketData.email}</b> &amp; WhatsApp ({ticketData.phone}).</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setEmailSentNotice(false)}
                    className="text-xs text-emerald-400 hover:text-white p-1"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Pass Download Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0e1626] border border-white/10 p-4 rounded-2xl">
                <div>
                  <span className="text-xs font-bold text-gray-400 block">Pass Booking ID:</span>
                  <span className="text-base font-black text-amber-400 flex items-center gap-2">
                    {ticketData.bookingId}
                    <button
                      onClick={handleCopyBookingId}
                      className="p-1 rounded bg-white/10 hover:bg-white/20 text-xs text-white cursor-pointer"
                      title="Copy Pass ID"
                    >
                      {isCopiedBookingId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Print
                  </button>

                  <button
                    onClick={handleShareWhatsApp}
                    className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-xs font-black text-white flex items-center gap-1.5 transition cursor-pointer shadow-md"
                  >
                    <Share2 className="w-4 h-4" /> Share on WhatsApp
                  </button>
                </div>
              </div>

              {/* OFFICIAL TICKET PASS CARD (PRINTABLE & DOWNLOADABLE) */}
              <div
                ref={ticketRef}
                className="relative bg-gradient-to-br from-[#0e172a] via-[#10203d] to-[#0a1120] border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.7)] overflow-hidden"
              >
                {/* Golden Corner Ribbons */}
                <div className="absolute top-0 right-0 w-36 h-36 overflow-hidden pointer-events-none">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] uppercase tracking-widest text-center py-1.5 w-48 -rotate-45 translate-x-12 translate-y-6 shadow-md">
                    {ticketData.code.includes('SP') ? 'VIP SPONSOR' : 'SPECIAL PROMO'}
                  </div>
                </div>

                {/* Ticket Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                        Official Entry Pass • Confirmed
                      </span>
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tight">
                      SING ALONG LIVE 2026
                    </h3>
                    <p className="text-xs text-amber-300/90 font-medium">
                      Presented by WeGrow Skill Campus &amp; B-School
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                      {ticketData.passTitle}
                    </span>
                    <span className="block text-xs font-mono font-bold text-gray-400 mt-1">
                      Code: {ticketData.code}
                    </span>
                  </div>
                </div>

                {/* Ticket Details & QR Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Attendee Details */}
                  <div className="md:col-span-2 space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Attendee Name</span>
                        <strong className="text-base text-white font-black block">{ticketData.fullName}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Company / Guest</span>
                        <strong className="text-sm text-amber-300 font-bold block">{ticketData.company}</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Date &amp; Time</span>
                        <strong className="text-white font-bold block">{CONFIG.date}</strong>
                        <span className="text-gray-400">{CONFIG.eventTime}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Reporting Time</span>
                        <strong className="text-amber-400 font-bold block">{CONFIG.reportingTime}</strong>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Venue Address</span>
                      <strong className="text-white font-bold block">{CONFIG.fullVenue}</strong>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center gap-4 text-gray-400 text-[11px]">
                      <span>Issued to: <b>{ticketData.email}</b></span>
                      <span>•</span>
                      <span>Phone: <b>{ticketData.phone}</b></span>
                    </div>
                  </div>

                  {/* Verification QR Code Area */}
                  <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-slate-900 shadow-xl text-center">
                    {ticketQr ? (
                      <img src={ticketQr} alt="Verification QR" className="w-36 h-36 object-contain" />
                    ) : (
                      <div className="w-36 h-36 bg-gray-100 animate-pulse rounded-lg" />
                    )}
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 mt-2 block">
                      Gate QR Scanner Pass
                    </span>
                    <span className="text-[9px] font-mono font-bold text-slate-500">
                      {ticketData.bookingId}
                    </span>
                  </div>
                </div>

                {/* Bottom Sponsor Ribbon on Ticket */}
                <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Sponsored by <b>Fashion Woorld, Mahaan Ventures, Mayann Architectx, Sense Connect &amp; Kerala Wood Furniture</b></span>
                  </div>
                  <span className="text-emerald-400 font-bold">100% Free Entry • Verified Pass</span>
                </div>
              </div>

              {/* Navigation Back */}
              <div className="text-center pt-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition"
                >
                  <Home className="w-4 h-4" />
                  <span>Return to Main Website</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
