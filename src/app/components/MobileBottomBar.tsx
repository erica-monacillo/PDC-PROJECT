import React from 'react';
import { Phone, Navigation, MessageCircle } from 'lucide-react';

export function MobileBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t-2 border-amber-200 shadow-2xl">
      <div className="grid grid-cols-3 gap-1 p-2">
        {/* Call Button */}
        <a
          href="tel:+919672113819"
          className="flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-amber-500 to-orange-600 text-white py-3 rounded-xl transition-all active:scale-95"
        >
          <Phone className="w-5 h-5" />
          <span className="text-xs font-semibold">Call</span>
        </a>

        {/* Directions Button */}
        <a
          href="https://maps.app.goo.gl/VfNPqUEeqUsciQuj7"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-blue-500 to-blue-600 text-white py-3 rounded-xl transition-all active:scale-95"
        >
          <Navigation className="w-5 h-5" />
          <span className="text-xs font-semibold">Directions</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/919672113819"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-green-500 to-green-600 text-white py-3 rounded-xl transition-all active:scale-95"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-xs font-semibold">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}