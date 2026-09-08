import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const handleLoginClick = () => {
    setMobileMenuOpen(false);
    navigate('/home/login');
  };

  const handleJoinClick = () => {
    setMobileMenuOpen(false);
    navigate('/home/login/option');
  };

  const handleProfileClick = () => {
    setMobileMenuOpen(false);
    navigate('/home/profile');
  };

  const handleDashboardClick = () => {
    setMobileMenuOpen(false);
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
      setMobileMenuOpen(false);
    }
  };

  const mobileNav = (action) => {
    setMobileMenuOpen(false);
    setResourcesOpen(false);
    setAboutOpen(false);
    if (action) action();
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none">
        
<<<<<<< HEAD
        {/* Topbar: Contact, Hours, Socials, Login */}
=======
        {/* LOGO SECTION */}
        <div className="flex items-center shrink-0">
          <button 
            onClick={scrollToHero} 
            className="flex items-center hover:opacity-95 transition text-left focus:outline-none cursor-pointer"
          >
            <div className="flex items-center bg-white/95 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl shadow-sm border border-white/40">
              <img 
                src="/wegrow-logo.webp" 
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
>>>>>>> fb63be6546a298c0b0afb298ed5ab45207d0edbf
        <div 
          className={`pointer-events-auto bg-[#061325] text-white/80 text-[12px] overflow-hidden transition-all duration-300 border-b border-white/10 ${
            isScrolled ? 'max-h-0 opacity-0 py-0' : 'max-h-10 opacity-100 py-2'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <a 
                href="tel:+919900011234" 
                className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-[#FFC862] transition"
              >
                <svg className="w-3.5 h-3.5 text-[#FFC862]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>+91 99000 11234</span>
              </a>
              <span className="hidden md:inline text-white/60">
                Mon–Sat, 10:00 AM – 7:00 PM
              </span>
            </div>

            <div className="flex items-center gap-5">
              {user ? (
                <button 
                  onClick={handleDashboardClick}
                  className="font-bold text-[#FFC862] hover:text-white transition cursor-pointer"
                >
                  Dashboard ({user.firstName || user.email?.split('@')[0]})
                </button>
              ) : (
                <button 
                  onClick={handleLoginClick} 
                  className="font-semibold text-white hover:text-[#FFC862] transition cursor-pointer"
                >
                  Member Login
                </button>
              )}

              <div className="hidden sm:flex items-center gap-3.5 text-white/70">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#FFC862] transition" title="Instagram">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#FFC862] transition" title="LinkedIn">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#FFC862] transition" title="YouTube">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <header 
          className={`pointer-events-auto w-full transition-all duration-300 ${
            isScrolled 
              ? 'py-2.5 bg-[#FAF6ED]/95 dark:bg-[#061325]/95 backdrop-blur-md shadow-lg border-b border-blue-900/10 dark:border-slate-800' 
              : 'py-3.5 bg-[#FAF6ED]/90 dark:bg-[#061325]/90 backdrop-blur-sm'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
            
            {/* Brand Logo */}
            <button 
              onClick={scrollToHero}
              className="flex items-center gap-2.5 focus:outline-none cursor-pointer text-left shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#104288] flex items-center justify-center text-[#FFC862] shadow-md shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21V11M12 11C8 11 5 8 5 4c4 0 7 3 7 7Zm0 0c4 0 7-3 7-7-4 0-7 3-7 7Z"/>
                </svg>
              </div>
              <div>
                <span className="font-serif text-lg sm:text-xl font-bold text-[#104288] dark:text-white leading-none block">
                  WeGrow
                </span>
                <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-[#C9821E] uppercase block mt-0.5">
                  B-School
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-6 text-xs 2xl:text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
              <button 
                onClick={scrollToHero}
                className="hover:text-[#104288] dark:hover:text-[#60a5fa] transition py-1 focus:outline-none cursor-pointer"
              >
                Home
              </button>

              <button 
                onClick={scrollToEvents}
                className="hover:text-[#104288] dark:hover:text-[#60a5fa] transition py-1 focus:outline-none cursor-pointer flex items-center gap-1.5"
              >
                <span>Events</span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#FF6A45] animate-pulse" title="Live session announced"></span>
              </button>

              <button 
                onClick={scrollToCourses}
                className="hover:text-[#104288] dark:hover:text-[#60a5fa] transition py-1 focus:outline-none cursor-pointer"
              >
                Courses
              </button>

              <button 
                onClick={scrollToGallery}
                className="hover:text-[#104288] dark:hover:text-[#60a5fa] transition py-1 focus:outline-none cursor-pointer"
              >
                Gallery
              </button>

              <button 
                onClick={scrollToRewards}
                className="hover:text-[#104288] dark:hover:text-[#60a5fa] transition py-1 focus:outline-none cursor-pointer"
              >
                Rewards
              </button>

              {/* Resources Dropdown */}
              <div className="relative dropdown py-1">
                <button className="flex items-center gap-1 hover:text-[#104288] dark:hover:text-[#60a5fa] transition focus:outline-none cursor-pointer">
                  Resources <span className="text-xs">▾</span>
                </button>
                <div className="dropdown-menu absolute top-full -left-4 w-64 rounded-2xl shadow-2xl p-2.5 bg-white dark:bg-[#0c336b] border border-blue-900/10 dark:border-slate-700 text-left z-50">
                  <button onClick={() => scrollToResources('blog')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#104288] transition cursor-pointer">
                    <div className="font-bold text-xs text-slate-800 dark:text-white">Library / Blog</div>
                    <div className="text-[11px] text-slate-500 dark:text-blue-200 mt-0.5">Articles & Guides</div>
                  </button>
                  <button onClick={scrollToCourses} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#104288] transition cursor-pointer">
                    <div className="font-bold text-xs text-slate-800 dark:text-white">Career Courses</div>
                    <div className="text-[11px] text-slate-500 dark:text-blue-200 mt-0.5">Certifications & programs</div>
                  </button>
                  <button onClick={() => scrollToResources('forum')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#104288] transition cursor-pointer">
                    <div className="font-bold text-xs text-slate-800 dark:text-white">Community Forum</div>
                    <div className="text-[11px] text-slate-500 dark:text-blue-200 mt-0.5">Member networking</div>
                  </button>
                  <button onClick={() => scrollToResources('newsletter')} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#104288] transition cursor-pointer">
                    <div className="font-bold text-xs text-slate-800 dark:text-white">Newsletter</div>
                    <div className="text-[11px] text-slate-500 dark:text-blue-200 mt-0.5">Latest updates</div>
                  </button>
                </div>
              </div>

              {/* About Dropdown */}
              <div className="relative dropdown py-1">
                <button className="flex items-center gap-1 hover:text-[#104288] dark:hover:text-[#60a5fa] transition focus:outline-none cursor-pointer">
                  About <span className="text-xs">▾</span>
                </button>
                <div className="dropdown-menu absolute top-full -left-4 w-72 rounded-2xl shadow-2xl p-2.5 bg-white dark:bg-[#0c336b] border border-blue-900/10 dark:border-slate-700 text-left z-50">
                  <button onClick={scrollToMissionVision} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#104288] transition cursor-pointer">
                    <div className="font-bold text-xs text-slate-800 dark:text-white">Mission & Vision</div>
                    <div className="text-[11px] text-slate-500 dark:text-blue-200 mt-0.5">Our purpose & pillars</div>
                  </button>
                  <button onClick={scrollToSeminars} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#104288] transition cursor-pointer">
                    <div className="font-bold text-xs text-slate-800 dark:text-white">Seminars & Masterclasses</div>
                    <div className="text-[11px] text-slate-500 dark:text-blue-200 mt-0.5">Tech talks & executive sessions</div>
                  </button>
                  <button onClick={scrollToVisits} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#104288] transition cursor-pointer">
                    <div className="font-bold text-xs text-slate-800 dark:text-white">Industrial Visits</div>
                    <div className="text-[11px] text-slate-500 dark:text-blue-200 mt-0.5">Company tours & factory floors</div>
                  </button>
                  <button onClick={scrollToMentors} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#104288] transition cursor-pointer">
                    <div className="font-bold text-xs text-slate-800 dark:text-white">Mentors / Faculty</div>
                    <div className="text-[11px] text-slate-500 dark:text-blue-200 mt-0.5">Meet our industry leaders</div>
                  </button>
                  <button onClick={scrollToEnterprices} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#104288] transition cursor-pointer">
                    <div className="font-bold text-xs text-slate-800 dark:text-white">Enterprise Training</div>
                    <div className="text-[11px] text-slate-500 dark:text-blue-200 mt-0.5">Corporate upskilling</div>
                  </button>
                  <button onClick={scrollToStories} className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#104288] transition cursor-pointer">
                    <div className="font-bold text-xs text-slate-800 dark:text-white">Success Stories</div>
                    <div className="text-[11px] text-slate-500 dark:text-blue-200 mt-0.5">Member outcomes & reviews</div>
                  </button>
                </div>
              </div>

              <button 
                onClick={scrollToContact}
                className="hover:text-[#104288] dark:hover:text-[#60a5fa] transition py-1 focus:outline-none cursor-pointer"
              >
                Contact & Support
              </button>

              {user && (
                <button
                  onClick={handleDashboardClick}
                  className="text-[#FF6A45] hover:text-[#FF8A69] transition py-1 focus:outline-none cursor-pointer font-bold"
                >
                  Dashboard
                </button>
              )}
            </nav>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              
              {/* Dark mode button */}
              <button
                type="button"
                onClick={toggleDarkMode}
                className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition cursor-pointer text-xs"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>

              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={handleProfileClick}
                    className="px-4 py-2 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-3.5 py-2 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="hidden sm:inline-block text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#104288] dark:hover:text-[#60a5fa] transition cursor-pointer px-2"
                >
                  Member Login
                </button>
              )}

              {/* Join WeGrow CTA */}
              <button
                onClick={handleJoinClick}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#FF6A45] hover:bg-[#FF8A69] text-white font-bold text-xs tracking-wide shadow-md shadow-orange-500/20 hover:-translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Join WeGrow</span>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden w-9 h-9 rounded-xl border border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-1.5 focus:outline-none cursor-pointer ml-1"
                aria-label="Toggle navigation menu"
              >
                <span className={`w-4 h-[1.8px] bg-slate-800 dark:bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-[5px]' : ''}`}></span>
                <span className={`w-4 h-[1.8px] bg-slate-800 dark:bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-4 h-[1.8px] bg-slate-800 dark:bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`}></span>
              </button>

            </div>

          </div>
        </header>

      </div>

      {/* Mobile Drawer Backdrop Scrim */}
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Mobile Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 bottom-0 z-50 w-[310px] max-w-[85vw] bg-[#061325] text-white p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 xl:hidden overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#104288] flex items-center justify-center text-[#FFC862]">
                <span className="font-serif font-bold text-sm">W</span>
              </div>
              <span className="font-serif font-bold text-white text-base">WeGrow B-School</span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="w-8 h-8 rounded-full text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col py-4 space-y-1 text-left">
            <button onClick={() => mobileNav(scrollToHero)} className="w-full text-left py-2.5 px-3 rounded-xl font-bold text-sm text-slate-200 hover:bg-white/10 hover:text-[#FFC862] transition cursor-pointer">
              Home
            </button>
            <button onClick={() => mobileNav(scrollToEvents)} className="w-full text-left py-2.5 px-3 rounded-xl font-bold text-sm text-slate-200 hover:bg-white/10 hover:text-[#FFC862] transition cursor-pointer flex items-center justify-between">
              <span>Events</span>
              <span className="w-2 h-2 rounded-full bg-[#FF6A45] animate-pulse"></span>
            </button>
            <button onClick={() => mobileNav(scrollToCourses)} className="w-full text-left py-2.5 px-3 rounded-xl font-bold text-sm text-slate-200 hover:bg-white/10 hover:text-[#FFC862] transition cursor-pointer">
              Courses
            </button>
            <button onClick={() => mobileNav(scrollToGallery)} className="w-full text-left py-2.5 px-3 rounded-xl font-bold text-sm text-slate-200 hover:bg-white/10 hover:text-[#FFC862] transition cursor-pointer">
              Gallery
            </button>
            <button onClick={() => mobileNav(scrollToRewards)} className="w-full text-left py-2.5 px-3 rounded-xl font-bold text-sm text-slate-200 hover:bg-white/10 hover:text-[#FFC862] transition cursor-pointer">
              Rewards
            </button>

            {/* Resources Accordion */}
            <div>
              <button 
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className="w-full text-left py-2.5 px-3 rounded-xl font-bold text-sm text-slate-200 hover:bg-white/10 transition cursor-pointer flex items-center justify-between"
              >
                <span>Resources</span>
                <span className={`text-xs transition-transform ${resourcesOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {resourcesOpen && (
                <div className="pl-4 py-1 space-y-1 border-l border-white/10 ml-3">
                  <button onClick={() => mobileNav(() => scrollToResources('blog'))} className="w-full text-left py-1.5 px-2 text-xs text-slate-300 hover:text-[#FFC862]">Library / Blog</button>
                  <button onClick={() => mobileNav(scrollToCourses)} className="w-full text-left py-1.5 px-2 text-xs text-slate-300 hover:text-[#FFC862]">Career Courses</button>
                  <button onClick={() => mobileNav(() => scrollToResources('forum'))} className="w-full text-left py-1.5 px-2 text-xs text-slate-300 hover:text-[#FFC862]">Community Forum</button>
                  <button onClick={() => mobileNav(() => scrollToResources('newsletter'))} className="w-full text-left py-1.5 px-2 text-xs text-slate-300 hover:text-[#FFC862]">Newsletter</button>
                </div>
              )}
            </div>

            {/* About Accordion */}
            <div>
              <button 
                onClick={() => setAboutOpen(!aboutOpen)}
                className="w-full text-left py-2.5 px-3 rounded-xl font-bold text-sm text-slate-200 hover:bg-white/10 transition cursor-pointer flex items-center justify-between"
              >
                <span>About</span>
                <span className={`text-xs transition-transform ${aboutOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {aboutOpen && (
                <div className="pl-4 py-1 space-y-1 border-l border-white/10 ml-3">
                  <button onClick={() => mobileNav(scrollToMissionVision)} className="w-full text-left py-1.5 px-2 text-xs text-slate-300 hover:text-[#FFC862]">Mission & Vision</button>
                  <button onClick={() => mobileNav(scrollToSeminars)} className="w-full text-left py-1.5 px-2 text-xs text-slate-300 hover:text-[#FFC862]">Seminars</button>
                  <button onClick={() => mobileNav(scrollToVisits)} className="w-full text-left py-1.5 px-2 text-xs text-slate-300 hover:text-[#FFC862]">Industrial Visits</button>
                  <button onClick={() => mobileNav(scrollToMentors)} className="w-full text-left py-1.5 px-2 text-xs text-slate-300 hover:text-[#FFC862]">Mentors / Faculty</button>
                  <button onClick={() => mobileNav(scrollToEnterprices)} className="w-full text-left py-1.5 px-2 text-xs text-slate-300 hover:text-[#FFC862]">Enterprise Training</button>
                  <button onClick={() => mobileNav(scrollToStories)} className="w-full text-left py-1.5 px-2 text-xs text-slate-300 hover:text-[#FFC862]">Success Stories</button>
                </div>
              )}
            </div>

            <button onClick={() => mobileNav(scrollToContact)} className="w-full text-left py-2.5 px-3 rounded-xl font-bold text-sm text-slate-200 hover:bg-white/10 hover:text-[#FFC862] transition cursor-pointer">
              Contact & Support
            </button>
          </div>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5 text-left">
          {user ? (
            <>
              <button
                onClick={handleDashboardClick}
                className="w-full py-2.5 rounded-full bg-[#104288] text-white font-bold text-xs uppercase tracking-wider text-center cursor-pointer"
              >
                Go to Dashboard
              </button>
              <button
                onClick={handleProfileClick}
                className="w-full py-2 rounded-full border border-white/20 text-slate-300 font-semibold text-xs text-center cursor-pointer"
              >
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-2 rounded-full bg-rose-500/20 text-rose-300 font-semibold text-xs text-center cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={handleLoginClick}
              className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider text-center cursor-pointer"
            >
              Member Login
            </button>
          )}

          <button
            onClick={handleJoinClick}
            className="w-full py-3 rounded-full bg-[#FF6A45] hover:bg-[#FF8A69] text-white font-bold text-xs uppercase tracking-wider shadow-lg text-center cursor-pointer"
          >
            Join WeGrow
          </button>
        </div>
      </div>
    </>
  );
}