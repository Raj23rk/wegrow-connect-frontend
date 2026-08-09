// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function SetPasswordScreen() {
//   const navigate = useNavigate();
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Custom Alert State
//   const [modalConfig, setModalConfig] = useState({
//     isOpen: false,
//     title: '',
//     message: '',
//     isSuccess: false
//   });

//   const showAlert = (title, message, isSuccess = false) => {
//     setModalConfig({ isOpen: true, title, message, isSuccess });
//   };

//   // 5 Seconds automatic silent redirect timer when success modal is open
//   // No countdown displayed to the user.
//   useEffect(() => {
//     let timer;
//     if (modalConfig.isOpen && modalConfig.isSuccess) {
//       // Sets a timer for 5 seconds (5000ms) to navigate silently
//       timer = setTimeout(() => {
//         navigate('/home/login');
//       }, 5000);
//     }
//     // Cleanup the timer if the component unmounts or modal closes
//     return () => clearTimeout(timer);
//   }, [modalConfig.isOpen, modalConfig.isSuccess, navigate]);

//   const handleSetPassword = (e) => {
//     e.preventDefault();

//     if (newPassword !== confirmPassword) {
//       showAlert("Mismatch Error", "Passwords do not match! Please check again.", false);
//       return;
//     }

//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     if (!passwordRegex.test(newPassword)) {
//       showAlert(
//         "Weak Password", 
//         "Password must be at least 8 characters long and include at least one uppercase letter (A-Z), one lowercase letter (a-z), one number (0-9), and one special character (@$!%*?&).", 
//         false
//       );
//       return;
//     }

//     setLoading(true);

//     // Mock API call delay
//     setTimeout(() => {
//       setLoading(false);
//       // Show success message WITHOUT countdown text
//       showAlert("Success!", "Password updated successfully!", true);
//     }, 1000);
//   };

//   // Handles click on the "OK" button in the modal
//   const handleModalClose = () => {
//     const isSuccess = modalConfig.isSuccess;
//     // Close the modal immediately
//     setModalConfig({ isOpen: false, title: '', message: '', isSuccess: false });
//     // Instant navigation on button click
//     if (isSuccess) {
//       navigate('/home/login');
//     }
//   };

//   const handleBackClick = () => {
//     navigate('/home/login/forgotpassword');
//   };

//   const handleRegisterClick = (e) => {
//     e.preventDefault();
//     navigate('/home/login/option');
//   };

//   return (
//     <>
//       <style>{`
//         @keyframes pageFadeIn {
//           from { opacity: 0; transform: translateY(10px) scale(0.98); }
//           to { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         .page-fade {
//           animation: pageFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//         }
//         .set-btn {
//           background-color: #104288;
//           transition: all 0.25s ease;
//         }
//         .set-btn:hover {
//           background-color: #f97316 !important;
//           transform: translateY(-1px);
//           box-shadow: 0 8px 20px rgba(249, 115, 22, 0.4) !important;
//         }
//         .back-btn:hover {
//           background-color: #f1f5f9 !important;
//           border-color: #104288 !important;
//           color: #104288 !important;
//         }
//         .auth-link {
//           text-decoration: none !important;
//           transition: color 0.2s ease;
//         }
//         .auth-link:hover {
//           color: #f97316 !important;
//           text-decoration: none !important;
//         }
//       `}</style>

//       {/* CUSTOM DESIGNED SUCCESS / ALERT MODAL */}
//       {modalConfig.isOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 transform transition-all">
//             <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl ${modalConfig.isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
//               {modalConfig.isSuccess ? '✓' : '⚠️'}
//             </div>
//             <h3 className="text-xl font-black text-gray-900 mb-2">{modalConfig.title}</h3>
//             <p className="text-xs font-semibold text-gray-500 mb-6 leading-relaxed">
//               {modalConfig.message}
//             </p>
//             <button
//               onClick={handleModalClose}
//               className="w-full py-3 rounded-full bg-[#104288] hover:bg-[#f97316] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-10 page-fade">
        
