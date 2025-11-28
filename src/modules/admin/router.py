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