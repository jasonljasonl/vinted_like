from typing import List

from pydantic import BaseModel

from backend.products.pydantic_models import UserOrderRead


class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    name: str | None = None
    lastname: str | None = None

class UserRead(BaseModel):
    id: int
    username: str
    email: str
    name: str | None = None
    lastname: str | None = None
    profile_picture: str | None = None
    model_config = {"from_attributes": True}
    orders : List[UserOrderRead] = []



class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None