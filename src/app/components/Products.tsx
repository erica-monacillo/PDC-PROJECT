import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
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
  cakes:
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80',
  pastries:
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80',
  traditional:
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80',
  default:
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&q=80',
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
      const res = await fetch(
        'https://pdc-project.onrender.com/api/products'
      );

      if (res.ok) {
        setProducts(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated) {
      alert('Please sign in first');
      return;
    }

    try {
      setAddingId(productId);
      await addToCart(productId);
    } catch (e) {
      console.error(e);
    } finally {
      setAddingId(null);
    }
  };

  const categories = [
    'all',
    ...(Array.from(
      new Set(products.map((p) => p.category))
    ) as string[]),
  ];

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter(
          (p) => p.category === selectedCategory
        );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

        .products-section {
          padding: 90px 20px;
          background: #fffdf8;
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
        }

        .products-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .products-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .products-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 600;
          color: #222;
          margin-bottom: 10px;
        }

        .products-subtitle {
          font-size: 15px;
          color: #777;
        }

        .category-filters {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-bottom: 40px;
        }

        .filter-btn {
          padding: 10px 18px;
          border-radius: 999px;
          border: 1px solid #f1e8dc;
          background: white;
          color: #555;
          cursor: pointer;
          font-size: 13px;
          transition: 0.3s ease;
        }

        .filter-btn:hover,
        .filter-btn.active {
          background: #f59e0b;
          color: white;
          border-color: #f59e0b;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        @media (max-width: 1100px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 500px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
        }

        .product-card {
          background: white;
          border: 1px solid #f1e8dc;
          border-radius: 18px;
          overflow: hidden;
          transition: 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }

        .product-image-wrapper {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: 0.4s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.04);
        }

        .category-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: white;
          padding: 5px 10px;
          border-radius: 999px;
          font-size: 11px;
          color: #555;
        }

        .rating-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          background: white;
          padding: 5px 10px;
          border-radius: 999px;
          font-size: 11px;
          color: #555;
        }

        .product-body {
          padding: 18px;
        }

        .product-name {
          font-size: 18px;
          font-weight: 600;
          color: #222;
          margin-bottom: 8px;
        }

        .product-description {
          font-size: 13px;
          color: #666;
          line-height: 1.7;
          margin-bottom: 16px;
        }

        .product-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .product-price {
          font-size: 22px;
          font-weight: 600;
          color: #f59e0b;
        }

        .stock-badge {
          padding: 5px 10px;
          border-radius: 999px;
          font-size: 11px;
        }

        .in-stock {
          background: #ecfdf5;
          color: #047857;
        }

        .low-stock {
          background: #fffbeb;
          color: #b45309;
        }

        .out-stock {
          background: #fef2f2;
          color: #b91c1c;
        }

        .cart-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 12px;
          background: #f59e0b;
          color: white;
          font-size: 13px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .cart-btn:hover:not(:disabled) {
          background: #d97706;
        }

        .cart-btn:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        .loading-wrapper,
        .empty-wrapper {
          text-align: center;
          padding: 80px 20px;
          color: #777;
        }

        .signin-box {
          margin-top: 60px;
          background: white;
          border: 1px solid #f1e8dc;
          border-radius: 20px;
          padding: 40px 20px;
          text-align: center;
        }

        .signin-title {
          font-size: 28px;
          font-weight: 600;
          color: #222;
          margin-bottom: 10px;
        }

        .signin-text {
          font-size: 14px;
          color: #777;
          margin-bottom: 24px;
        }

        .signin-btn {
          padding: 14px 28px;
          border-radius: 999px;
          border: none;
          background: #f59e0b;
          color: white;
          font-size: 14px;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .signin-btn:hover {
          background: #d97706;
        }
      `}</style>

      <section
        id="products"
        className="products-section"
      >
        <div className="products-container">

          {/* Header */}
          <div className="products-header">
            <h2 className="products-title">
              Our Sweet Delights
            </h2>

            <p className="products-subtitle">
              Freshly prepared sweets and bakery favorites.
            </p>
          </div>

          {/* Filters */}
          <div className="category-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${
                  selectedCategory === cat
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  setSelectedCategory(cat)
                }
              >
                {cat.charAt(0).toUpperCase() +
                  cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loadingProducts ? (
            <div className="loading-wrapper">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-wrapper">
              No products found.
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => {
                const isAdding =
                  addingId === product.id;

                const outOfStock =
                  product.stock === 0;

                const btnDisabled =
                  loading ||
                  outOfStock ||
                  !isAuthenticated ||
                  isAdding;

                return (
                  <div
                    key={product.id}
                    className="product-card"
                  >
                    {/* Image */}
                    <div className="product-image-wrapper">
                      <img
                        src={
                          product.image ||
                          unsplashFallback[
                            product.category
                          ] ||
                          unsplashFallback.default
                        }
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                          (
                            e.target as HTMLImageElement
                          ).src =
                            unsplashFallback[
                              product.category
                            ] ||
                            unsplashFallback.default;
                        }}
                      />

                      <span className="category-badge">
                        {product.category}
                      </span>

                      <span className="rating-badge">
                        <Star
                          size={12}
                          fill="#f59e0b"
                          color="#f59e0b"
                        />
                        4.8
                      </span>
                    </div>

                    {/* Body */}
                    <div className="product-body">
                      <div className="product-name">
                        {product.name}
                      </div>

                      <div className="product-description">
                        {product.description}
                      </div>

                      <div className="product-row">
                        <span className="product-price">
                          ₹
                          {Number(
                            product.price
                          ).toFixed(2)}
                        </span>

                        <span
                          className={`stock-badge ${
                            outOfStock
                              ? 'out-stock'
                              : product.stock <= 10
                              ? 'low-stock'
                              : 'in-stock'
                          }`}
                        >
                          {outOfStock
                            ? 'Sold Out'
                            : product.stock <= 10
                            ? `${product.stock} left`
                            : 'In Stock'}
                        </span>
                      </div>

                      <button
                        className="cart-btn"
                        disabled={btnDisabled}
                        onClick={() =>
                          handleAddToCart(
                            product.id
                          )
                        }
                      >
                        <ShoppingCart size={15} />

                        {isAdding
                          ? 'Adding...'
                          : !isAuthenticated
                          ? 'Sign In to Order'
                          : outOfStock
                          ? 'Out of Stock'
                          : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sign In CTA */}
          {!isAuthenticated &&
            !loadingProducts && (
              <div className="signin-box">
                <h3 className="signin-title">
                  Ready to Order?
                </h3>

                <p className="signin-text">
                  Sign in to add items to your
                  cart and place orders.
                </p>

                <button
                  className="signin-btn"
                  onClick={() => {
                    const trigger =
                      document.querySelector(
                        '[data-auth-trigger]'
                      ) as HTMLElement | null;

                    trigger?.click();
                  }}
                >
                  Sign In Now
                </button>
              </div>
            )}
        </div>
      </section>
    </>
  );
}