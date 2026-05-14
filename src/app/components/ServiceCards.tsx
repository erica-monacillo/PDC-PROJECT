import React from 'react';
import {
  UtensilsCrossed,
  Truck,
  Package,
  Car,
  Flower2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Service {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const services: Service[] = [
  {
    id: 1,
    icon: UtensilsCrossed,
    title: 'Dine-In',
    description:
      'Enjoy freshly baked pastries in a warm and comfortable café ambiance.',
    color: '#f59e0b',
  },
  {
    id: 2,
    icon: Package,
    title: 'Takeout',
    description:
      'Freshly packed sweets and snacks ready for your journey.',
    color: '#d97706',
  },
  {
    id: 3,
    icon: Truck,
    title: 'Delivery',
    description:
      'Fast and reliable doorstep delivery for every order.',
    color: '#16a34a',
  },
  {
    id: 4,
    icon: Truck,
    title: 'No-Contact Delivery',
    description:
      'Safe and smooth delivery experience for your convenience.',
    color: '#b91c1c',
  },
  {
    id: 5,
    icon: Car,
    title: 'Curbside Pickup',
    description:
      'Quick pickup service designed for busy customers.',
    color: '#7c3aed',
  },
  {
    id: 6,
    icon: Flower2,
    title: 'Outdoor Seating',
    description:
      'Relax and enjoy sweets in a peaceful outdoor setting.',
    color: '#15803d',
  },
];

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;

  return (
    <div className="service-card">
      <div
        className="icon-box"
        style={{ background: `${service.color}15` }}
      >
        <Icon size={22} color={service.color} />
      </div>

      <h3 className="service-title">{service.title}</h3>

      <p className="service-description">
        {service.description}
      </p>
    </div>
  );
}

export function ServiceCards() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

        .services-section {
          padding: 90px 20px;
          background: #fffdf8;
          font-family: 'Poppins', sans-serif;
        }

        .services-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .services-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .services-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 600;
          color: #222;
          margin-bottom: 12px;
        }

        .services-subtitle {
          font-size: 15px;
          color: #777;
          max-width: 550px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        @media (max-width: 900px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .services-grid {
            grid-template-columns: 1fr;
          }
        }

        .service-card {
          background: white;
          border: 1px solid #f1e8dc;
          border-radius: 18px;
          padding: 28px 24px;
          transition: 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }

        .icon-box {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .service-title {
          font-size: 20px;
          font-weight: 600;
          color: #222;
          margin-bottom: 12px;
        }

        .service-description {
          font-size: 14px;
          color: #666;
          line-height: 1.7;
        }

        .cta-wrapper {
          text-align: center;
          margin-top: 50px;
        }

        .cta-button {
          display: inline-block;
          padding: 14px 32px;
          border-radius: 999px;
          background: #f59e0b;
          color: white;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: 0.3s ease;
        }

        .cta-button:hover {
          background: #d97706;
          transform: translateY(-2px);
        }
      `}</style>

      <section className="services-section">
        <div className="services-container">

          {/* Header */}
          <div className="services-header">
            <h2 className="services-title">
              How We Serve You
            </h2>

            <p className="services-subtitle">
              Every service is designed to make your bakery experience
              simple, fresh, and convenient.
            </p>
          </div>

          {/* Cards */}
          <div className="services-grid">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="cta-wrapper">
            <a href="tel:+91234567890" className="cta-button">
              Reserve or Order Now
            </a>
          </div>

        </div>
      </section>
    </>
  );
}