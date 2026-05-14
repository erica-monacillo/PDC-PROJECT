import React, { useState, useEffect } from 'react';
import { Plus, ShoppingCart, Star, Search, SlidersHorizontal } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
}

const unsplashFallback: Record<string, string> = {
  cakes: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
  pastries: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80',
  traditional: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80',
  default: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&q=80',
};

export function Products() {
  const { isAuthenticated } = useAuth();
  const { addToCart, loading } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://pdc-project.onrender.com'}/api/products`);
      if (res.ok) setProducts(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated) {
      alert('Please sign in to add items to your cart');
      return;
    }
    try {
      setAddingId(productId);
      await addToCart(productId);
    } catch (e) {
      console.error('Failed to add to cart:', e);
    } finally {
      setAddingId(null);
    }
  };

  const categories: string[] = ['all', ...(Array.from(new Set(products.map((p: any) => p.category))) as string[])];
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Poppins:wght@300;400;500;600&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

        .prod-section {
          position: relative;
          padding: 120px 24px;
          background: rgba(245,235,225,0.6);
          backdrop-filter: blur(40px) saturate(160%);
          -webkit-backdrop-filter: blur(40px) saturate(160%);
          overflow: hidden;
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
        }

        /* Blobs */
        .prod-blob {
          position: absolute; border-radius: 50%;
          filter: blur(100px); pointer-events: none;
        }
        .prod-blob-1 {
          width: 700px; height: 700px; top: -200px; left: -200px;
          background: radial-gradient(circle, rgba(255,153,51,0.25) 0%, transparent 70%);
        }
        .prod-blob-2 {
          width: 600px; height: 600px; bottom: -150px; right: -150px;
          background: radial-gradient(circle, rgba(124,45,18,0.15) 0%, transparent 70%);
        }
        .prod-blob-3 {
          width: 500px; height: 500px; top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          background: radial-gradient(circle, rgba(255,153,51,0.12) 0%, transparent 70%);
        }
        .prod-noise {
          position: absolute; inset: 0; opacity: 0.03; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 128px;
        }

        /* Header */
        .prod-eyebrow {
          font-size: 12px; font-weight: 500; letter-spacing: 0.3em;
          text-transform: uppercase; color: rgba(255,153,51,0.85);
          text-align: center; margin-bottom: 20px;
        }
        .prod-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 5vw, 4.2rem); font-weight: 700;
          letter-spacing: -0.015em; color: #1a3a3a;
          text-align: center; line-height: 1.1; margin-bottom: 16px;
        }
        .prod-title em { font-style: italic; color: #FF9933; }
        .prod-divider {
          width: 80px; height: 2px; margin: 0 auto 25px;
          background: linear-gradient(90deg, transparent, #FF9933, transparent);
        }
        .prod-subtitle {
          font-size: 14px; font-weight: 400; letter-spacing: 0.01em;
          color: rgba(26, 58, 58, 0.68); text-align: center; margin-bottom: 60px;
        }

        /* Category filters */
        .prod-filters {
          display: flex; flex-wrap: wrap; justify-content: center;
          gap: 8px; margin-bottom: 48px;
        }
        .prod-filter-btn {
          font-family: 'Poppins', sans-serif;
          font-size: 11px; font-weight: 400; letter-spacing: 0.15em;
          text-transform: uppercase; padding: 9px 20px; border-radius: 100px;
          background: rgba(255,237,180,0.3);
          border: 1px solid rgba(255,153,51,0.25);
          color: rgba(59,32,5,0.6);
          cursor: pointer; transition: all 0.3s ease;
        }
        .prod-filter-btn:hover {
          background: rgba(255,237,180,0.5);
          border-color: rgba(255,153,51,0.4);
          color: rgba(59,32,5,0.85);
        }
        .prod-filter-btn.active {
          background: rgba(255,153,51,0.15);
          border-color: rgba(255,153,51,0.45);
          color: rgba(146,64,14,1);
          box-shadow: 0 0 20px rgba(255,153,51,0.15);
        }

        /* Grid */
        .prod-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          max-width: 1200px; margin: 0 auto;
        }
        @media (max-width: 1100px) { .prod-grid { grid-template-columns: repeat(3,1fr); } }
        @media (max-width: 750px)  { .prod-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 480px)  { .prod-grid { grid-template-columns: 1fr; } }

        /* Product card */
        .prod-card {
          position: relative;
          border-radius: 24px;
          background: rgba(255,237,180,0.35);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(251,191,36,0.25);
          box-shadow: 0 10px 40px rgba(146,64,14,0.1), inset 0 1px 0 rgba(255,255,255,0.4);
          overflow: hidden;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .prod-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 28px 70px rgba(146,64,14,0.16), inset 0 1px 0 rgba(255,255,255,0.5);
        }

        /* Image area */
        .prod-img {
          position: relative;
          height: 180px;
          background: rgba(251,191,36,0.15);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          border-bottom: 1px solid rgba(251,191,36,0.2);
        }
        .prod-img-photo {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .prod-card:hover .prod-img-photo { transform: scale(1.05); }
        .prod-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(251,191,36,0.18) 100%);
          pointer-events: none;
        }
        .prod-img-glow {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 50% 80%, rgba(251,191,36,0.2) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Category badge */
        .prod-cat-badge {
          position: absolute; top: 12px; left: 12px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 8px; font-weight: 300; letter-spacing: 0.25em; text-transform: uppercase;
          padding: 4px 10px; border-radius: 100px;
          background: rgba(255,237,180,0.7);
          border: 1px solid rgba(251,191,36,0.3);
          color: rgba(146,64,14,0.8);
          backdrop-filter: blur(8px);
        }

        /* Rating badge */
        .prod-rating {
          position: absolute; top: 12px; right: 12px;
          display: flex; align-items: center; gap: 4px;
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px; font-weight: 300; letter-spacing: 0.08em;
          padding: 4px 10px; border-radius: 100px;
          background: rgba(255,237,180,0.7);
          border: 1px solid rgba(251,191,36,0.3);
          color: rgba(146,64,14,0.85);
          backdrop-filter: blur(8px);
        }

        /* Body */
        .prod-body { padding: 20px; }

        .prod-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem; font-weight: 400; letter-spacing: 0.01em;
          color: #3b2005; margin-bottom: 8px; line-height: 1.2;
        }
        .prod-desc {
          font-size: 12px; font-weight: 400; letter-spacing: 0.02em;
          color: rgba(59,32,5,0.72); line-height: 1.7;
          margin-bottom: 16px;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
          font-family: 'Lora', serif;
        }

        /* Price row */
        .prod-price-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px;
        }
        .prod-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem; font-weight: 400;
          color: rgba(146,64,14,0.95);
        }
        .prod-stock {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 9px; font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase;
          padding: 4px 10px; border-radius: 100px;
        }
        .prod-stock-ok {
          background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25);
          color: rgba(6,95,70,0.8);
        }
        .prod-stock-low {
          background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25);
          color: rgba(120,53,15,0.85);
        }
        .prod-stock-out {
          background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
          color: rgba(153,27,27,0.8);
        }

        /* Add to cart button */
        .prod-btn {
          width: 100%; padding: 12px;
          border-radius: 14px;
          font-family: 'Poppins', sans-serif;
          font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          cursor: pointer; transition: all 0.3s ease; border: none;
        }
        .prod-btn-active {
          background: rgba(255,153,51,0.12);
          border: 1px solid rgba(255,153,51,0.35);
          color: rgba(146,64,14,0.95);
        }
        .prod-btn-active:hover:not(:disabled) {
          background: rgba(255,153,51,0.2);
          border-color: rgba(255,153,51,0.55);
          box-shadow: 0 0 20px rgba(255,153,51,0.15);
          transform: translateY(-1px);
        }
        .prod-btn-disabled {
          background: rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.08);
          color: rgba(59,32,5,0.3);
          cursor: not-allowed;
        }

        /* Loading skeleton */
        .prod-loading {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 80px 24px; gap: 16px;
        }
        .prod-spinner {
          width: 44px; height: 44px; border-radius: 50%;
          border: 2px solid rgba(255,153,51,0.15);
          border-top-color: rgba(255,153,51,0.8);
          animation: prodSpin 0.8s linear infinite;
        }
        @keyframes prodSpin { to { transform: rotate(360deg); } }
        .prod-loading-text {
          font-size: 12px; font-weight: 400; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(26, 58, 58, 0.6);
        }

        /* Empty state */
        .prod-empty {
          display: flex; flex-direction: column; align-items: center;
          padding: 64px 24px; gap: 12px; text-align: center;
          max-width: 1200px; margin: 0 auto;
        }
        .prod-empty-icon {
          width: 56px; height: 56px; border-radius: 18px;
          background: rgba(255,237,180,0.4); border: 1px solid rgba(251,191,36,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; margin-bottom: 8px;
        }
        .prod-empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem; color: rgba(59,32,5,0.7);
        }
        .prod-empty-sub {
          font-size: 11px; font-weight: 200; letter-spacing: 0.1em;
          color: rgba(59,32,5,0.38);
        }

        /* CTA banner */
        .prod-cta {
          max-width: 1200px; margin: 64px auto 0;
          padding: 48px 40px; border-radius: 28px;
          background: rgba(255,237,180,0.4);
          backdrop-filter: blur(20px); border: 1px solid rgba(255,153,51,0.3);
          box-shadow: 0 16px 48px rgba(146,64,14,0.1), inset 0 1px 0 rgba(255,255,255,0.5);
          text-align: center; position: relative; overflow: hidden;
        }
        .prod-cta-glow {
          position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
          width: 400px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,153,51,0.3) 0%, transparent 70%);
          filter: blur(40px); pointer-events: none;
        }
        .prod-cta-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; font-weight: 700; color: #1a3a3a; margin-bottom: 10px;
        }
        .prod-cta-title em { font-style: italic; color: #FF9933; }
        .prod-cta-sub {
          font-size: 14px; font-weight: 400; letter-spacing: 0.01em;
          color: rgba(26, 58, 58, 0.68); margin-bottom: 28px;
        }
        .prod-cta-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 36px; border-radius: 100px;
          background: rgba(255,153,51,0.12); border: 1px solid rgba(255,153,51,0.35);
          color: rgba(146,64,14,0.95);
          font-family: 'Poppins', sans-serif;
          font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase;
          cursor: pointer; transition: all 0.3s ease;
        }
        .prod-cta-btn:hover {
          background: rgba(255,153,51,0.2);
          border-color: rgba(255,153,51,0.55);
          box-shadow: 0 0 28px rgba(255,153,51,0.15);
          transform: translateY(-2px);
        }
        .prod-cta-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; opacity: 0.8; }
      `}</style>

      <div id="products" className="prod-section">
        <div className="prod-blob prod-blob-1" />
        <div className="prod-blob prod-blob-2" />
        <div className="prod-blob prod-blob-3" />
        <div className="prod-noise" />

        <div style={{ position: 'relative' }}>
          {/* Header */}
          <p className="prod-eyebrow">Handcrafted Daily</p>
          <h2 className="prod-title">Our Sweet <em>Delights</em></h2>
          <div className="prod-divider" />
          <p className="prod-subtitle">
            Traditional recipes, finest ingredients — made fresh every morning.
          </p>

          {/* Category filters */}
          <div className="prod-filters">
            {categories.map((cat: string) => (
              <button
                key={cat}
                className={`prod-filter-btn${selectedCategory === cat ? ' active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loadingProducts ? (
            <div className="prod-loading">
              <div className="prod-spinner" />
              <p className="prod-loading-text">Preparing today's selection…</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="prod-empty">
              <div className="prod-empty-icon"><ShoppingCart size={22} style={{ color: 'rgba(146,64,14,0.5)' }} /></div>
              <div className="prod-empty-title">Nothing here yet</div>
              <div className="prod-empty-sub">Try selecting a different category</div>
            </div>
          ) : (
            <div className="prod-grid">
              {filteredProducts.map(product => {
                const isAdding = addingId === product.id;
                const outOfStock = product.stock === 0;
                const btnDisabled = loading || outOfStock || !isAuthenticated || isAdding;

                return (
                  <div key={product.id} className="prod-card">
                    {/* Image */}
                    <div className="prod-img">
                      <img
                        src={product.image || unsplashFallback[product.category] || unsplashFallback.default}
                        alt={product.name}
                        className="prod-img-photo"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            unsplashFallback[product.category] || unsplashFallback.default;
                        }}
                      />
                      <div className="prod-img-overlay" />
                      <div className="prod-img-glow" />
                      <span className="prod-cat-badge">{product.category}</span>
                      <span className="prod-rating">
                        <Star size={10} style={{ fill: 'rgba(146,64,14,0.8)', color: 'rgba(146,64,14,0.8)' }} />
                        4.8
                      </span>
                    </div>

                    {/* Body */}
                    <div className="prod-body">
                      <div className="prod-name">{product.name}</div>
                      <div className="prod-desc">{product.description}</div>

                      <div className="prod-price-row">
                        <span className="prod-price">₹{Number(product.price).toFixed(2)}</span>
                        <span className={`prod-stock ${
                          outOfStock ? 'prod-stock-out' :
                          product.stock <= 10 ? 'prod-stock-low' :
                          'prod-stock-ok'
                        }`}>
                          {outOfStock ? 'Sold out' : product.stock <= 10 ? `${product.stock} left` : 'In stock'}
                        </span>
                      </div>

                      <button
                        className={`prod-btn ${btnDisabled ? 'prod-btn-disabled' : 'prod-btn-active'}`}
                        onClick={() => handleAddToCart(product.id)}
                        disabled={btnDisabled}
                      >
                        <ShoppingCart size={13} />
                        {isAdding ? 'Adding…' :
                         !isAuthenticated ? 'Sign in to order' :
                         outOfStock ? 'Out of stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sign-in CTA */}
          {!isAuthenticated && !loadingProducts && (
            <div className="prod-cta">
              <div className="prod-cta-glow" />
              <div className="prod-cta-title">Ready to <em>Order?</em></div>
              <p className="prod-cta-sub">Sign in to add items to your cart and place orders</p>
              <button
                className="prod-cta-btn"
                onClick={() => {
                  const trigger = document.querySelector('[data-auth-trigger]') as HTMLElement | null;
                  trigger?.click();
                }}
              >
                <span className="prod-cta-dot" />
                Sign In Now
                <span className="prod-cta-dot" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}