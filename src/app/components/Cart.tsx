import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { CheckoutForm } from './CheckoutForm';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Cart({ isOpen, onClose }: CartProps) {
  const { cart, updateQuantity, removeFromCart, clearCart, loading, itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleOrderPlaced = () => {
    onClose();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Josefin+Sans:wght@200;300;400&display=swap');

        .cart-backdrop {
          position: fixed; inset: 0; z-index: 60;
          background: rgba(0,0,0,0);
          backdrop-filter: blur(0px);
          transition: background 0.4s ease, backdrop-filter 0.4s ease;
          pointer-events: none;
        }
        .cart-backdrop.open {
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(6px);
          pointer-events: all;
        }

        .cart-panel {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: 100%; max-width: 480px; z-index: 61;
          display: flex; flex-direction: column;
          background: rgba(6,5,10,0.82);
          backdrop-filter: blur(32px) saturate(160%);
          -webkit-backdrop-filter: blur(32px) saturate(160%);
          border-left: 1px solid rgba(255,255,255,0.08);
          box-shadow: -24px 0 80px rgba(0,0,0,0.6), inset 1px 0 0 rgba(255,255,255,0.04);
          transform: translateX(100%);
          transition: transform 0.45s cubic-bezier(0.4,0,0.2,1);
        }
        .cart-panel.open { transform: translateX(0); }

        .cart-shimmer {
          position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(245,158,11,0.45), transparent);
          pointer-events: none;
        }

        /* Header */
        .cart-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 24px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }
        .cart-header-left { display: flex; align-items: center; gap: 12px; }
        .cart-header-icon {
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 12px;
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.2);
          color: rgba(245,158,11,0.85);
        }
        .cart-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem; font-weight: 400;
          color: #faf8f4; letter-spacing: 0.02em;
        }
        .cart-subtitle {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px; font-weight: 300;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); margin-top: 2px;
        }
        .cart-close {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 10px; border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.5);
          cursor: pointer; transition: all 0.25s ease;
        }
        .cart-close:hover {
          background: rgba(255,255,255,0.08);
          color: #fff; border-color: rgba(255,255,255,0.14);
        }

        /* Body */
        .cart-body {
          flex: 1; overflow-y: auto; padding: 20px 24px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.08) transparent;
        }
        .cart-body::-webkit-scrollbar { width: 4px; }
        .cart-body::-webkit-scrollbar-track { background: transparent; }
        .cart-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

        /* Empty / auth state */
        .cart-state {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 60px 24px; gap: 12px; text-align: center;
        }
        .cart-state-icon {
          width: 56px; height: 56px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.2); margin-bottom: 8px;
        }
        .cart-state-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem; color: rgba(255,255,255,0.7);
        }
        .cart-state-sub {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px; font-weight: 200; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.28); line-height: 1.7;
        }

        /* Cart items */
        .cart-item {
          display: flex; align-items: center; gap: 14px;
          padding: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; margin-bottom: 12px;
          transition: border-color 0.25s ease;
        }
        .cart-item:hover { border-color: rgba(255,255,255,0.12); }

        .cart-item-emoji {
          width: 48px; height: 48px; flex-shrink: 0;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
        }
        .cart-item-info { flex: 1; min-width: 0; }
        .cart-item-name {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 13px; font-weight: 300; letter-spacing: 0.05em;
          color: rgba(255,255,255,0.85);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .cart-item-price {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px; font-weight: 200; letter-spacing: 0.1em;
          color: rgba(245,158,11,0.7); margin-top: 3px;
        }

        /* Qty controls */
        .cart-qty {
          display: flex; align-items: center; gap: 8px; flex-shrink: 0;
        }
        .cart-qty-btn {
          width: 28px; height: 28px; border-radius: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          color: rgba(255,255,255,0.6);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s ease;
        }
        .cart-qty-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.16); color: #fff;
        }
        .cart-qty-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .cart-qty-num {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 13px; font-weight: 300; letter-spacing: 0.05em;
          color: #fff; min-width: 20px; text-align: center;
        }

        .cart-item-total {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem; color: #faf8f4; flex-shrink: 0;
        }

        .cart-remove {
          background: none; border: none; cursor: pointer;
          color: rgba(239,68,68,0.45);
          display: flex; align-items: center; justify-content: center;
          padding: 4px; border-radius: 6px;
          transition: all 0.2s ease; flex-shrink: 0;
        }
        .cart-remove:hover:not(:disabled) { color: rgba(239,68,68,0.85); background: rgba(239,68,68,0.08); }
        .cart-remove:disabled { opacity: 0.3; cursor: not-allowed; }

        /* Footer */
        .cart-footer {
          flex-shrink: 0;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 20px 24px;
        }
        .cart-total-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px;
        }
        .cart-total-label {
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px; font-weight: 300; letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }
        .cart-total-amount {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem; font-weight: 400; color: rgba(245,158,11,0.95);
        }
        .cart-footer-btns { display: flex; gap: 10px; }
        .cart-btn-clear {
          flex: 1; padding: 13px;
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.45);
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px; font-weight: 300; letter-spacing: 0.25em; text-transform: uppercase;
          cursor: pointer; transition: all 0.25s ease;
        }
        .cart-btn-clear:hover:not(:disabled) {
          background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7);
        }
        .cart-btn-clear:disabled { opacity: 0.35; cursor: not-allowed; }
        .cart-btn-checkout {
          flex: 2; padding: 13px;
          border-radius: 12px;
          background: rgba(245,158,11,0.12);
          border: 1px solid rgba(245,158,11,0.3);
          color: rgba(245,158,11,0.95);
          font-family: 'Josefin Sans', sans-serif;
          font-size: 10px; font-weight: 300; letter-spacing: 0.3em; text-transform: uppercase;
          cursor: pointer; transition: all 0.3s ease;
        }
        .cart-btn-checkout:hover:not(:disabled) {
          background: rgba(245,158,11,0.2);
          border-color: rgba(245,158,11,0.55);
          box-shadow: 0 0 28px rgba(245,158,11,0.18);
        }
        .cart-btn-checkout:disabled { opacity: 0.35; cursor: not-allowed; }
      `}</style>

      {/* Backdrop */}
      <div className={`cart-backdrop${isOpen ? ' open' : ''}`} onClick={onClose} />

      {/* Panel */}
      <div className={`cart-panel${isOpen ? ' open' : ''}`}>
        <div className="cart-shimmer" />

        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-left">
            <div className="cart-header-icon"><ShoppingCart size={18} /></div>
            <div>
              <div className="cart-title">Your Cart</div>
              <div className="cart-subtitle">{itemCount} item{itemCount !== 1 ? 's' : ''}</div>
            </div>
          </div>
          <button className="cart-close" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Body */}
        <div className="cart-body">
          {!isAuthenticated ? (
            <div className="cart-state">
              <div className="cart-state-icon"><ShoppingCart size={22} /></div>
              <div className="cart-state-title">Sign in to view your cart</div>
              <div className="cart-state-sub">Your selections will be saved<br />once you're signed in.</div>
            </div>
          ) : cart.items.length === 0 ? (
            <div className="cart-state">
              <div className="cart-state-icon"><ShoppingCart size={22} /></div>
              <div className="cart-state-title">Your cart is empty</div>
              <div className="cart-state-sub">Add some delicious sweets<br />to get started.</div>
            </div>
          ) : (
            cart.items.map(item => (
              <div key={item.productId} className="cart-item">
                <div className="cart-item-emoji">🍰</div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₹{item.price.toFixed(2)} each</div>
                </div>
                <div className="cart-qty">
                  <button
                    className="cart-qty-btn"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={loading}
                  ><Minus size={12} /></button>
                  <span className="cart-qty-num">{item.quantity}</span>
                  <button
                    className="cart-qty-btn"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={loading}
                  ><Plus size={12} /></button>
                </div>
                <div className="cart-item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
                <button
                  className="cart-remove"
                  onClick={() => removeFromCart(item.productId)}
                  disabled={loading}
                ><Trash2 size={15} /></button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {isAuthenticated && cart.items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-amount">₹{cart.total.toFixed(2)}</span>
            </div>
            <div className="cart-footer-btns">
              <button className="cart-btn-clear" onClick={clearCart} disabled={loading}>Clear</button>
              <button className="cart-btn-checkout" onClick={() => setShowCheckout(true)} disabled={loading}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      <CheckoutForm
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onOrderPlaced={handleOrderPlaced}
      />
    </>
  );
}