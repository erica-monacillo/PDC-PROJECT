import React, { useEffect, useState } from 'react';
import { ShoppingCart, Clock, CheckCircle, AlertCircle, Users, Loader, Package, Truck, CreditCard } from 'lucide-react';
import { useAuth } from './AuthContext';

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
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50', label: 'Pending' },
  processing: { icon: Loader, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Processing' },
  completed: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', label: 'Completed' },
  cancelled: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'Cancelled' },
};

export function Orders() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://pdc-project.onrender.com/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data: Order[] = await response.json();
        setOrders(data.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const response = await fetch(`https://pdc-project.onrender.com/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        loadOrders(); // Reload orders
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const filteredOrders = orders.filter((order: Order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (!isAuthenticated) {
    return (
      <div id="orders" className="py-16 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Orders</h2>
            <p className="text-xl text-gray-600 mb-8">Please sign in to view your orders</p>
            <button
              onClick={() => (document.querySelector('[data-auth-trigger]') as HTMLElement)?.click()}
              className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="orders" className="py-16 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Orders</h2>
          <p className="text-xl text-gray-600">
            Track your sweet orders and order history
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { key: 'all', label: 'All Orders' },
            { key: 'pending', label: 'Pending' },
            { key: 'processing', label: 'Processing' },
            { key: 'completed', label: 'Completed' },
            { key: 'cancelled', label: 'Cancelled' },
          ].map((status) => (
            <button
              key={status.key}
              onClick={() => setFilter(status.key)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                filter === status.key
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <Loader className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' ? "You haven't placed any orders yet" : `No ${filter} orders found`}
            </p>
            <button
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order: Order) => {
              const StatusIcon = statusConfig[order.status]?.icon || Clock;
              const statusColor = statusConfig[order.status]?.color || 'text-gray-500';
              const statusBg = statusConfig[order.status]?.bg || 'bg-gray-50';
              const statusLabel = statusConfig[order.status]?.label || order.status;

              return (
                <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <div className="flex items-center gap-4 mb-4 lg:mb-0">
                      <div className={`p-3 rounded-full ${statusBg}`}>
                        <StatusIcon className={`w-6 h-6 ${statusColor}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Order #{order.id.slice(-8)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()} at{' '}
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${statusBg} ${statusColor}`}>
                        {statusLabel}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-amber-600">
                          ${order.totalPrice?.toFixed(2) || '0.00'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.items?.length || 0} items
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid gap-3">
                      {order.items?.map((item: OrderItem, index: number) => (
                        <div key={index} className="flex justify-between items-center py-2">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {item.category === 'cakes' ? '🍰' :
                               item.category === 'pastries' ? '🥐' :
                               item.category === 'traditional' ? '🪔' : '🍬'}
                            </span>
                            <div>
                              <p className="font-semibold text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      )) || (
                        <p className="text-gray-600">No items in this order</p>
                      )}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {order.status === 'pending' && (
                        <>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Processing soon</span>
                          </div>
                        </>
                      )}
                      {order.status === 'processing' && (
                        <>
                          <div className="flex items-center gap-1">
                            <Truck className="w-4 h-4" />
                            <span>Out for delivery</span>
                          </div>
                        </>
                      )}
                      {order.status === 'completed' && (
                        <>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>Delivered successfully</span>
                          </div>
                        </>
                      )}
                    </div>

                    {order.status === 'pending' && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Admin Stats (if admin) */}
        {isAdmin && (
          <div className="mt-12 bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Admin Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">{orders.length}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter((o: Order) => o.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter((o: Order) => o.status === 'processing').length}
                </p>
                <p className="text-sm text-gray-600">Processing</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {orders.filter((o: Order) => o.status === 'cancelled').length}
                </p>
                <p className="text-sm text-gray-600">Cancelled</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
