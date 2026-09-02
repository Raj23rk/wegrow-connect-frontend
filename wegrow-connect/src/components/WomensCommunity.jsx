import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CommunityPageFooter from './CommunityPageFooter';
import {
  Calendar,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  ChevronDown,
  ArrowRight,
  Users,
  Target,
  Send,
  HelpCircle,
  Building2,
  Headphones,
  Star,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { registerWomenEntrepreneur } from '../services/api';

export default function WomensCommunity() {
  // 1. Live Countdown Timer to Event Date: Fri, Sep 11, 2026 11:00 AM IST
  const eventDate = new Date('2026-09-11T11:00:00+05:30').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = eventDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [eventDate]);

  // Smooth scroll to target section ID
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 3. FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // 4. Registration Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    businessStage: 'planning',
    category: 'retail_boutique',
    note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      toast.error('Please provide your name and phone number!');
      return;
    }
    if (formData.phone.replace(/\D/g, '').length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        businessStage: formData.businessStage,
        category: formData.category,
        note: formData.note?.trim() || undefined,
      };

      const res = await registerWomenEntrepreneur(payload);
      if (res && (res.success || res.status === 'success' || res._id || res.data)) {
        setIsRegistered(true);
        toast.success('Registration successful! Welcome to WeGrow Women Community 🎉');
      } else {
        const errMsg = res?.message || 'Registration failed. Please try again.';
        toast.error(errMsg);
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Unable to connect to server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // FAQs Data
  const faqs = [
    {
      q: 'Who can attend this orientation session?',
      a: 'Any woman looking to start her own business, scale an existing small/medium business, or learn structured business methodologies from industry mentors. No prior degree or qualification required.'
    },
    {
      q: 'Is the session conducted in Tamil or English?',
      a: 'The session is fully bilingual (Tamil & English) with clear, practical real-world examples that anyone can easily understand.'
    },
    {
      q: 'Is prior registration mandatory?',
      a: 'Yes, prior registration is mandatory as seats at the venue are limited to ensure direct mentor interaction.'
    },
    {
      q: 'What do I need to bring with me to the venue?',
      a: 'Bring a notebook, a pen, an open mindset, and your business ideas or samples/product portfolios if you already run a business!'
    },
    {
      q: 'Will there be mentorship and follow-up support after the orientation?',
      a: 'Yes! Participants will gain direct access to WeGrow B School mentors, structured workshops, peer networking groups, and enterprise support.'
    }
  ];

  const fullAddress = '193/1A, Ground Floor, Ayyapan Kovil Opp. Police Station Road, Sivakasi – 626 123';
  const venueAddress = 'Ayyapan Kovil Opposite, Sivakasi';
  return (
    <div className="min-h-screen bg-[#FBF6EE] text-[#1B2140] font-sans antialiased selection:bg-[#F0791E] selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#FBF6EE]/95 backdrop-blur-md border-b border-[#E7E1D4] px-4 lg:px-8 py-3 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-3">
            <img
              src="/wegrow-logo.png"
              alt="WeGrow B School Logo"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="hidden items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#16225E] text-white flex items-center justify-center font-black">
                WG
              </div>
              <div>
                <span className="text-[#16225E] font-black text-xl tracking-tight">WeGrow</span>
                <span className="text-[#F0791E] font-bold text-sm ml-1">B School</span>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            <a
              href="tel:+919344337331"
              className="flex items-center gap-2 text-sm font-semibold text-[#16225E] hover:text-[#F0791E] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#16225E]/10 flex items-center justify-center">
                <Phone className="w-4 h-4 text-[#F0791E]" />
              </div>
              <span className="hidden sm:inline font-mono font-bold">+91 9344337331</span>
            </a>
            <a
              href="#register"
              onClick={(e) => scrollToSection(e, 'register')}
              className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm text-white bg-[#F0791E] hover:bg-[#D9600B] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Register Now
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-8 pb-14 sm:pt-12 sm:pb-18 lg:pt-16 lg:pb-24">
        {/* Background ambient glow */}
        <div
          className="absolute -top-32 -right-32 w-[550px] h-[550px] bg-gradient-to-br from-[#FDE6CE] to-[#FBF6EE] rounded-full pointer-events-none opacity-80"
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Left Column: Heading & Copy */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 bg-[#16225E] text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#F0791E] animate-pulse" />
              WeGrow B School Orientation
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#16225E] leading-tight tracking-tight">
              Women's <span className="text-[#F0791E]">Entrepreneurship</span> Community
            </h1>

            <div className="bg-[#F0791E]/10 border border-[#F0791E]/20 px-4 py-2.5 rounded-2xl inline-block max-w-xl text-left">
              <p className="text-xs sm:text-base font-semibold text-[#16225E] leading-relaxed">
                மகளிர் தொழில் முனைவோர் சமூகம் — நெட்வொர்க் ஃபோரம் இல்ல லேர்னிங் கம்யூனிட்டி
              </p>
            </div>

            <p className="text-[#666C87] text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              An exclusive orientation session for women starting out or already running a business in Sivakasi & Tamil Nadu. Meet mentors, connect with fellow founders, and explore structured growth roadmaps with WeGrow B School.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <a
                href="#register"
                onClick={(e) => scrollToSection(e, 'register')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-[#F0791E] hover:bg-[#D9600B] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                Register Now <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#event-details"
                onClick={(e) => scrollToSection(e, 'event-details')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base text-[#16225E] bg-transparent border-2 border-[#16225E] hover:bg-[#16225E] hover:text-white transition-all cursor-pointer"
              >
                Venue & Details
              </a>
            </div>

            {/* Quick Meta Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[#E7E1D4] text-left">
              <div className="flex items-center gap-2.5 text-sm font-bold text-[#16225E]">
                <Calendar className="w-5 h-5 text-[#F0791E] flex-shrink-0" />
                <span>Fri, 11 Sep 2026</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-bold text-[#16225E]">
                <Clock className="w-5 h-5 text-[#F0791E] flex-shrink-0" />
                <span>11:00 AM – 1:00 PM</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-bold text-[#16225E]">
                <MapPin className="w-5 h-5 text-[#F0791E] flex-shrink-0" />
                <span>Ayyapan Kovil, Sivakasi</span>
              </div>


            </div>
          </div>

          {/* Right Column: Hero Mascot / Visual */}
          <div className="lg:col-span-5 relative text-center flex justify-center">
            <div
              className="absolute inset-0 m-auto w-4/5 h-4/5 rounded-full bg-[#F0791E]/20 filter blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white p-3 sm:p-4 rounded-3xl shadow-2xl border-2 border-[#E7E1D4] hover:border-[#F0791E]/60 transition-all duration-300 transform hover:scale-[1.02]">
              <img
                src="/wegrow-mascot.jpeg"
                alt="WeGrow B School mascot giving a thumbs up"
                className="w-full h-auto object-cover rounded-2xl shadow-sm"
                onError={(e) => {
                  e.target.src = '/women_entrepreneurs_comm.jpg';
                }}
              />
              <div className="mt-3 py-2 px-3 bg-[#FBF6EE] rounded-xl flex items-center justify-between text-xs font-bold text-[#16225E]">
                <span className="flex items-center gap-1.5 text-[#F0791E]">
                  <Sparkles className="w-4 h-4" /> Women Founders Orientation
                </span>
                <span>Fri, 11 Sep 2026</span>
              </div>
            </div>

            {/* Quick Floating Stat Badge */}
            <div className="hidden sm:flex items-center gap-3 absolute -bottom-5 -left-4 bg-white p-3.5 rounded-2xl shadow-xl border border-[#E7E1D4] z-20">
              <div className="w-10 h-10 rounded-xl bg-[#16225E] text-[#F0791E] flex items-center justify-center font-black">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-sm text-[#16225E]">500+ Women Founders</div>
                <div className="text-[11px] text-[#666C87]">Trained & Mentored at WeGrow</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Countdown Timer Banner */}
      <section className="bg-gradient-to-r from-[#16225E] to-[#0C1338] text-white py-12 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="inline-block bg-[#F0791E] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            Orientation Starts In
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold">Save the Date & Secure Your Spot</h2>
          <p className="text-[#C9CEEB] text-sm max-w-lg mx-auto">
            Limited seating available at the Sivakasi venue to ensure direct mentor interaction.
          </p>

          <div className="flex justify-center items-center gap-3 sm:gap-6 flex-wrap pt-2">
            {[
              { label: 'Days', val: timeLeft.days },
              { label: 'Hours', val: timeLeft.hours },
              { label: 'Minutes', val: timeLeft.minutes },
              { label: 'Seconds', val: timeLeft.seconds }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/10 border border-white/20 rounded-2xl p-4 min-w-[80px] sm:min-w-[100px] text-center shadow-md backdrop-blur-sm"
              >
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F0791E] font-mono">
                  {String(item.val).padStart(2, '0')}
                </div>
                <div className="text-[11px] sm:text-xs uppercase tracking-wider text-[#C9CEEB] mt-1 font-semibold">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <a
              href="#register"
              onClick={(e) => scrollToSection(e, 'register')}
              className="inline-flex items-center gap-2 bg-[#F0791E] hover:bg-[#D9600B] text-white font-bold px-8 py-3 rounded-full transition shadow-lg cursor-pointer"
            >
              Register Now <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="py-20 bg-white border-y border-[#E7E1D4] px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="inline-flex items-center gap-2 bg-[#16225E]/10 text-[#16225E] font-bold text-xs px-3.5 py-1.5 rounded-full">
              <Users className="w-3.5 h-3.5 text-[#F0791E]" /> Who This Is For
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16225E]">
              Not a Network Forum But a Real Learning Community            </h2>
            <p className="text-[#666C87] text-base">
              Built for two kinds of ambitious women in one collaborative room. Come as you are, leave with clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#FBF6EE] border border-[#E7E1D4] rounded-3xl p-8 hover:shadow-xl transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#16225E] text-white flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-[#F0791E]" />
              </div>
              <h3 className="text-xl font-extrabold text-[#16225E] mb-3">
                1. Aspiring Entrepreneurs 
              </h3>
              <p className="text-[#666C87] text-sm leading-relaxed mb-4">
                You have an idea, skill, or passion (baking, tailoring, digital services, crafts, coaching) but feel stuck on how to register, price, get first customers, or handle finance.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm font-semibold text-[#16225E]">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#F0791E]" /> Idea validation & business model canvas</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#F0791E]" /> Low-capital startup strategies</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#F0791E]" /> Overcoming fear & building confidence</li>
              </ul>
            </div>

            <div className="bg-[#FBF6EE] border border-[#E7E1D4] rounded-3xl p-8 hover:shadow-xl transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#16225E] text-white flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7 text-[#F0791E]" />
              </div>
              <h3 className="text-xl font-extrabold text-[#16225E] mb-3">
                2. Active Business Owners (ஏற்கனவே தொழில் செய்வோர்)
              </h3>
              <p className="text-[#666C87] text-sm leading-relaxed mb-4">
                You are running a boutique, manufacturing unit, clinic, or freelancing agency, but want to scale revenue, build a strong brand, automate operations, or reach new markets.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm font-semibold text-[#16225E]">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#F0791E]" /> Digital marketing & brand positioning</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#F0791E]" /> Financial planning & working capital</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#F0791E]" /> Access to B2B collaborations & mentorship</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Core Pillars */}
      <section className="py-20 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-block bg-[#16225E] text-white text-xs font-bold px-3.5 py-1.5 rounded-full">
                Why WeGrow Community?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16225E]">
                More than a network — An ecosystem for growth
              </h2>
              <p className="text-[#666C87] text-base leading-relaxed">
                Most business forums end with exchanging visiting cards. WeGrow provides structured learning, milestone tracking, and continuous mentor reviews.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white border border-[#E7E1D4] rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="font-mono font-black text-2xl text-[#F0791E] mb-3">01</div>
                <h4 className="font-bold text-[#16225E] text-base mb-2">Practical Learning</h4>
                <p className="text-xs text-[#666C87] leading-relaxed">
                  No academic jargon. Step-by-step frameworks on sales, social media, and bookkeeping.
                </p>
              </div>

              <div className="bg-white border border-[#E7E1D4] rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="font-mono font-black text-2xl text-[#F0791E] mb-3">02</div>
                <h4 className="font-bold text-[#16225E] text-base mb-2">Real Mentors</h4>
                <p className="text-xs text-[#666C87] leading-relaxed">
                  Learn directly from entrepreneurs who have successfully built profitable businesses.
                </p>
              </div>

              <div className="bg-white border border-[#E7E1D4] rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="font-mono font-black text-2xl text-[#F0791E] mb-3">03</div>
                <h4 className="font-bold text-[#16225E] text-base mb-2">Lifelong Network</h4>
                <p className="text-xs text-[#666C87] leading-relaxed">
                  Form trusted partnerships, find vendors, and get peer accountability every month.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Venue & Details Section (Agenda Removed per user request) */}
      <section id="event-details" className="py-20 bg-white border-y border-[#E7E1D4] px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="inline-block bg-[#F0791E]/10 text-[#F0791E] font-bold text-xs px-3.5 py-1.5 rounded-full">
              Orientation Details
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16225E]">Event Venue & Timing</h2>
            <p className="text-[#666C87] text-sm sm:text-base">
              Mark your calendar and arrive 15 minutes early for badge pickup and networking.
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-[#FBF6EE] border border-[#E7E1D4] rounded-2xl p-6 text-center">
              <Calendar className="w-7 h-7 text-[#F0791E] mx-auto mb-2" />
              <div className="text-xs font-bold text-[#666C87] uppercase tracking-wider mb-1">Date</div>
              <div className="text-base font-extrabold text-[#16225E]">Fri, 11 Sep 2026</div>
            </div>

            <div className="bg-[#FBF6EE] border border-[#E7E1D4] rounded-2xl p-6 text-center">
              <Clock className="w-7 h-7 text-[#F0791E] mx-auto mb-2" />
              <div className="text-xs font-bold text-[#666C87] uppercase tracking-wider mb-1">Timing</div>
              <div className="text-base font-extrabold text-[#16225E]">11:00 AM – 1:00 PM</div>
            </div>

            <div className="bg-[#FBF6EE] border border-[#E7E1D4] rounded-2xl p-6 text-center sm:col-span-2 lg:col-span-1">
              <MapPin className="w-7 h-7 text-[#F0791E] mx-auto mb-2" />
              <div className="text-xs font-bold text-[#666C87] uppercase tracking-wider mb-1">Venue Location</div>
              <div className="text-xs sm:text-sm font-extrabold text-[#16225E] leading-snug">
                {fullAddress}
              </div>
            </div>

            <div className="bg-[#FBF6EE] border border-[#E7E1D4] rounded-2xl p-6 text-center sm:col-span-2 lg:col-span-1">
              <Headphones className="w-7 h-7 text-[#F0791E] mx-auto mb-2" />
              <div className="text-xs font-bold text-[#666C87] uppercase tracking-wider mb-1">Queries & Support</div>
              <a
                href="tel:+919344337331"
                className="inline-block text-base font-extrabold text-[#F0791E] hover:underline font-mono"
              >
                +91 9344337331
              </a>
            </div>
          </div>

          {/* Agenda Schedule */}
          <div className="mt-12 border border-[#E7E1D4] rounded-3xl overflow-hidden bg-[#FBF6EE] shadow-sm">
            <div className="bg-[#16225E] text-white px-6 py-4 flex items-center justify-between">
              <span className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F0791E]" /> Orientation Session Agenda
              </span>
              <span className="text-xs text-[#C9CEEB] font-semibold">11:00 AM – 1:00 PM</span>
            </div>
            <div className="divide-y divide-[#E7E1D4]">
              {[
                {
                  time: '11:00 AM',
                  title: 'Welcome and registration',
                  desc: 'Check-in, seating, light refreshments'
                },
                {
                  time: '11:15 AM',
                  title: 'What is WeGrow B School',
                  desc: 'Programs, mentors, and how the community works'
                },
                {
                  time: '11:30 AM',
                  title: 'Founder panel',
                  desc: 'Women entrepreneurs share what actually worked'
                },
                {
                  time: '12:15 PM',
                  title: 'Open networking',
                  desc: 'Meet mentors and fellow participants'
                },
                {
                  time: '12:45 PM',
                  title: 'Enrolment desk opens',
                  desc: "Sign up for the full program if it's a fit"
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-6 py-4.5 hover:bg-white/60 transition-colors"
                >
                  <div className="font-mono font-bold text-[#F0791E] text-sm sm:w-28 flex-shrink-0">
                    {item.time}
                  </div>
                  <div>
                    <strong className="block text-[#16225E] text-sm sm:text-base font-bold">
                      {item.title}
                    </strong>
                    <span className="text-[#666C87] text-xs sm:text-sm">
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 lg:px-8 bg-[#FBF6EE]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-flex items-center gap-2 bg-[#16225E] text-white text-xs font-bold px-3.5 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F0791E]" /> Gallery
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16225E] mt-3">
                Moments From Past Sessions
              </h2>
            </div>
            <p className="text-[#666C87] text-sm sm:text-base max-w-md">
              Highlights from previous WeGrow women entrepreneurship meets, workshops, and founder mentorship sessions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px] sm:auto-rows-[180px] lg:auto-rows-[200px]">
            {/* Featured Large Tile */}
            <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group shadow-md border border-[#E7E1D4] bg-[#EFE7D6]">
              <img
                src="/events/womenmetting.JPG"
                alt="Women Founders Community Meet"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = '/women_entrepreneurs_comm.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1338]/85 via-[#0C1338]/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="bg-[#F0791E] text-[11px] font-bold uppercase px-2.5 py-1 rounded-full tracking-wider">
                  Orientation Meet
                </span>
                <h4 className="font-extrabold text-base sm:text-lg mt-1.5 text-white">
                  Women Founders Circle & Mentorship
                </h4>
              </div>
            </div>

            {/* Tile 2 */}
            <div className="relative rounded-2xl overflow-hidden group shadow-md border border-[#E7E1D4] bg-[#EFE7D6]">
              <img
                src="/events/group.JPG"
                alt="Sivakasi Business Meet"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1338]/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <p className="font-bold text-xs sm:text-sm text-white line-clamp-1">Regional Founder Network</p>
              </div>
            </div>

            {/* Tile 3 */}
            <div className="relative rounded-2xl overflow-hidden group shadow-md border border-[#E7E1D4] bg-[#EFE7D6]">
              <img
                src="/events/help.jpg"
                alt="Aspiring Startup Founders"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1338]/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <p className="font-bold text-xs sm:text-sm text-white line-clamp-1">Idea Validation & Pitching</p>
              </div>
            </div>

            {/* Tile 4 */}
            <div className="relative rounded-2xl overflow-hidden group shadow-md border border-[#E7E1D4] bg-[#EFE7D6]">
              <img
                src="/Images/dm 1.jpg"
                alt="Digital Marketing Masterclass"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1338]/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <p className="font-bold text-xs sm:text-sm text-white line-clamp-1">Digital Marketing Clinic</p>
              </div>
            </div>

            {/* Tile 5 */}
            <div className="relative rounded-2xl overflow-hidden group shadow-md border border-[#E7E1D4] bg-[#EFE7D6]">
              <img
                src="/Images/fu 1.jpg"
                alt="Financial Planning Workshop"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1338]/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <p className="font-bold text-xs sm:text-sm text-white line-clamp-1">Finance & Growth Strategies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 lg:px-8 bg-white border-t border-[#E7E1D4]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="inline-block bg-[#16225E] text-white text-xs font-bold px-3.5 py-1.5 rounded-full">
              Voices of WeGrow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16225E]">Hear From Our Women Founders</h2>
            <p className="text-[#666C87] text-sm sm:text-base">
              Real stories from entrepreneurs who started where you are today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  'WeGrow helped me price my handmade organic cosmetics properly. Within 4 months of joining, my monthly orders tripled.',
                author: 'Kavitha R.',
                role: 'Founder, Natural Glow Organics'
              },
              {
                quote:
                  'I was hesitant about speaking in public and pitching. The mentor clinic gave me the courage to approach corporate gift buyers.',
                author: 'Meenakshi Sundaram',
                role: 'Proprietor, Sri Meena Sweets & Bakes'
              },
              {
                quote:
                  'The peer network is pure gold. Whenever I face a supply chain or staff issue, I get actionable advice from fellow women in the group.',
                author: 'Priya Dharshini',
                role: 'Director, Dharshini Textiles'
              }
            ].map((t, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E7E1D4] rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:shadow-lg transition"
              >
                <div className="space-y-4 mb-6">
                  <div className="flex gap-1 text-[#F0791E]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-[#1B2140] text-sm sm:text-base italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-[#E7E1D4]">
                  <div className="w-10 h-10 rounded-full bg-[#16225E] text-white flex items-center justify-center font-bold text-sm">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#16225E]">{t.author}</div>
                    <div className="text-xs text-[#666C87]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 bg-white border-y border-[#E7E1D4] px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <span className="inline-flex items-center gap-2 bg-[#F0791E]/10 text-[#F0791E] font-bold text-xs px-3.5 py-1.5 rounded-full">
              <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-extrabold text-[#16225E]">Common Questions Answered</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-[#E7E1D4] rounded-2xl overflow-hidden bg-[#FBF6EE] transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 sm:p-6 font-bold text-base text-[#16225E] flex justify-between items-center gap-4 hover:text-[#F0791E] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#F0791E] transition-transform duration-200 flex-shrink-0 ${openFaq === idx ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-6 sm:px-6 text-sm text-[#666C87] leading-relaxed border-t border-[#E7E1D4]/60 pt-4 bg-white/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" className="py-20 px-4 lg:px-8 bg-gradient-to-b from-[#FBF6EE] to-[#F5ECE0]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-[#E7E1D4] p-8 sm:p-12 shadow-xl">
            <div className="text-center space-y-2 mb-8">
              <span className="inline-block bg-[#F0791E] text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full">
                Seat Reservation
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#16225E]">
                Reserve Your Orientation Seat
              </h3>
              <p className="text-sm text-[#666C87]">
                Fill out the quick form below. You will receive immediate WhatsApp & SMS confirmation.
              </p>
            </div>

            {isRegistered ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-black text-emerald-900">Seat Reserved Successfully!</h4>
                <p className="text-sm text-emerald-800 max-w-md mx-auto">
                  Thank you, <strong>{formData.fullName}</strong>! We have saved your seat for <strong>Fri, 11 Sep 2026 (11:00 AM – 1:00 PM)</strong> at {fullAddress}. Our team will reach out on WhatsApp (+91 {formData.phone}) with directions.
                </p>
                <button
                  onClick={() => setIsRegistered(false)}
                  className="inline-block text-xs font-bold text-emerald-700 underline hover:text-emerald-900 pt-2 cursor-pointer"
                >
                  Register another person
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#16225E] mb-2">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Priya Sundaram"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-[#1B2140] text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#F0791E] focus:ring-2 focus:ring-[#F0791E]/20 transition-all shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#16225E] mb-2">
                      WhatsApp Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-[#1B2140] text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#F0791E] focus:ring-2 focus:ring-[#F0791E]/20 transition-all shadow-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#16225E] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. priya@gmail.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-[#1B2140] text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#F0791E] focus:ring-2 focus:ring-[#F0791E]/20 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#16225E] mb-2">
                      Current Stage of Business
                    </label>
                    <select
                      name="businessStage"
                      value={formData.businessStage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-[#1B2140] text-sm focus:outline-none focus:border-[#F0791E] focus:ring-2 focus:ring-[#F0791E]/20 transition-all shadow-sm cursor-pointer"
                    >
                      <option value="planning">Idea / Planning Stage</option>
                      <option value="just_started">Just Started (1-12 months)</option>
                      <option value="running">Running Business (1-3 years)</option>
                      <option value="established">Established Business (3+ years)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#16225E] mb-2">
                      Business Domain / Interest
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-[#1B2140] text-sm focus:outline-none focus:border-[#F0791E] focus:ring-2 focus:ring-[#F0791E]/20 transition-all shadow-sm cursor-pointer"
                    >
                      <option value="retail_boutique">Boutique / Tailoring / Apparel</option>
                      <option value="food_baking">Food / Baking / Catering</option>
                      <option value="beauty_wellness">Beauty / Salon / Wellness</option>
                      <option value="manufacturing_crafts">Handicrafts / Manufacturing</option>
                      <option value="digital_services">Coaching / Digital Services</option>
                      <option value="other">Other Domain</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#F0791E] hover:bg-[#D9600B] text-white font-black text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    'Processing...'
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> Confirm Seat Reservation
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-[#666C87] pt-2">
                  🔒 We respect your privacy. No spam. You will only receive event reminders and venue directions.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Shared WeGrow B School Footer */}
      <CommunityPageFooter
        eventLabel="Women's Orientation 2026"
        eventDate="Fri, 11 Sep 2026"
        eventTime="11:00 AM – 1:00 PM"
        venueAddress={fullAddress}
        queriesPhone="+91 9344337331"
        registerSectionId="register"
      />
    </div>
  );
}
