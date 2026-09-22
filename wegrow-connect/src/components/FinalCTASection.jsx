import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function FinalCTASection({
  ctaTargetRef,
  ctaStyle,
  scrollToCourses,
  scrollToContact,
  onOpenEnquiry
}) {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleBecomeMember = (e) => {
    e.preventDefault();
    if (onOpenEnquiry) {
      onOpenEnquiry();
    } else {
      navigate('/home/login/option');
    }
  };

  const handleExploreProgrammes = (e) => {
    e.preventDefault();
    if (scrollToCourses) {
      scrollToCourses();
    } else {
      const el = document.getElementById('programmes') || document.getElementById('workshops');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTalkToUs = (e) => {
    e.preventDefault();
    if (scrollToContact) {
      scrollToContact();
    } else {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* SVG Sprite Definition for #i-arrow */}
      <svg className="hidden" aria-hidden="true" style={{ display: 'none' }}>
        <defs>
          <symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </symbol>
        </defs>
      </svg>

      {/* ============ FINAL CTA ============ */}
      <section
        ref={ctaTargetRef}
        id="cta"
        style={ctaStyle}
        className="final-cta relative py-20 sm:py-28 md:py-32 px-4 sm:px-6 md:px-8 overflow-hidden transition-all duration-500"
      >
        {/* Ambient background glow and decorative ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-4xl h-[320px] bg-gradient-to-tr from-[#104288]/15 via-[#f3a812]/15 to-[#FF6A45]/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none" />

        <div className="wrap max-w-4xl mx-auto flex flex-col items-center justify-center text-center relative z-10">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] mb-4 sm:mb-6 shadow-xs border bg-amber-400/10 border-amber-500/30 text-amber-600 dark:text-[#FFC862]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f3a812] animate-ping" />
            <p className="fc-eyebrow">Your business has a next level.</p>
          </div>

          {/* Title */}
          <h2 className="h-display fc-title font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08] mb-8 sm:mb-10 max-w-2xl">
            Are you ready<br />to build it?
          </h2>

          {/* Primary Action Button */}
          <a
            href="#join"
            onClick={handleBecomeMember}
            className="btn btn-primary fc-btn js-open-enquiry group relative inline-flex items-center gap-3.5 px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-gradient-to-r from-[#104288] via-[#175bb8] to-[#104288] hover:from-[#0c336b] hover:to-[#0c336b] text-white font-extrabold text-sm sm:text-base md:text-lg tracking-wide shadow-[0_12px_36px_rgba(16,66,136,0.38)] hover:shadow-[0_18px_48px_rgba(16,66,136,0.55)] hover:-translate-y-1 active:scale-95 transition-all duration-300 border border-white/20 cursor-pointer"
          >
            <span>Become a WeGrow Member</span>
            <svg className="icon w-5 h-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1.5">
              <use href="#i-arrow" />
            </svg>
          </a>

          {/* Secondary Links */}
          <div className="fc-links mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300">
            <a
              href="#programmes"
              onClick={handleExploreProgrammes}
              className="hover:text-[#104288] dark:hover:text-[#FFC862] transition-colors duration-200 underline decoration-slate-300/80 dark:decoration-slate-700 underline-offset-4 hover:decoration-[#104288] dark:hover:decoration-[#FFC862] cursor-pointer"
            >
              Explore Programmes
            </a>
            <span className="text-slate-400 dark:text-slate-600 font-bold select-none">·</span>
            <a
              href="#contact"
              onClick={handleTalkToUs}
              className="js-open-enquiry hover:text-[#104288] dark:hover:text-[#FFC862] transition-colors duration-200 underline decoration-slate-300/80 dark:decoration-slate-700 underline-offset-4 hover:decoration-[#104288] dark:hover:decoration-[#FFC862] cursor-pointer"
            >
              Talk to Us
            </a>
          </div>

        </div>
      </section>
    </>
  );
}
