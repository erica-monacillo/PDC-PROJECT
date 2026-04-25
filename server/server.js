import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// JWT Secret (in production, use environment variable)
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// ============ IN-MEMORY DATA STORE ============
// This demonstrates shared data that all concurrent users access
const store = {
  users: new Map(), // userId -> user object
  sessions: new Map(), // sessionId -> userId
  carts: new Map(), // userId -> cart object
  orders: new Map(), // orderId -> order object
  products: new Map(), // productId -> product object
  nextOrderId: 1000,
  nextUserId: 1,
  nextProductId: 1,
  processingQueue: [], // Queue for background worker to process
};

// ============ INITIAL PRODUCTS ============
const initialProducts = [
  { id: 'prod-1', name: 'Chocolate Cake', price: 8.99, description: 'Rich chocolate cake with creamy frosting', category: 'cakes', image: '/images/cake1.jpg', stock: 10 },
  { id: 'prod-2', name: 'Strawberry Cheesecake', price: 9.99, description: 'Creamy cheesecake topped with fresh strawberries', category: 'cakes', image: '/images/cake2.jpg', stock: 8 },
  { id: 'prod-3', name: 'Donut Pack (6)', price: 12.99, description: 'Assorted glazed donuts, perfect for sharing', category: 'pastries', image: '/images/donuts.jpg', stock: 15 },
  { id: 'prod-4', name: 'Macaron Set', price: 15.99, description: 'Delicate French macarons in various flavors', category: 'pastries', image: '/images/macarons.jpg', stock: 12 },
  { id: 'prod-5', name: 'Cupcake Box (12)', price: 24.99, description: 'Colorful cupcakes with different toppings', category: 'cakes', image: '/images/cupcakes.jpg', stock: 6 },
  { id: 'prod-6', name: 'Ras Malai', price: 6.99, description: 'Traditional Indian sweet cheese dumplings', category: 'traditional', image: '/images/rasmalai.jpg', stock: 20 },
  { id: 'prod-7', name: 'Gulab Jamun', price: 7.99, description: 'Soft milk dumplings soaked in rose syrup', category: 'traditional', image: '/images/gulabjamun.jpg', stock: 18 },
  { id: 'prod-8', name: 'Ladoo Pack', price: 11.99, description: 'Traditional Indian sweets in various flavors', category: 'traditional', image: '/images/ladoo.jpg', stock: 14 },
];

// Initialize products
initialProducts.forEach(product => store.products.set(product.id, product));

// ============ AUTHENTICATION MIDDLEWARE ============
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// ============ AUTHENTICATION ENDPOINTS ============

// Register new user
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, role = 'customer' } = req.body;

  // Check if user already exists
  const existingUser = Array.from(store.users.values()).find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const userId = `user-${store.nextUserId++}`;
  const user = {
    id: userId,
    email,
    name,
    role,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    cart: { items: [], total: 0 },
  };

  store.users.set(userId, user);
  store.carts.set(userId, { items: [], total: 0 });

  // Generate JWT token
  const token = jwt.sign(
    { id: userId, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    user: { id: userId, email, name, role },
    token
  });
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = Array.from(store.users.values()).find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: 'Invalid password' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token
  });
});

// Get current user profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const user = store.users.get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt
  });
});

// ============ PRODUCT ENDPOINTS ============

// Get all products
app.get('/api/products', (req, res) => {
  const products = Array.from(store.products.values());
  res.json(products);
});

