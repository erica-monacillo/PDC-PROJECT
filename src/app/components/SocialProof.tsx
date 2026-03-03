import React from 'react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    rating: 5,
    text: 'Best sweets in Jhotwara! Fresh jalebi every morning. The quality and taste is unmatched.',
    highlight: 'Quality & Taste'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    rating: 5,
    text: 'Amazing Bengali mithai and very affordable prices. My family loves their kachori for breakfast.',
    highlight: 'Affordable Prices'
  },
  {
    id: 3,
    name: 'Anil Verma',
    rating: 4,
    text: 'Pure ingredients and fresh preparation. Been coming here for years, never disappointed.',
    highlight: 'Pure & Fresh'
  },
  {
    id: 4,
    name: 'Deendayal P',
    rating: 5,
    text: 'The sweets are very good and pure. Once you get the chance, eat the sweets here, it is very tasty.',
    highlight: 'Sweet & Tasty'
  },
  {
    id: 5,
    name: 'Jagat Shekhawat',
    rating: 5,
    text: 'Quality of sweets and other material, love to eat kachori here.',
    highlight: 'So sweet'
  },

];

export function SocialProof() {
  return (
    <section id="reviews" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-3">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 text-lg">
            Trusted by families across Jaipur
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-amber-100"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-10 h-10 text-amber-400 fill-amber-400" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-5 h-5 ${
                      index < review.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                "{review.text}"
              </p>

              {/* Highlight Badge */}
              <div className="inline-block bg-amber-200 text-amber-900 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                {review.highlight}
              </div>

              {/* Reviewer Name */}
              <p className="font-semibold text-amber-900">
                — {review.name}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
            <div className="text-3xl font-bold text-amber-900 mb-1">4.4★</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
            <div className="text-3xl font-bold text-amber-900 mb-1">63+</div>
            <div className="text-sm text-gray-600">Happy Reviews</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
            <div className="text-3xl font-bold text-amber-900 mb-1">100%</div>
            <div className="text-sm text-gray-600">Pure Ingredients</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
            <div className="text-3xl font-bold text-amber-900 mb-1">5:45</div>
            <div className="text-sm text-gray-600">AM Opening</div>
          </div>
        </div>
      </div>
    </section>
  );
}