import os
import sys

from sqlalchemy.orm import relationship

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from base_models.base import Base
from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, JSON, Table

from accounts.models import User


class Product(Base):
    __tablename__ = "product"

    id = Column(Integer, primary_key=True, index=True)
    created_by = Column(Integer, ForeignKey(User.id), nullable=False)
    name = Column(String)
    description = Column(Text)
    price = Column(Float)




class ShoppingCartItem(Base):
    __tablename__ = "shopping_cart_items"
    id = Column(Integer, primary_key=True)
    shopping_cart_id = Column(Integer, ForeignKey("shopping_cart.id"))
    product_id = Column(Integer, ForeignKey("product.id"))

    shopping_cart = relationship("ShoppingCart", back_populates="items")
    product = relationship("Product")


class ShoppingCart(Base):
    __tablename__ = "shopping_cart"

    id = Column(Integer, primary_key=True, index=True)
    owner = Column(Integer, ForeignKey(User.id), nullable=False)

    items = relationship("ShoppingCartItem", back_populates="shopping_cart", cascade="all, delete-orphan")