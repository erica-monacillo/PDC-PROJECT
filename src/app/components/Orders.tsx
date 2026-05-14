import React, { useEffect, useState } from 'react';
import {
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Package,
  Truck,
  ClipboardList,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { io } from 'socket.io-client';

const API =
  import.meta.env.VITE_API_URL ||
  'https://pdc-project.onrender.com';

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
  status:
    | 'pending'
    | 'processing'
    | 'delivering'
    | 'completed'
    | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface OrdersProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: '#f59e0b',
    bg: '#fffbeb',
    border: '#fde68a',
    label: 'Pending',
  },
  processing: {
    icon: Loader2,
    color: '#3b82f6',
    bg: '#eff6ff',
    border: '#bfdbfe',
    label: 'Processing',
  },
  delivering: {
    icon: Truck,
    color: '#10b981',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    label: 'Delivering',
  },
  completed: {
    icon: CheckCircle,
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    label: 'Completed',
  },
  cancelled: {
    icon: AlertCircle,
    color: '#ef4444',
    bg: '#fef2f2',
    border: '#fecaca',
    label: 'Cancelled',
  },
};

const categoryEmoji: Record<string, string> = {
  cakes: '🍰',
  pastries: '🥐',
  traditional: '🪔',
};

export function Orders({
  isOpen,
  onClose,
}: OrdersProps) {
  const { user, isAuthenticated, isAdmin, token } =
    useAuth();

  const [orders, setOrders] = useState<Order[]>(
    []
  );

  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadOrders();
    }
  }, [isOpen, isAuthenticated]);

  useEffect(() => {
    document.body.style.overflow = isOpen
      ? 'hidden'
      : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isAuthenticated || !isOpen) return;

    const token =
      localStorage.getItem('authToken');

    if (!token) return;

    const socket = io(API);

    socket.emit('authenticate', token);

    socket.on(
      'orders-updated',
      (updatedOrders: Order[]) => {
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
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, isOpen]);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data: Order[] =
          await res.json();

        setOrders(
          data.sort(
            (a, b) =>
              new Date(
                b.createdAt
              ).getTime() -
              new Date(
                a.createdAt
              ).getTime()
          )
        );
      }
    } catch (err) {
      console.error(
        'Error loading orders:',
        err
      );
    } finally {
      setLoading(false);
    }
  };

  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  const cancelOrder = async (
    orderId: string
  ) => {
    try {
      setCancellingOrderId(orderId);
      setCancelError(null);

      const res = await fetch(
        `${API}/api/orders/${orderId}/cancel`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              'authToken'
            )}`,
          },
        }
      );

      if (res.ok) {
        setOrders(prev =>
          prev.map(o =>
            o.id === orderId
              ? {
                  ...o,
                  status: 'cancelled',
                }
              : o
          )
        );
        setCancelError(null);
      } else {
        const error = await res.json();
        setCancelError(error.error || 'Failed to cancel order');
        console.error('Cancel order error:', error);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to cancel order';
      setCancelError(errorMsg);
      console.error('Error cancelling order:', err);
    } finally {
      setCancellingOrderId(null);
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
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .orders-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(15, 23, 42, 0.35);

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 16px;

          opacity: 0;
          pointer-events: none;
          transition: 0.25s ease;
        }

        .orders-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        .orders-modal {
          width: 100%;
          max-width: 760px;
          max-height: 90vh;

          background: #ffffff;

          border-radius: 20px;

          border: 1px solid #e5e7eb;

          overflow: hidden;

          display: flex;
          flex-direction: column;

          transform: translateY(20px);
          transition: 0.25s ease;
        }

        .orders-overlay.open .orders-modal {
          transform: translateY(0);
        }

        .orders-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 20px 24px;

          border-bottom: 1px solid #f1f5f9;
        }

        .orders-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .orders-header-icon {
          width: 42px;
          height: 42px;

          border-radius: 12px;

          background: #fff7ed;

          color: #f97316;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .orders-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #111827;
        }

        .orders-count {
          font-size: 13px;
          color: #6b7280;
          margin-top: 2px;
        }

        .orders-close {
          width: 38px;
          height: 38px;

          border: none;
          border-radius: 10px;

          background: #f8fafc;
          color: #475569;

          cursor: pointer;

          display: flex;
          align-items: center;
          justify-content: center;

          transition: 0.2s;
        }

        .orders-close:hover {
          background: #e2e8f0;
        }

        .orders-filters {
          display: flex;
          gap: 10px;

          overflow-x: auto;

          padding: 16px 24px;

          border-bottom: 1px solid #f1f5f9;
        }

        .orders-filters::-webkit-scrollbar {
          display: none;
        }

        .orders-filter-btn {
          border: none;
          background: #f8fafc;

          padding: 9px 16px;

          border-radius: 999px;

          font-size: 13px;
          font-weight: 500;

          color: #64748b;

          cursor: pointer;

          white-space: nowrap;

          transition: 0.2s;
        }

        .orders-filter-btn:hover {
          background: #e2e8f0;
        }

        .orders-filter-btn.active {
          background: #f97316;
          color: white;
        }

        .orders-body {
          padding: 20px;
          overflow-y: auto;
          background: #f8fafc;
        }

        .orders-error {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 10px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
        }

        .orders-error-close {
          background: none;
          border: none;
          color: #dc2626;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .orders-empty {
          background: white;

          border-radius: 16px;

          padding: 60px 20px;

          text-align: center;

          border: 1px solid #e5e7eb;
        }

        .orders-empty-icon {
          width: 60px;
          height: 60px;

          margin: 0 auto 14px;

          border-radius: 16px;

          background: #fff7ed;

          color: #f97316;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .orders-empty-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .orders-empty-sub {
          font-size: 14px;
          color: #6b7280;
          margin-top: 6px;
          line-height: 1.6;
        }

        .orders-card {
          background: white;

          border: 1px solid #e5e7eb;

          border-radius: 18px;

          padding: 18px;

          margin-bottom: 16px;
        }

        .orders-card-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;

          margin-bottom: 16px;
        }

        .orders-card-left {
          display: flex;
          gap: 12px;
        }

        .orders-status-icon {
          width: 42px;
          height: 42px;

          border-radius: 12px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;
        }

        .orders-id {
          font-size: 15px;
          font-weight: 700;
          color: #111827;
        }

        .orders-date {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }

        .orders-total {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          text-align: right;
        }

        .orders-items-count {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
          text-align: right;
        }

        .orders-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;

          padding: 7px 12px;

          border-radius: 999px;

          font-size: 12px;
          font-weight: 600;

          margin-bottom: 14px;
        }

        .orders-items {
          border-top: 1px solid #f1f5f9;
          padding-top: 14px;

          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .orders-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .orders-item-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .orders-item-emoji {
          width: 38px;
          height: 38px;

          border-radius: 10px;

          background: #fff7ed;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 18px;
        }

        .orders-item-name {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        .orders-item-qty {
          font-size: 12px;
          color: #6b7280;
          margin-top: 3px;
        }

        .orders-item-price {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        .orders-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-top: 16px;
          padding-top: 14px;

          border-top: 1px solid #f1f5f9;
        }

        .orders-note {
          display: flex;
          align-items: center;
          gap: 6px;

          font-size: 13px;
          color: #64748b;
        }

        .orders-cancel-btn {
          border: none;

          background: #fef2f2;
          color: #ef4444;

          padding: 8px 14px;

          border-radius: 10px;

          font-size: 12px;
          font-weight: 600;

          cursor: pointer;

          transition: 0.2s;

          display: flex;
          align-items: center;
          gap: 6px;
        }

        .orders-cancel-btn:hover {
          background: #fee2e2;
        }

        .orders-cancel-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #fed7d7;
        }

        .orders-admin {
          background: white;

          border: 1px solid #e5e7eb;

          border-radius: 18px;

          padding: 20px;

          margin-top: 12px;
        }

        .orders-admin-title {
          font-size: 14px;
          font-weight: 700;
          color: #111827;

          margin-bottom: 18px;
        }

        .orders-admin-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .orders-admin-box {
          background: #f8fafc;

          border-radius: 14px;

          padding: 14px;

          text-align: center;
        }

        .orders-admin-number {
          font-size: 22px;
          font-weight: 700;
        }

        .orders-admin-label {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .orders-modal {
            max-height: 95vh;
          }

          .orders-card-top {
            flex-direction: column;
          }

          .orders-total,
          .orders-items-count {
            text-align: left;
          }

          .orders-admin-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <div
        className={`orders-overlay${
          isOpen ? ' open' : ''
        }`}
        onClick={onClose}
      >
        <div
          className="orders-modal"
          onClick={e => e.stopPropagation()}
        >
          <div className="orders-header">
            <div className="orders-header-left">
              <div className="orders-header-icon">
                <ClipboardList size={20} />
              </div>

              <div>
                <div className="orders-title">
                  My Orders
                </div>

                <div className="orders-count">
                  {orders.length} total orders
                </div>
              </div>
            </div>

            <button
              className="orders-close"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>

          <div className="orders-filters">
            {filterTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() =>
                  setFilter(tab.key)
                }
                className={`orders-filter-btn ${
                  filter === tab.key
                    ? 'active'
                    : ''
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="orders-body">
            {cancelError && (
              <div className="orders-error">
                <span>{cancelError}</span>
                <button
                  className="orders-error-close"
                  onClick={() => setCancelError(null)}
                >
                  <X size={18} />
                </button>
              </div>
            )}
            {!isAuthenticated ? (
              <div className="orders-empty">
                <div className="orders-empty-icon">
                  <ShoppingBag size={26} />
                </div>

                <div className="orders-empty-title">
                  Sign in required
                </div>

                <div className="orders-empty-sub">
                  Login to view your orders.
                </div>
              </div>
            ) : loading ? (
              <div className="orders-empty">
                <div className="orders-empty-icon">
                  <Loader2
                    size={26}
                    style={{
                      animation:
                        'spin 1s linear infinite',
                    }}
                  />
                </div>

                <div className="orders-empty-title">
                  Loading orders...
                </div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="orders-empty">
                <div className="orders-empty-icon">
                  <Package size={26} />
                </div>

                <div className="orders-empty-title">
                  No orders found
                </div>

                <div className="orders-empty-sub">
                  {filter === 'all'
                    ? 'You have not placed any orders yet.'
                    : `No ${filter} orders available.`}
                </div>
              </div>
            ) : (
              <>
                {filteredOrders.map(order => {
                  const cfg =
                    statusConfig[order.status];

                  const StatusIcon = cfg.icon;

                  return (
                    <div
                      key={order.id}
                      className="orders-card"
                    >
                      <div className="orders-card-top">
                        <div className="orders-card-left">
                          <div
                            className="orders-status-icon"
                            style={{
                              background:
                                cfg.bg,
                              color:
                                cfg.color,
                              border: `1px solid ${cfg.border}`,
                            }}
                          >
                            <StatusIcon
                              size={18}
                            />
                          </div>

                          <div>
                            <div className="orders-id">
                              #
                              {order.id
                                .slice(-8)
                                .toUpperCase()}
                            </div>

                            <div className="orders-date">
                              {new Date(
                                order.createdAt
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="orders-total">
                            ₹
                            {parseFloat(
                              String(
                                order.totalPrice
                              )
                            ).toFixed(2)}
                          </div>

                          <div className="orders-items-count">
                            {
                              order.items
                                .length
                            }{' '}
                            items
                          </div>
                        </div>
                      </div>

                      <div
                        className="orders-status-pill"
                        style={{
                          background: cfg.bg,
                          color: cfg.color,
                          border: `1px solid ${cfg.border}`,
                        }}
                      >
                        <StatusIcon
                          size={14}
                        />
                        {cfg.label}
                      </div>

                      <div className="orders-items">
                        {order.items.map(
                          (item, i) => (
                            <div
                              key={i}
                              className="orders-item"
                            >
                              <div className="orders-item-left">
                                <div className="orders-item-emoji">
                                  {categoryEmoji[
                                    item
                                      .category
                                  ] ??
                                    '🍬'}
                                </div>

                                <div>
                                  <div className="orders-item-name">
                                    {
                                      item.name
                                    }
                                  </div>

                                  <div className="orders-item-qty">
                                    Qty:{' '}
                                    {
                                      item.quantity
                                    }
                                  </div>
                                </div>
                              </div>

                              <div className="orders-item-price">
                                ₹
                                {(
                                  item.price *
                                  item.quantity
                                ).toFixed(
                                  2
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      <div className="orders-footer">
                        <div className="orders-note">
                          {order.status ===
                            'pending' && (
                            <>
                              <Clock
                                size={14}
                              />
                              Waiting for
                              confirmation
                            </>
                          )}

                          {order.status ===
                            'processing' && (
                            <>
                              <Loader2
                                size={14}
                              />
                              Preparing
                              order
                            </>
                          )}

                          {order.status ===
                            'delivering' && (
                            <>
                              <Truck
                                size={14}
                              />
                              Out for
                              delivery
                            </>
                          )}

                          {order.status ===
                            'completed' && (
                            <>
                              <CheckCircle
                                size={14}
                              />
                              Delivered
                            </>
                          )}

                          {order.status ===
                            'cancelled' && (
                            <>
                              <AlertCircle
                                size={14}
                              />
                              Cancelled
                            </>
                          )}
                        </div>

                        {order.status ===
                          'pending' && (
                          <button
                            className="orders-cancel-btn"
                            onClick={() =>
                              cancelOrder(
                                order.id
                              )
                            }
                            disabled={cancellingOrderId === order.id}
                          >
                            {cancellingOrderId === order.id ? (
                              <>
                                <Loader2
                                  size={14}
                                  style={{
                                    animation: 'spin 1s linear infinite'
                                  }}
                                />
                                Cancelling...
                              </>
                            ) : (
                              'Cancel'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isAdmin && (
                  <div className="orders-admin">
                    <div className="orders-admin-title">
                      Admin Overview
                    </div>

                    <div className="orders-admin-grid">
                      <div className="orders-admin-box">
                        <div
                          className="orders-admin-number"
                          style={{
                            color:
                              '#f97316',
                          }}
                        >
                          {orders.length}
                        </div>

                        <div className="orders-admin-label">
                          Total
                        </div>
                      </div>

                      <div className="orders-admin-box">
                        <div
                          className="orders-admin-number"
                          style={{
                            color:
                              '#059669',
                          }}
                        >
                          {
                            orders.filter(
                              o =>
                                o.status ===
                                'completed'
                            ).length
                          }
                        </div>

                        <div className="orders-admin-label">
                          Completed
                        </div>
                      </div>

                      <div className="orders-admin-box">
                        <div
                          className="orders-admin-number"
                          style={{
                            color:
                              '#3b82f6',
                          }}
                        >
                          {
                            orders.filter(
                              o =>
                                o.status ===
                                'processing'
                            ).length
                          }
                        </div>

                        <div className="orders-admin-label">
                          Active
                        </div>
                      </div>

                      <div className="orders-admin-box">
                        <div
                          className="orders-admin-number"
                          style={{
                            color:
                              '#ef4444',
                          }}
                        >
                          {
                            orders.filter(
                              o =>
                                o.status ===
                                'cancelled'
                            ).length
                          }
                        </div>

                        <div className="orders-admin-label">
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