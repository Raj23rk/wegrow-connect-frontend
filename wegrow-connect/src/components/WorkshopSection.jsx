import React from 'react';
import { theme } from '../theme';

export default function WorkshopSection({
  eventsTargetRef,
  activeItem,
  imgOpacity,
  workshopsData,
  itemRefs,
  updateActiveCard,
  workshopStyle
}) {
  return (
    <section 
      ref={eventsTargetRef}
      id="partners" 
      style={workshopStyle} 
      className="relative min-h-screen pt-2 pb-20 transition-all duration-300 ease-out transform-gpu"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER - NO FADE OUT */}
        <div 
          id="events" 
          className="text-center mb-10 pt-2"
        >
          <span className="text-xs uppercase font-black tracking-widest block mb-2" style={{ color: theme.orange }}>
            Skill Development Programs
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold drop-shadow-sm" style={{ color: theme.primary }}>
            Transform Your Career Path
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          
          {/* LEFT STICKY CARD */}
          <div className="lg:col-span-4 sticky top-24 text-center z-10 flex flex-col items-center">
            <span 
              className="text-[11px] uppercase font-black tracking-wider px-3 py-1 rounded-full border mb-2 backdrop-blur-md shadow-sm"
              style={{ 
                color: theme.primary, 
                backgroundColor: theme.cardBg, 
                borderColor: theme.cardBorder 
              }}
            >
              ✦ Project Overview
            </span>

            <img 
              src={activeItem.leftImg} 
              alt={activeItem.leftTitle} 
              style={{ opacity: imgOpacity, borderColor: theme.cardBorder }}
              className="w-full h-64 object-cover rounded-3xl transition-opacity duration-300 shadow-2xl border"
            />
            <h4 className="font-extrabold text-base mt-3" style={{ color: theme.textBright }}>{activeItem.leftTitle}</h4>
            <p className="text-xs mt-1 font-semibold max-w-xs leading-relaxed" style={{ color: theme.textMuted }}>{activeItem.leftDesc}</p>
          </div>

          {/* CENTER SCROLLABLE LIST */}
          <div className="lg:col-span-4 flex flex-col items-center gap-28 pt-4 pb-12">
            {workshopsData.map((item, index) => (
              <div
                key={item.id}
                ref={(el) => (itemRefs.current[index] = el)}
                data-index={index}
                onMouseEnter={() => updateActiveCard(item)}
                className="text-3xl md:text-5xl font-black text-center cursor-pointer transition-all duration-300"
                style={{
                  color: activeItem.id === item.id ? theme.primary : theme.textMuted,
                  opacity: activeItem.id === item.id ? 1 : 0.4,
                  transform: activeItem.id === item.id ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                {item.title}
              </div>
            ))}
          </div>

          {/* RIGHT STICKY CARD */}
          <div className="lg:col-span-4 sticky top-24 text-center z-10 flex flex-col items-center">
            <span 
              className="text-[11px] uppercase font-black tracking-wider px-3 py-1 rounded-full border mb-2 backdrop-blur-md shadow-sm"
              style={{ 
                color: theme.primary, 
                backgroundColor: theme.cardBg, 
                borderColor: theme.cardBorder 
              }}
            >
              ✦ Key Highlights
            </span>

            <img 
              src={activeItem.rightImg} 
              alt={activeItem.rightTitle} 
              style={{ opacity: imgOpacity, borderColor: theme.cardBorder }}
              className="w-full h-64 object-cover rounded-3xl transition-opacity duration-300 shadow-2xl border"
            />
            <h4 className="font-extrabold text-base mt-3" style={{ color: theme.textBright }}>{activeItem.rightTitle}</h4>
            <p className="text-xs mt-1 font-semibold max-w-xs leading-relaxed" style={{ color: theme.textMuted }}>{activeItem.rightDesc}</p>
          </div>

        </div>

      </div>
    </section>
  );
}