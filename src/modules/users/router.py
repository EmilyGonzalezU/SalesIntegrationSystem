from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.modules.inventory import models, schemas
from database.connection import get_db
# Importamos las utilidades de cifrado para el login seguro de Admin
from .auth_utils import get_password_hash, verify_password 

router = APIRouter(
    prefix="/auth", # CAMBIADO: Ahora se llama /auth para englobar Login de Cajero y Admin
    tags=["Auth & Login"]
)

# 
@router.post("/auth/cashier_validate_rut/", response_model=schemas.CashierRead)
def validate_cashier_rut(cashier_login: schemas.CashierLogin, db: Session = Depends(get_db)):
    """Valida el RUT del cajero para iniciar la sesión POS."""
    cashier = user_crud.get_cashier_by_rut(db, rut=cashier_login.rut)
    if not cashier or not cashier.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="RUT o Cajero inactivo.")
    
    return cashier

