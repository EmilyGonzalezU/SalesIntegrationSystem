from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from src.modules.inventory import models, schemas
from database.connection import get_db
from src.modules.sales import reports_utils
from typing import List
from datetime import date

router = APIRouter(
    prefix="/admin",
    tags=["ADMINISTRATION & Reports"]
)

# ------------------------------------------------------------------------
# GESTIÓN DE CAJEROS (CRUD Básico)
# ------------------------------------------------------------------------
# Estas rutas permiten al administrador registrar y visualizar a los cajeros.

@router.post("/cashiers/", response_model=schemas.CashierRead)
def create_cashier_route(cashier: schemas.CashierCreate, db: Session = Depends(get_db)):
    """[ADMIN] Registra un nuevo cajero en el sistema."""
    # Nota: La normalización del RUT ocurre en el modelo o en la lógica de negocio.
    db_cashier = models.Cashier(**cashier.model_dump())
    db_cashier.rut = db_cashier.rut.replace('.', '').replace('-', '').upper()
    
    db.add(db_cashier)
    db.commit()
    db.refresh(db_cashier)
    return db_cashier

@router.get("/cashiers/", response_model=List[schemas.CashierRead])
def read_cashiers_route(db: Session = Depends(get_db)):
    """[ADMIN] Obtiene la lista completa de cajeros."""
    return db.query(models.Cashier).all()

# ------------------------------------------------------------------------
# GESTIÓN DE TASA DE IVA (MODIFICACIÓN)
# ------------------------------------------------------------------------

@router.put("/tax_rate/iva", response_model=schemas.TaxRateRead)
def update_iva_rate_route(new_rate: schemas.TaxRateUpdate, db: Session = Depends(get_db)):
    """[ADMIN] Permite al administrador actualizar la tasa de IVA."""
    iva_rate = db.query(models.TaxRate).filter(models.TaxRate.name == "IVA_ESTANDAR").first()

    if not iva_rate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Configuración de IVA no encontrada.")
    
    iva_rate.rate = new_rate.rate
    db.commit()
    db.refresh(iva_rate)
    return iva_rate

# ------------------------------------------------------------------------
# REPORTES Y DASHBOARD
# ------------------------------------------------------------------------

@router.get("/reports/daily_sales", tags=["Reports"])
def get_daily_report_route(
    target_date: date = Query(default=date.today(), description="Fecha para el reporte de ventas (AAAA-MM-DD)."),
    db: Session = Depends(get_db)
):
    """
    [ADMIN] Genera un reporte detallado de ventas para un día específico.
    """
    return reports_utils.get_daily_sales_report(db, target_date)

@router.get("/reports/low_stock", response_model=List[schemas.ProductRead], tags=["Reports"])
def get_low_stock_route(db: Session = Depends(get_db)):
    """
    [ADMIN] Alerta de Reabastecimiento: Obtiene productos con stock bajo o igual al stock mínimo.
    """
    return reports_utils.get_low_stock_products(db)


# ------------------- RUTAS DE GESTIÓN ADMINISTRATIVA (CRUD Cajeros) -------------------
# Estas rutas deberían estar protegidas por JWT de Administrador

@router.post("/admin/cashiers/", response_model=schemas.CashierRead, status_code=status.HTTP_201_CREATED)
def create_cashier_route(cashier: schemas.CashierCreate, db: Session = Depends(get_db)):
    """[ADMIN] Crea un nuevo perfil de cajero."""
    db_cashier = user_crud.get_cashier_by_rut(db, rut=cashier.rut)
    if db_cashier:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="RUT ya registrado.")
    return user_crud.create_cashier(db=db, cashier=cashier)

@router.get("/admin/cashiers/", response_model=List[schemas.CashierRead])
def read_cashiers_route(db: Session = Depends(get_db)):
    """[ADMIN] Obtiene la lista completa de cajeros."""
    return user_crud.get_all_cashiers(db)

@router.put("/admin/cashiers/{cashier_id}", response_model=schemas.CashierRead)
def update_cashier_route(cashier_id: int, cashier_update: schemas.CashierUpdate, db: Session = Depends(get_db)):
    """[ADMIN] Actualiza el nombre o el estado de un cajero."""
    db_cashier = user_crud.get_cashier(db, cashier_id=cashier_id)
    if not db_cashier:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cajero no encontrado.")
    
    return user_crud.update_cashier(db, db_cashier=db_cashier, cashier_update=cashier_update)

@router.delete("/admin/cashiers/{cashier_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cashier_route(cashier_id: int, db: Session = Depends(get_db)):
    """[ADMIN] Elimina un cajero (físico)."""
    user_crud.delete_cashier(db, cashier_id)
    return