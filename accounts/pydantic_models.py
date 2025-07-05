from pydantic import BaseModel

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

    class Config:
        orm_mode = True
