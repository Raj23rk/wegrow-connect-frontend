import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function WhyWeGrowSection({ whyWeGrowTargetRef, whyWeGrowStyle }) {
  const { isDarkMode } = useTheme();
  const [hoveredWord, setHoveredWord] = useState(null);

  const loopItems = [
    {
      index: '01',
      iconId: '#i-cap',
      name: 'Learn',
      desc: 'Knowledge that matters.',
      accent: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      index: '02',
      iconId: '#i-tool',
      name: 'Apply',
      desc: 'Take it into your business.',
      accent: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      index: '03',
      iconId: '#i-handshake',
      name: 'Connect',
      desc: 'Meet people who can move you forward.',
      accent: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      index: '04',
      iconId: '#i-chart',
      name: 'Grow',
      desc: "Build what's next.",
      accent: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20'
    }
  ];

  const philosophyWords = ['Think.', 'Learn.', 'Do.', 'Measure.', 'Improve.', 'Grow.'];

  const pathItems = [
    {
      iconId: '#i-cap',
      title: 'Learn',
      desc: 'Business knowledge from faculty and experts.',
      step: 'Step 01'
    },
    {
      iconId: '#i-tool',
      title: 'Apply',
      desc: 'Turn every learning into an action.',
      step: 'Step 02'
    },
    {
      iconId: '#i-target',
      title: 'Challenge',
      desc: 'Work on real business problems.',
      step: 'Step 03'
    },
    {
      iconId: '#i-mentor',
      title: 'Get guided',
      desc: 'Learn with mentors and faculty.',
      step: 'Step 04'
    },
    {
      iconId: '#i-handshake',
      title: 'Connect',
      desc: 'Build relationships with entrepreneurs.',
      step: 'Step 05'
    },
    {
      iconId: '#i-chart',
      title: 'Grow',
      desc: 'Track your progress and keep improving.',
      step: 'Step 06'
    }
  ];

  return (
    <div ref={whyWeGrowTargetRef} style={whyWeGrowStyle} className="transition-all duration-700 relative z-10">
      {/* Embedded SVG sprite symbols */}
      <svg xmlns="http://www.w3.org/2000/svg" className="hidden" aria-hidden="true">
        <defs>
          <symbol id="i-cap" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </symbol>
          <symbol id="i-tool" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </symbol>
          <symbol id="i-handshake" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
            <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.7-2.8l-1.3 1.2" />
            <path d="m2 13 6 6" />
            <path d="m20 9 2 2" />
          </symbol>
          <symbol id="i-chart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
            <path d="M3 20h18" />
          </symbol>
          <symbol id="i-target" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </symbol>
          <symbol id="i-mentor" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </symbol>
        </defs>
      </svg>

      {/* ============ WHAT IS WEGROW ============ */}
      <section className="what py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 border-t border-slate-200/60 dark:border-white/10" id="what">
        <div className="wrap what-grid max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* SECTION HEAD */}
          <div className="section-head lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest mb-4 shadow-xs border bg-amber-400/10 border-amber-500/30 text-amber-600 dark:text-[#FFC862]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f3a812] animate-pulse" />
              <p className="eyebrow on-light">More than a B-School</p>
            </div>

            <h2 className="h-display font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              A place where<br />
              <span className="bg-gradient-to-r from-[#104288] via-[#0c336b] to-[#f3a812] dark:from-[#93c5fd] dark:via-[#FFC862] dark:to-[#fbbf24] bg-clip-text text-transparent">
                businesses grow.
              </span>
            </h2>

            <p className="lede mt-5 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              WeGrow isn't about learning business theory — it's about building better businesses. Courses, mentoring, challenges and a community that turns learning into action, and action into growth.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2 overflow-hidden">
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#061325] bg-blue-600 text-white text-xs font-bold flex items-center justify-center">5k+</span>
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#061325] bg-amber-500 text-white text-xs font-bold flex items-center justify-center">300+</span>
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#061325] bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">98%</span>
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Alumni, Founders & Industry Partners
              </span>
            </div>
          </div>

          {/* THE 4-STEP LOOP */}
          <div className="loop lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {loopItems.map((item) => (
              <div
                key={item.index}
                className="loop-item group relative p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0c1f38]/60 backdrop-blur-xl shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="loop-index text-xs font-black tracking-widest text-slate-400 dark:text-slate-500 font-mono">
                    {item.index}
                  </span>
                  <span className={`loop-icon w-11 h-11 rounded-xl flex items-center justify-center border shadow-xs transition-transform duration-300 group-hover:scale-110 ${item.accent}`}>
                    <svg className="icon w-5 h-5">
                      <use href={item.iconId} />
                    </svg>
                  </span>
                </div>

                <div>
                  <h3 className="loop-name text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-white group-hover:text-[#104288] dark:group-hover:text-[#FFC862] transition-colors mb-1.5">
                    {item.name}
                  </h3>
                  <p className="loop-desc text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center text-[11px] font-bold text-[#104288] dark:text-[#FFC862] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Continuous Ecosystem Loop</span>
                  <span className="ml-1">➔</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============ PHILOSOPHY ============ */}
      <section className="philosophy py-16 sm:py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-transparent via-slate-100/50 to-transparent dark:via-white/[0.02]" id="philosophy">
        <div className="wrap max-w-5xl mx-auto text-center">
          
          <p className="philosophy-lead text-sm sm:text-base md:text-lg font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">
            A business doesn't grow by learning alone.
          </p>

          <div
            id="philosophyWords"
            className="philosophy-words flex flex-wrap items-center justify-center gap-3 sm:gap-5 md:gap-8 my-4 sm:my-6"
          >
            {philosophyWords.map((word, wIdx) => {
              const isAccent = word.toLowerCase().includes('grow');
              const isHovered = hoveredWord === wIdx;
              return (
                <span
                  key={wIdx}
                  onMouseEnter={() => setHoveredWord(wIdx)}
                  onMouseLeave={() => setHoveredWord(null)}
                  className={`pw font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight cursor-default transition-all duration-300 select-none ${
                    isAccent
                      ? 'pw-accent text-[#f3a812] dark:text-[#FFC862] scale-105 drop-shadow-sm'
                      : isHovered
                      ? 'text-[#104288] dark:text-white scale-110 -translate-y-1'
                      : 'text-slate-400 dark:text-slate-600 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </div>

          <p className="philosophy-final mt-6 text-sm sm:text-base md:text-lg font-semibold text-slate-700 dark:text-slate-300 italic font-serif">
            That's the WeGrow way.
          </p>

        </div>
      </section>

      {/* ============ WHY WEGROW ============ */}
      <section className="why py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8" id="why">
        <div className="wrap max-w-7xl mx-auto w-full">
          
          {/* SECTION HEAD */}
          <div className="section-head center text-center max-w-3xl mx-auto mb-14 sm:mb-18">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest mb-4 shadow-xs border bg-blue-500/10 border-blue-500/30 text-[#104288] dark:text-blue-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#104288] dark:bg-blue-400 animate-ping" />
              <p className="eyebrow on-light">Why WeGrow</p>
            </div>

            <h2 className="h-display font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Because growth needs<br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#104288] via-[#0c336b] to-[#f3a812] dark:from-[#93c5fd] dark:via-[#FFC862] dark:to-[#fbbf24] bg-clip-text text-transparent">
                more than a classroom.
              </span>
            </h2>
          </div>

          {/* PATHWAY / CARDS GRID */}
          <div className="path relative">
            <div className="path-line hidden lg:block absolute top-1/2 left-8 right-8 h-[2px] bg-gradient-to-r from-blue-500/20 via-amber-500/30 to-emerald-500/20 -translate-y-1/2 z-0" aria-hidden="true" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {pathItems.map((item, idx) => (
                <div
                  key={idx}
                  className="path-item group relative p-7 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0c1f38]/70 backdrop-blur-xl shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Node & Step badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="path-node w-13 h-13 rounded-2xl flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200/80 dark:from-white/10 dark:to-white/5 border border-slate-200 dark:border-white/15 text-[#104288] dark:text-[#FFC862] shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <svg className="icon w-6 h-6">
                          <use href={item.iconId} />
                        </svg>
                      </div>

                      <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400">
                        {item.step}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="path-card">
                      <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white group-hover:text-[#104288] dark:group-hover:text-[#FFC862] transition-colors mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 group-hover:text-[#104288] dark:group-hover:text-[#FFC862] transition-colors">
                    <span>Explore Methodology</span>
                    <span className="group-hover:translate-x-1 transition-transform">➔</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
