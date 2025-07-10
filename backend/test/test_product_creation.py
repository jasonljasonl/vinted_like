import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from products.models import Product
from fastapi.testclient import TestClient
from database_files.database_connection import SessionLocal
from main import app


client = TestClient(app)

"""def create_test_user(session):
    user = User(username="d", hashed_password=get_password_hash("d"), email='d@az.fr')
    session.add(user)
    session.commit()
"""
def test_create_product():
    db = SessionLocal()
#    create_test_user(db)
    db.close()

    response = client.post("/users/token", data={
        "username": "d",
        "password": "d"
    })

    print("LOGIN STATUS:", response.status_code)
    print("LOGIN RESPONSE:", response.json())
    assert response.status_code == 200, f"Erreur login: {response.json()}"

    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "name": "Test deux",
        "description": "My test productz",
        "price": 59.99,
    }

    response = client.post('/products/add', data=payload, headers=headers)
    print("RESPONSE STATUS:", response.status_code)
    print("RESPONSE JSON:", response.json())

    assert response.status_code == 200, f"Erreur création produit: {response.json()}"

    data = response.json()
    assert data["name"] == "Test deux"

    db = SessionLocal()
    product_in_db = db.query(Product).filter(Product.name == "Test deux").first()
    assert product_in_db is not None
    assert product_in_db.price == 59.99
    db.close()
