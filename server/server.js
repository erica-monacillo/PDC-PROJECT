import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { initializeDatabaseSystem } from './database-factory.js';

// Database modules (initialized later)
let db, userModel, productModel, orderModel, cartModel, testConnection, initializeDatabase;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://pdc-project.vercel.app',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    methods: ['GET', 'POST']
  }
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://pdc-project.vercel.app',
    process.env.FRONTEND_URL,
  ].filter(Boolean)
}));

app.use(express.json());

// PDC: Show which worker handled the request
app.use((req, res, next) => {
  res.setHeader('X-Worker-Port', process.env.PORT || 3001);
  next();
});

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Homepage
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>PDC-PROJECT API</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
        h1 { color: #333; }
        h2 { color: #555; }
        .status { background: #4CAF50; color: white; padding: 10px 15px; border-radius: 5px; display: inline-block; margin-bottom: 20px; }
        .endpoint { background: white; padding: 12px 15px; margin: 8px 0; border-radius: 5px; border-left: 4px solid #4CAF50; display: flex; align-items: center; gap: 10px; }
        .method-get { font-weight: bold; color: #4CAF50; min-width: 50px; }
        .method-post { font-weight: bold; color: #2196F3; min-width: 50px; }
        .method-put { font-weight: bold; color: #FF9800; min-width: 50px; }
        .method-delete { font-weight: bold; color: #f44336; min-width: 50px; }
        a { color: #333; text-decoration: none; }
        a:hover { text-decoration: underline; color: #4CAF50; }
        .uptime { color: #888; margin-top: 20px; font-size: 14px; }
        .note { background: #fff3cd; padding: 10px; border-radius: 5px; font-size: 13px; color: #856404; margin-top: 5px; }
      </style>
    </head>
    <body>
      <h1>PDC-PROJECT API</h1>
      <div class="status">Server is running</div>

      <h2>API Endpoints</h2>
      <div class="note">GET endpoints are clickable. POST/PUT/DELETE require a tool like Postman.</div>

      <h3>Auth</h3>
      <div class="endpoint"><span class="method-post">POST</span> /api/auth/register</div>
      <div class="endpoint"><span class="method-post">POST</span> /api/auth/login</div>
      <div class="endpoint"><span class="method-get">GET</span> <a href="/api/auth/profile" target="_blank">/api/auth/profile</a></div>

      <h3>Products</h3>
      <div class="endpoint"><span class="method-get">GET</span> <a href="/api/products" target="_blank">/api/products</a></div>

      <h3>Cart</h3>
      <div class="endpoint"><span class="method-get">GET</span> /api/cart (requires login)</div>
      <div class="endpoint"><span class="method-post">POST</span> /api/cart/add</div>
      <div class="endpoint"><span class="method-put">PUT</span> /api/cart/update</div>
      <div class="endpoint"><span class="method-delete">DELETE</span> /api/cart</div>

      <h3>Orders</h3>
      <div class="endpoint"><span class="method-get">GET</span> /api/orders (requires login)</div>
      <div class="endpoint"><span class="method-post">POST</span> /api/orders</div>

      <h3>Admin</h3>
      <div class="endpoint"><span class="method-get">GET</span> /api/admin/orders (admin only)</div>
      <div class="endpoint"><span class="method-get">GET</span> /api/admin/users (admin only)</div>

      <p class="uptime">⏱️ Uptime: ${Math.floor(process.uptime())} seconds</p>
    </body>
    </html>
  `);
});

// ============ DATABASE INITIALIZATION ============
async function initializeApp() {
  try {
    // Initialize database system
    const dbSystem = await initializeDatabaseSystem();
    db = dbSystem.db;
    userModel = dbSystem.userModel;
    productModel = dbSystem.productModel;
    orderModel = dbSystem.orderModel;
    cartModel = dbSystem.cartModel;
    testConnection = dbSystem.testConnection;
    initializeDatabase = dbSystem.initializeDatabase;

    console.log('Database system initialized:', {
      hasProductModel: !!productModel,
      productModelKeys: productModel ? Object.keys(productModel) : 'undefined'
    });

    // Test database connection
    const connected = await testConnection();
    if (!connected) {
      console.error('Failed to connect to database. Please check your configuration.');
      process.exit(1);
    }

    // Initialize database schema
    try {
      await initializeDatabase();
    } catch (err) {
      if (err.code === '23505') {
        console.log('Database schema already exists, skipping...');
      } else {
        throw err;
      }
    }

    // ── Initialize User ID Sequence (db is ready here!) ──
    try {
      await db.query(`CREATE SEQUENCE IF NOT EXISTS user_id_seq`);
      await db.query(`
        SELECT setval('user_id_seq',
          COALESCE(MAX(CAST(SUBSTRING(id FROM 6) AS INTEGER)), 0))
        FROM users
        WHERE id ~ '^user-[0-9]+$'
      `);
      console.log('✅ User ID sequence initialized');
    } catch (seqError) {
      console.error('Warning: Could not initialize user_id_seq:', seqError.message);
    }

    // Initialize products if they don't exist
    await initializeProducts();

    console.log('✅ Application initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    process.exit(1);
  }
}

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

// Initialize products in database
async function initializeProducts() {
  const existingProducts = await productModel.getAllProducts();
  if (existingProducts.length === 0) {
    console.log('Initializing products...');
    for (const product of initialProducts) {
      await productModel.createProduct(product);
    }
    console.log('Products initialized');
  }
}

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

  try {
    // Check if user already exists
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get next user ID
    const userId = await userModel.getNextUserId();

    // Create user
    const user = await userModel.createUser({
      id: userId,
      email,
      name,
      password: hashedPassword,
      role
    });

    // Create cart for user
    await cartModel.createCart(userId);

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
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.getUserByEmail(email);
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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await userModel.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============ PRODUCT ENDPOINTS ============

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product
app.get('/api/products/:productId', async (req, res) => {
  try {
    const product = await productModel.getProductById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ====== REMOVE BEFORE PRODUCTION ======
app.get('/api/test/reset-stock', async (req, res) => {
  try {
    const products = ['prod-1','prod-2','prod-3','prod-4',
                      'prod-5','prod-6','prod-7','prod-8'];
    for (const id of products) {
      await productModel.updateProductStock(id, 999);
    }
    res.json({ success: true, message: 'All stock reset to 999' });
  } catch (error) {
    console.error('Reset stock error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// ====== REMOVE BEFORE PRODUCTION ======

// Update product (admin only)
app.put('/api/products/:productId', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const product = await productModel.getProductById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { name, price, description, stock, category } = req.body;
    const updatedProduct = await productModel.updateProduct(req.params.productId, {
      name: name || product.name,
      price: price || product.price,
      description: description || product.description,
      stock: stock !== undefined ? stock : product.stock,
      category: category || product.category,
      image: product.image
    });

    broadcastProducts();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============ CART ENDPOINTS ============

// Get user's cart
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const cart = await cartModel.getCartByUserId(req.user.id);
    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add item to cart
app.post('/api/cart/add', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    const product = await productModel.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    let cart = await cartModel.getCartByUserId(userId);

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

    await cartModel.updateCart(userId, cart.items, cart.total);
    broadcastCartUpdate(userId);

    res.json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update cart item quantity
app.put('/api/cart/update', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    let cart = await cartModel.getCartByUserId(userId);

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

    await cartModel.updateCart(userId, cart.items, cart.total);
    broadcastCartUpdate(userId);

    res.json(cart);
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear cart
app.delete('/api/cart', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    await cartModel.clearCart(userId);
    broadcastCartUpdate(userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============ ORDER ENDPOINTS ============

// Get all orders (admin) or user's orders (customer)
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'admin') {
      orders = await orderModel.getAllOrders();
    } else {
      orders = await orderModel.getOrdersByUserId(req.user.id);
    }
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create order from cart
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { customerInfo } = req.body;
    const cart = await cartModel.getCartByUserId(userId);

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
      const product = await productModel.getProductById(item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${item.name}` });
      }
    }

    // Use transaction to ensure data consistency
    const result = await db.transaction(async (client) => {
      // Reduce stock
      for (const item of cart.items) {
        const product = await productModel.getProductById(item.productId);
        await productModel.updateProductStock(item.productId, product.stock - item.quantity);
      }

      // Get next order ID
      const orderId = await orderModel.getNextOrderId();

      // Create order
      const order = await orderModel.createOrder({
        id: orderId,
        userId,
        customerInfo,
        items: cart.items,
        totalPrice: cart.total,
        status: 'pending'
      });

      // Clear cart
      await cartModel.clearCart(userId);

      return order;
    });

    broadcastOrders();
    broadcastProducts();

    res.json({ success: true, order: result });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single order
app.get('/api/orders/:orderId', authenticateToken, async (req, res) => {
  try {
    const order = await orderModel.getOrderById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel order
app.post('/api/orders/:orderId/cancel', authenticateToken, async (req, res) => {
  try {
    const order = await orderModel.getOrderById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (order.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel completed order' });
    }

    const updatedOrder = await db.transaction(async (client) => {
      for (const item of order.items) {
        const product = await productModel.getProductById(item.productId);
        if (product) {
          await productModel.updateProductStock(item.productId, product.stock + item.quantity);
        }
      }
      return await orderModel.updateOrderStatus(req.params.orderId, 'cancelled');
    });

    broadcastOrders();
    broadcastProducts();
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status (admin only)
app.put('/api/orders/:orderId/status', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderModel.getOrderById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    let updatedOrder;
    if (status === 'cancelled' && order.status !== 'cancelled') {
      updatedOrder = await db.transaction(async (client) => {
        for (const item of order.items) {
          const product = await productModel.getProductById(item.productId);
          if (product) {
            await productModel.updateProductStock(item.productId, product.stock + item.quantity);
          }
        }
        return await orderModel.updateOrderStatus(req.params.orderId, status);
      });
    } else {
      updatedOrder = await orderModel.updateOrderStatus(req.params.orderId, status);
    }

    broadcastOrders();
    broadcastProducts();
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============ ADMIN ENDPOINTS ============

// Get all orders (admin only)
app.get('/api/admin/orders', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const orders = await orderModel.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user role (admin only)
app.put('/api/admin/users/:userId/role', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await userModel.getUserById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!['admin', 'customer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const updatedUser = await userModel.updateUserRole(req.params.userId, role);
    res.json({ success: true, user: { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name, role: updatedUser.role } });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============ HELPER FUNCTIONS ============

async function broadcastOrders() {
  try {
    const ordersArray = await orderModel.getAllOrders();
    io.emit('orders-updated', ordersArray);
  } catch (error) {
    console.error('Error broadcasting orders:', error);
  }
}

async function broadcastProducts() {
  try {
    const productsArray = await productModel.getAllProducts();
    io.emit('products-updated', productsArray);
  } catch (error) {
    console.error('Error broadcasting products:', error);
  }
}

async function broadcastCartUpdate(userId) {
  try {
    const cart = await cartModel.getCartByUserId(userId);
    io.to(userId).emit('cart-updated', cart);
  } catch (error) {
    console.error('Error broadcasting cart update:', error);
  }
}

// ============ WEBSOCKET EVENTS ============
io.on('connection', async (socket) => {
  console.log(`🔗 User connected: ${socket.id}`);

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

  try {
    const products = await productModel.getAllProducts();
    const orders = await orderModel.getAllOrders();
    socket.emit('products-updated', products);
    socket.emit('orders-updated', orders);
  } catch (error) {
    console.error('Error sending initial data:', error);
  }

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// ============ BACKGROUND WORKER ============
async function startOrderProcessor() {
  setInterval(async () => {
    try {
      const allOrders = await orderModel.getAllOrders();
      const pendingOrders = allOrders.filter(order => order.status === 'pending').slice(0, 3);

      for (const order of pendingOrders) {
        setTimeout(async () => {
          try {
            await orderModel.updateOrderStatus(order.id, 'processing');
            await broadcastOrders();

            setTimeout(async () => {
              try {
                await orderModel.updateOrderStatus(order.id, 'completed');
                await broadcastOrders();
                io.emit('order-completed', order);
              } catch (error) {
                console.error('Error completing order:', error);
              }
            }, 10000);
          } catch (error) {
            console.error('Error processing order:', error);
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Error in order processor:', error);
    }
  }, 30000);
}

// ============ INITIALIZE ADMIN USER ============
async function initializeAdmin() {
  try {
    const adminExists = await userModel.getUserByEmail('admin@sweetshop.com');
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await userModel.createUser({
        id: 'user-admin',
        email: 'admin@sweetshop.com',
        name: 'Admin',
        password: hashedPassword,
        role: 'admin'
      });
      await cartModel.createCart('user-admin');
      console.log('👑 Admin user created: admin@sweetshop.com / admin123');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
}

// ============ SERVER STARTUP ============
const PORT = process.env.PORT || 3001;

initializeApp().then(() => {
  initializeAdmin();
  // startOrderProcessor(); // disabled - admin controls manually

  httpServer.listen(PORT, () => {
    console.log(`
 E-commerce Server running on http://localhost:${PORT}
 WebSocket ready for connections
 PostgreSQL database connected
 Background order processor started
 Admin login: admin@sweetshop.com / admin123
 E-commerce features: Auth, Cart, Orders, Admin Panel
    `);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});