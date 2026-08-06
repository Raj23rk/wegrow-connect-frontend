import React from 'react';
import { theme } from '../theme';

const seminarData = [
  { img: "seminar/1.png", title: "Industry Expert Talks", desc: "Keynotes from tech leaders & innovators." },
  { img: "seminar/2.png", title: "Live Demonstrations", desc: "Real-time project & tech architecture breakdowns." },
  { img: "seminar/3.png", title: "Interactive Q&A", desc: "Direct guidance and career mentoring." },
  { img: "seminar/4.png", title: "Networking Hub", desc: "Connect with like-minded ambitious peers." },
  { img: "seminar/5.png", title: "Certification & Guidance", desc: "Insights on future career roadmaps." }
];

export default function SeminarSection({ seminarTargetRef, seminarStyle }) {
  return (
    <section 
      ref={seminarTargetRef} 
      id="seminars" 
      style={seminarStyle}
      className="relative pt-2 pb-16 transition-all duration-300 ease-out transform-gpu"
    >
      <div className="max-w-7xl mx-auto px-6 space-y-6">

        {/* TOP INTRO TEXT & HEADINGS */}
        <div id="seminar-title" className="max-w-4xl mx-auto space-y-3 text-center pt-0">
          <span className="text-xs uppercase font-black tracking-widest block" style={{ color: theme.orange }}>
            Executive Tech Seminars
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold drop-shadow-sm" style={{ color: theme.primary }}>
            Learn from Industry Leaders & Innovators
          </h2>
          <p className="text-base lg:text-lg font-semibold leading-relaxed" style={{ color: theme.textMuted }}>
            Our intensive seminars bring together global experts, tech pioneers, and ambitious learners for interactive sessions, guest lectures, and deep-dive technical workshops designed to accelerate your career growth.
          </p>

          {/* HIGHLIGHT POINTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-left">
            {["Keynote Sessions", "Interactive Q&A", "Peer Networking"].map((item, idx) => (
              <div key={idx} className="backdrop-blur-md p-5 rounded-2xl shadow-lg transition" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
                <h4 className="font-extrabold text-lg mb-1" style={{ color: theme.primary }}>✦ {item}</h4>
                <p className="text-xs font-medium leading-normal" style={{ color: theme.textMuted }}>Direct insights and mentorship from top industry experts.</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5 GALLERY IMAGES WITH POINTS */}
        <div className="pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
            {seminarData.map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="w-full overflow-hidden rounded-3xl shadow-xl transition duration-300 hover:scale-[1.03]" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
                  <img src={item.img} alt={item.title} className="w-full h-52 object-cover group-hover:brightness-110 transition duration-500" />
                </div>
                <div className="mt-3 px-1">
                  <h5 className="font-extrabold text-sm" style={{ color: theme.textBright }}>{item.title}</h5>
                  <p className="text-xs font-medium mt-1 leading-snug" style={{ color: theme.textMuted }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}