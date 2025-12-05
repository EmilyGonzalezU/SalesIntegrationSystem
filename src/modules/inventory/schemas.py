from pydantic import BaseModel, ConfigDict, Field, field_validator
from typing import Optional, List
from datetime import datetime
import re

# ====================================================================
# GESTIÓN DE INVENTARIO
# ====================================================================

# Esquemas de Categorías
class CategoryCreate(BaseModel):
    name: str
    is_weighted: bool = False

class CategoryRead(CategoryCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)

# Esquemas de Productos
class ProductCreate(BaseModel):
    bar_code: Optional[str] = None
    name: str
    category_id: int
    description: Optional[str] = None
    brand: str
    stock: float
    min_stock: float
    price: float
    discount: Optional[float] = None
    is_iva_exempt: bool = False

class ProductRead(ProductCreate):
    id: int
    category: Optional[CategoryRead] = None 
    model_config = ConfigDict(from_attributes=True)

# ====================================================================
# GESTIÓN DE CAJEROS (CON VALIDACIONES)
# ====================================================================

# Esquema Base de Cajero
class CashierBase(BaseModel):
    name: str
    rut: str 
    is_active: bool = True 

    # --- VALIDACIONES DE SEGURIDAD Y FORMATO ---

    @field_validator('name')
    def name_must_be_text(cls, v):
        # Permite letras (a-z), espacios y tildes/ñ
        if not re.match(r'^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$', v):
            raise ValueError('El nombre solo debe contener letras')
        return v

    @field_validator('rut')
    def validate_rut_format(cls, v):
        # 1. Limpiar el RUT (quitar puntos y espacios)
        clean_rut = v.replace('.', '').replace(' ', '').strip().upper()
        
        # ✨ CORRECCIÓN: Si el RUT viene sin guion (de la BD o input), lo formateamos
        if '-' not in clean_rut and len(clean_rut) > 1:
            clean_rut = f"{clean_rut[:-1]}-{clean_rut[-1]}"
        
        # 2. Verificar formato básico (Números + Guion + Digito/K)
        if not re.match(r'^[0-9]+-[0-9K]$', clean_rut):
            raise ValueError('El RUT debe tener formato válido (ej: 12345678-9)')
        
        # 3. Validación Matemática (Módulo 11) - Verificar que el RUT sea real
        try:
            rut_body, dv = clean_rut.split('-')
            rut_int = int(rut_body)
        except ValueError:
             raise ValueError('Formato de RUT inválido')

        suma = 0
        multiplo = 2
        
        # Recorrer dígitos de derecha a izquierda
        for d in reversed(str(rut_int)):
            suma += int(d) * multiplo
            multiplo += 1
            if multiplo > 7:
                multiplo = 2
        
        expected_dv_int = 11 - (suma % 11)
        
        if expected_dv_int == 11:
            expected_char = '0'
        elif expected_dv_int == 10:
            expected_char = 'K'
        else:
            expected_char = str(expected_dv_int)
            
        if dv != expected_char:
            raise ValueError('El RUT no es válido (Dígito verificador incorrecto)')
        
        return clean_rut
# Esquema para crear un cajero
class CashierCreate(CashierBase):
    pass

# Esquema para leer un cajero
class CashierRead(CashierBase):
    id: int
    # is_active se hereda
    model_config = ConfigDict(from_attributes=True)

class CashierLogin(BaseModel):
    rut: str = Field(..., description="RUT o identificación del cajero para iniciar sesión.")

class CashierUpdate(BaseModel):
    name: str
    is_active: bool

# ====================================================================
# GESTIÓN DE ADMINISTRADORES
# ====================================================================

class AdminBase(BaseModel):
    username: str
    name: str

class AdminCreate(AdminBase):
    password: str 

class AdminRead(AdminBase):
    id: int
    is_active: bool
    model_config = ConfigDict(from_attributes=True)

class AdminLogin(BaseModel):
    username: str
    password: str 

# ====================================================================
# CONFIGURACIÓN DE IMPUESTOS
# ====================================================================

class TaxRateBase(BaseModel):
    rate: float = Field(..., description="Tasa del impuesto en formato decimal (ej: 0.19).", ge=0.0)

class TaxRateUpdate(TaxRateBase):
    pass

class TaxRateRead(TaxRateBase):
    id: int
    name: str
    last_updated: datetime
    model_config = ConfigDict(from_attributes=True)

# ====================================================================
# VENTAS
# ====================================================================

class SaleDetailBase(BaseModel):
    product_id: int
    quantity: float 

class SaleDetailCreate(SaleDetailBase):
    pass

class SaleDetailRead(SaleDetailBase):
    id: int
    price_at_sale: float
    subtotal: float
    iva_percentage_at_sale: float
    iva_amount: float
    model_config = ConfigDict(from_attributes=True)

class SaleCreate(BaseModel):
    details: List[SaleDetailCreate] 
    cashier_id: int 
    
class SaleRead(BaseModel):
    id: int
    sale_date: datetime
    cashier_id: int
    net_amount: float
    iva_total: float
    total_amount: float
    details: List[SaleDetailRead] 
    model_config = ConfigDict(from_attributes=True)