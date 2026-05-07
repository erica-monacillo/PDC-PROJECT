import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, User, ShoppingCart, LogOut, ClipboardList } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { AuthModal } from './AuthModal';
import { Cart } from './Cart';
import { Orders } from './Orders';

interface HeaderProps {
  activeSection: string;
}

export function Header({ activeSection }: HeaderProps) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'menu', label: 'Menu' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Josefin+Sans:wght@200;300;400&display=swap');

        /* ── Header shell ── */
        .lux-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
          transition: all 0.5s cubic-bezier(0.4,0,0.2,1);
        }

        /* Floating pill wrapper that appears on scroll */
        .lux-bar {
          margin: 0 auto;
          max-width: 1100px;
          transition: all 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .lux-header.scrolled .lux-bar {
          margin: 12px auto;
          padding: 0 16px;
        }

        /* Inner glass container */
        .lux-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          padding: 0 28px;
          transition: all 0.5s cubic-bezier(0.4,0,0.2,1);
          border-radius: 0;
          background: transparent;
          border: none;
        }
        .lux-header.scrolled .lux-inner {
          height: 60px;
          padding: 0 24px;
          border-radius: 20px;
          background: rgba(6, 5, 10, 0.65);
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow:
            0 0 0 0.5px rgba(255,255,255,0.04) inset,
            0 24px 64px rgba(0,0,0,0.5),
            0 1px 0 rgba(255,255,255,0.06) inset;
        }

        /* Shimmer top line on scrolled */
        .lux-shimmer {
          position: absolute;
          top: 0; left: 20%; right: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent);
          opacity: 0;
          border-radius: 999px;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }
        .lux-header.scrolled .lux-shimmer { opacity: 1; }

        /* ── Logo ── */
        .lux-logo-btn {
          background: none; border: none; cursor: pointer;
          text-align: left; padding: 0; line-height: 1;
        }
        .lux-logo-main {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.25rem;
          font-weight: 400;
          letter-spacing: 0.03em;
          color: #faf8f4;
          display: block;
          transition: color 0.3s;
          text-shadow: 0 2px 12px rgba(0,0,0,0.4);
        }
        .lux-logo-sub {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          font-weight: 200;
          letter-spacing: 0.25em;
          color: rgba(245,158,11,0.65);
          display: block;
          margin-top: 3px;
        }

        /* ── Desktop nav ── */
        .lux-nav {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        @media (max-width: 768px) { .lux-nav { display: none; } }

        .lux-nav-btn {
          position: relative;
          background: none; border: none; cursor: pointer;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          padding: 8px 14px;
          border-radius: 10px;
          transition: all 0.3s ease;
        }
        .lux-nav-btn:hover {
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.05);
        }
        .lux-nav-btn.active {
          color: rgba(245,158,11,0.9);
          background: rgba(245,158,11,0.08);
          border: 1px solid rgba(245,158,11,0.15);
        }
        /* Active dot indicator */
        .lux-nav-btn.active::after {
          content: '';
          position: absolute;
          bottom: 4px; left: 50%;
          transform: translateX(-50%);
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(245,158,11,0.7);
        }

        /* ── Right actions ── */
        .lux-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .lux-icon-btn {
          position: relative;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: rgba(255,255,255,0.7);
          transition: all 0.3s ease;
        }
        .lux-icon-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.14);
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }

        .lux-cart-badge {
          position: absolute;
          top: -5px; right: -5px;
          background: rgba(245,158,11,0.9);
          color: #06050a;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px;
          font-weight: 400;
          width: 18px; height: 18px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(6,5,10,0.5);
        }

        /* Sign In button */
        .lux-signin-btn {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          padding: 9px 20px;
          border-radius: 100px;
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.3);
          color: rgba(245,158,11,0.9);
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .lux-signin-btn:hover {
          background: rgba(245,158,11,0.18);
          border-color: rgba(245,158,11,0.55);
          box-shadow: 0 0 24px rgba(245,158,11,0.18);
          color: rgba(245,158,11,1);
        }

        /* User button */
        .lux-user-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 100px;
          padding: 6px 14px 6px 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: rgba(255,255,255,0.8);
        }
        .lux-user-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.14);
        }
        .lux-user-avatar {
          width: 26px; height: 26px;
          border-radius: 50%;
          background: rgba(245,158,11,0.15);
          border: 1px solid rgba(245,158,11,0.3);
          display: flex; align-items: center; justify-content: center;
          color: rgba(245,158,11,0.9);
        }
        .lux-user-name {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.75);
        }
        .lux-admin-badge {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 8px;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.3);
          color: rgba(239,68,68,0.9);
          padding: 2px 7px;
          border-radius: 100px;
        }

        /* Dropdown */
        .lux-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 220px;
          background: rgba(10, 8, 16, 0.85);
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.06) inset;
          animation: dropIn 0.2s ease;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .lux-dropdown-header {
          padding: 16px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .lux-dd-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          font-weight: 400;
          color: #faf8f4;
        }
        .lux-dd-email {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px;
          font-weight: 200;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.35);
          margin-top: 2px;
        }
        .lux-dd-role {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px;
          font-weight: 300;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(245,158,11,0.6);
          margin-top: 4px;
        }
        .lux-dd-btn {
          width: 100%;
          display: flex; align-items: center; gap: 10px;
          padding: 12px 18px;
          background: none; border: none;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.25s ease;
          text-align: left;
        }
        .lux-dd-btn:hover {
          color: rgba(239,68,68,0.85);
          background: rgba(239,68,68,0.06);
        }

        /* Mobile menu button */
        .lux-mobile-btn {
          display: none;
        }
        @media (max-width: 768px) {
          .lux-mobile-btn { display: flex; }
        }

        /* Mobile menu panel */
        .lux-mobile-panel {
          margin: 0 16px 12px;
          background: rgba(6, 5, 10, 0.88);
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.5);
          animation: slideDown 0.25s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .lux-mobile-nav-btn {
          width: 100%; display: flex; align-items: center;
          gap: 12px; padding: 14px 24px;
          background: none; border: none;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px; font-weight: 300;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          cursor: pointer; transition: all 0.25s ease;
          text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .lux-mobile-nav-btn:hover,
        .lux-mobile-nav-btn.active {
          color: rgba(245,158,11,0.9);
          background: rgba(245,158,11,0.05);
        }
        .lux-mobile-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: currentColor; opacity: 0.5; flex-shrink: 0;
        }
        .lux-mobile-auth {
          padding: 16px 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .lux-mobile-user-info {
          margin-bottom: 12px;
        }
        .lux-mobile-uname {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem; color: #faf8f4;
        }
        .lux-mobile-uemail {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px; font-weight: 200;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.3);
        }
        .lux-mobile-signout {
          width: 100%; padding: 12px;
          border-radius: 12px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          color: rgba(239,68,68,0.8);
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px; font-weight: 300;
          letter-spacing: 0.3em; text-transform: uppercase;
          cursor: pointer; transition: all 0.25s ease;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .lux-mobile-signout:hover {
          background: rgba(239,68,68,0.14);
          border-color: rgba(239,68,68,0.4);
        }
        .lux-mobile-signin {
          width: 100%; padding: 13px;
          border-radius: 12px;
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.25);
          color: rgba(245,158,11,0.9);
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px; font-weight: 300;
          letter-spacing: 0.35em; text-transform: uppercase;
          cursor: pointer; transition: all 0.25s ease;
        }
        .lux-mobile-signin:hover {
          background: rgba(245,158,11,0.16);
          border-color: rgba(245,158,11,0.5);
        }
      `}</style>

      <header className={`lux-header${isScrolled ? ' scrolled' : ''}`}>
        <div className="lux-bar" style={{ position: 'relative', padding: isScrolled ? '0 8px' : '0 16px' }}>
          <div className="lux-inner" style={{ position: 'relative' }}>
            <div className="lux-shimmer" />

            {/* Logo */}
            <button className="lux-logo-btn" onClick={() => scrollToSection('overview')}>
              <span className="lux-logo-main">Shri G S Sweets & Bakers</span>
              <span className="lux-logo-sub">श्री जी स स्वीट्स एंड बेकर्स</span>
            </button>

            {/* Desktop nav */}
            <nav className="lux-nav">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`lux-nav-btn${activeSection === item.id ? ' active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right actions */}
            <div className="lux-actions">
              {/* Cart */}
              <button className="lux-icon-btn" onClick={() => setIsCartOpen(true)} aria-label="Cart">
                <ShoppingCart size={18} />
                {itemCount > 0 && <span className="lux-cart-badge">{itemCount}</span>}
              </button>

              {/* Orders */}
              <button
                className="lux-icon-btn"
                onClick={() => setIsOrdersOpen(true)}
                aria-label="Orders"
                title="My Orders"
              >
                <ClipboardList size={18} />
              </button>

              {/* Auth */}
              {isAuthenticated ? (
                <div ref={userMenuRef} style={{ position: 'relative' }}>
                  <button className="lux-user-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
                    <div className="lux-user-avatar"><User size={13} /></div>
                    <span className="lux-user-name">{user?.name}</span>
                    {isAdmin && <span className="lux-admin-badge">Admin</span>}
                  </button>

                  {showUserMenu && (
                    <div className="lux-dropdown">
                      <div className="lux-dropdown-header">
                        <div className="lux-dd-name">{user?.name}</div>
                        <div className="lux-dd-email">{user?.email}</div>
                        <div className="lux-dd-role">{user?.role}</div>
                      </div>
                      <button
                        className="lux-dd-btn"
                        onClick={() => { logout(); setShowUserMenu(false); }}
                      >
                        <LogOut size={13} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button className="lux-signin-btn" onClick={() => setIsAuthModalOpen(true)}>
                  Sign In
                </button>
              )}

              {/* Mobile toggle */}
              <button
                className="lux-icon-btn lux-mobile-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="lux-mobile-panel">
              <nav>
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    className={`lux-mobile-nav-btn${activeSection === item.id ? ' active' : ''}`}
                    onClick={() => scrollToSection(item.id)}
                  >
                    <span className="lux-mobile-dot" />
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="lux-mobile-auth">
                {isAuthenticated ? (
                  <>
                    <div className="lux-mobile-user-info">
                      <div className="lux-mobile-uname">{user?.name}</div>
                      <div className="lux-mobile-uemail">{user?.email}</div>
                    </div>
                    <button
                      className="lux-mobile-signout"
                      onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    >
                      <LogOut size={13} /> Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    className="lux-mobile-signin"
                    onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Orders isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} />
    </>
  );
}