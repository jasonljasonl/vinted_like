from datetime import timedelta

from fastapi import FastAPI, Depends, HTTPException, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette import status
from typing_extensions import Annotated

from accounts.account_security import oauth2_scheme, get_user_by_username, authenticate_user, get_password_hash, \
    ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, get_current_active_user, get_current_user
from accounts.models import User
from accounts.pydantic_models import UserRead, UserCreate, Token
from database_files.database_connection import engine, get_session

router = APIRouter()


@router.post("/", response_model=UserRead)
def create_user(user: UserCreate, session: Session = Depends(get_session)):
    db_user = User(
        username=user.username,
        email=user.email,
        name=user.name,
        lastname=user.lastname,
        hashed_password=get_password_hash(user.password)
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

@router.get("/{user_username}", response_model=UserRead)
def read_user(user_username: str, session: Session = Depends(get_session)):
    db_user = session.query(User).filter(User.username == user_username).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


"""
@router.post("/token")
async def login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        session: Session = Depends(get_session)
):
    user = await authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {"access_token": user.username, "token_type": "bearer"}
"""

@router.post('/token')
async def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends(),
        session: Session = Depends(get_session)
) -> Token:
    user = await authenticate_user(form_data.username, form_data.password,session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect username or password',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={'sub': user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type='bearer')



