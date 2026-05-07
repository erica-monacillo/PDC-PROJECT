import React, { useEffect, useRef } from 'react';
import { UtensilsCrossed, Truck, Package, Car, Flower2 } from 'lucide-react';

const services = [
  {
    id: 1,
    icon: UtensilsCrossed,
    title: 'Dine-In',
    description: 'Enjoy freshly baked pastries in a warm, elegant café ambiance curated for the discerning palate.',
    accent: '#f59e0b',
    glow: 'rgba(245,158,11,0.35)',
    orb: 'radial-gradient(circle, rgba(251,191,36,0.5) 0%, rgba(245,158,11,0.15) 60%, transparent 100%)',
    label: '01',
  },
  {
    id: 2,
    icon: Package,
    title: 'Takeout',
    description: 'Curated favorites, exquisitely packaged — artisan freshness preserved for every journey.',
    accent: '#f97316',
    glow: 'rgba(249,115,22,0.35)',
    orb: 'radial-gradient(circle, rgba(251,146,60,0.5) 0%, rgba(249,115,22,0.15) 60%, transparent 100%)',
    label: '02',
  },
  {
    id: 3,
    icon: Truck,
    title: 'Delivery',
    description: 'White-glove doorstep delivery — our promise of quality arrives with every order.',
    accent: '#ec4899',
    glow: 'rgba(236,72,153,0.35)',
    orb: 'radial-gradient(circle, rgba(244,114,182,0.5) 0%, rgba(236,72,153,0.15) 60%, transparent 100%)',
    label: '03',
  },
  {
    id: 4,
    icon: Truck,
    title: 'No-Contact Delivery',
    description: 'Seamless, safe, and refined — the epitome of thoughtful modern luxury service.',
    accent: '#a855f7',
    glow: 'rgba(168,85,247,0.35)',
    orb: 'radial-gradient(circle, rgba(192,132,252,0.5) 0%, rgba(168,85,247,0.15) 60%, transparent 100%)',
    label: '04',
  },
  {
    id: 5,
    icon: Car,
    title: 'Curbside Pickup',
    description: 'We come to you — effortless convenience designed around your lifestyle.',
    accent: '#06b6d4',
    glow: 'rgba(6,182,212,0.35)',
    orb: 'radial-gradient(circle, rgba(34,211,238,0.5) 0%, rgba(6,182,212,0.15) 60%, transparent 100%)',
    label: '05',
  },
  {
    id: 6,
    icon: Flower2,
    title: 'Outdoor Seating',
    description: 'Bask in curated al fresco luxury — soft lighting, open skies, and artisanal moments.',
    accent: '#10b981',
    glow: 'rgba(16,185,129,0.35)',
    orb: 'radial-gradient(circle, rgba(52,211,153,0.5) 0%, rgba(16,185,129,0.15) 60%, transparent 100%)',
    label: '06',
  },
];

function ServiceCard({ service, index }) {
  const Icon = service.icon;
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -8;
      const rotateY = ((x - cx) / cx) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      const glowX = (x / rect.width) * 100;
      const glowY = (y / rect.height) * 100;
      card.style.setProperty('--glow-x', `${glowX}%`);
      card.style.setProperty('--glow-y', `${glowY}%`);
      card.style.setProperty('--glow-opacity', '1');
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.setProperty('--glow-opacity', '0');
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="service-card"
      style={{
        '--accent': service.accent,
        '--glow': service.glow,
        '--orb': service.orb,
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Cursor-following glow */}
      <div className="card-cursor-glow" />

      {/* Top shimmer line */}
      <div className="card-shimmer-line" style={{ background: `linear-gradient(90deg, transparent, ${service.accent}, transparent)` }} />

      {/* Orb background */}
      <div className="card-orb" />

      {/* Card number */}
      <span className="card-number">{service.label}</span>

      {/* Icon */}
      <div className="icon-wrapper">
        <div className="icon-bg" style={{ background: service.orb }} />
        <Icon size={22} style={{ color: service.accent, position: 'relative', zIndex: 1 }} />
      </div>

      {/* Content */}
      <h3 className="card-title">{service.title}</h3>
      <p className="card-desc">{service.description}</p>

      {/* Bottom accent */}
      <div className="card-bottom-line" style={{ background: `linear-gradient(90deg, transparent, ${service.accent}60, transparent)` }} />
    </div>
  );
}