//         {/* LEFT SIDE CONTENT */}
//         <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
//           <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-extrabold tracking-widest uppercase mb-4 shadow-sm" style={{ color: '#104288' }}>
//             ✨ Reset Password
//           </div>
//           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.2] tracking-tight">
//             <span style={{ color: '#104288' }}>Empowering Your</span> <br />
//             <span style={{ color: '#f97316' }}>Learning Journey,</span> <br />
//             <span style={{ color: '#104288' }}>Building Your Future.</span>
//           </h2>
//           <p className="mt-5 text-sm sm:text-base font-semibold text-gray-700 max-w-lg leading-relaxed">
//             Gain practical industry skills, connect with top mentors, and achieve your professional dreams with WeGrow.
//           </p>
//         </div>

//         {/* RIGHT SIDE SET PASSWORD FORM CARD */}
//         <div className="w-full md:w-1/2 max-w-md bg-white/95 backdrop-blur-2xl border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">
          
//           {/* WEGROW LOGO WITH REDUCED GAP & NO ROUND WRAPPER */}
//           <div className="flex items-center justify-center mb-6">
//             <img src="/login/logo.jpg" alt="Logo Icon" className="w-12 h-12 object-contain relative z-10" />
//             <img src="/login/wegrow-logo.png" alt="WeGrow Text Logo" className="w-[160px] h-[48px] object-contain -ml-6 relative z-0" />
//           </div>
          
//           {/* FORM */}
//           <form onSubmit={handleSetPassword} className="w-full flex flex-col items-center">
            
//             <div className="w-full flex flex-col gap-4 mb-5">
//               <input 
//                 type="password" 
//                 placeholder="New Password" 
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 required
//                 className="w-full rounded-full border-2 border-blue-500 focus:border-[#f97316] focus:ring-2 focus:ring-orange-100 outline-none text-[15px] font-semibold text-gray-800 bg-white px-5 py-3.5 transition-all duration-200 shadow-sm"
//               />
//               <input 
//                 type="password" 
//                 placeholder="Confirm Password" 
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//                 className="w-full rounded-full border-2 border-blue-500 focus:border-[#f97316] focus:ring-2 focus:ring-orange-100 outline-none text-[15px] font-semibold text-gray-800 bg-white px-5 py-3.5 transition-all duration-200 shadow-sm"
//               />
//             </div>

//             <div className="w-full flex flex-row gap-3 mb-4">
//               <button 
//                 type="submit"
//                 disabled={loading}
//                 className="set-btn w-1/2 py-3.5 rounded-full font-extrabold text-white text-xs sm:text-sm border-none cursor-pointer shadow-md tracking-wider"
//                 style={{ opacity: loading ? 0.7 : 1 }}
//               >
//                 {loading ? 'SAVING...' : 'SET PASSWORD'}
//               </button>
              
//               <button 
//                 type="button"
//                 onClick={handleBackClick}
//                 className="back-btn w-1/2 py-3.5 rounded-full font-bold text-gray-700 text-sm border-2 border-gray-300 cursor-pointer bg-white transition-all duration-200 shadow-sm"
//               >
//                 ← BACK
//               </button>
//             </div>

//           </form>

//           {/* LINKS */}
//           <div className="w-full flex items-center justify-between text-xs font-bold px-2 pt-2">
//             <a href="/home/login" onClick={(e) => { e.preventDefault(); navigate('/home/login'); }} className="auth-link text-gray-600">Remember Password? Sign In</a>
//             <a href="#register" onClick={handleRegisterClick} className="auth-link text-gray-600 cursor-pointer">New User? Register Now</a>
//           </div>

//         </div>

//       </div>
//     </>
//   );
// }


