import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function FloatingWhatsApp() {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // Hide on Sing Along and Sponsor pages
  const isHidden =
    location.pathname.includes('sing-along') ||
    location.pathname.includes('singalong') ||
    location.pathname.includes('sponsors');

  if (isHidden) return null;
  const phoneNumber = '919363337331';
  const defaultMessage = encodeURIComponent(
    'Hi WeGrow Team! I would like to know more about WeGrow Skill Campus and B-School programs.'
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center group">
      {/* Tooltip Popup on Hover */}
      <div
        className={`absolute left-16 px-3 py-1.5 rounded-xl bg-[#061325] text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-white/10 pointer-events-none transition-all duration-300 ${
          isHovered
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-2'
        }`}
      >
        <span>Chat with us on WhatsApp</span>
        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#061325] rotate-45 border-l border-b border-white/10" />
      </div>

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
        aria-label="Chat on WhatsApp with WeGrow Skill Campus & B-School"
      >
        {/* Pulsing Ripple Effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 pointer-events-none" />

        {/* WhatsApp Icon */}
        <svg
          className="w-7 h-7 fill-current relative z-10"
          viewBox="0 0 24 24"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.541 1.961.82 2.796.82 3.183 0 5.769-2.587 5.769-5.767 0-3.182-2.586-5.768-5.769-5.768zm0 10.455c-.785 0-1.636-.239-2.339-.65l-.167-.099-1.58.414.421-1.54-.109-.174c-.456-.726-.7-1.503-.699-2.574 0-2.474 2.012-4.487 4.474-4.487 2.473 0 4.485 2.013 4.485 4.487 0 2.474-2.012 4.487-4.485 4.487zm2.607-3.364c-.143-.071-.845-.417-.976-.465-.131-.048-.226-.071-.321.071-.095.143-.369.465-.452.56-.083.095-.167.107-.31.036-.143-.071-.603-.222-1.149-.708-.424-.378-.711-.846-.795-.989-.083-.143-.009-.22.063-.291.064-.064.143-.167.214-.25.071-.083.095-.143.143-.238.048-.095.024-.179-.012-.25-.036-.071-.321-.774-.44-1.06-.116-.279-.234-.241-.321-.246l-.274-.005c-.095 0-.25.036-.381.179-.131.143-.5 489-.5 1.192 0 .703.512 1.383.584 1.479.071.095 1.008 1.539 2.441 2.158.341.147.607.235.815.301.342.109.654.093.901.056.276-.041.845-.345.965-.679.119-.333.119-.619.083-.679-.035-.06-.131-.095-.274-.167z" />
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.761.459 3.479 1.332 4.992L2 22l5.161-1.353a9.932 9.932 0 004.851 1.258h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.667-1.038-5.174-2.925-7.062A9.924 9.924 0 0012.012 2zm0 18.277h-.003a8.27 8.27 0 01-4.218-1.155l-.302-.18-3.136.822.837-3.056-.197-.314a8.27 8.27 0 01-1.267-4.414c0-4.57 3.719-8.288 8.289-8.288 2.214 0 4.296.863 5.862 2.43 1.566 1.567 2.428 3.65 2.427 5.865 0 4.57-3.718 8.29-8.29 8.29z" />
        </svg>

        {/* Mini Online Status Dot */}
        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-xs">
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>
        </span>
      </a>
    </div>
  );
}
