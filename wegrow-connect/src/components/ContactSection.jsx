// import React, { useState } from 'react';
// import { theme } from '../theme';

// export default function ContactSection({ contactTargetRef, contactStyle }) {
//   const [formData, setFormData] = useState({ 
//     name: '', 
//     mobile: '', 
//     email: '', 
//     aboutBusiness: false, 
//     aboutCourse: false, 
//     message: '' 
//   });
//   const [submitted, setSubmitted] = useState(false);

//   // Custom Alert Modal State
//   const [alertModal, setAlertModal] = useState({
//     isOpen: false,
//     title: '',
//     message: ''
//   });

//   const showAlert = (title, message) => {
//     setAlertModal({ isOpen: true, title, message });
//   };

//   const handlePhoneChange = (e) => {
//     let value = e.target.value.replace(/\D/g, '');
//     if (value.length > 10) value = value.slice(0, 10);
//     setFormData({ ...formData, mobile: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Check if length is less than 10 digits
//     if (formData.mobile.length !== 10) {
//       showAlert("Invalid Mobile Number", "Please enter a valid 10-digit mobile number.");
//       return;
//     }

//     // Check if it starts with 6, 7, 8, or 9
//     const firstDigit = formData.mobile.charAt(0);
//     if (!['6', '7', '8', '9'].includes(firstDigit)) {
//       showAlert("Invalid Mobile Number", "Give your valid mobile number.");
//       return;
//     }

//     setSubmitted(true);
//     setTimeout(() => {
//       setSubmitted(false);
//       handleReset();
//     }, 3000);
//   };

//   const handleReset = () => {
//     setFormData({ 
//       name: '', 
//       mobile: '', 
//       email: '', 
//       aboutBusiness: false, 
//       aboutCourse: false, 
//       message: '' 
//     });
//   };

//   return (
//     <section 
//       ref={contactTargetRef} 
//       id="contact" 
//       style={{
//         ...contactStyle,
//         willChange: 'opacity, transform'
//       }}
//       className="relative pt-0 pb-20 transition-all duration-500 ease-out transform-gpu"
//     >
//       {/* CUSTOM DESIGNED ALERT MODAL */}
//       {alertModal.isOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 transform transition-all">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 text-3xl">
//               ⚠️
//             </div>
//             <h3 className="text-xl font-black text-gray-900 mb-2">{alertModal.title}</h3>
//             <p className="text-xs font-semibold text-gray-500 mb-6 leading-relaxed">
//               {alertModal.message}
//             </p>
//             <button
//               onClick={() => setAlertModal({ isOpen: false, title: '', message: '' })}
//               className="w-full py-3 rounded-full bg-[#104288] hover:bg-[#f97316] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        
//         {/* HEADER SECTION */}
//         <div className="max-w-4xl mx-auto text-center space-y-2 mb-6">
//           <span className="text-xs uppercase font-black tracking-widest block" style={{ color: theme.orange }}>
//             24/7 ASSISTANCE & GUIDANCE
//           </span>
//           <h2 className="text-3xl lg:text-5xl font-extrabold drop-shadow-sm leading-tight" style={{ color: theme.primary }}>
//             Contact & Support
//           </h2>
//           <p className="text-sm lg:text-base font-semibold leading-relaxed" style={{ color: theme.textMuted }}>
//             Have questions about our bootcamps, workshops, or membership? We're here to help you grow.
//           </p>
//         </div>

//         {/* MAIN CONTACT CONTAINER (GRID 2 COLS) */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
//           {/* LEFT SIDE: DIRECT CONTACT DETAILS & QUICK LINKS */}
//           <div 
//             className="lg:col-span-5 backdrop-blur-md rounded-3xl p-8 border shadow-xl flex flex-col justify-between space-y-6 text-left"
//             style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
//           >
//             <div className="space-y-6">
//               <div>
//                 <h3 className="text-xl font-extrabold mb-2" style={{ color: theme.textBright }}>
//                   Get in Touch Directly
//                 </h3>
//                 <p className="text-xs font-semibold leading-relaxed" style={{ color: theme.textMuted }}>
//                   Connect with our program advisors for instant assistance regarding workshops and course fees.
//                 </p>
//               </div>

