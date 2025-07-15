from datetime import timedelta
from typing import List
from uuid import uuid4

from fastapi import Depends, HTTPException, APIRouter, Form, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette import status

from backend.accounts.account_security import get_password_hash, authenticate_user, ACCESS_TOKEN_EXPIRE_MINUTES, \
    create_access_token
from backend.accounts.models import User
from backend.accounts.pydantic_models import UserRead, Token
from backend.database_files.database_connection import get_session
from backend.products.models import ShoppingCart
from backend.products.pydantic_models import ShoppingCartRead

router = APIRouter()


@router.post("/register", response_model=UserRead)
async def create_user(
    username: str = Form(...),
    email: str = Form(...),
    name: str = Form(...),
    lastname: str = Form(...),
    hashed_password: str = Form(...),
    profilePicture: UploadFile = File(None),
    session: Session = Depends(get_session),
):
    profile_picture_path = None
    if profilePicture:
        if not profilePicture.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Not an image.")
        extension = profilePicture.filename.split(".")[-1]
        file_name = f"{uuid4().hex}.{extension}"
        image_path = f"backend/statics_files/images/profile_pictures/{file_name}"
        with open(image_path, "wb") as f:
            f.write(await profilePicture.read())
        profile_picture_path = image_path

    db_user = User(
        username=username,
        email=email,
        name=name,
        lastname=lastname,
        profile_picture=profile_picture_path,
        hashed_password=get_password_hash(hashed_password)
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
        raise HTTPException(status_code=404, detail="No users.")
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


@router.get('/carts/', response_model=List[ShoppingCartRead])
def read_all_shopping_cart(session: Session = Depends(get_session)):
    db_cart = session.query(ShoppingCart).all()
    if not db_cart:
        raise HTTPException(status_code=404, detail="No carts.")
    return db_cart


