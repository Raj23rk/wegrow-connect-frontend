import React, { useState } from 'react';
import { theme } from '../theme';

const rewardsData = [
  {
    id: 'benefit1',
    name: "Skill Credit Engine",
    tag: "Automated Credit Collection",
    desc: "Every quiz cleared and assignment completed automatically converts into WeGrow Skill Credits.",
    badge: "🪙 Credits System",
    img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 'benefit2',
    name: "Dynamic Career Score",
    tag: "Real-time Skill Badge",
    desc: "Build a transparent, live credit score that proves your project consistency to top tech recruiters.",
    badge: "📈 Performance Analytics",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 'benefit3',
    name: "Exclusive Perks & Pass",
    tag: "Instant Reward Redemption",
    desc: "Redeem accrued credits for premium 1-on-1 mentor calls, paid tool access, and free event passes.",
    badge: "🎁 Premium Perks",
    img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 'benefit4',
    name: "Direct Hiring Referrals",
    tag: "Fast-Track Placement",
    desc: "High credit earners unlock verified referral badges that put resumes directly on hiring desk queues.",
    badge: "🤝 Referral Priority",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 'benefit5',
    name: "Verified Credential Hub",
    tag: "Blockchain Verification",
    desc: "Share tamper-proof digital certificates and skill badges directly on LinkedIn and tech portfolios.",
    badge: "🎓 Verified Credentials",
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"
  }
];

