<<<<<<< HEAD
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function BusinessRegister() {
//   const navigate = useNavigate();

//   const businessSlides = [
//     {
//       img: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1000&auto=format&fit=crop&q=80",
//       title: "Accelerate Your <br />Business Growth",
//       desc: "Connect with skilled interns, find qualified talent, and scale your operations with WeGrow."
//     },
//     {
//       img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&auto=format&fit=crop&q=80",
//       title: "Post Opportunities <br />& Find Talent",
//       desc: "Easily post internships and job openings to a vast network of verified students and graduates."
//     },
//     {
//       img: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=1000&auto=format&fit=crop&q=80",
//       title: "Build Your <br />Employer Brand",
//       desc: "Showcase your company culture, attract top-tier talent, and establish your industry presence."
//     }
//   ];

//   const [currentSlide, setCurrentSlide] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % businessSlides.length);
//     }, 4000);
//     return () => clearInterval(timer);
//   }, [businessSlides.length]);

//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     phone: '',
//     city: '',
//     state: '',
//     companyName: '',
//     businessType: '',
//     designation: '',
//     experience: '',
//     website: ''
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
//     businessType: ["Software Development", "IT Services", "Consulting", "Manufacturing", "E-commerce", "Education", "Healthcare", "Finance"],
//     city: ["Madurai", "Chennai", "Coimbatore", "Trichy", "Salem", "Tirunelveli", "Bangalore", "Hyderabad", "Mumbai"],
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
//               Your business account has been created successfully. Click below to sign in.
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
//             {/* ROUND SHAPE REMOVED FROM LOGO */}
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
//               {businessSlides.map((slide, idx) => (
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
//               dangerouslySetInnerHTML={{ __html: businessSlides[currentSlide].title }}
//             ></h2>
//             <p 
//               className="text-xs text-[#f97316] leading-relaxed font-bold"
//               dangerouslySetInnerHTML={{ __html: businessSlides[currentSlide].desc }}
//             ></p>
//           </div>

//           <div className="relative z-10 flex items-center justify-center gap-2">
//             {businessSlides.map((_, idx) => (
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
//               <h3 className="text-2xl font-black text-gray-900">Business Register</h3>
//               <p className="text-xs font-semibold text-gray-500 mt-1">Create your business account. Find talent & post opportunities.</p>
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
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Company Name</label>
//                 <input type="text" name="companyName" placeholder="Enter company name" value={formData.companyName} onChange={handleChange} required className="line-input" />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Business Type</label>
//                 {renderCustomDropdown('businessType', 'Select or type business type')}
//               </div>
//               <div>
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Designation</label>
//                 <input type="text" name="designation" placeholder="e.g. Founder, HR Manager" value={formData.designation} onChange={handleChange} required className="line-input" />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Experience (Years)</label>
//                 <input type="number" name="experience" placeholder="e.g. 5" value={formData.experience} onChange={handleChange} required className="line-input" />
//               </div>
//               <div>
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Website URL</label>
//                 <input type="url" name="website" placeholder="https://company.com" value={formData.website} onChange={handleChange} required className="line-input" />
//               </div>
//             </div>

//             <div className="w-full flex flex-col gap-1.5 pt-1">
//               <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Upload ID Proof (Company ID / Govt ID)</label>
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


=======
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BusinessRegister() {
  const navigate = useNavigate();

<<<<<<< HEAD
  // =====================================================
  // API CONFIGURATION
  // =====================================================

  // Local:
  const REGISTER_API =
    'http://13.239.234.181:4000/api/v1/auth/register/business';

  // AWS:
  // const REGISTER_API =
  //   'http://13.239.234.181:4000/api/v1/auth/register/business';

  // =====================================================
  // SLIDER DATA
  // =====================================================

  const businessSlides = [
    {
      img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=1000&auto=format&fit=crop&q=80',
      title: 'Accelerate Your Business Growth',
      desc: 'Connect with skilled interns, find qualified talent, and scale your operations with WeGrow.',
    },
    {
      img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&auto=format&fit=crop&q=80',
      title: 'Post Opportunities & Find Talent',
      desc: 'Easily post internships and job openings to a vast network of verified students and graduates.',
    },
    {
      img: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=1000&auto=format&fit=crop&q=80',
      title: 'Build Your Employer Brand',
      desc: 'Showcase your company culture, attract top-tier talent, and establish your industry presence.',
    },
=======
  const businessSlides = [
    {
      img: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1000&auto=format&fit=crop&q=80",
      title: "Accelerate Your Business Growth",
      desc: "Connect with skilled interns, find qualified talent, and scale your operations with WeGrow."
    },
    {
      img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&auto=format&fit=crop&q=80",
      title: "Post Opportunities & Find Talent",
      desc: "Easily post internships and job openings to a vast network of verified students and graduates."
    },
    {
      img: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=1000&auto=format&fit=crop&q=80",
      title: "Build Your Employer Brand",
      desc: "Showcase your company culture, attract top-tier talent, and establish your industry presence."
    }
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

<<<<<<< HEAD
  // =====================================================
  // FORM DATA
  // =====================================================
=======
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % businessSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [businessSlides.length]);
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    state: '',
    companyName: '',
    businessType: '',
    designation: '',
    experience: '',
<<<<<<< HEAD
    website: '',
  });

  const [idProofFile, setIdProofFile] = useState(null);

  // IMPORTANT:
  // Your backend expects visitingCardUrl as STRING.
  //
  // If you already have an upload API, put the returned URL here.
  //
  // Example:
  // https://your-domain.com/uploads/visiting-card.jpg
  //
  // For now this can remain empty if your backend makes it optional.
  const [visitingCardUrl, setVisitingCardUrl] = useState('');

  // =====================================================
  // LOADING / MODALS
  // =====================================================

  const [loading, setLoading] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
  // SLIDER TIMER
  // =====================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % businessSlides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [businessSlides.length]);

  // =====================================================
  // DROPDOWN
  // =====================================================

=======
    website: ''
  });
  
  const [idProofFile, setIdProofFile] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Custom Modal State for Alerts
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: ''
  });

  const showAlert = (title, message) => {
    setModalConfig({ isOpen: true, title, message });
  };

