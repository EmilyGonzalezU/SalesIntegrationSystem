# src/modules/inventory/models.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database.connection import Base

# 1. Modelo para Categorías (ej: Carnes, Fiambres)
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)

    products = relationship("Product", back_populates="category")

# 2. Modelo para Productos
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    bar_code = Column(String, index=True, nullable=False)
    name = Column(String, index=True, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="products")
    description = Column(String, index=True, nullable=True)
    brand = Column(String, index=True, nullable=False)
    stock = Column(Integer, default=0) 
    min_stock = Column(Integer, default=0)
    price = Column(Float, nullable=False)
    discount = Column(Float, nullable=True)
    

