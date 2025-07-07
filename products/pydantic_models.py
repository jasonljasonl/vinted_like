from typing import List

from pydantic import BaseModel, ConfigDict


class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    price: float


class ProductRead(BaseModel):
    id: int
    created_by: int
    name: str
    description: str | None = None
    price: float

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

    model_config = ConfigDict(from_attributes=True)