// Get single product
app.get('/api/products/:productId', (req, res) => {
  const product = store.products.get(req.params.productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Update product (admin only)
app.put('/api/products/:productId', authenticateToken, requireRole('admin'), (req, res) => {
  const product = store.products.get(req.params.productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { name, price, description, stock, category } = req.body;
  const updatedProduct = {
    ...product,
    name: name || product.name,
    price: price || product.price,
    description: description || product.description,
    stock: stock !== undefined ? stock : product.stock,
    category: category || product.category,
  };

  store.products.set(req.params.productId, updatedProduct);
  broadcastProducts();

  res.json(updatedProduct);
});

// ============ CART ENDPOINTS ============

// Get user's cart
app.get('/api/cart', authenticateToken, (req, res) => {
  const cart = store.carts.get(req.user.id) || { items: [], total: 0 };
  res.json(cart);
});

// Add item to cart
app.post('/api/cart/add', authenticateToken, (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id;

  const product = store.products.get(productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ error: 'Insufficient stock' });
  }

  let cart = store.carts.get(userId) || { items: [], total: 0 };

  // Check if item already in cart
  const existingItem = cart.items.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    });
  }

  // Recalculate total
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  store.carts.set(userId, cart);
  broadcastCartUpdate(userId);

  res.json(cart);
});

// Update cart item quantity
app.put('/api/cart/update', authenticateToken, (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  let cart = store.carts.get(userId) || { items: [], total: 0 };

  const itemIndex = cart.items.findIndex(item => item.productId === productId);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not in cart' });
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  store.carts.set(userId, cart);
  broadcastCartUpdate(userId);

  res.json(cart);
});

// Clear cart
app.delete('/api/cart', authenticateToken, (req, res) => {
  const userId = req.user.id;
  store.carts.set(userId, { items: [], total: 0 });
  broadcastCartUpdate(userId);
  res.json({ success: true });
});

// ============ ORDER ENDPOINTS ============

// Get all orders (admin) or user's orders (customer)
app.get('/api/orders', authenticateToken, (req, res) => {
  let orders;
  if (req.user.role === 'admin') {
    orders = Array.from(store.orders.values());
  } else {
    orders = Array.from(store.orders.values()).filter(order => order.userId === req.user.id);
  }
  res.json(orders);
});

