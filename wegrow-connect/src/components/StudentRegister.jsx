// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function StudentRegister() {
//   const navigate = useNavigate();

//   const studentSlides = [
//     {
//       img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80",
//       title: "Empowering Your Learning Journey",
//       desc: "Gain practical industry skills, connect with top mentors, and achieve your professional dreams with WeGrow."
//     },
//     {
//       img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1000&auto=format&fit=crop&q=80",
//       title: "Hands-on Technical Workshops",
//       desc: "Build real-time industry projects and master cutting-edge tech stacks with expert guidance."
//     },
//     {
//       img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&auto=format&fit=crop&q=80",
//       title: "Build Your <br />Future Career",
//       desc: "Get verified certifications, internship opportunities, and direct placement support."
//     }
//   ];

//   const [currentSlide, setCurrentSlide] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % studentSlides.length);
//     }, 4000);
//     return () => clearInterval(timer);
//   }, [studentSlides.length]);

//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     phone: '',
//     college: '',
//     course: '',
//     department: '',
//     year: '',
//     skills: '',
//     city: '',
//     state: ''
//   });
  
//   const [idProofFile, setIdProofFile] = useState(null);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);

//   // Custom Modal State for Alerts
//   const [modalConfig, setModalConfig] = useState({
//     isOpen: false,
//     title: '',
//     message: ''
//   });

//   const showAlert = (title, message) => {
//     setModalConfig({ isOpen: true, title, message });
//   };

//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setActiveDropdown(null);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Automatic redirect timer (5 seconds) on success
//   useEffect(() => {
//     let timer;
//     if (showSuccessModal) {
//       timer = setTimeout(() => {
//         navigate('/home/login', { state: { username: formData.username } });
//       }, 5000);
//     }
//     return () => clearInterval(timer);
//   }, [showSuccessModal, formData.username, navigate]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handlePhoneChange = (e) => {
//     let value = e.target.value.replace(/\D/g, '');
//     if (value.length > 10) value = value.slice(0, 10);
//     setFormData({ ...formData, phone: value });
//   };

//   const handleSelectOption = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     setActiveDropdown(null);
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setIdProofFile(e.target.files[0]);
//     }
//   };

//   const handleRegister = (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       showAlert("Mismatch Error", "Passwords do not match! Please check again.");
//       return;
//     }

