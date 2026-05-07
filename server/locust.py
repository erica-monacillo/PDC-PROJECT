import time
import random
from locust import HttpUser, task, between, SequentialTaskSet

class UserBehavior(SequentialTaskSet):
    def on_start(self):
        """User login flow"""

        unique_id = f"{int(time.time()*1000)}{random.randint(1000,9999)}"
        self.email = f"user{unique_id}@test.com"
        self.password = "password123"

        # Register
        with self.client.post("/api/auth/register", json={
            "email": self.email,
            "password": self.password,
            "name": "Load Test"
        }, catch_response=True) as res:
            if res.status_code not in [200, 201]:
                res.failure("Register failed")

        # Login
        with self.client.post("/api/auth/login", json={
            "email": self.email,
            "password": self.password
        }, catch_response=True) as res:
            if res.status_code == 200:
                data = res.json()
                self.token = data.get("token")
                self.client.headers.update({
                    "Authorization": f"Bearer {self.token}"
                })
            else:
                res.failure("Login failed")

    @task
    def full_user_flow(self):
        """Simulate real user journey"""

        # 1. Browse products
        self.product = None
        with self.client.get("/api/products", catch_response=True) as res:
            if res.status_code == 200:
                products = res.json()
                if not products:
                    res.failure("No products returned")
                else:
                    self.product = random.choice(products)
            else:
                res.failure("Failed to load products")

        if not self.product:
            return

        time.sleep(random.uniform(1, 3))

        # 2. Add to cart
        with self.client.post("/api/cart/add", json={
            "productId": self.product["id"],
            "quantity": random.randint(1, 3)
        }, catch_response=True) as res:
            if res.status_code != 200:
                res.failure("Add to cart failed")

        time.sleep(random.uniform(1, 2))

        # 3. View cart
        with self.client.get("/api/cart", catch_response=True) as res:
            if res.status_code != 200:
                res.failure("View cart failed")

        time.sleep(random.uniform(1, 2))

        # 4. Update cart
        with self.client.put("/api/cart/update", json={
            "productId": self.product["id"],
            "quantity": random.randint(2, 5)
        }, catch_response=True) as res:
            if res.status_code != 200:
                res.failure("Update cart failed")

        time.sleep(random.uniform(1, 2))


class EcommerceUser(HttpUser):
    host = "https://your-backend-host.com" # Replace with your actual backend URL
    tasks = [UserBehavior]