import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from accounts.account_security import get_user_by_username, oauth2_scheme
from database_files.database_connection import get_session
from products.models import Product
from products.pydantic_models import ProductRead, ProductCreate

router = APIRouter()


@router.post("/products/", response_model=ProductRead)
def create_product(product: ProductCreate, session: Session = Depends(get_session), token: str = Depends(oauth2_scheme)):
    user = get_user_by_username(session,token)
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

