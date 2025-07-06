from pydantic import BaseModel, ConfigDict


class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    price: float


class ProductRead(BaseModel):
    id: int
    name: str
    description: str | None = None
    price: float

    model_config = ConfigDict(from_attributes=True)
