import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from base_models.base import Base
from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from accounts.models import User


class Product(Base):
    __tablename__ = "product"

    id = Column(Integer, primary_key=True, index=True)
    created_by = Column(Integer, ForeignKey(User.id), nullable=False)
    name = Column(String)
    description = Column(Text)
    price = Column(Float)

