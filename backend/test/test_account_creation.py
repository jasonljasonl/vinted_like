import sys
import os

from backend.upload_system import router

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient

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