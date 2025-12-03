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
    db_category.is_weighted = category_update.is_weighted
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

def get_product(db: Session, id: int) -> models.Product | None: # <-- Usamos 'id' aquí
    """Obtiene un producto por ID."""
    return db.query(models.Product).options(joinedload(models.Product.category)).filter(models.Product.id == id).first()

def update_product(db: Session, db_product: models.Product, product_update: schemas.ProductCreate) -> models.Product:
    """[ADMIN] Actualiza los campos de un producto existente."""
    
    update_data = product_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        if key != "id": 
            setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

def get_products(db: Session, skip: int = 0, limit: int = 100) -> List[models.Product]:
    """Obtiene una lista de productos para el listado del Admin o POS."""
    return db.query(models.Product).options(joinedload(models.Product.category)).offset(skip).limit(limit).all()

def search_products(db: Session, query: str) -> List[models.Product]:
    """Busca productos cuyo nombre contenga la consulta (insensible a mayúsculas/minúsculas)."""
    return db.query(models.Product).options(joinedload(models.Product.category)).filter(
        models.Product.name.ilike(f"%{query}%")
    ).all()

def get_cashier(db: Session, cashier_id: int) -> models.Cashier | None:
    """Obtiene un cajero por ID."""
    return db.query(models.Cashier).filter(models.Cashier.id == cashier_id).first()

def get_cashier_by_rut(db: Session, rut: str) -> models.Cashier | None:
    """Obtiene un cajero por RUT para el login."""
    return db.query(models.Cashier).filter(models.Cashier.rut == rut).first()

def get_all_cashiers(db: Session) -> List[models.Cashier]:
    """Obtiene todos los cajeros para la vista administrativa."""
    return db.query(models.Cashier).all()

def create_cashier(db: Session, cashier: schemas.CashierCreate) -> models.Cashier:
    """[ADMIN] Crea un nuevo perfil de cajero."""
    
    # Simplicidad: Ahora usamos el valor de is_active que viene en el esquema
    db_cashier = models.Cashier(
        name=cashier.name,
        rut=cashier.rut,
        is_active=cashier.is_active # ✨ USAR EL VALOR ENVIADO POR EL FORMULARIO
    )
    db.add(db_cashier)
    db.commit()
    db.refresh(db_cashier)
    return db_cashier


def update_cashier(db: Session, db_cashier: models.Cashier, cashier_update: schemas.CashierUpdate) -> models.Cashier:
    """[ADMIN] Actualiza los campos de un cajero existente."""
    
    # Itera sobre los campos actualizados y asigna los nuevos valores
    update_data = cashier_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        # Excluimos el RUT de la actualización ya que debe ser inmutable
        if key != "rut": 
            setattr(db_cashier, key, value)
    
    db.commit()
    db.refresh(db_cashier)
    return db_cashier

def delete_cashier(db: Session, cashier_id: int):
    """[ADMIN] Elimina un cajero por ID."""
    db_cashier = get_cashier(db, cashier_id)
    if db_cashier:
        db.delete(db_cashier)
        db.commit()