//     // Password validation: Caps, Small, Number, Special Character, Min length 8
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     if (!passwordRegex.test(formData.password)) {
//       showAlert(
//         "Weak Password",
//         "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
//       );
//       return;
//     }

//     // 10 digits check
//     if (formData.phone.length !== 10) {
//       showAlert("Invalid Mobile Number", "Please enter a valid 10-digit mobile number.");
//       return;
//     }

//     // Starts with 6, 7, 8, or 9 check
//     const firstDigit = formData.phone.charAt(0);
//     if (!['6', '7', '8', '9'].includes(firstDigit)) {
//       showAlert("Invalid Mobile Number", "Give your valid mobile number.");
//       return;
//     }

//     setShowSuccessModal(true);
//   };

//   const handleModalClose = () => {
//     setShowSuccessModal(false);
//     navigate('/home/login', { state: { username: formData.username } });
//   };

//   const handleAlertModalClose = () => {
//     setModalConfig({ isOpen: false, title: '', message: '' });
//   };

//   const optionsList = {
//     college: ["Anna University", "IIT Madras", "PSG College of Technology", "NIT Trichy", "Thiagarajar College of Engineering", "Kumaraguru College of Technology"],
//     course: ["B.E / B.Tech", "M.E / M.Tech", "B.Sc / M.Sc", "BCA / MCA", "MBA"],
//     department: ["CSE", "ECE", "EEE", "Mechanical", "Civil", "IT", "AI & DS"],
//     year: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduated"],
//     city: ["Madurai", "Chennai", "Coimbatore", "Trichy", "Salem", "Tirunelveli", "Bangalore", "Hyderabad"],
//     state: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Maharashtra"]
//   };

//   const renderCustomDropdown = (name, placeholder) => {
//     const isOpen = activeDropdown === name;
//     const searchText = (formData[name] || "").toLowerCase();
//     const filteredOptions = optionsList[name].filter(item => item.toLowerCase().includes(searchText));

//     return (
//       <div className="relative" ref={dropdownRef}>
//         <div className="relative flex items-center">
//           <input 
//             type="text" 
//             name={name} 
//             placeholder={placeholder} 
//             value={formData[name]} 
//             onChange={(e) => {
//               handleChange(e);
//               setActiveDropdown(name);
//             }}
//             onFocus={() => setActiveDropdown(name)}
//             required 
//             className="line-input pr-8" 
//           />
//           <span 
//             className="absolute right-1 text-gray-500 text-xs cursor-pointer select-none"
//             onClick={() => setActiveDropdown(isOpen ? null : name)}
//           >
//             ▼
//           </span>
//         </div>

//         {isOpen && (
//           <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-48 overflow-y-auto custom-scroll p-1.5">
//             {filteredOptions.length > 0 ? (
//               filteredOptions.map((opt, idx) => (
//                 <div
//                   key={idx}
//                   onMouseDown={(e) => {
//                     e.preventDefault();
//                     handleSelectOption(name, opt);
//                   }}
//                   className="px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#104288] rounded-xl cursor-pointer transition-all"
//                 >
//                   {opt}
//                 </div>
//               ))
//             ) : (
//               <div className="px-4 py-2.5 text-xs text-gray-400 font-medium text-center">
//                 Custom type allowed
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <>
//       <style>{`
//         @keyframes pageFadeIn {
//           from { opacity: 0; transform: translateY(12px) scale(0.97); }
//           to { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         .page-fade {
//           animation: pageFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//         }
//         .line-input {
//           width: 100%;
//           border: none;
//           border-bottom: 2px solid #e2e8f0;
//           outline: none;
//           font-size: 13.5px;
//           font-weight: 600;
//           color: #1f2937;
//           background: transparent;
//           padding: 8px 2px;
//           transition: border-color 0.25s ease;
//         }
//         .line-input:focus {
//           border-bottom-color: #104288;
//         }
//         .register-btn {
//           background: #104288;
//           transition: all 0.25s ease;
//         }
//         .register-btn:hover {
//           background: #f97316 !important;
//           transform: translateY(-1px);
//           box-shadow: 0 8px 20px rgba(249, 115, 22, 0.35) !important;
//         }
//         .back-btn {
//           background-color: #ffffff;
//           border: 2px solid #d1d5db;
//           color: #374151;
//           transition: all 0.25s ease;
//         }
//         .back-btn:hover {
//           background-color: #f1f5f9 !important;
//           border-color: #104288 !important;
//           color: #104288 !important;
//         }
//         .custom-scroll::-webkit-scrollbar {
//           width: 5px;
//         }
//         .custom-scroll::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 9999px;
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

//       {/* SUCCESS MODAL POPUP */}
//       {showSuccessModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 transform transition-all">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-3xl">
//               ✓
//             </div>
//             <h3 className="text-xl font-black text-gray-900 mb-2">Registration Successful!</h3>
//             <p className="text-xs font-semibold text-gray-500 mb-6">
//               Your student account has been created successfully. Click below to sign in.
//             </p>
//             <button
//               onClick={handleModalClose}
//               className="w-full py-3 rounded-full bg-[#104288] hover:bg-[#f97316] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
//             >
//               Continue to Sign In
//             </button>
//           </div>
//         </div>
//       )}

//       {/* MAIN CONTAINER */}
//       <div className="w-full max-w-6xl mx-auto px-4 flex items-center justify-center page-fade gap-6">
        
//         <div className="w-full lg:w-5/12 bg-transparent p-8 sm:p-10 text-gray-900 hidden lg:flex flex-col justify-between relative overflow-hidden">
//           <div className="relative z-10 flex items-center justify-between">
//             {/* ROUND SHAPE REMOVED & GAP REDUCED */}
//             <div className="flex items-center">
//               <img src="/login/logo.jpg" alt="Logo Icon" className="w-12 h-12 object-contain relative z-10" />
//               <img src="/login/wegrow-logo.png" alt="WeGrow Text Logo" className="w-[160px] h-[48px] object-contain -ml-6 relative z-0" />
//             </div>
//             <button 
//               type="button"
//               onClick={() => navigate('/home/login/option')}
//               className="back-btn px-5 py-2 rounded-full font-bold text-xs cursor-pointer shadow-sm"
//             >
//               ← Back
//             </button>
//           </div>

//           <div className="relative z-10 my-auto py-8">
//             <div className="h-44 sm:h-52 rounded-2xl overflow-hidden shadow-lg mb-6 border border-gray-200/60 relative">
//               {studentSlides.map((slide, idx) => (
//                 <div 
//                   key={idx} 
//                   className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
//                 >
//                   <img src={slide.img} alt="Slide" className="w-full h-full object-cover filter brightness-90" />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
//                     <p className="text-xs font-semibold text-white/95" dangerouslySetInnerHTML={{ __html: slide.desc }}></p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <h2 
//               className="text-xl sm:text-2xl font-black mb-2 leading-snug text-[#104288] drop-shadow-sm"
//               dangerouslySetInnerHTML={{ __html: studentSlides[currentSlide].title }}
//             ></h2>
//             <p 
//               className="text-xs text-[#f97316] leading-relaxed font-bold"
//               dangerouslySetInnerHTML={{ __html: studentSlides[currentSlide].desc }}
//             ></p>
//           </div>

//           <div className="relative z-10 flex items-center justify-center gap-2">
//             {studentSlides.map((_, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => setCurrentSlide(idx)}
//                 className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-[#f97316]' : 'w-2 bg-gray-300'}`}
//               />
//             ))}
//           </div>
//         </div>

//         <div className="w-full lg:w-7/12 p-6 sm:p-10 overflow-y-auto custom-scroll max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-gray-200/80">
//           <div className="mb-6 flex items-center justify-between">
//             <div>
//               <h3 className="text-2xl font-black text-gray-900">Student Register</h3>
//               <p className="text-xs font-semibold text-gray-500 mt-1">Create your student account. It's free and only takes a minute.</p>
//             </div>
//             <button 
//               type="button"
//               onClick={() => navigate('/home/login/option')}
//               className="lg:hidden back-btn px-3 py-1.5 rounded-full font-bold text-xs cursor-pointer shadow-sm"
//             >
//               ← BACK
//             </button>
//           </div>

//           <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">First Name</label>
//                 <input type="text" name="firstName" placeholder="Enter first name" value={formData.firstName} onChange={handleChange} required className="line-input" />
//               </div>
//               <div>
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Last Name</label>
//                 <input type="text" name="lastName" placeholder="Enter last name" value={formData.lastName} onChange={handleChange} required className="line-input" />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Username</label>
//                 <input type="text" name="username" placeholder="Choose a username" value={formData.username} onChange={handleChange} required className="line-input" />
//               </div>
//               <div>
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
//                 <input type="email" name="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} required className="line-input" />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
//                 <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required className="line-input" />
//               </div>
//               <div>
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Confirm Password</label>
//                 <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required className="line-input" />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
//                 <input 
//                   type="text" 
//                   name="phone" 
//                   placeholder="9876543210" 
//                   value={formData.phone} 
//                   onChange={handlePhoneChange} 
//                   maxLength={10} 
//                   required 
//                   className="line-input" 
//                 />
//               </div>
//               <div>
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">College Name</label>
//                 {renderCustomDropdown('college', 'Select or type college')}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Course</label>
//                 {renderCustomDropdown('course', 'Select or type course')}
//               </div>
//               <div>
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Department</label>
//                 {renderCustomDropdown('department', 'Select or type department')}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Year</label>
//                 {renderCustomDropdown('year', 'Select or type year')}
//               </div>
//               <div>
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Skills</label>
//                 <input type="text" name="skills" placeholder="React, Node (comma separated)" value={formData.skills} onChange={handleChange} required className="line-input" />
//               </div>
//             </div>

//             <div className="w-full flex flex-col gap-1.5 pt-1">
//               <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Upload ID Proof (College ID / Govt ID)</label>
//               <input 
//                 type="file" 
//                 accept="image/*,.pdf" 
//                 onChange={handleFileChange} 
//                 required 
//                 className="w-full text-xs font-semibold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-[#104288] hover:file:bg-blue-100 cursor-pointer border border-dashed border-gray-300 rounded-xl p-1 bg-gray-50/50"
//               />
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">City</label>
//                 {renderCustomDropdown('city', 'Select or type city')}
//               </div>
//               <div>
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">State</label>
//                 {renderCustomDropdown('state', 'Select or type state')}
//               </div>
//             </div>

//             <div className="pt-3">
//               <button 
//                 type="submit" 
//                 className="register-btn w-full py-3.5 rounded-full font-extrabold text-white text-sm uppercase tracking-wider border-none cursor-pointer shadow-lg"
//               >
//                 REGISTER
//               </button>
//             </div>

//             <div className="flex items-center justify-between text-xs font-bold text-gray-500 pt-2 px-1">
//               <span>Already a member?</span>
//               <button type="button" onClick={() => navigate('/home/login')} className="text-[#104288] hover:text-orange-500 transition-colors font-extrabold cursor-pointer">
//                 Sign In
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }



