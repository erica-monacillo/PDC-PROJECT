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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Poppins:wght@300;400;500;600&display=swap');

        .cart-backdrop {
          position: fixed;
          inset: 0;
          z-index: 999;

          background: rgba(0,0,0,0);

          backdrop-filter: blur(0px);

          transition:
            background 0.4s ease,
            backdrop-filter 0.4s ease;

          pointer-events: none;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 20px;
        }

        .cart-backdrop.open {
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(6px);
          pointer-events: all;
        }

        /* CENTER MODAL */
        .cart-panel {
          position: relative;

          width: 100%;
          max-width: 760px;

          max-height: 88vh;

          display: flex;
          flex-direction: column;

          background: rgba(255,248,240,0.95);

          backdrop-filter: blur(32px) saturate(160%);
          -webkit-backdrop-filter: blur(32px) saturate(160%);

          border: 1px solid rgba(255,153,51,0.2);

          border-radius: 24px;

          box-shadow:
            0 24px 80px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.6);

          overflow: hidden;

          opacity: 0;
          transform: scale(0.92) translateY(20px);

          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);

          pointer-events: none;
        }

        .cart-panel.open {
          opacity: 1;
          transform: scale(1) translateY(0);
          pointer-events: all;
        }

        .cart-shimmer {
          position: absolute;
          top: 0;
          left: 10%;
          right: 10%;
          height: 1px;

          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,153,51,0.5),
            transparent
          );

          pointer-events: none;
        }

        /* Header */
        .cart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 24px 24px 20px;

          border-bottom: 1px solid rgba(255,153,51,0.15);

          flex-shrink: 0;
        }

        .cart-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cart-header-icon {
          width: 40px;
          height: 40px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background: rgba(255,153,51,0.12);
          border: 1px solid rgba(255,153,51,0.3);

          color: rgba(255,153,51,0.9);
        }

        .cart-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;

          color: #1a3a3a;

          letter-spacing: 0.02em;
        }

        .cart-subtitle {
          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 400;

          letter-spacing: 0.15em;
          text-transform: uppercase;

          color: rgba(26, 58, 58, 0.6);

          margin-top: 2px;
        }

        .cart-close {
          width: 36px;
          height: 36px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          border: 1px solid rgba(255,153,51,0.2);

          background: rgba(255,153,51,0.08);

          color: rgba(255,153,51,0.7);

          cursor: pointer;

          transition: all 0.25s ease;
        }

        .cart-close:hover {
          background: rgba(255,153,51,0.15);
          color: rgba(255,153,51,0.9);
          border-color: rgba(255,153,51,0.35);
        }

        /* Body */
        .cart-body {
          flex: 1;
          overflow-y: auto;

          padding: 20px 24px;

          scrollbar-width: thin;
          scrollbar-color: rgba(255,153,51,0.2) transparent;
        }

        .cart-body::-webkit-scrollbar {
          width: 4px;
        }

        .cart-body::-webkit-scrollbar-track {
          background: transparent;
        }

        .cart-body::-webkit-scrollbar-thumb {
          background: rgba(255,153,51,0.2);
          border-radius: 4px;
        }

        /* Empty State */
        .cart-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          padding: 60px 24px;

          gap: 12px;

          text-align: center;
        }

        .cart-state-icon {
          width: 56px;
          height: 56px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 18px;

          background: rgba(255,153,51,0.12);
          border: 1px solid rgba(255,153,51,0.25);

          color: rgba(255,153,51,0.6);

          margin-bottom: 8px;
        }

        .cart-state-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;

          color: rgba(26, 58, 58, 0.8);
        }

        .cart-state-sub {
          font-family: 'Poppins', sans-serif;
          font-size: 12px;
          font-weight: 400;

          letter-spacing: 0.01em;

          color: rgba(26, 58, 58, 0.6);

          line-height: 1.7;
        }

        /* Cart Item */
        .cart-item {
          display: flex;
          align-items: center;
          gap: 14px;

          padding: 18px;

          background: rgba(255,237,180,0.35);

          border: 1px solid rgba(255,153,51,0.2);

          border-radius: 18px;

          margin-bottom: 14px;

          transition:
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .cart-item:hover {
          border-color: rgba(255,153,51,0.35);
          box-shadow: 0 8px 24px rgba(255,153,51,0.1);
        }

        .cart-item-emoji {
          width: 52px;
          height: 52px;

          flex-shrink: 0;

          background: rgba(255,153,51,0.1);

          border: 1px solid rgba(255,153,51,0.2);

          border-radius: 14px;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 24px;
        }

        .cart-item-info {
          flex: 1;
          min-width: 0;
        }

        .cart-item-name {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 500;

          letter-spacing: 0.02em;

          color: #1a3a3a;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cart-item-price {
          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 400;

          letter-spacing: 0.1em;

          color: rgba(255,153,51,0.8);

          margin-top: 4px;
        }

        /* Qty */
        .cart-qty {
          display: flex;
          align-items: center;
          gap: 8px;

          flex-shrink: 0;
        }

        .cart-qty-btn {
          width: 30px;
          height: 30px;

          border-radius: 8px;

          background: rgba(255,153,51,0.08);

          border: 1px solid rgba(255,153,51,0.18);

          color: rgba(255,153,51,0.8);

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;

          transition: all 0.2s ease;
        }

        .cart-qty-btn:hover:not(:disabled) {
          background: rgba(255,153,51,0.16);
          border-color: rgba(255,153,51,0.35);
          color: rgba(255,153,51,1);
        }

        .cart-qty-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .cart-qty-num {
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 500;

          color: #1a3a3a;

          min-width: 20px;

          text-align: center;
        }

        .cart-item-total {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;

          color: rgba(255,153,51,0.95);

          flex-shrink: 0;
        }

        .cart-remove {
          background: none;
          border: none;

          cursor: pointer;

          color: rgba(239,68,68,0.6);

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 6px;

          border-radius: 8px;

          transition: all 0.2s ease;

          flex-shrink: 0;
        }

        .cart-remove:hover:not(:disabled) {
          color: rgba(239,68,68,0.9);
          background: rgba(239,68,68,0.1);
        }

        .cart-remove:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Footer */
        .cart-footer {
          flex-shrink: 0;

          border-top: 1px solid rgba(255,153,51,0.12);

          padding: 20px 24px;
        }

        .cart-total-row {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-bottom: 18px;
        }

        .cart-total-label {
          font-family: 'Poppins', sans-serif;
          font-size: 10px;
          font-weight: 500;

          letter-spacing: 0.25em;
          text-transform: uppercase;

          color: rgba(26,58,58,0.5);
        }

        .cart-total-amount {
          font-family: 'Playfair Display', serif;
          font-size: 1.9rem;
          font-weight: 700;

          color: rgba(255,153,51,0.95);
        }

        .cart-footer-btns {
          display: flex;
          gap: 10px;
        }

        .cart-btn-clear {
          flex: 1;

          padding: 13px;

          border-radius: 12px;

          background: rgba(255,153,51,0.08);

          border: 1px solid rgba(255,153,51,0.15);

          color: rgba(26,58,58,0.7);

          font-family: 'Poppins', sans-serif;
          font-size: 10px;
          font-weight: 500;

          letter-spacing: 0.18em;
          text-transform: uppercase;

          cursor: pointer;

          transition: all 0.25s ease;
        }

        .cart-btn-clear:hover:not(:disabled) {
          background: rgba(255,153,51,0.15);
          border-color: rgba(255,153,51,0.35);
        }

        .cart-btn-clear:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .cart-btn-checkout {
          flex: 2;

          padding: 13px;

          border-radius: 12px;

          background: rgba(255,153,51,0.12);

          border: 1px solid rgba(255,153,51,0.3);

          color: rgba(255,153,51,0.95);

          font-family: 'Poppins', sans-serif;
          font-size: 10px;
          font-weight: 500;

          letter-spacing: 0.2em;
          text-transform: uppercase;

          cursor: pointer;

          transition: all 0.3s ease;
        }

        .cart-btn-checkout:hover:not(:disabled) {
          background: rgba(255,153,51,0.2);
          border-color: rgba(255,153,51,0.5);

          box-shadow: 0 0 24px rgba(255,153,51,0.16);
        }

        .cart-btn-checkout:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .cart-panel {
            width: 100%;
            max-width: 100%;
            max-height: 92vh;

            border-radius: 22px;
          }

          .cart-item {
            flex-wrap: wrap;
          }

          .cart-item-total {
            width: 100%;
            margin-left: 66px;
          }

          .cart-footer-btns {
            flex-direction: column;
          }
        }
      `}</style>

      {/* BACKDROP */}
      <div
        className={`cart-backdrop${isOpen ? ' open' : ''}`}
        onClick={onClose}
      >
        {/* MODAL */}
        <div
          className={`cart-panel${isOpen ? ' open' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="cart-shimmer" />

          {/* Header */}
          <div className="cart-header">
            <div className="cart-header-left">
              <div className="cart-header-icon">
                <ShoppingCart size={18} />
              </div>

              <div>
                <div className="cart-title">
                  Your Cart
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
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="cart-body">
            {!isAuthenticated ? (
              <div className="cart-state">
                <div className="cart-state-icon">
                  <ShoppingCart size={22} />
                </div>

                <div className="cart-state-title">
                  Sign in to view your cart
                </div>

                <div className="cart-state-sub">
                  Your selections will be saved
                  <br />
                  once you're signed in.
                </div>
              </div>
            ) : cart.items.length === 0 ? (
              <div className="cart-state">
                <div className="cart-state-icon">
                  <ShoppingCart size={22} />
                </div>

                <div className="cart-state-title">
                  Your cart is empty
                </div>

                <div className="cart-state-sub">
                  Add some delicious sweets
                  <br />
                  to get started.
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
                      <Minus size={12} />
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
                      <Plus size={12} />
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
                    <Trash2 size={15} />
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
                    Clear
                  </button>

                  <button
                    className="cart-btn-checkout"
                    onClick={() =>
                      setShowCheckout(true)
                    }
                    disabled={loading}
                  >
                    Proceed to Checkout
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