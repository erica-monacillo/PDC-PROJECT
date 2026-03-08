import React from 'react';
import { Phone, MapPin, Clock, Navigation } from 'lucide-react';

export function Contact() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Visit Us Today
          </h2>
          <p className="text-gray-600 text-lg">
            Experience the authentic taste of Jaipur
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-gray-50 rounded-3xl p-8 md:p-10 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h3>

            {/* Contact Details */}
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-gray-900 rounded-xl">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Phone</h4>
                  <a 
                    href="tel:+919829004353" 
                    className="text-gray-900 text-lg hover:text-gray-700 transition-colors"
                  >
                    +91 98290 04353
                  </a>
                  <p className="text-gray-600 text-sm mt-1">Call anytime during business hours</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-gray-900 rounded-xl">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Address</h4>
                  <p className="text-gray-900 text-lg">G9, near D Mart</p>
                  <p className="text-gray-900">Jaipur, Rajasthan 302044, India</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-gray-900 rounded-xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Business Hours</h4>
                  <p className="text-gray-900 text-lg">Opens at 5:45 AM</p>
                  <p className="text-gray-600 text-sm mt-1">Fresh sweets made every morning</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <a
                href="tel:+919829004353"
                className="block w-full bg-gray-900 hover:bg-gray-800 text-white text-center px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all transform hover:scale-105"
              >
                Call Now for Fresh Sweets
              </a>
            </div>
          </div>

          {/* Map Card */}
          <div className="bg-gray-50 rounded-3xl p-8 md:p-10 border border-gray-200 flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Location
            </h3>

            {/* Map Placeholder */}
            <div className="flex-1 bg-gray-200 rounded-2xl overflow-hidden mb-6 min-h-[300px] relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-900 font-semibold text-lg">Shri G S Sweets And Bakers</p>
                  <p className="text-gray-700">Near D Mart, Jaipur</p>
                </div>
              </div>
            </div>

            {/* Get Directions Button */}
            <a
              href="https://www.google.com/maps/place/Shri+G+S+Sweets+And+Bakers/@26.9544576,75.7085848,739m/data=!3m2!1e3!4b1!4m6!3m5!1s0x396c4d0ba72bdc2b:0x59047e24fa42f679!8m2!3d26.9544576!4d75.7085848!16s%2Fg%2F11v18skqcg!17m2!4m1!1e3!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDMwNC4xIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all"
            >
              <Navigation className="w-5 h-5" />
              Get Directions
            </a>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Ready to Order?
          </h3>
          <p className="text-gray-600 mb-6">
            Call us now for dine-in, curbside pickup, or no-contact delivery
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:+919829004353"
              className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              +91 98290 04353
            </a>
            <a
              href="https://wa.me/919829004353"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}