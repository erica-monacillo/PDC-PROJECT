import React from 'react';
import { Phone, MapPin, Clock, Navigation } from 'lucide-react';

export function Contact() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-amber-900 to-red-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Visit Us Today
          </h2>
          <p className="text-amber-100 text-lg">
            Experience the authentic taste of Jaipur
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-10 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">
              Get in Touch
            </h3>

            {/* Contact Details */}
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-100 mb-1">Phone</h4>
                  <a 
                    href="tel:+919829004353" 
                    className="text-white text-lg hover:text-amber-200 transition-colors"
                  >
                    +91 98290 04353
                  </a>
                  <p className="text-amber-200 text-sm mt-1">Call anytime during business hours</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-100 mb-1">Address</h4>
                  <p className="text-white text-lg">G9, near D Mart</p>
                  <p className="text-white">Jaipur, Rajasthan 302044, India</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-100 mb-1">Business Hours</h4>
                  <p className="text-white text-lg">Opens at 5:45 AM</p>
                  <p className="text-amber-200 text-sm mt-1">Fresh sweets made every morning</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <a
                href="tel:+919829004353"
                className="block w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-center px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl transition-all transform hover:scale-105"
              >
                Call Now for Fresh Sweets
              </a>
            </div>
          </div>

          {/* Map Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-10 border border-white/20 flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-6">
              Location
            </h3>

            {/* Map Placeholder */}
            <div className="flex-1 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl overflow-hidden mb-6 min-h-[300px] relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                  <p className="text-amber-900 font-semibold text-lg">Shri G S Sweets And Bakers</p>
                  <p className="text-amber-700">Near D Mart, Jaipur</p>
                </div>
              </div>
            </div>

            {/* Get Directions Button */}
            <a
              href="https://www.google.com/maps/place/Shri+G+S+Sweets+And+Bakers/@26.9544576,75.7085848,739m/data=!3m2!1e3!4b1!4m6!3m5!1s0x396c4d0ba72bdc2b:0x59047e24fa42f679!8m2!3d26.9544576!4d75.7085848!16s%2Fg%2F11v18skqcg!17m2!4m1!1e3!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDMwNC4xIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-white hover:bg-amber-50 text-amber-900 px-8 py-4 rounded-xl font-semibold shadow-lg transition-all"
            >
              <Navigation className="w-5 h-5" />
              Get Directions
            </a>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-3">
            Ready to Order?
          </h3>
          <p className="text-amber-100 mb-6">
            Call us now for dine-in, curbside pickup, or no-contact delivery
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+919829004353"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              +91 98290 04353
            </a>
            <a
              href="https://wa.me/919829004353"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold shadow-xl transition-all transform hover:scale-105"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}