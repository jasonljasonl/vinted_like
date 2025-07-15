import sys
import os

from backend.main import app

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
client = TestClient(app)

def test_connect_user():
    payload = {
        "username": "jdoe",
        "password": "secret123"
    }

    response = client.post("/token", data=payload)

    assert response.status_code == 200
    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"
