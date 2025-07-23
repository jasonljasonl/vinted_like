from datetime import timedelta
from typing import List
from uuid import uuid4

from fastapi import Depends, HTTPException, APIRouter, Form, UploadFile, File, Query
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session, joinedload, selectinload
from starlette import status

from backend.accounts.account_security import get_password_hash, authenticate_user, ACCESS_TOKEN_EXPIRE_MINUTES, \
    create_access_token, oauth2_scheme, get_current_user
from backend.accounts.models import User
from backend.accounts.pydantic_models import UserRead, Token
from backend.database_files.database_connection import get_session
from backend.products.models import ShoppingCart, ShoppingCartItem, UserOrder, Product
from backend.products.product_routes import get_or_create_cart, update_cart_total
from backend.products.pydantic_models import ShoppingCartRead, ShoppingCartItemRead, UserOrderRead

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

@router.get("/id/{user_id}", response_model=UserRead)
def read_user_by_id(user_id: int, session: Session = Depends(get_session)):
    db_user = session.query(User).filter(User.id == user_id).first()
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


@router.get('/cart/', response_model=ShoppingCartRead)
async def read_user_cart(session: Session = Depends(get_session), token: str = Depends(oauth2_scheme)):
    user = await get_current_user(token, session)
    cart = get_or_create_cart(user.id, session)

    return cart


@router.get('/cart/items', response_model=List[ShoppingCartItemRead])
async def get_cart_items(
    session: Session = Depends(get_session),
    token: str = Depends(oauth2_scheme)
):
    user = await get_current_user(token, session)
    cart = get_or_create_cart(user.id, session)

    items = session.query(ShoppingCartItem).filter(
        ShoppingCartItem.shopping_cart_id == cart.id
    ).all()

    return items


@router.delete('/cart/items/{item_id}')
def remove_cart_item(item_id: int, session: Session = Depends(get_session)):
    cart_item = session.query(ShoppingCartItem).filter(ShoppingCartItem.id == item_id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail='Not found')

    shopping_cart = session.get(ShoppingCart, cart_item.shopping_cart_id)
    if shopping_cart is None:
        raise HTTPException(status_code=404, detail="Shopping cart not found")

    session.delete(cart_item)
    session.commit()

    update_cart_total(shopping_cart, session)
    session.commit()

    return {"message": f"Item {item_id} removed"}


@router.get('/me/', response_model=UserRead)
async def get_me(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    user = await get_current_user(token, session)
    return user


@router.get("/search/")
def search_users(query: str = Query(...), session: Session = Depends(get_session)):
    return session.query(User).filter(User.username.ilike(f"%{query}%")).all()


@router.get("/orders/", response_model=List[UserOrderRead])
async def get_my_orders(
        session: Session = Depends(get_session),
        token: str = Depends(oauth2_scheme)
):
    user = await get_current_user(token, session)

    orders = session.query(UserOrder).filter(UserOrder.buyer == user.id) \
        .options(
        selectinload(UserOrder.related_shopping_cart)
        .selectinload(ShoppingCart.items)
        .selectinload(ShoppingCartItem.product)
    ).all()

    return orders