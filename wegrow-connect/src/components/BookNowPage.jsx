import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BookNowPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // Pass pandra event object-ai state moolama eduthukrom, illana default fallback
  const eventData = location.state?.eventData || {
    title: 'Startup Founder Scaling & Growth Masterclass',
    description: 'Discover proven frameworks and strategic blueprints for building high-performing corporate teams, acquiring venture capital, and scaling business operations rapidly in competitive markets. This masterclass offers deep insights into financial forecasting, product-market fit validation, efficient go-to-market strategies, and sustainable revenue generation models tailored specifically for modern entrepreneurs and ambitious startup founders looking to dominate their respective industries.',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&auto=format&fit=crop&q=80',
    location: 'Chennai Hub',
    date: '2026-06-22',
    price: '1499',
    type: 'BUSINESS'
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleBookYourSeat = () => {
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      navigate(-1);
    }, 5000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col h-screen overflow-hidden animate-fadeIn font-['Inter']">
      
      {/* SUCCESS MODAL POPUP */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100 transform transition-all">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-3xl">
              ✓
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Your seat is booked!</h3>
            <p className="text-xs font-semibold text-gray-500 mb-6">
              You have successfully reserved your seat for {eventData.title}. Redirecting back shortly...
            </p>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA: LEFT FIXED IMAGE, RIGHT SCROLLABLE CONTENT */}
      <div className="flex-grow flex flex-col lg:flex-row items-start overflow-hidden w-full h-full">
        
        {/* LEFT SIDE: FIXED LARGE IMAGE */}
        <div className="w-full lg:w-1/2 h-72 lg:h-full p-6 sm:p-10 flex items-center justify-center">
          <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-gray-100 border border-gray-200">
            <img 
              src={eventData.image} 
              alt={eventData.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT SIDE: SCROLLABLE CONTENT */}
        <div className="w-full lg:w-1/2 h-full p-6 sm:p-10 overflow-y-auto custom-scroll flex flex-col justify-between">
          <div>
            {/* TOP BADGE */}
            <div className="mb-4">
              <span className="inline-block text-xs font-black uppercase px-4 py-1.5 rounded-full shadow-sm bg-orange-50 text-[#f97316]">
                {eventData.type}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 leading-tight">
              {eventData.title}
            </h1>

            {/* 10+ LINE PARAGRAPH */}
            <p className="text-xs sm:text-sm font-semibold text-gray-700 leading-relaxed mb-6 text-justify">
              {eventData.description}
            </p>

            <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200 mb-6">
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase">Location</span>
                <span className="text-xs font-black text-gray-900">📍 {eventData.location}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase">Date</span>
                <span className="text-xs font-black text-gray-900">📅 {new Date(eventData.date).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase">Seat Pricing</span>
                <span className="text-xs font-black text-[#104288]">₹{eventData.price}</span>
              </div>
            </div>
          </div>

          {/* BUTTONS PLACED AT THE BOTTOM OF RIGHT CONTENT AREA */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-200 mt-4">
            <button 
              onClick={handleBack}
              className="px-8 py-3 rounded-full border-2 border-gray-300 hover:border-[#104288] text-gray-700 font-extrabold text-xs uppercase transition-all cursor-pointer"
            >
              BACK
            </button>
            
            <button 
              onClick={handleBookYourSeat}
              className="px-8 py-3 rounded-full bg-[#104288] hover:bg-[#f97316] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
            >
              BOOK YOUR SEAT
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}