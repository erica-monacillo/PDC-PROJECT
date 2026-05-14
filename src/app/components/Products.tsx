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
  cakes: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3kDfAuALuqxFflVx8qqihakGyMA0YLx3PgA&s=80',
  pastries: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3kDfAuALuqxFflVx8qqihakGyMA0YLx3PgA&s=80',
  traditional: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3kDfAuALuqxFflVx8qqihakGyMA0YLx3PgA&s=80',
  default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3kDfAuALuqxFflVx8qqihakGyMA0YLx3PgA&s=80',
};

export function Products() {
  const { isAuthenticated } = useAuth();
  const { addToCart, loading } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetch('https://pdc-project.onrender.com/api/products');
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

  const categories: string[] = [
    'all',
    ...(Array.from(new Set(products.map((p: any) => p.category))) as string[]),
  ];

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter(p => p.category === selectedCategory);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond&family=Poppins:wght@300;400;500;600&family=Lora&display=swap');

        .prod-section {
          position: relative;
          padding: 120px 24px;
          background: rgba(245,235,225,0.6);
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
        }

        .prod-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 1100px) {
          .prod-grid { grid-template-columns: repeat(3,1fr); }
        }

        @media (max-width: 750px) {
          .prod-grid { grid-template-columns: repeat(2,1fr); }
        }

        @media (max-width: 480px) {
          .prod-grid { grid-template-columns: 1fr; }
        }

        .prod-card {
          border-radius: 24px;
          background: rgba(255,237,180,0.35);
          border: 1px solid rgba(251,191,36,0.25);
          overflow: hidden;
          transition: 0.3s;
        }

        .prod-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .prod-img {
          height: 180px;
        }

        .prod-img-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .prod-body {
          padding: 20px;
        }

        .prod-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          gap: 8px;
          background: #f59e0b;
          color: white;
        }

        .prod-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <div className="prod-section">

        {/* GRID */}
        <div className="prod-grid">
          {filteredProducts.map(product => {
            const isAdding = addingId === product.id;
            const outOfStock = product.stock === 0;
            const btnDisabled = loading || outOfStock || !isAuthenticated || isAdding;

            return (
              <div key={product.id} className="prod-card">

                <div className="prod-img">
                  <img
                    src={product.image || unsplashFallback[product.category] || unsplashFallback.default}
                    alt={product.name}
                    className="prod-img-photo"
                  />
                </div>

                <div className="prod-body">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>

                  <p>₹{Number(product.price).toFixed(2)}</p>

                  <button
                    className="prod-btn"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={btnDisabled}
                  >
                    <ShoppingCart size={14} />
                    {isAdding ? 'Adding...' : 'Add to Cart'}
                  </button>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}