from datetime import timedelta
from typing import List

from fastapi import Depends, HTTPException, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette import status

from accounts.account_security import authenticate_user, get_password_hash, \
    ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, get_current_user, oauth2_scheme
from accounts.models import User
from accounts.pydantic_models import UserRead, UserCreate, Token
from database_files.database_connection import engine, get_session
from products.models import ShoppingCart
from products.pydantic_models import ShoppingCartRead

router = APIRouter()


@router.post("/add", response_model=UserRead)
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


@router.get("/", response_model=List[UserRead])
def read_all_users(session: Session = Depends(get_session)):
    db_product = session.query(User).all()
    for pr in db_product:
        print(pr.name)
    if not db_product:
        raise HTTPException(status_code=404, detail="No products.")
    return db_product


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



