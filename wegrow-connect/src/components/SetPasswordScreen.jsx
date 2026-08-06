import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SetPasswordScreen() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Custom Alert State instead of browser alert
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    isSuccess: false
  });

  const showAlert = (title, message, isSuccess = false) => {
    setModalConfig({ isOpen: true, title, message, isSuccess });
  };

  const handleSetPassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showAlert("Mismatch Error", "Passwords do not match! Please check again.", false);
      return;
    }

    // Validation for Caps, Small, Number, Special Character, and Min length 8
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      showAlert(
        "Weak Password", 
        "Password must be at least 8 characters long and include at least one uppercase letter (A-Z), one lowercase letter (a-z), one number (0-9), and one special character (@$!%*?&).", 
        false
      );
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      showAlert("Success!", "Password updated successfully! Redirecting to login...", true);
    }, 1000);
  };

  const handleModalClose = () => {
    const isSuccess = modalConfig.isSuccess;
    setModalConfig({ isOpen: false, title: '', message: '', isSuccess: false });
    if (isSuccess) {
      navigate('/home/login');
    }
  };

  const handleBackClick = () => {
    navigate('/home/login/forgotpassword');
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
        .set-btn {
          background-color: #104288;
          transition: all 0.25s ease;
        }
        .set-btn:hover {
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

      {/* CUSTOM DESIGNED MODAL POPUP */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 transform transition-all">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl ${modalConfig.isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {modalConfig.isSuccess ? '✓' : '⚠️'}
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">{modalConfig.title}</h3>
            <p className="text-xs font-semibold text-gray-500 mb-6 leading-relaxed">
              {modalConfig.message}
            </p>
            <button
              onClick={handleModalClose}
              className="w-full py-3 rounded-full bg-[#104288] hover:bg-[#f97316] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-10 page-fade">
        
        {/* LEFT SIDE CONTENT */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-extrabold tracking-widest uppercase mb-4 shadow-sm" style={{ color: '#104288' }}>
            ✨ Reset Password
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

        {/* RIGHT SIDE SET PASSWORD FORM CARD */}
        <div className="w-full md:w-1/2 max-w-md bg-white/95 backdrop-blur-2xl border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">
          
          {/* WEGROW LOGO */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <img src="/login/wegrow-logo.png" alt="WeGrow Text Logo" className="w-[220px] h-[65px] object-contain" />
            <img src="/login/logo.jpg" alt="WeGrow Emblem" className="absolute -left-9 top-0 w-16 h-16 object-contain rounded-full shadow-md" />
          </div>
          
          {/* FORM */}
          <form onSubmit={handleSetPassword} className="w-full flex flex-col items-center">
            
            <div className="w-full flex flex-col gap-4 mb-5">
              <input 
                type="password" 
                placeholder="New Password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full rounded-full border-2 border-blue-500 focus:border-[#f97316] focus:ring-2 focus:ring-orange-100 outline-none text-[15px] font-semibold text-gray-800 bg-white px-5 py-3.5 transition-all duration-200 shadow-sm"
              />
              <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-full border-2 border-blue-500 focus:border-[#f97316] focus:ring-2 focus:ring-orange-100 outline-none text-[15px] font-semibold text-gray-800 bg-white px-5 py-3.5 transition-all duration-200 shadow-sm"
              />
            </div>

            <div className="w-full flex flex-row gap-3 mb-4">
              <button 
                type="submit"
                disabled={loading}
                className="set-btn w-1/2 py-3.5 rounded-full font-extrabold text-white text-xs sm:text-sm border-none cursor-pointer shadow-md tracking-wider"
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'SAVING...' : 'SET PASSWORD'}
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

          {/* LINKS */}
          <div className="w-full flex items-center justify-between text-xs font-bold px-2 pt-2">
            <a href="/home/login" onClick={(e) => { e.preventDefault(); navigate('/home/login'); }} className="auth-link text-gray-600">Remember Password? Sign In</a>
            <a href="#register" onClick={handleRegisterClick} className="auth-link text-gray-600 cursor-pointer">New User? Register Now</a>
          </div>

        </div>

      </div>
    </>
  );
}