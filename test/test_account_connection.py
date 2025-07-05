import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from accounts.account import router


from fastapi.testclient import TestClient
from accounts.account import User
from database_files.database_connection import SessionLocal

client = TestClient(router)

def test_connect_user():
    payload = {
        "username": "jdoed",
        "password": "secret123"
    }

    response = client.post('/token/', json=payload)
    assert response.status_code == 200
    data = response.json()