//               {/* QUICK BUTTONS */}
//               <div className="space-y-3 pt-2">
//                 <a 
//                   href="https://wa.me/919363337331" 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="flex items-center justify-between p-4 rounded-2xl border text-sm font-extrabold transition hover:scale-[1.02] shadow-sm cursor-pointer"
//                   style={{ borderColor: 'rgba(34, 197, 94, 0.4)', backgroundColor: 'rgba(34, 197, 94, 0.08)', color: '#16a34a' }}
//                 >
//                   <div className="flex items-center gap-3">
//                     <span className="text-xl">💬</span>
//                     <span>Chat on WhatsApp</span>
//                   </div>
//                   <span>➔</span>
//                 </a>

//                 {/* DIRECT GMAIL COMPOSE LINK */}
//                 <a 
//                   href="https://mail.google.com/mail/?view=cm&fs=1&to=wegrowskillcampus@gmail.com" 
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center justify-between p-4 rounded-2xl border text-sm font-extrabold transition hover:scale-[1.02] shadow-sm cursor-pointer"
//                   style={{ borderColor: 'rgba(16, 66, 136, 0.3)', backgroundColor: 'rgba(16, 66, 136, 0.08)', color: theme.primary }}
//                 >
//                   <div className="flex items-center gap-3">
//                     <span className="text-xl">✉️</span>
//                     <span>Chat on Email</span>
//                   </div>
//                   <span>➔</span>
//                 </a>
//               </div>

//               {/* INFO LIST */}
//               <div className="pt-4 border-t space-y-3 text-xs font-bold" style={{ borderColor: 'rgba(255,255,255,0.08)', color: theme.textMuted }}>
//                 <div className="flex items-center gap-3">
//                   <span>✉️</span>
//                   <span>Email: <strong style={{ color: theme.textBright }}>wegrowskillcampus@gmail.com</strong></span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span>📍</span>
//                   <span>Location: <strong style={{ color: theme.textBright }}>Sivakasi & Srivilliputtur, India</strong></span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span>⏰</span>
//                   <span>Support Hours: <strong style={{ color: theme.textBright }}>Mon - Sat (10:00 AM - 7:00 PM)</strong></span>
//                 </div>
//               </div>
//             </div>

//             <div className="p-4 rounded-2xl border text-xs font-semibold backdrop-blur-sm" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: theme.cardBorder, color: theme.textMuted }}>
//               ✦ Average response time: <strong style={{ color: theme.orange }}>Under 15 minutes</strong>
//             </div>
//           </div>

//           {/* RIGHT SIDE: MESSAGE FORM */}
//           <div 
//             className="lg:col-span-7 backdrop-blur-md rounded-3xl p-8 border shadow-xl text-left"
//             style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
//           >
//             {submitted ? (
//               <div className="py-16 text-center space-y-3">
//                 <div className="text-5xl">🎉</div>
//                 <h3 className="text-2xl font-extrabold" style={{ color: theme.primary }}>Message Received!</h3>
//                 <p className="text-sm font-semibold max-w-sm mx-auto" style={{ color: theme.textMuted }}>
//                   Thank you for reaching out. One of our mentors will contact you shortly via email or phone.
//                 </p>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <h3 className="text-xl font-extrabold" style={{ color: theme.textBright }}>
//                   Send Us a Direct Message
//                 </h3>

//                 {/* NAME & EMAIL */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-extrabold mb-1.5" style={{ color: theme.primary }}>Your Full Name</label>
//                     <input 
//                       type="text" 
//                       required 
//                       placeholder="Enter your name"
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold border outline-none transition focus:border-amber-500"
//                       style={{ borderColor: theme.cardBorder, color: theme.textBright, backgroundColor: 'rgba(255,255,255,0.05)' }}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs font-extrabold mb-1.5" style={{ color: theme.primary }}>Email Address</label>
//                     <input 
//                       type="email" 
//                       required 
//                       placeholder="Enter your email"
//                       value={formData.email}
//                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                       className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold border outline-none transition focus:border-amber-500"
//                       style={{ borderColor: theme.cardBorder, color: theme.textBright, backgroundColor: 'rgba(255,255,255,0.05)' }}
//                     />
//                   </div>
//                 </div>

