# src/modules/inventory/schemas.py
from pydantic import BaseModel, ConfigDict
from typing import Optional

# Esquema para Categorías
class CategoryCreate(BaseModel):
    name: str

class CategoryRead(CategoryCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)

# Esquema para Productos
class ProductCreate(BaseModel):
    bar_code: str
    name: str
    category_id: int
    description: str
    brand: str
    stock: int
    min_stock: int
    price: float
    discount: float
    
class ProductRead(ProductCreate):
    id: int
    category: Optional[CategoryRead] = None 
    model_config = ConfigDict(from_attributes=True)