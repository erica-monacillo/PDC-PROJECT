import React from 'react';
import { Award, Heart, Leaf, Users, Coffee, Utensils, Flower2, CreditCard, ParkingCircle, Baby, Wifi, UtensilsCrossed } from 'lucide-react';
import { ImageWithFallback } from './image/ImageWithFallback';

const features = [
  {
    icon: Leaf,
    title: 'Fully Vegetarian',
    description: 'Complete vegetarian menu with vegan options available'
  },
  {
    icon: Heart,
    title: 'Family Friendly',
    description: 'Great for kids with a casual, cozy atmosphere'
  },
  {
    icon: Award,
    title: 'Great Desserts',
    description: 'Renowned for authentic Indian sweets and desserts'
  },
  {
    icon: Coffee,
    title: 'Breakfast Favorite',
    description: 'Popular for breakfast, brunch, and quick bites'
  }
];

const amenities = [
  { label: 'Free Street Parking', icon: ParkingCircle },
  { label: 'Card & NFC Payments', icon: CreditCard },
  { label: 'Good for Kids', icon: Baby }
];

export function About() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758910536889-43ce7b3199fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzd2VldHMlMjBzaG9wJTIwZGlzcGxheXxlbnwxfHx8fDE3NzI1MjAwMTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="G.S Sweets Shop"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-amber-400 to-orange-600 rounded-3xl -z-10 opacity-20"></div>
          </div>

          {/* Content Side */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-6">
              Your Trusted Sweet Destination in Jaipur
            </h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Welcome to <span className="font-semibold text-amber-900">G.S Sweets (जी.स स्वीट्स)</span>, 
              a cherished local sweet shop in the heart of Jhotwara, Jaipur. We take pride in serving 
              authentic Indian sweets and savories made with pure ingredients and traditional recipes.
            </p>
            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              Every morning at 5:45 AM, our kitchen comes alive to prepare fresh jalebis, Bengali mithai, 
              kachori, and more. Our commitment to quality, taste, and affordability has made us a 
              beloved destination for families across Rajasthan.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Amenities */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-amber-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((amenity, index) => {
                  const Icon = amenity.icon;
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-amber-900" />
                      <span className="text-gray-700 text-sm">{amenity.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}