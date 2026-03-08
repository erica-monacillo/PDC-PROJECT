import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const menuItems = [
  {
    id: 1,
    name: 'Emarti Jalebi',
    nameHindi: 'इमरती जलेबी',
    description: 'Crispy, sweet, and freshly made every morning',
    price: '₹60/kg',
    image: 'images/Gulab-Jamun-Recipe-Piping-Pot-Curry.jpg',
    popular: true
  },
  {
    id: 2,
    name: 'Bangali Mithai',
    nameHindi: 'बंगाली मिठाई',
    description: 'Authentic Bengali sweets, soft and delicious',
    price: '₹80/kg',
    image: 'https://images.unsplash.com/photo-1684813114206-867e17b5b697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtaXRoYWklMjBzd2VldHMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzI1NDQwNzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    popular: true
  },
  {
    id: 3,
    name: 'Kachori',
    nameHindi: 'कचोरी',
    description: 'Hot and spicy, perfect for breakfast',
    price: '₹40/plate',
    image: 'https://images.unsplash.com/photo-1551717256-7a2f62a2c781?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBrYWNob3JpJTIwc2Ftb3NhJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NzI1NDQwNzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    popular: false
  },
  {
    id: 4,
    name: 'Samosa',
    nameHindi: 'समोसा',
    description: 'Crispy golden triangles filled with spiced potatoes',
    price: '₹30/plate',
    image: 'https://images.unsplash.com/photo-1551717256-7a2f62a2c781?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBrYWNob3JpJTIwc2Ftb3NhJTIwc3RyZWV0JTIwZm9vZHxlbnwxfHx8fDE3NzI1NDQwNzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    popular: false
  },
  {
    id: 5,
    name: 'Namkeen Packets',
    nameHindi: 'नमकीन पैकेट',
    description: 'Fresh, crunchy savory snacks in convenient packets',
    price: '₹50/pack',
    image: 'https://images.unsplash.com/photo-1758910536889-43ce7b3199fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzd2VldHMlMjBzaG9wJTIwZGlzcGxheXxlbnwxfHx8fDE3NzI1MjAwMTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    popular: false
  },
];

export function MenuHighlights() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Our Signature Items
          </h2>
          <p className="text-gray-600 text-lg">
            Handcrafted with love and pure ingredients
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-gray-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                {item.popular && (
                  <div className="absolute top-4 right-4 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    Popular
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {item.nameHindi}
                </p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {item.price}
                  </span>
                  <button className="text-gray-600 hover:text-gray-900 font-semibold text-sm">
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Menu Button */}
        <div className="mt-12 text-center">
          <a
            href="tel:+919829004353"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105"
          >
            Call for Full Menu
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}