import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SetPasswordScreen() {
  const navigate = useNavigate();

  // =====================================================
  // GET TOKEN FROM URL
  // Example:
  // /setpassword?token=44df8d6088fe...
  // =====================================================

  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');

  // =====================================================
  // API CONFIGURATION
  // =====================================================

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:4000/api/v1';

  const RESET_PASSWORD_API =
    `${API_BASE_URL}/users/reset-password`;

  // =====================================================
  // FORM STATE
  // =====================================================

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // =====================================================
  // CUSTOM ALERT STATE
  // =====================================================

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    isSuccess: false,
  });

  const showAlert = (
    title,
    message,
    isSuccess = false
  ) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      isSuccess,
    });
  };

  // =====================================================
  // SUCCESS AUTO REDIRECT
  // =====================================================

  useEffect(() => {
    let timer;

    if (
      modalConfig.isOpen &&
      modalConfig.isSuccess
    ) {
      timer = setTimeout(() => {
        navigate('/home/login');
      }, 5000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [
    modalConfig.isOpen,
    modalConfig.isSuccess,
    navigate,
  ]);

  // =====================================================
  // CHECK TOKEN
  // =====================================================

  useEffect(() => {
    if (!token) {
      showAlert(
        'Invalid Reset Link',
        'The password reset link is invalid or missing. Please request a new password reset link.'
      );
    }
  }, [token]);

  // =====================================================
  // SET PASSWORD
  // =====================================================

  const handleSetPassword = async (e) => {
    e.preventDefault();

    // =====================================================
    // CHECK TOKEN
    // =====================================================

    if (!token) {
      showAlert(
        'Invalid Reset Link',
        'The password reset token is missing. Please open the password reset link from your email.'
      );
      return;
    }

    // =====================================================
    // CHECK PASSWORD MATCH
    // =====================================================

    if (newPassword !== confirmPassword) {
      showAlert(
        'Mismatch Error',
        'Passwords do not match! Please check again.'
      );
      return;
    }

    // =====================================================
    // PASSWORD VALIDATION
    // =====================================================

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      showAlert(
        'Weak Password',
        'Password must be at least 8 characters long and include at least one uppercase letter (A-Z), one lowercase letter (a-z), one number (0-9), and one special character (@$!%*?&).'
      );
      return;
    }

    // =====================================================
    // START API REQUEST
    // =====================================================

    setLoading(true);

    try {
      console.log(
        'Reset Password API:',
        RESET_PASSWORD_API
      );

      console.log(
        'Reset Token:',
        token
      );

      // ===================================================
      // API CALL
      // ===================================================

      const response = await fetch(
        RESET_PASSWORD_API,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            token: token,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
          }),
        }
      );

      // ===================================================
      // PARSE RESPONSE
      // ===================================================

      let data = {};

      try {
        data = await response.json();
      } catch (jsonError) {
        console.error(
          'Invalid JSON response:',
          jsonError
        );
      }

      console.log(
        'Reset Password Status:',
        response.status
      );

      console.log(
        'Reset Password Response:',
        data
      );

      // ===================================================
      // SUCCESS
      // ===================================================

      if (response.ok) {
        setNewPassword('');
        setConfirmPassword('');

        showAlert(
          'Success!',
          data.message ||
            'Password updated successfully! You can now login with your new password.',
          true
        );

        return;
      }

      // ===================================================
      // API ERROR
      // ===================================================

      showAlert(
        'Password Reset Failed',
        data.message ||
          'Unable to reset your password. The reset link may have expired or is invalid.'
      );

    } catch (error) {
      console.error(
        'Reset Password Network Error:',
        error
      );

      showAlert(
        'Connection Error',
        'Unable to connect to the server. Please check your internet connection and try again.'
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // MODAL CLOSE
  // =====================================================

  const handleModalClose = () => {
    const isSuccess =
      modalConfig.isSuccess;

    setModalConfig({
      isOpen: false,
      title: '',
      message: '',
      isSuccess: false,
    });

    if (isSuccess) {
      navigate('/home/login');
    }
  };

  // =====================================================
  // BACK
  // =====================================================

  const handleBackClick = () => {
    navigate(
      '/home/login/forgotpassword'
    );
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const handleRegisterClick = (e) => {
    e.preventDefault();

    navigate('/home/login/option');
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      {/* =================================================
          CSS
      ================================================= */}

      <style>{`
        @keyframes pageFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .page-fade {
          animation: pageFadeIn 0.45s
            cubic-bezier(0.16, 1, 0.3, 1)
            forwards;
        }

        .set-btn {
          background-color: #104288;
          transition: all 0.25s ease;
        }

        .set-btn:hover {
          background-color: #f97316 !important;
          transform: translateY(-1px);
          box-shadow:
            0 8px 20px
            rgba(249, 115, 22, 0.4) !important;
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

      {/* =================================================
          CUSTOM ALERT MODAL
      ================================================= */}

      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 transform transition-all">

            {/* ICON */}

            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl ${
                modalConfig.isSuccess
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {modalConfig.isSuccess
                ? '✓'
                : '⚠️'}
            </div>

            {/* TITLE */}

            <h3 className="text-xl font-black text-gray-900 mb-2">
              {modalConfig.title}
            </h3>

            {/* MESSAGE */}

            <p className="text-xs font-semibold text-gray-500 mb-6 leading-relaxed">
              {modalConfig.message}
            </p>

            {/* OK */}

            <button
              onClick={handleModalClose}
              className="w-full py-3 rounded-full bg-[#104288] hover:bg-[#f97316] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              OK
            </button>

          </div>
        </div>
      )}

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-10 page-fade">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">

          <div
            className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-extrabold tracking-widest uppercase mb-4 shadow-sm"
            style={{ color: '#104288' }}
          >
            ✨ Reset Password
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.2] tracking-tight">

            <span style={{ color: '#104288' }}>
              Empowering Your
            </span>

            <br />

            <span style={{ color: '#f97316' }}>
              Learning Journey,
            </span>

            <br />

            <span style={{ color: '#104288' }}>
              Building Your Future.
            </span>

          </h2>

          <p className="mt-5 text-sm sm:text-base font-semibold text-gray-700 max-w-lg leading-relaxed">
            Gain practical industry skills, connect with top mentors, and achieve your professional dreams with WeGrow.
          </p>

        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="w-full md:w-1/2 max-w-md bg-white/95 backdrop-blur-2xl border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">

          {/* LOGO */}

          <div className="flex items-center justify-center mb-6">

            <img
              src="/login/logo.jpg"
              alt="Logo Icon"
              className="w-12 h-12 object-contain relative z-10"
            />

            <img
              src="/login/wegrow-logo.png"
              alt="WeGrow Text Logo"
              className="w-[160px] h-[48px] object-contain -ml-6 relative z-0"
            />

          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSetPassword}
            className="w-full flex flex-col items-center"
          >

            <div className="w-full flex flex-col gap-4 mb-5">

              {/* NEW PASSWORD */}

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                required
                disabled={loading}
                className="w-full rounded-full border-2 border-blue-500 focus:border-[#f97316] focus:ring-2 focus:ring-orange-100 outline-none text-[15px] font-semibold text-gray-800 bg-white px-5 py-3.5 transition-all duration-200 shadow-sm"
              />

              {/* CONFIRM PASSWORD */}

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
                disabled={loading}
                className="w-full rounded-full border-2 border-blue-500 focus:border-[#f97316] focus:ring-2 focus:ring-orange-100 outline-none text-[15px] font-semibold text-gray-800 bg-white px-5 py-3.5 transition-all duration-200 shadow-sm"
              />

            </div>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="w-full flex flex-row gap-3 mb-4">

              <button
                type="submit"
                disabled={loading || !token}
                className="set-btn w-1/2 py-3.5 rounded-full font-extrabold text-white text-xs sm:text-sm border-none cursor-pointer shadow-md tracking-wider"
                style={{
                  opacity:
                    loading || !token
                      ? 0.7
                      : 1,

                  cursor:
                    loading || !token
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >
                {loading
                  ? 'SAVING...'
                  : 'SET PASSWORD'}
              </button>

              <button
                type="button"
                onClick={handleBackClick}
                disabled={loading}
                className="back-btn w-1/2 py-3.5 rounded-full font-bold text-gray-700 text-sm border-2 border-gray-300 cursor-pointer bg-white transition-all duration-200 shadow-sm"
              >
                ← BACK
              </button>

            </div>

          </form>

          {/* =================================================
              LINKS
          ================================================= */}

          <div className="w-full flex items-center justify-between text-xs font-bold px-2 pt-2">

            <a
              href="/home/login"
              onClick={(e) => {
                e.preventDefault();
                navigate('/home/login');
              }}
              className="auth-link text-gray-600"
            >
              Remember Password? Sign In
            </a>

            <a
              href="#register"
              onClick={handleRegisterClick}
              className="auth-link text-gray-600 cursor-pointer"
            >
              New User? Register Now
            </a>

          </div>

        </div>

      </div>
    </>
  );
}

