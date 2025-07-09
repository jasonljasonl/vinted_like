from datetime import datetime
from typing import List

from pydantic import BaseModel, ConfigDict


class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    price: float

class ProductImageRead(BaseModel):
    id: int
    url: str
    model_config = ConfigDict(from_attributes=True)

class ProductRead(BaseModel):
    id: int
    created_by: int
    name: str
    description: str | None = None
    price: float
    product_images: list[ProductImageRead]
    model_config = ConfigDict(from_attributes=True)


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None


class ShoppingCartItemRead(BaseModel):
    id: int
    product: ProductRead

    class Config:
        orm_mode = True

class ShoppingCartRead(BaseModel):
    id: int
    owner: int
    items: List[ShoppingCartItemRead]
    total_amount: float

    model_config = ConfigDict(from_attributes=True)


class UserOrderCreate(BaseModel):
    buyer: int
    shopping_cart_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserOrderRead(BaseModel):
    id: int
    buyer: int
    shopping_cart_id: int
    created_at: datetime
    related_shopping_cart: ShoppingCartRead

    model_config = ConfigDict(from_attributes=True)

