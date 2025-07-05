from fastapi import APIRouter
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session

from accounts.models import User
router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_user_by_username(session: Session, username: str):
    return session.query(User).filter(User.username == username).first()

async def authenticate_user(session: Session, username: str, password: str):
    user = get_user_by_username(session, username)
    if not user or user.password != password:
        return None
    return user