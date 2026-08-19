import React from 'react';
import { theme } from '../theme';

export default function VisitSection({ visitTargetRef, visitStyle }) {
  return (
    <section 
      ref={visitTargetRef} 
      id="visit" 
      style={visitStyle}
      className="relative pt-2 pb-20 transition-all duration-300 ease-out transform-gpu"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* SECTION HEADER */}
        <div id="visit-title" className="text-center mb-10 pt-0">
          <span className="text-xs uppercase font-black tracking-widest block mb-2" style={{ color: theme.orange }}>
            Field Exposure Programs
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold drop-shadow-sm" style={{ color: theme.primary }}>
            Industry & Campus Visits
          </h2>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT SIDE: 8-PHOTO COLLAGE GRID */}
          <div className="lg:col-span-7 backdrop-blur-md p-4 md:p-6 rounded-3xl shadow-2xl border" style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
            <div className="grid grid-cols-3 gap-2 md:gap-3 h-[420px] md:h-[480px]">
              
              {/* Image 1: Main Classroom View (Large Vertical Left) */}
              <div className="col-span-1 row-span-2 overflow-hidden rounded-2xl border" style={{ borderColor: theme.cardBorder }}>
                <img src="/visit/Image 1.jpg" alt="Classroom View" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
              </div>

              {/* Image 2 & Image 3: Mentorship Close-ups (Top Middle Stack) */}
              <div className="col-span-1 row-span-1 overflow-hidden rounded-2xl border" style={{ borderColor: theme.cardBorder }}>
                <img src="/visit/Image 2.jpg" alt="Screen Interaction" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
              </div>
              <div className="col-span-1 row-span-1 overflow-hidden rounded-2xl border" style={{ borderColor: theme.cardBorder }}>
                <img src="/visit/Image 3.jpg" alt="Personal Mentorship" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
              </div>

              {/* Image 4: Presentation Shot (Wide Middle Banner) */}
              <div className="col-span-2 row-span-1 overflow-hidden rounded-2xl border" style={{ borderColor: theme.cardBorder }}>
                <img src="/visit/Image 4.jpg" alt="Screen Presentation" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
              </div>

              {/* Image 5 & 6: Lab Row & Students Working (Bottom Left / Center) */}
              <div className="col-span-1 row-span-1 overflow-hidden rounded-2xl border" style={{ borderColor: theme.cardBorder }}>
                <img src="/visit/Image 5.jpg" alt="Lab Infrastructure" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
              </div>
              <div className="col-span-1 row-span-1 overflow-hidden rounded-2xl border" style={{ borderColor: theme.cardBorder }}>
                <img src="/visit/Image 6.jpg" alt="Students Working" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
              </div>

              {/* Image 7 & 8: Guidance & Instructor (Right Stack) */}
              <div className="col-span-1 row-span-1 overflow-hidden rounded-2xl border" style={{ borderColor: theme.cardBorder }}>
                <img src="/visit/Image 7.jpg" alt="Desk Guidance" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
              </div>

            </div>
          </div>

          {/* RIGHT SIDE: DESCRIPTION PARAGRAPH & HIGHLIGHTS */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md inline-block" style={{ color: theme.primary, backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
                ✦ Real-World Exposure
              </span>
              <h3 className="text-2xl lg:text-3xl font-extrabold leading-snug" style={{ color: theme.textBright }}>
                Bridging Academic Learning with Industrial Execution
              </h3>
              <p className="text-sm md:text-base font-medium leading-relaxed" style={{ color: theme.textMuted }}>
                Our Campus & Industry Visit initiatives offer students direct access to modern working environments, high-end lab infrastructures, and real-time project workflows. Through interactive sessions, guided mentorship, and practical walkthroughs, learners gain crucial exposure to operating industry standards before entering the workforce.
              </p>
            </div>

            {/* KEY HIGHLIGHT POINTS */}
            <div className="space-y-3 pt-2">
              {[
                { title: "Live Lab Workflows", desc: "Hands-on access to advanced systems & tools." },
                { title: "1-on-1 Instructor Guidance", desc: "Direct troubleshooting and technical mentorship." },
                { title: "Practical Exposure", desc: "Experiencing live workplace culture & operations." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl border backdrop-blur-md" style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
                  <span className="text-lg" style={{ color: theme.neutralText }}>✦</span>
                  <div>
                    <h5 className="font-extrabold text-sm" style={{ color: theme.textBright }}>{item.title}</h5>
                    <p className="text-xs font-medium mt-0.5" style={{ color: theme.textMuted }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}