import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';
import { fetchProfile, logoutUser, clearAuthStorage } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
  const navigate = useNavigate();
  const { user: authUser, logout: authLogout } = useAuth();
  const [user, setUser] = useState(authUser);

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

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
    : '';

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent pointer-events-none pt-4">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-8 h-18 pointer-events-auto">
        
        {/* LOGO SECTION WITH ADJUSTED GAP (-ml-6) */}
        <div className="flex items-center">
          <button 
            onClick={scrollToHero} 
            className="flex items-center hover:opacity-90 transition text-left focus:outline-none cursor-pointer"
          >
            {/* 1. EMBLEM LOGO */}
            <img 
              src="/logo.jpg" 
              alt="Logo" 
              className="w-12 h-12 object-contain relative z-10" 
            />
            
            {/* 2. WEGROW TEXT LOGO */}
            <div className="flex items-center justify-start h-10 -ml-6 overflow-hidden">
              <img 
                src="/wegrow-logo.png" 
                alt="WeGrow" 
                className="w-[160px] h-[48px] object-contain max-w-none relative z-0" 
              />
            </div>
          </button>
        </div>

        {/* MENU */}
        <div className="hidden lg:flex items-center gap-7 text-sm font-bold" style={{ color: theme.textMuted }}>
          
          {/* EVENTS - NORMAL BUTTON (DROPDOWN REMOVED) */}
          <button 
            onClick={scrollToEvents} 
            className="hover:text-blue-900 transition py-2 focus:outline-none cursor-pointer"
          >
            Events
          </button>

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

          {/* ABOUT DROPDOWN (SEMINARS, VISITS, WORKSHOPS MOVED HERE) */}
          <div className="relative dropdown py-2">
            <button className="flex items-center gap-1 hover:text-blue-900 transition focus:outline-none cursor-pointer">
              About <span className="text-xs">▾</span>
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

          {/* DASHBOARD LINK (WHEN LOGGED IN) */}
          {user && (
            <button
              onClick={handleDashboardClick}
              className="hover:text-orange-600 transition py-2 focus:outline-none cursor-pointer font-extrabold"
              style={{ color: theme.orange || '#f97316' }}
            >
              Dashboard
            </button>
          )}

        </div>

        {/* LOGIN / PROFILE */}
        <div className="flex justify-end">
          {user ? (
            <div className="relative dropdown py-2">
              <button
                className="flex items-center gap-2 font-extrabold px-5 py-2.5 rounded-full text-sm transition-all duration-300 shadow-md hover:scale-105 hover:shadow-xl transform focus:outline-none cursor-pointer"
                style={{
                  backgroundColor: theme.primary,
                  color: '#ffffff',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.orange || '#f3a812';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primary;
                }}
              >
                <span className="relative flex items-center justify-center">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 text-xs uppercase font-extrabold">
                    {(user.firstName?.[0] || user.email?.[0] || 'U')}
                  </span>
                  {/* Green Active Signal Dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white"></span>
                  </span>
                </span>
                {displayName}
                <span className="text-xs">▾</span>
              </button>

              <div
                className="dropdown-menu absolute top-full right-0 w-56 backdrop-blur-xl rounded-xl shadow-2xl p-1.5 text-left z-50 transition-all duration-200"
                style={{ backgroundColor: theme.dropdownBg, border: `1px solid ${theme.cardBorder}` }}
              >
                <div
                  className="px-2.5 py-2 rounded-lg mb-1 flex items-center justify-between"
                  style={{ borderBottom: `1px solid ${theme.cardBorder}` }}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="font-extrabold text-sm leading-tight truncate" style={{ color: theme.primary }}>
                      {displayName}
                    </div>
                    <div className="text-[11px] font-semibold leading-tight mt-0.5 truncate" style={{ color: theme.textMuted }}>
                      {user.email}
                    </div>
                    {user.role && (
                      <div className="text-[10px] font-bold mt-0.5 uppercase leading-tight" style={{ color: theme.orange || '#f3a812' }}>
                        {user.role}
                      </div>
                    )}
                  </div>
                  {/* Active Signal Badge */}
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[10px] font-extrabold text-emerald-600 shrink-0">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>Active</span>
                  </div>
                </div>

                <button
                  onClick={handleDashboardClick}
                  className="w-full text-left px-2.5 py-2 rounded-lg transition-all duration-200 cursor-pointer font-extrabold text-sm leading-tight flex items-center justify-between"
                  style={{ color: theme.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.primary || '#104288';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = theme.primary;
                  }}
                >
                  <span>Dashboard</span>
                  <span className="text-xs opacity-75 font-normal">→</span>
                </button>

                <button
                  onClick={handleProfileClick}
                  className="w-full text-left px-2.5 py-2 rounded-lg transition-all duration-200 cursor-pointer font-extrabold text-sm leading-tight"
                  style={{ color: theme.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.primary || '#104288';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = theme.primary;
                  }}
                >
                  My Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-2.5 py-2 rounded-lg transition-all duration-200 cursor-pointer font-extrabold text-sm leading-tight"
                  style={{ color: '#dc2626' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleLoginClick}
              className="font-extrabold px-7 py-2.5 rounded-full text-sm transition-all duration-300 shadow-md hover:scale-105 hover:shadow-xl transform focus:outline-none cursor-pointer"
              style={{
                backgroundColor: theme.primary,
                color: '#ffffff',
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
          )}
        </div>
      </nav>
    </header>
  );
}