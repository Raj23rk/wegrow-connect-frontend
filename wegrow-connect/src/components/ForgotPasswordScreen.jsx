<<<<<<< HEAD
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function ForgotPasswordScreen() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Custom Modal State for Alerts
//   const [modalConfig, setModalConfig] = useState({
//     isOpen: false,
//     title: '',
//     message: ''
//   });

//   const showAlert = (title, message) => {
//     setModalConfig({ isOpen: true, title, message });
//   };

//   const handleVerifyEmail = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch('/auth/forgot-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();

//       if (response.ok || true) { 
//         navigate('/home/login/forgotpassword/setpassword');
//       } else {
//         showAlert("Error", data.message || 'Something went wrong.');
//       }
//     } catch (error) {
//       console.error('Network Error:', error);
//       navigate('/home/login/forgotpassword/setpassword');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBackClick = () => {
//     navigate('/home/login');
//   };

//   const handleRegisterClick = (e) => {
//     e.preventDefault();
//     navigate('/home/login/option');
//   };

//   const handleAlertModalClose = () => {
//     setModalConfig({ isOpen: false, title: '', message: '' });
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
//         .verify-btn {
//           background-color: #104288;
//           transition: all 0.25s ease;
//         }
//         .verify-btn:hover {
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

//       {/* CUSTOM DESIGNED ALERT MODAL */}
//       {modalConfig.isOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 transform transition-all">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 text-3xl">
//               ⚠️
//             </div>
//             <h3 className="text-xl font-black text-gray-900 mb-2">{modalConfig.title}</h3>
//             <p className="text-xs font-semibold text-gray-500 mb-6 leading-relaxed">
//               {modalConfig.message}
//             </p>
//             <button
//               onClick={handleAlertModalClose}
//               className="w-full py-3 rounded-full bg-[#104288] hover:bg-[#f97316] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-10 page-fade">
        
//         <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
//           <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-extrabold tracking-widest uppercase mb-4 shadow-sm" style={{ color: '#104288' }}>
//             ✨ Recover Your Account
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

//         <div className="w-full md:w-1/2 max-w-md bg-white/95 backdrop-blur-2xl border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">
          
//           {/* WEGROW LOGO WITH REDUCED GAP & NO ROUND WRAPPER */}
//           <div className="flex items-center justify-center mb-6">
//             <img src="/login/logo.jpg" alt="Logo Icon" className="w-12 h-12 object-contain relative z-10" />
//             <img src="/login/wegrow-logo.png" alt="WeGrow Text Logo" className="w-[160px] h-[48px] object-contain -ml-6 relative z-0" />
//           </div>
          
//           <form onSubmit={handleVerifyEmail} className="w-full flex flex-col items-center">
            
//             <div className="w-full flex flex-col gap-4 mb-5">
//               <input 
//                 type="email" 
//                 placeholder="Enter your email" 
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full rounded-full border-2 border-blue-500 focus:border-[#f97316] focus:ring-2 focus:ring-orange-100 outline-none text-[15px] font-semibold text-gray-800 bg-white px-5 py-3.5 transition-all duration-200 shadow-sm"
//               />
//             </div>

//             <div className="w-full flex flex-row gap-3 mb-4">
//               <button 
//                 type="submit"
//                 disabled={loading}
//                 className="verify-btn w-1/2 py-3.5 rounded-full font-extrabold text-white text-xs sm:text-sm border-none cursor-pointer shadow-md tracking-wider"
//                 style={{ opacity: loading ? 0.7 : 1 }}
//               >
//                 {loading ? 'VERIFYING...' : 'VERIFY YOUR EMAIL'}
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

//           <div className="w-full flex items-center justify-between text-xs font-bold px-2 pt-2">
//             <a href="/home/login" onClick={(e) => { e.preventDefault(); navigate('/home/login'); }} className="auth-link text-gray-600">Remember Password? Sign In</a>
//             <a href="#register" onClick={handleRegisterClick} className="auth-link text-gray-600 cursor-pointer">New User? Register Now</a>
//           </div>

//         </div>

//       </div>
//     </>
//   );
// }


=======
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
<<<<<<< HEAD

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // =====================================================
  // API CONFIGURATION
  // =====================================================

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    'http://13.239.234.181:4000/api/v1';

  // Forgot Password API
  const FORGOT_PASSWORD_API =
    `${API_BASE_URL}/users/forgot-password`;

  // =====================================================
  // CUSTOM MODAL STATE
  // =====================================================

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
  });

  const showAlert = (title, message) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
    });
  };

  const handleAlertModalClose = () => {
    setModalConfig({
      isOpen: false,
      title: '',
      message: '',
    });
  };

  // =====================================================
  // VERIFY EMAIL
  // =====================================================


const handleVerifyEmail = async (e) => {
  e.preventDefault();

  if (!email.trim()) {
    showAlert(
      'Invalid Email',
      'Please enter your email address.'
    );
    return;
  }

  setLoading(true);

  try {
    console.log('Forgot Password API:', FORGOT_PASSWORD_API);
    console.log('Request Email:', email);

    const response = await fetch(FORGOT_PASSWORD_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
      }),
    });

    let data = {};

    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Invalid JSON response:', jsonError);
    }

    console.log('API Status:', response.status);
    console.log('API Response:', data);

    // =====================================================
    // SUCCESS
    // =====================================================

    if (response.ok) {
      showAlert(
        'Check Your Email',
        data.message ||
          'A password reset link has been sent to your email. Please open your email and click the verification link to create a new password.'
      );

      // IMPORTANT:
      // Do NOT navigate to the Set Password page here.
      // The user must click the reset link received by email.

      return;
    }

    // =====================================================
    // API ERROR
    // =====================================================

    showAlert(
      'Verification Failed',
      data.message ||
        'Unable to process your request. Please check your email and try again.'
    );

  } catch (error) {
    console.error('Network Error:', error);

    showAlert(
      'Connection Error',
      'Unable to connect to the server. Please check your internet connection or try again later.'
    );

  } finally {
    setLoading(false);
  }
};


  // =====================================================
  // BACK
  // =====================================================
