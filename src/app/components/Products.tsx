import React, { useState } from 'react';
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

const productsData: Product[] = [
  {
    id: '1',
    name: 'Gulab Jamun',
    price: 120,
    description: 'Soft milk-solid balls soaked in rose sugar syrup.',
    category: 'traditional',
    image:
    'https://www.cadburydessertscorner.com/hs-fs/hubfs/dc-website-2022/articles/soft-gulab-jamun-recipe-for-raksha-bandhan-from-dough-to-syrup-all-you-need-to-know/soft-gulab-jamun-recipe-for-raksha-bandhan-from-dough-to-syrup-all-you-need-to-know.webp?width=1920&height=464&name=soft-gulab-jamun-recipe-for-raksha-bandhan-from-dough-to-syrup-all-you-need-to-know.webp',
    stock: 25,
  },
  {
    id: '2',
    name: 'Rasgulla',
    price: 140,
    description: 'Spongy Bengali sweet made from fresh chenna.',
    category: 'snacks',
    image:
      'https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?w=500&q=80',
    stock: 18,
  },
  {
    id: '3',
    name: 'Kaju Katli',
    price: 220,
    description: 'Premium cashew fudge topped with silver leaf.',
    category: 'traditional',
    image:
      'https://rashmisweets.in/wp-content/uploads/2024/07/Kaju-Katli.png',
    stock: 15,
  },
  {
    id: '4',
    name: 'Motichoor Laddu',
    price: 160,
    description: 'Traditional festive laddus made with fine boondi.',
    category: 'sweets',
    image:
    'https://www.cookwithkushi.com/wp-content/uploads/2022/10/best_motichur_laddu_motichoor_ladoo_recipe.jpg',
    stock: 30,
  },
  {
    id: '5',
    name: 'Jalebi',
    price: 100,
    description: 'Crispy spiral sweets dipped in saffron syrup.',
    category: 'traditional',
    image:
    'https://i0.wp.com/binjalsvegkitchen.com/wp-content/uploads/2023/10/Instant-Jalebi-H1.jpg?fit=600%2C904&ssl=1',
    stock: 20,
  },
  {
    id: '6',
    name: 'Milk Cake',
    price: 180,
    description: 'Rich and creamy milk-based Indian dessert.',
    category: 'Cakes',
    image:
      'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500&q=80',
    stock: 12,
  },
  {
    id: '7',
    name: 'Chocolate Pastry',
    price: 90,
    description: 'Fresh chocolate layered pastry topped with cream.',
    category: 'pastries',
    image:
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&q=80',
    stock: 14,
  },
  {
    id: '8',
    name: 'Black Forest Cake',
    price: 650,
    description: 'Classic chocolate cake with cherries and cream.',
    category: 'cakes',
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
    stock: 8,
  },
  {
    id: '9',
    name: 'Pineapple Cake',
    price: 580,
    description: 'Light vanilla sponge with pineapple filling.',
    category: 'cakes',
    image:
      'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=500&q=80',
    stock: 10,
  },
  {
    id: '10',
    name: 'Samosa',
    price: 40,
    description: 'Crispy pastry stuffed with spicy potato filling.',
    category: 'snacks',
    image:
    'https://www.finedininglovers.com/sites/default/files/2026-02/vegetable-samosa.jpg',
    stock: 35,
  },
];

export function Products() {
  const { isAuthenticated } = useAuth();
  const { addToCart, loading } = useCart();

  const [selectedCategory, setSelectedCategory] =
    useState('all');

  const [addingId, setAddingId] = useState<string | null>(
    null
  );

  const categories = [
    'all',
    ...Array.from(
      new Set(productsData.map((p) => p.category))
    ),
  ];

  const filteredProducts =
    selectedCategory === 'all'
      ? productsData
      : productsData.filter(
          (p) => p.category === selectedCategory
        );

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background: #fff;
        }

        .products-section {
          padding: 80px 20px;
          background: #fffdf9;
        }

        .products-container {
          max-width: 1200px;
          margin: auto;
        }

        .products-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .products-title {
          font-size: 42px;
          font-weight: 700;
          color: #222;
          margin-bottom: 10px;
        }

        .products-subtitle {
          color: #777;
          font-size: 15px;
        }

        .category-filters {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-bottom: 40px;
        }

        .filter-btn {
          border: none;
          background: #fff;
          border: 1px solid #eee;
          padding: 10px 18px;
          border-radius: 999px;
          cursor: pointer;
          font-size: 13px;
          transition: 0.3s ease;
        }

        .filter-btn.active,
        .filter-btn:hover {
          background: #f59e0b;
          color: white;
          border-color: #f59e0b;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(260px,1fr));
          gap: 24px;
        }

        .product-card {
          background: white;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid #f2f2f2;
          transition: 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
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
        }

        .category-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: white;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 11px;
          text-transform: capitalize;
        }

        .rating-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: white;
          padding: 6px 10px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
        }

        .product-body {
          padding: 18px;
        }

        .product-name {
          font-size: 20px;
          font-weight: 600;
          color: #222;
          margin-bottom: 8px;
        }

        .product-description {
          font-size: 13px;
          color: #666;
          line-height: 1.7;
          margin-bottom: 18px;
        }

        .product-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .product-price {
          font-size: 24px;
          font-weight: 700;
          color: #f59e0b;
        }

        .stock-badge {
          font-size: 11px;
          padding: 6px 10px;
          border-radius: 999px;
          background: #ecfdf5;
          color: #047857;
        }

        .low-stock {
          background: #fef3c7;
          color: #92400e;
        }

        .out-stock {
          background: #fee2e2;
          color: #b91c1c;
        }

        .cart-btn {
          width: 100%;
          border: none;
          background: #f59e0b;
          color: white;
          padding: 13px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: 0.3s ease;
        }

        .cart-btn:hover:not(:disabled) {
          background: #d97706;
        }

        .cart-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .signin-box {
          margin-top: 60px;
          text-align: center;
          background: white;
          border-radius: 20px;
          padding: 40px 20px;
          border: 1px solid #f2f2f2;
        }

        .signin-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .signin-text {
          color: #777;
          margin-bottom: 24px;
        }

        .signin-btn {
          border: none;
          background: #f59e0b;
          color: white;
          padding: 14px 28px;
          border-radius: 999px;
          cursor: pointer;
          font-size: 14px;
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
          <div className="products-header">
            <h2 className="products-title">
              Indian Sweets & Bakery
            </h2>

            <p className="products-subtitle">
              Traditional Indian sweets freshly made every
              day.
            </p>
          </div>

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
                {cat}
              </button>
            ))}
          </div>

          <div className="products-grid">
            {filteredProducts.map((product) => {
              const isAdding =
                addingId === product.id;

              const outOfStock =
                product.stock === 0;

              return (
                <div
                  key={product.id}
                  className="product-card"
                >
                  <div className="product-image-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
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
                      4.9
                    </span>
                  </div>

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
                        {product.price.toFixed(2)}
                      </span>

                      <span
                        className={`stock-badge ${
                          outOfStock
                            ? 'out-stock'
                            : product.stock <= 10
                            ? 'low-stock'
                            : ''
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
                      disabled={
                        loading ||
                        outOfStock ||
                        isAdding
                      }
                      onClick={() =>
                        handleAddToCart(product.id)
                      }
                    >
                      <ShoppingCart size={16} />

                      {isAdding
                        ? 'Adding...'
                        : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {!isAuthenticated && (
            <div className="signin-box">
              <h3 className="signin-title">
                Ready to Order?
              </h3>

              <p className="signin-text">
                Sign in to add products to your cart.
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
                Sign In
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}