import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterSelection() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/home/login');
  };

  const communities = [
    {
      id: 'student-startup',
      title: 'Student Startup Founder',
      badge: 'For Innovators',
      badgeColor: '#104288',
      image: '/student_startup_founder.jpg',
      targetUrl: '/home/login/option/student?community=Student%20Startup%20Founder',
      btnText: 'Join as Student Founder',
      btnClass: 'bg-[#104288] hover:bg-[#0c336b]',
      highlights: [
        '✨ Tech incubation & startup guidance',
        '✨ Practical venture validation & pitch deck support',
        '✨ Student founder networking & seed connect',
      ],
    },
    {
      id: 'women-entrepreneurs',
      title: 'Women Entrepreneurs Community',
      badge: 'Women in Business',
      badgeColor: '#e11d48',
      image: '/women_entrepreneurs_comm.jpg',
      targetUrl: '/home/login/option/business?community=Women%20Entrepreneurs%20Community',
      btnText: 'Join Women Community',
      btnClass: 'bg-[#e11d48] hover:bg-[#be123c]',
      highlights: [
        '✨ Empowering women business leaders & innovators',
        '✨ Dedicated growth circles & leadership masterclasses',
        '✨ Strategic mentorship & enterprise scaling support',
      ],
    },
    {
      id: 'sivakasi-entrepreneurs',
      title: 'Sivakasi Entrepreneurs Community',
      badge: 'Regional Network',
      badgeColor: '#f97316',
      image: '/sivakasi_entrepreneurs_comm.jpg',
      targetUrl: '/home/login/option/business?community=Sivakasi%20Entrepreneurs%20Community',
      btnText: 'Join Sivakasi Community',
      btnClass: 'bg-[#f97316] hover:bg-[#ea580c]',
      highlights: [
        '✨ Industrial innovation & SME modernizations',
        '✨ B2B collaboration & manufacturing partnerships',
        '✨ Trade acceleration across Sivakasi & Tamil Nadu',
      ],
    },
  ];

  return (
    <>
      <style>{`
        @keyframes pageFadeIn {
          from { 
            opacity: 0; 
            transform: translateY(15px) scale(0.97); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        .page-fade {
          animation: pageFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .comm-card {
          transition: all 0.35s ease;
        }
        .comm-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 25px 40px -10px rgba(0,0,0,0.2) !important;
        }
        .back-btn {
          background-color: #ffffff;
          border: 2px solid #d1d5db;
          color: #374151;
          transition: all 0.25s ease;
        }
        .back-btn:hover {
          background-color: #f1f5f9 !important;
          border-color: #104288 !important;
          color: #104288 !important;
        }
      `}</style>

      {/* WRAPPER WITH SLOW FADE ANIMATION */}
      <div className="w-full min-h-screen py-12 px-4 sm:px-6 flex flex-col items-center justify-center relative page-fade">

        {/* BACK BUTTON */}
        <button 
          type="button"
          onClick={handleBackClick}
          className="back-btn self-start mb-6 md:absolute md:top-8 md:left-8 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm cursor-pointer shadow-sm z-50 flex items-center gap-2"
        >
          ← Back to Login
        </button>

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-8 mt-2 md:mt-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#104288] text-xs font-black uppercase tracking-widest mb-2 shadow-xs">
            <span>🤝</span> Join WeGrow Community
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Choose Your <span className="text-[#f97316]">Community Group</span>
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-2">
            Select a tailored community to accelerate your journey with dedicated mentorship, peers, and industry networks.
          </p>
        </div>

        {/* 3 COMMUNITY CARDS GRID */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {communities.map((comm) => (
            <div 
              key={comm.id}
              className="comm-card bg-white/95 backdrop-blur-2xl border border-gray-200/80 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* IMAGE WITH BADGE */}
                <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-gray-100">
                  <img 
                    src={comm.image} 
                    alt={comm.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span 
                    className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider text-white px-3 py-1 rounded-full shadow-md backdrop-blur-xs"
                    style={{ backgroundColor: comm.badgeColor }}
                  >
                    {comm.badge}
                  </span>
                </div>

                {/* CARD CONTENT */}
                <div className="p-6">
                  <h3 className="text-xl font-black mb-3 text-gray-900 group-hover:text-[#104288] transition-colors leading-snug">
                    {comm.title}
                  </h3>

                  <ul className="text-left text-xs font-semibold text-gray-600 leading-relaxed space-y-2 mb-6">
                    {comm.highlights.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="p-6 pt-0">
                <button 
                  onClick={() => navigate(comm.targetUrl)} 
                  className={`w-full py-3.5 rounded-full font-extrabold text-white text-xs sm:text-sm border-none cursor-pointer shadow-md transition-all duration-300 transform group-hover:scale-[1.02] ${comm.btnClass}`}
                >
                  {comm.btnText} →
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}