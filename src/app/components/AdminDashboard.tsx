import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { io, Socket } from 'socket.io-client';

const API = import.meta.env.VITE_API_URL || 'https://pdc-project.onrender.com';

type OrderStatus = 'pending' | 'processing' | 'delivering' | 'completed' | 'cancelled';

interface Order {
  id: string;
  userId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    deliveryInstructions?: string;
  };
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

const STATUS_FLOW: OrderStatus[] = ['pending', 'processing', 'delivering', 'completed'];

const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string; dot: string }> = {
  pending:    { label: 'Pending',    color: '#92400e', bg: '#fef3c7', dot: '#f59e0b' },
  processing: { label: 'Processing', color: '#1e40af', bg: '#dbeafe', dot: '#3b82f6' },
  delivering: { label: 'Delivering', color: '#065f46', bg: '#d1fae5', dot: '#10b981' },
  completed:  { label: 'Completed',  color: '#14532d', bg: '#bbf7d0', dot: '#22c55e' },
  cancelled:  { label: 'Cancelled',  color: '#7f1d1d', bg: '#fee2e2', dot: '#ef4444' },
};

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setOrders(await res.json());
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    fetchOrders();

    const s = io(API, { transports: ['websocket'] });
    setSocket(s);

    s.on('connect', () => s.emit('authenticate', token));
    s.on('orders-updated', (updated: Order[]) => setOrders(updated));

    return () => { s.disconnect(); };
  }, [user, token, fetchOrders]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`${API}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders(prev =>
          prev.map(o => o.id === orderId ? { ...o, status } : o)
        );
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    } finally {
      setUpdating(null);
    }
  };

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    delivering: orders.filter(o => o.status === 'delivering').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const filtered = orders.filter(o => filter === 'all' || o.status === filter);

  if (user?.role !== 'admin') {
    return (
      <div style={styles.center}>
        <h2 style={{ color: '#1a1a1a', fontFamily: 'Georgia, serif' }}>Access Denied</h2>
        <p style={{ color: '#6b7280' }}>Admin privileges required.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.spinner} />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Admin Dashboard</h1>
            <p style={styles.subtitle}>Manage and track all customer orders</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={styles.liveIndicator}>
              <span style={{ ...styles.liveDot, background: socket?.connected ? '#22c55e' : '#ef4444' }} />
              <span style={{ fontSize: 13, color: '#6b7280' }}>
                {socket?.connected ? 'Live' : 'Offline'}
              </span>
              <span style={{ color: '#e5e7eb', margin: '0 4px' }}>|</span>
              <button
                onClick={logout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={styles.statsGrid}>
          {([
            { key: 'all',        label: 'Total Orders', accent: '#1a1a1a' },
            { key: 'pending',    label: 'Pending',      accent: '#f59e0b' },
            { key: 'processing', label: 'Processing',   accent: '#3b82f6' },
            { key: 'delivering', label: 'Delivering',   accent: '#10b981' },
            { key: 'completed',  label: 'Completed',    accent: '#22c55e' },
            { key: 'cancelled',  label: 'Cancelled',    accent: '#ef4444' },
          ] as const).map(({ key, label, accent }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                ...styles.statCard,
                borderColor: filter === key ? accent : '#e5e7eb',
                boxShadow: filter === key ? `0 0 0 2px ${accent}22` : 'none',
              }}
            >
              <div style={{ ...styles.statNumber, color: accent }}>
                {counts[key]}
              </div>
              <div style={styles.statLabel}>{label}</div>
              {filter === key && <div style={{ ...styles.statBar, background: accent }} />}
            </button>
          ))}
        </div>

        {/* Orders Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              Orders
              <span style={styles.sectionCount}>{filtered.length}</span>
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div style={styles.empty}>No orders in this category</div>
          ) : (
            <div style={styles.orderList}>
              {filtered.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  expanded={expandedId === order.id}
                  updating={updating === order.id}
                  onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  onUpdateStatus={updateStatus}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function OrderCard({
  order,
  expanded,
  updating,
  onToggle,
  onUpdateStatus,
}: {
  order: Order;
  expanded: boolean;
  updating: boolean;
  onToggle: () => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}) {
  const meta = STATUS_META[order.status];
  const currentIdx = STATUS_FLOW.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';
  const isCompleted = order.status === 'completed';

  return (
    <div style={{ ...styles.orderCard, borderColor: expanded ? '#d1d5db' : '#f3f4f6' }}>

      {/* Order Row */}
      <button style={styles.orderRow} onClick={onToggle}>
        <div style={styles.orderLeft}>
          <span style={styles.orderId}>{order.id}</span>
          <span style={styles.orderMeta}>
            {order.customerInfo.name} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span style={styles.orderMeta}>
            {order.items.length} item{order.items.length !== 1 ? 's' : ''} · ₹{Number(order.totalPrice).toFixed(2)}
          </span>
        </div>
        <div style={styles.orderRight}>
          <span style={{ ...styles.badge, color: meta.color, background: meta.bg }}>
            <span style={{ ...styles.badgeDot, background: meta.dot }} />
            {meta.label}
          </span>
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: '#9ca3af' }}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div style={styles.expandedBody}>

          {/* Progress Bar */}
          {!isCancelled && (
            <div style={styles.progressSection}>
              <div style={styles.progressTrack}>
                {STATUS_FLOW.map((s, i) => {
                  const done = i <= currentIdx;
                  const active = i === currentIdx;
                  return (
                    <React.Fragment key={s}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{
                          ...styles.progressDot,
                          background: done ? '#1a1a1a' : '#e5e7eb',
                          border: active ? '2px solid #1a1a1a' : '2px solid transparent',
                          boxShadow: active ? '0 0 0 3px #1a1a1a22' : 'none',
                        }} />
                        <span style={{ fontSize: 11, color: done ? '#1a1a1a' : '#9ca3af', fontWeight: done ? 500 : 400 }}>
                          {STATUS_META[s].label}
                        </span>
                      </div>
                      {i < STATUS_FLOW.length - 1 && (
                        <div style={{ ...styles.progressLine, background: i < currentIdx ? '#1a1a1a' : '#e5e7eb' }} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          {/* Two Column Layout */}
          <div style={styles.detailsGrid}>

            {/* Customer Info */}
            <div style={styles.detailBox}>
              <h4 style={styles.detailTitle}>Customer</h4>
              <div style={styles.detailRow}><span style={styles.detailKey}>Name</span><span style={styles.detailVal}>{order.customerInfo.name}</span></div>
              <div style={styles.detailRow}><span style={styles.detailKey}>Email</span><span style={styles.detailVal}>{order.customerInfo.email}</span></div>
              <div style={styles.detailRow}><span style={styles.detailKey}>Phone</span><span style={styles.detailVal}>{order.customerInfo.phone}</span></div>
              <div style={styles.detailRow}><span style={styles.detailKey}>Address</span><span style={styles.detailVal}>{order.customerInfo.address}, {order.customerInfo.city}, {order.customerInfo.state} {order.customerInfo.zipCode}</span></div>
              {order.customerInfo.deliveryInstructions && (
                <div style={styles.detailRow}><span style={styles.detailKey}>Note</span><span style={styles.detailVal}>{order.customerInfo.deliveryInstructions}</span></div>
              )}
            </div>

            {/* Items */}
            <div style={styles.detailBox}>
              <h4 style={styles.detailTitle}>Items</h4>
              {order.items.map((item, i) => (
                <div key={i} style={styles.itemRow}>
                  <span style={styles.itemName}>{item.name} <span style={{ color: '#9ca3af' }}>×{item.quantity}</span></span>
                  <span style={styles.itemPrice}>₹{(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div style={styles.itemTotal}>
                <span style={{ fontWeight: 600 }}>Total</span>
                <span style={{ fontWeight: 600 }}>₹{Number(order.totalPrice).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Status Buttons */}
          {!isCompleted && !isCancelled && (
            <div style={styles.actionRow}>
              {STATUS_FLOW.map((s, i) => {
                const isPast = i < currentIdx;
                const isCurrent = i === currentIdx;
                const isFuture = i > currentIdx;
                const isNext = i === currentIdx + 1;

                let btnStyle = { ...styles.statusBtn };
                if (isCurrent) {
                  btnStyle = { ...btnStyle, background: '#16a34a', color: '#fff', borderColor: '#16a34a' };
                } else if (isPast) {
                  btnStyle = { ...btnStyle, background: '#f3f4f6', color: '#9ca3af', borderColor: '#e5e7eb', cursor: 'default' };
                } else if (isNext) {
                  btnStyle = { ...btnStyle, background: '#fff', color: '#1a1a1a', borderColor: '#1a1a1a', cursor: 'pointer' };
                } else {
                  btnStyle = { ...btnStyle, background: '#f9fafb', color: '#d1d5db', borderColor: '#e5e7eb', cursor: 'not-allowed' };
                }

                return (
                  <button
                    key={s}
                    style={btnStyle}
                    disabled={!isNext || updating}
                    onClick={() => isNext && onUpdateStatus(order.id, s)}
                    title={isNext ? `Move to ${STATUS_META[s].label}` : undefined}
                  >
                    {isPast && <span style={{ marginRight: 4 }}>✓</span>}
                    {updating && isNext ? '...' : STATUS_META[s].label}
                  </button>
                );
              })}

              <button
                style={{ ...styles.statusBtn, background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca', marginLeft: 'auto' }}
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
                disabled={updating}
              >
                Cancel
              </button>
            </div>
          )}

          {(isCompleted || isCancelled) && (
            <div style={{ ...styles.finalBadge, background: isCancelled ? '#fef2f2' : '#f0fdf4', color: isCancelled ? '#dc2626' : '#16a34a' }}>
              {isCancelled ? '✕ Order Cancelled' : '✓ Order Completed'}
            </div>
          )}

        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f9fafb',
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  container: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '32px 24px',
  },
  center: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  spinner: {
    width: 36,
    height: 36,
    border: '3px solid #e5e7eb',
    borderTop: '3px solid #1a1a1a',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#111827',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    margin: '4px 0 0',
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 20,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    position: 'relative',
    background: '#fff',
    border: '1.5px solid',
    borderRadius: 12,
    padding: '16px 12px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s',
    overflow: 'hidden',
  },
  statNumber: {
    fontSize: 26,
    fontWeight: 700,
    lineHeight: 1,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: 500,
  },
  statBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: '0 0 12px 12px',
  },
  section: {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  },
  sectionHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #f3f4f6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#111827',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  sectionCount: {
    fontSize: 12,
    background: '#f3f4f6',
    color: '#6b7280',
    padding: '2px 8px',
    borderRadius: 20,
    fontWeight: 500,
  },
  empty: {
    padding: '48px 24px',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 14,
  },
  orderList: {
    display: 'flex',
    flexDirection: 'column',
  },
  orderCard: {
    borderBottom: '1px solid #f3f4f6',
    border: '1px solid',
    borderRadius: 0,
    transition: 'border-color 0.15s',
  },
  orderRow: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    gap: 16,
  },
  orderLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 600,
    color: '#111827',
    fontFamily: 'monospace',
  },
  orderMeta: {
    fontSize: 12,
    color: '#6b7280',
  },
  orderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
  },
  expandedBody: {
    padding: '0 24px 24px',
    borderTop: '1px solid #f3f4f6',
  },
  progressSection: {
    padding: '24px 0 20px',
  },
  progressTrack: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 0,
  },
  progressDot: {
    width: 14,
    height: 14,
    borderRadius: '50%',
    transition: 'all 0.2s',
    flexShrink: 0,
  },
  progressLine: {
    flex: 1,
    height: 2,
    marginTop: 6,
    transition: 'background 0.2s',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginBottom: 20,
  },
  detailBox: {
    background: '#f9fafb',
    borderRadius: 10,
    padding: '14px 16px',
  },
  detailTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#9ca3af',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    margin: '0 0 10px',
  },
  detailRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 6,
    fontSize: 13,
  },
  detailKey: {
    color: '#6b7280',
    minWidth: 56,
    flexShrink: 0,
  },
  detailVal: {
    color: '#111827',
    fontWeight: 500,
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    marginBottom: 6,
    color: '#374151',
  },
  itemName: {
    color: '#111827',
  },
  itemPrice: {
    fontWeight: 500,
    color: '#111827',
  },
  itemTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1px solid #e5e7eb',
    color: '#111827',
  },
  actionRow: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap' as const,
    alignItems: 'center',
  },
  statusBtn: {
    padding: '8px 16px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    border: '1.5px solid',
    transition: 'all 0.15s',
    cursor: 'pointer',
  },
  finalBadge: {
    padding: '12px 16px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    textAlign: 'center' as const,
  },
};
