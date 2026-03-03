import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Star, Clock, ShoppingBag, Truck, UtensilsCrossed, ChevronRight, Menu as MenuIcon, X } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SocialProof } from './components/SocialProof';
import { ServiceCards } from './components/ServiceCards';
import { MenuHighlights } from './components/MenuHighlights';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { FloatingCallButton } from './components/FloatingCallButton';
import { MobileBottomBar } from './components/MobileBottomBar';

export default function App() {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'menu', 'reviews', 'about', 'contact'];
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

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
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
        
        <div id="reviews">
          {/* Reviews section is part of SocialProof */}
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
      <footer className="bg-gradient-to-br from-amber-900 to-red-900 text-amber-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl mb-2">G.S Sweets</h3>
              <p className="text-xl mb-4">जी.स स्वीट्स</p>
              <p className="text-amber-200 text-sm">Authentic Taste of Jaipur</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#overview" className="text-amber-200 hover:text-white transition-colors">Overview</a></li>
                <li><a href="#menu" className="text-amber-200 hover:text-white transition-colors">Menu</a></li>
                <li><a href="#about" className="text-amber-200 hover:text-white transition-colors">About</a></li>
                <li><a href="#contact" className="text-amber-200 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <div className="space-y-2 text-sm text-amber-200">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+919672113819" className="hover:text-white transition-colors">+91 96721 13819</a>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>WPPX+94C, 115, Kirni Phatak, Gokulpura, तारा नगर मार्ग, Jhotwara, Jaipur, Rajasthan 302012, India</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Opens at 5:45 AM</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-amber-800 mt-8 pt-6 text-center text-sm text-amber-200">
            <p>&copy; 2026 G.S Sweets. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}