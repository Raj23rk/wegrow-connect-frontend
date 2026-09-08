import React, { useState, useEffect, useRef } from 'react';
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
  const [activeMenu, setActiveMenu] = useState('home');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileUserOpen, setMobileUserOpen] = useState(false);
  const userMenuRef = useRef(null);

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.name || user?.username || user?.email?.split('@')[0] || 'Member';
  const firstName = user?.firstName || user?.name?.split(' ')[0] || user?.username || user?.email?.split('@')[0] || 'Member';

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

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLoginClick = () => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    navigate('/home/login');
  };

  const handleJoinClick = () => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    navigate('/home/login/option');
  };

  const handleProfileClick = () => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    navigate('/home/profile');
  };

  const handleDashboardClick = () => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
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
      setUserMenuOpen(false);
    }
  };

  const handleNavClick = (menuId, action) => {
    setActiveMenu(menuId);
    if (action) action();
  };

  const mobileNav = (menuId, action) => {
    if (menuId) setActiveMenu(menuId);
    setMobileMenuOpen(false);
    setResourcesOpen(false);
    setAboutOpen(false);
    if (action) action();
  };

  const getNavClass = (menuId) => {
    const isActive = activeMenu === menuId;
    return `group relative px-2.5 py-1.5 2xl:px-3 rounded-xl text-xs 2xl:text-[13px] font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap focus:outline-none active:scale-95 select-none ${
      isActive
        ? 'text-[#104288] dark:text-[#FFC862] font-bold bg-gradient-to-r from-blue-50/95 via-indigo-50/80 to-blue-50/95 dark:from-[#104288]/45 dark:via-[#1655ab]/30 dark:to-[#104288]/45 shadow-xs ring-1 ring-[#104288]/20 dark:ring-[#FFC862]/30 animate-nav-pop'
        : 'text-slate-600 dark:text-slate-200 hover:text-[#104288] dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5 hover:-translate-y-0.5'
    }`;
  };

  const renderIndicator = (menuId) => {
    const isActive = activeMenu === menuId;
    if (isActive) {
      return (
        <span className="absolute -bottom-1 left-2 right-2 h-[2.5px] rounded-full bg-gradient-to-r from-[#104288] via-[#FF6A45] to-[#FFC862] shadow-[0_2px_8px_rgba(255,106,69,0.5)] animate-glow-bar pointer-events-none" />
      );
    }
    return (
      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#104288]/40 dark:bg-white/40 rounded-full group-hover:w-3/4 transition-all duration-300 pointer-events-none" />
    );
  };

  const getMobileNavClass = (menuId) => {
    const isActive = activeMenu === menuId;
    return `group w-full text-left py-2.5 px-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer flex items-center justify-between active:scale-98 ${
      isActive
        ? 'bg-gradient-to-r from-[#104288] via-[#1655ab] to-[#1e69d2] text-[#FFC862] shadow-md shadow-blue-950/40 border-l-4 border-[#FFC862] translate-x-1'
        : 'text-slate-200 hover:bg-white/10 hover:text-white hover:translate-x-0.5'
    }`;
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none">

        {/* Topbar: Contact, Hours, Socials, Login */}
        <div
          className={`pointer-events-auto bg-[#061325] text-white/80 text-[12px] overflow-hidden transition-all duration-300 border-b border-white/10 ${
            isScrolled ? 'max-h-0 opacity-0 py-0' : 'max-h-10 opacity-100 py-2'
          }`}
        >
          <div className="w-full max-w-[1480px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <a
                href="tel:+919344037331"
                className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-[#FFC862] transition"
              >
                <svg className="w-3.5 h-3.5 text-[#FFC862]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                <span>+91 93440 37331</span>
              </a>
              <span className="hidden md:inline text-white/60">
                Mon–Sat, 10:00 AM – 7:00 PM
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              {user ? (
                <button
                  onClick={handleDashboardClick}
                  className="font-bold text-[#FFC862] hover:text-white transition cursor-pointer text-xs flex items-center gap-1.5"
                  title="Go to Dashboard"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse shrink-0"></span>
                  <span className="truncate max-w-[160px] sm:max-w-none">{fullName}</span>
                </button>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="font-semibold text-white hover:text-[#FFC862] transition cursor-pointer text-xs"
                >
                  Member Login
                </button>
              )}

              {/* Theme Toggle in Topbar for both Mobile & Desktop */}
              <button
                type="button"
                onClick={toggleDarkMode}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer text-xs border border-white/15 shrink-0"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <span>{isDarkMode ? '☀️' : '🌙'}</span>
                <span className="text-[11px] font-medium hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
              </button>

              <div className="hidden sm:flex items-center gap-3.5 text-white/70">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#FFC862] transition" title="Instagram">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#FFC862] transition" title="LinkedIn">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#FFC862] transition" title="YouTube">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <header
          className={`pointer-events-auto w-full transition-all duration-300 ${
            isScrolled
              ? 'py-2 bg-white/95 dark:bg-[#061325]/95 backdrop-blur-md shadow-md border-b border-slate-200/80 dark:border-slate-800'
              : 'py-2.5 sm:py-3 bg-white/95 dark:bg-[#061325]/95 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800/50 shadow-xs'
          }`}
        >
          <div className="w-full max-w-[1480px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 lg:gap-4">

            {/* Brand Logo */}
            <button
              onClick={() => handleNavClick('home', scrollToHero)}
              className="flex items-center gap-2 focus:outline-none cursor-pointer text-left shrink-0 hover:opacity-90 active:scale-98 transition-all"
            >
              <div className="flex items-center">
                <img
                  src="/wegrow-logo.webp"
                  alt="WeGrow B School"
                  className="h-8 sm:h-9 md:h-10 w-auto object-contain max-w-none dark:brightness-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 xl:gap-1.5 2xl:gap-2.5 text-xs 2xl:text-[13px] font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
              <button
                onClick={() => handleNavClick('home', scrollToHero)}
                className={getNavClass('home')}
              >
                <span className="relative z-10">Home</span>
                {renderIndicator('home')}
              </button>

              <button
                onClick={() => handleNavClick('who-can-join', scrollToEvents)}
                className={getNavClass('who-can-join')}
              >
                <span className="relative z-10">Who Can Join</span>
                {renderIndicator('who-can-join')}
              </button>

              <button
                onClick={() => handleNavClick('vision-mission', scrollToMissionVision)}
                className={getNavClass('vision-mission')}
              >
                <span className="relative z-10">Vision & Mission</span>
                {renderIndicator('vision-mission')}
              </button>

              <button
                onClick={() => handleNavClick('why-wegrow', scrollToGallery)}
                className={getNavClass('why-wegrow')}
              >
                <span className="relative z-10">Why WeGrow</span>
                {renderIndicator('why-wegrow')}
              </button>

              <button
                onClick={() => handleNavClick('programmes', scrollToCourses)}
                className={getNavClass('programmes')}
              >
                <span className="relative z-10">Programmes</span>
                {renderIndicator('programmes')}
              </button>

              <button
                onClick={() => handleNavClick('faculty', scrollToMentors)}
                className={getNavClass('faculty')}
              >
                <span className="relative z-10">Faculty</span>
                {renderIndicator('faculty')}
              </button>

              <button
                onClick={() => handleNavClick('events', scrollToEvents)}
                className={`${getNavClass('events')} flex items-center gap-1.5`}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>Events</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-[#FF6A45] animate-pulse" title="Live session announced"></span>
                </span>
                {renderIndicator('events')}
              </button>

              {/* Resources Dropdown */}
              <div className="relative dropdown">
                <button
                  onClick={() => handleNavClick('resources', null)}
                  className={`${getNavClass('resources')} flex items-center gap-1`}
                >
                  <span className="relative z-10 flex items-center gap-1">
                    <span>Resources</span>
                    <span className="text-[10px] transition-transform duration-200 group-hover:rotate-180">▾</span>
                  </span>
                  {renderIndicator('resources')}
                </button>
                <div className="dropdown-menu absolute top-full -left-4 w-64 rounded-2xl shadow-2xl p-2.5 bg-white/95 dark:bg-[#0c336b]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/80 text-left z-50">
                  <button onClick={() => handleNavClick('resources', () => scrollToResources('blog'))} className="group/item w-full text-left p-2.5 rounded-xl hover:bg-blue-50/80 dark:hover:bg-[#104288] transition-all cursor-pointer">
                    <div className="font-bold text-xs text-slate-800 dark:text-white group-hover/item:text-[#104288] dark:group-hover/item:text-[#FFC862] transition-colors">Library / Blog</div>
                    <div className="text-[11px] text-slate-500 dark:text-blue-200 mt-0.5">Articles & Guides</div>
                  </button>
                  <button onClick={() => handleNavClick('programmes', scrollToCourses)} className="group/item w-full text-left p-2.5 rounded-xl hover:bg-blue-50/80 dark:hover:bg-[#104288] transition-all cursor-pointer">
                    <div className="font-bold text-xs text-slate-800 dark:text-white group-hover/item:text-[#104288] dark:group-hover/item:text-[#FFC862] transition-colors">Career Courses</div>
                    <div className="text-[11px] text-slate-500 dark:text-blue-200 mt-0.5">Certifications & programs</div>
                  </button>
                  <button onClick={() => handleNavClick('resources', () => scrollToResources('forum'))} className="group/item w-full text-left p-2.5 rounded-xl hover:bg-blue-50/80 dark:hover:bg-[#104288] transition-all cursor-pointer">
                    <div className="font-bold text-xs text-slate-800 dark:text-white group-hover/item:text-[#104288] dark:group-hover/item:text-[#FFC862] transition-colors">Community Forum</div>
                    <div className="text-[11px] text-slate-500 dark:text-blue-200 mt-0.5">Member networking</div>
                  </button>
                  <button onClick={() => handleNavClick('resources', () => scrollToResources('newsletter'))} className="group/item w-full text-left p-2.5 rounded-xl hover:bg-blue-50/80 dark:hover:bg-[#104288] transition-all cursor-pointer">
                    <div className="font-bold text-xs text-slate-800 dark:text-white group-hover/item:text-[#104288] dark:group-hover/item:text-[#FFC862] transition-colors">Newsletter</div>
                    <div className="text-[11px] text-slate-500 dark:text-blue-200 mt-0.5">Latest updates</div>
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleNavClick('stories', scrollToStories)}
                className={getNavClass('stories')}
              >
                <span className="relative z-10">Stories</span>
                {renderIndicator('stories')}
              </button>

              <button
                onClick={() => handleNavClick('contact', scrollToContact)}
                className={getNavClass('contact')}
              >
                <span className="relative z-10">Contact & Support</span>
                {renderIndicator('contact')}
              </button>

              {user && (
                <div ref={userMenuRef} className="relative py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenu('user-menu');
                      setUserMenuOpen((prev) => !prev);
                    }}
                    className={`group relative px-2.5 py-1.5 2xl:px-3 rounded-xl text-xs 2xl:text-[13px] font-bold transition-all duration-300 cursor-pointer whitespace-nowrap focus:outline-none active:scale-95 flex items-center gap-1.5 ${
                      userMenuOpen || activeMenu === 'user-menu' || activeMenu === 'dashboard' || activeMenu === 'profile'
                        ? 'text-[#104288] dark:text-[#FFC862] font-bold bg-gradient-to-r from-blue-50/95 via-indigo-50/80 to-blue-50/95 dark:from-[#104288]/45 dark:via-[#1655ab]/30 dark:to-[#104288]/45 shadow-xs ring-1 ring-[#104288]/20 dark:ring-[#FFC862]/30 animate-nav-pop'
                        : 'text-slate-700 dark:text-slate-200 hover:text-[#104288] dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5 hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Green active dot */}
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    </span>

                    {/* User Name */}
                    <span className="relative z-10">{firstName}</span>

                    {/* Caret */}
                    <span className={`text-[10px] text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white transition-transform duration-200 ${userMenuOpen ? 'rotate-180 text-[#104288] dark:text-[#FFC862]' : ''}`}>▾</span>

                    {renderIndicator('user-menu')}
                  </button>

                  {/* Dropdown Menu: Opened when name is clicked, stays open while choosing menu options, closes on outside click */}
                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-1.5 w-44 rounded-xl shadow-xl p-1.5 bg-white dark:bg-[#0c1f38] border border-slate-200 dark:border-slate-700/80 text-left z-50">
                      {/* Dashboard Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleNavClick('dashboard', handleDashboardClick);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50/80 dark:hover:bg-white/10 transition-all cursor-pointer flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#104288] dark:hover:text-[#FFC862]"
                      >
                        <svg className="w-3.5 h-3.5 text-[#104288] dark:text-[#FFC862]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                        <span>Dashboard</span>
                      </button>

                      {/* Profile Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleNavClick('profile', handleProfileClick);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50/80 dark:hover:bg-white/10 transition-all cursor-pointer flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#104288] dark:hover:text-[#FFC862]"
                      >
                        <svg className="w-3.5 h-3.5 text-[#104288] dark:text-[#FFC862]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <span>Profile</span>
                      </button>

                      {/* Divider & Sign Out */}
                      <div className="border-t border-slate-100 dark:border-white/10 my-1"></div>

                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 transition-all cursor-pointer flex items-center gap-2.5 text-xs font-semibold"
                      >
                        <svg className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </nav>

            {/* Header Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">

              {!user && (
                <button
                  onClick={handleJoinClick}
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#FF6A45] hover:bg-[#FF8A69] text-white font-bold text-xs tracking-wide shadow-md shadow-orange-500/20 hover:-translate-y-0.5 transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Join WeGrow</span>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
              )}

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden w-9 h-9 rounded-xl border border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-1.5 focus:outline-none cursor-pointer shrink-0 ml-0.5"
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
            <div className="flex items-center">
              <img
                src="/wegrow-logo.webp"
                alt="WeGrow B School"
                className="h-7 w-auto object-contain dark:brightness-110"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleDarkMode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer text-xs border border-white/15 transition active:scale-95"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <span>{isDarkMode ? '☀️' : '🌙'}</span>
                <span className="text-[11px] font-semibold">{isDarkMode ? 'Light' : 'Dark'}</span>
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-white flex items-center justify-center cursor-pointer hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col py-4 space-y-1.5 text-left">
            <button
              onClick={() => mobileNav('home', scrollToHero)}
              className={getMobileNavClass('home')}
            >
              <span>Home</span>
              {activeMenu === 'home' && (
                <span className="w-2 h-2 rounded-full bg-[#FFC862] shadow-[0_0_8px_#FFC862] animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => mobileNav('who-can-join', scrollToEvents)}
              className={getMobileNavClass('who-can-join')}
            >
              <span>Who Can Join</span>
              {activeMenu === 'who-can-join' && (
                <span className="w-2 h-2 rounded-full bg-[#FFC862] shadow-[0_0_8px_#FFC862] animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => mobileNav('vision-mission', scrollToMissionVision)}
              className={getMobileNavClass('vision-mission')}
            >
              <span>Vision & Mission</span>
              {activeMenu === 'vision-mission' && (
                <span className="w-2 h-2 rounded-full bg-[#FFC862] shadow-[0_0_8px_#FFC862] animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => mobileNav('why-wegrow', scrollToGallery)}
              className={getMobileNavClass('why-wegrow')}
            >
              <span>Why WeGrow</span>
              {activeMenu === 'why-wegrow' && (
                <span className="w-2 h-2 rounded-full bg-[#FFC862] shadow-[0_0_8px_#FFC862] animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => mobileNav('programmes', scrollToCourses)}
              className={getMobileNavClass('programmes')}
            >
              <span>Programmes</span>
              {activeMenu === 'programmes' && (
                <span className="w-2 h-2 rounded-full bg-[#FFC862] shadow-[0_0_8px_#FFC862] animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => mobileNav('faculty', scrollToMentors)}
              className={getMobileNavClass('faculty')}
            >
              <span>Faculty</span>
              {activeMenu === 'faculty' && (
                <span className="w-2 h-2 rounded-full bg-[#FFC862] shadow-[0_0_8px_#FFC862] animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => mobileNav('events', scrollToEvents)}
              className={getMobileNavClass('events')}
            >
              <div className="flex items-center gap-2">
                <span>Events</span>
                <span className="w-2 h-2 rounded-full bg-[#FF6A45] animate-pulse"></span>
              </div>
              {activeMenu === 'events' && (
                <span className="w-2 h-2 rounded-full bg-[#FFC862] shadow-[0_0_8px_#FFC862] animate-pulse"></span>
              )}
            </button>

            {/* Resources Accordion */}
            <div>
              <button
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className={`w-full text-left py-2.5 px-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer flex items-center justify-between ${
                  activeMenu === 'resources'
                    ? 'bg-gradient-to-r from-[#104288] via-[#1655ab] to-[#1e69d2] text-[#FFC862] shadow-md shadow-blue-950/40 border-l-4 border-[#FFC862] translate-x-1'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>Resources</span>
                <span className={`text-xs transition-transform duration-200 ${resourcesOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {resourcesOpen && (
                <div className="pl-4 py-1.5 space-y-1 border-l border-white/10 ml-3 animate-fadeIn">
                  <button onClick={() => mobileNav('resources', () => scrollToResources('blog'))} className="w-full text-left py-1.5 px-2.5 rounded-lg text-xs text-slate-300 hover:text-[#FFC862] hover:bg-white/5 transition-all">Library / Blog</button>
                  <button onClick={() => mobileNav('programmes', scrollToCourses)} className="w-full text-left py-1.5 px-2.5 rounded-lg text-xs text-slate-300 hover:text-[#FFC862] hover:bg-white/5 transition-all">Career Courses</button>
                  <button onClick={() => mobileNav('resources', () => scrollToResources('forum'))} className="w-full text-left py-1.5 px-2.5 rounded-lg text-xs text-slate-300 hover:text-[#FFC862] hover:bg-white/5 transition-all">Community Forum</button>
                  <button onClick={() => mobileNav('resources', () => scrollToResources('newsletter'))} className="w-full text-left py-1.5 px-2.5 rounded-lg text-xs text-slate-300 hover:text-[#FFC862] hover:bg-white/5 transition-all">Newsletter</button>
                </div>
              )}
            </div>

            <button
              onClick={() => mobileNav('stories', scrollToStories)}
              className={getMobileNavClass('stories')}
            >
              <span>Stories</span>
              {activeMenu === 'stories' && (
                <span className="w-2 h-2 rounded-full bg-[#FFC862] shadow-[0_0_8px_#FFC862] animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => mobileNav('contact', scrollToContact)}
              className={getMobileNavClass('contact')}
            >
              <span>Contact & Support</span>
              {activeMenu === 'contact' && (
                <span className="w-2 h-2 rounded-full bg-[#FFC862] shadow-[0_0_8px_#FFC862] animate-pulse"></span>
              )}
            </button>

            {/* User Dropdown Accordion in Mobile Nav */}
            {user && (
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => setMobileUserOpen(!mobileUserOpen)}
                  className={`w-full text-left py-2.5 px-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    activeMenu === 'dashboard' || activeMenu === 'profile' || activeMenu === 'user-menu' || mobileUserOpen
                      ? 'bg-gradient-to-r from-[#104288] via-[#1655ab] to-[#1e69d2] text-[#FFC862] shadow-md border-l-4 border-[#FFC862] translate-x-1'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_#10b981]"></span>
                    </span>
                    <span className="truncate">{fullName}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-emerald-400 font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">Active</span>
                    <span className={`text-xs text-slate-300 transition-transform duration-200 ${mobileUserOpen ? 'rotate-180 text-[#FFC862]' : ''}`}>▾</span>
                  </div>
                </button>

                {mobileUserOpen && (
                  <div className="pl-4 py-2 space-y-1.5 border-l-2 border-[#FFC862]/30 ml-3 animate-fadeIn mt-1">
                    <button
                      type="button"
                      onClick={() => mobileNav('dashboard', handleDashboardClick)}
                      className="w-full text-left py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-[#FFC862] hover:bg-white/10 transition-all flex items-center gap-2.5 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 text-[#FFC862]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                      <span>Dashboard</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => mobileNav('profile', handleProfileClick)}
                      className="w-full text-left py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-[#FFC862] hover:bg-white/10 transition-all flex items-center gap-2.5 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 text-[#FFC862]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      <span>My Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left py-2 px-2.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 transition-all flex items-center gap-2.5 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="pt-3 border-t border-white/10 flex flex-col gap-2 text-left">
          {!user ? (
            <>
              <button
                type="button"
                onClick={handleLoginClick}
                className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider text-center cursor-pointer transition"
              >
                Member Login
              </button>
              <button
                type="button"
                onClick={handleJoinClick}
                className="w-full py-2.5 rounded-full bg-[#FF6A45] hover:bg-[#FF8A69] text-white font-bold text-xs uppercase tracking-wider shadow-lg text-center cursor-pointer transition"
              >
                Join WeGrow
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              <span>Logout ({firstName})</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}