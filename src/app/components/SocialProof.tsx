import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    rating: 5,
    text: 'Best sweets in Jhotwara! Fresh jalebi every morning.',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    rating: 5,
    text: 'Amazing Bengali mithai and affordable prices.',
  },
  {
    id: 3,
    name: 'Anil Verma',
    rating: 4,
    text: 'Pure ingredients and always freshly prepared.',
  },
];

const stats = [
  { value: '4.4★', label: 'Average Rating' },
  { value: '63+', label: 'Happy Reviews' },
  { value: '100%', label: 'Pure Ingredients' },
  { value: '5:45', label: 'AM Opening' },
];

export function SocialProof() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

        .social-section {
          padding: 90px 20px;
          background: #fffdf8;
          font-family: 'Poppins', sans-serif;
        }

        .social-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .social-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .social-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 600;
          color: #2d2d2d;
          margin-bottom: 10px;
        }

        .social-subtitle {
          font-size: 15px;
          color: #777;
        }

        .review-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        @media (max-width: 900px) {
          .review-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .review-grid {
            grid-template-columns: 1fr;
          }
        }

        .review-card {
          background: white;
          border: 1px solid #f1e8dc;
          border-radius: 18px;
          padding: 24px;
          transition: 0.3s ease;
        }

        .review-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }

        .stars {
          display: flex;
          gap: 4px;
          margin-bottom: 14px;
        }

        .review-text {
          font-size: 14px;
          color: #555;
          line-height: 1.7;
          margin-bottom: 18px;
        }

        .review-name {
          font-size: 13px;
          font-weight: 500;
          color: #222;
        }

        .stats-grid {
          margin-top: 50px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 700px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .stat-card {
          background: white;
          border: 1px solid #f1e8dc;
          border-radius: 16px;
          padding: 22px;
          text-align: center;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 600;
          color: #f59e0b;
          margin-bottom: 6px;
        }

        .stat-label {
          font-size: 12px;
          color: #777;
        }
      `}</style>

      <section id="reviews" className="social-section">
        <div className="social-container">

          {/* Header */}
          <div className="social-header">
            <h2 className="social-title">
              What Our Customers Say
            </h2>
            <p className="social-subtitle">
              Trusted by families across Jaipur
            </p>
          </div>

          {/* Reviews */}
          <div className="review-grid">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">

                <div className="stars">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      size={16}
                      fill={idx < review.rating ? '#f59e0b' : 'transparent'}
                      color={idx < review.rating ? '#f59e0b' : '#d1d5db'}
                    />
                  ))}
                </div>

                <p className="review-text">
                  "{review.text}"
                </p>

                <p className="review-name">
                  — {review.name}
                </p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}