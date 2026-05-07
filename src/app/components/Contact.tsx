import React from 'react';
import { Phone, MapPin, Clock, Navigation, MessageCircle, Star } from 'lucide-react';

export function Contact() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Josefin+Sans:wght@200;300;400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

        .ct-section {
          position: relative;
          padding: 120px 24px 100px;
          background: rgba(251,191,36,0.08);
          backdrop-filter: blur(40px) saturate(160%);
          -webkit-backdrop-filter: blur(40px) saturate(160%);
          overflow: hidden;
        }

        .ct-blob {
          position: absolute; border-radius: 50%;
          filter: blur(100px); pointer-events: none;
        }
        .ct-blob-1 {
          width: 650px; height: 650px; top: -200px; left: -200px;
          background: radial-gradient(circle, rgba(251,191,36,0.35) 0%, transparent 70%);
        }
        .ct-blob-2 {
          width: 550px; height: 550px; bottom: -180px; right: -180px;
          background: radial-gradient(circle, rgba(245,130,11,0.28) 0%, transparent 70%);
        }
        .ct-blob-3 {
          width: 400px; height: 400px; top: 40%; left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(253,211,77,0.15) 0%, transparent 70%);
        }
        .ct-noise {
          position: absolute; inset: 0; opacity: 0.03; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 128px;
        }

        /* ── Header ── */
        .ct-eyebrow {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px; font-weight: 300; letter-spacing: 0.45em;
          text-transform: uppercase; color: rgba(146,64,14,0.75);
          text-align: center; margin-bottom: 16px;
        }
        .ct-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.8rem, 6vw, 4.8rem); font-weight: 300;
          color: #2d1a05; text-align: center;
          line-height: 1.08; margin-bottom: 16px;
        }
        .ct-title em { font-style: italic; color: rgba(160,70,8,0.95); }
        .ct-divider {
          width: 70px; height: 1px; margin: 0 auto 18px;
          background: linear-gradient(90deg, transparent, rgba(180,83,9,0.5), transparent);
        }
        .ct-subtitle {
          font-family: 'Lora', serif;
          font-size: 15px; font-weight: 400; font-style: italic;
          color: rgba(45,26,5,0.62); text-align: center;
          max-width: 480px; margin: 0 auto 72px; line-height: 1.7;
        }

        /* ── Grid ── */
        .ct-grid {
          display: grid; grid-template-columns: 1.1fr 0.9fr;
          gap: 28px; max-width: 1140px; margin: 0 auto;
        }
        @media (max-width: 960px) { .ct-grid { grid-template-columns: 1fr; } }

        /* ── Glass card ── */
        .ct-card {
          position: relative;
          border-radius: 32px;
          background: rgba(255,240,190,0.42);
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
          border: 1px solid rgba(251,191,36,0.3);
          box-shadow:
            0 16px 56px rgba(146,64,14,0.12),
            inset 0 1px 0 rgba(255,255,255,0.55),
            inset 0 -1px 0 rgba(180,83,9,0.06);
          overflow: hidden;
        }
        .ct-card-shimmer {
          position: absolute; top: 0; left: 15%; right: 15%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(180,83,9,0.45), transparent);
          pointer-events: none;
        }

        /* ── Info card ── */
        .ct-info-card { padding: 44px 40px; }
        .ct-card-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 400; color: #2d1a05;
          margin-bottom: 6px; letter-spacing: 0.01em;
        }
        .ct-card-tagline {
          font-family: 'Lora', serif;
          font-size: 13.5px; font-style: italic; color: rgba(45,26,5,0.58);
          margin-bottom: 32px; line-height: 1.65;
        }

        .ct-info-row {
          display: flex; align-items: flex-start; gap: 18px;
          padding: 20px 0;
          border-bottom: 1px solid rgba(180,83,9,0.1);
        }
        .ct-info-row:last-of-type { border-bottom: none; padding-bottom: 0; }

        .ct-icon-box {
          flex-shrink: 0; width: 52px; height: 52px; border-radius: 16px;
          background: rgba(180,83,9,0.09); border: 1px solid rgba(180,83,9,0.18);
          display: flex; align-items: center; justify-content: center;
          color: rgba(140,56,8,0.9);
          box-shadow: 0 4px 16px rgba(146,64,14,0.1);
        }
        .ct-info-label {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px; font-weight: 300; letter-spacing: 0.35em;
          text-transform: uppercase; color: rgba(146,64,14,0.65); margin-bottom: 6px;
        }
        .ct-info-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.28rem; font-weight: 500; color: #2d1a05;
          display: block; text-decoration: none; line-height: 1.3;
          transition: color 0.2s ease;
        }
        a.ct-info-value:hover { color: rgba(140,56,8,0.8); }
        .ct-info-sub {
          font-family: 'Lora', serif;
          font-size: 13px; font-weight: 400; font-style: italic;
          color: rgba(45,26,5,0.58); margin-top: 4px; display: block; line-height: 1.5;
        }

        .ct-info-btns {
          display: flex; gap: 12px; margin-top: 32px;
          padding-top: 28px; border-top: 1px solid rgba(180,83,9,0.12);
        }
        .ct-btn-primary {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 15px 20px; border-radius: 14px;
          background: rgba(140,56,8,0.12); border: 1px solid rgba(140,56,8,0.28);
          color: rgba(100,40,5,1);
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px; font-weight: 400; letter-spacing: 0.25em; text-transform: uppercase;
          text-decoration: none; transition: all 0.3s ease; cursor: pointer;
        }
        .ct-btn-primary:hover {
          background: rgba(140,56,8,0.2); border-color: rgba(140,56,8,0.5);
          box-shadow: 0 8px 28px rgba(140,56,8,0.18); transform: translateY(-2px);
        }
        .ct-btn-wa {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 15px 20px; border-radius: 14px;
          background: rgba(22,163,74,0.09); border: 1px solid rgba(22,163,74,0.28);
          color: rgba(14,90,45,0.95);
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px; font-weight: 400; letter-spacing: 0.25em; text-transform: uppercase;
          text-decoration: none; transition: all 0.3s ease;
        }
        .ct-btn-wa:hover {
          background: rgba(22,163,74,0.16); border-color: rgba(22,163,74,0.5);
          box-shadow: 0 8px 28px rgba(22,163,74,0.15); transform: translateY(-2px);
        }

        /* ── Right column ── */
        .ct-right { display: flex; flex-direction: column; gap: 20px; }

        .ct-map-card { padding: 32px; flex: 1; }
        .ct-map-embed {
          width: 100%; height: 240px; border-radius: 18px;
          overflow: hidden; margin-bottom: 20px;
          border: 1px solid rgba(251,191,36,0.25);
          background: rgba(251,191,36,0.1); position: relative;
        }
        .ct-map-placeholder {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 12px;
        }
        .ct-map-pin-wrap {
          width: 56px; height: 56px; border-radius: 50%;
          background: rgba(180,83,9,0.12); border: 1px solid rgba(180,83,9,0.22);
          display: flex; align-items: center; justify-content: center;
          color: rgba(140,56,8,0.9);
          box-shadow: 0 0 0 8px rgba(180,83,9,0.06);
        }
        .ct-map-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem; font-weight: 400; color: #2d1a05; text-align: center;
        }
        .ct-map-sublabel {
          font-family: 'Lora', serif;
          font-size: 12px; font-style: italic; color: rgba(45,26,5,0.55); text-align: center;
        }
        .ct-map-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(circle at 50% 50%, rgba(251,191,36,0.2) 0%, transparent 65%);
        }
        .ct-dir-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 14px; border-radius: 14px;
          background: rgba(140,56,8,0.1); border: 1px solid rgba(140,56,8,0.25);
          color: rgba(100,40,5,1);
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px; font-weight: 400; letter-spacing: 0.28em; text-transform: uppercase;
          text-decoration: none; transition: all 0.3s ease;
        }
        .ct-dir-btn:hover {
          background: rgba(140,56,8,0.18); border-color: rgba(140,56,8,0.45);
          box-shadow: 0 8px 24px rgba(140,56,8,0.15); transform: translateY(-2px);
        }

        /* Hours card */
        .ct-hours-card {
          padding: 28px 32px;
          display: flex; align-items: center; gap: 20px;
        }
        .ct-hours-icon {
          flex-shrink: 0; width: 56px; height: 56px; border-radius: 18px;
          background: rgba(180,83,9,0.1); border: 1px solid rgba(180,83,9,0.2);
          display: flex; align-items: center; justify-content: center;
          color: rgba(140,56,8,0.9);
        }
        .ct-hours-label {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px; font-weight: 300; letter-spacing: 0.35em;
          text-transform: uppercase; color: rgba(146,64,14,0.65); margin-bottom: 5px;
        }
        .ct-hours-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem; font-weight: 500; color: #2d1a05;
          line-height: 1.1; margin-bottom: 5px;
        }
        .ct-hours-sub {
          font-family: 'Lora', serif;
          font-size: 12.5px; font-style: italic; color: rgba(45,26,5,0.58);
        }

        /* ── Bottom CTA ── */
        .ct-cta {
          position: relative; overflow: hidden;
          max-width: 1140px; margin: 28px auto 0;
          padding: 56px 48px; border-radius: 32px;
          background: rgba(255,240,190,0.42); backdrop-filter: blur(28px);
          border: 1px solid rgba(251,191,36,0.3);
          box-shadow: 0 16px 56px rgba(146,64,14,0.12), inset 0 1px 0 rgba(255,255,255,0.55);
          display: flex; align-items: center; gap: 48px;
        }
        @media (max-width: 700px) { .ct-cta { flex-direction: column; text-align: center; padding: 40px 28px; gap: 32px; } }
        .ct-cta-shimmer {
          position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(180,83,9,0.4), transparent);
        }
        .ct-cta-orb {
          position: absolute; top: -80px; right: -80px;
          width: 320px; height: 320px; border-radius: 50%;
          background: radial-gradient(circle, rgba(251,191,36,0.28) 0%, transparent 70%);
          filter: blur(50px); pointer-events: none;
        }
        .ct-cta-left { flex: 1; position: relative; }
        .ct-cta-tag {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px; font-weight: 300; letter-spacing: 0.4em;
          text-transform: uppercase; color: rgba(146,64,14,0.7); margin-bottom: 12px;
        }
        .ct-cta-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 300;
          color: #2d1a05; line-height: 1.15; margin-bottom: 14px;
        }
        .ct-cta-heading em { font-style: italic; color: rgba(160,70,8,0.95); }
        .ct-cta-body {
          font-family: 'Lora', serif;
          font-size: 14px; font-weight: 400; font-style: italic;
          color: rgba(45,26,5,0.62); line-height: 1.75;
        }
        .ct-cta-right {
          display: flex; flex-direction: column; gap: 12px;
          flex-shrink: 0; min-width: 220px; position: relative;
        }
        @media (max-width: 700px) { .ct-cta-right { width: 100%; } }
        .ct-cta-btn-main {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 16px 28px; border-radius: 14px;
          background: rgba(140,56,8,0.13); border: 1px solid rgba(140,56,8,0.3);
          color: rgba(100,40,5,1);
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px; font-weight: 400; letter-spacing: 0.28em; text-transform: uppercase;
          text-decoration: none; transition: all 0.3s ease;
        }
        .ct-cta-btn-main:hover {
          background: rgba(140,56,8,0.22); border-color: rgba(140,56,8,0.52);
          box-shadow: 0 8px 28px rgba(140,56,8,0.2); transform: translateY(-2px);
        }
        .ct-cta-btn-wa {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 16px 28px; border-radius: 14px;
          background: rgba(22,163,74,0.09); border: 1px solid rgba(22,163,74,0.28);
          color: rgba(14,90,45,0.95);
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px; font-weight: 400; letter-spacing: 0.28em; text-transform: uppercase;
          text-decoration: none; transition: all 0.3s ease;
        }
        .ct-cta-btn-wa:hover {
          background: rgba(22,163,74,0.16); border-color: rgba(22,163,74,0.48);
          box-shadow: 0 8px 28px rgba(22,163,74,0.15); transform: translateY(-2px);
        }
      `}</style>

      <section id="contact" className="ct-section">
        <div className="ct-blob ct-blob-1" />
        <div className="ct-blob ct-blob-2" />
        <div className="ct-blob ct-blob-3" />
        <div className="ct-noise" />

        <div style={{ position: 'relative' }}>

          {/* Header */}
          <p className="ct-eyebrow"></p>
          <h2 className="ct-title">Visit Us <em>Today</em></h2>
          <div className="ct-divider" />
          <p className="ct-subtitle">
            Step in for a taste of tradition — fresh sweets crafted every morning
            in the heart of Jaipur.
          </p>

          <div className="ct-grid">

            {/* ── Left: contact info ── */}
            <div className="ct-card ct-info-card">
              <div className="ct-card-shimmer" />
              <div className="ct-card-heading">Get in Touch</div>
              <div className="ct-card-tagline">
                Drop by, call ahead, or send us a message — we'd love to serve you.
              </div>

              <div className="ct-info-row">
                <div className="ct-icon-box"><Phone size={20} /></div>
                <div>
                  <div className="ct-info-label">Phone</div>
                  <a href="tel:+91234567890" className="ct-info-value">+91 12345 67890</a>
                  <span className="ct-info-sub">Available during business hours</span>
                </div>
              </div>

              <div className="ct-info-row">
                <div className="ct-icon-box"><MapPin size={20} /></div>
                <div>
                  <div className="ct-info-label">Address</div>
                  <span className="ct-info-value">G9, near D Mart</span>
                  <span className="ct-info-sub">Jhotwara, Jaipur, Rajasthan 302044</span>
                </div>
              </div>

              <div className="ct-info-row">
                <div className="ct-icon-box"><Clock size={20} /></div>
                <div>
                  <div className="ct-info-label">Business Hours</div>
                  <span className="ct-info-value">Opens at 5:45 AM</span>
                  <span className="ct-info-sub">Fresh sweets made every single morning</span>
                </div>
              </div>

              <div className="ct-info-row">
                <div className="ct-icon-box"><Star size={20} /></div>
                <div>
                  <div className="ct-info-label">Customer Rating</div>
                  <span className="ct-info-value">4.4 · 63+ Reviews</span>
                  <span className="ct-info-sub">Loved by families across Jaipur</span>
                </div>
              </div>

              <div className="ct-info-btns">
                <a href="tel:+91234567890" className="ct-btn-primary">
                  <Phone size={13} /> Call Now
                </a>
                <a href="https://wa.me/91234567890" target="_blank" rel="noopener noreferrer" className="ct-btn-wa">
                  <MessageCircle size={13} /> WhatsApp
                </a>
              </div>
            </div>

            {/* ── Right: map + hours ── */}
            <div className="ct-right">

              <div className="ct-card ct-map-card">
                <div className="ct-card-shimmer" />
                <div className="ct-card-heading">Our Location</div>
                <div className="ct-map-embed">
                  <div className="ct-map-glow" />
                  <div className="ct-map-placeholder">
                    <div className="ct-map-pin-wrap"><MapPin size={24} /></div>
                    <div className="ct-map-label">Shri G S Sweets & Bakers</div>
                    <div className="ct-map-sublabel">Near D Mart, Jhotwara, Jaipur</div>
                  </div>
                </div>
                <a
                  href="https://www.google.com/maps/place/Shri+G+S+Sweets+And+Bakers/@26.9544576,75.7085848,739m"
                  target="_blank" rel="noopener noreferrer"
                  className="ct-dir-btn"
                >
                  <Navigation size={13} /> Get Directions on Google Maps
                </a>
              </div>

              <div className="ct-card ct-hours-card">
                <div className="ct-card-shimmer" />
                <div className="ct-hours-icon"><Clock size={22} /></div>
                <div>
                  <div className="ct-hours-label">Open Every Day</div>
                  <div className="ct-hours-value">5:45 AM Late Evening</div>
                  <div className="ct-hours-sub">Arrive early for the freshest morning batches</div>
                </div>
              </div>

            </div>
          </div>

          {/* ── Bottom CTA ── */}
          <div className="ct-cta">
            <div className="ct-cta-shimmer" />
            <div className="ct-cta-orb" />
            <div className="ct-cta-left">
              <div className="ct-cta-tag">Ready to Indulge?</div>
              <div className="ct-cta-heading">
                Order <em>Fresh Sweets</em><br />Delivered to You
              </div>
              <p className="ct-cta-body">
                Dine-in, curbside pickup, or no-contact delivery — we bring
                the authentic flavours of Jaipur right to your door.
              </p>
            </div>
            <div className="ct-cta-right">
              <a href="tel:+91234567890" className="ct-cta-btn-main">
                <Phone size={13} /> +91 12345 67890
              </a>
              <a href="https://wa.me/91234567890" target="_blank" rel="noopener noreferrer" className="ct-cta-btn-wa">
                <MessageCircle size={13} /> WhatsApp Us
              </a>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}