import time
import json
import random
from locust import HttpUser, task, between

class EcommerceUser(HttpUser):
    wait_time = between(1, 5)

    def on_start(self):
        """Login and get JWT token when user starts"""

        # Use timestamp + random number for truly unique emails
        import time
        unique_id = f"{int(time.time() * 1000)}{random.randint(1000, 9999)}"

        user_data = {
            "email": f"testuser{unique_id}@example.com",
            "password": "password123",
            "name": "Test User"
        }

        # Try to register first (will fail if user exists, that's ok)
        self.client.post("/api/auth/register", json=user_data)

        # Login to get token
        login_response = self.client.post("/api/auth/login", json={
            "email": user_data["email"],
            "password": user_data["password"]
        })

        if login_response.status_code == 200:
            self.token = login_response.json().get("token")
            self.user_id = login_response.json().get("user", {}).get("id")
            # Set authorization header for all subsequent requests
            self.client.headers.update({"Authorization": f"Bearer {self.token}"})
        else:
            # Fallback to admin user if test user creation fails
            admin_login = self.client.post("/api/auth/login", json={
                "email": "admin@sweetshop.com",
                "password": "admin123"
            })
            if admin_login.status_code == 200:
                self.token = admin_login.json().get("token")
                self.user_id = admin_login.json().get("user", {}).get("id")
                self.client.headers.update({"Authorization": f"Bearer {self.token}"})

    @task(3)  # Higher weight - most frequent operation
    def browse_products(self):
        """Test GET /api/products - High priority endpoint"""
        response = self.client.get("/api/products")
        if response.status_code == 200:
            products = response.json()
            if products:
                # Simulate browsing by randomly selecting a product
                self.current_product = random.choice(products)
        else:
            print(f"Failed to get products: {response.status_code}")

    @task(2)
    def add_to_cart(self):
        """Test POST /api/cart/add - Medium priority endpoint"""
        if hasattr(self, 'current_product'):
            # Add random quantity (1-3 items)
            quantity = random.randint(1, 3)
            cart_data = {
                "productId": self.current_product["id"],
                "quantity": quantity
            }

            response = self.client.post("/api/cart/add", json=cart_data)
            if response.status_code == 200:
                self.cart_items = response.json().get("items", [])
            else:
                print(f"Failed to add to cart: {response.status_code} - {response.text}")

    @task(1)
    def update_cart_item(self):
        """Test PUT /api/cart/update - Medium priority endpoint"""
        if hasattr(self, 'cart_items') and self.cart_items:
            # Update quantity of a random cart item
            cart_item = random.choice(self.cart_items)
            new_quantity = random.randint(1, 5)

            update_data = {
                "productId": cart_item["productId"],
                "quantity": new_quantity
            }

            response = self.client.put("/api/cart/update", json=update_data)
            if response.status_code == 200:
                self.cart_items = response.json().get("items", [])
            else:
                print(f"Failed to update cart: {response.status_code} - {response.text}")

    @task(1)
    def view_cart(self):
        """Test GET /api/cart - supporting cart operations"""
        response = self.client.get("/api/cart")
        if response.status_code == 200:
            self.cart_items = response.json().get("items", [])
        else:
            print(f"Failed to get cart: {response.status_code}")  