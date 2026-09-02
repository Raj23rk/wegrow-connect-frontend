import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  ChevronDown,
  ArrowRight,
  Users,
  Lightbulb,
  BookOpen,
  Network,
  TrendingUp,
  Send,
  HelpCircle,
  Star,
  Sparkles,
  Headphones
} from 'lucide-react';
import toast from 'react-hot-toast';
import { registerStudentFounder } from '../services/api';
import CommunityPageFooter from './CommunityPageFooter';

export default function StudentFoundersCommunity() {
  // ─── Countdown Timer ─────────────────────────────────────────────────────────
  const eventDate = new Date('2026-09-12T11:00:00+05:30').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = eventDate - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff / 3600000) % 24),
          minutes: Math.floor((diff / 60000) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [eventDate]);

  // ─── Smooth Scroll ────────────────────────────────────────────────────────────
  const scrollTo = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ─── FAQ Accordion ────────────────────────────────────────────────────────────
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = i => setOpenFaq(openFaq === i ? null : i);

  const faqs = [
    {
      q: 'Is registration required to attend?',
      a: 'Yes, registration is required in advance to confirm your seat for the orientation.'
    },
    {
      q: 'Do I need to have a business idea to join?',
      a: 'Not at all! You can join even if you are just exploring. This orientation is designed for all stages — idea, early, or already running something.'
    },
    {
      q: 'Who is eligible? Only final-year students?',
      a: 'Any student from any year, any stream, any college is welcome. First-year or final-year — all are equally eligible.'
    },
    {
      q: 'Will I get a confirmation after registering?',
      a: 'Yes! You will receive a confirmation via WhatsApp or a call on the number you register with. For queries, call +91 9344337331.'
    },
    {
      q: 'What should I bring to the orientation?',
      a: 'Just yourself and a notebook. If you already have a product or business idea, feel free to bring samples or a brief writeup for mentor feedback!'
    }
  ];

  // ─── Registration Form ────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    collegeName: '',
    yearOfStudy: '',
    course: '',
    courseStartYear: '',
    courseEndYear: '',
    readiness: '',
    hasIdea: '',
    seriousness: '',
    lookingForFunding: '',
    readyToLearn: '',
    industryNiche: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || !form.email.trim()) {
      toast.error('Please provide your name, phone number, and email address!');
      return;
    }
    if (form.phone.replace(/\D/g, '').length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        collegeName: form.collegeName?.trim() || undefined,
        yearOfStudy: form.yearOfStudy || undefined,
        course: form.course?.trim() || undefined,
        courseStartYear: form.courseStartYear ? Number(form.courseStartYear) : undefined,
        courseEndYear: form.courseEndYear ? Number(form.courseEndYear) : undefined,
        readiness: form.readiness || undefined,
        hasIdea: form.hasIdea || undefined,
        seriousness: form.seriousness || undefined,
        lookingForFunding: form.lookingForFunding || undefined,
        readyToLearn: form.readyToLearn || undefined,
        industryNiche: form.industryNiche || undefined,
      };

      const res = await registerStudentFounder(payload);
      if (res && (res.success || res.status === 'success' || res._id || res.data)) {
        setRegistered(true);
        toast.success('Registration confirmed! See you on 12 Sep 🎓');
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

  // ─── Content data ─────────────────────────────────────────────────────────────
  const pillars = [
    {
      icon: <Lightbulb className="w-7 h-7 text-[#F0791E]" />,
      num: '01',
      title: 'Ideate',
      sub: 'Your Business',
      desc: 'Validate your idea with real market data and design a lean business model that works.'
    },
    {
      icon: <BookOpen className="w-7 h-7 text-[#F0791E]" />,
      num: '02',
      title: 'Learn',
      sub: 'From Experts',
      desc: 'Get structured frameworks on sales, pricing, digital marketing, and finance from mentors who\'ve been there.'
    },
    {
      icon: <Network className="w-7 h-7 text-[#F0791E]" />,
      num: '03',
      title: 'Network',
      sub: 'With Founders',
      desc: 'Build lasting connections with fellow student founders across disciplines and institutions.'
    },
    {
      icon: <TrendingUp className="w-7 h-7 text-[#F0791E]" />,
      num: '04',
      title: 'Grow',
      sub: 'Your Venture',
      desc: 'Access WeGrow\'s incubation programs, mentorship cohorts, and business resources beyond the orientation.'
    }
  ];

  const testimonials = [
    {
      quote: 'I joined without any idea. After the orientation I had a clear business plan and my first 5 customers within a month!',
      author: 'Arjun V.',
      role: 'B.Com 3rd Year, Student Founder – DigitalDrop Agency'
    },
    {
      quote: 'The mentor roundtable was incredible. I got direct feedback on my handmade jewellery business from someone who had scaled a similar one.',
      author: 'Nivetha S.',
      role: 'B.Sc Chemistry, Founder – Kala Crafts'
    },
    {
      quote: 'WeGrow helped me register my business, get GST, and set up Instagram sales all in one month. The network is unmatched.',
      author: 'Mohammed Irfan',
      role: 'MBA 1st Year, Co-Founder – PrintFast Hub'
    }
  ];

  const venueAddress = 'Ayyapan Kovil Opposite, Naturals below, WeGrow B School, Sivakasi';
  const helperPhone = '+91 9344337331';

  return (
    <div className="min-h-screen bg-[#FBF6EE] text-[#1B2140] font-sans antialiased selection:bg-[#F0791E] selection:text-white overflow-x-hidden">

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#FBF6EE]/95 backdrop-blur-md border-b border-[#E7E1D4] px-4 lg:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-3">
            <img
              src="/wegrow-logo.png"
              alt="WeGrow B School"
              className="h-10 w-auto object-contain"
              onError={e => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
            />
            <div className="hidden items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#16225E] text-white flex items-center justify-center font-black">WG</div>
              <div>
                <span className="text-[#16225E] font-black text-xl">WeGrow</span>
                <span className="text-[#F0791E] font-bold text-sm ml-1">B School</span>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <a href={`tel:${helperPhone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-sm font-semibold text-[#16225E] hover:text-[#F0791E] transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#16225E]/10 flex items-center justify-center">
                <Phone className="w-4 h-4 text-[#F0791E]" />
              </div>
              <span className="hidden sm:inline font-mono font-bold">{helperPhone}</span>
            </a>
            <a href="#register" onClick={e => scrollTo(e, 'register')}
              className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm text-white bg-[#F0791E] hover:bg-[#D9600B] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
              Register Now
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ───────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden pt-8 pb-14 sm:pt-12 sm:pb-18 lg:pt-16 lg:pb-24">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-[#FDE6CE] to-[#FBF6EE] rounded-full pointer-events-none opacity-70" aria-hidden />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Left column */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 bg-[#16225E] text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#F0791E] animate-pulse" />
              WeGrow B School · Student Founders Orientation
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#16225E] leading-tight tracking-tight">
              Student <span className="text-[#F0791E]">Founders</span> Community
            </h1>

            <div className="bg-[#F0791E]/10 border border-[#F0791E]/20 px-4 py-2.5 rounded-2xl inline-block max-w-xl text-left">
              <p className="text-xs sm:text-base font-semibold text-[#16225E] leading-relaxed">
                College படிக்கும் போதே உங்க Business-ஐ Start பண்ணி Grow பண்ணணுமா? Join our Student Founders Community.
              </p>
            </div>

            <p className="text-[#666C87] text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              An exclusive orientation for college students who want to start, learn, and grow their own ventures —
              guided by experienced entrepreneurs and a peer community that's building alongside you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <a href="#register" onClick={e => scrollTo(e, 'register')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-[#F0791E] hover:bg-[#D9600B] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer">
                Register Now <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#event-details" onClick={e => scrollTo(e, 'event-details')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base text-[#16225E] border-2 border-[#16225E] hover:bg-[#16225E] hover:text-white transition-all cursor-pointer">
                Venue &amp; Details
              </a>
            </div>

            {/* Quick meta badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[#E7E1D4] text-left">
              <div className="flex items-center gap-2.5 text-sm font-bold text-[#16225E]">
                <Calendar className="w-5 h-5 text-[#F0791E] flex-shrink-0" />
                <span>Sat, 12 Sep 2026</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-bold text-[#16225E]">
                <Clock className="w-5 h-5 text-[#F0791E] flex-shrink-0" />
                <span>11:00 AM – 1:00 PM</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-bold text-[#16225E]">
                <MapPin className="w-5 h-5 text-[#F0791E] flex-shrink-0" />
                <span className="line-clamp-1" title={venueAddress}>WeGrow B School, Sivakasi</span>
              </div>
            </div>
          </div>

          {/* Right column — mascot visual */}
          <div className="lg:col-span-5 relative text-center">
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[88%] h-[78%] bg-[#F0791E] opacity-15 blur-3xl rounded-full pointer-events-none"
              aria-hidden="true"
            />
            <img
              src="/wegrow-mascot.jpg"
              alt="WeGrow B School mascot giving a thumbs up"
              className="relative max-h-[480px] lg:max-h-[540px] mx-auto w-auto object-contain drop-shadow-xl"
              onError={e => { e.target.src = '/student_startup_founder.jpg'; }}
            />

            {/* Floating stat badge */}
            <div className="hidden sm:flex items-center gap-3 absolute -bottom-4 -left-4 bg-white p-3.5 rounded-2xl shadow-xl border border-[#E7E1D4] z-20">
              <div className="w-10 h-10 rounded-xl bg-[#16225E] text-[#F0791E] flex items-center justify-center font-black">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-sm text-[#16225E]">12 Sep · Limited Seats</div>
                <div className="text-[11px] text-[#666C87]">Register now · Confirmation on WhatsApp</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Countdown Timer ────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#16225E] to-[#0C1338] text-white py-12 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="inline-block bg-[#F0791E] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            Orientation Starts In
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">Sat, 12 September 2026 — 11:00 AM to 1:00 PM</h2>
          <p className="text-[#C9CEEB] text-sm max-w-lg mx-auto">
            Limited seats at WeGrow B School, Sivakasi. Register now to secure your spot.
          </p>

          <div className="flex justify-center items-center gap-3 sm:gap-6 flex-wrap pt-2">
            {[
              { label: 'Days', val: timeLeft.days },
              { label: 'Hours', val: timeLeft.hours },
              { label: 'Minutes', val: timeLeft.minutes },
              { label: 'Seconds', val: timeLeft.seconds }
            ].map((item, i) => (
              <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-4 min-w-[80px] sm:min-w-[100px] text-center backdrop-blur-sm">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F0791E] font-mono">
                  {String(item.val).padStart(2, '0')}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-[#C9CEEB] mt-1 font-semibold">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <a href="#register" onClick={e => scrollTo(e, 'register')}
              className="inline-flex items-center gap-2 bg-[#F0791E] hover:bg-[#D9600B] text-white font-bold px-8 py-3 rounded-full transition shadow-lg cursor-pointer">
              Register Now <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── 4 Core Pillars ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="inline-flex items-center gap-2 bg-[#16225E]/10 text-[#16225E] font-bold text-xs px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#F0791E]" /> What You'll Do Here
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16225E]">
              Four Pillars of Student Entrepreneurship
            </h2>
            <p className="text-[#666C87] text-base">
              A structured path from campus idea to real-world venture — built specifically for students.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <div key={i} className="bg-white border border-[#E7E1D4] rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-[#16225E] flex items-center justify-center mb-5 group-hover:bg-[#F0791E] transition-colors">
                  {p.icon}
                </div>
                <div className="font-mono font-black text-2xl text-[#F0791E] mb-1">{p.num}</div>
                <h4 className="font-extrabold text-lg text-[#16225E] leading-tight">
                  {p.title} <span className="text-[#F0791E]">—</span>
                </h4>
                <p className="text-[10px] font-black text-[#F0791E] uppercase tracking-wider mb-3">{p.sub}</p>
                <p className="text-sm text-[#666C87] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Event Details ───────────────────────────────────────────────────── */}
      <section id="event-details" className="py-20 bg-white border-y border-[#E7E1D4] px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="inline-block bg-[#F0791E]/10 text-[#F0791E] font-bold text-xs px-3.5 py-1.5 rounded-full">
              Orientation Details
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16225E]">Event Venue &amp; Timing</h2>
            <p className="text-[#666C87] text-sm sm:text-base">
              Mark your calendar and arrive 15 minutes early for badge collection &amp; networking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-[#FBF6EE] border border-[#E7E1D4] rounded-2xl p-6 text-center">
              <Calendar className="w-7 h-7 text-[#F0791E] mx-auto mb-2" />
              <div className="text-xs font-bold text-[#666C87] uppercase tracking-wider mb-1">Date</div>
              <div className="text-base font-extrabold text-[#16225E]">Sat, 12 Sep 2026</div>
            </div>
            <div className="bg-[#FBF6EE] border border-[#E7E1D4] rounded-2xl p-6 text-center">
              <Clock className="w-7 h-7 text-[#F0791E] mx-auto mb-2" />
              <div className="text-xs font-bold text-[#666C87] uppercase tracking-wider mb-1">Timing</div>
              <div className="text-base font-extrabold text-[#16225E]">11:00 AM – 1:00 PM</div>
            </div>
            <div className="bg-[#FBF6EE] border border-[#E7E1D4] rounded-2xl p-6 text-center sm:col-span-1">
              <MapPin className="w-7 h-7 text-[#F0791E] mx-auto mb-2" />
              <div className="text-xs font-bold text-[#666C87] uppercase tracking-wider mb-1">Venue</div>
              <div className="text-xs sm:text-sm font-extrabold text-[#16225E] leading-snug">{venueAddress}</div>
            </div>
            <div className="bg-[#FBF6EE] border border-[#E7E1D4] rounded-2xl p-6 text-center">
              <Headphones className="w-7 h-7 text-[#F0791E] mx-auto mb-2" />
              <div className="text-xs font-bold text-[#666C87] uppercase tracking-wider mb-1">Registration &amp; Queries</div>
              <a href={`tel:${helperPhone.replace(/\s/g, '')}`}
                className="inline-block text-base font-extrabold text-[#F0791E] hover:underline font-mono">
                {helperPhone}
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
                  desc: 'Check-in, seating, networking & refreshments'
                },
                {
                  time: '11:15 AM',
                  title: 'What is WeGrow B School',
                  desc: 'Student startup programs, mentors & how the community works'
                },
                {
                  time: '11:30 AM',
                  title: 'Student Founder Panel',
                  desc: 'Campus founders share how they built & scaled their ventures'
                },
                {
                  time: '12:15 PM',
                  title: 'Open Networking & Mentorship Clinic',
                  desc: 'Meet mentors, pitch ideas & connect with co-founders'
                },
                {
                  time: '12:45 PM',
                  title: 'Enrolment Desk Opens',
                  desc: "Sign up for the incubation program & community batches"
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

      {/* ── Gallery ────────────────────────────────────────────────────────── */}
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
              Highlights from previous WeGrow student startup meets, hackathons, and founder mentorship sessions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px] sm:auto-rows-[180px] lg:auto-rows-[200px]">
            {/* Featured Large Tile */}
            <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group shadow-md border border-[#E7E1D4] bg-[#EFE7D6]">
              <img
                src="/student_startup_founder.jpg"
                alt="Student Founders Community Meet"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1338]/85 via-[#0C1338]/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="bg-[#F0791E] text-[11px] font-bold uppercase px-2.5 py-1 rounded-full tracking-wider">
                  Student Startup Meet
                </span>
                <h4 className="font-extrabold text-base sm:text-lg mt-1.5 text-white">
                  Campus Idea Validation &amp; Pitch Sessions
                </h4>
              </div>
            </div>

            {/* Tile 2 */}
            <div className="relative rounded-2xl overflow-hidden group shadow-md border border-[#E7E1D4] bg-[#EFE7D6]">
              <img
                src="/Images/ai 1.jpeg"
                alt="AI &amp; Tech Entrepreneurship"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1338]/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <p className="font-bold text-xs sm:text-sm text-white line-clamp-1">AI &amp; Tech Track</p>
              </div>
            </div>

            {/* Tile 3 */}
            <div className="relative rounded-2xl overflow-hidden group shadow-md border border-[#E7E1D4] bg-[#EFE7D6]">
              <img
                src="/Images/tt 1.jpeg"
                alt="Mentor-Led Learning"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1338]/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <p className="font-bold text-xs sm:text-sm text-white line-clamp-1">Mentor-Led Masterclasses</p>
              </div>
            </div>

            {/* Tile 4 */}
            <div className="relative rounded-2xl overflow-hidden group shadow-md border border-[#E7E1D4] bg-[#EFE7D6]">
              <img
                src="/Images/iv 1.jpeg"
                alt="Industrial Exposure"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1338]/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <p className="font-bold text-xs sm:text-sm text-white line-clamp-1">Industrial Exposure &amp; Markets</p>
              </div>
            </div>

            {/* Tile 5 */}
            <div className="relative rounded-2xl overflow-hidden group shadow-md border border-[#E7E1D4] bg-[#EFE7D6]">
              <img
                src="/story/img1.png"
                alt="WeGrow Success Stories"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1338]/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <p className="font-bold text-xs sm:text-sm text-white line-clamp-1">Alumni Ventures &amp; Success</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4 lg:px-8 bg-white border-t border-[#E7E1D4]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="inline-block bg-[#16225E] text-white text-xs font-bold px-3.5 py-1.5 rounded-full">
              Student Success
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#16225E]">Hear From Student Founders</h2>
            <p className="text-[#666C87] text-sm sm:text-base">
              Real stories from students who started where you are today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-[#E7E1D4] rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:shadow-lg transition">
                <div className="space-y-4 mb-6">
                  <div className="flex gap-1 text-[#F0791E]">
                    {[...Array(5)].map((_, si) => <Star key={si} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-[#1B2140] text-sm sm:text-base italic leading-relaxed">"{t.quote}"</p>
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

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-[#E7E1D4] px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <span className="inline-flex items-center gap-2 bg-[#F0791E]/10 text-[#F0791E] font-bold text-xs px-3.5 py-1.5 rounded-full">
              <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-extrabold text-[#16225E]">Common Questions Answered</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-[#E7E1D4] rounded-2xl overflow-hidden bg-[#FBF6EE]">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full text-left p-5 sm:p-6 font-bold text-base text-[#16225E] flex justify-between items-center gap-4 hover:text-[#F0791E] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#F0791E] transition-transform duration-200 flex-shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-6 sm:px-6 text-sm text-[#666C87] leading-relaxed border-t border-[#E7E1D4]/60 pt-4 bg-white/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Registration Form ──────────────────────────────────────────────── */}
      <section id="register" className="py-20 px-4 lg:px-8 bg-gradient-to-b from-[#FBF6EE] to-[#F5ECE0]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-[#E7E1D4] p-8 sm:p-12 shadow-xl">
            <div className="text-center space-y-2 mb-8">
              <span className="inline-block bg-[#F0791E] text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full">
                Orientation Registration
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#16225E]">
                Secure Your Seat — 12 September 2026
              </h3>
              <p className="text-sm text-[#666C87]">
                Timing: 11:00 AM – 1:00 PM · Confirmation via WhatsApp / call on the number you provide.
              </p>
            </div>

            {registered ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-black text-emerald-900">Registration Confirmed!</h4>
                <p className="text-sm text-emerald-800 max-w-md mx-auto">
                  Thank you, <strong>{form.fullName}</strong>! Your seat is reserved for <strong>Sat, 12 Sep 2026 (11:00 AM – 1:00 PM)</strong> at {venueAddress}. Our team will reach out on WhatsApp (+91 {form.phone}) with details.
                </p>
                <button onClick={() => setRegistered(false)} className="text-xs font-bold text-emerald-700 underline hover:text-emerald-900 cursor-pointer">
                  Register another person
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#16225E] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Arjun Rajan"
                    className="w-full px-4 py-3 rounded-xl border border-[#E7E1D4] bg-[#FBF6EE] text-[#1B2140] text-sm focus:outline-none focus:ring-2 focus:ring-[#F0791E]"
                  />
                </div>

                {/* WhatsApp & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#16225E] mb-2">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-3 rounded-xl border border-[#E7E1D4] bg-[#FBF6EE] text-[#1B2140] text-sm focus:outline-none focus:ring-2 focus:ring-[#F0791E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#16225E] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="e.g. arjun@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#E7E1D4] bg-[#FBF6EE] text-[#1B2140] text-sm focus:outline-none focus:ring-2 focus:ring-[#F0791E]"
                    />
                  </div>
                </div>

                {/* College Name & Year of Study */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#16225E] mb-2">
                      College Name *
                    </label>
                    <input
                      type="text"
                      name="collegeName"
                      required
                      value={form.collegeName}
                      onChange={handleChange}
                      placeholder="e.g. Ayya Nadar Janaki Ammal College"
                      className="w-full px-4 py-3 rounded-xl border border-[#E7E1D4] bg-[#FBF6EE] text-[#1B2140] text-sm focus:outline-none focus:ring-2 focus:ring-[#F0791E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#16225E] mb-2">
                      Current Year of Study *
                    </label>
                    <select
                      name="yearOfStudy"
                      required
                      value={form.yearOfStudy}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[#E7E1D4] bg-[#FBF6EE] text-[#1B2140] text-sm focus:outline-none focus:ring-2 focus:ring-[#F0791E]"
                    >
                      <option value="">— Select Year of Study —</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year (Final Year)</option>
                      <option value="Post Graduate">Post Graduate (PG)</option>
                      <option value="Recent Graduate">Recent Graduate</option>
                    </select>
                  </div>
                </div>

                {/* Course Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#16225E] mb-2">
                    Course / Degree *
                  </label>
                  <input
                    type="text"
                    name="course"
                    required
                    value={form.course}
                    onChange={handleChange}
                    placeholder="e.g. B.Com, B.E CSE, B.Sc Maths, MBA"
                    className="w-full px-4 py-3 rounded-xl border border-[#E7E1D4] bg-[#FBF6EE] text-[#1B2140] text-sm focus:outline-none focus:ring-2 focus:ring-[#F0791E]"
                  />
                </div>

                {/* Course Start Year & Completion Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#16225E] mb-2">
                      Course Starting Year *
                    </label>
                    <input
                      type="number"
                      name="courseStartYear"
                      required
                      min="2018"
                      max="2030"
                      value={form.courseStartYear}
                      onChange={handleChange}
                      placeholder="e.g. 2023"
                      className="w-full px-4 py-3 rounded-xl border border-[#E7E1D4] bg-[#FBF6EE] text-[#1B2140] text-sm focus:outline-none focus:ring-2 focus:ring-[#F0791E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#16225E] mb-2">
                      Course Completion Year *
                    </label>
                    <input
                      type="number"
                      name="courseEndYear"
                      required
                      min="2020"
                      max="2035"
                      value={form.courseEndYear}
                      onChange={handleChange}
                      placeholder="e.g. 2026 or 2027"
                      className="w-full px-4 py-3 rounded-xl border border-[#E7E1D4] bg-[#FBF6EE] text-[#1B2140] text-sm focus:outline-none focus:ring-2 focus:ring-[#F0791E]"
                    />
                  </div>
                </div>

                {/* Questionnaire Section Divider */}
                <div className="pt-4 border-t border-[#E7E1D4]">
                  <h4 className="text-sm font-extrabold text-[#16225E] mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F0791E]" /> Entrepreneurial Readiness & Business Interest
                  </h4>
                  <div className="space-y-4">
                    {/* Q1: Readiness */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#16225E] mb-2">
                        1. Are you ready to begin your entrepreneurial journey?
                      </label>
                      <select
                        name="readiness"
                        value={form.readiness}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#E7E1D4] bg-[#FBF6EE] text-[#1B2140] text-sm focus:outline-none focus:ring-2 focus:ring-[#F0791E]"
                      >
                        <option value="">— Select an Option —</option>
                        <option value="Yes, I’m ready to start">Yes, I’m ready to start</option>
                        <option value="Yes, but I need guidance">Yes, but I need guidance</option>
                      </select>
                    </div>

                    {/* Q2: Business Idea */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#16225E] mb-2">
                        2. Do you currently have a business idea?
                      </label>
                      <select
                        name="hasIdea"
                        value={form.hasIdea}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#E7E1D4] bg-[#FBF6EE] text-[#1B2140] text-sm focus:outline-none focus:ring-2 focus:ring-[#F0791E]"
                      >
                        <option value="">— Select an Option —</option>
                        <option value="Yes, I have a clear idea">Yes, I have a clear idea</option>
                        <option value="I have a rough idea">I have a rough idea</option>
                        <option value="I have multiple ideas">I have multiple ideas</option>
                      </select>
                    </div>

                    {/* Q3: Seriousness / Timeline */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#16225E] mb-2">
                        3. How serious are you about starting your business?
                      </label>
                      <select
                        name="seriousness"
                        value={form.seriousness}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#E7E1D4] bg-[#FBF6EE] text-[#1B2140] text-sm focus:outline-none focus:ring-2 focus:ring-[#F0791E]"
                      >
                        <option value="">— Select an Option —</option>
                        <option value="I want to start soon">I want to start soon</option>
                        <option value="I plan to start within 6 months">I plan to start within 6 months</option>
                        <option value="I plan to start within 6–12 months">I plan to start within 6–12 months</option>
                      </select>
                    </div>

                    {/* Q4 & Q5 in 2 cols */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Q4: Looking for funding */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#16225E] mb-2">
                          4. Looking for funding or an investor?
                        </label>
                        <select
                          name="lookingForFunding"
                          value={form.lookingForFunding}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-[#E7E1D4] bg-[#FBF6EE] text-[#1B2140] text-sm focus:outline-none focus:ring-2 focus:ring-[#F0791E]"
                        >
                          <option value="">— Select —</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>

                      {/* Q5: Ready to learn */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#16225E] mb-2">
                          5. Ready to learn skills required?
                        </label>
                        <select
                          name="readyToLearn"
                          value={form.readyToLearn}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-[#E7E1D4] bg-[#FBF6EE] text-[#1B2140] text-sm focus:outline-none focus:ring-2 focus:ring-[#F0791E]"
                        >
                          <option value="">— Select —</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </div>

                    {/* Q6: Industry Niche */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#16225E] mb-2">
                        6. Which industry niche is your business idea related to?
                      </label>
                      <select
                        name="industryNiche"
                        value={form.industryNiche}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#E7E1D4] bg-[#FBF6EE] text-[#1B2140] text-sm focus:outline-none focus:ring-2 focus:ring-[#F0791E]"
                      >
                        <option value="">— Select Industry Niche —</option>
                        <option value="Technology / IT">Technology / IT</option>
                        <option value="E-commerce / D2C">E-commerce / D2C</option>
                        <option value="Food & Beverage">Food & Beverage</option>
                        <option value="Education">Education</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Fashion / Lifestyle">Fashion / Lifestyle</option>
                        <option value="Agriculture">Agriculture</option>
                        <option value="Media / Content">Media / Content</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#F0791E] hover:bg-[#D9600B] text-white font-black text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? 'Submitting…' : (
                    <><Send className="w-5 h-5" /> Register Now</>
                  )}
                </button>

                <p className="text-center text-xs text-[#666C87] pt-1">
                  🔒 We respect your privacy. No spam. You will only receive event confirmation and venue details.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Shared Footer ──────────────────────────────────────────────────── */}
      <CommunityPageFooter
        eventLabel="Student Founders Orientation 2026"
        eventDate="Sat, 12 Sep 2026"
        eventTime="11:00 AM – 1:00 PM"
        venueAddress={venueAddress}
        queriesPhone={helperPhone}
        registerSectionId="register"
      />
    </div>
  );
}