export default function RewardSection({ rewardTargetRef, rewardStyle }) {
  const [activeBenefit, setActiveBenefit] = useState(rewardsData[0]);
  const [hoveredId, setHoveredId] = useState(null);

  const activeColor = theme.orange || "#f3a812";

  // Hover Handler
  const handleMouseEnter = (benefit, id) => {
    setHoveredId(id);
    setActiveBenefit(benefit);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
  };

  return (
    <section 
      ref={rewardTargetRef} 
      id="rewards" 
      style={rewardStyle}
      className="relative pt-0 pb-20 transition-all duration-300 ease-out transform-gpu"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER SECTION */}
        <div id="reward-title" className="max-w-4xl mx-auto text-center space-y-3 pt-0 mb-14">
          <span className="text-xs uppercase font-black tracking-widest block" style={{ color: theme.orange }}>
            PERFORMANCE & RECOGNITION
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold drop-shadow-sm leading-tight" style={{ color: theme.primary }}>
            Earn While You Learn
          </h2>
          <p className="text-sm lg:text-base font-semibold leading-relaxed" style={{ color: theme.textMuted }}>
            Every workshop you attend, task you complete, and project you deliver adds up to your personal Skill Credit Score. Turn your dedication into tangible perks & career recognition!
          </p>
        </div>

        {/* MAIN INTERACTIVE HOVER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative">
          
          {/* LEFT SIDE: PARAGRAPHS */}
          <div className="lg:col-span-7 text-left space-y-8 text-sm md:text-base font-medium leading-relaxed" onMouseLeave={handleMouseLeave}>
            
            {/* PARAGRAPH 1 */}
            <p 
              onMouseEnter={() => handleMouseEnter(rewardsData[0], 'benefit1')}
              className="cursor-pointer transition-colors duration-300 select-none"
              style={{ 
                color: hoveredId === 'benefit1' ? activeColor : theme.textMain
              }}
            >
              As you navigate workshops, our platform automatically tracks your progress through an automated{' '}
              <span className="inline-flex items-center align-middle font-normal">
                <img 
                  src={rewardsData[0].img} 
                  alt="" 
                  className="w-5 h-5 object-cover rounded-full inline-block border shadow-sm align-middle mr-1.5" 
                  style={{ borderColor: theme.primary }}
                />
                Skill Credit Engine
              </span>{' '}
              that rewards every single quiz and project milestone you submit.
            </p>

            {/* PARAGRAPH 2 */}
            <p 
              onMouseEnter={() => handleMouseEnter(rewardsData[1], 'benefit2')}
              className="cursor-pointer transition-colors duration-300 select-none"
              style={{ 
                color: hoveredId === 'benefit2' ? activeColor : theme.textMain
              }}
            >
              Consistency is turned into proof. Every active learner builds a transparent{' '}
              <span className="inline-flex items-center align-middle font-normal">
                <img 
                  src={rewardsData[1].img} 
                  alt="" 
                  className="w-5 h-5 object-cover rounded-full inline-block border shadow-sm align-middle mr-1.5" 
                  style={{ borderColor: theme.primary }}
                />
                Dynamic Career Score
              </span>{' '}
              which acts as your verified badge of technical competency for partner companies.
            </p>

            {/* PARAGRAPH 3 */}
            <p 
              onMouseEnter={() => handleMouseEnter(rewardsData[2], 'benefit3')}
              className="cursor-pointer transition-colors duration-300 select-none"
              style={{ 
                color: hoveredId === 'benefit3' ? activeColor : theme.textMain
              }}
            >
              Accumulated credits aren't just numbers. You can directly redeem credits for{' '}
              <span className="inline-flex items-center align-middle font-normal">
                <img 
                  src={rewardsData[2].img} 
                  alt="" 
                  className="w-5 h-5 object-cover rounded-full inline-block border shadow-sm align-middle mr-1.5" 
                  style={{ borderColor: theme.primary }}
                />
                Exclusive Perks & Pass
              </span>{' '}
              including 1-on-1 industry mentor guidance, pro dev software, and VIP event tickets.
            </p>

            {/* PARAGRAPH 4 */}
            <p 
              onMouseEnter={() => handleMouseEnter(rewardsData[3], 'benefit4')}
              className="cursor-pointer transition-colors duration-300 select-none"
              style={{ 
                color: hoveredId === 'benefit4' ? activeColor : theme.textMain
              }}
            >
              High performers receive fast-track visibility through{' '}
              <span className="inline-flex items-center align-middle font-normal">
                <img 
                  src={rewardsData[3].img} 
                  alt="" 
                  className="w-5 h-5 object-cover rounded-full inline-block border shadow-sm align-middle mr-1.5" 
                  style={{ borderColor: theme.primary }}
                />
                Direct Hiring Referrals
              </span>{' '}
              giving your profile priority routing to top corporate recruitment desks.
            </p>

            {/* PARAGRAPH 5 */}
            <p 
              onMouseEnter={() => handleMouseEnter(rewardsData[4], 'benefit5')}
              className="cursor-pointer transition-colors duration-300 select-none"
              style={{ 
                color: hoveredId === 'benefit5' ? activeColor : theme.textMain
              }}
            >
              Share your achievements effortlessly with a full{' '}
              <span className="inline-flex items-center align-middle font-normal">
                <img 
                  src={rewardsData[4].img} 
                  alt="" 
                  className="w-5 h-5 object-cover rounded-full inline-block border shadow-sm align-middle mr-1.5" 
                  style={{ borderColor: theme.primary }}
                />
                Verified Credential Hub
              </span>{' '}
              designed to showcase shareable digital credentials on LinkedIn and personal portfolios.
            </p>

          </div>

          {/* RIGHT SIDE: ALWAYS VISIBLE CARD WITH TRUE CROSSFADE - sticky
              only at lg+ now. Same reasoning as WorkshopSection: on mobile
              this column collapses below the paragraphs (grid-cols-1), so
              an unqualified `sticky` would pin this card on screen while
              the paragraph list scrolled underneath it. */}
          <div className="lg:col-span-5 lg:sticky lg:top-16 flex flex-col items-center">
            {activeBenefit && (
              <div 
                className="w-full backdrop-blur-md rounded-3xl overflow-hidden border shadow-2xl p-4 transition-all duration-300"
                style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
              >
                {/* IMAGE WINDOW WITH TRUE CROSSFADE */}
                <div className="w-full h-72 overflow-hidden rounded-2xl relative bg-zinc-900">
                  {rewardsData.map((item) => (
                    <img 
                      key={item.id}
                      src={item.img} 
                      alt={item.name} 
                      className={`absolute inset-0 w-full h-full object-cover brightness-95 transition-opacity duration-700 ease-in-out ${
                        item.id === activeBenefit.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}

                  <span 
                    className="absolute top-3 right-3 text-xs font-black px-3 py-1 rounded-full backdrop-blur-md border shadow-md z-20" 
                    style={{ color: activeColor, backgroundColor: 'rgba(255,255,255,0.9)', borderColor: theme.cardBorder }}
                  >
                    {activeBenefit.badge}
                  </span>
                </div>

                {/* CARD DETAILS WITH SMOOTH FADE */}
                <div className="mt-4 text-left px-2 transition-opacity duration-500">
                  <span className="text-[11px] font-black uppercase tracking-wider block" style={{ color: activeColor }}>
                    ✦ {activeBenefit.tag}
                  </span>
                  <h4 className="font-extrabold text-xl mt-0.5" style={{ color: theme.primary }}>
                    {activeBenefit.name}
                  </h4>
                  <p className="text-xs font-medium mt-1 leading-relaxed" style={{ color: theme.textMuted }}>
                    {activeBenefit.desc}
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}