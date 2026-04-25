import React, { useState, useEffect } from 'react';
import { Plus, ShoppingCart, Star } from 'lucide-react';
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

export function Products() {
  const { isAuthenticated } = useAuth();
  const { addToCart, loading } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('https://pdc-project.onrender.com/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
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
      await addToCart(productId);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to add to cart');
    }
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  if (loadingProducts) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading delicious treats...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="products" className="py-16 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Sweet Delights</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handcrafted sweets made with traditional recipes and the finest ingredients
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                selectedCategory === category
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <div className="h-48 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <span className="text-6xl">
                  {product.category === 'cakes' ? '🍰' :
                   product.category === 'pastries' ? '🥐' :
                   product.category === 'traditional' ? '🪔' : '🍬'}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">4.8</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-amber-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className={`text-sm font-semibold ${
                    product.stock > 10 ? 'text-green-600' :
                    product.stock > 0 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={loading || product.stock === 0 || !isAuthenticated}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {loading ? 'Adding...' :
                   !isAuthenticated ? 'Sign in to order' :
                   product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        )}

        {/* Call to Action */}
        {!isAuthenticated && (
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Order?</h3>
              <p className="text-lg mb-6 opacity-90">
                Sign in to add items to your cart and place orders
              </p>
              <button
                onClick={() => document.querySelector('[data-auth-trigger]')?.click()}
                className="bg-white text-amber-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                Sign In Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
