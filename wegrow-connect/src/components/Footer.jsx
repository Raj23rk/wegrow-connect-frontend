import React, { useState } from 'react';
import { theme } from '../theme';

export default function Footer({ 
  scrollToHero, 
  scrollToEvents, 
  scrollToSeminars, 
  scrollToVisits, 
  scrollToRewards, 
  scrollToResources, 
  scrollToMentors, 
  scrollToEnterprices, 
  scrollToStories, 
  scrollToContact 
}) {
  const [activeBranch, setActiveBranch] = useState('sivakasi');

  // Correct Embed Map URLs
  const branchData = {
    sivakasi: {
      address: '100A/5, 1st Floor, Thiruthangal Road, Opposite Bell Hotel, Sivakasi – 626123',
      phone: '+91 93443 37331',
      email: 'wegrowskillcampus@gmail.com',
      hours: 'Mon - Sat: 10:00 AM - 7:00 PM',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3935.5323!2d77.7984786!3d9.456045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cefba12a6f25%3A0x74020b3129888e1a!2sBell%20Hotels!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    },
    srivilliputtur: {
      address: '129, North Car Street, Opposite Bombay Textiles, Upstairs Pathras Kids & Gift Shop, Srivilliputtur – 626125',
      phone: '+91 93633 37331',
      email: 'wegrowskillcampus@gmail.com',
      hours: 'Mon - Sat: 10:00 AM - 7:00 PM',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3934.3214!2d77.6318684!3d9.5104499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMzAnMzcuNiJOIDc3wrAzNzU0LjcuIkU!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    },
  };

  const currentBranch = branchData[activeBranch];

  const resourceLinks = [
    { name: 'Library/Blog', tab: 'blog' },
    { name: 'Free Courses', tab: 'free' },
    { name: 'Community Forum', tab: 'community' },
    { name: 'Newsletter', tab: 'newsletter' },
  ];

  const quickLinks = [
    { name: 'Home', action: scrollToHero },
    { name: 'Seminars', action: scrollToSeminars },
    { name: 'Visits', action: scrollToVisits },
    { name: 'Workshops', action: scrollToEvents },
    { name: 'Rewards', action: scrollToRewards },
    { name: 'Mentors / Instructors', action: scrollToMentors },
    { name: 'Enterprise / Corporate Training', action: scrollToEnterprices },
    { name: 'Success Stories', action: scrollToStories },
    { name: 'Contact & Support', action: scrollToContact },
  ];

  const primaryBlue = theme.primary || '#104288';

  return (
    <footer 
      className="relative border-t pt-14 pb-8 transition-all duration-300 overflow-hidden"
      style={{ 
        backgroundColor: theme.cardBg || '#0f172a', 
        borderColor: theme.cardBorder || 'rgba(255,255,255,0.1)' 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 pb-10 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          
          {/* BRAND / LOGO & ABOUT */}
          <div className="lg:col-span-3 space-y-4 text-left">
            <div className="flex items-center gap-2 cursor-pointer" onClick={scrollToHero}>
              <span className="text-xl font-black tracking-wider" style={{ color: theme.primary || '#ffffff' }}>
                WEGROW <span style={{ color: theme.orange || '#f3a812' }}>SKILL CAMPUS</span>
              </span>
            </div>
            <p className="text-xs font-medium leading-relaxed" style={{ color: theme.textMuted || '#94a3b8' }}>
              WeGrow Skill Campus provides industry-ready training in Software Development, Digital Marketing, Data Analytics, and placement-oriented skill programs.
            </p>

            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: theme.orange || '#f3a812' }}>
                Connect With Us
              </p>
              <div className="flex items-center gap-2.5">
                {/* FACEBOOK */}
                <a
                  href="https://www.facebook.com/share/18xhrEHChh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-md cursor-pointer text-white"
                  style={{ backgroundColor: primaryBlue, border: `1px solid ${primaryBlue}` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1877F2';
                    e.currentTarget.style.borderColor = '#1877F2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = primaryBlue;
                    e.currentTarget.style.borderColor = primaryBlue;
                  }}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* INSTAGRAM */}
                <a
                  href="https://www.instagram.com/wegrowskillcampus/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-md cursor-pointer text-white"
                  style={{ backgroundColor: primaryBlue, border: `1px solid ${primaryBlue}` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E4405F';
                    e.currentTarget.style.borderColor = '#E4405F';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = primaryBlue;
                    e.currentTarget.style.borderColor = primaryBlue;
                  }}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* WHATSAPP */}
                <a
                  href="https://wa.me/919363337331"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-md cursor-pointer text-white"
                  style={{ backgroundColor: primaryBlue, border: `1px solid ${primaryBlue}` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#25D366';
                    e.currentTarget.style.borderColor = '#25D366';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = primaryBlue;
                    e.currentTarget.style.borderColor = primaryBlue;
                  }}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>

                {/* LINKEDIN */}
                <a
                  href="https://www.linkedin.com/company/wegrow-skill-campus/"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-md cursor-pointer text-white"
                  style={{ backgroundColor: primaryBlue, border: `1px solid ${primaryBlue}` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0A66C2';
                    e.currentTarget.style.borderColor = '#0A66C2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = primaryBlue;
                    e.currentTarget.style.borderColor = primaryBlue;
                  }}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* RESOURCES COLUMN */}
          <div className="lg:col-span-2 text-left">
            <h4 className="text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: theme.textBright || '#ffffff' }}>
              Resources
            </h4>
            <ul className="space-y-1.5 text-xs font-semibold" style={{ color: theme.textMuted || '#94a3b8' }}>
              {resourceLinks.map((item, idx) => (
                <li key={idx}>
                  <button 
                    onClick={() => scrollToResources(item.tab)}
                    className="transition hover:translate-x-1 inline-flex items-center gap-1.5 text-left cursor-pointer bg-transparent border-0 p-0"
                    style={{ color: theme.textMuted || '#94a3b8' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.orange || '#f3a812'}
                    onMouseLeave={(e) => e.currentTarget.style.color = theme.textMuted || '#94a3b8'}
                  >
                    <span>➔</span>
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* QUICK LINKS COLUMN */}
          <div className="lg:col-span-2 text-left">
            <h4 className="text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: theme.textBright || '#ffffff' }}>
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-xs font-semibold" style={{ color: theme.textMuted || '#94a3b8' }}>
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <button 
                    onClick={link.action}
                    className="transition hover:translate-x-1 inline-flex items-center gap-1.5 text-left cursor-pointer bg-transparent border-0 p-0 truncate max-w-full"
                    style={{ color: theme.textMuted || '#94a3b8' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.orange || '#f3a812'}
                    onMouseLeave={(e) => e.currentTarget.style.color = theme.textMuted || '#94a3b8'}
                  >
                    <span>➔</span>
                    <span className="truncate">{link.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT DETAILS WITH SIVAKASI & SRIVILLIPUTHUR TOGGLE TAB */}
          <div className="lg:col-span-3 text-left space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider mb-2" style={{ color: theme.textBright || '#ffffff' }}>
              Contact Us
            </h4>

            {/* TAB TOGGLE BUTTONS */}
            <div className="p-0.5 rounded-full flex items-center mb-3 bg-white/5 border border-white/10 w-fit">
              <button
                onClick={() => setActiveBranch('sivakasi')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  activeBranch === 'sivakasi' ? 'shadow-md' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: activeBranch === 'sivakasi' ? (theme.orange || '#f3a812') : 'transparent',
                  color: activeBranch === 'sivakasi' ? '#000000' : (theme.textBright || '#ffffff'),
                }}
              >
                Sivakasi
              </button>
              <button
                onClick={() => setActiveBranch('srivilliputtur')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  activeBranch === 'srivilliputtur' ? 'shadow-md' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: activeBranch === 'srivilliputtur' ? (theme.orange || '#f3a812') : 'transparent',
                  color: activeBranch === 'srivilliputtur' ? '#000000' : (theme.textBright || '#ffffff'),
                }}
              >
                Srivilliputhur
              </button>
            </div>

            {/* ADDRESS DETAILS */}
            <div className="space-y-2 text-xs font-semibold" style={{ color: theme.textMuted || '#94a3b8' }}>
              <div className="flex items-start gap-2">
                <span className="text-sm shrink-0">📍</span>
                <span className="leading-tight">{currentBranch.address}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm shrink-0">📞</span>
                <span>{currentBranch.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm shrink-0">✉️</span>
                <span className="break-all">{currentBranch.email}</span>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-sm shrink-0">⏰</span>
                <span className="leading-tight">{currentBranch.hours}</span>
              </div>
            </div>
          </div>

          {/* FIND US COLUMN (RIGHT SIDE MAP) */}
          <div className="lg:col-span-2 text-left space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider mb-3" style={{ color: theme.textBright || '#ffffff' }}>
              Find Us
            </h4>

            <div className="rounded-xl overflow-hidden border h-36 w-full shadow-md relative" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <iframe
                key={activeBranch}
                title="Branch Google Map"
                src={currentBranch.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT SECTION - CENTERED */}
        <div className="pt-6 text-center text-xs font-bold" style={{ color: theme.textMuted || '#94a3b8' }}>
          <p>© {new Date().getFullYear()} WeGrow Skill Campus | Skill Training & Placement Institute in Sivakasi & Srivilliputhur. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}