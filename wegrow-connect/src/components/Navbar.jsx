import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { fetchProfile, logoutUser, clearAuthStorage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ 
  scrollToHero,
  scrollToEvents, 
  scrollToCourses,
  scrollToMissionVision,
  scrollToGallery,
  scrollToSeminars, 
  scrollToVisits, 
  scrollToRewards, 
  scrollToResources,
  scrollToMentors,
  scrollToEnterprices,
  scrollToStories,
  scrollToContact
}) {
  const navigate = useNavigate();
  const { user: authUser, logout: authLogout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const [user, setUser] = useState(authUser);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    } else {
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch {
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  }, [authUser]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !user) {
      fetchUserProfile();
    }
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const fetchUserProfile = async () => {
    try {
      const data = await fetchProfile();

      if (data.success) {
        setUser(data.data);
        localStorage.setItem('user', JSON.stringify(data.data));
      } else {
        clearAuthStorage();
        setUser(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginClick = () => {
    navigate('/home/login');
  };

  const handleProfileClick = () => {
    navigate('/home/profile');
  };

  const handleDashboardClick = () => {
    const role = (user?.role || localStorage.getItem('role') || '').toLowerCase();
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'business') {
      navigate('/business/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    } finally {
      clearAuthStorage();
      if (authLogout) authLogout();
      setUser(null);
    }
  };

  // Close mobile menu and execute scroll action
  const mobileNav = (action) => {
    setMobileMenuOpen(false);
    setResourcesOpen(false);
    setAboutOpen(false);
    if (action) action();
  };

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
    : '';

  return (
    <header className="fixed top-0 left-0 w-full z-50 pointer-events-none pt-3 pb-3 px-3 sm:px-6">
      <nav 
        className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-7 h-14 sm:h-16 lg:h-18 pointer-events-auto rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300"
        style={{
          backgroundColor: '#104288',
          borderColor: 'rgba(243, 168, 18, 0.35)',
          boxShadow: '0 12px 35px -8px rgba(16, 66, 136, 0.5), 0 0 15px rgba(243, 168, 18, 0.15)'
        }}
      >
        
        {/* LOGO SECTION */}
        <div className="flex items-center shrink-0">
          <button 
            onClick={scrollToHero} 
            className="flex items-center hover:opacity-95 transition text-left focus:outline-none cursor-pointer"
          >
            <div className="flex items-center bg-white/95 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl shadow-sm border border-white/40">
              <img 
                src="/wegrow-logo.png" 
                alt="WeGrow B School" 
                className="w-[105px] sm:w-[125px] lg:w-[135px] h-[30px] sm:h-[36px] lg:h-[38px] object-contain max-w-none" 
              />
            </div>
          </button>
        </div>

        {/* DESKTOP MENU — hidden on mobile */}
        <div className="hidden xl:flex items-center gap-3.5 2xl:gap-6 text-xs 2xl:text-sm font-extrabold text-white whitespace-nowrap px-2">
          
          {/* EVENTS */}
          <button 
            onClick={scrollToEvents} 
            className="hover:text-[#f3a812] transition-colors py-2 focus:outline-none cursor-pointer whitespace-nowrap"
          >
            Events
          </button>

          {/* COURSES */}
          <button 
            onClick={scrollToCourses} 
            className="hover:text-[#f3a812] transition-colors py-2 focus:outline-none cursor-pointer whitespace-nowrap"
          >
            Courses
          </button>

          {/* GALLERY */}
          <button 
            onClick={scrollToGallery} 
            className="hover:text-[#f3a812] transition-colors py-2 focus:outline-none cursor-pointer whitespace-nowrap"
          >
            Gallery
          </button>

          {/* REWARDS */}
          <button 
            onClick={scrollToRewards} 
            className="hover:text-[#f3a812] transition-colors py-2 focus:outline-none cursor-pointer whitespace-nowrap"
          >
            Rewards
          </button>

          {/* RESOURCES DROPDOWN */}
          <div className="relative dropdown py-2">
            <button className="flex items-center gap-1 hover:text-[#f3a812] transition-colors focus:outline-none cursor-pointer whitespace-nowrap">
              Resources <span className="text-xs">▾</span>
            </button>
            
            <div 
              className="dropdown-menu absolute top-full -left-4 w-72 rounded-2xl shadow-2xl p-3 text-left z-50 transition-all duration-200 border" 
              style={{ backgroundColor: '#0c336b', borderColor: 'rgba(243, 168, 18, 0.25)' }}
            >
              
              <button 
                onClick={() => scrollToResources('blog')} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer hover:bg-[#104288]"
              >
                <div className="font-extrabold text-sm text-white group-hover:text-[#f3a812] transition-colors">Library / Blog</div>
                <div className="text-xs font-semibold mt-0.5 text-blue-200">Articles, Guides & Industry Insights</div>
              </button>

              <button 
                onClick={scrollToCourses} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer hover:bg-[#104288]"
              >
                <div className="font-extrabold text-sm text-white group-hover:text-[#f3a812] transition-colors">Free & Career Courses</div>
                <div className="text-xs font-semibold mt-0.5 text-blue-200">Certification & practical programs</div>
              </button>

              <button 
                onClick={() => scrollToResources('forum')} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer hover:bg-[#104288]"
              >
                <div className="font-extrabold text-sm text-white group-hover:text-[#f3a812] transition-colors">Community Forum</div>
                <div className="text-xs font-semibold mt-0.5 text-blue-200">Member discussions & networking</div>
              </button>

              <button 
                onClick={() => scrollToResources('newsletter')} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer hover:bg-[#104288]"
              >
                <div className="font-extrabold text-sm text-white group-hover:text-[#f3a812] transition-colors">Newsletter</div>
                <div className="text-xs font-semibold mt-0.5 text-blue-200">Latest tech updates & stories</div>
              </button>

            </div>
          </div>

          {/* ABOUT DROPDOWN */}
          <div className="relative dropdown py-2">
            <button className="flex items-center gap-1 hover:text-[#f3a812] transition-colors focus:outline-none cursor-pointer whitespace-nowrap">
              About <span className="text-xs">▾</span>
            </button>

            <div 
              className="dropdown-menu absolute top-full -left-4 w-72 rounded-2xl shadow-2xl p-3 text-left z-50 transition-all duration-200 border" 
              style={{ backgroundColor: '#0c336b', borderColor: 'rgba(243, 168, 18, 0.25)' }}
            >
              
              <button 
                onClick={scrollToMissionVision} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer hover:bg-[#104288]"
              >
                <div className="font-extrabold text-sm text-white group-hover:text-[#f3a812] transition-colors">Mission & Vision</div>
                <div className="text-xs font-semibold mt-0.5 text-blue-200">Our purpose, goals & core pillars</div>
              </button>

              <button 
                onClick={scrollToGallery} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer hover:bg-[#104288]"
              >
                <div className="font-extrabold text-sm text-white group-hover:text-[#f3a812] transition-colors">Campus Gallery</div>
                <div className="text-xs font-semibold mt-0.5 text-blue-200">Workshops, activities & student life</div>
              </button>
              
              <button 
                onClick={scrollToSeminars} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer hover:bg-[#104288]"
              >
                <div className="font-extrabold text-sm text-white group-hover:text-[#f3a812] transition-colors">Seminars</div>
                <div className="text-xs font-semibold mt-0.5 text-blue-200">Tech talks & guest lectures</div>
              </button>

              <button 
                onClick={scrollToVisits} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer hover:bg-[#104288]"
              >
                <div className="font-extrabold text-sm text-white group-hover:text-[#f3a812] transition-colors">Industrial Visits</div>
                <div className="text-xs font-semibold mt-0.5 text-blue-200">On-site company exposure & tours</div>
              </button>

              <button 
                onClick={scrollToEvents} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer hover:bg-[#104288]"
              >
                <div className="font-extrabold text-sm text-white group-hover:text-[#f3a812] transition-colors">Workshops</div>
                <div className="text-xs font-semibold mt-0.5 text-blue-200">Hands-on practical bootcamps</div>
              </button>

              <button 
                onClick={scrollToMentors} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer hover:bg-[#104288]"
              >
                <div className="font-extrabold text-sm text-white group-hover:text-[#f3a812] transition-colors">Mentors / Instructors</div>
                <div className="text-xs font-semibold mt-0.5 text-blue-200">Meet our industry trainers</div>
              </button>

              <button 
                onClick={scrollToEnterprices} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer hover:bg-[#104288]"
              >
                <div className="font-extrabold text-sm text-white group-hover:text-[#f3a812] transition-colors">Enterprise Training</div>
                <div className="text-xs font-semibold mt-0.5 text-blue-200">Corporate upskilling solutions</div>
              </button>

              <button 
                onClick={scrollToStories} 
                className="w-full text-left p-3 rounded-xl transition-all duration-200 group cursor-pointer hover:bg-[#104288]"
              >
                <div className="font-extrabold text-sm text-white group-hover:text-[#f3a812] transition-colors">Success Stories</div>
                <div className="text-xs font-semibold mt-0.5 text-blue-200">Member reviews & career growth</div>
              </button>

            </div>
          </div>

          {/* CONTACT & SUPPORT LINK */}
          <button 
            onClick={scrollToContact} 
            className="hover:text-[#f3a812] transition-colors py-2 focus:outline-none cursor-pointer whitespace-nowrap"
          >
            Contact & Support
          </button>

          {/* DASHBOARD LINK (WHEN LOGGED IN) */}
          {user && (
            <button
              onClick={handleDashboardClick}
              className="text-[#f3a812] hover:text-white transition-colors py-2 focus:outline-none cursor-pointer font-black whitespace-nowrap"
            >
              Dashboard
            </button>
          )}

        </div>

        {/* RIGHT SIDE: Dark Mode Toggle + Desktop Login/Profile + Mobile Hamburger */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">

          {/* DARK MODE TOGGLE BUTTON */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-300 shadow-md hover:scale-110 transform focus:outline-none cursor-pointer border border-amber-400/40 shrink-0"
            style={{
              backgroundColor: isDarkMode ? '#1e293b' : 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
            }}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            <span className="text-xs sm:text-sm leading-none select-none">
              {isDarkMode ? '☀️' : '🌙'}
            </span>
          </button>

          {/* DESKTOP LOGIN / PROFILE — hidden on mobile */}
          <div className="hidden xl:flex justify-end shrink-0">
            {user ? (
              <div className="relative dropdown py-2 shrink-0">
                <button
                  className="flex items-center gap-2 font-extrabold px-4 py-2 rounded-full text-xs sm:text-sm transition-all duration-300 shadow-md hover:scale-105 transform focus:outline-none cursor-pointer border border-amber-400/40 whitespace-nowrap shrink-0"
                  style={{
                    backgroundColor: '#f3a812',
                    color: '#104288',
                  }}
                >
                  <span className="relative flex items-center justify-center shrink-0">
                    <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#104288] text-white text-xs uppercase font-extrabold">
                      {(user.firstName?.[0] || user.email?.[0] || 'U')}
                    </span>
                    {/* Green Active Signal Dot */}
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white"></span>
                    </span>
                  </span>
                  <span className="font-black whitespace-nowrap truncate max-w-[120px] inline-block">{displayName}</span>
                  <span className="text-xs shrink-0">▾</span>
                </button>

                <div
                  className="dropdown-menu absolute top-full right-0 w-56 rounded-xl shadow-2xl p-1.5 text-left z-50 transition-all duration-200 border"
                  style={{ backgroundColor: '#0c336b', borderColor: 'rgba(243, 168, 18, 0.3)' }}
                >
                  <div
                    className="px-2.5 py-2 rounded-lg mb-1 flex items-center justify-between border-b border-blue-800/80"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="font-extrabold text-sm leading-tight truncate text-white">
                        {displayName}
                      </div>
                      <div className="text-[11px] font-semibold leading-tight mt-0.5 truncate text-blue-200">
                        {user.email}
                      </div>
                      {user.role && (
                        <div className="text-[10px] font-bold mt-0.5 uppercase leading-tight text-[#f3a812]">
                          {user.role}
                        </div>
                      )}
                    </div>
                    {/* Active Signal Badge */}
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/40 rounded-full text-[10px] font-extrabold text-emerald-300 shrink-0">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span>Active</span>
                    </div>
                  </div>

                  <button
                    onClick={handleDashboardClick}
                    className="w-full text-left px-2.5 py-2 rounded-lg transition-all duration-200 cursor-pointer font-extrabold text-sm leading-tight flex items-center justify-between text-white hover:bg-[#104288] hover:text-[#f3a812]"
                  >
                    <span>Dashboard</span>
                    <span className="text-xs opacity-75 font-normal">→</span>
                  </button>

                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-2.5 py-2 rounded-lg transition-all duration-200 cursor-pointer font-extrabold text-sm leading-tight text-white hover:bg-[#104288] hover:text-[#f3a812]"
                  >
                    My Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-2.5 py-2 rounded-lg transition-all duration-200 cursor-pointer font-extrabold text-sm leading-tight text-rose-400 hover:bg-rose-500/20"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="font-black px-7 py-2.5 rounded-full text-sm transition-all duration-300 shadow-lg hover:scale-105 hover:shadow-xl transform focus:outline-none cursor-pointer border border-amber-400/50"
                style={{
                  backgroundColor: '#f3a812',
                  color: '#104288',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#104288';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3a812';
                  e.currentTarget.style.color = '#104288';
                }}
              >
                Login
              </button>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON — visible only on mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 focus:outline-none cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              /* X Close Icon */
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              /* Hamburger Icon */
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

      </nav>

      {/* ═══════════════════════════════════════════════════════
          MOBILE MENU OVERLAY — slides down from navbar
      ═══════════════════════════════════════════════════════ */}
      {mobileMenuOpen && (
        <div 
          className="xl:hidden pointer-events-auto fixed inset-0 top-[68px] z-40"
          onClick={() => setMobileMenuOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Menu Panel */}
          <div 
            className="relative mx-3 mt-2 rounded-2xl shadow-2xl border overflow-hidden"
            style={{ 
              backgroundColor: '#104288', 
              borderColor: 'rgba(243, 168, 18, 0.3)',
              maxHeight: 'calc(100vh - 90px)',
              animation: 'slideDown 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
              @keyframes slideDown {
                from { opacity: 0; transform: translateY(-15px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>

            <div className="overflow-y-auto p-4 space-y-1" style={{ maxHeight: 'calc(100vh - 110px)' }}>

              {/* User info banner (when logged in) */}
              {user && (
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2 border-b border-blue-700/60">
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#f3a812] text-[#104288] text-sm uppercase font-extrabold shrink-0">
                    {(user.firstName?.[0] || user.email?.[0] || 'U')}
                  </span>
                  <div className="min-w-0">
                    <div className="font-extrabold text-sm text-white truncate">{displayName}</div>
                    <div className="text-[11px] font-semibold text-blue-200 truncate">{user.email}</div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/40 rounded-full text-[9px] font-extrabold text-emerald-300 shrink-0 ml-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Active
                  </div>
                </div>
              )}

              {/* Nav Links */}
              <button onClick={() => mobileNav(scrollToEvents)} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/10 hover:text-[#f3a812] transition-all cursor-pointer">
                Events
              </button>

              <button onClick={() => mobileNav(scrollToCourses)} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/10 hover:text-[#f3a812] transition-all cursor-pointer">
                Courses
              </button>

              <button onClick={() => mobileNav(scrollToGallery)} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/10 hover:text-[#f3a812] transition-all cursor-pointer">
                Gallery
              </button>

              <button onClick={() => mobileNav(scrollToRewards)} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/10 hover:text-[#f3a812] transition-all cursor-pointer">
                Rewards
              </button>

              {/* RESOURCES ACCORDION */}
              <div>
                <button 
                  onClick={() => setResourcesOpen(!resourcesOpen)} 
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>Resources</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${resourcesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {resourcesOpen && (
                  <div className="pl-4 space-y-0.5 mt-1">
                    <button onClick={() => mobileNav(() => scrollToResources('blog'))} className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-blue-200 hover:text-[#f3a812] hover:bg-white/5 transition-all cursor-pointer">
                      📚 Library / Blog
                    </button>
                    <button onClick={() => mobileNav(scrollToCourses)} className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-blue-200 hover:text-[#f3a812] hover:bg-white/5 transition-all cursor-pointer">
                      🎓 Free & Career Courses
                    </button>
                    <button onClick={() => mobileNav(() => scrollToResources('forum'))} className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-blue-200 hover:text-[#f3a812] hover:bg-white/5 transition-all cursor-pointer">
                      💬 Community Forum
                    </button>
                    <button onClick={() => mobileNav(() => scrollToResources('newsletter'))} className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-blue-200 hover:text-[#f3a812] hover:bg-white/5 transition-all cursor-pointer">
                      📰 Newsletter
                    </button>
                  </div>
                )}
              </div>

              {/* ABOUT ACCORDION */}
              <div>
                <button 
                  onClick={() => setAboutOpen(!aboutOpen)} 
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>About</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${aboutOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {aboutOpen && (
                  <div className="pl-4 space-y-0.5 mt-1">
                    <button onClick={() => mobileNav(scrollToMissionVision)} className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-blue-200 hover:text-[#f3a812] hover:bg-white/5 transition-all cursor-pointer">
                      🎯 Mission & Vision
                    </button>
                    <button onClick={() => mobileNav(scrollToGallery)} className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-blue-200 hover:text-[#f3a812] hover:bg-white/5 transition-all cursor-pointer">
                      📸 Campus Gallery
                    </button>
                    <button onClick={() => mobileNav(scrollToSeminars)} className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-blue-200 hover:text-[#f3a812] hover:bg-white/5 transition-all cursor-pointer">
                      🎤 Seminars
                    </button>
                    <button onClick={() => mobileNav(scrollToVisits)} className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-blue-200 hover:text-[#f3a812] hover:bg-white/5 transition-all cursor-pointer">
                      🏭 Industrial Visits
                    </button>
                    <button onClick={() => mobileNav(scrollToEvents)} className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-blue-200 hover:text-[#f3a812] hover:bg-white/5 transition-all cursor-pointer">
                      🛠 Workshops
                    </button>
                    <button onClick={() => mobileNav(scrollToMentors)} className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-blue-200 hover:text-[#f3a812] hover:bg-white/5 transition-all cursor-pointer">
                      👨‍🏫 Mentors / Instructors
                    </button>
                    <button onClick={() => mobileNav(scrollToEnterprices)} className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-blue-200 hover:text-[#f3a812] hover:bg-white/5 transition-all cursor-pointer">
                      🏢 Enterprise Training
                    </button>
                    <button onClick={() => mobileNav(scrollToStories)} className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-blue-200 hover:text-[#f3a812] hover:bg-white/5 transition-all cursor-pointer">
                      ⭐ Success Stories
                    </button>
                  </div>
                )}
              </div>

              <button onClick={() => mobileNav(scrollToContact)} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/10 hover:text-[#f3a812] transition-all cursor-pointer">
                Contact & Support
              </button>

              {/* Divider */}
              <div className="border-t border-blue-700/60 my-2" />

              {/* Dashboard & Profile (logged in) */}
              {user && (
                <>
                  <button onClick={() => mobileNav(handleDashboardClick)} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-[#f3a812] hover:bg-white/10 transition-all cursor-pointer flex items-center justify-between">
                    <span>Dashboard</span>
                    <span className="text-xs opacity-75">→</span>
                  </button>
                  <button onClick={() => mobileNav(handleProfileClick)} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/10 hover:text-[#f3a812] transition-all cursor-pointer">
                    My Profile
                  </button>
                </>
              )}

              {/* LOGIN / LOGOUT BUTTON */}
              <div className="pt-2">
                {user ? (
                  <button
                    onClick={() => mobileNav(handleLogout)}
                    className="w-full py-3 rounded-xl text-sm font-black transition-all cursor-pointer text-center bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => mobileNav(handleLoginClick)}
                    className="w-full py-3 rounded-xl text-sm font-black transition-all cursor-pointer text-center shadow-lg border border-amber-400/50"
                    style={{ backgroundColor: '#f3a812', color: '#104288' }}
                  >
                    Login
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </header>
  );
}