=======
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Custom Modal State for Alerts
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: ''
  });

  const showAlert = (title, message) => {
    setModalConfig({ isOpen: true, title, message });
  };

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

      if (response.ok || true) { 
        navigate('/home/login/forgotpassword/setpassword');
      } else {
        showAlert("Error", data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      navigate('/home/login/forgotpassword/setpassword');
    } finally {
      setLoading(false);
    }
  };
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640

  const handleBackClick = () => {
    navigate('/home/login');
  };

<<<<<<< HEAD
  // =====================================================
  // REGISTER
  // =====================================================

=======
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate('/home/login/option');
  };

<<<<<<< HEAD
  return (
    <>
      {/* =====================================================
          CUSTOM CSS
      ===================================================== */}

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
          animation: pageFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1)
            forwards;
        }

=======
  const handleAlertModalClose = () => {
    setModalConfig({ isOpen: false, title: '', message: '' });
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
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
        .verify-btn {
          background-color: #104288;
          transition: all 0.25s ease;
        }
<<<<<<< HEAD

=======
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
        .verify-btn:hover {
          background-color: #f97316 !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(249, 115, 22, 0.4) !important;
        }
<<<<<<< HEAD

=======
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
        .back-btn:hover {
          background-color: #f1f5f9 !important;
          border-color: #104288 !important;
          color: #104288 !important;
        }
<<<<<<< HEAD

=======
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
        .auth-link {
          text-decoration: none !important;
          transition: color 0.2s ease;
        }
<<<<<<< HEAD

=======
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
        .auth-link:hover {
          color: #f97316 !important;
          text-decoration: none !important;
        }
      `}</style>

<<<<<<< HEAD
      {/* =====================================================
          CUSTOM ALERT MODAL
      ===================================================== */}

      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 transform transition-all">

            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 text-3xl">
              ⚠️
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-2">
              {modalConfig.title}
            </h3>

            <p className="text-xs font-semibold text-gray-500 mb-6 leading-relaxed">
              {modalConfig.message}
            </p>

=======
      {/* CUSTOM DESIGNED ALERT MODAL */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 transform transition-all">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 text-3xl">
              ⚠️
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">{modalConfig.title}</h3>
            <p className="text-xs font-semibold text-gray-500 mb-6 leading-relaxed">
              {modalConfig.message}
            </p>
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
            <button
              onClick={handleAlertModalClose}
              className="w-full py-3 rounded-full bg-[#104288] hover:bg-[#f97316] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}

<<<<<<< HEAD
      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-10 page-fade">

        {/* =====================================================
            LEFT CONTENT
        ===================================================== */}

        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">

          <div
            className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-extrabold tracking-widest uppercase mb-4 shadow-sm"
            style={{ color: '#104288' }}
          >
            ✨ Recover Your Account
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
            Gain practical industry skills, connect with top mentors,
            and achieve your professional dreams with WeGrow.
          </p>

        </div>

        {/* =====================================================
            FORGOT PASSWORD CARD
        ===================================================== */}

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

          {/* =====================================================
              FORM
          ===================================================== */}

          <form
            onSubmit={handleVerifyEmail}
            className="w-full flex flex-col items-center"
          >

            <div className="w-full flex flex-col gap-4 mb-5">

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full rounded-full border-2 border-blue-500 focus:border-[#f97316] focus:ring-2 focus:ring-orange-100 outline-none text-[15px] font-semibold text-gray-800 bg-white px-5 py-3.5 transition-all duration-200 shadow-sm"
              />

            </div>

            {/* BUTTONS */}

            <div className="w-full flex flex-row gap-3 mb-4">

              <button
                type="submit"
                disabled={loading}
                className="verify-btn w-1/2 py-3.5 rounded-full font-extrabold text-white text-xs sm:text-sm border-none cursor-pointer shadow-md tracking-wider"
                style={{
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading
                  ? 'VERIFYING...'
                  : 'VERIFY YOUR EMAIL'}
              </button>

              <button
                type="button"
                onClick={handleBackClick}
                disabled={loading}
=======
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
          
          {/* WEGROW LOGO WITH REDUCED GAP & NO ROUND WRAPPER */}
          <div className="flex items-center justify-center mb-6">
            <img src="/login/logo.jpg" alt="Logo Icon" className="w-12 h-12 object-contain relative z-10" />
            <img src="/login/wegrow-logo.png" alt="WeGrow Text Logo" className="w-[160px] h-[48px] object-contain -ml-6 relative z-0" />
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
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
                className="back-btn w-1/2 py-3.5 rounded-full font-bold text-gray-700 text-sm border-2 border-gray-300 cursor-pointer bg-white transition-all duration-200 shadow-sm"
              >
                ← BACK
              </button>
<<<<<<< HEAD

=======
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
            </div>

          </form>

<<<<<<< HEAD
          {/* =====================================================
              FOOTER LINKS
          ===================================================== */}

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

=======
          <div className="w-full flex items-center justify-between text-xs font-bold px-2 pt-2">
            <a href="/home/login" onClick={(e) => { e.preventDefault(); navigate('/home/login'); }} className="auth-link text-gray-600">Remember Password? Sign In</a>
            <a href="#register" onClick={handleRegisterClick} className="auth-link text-gray-600 cursor-pointer">New User? Register Now</a>
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
          </div>

        </div>

      </div>
    </>
  );
<<<<<<< HEAD
}

=======
}
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
