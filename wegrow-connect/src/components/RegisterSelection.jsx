import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterSelection() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/home/login');
  };

  return (
    <>
      <style>{`
        @keyframes pageFadeIn {
          from { 
            opacity: 0; 
            transform: translateY(15px) scale(0.96); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        .page-fade {
          animation: pageFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .reg-card {
          transition: all 0.3s ease;
        }
        .reg-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 35px rgba(0,0,0,0.15) !important;
        }
        .reg-btn-student {
          background-color: #104288;
          transition: all 0.25s ease;
        }
        .reg-btn-student:hover {
          background-color: #f97316 !important;
          transform: translateY(-1px);
        }
        .reg-btn-business {
          background-color: #f97316;
          transition: all 0.25s ease;
        }
        .reg-btn-business:hover {
          background-color: #104288 !important;
          transform: translateY(-1px);
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
      `}</style>

<<<<<<< HEAD
      {/* WRAPPER WITH SLOW FADE ANIMATION */}
      <div className="w-full h-full flex items-center justify-center relative page-fade">

        {/* BACK BUTTON WITH LOGIN SCREEN STYLE */}
        <button 
          type="button"
          onClick={handleBackClick}
          className="back-btn"
          style={{
            position: 'absolute',
            top: '30px',
            left: '40px',
            padding: '10px 22px',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            zIndex: 50
          }}
=======
      {/* WRAPPER WITH SLOW FADE ANIMATION - this div already receives a
          definite height from AuthLayout's own h-screen -> h-full chain,
          so giving IT overflow-y-auto (instead of AuthLayout) creates a
          scroll region local to this component only. AuthLayout's own
          overflow-hidden governs AuthLayout's box, not this descendant's -
          a child can scroll internally even while an ancestor clips.
          items-start on mobile lets content that's taller than the
          viewport actually be reached by scrolling; lg:items-center
          keeps the original desktop centered look, since content already
          fits there. */}
      <div className="w-full h-full overflow-y-auto flex items-start lg:items-center justify-center relative page-fade">

        {/* BACK BUTTON - was a fixed absolute top:30px/left:40px which only
            had clearance above the cards on desktop (where there's extra
            vertical whitespace); on mobile the cards start much closer to
            the top, so the button landed on top of the Student card.
            Now it's closer to the content on mobile (top-4/left-4, smaller
            padding+text) and switches to the original desktop position and
            size at the lg breakpoint. It scrolls together with the page
            content now, which is expected since it's part of the flow. */}
        <button 
          type="button"
          onClick={handleBackClick}
          className="back-btn absolute top-4 left-4 lg:top-[30px] lg:left-10 px-4 py-2 lg:px-[22px] lg:py-[10px] rounded-full font-bold text-xs lg:text-sm cursor-pointer shadow-sm z-50"
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
        >
          ← Back to Login
        </button>

<<<<<<< HEAD
        {/* MAIN CONTAINER FOR 2 BOXES */}
        <div className="w-full max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-8">
=======
        {/* MAIN CONTAINER FOR 2 BOXES - pt-16 on mobile reserves guaranteed
            clearance below the back button; pb-10 gives breathing room at
            the bottom once scrolled all the way down so the Business
            button isn't flush against the screen edge. lg:pt-0 lg:pb-0
            restores the original desktop spacing where this wasn't needed. */}
        <div className="w-full max-w-5xl mx-auto px-6 pt-16 pb-10 lg:pt-0 lg:pb-0 flex flex-col md:flex-row items-center justify-center gap-8">
>>>>>>> 8aaf596c92567f6dbd348a56a1c4a0b3d9c5b640
          
          {/* BOX 1: STUDENT */}
          <div 
            className="reg-card w-full md:w-1/2 bg-white/95 backdrop-blur-2xl border-2 border-[#104288] rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center"
          >
            <h3 className="text-2xl font-black mb-4" style={{ color: '#104288' }}>Student</h3>
            <ul className="text-left text-sm font-semibold text-gray-700 leading-loose pl-5 mb-8 w-full space-y-2">
              <li>✨ Access exclusive tech talks & hands-on workshops</li>
              <li>✨ Gain real-time industry project experience</li>
              <li>✨ Get verified certifications & career mentorship</li>
            </ul>
            <button 
              onClick={() => navigate('/home/login/option/student')} 
              className="reg-btn-student w-full py-3.5 rounded-full font-extrabold text-white text-base border-none cursor-pointer shadow-md"
            >
              Register as Student
            </button>
          </div>

          {/* BOX 2: BUSINESS */}
          <div 
            className="reg-card w-full md:w-1/2 bg-white/95 backdrop-blur-2xl border-2 border-[#f97316] rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center"
          >
            <h3 className="text-2xl font-black mb-4" style={{ color: '#f97316' }}>Business</h3>
            <ul className="text-left text-sm font-semibold text-gray-700 leading-loose pl-5 mb-8 w-full space-y-2">
              <li>✨ Corporate training & employee skill enhancement</li>
              <li>✨ On-site industrial visits & strategic collaborations</li>
              <li>✨ Custom technical solutions & talent acquisition</li>
            </ul>
            <button 
              onClick={() => navigate('/home/login/option/business')} 
              className="reg-btn-business w-full py-3.5 rounded-full font-extrabold text-white text-base border-none cursor-pointer shadow-md"
            >
              Register as Business
            </button>
          </div>

        </div>

      </div>
    </>
  );
}