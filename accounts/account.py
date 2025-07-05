from fastapi import FastAPI, Depends, HTTPException, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from accounts.account_security import oauth2_scheme, get_user_by_username, authenticate_user
from accounts.models import User
from accounts.pydantic_models import UserRead, UserCreate
from database_files.database_connection import engine, get_session

router = APIRouter()


@router.post("/users/", response_model=UserRead)
def create_user(user: UserCreate, session: Session = Depends(get_session)):
    db_user = User(
        username=user.username,
        email=user.email,
        password=user.password,
        name=user.name,
        lastname=user.lastname,
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

@router.get("/users/{user_username}", response_model=UserRead)
def read_user(user_username: str, session: Session = Depends(get_session)):
    db_user = session.query(User).filter(User.username == user_username).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.post("/token")
async def login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        session: Session = Depends(get_session)
):
    user = await authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {"access_token": user.username, "token_type": "bearer"}


@router.get("/users/me")
async def read_users_me(
        token: str = Depends(oauth2_scheme),
        session: Session = Depends(get_session)
):
    user = get_user_by_username(session, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "username": user.username,
        "email": user.email,
        "name": user.name,
        "lastname": user.lastname
    }