import { io } from 'socket.io-client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const API = import.meta.env.VITE_API_URL || 'https://pdc-project.onrender.com';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Cart {
  items: CartItem[];
  total: number;
}

interface CartContextType {
  cart: Cart;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<void>;
  loading: boolean;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  // Load cart when user logs in
  useEffect(() => {
    if (isAuthenticated && token) {
      loadCart();
    } else {
      setCart({ items: [], total: 0 });
    }
  }, [isAuthenticated, token]);

  // Real-time cart updates via Socket.IO
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const socket = io(API);
    socket.emit('authenticate', token);

    socket.on('cart-updated', (updatedCart: Cart) => {
      setCart(updatedCart);
    });

    return () => { socket.disconnect(); };
  }, [isAuthenticated, token]);

  const loadCart = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add to cart');
      }
      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update cart');
      }
      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    await updateQuantity(productId, 0);
  };

  const clearCart = async () => {
    if (!token) return;
    setLoading(true);
    try {
      await fetch(`${API}/api/cart`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart({ items: [], total: 0 });
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkout = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Checkout failed');
      }
      const result = await response.json();
      setCart({ items: [], total: 0 });
      return result.order;
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, checkout, loading, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
}
