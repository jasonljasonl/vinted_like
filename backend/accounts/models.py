from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from backend.base_models.base import Base


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    profile_picture = Column(String, nullable=True)
    username = Column(String, unique=True, index=True, nullable=False)
    name = Column(String)
    lastname = Column(String)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    orders = relationship('UserOrder', back_populates='buyer_user')
    extend_existing = True
