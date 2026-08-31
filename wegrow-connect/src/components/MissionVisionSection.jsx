import React from 'react';
import { theme } from '../theme';

export default function MissionVisionSection({ missionVisionTargetRef, missionVisionStyle }) {
  const coreValues = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Practical Excellence',
      desc: '100% hands-on training with industry-standard toolsets and live business case studies.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Innovation Driven',
      desc: 'Modern tech stacks, AI integration, and forward-looking entrepreneurship principles.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Industry Connect',
      desc: 'Direct access to senior mentors, industrial visits, corporate tie-ups, and guaranteed hiring.'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Affordable & Accessible',
      desc: 'Democratizing high-value career education for Tier-2 & Tier-3 students and enterprises.'
    }
  ];

  return (
    <section 
      ref={missionVisionTargetRef} 
      style={missionVisionStyle}
      className="py-6 sm:py-10 md:py-14 px-3 sm:px-4 md:px-8 relative z-10 transition-all duration-700"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* SECTION HEADER */}
        <div className="text-center mb-5 sm:mb-8 md:mb-10">
          <div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-2.5 shadow-sm border"
            style={{ 
              backgroundColor: 'rgba(16, 66, 136, 0.08)', 
              color: theme.primary || '#104288',
              borderColor: 'rgba(16, 66, 136, 0.2)' 
            }}
          >
            <span>🌟</span>
            <span>About WeGrow B School</span>
          </div>

          <h2 
            className="text-xl sm:text-3xl md:text-5xl font-black tracking-tight"
            style={{ color: theme.primary || '#104288' }}
          >
            Our <span style={{ color: theme.orange || '#f3a812' }}>Mission & Vision</span>
          </h2>

          <p 
            className="mt-2.5 text-xs sm:text-sm font-semibold max-w-2xl mx-auto leading-relaxed"
            style={{ color: theme.textMuted || '#50637f' }}
          >
            Transforming ambitious minds into high-impact industry leaders and entrepreneurs through 
            action-oriented education, practical technology mastery, and corporate partnerships.
          </p>
        </div>

        {/* MISSION & VISION DUAL CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-10">
          
          {/* 1. MISSION CARD */}
          <div 
            className="relative overflow-hidden rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
            style={{ 
              backgroundColor: theme.cardBg || 'rgba(255, 255, 255, 0.95)',
              borderColor: theme.cardBorder || 'rgba(16, 66, 136, 0.15)'
            }}
          >
            {/* Top Accent Gradient Line */}
            <div 
              className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-400"
            ></div>

            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 transform group-hover:scale-110 transition-transform"
                style={{ backgroundColor: theme.primary || '#104288' }}
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>

              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700">Our Purpose</span>
                <h3 className="text-2xl sm:text-3xl font-black" style={{ color: theme.primary || '#104288' }}>
                  Our Mission
                </h3>
              </div>
            </div>

            <p className="text-sm sm:text-base font-semibold leading-relaxed mb-6" style={{ color: theme.textMain || '#1e293b' }}>
              To bridge the critical divide between academia and modern enterprise requirements by delivering 
              rigorous, real-world skill training in Business Leadership, Technology, and Applied Analytics.
            </p>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">✓</span>
                <span className="text-xs sm:text-sm font-semibold" style={{ color: theme.textMuted }}>
                  Deliver 100% practical, project-centric skill bootcamps and corporate training.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">✓</span>
                <span className="text-xs sm:text-sm font-semibold" style={{ color: theme.textMuted }}>
                  Provide dedicated 1-on-1 mentorship, live company visits, and direct placement support.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">✓</span>
                <span className="text-xs sm:text-sm font-semibold" style={{ color: theme.textMuted }}>
                  Empower startups and local businesses with modern operational and digital tools.
                </span>
              </div>
            </div>
          </div>

          {/* 2. VISION CARD */}
          <div 
            className="relative overflow-hidden rounded-3xl p-8 sm:p-10 shadow-xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
            style={{ 
              backgroundColor: theme.cardBg || 'rgba(255, 255, 255, 0.95)',
              borderColor: theme.cardBorder || 'rgba(16, 66, 136, 0.15)'
            }}
          >
            {/* Top Accent Gradient Line */}
            <div 
              className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400"
            ></div>

            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 transform group-hover:scale-110 transition-transform"
                style={{ backgroundColor: theme.orange || '#f3a812' }}
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>

              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700">Our Future</span>
                <h3 className="text-2xl sm:text-3xl font-black" style={{ color: theme.primary || '#104288' }}>
                  Our Vision
                </h3>
              </div>
            </div>

            <p className="text-sm sm:text-base font-semibold leading-relaxed mb-6" style={{ color: theme.textMain || '#1e293b' }}>
              To become South India's premier B-School and Skill Development Ecosystem, cultivating 
              creative thinkers, innovative entrepreneurs, and technology trailblazers recognized worldwide.
            </p>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">✓</span>
                <span className="text-xs sm:text-sm font-semibold" style={{ color: theme.textMuted }}>
                  Build an unmatched network of industry-ready graduates and innovative business leaders.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">✓</span>
                <span className="text-xs sm:text-sm font-semibold" style={{ color: theme.textMuted }}>
                  Expand state-of-the-art incubation and technology labs across regional hubs.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">✓</span>
                <span className="text-xs sm:text-sm font-semibold" style={{ color: theme.textMuted }}>
                  Foster lifelong alumni connections and collaborative corporate ecosystems.
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* CORE VALUES GRID */}
        <div>
          <div className="text-center mb-8">
            <h4 className="text-xl sm:text-2xl font-black" style={{ color: theme.primary || '#104288' }}>
              Our Core Pillars of Excellence
            </h4>
            <p className="text-xs sm:text-sm font-semibold mt-1" style={{ color: theme.textMuted }}>
              The foundational values that guide every classroom, workshop, and corporate partnership at WeGrow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => (
              <div 
                key={idx}
                className="rounded-2xl p-6 border shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
                style={{ 
                  backgroundColor: theme.cardBg || 'rgba(255, 255, 255, 0.95)',
                  borderColor: theme.cardBorder || 'rgba(16, 66, 136, 0.15)'
                }}
              >
                <div>
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
                    style={{ 
                      backgroundColor: 'rgba(16, 66, 136, 0.08)',
                      color: theme.primary || '#104288'
                    }}
                  >
                    {val.icon}
                  </div>
                  <h5 className="font-extrabold text-base mb-2" style={{ color: theme.primary || '#104288' }}>
                    {val.title}
                  </h5>
                  <p className="text-xs font-semibold leading-relaxed" style={{ color: theme.textMuted }}>
                    {val.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
