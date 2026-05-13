import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
} from 'lucide-react';

import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { CheckoutForm } from './CheckoutForm';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Cart({ isOpen, onClose }: CartProps) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loading,
    itemCount,
  } = useCart();

  const { isAuthenticated } = useAuth();

  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOrderPlaced = () => {
    onClose();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * {
          font-family: 'Inter', sans-serif;
        }

        .cart-backdrop {
          position: fixed;
          inset: 0;
          z-index: 999;

          background: rgba(0, 0, 0, 0.3);

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 16px;

          opacity: 0;
          pointer-events: none;

          transition: 0.25s ease;
        }

        .cart-backdrop.open {
          opacity: 1;
          pointer-events: all;
        }

        .cart-panel {
          width: 100%;
          max-width: 700px;
          max-height: 90vh;

          background: #ffffff;

          border-radius: 20px;

          border: 1px solid #e5e7eb;

          display: flex;
          flex-direction: column;

          overflow: hidden;

          transform: translateY(15px);
          opacity: 0;

          transition: 0.25s ease;
        }

        .cart-panel.open {
          transform: translateY(0);
          opacity: 1;
        }

        /* Header */

        .cart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 20px 24px;

          border-bottom: 1px solid #f1f5f9;
        }

        .cart-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cart-header-icon {
          width: 42px;
          height: 42px;

          border-radius: 12px;

          background: #f3f4f6;

          display: flex;
          align-items: center;
          justify-content: center;

          color: #f59e0b;
        }

        .cart-title {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
        }

        .cart-subtitle {
          font-size: 13px;
          color: #6b7280;
          margin-top: 2px;
        }

        .cart-close {
          width: 38px;
          height: 38px;

          border: none;
          border-radius: 10px;

          background: #f3f4f6;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;

          color: #374151;

          transition: 0.2s ease;
        }

        .cart-close:hover {
          background: #e5e7eb;
        }

        /* Body */

        .cart-body {
          flex: 1;

          overflow-y: auto;

          padding: 20px;
          background: #fafafa;
        }

        .cart-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          text-align: center;

          padding: 70px 20px;
        }

        .cart-state-icon {
          width: 70px;
          height: 70px;

          border-radius: 18px;

          background: #f3f4f6;

          display: flex;
          align-items: center;
          justify-content: center;

          color: #f59e0b;

          margin-bottom: 18px;
        }

        .cart-state-title {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }

        .cart-state-sub {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
        }

        /* Cart Item */

        .cart-item {
          display: flex;
          align-items: center;
          gap: 16px;

          background: #ffffff;

          border: 1px solid #ececec;

          border-radius: 16px;

          padding: 16px;

          margin-bottom: 14px;
        }

        .cart-item-emoji {
          width: 56px;
          height: 56px;

          border-radius: 14px;

          background: #fff7ed;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 24px;

          flex-shrink: 0;
        }

        .cart-item-info {
          flex: 1;
          min-width: 0;
        }

        .cart-item-name {
          font-size: 15px;
          font-weight: 600;
          color: #111827;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cart-item-price {
          margin-top: 4px;

          font-size: 13px;
          color: #6b7280;
        }

        /* Quantity */

        .cart-qty {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cart-qty-btn {
          width: 30px;
          height: 30px;

          border: 1px solid #e5e7eb;
          border-radius: 8px;

          background: #ffffff;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;

          transition: 0.2s ease;
        }

        .cart-qty-btn:hover:not(:disabled) {
          background: #f3f4f6;
        }

        .cart-qty-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .cart-qty-num {
          min-width: 20px;
          text-align: center;

          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        .cart-item-total {
          font-size: 16px;
          font-weight: 700;
          color: #f59e0b;

          min-width: 80px;
          text-align: right;
        }

        .cart-remove {
          border: none;
          background: transparent;

          color: #ef4444;

          width: 34px;
          height: 34px;

          border-radius: 8px;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;

          transition: 0.2s ease;
        }

        .cart-remove:hover:not(:disabled) {
          background: #fef2f2;
        }

        /* Footer */

        .cart-footer {
          border-top: 1px solid #f1f5f9;

          background: #ffffff;

          padding: 20px 24px;
        }

        .cart-total-row {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 18px;
        }

        .cart-total-label {
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
        }

        .cart-total-amount {
          font-size: 28px;
          font-weight: 700;
          color: #111827;
        }

        .cart-footer-btns {
          display: flex;
          gap: 12px;
        }

        .cart-btn-clear,
        .cart-btn-checkout {
          flex: 1;

          border: none;
          border-radius: 12px;

          padding: 14px;

          font-size: 14px;
          font-weight: 600;

          cursor: pointer;

          transition: 0.2s ease;
        }

        .cart-btn-clear {
          background: #f3f4f6;
          color: #374151;
        }

        .cart-btn-clear:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .cart-btn-checkout {
          background: #f59e0b;
          color: white;
        }

        .cart-btn-checkout:hover:not(:disabled) {
          background: #d97706;
        }

        .cart-btn-clear:disabled,
        .cart-btn-checkout:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .cart-panel {
            max-width: 100%;
            border-radius: 18px;
          }

          .cart-item {
            flex-wrap: wrap;
          }

          .cart-item-total {
            width: 100%;
            text-align: left;
            margin-left: 72px;
          }

          .cart-footer-btns {
            flex-direction: column;
          }
        }
      `}</style>

      <div
        className={`cart-backdrop${isOpen ? ' open' : ''}`}
        onClick={onClose}
      >
        <div
          className={`cart-panel${isOpen ? ' open' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="cart-header">
            <div className="cart-header-left">
              <div className="cart-header-icon">
                <ShoppingCart size={20} />
              </div>

              <div>
                <div className="cart-title">
                  Shopping Cart
                </div>

                <div className="cart-subtitle">
                  {itemCount} item
                  {itemCount !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            <button
              className="cart-close"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="cart-body">
            {!isAuthenticated ? (
              <div className="cart-state">
                <div className="cart-state-icon">
                  <ShoppingCart size={28} />
                </div>

                <div className="cart-state-title">
                  Please sign in
                </div>

                <div className="cart-state-sub">
                  Login to view and manage your cart.
                </div>
              </div>
            ) : cart.items.length === 0 ? (
              <div className="cart-state">
                <div className="cart-state-icon">
                  <ShoppingCart size={28} />
                </div>

                <div className="cart-state-title">
                  Your cart is empty
                </div>

                <div className="cart-state-sub">
                  Add your favorite sweets to begin.
                </div>
              </div>
            ) : (
              cart.items.map(item => (
                <div
                  key={item.productId}
                  className="cart-item"
                >
                  <div className="cart-item-emoji">
                    🍰
                  </div>

                  <div className="cart-item-info">
                    <div className="cart-item-name">
                      {item.name}
                    </div>

                    <div className="cart-item-price">
                      ₹
                      {parseFloat(
                        String(item.price)
                      ).toFixed(2)}
                      {' '}each
                    </div>
                  </div>

                  <div className="cart-qty">
                    <button
                      className="cart-qty-btn"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.quantity - 1
                        )
                      }
                      disabled={loading}
                    >
                      <Minus size={14} />
                    </button>

                    <span className="cart-qty-num">
                      {item.quantity}
                    </span>

                    <button
                      className="cart-qty-btn"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.quantity + 1
                        )
                      }
                      disabled={loading}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="cart-item-total">
                    ₹
                    {(
                      parseFloat(String(item.price)) *
                      item.quantity
                    ).toFixed(2)}
                  </div>

                  <button
                    className="cart-remove"
                    onClick={() =>
                      removeFromCart(item.productId)
                    }
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {isAuthenticated &&
            cart.items.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total-row">
                  <span className="cart-total-label">
                    Total
                  </span>

                  <span className="cart-total-amount">
                    ₹
                    {parseFloat(
                      String(cart.total)
                    ).toFixed(2)}
                  </span>
                </div>

                <div className="cart-footer-btns">
                  <button
                    className="cart-btn-clear"
                    onClick={clearCart}
                    disabled={loading}
                  >
                    Clear Cart
                  </button>

                  <button
                    className="cart-btn-checkout"
                    onClick={() =>
                      setShowCheckout(true)
                    }
                    disabled={loading}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>

      <CheckoutForm
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onOrderPlaced={handleOrderPlaced}
      />
    </>
  );
}