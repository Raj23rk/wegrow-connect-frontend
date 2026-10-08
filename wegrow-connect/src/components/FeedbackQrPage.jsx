import React, { useEffect } from 'react';

export default function FeedbackQrPage() {
  const feedbackUrl = 'https://www.wegrowbschool.in/feedback';

  useEffect(() => {
    document.title = 'QR Standee Poster · Business Transformation Meetup · WeGrow';
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(feedbackUrl);
    alert('✓ Copied to clipboard: ' + feedbackUrl);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white print:text-slate-900">
      {/* Floating Action Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3 print:hidden">
        <a
          href="/feedback"
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-white border border-slate-700"
        >
          ← Open Feedback Form
        </a>
        <button
          onClick={handleCopy}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-slate-200 border border-slate-700"
        >
          📋 Copy Form Link
        </button>
        <button
          onClick={handlePrint}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F26A1B] to-[#EC6518] hover:brightness-110 text-sm font-bold text-white shadow-lg shadow-orange-500/25"
        >
          🖨️ Print Standee / Poster
        </button>
      </div>

      {/* Standee Poster Card */}
      <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl border-4 border-[#1B2A6B] text-center relative overflow-hidden print:border-none print:shadow-none print:max-w-none print:p-8">
        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-[#F26A1B] font-bold text-xs uppercase tracking-widest mb-4 border border-orange-200">
          ★ WeGrow B School ★
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#1B2A6B] tracking-tight leading-tight mb-2">
          Business Transformation Meetup
        </h1>
        <p className="text-sm font-medium text-slate-600 mb-6">
          Scan with your smartphone camera to submit your session feedback
        </p>

        {/* QR Code Container */}
        <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 inline-block mb-6 shadow-inner">
          <img
            src="/business-transformation-feedback-qr.png"
            alt="Feedback QR Code"
            className="w-64 h-64 sm:w-72 sm:h-72 object-contain mx-auto"
            onError={(e) => {
              e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(feedbackUrl)}`;
            }}
          />
        </div>

        {/* URL Pill */}
        <div className="bg-[#1B2A6B] text-white py-3 px-5 rounded-2xl font-mono text-sm sm:text-base font-bold tracking-tight shadow-md mb-4 flex items-center justify-center gap-2">
          <span>🌐</span>
          <span>{feedbackUrl}</span>
        </div>

        <p className="text-xs text-slate-500 font-medium">
          Takes under 60 seconds · Instant Confidential Submission
        </p>
      </div>
    </div>
  );
}
