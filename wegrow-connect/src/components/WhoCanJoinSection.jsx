import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function WhoCanJoinSection({ whoCanJoinTargetRef, whoCanJoinStyle, onOpenEnquiry }) {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleEnquiry = (e) => {
    if (e) e.preventDefault();
    if (onOpenEnquiry) {
      onOpenEnquiry();
    } else {
      navigate('/home/login/option');
    }
  };

  const audiences = [
    {
      id: 'aud-1',
      className: 'aud-card aud-1',
      iconId: '#i-spark',
      title: 'Women Entrepreneurs',
      badge: 'Incubate & Scale',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      tagline: "You've built your business. Now build your next level.",
      description: 'Peer masterminds, scaling frameworks, digital marketing power, and executive coaching tailored for women-led ventures.',
      accentGradient: 'from-pink-500/10 via-rose-500/5 to-transparent',
      hoverBorder: 'hover:border-rose-400/50',
      glowColor: 'group-hover:shadow-[0_12px_40px_rgba(244,63,94,0.18)]',
      route: '/womens-community',
      ctaText: 'Explore Women’s Community'
    },
    {
      id: 'aud-2',
      className: 'aud-card aud-2',
      iconId: '#i-brief',
      title: 'Business Owners',
      badge: 'Systems & Growth',
      badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
      tagline: 'Strengthen your business. Build your team. Prepare for growth.',
      description: 'Business Dependency Diagnostics (BDT), SOP design, leadership delegation, and structured business coaching.',
      accentGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
      hoverBorder: 'hover:border-amber-400/50',
      glowColor: 'group-hover:shadow-[0_12px_40px_rgba(245,158,11,0.18)]',
      route: '/business-founders',
      ctaText: 'Explore Business Founders'
    },
    {
      id: 'aud-3',
      className: 'aud-card aud-3',
      iconId: '#i-compass',
      title: 'Students & Aspiring Founders',
      badge: '0-to-1 Launchpad',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      tagline: 'Take your idea from imagination to execution.',
      description: 'Real-world tech stacks, business plan modeling, founder pitch days, and incubation support to turn dreams into ventures.',
      accentGradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
      hoverBorder: 'hover:border-blue-400/50',
      glowColor: 'group-hover:shadow-[0_12px_40px_rgba(59,130,246,0.18)]',
      route: '/student-founders',
      ctaText: 'Explore Student Hub'
    }
  ];

  return (
    <>
      {/* Embedded SVG sprite symbols for #i-spark, #i-brief, #i-compass, #i-arrow */}
      <svg xmlns="http://www.w3.org/2000/svg" className="hidden" aria-hidden="true">
        <defs>
          <symbol id="i-spark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            <polygon points="12 8 13.5 11 16.5 12 13.5 13 12 16 10.5 13 7.5 12 10.5 11 12 8" fill="currentColor" fillOpacity="0.3" />
          </symbol>
          <symbol id="i-brief" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            <line x1="12" y1="12" x2="12" y2="12.01" />
          </symbol>
          <symbol id="i-compass" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fillOpacity="0.3" />
          </symbol>
          <symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </symbol>
        </defs>
      </svg>

      {/* ============ WHO CAN JOIN ============ */}
      <section
        className="audience relative z-10 transition-all duration-700 py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-8"
        id="audience"
        ref={whoCanJoinTargetRef}
        style={whoCanJoinStyle}
      >
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[1100px] h-[500px] bg-radial from-blue-500/5 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="wrap max-w-7xl mx-auto w-full relative z-10">
          
          {/* SECTION HEAD */}
          <div className="section-head center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest mb-4 shadow-xs border bg-amber-400/10 border-amber-500/30 text-amber-600 dark:text-[#FFC862]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f3a812] animate-ping" />
              <p className="eyebrow on-light">Who can join</p>
            </div>

            <h2 className="h-display font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Wherever your journey begins,<br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#104288] via-[#0c336b] to-[#f3a812] dark:from-[#93c5fd] dark:via-[#FFC862] dark:to-[#fbbf24] bg-clip-text text-transparent">
                there's a place for you here.
              </span>
            </h2>

            <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
              Whether you are scaling an established business, leading a woman-owned enterprise, or launching your very first startup idea as a student.
            </p>
          </div>

          {/* AUDIENCE GRID */}
          <div className="aud-grid grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {audiences.map((aud) => (
              <div
                key={aud.id}
                onClick={() => navigate(aud.route)}
                className={`${aud.className} group relative flex flex-col justify-between p-7 sm:p-8 rounded-3xl cursor-pointer transition-all duration-300 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0c1f38]/70 hover:-translate-y-2 ${aud.hoverBorder} ${aud.glowColor}`}
              >
                {/* Ambient Card Background Gradient */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-b ${aud.accentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                <div className="relative z-10">
                  {/* Card Top: Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="aud-icon w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200/80 dark:from-white/10 dark:to-white/5 border border-slate-200 dark:border-white/15 text-[#104288] dark:text-[#FFC862] shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      <svg className="icon w-7 h-7">
                        <use href={aud.iconId} />
                      </svg>
                    </span>

                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${aud.badgeColor}`}>
                      {aud.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white group-hover:text-[#104288] dark:group-hover:text-[#FFC862] transition-colors mb-2.5 leading-snug">
                    {aud.title}
                  </h3>

                  <p className="text-sm sm:text-[15px] font-semibold text-slate-700 dark:text-slate-200 leading-relaxed mb-3">
                    {aud.tagline}
                  </p>

                  <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                    {aud.description}
                  </p>
                </div>

                {/* Card Footer: Action Link */}
                <div className="relative z-10 pt-6 mt-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-bold text-[#104288] dark:text-[#FFC862]">
                  <span className="group-hover:underline underline-offset-4">{aud.ctaText}</span>
                  <span className="w-8 h-8 rounded-full bg-blue-50 dark:bg-white/10 flex items-center justify-center group-hover:translate-x-1.5 transition-transform duration-200">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <use href="#i-arrow" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* AUDIENCE CTA */}
          <div className="aud-cta mt-12 sm:mt-16 text-center">
            <a
              href="#enquiry"
              onClick={handleEnquiry}
              className="btn btn-primary js-open-enquiry inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#104288] hover:bg-[#0c336b] text-white font-bold text-sm sm:text-base tracking-wide shadow-[0_10px_30px_rgba(16,66,136,0.35)] hover:shadow-[0_14px_40px_rgba(16,66,136,0.5)] hover:-translate-y-1 active:scale-95 transition-all duration-300 cursor-pointer border border-white/20"
            >
              <span>Find Your WeGrow Journey</span>
              <svg className="icon w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1">
                <use href="#i-arrow" />
              </svg>
            </a>

            <p className="mt-3.5 text-xs text-slate-500 dark:text-slate-400">
              Free 1-on-1 discovery consultation • No commitment required
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
