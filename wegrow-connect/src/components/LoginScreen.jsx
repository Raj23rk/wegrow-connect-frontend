import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login Success:', data);
      } else {
        alert(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Back button click - Sets session flag so home page knows to skip splash screen
  const handleBackClick = () => {
    navigate('/home');
  };

  return (
    <div 
      className="min-h-screen w-full m-0 bg-white overflow-x-hidden flex items-center justify-center relative animate-fade-in"
      style={{
        backgroundImage: "url('/login/bg.png')",
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fadeIn 3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .login-btn:hover {
          opacity: 0.95;
          transform: translateY(-1px);
          box-shadow: 0 6px 12px rgba(249, 115, 22, 0.3) !important;
        }
        .back-btn:hover {
          background-color: #f8fafc !important;
          border-color: #f97316 !important;
          color: #f97316 !important;
        }
        .auth-link:hover {
          color: #104288 !important;
          text-decoration: none !important;
        }
      `}</style>

      {/* ========================================================== */}
      {/* "START YOUR JOURNEY" TEXT */}
      {/* ========================================================== */}
      <div style={{ position: 'absolute', left: '380px', top: '250px', width: '48%', zIndex: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2 style={{ fontSize: '25px', fontWeight: 600, color: '#242222', lineHeight: 1.4 }}>
            Start Your Journey of Skill, <br />
            Grow Your Future, <br />
            Succeed Forever.
          </h2>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '40px' }}>
        
        {/* LEFT SIDE: EMPTY SPACE FOR LAYOUT BALANCING */}
        <div style={{ width: '48%', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '130px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', opacity: 0 }}>
            <h2 style={{ fontSize: '32px', fontWeight: 600, lineHeight: 1.4 }}>
              Start Your Journey of Skill, <br />
              Grow Your Future, <br />
              Succeed Forever.
            </h2>
          </div>
        </div>

        {/* RIGHT SIDE CONTAINER */}
        <div style={{ position: 'relative', left: '80px', top: '-30px', width: '52%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingRight: '40px' }}>
          
          {/* WEGROW LOGO */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', left: '15px' }}>
            <img src="/login/wegrow-logo.png" alt="WeGrow Text Logo" style={{ width: '240px', height: '75px', objectFit: 'contain' }} />
            <img src="/login/logo.jpg" alt="WeGrow Emblem" style={{ position: 'absolute', left: '-35px', top: '2px', width: '75px', height: '75px', objectFit: 'contain' }} />
          </div>
          
          {/* FORM CONTAINER */}
          <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '390px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* INPUT BOXES */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
              <input 
                type="text" 
                placeholder="Email / User ID" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-full border-2 border-[#104288] focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-[15px] font-semibold text-[#374151] bg-white/90 transition-all duration-200"
                style={{ padding: '14px 22px' }}
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-full border-2 border-[#104288] focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-[15px] font-semibold text-[#374151] bg-white/90 transition-all duration-200"
                style={{ padding: '14px 22px' }}
              />
            </div>

            {/* BUTTONS */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', gap: '10px', marginBottom: '16px' }}>
              <button 
                type="submit"
                disabled={loading}
                className="login-btn"
                style={{ width: '50%', padding: '14px', borderRadius: '9999px', fontWeight: 800, color: 'white', fontSize: '16px', border: 'none', cursor: 'pointer', background: 'linear-gradient(90deg, #f97316 0%, #104288 100%)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'all 0.2s ease', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
              
              <button 
                type="button"
                onClick={handleBackClick}
                className="back-btn"
                style={{ width: '50%', padding: '14px', borderRadius: '9999px', fontWeight: 700, color: '#104288', fontSize: '14px', border: '2px solid #104288', cursor: 'pointer', backgroundColor: 'white', transition: 'all 0.2s ease' }}
              >
                ← BACK
              </button>
            </div>

          </form>

          {/* LINKS */}
          <div style={{ width: '100%', maxWidth: '390px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, padding: '0 4px', marginBottom: '24px' }}>
            <a href="#forgot" onClick={(e) => e.preventDefault()} className="auth-link" style={{ color: '#4b5563', textDecoration: 'none', transition: 'color 0.2s' }}>Forgot Password?</a>
            <a href="#register" onClick={(e) => e.preventDefault()} className="auth-link" style={{ color: '#4b5563', textDecoration: 'none', transition: 'color 0.2s' }}>New User? Register Now</a>
          </div>

          {/* TAGLINE */}
          <div style={{ position: 'absolute', left: '55px', top: '365px', width: '390px', textAlign: 'center', zIndex: 10 }}>
            <p style={{ fontSize: '11px', fontWeight: 800, color: '#104288', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
              Shape Your Future With The Right Skills !
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}