import React, { useState } from 'react';
import { theme } from '../theme';

const resourceTabs = [
  {
    id: 'blog',
    title: 'Library / Blog',
    tag: 'Articles & Insights',
    subtitle: 'Empowering Careers Through Knowledge',
    desc: 'Welcome to the core brain of WeGrow! Here, we share in-depth articles, real-world case studies, and practical tech guides curated by industry leaders. We believe talent is everywhere, but direction is rare. Our library breaks down complex technology, career growth strategies, and hands-on industrial workflows so you can learn faster, execute better, and stay steps ahead in your journey.',
    img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'courses',
    title: 'Free Courses',
    tag: '100% Free Masterclass',
    subtitle: 'Start Learning with Zero Barriers',
    desc: 'To kickstart your career without barriers, your first foundational course on WeGrow is completely 100% FREE! Gain access to high-quality video modules, practical assignments, and earn skill credits right from day one to unlock advanced mentor tracks.',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'forum',
    title: 'Community Forum',
    tag: 'Founder & Business Hub',
    subtitle: 'Connect, Collaborate & Grow',
    desc: 'Are you building a startup or running a business? The WeGrow Community Forum is designed specifically for founders, visionaries, and business leaders. Directly interact with fellow entrepreneurs, discuss strategies, pitch ideas, find potential co-founders, and build high-value business connections that accelerate growth.',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'newsletter',
    title: 'Newsletter',
    tag: 'Live Workshops & Updates',
    subtitle: 'Never Miss a Live Tech Event',
    desc: "We have conducted numerous high-impact workshops covering Digital Marketing, AI Tools, Advanced Machine Learning, and Future Tech Trends. And we're not stopping! Stay tuned for upcoming live hands-on bootcamps and exclusive Free Workshops. Subscribe to receive real-time updates and direct calendar invites!",
    img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80'
  }
];

export default function ResourceSection({ resourceTargetRef, resourceStyle, activeTab, setActiveTab }) {
  const selectedTab = resourceTabs.find(t => t.id === activeTab) || resourceTabs[0];

  return (
    <section 
      ref={resourceTargetRef} 
      id="resources" 
      style={resourceStyle}
      className="relative pt-10 pb-28 transition-all duration-300 ease-out transform-gpu"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER SECTION */}
        <div className="max-w-4xl mx-auto text-center space-y-3 mb-12">
          <span className="text-xs uppercase font-black tracking-widest block" style={{ color: theme.orange }}>
            KNOWLEDGE & NETWORK
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold drop-shadow-sm leading-tight" style={{ color: theme.primary }}>
            Resources & Growth Hub
          </h2>
          <p className="text-sm lg:text-base font-semibold leading-relaxed" style={{ color: theme.textMuted }}>
            Explore our curated guides, free introductory courses, founder community forums, and workshop newsletters!
          </p>
        </div>

        {/* TAB BUTTONS */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {resourceTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-5 py-2.5 rounded-full text-xs md:text-sm font-extrabold transition-all duration-300 border shadow-md focus:outline-none"
              style={{
                backgroundColor: activeTab === tab.id ? theme.primary : 'transparent',
                color: activeTab === tab.id ? theme.bgDark : theme.textMain,
                borderColor: activeTab === tab.id ? theme.primary : theme.cardBorder
              }}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* TAB CONTENT DISPLAY */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center backdrop-blur-md rounded-3xl border shadow-2xl p-6 md:p-10 transition-all duration-500"
          style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
        >
          {/* IMAGE BLOCK */}
          <div className="lg:col-span-6 h-64 md:h-80 w-full overflow-hidden rounded-2xl relative shadow-lg">
            <img 
              key={selectedTab.id}
              src={selectedTab.img} 
              alt={selectedTab.title} 
              className="w-full h-full object-cover animate-fadeIn brightness-95"
            />
            <span className="absolute top-4 left-4 text-xs font-black px-3.5 py-1.5 rounded-full backdrop-blur-md border shadow-md" style={{ color: theme.primary, backgroundColor: 'white', borderColor: theme.cardBorder }}>
              ✦ {selectedTab.tag}
            </span>
          </div>

          {/* TEXT BLOCK */}
          <div className="lg:col-span-6 text-left space-y-4">
            <h3 className="text-2xl md:text-3xl font-extrabold leading-tight" style={{ color: theme.textBright }}>
              {selectedTab.subtitle}
            </h3>
            <p className="text-sm md:text-base font-normal leading-relaxed" style={{ color: theme.textMain }}>
              {selectedTab.desc}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}