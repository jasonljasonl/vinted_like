import os
import sys
from datetime import datetime

from sqlalchemy.orm import relationship

from backend.accounts.models import User
from backend.base_models.base import Base

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime


class ProductImage(Base):
    __tablename__ = "product_image"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False)
    url = Column(String, nullable=False)

    product = relationship("Product", back_populates="product_images")
    extend_existing = True


class Product(Base):
    __tablename__ = "product"

    id = Column(Integer, primary_key=True, index=True)
    created_by = Column(Integer, ForeignKey(User.id), nullable=False)
    name = Column(String)
    description = Column(Text)
    price = Column(Float)
    product_images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    extend_existing = True

class ShoppingCartItem(Base):
    __tablename__ = "shopping_cart_items"
    id = Column(Integer, primary_key=True)
    shopping_cart_id = Column(Integer, ForeignKey("shopping_cart.id"))
    product_id = Column(Integer, ForeignKey("product.id"))

    shopping_cart = relationship("ShoppingCart", back_populates="items")
    product = relationship("Product")
    extend_existing = True


class ShoppingCart(Base):
    __tablename__ = "shopping_cart"

    id = Column(Integer, primary_key=True, index=True)
    owner = Column(Integer, ForeignKey(User.id), nullable=False)

    items = relationship("ShoppingCartItem", back_populates="shopping_cart", cascade="all, delete-orphan")
    total_amount = Column(Float, default=0.0)
    orders = relationship('UserOrder', back_populates='related_shopping_cart')
    extend_existing = True


class UserOrder(Base):
    __tablename__ = 'user_order'

    id = Column(Integer, primary_key=True,  index=True)
    buyer = Column(Integer, ForeignKey(User.id), nullable=False)
    shopping_cart_id = Column(Integer, ForeignKey(ShoppingCart.id), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    related_shopping_cart = relationship('ShoppingCart')
    buyer_user = relationship('User', back_populates='orders')
    extend_existing = True