//                 {/* MOBILE NUMBER FIELD */}
//                 <div>
//                   <label className="block text-xs font-extrabold mb-1.5" style={{ color: theme.primary }}>Your Mobile Number</label>
//                   <input 
//                     type="tel" 
//                     required 
//                     maxLength={10}
//                     placeholder="9876543210"
//                     value={formData.mobile}
//                     onChange={handlePhoneChange}
//                     className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold border outline-none transition focus:border-amber-500"
//                     style={{ borderColor: theme.cardBorder, color: theme.textBright, backgroundColor: 'rgba(255,255,255,0.05)' }}
//                   />
//                 </div>

//                 {/* CHECKBOXES: BUSINESS OR COURSE */}
//                 <div>
//                   <label className="block text-xs font-extrabold mb-2" style={{ color: theme.primary }}>Query About:</label>
//                   <div className="flex items-center gap-6 text-xs font-bold" style={{ color: theme.textBright }}>
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input 
//                         type="checkbox" 
//                         checked={formData.aboutBusiness} 
//                         onChange={(e) => setFormData({ ...formData, aboutBusiness: e.target.checked })}
//                         className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
//                       />
//                       Business
//                     </label>

//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input 
//                         type="checkbox" 
//                         checked={formData.aboutCourse} 
//                         onChange={(e) => setFormData({ ...formData, aboutCourse: e.target.checked })}
//                         className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
//                       />
//                       Course
//                     </label>
//                   </div>
//                 </div>

//                 {/* MESSAGE AREA */}
//                 <div>
//                   <label className="block text-xs font-extrabold mb-1.5" style={{ color: theme.primary }}>How can we help you?</label>
//                   <textarea 
//                     rows="3" 
//                     required 
//                     placeholder="Type your query regarding bootcamps, workshops, or career guidance..."
//                     value={formData.message}
//                     onChange={(e) => setFormData({ ...formData, message: e.target.value })}
//                     className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold border outline-none transition focus:border-amber-500 resize-none"
//                     style={{ borderColor: theme.cardBorder, color: theme.textBright, backgroundColor: 'rgba(255,255,255,0.05)' }}
//                   ></textarea>
//                 </div>

//                 {/* BUTTONS CONTAINER */}
//                 <div className="space-y-3 pt-1">
//                   <button 
//                     type="submit" 
//                     className="w-full py-3.5 rounded-xl font-extrabold text-sm transition-all duration-300 shadow-lg hover:scale-[1.01] cursor-pointer"
//                     style={{ backgroundColor: theme.primary, color: '#ffffff' }}
//                     onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.orange || '#f3a812'}
//                     onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.primary}
//                   >
//                     Submit Query ➔
//                   </button>

//                   <button 
//                     type="button" 
//                     onClick={handleReset}
//                     className="w-full py-2.5 rounded-xl font-bold text-xs transition-all duration-300 border cursor-pointer"
//                     style={{ 
//                       borderColor: '#ef4444', 
//                       color: '#ef4444',
//                       backgroundColor: 'transparent'
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.backgroundColor = '#ef4444';
//                       e.currentTarget.style.color = '#ffffff';
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.backgroundColor = 'transparent';
//                       e.currentTarget.style.color = '#ef4444';
//                     }}
//                   >
//                     Reset Form
//                   </button>
//                 </div>

//               </form>
//             )}
//           </div>

//         </div>

//       </div>
//     </section>
//   );
// }


import React, { useState } from 'react';
import { theme } from '../theme';

