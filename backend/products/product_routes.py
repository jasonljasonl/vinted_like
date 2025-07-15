import os
import sys
from datetime import datetime
from typing import List
from uuid import uuid4

from backend.accounts.models import User

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from sqlalchemy.orm import Session
from backend.accounts.account_security import oauth2_scheme, get_current_user
from backend.database_files.database_connection import get_session
from backend.products.models import Product, ShoppingCart, ShoppingCartItem, UserOrder, ProductImage
from backend.products.pydantic_models import ProductRead, ProductUpdate, ShoppingCartRead,\
    UserOrderRead

router = APIRouter()


@router.post("/add", response_model=ProductRead)
async def create_product(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    product_images: List[UploadFile] = File([]),
    session: Session = Depends(get_session),
    token: str = Depends(oauth2_scheme)
    ):
    user = await get_current_user(token, session)

    db_product = Product(
        created_by=user.id,
        name=name,
        description=description,
        price=price,
    )
    session.add(db_product)
    session.commit()
    session.refresh(db_product)

    saved_images: list[ProductImage] = []
    for file in product_images:
        if not file.content_type.startswith("image/"):
            continue
        ext = file.filename.rsplit(".", 1)[-1]
        file_name = f"{uuid4().hex}.{ext}"
        image_path = f"backend/statics_files/images/product_images/{file_name}"
        with open(image_path, "wb") as out:
            out.write(await file.read())
        img = ProductImage(product_id=db_product.id, url=image_path)
        session.add(img)
        saved_images.append(img)

    session.commit()
    session.refresh(db_product)
    return db_product


@router.get("/{product_id}", response_model=ProductRead)
def read_product(product_id: int, session: Session = Depends(get_session)):
    db_product = session.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product


@router.put('/{product_id}/update', response_model=ProductRead)
async def update_product(product_id: int, product: ProductUpdate, session: Session = Depends(get_session), token: str = Depends(oauth2_scheme)):
    db_product = session.get(Product, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail='Product not found')
    connected_user = await get_current_user(token, session)
    product_data = product.model_dump(exclude_unset=True)
    if connected_user.id == db_product.created_by:
        for key, value in product_data.items():
            setattr(db_product, key, value)
            session.commit()
            session.refresh(db_product)
    else:
        raise HTTPException(status_code=401, detail='Not authorized')
    return db_product


@router.delete('/{product_id}/delete')
async def delete_product(product_id: int, session: Session = Depends(get_session), token: str = Depends(oauth2_scheme)):
    db_product = session.get(Product, product_id)
    connected_user = await get_current_user(token, session)
    if not db_product:
        raise HTTPException(status_code=404, detail='Product not found')
    if connected_user.id == db_product.created_by:
        session.delete(db_product)
        session.commit()
    else:
        raise HTTPException(status_code=401, detail='Not authorized')
    return {'Product deleted':True}


def get_or_create_cart(user_id: int, session: Session) -> ShoppingCart:
    cart = session.query(ShoppingCart).filter(ShoppingCart.owner == user_id).first()
    if not cart:
        cart = ShoppingCart(owner=user_id)
        session.add(cart)
        session.commit()
        session.refresh(cart)
    return cart


async def create_order(connected_user: User, session: Session):
    shopping_cart = get_or_create_cart(connected_user.id, session)

    db_order = UserOrder(
        buyer=connected_user.id,
        shopping_cart_id=shopping_cart.id,
        created_at=datetime.now()
    )

    session.add(db_order)
    session.commit()
    session.refresh(db_order)

    return db_order


@router.post('/orders/', response_model=UserOrderRead)
async def read_orders(session: Session = Depends(get_session), token: str = Depends(oauth2_scheme)):
    connected_user  = await get_current_user(token, session)

    valid_cart = await create_order(connected_user, session)

    return valid_cart



@router.post('/{product_id}/add_to_cart', response_model=ShoppingCartRead)
async def product_add_to_cart(product_id: int, session: Session = Depends(get_session), token: str = Depends(oauth2_scheme)):
    connected_user  = await get_current_user(token, session)
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    shopping_cart = get_or_create_cart(connected_user.id, session)

    item = ShoppingCartItem(shopping_cart_id=shopping_cart.id, product_id=product.id)
    session.add(item)
    shopping_cart.total_amount = shopping_cart.total_amount + product.price

    session.commit()
    session.refresh(shopping_cart)
    return shopping_cart



@router.get("/", response_model=List[ProductRead])
def read_all_product(session: Session = Depends(get_session)):
    db_product = session.query(Product).all()
    if not db_product:
        raise HTTPException(status_code=404, detail="No products.")
    return db_product
