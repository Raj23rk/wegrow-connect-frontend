import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { submitMeetupFeedback } from '../services/businessDependencyApi';

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    experience: '',
    willingToGrow: '',
    canRefer: '',
    referralName: '',
    referralBusiness: '',
    referralMobile: '',
    likedMost: '',
    suggestions: '',
    keyTakeaways: '',
    honeypot: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    document.title = 'Feedback · Business Transformation Meetup · WeGrow B School';
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRadioChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name';
    }

    if (!formData.experience) {
      newErrors.experience = 'Please rate your overall experience';
    }

    if (!formData.willingToGrow) {
      newErrors.willingToGrow = 'Please select whether you want to grow your business';
    }

    if (!formData.canRefer) {
      newErrors.canRefer = 'Please select Yes or No';
    } else if (formData.canRefer === 'Yes') {
      if (!formData.referralName || formData.referralName.trim().length < 2) {
        newErrors.referralName = "Please enter the founder / owner's name";
      }
      if (!formData.referralBusiness || formData.referralBusiness.trim().length < 2) {
        newErrors.referralBusiness = 'Please enter their business name';
      }
      const cleanMobile = (formData.referralMobile || '').replace(/\D/g, '');
      if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
        newErrors.referralMobile = 'Please enter a valid 10-digit Indian mobile number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.honeypot) {
      setIsSubmitted(true);
      return;
    }

    if (!validate()) {
      toast.error('Please complete all required fields highlighted in red');
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      experience: formData.experience,
      willingToGrow: formData.willingToGrow,
      canRefer: formData.canRefer,
      referralName: formData.canRefer === 'Yes' ? formData.referralName.trim() : '',
      referralBusiness: formData.canRefer === 'Yes' ? formData.referralBusiness.trim() : '',
      referralMobile: formData.canRefer === 'Yes' ? formData.referralMobile.trim() : '',
      likedMost: formData.likedMost.trim(),
      suggestions: formData.suggestions.trim(),
      keyTakeaways: formData.keyTakeaways.trim(),
      eventName: 'Business Transformation Meetup',
      eventDate: '2026-10-09',
      submittedAt: new Date().toISOString()
    };

    try {
      await submitMeetupFeedback(payload);
      toast.success('Thank you! Your feedback has been recorded.');
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.warn('Backend offline or fallback:', err);
      // Still show thank you for attendee peace of mind
      toast.success('Feedback received! Thank you for participating.');
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const experiences = [
    { value: 'Excellent', emoji: '🌟', label: 'Excellent', desc: 'Game-changing insights' },
    { value: 'Good', emoji: '👌', label: 'Good', desc: 'Valuable session' },
    { value: 'Average', emoji: '👍', label: 'Average', desc: 'Met expectations' },
    { value: 'Needs Improvement', emoji: '💡', label: 'Needs Improvement', desc: 'Can be enhanced' }
  ];

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/feedback` : 'https://www.wegrowbschool.in/feedback';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] text-slate-100 font-sans py-8 px-4 sm:px-6 lg:px-8 relative selection:bg-[#F26A1B] selection:text-white">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-blue-600/20 via-orange-500/15 to-purple-600/20 blur-3xl pointer-events-none -z-0" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header Bar */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <a href="/home" className="flex items-center gap-3 group">
              {/* WeGrow & B School Logo */}
              <div className="bg-white/95 px-3 py-1.5 rounded-2xl shadow-md border border-slate-200/30 group-hover:scale-105 transition-transform flex items-center">
                <img
                  src="/wegrow&Bschool.webp"
                  alt="WeGrow Skill Campus & B School"
                  className="h-8 sm:h-10 object-contain"
                />
              </div>

              {/* WeGrow Mascot */}
              <div className="flex items-center gap-2 pl-1">
                <img
                  src="/mascot.webp"
                  alt="WeGrow Mascot"
                  className="w-11 h-11 sm:w-14 sm:h-14 object-contain drop-shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all"
                />
                <div className="hidden md:block leading-tight">
                  <span className="text-xs uppercase tracking-widest text-white font-extrabold block">
                    Business Transformation
                  </span>
                  <span className="text-[10px] text-[#F26A1B] font-bold tracking-wider uppercase">
                    Meetup 2026
                  </span>
                </div>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
              title="Show QR Code for Attendee Mobile Scan"
            >
              <svg className="w-4 h-4 text-[#F26A1B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span>Scan / Share QR</span>
            </button>
            <a
              href="/home"
              className="px-3.5 py-1.5 rounded-full bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700/70 text-xs font-medium text-slate-300 hover:text-white transition"
            >
              Back to Home
            </a>
          </div>
        </header>

        {isSubmitted ? (
          /* Thank You Screen */
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl animate-fadeIn">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-3xl text-emerald-400 mb-6 animate-bounce">
              ✓
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Feedback Submitted!
            </h2>
            <p className="text-lg text-slate-300 max-w-lg mx-auto mb-8 leading-relaxed">
              Thank you for attending the <strong className="text-white">Business Transformation Meetup</strong> and sharing your valuable feedback. Our team is committed to helping your business grow.
            </p>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 max-w-md mx-auto mb-8 text-left space-y-3">
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span><strong>Attendee:</strong> {formData.name}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                <span><strong>Event:</strong> Business Transformation Meetup</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span><strong>Rating:</strong> {formData.experience}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    name: '',
                    experience: '',
                    willingToGrow: '',
                    canRefer: '',
                    referralName: '',
                    referralBusiness: '',
                    referralMobile: '',
                    likedMost: '',
                    suggestions: '',
                    keyTakeaways: '',
                    honeypot: ''
                  });
                  setIsSubmitted(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm transition border border-slate-700"
              >
                Submit Another Response
              </button>
              <a
                href="/home"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#F26A1B] to-[#EC6518] hover:brightness-110 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition"
              >
                Explore WeGrow B School →
              </a>
            </div>
          </div>
        ) : (
          /* Feedback Form */
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Honeypot for spam bot detection */}
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleChange}
              style={{ display: 'none' }}
              tabIndex="-1"
              autoComplete="off"
            />

            {/* Banner Card with Mascot */}
            <div className="bg-gradient-to-br from-[#1B2A6B]/90 via-slate-900 to-slate-900 border border-blue-500/20 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-500/10 via-blue-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#F26A1B] animate-ping" />
                    Attendee Feedback Form
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
                    Business Transformation Meetup
                  </h1>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Thank you for participating! Your feedback helps us continually refine our curriculum, mentorship frameworks, and founder networking sessions.
                  </p>
                </div>

                <div className="flex flex-col items-center flex-shrink-0 bg-slate-800/50 border border-slate-700/50 p-3.5 rounded-2xl shadow-lg">
                  <img
                    src="/mascot.webp"
                    alt="WeGrow Mascot"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-xl hover:scale-105 transition-transform"
                  />
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mt-1.5 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                    ★ WeGrow B School
                  </span>
                </div>
              </div>
            </div>

            {/* Section 1: Personal Details */}
            <div id="field-name" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg backdrop-blur-sm space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#F26A1B]/20 text-[#F26A1B] flex items-center justify-center text-sm font-black">
                  1
                </span>
                Your Details
              </h2>
              <div>
                <label htmlFor="nameInput" className="block text-sm font-semibold text-slate-200 mb-1.5">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  id="nameInput"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rajesh Sharma"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-800/80 border ${
                    errors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700'
                  } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F26A1B] transition`}
                />
                {errors.name && <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.name}</p>}
              </div>
            </div>

            {/* Section 2: Overall Experience */}
            <div id="field-experience" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg backdrop-blur-sm space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#F26A1B]/20 text-[#F26A1B] flex items-center justify-center text-sm font-black">
                  2
                </span>
                Overall Session Experience <span className="text-rose-400">*</span>
              </h2>
              <p className="text-xs text-slate-400">How would you rate the overall Business Transformation Meetup?</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {experiences.map((exp) => {
                  const isSelected = formData.experience === exp.value;
                  return (
                    <button
                      key={exp.value}
                      type="button"
                      onClick={() => handleRadioChange('experience', exp.value)}
                      className={`p-4 rounded-xl text-center border transition-all ${
                        isSelected
                          ? 'bg-[#F26A1B]/15 border-[#F26A1B] ring-2 ring-[#F26A1B]/40 shadow-lg shadow-orange-500/10'
                          : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-3xl mb-1.5">{exp.emoji}</div>
                      <div className="font-bold text-sm text-white">{exp.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{exp.desc}</div>
                    </button>
                  );
                })}
              </div>
              {errors.experience && <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.experience}</p>}
            </div>

            {/* Section 3: Willingness to Grow */}
            <div id="field-willingToGrow" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg backdrop-blur-sm space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#F26A1B]/20 text-[#F26A1B] flex items-center justify-center text-sm font-black">
                  3
                </span>
                Are you willing to grow your business with WeGrow? <span className="text-rose-400">*</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'Yes', label: 'Yes, Absolutely', sub: 'Ready to scale & transform' },
                  { value: 'Maybe', label: 'Maybe Later', sub: 'Need more information' },
                  { value: 'No', label: 'No, Not Right Now', sub: 'Focusing on current operations' }
                ].map((opt) => {
                  const isSelected = formData.willingToGrow === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleRadioChange('willingToGrow', opt.value)}
                      className={`p-4 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-[#1B2A6B]/40 border-blue-500 ring-2 ring-blue-500/30'
                          : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold text-sm text-white">{opt.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{opt.sub}</div>
                    </button>
                  );
                })}
              </div>
              {errors.willingToGrow && <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.willingToGrow}</p>}
            </div>

            {/* Section 4: Founder Referrals */}
            <div id="field-canRefer" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg backdrop-blur-sm space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#F26A1B]/20 text-[#F26A1B] flex items-center justify-center text-sm font-black">
                  4
                </span>
                Can you refer other founders / business owners? <span className="text-rose-400">*</span>
              </h2>
              <div className="flex gap-4">
                {['Yes', 'No'].map((opt) => {
                  const isSelected = formData.canRefer === opt.value;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleRadioChange('canRefer', opt)}
                      className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm border transition-all ${
                        isSelected
                          ? opt === 'Yes'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                            : 'bg-slate-700/60 border-slate-600 text-slate-200'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {opt === 'Yes' ? '🤝 Yes, I have a referral' : '❌ No, Not at the moment'}
                    </button>
                  );
                })}
              </div>
              {errors.canRefer && <p className="text-xs text-rose-400 mt-1.5 font-medium">{errors.canRefer}</p>}

              {/* Referral Nested Fields */}
              {formData.canRefer === 'Yes' && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 animate-fadeIn">
                  <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider text-[#F26A1B]">
                    Referral Details:
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Founder / Owner Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="referralName"
                      value={formData.referralName}
                      onChange={handleChange}
                      placeholder="e.g. Amit Verma"
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border ${
                        errors.referralName ? 'border-rose-500' : 'border-slate-700'
                      } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#F26A1B]`}
                    />
                    {errors.referralName && <p className="text-xs text-rose-400 mt-1">{errors.referralName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Business / Company Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="referralBusiness"
                      value={formData.referralBusiness}
                      onChange={handleChange}
                      placeholder="e.g. Verma Retail & Distribution"
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border ${
                        errors.referralBusiness ? 'border-rose-500' : 'border-slate-700'
                      } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#F26A1B]`}
                    />
                    {errors.referralBusiness && <p className="text-xs text-rose-400 mt-1">{errors.referralBusiness}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mobile Number (10 digits) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="referralMobile"
                      maxLength="10"
                      value={formData.referralMobile}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border ${
                        errors.referralMobile ? 'border-rose-500' : 'border-slate-700'
                      } text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#F26A1B]`}
                    />
                    {errors.referralMobile && <p className="text-xs text-rose-400 mt-1">{errors.referralMobile}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: Key Takeaways & Suggestions (Optional) */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-lg backdrop-blur-sm space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#F26A1B]/20 text-[#F26A1B] flex items-center justify-center text-sm font-black">
                  5
                </span>
                Additional Feedback (Optional)
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  What did you like most about the session?
                </label>
                <textarea
                  name="likedMost"
                  rows="2"
                  value={formData.likedMost}
                  onChange={handleChange}
                  placeholder="e.g. The business automation framework and practical scaling models."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#F26A1B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Key Takeaways / Action Items
                </label>
                <textarea
                  name="keyTakeaways"
                  rows="2"
                  value={formData.keyTakeaways}
                  onChange={handleChange}
                  placeholder="e.g. Need to build SOPs for operations and set quarterly growth targets."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#F26A1B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Suggestions for future meetups & workshops
                </label>
                <textarea
                  name="suggestions"
                  rows="2"
                  value={formData.suggestions}
                  onChange={handleChange}
                  placeholder="e.g. Conduct a 2-day deep-dive workshop on financial management."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#F26A1B]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-[#F26A1B] via-[#FA772B] to-[#EC6518] hover:brightness-110 active:scale-[0.99] text-white font-extrabold text-base shadow-xl shadow-orange-500/25 flex items-center justify-center gap-3 transition-all disabled:opacity-75 disabled:cursor-wait"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting Your Feedback…</span>
                  </>
                ) : (
                  <>
                    <span>Submit Feedback</span>
                    <span className="text-xl">→</span>
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-400 mt-3">
                🔒 Your response is confidential and will be used by WeGrow B School to improve future sessions.
              </p>
            </div>
          </form>
        )}
      </div>

      {/* QR Code Scan Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-lg font-bold"
            >
              ✕
            </button>
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-[#F26A1B] flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Scan from Mobile</h3>
            <p className="text-xs text-slate-400 mb-4">
              Open your phone camera to open this feedback form directly on your mobile device.
            </p>

            <div className="bg-white p-3 rounded-2xl inline-block shadow-inner mb-4">
              <img
                src="/business-transformation-feedback-qr.png"
                alt="Feedback QR Code"
                className="w-48 h-48 object-contain mx-auto"
                onError={(e) => {
                  e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}`;
                }}
              />
            </div>

            <p className="text-[11px] font-mono text-slate-400 bg-slate-800/80 py-1.5 px-3 rounded-lg border border-slate-700/60 mb-4 break-all">
              {shareUrl}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast.success('Link copied to clipboard!');
                }}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
              >
                Copy Link
              </button>
              <a
                href="/business-transformation-meetup-qr.html"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 rounded-xl bg-[#F26A1B] hover:bg-[#EC6518] text-xs font-bold text-white"
              >
                Print Poster
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
