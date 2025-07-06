import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from accounts.account_routes import router, User
from database_files.database_connection import SessionLocal

client = TestClient(router)

def test_create_user():
    payload = {
        "username": "jasona",
        "name": "jason",
        "lastname": "jason",
        "email": "jasona@example.com",
        "password": "secret123"
    }

    response = client.post('/users/', json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "jasona"

    db = SessionLocal()
    user_in_db = db.query(User).filter(User.username == "jason").first()
    assert user_in_db is not None
    assert user_in_db.email == "jason@example.com"
    db.close()