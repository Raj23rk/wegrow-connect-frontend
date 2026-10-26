import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Printer,
  Download,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Flame,
  Gift,
  Building,
  Phone,
  Globe,
  Share2,
  ArrowLeft
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function SpinAndWinQrPage() {
  const targetUrl = 'https://www.wegrowbschool.in/spin-and-win';
  const canvasRef = useRef(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrTheme, setQrTheme] = useState('festive'); // 'festive' (Gold/Burgundy) or 'classic' (Black/White)

  useEffect(() => {
    document.title = 'QR Standee & Poster · Diwali Spin & Win · WeGrow B-School';
  }, []);

  // Generate QR Code dynamically
  useEffect(() => {
    const isClassic = qrTheme === 'classic';
    const darkColor = isClassic ? '#000000' : '#450a0a'; // Deep burgundy or black
    const lightColor = '#ffffff';

    QRCode.toDataURL(targetUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code:', err));

    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, targetUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: darkColor,
          light: lightColor
        },
        errorCorrectionLevel: 'H'
      }).catch((err) => console.error('Canvas QR error:', err));
    }
  }, [qrTheme, targetUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    toast.success('Link copied: ' + targetUrl);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'WeGrow_Diwali_Spin_and_Win_QR.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('QR Code image downloaded!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0F0206] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white print:text-slate-900 font-sans selection:bg-amber-500 selection:text-slate-950">
      <Toaster position="top-center" />

      {/* Floating Action Bar (Hidden when printing) */}
      <div className="w-full max-w-2xl mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden bg-[#1F050F]/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-amber-500/30 shadow-2xl">
        <div className="flex items-center gap-2">
          <a
            href="/spin-and-win"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-amber-200 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Open Spin Wheel</span>
          </a>
          <a
            href="/campus-desk"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/30 text-xs font-bold text-rose-300 transition"
          >
            <Building className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Counselor Desk</span>
          </a>
          <a
            href="/diwali-challenge"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-xs font-bold text-amber-300 transition"
          >
            <span>⚡</span>
            <span className="hidden sm:inline">20-Q Challenge</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          {/* QR Style Toggle */}
          <button
            type="button"
            onClick={() => setQrTheme(qrTheme === 'festive' ? 'classic' : 'festive')}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-amber-300 transition"
            title="Toggle QR Color Style"
          >
            {qrTheme === 'festive' ? '🎨 Festive Gold' : '⬛ High-Contrast'}
          </button>

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy URL'}</span>
          </button>

          {/* Download PNG */}
          <button
            type="button"
            onClick={handleDownloadQr}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-xs font-bold text-amber-300 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>

          {/* Print Standee / Poster */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-xs font-black text-slate-950 shadow-lg shadow-orange-500/20 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Standee</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PRINTABLE STANDEE / POSTER CARD                         */}
      {/* ======================================================== */}
      <div className="w-full max-w-lg bg-gradient-to-b from-[#2A0615] via-[#1A030C] to-[#120207] text-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-500/40 text-center relative overflow-hidden print:bg-white print:text-slate-900 print:border-none print:shadow-none print:max-w-none print:p-6 print:rounded-none">
        
        {/* Decorative Top Rangoli / Diya Accent */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xl">🪔</span>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-black uppercase tracking-widest shadow-inner print:border-amber-600 print:text-amber-800">
            <Flame className="w-3 h-3 text-amber-400 animate-pulse print:text-amber-600" />
            <span>WeGrow B-School · Festive Skill Deal</span>
          </div>
          <span className="text-xl">🪔</span>
        </div>

        {/* Main Event Headline */}
        <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-400 uppercase tracking-tight leading-tight mb-1.5 print:text-slate-900">
          Diwali Deal! Spin & Win
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-amber-200/90 mb-5 max-w-sm mx-auto print:text-slate-700">
          Scan with your smartphone camera to spin the wheel & win guaranteed career scholarships!
        </p>

        {/* High-Resolution QR Code Container */}
        <div className="relative inline-block mx-auto mb-4 p-4 rounded-3xl bg-white shadow-2xl border-4 border-amber-400 print:border-slate-800">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Scan to Spin and Win QR"
              className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl block mx-auto"
            />
          ) : (
            <canvas ref={canvasRef} className="w-56 h-56 sm:w-64 sm:h-64 rounded-xl" />
          )}

          {/* Center Badge Over QR */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-amber-400 border-2 border-white shadow-lg flex items-center justify-center text-slate-950 font-black text-xs">
              🎡
            </div>
          </div>
        </div>

        {/* Scan Instruction Pill */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md print:bg-slate-900 print:text-white">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Point Camera & Scan to Spin Now</span>
          </div>
          <p className="text-[11px] font-mono text-amber-200/80 mt-1.5 select-all print:text-slate-600">
            https://www.wegrowbschool.in/spin-and-win
          </p>
        </div>

        {/* Prize Pool Highlights */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/20 mb-5 print:bg-slate-50 print:border-slate-200">
          <div className="text-[11px] uppercase tracking-wider font-extrabold text-amber-300 mb-2 print:text-amber-700">
            🎉 Guaranteed Festive Rewards on Wheel
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200 print:bg-white print:text-slate-800 print:border-slate-300">
              5% OFF
            </div>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200 print:bg-white print:text-slate-800 print:border-slate-300">
              10% OFF
            </div>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200 print:bg-white print:text-slate-800 print:border-slate-300">
              15% OFF
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 print:bg-white print:text-emerald-800 print:border-slate-300">
              20% OFF
            </div>
            <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-400/30 text-rose-300 print:bg-white print:text-rose-800 print:border-slate-300">
              Gift 🎁
            </div>
            <div className="p-2 rounded-xl bg-yellow-500/15 border border-yellow-400/30 text-yellow-300 print:bg-white print:text-yellow-800 print:border-slate-300">
              Free Demo ✨
            </div>
          </div>
        </div>

        {/* Campus Visit Locations & Contact */}
        <div className="pt-3 border-t border-amber-500/20 text-left text-xs text-amber-100/80 space-y-2 print:text-slate-700 print:border-slate-300">
          <div className="flex items-start gap-2">
            <Building className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 print:text-slate-900" />
            <div className="text-[11px] leading-tight">
              <span className="font-bold text-white block print:text-slate-900">
                WeGrow Skill Campus & B-School
              </span>
              <span>• Sivakasi Campus & Srivilliputtur Campus (129 North Car Street)</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <div className="flex items-center gap-1.5 text-amber-200 font-semibold print:text-slate-800">
              <Phone className="w-3.5 h-3.5 text-amber-400 print:text-slate-900" />
              <span>+91 93443 37331 / 90875 37331</span>
            </div>
            <div className="flex items-center gap-1 text-amber-300 font-bold print:text-slate-800">
              <Globe className="w-3.5 h-3.5" />
              <span>wegrowbschool.in</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom helper text */}
      <p className="mt-4 text-xs text-amber-200/50 print:hidden text-center">
        This high-resolution QR standee can be printed on A4 paper or displayed on desktop/mobile screens.
      </p>
    </div>
  );
}
