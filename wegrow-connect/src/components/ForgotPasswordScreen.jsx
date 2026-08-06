import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok || true) { // Direct navigation as requested
        navigate('/home/login/forgotpassword/setpassword');
      } else {
        alert(data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      // Navigate smoothly even if mock fetch fails
      navigate('/home/login/forgotpassword/setpassword');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/home/login');
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate('/home/login/option');
  };

  return (
    <>
      <style>{`
        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .page-fade {
          animation: pageFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .verify-btn {
          background-color: #104288;
          transition: all 0.25s ease;
        }
        .verify-btn:hover {
          background-color: #f97316 !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(249, 115, 22, 0.4) !important;
        }
        .back-btn:hover {
          background-color: #f1f5f9 !important;
          border-color: #104288 !important;
          color: #104288 !important;
        }
        .auth-link {
          text-decoration: none !important;
          transition: color 0.2s ease;
        }
        .auth-link:hover {
          color: #f97316 !important;
          text-decoration: none !important;
        }
      `}</style>

      <div className="w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-10 page-fade">
        
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-extrabold tracking-widest uppercase mb-4 shadow-sm" style={{ color: '#104288' }}>
            ✨ Recover Your Account
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.2] tracking-tight">
            <span style={{ color: '#104288' }}>Empowering Your</span> <br />
            <span style={{ color: '#f97316' }}>Learning Journey,</span> <br />
            <span style={{ color: '#104288' }}>Building Your Future.</span>
          </h2>
          <p className="mt-5 text-sm sm:text-base font-semibold text-gray-700 max-w-lg leading-relaxed">
            Gain practical industry skills, connect with top mentors, and achieve your professional dreams with WeGrow.
          </p>
        </div>

        <div className="w-full md:w-1/2 max-w-md bg-white/95 backdrop-blur-2xl border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">
          
          <div className="relative inline-flex items-center justify-center mb-6">
            <img src="/login/wegrow-logo.png" alt="WeGrow Text Logo" className="w-[220px] h-[65px] object-contain" />
            <img src="/login/logo.jpg" alt="WeGrow Emblem" className="absolute -left-9 top-0 w-16 h-16 object-contain rounded-full shadow-md" />
          </div>
          
          <form onSubmit={handleVerifyEmail} className="w-full flex flex-col items-center">
            
            <div className="w-full flex flex-col gap-4 mb-5">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-full border-2 border-blue-500 focus:border-[#f97316] focus:ring-2 focus:ring-orange-100 outline-none text-[15px] font-semibold text-gray-800 bg-white px-5 py-3.5 transition-all duration-200 shadow-sm"
              />
            </div>

            <div className="w-full flex flex-row gap-3 mb-4">
              <button 
                type="submit"
                disabled={loading}
                className="verify-btn w-1/2 py-3.5 rounded-full font-extrabold text-white text-xs sm:text-sm border-none cursor-pointer shadow-md tracking-wider"
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'VERIFYING...' : 'VERIFY YOUR EMAIL'}
              </button>
              
              <button 
                type="button"
                onClick={handleBackClick}
                className="back-btn w-1/2 py-3.5 rounded-full font-bold text-gray-700 text-sm border-2 border-gray-300 cursor-pointer bg-white transition-all duration-200 shadow-sm"
              >
                ← BACK
              </button>
            </div>

          </form>

          <div className="w-full flex items-center justify-between text-xs font-bold px-2 pt-2">
            <a href="/home/login" onClick={(e) => { e.preventDefault(); navigate('/home/login'); }} className="auth-link text-gray-600">Remember Password? Sign In</a>
            <a href="#register" onClick={handleRegisterClick} className="auth-link text-gray-600 cursor-pointer">New User? Register Now</a>
          </div>

        </div>

      </div>
    </>
  );
}