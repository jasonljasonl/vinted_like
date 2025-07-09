from datetime import timedelta, datetime, timezone
from http.client import HTTPException

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session
from typing_extensions import Annotated

from accounts.models import User
from passlib.context import CryptContext
import jwt
from jwt.exceptions import InvalidTokenError

from accounts.pydantic_models import TokenData, UserInDB
from database_files.database_connection import get_session

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/token")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = '2521fbf46348a8311b30bd627cb6f74c67d94ac8eabdb35edc5228716a1cba20'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def get_user_by_username(session: Session, username: str):
    print(f"DEBUG: Searching for user: '{username}' in DB.")
    user = session.query(User).filter(User.username == username).first()
    if user:
        print(f"DEBUG: Found user: '{user.username}' (ID: {user.id})")
    else:
        print(f"DEBUG: User '{username}' NOT found in DB.")
    return user


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


async def authenticate_user(username: str, password: str, session: Session = Depends(get_session)):
    user = get_user_by_username(session, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({'exp':expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)],session: Session = Depends(get_session)):
    credentials_exception = HTTPException()
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user_by_username(session, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
        current_user: Annotated[User, Depends(get_user_by_username)],
):
    return current_user