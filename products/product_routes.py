import os
import sys
from typing import List

sys.path.append(os.path.dirname(os.path.dirname(__file__)))


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from accounts.account_security import oauth2_scheme, get_current_user
from database_files.database_connection import get_session
from products.models import Product
from products.pydantic_models import ProductRead, ProductCreate, ProductUpdate

router = APIRouter()


@router.post("/add", response_model=ProductRead)
async def create_product(product: ProductCreate, session: Session = Depends(get_session), token: str = Depends(oauth2_scheme)):
    user = await get_current_user(token, session)
    db_product = Product(
        created_by=user.id,
        name=product.name,
        description=product.description,
        price=product.price,
    )
    session.add(db_product)
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


@router.get("/", response_model=List[ProductRead])
def read_all_product(session: Session = Depends(get_session)):
    db_product = session.query(Product).all()
    if not db_product:
        raise HTTPException(status_code=404, detail="No products.")
    return db_product

