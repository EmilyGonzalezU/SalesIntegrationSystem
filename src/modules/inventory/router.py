from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from . import crud, schemas
from database.connection import get_db

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory Management"]
)

@router.post("/categories/", response_model=schemas.CategoryRead)
def create_category_route(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    return crud.create_category(db=db, category=category)

@router.get("/categories/", response_model=List[schemas.CategoryRead])
def read_categories_route(db: Session = Depends(get_db)):
    return crud.get_categories(db=db)

@router.post("/products/", response_model=schemas.ProductRead)
def create_product_route(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db=db, product=product)

@router.get("/products/", response_model=List[schemas.ProductRead])
def read_products_route(query: str = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    if query:
        return crud.search_products(db=db, query=query)
    
    products = crud.get_products(db=db, skip=skip, limit=limit)
    return products