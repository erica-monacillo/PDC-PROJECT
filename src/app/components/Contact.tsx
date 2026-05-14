import React from 'react';
import { Phone, MapPin, Clock, Navigation, MessageCircle, Star } from 'lucide-react';

export function Contact() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

        * {
          box-sizing: border-box;
        }

        .ct-section {
          padding: 90px 20px;
          background: #fffdf8;
          font-family: 'Poppins', sans-serif;
        }

        .ct-container {
          max-width: 1180px;
          margin: 0 auto;
        }

        /* Header */
        .ct-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .ct-eyebrow {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #d97706;
          margin-bottom: 12px;
        }

        .ct-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 14px;
        }

        .ct-title span {
          color: #f59e0b;
        }

        .ct-subtitle {
          max-width: 600px;
          margin: 0 auto;
          color: #6b7280;
          line-height: 1.7;
          font-size: 15px;
        }

        /* Layout */
        .ct-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        @media (max-width: 900px) {
          .ct-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Card */
        .ct-card {
          background: white;
          border: 1px solid #f3f4f6;
          border-radius: 22px;
          padding: 30px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.04);
        }

        .ct-card-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 10px;
        }

        .ct-card-sub {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 30px;
          line-height: 1.7;
        }

        /* Contact rows */
        .ct-row {
          display: flex;
          gap: 16px;
          padding: 18px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .ct-row:last-child {
          border-bottom: none;
        }

        .ct-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #fff7ed;
          color: #f59e0b;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ct-label {
          font-size: 12px;
          font-weight: 500;
          color: #9ca3af;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .ct-value {
          font-size: 16px;
          font-weight: 500;
          color: #111827;
          text-decoration: none;
        }

        .ct-small {
          display: block;
          margin-top: 4px;
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
        }

        /* Buttons */
        .ct-buttons {
          display: flex;
          gap: 14px;
          margin-top: 28px;
          flex-wrap: wrap;
        }

        .ct-btn {
          flex: 1;
          min-width: 160px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: 0.25s ease;
        }

        .ct-btn-call {
          background: #f59e0b;
          color: white;
        }

        .ct-btn-call:hover {
          background: #d97706;
        }

        .ct-btn-wa {
          background: #ecfdf5;
          color: #15803d;
          border: 1px solid #bbf7d0;
        }

        .ct-btn-wa:hover {
          background: #dcfce7;
        }

        /* Map */
        .ct-map {
          height: 260px;
          border-radius: 18px;
          background: #f9fafb;
          border: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          margin-bottom: 20px;
          padding: 20px;
        }

        .ct-map-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #fff7ed;
          color: #f59e0b;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .ct-map-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 6px;
        }

        .ct-map-sub {
          color: #6b7280;
          font-size: 14px;
        }

        .ct-map-btn {
          width: 100%;
          height: 48px;
          border-radius: 14px;
          background: #fff7ed;
          color: #d97706;
          border: 1px solid #fde68a;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: 0.25s ease;
        }

        .ct-map-btn:hover {
          background: #fef3c7;
        }

        /* Hours */
        .ct-hours {
          margin-top: 20px;
          display: flex;
          gap: 16px;
          align-items: center;
          background: #fffbeb;
          border-radius: 18px;
          padding: 22px;
          border: 1px solid #fde68a;
        }

        .ct-hours-icon {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          background: white;
          color: #f59e0b;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ct-hours-title {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }

        .ct-hours-sub {
          font-size: 14px;
          color: #6b7280;
        }

        /* CTA */
        .ct-cta {
          margin-top: 32px;
          background: linear-gradient(135deg, #fff7ed, #fffbeb);
          border: 1px solid #fde68a;
          border-radius: 24px;
          padding: 42px 30px;
          text-align: center;
        }

        .ct-cta-title {
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 600;
          color: #111827;
          margin-bottom: 14px;
        }

        .ct-cta-title span {
          color: #f59e0b;
        }

        .ct-cta-text {
          max-width: 650px;
          margin: 0 auto 28px;
          color: #6b7280;
          line-height: 1.7;
          font-size: 15px;
        }

        .ct-cta-buttons {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }
      `}</style>

      <section id="contact" className="ct-section">
        <div className="ct-container">

          {/* Header */}
          <div className="ct-header">
            <p className="ct-eyebrow">Contact Us</p>
            <h2 className="ct-title">
              Visit <span>Our Store</span>
            </h2>
            <p className="ct-subtitle">
              Fresh sweets and bakery products made daily with quality ingredients and traditional recipes.
            </p>
          </div>

          <div className="ct-grid">

            {/* Left */}
            <div className="ct-card">
              <div className="ct-card-title">Get in Touch</div>
              <div className="ct-card-sub">
                We’re happy to help with orders, inquiries, and directions.
              </div>

              <div className="ct-row">
                <div className="ct-icon"><Phone size={20} /></div>
                <div>
                  <div className="ct-label">Phone</div>
                  <a href="tel:+91234567890" className="ct-value">
                    +91 12345 67890
                  </a>
                  <span className="ct-small">Available during store hours</span>
                </div>
              </div>

              <div className="ct-row">
                <div className="ct-icon"><MapPin size={20} /></div>
                <div>
                  <div className="ct-label">Address</div>
                  <div className="ct-value">G9, Near D Mart</div>
                  <span className="ct-small">
                    Jhotwara, Jaipur, Rajasthan 302044
                  </span>
                </div>
              </div>

              <div className="ct-row">
                <div className="ct-icon"><Clock size={20} /></div>
                <div>
                  <div className="ct-label">Business Hours</div>
                  <div className="ct-value">5:45 AM – Late Evening</div>
                  <span className="ct-small">
                    Open daily with fresh morning batches
                  </span>
                </div>
              </div>

              <div className="ct-row">
                <div className="ct-icon"><Star size={20} /></div>
                <div>
                  <div className="ct-label">Customer Rating</div>
                  <div className="ct-value">4.4 • 63+ Reviews</div>
                  <span className="ct-small">
                    Trusted by families across Jaipur
                  </span>
                </div>
              </div>

              <div className="ct-buttons">
                <a href="tel:+91234567890" className="ct-btn ct-btn-call">
                  <Phone size={16} />
                  Call Now
                </a>

                <a
                  href="https://wa.me/91234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ct-btn ct-btn-wa"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Right */}
            <div>

              <div className="ct-card">
                <div className="ct-card-title">Our Location</div>

                <div className="ct-map">
                  <div className="ct-map-icon">
                    <MapPin size={26} />
                  </div>

                  <div className="ct-map-title">
                    Shri G S Sweets & Bakers
                  </div>

                  <div className="ct-map-sub">
                    Near D Mart, Jhotwara, Jaipur
                  </div>
                </div>

                <a
                  href="https://www.google.com/maps/place/Shri+G+S+Sweets+And+Bakers/@26.9544576,75.7085848,739m"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ct-map-btn"
                >
                  <Navigation size={16} />
                  Open in Google Maps
                </a>
              </div>

              <div className="ct-hours">
                <div className="ct-hours-icon">
                  <Clock size={22} />
                </div>

                <div>
                  <div className="ct-hours-title">
                    Open Every Day
                  </div>

                  <div className="ct-hours-sub">
                    Visit early for the freshest sweets and bakery items.
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* CTA */}
          <div className="ct-cta">
            <div className="ct-cta-title">
              Ready to Order <span>Fresh Sweets?</span>
            </div>

            <div className="ct-cta-text">
              Dine-in, pickup, or delivery — enjoy authentic sweets and bakery favorites anytime.
            </div>

            <div className="ct-cta-buttons">
              <a href="tel:+91234567890" className="ct-btn ct-btn-call">
                <Phone size={16} />
                Call Us
              </a>

              <a
                href="https://wa.me/91234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="ct-btn ct-btn-wa"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}