// Create order from cart
app.post('/api/orders', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { customerInfo } = req.body;
  const cart = store.carts.get(userId);

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  if (!customerInfo) {
    return res.status(400).json({ error: 'Customer information is required' });
  }

  // Validate required customer fields
  const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
  for (const field of requiredFields) {
    if (!customerInfo[field] || !customerInfo[field].trim()) {
      return res.status(400).json({ error: `${field} is required` });
    }
  }

  // Check stock availability
  for (const item of cart.items) {
    const product = store.products.get(item.productId);
    if (!product || product.stock < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for ${item.name}` });
    }
  }

  // Reduce stock
  cart.items.forEach(item => {
    const product = store.products.get(item.productId);
    product.stock -= item.quantity;
  });

  const orderId = `ORD-${store.nextOrderId++}`;
  const order = {
    id: orderId,
    userId,
    customerInfo,
    items: cart.items,
    totalPrice: cart.total,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.orders.set(orderId, order);
  store.processingQueue.push(orderId);

  // Clear cart
  store.carts.set(userId, { items: [], total: 0 });

  broadcastOrders();
  broadcastProducts();

  res.json({ success: true, order });
});

// Get single order
app.get('/api/orders/:orderId', authenticateToken, (req, res) => {
  const order = store.orders.get(req.params.orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Users can only see their own orders (unless admin)
  if (req.user.role !== 'admin' && order.userId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  res.json(order);
});

// Cancel order
app.post('/api/orders/:orderId/cancel', authenticateToken, (req, res) => {
  const order = store.orders.get(req.params.orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (req.user.role !== 'admin' && order.userId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  if (order.status === 'completed') {
    return res.status(400).json({ error: 'Cannot cancel completed order' });
  }

  order.status = 'cancelled';
  order.updatedAt = new Date().toISOString();

  // Return stock
  order.items.forEach(item => {
    const product = store.products.get(item.productId);
    if (product) {
      product.stock += item.quantity;
    }
  });

  broadcastOrders();
  broadcastProducts();
  res.json({ success: true, order });
});

// Update order status (admin only)
app.put('/api/orders/:orderId/status', authenticateToken, requireRole('admin'), (req, res) => {
  const { status } = req.body;
  const order = store.orders.get(req.params.orderId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  // If cancelling, return stock
  if (status === 'cancelled' && order.status !== 'cancelled') {
    order.items.forEach(item => {
      const product = store.products.get(item.productId);
      if (product) {
        product.stock += item.quantity;
      }
    });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  broadcastOrders();
  broadcastProducts();
  res.json({ success: true, order });
});

// ============ ADMIN ENDPOINTS ============

// Get all orders (admin only)
app.get('/api/admin/orders', authenticateToken, requireRole('admin'), (req, res) => {
  const ordersArray = Array.from(store.orders.values());
  res.json(ordersArray);
});

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, requireRole('admin'), (req, res) => {
  const users = Array.from(store.users.values()).map(user => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  }));
  res.json(users);
});

// Update user role (admin only)
app.put('/api/admin/users/:userId/role', authenticateToken, requireRole('admin'), (req, res) => {
  const { role } = req.body;
  const user = store.users.get(req.params.userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!['admin', 'customer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  user.role = role;
  res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

// ============ HELPER FUNCTIONS ============

// Broadcast functions
function broadcastOrders() {
  const ordersArray = Array.from(store.orders.values());
  io.emit('orders-updated', ordersArray);
}

function broadcastProducts() {
  const productsArray = Array.from(store.products.values());
  io.emit('products-updated', productsArray);
}

function broadcastCartUpdate(userId) {
  const cart = store.carts.get(userId) || { items: [], total: 0 };
  io.to(userId).emit('cart-updated', cart);
}

// ============ WEBSOCKET EVENTS ============
io.on('connection', (socket) => {
  console.log(`🔗 User connected: ${socket.id}`);

  // Authenticate socket connection
  socket.on('authenticate', (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      console.log(`✅ User authenticated: ${decoded.email} (${decoded.role})`);
    } catch (error) {
      console.log(`❌ Authentication failed: ${error.message}`);
    }
  });

  // Send initial data
  socket.emit('products-updated', Array.from(store.products.values()));
  socket.emit('orders-updated', Array.from(store.orders.values()));

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// ============ BACKGROUND WORKER ============
function startOrderProcessor() {
  setInterval(() => {
    if (store.processingQueue.length === 0) return;

    const ordersToProcess = store.processingQueue.splice(0, 3);

    ordersToProcess.forEach((orderId) => {
      const order = store.orders.get(orderId);
      if (order && order.status === 'pending') {
        setTimeout(() => {
          order.status = 'processing';
          order.updatedAt = new Date().toISOString();
          broadcastOrders();

          setTimeout(() => {
            order.status = 'completed';
            order.updatedAt = new Date().toISOString();
            broadcastOrders();
            io.emit('order-completed', order);
          }, 2000 + Math.random() * 2000);
        }, 1000 + Math.random() * 2000);
      }
    });
  }, 2000);
}

// ============ INITIALIZE ADMIN USER ============
async function initializeAdmin() {
  const adminExists = Array.from(store.users.values()).some(u => u.role === 'admin');
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = {
      id: 'user-admin',
      email: 'admin@sweetshop.com',
      name: 'Admin',
      role: 'admin',
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      cart: { items: [], total: 0 },
    };
    store.users.set('user-admin', adminUser);
    store.carts.set('user-admin', { items: [], total: 0 });
    console.log('👑 Admin user created: admin@sweetshop.com / admin123');
  }
}

// ============ SERVER STARTUP ============
initializeAdmin();
startOrderProcessor();

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`
🚀 E-commerce Server running on http://localhost:${PORT}
📡 WebSocket ready for connections
💾 In-memory data store initialized
🔄 Background order processor started
👑 Admin login: admin@sweetshop.com / admin123
🛒 E-commerce features: Auth, Cart, Orders, Admin Panel
  `);
});
