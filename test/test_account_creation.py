import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from accounts.account_routes import router

client = TestClient(router)

def test_create_user():
    payload = {
        "username": "b",
        "name": "b",
        "lastname": "b",
        "email": "b@example.com",
        "password": "b"
    }

    response = client.post('/add', data=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "User created"
    assert data["user"]["username"] == "b"