import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from accounts.account import router, User
from database_files.database_connection import SessionLocal

client = TestClient(router)

def test_create_user():
    payload = {
        "username": "jdoed",
        "name": "John",
        "lastname": "Doe",
        "email": "jdoem@example.com",
        "password": "secret123"
    }

    response = client.post('/users/', json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "jdoem"

    db = SessionLocal()
    user_in_db = db.query(User).filter(User.username == "jdoe").first()
    assert user_in_db is not None
    assert user_in_db.email == "jdoe@example.com"
    db.close()