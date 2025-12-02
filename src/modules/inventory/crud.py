from sqlalchemy.orm import Session, joinedload 
from . import models, schemas
from typing import List

# --- Lógica CRUD para Categorías ---

def create_category(db: Session, category: schemas.CategoryCreate) -> models.Category:
    """[ADMIN] Crea una nueva categoría."""
    db_category = models.Category(name=category.name, is_weighted=category.is_weighted)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_categories(db: Session) -> List[models.Category]:
    """Obtiene todas las categorías."""
    return db.query(models.Category).all()

def get_category(db: Session
, category_id: int) -> models.Category | None:
    """Obtiene una categoría por ID."""
    # Necesaria para las rutas PUT y DELETE
    return db.query(models.Category).filter(models.Category.id == category_id).first()

def update_category(db: Session, db_category: models.Category, category_update: schemas.CategoryCreate) -> models.Category:
    """[ADMIN] Actualiza una categoría existente."""
    db_category.name = category_update.name
    db.commit()
    db.refresh(db_category)
    return db_category

def delete_category(db: Session, db_category: models.Category):
    """[ADMIN] Elimina una categoría."""
    db.delete(db_category)
    db.commit()


# --- CRUD Productos y Búsqueda ---
def create_product(db: Session, product: schemas.ProductCreate) -> models.Product:
    """[ADMIN] Crea un nuevo producto."""
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_product(db: Session, product_id: int) -> models.Product | None:
    """Obtiene un producto por ID."""
    return db.query(models.Product).options(joinedload(models.Product.category)).filter(models.Product.id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100) -> List[models.Product]:
    """Obtiene una lista de productos para el listado del Admin o POS."""
    return db.query(models.Product).options(joinedload(models.Product.category)).offset(skip).limit(limit).all()

def search_products(db: Session, query: str) -> List[models.Product]:
    """Busca productos cuyo nombre contenga la consulta (insensible a mayúsculas/minúsculas)."""
    return db.query(models.Product).options(joinedload(models.Product.category)).filter(
        models.Product.name.ilike(f"%{query}%")
    ).all()