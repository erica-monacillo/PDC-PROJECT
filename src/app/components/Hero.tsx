import React from 'react';
import { Phone, MapPin, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1760263216784-a4ca9a841ff5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBqYWxlYmklMjBzd2VldHMlMjBvcmFuZ2V8ZW58MXx8fHwxNzcyNTQ0MDc4fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Delicious Indian Sweets"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-amber-900/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
        {/* Business Name */}
        <div className="mb-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-3 drop-shadow-2xl">
            G.S Sweets
          </h1>
          <p className="text-3xl md:text-5xl text-amber-100 drop-shadow-lg">
            जी.स स्वीट्स
          </p>
        </div>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-amber-100 mb-6 drop-shadow-lg">
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
                <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
              <Star className="w-5 h-5 fill-amber-400/40 text-amber-400" />
            </div>
            <span className="ml-2 text-white font-semibold">4.4</span>
            <span className="text-amber-100 text-sm ml-1">(63 reviews)</span>
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="tel:+919672113819"
            className="w-full sm:w-auto group bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5 group-hover:animate-pulse" />
            Call Now +91 96721 13819
          </a>
          
          <a
            href="https://maps.app.goo.gl/VfNPqUEeqUsciQuj7"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-2 border-white/30 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            Get Directions
          </a>
        </div>

        {/* Location Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-amber-100 text-sm">
          <MapPin className="w-4 h-4" />
          <span>WPPX+94C, 115, Kirni Phatak, Gokulpura, Jhotwara, Jaipur</span>
        </div>
      </div>
    </section>
  );
}