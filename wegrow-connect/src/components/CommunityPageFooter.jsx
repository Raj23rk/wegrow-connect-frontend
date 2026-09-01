import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

/**
 * CommunityPageFooter — Shared WeGrow B School footer used on
 * WomensCommunity and StudentFoundersCommunity landing pages.
 *
 * Props:
 *  - eventLabel      : string  — e.g. "Women's Orientation 2026"
 *  - eventDate       : string  — e.g. "Fri, 11 Sep 2026"
 *  - eventTime       : string  — e.g. "11:00 AM – 1:00 PM"
 *  - venueAddress    : string  — Full venue address line
 *  - queriesPhone    : string  — e.g. "+91 9344337331"
 *  - registerSectionId : string — section id to scroll to for CTA link
 */
export default function CommunityPageFooter({
  eventLabel = 'Orientation 2026',
  eventDate = '',
  eventTime = '',
  venueAddress = '',
  queriesPhone = '+91 9344337331',
  registerSectionId = 'register'
}) {
  const [activeBranch, setActiveBranch] = useState('sivakasi');

  const branchData = {
    sivakasi: {
      label: 'Sivakasi',
      address: '193/1A, Ground Floor, Ayyapan Kovil Opp. Police Station Road, Sivakasi – 626 123',
      phone: '+91 93443 37331',
      email: 'wegrowskillcampus@gmail.com',
      hours: 'Mon – Sat: 10:00 AM – 7:00 PM',
      mapUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3935.5323!2d77.7984786!3d9.456045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cefba12a6f25%3A0x74020b3129888e1a!2sBell%20Hotels!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
    },
    srivilliputtur: {
      label: 'Srivilliputhur',
      address:
        '129, North Car Street, Opposite Bombay Textiles, Upstairs Pathras Kids & Gift Shop, Srivilliputtur – 626 125',
      phone: '+91 93633 37331',
      email: 'wegrowskillcampus@gmail.com',
      hours: 'Mon – Sat: 10:00 AM – 7:00 PM',
      mapUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3934.3214!2d77.6318684!3d9.5104499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMzAnMzcuNiJOIDc3wrAzNzU0LjcuIkU!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
    }
  };

  const cb = branchData[activeBranch];

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const target = document.getElementById(sectionId);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const socialLinks = [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/share/18xhrEHChh/',
      hoverBg: '#1877F2',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/wegrowskillcampus/',
      hoverBg: '#E1306C',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    },
    {
      label: 'WhatsApp',
      href: 'https://wa.me/919363337331',
      hoverBg: '#25D366',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      )
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/company/wegrow-skill-campus/',
      hoverBg: '#0A66C2',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-[#0C1338] text-[#B9BEDD] pt-14 pb-8 px-4 lg:px-8 border-t-4 border-[#F0791E]">
      <div className="max-w-6xl mx-auto">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">

          {/* Brand Column */}
          <div className="space-y-4">
            {/* Logo */}
            <Link to="/home" className="inline-flex">
              <div className="bg-white/95 px-3 py-1.5 rounded-xl shadow-md border border-white/20 inline-flex items-center">
                <img
                  src="/wegrow-logo.png"
                  alt="WeGrow B School"
                  className="h-10 w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
                <span className="hidden text-[#16225E] font-black text-lg">WeGrow B School</span>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-[#9AA0C4]">
              Empowering students, women founders &amp; enterprises with practical business education
              and entrepreneurship skills from Sivakasi &amp; Srivilliputhur.
            </p>

            {/* Social icons */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#F0791E] mb-2">Connect With Us</p>
              <div className="flex gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-8 h-8 rounded-full bg-white text-[#16225E] flex items-center justify-center transition-all hover:scale-110 shadow"
                    style={{ '--hover-bg': s.hoverBg }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = s.hoverBg; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#16225E'; }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-white text-[10px] font-black uppercase tracking-widest mb-4">
              <span className="text-[#F0791E] mr-1">◈</span> Quick Links
            </h5>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link to="/home" className="hover:text-white transition inline-flex items-center gap-1.5">
                  <span className="text-[#F0791E] text-[10px]">➔</span> Home Platform
                </Link>
              </li>
              <li>
                <Link to="/womens-community" className="hover:text-white transition inline-flex items-center gap-1.5">
                  <span className="text-[#F0791E] text-[10px]">➔</span> Women's Community
                </Link>
              </li>
              <li>
                <Link to="/student-founders" className="hover:text-white transition inline-flex items-center gap-1.5">
                  <span className="text-[#F0791E] text-[10px]">➔</span> Student Founders
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition inline-flex items-center gap-1.5">
                  <span className="text-[#F0791E] text-[10px]">➔</span> Event Gallery
                </Link>
              </li>
              <li>
                <Link to="/home/login/option" className="hover:text-white transition inline-flex items-center gap-1.5">
                  <span className="text-[#F0791E] text-[10px]">➔</span> Join as Student / Business
                </Link>
              </li>
              <li>
                <a
                  href={`#${registerSectionId}`}
                  onClick={(e) => scrollToSection(e, registerSectionId)}
                  className="hover:text-white transition inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-[#F0791E] text-[10px]">➔</span> Register for {eventLabel}
                </a>
              </li>
            </ul>
          </div>

          {/* Branch Contact with toggle */}
          <div>
            <h5 className="text-white text-[10px] font-black uppercase tracking-widest mb-3">
              <span className="text-[#F0791E] mr-1">◈</span> Our Campuses
            </h5>

            {/* Branch toggle */}
            <div className="flex gap-1 mb-4 bg-white/5 rounded-full p-0.5 w-fit border border-white/10">
              {Object.entries(branchData).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setActiveBranch(key)}
                  className={`px-3 py-1 rounded-full text-[10px] font-black transition-all cursor-pointer ${
                    activeBranch === key
                      ? 'bg-[#F0791E] text-white shadow-md'
                      : 'text-[#9AA0C4] hover:text-white'
                  }`}
                >
                  {val.label}
                </button>
              ))}
            </div>

            <div className="space-y-2.5 text-xs text-[#9AA0C4]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F0791E] mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{cb.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F0791E] flex-shrink-0" />
                <a href={`tel:${cb.phone.replace(/\s/g, '')}`} className="hover:text-white transition font-mono">
                  {cb.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F0791E] flex-shrink-0" />
                <a href={`mailto:${cb.email}`} className="hover:text-white transition break-all">
                  {cb.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#F0791E] flex-shrink-0" />
                <span>{cb.hours}</span>
              </div>
            </div>
          </div>

          {/* Event Details + Map */}
          <div className="space-y-4">
            <h5 className="text-white text-[10px] font-black uppercase tracking-widest">
              <span className="text-[#F0791E] mr-1">◈</span> Upcoming Event
            </h5>

            {(eventDate || eventTime || venueAddress || queriesPhone) && (
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2.5 text-xs text-[#9AA0C4]">
                <p className="text-[#F0791E] font-bold text-sm">{eventLabel}</p>
                {eventDate && (
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span className="text-white font-semibold">{eventDate}</span>
                  </div>
                )}
                {eventTime && (
                  <div className="flex items-center gap-2">
                    <span>🕙</span>
                    <span>{eventTime}</span>
                  </div>
                )}
                {venueAddress && (
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0">📍</span>
                    <span className="leading-relaxed">{venueAddress}</span>
                  </div>
                )}
                {queriesPhone && (
                  <div className="flex items-center gap-2">
                    <span>📞</span>
                    <a
                      href={`tel:${queriesPhone.replace(/\s/g, '')}`}
                      className="text-[#F0791E] font-mono font-bold hover:underline"
                    >
                      {queriesPhone}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Embedded Map */}
            <div className="rounded-2xl overflow-hidden border border-white/10 h-28 w-full shadow-lg">
              <iframe
                key={activeBranch}
                title="WeGrow Campus Map"
                src={cb.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A80A8]">
          <div>© {new Date().getFullYear()} WeGrow B School. All rights reserved.</div>
          <div className="flex gap-5">
            <Link to="/home" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/home" className="hover:text-white transition">Terms of Service</Link>
            <Link to="/home" className="hover:text-white transition">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
