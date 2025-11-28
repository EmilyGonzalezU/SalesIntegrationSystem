from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from . import crud, schemas
from database.connection import get_db

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory Management"]
)

# --- RUTAS DE CATEGORÍA ---
# Estas ya existen y son usadas por el Administrador para crear nuevas categorías.
@router.post("/categories/", response_model=schemas.CategoryRead)
def create_category_route(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    return crud.create_category(db=db, category=category)

@router.get("/categories/", response_model=List[schemas.CategoryRead])
def read_categories_route(db: Session = Depends(get_db)):
    return crud.get_categories(db=db)

# --- RUTAS DE PRODUCTO (CRUD COMPLETO) ---

@router.post("/products/", response_model=schemas.ProductRead)
def create_product_route(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    """Crea un nuevo producto (Usado por Admin)."""
    return crud.create_product(db=db, product=product)

@router.get("/products/", response_model=List[schemas.ProductRead])
def read_products_route(query: str = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Lista productos para el cajero y el administrador, con búsqueda rápida.
    """
    if query:
        return crud.search_products(db=db, query=query)
    
    products = crud.get_products(db=db, skip=skip, limit=limit)
    return products

@router.put("/products/{product_id}", response_model=schemas.ProductRead)
def update_product_route(product_id: int, product_update: schemas.ProductCreate, db: Session = Depends(get_db)):
    """[ADMIN] Modifica los detalles de un producto existente."""
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    
    # Itera sobre los campos actualizados y asigna los nuevos valores
    for key, value in product_update.model_dump(exclude_unset=True).items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_route(product_id: int, db: Session = Depends(get_db)):
    """[ADMIN] Elimina un producto por su ID."""
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    
    db.delete(db_product)
    db.commit()
    return