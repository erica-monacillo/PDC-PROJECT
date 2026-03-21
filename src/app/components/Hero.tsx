import React from 'react';
import { Phone, MapPin, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden bg-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBqYWxlYmklMjBzd2VldHMlMjBvcmFuZ2V8ZW58MXx8fHwxNzcyNTQ0MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Delicious Indian Sweets"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
        {/* Business Name */}
        <div className="mb-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-3 drop-shadow-2xl">
            Shri G S Sweets And Bakers
          </h1>
          <p className="text-3xl md:text-5xl text-gray-100 drop-shadow-lg">
            श्री जी स स्वीट्स एंड बेकर्स
          </p>
        </div>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-gray-100 mb-6 drop-shadow-lg">
          Authentic Taste of Jaipur
        </p>

        {/* Rating */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <a 
            href="#reviews"
            className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/30 transition-all cursor-pointer"
          >
            <div className="flex">
              {[1, 2, 3, 4].map((star) => (
                <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
              <Star className="w-5 h-5 fill-yellow-400/40 text-yellow-400" />
            </div>
            <span className="ml-2 text-white font-semibold">4.4</span>
            <span className="text-gray-100 text-sm ml-1">(63 reviews)</span>
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="tel:+91234567890"
            className="w-full sm:w-auto group bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5 group-hover:animate-pulse" />
            Call Now +91 23456 7890
          </a>
          
          <a
            href="https://www.google.com/maps/place/Shri+G+S+Sweets+And+Bakers/@26.9544576,75.7085848,739m/data=!3m2!1e3!4b1!4m6!3m5!1s0x396c4d0ba72bdc2b:0x59047e24fa42f679!8m2!3d26.9544576!4d75.7085848!16s%2Fg%2F11v18skqcg!17m2!4m1!1e3!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDMwNC4xIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-white hover:bg-gray-100 text-gray-900 border-2 border-white/30 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            Get Directions
          </a>
        </div>

        {/* Location Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-gray-100 text-sm">
          <MapPin className="w-4 h-4" />
          <span>G9, near D Mart, Jaipur, Rajasthan 302044</span>
        </div>
      </div>
    </section>
  );
}