export function ServiceCards() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Josefin+Sans:wght@200;300;400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

        .luxury-section {
          position: relative;
          padding: 120px 24px;
          background: rgba(251,191,36,0.08);
          backdrop-filter: blur(40px) saturate(160%);
          -webkit-backdrop-filter: blur(40px) saturate(160%);
          overflow: hidden;
          font-family: 'Josefin Sans', sans-serif;
          min-height: 100vh;
        }

        /* Ambient background blobs */
        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }
        .bg-blob-1 {
          width: 700px; height: 700px;
          top: -200px; left: -200px;
          background: radial-gradient(circle, rgba(251,191,36,0.35) 0%, transparent 70%);
        }
        .bg-blob-2 {
          width: 600px; height: 600px;
          bottom: -150px; right: -150px;
          background: radial-gradient(circle, rgba(245,130,11,0.28) 0%, transparent 70%);
        }
        .bg-blob-3 {
          width: 500px; height: 500px;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(253,211,77,0.2) 0%, transparent 70%);
        }

        /* Noise texture overlay */
        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 128px;
          pointer-events: none;
        }

        /* Section header */
        .section-eyebrow {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(146,64,14,0.75);
          text-align: center;
          margin-bottom: 20px;
        }
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.8rem, 6vw, 5rem);
          font-weight: 300;
          letter-spacing: -0.01em;
          color: #3b2005;
          text-align: center;
          line-height: 1.1;
          margin-bottom: 16px;
        }
        .section-title em {
          font-style: italic;
          color: rgba(180,83,9,0.9);
        }
        .section-subtitle {
          font-family: 'Lora', serif;
          font-size: 13px;
          font-weight: 400;
          font-style: italic;
          letter-spacing: 0.02em;
          color: rgba(59,32,5,0.52);
          text-align: center;
          max-width: 400px;
          margin: 0 auto 80px;
          line-height: 1.8;
        }

        /* Thin gold divider */
        .divider {
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(245,158,11,0.6), transparent);
          margin: 20px auto;
        }

        /* Cards grid */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1100px;
          margin: 0 auto;
        }
        @media (max-width: 900px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px) { .cards-grid { grid-template-columns: 1fr; } }

        /* Card */
        .service-card {
          position: relative;
          padding: 36px 30px 32px;
          border-radius: 24px;
          background: rgba(255,237,180,0.35);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(251,191,36,0.25);
          box-shadow:
            0 0 0 0.5px rgba(255,255,255,0.3) inset,
            0 20px 60px rgba(146,64,14,0.12),
            0 1px 0 rgba(255,255,255,0.4) inset;
          cursor: default;
          transition: transform 0.3s ease, box-shadow 0.4s ease;
          overflow: hidden;
          --glow-x: 50%;
          --glow-y: 50%;
          --glow-opacity: 0;
          animation: cardReveal 0.7s ease both;
        }
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card-cursor-glow {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          opacity: var(--glow-opacity);
          background: radial-gradient(circle at var(--glow-x) var(--glow-y), var(--glow) 0%, transparent 60%);
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .card-shimmer-line {
          position: absolute;
          top: 0; left: 20%; right: 20%;
          height: 1px;
          opacity: 0.5;
        }

        .card-orb {
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          background: var(--orb);
          border-radius: 50%;
          filter: blur(30px);
          pointer-events: none;
          opacity: 0.4;
        }

        .card-number {
          position: absolute;
          top: 24px; right: 28px;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.3em;
          color: rgba(146,64,14,0.2);
          font-family: 'Josefin Sans', sans-serif;
        }

        .icon-wrapper {
          position: relative;
          width: 52px; height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: rgba(255,255,255,0.35);
          border: 1px solid rgba(251,191,36,0.3);
          margin-bottom: 28px;
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        .service-card:hover .icon-wrapper {
          transform: scale(1.08);
        }
        .icon-bg {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          opacity: 0.5;
        }

        .card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.55rem;
          font-weight: 400;
          letter-spacing: 0.01em;
          color: #3b2005;
          margin: 0 0 12px;
          line-height: 1.2;
        }

        .card-desc {
          font-family: 'Lora', serif;
          font-size: 12.5px;
          font-weight: 400;
          letter-spacing: 0.02em;
          color: rgba(59,32,5,0.68);
          line-height: 1.8;
          margin: 0 0 28px;
        }

        .card-bottom-line {
          height: 1px;
          width: 0%;
          transition: width 0.5s ease;
        }
        .service-card:hover .card-bottom-line {
          width: 100%;
        }

        /* CTA */
        .cta-wrapper {
          text-align: center;
          margin-top: 80px;
        }
        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 44px;
          border-radius: 100px;
          background: rgba(180,83,9,0.1);
          border: 1px solid rgba(180,83,9,0.3);
          color: rgba(146,64,14,0.95);
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          text-decoration: none;
          backdrop-filter: blur(12px);
          transition: all 0.35s ease;
          position: relative;
          overflow: hidden;
        }
        .cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(180,83,9,0.06);
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .cta-btn:hover {
          background: rgba(180,83,9,0.16);
          border-color: rgba(180,83,9,0.55);
          box-shadow: 0 0 40px rgba(180,83,9,0.15), 0 0 80px rgba(180,83,9,0.06);
          transform: translateY(-2px);
          color: rgba(120,53,15,1);
        }
        .cta-btn:hover::before { opacity: 1; }
        .cta-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.6;
        }
      `}</style>

      <section className="luxury-section">
        {/* Background */}
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
        <div className="noise-overlay" />

        {/* Header */}
        <div style={{ position: 'relative' }}>
          <p className="section-eyebrow">Artisan Experience</p>
          <h2 className="section-title">
            How We <em>Serve</em> You
          </h2>
          <div className="divider" />
          <p className="section-subtitle">
            Every detail is crafted to deliver a seamless and refined bakery experience.
          </p>
        </div>

        {/* Cards */}
        <div className="cards-grid" style={{ position: 'relative' }}>
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="cta-wrapper">
          <a href="tel:+91234567890" className="cta-btn">
            <span className="cta-dot" />
            Reserve or Order Now
            <span className="cta-dot" />
          </a>
        </div>
      </section>
    </>
  );
}