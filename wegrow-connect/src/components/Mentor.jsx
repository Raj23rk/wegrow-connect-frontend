import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Mentor({ mentorTargetRef, mentorStyle }) {
  const { isDarkMode } = useTheme();
  const [hasAnimated, setHasAnimated] = useState(false);

  const impactData = [
    { target: 500, suffix: '+', label: 'Entrepreneurs', icon: '🚀' },
    { target: 100, suffix: '+', label: 'Businesses', icon: '🏢' },
    { target: 20, suffix: '+', label: 'Industries', icon: '🌐' },
    { target: 1000, suffix: '+', label: 'Learning hours', icon: '⏳' },
    { target: 500, suffix: '+', label: 'Growth challenges', icon: '🎯' }
  ];

  const [counts, setCounts] = useState(impactData.map(() => 0));
  const containerRef = useRef(null);

  // Counter animation when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1800;
          const frameDuration = 1000 / 60;
          const totalFrames = Math.round(duration / frameDuration);

          let frame = 0;
          const timer = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            // Ease out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);

            setCounts(
              impactData.map((item) => Math.round(item.target * easeOutProgress))
            );

            if (frame === totalFrames) {
              clearInterval(timer);
              setCounts(impactData.map((item) => item.target));
            }
          }, frameDuration);
        }
      },
      { threshold: 0.2 }
    );

    const target = containerRef.current || mentorTargetRef?.current;
    if (target) observer.observe(target);

    return () => observer.disconnect();
  }, [hasAnimated, mentorTargetRef]);

  return (
    /* ============ IMPACT ============ */
    <section
      ref={(el) => {
        containerRef.current = el;
        if (mentorTargetRef) {
          if (typeof mentorTargetRef === 'function') {
            mentorTargetRef(el);
          } else {
            mentorTargetRef.current = el;
          }
        }
      }}
      id="impact"
      style={mentorStyle}
      className="impact relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 transition-all duration-500 overflow-hidden"
    >
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[1000px] h-[350px] bg-radial from-amber-500/10 via-blue-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="wrap max-w-7xl mx-auto w-full relative z-10">
        
        {/* SECTION HEAD */}
        <div className="section-head center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest mb-4 shadow-xs border bg-amber-400/10 border-amber-500/30 text-amber-600 dark:text-[#FFC862]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f3a812] animate-ping" />
            <p className="eyebrow on-light">Growing together</p>
          </div>

          <h2 className="h-display font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            The numbers behind the community
          </h2>

          <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Tangible real-world results, active enterprises, and structured scaling across South India.
          </p>
        </div>

        {/* IMPACT GRID */}
        <div className="impact-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {impactData.map((item, idx) => (
            <div
              key={idx}
              className={`impact-item group relative p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0c1f38]/70 backdrop-blur-xl shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center text-center ${
                idx === 4 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              {/* Subtle top glow bar on hover */}
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#f3a812] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />

              {/* Stat number with countup */}
              <div className="mb-2">
                <span
                  className="impact-num font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#104288] dark:text-[#FFC862] group-hover:scale-105 transition-transform duration-300 block"
                  data-count={item.target}
                  data-suffix={item.suffix}
                >
                  {counts[idx]}
                  <span className="text-[#f3a812] dark:text-[#FF6A45]">{item.suffix}</span>
                </span>
              </div>

              {/* Label */}
              <span className="impact-label text-xs sm:text-[13px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 leading-snug">
                {item.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}