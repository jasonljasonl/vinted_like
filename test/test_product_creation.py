import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from products.models import Product
from fastapi.testclient import TestClient
from accounts.account_routes import router, User
from database_files.database_connection import SessionLocal
from main import app


client = TestClient(app)

def test_create_product():
    token = 'jdoe'
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "name": "Product",
        "description": "My first product",
        "price": 59.99,
    }

    response = client.post('/products/', json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Product"

    db = SessionLocal()
    product_in_db = db.query(Product).filter(Product.name == "Product").first()
    assert product_in_db is not None
    assert product_in_db.price == 59.99
    db.close()