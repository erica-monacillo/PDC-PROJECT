import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Star, Clock, ShoppingBag, Truck, UtensilsCrossed, ChevronRight, Menu as MenuIcon, X } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SocialProof } from './components/SocialProof';
import { ServiceCards } from './components/ServiceCards';
import { MenuHighlights } from './components/MenuHighlights';
import { Products } from './components/Products';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Orders } from './components/Orders';
import AdminDashboard from './components/AdminDashboard';
import { FloatingCallButton } from './components/FloatingCallButton';
import { MobileBottomBar } from './components/MobileBottomBar';
import { AuthProvider } from './components/AuthContext';
import { CartProvider } from './components/CartContext';
import { useAuth } from './components/AuthContext';

function AppContent() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'menu', 'products', 'reviews', 'orders', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show admin dashboard for admin users
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header activeSection={activeSection} />
      
      <main>
        <div id="overview">
              <Hero />
              <SocialProof />
              <ServiceCards />
            </div>
            
            <div id="menu">
              <MenuHighlights />
            </div>
            
            <div id="products">
              <Products />
            </div>
            
            <div id="reviews">
              {/* Reviews section is part of SocialProof */}
            </div>
            
            <div id="orders">
              <Orders />
            </div>
            
            <div id="about">
              <About />
            </div>
            
            <div id="contact">
              <Contact />
            </div>
          </main>

          <FloatingCallButton />
          <MobileBottomBar />

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-2xl mb-2 text-gray-900">Shri G S Sweets And Bakers</h3>
                  <p className="text-xl mb-4 text-gray-700">श्री जी स स्वीट्स एंड बेकर्स</p>
                  <p className="text-gray-600 text-sm">Authentic Taste of Jaipur</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-gray-900">Quick Links</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#overview" className="text-gray-600 hover:text-gray-900 transition-colors">Overview</a></li>
                    <li><a href="#menu" className="text-gray-600 hover:text-gray-900 transition-colors">Menu</a></li>
                    <li><a href="#products" className="text-gray-600 hover:text-gray-900 transition-colors">Products</a></li>
                    <li><a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a></li>
                    <li><a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-gray-900">Contact</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <a href="tel:+91234567890" className="hover:text-gray-900 transition-colors">+91 23456 7890</a>
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>G9, near D Mart, Jaipur, Rajasthan 302044, India</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Opens at 5:45 AM</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-600">
                <p>&copy; 2026 Shri G S Sweets And Bakers. All rights reserved.</p>
              </div>
            </div>
          </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}