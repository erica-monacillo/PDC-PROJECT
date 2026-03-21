import React from 'react';
import { UtensilsCrossed, ShoppingBag, Truck, Package, Car, Flower2 } from 'lucide-react';

const services = [
  {
    id: 1,
    icon: UtensilsCrossed,
    title: 'Dine-In',
    description: 'Enjoy fresh sweets and snacks in our welcoming café environment',
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 2,
    icon: Package,
    title: 'Takeout',
    description: 'Quick takeout service for our delicious sweets and snacks',
    color: 'from-orange-400 to-red-500'
  },
  {
    id: 3,
    icon: Truck,
    title: 'Delivery',
    description: 'Fast and reliable delivery of fresh sweets to your location',
    color: 'from-red-400 to-pink-500'
  },
  {
    id: 4,
    icon: Truck,
    title: 'No-Contact Delivery',
    description: 'Safe and contactless delivery right to your doorstep',
    color: 'from-pink-400 to-rose-500'
  },
  {
    id: 5,
    icon: Car,
    title: 'Curbside Pickup',
    description: 'Convenient curbside pickup service for your favorite treats',
    color: 'from-blue-400 to-indigo-500'
  },
  {
    id: 6,
    icon: Flower2,
    title: 'Outdoor Seating',
    description: 'Relax and enjoy your meal in our comfortable outdoor seating area',
    color: 'from-green-400 to-emerald-500'
  },
];

export function ServiceCards() {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            How We Serve You
          </h2>
          <p className="text-gray-600 text-lg">
            Multiple convenient ways to enjoy our authentic sweets
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-gray-300 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.color} mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <a
            href="tel:+91234567890"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105"
          >
            Call to Order Now
          </a>
        </div>
      </div>
    </section>
  );
}