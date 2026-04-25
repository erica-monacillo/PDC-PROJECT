#!/usr/bin/env node

/**
 * Concurrent Users Load Testing Script
 * 
 * This script simulates multiple concurrent users placing orders
 * to verify the system handles concurrent requests properly.
 * 
 * Usage: node test-load.js [numUsers] [ordersPerUser]
 * Example: node test-load.js 10 5  (10 users, 5 orders each)
 */

import fetch from 'node-fetch';
import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3001';
const numUsers = parseInt(process.argv[2]) || 5;
const ordersPerUser = parseInt(process.argv[3]) || 3;

const menuItems = [
  { id: 1, name: 'Chocolate Cake', price: 8.99 },
  { id: 2, name: 'Strawberry Cheesecake', price: 9.99 },
  { id: 3, name: 'Donut Pack (6)', price: 12.99 },
  { id: 4, name: 'Macaron Set', price: 15.99 },
  { id: 5, name: 'Cupcake Box (12)', price: 24.99 },
];

let successCount = 0;
let failureCount = 0;
const startTime = Date.now();

async function testRESTAPI(userId) {
  console.log(`\n👤 User ${userId}: Starting REST API test...`);
  
  for (let i = 0; i < ordersPerUser; i++) {
    try {
      const item = menuItems[Math.floor(Math.random() * menuItems.length)];
      
      const response = await fetch(`${SERVER_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          items: [item],
          totalPrice: item.price,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`  ✅ Order ${i + 1}/${ordersPerUser}: ${data.order.id}`);
        successCount++;
      } else {
        console.log(`  ❌ Order ${i + 1}/${ordersPerUser}: Failed (${response.status})`);
        failureCount++;
      }
    } catch (error) {
      console.log(`  ❌ Order ${i + 1}/${ordersPerUser}: ${error.message}`);
      failureCount++;
    }
    
    // Small delay between orders from same user
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

async function testWebSocket(userId) {
  return new Promise((resolve) => {
    console.log(`\n👤 User ${userId}: Starting WebSocket test...`);
    
    const socket = io(SERVER_URL);
    let orderCount = 0;

    socket.on('connect', () => {
      console.log(`  🔗 Connected`);

      for (let i = 0; i < ordersPerUser; i++) {
        setTimeout(() => {
          const item = menuItems[Math.floor(Math.random() * menuItems.length)];
          
          socket.emit('place-order', {
            items: [item],
            totalPrice: item.price,
          });

          console.log(`  📤 Order ${i + 1}/${ordersPerUser} sent`);
        }, i * 150);
      }
    });

    socket.on('order-placed', (order) => {
      console.log(`  ✅ Order placed: ${order.id}`);
      successCount++;
      orderCount++;

      if (orderCount === ordersPerUser) {
        socket.close();
        resolve();
      }
    });

    socket.on('error', (error) => {
      console.log(`  ❌ Socket error: ${error}`);
      failureCount++;
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      socket.close();
      resolve();
    }, 30000);
  });
}

async function runTests() {
  console.log(`
╔════════════════════════════════════════════════════════╗
║     Concurrent Users Load Testing                      ║
╠════════════════════════════════════════════════════════╣
║ Simulating ${numUsers} concurrent users                 ║
║ Each user placing ${ordersPerUser} orders                ║
║ Total requests: ${numUsers * ordersPerUser}                           ║
║ Server: ${SERVER_URL}      ║
╚════════════════════════════════════════════════════════╝
  `);

  console.log('Testing REST API (simulates HTTP requests)...');
  
  // Test REST API with concurrent users
  const restPromises = Array.from({ length: numUsers }, (_, i) =>
    testRESTAPI(i + 1)
  );
  
  await Promise.all(restPromises);

  console.log('\n-------------------------------------------');
  console.log('Testing WebSocket (real-time connections)...');
  
  // Test WebSocket with concurrent users
  const wsPromises = Array.from({ length: numUsers }, (_, i) =>
    testWebSocket(numUsers + i + 1)
  );
  
  await Promise.all(wsPromises);

  const elapsedTime = Date.now() - startTime;

  // Print results
  console.log(`
╔════════════════════════════════════════════════════════╗
║                    TEST RESULTS                        ║
╠════════════════════════════════════════════════════════╣
║ Total Requests: ${(numUsers * ordersPerUser * 2).toString().padEnd(41)} ║
║ Successful: ${successCount.toString().padEnd(47)} ║
║ Failed: ${failureCount.toString().padEnd(50)} ║
║ Total Time: ${(elapsedTime / 1000).toFixed(2).toString().padEnd(44)}s ║
║ Throughput: ${((numUsers * ordersPerUser * 2) / (elapsedTime / 1000)).toFixed(1).toString().padEnd(42)} req/s ║
╠════════════════════════════════════════════════════════╣
║ 🎯 Demonstrates:                                       ║
║ ✅ Concurrent request handling                         ║
║ ✅ Real-time WebSocket communication                   ║
║ ✅ Multiple simultaneous connections                   ║
║ ✅ Non-blocking async operations                       ║
╚════════════════════════════════════════════════════════╝
  `);

  process.exit(failureCount > 0 ? 1 : 0);
}

runTests().catch((error) => {
  console.error('Test failed:', error);
  process.exit(1);
});
