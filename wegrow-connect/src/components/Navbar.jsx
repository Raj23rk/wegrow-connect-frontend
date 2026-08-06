import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { theme } from '../theme';

export default function Navbar({ 
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
  
  // Initialize navigation
  const navigate = useNavigate();

  // Function to handle Login button click
  const handleLoginClick = () => {
    navigate('/home/login'); // Changed to /home/login as per your exact requirement
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent pointer-events-none pt-4">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-8 h-18 pointer-events-auto">
        
        {/* LOGO SECTION */}
        <div className="flex items-center">
          <button 
            onClick={scrollToHero} 
            className="flex items-center hover:opacity-90 transition text-left focus:outline-none cursor-pointer"
          >

            
            {/* 1. EMBLEM LOGO */}
            <img 
              src="/logo.jpg" 
              alt="Logo" 
              className="w-[38px] h-[38px] object-contain shrink-0 z-10" 
            />
            
            {/* 2. WEGROW TEXT LOGO */}
            <div className="flex items-center justify-start h-10 -ml-3 md:-ml-4 overflow-hidden">
              <img 
                src="/wegrow-logo.png" 
                alt="WeGrow" 
                className="h-9 md:h-10 w-auto object-contain drop-shadow-sm max-w-none" 
              />
            </div>
          </button>
        </div>

        {/* MENU */}
        <div className="hidden lg:flex items-center gap-7 text-sm font-bold" style={{ color: theme.textMuted }}>
          
          {/* EVENTS DROPDOWN */}
          <div className="relative dropdown py-2">
            <button className="flex items-center gap-1 hover:text-blue-900 transition focus:outline-none cursor-pointer">
              Events <span className="text-xs">▾</span>
            </button>
            
            <div className="dropdown-menu absolute top-full -left-4 w-72 backdrop-blur-xl rounded-2xl shadow-2xl p-3 text-left z-50 transition-all duration-200" style={{ backgroundColor: theme.dropdownBg, border: `1px solid ${theme.cardBorder}` }}>
              <button 
                onClick={scrollToSeminars} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primary || '#104288';
                  e.currentTarget.querySelectorAll('div').forEach(el => el.style.color = '#ffffff');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  const divs = e.currentTarget.querySelectorAll('div');
                  if (divs[0]) divs[0].style.color = theme.primary;
                  if (divs[1]) divs[1].style.color = theme.textMuted;
                }}
              >
                <div className="font-extrabold text-sm transition-colors duration-200" style={{ color: theme.primary }}>Seminars</div>
                <div className="text-xs font-semibold mt-0.5 transition-colors duration-200" style={{ color: theme.textMuted }}>Tech talks & guest lectures</div>
              </button>

              <button 
                onClick={scrollToVisits} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primary || '#104288';
                  e.currentTarget.querySelectorAll('div').forEach(el => el.style.color = '#ffffff');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  const divs = e.currentTarget.querySelectorAll('div');
                  if (divs[0]) divs[0].style.color = theme.primary;
                  if (divs[1]) divs[1].style.color = theme.textMuted;
                }}
              >
                <div className="font-extrabold text-sm transition-colors duration-200" style={{ color: theme.primary }}>Visit</div>
                <div className="text-xs font-semibold mt-0.5 transition-colors duration-200" style={{ color: theme.textMuted }}>On-site company exposure & field trips</div>
              </button>

              <button 
                onClick={scrollToEvents} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primary || '#104288';
                  e.currentTarget.querySelectorAll('div').forEach(el => el.style.color = '#ffffff');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  const divs = e.currentTarget.querySelectorAll('div');
                  if (divs[0]) divs[0].style.color = theme.primary;
                  if (divs[1]) divs[1].style.color = theme.textMuted;
                }}
              >
                <div className="font-extrabold text-sm transition-colors duration-200" style={{ color: theme.primary }}>Workshops</div>
                <div className="text-xs font-semibold mt-0.5 transition-colors duration-200" style={{ color: theme.textMuted }}>Hands-on practical bootcamps</div>
              </button>
            </div>
          </div>

          {/* REWARDS */}
          <button onClick={scrollToRewards} className="hover:text-blue-900 transition py-2 focus:outline-none cursor-pointer">
            Rewards
          </button>

          {/* RESOURCES DROPDOWN */}
          <div className="relative dropdown py-2">
            <button className="flex items-center gap-1 hover:text-blue-900 transition focus:outline-none cursor-pointer">
              Resources <span className="text-xs">▾</span>
            </button>
            
            <div className="dropdown-menu absolute top-full -left-4 w-72 backdrop-blur-xl rounded-2xl shadow-2xl p-3 text-left z-50 transition-all duration-200" style={{ backgroundColor: theme.dropdownBg, border: `1px solid ${theme.cardBorder}` }}>
              
              <button 
                onClick={() => scrollToResources('blog')} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primary || '#104288';
                  e.currentTarget.querySelectorAll('div').forEach(el => el.style.color = '#ffffff');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  const divs = e.currentTarget.querySelectorAll('div');
                  if (divs[0]) divs[0].style.color = theme.primary;
                  if (divs[1]) divs[1].style.color = theme.textMuted;
                }}
              >
                <div className="font-extrabold text-sm transition-colors duration-200" style={{ color: theme.primary }}>Library / Blog</div>
                <div className="text-xs font-semibold mt-0.5 transition-colors duration-200" style={{ color: theme.textMuted }}>Articles, Guides & Industry Insights</div>
              </button>

              <button 
                onClick={() => scrollToResources('courses')} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primary || '#104288';
                  e.currentTarget.querySelectorAll('div').forEach(el => el.style.color = '#ffffff');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  const divs = e.currentTarget.querySelectorAll('div');
                  if (divs[0]) divs[0].style.color = theme.primary;
                  if (divs[1]) divs[1].style.color = theme.textMuted;
                }}
              >
                <div className="font-extrabold text-sm transition-colors duration-200" style={{ color: theme.primary }}>Free Courses</div>
                <div className="text-xs font-semibold mt-0.5 transition-colors duration-200" style={{ color: theme.textMuted }}>Free introductory masterclasses</div>
              </button>

              <button 
                onClick={() => scrollToResources('forum')} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primary || '#104288';
                  e.currentTarget.querySelectorAll('div').forEach(el => el.style.color = '#ffffff');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  const divs = e.currentTarget.querySelectorAll('div');
                  if (divs[0]) divs[0].style.color = theme.primary;
                  if (divs[1]) divs[1].style.color = theme.textMuted;
                }}
              >
                <div className="font-extrabold text-sm transition-colors duration-200" style={{ color: theme.primary }}>Community Forum</div>
                <div className="text-xs font-semibold mt-0.5 transition-colors duration-200" style={{ color: theme.textMuted }}>Member discussions & networking</div>
              </button>

              <button 
                onClick={() => scrollToResources('newsletter')} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primary || '#104288';
                  e.currentTarget.querySelectorAll('div').forEach(el => el.style.color = '#ffffff');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  const divs = e.currentTarget.querySelectorAll('div');
                  if (divs[0]) divs[0].style.color = theme.primary;
                  if (divs[1]) divs[1].style.color = theme.textMuted;
                }}
              >
                <div className="font-extrabold text-sm transition-colors duration-200" style={{ color: theme.primary }}>Newsletter</div>
                <div className="text-xs font-semibold mt-0.5 transition-colors duration-200" style={{ color: theme.textMuted }}>Latest tech updates & stories</div>
              </button>

            </div>
          </div>

          {/* ABOUT DROPDOWN */}
          <div className="relative dropdown py-2">
            <button className="flex items-center gap-1 hover:text-blue-900 transition focus:outline-none cursor-pointer">
              About <span className="text-xs">▾</span>
            </button>

            <div className="dropdown-menu absolute top-full -left-4 w-72 backdrop-blur-xl rounded-2xl shadow-2xl p-3 text-left z-50 transition-all duration-200" style={{ backgroundColor: theme.dropdownBg, border: `1px solid ${theme.cardBorder}` }}>
              
              <button 
                onClick={scrollToMentors} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primary || '#104288';
                  e.currentTarget.querySelectorAll('div').forEach(el => el.style.color = '#ffffff');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  const divs = e.currentTarget.querySelectorAll('div');
                  if (divs[0]) divs[0].style.color = theme.primary;
                  if (divs[1]) divs[1].style.color = theme.textMuted;
                }}
              >
                <div className="font-extrabold text-sm transition-colors duration-200" style={{ color: theme.primary }}>Mentors / Instructors</div>
                <div className="text-xs font-semibold mt-0.5 transition-colors duration-200" style={{ color: theme.textMuted }}>Meet our industry trainers</div>
              </button>

              <button 
                onClick={scrollToEnterprices} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primary || '#104288';
                  e.currentTarget.querySelectorAll('div').forEach(el => el.style.color = '#ffffff');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  const divs = e.currentTarget.querySelectorAll('div');
                  if (divs[0]) divs[0].style.color = theme.primary;
                  if (divs[1]) divs[1].style.color = theme.textMuted;
                }}
              >
                <div className="font-extrabold text-sm transition-colors duration-200" style={{ color: theme.primary }}>Enterprise / Corporate Training</div>
                <div className="text-xs font-semibold mt-0.5 transition-colors duration-200" style={{ color: theme.textMuted }}>Business plans & upskilling solution</div>
              </button>

              <button 
                onClick={scrollToStories} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primary || '#104288';
                  e.currentTarget.querySelectorAll('div').forEach(el => el.style.color = '#ffffff');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  const divs = e.currentTarget.querySelectorAll('div');
                  if (divs[0]) divs[0].style.color = theme.primary;
                  if (divs[1]) divs[1].style.color = theme.textMuted;
                }}
              >
                <div className="font-extrabold text-sm transition-colors duration-200" style={{ color: theme.primary }}>Success Stories</div>
                <div className="text-xs font-semibold mt-0.5 transition-colors duration-200" style={{ color: theme.textMuted }}>Member reviews & career growth</div>
              </button>

            </div>
          </div>

          {/* CONTACT & SUPPORT LINK */}
          <button 
            onClick={scrollToContact} 
            className="hover:text-blue-900 transition py-2 focus:outline-none cursor-pointer"
          >
            Contact & Support
          </button>

        </div>

        {/* LOGIN BUTTON */}
        <div className="flex justify-end">
          <button 
            onClick={handleLoginClick} // Changed this to navigate to login page
            className="font-extrabold px-7 py-2.5 rounded-full text-sm transition-all duration-300 shadow-md hover:scale-105 hover:shadow-xl transform focus:outline-none cursor-pointer" 
            style={{ 
              backgroundColor: theme.primary, 
              color: '#ffffff' 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.orange || '#f3a812';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.primary;
            }}
          >
            Login
          </button>
        </div>
      </nav>
    </header>
  );
}