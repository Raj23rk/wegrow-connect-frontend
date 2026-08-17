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
        >
          ← Back to Login
        </button>

        {/* MAIN CONTAINER FOR 2 BOXES */}
        <div className="w-full max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-8">
          
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