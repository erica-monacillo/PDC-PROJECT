import React from 'react';
import { Phone, Navigation, MessageCircle } from 'lucide-react';

export function MobileBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t-2 border-gray-200 shadow-2xl">
      <div className="grid grid-cols-3 gap-1 p-2">
        {/* Call Button */}
        <a
          href="tel:+91234567890"
          className="flex flex-col items-center justify-center gap-1 bg-gray-900 text-white py-3 rounded-xl transition-all active:scale-95"
        >
          <Phone className="w-5 h-5" />
          <span className="text-xs font-semibold">Call</span>
        </a>

        {/* Directions Button */}
        <a
          href="https://www.google.com/maps/place/Shri+G+S+Sweets+And+Bakers/@26.9544576,75.7085848,739m/data=!3m2!1e3!4b1!4m6!3m5!1s0x396c4d0ba72bdc2b:0x59047e24fa42f679!8m2!3d26.9544576!4d75.7085848!16s%2Fg%2F11v18skqcg!17m2!4m1!1e3!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDMwNC4xIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 bg-blue-600 text-white py-3 rounded-xl transition-all active:scale-95"
        >
          <Navigation className="w-5 h-5" />
          <span className="text-xs font-semibold">Directions</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/91234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 bg-green-600 text-white py-3 rounded-xl transition-all active:scale-95"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-xs font-semibold">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}