import React from 'react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    rating: 5,
    text: 'Best sweets in Jhotwara! Fresh jalebi every morning. The quality and taste is unmatched.',
    highlight: 'Quality & Taste',
    accent: 'rgba(245,158,11,0.9)',
    accentBg: 'rgba(245,158,11,0.08)',
    accentBorder: 'rgba(245,158,11,0.2)',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    rating: 5,
    text: 'Amazing Bengali mithai and very affordable prices. My family loves their kachori for breakfast.',
    highlight: 'Affordable Prices',
    accent: 'rgba(236,72,153,0.9)',
    accentBg: 'rgba(236,72,153,0.08)',
    accentBorder: 'rgba(236,72,153,0.2)',
  },
  {
    id: 3,
    name: 'Anil Verma',
    rating: 4,
    text: 'Pure ingredients and fresh preparation. Been coming here for years, never disappointed.',
    highlight: 'Pure & Fresh',
    accent: 'rgba(52,211,153,0.9)',
    accentBg: 'rgba(52,211,153,0.08)',
    accentBorder: 'rgba(52,211,153,0.2)',
  },
];

const stats = [
  { value: '4.4★', label: 'Average Rating', accent: 'rgba(180,83,9,0.9)' },
  { value: '63+',  label: 'Happy Reviews',  accent: 'rgba(190,24,93,0.85)' },
  { value: '100%', label: 'Pure Ingredients', accent: 'rgba(5,150,105,0.85)' },
  { value: '5:45', label: 'AM Opening',     accent: 'rgba(29,78,216,0.85)' },
];