export default function ContactSection({
  contactTargetRef,
  contactStyle,
}) {
  // =====================================================
  // API CONFIGURATION
  // =====================================================

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    'http://13.239.234.181:4000/api/v1';

  const CONTACT_API = `${API_BASE_URL}/contact`;

  // =====================================================
  // FORM STATE
  // =====================================================

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    aboutBusiness: false,
    aboutCourse: false,
    message: '',
  });

  // =====================================================
  // SUBMITTED STATE
  // =====================================================

  const [submitted, setSubmitted] = useState(false);

  // =====================================================
  // LOADING STATE
  // =====================================================

  const [loading, setLoading] = useState(false);

  // =====================================================
  // ALERT MODAL STATE
  // =====================================================

  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
  });

  // =====================================================
  // SHOW ALERT
  // =====================================================

  const showAlert = (title, message) => {
    setAlertModal({
      isOpen: true,
      title,
      message,
    });
  };

  // =====================================================
  // CLOSE ALERT
  // =====================================================

  const closeAlert = () => {
    setAlertModal({
      isOpen: false,
      title: '',
      message: '',
    });
  };

  // =====================================================
  // PHONE CHANGE
  // =====================================================

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      mobile: value,
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const handleReset = () => {
    setFormData({
      name: '',
      mobile: '',
      email: '',
      aboutBusiness: false,
      aboutCourse: false,
      message: '',
    });
  };

  // =====================================================
  // SUBMIT FORM
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===================================================
    // MOBILE VALIDATION
    // ===================================================

    if (formData.mobile.length !== 10) {
      showAlert(
        'Invalid Mobile Number',
        'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    // ===================================================
    // MOBILE FIRST DIGIT VALIDATION
    // ===================================================

    const firstDigit = formData.mobile.charAt(0);

    if (!['6', '7', '8', '9'].includes(firstDigit)) {
      showAlert(
        'Invalid Mobile Number',
        'Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.'
      );
      return;
    }

    // ===================================================
    // QUERY ABOUT ARRAY
    // ===================================================

    const queryAbout = [];

    if (formData.aboutBusiness) {
      queryAbout.push('BUSINESS');
    }

    if (formData.aboutCourse) {
      queryAbout.push('COURSE');
    }

    // ===================================================
    // QUERY ABOUT VALIDATION
    // ===================================================

    if (queryAbout.length === 0) {
      showAlert(
        'Query About Required',
        'Please select at least one option: Business or Course.'
      );
      return;
    }

    // ===================================================
    // NAME VALIDATION
    // ===================================================

    if (!formData.name.trim()) {
      showAlert(
        'Name Required',
        'Please enter your full name.'
      );
      return;
    }

    // ===================================================
    // EMAIL VALIDATION
    // ===================================================

    if (!formData.email.trim()) {
      showAlert(
        'Email Required',
        'Please enter your email address.'
      );
      return;
    }

    // ===================================================
    // MESSAGE VALIDATION
    // ===================================================

    if (!formData.message.trim()) {
      showAlert(
        'Message Required',
        'Please enter your query or message.'
      );
      return;
    }

    // ===================================================
    // START LOADING
    // ===================================================

    setLoading(true);

    try {
      // =================================================
      // API PAYLOAD
      // =================================================

      const payload = {
        fullName: formData.name.trim(),

        email: formData.email.trim(),

        mobileNumber: formData.mobile,

        queryAbout: queryAbout,

        query: formData.message.trim(),
      };

      // =================================================
      // DEBUG
      // =================================================

      console.log(
        '===================================='
      );

      console.log(
        'Contact API:',
        CONTACT_API
      );

      console.log(
        'Contact Payload:',
        payload
      );

      console.log(
        '===================================='
      );

      // =================================================
      // API REQUEST
      // =================================================

      const response = await fetch(
        CONTACT_API,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(payload),
        }
      );

      // =================================================
      // PARSE RESPONSE
      // =================================================

      let data = {};

      try {
        data = await response.json();
      } catch (jsonError) {
        console.error(
          'Invalid JSON response:',
          jsonError
        );
      }

      // =================================================
      // RESPONSE DEBUG
      // =================================================

      console.log(
        'Contact API Status:',
        response.status
      );

      console.log(
        'Contact API Response:',
        data
      );

      // =================================================
      // SUCCESS
      // =================================================

      if (response.ok) {
        setSubmitted(true);

        // Clear form after successful API call
        setFormData({
          name: '',
          mobile: '',
          email: '',
          aboutBusiness: false,
          aboutCourse: false,
          message: '',
        });

        // Show form again after 3 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);

        return;
      }

      // =================================================
      // API ERROR
      // =================================================

      let errorMessage =
        'Unable to submit your query. Please try again.';

      if (Array.isArray(data.message)) {
        errorMessage = data.message.join('\n');
      } else if (data.message) {
        errorMessage = data.message;
      }

      showAlert(
        'Submission Failed',
        errorMessage
      );
    } catch (error) {
      // =================================================
      // NETWORK ERROR
      // =================================================

      console.error(
        'Contact API Network Error:',
        error
      );

      showAlert(
        'Connection Error',
        'Unable to connect to the server. Please check your internet connection or try again.'
      );
    } finally {
      // =================================================
      // STOP LOADING
      // =================================================

      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <section
      ref={contactTargetRef}
      id="contact"
      style={{
        ...contactStyle,
        willChange: 'opacity, transform',
      }}
      className="relative pt-0 pb-20 transition-all duration-500 ease-out transform-gpu"
    >
      {/* =================================================
          CUSTOM ALERT MODAL
      ================================================= */}

      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100">

            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 text-3xl">
              ⚠️
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-2">
              {alertModal.title}
            </h3>

            <p className="text-xs font-semibold text-gray-500 mb-6 leading-relaxed whitespace-pre-line">
              {alertModal.message}
            </p>

            <button
              type="button"
              onClick={closeAlert}
              className="w-full py-3 rounded-full bg-[#104288] hover:bg-[#f97316] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">

        {/* =================================================
            HEADER SECTION
        ================================================= */}

        <div className="max-w-4xl mx-auto text-center space-y-2 mb-6">

          <span
            className="text-xs uppercase font-black tracking-widest block"
            style={{
              color: theme.orange,
            }}
          >
            24/7 ASSISTANCE & GUIDANCE
          </span>

          <h2
            className="text-3xl lg:text-5xl font-extrabold drop-shadow-sm leading-tight"
            style={{
              color: theme.primary,
            }}
          >
            Contact & Support
          </h2>

          <p
            className="text-sm lg:text-base font-semibold leading-relaxed"
            style={{
              color: theme.textMuted,
            }}
          >
            Have questions about our bootcamps, workshops, or membership?
            We're here to help you grow.
          </p>

        </div>

        {/* =================================================
            MAIN CONTACT GRID
        ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div
            className="lg:col-span-5 backdrop-blur-md rounded-3xl p-8 border shadow-xl flex flex-col justify-between space-y-6 text-left"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.cardBorder,
            }}
          >

            <div className="space-y-6">

              <div>
                <h3
                  className="text-xl font-extrabold mb-2"
                  style={{
                    color: theme.textBright,
                  }}
                >
                  Get in Touch Directly
                </h3>

                <p
                  className="text-xs font-semibold leading-relaxed"
                  style={{
                    color: theme.textMuted,
                  }}
                >
                  Connect with our program advisors for instant assistance
                  regarding workshops and course fees.
                </p>
              </div>

              {/* =================================================
                  WHATSAPP
              ================================================= */}

              <div className="space-y-3 pt-2">

                <a
                  href="https://wa.me/919363337331"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl border text-sm font-extrabold transition hover:scale-[1.02] shadow-sm cursor-pointer"
                  style={{
                    borderColor:
                      'rgba(34, 197, 94, 0.4)',
                    backgroundColor:
                      'rgba(34, 197, 94, 0.08)',
                    color: '#16a34a',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      💬
                    </span>

                    <span>
                      Chat on WhatsApp
                    </span>
                  </div>

                  <span>
                    ➔
                  </span>
                </a>

                {/* =================================================
                    EMAIL
                ================================================= */}

                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=wegrowskillcampus@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl border text-sm font-extrabold transition hover:scale-[1.02] shadow-sm cursor-pointer"
                  style={{
                    borderColor:
                      'rgba(16, 66, 136, 0.3)',
                    backgroundColor:
                      'rgba(16, 66, 136, 0.08)',
                    color: theme.primary,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      ✉️
                    </span>

                    <span>
                      Chat on Email
                    </span>
                  </div>

                  <span>
                    ➔
                  </span>
                </a>

              </div>

              {/* =================================================
                  CONTACT INFO
              ================================================= */}

              <div
                className="pt-4 border-t space-y-3 text-xs font-bold"
                style={{
                  borderColor:
                    'rgba(255,255,255,0.08)',
                  color: theme.textMuted,
                }}
              >

                <div className="flex items-center gap-3">
                  <span>
                    ✉️
                  </span>

                  <span>
                    Email:{' '}
                    <strong
                      style={{
                        color: theme.textBright,
                      }}
                    >
                      wegrowskillcampus@gmail.com
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span>
                    📍
                  </span>

                  <span>
                    Location:{' '}
                    <strong
                      style={{
                        color: theme.textBright,
                      }}
                    >
                      Sivakasi & Srivilliputtur, India
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span>
                    ⏰
                  </span>

                  <span>
                    Support Hours:{' '}
                    <strong
                      style={{
                        color: theme.textBright,
                      }}
                    >
                      Mon - Sat (10:00 AM - 7:00 PM)
                    </strong>
                  </span>
                </div>

              </div>

            </div>

            {/* =================================================
                RESPONSE TIME
            ================================================= */}

            <div
              className="p-4 rounded-2xl border text-xs font-semibold backdrop-blur-sm"
              style={{
                backgroundColor:
                  'rgba(255,255,255,0.03)',
                borderColor: theme.cardBorder,
                color: theme.textMuted,
              }}
            >
              ✦ Average response time:{' '}
              <strong
                style={{
                  color: theme.orange,
                }}
              >
                Under 15 minutes
              </strong>
            </div>

          </div>

          {/* =================================================
              RIGHT SIDE FORM
          ================================================= */}

          <div
            className="lg:col-span-7 backdrop-blur-md rounded-3xl p-8 border shadow-xl text-left"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.cardBorder,
            }}
          >

            {/* =================================================
                SUCCESS SCREEN
            ================================================= */}

            {submitted ? (

              <div className="py-16 text-center space-y-3">

                <div className="text-5xl">
                  🎉
                </div>

                <h3
                  className="text-2xl font-extrabold"
                  style={{
                    color: theme.primary,
                  }}
                >
                  Message Received!
                </h3>

                <p
                  className="text-sm font-semibold max-w-sm mx-auto"
                  style={{
                    color: theme.textMuted,
                  }}
                >
                  Thank you for reaching out. One of our mentors will contact
                  you shortly via email or phone.
                </p>

              </div>

            ) : (

              /* =================================================
                  FORM
              ================================================= */

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                <h3
                  className="text-xl font-extrabold"
                  style={{
                    color: theme.textBright,
                  }}
                >
                  Send Us a Direct Message
                </h3>

                {/* =================================================
                    NAME + EMAIL
                ================================================= */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* NAME */}

                  <div>

                    <label
                      className="block text-xs font-extrabold mb-1.5"
                      style={{
                        color: theme.primary,
                      }}
                    >
                      Your Full Name
                    </label>

                    <input
                      type="text"
                      required
                      disabled={loading}
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold border outline-none transition focus:border-amber-500 disabled:opacity-60"
                      style={{
                        borderColor: theme.cardBorder,
                        color: theme.textBright,
                        backgroundColor:
                          'rgba(255,255,255,0.05)',
                      }}
                    />

                  </div>

                  {/* EMAIL */}

                  <div>

                    <label
                      className="block text-xs font-extrabold mb-1.5"
                      style={{
                        color: theme.primary,
                      }}
                    >
                      Email Address
                    </label>

                    <input
                      type="email"
                      required
                      disabled={loading}
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold border outline-none transition focus:border-amber-500 disabled:opacity-60"
                      style={{
                        borderColor: theme.cardBorder,
                        color: theme.textBright,
                        backgroundColor:
                          'rgba(255,255,255,0.05)',
                      }}
                    />

                  </div>

                </div>

                {/* =================================================
                    MOBILE
                ================================================= */}

                <div>

                  <label
                    className="block text-xs font-extrabold mb-1.5"
                    style={{
                      color: theme.primary,
                    }}
                  >
                    Your Mobile Number
                  </label>

                  <input
                    type="tel"
                    required
                    disabled={loading}
                    maxLength={10}
                    placeholder="9876543210"
                    value={formData.mobile}
                    onChange={handlePhoneChange}
                    className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold border outline-none transition focus:border-amber-500 disabled:opacity-60"
                    style={{
                      borderColor: theme.cardBorder,
                      color: theme.textBright,
                      backgroundColor:
                        'rgba(255,255,255,0.05)',
                    }}
                  />

                </div>

                {/* =================================================
                    QUERY ABOUT
                ================================================= */}

                <div>

                  <label
                    className="block text-xs font-extrabold mb-2"
                    style={{
                      color: theme.primary,
                    }}
                  >
                    Query About:
                  </label>

                  <div
                    className="flex items-center gap-6 text-xs font-bold"
                    style={{
                      color: theme.textBright,
                    }}
                  >

                    {/* BUSINESS */}

                    <label className="flex items-center gap-2 cursor-pointer">

                      <input
                        type="checkbox"
                        disabled={loading}
                        checked={
                          formData.aboutBusiness
                        }
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            aboutBusiness:
                              e.target.checked,
                          }))
                        }
                        className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
                      />

                      Business

                    </label>

                    {/* COURSE */}

                    <label className="flex items-center gap-2 cursor-pointer">

                      <input
                        type="checkbox"
                        disabled={loading}
                        checked={
                          formData.aboutCourse
                        }
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            aboutCourse:
                              e.target.checked,
                          }))
                        }
                        className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
                      />

                      Course

                    </label>

                  </div>

                </div>

                {/* =================================================
                    MESSAGE
                ================================================= */}

                <div>

                  <label
                    className="block text-xs font-extrabold mb-1.5"
                    style={{
                      color: theme.primary,
                    }}
                  >
                    How can we help you?
                  </label>

                  <textarea
                    rows="3"
                    required
                    disabled={loading}
                    placeholder="Type your query regarding bootcamps, workshops, or career guidance..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold border outline-none transition focus:border-amber-500 resize-none disabled:opacity-60"
                    style={{
                      borderColor: theme.cardBorder,
                      color: theme.textBright,
                      backgroundColor:
                        'rgba(255,255,255,0.05)',
                    }}
                  />

                </div>

                {/* =================================================
                    BUTTONS
                ================================================= */}

                <div className="space-y-3 pt-1">

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-extrabold text-sm transition-all duration-300 shadow-lg"
                    style={{
                      backgroundColor:
                        theme.primary,
                      color: '#ffffff',
                      opacity: loading ? 0.7 : 1,
                      cursor: loading
                        ? 'not-allowed'
                        : 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.backgroundColor =
                          theme.orange ||
                          '#f3a812';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        theme.primary;
                    }}
                  >
                    {loading
                      ? 'Submitting...'
                      : 'Submit Query ➔'}
                  </button>

                  {/* RESET */}

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleReset}
                    className="w-full py-2.5 rounded-xl font-bold text-xs transition-all duration-300 border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      borderColor: '#ef4444',
                      color: '#ef4444',
                      backgroundColor:
                        'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.backgroundColor =
                          '#ef4444';

                        e.currentTarget.style.color =
                          '#ffffff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'transparent';

                      e.currentTarget.style.color =
                        '#ef4444';
                    }}
                  >
                    Reset Form
                  </button>

                </div>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}