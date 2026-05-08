import uuid
import random
from locust import HttpUser, SequentialTaskSet, task, between

class UserBehavior(SequentialTaskSet):

    def on_start(self):
        self.token = None
        self.product_id = None
        self.user_id = None

        # ── Generate unique user for each simulated user ──────
        unique_id = str(uuid.uuid4())[:8]
        self.email = f"user_{unique_id}@test.com"
        self.password = "password123"
        self.name = f"Test User {unique_id}"

        # ── REGISTER ──────────────────────────────────────────
        with self.client.post("/api/auth/register", json={
            "email": self.email,
            "password": self.password,
            "name": self.name,
            "role": "customer"
        }, catch_response=True) as res:
            if res.status_code in [200, 201]:
                res.success()
            else:
                res.failure(f"Register failed: {res.status_code} - {res.text}")
                return

        # ── LOGIN ─────────────────────────────────────────────
        with self.client.post("/api/auth/login", json={
            "email": self.email,
            "password": self.password
        }, catch_response=True) as res:
            if res.status_code == 200:
                data = res.json()
                self.token = data.get("token")
                if not self.token:
                    res.failure("No token returned")
                    return
                self.client.headers.update({
                    "Authorization": f"Bearer {self.token}"
                })
                res.success()
            else:
                res.failure(f"Login failed: {res.status_code} - {res.text}")
                return

    # ── AUTH ──────────────────────────────────────────────────
    @task
    def get_profile(self):
        if not self.token:
            return
        with self.client.get("/api/auth/profile", catch_response=True) as res:
            if res.status_code == 200:
                data = res.json()
                self.user_id = data.get("id") or data.get("_id")
                res.success()
            else:
                res.failure(f"Get profile failed: {res.status_code}")

    # ── PRODUCTS ──────────────────────────────────────────────
    @task
    def get_products(self):
        with self.client.get("/api/products", catch_response=True) as res:
            if res.status_code == 200:
                products = res.json()
                if products:
                    self.product_id = (
                        products[0].get("id") or products[0].get("_id")
                    )
                res.success()
            else:
                res.failure(f"Get products failed: {res.status_code}")

    # ── CART ──────────────────────────────────────────────────
    @task
    def view_cart(self):
        if not self.token:
            return
        with self.client.get("/api/cart", catch_response=True) as res:
            if res.status_code == 200:
                res.success()
            else:
                res.failure(f"View cart failed: {res.status_code}")

    @task
    def add_to_cart(self):
        if not self.token or not self.product_id:
            return
        with self.client.post("/api/cart/add", json={
            "productId": self.product_id,
            "quantity": random.randint(1, 3)
        }, catch_response=True) as res:
            if res.status_code in [200, 201]:
                res.success()
            else:
                res.failure(f"Add to cart failed: {res.status_code} - {res.text}")

    @task
    def update_cart(self):
        # ── FIX: use productId instead of itemId ──────────────
        if not self.token or not self.product_id:
            return
        with self.client.put("/api/cart/update", json={
            "productId": self.product_id,
            "quantity": random.randint(1, 5)
        }, catch_response=True) as res:
            if res.status_code == 200:
                res.success()
            else:
                res.failure(f"Update cart failed: {res.status_code} - {res.text}")

    # ── ORDERS ────────────────────────────────────────────────
    @task
    def place_order(self):
        if not self.token or not self.product_id:
            return

        # ── FIX: match exact backend customerInfo schema ──────
        payload = {
            "customerInfo": {
                "name": self.name,
                "email": self.email,
                "phone": "9876543210",
                "address": "123 MG Road",
                "city": "Jaipur",
                "state": "Rajasthan",
                "zipCode": "302001"
            }
        }

        with self.client.post("/api/orders", json=payload, catch_response=True) as res:
            if res.status_code in [200, 201]:
                res.success()
            else:
                res.failure(f"Place order failed: {res.status_code} - {res.text}")

    @task
    def get_orders(self):
        if not self.token:
            return
        with self.client.get("/api/orders", catch_response=True) as res:
            if res.status_code == 200:
                res.success()
            else:
                res.failure(f"Get orders failed: {res.status_code}")

    # ── CLEANUP ───────────────────────────────────────────────
    @task
    def delete_cart(self):
        if not self.token:
            return
        with self.client.delete("/api/cart", catch_response=True) as res:
            if res.status_code == 200:
                res.success()
            else:
                res.failure(f"Delete cart failed: {res.status_code}")


# ── MAIN USER ─────────────────────────────────────────────────
class PDCUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(1, 3)
    host = "https://pdc-project.onrender.com"