export function SocialProof() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');

        .rev-section {
          position: relative;
          padding: 120px 24px;
          background: rgba(251,191,36,0.08);
          backdrop-filter: blur(40px) saturate(160%);
          -webkit-backdrop-filter: blur(40px) saturate(160%);
          overflow: hidden;
          font-family: 'Lora', serif;
        }

        /* Ambient blobs */
        .rev-blob {
          position: absolute; border-radius: 50%;
          filter: blur(100px); pointer-events: none;
        }
        .rev-blob-1 {
          width: 500px; height: 500px; top: -180px; left: -180px;
          background: radial-gradient(circle, rgba(251,191,36,0.35) 0%, transparent 70%);
        }
        .rev-blob-2 {
          width: 500px; height: 500px; bottom: -150px; right: -150px;
          background: radial-gradient(circle, rgba(245,130,11,0.28) 0%, transparent 70%);
        }
        .rev-noise {
          position: absolute; inset: 0; opacity: 0.04; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 128px;
        }

        /* Section header */
        .rev-eyebrow {
          font-family: 'Lora', serif;
          font-size: 11px; font-weight: 400; letter-spacing: 0.35em;
          text-transform: uppercase; color: rgba(139,78,28,0.7);
          text-align: center; margin-bottom: 18px;
        }
        .rev-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 5vw, 4rem); font-weight: 300;
          letter-spacing: -0.01em; color: #3b2a1a;
          text-align: center; line-height: 1.15; margin-bottom: 14px;
        }
        .rev-title em { font-style: italic; color: rgba(139,78,28,0.9); }
        .rev-divider {
          width: 56px; height: 1px; margin: 0 auto 16px;
          background: linear-gradient(90deg, transparent, rgba(139,78,28,0.4), transparent);
        }
        .rev-subtitle {
          font-family: 'Lora', serif;
          font-size: 13px; font-weight: 400; font-style: italic;
          color: rgba(59,42,26,0.58); text-align: center;
          letter-spacing: 0.02em;
          margin-bottom: 72px;
        }

        /* Cards grid */
        .rev-grid {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 20px;
          max-width: 1100px; margin: 0 auto;
        }
        @media (max-width: 900px) { .rev-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 580px) { .rev-grid { grid-template-columns: 1fr; } }

        /* Review card */
        .rev-card {
          position: relative;
          padding: 32px 28px;
          border-radius: 28px;
          background: rgba(255,245,230,0.65);
          backdrop-filter: blur(20px) saturate(140%);
          -webkit-backdrop-filter: blur(20px) saturate(140%);
          border: 1px solid rgba(210,170,120,0.35);
          box-shadow: 0 10px 40px rgba(100,60,20,0.08);
          transition: transform 0.5s ease, box-shadow 0.5s ease;
          overflow: hidden;
          cursor: default;
        }
        .rev-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 30px 80px rgba(100,60,20,0.14);
        }

        /* Top shimmer line per card */
        .rev-card-shimmer {
          position: absolute; top: 0; left: 20%; right: 20%; height: 1px;
          opacity: 0.5; pointer-events: none;
        }

        /* Quote icon */
        .rev-quote {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 22px;
        }

        /* Stars */
        .rev-stars { display: flex; gap: 4px; margin-bottom: 18px; }

        /* Review text */
        .rev-text {
          font-family: 'Lora', serif;
          font-size: 0.95rem; font-weight: 400; font-style: italic;
          color: rgba(59,42,26,0.78); line-height: 1.85;
          margin-bottom: 20px;
        }

        /* Highlight badge */
        .rev-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-family: 'Lora', serif;
          font-size: 9px; font-weight: 400; letter-spacing: 0.18em;
          text-transform: uppercase; padding: 5px 12px;
          border-radius: 100px; margin-bottom: 18px;
        }
        .rev-badge-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; }

        /* Divider */
        .rev-card-line {
          height: 1px; margin-bottom: 16px;
          background: linear-gradient(90deg, transparent, rgba(139,78,28,0.15), transparent);
        }

        /* Reviewer */
        .rev-name {
          font-family: 'Lora', serif;
          font-size: 12px; font-weight: 500; letter-spacing: 0.06em;
          color: rgba(59,42,26,0.65);
        }

        /* Stats row */
        .rev-stats {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 16px;
          max-width: 1100px; margin: 56px auto 0;
        }
        @media (max-width: 700px) { .rev-stats { grid-template-columns: repeat(2,1fr); } }

        .rev-stat {
          padding: 24px 16px; border-radius: 20px; text-align: center;
          background: rgba(255,245,230,0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(210,170,120,0.3);
          box-shadow: 0 8px 24px rgba(100,60,20,0.07);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .rev-stat:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(100,60,20,0.12);
        }
        .rev-stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 400; line-height: 1;
          margin-bottom: 8px;
        }
        .rev-stat-label {
          font-family: 'Lora', serif;
          font-size: 9px; font-weight: 400; letter-spacing: 0.2em;
          text-transform: uppercase; color: rgba(59,42,26,0.4);
        }
      `}</style>

      <section id="reviews" className="rev-section">
        <div className="rev-blob rev-blob-1" />
        <div className="rev-blob rev-blob-2" />
        <div className="rev-noise" />

        <div style={{ position: 'relative' }}>
          {/* Header */}
          <p className="rev-eyebrow">Customer Stories</p>
          <h2 className="rev-title">What Our <em>Customers</em> Say</h2>
          <div className="rev-divider" />
          <p className="rev-subtitle">Trusted by families across Jaipur</p>

          {/* Review cards */}
          <div className="rev-grid">
            {reviews.map((review, i) => (
              <div
                key={review.id}
                className="rev-card"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Top shimmer */}
                <div
                  className="rev-card-shimmer"
                  style={{ background: `linear-gradient(90deg, transparent, ${review.accent}, transparent)` }}
                />

                {/* Quote icon */}
                <div
                  className="rev-quote"
                  style={{ background: review.accentBg, border: `1px solid ${review.accentBorder}` }}
                >
                  <Quote size={16} style={{ color: review.accent }} />
                </div>

                {/* Stars */}
                <div className="rev-stars">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      size={14}
                      style={{
                        fill: idx < review.rating ? 'rgba(245,158,11,0.85)' : 'transparent',
                        color: idx < review.rating ? 'rgba(245,158,11,0.85)' : 'rgba(255,255,255,0.15)',
                      }}
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="rev-text">"{review.text}"</p>

                {/* Badge */}
                <div
                  className="rev-badge"
                  style={{
                    background: review.accentBg,
                    border: `1px solid ${review.accentBorder}`,
                    color: review.accent,
                  }}
                >
                  <span className="rev-badge-dot" />
                  {review.highlight}
                </div>

                {/* Divider */}
                <div className="rev-card-line" />

                {/* Name */}
                <p className="rev-name">— {review.name}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="rev-stats">
            {stats.map((stat, i) => (
              <div key={i} className="rev-stat">
                <div className="rev-stat-value" style={{ color: stat.accent }}>{stat.value}</div>
                <div className="rev-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}