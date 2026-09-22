import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhoCanJoinSection from './WhoCanJoinSection';
import { useTheme } from '../context/ThemeContext';

export default function WhoCanJoinPage() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToHero = () => navigate('/home');
  const scrollToContact = () => navigate('/home');

  const pathways = [
    {
      title: 'Women Entrepreneurs',
      badge: 'Incubation & Scaling',
      audience: 'Solo founders, boutique business owners, family business leaders',
      offerings: [
        'Curated mastermind circles & peer advisory',
        'Digital sales funnels & high-ticket branding',
        'Access to female angel investors & seed grants',
        'Executive coaching with Founder Thavabalan'
      ],
      destination: '/womens-community',
      ctaText: 'Visit Women’s Community'
    },
    {
      title: 'Business Owners & MSMEs',
      badge: 'Systems, Delegation & Growth',
      audience: 'Manufacturing, retail, tech, agency, & service business owners',
      offerings: [
        'Business Dependency Diagnostic Test (BDT)',
        'SOP blueprints & team accountability systems',
        'Marketing automation & scalable lead generation',
        'Quarterly board review & growth milestone tracking'
      ],
      destination: '/business-founders',
      ctaText: 'Visit Business Founders Hub'
    },
    {
      title: 'Students & Aspiring Founders',
      badge: '0-to-1 Incubation',
      audience: 'College students, recent graduates, tech builders & early thinkers',
      offerings: [
        '100% hands-on modern tech tracks (Full Stack, AI, UI/UX)',
        'Business model canvas, pitch decks & MVP building',
        'Direct mentorship from real enterprise founders',
        'Incubation workstation passes & seed competitions'
      ],
      destination: '/student-founders',
      ctaText: 'Visit Student Founders Hub'
    }
  ];

  return (
    <div className={`min-h-screen font-['Inter'] transition-colors duration-300 ${
      isDarkMode ? 'bg-[#061325] text-slate-100' : 'bg-[#FAF6ED] text-slate-900'
    }`}>
      {/* Top Navigation */}
      <Navbar scrollToHero={scrollToHero} scrollToContact={scrollToContact} />

      {/* Main Content Area */}
      <main className="pt-24 sm:pt-28 pb-20">
        
        {/* Breadcrumb & Hero Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4 pb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
            <button onClick={() => navigate('/home')} className="hover:text-[#104288] dark:hover:text-amber-400 cursor-pointer">
              Home
            </button>
            <span>/</span>
            <span className="text-[#104288] dark:text-[#FFC862] font-bold">Who Can Join</span>
          </div>
        </div>

        {/* Section: Who Can Join */}
        <WhoCanJoinSection />

        {/* Pathways Deep-Dive Comparison */}
        <section className="py-16 px-4 sm:px-6 md:px-8 border-t border-slate-200/80 dark:border-white/10 mt-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Detailed Pathways
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mt-3 text-slate-900 dark:text-white">
                Choose the Pathway Built for Your Ambition
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Every track includes hands-on sessions, practical toolkits, and lifelong community membership.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {pathways.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-7 border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0b1b31] shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#104288] dark:text-[#FFC862] bg-amber-400/10 dark:bg-white/5 px-2.5 py-1 rounded-md border border-amber-400/20">
                      {item.badge}
                    </span>
                    <h3 className="text-xl font-bold font-serif mt-3 text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                      For: {item.audience}
                    </p>

                    <div className="mt-6 space-y-2.5">
                      {item.offerings.map((offering, oIdx) => (
                        <div key={oIdx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700 dark:text-slate-300">
                          <span className="text-emerald-500 dark:text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                          <span>{offering}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10">
                    <button
                      onClick={() => navigate(item.destination)}
                      className="w-full py-3 rounded-xl bg-[#104288] hover:bg-[#0c336b] text-white font-bold text-xs tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>{item.ctaText}</span>
                      <span>➔</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer scrollToHero={scrollToHero} scrollToContact={scrollToContact} />
    </div>
  );
}