import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentRegister() {
  const navigate = useNavigate();

  // =====================================================
  // API CONFIGURATION
  // =====================================================

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    'https://wegrow-connect-backend-1.onrender.com/api/v1';

  const REGISTER_API =
    `${API_BASE_URL}api/vi/auth/register/student`;

  // =====================================================
  // SLIDER DATA
  // =====================================================

  const studentSlides = [
    {
      img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80',
      title: 'Empowering Your Learning Journey',
      desc: 'Gain practical industry skills, connect with top mentors, and achieve your professional dreams with WeGrow.',
    },
    {
      img: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1000&auto=format&fit=crop&q=80',
      title: 'Hands-on Technical Workshops',
      desc: 'Build real-time industry projects and master cutting-edge tech stacks with expert guidance.',
    },
    {
      img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&auto=format&fit=crop&q=80',
      title: 'Build Your <br />Future Career',
      desc: 'Get verified certifications, internship opportunities, and direct placement support.',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % studentSlides.length
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [studentSlides.length]);

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    college: '',
    course: '',
    department: '',
    year: '',
    skills: '',
    city: '',
    state: '',
  });

  // =====================================================
  // FILE
  // =====================================================

  const [idProofFile, setIdProofFile] = useState(null);

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(false);

  // =====================================================
  // SUCCESS MODAL
  // =====================================================

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  // =====================================================
  // ALERT MODAL
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

  // =====================================================
  // DROPDOWN
  // =====================================================

  const [activeDropdown, setActiveDropdown] =
    useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
  }, []);

  // =====================================================
  // SUCCESS REDIRECT
  // =====================================================

  useEffect(() => {
    let timer;

    // if (showSuccessModal) {
    //   timer = setTimeout(() => {
    //     navigate('/home/login', {
    //       state: {
    //         username: formData.username,
    //       },
    //     });
    //   }, 5000);
    // }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [
    showSuccessModal,
    formData.username,
    navigate,
  ]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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

    setFormData({
      ...formData,
      phone: value,
    });
  };

  // =====================================================
  // DROPDOWN SELECT
  // =====================================================

  const handleSelectOption = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setActiveDropdown(null);
  };

  // =====================================================
  // FILE CHANGE
  // =====================================================

  const handleFileChange = (e) => {
    if (
      e.target.files &&
      e.target.files[0]
    ) {
      setIdProofFile(e.target.files[0]);
    }
  };

  // =====================================================
  // REGISTER STUDENT
  // =====================================================

  const handleRegister = async (e) => {
    e.preventDefault();

    // ===================================================
    // PASSWORD MATCH
    // ===================================================

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      showAlert(
        'Mismatch Error',
        'Passwords do not match! Please check again.'
      );

      return;
    }

    // ===================================================
    // PASSWORD VALIDATION
    // ===================================================

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (
      !passwordRegex.test(
        formData.password
      )
    ) {
      showAlert(
        'Weak Password',
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      );

      return;
    }

    // ===================================================
    // PHONE VALIDATION
    // ===================================================

    if (formData.phone.length !== 10) {
      showAlert(
        'Invalid Mobile Number',
        'Please enter a valid 10-digit mobile number.'
      );

      return;
    }

    // ===================================================
    // PHONE FIRST DIGIT
    // ===================================================

    const firstDigit =
      formData.phone.charAt(0);

    if (
      !['6', '7', '8', '9'].includes(
        firstDigit
      )
    ) {
      showAlert(
        'Invalid Mobile Number',
        'Give your valid mobile number.'
      );

      return;
    }

    // ===================================================
    // ID PROOF VALIDATION
    // ===================================================

    if (!idProofFile) {
      showAlert(
        'ID Proof Required',
        'Please upload your College ID or Government ID.'
      );

      return;
    }

    // ===================================================
    // START LOADING
    // ===================================================

    setLoading(true);

    try {
      console.log(
        'Student Register API:',
        REGISTER_API
      );

      console.log(
        'Selected ID File:',
        idProofFile
      );

      // =================================================
      // API BODY
      // =================================================

      const requestBody = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        // username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        // confirmPassword: formData.confirmPassword,
        phone: formData.phone,
        college: formData.college.trim(),
        course: formData.course.trim(),
        department:
          formData.department.trim(),
        year: formData.year.trim(),
 skills: formData.skills
    .split(',')
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0),
        // IMPORTANT:
        // Browser cannot send a local file:// path.
        // This sends the selected filename for now.
        idCardUrl: idProofFile.name,

        city: formData.city.trim(),
        state: formData.state.trim(),
      };

      console.log(
        'Student Register Request:',
        requestBody
      );

      // =================================================
      // API CALL
      // =================================================

      const response = await fetch(
        REGISTER_API,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(
            requestBody
          ),
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

      console.log(
        'Register Status:',
        response.status
      );

      console.log(
        'Register Response:',
        data
      );

      // =================================================
      // SUCCESS
      // =================================================

      if (response.ok) {
        setShowSuccessModal(true);

        return;
      }

      // =================================================
      // API ERROR
      // =================================================

      let errorMessage =
        'Registration failed. Please try again.';

      if (Array.isArray(data.message)) {
        errorMessage =
          data.message.join('\n');
      } else if (data.message) {
        errorMessage = data.message;
      }

      showAlert(
        'Registration Failed',
        errorMessage
      );
    } catch (error) {
      console.error(
        'Registration Network Error:',
        error
      );

      showAlert(
        'Connection Error',
        'Unable to connect to the server. Please check your internet connection or try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SUCCESS MODAL CLOSE
  // =====================================================

  const handleModalClose = () => {
    setShowSuccessModal(false);

    navigate('/home/login', {
      state: {
        username: formData.username,
      },
    });
  };

  // =====================================================
  // ALERT MODAL CLOSE
  // =====================================================

  const handleAlertModalClose = () => {
    setModalConfig({
      isOpen: false,
      title: '',
      message: '',
    });
  };

  // =====================================================
  // DROPDOWN OPTIONS
  // =====================================================

  const optionsList = {
    college: [
      'Anna University',
      'IIT Madras',
      'PSG College of Technology',
      'NIT Trichy',
      'Thiagarajar College of Engineering',
      'Kumaraguru College of Technology',
    ],

    course: [
      'B.E / B.Tech',
      'M.E / M.Tech',
      'B.Sc / M.Sc',
      'BCA / MCA',
      'MBA',
    ],

    department: [
      'CSE',
      'ECE',
      'EEE',
      'Mechanical',
      'Civil',
      'IT',
      'AI & DS',
    ],

    year: [
      '1st Year',
      '2nd Year',
      '3rd Year',
      '4th Year',
      'Graduated',
    ],

    city: [
      'Madurai',
      'Chennai',
      'Coimbatore',
      'Trichy',
      'Salem',
      'Tirunelveli',
      'Bangalore',
      'Hyderabad',
    ],

    state: [
      'Tamil Nadu',
      'Kerala',
      'Karnataka',
      'Andhra Pradesh',
      'Telangana',
      'Maharashtra',
    ],
  };

  // =====================================================
  // CUSTOM DROPDOWN
  // =====================================================

  const renderCustomDropdown = (
    name,
    placeholder
  ) => {
    const isOpen =
      activeDropdown === name;

    const searchText = (
      formData[name] || ''
    ).toLowerCase();

    const filteredOptions =
      optionsList[name].filter(
        (item) =>
          item
            .toLowerCase()
            .includes(searchText)
      );

    return (
      <div
        className="relative"
        ref={dropdownRef}
      >
        <div className="relative flex items-center">

          <input
            type="text"
            name={name}
            placeholder={placeholder}
            value={formData[name]}
            onChange={(e) => {
              handleChange(e);
              setActiveDropdown(name);
            }}
            onFocus={() =>
              setActiveDropdown(name)
            }
            required
            className="line-input pr-8"
          />

          <span
            className="absolute right-1 text-gray-500 text-xs cursor-pointer select-none"
            onClick={() =>
              setActiveDropdown(
                isOpen ? null : name
              )
            }
          >
            ▼
          </span>

        </div>

        {isOpen && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-48 overflow-y-auto custom-scroll p-1.5">

            {filteredOptions.length > 0 ? (
              filteredOptions.map(
                (opt, idx) => (
                  <div
                    key={idx}
                    onMouseDown={(e) => {
                      e.preventDefault();

                      handleSelectOption(
                        name,
                        opt
                      );
                    }}
                    className="px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#104288] rounded-xl cursor-pointer transition-all"
                  >
                    {opt}
                  </div>
                )
              )
            ) : (
              <div className="px-4 py-2.5 text-xs text-gray-400 font-medium text-center">
                Custom type allowed
              </div>
            )}

          </div>
        )}
      </div>
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <style>{`
        @keyframes pageFadeIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .page-fade {
          animation: pageFadeIn 0.6s
            cubic-bezier(0.16, 1, 0.3, 1)
            forwards;
        }

        .line-input {
          width: 100%;
          border: none;
          border-bottom: 2px solid #e2e8f0;
          outline: none;
          font-size: 13.5px;
          font-weight: 600;
          color: #1f2937;
          background: transparent;
          padding: 8px 2px;
          transition: border-color 0.25s ease;
        }

        .line-input:focus {
          border-bottom-color: #104288;
        }

        .register-btn {
          background: #104288;
          transition: all 0.25s ease;
        }

        .register-btn:hover {
          background: #f97316 !important;
          transform: translateY(-1px);
          box-shadow:
            0 8px 20px
            rgba(249, 115, 22, 0.35) !important;
        }

        .back-btn {
          background-color: #ffffff;
          border: 2px solid #d1d5db;
          color: #374151;
          transition: all 0.25s ease;
        }

        .back-btn:hover {
          background-color: #f1f5f9 !important;
          border-color: #104288 !important;
          color: #104288 !important;
        }

        .custom-scroll::-webkit-scrollbar {
          width: 5px;
        }

        .custom-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }
      `}</style>

      {/* =================================================
          ALERT MODAL
      ================================================= */}

      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100">

            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 text-3xl">
              ⚠️
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-2">
              {modalConfig.title}
            </h3>

            <p className="text-xs font-semibold text-gray-500 mb-6 leading-relaxed whitespace-pre-line">
              {modalConfig.message}
            </p>

            <button
              onClick={handleAlertModalClose}
              className="w-full py-3 rounded-full bg-[#104288] hover:bg-[#f97316] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              OK
            </button>

          </div>
        </div>
      )}

      {/* =================================================
          SUCCESS MODAL
      ================================================= */}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100">

            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-3xl">
              ✓
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-2">
              Registration Successful!
            </h3>

            <p className="text-xs font-semibold text-gray-500 mb-6">
              Your student account has been created successfully. Click below to sign in.
            </p>

            <button
              onClick={handleModalClose}
              className="w-full py-3 rounded-full bg-[#104288] hover:bg-[#f97316] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Continue to Sign In
            </button>

          </div>
        </div>
      )}

      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div className="w-full max-w-6xl mx-auto px-4 flex items-center justify-center page-fade gap-6">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="w-full lg:w-5/12 bg-transparent p-8 sm:p-10 text-gray-900 hidden lg:flex flex-col justify-between relative overflow-hidden">

          <div className="relative z-10 flex items-center justify-between">

            <div className="flex items-center">

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

            <button
              type="button"
              onClick={() =>
                navigate(
                  '/home/login/option'
                )
              }
              className="back-btn px-5 py-2 rounded-full font-bold text-xs cursor-pointer shadow-sm"
            >
              ← Back
            </button>

          </div>

          <div className="relative z-10 my-auto py-8">

            <div className="h-44 sm:h-52 rounded-2xl overflow-hidden shadow-lg mb-6 border border-gray-200/60 relative">

              {studentSlides.map(
                (slide, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      idx === currentSlide
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-0'
                    }`}
                  >

                    <img
                      src={slide.img}
                      alt="Slide"
                      className="w-full h-full object-cover filter brightness-90"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">

                      <p
                        className="text-xs font-semibold text-white/95"
                        dangerouslySetInnerHTML={{
                          __html:
                            slide.desc,
                        }}
                      />

                    </div>

                  </div>
                )
              )}

            </div>

            <h2
              className="text-xl sm:text-2xl font-black mb-2 leading-snug text-[#104288] drop-shadow-sm"
              dangerouslySetInnerHTML={{
                __html:
                  studentSlides[
                    currentSlide
                  ].title,
              }}
            />

            <p
              className="text-xs text-[#f97316] leading-relaxed font-bold"
              dangerouslySetInnerHTML={{
                __html:
                  studentSlides[
                    currentSlide
                  ].desc,
              }}
            />

          </div>

          <div className="relative z-10 flex items-center justify-center gap-2">

            {studentSlides.map(
              (_, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setCurrentSlide(idx)
                  }
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide
                      ? 'w-6 bg-[#f97316]'
                      : 'w-2 bg-gray-300'
                  }`}
                />
              )
            )}

          </div>

        </div>

        {/* =================================================
            RIGHT SIDE FORM
        ================================================= */}

        <div className="w-full lg:w-7/12 p-6 sm:p-10 overflow-y-auto custom-scroll max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-gray-200/80">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h3 className="text-2xl font-black text-gray-900">
                Student Register
              </h3>

              <p className="text-xs font-semibold text-gray-500 mt-1">
                Create your student account. It's free and only takes a minute.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  '/home/login/option'
                )
              }
              className="lg:hidden back-btn px-3 py-1.5 rounded-full font-bold text-xs cursor-pointer shadow-sm"
            >
              ← BACK
            </button>

          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleRegister}
            className="w-full flex flex-col gap-4"
          >

            {/* FIRST / LAST NAME */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="line-input"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="line-input"
                />
              </div>

            </div>

            {/* USERNAME / EMAIL */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="line-input"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="line-input"
                />
              </div>

            </div>

            {/* PASSWORD */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="line-input"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="line-input"
                />
              </div>

            </div>

            {/* PHONE / COLLEGE */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  required
                  disabled={loading}
                  className="line-input"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  College Name
                </label>

                {renderCustomDropdown(
                  'college',
                  'Select or type college'
                )}
              </div>

            </div>

            {/* COURSE / DEPARTMENT */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Course
                </label>

                {renderCustomDropdown(
                  'course',
                  'Select or type course'
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Department
                </label>

                {renderCustomDropdown(
                  'department',
                  'Select or type department'
                )}
              </div>

            </div>

            {/* YEAR / SKILLS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Year
                </label>

                {renderCustomDropdown(
                  'year',
                  'Select or type year'
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Skills
                </label>

                <input
                  type="text"
                  name="skills"
                  placeholder="React, Node (comma separated)"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="line-input"
                />
              </div>

            </div>

            {/* ID PROOF */}

            <div className="w-full flex flex-col gap-1.5 pt-1">

              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Upload ID Proof (College ID / Govt ID)
              </label>

              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                required
                disabled={loading}
                className="w-full text-xs font-semibold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-[#104288] hover:file:bg-blue-100 cursor-pointer border border-dashed border-gray-300 rounded-xl p-1 bg-gray-50/50"
              />

              {idProofFile && (
                <p className="text-[11px] text-green-600 font-semibold mt-1">
                  Selected: {idProofFile.name}
                </p>
              )}

            </div>

            {/* CITY / STATE */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  City
                </label>

                {renderCustomDropdown(
                  'city',
                  'Select or type city'
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  State
                </label>

                {renderCustomDropdown(
                  'state',
                  'Select or type state'
                )}
              </div>

            </div>

            {/* REGISTER BUTTON */}

            <div className="pt-3">

              <button
                type="submit"
                disabled={loading}
                className="register-btn w-full py-3.5 rounded-full font-extrabold text-white text-sm uppercase tracking-wider border-none cursor-pointer shadow-lg"
                style={{
                  opacity: loading ? 0.7 : 1,
                  cursor: loading
                    ? 'not-allowed'
                    : 'pointer',
                }}
              >
                {loading
                  ? 'REGISTERING...'
                  : 'REGISTER'}
              </button>

            </div>

            {/* LOGIN */}

            <div className="flex items-center justify-between text-xs font-bold text-gray-500 pt-2 px-1">

              <span>
                Already a member?
              </span>

              <button
                type="button"
                onClick={() =>
                  navigate('/home/login')
                }
                className="text-[#104288] hover:text-orange-500 transition-colors font-extrabold cursor-pointer"
              >
                Sign In
              </button>

            </div>

          </form>

        </div>

      </div>
    </>
  );
}

