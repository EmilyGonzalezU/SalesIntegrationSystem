from sqlalchemy.orm import Session
from . import models, schemas
from typing import List

def create_category(db: Session, category: schemas.CategoryCreate) -> models.Category:
    db_category = models.Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_categories(db: Session) -> List[models.Category]:
    return db.query(models.Category).all()

# --- CRUD Productos y Búsqueda ---
def create_product(db: Session, product: schemas.ProductCreate) -> models.Product:
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_product(db: Session, product_id: int) -> models.Product | None:
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100) -> List[models.Product]:
    return db.query(models.Product).offset(skip).limit(limit).all()

def search_products(db: Session, query: str) -> List[models.Product]:
    return db.query(models.Product).filter(
        models.Product.name.ilike(f"%{query}%")
    ).all()