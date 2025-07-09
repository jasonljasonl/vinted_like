from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from base_models.base import Base


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    profile_picture = Column(String, nullable=True)
    username = Column(String, unique=True, index=True)
    name = Column(String)
    lastname = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    orders = relationship('UserOrder', back_populates='buyer_user')
