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

# ------------------------------------------------------------------------
# LOGIN CAJERO (Flujo Rápido POS)
# ------------------------------------------------------------------------

@router.post("/cashier_validate_rut/", response_model=schemas.CashierRead)
def validate_cashier_rut(cashier_login: schemas.CashierLogin, db: Session = Depends(get_db)):
    """Verifica si el cajero existe y está activo (solo RUT)."""
    rut_to_check = cashier_login.rut.replace('.', '').replace('-', '').upper()

    cashier = db.query(models.Cashier).filter(
        models.Cashier.rut == rut_to_check,
        models.Cashier.is_active == True
    ).first()

    if not cashier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cajero no encontrado o inactivo."
        )

    return cashier

# ------------------------------------------------------------------------
# LOGIN ADMINISTRADOR (Flujo Seguro con Contraseña - Para acceso al Dashboard)
# ------------------------------------------------------------------------

@router.post("/admin_login/", response_model=schemas.AdminRead)
def admin_login(admin_login: schemas.AdminLogin, db: Session = Depends(get_db)):
    """Verifica las credenciales de administrador (usuario y contraseña)."""
    admin = db.query(models.Admin).filter(models.Admin.username == admin_login.username).first()

    # Verifica que el usuario exista y que la contraseña coincida con el hash
    if not admin or not verify_password(admin_login.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales de administrador inválidas."
        )
    if not admin.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cuenta de administrador inactiva.")

    return admin

@router.post("/admin_create/", response_model=schemas.AdminRead)
def create_admin_account(admin: schemas.AdminCreate, db: Session = Depends(get_db)):
    """[SETUP] Crea una cuenta de administrador inicial (SOLO SETUP)."""
    admin_count = db.query(models.Admin).count()
    if admin_count > 0:
         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Ya existe una cuenta de administrador.")

    hashed_password = get_password_hash(admin.password)
    
    db_admin = models.Admin(
        username=admin.username,
        name=admin.name,
        hashed_password=hashed_password
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin