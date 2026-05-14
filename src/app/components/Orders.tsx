import React, { useEffect, useState } from 'react';
import {
  X, Clock, CheckCircle, AlertCircle, Loader,
  Package, Truck, ClipboardList, ShoppingBag,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';

const API = import.meta.env.VITE_API_URL || 'https://pdc-project.onrender.com';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'delivering' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface OrdersProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig = {
  pending:    { icon: Clock,        color: '#FF9933',      bg: 'rgba(255,153,51,0.12)',   border: 'rgba(255,153,51,0.3)',    label: 'Pending' },
  processing: { icon: Loader,       color: '#0ea5e9',      bg: 'rgba(14,165,233,0.12)',   border: 'rgba(14,165,233,0.3)',    label: 'Processing' },
  delivering: { icon: Truck,        color: '#10b981',      bg: 'rgba(16,185,129,0.12)',   border: 'rgba(16,185,129,0.3)',    label: 'Delivering' },
  completed:  { icon: CheckCircle,  color: '#059669',      bg: 'rgba(5,150,105,0.12)',    border: 'rgba(5,150,105,0.3)',     label: 'Completed' },
  cancelled:  { icon: AlertCircle,  color: '#dc2626',      bg: 'rgba(220,38,38,0.12)',    border: 'rgba(220,38,38,0.3)',     label: 'Cancelled' },
};

const categoryEmoji: Record<string, string> = {
  cakes: '🍰',
  pastries: '🥐',
  traditional: '🪔',
};

export function Orders({ isOpen, onClose }: OrdersProps) {
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadOrders();
    }
  }, [isOpen, isAuthenticated]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Real-time Socket.IO updates
  useEffect(() => {
    if (!isAuthenticated || !isOpen) return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    const socket = io(API);

    socket.emit('authenticate', token);

    socket.on('orders-updated', (updatedOrders: Order[]) => {
      const myOrders = updatedOrders
        .filter(
          o =>
            isAdmin ||
            o.userId === user?.id ||
            (o as any).user_id === user?.id
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

      setOrders(myOrders);
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, isOpen]);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/api/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (res.ok) {
        const data: Order[] = await res.json();

        setOrders(
          data.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
        );
      }
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    o => filter === 'all' || o.status === filter
  );

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'processing', label: 'Processing' },
    { key: 'delivering', label: 'Delivering' },
    { key: 'completed', label: 'Complete' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Poppins:wght@300;400;500;600&display=swap');

        .ord-backdrop {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(0,0,0,0);
          backdrop-filter: blur(0px);
          transition: background 0.4s ease, backdrop-filter 0.4s ease;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .ord-backdrop.open {
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(6px);
          pointer-events: all;
        }

        /* CENTER MODAL */
        .ord-panel {
          position: relative;
          width: 100%;
          max-width: 760px;
          height: auto;
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

          opacity: 0;
          transform: scale(0.92) translateY(20px);

          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);

          overflow: hidden;
          pointer-events: none;
        }

        .ord-panel.open {
          opacity: 1;
          transform: scale(1) translateY(0);
          pointer-events: all;
        }

        .ord-shimmer {
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

        .ord-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 24px 24px 20px;

          border-bottom: 1px solid rgba(255,153,51,0.15);

          flex-shrink: 0;
        }

        .ord-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ord-header-icon {
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

        .ord-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #1a3a3a;
          letter-spacing: 0.02em;
        }

        .ord-count {
          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(26, 58, 58, 0.6);
          margin-top: 2px;
        }

        .ord-close {
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

        .ord-close:hover {
          background: rgba(255,153,51,0.15);
          color: rgba(255,153,51,0.9);
          border-color: rgba(255,153,51,0.35);
        }

        .ord-filters {
          display: flex;
          gap: 6px;

          padding: 16px 24px;

          overflow-x: auto;

          flex-shrink: 0;

          border-bottom: 1px solid rgba(255,153,51,0.1);

          scrollbar-width: none;
        }

        .ord-filters::-webkit-scrollbar {
          display: none;
        }

        .ord-filter-btn {
          flex-shrink: 0;

          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 500;

          letter-spacing: 0.15em;
          text-transform: uppercase;

          padding: 7px 14px;

          border-radius: 100px;

          background: rgba(255,153,51,0.08);
          border: 1px solid rgba(255,153,51,0.15);

          color: rgba(26, 58, 58, 0.6);

          cursor: pointer;

          transition: all 0.25s ease;

          white-space: nowrap;
        }

        .ord-filter-btn:hover {
          color: rgba(26, 58, 58, 0.85);
          background: rgba(255,153,51,0.15);
        }

        .ord-filter-btn.active {
          background: rgba(255,153,51,0.15);
          border-color: rgba(255,153,51,0.4);
          color: rgba(255,153,51,0.95);
        }

        .ord-body {
          flex: 1;
          overflow-y: auto;

          padding: 20px 24px;

          scrollbar-width: thin;
          scrollbar-color: rgba(255,153,51,0.2) transparent;
        }

        .ord-body::-webkit-scrollbar {
          width: 4px;
        }

        .ord-body::-webkit-scrollbar-track {
          background: transparent;
        }

        .ord-body::-webkit-scrollbar-thumb {
          background: rgba(255,153,51,0.2);
          border-radius: 4px;
        }

        .ord-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          padding: 60px 24px;

          gap: 12px;

          text-align: center;
        }

        .ord-state-icon {
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

        .ord-state-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          color: rgba(26, 58, 58, 0.8);
        }

        .ord-state-sub {
          font-family: 'Poppins', sans-serif;
          font-size: 12px;
          font-weight: 400;

          letter-spacing: 0.01em;

          color: rgba(26, 58, 58, 0.6);

          line-height: 1.7;
        }

        .ord-state-btn {
          margin-top: 8px;

          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 500;

          letter-spacing: 0.15em;
          text-transform: uppercase;

          padding: 11px 24px;

          border-radius: 100px;

          background: rgba(255,153,51,0.12);
          border: 1px solid rgba(255,153,51,0.3);

          color: rgba(255,153,51,0.95);

          cursor: pointer;

          transition: all 0.25s ease;
        }

        .ord-state-btn:hover {
          background: rgba(255,153,51,0.2);
          border-color: rgba(255,153,51,0.5);
        }

        .ord-card {
          background: rgba(255,237,180,0.35);

          border: 1px solid rgba(255,153,51,0.2);

          border-radius: 18px;

          padding: 20px;

          margin-bottom: 14px;

          transition:
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .ord-card:hover {
          border-color: rgba(255,153,51,0.35);
          box-shadow: 0 8px 24px rgba(255,153,51,0.1);
        }

        .ord-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 12px;

          margin-bottom: 16px;
        }

        .ord-card-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ord-status-dot {
          width: 36px;
          height: 36px;

          border-radius: 10px;

          flex-shrink: 0;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ord-id {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 700;
          color: #1a3a3a;
        }

        .ord-date {
          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 400;

          letter-spacing: 0.1em;

          color: rgba(26, 58, 58, 0.5);

          margin-top: 2px;
        }

        .ord-card-right {
          text-align: right;
          flex-shrink: 0;
        }

        .ord-total {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          color: rgba(255,153,51,0.95);
        }

        .ord-item-count {
          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 400;

          letter-spacing: 0.1em;

          color: rgba(26, 58, 58, 0.5);

          margin-top: 2px;
        }

        .ord-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;

          font-family: 'Poppins', sans-serif;
          font-size: 10px;
          font-weight: 500;

          letter-spacing: 0.15em;
          text-transform: uppercase;

          padding: 6px 12px;

          border-radius: 100px;
        }

        .ord-status-pill-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        .ord-items {
          border-top: 1px solid rgba(255,153,51,0.1);

          padding-top: 14px;

          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ord-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ord-item-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ord-item-emoji {
          width: 32px;
          height: 32px;

          border-radius: 8px;

          background: rgba(255,153,51,0.1);
          border: 1px solid rgba(255,153,51,0.2);

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 16px;
        }

        .ord-item-name {
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 500;

          letter-spacing: 0.02em;

          color: #1a3a3a;
        }

        .ord-item-qty {
          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 400;

          letter-spacing: 0.05em;

          color: rgba(26, 58, 58, 0.6);

          margin-top: 1px;
        }

        .ord-item-price {
          font-family: 'Poppins', sans-serif;
          font-size: 12px;
          font-weight: 500;

          letter-spacing: 0.05em;

          color: rgba(26, 58, 58, 0.8);
        }

        .ord-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-top: 14px;
          padding-top: 14px;

          border-top: 1px solid rgba(255,153,51,0.1);
        }

        .ord-delivery-note {
          display: flex;
          align-items: center;
          gap: 6px;

          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 400;

          letter-spacing: 0.1em;

          color: rgba(26, 58, 58, 0.6);
        }

        .ord-admin {
          margin-top: 8px;

          padding: 20px;

          background: rgba(255,237,180,0.35);

          border: 1px solid rgba(255,153,51,0.2);

          border-radius: 18px;
        }

        .ord-admin-title {
          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 500;

          letter-spacing: 0.2em;
          text-transform: uppercase;

          color: rgba(255,153,51,0.8);

          margin-bottom: 16px;
        }

        .ord-admin-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 8px;
        }

        .ord-admin-stat {
          text-align: center;
        }

        .ord-admin-num {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
        }

        .ord-admin-label {
          font-family: 'Poppins', sans-serif;
          font-size: 10px;
          font-weight: 400;

          letter-spacing: 0.15em;
          text-transform: uppercase;

          color: rgba(26, 58, 58, 0.6);

          margin-top: 2px;
        }

        @media (max-width: 768px) {
          .ord-panel {
            width: 100%;
            max-width: 100%;
            max-height: 92vh;
            border-radius: 22px;
          }

          .ord-card-top {
            flex-direction: column;
            align-items: flex-start;
          }

          .ord-card-right {
            text-align: left;
          }

          .ord-admin-grid {
            grid-template-columns: repeat(2,1fr);
          }
        }
      `}</style>

      <div
        className={`ord-backdrop${isOpen ? ' open' : ''}`}
        onClick={onClose}
      >
        <div
          className={`ord-panel${isOpen ? ' open' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="ord-shimmer" />

          <div className="ord-header">
            <div className="ord-header-left">
              <div className="ord-header-icon">
                <ClipboardList size={18} />
              </div>

              <div>
                <div className="ord-title">My Orders</div>

                <div className="ord-count">
                  {orders.length} order
                  {orders.length !== 1 ? 's' : ''} total
                </div>
              </div>
            </div>

            <button className="ord-close" onClick={onClose}>
              <X size={16} />
            </button>
          </div>

          <div className="ord-filters">
            {filterTabs.map(tab => (
              <button
                key={tab.key}
                className={`ord-filter-btn${
                  filter === tab.key ? ' active' : ''
                }`}
                onClick={() => setFilter(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="ord-body">
            {!isAuthenticated ? (
              <div className="ord-state">
                <div className="ord-state-icon">
                  <ShoppingBag size={22} />
                </div>

                <div className="ord-state-title">
                  Sign in to view orders
                </div>

                <div className="ord-state-sub">
                  Your order history will appear
                  <br />
                  once you're signed in.
                </div>

                <button
                  className="ord-state-btn"
                  onClick={onClose}
                >
                  Sign In
                </button>
              </div>
            ) : loading ? (
              <div className="ord-state">
                <div className="ord-state-icon">
                  <Loader
                    size={22}
                    style={{
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                </div>

                <div className="ord-state-title">
                  Loading orders…
                </div>

                <style>{`
                  @keyframes spin {
                    to {
                      transform: rotate(360deg);
                    }
                  }
                `}</style>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="ord-state">
                <div className="ord-state-icon">
                  <Package size={22} />
                </div>

                <div className="ord-state-title">
                  No orders found
                </div>

                <div className="ord-state-sub">
                  {filter === 'all'
                    ? "You haven't placed any orders yet."
                    : `No ${filter} orders to show.`}
                </div>

                {filter !== 'all' && (
                  <button
                    className="ord-state-btn"
                    onClick={() => setFilter('all')}
                  >
                    View All
                  </button>
                )}
              </div>
            ) : (
              <>
                {filteredOrders.map(order => {
                  const cfg =
                    statusConfig[order.status] ??
                    statusConfig.pending;

                  const StatusIcon = cfg.icon;

                  return (
                    <div key={order.id} className="ord-card">
                      <div className="ord-card-top">
                        <div className="ord-card-left">
                          <div
                            className="ord-status-dot"
                            style={{
                              background: cfg.bg,
                              border: `1px solid ${cfg.border}`,
                              color: cfg.color,
                            }}
                          >
                            <StatusIcon size={16} />
                          </div>

                          <div>
                            <div className="ord-id">
                              #
                              {order.id
                                .slice(-8)
                                .toUpperCase()}
                            </div>

                            <div className="ord-date">
                              {new Date(
                                order.createdAt
                              ).toLocaleDateString()}
                              {' · '}
                              {new Date(
                                order.createdAt
                              ).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="ord-card-right">
                          <div className="ord-total">
                            ₹
                            {parseFloat(
                              String(order.totalPrice ?? 0)
                            ).toFixed(2)}
                          </div>

                          <div className="ord-item-count">
                            {order.items?.length ?? 0} item
                            {(order.items?.length ?? 0) !== 1
                              ? 's'
                              : ''}
                          </div>
                        </div>
                      </div>

                      <div style={{ marginBottom: 14 }}>
                        <span
                          className="ord-status-pill"
                          style={{
                            background: cfg.bg,
                            border: `1px solid ${cfg.border}`,
                            color: cfg.color,
                          }}
                        >
                          <span className="ord-status-pill-dot" />
                          {cfg.label}
                        </span>
                      </div>

                      <div className="ord-items">
                        {order.items?.map((item, i) => (
                          <div key={i} className="ord-item">
                            <div className="ord-item-left">
                              <div className="ord-item-emoji">
                                {categoryEmoji[item.category] ??
                                  '🍬'}
                              </div>

                              <div>
                                <div className="ord-item-name">
                                  {item.name}
                                </div>

                                <div className="ord-item-qty">
                                  Qty: {item.quantity}
                                </div>
                              </div>
                            </div>

                            <div className="ord-item-price">
                              ₹
                              {(
                                parseFloat(
                                  String(item.price)
                                ) * item.quantity
                              ).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="ord-card-footer">
                        <div className="ord-delivery-note">
                          {order.status === 'pending' && (
                            <>
                              <Clock size={12} />
                              Processing soon
                            </>
                          )}

                          {order.status === 'processing' && (
                            <>
                              <Loader size={12} />
                              Preparing your order
                            </>
                          )}

                          {order.status === 'delivering' && (
                            <>
                              <Truck size={12} />
                              Out for delivery
                            </>
                          )}

                          {order.status === 'completed' && (
                            <>
                              <CheckCircle size={12} />
                              Delivered
                            </>
                          )}

                          {order.status === 'cancelled' && (
                            <>
                              <AlertCircle size={12} />
                              Cancelled
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isAdmin && (
                  <div className="ord-admin">
                    <div className="ord-admin-title">
                      Admin Overview
                    </div>

                    <div className="ord-admin-grid">
                      <div className="ord-admin-stat">
                        <div
                          className="ord-admin-num"
                          style={{ color: '#FF9933' }}
                        >
                          {orders.length}
                        </div>

                        <div className="ord-admin-label">
                          Total
                        </div>
                      </div>

                      <div className="ord-admin-stat">
                        <div
                          className="ord-admin-num"
                          style={{ color: '#059669' }}
                        >
                          {
                            orders.filter(
                              o => o.status === 'completed'
                            ).length
                          }
                        </div>

                        <div className="ord-admin-label">
                          Complete
                        </div>
                      </div>

                      <div className="ord-admin-stat">
                        <div
                          className="ord-admin-num"
                          style={{ color: '#0ea5e9' }}
                        >
                          {
                            orders.filter(
                              o => o.status === 'processing'
                            ).length
                          }
                        </div>

                        <div className="ord-admin-label">
                          Active
                        </div>
                      </div>

                      <div className="ord-admin-stat">
                        <div
                          className="ord-admin-num"
                          style={{ color: '#dc2626' }}
                        >
                          {
                            orders.filter(
                              o => o.status === 'cancelled'
                            ).length
                          }
                        </div>

                        <div className="ord-admin-label">
                          Cancelled
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}