import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';

const corporateFeatures = [
  {
    icon: '🎯',
    title: 'Customized Curriculum',
    desc: 'Tailored training modules built specifically for your company’s internal tech stack, projects, and goals.'
  },
  {
    icon: '👨‍🏫',
    title: 'Live Architect-Led Bootcamps',
    desc: 'Interactive training sessions and hands-on guidance from experienced senior tech leads and engineers.'
  },
  {
    icon: '📊',
    title: 'Skills & Assessment Dashboard',
    desc: 'Dedicated HR/Management portal to monitor employee participation, test scores, and real-time skill growth.'
  },
  {
    icon: '💻',
    title: 'Production-Level Projects',
    desc: 'Practical capstone projects and case studies designed to solve actual corporate engineering challenges.'
  }
];

const keyStats = [
  { rawValue: 2, suffix: 'x', label: 'Faster Onboarding' },
  { rawValue: 40, suffix: '%', label: 'Boost in Productivity' },
  { rawValue: 95, suffix: '%', label: 'Employee Satisfaction' },
  { rawValue: 50, suffix: '+', label: 'Corporate Partners' }
];

export default function Enterprices({ enterpricesTargetRef, enterpricesStyle }) {
  const navigate = useNavigate();
  const [counts, setCounts] = useState(keyStats.map(() => 0));
  const sectionInternalRef = useRef(null);

  // Trigger counter animation every time the section enters the viewport (scroll up/down)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reset to 0 first to replay animation fresh
          setCounts(keyStats.map(() => 0));

          const duration = 1200; // total duration in milliseconds
          const steps = 40;
          const intervalTime = duration / steps;
          let currentStep = 0;

          const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            setCounts(
              keyStats.map((stat) => {
                const currentVal = Math.floor(stat.rawValue * progress);
                return currentVal > stat.rawValue ? stat.rawValue : currentVal;
              })
            );

            if (currentStep >= steps) {
              clearInterval(timer);
              setCounts(keyStats.map((stat) => stat.rawValue));
            }
          }, intervalTime);

          // Cleanup timer on re-trigger
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.3 }
    );

    const currentRef = enterpricesTargetRef?.current || sectionInternalRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [enterpricesTargetRef]);

  // Direct Navigation to Login Page for Request Corporate Demo button
  const handleRequestDemoClick = (e) => {
    e.preventDefault();
    navigate('/home/login');
  };

  return (
    <section 
      ref={(node) => {
        sectionInternalRef.current = node;
        if (typeof enterpricesTargetRef === 'function') {
          enterpricesTargetRef(node);
        } else if (enterpricesTargetRef) {
          enterpricesTargetRef.current = node;
        }
      }}
      id="enterprise" 
      style={enterpricesStyle}
      className="relative pt-0 pb-16 transition-all duration-300 ease-out transform-gpu"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative space-y-10">

        {/* HEADER SECTION */}
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <span className="text-xs uppercase font-black tracking-widest block" style={{ color: theme.orange }}>
            FOR ORGANIZATIONS & TEAMS
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold drop-shadow-sm leading-tight" style={{ color: theme.primary }}>
            Enterprise & Corporate Upskilling
          </h2>
          <p className="text-sm lg:text-base font-semibold leading-relaxed" style={{ color: theme.textMuted }}>
            Empower your engineering workforce with scalable, industry-driven tech training programs tailored for high-performing teams.
          </p>
        </div>

        {/* STATS HIGHLIGHT BAR WITH RE-TRIGGER COUNT ANIMATION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {keyStats.map((stat, idx) => (
            <div 
              key={idx} 
              className="p-5 rounded-2xl border backdrop-blur-md text-center space-y-1"
              style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
            >
              <div className="text-2xl md:text-3xl font-black" style={{ color: theme.primary }}>
                {counts[idx]}{stat.suffix}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* FEATURE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {corporateFeatures.map((item, index) => (
            <div 
              key={index} 
              className="group p-6 rounded-3xl border backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
            >
              <div className="space-y-4">
                <div className="text-4xl p-3 w-fit rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-lg font-extrabold" style={{ color: theme.textBright }}>
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed font-medium" style={{ color: theme.textMain }}>
                  {item.desc}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: theme.primary }}>
                  ✦ Tailored Module
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA CALL TO ACTION BOX */}
        <div 
          className="p-8 md:p-10 rounded-3xl border backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
        >
          {/* Subtle Glow Effect */}
          <div 
            className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none" 
            style={{ backgroundColor: theme.primary }} 
          />

          <div className="text-left space-y-2 max-w-2xl relative z-10">
            <h3 className="text-2xl font-extrabold" style={{ color: theme.textBright }}>
              Ready to Upgrade Your Team’s Tech Capability?
            </h3>
            <p className="text-xs md:text-sm font-medium leading-relaxed" style={{ color: theme.textMuted }}>
              Schedule a 1-on-1 consultation call with our Corporate Training Advisor to get a custom learning roadmap and pricing proposal.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 relative z-10">
            <button 
              onClick={handleRequestDemoClick}
              className="px-7 py-3 rounded-full font-extrabold text-xs md:text-sm transition-all duration-300 hover:scale-105 shadow-lg cursor-pointer"
              style={{ backgroundColor: theme.primary, color: theme.bgDark || '#ffffff' }}
            >
              Request Corporate Demo
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}