>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
<<<<<<< HEAD
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // =====================================================
  // SUCCESS REDIRECT
  // =====================================================

  useEffect(() => {
    let timer;

    if (showSuccessModal) {
      timer = setTimeout(() => {
        navigate('/home/login', {
          state: {
            username: formData.username,
          },
        });
      }, 5000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [showSuccessModal, formData.username, navigate]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      phone: value,
    }));
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
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setIdProofFile(file);
    }
  };

  // =====================================================
  // REGISTER API
  // =====================================================

  const handleRegister = async (e) => {
    e.preventDefault();

    // Prevent double click
    if (loading) {
      return;
    }

    // ===================================================
    // PASSWORD MATCH
    // ===================================================

    if (formData.password !== formData.confirmPassword) {
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

    if (!passwordRegex.test(formData.password)) {
      showAlert(
        'Weak Password',
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
=======
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Automatic redirect timer (5 seconds) on success
  useEffect(() => {
    let timer;
    if (showSuccessModal) {
      timer = setTimeout(() => {
        navigate('/home/login', { state: { username: formData.username } });
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [showSuccessModal, formData.username, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    setFormData({ ...formData, phone: value });
  };

  const handleSelectOption = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setActiveDropdown(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIdProofFile(e.target.files[0]);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showAlert("Mismatch Error", "Passwords do not match! Please check again.");
      return;
    }

    // Password validation: Caps, Small, Number, Special Character, Min length 8
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      showAlert(
        "Weak Password",
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
      );
      return;
    }

<<<<<<< HEAD
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

    const firstDigit = formData.phone.charAt(0);

    if (!['6', '7', '8', '9'].includes(firstDigit)) {
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
        'Please upload your ID proof.'
      );
      return;
    }

    // ===================================================
    // WEBSITE VALIDATION
    // ===================================================

    if (!formData.website.trim()) {
      showAlert(
        'Website Required',
        'Please enter your company website.'
      );
      return;
    }

    // ===================================================
    // API REQUEST
    // ===================================================

    setLoading(true);

    try {
      const requestBody = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone,
        city: formData.city.trim(),
        state: formData.state.trim(),
        companyName: formData.companyName.trim(),
        businessType: formData.businessType.trim(),
        designation: formData.designation.trim(),
        experience: Number(formData.experience),
        website: formData.website.trim(),

        // Backend expects a STRING URL
        visitingCardUrl: visitingCardUrl.trim(),
      };

      console.log('Business Register Request:', requestBody);

      const response = await fetch(REGISTER_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Safely parse JSON
      let data = {};

      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError);
      }

      console.log('Business Register Response:', data);

      // =================================================
      // SUCCESS
      // =================================================

      if (response.ok && data.success !== false) {
        setShowSuccessModal(true);
        return;
      }

      // =================================================
      // API ERROR
      // =================================================

      let errorMessage = 'Business registration failed.';

      if (Array.isArray(data.message)) {
        errorMessage = data.message.join(', ');
      } else if (data.message) {
        errorMessage = data.message;
      }

      showAlert('Registration Failed', errorMessage);
    } catch (error) {
      console.error('Business Registration Error:', error);

      showAlert(
        'Network Error',
        'Unable to connect to the server. Please check your backend server and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // MODAL CLOSE
  // =====================================================

  const handleModalClose = () => {
    setShowSuccessModal(false);

    navigate('/home/login', {
      state: {
        username: formData.username,
      },
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
  // DROPDOWN OPTIONS
  // =====================================================

  const optionsList = {
    businessType: [
      'Software Development',
      'IT Services',
      'Consulting',
      'Manufacturing',
      'E-commerce',
      'Education',
      'Healthcare',
      'Finance',
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
      'Mumbai',
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

  const renderCustomDropdown = (name, placeholder) => {
    const isOpen = activeDropdown === name;

    const searchText = (formData[name] || '').toLowerCase();

    const filteredOptions = optionsList[name].filter((item) =>
      item.toLowerCase().includes(searchText)
    );
=======
    // 10 digits check
    if (formData.phone.length !== 10) {
      showAlert("Invalid Mobile Number", "Please enter a valid 10-digit mobile number.");
      return;
    }

    // Starts with 6, 7, 8, or 9 check
    const firstDigit = formData.phone.charAt(0);
    if (!['6', '7', '8', '9'].includes(firstDigit)) {
      showAlert("Invalid Mobile Number", "Give your valid mobile number.");
      return;
    }

    setShowSuccessModal(true);
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/home/login', { state: { username: formData.username } });
  };

  const handleAlertModalClose = () => {
    setModalConfig({ isOpen: false, title: '', message: '' });
  };

  const optionsList = {
    businessType: ["Software Development", "IT Services", "Consulting", "Manufacturing", "E-commerce", "Education", "Healthcare", "Finance"],
    city: ["Madurai", "Chennai", "Coimbatore", "Trichy", "Salem", "Tirunelveli", "Bangalore", "Hyderabad", "Mumbai"],
    state: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Maharashtra"]
  };

  const renderCustomDropdown = (name, placeholder) => {
    const isOpen = activeDropdown === name;
    const searchText = (formData[name] || "").toLowerCase();
    const filteredOptions = optionsList[name].filter(item => item.toLowerCase().includes(searchText));
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640

    return (
      <div className="relative" ref={dropdownRef}>
        <div className="relative flex items-center">
<<<<<<< HEAD
          <input
            type="text"
            name={name}
            placeholder={placeholder}
            value={formData[name]}
=======
          <input 
            type="text" 
            name={name} 
            placeholder={placeholder} 
            value={formData[name]} 
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
            onChange={(e) => {
              handleChange(e);
              setActiveDropdown(name);
            }}
            onFocus={() => setActiveDropdown(name)}
<<<<<<< HEAD
            required
            className="line-input pr-8"
          />

          <span
            className="absolute right-1 text-gray-500 text-xs cursor-pointer select-none"
            onClick={() =>
              setActiveDropdown(isOpen ? null : name)
            }
=======
            required 
            className="line-input pr-8" 
          />
          <span 
            className="absolute right-1 text-gray-500 text-xs cursor-pointer select-none"
            onClick={() => setActiveDropdown(isOpen ? null : name)}
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
          >
            ▼
          </span>
        </div>

        {isOpen && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-48 overflow-y-auto custom-scroll p-1.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => (
                <div
                  key={idx}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectOption(name, opt);
                  }}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#104288] rounded-xl cursor-pointer transition-all"
                >
                  {opt}
                </div>
              ))
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

<<<<<<< HEAD
  // =====================================================
  // UI
  // =====================================================

=======
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
  return (
    <>
      <style>{`
        @keyframes pageFadeIn {
<<<<<<< HEAD
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
          animation: pageFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

=======
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .page-fade {
          animation: pageFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
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
<<<<<<< HEAD

        .line-input:focus {
          border-bottom-color: #104288;
        }

=======
        .line-input:focus {
          border-bottom-color: #104288;
        }
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
        .register-btn {
          background: #104288;
          transition: all 0.25s ease;
        }
<<<<<<< HEAD

=======
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
        .register-btn:hover {
          background: #f97316 !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(249, 115, 22, 0.35) !important;
        }
<<<<<<< HEAD

=======
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
        .back-btn {
          background-color: #ffffff;
          border: 2px solid #d1d5db;
          color: #374151;
<<<<<<< HEAD
          transition: all 0.25s ease;
        }

=======
          font-size: 14px;
          padding: 10px 24px;
          border-radius: 9999px;
          font-weight: 800;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
        .back-btn:hover {
          background-color: #f1f5f9 !important;
          border-color: #104288 !important;
          color: #104288 !important;
<<<<<<< HEAD
        }

        .custom-scroll::-webkit-scrollbar {
          width: 5px;
        }

=======
          transform: translateY(-1px);
        }
        .custom-scroll::-webkit-scrollbar {
          width: 5px;
        }
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }
      `}</style>

<<<<<<< HEAD
      {/* =====================================================
          ALERT MODAL
      ===================================================== */}

      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100">
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
          SUCCESS MODAL
      ===================================================== */}

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
              Your business account has been created successfully.
              Click below to sign in.
            </p>

=======
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 transform transition-all">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-3xl">
              ✓
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Registration Successful!</h3>
            <p className="text-xs font-semibold text-gray-500 mb-6">
              Your business account has been created successfully. Click below to sign in.
            </p>
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
            <button
              onClick={handleModalClose}
              className="w-full py-3 rounded-full bg-[#104288] hover:bg-[#f97316] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Continue to Sign In
            </button>
          </div>
        </div>
      )}

<<<<<<< HEAD
      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="w-full max-w-6xl mx-auto px-4 flex items-center justify-center page-fade gap-6">

        {/* ===================================================
            LEFT SIDE
        =================================================== */}

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
              onClick={() => navigate('/home/login/option')}
              className="back-btn px-5 py-2 rounded-full font-bold text-xs cursor-pointer shadow-sm"
=======
      <div className="w-full max-w-6xl mx-auto px-4 flex items-center justify-center page-fade gap-6">
        
        <div className="w-full lg:w-5/12 bg-white/95 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-gray-900 hidden lg:flex flex-col justify-between relative overflow-hidden self-stretch">
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center">
              <img src="/login/logo.jpg" alt="Logo Icon" className="w-12 h-12 object-contain relative z-10" />
              <img src="/login/wegrow-logo.png" alt="WeGrow Text Logo" className="w-[160px] h-[48px] object-contain -ml-6 relative z-0" />
            </div>
            <button 
              type="button"
              onClick={() => navigate('/home/login/option')}
              className="back-btn cursor-pointer"
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
            >
              ← Back
            </button>
          </div>

<<<<<<< HEAD
          <div className="relative z-10 my-auto py-8">

            <div className="h-44 sm:h-52 rounded-2xl overflow-hidden shadow-lg mb-6 border border-gray-200/60 relative">

              {businessSlides.map((slide, idx) => (
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
                    alt="Business"
                    className="w-full h-full object-cover filter brightness-90"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
                    <p className="text-xs font-semibold text-white/95">
                      {slide.desc}
                    </p>
                  </div>

                </div>
              ))}

            </div>

            <h2 className="text-xl sm:text-2xl font-black mb-2 leading-snug text-[#104288]">
              {businessSlides[currentSlide].title}
            </h2>

            <p className="text-xs text-[#f97316] leading-relaxed font-bold">
              {businessSlides[currentSlide].desc}
            </p>

          </div>

          <div className="relative z-10 flex items-center justify-center gap-2">

            {businessSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? 'w-6 bg-[#f97316]'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}

          </div>
        </div>

        {/* ===================================================
            RIGHT SIDE FORM
        =================================================== */}

        <div className="w-full lg:w-7/12 p-6 sm:p-10 overflow-y-auto custom-scroll max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-gray-200/80">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h3 className="text-2xl font-black text-gray-900">
                Business Register
              </h3>

              <p className="text-xs font-semibold text-gray-500 mt-1">
                Create your business account. Find talent & post opportunities.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/home/login/option')}
              className="lg:hidden back-btn px-3 py-1.5 rounded-full font-bold text-xs cursor-pointer shadow-sm"
            >
              ← BACK
            </button>

          </div>

          <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">

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
                  className="line-input"
                />
              </div>

            </div>

            {/* PHONE / COMPANY */}

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
                  className="line-input"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Company Name
                </label>

                <input
                  type="text"
                  name="companyName"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="line-input"
                />
              </div>

            </div>

            {/* BUSINESS TYPE / DESIGNATION */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Business Type
                </label>

                {renderCustomDropdown(
                  'businessType',
                  'Select or type business type'
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Designation
                </label>

                <input
                  type="text"
                  name="designation"
                  placeholder="e.g. Founder, HR Manager"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                  className="line-input"
                />
              </div>

            </div>

            {/* EXPERIENCE / WEBSITE */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Experience (Years)
                </label>

                <input
                  type="number"
                  name="experience"
                  placeholder="e.g. 5"
                  min="0"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="line-input"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Website URL
                </label>

                <input
                  type="url"
                  name="website"
                  placeholder="https://company.com"
                  value={formData.website}
                  onChange={handleChange}
                  required
                  className="line-input"
                />
              </div>

            </div>

            {/* ID PROOF */}

            <div className="w-full flex flex-col gap-1.5 pt-1">

              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Upload ID Proof (Company ID / Govt ID)
              </label>

              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                required
                className="w-full text-xs font-semibold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-[#104288] hover:file:bg-blue-100 cursor-pointer border border-dashed border-gray-300 rounded-xl p-1 bg-gray-50/50"
              />

              {idProofFile && (
                <p className="text-[11px] text-green-600 font-semibold">
                  Selected: {idProofFile.name}
                </p>
              )}

            </div>

            {/* VISITING CARD URL */}

            {/* <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Visiting Card URL
              </label>

              <input
                type="url"
                name="visitingCardUrl"
                placeholder="https://example.com/visiting-card.jpg"
                value={visitingCardUrl}
                onChange={(e) => setVisitingCardUrl(e.target.value)}
                className="line-input"
              />

              <p className="text-[10px] text-gray-400 mt-1">
                Enter the uploaded visiting card URL.
              </p>
            </div> */}

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
                className="register-btn w-full py-3.5 rounded-full font-extrabold text-white text-sm uppercase tracking-wider border-none cursor-pointer shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'REGISTERING...' : 'REGISTER'}
              </button>

            </div>

            {/* LOGIN */}

            <div className="flex items-center justify-between text-xs font-bold text-gray-500 pt-2 px-1">

              <span>Already a member?</span>

              <button
                type="button"
                onClick={() => navigate('/home/login')}
                className="text-[#104288] hover:text-orange-500 transition-colors font-extrabold cursor-pointer"
              >
                Sign In
              </button>

            </div>

          </form>

=======
          <div className="relative z-10 my-auto py-4">
            <div className="h-64 sm:h-72 rounded-2xl overflow-hidden shadow-lg mb-6 border border-gray-200/60 relative">
              {businessSlides.map((slide, idx) => (
                <div 
                  key={idx} 
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  <img src={slide.img} alt="Slide" className="w-full h-full object-cover filter brightness-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
                    <p className="text-xs font-semibold text-white/95">{slide.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 
              className="text-xl sm:text-2xl font-black mb-2 leading-snug drop-shadow-sm text-[#104288]"
              dangerouslySetInnerHTML={{ __html: businessSlides[currentSlide].title }}
            ></h2>
            <p 
              className="text-xs leading-relaxed font-bold text-[#f97316]"
            >{businessSlides[currentSlide].desc}</p>
          </div>

          <div className="relative z-10 flex items-center justify-center gap-2 pb-2">
            {businessSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-[#f97316]' : 'w-2 bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

        <div className="w-full lg:w-7/12 p-6 sm:p-10 overflow-y-auto custom-scroll max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-gray-200/80">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-[#104288]">Business Register</h3>
              <p className="text-xs font-semibold text-[#f97316] mt-1">Create your business account. Find talent & post opportunities.</p>
            </div>
            <button 
              type="button"
              onClick={() => navigate('/home/login/option')}
              className="lg:hidden back-btn cursor-pointer text-xs py-2 px-4"
            >
              ← BACK
            </button>
          </div>

          <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#104288] uppercase tracking-wider">First Name</label>
                <input type="text" name="firstName" placeholder="Enter first name" value={formData.firstName} onChange={handleChange} required className="line-input" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#104288] uppercase tracking-wider">Last Name</label>
                <input type="text" name="lastName" placeholder="Enter last name" value={formData.lastName} onChange={handleChange} required className="line-input" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#104288] uppercase tracking-wider">Username</label>
                <input type="text" name="username" placeholder="Choose a username" value={formData.username} onChange={handleChange} required className="line-input" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#104288] uppercase tracking-wider">Email Address</label>
                <input type="email" name="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} required className="line-input" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#104288] uppercase tracking-wider">Password</label>
                <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required className="line-input" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#104288] uppercase tracking-wider">Confirm Password</label>
                <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required className="line-input" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#104288] uppercase tracking-wider">Phone Number</label>
                <input 
                  type="text" 
                  name="phone" 
                  placeholder="9876543210" 
                  value={formData.phone} 
                  onChange={handlePhoneChange} 
                  maxLength={10} 
                  required 
                  className="line-input" 
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#104288] uppercase tracking-wider">Company Name</label>
                <input type="text" name="companyName" placeholder="Enter company name" value={formData.companyName} onChange={handleChange} required className="line-input" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#104288] uppercase tracking-wider">Business Type</label>
                {renderCustomDropdown('businessType', 'Select or type business type')}
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#104288] uppercase tracking-wider">Designation</label>
                <input type="text" name="designation" placeholder="e.g. Founder, HR Manager" value={formData.designation} onChange={handleChange} required className="line-input" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#104288] uppercase tracking-wider">Experience (Years)</label>
                <input type="number" name="experience" placeholder="e.g. 5" value={formData.experience} onChange={handleChange} required className="line-input" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#104288] uppercase tracking-wider">Website URL</label>
                <input type="url" name="website" placeholder="https://company.com" value={formData.website} onChange={handleChange} required className="line-input" />
              </div>
            </div>

            <div className="w-full flex flex-col gap-1.5 pt-1">
              <label className="text-[11px] font-bold text-[#104288] uppercase tracking-wider">Upload ID Proof (Company ID / Govt ID)</label>
              <input 
                type="file" 
                accept="image/*,.pdf" 
                onChange={handleFileChange} 
                required 
                className="w-full text-xs font-semibold text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-[#104288] hover:file:bg-blue-100 cursor-pointer border border-dashed border-gray-300 rounded-xl p-1 bg-gray-50/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-[#104288] uppercase tracking-wider">City</label>
                {renderCustomDropdown('city', 'Select or type city')}
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#104288] uppercase tracking-wider">State</label>
                {renderCustomDropdown('state', 'Select or type state')}
              </div>
            </div>

            <div className="pt-3">
              <button 
                type="submit" 
                className="register-btn w-full py-3.5 rounded-full font-extrabold text-white text-sm uppercase tracking-wider border-none cursor-pointer shadow-lg bg-[#104288]"
              >
                REGISTER
              </button>
            </div>

            <div className="flex items-center justify-between text-xs font-bold pt-2 px-1">
              <span className="text-[#104288]">Already a member?</span>
              <button type="button" onClick={() => navigate('/home/login')} className="text-[#f97316] hover:text-[#104288] transition-colors font-extrabold cursor-pointer">
                Sign In
              </button>
            </div>
          </form>
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
        </div>
      </div>
    </>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
